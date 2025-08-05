import { useState, useEffect, useCallback } from 'react';

import { getUserProfile, updateUserProfile } from '../services/firestore';
import { UserProfile } from '../types/user';

import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [user, loadProfile]);

  const updateProfile = async (newProfile: UserProfile) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      await updateUserProfile(user.uid, newProfile);
      setProfile(newProfile);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};
