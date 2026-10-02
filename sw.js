const CACHE_NAME = 'furkan-portfolio-v24';
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

function uygulamaKabuguMu(url) {
  return url.origin === self.location.origin &&
    (url.pathname === '/' || url.pathname.endsWith('.html') ||
     url.pathname.endsWith('.css') ||
     (url.pathname.startsWith('/js/') && url.pathname.endsWith('.js')) ||
     url.pathname === '/api.json');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Önce bütün yanıtlar başarılı olmalı; eski worker bu sırada çalışır.
        const yanitlar = await Promise.all(ASSETS_TO_CACHE.map(async (yol) => {
          const istek = new Request(yol, {
            cache: uygulamaKabuguMu(new URL(yol, self.location.origin)) ? 'reload' : 'default'
          });
          const yanit = await fetch(istek);
          if (!yanit.ok) throw new Error('Precache başarısız: ' + yol);
          return [yol, yanit];
        }));
        const onbellek = await caches.open(CACHE_NAME);
        await Promise.all(yanitlar.map(([yol, yanit]) => onbellek.put(yol, yanit)));
        await self.skipWaiting();
      } catch (hata) {
        await caches.delete(CACHE_NAME);
        throw hata;
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const anahtarlar = await caches.keys();
      const eskiSurumler = anahtarlar.filter(ad => ad.startsWith('furkan-portfolio-v') && ad !== CACHE_NAME);
      const pencereler = eskiSurumler.length
        ? await self.clients.matchAll({ type: 'window', includeUncontrolled: true }) : [];
      await Promise.all(eskiSurumler.map(ad => caches.delete(ad)));
      const kimlikler = pencereler.filter(pencere => new URL(pencere.url).origin === self.location.origin)
        .map(pencere => pencere.id);
      if (kimlikler.length) {
        // Activate, kendi kontrolündeki navigation'ı beklerse fetch/activate kilitlenir.
        self.registration.active.postMessage({ tur: 'portfolio-surum-gecisi', kimlikler });
      } else {
        await self.clients.claim();
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  // Yalnız worker'ın kendi lifecycle mesajı: page JS upgrade kararı vermez.
  if (event.source?.scriptURL !== self.location.href || event.data?.tur !== 'portfolio-surum-gecisi') return;
  event.waitUntil((async () => {
    const worker = self.registration.active;
    if (worker.state !== 'activated') {
      await new Promise(resolve => worker.addEventListener('statechange', function durumDegisti() {
        if (worker.state === 'activated') { worker.removeEventListener('statechange', durumDegisti); resolve(); }
      }));
    }
    // Eski handler'ın tamamladığı reload yeni client ID üretir: ona ikinci navigation yapılmaz.
    const eskiPencereler = await Promise.all(event.data.kimlikler.map(id => self.clients.get(id)));
    await Promise.all(eskiPencereler.filter(Boolean).map(pencere => pencere.navigate(pencere.url)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Yalnız mevcut font/icon stylesheet'leri: warmed-cache offline görünümünü korur.
  const sunumKaynaklari = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];
  const sunumAsseti = sunumKaynaklari.includes(url.hostname) && ['style', 'font'].includes(event.request.destination);

  // Mutable HTML/CSS/JS/config online doğrulanır; offline durumda canonical kayıt kullanılır.
  if (uygulamaKabuguMu(url)) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then(async (yanit) => {
          if (!yanit.ok) throw new Error('App-shell ağ yanıtı başarısız');
          const onbellek = await caches.open(CACHE_NAME);
          // Query'li include ve precache aynı canonical kaydı günceller.
          await onbellek.put(url.pathname, yanit.clone());
          return yanit;
        })
        .catch(async (hata) => {
          const onbellek = await caches.open(CACHE_NAME);
          const kayit = await onbellek.match(url.pathname);
          if (kayit) return kayit;
          throw hata;
        })
    );
    return;
  }

  // Cache-first for local static assets (images, fonts, stylesheets, pdfs)
  const isStaticAsset = url.origin === self.location.origin && 
    (url.pathname.startsWith('/certs/') || 
     url.pathname.endsWith('.webp') || 
     url.pathname.endsWith('.png') || 
     url.pathname.endsWith('.jpg') || 
     url.pathname.endsWith('.svg') || 
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
      .then(async (networkResponse) => {
        if (networkResponse && ((networkResponse.status === 200 && networkResponse.type === 'basic') ||
            (sunumAsseti && (networkResponse.status === 200 || networkResponse.type === 'opaque')))) {
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseToCache);
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
