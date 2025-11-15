# Streaming Day-by-Day Itinerary Generation Implementation Plan

## Problem Statement

The current implementation has two major issues:
1. The AI only generates day 1 despite explicit instructions to generate all days
2. The mobile app must wait for the entire itinerary to be generated (5+ minutes for a 5-day trip)

## Solution Overview

Implement a streaming approach where:
1. Each day is generated separately in a sequential loop
2. Each day is sent to the mobile app immediately upon generation
3. Each day receives consolidated context from previous days (place names only)
4. No LLM-based summarization - just extract place names from previous days

## Implementation Steps

### Step 1: Update Flow File - Add Single Day Schemas

**File:** `src/ai/flows/generate-personalized-itinerary.flow.ts`

**Location:** After line 73 (after `GeneratePersonalizedItineraryOutputSchema`)

**Add:**

```typescript
// Schema for generating a single day
const GenerateSingleDayInputSchema = z.object({
  tripDates: z.string(),
  dayNumber: z.number().describe("Which day of the trip (1, 2, 3, etc.)"),
  totalDays: z.number().describe("Total number of days in the trip"),
  budget: z.enum(["low", "medium", "high"]),
  interests: z.string(),
  travelStyle: z.enum(["relaxed", "packed"]),
  companionType: z.enum(["solo", "couple", "family", "friends"]),
  accessibilityNeeds: z.boolean().optional(),
  previousDaysContext: z
    .string()
    .optional()
    .describe(
      "Consolidated context: day numbers and place names from previous days to avoid repetition",
    ),
});

const SingleDayOutputSchema = z.object({
  day: z.number(),
  items: z.array(ItineraryItemSchema),
});

const SingleDayPromptOutputSchema = z.union([SingleDayOutputSchema, z.null()]);
```

### Step 2: Add Single Day Prompt

**File:** `src/ai/flows/generate-personalized-itinerary.flow.ts`

**Location:** After the schemas, before `generatePersonalizedItineraryFlow`

**Add:**

```typescript
// Prompt for generating a single day
export const generateSingleDayPrompt = ai.definePrompt({
  name: "generateSingleDayPrompt",
  input: { schema: GenerateSingleDayInputSchema },
  output: {
    format: "json",
    schema: SingleDayPromptOutputSchema,
  },
  tools: [findAthensPlaceDetails],
  prompt: `You are a personal travel assistant for Athens, Greece.

Generate activities for DAY {{{dayNumber}}} of a {{{totalDays}}}-day trip.

REQUIREMENTS:
- Generate 3-5 activities for "relaxed", 5-7 for "packed" style
- Use 'findAthensPlaceDetails' for EVERY place (real coordinates + enrichment)
- Include meals: breakfast, lunch, dinner (with ratings, prices, Google Maps links)
- Budget "{{{budget}}}": low=free/cheap, medium=mid-range, high=premium
- If accessibilityNeeds is true, prioritize wheelchair-accessible venues
- AVOID repeating these places: {{{previousDaysContext}}}

Context:
- Day {{{dayNumber}}} of {{{totalDays}}}
- Dates: {{{tripDates}}}
- Budget: {{{budget}}}
- Interests: {{{interests}}}
- Style: {{{travelStyle}}}
- Companions: {{{companionType}}}
- Accessibility: {{{accessibilityNeeds}}}

Return JSON: { day: {{{dayNumber}}}, items: [...] }
`,
});
```

### Step 3: Keep Non-Streaming Flow (Optional)

**File:** `src/ai/flows/generate-personalized-itinerary.flow.ts`

**Location:** Replace the existing `generatePersonalizedItineraryFlow` implementation

**Replace with:**

```typescript
export const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: "generatePersonalizedItineraryFlow",
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async (input) => {
    const allDays: Array<{ day: number; items: ItineraryItem[] }> = [];
    let previousDaysContext = "";

    // Generate each day separately
    for (let dayNum = 1; dayNum <= input.numberOfDays; dayNum++) {
      const { output } = await generateSingleDayPrompt({
        tripDates: input.tripDates,
        dayNumber: dayNum,
        totalDays: input.numberOfDays,
        budget: input.budget,
        interests: input.interests,
        travelStyle: input.travelStyle,
        companionType: input.companionType,
        accessibilityNeeds: input.accessibilityNeeds,
        previousDaysContext,
      });

      if (!output || !Array.isArray(output.items)) {
        throw new Error(
          `Failed to generate day ${dayNum}. Please try again.`,
        );
      }

      allDays.push(output);

      // Build consolidated context (only day # and place names, no full enrichment)
      const placeNames = output.items.map((item) => item.name).join(", ");
      previousDaysContext += `Day ${dayNum}: ${placeNames}. `;
    }

    return { itinerary: allDays };
  },
);
```

