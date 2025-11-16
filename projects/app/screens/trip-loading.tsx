import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/app-context';
import { apiService } from '@/services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const LOADING_MESSAGES = [
  'Crafting your amazing Athenian trip...',
  'Finding the perfect spots for you...',
  'Planning your daily adventures...',
  'Discovering hidden gems...',
  'Personalizing your experience...',
  'Almost ready...',
];

export default function TripLoadingScreen() {
  const router = useRouter();
  const {
    tripPreferences,
    tripSummary,
    addDailyItinerary,
    setIsLoadingItinerary,
    setIsLoadingPreferences,
  } = useApp();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [messageIndex, setMessageIndex] = useState(0);
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);

  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Generate itinerary
  useEffect(() => {
    if (!tripPreferences || !tripSummary || hasStartedGeneration) {
      return;
    }

    setHasStartedGeneration(true);
    setIsLoadingItinerary(true);
    setIsLoadingPreferences(false);

    const generateItinerary = async () => {
      try {
        const itineraryData = {
          tripDates: tripPreferences.tripDates,
          numberOfDays: tripPreferences.numberOfDays,
          budget: tripPreferences.budget,
          interests: tripSummary, // Use the AI-generated summary
          travelStyle: tripPreferences.travelStyle,
          companionType: tripPreferences.companionType,
          accessibilityNeeds: tripPreferences.accessibilityNeeds,
        };

        // Stream itinerary day by day
        let firstDayReceived = false;
        for await (const dailyItinerary of apiService.generateItineraryStream(itineraryData)) {
          addDailyItinerary(dailyItinerary);
          
          // Navigate to trip screen after first day is received
          if (!firstDayReceived) {
            firstDayReceived = true;
            setIsLoadingItinerary(false);
            router.replace('/(tabs)');
          }
        }

        setIsLoadingItinerary(false);
      } catch (error) {
        console.error('Error generating itinerary:', error);
        alert('Failed to generate itinerary. Please try again.');
        setIsLoadingItinerary(false);
        router.replace('/onboarding');
      }
    };

    generateItinerary();
  }, [tripPreferences, tripSummary, hasStartedGeneration]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.message, { color: colors.text }]}>
          {LOADING_MESSAGES[messageIndex]}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          This may take a few moments
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
