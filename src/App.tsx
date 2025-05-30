import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import './App.css';

// Importez vos composants ici
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
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
          path="/profile"
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
          path="/create-event"
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
      </Routes>
    </AnimatePresence>
  );
}

export default App; 