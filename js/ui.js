// Ortak erişilebilir dialog lifecycle ve hareket tercihi; feature state burada tutulmaz.
(function () {
    var aciklar = [];
    function hareketAz() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    function odaklar(modal) {
        return Array.from(modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]'))
            .filter(function (el) { return !el.disabled && !el.inert && el.getClientRects().length; });
    }
    function klavye(e) {
        var kayit = aciklar[aciklar.length - 1];
        if (!kayit) return;
        if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); kayit.kapat(); }
        if (e.key !== 'Tab') return;
        var liste = odaklar(kayit.modal), ilk = liste[0], son = liste[liste.length - 1];
        if (!ilk) { e.preventDefault(); kayit.modal.focus(); return; }
        if (e.shiftKey && (document.activeElement === ilk || !kayit.modal.contains(document.activeElement))) {
            e.preventDefault(); son.focus();
        } else if (!e.shiftKey && (document.activeElement === son || !kayit.modal.contains(document.activeElement))) {
            e.preventDefault(); ilk.focus();
        }
    }
    function dialogAc(modal, kapat, ilkOdak, oncekiOdak) {
        if (aciklar.some(function (k) { return k.modal === modal; })) return;
        var kayit = { modal: modal, kapat: kapat, onceki: oncekiOdak || document.activeElement, overflow: document.body.style.overflow, arkaPlan: [] };
        Array.from(document.body.children).forEach(function (el) {
            if (el === modal || el.contains(modal) || /^(SCRIPT|STYLE|LINK)$/.test(el.tagName)) return;
            kayit.arkaPlan.push({ el: el, inert: el.inert }); el.inert = true;
        });
        if (!aciklar.length) document.addEventListener('keydown', klavye, true);
        aciklar.push(kayit); document.body.style.overflow = 'hidden';
        function odagiVer() {
            if (aciklar[aciklar.length - 1] !== kayit) return;
            // visibility transition'ın ilk frame'inde browser focus'u reddeder.
            if (getComputedStyle(modal).visibility === 'hidden') { requestAnimationFrame(odagiVer); return; }
            (ilkOdak || odaklar(modal)[0] || modal).focus({ preventScroll: true });
        }
        odagiVer();
    }
    function dialogKapat(modal) {
        var sira = aciklar.findIndex(function (k) { return k.modal === modal; });
        if (sira === -1) return;
        var kayit = aciklar[sira]; aciklar.splice(sira, 1);
        kayit.arkaPlan.forEach(function (k) { k.el.inert = k.inert; });
        document.body.style.overflow = kayit.overflow;
        if (!aciklar.length) document.removeEventListener('keydown', klavye, true);
        if (kayit.onceki && kayit.onceki.isConnected && !kayit.onceki.closest('[inert]')) kayit.onceki.focus({ preventScroll: true });
    }
    window.PortfolioUI = { hareketAz: hareketAz, dialogAc: dialogAc, dialogKapat: dialogKapat };
}());
