import {
  SummarizeUserPreferencesDto,
  SummarizeUserPreferencesResponse,
  GeneratePersonalizedItineraryDto,
  DailyItinerary,
  SignInDto,
  AccessTokenDto,
  UserDto,
} from '@/types/api';
import { API_BASE_URL } from '@/constants/config';

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
    try {
      const response = await fetch(`${this.baseUrl}/ai/summarize-user-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to summarize preferences: ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('Cannot connect to server. Please check your internet connection and ensure the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Generate itinerary stream using Server-Sent Events (SSE)
   * Returns an async generator that yields daily itinerary items
   */
  async *generateItineraryStream(
    data: GeneratePersonalizedItineraryDto
  ): AsyncGenerator<DailyItinerary, void, unknown> {
    try {
      console.log('Calling itinerary stream with data:', JSON.stringify(data));
      console.log('Using URL:', `${this.baseUrl}/ai/generate-itinerary-stream`);

      const response = await fetch(`${this.baseUrl}/ai/generate-itinerary-stream`, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);

      if (!response.ok) {
        let errorMessage = `Failed to generate itinerary: ${response.status} ${response.statusText}`;
        try {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          errorMessage += ` - ${errorText}`;
        } catch (e) {
          console.error('Could not read error response:', e);
        }
        throw new Error(errorMessage);
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
                console.log('Received day:', parsed.day);
                yield parsed as DailyItinerary;
              } catch (e) {
                console.error('Failed to parse SSE data:', e, 'Line:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('generateItineraryStream error:', error);
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('Cannot connect to server. Please check your internet connection and ensure the backend is running.');
      }
      throw error;
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
