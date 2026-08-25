#!/usr/bin/env python3
"""
Rend un SVG et son Lottie converti, cote a cote, et MESURE l'ecart.

⛔ POURQUOI CET OUTIL EXISTE : un .json Lottie peut etre parfaitement valide,
se charger sans erreur, et n'afficher RIEN (ou du noir, ou des formes
decalees). La session precedente a perdu deux bugs de cette famille -- une
rotation posee a cote des formes au lieu de les envelopper -- invisibles a la
lecture du code, evidents a l'oeil. On ne conclut donc jamais sur le rapport
du convertisseur seul : on REGARDE, et on chiffre.

Methode : lottie-web (le moteur de reference, deja dans node_modules) rend le
JSON dans Chromium ; le meme Chromium rend le SVG d'origine a la meme taille.
On compare les deux images pixel par pixel.

Sortie : un PNG de comparaison (SVG | Lottie | carte des differences) et un
pourcentage de pixels divergents.

Usage :
    python3 compare_render.py <source.svg> <converti.json> [-o comparaison.png]
"""

import argparse
import base64
import json
import os
import pathlib
import sys

def _trouver_lottie_js():
    """Remonte jusqu'au node_modules du projet (ne pas compter les niveaux :
    le 1er jet utilisait parents[4] et tombait dans src/)."""
    ici = pathlib.Path(__file__).resolve()
    for parent in ici.parents:
        cible = parent / "node_modules" / "lottie-web" / "build" / "player" / "lottie.min.js"
        if cible.exists():
            return cible
    return ici.parent / "lottie.min.js"      # inexistant -> message d'erreur clair


LOTTIE_JS = _trouver_lottie_js()

PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#fff}
  #box{width:%(w)dpx;height:%(h)dpx;background:#fff}
  svg{display:block;width:%(w)dpx;height:%(h)dpx}
</style><script>%(js)s</script></head>
<body><div id="box"></div><script>
  window.pret = false;
  const data = %(data)s;
  const anim = lottie.loadAnimation({
    container: document.getElementById('box'),
    renderer: 'svg', loop: false, autoplay: false, animationData: data,
  });
  anim.addEventListener('DOMLoaded', () => { anim.goToAndStop(%(frame)d, true);
    requestAnimationFrame(() => { window.pret = true; }); });
</script></body></html>"""

PAGE_SVG = """<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#fff}
  #box{width:%(w)dpx;height:%(h)dpx;background:#fff}
  #box svg{display:block;width:%(w)dpx;height:%(h)dpx}
</style></head><body><div id="box">%(svg)s</div>
<script>window.pret = true;</script></body></html>"""


def rendre(page_html, w, h, sortie):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page(viewport={"width": w, "height": h},
                          device_scale_factor=1)
        erreurs = []
        pg.on("console", lambda m: erreurs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        pg.set_content(page_html, wait_until="load")
        pg.wait_for_function("window.pret === true", timeout=15000)
        pg.locator("#box").screenshot(path=sortie)
        nav.close()
        return erreurs


def comparer(a, b, sortie_png, seuil=16):
    """Compare deux PNG. Retourne (%% pixels differents, ecart moyen)."""
    from PIL import Image, ImageChops
    ia = Image.open(a).convert("RGB")
    ib = Image.open(b).convert("RGB")
    if ia.size != ib.size:
        ib = ib.resize(ia.size)
    diff = ImageChops.difference(ia, ib).convert("L")
    px = list(diff.getdata())
    n_diff = sum(1 for v in px if v > seuil)
    pct = 100.0 * n_diff / len(px)
    moyen = sum(px) / len(px)

    # Planche : SVG | Lottie | differences (en rouge sur fond clair)
    w, h = ia.size
    planche = Image.new("RGB", (w * 3 + 20, h), "white")
    planche.paste(ia, (0, 0))
    planche.paste(ib, (w + 10, 0))
    rouge = Image.new("RGB", (w, h), "white")
    rp = rouge.load()
    dp = diff.load()
    for y in range(h):
        for x in range(w):
            if dp[x, y] > seuil:
                rp[x, y] = (220, 0, 0)
    planche.paste(rouge, (w * 2 + 20, 0))
    planche.save(sortie_png)
    return pct, moyen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("svg")
    ap.add_argument("json")
    ap.add_argument("-o", "--out", default="comparaison.png")
    ap.add_argument("--frame", type=int, default=0)
    a = ap.parse_args()

    if not LOTTIE_JS.exists():
        print(f"ECHEC : lottie-web introuvable ({LOTTIE_JS})", file=sys.stderr)
        return 2

    doc = json.loads(pathlib.Path(a.json).read_text())
    w, h = int(doc["w"]), int(doc["h"])
    js = LOTTIE_JS.read_text()

    base = os.path.splitext(a.out)[0]
    png_svg, png_lot = base + "-svg.png", base + "-lottie.png"

    err_svg = rendre(PAGE_SVG % {"w": w, "h": h,
                                 "svg": pathlib.Path(a.svg).read_text()}, w, h, png_svg)
    err_lot = rendre(PAGE % {"w": w, "h": h, "js": js,
                             "data": json.dumps(doc), "frame": a.frame}, w, h, png_lot)

    for nom, errs in (("SVG", err_svg), ("Lottie", err_lot)):
        for e in errs[:5]:
            print(f"  [console {nom}] {e}")

    pct, moyen = comparer(png_svg, png_lot, a.out)
    print(f"{os.path.basename(a.svg)}")
    print(f"  taille        : {w}x{h}")
    print(f"  pixels divergents : {pct:.2f} %   (ecart moyen {moyen:.1f}/255)")
    print(f"  planche       : {a.out}   [SVG | Lottie | differences]")

    # Un rendu VIDE est le piege classique : tout blanc = 0 % de diff avec un
    # SVG lui aussi blanc. On verifie donc que le Lottie a bien dessine.
    from PIL import Image
    encre = sum(1 for v in Image.open(png_lot).convert("L").getdata() if v < 250)
    total = w * h
    print(f"  pixels encres (Lottie) : {100.0*encre/total:.1f} %"
          f"{'   ⛔ RENDU VIDE' if encre < total * 0.001 else ''}")
    return 0 if pct < 2.0 and encre > total * 0.001 else 1


if __name__ == "__main__":
    sys.exit(main())
