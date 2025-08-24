import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Car, Navigation, Clock, MapPin } from "lucide-react";
import { LocationSuggestion } from "../types/location";

interface RouteMapProps {
  pickup: LocationSuggestion | null;
  destination: LocationSuggestion | null;
  stops: LocationSuggestion[];
  onBack: () => void;
  onConfirm: () => void;
  onRouteCalculated?: (routeInfo: {
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

const RouteMap: React.FC<RouteMapProps> = ({ 
  pickup, 
  destination, 
  stops,
  onBack, 
  onConfirm,
  onRouteCalculated 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    durationValue: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
        console.log('Initializing Google Maps with black theme...');
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: isMobile ? 13 : 12,
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

        const directionsServiceInstance = new window.google.maps.DirectionsService();
        const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#3B82F6',
            strokeWeight: isMobile ? 4 : 5,
            strokeOpacity: 0.8
          },
          markerOptions: {
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
                  <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            }
          }
        });


        calculateRoute(directionsServiceInstance, directionsRendererInstance);
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
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
  }, [pickup, destination, stops, isMobile, blackThemeMapStyles]);

  const calculateRoute = async (service: any, renderer: any) => {
    if (!service || !renderer || !pickup || !destination) return;
    try {
      setIsLoading(true);
      
      // Create waypoints from stops
      const waypoints = stops
        .filter((stop: LocationSuggestion) => stop.address && stop.address.trim() !== '')
        .map((stop: LocationSuggestion) => ({
          location: stop.address,
          stopover: true
        }));

      const request = {
        origin: pickup.address,
        destination: destination.address,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        optimizeWaypoints: false // Keep stops in the order specified
      };
      
      console.log('Calculating route with stops:', {
        origin: pickup.address,
        destination: destination.address,
        waypoints: waypoints.map((wp: any) => wp.location)
      });
      
      const result = await service.route(request);
      if (result.routes && result.routes.length > 0) {
        renderer.setDirections(result);
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
        
        setRouteInfo({
          distance: distanceText,
          duration: durationText,
          durationValue: totalDuration
        });
        
        console.log('Multi-destination route calculated:', distanceText, durationText);
        onRouteCalculated?.({
          distance: distanceText,
          duration: durationText,
          durationValue: totalDuration
        });
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      setRouteInfo({
        distance: '15.2 km',
        duration: '25 mins',
        durationValue: 1500
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-dark-700 rounded-lg overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Route Preview</h3>
            <p className="text-primary-100 text-sm">Your journey from pickup to destination</p>
          </div>
          <motion.button
            onClick={onBack}
            className="text-white hover:text-primary-200 transition-colors ml-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ← Back
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
              <p className="text-gray-300 text-sm">Calculating route...</p>
            </div>
          </div>
        )}
      </div>

      {/* Route Information */}
      <div className={`p-4 space-y-3 ${isMobile ? 'pb-32' : 'pb-4'}`}>
        <div className="bg-dark-600 rounded-lg p-3">
          <div className="flex items-center space-x-3 mb-2">
            <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">From</p>
              <p className="font-medium text-sm truncate">{pickup?.address || 'Pickup location'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">To</p>
              <p className="font-medium text-sm truncate">{destination?.address || 'Destination'}</p>
            </div>
          </div>
        </div>

        {/* Route Details */}
        {routeInfo && (
          <div className="bg-dark-600 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">Trip Details</h4>
              <Car className="w-5 h-5 text-primary-400" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-dark-500 rounded">
                <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Duration</p>
                <p className="font-semibold text-sm">{routeInfo.duration}</p>
              </div>

              <div className="text-center p-2 bg-dark-500 rounded">
                <Navigation className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Distance</p>
                <p className="font-semibold text-sm">{routeInfo.distance}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Button at Bottom */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 bg-dark-700 border-t border-dark-600 z-50 ${isMobile ? 'pb-6' : ''}`}>
        <motion.button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold transition-colors text-lg shadow-lg border-2 border-primary-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ minHeight: '60px' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Calculating Route...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg font-bold">Continue to Car Selection</span>
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </motion.button>
        {isMobile && (
          <p className="text-xs text-gray-400 text-center mt-2">
            Tap to proceed to car selection
          </p>
        )}
      </div>
    </div>
  );
};

export default RouteMap; 