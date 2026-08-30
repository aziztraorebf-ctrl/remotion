#!/usr/bin/env python3
"""
Rend une piece PRESENTABLE A UN CLIENT : noms lisibles, calques regroupes.

⭐ POURQUOI CET OUTIL EXISTE. Une conversion fidele n'est pas une piece
livrable. Verification faite le 2026-08-30 sur le gabarit d'etat-major, en
l'ouvrant comme le ferait un acheteur :
  - le fichier s'appelait « EtatMajorGabarit-f139 » -- « f139 » est un detail
    de NOTRE chaine d'extraction, illisible pour un client ;
  - le premier ecran montrait `rim-1`, `g-2-pochoir`, `g-2`, `circle-1` :
    aucun ne dit ce qu'il est ;
  - 69 calques a plat, dont `compass` eclate en 9 morceaux et `legend` en 10.
    Un client veut cliquer sur « la boussole », pas sur `compass-7`.
Le rendu etait pourtant exact a 0,25 %. Fidelite et lisibilite sont deux
qualites SEPAREES : la mesure ne voit que la premiere.

⛔ CE QUE CET OUTIL NE FAIT PAS : inventer des noms. Il regroupe ce qui porte
deja le meme prefixe et traduit les noms techniques connus. Une scene aux
calques « path-248 » en ressortira illisible -- et c'est le bon resultat : il
faut alors corriger le NOMMAGE a la source, dans le composant.

Usage :
    python3 livrer_piece.py piece.json --nom "Carte d'etat-major" -o livrable.json
"""

import argparse
import json
import os
import re
import sys

# Noms que NOTRE chaine produit, et ce qu'ils veulent dire pour un client.
# ⚠️ On ne traduit que ce qu'on CONNAIT : un nom inconnu reste tel quel, visible,
# plutot que masque derriere une etiquette inventee.
TRADUCTIONS = {
    "rim": "Cadre",
    "circle": "Fond",
    "g-2": "Carte",
    "bg-grid": "Grille de fond",
    "terrain": "Relief",
    "staff-map-medallion": "Medaillon",
    "control-zone-west": "Zone de controle ouest",
    "control-zone-east": "Zone de controle est",
    "city-alpha": "Ville Alpha",
    "city-bravo": "Ville Bravo",
    "city-charlie": "Ville Charlie",
    "maneuver-arrow-north": "Fleche nord",
    "maneuver-arrow-south": "Fleche sud",
    "compass": "Boussole",
    "legend": "Cartouche",
}


def joli(nom):
    """Traduit un nom technique, ou le rend presentable a defaut."""
    base = re.sub(r"[-_]?\d+$", "", nom or "").strip()
    if base in TRADUCTIONS:
        return TRADUCTIONS[base]
    if base.endswith("-pochoir"):
        # un pochoir est une mecanique interne : le dire clairement
        racine = base[:-len("-pochoir")]
        return f"{TRADUCTIONS.get(racine, racine)} — masque"
    if not base or re.fullmatch(r"(g|path|circle|rect|ellipse|polygon|line)", base):
        return None            # nom sans valeur : on ne le maquille pas
    return base.replace("-", " ").replace("_", " ").capitalize()


def numeroter_par_prefixe(couches):
    """Renomme les calques d'un meme prefixe en « Nom 1/3, 2/3, 3/3 ».

    ⛔ POURQUOI ON NE FUSIONNE PAS. Premier jet : empiler les `shapes` de N
    calques dans un seul, en gardant le `ks` du premier. Mesure immediate --
    l'encre est tombee de 70,3 % a 2,6 %, la piece etait VIDE. Chaque calque
    converti porte sa geometrie en coordonnees absolues AVEC SON PROPRE
    transform ; les empiler sous un seul `ks` ecrase les positions de tous les
    autres. Meme famille que les autres defauts de la journee : la valeur juste,
    le referentiel faux.
    ⭐ Rattrape par verifier_fidelite.py AVANT livraison. Sans lui, une piece
    vide partait au portfolio avec un rapport content.

    Ce que le client veut vraiment, c'est SAVOIR CE QU'IL REGARDE. Un nom
    explicite et numerote le lui dit sans toucher a la geometrie :
    « Boussole 1/9 » se lit, « compass-7 » non.
    """
    import collections
    compte = collections.Counter(
        re.sub(r"[-_]?\d+$", "", c.get("nm", "") or "").strip() for c in couches)
    vus = collections.Counter()
    for c in couches:
        base = re.sub(r"[-_]?\d+$", "", c.get("nm", "") or "").strip()
        etiquette = joli(c.get("nm"))
        if not etiquette:
            continue
        total = compte[base]
        if total > 1:
            vus[base] += 1
            c["_etiquette"] = f"{etiquette} {vus[base]}/{total}"
        else:
            c["_etiquette"] = etiquette
    return couches


def livrer(doc, nom_piece, fusionner=True):
    rapport = {"renommes": 0, "fondus": 0, "restants_illisibles": []}
    doc["nm"] = nom_piece

    def traiter(couches):
        couches = numeroter_par_prefixe(couches)
        for c in couches:
            n = c.pop("_etiquette", None) or joli(c.get("nm"))
            if n:
                if n != c.get("nm"):
                    rapport["renommes"] += 1
                c["nm"] = n
                for g in c.get("shapes", []):
                    if g.get("ty") == "gr":
                        g["nm"] = n
            else:
                rapport["restants_illisibles"].append(c.get("nm"))
        for i, c in enumerate(couches):
            c["ind"] = i
        return couches

    doc["layers"] = traiter(doc["layers"])
    for a in doc.get("assets", []):
        if a.get("layers"):
            a["layers"] = traiter(a["layers"])
            n = joli(a.get("nm"))
            if n:
                a["nm"] = n
    return doc, rapport


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("--nom", required=True, help="nom de la piece, vu par le client")
    ap.add_argument("-o", "--out")
    ap.add_argument("--sans-fusion", action="store_true",
                    help="renommer sans regrouper les calques de meme prefixe")
    a = ap.parse_args()

    doc = json.loads(open(a.json, encoding="utf-8").read())
    avant = len(doc["layers"]) + sum(len(x.get("layers", []))
                                     for x in doc.get("assets", []))
    doc, rap = livrer(doc, a.nom, not a.sans_fusion)
    apres = len(doc["layers"]) + sum(len(x.get("layers", []))
                                     for x in doc.get("assets", []))

    sortie = a.out or os.path.splitext(a.json)[0] + "-livrable.json"
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"), ensure_ascii=False)

    print(f"{os.path.basename(sortie)} : « {a.nom} »")
    print(f"  calques   : {avant} -> {apres}   ({rap['fondus']} fondus)")
    print(f"  renommes  : {rap['renommes']}")
    if rap["restants_illisibles"]:
        # ⛔ Ne PAS taire ce qui reste illisible : c'est la seule facon de voir
        # qu'une scene est mal nommee A LA SOURCE plutot que mal livree.
        uniques = sorted(set(x for x in rap["restants_illisibles"] if x))
        print(f"  ⚠️ {len(uniques)} nom(s) sans valeur pour un client : "
              f"{', '.join(uniques[:8])}")
        print(f"     -> corriger le NOMMAGE dans le composant source")
    print(f"  ({os.path.getsize(sortie)/1024:.0f} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
