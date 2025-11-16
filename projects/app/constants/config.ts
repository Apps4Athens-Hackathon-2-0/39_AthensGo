/**
 * App configuration constants
 */

// API Configuration
export const API_BASE_URL = 'https://aabb6c501e2a.ngrok-free.app';

// App Information
export const APP_NAME = 'AthensGo';
export const APP_VERSION = '1.0.0';
export const APP_SUBTITLE = 'Your Personal Athens Travel Guide';

// Mock Data
export const MOCK_CREDIT_CARD = {
  number: '1234 **** **** ****',
  expiry: '12/25',
  type: 'Credit Card',
};

export const MOCK_USER = {
  userId: 1,
  email: 'user@athensgo.com',
  memberSince: '2024',
};

// Athens Coordinates (center of Athens)
export const ATHENS_CENTER = {
  latitude: 37.9838,
  longitude: 23.7275,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Loading Messages
export const LOADING_MESSAGES = [
  'Crafting your amazing Athenian trip...',
  'Finding the perfect spots for you...',
  'Planning your daily adventures...',
  'Discovering hidden gems...',
  'Personalizing your experience...',
  'Almost ready...',
];

// Date Format
export const DATE_FORMAT = 'MMM DD, YYYY';

// Booking Confirmation Message
export const BOOKING_CONFIRMATION_MESSAGE = (placeName: string) =>
  `Booking confirmed for ${placeName}! (Mock booking)`;

// Error Messages
export const ERROR_MESSAGES = {
  NO_EMAIL: 'Please enter email and password',
  NO_INTERESTS: 'Please select at least one interest',
  SIGN_IN_FAILED: 'Sign in failed. Please try again.',
  PREFERENCES_FAILED: 'Failed to process your preferences. Please try again.',
  ITINERARY_FAILED: 'Failed to generate itinerary. Please try again.',
};

// Map Configuration
export const MAP_CONFIG = {
  edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  animationDuration: 300,
};

// Tab Configuration
export const TAB_LABELS = {
  trip: 'Trip',
  newTrip: 'New Trip',
  settings: 'Settings',
};
