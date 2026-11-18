import { initializeApp } from 'firebase/app';

// Firebase settings are read from EXPO_PUBLIC_FIREBASE_* environment variables.
// Copy `.env.example` to `.env` and fill in the values from your Firebase console
// (Project settings -> General -> Your apps -> Web app).
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn(
    '[firebase] Missing EXPO_PUBLIC_FIREBASE_* environment variables. ' +
      'Copy .env.example to .env and fill in your Firebase project settings.'
  );
}

const app = initializeApp(firebaseConfig);

// Firebase Analytics only works in browsers, so load it lazily on web.
let analytics = null;
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  import('firebase/analytics')
    .then(async ({ getAnalytics, isSupported }) => {
      if (await isSupported()) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

export { app, analytics };
