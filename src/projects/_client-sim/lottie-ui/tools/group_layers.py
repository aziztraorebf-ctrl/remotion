#!/usr/bin/env python3
"""
Regroupe les calques d'un Lottie par INTENTION, au lieu d'une liste plate.

⭐ POURQUOI (constat d'Aziz dans Creator, 2026-08-25) : notre hook Soudan
sort 71 calques nommes "ellipse-71", "rect-67", "circle-63". Il a essaye de
cliquer dessus : "il ne semblait pas se passer grand chose". Normal --
"ellipse-68" est un fragment de nuage de quelques pixels, il n'offre aucune
prise. Le probleme n'est PAS le nombre (une app web s'en moque), c'est que
les calques NE VEULENT RIEN DIRE.

Point de comparaison mesure : notre piece LCD validee par un vrai client fait
3 calques ; la reference que ce client citait lui-meme pesait 1 400 octets et
son brief exigeait "limited layers and keyframes" (ecran embarque). Pour ce
type de cible, 71 calques sont redhibitoires ; pour un site web, non. Mais
des noms illisibles genent DANS TOUS LES CAS.

CE QUE FAIT CE SCRIPT : fusionne les calques en groupes nommes selon une
carte {nom_du_groupe: [motifs]}, en respectant l'ordre de peinture. Un groupe
Lottie peut contenir d'autres groupes (verifie sur la spec officielle : "A
group is a shape that can contain other shapes, including other groups"), et
"doit toujours se terminer par un Transform".

⛔ CE QUE CA NE FAIT PAS : deviner l'intention. Les groupes du SVG source
n'ont pas d'id (nos composants React portent l'intention dans des VARIABLES :
plantDust, lingotGlow, cartoucheOn). La carte est donc fournie par l'humain
-- c'est un choix de realisation, pas une deduction.

Usage :
    python3 group_layers.py scene.json --carte soudan -o scene-groupee.json
"""

import argparse
import json
import os
import sys

# --- Cartes de regroupement ---------------------------------------------------
# Chaque entree : nom du groupe -> liste d'indices ou de motifs de noms.
# L'ordre compte : c'est l'ordre de PEINTURE (le 1er groupe est peint dessous).
CARTES = {
    # Hook "Or du Darfour" — carte etablie en MESURANT la position, la taille
    # et la couleur de chaque calque (pas en devinant des tranches d'indices) :
    #   0-2   aplats plein cadre 1928x763+ = le ciel et l'horizon
    #   3-13  ellipses concentriques + traits autour de (1506,194) = le soleil
    #   14    aplat rouge sombre plein cadre = voile d'ambiance
    #   15-26 formes larges et plates a y=204-347 = les nuages
    #   27-42 bandes horizontales plein cadre y=669-967 = le sol et ses stries
    #   43-44 ellipses aplaties sous le lingot = son ombre portee
    #   45-62 polygones + eclats autour de (990,650) = le lingot et ses reflets
    #   63-70 rects de bord + grandes ellipses hors cadre = le VIGNETTAGE
    #         (⭐ c'est LUI qui produisait les "bandes verticales sombres"
    #          signalees par Aziz : revele dans le desordre par ma cascade)
    "soudan": {
        "_ordre": ["ciel", "soleil", "ambiance", "nuages", "sol",
                   "ombre", "lingot", "vignettage"],
        "ciel": {"indices": range(0, 3)},
        "soleil": {"indices": range(3, 14)},
        "ambiance": {"indices": range(14, 15)},
        "nuages": {"indices": range(15, 27)},
        "sol": {"indices": range(27, 43)},
        "ombre": {"indices": range(43, 45)},
        "lingot": {"indices": range(45, 63)},
        "vignettage": {"indices": range(63, 200)},
    },

    # Gazoduc Acte 4 "Objectifs" (frame 120) — carte etablie en MESURANT
    # couleur, taille et position de chacun des 108 elements, jamais en
    # devinant des tranches (methode Soudan). Les familles sautent aux yeux
    # une fois mesurees, et PAS avant :
    #   0-75    tous en fill (0.09,0.19,0.31) = la carte de fond, pays neutres
    #   76-81   fill (0.18,0.62,0.83) bleu clair, par paires fill+stroke
    #           = les 3 pays CONCERNES (Maroc, Algerie, Nigeria)
    #   82-83   stroke or (1.0,0.78,0.26), 4 et 24 points = LE GAZODUC
    #   84-101  six triplets identiques (trait or + trait clair + cercle
    #           creme de 6 px) = les jalons/etapes du trace
    #   102-107 rect sombre a bord bleu + son texte = les 3 cartouches
    # ⭐ Ces groupes sont ceux qu'on ANIME : le trace se dessine, les jalons
    # s'allument, les cartouches apparaissent. Le fond, lui, ne bouge pas.
    "gazoduc-a4": {
        "_ordre": ["carte-fond", "pays-concernes", "gazoduc-trace",
                   "jalons", "cartouches"],
        "carte-fond": {"indices": range(0, 76)},
        "pays-concernes": {"indices": range(76, 82)},
        "gazoduc-trace": {"indices": range(82, 84)},
        "jalons": {"indices": range(84, 102)},
        "cartouches": {"indices": range(102, 200)},
    },
}


