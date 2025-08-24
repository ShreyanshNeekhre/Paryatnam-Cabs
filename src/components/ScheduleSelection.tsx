import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

interface ScheduleSelectionProps {
  onSchedule: (date: Date, time: string) => void;
  onBack: () => void;
}

const ScheduleSelection: React.FC<ScheduleSelectionProps> = ({
  onSchedule,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("now");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [customTime, setCustomTime] = useState<string>("12:00"); // Add custom time state
  const [showCustomTimePicker, setShowCustomTimePicker] = useState<boolean>(false); // Add custom time picker state

  // Generate time slots
  const timeSlots = [
    { value: "now", label: "Book Now", description: "Immediate pickup" },
    { value: "15", label: "15 min", description: "Pickup in 15 minutes" },
    { value: "30", label: "30 min", description: "Pickup in 30 minutes" },
    { value: "60", label: "1 hour", description: "Pickup in 1 hour" },
    { value: "custom", label: "Custom Time", description: "Choose specific time" }
  ];

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    return date.toDateString() === tomorrow.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date: Date) => {
    return date < today;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleDateSelect = (date: Date) => {
    if (!isPast(date)) {
      setSelectedDate(date);
    }
  };

  const handleSchedule = () => {
    const scheduledDate = new Date(selectedDate);
    if (selectedTime === "custom") {
      // Use custom time
      const [hours, minutes] = customTime.split(':').map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      // Check if the selected time is in the past
      if (scheduledDate < new Date()) {
        alert("Please select a time in the future.");
        return;
      }
    } else if (selectedTime !== "now") {
      // Use predefined time slots
      const minutesToAdd = parseInt(selectedTime);
      scheduledDate.setMinutes(scheduledDate.getMinutes() + minutesToAdd);
    }
    onSchedule(scheduledDate, selectedTime === "custom" ? customTime : selectedTime);
  };

  // Check if the selected time is valid
  const isTimeValid = () => {
    if (selectedTime === "custom") {
      const scheduledDate = new Date(selectedDate);
      const [hours, minutes] = customTime.split(':').map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);
      return scheduledDate > new Date();
    }
    return true;
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
            <h3 className="text-lg font-semibold text-white mb-1">Schedule Your Ride</h3>
            <p className="text-primary-100 text-sm">Choose when you want to travel</p>
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
      <div className="max-h-96 overflow-y-auto">
        {/* Date Selection */}
        <div className="p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Select Date
          </h4>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={() => {
                const prevMonth = new Date(currentMonth);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setCurrentMonth(prevMonth);
              }}
              className="p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </motion.button>
            
            <h5 className="text-white font-medium">{formatMonth(currentMonth)}</h5>
            
            <motion.button
              onClick={() => {
                const nextMonth = new Date(currentMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setCurrentMonth(nextMonth);
              }}
              className="p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-xs text-gray-400 font-medium">
                {day}
              </div>
            ))}
            
            {days.map((date, index) => (
              <div key={index} className="p-2 text-center">
                {date ? (
                  <motion.button
                    onClick={() => handleDateSelect(date)}
                    disabled={isPast(date)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                      isPast(date)
                        ? 'text-gray-600 cursor-not-allowed'
                        : isSelected(date)
                        ? 'bg-primary-600 text-white'
                        : isToday(date)
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-600'
                        : isTomorrow(date)
                        ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600'
                        : 'text-white hover:bg-dark-600'
                    }`}
                    whileHover={!isPast(date) ? { scale: 1.1 } : {}}
                    whileTap={!isPast(date) ? { scale: 0.9 } : {}}
                  >
                    {date.getDate()}
                  </motion.button>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            ))}
          </div>

          {/* Time Selection */}
          <div className="p-4 pb-24">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Select Time
            </h4>

            <div className="space-y-2 mb-4">
              {timeSlots.map((slot) => (
                <motion.button
                  key={slot.value}
                  onClick={() => {
                    setSelectedTime(slot.value);
                    if (slot.value === "custom") {
                      setShowCustomTimePicker(true);
                    } else {
                      setShowCustomTimePicker(false);
                    }
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedTime === slot.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-600 text-white hover:bg-dark-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{slot.label}</div>
                      <div className={`text-sm ${
                        selectedTime === slot.value ? 'text-primary-100' : 'text-gray-400'
                      }`}>
                        {slot.description}
                      </div>
                    </div>
                    {selectedTime === slot.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                      >
                        <span className="text-primary-600 text-xs">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom Time Picker */}
            {showCustomTimePicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-dark-600 rounded-lg border border-primary-500"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Time
                    </label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:outline-none text-lg"
                      min="00:00"
                      max="23:59"
                    />
                  </div>
                  <div className="bg-dark-700 border border-dark-500 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">Pickup Details:</div>
                    <div className="text-white font-medium">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} at {customTime}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Continue Button */}
      <div className="sticky bottom-0 p-4 bg-dark-800 border-t border-dark-600 shadow-lg">
        <motion.button
          onClick={handleSchedule}
          disabled={selectedTime === "custom" && !isTimeValid()}
          className={`w-full py-4 rounded-lg font-semibold transition-colors text-lg ${
            selectedTime === "custom" && !isTimeValid()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg'
          }`}
          whileHover={selectedTime === "custom" && !isTimeValid() ? {} : { scale: 1.02 }}
          whileTap={selectedTime === "custom" && !isTimeValid() ? {} : { scale: 0.98 }}
        >
          {selectedTime === "custom" && !isTimeValid() 
            ? "Please select a future time" 
            : "Confirm Booking"
          }
        </motion.button>
        {selectedTime === "custom" && !isTimeValid() && (
          <p className="text-red-400 text-sm text-center mt-2">
            Selected time is in the past. Please choose a future time.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ScheduleSelection; 