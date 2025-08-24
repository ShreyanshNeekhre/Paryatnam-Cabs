import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

interface RentalDatePickerProps {
  onDatesSelected: (startDate: Date, endDate: Date) => void;
}

const RentalDatePicker: React.FC<RentalDatePickerProps> = ({
  onDatesSelected
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getTodayString = (): string => {
    return formatDateForInput(new Date());
  };

  const getTomorrowString = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateForInput(tomorrow);
  };

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = endDateObj.getTime() - startDateObj.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Add 1 to include both start and end dates in the count
    return diffDays > 0 ? diffDays + 1 : 0;
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    
    // If end date is before start date, reset it
    if (endDate && new Date(endDate) <= new Date(date)) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(formatDateForInput(nextDay));
    }
    
    // If both dates are selected, notify parent
    if (endDate && new Date(endDate) > new Date(date)) {
      onDatesSelected(new Date(date), new Date(endDate));
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    
    // If both dates are selected and valid, notify parent
    if (startDate && new Date(date) > new Date(startDate)) {
      onDatesSelected(new Date(startDate), new Date(date));
    }
  };

  const days = calculateDays(startDate, endDate);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-dark-600 rounded-lg p-4 space-y-4"
    >
      <div className="flex items-center space-x-2 mb-3">
        <Calendar className="w-5 h-5 text-primary-400" />
        <h4 className="font-semibold text-white">Select Rental Dates</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Start Date</label>
          <input
            type="date"
            value={startDate}
            min={getTodayString()}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full bg-dark-500 border border-dark-400 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">End Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate || getTomorrowString()}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-full bg-dark-500 border border-dark-400 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Duration Display */}
      {days > 0 && (
        <div className="bg-primary-600/10 border border-primary-600/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-400">Rental Duration</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-400">
                {days} {days === 1 ? 'Day' : 'Days'}
              </div>
              {days >= 7 && (
                <div className="text-xs text-primary-300">
                  {Math.floor(days / 7)} week{Math.floor(days / 7) > 1 ? 's' : ''}
                  {days % 7 > 0 ? ` ${days % 7} day${days % 7 > 1 ? 's' : ''}` : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      
    </motion.div>
  );
};

export default RentalDatePicker;
