import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";
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

  @Post("generate-itinerary-stream")
  @ApiOperation({ summary: "Generate itinerary with streaming (day-by-day)" })
  @ApiResponse({
    status: 200,
    description: "Server-Sent Events stream of itinerary days",
  })
  generateItineraryStream(
    @Body() dto: GeneratePersonalizedItineraryDto,
    @Res() res: Response,
  ): void {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    this.aiService.generateItineraryStream(dto).subscribe({
      next: (event: MessageEvent) => {
        res.write(`data: ${event.data}\n\n`);
      },
      error: (error: Error) => {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      },
      complete: () => {
        res.end();
      },
    });
  }
}
