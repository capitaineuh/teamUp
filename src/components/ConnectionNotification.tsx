import React, { useEffect, useState } from 'react';

import { useConnectionStatus } from '../hooks/useConnectionStatus';
import './ConnectionNotification.css';

export const ConnectionNotification: React.FC = () => {
  const { connectionQuality } = useConnectionStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [previousQuality, setPreviousQuality] = useState(connectionQuality);

  useEffect(() => {
    // Afficher la notification seulement si la qualité change
    if (previousQuality !== connectionQuality) {
      setShowNotification(true);
      setPreviousQuality(connectionQuality);

      // Masquer la notification après 5 secondes
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [connectionQuality, previousQuality]);

  if (!showNotification) return null;

  const getNotificationContent = () => {
    switch (connectionQuality) {
      case 'good':
        return {
          message: 'Connexion Internet rétablie',
          icon: '✅',
          className: 'success'
        };
      case 'poor':
        return {
          message: 'Connexion Internet instable',
          icon: '⚠️',
          className: 'warning'
        };
      case 'offline':
        return {
          message: 'Connexion Internet perdue',
          icon: '❌',
          className: 'error'
        };
      default:
        return {
          message: 'État de la connexion changé',
          icon: 'ℹ️',
          className: 'info'
        };
    }
  };

  const { message, icon, className } = getNotificationContent();

  return (
    <div className={`connection-notification ${className}`}>
      <span className="notification-icon">{icon}</span>
      <span className="notification-message">{message}</span>
      <button
        className="notification-close"
        onClick={() => setShowNotification(false)}
      >
        ×
      </button>
    </div>
  );
};
