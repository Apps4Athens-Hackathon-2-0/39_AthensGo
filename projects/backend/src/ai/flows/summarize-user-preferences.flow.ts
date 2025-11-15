/**
 * @fileOverview Summarizes user preferences collected during onboarding using an LLM.
 *
 * - summarizeUserPreferences - A function that handles the summarization of user preferences.
 * - SummarizeUserPreferencesInput - The input type for the summarizeUserPreferences function.
 * - SummarizeUserPreferencesOutput - The return type for the summarizeUserPreferences function.
 */

import { ai } from "../genkit";
import { z } from "genkit";

const SummarizeUserPreferencesInputSchema = z.object({
  tripDates: z.string().describe("The start and end dates of the trip."),
  numberOfDays: z.number().describe("The number of days for the trip."),
  budget: z
    .enum(["low", "medium", "high"])
    .describe("The budget for the trip."),
  interests: z
    .array(z.string())
    .describe(
      "The interests of the user (e.g., history, food, nightlife, beaches).",
    ),
  travelStyle: z
    .enum(["relaxed", "packed"])
    .describe("The travel style of the user."),
  companionType: z
    .enum(["solo", "couple", "family", "friends"])
    .describe("The type of companions the user is traveling with."),
  accessibilityNeeds: z
    .boolean()
    .optional()
    .describe("Whether the user has accessibility needs."),
});

export type SummarizeUserPreferencesInput = z.infer<
  typeof SummarizeUserPreferencesInputSchema
>;

const SummarizeUserPreferencesOutputSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of the user preferences for the trip."),
  accessibilityNeeds: z.boolean().optional(),
});

export type SummarizeUserPreferencesOutput = z.infer<
  typeof SummarizeUserPreferencesOutputSchema
>;

export async function summarizeUserPreferences(
  input: SummarizeUserPreferencesInput,
): Promise<SummarizeUserPreferencesOutput> {
  return summarizeUserPreferencesFlow(input);
}

const summarizeUserPreferencesPrompt = ai.definePrompt({
  name: "summarizeUserPreferencesPrompt",
  input: { schema: SummarizeUserPreferencesInputSchema },
  output: { schema: SummarizeUserPreferencesOutputSchema },
  prompt: `You are an expert trip planner, skilled at understanding user preferences and creating personalized trip summaries.

  Summarize the following user preferences into a concise and informative summary that will be used to generate a personalized trip itinerary for Athens, Greece.

  The summary should capture the essence of the trip: the duration, budget level, key interests, travel pace, who they're traveling with, and whether they need wheelchair-accessible venues.

  Trip Dates: {{tripDates}}
  Number of Days: {{numberOfDays}}
  Budget: {{budget}}
  Interests: {{interests}}
  Travel Style: {{travelStyle}}
  Companion Type: {{companionType}}
  Accessibility Needs: {{accessibilityNeeds}}

  If accessibilityNeeds is true, emphasize in the summary that the traveler requires wheelchair-accessible entrances, restrooms, parking, and seating where available, and that accessibility should be prioritized when selecting venues.
  `,
});

export const summarizeUserPreferencesFlow = ai.defineFlow(
  {
    name: "summarizeUserPreferencesFlow",
    inputSchema: SummarizeUserPreferencesInputSchema,
    outputSchema: SummarizeUserPreferencesOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeUserPreferencesPrompt(input);
    return output!;
  },
);
