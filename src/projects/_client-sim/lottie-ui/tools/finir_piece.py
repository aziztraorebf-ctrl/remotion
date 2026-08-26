#!/usr/bin/env python3
"""
Transforme une scene convertie en PIECE LIVRABLE.

⭐ POURQUOI CET OUTIL (decision d'Aziz, 2026-08-26) : une scene qui se convertit
et qui bouge n'est PAS encore un livrable. Ce qu'un client integre a sa page a
trois proprietes que nos conversions n'ont pas :

  1. ELLE N'EST JAMAIS VIDE. Notre maison ouvrait sur un ecran noir de 2 s --
     sur une page web ou la piece tourne en boucle, le visiteur tombe dessus.
  2. ELLE EST CADREE SUR SON DESSIN. Nos scenes font 1920x1080 (format VIDEO)
     alors que le dessin n'en occupe qu'une partie : dans une page, ca donne
     des marges vides et un sujet minuscule. Un Lottie se cadre serre.
  3. ELLE TIENT SA FIN. La notre s'arretait net sur la derniere frame utile,
     sans laisser le temps de lire le resultat.

⛔ CE QUE CET OUTIL NE FAIT PAS : inventer l'animation. Il retouche le CADRE et
le TEMPS d'une piece deja animee. L'intention narrative reste dans
`animate_scene.py`, elle-meme recopiee du composant Remotion d'origine.

Usage :
    python3 finir_piece.py anime.json -o piece.json \\
        [--marge 40] [--tenir 30] [--accelerer-ouverture 2.0] [--carre]
"""

import argparse
import json
import os
import sys


def sommets(k):
    """
    Les sommets d'une forme Lottie.

    ⚠️ DEUX FORMES POSSIBLES et confondre les deux fait planter ou -- pire --
    sous-estimer l'emprise en silence : une forme FIXE porte {v,i,o}, une forme
    ANIMEE porte une liste de keyframes dont chaque `s` contient l'objet.
    """
    if isinstance(k, dict) and "v" in k:
        return list(k["v"])
    out = []
    if isinstance(k, list):
        for kf in k:
            s = kf.get("s")
            if isinstance(s, list):
                for bloc in s:
                    if isinstance(bloc, dict) and "v" in bloc:
                        out += bloc["v"]
            elif isinstance(s, dict) and "v" in s:
                out += s["v"]
    return out


def emprise_calque(couche):
    """(x0, y0, x1, y1) du calque, demi-epaisseur de trait comprise, ou None."""
    xs, ys, trait = [], [], 0.0
    for groupe in couche.get("shapes") or []:
        for it in groupe.get("it", []):
            if it.get("ty") == "sh":
                for p in sommets(it["ks"]["k"]):
                    xs.append(p[0])
                    ys.append(p[1])
            elif it.get("ty") == "gr":               # groupes imbriques
                sous = emprise_calque({"shapes": [it]})
                if sous:
                    xs += [sous[0], sous[2]]
                    ys += [sous[1], sous[3]]
            elif it.get("ty") in ("st", "gs"):
                trait = max(trait, float(it.get("w", {}).get("k", 0) or 0))
    if not xs:
        return None
    m = trait / 2.0
    return (min(xs) - m, min(ys) - m, max(xs) + m, max(ys) + m)


def est_un_fond(couche, w, h):
    """
    Un calque qui couvre (presque) toute la scene est un FOND.

    ⛔ Il doit etre EXCLU du calcul de cadrage, sinon l'emprise vaut toujours
    la scene entiere et le recadrage ne fait rien -- panne silencieuse : le
    fichier sort valide, identique, et on croit avoir recadre.
    """
    e = emprise_calque(couche)
    if not e:
        return False
    return (e[2] - e[0]) >= 0.98 * w and (e[3] - e[1]) >= 0.98 * h


