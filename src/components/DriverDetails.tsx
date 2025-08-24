import React from "react";
import { motion } from "framer-motion";
import { User, Phone, Star, Car, MapPin, Clock, CheckCircle, Shield } from "lucide-react";

interface DriverDetailsProps {
  onDone: () => void;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ onDone }) => {
  // Mock driver data
  const driver = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    totalRides: 1247,
    carModel: "Swift Dzire",
    carNumber: "MP-20-AB-1234",
    carColor: "White",
    eta: "3-4 min",
    photo: "👨‍💼" // Using emoji as placeholder
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-700 rounded-lg overflow-hidden relative min-h-screen"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-lg font-semibold text-white mb-1">Booking Confirmed!</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Driver Information */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Driver Details
          </h4>
          
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{driver.photo}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h5 className="font-semibold text-white">{driver.name}</h5>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300">{driver.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2">{driver.totalRides} rides completed</p>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">{driver.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Car className="w-5 h-5 mr-2" />
            Vehicle Details
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Car Model:</span>
              <span className="text-sm text-white">{driver.carModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Car Number:</span>
              <span className="text-sm text-white font-mono">{driver.carNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Color:</span>
              <span className="text-sm text-white">{driver.carColor}</span>
            </div>
          </div>
        </div>



        {/* Safety Tips */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Safety Tips
          </h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Verify the car number and driver details</li>
            <li>• Share your trip status with family/friends</li>
            <li>• Sit in the back seat for safety</li>
            <li>• Keep your phone handy during the trip</li>
          </ul>
        </div>
      </div>

      {/* Done Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-700 border-t border-dark-600 z-50">
        <motion.button
          onClick={onDone}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg border-2 border-primary-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            <span className="text-lg font-bold">Done</span>
          </div>
        </motion.button>
        

      </div>
    </motion.div>
  );
};

export default DriverDetails;
