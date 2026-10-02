// Terminal state private kalır; dosyalar yalnız kurulum fabrikalarını kaydeder.
(function () {
    var fabrikalar = [], baslatildi = false;
    window.PortfolioTerminal = {
        kaydet: function (kur) { fabrikalar.push(kur); },
        baslat: function () {
            if (baslatildi) return;
            baslatildi = true;
            cekirdegiBaslat();
        }
    };
    function cekirdegiBaslat() {
    var input = document.getElementById('cli-input');
    var output = document.getElementById('cli-output');
    if (!input || !output) return;

    var baglam = { komutlar: [] };
    Object.defineProperties(baglam, {
        "input": { get: function () { return input; }, set: function (deger) { input = deger; } },
        "output": { get: function () { return output; }, set: function (deger) { output = deger; } },
        "addLine": { get: function () { return addLine; } },
        "addBlock": { get: function () { return addBlock; } },
        "echoCmd": { get: function () { return echoCmd; } },
        "updatePrompt": { get: function () { return updatePrompt; } },
        "sections": { get: function () { return sections; }, set: function (deger) { sections = deger; } },
        "cliCommands": { get: function () { return cliCommands; }, set: function (deger) { cliCommands = deger; } },
        "vfsTree": { get: function () { return vfsTree; }, set: function (deger) { vfsTree = deger; } },
        "catContent": { get: function () { return catContent; }, set: function (deger) { catContent = deger; } },
        "currentDir": { get: function () { return currentDir; }, set: function (deger) { currentDir = deger; } },
        "dirDisplay": { get: function () { return dirDisplay; } },
        "awaitingSelfDestruct": { get: function () { return awaitingSelfDestruct; }, set: function (deger) { awaitingSelfDestruct = deger; } },
        "topSecretUnlocked": { get: function () { return topSecretUnlocked; }, set: function (deger) { topSecretUnlocked = deger; } },
        "manuals": { get: function () { return manuals; }, set: function (deger) { manuals = deger; } },
        "invalidCount": { get: function () { return invalidCount; }, set: function (deger) { invalidCount = deger; } },
        "fail2banActive": { get: function () { return fail2banActive; }, set: function (deger) { fail2banActive = deger; } },
        "cmdHistory": { get: function () { return cmdHistory; }, set: function (deger) { cmdHistory = deger; } },
        "historyIndex": { get: function () { return historyIndex; }, set: function (deger) { historyIndex = deger; } },
        "vimActive": { get: function () { return vimActive; }, set: function (deger) { vimActive = deger; } },
        "vimCmdMode": { get: function () { return vimCmdMode; }, set: function (deger) { vimCmdMode = deger; } },
        "vimCmdLine": { get: function () { return vimCmdLine; }, set: function (deger) { vimCmdLine = deger; } }
    });
    fabrikalar.forEach(function (kur) { kur(baglam); });
    baglam.komutlar.sort(function (a, b) { return a.sira - b.sira; });

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

    // Command history
    var cmdHistory = [];
    var historyIndex = -1;

    // ===== Vim Trap =====
    var vimActive = false;
    var vimCmdMode = false;
    var vimCmdLine = '';

    // ===== Fork Bomb =====

    // ===== Fail2Ban Lockout =====

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
                setTimeout(baglam.startSelfDestruct, 800);
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

        var eslesen = baglam.komutlar.find(function (komut) { return komut.eslesir(c, cmd); });
        if (eslesen) eslesen.calistir(c, cmd);
        else {
            cmdHandled = false;
            baglam.invalidCount++;
            baglam.addLine('Command not found: ' + cmd + " — type 'help'", 'err');
            if (window.playBeep) window.playBeep();
            if (baglam.invalidCount >= 5 && !baglam.fail2banActive) {
                baglam.triggerFail2Ban();
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

    }
}());
