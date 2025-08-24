import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Car, Calendar, Users, Star, CheckCircle, Shield } from "lucide-react";

interface RentalCar {
  id: string;
  name: string;
  description: string;
  icon: string;
  capacity: number;
  perDayRate: number;
  features: string[];
  rating: number;
  totalRentals: number;
  image: string;
}

interface RentalDetailsProps {
  startDate: Date;
  endDate: Date;
  selectedCar: RentalCar;
  onBack: () => void;
  onConfirm: () => void;
}

const RentalDetails: React.FC<RentalDetailsProps> = ({
  startDate,
  endDate,
  selectedCar,
  onBack,
  onConfirm
}) => {
  const calculateRentalDays = (): number => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Add 1 to include both start and end dates in the count
    return diffDays > 0 ? diffDays + 1 : 1;
  };

  const rentalDays = calculateRentalDays();

  const getDiscountPercentage = (days: number) => {
    if (days >= 30) return 15;
    if (days >= 15) return 10;
    if (days >= 7) return 5;
    return 0;
  };

  const getDiscountedRate = (perDayRate: number) => {
    const discount = getDiscountPercentage(rentalDays);
    return perDayRate * (1 - discount / 100);
  };

  const calculateTotalRent = (perDayRate: number) => {
    return perDayRate * rentalDays;
  };

  const discountedRate = getDiscountedRate(selectedCar.perDayRate);
  const totalRent = calculateTotalRent(discountedRate);
  const originalTotal = calculateTotalRent(selectedCar.perDayRate);
  const discountAmount = originalTotal - totalRent;

  const formatDates = () => {
    return {
      start: startDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      end: endDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    };
  };

  const dates = formatDates();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-700 rounded-lg overflow-hidden relative min-h-screen"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Rental Details</h3>
            <p className="text-primary-100 text-sm">Review your rental booking</p>
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
      <div className="p-4 space-y-4 pb-32">
        {/* Car Information */}
        <div className="bg-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{selectedCar.image}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-lg">{selectedCar.name}</h4>
              <p className="text-sm text-gray-400">{selectedCar.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300">{selectedCar.rating}</span>
                <span className="text-xs text-gray-500">({selectedCar.totalRentals} rentals)</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Capacity: {selectedCar.capacity} people</span>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{selectedCar.features.length} features</span>
            </div>
          </div>
        </div>

        {/* Rental Period */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Rental Period
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white font-medium">{rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Start Date:</span>
              <span className="text-white font-medium">{dates.start}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">End Date:</span>
              <span className="text-white font-medium">{dates.end}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">Car Features</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCar.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-600/20 border border-primary-600/30 rounded-full text-sm text-primary-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-dark-600 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">Pricing Breakdown</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Base Rate (per day):</span>
              <span className="text-white">₹{selectedCar.perDayRate}</span>
            </div>
            
            {getDiscountPercentage(rentalDays) > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount ({getDiscountPercentage(rentalDays)}%):</span>
                  <span className="text-green-400">-₹{discountAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discounted Rate (per day):</span>
                  <span className="text-white">₹{discountedRate.toFixed(0)}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-400">Total ({rentalDays} days):</span>
              <span className="text-white font-medium">₹{totalRent.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Rental Terms */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Rental Terms
          </h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Valid driving license required</li>
            <li>• Fuel charges not included</li>
            <li>• Insurance coverage included</li>
            <li>• 24/7 roadside assistance</li>
            <li>• Free cancellation up to 2 hours before pickup</li>
          </ul>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-700 border-t border-dark-600 z-50">
        <motion.button
          onClick={onConfirm}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg border-2 border-primary-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            <span className="text-lg font-bold">Confirm Rental - ₹{totalRent.toFixed(0)}</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RentalDetails;
