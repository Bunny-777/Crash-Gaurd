import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Phone, User, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactSetupProps {
  onSave: (contact: { name: string; phone: string }) => Promise<boolean>;
  existingContact?: { name: string; phone: string } | null;
}

export const ContactSetup = ({ onSave, existingContact }: ContactSetupProps) => {
  const [name, setName] = useState(existingContact?.name || '');
  const [phone, setPhone] = useState(existingContact?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and phone number.",
        variant: "destructive",
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await onSave({ name: name.trim(), phone: phone.trim() });
    
    if (success) {
      toast({
        title: "Contact Saved",
        description: "Emergency contact has been saved successfully.",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "Failed to save emergency contact. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="border-2">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Emergency Contact</CardTitle>
        <CardDescription>
          Set up your emergency contact for crash alerts
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., +1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 crashguard-gradient-safety text-primary-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : existingContact ? 'Update Contact' : 'Save Contact'}
          </Button>
        </form>

        {existingContact && (
          <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 text-success mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Contact Configured</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {existingContact.name} • {existingContact.phone}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};