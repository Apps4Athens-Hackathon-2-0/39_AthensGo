# AthensGo Mobile App

Tourist assistance mobile application for Athens, Greece built with React Native and Expo.

## Features

- **Fake Authentication**: Local authentication for hackathon demo purposes
- **Onboarding Flow**: Collect user preferences for trip planning
  - Trip dates selection
  - Budget options (low/medium/high)
  - Interests selection (history, food, nightlife, etc.)
  - Travel style (relaxed/packed)
  - Companion type (solo/couple/family/friends)
  - Accessibility needs
- **AI-Powered Itinerary**: Generates personalized day-by-day itineraries
- **Interactive Map**: View locations on Google Maps with navigation
- **Daily Activities**: Browse items with ratings, pricing, and descriptions
- **Booking**: Mock booking functionality for restaurants
- **Settings**: Profile and mock payment information

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) package manager installed
- Expo Go app on your mobile device (or Android/iOS simulator)
- Backend API running on `localhost:3001`

### Installation

```bash
cd projects/app
bun install
```

### Configuration

#### Google Maps API Key

For the map functionality to work, you need to add your Google Maps API key:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
3. Update `app.json`:
   - Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key

### Running the App

```bash
# Start Expo development server
bun start

# Or run on specific platform
bun android
bun ios
bun web
```

Scan the QR code with Expo Go app on your mobile device.

## Architecture

### Directory Structure

```
app/
├── (tabs)/          # Main tabs navigation
│   ├── index.tsx    # Trip screen (main)
│   ├── new-trip.tsx # New trip (triggers onboarding)
│   └── settings.tsx # Settings screen
├── sign-in.tsx      # Authentication screen
├── onboarding.tsx   # Preferences collection
├── trip-loading.tsx # Itinerary generation
└── _layout.tsx      # Root layout

screens/             # Screen components
├── sign-in.tsx
├── onboarding.tsx
├── trip-loading.tsx
├── trip.tsx
└── settings.tsx

services/            # API and business logic
└── api.ts           # Backend API client

contexts/            # React contexts
└── app-context.tsx  # Global app state

types/               # TypeScript types
└── api.ts           # API type definitions

constants/           # App constants
└── theme.ts         # Greek flag color theme
```

### State Management

- **AppContext**: Global state for user, trip preferences, and itinerary
- Uses React Context API with hooks

### API Integration

The app communicates with a NestJS backend API:

- `POST /ai/summarize-user-preferences`: Summarize user inputs
- `GET /ai/generate-itinerary-stream`: Stream itinerary day-by-day (SSE)

Authentication endpoints are mocked locally for the hackathon.

### Theme

The app uses colors inspired by the Greek flag:
- Primary: Greek Blue (#0D5EAF)
- Secondary: White (#FFFFFF)
- Supports both light and dark modes

## Key Components

### Sign-In Screen
- Fake authentication (accepts any credentials)
- Visual only, no token validation

### Onboarding Screen
- Date range picker for trip dates
- Budget selection
- Multi-select interests (10 predefined Athens interests)
- Travel style and companion type selection
- Accessibility needs toggle

### Trip Loading Screen
- Shows animated loading messages
- Calls summarize-user-preferences API
- Streams itinerary generation
- Transitions to main screen after first day received

### Trip Screen (Main)
- **Top half**: Google Maps with markers for all locations
- **Bottom tabs**: Swipeable day tabs
- **Itinerary list**:
  - Activity cards with category icons
  - Star ratings and review counts
  - Price levels (€ symbols)
  - Accessibility indicators
  - Book button for food places
  - Tap title to open in maps app

### Settings Screen
- Profile section with default avatar
- Mock credit card (1234 **** **** ****)
- Settings options (mock)
- Logout functionality

## Navigation Flow

```
Sign In → Onboarding → Trip Loading → Main (Trip Tab)
                          ↓
              Bottom Nav: Trip | New Trip | Settings
```

## Development Notes

### For Hackathon

- Authentication is completely fake and local
- Booking functionality is visual only
- Settings are mostly mock/placeholder
- API runs on localhost:3001

### Map Functionality

- Uses `react-native-maps` with Google Maps provider
- Markers show all daily itinerary items
- Tapping marker shows location details
- Navigate button opens native maps app
- Automatically centers on current day's locations

### Stream Processing

The itinerary generation uses Server-Sent Events (SSE):
- Processes day-by-day as they arrive
- Shows loading spinner for pending days
- Enables tabs as days complete

## Troubleshooting

### Maps not showing

1. Ensure Google Maps API key is configured in `app.json`
2. Enable required APIs in Google Cloud Console
3. Restart Expo server after changing `app.json`

### Backend connection issues

- Ensure backend is running on `localhost:3001`
- For physical devices, use ngrok or similar to expose localhost
- Update `API_BASE_URL` in `services/api.ts` if needed

### Build errors

```bash
# Clean and reinstall
rm -rf node_modules bun.lock
bun install

# Clear Expo cache
bun start --clear
```

## Tech Stack

- **React Native 0.81.5**
- **Expo 54**
- **Expo Router** for navigation
- **React Native Maps** for mapping
- **@expo/vector-icons** for icons
- **TypeScript** for type safety
- **Bun** for package management

## Future Enhancements

For production, consider:
- Real authentication with JWT tokens
- Persistent storage (AsyncStorage/SQLite)
- Offline support
- Real booking API integration
- Google Navigation SDK for turn-by-turn directions
- Push notifications
- Trip history
- Social sharing
