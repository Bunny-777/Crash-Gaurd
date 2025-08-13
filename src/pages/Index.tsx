import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Play, Pause, AlertTriangle } from 'lucide-react';
import { ContactSetup } from '@/components/ContactSetup';
import { SensorDashboard } from '@/components/SensorDashboard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { EmergencyAlert } from '@/components/EmergencyAlert';
import { useCrashDetection } from '@/hooks/useCrashDetection';
import { useEmergencyContact } from '@/hooks/useEmergencyContact';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  
  const {
    isMonitoring,
    sensorData,
    location,
    crashDetected,
    sensitivity,
    setSensitivity,
    startMonitoring,
    stopMonitoring,
    dismissCrash,
  } = useCrashDetection();

  const {
    contact,
    isLoading: contactLoading,
    saveContact,
    removeContact,
  } = useEmergencyContact();

  // Auto-switch to contact setup if no contact exists
  useEffect(() => {
    if (!contactLoading && !contact) {
      setActiveTab('contact');
    }
  }, [contact, contactLoading]);

  const handleStartStop = () => {
    if (!contact) {
      toast({
        title: "Setup Required",
        description: "Please set up an emergency contact before starting monitoring.",
        variant: "destructive",
      });
      setActiveTab('contact');
      return;
    }

    if (isMonitoring) {
      stopMonitoring();
      toast({
        title: "Monitoring Stopped",
        description: "Crash detection has been disabled.",
      });
    } else {
      startMonitoring();
      toast({
        title: "Monitoring Started",
        description: "CrashGuard is now actively monitoring for crashes.",
      });
    }
  };

  const handleEmergencyConfirm = () => {
    // In a real app, this would send SMS or call emergency services
    toast({
      title: "Emergency Alert Sent",
      description: `Alert sent to ${contact?.name || 'emergency contact'} with your location.`,
    });
    dismissCrash();
  };

  if (contactLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CrashGuard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Alert Overlay */}
      <EmergencyAlert
        isVisible={crashDetected}
        onCancel={dismissCrash}
        onConfirm={handleEmergencyConfirm}
        location={location}
        contactName={contact?.name}
      />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 crashguard-gradient-safety rounded-lg">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CrashGuard</h1>
                <p className="text-sm text-muted-foreground">Motion Alert System</p>
              </div>
            </div>
            
            <Button
              onClick={handleStartStop}
              size="lg"
              variant={isMonitoring ? "outline" : "default"}
              className={`min-w-[120px] ${
                isMonitoring 
                  ? "border-2 border-emergency text-emergency hover:bg-emergency hover:text-emergency-foreground" 
                  : "crashguard-gradient-safety text-primary-foreground"
              }`}
              disabled={!contact}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="contact">
              Contact {!contact && <Badge variant="destructive" className="ml-2">!</Badge>}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SensorDashboard
              sensorData={sensorData}
              location={location}
              isMonitoring={isMonitoring}
            />
            
            {!contact && (
              <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium">Setup Required</p>
                  <p className="text-sm text-muted-foreground">
                    Please configure an emergency contact to enable crash detection.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contact">
            <ContactSetup
              onSave={saveContact}
              existingContact={contact}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel
              sensitivity={sensitivity}
              onSensitivityChange={setSensitivity}
              onRemoveContact={removeContact}
              hasContact={!!contact}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
