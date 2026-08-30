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
import json, pathlib, sys
sys.path.insert(0, '/Users/clawdbot/Workspace/remotion/src/projects/_client-sim/lottie-ui/tools')
from animate_scene import animer, cercle, calque_forme, PARTITIONS


ASSETS_IMG = []          # assets image, partages entre tous les calques


def portrait_calque(nom, cx, cy, r):
    """Le portrait photo du medaillon, en asset image Lottie.

    ⭐ Rendu possible par le portage des <image> (2026-08-30). Le composant le
    detoure dans un clipPath circulaire ; ici la photo est simplement posee au
    diametre du medaillon -- le detourage exact demanderait un track matte, et
    l'ecart visuel a cette taille ne le justifie pas.
    ⚠️ L'image est redimensionnee a sa taille d'AFFICHAGE : 1024x1024 pour un
    disque de 60 px, c'est 3 Ko au lieu de 1504.
    """
    import base64
    import io
    from PIL import Image

    src = pathlib.Path('/Users/clawdbot/Workspace/remotion/public/'
                       '_shared/sprites/warmap/portrait-rsf.png')
    n = int(r * 2 * 2)                      # x2 : confort sur ecran dense
    im = Image.open(src).convert("RGBA").resize((n, n), Image.LANCZOS)
    tampon = io.BytesIO()
    im.save(tampon, "PNG", optimize=True)
    uri = "data:image/png;base64," + base64.b64encode(tampon.getvalue()).decode()
    if not any(a["id"] == "img_portrait" for a in ASSETS_IMG):
        # les 3 colonnes portent LA MEME photo : un seul asset, partage.
        ASSETS_IMG.append({"id": "img_portrait", "w": n, "h": n, "u": "",
                           "p": uri, "e": 1})
    return {"ddd": 0, "ty": 2, "nm": nom, "refId": "img_portrait", "st": 0,
            "ip": 0, "op": DUREE,
            "ks": {"a": {"a": 0, "k": [0, 0, 0]},
                   "p": {"a": 0, "k": [cx - r, cy - r, 0]},
                   "s": {"a": 0, "k": [100.0 * 2 * r / n, 100.0 * 2 * r / n, 100]},
                   "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}}}


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
IVOIRE= [0.949, 0.922, 0.851, 1]     # #f2ebd9

RSF = (1750, 940)
CIBLES = {
    "aeroport": (1280, 820),
    "palais":   (1020, 560),
    "tourtv":   (580, 340),
}
neufs = []


def bezier_ks(a, b, bow=0.12):
    """La Bezier quadratique RSF -> cible, en sommets Lottie.

    ⚠️ Lottie n'a que des courbes CUBIQUES : une quadratique se convertit
    exactement (les 2 controles cubiques sont a 2/3 du controle quadratique).
    Ce n'est pas une approximation, c'est une identite.
    """
    mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * bow
    my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * bow
    c1 = [a[0] + 2 / 3 * (mx - a[0]), a[1] + 2 / 3 * (my - a[1])]
    c2 = [b[0] + 2 / 3 * (mx - b[0]), b[1] + 2 / 3 * (my - b[1])]
    return {"c": False, "v": [list(a), list(b)],
            "i": [[0, 0], [round(c2[0] - b[0], 2), round(c2[1] - b[1], 2)]],
            "o": [[round(c1[0] - a[0], 2), round(c1[1] - a[1], 2)], [0, 0]]}


def pointe(cx, cy, angle_deg):
    """La pointe qui se plante sur l'objectif : polygone du composant V5.

    Points recopies tels quels (`0,0 -34,-13 -22,0 -34,13`), pivotes vers la
    cible -- c'est une fleche, elle a un « avant ».
    """
    import math
    a = math.radians(angle_deg)
    ca, sa = math.cos(a), math.sin(a)
    pts = [(0, 0), (-34, -13), (-22, 0), (-34, 13)]
    v = [[round(cx + x * ca - y * sa, 2), round(cy + x * sa + y * ca, 2)]
         for x, y in pts]
    return {"c": True, "v": v, "i": [[0, 0]] * 4, "o": [[0, 0]] * 4}


for nom, (cx, cy) in CIBLES.items():
    # ⭐ LA TRACE DU CHEMIN PARCOURU — l'element qui manquait le plus.
    # Sans elle on voit un objet qui se DEPLACE ; avec elle on voit une avancee
    # qui MARQUE le territoire. Le composant d'origine la dessine en ivoire
    # 2,4 px / opacite 0,85, revelee par strokeDashoffset synchronise sur la
    # progression : `trace` (trimPath) en est l'equivalent Lottie natif.
    neufs.append(calque_forme(f"trajet-{nom}", bezier_ks(RSF, (cx, cy)),
                              contour=IVOIRE, largeur=2.4, duree=DUREE))
    # la pointe qui se plante a l'arrivee, orientee vers la cible
    import math
    ang = math.degrees(math.atan2(cy - RSF[1], cx - RSF[0]))
    neufs.append(calque_forme(f"pointe-{nom}", pointe(cx, cy, ang),
                              remplissage=RED, duree=DUREE))
    # la colonne : un jeton losange qui part de la base
    # ⭐⭐ LE MEDAILLON PHOTO, pas un losange. Le composant tourne en mode
    # `portrait-formation` (TOKEN_ENRICHMENT ligne 149) : ses colonnes sont des
    # MEDAILLONS -- cercle ivoire borde de rouge, portrait detoure dedans
    # (RsfPortraitCircle). Le losange etait un pis-aller de ma part, adopte
    # quand les <image> ne traversaient pas la chaine.
    # ⚠️ Taille calee sur la V5 : sa note de version dit "jetons RSF agrandis"
    # apres la critique "jetons illisibles" — le defaut a deja ete paye une fois.
    R_MED = 30
    neufs.append(calque_forme(f"colonne-{nom}", cercle(RSF[0], RSF[1], R_MED),
                              remplissage=IVOIRE, contour=RED,
                              largeur=R_MED * 0.16, duree=DUREE))
    neufs.append(portrait_calque(f"colonne-{nom}-photo", RSF[0], RSF[1], R_MED))
    # l'onde d'impact : 2 anneaux, comme la scene d'origine
    for i, (r, coul, ep) in enumerate(((130, RED, 4), (150, AMBRE, 2.5))):
        neufs.append(calque_forme(f"impact-{nom}-{i}", cercle(cx, cy, r),
                                  contour=coul, largeur=ep, duree=DUREE))
    # la fumee : 3 volutes decalees -> colonne continue
    for i in range(3):
        neufs.append(calque_forme(f"fumee-{nom}-{i}",
                                  cercle(cx, cy - 10, 26),
                                  remplissage=FUMEE, duree=DUREE))

doc.setdefault('assets', []).extend(ASSETS_IMG)
doc['layers'] = neufs[::-1] + doc['layers']
for i, c in enumerate(doc['layers']):
    c['ind'] = i

part = dict(PARTITIONS['khartoum'])
# les volutes decalees dans le temps : c'est le decalage qui fait la colonne
# la trace se dessine EXACTEMENT pendant que la colonne avance : meme bornes
# que le `parcourt` correspondant, sinon le trait devance ou suit le jeton.
for nom, (d0, d1) in (("aeroport", (40, 170)), ("palais", (240, 370)),
                      ("tourtv", (440, 570))):
    part[f"trajet-{nom}"] = ("trace", d0, d1)
    # la pointe apparait a l'arrivee, pas avant
    part[f"pointe-{nom}"] = ("fondu", d1 - 12, d1)

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
