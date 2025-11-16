// iOS implementation - uses MapLibre (via @rnmapbox/maps)
import React, { forwardRef } from 'react';
import Mapbox from '@rnmapbox/maps';

// Initialize MapLibre (no API key needed for OpenStreetMap)
Mapbox.setAccessToken(null);

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

// iOS implementation - MapLibre MapView with camera
export const PlatformMapView = forwardRef<any, MapComponentProps>((props, ref) => {
  const { initialRegion, style, children, onMapReady } = props;

  return (
    <Mapbox.MapView
      style={style}
      styleURL={Mapbox.StyleURL.Street}
      onDidFinishLoadingMap={onMapReady}
      ref={ref}
    >
      {initialRegion && (
        <Mapbox.Camera
          zoomLevel={14}
          centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
          animationMode="flyTo"
          animationDuration={1000}
        />
      )}
      {children}
    </Mapbox.MapView>
  );
});

// iOS implementation - MapLibre Marker using PointAnnotation
export function PlatformMarker(props: MarkerProps) {
  const { coordinate, title, onPress, pinColor } = props;
  const id = `marker-${coordinate.latitude}-${coordinate.longitude}`;

  return (
    <Mapbox.PointAnnotation
      id={id}
      coordinate={[coordinate.longitude, coordinate.latitude]}
      onSelected={onPress}
    >
      <Mapbox.Callout title={title || ''} />
    </Mapbox.PointAnnotation>
  );
}

// iOS implementation - no provider needed for MapLibre
export const PLATFORM_PROVIDER_GOOGLE = undefined;

