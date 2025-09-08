import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import BottomNavbar from './components/BottomNavbar';
import { ConnectionNotification } from './components/ConnectionNotification';
import { ConnectionStatus } from './components/ConnectionStatus';
import ChatScreen from './screens/ChatScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import HomeScreen from './screens/HomeScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';
import './App.css';

// Importez vos composants ici
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <ConnectionStatus />
      <ConnectionNotification />

      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route
            path='/'
            element={
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.35 }}
                style={{ height: '100%' }}
              >
                <HomeScreen />
              </motion.div>
            }
          />
          <Route
            path='/profile'
            element={
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.35 }}
                style={{ height: '100%' }}
              >
                <ProfileScreen />
              </motion.div>
            }
          />
          <Route
            path='/create-event'
            element={
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.35 }}
                style={{ height: '100%' }}
              >
                <CreateEventScreen />
              </motion.div>
            }
          />
          <Route
            path='/messages'
            element={
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.35 }}
                style={{ height: '100%' }}
              >
                <MessagesScreen />
              </motion.div>
            }
          />
          <Route
            path='/messages/:chatId'
            element={
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.35 }}
                style={{ height: '100%' }}
              >
                <ChatScreen />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <BottomNavbar />
    </div>
  );
}

export default App;
