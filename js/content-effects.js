// ===== Feature 3: IaC Snippet Toggle =====
(function () {
    document.querySelectorAll('.iac-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute('data-target');
            var snippet = document.getElementById(targetId);
            if (!snippet) return;
            var hidden = snippet.hasAttribute('hidden');
            snippet.toggleAttribute('hidden', !hidden);
        });
    });
}());

// ===== Feature: IaC Copy Buttons =====
(function () {
    document.querySelectorAll('.iac-copy-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var iacId = btn.getAttribute('data-iac');
            var snippet = document.getElementById(iacId);
            if (!snippet) return;
            var pre = snippet.querySelector('.iac-code');
            if (!pre) return;
            var text = pre.innerText || pre.textContent || '';
            var trSpan = btn.querySelector('[data-lang-tr]');
            var enSpan = btn.querySelector('[data-lang-en]');
            navigator.clipboard.writeText(text).then(function () {
                if (trSpan) trSpan.textContent = 'Kopyalandı!';
                if (enSpan) enSpan.textContent = 'Copied!';
                setTimeout(function () {
                    if (trSpan) trSpan.textContent = 'Kopyala';
                    if (enSpan) enSpan.textContent = 'Copy';
                }, 2000);
            }).catch(function () {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                try { document.execCommand('copy'); } catch (e) {
                    if (trSpan) trSpan.textContent = 'Hata!';
                    if (enSpan) enSpan.textContent = 'Error!';
                    setTimeout(function () {
                        if (trSpan) trSpan.textContent = 'Kopyala';
                        if (enSpan) enSpan.textContent = 'Copy';
                    }, 2000);
                    document.body.removeChild(ta);
                    return;
                }
                document.body.removeChild(ta);
                if (trSpan) trSpan.textContent = 'Kopyalandı!';
                if (enSpan) enSpan.textContent = 'Copied!';
                setTimeout(function () {
                    if (trSpan) trSpan.textContent = 'Kopyala';
                    if (enSpan) enSpan.textContent = 'Copy';
                }, 2000);
            });
        });
    });
}());

// ===== 10/10 Upgrade: Scroll Animations =====
(function () {
    // Scroll Progress Bar
    var scrollProgress = document.getElementById('scroll-progress');
    function updateScrollProgress() {
        if (!scrollProgress) return;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // Intersection Observer for reveal animations + per-section typing sounds
    var revealedSections = new Set();
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Handle stagger children
                if (entry.target.classList.contains('stagger-children')) {
                    entry.target.classList.add('visible');
                }
                // Play typing sound for section headers (once per section)
                if (entry.target.classList.contains('section-header') && window.playClick && !revealedSections.has(entry.target.id)) {
                    window.playClick();
                    revealedSections.add(entry.target.id);
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .stagger-children').forEach(function(el) {
        revealObserver.observe(el);
    });
}());
