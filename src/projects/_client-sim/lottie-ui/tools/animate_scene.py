#!/usr/bin/env python3
"""
Anime une scène Lottie convertie : le maillon jamais teste jusqu'ici.

⭐ POURQUOI CET OUTIL : tout ce qu'on a prouve jusqu'a present convertit du
STATIQUE. Or un client qui commande du Lottie commande un objet qui BOUGE
(le brief reel du 2026-08-23 s'intitule "Lottie ANIMATIONS"). Tant qu'on n'a
pas anime une scene de bout en bout, on ne sait pas livrer ce qu'il achete.

Ce script prend un .json converti (calques nommes) et pose une animation
depuis une "partition" : un dict {motif_de_nom: (type, debut, fin)}.

Trois primitives, choisies parce qu'elles couvrent nos scenes reelles :
  - "trace"  : le trait se dessine progressivement  -> shape 'tm' (trimPath),
               l'equivalent Lottie natif de nos interpolate sur strokeDashoffset
  - "fondu"  : apparition en opacite               -> ks.o
  - "pop"    : apparition avec un ressort discret  -> ks.s (echelle)

⛔ CE QUI RESTE DU TRAVAIL HUMAIN : la partition. On ne devine pas l'intention
narrative d'une scene depuis sa geometrie -- c'est le realisateur qui dit
"la maison se dessine, PUIS la flamme s'allume". L'outil execute, il ne
decide pas.

Usage :
    python3 animate_scene.py scene.json -o scene-animee.json --partition maison
"""

import argparse
import json
import os
import sys

# --- Partitions ---------------------------------------------------------------
# Recopiees de l'INTENTION du composant Remotion d'origine (GazoducActe5Maison :
# la maison se dessine 0-58, details 40-66, chauffage 55-80, flamme 70-90,
# fil 88-118, axe 100-122, courbe 118-280). On garde les memes bornes pour que
# la version Lottie raconte la MEME chose que la video.
PARTITIONS = {
    # ⚠️ Motifs cales sur les noms REELS des calques (verifies dans le .json,
    # pas supposes) : house, heating, flame, link, chart, rect.
    # Bornes recopiees du composant Remotion d'origine pour que la version
    # Lottie raconte la MEME chose que la video : maison 0-58, chauffage
    # 55-80, flamme 70-92, fil 88-118, courbe 118-280.
    "maison": {
        "_duree": 300,
        "rect": ("aucun", 0, 0),        # le fond reste pose des la 1re frame
        "house": ("trace", 0, 58),
        "heating": ("fondu", 55, 80),
        "flame": ("pop", 70, 92),
        "link": ("trace", 88, 118),
        "chart": ("trace", 118, 280),
    },
    # Revelation generique : tout apparait EN MEME TEMPS. Utile pour un test
    # de tuyauterie, pauvre comme demonstration.
    "cascade": {"_duree": 120, "*": ("fondu", 0, 24)},
    # ⭐ Cascade ECHELONNEE : chaque calque demarre un peu apres le precedent,
    # du fond vers le premier plan. Une scene sans id exploitables (calques
    # auto-numerotes) n'a pas de partition par nom -- c'est le repli qui
    # produit quand meme une revelation lisible.
    # Le decalage est calcule a l'execution (cf. --echelonne).
    "echelonnee": {"_duree": 150, "_echelonne": True, "*": ("fondu", 0, 20)},
}


def centre_du_calque(couche):
    """
    Barycentre des sommets du calque, en coordonnees de la composition.

    ⛔ INDISPENSABLE POUR 'pop' ET TOUTE MISE A L'ECHELLE : un calque converti
    a son ancre ET sa position a [0,0] (le coin haut-gauche), parce que la
    geometrie porte deja ses coordonnees absolues. Mettre l'echelle a 0 fait
    alors converger la forme vers LE COIN DE L'ECRAN au lieu de la faire
    grandir sur place -- l'element parait ne pas s'animer.
    (Signale par Aziz dans Creator le 2026-08-25 : "la flamme ne s'anime pas".
    Meme famille que le bug de rotation du 24/08 : une transformation posee
    a cote de la forme au lieu d'etre centree dessus.)

    Le remede : ancre = position = centre de la forme. La forme ne bouge pas
    (p compense a), mais l'echelle et la rotation pivotent enfin sur elle.
    """
    xs, ys = [], []
    for groupe in couche.get("shapes", []):
        for it in groupe.get("it", []):
            if it.get("ty") == "sh":
                for x, y in it["ks"]["k"]["v"]:
                    xs.append(x)
                    ys.append(y)
    if not xs:
        return None
    return [round((min(xs) + max(xs)) / 2, 2), round((min(ys) + max(ys)) / 2, 2)]


