const { defineConfig } = require('@playwright/test');

const canliAdres = process.env.SMOKE_ADRESI;
const yerelAdres = 'http://127.0.0.1:8080';

module.exports = defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.cjs',
    timeout: 20000,
    expect: { timeout: 5000 },
    workers: 1,
    retries: canliAdres ? 2 : 0,
    forbidOnly: Boolean(process.env.CI),
    reporter: 'list',
    use: {
        baseURL: canliAdres || yerelAdres,
        browserName: 'chromium',
        serviceWorkers: 'block', // Smoke test cache ve dış API'lerden bağımsızdır.
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [
        { name: 'masaustu', testIgnore: '**/pwa.spec.cjs', use: { viewport: { width: 1440, height: 900 } } },
        { name: 'mobil', testIgnore: '**/pwa.spec.cjs', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
        { name: 'webkit', testIgnore: '**/pwa.spec.cjs', use: { browserName: 'webkit', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
        { name: 'pwa', testMatch: '**/pwa.spec.cjs', use: { serviceWorkers: 'allow', viewport: { width: 390, height: 844 } } },
    ],
    webServer: canliAdres ? undefined : {
        command: 'python3 scripts/serve-tests.py',
        url: yerelAdres,
        reuseExistingServer: false,
        timeout: 10000,
        stdout: 'ignore',
        stderr: 'ignore',
    },
});
