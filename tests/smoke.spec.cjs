const { test, expect } = require('@playwright/test');

test('açılış ve mevcut kontroller hatasız çalışır', async ({ page, context, baseURL }) => {
    const hatalar = [];
    page.on('pageerror', hata => hatalar.push(`pageerror: ${hata.message}`));
    page.on('console', kayit => {
        if (kayit.type() === 'error') hatalar.push(`console: ${kayit.text()}`);
    });
    const siteKokeni = new URL(baseURL).origin;
    await context.route('**/*', async rota => {
        const istek = rota.request();
        const adres = new URL(istek.url());
        if (adres.origin === siteKokeni) return rota.continue();
        if (adres.href === 'https://api.github.com/repos/furkan-sarica/furkan-sarica.github.io/commits/main') {
            return rota.fulfill({ json: { commit: { author: { date: '2026-10-01T00:00:00Z' } } } });
        }
        if (['fonts.googleapis.com', 'cdn.jsdelivr.net'].includes(adres.hostname) && istek.resourceType() === 'stylesheet') {
            return rota.fulfill({ contentType: 'text/css', body: '' });
        }
        // Beklenmedik dış istek fail olur; AI inference dahil hiçbir API'ye gönderilmez.
        hatalar.push(`Beklenmedik dış istek: ${adres.origin}${adres.pathname}`);
        return rota.fulfill({ status: 503, body: '' });
    });

    await test.step('HTTP, boot ve hero', async () => {
        const yanit = await page.goto('/', { waitUntil: 'domcontentloaded' });
        expect(yanit.ok()).toBeTruthy();
        await expect(page).toHaveTitle('Furkan SARICA | AI Solutions Engineer');
        await expect(page.locator('#boot-screen')).toBeHidden();
        await expect(page.locator('.hero')).toBeVisible();
        await expect(page.locator('.hero h1')).toHaveText('Furkan SARICA█');
        await expect(page.locator('.hero h1')).toBeInViewport();
        await expect(page.locator('#boot-log')).toContainText('System ready. Welcome, furkan.');
        // Çift boot çağrısı ve kaybolan HTML/global handler sözleşmesini yakala.
        expect((await page.locator('#boot-log').textContent()).trim().split('\n')).toHaveLength(9);
        expect(await page.evaluate(() => [
            'toggleLang', 'runBootSequence', 'executeCliCmd', 'runCliQuick',
            'startMatrixRain', 'stopMatrixRain', 'openCertModal', 'navCert',
            'closeCertModal', 'toggleCertZoom', 'toggleCertFullscreen', 'copyCurlCmd'
        ].every(ad => typeof window[ad] === 'function'))).toBeTruthy();
        expect(hatalar).toEqual([]);
    });

    await test.step('TR/EN ve ses', async () => {
        await page.locator('#lang-toggle-btn').click();
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.locator('#lang-en-btn')).toHaveClass(/active/);
        await page.locator('#lang-toggle-btn').click();
        await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
        await page.locator('#mute-btn').click();
        await expect(page.locator('#mute-btn')).toHaveText('🔊');
        await page.locator('#mute-btn').click();
        await expect(page.locator('#mute-btn')).toHaveText('🔇');
    });

    await test.step('ai.sh açılır ve kapanır', async () => {
        await page.locator('#ai-chat-btn').click();
        await expect(page.locator('#ai-chat-overlay')).toHaveAttribute('aria-hidden', 'false');
        await expect(page.locator('#ai-chat-overlay')).toBeVisible();
        await page.locator('#ai-term-input').fill('korunan state');
        await page.locator('#ai-chat-overlay .t-btn-red').click();
        await expect(page.locator('#ai-chat-overlay')).toHaveAttribute('aria-hidden', 'true');
        await expect(page.locator('#ai-chat-overlay')).toBeHidden();
        // Tek keyboard handler bir basışta açmalı, diğerinde kapatmalı.
        await page.keyboard.press('Control+k');
        await expect(page.locator('#ai-chat-overlay')).toBeVisible();
        await expect(page.locator('#ai-term-input')).toHaveValue('korunan state');
        await page.keyboard.press('Control+k');
        await expect(page.locator('#ai-chat-overlay')).toBeHidden();
    });

    await test.step('scroll ve back-to-top', async () => {
        await expect(page.locator('#backToTop')).not.toHaveClass(/visible/);
        await page.evaluate(() => window.scrollTo(0, 750));
        await expect(page.locator('#backToTop')).toHaveClass(/visible/);
        await expect(page.locator('#backToTop')).toBeVisible();
        await page.locator('#backToTop').click();
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
        await expect(page.locator('#backToTop')).not.toHaveClass(/visible/);
    });
    await test.step('sertifika keyboard handler ve kayıtlı dil tercihi', async () => {
        await page.locator('.cert-view-btn').first().click();
        await expect(page.locator('#cert-modal')).toHaveClass(/active/);
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#cert-modal-counter')).toHaveText('2 / 10');
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator('#cert-modal-counter')).toHaveText('1 / 10');
        await page.keyboard.press('Escape');
        await expect(page.locator('#cert-modal')).not.toHaveClass(/active/);
        await page.locator('#lang-toggle-btn').click();
        expect(await page.evaluate(() => localStorage.getItem('preferredLang'))).toBe('en');
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(page.locator('#boot-screen')).toBeHidden();
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.locator('#lang-en-btn')).toHaveClass(/active/);
    });
    expect(hatalar).toEqual([]);
});
