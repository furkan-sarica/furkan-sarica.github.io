const { expect } = require('@playwright/test');
async function hazirla(page, context, baseURL) {
    const hatalar = [], koken = new URL(baseURL).origin;
    page.on('pageerror', hata => hatalar.push(hata.message));
    page.on('console', kayit => { if (kayit.type() === 'error') hatalar.push(kayit.text()); });
    await context.route('**/*', rota => {
        const adres = new URL(rota.request().url());
        if (adres.origin === koken) return rota.continue();
        if (adres.hostname === 'api.github.com') return rota.fulfill({ json: { commit: { author: { date: '2026-10-02T00:00:00Z' } } } });
        if (['fonts.googleapis.com', 'cdn.jsdelivr.net'].includes(adres.hostname)) return rota.fulfill({ contentType: 'text/css', body: '' });
        hatalar.push('Beklenmedik dış istek: ' + adres.origin + adres.pathname);
        return rota.fulfill({ status: 503, body: '' });
    });
    await page.goto('/');
    await expect(page.locator('#boot-screen')).toBeHidden();
    await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
    return hatalar;
}
module.exports = { hazirla };
