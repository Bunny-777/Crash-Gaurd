import { useState, useEffect, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface SensorData {
  acceleration: DeviceMotionEvent['acceleration'];
  rotationRate: DeviceMotionEvent['rotationRate'];
  timestamp: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export const useCrashDetection = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [crashDetected, setCrashDetected] = useState(false);
  const [sensitivity, setSensitivity] = useState(2); // 1-5 scale

  // Crash detection thresholds based on sensitivity
  const getThresholds = useCallback(() => {
    const baseThreshold = 6 - sensitivity; // Higher sensitivity = lower threshold
    return {
      acceleration: baseThreshold * 3, // m/s²
      rotation: baseThreshold * 10, // rad/s
    };
  }, [sensitivity]);

  // Request location updates
  const updateLocation = useCallback(async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Location error:', error);
    }
  }, []);

  // Motion detection handler
  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const data: SensorData = {
      acceleration: event.acceleration,
      rotationRate: event.rotationRate,
      timestamp: Date.now(),
    };

    setSensorData(data);

    // Crash detection logic
    if (event.acceleration && event.rotationRate) {
      const { acceleration: accThreshold, rotation: rotThreshold } = getThresholds();
      
      const totalAcceleration = Math.sqrt(
        (event.acceleration.x || 0) ** 2 +
        (event.acceleration.y || 0) ** 2 +
        (event.acceleration.z || 0) ** 2
      );

      const totalRotation = Math.sqrt(
        (event.rotationRate.alpha || 0) ** 2 +
        (event.rotationRate.beta || 0) ** 2 +
        (event.rotationRate.gamma || 0) ** 2
      );

      // Trigger crash detection if thresholds exceeded
      if (totalAcceleration > accThreshold || totalRotation > rotThreshold) {
        setCrashDetected(true);
        Haptics.impact({ style: ImpactStyle.Heavy });
      }
    }
  }, [getThresholds]);

  const startMonitoring = useCallback(async () => {
    try {
      // Request permissions for iOS 13+
      let permissions = 'granted';
      
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        permissions = await (DeviceMotionEvent as any).requestPermission();
      }
      
      if (permissions === 'granted') {
        setIsMonitoring(true);
        window.addEventListener('devicemotion', handleMotion);
        
        // Start location tracking
        await updateLocation();
        const locationInterval = setInterval(updateLocation, 5000);

        return () => {
          window.removeEventListener('devicemotion', handleMotion);
          clearInterval(locationInterval);
        };
      }
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  }, [handleMotion, updateLocation]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    window.removeEventListener('devicemotion', handleMotion);
  }, [handleMotion]);

  const dismissCrash = useCallback(() => {
    setCrashDetected(false);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleMotion]);

  return {
    isMonitoring,
    sensorData,
    location,
    crashDetected,
    sensitivity,
    setSensitivity,
    startMonitoring,
    stopMonitoring,
    dismissCrash,
  };
};