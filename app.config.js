export default {
  expo: {
    name: 'NKUMU Music',
    slug: 'nkumu-music',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'nkumu',
    newArchEnabled: true,

    // Splash screen
    splash: {
      image: './assets/splash.png',
      backgroundColor: '#0A0A0A',
      resizeMode: 'contain',
    },

    // Icons (add actual icon files before store submission)
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',

    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.nkumu.music',
      buildNumber: '1',
      infoPlist: {
        UIBackgroundModes: ['audio'],
        NSMicrophoneUsageDescription: 'NKUMU utilise le microphone pour la reconnaissance vocale.',
      },
    },

    android: {
      package: 'com.nkumu.music',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0A0A0A',
      },
      permissions: ['android.permission.READ_EXTERNAL_STORAGE'],
    },

    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        'expo-av',
        {
          microphonePermission: false,
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            // Enable 16 KB page size alignment (required for Android 15+ devices)
            enableProguardInReleaseBuilds: false,
            extraProguardRules: '',
          },
        },
      ],
    ],

    extra: {
      apiUrl: process.env.API_URL || 'https://api.nkumu.com',
      eas: {
        projectId: '657fc641-53a9-4142-a358-1945c1c816b0',
      },
    },
  },
};
