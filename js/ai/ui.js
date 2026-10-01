// AI state dışarı açılmaz; fabrikalar bootstrap sırasında bir kez kurulur.
(function () {
    var fabrikalar = [];
    window.PortfolioAI = {
        kaydet: function (kur) { fabrikalar.push(kur); },
        kur: function (baglam) { fabrikalar.forEach(function (kur) { kur(baglam); }); }
    };
}());
PortfolioAI.kaydet(function (baglam) {
    var oncekiOdak = null;
    function pencereyiOlc() {
        if (!window.visualViewport) return;
        baglam.overlay.style.setProperty('--ai-viewport-height', window.visualViewport.height + 'px');
        baglam.overlay.style.setProperty('--ai-viewport-top', window.visualViewport.offsetTop + 'px');
    }
    function viewportDinle(acik) {
        if (window.visualViewport) {
            var islem = acik ? 'addEventListener' : 'removeEventListener';
            window.visualViewport[islem]('resize', pencereyiOlc);
            window.visualViewport[islem]('scroll', pencereyiOlc);
        }
        if (!acik) {
            baglam.overlay.style.removeProperty('--ai-viewport-height');
            baglam.overlay.style.removeProperty('--ai-viewport-top');
        }
    }
function openAIChat(tetikleyen) {
        if (!baglam.overlay) return;
        if (!baglam.overlay.classList.contains('active')) {
            oncekiOdak = tetikleyen instanceof HTMLElement ? tetikleyen : document.activeElement;
            if (oncekiOdak === document.body) oncekiOdak = document.getElementById('ai-chat-btn');
        }
        baglam.overlay.classList.remove('is-minimized');
        baglam.overlay.setAttribute('aria-modal', 'true');
        baglam.overlay.classList.add('active');
        baglam.overlay.setAttribute('aria-hidden', 'false');
        PortfolioUI.dialogAc(baglam.overlay, closeAIChat, baglam.input, oncekiOdak);
        pencereyiOlc();
        viewportDinle(true);
        document.getElementById('ai-chat-btn').setAttribute('aria-expanded', 'true');
        baglam.scrollTerminalToBottom();
    }
    baglam.openAIChat = openAIChat;

function closeAIChat() {
        if (!baglam.overlay) return;
        baglam.overlay.classList.remove('active');
        baglam.overlay.classList.remove('is-minimized');
        var win = baglam.overlay.querySelector('.ai-terminal-window');
        if (win) win.classList.remove('is-maximized');
        baglam.overlay.setAttribute('aria-hidden', 'true');
        PortfolioUI.dialogKapat(baglam.overlay);
        viewportDinle(false);
        document.getElementById('ai-chat-btn').setAttribute('aria-expanded', 'false');
        oncekiOdak = null;
    }
    baglam.closeAIChat = closeAIChat;

function minimizeAIChat() {
        if (!baglam.overlay) return;
        var isMin = baglam.overlay.classList.toggle('is-minimized');
        baglam.overlay.setAttribute('aria-modal', String(!isMin));
        document.getElementById('ai-chat-btn').setAttribute('aria-expanded', String(!isMin));
        if (isMin) {
            PortfolioUI.dialogKapat(baglam.overlay);
            viewportDinle(false);
        } else {
            PortfolioUI.dialogAc(baglam.overlay, closeAIChat, baglam.input, oncekiOdak);
            pencereyiOlc();
            viewportDinle(true);
        }
        var yellowBtn = baglam.overlay.querySelector('.t-btn-yellow');
        if (yellowBtn) {
            yellowBtn.title = isMin
                ? (currentLang === 'tr' ? 'Geri Yükle' : 'Restore')
                : (currentLang === 'tr' ? 'Simge Durumuna Küçült' : 'Minimize');
            yellowBtn.setAttribute('aria-label', yellowBtn.title);
        }
        if (!isMin) {
            baglam.scrollTerminalToBottom();
        }
    }
    baglam.minimizeAIChat = minimizeAIChat;

function toggleMaximizeAIChat() {
        if (!baglam.overlay) return;
        if (baglam.overlay.classList.contains('is-minimized')) {
            baglam.minimizeAIChat();
        }
        var win = baglam.overlay.querySelector('.ai-terminal-window');
        if (!win) return;
        var isMax = win.classList.toggle('is-maximized');
        var greenBtn = win.querySelector('.t-btn-green');
        if (greenBtn) {
            greenBtn.title = isMax
                ? (currentLang === 'tr' ? 'Önceki Boyut' : 'Restore')
                : (currentLang === 'tr' ? 'Tam Ekran' : 'Fullscreen');
            greenBtn.setAttribute('aria-label', greenBtn.title);
            greenBtn.setAttribute('aria-pressed', String(isMax));
        }
        baglam.scrollTerminalToBottom();
    }
    baglam.toggleMaximizeAIChat = toggleMaximizeAIChat;

function handleAiHeaderClick(e) {
        if (baglam.overlay && baglam.overlay.classList.contains('is-minimized')) {
            baglam.minimizeAIChat();
        }
    }
    baglam.handleAiHeaderClick = handleAiHeaderClick;

function scrollTerminalToBottom() {
        if (baglam.body) {
            baglam.body.scrollTop = baglam.body.scrollHeight;
        }
    }
    baglam.scrollTerminalToBottom = scrollTerminalToBottom;
    baglam.uiBaslat = function () {
    window.openAIChat = baglam.openAIChat;
    window.closeAIChat = baglam.closeAIChat;
    window.minimizeAIChat = baglam.minimizeAIChat;
    window.toggleMaximizeAIChat = baglam.toggleMaximizeAIChat;
    window.handleAiHeaderClick = baglam.handleAiHeaderClick;
    window.runAiQuick = baglam.runAiQuick;
    window.handleAiTerminalSubmit = baglam.handleAiTerminalSubmit;
    window.openCmdPalette = baglam.openAIChat;
    window.closeCmdPalette = baglam.closeAIChat;

    // Ctrl+K / Cmd+K opens AI Terminal
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            if (document.getElementById('cert-modal').classList.contains('active')) return;
            e.preventDefault();
            if (baglam.overlay && baglam.overlay.classList.contains('active')) baglam.closeAIChat();
            else baglam.openAIChat();
        }
    });

    // Escape closes AI Terminal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && baglam.overlay && baglam.overlay.classList.contains('active')) {
            baglam.closeAIChat();
        }
    });

    // Click outside window closes
    if (baglam.overlay) {
        baglam.overlay.addEventListener('click', function(e) {
            if (e.target === baglam.overlay) baglam.closeAIChat();
        });
    }

    // Auto-open if URL has #chat or #ai or ?chat=open
    if (window.location.hash === '#chat' || window.location.hash === '#ai' || window.location.search.indexOf('chat=open') !== -1) {
        setTimeout(baglam.openAIChat, 350);
    }

    };
});