def emprise_du_dessin(doc):
    """Emprise de tout ce qui n'est pas un fond."""
    w, h = doc["w"], doc["h"]
    g = None
    for c in doc["layers"]:
        if est_un_fond(c, w, h):
            continue
        e = emprise_calque(c)
        if not e:
            continue
        g = e if g is None else (min(g[0], e[0]), min(g[1], e[1]),
                                 max(g[2], e[2]), max(g[3], e[3]))
    return g


def decaler(doc, dx, dy):
    """
    Deplace TOUTE la geometrie de (dx, dy).

    ⛔ On decale la GEOMETRIE, pas la position des calques : nos conversions
    posent ancre et position a [0,0] parce que les coordonnees sont absolues.
    Bouger `p` ferait deriver les calques animes en echelle (leur pivot est
    calcule sur la forme) -- le genre de decalage qui ne se voit qu'au rendu.
    """
    def bouge_forme(k):
        if isinstance(k, dict) and "v" in k:
            k["v"] = [[p[0] + dx, p[1] + dy] for p in k["v"]]
            return
        if isinstance(k, list):
            for kf in k:
                s = kf.get("s")
                blocs = s if isinstance(s, list) else [s]
                for bloc in blocs:
                    if isinstance(bloc, dict) and "v" in bloc:
                        bloc["v"] = [[p[0] + dx, p[1] + dy] for p in bloc["v"]]

    def bouge_items(items):
        for it in items:
            if it.get("ty") == "sh":
                bouge_forme(it["ks"]["k"])
            elif it.get("ty") == "gr":
                bouge_items(it.get("it", []))
            elif it.get("ty") in ("gf", "gs"):
                # Un degrade porte ses points de depart/arrivee en PIXELS :
                # les oublier laisse le degrade en place pendant que la forme
                # se deplace -- lueur decalee, sans erreur.
                for cle in ("s", "e"):
                    p = it.get(cle, {})
                    if p.get("a") == 0 and isinstance(p.get("k"), list) and len(p["k"]) >= 2:
                        p["k"] = [p["k"][0] + dx, p["k"][1] + dy] + list(p["k"][2:])

    for c in doc["layers"]:
        for groupe in c.get("shapes") or []:
            bouge_items(groupe.get("it", []))
        # Un calque TEXTE natif porte sa position dans `p` (pas de geometrie).
        if c.get("ty") == 5:
            p = c["ks"]["p"]
            if p.get("a") == 0:
                k = list(p["k"])
                k[0] += dx
                k[1] += dy
                p["k"] = k


def redimensionner_fond(doc, w, h):
    """Un calque de fond doit couvrir le NOUVEAU cadre, pas l'ancien."""
    for c in doc["layers"]:
        e = emprise_calque(c)
        if not e:
            continue
        # apres decalage, un fond deborde largement du nouveau cadre
        if (e[2] - e[0]) >= 0.98 * doc["w"] and (e[3] - e[1]) >= 0.98 * doc["h"]:
            for groupe in c.get("shapes") or []:
                for it in groupe.get("it", []):
                    if it.get("ty") == "sh":
                        k = it["ks"]["k"]
                        if isinstance(k, dict) and "v" in k:
                            k["v"] = [[0, 0], [w, 0], [w, h], [0, h]]
                            k["i"] = [[0, 0]] * 4
                            k["o"] = [[0, 0]] * 4
            return c["nm"]
    return None


def _mise_a_echelle_temps(valeur, pivot, facteur):
    """Comprime les temps AVANT `pivot` d'un facteur donne."""
    if valeur >= pivot:
        return valeur - pivot * (1 - 1 / facteur)
    return valeur / facteur


