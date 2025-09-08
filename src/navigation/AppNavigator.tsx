import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';

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
