import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6c7122a696df427990a2f47f7acbfdd9',
  appName: 'Calculator App',
  webDir: 'dist',
  server: {
    url: 'https://6c7122a6-96df-4279-90a2-f47f7acbfdd9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#1a1625'
    }
  }
};

export default config;