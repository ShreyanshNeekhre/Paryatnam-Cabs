interface GooglePlacesResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

interface GooglePlacesResponse {
  predictions: GooglePlacesResult[];
  status: string;
  error_message?: string;
}

class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || '';
  }

  async getPlacePredictions(input: string, sessionToken?: string): Promise<GooglePlacesResult[]> {
    if (!this.apiKey) {
      console.warn('Google Places API key not found. Please add REACT_APP_GOOGLE_PLACES_API_KEY to your environment variables.');
      return [];
    }

    try {
      console.log('Searching for:', input); // Debug log

      // Try multiple search strategies like Google Maps
      const searchStrategies = [
        // Strategy 1: Broad search with all types
        {
          types: 'establishment|geocode|airport|transit_station|point_of_interest',
          components: ''
        },
        // Strategy 2: Just geocode for addresses
        {
          types: 'geocode',
          components: ''
        },
        // Strategy 3: Establishment only for businesses
        {
          types: 'establishment',
          components: ''
        }
      ];

      for (const strategy of searchStrategies) {
        const params = new URLSearchParams({
          input,
          key: this.apiKey,
          types: strategy.types,
          language: 'en',
          ...(sessionToken && { sessiontoken: sessionToken })
        });

        console.log('Trying strategy:', strategy.types); // Debug log

        const response = await fetch(`${this.baseUrl}/autocomplete/json?${params}`);
        const data: GooglePlacesResponse = await response.json();

        console.log('API Response:', data.status, data.predictions?.length || 0); // Debug log

        if (data.status === 'OK' && data.predictions && data.predictions.length > 0) {
          return data.predictions;
        } else if (data.status === 'REQUEST_DENIED') {
          console.error('API Key issue:', data.error_message);
          return [];
        } else if (data.status === 'OVER_QUERY_LIMIT') {
          console.error('API quota exceeded');
          return [];
        } else if (data.status === 'ZERO_RESULTS') {
          console.log('No results for strategy:', strategy.types);
          continue; // Try next strategy
        } else {
          console.error('Google Places API error:', data.status, data.error_message);
        }
      }

      return [];
    } catch (error) {
      console.error('Error fetching place predictions:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string, sessionToken?: string) {
    if (!this.apiKey) {
      console.warn('Google Places API key not found.');
      return null;
    }

    try {
      const params = new URLSearchParams({
        place_id: placeId,
        key: this.apiKey,
        fields: 'formatted_address,geometry,name,place_id,types',
        language: 'en',
        ...(sessionToken && { sessiontoken: sessionToken })
      });

      const response = await fetch(`${this.baseUrl}/details/json?${params}`);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      } else {
        console.error('Google Places Details API error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  // Generate a session token for billing optimization
  generateSessionToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const params = new URLSearchParams({
        input: 'test',
        key: this.apiKey,
        types: 'geocode'
      });

      const response = await fetch(`${this.baseUrl}/autocomplete/json?${params}`);
      const data = await response.json();

      if (data.status === 'REQUEST_DENIED') {
        console.error('API Key is invalid or restricted:', data.error_message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }
}

export const googlePlacesService = new GooglePlacesService();
export type { GooglePlacesResult }; 