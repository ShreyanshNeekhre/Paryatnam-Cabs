import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, X, GripVertical, Navigation } from 'lucide-react';
import { LocationSuggestion } from '../types/location';
import LocationDropdown from './LocationDropdown';

interface MultiDestinationInputProps {
  pickup: LocationSuggestion | null;
  destination: LocationSuggestion | null;
  stops: LocationSuggestion[];
  onPickupChange: (location: LocationSuggestion) => void;
  onDestinationChange: (location: LocationSuggestion) => void;
  onStopsChange: (stops: LocationSuggestion[]) => void;
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
  onReorderStops: (fromIndex: number, toIndex: number) => void;
}

const MultiDestinationInput: React.FC<MultiDestinationInputProps> = ({
  pickup,
  destination,
  stops,
  onPickupChange,
  onDestinationChange,
  onStopsChange,
  onAddStop,
  onRemoveStop,
  onReorderStops
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'pickup' | 'destination' | `stop-${number}` | null>(null);
  const [pickupInput, setPickupInput] = useState(pickup?.address || '');
  const [destinationInput, setDestinationInput] = useState(destination?.address || '');
  const [stopInputs, setStopInputs] = useState<string[]>(stops.map(stop => stop.address || ''));

  // Update inputs when props change
  React.useEffect(() => {
    setPickupInput(pickup?.address || '');
  }, [pickup]);

  React.useEffect(() => {
    setDestinationInput(destination?.address || '');
  }, [destination]);

  React.useEffect(() => {
    try {
      const newStopInputs = stops.map(stop => stop?.address || '');
      setStopInputs(newStopInputs);
      console.log('Updated stop inputs:', newStopInputs);
    } catch (error) {
      console.error('Error updating stop inputs:', error);
      setStopInputs([]);
    }
  }, [stops]);

  const handleStopLocationChange = (index: number, location: LocationSuggestion) => {
    const newStops = [...stops];
    newStops[index] = location;
    onStopsChange(newStops);
  };

  const handleStopInputChange = (index: number, value: string) => {
    const newStopInputs = [...stopInputs];
    newStopInputs[index] = value;
    setStopInputs(newStopInputs);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorderStops(dragIndex, dropIndex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pickup Location */}
      <div className="relative">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Location</label>
            <LocationDropdown
              placeholder="Where from?"
              value={pickupInput}
              onChange={setPickupInput}
              onSelect={onPickupChange}
              isOpen={activeDropdown === 'pickup'}
              onToggle={() => setActiveDropdown(activeDropdown === 'pickup' ? null : 'pickup')}
            />
          </div>
        </div>
      </div>

      {/* Stops */}
      <AnimatePresence>
        {stops && stops.length > 0 && stops.map((stop, index) => {
          if (!stop) return null;
          return (
            <motion.div
              key={`stop-${index}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                className="relative"
                draggable
                onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, index)}
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, index)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-move">
                    <GripVertical className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Stop {index + 1}
                    </label>
                    <LocationDropdown
                      placeholder={`Stop ${index + 1}`}
                      value={stopInputs[index] || ''}
                      onChange={(value) => handleStopInputChange(index, value)}
                      onSelect={(location) => handleStopLocationChange(index, location)}
                      isOpen={activeDropdown === `stop-${index}`}
                      onToggle={() => setActiveDropdown(activeDropdown === `stop-${index}` ? null : `stop-${index}`)}
                    />
                  </div>
                  <button
                    onClick={() => onRemoveStop(index)}
                    className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add Stop Button */}
      <motion.button
        onClick={() => {
          try {
            console.log('Adding stop, current stops:', stops.length);
            onAddStop();
          } catch (error) {
            console.error('Error adding stop:', error);
          }
        }}
        className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-gray-300 hover:border-gray-500 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-4 h-4" />
        <span>Add Stop</span>
      </motion.button>

      {/* Destination Location */}
      <div className="relative">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Final Destination</label>
            <LocationDropdown
              placeholder="Where to?"
              value={destinationInput}
              onChange={(value) => setDestinationInput(value)}
              onSelect={onDestinationChange}
              isOpen={activeDropdown === 'destination'}
              onToggle={() => setActiveDropdown(activeDropdown === 'destination' ? null : 'destination')}
            />
          </div>
        </div>
      </div>

      {/* Route Summary */}
      {(pickup || destination || stops.length > 0) && (
        <div className="mt-6 p-4 bg-dark-600 rounded-lg border border-dark-500">
          <h3 className="text-sm font-medium text-white mb-3">Route Summary</h3>
          <div className="space-y-2">
            {pickup && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">{pickup.address}</span>
              </div>
            )}
            {stops.map((stop, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">{stop.address}</span>
              </div>
            ))}
            {destination && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">{destination.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiDestinationInput; 