// Sistem ve ağ komutları.
PortfolioTerminal.kaydet(function (baglam) {
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
        baglam.addBlock(html);
    }
    baglam.addNeofetch = addNeofetch;

function fetchWeather() {
        fetch('https://wttr.in/Istanbul?0ATq')
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (text) {
                text.split('\n').forEach(function (line) { baglam.addLine(line); });
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
                staticLines.forEach(function (line) { baglam.addLine(line); });
            });
    }
    baglam.fetchWeather = fetchWeather;

function fetchIpAndPrint() {
        var ua = navigator.userAgent.slice(0, 80);
        fetch('https://api.ipify.org?format=json')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                baglam.addLine('eth0: inet ' + data.ip + ' - ' + ua, 'ok');
            })
            .catch(function () {
                baglam.addLine('eth0: inet [unavailable] - ' + ua);
            });
    }
    baglam.fetchIpAndPrint = fetchIpAndPrint;

baglam.komutlar.push({ sira: 0, eslesir: function (c, cmd) { return c === 'help'; }, calistir: function (c, cmd) {
            baglam.addLine('Available system commands:');
            baglam.addLine('');
            baglam.addLine('[ Core Utilities ]');
            baglam.addLine('  cd, ls, pwd, cat, clear, exit, help, history, man');
            baglam.addLine('');
            baglam.addLine('[ Network & SecOps ]');
            baglam.addLine('  ip a, ifconfig, ping, nmap, traceroute, dig');
            baglam.addLine('');
            baglam.addLine('[ SysAdmin & Monitoring ]');
            baglam.addLine('  whoami, uname -a, htop, chmod, sudo apt update, sudo rm -rf / (DANGER)');
            baglam.addLine('');
            baglam.addLine('[ DevOps & Containers ]');
            baglam.addLine('  docker, kubectl, git log');
            baglam.addLine('');
            baglam.addLine('[ Advanced Tools & Config ]');
            baglam.addLine('  vim (Vi IMproved), theme (Display Config), make coffee (JIT Coffee Engine)');
        } });

baglam.komutlar.push({ sira: 1, eslesir: function (c, cmd) { return baglam.sections[c]; }, calistir: function (c, cmd) {
            baglam.addLine('Scrolling to #' + c + '...', 'ok');
            var target = document.querySelector(baglam.sections[c]);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } });

baglam.komutlar.push({ sira: 2, eslesir: function (c, cmd) { return c === 'clear'; }, calistir: function (c, cmd) {
            baglam.output.innerHTML = '';
        } });

baglam.komutlar.push({ sira: 8, eslesir: function (c, cmd) { return c === 'whoami'; }, calistir: function (c, cmd) {
            baglam.addLine('furkan', 'ok');
            baglam.addLine('  Role: AI Solutions Engineer');
            baglam.addLine('  Company: CloudSpark Cloud Data & AI Technologies');
            baglam.addLine('  Location: Çankaya, Ankara, Türkiye');
            baglam.addLine('  Education: Istanbul Gelisim University (MIS B.Sc., 3.10 / 4.00 Honor Degree)');
            baglam.addLine('  High School: Özel Aksaray Vizyon Akademi Anadolu Lisesi (90.07 / 100)');
            baglam.addLine('  Shell: /bin/zsh (oh-my-zsh + powerlevel10k)');
            baglam.addLine('');
            baglam.addLine('  Focus: AI Agents, Enterprise RAG, FastAPI, SAP Business One, Docker, Kubernetes');
        } });

baglam.komutlar.push({ sira: 9, eslesir: function (c, cmd) { return c === 'vitonom' || c === 'vitonom --status' || c === 'ask vitonom'; }, calistir: function (c, cmd) {
            baglam.addLine('[Vitonom v2.4]:', 'ok');
            baglam.addLine('  Status: Online & In Sync');
            baglam.addLine('  Identity: Autonomous Intelligence Partner');
            baglam.addLine('  Directive: Physics-grounded, zero-hallucination execution.');
            baglam.addLine('  "Sistemler nominal efendim. CloudSpark modelleri devrede, UmbrelOS ayakta, OLED BBR hattı açık. Emrinizdeyim."');
        } });

