// Terminal görsel sistemleri ve pencere yöneticisi.
PortfolioTerminal.kaydetEfektler = function () {
// ===== Feature: CI/CD Pipeline Animation =====
(function () {
    var stageEls = {
        build:  document.getElementById('stage-build'),
        test:   document.getElementById('stage-test'),
        deploy: document.getElementById('stage-deploy')
    };
    var logEl = document.getElementById('pipeline-log');
    if (!stageEls.build || !stageEls.test || !stageEls.deploy || !logEl) return;

    var ICONS = { idle: '⬜', running: '🔄', ok: '✅', fail: '❌' };

    function setStage(name, state, icon) {
        var el = stageEls[name];
        el.className = 'pipeline-stage' + (state ? ' ' + state : '');
        el.querySelector('.pipeline-icon').textContent = icon || ICONS[state] || '⬜';
    }

    function setLog(msg, color) {
        logEl.style.color = color || 'var(--text-muted)';
        logEl.textContent = msg;
    }

    function resetAll() {
        ['build', 'test', 'deploy'].forEach(function (s) { setStage(s, '', ICONS.idle); });
        setLog('');
    }

    function runPipeline() {
        var willFail = Math.random() < 0.3; // 30% chance of test failure
        resetAll();

        // --- Build stage ---
        setTimeout(function () {
            setStage('build', 'running', ICONS.running);
            setLog('⚙ Building furkan-sarica/web:latest...');
        }, 200);

        setTimeout(function () {
            setStage('build', 'done', ICONS.ok);
            setLog('[ Build ] passed — image pushed to registry', 'var(--terminal-green)');
        }, 2400);

        // --- Test stage ---
        setTimeout(function () {
            setStage('test', 'running', ICONS.running);
            setLog('🧪 Running test suite...');
        }, 2800);

        if (willFail) {
            setTimeout(function () {
                setStage('test', 'failed', ICONS.fail);
                setLog('[ Test ] FAILED — 1 assertion error detected', '#ff4444');
            }, 4800);
            // Retry
            setTimeout(function () {
                setStage('test', 'retry', ICONS.running);
                setLog('↩ Retrying test suite...');
            }, 6200);
            setTimeout(function () {
                setStage('test', 'done', ICONS.ok);
                setLog('[ Test ] passed on retry ✓', 'var(--terminal-green)');
            }, 8200);
            // Deploy stage (offset for retry)
            setTimeout(function () {
                setStage('deploy', 'running', ICONS.running);
                setLog('🚀 Deploying to furkan-sarica.github.io...');
            }, 8700);
            setTimeout(function () {
                setStage('deploy', 'done', ICONS.ok);
                setLog('[ Deploy ] live — https://furkan-sarica.github.io ✓', 'var(--terminal-green)');
            }, 10800);
            setTimeout(runPipeline, 14000);
        } else {
            setTimeout(function () {
                setStage('test', 'done', ICONS.ok);
                setLog('[ Test ] passed — all 42 checks green', 'var(--terminal-green)');
            }, 4800);
            // Deploy stage
            setTimeout(function () {
                setStage('deploy', 'running', ICONS.running);
                setLog('🚀 Deploying to furkan-sarica.github.io...');
            }, 5300);
            setTimeout(function () {
                setStage('deploy', 'done', ICONS.ok);
                setLog('[ Deploy ] live — https://furkan-sarica.github.io ✓', 'var(--terminal-green)');
            }, 7400);
            setTimeout(runPipeline, 11000);
        }
    }

    // Start after a short delay so page loads first
    setTimeout(runPipeline, 2000);
}());

function startMatrixRain() {
    if (PortfolioUI.hareketAz()) return;
    if (document.getElementById('matrix-rain')) return;
    var canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    var fontSize = 14;
    var cols = Math.floor(canvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -100;

    var lastTime = 0;
    var frameInterval = 33; // ~30 fps

    function draw(timestamp) {
        if (!document.getElementById('matrix-rain')) return;
        if (timestamp - lastTime >= frameInterval) {
            lastTime = timestamp;
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = document.body.classList.contains('root-mode') ? '#ff3333' : '#00ff88';
            ctx.font = fontSize + 'px JetBrains Mono, monospace';
            for (var j = 0; j < drops.length; j++) {
                var ch = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(ch, j * fontSize, drops[j] * fontSize);
                if (drops[j] * fontSize > canvas.height && Math.random() > 0.975) drops[j] = 0;
                drops[j]++;
            }
        }
        canvas._matrixRafId = requestAnimationFrame(draw);
    }

    canvas._matrixRafId = requestAnimationFrame(draw);
    canvas._resizeHandler = resize;
}

function stopMatrixRain() {
    var canvas = document.getElementById('matrix-rain');
    if (!canvas) return;
    cancelAnimationFrame(canvas._matrixRafId);
    window.removeEventListener('resize', canvas._resizeHandler);
    canvas.parentNode.removeChild(canvas);
}

// Patch root mode toggle to start/stop matrix rain
(function () {
    var typed = '';
    document.addEventListener('keydown', function (e) {
        var active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
        typed += e.key;
        if (typed.length > 10) typed = typed.slice(-10);
        if (typed.endsWith('root') || typed.endsWith('sudo')) {
            var wasRoot = document.body.classList.contains('root-mode');
            document.body.classList.toggle('root-mode');
            if (!wasRoot) {
                startMatrixRain();
            } else {
                stopMatrixRain();
            }
            typed = '';
        }
    });
}());

// ===== Easter Egg: 5-Click on ASCII Header → Root Access =====
(function () {
    var clickCount = 0;
    var clickTimer = null;
    var header = document.querySelector('.ascii-header');
    if (!header) return;
    header.addEventListener('click', function () {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(function () { clickCount = 0; }, 2000);
        if (clickCount >= 5) {
            clickCount = 0;
            clearTimeout(clickTimer);
            var wasRoot = document.body.classList.contains('root-mode');
            document.body.classList.toggle('root-mode');
            if (!wasRoot) {
                startMatrixRain();
                var msg = document.createElement('div');
                msg.textContent = '[ ROOT ACCESS GRANTED ]';
                msg.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#0a0a0a;border:1px solid #ff3333;color:#ff3333;font-family:"JetBrains Mono",monospace;font-size:0.9rem;padding:10px 24px;z-index:9999;pointer-events:none;letter-spacing:2px;';
                document.body.appendChild(msg);
                setTimeout(function () { msg.parentNode && msg.parentNode.removeChild(msg); }, 2500);
            } else {
                stopMatrixRain();
            }
        }
    });
}());

// ===== Window Manager =====
(function () {
    var highestZ = 5000; // starting z-index above general content layers

    document.querySelectorAll('.terminal-window:not(.ai-terminal-window)').forEach(function (win) {
        var header = win.querySelector('.terminal-header');
        if (!header) return;

        var isDragging = false;
        var startX, startY;
        var isMaximized = false;
        var savedBeforeMax = null; // saved before maximize

        function bringToFront() {
            highestZ++;
            win.style.zIndex = String(highestZ);
        }

        function clearInlinePos() {
            win.style.position = '';
            win.style.left = '';
            win.style.top = '';
            win.style.width = '';
            win.style.height = '';
            win.style.margin = '';
            win.style.zIndex = '';
        }

        function getInlinePos() {
            return {
                position: win.style.position,
                left:     win.style.left,
                top:      win.style.top,
                width:    win.style.width,
                zIndex:   win.style.zIndex,
                margin:   win.style.margin
            };
        }

        function applyInlinePos(pos) {
            win.style.position = pos.position || '';
            win.style.left     = pos.left     || '';
            win.style.top      = pos.top      || '';
            win.style.width    = pos.width    || '';
            win.style.zIndex   = pos.zIndex   || '';
            win.style.margin   = pos.margin   || '';
        }

        // Red: close — hide window, reset to in-flow position
        function closeWindow() {
            win.classList.remove('win-maximized');
            win.classList.remove('win-minimized');
            isMaximized = false;
            isDragging = false;
            document.removeEventListener('mousemove', fareyiTasi);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', dokunmayiTasi);
            document.removeEventListener('touchend', endDrag);
            document.removeEventListener('touchcancel', endDrag);
            savedBeforeMax = null;
            clearInlinePos();
            header.style.cursor = '';
            win.classList.add('win-hidden');
        }

        // Yellow: minimize — collapse window to header bar only
        function minimizeWindow() {
            if (win.classList.contains('win-minimized')) {
                // Restore from minimized
                win.classList.remove('win-minimized');
                header.style.cursor = isMaximized ? 'default' : 'grab';
            } else {
                if (isMaximized) {
                    // Restore from maximized before minimizing
                    win.classList.remove('win-maximized');
                    isMaximized = false;
                    if (savedBeforeMax) {
                        applyInlinePos(savedBeforeMax);
                        savedBeforeMax = null;
                    }
                }
                win.classList.add('win-minimized');
                header.style.cursor = 'grab';
            }
        }

        // Green: maximize / restore
        function toggleMaximize() {
            if (isMaximized) {
                win.classList.remove('win-maximized');
                isMaximized = false;
                if (savedBeforeMax) {
                    applyInlinePos(savedBeforeMax);
                    savedBeforeMax = null;
                }
                header.style.cursor = 'grab';
            } else {
                savedBeforeMax = getInlinePos();
                clearInlinePos();
                win.classList.remove('win-minimized');
                win.classList.add('win-maximized');
                bringToFront();
                isMaximized = true;
                header.style.cursor = 'default';
            }
        }

        function startDrag(clientX, clientY) {
            if (isMaximized) return;
            var rect = win.getBoundingClientRect();
            win.style.position = 'fixed';
            win.style.left = rect.left + 'px';
            win.style.top  = rect.top  + 'px';
            win.style.width = rect.width + 'px';
            win.style.margin = '0';
            bringToFront();
            startX = clientX - rect.left;
            startY = clientY - rect.top;
            isDragging = true;
            document.addEventListener('mousemove', fareyiTasi);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', dokunmayiTasi, { passive: false });
            document.addEventListener('touchend', endDrag);
            document.addEventListener('touchcancel', endDrag);
            header.style.cursor = 'grabbing';
        }

        function doDrag(clientX, clientY) {
            if (!isDragging) return;
            win.style.left = Math.max(0, Math.min(clientX - startX, innerWidth - win.offsetWidth)) + 'px';
            win.style.top = Math.max(0, Math.min(clientY - startY, innerHeight - header.offsetHeight)) + 'px';
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('mousemove', fareyiTasi);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', dokunmayiTasi);
            document.removeEventListener('touchend', endDrag);
            document.removeEventListener('touchcancel', endDrag);
            header.style.cursor = 'grab';
        }

        var redBtn    = header.querySelector('.t-btn-red');
        var yellowBtn = header.querySelector('.t-btn-yellow');
        var greenBtn  = header.querySelector('.t-btn-green');

        if (redBtn)    redBtn.addEventListener('click',    function (e) { e.stopPropagation(); closeWindow(); });
        if (yellowBtn) yellowBtn.addEventListener('click', function (e) { e.stopPropagation(); minimizeWindow(); });
        if (greenBtn)  greenBtn.addEventListener('click',  function (e) { e.stopPropagation(); toggleMaximize(); });

        header.addEventListener('mousedown', function (e) {
            if (e.target.classList.contains('t-btn')) return;
            startDrag(e.clientX, e.clientY);
            e.preventDefault();
        });

        function fareyiTasi(e) { doDrag(e.clientX, e.clientY); }

        header.addEventListener('touchstart', function (e) {
            if (e.target.classList.contains('t-btn')) return;
            var touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
            e.preventDefault();
        }, { passive: false });

        function dokunmayiTasi(e) {
            if (!isDragging || !e.touches.length) return;
            var touch = e.touches[0];
            doDrag(touch.clientX, touch.clientY);
            e.preventDefault();
        }

    });
}());
window.startMatrixRain = startMatrixRain;
window.stopMatrixRain = stopMatrixRain;
};
