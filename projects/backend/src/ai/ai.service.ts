import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import {
  generatePersonalizedItineraryFlow,
  generateSingleDayPrompt,
} from "./flows/generate-personalized-itinerary.flow";
import { summarizeUserPreferencesFlow } from "./flows/summarize-user-preferences.flow";
import { GeneratePersonalizedItineraryDto } from "./dto/generate-personalized-itinerary.dto";
import { SummarizeUserPreferencesDto } from "./dto/summarize-user-preferences.dto";

@Injectable()
export class AiService {
  async generatePersonalizedItinerary(
    dto: GeneratePersonalizedItineraryDto,
  ): Promise<unknown> {
    return await generatePersonalizedItineraryFlow.run(dto);
  }

  async summarizeUserPreferences(
    dto: SummarizeUserPreferencesDto,
  ): Promise<unknown> {
    return await summarizeUserPreferencesFlow.run(dto);
  }

  generateItineraryStream(
    dto: GeneratePersonalizedItineraryDto,
  ): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      void (async () => {
        try {
          let previousDaysContext = "";

          for (let dayNum = 1; dayNum <= dto.numberOfDays; dayNum++) {
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
              subscriber.error(new Error(`Failed to generate day ${dayNum}`));
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
}
