import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Screen from '../components/Screen';
import { getUserProfile, updateUserProfile, UserProfile } from '../services/firestore';
import Toast from '../components/Toast';

// Types pour les sports et niveaux
type SportLevel = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
type Sport = {
  name: string;
  level: SportLevel;
};

const ProfileScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [sports, setSports] = useState<Sport[]>([
    { name: '', level: 'Débutant' }
  ]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setDisplayName(profile.displayName);
            setSports(profile.sports.length > 0 ? profile.sports : [{ name: '', level: 'Débutant' }]);
          } else {
            setDisplayName(user.displayName || '');
          }
        } catch (error) {
          Alert.alert('Erreur', 'Impossible de charger le profil');
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleAddSport = () => {
    setSports([...sports, { name: '', level: 'Débutant' }]);
  };

  const handleRemoveSport = (index: number) => {
    if (sports.length > 1) {
      const newSports = [...sports];
      newSports.splice(index, 1);
      setSports(newSports);
    }
  };

  const handleSportChange = (index: number, field: keyof Sport, value: string) => {
    const newSports = [...sports];
    newSports[index] = { ...newSports[index], [field]: value };
    setSports(newSports);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        sports,
      });
      setToast({
        show: true,
        message: 'Profil mis à jour avec succès !',
        type: 'success',
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Erreur lors de la sauvegarde du profil',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom d'affichage</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Votre nom"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sports</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddSport}
            >
              <Text style={styles.addButtonText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>

          {sports.map((sport, index) => (
            <View key={index} style={styles.sportContainer}>
              <View style={styles.sportInputs}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Sport</Text>
                  <TextInput
                    style={styles.input}
                    value={sport.name}
                    onChangeText={(value) => handleSportChange(index, 'name', value)}
                    placeholder="Nom du sport"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Niveau</Text>
                  <View style={styles.levelSelector}>
                    {['Débutant', 'Intermédiaire', 'Avancé', 'Expert'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.levelButton,
                          sport.level === level && styles.levelButtonActive
                        ]}
                        onPress={() => handleSportChange(index, 'level', level as SportLevel)}
                      >
                        <Text style={[
                          styles.levelButtonText,
                          sport.level === level && styles.levelButtonTextActive
                        ]}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {sports.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveSport(index)}
                >
                  <Text style={styles.removeButtonText}>Supprimer</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast({ ...toast, show: false })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sportContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  sportInputs: {
    gap: 15,
  },
  levelSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  levelButtonActive: {
    backgroundColor: '#007AFF',
  },
  levelButtonText: {
    color: '#666',
    fontSize: 14,
  },
  levelButtonTextActive: {
    color: 'white',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#28a745',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    marginTop: 10,
    padding: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#dc3545',
    fontSize: 14,
  },
  saveButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 