// AI input/history state ve komut orchestration; endpoint ve içerik korunur.
(function () {
    var overlay = document.getElementById('ai-chat-overlay');
    var input = document.getElementById('ai-term-input');
    var history = document.getElementById('ai-term-history');
    var body = document.getElementById('ai-term-body');
    var isExecuting = false;
    var baglam = {};
    Object.defineProperties(baglam, {
        "overlay": { get: function () { return overlay; }, set: function (deger) { overlay = deger; } },
        "input": { get: function () { return input; }, set: function (deger) { input = deger; } },
        "history": { get: function () { return history; }, set: function (deger) { history = deger; } },
        "body": { get: function () { return body; }, set: function (deger) { body = deger; } },
        "isExecuting": { get: function () { return isExecuting; }, set: function (deger) { isExecuting = deger; } },
        "handleAiTerminalSubmit": { get: function () { return handleAiTerminalSubmit; } },
        "runAiQuick": { get: function () { return runAiQuick; } }
    });
    PortfolioAI.kur(baglam);

    // Comprehensive Vitonom AI Conversational & Knowledge Engine

    function handleAiTerminalSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (isExecuting || !input) return;
        var text = input.value.trim();
        if (!text) return;
        input.value = '';

        // Built-in terminal commands
        var cmdLower = text.toLowerCase();
        if (cmdLower === 'clear') {
            if (history) history.innerHTML = '';
            return;
        }
        if (cmdLower === 'exit' || cmdLower === 'quit' || cmdLower === ':q') {
            baglam.closeAIChat();
            return;
        }
        if (cmdLower === 'help') {
            baglam.renderCommandOutput(text, currentLang === 'tr'
                ? "Mevcut terminal komutları:\n\n• ./tracefold.sh — Tracefold yerel RAG mimarisi\n• ./cloudspark.sh — CloudSpark AI Solutions Engineer deneyimi\n• ./tech-stack.sh — Yetenekler, diller ve altyapı\n• ./certs.sh — 10 profesyonel küresel sertifika\n• ./download-cv.sh — Furkan SARICA CV indirme bağlantıları\n• ./install-pwa.sh — Portfolyoyu cihazına bağımsız uygulama (PWA) olarak yükle\n• ./contact.sh — E-posta ve sosyal profiller\n• clear — Terminal ekranını temizle\n• exit — Terminalden çık\n\nAyrıca istediğin herhangi bir soruyu doğrudan yazabilirsin."
                : "Available terminal scripts:\n\n• ./tracefold.sh — Tracefold local RAG architecture\n• ./cloudspark.sh — CloudSpark AI Solutions Engineer role\n• ./tech-stack.sh — Skills, languages, and infrastructure\n• ./certs.sh — 10 professional global certifications\n• ./download-cv.sh — Direct CV download links\n• ./install-pwa.sh — Install portfolio as standalone desktop/mobile PWA app\n• ./contact.sh — Email and professional profiles\n• clear — Clear terminal screen\n• exit — Exit terminal\n\nYou can also enter any freeform question directly.");
            return;
        }
        if (cmdLower === './download-cv.sh' || cmdLower === './cv.sh' || cmdLower === 'cv') {
            var cvLang = currentLang === 'tr' ? 'tr' : 'en';
            var cvUrl = cvLang === 'tr' ? 'Furkan%20SARICA%20CV%20TR.pdf' : 'Furkan%20SARICA%20CV%20EN.pdf';
            var a = document.createElement('a');
            a.href = cvUrl;
            a.download = cvLang === 'tr' ? 'Furkan SARICA CV TR.pdf' : 'Furkan SARICA CV EN.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            baglam.renderCommandOutput(text, currentLang === 'tr'
                ? "✓ Özgeçmiş dosyası indiriliyor: [Furkan SARICA CV TR.pdf](" + cvUrl + ")"
                : "✓ Downloading resume file: [Furkan SARICA CV EN.pdf](" + cvUrl + ")");
            return;
        }
        if (cmdLower === './install-pwa.sh' || cmdLower === './install.sh' || cmdLower === 'install' || cmdLower === 'pwa') {
            if (window._deferredPWAInstallPrompt) {
                baglam.renderCommandOutput(text, currentLang === 'tr'
                    ? "✓ PWA yükleyici başlatılıyor..."
                    : "✓ Launching PWA native installer...");
                window._deferredPWAInstallPrompt.prompt();
                window._deferredPWAInstallPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        baglam.renderCommandOutput(text, currentLang === 'tr'
                            ? "✓ Portfolyo web uygulaması başarıyla cihazınıza yüklendi."
                            : "✓ Portfolio PWA successfully installed to your device.");
                    } else {
                        baglam.renderCommandOutput(text, currentLang === 'tr'
                            ? "ℹ Yükleme isteği kullanıcı tarafından reddedildi."
                            : "ℹ Installation dismissed by user.");
                    }
                    window._deferredPWAInstallPrompt = null;
                });
            } else if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
                baglam.renderCommandOutput(text, currentLang === 'tr'
                    ? "✓ Portfolyo zaten bağımsız bir PWA (standalone) uygulaması olarak çalışıyor."
                    : "✓ Portfolio is already running in standalone PWA mode.");
            } else {
                baglam.renderCommandOutput(text, currentLang === 'tr'
                    ? "ℹ PWA Kurulum Rehberi:\n\n• **Chrome / Edge (Masaüstü & Android):** Adres çubuğundaki yükle simgesine (⊕) tıklayın veya menüden 'Uygulamayı Yükle'yi seçin.\n• **iOS (Safari):** Paylaş butonuna (⎙/⎋) dokunun ve 'Ana Ekrana Ekle' seçeneğini seçin.\n• **macOS:** Safari'de 'Dosya > Dock'a Ekle' seçeneğiyle yerel Mac uygulaması olarak kullanabilirsiniz."
                    : "ℹ PWA Installation Guide:\n\n• **Chrome / Edge (Desktop & Android):** Click the install icon (⊕) in address bar or choose 'Install App' from menu.\n• **iOS (Safari):** Tap Share button and select 'Add to Home Screen'.\n• **macOS:** In Safari, choose 'File > Add to Dock' to run as a native desktop application.");
            }
            return;
        }

        // Standard Query / Script execution
        var resolvedPrompt = text;
        if (cmdLower === './tracefold.sh') resolvedPrompt = 'Tracefold nedir ve mimarisi nasıl çalışır?';
        else if (cmdLower === './cloudspark.sh') resolvedPrompt = 'CloudSpark\'taki AI Solutions Engineer rolü ve sorumlulukları neler?';
        else if (cmdLower === './tech-stack.sh' || cmdLower === './stack.sh') resolvedPrompt = 'Furkan\'ın teknik yetenekleri ve kullandığı teknolojiler neler?';
        else if (cmdLower === './certs.sh') resolvedPrompt = 'Furkan\'ın sahip olduğu profesyonel sertifikalar nelerdir?';
        else if (cmdLower === './contact.sh') resolvedPrompt = 'Furkan ile nasıl iletişime geçebilirim?';

        // Render log entry
        var entry = document.createElement('div');
        entry.className = 'ai-term-log-entry';
        entry.innerHTML = '<div class="ai-term-user-line"><span class="ai-term-prompt">guest@portfolio:~$</span> <span class="ai-term-user-cmd">' + baglam.escapeHtml(text) + '</span></div>' +
            '<div class="ai-term-bot-output">' +
            '<div class="ai-term-sys-tag"><span style="color:var(--terminal-green);">●</span> [vitonom]:</div>' +
            '<div class="ai-term-text"><span class="ai-term-cursor">█</span></div>' +
            '</div>';
        history.appendChild(entry);
        baglam.scrollTerminalToBottom();

        var textContainer = entry.querySelector('.ai-term-text');
        isExecuting = true;

        var isTr = currentLang === 'tr';
        var trMarkers = ['nedir', 'neler', 'kimdir', 'nasıl', 'nerede', 'hakkında', 'misin', 'müsait', 'hangi', 'selam', 'merhaba', 'naber', 'günaydın'];
        var textLower = resolvedPrompt.toLowerCase();
        for (var i = 0; i < trMarkers.length; i++) {
            if (textLower.indexOf(trMarkers[i]) !== -1) { isTr = true; break; }
        }

        if (!window._aiChatHistory) window._aiChatHistory = [];
        window._aiChatHistory.push({ role: 'user', content: resolvedPrompt });
        if (window._aiChatHistory.length > 8) {
            window._aiChatHistory = window._aiChatHistory.slice(-8);
        }

        baglam.sorgula(window._aiChatHistory, function (fullAiText) {
            textContainer.innerHTML = baglam.parseMarkdown(fullAiText) + '<span class="ai-term-cursor">█</span>';
            baglam.scrollTerminalToBottom();
        }).then(function (fullAiText) {
            if (!fullAiText) throw new Error("Empty model response");
            textContainer.innerHTML = baglam.parseMarkdown(fullAiText);
            window._aiChatHistory.push({ role: 'assistant', content: fullAiText });
            baglam.scrollTerminalToBottom();
            isExecuting = false;
            if (input) input.focus();
        })
        .catch(function(err) {
            var isOffline = !navigator.onLine;
            var sysTag = entry.querySelector('.ai-term-sys-tag');
            if (isOffline && sysTag) {
                sysTag.innerHTML = '<span style="color:var(--accent-cyan);">⚡</span> [vitonom@offline-local]:';
            }
            var offlineNotice = isOffline
                ? (isTr ? "*[OFFLINE ENGINE ACTIVE: Ağ bağlantısı yok, yerel hafıza devrede]*\n\n" : "*[OFFLINE ENGINE ACTIVE: Network unreachable, local memory engaged]*\n\n")
                : "";
            var vitonomResponse = offlineNotice + baglam.queryVitonomAI(resolvedPrompt, isTr);
            baglam.streamTerminalTypewriter(textContainer, vitonomResponse, function() {
                window._aiChatHistory.push({ role: 'assistant', content: vitonomResponse });
                isExecuting = false;
                if (input) input.focus();
            });
        });
    }

    function runAiQuick(cmd) {
        if (!input) return;
        input.value = cmd;
        handleAiTerminalSubmit({ preventDefault: function(){} });
    }

    baglam.uiBaslat();

}());
