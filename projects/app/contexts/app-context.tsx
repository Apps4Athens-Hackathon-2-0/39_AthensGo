import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  SummarizeUserPreferencesDto,
  DailyItinerary,
  Budget,
  TravelStyle,
  CompanionType,
} from '@/types/api';

interface User {
  email: string;
  token: string;
}

interface AppContextType {
  // Authentication
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;

  // Trip preferences
  tripPreferences: SummarizeUserPreferencesDto | null;
  setTripPreferences: (prefs: SummarizeUserPreferencesDto | null) => void;

  // Trip summary (from AI)
  tripSummary: string | null;
  setTripSummary: (summary: string | null) => void;

  // Generated itinerary
  itinerary: DailyItinerary[];
  setItinerary: (itinerary: DailyItinerary[]) => void;
  addDailyItinerary: (daily: DailyItinerary) => void;

  // Loading states
  isLoadingPreferences: boolean;
  setIsLoadingPreferences: (loading: boolean) => void;
  isLoadingItinerary: boolean;
  setIsLoadingItinerary: (loading: boolean) => void;

  // Reset functions
  resetTrip: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tripPreferences, setTripPreferences] = useState<SummarizeUserPreferencesDto | null>(null);
  const [tripSummary, setTripSummary] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<DailyItinerary[]>([]);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);

  const addDailyItinerary = (daily: DailyItinerary) => {
    setItinerary((prev) => {
      const existing = prev.find((d) => d.day === daily.day);
      if (existing) {
        return prev.map((d) => (d.day === daily.day ? daily : d));
      }
      return [...prev, daily].sort((a, b) => a.day - b.day);
    });
  };

  const resetTrip = () => {
    setTripPreferences(null);
    setTripSummary(null);
    setItinerary([]);
    setIsLoadingPreferences(false);
    setIsLoadingItinerary(false);
  };

  const logout = () => {
    setUser(null);
    resetTrip();
  };

  const value: AppContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    tripPreferences,
    setTripPreferences,
    tripSummary,
    setTripSummary,
    itinerary,
    setItinerary,
    addDailyItinerary,
    isLoadingPreferences,
    setIsLoadingPreferences,
    isLoadingItinerary,
    setIsLoadingItinerary,
    resetTrip,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
