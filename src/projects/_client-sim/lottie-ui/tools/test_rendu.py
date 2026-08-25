#!/usr/bin/env python3
"""
Non-regression VISUELLE : convertit des assets reels et compare le rendu
Lottie au rendu SVG, pixel par pixel, dans Chromium.

⭐ POURQUOI CE TEST EXISTE : le rapport du convertisseur annoncait
"transportable a l'identique" pendant que les contours noirs de la cabosse
etaient reduits de moitie (5 px -> 2 px). Aucun test de geometrie ne pouvait
le voir : le JSON etait valide, les chemins exacts, les couleurs bonnes.
Seul le RENDU l'a montre. -> on ne conclut jamais sur le rapport seul.

Lance : python3 test_rendu.py     (necessite playwright + le navigateur)
"""
import os, subprocess, sys, tempfile

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.abspath(os.path.join(ICI, "..", "..", "..", "..", ".."))
LIB = os.path.join(RACINE, "src/projects/_shared/svg-library/elements")

# (chemin, ecart max tolere en % de pixels)
# 0,5 % couvre l'antialiasing entre deux moteurs sur des traits fins ;
# le bug de contour, lui, donnait 3,17 % et 5,67 %.
CAS = [
    ("peche/poisson-encre.svg", 0.5),
    ("nature/astre/soleil-radiant-ggw.svg", 0.5),
    ("agriculture/cabosse/cabosse-ouverte-cacao-chocolat.svg", 0.5),
    ("agriculture/cacaoyer/cacaoyer-cacao-chocolat.svg", 0.5),
]

fails = []
with tempfile.TemporaryDirectory() as tmp:
    for rel, tol in CAS:
        svg = os.path.join(LIB, rel)
        if not os.path.exists(svg):
            print(f"  SKIP  {rel} (absent)")
            continue
        nom = os.path.splitext(os.path.basename(rel))[0]
        js = os.path.join(tmp, nom + ".json")
        r = subprocess.run([sys.executable, os.path.join(ICI, "svg2lottie_scene.py"),
                            svg, "-o", js], capture_output=True, text=True)
        if not os.path.exists(js):
            print(f"  FAIL  {nom} : conversion echouee\n{r.stdout}{r.stderr}")
            fails.append(nom)
            continue
        r = subprocess.run([sys.executable, os.path.join(ICI, "compare_render.py"),
                            svg, js, "-o", os.path.join(tmp, nom + ".png")],
                           capture_output=True, text=True)
        pct = None
        for ligne in r.stdout.splitlines():
            if "divergents" in ligne:
                pct = float(ligne.split(":")[1].split("%")[0])
            if "RENDU VIDE" in ligne:
                pct = 100.0
        if pct is None:
            print(f"  FAIL  {nom} : pas de mesure\n{r.stdout}{r.stderr}")
            fails.append(nom)
        elif pct > tol:
            print(f"  FAIL  {nom} : {pct:.2f} % divergents (max {tol} %)")
            fails.append(nom)
        else:
            print(f"  ok    {nom} : {pct:.2f} % divergents")

print()
if fails:
    print(f"{len(fails)} ECHEC(S) : {', '.join(fails)}")
    sys.exit(1)
print("Rendu conforme sur tous les assets.")
