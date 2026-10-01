// Metrikler, ses, pong ve AFK; özgün çalışma sırası korunur.
PortfolioTerminal.kaydetRuntime = function () {
// ===== Feature: Live Server Metrics =====
(function () {
    var metricsEl = document.getElementById('server-metrics');
    if (!metricsEl) return;
    var pageLoadTime = Date.now();
    setInterval(function () {
        var elapsed = Math.floor((Date.now() - pageLoadTime) / 1000);
        var hh = Math.floor(elapsed / 3600);
        var mm = Math.floor((elapsed % 3600) / 60);
        var ss = elapsed % 60;
        var uptime = (hh > 0 ? String(hh).padStart(2, '0') + ':' : '') +
                     String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
        var cpu = Math.floor(Math.random() * 21) + 5;
        var ram = 1024 + Math.floor(Math.random() * 50);
        var ramPct = Math.round((ram / 4096) * 100);
        var filled = Math.round(cpu / 10);
        var empty = 10 - filled;
        var cpuBar = '|'.repeat(filled) + '.'.repeat(empty);
        metricsEl.textContent = '[ UPTIME: ' + uptime + ' ] | [ CPU: ' + cpuBar + ' ' + cpu + '% ] | [ RAM: ' + ram + 'MB / 4096MB (' + ramPct + '%) ]';
    }, 1000);
}());

// ===== Feature: Sound Effects =====
(function () {
    var soundEnabled = false;
    var audioCtx = null;

    function getCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    window.playClick = function () {
        if (!soundEnabled) return;
        try {
            var ctx = getCtx();
            var buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
            var data = buf.getChannelData(0);
            for (var i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
            }
            var src = ctx.createBufferSource();
            src.buffer = buf;
            var gain = ctx.createGain();
            gain.gain.value = 0.12;
            src.connect(gain);
            gain.connect(ctx.destination);
            src.start();
        } catch (e) {}
    };

    window.playBeep = function () {
        if (!soundEnabled) return;
        try {
            var ctx = getCtx();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 440;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.18);
        } catch (e) {}
    };

    var muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', function () {
            soundEnabled = !soundEnabled;
            muteBtn.textContent = soundEnabled ? '🔊' : '🔇';
            muteBtn.title = soundEnabled
                ? (currentLang === 'tr' ? 'Sesi Kapat' : 'Mute Sounds')
                : (currentLang === 'tr' ? 'Sesi Aç' : 'Enable Sounds');
        });
    }
}());

