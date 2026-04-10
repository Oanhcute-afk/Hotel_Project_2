import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "dummy"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export let analytics;

isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});