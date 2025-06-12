import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getEvents, joinEvent, leaveEvent, deleteEvent, updateEvent } from '../services/events';
import Map from '../components/Map';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';
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
  const titreRef = useRef<HTMLSpanElement>(null);
  const sportRef = useRef<HTMLSpanElement>(null);
  const niveauRef = useRef<HTMLSpanElement>(null);
  const participantsRef = useRef<HTMLSpanElement>(null);
  const lieuRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLSpanElement>(null);

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

  useEffect(() => {
    if (editingId) {
      if (titreRef.current) titreRef.current.innerText = editForm.titre || '';
      if (sportRef.current) sportRef.current.innerText = editForm.sport || '';
      if (niveauRef.current) niveauRef.current.innerText = editForm.niveau || '';
      if (participantsRef.current) participantsRef.current.innerText = String(editForm.required_participants ?? '');
      if (lieuRef.current) lieuRef.current.innerText = editForm.lieu || '';
      if (descriptionRef.current) descriptionRef.current.innerText = editForm.description || '';
    }
  }, [editingId, editForm]);

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
    setSavingEdit(true);
    await updateEvent(eventId, editForm);
    await fetchEvents();
    setEditingId(null);
    setEditForm({});
    setSavingEdit(false);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev: {
      titre: string;
      sport: string;
      niveau: string;
      required_participants: number;
      lieu: string;
      description: string;
    }) => ({
      ...prev,
      [field]: field === 'required_participants' ? Number(value) : value
    }));
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

        <section className="map-section">
          <motion.h2 className="section-title" variants={itemVariants}>
            Carte des événements
          </motion.h2>
          <motion.div
            className="map-container"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Map apiKey={GOOGLE_MAPS_API_KEY} />
          </motion.div>
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
                    <h3 className="event-title">
                      {isEditing ? (
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          ref={titreRef}
                          onInput={e => handleEditChange('titre', e.currentTarget.innerText)}
                          style={{ outline: 'none' }}
                        />
                      ) : event.titre}
                    </h3>
                    <div className="event-meta">
                      <span>
                        <b>Sport :</b>{' '}
                        {isEditing ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={sportRef}
                            onInput={e => handleEditChange('sport', e.currentTarget.innerText)}
                            style={{ outline: 'none' }}
                          />
                        ) : event.sport}
                      </span>
                      {' | '}
                      <span>
                        <b>Niveau :</b>{' '}
                        {isEditing ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={niveauRef}
                            onInput={e => handleEditChange('niveau', e.currentTarget.innerText)}
                            style={{ outline: 'none' }}
                          />
                        ) : event.niveau}
                      </span>
                      {' | '}
                      <span>
                        <b>Participants :</b>{' '}
                        {isEditing ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={participantsRef}
                            onInput={e => handleEditChange('required_participants', e.currentTarget.innerText)}
                            style={{ outline: 'none', minWidth: 30, display: 'inline-block' }}
                          />
                        ) : `${nbInscrits} / ${event.required_participants}`}
                      </span>
                    </div>
                    <div className="event-meta">
                      <span>
                        <b>Lieu :</b>{' '}
                        {isEditing ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={lieuRef}
                            onInput={e => handleEditChange('lieu', e.currentTarget.innerText)}
                            style={{ outline: 'none' }}
                          />
                        ) : event.lieu}
                      </span>
                    </div>
                    <p className="event-description">
                      {isEditing ? (
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          ref={descriptionRef}
                          onInput={e => handleEditChange('description', e.currentTarget.innerText)}
                          style={{ outline: 'none', display: 'block', marginTop: 4 }}
                        />
                      ) : event.description}
                    </p>
                    <div className="event-actions">
                      {isEditing ? (
                        <>
                          <button className="event-action-btn join-btn" onClick={() => handleEditSave(event.id)} disabled={savingEdit}>
                            {savingEdit ? 'Enregistrement...' : 'Enregistrer'}
                          </button>
                          <button className="event-action-btn leave-btn" onClick={handleEditCancel} disabled={savingEdit}>
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          {user && (
                            <>
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
                            </>
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