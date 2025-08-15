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

// Interface pour les actions offline
interface OfflineEventAction {
  type: 'join' | 'leave' | 'create' | 'delete' | 'update';
  eventId?: string;
  userId?: string;
  eventData?: any;
  timestamp: number;
}

// Stockage local des actions offline
const OFFLINE_ACTIONS_KEY = 'teamup-offline-actions';

// Récupérer les actions offline stockées
const getOfflineActions = (): OfflineEventAction[] => {
  try {
    const stored = localStorage.getItem(OFFLINE_ACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Sauvegarder les actions offline
const saveOfflineActions = (actions: OfflineEventAction[]): void => {
  try {
    localStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(actions));
  } catch (error) {
    // Erreur lors de la sauvegarde des actions offline
  }
};

// Ajouter une action offline
const addOfflineAction = (action: Omit<OfflineEventAction, 'timestamp'>): void => {
  const actions = getOfflineActions();
  const newAction: OfflineEventAction = {
    ...action,
    timestamp: Date.now(),
  };
  actions.push(newAction);
  saveOfflineActions(actions);
};

// Vérifier si on est en ligne
const isOnline = (): boolean => {
  return navigator.onLine;
};

export const addEvent = async (event: Omit<Event, 'id'>) => {
  if (!isOnline()) {
    // Stocker l'action offline
    addOfflineAction({
      type: 'create',
      eventData: event,
    });

    // Retourner une promesse résolue pour simuler le succès
    return Promise.resolve();
  }

  try {
    await addDoc(collection(db, 'events'), {
      ...event,
      required_participants: event.required_participants,
      participantsList: event.participantsList || [],
      creatorId: event.creatorId,
    });
  } catch (error) {
    // En cas d'échec, stocker aussi en offline
    addOfflineAction({
      type: 'create',
      eventData: event,
    });
    throw error;
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Event);
  } catch (error) {
    // En cas d'échec, essayer de récupérer depuis le cache local
    return [];
  }
};

export const joinEvent = async (eventId: string, userId: string) => {
  if (!isOnline()) {
    // Stocker l'action offline
    addOfflineAction({
      type: 'join',
      eventId,
      userId,
    });

    // Retourner une promesse résolue pour simuler le succès
    return Promise.resolve();
  }

  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      participantsList: arrayUnion(userId),
    });
  } catch (error) {
    // En cas d'échec, stocker aussi en offline
    addOfflineAction({
      type: 'join',
      eventId,
      userId,
    });
    throw error;
  }
};

export const leaveEvent = async (eventId: string, userId: string) => {
  if (!isOnline()) {
    // Stocker l'action offline
    addOfflineAction({
      type: 'leave',
      eventId,
      userId,
    });

    // Retourner une promesse résolue pour simuler le succès
    return Promise.resolve();
  }

  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      participantsList: arrayRemove(userId),
    });
  } catch (error) {
    // En cas d'échec, stocker aussi en offline
    addOfflineAction({
      type: 'leave',
      eventId,
      userId,
    });
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  if (!isOnline()) {
    // Stocker l'action offline
    addOfflineAction({
      type: 'delete',
      eventId,
    });

    // Retourner une promesse résolue pour simuler le succès
    return Promise.resolve();
  }

  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    // En cas d'échec, stocker aussi en offline
    addOfflineAction({
      type: 'delete',
      eventId,
    });
    throw error;
  }
};

export const updateEvent = async (eventId: string, data: Partial<Event>) => {
  if (!isOnline()) {
    // Stocker l'action offline
    addOfflineAction({
      type: 'update',
      eventId,
      eventData: data,
    });

    // Retourner une promesse résolue pour simuler le succès
    return Promise.resolve();
  }

  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, data);
  } catch (error) {
    // En cas d'échec, stocker aussi en offline
    addOfflineAction({
      type: 'update',
      eventId,
      eventData: data,
    });
    throw error;
  }
};

// Fonction pour synchroniser les actions offline
export const syncOfflineActions = async (): Promise<void> => {
  const actions = getOfflineActions();

  if (actions.length === 0) return;

  const successfulActions: string[] = [];

  for (const action of actions) {
    try {
      switch (action.type) {
        case 'join':
          if (action.eventId && action.userId) {
            await joinEvent(action.eventId, action.userId);
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'leave':
          if (action.eventId && action.userId) {
            await leaveEvent(action.eventId, action.userId);
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'create':
          if (action.eventData) {
            await addEvent(action.eventData);
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'delete':
          if (action.eventId) {
            await deleteEvent(action.eventId);
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'update':
          if (action.eventId && action.eventData) {
            await updateEvent(action.eventId, action.eventData);
            successfulActions.push(action.timestamp.toString());
          }
          break;
      }
    } catch (error) {
      // Erreur lors de la synchronisation de l'action
    }
  }

  // Supprimer les actions synchronisées avec succès
  if (successfulActions.length > 0) {
    const remainingActions = actions.filter(action =>
      !successfulActions.includes(action.timestamp.toString())
    );
    saveOfflineActions(remainingActions);
  }
};

// Fonction pour récupérer les actions offline en attente
export const getPendingOfflineActions = (): OfflineEventAction[] => {
  return getOfflineActions();
};
