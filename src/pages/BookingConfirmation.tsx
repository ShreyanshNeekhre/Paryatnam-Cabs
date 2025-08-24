import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import { Trip } from "../entities/Trip";
import { formatCurrency, formatDistance, formatDuration } from "../utils";

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [driver] = useState({
    id: "DR001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    carModel: "Toyota Innova",
    carNumber: "DL 01 AB 1234",
    avatar: "🚗",
    eta: "5 min"
  });

  useEffect(() => {
    // Mock trip data
    setTrip({
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
      status: "confirmed",
      fare: 850,
      distance: 18.5,
      duration: 45,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }, []);

  const handleCallDriver = () => {
    window.open(`tel:${driver.phone}`);
  };

  const handleMessageDriver = () => {
    // In a real app, this would open a chat interface
    alert("Chat feature coming soon!");
  };

  const handleCancelTrip = () => {
    if (window.confirm("Are you sure you want to cancel this trip?")) {
      navigate("/");
    }
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
          <h1 className="text-xl font-bold">Trip Confirmed</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="px-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-600 rounded-lg p-6 text-center"
          >
            <div className="text-2xl mb-2">✅</div>
            <h2 className="text-xl font-bold mb-1">Trip Confirmed!</h2>
            <p className="text-green-100">Your driver is on the way</p>
          </motion.div>

          {/* Driver Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Driver Details</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm">{driver.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl">
                {driver.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{driver.name}</h4>
                <p className="text-gray-400 text-sm">{driver.carModel} • {driver.carNumber}</p>
                <p className="text-primary-400 text-sm">ETA: {driver.eta}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleCallDriver}
                className="flex-1 bg-primary-600 hover:bg-primary-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                onClick={handleMessageDriver}
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </motion.div>

          {/* Trip Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Pickup</p>
                  <p className="font-medium">{trip?.pickupLocation.address}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Destination</p>
                  <p className="font-medium">{trip?.destination.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dark-600">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Distance</span>
                <span className="font-medium">{trip?.distance && formatDistance(trip.distance)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Duration</span>
                <span className="font-medium">{trip?.duration && formatDuration(trip.duration)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Fare</span>
                <span className="text-primary-400">{trip?.fare && formatCurrency(trip.fare)}</span>
              </div>
            </div>
          </motion.div>

          {/* Cancel Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleCancelTrip}
              variant="outline"
              className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              Cancel Trip
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 