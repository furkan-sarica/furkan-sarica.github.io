const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const kripto = require('node:crypto');
const { expect } = require('@playwright/test');
const hash = veri => kripto.createHash('sha256').update(veri).digest('hex');
const surum = fs.readFileSync('sw.js', 'utf8').match(/const CACHE_NAME = '([^']+)'/)[1];
const assetler = [...fs.readFileSync('sw.js', 'utf8').match(/ASSETS_TO_CACHE = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].map(eslesme => eslesme[1]);
const scriptler = assetler.filter(yol => yol.startsWith('/js/'));

async function pwaSunucusu(context, page, eskiPwa) {
    const durum = { guncel: !eskiPwa, bozukYol: null, istekler: [], gezinmeler: [], hatalar: [], workerDurumlari: [], yanitlar: [] };
    // Routing HTTP cache'i kapatır: bu suite hiçbir route/fulfill kullanmaz.
    await context.addInitScript(() => {
        const gercekFetch = window.fetch.bind(window);
        window.fetch = (girdi, ayarlar) => {
            const url = new URL(typeof girdi === 'string' ? girdi : girdi.url, location.href);
            if (url.hostname === 'api.github.com') return Promise.resolve(new Response(JSON.stringify({ commit: { author: { date: '2026-10-02T00:00:00Z' } } })));
            return gercekFetch(girdi, ayarlar);
        };
        navigator.serviceWorker.ready.then(kayit => kayit.addEventListener('updatefound', () => {
            const worker = kayit.installing;
            worker.addEventListener('statechange', () => window.workerDurumuBildir(worker.state).catch(() => {}));
        }));
    });
    await context.exposeBinding('workerDurumuBildir', (_, durumAdi) => durum.workerDurumlari.push(durumAdi));
    page.on('framenavigated', cerceve => { if (cerceve === page.mainFrame()) durum.gezinmeler.push(cerceve.url()); });
    page.on('pageerror', hata => durum.hatalar.push(hata.message));
    page.on('console', kayit => { if (kayit.type() === 'error') durum.hatalar.push(kayit.text()); });
    page.on('response', yanit => durum.yanitlar.push(yanit));
    const html = fs.readFileSync('index.html', 'utf8')
        .replace(/https:\/\/fonts\.googleapis\.com\/[^"']+/g, '/test-sunum.css')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/[^"']+/g, '/test-sunum.css');
    const sunucu = http.createServer((istek, yanit) => {
        const yol = new URL(istek.url, 'http://localhost').pathname;
        durum.istekler.push({ yol, cache: istek.headers['cache-control'], belge: istek.headers['sec-fetch-dest'] === 'document' });
        if (yol === durum.bozukYol) { yanit.writeHead(503); return yanit.end(); }
        let govde;
        if (yol === '/sw.js') govde = durum.guncel ? fs.readFileSync('sw.js')
            : fs.readFileSync('tests/fixtures/legacy-v23-sw.js', 'utf8').replace('ASSETS_TO_CACHE = []', `ASSETS_TO_CACHE = ${JSON.stringify(assetler)}`);
        else if (yol === '/' || yol === '/index.html') govde = html;
        else if (yol === '/js/pwa.js' && !durum.guncel) govde = fs.readFileSync(eskiPwa);
        else if (yol === '/test-sunum.css') govde = '';
        else {
            const dosya = path.resolve('.' + yol);
            if (!dosya.startsWith(process.cwd() + path.sep) || !fs.existsSync(dosya)) { yanit.writeHead(404); return yanit.end(); }
            govde = fs.readFileSync(dosya);
        }
        const uzanti = yol === '/' ? '.html' : path.extname(yol);
        const tip = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' }[uzanti] || 'application/octet-stream';
        yanit.writeHead(200, { 'Content-Type': tip, 'Cache-Control': yol === '/sw.js' ? 'no-cache' : 'max-age=600' });
        yanit.end(govde);
    });
    await new Promise(resolve => sunucu.listen(0, '127.0.0.1', resolve));
    durum.adres = `http://127.0.0.1:${sunucu.address().port}`;
    durum.kapat = async () => { await page.close(); sunucu.closeAllConnections(); await new Promise(resolve => sunucu.close(resolve)); };
    return durum;
}
async function sayfaHazir(page) {
    await expect(page.locator('#boot-screen')).toBeHidden();
    await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await page.waitForLoadState('networkidle');
}
async function cacheHashleri(page, cacheAdi = surum) {
    return page.evaluate(async ({cacheAdi, yollar}) => {
        const onbellek = await caches.open(cacheAdi), hashler = {};
        for (const yol of yollar) {
            const yanit = await onbellek.match(yol);
            if (!yanit) { hashler[yol] = null; continue; }
            hashler[yol] = [...new Uint8Array(await crypto.subtle.digest('SHA-256', await yanit.arrayBuffer()))].map(x => x.toString(16).padStart(2, '0')).join('');
        }
        return hashler;
    }, {cacheAdi, yollar: ['/style.css', ...scriptler]});
}
async function cacheGuncel(page) {
    const hashler = await cacheHashleri(page);
    expect(scriptler).toHaveLength(24);
    for (const [yol, deger] of Object.entries(hashler)) expect(deger, yol).toBe(hash(fs.readFileSync('.' + yol)));
}
async function offlineDogrula(context, page, durum) {
    const baslangic = durum.yanitlar.length;
    await context.setOffline(true);
    const yanit = await page.reload({waitUntil: 'domcontentloaded'});
    expect(yanit.ok() && yanit.fromServiceWorker()).toBe(true);
    await expect(page.locator('#boot-screen')).toBeHidden();
    await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
    const offline = durum.yanitlar.slice(baslangic);
    for (const yol of ['/style.css', ...scriptler]) {
        const yanit = offline.find(yanit => new URL(yanit.url()).pathname === yol);
        expect(yanit?.ok() && yanit.fromServiceWorker(), yol).toBe(true);
        expect(hash(await yanit.body()), yol).toBe(hash(fs.readFileSync('.' + yol)));
    }
    await expect(page.locator('#backToTop')).toHaveCSS('width', '24px');
    await page.locator('#cli-input').fill('whoami'); await page.locator('#cli-input').press('Enter');
    await expect(page.locator('#cli-output')).toContainText('Role: AI Solutions Engineer');
    await page.locator('#ai-chat-btn').click();
    await page.locator('#ai-term-input').fill('Furkan kimdir'); await page.locator('#ai-term-input').press('Enter');
    await expect(page.locator('#ai-term-history')).toContainText('OFFLINE ENGINE ACTIVE');
    await page.keyboard.press('Escape');
    await cacheGuncel(page); expect(durum.hatalar).toEqual([]);
}
module.exports = {pwaSunucusu, sayfaHazir, cacheHashleri, cacheGuncel, offlineDogrula, hash, surum, scriptler};
