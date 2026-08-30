#!/usr/bin/env python3
"""
Lottie -> planche visuelle des calques, pour les NOMMER.

⭐ POURQUOI. `group_layers.py` sait regrouper des calques par une carte
{nom: [motifs]}, mais il DECLARE ne pas savoir deviner l'intention : la carte
est fournie par l'humain. Sur NOS scenes c'est acceptable (on sait ce qu'on a
dessine). Sur le LOGO D'UN CLIENT, non : les calques s'appellent path-1..path-N
et le fichier source ne donne aucun indice.

⛔ Mesure faite le 2026-08-28 sur 2 SVG reels (logo Inkscape, armoiries) :
les `id=` existent mais valent "a", "b", "c", "A", "B"... — noms COMPRESSES par
l'optimiseur d'export. Zero `inkscape:label`. Un filtre qui teste la seule
PRESENCE d'un id conclut a tort qu'ils sont parlants : verifier leur CONTENU.

=> Le nommage est un probleme qui demande de VOIR, pas de lire. Ce script
produit la matiere a voir : chaque calque rendu SEUL, en planche etiquetee.
L'humain (ou un modele de vision) regarde et attribue les noms ; la carte
obtenue alimente `group_layers.py`.

⛔⛔ INADAPTE AUX PIECES PROFESSIONNELLES TIERCES (mesure 2026-08-29).
Ce script lit les sommets `sh` BRUTS et ignore les `tr` des groupes `gr` qui les
portent. Sur NOS scenes c'est correct (un `gr` par calque, pas de `tr` de placement).
Sur une piece pro, CHAQUE forme vit dans son propre `gr` avec un `tr` qui la PLACE :
le resultat est alors FAUX MAIS PLAUSIBLE — sur 15_Customs_Officer il rendait
16 calques sur 19, tous nommes "?", et TOUS les centres a ~0,0 (annulation
arithmetique, pas une erreur visible). Un calque de 73x93 en sommets bruts vaut en
realite 293x374 une fois les `tr` appliques.
=> Pour une piece qu'on n'a pas ecrite, utiliser :
   src/projects/_client-sim/perso-corps-entier/tools/demonter.py
   (geometrie MONDE : `tr` de groupe accumules + chaine de parentage resolue ;
    valide contre lottie-web, 6 calques temoins sur 7 au pixel).

Valide le 2026-08-28 sur le logo Inkscape : sur 8 calques rendus isolement,
les 8 ont ete identifies a l'oeil sans ambiguite (silhouette, contour, reflet
diagonal, montagne dentelee, eclaboussures, reflets fins).

Usage :
    python3 planche_calques.py scene.json -o dossier/ [--top 12] [--taille 128]
    python3 planche_calques.py scene.json --liste      # inventaire seul, sans rendu
"""

import argparse
import json
import os
import subprocess
import sys

RSVG = "/opt/homebrew/bin/rsvg-convert"


def _collect_shapes(noeud, acc):
    """Recupere tous les chemins (ty=sh) d'un calque, a n'importe quelle profondeur."""
    if isinstance(noeud, dict):
        if noeud.get("ty") == "sh" and "ks" in noeud:
            k = noeud["ks"].get("k", {})
            if isinstance(k, dict) and "v" in k:
                acc.append(k)
        for v in noeud.values():
            _collect_shapes(v, acc)
    elif isinstance(noeud, list):
        for v in noeud:
            _collect_shapes(v, acc)


def _to_path_d(k):
    """Sommets Lottie (v/i/o) -> attribut d= SVG. i et o sont RELATIFS a leur sommet."""
    v = k.get("v", [])
    i = k.get("i", [])
    o = k.get("o", [])
    if not v:
        return ""
    d = "M%.2f,%.2f" % (v[0][0], v[0][1])
    for j in range(1, len(v)):
        c1 = (v[j - 1][0] + o[j - 1][0], v[j - 1][1] + o[j - 1][1])
        c2 = (v[j][0] + i[j][0], v[j][1] + i[j][1])
        d += "C%.2f,%.2f %.2f,%.2f %.2f,%.2f" % (c1[0], c1[1], c2[0], c2[1], v[j][0], v[j][1])
    if k.get("c"):
        c1 = (v[-1][0] + o[-1][0], v[-1][1] + o[-1][1])
        c2 = (v[0][0] + i[0][0], v[0][1] + i[0][1])
        d += "C%.2f,%.2f %.2f,%.2f %.2f,%.2fZ" % (c1[0], c1[1], c2[0], c2[1], v[0][0], v[0][1])
    return d


