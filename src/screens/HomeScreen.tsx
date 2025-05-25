import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const { user, loading, error, signInWithGoogle, logout } = useAuth();

  const handleAuth = async () => {
    if (user) {
      await logout();
    } else {
      await signInWithGoogle();
      setIsAuthModalVisible(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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

        <motion.section 
          className="features-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="section-title"
            variants={itemVariants}
          >
            Nos fonctionnalités
          </motion.h2>
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
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
            <motion.div 
              className="feature-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            >
              <h3 className="feature-title">Communauté</h3>
              <p className="feature-text">
                Rejoignez une communauté de passionnés
              </p>
            </motion.div>
          </div>
        </motion.section>
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