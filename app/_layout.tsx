import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { createTables, initializeDefaultData } from '@/utils/db';

type GoogleMobileAdsModule = typeof import('react-native-google-mobile-ads');

let mobileAds: GoogleMobileAdsModule['default'] | null = null;
let isGoogleAdsAvailable = false;

try {
  // The native module is missing in Expo Go, so require it lazily
  const GoogleMobileAds: GoogleMobileAdsModule = require('react-native-google-mobile-ads');
  mobileAds = GoogleMobileAds.default;
  isGoogleAdsAvailable = true;
} catch (error) {
  isGoogleAdsAvailable = false;
}

export default function RootLayout() {
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await createTables();
        await initializeDefaultData();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

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
