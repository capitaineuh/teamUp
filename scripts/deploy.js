const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement de TeamUp...\n');

// Vérification des prérequis
console.log('1️⃣ Vérification des prérequis...');
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI installé');
} catch (error) {
  console.log('❌ Firebase CLI non installé. Installez-le avec: npm install -g firebase-tools');
  process.exit(1);
}

// Nettoyage du build précédent
console.log('\n2️⃣ Nettoyage du build précédent...');
try {
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
    console.log('✅ Dossier build supprimé');
  }
} catch (error) {
  console.log('⚠️ Erreur lors du nettoyage:', error.message);
}

// Build de l'application
console.log('\n3️⃣ Build de l\'application...');
try {
  execSync('npm run build:no-lint', { stdio: 'inherit' });
  console.log('✅ Build réussi');
} catch (error) {
  console.log('❌ Erreur lors du build');
  process.exit(1);
}

// Vérification des assets dans le build
console.log('\n4️⃣ Vérification des assets...');
const buildDir = path.join(__dirname, '..', 'build');
const requiredBuildAssets = [
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'manifest.json',
  'index.html'
];

requiredBuildAssets.forEach(asset => {
  const assetPath = path.join(buildDir, asset);
  if (fs.existsSync(assetPath)) {
    const stats = fs.statSync(assetPath);
    console.log(`✅ ${asset} - ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.log(`❌ ${asset} - MANQUANT dans le build`);
  }
});

// Déploiement Firebase
console.log('\n5️⃣ Déploiement Firebase...');
try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ Déploiement réussi !');
} catch (error) {
  console.log('❌ Erreur lors du déploiement');
  process.exit(1);
}

console.log('\n🎉 Déploiement terminé avec succès !');
console.log('🌐 Votre application devrait être accessible sur Firebase Hosting');
