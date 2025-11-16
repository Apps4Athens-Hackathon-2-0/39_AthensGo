// API types matching the backend DTOs

export type Budget = 'low' | 'medium' | 'high';
export type TravelStyle = 'relaxed' | 'packed';
export type CompanionType = 'solo' | 'couple' | 'family' | 'friends';

export interface SummarizeUserPreferencesDto {
  tripDates: string; // e.g., "2024-08-15 to 2024-08-20"
  numberOfDays: number;
  budget: Budget;
  interests: string[]; // array of interest strings
  travelStyle: TravelStyle;
  companionType: CompanionType;
  accessibilityNeeds?: boolean;
}

export interface SummarizeUserPreferencesResponse {
  result: {
    summary: string;
    accessibilityNeeds: boolean;
  };
  telemetry: {
    traceId: string;
    spanId: string;
  };
}

export interface GeneratePersonalizedItineraryDto {
  tripDates: string;
  numberOfDays: number;
  budget: Budget;
  interests: string; // single string for itinerary generation
  travelStyle: TravelStyle;
  companionType: CompanionType;
  accessibilityNeeds?: boolean;
}

export interface ItineraryItemEnrichment {
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number | null;
  priceString?: string | null;
  websiteUrl?: string | null;
  googleMapsUrl?: string;
  isFoodPlace?: boolean;
  accessible?: boolean;
}

export interface ItineraryItem {
  name: string;
  description: string;
  category: 'culinary' | 'cultural' | 'scenic' | 'activity';
  latitude: number;
  longitude: number;
  enrichment?: ItineraryItemEnrichment;
}

export interface DailyItinerary {
  day: number;
  items: ItineraryItem[];
  progress: {
    current: number;
    total: number;
  };
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AccessTokenDto {
  access_token: string;
}

export interface UserDto {
  userId: number;
  email: string;
}

// Predefined interests for Athens
export const ATHENS_INTERESTS = [
  'history',
  'food',
  'nightlife',
  'beaches',
  'museums',
  'archaeology',
  'shopping',
  'art',
  'architecture',
  'nature',
] as const;

export type AthensInterest = typeof ATHENS_INTERESTS[number];
