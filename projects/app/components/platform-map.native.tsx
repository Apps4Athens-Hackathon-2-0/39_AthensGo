// Native implementation (iOS/Android) - uses react-native-maps
import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

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

// Native implementation - full MapView functionality
export function PlatformMapView(props: MapComponentProps & { ref?: any }) {
  return <MapView {...props} />;
}

// Native implementation - full Marker functionality
export function PlatformMarker(props: any) {
  return <Marker {...props} />;
}

// Native implementation - export Google provider
export const PLATFORM_PROVIDER_GOOGLE = PROVIDER_GOOGLE;
