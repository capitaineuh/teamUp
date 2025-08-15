import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import Map from '../components/Map';
import PreferencesModal from '../components/PreferencesModal';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';
import { useAuth } from '../hooks/useAuth';
import { getEvents, joinEvent, leaveEvent } from '../services/events';
import './HomeScreen.css';

const HomeScreen = () => {
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isPreferencesModalVisible, setIsPreferencesModalVisible] = useState(false);
  const { user, loading, error, signInWithGoogle, logout } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);


  const handleAuth = async () => {
    if (user) {
      await logout();
    } else {
      await signInWithGoogle();
      setIsAuthModalVisible(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (e) {
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);





  const handleJoin = async (eventId: string) => {
    if (!user) return;
    setJoiningId(eventId);

    try {
      await joinEvent(eventId, user.uid);
      await fetchEvents();
    } catch (error) {
      // Erreur lors de l'inscription
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeave = async (eventId: string) => {
    if (!user) return;
    setLeavingId(eventId);

    try {
      await leaveEvent(eventId, user.uid);
      await fetchEvents();
    } catch (error) {
      // Erreur lors de la désinscription
    } finally {
      setLeavingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className='screen'
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={containerVariants}
    >
      <motion.header
        className='header'
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className='header-content'>
          <motion.h1
            className='header-title'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Prochains Événements
          </motion.h1>
          <motion.button
            className='filter-button'
            onClick={() => setIsPreferencesModalVisible(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.button>
        </div>

        <div className='search-section'>
          <div className='search-bar'>
            <svg className='search-icon' width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher des événements"
              className='search-input'
            />
          </div>

          <div className='filter-buttons'>
            <button className='filter-btn active'>Tous</button>
            <button className='filter-btn'>Distance</button>
            <button className='filter-btn'>Date</button>
          </div>
        </div>
      </motion.header>

      <main className='content'>


        <section className='map-section'>
          <motion.h2 className='section-title' variants={itemVariants}>
            Carte des événements
          </motion.h2>
          <motion.div
            className='map-container'
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Map apiKey={GOOGLE_MAPS_API_KEY} />
          </motion.div>
        </section>

        <section className='events-section'>
          <h2 className='events-title'>Liste des événements</h2>
          {loadingEvents ? (
            <div className='loading'>Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className='no-events'>Aucun événement pour le moment.</div>
          ) : (
            <div className='events-list'>
              {events.map(event => {
                const nbInscrits = Array.isArray(event.participantsList)
                  ? event.participantsList.length
                  : 0;
                const dejaInscrit =
                  user &&
                  Array.isArray(event.participantsList) &&
                  event.participantsList.includes(user.uid);
                return (
                  <div className='event-card' key={event.id}>
                    <h3 className='event-title'>{event.titre}</h3>
                    <div className='event-meta'>
                      <span>
                        <b>Sport :</b> {event.sport}
                      </span>
                      {' | '}
                      <span>
                        <b>Niveau :</b> {event.niveau}
                      </span>
                      {' | '}
                      <span>
                        <b>Participants :</b> {`${nbInscrits} / ${event.required_participants}`}
                      </span>
                    </div>
                    <div className='event-meta'>
                      <span>
                        <b>Lieu :</b> {event.lieu}
                      </span>
                    </div>
                    <p className='event-description'>{event.description}</p>
                    <div className='event-actions'>
                      {user && (
                        <>
                          {dejaInscrit ? (
                            <button
                              className='event-action-btn leave-btn'
                              onClick={() => handleLeave(event.id)}
                              disabled={leavingId === event.id}
                            >
                              {leavingId === event.id
                                ? 'Désinscription...'
                                : 'Se désinscrire'}
                            </button>
                          ) : (
                            <button
                              className='event-action-btn join-btn'
                              onClick={() => handleJoin(event.id)}
                              disabled={
                                joiningId === event.id ||
                                nbInscrits >= event.required_participants
                              }
                            >
                              {joiningId === event.id
                                ? 'Inscription...'
                                : nbInscrits >= event.required_participants
                                  ? 'Complet'
                                  : "S'inscrire"}
                            </button>
                          )}


                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {isAuthModalVisible && (
          <motion.div
            className='modal-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='modal-content'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <h2 className='modal-title'>Connexion / Inscription</h2>
              {error && (
                <motion.p
                  className='error-text'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
              <motion.button
                className='modal-button'
                onClick={handleAuth}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <div className='loading-spinner' />
                ) : (
                  'Continuer avec Google'
                )}
              </motion.button>
              <motion.button
                className='modal-button modal-button-secondary'
                onClick={() => setIsAuthModalVisible(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Fermer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PreferencesModal
        isOpen={isPreferencesModalVisible}
        onClose={() => setIsPreferencesModalVisible(false)}
      />
    </motion.div>
  );
};

export default HomeScreen;
