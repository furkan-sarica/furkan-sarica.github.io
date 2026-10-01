const CACHE_NAME = 'furkan-portfolio-v22';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/Fufuizm.webp',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/api.json',
  '/js/ui.js',
  '/js/language.js',
  '/js/hero-navigation.js',
  '/js/contact-effects.js',
  '/js/boot.js',
  '/js/terminal/core.js',
  '/js/terminal/commands-system.js',
  '/js/terminal/commands-files.js',
  '/js/terminal/easter-eggs.js',
  '/js/terminal/security-sim.js',
  '/js/terminal/runtime.js',
  '/js/terminal/effects.js',
  '/js/terminal.js',
  '/js/ai/ui.js',
  '/js/ai/render.js',
  '/js/ai/local.js',
  '/js/ai/transport.js',
  '/js/ai-shell.js',
  '/js/keyboard-navigation.js',
  '/js/content-effects.js',
  '/js/pwa.js',
  '/js/crt-effect.js',
  '/js/certificates.js',
  '/js/easter-eggs.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Cache-first for local static assets (images, fonts, stylesheets, pdfs)
  const isStaticAsset = url.origin === self.location.origin && 
    (url.pathname.startsWith('/certs/') || 
     url.pathname.endsWith('.webp') || 
     url.pathname.endsWith('.png') || 
     url.pathname.endsWith('.jpg') || 
     url.pathname.endsWith('.svg') || 
     url.pathname.endsWith('.css') || 
     url.pathname.endsWith('.json') ||
     url.pathname.endsWith('.pdf'));

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-first with fallback to cache for HTML navigation
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html', { ignoreSearch: true });
          }
        });
      })
  );
});
