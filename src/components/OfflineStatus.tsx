import React from 'react';

import { useOfflineSync } from '../hooks/useOfflineSync';

import './OfflineStatus.css';

const OfflineStatus: React.FC = () => {
  const { getOfflineStatus, pendingActions } = useOfflineSync();
  const status = getOfflineStatus();

  if (status.status === 'online' && pendingActions.length === 0) {
    return null;
  }

  return (
    <div
      className="offline-status"
      style={{ backgroundColor: status.color }}
    >
      <div className="offline-status-content">
        <span className="offline-status-icon">
          {status.status === 'offline' && '📡'}
          {status.status === 'syncing' && '🔄'}
          {status.status === 'online' && '✅'}
        </span>
        <span className="offline-status-message">
          {status.message}
        </span>
        {pendingActions.length > 0 && (
          <span className="offline-status-count">
            ({pendingActions.length})
          </span>
        )}

        {/* Indicateur de test temporaire */}
        {process.env.NODE_ENV === 'development' && (
          <span className="offline-status-debug" style={{ fontSize: '10px', opacity: 0.7 }}>
            🧪 Mode dev - Testez le mode offline en désactivant votre connexion
          </span>
        )}
      </div>
    </div>
  );
};

export default OfflineStatus;
