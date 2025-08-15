import React, { useEffect, useState } from 'react';
import { getPendingOfflineActions, resetOfflineActions, clearFailedOfflineActions, clearOldOfflineActions } from '../services/events';

const EmergencyCleanup: React.FC = () => {
  const [actionCount, setActionCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkActions = () => {
      try {
        const actions = getPendingOfflineActions();
        setActionCount(actions.length);
        setIsVisible(actions.length > 100); // Afficher seulement si plus de 100 actions
      } catch (error) {
        console.error('Erreur lors de la vérification des actions:', error);
      }
    };

    checkActions();
    const interval = setInterval(checkActions, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSmartCleanup = () => {
    try {
      // Nettoyage intelligent : d'abord les échecs, puis les anciennes actions
      clearFailedOfflineActions();
      clearOldOfflineActions();

      const actions = getPendingOfflineActions();
      setActionCount(actions.length);

      // Si il reste encore trop d'actions, afficher le bouton de reset complet
      if (actions.length > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage intelligent:', error);
    }
  };

  const handleEmergencyReset = () => {
    try {
      resetOfflineActions();
      setActionCount(0);
      setIsVisible(false);

      // Vider aussi le localStorage manuellement
      localStorage.removeItem('teamup-offline-actions');

      // Recharger la page pour s'assurer que tout est propre
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors du nettoyage d\'urgence:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#ff0000',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontSize: '16px',
      zIndex: 10000,
      textAlign: 'center',
      border: '3px solid #cc0000',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)'
    }}>
      <h2>🚨 URGENCE - CACHE CORROMPU</h2>
      <p><strong>{actionCount} actions</strong> en attente de synchronisation</p>
      <p style={{ fontSize: '14px', marginTop: '10px' }}>
        Le système de cache offline est corrompu et crée une boucle infinie.
      </p>

      <button
        onClick={handleSmartCleanup}
        style={{
          background: '#ffaa00',
          color: '#ffffff',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px',
          marginRight: '10px'
        }}
      >
        🧹 NETTOYAGE INTELLIGENT
      </button>

      <button
        onClick={handleEmergencyReset}
        style={{
          background: '#ffffff',
          color: '#ff0000',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        💥 NETTOYAGE D'URGENCE
      </button>

      <p style={{ fontSize: '12px', marginTop: '15px', opacity: 0.8 }}>
        ⚠️ Cette action va vider complètement le cache et recharger la page
      </p>
    </div>
  );
};

export default EmergencyCleanup;