// ===== Feature: Ping Pong Mini-game =====
(function () {
    var gameActive = false;
    var animId = null;
    var gameKeyHandler = null;
    var gameKeys = {};

    var overlay = document.getElementById('ping-pong-overlay');
    var canvas = document.getElementById('ping-pong-canvas');
    var cliOutput = document.getElementById('cli-output');
    var cliInputLine = document.getElementById('cli-input-line');

    function addCliLine(text, cls) {
        if (!cliOutput) return;
        var line = document.createElement('div');
        line.className = 'cli-history-line cli-line' + (cls ? ' ' + cls : '');
        line.textContent = text;
        cliOutput.appendChild(line);
        var box = document.getElementById('cli-box');
        if (box) box.scrollTop = box.scrollHeight;
    }

    function startGame() {
        if (gameActive || !overlay || !canvas) return;
        gameActive = true;

        overlay.style.display = 'block';
        if (cliOutput) cliOutput.style.display = 'none';
        if (cliInputLine) cliInputLine.style.display = 'none';

        var W = (overlay.offsetWidth || 600);
        var H = 200;
        canvas.width = W;
        canvas.height = H;
        var ctx = canvas.getContext('2d');

        var paddleW = 8, paddleH = 50;
        var ballSz = 7;
        var playerY = H / 2 - paddleH / 2;
        var aiY = H / 2 - paddleH / 2;
        var ballX = W / 2, ballY = H / 2;
        var ballVX = 3, ballVY = 2;
        var playerScore = 0, aiScore = 0;
        gameKeys = {};

        gameKeyHandler = function (e) {
            if (e.type === 'keydown') {
                gameKeys[e.key] = true;
                if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
                    e.preventDefault();
                    stopGame();
                    return;
                }
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
            } else {
                gameKeys[e.key] = false;
            }
        };
        document.addEventListener('keydown', gameKeyHandler);
        document.addEventListener('keyup', gameKeyHandler);

        function resetBall() {
            ballX = W / 2; ballY = H / 2;
            ballVX = (Math.random() > 0.5 ? 1 : -1) * 3;
            ballVY = (Math.random() > 0.5 ? 1 : -1) * 2;
        }

        function drawFrame() {
            if (!gameActive) return;

            if ((gameKeys['ArrowUp'] || gameKeys['w'] || gameKeys['W']) && playerY > 0) playerY -= 4;
            if ((gameKeys['ArrowDown'] || gameKeys['s'] || gameKeys['S']) && playerY + paddleH < H) playerY += 4;

            var aiCenter = aiY + paddleH / 2;
            if (aiCenter < ballY - 2) aiY = Math.min(aiY + 3, H - paddleH);
            if (aiCenter > ballY + 2) aiY = Math.max(aiY - 3, 0);

            ballX += ballVX; ballY += ballVY;

            if (ballY - ballSz / 2 <= 0) { ballY = ballSz / 2; ballVY = Math.abs(ballVY); }
            if (ballY + ballSz / 2 >= H) { ballY = H - ballSz / 2; ballVY = -Math.abs(ballVY); }

            if (ballX - ballSz / 2 <= paddleW && ballY >= playerY && ballY <= playerY + paddleH) {
                ballX = paddleW + ballSz / 2;
                ballVX = Math.abs(ballVX) * 1.05;
                ballVY += (ballY - (playerY + paddleH / 2)) * 0.15;
            }
            if (ballX + ballSz / 2 >= W - paddleW && ballY >= aiY && ballY <= aiY + paddleH) {
                ballX = W - paddleW - ballSz / 2;
                ballVX = -Math.abs(ballVX) * 1.05;
                ballVY += (ballY - (aiY + paddleH / 2)) * 0.15;
            }

            var maxVX = 10, maxVY = 7;
            if (Math.abs(ballVX) > maxVX) ballVX = maxVX * Math.sign(ballVX);
            if (Math.abs(ballVY) > maxVY) ballVY = maxVY * Math.sign(ballVY);

            if (ballX < 0) { aiScore++; resetBall(); }
            if (ballX > W) { playerScore++; resetBall(); }

            ctx.fillStyle = '#0a0c10';
            ctx.fillRect(0, 0, W, H);

            ctx.fillStyle = '#00ff88';
            ctx.fillRect(0, playerY, paddleW, paddleH);
            ctx.fillRect(W - paddleW, aiY, paddleW, paddleH);
            ctx.fillRect(ballX - ballSz / 2, ballY - ballSz / 2, ballSz, ballSz);

            ctx.strokeStyle = 'rgba(0,255,136,0.2)';
            ctx.setLineDash([5, 10]);
            ctx.beginPath();
            ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(0,255,136,0.8)';
            ctx.font = '13px JetBrains Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText('YOU: ' + playerScore, 10, 18);
            ctx.textAlign = 'right';
            ctx.fillText('CPU: ' + aiScore, W - 10, 18);

            animId = requestAnimationFrame(drawFrame);
        }

        drawFrame();
    }

    function stopGame() {
        if (!gameActive) return;
        gameActive = false;
        if (animId) cancelAnimationFrame(animId);
        if (gameKeyHandler) {
            document.removeEventListener('keydown', gameKeyHandler);
            document.removeEventListener('keyup', gameKeyHandler);
        }
        if (overlay) overlay.style.display = 'none';
        if (cliOutput) cliOutput.style.display = '';
        if (cliInputLine) cliInputLine.style.display = '';
        addCliLine('Game over. Connection closed.', 'ok');
        var inp = document.getElementById('cli-input');
        if (inp) inp.focus();
    }

    window.startPingPong = startGame;
    window.stopPingPong = stopGame;
}());

