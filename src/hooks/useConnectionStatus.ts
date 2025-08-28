import { useState, useEffect, useCallback } from 'react';

export type ConnectionQuality = 'good' | 'poor' | 'offline';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('good');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Fonction pour tester la connectivité réelle
  const testConnection = useCallback(async () => {
    try {
      // Test avec une requête légère vers un service fiable
      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // Timeout de 5 secondes
      });

      // Si la requête réussit, on est en ligne
      setConnectionQuality('good');
      setIsOnline(true);
      setLastChecked(new Date());
    } catch (error) {
      // Si la requête échoue, on vérifie l'état du navigateur
      if (!navigator.onLine) {
        // Le navigateur indique qu'on est hors ligne
        setConnectionQuality('offline');
        setIsOnline(false);
      } else {
        // Le navigateur dit qu'on est en ligne mais la requête échoue
        // On fait un test supplémentaire pour confirmer
        try {
          // Test rapide avec un timeout plus court
          await fetch('https://httpbin.org/status/200', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            signal: AbortSignal.timeout(2000) // Timeout de 2 secondes
          });
          // Si ce test réussit, c'est juste une connexion lente
          setConnectionQuality('poor');
          setIsOnline(true);
        } catch (secondError) {
          // Si les deux tests échouent, on est probablement hors ligne
          // Même si navigator.onLine dit le contraire
          setConnectionQuality('offline');
          setIsOnline(false);
        }
      }
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    // Test initial de la connectivité
    testConnection();

    const handleOnline = () => {
      // Quand le navigateur dit qu'on est en ligne, on reteste
      setIsOnline(true);
      setConnectionQuality('good');
      // Retester la connectivité après reconnexion
      setTimeout(testConnection, 1000);
    };

    const handleOffline = () => {
      // Quand le navigateur dit qu'on est hors ligne, on confirme
      setIsOnline(false);
      setConnectionQuality('offline');
      setLastChecked(new Date());
    };

    // Événements natifs du navigateur
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test périodique de la connectivité (toutes les 30 secondes)
    const intervalId = setInterval(testConnection, 30000);

    // Test lors du focus de la fenêtre (retour d'onglet)
    const handleFocus = () => {
      testConnection();
    };
    window.addEventListener('focus', handleFocus);

    // Test lors de la reprise de la page (retour de veille)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        testConnection();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [testConnection]);

  // Fonction pour forcer un test de connexion
  const forceCheck = useCallback(() => {
    testConnection();
  }, [testConnection]);

  return {
    isOnline,
    connectionQuality,
    lastChecked,
    forceCheck,
    testConnection
  };
};
