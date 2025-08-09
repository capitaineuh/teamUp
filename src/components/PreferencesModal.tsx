import React, { useState } from 'react';

import { usePWA } from '../hooks/usePWA';

import './PreferencesModal.css';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const [locationPermission, setLocationPermission] = useState<string>('prompt');
  const [cookieConsent, setCookieConsent] = useState<boolean>(false);
  const { isInstallable, installPWA } = usePWA();

  // Vérifier le statut de la géolocalisation
  React.useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
      });
    }
  }, []);

    const requestLocationPermission = async () => {
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(() => resolve(), reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      setLocationPermission('granted');
      // Position obtenue
    } catch (error) {
      setLocationPermission('denied');
      // Erreur de géolocalisation
    }
  };

  const handleCookieConsent = () => {
    setCookieConsent(true);
    localStorage.setItem('cookieConsent', 'true');
  };

  const downloadPWA = async () => {
    if (isInstallable) {
      const success = await installPWA();
      if (success) {
        // PWA installée avec succès
      }
    } else {
      // Fallback : ouvrir dans un nouvel onglet
      window.open(window.location.href, '_blank');
    }
  };

  const getLocationStatusText = () => {
    switch (locationPermission) {
      case 'granted':
        return 'Autorisée';
      case 'denied':
        return 'Refusée';
      default:
        return 'Non définie';
    }
  };

  const getLocationStatusColor = () => {
    switch (locationPermission) {
      case 'granted':
        return '#28a745';
      case 'denied':
        return '#dc3545';
      default:
        return '#ffc107';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="preferences-overlay" onClick={onClose}>
      <div className="preferences-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preferences-header">
          <h2>Préférences</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="preferences-content">
          {/* Section Géolocalisation */}
          <div className="preference-section">
            <h3>Géolocalisation</h3>
            <div className="preference-item">
              <div className="preference-info">
                <span>Statut actuel :</span>
                <span
                  className="status-indicator"
                  style={{ color: getLocationStatusColor() }}
                >
                  {getLocationStatusText()}
                </span>
              </div>
              <button
                className="preference-button"
                onClick={requestLocationPermission}
                disabled={locationPermission === 'granted'}
              >
                {locationPermission === 'granted' ? 'Autorisée' : 'Demander l&apos;accès'}
              </button>
            </div>
          </div>

          {/* Section Cookies */}
          <div className="preference-section">
            <h3>Cookies</h3>
            <div className="preference-item">
              <div className="preference-info">
                <span>Consentement :</span>
                <span className="status-indicator">
                  {cookieConsent ? 'Accepté' : 'Non défini'}
                </span>
              </div>
              <button
                className="preference-button"
                onClick={handleCookieConsent}
                disabled={cookieConsent}
              >
                {cookieConsent ? 'Accepté' : 'Accepter les cookies'}
              </button>
            </div>
          </div>

          {/* Section PWA */}
          <div className="preference-section">
            <h3>Application</h3>
                          <div className="preference-item">
                <div className="preference-info">
                  <span>Télécharger l&apos;app :</span>
                  <span className="status-indicator">
                    {isInstallable ? 'Disponible' : 'Non disponible'}
                  </span>
                </div>
                <button
                  className="preference-button primary"
                  onClick={downloadPWA}
                  disabled={!isInstallable}
                >
                  {isInstallable ? 'Installer l\'app' : 'Non disponible'}
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
