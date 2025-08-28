// Configuration du Service Worker pour TeamUp
const CACHE_NAME = 'teamup-v1';
const STATIC_CACHE = 'teamup-static-v1';
const DYNAMIC_CACHE = 'teamup-dynamic-v1';

// Assets à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache-first pour les assets statiques
  static: 'cache-first',
  // Network-first pour les données dynamiques
  dynamic: 'network-first',
  // Stale-while-revalidate pour les images
  images: 'stale-while-revalidate'
};

// Configuration des routes
const ROUTES = [
  {
    pattern: /\.(png|jpg|jpeg|gif|ico|svg)$/,
    strategy: 'stale-while-revalidate',
    cache: STATIC_CACHE
  },
  {
    pattern: /\.(js|css)$/,
    strategy: 'cache-first',
    cache: STATIC_CACHE
  },
  {
    pattern: /manifest\.json$/,
    strategy: 'cache-first',
    cache: STATIC_CACHE
  },
  {
    pattern: /^\/api\//,
    strategy: 'network-first',
    cache: DYNAMIC_CACHE
  }
];

// Export de la configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CACHE_NAME,
    STATIC_CACHE,
    DYNAMIC_CACHE,
    STATIC_ASSETS,
    CACHE_STRATEGIES,
    ROUTES
  };
}
