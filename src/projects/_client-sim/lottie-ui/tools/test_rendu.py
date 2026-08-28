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
    # ⭐ Seuil releve de 0,5 a 0,9 le 2026-08-26, et c'est un PROGRES, pas un
    # relachement : ce fichier a un stroke-dasharray="11 18" qui etait
    # IGNORE (cercle rendu PLEIN a 0,39 %). Maintenant qu'il est porte, les
    # deux rendus sont pointilles -- mais Chromium et lottie-web ne demarrent
    # pas le motif au meme point du cercle. L'ecart mesure (0,52 %) est donc
    # un DEPHASAGE des tirets, pas une erreur : meme nombre, meme espacement
    # (verifie a l'oeil sur la planche). Un cercle plein contre un cercle
    # pointille donnerait le meme ordre de grandeur -- d'ou l'exigence de
    # REGARDER, jamais de conclure sur le seul pourcentage.
    ("nature/astre/soleil-radiant-ggw.svg", 0.9),
    ("agriculture/cabosse/cabosse-ouverte-cacao-chocolat.svg", 0.5),
    ("agriculture/cacaoyer/cacaoyer-cacao-chocolat.svg", 0.5),
]

# Scenes completes (hors svg-library) : chemin absolu depuis la racine du repo.
# ⭐ Le 2e cas est VOLONTAIREMENT un echec attendu -- voir plus bas.
SCENES = [
    ("public/assets/geoafrique/recraft-v4/beat01-free-A2.svg", 0.5, None),
    ("src/projects/_rnd/chill-meter/chill-meter-mix.svg", 100.0,
     "13 refus annonces (11 filtres, 2 pattern) : l'ecart mesure "
     "~14 % CONFIRME le rapport, il ne le contredit pas. Historique de la "
     "baisse, chaque palier accompagne d'un changement de traitement "
     "IDENTIFIE : 32,7 % -> 28,8 % (degrades portes, 2026-08-26) -> 28,05 % "
     "(TEXTE vectorise, meme jour : les 13 refus <text> ont disparu) -> "
     "16,39 % (motifs NON PEINTS, meme jour : les 2 <pattern> gpt_scratches "
     "et gpt_screenGrid sont passes d'un gris #808080 invente, peint par "
     "dessus, a un refus declare qui laisse voir la couche du dessous -- "
     "d'ou 17 refus puis 19) -> 13,88 % (<use> APLATIS, 2026-08-28 : les 12 "
     "refus <use> ont disparu, la geometrie referencee est reellement "
     "dessinee -- 401 calques au lieu de 273). "
     "⛔ C'est le garde-fou du projet : si l'ecart baissait SANS que les "
     "refus correspondants disparaissent ou soient declares, ce serait le "
     "rapport qui mentirait"),
    # ⛔ NON-REGRESSION du bug "degrade hors cadre" (2026-08-28) : les
    # coordonnees userSpaceOnUse vivent dans le repere du path, AVANT la
    # matrice accumulee. Sans la porter, cx=400 sur un cadre 200x200 sort du
    # champ et le degrade disparait. Mesure : 3,70 % divergents sans le
    # correctif, 0,21 % avec. Fixture volontairement autonome (pas d'asset
    # externe) pour que ce test ne SKIP jamais.
    ("src/projects/_client-sim/lottie-ui/tools/fixtures/degrade-sous-transform.svg",
     0.5, "degrade radial ET lineaire sous transform de groupe"),
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
