// ===== PWA Service Worker Registration & Install Management =====
window._deferredPWAInstallPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    window._deferredPWAInstallPrompt = e;
    console.log('[PWA] beforeinstallprompt captured and ready');
});

window.addEventListener('appinstalled', function() {
    window._deferredPWAInstallPrompt = null;
    console.log('[PWA] Application successfully installed');
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
            console.log('[PWA] Service Worker registered, scope:', reg.scope);
        }).catch(function(err) {
            console.log('[PWA] Service Worker registration failed:', err);
        });
    });
}