baglam.komutlar.push({ sira: 10, eslesir: function (c, cmd) { return c === 'tracefold' || c === 'rag'; }, calistir: function (c, cmd) {
            baglam.addLine('[Tracefold Local RAG Assistant]:', 'ok');
            baglam.addLine('  Backend: Microsoft Foundry Local (Qwen3 Embed + Qwen2.5 Inference)');
            baglam.addLine('  Storage: SQLite Float32 Vector Table');
            baglam.addLine('  Pipeline: Citation Validation · OPUS-MT Translation · Deterministic Safe Refusal');
            baglam.addLine('  Eval Result: 24/24 pass on verified bilingual benchmark suite.');
        } });

baglam.komutlar.push({ sira: 11, eslesir: function (c, cmd) { return c === 'homelab' || c === 'umbrel'; }, calistir: function (c, cmd) {
            baglam.addLine('[Homelab Server Node]:', 'ok');
            baglam.addLine('  Host: lab-node-01 (ASUS UX310UQK · i7-7500U · 16GB DDR4)');
            baglam.addLine('  OS: umbrelOS 2.0 Beta (Kernel 6.6+ with TCP BBR + FQ)');
            baglam.addLine('  Tailscale Mesh: node-secure.ts.net [Protected WireGuard Peer]');
            baglam.addLine('  Media Stack: Infuse 4K Remux OLED (TRaSH Guides Profile · Dolby Atmos / DV IQ)');
            baglam.addLine('  Status: 10/10 Homelab Tuning Applied.');
        } });

baglam.komutlar.push({ sira: 12, eslesir: function (c, cmd) { return c === 'physicalism' || c === 'fizikalizm' || c === 'philosophy'; }, calistir: function (c, cmd) {
            baglam.addLine('[Physicalism]:', 'ok');
            baglam.addLine('  "There is only physical matter, energy, and spacetime.');
            baglam.addLine('   Everything else is emergent complexity. No magic, just physics and compute."');
        } });

baglam.komutlar.push({ sira: 13, eslesir: function (c, cmd) { return c === 'ip a' || c === 'ifconfig'; }, calistir: function (c, cmd) {
            baglam.fetchIpAndPrint();
        } });

baglam.komutlar.push({ sira: 18, eslesir: function (c, cmd) { return c === 'ping logosoft.com.tr' || c === 'ping logosoft'; }, calistir: function (c, cmd) {
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
                    if (i < lines.length) { baglam.addLine(lines[i++], lines[i-1].indexOf('ONLINE') !== -1 ? 'ok' : ''); }
                    else { clearInterval(iv); }
                }, 200);
            }());
        } });

baglam.komutlar.push({ sira: 22, eslesir: function (c, cmd) { return c === 'uname -a'; }, calistir: function (c, cmd) {
            baglam.addLine('Linux devops 6.5.0-furkan-sarica #1 SMP Thu Jan 01 00:00:00 UTC 2026 x86_64 GNU/Linux');
        } });

baglam.komutlar.push({ sira: 23, eslesir: function (c, cmd) { return c === 'theme light' || c === 'theme set light'; }, calistir: function (c, cmd) {
            document.body.classList.remove('theme-dracula', 'theme-monokai', 'theme-cyberpunk', 'theme-ubuntu', 'theme-amber');
            document.body.classList.add('light-theme');
            baglam.addLine('Theme set to: Solarized Light', 'ok');
            baglam.addLine('Type "theme dark" to return to dark mode.');
        } });

baglam.komutlar.push({ sira: 24, eslesir: function (c, cmd) { return c === 'theme dark' || c === 'theme set dark' || c === 'dark'; }, calistir: function (c, cmd) {
            document.body.classList.remove('light-theme');
            baglam.addLine('Theme set to: default (dark)', 'ok');
        } });

