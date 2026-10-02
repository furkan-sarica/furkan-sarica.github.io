<div align="center">

# Furkan SARICA — Enterprise AI & DevOps Portfolio

[![CI/CD Pipeline](https://github.com/furkan-sarica/furkan-sarica.github.io/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/furkan-sarica/furkan-sarica.github.io/actions/workflows/ci-cd.yml)
[![Pages Status](https://img.shields.io/badge/GitHub%20Pages-Production%20Live-00ff88?style=flat&logo=github)](https://furkan-sarica.github.io)
[![PWA](https://img.shields.io/badge/PWA-Manifest%20%26%20Service%20Worker-00d4ff?style=flat&logo=pwa)](https://furkan-sarica.github.io)
[![Edge AI](https://img.shields.io/badge/Cloudflare%20Edge-Worker%20Proxy-f38020?style=flat&logo=cloudflare)](https://vitonom-ai.sarica-furkan.workers.dev)
[![AI Engine](https://img.shields.io/badge/NVIDIA%20NIM-DiffusionGemma%2026B-76b900?style=flat&logo=nvidia)](https://integrate.api.nvidia.com)
[![DevSecOps](https://img.shields.io/badge/Security-Gitleaks%20Verified-blueviolet?style=flat&logo=githubactions)](https://github.com/furkan-sarica/furkan-sarica.github.io)

**Vanilla HTML/CSS/JS portfolio ve interaktif AI terminali (`Vitonom v2.5`); Playwright yalnız geliştirme/test bağımlılığıdır.**
*Built for real enterprise impact, deterministic systems, and physicalist engineering principles.*

[🌐 Live Deployment](https://furkan-sarica.github.io) • [💬 Launch AI Terminal](https://furkan-sarica.github.io/?chat=open) • [📄 Download CV](https://furkan-sarica.github.io/Furkan%20SARICA%20CV%20TR.pdf)

</div>

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser & Native PWA)"]
        UI["Cyber Terminal UI / Web Portfolio<br/>(furkan-sarica.github.io)"]
        SW["Service Worker v22<br/>(Cache-First Assets / Network-First HTML)"]
        CLI["Vitonom AI Terminal Shell<br/>(Keyboard-first, Traffic Lights, Suggestions)"]
    end

    subgraph Edge ["Cloudflare Edge Security Layer"]
        CF["Cloudflare Worker<br/>(vitonom-ai.sarica-furkan.workers.dev)"]
        Guard["Security & Origin Gate<br/>(Origin check, Token rate limit, 500-char clamp)"]
    end

    subgraph AI ["AI Inference Layer"]
        NIM["NVIDIA NIM Inference Gateway<br/>(google/diffusiongemma-26b-a4b-it)"]
    end

    subgraph LocalFallback ["Offline Fallback Engine"]
        LMem["Local Vitonom Knowledge Engine<br/>(Zero-network instant response)"]
    end

    UI --> SW
    UI --> CLI
    CLI -- "POST / (Streaming SSE)" --> Guard
    Guard --> CF
    CF -- "Inference Request" --> NIM
    NIM -- "Server-Sent Events (SSE)" --> CF
    CF -- "Stream Tokens (Accumulated Buffer)" --> CLI
    CLI -. "Network Offline" .-> LMem
```

---

## ⚡ Key Highlights

### 1. Vitonom AI Terminal Shell (v2.5)
- **High-Intelligence Multilingual LLM:** Backed by Google's 26B instruction model (`google/diffusiongemma-26b-a4b-it`) hosted on NVIDIA NIM.
- **Server-Sent Events (SSE) Streaming:** Low-latency token streaming with an accumulating UTF-8 chunk buffer to eliminate multi-byte UTF-8 token drops.
- **Zero-Credential Security Architecture:** Frontend never holds API tokens. Requests are proxied via a hardened Cloudflare Edge Worker with strict Origin validation (`furkan-sarica.github.io` only).
- **macOS Window Management:** Interactive window controls — **Red** (close), **Yellow** (minimize to floating dock widget without losing conversation state), and **Green** (maximized 96vw fullscreen IDE mode).

### 2. Progressive Web Application (PWA)
- **Manifest:** `manifest.json` dört uygulama kısayolu içerir. CI, JSON syntax ve referans verilen varlıkları doğrular; tam W3C uyumluluk sertifikasyonu yapmaz.
- **Terminal Native Installer:** Run `./install-pwa.sh` or `install` directly in the shell to trigger the browser's native installation prompt.
- **Önbellek:** `sw.js` cache sürümü `furkan-portfolio-v22`'dir. Yerel statik varlıklar cache-first; HTML/JS network-first + cache fallback kullanır. 24 classic script precache edilir. Mevcut font/icon kaynakları runtime cache'e alınır. Ayrı Chromium PWA testi gerçek worker activation, v21 cache temizliği, online reload ve warmed-cache offline HTML/CSS/JS + yerel AI fallback'i doğrular. Cold-offline ilk kurulum iddiası yoktur.

### 3. Production DevOps & DevSecOps
- **CI/CD:** Mevcut required check `Code Quality & DevSecOps Verification`; bütünlük, Gitleaks, XML, JavaScript syntax, masaüstü/mobil Chromium, saf SSE/transport ve PWA offline regression testlerini kapsar. WebKit ayrı `WebKit browser uyumluluğu` job'unda çalışır; terminal maximize kontrolü Linux CI tekrarlarında kararsız olduğundan required değildir ve production deploy'u bloklamaz. Başarılı main gate'inden sonra özel workflow GitHub Pages'e deploy eder, ardından canlı smoke çalışır. Canlı smoke başarısızsa workflow fail olur; otomatik rollback yoktur.
- **Syntax gate:** `scripts/verify-javascript.py`, HTMLParser ile inline scriptleri ayıklar; klasik scriptleri Node `vm.Script`, module scriptleri Node syntax check ile doğrular. JSON veri scriptleri çalıştırılabilir JavaScript sayılmaz.
- **Browser smoke:** 1440×900 ve 390×844 viewport'larında HTTP, boot kapanışı, hero, pageerror/console error, TR/EN, ses, ai.sh aç/kapat ve back-to-top doğrulanır. Dış GitHub API/font çağrıları fixture ile karşılanır; AI inference isteği gönderilmez. Normal smoke context’inde service worker engellenir; ayrı PWA project’inde etkinleştirilir. Refactor regression kontrolleri 320–1440 px reflow, modal focus, keyboard navigation, terminal history/vim/matrix/Fail2Ban ve reduced-motion içerir. WebKit aynı UI sözleşmesini 390×844 üzerinde kontrol eder; gerçek iOS cihaz testi değildir.
- **Bütünlük ve sır kontrolü:** `scripts/verify-integrity.py` JSON parse, manifest varlıkları ve service worker cache hedeflerini kontrol eder; disk/include/precache JS kümelerinin eşleşmesini ve duplicate include olmadığını doğrular. Gitleaks bilinen secret kalıplarını tarar; hiçbir tarama sıfır risk garantisi vermez.
- **Yayın ayarı:** Pages source GitHub Actions’tır. `.github/workflows/ci-cd.yml` quality → deploy → production smoke zincirini korur. Bu bakım repository settings/ruleset/Pages source ayarlarını değiştirmez. Runner `ubuntu-24.04` olarak sabittir; production smoke yalnız mevcut Chromium desktop/mobile 2/2 sözleşmesidir.

### JavaScript sorumlulukları ve lifecycle

Script include sırası `index.html` içinde deterministiktir. `ui → language → hero-navigation/contact-effects → boot → terminal factories/bootstrap → AI factories/bootstrap → keyboard/content/PWA/CRT/certificates/easter-eggs` akışı korunur. Terminal core IO/history ve paylaşılan VFS/vim/Fail2Ban state’ini private closure içinde tutar; 54 komut kolu özgün dispatch önceliğiyle kayıt edilir. `PortfolioTerminal` ve `PortfolioAI` yalnız kurulum API’leridir; state dışarı taşınmaz. AI transport DOM’dan bağımsızdır, `[DONE]` reader’ı sonlandırır ve timeout stream boyunca geçerlidir.

Mevcut inline handler `window.*` API’leri korunur. Yeni DOMContentLoaded lifecycle oluşturulmaz. `preferredLang` mevcut tek localStorage key’idir; ses yükleme sırasında kapalı başlar. Normal ziyaret sırasında IDS mouse/click/scroll tracking ve background log overlay yoktur; terminal komutlarından tetiklenen Fail2Ban/kernel panic simülasyonu korunur.

---

## 🛠️ Local Development & DX

This project includes a developer-ergonomic `Makefile` for zero-friction local workflows:

```bash
# Clone the repository
git clone https://github.com/furkan-sarica/furkan-sarica.github.io.git
cd furkan-sarica.github.io

# View available commands
make help

# Run local development server (http://localhost:8080)
make serve

# Test bağımlılıklarını, Chromium ve WebKit’i kur
npm ci --ignore-scripts
npx --no-install playwright install chromium webkit

# Bütünlük, syntax, unit, Chromium, WebKit ve PWA regression testlerini çalıştır
make test

# Aynı browser smoke'u canlı site üzerinde çalıştır
SMOKE_ADRESI=https://furkan-sarica.github.io/ npm run test:production
```

---

## 📂 Repository Layout

```text
├── .github/
│   ├── workflows/ci-cd.yml      # GitHub Actions CI/CD & Deploy Pipeline
│   ├── dependabot.yml           # Automated GitHub Actions updates
│   └── PULL_REQUEST_TEMPLATE.md # Engineering PR template
├── scripts/
│   ├── verify-integrity.py      # PWA bütünlük ve secret kontrolü
│   ├── serve-tests.py           # Eşzamanlı asset smoke sunucusu
│   └── verify-javascript.py     # HTML/JavaScript syntax gate
├── js/                         # 24 sıralı classic defer script (bundler yok)
│   ├── ui.js                    # Dialog focus/lifecycle ve motion tercihi
│   ├── terminal/               # Core, system/files commands, easter-eggs,
│   │                           # security-sim, runtime, effects
│   ├── terminal.js             # Deterministik terminal bootstrap
│   ├── ai/                     # UI, render, local fallback, transport
│   ├── ai-shell.js             # Private input/history ve command orchestration
│   └── ...                     # Language, boot, navigation, certificates, PWA
├── tests/
│   ├── smoke.spec.cjs           # Desktop/mobile ve WebKit UI sözleşmesi
│   ├── hardening.spec.cjs       # Responsive/a11y/terminal/motion regression
│   ├── pwa.spec.cjs             # Gerçek SW warmed-cache offline reload
│   └── unit/                   # Saf SSE/transport: mock stream, inference yok
├── playwright.config.cjs       # Yerel/canlı test yapılandırması
├── LICENSE                     # MIT
├── SECURITY.md                 # Güvenlik bildirimi politikası
├── index.html                   # Core semantic markup & Cyber Terminal
├── style.css                    # Responsive dark cyber aesthetic & CRT engine
├── sw.js                        # PWA Service Worker (v22)
├── manifest.json                # PWA Manifest with app shortcuts
├── api.json                     # Grounded structured data & bio
├── Makefile                     # Developer task runner
└── package.json                 # Repository metadata & scripts
```

---

## 👨‍💻 Engineer Profile

**Furkan SARICA**  
*AI Solutions Engineer @ CloudSpark Cloud Data & AI Technologies*  
- **Focus:** Enterprise AI Agents, RAG Pipelines, Backend Architectures (Python / FastAPI), DevOps & Infrastructure.
- **Background:** Microsoft AI Innovators (Tracefold Project), Logosoft (SAP Business One AI Platform), Istanbul Gelisim University (MIS Honor Degree).
- **Certifications:** Stanford AI, Microsoft AI & ML, Vanderbilt GenAI, NVIDIA Developer, AWS Solutions Architect, IBM DevOps.

📫 **Contact:** [LinkedIn](https://linkedin.com/in/furkan-sarica) • [Interactive Terminal Shell](https://furkan-sarica.github.io/?chat=open) • [GitHub](https://github.com/furkan-sarica)
