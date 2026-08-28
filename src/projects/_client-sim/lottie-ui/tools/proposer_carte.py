#!/usr/bin/env python3
"""
Propose une CARTE DE DEPART pour group_layers.py, a partir de la geometrie.

⭐ CE QUE CET OUTIL FAIT, ET CE QU'IL NE FAIT PAS.
`group_layers.py` declare depuis toujours : « CE QUE CA NE FAIT PAS : deviner
l'intention. La carte est fournie par l'humain. » C'est toujours vrai, et ce
script ne le contredit pas : il ne NOMME rien d'utile (il sort `bloc-1`,
`bloc-2`...). Il fait le travail MECANIQUE qui precede le nommage : decider
QUELLES FORMES VONT ENSEMBLE. L'humain (ou un modele de vision) n'a plus qu'a
remplacer les etiquettes en regardant la planche.

⛔ POURQUOI CA MARCHE SANS COMPRENDRE LE DESSIN. Deux regles PUREMENT
GEOMETRIQUES, toutes deux payees sur des cas reels :

1. CONTRE-FORME = une forme claire ENFERMEE dans la boite d'une forme coloree
   qui la precede immediatement. Ce n'est pas une affaire de couleur, c'est un
   ENFERMEMENT. Mesure sur LoadUp : les 4 lettres creuses (o, a, d, p) suivent
   exactement ce motif ; separer une contre-forme de sa lettre BOUCHE le trou
   (le "o" est sorti en disque plein, 0,14 % d'ecart — un chiffre qui passe
   pour bon, defaut vu seulement A L'IMAGE).

2. CONTIGUITE OBLIGATOIRE. L'ordre de peinture est une sequence : un groupe qui
   enjambe des calques devant rester entre ses membres casse le rendu. Mesure
   sur le renard : grouper par NATURE ("tous les elements de blouse") faisait
   passer la blouse AVANT truffe/branches/sourire -> tache noire entre les yeux.
   ⛔ Corollaire : ce script ne produit QUE des blocs contigus. Un nom parlant
   qui casse la sequence est pire qu'un nom terne qui la respecte.

Usage :
    python3 proposer_carte.py scene.json                 # affiche la proposition
    python3 proposer_carte.py scene.json --json          # carte prete a coller
"""

import argparse
import json
import os
import sys


def _sommets_et_couleur(couche):
    """Boite et 1re couleur, A N'IMPORTE QUELLE PROFONDEUR.

    ⛔ PIEGE PAYE 3 FOIS : chercher a un niveau fixe (`shapes[].it[]`) ne trouve
    RIEN sur un fichier deja regroupe, et echoue SILENCIEUSEMENT.
    """
    xs, ys, cols = [], [], []

    def marcher(noeud):
        if isinstance(noeud, dict):
            if noeud.get("ty") == "sh":
                for v in noeud.get("ks", {}).get("k", {}).get("v", []):
                    xs.append(v[0])
                    ys.append(v[1])
            if noeud.get("ty") == "fl":
                k = noeud.get("c", {}).get("k")
                if isinstance(k, list) and len(k) >= 3:
                    cols.append(tuple(round(x * 255) for x in k[:3]))
            for v in noeud.values():
                marcher(v)
        elif isinstance(noeud, list):
            for v in noeud:
                marcher(v)

    marcher(couche.get("shapes", []))
    if not xs:
        return None, None
    return (min(xs), max(xs), min(ys), max(ys)), (cols[0] if cols else None)


def _dedans(petite, grande, marge=0.02):
    """La boite `petite` est-elle contenue dans `grande` ?"""
    if not petite or not grande:
        return False
    ax0, ax1, ay0, ay1 = petite
    bx0, bx1, by0, by1 = grande
    mx = (bx1 - bx0) * marge
    my = (by1 - by0) * marge
    return (ax0 >= bx0 - mx and ax1 <= bx1 + mx
            and ay0 >= by0 - my and ay1 <= by1 + my)


def _clair(col, seuil=225):
    """Une contre-forme est CLAIRE (elle imite le fond)."""
    return col is not None and min(col) >= seuil


# ⭐ Sous ce seuil, une forme est une MIETTE de texture, pas un element du
# dessin. Mesure Tigerwild : mediane 327 px2, plus petite 18 px2 a 2 sommets.
SEUIL_TEXTURE = 400


def _aire(b):
    return (b[1] - b[0]) * (b[3] - b[2]) if b else 0


