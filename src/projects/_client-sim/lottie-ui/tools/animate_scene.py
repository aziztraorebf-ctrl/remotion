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
  - "respire": oscillation lente et faible, EN BOUCLE -> ks.s
               ("respire", debut, fin, ampleur_%, periode_frames)
  - "balance": rotation alternee, ancree au POINT D'ATTACHE -> ks.r
               ("balance", debut, fin, angle, periode, ancre_y)
               ⛔ ancre_y : 0 = HAUT de la bbox, 1 = BAS (axe Y Lottie descendant).
  - "cligne" : les yeux se ferment 2 frames, periodiquement -> ks.o
               ("cligne", debut, fin, periode_frames)
  ⭐ Ces 3 primitives font la BOUCLE DE VIE : sans elles une mascotte apparait
  puis reste FIGEE le reste de la piece. Elles ne demandent AUCUN rigging.
  - "geste3" : monte haut -> SUSPEND -> retombe    -> ks.p (position) + ks.s
               Le geste en 3 temps de FICHE-GESTE-ANIME : la suspension cree
               une ATTENTE, la chute la resout. Regle a 4 reperes au lieu de 3 :
               ("geste3", f_depart, f_haut, f_fin_suspension, f_impact, hauteur).
               ⛔ Ce n'est PAS un ressort : le depassement d'un spring est une
               consequence physique, il ne raconte rien. Ici la pause est ECRITE.

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
    # ── GABARIT CARTE D'ETAT-MAJOR — la scene se CONSTRUIT ────────────────────
    # ⭐ Bornes RECOPIEES de EtatMajorGptAnimee (les `prog(frame, a, b)` du
    # composant), jamais inventees : fond 0-25, villes 20-45 (decalees de 5),
    # zone ouest 40-62, zone est 48-70, fleche nord 60-95, fleche sud 95-130,
    # boussole+legende 30-50, pointes a 88-96 et 123-131.
    #
    # ⭐⭐ POURQUOI CETTE SCENE ET PAS UNE AUTRE : elle est GENERIQUE. Ses
    # elements s'appellent alpha, bravo, charlie, west, east -- aucune
    # geographie reelle, aucun contexte politique. C'est un GABARIT : un
    # acheteur y met son propre territoire. Et son format tombe pile dans le
    # corpus qui se vend (1024 CARRE, 4,4 s) la ou nos scenes narratives font
    # 25 s en 16:9.
    "gabarit-carte": {
        "_duree": 140,
        # le medaillon et son cadre sont la des le debut : ils EN sont le support
        "staff-map-medallion": ("aucun", 0, 0),
        "rim": ("aucun", 0, 0),
        # le fond se pose
        "bg-grid": ("fondu", 0, 25),
        "terrain": ("fondu", 0, 25),
        # les 3 villes POPent, decalees de 5 frames comme dans le composant
        "city-alpha": ("pop", 20, 45),
        "city-bravo": ("pop", 25, 50),
        "city-charlie": ("pop", 30, 55),
        # ⭐ les zones se REMPLISSENT par balayage : c'est le pochoir qui grandit
        "g-17-pochoir": ("balaye", 40, 62, "haut"),
        "g-22-pochoir": ("balaye", 48, 70, "haut"),
        "control-zone-west": ("fondu", 38, 44),
        "control-zone-east": ("fondu", 46, 52),
        # les fleches se TRACENT, l'une apres l'autre.
        # ⛔ La POINTE ne se trace pas, elle APPARAIT quand le trait arrive --
        # sinon on voit un triangle rouge flotter au bout d'une fleche qui
        # n'existe pas encore (defaut vu a l'oeil sur le 1er rendu : les
        # pointes etaient la des la frame 30). Le composant fait exactement
        # cela : `headN = prog(frame, 88, 96)`, `headS = prog(frame, 123, 131)`.
        # Les pointes sont les calques -3 (44x57) ; les autres sont les traits.
        "maneuver-arrow-north-3": ("fondu", 88, 96),
        "maneuver-arrow-south-3": ("fondu", 123, 131),
        "maneuver-arrow-north": ("trace", 60, 95),
        "maneuver-arrow-south": ("trace", 95, 130),
        # l'appareillage de lecture accompagne, il ne raconte pas
        "compass": ("fondu", 30, 50),
        "legend": ("fondu", 30, 50),
        "*": ("fondu", 0, 25),
    },

    # ── KHARTOUM — l'assaut coordonne du 15 avril 2023 ────────────────────────
    # ⭐ Recopiee de la SEQUENCE du composant Remotion (KhartoumEtatMajorSVG) :
    # etablissement 0-40, puis TROIS phases de 200 frames, jamais simultanees
    # (doctrine DECISION-jetons-vs-vehicules) : aeroport 40-240, palais 240-440,
    # tour TV 440-640, resolution 640-750. L'impact tombe 130 frames apres le
    # depart de chaque colonne (CONTACT_OFFSET).
    #
    # ⛔ Les trajets ne sont pas dessines a vue : ce sont les Beziers EXACTES du
    # composant, recalculees depuis RSF_ORIGIN (1750,940), les 3 positions de
    # cible et le bombement 0,12 de `bezierMid`. Une trajectoire inventee
    # traverserait le Nil n'importe ou -- le franchissement est un point
    # verifie de la scene d'origine.
    #
    # ⚠️ A poser sur la frame 0 (l'etablissement) : une frame plus tardive
    # contient deja les sceaux de capture, donc l'histoire serait racontee
    # deux fois.
    "khartoum": {
        "_duree": 750,
        # le decor est la des le debut : il ne s'anime pas, il EST le terrain
        "terrain": ("aucun", 0, 0),
        "river": ("aucun", 0, 0),
        "frame": ("aucun", 0, 0),
        "background": ("aucun", 0, 0),
        "registration-marks": ("fondu", 0, 40),
        # les 3 objectifs se revelent pendant l'etablissement
        "target-airport": ("fondu", 8, 34),
        "target-palace": ("fondu", 14, 40),
        "target-tower": ("fondu", 20, 46),
        "pictogram": ("fondu", 8, 34),
        "def-avion": ("fondu", 8, 34),
        # la base RSF, d'ou tout part
        "staging-rsf": ("fondu", 24, 50),
        # ⭐ LES TROIS ASSAUTS — une colonne par phase, jamais deux ensemble.
        # (Les jetons sont dessines A LA BASE : le trajet va donc de l'origine
        # vers la cible, dans ce sens.)
        "colonne-aeroport": ("parcourt", 40, 170,
                             "M1750 940 Q 1501 936 1280 820"),
        "colonne-palais": ("parcourt", 240, 370,
                           "M1750 940 Q 1339 838 1020 560"),
        "colonne-tourtv": ("parcourt", 440, 570,
                           "M1750 940 Q 1093 780 580 340"),
        # les impacts, a l'arrivee de chaque colonne
        "impact-aeroport": ("onde", 170, 240, 12.0, 55),
        "impact-palais": ("onde", 370, 440, 12.0, 55),
        "impact-tourtv": ("onde", 570, 640, 12.0, 55),
        # la fumee persiste sur chaque cible detruite, jusqu'a la fin
        "fumee-aeroport": ("monte", 178, 750, 58, 66),
        "fumee-palais": ("monte", 378, 750, 58, 66),
        "fumee-tourtv": ("monte", 578, 750, 58, 66),
        # les libelles et le cartouche accompagnent, ils ne racontent pas
        "*": ("fondu", 0, 30),
    },

    "maison": {
        "_duree": 300,
        "rect": ("aucun", 0, 0),        # le fond reste pose des la 1re frame
        "house": ("trace", 0, 58),
        "heating": ("fondu", 55, 80),
        "flame": ("pop", 70, 92),
        "link": ("trace", 88, 118),
        "chart": ("trace", 118, 280),
    },
    # Hook "Or du Darfour", sur les groupes NOMMES (cf. group_layers.py).
    # ⭐ Le vignettage est pose des la 1re frame et JAMAIS anime : c'est un
    # cadre, pas un element narratif. Le reveler en cascade produisait les
    # "bandes verticales sombres" signalees par Aziz.
    "soudan": {
        "_duree": 150,
        "ciel": ("aucun", 0, 0),          # le decor est la des le debut
        "vignettage": ("aucun", 0, 0),    # cadre : jamais anime
        "ambiance": ("aucun", 0, 0),
        "soleil": ("pop", 8, 40),
        "nuages": ("fondu", 20, 55),
        "sol": ("fondu", 30, 62),
        "ombre": ("fondu", 62, 84),
        "lingot": ("pop", 66, 96),
    },
    # ⭐⭐ Gazoduc Acte 4 "Objectifs" — LA SCENE DENSE (108 elements -> 5 groupes
    # par group_layers.py --carte gazoduc-a4). C'est le pas qui manquait :
    # l'animation n'avait ete prouvee que sur 24 calques (maison) et 8 groupes
    # (Soudan), jamais sur une scene de cette densite.
    #
    # ⛔ LES BORNES NE SONT PAS INVENTEES : elles sont RECOPIEES du composant
    # Remotion d'origine (GazoducActe4Objectifs.tsx), ou chaque repere porte le
    # mot de la voix off qui le declenche -- trMaroc S(0.3)->S(1.5), trNigeria
    # S(0.9)->S(2.1), trAlgerie S(1.5)->S(2.7), puis les remplissages decales
    # (flMaroc S(1.1)->S(2.3)...). A 30 fps, S(x) = 30x. On garde la CASCADE
    # pays par pays : c'est elle qui raconte "le projet traverse trois pays",
    # et non trois pays qui s'allument ensemble.
    #
    # Le fond de carte ne s'anime PAS : c'est le decor, pas le recit (meme
    # raison que le vignettage du Soudan -- l'animer produit du bruit).
    "gazoduc-a4": {
        "_duree": 150,
        "carte-fond": ("aucun", 0, 0),        # decor : pose des la 1re frame
        "pays-concernes": ("fondu", 9, 81),   # S(0.3) -> S(2.7), la cascade
        "gazoduc-trace": ("trace", 45, 135),  # le tuyau SE DESSINE, il n'apparait pas
        "jalons": ("pop", 100, 140),          # les etapes s'allument apres le trace
        "cartouches": ("fondu", 110, 145),    # les noms nomment ce qu'on voit deja
    },
    # Revelation generique : tout apparait EN MEME TEMPS. Utile pour un test
    # de tuyauterie, pauvre comme demonstration.
    # ⭐ Logo LoadUp — PORTAGE DE L'ANIMATION REMOTION (LoadUpAnime.tsx).
    # Valeurs REPRISES du fichier source, pas re-inventees :
    #   lettres  spring d'apparition            -> fondu 0-25
    #   fleche   3 temps 12/30/38/46, HAUT=-95  -> geste3 (le point focal)
    #   p        fondu 50-62      marque  fondu 62-76
    # ⛔ Les lettres sont des groupes SEPARES dans le fichier (plus editable pour
    # le client) mais recoivent LE MEME timing : dans Remotion elles forment un
    # seul <g> exprès — les faire cascader volerait l'attention a la fleche.
    # Regle du POINT FOCAL UNIQUE : on anime ce qui porte le sens, pas tout.
    "loadup": {
        "_duree": 150,
        "fleche-up": ("geste3", 12, 30, 38, 46, 95),
        "lettre-p": ("fondu", 50, 62),
        "marque-deposee": ("fondu", 62, 76),
        "lettre-": ("fondu", 0, 25),
        "fond": ("aucun", 0, 0),
    },
    # -- Logo RENARD VETERINAIRE -> REGISTRE DIFFERENT DE LOADUP (mascotte).
    # ⭐ LoadUp = un geste unique et brutal (chute + impact) sur un logotype.
    # Une mascotte n'a pas de "sens directionnel" a jouer : elle doit PARAITRE
    # VIVANTE. Le geste est donc une PRESENCE qui s'installe, pas un impact.
    # POINT FOCAL = le STETHOSCOPE : c'est l'objet qui dit le metier (veterinaire).
    # Il arrive en dernier et en "pop" — tout le reste se pose avant, en fondu.
    # ⛔ Pas de cascade sur les 6 formes des yeux : elles forment UN regard, les
    # faire entrer separement ferait loucher la mascotte.
    "renard": {
        "_duree": 150,
        # --- 1er temps : la presence s'installe (f0-70) ---
        "stethoscope": ("pop", 46, 70),
        "plis-blouse": ("fondu", 40, 58),
        "col-et-boutons": ("fondu", 34, 52),
        "blouse": ("fondu", 26, 46),
        "pattes": ("fondu", 20, 40),
        "sourire": ("fondu", 30, 44),
        "branches": ("fondu", 12, 26),
        "truffe": ("fondu", 22, 34),
        "museau": ("fondu", 8, 24),
        "monture": ("fondu", 10, 26),
        "tete": ("fondu", 0, 18),
        # --- 2e temps : LA BOUCLE DE VIE (f70-150) ---
        # ⭐ Sans elle, il ne se passait RIEN pendant 80 frames : une mascotte
        # figee n'est pas une mascotte, c'est une image qui est apparue.
        "queue": ("balance", 34, 150, 4.5, 26, 0.15),   # bat lentement, ancree en HAUT
        "yeux": ("cligne", 30, 150, 38),                 # 1 clignement / 1,3 s
        "fond": ("aucun", 0, 0),
    },
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
    # ⛔⛔ CHERCHER LES 'sh' A N'IMPORTE QUELLE PROFONDEUR (corrige 2026-08-28).
    # L'ancienne version ne regardait que shapes[].it[] : sur un fichier passe par
    # `group_layers.py` (qui imbrique chaque calque dans un groupe), elle trouvait
    # des 'gr' et retournait None -> `if centre:` faux -> ancre laissee a [0,0] ->
    # la forme pivote/grandit depuis LE COIN DE L'ECRAN, SANS ERREUR.
    # C'est le meme bug que "la flamme ne s'anime pas" (25/08), mais silencieux :
    # il touchait deja `pop`, et desormais `geste3`, `respire` et `balance`.
    xs, ys = [], []

    def _sommets(noeud):
        if isinstance(noeud, dict):
            if noeud.get("ty") == "sh":
                for x, y in noeud["ks"]["k"].get("v", []):
                    xs.append(x)
                    ys.append(y)
            for v in noeud.values():
                _sommets(v)
        elif isinstance(noeud, list):
            for v in noeud:
                _sommets(v)

    _sommets(couche.get("shapes", []))
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



