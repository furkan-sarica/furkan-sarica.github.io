// Gerçek failure state: mutable assetler default HTTP cache üzerinden v23'e girer.
const CACHE_NAME = 'furkan-portfolio-v23';
const ASSETS_TO_CACHE = []; // Test sunucusu mevcut asset listesini buraya koyar.
self.addEventListener('install', olay => {
    olay.waitUntil(caches.open(CACHE_NAME).then(onbellek => onbellek.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', olay => { olay.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', olay => {
    if (olay.request.method !== 'GET') return;
    const url = new URL(olay.request.url);
    olay.respondWith(fetch(olay.request, url.pathname.endsWith('.css') ? { cache: 'no-cache' } : {})
        .then(async yanit => {
            if (yanit.ok) await (await caches.open(CACHE_NAME)).put(url.pathname, yanit.clone());
            return yanit;
        }).catch(() => caches.match(url.pathname)));
});