def keyframes(paires, easing=(0.33, 0.67)):
    """Suite de keyframes avec une inertie douce (jamais lineaire : ca se voit)."""
    out = []
    ox, ix = easing
    for i, (t, v) in enumerate(paires):
        k = {"t": t, "s": v if isinstance(v, list) else [v]}
        if i < len(paires) - 1:
            k["o"] = {"x": [ox], "y": [0]}
            k["i"] = {"x": [ix], "y": [1]}
        out.append(k)
    return {"a": 1, "k": out}


def trouver_partition(nom, partition):
    """Le 1er motif contenu dans le nom du calque gagne ; '*' est le defaut."""
    bas = nom.lower()
    for motif, regle in partition.items():
        if motif.startswith("_"):
            continue
        if motif != "*" and motif.lower() in bas:
            return regle
    return partition.get("*")


def animer(doc, partition):
    """Pose l'animation sur les calques. Retourne (n_animes, n_ignores)."""
    duree = partition.get("_duree", doc.get("op", 120))
    doc["op"] = duree
    animes, ignores = 0, 0

    # Cascade echelonnee : on repartit les departs sur les 2/3 de la duree,
    # dans l'ordre de PEINTURE (dernier calque de la liste = dessine en 1er).
    echelonne = partition.get("_echelonne")
    n_couches = len(doc["layers"])
    for rang, couche in enumerate(doc["layers"]):
        regle = trouver_partition(couche["nm"], partition)
        if echelonne and regle:
            genre, _, longueur = regle
            ordre = n_couches - 1 - rang          # du fond vers l'avant
            depart = int(ordre / max(1, n_couches - 1) * duree * 0.62)
            regle = (genre, depart, depart + max(8, longueur))
        couche["op"] = duree
        if not regle:
            ignores += 1
            continue
        genre, debut, fin = regle
        if genre == "aucun":            # visible des le debut, jamais anime
            ignores += 1
            continue
        animes += 1

        if genre == "fondu":
            couche["ks"]["o"] = keyframes([(0, [0]), (debut, [0]), (fin, [100])])

        elif genre == "pop":
            centre = centre_du_calque(couche)
            if centre:
                # ancre ET position sur le centre : la forme reste en place,
                # mais l'echelle pivote desormais sur elle-meme.
                couche["ks"]["a"] = {"a": 0, "k": centre}
                couche["ks"]["p"] = {"a": 0, "k": centre}
            couche["ks"]["o"] = keyframes([(0, [0]), (debut, [0]), (debut + 4, [100])])
            # leger depassement puis retour : un ressort lisible sans etre clinquant
            couche["ks"]["s"] = keyframes(
                [(debut, [0, 0]), (int(debut + (fin - debut) * 0.6), [108, 108]),
                 (fin, [100, 100])])

        elif genre == "trace":
            # ⭐ trimPath ('tm') = l'equivalent Lottie natif du trait qui se
            # dessine. Il s'applique au GROUPE et rogne les chemins qu'il
            # contient : e = 0 -> rien de visible, e = 100 -> trait entier.
            # ⚠️ Il agit sur le CONTOUR. Une forme sans stroke ne montrera
            # rien -- d'ou le fondu de secours ci-dessous.
            a_contour = any(
                it.get("ty") == "st"
                for groupe in couche["shapes"] for it in groupe.get("it", []))
            if a_contour:
                for groupe in couche["shapes"]:
                    if not any(it.get("ty") == "st" for it in groupe.get("it", [])):
                        continue
                    groupe["it"].insert(len(groupe["it"]) - 1, {
                        "ty": "tm", "nm": "trace", "m": 1,
                        "s": {"a": 0, "k": 0},
                        "e": keyframes([(debut, [0]), (fin, [100])]),
                        "o": {"a": 0, "k": 0},
                    })
                couche["ks"]["o"] = keyframes([(0, [0]), (debut, [100])])
            else:
                couche["ks"]["o"] = keyframes([(0, [0]), (debut, [0]), (fin, [100])])
    return animes, ignores


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("-o", "--out")
    ap.add_argument("--partition", default="cascade",
                    help=f"une de : {', '.join(PARTITIONS)}")
    ap.add_argument("--duree", type=int, help="duree en frames (sinon celle de la partition)")
    a = ap.parse_args()

    if a.partition not in PARTITIONS:
        print(f"partition inconnue : {a.partition}", file=sys.stderr)
        return 2
    partition = dict(PARTITIONS[a.partition])
    if a.duree:
        partition["_duree"] = a.duree

    doc = json.loads(open(a.json, encoding="utf-8").read())
    animes, ignores = animer(doc, partition)

    sortie = a.out or os.path.splitext(a.json)[0] + "-anime.json"
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"))
    print(f"{os.path.basename(sortie)} : {animes} calques animes, {ignores} laisses fixes, "
          f"{doc['op']} frames @ {doc['fr']}fps ({os.path.getsize(sortie)/1024:.1f} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
