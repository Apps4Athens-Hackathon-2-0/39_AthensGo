# Streaming Day-by-Day Itinerary Generation Guide

## Overview

This implementation adds a streaming approach to itinerary generation that:
1. **Fixes the bug** where only day 1 was generated despite instructions to generate all days
2. **Improves UX** by streaming each day as it's generated instead of waiting for all days

## Architecture Changes

### 1. Single-Day Generation Schema
New schemas added to support generating one day at a time:
- `GenerateSingleDayInputSchema` - Input for generating a single day
- `SingleDayOutputSchema` - Output for a single day
- `SingleDayPromptOutputSchema` - Union of SingleDayOutputSchema or null

### 2. Single-Day Prompt (`generateSingleDayPrompt`)
A focused prompt that generates activities for ONE day:
- Takes day number and total days as input
- Receives consolidated context from previous days (place names only)
- Uses `findAthensPlaceDetails` tool for every place
- Generates 3-5 activities for "relaxed" or 5-7 for "packed" style

### 3. Refactored Flow (`generatePersonalizedItineraryFlow`)
Changed from single-prompt to sequential loop approach:
```typescript
// OLD: Single prompt for all days (was only generating day 1)
const { output } = await generatePersonalizedItineraryPrompt(input);

// NEW: Loop through days, generate each separately
for (let dayNum = 1; dayNum <= input.numberOfDays; dayNum++) {
  const { output } = await generateSingleDayPrompt({
    // ... parameters including previousDaysContext
  });
  allDays.push(output);
  // Build context with place names for next day
  previousDaysContext += `Day ${dayNum}: ${placeNames}. `;
}
```

### 4. Streaming Service Method (`generateItineraryStream`)
New method in `ai.service.ts` that returns an Observable:
- Generates days sequentially in a loop
- Emits each day immediately via `subscriber.next()`
- Includes progress tracking (current/total days)
- Handles errors gracefully

### 5. SSE Controller Endpoint
New endpoint using NestJS `@Sse` decorator:
```typescript
@Sse("generate-itinerary-stream")
generateItineraryStream(@Body() dto: GeneratePersonalizedItineraryDto)
```

## Context Consolidation Strategy

### What Gets Passed Between Days
Only **place names** from previous days:
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
1. **Lightweight**: ~50-100 characters per day vs. 5KB+ with full data
2. **Sufficient**: Place names alone prevent repetition
3. **No LLM needed**: Simple string concatenation
4. **Fast**: No extra API calls or processing

## API Endpoints

### Non-Streaming (Batch) - Existing
```
POST /ai/generate-personalized-itinerary
```
- Returns complete itinerary after all days are generated
- Now uses the improved sequential loop approach
- Fixes the bug where only day 1 was generated

### Streaming (SSE) - New
```
GET /ai/generate-itinerary-stream
```
- Returns Server-Sent Events stream
- Each day sent as soon as it's generated
- Includes progress information

## Testing

### Manual Test with curl

```bash
# Terminal 1: Start backend
cd /home/runner/work/39_AthensGo/39_AthensGo/projects/backend
npm run start:dev

# Terminal 2: Test streaming endpoint
curl -N -X GET "http://localhost:3000/ai/generate-itinerary-stream?tripDates=2025-11-15%20to%202025-11-20&numberOfDays=5&budget=medium&interests=history%2C%20food%2C%20and%20nightlife&travelStyle=relaxed&companionType=couple&accessibilityNeeds=true"
```

**Expected Output:**
```
data: {"day":1,"items":[...],"progress":{"current":1,"total":5}}

data: {"day":2,"items":[...],"progress":{"current":2,"total":5}}

data: {"day":3,"items":[...],"progress":{"current":3,"total":5}}

data: {"day":4,"items":[...],"progress":{"current":4,"total":5}}

data: {"day":5,"items":[...],"progress":{"current":5,"total":5}}
```

### Mobile App Integration (React Native)

