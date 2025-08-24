import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface DemoModeIndicatorProps {
  isVisible: boolean;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm">
        <Info className="w-4 h-4" />
        <span>Demo Mode - Check console for OTP codes</span>
      </div>
    </motion.div>
  );
};

export default DemoModeIndicator; 