def collecter_formes(couche):
    """Extrait les shapes d'un calque, sans son transform de groupe final."""
    out = []
    for groupe in couche.get("shapes", []):
        out.append(groupe)
    return out


def tr_neutre():
    """Transform identite — un groupe Lottie DOIT se terminer par un Transform."""
    return {"ty": "tr", "nm": "transform",
            "a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
            "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
            "o": {"a": 0, "k": 100}}


def regrouper(doc, carte):
    """
    Fusionne les calques en groupes nommes. Retourne (doc, rapport).

    ⚠️ L'ordre de peinture doit etre preserve : dans un calque Lottie, le
    PREMIER groupe de la liste est peint EN DERNIER (leçon deja payee sur les
    contours). On construit donc les groupes dans l'ordre inverse de l'ordre
    de peinture souhaite.
    """
    couches = doc["layers"]
    n = len(couches)

    # Les calques sont deja en ordre inverse de peinture (indice 0 = au-dessus).
    # On repasse en ordre de peinture pour raisonner simplement.
    peinture = list(reversed(couches))

    # ⛔ Un calque TEXTE NATIF (ty:5) n'a pas de "shapes" : il porte un
    # TextDocument. Le fondre dans un groupe de formes le SUPPRIMERAIT en
    # silence -- exactement le piege que tout cet outillage cherche a eviter.
    # On les met de cote et on les remet au-dessus, intacts et editables.
    natifs = [c for c in peinture if c.get("ty") == 5]
    peinture = [c for c in peinture if c.get("ty") != 5]

    attribue = {}
    for nom_groupe in carte["_ordre"]:
        regle = carte[nom_groupe]
        idx = set(regle["indices"]) if "indices" in regle else set()
        motifs = regle.get("motifs", [])
        for i, c in enumerate(peinture):
            if i in attribue:
                continue
            if i in idx or any(m.lower() in c["nm"].lower() for m in motifs):
                attribue[i] = nom_groupe

    rapport = {}
    groupes = {}
    for i, c in enumerate(peinture):
        nom = attribue.get(i, "divers")
        groupes.setdefault(nom, []).append(c)
        rapport[nom] = rapport.get(nom, 0) + 1

    # Un calque par groupe, contenant tous les shapes de ses membres.
    ordre = [g for g in carte["_ordre"] if g in groupes]
    ordre += [g for g in groupes if g not in ordre]

    nouvelles = []
    for rang, nom in enumerate(ordre):
        membres = groupes[nom]
        it = []
        # dans le calque, on inverse : premier de la liste = peint en dernier
        for c in reversed(membres):
            for g in collecter_formes(c):
                g = dict(g)
                g["nm"] = c["nm"]          # garde la trace de l'element d'origine
                it.append(g)
        nouvelles.append({
            "ddd": 0, "ty": 4, "ind": rang, "nm": nom, "st": 0,
            "ip": couches[0].get("ip", 0), "op": doc.get("op", 60),
            "ks": {"a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                   "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                   "o": {"a": 0, "k": 100}},
            "shapes": [{"ty": "gr", "nm": nom, "it": it + [tr_neutre()]}],
        })

    # Les calques texte natifs reprennent leur place, au-dessus des groupes :
    # ils restent selectionnables et editables un par un dans Creator.
    nouvelles.extend(natifs)
    if natifs:
        rapport["(texte natif, garde intact)"] = len(natifs)

    # remettre en ordre d'affichage Lottie (indice 0 au-dessus)
    nouvelles.reverse()
    for i, c in enumerate(nouvelles):
        c["ind"] = i
    doc["layers"] = nouvelles
    return doc, rapport


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("--carte", required=True, help=f"une de : {', '.join(CARTES)}")
    ap.add_argument("-o", "--out")
    a = ap.parse_args()

    if a.carte not in CARTES:
        print(f"carte inconnue : {a.carte}", file=sys.stderr)
        return 2

    doc = json.load(open(a.json, encoding="utf-8"))
    avant = len(doc["layers"])
    doc, rapport = regrouper(doc, CARTES[a.carte])

    sortie = a.out or os.path.splitext(a.json)[0] + "-groupe.json"
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"))

    print(f"{os.path.basename(sortie)} : {avant} calques -> {len(doc['layers'])}")
    for nom, n in rapport.items():
        print(f"   {nom:14} {n:3} elements")
    print(f"   ({os.path.getsize(sortie)/1024:.1f} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
