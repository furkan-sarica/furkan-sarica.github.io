const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const { hazirla } = require('./helpers/site.cjs');

test('gerçek SW yeni assetleri precache eder ve warmed-cache offline reload çalışır', async ({ page, context, baseURL }) => {
    // Önce eski bir cache oluşturulur; yeni worker activate temizliğini de doğrular.
    await page.goto('/manifest.json');
    await page.evaluate(async () => { const eski = await caches.open('furkan-portfolio-v21'); await eski.put('/eski-surum', new Response('eski')); });
    const hatalar = await hazirla(page, context, baseURL);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    const surum = fs.readFileSync('sw.js', 'utf8').match(/const CACHE_NAME = '([^']+)'/)[1];
    const scriptler = await page.locator('script[src]').evaluateAll(els => els.map(el => new URL(el.src).pathname));
    expect(new Set(scriptler).size).toBe(scriptler.length);
    await expect.poll(() => page.evaluate(async ({ surum, scriptler }) => {
        const cache = await caches.open(surum);
        return (await Promise.all(['/index.html', '/style.css', ...scriptler].map(src => cache.match(src)))).every(Boolean);
    }, { surum, scriptler })).toBe(true);
    expect(await page.evaluate(() => caches.keys())).not.toContain('furkan-portfolio-v21');
    await page.reload(); await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
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
