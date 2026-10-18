import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initDatabase } from '@/utils/db';

type GoogleMobileAdsModule = typeof import('react-native-google-mobile-ads');

let mobileAds: GoogleMobileAdsModule['default'] | null = null;
let isGoogleAdsAvailable = false;

try {
  // The native module is missing in Expo Go, so require it lazily
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const GoogleMobileAds: GoogleMobileAdsModule = require('react-native-google-mobile-ads');
  mobileAds = GoogleMobileAds.default;
  isGoogleAdsAvailable = true;
} catch {
  isGoogleAdsAvailable = false;
}

export default function RootLayout() {
  useEffect(() => {
    const initAds = async () => {
      if (!isGoogleAdsAvailable || !mobileAds) {
        return;
      }

      try {
        await mobileAds().initialize();
      } catch (error) {
        console.error('Error initializing Google Mobile Ads:', error);
      }
    };

    // Start seeding early; queries in utils/db also await it, so screens never read an empty DB
    initDatabase();
    initAds();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style='auto' />
    </>
  );
}
