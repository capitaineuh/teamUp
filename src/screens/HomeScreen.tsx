import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Screen from '../components/Screen';
import { useAuth } from '../hooks/useAuth';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TeamUp</Text>
        <View style={styles.headerButtons}>
          {user && (
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.profileButtonText}>Profil</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.authButton}
            onPress={() => user ? handleAuth() : setIsAuthModalVisible(true)}
          >
            <Text style={styles.authButtonText}>
              {user ? 'Déconnexion' : 'Connexion'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenue sur TeamUp</Text>
          <Text style={styles.welcomeText}>
            La plateforme qui simplifie l'organisation de vos événements sportifs
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Nos fonctionnalités</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Créer des événements</Text>
              <Text style={styles.featureText}>
                Organisez facilement vos matchs et tournois
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Gérer les équipes</Text>
              <Text style={styles.featureText}>
                Composez vos équipes et suivez les performances
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Communauté</Text>
              <Text style={styles.featureText}>
                Rejoignez une communauté de passionnés
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isAuthModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAuthModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Connexion / Inscription</Text>
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.modalButtonText}>Continuer avec Google</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => setIsAuthModalVisible(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  profileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#28a745',
  },
  profileButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  authButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  authButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: '#007AFF',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  featureCard: {
    flex: 1,
    minWidth: 300,
    margin: 8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  modalButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;