import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, MapPin, Clock } from 'lucide-react';

interface EmergencyAlertProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  location?: { latitude: number; longitude: number } | null;
  contactName?: string;
}

export const EmergencyAlert = ({
  isVisible,
  onCancel,
  onConfirm,
  location,
  contactName = 'Emergency Contact'
}: EmergencyAlertProps) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isVisible) {
      setCountdown(10);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onConfirm]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="fixed inset-0 bg-emergency/20 emergency-glow" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border-2 border-emergency overflow-hidden">
          {/* Header */}
          <div className="crashguard-gradient-emergency p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-emergency-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-emergency-foreground mb-2">
              CRASH DETECTED
            </h1>
            <p className="text-emergency-foreground/90">
              Emergency services will be contacted automatically
            </p>
          </div>

          {/* Countdown */}
          <div className="p-6 text-center bg-card">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emergency/10 rounded-full mb-4">
              <div className="text-3xl font-bold text-emergency">
                {countdown}
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Auto-send in {countdown} seconds</span>
              </div>

              {location && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>Contacting {contactName}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={onCancel}
                variant="outline"
                size="lg"
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                I'M SAFE - CANCEL ALERT
              </Button>
              
              <Button
                onClick={onConfirm}
                size="lg"
                className="w-full crashguard-gradient-emergency text-emergency-foreground border-none"
              >
                SEND EMERGENCY ALERT NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};