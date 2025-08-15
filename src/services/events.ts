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
  attempts?: number; // Nombre de tentatives de synchronisation
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
const addOfflineAction = (action: Omit<OfflineEventAction, 'timestamp' | 'attempts'>): void => {
  if (!action.type || (!action.eventId && action.type !== 'create')) {
    return;
  }

  const actions = getOfflineActions();
  const newAction: OfflineEventAction = {
    ...action,
    timestamp: Date.now(),
    attempts: 0,
  };

  actions.push(newAction);
  saveOfflineActions(actions);
};

// Vérifier si on est en ligne
const isOnline = (): boolean => {
  return navigator.onLine;
};

export const addEvent = async (event: Omit<Event, 'id'>) => {
  // Vérifier si on est vraiment offline
  if (!navigator.onLine) {
    addOfflineAction({
      type: 'create',
      eventData: event,
    });
    return Promise.resolve();
  }

  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...event,
      required_participants: event.required_participants,
      participantsList: event.participantsList || [],
      creatorId: event.creatorId,
    });

    // Retourner l'ID du document créé
    return docRef.id;
        } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('unavailable') || errorMessage.includes('network') || !navigator.onLine) {
        addOfflineAction({
          type: 'create',
          eventData: event,
        });
      }
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
    // En cas d'échec, stocker en offline
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
    // En cas d'échec, stocker en offline
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

  // NETTOYAGE AUTOMATIQUE : Supprimer les actions corrompues ou trop anciennes
  const validActions = actions.filter(action => {
    if (!action.type || (!action.eventId && action.type !== 'create')) {
      return false;
    }

    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    if (action.timestamp < oneDayAgo) {
      return false;
    }

    return true;
  });

  if (validActions.length !== actions.length) {
    saveOfflineActions(validActions);
  }

  const successfulActions: string[] = [];
  const MAX_ATTEMPTS = 2; // Réduire à 2 tentatives maximum

      for (const action of validActions) {
    // Vérifier le nombre de tentatives
    if (action.attempts && action.attempts >= MAX_ATTEMPTS) {
      continue;
    }

    try {
      switch (action.type) {
        case 'join':
          if (action.eventId && action.userId) {
            // Appel direct à Firebase sans passer par la logique offline
            const eventRef = doc(db, 'events', action.eventId);
            await updateDoc(eventRef, {
              participantsList: arrayUnion(action.userId),
            });
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'leave':
          if (action.eventId && action.userId) {
            // Appel direct à Firebase sans passer par la logique offline
            const eventRef = doc(db, 'events', action.eventId);
            await updateDoc(eventRef, {
              participantsList: arrayRemove(action.userId),
            });
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'create':
          if (action.eventData) {
            // Appel direct à Firebase sans passer par la logique offline
            await addDoc(collection(db, 'events'), {
              ...action.eventData,
              required_participants: action.eventData.required_participants,
              participantsList: action.eventData.participantsList || [],
              creatorId: action.eventData.creatorId,
            });
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'delete':
          if (action.eventId) {
            // Appel direct à Firebase sans passer par la logique offline
            const eventRef = doc(db, 'events', action.eventId);
            await deleteDoc(eventRef);
            successfulActions.push(action.timestamp.toString());
          }
          break;

        case 'update':
          if (action.eventId && action.eventData) {
            // Appel direct à Firebase sans passer par la logique offline
            const eventRef = doc(db, 'events', action.eventId);
            await updateDoc(eventRef, action.eventData);
            successfulActions.push(action.timestamp.toString());
          }
          break;
      }
                } catch (error) {
          action.attempts = (action.attempts || 0) + 1;
        }
  }

  // Supprimer seulement les actions synchronisées avec succès
  const remainingActions = actions.filter(action =>
    !successfulActions.includes(action.timestamp.toString())
  );

  saveOfflineActions(remainingActions);
};

// Fonction pour récupérer les actions offline en attente
export const getPendingOfflineActions = (): OfflineEventAction[] => {
  return getOfflineActions();
};

// Fonction pour nettoyer les actions en échec (pour le débogage)
export const clearFailedOfflineActions = (): void => {
  const actions = getOfflineActions();
  const validActions = actions.filter(action =>
    !action.attempts || action.attempts < 2
  );
  saveOfflineActions(validActions);
};

// Fonction pour nettoyer les actions anciennes (plus de 1 heure)
export const clearOldOfflineActions = (): void => {
  const actions = getOfflineActions();
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const recentActions = actions.filter(action =>
    action.timestamp > oneHourAgo
  );
  saveOfflineActions(recentActions);
};

// Fonction pour réinitialiser le cache offline (pour le débogage)
export const resetOfflineActions = (): void => {
  saveOfflineActions([]);
};
