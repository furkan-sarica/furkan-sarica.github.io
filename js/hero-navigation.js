// Typing effect for hero
document.addEventListener('DOMContentLoaded', () => {
// Set initial aria-hidden for screen readers
document.querySelectorAll('[data-lang-en], [data-lang-en-block], [data-lang-en-grid], [data-lang-en-li]').forEach(function(el) {
    el.setAttribute('aria-hidden', 'true');
});
document.querySelectorAll('[data-lang-tr], [data-lang-tr-block], [data-lang-tr-grid], [data-lang-tr-li]').forEach(function(el) {
    el.setAttribute('aria-hidden', 'false');
});

const text = "Furkan SARICA";
const typingElement = document.querySelector('.typing');
if (typingElement) {
    typingElement.textContent = '';
    let i = 0;
    let started = false;

    function runTerminalTypewriter() {
        if (started) return;
        started = true;
        typingElement.textContent = '';
        function typeStep() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeStep, 55);
            }
        }
        typeStep();
    }

    var bootScreen = document.getElementById('boot-screen');
    if (bootScreen) {
        var bootObserver = new MutationObserver(function() {
            if (bootScreen.classList.contains('fade-out') || bootScreen.style.display === 'none') {
                setTimeout(runTerminalTypewriter, 150);
                bootObserver.disconnect();
            }
        });
        bootObserver.observe(bootScreen, { attributes: true, attributeFilter: ['class', 'style'] });
        setTimeout(runTerminalTypewriter, 1600);
    } else {
        setTimeout(runTerminalTypewriter, 250);
    }
}
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
});
});

// Intersection Observer animations
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0)';
}
});
}, observerOptions);

document.querySelectorAll('.terminal-card, .cert-card, .project-card, .tool-box, .edu-item, .homelab-card, .exp-card').forEach(el => {
el.style.opacity = '0';
el.style.transform = 'translateY(20px)';
el.style.transition = 'opacity 0.5s, transform 0.5s';
observer.observe(el);
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');
backToTopBtn.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', () => {
if (window.scrollY > 300) {
backToTopBtn.classList.add('visible');
} else {
backToTopBtn.classList.remove('visible');
}
});
console.log("%c[!] Merhaba geliştirici! / Hello developer! 🚀\nKodlarımı incelediğini görüyorum. LinkedIn üzerinden veya terminalden 'contact' yazarak iletişime geçebilirsin!", "color: #00d4ff; font-size: 14px;");
