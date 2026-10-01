const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
const kaynak = fs.readFileSync('js/ai/transport.js', 'utf8');
function ortam(fetchIslevi) {
    const baglam = {}, zamanlar = [], temizlenen = [];
    const api = { kaydet: kur => kur(baglam) };
    vm.runInNewContext(kaynak, { PortfolioAI: api, fetch: fetchIslevi, AbortController, TextDecoder,
        setTimeout: fn => { zamanlar.push(fn); return zamanlar.length; },
        clearTimeout: id => temizlenen.push(id) });
    return { baglam, api, zamanlar, temizlenen };
}
const veri = metin => 'data: ' + JSON.stringify({ choices: [{ delta: { content: metin } }] }) + '\n\n';
test('SSE buffer, UTF-8 parçaları, CRLF, malformed kayıt ve birikmiş metin', async () => {
    const baytlar = new TextEncoder().encode(': keepalive\r\ndata: bozuk\r\n' + veri('Türkçe 🔐').replaceAll('\n', '\r\n') + veri(' devam') + 'data: [DONE]\n\n' + veri('atlanmalı'));
    let sira = 0, iptal = 0, kilit = 0; const tokenlar = [];
    const o = ortam(async () => ({ ok: true, body: { getReader: () => ({
        read: async () => sira < baytlar.length ? { value: baytlar.slice(sira, ++sira) } : { done: true },
        cancel: async () => iptal++, releaseLock: () => kilit++
    }) } }));
    assert.equal(await o.baglam.sorgula([], s => tokenlar.push(s)), 'Türkçe 🔐 devam');
    assert.deepEqual(tokenlar, ['Türkçe 🔐', 'Türkçe 🔐 devam']);
    assert.equal(iptal, 1); assert.equal(kilit, 1); assert.deepEqual(o.temizlenen, [1]);
});
test('[DONE] aynı chunk içindeki ve sonraki tokenları tüketmez', () => {
    const o = ortam(), tokenlar = [], akis = o.api.sseOlustur(s => tokenlar.push(s));
    akis.ekle(veri('bir') + 'data:[DONE]\r\n' + veri('iki')); akis.ekle(veri('üç'));
    assert.deepEqual(tokenlar, ['bir']); assert.equal(akis.bitti(), true);
});
test('HTTP hata, boş body ve boş stream cleanup + fallback için reject verir', async () => {
    for (const res of [{ ok: false, status: 503 }, { ok: true, body: null }, { ok: true, body: { getReader: () => ({ read: async () => ({ done: true }), releaseLock() {} }) } }]) {
        const o = ortam(async () => res); await assert.rejects(o.baglam.sorgula([], () => {})); assert.deepEqual(o.temizlenen, [1]);
    }
});
test('timeout headers sonrasında stream okunurken de etkindir; endpoint ve payload korunur', async () => {
    let o, kilit = 0;
    o = ortam(async (url, istek) => {
        assert.equal(url, 'https://vitonom-ai.sarica-furkan.workers.dev'); assert.equal(istek.method, 'POST');
        assert.equal(istek.body, JSON.stringify({ messages: [{ role: 'user', content: 'örnek' }] }));
        return { ok: true, body: { getReader: () => ({
            read: () => new Promise((resolve, reject) => { assert.deepEqual(o.temizlenen, []); istek.signal.addEventListener('abort', () => reject(new Error('AbortError'))); o.zamanlar[0](); }),
            releaseLock: () => kilit++
        }) } };
    });
    await assert.rejects(o.baglam.sorgula([{ role: 'user', content: 'örnek' }], () => {}), /AbortError/);
    assert.equal(kilit, 1); assert.deepEqual(o.temizlenen, [1]);
});
test('offline transport ağ ve timer başlatmadan yerel fallback için reject verir', async () => {
    const baglam = {}, api = { kaydet: kur => kur(baglam) };
    vm.runInNewContext(kaynak, { PortfolioAI: api, navigator: { onLine: false },
        fetch: () => assert.fail('Offline ağ çağrısı'), setTimeout: () => assert.fail('Offline timer') });
    await assert.rejects(baglam.sorgula([], () => {}), /Offline/);
});
