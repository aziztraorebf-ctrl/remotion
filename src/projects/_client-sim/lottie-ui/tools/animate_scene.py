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
