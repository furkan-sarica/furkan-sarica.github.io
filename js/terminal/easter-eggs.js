// Terminal oyunları ve özel komutlar.
PortfolioTerminal.kaydet(function (baglam) {
function startSelfDestruct() {
        baglam.addLine('[CRITICAL] Initiating system destruction sequence...', 'err');
        var allEls = Array.from(document.querySelectorAll('div, section, p, h1, h2, a, span, button'));
        var destroyInterval = setInterval(function () {
            var batch = Math.floor(Math.random() * 8) + 3;
            for (var b = 0; b < batch; b++) {
                var idx = Math.floor(Math.random() * allEls.length);
                var el = allEls[idx];
                if (el && el.parentNode) {
                    if (Math.random() < 0.5) {
                        el.style.display = 'none';
                    } else {
                        el.style.visibility = 'hidden';
                    }
                }
            }
        }, 100);
        setTimeout(function () {
            clearInterval(destroyInterval);
            document.body.innerHTML = '';
            document.body.style.cssText = 'margin:0;padding:0;background:#000;';
            var wrap = document.createElement('div');
            wrap.style.cssText = 'position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2rem;font-family:"JetBrains Mono",monospace;color:#fff;';
            var msg = document.createElement('div');
            msg.style.cssText = 'font-size:1.5rem;letter-spacing:3px;';
            msg.textContent = 'System Halted.';
            var rebootMsg = document.createElement('div');
            rebootMsg.style.cssText = 'font-size:0.9rem;color:#aaa;letter-spacing:1px;';
            var countdown = 5;
            rebootMsg.textContent = 'Rebooting in ' + countdown + '...';
            wrap.appendChild(msg);
            wrap.appendChild(rebootMsg);
            document.body.appendChild(wrap);
            var cdInterval = setInterval(function () {
                countdown--;
                if (countdown <= 0) {
                    clearInterval(cdInterval);
                    rebootMsg.textContent = 'Rebooting...';
                    setTimeout(function () { location.reload(); }, 400);
                } else {
                    rebootMsg.textContent = 'Rebooting in ' + countdown + '...';
                }
            }, 1000);
        }, 4000);
    }
    baglam.startSelfDestruct = startSelfDestruct;

function showVimOverlay(filename) {
        var overlay = document.getElementById('vim-overlay');
        var mainEl = document.getElementById('vim-main');
        var filenameEl = document.getElementById('vim-filename');
        var modeEl = document.getElementById('vim-mode-indicator');
        var cmdlineEl = document.getElementById('vim-cmdline');
        if (!overlay || !mainEl) return;

        // Build tilde lines to fill the viewport
        var lineCount = Math.max(30, Math.floor(window.innerHeight / 22));
        var linesHtml = '';
        for (var i = 0; i < lineCount; i++) {
            linesHtml += '<div class="vim-line"><span class="vim-tilde">~</span></div>';
        }
        mainEl.innerHTML = linesHtml;

        var displayName = (filename && filename !== '') ? filename : '[No Name]';
        if (filenameEl) filenameEl.textContent = '"' + displayName + '"  0L, 0C';
        if (modeEl) modeEl.textContent = '';
        if (cmdlineEl) cmdlineEl.textContent = '';

        baglam.vimActive = true;
        baglam.vimCmdMode = false;
        baglam.vimCmdLine = '';

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        overlay.focus();
    }
    baglam.showVimOverlay = showVimOverlay;

function closeVimOverlay() {
        var overlay = document.getElementById('vim-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        }
        baglam.vimActive = false;
        baglam.vimCmdMode = false;
        baglam.vimCmdLine = '';
        if (baglam.input) baglam.input.focus();
    }
    baglam.closeVimOverlay = closeVimOverlay;

function triggerForkBomb() {
        baglam.addLine(':(){ :|:& };:', 'err');
        var garbage = ['fork: retry: Resource temporarily unavailable',
            'fork: retry: No child processes',
            'bash: fork: Cannot allocate memory'];
        var spamCount = 0;
        var maxSpam = 60;
        var spamInterval = setInterval(function () {
            spamCount++;
            if (spamCount > maxSpam) { clearInterval(spamInterval); return; }
            if (Math.random() > 0.4) {
                baglam.addLine(garbage[Math.floor(Math.random() * garbage.length)], 'err');
            } else {
                var chars = '!@#$%^&*()_+{}|:<>?ABCDEFGabcdefg0123456789';
                var garb = '';
                for (var j = 0; j < 45; j++) {
                    garb += chars[Math.floor(Math.random() * chars.length)];
                }
                baglam.addLine(garb, 'err');
            }
        }, 60);

        setTimeout(function () {
            clearInterval(spamInterval);
            baglam.showKernelPanic();
        }, 2800);
    }
    baglam.triggerForkBomb = triggerForkBomb;

document.addEventListener('keydown', function (e) {
        if (!baglam.vimActive) return;
        e.preventDefault();
        e.stopPropagation();

        var modeEl = document.getElementById('vim-mode-indicator');
        var cmdlineEl = document.getElementById('vim-cmdline');

        if (baglam.vimCmdMode) {
            if (e.key === 'Enter') {
                var trimmed = baglam.vimCmdLine.trim();
                if (trimmed === ':q' || trimmed === ':wq' || trimmed === ':q!' || trimmed === ':wq!') {
                    baglam.closeVimOverlay();
                    baglam.addLine('[vim] Saved. Welcome back.', 'ok');
                } else {
                    if (cmdlineEl) cmdlineEl.textContent = 'E492: Not an editor command: ' + baglam.vimCmdLine.slice(1);
                    baglam.vimCmdMode = false;
                    baglam.vimCmdLine = '';
                    if (modeEl) modeEl.textContent = '';
                }
            } else if (e.key === 'Escape') {
                baglam.vimCmdMode = false;
                baglam.vimCmdLine = '';
                if (cmdlineEl) cmdlineEl.textContent = '';
                if (modeEl) modeEl.textContent = '';
            } else if (e.key === 'Backspace') {
                if (baglam.vimCmdLine.length > 1) {
                    baglam.vimCmdLine = baglam.vimCmdLine.slice(0, -1);
                    if (cmdlineEl) cmdlineEl.textContent = baglam.vimCmdLine;
                } else {
                    baglam.vimCmdMode = false;
                    baglam.vimCmdLine = '';
                    if (cmdlineEl) cmdlineEl.textContent = '';
                    if (modeEl) modeEl.textContent = '';
                }
            } else if (e.key.length === 1) {
                baglam.vimCmdLine += e.key;
                if (cmdlineEl) cmdlineEl.textContent = baglam.vimCmdLine;
            }
        } else {
            // Normal mode
            if (e.key === ':') {
                baglam.vimCmdMode = true;
                baglam.vimCmdLine = ':';
                if (cmdlineEl) cmdlineEl.textContent = baglam.vimCmdLine;
                if (modeEl) modeEl.textContent = '';
            } else if (e.key === 'i' || e.key === 'a' || e.key === 'o' || e.key === 'O' || e.key === 'A' || e.key === 'I') {
                if (modeEl) modeEl.textContent = '-- INSERT --';
            } else if (e.key === 'v') {
                if (modeEl) modeEl.textContent = '-- VISUAL --';
            } else if (e.key === 'Escape') {
                if (modeEl) modeEl.textContent = '';
                if (cmdlineEl) cmdlineEl.textContent = '';
            }
        }
    }, true);

baglam.komutlar.push({ sira: 3, eslesir: function (c, cmd) { return c === 'sudo rm -rf /' || c === 'sudo rm -rf /*' || c === 'sudo rm -rf ~' || c === 'sudo rm -rf'; }, calistir: function (c, cmd) {
            baglam.addLine('[WARNING] Are you sure? This will delete the portfolio! [y/N]', 'err');
            baglam.awaitingSelfDestruct = true;
        } });

baglam.komutlar.push({ sira: 4, eslesir: function (c, cmd) { return c === 'sudo apt update' || c === 'sudo apt-get update'; }, calistir: function (c, cmd) {
            (function () {
                var lines = [
                    'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease',
                    'Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]',
                    'Get:3 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]',
                    'Get:4 http://archive.ubuntu.com/ubuntu jammy-backports InRelease [107 kB]',
                    'Get:5 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 Packages [1,823 kB]',
                    'Get:6 http://archive.ubuntu.com/ubuntu jammy-updates/universe amd64 Packages [918 kB]',
                    'Fetched 3,077 kB in 2s (1,538 kB/s)',
                    'Reading package lists... Done',
                    'Building dependency tree... Done',
                    'Reading state information... Done',
                    '42 packages can be upgraded. Run \'sudo apt upgrade\' to apply them.'
                ];
                var i = 0;
                var iv = setInterval(function () {
                    if (i < lines.length) { baglam.addLine(lines[i++]); }
                    else { clearInterval(iv); }
                }, 120);
            }());
        } });

baglam.komutlar.push({ sira: 5, eslesir: function (c, cmd) { return c === 'sudo apt upgrade' || c === 'sudo apt-get upgrade' || c === 'sudo apt upgrade -y' || c === 'sudo apt-get upgrade -y'; }, calistir: function (c, cmd) {
            (function () {
                var lines = [
                    'Reading package lists... Done',
                    'Building dependency tree... Done',
                    'Calculating upgrade... Done',
                    'The following packages will be upgraded:',
                    '  furkan-sarica-skills-v2.0  linux-firmware  openssl  curl  git  docker-ce',
                    '  nginx  openssh-server  python3  ansible  terraform  kubectl',
                    '42 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.',
                    'Need to get 128 MB of archives.',
                    'After this operation, 4,096 kB of additional disk space will be used.',
                    'Get:1 http://archive.ubuntu.com/ubuntu furkan-sarica-skills-v2.0 amd64 [8,192 kB]',
                    'Get:2 http://archive.ubuntu.com/ubuntu networking-protocols-advanced amd64 [4,096 kB]',
                    'Fetched 128 MB in 5s (25.6 MB/s)',
                    'Preparing to unpack furkan-sarica-skills-v2.0...',
                    'Unpacking furkan-sarica-skills-v2.0 (over 1.0-beta)...',
                    'Setting up furkan-sarica-skills-v2.0...',
                    'Preparing to unpack networking-protocols-advanced...',
                    'Unpacking networking-protocols-advanced (over 0.9)...',
                    'Setting up networking-protocols-advanced...',
                    'Processing triggers for systemd (249.11-0ubuntu3) ...',
                    '',
                    'System is fully upgraded. Developer is ready for hire.'
                ];
                var i = 0;
                var iv = setInterval(function () {
                    if (i < lines.length) { baglam.addLine(lines[i++], lines[i - 1].indexOf('ready for hire') !== -1 ? 'ok' : ''); }
                    else { clearInterval(iv); }
                }, 100);
            }());
        } });

baglam.komutlar.push({ sira: 6, eslesir: function (c, cmd) { return c === 'sudo' || c.startsWith('sudo '); }, calistir: function (c, cmd) {
            baglam.addLine('Access denied: I can\'t let you delete this server!', 'err');
        } });

baglam.komutlar.push({ sira: 7, eslesir: function (c, cmd) { return c === 'exit'; }, calistir: function (c, cmd) {
            baglam.addLine('logout', 'ok');
            baglam.currentDir = '/home/furkan';
            baglam.updatePrompt();
            if (document.body.classList.contains('root-mode')) {
                document.body.classList.remove('root-mode');
                stopMatrixRain();
            }
        } });

baglam.komutlar.push({ sira: 42, eslesir: function (c, cmd) { return c === 'vim' || c === 'vi' || c.startsWith('vim ') || c.startsWith('vi '); }, calistir: function (c, cmd) {
            var vimArg = (c.startsWith('vim ') || c.startsWith('vi ')) ? cmd.slice(cmd.indexOf(' ') + 1).trim() : '[No Name]';
            baglam.showVimOverlay(vimArg);

        // ===== Fork Bomb =====
        } });

baglam.komutlar.push({ sira: 43, eslesir: function (c, cmd) { return cmd === ':(){ :|:& };:'; }, calistir: function (c, cmd) {
            baglam.triggerForkBomb();

        // ===== Coffee (HTTP 418) =====
        } });

baglam.komutlar.push({ sira: 44, eslesir: function (c, cmd) { return c === 'coffee' || c === 'make coffee' || c === 'brew coffee'; }, calistir: function (c, cmd) {
            baglam.addLine('');
            baglam.addLine('     )  (          ');
            baglam.addLine('    (   ) )         ');
            baglam.addLine('     ) ( (          ');
            baglam.addLine('  __________)_      ');
            baglam.addLine(" .-'------------|   ");
            baglam.addLine("( C|/\\/\\/\\/\\/\\|   ");
            baglam.addLine(" '-./\\/\\/\\/\\/\\|   ");
            baglam.addLine("   '----------'    ");
            baglam.addLine("    '-------'      ");
            baglam.addLine('');
            baglam.addLine('HTTP/1.1 418 I\'m a Teapot', 'err');
            baglam.addLine('Error 418: I\'m a teapot. But here is your coffee anyway. ☕', 'ok');

        // ===== htop / top Simulation =====
        } });

baglam.komutlar.push({ sira: 45, eslesir: function (c, cmd) { return c === 'htop' || c === 'top'; }, calistir: function (c, cmd) {
            (function () {
                var overlay = document.createElement('div');
                overlay.id = 'htop-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0a0a0a;color:#00ff88;font-family:"JetBrains Mono",monospace;font-size:13px;z-index:9999;padding:8px;box-sizing:border-box;overflow:hidden;white-space:pre;';
                var cores = [
                    function(v){return v + Math.floor(Math.random()*6)-3;},
                    function(v){return v + Math.floor(Math.random()*6)-3;},
                    function(v){return v + Math.floor(Math.random()*6)-3;},
                    function(v){return v + Math.floor(Math.random()*6)-3;}
                ];
                var coreVals = [42, 17, 61, 28];
                var memUsed = 1724;
                var processes = [
                    { pid: '1337', user: 'furkan',  pri: 20, ni: 0, virt: '512M', res: '128M', shr: '64M', s: 'S', cpu: '12.5', mem: '3.1', time: '4:20.00', cmd: 'nginx: worker'         },
                    { pid: '2048', user: 'root',    pri: 20, ni: 0, virt: '1.2G', res: '256M', shr: '32M', s: 'S', cpu:  '8.3', mem: '6.2', time: '2:15.42', cmd: 'dockerd'                },
                    { pid: '4096', user: 'furkan',  pri: 20, ni: 0, virt: '892M', res: '210M', shr: '48M', s: 'R', cpu:  '6.1', mem: '5.1', time: '1:37.08', cmd: 'node app.js'            },
                    { pid:  '512', user: 'root',    pri: 20, ni: 0, virt: '128M', res:  '32M', shr: '16M', s: 'S', cpu:  '2.0', mem: '0.8', time: '0:42.11', cmd: 'sshd: furkan@pts/0'     },
                    { pid:  '777', user: 'furkan',  pri: 20, ni: 0, virt: '256M', res:  '64M', shr: '24M', s: 'S', cpu:  '1.4', mem: '1.5', time: '0:18.55', cmd: 'bash'                   },
                    { pid: '3141', user: 'www-data',pri: 20, ni: 0, virt: '384M', res:  '96M', shr: '40M', s: 'S', cpu:  '0.7', mem: '2.3', time: '0:09.30', cmd: 'nginx: master'          },
                    { pid: '8080', user: 'furkan',  pri: 20, ni: 0, virt: '430M', res: '110M', shr: '28M', s: 'S', cpu:  '0.5', mem: '2.7', time: '0:05.12', cmd: 'docker: portfolio-api'  },
                    { pid:   '1', user: 'root',     pri: 20, ni: 0, virt:  '64M', res:   '8M', shr:  '4M', s: 'S', cpu:  '0.0', mem: '0.2', time: '0:01.77', cmd: 'systemd'               }
                ];
                function bar(pct, width, color) {
                    var filled = Math.round(pct / 100 * width);
                    return '<span style="color:' + color + '">' + '|'.repeat(filled) + '</span>' + ' '.repeat(Math.max(0, width - filled));
                }
                function render() {
                    coreVals = coreVals.map(function(v, i) { return Math.min(99, Math.max(1, cores[i](v))); });
                    memUsed = Math.min(3900, Math.max(1500, memUsed + Math.floor(Math.random() * 20) - 10));
                    var mem = Math.round(memUsed / 4096 * 100);
                    var now = new Date();
                    var ts = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
                    var html = '';
                    html += '<span style="background:#00ff88;color:#0a0a0a;padding:0 4px">  htop  </span>  Tasks: 8, 1 running  Load avg: 0.42 0.38 0.30  Uptime: 04:20:00\n';
                    html += '\n';
                    html += ' 1[' + bar(coreVals[0], 30, '#00ff88') + '] ' + String(coreVals[0]).padStart(3) + '%\n';
                    html += ' 2[' + bar(coreVals[1], 30, '#00bfff') + '] ' + String(coreVals[1]).padStart(3) + '%\n';
                    html += ' 3[' + bar(coreVals[2], 30, '#ff5f57') + '] ' + String(coreVals[2]).padStart(3) + '%\n';
                    html += ' 4[' + bar(coreVals[3], 30, '#ffbd2e') + '] ' + String(coreVals[3]).padStart(3) + '%\n';
                    html += ' Mem[' + bar(mem, 40, '#00ff88') + '] ' + memUsed + 'M / 4096M\n';
                    html += ' Swp[' + bar(0, 40, '#ff5f57') + ']    0M / 0M\n';
                    html += '\n';
                    html += '<span style="color:#ffbd2e">  PID USER       PRI  NI    VIRT    RES    SHR S  %CPU %MEM    TIME+   COMMAND</span>\n';
                    processes.forEach(function(p) {
                        html += String(p.pid).padStart(5) + ' ' + p.user.padEnd(10) + String(p.pri).padStart(3) + ' ' + String(p.ni).padStart(3) + ' ' + p.virt.padStart(7) + ' ' + p.res.padStart(6) + ' ' + p.shr.padStart(6) + ' ' + p.s + ' ' + String(p.cpu).padStart(5) + ' ' + String(p.mem).padStart(4) + ' ' + p.time.padStart(9) + '   ' + p.cmd + '\n';
                    });
                    html += '\n';
                    html += '<span style="background:#222;color:#aaa"> ' + ts + '  F1Help  F2Setup  F3Search  F4Filter  F5Tree  F6SortBy  F7Nice-  F8Nice+  F9Kill  F10Quit </span>\n';
                    html += '\n<span style="color:#888">Press q or Ctrl+C to exit</span>';
                    overlay.innerHTML = html;
                }
                render();
                document.body.appendChild(overlay);
                var iv = setInterval(render, 1000);
                function exitHtop() {
                    clearInterval(iv);
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    document.removeEventListener('keydown', onKey);
                    baglam.addLine('[htop exited]', 'ok');
                }
                function onKey(e) {
                    if (e.key === 'q' || (e.key === 'c' && e.ctrlKey) || e.key === 'F10') {
                        e.preventDefault();
                        exitHtop();
                    }
                }
                document.addEventListener('keydown', onKey);
            }());

        // ===== dig / nslookup DNS Joke =====
        } });

baglam.komutlar.push({ sira: 48, eslesir: function (c, cmd) { return c === 'cmatrix'; }, calistir: function (c, cmd) {
            if (document.getElementById('matrix-rain')) {
                stopMatrixRain();
                baglam.addLine('Matrix rain stopped.', 'ok');
            } else {
                startMatrixRain();
                baglam.addLine('Matrix rain started. Type "cmatrix" again to stop.', 'ok');
            }

        // ===== man furkan Manual Page =====
        } });
});
