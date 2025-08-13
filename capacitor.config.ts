import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.4e02027d25f647a8acad4a88e2afcf7a',
  appName: 'motion-alert-buddy',
  webDir: 'dist',
  server: {
    url: 'https://4e02027d-25f6-47a8-acad-4a88e2afcf7a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ["location", "coarseLocation"]
    },
    Device: {
      permissions: ["notifications"]
    }
  }
};

export default config;