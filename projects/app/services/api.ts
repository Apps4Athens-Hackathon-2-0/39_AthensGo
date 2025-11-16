import {
  SummarizeUserPreferencesDto,
  SummarizeUserPreferencesResponse,
  GeneratePersonalizedItineraryDto,
  DailyItinerary,
  SignInDto,
  AccessTokenDto,
  UserDto,
} from '@/types/api';

// API base URL - in production this would come from environment variables
const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fake sign-in - for hackathon purposes only
   * Authenticates anyone without calling the actual API
   */
  async signIn(credentials: SignInDto): Promise<AccessTokenDto> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return a fake token
    return {
      access_token: 'fake-token-for-hackathon-' + Date.now(),
    };
  }

  /**
   * Get user profile - for hackathon purposes only
   * Returns mock user data
   */
  async getProfile(token: string): Promise<UserDto> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return {
      userId: 1,
      email: 'user@athensgo.com',
    };
  }

  /**
   * Summarize user preferences
   */
  async summarizeUserPreferences(
    data: SummarizeUserPreferencesDto
  ): Promise<SummarizeUserPreferencesResponse> {
    const response = await fetch(`${this.baseUrl}/ai/summarize-user-preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to summarize preferences: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate itinerary stream using Server-Sent Events (SSE)
   * Returns an async generator that yields daily itinerary items
   */
  async *generateItineraryStream(
    data: GeneratePersonalizedItineraryDto
  ): AsyncGenerator<DailyItinerary, void, unknown> {
    const response = await fetch(`${this.baseUrl}/ai/generate-itinerary-stream`, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate itinerary: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              yield parsed as DailyItinerary;
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Helper method to consume the stream and return all daily itineraries
   */
  async generateItinerary(
    data: GeneratePersonalizedItineraryDto
  ): Promise<DailyItinerary[]> {
    const itineraries: DailyItinerary[] = [];
    
    for await (const dailyItinerary of this.generateItineraryStream(data)) {
      itineraries.push(dailyItinerary);
    }
    
    return itineraries;
  }
}

export const apiService = new ApiService();