baglam.komutlar.push({ sira: 25, eslesir: function (c, cmd) { return c === 'theme ls' || c === 'theme list'; }, calistir: function (c, cmd) {
            baglam.addLine('Available themes:');
            baglam.addLine('  default   — dark hacker green  [ active ]');
            baglam.addLine('  dracula   — purple/pink palette');
            baglam.addLine('  monokai   — warm yellow-green');
            baglam.addLine('  cyberpunk — neon green on deep purple');
            baglam.addLine('  ubuntu    — Ubuntu orange');
            baglam.addLine('  amber     — retro terminal amber');
            baglam.addLine('  light     — Solarized Light');
            baglam.addLine('Usage: theme set <name>');
        } });

baglam.komutlar.push({ sira: 26, eslesir: function (c, cmd) { return c.startsWith('theme set '); }, calistir: function (c, cmd) {
            var themeName = c.slice(10).trim();
            var validThemes = ['default', 'dracula', 'monokai', 'cyberpunk', 'ubuntu', 'amber'];
            document.body.classList.remove('theme-dracula', 'theme-monokai', 'theme-cyberpunk', 'theme-ubuntu', 'theme-amber', 'light-theme');
            if (themeName === 'default' || themeName === 'dark') {
                baglam.addLine('Theme set to: default', 'ok');
            } else if (themeName === 'light') {
                document.body.classList.add('light-theme');
                baglam.addLine('Theme set to: Solarized Light', 'ok');
                baglam.addLine('Type "theme dark" to return to dark mode.');
            } else if (validThemes.indexOf(themeName) !== -1) {
                document.body.classList.add('theme-' + themeName);
                baglam.addLine('Theme set to: ' + themeName, 'ok');
            } else {
                baglam.addLine('Unknown theme: ' + themeName + '. Run "theme ls" to see options.', 'err');
            }
        } });

baglam.komutlar.push({ sira: 27, eslesir: function (c, cmd) { return c === 'neofetch' || c === 'fastfetch'; }, calistir: function (c, cmd) {
            baglam.addNeofetch();
        } });

baglam.komutlar.push({ sira: 28, eslesir: function (c, cmd) { return c === 'curl wttr.in/istanbul' || c === 'curl wttr.in/istanbul?0atq' || c === 'curl wttr.in/istanbul?format=3' || c === 'curl wttr.in'; }, calistir: function (c, cmd) {
            baglam.addLine('Fetching weather for Istanbul...', 'ok');
            baglam.fetchWeather();
        } });

baglam.komutlar.push({ sira: 29, eslesir: function (c, cmd) { return c === 'reboot'; }, calistir: function (c, cmd) {
            baglam.addLine('Rebooting system...', 'ok');
            setTimeout(function () {
                baglam.output.innerHTML = '';
                runBootSequence();
            }, 600);
        } });

baglam.komutlar.push({ sira: 30, eslesir: function (c, cmd) { return c === 'ping' || c === 'ping furkan-sarica.com' || c === 'ping furkan-sarica'; }, calistir: function (c, cmd) {
            baglam.addLine('PING furkan-sarica.com (127.0.0.1): 56 data bytes', 'ok');
            baglam.addLine('Launching Ping-Pong...', 'ok');
            setTimeout(function () { if (window.startPingPong) window.startPingPong(); }, 400);
        } });

baglam.komutlar.push({ sira: 31, eslesir: function (c, cmd) { return c.startsWith('ping '); }, calistir: function (c, cmd) {
            var pingTarget = c.slice(5).trim();
            if (!pingTarget) {
                baglam.addLine('Usage: ping <host>', 'err');
            } else {
                baglam.addLine('PING ' + pingTarget + ': 64 data bytes');
                var pingSeq = 0;
                var pingInterval = setInterval(function () {
                    pingSeq++;
                    var pingTime = (Math.random() * 20 + 8).toFixed(1);
                    baglam.addLine('64 bytes from ' + pingTarget + ': icmp_seq=' + pingSeq + ' ttl=117 time=' + pingTime + ' ms');
                    if (pingSeq >= 4) {
                        clearInterval(pingInterval);
                        setTimeout(function () {
                            baglam.addLine('');
                            baglam.addLine('--- ' + pingTarget + ' ping statistics ---');
                            baglam.addLine('4 packets transmitted, 4 received, 0% packet loss');
                        }, 200);
                    }
                }, 1000);
            }

        // ===== Docker Commands =====
        } });

