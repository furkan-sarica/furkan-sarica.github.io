// ===== Certificate Terminal Viewer Modal with Circular Nav & Keyboard Support =====
var ALL_CERTS = [
    { src: 'certs/stanford-ai.jpg', title: 'Stanford University - Artificial Intelligence Professional Certificate' },
    { src: 'certs/microsoft-ai-ml.jpg', title: 'Microsoft - AI & ML Engineering Professional Certificate' },
    { src: 'certs/vanderbilt-genai.jpg', title: 'Vanderbilt University - Generative AI Software Engineering Specialization' },
    { src: 'certs/nvidia-developer.jpg', title: 'NVIDIA - Developer Program Member' },
    { src: 'certs/ibm-isc2-cybersecurity.jpg', title: 'IBM & ISC2 - Cybersecurity Specialist Professional Certificate' },
    { src: 'certs/aws-cloud-solutions-architect.jpg', title: 'AWS - Cloud Solutions Architect Professional Certificate' },
    { src: 'certs/ibm-devops-software-engineering.jpg', title: 'IBM - DevOps and Software Engineering Professional Certificate' },
    { src: 'certs/google-it-support.jpg', title: 'Google - IT Support Professional Certificate' },
    { src: 'certs/meta-ios-developer.jpg', title: 'Meta - iOS Developer Professional Certificate' },
    { src: 'certs/akamai-network-engineering.jpg', title: 'Akamai Technologies - Network Engineering Professional Certificate' }
];
var currentCertIdx = 0;

function updateCertDisplay() {
    var cert = ALL_CERTS[currentCertIdx];
    if (!cert) return;
    var modalImg = document.getElementById('cert-modal-img');
    var modalTitle = document.getElementById('cert-modal-title');
    var modalDownload = document.getElementById('cert-modal-download');
    var counter = document.getElementById('cert-modal-counter');
    if (modalImg) {
        modalImg.src = cert.src;
        modalImg.alt = cert.title;
        modalImg.classList.remove('zoomed');
    }
    if (modalTitle) modalTitle.textContent = 'view ~/' + cert.src;
    if (modalDownload) modalDownload.href = cert.src;
    if (counter) counter.textContent = (currentCertIdx + 1) + ' / ' + ALL_CERTS.length;
}

window.openCertModal = function(imageSrc, title, tetikleyen) {
    var modal = document.getElementById('cert-modal');
    if (!modal) return;
    var foundIdx = ALL_CERTS.findIndex(function(c) { return c.src === imageSrc; });
    currentCertIdx = foundIdx !== -1 ? foundIdx : 0;
    updateCertDisplay();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    PortfolioUI.dialogAc(modal, closeCertModal, null, tetikleyen);
};

window.navCert = function(direction) {
    currentCertIdx = (currentCertIdx + direction + ALL_CERTS.length) % ALL_CERTS.length;
    updateCertDisplay();
};

window.closeCertModal = function() {
    var modal = document.getElementById('cert-modal');
    var modalImg = document.getElementById('cert-modal-img');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (modalImg) modalImg.classList.remove('zoomed');
    PortfolioUI.dialogKapat(modal);
};

window.toggleCertZoom = function() {
    var modalImg = document.getElementById('cert-modal-img');
    if (modalImg) modalImg.classList.toggle('zoomed');
};

window.toggleCertFullscreen = function() {
    var modalImg = document.getElementById('cert-modal-img');
    if (!modalImg) return;
    if (!document.fullscreenElement && modalImg.requestFullscreen) {
        modalImg.requestFullscreen().catch(function() {});
    } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(function() {});
    }
};

window.copyCurlCmd = function(btn) {
    var cmd = 'curl -s https://furkan-sarica.github.io/api.json | jq .';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(function() {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(function() { btn.innerHTML = orig; }, 2000);
        });
    }
};

document.addEventListener('keydown', function(e) {
    var modal = document.getElementById('cert-modal');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeCertModal();
        } else if (e.key === 'ArrowRight') {
            navCert(1);
        } else if (e.key === 'ArrowLeft') {
            navCert(-1);
        }
    }
});
