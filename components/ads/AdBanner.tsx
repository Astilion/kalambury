import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '@/stores/gameStore';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

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
});

export default AdBanner;
