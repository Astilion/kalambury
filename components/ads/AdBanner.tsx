import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useGameStore } from '@/stores/gameStore';
import { Colors } from '@/constants/Colors';

type GoogleMobileAdsModule = typeof import('react-native-google-mobile-ads');

let BannerAd: GoogleMobileAdsModule['BannerAd'] | null = null;
let BannerAdSize: GoogleMobileAdsModule['BannerAdSize'] | null = null;
let isGoogleAdsAvailable = false;

try {
  // The native module is missing in Expo Go, so require it lazily
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const GoogleMobileAds: GoogleMobileAdsModule = require('react-native-google-mobile-ads');
  BannerAd = GoogleMobileAds.BannerAd;
  BannerAdSize = GoogleMobileAds.BannerAdSize;
  isGoogleAdsAvailable = Boolean(BannerAd && BannerAdSize);
} catch {
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
  if (!isGoogleAdsAvailable || !BannerAd || !BannerAdSize) {
    return (
      <View style={styles.adContainer}>
        <View style={styles.placeholderAd}>
          <Text style={styles.placeholderText}>📱 Ad Banner Placeholder</Text>
          <Text style={styles.placeholderSubText}>
            (Google Mobile Ads module not available)
          </Text>
        </View>
      </View>
    );
  }

  // Show real ad when module is available
  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: Error) => {
          console.warn('Banner ad failed to load:', error.message);
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
    borderColor: Colors.info,
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
    color: Colors.textSecondary,
  },
});

export default AdBanner;
