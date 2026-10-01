
// Clean up any stale custom cursor elements or classes from browser cache immediately
(function() {
    var old = document.getElementById('terminal-cursor');
    if (old) old.remove();
    document.body.classList.remove('custom-cursor');
})();

// Language state
var currentLang = 'tr';

function applyLang(lang) {
    currentLang = lang;
    document.body.classList.remove('lang-tr', 'lang-en');
    document.body.classList.add('lang-' + currentLang);
    document.documentElement.lang = currentLang;

    // Dynamic Title & Meta Description update
    if (currentLang === 'tr') {
        document.title = 'Furkan SARICA | AI Solutions Engineer';
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', 'Furkan SARICA - AI Solutions Engineer @ CloudSpark | Kurumsal AI, RAG & LLM Uygulamaları, Enterprise DevOps');
        var cmdKBtn = document.getElementById('cmd-k-btn');
        if (cmdKBtn) cmdKBtn.title = 'Komut Paleti (Cmd+K / Ctrl+K)';
    } else {
        document.title = 'Furkan SARICA | AI Solutions Engineer';
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', 'Furkan SARICA - AI Solutions Engineer @ CloudSpark | Enterprise AI, RAG & LLM Applications, Enterprise DevOps');
        var cmdKBtn = document.getElementById('cmd-k-btn');
        if (cmdKBtn) cmdKBtn.title = 'Command Palette (Cmd+K / Ctrl+K)';
    }

    // Update toggle button states
    var trBtn = document.getElementById('lang-tr-btn');
    var enBtn = document.getElementById('lang-en-btn');
    if (trBtn) trBtn.classList.toggle('active', currentLang === 'tr');
    if (enBtn) enBtn.classList.toggle('active', currentLang === 'en');

    // Update toggle button tooltip
    var langToggle = document.getElementById('lang-toggle-btn');
    if (langToggle) langToggle.title = currentLang === 'tr' ? 'Dili Değiştir (EN)' : 'Switch Language (TR)';

    // Update back-to-top button title
    var btn = document.getElementById('backToTop');
    if (btn) btn.title = currentLang === 'tr' ? 'Yukarı Çık' : 'Back to Top';

    // Update sound button title
    var muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        var isMuted = muteBtn.textContent === '🔇';
        muteBtn.title = isMuted
            ? (currentLang === 'tr' ? 'Sesi Aç' : 'Enable Sounds')
            : (currentLang === 'tr' ? 'Sesi Kapat' : 'Mute Sounds');
    }

    // Modal button titles
    var mClose = document.querySelector('#cert-modal .t-btn-red');
    var mZoom = document.querySelector('#cert-modal .t-btn-yellow');
    var mFull = document.querySelector('#cert-modal .t-btn-green');
    if (mClose) mClose.title = currentLang === 'tr' ? 'Kapat' : 'Close';
    if (mZoom) mZoom.title = currentLang === 'tr' ? 'Yakınlaştır' : 'Zoom';
    if (mFull) mFull.title = currentLang === 'tr' ? 'Tam Ekran' : 'Fullscreen';

    // Screen reader fix: set aria-hidden on inactive language elements
    document.querySelectorAll('[data-lang-tr], [data-lang-tr-block], [data-lang-tr-grid], [data-lang-tr-li]').forEach(function(el) {
        el.setAttribute('aria-hidden', currentLang === 'en' ? 'true' : 'false');
    });
    document.querySelectorAll('[data-lang-en], [data-lang-en-block], [data-lang-en-grid], [data-lang-en-li]').forEach(function(el) {
        el.setAttribute('aria-hidden', currentLang === 'tr' ? 'true' : 'false');
    });

    try {
        localStorage.setItem('preferredLang', currentLang);
    } catch(e) {}
}

function toggleLang() {
    var nextLang = currentLang === 'tr' ? 'en' : 'tr';
    applyLang(nextLang);
}

// Initialize preferred language from storage if present
try {
    var savedLang = localStorage.getItem('preferredLang');
    if (savedLang === 'en' || savedLang === 'tr') {
        applyLang(savedLang);
    }
} catch(e) {}
