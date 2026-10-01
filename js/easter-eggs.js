// ===== 10/10 FINAL: Konami Code Easter Egg =====
(function() {
    var KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var input = [];

    document.addEventListener('keydown', function(e) {
        input.push(e.key);
        if (input.length > KONAMI.length) input.shift();

        if (input.length === KONAMI.length && input.every(function(k, i) { return k === KONAMI[i]; })) {
            // Konami triggered!
            input = [];

            // Toggle hacker mode
            document.body.classList.toggle('hacker-mode');

            var isHacker = document.body.classList.contains('hacker-mode');

            // Show notification
            var notif = document.createElement('div');
            notif.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#000;border:2px solid ' + (isHacker ? '#39ff14' : '#00ff88') + ';padding:2rem 3rem;z-index:100001;font-family:"JetBrains Mono",monospace;font-size:1.2rem;color:' + (isHacker ? '#39ff14' : '#00ff88') + ';text-align:center;box-shadow:0 0 60px ' + (isHacker ? 'rgba(57,255,20,0.5)' : 'rgba(0,255,136,0.5)') + ';';
            notif.innerHTML = isHacker
                ? '<div style="font-size:2rem;margin-bottom:0.5rem;">👾</div>HACKER MODE ACTIVATED<br><span style="font-size:0.8rem;color:#666;">Matrix rain intensified. Cursor synced. Grain amplified.</span>'
                : '<div style="font-size:2rem;margin-bottom:0.5rem;">✅</div>NORMAL MODE RESTORED<br><span style="font-size:0.8rem;color:#666;">Systems nominal. Welcome back, operator.</span>';
            document.body.appendChild(notif);

            setTimeout(function() {
                notif.style.transition = 'opacity 0.5s';
                notif.style.opacity = '0';
                setTimeout(function() { notif.remove(); }, 500);
            }, 2500);

            // Toggle matrix rain & terminal prompt
            var promptEl = document.getElementById('cli-prompt');
            if (isHacker) {
                if (typeof startMatrixRain === 'function') startMatrixRain();
                if (promptEl) promptEl.textContent = 'root@devops:~#';
                if (window.cliAddLine) window.cliAddLine('[ ROOT / HACKER ACCESS GRANTED ]', 'ok');
            } else {
                if (typeof stopMatrixRain === 'function') stopMatrixRain();
                if (promptEl) promptEl.textContent = 'furkan@devops:~$';
                if (window.cliAddLine) window.cliAddLine('[ Normal mode restored ]', 'ok');
            }
        }
    });
}());
