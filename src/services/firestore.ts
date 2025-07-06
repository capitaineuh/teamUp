import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/user';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    
    // Si le profil n'existe pas, on le crée avec des valeurs par défaut
    const defaultProfile: UserProfile = {
      displayName: '',
      email: '',
      sports: []
    };
    
    await setDoc(docRef, defaultProfile);
    return defaultProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);
    // Convertir le profil en objet compatible avec Firestore
    const profileData: DocumentData = {
      displayName: profile.displayName,
      email: profile.email,
      sports: profile.sports.map(sport => ({
        name: sport.name,
        level: sport.level
      }))
    };
    await setDoc(docRef, profileData, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 