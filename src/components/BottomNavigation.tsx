import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Book Ride", icon: "🏠", isActive: location.pathname === "/" },
    { path: "/my-rides", label: "My Rides", icon: "⏰", isActive: location.pathname === "/my-rides" },
    { path: "/refer-earn", label: "Refer & Earn", icon: "🎁", isActive: location.pathname === "/refer-earn" },
    { path: "/help-support", label: "Help & Support", icon: "❓", isActive: location.pathname === "/help-support" },
    { path: "/about", label: "About", icon: "ℹ️", isActive: location.pathname === "/about" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700">
      <div className="flex justify-around py-4">
        {navItems.map((item, index) => (
          <motion.button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              item.isActive ? "text-primary-400" : "text-gray-400"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              item.isActive ? "bg-primary-600" : ""
            }`}>
              {item.isActive ? (
                <span className="text-white text-xs">{item.icon}</span>
              ) : (
                <span className="text-xs">{item.icon}</span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation; 