def cercle(cx, cy, r, n=16):
    """Sommets d'un cercle, en Bezier (4 quadrants suffiraient, 16 est plus lisse)."""
    import math
    v, i_, o_ = [], [], []
    k = 4.0 / 3.0 * math.tan(math.pi / (2 * n))
    for j in range(n):
        a = 2 * math.pi * j / n
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        tx, ty = -r * math.sin(a) * k, r * math.cos(a) * k
        v.append([round(x, 2), round(y, 2)])
        o_.append([round(tx, 2), round(ty, 2)])
        i_.append([round(-tx, 2), round(-ty, 2)])
    return {"c": True, "v": v, "i": i_, "o": o_}


def calque_forme(nom, chemin_ks, remplissage=None, contour=None, largeur=3,
                 duree=60):
    """Fabrique un calque de forme autonome, pret a etre anime.

    ⛔ POURQUOI ON FABRIQUE DES CALQUES. Une conversion frame-unique ne contient
    que ce qui EXISTE a cette frame : les colonnes en transit, les ondes
    d'impact et les fumees d'une scene narrative n'y sont pas -- ils naissent
    plus tard. Sans eux, animer la scene revient a faire apparaitre un decor,
    pas a raconter l'assaut.
    ⚠️ Ces acteurs ne sont PAS inventes : leurs rayons, couleurs et positions
    sont recopies du composant Remotion d'origine.
    """
    it = [{"ty": "sh", "nm": nom + "-forme", "ks": {"a": 0, "k": chemin_ks}}]
    if remplissage:
        it.append({"ty": "fl", "nm": "fill", "r": 1,
                   "o": {"a": 0, "k": 100}, "c": {"a": 0, "k": remplissage}})
    if contour:
        it.append({"ty": "st", "nm": "stroke", "lc": 2, "lj": 2,
                   "o": {"a": 0, "k": 100}, "w": {"a": 0, "k": largeur},
                   "c": {"a": 0, "k": contour}})
    it.append({"ty": "tr", "a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
               "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
               "o": {"a": 0, "k": 100}})
    return {"ddd": 0, "ty": 4, "ind": 0, "nm": nom, "st": 0, "ip": 0, "op": duree,
            "ks": {"a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                   "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                   "o": {"a": 0, "k": 100}},
            "shapes": [{"ty": "gr", "nm": nom, "it": it}]}


