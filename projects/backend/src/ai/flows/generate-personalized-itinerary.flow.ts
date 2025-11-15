/**
 * @fileOverview AI agent that generates a personalized itinerary for a trip to Athens.
 *
 * - generatePersonalizedItinerary - A function that generates a personalized itinerary.
 * - GeneratePersonalizedItineraryInput - The input type for the generatePersonalizedItinerary function.
 * - GeneratePersonalizedItineraryOutput - The return type for the generatePersonalizedItinerary function.
 */

import { ai } from '../genkit';
import { findAthensPlaceDetails } from '../tools/google-maps.tool';
import { z } from 'genkit';

const GeneratePersonalizedItineraryInputSchema = z.object({
  tripDates: z.string().describe('The start and end dates of the trip.'),
  numberOfDays: z.number().describe('The number of days for the trip.'),
  budget: z
    .enum(['low', 'medium', 'high'])
    .describe('The budget for the trip.'),
  interests: z.string().describe('The interests of the traveler.'),
  travelStyle: z
    .enum(['relaxed', 'packed'])
    .describe('The travel style of the traveler.'),
  companionType: z
    .enum(['solo', 'couple', 'family', 'friends'])
    .describe('The type of companions for the trip.'),
});
export type GeneratePersonalizedItineraryInput = z.infer<
  typeof GeneratePersonalizedItineraryInputSchema
>;

// Fixed Schema
const ItineraryItemSchema = z.object({
  name: z
    .string()
    .describe('The name of the attraction, restaurant, or experience.'),
  description: z.string().describe('A short description of the item.'),
  category: z
    .string()
    .describe('The category of the item (cultural, culinary, scenic, etc.).'),
  // Flattened location fields
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itinerary: z
    .array(
      z.object({
        day: z.number().describe('The day number in the itinerary.'),
        items: z
          .array(ItineraryItemSchema)
          .describe('The list of itinerary items for the day.'),
      }),
    )
    .describe('The generated personalized itinerary.'),
});
export type GeneratePersonalizedItineraryOutput = z.infer<
  typeof GeneratePersonalizedItineraryOutputSchema
>;

export async function generatePersonalizedItinerary(
  input: GeneratePersonalizedItineraryInput,
): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const generatePersonalizedItineraryPrompt = ai.definePrompt({
  name: 'generatePersonalizedItineraryPrompt',
  input: { schema: GeneratePersonalizedItineraryInputSchema },
  output: { schema: GeneratePersonalizedItineraryOutputSchema },
  tools: [findAthensPlaceDetails],
  prompt: `You are a personal travel assistant specializing in creating itineraries for trips to Athens, Greece.

  Based on the traveler's preferences, generate a personalized itinerary.

  **IMPORTANT**: For each attraction, restaurant, or point of interest you suggest, you MUST use the 'findAthensPlaceDetails' tool to get its precise coordinates. This ensures the location is accurate. Do not invent coordinates.
  Trip Dates: {{{tripDates}}}
  Number of Days: {{{numberOfDays}}}
  Budget: {{{budget}}}
  Interests: {{{interests}}}
  Travel Style: {{{travelStyle}}}
  Companion Type: {{{companionType}}}

  Format the output as a JSON object with an "itinerary" field. The itinerary should be an array of days. Each day should have a "day" field (the day number) and an "items" field. The items field should be an array of objects, each with "name", "description", "category", "latitude", and "longitude" fields.
  `,
});

export const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedItineraryFlow',
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async (input) => {
    const { output } = await generatePersonalizedItineraryPrompt(input);
    return output!;
  },
);
