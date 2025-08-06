# Guide de configuration CI/CD

## Pipeline configuré

Le workflow GitHub Actions est configuré pour :

1. **Build** : `npm run build`
2. **Linting** : `npm run lint`
3. **Tests** : `npm test` (si disponibles)
4. **SonarQube** : Analyse de qualité (optionnel)
5. **Déploiement** : Firebase Hosting (seulement sur main/master)

## Scripts disponibles

### Scripts de base
```bash
npm run ci          # Lint + Build
npm run ci:full     # Lint + Build + Tests
```

### Scripts de qualité
```bash
npm run lint        # ESLint
npm run lint:fix    # ESLint avec auto-correction
npm run format      # Prettier
npm run code:check  # Lint + Format check
npm run code:fix    # Lint fix + Format
```

### Scripts de déploiement
```bash
npm run deploy      # Build + Deploy Firebase
npm run deploy:hosting  # Build + Deploy hosting seulement
```

## Configuration GitHub Secrets

### Secrets requis pour le déploiement :

1. **FIREBASE_SERVICE_ACCOUNT**
   - Allez dans Firebase Console > Project Settings > Service Accounts
   - Cliquez sur "Generate new private key"
   - Copiez le contenu JSON dans le secret GitHub

2. **FIREBASE_PROJECT_ID**
   - Votre ID de projet Firebase (ex: `teamup-app-12345`)

### Secrets optionnels pour SonarQube :

3. **SONAR_TOKEN**
   - Token d'accès SonarQube
   - Si non configuré, l'analyse SonarQube sera ignorée

4. **SONAR_HOST_URL**
   - URL de votre instance SonarQube
   - Ex: `https://sonarcloud.io` ou `https://your-sonar-server.com`

## Configuration des secrets GitHub

1. Allez dans votre repo GitHub
2. Settings > Secrets and variables > Actions
3. Cliquez sur "New repository secret"
4. Ajoutez chaque secret avec sa valeur

## Test local du pipeline

```bash
# Test complet du pipeline
npm run ci:full

# Test rapide (lint + build)
npm run ci

# Test de déploiement local
npm run deploy:hosting
```

## Déclenchement du pipeline

Le pipeline se déclenche automatiquement sur :
- ✅ **Push** sur `main` ou `master`
- ✅ **Pull Request** vers `main` ou `master`

## Étapes du pipeline

### Job 1: Build and Test
1. ✅ Checkout du code
2. ✅ Setup Node.js 18
3. ✅ Installation des dépendances
4. ✅ Linting (ESLint)
5. ✅ Build (React)
6. ✅ Tests (si disponibles)
7. ✅ SonarQube (optionnel)

### Job 2: Deploy (seulement sur main/master)
1. ✅ Checkout du code
2. ✅ Setup Node.js 18
3. ✅ Installation des dépendances
4. ✅ Build
5. ✅ Déploiement Firebase

## Monitoring

### GitHub Actions
- Allez dans l'onglet "Actions" de votre repo
- Suivez l'exécution en temps réel
- Consultez les logs en cas d'erreur

### Firebase Console
- Allez dans Firebase Console > Hosting
- Vérifiez que le déploiement s'est bien passé
- Consultez les analytics et performances

## Dépannage

### Erreurs courantes :

1. **Build échoue**
   - Vérifiez les erreurs TypeScript
   - Corrigez les erreurs ESLint
   - Testez localement avec `npm run ci`

2. **Déploiement échoue**
   - Vérifiez les secrets GitHub
   - Vérifiez les permissions Firebase
   - Testez avec `npm run deploy:hosting`

3. **SonarQube échoue**
   - Vérifiez les secrets SONAR_TOKEN et SONAR_HOST_URL
   - Ou supprimez les secrets pour désactiver SonarQube

## Prochaines étapes

1. ✅ Configurez les secrets GitHub
2. ✅ Testez le pipeline localement
3. ✅ Faites un push sur main pour déclencher le pipeline
4. ✅ Vérifiez le déploiement automatique
5. ✅ Configurez SonarQube (optionnel)
