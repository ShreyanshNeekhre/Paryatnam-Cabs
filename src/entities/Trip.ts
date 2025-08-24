export interface Trip {
  id: string;
  userId: string;
  driverId?: string;
  pickupLocation: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  destination: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  serviceType: 'airport' | 'rental' | 'intercity' | 'delivery';
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  distance?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledAt?: Date;
} 