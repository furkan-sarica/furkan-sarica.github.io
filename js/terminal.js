// ===== Feature: Interactive Mini CLI Terminal =====
(function () {
    var input = document.getElementById('cli-input');
    var output = document.getElementById('cli-output');
    if (!input || !output) return;

    function addLine(text, cls) {
        var line = document.createElement('div');
        line.className = 'cli-history-line cli-line' + (cls ? ' ' + cls : '');
        line.textContent = text;
        output.appendChild(line);
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }

    function addBlock(html) {
        var block = document.createElement('div');
        block.className = 'cli-history-line';
        block.innerHTML = html;
        output.appendChild(block);
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }

    function echoCmd(cmd) {
        var prefix = document.body.classList.contains('hacker-mode')
            ? 'root@devops:~# '
            : 'furkan@devops:' + dirDisplay(currentDir) + '$ ';
        addLine(prefix + cmd, 'cmd');
    }

    function updatePrompt() {
        var promptEl = document.getElementById('cli-prompt');
        if (!promptEl) return;
        if (document.body.classList.contains('hacker-mode')) {
            promptEl.textContent = 'root@devops:~#';
        } else {
            promptEl.textContent = 'furkan@devops:' + dirDisplay(currentDir) + '$';
        }
    }

    // Expose addLine globally so external handlers (e.g. Konami Code) can write to the terminal
    window.cliAddLine = addLine;

    function addNeofetch() {
        var uptime = Math.floor((Date.now() - _pageLoadTime) / 1000);
        var uptimeStr = uptime < 60 ? uptime + 's' : Math.floor(uptime / 60) + 'm ' + (uptime % 60) + 's';
        var logo = [
            ' ██████╗ ',
            ' ██╔════╝',
            ' █████╗  ',
            ' ██╔══╝  ',
            ' ██║     ',
            ' ╚═╝     ',
        ];
        var res = window.screen ? window.screen.width + 'x' + window.screen.height : 'N/A';
        var stats = [
            '<span style="color:var(--terminal-green)">furkan</span>@<span style="color:var(--terminal-green)">devops</span>',
            '<span style="color:var(--text-muted)">─────────────────────────</span>',
            '<span style="color:var(--accent-cyan)">OS</span>: Ubuntu 22.04 LTS x86_64',
            '<span style="color:var(--accent-cyan)">Host</span>: Proxmox VE (Mini PC)',
            '<span style="color:var(--accent-cyan)">Kernel</span>: 5.15.0-generic',
            '<span style="color:var(--accent-cyan)">Uptime</span>: ' + uptimeStr + '  (SLO: 99.9%)',
            '<span style="color:var(--accent-cyan)">Shell</span>: bash 5.1.16',
            '<span style="color:var(--accent-cyan)">Resolution</span>: ' + res,
            '<span style="color:var(--accent-cyan)">Role</span>: AI Solutions Engineer @ CloudSpark',
            '<span style="color:var(--accent-cyan)">Terminal</span>: furkan-sarica-terminal',
        ];
        var maxLen = Math.max(logo.length, stats.length);
        var html = '<div style="font-family:JetBrains Mono,monospace;line-height:1.7">';
        for (var i = 0; i < maxLen; i++) {
            var ll = logo[i] || '         ';
            var sl = stats[i] || '';
            html += '<div style="display:flex;gap:1.5em;align-items:baseline">'
                + '<span style="color:var(--terminal-green);white-space:pre">' + ll + '</span>'
                + '<span>' + sl + '</span>'
                + '</div>';
        }
        html += '<div style="margin-top:0.4rem"><span style="color:#ff5f57">██</span>'
            + '<span style="color:#febc2e">██</span><span style="color:#28c840">██</span>'
            + '<span style="color:var(--terminal-green)">██</span><span style="color:var(--accent-cyan)">██</span>'
            + '<span style="color:var(--accent-purple)">██</span><span style="color:var(--accent-amber)">██</span></div>';
        html += '</div>';
        addBlock(html);
    }

    function fetchWeather() {
        fetch('https://wttr.in/Istanbul?0ATq')
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (text) {
                text.split('\n').forEach(function (line) { addLine(line); });
            })
            .catch(function () {
                var staticLines = [
                    'Weather report: Istanbul',
                    '',
                    '       .--.       Partly Cloudy',
                    '    .-(    ).    +18 \u00b0C (feels like 15 \u00b0C)',
                    '   (___.__)__)   \u2199 12 km/h',
                    '                 Humidity: 65%',
                    '                 Visibility: 10 km',
                    '',
                    '[ Note: Live weather unavailable - showing cached data ]'
                ];
                staticLines.forEach(function (line) { addLine(line); });
            });
    }

    addLine('Type "help" to see available commands.', 'ok');

    var sections = { projects: '#projects', about: '#about', contact: '#contact', tools: '#tools', education: '#education', certificates: '#certificates' };

    var cliCommands = ['help', 'projects', 'about', 'education', 'certificates', 'tools', 'contact', 'clear', 'whoami', 'vitonom', 'tracefold', 'homelab', 'umbrel', 'physicalism', 'sudo', 'ip a', 'ifconfig', 'theme ls', 'theme set default', 'theme set dracula', 'theme set monokai', 'theme set cyberpunk', 'theme set ubuntu', 'theme set amber', 'theme set light', 'theme light', 'theme dark', 'ls', 'ls -la', 'pwd', 'cd ~', 'cd /', 'cd /etc', 'cd /var/log', 'cd /home/furkan', 'cd about', 'cd projects', 'cd education', 'cat profile.md', 'cat tracefold.txt', 'cat sap-b1-agent.txt', 'cat ai-container.txt', 'cat vpn-lab.txt', 'cat logging.txt', 'cat university.md', 'cat api.json', 'cat top_secret.txt', 'cat /etc/passwd', 'cat /etc/hosts', 'cat /var/log/auth.log', 'cat /var/log/syslog', 'uname -a', 'exit', 'neofetch', 'fastfetch', 'gh repo list', 'ls ~/repos', 'curl wttr.in', 'curl wttr.in/Istanbul', 'curl https://furkan-sarica.github.io/api.json', 'curl api.json', 'reboot', 'cat cv.pdf', 'cat cv', 'ping', 'ping furkan-sarica.com', 'ping 8.8.8.8', 'ping google.com', 'docker ps', 'docker stats', 'docker logs furkan-sarica-web', 'docker logs ai-pipeline', 'docker logs grafana', 'docker stop furkan-sarica-web', 'docker start furkan-sarica-web', 'kubectl get pods', 'nmap', 'nmap furkan-sarica.com', 'nmap localhost', 'traceroute furkan-sarica.com', 'traceroute', 'vim', 'vi', 'coffee', 'make coffee', 'brew coffee', 'chmod 777 top_secret.txt', 'htop', 'top', 'cmatrix', 'sudo apt update', 'sudo apt upgrade', 'sudo apt upgrade -y', 'dig furkan-sarica.com', 'nslookup furkan-sarica.com', 'history', 'man furkan'];

    // ===== Virtual File System =====
    var vfsTree = {
        '/':                       ['home/', 'etc/', 'var/', 'tmp/'],
        '/home':                   ['furkan/'],
        '/home/furkan':            ['about/', 'projects/', 'education/', 'api.json', 'top_secret.txt'],
        '/home/furkan/about':      ['profile.md'],
        '/home/furkan/projects':   ['tracefold.txt', 'sap-b1-agent.txt', 'ai-container.txt', 'vpn-lab.txt', 'logging.txt'],
        '/home/furkan/education':  ['university.md'],
        '/etc':                    ['passwd', 'hosts', 'hostname', 'nginx/', 'ssh/'],
        '/tmp':                    [],
        '/var':                    ['log/'],
        '/var/log':                ['auth.log', 'syslog', 'nginx/']
    };

    var catContent = {
        'profile.md':        'Furkan SARICA — AI Solutions Engineer @ CloudSpark Cloud Data & AI Technologies\n---\nBuilding production-focused AI solutions across AI agents, RAG, and LLM applications.\nEx-Microsoft (Tracefold Local RAG), SAP Business One enterprise integrations, and DevOps.\nMIS Graduate @ Istanbul Gelisim University (3.10 / 4.00 Honor Degree) · Ankara, Türkiye.',
        'tracefold.txt':     'Tracefold — Privacy-First Local Document RAG Assistant\n---\nBuilt during Microsoft AI Innovators Internship using Microsoft Foundry Local.\nOffline document ingestion, local embeddings (Qwen3), Float32 vector store in SQLite,\ncosine similarity retrieval, and bilingual citation-grounded response generation.\nVerified evaluation pass rate: 24/24 successful bilingual test scenarios.',
        'sap-b1-agent.txt':  'SAP Business One AI Agent Platform\n---\nEnterprise AI orchestrator synchronizing 58+ operational entities.\nDeterministic schema validation and direct integration with SAP B1 Service Layer REST APIs.',
        'ai-container.txt':  'AI-Powered Container Infrastructure Automation\n---\nModular Docker/docker-compose stack on a low-resource Linux server.\nAI pipeline analyzes metrics and generates commands with a human-approval step.',
        'vpn-lab.txt':       'Virtual Network Lab & VPN Infrastructure\n---\nMultiple Linux VMs simulating router, DNS server, DMZ, and secure Tailscale / WireGuard mesh.',
        'logging.txt':       'Centralized Logging & Monitoring Infrastructure\n---\nGrafana dashboards and Prometheus metrics for full homelab and service health observability.',
        'university.md':     'B.Sc. in Management Information Systems\nIstanbul Gelisim University — GPA: 3.10 / 4.00 Honor Degree (2022–2026)\nHigh School: Özel Aksaray Vizyon Akademi Anadolu Lisesi (90.07 / 100)\nCertifications: Stanford AI, Microsoft AI & ML, Vanderbilt GenAI, NVIDIA, AWS, IBM, Google, Meta, Akamai.',
        'api.json':          '{\n  "name": "Furkan SARICA",\n  "title": "AI Solutions Engineer",\n  "company": "CloudSpark",\n  "location": "Çankaya, Ankara, Türkiye",\n  "focus": "AI Agents, Local RAG, Enterprise ERP Integrations, High-Performance APIs",\n  "curl": "curl -s https://furkan-sarica.github.io/api.json | jq ."\n}',
        'passwd':            'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nfurkan:x:1000:1000:Furkan Sarica,,,:/home/furkan:/bin/bash\ndocker:x:999:999:Docker daemon:/var/lib/docker:/usr/sbin/nologin\nnginx:x:101:101:nginx user:/var/cache/nginx:/usr/sbin/nologin\ngrafana:x:472:472::/home/grafana:/sbin/nologin',
        'hosts':             '127.0.0.1   localhost\n127.0.1.1   devops\n192.168.1.100   furkan-sarica-web\n192.168.1.101   ai-pipeline\n192.168.1.102   grafana\n::1     localhost ip6-localhost ip6-loopback',
        'hostname':          'devops',
        'auth.log':          'Apr  4 08:12:01 devops sshd[1337]: Failed password for invalid user admin from 185.220.101.42 port 52341 ssh2\nApr  4 08:12:03 devops sshd[1338]: Failed password for invalid user root from 185.220.101.42 port 52342 ssh2\nApr  4 08:12:05 devops sshd[1339]: Failed password for invalid user ubuntu from 185.220.101.42 port 52343 ssh2\nApr  4 08:12:31 devops sshd[1340]: Failed password for invalid user admin from 45.33.32.156 port 44512 ssh2\nApr  4 08:12:33 devops sshd[1341]: Failed password for invalid user pi from 45.33.32.156 port 44513 ssh2\nApr  4 08:13:01 devops fail2ban.actions[2048]: WARNING [sshd] Ban 185.220.101.42\nApr  4 08:13:01 devops fail2ban.actions[2048]: WARNING [sshd] Ban 45.33.32.156\nApr  4 08:14:22 devops sshd[1500]: Accepted publickey for furkan from 192.168.1.10 port 55123 ssh2\nApr  4 08:14:22 devops sshd[1500]: pam_unix(sshd:session): session opened for user furkan by (uid=0)',
        'syslog':            'Apr  4 09:00:01 devops systemd[1]: Starting Docker Application Container Engine...\nApr  4 09:00:02 devops dockerd[2048]: time="2026-04-04T09:00:02Z" level=info msg="Loading containers"\nApr  4 09:00:03 devops dockerd[2048]: time="2026-04-04T09:00:03Z" level=info msg="Docker daemon" graphdriver=overlay2 version=24.0.7\nApr  4 09:00:04 devops systemd[1]: Started Docker Application Container Engine.\nApr  4 09:00:05 devops systemd[1]: Starting furkan-sarica-web container...\nApr  4 09:00:06 devops systemd[1]: Started furkan-sarica-web container.\nApr  4 09:00:10 devops nginx[3141]: nginx/1.25.3 started'
    };

    var currentDir = '/home/furkan';

    function dirDisplay(path) {
        if (path === '/home/furkan') return '~';
        if (path.startsWith('/home/furkan/')) return '~' + path.slice('/home/furkan'.length);
        return path;
    }

    // ===== Self-Destruct State =====
    var awaitingSelfDestruct = false;

    // ===== Permission Puzzle State =====
    var topSecretUnlocked = false;

    // ===== man Page Definitions =====
    var manuals = {
        'theme': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;theme - terminal temasını değiştirir<br><br><b>SYNOPSIS</b><br>&nbsp;&nbsp;&nbsp;&nbsp;theme [light|dark|ls|set &lt;name&gt;]<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;Sitenin renk paletini değiştirir.<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>theme light</b> — Solarized Light temasını etkinleştirir.<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>theme dark</b> — Varsayılan koyu temaya döner.<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>theme ls</b> — Kullanılabilir temaları listeler.<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>theme set &lt;name&gt;</b> — Belirtilen temayı uygular.',
        'whoami': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;whoami - geçerli kullanıcı bilgilerini yazdırır<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;Furkan Sarıca hakkında temel sistem yetkinliklerini ve iletişim bilgilerini döndürür.',
        'help': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;help - kullanılabilir komutları listeler<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;Bu web terminalinde desteklenen tüm interaktif komutların listesini verir.',
        'clear': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;clear - terminal ekranını temizler',
        'sudo': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;sudo - başka bir kullanıcı olarak komut çalıştırır<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;İyi deneme. Bu olay raporlanacaktır. (This incident will be reported.)',
        'ping': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;ping - ağdaki cihazlara ICMP ECHO_REQUEST paketleri gönderir<br><br><b>SYNOPSIS</b><br>&nbsp;&nbsp;&nbsp;&nbsp;ping &lt;host&gt;<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;Sunucu ile aranızdaki gecikmeyi (latency) ölçmek için kullanılır.<br>&nbsp;&nbsp;&nbsp;&nbsp;4 paket gönderir ve istatistikleri raporlar.<br>&nbsp;&nbsp;&nbsp;&nbsp;Örnek: ping 8.8.8.8 | ping google.com',
        'ls': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;ls - dizin içeriklerini listeler<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;Projeler, sertifikalar ve yeteneklerin bulunduğu sanal dizinleri görüntüler.',
        'neofetch': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;neofetch - sistem bilgilerini ASCII logo ile gösterir<br><br><b>SYNOPSIS</b><br>&nbsp;&nbsp;&nbsp;&nbsp;neofetch | fastfetch<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;OS, Kernel, Uptime, Shell ve Rol bilgilerini ASCII logo ile birlikte terminal çıktısı olarak gösterir.',
        'fastfetch': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;fastfetch - neofetch\'in hızlı alternatifi (alias)<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;neofetch komutuyla aynı çıktıyı üretir. man neofetch ile daha fazla bilgi alın.',
        'gh': '<b>NAME</b><br>&nbsp;&nbsp;&nbsp;&nbsp;gh - GitHub CLI<br><br><b>SYNOPSIS</b><br>&nbsp;&nbsp;&nbsp;&nbsp;gh repo list<br><br><b>DESCRIPTION</b><br>&nbsp;&nbsp;&nbsp;&nbsp;GitHub API üzerinden furkan-sarica kullanıcısının son 5 public reposunu çeker ve listeler.<br>&nbsp;&nbsp;&nbsp;&nbsp;ls ~/repos komutu ile de aynı sonuca ulaşabilirsiniz.'
    };

    // ===== Fail2Ban State =====
    var invalidCount = 0;
    var fail2banActive = false;

    function startSelfDestruct() {
        addLine('[CRITICAL] Initiating system destruction sequence...', 'err');
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

    // Command history
    var cmdHistory = [];
    var historyIndex = -1;

    function fetchIpAndPrint() {
        var ua = navigator.userAgent.slice(0, 80);
        fetch('https://api.ipify.org?format=json')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                addLine('eth0: inet ' + data.ip + ' - ' + ua, 'ok');
            })
            .catch(function () {
                addLine('eth0: inet [unavailable] - ' + ua);
            });
    }

    // ===== Vim Trap =====
    var vimActive = false;
    var vimCmdMode = false;
    var vimCmdLine = '';

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

        vimActive = true;
        vimCmdMode = false;
        vimCmdLine = '';

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        overlay.focus();
    }

    function closeVimOverlay() {
        var overlay = document.getElementById('vim-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        }
        vimActive = false;
        vimCmdMode = false;
        vimCmdLine = '';
        if (input) input.focus();
    }

    document.addEventListener('keydown', function (e) {
        if (!vimActive) return;
        e.preventDefault();
        e.stopPropagation();

        var modeEl = document.getElementById('vim-mode-indicator');
        var cmdlineEl = document.getElementById('vim-cmdline');

        if (vimCmdMode) {
            if (e.key === 'Enter') {
                var trimmed = vimCmdLine.trim();
                if (trimmed === ':q' || trimmed === ':wq' || trimmed === ':q!' || trimmed === ':wq!') {
                    closeVimOverlay();
                    addLine('[vim] Saved. Welcome back.', 'ok');
                } else {
                    if (cmdlineEl) cmdlineEl.textContent = 'E492: Not an editor command: ' + vimCmdLine.slice(1);
                    vimCmdMode = false;
                    vimCmdLine = '';
                    if (modeEl) modeEl.textContent = '';
                }
            } else if (e.key === 'Escape') {
                vimCmdMode = false;
                vimCmdLine = '';
                if (cmdlineEl) cmdlineEl.textContent = '';
                if (modeEl) modeEl.textContent = '';
            } else if (e.key === 'Backspace') {
                if (vimCmdLine.length > 1) {
                    vimCmdLine = vimCmdLine.slice(0, -1);
                    if (cmdlineEl) cmdlineEl.textContent = vimCmdLine;
                } else {
                    vimCmdMode = false;
                    vimCmdLine = '';
                    if (cmdlineEl) cmdlineEl.textContent = '';
                    if (modeEl) modeEl.textContent = '';
                }
            } else if (e.key.length === 1) {
                vimCmdLine += e.key;
                if (cmdlineEl) cmdlineEl.textContent = vimCmdLine;
            }
        } else {
            // Normal mode
            if (e.key === ':') {
                vimCmdMode = true;
                vimCmdLine = ':';
                if (cmdlineEl) cmdlineEl.textContent = vimCmdLine;
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

    // ===== Fork Bomb =====
    function triggerForkBomb() {
        addLine(':(){ :|:& };:', 'err');
        var garbage = ['fork: retry: Resource temporarily unavailable',
            'fork: retry: No child processes',
            'bash: fork: Cannot allocate memory'];
        var spamCount = 0;
        var maxSpam = 60;
        var spamInterval = setInterval(function () {
            spamCount++;
            if (spamCount > maxSpam) { clearInterval(spamInterval); return; }
            if (Math.random() > 0.4) {
                addLine(garbage[Math.floor(Math.random() * garbage.length)], 'err');
            } else {
                var chars = '!@#$%^&*()_+{}|:<>?ABCDEFGabcdefg0123456789';
                var garb = '';
                for (var j = 0; j < 45; j++) {
                    garb += chars[Math.floor(Math.random() * chars.length)];
                }
                addLine(garb, 'err');
            }
        }, 60);

        setTimeout(function () {
            clearInterval(spamInterval);
            showKernelPanic();
        }, 2800);
    }

    function showKernelPanic() {
        var overlay = document.getElementById('kernel-panic');
        var textEl = document.getElementById('kernel-panic-text');
        var cdEl = document.getElementById('kernel-panic-countdown');
        if (!overlay) return;

        function kts() { return (Math.random() * 5 + 1).toFixed(6); }
        var panicLines = [
            '',
            '[  ' + kts() + '] CPU: 0 PID: 1 Comm: init Not tainted 6.5.0-furkan-sarica #1',
            '[  ' + kts() + '] Hardware name: furkan-sarica DevOps Lab',
            '[  ' + kts() + '] Call Trace:',
            '[  ' + kts() + ']  dump_stack_lvl+0x48/0x70',
            '[  ' + kts() + ']  panic+0x101/0x340',
            '[  ' + kts() + ']  do_exit+0x8a3/0xb40',
            '[  ' + kts() + ']  fork_bomb_detected+0x0/0x1',
            '[  ' + kts() + '] ---[ end Kernel panic - not syncing: Fatal exception ]---',
            '',
            'System will reboot in 5 seconds...',
        ];
        if (textEl) textEl.textContent = panicLines.join('\n');

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');

        var countdown = 5;
        if (cdEl) cdEl.textContent = 'Reloading in ' + countdown + 's...';
        var cdInterval = setInterval(function () {
            countdown--;
            if (countdown <= 0) {
                clearInterval(cdInterval);
                location.reload();
            } else {
                if (cdEl) cdEl.textContent = 'Reloading in ' + countdown + 's...';
            }
        }, 1000);
    }

    // ===== Fail2Ban Lockout =====
    function triggerFail2Ban() {
        fail2banActive = true;
        invalidCount = 0;
        input.disabled = true;
        input.classList.add('fail2ban-locked');
        var promptEl = document.getElementById('cli-prompt');
        if (promptEl) promptEl.classList.add('fail2ban-locked');

        addLine('', '');
        addLine('[Fail2Ban] *** INTRUSION DETECTED ***', 'err');
        addLine('[Fail2Ban] Too many invalid attempts. Your IP has been temporarily banned for malicious activity.', 'err');

        var remaining = 10;
        function tick() {
            addLine('[Fail2Ban] Ban expires in: ' + remaining + 's', 'err');
            if (remaining <= 0) {
                fail2banActive = false;
                input.disabled = false;
                input.classList.remove('fail2ban-locked');
                if (promptEl) promptEl.classList.remove('fail2ban-locked');
                addLine('[Fail2Ban] Ban lifted. Your IP has been removed from the blocklist.', 'ok');
                input.focus();
            } else {
                remaining--;
                setTimeout(tick, 1000);
            }
        }
        setTimeout(tick, 500);
    }

    input.addEventListener('keydown', function (e) {
        if (fail2banActive) { e.preventDefault(); return; }

        // Play typing click sound
        if (e.key.length === 1 || e.key === 'Backspace') {
            if (window.playClick) window.playClick();
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                input.value = cmdHistory[historyIndex];
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = cmdHistory[historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
            return;
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            var val = input.value;
            if (!val) return;
            var match = cliCommands.find(function (cmd) { return cmd.startsWith(val); });
            if (match) input.value = match;
            return;
        }
        if (e.key !== 'Enter') return;
        var cmd = input.value.trim();
        input.value = '';
        if (!cmd) return;

        // Self-destruct confirmation prompt
        if (awaitingSelfDestruct) {
            awaitingSelfDestruct = false;
            echoCmd(cmd);
            var ans = cmd.toLowerCase();
            if (ans === 'y' || ans === 'yes') {
                addLine('[INITIATING] Self-destruct sequence in 3...2...1', 'err');
                setTimeout(startSelfDestruct, 800);
            } else {
                addLine('[ABORTED] Smart choice. The server lives.', 'ok');
            }
            return;
        }

        cmdHistory.unshift(cmd);
        historyIndex = -1;
        echoCmd(cmd);
        var c = cmd.toLowerCase();
        var cmdHandled = true; // track whether command was recognized

        if (c === 'help') {
            addLine('Available system commands:');
            addLine('');
            addLine('[ Core Utilities ]');
            addLine('  cd, ls, pwd, cat, clear, exit, help, history, man');
            addLine('');
            addLine('[ Network & SecOps ]');
            addLine('  ip a, ifconfig, ping, nmap, traceroute, dig');
            addLine('');
            addLine('[ SysAdmin & Monitoring ]');
            addLine('  whoami, uname -a, htop, chmod, sudo apt update, sudo rm -rf / (DANGER)');
            addLine('');
            addLine('[ DevOps & Containers ]');
            addLine('  docker, kubectl, git log');
            addLine('');
            addLine('[ Advanced Tools & Config ]');
            addLine('  vim (Vi IMproved), theme (Display Config), make coffee (JIT Coffee Engine)');
        } else if (sections[c]) {
            addLine('Scrolling to #' + c + '...', 'ok');
            var target = document.querySelector(sections[c]);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (c === 'clear') {
            output.innerHTML = '';
        } else if (c === 'sudo rm -rf /' || c === 'sudo rm -rf /*' || c === 'sudo rm -rf ~' || c === 'sudo rm -rf') {
            addLine('[WARNING] Are you sure? This will delete the portfolio! [y/N]', 'err');
            awaitingSelfDestruct = true;
        } else if (c === 'sudo apt update' || c === 'sudo apt-get update') {
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
                    if (i < lines.length) { addLine(lines[i++]); }
                    else { clearInterval(iv); }
                }, 120);
            }());
        } else if (c === 'sudo apt upgrade' || c === 'sudo apt-get upgrade' || c === 'sudo apt upgrade -y' || c === 'sudo apt-get upgrade -y') {
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
                    if (i < lines.length) { addLine(lines[i++], lines[i - 1].indexOf('ready for hire') !== -1 ? 'ok' : ''); }
                    else { clearInterval(iv); }
                }, 100);
            }());
        } else if (c === 'sudo' || c.startsWith('sudo ')) {
            addLine('Access denied: I can\'t let you delete this server!', 'err');
        } else if (c === 'exit') {
            addLine('logout', 'ok');
            currentDir = '/home/furkan';
            updatePrompt();
            if (document.body.classList.contains('root-mode')) {
                document.body.classList.remove('root-mode');
                stopMatrixRain();
            }
        } else if (c === 'whoami') {
            addLine('furkan', 'ok');
            addLine('  Role: AI Solutions Engineer');
            addLine('  Company: CloudSpark Cloud Data & AI Technologies');
            addLine('  Location: Çankaya, Ankara, Türkiye');
            addLine('  Education: Istanbul Gelisim University (MIS B.Sc., 3.10 / 4.00 Honor Degree)');
            addLine('  High School: Özel Aksaray Vizyon Akademi Anadolu Lisesi (90.07 / 100)');
            addLine('  Shell: /bin/zsh (oh-my-zsh + powerlevel10k)');
            addLine('');
            addLine('  Focus: AI Agents, Enterprise RAG, FastAPI, SAP Business One, Docker, Kubernetes');
        } else if (c === 'vitonom' || c === 'vitonom --status' || c === 'ask vitonom') {
            addLine('[Vitonom v2.4]:', 'ok');
            addLine('  Status: Online & In Sync');
            addLine('  Identity: Autonomous Intelligence Partner');
            addLine('  Directive: Physics-grounded, zero-hallucination execution.');
            addLine('  "Sistemler nominal efendim. CloudSpark modelleri devrede, UmbrelOS ayakta, OLED BBR hattı açık. Emrinizdeyim."');
        } else if (c === 'tracefold' || c === 'rag') {
            addLine('[Tracefold Local RAG Assistant]:', 'ok');
            addLine('  Backend: Microsoft Foundry Local (Qwen3 Embed + Qwen2.5 Inference)');
            addLine('  Storage: SQLite Float32 Vector Table');
            addLine('  Pipeline: Citation Validation · OPUS-MT Translation · Deterministic Safe Refusal');
            addLine('  Eval Result: 24/24 pass on verified bilingual benchmark suite.');
        } else if (c === 'homelab' || c === 'umbrel') {
            addLine('[Homelab Server Node]:', 'ok');
            addLine('  Host: lab-node-01 (ASUS UX310UQK · i7-7500U · 16GB DDR4)');
            addLine('  OS: umbrelOS 2.0 Beta (Kernel 6.6+ with TCP BBR + FQ)');
            addLine('  Tailscale Mesh: node-secure.ts.net [Protected WireGuard Peer]');
            addLine('  Media Stack: Infuse 4K Remux OLED (TRaSH Guides Profile · Dolby Atmos / DV IQ)');
            addLine('  Status: 10/10 Homelab Tuning Applied.');
        } else if (c === 'physicalism' || c === 'fizikalizm' || c === 'philosophy') {
            addLine('[Physicalism]:', 'ok');
            addLine('  "There is only physical matter, energy, and spacetime.');
            addLine('   Everything else is emergent complexity. No magic, just physics and compute."');
        } else if (c === 'ip a' || c === 'ifconfig') {
            fetchIpAndPrint();
        } else if (c === 'pwd') {
            addLine(currentDir);
        } else if (c === 'ls' || c === 'ls -la' || c === 'ls -l' || c === 'ls -a') {
            var contents = vfsTree[currentDir];
            if (contents === undefined) {
                addLine('ls: cannot access \'' + currentDir + '\': No such file or directory', 'err');
            } else if (contents.length === 0) {
                addLine('(empty directory)');
            } else {
                addLine(contents.join('  '));
            }
        } else if (c === 'ls skills/' || c === 'ls skills') {
            addLine('[Network & Security]');
            addLine('  TCP/IP  VLAN  VPN  WireGuard  pfSense  Nmap  Firewall  IDS/IPS');
            addLine('');
            addLine('[DevOps & Containers]');
            addLine('  Docker  Kubernetes  Helm  CI/CD  GitHub Actions  GitLab  Jenkins');
            addLine('');
            addLine('[Cloud & Infrastructure]');
            addLine('  AWS  Azure  GCP  Terraform  Ansible  Nginx  HAProxy  Load Balancing');
            addLine('');
            addLine('[Monitoring & Observability]');
            addLine('  Grafana  Prometheus  ELK  Zabbix  PRTG  Log Management');
            addLine('');
            addLine('[Development]');
            addLine('  Python  Bash  JavaScript  TypeScript  React  Node.js  SQL  NoSQL');
            addLine('');
            addLine('[Business Systems]');
            addLine('  SAP Business One  ERP  CRM  Digital Transformation  Business Analysis');
        } else if (c === 'cat experience.txt' || c === 'cat experience') {
            addLine('=== EXPERIENCE.LOG ===');
            addLine('');
            addLine('[2026-05 -- 2026-07] Logosoft Bilişim Teknolojileri A.Ş.');
            addLine('Position: AI Solutions Engineer Intern');
            addLine('Location: Ümraniye, İstanbul, Türkiye (Ofiste)');
            addLine('Status: TAMAMLANDI');
            addLine('');
            addLine('Responsibilities:');
            addLine('  • Kurumsal yazılım dağıtımı ve entegrasyon');
            addLine('  • SAP Business One modül yapılandırma');
            addLine('  • İş analizi ve dijital dönüşüm süreçleri');
            addLine('  • CRM/ERP sistem yönetimi');
            addLine('');
            addLine('Skills Gained: CRM, ERP, SAP B1, Business Analysis,');
            addLine('                Digital Transformation, Enterprise Software');
            addLine('');
            addLine('--- EOF ---');
        } else if (c === 'ping logosoft.com.tr' || c === 'ping logosoft') {
            (function() {
                var lines = [
                    'PING logosoft.com.tr (185.122.201.35) 56(84) bytes of data.',
                    '64 bytes from 185.122.201.35: icmp_seq=1 ttl=57 time=12.4 ms',
                    '64 bytes from 185.122.201.35: icmp_seq=2 ttl=57 time=11.8 ms',
                    '64 bytes from 185.122.201.35: icmp_seq=3 ttl=57 time=12.1 ms',
                    '64 bytes from 185.122.201.35: icmp_seq=4 ttl=57 time=11.9 ms',
                    '',
                    '--- logosoft.com.tr ping statistics ---',
                    '4 packets transmitted, 4 received, 0% packet loss, time 3004ms',
                    'rtt min/avg/max/mdev = 11.800/12.050/12.400/0.240 ms',
                    '',
                    '[INFO] Target is ONLINE and responsive. Enterprise infrastructure healthy.'
                ];
                var i = 0;
                var iv = setInterval(function() {
                    if (i < lines.length) { addLine(lines[i++], lines[i-1].indexOf('ONLINE') !== -1 ? 'ok' : ''); }
                    else { clearInterval(iv); }
                }, 200);
            }());
        } else if (c === 'cd' || c === 'cd ~') {
            currentDir = '/home/furkan';
            updatePrompt();
        } else if (c.startsWith('cd ')) {
            var cdArg = cmd.slice(3).trim();
            var cdTarget;
            if (cdArg === '~' || cdArg === '/home/furkan') {
                cdTarget = '/home/furkan';
            } else if (cdArg === '/') {
                cdTarget = '/';
            } else if (cdArg === '..') {
                var cdLast = currentDir.lastIndexOf('/');
                cdTarget = cdLast > 0 ? currentDir.slice(0, cdLast) : '/';
            } else if (cdArg.startsWith('/')) {
                // Absolute path — normalize any ..
                var cdParts = cdArg.split('/').filter(Boolean);
                var cdStack = [];
                cdParts.forEach(function (p) {
                    if (p === '..') { cdStack.pop(); }
                    else if (p !== '.') { cdStack.push(p); }
                });
                cdTarget = '/' + cdStack.join('/');
            } else if (cdArg.startsWith('~/')) {
                cdTarget = '/home/furkan/' + cdArg.slice(2);
            } else {
                // Relative path
                cdTarget = currentDir === '/' ? '/' + cdArg : currentDir + '/' + cdArg;
            }
            cdTarget = cdTarget.replace(/\/$/, '') || '/';
            if (vfsTree.hasOwnProperty(cdTarget)) {
                currentDir = cdTarget;
                updatePrompt();
            } else {
                addLine('cd: ' + cdArg + ': No such file or directory', 'err');
            }
        } else if (c.startsWith('cat ')) {
            var filename = cmd.slice(4).trim();
            // Strip path prefix if any
            var basename = filename.split('/').pop();
            if (basename === 'top_secret.txt') {
                if (!topSecretUnlocked) {
                    addLine('bash: top_secret.txt: Permission denied', 'err');
                    addLine('hint: try chmod 777 top_secret.txt');
                } else {
                    addLine('╔══════════════════════════════════════════════╗');
                    addLine('║       TOP SECRET — AUTHORIZED EYES ONLY      ║');
                    addLine('╠══════════════════════════════════════════════╣');
                    addLine('║                                              ║');
                    addLine('║  ██╗  ██╗██╗██████╗ ███████╗    ███╗   ███╗ ║');
                    addLine('║  ██║  ██║██║██╔══██╗██╔════╝    ████╗ ████║ ║');
                    addLine('║  ███████║██║██████╔╝█████╗      ██╔████╔██║ ║');
                    addLine('║  ██╔══██║██║██╔══██╗██╔══╝      ██║╚██╔╝██║ ║');
                    addLine('║  ██║  ██║██║██║  ██║███████╗    ██║ ╚═╝ ██║ ║');
                    addLine('║  ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝     ╚═╝ ║');
                    addLine('║                                              ║');
                    addLine('║  Clearance level: R00T                       ║');
                    addLine('║  Subject: Furkan Sarıca                      ║');
                    addLine('║  Status: HIGHLY RECOMMENDED FOR HIRE         ║');
                    addLine('║                                              ║');
                    addLine('║  Skills: Linux ████████████ 100%             ║');
                    addLine('║  Docker: ███████████░░ 90%                   ║');
                    addLine('║  Coffee intake: ████████████ CRITICAL        ║');
                    addLine('║                                              ║');
                    addLine('║  Secret passphrase: R00T_ACCESS_GRANTED      ║');
                    addLine('║  Contact: furkan@furkan-sarica.com                 ║');
                    addLine('╚══════════════════════════════════════════════╝', 'ok');
                }
            } else {
                var fileContent = catContent[basename];
                if (!fileContent) {
                    // Try cv commands too
                    if (basename === 'cv.pdf' || basename === 'cv') {
                        var isLangTr = document.body.classList.contains('lang-tr');
                        var cvUrl2 = isLangTr ? 'Furkan%20SARICA%20CV%20TR.pdf' : 'Furkan%20SARICA%20CV%20EN.pdf';
                        var cvName2 = isLangTr ? 'Furkan SARICA CV TR.pdf' : 'Furkan SARICA CV EN.pdf';
                        addLine('Downloading ' + cvName2 + '...', 'ok');
                        var dlLink2 = document.createElement('a');
                        dlLink2.href = cvUrl2;
                        dlLink2.download = cvName2;
                        document.body.appendChild(dlLink2);
                        dlLink2.click();
                        document.body.removeChild(dlLink2);
                        addLine('Done.', 'ok');
                    } else {
                        addLine('cat: ' + filename + ': No such file or directory', 'err');
                    }
                } else {
                    fileContent.split('\n').forEach(function (line) { addLine(line); });
                }
            }
        } else if (c === 'uname -a') {
            addLine('Linux devops 6.5.0-furkan-sarica #1 SMP Thu Jan 01 00:00:00 UTC 2026 x86_64 GNU/Linux');
        } else if (c === 'theme light' || c === 'theme set light') {
            document.body.classList.remove('theme-dracula', 'theme-monokai', 'theme-cyberpunk', 'theme-ubuntu', 'theme-amber');
            document.body.classList.add('light-theme');
            addLine('Theme set to: Solarized Light', 'ok');
            addLine('Type "theme dark" to return to dark mode.');
        } else if (c === 'theme dark' || c === 'theme set dark' || c === 'dark') {
            document.body.classList.remove('light-theme');
            addLine('Theme set to: default (dark)', 'ok');
        } else if (c === 'theme ls' || c === 'theme list') {
            addLine('Available themes:');
            addLine('  default   — dark hacker green  [ active ]');
            addLine('  dracula   — purple/pink palette');
            addLine('  monokai   — warm yellow-green');
            addLine('  cyberpunk — neon green on deep purple');
            addLine('  ubuntu    — Ubuntu orange');
            addLine('  amber     — retro terminal amber');
            addLine('  light     — Solarized Light');
            addLine('Usage: theme set <name>');
        } else if (c.startsWith('theme set ')) {
            var themeName = c.slice(10).trim();
            var validThemes = ['default', 'dracula', 'monokai', 'cyberpunk', 'ubuntu', 'amber'];
            document.body.classList.remove('theme-dracula', 'theme-monokai', 'theme-cyberpunk', 'theme-ubuntu', 'theme-amber', 'light-theme');
            if (themeName === 'default' || themeName === 'dark') {
                addLine('Theme set to: default', 'ok');
            } else if (themeName === 'light') {
                document.body.classList.add('light-theme');
                addLine('Theme set to: Solarized Light', 'ok');
                addLine('Type "theme dark" to return to dark mode.');
            } else if (validThemes.indexOf(themeName) !== -1) {
                document.body.classList.add('theme-' + themeName);
                addLine('Theme set to: ' + themeName, 'ok');
            } else {
                addLine('Unknown theme: ' + themeName + '. Run "theme ls" to see options.', 'err');
            }
        } else if (c === 'neofetch' || c === 'fastfetch') {
            addNeofetch();
        } else if (c === 'curl wttr.in/istanbul' || c === 'curl wttr.in/istanbul?0atq' || c === 'curl wttr.in/istanbul?format=3' || c === 'curl wttr.in') {
            addLine('Fetching weather for Istanbul...', 'ok');
            fetchWeather();
        } else if (c === 'reboot') {
            addLine('Rebooting system...', 'ok');
            setTimeout(function () {
                output.innerHTML = '';
                runBootSequence();
            }, 600);
        } else if (c === 'ping' || c === 'ping furkan-sarica.com' || c === 'ping furkan-sarica') {
            addLine('PING furkan-sarica.com (127.0.0.1): 56 data bytes', 'ok');
            addLine('Launching Ping-Pong...', 'ok');
            setTimeout(function () { if (window.startPingPong) window.startPingPong(); }, 400);
        } else if (c.startsWith('ping ')) {
            var pingTarget = c.slice(5).trim();
            if (!pingTarget) {
                addLine('Usage: ping <host>', 'err');
            } else {
                addLine('PING ' + pingTarget + ': 64 data bytes');
                var pingSeq = 0;
                var pingInterval = setInterval(function () {
                    pingSeq++;
                    var pingTime = (Math.random() * 20 + 8).toFixed(1);
                    addLine('64 bytes from ' + pingTarget + ': icmp_seq=' + pingSeq + ' ttl=117 time=' + pingTime + ' ms');
                    if (pingSeq >= 4) {
                        clearInterval(pingInterval);
                        setTimeout(function () {
                            addLine('');
                            addLine('--- ' + pingTarget + ' ping statistics ---');
                            addLine('4 packets transmitted, 4 received, 0% packet loss');
                        }, 200);
                    }
                }, 1000);
            }

        // ===== Docker Commands =====
        } else if (c === 'docker ps') {
            addBlock('<pre style="color:var(--text-secondary);font-size:0.78rem;overflow-x:auto">' +
                'CONTAINER ID   IMAGE                COMMAND              CREATED        STATUS          PORTS                    NAMES\n' +
                'a1b2c3d4e5f6   nginx:alpine         "nginx -g \'daem…"   2 weeks ago    Up 2 weeks      0.0.0.0:443->443/tcp     furkan-sarica-web\n' +
                'b9c8d7e6f5a4   furkan-sarica/ai:v2        "python ai_pipe…"   3 days ago     Up 3 days       127.0.0.1:5000->5000/tcp ai-pipeline\n' +
                'c0d1e2f3a4b5   grafana/grafana:10   "./run.sh"           5 days ago     Up 5 days       127.0.0.1:3001->3001/tcp grafana' +
                '</pre>');
        } else if (c === 'docker stats' || c === 'docker stats --no-stream') {
            addBlock('<pre style="color:var(--text-secondary);font-size:0.78rem;overflow-x:auto">' +
                'CONTAINER ID   NAME           CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O\n' +
                'a1b2c3d4e5f6   furkan-sarica-web    0.3%    45.2MiB / 2GiB        2.21%   1.2GB / 850MB    120MB / 0B\n' +
                'b9c8d7e6f5a4   ai-pipeline    12.4%   412.8MiB / 2GiB      20.15%   234MB / 89MB     456MB / 12MB\n' +
                'c0d1e2f3a4b5   grafana        2.1%    187.3MiB / 2GiB       9.14%   78MB / 34MB      234MB / 5MB' +
                '</pre>');
        } else if (c.startsWith('docker logs ')) {
            var dockerLogsTarget = cmd.slice('docker logs '.length).trim().toLowerCase();
            var dockerLogsMap = {
                'furkan-sarica-web': [
                    '2026/04/04 08:00:01 [notice] 1#1: using the "epoll" event method',
                    '2026/04/04 08:00:01 [notice] 1#1: nginx/1.25.3',
                    '2026/04/04 08:00:01 [notice] 1#1: start worker processes',
                    '2026/04/04 09:14:22 192.168.1.10 - - "GET / HTTP/2.0" 200 8192',
                    '2026/04/04 09:15:01 185.220.101.42 - - "GET /wp-admin HTTP/1.1" 404 0',
                    '2026/04/04 09:15:03 185.220.101.42 - - "GET /.env HTTP/1.1" 403 0',
                    '2026/04/04 09:15:05 [warn] 8#8: blocked suspicious request from 185.220.101.42',
                    '2026/04/04 10:23:11 192.168.1.10 - - "GET /projects HTTP/2.0" 200 4096'
                ],
                'ai-pipeline': [
                    '2026-04-04 07:00:00 INFO  AI Pipeline v2.0 starting...',
                    '2026-04-04 07:00:01 INFO  Loading model: Kimi K2.5 API endpoint',
                    '2026-04-04 07:00:02 INFO  Connected to metrics API at http://grafana:3001',
                    '2026-04-04 08:30:00 INFO  Analyzing container metrics...',
                    '2026-04-04 08:30:01 INFO  CPU anomaly detected on ai-pipeline (12.4%)',
                    '2026-04-04 08:30:02 INFO  Generating remediation command...',
                    '2026-04-04 08:30:03 WARN  Awaiting human approval: docker restart ai-pipeline',
                    '2026-04-04 08:30:45 INFO  Approval granted. Executing.',
                    '2026-04-04 10:00:00 INFO  Health check OK - all containers nominal'
                ],
                'grafana': [
                    'logger=settings t=2026-04-04T07:00:00Z level=info msg="Starting Grafana" version=10.2.3',
                    'logger=server t=2026-04-04T07:00:01Z level=info msg="HTTP Server Listen" address=0.0.0.0:3001',
                    'logger=plugins t=2026-04-04T07:00:02Z level=info msg="Plugin registered" pluginId=grafana-piechart-panel',
                    'logger=sqlstore t=2026-04-04T07:00:03Z level=info msg="Database ready"',
                    'logger=http.server t=2026-04-04T09:00:00Z level=info msg="Request Completed" method=GET path=/api/dashboards status=200',
                    'logger=alerting t=2026-04-04T10:00:00Z level=info msg="Evaluating alert rules"'
                ]
            };
            var dockerLogs = dockerLogsMap[dockerLogsTarget];
            if (dockerLogs) {
                dockerLogs.forEach(function (line) { addLine(line); });
            } else {
                addLine('Error: No such container: ' + dockerLogsTarget, 'err');
                addLine('Running containers: furkan-sarica-web, ai-pipeline, grafana');
            }
        } else if (c === 'docker stop furkan-sarica-web' || c === 'docker stop portfolio-ui') {
            var dockerStopName = c === 'docker stop furkan-sarica-web' ? 'furkan-sarica-web' : 'portfolio-ui';
            addLine(dockerStopName, 'ok');
            setTimeout(function () {
                var overlay = document.getElementById('nginx-502-overlay');
                if (overlay) {
                    overlay.classList.add('active');
                    overlay.setAttribute('aria-hidden', 'false');
                }
            }, 600);
        } else if (c === 'docker start furkan-sarica-web' || c === 'docker start portfolio-ui') {
            var dockerStartName = c === 'docker start furkan-sarica-web' ? 'furkan-sarica-web' : 'portfolio-ui';
            var overlay502 = document.getElementById('nginx-502-overlay');
            if (overlay502 && overlay502.classList.contains('active')) {
                overlay502.classList.remove('active');
                overlay502.setAttribute('aria-hidden', 'true');
                addLine(dockerStartName, 'ok');
            } else {
                addLine(dockerStartName, 'ok');
                addLine('[ OK ] container ' + dockerStartName + ' already running', 'ok');
            }

        // ===== Kubernetes Commands =====
        } else if (c === 'kubectl get pods' || c === 'kubectl get pods -n default') {
            var uid1 = Math.random().toString(36).slice(2, 7);
            var uid2 = Math.random().toString(36).slice(2, 7);
            var uid3 = Math.random().toString(36).slice(2, 7);
            addBlock('<pre style="color:var(--text-secondary);font-size:0.78rem">' +
                'NAME                              READY   STATUS    RESTARTS   AGE\n' +
                'portfolio-ui-7d9f8b6c5-' + uid1 + '    1/1     Running   0          4d2h\n' +
                'portfolio-api-6b8d4f9a2-' + uid2 + '   1/1     Running   0          4d2h\n' +
                'monitor-5c7e3a1b8-' + uid3 + '         1/1     Running   2          2h17m' +
                '</pre>');
        } else if (c.startsWith('kubectl delete pod ')) {
            var podName = cmd.slice('kubectl delete pod '.length).trim() || 'portfolio-ui-xyz';
            var newUid = Math.random().toString(36).slice(2, 7);
            var baseName = podName.replace(/-[a-z0-9]+-[a-z0-9]+$/, '');
            if (!baseName || baseName === podName) baseName = podName.split('-').slice(0, -1).join('-') || podName;
            addLine('pod "' + podName + '" deleted', 'ok');
            setTimeout(function () {
                addLine('[ReplicaSet] Detected pod deficit — scheduling replacement...', 'ok');
                setTimeout(function () {
                    addLine('pod "' + baseName + '-' + Math.random().toString(36).slice(2, 12) + '" created', 'ok');
                    addLine('[K8s] High availability maintained. Pods: 1/1 Running ✓', 'ok');
                }, 1200);
            }, 800);
        } else if (c === 'kubectl' || c.startsWith('kubectl ')) {
            addLine('error: unknown command "' + cmd.slice(8).trim() + '" — try: kubectl get pods', 'err');

        // ===== Network Tools =====
        } else if (c === 'nmap' || c === 'nmap furkan-sarica.com' || c === 'nmap localhost' || c === 'nmap 127.0.0.1') {
            var nmapIsLocal = c.includes('localhost') || c.includes('127.0.0.1');
            var nmapTarget = nmapIsLocal ? '127.0.0.1' : '192.168.1.100';
            var nmapHost   = nmapIsLocal ? 'localhost'  : 'furkan-sarica.com';
            addLine('Starting Nmap 7.92 ( https://nmap.org )', 'ok');
            addLine('Nmap scan report for ' + nmapHost + ' (' + nmapTarget + ')', 'ok');
            addLine('Host is up (0.0' + (Math.floor(Math.random() * 89) + 10) + 's latency).');
            setTimeout(function () {
                addLine('Not shown: 994 closed tcp ports (conn-refused)');
                addLine('PORT      STATE SERVICE   VERSION');
                addLine('22/tcp    open  ssh        OpenSSH 8.9p1');
                addLine('80/tcp    open  http       Nginx Reverse Proxy');
                addLine('443/tcp   open  https      SSL/TLS Active');
                addLine('3000/tcp  open  grafana    Observability');
                addLine('2375/tcp  open  docker     Container Engine');
                addLine('51820/udp open  wireguard  VPN Lab');
                addLine('');
                addLine('Nmap done: 1 IP address (1 host up) scanned in ' + (Math.random() * 3 + 1).toFixed(2) + 's', 'ok');
            }, 1200);
        } else if (c === 'traceroute furkan-sarica.com' || c === 'traceroute' || c === 'tracert furkan-sarica.com') {
            addLine('traceroute to furkan-sarica.com (192.168.20.10), 30 hops max, 60 byte packets', 'ok');
            function trMs(base) { return (base + Math.random()).toFixed(3) + ' ms'; }
            var hops = [
                ' 1  router.local (192.168.1.1)         ' + trMs(1),
                ' 2  isp-gateway (10.0.0.1)            ' + trMs(14),
                ' 3  cloudflare-edge (1.1.1.1)          ' + trMs(22),
                ' 4  pfsense-firewall (10.8.0.1)        ' + trMs(35) + '  [VPN Tunnel]',
                ' 5  dmz-nginx-proxy (192.168.10.5)     ' + trMs(36),
                ' 6  docker-host.lan (192.168.20.10)    ' + trMs(36)
            ];
            hops.forEach(function (hop, i) {
                setTimeout(function () { addLine(hop); }, (i + 1) * 350);
            });

        // ===== Vim Trap =====
        } else if (c === 'vim' || c === 'vi' || c.startsWith('vim ') || c.startsWith('vi ')) {
            var vimArg = (c.startsWith('vim ') || c.startsWith('vi ')) ? cmd.slice(cmd.indexOf(' ') + 1).trim() : '[No Name]';
            showVimOverlay(vimArg);

        // ===== Fork Bomb =====
        } else if (cmd === ':(){ :|:& };:') {
            triggerForkBomb();

        // ===== Coffee (HTTP 418) =====
        } else if (c === 'coffee' || c === 'make coffee' || c === 'brew coffee') {
            addLine('');
            addLine('     )  (          ');
            addLine('    (   ) )         ');
            addLine('     ) ( (          ');
            addLine('  __________)_      ');
            addLine(" .-'------------|   ");
            addLine("( C|/\\/\\/\\/\\/\\|   ");
            addLine(" '-./\\/\\/\\/\\/\\|   ");
            addLine("   '----------'    ");
            addLine("    '-------'      ");
            addLine('');
            addLine('HTTP/1.1 418 I\'m a Teapot', 'err');
            addLine('Error 418: I\'m a teapot. But here is your coffee anyway. ☕', 'ok');

        // ===== htop / top Simulation =====
        } else if (c === 'htop' || c === 'top') {
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
                    addLine('[htop exited]', 'ok');
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
        } else if (c === 'dig furkan-sarica.com' || c === 'dig' || c === 'nslookup furkan-sarica.com' || c === 'nslookup') {
            var isNslookup = c.startsWith('nslookup');
            if (isNslookup) {
                addLine('Server:   8.8.8.8');
                addLine('Address:  8.8.8.8#53');
                addLine('');
                addLine('Non-authoritative answer:');
                addLine('Name:   furkan-sarica.com');
                addLine('Address: 104.21.42.42');
                addLine('');
                addLine('Mail exchanger: mail.furkan-sarica.com (priority 10)');
                addLine('');
                addLine('TXT record: "Looking for a DevOps/Network Engineer? You found him!"', 'ok');
            } else {
                addLine('; <<>> DiG 9.18.1-Ubuntu <<>> furkan-sarica.com');
                addLine(';; global options: +cmd');
                addLine(';; Got answer:');
                addLine(';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 1337');
                addLine(';; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1');
                addLine('');
                addLine(';; QUESTION SECTION:');
                addLine(';furkan-sarica.com.         IN  A');
                addLine('');
                addLine(';; ANSWER SECTION:');
                addLine('furkan-sarica.com.   300 IN  A     104.21.42.42');
                addLine('furkan-sarica.com.   300 IN  MX 10 mail.furkan-sarica.com.');
                addLine('furkan-sarica.com.   300 IN  TXT   "Looking for a DevOps/Network Engineer? You found him!"', 'ok');
                addLine('');
                addLine(';; Query time: 12 msec');
                addLine(';; SERVER: 8.8.8.8#53(8.8.8.8)');
                addLine(';; MSG SIZE  rcvd: 182');
            }

        // ===== history Command =====
        } else if (c === 'history') {
            var sysHistory = [
                '  195  ssh root@prod-db-01',
                '  196  sudo systemctl restart nginx',
                '  197  docker ps -a',
                '  198  kubectl get pods --all-namespaces',
                '  199  sudo rm -rf /var/log/*',
                '  200  service docker restart',
                '  201  echo "I hope nobody sees this" > secret.txt',
                '  202  cat /etc/passwd | grep furkan',
                '  203  git push origin main --force',
                '  204  history -c'
            ];
            sysHistory.forEach(function(l) { addLine(l); });
            addLine('');
            var offset = 205;
            for (var hi = 0; hi < cmdHistory.length; hi++) {
                addLine('  ' + (offset + hi) + '  ' + cmdHistory[cmdHistory.length - 1 - hi]);
            }

        // ===== cmatrix: Toggle Matrix Rain =====
        } else if (c === 'cmatrix') {
            if (document.getElementById('matrix-rain')) {
                stopMatrixRain();
                addLine('Matrix rain stopped.', 'ok');
            } else {
                startMatrixRain();
                addLine('Matrix rain started. Type "cmatrix" again to stop.', 'ok');
            }

        // ===== man furkan Manual Page =====
        } else if (c === 'man furkan' || c === 'man furkan-sarica') {
            addLine('FURKAN(1)                  User Commands                 FURKAN(1)');
            addLine('');
            addLine('NAME');
            addLine('       furkan - DevOps & Network Engineer');
            addLine('');
            addLine('SYNOPSIS');
            addLine('       hire [--role="DevOps"] [--location=remote] furkan');
            addLine('');
            addLine('DESCRIPTION');
            addLine('       Furkan is a highly scalable, fault-tolerant engineer designed for');
            addLine('       distributed environments. Optimized for Linux, Docker, Kubernetes,');
            addLine('       and network infrastructure workloads. Capable of operating under');
            addLine('       high load with zero downtime. Supports hot-reload of skills via');
            addLine('       continuous learning (--enable-autodidact).');
            addLine('');
            addLine('OPTIONS');
            addLine('       --role=<role>');
            addLine('              Supported: DevOps, Network Engineer, SysAdmin, Cloud Engineer');
            addLine('');
            addLine('       --location=<loc>');
            addLine('              Supported: remote, hybrid, on-site (Istanbul preferred)');
            addLine('');
            addLine('       --stack=<stack>');
            addLine('              Linux, Docker, Kubernetes, Ansible, Terraform, Grafana,');
            addLine('              Nginx, Python, Bash, Git, pfSense, WireGuard, OpenVPN');
            addLine('');
            addLine('EXIT CODES');
            addLine('       0   Hired successfully');
            addLine('       1   Position already filled (re-run later)');
            addLine('       42  Offer rejected — compensation below market rate');
            addLine('');
            addLine('BUGS');
            addLine('       May occasionally over-engineer solutions. Pair with coffee.');
            addLine('');
            addLine('AUTHOR');
            addLine('       Furkan <contact@furkan-sarica.com>');
            addLine('');
            addLine('SEE ALSO');
            addLine('       cat cv.pdf(1), ping furkan-sarica.com(8), hire(1)');
            addLine('');
            addLine('FURKAN(1)                  April 2025                     FURKAN(1)', 'ok');

        // ===== man Command =====
        } else if (c.startsWith('man ') || c === 'man') {
            var manArgs = c.split(' ').slice(1);
            if (manArgs.length === 0 || manArgs[0] === '') {
                addLine('What manual page do you want?', 'err');
                addLine('Usage: man [command]');
            } else {
                var manPage = manArgs[0];
                if (manuals[manPage]) {
                    addBlock(manuals[manPage]);
                } else {
                    addLine('No manual entry for ' + manPage, 'err');
                }
            }

        // ===== chmod Permission Puzzle =====
        } else if (c.startsWith('chmod ')) {
            var chmodArgs = cmd.slice(6).trim().split(/\s+/);
            var chmodPerm = chmodArgs[0] || '';
            var chmodFile = chmodArgs[1] || '';
            var chmodBase = chmodFile.split('/').pop();
            var validChmodPerms = ['777', '+x', '755', '+r', '644', '700', '+rx'];
            if (chmodBase === 'top_secret.txt' && validChmodPerms.indexOf(chmodPerm) !== -1) {
                topSecretUnlocked = true;
                addLine('Permissions updated.', 'ok');
                addLine('hint: cat top_secret.txt');
            } else if (chmodBase) {
                addLine('chmod: changing permissions of \'' + chmodFile + '\': Operation not permitted', 'err');
            } else {
                addLine('Usage: chmod <mode> <file>', 'err');
            }

        // ===== API Endpoint: curl api.json / hire-me =====
        } else if (c.startsWith('curl') && (c.includes('api.json') || c.includes('hire-me') || c.includes('api.furkan-sarica.com'))) {
            addLine('  % Total    % Received  % Xferd  Average Speed   Time    Total');
            addLine('                                 Dload  Upload   Total   Spent    Left  Speed');
            addLine('100   720  100   720    0     0   4096      0 --:--:-- --:--:-- --:--:-- 4114');
            addLine('');
            addBlock(
                '<pre style="color:var(--terminal-green);font-family:JetBrains Mono,monospace;font-size:0.82rem;line-height:1.6">' +
                '<span style="color:var(--accent-cyan)">HTTP/2 200 OK</span>\n' +
                '<span style="color:var(--text-muted)">content-type: application/json; charset=utf-8\n' +
                'server: CloudSpark-AI-Edge\n' +
                'x-status: active-open-to-enterprise-ai\n</span>\n' +
                '<span style="color:#ffb000">{</span>\n' +
                '  <span style="color:var(--accent-cyan)">"name"</span>: <span style="color:#a8ff78">"Furkan SARICA"</span>,\n' +
                '  <span style="color:var(--accent-cyan)">"role"</span>: <span style="color:#a8ff78">"AI Solutions Engineer @ CloudSpark"</span>,\n' +
                '  <span style="color:var(--accent-cyan)">"location"</span>: <span style="color:#a8ff78">"Çankaya, Ankara, Türkiye"</span>,\n' +
                '  <span style="color:var(--accent-cyan)">"focus"</span>: [<span style="color:#a8ff78">"AI Agents"</span>, <span style="color:#a8ff78">"Local RAG"</span>, <span style="color:#a8ff78">"FastAPI"</span>, <span style="color:#a8ff78">"SAP Business One"</span>, <span style="color:#a8ff78">"Kubernetes"</span>],\n' +
                '  <span style="color:var(--accent-cyan)">"contact"</span>: <span style="color:#a8ff78">"' + (['sarica','furkan'].join('.') + '@' + 'icloud.com') + '"</span>,\n' +
                '  <span style="color:var(--accent-cyan)">"portfolio"</span>: <span style="color:#a8ff78">"https://furkan-sarica.github.io"</span>,\n' +
                '  <span style="color:var(--accent-cyan)">"api_endpoint"</span>: <span style="color:#a8ff78">"https://furkan-sarica.github.io/api.json"</span>\n' +
                '<span style="color:#ffb000">}</span>' +
                '</pre>'
            );

        } else if (c === 'gh repo list' || c === 'ls ~/repos' || c === 'ls ~/repos/') {
            addLine('Fetching repositories from GitHub...', 'ok');
            fetch('https://api.github.com/users/furkan-sarica/repos?sort=updated&per_page=5')
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.json();
                })
                .then(function (repos) {
                    addLine('NAME                          STARS   DESCRIPTION');
                    addLine('─'.repeat(60));
                    repos.forEach(function (repo) {
                        var name = (repo.name || '').padEnd(30, ' ').slice(0, 30);
                        var stars = String(repo.stargazers_count || 0).padStart(3, ' ');
                        var desc = (repo.description || '—').slice(0, 40);
                        addLine(name + '  ★ ' + stars + '  ' + desc);
                    });
                    addLine('');
                    addLine('Run "gh repo list" to refresh.');
                })
                .catch(function () {
                    addLine('Error: could not reach api.github.com. Check your network.', 'err');
                });

        } else {
            cmdHandled = false;
            invalidCount++;
            addLine('Command not found: ' + cmd + " — type 'help'", 'err');
            if (window.playBeep) window.playBeep();
            if (invalidCount >= 5 && !fail2banActive) {
                triggerFail2Ban();
            }
        }
        if (cmdHandled) invalidCount = 0;
    });

    window.executeCliCmd = function(cmd) {
        if (!cmd) return;
        input.value = cmd;
        var enterEvt = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true });
        input.dispatchEvent(enterEvt);
    };
}());

