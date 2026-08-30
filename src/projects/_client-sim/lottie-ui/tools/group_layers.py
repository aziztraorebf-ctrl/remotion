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
import re
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
    # ── ONBOARDING GENERIQUE — groupe par INTENTION, pas par forme ──────────
    # ⭐⭐ LE PRINCIPE (Aziz, 2026-08-30) : « le moins de friction possible pour
    # l'editeur. Pas de dictionnaire, pas de recherche : on comprend d'un coup
    # d'oeil. » Un acheteur cherche « the toggle » ou « the banner », JAMAIS
    # « etape1-banniere-lisere ». Les groupes portent ce qu'on VEUT MODIFIER.
    #
    # ⭐⭐ NOMS EN ANGLAIS, SANS ACCENTS (decision d'Aziz, 2026-08-30) :
    #   1. l'acheteur de ce marche est anglophone — il ouvre le fichier et doit
    #      comprendre sans traduire ;
    #   2. un nom de calque n'est pas du texte affiche : lui faire porter des
    #      accents (E, e, a) ajoute un risque d'encodage chez le lecteur/editeur
    #      tiers pour zero benefice.
    # ⛔ Le CODE et les COMMENTAIRES restent en francais : c'est notre outillage,
    # nous seuls les lisons. Le critere n'est pas la langue du projet, c'est
    # QUI LIT le texte en question.
    # ⛔ L'ordre est l'ordre de PEINTURE : le 1er groupe est peint dessous.
    "onboarding": {
        "_ordre": [
            "Background", "Step 1 - header", "Step 1 - shortcuts",
            "Step 1 - banner", "Step 1 - member list",
            "Step 2 - header", "Step 2 - options list",
            "Step 2 - selection frame", "Step 2 - toggle",
            "Step 2 - notification", "Step 2 - footnote", "Step 2 - footer",
            "Action button",
        ],
        "Background": {"motifs": ["board-bg", "step1-bg", "step2-bg"]},
        # ⛔ "step1-subtitle" AVANT "step1-title" : le motif court capturerait
        # sinon "step1-subtitle-text", qui partirait en orphelin (vecu 30/08).
        "Step 1 - header": {"motifs": ["step1-status-bar", "step1-status",
                                        "step1-subtitle", "step1-title",
                                        "step1-section"]},
        "Step 1 - shortcuts": {"motifs": ["step1-app"]},
        "Step 1 - banner": {"motifs": ["step1-banner"]},
        "Step 1 - member list": {"motifs": ["step1-member"]},
        "Step 2 - header": {"motifs": ["step2-status-bar", "step2-status",
                                        "step2-title", "step2-step-1"]},
        "Step 2 - options list": {"motifs": ["step2-list", "step2-row"]},
        "Step 2 - selection frame": {"motifs": ["step2-frame"]},
        "Step 2 - toggle": {"motifs": ["step2-toggle"]},
        "Step 2 - notification": {"motifs": ["step2-notification", "step2-step-2"]},
        "Step 2 - footnote": {"motifs": ["step2-footnote"]},
        "Step 2 - footer": {"motifs": ["step2-footer"]},
        "Action button": {"motifs": ["action-button"]},
    },
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

    # ⭐ Maison chauffee au gaz (Gazoduc Acte 5) -> PIECE DE DEMONSTRATION.
    # Ici le regroupement se fait PAR MOTIF DE NOM, pas par indices : ces
    # calques portent deja leur intention (house, heating, flame, link, chart),
    # heritee des variables du composant Remotion. C'est le cas ideal -- quand
    # les noms veulent dire quelque chose, la carte s'ecrit toute seule.
    # 24 calques plats -> 6 blocs qu'un client peut ouvrir et comprendre.
    # ⛔ L'ordre est celui de la PEINTURE : le fond dessous, la courbe dessus.
    "maison": {
        "_ordre": ["fond", "maison", "chauffage", "flamme", "tuyau", "courbe"],
        "fond": {"motifs": ["rect"]},
        "maison": {"motifs": ["house"]},
        "chauffage": {"motifs": ["heating"]},
        "flamme": {"motifs": ["flame"]},
        "tuyau": {"motifs": ["link"]},
        "courbe": {"motifs": ["chart"]},
    },

    # -- Logo LoadUp (client reel) -> CAS DU LOGO CLIENT, le plus dur.
    # Ici les calques s'appellent path-1..path-15 et le SVG ne donne AUCUN
    # indice (ids compresses par l'optimiseur d'export). La carte a ete etablie
    # en REGARDANT la planche de `planche_calques.py` -- chaque calque rendu
    # seul, identifie a l'oeil. C'est la boucle complete : voir -> nommer.
    #   path-1        aplat plein cadre 2048x1100      = le fond
    #   path-2        fleche montante (173x206)        = LE POINT FOCAL
    #   path-11       "L" (plein, pas de contre-forme)
    #   path-7 + 8    "o" + SON TROU        path-9 + 10   "a" + son trou
    #   path-5 + 6    "d" + son trou        path-3 + 4    "p" VERT + son trou
    # -- REGLE LUE DANS LA MESURE : chaque lettre pleine est suivie de sa
    # CONTRE-FORME BLANCHE, aux memes coordonnees (o: x=767/773 · a: 893/892 ·
    # d: 1026/1020 · p: 1289/1298). Une contre-forme separee de sa lettre est
    # peinte au mauvais moment et BOUCHE le trou.
    # ERREUR REELLE (2026-08-28) : j'avais lu path-8 comme "la tige du d" sur la
    # planche et l'avais mise dans lettre-d -> le "o" est sorti DISQUE PLEIN.
    # Le chiffre ne l'a PAS vu (0,14 % d'ecart, "vert"), l'IMAGE si.
    #   path-12..15   4 formes minuscules a x=1382     = le symbole (R)
    # ATTENTION `noms` = correspondance EXACTE (obligatoire ici : `motifs`
    # matche par SOUS-CHAINE, donc "path-1" happerait path-11..path-15).
    # Chaque lettre reste un groupe SEPARE : c'est ce qui permet une
    # cascade. La fleche reste seule -- on n'anime qu'un seul point focal.
    "loadup": {
        "_ordre": ["fond", "lettre-l", "lettre-o", "lettre-a", "lettre-d",
                   "lettre-p", "fleche-up", "marque-deposee"],
        "fond": {"noms": ["path-1"]},
        "lettre-l": {"noms": ["path-11"]},
        "lettre-o": {"noms": ["path-7", "path-8"]},
        "lettre-a": {"noms": ["path-9", "path-10"]},
        "lettre-d": {"noms": ["path-5", "path-6"]},
        "lettre-p": {"noms": ["path-3", "path-4"]},
        "fleche-up": {"noms": ["path-2"]},
        "marque-deposee": {"noms": ["path-12", "path-13", "path-14", "path-15"]},
    },

    # -- Logo RENARD VETERINAIRE (client reel) -> CAS MASCOTTE, le vrai test.
    # ⭐⭐ CE QUE CE CAS APPREND, QUE LOADUP NE POUVAIT PAS DIRE : sur un logotype,
    # chaque calque est une LETTRE, la planche se lit d'un coup d'oeil. Sur une
    # MASCOTTE, la moitie des vignettes sont des TACHES NOIRES indiscernables
    # (3 ovales identiques = 2 iris + 1 pupille ?). LA FORME SEULE NE SUFFIT PLUS.
    # -> Il faut croiser FORME + COULEUR + POSITION. La planche a donc ete annotee
    #    (couleur hex + centre + aire) et les 9 calques douteux MESURES un par un.
    # ⛔ 2 erreurs de lecture attrapees PAR LA MESURE, avant de produire le fichier :
    #    path-4 lu comme "la truffe" -> c'est la TOUFFE du front (orange, y=684) ;
    #    la vraie truffe est path-13 (sombre #2A3A32, y=723-779, centre).
    #    Meme famille que le bug path-8 de LoadUp, mais attrape AVANT le rendu.
    # ⛔ Paires symetriques : verifier que x est de part et d'autre du centre (~776).
    #    iris 511/958 · blancs 560/947 · pupilles 581/905 · branches 580/900.
    # ⛔⛔ 3e ERREUR, celle-ci VUE A L'IMAGE : un groupe "lunettes" unique (monture +
    # branches) donnait une GROSSE TACHE NOIRE entre les yeux — la monture, peinte
    # avec les branches DEVANT les yeux, ecrasait iris et blancs. L'ordre reel du
    # fichier est : monture (rang 2) -> yeux (4-10) -> branches (13-14). Il faut
    # donc DEUX groupes, "monture" et "branches", encadrant "yeux".
    # ⭐⭐⭐ LA REGLE QUI SORT DE CE CAS — UN GROUPE DOIT ETRE CONTIGU.
    # L'ordre de peinture du renard est STRICTEMENT p1 -> p31. Ma 1re carte groupait
    # par NATURE ("tous les elements de blouse ensemble" : p12+p17+p21+p22+p25...),
    # ce qui faisait passer la blouse AVANT la truffe (p13), les branches (p14-15) et
    # le sourire (p16). Resultat : grosse TACHE NOIRE entre les yeux, 0,37 % d'ecart.
    # ⛔ Ma 1re correction (separer monture/branches) n'a rien change : 0,37 -> 0,36 %.
    # J'avais re-DOSE au lieu de chercher la CAUSE — exactement ce que la doctrine
    # interdit. La cause s'est vue en AFFICHANT les deux ordres cote a cote.
    # => REGLE : ne grouper que des calques CONTIGUS dans l'ordre d'origine. Un nom
    # parlant qui casse la sequence est pire qu'un nom moins joli qui la respecte —
    # d'ou "col-et-boutons" et "plis-blouse" separes de "blouse".
    "renard": {
        "_ordre": ["fond", "tete", "monture", "yeux", "museau", "truffe",
                   "branches", "sourire", "blouse", "queue", "pattes",
                   "stethoscope", "col-et-boutons", "plis-blouse"],
        "fond": {"noms": ["path-1"]},
        "tete": {"noms": ["path-2"]},
        "monture": {"noms": ["path-3", "path-4"]},
        "yeux": {"noms": ["path-5", "path-6", "path-7",
                          "path-8", "path-9", "path-10"]},
        "museau": {"noms": ["path-11", "path-12"]},
        "truffe": {"noms": ["path-13"]},
        "branches": {"noms": ["path-14", "path-15"]},
        "sourire": {"noms": ["path-16"]},
        "blouse": {"noms": ["path-17"]},
        "queue": {"noms": ["path-18", "path-19"]},
        "pattes": {"noms": ["path-20"]},
        "col-et-boutons": {"noms": ["path-21", "path-22", "path-23"]},
        "stethoscope": {"noms": ["path-24", "path-25", "path-26", "path-27"]},
        "plis-blouse": {"noms": ["path-28", "path-29", "path-30", "path-31"]},
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
            noms = regle.get("noms")
            if (i in idx
                    or (noms is not None and c["nm"] in noms)
                    or any(m.lower() in c["nm"].lower() for m in motifs)):
                attribue[i] = nom_groupe

    # ⛔⛔ LE SAC "divers" DETRUISAIT L'ORDRE DE PEINTURE (mesure 2026-08-26).
    # Tous les calques non attribues tombaient dans UN SEUL groupe, ajoute EN
    # DERNIER dans l'ordre -- donc peint AU-DESSUS de tout. Sur Khartoum, ce sac
    # contenait `background-base` : un aplat beige OPAQUE plein cadre
    # (opacite 100, bbox 0,0->1920,1080). Un aplat opaque au sommet occulte
    # 100 % du cadre : la scene entiere disparaissait (1,30 % -> 11,90 %
    # d'ecart), et le chiffre devenait INSENSIBLE a l'ordre des 16 autres
    # groupes -- il ne mesurait plus que "fond beige uni vs reference".
    # Les cartes manuelles ne l'avaient jamais montre parce qu'elles attribuent
    # le fond a un groupe ; --par-nom est le premier mode a l'envoyer dans le
    # sac, `background-base` etant unique donc sous le seuil.
    # -> Un calque non attribue reste un calque A SA PLACE, avec SON NOM. Plus
    #    lisible dans Creator qu'un "divers" opaque, et l'ordre est preserve.
    rapport = {}
    groupes = {}
    ordre_vu = []
    for i, c in enumerate(peinture):
        nom = attribue.get(i)
        if nom is None:
            nom = f"__isole__{i}"          # cle unique : jamais de fusion
        if nom not in groupes:
            ordre_vu.append(nom)
        groupes.setdefault(nom, []).append(c)
        cle = "(isoles, gardes a leur place)" if nom.startswith("__isole__") else nom
        rapport[cle] = rapport.get(cle, 0) + 1

    # Un calque par groupe, contenant tous les shapes de ses membres.
    # Les groupes NOMMES suivent l'ordre de la carte ; les isoles gardent la
    # position qu'ils avaient dans l'ordre de peinture.
    nommes = [g for g in carte["_ordre"] if g in groupes]
    ordre = []
    for g in ordre_vu:
        if g.startswith("__isole__"):
            ordre.append(g)
        elif g in nommes and g not in ordre:
            ordre.append(g)
    ordre += [g for g in groupes if g not in ordre]

    nouvelles = []
    for rang, nom in enumerate(ordre):
        membres = groupes[nom]
        it = []
        # dans le calque, on inverse : premier de la liste = peint en dernier
        for c in reversed(membres):
            # ⛔⛔ LE BUG QUI A DETRUIT UNE ANIMATION (mesure 2026-08-26) :
            # ce code ne recopiait QUE les formes et JETAIT `c["ks"]` -- or
            # c'est la que vivent les animations du calque (opacite, echelle,
            # position). Sur la maison : 23 opacites animees et 9 traces
            # PERDUS. Le fichier restait valide, `check_animation` comptait
            # meme des frames distinctes ("ca bouge"), mais tout apparaissait
            # EN MEME TEMPS : le triangle de la courbe visible des la frame 0
            # au lieu de la 89, la flamme allumee avant que la maison existe.
            # L'histoire etait detruite, la mesure disait OK.
            # -> On DESCEND le transform du calque dans le sous-groupe, ou il
            #    s'applique exactement de la meme facon.
            sous = []
            for g in collecter_formes(c):
                g = dict(g)
                g["nm"] = c["nm"]          # garde la trace de l'element d'origine
                sous.append(g)
            if not sous:
                continue
            ks = c.get("ks") or {}
            anime = any(isinstance(ks.get(k), dict) and ks[k].get("a") == 1
                        for k in ("o", "p", "s", "r", "a"))
            if anime:
                tr = {"ty": "tr", "nm": c["nm"] + "-transform"}
                for cle, defaut in (("a", [0, 0]), ("p", [0, 0]),
                                    ("s", [100, 100]), ("r", 0), ("o", 100)):
                    tr[cle] = ks.get(cle, {"a": 0, "k": defaut})
                it.append({"ty": "gr", "nm": c["nm"], "it": sous + [tr]})
            else:
                it.extend(sous)
        # Un isole reprend son nom d'origine : c'est justement ce qui le rend
        # manipulable dans Creator (background-base, PALAIS PRESIDENTIEL...).
        nom_sortie = (membres[0].get("nm") or nom) if nom.startswith("__isole__") else nom
        nouvelles.append({
            "ddd": 0, "ty": 4, "ind": rang, "nm": nom_sortie, "st": 0,
            "ip": couches[0].get("ip", 0), "op": doc.get("op", 60),
            "ks": {"a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                   "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                   "o": {"a": 0, "k": 100}},
            "shapes": [{"ty": "gr", "nm": nom_sortie, "it": it + [tr_neutre()]}],
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


def carte_par_nom(doc, minimum=2):
    """Deduit une carte de regroupement depuis les NOMS des calques.

    ⭐ Pourquoi ce mode existe : les cartes ci-dessus sont ecrites a la main,
    par indices (0-2 = le ciel, 3-13 = le soleil...), parce que les scenes qui
    les ont motivees sortaient des calques illisibles ("ellipse-71"). Mais nos
    scenes bien construites sortent des noms SEMANTIQUES -- KhartoumEtatMajorSVG
    donne target-palace, target-tower, staging-rsf, river, terrain. Sur
    celles-la, une carte manuelle est du travail jete : les indices cassent au
    moindre changement de la scene, alors que les noms survivent.

    Regle : on groupe sur le prefixe du nom, en retirant le suffixe numerique
    que la conversion ajoute (target-palace-12 -> target-palace). Un prefixe
    qui ne rassemble pas au moins `minimum` calques part dans "divers" : un
    groupe d'un seul element n'apporte aucune prise de plus qu'un calque nu.

    ⛔ Ce mode ne devine PAS l'intention narrative -- il n'invente aucun
    regroupement que les noms ne portent pas deja. Une scene aux calques
    "path-248" en sortira avec un seul groupe "divers", et c'est le bon
    resultat : il faut alors une carte manuelle ou de meilleurs noms.
    """
    import collections
    couches = [c for c in doc.get("layers", []) if c.get("ty") == 4]
    base = {}
    for c in couches:
        nom = c.get("nm", "") or ""
        # retire le suffixe numerique ajoute a la conversion
        prefixe = re.sub(r"[-_]?\d+$", "", nom).strip() or "divers"
        base.setdefault(prefixe, []).append(nom)

    # ⛔ ORDRE DE PEINTURE, pas ordre de liste. Dans un Lottie, l'indice 0 est
    # AU-DESSUS : la liste des calques est donc l'inverse de l'ordre de
    # peinture, et `regrouper()` travaille sur `reversed(couches)`. Construire
    # l'ordre sur la liste brute le met exactement a l'envers -- mesure du
    # 2026-08-26 : `background-base` se retrouvait peint EN DERNIER, donc
    # par-dessus toute la scene, et Khartoum ressortait vide (1,30 % -> 11,90 %
    # d'ecart). Rattrape par verifier_fidelite.py, invisible autrement.
    vus, ordre = set(), []
    for c in reversed(couches):
        prefixe = re.sub(r"[-_]?\d+$", "", c.get("nm", "") or "").strip() or "divers"
        if prefixe not in vus:
            vus.add(prefixe)
            ordre.append(prefixe)

    # ⚠️ Un prefixe qui n'est que le nom d'une PRIMITIVE SVG ne porte aucune
    # intention : "ellipse", "circle", "rect" sont exactement les calques
    # illisibles que cet outil doit eliminer. Les regrouper ne les rend pas
    # lisibles -- on les groupe quand meme (c'est mieux que 18 calques nus),
    # mais on le SIGNALE : le probleme est alors le NOMMAGE de la scene, pas
    # le regroupement, et c'est une information que l'appelant doit avoir.
    PRIMITIVES = {"circle", "ellipse", "rect", "path", "polygon", "polyline",
                  "line", "g", "divers"}
    retenus = [p for p in ordre if len(base[p]) >= minimum]
    carte = {"_ordre": retenus,
             "_generiques": [p for p in retenus if p.lower() in PRIMITIVES]}
    for prefixe in retenus:
        # motif ancre sur le nom complet : "river" ne doit pas happer
        # "riverbank". On liste donc les noms EXACTS rencontres.
        carte[prefixe] = {"noms": set(base[prefixe])}
    return carte, {p: len(base[p]) for p in ordre}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("--carte", help=f"une de : {', '.join(CARTES)}")
    ap.add_argument("--par-nom", action="store_true",
                    help="deduit les groupes des NOMS des calques (pour toute "
                         "scene nommee semantiquement : pas de carte a ecrire)")
    ap.add_argument("--minimum", type=int, default=2,
                    help="taille minimale d'un groupe deduit (defaut 2)")
    ap.add_argument("-o", "--out")
    a = ap.parse_args()

    if not a.carte and not a.par_nom:
        print("ECHEC : donner --carte <nom> ou --par-nom", file=sys.stderr)
        return 2
    if a.carte and a.carte not in CARTES:
        print(f"ECHEC : carte inconnue '{a.carte}'. Disponibles : "
              f"{', '.join(CARTES)}", file=sys.stderr)
        return 2

    doc = json.load(open(a.json, encoding="utf-8"))
    avant = len(doc["layers"])
    if a.par_nom:
        carte, releve = carte_par_nom(doc, a.minimum)
        isoles = {p: n for p, n in releve.items() if n < a.minimum}
        print(f"carte deduite des NOMS : {len(carte['_ordre'])} groupe(s)")
        generiques = carte.get("_generiques") or []
        if generiques:
            n = sum(1 for c in doc.get("layers", [])
                    if re.sub(r"[-_]?\d+$", "", c.get("nm", "") or "").strip()
                    in generiques)
            print(f"   ⚠️ {len(generiques)} groupe(s) portent un nom de "
                  f"PRIMITIVE SVG ({', '.join(sorted(generiques))}) : "
                  f"{n} calques restent illisibles dans Creator. "
                  f"C'est le NOMMAGE de la scene qu'il faut corriger, "
                  f"pas le regroupement.", file=sys.stderr)
        if isoles:
            # Ne pas taire ce qui part dans "divers" : c'est la seule facon de
            # voir qu'une scene est mal nommee plutot que mal regroupee.
            print(f"   ({len(isoles)} prefixe(s) sous le seuil de {a.minimum} "
                  f"-> divers : {', '.join(sorted(isoles)[:8])}"
                  f"{'...' if len(isoles) > 8 else ''})")
    else:
        carte = CARTES[a.carte]
    doc, rapport = regrouper(doc, carte)

    sortie = a.out or os.path.splitext(a.json)[0] + "-groupe.json"
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"))

    # ⛔ Un regroupement qui n'attribue presque RIEN est une panne silencieuse :
    # le fichier sort valide et d'apparence normale. Cas reel : appliquer une
    # carte a un fichier DEJA regroupe -- plus aucun nom ne matche, tout devient
    # isole, et avant le correctif du sac "divers" les calques fusionnaient en
    # un seul, detruisant la piece sans un mot. Meme famille que les autres
    # pieges de la chaine : perdre de l'information sans jamais le signaler.
    isoles = rapport.get("(isoles, gardes a leur place)", 0)
    if avant and isoles > avant * 0.5:
        print(f"   ⚠️ {isoles}/{avant} calques n'ont ete attribues a AUCUN "
              f"groupe. La carte ne correspond probablement pas a ce fichier "
              f"(deja regroupe ? mauvaise carte ? essayer --par-nom).",
              file=sys.stderr)

    print(f"{os.path.basename(sortie)} : {avant} calques -> {len(doc['layers'])}")
    for nom, n in rapport.items():
        print(f"   {nom:14} {n:3} elements")
    print(f"   ({os.path.getsize(sortie)/1024:.1f} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
