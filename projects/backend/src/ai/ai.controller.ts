import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";
import { GeneratePersonalizedItineraryDto } from "./dto/generate-personalized-itinerary.dto";
import { SummarizeUserPreferencesDto } from "./dto/summarize-user-preferences.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("ai")
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("generate-personalized-itinerary")
  @ApiOperation({ summary: "Generate a personalized itinerary" })
  @ApiResponse({ status: 200, description: "The generated itinerary" })
  async generatePersonalizedItinerary(
    @Body() dto: GeneratePersonalizedItineraryDto,
  ) {
    return this.aiService.generatePersonalizedItinerary(dto);
  }

  @Post("summarize-user-preferences")
  @ApiOperation({ summary: "Summarize user preferences" })
  @ApiResponse({ status: 200, description: "The summarized preferences" })
  async summarizeUserPreferences(@Body() dto: SummarizeUserPreferencesDto) {
    return this.aiService.summarizeUserPreferences(dto);
  }
}
