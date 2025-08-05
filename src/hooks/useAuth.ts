import { signInWithPopup, signOut, User } from 'firebase/auth';
import { useState, useEffect } from 'react';

import { auth, googleProvider } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useAuth] Initialisation du listener onAuthStateChanged');
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("[useAuth] Changement d'état de l'utilisateur :", user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('[useAuth] Nettoyage du listener onAuthStateChanged');
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log('[useAuth] Début de la connexion Google...');
    try {
      setError(null);
      // Affiche la config utilisée (sans les secrets)
      console.log(
        '[useAuth] authDomain utilisé :',
        auth.config?.authDomain || auth.tenantId
      );
      console.log('[useAuth] Provider utilisé :', googleProvider);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('[useAuth] Connexion Google réussie :', result);
      setUser(result.user);
    } catch (err: any) {
      console.error('[useAuth] Erreur lors de la connexion Google :', err);
      if (err.code) console.error('[useAuth] Code erreur Firebase :', err.code);
      if (err.message)
        console.error('[useAuth] Message erreur Firebase :', err.message);
      if (err.email)
        console.error("[useAuth] Email lié à l'erreur :", err.email);
      if (err.credential)
        console.error("[useAuth] Credential lié à l'erreur :", err.credential);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const logout = async () => {
    console.log('[useAuth] Début du logout...');
    try {
      setError(null);
      await signOut(auth);
      console.log('[useAuth] Déconnexion réussie');
      setUser(null);
    } catch (err: any) {
      console.error('[useAuth] Erreur lors du logout :', err);
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