def points_du_chemin(d, n=40):
    """Echantillonne un chemin SVG en n points (x, y) regulierement repartis.

    On reutilise svgpath.parse_path (grammaire complete, 36 tests) plutot que
    d'ecrire un enieme parseur : le chemin peut venir tel quel du composant
    Remotion d'origine, arcs et courbes compris.

    ⚠️ Repartition par LONGUEUR D'ARC approchee, pas par parametre : sur une
    Bezier, t=0,5 n'est PAS le milieu du trajet. Echantillonner en t donnerait
    un objet qui ralentit dans les courbes et accelere dans les lignes droites
    sans que personne l'ait demande.
    """
    from svgpath import parse_path

    formes = parse_path(d)
    brut = []
    for f in formes:
        k = f["ks"]["k"]
        v, it, ot = k["v"], k.get("i") or [], k.get("o") or []
        for j in range(len(v) - 1 if not k.get("c") else len(v)):
            p0 = v[j]
            p3 = v[(j + 1) % len(v)]
            # les tangentes Lottie sont RELATIVES a leur sommet
            c1 = [p0[0] + (ot[j][0] if j < len(ot) else 0),
                  p0[1] + (ot[j][1] if j < len(ot) else 0)]
            k2 = (j + 1) % len(v)
            c2 = [p3[0] + (it[k2][0] if k2 < len(it) else 0),
                  p3[1] + (it[k2][1] if k2 < len(it) else 0)]
            for m in range(24):
                t = m / 24.0
                u = 1 - t
                brut.append([
                    u*u*u*p0[0] + 3*u*u*t*c1[0] + 3*u*t*t*c2[0] + t*t*t*p3[0],
                    u*u*u*p0[1] + 3*u*u*t*c1[1] + 3*u*t*t*c2[1] + t*t*t*p3[1],
                ])
            brut.append(list(p3))
    if len(brut) < 2:
        return brut or [[0, 0]]

    # longueurs cumulees -> reechantillonnage a pas constant
    cum = [0.0]
    for i in range(1, len(brut)):
        dx = brut[i][0] - brut[i-1][0]
        dy = brut[i][1] - brut[i-1][1]
        cum.append(cum[-1] + (dx*dx + dy*dy) ** 0.5)
    total = cum[-1]
    if total <= 0:
        return [brut[0]] * n

    sortie, j = [], 0
    for i in range(n):
        vise = total * i / (n - 1)
        while j < len(cum) - 2 and cum[j + 1] < vise:
            j += 1
        seg = cum[j + 1] - cum[j]
        r = 0.0 if seg <= 0 else (vise - cum[j]) / seg
        sortie.append([
            round(brut[j][0] + (brut[j+1][0] - brut[j][0]) * r, 2),
            round(brut[j][1] + (brut[j+1][1] - brut[j][1]) * r, 2),
        ])
    return sortie


