import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '@/contexts/app-context';
import { apiService } from '@/services/api';
import {
  Budget,
  TravelStyle,
  CompanionType,
  ATHENS_INTERESTS,
  AthensInterest,
} from '@/types/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setTripPreferences, setTripSummary, setIsLoadingPreferences } = useApp();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Form state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const [budget, setBudget] = useState<Budget>('medium');
  const [interests, setInterests] = useState<Set<AthensInterest>>(new Set(['history', 'food']));
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('relaxed');
  const [companionType, setCompanionType] = useState<CompanionType>('couple');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: AthensInterest) => {
    const newInterests = new Set(interests);
    if (newInterests.has(interest)) {
      newInterests.delete(interest);
    } else {
      newInterests.add(interest);
    }
    setInterests(newInterests);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async () => {
    if (interests.size === 0) {
      alert('Please select at least one interest');
      return;
    }

    setIsLoading(true);
    setIsLoadingPreferences(true);

    try {
      const numberOfDays = calculateDays();
      const tripDates = `${formatDate(startDate)} to ${formatDate(endDate)}`;
      
      const preferences = {
        tripDates,
        numberOfDays,
        budget,
        interests: Array.from(interests),
        travelStyle,
        companionType,
        accessibilityNeeds,
      };

      // Save preferences
      setTripPreferences(preferences);

      // Summarize preferences
      const summary = await apiService.summarizeUserPreferences(preferences);
      setTripSummary(summary.result.summary);

      // Navigate to loading/trip generation screen
      router.replace('/trip-loading');
    } catch (error) {
      console.error('Error summarizing preferences:', error);
      alert('Failed to process your preferences. Please try again.');
      setIsLoadingPreferences(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Plan Your Athens Trip</Text>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip Dates</Text>
        
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={[styles.dateLabel, { color: colors.icon }]}>Start Date</Text>
          <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(startDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={[styles.dateLabel, { color: colors.icon }]}>End Date</Text>
          <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(endDate)}</Text>
        </TouchableOpacity>

        <Text style={[styles.daysText, { color: colors.icon }]}>
          {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
        </Text>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowStartPicker(Platform.OS === 'ios');
              if (date) setStartDate(date);
            }}
            minimumDate={new Date()}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowEndPicker(Platform.OS === 'ios');
              if (date) setEndDate(date);
            }}
            minimumDate={startDate}
          />
        )}
      </View>

      {/* Budget Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Budget</Text>
        <View style={styles.optionsRow}>
          {(['low', 'medium', 'high'] as Budget[]).map((b) => (
            <TouchableOpacity
              key={b}
              style={[
                styles.optionButton,
                { borderColor: colors.border },
                budget === b && { backgroundColor: colors.primary },
              ]}
              onPress={() => setBudget(b)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: budget === b ? '#FFFFFF' : colors.text },
                ]}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Interests Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Interests</Text>
        <View style={styles.interestsGrid}>
          {ATHENS_INTERESTS.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestChip,
                { borderColor: colors.border },
                interests.has(interest) && { backgroundColor: colors.primary },
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text
                style={[
                  styles.interestText,
                  { color: interests.has(interest) ? '#FFFFFF' : colors.text },
                ]}
              >
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Travel Style */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Travel Style</Text>
        <View style={styles.optionsRow}>
          {(['relaxed', 'packed'] as TravelStyle[]).map((style) => (
            <TouchableOpacity
              key={style}
              style={[
                styles.optionButton,
                { borderColor: colors.border },
                travelStyle === style && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTravelStyle(style)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: travelStyle === style ? '#FFFFFF' : colors.text },
                ]}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Companion Type */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Traveling With</Text>
        <View style={styles.optionsRow}>
          {(['solo', 'couple', 'family', 'friends'] as CompanionType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                { borderColor: colors.border },
                companionType === type && { backgroundColor: colors.primary },
              ]}
              onPress={() => setCompanionType(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: companionType === type ? '#FFFFFF' : colors.text },
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Accessibility Needs */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.checkboxRow, { borderColor: colors.border }]}
          onPress={() => setAccessibilityNeeds(!accessibilityNeeds)}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.border },
              accessibilityNeeds && { backgroundColor: colors.primary },
            ]}
          >
            {accessibilityNeeds && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.text }]}>
            I have accessibility needs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Generate My Itinerary</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  daysText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
