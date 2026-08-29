#!/usr/bin/env python3
"""PILOTER un rig Lottie tiers : lui faire faire AUTRE CHOSE que son animation d'origine.

⛔⛔ GEOMETRIE D'ORIGINE : ce script REECRIT un fichier du corpus kamotionstudio, dont
la licence n'est PAS documentee. C'est un BANC D'ESSAI qui reste dans le workspace.
⛔ Ne JAMAIS promouvoir sa sortie en livrable client/portfolio sans licence verifiee.
(Decision d'Aziz 2026-08-29 : la contrainte porte sur le LIVRABLE, pas sur le TEST.)

La question du starter : un rig tiers est-il un ASSET (on ne peut que le poser tel quel)
ou un OUTIL (on peut le re-piloter) ? Ce script tranche en pratique.

3 primitives :
  placer(doc, ...)   -- deplace/redimensionne TOUT le personnage via son null de controle
  effacer_geste(doc) -- retire les cles d'origine (le rig cesse de jouer son animation)
  poser(doc, ...)    -- impose nos propres cles de rotation sur un membre choisi
"""
import copy, json, sys, zipfile


def charger(path):
    if zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as z:
            noms = [n for n in z.namelist()
                    if n.startswith("animations/") and n.endswith(".json")]
            return json.loads(z.read(noms[0]).decode("utf-8"))
    return json.load(open(path, encoding="utf-8"))


def racine(doc):
    """Le null ty=3 auquel le plus de calques sont parentes = l'objet de controle."""
    comptes = {}
    for l in doc["layers"]:
        if "parent" in l:
            comptes[l["parent"]] = comptes.get(l["parent"], 0) + 1
    nulls = [l for l in doc["layers"] if l["ty"] == 3]
    if not nulls:
        return None
    return max(nulls, key=lambda l: comptes.get(l["ind"], 0))


def placer(doc, x=None, y=None, echelle=None):
    """Deplace/redimensionne le personnage ENTIER en touchant un seul calque."""
    r = racine(doc)
    if r is None:
        raise SystemExit("aucun null de controle : ce rig ne se place pas d'un seul geste")
    ks = r["ks"]
    if x is not None or y is not None:
        p = ks["p"]
        k = p.get("k")
        if p.get("a") == 1:                      # position animee : on decale chaque cle
            base = k[0]["s"]
            dx = (x - base[0]) if x is not None else 0
            dy = (y - base[1]) if y is not None else 0
            for cle in k:
                for champ in ("s", "e"):
                    if champ in cle:
                        cle[champ] = [cle[champ][0] + dx, cle[champ][1] + dy] + cle[champ][2:]
        else:
            if x is not None: k[0] = x
            if y is not None: k[1] = y
    if echelle is not None:
        s = ks["s"]
        if s.get("a") != 1:
            s["k"] = [echelle, echelle] + s["k"][2:]
    return r["ind"]


def effacer_geste(doc, sauf=()):
    """Fige l'animation d'origine : chaque propriete animee garde sa 1ere valeur.

    ⛔ DANGEREUX SANS `sauf` (mesure 2026-08-29). Figer TOUS les calques debranche
    ceux qui accompagnaient un membre sans lui etre parentes : le cone du scanner
    (ind=13, anime en POSITION seule) est reste braque a droite pendant que le bras
    montait. Le fichier restait valide, les frames distinctes, tous les voyants au
    vert -- seul le REGARD l'a vu. Passer dans `sauf` les calques qui doivent garder
    leur geste d'origine."""
    n = 0
    for l in doc["layers"]:
        if l["ind"] in sauf:
            continue
        for champ in ("r", "p", "s", "o"):
            pr = l["ks"].get(champ)
            if isinstance(pr, dict) and pr.get("a") == 1:
                k = pr["k"]
                if k and "s" in k[0]:
                    pr["a"] = 0
                    pr["k"] = k[0]["s"] if len(k[0]["s"]) > 1 else k[0]["s"][0]
                    n += 1
    return n


# Plages MESUREES par balayage sur 15_Customs_Officer (rendu + regard, 2026-08-29).
# Un membre dessine a plat n'a pas de volume : au-dela de sa plage, la manche sort
# de sous le torse et se retrouve en travers de l'avant-bras. Ce n'est PAS un defaut
# de parentage -- c'est le dessin qui n'a jamais ete fait pour cet angle.
PLAGES = {
    "epaule": 25,   # rupture franche a -50 ; -20 est deja au-dela de l'original (-12)
    "coude": 60,    # bien plus tolerant : +20 se lit parfaitement, +40 tient
}


def poser(doc, ind, cles, plage=None):
    """Impose NOS cles de rotation sur un calque. cles = [(frame, degres), ...]

    `plage` (une cle de PLAGES, ou un nombre de degres) avertit si on sort de
    l'amplitude que le dessin supporte."""
    l = next((x for x in doc["layers"] if x["ind"] == ind), None)
    if l is None:
        raise SystemExit("calque ind=%d introuvable" % ind)
    if plage is not None:
        lim = PLAGES.get(plage, plage) if isinstance(plage, str) else plage
        pire = max(abs(d) for _, d in cles)
        if pire > lim:
            print("  ATTENTION calque %d : %.0f deg demandes, plage mesuree %.0f deg"
                  % (ind, pire, lim))
    k = []
    for i, (t, deg) in enumerate(cles):
        cle = {"t": t, "s": [deg]}
        if i < len(cles) - 1:
            # asymetrique : montee vive, retombee molle (lecon du chien)
            cle["i"] = {"x": [0.3], "y": [1]}
            cle["o"] = {"x": [0.7], "y": [0]}
        k.append(cle)
    l["ks"]["r"] = {"a": 1, "k": k, "ix": 10}
    return len(k)


if __name__ == "__main__":
    print(__doc__)
