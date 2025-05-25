import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserProfile, updateUserProfile } from '../services/firestore';
import { UserProfile } from '../types/user';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useProfile: user changed', user);
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      console.log('useProfile: no user, setting loading to false');
      setLoading(false);
      return;
    }

    try {
      console.log('useProfile: loading profile for user', user.uid);
      const userProfile = await getUserProfile(user.uid);
      console.log('useProfile: profile loaded', userProfile);
      setProfile(userProfile);
      setError(null);
    } catch (err) {
      console.error('useProfile: error loading profile', err);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfile: UserProfile) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      console.log('useProfile: updating profile', newProfile);
      await updateUserProfile(user.uid, newProfile);
      setProfile(newProfile);
      setError(null);
    } catch (err) {
      console.error('useProfile: error updating profile', err);
      setError('Erreur lors de la mise à jour du profil');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
}; 