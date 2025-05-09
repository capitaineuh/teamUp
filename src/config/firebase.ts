import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCtxRkmoDL6SRLITZ7ge3QDQxIqz1U8qq0",
  authDomain: "myt6-f8dd9.firebaseapp.com",
  projectId: "myt6-f8dd9",
  storageBucket: "myt6-f8dd9.firebasestorage.app",
  messagingSenderId: "776445823944",
  appId: "1:776445823944:web:e07141414797d129b10efd",
  measurementId: "G-2556WMCJ44"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 