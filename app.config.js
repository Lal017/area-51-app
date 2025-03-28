export const expo = {
  name: "trop-locksmith-app",
  slug: "trop-locksmith-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "troplocksmithscheme",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.lalo17.troplocksmithapp",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.lalo17.troplocksmithapp",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json'
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "290ba131-9be6-4508-9bdd-cfeb16b0e35d"
    }
  },
  updates: {
    url: "https://u.expo.dev/290ba131-9be6-4508-9bdd-cfeb16b0e35d"
  },
  runtimeVersion: {
    policy: "appVersion"
  }
};
