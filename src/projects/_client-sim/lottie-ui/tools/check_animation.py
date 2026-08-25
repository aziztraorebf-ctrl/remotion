#!/usr/bin/env python3
"""
Verifie qu'un Lottie BOUGE vraiment, et rend une planche de frames.

⛔ POURQUOI : un .json anime peut etre parfaitement valide, se charger sans
erreur, et rester FIGE (keyframes mal placees, trimPath sur un groupe sans
contour, calque hors de sa plage ip/op). Le fichier ne proteste pas.
Meme famille que les 2 bugs deja payes cette session -- on ne conclut pas sur
la structure du JSON, on REGARDE et on MESURE.

Methode : lottie-web rend N frames dans Chromium ; on hache chaque image.
  - toutes identiques      -> l'animation est MORTE
  - toutes differentes     -> ca bouge
On mesure aussi le taux de pixels encres par frame : une frame vide au debut
est normale (rien n'est encore apparu), une frame vide a la FIN ne l'est pas.

Usage :
    python3 check_animation.py anime.json [--frames 0,30,60,...] [-o planche.png]
"""

import argparse
import hashlib
import json
import os
import pathlib
import sys


def _trouver_lottie_js():
    ici = pathlib.Path(__file__).resolve()
    for parent in ici.parents:
        c = parent / "node_modules" / "lottie-web" / "build" / "player" / "lottie.min.js"
        if c.exists():
            return c
    return None


PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
 html,body{margin:0;padding:0;background:#fff}
 #box{width:%(w)dpx;height:%(h)dpx;background:#fff}
</style><script>%(js)s</script></head><body><div id="box"></div><script>
 window.pret=false; window.anim=null;
 const a=lottie.loadAnimation({container:document.getElementById('box'),
   renderer:'svg',loop:false,autoplay:false,animationData:%(data)s});
 a.addEventListener('DOMLoaded',()=>{window.anim=a;window.pret=true;});
</script></body></html>"""


def rendre_frames(doc, frames, dossier):
    from playwright.sync_api import sync_playwright
    js = _trouver_lottie_js()
    if not js:
        raise RuntimeError("lottie-web introuvable")
    w, h = int(doc["w"]), int(doc["h"])
    page = PAGE % {"w": w, "h": h, "js": js.read_text(), "data": json.dumps(doc)}
    sorties, erreurs = [], []
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        pg.set_content(page, wait_until="load")
        pg.wait_for_function("window.pret === true", timeout=20000)
        for f in frames:
            pg.evaluate(f"window.anim.goToAndStop({f}, true)")
            pg.wait_for_timeout(120)
            chemin = os.path.join(dossier, f"f{f:04d}.png")
            pg.locator("#box").screenshot(path=chemin)
            sorties.append((f, chemin))
        nav.close()
    return sorties, erreurs


def analyser(sorties):
    from PIL import Image
    lignes = []
    for f, chemin in sorties:
        im = Image.open(chemin).convert("RGB")
        px = list(im.get_flattened_data()) if hasattr(im, "get_flattened_data") else list(im.getdata())
        encre = sum(1 for p in px if sum(p) < 720)      # pas blanc pur
        h = hashlib.md5(im.tobytes()).hexdigest()[:10]
        lignes.append({"frame": f, "hash": h, "encre": 100.0 * encre / len(px)})
    return lignes


def planche(sorties, sortie, colonnes=4):
    from PIL import Image, ImageDraw
    ims = [(f, Image.open(c).convert("RGB")) for f, c in sorties]
    if not ims:
        return
    w, h = ims[0][1].size
    ech = min(1.0, 480 / w)
    w, h = int(w * ech), int(h * ech)
    lignes = (len(ims) + colonnes - 1) // colonnes
    board = Image.new("RGB", (w * colonnes + 8 * (colonnes - 1),
                              (h + 18) * lignes), "white")
    d = ImageDraw.Draw(board)
    for i, (f, im) in enumerate(ims):
        x = (i % colonnes) * (w + 8)
        y = (i // colonnes) * (h + 18)
        board.paste(im.resize((w, h)), (x, y + 18))
        d.text((x + 3, y + 4), f"frame {f}", fill="black")
    board.save(sortie)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("--frames", help="liste ; sinon 8 frames reparties sur la duree")
    ap.add_argument("-o", "--out", default="planche-animation.png")
    a = ap.parse_args()

    doc = json.loads(open(a.json, encoding="utf-8").read())
    duree = int(doc.get("op", 60))
    if a.frames:
        frames = [int(x) for x in a.frames.split(",")]
    else:
        frames = [int(duree * i / 7) for i in range(8)]
        frames[-1] = max(0, duree - 1)

    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        sorties, erreurs = rendre_frames(doc, frames, tmp)
        lignes = analyser(sorties)
        planche(sorties, a.out)

    for e in erreurs[:3]:
        print(f"  [erreur js] {e}")

    print(f"{os.path.basename(a.json)} — {duree} frames @ {doc.get('fr')}fps")
    print(f"  {'frame':>6} {'empreinte':>12} {'pixels encres':>15}")
    for l in lignes:
        print(f"  {l['frame']:>6} {l['hash']:>12} {l['encre']:>14.1f} %")

    uniques = len({l["hash"] for l in lignes})
    print()
    if uniques == 1:
        print("  ⛔ ANIMATION MORTE : toutes les frames sont identiques.")
        return 1
    print(f"  ✓ {uniques}/{len(lignes)} frames distinctes — ca bouge.")
    if lignes[-1]["encre"] < 0.5:
        print("  ⚠️ la DERNIERE frame est quasi vide : verifier les plages ip/op.")
        return 1
    print(f"  planche : {a.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
