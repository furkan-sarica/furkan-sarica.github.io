// Anti-Scraping Hydration for Contact Links
(function initAntiScrapingContacts() {
    var mailItem = document.querySelector('.secure-contact-mail');
    if (mailItem) {
        var u = mailItem.getAttribute('data-u') || 'sarica.furkan';
        var d = mailItem.getAttribute('data-d') || 'icloud.com';
        var sub = mailItem.getAttribute('data-sub') || 'Portfolio Contact';
        var fullMail = u + '@' + d;
        mailItem.setAttribute('href', 'mailto:' + fullMail + '?subject=' + encodeURIComponent(sub));
        mailItem.setAttribute('data-copy', fullMail);
    }
    var phoneItem = document.querySelector('.secure-contact-phone');
    if (phoneItem) {
        var p = [phoneItem.getAttribute('data-p1'), phoneItem.getAttribute('data-p2'), phoneItem.getAttribute('data-p3'), phoneItem.getAttribute('data-p4')].join('');
        var displayP = [phoneItem.getAttribute('data-p1'), phoneItem.getAttribute('data-p2'), phoneItem.getAttribute('data-p3'), phoneItem.getAttribute('data-p4').slice(0,2), phoneItem.getAttribute('data-p4').slice(2)].join(' ');
        phoneItem.setAttribute('href', 'tel:' + p);
        phoneItem.setAttribute('data-copy', displayP);
    }
})();
(function () {
    var statusEl = document.getElementById('system-status');
    if (!statusEl) return;
    statusEl.textContent = '[ OK ] System Status: ONLINE | Last commit: ...';
    if (!navigator.onLine) {
        statusEl.textContent = '[ OK ] System Status: ONLINE';
        return;
    }
    fetch('https://api.github.com/repos/furkan-sarica/furkan-sarica.github.io/commits/main')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var date = new Date(data.commit.author.date);
            var now = new Date();
            var diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            var relative = diff === 0 ? 'today' : diff === 1 ? '1 day ago' : diff + ' days ago';
            statusEl.textContent = '[ OK ] System Status: ONLINE | Last commit: ' + relative;
        })
        .catch(function () {
            statusEl.textContent = '[ OK ] System Status: ONLINE';
        });
}());

// Feature 2: Secret keyboard sequence root/sudo theme toggle — handled below with matrix rain

// Feature: Hacker Text Scramble on hero nav links
(function () {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!%&*<>?/';
    var timers = new WeakMap();
    document.querySelectorAll('.hero-nav a').forEach(function (link) {
        link.dataset.value = link.textContent;
        link.addEventListener('mouseover', function () {
            if (PortfolioUI.hareketAz()) return;
            var original = link.dataset.value;
            var iterations = 0;
            var maxIter = original.length * 3;
            clearInterval(timers.get(link));
            timers.set(link, setInterval(function () {
                link.textContent = original.split('').map(function (ch, idx) {
                    if (idx < Math.floor(iterations / 3)) return original[idx];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                iterations++;
                if (iterations > maxIter) {
                    clearInterval(timers.get(link));
                    link.textContent = original;
                }
            }, 30));
        });
        link.addEventListener('mouseleave', function () {
            clearInterval(timers.get(link));
            link.textContent = link.dataset.value;
        });
    });
}());

// Feature: Copy to Clipboard for contact items
(function () {
    function resetBadge(badge) {
        badge.classList.remove('copied');
        var trSpan = document.createElement('span');
        trSpan.setAttribute('data-lang-tr', '');
        trSpan.textContent = '[ Kopyala ]';
        var enSpan = document.createElement('span');
        enSpan.setAttribute('data-lang-en', '');
        enSpan.textContent = '[ Copy ]';
        badge.textContent = '';
        badge.appendChild(trSpan);
        badge.appendChild(enSpan);
        var lang = document.body.classList.contains('lang-tr') ? 'tr' : 'en';
        trSpan.style.display = lang === 'tr' ? 'inline' : 'none';
        enSpan.style.display = lang === 'en' ? 'inline' : 'none';
    }

    document.querySelectorAll('.contact-item[data-copy]').forEach(function (item) {
        var badge = item.querySelector('.contact-copy-badge');
        if (!badge) return;
        badge.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var text = item.dataset.copy;
            if (!text) return;
            var isLangTr = document.body.classList.contains('lang-tr');
            navigator.clipboard.writeText(text).then(function () {
                badge.classList.add('copied');
                badge.textContent = isLangTr ? '[ Kopyalandı! ]' : '[ Copied! ]';
                setTimeout(function () { resetBadge(badge); }, 2000);
            }).catch(function () {
                badge.textContent = isLangTr ? '[ Hata! ]' : '[ Error! ]';
                setTimeout(function () { resetBadge(badge); }, 2000);
            });
        });
    });
}());
