// Accessibility-related shared types

// Simple boolean flag for whether user needs accessibility features
export type AccessibilityNeeds = boolean | null | undefined;

export interface AccessibilityAttributes {
  wheelchairAccessibleEntrance?: boolean | null;
  wheelchairAccessibleRestroom?: boolean | null;
  wheelchairAccessibleParking?: boolean | null;
  wheelchairAccessibleSeating?: boolean | null;
}