def parcourir(couche, chemin, debut, fin, oriente=False, n=40):
    """Fait AVANCER un calque le long d'un chemin, entre deux frames.

    ⭐ La primitive qui manquait. Les 7 autres font APPARAITRE (fondu, pop,
    trace) ou VIBRER SUR PLACE (respire, balance, cligne) : aucune ne DEPLACE.
    Or c'est le coeur de beaucoup de scenes -- un jeton qui avance vers sa
    cible, un curseur qui traverse une interface, une pastille qui suit un
    parcours, un vehicule sur un trajet.

    ⛔ ON ANIME UN DELTA, PAS UNE POSITION ABSOLUE. Un calque converti porte sa
    geometrie en coordonnees absolues avec `p` a [0,0] (cf. centre_du_calque).
    Poser directement les points du chemin dans `p` TELEPORTERAIT l'objet au
    debut du trajet, en cumulant sa position propre et celle du chemin. On pose
    donc le deplacement RELATIF au premier point.

    ⚠️ `oriente` fait pivoter l'objet dans le sens de la marche (atan2), comme
    le fait la scene Remotion d'origine pour ses colonnes. A n'utiliser que si
    le dessin a un « avant » : une fleche, un vehicule. Sur un jeton rond, la
    rotation ne se voit pas et alourdit le fichier pour rien.
    """
    pts = points_du_chemin(chemin, n)
    if len(pts) < 2:
        return False

    ks = couche.setdefault("ks", {})
    p0 = pts[0]
    pas = (fin - debut) / float(len(pts) - 1)

    # ⛔ PARTIR DE LA POSITION DEJA POSEE, pas de zero. Un calque IMAGE (ty:2)
    # porte sa position reelle dans `p` (le coin haut-gauche de l'image) ; un
    # calque de formes converti a `p` a [0,0] parce que sa geometrie porte deja
    # les coordonnees absolues. Ecraser `p` par un delta partant de zero envoie
    # donc l'image AU COIN DE L'ECRAN -- mesure du 2026-08-30 : les medaillons
    # se deplacaient correctement mais leur PHOTO partait de [0,0], invisible
    # hors cadre, et le disque ivoire arrivait vide. Meme famille que le bug de
    # `monte` : la valeur est juste, son REFERENTIEL est faux.
    base = ks.get("p", {}).get("k")
    if isinstance(base, list) and len(base) >= 2 and not isinstance(base[0], dict):
        bx, by = float(base[0]), float(base[1])
    else:
        bx, by = 0.0, 0.0

    # easing inOut : demarrage progressif depuis l'arret, puis vitesse de
    # croisiere. C'est le mouvement valide dans la scene d'origine ; une
    # variante saccadee y avait ete testee puis RETIREE.
    paires = []
    for i, pt in enumerate(pts):
        t = round(debut + i * pas)
        paires.append((t, [round(bx + pt[0] - p0[0], 2),
                           round(by + pt[1] - p0[1], 2), 0]))
    ks["p"] = keyframes(paires)

    if oriente:
        angles = []
        for i, pt in enumerate(pts):
            j = min(i + 1, len(pts) - 1)
            k = max(i - 1, 0)
            import math
            a = math.degrees(math.atan2(pts[j][1] - pts[k][1],
                                        pts[j][0] - pts[k][0]))
            angles.append((round(debut + i * pas), [round(a, 2)]))
        ks["r"] = keyframes(angles)
    return True


