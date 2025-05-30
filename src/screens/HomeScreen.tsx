import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getEvents, joinEvent, leaveEvent, deleteEvent, updateEvent } from '../services/events';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const { user, loading, error, signInWithGoogle, logout } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const editRefs = useRef<{ [key: string]: any }>({});

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
    await joinEvent(eventId, user.uid);
    await fetchEvents();
    setJoiningId(null);
  };

  const handleLeave = async (eventId: string) => {
    if (!user) return;
    setLeavingId(eventId);
    await leaveEvent(eventId, user.uid);
    await fetchEvents();
    setLeavingId(null);
  };

  const handleDelete = async (eventId: string) => {
    if (!user) return;
    setDeletingId(eventId);
    await deleteEvent(eventId);
    await fetchEvents();
    setDeletingId(null);
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setEditForm({
      titre: event.titre,
      sport: event.sport,
      niveau: event.niveau,
      required_participants: event.required_participants,
      lieu: event.lieu,
      description: event.description,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditSave = async (eventId: string) => {
    const fields = ['titre', 'sport', 'niveau', 'required_participants', 'lieu', 'description'];
    const newData: any = {};
    fields.forEach(field => {
      if (editRefs.current[field]) {
        let value = editRefs.current[field].innerText;
        if (field === 'required_participants') value = Number(value);
        newData[field] = value;
      }
    });
    setSavingEdit(true);
    await updateEvent(eventId, newData);
    await fetchEvents();
    setEditingId(null);
    setEditForm({});
    setSavingEdit(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="screen"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.header 
        className="header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.h1 
          className="header-title"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TeamUp
        </motion.h1>
        <div className="header-buttons">
          {user && (
            <motion.button 
              className="profile-button"
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mon Profil
            </motion.button>
          )}
          <motion.button 
            className="auth-button"
            onClick={() => user ? handleAuth() : setIsAuthModalVisible(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user ? 'Déconnexion' : 'Connexion'}
          </motion.button>
        </div>
      </motion.header>

      <main className="content">
        <motion.section 
          className="welcome-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="welcome-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Bienvenue sur TeamUp
          </motion.h2>
          <motion.p 
            className="welcome-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            La plateforme qui simplifie l'organisation de vos événements sportifs
          </motion.p>
        </motion.section>

        <section className="features-section">
          <motion.h2 className="section-title" variants={itemVariants}>
            Nos fonctionnalités
          </motion.h2>
          <div className="features-grid">
            <motion.div
              className="feature-card clickable"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
              onClick={() => navigate('/create-event')}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="feature-title">Créer des événements</h3>
              <p className="feature-text">
                Organisez facilement vos matchs et tournois
              </p>
            </motion.div>
            <motion.div
              className="feature-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            >
              <h3 className="feature-title">Gérer les équipes</h3>
              <p className="feature-text">
                Composez vos équipes et suivez les performances
              </p>
            </motion.div>
          </div>
        </section>

        <section className="events-section">
          <h2 className="events-title">Événements sportifs</h2>
          {loadingEvents ? (
            <div className="loading">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="no-events">Aucun événement pour le moment.</div>
          ) : (
            <div className="events-list">
              {events.map(event => {
                const nbInscrits = Array.isArray(event.participantsList) ? event.participantsList.length : 0;
                const dejaInscrit = user && Array.isArray(event.participantsList) && event.participantsList.includes(user.uid);
                const isCreator = user && event.creatorId === user.uid;
                const isEditing = editingId === event.id;
                return (
                  <div className="event-card" key={event.id}>
                    {isEditing ? (
                      <>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          ref={el => (editRefs.current['titre'] = el)}
                          className="event-title"
                          style={{ outline: 'none' }}
                          >{event.titre}</span>
                        <div className="event-meta">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={el => (editRefs.current['sport'] = el)}
                            style={{ outline: 'none' }}
                          >{event.sport}</span>
                          {' | '}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={el => (editRefs.current['niveau'] = el)}
                            style={{ outline: 'none' }}
                          >{event.niveau}</span>
                          {' | '}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={el => (editRefs.current['required_participants'] = el)}
                            style={{ outline: 'none', minWidth: 30, display: 'inline-block' }}
                          >{event.required_participants}</span>
                        </div>
                        <div className="event-meta">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={el => (editRefs.current['lieu'] = el)}
                            style={{ outline: 'none' }}
                          >{event.lieu}</span>
                        </div>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          ref={el => (editRefs.current['description'] = el)}
                          style={{ outline: 'none', display: 'block', marginTop: 4 }}
                        >{event.description}</span>
                        <div className="event-actions">
                          <button className="event-action-btn join-btn" onClick={() => handleEditSave(event.id)} disabled={savingEdit}>{savingEdit ? 'Enregistrement...' : 'Enregistrer'}</button>
                          <button className="event-action-btn leave-btn" onClick={handleEditCancel} disabled={savingEdit}>Annuler</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="event-title">{event.titre}</h3>
                        <div className="event-meta">
                          <span><b>Sport :</b> {event.sport}</span> | <span><b>Niveau :</b> {event.niveau}</span> | <span><b>Participants :</b> {nbInscrits} / {event.required_participants}</span>
                        </div>
                        <div className="event-meta">
                          <span><b>Lieu :</b> {event.lieu}</span>
                        </div>
                        <p className="event-description">{event.description}</p>
                        {user && (
                          <div className="event-actions">
                            {dejaInscrit ? (
                              <button
                                className="event-action-btn leave-btn"
                                onClick={() => handleLeave(event.id)}
                                disabled={leavingId === event.id}
                              >
                                {leavingId === event.id ? 'Désinscription...' : 'Se désinscrire'}
                              </button>
                            ) : (
                              <button
                                className="event-action-btn join-btn"
                                onClick={() => handleJoin(event.id)}
                                disabled={joiningId === event.id || nbInscrits >= event.required_participants}
                              >
                                {joiningId === event.id ? 'Inscription...' : nbInscrits >= event.required_participants ? 'Complet' : "S'inscrire"}
                              </button>
                            )}
                            {isCreator && (
                              <>
                                <button
                                  className="event-action-btn edit-btn"
                                  onClick={() => handleEdit(event)}
                                  disabled={editingId !== null}
                                >
                                  Modifier
                                </button>
                                <button
                                  className="event-action-btn delete-btn"
                                  onClick={() => handleDelete(event.id)}
                                  disabled={deletingId === event.id}
                                >
                                  {deletingId === event.id ? 'Suppression...' : 'Supprimer'}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
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
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <h2 className="modal-title">Connexion / Inscription</h2>
              {error && (
                <motion.p 
                  className="error-text"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
              <motion.button 
                className="modal-button"
                onClick={handleAuth}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <div className="loading-spinner" />
                ) : (
                  'Continuer avec Google'
                )}
              </motion.button>
              <motion.button 
                className="modal-button modal-button-secondary"
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
    </motion.div>
  );
};

export default HomeScreen;