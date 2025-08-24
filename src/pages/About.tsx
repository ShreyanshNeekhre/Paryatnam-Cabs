import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Users, Car, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import BottomNavigation from "../components/BottomNavigation";

const About: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "1M+", label: "Happy Customers" },
    { icon: <Car className="w-6 h-6" />, value: "50K+", label: "Verified Drivers" },
    { icon: <Globe className="w-6 h-6" />, value: "25+", label: "Cities Covered" },
    { icon: <Star className="w-6 h-6" />, value: "4.8", label: "App Rating" }
  ];

  const features = [
    {
      icon: "🚗",
      title: "Premium Vehicles",
      description: "Well-maintained, clean vehicles for your comfort"
    },
    {
      icon: "🛡️",
      title: "Safe Travel",
      description: "Verified drivers with background checks"
    },
    {
      icon: "⚡",
      title: "Quick Booking",
      description: "Book your ride in seconds with our app"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive pricing with no hidden charges"
    },
    {
      icon: "📱",
      title: "Real-time Tracking",
      description: "Track your driver's location in real-time"
    },
    {
      icon: "🎁",
      title: "Rewards Program",
      description: "Earn rewards and discounts on every ride"
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      avatar: "👨‍💼"
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      avatar: "👩‍💻"
    },
    {
      name: "Amit Patel",
      role: "Head of Operations",
      avatar: "👨‍🔧"
    },
    {
      name: "Neha Singh",
      role: "Head of Customer Care",
      avatar: "👩‍💬"
    }
  ];

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
          <h1 className="text-xl font-bold">About</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-center"
          >
            <div className="text-4xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold mb-2">Paryatnam Cabs</h2>
            <p className="text-primary-100">
              Premium cab booking service for safe and comfortable travel
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-dark-700 rounded-lg p-4 text-center"
              >
                <div className="text-primary-400 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary-400">{stat.value}</div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* About Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Paryatnam Cabs was founded in 2020 with a vision to revolutionize the way people travel in India. 
                We believe that every journey should be safe, comfortable, and memorable.
              </p>
              <p>
                Our mission is to provide premium cab booking services with the highest standards of safety, 
                reliability, and customer satisfaction. We work with verified drivers and maintain a fleet of 
                well-maintained vehicles to ensure your comfort.
              </p>
              <p>
                Today, we operate in 25+ cities across India, serving over 1 million happy customers with 
                our commitment to excellence and innovation.
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Why Choose Paryatnam Cabs?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-dark-600 rounded-lg"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Our Leadership Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center p-4 bg-dark-600 rounded-lg"
                >
                  <div className="text-3xl mb-2">{member.avatar}</div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">App Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Build</span>
                <span>2024.08.20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform</span>
                <span>React Native</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span>August 20, 2024</span>
              </div>
            </div>
          </motion.div>

          {/* Contact & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-3"
          >
            <Button
              onClick={() => navigate("/help-support")}
              variant="outline"
              className="w-full"
            >
              Contact Support
            </Button>
            <Button
              onClick={() => alert("Privacy Policy coming soon!")}
              variant="outline"
              className="w-full"
            >
              Privacy Policy
            </Button>
            <Button
              onClick={() => alert("Terms of Service coming soon!")}
              variant="outline"
              className="w-full"
            >
              Terms of Service
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-gray-400 text-sm"
          >
            <p>© 2024 Paryatnam Cabs. All rights reserved.</p>
            <p className="mt-1">Made with ❤️ in India</p>
          </motion.div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default About; 