/**
 * @fileOverview AI agent that generates a personalized itinerary for a trip to Athens.
 *
 * - generatePersonalizedItinerary - A function that generates a personalized itinerary.
 * - GeneratePersonalizedItineraryInput - The input type for the generatePersonalizedItinerary function.
 * - GeneratePersonalizedItineraryOutput - The return type for the generatePersonalizedItinerary function.
 */

import { ai } from "../genkit";
import { findAthensPlaceDetails } from "../tools/google-maps.tool";
import { z } from "genkit";
import { computeAccessibilityScore } from "../tools/accessibility-score";

const GeneratePersonalizedItineraryInputSchema = z.object({
  tripDates: z.string().describe("The start and end dates of the trip."),
  numberOfDays: z.number().describe("The number of days for the trip."),
  budget: z
    .enum(["low", "medium", "high"])
    .describe("The budget for the trip."),
  interests: z.string().describe("The interests of the traveler."),
  travelStyle: z
    .enum(["relaxed", "packed"])
    .describe("The travel style of the traveler."),
  companionType: z
    .enum(["solo", "couple", "family", "friends"])
    .describe("The type of companions for the trip."),
  accessibilityNeeds: z
    .boolean()
    .optional()
    .describe("Whether the user has accessibility needs."),
});
export type GeneratePersonalizedItineraryInput = z.infer<
  typeof GeneratePersonalizedItineraryInputSchema
>;

// Fixed Schema
const ItineraryItemSchema = z.object({
  name: z
    .string()
    .describe("The name of the attraction, restaurant, or experience."),
  description: z.string().describe("A short description of the item."),
  category: z
    .string()
    .describe("The category of the item (cultural, culinary, scenic, etc.)."),
  // Flattened location fields
  latitude: z.number().describe("The latitude of the location."),
  longitude: z.number().describe("The longitude of the location."),
  enrichment: z
    .object({
      rating: z.number().nullable().optional(),
      userRatingsTotal: z.number().nullable().optional(),
      priceLevel: z.number().nullable().optional(),
      priceString: z.string().nullable().optional(),
      websiteUrl: z.string().nullable().optional(),
      googleMapsUrl: z.string().nullable().optional(),
      isFoodPlace: z.boolean().optional(),
      accessibility: z
        .object({
          wheelchairAccessibleEntrance: z.boolean().nullable().optional(),
          wheelchairAccessibleRestroom: z.boolean().nullable().optional(),
          wheelchairAccessibleParking: z.boolean().nullable().optional(),
          wheelchairAccessibleSeating: z.boolean().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .optional(),
  accessibilityScore: z
    .number()
    .nullable()
    .optional()
    .describe("0-100 general accessibility score based on place attributes."),
});

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itinerary: z
    .array(
      z.object({
        day: z.number().describe("The day number in the itinerary."),
        items: z
          .array(ItineraryItemSchema)
          .describe("The list of itinerary items for the day."),
      }),
    )
    .describe("The generated personalized itinerary."),
});
export type GeneratePersonalizedItineraryOutput = z.infer<
  typeof GeneratePersonalizedItineraryOutputSchema
>;

export type ItineraryItem = z.infer<typeof ItineraryItemSchema>;

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

export async function generatePersonalizedItinerary(
  input: GeneratePersonalizedItineraryInput,
): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

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
        throw new Error(`Failed to generate day ${dayNum}. Please try again.`);
      }

      allDays.push(output);

      // Post-process to compute accessibilityScore if user has accessibility needs
      if (input.accessibilityNeeds) {
        for (const item of output.items) {
          const attrs = item.enrichment?.accessibility ?? null;
          item.accessibilityScore = computeAccessibilityScore(attrs);
        }
      }

      // Build consolidated context (only day # and place names, no full enrichment)
      const placeNames = output.items.map((item) => item.name).join(", ");
      previousDaysContext += `Day ${dayNum}: ${placeNames}. `;
    }

    return { itinerary: allDays };
  },
);
