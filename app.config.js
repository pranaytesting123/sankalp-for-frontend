// app.config.js

import 'dotenv/config';

const API_URL = process.env.EXPO_PUBLIC_API_URL
  ?? 'https://sankalp-deploy-1.onrender.com';
console.log('♥♥♥API_URL in app.config.js is♥♥♥ :', API_URL);
export default {
  expo: {
    name: "hehehehe",
    slug: "sindhu01",
    owner: "sindhu123",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "5a9f7914-532b-4f0e-817f-10ef000c3686"
      },
      // ✅ Pull from .env file
      expoPublicApiUrl: API_URL,
    },
    android: {
      package: "com.joy3.boltexponativewind",
      Permissions: ["INTERNET", "ACCESS_NETWORK_STATE", "READ_PHONE_STATE", "WRITE_EXTERNAL_STORAGE", "READ_EXTERNAL_STORAGE"]
    }
  }
};