```typescript
import EventSource from "react-native-sse";

const generateItinerary = async (preferences) => {
  const eventSource = new EventSource(
    'http://localhost:3000/ai/generate-itinerary-stream',
    {
      method: 'GET',
      params: preferences, // URL query params
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

## Error Handling

### Non-Streaming
If any day fails to generate, the entire request fails with an error message indicating which day failed.

### Streaming
If day 3 fails:
- User has days 1-2 already received and displayed
- Error event sent via SSE
- User can retry or accept partial itinerary

## Performance Comparison

### Before (Single Prompt - Buggy)
```
Request → Wait 5 minutes → Get only day 1 (BUG)
User sees: Loading spinner, then incomplete result
```

### After Non-Streaming (Fixed)
```
Request → Wait ~2.5 minutes → Get all 5 days
User sees: Loading spinner, then complete result
```

### After Streaming (Best UX)
```
Request → Day 1 (30s) → Day 2 (30s) → Day 3 (30s) → Day 4 (30s) → Day 5 (30s)
User sees: Day 1 at 30s, Day 2 at 1min, etc.
Total time: ~2.5 minutes, but user engaged throughout
```

## Benefits

### For Users
- ✅ **Immediate feedback** - See results as they're generated
- ✅ **Progress visibility** - Know how much is left (e.g., "Day 3 of 5...")
- ✅ **Better perceived performance** - Feels faster than waiting
- ✅ **Early interaction** - Can start reading day 1 while day 2 generates

### For System
- ✅ **Reliable generation** - Each day is a separate, focused task
- ✅ **No repetition** - Context prevents duplicate suggestions
- ✅ **Better error handling** - Know exactly which day failed
- ✅ **Scalable** - Works for 3-day or 10-day trips equally well

### For Development
- ✅ **Easier debugging** - Can test single-day generation
- ✅ **Better monitoring** - Track which days succeed/fail
- ✅ **Flexible** - Can add parallel generation later if needed

## Migration Strategy

### Phase 1: Non-Streaming Fixed (✅ Complete)
- Updated flow to generate day-by-day
- Keep existing endpoint structure
- All days now generated correctly

### Phase 2: Add Streaming Endpoint (✅ Complete)
- New streaming endpoint added
- Mobile app can choose which to use
- Ready for testing

### Phase 3: Mobile App Migration (Pending)
- Update mobile app to use streaming endpoint
- Test in development
- Monitor for issues

### Phase 4: Optimize (Future)
- Add caching for common requests
- Implement parallel day generation (if needed)
- Add retry logic for failed days

## Security Considerations

1. **API Keys**: Ensure Google Maps API key and Gemini API key are properly configured
2. **Rate Limiting**: Consider adding rate limiting to prevent abuse
3. **Input Validation**: DTOs validate all inputs with class-validator
4. **Error Handling**: Sensitive information not exposed in error messages

## Troubleshooting

### Problem: Stream disconnects
**Solution**: Check network stability, implement reconnection logic in client

### Problem: Days generated slowly
**Solution**: 
- Check Gemini API quota/rate limits
- Optimize prompt if needed
- Consider parallel generation (future enhancement)

### Problem: Duplicate places across days
**Solution**: Check that previousDaysContext is being built correctly and passed to each day's prompt

### Problem: Missing enrichment data
**Solution**: Verify that `findAthensPlaceDetails` tool is being called for every place

## Future Enhancements

1. **Caching**: Cache common itineraries to reduce API calls
2. **Parallel Generation**: Generate multiple days in parallel with concurrency control
3. **Retry Logic**: Automatic retry for failed days
4. **Cancellation**: Allow users to cancel mid-stream
5. **Metrics**: Track generation times and success rates
6. **Partial Day Retry**: Endpoint to regenerate a specific day

## Related Files

- `src/ai/flows/generate-personalized-itinerary.flow.ts` - Core generation logic
- `src/ai/ai.service.ts` - Service layer with streaming method
- `src/ai/ai.controller.ts` - REST and SSE endpoints
- `src/ai/dto/generate-personalized-itinerary.dto.ts` - Input validation
- `src/ai/tools/google-maps.tool.ts` - Place enrichment tool
