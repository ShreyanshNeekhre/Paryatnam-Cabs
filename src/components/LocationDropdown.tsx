import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Clock, Star, Home, Building, Plane } from "lucide-react";
import { LocationSuggestion } from "../types/location";

interface LocationDropdownProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: LocationSuggestion) => void;
  isOpen: boolean;
  onToggle: () => void;
}

// Declare global Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  placeholder,
  value,
  onChange,
  onSelect,
  isOpen,
  onToggle
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [googleResults, setGoogleResults] = useState<LocationSuggestion[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced Google Places API fetch with proxy configuration
  const fetchGoogleSuggestions = useCallback(async (input: string) => {
    if (input.length < 2) {
      setGoogleResults([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching Google suggestions for:', input);

      // Try multiple search strategies for better results
      const searchStrategies = [
        {
          types: 'establishment',
          components: ''
        },
        {
          types: 'geocode',
          components: ''
        },
        {
          types: 'airport',
          components: ''
        },
        {
          types: 'transit_station',
          components: ''
        }
      ];

      for (const strategy of searchStrategies) {
        const params = new URLSearchParams({
          input,
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY || '',
          types: strategy.types,
          language: 'en'
        });

        // Use proxy configuration from package.json
        const response = await fetch(`/maps/api/place/autocomplete/json?${params}`);
        const data = await response.json();

        console.log('Google API Response:', data.status, data.predictions?.length || 0, 'Strategy:', strategy.types);

        if (data.status === 'OK' && data.predictions && data.predictions.length > 0) {
          const googleSuggestions: LocationSuggestion[] = data.predictions.map((result: any) => ({
            id: result.place_id,
            name: result.structured_formatting.main_text,
            address: result.structured_formatting.secondary_text,
            type: 'google' as const,
            placeId: result.place_id
          }));
          setGoogleResults(googleSuggestions);
          break; // Use first successful strategy
        } else if (data.status === 'REQUEST_DENIED') {
          console.error('API Key issue:', data.error_message);
          setGoogleResults([]);
          break;
        } else if (data.status === 'OVER_QUERY_LIMIT') {
          console.error('API quota exceeded');
          setGoogleResults([]);
          break;
        } else if (data.status === 'ZERO_RESULTS') {
          console.log('No results for strategy:', strategy.types);
          continue; // Try next strategy
        }
      }
    } catch (error) {
      console.error('Error fetching Google suggestions:', error);
      setGoogleResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchGoogleSuggestions(value);
      }, 300);
    } else {
      setGoogleResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [value, fetchGoogleSuggestions]);

  // Mock saved and recent locations (like Rapido)
  useEffect(() => {
    const savedLocations: LocationSuggestion[] = [
      { id: 'home', name: 'Home', address: '123 Main Street, Delhi', type: 'saved' },
      { id: 'office', name: 'Office', address: '456 Business Park, Delhi', type: 'saved' },
    ];

    const recentLocations: LocationSuggestion[] = [
      { id: 'recent1', name: 'Mall of India', address: 'Noida, UP', type: 'recent' },
      { id: 'recent2', name: 'DLF Cyber Hub', address: 'Gurgaon, Haryana', type: 'recent' },
      { id: 'recent3', name: 'Jabalpur Airport', address: 'Jabalpur, MP', type: 'recent' },
    ];

    const popularLocations: LocationSuggestion[] = [
      { id: 'delhi-airport', name: 'Indira Gandhi International Airport', address: 'Delhi, India', type: 'popular' },
      { id: 'mumbai-airport', name: 'Chhatrapati Shivaji International Airport', address: 'Mumbai, Maharashtra', type: 'popular' },
      { id: 'bangalore-airport', name: 'Kempegowda International Airport', address: 'Bangalore, Karnataka', type: 'popular' },
      { id: 'jabalpur-airport', name: 'Jabalpur Airport', address: 'Jabalpur, Madhya Pradesh', type: 'popular' },
      { id: 'cp', name: 'Connaught Place', address: 'CP, New Delhi', type: 'popular' },
      { id: 'lajpat', name: 'Lajpat Nagar', address: 'Lajpat Nagar, Delhi', type: 'popular' },
      { id: 'cyber-city', name: 'Cyber City', address: 'Gurgaon, Haryana', type: 'popular' },
      { id: 'bandra-west', name: 'Bandra West', address: 'Mumbai, Maharashtra', type: 'popular' },
      { id: 'koramangala', name: 'Koramangala', address: 'Bangalore, Karnataka', type: 'popular' },
      { id: 'baner', name: 'Baner', address: 'Pune, Maharashtra', type: 'popular' },
    ];

    // Add fallback suggestions for common searches
    const fallbackSuggestions: LocationSuggestion[] = [
      { id: 'fallback-jabalpur', name: 'Jabalpur, Madhya Pradesh', address: 'Jabalpur, MP, India', type: 'popular' },
      { id: 'fallback-delhi', name: 'Delhi, India', address: 'Delhi, India', type: 'popular' },
      { id: 'fallback-mumbai', name: 'Mumbai, Maharashtra', address: 'Mumbai, Maharashtra, India', type: 'popular' },
      { id: 'fallback-bangalore', name: 'Bangalore, Karnataka', address: 'Bangalore, Karnataka, India', type: 'popular' },
      { id: 'fallback-pune', name: 'Pune, Maharashtra', address: 'Pune, Maharashtra, India', type: 'popular' },
      { id: 'fallback-hyderabad', name: 'Hyderabad, Telangana', address: 'Hyderabad, Telangana, India', type: 'popular' },
      { id: 'fallback-chennai', name: 'Chennai, Tamil Nadu', address: 'Chennai, Tamil Nadu, India', type: 'popular' },
      { id: 'fallback-kolkata', name: 'Kolkata, West Bengal', address: 'Kolkata, West Bengal, India', type: 'popular' },
    ];

    setSuggestions([...savedLocations, ...recentLocations, ...popularLocations, ...fallbackSuggestions]);
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    let allSuggestions = [...suggestions, ...googleResults];
    
    if (value.trim()) {
      const searchTerm = value.toLowerCase();
      const filtered = allSuggestions.filter(suggestion => {
        const nameMatch = suggestion.name.toLowerCase().includes(searchTerm);
        const addressMatch = suggestion.address.toLowerCase().includes(searchTerm);
        
        const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
        const nameWords = suggestion.name.toLowerCase().split(' ');
        const addressWords = suggestion.address.toLowerCase().split(' ');
        
        const nameWordMatch = searchWords.some(searchWord => 
          nameWords.some(nameWord => nameWord.includes(searchWord))
        );
        const addressWordMatch = searchWords.some(searchWord => 
          addressWords.some(addressWord => addressWord.includes(searchWord))
        );
        
        return nameMatch || addressMatch || nameWordMatch || addressWordMatch;
      });
      
      const sortedResults = filtered.sort((a, b) => {
        // Prioritize by type
        const typePriority = { saved: 0, recent: 1, popular: 2, google: 3 };
        return (typePriority[a.type as keyof typeof typePriority] || 4) - (typePriority[b.type as keyof typeof typePriority] || 4);
      });
      
      setFilteredSuggestions(sortedResults);
    } else {
      // Show all suggestions when no search term
      const sortedResults = allSuggestions.sort((a, b) => {
        // Prioritize by type
        const typePriority = { saved: 0, recent: 1, popular: 2, google: 3 };
        return (typePriority[a.type as keyof typeof typePriority] || 4) - (typePriority[b.type as keyof typeof typePriority] || 4);
      });
      
      setFilteredSuggestions(sortedResults);
    }
  }, [suggestions, googleResults, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleSelect = (suggestion: LocationSuggestion) => {
    console.log('Location selected:', suggestion);
    onChange(suggestion.address);
    onSelect(suggestion);
    
    // Close the dropdown
    if (isOpen) {
      onToggle();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'saved':
        return <Home className="w-4 h-4 text-blue-400" />;
      case 'popular':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'recent':
        return <Clock className="w-4 h-4 text-green-400" />;
      case 'google':
        return <Search className="w-4 h-4 text-purple-400" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'saved':
        return 'Saved';
      case 'popular':
        return 'Popular';
      case 'recent':
        return 'Recent';
      case 'google':
        return 'Search Result';
      default:
        return 'Location';
    }
  };

  const getCategoryIcon = (suggestion: LocationSuggestion) => {
    const name = suggestion.name.toLowerCase();
    const address = suggestion.address.toLowerCase();
    
    if (name.includes('airport') || address.includes('airport')) {
      return <Plane className="w-4 h-4 text-blue-500" />;
    }
    if (name.includes('mall') || name.includes('shopping') || name.includes('market')) {
      return <Building className="w-4 h-4 text-orange-500" />;
    }
    if (name.includes('hotel') || name.includes('restaurant') || name.includes('cafe')) {
      return <Building className="w-4 h-4 text-red-500" />;
    }
    if (name.includes('station') || name.includes('metro')) {
      return <Building className="w-4 h-4 text-green-500" />;
    }
    
    return getTypeIcon(suggestion.type);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onToggle}
          className="w-full bg-dark-700 rounded-lg p-4 pl-12 text-white placeholder-gray-400 outline-none border border-dark-600 focus:border-primary-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-700 rounded-lg border border-dark-600 max-h-96 overflow-y-auto z-50 shadow-xl"
          >
            {isLoading && (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-400 mx-auto mb-2"></div>
                <p>Searching...</p>
              </div>
            )}

            {!isLoading && filteredSuggestions.length > 0 && (
              <div className="py-2">
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={`${suggestion.type}-${suggestion.id}-${index}`}
                    onClick={() => handleSelect(suggestion)}
                    className="w-full flex items-start space-x-3 p-3 hover:bg-dark-600 transition-colors text-left border-b border-dark-600 last:border-b-0"
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(suggestion)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-white truncate">{suggestion.name}</p>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                          {getTypeLabel(suggestion.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{suggestion.address}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {!isLoading && filteredSuggestions.length === 0 && value.trim() && (
              <div className="p-4 text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No locations found</p>
                <p className="text-xs mt-1">Try searching for a different location</p>
                <p className="text-xs mt-1 text-gray-500">
                  Using Google Places API for real-time search results
                </p>
              </div>
            )}

            {!isLoading && filteredSuggestions.length === 0 && !value.trim() && (
              <div className="p-4 text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start typing to search locations</p>
                <p className="text-xs mt-1 text-gray-500">
                  Popular locations and recent searches will appear here
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationDropdown; 