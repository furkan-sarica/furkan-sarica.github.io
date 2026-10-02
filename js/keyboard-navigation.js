// ===== Feature 10: Keyboard-first Navigation =====
(function () {
    var sections = ['#about', '#education', '#experience', '#certificates', '#projects', '#tools', '#contact', '#cli-terminal'];
    var ggTimer = null;
    var gpTimer = null;
    var gtTimer = null;
    var gPending = false;

    function isTyping() {
        var active = document.activeElement;
        if (!active) return false;
        var tag = active.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || active.isContentEditable;
    }

    function isPaletteOpen() {
        var ov = document.getElementById('cmd-palette-overlay');
        var ai = document.getElementById('ai-chat-overlay');
        var cert = document.getElementById('cert-modal');
        return (ov && ov.classList.contains('active')) || (ai && ai.classList.contains('active')) || (cert && cert.classList.contains('active'));
    }

    function getCurrentSectionIdx() {
        var scrollY = window.scrollY + window.innerHeight * 0.3;
        var best = 0;
        sections.forEach(function(sel, i) {
            var el = document.querySelector(sel);
            if (el && el.getBoundingClientRect().top + window.scrollY <= scrollY) {
                best = i;
            }
        });
        return best;
    }

    document.addEventListener('keydown', function(e) {
        if (isTyping() || isPaletteOpen()) return;
        // Ignore modifier combos handled elsewhere
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        var key = e.key;

        // j / k — next / prev section
        if (key === 'j') {
            e.preventDefault();
            var cur = getCurrentSectionIdx();
            var next = Math.min(cur + 1, sections.length - 1);
            var el = document.querySelector(sections[next]);
            if (el) el.scrollIntoView({ behavior: PortfolioUI.hareketAz() ? 'auto' : 'smooth', block: 'start' });
            return;
        }
        if (key === 'k') {
            e.preventDefault();
            var cur2 = getCurrentSectionIdx();
            var prev = Math.max(cur2 - 1, 0);
            var el2 = document.querySelector(sections[prev]);
            if (el2) el2.scrollIntoView({ behavior: PortfolioUI.hareketAz() ? 'auto' : 'smooth', block: 'start' });
            return;
        }

        // g g — go to top
        // g p — go to projects
        // g t — go to terminal
        if (key === 'g') {
            if (gPending) {
                // second g
                gPending = false;
                clearTimeout(ggTimer);
                window.scrollTo({ top: 0, behavior: PortfolioUI.hareketAz() ? 'auto' : 'smooth' });
                return;
            }
            gPending = true;
            ggTimer = setTimeout(function() { gPending = false; }, 600);

            // Set up 'p' and 't' listeners for this g press
            clearTimeout(gpTimer);
            clearTimeout(gtTimer);
            var onceKeydown = function(ev) {
                if (!gPending) { document.removeEventListener('keydown', onceKeydown, true); return; }
                if (ev.key === 'p') {
                    ev.preventDefault();
                    gPending = false;
                    clearTimeout(ggTimer);
                    document.removeEventListener('keydown', onceKeydown, true);
                    var el = document.querySelector('#projects');
                    if (el) el.scrollIntoView({ behavior: PortfolioUI.hareketAz() ? 'auto' : 'smooth', block: 'start' });
                } else if (ev.key === 't') {
                    ev.preventDefault();
                    gPending = false;
                    clearTimeout(ggTimer);
                    document.removeEventListener('keydown', onceKeydown, true);
                    var el2 = document.querySelector('#cli-terminal');
                    if (el2) el2.scrollIntoView({ behavior: PortfolioUI.hareketAz() ? 'auto' : 'smooth', block: 'start' });
                } else if (ev.key !== 'g') {
                    // any other key cancels
                    gPending = false;
                    clearTimeout(ggTimer);
                    document.removeEventListener('keydown', onceKeydown, true);
                }
            };
            document.addEventListener('keydown', onceKeydown, true);
            return;
        }
    });
}());
