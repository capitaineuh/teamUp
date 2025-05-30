import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent } from '../services/events';
import { useAuth } from '../hooks/useAuth';
import './CreateEventScreen.css';

const niveaux = ['débutant', 'intermédiaire', 'avancé', 'expert'];

const CreateEventScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError("Erreur lors de la création de l'évènement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-screen">
      <h1>Créer un évènement sportif</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="sport">Sport</label>
          <input type="text" id="sport" name="sport" value={form.sport} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="niveau">Niveau</label>
          <select id="niveau" name="niveau" value={form.niveau} onChange={handleChange} required>
            {niveaux.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="required_participants">Nombre de participants requis</label>
          <input type="number" id="required_participants" name="required_participants" min={2} value={form.required_participants} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lieu">Lieu</label>
          <input type="text" id="lieu" name="lieu" value={form.lieu} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="titre">Titre</label>
          <input type="text" id="titre" name="titre" value={form.titre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} required />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Évènement créé !</div>}
        <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Publication...' : 'Poster l\'évènement'}</button>
      </form>
    </div>
  );
};

export default CreateEventScreen; 