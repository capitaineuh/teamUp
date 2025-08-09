import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher l'affichage automatique de la bannière d'installation
      e.preventDefault();

      // Stocker l'événement pour l'utiliser plus tard
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      // L'app a été installée
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      // Aucune invite d'installation disponible
      return false;
    }

    try {
      // Afficher l'invite d'installation
      await deferredPrompt.prompt();

      // Attendre que l'utilisateur réponde
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        // Installation PWA acceptée
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      } else {
        // Installation PWA refusée
        return false;
      }
    } catch (error) {
      // Erreur lors de l'installation PWA
      return false;
    }
  };

  return {
    isInstallable,
    installPWA,
  };
};