// ===== Feature: AFK Screensaver (Terminal Analog Clock) =====
(function () {
    var overlay = document.getElementById('screensaver');
    var clockEl = document.getElementById('screensaver-clock');
    if (!overlay || !clockEl) return;

    var isActive = false;
    var idleTimer = null;
    var clockInterval = null;
    var IDLE_MS = 60000;

    // Grid dimensions – horizontal radius is ~2× vertical to look circular in monospace
    var ROWS = 21, COLS = 43, CY = 10, CX = 21, RY = 9, RX = 19;
    // Oversampling factor: ensures dense character coverage along each hand line
    var HAND_STEPS_PER_CELL = 4;

    function setCell(grid, r, c, ch) {
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            grid[r][c] = ch;
        }
    }

    // Draw a hand from the centre to its tip using the given character
    function drawHand(grid, angleRad, lenFrac, ch) {
        var steps = Math.ceil(Math.max(RY, RX) * lenFrac * HAND_STEPS_PER_CELL);
        for (var i = 1; i <= steps; i++) {
            var t = (i / steps) * lenFrac;
            var r = Math.round(CY + RY * t * Math.sin(angleRad));
            var c = Math.round(CX + RX * t * Math.cos(angleRad));
            setCell(grid, r, c, ch);
        }
    }

    function drawClock() {
        var now = new Date();
        var H = now.getHours() % 12;
        var M = now.getMinutes();
        var S = now.getSeconds();

        // Empty grid
        var grid = [];
        for (var r = 0; r < ROWS; r++) {
            grid.push(new Array(COLS).fill(' '));
        }

        // Clock face circle (dots)
        for (var deg = 0; deg < 360; deg++) {
            var a = deg * Math.PI / 180;
            var cr = Math.round(CY + RY * Math.sin(a));
            var cc = Math.round(CX + RX * Math.cos(a));
            if (cr >= 0 && cr < ROWS && cc >= 0 && cc < COLS && grid[cr][cc] === ' ') {
                grid[cr][cc] = '.';
            }
        }

        // Hour numbers on the face (overwrite dots)
        for (var hr = 1; hr <= 12; hr++) {
            var ha = (hr / 12) * 2 * Math.PI - Math.PI / 2;
            var mr = Math.round(CY + RY * Math.sin(ha));
            var mc = Math.round(CX + RX * Math.cos(ha));
            var label = String(hr);
            var sc = mc - Math.floor(label.length / 2);
            for (var li = 0; li < label.length; li++) {
                setCell(grid, mr, sc + li, label[li]);
            }
        }

        // Hand angles – clockwise from 12 o'clock (= −π/2 from positive x-axis)
        var sAngle = (S / 60) * 2 * Math.PI - Math.PI / 2;
        var mAngle = ((M + S / 60) / 60) * 2 * Math.PI - Math.PI / 2;
        var hAngle = ((H + M / 60) / 12) * 2 * Math.PI - Math.PI / 2;

        // Draw hands – h first so s ends up on top
        drawHand(grid, hAngle, 0.50, 'h');
        drawHand(grid, mAngle, 0.75, 'm');
        drawHand(grid, sAngle, 0.88, 's');

        // Centre pivot
        setCell(grid, CY, CX, '+');

        // Digital readout at bottom
        var timeStr = '[ ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(M).padStart(2, '0') + ':' +
            String(S).padStart(2, '0') + ' ]';
        var tstart = Math.floor((COLS - timeStr.length) / 2);
        for (var ci = 0; ci < timeStr.length; ci++) {
            setCell(grid, ROWS - 1, tstart + ci, timeStr[ci]);
        }

        clockEl.textContent = grid.map(function (row) { return row.join(''); }).join('\n');
    }

    function scaleToFit() {
        clockEl.style.transform = '';
        var cw = clockEl.offsetWidth;
        var ch = clockEl.offsetHeight;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var scale = Math.min((vw * 0.92) / cw, (vh * 0.92) / ch);
        if (scale < 1) {
            clockEl.style.transform = 'scale(' + scale.toFixed(4) + ')';
        }
    }

    function show() {
        if (isActive) return;
        isActive = true;
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        drawClock();
        scaleToFit();
        clockInterval = setInterval(drawClock, 1000);
    }

    function hide() {
        if (!isActive) return;
        isActive = false;
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        clearInterval(clockInterval);
        resetIdle();
    }

    function resetIdle() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(show, IDLE_MS);
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
        if (!isActive) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(scaleToFit, 150);
    }, { passive: true });

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
        document.addEventListener(evt, function () {
            if (isActive) hide();
            else resetIdle();
        }, { passive: true });
    });

    resetIdle();
}());

};
