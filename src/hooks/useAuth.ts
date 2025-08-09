import { signInWithPopup, signOut, User } from 'firebase/auth';
import { useState, useEffect } from 'react';

import { auth, googleProvider } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // useAuth: Initialisation du listener onAuthStateChanged
    const unsubscribe = auth.onAuthStateChanged(user => {
      // useAuth: Changement d'état de l'utilisateur
      setUser(user);
      setLoading(false);
    });

    return () => {
      // useAuth: Nettoyage du listener onAuthStateChanged
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    // useAuth: Début de la connexion Google
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      // useAuth: Connexion Google réussie
      setUser(result.user);
    } catch (err: any) {
      // useAuth: Erreur lors de la connexion Google
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const logout = async () => {
    // useAuth: Début du logout
    try {
      setError(null);
      await signOut(auth);
      // useAuth: Déconnexion réussie
      setUser(null);
    } catch (err: any) {
      // useAuth: Erreur lors du logout
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    logout,
  };
};
