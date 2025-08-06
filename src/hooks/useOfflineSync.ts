import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    }
  }, [isOnline, pendingActions]);

  const syncPendingActions = async () => {
    setIsSyncing(true);

    try {
      // Envoyer un message au service worker pour synchroniser
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_OFFLINE_ACTIONS'
        });
      }

      // Attendre un peu pour laisser le service worker traiter
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vider les actions en attente
      setPendingActions([]);
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setPendingActions(prev => [...prev, newAction]);
  };

  const getOfflineStatus = () => {
    if (!isOnline) {
      return {
        status: 'offline',
        message: 'Mode hors ligne - Les actions seront synchronisées quand vous serez reconnecté',
        color: '#FFA347'
      };
    }

    if (pendingActions.length > 0) {
      return {
        status: 'syncing',
        message: `Synchronisation de ${pendingActions.length} action(s) en cours...`,
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
    pendingActions,
    isSyncing,
    addOfflineAction,
    syncPendingActions,
    getOfflineStatus,
  };
};
