import { Body, Controller, Post, Sse } from "@nestjs/common";
import { Observable } from "rxjs";
import { AiService } from "./ai.service";
import { GeneratePersonalizedItineraryDto } from "./dto/generate-personalized-itinerary.dto";
import { SummarizeUserPreferencesDto } from "./dto/summarize-user-preferences.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

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

  @Sse("generate-itinerary-stream")
  @ApiOperation({ summary: "Generate itinerary with streaming (day-by-day)" })
  @ApiBody({
    type: GeneratePersonalizedItineraryDto,
    description:
      "NOTE: SSE uses GET; standard EventSource cannot send a body. This body is documented for clarity (use query params or switch to fetch POST implementation if needed).",
  })
  @ApiResponse({
    status: 200,
    description:
      "Server-Sent Events stream of daily itinerary items (text/event-stream)",
  })
  generateItineraryStream(
    @Body() dto: GeneratePersonalizedItineraryDto,
  ): Observable<MessageEvent> {
    return this.aiService.generateItineraryStream(dto);
  }
}
