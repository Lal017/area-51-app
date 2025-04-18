export const expo = {
  name: "Area 51 Motorsports",
  slug: "trop-locksmith-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "area51scheme",
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
      backgroundColor: "#000000"
    },
    package: "com.lalo17.troplocksmithapp",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
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
    ],
    [
      "expo-notifications",
      {
        "icon": "./assets/images/logo-large.png",
        "color": "#000000",
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    amplifyConfig: process.env.AMPLIFY_CONFIG ?? '../src/amplifyconfiguration.json',
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