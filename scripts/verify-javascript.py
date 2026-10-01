#!/usr/bin/env python3
"""HTML içindeki çalıştırılabilir scriptleri ve repo JavaScript'ini parse eder."""

from html.parser import HTMLParser
from pathlib import Path
import subprocess
import sys

KOK = Path(__file__).resolve().parent.parent
BETIK_TURLERI = {"", "text/javascript", "application/javascript", "text/ecmascript", "application/ecmascript", "module"}


class BetikAyiklayici(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.betikler = []
        self.acik_betik = None

    def handle_starttag(self, etiket, ozellikler):
        if etiket != "script":
            return
        ozellikler = dict(ozellikler)
        tur = (ozellikler.get("type") or "").strip().lower()
        if "src" not in ozellikler and tur in BETIK_TURLERI:
            self.acik_betik = [tur, self.getpos()[0], ""]

    def handle_data(self, veri):
        if self.acik_betik is not None:
            self.acik_betik[2] += veri

    def handle_endtag(self, etiket):
        if etiket == "script" and self.acik_betik is not None:
            self.betikler.append(self.acik_betik)
            self.acik_betik = None


def syntax_dogrula(kaynak, etiket, modul=False):
    # vm.Script klasik browser script grammar'ını parse eder; kodu çalıştırmaz.
    if modul:
        komut = ["node", "--check", "--input-type=module"]
    else:
        komut = ["node", "-e", "new (require('node:vm').Script)(require('node:fs').readFileSync(0, 'utf8'), {filename: process.argv[1]})", etiket]
    sonuc = subprocess.run(komut, input=kaynak, text=True, capture_output=True)
    if sonuc.returncode:
        print(f"[FAIL] {etiket}\n{sonuc.stderr}", file=sys.stderr)
        return False
    return True


def main():
    if len(sys.argv) > 1:
        dosyalar = [Path(ad).resolve() for ad in sys.argv[1:]]
    else:
        sonuc = subprocess.run(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "*.html", "*.js", "*.cjs", "*.mjs"],
            cwd=KOK, check=True, capture_output=True, text=True,
        )
        dosyalar = [KOK / ad for ad in sorted(set(sonuc.stdout.split("\0"))) if ad]
    basarili = True
    betik_sayisi = 0
    for dosya in dosyalar:
        kaynak = dosya.read_text(encoding="utf-8")
        if dosya.suffix == ".html":
            ayiklayici = BetikAyiklayici()
            ayiklayici.feed(kaynak)
            ayiklayici.close()
            if ayiklayici.acik_betik is not None:
                print(f"[FAIL] {dosya}: kapanmayan script etiketi", file=sys.stderr)
                basarili = False
            for tur, satir, betik in ayiklayici.betikler:
                betik_sayisi += 1
                basarili = syntax_dogrula("\n" * (satir - 1) + betik, f"{dosya}:{satir}", tur == "module") and basarili
        else:
            betik_sayisi += 1
            basarili = syntax_dogrula(kaynak, str(dosya), dosya.suffix == ".mjs") and basarili
    if not betik_sayisi:
        print("[FAIL] Doğrulanacak JavaScript bulunamadı", file=sys.stderr)
        return 1
    if basarili:
        print(f"[PASS] {betik_sayisi} JavaScript script'i syntax kontrolünden geçti.")
    return 0 if basarili else 1


if __name__ == "__main__":
    sys.exit(main())
