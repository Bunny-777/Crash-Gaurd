import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

interface EmergencyContact {
  name: string;
  phone: string;
}

export const useEmergencyContact = () => {
  const [contact, setContact] = useState<EmergencyContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load contact from storage
  useEffect(() => {
    const loadContact = async () => {
      try {
        const { value } = await Preferences.get({ key: 'emergency_contact' });
        if (value) {
          setContact(JSON.parse(value));
        }
      } catch (error) {
        console.error('Failed to load emergency contact:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContact();
  }, []);

  // Save contact to storage
  const saveContact = async (newContact: EmergencyContact) => {
    try {
      await Preferences.set({
        key: 'emergency_contact',
        value: JSON.stringify(newContact),
      });
      setContact(newContact);
      return true;
    } catch (error) {
      console.error('Failed to save emergency contact:', error);
      return false;
    }
  };

  // Remove contact from storage
  const removeContact = async () => {
    try {
      await Preferences.remove({ key: 'emergency_contact' });
      setContact(null);
      return true;
    } catch (error) {
      console.error('Failed to remove emergency contact:', error);
      return false;
    }
  };

  return {
    contact,
    isLoading,
    saveContact,
    removeContact,
  };
};