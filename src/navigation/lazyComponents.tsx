import React from 'react';

// Lazy loading des écrans
export const HomeScreen = React.lazy(() => import('../screens/HomeScreen'));
export const ProfileScreen = React.lazy(() => import('../screens/ProfileScreen'));

// Composant de chargement
export const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  }}>
    <div>Chargement...</div>
  </div>
); 