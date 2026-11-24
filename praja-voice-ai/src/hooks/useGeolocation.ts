import { useState, useEffect, useCallback, useRef } from 'react';

export interface GeoLocationState {
  lat: number;
  lng: number;
  accuracy: number | null; // in meters
  heading: number | null;
  speed: number | null;
  loading: boolean;
  isTracking: boolean;
  isLiveFix: boolean;
  error: string | null;
  timestamp: number | null;
  trail: [number, number][];
}

export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m away`;
  }
  return `${(meters / 1000).toFixed(1)} km away`;
}

// Offline-resilient reverse geocoding for Indian wards and landmarks
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<{
  address: string;
  ward: string;
  pincode: string;
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const road = data.address.road || data.address.pedestrian || data.address.suburb || 'Main Road';
        const neighbourhood = data.address.neighbourhood || data.address.suburb || data.address.city_district || 'Bengaluru';
        const postcode = data.address.postcode || '560038';

        // Detect known Bengaluru Ward
        let detectedWard = 'Ward 12';
        const text = (JSON.stringify(data.address)).toLowerCase();
        if (text.includes('hsr') || text.includes('sector')) detectedWard = 'Ward 84';
        else if (text.includes('koramangala')) detectedWard = 'Ward 45';
        else if (text.includes('jayanagar')) detectedWard = 'Ward 102';
        else if (text.includes('whitefield') || text.includes('itpl')) detectedWard = 'Ward 78';
        else if (text.includes('malleswaram') || text.includes('malleshwaram')) detectedWard = 'Ward 112';
        else if (text.includes('bellandur')) detectedWard = 'Ward 56';
        else if (text.includes('mg road') || text.includes('shanthi')) detectedWard = 'Ward 14';

        return {
          address: `${road}, ${neighbourhood}`,
          ward: detectedWard,
          pincode: postcode,
        };
      }
    }
  } catch {
    // Fall through to heuristic boundary lookup
  }

  // Heuristic coordinate bounding lookup for Bengaluru
  if (lat > 12.96 && lat < 12.98 && lng > 77.63 && lng < 77.65) {
    return { address: '80 Feet Road, Indiranagar', ward: 'Ward 12', pincode: '560038' };
  }
  if (lat > 12.91 && lat < 12.93 && lng > 77.63 && lng < 77.66) {
    return { address: '27th Main Rd, HSR Layout Sector 1', ward: 'Ward 84', pincode: '560102' };
  }
  if (lat > 12.93 && lat < 12.95 && lng > 77.61 && lng < 77.63) {
    return { address: 'Sony World Junction, Koramangala 4th Block', ward: 'Ward 45', pincode: '560034' };
  }
  if (lat > 12.96 && lat < 12.98 && lng > 77.72 && lng < 77.75) {
    return { address: 'ITPL Main Road, Whitefield', ward: 'Ward 78', pincode: '560066' };
  }
  if (lat > 12.92 && lat < 12.94 && lng > 77.58 && lng < 77.60) {
    return { address: '11th Main, 4th Block, Jayanagar', ward: 'Ward 102', pincode: '560011' };
  }

  return {
    address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, Metro City`,
    ward: 'Ward 12',
    pincode: '560001',
  };
}

export function useGeolocation() {
  const [state, setState] = useState<GeoLocationState>({
    lat: 12.9716, // Bengaluru Default Coordinates until live GPS fix arrives
    lng: 77.6412,
    accuracy: null,
    heading: null,
    speed: null,
    loading: false,
    isTracking: false,
    isLiveFix: false,
    error: null,
    timestamp: null,
    trail: [],
  });

  const watchIdRef = useRef<number | null>(null);

  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const newLat = position.coords.latitude;
    const newLng = position.coords.longitude;
    const newAcc = Math.round(position.coords.accuracy);

    setState((prev) => {
      const lastPoint = prev.trail[prev.trail.length - 1];
      const shouldAppend =
        !lastPoint ||
        calculateDistanceMeters(lastPoint[0], lastPoint[1], newLat, newLng) >= 3;

      const updatedTrail = shouldAppend
        ? [...prev.trail.slice(-49), [newLat, newLng] as [number, number]]
        : prev.trail;

      return {
        ...prev,
        lat: newLat,
        lng: newLng,
        accuracy: newAcc,
        heading: position.coords.heading ?? prev.heading,
        speed: position.coords.speed ?? prev.speed,
        loading: false,
        isLiveFix: true,
        error: null,
        timestamp: position.timestamp,
        trail: updatedTrail,
      };
    });
  }, []);

  const handlePositionError = useCallback((error: GeolocationPositionError) => {
    let errorMsg = 'Unable to retrieve GPS location';
    if (error.code === error.PERMISSION_DENIED) {
      errorMsg = 'GPS permission denied. Allow location access in browser settings.';
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      errorMsg = 'GPS signal unavailable.';
    } else if (error.code === error.TIMEOUT) {
      errorMsg = 'GPS fix timed out. Retrying...';
    }
    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorMsg,
    }));
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((prev) => ({ ...prev, isTracking: false, loading: false }));
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        isTracking: false,
      }));
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setState((prev) => ({ ...prev, loading: true, isTracking: true, error: null }));

    // Get immediate initial fix
    navigator.geolocation.getCurrentPosition(handlePositionUpdate, handlePositionError, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    });

    // Activate continuous watchPosition GPS tracing
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [handlePositionUpdate, handlePositionError]);

  const requestLocation = useCallback(async (): Promise<{ lat: number; lng: number; accuracy: number } | null> => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation is not supported by your browser' }));
      return null;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handlePositionUpdate(position);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
          });
        },
        (error) => {
          handlePositionError(error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    });
  }, [handlePositionUpdate, handlePositionError]);

  const toggleTracking = useCallback(() => {
    if (state.isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  }, [state.isTracking, startTracking, stopTracking]);

  useEffect(() => {
    // Activate continuous GPS tracing automatically on mount
    startTracking();
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [startTracking]);

  return {
    ...state,
    requestLocation,
    startTracking,
    stopTracking,
    toggleTracking,
    calculateDistance: calculateDistanceMeters,
    formatDistance,
    reverseGeocode: reverseGeocodeCoords,
  };
}
