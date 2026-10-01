// ===== 10/10 FINAL: CRT Grain Overlay =====
(function() {
    var grain = document.createElement('div');
    grain.id = 'crt-grain';
    document.body.appendChild(grain);

    // Auto-enable after boot
    setTimeout(function() {
        grain.classList.add('active');
        document.body.classList.add('crt-active');
    }, 3500);
}());
