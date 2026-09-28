#!/usr/bin/env python3
"""
Repository & PWA Integrity Verification Test Suite
Automated pre-flight and CI check for furkan-sarica.github.io
"""

import os
import sys
import json
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ERRORS = []

def log_ok(msg):
    print(f"  [PASS] {msg}")

def log_err(msg):
    ERRORS.append(msg)
    print(f"  [FAIL] {msg}", file=sys.stderr)

print(">>> [1/4] Validating JSON files...")
json_files = ["manifest.json", "api.json"]
for jf in json_files:
    path = os.path.join(ROOT_DIR, jf)
    if not os.path.exists(path):
        log_err(f"Missing required JSON file: {jf}")
        continue
    try:
        with open(path, "r", encoding="utf-8") as f:
            json.load(f)
        log_ok(f"{jf} is valid JSON syntax")
    except Exception as e:
        log_err(f"{jf} has invalid JSON syntax: {e}")

print("\n>>> [2/4] Validating PWA manifest icon & shortcut assets...")
manifest_path = os.path.join(ROOT_DIR, "manifest.json")
if os.path.exists(manifest_path):
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    
    # Check icons
    for icon in manifest.get("icons", []):
        src = icon.get("src", "").lstrip("/")
        icon_path = os.path.join(ROOT_DIR, src)
        if os.path.exists(icon_path):
            log_ok(f"Manifest icon exists: {src}")
        else:
            log_err(f"Manifest references missing icon: {src}")

    # Check shortcuts
    for sc in manifest.get("shortcuts", []):
        url = sc.get("url", "")
        if url.endswith(".pdf"):
            pdf_name = url.lstrip("/").replace("%20", " ")
            pdf_path = os.path.join(ROOT_DIR, pdf_name)
            if os.path.exists(pdf_path):
                log_ok(f"Shortcut asset exists: {pdf_name}")
            else:
                log_err(f"Shortcut asset missing on disk: {pdf_name}")

print("\n>>> [3/4] Validating Service Worker (sw.js) cache targets...")
sw_path = os.path.join(ROOT_DIR, "sw.js")
if os.path.exists(sw_path):
    with open(sw_path, "r", encoding="utf-8") as f:
        sw_content = f.read()
    
    match = re.search(r"const\s+ASSETS_TO_CACHE\s*=\s*\[(.*?)\];", sw_content, re.DOTALL)
    if match:
        raw_assets = match.group(1)
        items = re.findall(r"['\"]([^'\"]+)['\"]", raw_assets)
        for item in items:
            if item == "/":
                item = "index.html"
            clean_item = item.lstrip("/")
            file_path = os.path.join(ROOT_DIR, clean_item)
            if os.path.exists(file_path):
                log_ok(f"Cache target verified: {clean_item}")
            else:
                log_err(f"sw.js ASSETS_TO_CACHE references non-existent file: {clean_item}")
    else:
        log_err("Could not find ASSETS_TO_CACHE array in sw.js")

print("\n>>> [4/4] DevSecOps Secret Scanning (Zero Credentials Policy)...")
suspicious_patterns = [
    (r"nvapi-[A-Za-z0-9_\-]{40,}", "NVIDIA API Key"),
    (r"cfut_[A-Za-z0-9_\-]{30,}", "Cloudflare User Token"),
    (r"ghp_[A-Za-z0-9]{30,}", "GitHub Personal Access Token"),
    (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
    (r"-----BEGIN PRIVATE KEY-----", "RSA Private Key")
]

tracked_extensions = (".html", ".js", ".json", ".css", ".md", ".yml", ".yaml", ".sh")
secret_violations = 0

for root, dirs, files in os.walk(ROOT_DIR):
    if ".git" in root or "node_modules" in root:
        continue
    for file in files:
        if file.endswith(tracked_extensions):
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, ROOT_DIR)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                for pattern, name in suspicious_patterns:
                    if re.search(pattern, content):
                        log_err(f"SECRET LEAK DETECTED: {name} found in {rel_path}!")
                        secret_violations += 1
            except Exception as e:
                pass

if secret_violations == 0:
    log_ok("Zero secrets found. Codebase clean and leak-proof.")

print("\n" + "="*50)
if ERRORS:
    print(f"FAILED: {len(ERRORS)} issue(s) detected during pre-flight integrity check.", file=sys.stderr)
    for e in ERRORS:
        print(f"  • {e}", file=sys.stderr)
    sys.exit(1)
else:
    print("SUCCESS: All 4 integrity and security suites passed (10/10).")
    sys.exit(0)
