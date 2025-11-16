import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Only import MapView on native platforms
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

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

// Platform-specific map component
export function PlatformMapView(props: MapComponentProps & { ref?: any }) {
  if (Platform.OS === 'web') {
    return <WebMapPlaceholder style={props.style} />;
  }

  return <MapView {...props} />;
}

// Export Marker component (web-safe)
export function PlatformMarker(props: any) {
  if (Platform.OS === 'web') {
    return null;
  }
  return <Marker {...props} />;
}

// Export provider constant
export const PLATFORM_PROVIDER_GOOGLE = Platform.OS === 'web' ? undefined : PROVIDER_GOOGLE;

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