def _bbox(chemins):
    pts = []
    for k in chemins:
        pts.extend(p for p in k.get("v", []) if isinstance(p, list) and len(p) == 2)
    if not pts:
        return None
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def inventaire(doc):
    """Un enregistrement par calque : nom, surface, dimensions, centre, nb sommets."""
    out = []
    for couche in doc.get("layers", []):
        acc = []
        _collect_shapes(couche.get("shapes", []), acc)
        bb = _bbox(acc)
        if not bb:
            continue
        x0, y0, x1, y1 = bb
        w, h = x1 - x0, y1 - y0
        out.append({
            "nom": couche.get("nm", "?"),
            "surface": w * h,
            "l": w, "h": h,
            "cx": (x0 + x1) / 2, "cy": (y0 + y1) / 2,
            "sommets": sum(len(k.get("v", [])) for k in acc),
            "chemins": acc,
        })
    out.sort(key=lambda r: -r["surface"])
    return out


def rendre(rec, doc, dossier, taille):
    """Rend UN calque seul sur fond clair. Retourne le chemin du png, ou None."""
    ds = "".join(
        '<path d="%s" fill="#111"/>' % _to_path_d(k)
        for k in rec["chemins"] if _to_path_d(k)
    )
    if not ds:
        return None
    w, h = doc.get("w", 128), doc.get("h", 128)
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
           'width="%d" height="%d"><rect width="%d" height="%d" fill="#eee"/>%s</svg>'
           % (w, h, w, h, w, h, ds))
    base = os.path.join(dossier, rec["nom"])
    with open(base + ".svg", "w", encoding="utf-8") as f:
        f.write(svg)
    r = subprocess.run([RSVG, "-w", str(taille), base + ".svg", "-o", base + ".png"],
                       capture_output=True)
    return base + ".png" if r.returncode == 0 and os.path.exists(base + ".png") else None


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("lottie", help="fichier .json Lottie")
    ap.add_argument("-o", "--sortie", default="planche-calques",
                    help="dossier de sortie (defaut: planche-calques/)")
    ap.add_argument("--top", type=int, default=12,
                    help="nombre de calques rendus, les plus grands d'abord (defaut 12)")
    ap.add_argument("--taille", type=int, default=128, help="largeur des vignettes en px")
    ap.add_argument("--liste", action="store_true", help="inventaire seul, aucun rendu")
    a = ap.parse_args()

    if not os.path.exists(a.lottie):
        sys.exit("fichier introuvable : %s" % a.lottie)
    with open(a.lottie, encoding="utf-8") as f:
        doc = json.load(f)

    inv = inventaire(doc)
    if not inv:
        sys.exit("aucun calque exploitable dans ce Lottie")

    print("%s -> %d calques, %dx%d" % (os.path.basename(a.lottie), len(inv),
                                       doc.get("w", 0), doc.get("h", 0)))
    print()
    print("%9s %10s %14s %12s %7s" % ("calque", "surface", "l x h", "centre", "sommets"))
    for r in inv[:a.top]:
        print("%9s %10.0f %6.1f x %5.1f %6.0f,%4.0f %7d"
              % (r["nom"], r["surface"], r["l"], r["h"], r["cx"], r["cy"], r["sommets"]))
    if len(inv) > a.top:
        print("... et %d calques plus petits" % (len(inv) - a.top))

    # Doublons de surface = copies superposees (ombre/base/reflet du meme objet).
    # C'est la signature d'un logo "verni" ; les nommer separement n'a pas de sens.
    par_surface = {}
    for r in inv:
        par_surface.setdefault(round(r["surface"], 1), []).append(r["nom"])
    piles = {s: n for s, n in par_surface.items() if len(n) > 1}
    if piles:
        print()
        print("PILES DETECTEES (meme surface = copies superposees d'un meme objet) :")
        for s, noms in sorted(piles.items(), key=lambda x: -x[0])[:5]:
            print("   surface %.0f : %s" % (s, ", ".join(noms)))

    if a.liste:
        return

    os.makedirs(a.sortie, exist_ok=True)
    if not os.path.exists(RSVG):
        sys.exit("rsvg-convert introuvable (%s) — installer librsvg" % RSVG)

    faits = []
    for r in inv[:a.top]:
        p = rendre(r, doc, a.sortie, a.taille)
        if p:
            faits.append(os.path.basename(p))
    print()
    print("%d vignette(s) rendue(s) dans %s/" % (len(faits), a.sortie))
    print("Regarder les png, puis ecrire la carte pour group_layers.py :")
    print('   {"corps": ["path-1", "path-21"], "reflets": ["path-5"], ...}')


if __name__ == "__main__":
    main()
