# Politique de Rétention des Données - TeamUp App Web

## 📋 Vue d'ensemble

Cette politique définit les durées de conservation des données personnelles collectées par TeamUp, conformément au Règlement Général sur la Protection des Données (RGPD).

## ⏰ Durées de Conservation par Type de Données

### 👤 Profils Utilisateurs
- **Durée :** 3 ans d'inactivité
- **Données concernées :**
  - Nom d'affichage et email
  - Sports pratiqués et niveaux
  - Préférences utilisateur
- **Critère de suppression :** Aucune connexion depuis 3 ans

### 💬 Messages de Chat
- **Durée :** 2 ans
- **Données concernées :**
  - Contenu des messages
  - Horodatage des conversations
  - Participants aux conversations
- **Critère de suppression :** Messages plus anciens que 2 ans

### 🏃‍♂️ Événements Sportifs
- **Durée :** 5 ans après création
- **Données concernées :**
  - Détails des événements créés
  - Liste des participants
  - Historique de participation
- **Critère de suppression :** Événements terminés depuis plus de 5 ans

### 🔐 Données d'Authentification
- **Durée :** Suppression immédiate
- **Données concernées :**
  - Tokens d'authentification
  - Sessions actives
  - Données de connexion temporaires
- **Critère de suppression :** Lors de la déconnexion

## 🗑️ Processus de Suppression Automatique

### 1. Identification Automatique
Le système identifie automatiquement les données éligibles à la suppression selon les critères définis.

### 2. Notification Préalable
Les utilisateurs reçoivent un email 30 jours avant la suppression définitive de leurs données.

### 3. Suppression Sécurisée
Les données sont supprimées de manière irréversible et sécurisée de tous les systèmes.

### 4. Confirmation
Une confirmation de suppression est envoyée avec la liste des données supprimées.

## ⚠️ Exceptions et Cas Particuliers

### 📊 Données Anonymisées
Certaines données peuvent être conservées sous forme anonymisée pour des analyses statistiques et l'amélioration du service.

### ⚖️ Obligations Légales
En cas d'obligation légale (procédure judiciaire, demande des autorités), certaines données peuvent être conservées plus longtemps.

### 🔒 Sécurité
Les logs de sécurité et d'audit sont conservés 1 an pour assurer la sécurité des systèmes.

## 🔧 Implémentation Technique

### Métadonnées de Rétention
Chaque document stocké inclut des métadonnées de rétention :

```typescript
interface RetentionMetadata {
  createdAt: string;        // Date de création
  expiresAt: string;        // Date d'expiration
  lastAccessedAt: string;   // Dernier accès
  retentionPeriod: number;  // Période en jours
  dataType: string;         // Type de données
}
```

### Service de Gestion
Le service `DataRetentionService` gère :
- Création des métadonnées de rétention
- Identification des documents expirés
- Suppression automatique des données
- Génération de rapports

### Fonctions Automatiques
- **Nettoyage quotidien** à 2h00 UTC
- **Mise à jour des accès** à chaque consultation
- **Notifications** avant suppression
- **Logs d'audit** de toutes les opérations

## 👥 Droits des Utilisateurs

### 🔄 Modification des Durées
Les utilisateurs peuvent demander la modification de la durée de conservation de leurs données.

### 📤 Export Avancé
Export des données avec informations sur les durées de conservation appliquées.

### 🗑️ Suppression Anticipée
Possibilité de demander la suppression immédiate sans attendre les délais automatiques.

### 📧 Contrôle des Notifications
Gestion des notifications concernant la suppression des données.

## 📊 Surveillance et Rapports

### Métriques Surveillées
- Nombre total de documents par type
- Nombre de documents expirés
- Taux de suppression automatique
- Erreurs de suppression

### Rapports Disponibles
- Rapport quotidien de nettoyage
- Rapport mensuel de rétention
- Audit des suppressions
- Statistiques d'utilisation

## 🔐 Sécurité et Conformité

### Mesures de Sécurité
- Suppression cryptographiquement sécurisée
- Logs d'audit complets
- Contrôle d'accès aux fonctions de suppression
- Chiffrement des données sensibles

### Conformité RGPD
- ✅ Principe de minimisation des données
- ✅ Limitation de la durée de conservation
- ✅ Droit à l'effacement
- ✅ Transparence des traitements
- ✅ Sécurité des traitements

## 📞 Contact et Support

### Délégué à la Protection des Données
- **Email :** dpo@teamup-app.com
- **Délai de réponse :** 30 jours maximum
- **Langues :** Français, Anglais

### Questions Fréquentes
1. **Puis-je récupérer mes données après suppression ?**
   Non, la suppression est irréversible pour des raisons de sécurité.

2. **Comment puis-je prolonger la conservation ?**
   Contactez-nous via le support ou activez votre compte en vous connectant.

3. **Les données sont-elles vraiment supprimées ?**
   Oui, la suppression est cryptographiquement sécurisée et irréversible.

## 📅 Historique des Modifications

- **Version 1.0** - {Date actuelle} : Politique initiale
- **Prochaines versions** : Mises à jour selon l'évolution réglementaire

---

**Dernière mise à jour :** {Date actuelle}
**Version :** 1.0
**Statut :** Conforme RGPD ✅