baglam.komutlar.push({ sira: 32, eslesir: function (c, cmd) { return c === 'docker ps'; }, calistir: function (c, cmd) {
            baglam.addBlock('<pre style="color:var(--text-secondary);font-size:0.78rem;overflow-x:auto">' +
                'CONTAINER ID   IMAGE                COMMAND              CREATED        STATUS          PORTS                    NAMES\n' +
                'a1b2c3d4e5f6   nginx:alpine         "nginx -g \'daem…"   2 weeks ago    Up 2 weeks      0.0.0.0:443->443/tcp     furkan-sarica-web\n' +
                'b9c8d7e6f5a4   furkan-sarica/ai:v2        "python ai_pipe…"   3 days ago     Up 3 days       127.0.0.1:5000->5000/tcp ai-pipeline\n' +
                'c0d1e2f3a4b5   grafana/grafana:10   "./run.sh"           5 days ago     Up 5 days       127.0.0.1:3001->3001/tcp grafana' +
                '</pre>');
        } });

baglam.komutlar.push({ sira: 33, eslesir: function (c, cmd) { return c === 'docker stats' || c === 'docker stats --no-stream'; }, calistir: function (c, cmd) {
            baglam.addBlock('<pre style="color:var(--text-secondary);font-size:0.78rem;overflow-x:auto">' +
                'CONTAINER ID   NAME           CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O\n' +
                'a1b2c3d4e5f6   furkan-sarica-web    0.3%    45.2MiB / 2GiB        2.21%   1.2GB / 850MB    120MB / 0B\n' +
                'b9c8d7e6f5a4   ai-pipeline    12.4%   412.8MiB / 2GiB      20.15%   234MB / 89MB     456MB / 12MB\n' +
                'c0d1e2f3a4b5   grafana        2.1%    187.3MiB / 2GiB       9.14%   78MB / 34MB      234MB / 5MB' +
                '</pre>');
        } });

baglam.komutlar.push({ sira: 34, eslesir: function (c, cmd) { return c.startsWith('docker logs '); }, calistir: function (c, cmd) {
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
                dockerLogs.forEach(function (line) { baglam.addLine(line); });
            } else {
                baglam.addLine('Error: No such container: ' + dockerLogsTarget, 'err');
                baglam.addLine('Running containers: furkan-sarica-web, ai-pipeline, grafana');
            }
        } });

baglam.komutlar.push({ sira: 35, eslesir: function (c, cmd) { return c === 'docker stop furkan-sarica-web' || c === 'docker stop portfolio-ui'; }, calistir: function (c, cmd) {
            var dockerStopName = c === 'docker stop furkan-sarica-web' ? 'furkan-sarica-web' : 'portfolio-ui';
            baglam.addLine(dockerStopName, 'ok');
            setTimeout(function () {
                var overlay = document.getElementById('nginx-502-overlay');
                if (overlay) {
                    overlay.classList.add('active');
                    overlay.setAttribute('aria-hidden', 'false');
                }
            }, 600);
        } });

baglam.komutlar.push({ sira: 36, eslesir: function (c, cmd) { return c === 'docker start furkan-sarica-web' || c === 'docker start portfolio-ui'; }, calistir: function (c, cmd) {
            var dockerStartName = c === 'docker start furkan-sarica-web' ? 'furkan-sarica-web' : 'portfolio-ui';
            var overlay502 = document.getElementById('nginx-502-overlay');
            if (overlay502 && overlay502.classList.contains('active')) {
                overlay502.classList.remove('active');
                overlay502.setAttribute('aria-hidden', 'true');
                baglam.addLine(dockerStartName, 'ok');
            } else {
                baglam.addLine(dockerStartName, 'ok');
                baglam.addLine('[ OK ] container ' + dockerStartName + ' already running', 'ok');
            }

        // ===== Kubernetes Commands =====
        } });

