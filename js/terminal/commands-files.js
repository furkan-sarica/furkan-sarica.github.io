// Sanal dosya sistemi komutları.
PortfolioTerminal.kaydet(function (baglam) {
baglam.komutlar.push({ sira: 14, eslesir: function (c, cmd) { return c === 'pwd'; }, calistir: function (c, cmd) {
            baglam.addLine(baglam.currentDir);
        } });

baglam.komutlar.push({ sira: 15, eslesir: function (c, cmd) { return c === 'ls' || c === 'ls -la' || c === 'ls -l' || c === 'ls -a'; }, calistir: function (c, cmd) {
            var contents = baglam.vfsTree[baglam.currentDir];
            if (contents === undefined) {
                baglam.addLine('ls: cannot access \'' + baglam.currentDir + '\': No such file or directory', 'err');
            } else if (contents.length === 0) {
                baglam.addLine('(empty directory)');
            } else {
                baglam.addLine(contents.join('  '));
            }
        } });

baglam.komutlar.push({ sira: 16, eslesir: function (c, cmd) { return c === 'ls skills/' || c === 'ls skills'; }, calistir: function (c, cmd) {
            baglam.addLine('[Network & Security]');
            baglam.addLine('  TCP/IP  VLAN  VPN  WireGuard  pfSense  Nmap  Firewall  IDS/IPS');
            baglam.addLine('');
            baglam.addLine('[DevOps & Containers]');
            baglam.addLine('  Docker  Kubernetes  Helm  CI/CD  GitHub Actions  GitLab  Jenkins');
            baglam.addLine('');
            baglam.addLine('[Cloud & Infrastructure]');
            baglam.addLine('  AWS  Azure  GCP  Terraform  Ansible  Nginx  HAProxy  Load Balancing');
            baglam.addLine('');
            baglam.addLine('[Monitoring & Observability]');
            baglam.addLine('  Grafana  Prometheus  ELK  Zabbix  PRTG  Log Management');
            baglam.addLine('');
            baglam.addLine('[Development]');
            baglam.addLine('  Python  Bash  JavaScript  TypeScript  React  Node.js  SQL  NoSQL');
            baglam.addLine('');
            baglam.addLine('[Business Systems]');
            baglam.addLine('  SAP Business One  ERP  CRM  Digital Transformation  Business Analysis');
        } });

baglam.komutlar.push({ sira: 17, eslesir: function (c, cmd) { return c === 'cat experience.txt' || c === 'cat experience'; }, calistir: function (c, cmd) {
            baglam.addLine('=== EXPERIENCE.LOG ===');
            baglam.addLine('');
            baglam.addLine('[2026-05 -- 2026-07] Logosoft Bilişim Teknolojileri A.Ş.');
            baglam.addLine('Position: AI Solutions Engineer Intern');
            baglam.addLine('Location: Ümraniye, İstanbul, Türkiye (Ofiste)');
            baglam.addLine('Status: TAMAMLANDI');
            baglam.addLine('');
            baglam.addLine('Responsibilities:');
            baglam.addLine('  • Kurumsal yazılım dağıtımı ve entegrasyon');
            baglam.addLine('  • SAP Business One modül yapılandırma');
            baglam.addLine('  • İş analizi ve dijital dönüşüm süreçleri');
            baglam.addLine('  • CRM/ERP sistem yönetimi');
            baglam.addLine('');
            baglam.addLine('Skills Gained: CRM, ERP, SAP B1, Business Analysis,');
            baglam.addLine('                Digital Transformation, Enterprise Software');
            baglam.addLine('');
            baglam.addLine('--- EOF ---');
        } });

baglam.komutlar.push({ sira: 19, eslesir: function (c, cmd) { return c === 'cd' || c === 'cd ~'; }, calistir: function (c, cmd) {
            baglam.currentDir = '/home/furkan';
            baglam.updatePrompt();
        } });

baglam.komutlar.push({ sira: 20, eslesir: function (c, cmd) { return c.startsWith('cd '); }, calistir: function (c, cmd) {
            var cdArg = cmd.slice(3).trim();
            var cdTarget;
            if (cdArg === '~' || cdArg === '/home/furkan') {
                cdTarget = '/home/furkan';
            } else if (cdArg === '/') {
                cdTarget = '/';
            } else if (cdArg === '..') {
                var cdLast = baglam.currentDir.lastIndexOf('/');
                cdTarget = cdLast > 0 ? baglam.currentDir.slice(0, cdLast) : '/';
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
                cdTarget = baglam.currentDir === '/' ? '/' + cdArg : baglam.currentDir + '/' + cdArg;
            }
            cdTarget = cdTarget.replace(/\/$/, '') || '/';
            if (baglam.vfsTree.hasOwnProperty(cdTarget)) {
                baglam.currentDir = cdTarget;
                baglam.updatePrompt();
            } else {
                baglam.addLine('cd: ' + cdArg + ': No such file or directory', 'err');
            }
        } });

baglam.komutlar.push({ sira: 21, eslesir: function (c, cmd) { return c.startsWith('cat '); }, calistir: function (c, cmd) {
            var filename = cmd.slice(4).trim();
            // Strip path prefix if any
            var basename = filename.split('/').pop();
            if (basename === 'top_secret.txt') {
                if (!baglam.topSecretUnlocked) {
                    baglam.addLine('bash: top_secret.txt: Permission denied', 'err');
                    baglam.addLine('hint: try chmod 777 top_secret.txt');
                } else {
                    baglam.addLine('╔══════════════════════════════════════════════╗');
                    baglam.addLine('║       TOP SECRET — AUTHORIZED EYES ONLY      ║');
                    baglam.addLine('╠══════════════════════════════════════════════╣');
                    baglam.addLine('║                                              ║');
                    baglam.addLine('║  ██╗  ██╗██╗██████╗ ███████╗    ███╗   ███╗ ║');
                    baglam.addLine('║  ██║  ██║██║██╔══██╗██╔════╝    ████╗ ████║ ║');
                    baglam.addLine('║  ███████║██║██████╔╝█████╗      ██╔████╔██║ ║');
                    baglam.addLine('║  ██╔══██║██║██╔══██╗██╔══╝      ██║╚██╔╝██║ ║');
                    baglam.addLine('║  ██║  ██║██║██║  ██║███████╗    ██║ ╚═╝ ██║ ║');
                    baglam.addLine('║  ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝     ╚═╝ ║');
                    baglam.addLine('║                                              ║');
                    baglam.addLine('║  Clearance level: R00T                       ║');
                    baglam.addLine('║  Subject: Furkan Sarıca                      ║');
                    baglam.addLine('║  Status: HIGHLY RECOMMENDED FOR HIRE         ║');
                    baglam.addLine('║                                              ║');
                    baglam.addLine('║  Skills: Linux ████████████ 100%             ║');
                    baglam.addLine('║  Docker: ███████████░░ 90%                   ║');
                    baglam.addLine('║  Coffee intake: ████████████ CRITICAL        ║');
                    baglam.addLine('║                                              ║');
                    baglam.addLine('║  Secret passphrase: R00T_ACCESS_GRANTED      ║');
                    baglam.addLine('║  Contact: furkan@furkan-sarica.com                 ║');
                    baglam.addLine('╚══════════════════════════════════════════════╝', 'ok');
                }
            } else {
                var fileContent = baglam.catContent[basename];
                if (!fileContent) {
                    // Try cv commands too
                    if (basename === 'cv.pdf' || basename === 'cv') {
                        var isLangTr = document.body.classList.contains('lang-tr');
                        var cvUrl2 = isLangTr ? 'Furkan%20SARICA%20CV%20TR.pdf' : 'Furkan%20SARICA%20CV%20EN.pdf';
                        var cvName2 = isLangTr ? 'Furkan SARICA CV TR.pdf' : 'Furkan SARICA CV EN.pdf';
                        baglam.addLine('Downloading ' + cvName2 + '...', 'ok');
                        var dlLink2 = document.createElement('a');
                        dlLink2.href = cvUrl2;
                        dlLink2.download = cvName2;
                        document.body.appendChild(dlLink2);
                        dlLink2.click();
                        document.body.removeChild(dlLink2);
                        baglam.addLine('Done.', 'ok');
                    } else {
                        baglam.addLine('cat: ' + filename + ': No such file or directory', 'err');
                    }
                } else {
                    fileContent.split('\n').forEach(function (line) { baglam.addLine(line); });
                }
            }
        } });

baglam.komutlar.push({ sira: 51, eslesir: function (c, cmd) { return c.startsWith('chmod '); }, calistir: function (c, cmd) {
            var chmodArgs = cmd.slice(6).trim().split(/\s+/);
            var chmodPerm = chmodArgs[0] || '';
            var chmodFile = chmodArgs[1] || '';
            var chmodBase = chmodFile.split('/').pop();
            var validChmodPerms = ['777', '+x', '755', '+r', '644', '700', '+rx'];
            if (chmodBase === 'top_secret.txt' && validChmodPerms.indexOf(chmodPerm) !== -1) {
                baglam.topSecretUnlocked = true;
                baglam.addLine('Permissions updated.', 'ok');
                baglam.addLine('hint: cat top_secret.txt');
            } else if (chmodBase) {
                baglam.addLine('chmod: changing permissions of \'' + chmodFile + '\': Operation not permitted', 'err');
            } else {
                baglam.addLine('Usage: chmod <mode> <file>', 'err');
            }

        // ===== API Endpoint: curl api.json / hire-me =====
        } });
});
