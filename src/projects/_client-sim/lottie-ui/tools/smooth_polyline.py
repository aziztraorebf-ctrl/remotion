#!/usr/bin/env python3
"""
Lisse les polylignes d'un Lottie : segments droits -> vraies courbes.

⭐ POURQUOI (trouve par Aziz dans LottieFiles Creator, 2026-08-25) : la courbe
de GazoducActe5Maison paraissait "moins belle que l'originale". Verification :
elle a 38 sommets et ZERO tangente -- c'est une POLYLIGNE.

⛔ Et la cause n'est ni Creator ni notre convertisseur : le composant React
d'origine CONSTRUIT deja la courbe en 72 segments droits
(`line += "L " + x + " " + y`, buildCurve). En video 1920px c'est invisible ;
dans un editeur ou l'on peut ZOOMER, les facettes se voient.
=> Le defaut preexistait dans la video, la conversion l'a fidelement reproduit.
Le corriger ici AMELIORE le livrable Lottie par rapport a la source.

Methode : Catmull-Rom -> Bezier cubique. Chaque sommet recoit des tangentes
deduites de ses voisins (tension 1/6, la valeur qui rend Catmull-Rom
equivalent a une spline naturelle). Les sommets ne bougent PAS : la courbe
passe exactement par les memes points, elle est seulement lissee entre eux.

⚠️ Ne lisse QUE les chemins dont toutes les tangentes sont nulles ET qui ont
assez de sommets : une forme voulue anguleuse (toit, rectangle) ne doit pas
etre arrondie. Seuil par defaut : 8 sommets, et angles doux uniquement.
"""

import argparse
import json
import math
import os
import sys


def angle_entre(a, b, c):
    """Angle au sommet b, en degres. 180 = aligne, 90 = coin franc."""
    v1 = (a[0] - b[0], a[1] - b[1])
    v2 = (c[0] - b[0], c[1] - b[1])
    n1 = math.hypot(*v1)
    n2 = math.hypot(*v2)
    if n1 == 0 or n2 == 0:
        return 180.0
    cos = max(-1.0, min(1.0, (v1[0]*v2[0] + v1[1]*v2[1]) / (n1*n2)))
    return math.degrees(math.acos(cos))


def lisser(k, seuil_sommets=8, angle_min=120.0, tension=1.0/6.0):
    """
    Pose des tangentes Catmull-Rom sur un chemin plat. Retourne True si modifie.

    angle_min : on ne lisse un sommet que si l'angle y est DOUX (>= 120 deg).
    Un vrai coin (toit, marche d'escalier) garde son arete.
    """
    v = k["v"]
    if len(v) < seuil_sommets:
        return False
    if any(t != [0, 0] and t != [0.0, 0.0] for t in k["i"] + k["o"]):
        return False                      # deja courbe : on ne touche pas

    ferme = k.get("c", False)
    n = len(v)
    ins, outs = [], []
    modifie = False
    for i in range(n):
        if ferme:
            p_av, p_ap = v[(i - 1) % n], v[(i + 1) % n]
        else:
            p_av = v[i - 1] if i > 0 else v[i]
            p_ap = v[i + 1] if i < n - 1 else v[i]

        if 0 < i < n - 1 or ferme:
            if angle_entre(p_av, v[i], p_ap) < angle_min:
                ins.append([0.0, 0.0])    # coin franc : on le preserve
                outs.append([0.0, 0.0])
                continue

        tx = (p_ap[0] - p_av[0]) * tension
        ty = (p_ap[1] - p_av[1]) * tension
        ins.append([round(-tx, 4), round(-ty, 4)])
        outs.append([round(tx, 4), round(ty, 4)])
        modifie = True

    if modifie:
        k["i"], k["o"] = ins, outs
    return modifie


def parcourir(doc, **kw):
    n_lisses, n_vus = 0, 0
    for couche in doc.get("layers", []):
        for groupe in couche.get("shapes", []):
            for it in groupe.get("it", []):
                if it.get("ty") != "sh":
                    continue
                n_vus += 1
                if lisser(it["ks"]["k"], **kw):
                    n_lisses += 1
    return n_lisses, n_vus


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("-o", "--out")
    ap.add_argument("--min-sommets", type=int, default=8)
    ap.add_argument("--angle-min", type=float, default=120.0)
    a = ap.parse_args()

    doc = json.load(open(a.json, encoding="utf-8"))
    n, total = parcourir(doc, seuil_sommets=a.min_sommets, angle_min=a.angle_min)
    sortie = a.out or os.path.splitext(a.json)[0] + "-lisse.json"
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"))
    print(f"{os.path.basename(sortie)} : {n}/{total} chemins lisses "
          f"({os.path.getsize(sortie)/1024:.1f} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
