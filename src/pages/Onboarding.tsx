import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  MapPin, 
  User, 
  Car, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Users,
  Settings,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'driver' | 'admin' | null>(null);


  const steps = [
    {
      title: "Welcome to Paryatnam Cabs",
      subtitle: "Premium rides at your fingertips",
      icon: <Car className="w-16 h-16 text-primary-500" />,
      content: "Experience the best in class cab booking service with real-time tracking and premium vehicles."
    },
    {
      title: "What's your name?",
      subtitle: "Let's personalize your experience",
      icon: <Heart className="w-16 h-16 text-primary-500" />,
      content: "We'd love to know your name to make your ride experience more personal."
    },
    {
      title: "Choose Your Role",
      subtitle: "Select how you want to use the app",
      icon: <Users className="w-16 h-16 text-primary-500" />,
      content: "Are you a customer looking for rides, a driver offering services, or an admin managing the platform?"
    },
    {
      title: "Enable Notifications",
      subtitle: "Stay updated with your rides",
      icon: <Bell className="w-16 h-16 text-primary-500" />,
      content: "Get real-time updates about your ride status, driver location, and important notifications."
    },
    {
      title: "Enable Location Services",
      subtitle: "For accurate pickup and drop locations",
      icon: <MapPin className="w-16 h-16 text-primary-500" />,
      content: "Allow location access to find nearby drivers and get accurate pickup/drop locations."
    },
    {
      title: "Terms & Conditions",
      subtitle: "Please read and accept our terms",
      icon: <Shield className="w-16 h-16 text-primary-500" />,
      content: "By continuing, you agree to our Terms of Service and Privacy Policy."
    }
  ];

  const userTypes = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Book rides and travel',
      icon: <User className="w-8 h-8" />,
      description: 'Book rides, track drivers, and enjoy premium travel experience'
    },
    {
      id: 'driver',
      title: 'Driver',
      subtitle: 'Offer rides and earn',
      icon: <Car className="w-8 h-8" />,
      description: 'Join our driver network, accept rides, and earn money'
    },
    {
      id: 'admin',
      title: 'Admin',
      subtitle: 'Manage platform',
      icon: <Settings className="w-8 h-8" />,
      description: 'Monitor rides, manage drivers, and oversee operations'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user name to localStorage
      if (userName.trim()) {
        localStorage.setItem('userName', userName.trim());
      }
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const requestNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } catch (error) {
      console.error('Error requesting notifications:', error);
    }
  };

  const requestLocation = async () => {
    try {
      await navigator.geolocation.getCurrentPosition(
        () => setLocationEnabled(true),
        () => setLocationEnabled(false)
      );
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return userName.trim().length > 0;
      case 2: return userType !== null;
      case 3: return notificationsEnabled;
      case 4: return locationEnabled;
      case 5: return termsAccepted;
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-dark-600 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Your Name</h3>
                  <p className="text-sm text-gray-400">We'll use this to personalize your experience</p>
                </div>
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none text-center text-lg"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                Don't worry, you can change this later in your profile
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {userTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setUserType(type.id as any)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  userType === type.id
                    ? 'border-primary-500 bg-primary-600/10'
                    : 'border-dark-600 bg-dark-600 hover:border-dark-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-primary-400">{type.icon}</div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{type.title}</h3>
                    <p className="text-sm text-gray-400">{type.subtitle}</p>
                    <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="bg-dark-600 rounded-lg p-6">
              <Bell className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">
                Enable notifications to get real-time updates about your rides, driver location, and important alerts.
              </p>
              <motion.button
                onClick={requestNotifications}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  notificationsEnabled
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {notificationsEnabled ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Notifications Enabled
                  </div>
                ) : (
                  'Enable Notifications'
                )}
              </motion.button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="bg-dark-600 rounded-lg p-6">
              <MapPin className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">
                Allow location access to find nearby drivers and get accurate pickup/drop locations for better service.
              </p>
              <motion.button
                onClick={requestLocation}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  locationEnabled
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {locationEnabled ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Location Enabled
                  </div>
                ) : (
                  'Enable Location'
                )}
              </motion.button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-dark-600 rounded-lg p-6 max-h-64 overflow-y-auto">
              <h3 className="font-semibold text-white mb-4">Terms of Service</h3>
              <div className="text-sm text-gray-300 space-y-3">
                <p>By using Paryatnam Cabs, you agree to the following terms:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>You agree to provide accurate information</li>
                  <li>You will not use our service for illegal activities</li>
                  <li>We reserve the right to modify these terms</li>
                  <li>Your privacy is protected under our Privacy Policy</li>
                </ul>
                <p className="mt-4">
                  <strong>Privacy Policy:</strong> We collect and use your data to provide our services, 
                  improve user experience, and ensure safety. Your data is protected and never shared with third parties.
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => setTermsAccepted(!termsAccepted)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                termsAccepted
                  ? 'border-primary-500 bg-primary-600/10'
                  : 'border-dark-600 bg-dark-600 hover:border-dark-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  termsAccepted ? 'bg-primary-500 border-primary-500' : 'border-gray-400'
                }`}>
                  {termsAccepted && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className="text-white">I agree to the Terms of Service and Privacy Policy</span>
              </div>
            </motion.button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-gray-300 text-lg">{steps[currentStep].content}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Progress Bar */}
      <div className="bg-dark-800 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-dark-600 rounded-full h-2">
            <motion.div
              className="bg-primary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              {/* Icon */}
              <div className="flex justify-center">
                {steps[currentStep].icon}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-gray-400">{steps[currentStep].subtitle}</p>
              </div>

              {/* Content */}
              <div className="mt-8">
                {renderStepContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-dark-800 p-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <motion.button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-dark-600 hover:bg-dark-500 text-white'
            }`}
            whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
              canProceed()
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canProceed() ? { scale: 1.05 } : {}}
            whileTap={canProceed() ? { scale: 0.95 } : {}}
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 