baglam.komutlar.push({ sira: 37, eslesir: function (c, cmd) { return c === 'kubectl get pods' || c === 'kubectl get pods -n default'; }, calistir: function (c, cmd) {
            var uid1 = Math.random().toString(36).slice(2, 7);
            var uid2 = Math.random().toString(36).slice(2, 7);
            var uid3 = Math.random().toString(36).slice(2, 7);
            baglam.addBlock('<pre style="color:var(--text-secondary);font-size:0.78rem">' +
                'NAME                              READY   STATUS    RESTARTS   AGE\n' +
                'portfolio-ui-7d9f8b6c5-' + uid1 + '    1/1     Running   0          4d2h\n' +
                'portfolio-api-6b8d4f9a2-' + uid2 + '   1/1     Running   0          4d2h\n' +
                'monitor-5c7e3a1b8-' + uid3 + '         1/1     Running   2          2h17m' +
                '</pre>');
        } });

baglam.komutlar.push({ sira: 38, eslesir: function (c, cmd) { return c.startsWith('kubectl delete pod '); }, calistir: function (c, cmd) {
            var podName = cmd.slice('kubectl delete pod '.length).trim() || 'portfolio-ui-xyz';
            var newUid = Math.random().toString(36).slice(2, 7);
            var baseName = podName.replace(/-[a-z0-9]+-[a-z0-9]+$/, '');
            if (!baseName || baseName === podName) baseName = podName.split('-').slice(0, -1).join('-') || podName;
            baglam.addLine('pod "' + podName + '" deleted', 'ok');
            setTimeout(function () {
                baglam.addLine('[ReplicaSet] Detected pod deficit — scheduling replacement...', 'ok');
                setTimeout(function () {
                    baglam.addLine('pod "' + baseName + '-' + Math.random().toString(36).slice(2, 12) + '" created', 'ok');
                    baglam.addLine('[K8s] High availability maintained. Pods: 1/1 Running ✓', 'ok');
                }, 1200);
            }, 800);
        } });

baglam.komutlar.push({ sira: 39, eslesir: function (c, cmd) { return c === 'kubectl' || c.startsWith('kubectl '); }, calistir: function (c, cmd) {
            baglam.addLine('error: unknown command "' + cmd.slice(8).trim() + '" — try: kubectl get pods', 'err');

        // ===== Network Tools =====
        } });

baglam.komutlar.push({ sira: 40, eslesir: function (c, cmd) { return c === 'nmap' || c === 'nmap furkan-sarica.com' || c === 'nmap localhost' || c === 'nmap 127.0.0.1'; }, calistir: function (c, cmd) {
            var nmapIsLocal = c.includes('localhost') || c.includes('127.0.0.1');
            var nmapTarget = nmapIsLocal ? '127.0.0.1' : '192.168.1.100';
            var nmapHost   = nmapIsLocal ? 'localhost'  : 'furkan-sarica.com';
            baglam.addLine('Starting Nmap 7.92 ( https://nmap.org )', 'ok');
            baglam.addLine('Nmap scan report for ' + nmapHost + ' (' + nmapTarget + ')', 'ok');
            baglam.addLine('Host is up (0.0' + (Math.floor(Math.random() * 89) + 10) + 's latency).');
            setTimeout(function () {
                baglam.addLine('Not shown: 994 closed tcp ports (conn-refused)');
                baglam.addLine('PORT      STATE SERVICE   VERSION');
                baglam.addLine('22/tcp    open  ssh        OpenSSH 8.9p1');
                baglam.addLine('80/tcp    open  http       Nginx Reverse Proxy');
                baglam.addLine('443/tcp   open  https      SSL/TLS Active');
                baglam.addLine('3000/tcp  open  grafana    Observability');
                baglam.addLine('2375/tcp  open  docker     Container Engine');
                baglam.addLine('51820/udp open  wireguard  VPN Lab');
                baglam.addLine('');
                baglam.addLine('Nmap done: 1 IP address (1 host up) scanned in ' + (Math.random() * 3 + 1).toFixed(2) + 's', 'ok');
            }, 1200);
        } });

