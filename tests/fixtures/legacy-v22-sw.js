// Yalnız migration testi: v22'nin CSS cache-first ve claim davranışını yeniden üretir.
const CACHE_NAME = 'furkan-portfolio-v22';
self.addEventListener('install', olay => {
    olay.waitUntil(caches.open(CACHE_NAME).then(onbellek => onbellek.add('/style.css')).then(() => self.skipWaiting()));
});
self.addEventListener('activate', olay => {
    olay.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', olay => {
    if (new URL(olay.request.url).pathname === '/style.css') {
        olay.respondWith(caches.match(olay.request, { ignoreSearch: true }).then(kayit => kayit || fetch(olay.request)));
    }
});
