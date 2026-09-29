<div align="center">

# Furkan SARICA — Enterprise AI & DevOps Portfolio

[![CI/CD Pipeline](https://github.com/furkan-sarica/furkan-sarica.github.io/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/furkan-sarica/furkan-sarica.github.io/actions/workflows/ci-cd.yml)
[![Pages Status](https://img.shields.io/badge/GitHub%20Pages-Production%20Live-00ff88?style=flat&logo=github)](https://furkan-sarica.github.io)
[![PWA Standard](https://img.shields.io/badge/PWA-10%2F10%20Compliant-00d4ff?style=flat&logo=pwa)](https://furkan-sarica.github.io)
[![Edge AI](https://img.shields.io/badge/Cloudflare%20Edge-Worker%20Proxy-f38020?style=flat&logo=cloudflare)](https://vitonom-ai.sarica-furkan.workers.dev)
[![AI Engine](https://img.shields.io/badge/NVIDIA%20NIM-DiffusionGemma%2026B-76b900?style=flat&logo=nvidia)](https://integrate.api.nvidia.com)
[![DevSecOps](https://img.shields.io/badge/Security-Gitleaks%20Verified-blueviolet?style=flat&logo=githubactions)](https://github.com/furkan-sarica/furkan-sarica.github.io)

**Production-grade, zero-dependency cyber portfolio and interactive AI terminal shell (`Vitonom v2.5`).**  
*Built for real enterprise impact, deterministic systems, and physicalist engineering principles.*

[🌐 Live Deployment](https://furkan-sarica.github.io) • [💬 Launch AI Terminal](https://furkan-sarica.github.io/?chat=open) • [📄 Download CV](https://furkan-sarica.github.io/Furkan%20SARICA%20CV%20TR.pdf)

</div>

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser & Native PWA)"]
        UI["Cyber Terminal UI / Web Portfolio<br/>(furkan-sarica.github.io)"]
        SW["Service Worker v19<br/>(Cache-First Assets / Offline Engine)"]
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
- **Server-Sent Events (SSE) Streaming:** Low-latency token streaming with an accumulating chunk buffer (`sseBuffer`) to eliminate multi-byte UTF-8 token drops.
- **Zero-Credential Security Architecture:** Frontend never holds API tokens. Requests are proxied via a hardened Cloudflare Edge Worker with strict Origin validation (`furkan-sarica.github.io` only).
- **macOS Window Management:** Interactive window controls — **Red** (close), **Yellow** (minimize to floating dock widget without losing conversation state), and **Green** (maximized 96vw fullscreen IDE mode).

### 2. 10/10 Progressive Web Application (PWA)
- **W3C Schema Compliant:** Full `manifest.json` featuring 4 native app shortcuts (*Vitonom AI Shell*, *Tracefold*, *CV Download*, *CloudSpark Experience*).
- **Terminal Native Installer:** Run `./install-pwa.sh` or `install` directly in the shell to trigger the browser's native installation prompt.
- **Resilient Offline Mode:** Service Worker (`sw.js` v19) caches all static assets, documents, and portraits. If offline, the terminal automatically falls back to the embedded local knowledge engine with an `[OFFLINE ENGINE ACTIVE]` indicator.

### 3. Production DevOps & DevSecOps
- **Automated CI/CD:** Real zero-downtime deployments via GitHub Actions (`.github/workflows/ci-cd.yml`) using `actions/deploy-pages`.
- **Automated Pre-Flight Integrity Test:** Custom test suite (`scripts/verify-integrity.py`) validates JSON schemas, manifest icons, and Service Worker cache list against physical files.
- **Secret Leak Prevention:** Continuous Gitleaks scanning ensures zero plaintext API keys or tokens are ever committed.

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

# Run automated integrity and secret scanning suite
make test
```

---

## 📂 Repository Layout

```text
├── .github/
│   ├── workflows/ci-cd.yml      # GitHub Actions CI/CD & Deploy Pipeline
│   ├── dependabot.yml           # Automated GitHub Actions updates
│   └── PULL_REQUEST_TEMPLATE.md # Engineering PR template
├── scripts/
│   └── verify-integrity.py      # Automated PWA & DevSecOps test suite
├── index.html                   # Core semantic markup & Cyber Terminal
├── style.css                    # Responsive dark cyber aesthetic & CRT engine
├── sw.js                        # PWA Service Worker (v20)
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
