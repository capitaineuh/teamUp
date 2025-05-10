import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

const db = getFirestore(app);

export type UserProfile = {
  displayName: string;
  sports: {
    name: string;
    level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  }[];
};

export const updateUserProfile = async (userId: string, profile: UserProfile) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, profile, { merge: true });
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
}; 