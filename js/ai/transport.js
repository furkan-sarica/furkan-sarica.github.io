// Endpoint sözleşmesi: UTF-8 SSE delta → birikmiş metin; state ve DOM bu dosyaya ait değildir.
(function () {
    function sseOlustur(tokenGeldi) {
        var tampon = '', metin = '', bitti = false, oncekiCR = false;
        function satiriIsle(satir) {
            if (bitti || satir.indexOf('data:') !== 0) return;
            var veri = satir.slice(5).trim();
            if (veri === '[DONE]') { bitti = true; return; }
            try {
                var parsed = JSON.parse(veri);
                var token = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
                if (token) { metin += token; tokenGeldi(metin); }
            } catch (hata) { /* Bozuk/keepalive kayıt, mevcut fallback akışını kesmez. */ }
        }
        return {
            ekle: function (parca) {
                for (var i = 0; i < parca.length && !bitti; i++) {
                    var karakter = parca[i];
                    if (oncekiCR && karakter === '\n') { oncekiCR = false; continue; }
                    oncekiCR = karakter === '\r';
                    if (karakter === '\r' || karakter === '\n') { satiriIsle(tampon); tampon = ''; }
                    else tampon += karakter;
                }
            },
            metin: function () { return metin; },
            bitti: function () { return bitti; }
        };
    }
    PortfolioAI.sseOlustur = sseOlustur;
    PortfolioAI.kaydet(function (baglam) {
        baglam.sorgula = async function (mesajlar, tokenGeldi) {
            if (typeof navigator !== 'undefined' && !navigator.onLine) throw new Error('Offline');
            var controller = new AbortController();
            var timeoutId = setTimeout(function () { controller.abort(); }, 30000);
            var reader;
            try {
                var res = await fetch('https://vitonom-ai.sarica-furkan.workers.dev', {
                    method: 'POST', signal: controller.signal,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: mesajlar })
                });
                if (!res.ok) throw new Error('Worker HTTP ' + res.status);
                if (!res.body) throw new Error('Empty model response');
                reader = res.body.getReader();
                var decoder = new TextDecoder(), akis = sseOlustur(tokenGeldi);
                while (!akis.bitti()) {
                    var chunk = await reader.read();
                    if (chunk.done) { akis.ekle(decoder.decode()); break; }
                    akis.ekle(decoder.decode(chunk.value, { stream: true }));
                }
                if (akis.bitti()) await reader.cancel();
                if (!akis.metin()) throw new Error('Empty model response');
                return akis.metin();
            } finally {
                clearTimeout(timeoutId);
                if (reader) reader.releaseLock();
            }
        };
    });
}());
