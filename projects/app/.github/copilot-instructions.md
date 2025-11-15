# AthensGo Mobile App - GitHub Copilot Instructions

## Project Overview

React Native mobile application built with Expo that allows tourists to discover and navigate personalized routes in Athens, Greece. Features AI-generated itineraries, interactive maps, and local recommendations.

## Tech Stack

- **Framework**: React Native 0.81.5 with Expo ~54.0
- **Router**: Expo Router 6.0 (file-based routing)
- **Runtime**: Bun (for package management)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind 4.x (TailwindCSS for React Native)
- **UI Library**: Gluestack UI 3.x
- **Animations**: React Native Reanimated 4.x, @legendapp/motion
- **Navigation**: React Navigation 7.x (via Expo Router)
- **Icons**: Expo Symbols, @expo/vector-icons

## Architecture

### File-Based Routing (Expo Router)

```
app/
├── _layout.tsx          # Root layout (theme provider, stack navigator)
├── (tabs)/              # Tab-based navigation group
│   ├── _layout.tsx      # Tab layout configuration
│   ├── index.tsx        # Home screen
│   └── explore.tsx      # Explore screen
└── modal.tsx            # Modal screen
```

#### Routing Patterns

- **Folders with `()`**: Layout groups without affecting URL
- **Files**: Become routes (e.g., `about.tsx` → `/about`)
- **`_layout.tsx`**: Defines layout for sibling routes
- **`[param].tsx`**: Dynamic routes
- **`index.tsx`**: Default route in directory

### Project Structure

```
├── app/                 # Expo Router screens
├── components/          # Reusable components
│   ├── ui/              # UI primitives (gluestack)
│   ├── themed-view.tsx
│   ├── themed-text.tsx
│   └── ...
├── constants/           # App constants (theme, colors, etc.)
├── hooks/               # Custom React hooks
├── assets/              # Images, fonts, static files
└── scripts/             # Utility scripts
```

## Coding Standards

### Components

#### Functional Components with TypeScript
```typescript
import { View, Text } from 'react-native';
import { ThemedView } from '@/components/themed-view';

type Props = {
  title: string;
  onPress?: () => void;
};

export default function MyComponent({ title, onPress }: Props) {
  return (
    <ThemedView>
      <Text>{title}</Text>
    </ThemedView>
  );
}
```

#### Use Expo Router Hooks
```typescript
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const handlePress = () => {
    router.push('/details');
    // or router.navigate(), router.back(), router.replace()
  };
}
```

### Styling with NativeWind

Use Tailwind utility classes via `className` prop:

```typescript
import { View, Text } from 'react-native';

export default function Component() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold text-gray-900">
        Hello Athens!
      </Text>
    </View>
  );
}
```

#### Dark Mode Support
```typescript
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ThemedComponent() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View className={isDark ? 'bg-gray-900' : 'bg-white'}>
      {/* content */}
    </View>
  );
}
```

### Gluestack UI Components

Located in `components/ui/`, these are pre-built UI primitives.

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Form() {
  return (
    <>
      <Input placeholder="Enter location" />
      <Button onPress={() => console.log('pressed')}>
        <ButtonText>Search</ButtonText>
      </Button>
    </>
  );
}
```

### Animations

#### React Native Reanimated
```typescript
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue 
} from 'react-native-reanimated';

export default function AnimatedComponent() {
  const offset = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(offset.value) }],
  }));
  
  return <Animated.View style={animatedStyle} />;
}
```

#### @legendapp/motion (Framer Motion-like)
```typescript
import { Motion } from '@legendapp/motion';

export default function MotionComponent() {
  return (
    <Motion.View
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' }}
    >
      {/* content */}
    </Motion.View>
  );
}
```

### Haptics
```typescript
import * as Haptics from 'expo-haptics';

