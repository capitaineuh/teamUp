/// <reference lib="webworker" />
/* global ServiceWorkerGlobalScope */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Préchargement des ressources essentielles
precacheAndRoute(self.__WB_MANIFEST);

// Cache pour les événements et données utilisateur
const EVENTS_CACHE = 'teamup-events-v1';
const USER_DATA_CACHE = 'teamup-user-v1';
const OFFLINE_ACTIONS_CACHE = 'teamup-offline-actions-v1';

// Stratégie Network First pour les événements (priorité au réseau, fallback cache)
registerRoute(
  ({ url }) => url.pathname.includes('/api/events') || url.pathname.includes('/events'),
  new NetworkFirst({
    cacheName: EVENTS_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 24 heures
      }),
    ],
  })
);

// Stratégie Network First pour les données utilisateur
registerRoute(
  ({ url }) => url.pathname.includes('/api/users') || url.pathname.includes('/profile'),
  new NetworkFirst({
    cacheName: USER_DATA_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 heure
      }),
    ],
  })
);

// Stratégie Cache First pour les ressources statiques
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    (url.pathname.endsWith('.png') ||
     url.pathname.endsWith('.jpg') ||
     url.pathname.endsWith('.jpeg') ||
     url.pathname.endsWith('.svg') ||
     url.pathname.endsWith('.ico')),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }),
    ],
  })
);

// Cache des tiles de carte pour le mode hors ligne
registerRoute(
  ({ url }) => url.hostname.includes('maps.googleapis.com') || url.hostname.includes('maps.gstatic.com'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
      }),
    ],
  })
);

// Gestion des actions hors ligne (inscriptions aux événements)
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' && event.request.url.includes('/api/events')) {
    event.respondWith(
      fetch(event.request.clone())
        .then((response) => {
          // Si la requête réussit, on la traite normalement
          return response;
        })
        .catch(() => {
          // Si la requête échoue, on stocke l'action pour plus tard
          return storeOfflineAction(event.request);
        })
    );
  }
});

// Stockage des actions hors ligne
async function storeOfflineAction(request: Request): Promise<Response> {
  const offlineActions = await getOfflineActions();
  const action = {
    id: Date.now().toString(),
    url: request.url,
    method: request.method,
    body: await request.clone().text(),
    timestamp: Date.now(),
  };

  offlineActions.push(action);
  await setOfflineActions(offlineActions);

  // Retourner une réponse simulée
  return new Response(JSON.stringify({
    success: true,
    offline: true,
    message: 'Action enregistrée pour synchronisation ultérieure'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Récupération des actions hors ligne
async function getOfflineActions(): Promise<any[]> {
  const cache = await caches.open(OFFLINE_ACTIONS_CACHE);
  const response = await cache.match('offline-actions');
  if (response) {
    return await response.json();
  }
  return [];
}

// Sauvegarde des actions hors ligne
async function setOfflineActions(actions: any[]): Promise<void> {
  const cache = await caches.open(OFFLINE_ACTIONS_CACHE);
  await cache.put('offline-actions', new Response(JSON.stringify(actions)));
}

// Synchronisation des actions hors ligne quand la connexion revient
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-offline-actions') {
    event.waitUntil(syncOfflineActions());
  }
});

// Synchronisation des actions hors ligne
async function syncOfflineActions(): Promise<void> {
  const offlineActions = await getOfflineActions();

  for (const action of offlineActions) {
    try {
      const response = await fetch(action.url, {
        method: action.method,
        body: action.body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Supprimer l'action du cache si elle a réussi
        const updatedActions = offlineActions.filter(a => a.id !== action.id);
        await setOfflineActions(updatedActions);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    }
  }
}

// Gestion des messages du service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'SYNC_OFFLINE_ACTIONS') {
    event.waitUntil(syncOfflineActions());
  }
});

// Gestion de l'installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Gestion de l'activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![EVENTS_CACHE, USER_DATA_CACHE, OFFLINE_ACTIONS_CACHE, 'static-assets', 'map-tiles'].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker Unhandled Rejection:', event.reason);
});
