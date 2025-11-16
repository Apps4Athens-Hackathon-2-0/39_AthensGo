import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { PlatformMapView, PlatformMarker, PLATFORM_PROVIDER_GOOGLE } from '@/components/platform-map';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/contexts/app-context';
import { ItineraryItem } from '@/types/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;
const ITINERARY_HEIGHT = SCREEN_HEIGHT * 0.5 - 100; // Account for tab bar

export default function TripScreen() {
  const { itinerary, isLoadingItinerary, tripPreferences } = useApp();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [bookedItems, setBookedItems] = useState<Set<string>>(new Set());
  const mapRef = useRef<any>(null);

  const currentDayItinerary = itinerary.find((day) => day.day === selectedDay);
  const numberOfDays = tripPreferences?.numberOfDays || 3;

  // Center map on items when day changes (only on native)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    
    if (currentDayItinerary && currentDayItinerary.items.length > 0 && mapRef.current) {
      const coordinates = currentDayItinerary.items.map((item) => ({
        latitude: item.latitude,
        longitude: item.longitude,
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [selectedDay, currentDayItinerary]);

  const handleMarkerPress = (item: ItineraryItem) => {
    setSelectedItem(item);
  };

  const handleOpenMaps = (item: ItineraryItem) => {
    if (item.enrichment?.googleMapsUrl) {
      Linking.openURL(item.enrichment.googleMapsUrl);
    } else {
      const url = Platform.select({
        ios: `maps:0,0?q=${item.latitude},${item.longitude}`,
        android: `geo:0,0?q=${item.latitude},${item.longitude}(${encodeURIComponent(item.name)})`,
      });
      if (url) Linking.openURL(url);
    }
  };

  const handleBook = (item: ItineraryItem) => {
    setBookedItems((prev) => new Set(prev).add(item.name));
    alert(`Booking confirmed for ${item.name}! (Mock booking)`);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={14} color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="star-half" name="star-half" size={14} color="#FFD700" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`star-empty-${i}`} name="star-outline" size={14} color="#FFD700" />);
    }

    return <View style={styles.starsRow}>{stars}</View>;
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    let iconName: keyof typeof MaterialIcons.glyphMap = 'place';
    
    switch (category) {
      case 'culinary':
        iconName = 'restaurant';
        break;
      case 'cultural':
        iconName = 'museum';
        break;
      case 'scenic':
        iconName = 'landscape';
        break;
      case 'activity':
        iconName = 'local-activity';
        break;
    }

    return <MaterialIcons name={iconName} size={20} color={colors.primary} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <PlatformMapView
          ref={mapRef}
          provider={PLATFORM_PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.9838,
            longitude: 23.7275,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {currentDayItinerary?.items.map((item, index) => (
            <PlatformMarker
              key={`${item.name}-${index}`}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name}
              description={item.description}
              onPress={() => handleMarkerPress(item)}
              pinColor={colors.primary}
            />
          ))}
        </PlatformMapView>

        {selectedItem && (
          <View style={[styles.mapCallout, { backgroundColor: colors.card }]}>
            <Text style={[styles.calloutTitle, { color: colors.text }]} numberOfLines={1}>
              {selectedItem.name}
            </Text>
            <TouchableOpacity
              style={[styles.calloutButton, { backgroundColor: colors.primary }]}
              onPress={() => handleOpenMaps(selectedItem)}
            >
              <Text style={styles.calloutButtonText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Day Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {Array.from({ length: numberOfDays }, (_, i) => i + 1).map((day) => {
            const dayData = itinerary.find((d) => d.day === day);
            const isActive = day === selectedDay;
            const isLoading = !dayData && day <= (itinerary[itinerary.length - 1]?.day || 0) + 1;
            const isDisabled = !dayData && !isLoading;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.tab,
                  { borderBottomColor: colors.border },
                  isActive && { borderBottomColor: colors.primary },
                  isDisabled && styles.tabDisabled,
                ]}
                onPress={() => !isDisabled && setSelectedDay(day)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.text },
                    isActive && { color: colors.primary, fontWeight: '600' },
                    isDisabled && { color: colors.icon, opacity: 0.5 },
                  ]}
                >
                  Day {day}
                </Text>
                {isLoading && <ActivityIndicator size="small" color={colors.icon} style={styles.tabLoader} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Itinerary List */}
      <ScrollView style={styles.itineraryContainer} contentContainerStyle={styles.itineraryContent}>
        {isLoadingItinerary && !currentDayItinerary ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading your itinerary...</Text>
          </View>
        ) : currentDayItinerary ? (
          currentDayItinerary.items.map((item, index) => (
            <View
              key={`${item.name}-${index}`}
              style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.itemHeader}>
                <CategoryIcon category={item.category} />
                <TouchableOpacity
                  style={styles.itemTitleContainer}
                  onPress={() => handleOpenMaps(item)}
                >
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{item.name}</Text>
                  <Ionicons name="navigate" size={16} color={colors.primary} style={styles.navigateIcon} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.itemDescription, { color: colors.icon }]}>{item.description}</Text>

              {item.enrichment && (
                <View style={styles.itemMeta}>
                  {item.enrichment.rating && (
                    <View style={styles.metaRow}>
                      {renderStars(item.enrichment.rating)}
                      <Text style={[styles.metaText, { color: colors.icon }]}>
                        ({item.enrichment.userRatingsTotal?.toLocaleString()})
                      </Text>
                    </View>
                  )}

                  {item.enrichment.priceString && (
                    <View style={styles.metaRow}>
                      <Text style={[styles.priceText, { color: colors.text }]}>
                        {item.enrichment.priceString}
                      </Text>
                    </View>
                  )}

                  {item.enrichment.accessible && (
                    <View style={styles.metaRow}>
                      <MaterialIcons name="accessible" size={16} color={colors.primary} />
                      <Text style={[styles.metaText, { color: colors.primary }]}>Accessible</Text>
                    </View>
                  )}
                </View>
              )}

              {item.enrichment?.isFoodPlace && (
                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    { backgroundColor: bookedItems.has(item.name) ? colors.icon : colors.primary },
                  ]}
                  onPress={() => handleBook(item)}
                  disabled={bookedItems.has(item.name)}
                >
                  <Ionicons
                    name={bookedItems.has(item.name) ? 'checkmark-circle' : 'calendar'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.bookButtonText}>
                    {bookedItems.has(item.name) ? 'Booked' : 'Book Table'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.icon }]}>No itinerary for this day yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: MAP_HEIGHT,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapCallout: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  calloutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  calloutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    borderTopWidth: 1,
  },
  tabs: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabDisabled: {
    opacity: 0.5,
  },
  tabText: {
    fontSize: 15,
  },
  tabLoader: {
    marginLeft: 8,
  },
  itineraryContainer: {
    flex: 1,
  },
  itineraryContent: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  navigateIcon: {
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  itemMeta: {
    gap: 8,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  metaText: {
    fontSize: 13,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