const handlePress = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // Perform action
};
```

### Navigation

#### Tabs Layout
```typescript
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/tab-bar-icon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
```

#### Screen Headers
```typescript
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'AthensGo',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
```

### Custom Hooks

Place in `hooks/` folder:

```typescript
// hooks/use-itinerary.ts
import { useState, useEffect } from 'react';

export function useItinerary(userId: string) {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch itinerary
  }, [userId]);
  
  return { itinerary, loading };
}
```

### API Integration

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function fetchItinerary(preferences: Preferences) {
  try {
    const response = await fetch(`${API_URL}/ai/generate-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) throw new Error('Failed to fetch');
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Environment Variables

Create `.env` (not committed):
```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your-key
```

Access in code:
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

Note: Variables must be prefixed with `EXPO_PUBLIC_` to be available in the app.

## Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = {
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
};

// Or use Platform.select
const padding = Platform.select({
  ios: 20,
  android: 10,
  web: 15,
});
```

## Safe Area Handling

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* content */}
    </SafeAreaView>
  );
}
```

## Running the App

```bash
# Start development server
bun start

# Run on specific platform
bun run ios
bun run android
bun run web

# Reset project (clear cache)
bun run reset-project
```

## Assets

### Images
```typescript
import { Image } from 'expo-image';

<Image
  source={require('@/assets/images/icon.png')}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
/>
```

### Fonts
Load fonts using `expo-font`:
```typescript
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'CustomFont': require('./assets/fonts/CustomFont.ttf'),
  });

  if (!fontsLoaded) return null;
  
  return <AppContent />;
}
```

## Testing

```bash
# Run tests
bun test

# Run with coverage
bun test --coverage
```

## AthensGo-Specific Features

### Tourist Route Display
- Show day-by-day itinerary
- Interactive map with route markers
- Distance and duration estimates
- Point of interest details

### Preferences Collection
- Budget selection (low/medium/high)
- Interest categories (history, food, beaches, etc.)
- Travel style (relaxed/packed)
- Companion type (solo/couple/family/friends)

### User Experience
- Offline support for saved routes
- Real-time navigation
- Local tips and recommendations
- Greek and English language support

## Common Patterns

### Loading States
```typescript
const [loading, setLoading] = useState(true);

if (loading) {
  return <ActivityIndicator size="large" />;
}

return <Content />;
```

### Error Handling
```typescript
const [error, setError] = useState<string | null>(null);

if (error) {
  return <ErrorView message={error} />;
}
```

### Lists with FlatList
```typescript
import { FlatList } from 'react-native';

<FlatList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ padding: 16 }}
/>
```

## Performance Optimization

- Use `React.memo()` for expensive components
- Implement `useMemo()` and `useCallback()` appropriately
- Lazy load screens and heavy components
- Optimize images (use WebP, proper dimensions)
- Use FlatList for long lists (not ScrollView with .map())
- Debounce search inputs
- Cache API responses

## Accessibility

```typescript
<View 
  accessible 
  accessibilityLabel="Route details"
  accessibilityRole="button"
>
  {/* content */}
</View>
```

## Debugging

- Use React Native Debugger
- Expo DevTools: Press `m` in terminal for menu
- Console logs: Use `console.log()`
- React DevTools: Available in Expo DevTools
- Network requests: Use React Native Debugger or Flipper

## Key Dependencies

- `expo` - Expo SDK
- `expo-router` - File-based routing
- `react-native` - Core framework
- `nativewind` - Tailwind CSS styling
- `@gluestack-ui/core` - UI component library
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Touch gestures
- `react-native-screens` - Native screen optimization
- `expo-haptics` - Haptic feedback
- `expo-linking` - Deep linking support

## Build & Deploy

```bash
# Build for production
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Troubleshooting

### Clear cache
```bash
bun run reset-project
rm -rf node_modules
bun install
```

### iOS-specific issues
```bash
cd ios && pod install && cd ..
```

### Metro bundler issues
Press `r` to reload, `shift+d` for dev menu

