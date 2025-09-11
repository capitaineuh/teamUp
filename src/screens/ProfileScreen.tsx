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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

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

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'supprimer') {
      setToastMessage('Veuillez taper "SUPPRIMER" pour confirmer');
      setShowToast(true);
      return;
    }

    try {
      // Fonction factice - à remplacer par la vraie implémentation
      console.log('Suppression du compte demandée pour:', user?.uid);
      setToastMessage('Fonctionnalité de suppression en cours de développement');
      setShowToast(true);
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    } catch (err) {
      setToastMessage('Erreur lors de la suppression du compte');
      setShowToast(true);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation('');
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

      {/* Section Gestion des Droits RGPD */}
      <div className='profile-section gdpr-section'>
        <h2>Gestion de vos données personnelles</h2>
        <div className='gdpr-info'>
          <p>
            Conformément au RGPD, vous disposez de droits sur vos données personnelles :
          </p>
          <ul>
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
            <li>Droit à la portabilité des données</li>
          </ul>
        </div>

        <div className='gdpr-actions'>
          <motion.button
            type='button'
            className='gdpr-button delete-button'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteAccount}
          >
            🗑️ Supprimer mon compte
          </motion.button>
        </div>

        <div className='gdpr-links'>
          <motion.button
            type='button'
            className='gdpr-link-button'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/data-retention-policy')}
          >
            📋 Consulter la politique de rétention des données
          </motion.button>
        </div>

      </div>

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

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className='delete-modal-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelDeleteAccount}
          >
            <motion.div
              className='delete-modal'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='delete-modal-header'>
                <h3>⚠️ Supprimer mon compte</h3>
              </div>

              <div className='delete-modal-content'>
                <div className='warning-box'>
                  <h4>Cette action est irréversible !</h4>
                  <p>
                    La suppression de votre compte entraînera :
                  </p>
                  <ul>
                    <li>Suppression de votre profil utilisateur</li>
                    <li>Suppression de tous vos messages de chat</li>
                    <li>Retrait de votre participation aux événements</li>
                    <li>Perte de toutes vos données personnelles</li>
                  </ul>
                </div>

                <div className='confirmation-input'>
                  <label htmlFor='deleteConfirmation'>
                    Pour confirmer, tapez <strong>SUPPRIMER</strong> :
                  </label>
                  <input
                    type='text'
                    id='deleteConfirmation'
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder='SUPPRIMER'
                    className='confirmation-field'
                  />
                </div>
              </div>

              <div className='delete-modal-actions'>
                <motion.button
                  type='button'
                  className='cancel-button'
                  onClick={cancelDeleteAccount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Annuler
                </motion.button>
                <motion.button
                  type='button'
                  className='confirm-delete-button'
                  onClick={confirmDeleteAccount}
                  disabled={deleteConfirmation.toLowerCase() !== 'supprimer'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Supprimer définitivement
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileScreen;
