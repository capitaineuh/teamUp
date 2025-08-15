import { useState, useEffect, useCallback } from 'react';

import { getPendingOfflineActions, syncOfflineActions } from '../services/events';

interface OfflineAction {
  id: string;
  url: string;
  method: string;
  body: string;
  timestamp: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fonction pour récupérer les actions offline des événements
  const getEventOfflineActions = () => {
    try {
      return getPendingOfflineActions();
    } catch {
      return [];
    }
  };

  // Mettre à jour le nombre d'actions en attente
  const updatePendingActionsCount = useCallback(() => {
    const eventActions = getEventOfflineActions();
    setPendingActions(prev => {
      // Combiner les actions existantes avec les actions d'événements
      const allActions = [...prev];
      eventActions.forEach(action => {
        allActions.push({
          id: `event-${action.timestamp}`,
          url: `/api/events/${action.type}`,
          method: 'POST',
          body: JSON.stringify(action),
          timestamp: action.timestamp,
        });
      });
      return allActions;
    });
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingActions = useCallback(async () => {
    setIsSyncing(true);

    try {
      // Synchroniser d'abord les actions d'événements
      await syncOfflineActions();

      // Envoyer un message au service worker pour synchroniser les autres actions
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_OFFLINE_ACTIONS'
        });
      }

      // Attendre un peu pour laisser le service worker traiter
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour le compteur d'actions
      updatePendingActionsCount();
    } catch (error) {
      // Erreur lors de la synchronisation
    } finally {
      setIsSyncing(false);
    }
  }, [updatePendingActionsCount]);

  const addOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setPendingActions(prev => [...prev, newAction]);
  };

  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    }
  }, [isOnline, pendingActions, syncPendingActions]);

  // Mettre à jour le compteur d'actions quand la connectivité change
  useEffect(() => {
    updatePendingActionsCount();

    // Mettre à jour toutes les 5 secondes pour rester synchronisé
    const interval = setInterval(updatePendingActionsCount, 5000);

    return () => clearInterval(interval);
  }, [isOnline, updatePendingActionsCount]);

  const getOfflineStatus = () => {
    const eventActions = getEventOfflineActions();
    const totalPendingActions = pendingActions.length + eventActions.length;

    if (!isOnline) {
      return {
        status: 'offline',
        message: `Mode hors ligne - ${totalPendingActions} action(s) en attente de synchronisation`,
        color: '#FFA347'
      };
    }

    if (totalPendingActions > 0) {
      return {
        status: 'syncing',
        message: `Synchronisation de ${totalPendingActions} action(s) en cours...`,
        color: '#F4D06F'
      };
    }

    return {
      status: 'online',
      message: 'Connecté',
      color: '#9DD9D2'
    };
  };

  return {
    isOnline,
    pendingActions: [...pendingActions, ...getEventOfflineActions()],
    isSyncing,
    addOfflineAction,
    syncPendingActions,
    getOfflineStatus,
    updatePendingActionsCount,
  };
};
