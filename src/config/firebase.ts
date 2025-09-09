import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Debug: Vérifier les variables d'environnement
console.log('Firebase Config Debug:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Present' : 'Missing',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL ? 'Present' : 'Missing',
});

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app, process.env.REACT_APP_FIREBASE_DATABASE_URL);
export const googleProvider = new GoogleAuthProvider();

// Configuration spécifique pour PWA
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Configuration pour éviter les problèmes de référent
if (typeof window !== 'undefined') {
  // S'assurer que les headers sont préservés
  auth.useDeviceLanguage();
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn('[firebase] RTDB URL', process.env.REACT_APP_FIREBASE_DATABASE_URL);
  }
}

export default app;