baglam.komutlar.push({ sira: 41, eslesir: function (c, cmd) { return c === 'traceroute furkan-sarica.com' || c === 'traceroute' || c === 'tracert furkan-sarica.com'; }, calistir: function (c, cmd) {
            baglam.addLine('traceroute to furkan-sarica.com (192.168.20.10), 30 hops max, 60 byte packets', 'ok');
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
                setTimeout(function () { baglam.addLine(hop); }, (i + 1) * 350);
            });

        // ===== Vim Trap =====
        } });

baglam.komutlar.push({ sira: 46, eslesir: function (c, cmd) { return c === 'dig furkan-sarica.com' || c === 'dig' || c === 'nslookup furkan-sarica.com' || c === 'nslookup'; }, calistir: function (c, cmd) {
            var isNslookup = c.startsWith('nslookup');
            if (isNslookup) {
                baglam.addLine('Server:   8.8.8.8');
                baglam.addLine('Address:  8.8.8.8#53');
                baglam.addLine('');
                baglam.addLine('Non-authoritative answer:');
                baglam.addLine('Name:   furkan-sarica.com');
                baglam.addLine('Address: 104.21.42.42');
                baglam.addLine('');
                baglam.addLine('Mail exchanger: mail.furkan-sarica.com (priority 10)');
                baglam.addLine('');
                baglam.addLine('TXT record: "Looking for a DevOps/Network Engineer? You found him!"', 'ok');
            } else {
                baglam.addLine('; <<>> DiG 9.18.1-Ubuntu <<>> furkan-sarica.com');
                baglam.addLine(';; global options: +cmd');
                baglam.addLine(';; Got answer:');
                baglam.addLine(';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 1337');
                baglam.addLine(';; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1');
                baglam.addLine('');
                baglam.addLine(';; QUESTION SECTION:');
                baglam.addLine(';furkan-sarica.com.         IN  A');
                baglam.addLine('');
                baglam.addLine(';; ANSWER SECTION:');
                baglam.addLine('furkan-sarica.com.   300 IN  A     104.21.42.42');
                baglam.addLine('furkan-sarica.com.   300 IN  MX 10 mail.furkan-sarica.com.');
                baglam.addLine('furkan-sarica.com.   300 IN  TXT   "Looking for a DevOps/Network Engineer? You found him!"', 'ok');
                baglam.addLine('');
                baglam.addLine(';; Query time: 12 msec');
                baglam.addLine(';; SERVER: 8.8.8.8#53(8.8.8.8)');
                baglam.addLine(';; MSG SIZE  rcvd: 182');
            }

        // ===== history Command =====
        } });

baglam.komutlar.push({ sira: 47, eslesir: function (c, cmd) { return c === 'history'; }, calistir: function (c, cmd) {
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
            sysHistory.forEach(function(l) { baglam.addLine(l); });
            baglam.addLine('');
            var offset = 205;
            for (var hi = 0; hi < baglam.cmdHistory.length; hi++) {
                baglam.addLine('  ' + (offset + hi) + '  ' + baglam.cmdHistory[baglam.cmdHistory.length - 1 - hi]);
            }

        // ===== cmatrix: Toggle Matrix Rain =====
        } });

