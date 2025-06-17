import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { createTables, initializeDefaultData } from '@/utils/db';

import mobileAds from 'react-native-google-mobile-ads';

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
