#!/usr/bin/env python3
"""Extrait les 3 couches de decor-fond.svg vers ../decor-geometrie.ts.

A REJOUER apres toute regeneration du SVG (gen-decor-fond.py).

    python3 src/projects/_portfolio/cauri/assets/extraire-decor.py
"""
import io
import os
import re

ICI = os.path.dirname(os.path.abspath(__file__))
SVG = os.path.join(ICI, "decor-fond.svg")
TS = os.path.join(ICI, "..", "decor-geometrie.ts")

svg = io.open(SVG, encoding="utf-8").read()

vb = re.search(r'viewBox="0 0 (\d+) (\d+)"', svg)
largeur, hauteur = int(vb.group(1)), int(vb.group(2))

fond = re.search(r'<rect id="fond-base"[^>]*fill="([^"]+)"', svg).group(1)

def extraire_couche(nom):
    m = re.search(r'<g id="%s">(.*?)</g>' % nom, svg, re.S)
    contenu = m.group(1)
    paths = re.findall(r'<path id="([^"]+)" d="([^"]+)" fill="([^"]+)" opacity="([^"]+)"/>', contenu)
    return paths

couches = {
    "lointaine": extraire_couche("couche-lointaine"),
    "mediane": extraire_couche("couche-mediane"),
    "proche": extraire_couche("couche-proche"),
}

for nom, paths in couches.items():
    if not paths:
        raise SystemExit("couche vide ou non trouvee : %s" % nom)

out = []
out.append("// Decor de fond oceanique — extrait de assets/decor-fond.svg (source versionnee,")
out.append("// generateur rejouable : assets/gen-decor-fond.py). NE PAS editer les `d=` a la main.")
out.append("//")
out.append("// 3 couches de profondeur pour un parallax horizontal en boucle. Chaque couche est")
out.append("// une somme d'harmoniques entieres : periode EXACTE = LARGEUR_DECOR, donc x=0 et")
out.append("// x=LARGEUR_DECOR sont identiques — la boucle ne se voit jamais.")
out.append("")
out.append("export const LARGEUR_DECOR = %d;" % largeur)
out.append("export const HAUTEUR_DECOR = %d;" % hauteur)
out.append('export const FOND_BASE = "%s";' % fond)
out.append("")
out.append("export type FormeDecor = { id: string; d: string; fill: string; opacity: number };")
out.append("")
for nom, paths in couches.items():
    out.append("export const COUCHE_%s: FormeDecor[] = [" % nom.upper())
    for pid, d, fill, opacity in paths:
        out.append('  { id: "%s", d: "%s", fill: "%s", opacity: %s },' % (pid, d, fill, opacity))
    out.append("];")
    out.append("")

io.open(TS, "w", encoding="utf-8").write("\n".join(out) + "\n")
print("decor-geometrie.ts regenere : %d x %d, couches %s" % (
    largeur, hauteur, ", ".join("%s(%d)" % (n, len(p)) for n, p in couches.items())
))
