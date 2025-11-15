import { AccessibilityAttributes } from "./accessibility";

export interface PlaceEnrichment {
  rating?: number | null;
  userRatingsTotal?: number | null;
  priceLevel?: number | null; // Google price_level 0-4
  priceString?: string | null; // $, $$, $$$, $$$$
  websiteUrl?: string | null;
  googleMapsUrl?: string | null;
  isFoodPlace?: boolean;
  accessibility?: AccessibilityAttributes | null;
}