baglam.komutlar.push({ sira: 49, eslesir: function (c, cmd) { return c === 'man furkan' || c === 'man furkan-sarica'; }, calistir: function (c, cmd) {
            baglam.addLine('FURKAN(1)                  User Commands                 FURKAN(1)');
            baglam.addLine('');
            baglam.addLine('NAME');
            baglam.addLine('       furkan - DevOps & Network Engineer');
            baglam.addLine('');
            baglam.addLine('SYNOPSIS');
            baglam.addLine('       hire [--role="DevOps"] [--location=remote] furkan');
            baglam.addLine('');
            baglam.addLine('DESCRIPTION');
            baglam.addLine('       Furkan is a highly scalable, fault-tolerant engineer designed for');
            baglam.addLine('       distributed environments. Optimized for Linux, Docker, Kubernetes,');
            baglam.addLine('       and network infrastructure workloads. Capable of operating under');
            baglam.addLine('       high load with zero downtime. Supports hot-reload of skills via');
            baglam.addLine('       continuous learning (--enable-autodidact).');
            baglam.addLine('');
            baglam.addLine('OPTIONS');
            baglam.addLine('       --role=<role>');
            baglam.addLine('              Supported: DevOps, Network Engineer, SysAdmin, Cloud Engineer');
            baglam.addLine('');
            baglam.addLine('       --location=<loc>');
            baglam.addLine('              Supported: remote, hybrid, on-site (Istanbul preferred)');
            baglam.addLine('');
            baglam.addLine('       --stack=<stack>');
            baglam.addLine('              Linux, Docker, Kubernetes, Ansible, Terraform, Grafana,');
            baglam.addLine('              Nginx, Python, Bash, Git, pfSense, WireGuard, OpenVPN');
            baglam.addLine('');
            baglam.addLine('EXIT CODES');
            baglam.addLine('       0   Hired successfully');
            baglam.addLine('       1   Position already filled (re-run later)');
            baglam.addLine('       42  Offer rejected — compensation below market rate');
            baglam.addLine('');
            baglam.addLine('BUGS');
            baglam.addLine('       May occasionally over-engineer solutions. Pair with coffee.');
            baglam.addLine('');
            baglam.addLine('AUTHOR');
            baglam.addLine('       Furkan <contact@furkan-sarica.com>');
            baglam.addLine('');
            baglam.addLine('SEE ALSO');
            baglam.addLine('       cat cv.pdf(1), ping furkan-sarica.com(8), hire(1)');
            baglam.addLine('');
            baglam.addLine('FURKAN(1)                  April 2025                     FURKAN(1)', 'ok');

        // ===== man Command =====
        } });

baglam.komutlar.push({ sira: 50, eslesir: function (c, cmd) { return c.startsWith('man ') || c === 'man'; }, calistir: function (c, cmd) {
            var manArgs = c.split(' ').slice(1);
            if (manArgs.length === 0 || manArgs[0] === '') {
                baglam.addLine('What manual page do you want?', 'err');
                baglam.addLine('Usage: man [command]');
            } else {
                var manPage = manArgs[0];
                if (baglam.manuals[manPage]) {
                    baglam.addBlock(baglam.manuals[manPage]);
                } else {
                    baglam.addLine('No manual entry for ' + manPage, 'err');
                }
            }

        // ===== chmod Permission Puzzle =====
        } });

baglam.komutlar.push({ sira: 52, eslesir: function (c, cmd) { return c.startsWith('curl') && (c.includes('api.json') || c.includes('hire-me') || c.includes('api.furkan-sarica.com')); }, calistir: function (c, cmd) {
            baglam.addLine('  % Total    % Received  % Xferd  Average Speed   Time    Total');
            baglam.addLine('                                 Dload  Upload   Total   Spent    Left  Speed');
            baglam.addLine('100   720  100   720    0     0   4096      0 --:--:-- --:--:-- --:--:-- 4114');
            baglam.addLine('');
            baglam.addBlock(
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

        } });

baglam.komutlar.push({ sira: 53, eslesir: function (c, cmd) { return c === 'gh repo list' || c === 'ls ~/repos' || c === 'ls ~/repos/'; }, calistir: function (c, cmd) {
            baglam.addLine('Fetching repositories from GitHub...', 'ok');
            fetch('https://api.github.com/users/furkan-sarica/repos?sort=updated&per_page=5')
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.json();
                })
                .then(function (repos) {
                    baglam.addLine('NAME                          STARS   DESCRIPTION');
                    baglam.addLine('─'.repeat(60));
                    repos.forEach(function (repo) {
                        var name = (repo.name || '').padEnd(30, ' ').slice(0, 30);
                        var stars = String(repo.stargazers_count || 0).padStart(3, ' ');
                        var desc = (repo.description || '—').slice(0, 40);
                        baglam.addLine(name + '  ★ ' + stars + '  ' + desc);
                    });
                    baglam.addLine('');
                    baglam.addLine('Run "gh repo list" to refresh.');
                })
                .catch(function () {
                    baglam.addLine('Error: could not reach api.github.com. Check your network.', 'err');
                });

        } });
});