def accelerer_ouverture(doc, jusqu_a, facteur):
    """
    Comprime le DEBUT de l'animation d'un facteur, en gardant la suite calee.

    ⭐ Choix d'Aziz : garder l'effet "le trait se dessine" (il est beau) mais
    qu'il ne laisse pas l'ecran vide plus d'une seconde. On ne SUPPRIME donc
    pas l'ouverture, on l'ACCELERE.
    """
    def retime(prop):
        if prop.get("a") != 1:
            return
        for kf in prop["k"]:
            kf["t"] = round(_mise_a_echelle_temps(kf["t"], jusqu_a, facteur), 2)

    def parcourir(items):
        for it in items:
            if it.get("ty") == "gr":
                parcourir(it.get("it", []))
                continue
            for cle in ("s", "e", "o", "w", "r"):
                p = it.get(cle)
                if isinstance(p, dict):
                    retime(p)
            if it.get("ty") == "tr":
                for cle in ("a", "p", "s", "r", "o"):
                    p = it.get(cle)
                    if isinstance(p, dict):
                        retime(p)

    for c in doc["layers"]:
        for cle in ("a", "p", "s", "r", "o"):
            p = c["ks"].get(cle)
            if isinstance(p, dict):
                retime(p)
        for groupe in c.get("shapes") or []:
            parcourir(groupe.get("it", []))


def amorcer_le_trace(doc, depart_pct, seulement=None):
    """
    Fait demarrer les traces a `depart_pct` % au lieu de 0.

    ⛔ POURQUOI CA NE SE REGLE PAS EN ACCELERANT (mesure 2026-08-26) :
    accelerer l'ouverture rapproche la fin du trace, mais la 1re frame reste
    a 0 % -- donc VIDE, mathematiquement. Sur une piece qui tourne en boucle
    dans une page, le visiteur tombe sur du noir. La seule facon d'avoir
    quelque chose des la frame 0 est de PARTIR d'un trait deja amorce.
    Un depart franc se lit comme "le dessin est en train de se faire".
    ⛔⛔ ET POURQUOI ON NE L'APPLIQUE PAS A TOUT (mesure + PLANCHE REGARDEE,
    2026-08-26) : amorcer TOUS les traces a produit deux defauts, invisibles
    dans le rapport et evidents a l'oeil --
      · la frame 0 montrait des FRAGMENTS de traits epars (un bout de mur, un
        bout de toit) : ca se lit comme un bug d'affichage, pas comme un
        dessin en train de se faire ;
      · les elements qui arrivent PLUS TARD (le tuyau) etaient amorces eux
        aussi : un trait vertical parasite pendait sous la maison des la
        frame 29, bien avant son entree narrative.
    -> On n'amorce QUE les calques presents des le debut (`seulement`), et on
    prefere une amorce GENEREUSE (35-45 %) qui donne une silhouette lisible a
    une amorce timide qui donne des miettes.

    Rend le nombre de traces touches.
    """
    touches = 0

    def parcourir(items):
        nonlocal touches
        for it in items:
            if it.get("ty") == "gr":
                parcourir(it.get("it", []))
                continue
            if it.get("ty") != "tm":
                continue
            # 'e' (end) est ce que nos traces animent : 0 -> 100.
            p = it.get("e", {})
            if p.get("a") == 1 and p["k"]:
                premier = p["k"][0]
                if premier["s"][0] <= 0.01:
                    premier["s"] = [depart_pct]
                    touches += 1

    for c in doc["layers"]:
        if seulement and not any(m.lower() in c["nm"].lower() for m in seulement):
            continue
        for groupe in c.get("shapes") or []:
            parcourir(groupe.get("it", []))
    return touches


def derniere_keyframe(doc):
    """Le temps de la derniere keyframe : la fin UTILE de l'animation."""
    fin = 0

    def voir(prop):
        nonlocal fin
        if isinstance(prop, dict) and prop.get("a") == 1:
            for kf in prop["k"]:
                fin = max(fin, kf["t"])

    def parcourir(items):
        for it in items:
            if it.get("ty") == "gr":
                parcourir(it.get("it", []))
                continue
            for cle in ("s", "e", "o", "w", "r", "a", "p"):
                voir(it.get(cle))

    for c in doc["layers"]:
        for cle in ("a", "p", "s", "r", "o"):
            voir(c["ks"].get(cle))
        for groupe in c.get("shapes") or []:
            parcourir(groupe.get("it", []))
    return fin