def onde(couche, debut, rayon_fin=13.0, duree=55, retard=0, opacite_max=85):
    """Onde de choc : l'objet s'etend depuis un point et s'efface en s'etendant.

    ⭐ La 2e primitive du registre NARRATIF (avec `parcourt`). Elle dit un
    EVENEMENT ponctuel -- un impact, une validation, une notification, un point
    qu'on veut faire remarquer. En flux d'interface : le halo qui part d'un
    bouton au clic, la pastille qui pulse a l'arrivee d'un message.

    Recopiee de l'INTENTION de KhartoumEtatMajorSVG (Impact) : le rayon croit
    de 10 a 130 pendant que l'opacite monte vite puis retombe a zero. En Lottie
    on ne peut pas animer le rayon d'un cercle deja converti en chemin -- on
    anime donc l'ECHELLE, ce qui produit exactement le meme geste.

    ⛔ L'echelle exige une ancre AU CENTRE de la forme, sinon l'onde s'etend
    depuis le coin de l'ecran (le bug "la flamme ne s'anime pas", 25/08).
    L'appelant doit avoir pose l'ancre -- `animer()` s'en charge.

    ⚠️ L'opacite retombe a ZERO : une onde qui reste affichee n'est plus une
    onde, c'est un cercle. Et elle se declenche APRES son retard, donc le
    calque doit etre invisible avant (opacite 0 des la frame 0).
    """
    ks = couche.setdefault("ks", {})
    d = debut + retard
    fin = d + duree
    depart = 100.0 / max(rayon_fin, 0.01)      # part petit, finit a 100 %

    ks["s"] = keyframes([
        (d, [depart, depart]),
        (fin, [100.0, 100.0]),
    ])
    # ⛔ L'OPACITE DOIT SUIVRE L'EXPANSION, PAS LA DEVANCER. Lottie met le
    # CONTOUR a l'echelle en meme temps que la forme : a 8 % d'echelle, un trait
    # de 4 px n'en fait plus que 0,3 -- invisible. Si l'opacite culmine pendant
    # que l'anneau est encore minuscule, l'onde ne se voit JAMAIS : elle est
    # opaque quand elle est trop petite, et grande quand elle est deja
    # transparente. Mesure sur Khartoum : pic d'opacite a 18 % de la duree =
    # anneau de rayon ~33 px sur une carte 1920, masque par le batiment.
    # -> le pic est repousse a ~45 % de l'expansion, la ou l'anneau est deja
    #    large, et l'extinction devient la moitie finale de la course.
    pic = d + max(2, int(duree * 0.45))
    ks["o"] = keyframes([
        (max(0, d - 1), [0]),
        (d + max(1, int(duree * 0.12)), [round(opacite_max * 0.55)]),
        (pic, [opacite_max]),
        (fin, [0]),
    ])
    return True


