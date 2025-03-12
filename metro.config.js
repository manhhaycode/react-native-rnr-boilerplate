// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Ensure compatibility with Expo's Metro bundler
const config = getDefaultConfig(__dirname);

// Apply NativeWind and Reanimated configs correctly
module.exports = wrapWithReanimatedMetroConfig(withNativeWind(config, { input: './global.css' }));
