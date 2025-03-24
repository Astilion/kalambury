import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { createTables, initializeDefaultData } from '@/utils/db';

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
    
    initDatabase();
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
