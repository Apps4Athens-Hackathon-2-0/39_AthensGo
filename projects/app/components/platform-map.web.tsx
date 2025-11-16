// Web-specific implementation - no react-native-maps
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface MapComponentProps {
  children?: React.ReactNode;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
  onMapReady?: () => void;
  provider?: any;
}

// Web fallback component
function WebMapPlaceholder({ style }: { style?: any }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.webPlaceholder, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        🗺️
      </Text>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        Map view available on mobile devices
      </Text>
      <Text style={[styles.placeholderSubtext, { color: colors.icon }]}>
        Install Expo Go on your phone to see the interactive map
      </Text>
    </View>
  );
}

// Web implementation - always returns placeholder
export function PlatformMapView(props: MapComponentProps & { ref?: any }) {
  return <WebMapPlaceholder style={props.style} />;
}

// Web implementation - always returns null
export function PlatformMarker(props: any) {
  return null;
}

// Web implementation - no provider needed
export const PLATFORM_PROVIDER_GOOGLE = undefined;

const styles = StyleSheet.create({
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
