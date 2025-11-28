
export interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const searchAddress = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
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