### Step 4: Add Streaming Service Method

**File:** `src/ai/ai.service.ts`

**Add import at top:**

```typescript
import { Observable } from "rxjs";
```

**Add new method:**

```typescript
generateItineraryStream(
  dto: GeneratePersonalizedItineraryDto,
): Observable<MessageEvent> {
  return new Observable((subscriber) => {
    (async () => {
      try {
        let previousDaysContext = "";

        for (let dayNum = 1; dayNum <= dto.numberOfDays; dayNum++) {
          // Import dynamically to avoid circular dependency
          const { generateSingleDayPrompt } = await import(
            "./flows/generate-personalized-itinerary.flow"
          );

          const { output } = await generateSingleDayPrompt({
            tripDates: dto.tripDates,
            dayNumber: dayNum,
            totalDays: dto.numberOfDays,
            budget: dto.budget,
            interests: dto.interests,
            travelStyle: dto.travelStyle,
            companionType: dto.companionType,
            accessibilityNeeds: dto.accessibilityNeeds,
            previousDaysContext,
          });

          if (!output || !Array.isArray(output.items)) {
            subscriber.error(
              new Error(`Failed to generate day ${dayNum}`),
            );
            return;
          }

          // Send this day immediately to the client
          subscriber.next({
            data: JSON.stringify({
              day: output.day,
              items: output.items,
              progress: {
                current: dayNum,
                total: dto.numberOfDays,
              },
            }),
          } as MessageEvent);

          // Build consolidated context (only place names, no enrichment data)
          const placeNames = output.items.map((item) => item.name).join(", ");
          previousDaysContext += `Day ${dayNum}: ${placeNames}. `;
        }

        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    })();
  });
}
```

### Step 5: Add Streaming Controller Endpoint

**File:** `src/ai/ai.controller.ts`

**Add import at top:**

```typescript
import { Sse } from "@nestjs/common";
import { Observable } from "rxjs";
```

**Add new endpoint:**

```typescript
@Sse("generate-itinerary-stream")
@ApiOperation({ summary: "Generate itinerary with streaming (day-by-day)" })
generateItineraryStream(
  @Body() dto: GeneratePersonalizedItineraryDto,
): Observable<MessageEvent> {
  return this.aiService.generateItineraryStream(dto);
}
```

### Step 6: Install RxJS (if not already installed)

```bash
cd /Users/cllupo/Documents/athensgo/projects/backend
bun add rxjs
```

## How Context Is Consolidated

### What Gets Passed Between Days

**Minimal Context (Place Names Only):**

```
Day 1: Acropolis Museum, Plaka Restaurant, Ancient Agora.
Day 2: National Archaeological Museum, Psiri Tavern, Lycabettus Hill.
```

### What Does NOT Get Passed

- Enrichment data (ratings, prices, URLs)
- Descriptions
- Categories
- Coordinates
- Accessibility scores

### Why This Works

1. **Lightweight:** Only ~50-100 characters per day vs. 5KB+ with full data
2. **Sufficient:** Place names alone prevent repetition
3. **No LLM needed:** Simple string concatenation
4. **Fast:** No extra API calls or processing

## Mobile App Integration

### EventSource Pattern (React Native)

```typescript
import EventSource from "react-native-sse";

const generateItinerary = async (preferences) => {
  const eventSource = new EventSource(
    'http://localhost:3000/ai/generate-itinerary-stream',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    }
  );

  const itinerary = [];

  eventSource.addEventListener('message', (event) => {
    const dayData = JSON.parse(event.data);
    
    console.log(`Day ${dayData.progress.current}/${dayData.progress.total} received`);
    
    // Add this day to state immediately
    itinerary.push({
      day: dayData.day,
      items: dayData.items,
    });
    
    // Update UI
    setItinerary([...itinerary]);
    setProgress(dayData.progress.current / dayData.progress.total);
  });

  eventSource.addEventListener('error', (error) => {
    console.error('Stream error:', error);
    eventSource.close();
  });

  eventSource.addEventListener('close', () => {
    console.log('Stream complete!');
    setLoading(false);
  });
};
```

### UI States

1. **Initial:** "Generating your personalized itinerary..."
2. **Day 1 arrives:** Show day 1, progress: 1/5 (20%)
3. **Day 2 arrives:** Show days 1-2, progress: 2/5 (40%)
4. **Day 3 arrives:** Show days 1-3, progress: 3/5 (60%)
5. **Day 4 arrives:** Show days 1-4, progress: 4/5 (80%)
6. **Day 5 arrives:** Show complete itinerary, progress: 5/5 (100%)

