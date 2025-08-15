import React from 'react';

import { useOfflineSync } from '../hooks/useOfflineSync';

import './OfflineStatus.css';

const OfflineStatus: React.FC = () => {
  const { getOfflineStatus, pendingActions, forceCleanup } = useOfflineSync();
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
          {status.status === 'warning' && '⚠️'}
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

        {/* Bouton de nettoyage d'urgence si trop d'actions */}
        {pendingActions.length > 100 && (
          <button
            onClick={forceCleanup}
            className="emergency-cleanup-btn"
            title="Nettoyer d'urgence le cache offline"
          >
            🧹 NETTOYER
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineStatus;
