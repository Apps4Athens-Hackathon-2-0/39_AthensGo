/**
 * @fileOverview A Genkit tool for interacting with the Google Maps Places API.
 */

import {
  Place,
  TextSearchRequest,
  PlaceDetailsRequest,
  AddressType,
} from "@googlemaps/google-maps-services-js";
import { mapsClient } from "../maps";
import { ai } from "../genkit";
import { z } from "genkit";
import { PlaceEnrichment } from "../types/place.type";

interface PlaceDetailsResult {
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  website?: string;
  url?: string;
  types?: string[];
  wheelchair_accessible_entrance?: boolean;
  // Note: Legacy Places API only supports wheelchair_accessible_entrance
  // Other accessibility fields require the new Places API v1
}

interface PlaceWithExtras extends Place {
  place_id?: string;
  price_level?: number;
  types?: AddressType[];
}

function extractPriceLevel(
  obj: { price_level?: number } | null | undefined,
): number | null {
  return typeof obj?.price_level === "number" ? obj.price_level : null;
}

function extractPlaceId(p: PlaceWithExtras): string | undefined {
  return typeof p.place_id === "string" ? p.place_id : undefined;
}

function extractTypes(t: unknown): string[] {
  if (Array.isArray(t)) {
    return t.filter((v): v is string => typeof v === "string");
  }
  return [];
}

export function toPriceString(level?: number | null): string | null {
  if (level == null) return null;
  if (level <= 0) return "€";
  if (level === 1) return "€€";
  if (level === 2) return "€€€";
  if (level >= 3) return "€€€€";
  return null;
}

function isFood(types?: string[] | null): boolean {
  if (!types) return false;
  const foodTypes = new Set([
    "restaurant",
    "cafe",
    "bar",
    "bakery",
    "meal_takeaway",
    "meal_delivery",
  ]);
  return types.some((t) => foodTypes.has(t));
}

export const findAthensPlaceDetails = ai.defineTool(
  {
    name: "findAthensPlaceDetails",
    description:
      "Search for places in Athens, Greece to get details like name, description, category, precise coordinates, and optional enrichment.",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The search query for the place in Athens (e.g., "Acropolis Museum" or "best souvlaki near Monastiraki").',
        ),
      requireFoodPlace: z
        .boolean()
        .optional()
        .describe("If true, prefer/return only places related to food/drink."),
    }),
    outputSchema: z.array(
      z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        enrichment: z
          .object({
            rating: z.number().nullable().optional(),
            userRatingsTotal: z.number().nullable().optional(),
            priceLevel: z.number().nullable().optional(),
            priceString: z.string().nullable().optional(),
            websiteUrl: z.string().nullable().optional(),
            googleMapsUrl: z.string().nullable().optional(),
            isFoodPlace: z.boolean().optional(),
            accessible: z
              .boolean()
              .nullable()
              .optional()
              .describe(
                "Whether the place has wheelchair accessible entrance (true/false), or null if unknown.",
              ),
          })
          .optional(),
      }),
    ),
  },
  async ({ query, requireFoodPlace }) => {
    const request: TextSearchRequest = {
      params: {
        query: `${query}, Athens, Greece`,
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    };

    const response = await mapsClient.textSearch(request);

    const results = await Promise.all(
      response.data.results.map(async (place: Place) => {
        const typedPlace = place as PlaceWithExtras;
        const placeId = extractPlaceId(typedPlace);
        let enrichment: PlaceEnrichment = {
          rating:
            typeof typedPlace.rating === "number" ? typedPlace.rating : null,
          userRatingsTotal:
            typeof typedPlace.user_ratings_total === "number"
              ? typedPlace.user_ratings_total
              : null,
          priceLevel: extractPriceLevel(typedPlace),
          priceString: toPriceString(extractPriceLevel(typedPlace)),
          websiteUrl: null,
          googleMapsUrl: placeId
            ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
            : null,
          isFoodPlace: isFood(extractTypes(typedPlace.types)),
          accessible: null, // Will be fetched from Place Details if available
        };

        if (placeId) {
          try {
            const detailsReq: PlaceDetailsRequest = {
              params: {
                place_id: placeId,
                key: process.env.GOOGLE_MAPS_API_KEY!,
                fields: [
                  "url",
                  "website",
                  "price_level",
                  "rating",
                  "user_ratings_total",
                  "types",
                  "wheelchair_accessible_entrance",
                  // Note: Only wheelchair_accessible_entrance is supported in legacy Places API
                  // Other fields (restroom, parking, seating) require Places API (new) v1
                ],
              },
            };

            const details = await mapsClient.placeDetails(detailsReq);
            const r = details.data.result as PlaceDetailsResult | undefined;

            if (r) {
              enrichment = {
                rating:
                  typeof r.rating === "number"
                    ? r.rating
                    : (enrichment.rating ?? null),
                userRatingsTotal:
                  typeof r.user_ratings_total === "number"
                    ? r.user_ratings_total
                    : (enrichment.userRatingsTotal ?? null),
                priceLevel:
                  extractPriceLevel(r) ?? enrichment.priceLevel ?? null,
                priceString: toPriceString(
                  extractPriceLevel(r) ?? enrichment.priceLevel,
                ),
                websiteUrl:
                  typeof r.website === "string"
                    ? r.website
                    : (enrichment.websiteUrl ?? null),
                googleMapsUrl:
                  typeof r.url === "string"
                    ? r.url
                    : (enrichment.googleMapsUrl ?? null),
                isFoodPlace: isFood(extractTypes(r.types ?? typedPlace.types)),
                accessible:
                  typeof r.wheelchair_accessible_entrance === "boolean"
                    ? r.wheelchair_accessible_entrance
                    : null,
              };
            }
          } catch {
            // Silently ignore detail fetch errors
          }
        }

        return {
          name: place.name!,
          latitude: place.geometry!.location.lat,
          longitude: place.geometry!.location.lng,
          enrichment,
        };
      }),
    );

    if (requireFoodPlace) {
      return results.filter((r) => r.enrichment?.isFoodPlace);
    }
    return results;
  },
);
