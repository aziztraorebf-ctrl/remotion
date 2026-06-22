"""
rnd-svg-scene-gen.py — R&D : genere des SCENES SVG completes (pas des jetons) via Gemini 3.1 Pro OU GPT-5.5.

But (session R&D 2026-06-21) : pousser la technique SVG genatif prouvee sur la pièce coin-flip
(SenegalCoinFaceA_SVG) au-dela d'un OBJET, vers une SCENE COMPLETE (ville/port, carte d'etat-major...).
Le LLM dessine une scene detaillee, DECOUPEE EN GROUPES NOMMES, pensee pour le geste — nous l'animons
cote code par une variable de frame.

Registre : "grave / medaille doree", traits rouges patine, comme la pièce Senegal.

Usage :
    python3 scripts/tools/rnd-svg-scene-gen.py --scene ville --provider gemini --out /tmp/svg-ville-gemini.json
    python3 scripts/tools/rnd-svg-scene-gen.py --scene ville --provider gpt    --out /tmp/svg-ville-gpt.json
    python3 scripts/tools/rnd-svg-scene-gen.py --scene etatmajor --provider gemini --out /tmp/svg-em-gemini.json
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

# ----- REGISTRES visuels (style + palette + cadre) — decouples du sujet -----
REGISTRES = {
    "medaille": r"""
