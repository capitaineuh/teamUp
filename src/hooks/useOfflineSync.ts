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
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);

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
    if (!isAutoSyncEnabled || isSyncing) {
      return;
    }

    const eventActions = getEventOfflineActions();

    setPendingActions(prev => {
      const existingEventActionIds = new Set(
        prev
          .filter(action => action.id?.startsWith('event-'))
          .map(action => action.id)
      );

      const newEventActions = eventActions.filter(action => {
        const actionId = `event-${action.timestamp}`;
        return !existingEventActionIds.has(actionId);
      });

      const allActions = [...prev, ...newEventActions.map(action => ({
        id: `event-${action.timestamp}`,
        url: `/api/events/${action.type}`,
        method: 'POST',
        body: JSON.stringify(action),
        timestamp: action.timestamp,
      }))];

      return allActions;
    });
  }, [isAutoSyncEnabled, isSyncing]);

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
    setIsAutoSyncEnabled(false);

    try {
      await syncOfflineActions();

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_OFFLINE_ACTIONS'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      updatePendingActionsCount();

      setTimeout(() => {
        setIsAutoSyncEnabled(true);
      }, 5000);

    } catch (error) {
      setTimeout(() => {
        setIsAutoSyncEnabled(true);
      }, 5000);
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
    if (isOnline && pendingActions.length > 0 && isAutoSyncEnabled && !isSyncing) {
      syncPendingActions();
    }
  }, [isOnline, pendingActions, syncPendingActions, isAutoSyncEnabled, isSyncing]);

    // Mettre à jour le compteur d'actions quand la connectivité change
  useEffect(() => {
    updatePendingActionsCount();

    if (isAutoSyncEnabled) {
      const interval = setInterval(() => {
        updatePendingActionsCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isOnline, updatePendingActionsCount, isAutoSyncEnabled]);

      const getOfflineStatus = () => {
    if (!isAutoSyncEnabled) {
      const eventActions = getEventOfflineActions();
      const totalPendingActions = pendingActions.length + eventActions.length;

      return {
        status: 'syncing',
        message: `Synchronisation en pause - ${totalPendingActions} action(s) en attente`,
        color: '#F4D06F'
      };
    }

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
