import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { Event } from '../types/event';

export const addEvent = async (event: Omit<Event, 'id'>) => {
  const docRef = await addDoc(collection(db, 'events'), {
    ...event,
    required_participants: event.required_participants,
    participantsList: event.participantsList || [],
    creatorId: event.creatorId,
  });

  return docRef.id;
};

export const getEvents = async (): Promise<Event[]> => {
  const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Event);
};

export const joinEvent = async (eventId: string, userId: string) => {
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, {
    participantsList: arrayUnion(userId),
  });
};

export const leaveEvent = async (eventId: string, userId: string) => {
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, {
    participantsList: arrayRemove(userId),
  });
};

export const deleteEvent = async (eventId: string) => {
  const eventRef = doc(db, 'events', eventId);
  await deleteDoc(eventRef);
};

export const updateEvent = async (eventId: string, data: Partial<Event>) => {
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, data);
};
