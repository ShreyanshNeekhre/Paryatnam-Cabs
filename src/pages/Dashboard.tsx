import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Car, Globe, Plane, Clock } from "lucide-react";

import Button from "../components/ui/button";
import BottomNavigation from "../components/BottomNavigation";
import MultiDestinationInput from "../components/MultiDestinationInput";
import RouteMap from "../components/RouteMap";
import CarSelection from "../components/CarSelection";
import ScheduleSelection from "../components/ScheduleSelection";
import Onboarding from "./Onboarding";
import Login from "../components/Auth/Login";
import { LocationSuggestion } from "../types/location";
import userService, { User as UserType } from "../services/userService";
import RideDetails from "../components/RideDetails";
import PickupConfirmation from "../components/PickupConfirmation";
import DriverDetails from "../components/DriverDetails";
import RentalDatePicker from "../components/RentalDatePicker";
import RentalCarSelection from "../components/RentalCarSelection";
import RentalDetails from "../components/RentalDetails";

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

interface ServiceTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

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

const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [activeService, setActiveService] = useState('airport');
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedPickup, setSelectedPickup] = useState<LocationSuggestion | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<LocationSuggestion | null>(null);
  const [stops, setStops] = useState<LocationSuggestion[]>([]);

  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    durationValue: number;
  } | null>(null);
  
  // Rental state variables
  const [rentalStartDate, setRentalStartDate] = useState<Date | null>(null);
  const [rentalEndDate, setRentalEndDate] = useState<Date | null>(null);
  const [selectedRentalCar, setSelectedRentalCar] = useState<RentalCar | null>(null);

  


  const serviceTabs: ServiceTab[] = [
    {
      id: 'airport',
      name: 'Airport',
      icon: <Plane className="w-5 h-5" />,
      description: 'Airport transfers and pickups'
    },
    {
      id: 'rental',
      name: 'Rent a Car',
      icon: <Clock className="w-5 h-5" />,
      description: 'Daily car rentals with flexible duration'
    },
    {
      id: 'intercity',
      name: 'Intercity',
      icon: <Globe className="w-5 h-5" />,
      description: 'Long distance city to city travel'
    }
  ];

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else {
      // Check if user is already authenticated
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setShowLogin(true);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
    setShowLogin(true);
  };

  const handleLogin = (userData: UserType) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLogin(false);
    
    // Save user data to localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };



  const handlePickupChange = (location: LocationSuggestion) => {
    setSelectedPickup(location);
    setPickup(location.address);
  };

  const handleDestinationChange = (location: LocationSuggestion) => {
    setSelectedDestination(location);
    setDestination(location.address);
  };

  const handleStopsChange = (newStops: LocationSuggestion[]) => {
    setStops(newStops);
  };

  const handleAddStop = () => {
    const newStop: LocationSuggestion = {
      id: `stop-${Date.now()}`, // Use timestamp for unique ID
      name: '',
      address: '',
      type: 'popular'
    };
    setStops([...stops, newStop]);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  const handleReorderStops = (fromIndex: number, toIndex: number) => {
    const newStops = [...stops];
    const [removed] = newStops.splice(fromIndex, 1);
    newStops.splice(toIndex, 0, removed);
    setStops(newStops);
  };

  const handleBookNow = () => {
    if (activeService === 'rental' && rentalStartDate && rentalEndDate) {
      // For rental service, go to car selection when dates are selected
      setCurrentStep(7); // Rental car selection step
    } else if (selectedPickup && selectedDestination) {
      setCurrentStep(2); // Show route step for other services
    }
  };

  const handleRouteBack = () => {
    setCurrentStep(1); // Go back to location selection
  };

  const handleRouteConfirm = () => {
    setCurrentStep(3); // Go to car selection
  };

  const handleRouteCalculated = (routeInfo: {
    distance: string;
    duration: string;
    durationValue: number;
  }) => {
    console.log('Route calculated in Dashboard:', routeInfo);
    setRouteInfo(routeInfo);
  };

  const handleCarSelect = (carType: CarType) => {
    setSelectedCar(carType);
  };

  const handleCarContinue = () => {
    setCurrentStep(4); // Go to schedule selection
  };

  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [finalRouteInfo, setFinalRouteInfo] = useState<{
    distance: string;
    duration: string;
    durationValue: number;
  } | null>(null);

  const handleSchedule = async (date: Date, time: string) => {
    setScheduledDate(date);
    setScheduledTime(time);
    setCurrentStep(5); // Go to ride details
  };

  const handleRideDetailsConfirm = () => {
    setCurrentStep(6); // Go to pickup confirmation
  };

  const handlePickupConfirmation = async () => {
    if (!user || !selectedCar || !scheduledDate) return;

    try {
      // Save ride to database
      const rideData = {
        userId: user.id,
        pickup: pickup,
        destination: destination,
        distance: routeInfo?.distance || '15 km',
        duration: routeInfo?.duration || '25 mins',
        fare: selectedCar?.estimatedFare || 0,
        carType: selectedCar?.name || 'Mini',
        status: 'ongoing' as const,
        completedAt: undefined
      };

      const rideResult = await userService.saveRideHistory(rideData);
      
      if (rideResult.success) {
        console.log("Ride saved to database:", rideResult.rideId);
        
        // Update user's ride count
        const updatedUser = await userService.getUserById(user.id);
        if (updatedUser.success && updatedUser.user) {
          setUser(updatedUser.user);
        }
      }

      // Handle final booking confirmation
      console.log("Booking confirmed!", {
        pickup: selectedPickup,
        destination: selectedDestination,
        stops: stops,
        carType: selectedCar,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        routeInfo: finalRouteInfo || routeInfo
      });

      // Navigate to driver details
      setCurrentStep(7);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const handlePickupLocationUpdate = (newLocation: LocationSuggestion, newRouteInfo: {
    distance: string;
    duration: string;
    durationValue: number;
  }) => {
    setSelectedPickup(newLocation);
    setFinalRouteInfo(newRouteInfo);
    console.log('Pickup location updated:', newLocation);
    console.log('New route info:', newRouteInfo);
  };

  const handleDriverDetailsDone = () => {
    // Navigate back to main dashboard
    setCurrentStep(1);
    // Reset all booking data
    setSelectedPickup(null);
    setSelectedDestination(null);
    setStops([]);
    setSelectedCar(null);
    setScheduledDate(null);
    setScheduledTime(null);
    setRouteInfo(null);
    setFinalRouteInfo(null);
    // Reset rental data
    setRentalStartDate(null);
    setRentalEndDate(null);
    setSelectedRentalCar(null);

  };

  const handleBackToSchedule = () => {
    setCurrentStep(4);
  };

  const handleBackToRideDetails = () => {
    setCurrentStep(5);
  };

  const handleBackToLocation = () => {
    setCurrentStep(1);
  };

  const handleBackToCar = () => {
    setCurrentStep(3);
  };

  // Rental flow handlers
  const handleRentalDatesSelected = (startDate: Date, endDate: Date) => {
    setRentalStartDate(startDate);
    setRentalEndDate(endDate);
  };

  const handleRentalCarSelected = (car: RentalCar) => {
    setSelectedRentalCar(car);
    setCurrentStep(9); // Go to rental details
  };

  const handleRentalConfirm = () => {
    // Handle rental confirmation - could go to driver details or payment
    setCurrentStep(10); // Go to driver details for now
  };

  const handleRentalBackToLocation = () => {
    setCurrentStep(1); // Go back to main screen
  };

  const handleRentalBackToCars = () => {
    setCurrentStep(7); // Go back to rental car selection
  };

  // Calculate distance from route info for car selection
  const getDistance = (): number => {
    console.log('getDistance called, routeInfo:', routeInfo);
    
    if (routeInfo?.distance) {
      // Handle different distance formats: "15.2 km", "15 km", "15.2", etc.
      const distanceStr = routeInfo.distance.replace(/[^\d.]/g, '');
      const distance = parseFloat(distanceStr);
      console.log('Route distance:', routeInfo.distance, 'Parsed distance:', distance);
      
      if (isNaN(distance) || distance <= 0) {
        console.log('Invalid distance parsed, using default: 15km');
        return 15;
      }
      
      return distance;
    }
    console.log('No route info, using default distance: 15km');
    return 15; // Default distance
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (showLogin) {
    return <Login onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Paryatnam Cabs</h1>
          <p className="text-gray-400">Please login to continue</p>
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="location"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 space-y-6 pb-32"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Book Your Ride</h1>
              <p className="text-gray-400">Where would you like to go?</p>
              {user && (
                <p className="text-sm text-primary-400 mt-1">
                  Welcome back, {user.name}! 🚗
                </p>
              )}
            </div>

            {/* Service Tabs */}
            <div className="flex space-x-2 overflow-x-auto">
              {serviceTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveService(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeService === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Service Description */}
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                {serviceTabs.find(tab => tab.id === activeService)?.icon}
                <h3 className="font-semibold text-white">
                  {serviceTabs.find(tab => tab.id === activeService)?.name} Service
                </h3>
              </div>
              <p className="text-sm text-gray-400">
                {serviceTabs.find(tab => tab.id === activeService)?.description}
              </p>
            </div>

            {/* Location Inputs - Only show for non-rental services */}
            {activeService !== 'rental' && (
              <div className="space-y-4">
                <MultiDestinationInput
                  pickup={selectedPickup}
                  destination={selectedDestination}
                  stops={stops}
                  onPickupChange={handlePickupChange}
                  onDestinationChange={handleDestinationChange}
                  onStopsChange={handleStopsChange}
                  onAddStop={handleAddStop}
                  onRemoveStop={handleRemoveStop}
                  onReorderStops={handleReorderStops}
                />
              </div>
            )}

            {/* Rental Date Picker - Only show for rental service */}
            {activeService === 'rental' && (
              <div className="space-y-4">
                <RentalDatePicker
                  onDatesSelected={handleRentalDatesSelected}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Fixed Book Now Button */}
        {currentStep === 1 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-700 border-t border-dark-600 z-50">
            <Button
              onClick={handleBookNow}
              disabled={activeService === 'rental' ? (!rentalStartDate || !rentalEndDate) : (!selectedPickup || !selectedDestination)}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-4 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg border-2 border-primary-500 min-h-[60px]"
            >
              <div className="flex items-center justify-center">
                <Send className="w-5 h-5 mr-2" />
                <span className="text-lg font-bold">
                  {activeService === 'rental' ? 'Rent a Car' : 'Book Now'}
                </span>
              </div>
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              {activeService === 'rental' 
                ? (!rentalStartDate || !rentalEndDate 
                  ? 'Please select start and end dates' 
                  : 'Tap to choose your rental car')
                : (!selectedPickup || !selectedDestination 
                  ? 'Please select pickup and destination locations' 
                  : 'Tap to proceed to route map')
              }
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <RouteMap
            pickup={selectedPickup}
            destination={selectedDestination}
            stops={stops}
            onBack={handleRouteBack}
            onConfirm={handleRouteConfirm}
            onRouteCalculated={handleRouteCalculated}
          />
        )}

        {currentStep === 3 && (
          <motion.div
            key="car"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            {/* Route Info Display for Debugging */}
            {routeInfo && (
              <div className="bg-dark-600 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-400 mb-2">Route Information:</div>
                <div className="flex justify-between text-sm">
                  <span>Distance: {routeInfo.distance}</span>
                  <span>Duration: {routeInfo.duration}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Parsed Distance: {getDistance().toFixed(1)} km
                </div>
              </div>
            )}
            
            <CarSelection
              distance={getDistance()}
              onSelect={handleCarSelect}
              onContinue={handleCarContinue}
              onBack={handleBackToLocation}
            />
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            <ScheduleSelection
              onSchedule={handleSchedule}
              onBack={handleBackToCar}
            />
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="ride-details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            <RideDetails
              pickup={selectedPickup}
              destination={selectedDestination}
              stops={stops}
              distance={routeInfo?.distance || '15 km'}
              duration={routeInfo?.duration || '25 mins'}
              carType={{
                name: selectedCar?.name || 'Mini',
                icon: selectedCar?.icon || '🚗',
                estimatedFare: selectedCar?.estimatedFare || 0,
                capacity: selectedCar?.capacity || 4,
                features: selectedCar?.features || [],
                baseFare: selectedCar?.baseFare || 50,
                perKmRate: selectedCar?.perKmRate || 12
              }}
              scheduledDate={scheduledDate || new Date()}
              scheduledTime={scheduledTime || "now"}
              onBack={handleBackToSchedule}
              onConfirm={handleRideDetailsConfirm}
            />
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div
            key="pickup-confirmation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            <PickupConfirmation
              pickup={selectedPickup}
              destination={selectedDestination}
              stops={stops}
              distance={routeInfo?.distance || '15 km'}
              duration={routeInfo?.duration || '25 mins'}
              carType={{
                name: selectedCar?.name || 'Mini',
                icon: selectedCar?.icon || '🚗',
                estimatedFare: selectedCar?.estimatedFare || 0,
                capacity: selectedCar?.capacity || 4,
                features: selectedCar?.features || [],
                baseFare: selectedCar?.baseFare || 50,
                perKmRate: selectedCar?.perKmRate || 12
              }}
              scheduledDate={scheduledDate || new Date()}
              scheduledTime={scheduledTime || "now"}
              onBack={handleBackToRideDetails}
              onConfirm={handlePickupConfirmation}
              onPickupLocationUpdate={handlePickupLocationUpdate}
            />
          </motion.div>
        )}

        {/* Rental Car Selection */}
        {currentStep === 7 && (
          <motion.div
            key="rental-car-selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            <RentalCarSelection
              startDate={rentalStartDate!}
              endDate={rentalEndDate!}
              onCarSelect={handleRentalCarSelected}
              onBack={handleRentalBackToLocation}
            />
          </motion.div>
        )}

        {/* Rental Details */}
        {currentStep === 9 && (
          <motion.div
            key="rental-details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            <RentalDetails
              startDate={rentalStartDate!}
              endDate={rentalEndDate!}
              selectedCar={selectedRentalCar!}
              onBack={handleRentalBackToCars}
              onConfirm={handleRentalConfirm}
            />
          </motion.div>
        )}

        {/* Driver Details (for both ride and rental) */}
        {currentStep === 10 && (
          <motion.div
            key="driver-details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            <DriverDetails
              onDone={handleDriverDetailsDone}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard; 