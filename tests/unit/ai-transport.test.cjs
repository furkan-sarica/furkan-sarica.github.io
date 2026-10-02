const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
const kaynak = fs.readFileSync('js/ai/transport.js', 'utf8');
function ortam(fetchIslevi) {
    const baglam = {}, zamanlar = [], temizlenen = [], etkin = new Map();
    let simdi = 0;
    const api = { kaydet: kur => kur(baglam) };
    vm.runInNewContext(kaynak, { PortfolioAI: api, fetch: fetchIslevi, AbortController, TextDecoder,
        setTimeout: (fn, sure) => {
            const id = zamanlar.length + 1, son = simdi + sure;
            zamanlar.push({ id, sure, son }); etkin.set(id, { fn, son }); return id;
        },
        clearTimeout: id => { temizlenen.push(id); etkin.delete(id); } });
    return { baglam, api, zamanlar, temizlenen,
        bekleyen: () => Array.from(etkin.values()).map(z => z.son),
        ilerlet: sure => {
            const hedef = simdi + sure;
            while (etkin.size) {
                const [id, z] = Array.from(etkin).sort((a, b) => a[1].son - b[1].son)[0];
                if (z.son > hedef) break;
                simdi = z.son; etkin.delete(id); z.fn();
            }
            simdi = hedef;
        }
    };
}
const bekle = () => new Promise(resolve => setImmediate(resolve));
function temizligiDogrula(o) {
    assert.deepEqual(o.bekleyen(), []);
    assert.deepEqual(o.temizlenen, o.zamanlar.map(z => z.id));
    assert.ok(o.zamanlar.every(z => z.sure === 30000));
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
    assert.equal(iptal, 1); assert.equal(kilit, 1); temizligiDogrula(o);
});
test('[DONE] aynı chunk içindeki ve sonraki tokenları tüketmez', () => {
    const o = ortam(), tokenlar = [], akis = o.api.sseOlustur(s => tokenlar.push(s));
    akis.ekle(veri('bir') + 'data:[DONE]\r\n' + veri('iki')); akis.ekle(veri('üç'));
    assert.deepEqual(tokenlar, ['bir']); assert.equal(akis.bitti(), true);
});
test('HTTP hata, boş body ve boş stream cleanup + fallback için reject verir', async () => {
    for (const res of [{ ok: false, status: 503 }, { ok: true, body: null }, { ok: true, body: { getReader: () => ({ read: async () => ({ done: true }), releaseLock() {} }) } }]) {
        const o = ortam(async () => res); await assert.rejects(o.baglam.sorgula([], () => {})); temizligiDogrula(o);
    }
    const o = ortam(async () => { throw new Error('Network error'); });
    await assert.rejects(o.baglam.sorgula([], () => {}), /Network error/); temizligiDogrula(o);
});
test('headers sonrası chunk gelmeyen stream 30 saniyede abort edilir; endpoint ve payload korunur', async () => {
    let kilit = 0, sinyal;
    const o = ortam(async (url, istek) => {
        assert.equal(url, 'https://vitonom-ai.sarica-furkan.workers.dev'); assert.equal(istek.method, 'POST');
        assert.equal(istek.body, JSON.stringify({ messages: [{ role: 'user', content: 'örnek' }] }));
        sinyal = istek.signal;
        return { ok: true, body: { getReader: () => ({
            read: () => new Promise((resolve, reject) => istek.signal.addEventListener('abort', () => reject(new Error('AbortError')), { once: true })),
            releaseLock: () => kilit++
        }) } };
    });
    const sonuc = assert.rejects(o.baglam.sorgula([{ role: 'user', content: 'örnek' }], () => {}), /AbortError/);
    await bekle(); o.ilerlet(29999); assert.equal(sinyal.aborted, false);
    o.ilerlet(1); await sonuc;
    assert.equal(sinyal.aborted, true); assert.equal(kilit, 1); temizligiDogrula(o);
});
function kontrolluAkis() {
    let oku, reddet, sinyal, iptal = 0, kilit = 0;
    const o = ortam(async (url, istek) => {
        sinyal = istek.signal;
        sinyal.addEventListener('abort', () => reddet(new Error('AbortError')), { once: true });
        return { ok: true, body: { getReader: () => ({
            read: () => new Promise((resolve, reject) => { oku = resolve; reddet = reject; }),
            cancel: async () => iptal++, releaseLock: () => kilit++
        }) } };
    });
    return { o, gonder: metin => oku({ value: new TextEncoder().encode(metin), done: false }),
        sinyal: () => sinyal, iptal: () => iptal, kilit: () => kilit };
}
test('80 saniyelik aktif stream abort edilmez; her chunk timer yeniler ve DONE cleanup yapar', async () => {
    const a = kontrolluAkis(), tokenlar = [];
    const sonuc = a.o.baglam.sorgula([], s => tokenlar.push(s));
    await bekle(); assert.deepEqual(a.o.bekleyen(), [30000]);
    for (const parca of [': keepalive\n', veri('bir'), veri(' iki'), 'data:[DONE]\r\n' + veri('atlanmalı')]) {
        a.o.ilerlet(20000); assert.equal(a.sinyal().aborted, false);
        a.gonder(parca); await bekle();
    }
    assert.equal(await sonuc, 'bir iki'); assert.deepEqual(tokenlar, ['bir', 'bir iki']);
    assert.deepEqual(a.o.zamanlar.map(z => z.son), [30000, 50000, 70000, 90000, 110000]);
    assert.equal(a.iptal(), 1); assert.equal(a.kilit(), 1); temizligiDogrula(a.o);
    a.o.ilerlet(30000); assert.equal(a.sinyal().aborted, false);
});
test('son chunk sonrası 30 saniye stall abort edilir; eski timer çalışmaz ve cleanup yapılır', async () => {
    const a = kontrolluAkis();
    const sonuc = assert.rejects(a.o.baglam.sorgula([], () => {}), /AbortError/);
    await bekle(); a.o.ilerlet(20000); a.gonder(veri('bir')); await bekle();
    assert.deepEqual(a.o.bekleyen(), [50000]);
    a.o.ilerlet(29999); assert.equal(a.sinyal().aborted, false);
    a.gonder(': keepalive\n'); await bekle(); assert.deepEqual(a.o.bekleyen(), [79999]);
    a.o.ilerlet(29999); assert.equal(a.sinyal().aborted, false);
    a.o.ilerlet(1); await sonuc;
    assert.equal(a.sinyal().aborted, true); assert.equal(a.kilit(), 1); temizligiDogrula(a.o);
});
test('offline transport ağ ve timer başlatmadan yerel fallback için reject verir', async () => {
    const baglam = {}, api = { kaydet: kur => kur(baglam) };
    vm.runInNewContext(kaynak, { PortfolioAI: api, navigator: { onLine: false },
        fetch: () => assert.fail('Offline ağ çağrısı'), setTimeout: () => assert.fail('Offline timer') });
    await assert.rejects(baglam.sorgula([], () => {}), /Offline/);
});
