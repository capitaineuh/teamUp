import React, { useState, useEffect } from 'react';
import './ConnectionStatus.css';

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  return (
    <div className="connection-status" title={isOnline ? 'Connecté à Internet' : 'Hors ligne'}>
      <div
        className={`status-dot ${isOnline ? 'online' : 'offline'}`}
      />
      <span className="status-text">
        {isOnline ? 'En ligne' : 'Hors ligne'}
      </span>
    </div>
  );
};
