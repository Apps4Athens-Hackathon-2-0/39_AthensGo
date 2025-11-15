import { Client } from '@googlemaps/google-maps-services-js';

// Initialize the Google Maps client.
// It will automatically use the GOOGLE_MAPS_API_KEY environment variable.
export const mapsClient = new Client({});
