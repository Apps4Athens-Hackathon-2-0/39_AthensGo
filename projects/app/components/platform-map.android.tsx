// Android implementation - Expo Go compatible placeholder
import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  onPress?: () => void;
  pinColor?: string;
}

// Android implementation - Static map placeholder for Expo Go
export const PlatformMapView = forwardRef<any, MapComponentProps>((props, ref) => {
  const { initialRegion, style, children, onMapReady } = props;

  React.useEffect(() => {
    onMapReady?.();
  }, [onMapReady]);

  const handleOpenMaps = () => {
    if (initialRegion) {
      const url = `geo:${initialRegion.latitude},${initialRegion.longitude}?z=14`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.placeholder}>
        <Ionicons name="map" size={64} color="#0D5EAF" />
        <Text style={styles.title}>Interactive Map</Text>
        <Text style={styles.subtitle}>
          Map view is available with a custom development build
        </Text>
        <Text style={styles.info}>
          For this Expo Go demo, locations are shown in the list below.
        </Text>
        {initialRegion && (
          <TouchableOpacity style={styles.button} onPress={handleOpenMaps}>
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Open in Maps App</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
});

// Android implementation - Marker placeholder (not visible in static placeholder)
export function PlatformMarker(props: MarkerProps) {
  // In placeholder mode, markers are not rendered
  return null;
}

// Android implementation - no provider needed
export const PLATFORM_PROVIDER_GOOGLE = undefined;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8F4F8',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D5EAF',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  info: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D5EAF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