def proposer(doc):
    """Retourne [(etiquette, [noms]), ...] dans l'ORDRE DE PEINTURE."""
    # `layers` est du dessus vers le dessous : on remet dans l'ordre de peinture.
    couches = list(reversed(doc["layers"]))
    infos = []
    for c in couches:
        b, col = _sommets_et_couleur(c)
        infos.append({"nom": c.get("nm"), "boite": b, "couleur": col})

    if not infos:
        return []

    aire_totale = max((_aire(i["boite"]) for i in infos), default=1) or 1
    par_nom = {i["nom"]: i for i in infos}

    blocs = []
    i = 0
    while i < len(infos):
        cur = infos[i]
        membres = [cur["nom"]]
        # ⭐ Un FOND est plein cadre : il reste seul, il n'avale pas le dessin.
        plein_cadre = _aire(cur["boite"]) >= 0.98 * aire_totale
        if not plein_cadre:
            # CONTRE-FORME = suivante, CLAIRE et ENFERMEE. Les 3 a la fois.
            #
            # ⛔⛔ J'AI ESSAYE DE RELACHER "CLAIRE", ET C'EST PIRE (2026-08-28).
            # Raisonnement : sur le renard, 7 des 8 groupes multi-membres ont des
            # suivants ENFERMES mais COLORES (museau, monture, queue) — donc la
            # clarte semblait etre une coincidence du lettrage. En la retirant,
            # la tete (path-2) a avale 15 calques d'un coup : 31 calques -> 7 blocs,
            # inutilisable. J'ai alors ajoute un plafond de taille (45 % de l'aire
            # porteuse) : AUCUN EFFET — le plus gros avale (le museau) fait 31 %,
            # sous le seuil. ⭐ Ce n'etait donc pas un DOSAGE a trouver mais un
            # PLAFOND DE LA REGLE : sur une mascotte TOUT est contenu dans la
            # tete, l'enfermement ne discrimine rien. Aucun seuil ne repare ca.
            # => On garde la regle SURE (les 3 conditions) et on ASSUME qu'elle
            # ne rend presque rien hors lettrage — l'outil le DIT en sortie.
            j = i + 1
            while j < len(infos):
                suiv = infos[j]
                if not _clair(suiv["couleur"]):
                    break
                if not _dedans(suiv["boite"], cur["boite"]):
                    break
                membres.append(suiv["nom"])
                j += 1
            i = j
        else:
            i += 1
        blocs.append(membres)

    # ⛔⛔ PAS DE FUSION PAR CHEVAUCHEMENT — testee, puis RETIREE le 2026-08-28.
    # J'avais ajoute une regle "deux blocs voisins qui se chevauchent et sont de
    # taille comparable decrivent le meme objet". MESURE sur LoadUp : elle se
    # trompait DANS LES DEUX SENS.
    #   - FAUX POSITIF : la fleche (x1097..1270) et le "p" (x1245..1333) se
    #     chevauchent de 25x95 px et ont des aires proches -> fusionnes a tort,
    #     alors que ce sont deux objets sans rapport.
    #   - FAUX NEGATIF : les 4 fragments du symbole (R) ont des aires de 1017 a
    #     67 (rapport 1 a 15) -> non fusionnes, alors qu'ils sont UN symbole.
    # ⭐ REGLE RETENUE : proposer des blocs SURS mais parfois TROP FINS. Un
    # humain fusionne deux blocs en une seconde ; il ne devine pas qu'il faut en
    # SEPARER un. Sur-decouper est recuperable, sous-decouper ne l'est pas.
    # ⭐ REGROUPER LA TEXTURE (ajout 2026-08-28, mesure sur Tigerwild).
    # Un logo au trait VIEILLI se fragmente : sur 505 calques, 285 (56 %) font
    # moins de 400 px2 et 2 a 5 sommets — ce sont les ECLATS de la texture usee,
    # pas des elements du dessin. Aucun nom sematique n'a de sens sur une miette.
    # ⛔ On ne les groupe QUE par SUITES CONTIGUES : la contiguite ne se negocie
    # pas (cf. la tache noire du renard). Mesure : 95 suites -> 505 devient 315.
    fusionnes = []
    for bloc in blocs:
        petit = all(_aire(par_nom[n]["boite"]) < SEUIL_TEXTURE
                    for n in bloc if par_nom.get(n))
        if petit and fusionnes and fusionnes[-1][1]:
            fusionnes[-1] = (fusionnes[-1][0] + bloc, True)
        else:
            fusionnes.append((bloc, petit))

    out = []
    n_tex = 0
    for membres, petit in fusionnes:
        if petit and len(membres) > 1:
            n_tex += 1
            out.append((f"texture-{n_tex}", membres))
        else:
            out.append((None, membres))
    # numeroter les blocs non-texture
    n = 0
    final = []
    for etiquette, membres in out:
        if etiquette is None:
            n += 1
            etiquette = f"bloc-{n}"
        final.append((etiquette, membres))
    return final


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("--json", dest="sortie_json", action="store_true",
                    help="carte prete a coller dans group_layers.py")
    a = ap.parse_args()

    doc = json.loads(open(a.json, encoding="utf-8").read())
    blocs = proposer(doc)

    if a.sortie_json:
        print('    "%s": {' % os.path.splitext(os.path.basename(a.json))[0])
        print('        "_ordre": [%s],'
              % ", ".join('"%s"' % e for e, _ in blocs))
        for etiquette, membres in blocs:
            print('        "%s": {"noms": [%s]},'
                  % (etiquette, ", ".join('"%s"' % n for n in membres)))
        print("    },")
        return 0

    print("%s : %d calques -> %d bloc(s) proposes\n"
          % (os.path.basename(a.json), len(doc["layers"]), len(blocs)))
    for etiquette, membres in blocs:
        print("   %-9s %s" % (etiquette, " ".join(membres)))
    gain = 1 - len(blocs) / max(1, len(doc["layers"]))
    print("\n⭐ Blocs GEOMETRIQUEMENT surs : contigus, contre-formes rattachees.")
    print("   Il reste a les NOMMER — regarder la planche de planche_calques.py")
    print("   et remplacer 'bloc-N' par ce qu'on y voit.")
    if gain < 0.15:
        print("\n⚠️  RENDEMENT FAIBLE (%.0f %% de calques en moins)." % (gain * 100))
        print("   Attendu hors LETTRAGE : la regle de contre-forme suppose un")
        print("   detail ENFERME et CLAIR (le trou d'un 'o'). Une mascotte")
        print("   JUXTAPOSE ses elements au lieu de les emboiter — mesure sur le")
        print("   renard : 29 blocs pour 31 calques. Le regroupement reste alors")
        print("   MANUEL, en croisant forme + couleur + position sur la planche.")
    else:
        print("\n   Rendement : %.0f %% de calques en moins." % (gain * 100))
    return 0


if __name__ == "__main__":
    sys.exit(main())
