#!/usr/bin/env python3
"""GATE — rejoue un rig SVG en cinematique directe (FK) et rend les poses, pour les REGARDER.

⭐ A PASSER AVANT DE VALIDER TOUT PERSONNAGE. Un dessin statique reussi ne dit RIEN de son
animabilite (le visage du pecheur sortait bien fixe et s'animait mal). Ce qui se juge ici :
un joint qui s'ouvre, un membre qui se detache du corps, une ombre qui reste en arriere.

Lit la convention maison declaree dans le SVG :
    <g id="bras-g-haut" data-parent="torse" data-pivot="121,250">
⛔ `data-pivot="haut"` est FAUX pour un membre articule : a cause de la reserve de
recouvrement, le sommet de la boite est 10-20 px AU-DESSUS du vrai centre articulaire.

Usage :
    python3 test-rotation.py ../assets/perso-neutre-v3.svg -o /tmp/rot
    python3 test-rotation.py perso.svg -o /tmp/rot --poses mes-poses.json
"""
import argparse
import json
import os
import re
import subprocess
import sys

RSVG = "/opt/homebrew/bin/rsvg-convert"

# Poses de controle par defaut. Choisies pour exhiber les defauts, pas pour flatter :
# 60 deg d'epaule + coude, genou plie sous hanche tournee, et le SALUT a 120 deg qui a
# echoue 4 fois sur une piece PROFESSIONNELLE mal decoupee (15_Customs_Officer).
POSES_DEFAUT = {
    "repos": {},
    "bras-30": {"bras-g-haut": 30, "bras-d-haut": -30},
    "bras-60": {"bras-g-haut": 60, "bras-d-haut": -60, "bras-g-bas": 15, "bras-d-bas": -15},
    "genou-40": {"jambe-g-haut": 20, "jambe-g-bas": 40, "tete": 8},
    "salut-120": {"bras-d-haut": -120, "bras-d-bas": -25},
}


def lire_rig(svg):
    """{id: {parent, pivot}} depuis les attributs data-parent / data-pivot."""
    rig = {}
    for m in re.finditer(
        r'<g id="([a-z0-9-]+)"(?:[^>]*?data-parent="([a-z0-9-]+)")?'
        r'(?:[^>]*?data-pivot="([0-9.]+),([0-9.]+)")?', svg
    ):
        gid, parent, px, py = m.groups()
        rig[gid] = {"parent": parent, "pivot": (px, py)}
    return rig


def chaine(rig, gid):
    """Du plus proche ancetre articule jusqu'a la feuille (racine -> membre)."""
    out, vu, g = [], set(), gid
    while g and g != "controle" and g not in vu:
        vu.add(g)
        out.append(g)
        g = rig.get(g, {}).get("parent")
    return list(reversed(out))


def poser(svg, rig, angles):
    """Applique les rotations en composant la chaine de parentage."""
    doc = svg
    for gid in rig:
        if gid == "controle":
            continue
        parts = []
        for anc in chaine(rig, gid):
            a = angles.get(anc, 0)
            px, py = rig[anc]["pivot"]
            if a and px:
                parts.append("rotate(%s %s %s)" % (a, px, py))
        if parts:
            doc = doc.replace('<g id="%s"' % gid,
                              '<g id="%s" transform="%s"' % (gid, " ".join(parts)), 1)
    return doc


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("svg", help="le personnage a tester")
    ap.add_argument("-o", "--sortie", default="test-rotation", help="dossier de sortie")
    ap.add_argument("--poses", help="JSON {nom: {calque: degres}} — remplace les poses par defaut")
    ap.add_argument("--largeur", type=int, default=420)
    ap.add_argument("--hauteur", type=int, default=950)
    a = ap.parse_args()

    if not os.path.exists(a.svg):
        sys.exit("introuvable : %s" % a.svg)
    if not os.path.exists(RSVG):
        sys.exit("rsvg-convert introuvable (%s) — installer librsvg" % RSVG)

    svg = open(a.svg, encoding="utf-8").read()
    rig = lire_rig(svg)
    poses = json.load(open(a.poses, encoding="utf-8")) if a.poses else POSES_DEFAUT

    articules = [g for g, v in rig.items() if v["parent"] and v["pivot"][0]]
    print("%s : %d groupes, %d articules" % (os.path.basename(a.svg), len(rig), len(articules)))
    mots_cles = re.findall(r'data-pivot="(haut|bas|centre|gauche|droite)"', svg)
    if mots_cles:
        print("  ATTENTION %d pivot(s) en mot-cle : FAUX pour un membre articule" % len(mots_cles))

    os.makedirs(a.sortie, exist_ok=True)
    faits = []
    for nom, angles in poses.items():
        p = os.path.join(a.sortie, nom + ".svg")
        with open(p, "w", encoding="utf-8") as f:
            f.write(poser(svg, rig, angles))
        png = os.path.join(a.sortie, nom + ".png")
        r = subprocess.run([RSVG, "-w", str(a.largeur), "-h", str(a.hauteur),
                            "--background-color", "#F2EFE9", p, "-o", png],
                           capture_output=True)
        if r.returncode == 0:
            faits.append(png)

    print("%d pose(s) rendue(s) dans %s/" % (len(faits), a.sortie))
    print("⭐ REGARDER les PNG : un joint qui s'ouvre ? un membre detache ? une ombre restee en arriere ?")


if __name__ == "__main__":
    main()
