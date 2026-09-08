#!/usr/bin/env python3
"""Extrait les `d=` et les teintes de coquille.svg vers ../coquille-geometrie.ts.

A REJOUER apres toute regeneration du SVG (gen-coquille.py) : la geometrie du TSX
ne doit jamais etre editee a la main.

    python3 src/projects/_portfolio/cauri/assets/extraire-paths.py
"""
import io
import os
import re

ICI = os.path.dirname(os.path.abspath(__file__))
SVG = os.path.join(ICI, "coquille.svg")
TS = os.path.join(ICI, "..", "coquille-geometrie.ts")

svg = io.open(SVG, encoding="utf-8").read()
paths = dict(re.findall(r'<path id="([^"]+)" d="([^"]+)"', svg))
fills = dict(re.findall(r'<path id="([^"]+)"[^>]*fill="([^"]+)"', svg))
fond = re.search(r'<rect id="fond-ocean"[^>]*fill="([^"]+)"', svg).group(1)

for requis in ("coquille-corps", "fente-ouverture"):
    if requis not in paths:
        raise SystemExit("path manquant dans le SVG : %s" % requis)

nums = [float(x) for x in re.findall(r"-?\d+\.?\d*", paths["coquille-corps"])]
xs, ys = nums[0::2], nums[1::2]
largeur, hauteur = max(xs) - min(xs), max(ys) - min(ys)

# Le cauri vu de face est plus HAUT que large (mesure sur photos : h/w ~1,36).
# Si ce rapport s'inverse, le dessin a ete regenere de travers.
if not 1.2 < hauteur / largeur < 1.5:
    raise SystemExit("h/w = %.3f hors plage attendue (1,2-1,5)" % (hauteur / largeur))

entete = io.open(TS, encoding="utf-8").read().split("export const D_SILHOUETTE")[0]
entete = re.sub(r'(export const LARGEUR_NATIVE = )[\d.]+', r"\g<1>%.3f" % largeur, entete)
entete = re.sub(r'(export const HAUTEUR_NATIVE = )[\d.]+', r"\g<1>%.3f" % hauteur, entete)
entete = re.sub(r'(fond: ")[^"]*(")', r"\g<1>%s\g<2>" % fond, entete)
entete = re.sub(r'(nacre: ")[^"]*(")', r"\g<1>%s\g<2>" % fills["coquille-corps"], entete)
entete = re.sub(r'(fente: ")[^"]*(")', r"\g<1>%s\g<2>" % fills["fente-ouverture"], entete)

io.open(TS, "w", encoding="utf-8").write(
    entete
    + 'export const D_SILHOUETTE = "%s";\n\nexport const D_FENTE = "%s";\n'
    % (paths["coquille-corps"], paths["fente-ouverture"])
)
print("coquille-geometrie.ts regenere : %.2f x %.2f (h/w %.3f)" % (largeur, hauteur, hauteur / largeur))
