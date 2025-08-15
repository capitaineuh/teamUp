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

        // VÉRIFICATION SIMPLE : Nettoyage automatique si trop d'actions
    const totalActions = pendingActions.length + eventActions.length;
    if (totalActions > 100) {
      // Désactiver temporairement l'auto-sync
      setIsAutoSyncEnabled(false);

      // Vider les actions en attente
      setPendingActions([]);

      // Nettoyer le localStorage
      try {
        localStorage.removeItem('teamup-offline-actions');
      } catch (error) {
        // Ignorer les erreurs de nettoyage
      }

      // Réactiver après 30 secondes
      setTimeout(() => {
        setIsAutoSyncEnabled(true);
      }, 30000);
    }
  }, [isAutoSyncEnabled, isSyncing, pendingActions.length]);

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

    // CRÉER UN INTERVALLE PLUS FRÉQUENT pour le nettoyage automatique
    const cleanupInterval = setInterval(() => {
      // VÉRIFICATION FORCÉE du nettoyage, même si auto-sync est désactivé
      const totalActions = pendingActions.length + getEventOfflineActions().length;

      if (totalActions > 100) {
        // Désactiver temporairement l'auto-sync
        setIsAutoSyncEnabled(false);

        // Vider les actions en attente
        setPendingActions([]);

        // Nettoyer le localStorage
        try {
          localStorage.removeItem('teamup-offline-actions');
        } catch (error) {
          // Ignorer les erreurs de nettoyage
        }

        // Réactiver après 30 secondes
        setTimeout(() => {
          setIsAutoSyncEnabled(true);
        }, 30000);
      }
    }, 10000); // Vérification toutes les 10 secondes

    if (isAutoSyncEnabled) {
      const syncInterval = setInterval(() => {
        updatePendingActionsCount();
      }, 30000);

      return () => {
        clearInterval(cleanupInterval);
        clearInterval(syncInterval);
      };
    }

    return () => clearInterval(cleanupInterval);
  }, [isOnline, updatePendingActionsCount, isAutoSyncEnabled, pendingActions.length]);

          const getOfflineStatus = () => {
    const eventActions = getEventOfflineActions();
    const totalPendingActions = pendingActions.length + eventActions.length;

    // NETTOYAGE D'URGENCE si trop d'actions (même en pause)
    if (totalPendingActions > 100) {
      // Déclencher le nettoyage immédiatement
      setTimeout(() => {
        setIsAutoSyncEnabled(false);
        setPendingActions([]);
        try {
          localStorage.removeItem('teamup-offline-actions');
        } catch (error) {
          // Ignorer les erreurs
        }
        setTimeout(() => setIsAutoSyncEnabled(true), 30000);
      }, 100);

      return {
        status: 'warning',
        message: `🚨 URGENCE: ${totalPendingActions} actions - Nettoyage en cours...`,
        color: '#FF0000'
      };
    }

    if (!isAutoSyncEnabled) {
      return {
        status: 'syncing',
        message: `Synchronisation en pause - ${totalPendingActions} action(s) en attente`,
        color: '#F4D06F'
      };
    }

    // AVERTISSEMENT si trop d'actions (risque de bombardement de la base)
    if (totalPendingActions > 50) {
      return {
        status: 'warning',
        message: `⚠️ Beaucoup d'actions en attente (${totalPendingActions}) - Nettoyage automatique en cours...`,
        color: '#FF6B6B'
      };
    }

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



  // Fonction de nettoyage manuel pour la production
  const forceCleanup = useCallback(() => {
    setIsAutoSyncEnabled(false);
    setPendingActions([]);
    try {
      localStorage.removeItem('teamup-offline-actions');
    } catch (error) {
      // Ignorer les erreurs
    }
    setTimeout(() => setIsAutoSyncEnabled(true), 30000);
  }, []);

  return {
    isOnline,
    pendingActions: [...pendingActions, ...getEventOfflineActions()],
    isSyncing,
    addOfflineAction,
    syncPendingActions,
    getOfflineStatus,
    updatePendingActionsCount,
    forceCleanup, // Exposer la fonction de nettoyage forcé
  };
};
