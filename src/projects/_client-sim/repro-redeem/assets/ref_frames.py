#!/usr/bin/env python3
"""Regenere les frames de reference de la piece « Redeem All » dans `../ref/`.

Ces frames sont la VERITE TERRAIN contre laquelle on mesure notre reproduction
(echelle, densite d'encre, geometrie). Elles sont hors git (cf. `.gitignore`) :
1,5 Mo de PNG regenerables en une commande depuis le .lottie d'origine.

Source : `out/_r-and-d/corpus-kamotion/22_Tx4vZDPzej0dHX7jFHDZM4xg.lottie`
(kamotionstudio.site, releve le 2026-08-28 — cf. `memory/client-sim-tests/
corpus-kamotion/CORPUS-REFERENCE-UI.md`).

⛔ Le rendu passe par lottie-web dans Chromium, PAS par une lecture du JSON :
un Lottie valide peut s'afficher vide. On regarde ce que le moteur affiche.

Usage :
    python3 ref_frames.py            # 1 frame toutes les 10, + la derniere
"""

import asyncio
import io
import json
import os
import zipfile

from PIL import Image
from playwright.async_api import async_playwright

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.abspath(os.path.join(ICI, "..", "..", "..", "..", ".."))
LOTTIE_JS = os.path.join(
    RACINE, "node_modules", "lottie-web", "build", "player", "lottie.min.js"
)
SOURCE = os.path.join(
    RACINE, "out", "_r-and-d", "corpus-kamotion",
    "22_Tx4vZDPzej0dHX7jFHDZM4xg.lottie",
)
SORTIE = os.path.join(ICI, "..", "ref")
PAS = 10

HTML = """<!doctype html><meta charset=utf-8><script>%s</script>
<style>html,body{margin:0;background:#fff}#c{width:%dpx;height:%dpx}</style>
<div id=c></div><script>
window.anim = lottie.loadAnimation({container:document.getElementById('c'),
  renderer:'svg', loop:false, autoplay:false, animationData:%s});
window.ready = false;
window.anim.addEventListener('DOMLoaded', () => { window.ready = true; });
</script>"""


def charger():
    with zipfile.ZipFile(SOURCE) as z:
        noms = [n for n in z.namelist() if n.endswith(".json") and n != "manifest.json"]
        return json.loads(z.read(noms[0]))


async def main():
    if not os.path.exists(SOURCE):
        raise SystemExit(f"source absente : {SOURCE}")
    anim = charger()
    largeur, hauteur = anim["w"], anim["h"]
    os.makedirs(SORTIE, exist_ok=True)

    page_html = os.path.join(ICI, "_ref_tmp.html")
    with open(page_html, "w", encoding="utf-8") as f:
        f.write(HTML % (open(LOTTIE_JS).read(), largeur, hauteur, json.dumps(anim)))

    try:
        async with async_playwright() as pw:
            navigateur = await pw.chromium.launch()
            page = await navigateur.new_page()
            await page.set_viewport_size({"width": largeur, "height": hauteur})
            await page.goto("file://" + page_html)
            # Sans cette attente, on capture un canevas vide sans aucune erreur.
            await page.wait_for_function("window.ready === true", timeout=15000)

            total = await page.evaluate("window.anim.totalFrames")
            indices = list(range(0, int(total), PAS)) + [int(total) - 1]
            for i in indices:
                await page.evaluate(f"window.anim.goToAndStop({i}, true)")
                await page.wait_for_timeout(60)
                image = Image.open(io.BytesIO(await page.screenshot())).convert("RGB")
                image.save(os.path.join(SORTIE, f"f{i:04d}.png"))
            await navigateur.close()
        print(f"{len(indices)} frames -> {os.path.normpath(SORTIE)}")
    finally:
        if os.path.exists(page_html):
            os.remove(page_html)


asyncio.run(main())
