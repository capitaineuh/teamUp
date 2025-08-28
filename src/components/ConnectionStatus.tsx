import React from 'react';

import { useConnectionStatus } from '../hooks/useConnectionStatus';
import './ConnectionStatus.css';

export const ConnectionStatus: React.FC = () => {
  const { connectionQuality } = useConnectionStatus();

  // Fonction pour obtenir le texte de statut
  const getStatusText = () => {
    switch (connectionQuality) {
      case 'good':
        return 'En ligne';
      case 'poor':
        return 'Connexion lente';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'En ligne';
    }
  };

  // Fonction pour obtenir le titre de l'infobulle
  const getStatusTitle = () => {
    switch (connectionQuality) {
      case 'good':
        return 'Connecté à Internet - Connexion stable';
      case 'poor':
        return 'Connecté à Internet - Connexion lente ou instable';
      case 'offline':
        return 'Hors ligne - Aucune connexion Internet';
      default:
        return 'Connecté à Internet';
    }
  };

  return (
    <div
      className={`connection-status ${connectionQuality}`}
      title={getStatusTitle()}
    >
      <div
        className={`status-dot ${connectionQuality}`}
      />
      <span className="status-text">
        {getStatusText()}
      </span>
    </div>
  );
};
