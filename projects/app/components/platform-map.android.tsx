// Android implementation - uses react-native-maps with graceful fallback
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Try to import react-native-maps, but provide fallback
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
} catch (error) {
  console.warn('react-native-maps not available, using placeholder');
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

// Fallback placeholder component
function MapPlaceholder({ style }: { style?: any }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.placeholder, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        🗺️
      </Text>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        Map requires custom development build
      </Text>
      <Text style={[styles.placeholderSubtext, { color: colors.icon }]}>
        Run 'eas build' or add Google Maps API key
      </Text>
    </View>
  );
}

// Android implementation - full MapView functionality if available, otherwise placeholder
export function PlatformMapView(props: MapComponentProps & { ref?: any }) {
  if (!MapView) {
    return <MapPlaceholder style={props.style} />;
  }
  return <MapView {...props} />;
}

// Android implementation - full Marker functionality if available
export function PlatformMarker(props: any) {
  if (!Marker) {
    return null;
  }
  return <Marker {...props} />;
}

// Android implementation - export Google provider if available
export const PLATFORM_PROVIDER_GOOGLE = PROVIDER_GOOGLE;

const styles = StyleSheet.create({
  placeholder: {
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

