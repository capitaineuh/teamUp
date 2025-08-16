import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { addEvent, getEvents } from '../services/events';
import './CreateEventScreen.css';

const niveaux = ['débutant', 'intermédiaire', 'avancé', 'expert'];

const CreateEventScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
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
          <h1>Créer un évènement sportif</h1>
          <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </div>
        </div>

        <div className={`panel-content ${isExpanded ? 'expanded' : ''}`}>
          <form className='event-form' onSubmit={handleSubmit}>
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
            {success && <div className='success'>Évènement créé !</div>}
            <button type='submit' className='submit-btn' disabled={loading}>
              {loading ? 'Publication...' : "Poster l'évènement"}
            </button>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventScreen;
