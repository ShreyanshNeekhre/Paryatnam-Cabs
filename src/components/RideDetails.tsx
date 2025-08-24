import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Car, Calendar, Navigation, ArrowLeft } from "lucide-react";
import { LocationSuggestion } from "../types/location";

interface RideDetailsProps {
  pickup: LocationSuggestion | null;
  destination: LocationSuggestion | null;
  stops: LocationSuggestion[];
  distance: string;
  duration: string;
  carType: {
    name: string;
    icon: string;
    estimatedFare: number;
    capacity: number;
    features: string[];
    baseFare: number;
    perKmRate: number;
  };
  scheduledDate: Date;
  scheduledTime: string;
  onBack: () => void;
  onConfirm: () => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({
  pickup,
  destination,
  stops,
  distance,
  duration,
  carType,
  scheduledDate,
  scheduledTime,
  onBack,
  onConfirm
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    if (time === "now") return "Immediate pickup";
    
    // Handle custom time (HH:MM format)
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':').map(Number);
      const timeString = new Date();
      timeString.setHours(hours, minutes, 0, 0);
      return timeString.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // Handle predefined time slots
    const minutes = parseInt(time);
    if (minutes === 15) return "Pickup in 15 minutes";
    if (minutes === 30) return "Pickup in 30 minutes";
    if (minutes === 60) return "Pickup in 1 hour";
    
    return `Pickup in ${minutes} minutes`;
  };

  const formatDuration = (duration: string) => {
    // If duration is already in hours format (e.g., "1h 30m"), return as is
    if (duration.includes('h') || duration.includes('hour')) {
      return duration;
    }
    
    // Convert minutes to hours format
    const minutes = parseInt(duration.replace(/[^\d]/g, ''));
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `${hours}h ${remainingMinutes}m`;
    }
    return duration; // Keep original if less than 60 minutes
  };

  const parseDistance = (distance: string) => {
    return parseFloat(distance.replace(/[^\d.]/g, ''));
  };

  const calculateFareBreakdown = () => {
    const distanceKm = parseDistance(distance);
    const baseFare = carType.baseFare || 50;
    const perKmRate = carType.perKmRate || 12;
    const distanceFare = Math.round(distanceKm * perKmRate);
    const totalFare = baseFare + distanceFare;
    
    return {
      baseFare,
      distanceFare,
      totalFare
    };
  };

  const fareBreakdown = calculateFareBreakdown();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-700 rounded-lg overflow-hidden relative"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Ride Details</h3>
            <p className="text-primary-100 text-sm">Review your trip details</p>
          </div>
          <motion.button
            onClick={onBack}
            className="text-white hover:text-primary-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Route Information */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Navigation className="w-5 h-5 mr-2" />
            Route Details
          </h4>
          
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Pickup</p>
                <p className="text-sm font-medium text-white">{pickup?.address || 'Pickup location'}</p>
              </div>
            </div>
            
            {/* Stops */}
            {stops && stops.length > 0 && stops.map((stop, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Stop {index + 1}</p>
                  <p className="text-sm font-medium text-white">{stop.address}</p>
                </div>
              </div>
            ))}
            
            {/* Destination */}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Destination</p>
                <p className="text-sm font-medium text-white">{destination?.address || 'Destination'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-dark-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">{formatDuration(duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">{distance}</span>
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Car className="w-5 h-5 mr-2" />
            Vehicle Details
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{carType.icon}</div>
              <div>
                <p className="font-medium text-white">{carType.name}</p>
                <p className="text-sm text-gray-400">Capacity: {carType.capacity} persons</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary-400">₹{fareBreakdown.totalFare}</p>
              <p className="text-xs text-gray-400">Estimated fare</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {carType.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-dark-500 rounded text-xs text-gray-300"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Schedule Details */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Details
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Date:</span>
              <span className="text-sm text-white">{formatDate(scheduledDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Time:</span>
              <span className="text-sm text-white">{formatTime(scheduledTime)}</span>
            </div>
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">Fare Breakdown</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Base fare:</span>
              <span className="text-sm text-white">₹{fareBreakdown.baseFare}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Distance fare ({parseDistance(distance)} km × ₹{carType.perKmRate || 12}/km):</span>
              <span className="text-sm text-white">₹{fareBreakdown.distanceFare}</span>
            </div>
            <div className="border-t border-dark-500 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium text-white">Total:</span>
                <span className="font-bold text-primary-400">₹{fareBreakdown.totalFare}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="sticky bottom-0 p-4 bg-dark-800 border-t border-dark-600 shadow-lg">
        <motion.button
          onClick={onConfirm}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">Confirm Pickup Location</span>
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.button>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          Review and confirm your pickup location
        </p>
      </div>
    </motion.div>
  );
};

export default RideDetails; 