"GRAVURE SUR MEDAILLE DOREE" — comme une scene gravee/ciselee a l'interieur d'une piece de monnaie ancienne.
Palette STRICTE : fond/objets en OR PATINE (#e7bd78, #dca95e, #bf9442) ; TOUS les traits/contours en ROUGE
PATINE (#8a2a20) ; rehauts ivoire (#f2ebd9). Style : lignes gravees fines, hachures pour les ombres, elegant,
pas de degrade complexe, pas de photo-realisme.
CADRE : viewBox="0 0 1024 1024", scene composee a l'INTERIEUR d'un cercle (rayon ~480, centre 512,512) — un
clipPath circulaire sera applique, remplis joliment le disque.
""",
    "blueprint": r"""
"BLUEPRINT TECHNIQUE D'INGENIEUR" — un plan technique / schema en coupe, comme une planche d'ingenierie.
Palette STRICTE : fond BLEU NUIT profond (#0d1b3a / #16213a, ne le dessine PAS, le code le pose) ; TOUS les
traits en CYAN CLAIR (#7fd4ff) et BLANC (#eaf6ff) ; accents OR (#c8a951) UNIQUEMENT pour 1-2 elements cles
(le flux principal, une cote importante). Style : LIGNES FINES REGULIERES, precises, droites ou arcs nets ;
COTES techniques (lignes de mesure avec petites fleches aux bouts + un nombre), une GRILLE de fond fine
(lignes espacees regulierement, tres discretes), des ETIQUETTES courtes en majuscules fines avec une ligne
de rappel (leader line) vers l'element. Aspect "plan qui pourrait se DESSINER ligne par ligne". Pas de
remplissage plein lourd : surtout du CONTOUR (stroke), quelques aplats translucides legers. Epure, technique, lisible.
CADRE : viewBox="0 0 1024 1024", PAS de cercle — compose en planche rectangulaire pleine (marges ~40px). Tu PEUX
ajouter un cartouche/cadre technique fin sur les bords (id="frame-cartouche") et un petit titre de planche en bas.
""",
    "tactique": r"""
"SCHEMA TACTIQUE D'ETAT-MAJOR" — un diagramme militaire abstrait, SEC et fonctionnel (PAS une carte geographique,
PAS un joli plan d'ingenieur). Pense briefing militaire, ecran de commandement, doctrine d'alliance.
Palette STRICTE : fond bleu nuit tres sombre (#0b1526 / #16213a, le code le pose) ; traits PRINCIPAUX en BLANC
casse (#e8eef5) et BLEU ACIER (#5a8fc0) ; ROUGE-ORANGE (#d6552e) UNIQUEMENT pour la MENACE / l'agression exterieure ;
OR (#c8a951) UNIQUEMENT pour la SOLIDARITE / le lien d'alliance / le bouclier commun. Style : formes GEOMETRIQUES
nettes (cercles de noeud, lignes de liaison, fleches de vecteur, arcs de propagation), etiquettes courtes en
majuscules fines, une grille de fond tres discrete. SOBRE, conceptuel, lisible en 5 secondes — c'est un PRINCIPE
qu'on explique, pas un territoire. Pas de decor, pas de relief, pas de cotes d'ingenieur : des NOEUDS, des LIENS,
des VECTEURS, un BOUCLIER.
CADRE : viewBox="0 0 1024 1024", planche rectangulaire pleine (marges ~50px). Filet de cadre fin + petit titre
de briefing possible (id="cadre").
""",
    "braise-or": r"""
"GRAVURE CHAUDE A LA BRAISE ET A L'OR" — une scene gravee/ciselee dans un registre CHAUD et MATIERE (pas un schema
technique, pas de fleches, pas de grille de fond : une VRAIE SCENE evocatrice, comme une gravure ancienne coloree).
Palette STRICTE et CHAUDE : fond TERRE SOMBRE chaud (#1c1108 / #2a1a0d, le code le pose) ; masses et sol en OCRE et
TERRE DE SIENNE (#7a4a22, #9c5f2c, #b8763a) ; l'OR qui LUIT en jaune-ambre lumineux (#e8b44a, #f2cf72,
#ffe39a pour les rehauts les plus brillants) ; la chaleur / les braises / la lueur de guerre en ROUGE-ORANGE ARDENT
(#d6552e, #c23a1e, #8a2a12 pour les ombres rouges) ; rares rehauts ivoire chaud (#f2e3c0). AUCUN bleu, AUCUN cyan,
AUCUN gris froid. Style : gravure / taille-douce CHAUDE, lignes expressives, hachures directionnelles pour le volume
et les ombres (JAMAIS d'aplat noir plat lourd ; les ombres sont des hachures terre/rouge), l'or rendu par des aplats
lumineux + rehauts ; aspect chaud, ardent, premium (pense gravure d'orfevre + estampe coloree, lumiere de coucher de
soleil et de fournaise). Profondeur reelle par PLANS (arriere-plan brumeux chaud -> premier plan net et contraste).
CADRE : viewBox="0 0 1920 1080" (FORMAT PAYSAGE 16:9). Compose en LARGEUR : etale la scene horizontalement (plans
etages de gauche a droite et en profondeur), NE PAS empiler verticalement. Remplis genereusement le cadre paysage.
Tu peux poser un leger vignettage chaud aux coins (id="vignette") mais PAS de cartouche technique ni de grille.
""",
    "or-jour": r"""
"ILLUSTRATION CHAUDE ET LUMINEUSE — LEVER DE SOLEIL SUR LE DESERT" — une scene gravee/illustree CLAIRE, CHAUDE et
PREMIUM (PAS sombre, PAS depressive, PAS parchemin ancien). Lumiere de plein jour doree, comme un matin sur une terre
africaine. Palette STRICTE et LUMINEUSE : CIEL chaud CLAIR en degrade (ambre dore lumineux #f2cf72 / #ffd98a en haut
vers un horizon plus clair #ffe8b8 / ivoire chaud #f7eccf) ; NUAGES clairs (ivoire #f7eccf / ocre tres clair #e8c98a,
contours dores) ; TERRE OCRE CLAIRE et chaude (#c98a4a, #b8763a, rehauts sable clair #e0b878 — claire, pas brune
sombre) ; l'OR qui brille en jaune-ambre lumineux (#f2cf72, #ffe39a pour les rehauts, #e8b44a pour les faces d'ombre) ;
les contours et hachures fines en BRUN CHAUD CLAIR (#8a5a2c, pas noir). La lueur de guerre a l'horizon reste en
ROUGE-ORANGE (#d6552e) mais DISCRETE (elle contraste avec le jour clair). AUCUN bleu froid, AUCUN gris, AUCUN noir
plat lourd ; les ombres sont des hachures brun chaud ou des aplats ocre plus fonce, JAMAIS du noir. Aspect : matin
lumineux, chaud, optimiste en surface (le contraste avec le sujet grave fait la force). Profondeur par plans clairs.
CADRE : viewBox="0 0 1920 1080" (PAYSAGE 16:9). Compose en LARGEUR, etale horizontalement. Leger vignettage CHAUD et
DOUX possible (id="vignette"), surtout PAS un vignettage sombre qui assombrit (garde la scene CLAIRE et aeree).
""",
    "encre": r"""
"GRAVURE A L'ENCRE SUR PARCHEMIN" — une estampe / gravure sur bois ancienne, trait d'encre noir sur papier vieilli.
Palette STRICTE : fond PARCHEMIN CREME (#e8dcc0 / #ddcba6, ne le dessine PAS forcement, le code peut le poser, mais
tu peux poser une teinte de fond legere) ; TOUS les traits en ENCRE BRUN-NOIR (#2b2117 / #3a2c1c) ; ombres par
HACHURES fines (lignes paralleles serrees) et contre-hachures, JAMAIS d'aplat noir plein lourd ; rares rehauts par
le vide (laisser le parchemin). Style : gravure sur bois / taille-douce, trait expressif legerement irregulier,
hachures directionnelles pour le volume, aspect chaud et ancien. Pense Durer / estampe / illustration de vieux livre.
CADRE : viewBox="0 0 1024 1024". Tu PEUX cadrer dans un medaillon ovale/rectangulaire a filet d'encre (id="cadre"),
ou laisser pleine page. Compose la figure CENTREE et GENEREUSE (elle remplit le cadre).
IMPORTANT pour l'ORGANIQUE : privilegie le PROFIL et la SILHOUETTE expressive plutot que le rendu photo-realiste
de face ; la force de la gravure = le trait et les hachures, pas le detail anatomique parfait. Donne du caractere.
""",
}

# ----- Contraintes techniques communes (la technique prouvee, vaut pour TOUS les registres) -----
COMMON_TECH = r"""
CONTRAINTES TECHNIQUES STRICTES (non negociables — le SVG sera anime dans React/Remotion) :
- DECOUPE OBLIGATOIRE EN GROUPES NOMMES via <g id="...">...</g>. Chaque element qu'on voudra animer
  separement DOIT etre dans son propre groupe avec un id explicite. C'est LE point le plus important :
  la richesse d'animation depend du decoupage. Vise 7 a 12 groupes nommes.
- Coordonnees ABSOLUES dans le viewBox indique par le registre/la scene (PAS centrees sur 0,0). Respecte la
  TAILLE du viewBox precisee (carre 1024x1024 OU paysage 1920x1080 selon le registre) : adapte ta composition
  a ce cadre, ne deborde pas.
- Utilise UNIQUEMENT des elements SVG natifs (path, circle, rect, line, polygon, polyline, ellipse, g, text)
  avec des attributs STATIQUES. NE METS AUCUNE animation toi-meme (pas de variable, pas de <animate>, pas de CSS).
  Nous ajouterons l'animation cote code en pilotant transform/opacity/stroke-dashoffset de tes groupes.
- COMPOSE EN PENSANT AU GESTE : pour chaque element animable, isole-le dans son groupe (un flux dans son
  groupe pour le faire circuler ; une piece mobile dans un sous-groupe distinct pour la faire tourner/monter).
- Pour les elements qui se TRACENT (lignes/contours qui se dessinent) : fais-en des <path> ou <line>/<polyline>
  CONTINUS (stroke, pas fill) pour qu'on puisse appliquer un stroke-dasharray anime.
- Densite : riche et detaillee, mais chaque trait LISIBLE.

REPONDS EN JSON STRICT (et rien d'autre, pas de ```), de la forme exacte :
{
  "scene_svg": "<g id=\"...\">...toute la scene en JSX SVG, groupes nommes...</g>",
  "groups": ["liste", "des", "id", "de", "groupes"],
  "anim_suggestions": "pour chaque groupe animable, QUEL geste tu suggeres (ex: 'flux-petrole: monte le long du pipe ; tracé-structure: se dessine ; turbine: tourne'). Suggestion, on tranchera."
}
"""

SCENES = {
    "ville": r"""
SUJET DE LA SCENE : un PANORAMA de VILLE PORTUAIRE PETROLIERE vue de loin, au registre grave dore.
Elements attendus (compose-les en profondeur, du fond au premier plan) :
- ARRIERE-PLAN : ciel grave (hachures legeres ou soleil/lune cisele), eventuellement collines lointaines.
- PLAN MEDIAN : une skyline de ville (tours, immeubles de hauteurs variees, quelques cheminees d'usine/raffinerie
  qui crachent de la fumee), un ou deux reservoirs/cuves de stockage ronds.
- PORT au premier plan : un quai, des GRUES portuaires (mets le bras de grue dans un sous-groupe id distinct),
  un ou deux NAVIRES (cargo/petrolier) sur l'eau, des conteneurs empiles.
- EAU au premier plan : la mer/le port avec quelques vagues gravees.
Pense "scene qui respire" : fumee au-dessus des cheminees, grues, navires sur l'eau ondulante, reflets.
""",
    "etatmajor": r"""
SUJET DE LA SCENE : une CARTE D'ETAT-MAJOR MILITAIRE gravee (vue de dessus, "table de strategie"), registre grave dore.
Elements attendus :
- FOND : un territoire stylise grave (cotes, un fleuve sinueux, quelques reliefs hachures, une grille de
  coordonnees fine type carte ancienne). Pas une vraie geographie reelle — une carte d'etat-major generique elegante.
- 2 ou 3 VILLES/positions marquees par des symboles cibles (cercles concentriques, croix), chacune dans son groupe id.
- des FLECHES DE MANOEUVRE militaires (grandes fleches courbes indiquant un mouvement/une offensive) — chaque
  fleche dans son propre groupe id (on les fera se TRACER une par une).
- des ZONES de controle (aplats hachures delimites par un contour) — dans des groupes id (on les fera se remplir).
- une LEGENDE/cartouche grave dans un coin (rectangle a coins, quelques lignes), groupe id="legend".
- une ROSE DES VENTS / boussole gravee dans un coin, groupe id="compass".
Pense "carte qui se construit" : les fleches se tracent, les zones se remplissent, les cibles pulsent.
""",
    "plateforme-offshore": r"""
SUJET DE LA SCENE : une PLATEFORME PETROLIERE OFFSHORE en COUPE TECHNIQUE (schema d'ingenieur), registre blueprint.
Vue de cote en coupe, montrant a la fois ce qui est AU-DESSUS de l'eau et SOUS le fond marin :
- LIGNE DE MER : une ligne d'eau horizontale (ondulee legerement), avec quelques traits indiquant la surface ;
  groupe id="ligne-mer". Au-dessus = air, en dessous = colonne d'eau (hachures verticales tres legeres).
- LA PLATEFORME : un pont/topside rectangulaire avec un DERRICK (tour de forage en treillis) dessus, des
  modules/cabines, une torchere (flare) au bout d'un bras. La structure repose sur des JAMBES/colonnes qui
  descendent jusqu'au fond marin (jacket en treillis). Groupes : id="topside", id="derrick", id="flare-arm", id="jambes".
- LE FOND MARIN : une ligne de sol (seabed) avec hachures, en bas ; groupe id="seabed".
- LE PUITS / PIPELINE : un conduit (riser) qui descend de la plateforme, traverse l'eau, perce le fond marin et
  plonge jusqu'a un RESERVOIR DE PETROLE souterrain (une poche stylisee remplie de hachures, sous le seabed).
  Le conduit doit etre un PATH CONTINU (stroke) pour qu'on le fasse se tracer/le flux y circuler.
  Groupes : id="riser-pipe" (le conduit), id="reservoir" (la poche de petrole en bas), id="flux-petrole"
  (des marqueurs/fleches le long du conduit qu'on fera MONTER de la poche vers la plateforme).
- COTES & ETIQUETTES techniques : au moins 2-3 cotes de mesure (profondeur d'eau, hauteur plateforme,
  profondeur du puits) avec lignes de mesure + nombres ; quelques etiquettes en majuscules fines reliees par
  leader line (ex "DERRICK", "RISER", "RESERVOIR ~3000m"). Groupe id="cotes", groupe id="etiquettes".
- GRILLE de fond technique fine, groupe id="grille".
Pense "plan qui SE DESSINE puis le flux MONTE" : la structure se trace ligne par ligne (stroke-dasharray),
le conduit se trace de bas en haut, puis le petrole REMONTE le long du riser de la poche vers la plateforme,
le flare vacille, la mer ondule. Compose pour que le riser soit bien degage (espace pour les marqueurs de flux).
""",
    # ---- TESTS ORGANIQUES (sonder le mur : forme organique + justesse anatomique) ----
    "profil": r"""
SUJET DE LA SCENE : un PORTRAIT DE PROFIL d'une figure (buste, epaules + tete de PROFIL, regard vers la droite),
registre encre/gravure. C'est le test de la FORME ORGANIQUE HUMAINE stylisee.
- LE BUSTE : tete de profil + cou + epaules, drape/vetement suggere par quelques plis (hachures). Trait expressif.
  Groupes : id="tete" (le profil : front, nez, levres, menton en un contour continu), id="cheveux" (masse de
  cheveux travaillee aux hachures), id="buste" (epaules+vetement), id="oeil" (l'oeil de profil), id="cou".
- VOLUME par HACHURES : modele le visage et le cou avec des hachures directionnelles (joue, cou, sous le menton).
  Groupe id="ombres-hachures".
- FOND : un fond de hachures legeres ou un medaillon ovale a filet d'encre autour de la figure. Groupe id="cadre".
Pense "figure gravee qui pourrait s'animer subtilement" : isole l'oeil (clignement possible), la masse de cheveux,
le buste (respiration). Vise un PROFIL NET et expressif, pas un visage de face (la gravure aime le profil).
""",
    "duo": r"""
SUJET DE LA SCENE : DEUX PERSONNAGES qui INTERAGISSENT, en silhouettes/figures gravees, registre encre.
Une scene RELATIONNELLE : deux figures de 3/4 ou de profil qui se font face et accomplissent UN GESTE commun —
au choix le plus lisible : une POIGNEE DE MAIN (accord/alliance) OU une remise d'objet entre les deux. C'est le
test de la COMPOSITION A PLUSIEURS CORPS + interaction.
- PERSONNAGE GAUCHE : figure debout (tete, buste, bras tendu vers le centre). Groupes : id="perso-gauche"
  (le corps), id="bras-gauche" (le bras qui va vers le centre, dans un sous-groupe pour l'animer).
- PERSONNAGE DROITE : figure symetrique tendue vers le centre. Groupes : id="perso-droite", id="bras-droite".
- POINT DE CONTACT central (les mains qui se joignent / l'objet echange). Groupe id="contact".
- SOL / LIGNE D'HORIZON + fond de hachures legeres. Groupe id="fond".
- volume par hachures sur les vetements et les visages (de profil/3-4, pas de face detaillee).
Pense "les deux bras se TENDENT puis se joignent au centre" : compose pour que les bras puissent s'animer vers le
contact (espace entre eux au depart). Figures EXPRESSIVES mais stylisees (silhouette gravee, pas portrait realiste).
""",
    "animal": r"""
SUJET DE LA SCENE : un ANIMAL EMBLEMATIQUE heraldique (au choix, le plus noble : LION rugissant OU AIGLE deploye
OU cheval cabre), registre encre/gravure — comme un embleme de sceau ou de blason. Test de la FORME ANIMALE.
- L'ANIMAL CENTRAL, en pleine action (le lion rugit/leve la patte, l'aigle deploie ses ailes, le cheval se cabre),
  compose au centre, genereux. Groupes pour les parties mobiles : pour un lion id="corps", id="tete", id="patte-avant",
  id="criniere", id="queue" ; pour un aigle id="corps", id="aile-gauche", id="aile-droite", id="tete", id="serres" ;
  pour un cheval id="corps", id="tete", id="jambes-avant", id="criniere", id="queue". Choisis l'animal et adapte.
- VOLUME par HACHURES (musculature, plumes, criniere) — c'est la force de la gravure. Groupe id="ombres-hachures".
- CADRE heraldique : un medaillon/ecusson a filet d'encre autour. Groupe id="cadre".
Pense "embleme qui s'anime" : isole les parties qui bougent (ailes qui battent, criniere/queue qui ondulent, tete
qui rugit) dans des groupes distincts. Figure NOBLE, dynamique, expressive (registre sceau/blason).
""",
    # ---- SOUDAN "suivre l'or" : la MINE D'OR du Darfour, SCENE CHAUDE gravee (pas un schema) ----
    # TEST 2 (2026-06-21) : 100% objets manufactures + geometrie + naturel-non-figuratif. ZERO figure humaine.
    "mine-or-darfour": r"""
SUJET DE LA SCENE : une MINE D'OR INDUSTRIELLE A CIEL OUVERT au Darfour (Soudan), au registre GRAVURE CHAUDE
braise-et-or. C'est une VRAIE SCENE EVOCATRICE et MATIEREE (comme la gravure ciselee d'un derrick et d'un navire
sur une medaille — meme niveau de finesse), PAS un schema. On doit RESSENTIR la terre ouverte, l'or qu'on en tire,
et la guerre qui rode au loin. INTENTION : "suivre l'or" — de CETTE terre soudanaise sort la richesse qui paie la
guerre. Chaude, ardente, premium, qui respire.

⛔⛔ INTERDIT ABSOLU — AUCUNE FIGURE VIVANTE : PAS d'humains, PAS de silhouettes de personnes, PAS de mineurs,
PAS de mains, PAS de bras, PAS d'animaux, PAS de pelles/pioches tenues. Le SVG vectoriel rend MAL l'organique
figuratif (ca devient cartoon/deforme). L'extraction se raconte UNIQUEMENT par des OBJETS MANUFACTURES (machines,
structures en treillis, convoyeurs, wagonnets, coffres) et de la GEOMETRIE (terrasses, veines minerales) et des
ELEMENTS NATURELS NON-FIGURATIFS (terre, ciel, fumee, poussiere, or). Comme le derrick = l'industrie SANS ouvrier.
Tu PEUX et tu DOIS etre DENSE et riche en details (beaucoup de lignes droites/arcs nets d'objets manufactures =
c'est ta force), du moment que c'est du manufacture/geometrique. La richesse fait le premium.

COMPOSE EN LARGEUR (paysage 16:9, viewBox 1920x1080), en PLANS etages (profondeur) du fond au premier plan :
- ARRIERE-PLAN (id="bg-ciel") : un ciel de coucher de soleil ardent (ocre/ambre vers le haut, plus rouge vers
  l'horizon), un SOLEIL bas et cisele (disque + rayons graves rayonnants) cote droit. Hachures legeres pour le ciel.
- ARRIERE-PLAN LOINTAIN (id="bg-guerre") : a l'horizon, tres au loin et estompe (brume chaude), la LUEUR DE LA
  GUERRE — une ou deux colonnes de FUMEE noire-rouge qui montent (un front qui brule), SUGGEREE (element naturel,
  pas de batiments detailles). Le rappel discret que la guerre est au bout de l'or. Groupe pour la faire monter/onduler.
- COLLINES OCRE (id="mid-collines") : buttes de terre de sienne en plan median, hachurees pour le volume, qui
  encadrent la fosse. Lignes de strates geologiques (couches de terre) = belles hachures geometriques.
- LA FOSSE DE MINE (id="fosse") : au CENTRE, grande excavation a ciel ouvert en TERRASSES/GRADINS concentriques
  (les niveaux de la mine), descendant vers le fond — GEOMETRIE PURE de paliers et de rampes en lacets (les routes
  d'acces en zigzag qui descendent). Hachures directionnelles sur les parois. C'est le coeur, dense et net.
- L'OR QUI LUIT (id="or-filon") : dans les parois de la fosse, des VEINES / FILONS d'OR lumineux (aplats ambre
  brillants + rehauts ivoire) qui zebrent la roche — formes MINERALES (pas figuratives). Groupe pour le SCINTILLEMENT.
- LES MACHINES (id="machines") : l'extraction par le MANUFACTURE, comme le derrick de la piece. Au choix, dessine
  2-3 de ces objets en treillis/lignes nettes, repartis sur les terrasses : une TOUR DE LEVAGE / chevalement en
  treillis (structure triangulee comme un derrick), un CONVOYEUR incline (tapis a rouleaux qui remonte le minerai),
  un TREUIL / poulie, des WAGONNETS sur rails. Tout en lignes droites et arcs purs (ta zone de force). Sous-groupes
  pour les parties mobiles (id="convoyeur-bande" pour la bande qui defile, id="poulie" pour la roue qui tourne).
- PREMIER PLAN (id="fg-butin") : au tout premier plan en bas, le produit de l'extraction en OBJETS : un TAS de
  minerai dore (formes minerales empilees), des COFFRES / caisses cercles de metal, des LINGOTS empiles nets
  (parallelepipedes geometriques, pas ambigus), prets a partir. Groupe distinct (faire luire le butin).
- POUSSIERE (id="poussiere") : volutes de poussiere chaude qui s'elevent de la fosse et du convoyeur (element
  naturel non-figuratif). Groupe pour la faire monter et se dissiper.
Pense "scene qui RESPIRE et qui ARDENT" : la fumee de guerre monte au loin, l'or scintille dans les filons, la
bande du convoyeur defile, la poulie tourne, la poussiere s'eleve, le soleil bas pulse de chaleur, lente derive d'air
chaud. Laisse l'ESPACE pour chaque mouvement. Riche, dense, chaude, premium — niveau de finesse du derrick+navire.
""",
    # ---- SOUDAN "suivre l'or" version HEROS EPUREE (facon piece Senegal) ----
    # TEST 3 (2026-06-22) : leçon = la force du SVG n'est PAS le detail (Seedance ferait mieux), c'est le
    # CONTROLE TOTAL de 3-4 elements LISIBLES qui RACONTENT, + le pilotage COULEUR (notre signature).
    "or-darfour-hero": r"""
SUJET DE LA SCENE : "SUIVRE L'OR" du Darfour (Soudan) — une scene HERO EPUREE, registre gravure chaude braise-et-or.
PHRASE NARRATIVE a raconter en image : "Cet or sort de la terre du Darfour... et il finance la guerre."

⛔⛔ PHILOSOPHIE DE CETTE SCENE (LIRE D'ABORD — c'est l'inverse d'une illustration chargee) :
Ce N'EST PAS une illustration riche et detaillee. C'est une scene HERO MINIMALE et PUISSANTE, comme une gravure
sur une piece de monnaie : PEU d'elements (4-5 MAXIMUM), chacun GROS, LISIBLE a 100%, et porteur d'un SENS precis.
La force vient de la COHERENCE sens<->image, PAS du nombre de traits. Reference mentale : une face de piece gravee
ou un seul objet raconte tout. NE SURCHARGE PAS. Espace, respiration, lisibilite immediate. Si tu hesites entre
ajouter un detail ou epurer -> EPURE. Chaque element doit pouvoir etre "lu" en moins d'une seconde.

⛔ AUCUNE FIGURE VIVANTE (humain, visage, corps, main, animal) — le SVG les rend mal. Mais les OBJETS MANUFACTURES
a silhouette nette sont OK et souhaites (une pelle, un lingot, un coffre se dessinent tres bien).

⭐ DIRECTION VISUELLE = CONCRET ET ANCRE (PAS abstrait/flottant). On veut une VRAIE TERRE matieree avec un VRAI
LINGOT D'OR pose dessus (tangible, on pourrait le ramasser), et un ciel nocturne chaud avec des NUAGES — comme une
illustration de scene reelle, pas un embleme abstrait. Reference : la face du bateau-port du Senegal (objets reels
poses dans un decor reel), PAS un cristal symbolique flottant sur du noir.

COMPOSE EN LARGEUR (paysage 16:9, viewBox 1920x1080). Les 4-5 elements HERO, bien espaces, lisibles :
- LE SOL / LA TERRE DU DARFOUR (id="terre") : une VRAIE terre ocre MATIEREE qui occupe le bas de l'image (sol creuse,
  mottes, ondulations, hachures de strates et de texture pour donner la sensation de VRAIE TERRE remuee — riche en
  texture MAIS lisible). C'est un sol concret, pas un simple aplat. Le code pourra la faire VIRER AU ROUGE SANG, donc
  garde une base ocre franche. Quelques cailloux/details de sol sont bienvenus (texture, pas surcharge).
- LE LINGOT / AMAS D'OR — LE HEROS (id="lingot-or") : au CENTRE, UN gros LINGOT D'OR (ou un petit amas de lingots
  empiles) POSE sur la terre, CONCRET et tangible (parallelepipede net avec faces, brillance par rehauts ivoire
  #ffe39a sur ambre #e8b44a/#f2cf72, hachures de reflet). C'est le HEROS : le plus lumineux, l'oeil va dessus. Pose-le
  vraiment SUR le sol (ancre, ombre portee sur la terre), pas flottant. Le code le fera LUIRE / PULSER, puis plus tard
  un lingot pourra GLISSER hors-champ (l'or qui part financer la guerre). Donne-lui de la presence et du volume.
- LA PELLE PLANTEE (id="pelle") : UNE pelle plantee dans la terre, droite, manche vers le haut, simple et nette
  (manche = ligne/rectangle, fer = forme trapezoidale). IMMOBILE. Elle evoque le travail humain SANS dessiner
  d'humain (outil laisse sur place). Place-la pres du lingot, silhouette claire. Objet manufacture = tu le fais bien.
- LE CIEL NOCTURNE CHAUD + NUAGES (id="ciel") : un ciel de nuit chaude en fond (teintes ocre sombre / brun chaud,
  PAS bleu froid), avec 2-3 NUAGES stylises qui derivent (formes de nuages nettes facon gravure, comme la piece
  Senegal — PAS des zigzags). Eventuellement une lune/soleil bas tres discret. Le ciel pose l'ambiance, il ne vole
  pas la vedette au lingot. Le code pourra faire deriver les nuages doucement.
- LA LUEUR DE GUERRE A L'HORIZON (id="guerre") : a l'horizon, DERRIERE la terre, une LUEUR rouge-orange DOUCE et
  LISIBLE (un halo / une rougeur de braise a l'horizon, comme un incendie lointain) — SURTOUT PAS de zigzags ni de
  formes ambigues. Si tu mets de la fumee, fais une vraie colonne de fumee SIMPLE et reconnaissable (pas un gribouillis).
  Le code la fera ROUGEOYER / MONTER au moment cle ("la guerre"). Discrete au depart, lisible.

Pense "phrase visuelle pilotable", concret : au repos, le lingot luit doucement et les nuages derivent (la scene vit) ;
sur le mot "or" le lingot s'illumine fort ; sur "la guerre" la lueur de l'horizon rougeoie ET la terre vire au rouge
sang ; puis un lingot glisse et part. 4-5 gestes maximum, chacun limpide, synchronisable sur une voix. CONCRET, ANCRE,
EPURE — une vraie scene, pas un embleme abstrait.
""",
    # ---- SOUDAN "l'or DEVIENT la guerre" : LE CREUSET, transformation or -> armes (scene-heros epuree) ----
    "creuset-armes": r"""
SUJET DE LA SCENE : LE CREUSET — l'or fondu qui DEVIENT des armes. Une forge : un creuset verse une coulee d'OR
liquide dans des moules, et de ces moules SORTENT des formes d'ARMES. Registre gravure chaude braise-et-or, en
FORGE NOCTURNE (sombre, braises ardentes). PHRASE NARRATIVE : "cet or ne reste pas de l'or... il devient la guerre."

⛔⛔ PHILOSOPHIE (scene-HERO EPUREE, pas illustration chargee) : 3-4 elements MAXIMUM, chacun GROS, lisible en <1s,
porteur d'UN SENS. La force = la coherence sens<->image (la TRANSFORMATION or->arme), PAS le nombre de traits. Si tu
hesites entre ajouter un detail ou epurer -> EPURE. Espace, respiration, lisibilite immediate. Reference : une face de
piece gravee ou un seul geste raconte tout.

⛔ AUCUNE FIGURE VIVANTE (humain, visage, corps, main, animal — le SVG les rend mal). QUE des objets manufactures a
silhouette nette (creuset, four, moules, armes, lingots) + elements naturels non-figuratifs (braises, coulee, fumee,
etincelles). Le forgeron est SUGGERE par ses outils, jamais dessine. Tu PEUX etre dense en details MANUFACTURES.

COMPOSE EN LARGEUR (paysage 16:9, viewBox 1920x1080). Les 4 elements HERO, bien espaces, lisibles :
- LE FOUR / LA BRAISE (id="four") : a GAUCHE, la gueule d'un four de forge avec des BRAISES ARDENTES (rouge-orange
  #d6552e, coeur jaune #ffb060), structure de brique/metal stylisee. La source de chaleur. Le code fera PULSER les braises.
- LE CREUSET QUI VERSE (id="creuset") : au CENTRE-HAUT, un creuset/louche de fonderie INCLINE (forme de godet metallique
  sur un bras/pivot), penche pour verser. Le code le fera S'INCLINER (basculer pour verser) — mets-le dans un groupe
  pivotable, bec verseur vers le bas-droite. C'est l'objet qui declenche la transformation.
- LA COULEE D'OR (id="coulee") : un FILET d'OR LIQUIDE lumineux (#f2cf72/#ffe39a, rehauts ivoire #ffe8b8) qui tombe du
  bec du creuset vers les moules en bas. Doit etre un element VERTICAL degage (le code le fera COULER : s'allonger du
  haut vers le bas, puis ruisseler en continu). Laisse l'espace vertical sous le bec pour la coulee.
- LES MOULES + LES ARMES QUI EMERGENT (id="moules-armes") : en BAS a DROITE, une rangee de MOULES (formes rectangulaires
  de fonderie) ou l'or se solidifie. De ces moules SORTENT des formes d'ARMES nettes et reconnaissables en silhouette :
  des balles/cartouches (formes d'ogives), ou des canons/fusils stylises (lignes droites), encore dores (l'or devenu
  arme). C'est le SENS de la scene : l'or sort en arme. Le code fera APPARAITRE les armes une a une (elles "sortent"
  du moule par le bas, montent en place — un objet qui emerge de son moule, mouvement vertical legitime).
- BRAISES / ETINCELLES (id="etincelles") : quelques etincelles/braises qui montent du four et de la coulee (elements
  naturels non-figuratifs). Le code les fera monter et scintiller. Fond sombre de forge (le code pose le fond sombre).
Pense "phrase visuelle pilotable" : les braises pulsent (le four vit) ; le creuset BASCULE et VERSE ; la coulee d'or
DESCEND vers les moules ; puis les ARMES EMERGENT une a une des moules (la transformation s'accomplit) ; etincelles.
4 gestes maximum, chacun limpide, synchronisable sur une voix. La TRANSFORMATION or->arme DOIT etre le geste central.
""",
    # ---- AES : la clause de defense mutuelle (concept abstrait, PAS une carte) ----
    "defense-mutuelle": r"""
SUJET DE LA SCENE : le PRINCIPE DE DEFENSE MUTUELLE de l'Alliance des Etats du Sahel (AES) — "une agression contre
l'un est une agression contre les trois". C'est un CONCEPT ABSTRAIT (un pacte, une doctrine), PAS une carte
geographique. Registre tactique d'etat-major. INTENTION a faire ressentir : la solidarite INSTANTANEE et INDIVISIBLE
(la menace touche un seul, les trois ripostent comme un seul corps).
COMPOSITION (schema conceptuel, pas geo) :
- TROIS NOEUDS disposes en TRIANGLE (pas en position geographique reelle) — chacun un cercle/hexagone net avec une
  etiquette : MALI, BURKINA, NIGER. Groupes : id="noeud-mali", id="noeud-burkina", id="noeud-niger".
- LES LIENS D'ALLIANCE : trois lignes qui RELIENT les trois noeuds entre eux (les cotes du triangle), en OR =
  le lien de solidarite. Doivent etre des PATHS CONTINUS (stroke) pour se tracer. Groupe id="liens-alliance".
- LA MENACE EXTERIEURE : une grande FLECHE rouge-orange qui vient de l'exterieur du cadre et FRAPPE UN SEUL noeud
  (par ex. le noeud NIGER, en bas). Groupe id="menace" (la fleche d'agression).
- LA PROPAGATION : depuis le noeud frappe, une ONDE / des impulsions qui remontent INSTANTANEMENT le long des liens
  vers les deux autres noeuds (la solidarite se declenche). Groupe id="propagation" (marqueurs le long des liens).
- LE BOUCLIER COMMUN : un grand arc / demi-cercle OR qui se leve devant les trois noeuds (la riposte collective,
  l'alliance qui se protege). Groupe id="bouclier".
- ETIQUETTES : un petit titre "PACTE DE DEFENSE MUTUELLE · AES" + eventuellement "16 SEPT 2023 · CHARTE
  LIPTAKO-GOURMA". Groupe id="titre".
- grille de fond tres discrete. Groupe id="grille".
Pense "le principe se CONSTRUIT puis se DECLENCHE" : les 3 noeuds apparaissent, les liens d'alliance se TRACENT
(les relient), PUIS la menace frappe un noeud, l'onde se propage aux 3, le bouclier se leve. Compose pour que la
fleche de menace ait de l'espace pour entrer, et que le bouclier puisse se lever devant les noeuds.
""",
    # ---- FRANC CFA : le mecanisme de dependance monetaire (concept abstrait, PAS une carte). Scene de l'agent vierge (test reproductibilite 2026-06-21). ----
    "franc-cfa": r"""
SUJET DE LA SCENE : le MECANISME DU FRANC CFA — la dependance monetaire. Des pays africains doivent DEPOSER une part
de leurs reserves de change au TRESOR FRANCAIS (a Paris), en echange d'une garantie de convertibilite. C'est un
CONCEPT ABSTRAIT (un mecanisme, un rapport de force asymetrique), PAS une carte geographique. Registre tactique
d'etat-major. INTENTION a faire ressentir : la DEPENDANCE et le DRAINAGE — une richesse (les reserves) qui FUIT de
la peripherie vers UN centre unique exterieur, et un lien de subordination qui tient les pays en laisse.
COMPOSITION (schema conceptuel asymetrique, pas geo, surtout PAS un triangle egalitaire) :
- UN NOEUD-CENTRE DOMINANT en HAUT (centre-haut), GROS, marque comme le coeur du systeme : un CERCLE/hexagone
  fort contenant un COFFRE-FORT avec un CADENAS (les reserves retenues). Etiquette "TRESOR FRANCAIS · PARIS". C'est le
  point d'aspiration. Groupe id="centre-tresor" (le noeud), id="coffre" (le coffre+cadenas a l'interieur, sous-groupe
  qu'on pourra faire "se verrouiller").
- PLUSIEURS NOEUDS-PAYS PERIPHERIQUES (4 a 6) disposes en ARC / EVENTAIL en bas, plus PETITS que le centre (la
  hierarchie visuelle DOIT dire l'asymetrie). Chacun un petit cercle avec une etiquette courte. Groupe id="noeuds-pays".
- LES LIENS DE SUBORDINATION : des PATHS CONTINUS (stroke) qui relient CHAQUE pays peripherique AU centre unique
  (en eventail convergent). Groupe id="liens-dependance".
- LE FLUX DE RESERVES (le DRAINAGE) : des MARQUEURS le long des liens, peripherie VERS centre, qu'on fera MONTER.
  Groupe id="flux-reserves".
- LE FLUX RETOUR (GARANTIE) : un flux plus FIN, centre VERS peripherie, en OR fin. Groupe id="flux-garantie".
- UNE PART RETENUE : jauge/anneau de proportion au centre (ex "50% DES RESERVES DEPOSEES"). Groupe id="part-retenue".
- ETIQUETTES : titre "ZONE FRANC · MECANISME DE DEPOT DES RESERVES". Groupe id="titre". Grille discrete : id="grille".
Pense "le mecanisme se CONSTRUIT puis DRAINE" : les noeuds-pays apparaissent en arc, le centre s'impose, les liens
se TRACENT, PUIS le flux de reserves MONTE vers le centre (drainage = geste principal), le coffre se verrouille, la
jauge se remplit, un mince flux de garantie redescend. La hierarchie de taille + le sens du flux DOIVENT dire
l'asymetrie au premier coup d'oeil.
""",
}

# quel registre pour quelle scene
SCENE_REGISTRE = {
    "ville": "medaille",
    "etatmajor": "medaille",
    "plateforme-offshore": "blueprint",
    "profil": "encre",
    "duo": "encre",
    "animal": "encre",
    "defense-mutuelle": "tactique",
    "franc-cfa": "tactique",
    "mine-or-darfour": "braise-or",
    "or-darfour-hero": "or-jour",
    "creuset-armes": "braise-or",
}


def build_prompt(scene_key: str) -> str:
    reg = SCENE_REGISTRE[scene_key]
    head = ("Tu es un illustrateur SVG VECTORIEL pour une chaine video premium. "
            "Tu dessines dans un registre precis :\n" + REGISTRES[reg])
    return head + "\n" + COMMON_TECH + "\n" + SCENES[scene_key]


def gen_gemini(prompt: str, out: Path):
    from google import genai
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
    client = genai.Client(api_key=key)
    print(f"[gemini] {GEMINI_MODEL} ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=[prompt])
    text = resp.candidates[0].content.parts[0].text
    out.write_text(text, encoding="utf-8")
    print(f"[gemini] saved raw -> {out}  ({len(text)} chars)")


def gen_gpt(prompt: str, out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": prompt}]}
    print(f"[gpt] {GPT_MODEL} via OpenRouter ...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"[gpt] saved raw -> {out}  ({len(text)} chars)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scene", required=True, choices=list(SCENES.keys()))
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    prompt = build_prompt(args.scene)
    if args.provider == "gemini":
        gen_gemini(prompt, out)
    else:
        gen_gpt(prompt, out)


if __name__ == "__main__":
    main()
