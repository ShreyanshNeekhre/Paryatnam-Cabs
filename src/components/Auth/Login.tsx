import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  User, 
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import userService from "../../services/userService";
import { User as UserType } from "../../services/userService";

interface LoginProps {
  onLogin: (userData: UserType) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
    emergencyContact: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [demoOTP, setDemoOTP] = useState(""); // Add state for demo OTP display
  const [isNewUser, setIsNewUser] = useState<boolean>(false); // Add state to track if user is new

  const steps = [
    {
      title: "Enter Phone Number",
      subtitle: "We'll send you a verification code",
      icon: <Phone className="w-8 h-8" />
    },
    {
      title: "Verify OTP",
      subtitle: "Enter the 6-digit code sent to your phone",
      icon: <CheckCircle className="w-8 h-8" />
    },
    {
      title: isNewUser ? "Complete Sign Up" : "Login",
      subtitle: isNewUser ? "Tell us a bit about yourself" : "Welcome back!",
      icon: <User className="w-8 h-8" />
    }
  ];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    userService.initializeRecaptcha('recaptcha-container');
  }, []);

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      setErrorMessage("Please enter a valid 10-digit phone number");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Store phone number for demo mode
      localStorage.setItem('currentPhoneNumber', phoneNumber);
      
      const response = await userService.sendOTP(phoneNumber);
      if (response.success) {
        setCountdown(30);
        setCurrentStep(1);
        console.log("OTP sent successfully:", response.message);
        
        // If it's demo mode, display the OTP
        if (response.demoOTP) {
          setDemoOTP(response.demoOTP);
        }
      } else {
        setErrorMessage(response.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const response = await userService.verifyOTP(otp);
      
      if (response.success) {
        if (response.user) {
          // Existing user - login directly
          console.log("Existing user logged in:", response.user.name);
          onLogin(response.user);
        } else {
          // New user - proceed to profile completion
          setIsNewUser(true);
          setCurrentStep(2);
          console.log("New user - proceeding to profile completion");
        }
        console.log("OTP verified successfully");
      } else {
        setErrorMessage(response.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!userDetails.name || !userDetails.email) {
      setErrorMessage("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Create new user in Firestore
      const userData = {
        phoneNumber: `+91${phoneNumber}`,
        name: userDetails.name,
        email: userDetails.email,
        address: userDetails.address,
        emergencyContact: userDetails.emergencyContact,
        userType: 'customer' as const,
        isVerified: true,
        isFirstTime: true,
        walletBalance: 0,
        totalRides: 0,
        rating: 0
      };

      const response = await userService.createUser(userData);
      
      if (response.success && response.user) {
        onLogin(response.user);
      } else {
        setErrorMessage(response.message || "Failed to create user profile");
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      setErrorMessage("Error saving profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const response = await userService.sendOTP(phoneNumber);
      
      if (response.success) {
        setCountdown(30);
        console.log("OTP resent successfully");
        
        // If it's demo mode, display the new OTP
        if (response.demoOTP) {
          setDemoOTP(response.demoOTP);
        }
      } else {
        setErrorMessage(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return phoneNumber.length >= 10;
      case 1: return otp.length === 6;
      case 2: return isNewUser ? (userDetails.name && userDetails.email) : true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-dark-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phone Number</h3>
                  <p className="text-sm text-gray-400">Enter your mobile number</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                    setErrorMessage("");
                  }}
                  placeholder="Enter your phone number"
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
                  maxLength={10}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  +91
                </div>
              </div>
              {errorMessage && (
                <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            {/* Hidden reCAPTCHA container */}
            <div id="recaptcha-container" className="hidden"></div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-dark-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">OTP Verification</h3>
                  <p className="text-sm text-gray-400">
                    Code sent to +91 {phoneNumber}
                  </p>
                </div>
              </div>
              
              {/* Demo OTP Display */}
              {demoOTP && (
                <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-3 mb-4">
                  <div className="text-center">
                    <p className="text-yellow-400 text-sm mb-2">Demo Mode - Use this OTP:</p>
                    <p className="text-2xl font-bold text-yellow-400 tracking-widest">{demoOTP}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setErrorMessage("");
                  }}
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Didn't receive code?
                  </span>
                  <button
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isLoading}
                    className={`${
                      countdown > 0 || isLoading
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-primary-400 hover:text-primary-300'
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-dark-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {isNewUser ? "Complete Your Profile" : "Welcome Back!"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {isNewUser ? "Tell us a bit about yourself to get started" : "Your profile is already set up"}
                  </p>
                </div>
              </div>
              {isNewUser ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userDetails.name}
                      onChange={(e) => {
                        setUserDetails({...userDetails, name: e.target.value});
                        setErrorMessage("");
                      }}
                      placeholder="Enter your full name"
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) => {
                        setUserDetails({...userDetails, email: e.target.value});
                        setErrorMessage("");
                      }}
                      placeholder="Enter your email"
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={userDetails.address}
                      onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                      placeholder="Enter your address"
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      value={userDetails.emergencyContact}
                      onChange={(e) => setUserDetails({...userDetails, emergencyContact: e.target.value})}
                      placeholder="Emergency contact number"
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Login Successful!</h3>
                  <p className="text-gray-400">You're all set to book your ride.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-dark-800 p-4 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-lg font-semibold">
            {isNewUser ? "Sign Up" : "Login"}
          </h1>
          <div className="w-9"></div>
        </div>
      </div>

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
              className="space-y-6"
            >
              {/* Step Header */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    {steps[currentStep].icon}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-400">{steps[currentStep].subtitle}</p>
              </div>

              {/* Step Content */}
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-dark-800 p-6">
        <div className="max-w-md mx-auto">
          <motion.button
            onClick={() => {
              switch (currentStep) {
                case 0: handleSendOTP(); break;
                case 1: handleVerifyOTP(); break;
                case 2: 
                  if (isNewUser) {
                    handleCompleteProfile(); 
                  } else {
                    // For existing users, just proceed to main app
                    // This should be handled by the onLogin callback
                  }
                  break;
              }
            }}
            disabled={!canProceed() || isLoading}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
              canProceed() && !isLoading
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canProceed() && !isLoading ? { scale: 1.02 } : {}}
            whileTap={canProceed() && !isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {currentStep === 0 ? 'Send OTP' : 
                   currentStep === 1 ? 'Verify OTP' : 
                   isNewUser ? 'Complete Sign Up' : 'Continue'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Login; 