window.runCliQuick = function(cmd) {
    if (typeof playClick === 'function') playClick();
    if (window.executeCliCmd) {
        window.executeCliCmd(cmd);
    }
};

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

// ===== Feature: Interactive Mouse-Tracking Logs =====
(function () {
    var logsEl = document.getElementById('bg-logs');
    if (!logsEl) return;

    function ts() {
        var now = new Date();
        return String(now.getHours()).padStart(2,'0') + ':' +
               String(now.getMinutes()).padStart(2,'0') + ':' +
               String(now.getSeconds()).padStart(2,'0');
    }

    function addLog(text) {
        var line = document.createElement('div');
        line.textContent = ts() + ' ' + text;
        logsEl.appendChild(line);
        while (logsEl.children.length > 14) {
            logsEl.removeChild(logsEl.firstChild);
        }
    }

    // Debounced mousemove handler
    var mouseMoveTimer = null;
    document.addEventListener('mousemove', function (e) {
        clearTimeout(mouseMoveTimer);
        mouseMoveTimer = setTimeout(function () {
            addLog('[IDS] Mouse tracking: X:' + e.clientX + ' Y:' + e.clientY);
        }, 200);
    }, { passive: true });

    // Click handler
    document.addEventListener('click', function (e) {
        var target = e.target;
        var id = target.id ? '#' + target.id : '';
        var cls = target.className && typeof target.className === 'string' && target.className.trim()
            ? '.' + target.className.trim().split(/\s+/)[0]
            : '';
        var tag = target.tagName ? target.tagName.toLowerCase() : 'unknown';
        addLog('[FW] Click event intercepted at target: <' + tag + (id || cls) + '>');
    }, { passive: true });

    // Scroll handler (debounced)
    var scrollTimer = null;
    document.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
            addLog('[IDS] Scroll detected: Y=' + Math.round(window.scrollY) + 'px');
        }, 300);
    }, { passive: true });

    // Seed with an initial log line
    addLog('[IDS] Intrusion Detection System: active. Monitoring session...');
}());

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

    document.querySelectorAll('.terminal-window').forEach(function (win) {
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
            header.style.cursor = 'grabbing';
        }

        function doDrag(clientX, clientY) {
            if (!isDragging) return;
            win.style.left = (clientX - startX) + 'px';
            win.style.top  = (clientY - startY) + 'px';
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
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

        document.addEventListener('mousemove', function (e) { doDrag(e.clientX, e.clientY); });
        document.addEventListener('mouseup', endDrag);

        header.addEventListener('touchstart', function (e) {
            if (e.target.classList.contains('t-btn')) return;
            var touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', function (e) {
            if (isDragging) {
                var touch = e.touches[0];
                doDrag(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', endDrag);
    });
}());
