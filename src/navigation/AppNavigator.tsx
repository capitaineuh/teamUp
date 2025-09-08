import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const AppNavigator = () => {
  return (
    <Routes>
      <Route path='/' element={<HomeScreen />} />
      <Route path='/messages' element={<MessagesScreen />} />
      <Route path='/messages/:chatId' element={<ChatScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default AppNavigator;
