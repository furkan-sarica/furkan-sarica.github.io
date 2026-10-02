const { test, expect } = require('@playwright/test');
const { hazirla } = require('./helpers/site.cjs');

test('responsive kontroller ve floating pencereler taşmaz', async ({ page, context, baseURL }) => {
    // On viewport ve pencere geçişi Linux WebKit'te tek viewport smoke süresini aşabilir.
    test.setTimeout(45000);
    const hatalar = await hazirla(page, context, baseURL);
    for (const genislik of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
        await page.setViewportSize({ width: genislik, height: 900 });
        await page.evaluate(() => scrollTo(0, 0));
        await expect.poll(() => page.evaluate(() => {
            const bar = document.querySelector('.top-bar-controls').getBoundingClientRect();
            const hero = document.querySelector('.hero-prompt').getBoundingClientRect();
            return bar.left < hero.right && bar.right > hero.left && bar.top < hero.bottom && bar.bottom > hero.top;
        })).toBe(false);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.locator('#ai-chat-btn').click();
        await expect(page.locator('#ai-term-input')).toBeInViewport();
        expect(await page.locator('.ai-terminal-window').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
        await page.locator('#ai-term-input').fill('uzun input '.repeat(50));
        await page.locator('#ai-chat-overlay .t-btn-red').click();
        // Header close sonrası tekrar açılabilmeli; iki pencere yöneticisi aynı AI window'u yönetmez.
        await page.locator('#ai-chat-btn').click();
        await expect(page.locator('.ai-terminal-window')).toBeVisible();
        await page.keyboard.press('Escape');
    }
    // Landscape ve 200% zoom karşılığı 1440 → 720 CSS px reflow.
    for (const boyut of [{ width: 844, height: 390 }, { width: 720, height: 450 }]) {
        await page.setViewportSize(boyut); await page.locator('#ai-chat-btn').click();
        await expect(page.locator('#ai-term-input')).toBeInViewport();
        await page.keyboard.press('Escape'); await page.evaluate(() => openCertModal('certs/stanford-ai.jpg'));
        await expect(page.locator('.cert-modal-close-btn')).toBeInViewport();
        await page.keyboard.press('Escape');
    }
    expect(hatalar).toEqual([]);
});

test('dialog focus, minimize/restore ve dil/ses erişilebilir state korunur', async ({ page, context, baseURL }) => {
    const hatalar = await hazirla(page, context, baseURL);
    await page.locator('#ai-chat-btn').click();
    await expect(page.locator('#ai-term-input')).toBeFocused();
    await expect(page.locator('#ai-chat-btn')).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#ai-chat-overlay .t-btn-red').focus(); await page.keyboard.press('Shift+Tab');
    await expect(page.locator('.ai-term-enter-btn')).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.locator('#ai-chat-overlay .t-btn-red')).toBeFocused();
    await page.locator('#ai-chat-overlay .t-btn-yellow').click();
    await expect(page.locator('#ai-chat-overlay')).toHaveClass(/is-minimized/);
    await expect(page.locator('#ai-chat-overlay')).toHaveAttribute('aria-modal', 'false');
    await expect(page.locator('#ai-chat-btn')).toBeFocused();
    await page.evaluate(() => scrollTo(0, 750));
    await expect(page.locator('#backToTop')).toHaveClass(/visible/);
    await expect.poll(() => page.evaluate(() => {
        const a = document.querySelector('#backToTop').getBoundingClientRect(), b = document.querySelector('.ai-terminal-window').getBoundingClientRect();
        return a.bottom <= b.top || a.right <= b.left;
    })).toBe(true);
    await page.locator('#ai-chat-overlay .t-btn-yellow').click();
    await expect(page.locator('#ai-term-input')).toBeFocused();
    await page.locator('#ai-chat-overlay .t-btn-green').click();
    await expect(page.locator('.ai-terminal-window')).toHaveClass(/is-maximized/);
    await page.keyboard.press('Escape'); await expect(page.locator('#ai-chat-btn')).toBeFocused();
    await expect(page.locator('#ai-chat-btn')).toHaveAttribute('aria-expanded', 'false');
    await page.locator('.cert-view-btn').first().click();
    await expect(page.locator('#cert-modal .t-btn-red')).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(page.locator('#cert-modal-download')).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.locator('#cert-modal .t-btn-red')).toBeFocused();
    await page.keyboard.press('ArrowRight'); await expect(page.locator('#cert-modal-counter')).toHaveText('2 / 10');
    await page.keyboard.press('Escape'); await expect(page.locator('.cert-view-btn').first()).toBeFocused();
    await expect(page.locator('#cert-modal')).toHaveAttribute('aria-hidden', 'true');
    await page.locator('#mute-btn').click(); await expect(page.locator('#mute-btn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#lang-toggle-btn').click(); await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-lang-en]').first()).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('[data-lang-tr]').first()).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('#mute-btn')).toHaveAttribute('aria-pressed', 'false'); // Baseline: ses load'da kapalıdır.
    expect(hatalar).toEqual([]);
});

