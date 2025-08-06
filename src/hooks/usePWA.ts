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
      console.log('PWA installée avec succès');
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
      console.log('Aucune invite d\'installation disponible');
      return false;
    }

    try {
      // Afficher l'invite d'installation
      await deferredPrompt.prompt();

      // Attendre que l'utilisateur réponde
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('Installation PWA acceptée');
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      } else {
        console.log('Installation PWA refusée');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation PWA:', error);
      return false;
    }
  };

  return {
    isInstallable,
    installPWA,
  };
};
