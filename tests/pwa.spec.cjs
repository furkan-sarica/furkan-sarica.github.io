const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const http = require('node:http');
const { hazirla } = require('./helpers/site.cjs');

test('gerçek SW yeni assetleri precache eder ve warmed-cache offline reload çalışır', async ({ page, context, baseURL }) => {
    let gezinmeSayisi = 0;
    page.on('framenavigated', cerceve => { if (cerceve === page.mainFrame()) gezinmeSayisi++; });
    // Önce eski bir cache oluşturulur; yeni worker activate temizliğini de doğrular.
    await page.goto('/manifest.json');
    await page.evaluate(async () => { const eski = await caches.open('furkan-portfolio-v21'); await eski.put('/eski-surum', new Response('eski')); });
    const hatalar = await hazirla(page, context, baseURL);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    expect(gezinmeSayisi).toBe(2); // Manifest + ilk sayfa; ilk claim ekstra reload yapmaz.
    const surum = fs.readFileSync('sw.js', 'utf8').match(/const CACHE_NAME = '([^']+)'/)[1];
    const scriptler = await page.locator('script[src]').evaluateAll(els => els.map(el => new URL(el.src).pathname));
    expect(scriptler).toHaveLength(24);
    expect(new Set(scriptler).size).toBe(scriptler.length);
    await expect.poll(() => page.evaluate(async ({ surum, scriptler }) => {
        const cache = await caches.open(surum);
        return (await Promise.all(['/index.html', '/style.css', ...scriptler].map(src => cache.match(src)))).every(Boolean);
    }, { surum, scriptler })).toBe(true);
    expect(await page.evaluate(() => caches.keys())).not.toContain('furkan-portfolio-v21');
    // Aynı worker sürümünde eski CSS cache'i de online network yanıtıyla yenilenmeli.
    await page.evaluate(async surum => {
        const cache = await caches.open(surum);
        await cache.put('/style.css', new Response('body { --eski-css: 1; }', { headers: { 'Content-Type': 'text/css' } }));
    }, surum);
    await page.reload(); await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
    expect(gezinmeSayisi).toBe(3);
    const guncelCss = fs.readFileSync('style.css', 'utf8');
    await expect.poll(() => page.evaluate(async surum => {
        const cache = await caches.open(surum);
        return (await cache.match('/style.css')).text();
    }, surum)).toBe(guncelCss);
    const disStiller = await page.locator('link[rel=stylesheet]').evaluateAll(els => els.map(el => el.href).filter(src => new URL(src).origin !== location.origin));
    await expect.poll(() => page.evaluate(async ({ surum, disStiller }) => {
        const cache = await caches.open(surum);
        return (await Promise.all(disStiller.map(src => cache.match(src)))).every(Boolean);
    }, { surum, disStiller })).toBe(true);
    const cacheYanitlari = new Set();
    page.on('response', yanit => { if (yanit.fromServiceWorker()) cacheYanitlari.add(new URL(yanit.url()).pathname); });
    await context.setOffline(true);
    // Fulfill mock'ları offline ağı taklit etmesin: her gerçek ağ girişimi fail olur.
    await context.unroute('**/*');
    await context.route('**/*', rota => rota.abort('internetdisconnected'));
    const yanit = await page.reload({ waitUntil: 'domcontentloaded' });
    expect(yanit.fromServiceWorker()).toBe(true); expect(yanit.ok()).toBe(true);
    await expect(page.locator('#boot-screen')).toBeHidden();
    await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
    for (const src of ['/style.css', ...scriptler]) expect(cacheYanitlari.has(src), src).toBe(true);
    await page.locator('#ai-chat-btn').click();
    await page.locator('#ai-term-input').fill('Furkan kimdir');
    await page.locator('#ai-term-input').press('Enter');
    await expect(page.locator('#ai-term-history')).toContainText('OFFLINE ENGINE ACTIVE');
    await expect(page.locator('#ai-term-history')).toContainText('Furkan');
    await page.keyboard.press('Escape');
    expect(hatalar).toEqual([]);
});

