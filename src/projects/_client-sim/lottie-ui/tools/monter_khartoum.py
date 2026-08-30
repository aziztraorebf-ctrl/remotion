#!/usr/bin/env python3
"""Monte la piece Khartoum : decor converti + acteurs fabriques + partition.

⭐ POURQUOI CE SCRIPT EXISTE, et ce qu'il enseigne pour la suite.
Une conversion frame-unique ne contient QUE ce qui existe a cette frame. Une
scene narrative -- colonnes en transit, ondes d'impact, fumees -- a des acteurs
qui NAISSENT plus tard : ils sont donc absents du fichier converti. Animer la
scene telle quelle revient a faire apparaitre un decor, pas a raconter l'assaut.
On fabrique donc les acteurs manquants, avec les valeurs RECOPIEES du composant
Remotion d'origine (positions, rayons, couleurs, Beziers) -- jamais inventees.

⛔ LA FRAME DE DEPART N'EST PAS LA FRAME 0. Celle-ci porte `opacity="0"` sur le
groupe racine (le fondu d'ouverture) : le fichier converti est alors une image
NOIRE, et tout ce qu'on empile dessus flotte sur du vide. Pris pour "le decor
sans les acteurs", il a coute une passe complete. On part de la frame 38, apres
l'etablissement et avant le premier assaut.

Usage :
    python3 monter_khartoum.py        # ecrit khartoum-anime.json
"""
import json, sys
sys.path.insert(0, '/Users/clawdbot/Workspace/remotion/src/projects/_client-sim/lottie-ui/tools')
from animate_scene import animer, cercle, calque_forme, PARTITIONS


def losange(cx, cy, r):
    """Le pion losange RSF — marqueur de possession, choisi par Aziz (V8).

    Ce n'est pas une decoration : le losange DIT "tenu par la RSF". Un cercle
    a sa place ferait lire la scene autrement.
    """
    v = [[cx, cy - r], [cx + r * 0.72, cy], [cx, cy + r], [cx - r * 0.72, cy]]
    return {"c": True, "v": v, "i": [[0, 0]] * 4, "o": [[0, 0]] * 4}

BASE = '/Users/clawdbot/Workspace/remotion/out/_r-and-d/lottie-khartoum/'
doc = json.load(open(BASE + 'khartoum-scene.json'))
DUREE = 750
doc['op'] = DUREE
for c in doc['layers']:
    c['op'] = DUREE

# couleurs du composant d'origine
RED   = [0.541, 0.165, 0.125, 1]     # #8a2a20
AMBRE = [0.749, 0.580, 0.259, 1]     # #bf9442
JETON = [0.863, 0.663, 0.369, 1]     # #dca95e
FUMEE = [0.420, 0.361, 0.259, 1]     # #6b5c42

RSF = (1750, 940)
CIBLES = {
    "aeroport": (1280, 820),
    "palais":   (1020, 560),
    "tourtv":   (580, 340),
}
neufs = []

for nom, (cx, cy) in CIBLES.items():
    # la colonne : un jeton losange qui part de la base
    # ⚠️ Taille calee sur la V5 du composant : sa note de version dit
    # explicitement "jetons RSF agrandis + recolores" apres la critique
    # "jetons illisibles". Un jeton de r=14 sur une carte 1920 est invisible --
    # le defaut avait deja ete paye une fois, ne pas le refaire.
    col = calque_forme(f"colonne-{nom}", losange(RSF[0], RSF[1], 30),
                       remplissage=JETON, contour=RED, largeur=4, duree=DUREE)
    neufs.append(col)
    # l'onde d'impact : 2 anneaux, comme la scene d'origine
    for i, (r, coul, ep) in enumerate(((130, RED, 4), (150, AMBRE, 2.5))):
        neufs.append(calque_forme(f"impact-{nom}-{i}", cercle(cx, cy, r),
                                  contour=coul, largeur=ep, duree=DUREE))
    # la fumee : 3 volutes decalees -> colonne continue
    for i in range(3):
        neufs.append(calque_forme(f"fumee-{nom}-{i}",
                                  cercle(cx, cy - 10, 26),
                                  remplissage=FUMEE, duree=DUREE))

doc['layers'] = neufs[::-1] + doc['layers']
for i, c in enumerate(doc['layers']):
    c['ind'] = i

part = dict(PARTITIONS['khartoum'])
# les volutes decalees dans le temps : c'est le decalage qui fait la colonne
for nom, t0 in (("aeroport", 178), ("palais", 378), ("tourtv", 578)):
    for i in range(3):
        part[f"fumee-{nom}-{i}"] = ("monte", t0, DUREE, 58, 66, i * 22)
    for i in range(2):
        part[f"impact-{nom}-{i}"] = ("onde", t0 - 8, t0 + 62, 12.0, 55, i * 12)

animes, ignores = animer(doc, part)
json.dump(doc, open(BASE + 'khartoum-anime.json', 'w'), separators=(',', ':'))
print(f"animes={animes} ignores={ignores}  calques={len(doc['layers'])}")
import os
print(f"{os.path.getsize(BASE+'khartoum-anime.json')/1024:.0f} Ko")