def main():
    ap = argparse.ArgumentParser(description="Scene animee -> piece livrable")
    ap.add_argument("json")
    ap.add_argument("-o", "--out")
    ap.add_argument("--marge", type=float, default=40,
                    help="marge autour du dessin, en pixels (defaut 40)")
    ap.add_argument("--tenir", type=int, default=30,
                    help="frames de pause apres la derniere keyframe (defaut 30 = 1 s)")
    ap.add_argument("--accelerer-ouverture", type=float, default=1.0,
                    metavar="F", help="comprime le debut d'un facteur F (ex. 2.0)")
    ap.add_argument("--jusqu-a", type=int, default=None,
                    help="fin de l'ouverture a accelerer, en frames (defaut : auto)")
    ap.add_argument("--amorce", type=float, default=0.0, metavar="PCT",
                    help="fait demarrer les traces a PCT %% au lieu de 0, pour "
                         "que la 1re frame ne soit jamais vide (ex. 40)")
    ap.add_argument("--amorce-sur", default=None, metavar="MOTIFS",
                    help="n'amorce que les calques dont le nom contient un de "
                         "ces motifs, separes par des virgules (ex. house). "
                         "SANS ce filtre, les elements qui entrent plus tard "
                         "apparaissent en avance -- verifie a l'oeil")
    ap.add_argument("--carre", action="store_true",
                    help="cadre carre (format le plus courant d'un Lottie d'UI)")
    a = ap.parse_args()

    doc = json.load(open(a.json, encoding="utf-8"))
    avant = (doc["w"], doc["h"], doc["op"])

    # --- 1. ouverture ---------------------------------------------------------
    if a.accelerer_ouverture and a.accelerer_ouverture != 1.0:
        pivot = a.jusqu_a
        if pivot is None:
            print("ECHEC : --accelerer-ouverture exige --jusqu-a", file=sys.stderr)
            return 2
        accelerer_ouverture(doc, pivot, a.accelerer_ouverture)
        print(f"  ouverture   : 0-{pivot} comprime x{a.accelerer_ouverture:g} "
              f"-> 0-{pivot / a.accelerer_ouverture:.0f}")

    if a.amorce:
        motifs = [m.strip() for m in a.amorce_sur.split(",")] if a.amorce_sur else None
        n = amorcer_le_trace(doc, a.amorce, motifs)
        print(f"  amorce      : {n} trace(s) demarrent a {a.amorce:g} % "
              f"-> la frame 0 n'est plus vide")

    # --- 2. cadrage -----------------------------------------------------------
    g = emprise_du_dessin(doc)
    if g is None:
        print("ECHEC : aucun dessin trouve (que des fonds ?)", file=sys.stderr)
        return 2
    x0, y0, x1, y1 = g
    m = a.marge
    nw, nh = (x1 - x0) + 2 * m, (y1 - y0) + 2 * m
    dx, dy = -x0 + m, -y0 + m

    if a.carre:
        cote = max(nw, nh)
        dx += (cote - nw) / 2
        dy += (cote - nh) / 2
        nw = nh = cote

    decaler(doc, dx, dy)
    doc["w"], doc["h"] = int(round(nw)), int(round(nh))
    fond = redimensionner_fond(doc, doc["w"], doc["h"])
    print(f"  cadrage     : {avant[0]}x{avant[1]} -> {doc['w']}x{doc['h']}"
          f"   (dessin {x1 - x0:.0f}x{y1 - y0:.0f} + marge {m:g})"
          + (f", fond '{fond}' redimensionne" if fond else ""))

    # --- 3. fin ---------------------------------------------------------------
    fin = derniere_keyframe(doc)
    nouvelle_fin = int(round(fin)) + a.tenir
    doc["op"] = nouvelle_fin
    for c in doc["layers"]:
        c["op"] = nouvelle_fin
    print(f"  fin         : {avant[2]} -> {nouvelle_fin} frames "
          f"(derniere keyframe {fin:.0f} + {a.tenir} tenues)")

    sortie = a.out or os.path.splitext(a.json)[0] + "-piece.json"
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"))
    print(f"  ecrit       : {sortie}  ({os.path.getsize(sortie) / 1024:.1f} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
