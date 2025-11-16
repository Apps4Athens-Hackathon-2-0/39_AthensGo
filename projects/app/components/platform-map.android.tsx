// Android implementation - uses react-native-maps
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

// Android implementation - full MapView functionality
export function PlatformMapView(props: MapComponentProps & { ref?: any }) {
  return <MapView {...props} />;
}

// Android implementation - full Marker functionality
export function PlatformMarker(props: any) {
  return <Marker {...props} />;
}

// Android implementation - export Google provider
export const PLATFORM_PROVIDER_GOOGLE = PROVIDER_GOOGLE;
