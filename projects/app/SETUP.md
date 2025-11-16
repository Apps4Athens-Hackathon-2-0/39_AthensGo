# AthensGo Mobile App - Setup Guide

This guide will help you get the AthensGo mobile app up and running for the hackathon.

## Prerequisites

✅ **Required:**
- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Node.js](https://nodejs.org/) v18+ - Required by Expo
- [Expo Go](https://expo.dev/go) app on your mobile device
- Backend API running on your machine (see `projects/backend/README.md`)

📱 **Optional (for native builds):**
- [Android Studio](https://developer.android.com/studio) for Android emulator
- [Xcode](https://developer.apple.com/xcode/) for iOS simulator (Mac only)

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd projects/app
bun install
```

### 2. Configure Google Maps

**Option A: For Quick Testing (maps won't show locations)**
- Skip this step, app will work but maps will be blank

**Option B: For Full Functionality**

1. Get a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable these APIs:
     - Maps SDK for Android
     - Maps SDK for iOS
   - Create credentials → API Key

2. Update `app.json`:
   ```json
   "ios": {
     "config": {
       "googleMapsApiKey": "YOUR_ACTUAL_KEY_HERE"
     }
   },
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "YOUR_ACTUAL_KEY_HERE"
       }
     }
   }
   ```

### 3. Ensure Backend is Running

```bash
# In another terminal
cd projects/backend
bun install
bun start:dev
```

The backend should be running at `http://localhost:3001`

### 4. Start the App

```bash
cd projects/app
bun start
```

You'll see a QR code in the terminal.

### 5. Open on Your Device

📱 **On your phone:**
1. Open the Expo Go app
2. Scan the QR code from step 4
3. Wait for the app to load (first time takes ~30s)

🖥️ **On emulator/simulator:**
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web browser

## Using the App

### First Run

1. **Sign In Screen**
   - Enter ANY email and password (authentication is fake for the hackathon)
   - Click "Sign In"

2. **Onboarding Screen**
   - Select your trip dates
   - Choose your budget (low/medium/high)
   - Pick interests (e.g., history, food, nightlife)
   - Select travel style (relaxed/packed)
   - Choose who you're traveling with
   - Toggle accessibility needs if required
   - Click "Generate My Itinerary"

3. **Loading Screen**
   - Watch the loading messages
   - The app is calling the backend API
   - Generating your personalized itinerary

4. **Main Trip Screen**
   - **Top Half**: Interactive map with location markers
   - **Day Tabs**: Swipe between days
   - **Itinerary Items**: 
     - Tap title to open in maps
     - View ratings and prices
     - Click "Book Table" for restaurants (visual only)

5. **Bottom Navigation**
   - 🛫 **Trip**: Main screen (you're here!)
   - ➕ **New Trip**: Start planning a new trip
   - ⚙️ **Settings**: View profile and mock settings

## Troubleshooting

### Backend Connection Issues

**Problem:** App shows "Failed to generate itinerary"

**Solution for Physical Devices:**

Your phone can't reach `localhost:3001`. You need to expose your backend:

**Option A: Use your computer's IP**
1. Find your IP:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```
2. Update `services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3001';
   ```
3. Restart the app: Press `r` in the Expo terminal

**Option B: Use ngrok**
1. Install ngrok: `brew install ngrok` or download from [ngrok.com](https://ngrok.com)
2. Expose your backend:
   ```bash
   ngrok http 3001
   ```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update `services/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://abc123.ngrok.io';
   ```
5. Restart the app

### Map Not Showing

**Problem:** Map is gray/blank

**Solutions:**
1. Make sure you added your Google Maps API key to `app.json`
2. Verify the APIs are enabled in Google Cloud Console
3. Restart the Expo server:
   ```bash
   # Press Ctrl+C to stop, then
   bun start --clear
   ```

### App Won't Load

**Problem:** Red error screen or infinite loading

**Solutions:**

1. **Clear Expo cache:**
   ```bash
   bun start --clear
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules bun.lock
   bun install
   ```

3. **Check Expo Go version:**
   - Update to latest version in App Store/Play Store

4. **Check React Native version compatibility:**
   - This app requires React Native 0.81+
   - Expo Go SDK 54+

### TypeScript Errors

**Problem:** Red squiggly lines in VS Code

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press: Cmd/Ctrl + Shift + P
# Type: "TypeScript: Restart TS Server"
```

### Linting Errors

**Problem:** Linting errors when running `bun lint`

**Solution:**
```bash
bun run lint --fix
```

## Development Tips

### Hot Reload

- Press `r` to reload the app
- Press `m` to toggle menu
- Shake device to open developer menu

### Debugging

1. **Console Logs:**
   - Logs appear in the terminal where you ran `bun start`

2. **React DevTools:**
   ```bash
   # In another terminal
   npx react-devtools
   ```

3. **Network Requests:**
   - Open dev menu (shake device)
   - Tap "Debug Remote JS"
   - Open Chrome DevTools → Network tab

### Making Changes

The app uses hot reload. Most changes appear instantly:
- ✅ UI changes (components, styles)
- ✅ Logic changes (functions, hooks)
- ❌ Native module changes (require rebuild)
- ❌ app.json changes (require restart)

If changes don't appear, press `r` to reload.

## Testing the Full Flow

Here's a test scenario to verify everything works:

1. **Start Backend:**
   ```bash
   cd projects/backend && bun start:dev
   ```

2. **Start Mobile App:**
   ```bash
   cd projects/app && bun start
   ```

3. **Test Sign In:**
   - Email: `test@athensgo.com`
   - Password: `test123`
   - Should navigate to onboarding

4. **Test Onboarding:**
   - Dates: Tomorrow to 3 days later
   - Budget: Medium
   - Interests: History, Food, Nightlife
   - Travel Style: Relaxed
   - Companion: Couple
   - Accessibility: Off
   - Click "Generate My Itinerary"

5. **Verify Loading:**
   - Should see animated loading messages
   - Should transition to main screen after ~10 seconds

6. **Test Main Screen:**
   - Map should show markers
   - Day 1 tab should be active and show items
   - Tap on item title → Should offer to open maps
   - Tap "Book Table" on restaurant → Should show confirmation

7. **Test Navigation:**
   - Tap "Settings" tab → Should show profile
   - Tap "New Trip" tab → Should go to onboarding
   - Tap "Trip" tab → Should return to trip screen

## Project Structure Reference

```
projects/app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Main trip screen
│   │   ├── new-trip.tsx   # Triggers onboarding
│   │   └── settings.tsx   # Settings screen
│   ├── sign-in.tsx        # Auth screen
│   ├── onboarding.tsx     # Preferences input
│   ├── trip-loading.tsx   # Loading screen
│   └── _layout.tsx        # Root layout
├── screens/               # Screen components
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── services/              # API and business logic
│   └── api.ts            # Backend API client
├── types/                 # TypeScript definitions
│   └── api.ts            # API types
├── constants/             # App constants
│   ├── theme.ts          # Greek flag colors
│   └── config.ts         # App configuration
├── utils/                 # Helper functions
│   └── helpers.ts        # Utility functions
└── app.json              # Expo configuration
```

## Support

For issues specific to:
- **Mobile App**: Check this SETUP.md
- **Backend API**: See `projects/backend/README.md`
- **General**: Check main repo README.md

## Hackathon Tips

### Demo Preparation

1. **Pre-load a trip:**
   - Run through the flow once before demo
   - Keep app open on the trip screen
   - Backend should be warmed up

2. **Backup plan:**
   - Take screenshots of each screen
   - Have a video recording of the flow
   - If internet fails, show screenshots

3. **Talking points:**
   - "Fake auth for hackathon speed"
   - "Real AI backend generating itinerary"
   - "Greek flag color scheme"
   - "Accessibility-first design"

### Common Demo Issues

- **Slow first load:** Happens on first run, reload to speed up
- **Maps not loading:** Have screenshots ready
- **Backend timeout:** Increase timeout, or use cached response

## Next Steps

Now that you have the app running:

1. ✅ Test the complete user flow
2. ✅ Customize interests for Athens
3. ✅ Add your Google Maps API key
4. ✅ Test on a physical device
5. ✅ Prepare your demo!

Happy hacking! 🚀🇬🇷