test('terminal history, vim, matrix, window controls ve Fail2Ban tek kez çalışır', async ({ page, context, baseURL }) => {
    const hatalar = await hazirla(page, context, baseURL);
    await page.locator('#cli-input').scrollIntoViewIfNeeded();
    for (const komut of ['whoami', 'pwd', 'ls', 'cd /etc', 'cat hosts', 'cd ~', 'coffee']) await page.evaluate(komut => executeCliCmd(komut), komut);
    await expect(page.locator('#cli-output')).toContainText('furkan');
    await page.locator('#cli-input').press('ArrowUp'); await expect(page.locator('#cli-input')).toHaveValue('coffee');
    await page.locator('#cli-input').press('ArrowUp'); await expect(page.locator('#cli-input')).toHaveValue('cd ~');
    await page.locator('#cli-input').press('ArrowDown'); await expect(page.locator('#cli-input')).toHaveValue('coffee');
    await page.locator('#cli-input').fill('neo'); await page.locator('#cli-input').press('Tab');
    await expect(page.locator('#cli-input')).toHaveValue('neofetch');
    await page.evaluate(() => executeCliCmd('vim profile.md')); await expect(page.locator('#vim-overlay')).toHaveClass(/active/);
    await page.keyboard.type(':q'); await page.keyboard.press('Enter'); await expect(page.locator('#vim-overlay')).not.toHaveClass(/active/);
    await page.evaluate(() => executeCliCmd('cmatrix')); await expect(page.locator('#matrix-rain')).toHaveCount(1);
    await page.evaluate(() => executeCliCmd('cmatrix')); await expect(page.locator('#matrix-rain')).toHaveCount(0);
    const pencere = page.locator('#cli-terminal .terminal-window');
    await pencere.locator('.t-btn-yellow').click(); await expect(pencere).toHaveClass(/win-minimized/);
    await pencere.locator('.t-btn-yellow').click(); await expect(pencere).not.toHaveClass(/win-minimized/);
    await pencere.locator('.t-btn-green').click(); await expect(pencere).toHaveClass(/win-maximized/);
    await pencere.locator('.t-btn-green').click(); await expect(pencere).not.toHaveClass(/win-maximized/);
    await page.clock.install();
    for (let i = 0; i < 5; i++) await page.evaluate(() => executeCliCmd('gecersiz'));
    await expect(page.locator('#cli-input')).toBeDisabled(); await page.clock.runFor(11000);
    await expect(page.locator('#cli-input')).toBeEnabled();
    await expect(page.locator('#cli-output')).toContainText('Ban lifted');
    expect(await page.locator('#bg-logs').count()).toBe(0);
    expect(hatalar).toEqual([]);
});

test('azaltılmış hareket boot/typing bitirir, ağır efekt başlatmaz', async ({ page, context, baseURL }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const hatalar = await hazirla(page, context, baseURL);
    await page.evaluate(() => { runBootSequence(); PortfolioTerminal.baslat(); startMatrixRain(); });
    await expect(page.locator('#boot-log')).toContainText('System ready');
    expect((await page.locator('#boot-log').textContent()).trim().split('\n')).toHaveLength(9);
    await expect(page.locator('.typing')).toHaveText('Furkan SARICA');
    await expect(page.locator('#matrix-rain')).toHaveCount(0); await expect(page.locator('#crt-grain')).toHaveCount(0);
    expect(hatalar).toEqual([]);
});

test('AI transport ve local fallback input/history state korur; gerçek inference yoktur', async ({ page, context, baseURL }) => {
    const hatalar = await hazirla(page, context, baseURL);
    let istekSayisi = 0;
    await context.route('https://vitonom-ai.sarica-furkan.workers.dev/**', rota => {
        istekSayisi++;
        expect(rota.request().method()).toBe('POST');
        const mesajlar = rota.request().postDataJSON().messages;
        expect(mesajlar.at(-1).role).toBe('user');
        const veri = istekSayisi === 1
            ? 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'Türkçe yanıt <img src=x>' } }] }) + '\n\ndata: [DONE]\n\n'
            : 'data: [DONE]\n\n'; // Boş model response: mevcut yerel fallback'e geçmeli.
        return rota.fulfill({ contentType: 'text/event-stream', body: veri });
    });
    await page.locator('#ai-chat-btn').click();
    await page.locator('#ai-term-input').fill('SSE denemesi'); await page.locator('#ai-term-input').press('Enter');
    await expect(page.locator('#ai-term-history')).toContainText('Türkçe yanıt <img src=x>');
    await expect(page.locator('.ai-term-text img')).toHaveCount(0);
    expect(await page.evaluate(() => window._aiChatHistory.at(-1).content)).toBe('Türkçe yanıt <img src=x>');
    await page.locator('#ai-term-input').fill('Furkan kimdir'); await page.locator('#ai-term-input').press('Enter');
    await expect.poll(() => page.evaluate(() => window._aiChatHistory.at(-1).role)).toBe('assistant');
    await page.locator('#ai-term-input').fill('korunan taslak'); await page.keyboard.press('Escape');
    for (const kisayol of ['Control+k', 'Meta+k']) {
        await page.keyboard.press(kisayol); await expect(page.locator('#ai-term-input')).toHaveValue('korunan taslak');
        await expect(page.locator('#ai-term-history')).toContainText('Türkçe yanıt');
        await page.keyboard.press(kisayol); await expect(page.locator('#ai-chat-overlay')).toBeHidden();
    }
    expect(istekSayisi).toBe(2); expect(hatalar).toEqual([]);
});
