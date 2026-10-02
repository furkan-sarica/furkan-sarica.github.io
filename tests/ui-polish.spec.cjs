const { test, expect } = require('@playwright/test');
const { hazirla } = require('./helpers/site.cjs');

const sertifikaSirasi = [
    'stanford-ai', 'microsoft-ai-ml', 'aws-cloud-solutions-architect',
    'ibm-devops-software-engineering', 'ibm-isc2-cybersecurity',
    'akamai-network-engineering', 'nvidia-developer', 'vanderbilt-genai',
    'google-it-support', 'meta-ios-developer'
].map(ad => `certs/${ad}.jpg`);

test('proje ve sertifika önem sırası modal keyboard sırasıyla eşleşir', async ({ page, context, baseURL }) => {
    const hatalar = await hazirla(page, context, baseURL);
    await expect(page.locator('.project-title [data-lang-tr]')).toHaveText([
        'Tracefold: Gizlilik Odaklı Yerel RAG Asistanı',
        'AI Destekli SAP Business One Ajan Platformu',
        'AI Destekli Altyapı Yönetimi ve Homelab Otomasyonu',
        'Roadmind: Kodlama Ajanları İçin AI Prompt Stüdyosu',
        'ERPNext Self-Hosted Kurulum ve Operasyon Altyapısı',
        'AI Destekli Operasyonel CRM ve Karar Destek Platformu'
    ]);
    const kartSirasi = await page.locator('.cert-view-btn').evaluateAll(dugmeler =>
        dugmeler.map(dugme => dugme.getAttribute('onclick').match(/certs\/[^']+/)[0]));
    expect(kartSirasi).toEqual(sertifikaSirasi);
    await page.locator('.cert-view-btn').first().click();
    for (let i = 0; i < sertifikaSirasi.length; i++) {
        await expect(page.locator('#cert-modal-img')).toHaveAttribute('src', sertifikaSirasi[i]);
        await expect(page.locator('#cert-modal-counter')).toHaveText(`${i + 1} / 10`);
        await page.keyboard.press('ArrowRight');
    }
    await expect(page.locator('#cert-modal-img')).toHaveAttribute('src', sertifikaSirasi[0]);
    await page.keyboard.press('Escape');
    await expect(page.locator('.cert-view-btn').first()).toBeFocused();
    expect(hatalar).toEqual([]);
});

test('polish kartları TR/EN ve tüm hedef viewportlarda taşmaz', async ({ page, context, baseURL }) => {
    const hatalar = await hazirla(page, context, baseURL);
    const boyutlar = [320, 360, 375, 390, 430, 768, 1024, 1440].map(width => ({ width, height: 900 }));
    boyutlar.push({ width: 844, height: 390 }, { width: 720, height: 450 });
    for (const dil of ['tr', 'en']) {
        if (dil === 'en') await page.locator('#lang-toggle-btn').click();
        for (const boyut of boyutlar) {
            await page.setViewportSize(boyut);
            const olcum = await page.evaluate(() => ({
                kolon: getComputedStyle(document.querySelector('.contact-grid')).gridTemplateColumns.split(' ').length,
                tasan: [...document.querySelectorAll('.project-card,.cert-card,.exp-card,.edu-item,.tool-box,.contact-item')]
                    .filter(kart => kart.scrollWidth > kart.clientWidth + 1).map(kart => kart.className),
                sayfaTasma: document.documentElement.scrollWidth > innerWidth
            }));
            expect(olcum, `${dil} ${boyut.width}×${boyut.height}`).toEqual({
                kolon: boyut.width <= 360 ? 1 : boyut.width < 1024 ? 2 : 4,
                tasan: [], sayfaTasma: false
            });
        }
    }
    expect(hatalar).toEqual([]);
});

test('iletişim kopyalama ve AI boş alan yönlendirmesi mevcut davranışı korur', async ({ page, context, baseURL }) => {
    const hatalar = await hazirla(page, context, baseURL);
    // OS clipboard iznine bağlı kalmadan gerçek click handler'ın yazdığı değeri doğrula.
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async metin => { window.kopyalananMetin = metin; } }, configurable: true
    }));
    for (const [secici, metin] of [
        ['.secure-contact-mail', 'sarica.furkan@icloud.com'],
        ['.secure-contact-phone', '+90 541 168 27 14']
    ]) {
        await page.locator(`${secici} .contact-copy-badge`).click();
        await expect.poll(() => page.evaluate(() => window.kopyalananMetin)).toBe(metin);
        await expect(page.locator(`${secici} .contact-copy-badge`)).toHaveClass(/copied/);
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('#ai-chat-btn').click();
    await expect(page.locator('.ai-term-ready')).toBeVisible();
    await page.locator('#ai-term-input').fill('help');
    await page.locator('#ai-term-input').press('Enter');
    await expect(page.locator('.ai-term-ready')).toBeHidden();
    await page.locator('#ai-term-input').fill('clear');
    await page.locator('#ai-term-input').press('Enter');
    await expect(page.locator('.ai-term-ready')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('#lang-toggle-btn').click();
    await page.locator('#ai-chat-btn').click();
    await expect(page.locator('.ai-term-ready [data-lang-en]')).toBeVisible();
    await context.setOffline(true);
    await page.locator('#ai-term-input').fill('./certs.sh');
    await page.locator('#ai-term-input').press('Enter');
    const beklenenListe = [
        'Stanford University — Artificial Intelligence Professional Certificate',
        'Microsoft — AI & ML Engineering Professional Certificate',
        'AWS — Cloud Solutions Architect Professional Certificate',
        'IBM — DevOps and Software Engineering Professional Certificate',
        'IBM & ISC2 — Cybersecurity Specialist Professional Certificate',
        'Akamai Technologies — Network Engineering Professional Certificate',
        'NVIDIA — Developer Program Member',
        'Vanderbilt University — Generative AI Software Engineering Specialization',
        'Google — IT Support Professional Certificate',
        'Meta — iOS Developer Professional Certificate'
    ];
    // Numaralar mevcut Markdown renderer'ın <ol> semantiğinden gelir.
    await expect(page.locator('#ai-term-history li')).toHaveText(beklenenListe);
    await context.setOffline(false);
    expect(hatalar).toEqual([]);
});
