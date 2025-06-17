import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useGameStore } from '@/stores/gameStore';
import Constants from 'expo-constants';

// Check if Google Mobile Ads is available (simpler approach)
let BannerAd: any = null;
let BannerAdSize: any = null;
let isGoogleAdsAvailable = false;

try {
  const GoogleMobileAds = require('react-native-google-mobile-ads');
  BannerAd = GoogleMobileAds.BannerAd;
  BannerAdSize = GoogleMobileAds.BannerAdSize;
  isGoogleAdsAvailable = true;
} catch (error) {
  console.log('Google Mobile Ads not available - showing placeholder');
  isGoogleAdsAvailable = false;
}

// Test Banner Ad Unit ID
const BANNER_AD_UNIT_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/6300978111' // Google's test banner unit ID
  : 'ca-app-pub-2129979945792882/9690225512';

const AdBanner: React.FC = () => {
  const { adsEnabled } = useGameStore();

  // Don't render if ads are disabled
  if (!adsEnabled) {
    return null;
  }

  // Show placeholder if Google Ads not available
  if (!isGoogleAdsAvailable) {
    return (
      <View style={styles.adContainer}>
        <View style={styles.placeholderAd}>
          <Text style={styles.placeholderText}>📱 Ad Banner Placeholder</Text>
          <Text style={styles.placeholderSubText}>
            (Ads will show in production build)
          </Text>
        </View>
      </View>
    );
  }

  // Show real ad in production/development build
  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 10,
    paddingBottom: 20,
  },
  placeholderAd: {
    width: 320,
    height: 50,
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 2,
  },
  placeholderSubText: {
    fontSize: 10,
    color: '#666',
  },
});

export default AdBanner;
