export interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  type: 'recent' | 'saved' | 'popular' | 'google';
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RouteStop {
  id: string;
  location: LocationSuggestion;
  order: number;
  type: 'pickup' | 'stop' | 'destination';
}

export interface MultiDestinationRoute {
  pickup: LocationSuggestion;
  stops: LocationSuggestion[];
  destination: LocationSuggestion;
  totalDistance?: string;
  totalDuration?: string;
  estimatedFare?: number;
} 