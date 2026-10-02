const {test, expect} = require('@playwright/test');
const fs = require('node:fs');
const {pwaSunucusu, sayfaHazir, cacheHashleri, cacheGuncel, offlineDogrula, hash, surum} = require('./helpers/pwa.cjs');

test('fresh PWA: ilk claim reload yapmaz, current app-shell aynı sürümde yenilenir ve offline çalışır', async ({page, context}) => {
    const durum = await pwaSunucusu(context, page);
    try {
        await page.goto(durum.adres); await sayfaHazir(page);
        expect(durum.gezinmeler).toHaveLength(1);
        expect(await page.evaluate(() => caches.keys())).toEqual([surum]);
        await cacheGuncel(page);
        expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).updateViaCache)).toBe('none');
        const istekOnce = durum.istekler.length;
        await page.evaluate(async surum => {
            const cache = await caches.open(surum);
            await cache.put('/style.css', new Response('body { --eski-css: 1 }'));
            await cache.put('/js/pwa.js', new Response('window.eskiPwa = true;'));
        }, surum);
        await page.reload(); await sayfaHazir(page); expect(durum.gezinmeler).toHaveLength(2);
        await cacheGuncel(page);
        for (const yol of ['/style.css', '/js/pwa.js']) {
            expect(durum.istekler.slice(istekOnce).some(istek => istek.yol === yol && /no-cache|max-age=0/.test(istek.cache)), yol).toBe(true);
        }
        expect(await page.evaluate(() => window.eskiPwa)).toBeUndefined();
        await expect(page.locator('#backToTop')).toHaveCSS('width', '24px');
        await offlineDogrula(context, page, durum); expect(durum.gezinmeler).toHaveLength(3);
    } finally { await durum.kapat(); }
});

for (const [ad, fixture] of [
    ['stale eski pwa.js handler yok', 'tests/fixtures/legacy-pwa.js'],
    ['current v23 pwa.js handler var', 'tests/fixtures/v23-pwa.js']
]) test(`${ad}: gerçek HTTP cache ile v23 → v24 tek navigation`, async ({page, context}) => {
    const durum = await pwaSunucusu(context, page, fixture);
    try {
        await page.goto(durum.adres); await sayfaHazir(page);
        await page.reload(); await sayfaHazir(page);
        const onceki = await cacheHashleri(page, 'furkan-portfolio-v23');
        expect(onceki['/style.css']).toBe(hash(fs.readFileSync('style.css')));
        expect(onceki['/js/pwa.js']).toBe(hash(fs.readFileSync(fixture)));
        const eskiWorker = context.serviceWorkers()[0];
        expect(await eskiWorker.evaluate(() => CACHE_NAME)).toBe('furkan-portfolio-v23');
        durum.guncel = true;
        // max-age=600 halen geçerli: normal v23 fetch eski bootstrap'ı döndürür.
        expect(await page.evaluate(() => fetch('/js/pwa.js').then(yanit => yanit.text()))).toBe(fs.readFileSync(fixture, 'utf8'));
        const gezinmeOnce = durum.gezinmeler.length;
        const gezinmeBeklentisi = page.waitForEvent('framenavigated', {predicate: cerceve => cerceve === page.mainFrame()});
        const yeniWorkerBeklentisi = context.waitForEvent('serviceworker');
        await page.evaluate(async () => { (await navigator.serviceWorker.getRegistration()).update(); });
        const yeniWorker = await yeniWorkerBeklentisi;
        await gezinmeBeklentisi; await sayfaHazir(page);
        expect(await yeniWorker.evaluate(() => CACHE_NAME)).toBe(surum);
        expect(await page.evaluate(async () => {
            const kayit = await navigator.serviceWorker.getRegistration();
            return kayit.active.state === 'activated' && kayit.active === navigator.serviceWorker.controller;
        })).toBe(true);
        expect(await page.evaluate(() => caches.keys())).toEqual([surum]);
        expect(durum.gezinmeler.length - gezinmeOnce).toBe(1);
        await cacheGuncel(page);
        // Cache kadar yeni document'in yüklediği JS/CSS içerikleri de current olmalı.
        const sonYanitlar = durum.yanitlar.filter(yanit => new URL(yanit.url()).pathname === '/js/pwa.js');
        expect(hash(await sonYanitlar.at(-1).body())).toBe(hash(fs.readFileSync('js/pwa.js')));
        await expect(page.locator('#backToTop')).toHaveCSS('width', '24px');
        await expect(page.locator('#backToTop')).toHaveCSS('right', '0px');
        await page.evaluate(() => scrollTo({top:750,behavior:'instant'}));
        await expect(page.locator('#backToTop')).toHaveClass(/visible/);
        await page.locator('#backToTop').click(); await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
        expect(durum.gezinmeler.length - gezinmeOnce).toBe(1);
        await offlineDogrula(context, page, durum);
        expect(durum.gezinmeler.length - gezinmeOnce).toBe(2);
    } finally { await durum.kapat(); }
});

test('yarım install eski v23 worker ve cache bırakır; başarısız v24 yayın aktifleşmez', async ({page, context}) => {
    const durum = await pwaSunucusu(context, page, 'tests/fixtures/legacy-pwa.js');
    try {
        await page.goto(durum.adres); await sayfaHazir(page);
        const onceki = await cacheHashleri(page, 'furkan-portfolio-v23');
        const gezinmeOnce = durum.gezinmeler.length;
        durum.guncel = true; durum.bozukYol = '/js/boot.js';
        await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration()).update(); });
        await expect.poll(() => durum.workerDurumlari).toContain('redundant');
        expect(await context.serviceWorkers()[0].evaluate(() => CACHE_NAME)).toBe('furkan-portfolio-v23');
        expect(await page.evaluate(() => caches.keys())).toEqual(['furkan-portfolio-v23']);
        expect(await cacheHashleri(page, 'furkan-portfolio-v23')).toEqual(onceki);
        expect(durum.gezinmeler.length).toBe(gezinmeOnce);
        expect(durum.hatalar).toEqual([]);
    } finally { await durum.kapat(); }
});
