import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const AppNavigator = () => {
  return (
    <Routes>
      <Route path='/' element={<HomeScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default AppNavigator;
