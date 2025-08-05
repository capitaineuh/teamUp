# Analyse de Code - TeamUp App Web

Ce document explique comment utiliser ESLint et SonarQube pour analyser la qualité du code dans le projet TeamUp App Web.

## ESLint

ESLint est un outil d'analyse statique qui détecte les problèmes dans le code JavaScript/TypeScript.

### Configuration

Le projet utilise une configuration ESLint personnalisée dans `.eslintrc.js` qui étend la configuration de base de React Scripts.

### Commandes disponibles

```bash
# Analyser le code sans corriger
npm run lint

# Analyser et corriger automatiquement les problèmes corrigeables
npm run lint:fix

# Générer un rapport JSON pour SonarQube
npm run lint:report
```

### Règles principales

- **Règles générales** : Détection des variables non utilisées, console.log, etc.
- **Règles React** : Vérification des clés dans les listes, props, etc.
- **Règles d'import** : Organisation automatique des imports
- **Règles de formatage** : Cohérence du style de code

### Problèmes courants et solutions

1. **Imports non organisés** : Utilisez `npm run lint:fix` pour corriger automatiquement
2. **Console.log** : Remplacez par un système de logging approprié
3. **Variables non utilisées** : Supprimez ou préfixez avec `_`
4. **Clés manquantes dans les listes** : Ajoutez des clés uniques pour chaque élément

## SonarQube/SonarCloud

SonarQube est une plateforme d'analyse de qualité du code qui fournit des métriques détaillées.

### Configuration

Le fichier `sonar-project.properties` configure l'analyse SonarQube pour le projet.

### Métriques analysées

- **Maintenabilité** : Complexité cyclomatique, duplications
- **Fiabilité** : Bugs potentiels, vulnérabilités
- **Sécurité** : Vulnérabilités de sécurité
- **Couverture de tests** : Pourcentage de code testé
- **Duplications** : Code dupliqué

### Intégration avec ESLint

SonarQube utilise les rapports ESLint pour analyser la qualité du code :

```bash
# Générer le rapport ESLint pour SonarQube
npm run lint:report

# Analyser avec SonarQube (nécessite sonar-scanner installé)
npm run sonar:analyze
```

## Workflow recommandé

1. **Développement quotidien** :
   ```bash
   npm run lint
   npm run lint:fix
   ```

2. **Avant commit** :
   ```bash
   npm run code:check
   ```

3. **Analyse complète** :
   ```bash
   npm run lint:report
   # Puis analyser avec SonarQube
   ```

## Configuration IDE

### VS Code

Installez l'extension ESLint pour VS Code pour avoir l'analyse en temps réel :

1. Ouvrez VS Code
2. Allez dans Extensions (Ctrl+Shift+X)
3. Recherchez "ESLint"
4. Installez l'extension officielle

### Configuration VS Code

Ajoutez dans `.vscode/settings.json` :

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Résolution des problèmes courants

### Erreur "google is not defined"

Dans `src/components/Map.tsx`, ajoutez en haut du fichier :

```typescript
/* global google */
```

### Erreur "ServiceWorkerGlobalScope is not defined"

Dans `src/service-worker.ts`, ajoutez :

```typescript
/* global ServiceWorkerGlobalScope */
```

### Warnings console.log

Remplacez les `console.log` par un système de logging approprié ou supprimez-les pour la production.

## Amélioration continue

1. **Réviser régulièrement** les règles ESLint selon les besoins du projet
2. **Analyser les métriques** SonarQube pour identifier les zones d'amélioration
3. **Former l'équipe** sur les bonnes pratiques de qualité de code
4. **Intégrer** l'analyse dans le pipeline CI/CD 