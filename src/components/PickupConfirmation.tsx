import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, CheckCircle } from "lucide-react";
import { LocationSuggestion } from "../types/location";

interface PickupConfirmationProps {
  pickup: LocationSuggestion | null;
  destination: LocationSuggestion | null;
  stops: LocationSuggestion[];
  distance: string;
  duration: string;
  carType: {
    name: string;
    icon: string;
    estimatedFare: number;
    capacity: number;
    features: string[];
    baseFare: number;
    perKmRate: number;
  };
  scheduledDate: Date;
  scheduledTime: string;
  onBack: () => void;
  onConfirm: () => void;
  onPickupLocationUpdate?: (newLocation: LocationSuggestion, newRouteInfo: {
    distance: string;
    duration: string;
    durationValue: number;
  }) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const PickupConfirmation: React.FC<PickupConfirmationProps> = ({
  pickup,
  destination,
  stops,
  distance,
  duration,
  carType,
  scheduledDate,
  scheduledTime,
  onBack,
  onConfirm,
  onPickupLocationUpdate
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [pickupMarker, setPickupMarker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(distance);
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [currentFare, setCurrentFare] = useState(carType.estimatedFare);

  // Black theme map styles
  const blackThemeMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }]
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }]
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) {
        console.log('Waiting for Google Maps API to load...');
        return;
      }
      try {
        console.log('Initializing pickup confirmation map...');
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 16,
          center: { lat: 23.1765, lng: 79.9864 }, // Jabalpur coordinates
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: isMobile,
          zoomControl: !isMobile,
          gestureHandling: 'cooperative',
          styles: blackThemeMapStyles,
          backgroundColor: '#1a1a1a',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        setMap(mapInstance);
        
        // Add pickup location marker
        if (pickup) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: pickup.name }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              mapInstance.setCenter(location);
              
              const marker = new window.google.maps.Marker({
                position: location,
                map: mapInstance,
                title: 'Pickup Location',
                icon: {
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
                      <circle cx="16" cy="16" r="6" fill="#FFFFFF"/>
                      <circle cx="16" cy="16" r="3" fill="#3B82F6"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 16)
                },
                draggable: true
              });
              
              setPickupMarker(marker);
              
              // Add info window
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px; max-width: 200px;">
                    <h3 style="margin: 0 0 4px 0; font-weight: bold; color: #1f2937;">Pickup Location</h3>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">${pickup.name}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">Drag to adjust location</p>
                  </div>
                `
              });
              
              marker.addListener('click', () => {
                infoWindow.open(mapInstance, marker);
              });
              
              // Show info window by default
              infoWindow.open(mapInstance, marker);
              
              // Add drag end listener
              marker.addListener('dragend', () => {
                handleMarkerDragEnd(marker);
              });
            }
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        console.log('Google Maps API not loaded within timeout');
        setIsLoading(false);
      }, 10000);
    }
  }, [pickup, isMobile, blackThemeMapStyles]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    if (time === "now") return "Immediate pickup";
    
    // Handle custom time (HH:MM format)
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':').map(Number);
      const timeString = new Date();
      timeString.setHours(hours, minutes, 0, 0);
      return timeString.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // Handle predefined time slots
    const minutes = parseInt(time);
    if (minutes === 15) return "Pickup in 15 minutes";
    if (minutes === 30) return "Pickup in 30 minutes";
    if (minutes === 60) return "Pickup in 1 hour";
    
    return `Pickup in ${minutes} minutes`;
  };

  const handleMarkerDragEnd = (marker: any) => {
    const position = marker.getPosition();
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ location: position }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const newLocation: LocationSuggestion = {
          id: `pickup-${Date.now()}`,
          name: results[0].formatted_address,
          address: results[0].formatted_address,
          type: 'google',
          placeId: results[0].place_id,
          coordinates: {
            lat: position.lat(),
            lng: position.lng()
          }
        };
        
        // Calculate new route with updated pickup location
        calculateNewRoute(newLocation);
      }
    });
  };

  const calculateNewRoute = async (newPickupLocation: LocationSuggestion) => {
    if (!destination || !window.google || !window.google.maps) return;
    
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      // Create waypoints from stops
      const waypoints = stops
        .filter(stop => stop.address && stop.address.trim() !== '')
        .map(stop => ({
          location: stop.address,
          stopover: true
        }));

      const request = {
        origin: newPickupLocation.address,
        destination: destination.address,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        optimizeWaypoints: false
      };
      
      const result = await directionsService.route(request);
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        
        // Calculate total distance and duration from all legs
        let totalDistance = 0;
        let totalDuration = 0;
        
        route.legs.forEach((leg: any) => {
          totalDistance += leg.distance.value;
          totalDuration += leg.duration.value;
        });
        
        // Convert to readable format
        const distanceText = `${(totalDistance / 1000).toFixed(1)} km`;
        const durationText = totalDuration >= 3600 
          ? `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m`
          : `${Math.round(totalDuration / 60)} mins`;
        
        // Calculate new fare
        const distanceKm = totalDistance / 1000;
        const baseFare = carType.baseFare || 50;
        const perKmRate = carType.perKmRate || 12;
        const newFare = Math.round(baseFare + (distanceKm * perKmRate));
        
        // Update local state
        setCurrentDistance(distanceText);
        setCurrentDuration(durationText);
        setCurrentFare(newFare);
        
        // Update parent component
        if (onPickupLocationUpdate) {
          onPickupLocationUpdate(newPickupLocation, {
            distance: distanceText,
            duration: durationText,
            durationValue: totalDuration
          });
        }
        
        // Update info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; color: #1f2937;">Updated Pickup Location</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">${newPickupLocation.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">New distance: ${distanceText}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #9ca3af;">New fare: ₹${newFare}</p>
            </div>
          `
        });
        infoWindow.open(map, pickupMarker);
      }
    } catch (error) {
      console.error('Error calculating new route:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-700 rounded-lg overflow-hidden relative"
      style={{ minHeight: '100vh' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Confirm Pickup</h3>
            <p className="text-primary-100 text-sm">Verify your pickup location</p>
          </div>
          <motion.button
            onClick={onBack}
            className="text-white hover:text-primary-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className={`w-full bg-dark-900 ${isMobile ? 'h-80' : 'h-64'}`}
          style={{ minHeight: isMobile ? '320px' : '256px' }}
        />

        {isLoading && (
          <div className="absolute inset-0 bg-dark-900 bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-2"></div>
              <p className="text-gray-300 text-sm">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Trip Summary */}
      <div className={`p-4 space-y-3 ${isMobile ? 'pb-32' : 'pb-4'}`}>
        <div className="bg-dark-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Trip Summary</h4>
            <div className="text-2xl">{carType.icon}</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">From:</span>
              <span className="text-white font-medium">{pickup?.name || 'N/A'}</span>
            </div>
            
            {/* Stops */}
            {stops && stops.length > 0 && stops.map((stop, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-400">Stop {index + 1}:</span>
                <span className="text-white font-medium">{stop.name}</span>
              </div>
            ))}
            
            <div className="flex justify-between">
              <span className="text-gray-400">To:</span>
              <span className="text-white font-medium">{destination?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vehicle:</span>
              <span className="text-white">{carType.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">{formatDate(scheduledDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time:</span>
              <span className="text-white">{formatTime(scheduledTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Distance:</span>
              <span className="text-white">{currentDistance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">{currentDuration}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-dark-500">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total Fare:</span>
              <span className="text-2xl font-bold text-primary-400">₹{currentFare}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Navigation className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-400 font-medium">Pickup Location</p>
              <p className="text-xs text-blue-300 mt-1">
                The marker shows your pickup location. You can drag it to adjust if needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 bg-dark-700 border-t border-dark-600 z-50 ${isMobile ? 'pb-6' : ''}`}>
        <motion.button
          onClick={onConfirm}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg border-2 border-primary-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ minHeight: '60px' }}
        >
          <div className="flex items-center justify-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            <span className="text-lg font-bold">Confirm Booking</span>
          </div>
        </motion.button>
        
        {isMobile && (
          <p className="text-xs text-gray-400 text-center mt-2">
            Tap to confirm your booking
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PickupConfirmation; 