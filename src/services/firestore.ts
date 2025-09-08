import { doc, setDoc, getDoc, DocumentData, collection, getDocs, query, orderBy, startAt, endAt, limit, where } from 'firebase/firestore';

import { db } from '../config/firebase';
import { UserProfile } from '../types/user';

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }

  // Si le profil n'existe pas, on le crée avec des valeurs par défaut
  const defaultProfile: UserProfile = {
    displayName: '',
    email: '',
    sports: [],
  };

  await setDoc(docRef, defaultProfile);
  return defaultProfile;
};

export const updateUserProfile = async (
  userId: string,
  profile: UserProfile
): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  // Convertir le profil en objet compatible avec Firestore
  const profileData: DocumentData = {
    displayName: profile.displayName,
    email: profile.email,
    sports: profile.sports.map(sport => ({
      name: sport.name,
      level: sport.level,
    })),
  };
  await setDoc(docRef, profileData, { merge: true });
};

export interface UserLite {
  id: string;
  displayName: string;
  email?: string;
}

export const searchUsersByDisplayName = async (term: string, max: number = 10): Promise<UserLite[]> => {
  const usersCol = collection(db, 'users');
  const q = query(
    usersCol,
    orderBy('displayName'),
    startAt(term),
    endAt(term + '\\uf8ff'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
    .filter(u => (u.displayName || '').toString().trim().length > 0)
    .map(u => ({ id: u.id, displayName: u.displayName, email: u.email }));
};

export const getUsersLiteByIds = async (ids: string[]): Promise<Record<string, UserLite>> => {
  if (ids.length === 0) return {};
  // Firestore ne permet pas in() sur >10 éléments; on découpe si besoin
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
  const result: Record<string, UserLite> = {};
  for (const c of chunks) {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('__name__', 'in', c));
    const snap = await getDocs(q);
    snap.docs.forEach(d => {
      const data = d.data() as any;
      result[d.id] = { id: d.id, displayName: data.displayName || '', email: data.email };
    });
  }
  return result;
};
