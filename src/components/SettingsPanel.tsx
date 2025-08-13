import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Settings, Zap, Shield, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  sensitivity: number;
  onSensitivityChange: (value: number) => void;
  onRemoveContact: () => Promise<boolean>;
  hasContact: boolean;
}

export const SettingsPanel = ({ 
  sensitivity, 
  onSensitivityChange, 
  onRemoveContact,
  hasContact 
}: SettingsPanelProps) => {
  const { toast } = useToast();

  const getSensitivityLabel = (value: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return labels[value - 1] || 'Medium';
  };

  const getSensitivityDescription = (value: number) => {
    const descriptions = [
      'Only extreme crashes will trigger alerts',
      'Major impacts will trigger alerts',
      'Moderate impacts will trigger alerts',
      'Minor impacts may trigger alerts',
      'Very sensitive - may trigger false alerts'
    ];
    return descriptions[value - 1] || 'Balanced sensitivity';
  };

  const handleRemoveContact = async () => {
    const success = await onRemoveContact();
    if (success) {
      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed.",
      });
    } else {
      toast({
        title: "Remove Failed",
        description: "Failed to remove emergency contact.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Sensitivity Settings */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            Crash Detection Sensitivity
          </CardTitle>
          <CardDescription>
            Adjust how sensitive the crash detection algorithm is
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Sensitivity Level</Label>
              <div className="text-right">
                <div className="font-medium text-primary">
                  {getSensitivityLabel(sensitivity)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Level {sensitivity}/5
                </div>
              </div>
            </div>
            
            <Slider
              value={[sensitivity]}
              onValueChange={(values) => onSensitivityChange(values[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            
            <div className="text-sm text-muted-foreground">
              {getSensitivityDescription(sensitivity)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Management */}
      {hasContact && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              Contact Management
            </CardTitle>
            <CardDescription>
              Manage your emergency contact settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleRemoveContact}
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Emergency Contact
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Safety Information */}
      <Card className="border-2 border-success/20 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <Shield className="w-5 h-5" />
            Safety Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• CrashGuard continuously monitors your device's motion sensors</p>
          <p>• The app works even when minimized or in the background</p>
          <p>• GPS location is included in emergency alerts</p>
          <p>• Adjust sensitivity based on your vehicle and driving conditions</p>
          <p>• Test the system in a safe environment before relying on it</p>
        </CardContent>
      </Card>
    </div>
  );
};