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

# Scenes completes (hors svg-library) : chemin absolu depuis la racine du repo.
# ⭐ Le 2e cas est VOLONTAIREMENT un echec attendu -- voir plus bas.
SCENES = [
    ("public/assets/geoafrique/recraft-v4/beat01-free-A2.svg", 0.5, None),
    ("src/projects/_rnd/chill-meter/chill-meter-mix.svg", 100.0,
     "30 refus annonces (13 text, 12 use, 5 filtres) : l'ecart mesure ~29 % CONFIRME "
     "le rapport, il ne le contredit pas. Les 102 degrades sont PORTES depuis le "
     "2026-08-26 (il n'en reste 2 en repli), d'ou 32,4 % -> 28,8 %"),
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

# --- Scenes completes ---------------------------------------------------------
# ⭐ POURQUOI un cas a 33 % d'ecart est un SUCCES : le convertisseur avait
# annonce 30 refus AVANT tout rendu. Le rendu montre exactement ce qui manque
# (tout le texte, les icones, les degrades d'ecran). Ce test verifie donc la
# COHERENCE rapport <-> rendu : si l'ecart devenait faible sans que les refus
# disparaissent, c'est le RAPPORT qui mentirait.
print()
with tempfile.TemporaryDirectory() as tmp:
    for rel, tol, note in SCENES:
        svg = os.path.join(RACINE, rel)
        if not os.path.exists(svg):
            print(f"  SKIP  {os.path.basename(rel)} (absent)")
            continue
        nom = os.path.splitext(os.path.basename(rel))[0]
        js = os.path.join(tmp, nom + ".json")
        subprocess.run([sys.executable, os.path.join(ICI, "svg2lottie_scene.py"),
                        svg, "-o", js], capture_output=True, text=True)
        if not os.path.exists(js):
            print(f"  FAIL  {nom} : conversion echouee")
            fails.append(nom)
            continue
        r = subprocess.run([sys.executable, os.path.join(ICI, "compare_render.py"),
                            svg, js, "-o", os.path.join(tmp, nom + ".png")],
                           capture_output=True, text=True)
        pct = None
        for ligne in r.stdout.splitlines():
            if "divergents" in ligne:
                pct = float(ligne.split(":")[1].split("%")[0])
        if pct is None:
            print(f"  FAIL  {nom} : pas de mesure")
            fails.append(nom)
        elif pct > tol:
            print(f"  FAIL  {nom} : {pct:.2f} % divergents (max {tol} %)")
            fails.append(nom)
        else:
            print(f"  ok    {nom} : {pct:.2f} % divergents"
                  + (f"\n          ({note})" if note else ""))

print()
if fails:
    print(f"{len(fails)} ECHEC(S) : {', '.join(fails)}")
    sys.exit(1)
print("Rendu conforme sur tous les assets.")
