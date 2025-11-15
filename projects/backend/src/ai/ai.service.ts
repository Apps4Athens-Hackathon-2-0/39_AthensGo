import { Injectable } from '@nestjs/common';
import { generatePersonalizedItineraryFlow } from './flows/generate-personalized-itinerary.flow';
import { summarizeUserPreferencesFlow } from './flows/summarize-user-preferences.flow';
import { GeneratePersonalizedItineraryDto } from './dto/generate-personalized-itinerary.dto';
import { SummarizeUserPreferencesDto } from './dto/summarize-user-preferences.dto';

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
}
