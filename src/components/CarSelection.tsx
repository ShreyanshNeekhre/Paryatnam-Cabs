import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Clock } from "lucide-react";

interface CarType {
  id: string;
  name: string;
  description: string;
  icon: string;
  capacity: number;
  baseFare: number;
  perKmRate: number;
  estimatedFare: number;
  eta: string;
  features: string[];
}

interface CarSelectionProps {
  distance: number;
  onSelect: (carType: CarType) => void;
  onContinue: () => void;
  onBack: () => void;
}

const CarSelection: React.FC<CarSelectionProps> = ({
  distance,
  onSelect,
  onContinue,
  onBack
}) => {
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  // Calculate fares dynamically based on distance
  const carTypes: CarType[] = useMemo(() => {
    console.log('Calculating fares for distance:', distance, 'km');
    return [
      {
        id: "mini",
        name: "Mini",
        description: "Affordable rides for short trips",
        icon: "🚗",
        capacity: 4,
        baseFare: 40,
        perKmRate: 12,
        estimatedFare: Math.round(40 + distance * 12),
        eta: "2-3 min",
        features: ["AC", "Music", "Clean"]
      },
      {
        id: "prime",
        name: "Prime",
        description: "Premium sedans for comfort",
        icon: "🚙",
        capacity: 4,
        baseFare: 60,
        perKmRate: 15,
        estimatedFare: Math.round(60 + distance * 15),
        eta: "3-4 min",
        features: ["AC", "Music", "Clean", "Premium"]
      },
      {
        id: "auto",
        name: "Auto",
        description: "Quick and economical rides",
        icon: "🛺",
        capacity: 3,
        baseFare: 30,
        perKmRate: 10,
        estimatedFare: Math.round(30 + distance * 10),
        eta: "1-2 min",
        features: ["Quick", "Economical"]
      },
      {
        id: "bike",
        name: "Bike",
        description: "Fastest way to reach destination",
        icon: "🏍️",
        capacity: 1,
        baseFare: 20,
        perKmRate: 8,
        estimatedFare: Math.round(20 + distance * 8),
        eta: "1 min",
        features: ["Fastest", "Economical"]
      },
      {
        id: "xl",
        name: "XL",
        description: "Spacious rides for groups",
        icon: "🚐",
        capacity: 6,
        baseFare: 80,
        perKmRate: 18,
        estimatedFare: Math.round(80 + distance * 18),
        eta: "4-5 min",
        features: ["Spacious", "AC", "Music", "Group Travel"]
      }
    ];
  }, [distance]);



  const handleCarSelect = (carType: CarType) => {
    setSelectedCar(carType.id);
    onSelect(carType);
  };

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
            <h3 className="text-lg font-semibold text-white mb-1">Choose Your Ride</h3>
            <p className="text-primary-100 text-sm">
              Select the perfect car for your journey • {distance.toFixed(1)} km
            </p>
          </div>
          <motion.button
            onClick={onBack}
            className="text-white hover:text-primary-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ← Back
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto pb-32">
        <div className="p-4 space-y-3 pb-24">
          {carTypes.map((carType) => (
            <motion.div
              key={carType.id}
              onClick={() => handleCarSelect(carType)}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCar === carType.id
                  ? 'border-primary-500 bg-primary-600/10'
                  : 'border-dark-600 bg-dark-600 hover:border-dark-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{carType.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-white">{carType.name}</h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{carType.capacity}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{carType.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>ETA: {carType.eta}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-400">
                    ₹{carType.estimatedFare}
                  </div>
                  <div className="text-xs text-gray-400">
                    ₹{carType.baseFare} + ₹{carType.perKmRate} × {distance.toFixed(1)}km
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    = ₹{carType.baseFare} + ₹{Math.round(carType.perKmRate * distance)}
                  </div>
                </div>
              </div>

              {/* Features */}
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

              {/* Selection Indicator */}
              {selectedCar === carType.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      {selectedCar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 p-4 bg-dark-800 border-t border-dark-600 shadow-lg"
        >
          <motion.button
            onClick={() => {
              const selected = carTypes.find(car => car.id === selectedCar);
              if (selected) {
                onSelect(selected);
                onContinue();
              }
            }}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center">
              <span className="text-lg font-bold">Continue to Schedule</span>
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
          
          <p className="text-xs text-gray-400 text-center mt-2">
            Select date and time for your ride
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CarSelection; 