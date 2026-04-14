import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glamguide.ai',
  appName: 'Glam Guide AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    // Use Android DeepAR key
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  ios: {
    // iOS-specific config
    contentInset: 'always',
    backgroundColor: '#ffffff',
  },
  plugins: {
    Camera: {
      // Camera plugin configuration
    },
  },
};

export default config;