def monte(couche, debut, fin, hauteur=58, periode=66, echelle_fin=1.5,
          opacite_max=50):
    """Volute qui monte, grandit et se dissipe -- EN BOUCLE.

    Recopiee de SmokeColumn : des bouffees montent de 0 vers -58 en grandissant
    (0,5 -> 1,5) pendant que l'opacite fait 0 -> 0,5 -> 0,32 -> 0, puis ca
    recommence. C'est ce qui fait qu'une cible detruite continue de FUMER au
    lieu de porter une image fixe de fumee.

    ⛔ La turbulence (feTurbulence + feDisplacementMap) de la scene d'origine
    ne passe PAS en Lottie (filtre composite) : les volutes seront lisses. Le
    MOUVEMENT est fidele, la matiere non -- c'est une perte assumee et mesurable,
    pas un echec silencieux.

    ⚠️ Decaler plusieurs calques avec `retard` (via la partition) est ce qui
    donne la colonne continue : une seule volute en boucle se lit comme un
    clignotement.
    """
    ks = couche.setdefault("ks", {})

    # ⛔ PARTIR DE LA POSITION REELLE, pas de [0,0]. `p` porte deja le centre de
    # la forme (pose par l'appelant pour que l'echelle pivote dessus) : ecrire
    # un delta [0,0] renvoie la volute AU COIN DE L'ECRAN, ou elle fume hors
    # cadre -- invisible, sans la moindre erreur. C'est le bug "la flamme ne
    # s'anime pas" (25/08) dans une variante de plus : la valeur est juste, son
    # REFERENTIEL est faux.
    base = ks.get("p", {}).get("k", [0, 0])
    if isinstance(base, list) and len(base) >= 2 and not isinstance(base[0], dict):
        bx, by = float(base[0]), float(base[1])
    else:
        bx, by = 0.0, 0.0

    pos, ech, opa = [], [], []
    t = float(debut)
    while t < fin:
        f0 = t
        f1 = min(t + periode, float(fin))
        span = f1 - f0
        if span < 4:
            break
        # ⚠️ Deux keyframes au MEME instant (fin d'un cycle = debut du suivant)
        # sont mal definies : le lecteur doit interpoler entre deux valeurs a
        # t identique. On termine donc chaque cycle une frame avant le suivant.
        f_fin = f1 - 1 if f1 < fin else f1
        if f_fin <= f0:
            break
        pos += [(f0, [bx, by, 0]), (f_fin, [bx, by - hauteur, 0])]
        ech += [(f0, [50.0, 50.0]),
                (f_fin, [echelle_fin * 100, echelle_fin * 100])]
        opa += [(f0, [0]),
                (f0 + span * 0.15, [opacite_max]),
                (f0 + span * 0.75, [round(opacite_max * 0.64)]),
                (f_fin, [0])]
        t = f1
    if not pos:
        return False
    ks["p"] = keyframes([(round(a), b) for a, b in pos])
    ks["s"] = keyframes([(round(a), b) for a, b in ech])
    ks["o"] = keyframes([(round(a), b) for a, b in opa])
    return True


