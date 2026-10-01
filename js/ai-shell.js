// ===== Feature 7: Vitonom AI Terminal Shell (NVIDIA NIM & RAG) =====
(function () {
    var overlay = document.getElementById('ai-chat-overlay');
    var input = document.getElementById('ai-term-input');
    var history = document.getElementById('ai-term-history');
    var body = document.getElementById('ai-term-body');
    var isExecuting = false;


    function openAIChat() {
        if (!overlay) return;
        overlay.classList.remove('is-minimized');
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        if (input) {
            setTimeout(function() { input.focus(); }, 120);
        }
        scrollTerminalToBottom();
    }

    function closeAIChat() {
        if (!overlay) return;
        overlay.classList.remove('active');
        overlay.classList.remove('is-minimized');
        var win = overlay.querySelector('.ai-terminal-window');
        if (win) win.classList.remove('is-maximized');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function minimizeAIChat() {
        if (!overlay) return;
        var isMin = overlay.classList.toggle('is-minimized');
        var yellowBtn = overlay.querySelector('.t-btn-yellow');
        if (yellowBtn) {
            yellowBtn.title = isMin
                ? (currentLang === 'tr' ? 'Geri Yükle' : 'Restore')
                : (currentLang === 'tr' ? 'Simge Durumuna Küçült' : 'Minimize');
        }
        if (!isMin) {
            if (input) setTimeout(function() { input.focus(); }, 100);
            scrollTerminalToBottom();
        }
    }

    function toggleMaximizeAIChat() {
        if (!overlay) return;
        if (overlay.classList.contains('is-minimized')) {
            overlay.classList.remove('is-minimized');
        }
        var win = overlay.querySelector('.ai-terminal-window');
        if (!win) return;
        var isMax = win.classList.toggle('is-maximized');
        var greenBtn = win.querySelector('.t-btn-green');
        if (greenBtn) {
            greenBtn.title = isMax
                ? (currentLang === 'tr' ? 'Önceki Boyut' : 'Restore')
                : (currentLang === 'tr' ? 'Tam Ekran' : 'Fullscreen');
        }
        scrollTerminalToBottom();
    }

    function handleAiHeaderClick(e) {
        if (overlay && overlay.classList.contains('is-minimized')) {
            minimizeAIChat();
        }
    }

    function scrollTerminalToBottom() {
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }

    function parseMarkdown(text) {
        var raw = text || '';
        var div = document.createElement('div');
        div.textContent = raw;
        var s = div.innerHTML;

        s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
        s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        var lines = s.split('\n');
        var inList = false;
        var out = [];
        lines.forEach(function(l) {
            var trimmed = l.trim();
            if (trimmed.indexOf('• ') === 0 || trimmed.indexOf('- ') === 0) {
                if (!inList) { out.push('<ul>'); inList = true; }
                out.push('<li>' + trimmed.substring(2) + '</li>');
            } else if (/^\d+\.\s/.test(trimmed)) {
                if (!inList) { out.push('<ul>'); inList = true; }
                out.push('<li>' + trimmed.replace(/^\d+\.\s/, '') + '</li>');
            } else {
                if (inList) { out.push('</ul>'); inList = false; }
                if (trimmed.length > 0) {
                    out.push('<p>' + trimmed + '</p>');
                }
            }
        });
        if (inList) out.push('</ul>');
        return out.join('');
    }

    function streamTerminalTypewriter(container, text, onDone) {
        container.innerHTML = '';
        var cursor = document.createElement('span');
        cursor.className = 'ai-term-cursor';
        cursor.textContent = '█';
        container.appendChild(cursor);

        var idx = 0;
        var step = Math.max(3, Math.floor(text.length / 35));
        var interval = setInterval(function() {
            idx += step;
            if (idx >= text.length) {
                clearInterval(interval);
                container.innerHTML = parseMarkdown(text);
                scrollTerminalToBottom();
                if (onDone) onDone();
                return;
            }
            container.innerHTML = parseMarkdown(text.slice(0, idx)) + '<span class="ai-term-cursor">█</span>';
            scrollTerminalToBottom();
        }, 10);
    }

    // Comprehensive Vitonom AI Conversational & Knowledge Engine
    function queryVitonomAI(query, isTr) {
        var raw = (query || '').trim();
        var q = raw.toLowerCase();

        // 1. Greetings & Pleasantries
        if (/^(selam|merhaba|slm|mrb|naber|nasılsın|nasilsin|günaydın|gunaydin|iyi günler|iyi gunler|iyi akşamlar|iyi aksamlar|hey|hello|hi|howdy|yo|whats up|what's up)/i.test(q) || q === 'selamlar' || q === 'merhabalar') {
            return isTr
                ? "Selam! Ben **Vitonom** — Furkan SARICA'nın kurumsal portfolyosu için çalışan yapay zeka asistanıyım. Sistemler devrede, mimariler aktif.\n\nBana Furkan'ın kariyerini (**CloudSpark**, **Microsoft**, **SAP B1** stajları), projelerini (**Tracefold**, **Roadmind**), Homelab altyapısını veya genel teknik konuları (**CLI**, **RAG**, **BBR**, **Docker**, **FastAPI**) sorabilirsin. Nereden başlayalım?"
                : "Hey there! I am **Vitonom** — Furkan SARICA's autonomous portfolio AI assistant. Systems are 100% operational.\n\nFeel free to ask about his career (**CloudSpark**, **Microsoft**, **SAP B1**), projects (**Tracefold**, **Roadmind**), homelab infrastructure, or general tech concepts (**CLI**, **RAG**, **BBR**, **Docker**, **FastAPI**). Where would you like to start?";
        }

        // 2. Identity & Who are you
        if (q.indexOf('sen kimsin') !== -1 || q.indexOf('sen nesin') !== -1 || q.indexOf('kimsin') !== -1 || q.indexOf('adın ne') !== -1 || q.indexOf('adin ne') !== -1 || q.indexOf('who are you') !== -1 || q.indexOf('what are you') !== -1 || q.indexOf('vitonom kim') !== -1) {
            return isTr
                ? "Ben **Vitonom** — Furkan SARICA'nın kurumsal portfolyosu için özel geliştirilmiş yapay zeka asistanı ve dijital ikiziyim.\n\n• **Rolüm:** Furkan'ın yazılım mimarisi, yapay zeka ajanları, RAG boru hatları, altyapı projeleri ve kariyeri hakkında detaylı teknik bilgi vermek.\n• **Yaklaşım:** Furkan gibi fizikalist, analitik ve doğrudan bir tavra sahibim; laf kalabalığı yapmadan ampirik, somut ve teknik gerçeklerle yanıt veririm.\n\nBana hem Furkan'ın deneyimlerini hem de genel yazılım/mimari kavramlarını doğrudan sorabilirsin."
                : "I am **Vitonom** — Furkan SARICA's digital persona and autonomous portfolio agent.\n\n• **Role:** Provide deep technical insights into Furkan's software architecture, enterprise AI systems, RAG pipelines, infrastructure, and career.\n• **Philosophy:** Grounded in physicalism, I deliver concise, empirical, and technically robust answers without superficial fluff.\n\nAsk me anything regarding Furkan's builds or broader software engineering topics.";
        }

        // 3. Past Experience & Career Chronology ("daha önce ne yaptı", "stajları", "geçmişi")
        if (q.indexOf('daha önce') !== -1 || q.indexOf('daha once') !== -1 || q.indexOf('önceden') !== -1 || q.indexOf('onceden') !== -1 || q.indexOf('geçmiş') !== -1 || q.indexOf('gecmis') !== -1 || q.indexOf('staj') !== -1 || q.indexOf('eski iş') !== -1 || q.indexOf('eski is') !== -1 || (q.indexOf('nerelerde') !== -1 && q.indexOf('çalıştı') !== -1)) {
            return isTr
                ? "Furkan SARICA'nın kariyer ve staj geçmişi kronolojik olarak şu şekildedir:\n\n1. **CloudSpark Cloud Data & AI Technologies (Ağu 2026 – Günümüz) — AI Solutions Engineer:**\n   Kurumsal AI ajanları, RAG mimarileri ve Python/FastAPI backend servisleri geliştiriyor; SAP Business One ve kurumsal sistemleri AI ile entegre ediyor.\n\n2. **Microsoft (Tem 2026 – Ağu 2026) — AI Innovator Stajyeri:**\n   Microsoft AI Innovators programına seçildi. Microsoft Foundry Local altyapısıyla gizlilik odaklı, tamamen yerel çalışan **Tracefold** RAG asistanını geliştirdi (24/24 doğrulama testi başarısı).\n\n3. **Logosoft Bilişim (Haz 2026 – Tem 2026) — AI Solutions Developer Stajyeri:**\n   SAP Business One için dahili yapay zeka destekli kurumsal ajan platformu geliştirdi; Python/Flask servisleriyle ERP iş akışlarını otomatize etti.\n\n4. **Binsal Bilişim (May 2026 – Haz 2026) — AI & ERP Integration Developer Stajyeri:**\n   SAP Business One üzerinde ERP entegrasyonu, Python API servisleri ve yapay zeka tabanlı süreç otomasyonlarının temelini attı.\n\n5. **Akademik & Homelab:**\n   İstanbul Gelişim Üniversitesi MIS (YBS) bölümünü 3.10 Onur Derecesi ile bitirdi ve üretim seviyesinde UmbrelOS homelab altyapısını kurdu."
                : "Furkan SARICA's chronological career and internship journey:\n\n1. **CloudSpark Cloud Data & AI Technologies (Aug 2026 – Present) — AI Solutions Engineer:**\n   Designs enterprise AI agents, RAG systems, and Python/FastAPI services, bridging ERP environments with operational AI.\n\n2. **Microsoft (Jul 2026 – Aug 2026) — AI Innovator Intern:**\n   Selected for Microsoft AI Innovators. Engineered **Tracefold**, a privacy-first, local RAG assistant on Microsoft Foundry Local (scored 24/24 on validation suite).\n\n3. **Logosoft (Jun 2026 – Jul 2026) — AI Solutions Developer Intern:**\n   Engineered an internal AI agent platform integrated with SAP Business One using Python and Flask.\n\n4. **Binsal Bilişim (May 2026 – Jun 2026) — AI & ERP Integration Developer Intern:**\n   Developed backend services and REST API integrations around SAP Business One ERP workflows.\n\n5. **Academic & Homelab:**\n   B.Sc. in Management Information Systems (3.10 Honor Degree) and production-grade UmbrelOS homelab.";
        }

        // 4. Experience Assessment ("deneyimi nasıl", "tecrübesi nasıl", "neler yapabilir")
        if (q.indexOf('deneyimi nasıl') !== -1 || q.indexOf('deneyimi nasil') !== -1 || q.indexOf('tecrübesi nasıl') !== -1 || q.indexOf('tecrubesi nasil') !== -1 || q.indexOf('ne katar') !== -1 || q.indexOf('neler yapabilir') !== -1 || q.indexOf('yetkinlik') !== -1) {
            return isTr
                ? "Furkan'ın deneyimi kurumsal yapay zeka, ERP sistemleri ve DevOps mühendisliği kesişiminde oldukça sağlam bir üretim geçmişine dayanır:\n\n• **Uygulamalı AI & RAG:** Microsoft'ta yerel modellerle (Foundry Local, SQLite vektör saklama, kosinüs benzerliği) gizlilik odaklı RAG mimarisi kurdu (Tracefold).\n• **Kurumsal Entegrasyon:** SAP Business One Service Layer API'ları ile 58'den fazla operasyonel ERP varlığını JSON Schema doğrulayarak yapay zeka ajanlarına bağladı.\n• **Backend & Altyapı:** Python ve FastAPI ile asenkron servisler yazmakta, Docker ve Kubernetes konteynerlerini yönetmekte ve Linux çekirdeğinde TCP BBR/FQ ağ optimizasyonları yapmaktadır.\n• **Küresel Onay:** Stanford AI ve Microsoft AI & ML dahil 10 uluslararası profesyonel sertifikaya sahiptir.\n\nÖzetle: Sadece yüzeysel demolar üreten değil, sahada kurumsal iş süreçlerini çözen ve kaynak kullanımını optimize eden kıdemli bir mühendislik yaklaşımına sahiptir."
                : "Furkan's experience spans applied enterprise AI, mission-critical ERP integrations, and DevOps engineering:\n\n• **Applied AI & Local RAG:** Engineered Tracefold at Microsoft using Foundry Local, local vector storage, and offline verification (24/24 eval score).\n• **Enterprise Systems:** Integrated SAP Business One Service Layer APIs, synchronizing 58+ ERP entities with AI agents.\n• **Backend & Infra:** High-throughput Python/FastAPI microservices, Docker/Kubernetes container orchestration, and Linux TCP BBR/FQ kernel tuning.\n• **Global Credentials:** 10 verified certifications including Stanford AI and Microsoft AI & ML.\n\nHe focuses strictly on resilient, resource-optimized production systems rather than brittle demos.";
        }

        // 5. Technical Concept: CLI (Command Line Interface)
        if (/\b(cli|komut satırı|komut satiri)\b/i.test(q) && (q.indexOf('nedir') !== -1 || q.indexOf('ne demek') !== -1 || q.indexOf('nasıl') !== -1 || q.indexOf('what is') !== -1 || q === 'cli')) {
            return isTr
                ? "**CLI (Command Line Interface - Komut Satırı Arayüzü):** Kullanıcının bir program veya işletim sistemiyle grafiksel butonlar yerine doğrudan metin tabanlı komutlar girerek haberleştiği arayüzdür.\n\n• **Neden Kullanılır?** Hız, kaynak tüketiminin sıfıra yakın olması, shell scriptlerle tam otomasyon imkânı ve uzak sunucularda (SSH) vazgeçilmez olması sebebiyle mühendislerin ana çalışma ortamıdır.\n• **Bu Sitede Neden Var?** Furkan sistem, DevOps ve altyapı mühendisliği odaklı çalıştığı için portfolyosunu da klasik bir web sayfası yerine yaşayan bir Linux Cyber Terminal (`vitonom@sarica:~$`) olarak kurguladık. Buradan `./tracefold.sh`, `./cloudspark.sh` gibi betikleri çalıştırabilir veya doğrudan sorular sorabilirsin."
                : "**CLI (Command Line Interface):** A text-based interface used to interact with software and operating systems by executing typed commands rather than navigating graphical buttons.\n\n• **Why it Matters:** Unmatched execution speed, near-zero resource overhead, scripting automation, and standard use across remote servers (SSH).\n• **Why on this Portfolio?** Because Furkan specializes in systems, DevOps, and applied AI infrastructure, we built this portfolio as an authentic Linux Cyber Terminal shell (`vitonom@sarica:~$`) supporting interactive scripts like `./tracefold.sh` and natural conversational queries.";
        }

        // 6. Technical Concept: RAG (Retrieval-Augmented Generation)
        if (/\b(rag|retrieval augmented)\b/i.test(q) && (q.indexOf('nedir') !== -1 || q.indexOf('ne demek') !== -1 || q.indexOf('what is') !== -1 || q === 'rag')) {
            return isTr
                ? "**RAG (Retrieval-Augmented Generation - Geri Getirmeyle Zenginleştirilmiş Üretim):** Büyük dil modellerinin (LLM) yanıt üretirken kendi ezberindeki bilgiyle yetinmeyip, harici ve güvenilir bir bilgi kaynağından (vektör veritabanı, şirket belgeleri, API'lar) ilgili parçaları bularak bağlam (context) olarak alması ve cevabı bu kanıtlara dayandırması mimarisidir.\n\n• **Avantajı:** Halüsinasyonu (yanılsama) önler, modelin bilmediği özel kurumsal verilerle doğru konuşmasını sağlar ve kaynak atfı (citation) sunar.\n• **Furkan'ın Katkısı:** Microsoft AI Innovators stajında Foundry Local ve SQLite vektör saklama kullanarak tamamen çevrimdışı ve yerel çalışan **Tracefold** RAG asistanını geliştirmiştir (24/24 doğrulama testi)."
                : "**RAG (Retrieval-Augmented Generation):** An architectural pattern where an LLM retrieves relevant factual context from external knowledge bases (vector databases, private documentation) before generating an evidence-grounded response.\n\n• **Core Benefits:** Eliminates hallucinations, keeps internal enterprise data private, and guarantees traceable citations.\n• **Furkan's Implementation:** Built **Tracefold** during his Microsoft internship—a fully local, privacy-first RAG assistant utilizing Microsoft Foundry Local and SQLite vector search.";
        }

        // 7. Technical Concept: TCP BBR & Kernel Tuning
        if ((q.indexOf('bbr') !== -1 || q.indexOf('fq') !== -1 || q.indexOf('congestion') !== -1 || q.indexOf('tıkanıklık') !== -1 || q.indexOf('tikaniklik') !== -1) && (q.indexOf('nedir') !== -1 || q.indexOf('ne demek') !== -1 || q.indexOf('nasıl') !== -1 || q === 'bbr')) {
            return isTr
                ? "**TCP BBR (Bottleneck Bandwidth and RTT):** Google tarafından geliştirilen modern bir ağ tıkanıklık kontrol algoritmasıdır.\n\n• **Farkı:** Klasik algoritmalar paket kaybını bekleyerek hızı yarıya düşürürken, BBR hattın gerçek bant genişliğini ve gidiş-dönüş süresini (RTT) sürekli ölçerek paket kaybı olmadan maksimum verim sağlar.\n• **FQ (Fair Queueing):** Paketlerin tampon belleklerde yığılmasını (bufferbloat) önleyen paket zamanlayıcıdır.\n• **Furkan'ın Homelab'indeki Yeri:** Furkan, ASUS UX310UQK sunucusunun Linux çekirdeğinde TCP BBR ve FQ algoritmalarını kalıcı aktif etmiştir (`99-homelab-performance.conf`). Bu sayede Tailscale üzerinden OLED TV'ye 4K HDR Remux medya akışı sıfır takılmayla iletilir."
                : "**TCP BBR (Bottleneck Bandwidth and RTT):** A state-of-the-art congestion control algorithm engineered by Google.\n\n• **Mechanism:** Measures real bottleneck bandwidth and round-trip time continuously rather than relying on packet drops.\n• **FQ (Fair Queueing):** Packet scheduler that eliminates bufferbloat.\n• **Homelab Implementation:** Configured on Furkan's ASUS Linux server (`99-homelab-performance.conf`) to stream high-bitrate 4K Dolby Vision remuxes flawlessly over Tailscale.";
        }

        // 8. Technical Concept: Docker, Kubernetes & Containers
        if ((q.indexOf('docker') !== -1 || q.indexOf('kubernetes') !== -1 || q.indexOf('k3s') !== -1 || q.indexOf('konteyner') !== -1) && (q.indexOf('nedir') !== -1 || q.indexOf('ne demek') !== -1 || q.indexOf('what is') !== -1)) {
            return isTr
                ? "**Docker & Kubernetes:** Yazılımları bağımlılıklarıyla birlikte izole konteyner paketleri halinde çalıştırma ve yönetme teknolojileridir.\n\n• **Docker:** Uygulamayı işletim sistemi seviyesinde izole eder; 'benim makinemde çalışıyordu' sorununu ortadan kaldırır.\n• **Kubernetes (K3s):** Bu konteynerlerin dağıtımını, ölçeklenmesini ve kendini onarmasını (self-healing) otomatik yönetir.\n• **Furkan'ın Kullanımı:** Furkan, CloudSpark'ta kurumsal AI servislerini Docker/K8s üzerinde barındırır. Kendi Homelab'inde ise umbrelOS üzerinde 15'ten fazla konteyner servisini (Immich, Home Assistant, Jellyfin vb.) yönetir."
                : "**Docker & Kubernetes:** The industry standards for containerizing, deploying, and orchestrating microservices.\n\n• **Docker:** Isolates software in lightweight environments with all dependencies bundled.\n• **Kubernetes (K3s):** Automates container lifecycle, scaling, and self-healing.\n• **Furkan's Usage:** Operates containerized AI architectures at CloudSpark and orchestrates 15+ homelab services via Docker on umbrelOS.";
        }

        // 9. Technical Concept: MIS / YBS
        if ((q.indexOf('mis') !== -1 || q.indexOf('ybs') !== -1 || q.indexOf('yönetim bilişim') !== -1 || q.indexOf('yonetim bilisim') !== -1) && (q.indexOf('nedir') !== -1 || q.indexOf('ne demek') !== -1)) {
            return isTr
                ? "**MIS (Management Information Systems - Yönetim Bilişim Sistemleri):** İşletme süreçleri ile bilgisayar mühendisliği teknolojilerini birleştiren disiplindir.\n\n• **Önemi:** Sadece kod yazmayı değil; o kodun hangi iş sürecini (ERP, CRM, maliyet, operasyonel verimlilik) optimize ettiğini anlayabilen mühendisler yetiştirir.\n• **Furkan'ın Derecesi:** Furkan, İstanbul Gelişim Üniversitesi MIS bölümünden **3.10 / 4.00 Onur Derecesi (Honor Degree)** ile mezun olmuştur."
                : "**MIS (Management Information Systems):** The interdisciplinary bridge between business operational workflows and computer software engineering.\n\n• **Value:** Equips engineers to align technical architecture directly with real business ROI.\n• **Furkan's Degree:** Graduated with a 3.10 / 4.00 Honor Degree from Istanbul Gelisim University.";
        }

        // 10. Technical Concept: SAP Business One & ERP
        if ((q.indexOf('sap') !== -1 || q.indexOf('erp') !== -1) && (q.indexOf('nedir') !== -1 || q.indexOf('ne demek') !== -1 || q === 'sap' || q === 'erp')) {
            return isTr
                ? "**ERP & SAP Business One:** Bir şirketin muhasebe, satın alma, envanter, üretim ve satış gibi tüm operasyonlarını tek bir merkezi veritabanında yöneten kurumsal yazılımdır (Kurumsal Kaynak Planlama).\n\n• **Yapay Zeka Entegrasyonu:** Furkan, Logosoft ve Binsal'da SAP B1 Service Layer API'ları ile yapay zeka ajanlarını konuşturmuş; çalışanların doğal dille ERP verisi sorgulamasını ve işlem yapmasını sağlayan platformlar inşa etmiştir."
                : "**ERP & SAP Business One:** Enterprise Resource Planning system that unifies accounting, purchasing, inventory, and sales into a cohesive transactional hub.\n\n• **AI Synergy:** Furkan engineered an AI agent platform at Logosoft/Binsal connecting natural language models with SAP B1 Service Layer transactional endpoints.";
        }

        // 11. About Furkan / Bio
        if (q.indexOf('furkan kimdir') !== -1 || q.indexOf('furkan kim') !== -1 || q.indexOf('kendinden bahset') !== -1 || (q.indexOf('hakkında') !== -1 && q.indexOf('furkan') !== -1) || q.indexOf('who is furkan') !== -1 || q.indexOf('about furkan') !== -1 || q.indexOf('biyografi') !== -1 || q === 'kim' || q === 'hakkında') {
            return isTr
                ? "Furkan SARICA, CloudSpark Cloud Data & AI Technologies bünyesinde **AI Solutions Engineer** olarak görev yapmaktadır.\n\n• **Uzmanlık:** Kurumsal AI ajanları (AI Agents), yerel RAG sistemleri, LLM çıkarımı, kurumsal ERP entegrasyonları (SAP Business One) ve yüksek performanslı backend servisleri.\n• **Öne Çıkan Başarılar:** Microsoft AI Innovators stajında Foundry Local ile gizlilik odaklı yerel RAG asistanı **Tracefold**'u geliştirdi (24/24 doğrulama testi). Logosoft ve Binsal'da SAP B1 AI otomasyon platformları inşa etti.\n• **Eğitim:** İstanbul Gelişim Üniversitesi MIS mezunudur (3.10 Onur Derecesi).\n• **Altyapı:** ASUS UX310UQK sunucusunda 10/10 Linux/UmbrelOS homelab işletmektedir."
                : "Furkan SARICA is an **AI Solutions Engineer** at CloudSpark Cloud Data & AI Technologies.\n\n• **Core Specialization:** Enterprise AI agents, local RAG architectures, LLM inference, mission-critical ERP integrations (SAP Business One), and production backend services.\n• **Key Milestones:** Engineered **Tracefold** (local, privacy-first RAG assistant) during his Microsoft AI Innovators internship with 24/24 benchmark score. Built SAP B1 AI platforms at Logosoft and Binsal Bilişim.\n• **Education:** B.Sc. in Management Information Systems from Istanbul Gelisim University (3.10 Honor Degree).\n• **Infrastructure:** Runs a fine-tuned Linux/UmbrelOS homelab on an ASUS UX310UQK server.";
        }

        // 12. Capabilities & Help
        if (q.indexOf('ne yapabilirsin') !== -1 || q.indexOf('neler yapabilirsin') !== -1 || q.indexOf('yardım') !== -1 || q.indexOf('yardim') !== -1 || q === 'help' || q.indexOf('komutlar') !== -1 || q.indexOf('ne sorabilirim') !== -1 || q.indexOf('what can you do') !== -1) {
            return isTr
                ? "Vitonom AI Shell üzerinden şu işlemleri yapabilir veya sorular sorabilirsin:\n\n• `./tracefold.sh` — Microsoft yerel RAG mimarisi ve test sonuçları\n• `./cloudspark.sh` — CloudSpark AI Solutions Engineer rolü ve sorumlulukları\n• `./tech-stack.sh` — Python, FastAPI, Docker, Kubernetes, BBR/FQ yetenekleri\n• `./certs.sh` — 10 profesyonel küresel sertifika (Stanford, Microsoft, AWS vb.)\n• `./download-cv.sh` — Güncel TR/EN özgeçmiş indirme\n• `./contact.sh` — İletişim kanalları ve profiller\n• `clear` — Ekranı temizleme\n\nAyrıca 'cli nedir', 'daha önce ne yaptı', 'deneyimi nasıl' gibi aklına gelen her teknik veya kariyer sorusunu sorabilirsin."
                : "Through the Vitonom AI Shell, you can execute scripts or ask freeform questions:\n\n• `./tracefold.sh` — Tracefold local RAG architecture & benchmarks\n• `./cloudspark.sh` — CloudSpark AI Solutions Engineer role & scope\n• `./tech-stack.sh` — Python, FastAPI, Docker, Kubernetes, networking\n• `./certs.sh` — 10 professional global certificates (Stanford, Microsoft, AWS)\n• `./download-cv.sh` — Direct resume download\n• `./contact.sh` — Contact channels and profiles\n• `clear` — Clear terminal screen\n\nYou can also enter any question directly in natural language.";
        }

        // 13. Philosophy & Physicalism
        if (q.indexOf('fizikalizm') !== -1 || q.indexOf('fiziksel') !== -1 || q.indexOf('felsefe') !== -1 || q.indexOf('dünya görüşü') !== -1 || q.indexOf('dunya gorusu') !== -1 || q.indexOf('bakış açısı') !== -1 || q.indexOf('physicalism') !== -1) {
            return isTr
                ? "Furkan fizikalisttir (fizikalizm). Yaklaşımımızın temeli fiziksel gerçeklik, ampirik veriler ve somut nedensellik üzerine kuruludur.\n\nSoyut kavram karmaşaları veya gösterişli 'demo' projeler yerine, sahada gerçekten çalışan, test edilen, kaynak tüketimi optimize edilmiş ve matematiksel olarak doğrulanabilen mühendislik çözümleri üretmeyi esas alırız."
                : "Furkan adheres to physicalism. Our engineering philosophy is anchored in physical reality, empirical data, and causal determinism.\n\nRather than abstract speculation or superficial demo toys, the focus is strictly on production-ready systems that solve measurable real-world problems and optimize hardware utilization.";
        }

        // 14. Projects Overview
        if (q.indexOf('projeler') !== -1 || q.indexOf('proje') !== -1 || q.indexOf('neler yaptı') !== -1 || q.indexOf('neler yaptın') !== -1 || q.indexOf('ne yaptı') !== -1 || q.indexOf('projects') !== -1 || q.indexOf('portfolio') !== -1 || q.indexOf('çalışmalar') !== -1) {
            return isTr
                ? "Furkan'ın öne çıkan projeleri:\n\n1. **Tracefold:** Microsoft Foundry Local tabanlı, çevrimdışı çalışan ve kaynak atıflı yerel RAG asistanı (24/24 eval skoru).\n2. **Roadmind:** Kodlama ajanları için optimize edilmiş AI Proje Prompt Stüdyosu (React, Vite, Express, Prisma, NVIDIA NIM, Ollama).\n3. **AI Destekli SAP Business One Platform:** 58+ operasyonel ERP varlığını yapay zeka ile otomatik yöneten kurumsal ajan entegrasyonu.\n4. **Üretim Seviyesi Homelab:** ASUS UX310UQK üzerinde umbrelOS 2.0, Tailscale mesh ağı, WireGuard ve Linux TCP BBR/FQ çekirdek optimizasyonu.\n5. **AI Operasyonel CRM Platformu:** OCR destekli fatura/belge analizi ve karar destek paneli.\n\nAyrıntı öğrenmek istediğin projenin adını doğrudan yazabilirsin."
                : "Furkan's featured engineering builds:\n\n1. **Tracefold:** Privacy-first, local RAG assistant powered by Microsoft Foundry Local (24/24 verified eval score).\n2. **Roadmind:** AI Project Prompt Studio tailored for coding agents (React, Vite, Express, Prisma, NVIDIA NIM, Ollama).\n3. **AI-Assisted SAP Business One Platform:** Enterprise AI agent platform synchronizing 58+ operational ERP entities.\n4. **Production Homelab:** umbrelOS 2.0 on ASUS UX310UQK with Tailscale mesh, WireGuard, and Linux TCP BBR/FQ kernel tuning.\n5. **AI Operational CRM Platform:** Full-stack OCR + AI insight decision support panel.\n\nType any project name for an architectural deep dive.";
        }

        // 15. Tracefold / Microsoft RAG
        if (q.indexOf('tracefold') !== -1 || q.indexOf('rag') !== -1 || q.indexOf('foundry') !== -1 || (q.indexOf('microsoft') !== -1 && q.indexOf('staj') !== -1)) {
            return isTr
                ? "Tracefold, Furkan SARICA'nın **Microsoft AI Innovators** stajında geliştirdiği, gizlilik odaklı (privacy-first) ve tamamen yerel çalışan bir Retrieval-Augmented Generation (RAG) asistanıdır.\n\n• **Mimari:** Microsoft Foundry Local, yerel embedding modelleri, LLM çıkarımı ve SQLite tabanlı vektör saklama ile kosinüs benzerliği (cosine similarity) filtreleme.\n• **Değerlendirme:** İki dilli (TR/EN) doğrulama test paketinde 24/24 başarı elde etmiştir.\n• **Güvenlik Mekanizmaları:** Çevrimdışı çeviri, kaynak atıf doğrulaması ve deterministik safe-refusal mekanizmalarına sahiptir."
                : "Tracefold is a privacy-first, fully local Retrieval-Augmented Generation (RAG) assistant engineered by Furkan SARICA during his Microsoft AI Innovators internship.\n\n• **Architecture:** Microsoft Foundry Local, local embedding models, LLM inference, SQLite-based vector storage, and cosine-similarity retrieval.\n• **Evaluation:** Scored 24/24 on the verified bilingual evaluation suite.\n• **Guardrails:** Offline translation, citation validation, and deterministic safe-refusal mechanisms.";
        }

        // 16. CloudSpark & Career
        if (q.indexOf('cloudspark') !== -1 || q.indexOf('nerede çalışıyor') !== -1 || q.indexOf('ne iş yapıyor') !== -1 || q.indexOf('kariyer') !== -1) {
            return isTr
                ? "Furkan SARICA, **CloudSpark Cloud Data & AI Technologies** bünyesinde **AI Solutions Engineer** olarak görev yapmaktadır (Ağustos 2026 – Günümüz).\n\n• **Sorumluluklar:** Kurumsal AI ajanları (AI Agents), RAG sistemleri ve LLM uygulamaları geliştirme.\n• **Backend & Altyapı:** Python ve FastAPI ile kurumsal servisler/API'lar kurmakta, SAP Business One gibi ERP ortamlarını yapay zeka ile operasyonel süreçlere entegre etmekte ve Docker/Kubernetes konteyner altyapılarını yönetmektedir."
                : "Furkan SARICA serves as an **AI Solutions Engineer** at CloudSpark Cloud Data & AI Technologies (Aug 2026 – Present).\n\n• **Responsibilities:** Designs enterprise AI agents, RAG systems, and LLM applications.\n• **Backend & Infra:** Builds high-performance services with Python & FastAPI, integrates enterprise ERPs (SAP Business One), and operates Docker/Kubernetes environments.";
        }

        // 17. SAP Business One & ERP
        if (q.indexOf('sap') !== -1 || q.indexOf('logosoft') !== -1 || q.indexOf('binsal') !== -1 || q.indexOf('erp') !== -1 || q.indexOf('business one') !== -1) {
            return isTr
                ? "Furkan, **Logosoft** ve **Binsal Bilişim** stajlarında SAP Business One ERP sistemi için yapay zeka destekli kurumsal ajan platformu geliştirmiştir.\n\n• **Kapsam:** 58'den fazla operasyonel ERP varlığını JSON Schema doğrulaması ve SAP B1 Service Layer API işlem akışlarıyla senkronize eden, Python/Flask tabanlı akıllı otomasyon mimarileri inşa etmiştir."
                : "Furkan engineered an AI-assisted enterprise platform for **SAP Business One** at Logosoft and Binsal Bilişim.\n\n• **Scope:** Synchronized 58+ operational ERP entities using JSON Schema validation and SAP B1 Service Layer transactional APIs with Python and Flask.";
        }

        // 18. Roadmind
        if (q.indexOf('roadmind') !== -1 || q.indexOf('prompt') !== -1) {
            return isTr
                ? "Roadmind, kodlama ajanları (coding agents) için geliştirilmiş bir **AI Proje Prompt Stüdyosudur**. Yapılandırılmış ve optimize edilmiş sistem promptları üretmeye odaklanır.\n\n• **Stack:** React, TypeScript, Vite, Express.js, Prisma, NVIDIA NIM ve Ollama."
                : "Roadmind is an **AI Project Prompt Studio** engineered for coding agents, streamlining structured prompt workflows.\n\n• **Stack:** React, TypeScript, Vite, Express.js, Prisma, NVIDIA NIM, and Ollama.";
        }

        // 19. Homelab & Hardware
        if (q.indexOf('homelab') !== -1 || q.indexOf('sunucu') !== -1 || q.indexOf('server') !== -1 || q.indexOf('umbrel') !== -1 || q.indexOf('oled') !== -1 || q.indexOf('donanım') !== -1 || q.indexOf('asus') !== -1) {
            return isTr
                ? "Furkan'ın üretim seviyesi **Homelab Altyapısı**, umbrelOS 2.0 üzerinde çalışan ve ASUS UX310UQK sunucusunda barındırılan konteyner otomasyonudur.\n\n• **Ağ:** Tailscale mesh ağı ve WireGuard VPN ile güvenli uzaktan erişim.\n• **Çekirdek:** Linux çekirdeğinde TCP BBR + FQ optimizasyonları ile yüksek bit-rate akışı.\n• **Medya:** Infuse ve SMB üzerinden OLED TV için 4K Remux / Dolby Vision IQ / Dolby Atmos medya akışı."
                : "Furkan's production **Homelab** runs on umbrelOS 2.0 hosted on an ASUS UX310UQK server.\n\n• **Networking:** Tailscale mesh and WireGuard VPN.\n• **Kernel:** Linux TCP BBR + FQ congestion control enabled.\n• **Media:** Direct SMB streaming to OLED TV supporting 4K Remux, Dolby Vision IQ, and Dolby Atmos via Infuse.";
        }

        // 20. Certifications
        if (q.indexOf('sertifika') !== -1 || q.indexOf('certificate') !== -1 || q.indexOf('stanford') !== -1 || q.indexOf('aws') !== -1 || q.indexOf('certs') !== -1 || q.indexOf('belge') !== -1) {
            return isTr
                ? "Furkan SARICA'nın sahip olduğu 10 profesyonel küresel sertifika:\n\n1. Stanford University — Artificial Intelligence Professional Certificate\n2. Microsoft — AI & ML Engineering Professional Certificate\n3. Vanderbilt University — Generative AI Software Engineering Specialization\n4. NVIDIA — Developer Program Member\n5. IBM & ISC2 — Cybersecurity Specialist Professional Certificate\n6. AWS — Cloud Solutions Architect Professional Certificate\n7. IBM — DevOps and Software Engineering Professional Certificate\n8. Google — IT Support Professional Certificate\n9. Meta — iOS Developer Professional Certificate\n10. Akamai Technologies — Network Engineering Professional Certificate"
                : "Furkan SARICA holds 10 professional global certificates:\n\n1. Stanford University — Artificial Intelligence Professional Certificate\n2. Microsoft — AI & ML Engineering Professional Certificate\n3. Vanderbilt University — Generative AI Software Engineering Specialization\n4. NVIDIA — Developer Program Member\n5. IBM & ISC2 — Cybersecurity Specialist Professional Certificate\n6. AWS — Cloud Solutions Architect Professional Certificate\n7. IBM — DevOps and Software Engineering Professional Certificate\n8. Google — IT Support Professional Certificate\n9. Meta — iOS Developer Professional Certificate\n10. Akamai Technologies — Network Engineering Professional Certificate";
        }

        // 21. Tech Stack & Skills
        if (q.indexOf('yetenek') !== -1 || q.indexOf('skill') !== -1 || q.indexOf('stack') !== -1 || q.indexOf('dil') !== -1 || q.indexOf('python') !== -1 || q.indexOf('fastapi') !== -1 || q.indexOf('docker') !== -1 || q.indexOf('kubernetes') !== -1) {
            return isTr
                ? "Furkan'ın teknik stack'i ve uzmanlıkları:\n\n• **AI & ML:** AI Agents, Local RAG, LLM Inference, Embeddings, Cosine Similarity, Prompt Engineering, NVIDIA NIM, Ollama, Microsoft Foundry Local.\n• **Backend:** Python, FastAPI, Flask, Node.js, Express.js, REST APIs, Prisma.\n• **DevOps & Bulut:** Docker, Kubernetes, K3s, GitOps, Linux, CI/CD, Prometheus, Grafana.\n• **Veritabanları:** SQLite (Vector Search), PostgreSQL, MariaDB.\n• **Ağ:** Tailscale, WireGuard, DNS, TCP/IP Tuning (BBR/FQ)."
                : "Furkan's core technical stack:\n\n• **AI & ML:** AI Agents, Local RAG, LLM Inference, Embeddings, Cosine Similarity, Prompt Engineering, NVIDIA NIM, Ollama, Microsoft Foundry Local.\n• **Backend:** Python, FastAPI, Flask, Node.js, Express.js, REST APIs, Prisma.\n• **DevOps & Cloud:** Docker, Kubernetes, K3s, GitOps, Linux, CI/CD, Prometheus, Grafana.\n• **Databases:** SQLite (Vector Search), PostgreSQL, MariaDB.\n• **Networking:** Tailscale, WireGuard, DNS, TCP/IP Tuning (BBR/FQ).";
        }

        // 22. Education
        if (q.indexOf('eğitim') !== -1 || q.indexOf('egitim') !== -1 || q.indexOf('okul') !== -1 || q.indexOf('üniversite') !== -1 || q.indexOf('universite') !== -1 || q.indexOf('education') !== -1 || q.indexOf('gpa') !== -1 || q.indexOf('ybs') !== -1 || q.indexOf('mis') !== -1) {
            return isTr
                ? "Furkan SARICA, **İstanbul Gelişim Üniversitesi** Yönetim Bilişim Sistemleri (MIS) bölümünden **3.10 / 4.00 Onur Derecesi (Honor Degree)** ile mezun olmuştur (2022–2026)."
                : "Furkan SARICA graduated from **Istanbul Gelisim University** with a B.Sc. in Management Information Systems (MIS), achieving a **3.10 / 4.00 Honor Degree** (2022–2026).";
        }

        // 23. Contact & CV
        if (q.indexOf('iletişim') !== -1 || q.indexOf('iletisim') !== -1 || q.indexOf('contact') !== -1 || q.indexOf('cv') !== -1 || q.indexOf('resume') !== -1 || q.indexOf('mail') !== -1 || q.indexOf('eposta') !== -1 || q.indexOf('ulaş') !== -1 || q.indexOf('ulas') !== -1 || q.indexOf('iş teklifi') !== -1 || q.indexOf('hire') !== -1) {
            var cMail = ['sarica', 'furkan'].join('.') + '@' + 'icloud.com';
            return isTr
                ? "Furkan SARICA ile doğrudan iletişim kanalları:\n\n• **E-posta:** [" + cMail + "](mailto:" + cMail + ")\n• **LinkedIn:** [linkedin.com/in/furkan-sarica](https://www.linkedin.com/in/furkan-sarica/)\n• **GitHub:** [github.com/furkan-sarica](https://github.com/furkan-sarica)\n• **Türkçe CV:** [Furkan SARICA CV TR.pdf](Furkan%20SARICA%20CV%20TR.pdf)\n• **English Resume:** [Furkan SARICA CV EN.pdf](Furkan%20SARICA%20CV%20EN.pdf)"
                : "Furkan SARICA direct contact information:\n\n• **Email:** [" + cMail + "](mailto:" + cMail + ")\n• **LinkedIn:** [linkedin.com/in/furkan-sarica](https://www.linkedin.com/in/furkan-sarica/)\n• **GitHub:** [github.com/furkan-sarica](https://github.com/furkan-sarica)\n• **Turkish CV:** [Furkan SARICA CV TR.pdf](Furkan%20SARICA%20CV%20TR.pdf)\n• **English Resume:** [Furkan SARICA CV EN.pdf](Furkan%20SARICA%20CV%20EN.pdf)";
        }

        // 24. Casual Thanks & Compliments
        if (/^(teşekkür|tesekkur|sağol|sagol|eyvallah|harika|süper|super|bravo|adamsın|adamsin|thanks|thank you|great|awesome|cool)/i.test(q)) {
            return isTr
                ? "Rica ederim efendim, her zaman. Merak ettiğin başka bir teknik detay veya incelemek istediğin bir proje varsa yazman yeterli."
                : "You're welcome. Always here to break down architecture or project details. Let me know what else you'd like to explore.";
        }

        // 25. Intelligent Semantic & Keyword Scoring Fallback
        var topics = [
            { id: 'projects', words: ['kod', 'yazılım', 'program', 'mimari', 'build', 'repo', 'ürün', 'sistem'], fn: function() { return queryVitonomAI('projeler', isTr); } },
            { id: 'experience', words: ['şirket', 'firma', 'çalıştı', 'nerede', 'stajyer', 'tecrübe', 'pozisyon', 'unvan', 'önce', 'once', 'iş', 'is'], fn: function() { return queryVitonomAI('daha önce ne yaptı', isTr); } },
            { id: 'stack', words: ['backend', 'frontend', 'veritabanı', 'database', 'api', 'servis', 'altyapı', 'linux', 'devops'], fn: function() { return queryVitonomAI('stack', isTr); } },
            { id: 'ai', words: ['yapay zeka', 'llm', 'model', 'zeka', 'agent', 'ajan', 'vektör', 'vector', 'embedding'], fn: function() { return queryVitonomAI('tracefold', isTr); } }
        ];

        var bestScore = 0;
        var bestFn = null;
        for (var i = 0; i < topics.length; i++) {
            var score = 0;
            for (var j = 0; j < topics[i].words.length; j++) {
                if (q.indexOf(topics[i].words[j]) !== -1) score++;
            }
            if (score > bestScore) {
                bestScore = score;
                bestFn = topics[i].fn;
            }
        }

        if (bestScore > 0 && bestFn) {
            return bestFn();
        }

        // 26. Natural Conversational Fallback
        return isTr
            ? "Bu soruyu Furkan'ın mevcut portfolyo ve sistem verileriyle doğrudan eşleştiremedim efendim, ancak şu ana başlıklarda derinlemesine bilgi verebilirim:\n\n• **Kariyer Geçmişi:** 'daha önce ne yaptı', 'deneyimi nasıl', CloudSpark & Microsoft stajları\n• **Teknik Kavramlar:** 'cli nedir', 'rag nedir', 'bbr nedir', 'docker nedir'\n• **Projeler:** Tracefold (Microsoft RAG), Roadmind (AI Prompt Studio), AI SAP B1 Platformu\n• **Teknoloji Stack'i:** Python, FastAPI, Docker, Kubernetes, Yerel RAG Mimarileri\n• **Sertifikalar & Eğitim:** Stanford AI, Microsoft AI & ML, YBS Onur Derecesi\n\nHangi konuyu incelemek istersin?"
            : "I couldn't find a direct match for that in Furkan's portfolio data, but I can break down details on:\n\n• **Career Journey:** 'What did he do before', CloudSpark & Microsoft experience\n• **Tech Concepts:** 'What is CLI', 'What is RAG', 'What is BBR', 'What is Docker'\n• **Projects:** Tracefold (Microsoft RAG), Roadmind (AI Prompt Studio), SAP B1 Platform\n• **Tech Stack:** Python, FastAPI, Docker, Kubernetes, Local RAG Pipelines\n• **Certifications & Education:** Stanford AI, Microsoft AI & ML, MIS Honor Degree\n\nWhich area would you like to explore?";
    }

    function handleAiTerminalSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (isExecuting || !input) return;
        var text = input.value.trim();
        if (!text) return;
        input.value = '';

        // Built-in terminal commands
        var cmdLower = text.toLowerCase();
        if (cmdLower === 'clear') {
            if (history) history.innerHTML = '';
            return;
        }
        if (cmdLower === 'exit' || cmdLower === 'quit' || cmdLower === ':q') {
            closeAIChat();
            return;
        }
        if (cmdLower === 'help') {
            renderCommandOutput(text, currentLang === 'tr'
                ? "Mevcut terminal komutları:\n\n• ./tracefold.sh — Tracefold yerel RAG mimarisi\n• ./cloudspark.sh — CloudSpark AI Solutions Engineer deneyimi\n• ./tech-stack.sh — Yetenekler, diller ve altyapı\n• ./certs.sh — 10 profesyonel küresel sertifika\n• ./download-cv.sh — Furkan SARICA CV indirme bağlantıları\n• ./install-pwa.sh — Portfolyoyu cihazına bağımsız uygulama (PWA) olarak yükle\n• ./contact.sh — E-posta ve sosyal profiller\n• clear — Terminal ekranını temizle\n• exit — Terminalden çık\n\nAyrıca istediğin herhangi bir soruyu doğrudan yazabilirsin."
                : "Available terminal scripts:\n\n• ./tracefold.sh — Tracefold local RAG architecture\n• ./cloudspark.sh — CloudSpark AI Solutions Engineer role\n• ./tech-stack.sh — Skills, languages, and infrastructure\n• ./certs.sh — 10 professional global certifications\n• ./download-cv.sh — Direct CV download links\n• ./install-pwa.sh — Install portfolio as standalone desktop/mobile PWA app\n• ./contact.sh — Email and professional profiles\n• clear — Clear terminal screen\n• exit — Exit terminal\n\nYou can also enter any freeform question directly.");
            return;
        }
        if (cmdLower === './download-cv.sh' || cmdLower === './cv.sh' || cmdLower === 'cv') {
            var cvLang = currentLang === 'tr' ? 'tr' : 'en';
            var cvUrl = cvLang === 'tr' ? 'Furkan%20SARICA%20CV%20TR.pdf' : 'Furkan%20SARICA%20CV%20EN.pdf';
            var a = document.createElement('a');
            a.href = cvUrl;
            a.download = cvLang === 'tr' ? 'Furkan SARICA CV TR.pdf' : 'Furkan SARICA CV EN.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            renderCommandOutput(text, currentLang === 'tr'
                ? "✓ Özgeçmiş dosyası indiriliyor: [Furkan SARICA CV TR.pdf](" + cvUrl + ")"
                : "✓ Downloading resume file: [Furkan SARICA CV EN.pdf](" + cvUrl + ")");
            return;
        }
        if (cmdLower === './install-pwa.sh' || cmdLower === './install.sh' || cmdLower === 'install' || cmdLower === 'pwa') {
            if (window._deferredPWAInstallPrompt) {
                renderCommandOutput(text, currentLang === 'tr'
                    ? "✓ PWA yükleyici başlatılıyor..."
                    : "✓ Launching PWA native installer...");
                window._deferredPWAInstallPrompt.prompt();
                window._deferredPWAInstallPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        renderCommandOutput(text, currentLang === 'tr'
                            ? "✓ Portfolyo web uygulaması başarıyla cihazınıza yüklendi."
                            : "✓ Portfolio PWA successfully installed to your device.");
                    } else {
                        renderCommandOutput(text, currentLang === 'tr'
                            ? "ℹ Yükleme isteği kullanıcı tarafından reddedildi."
                            : "ℹ Installation dismissed by user.");
                    }
                    window._deferredPWAInstallPrompt = null;
                });
            } else if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
                renderCommandOutput(text, currentLang === 'tr'
                    ? "✓ Portfolyo zaten bağımsız bir PWA (standalone) uygulaması olarak çalışıyor."
                    : "✓ Portfolio is already running in standalone PWA mode.");
            } else {
                renderCommandOutput(text, currentLang === 'tr'
                    ? "ℹ PWA Kurulum Rehberi:\n\n• **Chrome / Edge (Masaüstü & Android):** Adres çubuğundaki yükle simgesine (⊕) tıklayın veya menüden 'Uygulamayı Yükle'yi seçin.\n• **iOS (Safari):** Paylaş butonuna (⎙/⎋) dokunun ve 'Ana Ekrana Ekle' seçeneğini seçin.\n• **macOS:** Safari'de 'Dosya > Dock'a Ekle' seçeneğiyle yerel Mac uygulaması olarak kullanabilirsiniz."
                    : "ℹ PWA Installation Guide:\n\n• **Chrome / Edge (Desktop & Android):** Click the install icon (⊕) in address bar or choose 'Install App' from menu.\n• **iOS (Safari):** Tap Share button and select 'Add to Home Screen'.\n• **macOS:** In Safari, choose 'File > Add to Dock' to run as a native desktop application.");
            }
            return;
        }

        // Standard Query / Script execution
        var resolvedPrompt = text;
        if (cmdLower === './tracefold.sh') resolvedPrompt = 'Tracefold nedir ve mimarisi nasıl çalışır?';
        else if (cmdLower === './cloudspark.sh') resolvedPrompt = 'CloudSpark\'taki AI Solutions Engineer rolü ve sorumlulukları neler?';
        else if (cmdLower === './tech-stack.sh' || cmdLower === './stack.sh') resolvedPrompt = 'Furkan\'ın teknik yetenekleri ve kullandığı teknolojiler neler?';
        else if (cmdLower === './certs.sh') resolvedPrompt = 'Furkan\'ın sahip olduğu profesyonel sertifikalar nelerdir?';
        else if (cmdLower === './contact.sh') resolvedPrompt = 'Furkan ile nasıl iletişime geçebilirim?';

        // Render log entry
        var entry = document.createElement('div');
        entry.className = 'ai-term-log-entry';
        entry.innerHTML = '<div class="ai-term-user-line"><span class="ai-term-prompt">guest@portfolio:~$</span> <span class="ai-term-user-cmd">' + escapeHtml(text) + '</span></div>' +
            '<div class="ai-term-bot-output">' +
            '<div class="ai-term-sys-tag"><span style="color:var(--terminal-green);">●</span> [vitonom]:</div>' +
            '<div class="ai-term-text"><span class="ai-term-cursor">█</span></div>' +
            '</div>';
        history.appendChild(entry);
        scrollTerminalToBottom();

        var textContainer = entry.querySelector('.ai-term-text');
        isExecuting = true;

        var isTr = currentLang === 'tr';
        var trMarkers = ['nedir', 'neler', 'kimdir', 'nasıl', 'nerede', 'hakkında', 'misin', 'müsait', 'hangi', 'selam', 'merhaba', 'naber', 'günaydın'];
        var textLower = resolvedPrompt.toLowerCase();
        for (var i = 0; i < trMarkers.length; i++) {
            if (textLower.indexOf(trMarkers[i]) !== -1) { isTr = true; break; }
        }

        if (!window._aiChatHistory) window._aiChatHistory = [];
        window._aiChatHistory.push({ role: 'user', content: resolvedPrompt });
        if (window._aiChatHistory.length > 8) {
            window._aiChatHistory = window._aiChatHistory.slice(-8);
        }

        var workerEndpoint = "https://vitonom-ai.sarica-furkan.workers.dev";
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 30000);

        fetch(workerEndpoint, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: window._aiChatHistory })
        })
        .then(async function(res) {
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error("Worker HTTP " + res.status);

            var reader = res.body.getReader();
            var decoder = new TextDecoder();
            var fullAiText = "";
            var sseBuffer = "";

            while (true) {
                var chunk = await reader.read();
                if (chunk.done) break;
                sseBuffer += decoder.decode(chunk.value, { stream: true });
                var lines = sseBuffer.split("\n");
                sseBuffer = lines.pop(); // Retain incomplete line for next chunk
                for (var j = 0; j < lines.length; j++) {
                    var line = lines[j].trim();
                    if (line.indexOf("data: ") === 0) {
                        var dataStr = line.slice(6).trim();
                        if (dataStr === "[DONE]") break;
                        try {
                            var parsed = JSON.parse(dataStr);
                            var token = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
                            if (token) {
                                fullAiText += token;
                                textContainer.innerHTML = parseMarkdown(fullAiText) + '<span class="ai-term-cursor">█</span>';
                                scrollTerminalToBottom();
                            }
                        } catch (e) {}
                    }
                }
            }

            if (!fullAiText) throw new Error("Empty model response");
            textContainer.innerHTML = parseMarkdown(fullAiText);
            window._aiChatHistory.push({ role: 'assistant', content: fullAiText });
            scrollTerminalToBottom();
            isExecuting = false;
            if (input) input.focus();
        })
        .catch(function(err) {
            clearTimeout(timeoutId);
            var isOffline = !navigator.onLine;
            var sysTag = entry.querySelector('.ai-term-sys-tag');
            if (isOffline && sysTag) {
                sysTag.innerHTML = '<span style="color:var(--accent-cyan);">⚡</span> [vitonom@offline-local]:';
            }
            var offlineNotice = isOffline
                ? (isTr ? "*[OFFLINE ENGINE ACTIVE: Ağ bağlantısı yok, yerel hafıza devrede]*\n\n" : "*[OFFLINE ENGINE ACTIVE: Network unreachable, local memory engaged]*\n\n")
                : "";
            var vitonomResponse = offlineNotice + queryVitonomAI(resolvedPrompt, isTr);
            streamTerminalTypewriter(textContainer, vitonomResponse, function() {
                window._aiChatHistory.push({ role: 'assistant', content: vitonomResponse });
                isExecuting = false;
                if (input) input.focus();
            });
        });
    }

    function renderCommandOutput(command, outputText) {
        var entry = document.createElement('div');
        entry.className = 'ai-term-log-entry';
        entry.innerHTML = '<div class="ai-term-user-line"><span class="ai-term-prompt">guest@portfolio:~$</span> <span class="ai-term-user-cmd">' + escapeHtml(command) + '</span></div>' +
            '<div class="ai-term-bot-output">' +
            '<div class="ai-term-sys-tag"><span style="color:var(--terminal-green);">●</span> [system]:</div>' +
            '<div class="ai-term-text">' + parseMarkdown(outputText) + '</div>' +
            '</div>';
        history.appendChild(entry);
        scrollTerminalToBottom();
    }

    function runAiQuick(cmd) {
        if (!input) return;
        input.value = cmd;
        handleAiTerminalSubmit({ preventDefault: function(){} });
    }

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    window.openAIChat = openAIChat;
    window.closeAIChat = closeAIChat;
    window.minimizeAIChat = minimizeAIChat;
    window.toggleMaximizeAIChat = toggleMaximizeAIChat;
    window.handleAiHeaderClick = handleAiHeaderClick;
    window.runAiQuick = runAiQuick;
    window.handleAiTerminalSubmit = handleAiTerminalSubmit;
    window.openCmdPalette = openAIChat;
    window.closeCmdPalette = closeAIChat;

    // Ctrl+K / Cmd+K opens AI Terminal
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (overlay && overlay.classList.contains('active')) closeAIChat();
            else openAIChat();
        }
    });

    // Escape closes AI Terminal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            closeAIChat();
        }
    });

    // Click outside window closes
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeAIChat();
        });
    }

    // Auto-open if URL has #chat or #ai or ?chat=open
    if (window.location.hash === '#chat' || window.location.hash === '#ai' || window.location.search.indexOf('chat=open') !== -1) {
        setTimeout(openAIChat, 350);
    }
}());
