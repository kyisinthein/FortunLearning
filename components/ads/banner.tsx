import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use Google's test ad unit IDs during development.
// Replace with your real Ad Unit IDs when ready for production.
const bannerUnitId = __DEV__ ? TestIds.BANNER : TestIds.BANNER; // keep test until you add real IDs

export default function BannerAdView() {
  if (process.env.EXPO_OS === 'web') {
    // AdMob is native-only; skip rendering on web to avoid errors.
    return null;
  }

  return (
    <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
      <BannerAd unitId={bannerUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}