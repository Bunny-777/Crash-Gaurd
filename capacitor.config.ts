import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.crashguard',
  appName: 'CrashGuard',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Geolocation: {
      permissions: ["location", "coarseLocation"]
    },
    Device: {
      permissions: ["notifications"]
    },
    Haptics: {}
  }
};

export default config;