import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Car, Users, Star, Check } from "lucide-react";

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

interface RentalCarSelectionProps {
  startDate: Date;
  endDate: Date;
  onCarSelect: (car: RentalCar) => void;
  onBack: () => void;
}

const RentalCarSelection: React.FC<RentalCarSelectionProps> = ({
  startDate,
  endDate,
  onCarSelect,
  onBack
}) => {
  const [selectedCar, setSelectedCar] = useState<RentalCar | null>(null);

  const calculateRentalDays = (): number => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Add 1 to include both start and end dates in the count
    return diffDays > 0 ? diffDays + 1 : 1;
  };

  const rentalDays = calculateRentalDays();

  const rentalCars: RentalCar[] = [
    {
      id: "mini",
      name: "Mini",
      description: "Compact car perfect for city driving",
      icon: "🚗",
      capacity: 4,
      perDayRate: 800,
      features: ["AC", "Music System", "Power Steering"],
      rating: 4.5,
      totalRentals: 1247,
      image: "🚗"
    },
    {
      id: "sedan",
      name: "Sedan",
      description: "Comfortable sedan for business and family trips",
      icon: "🚙",
      capacity: 5,
      perDayRate: 1200,
      features: ["AC", "Music System", "Power Steering", "Bluetooth"],
      rating: 4.7,
      totalRentals: 892,
      image: "🚙"
    },
    {
      id: "suv",
      name: "SUV",
      description: "Spacious SUV for group travel and luggage",
      icon: "🚐",
      capacity: 7,
      perDayRate: 1800,
      features: ["AC", "Music System", "Power Steering", "Bluetooth", "GPS"],
      rating: 4.6,
      totalRentals: 567,
      image: "🚐"
    },
    {
      id: "luxury",
      name: "Luxury",
      description: "Premium luxury car for special occasions",
      icon: "🏎️",
      capacity: 4,
      perDayRate: 3500,
      features: ["AC", "Premium Audio", "Leather Seats", "GPS", "Sunroof"],
      rating: 4.9,
      totalRentals: 234,
      image: "🏎️"
    }
  ];

  const handleCarSelect = (car: RentalCar) => {
    setSelectedCar(car);
  };

  const handleContinue = () => {
    if (selectedCar) {
      onCarSelect(selectedCar);
    }
  };

  const calculateTotalRent = (perDayRate: number) => {
    return perDayRate * rentalDays;
  };

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
            <h3 className="text-lg font-semibold text-white mb-1">Choose Your Car</h3>
            <p className="text-primary-100 text-sm">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({rentalDays} day{rentalDays > 1 ? 's' : ''})
            </p>
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
        {/* Rental Info */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-400 mb-1">Rental Duration</h4>
              <p className="text-sm text-blue-300">{rentalDays} day{rentalDays > 1 ? 's' : ''}</p>
            </div>
            {getDiscountPercentage(rentalDays) > 0 && (
              <div className="text-right">
                <div className="text-sm text-green-400 font-medium">
                  {getDiscountPercentage(rentalDays)}% Discount
                </div>
                <div className="text-xs text-green-300">for longer rentals</div>
              </div>
            )}
          </div>
        </div>

        {/* Car Options */}
        <div className="space-y-4">
          {rentalCars.map((car) => {
            const discountedRate = getDiscountedRate(car.perDayRate);
            const totalRent = calculateTotalRent(discountedRate);
            const originalTotal = calculateTotalRent(car.perDayRate);
            const isSelected = selectedCar?.id === car.id;

            return (
              <motion.div
                key={car.id}
                onClick={() => handleCarSelect(car)}
                className={`bg-dark-600 rounded-lg p-4 border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary-500 bg-primary-600/10'
                    : 'border-dark-500 hover:border-dark-400'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  {/* Car Icon */}
                  <div className="text-4xl">{car.image}</div>
                  
                  {/* Car Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white text-lg">{car.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{car.rating}</span>
                        <span className="text-xs text-gray-500">({car.totalRentals})</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{car.description}</p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {car.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-dark-500 rounded text-xs text-gray-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Capacity */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Up to {car.capacity} passengers
                      </span>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-right">
                    <div className="mb-2">
                      <div className="text-sm text-gray-400">Per Day</div>
                      <div className="text-lg font-bold text-primary-400">
                        ₹{discountedRate.toFixed(0)}
                      </div>
                      {getDiscountPercentage(rentalDays) > 0 && (
                        <div className="text-xs text-gray-500 line-through">
                          ₹{car.perDayRate}
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-dark-500 pt-2">
                      <div className="text-sm text-gray-400">Total ({rentalDays} days)</div>
                      <div className="text-xl font-bold text-white">
                        ₹{totalRent.toFixed(0)}
                      </div>
                      {getDiscountPercentage(rentalDays) > 0 && (
                        <div className="text-xs text-green-400">
                          Save ₹{(originalTotal - totalRent).toFixed(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex items-center justify-center mt-3 pt-3 border-t border-dark-500">
                    <Check className="w-5 h-5 text-primary-400 mr-2" />
                    <span className="text-primary-400 font-medium">Selected</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-700 border-t border-dark-600 z-50">
        <motion.button
          onClick={handleContinue}
          disabled={!selectedCar}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg border-2 border-primary-500"
          whileHover={{ scale: selectedCar ? 1.02 : 1 }}
          whileTap={{ scale: selectedCar ? 0.98 : 1 }}
        >
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">
              {selectedCar 
                ? `Continue - ₹${calculateTotalRent(getDiscountedRate(selectedCar.perDayRate)).toFixed(0)}`
                : 'Select a car to continue'
              }
            </span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RentalCarSelection;
