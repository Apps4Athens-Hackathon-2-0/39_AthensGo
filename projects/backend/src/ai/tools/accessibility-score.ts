import { AccessibilityAttributes } from "../types/accessibility";

export function computeAccessibilityScore(
  attrs: AccessibilityAttributes | null | undefined,
): number | null {
  if (!attrs) return null;

  // Weights sum to 1
  const weights = {
    entrance: 0.4,
    restroom: 0.25,
    parking: 0.2,
    seating: 0.15,
  } as const;

  let score = 0;
  let totalWeight = 0;

  // Count all available attributes
  if (
    attrs.wheelchairAccessibleEntrance !== null &&
    attrs.wheelchairAccessibleEntrance !== undefined
  ) {
    totalWeight += weights.entrance;
    score += (attrs.wheelchairAccessibleEntrance ? 1 : 0) * weights.entrance;
  }
  if (
    attrs.wheelchairAccessibleRestroom !== null &&
    attrs.wheelchairAccessibleRestroom !== undefined
  ) {
    totalWeight += weights.restroom;
    score += (attrs.wheelchairAccessibleRestroom ? 1 : 0) * weights.restroom;
  }
  if (
    attrs.wheelchairAccessibleParking !== null &&
    attrs.wheelchairAccessibleParking !== undefined
  ) {
    totalWeight += weights.parking;
    score += (attrs.wheelchairAccessibleParking ? 1 : 0) * weights.parking;
  }
  if (
    attrs.wheelchairAccessibleSeating !== null &&
    attrs.wheelchairAccessibleSeating !== undefined
  ) {
    totalWeight += weights.seating;
    score += (attrs.wheelchairAccessibleSeating ? 1 : 0) * weights.seating;
  }

  if (totalWeight === 0) {
    // No accessibility data available
    return null;
  }

  // Normalize to 0-100
  const normalized = (score / totalWeight) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}
