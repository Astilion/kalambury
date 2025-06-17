import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useGameStore } from '@/stores/gameStore';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const BANNER_AD_UNIT_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/6300978111'
  : 'ca-app-pub-2129979945792882/9690225512';

export default function AdBanner() {
  const { adsEnabled } = useGameStore();

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
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}
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
  adPlaceholder: {
    width: 320,
    height: 50,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196f3',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adPlaceholderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  adPlaceholderSubtext: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
});
