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
- Coordonnees ABSOLUES dans le viewBox 1024x1024 (PAS centrees sur 0,0).
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
