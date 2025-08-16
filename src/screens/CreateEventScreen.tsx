import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { addEvent, getEvents, deleteEvent, updateEvent } from '../services/events';
import './CreateEventScreen.css';

const niveaux = ['débutant', 'intermédiaire', 'avancé', 'expert'];

const CreateEventScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({
    sport: '',
    niveau: 'débutant',
    required_participants: 2,
    lieu: '',
    titre: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addEvent({
        ...form,
        required_participants: Number(form.required_participants),
        participantsList: [],
        creatorId: user?.uid || '',
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      // Rafraîchir la liste des évènements après création
      fetchMyEvents();
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError("Erreur lors de la création de l'évènement");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchMyEvents = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoadingEvents(true);
      const allEvents = await getEvents();
      const userEvents = allEvents.filter(event => event.creatorId === user.uid);
      setMyEvents(userEvents);
    } catch (err) {
      setMyEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, [user?.uid]);

  const handleEditEvent = (event: any) => {
    setForm({
      sport: event.sport,
      niveau: event.niveau,
      required_participants: event.required_participants,
      lieu: event.lieu,
      titre: event.titre,
      description: event.description,
    });
    setEditingEvent(event.id);
    setIsExpanded(true);
    setError(null);
    setSuccess(false);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setLoading(true);
    setError(null);
    try {
      await updateEvent(editingEvent, {
        ...form,
        required_participants: Number(form.required_participants),
      });
      setSuccess(true);
      setEditingEvent(null);
      // Réinitialiser le formulaire
      setForm({
        sport: '',
        niveau: 'débutant',
        required_participants: 2,
        lieu: '',
        titre: '',
        description: '',
      });
      // Rafraîchir la liste
      fetchMyEvents();
      setTimeout(() => {
        setSuccess(false);
        setIsExpanded(false);
      }, 1200);
    } catch (err) {
      setError("Erreur lors de la modification de l'évènement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setConfirmDelete(eventId);
  };

  const confirmDeleteEvent = async () => {
    if (!confirmDelete) return;

    setDeletingEvent(confirmDelete);
    try {
      await deleteEvent(confirmDelete);
      setSuccess(true);
      // Rafraîchir la liste
      fetchMyEvents();
      setTimeout(() => setSuccess(false), 1200);
    } catch (err) {
      setError("Erreur lors de la suppression de l'évènement");
    } finally {
      setDeletingEvent(null);
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setForm({
      sport: '',
      niveau: 'débutant',
      required_participants: 2,
      lieu: '',
      titre: '',
      description: '',
    });
    setError(null);
  };

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  return (
    <div className='create-event-screen'>
      <div className={`event-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div
          className='panel-header'
          onClick={toggleExpansion}
        >
          <h1>{editingEvent ? 'Modifier un évènement sportif' : 'Créer un évènement sportif'}</h1>
          <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </div>
        </div>

        <div className={`panel-content ${isExpanded ? 'expanded' : ''}`}>
          <form className='event-form' onSubmit={editingEvent ? handleUpdateEvent : handleSubmit}>
            <div className='form-group'>
              <label htmlFor='sport'>Sport</label>
              <input
                type='text'
                id='sport'
                name='sport'
                value={form.sport}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='niveau'>Niveau</label>
              <select
                id='niveau'
                name='niveau'
                value={form.niveau}
                onChange={handleChange}
                required
              >
                {niveaux.map(n => (
                  <option key={n} value={n}>
                    {n.charAt(0).toUpperCase() + n.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='required_participants'>
                Nombre de participants requis
              </label>
              <input
                type='number'
                id='required_participants'
                name='required_participants'
                min={2}
                value={form.required_participants}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='lieu'>Lieu</label>
              <input
                type='text'
                id='lieu'
                name='lieu'
                value={form.lieu}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='titre'>Titre</label>
              <input
                type='text'
                id='titre'
                name='titre'
                value={form.titre}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea
                id='description'
                name='description'
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className='error'>{error}</div>}
            {success && <div className='success'>
              {editingEvent ? 'Évènement modifié !' : 'Évènement créé !'}
            </div>}
            <div className='form-actions'>
              {editingEvent && (
                <button
                  type='button'
                  className='cancel-btn'
                  onClick={cancelEdit}
                >
                  Annuler
                </button>
              )}
              <button type='submit' className='submit-btn' disabled={loading}>
                {loading
                  ? (editingEvent ? 'Modification...' : 'Publication...')
                  : (editingEvent ? 'Modifier l\'évènement' : "Poster l'évènement")
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Section "Mes évènements" */}
      <div className='my-events-section'>
        <h2>Mes évènements</h2>
        {loadingEvents ? (
          <div className='loading-events'>Chargement de vos évènements...</div>
        ) : myEvents.length === 0 ? (
          <div className='no-events'>
            <p>Vous n&apos;avez pas encore créé d&apos;évènements.</p>
            <p>Créez votre premier évènement sportif en utilisant le formulaire ci-dessus !</p>
          </div>
        ) : (
          <div className='events-list'>
            {myEvents.map(event => (
              <div key={event.id} className='event-card'>
                <div className='event-header'>
                  <h3 className='event-title'>{event.titre}</h3>
                  <span className='event-date'>
                    {new Date(event.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className='event-details'>
                  <div className='event-info'>
                    <span className='event-sport'>{event.sport}</span>
                    <span className='event-level'>{event.niveau}</span>
                    <span className='event-location'>{event.lieu}</span>
                  </div>
                  <div className='event-participants'>
                    <span className='participants-count'>
                      {event.participantsList?.length || 0} / {event.required_participants} participants
                    </span>
                  </div>
                </div>
                <p className='event-description'>{event.description}</p>
                <div className='event-actions'>
                  <button
                    className='edit-btn'
                    onClick={() => handleEditEvent(event)}
                    disabled={editingEvent === event.id}
                  >
                    {editingEvent === event.id ? 'Modification...' : 'Modifier'}
                  </button>
                  {confirmDelete === event.id ? (
                    <>
                      <button
                        className='confirm-delete-btn'
                        onClick={confirmDeleteEvent}
                        disabled={deletingEvent === event.id}
                      >
                        {deletingEvent === event.id ? 'Suppression...' : 'Confirmer'}
                      </button>
                      <button
                        className='cancel-delete-btn'
                        onClick={cancelDelete}
                        disabled={deletingEvent === event.id}
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button
                      className='delete-btn'
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deletingEvent === event.id}
                    >
                      {deletingEvent === event.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventScreen;
