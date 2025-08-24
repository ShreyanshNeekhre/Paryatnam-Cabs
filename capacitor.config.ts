import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.paryatnamcabs.app',
  appName: 'Paryatnam Cabs',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1a1a1a",
      showSpinner: true,
      spinnerColor: "#3b82f6"
    }
  }
};

export default config;
