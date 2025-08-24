import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Car, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Trip } from "../entities/Trip";
import { formatCurrency, formatDistance, formatDuration } from "../utils";
import BottomNavigation from "../components/BottomNavigation";

const MyRides: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    // Mock trip data
    setTrips([
      {
        id: "TRIP001",
        userId: "1",
        driverId: "DR001",
        pickupLocation: {
          address: "Home Address, Delhi",
          coordinates: { lat: 28.7041, lng: 77.1025 }
        },
        destination: {
          address: "Indira Gandhi International Airport, Delhi",
          coordinates: { lat: 28.5562, lng: 77.1000 }
        },
        serviceType: "airport",
        status: "in-progress",
        fare: 850,
        distance: 18.5,
        duration: 45,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date()
      },
      {
        id: "TRIP002",
        userId: "1",
        driverId: "DR002",
        pickupLocation: {
          address: "Connaught Place, Delhi",
          coordinates: { lat: 28.6315, lng: 77.2167 }
        },
        destination: {
          address: "Lajpat Nagar, Delhi",
          coordinates: { lat: 28.5670, lng: 77.2431 }
        },
        serviceType: "rental",
        status: "completed",
        fare: 320,
        distance: 8.2,
        duration: 25,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
      },
      {
        id: "TRIP003",
        userId: "1",
        driverId: "DR003",
        pickupLocation: {
          address: "Delhi Railway Station",
          coordinates: { lat: 28.6421, lng: 77.2205 }
        },
        destination: {
          address: "Gurgaon Cyber City",
          coordinates: { lat: 28.5011, lng: 77.0945 }
        },
        serviceType: "intercity",
        status: "completed",
        fare: 650,
        distance: 25.3,
        duration: 55,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000)
      }
    ]);
  }, []);

  const currentTrips = trips.filter(trip => trip.status === 'in-progress' || trip.status === 'confirmed');
  const pastTrips = trips.filter(trip => trip.status === 'completed' || trip.status === 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'in-progress':
        return 'text-green-400';
      case 'completed':
        return 'text-blue-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'in-progress':
        return '🚗';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '⏳';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-800 to-dark-900 text-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
          <h1 className="text-xl font-bold">My Rides</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex space-x-2 max-w-2xl mx-auto">
          <motion.button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'current'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Current ({currentTrips.length})
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'past'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Past ({pastTrips.length})
          </motion.button>
        </div>
      </div>

      {/* Trip List */}
      <div className="px-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          {(activeTab === 'current' ? currentTrips : pastTrips).map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-700 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getStatusIcon(trip.status)}</div>
                  <div>
                    <h3 className="font-semibold capitalize">{trip.serviceType} Trip</h3>
                    <p className={`text-sm ${getStatusColor(trip.status)}`}>
                      {trip.status.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-400">{formatCurrency(trip.fare)}</p>
                  <p className="text-sm text-gray-400">{formatDate(trip.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">From</p>
                    <p className="text-sm font-medium">{trip.pickupLocation.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">To</p>
                    <p className="text-sm font-medium">{trip.destination.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.distance && formatDistance(trip.distance)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{trip.duration && formatDuration(trip.duration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Car className="w-4 h-4" />
                  <span className="capitalize">{trip.serviceType}</span>
                </div>
              </div>

              {trip.status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-dark-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Rate your trip</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          className="text-gray-400 hover:text-yellow-400"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star className="w-5 h-5" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {(activeTab === 'current' ? currentTrips : pastTrips).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold mb-2">
                No {activeTab === 'current' ? 'current' : 'past'} trips
              </h3>
              <p className="text-gray-400">
                {activeTab === 'current' 
                  ? "You don't have any active trips right now."
                  : "Your trip history will appear here."
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default MyRides; 