## Benefits

### For Users

✅ **Immediate feedback** - See results as they're generated  
✅ **Progress visibility** - Know how much is left (e.g., "Generating day 3 of 5...")  
✅ **Better perceived performance** - Feels faster than waiting  
✅ **Early interaction** - Can start reading day 1 while day 2 generates  

### For System

✅ **Reliable generation** - Each day is a separate, focused task  
✅ **No repetition** - Context prevents duplicate suggestions  
✅ **Better error handling** - Know exactly which day failed  
✅ **Scalable** - Works for 3-day or 10-day trips equally well  

### For Development

✅ **Easier debugging** - Can test single-day generation  
✅ **Better monitoring** - Track which days succeed/fail  
✅ **Flexible** - Can add parallel generation later if needed  

## Performance Comparison

### Before (All at Once)

```
Request → Wait 5 minutes → Get all 5 days (or fail)
User sees: Loading spinner for 5 minutes
```

### After (Streaming)

```
Request → Day 1 (30s) → Day 2 (30s) → Day 3 (30s) → Day 4 (30s) → Day 5 (30s)
User sees: Day 1 at 30s, Day 2 at 1min, etc.
Total time: ~2.5 minutes, but user engaged throughout
```

## Error Handling

### If Day 3 Fails

**Non-streaming:** Entire request fails, lose all data  
**Streaming:** User has days 1-2, shown error for day 3, can retry just day 3

### Implementation

```typescript
eventSource.addEventListener('error', (error) => {
  // Show error but keep days already received
  showAlert('Error', `Failed to generate remaining days. You have days 1-${itinerary.length}.`);
  setPartialItinerary(itinerary);
  setCanRetry(true);
});
```

## Testing

### Manual Test

```bash
# Terminal 1: Start backend
cd /Users/cllupo/Documents/athensgo/projects/backend
bun run start:dev

# Terminal 2: Test streaming endpoint
curl -N -X POST http://localhost:3000/ai/generate-itinerary-stream \
  -H "Content-Type: application/json" \
  -d '{
    "tripDates": "2025-11-15 to 2025-11-20",
    "numberOfDays": 5,
    "budget": "medium",
    "interests": "history, food, and nightlife",
    "travelStyle": "relaxed",
    "companionType": "couple",
    "accessibilityNeeds": true
  }'
```

**Expected Output:**

```
data: {"day":1,"items":[...],"progress":{"current":1,"total":5}}

data: {"day":2,"items":[...],"progress":{"current":2,"total":5}}

data: {"day":3,"items":[...],"progress":{"current":3,"total":5}}

data: {"day":4,"items":[...],"progress":{"current":4,"total":5}}

data: {"day":5,"items":[...],"progress":{"current":5,"total":5}}
```

### Automated Test

```typescript
describe('Itinerary Streaming', () => {
  it('should stream all days progressively', (done) => {
    const days = [];
    const eventSource = new EventSource(streamUrl);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      days.push(data);
      
      if (data.progress.current === data.progress.total) {
        expect(days).toHaveLength(5);
        expect(days[0].day).toBe(1);
        expect(days[4].day).toBe(5);
        done();
      }
    };
  });
});
```

## Rollout Strategy

### Phase 1: Implement Non-Streaming with Loop

- Update flow to generate day-by-day
- Keep existing endpoint structure
- Test that all days are generated
- **Goal:** Fix the "only day 1" issue

### Phase 2: Add Streaming Endpoint

- Add new streaming endpoint alongside existing
- Mobile app can choose which to use
- Test streaming in development
- **Goal:** Enable progressive loading

### Phase 3: Migrate Mobile App

- Update mobile app to use streaming endpoint
- Remove old non-streaming calls
- Monitor for issues
- **Goal:** Better UX in production

### Phase 4: Optimize

- Add caching for common requests
- Implement parallel day generation (if needed)
- Add retry logic for failed days
- **Goal:** Production-ready performance

## Alternative: Server-Sent Events (SSE)

NestJS `@Sse()` decorator automatically handles:
- Correct `Content-Type: text/event-stream` header
- Keep-alive pings
- Proper event formatting
- Client reconnection

No need for custom streaming logic!

## Summary

This implementation provides:
1. **Reliable multi-day generation** - Each day is a focused task
2. **Progressive loading** - Users see results immediately
3. **Consolidated context** - Lightweight place names prevent repetition
4. **Better UX** - No more long waits with no feedback
5. **Proper error handling** - Partial results on failure

Total implementation time: ~2-3 hours

