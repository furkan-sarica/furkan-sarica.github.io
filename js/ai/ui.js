// AI state dışarı açılmaz; fabrikalar bootstrap sırasında bir kez kurulur.
(function () {
    var fabrikalar = [];
    window.PortfolioAI = {
        kaydet: function (kur) { fabrikalar.push(kur); },
        kur: function (baglam) { fabrikalar.forEach(function (kur) { kur(baglam); }); }
    };
}());
PortfolioAI.kaydet(function (baglam) {
function openAIChat() {
        if (!baglam.overlay) return;
        baglam.overlay.classList.remove('is-minimized');
        baglam.overlay.classList.add('active');
        baglam.overlay.setAttribute('aria-hidden', 'false');
        if (baglam.input) {
            setTimeout(function() { baglam.input.focus(); }, 120);
        }
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
    }
    baglam.closeAIChat = closeAIChat;

function minimizeAIChat() {
        if (!baglam.overlay) return;
        var isMin = baglam.overlay.classList.toggle('is-minimized');
        var yellowBtn = baglam.overlay.querySelector('.t-btn-yellow');
        if (yellowBtn) {
            yellowBtn.title = isMin
                ? (currentLang === 'tr' ? 'Geri Yükle' : 'Restore')
                : (currentLang === 'tr' ? 'Simge Durumuna Küçült' : 'Minimize');
        }
        if (!isMin) {
            if (baglam.input) setTimeout(function() { baglam.input.focus(); }, 100);
            baglam.scrollTerminalToBottom();
        }
    }
    baglam.minimizeAIChat = minimizeAIChat;

function toggleMaximizeAIChat() {
        if (!baglam.overlay) return;
        if (baglam.overlay.classList.contains('is-minimized')) {
            baglam.overlay.classList.remove('is-minimized');
        }
        var win = baglam.overlay.querySelector('.ai-terminal-window');
        if (!win) return;
        var isMax = win.classList.toggle('is-maximized');
        var greenBtn = win.querySelector('.t-btn-green');
        if (greenBtn) {
            greenBtn.title = isMax
                ? (currentLang === 'tr' ? 'Önceki Boyut' : 'Restore')
                : (currentLang === 'tr' ? 'Tam Ekran' : 'Fullscreen');
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