def balayage(couche, debut, fin, sens="haut", depart=0.0):
    """Revele progressivement en faisant GRANDIR le pochoir qui decoupe.

    ⭐ Le geste « la zone se remplit » : un rectangle de decoupe dont la hauteur
    (ou la largeur) croit, devoilant ce qu'il masque. Recopie de
    EtatMajorGptAnimee (`zoneWClipH = pZoneW * 260`), et tres courant en
    interface : une jauge qui se remplit, une carte qui se devoile, une barre
    de progression, un graphique qui monte.

    ⛔ On anime l'ECHELLE du pochoir, pas la geometrie de son rectangle : Lottie
    ne sait pas animer la hauteur d'une forme deja convertie en chemin. L'ancre
    est posee sur le BORD depuis lequel la revelation part -- sinon le pochoir
    grandit dans les deux sens et decouvre par le milieu.

    `sens` : "haut" (revele du haut vers le bas), "bas", "gauche", "droite".
    """
    xs, ys = [], []

    def _sommets(noeud):
        if isinstance(noeud, dict):
            if noeud.get("ty") == "sh":
                for x, y in noeud["ks"]["k"].get("v", []):
                    xs.append(x)
                    ys.append(y)
            for v in noeud.values():
                _sommets(v)
        elif isinstance(noeud, list):
            for v in noeud:
                _sommets(v)

    _sommets(couche.get("shapes", []))
    if not xs:
        return False

    x0, x1 = min(xs), max(xs)
    y0, y1 = min(ys), max(ys)
    # l'ancre est le bord FIXE : la revelation part de lui
    ancre = {"haut": [(x0 + x1) / 2, y0],
             "bas": [(x0 + x1) / 2, y1],
             "gauche": [x0, (y0 + y1) / 2],
             "droite": [x1, (y0 + y1) / 2]}.get(sens, [(x0 + x1) / 2, y0])

    ks = couche.setdefault("ks", {})
    ks["a"] = {"a": 0, "k": [round(ancre[0], 2), round(ancre[1], 2)]}
    ks["p"] = {"a": 0, "k": [round(ancre[0], 2), round(ancre[1], 2)]}

    d0 = max(0.5, depart * 100)
    if sens in ("haut", "bas"):
        ks["s"] = keyframes([(debut, [100.0, d0]), (fin, [100.0, 100.0])])
    else:
        ks["s"] = keyframes([(debut, [d0, 100.0]), (fin, [100.0, 100.0])])
    return True


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
    """Pose l'animation sur les calques. Retourne (n_animes, n_ignores).

    ⭐ Anime AUSSI le contenu des precompositions (2026-08-30). Des qu'une scene
    porte un clip global -- un medaillon, un cadre rond, une vignette -- tout
    son contenu part dans un asset `{id, layers}` et le tableau `doc["layers"]`
    ne contient plus que 3-4 calques d'enveloppe. Ne parcourir que le haut
    niveau revenait alors a n'animer RIEN, en silence : mesure sur
    EtatMajorGabarit, 4 calques au sommet pour 69 dans la precomp, tous nommes
    (city-alpha, control-zone-west, maneuver-arrow-north...).
    """
    duree = partition.get("_duree", doc.get("op", 120))
    doc["op"] = duree
    animes, ignores = 0, 0

    # les calques a traiter : ceux du haut niveau ET ceux des precompositions
    cibles = list(doc["layers"])
    for a in doc.get("assets", []):
        if a.get("layers"):
            for c in a["layers"]:
                c["op"] = duree
            cibles.extend(a["layers"])

    # Cascade echelonnee : on repartit les departs sur les 2/3 de la duree,
    # dans l'ordre de PEINTURE (dernier calque de la liste = dessine en 1er).
    echelonne = partition.get("_echelonne")
    n_couches = len(cibles)
    for rang, couche in enumerate(cibles):
        regle = trouver_partition(couche["nm"], partition)
        if echelonne and regle:
            genre, _, longueur = regle[0], regle[1], regle[2]
            ordre = n_couches - 1 - rang          # du fond vers l'avant
            depart = int(ordre / max(1, n_couches - 1) * duree * 0.62)
            regle = (genre, depart, depart + max(8, longueur))
        couche["op"] = duree
        if not regle:
            ignores += 1
            continue
        genre, debut, fin = regle[0], regle[1], regle[2]
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

        elif genre == "geste3":
            # ⭐ LE GESTE EN 3 TEMPS (FICHE-GESTE-ANIME, regle n.4) : la forme
            # monte HAUT, marque un temps SUSPENDU en l'air, puis RETOMBE d'un
            # coup et se cale. La suspension n'est pas un temps mort : la forme
            # y est immobile mais l'oeil attend.
            # Timing ASYMETRIQUE : la montee ralentit en arrivant (sortie douce),
            # la chute accelere jusqu'a l'impact (entree brutale).
            # ⛔ Sans recentrer ancre ET position, un calque converti les a a
            # [0,0] : l'ecrasement se ferait depuis le coin de l'ecran.
            _, f0, f_haut, f_susp, f_impact, hauteur = regle
            centre = centre_du_calque(couche)
            if centre:
                couche["ks"]["a"] = {"a": 0, "k": centre}
                cx, cy = centre
            else:
                cx, cy = 0, 0
            bas = hauteur * 1.4   # depart hors cadre, sous sa place
            couche["ks"]["p"] = keyframes(
                [(f0, [cx, cy + bas]), (f_haut, [cx, cy - hauteur]),
                 (f_susp, [cx, cy - hauteur]), (f_impact, [cx, cy])],
                easing=(0.23, 0.32))   # valeur EXACTE relevee, jamais approximee
            # Ecrasement a l'impact : sans lui, la chute s'arrete net et se lit
            # comme un bug de timing plutot que comme un poids.
            couche["ks"]["s"] = keyframes(
                [(f_impact, [100, 100]), (f_impact + 3, [100, 86]),
                 (f_impact + 9, [100, 100])])
            couche["ks"]["o"] = keyframes(
                [(0, [0]), (f0, [0]), (f0 + 10, [100])])

        elif genre == "respire":
            # ⭐ BOUCLE DE VIE — une mascotte doit CONTINUER a vivre apres son
            # apparition. Sans ca, il ne se passe plus rien pendant 80 frames et
            # la piece retombe a une image fixe animee une fois.
            # Oscillation LENTE et FAIBLE en echelle, sur toute la duree, en boucle.
            # ⛔ Recentrer ancre ET position, sinon la forme grandit depuis le coin.
            _, debut, fin, ampleur, periode = regle
            centre = centre_du_calque(couche)
            if centre:
                couche["ks"]["a"] = {"a": 0, "k": centre}
                couche["ks"]["p"] = {"a": 0, "k": centre}
            paires, t = [], debut
            haut = True
            while t <= fin:
                paires.append((t, [100, 100 + (ampleur if haut else -ampleur)]))
                haut = not haut
                t += periode
            if len(paires) >= 2:
                couche["ks"]["s"] = keyframes(paires)

        elif genre == "balance":
            # Meme idee sur la ROTATION : la queue qui bat, l'oreille qui bouge.
            # ⛔ L'ancre doit etre a la BASE de la forme (pas son centre) sinon
            # l'element pivote sur son milieu et se detache visuellement.
            _, debut, fin, angle, periode, ancre_y = regle
            centre = centre_du_calque(couche)
            if centre:
                cx, cy = centre
                # ⛔ ancre_y : 0 = HAUT de la bbox, 1 = BAS (l'axe Y Lottie DESCEND,
                # donc min(ys) est le haut). L'ancienne glose disait « 0 centre » :
                # FAUX, corrige au wrap du 2026-08-28. Le seul usage paye (la queue
                # du renard, ancre_y=0.15) ancre en HAUT — une queue s'attache en haut.
                # ⛔ PIEGE PAYE 2x : chercher les 'sh' A N'IMPORTE QUELLE
                # PROFONDEUR. `group_layers.py` imbrique les calques dans un
                # groupe par calque -> une boucle sur shapes[].it[] ne trouve
                # RIEN, l'ancre reste a [0,0] et la forme pivote autour du COIN
                # DE L'ECRAN. Meme famille que le bug de sonde du test.
                xs, ys = [], []

                def _sommets(o):
                    if isinstance(o, dict):
                        if o.get("ty") == "sh":
                            for x, y in o["ks"]["k"].get("v", []):
                                xs.append(x); ys.append(y)
                        for v in o.values():
                            _sommets(v)
                    elif isinstance(o, list):
                        for v in o:
                            _sommets(v)

                _sommets(couche.get("shapes", []))
                if ys:
                    base = min(ys) + (max(ys) - min(ys)) * ancre_y
                    couche["ks"]["a"] = {"a": 0, "k": [cx, round(base, 2)]}
                    couche["ks"]["p"] = {"a": 0, "k": [cx, round(base, 2)]}
            paires, t, sens = [], debut, 1
            while t <= fin:
                paires.append((t, [angle * sens]))
                sens = -sens
                t += periode
            if len(paires) >= 2:
                couche["ks"]["r"] = keyframes(paires)
            # ⛔ Sans ce fondu, l'element est VISIBLE des la frame 0 (balance
            # n'anime que la rotation) : la queue apparaissait avant la tete.
            couche["ks"]["o"] = keyframes(
                [(0, [0]), (max(0, debut - 20), [0]), (debut, [100])])

        elif genre == "cligne":
            # ⭐ LE GESTE LE MOINS CHER ET LE PLUS EFFICACE sur un personnage.
            # On masque les yeux 2 frames, periodiquement. Rien d'autre.
            # ⛔ Le clignement doit etre BREF (2 frames a 30 fps = 66 ms) : plus
            # long, le perso a l'air endormi, pas vivant.
            _, debut, fin, periode = regle
            paires = [(0, [0]), (debut - 6, [0]), (debut, [100])]
            t = debut + periode
            while t <= fin:
                paires += [(t - 1, [100]), (t, [0]), (t + 2, [0]), (t + 3, [100])]
                t += periode
            couche["ks"]["o"] = keyframes(paires)

        elif genre == "balaye":
            # ("balaye", debut, fin, [sens], [depart])
            sens = regle[3] if len(regle) > 3 else "haut"
            dep = regle[4] if len(regle) > 4 else 0.0
            if not balayage(couche, debut, fin, sens, dep):
                animes -= 1
                ignores += 1

        elif genre == "onde":
            # ("onde", debut, fin, rayon_fin, [duree], [retard])
            # L'echelle DOIT pivoter sur le centre de la forme, sinon l'onde
            # s'etend depuis le coin de l'ecran (bug du 25/08).
            centre = centre_du_calque(couche)
            if centre:
                couche["ks"]["a"] = {"a": 0, "k": centre}
                couche["ks"]["p"] = {"a": 0, "k": centre}
            rayon = regle[3] if len(regle) > 3 else 13.0
            d_onde = regle[4] if len(regle) > 4 else max(8, fin - debut)
            retard = regle[5] if len(regle) > 5 else 0
            onde(couche, debut, rayon, d_onde, retard)

        elif genre == "monte":
            # ("monte", debut, fin, [hauteur], [periode], [retard])
            centre = centre_du_calque(couche)
            if centre:
                couche["ks"]["a"] = {"a": 0, "k": centre}
                couche["ks"]["p"] = {"a": 0, "k": centre}
            haut = regle[3] if len(regle) > 3 else 58
            per = regle[4] if len(regle) > 4 else 66
            ret = regle[5] if len(regle) > 5 else 0
            if not monte(couche, debut + ret, fin, haut, per):
                animes -= 1
                ignores += 1

        elif genre == "parcourt":
            # ("parcourt", debut, fin, "M... chemin SVG", [oriente])
            chemin = regle[3] if len(regle) > 3 else None
            oriente = bool(regle[4]) if len(regle) > 4 else False
            if not (chemin and parcourir(couche, chemin, debut, fin, oriente)):
                animes -= 1
                ignores += 1

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
