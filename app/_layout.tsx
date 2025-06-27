import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { createTables, initializeDefaultData } from '@/utils/db';

let mobileAds: any = null;
let isGoogleAdsAvailable = false;

try {
  const GoogleMobileAds = require('react-native-google-mobile-ads');
  mobileAds = GoogleMobileAds.default;
  isGoogleAdsAvailable = true;
} catch (error) {
  console.log(
    'Google Mobile Ads not available in RootLayout:',
    error instanceof Error ? error.message : String(error),
  );
  isGoogleAdsAvailable = false;
}

export default function RootLayout() {
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await createTables();
        await initializeDefaultData();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    const initAds = async () => {
      if (!isGoogleAdsAvailable || !mobileAds) {
        console.log(
          'Skipping Google Mobile Ads initialization - module not available',
        );
        return;
      }

      try {
        const adapterStatuses = await mobileAds().initialize();
        console.log('Google Mobile Ads initialized:', adapterStatuses);
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
