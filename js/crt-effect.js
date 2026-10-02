// ===== 10/10 FINAL: CRT Grain Overlay =====
(function() {
    if (PortfolioUI.hareketAz()) return;
    var grain = document.createElement('div');
    grain.id = 'crt-grain';
    document.body.appendChild(grain);

    // Auto-enable after boot
    setTimeout(function() {
    if (PortfolioUI.hareketAz()) return;
        grain.classList.add('active');
        document.body.classList.add('crt-active');
    }, 3500);
}());
