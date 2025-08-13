import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Navigation, Gauge, MapPin } from 'lucide-react';

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

interface SensorDashboardProps {
  sensorData: SensorData | null;
  location: LocationData | null;
  isMonitoring: boolean;
}

export const SensorDashboard = ({ sensorData, location, isMonitoring }: SensorDashboardProps) => {
  const formatValue = (value: number | null | undefined) => {
    return value ? value.toFixed(2) : '0.00';
  };

  const getAccelerationMagnitude = () => {
    if (!sensorData?.acceleration) return 0;
    const { x = 0, y = 0, z = 0 } = sensorData.acceleration;
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  };

  const getRotationMagnitude = () => {
    if (!sensorData?.rotationRate) return 0;
    const { alpha = 0, beta = 0, gamma = 0 } = sensorData.rotationRate;
    return Math.sqrt(alpha ** 2 + beta ** 2 + gamma ** 2);
  };

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex justify-center">
        <Badge
          variant={isMonitoring ? "default" : "secondary"}
          className={`px-4 py-2 text-sm font-medium ${
            isMonitoring 
              ? "crashguard-gradient-success text-success-foreground" 
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Activity className="w-4 h-4 mr-2" />
          {isMonitoring ? "MONITORING ACTIVE" : "MONITORING INACTIVE"}
        </Badge>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Acceleration */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="w-5 h-5 text-primary" />
              Acceleration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-primary">
              {formatValue(getAccelerationMagnitude())} m/s²
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">X:</span>
                <span className="ml-1 font-mono">
                  {formatValue(sensorData?.acceleration?.x)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Y:</span>
                <span className="ml-1 font-mono">
                  {formatValue(sensorData?.acceleration?.y)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Z:</span>
                <span className="ml-1 font-mono">
                  {formatValue(sensorData?.acceleration?.z)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rotation Rate */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Navigation className="w-5 h-5 text-secondary" />
              Rotation Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-secondary">
              {formatValue(getRotationMagnitude())} rad/s
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">α:</span>
                <span className="ml-1 font-mono">
                  {formatValue(sensorData?.rotationRate?.alpha)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">β:</span>
                <span className="ml-1 font-mono">
                  {formatValue(sensorData?.rotationRate?.beta)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">γ:</span>
                <span className="ml-1 font-mono">
                  {formatValue(sensorData?.rotationRate?.gamma)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPS Location */}
        <Card className="border-2 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-warning" />
              GPS Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Latitude:</span>
                    <div className="text-lg font-mono">{location.latitude.toFixed(6)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Longitude:</span>
                    <div className="text-lg font-mono">{location.longitude.toFixed(6)}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Accuracy: ±{location.accuracy.toFixed(0)}m
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Location not available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};