test('gerçek v22 controller v23 tarafından devralınır, tek reload ve güncel offline CSS korunur', async ({ page, context, baseURL }) => {
    const guncelCss = fs.readFileSync('style.css', 'utf8');
    const eskiCss = guncelCss + '\n/* Legacy v22 CSS kanıtı */\n.back-to-top { width: 86px !important; right: 32px !important; }';
    let eskiYayin = true;
    let eskiStilYayini = true;
    // SW script istekleri page.route ile taklit edilmez: tarayıcı gerçek HTTP origin'den kurar/günceller.
    const sunucu = http.createServer((istek, yanit) => {
        const yol = new URL(istek.url, 'http://localhost').pathname;
        if (yol === '/sw.js' || yol === '/style.css') {
            const govde = yol === '/sw.js'
                ? fs.readFileSync(eskiYayin ? 'tests/fixtures/legacy-v22-sw.js' : 'sw.js', 'utf8')
                : eskiStilYayini ? eskiCss : guncelCss;
            yanit.writeHead(200, { 'Content-Type': yol === '/sw.js' ? 'application/javascript' : 'text/css', 'Cache-Control': 'no-cache' });
            return yanit.end(govde);
        }
        http.get(new URL(istek.url, baseURL), kaynak => {
            yanit.writeHead(kaynak.statusCode, kaynak.headers);
            kaynak.pipe(yanit);
        }).on('error', () => { yanit.writeHead(502); yanit.end(); });
    });
    await new Promise(resolve => sunucu.listen(0, '127.0.0.1', resolve));
    const adres = `http://127.0.0.1:${sunucu.address().port}`;
    const hatalar = [], gezinmeler = [], cssYanitlari = [];
    page.on('pageerror', hata => hatalar.push(hata.message));
    page.on('console', kayit => { if (kayit.type() === 'error') hatalar.push(kayit.text()); });
    page.on('framenavigated', cerceve => { if (cerceve === page.mainFrame()) gezinmeler.push(cerceve.url()); });
    page.on('response', yanit => { if (new URL(yanit.url()).pathname === '/style.css') cssYanitlari.push(yanit); });
    await context.route('**/*', rota => {
        const url = new URL(rota.request().url());
        if (url.origin === adres) return rota.continue();
        if (url.hostname === 'api.github.com') return rota.fulfill({ json: { commit: { author: { date: '2026-10-02T00:00:00Z' } } } });
        if (['fonts.googleapis.com', 'cdn.jsdelivr.net'].includes(url.hostname)) return rota.fulfill({ contentType: 'text/css', body: '' });
        hatalar.push('Beklenmedik dış istek: ' + url.origin);
        return rota.fulfill({ status: 503, body: '' });
    });
    try {
        await page.goto(adres);
        await expect(page.locator('#boot-screen')).toBeHidden();
        await page.evaluate(() => navigator.serviceWorker.ready);
        await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
        expect(await context.serviceWorkers()[0].evaluate(() => CACHE_NAME)).toBe('furkan-portfolio-v22');
        expect(await page.evaluate(async () => (await (await caches.open('furkan-portfolio-v22')).match('/style.css')).text())).toBe(eskiCss);
        await expect(page.locator('#backToTop')).toHaveCSS('width', '86px');
        expect(gezinmeler).toHaveLength(1);

        // Sunucuda CSS güncellense bile mevcut v22 controller reload'da eski CSS'i döndürür.
        eskiStilYayini = false;
        await page.reload();
        await expect(page.locator('#boot-screen')).toBeHidden();
        expect(cssYanitlari.at(-1).fromServiceWorker()).toBe(true);
        expect(await cssYanitlari.at(-1).text()).toBe(eskiCss);
        await expect(page.locator('#backToTop')).toHaveCSS('width', '86px');
        expect(gezinmeler).toHaveLength(2);

        const yeniWorkerBeklentisi = context.waitForEvent('serviceworker');
        const reloadBeklentisi = page.waitForEvent('load');
        eskiYayin = false;
        await page.evaluate(async () => { const kayit = await navigator.serviceWorker.getRegistration(); kayit.update(); });
        const yeniWorker = await yeniWorkerBeklentisi;
        await reloadBeklentisi;
        await expect(page.locator('#boot-screen')).toBeHidden();
        await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
        expect(await yeniWorker.evaluate(() => CACHE_NAME)).toBe('furkan-portfolio-v23');
        expect(await page.evaluate(async () => {
            const kayit = await navigator.serviceWorker.getRegistration();
            return kayit.active.state === 'activated' && kayit.active === navigator.serviceWorker.controller;
        })).toBe(true);
        expect(await page.evaluate(() => caches.keys())).toEqual(['furkan-portfolio-v23']);
        expect(gezinmeler).toHaveLength(3); // Takeover yalnız bir kez coherent reload yapar.
        await expect(page.locator('#backToTop')).toHaveCSS('width', '24px');
        await expect(page.locator('#backToTop')).toHaveCSS('right', '0px');
        expect(await cssYanitlari.at(-1).text()).toBe(guncelCss);
        expect(await page.evaluate(async () => (await (await caches.open('furkan-portfolio-v23')).match('/style.css')).text())).toBe(guncelCss);

        const scriptler = await page.locator('script[src]').evaluateAll(els => els.map(el => new URL(el.src).pathname));
        expect(scriptler).toHaveLength(24);
        expect(await page.evaluate(async scriptler => {
            const cache = await caches.open('furkan-portfolio-v23');
            return (await Promise.all(scriptler.map(src => cache.match(src)))).every(Boolean);
        }, scriptler)).toBe(true);
        const disStiller = await page.locator('link[rel=stylesheet]').evaluateAll(els => els.map(el => el.href).filter(src => new URL(src).origin !== location.origin));
        await expect.poll(() => page.evaluate(async disStiller => {
            const cache = await caches.open('furkan-portfolio-v23');
            return (await Promise.all(disStiller.map(src => cache.match(src)))).every(Boolean);
        }, disStiller)).toBe(true);
        await page.evaluate(() => scrollTo({ top: 750, behavior: 'instant' }));
        await expect(page.locator('#backToTop')).toHaveClass(/visible/);
        await page.locator('#backToTop').click();
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
        expect(gezinmeler).toHaveLength(3);

        await context.setOffline(true);
        await context.unroute('**/*');
        await context.route('**/*', rota => rota.abort('internetdisconnected'));
        const offlineJs = new Set();
        page.on('response', yanit => { const yol = new URL(yanit.url()).pathname; if (yol.startsWith('/js/') && yanit.ok() && yanit.fromServiceWorker()) offlineJs.add(yol); });
        const offlineYanit = await page.reload({ waitUntil: 'domcontentloaded' });
        expect(offlineYanit.ok() && offlineYanit.fromServiceWorker()).toBe(true);
        await expect(page.locator('#boot-screen')).toBeHidden();
        await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
        expect(cssYanitlari.at(-1).fromServiceWorker()).toBe(true);
        expect(await cssYanitlari.at(-1).text()).toBe(guncelCss);
        await expect(page.locator('#backToTop')).toHaveCSS('width', '24px');
        expect(offlineJs.size).toBe(24);
        expect(gezinmeler).toHaveLength(4); // Yalnız testin istediği offline reload; loop yok.
        expect(hatalar).toEqual([]);
    } finally {
        await page.close();
        sunucu.closeAllConnections();
        await new Promise(resolve => sunucu.close(resolve));
    }
});
