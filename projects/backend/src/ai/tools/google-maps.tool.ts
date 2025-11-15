/**
 * @fileOverview A Genkit tool for interacting with the Google Maps Places API.
 */

import { Place, TextSearchRequest } from '@googlemaps/google-maps-services-js';
import { mapsClient } from '../maps';
import { ai } from '../genkit';
import { z } from 'genkit';

export const findAthensPlaceDetails = ai.defineTool(
  {
    name: 'findAthensPlaceDetails',
    description:
      'Search for places in Athens, Greece to get details like name, description, category, and precise coordinates. Use this to find attractions, restaurants, or other points of interest.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The search query for the place in Athens (e.g., "Acropolis Museum" or "best souvlaki near Monastiraki").',
        ),
    }),
    outputSchema: z.array(
      z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    ),
  },
  async ({ query }) => {
    const request: TextSearchRequest = {
      params: {
        query: `${query}, Athens, Greece`,
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    };

    const response = await mapsClient.textSearch(request);

    return response.data.results.map((place: Place) => ({
      name: place.name!,
      latitude: place.geometry!.location.lat,
      longitude: place.geometry!.location.lng,
    }));
  },
);
