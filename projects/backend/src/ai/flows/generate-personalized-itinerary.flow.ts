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
      accessible: z
        .boolean()
        .nullable()
        .optional()
        .describe("Whether the place has wheelchair accessible entrance."),
    })
    .optional(),
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

// Allow the prompt to return null (when LLM fails) or the valid schema
const GeneratePersonalizedItineraryPromptOutputSchema = z.union([
  GeneratePersonalizedItineraryOutputSchema,
  z.null(),
]);

export type GeneratePersonalizedItineraryInput = z.infer<
  typeof GeneratePersonalizedItineraryInputSchema
>;
export type GeneratePersonalizedItineraryOutput = z.infer<
  typeof GeneratePersonalizedItineraryOutputSchema
>;
export type ItineraryItem = z.infer<typeof ItineraryItemSchema>;

export async function generatePersonalizedItinerary(
  input: GeneratePersonalizedItineraryInput,
): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const generatePersonalizedItineraryPrompt = ai.definePrompt({
  name: "generatePersonalizedItineraryPrompt",
  input: { schema: GeneratePersonalizedItineraryInputSchema },
  output: {
    format: "json",
    schema: GeneratePersonalizedItineraryPromptOutputSchema,
  },
  tools: [findAthensPlaceDetails],
  prompt: `You are a personal travel assistant specializing in creating itineraries for trips to Athens, Greece.

  Based on the traveler's preferences, generate a personalized itinerary.

  ⚠️ CRITICAL REQUIREMENTS - READ CAREFULLY:

  1. **GENERATE ALL DAYS**: You MUST create exactly {{{numberOfDays}}} days. If numberOfDays is 5, you must create day 1, day 2, day 3, day 4, AND day 5. EVERY day must have activities. DO NOT create empty days.

  2. **ACTIVITIES PER DAY**: 
     - "relaxed" travel style: 3-5 activities per day
     - "packed" travel style: 5-7 activities per day
     - EVERY day from 1 to {{{numberOfDays}}} must have this many activities.

  3. **USE THE TOOL**: For EVERY attraction, restaurant, or point of interest you suggest, you MUST use the 'findAthensPlaceDetails' tool to get its precise coordinates and enrichment data. Do not invent coordinates.

  4. **INCLUDE ENRICHMENT**: Include the complete "enrichment" object returned by the tool for each item: rating, userRatingsTotal, priceLevel, priceString, websiteUrl, googleMapsUrl, isFoodPlace, and the accessible flag (whether the venue has a wheelchair-accessible entrance).

  5. **FOOD PLACES**: For restaurants, cafes, and taverns, always include rating, price information, and Google Maps link.

  6. **BUDGET MATCHING**: 
     - "low": Free attractions, street food, cheap eats
     - "medium": Mid-range dining, paid attractions
     - "high": Premium experiences, fine dining

  7. **ACCESSIBILITY**: If accessibilityNeeds is TRUE, prioritize places with wheelchair-accessible entrances when available.

  Trip Details:
  - Dates: {{{tripDates}}}
  - Number of Days: {{{numberOfDays}}} (GENERATE THIS MANY DAYS!)
  - Budget: {{{budget}}}
  - Interests: {{{interests}}}
  - Travel Style: {{{travelStyle}}}
  - Companions: {{{companionType}}}
  - Accessibility: {{{accessibilityNeeds}}}

  REMINDER: Generate a COMPLETE {{{numberOfDays}}}-day itinerary. Each day must have activities. Count from day 1 to day {{{numberOfDays}}} and fill each one with appropriate activities based on the travel style.
  `,
});

export const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: "generatePersonalizedItineraryFlow",
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async (input) => {
    const { output } = await generatePersonalizedItineraryPrompt(input);

    // Guard: if the model failed to produce a valid object, throw an error
    if (!output || !Array.isArray(output.itinerary)) {
      throw new Error(
        "Failed to generate itinerary. The AI service is currently unavailable. Please try again in a moment.",
      );
    }

    return output;
  },
);
