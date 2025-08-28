const fs = require('fs');
const path = require('path');

// Vérification des assets
const publicDir = path.join(__dirname, '..', 'public');
const requiredAssets = [
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'manifest.json',
  'index.html'
];

console.log('🔍 Vérification des assets...\n');

requiredAssets.forEach(asset => {
  const assetPath = path.join(publicDir, asset);
  if (fs.existsSync(assetPath)) {
    const stats = fs.statSync(assetPath);
    console.log(`✅ ${asset} - ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.log(`❌ ${asset} - MANQUANT`);
  }
});

// Vérification du manifest
const manifestPath = path.join(publicDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('\n📋 Vérification du manifest:');
    console.log(`   - Nom: ${manifest.name}`);
    console.log(`   - Icônes: ${manifest.icons.length}`);

    manifest.icons.forEach((icon, index) => {
      console.log(`   - Icône ${index + 1}: ${icon.src} (${icon.sizes})`);
    });
  } catch (error) {
    console.log(`❌ Erreur dans le manifest: ${error.message}`);
  }
}

console.log('\n✨ Vérification terminée !');
