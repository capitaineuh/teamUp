import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Toast from '../components/Toast';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { UserProfile } from '../types/user';
import './ProfileScreen.css';

// Animations de micro-interaction uniquement, pas utilisées pour le layout

const initialFormData: UserProfile = {
  displayName: '',
  email: '',
  sports: [],
};

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    profile,
    loading: profileLoading,
    error,
    updateProfile,
  } = useProfile();
  const [formData, setFormData] = useState<UserProfile>(initialFormData);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (profile) {
      // Assurer une clé stable pour chaque sport
      const sportsWithIds = (profile.sports || []).map((s, idx) => ({
        id: s.id || `${idx}-${s.name || 'sport'}`,
        name: s.name || '',
        level: s.level || 'débutant',
      }));
      setFormData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        sports: sportsWithIds,
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSportChange = (
    index: number,
    field: 'name' | 'level',
    value: string
  ) => {
    const newSports = [...formData.sports];
    newSports[index] = {
      ...newSports[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      sports: newSports,
    }));
  };

  const addSport = () => {
    setFormData(prev => ({
      ...prev,
      sports: [
        ...prev.sports,
        { id: `${Date.now()}-${prev.sports.length}`, name: '', level: 'débutant' },
      ],
    }));
  };

  const removeSport = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setToastMessage('Profil mis à jour avec succès !');
      setShowToast(true);
    } catch (err) {
      setToastMessage('Erreur lors de la mise à jour du profil');
      setShowToast(true);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <motion.div
        className='profile-screen'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className='loading'>Chargement...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className='profile-screen'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className='error'>Erreur: {error}</div>
      </motion.div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='profile-screen' key={user?.uid || 'profile'}>
      <div className='profile-header'>
        <motion.button
          className='back-button'
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Retour
        </motion.button>
        <h1>Mon Profil</h1>
      </div>

      {/* En-tête visuel avec avatar / nom / email */}
      <div className='profile-hero'>
        <div className='avatar'>
          {(formData.displayName || user?.displayName || 'U')
            .split(' ')
            .map(part => part.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>
        <div className='hero-texts'>
          <h2 className='profile-name'>
            {formData.displayName || user?.displayName || 'Utilisateur'}
          </h2>
          {(formData.email || user?.email) && (
            <p className='profile-email'>{formData.email || user?.email}</p>
          )}
        </div>
      </div>

      <form className='profile-container' onSubmit={handleSubmit}>
        <div className='profile-section'>
          <h2>Informations personnelles</h2>
          <div className='form-group'>
            <label htmlFor='displayName'>Nom d&apos;affichage</label>
            <motion.input
              layout={false}
              whileFocus={{ scale: 1.02 }}
              type='text'
              id='displayName'
              name='displayName'
              value={formData.displayName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <motion.input
              layout={false}
              whileFocus={{ scale: 1.02 }}
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className='profile-section'>
          <h2>Mes sports</h2>
          <AnimatePresence>
            {formData.sports.map((sport, index) => (
              <motion.div
                key={sport.id || `sport-${index}`}
                className='sport-item'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <div className='form-group'>
                  <label htmlFor={`sport-${index}`}>Sport</label>
                  <motion.input
                    layout={false}
                    whileFocus={{ scale: 1.02 }}
                    type='text'
                    id={`sport-${index}`}
                    value={sport.name}
                    onChange={e =>
                      handleSportChange(index, 'name', e.target.value)
                    }
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor={`level-${index}`}>Niveau</label>
                  <motion.select
                    layout={false}
                    whileFocus={{ scale: 1.02 }}
                    id={`level-${index}`}
                    value={sport.level}
                    onChange={e =>
                      handleSportChange(index, 'level', e.target.value)
                    }
                    required
                  >
                    <option value='débutant'>Débutant</option>
                    <option value='intermédiaire'>Intermédiaire</option>
                    <option value='avancé'>Avancé</option>
                    <option value='expert'>Expert</option>
                  </motion.select>
                </div>
                <motion.button
                  type='button'
                  className='remove-sport'
                  onClick={() => removeSport(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            type='button'
            className='add-sport'
            onClick={addSport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Ajouter un sport
          </motion.button>
        </div>

        <motion.button
          type='submit'
          className='save-button'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enregistrer
        </motion.button>
      </form>

      <AnimatePresence>
        {showToast && (
          <Toast
            message={toastMessage}
            visible={showToast}
            onHide={() => setShowToast(false)}
            type={toastMessage.toLowerCase().includes('erreur') ? 'error' : 'success'}
            duration={3000}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileScreen;
