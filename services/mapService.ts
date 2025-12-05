
export interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

export const searchAddress = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
    if (!response.ok) throw new Error('Geocoding fetch failed');
    return await response.json();
  } catch (error) {
    console.error("Geocoding Error:", error);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}`);
    if (!response.ok) throw new Error('Reverse geocoding fetch failed');
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

export interface RouteResult {
  coordinates: { lat: number; lng: number }[];
  distance: string;
  duration: string;
}

export const getRoute = async (start: { lat: number; lng: number }, end: { lat: number; lng: number }): Promise<RouteResult | null> => {
  try {
    // OSRM expects lng,lat
    const url = `${OSRM_BASE_URL}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Route fetch failed');
    
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map((coord: number[]) => ({
      lat: coord[1],
      lng: coord[0]
    }));

    // Convert distance (meters) to km
    const distanceKm = (route.distance / 1000).toFixed(1) + ' km';
    
    // Convert duration (seconds) to readable format
    const durationMin = Math.round(route.duration / 60);
    const durationStr = durationMin > 60 
      ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`
      : `${durationMin} min`;

    return {
      coordinates,
      distance: distanceKm,
      duration: durationStr
    };
  } catch (error) {
    console.error("Routing Error:", error);
    return null;
  }
};
