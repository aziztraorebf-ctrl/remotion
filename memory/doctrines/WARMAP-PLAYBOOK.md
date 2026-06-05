# WARMAP-PLAYBOOK — Doctrine du 3e pilier "Carte temporelle vivante"

> Cree 2026-06-05. 3e PILIER Kora & Cartes (apres Souverain + Atlas). Miroir de
> `SOUVERAIN-VISUAL-PLAYBOOK` / `ATLAS-PLAYBOOK`. A LIRE avant toute video war-map.
> **DERIVE DE CE QUI MARCHE** : prototype Soudan valide en session (2026-06-05).
> Sources : [[DECODE-daybyday-warmap]] (genre), [[episodes/warmap-daybyday/STATUS.md]] (etat),
> [[feedback_sprites-topdown-gemini-vs-recraft]] (recette sprites).

Format : 9:16 (1080x1920) principal — viral TikTok/Reels/Shorts, 22-60s. 16:9 pour le long.
Carte parchemin Atlas FLAT TOP-DOWN (pitch 0), data-driven. Moteur prototype = Mapbox light-v11
reskinne parchemin ; **voie production = d3-geo pur** (socle Atlas, a basculer).

**Ce n'est PAS un "war-map" : c'est un MOTEUR DE RECIT CARTOGRAPHIQUE TEMPOREL HUMANISE.**
La guerre = 1er cas (le + dramatique). Le moteur anime TOUTE valeur qui change dans l'espace+temps
(eco, ressources, infra, histoire, demographie). Voir §6 "Ouvertures".

---

## §1 — LE DIFFERENTIEL (vs mapsinanutshell & clones)

Le genre existant = constatation muette deshumanisee ("regarde le front bouger"). Nous = COMPREHENSION.
Les 3 angles morts du genre qu'on inverse :
1. **Objets INCARNES** (vs blocs insipides) — la carte a des acteurs (chars, technicals, visages), pas des abstractions.
2. **Cote HUMAIN** (vs explosions/chats) — on montre les consequences (deplaces, famine, visages), pas le spectacle.
3. **Explicatifs** (vs defilement muet) — on s'arrete pour expliquer, le spectateur SUIT.

Fil rouge : on transforme un format de CONSTATATION en format de COMPREHENSION. C'est la doctrine
editoriale Kora & Cartes (angle macro africain) rendue en mouvement.

## §2 — LES 4 BRIQUES (validees, combinables)

1. **Carte parchemin data-driven** — etats (admin-1 Natural Earth), valeur de controle/donnee 0..1 interpolee par frame -> couleur data-driven (rouge/or/bleu pour conflit ; adaptable). Front glow sur etats en bascule (`1-2*|v-0.5|`). pitch 0 top-down. Palette ATLAS §7. Grain papier 0.28 multiply + vignette 0.20 (lumineux).
2. **Sprites vehicules top-down** — GEMINI (pas Recraft). Orientes selon la marche (pointent vers le haut -> rotation = cap) + trainee directionnelle + ombre portee. Taille x1.45. Paths geo (lon/lat par fraction t).
3. **Jetons-visage** — portraits Gemini en cercle parchemin. 2 usages : (a) figures factions (ponctuel/statique, incarner un chef/acteur) ; (b) refugies/civils MOUVANTS (jetons qui fuient le long de paths). TOUJOURS sur la carte, jamais plein ecran.
4. **Overlay Remotion** — count-up overshoot + metaphore N icones EXACTES (1 icone = 1 unite, ex. 12M = 12 icones, 25M = 25) + source. Voir §3 pour les 2 types.

## §3 — REGLES DE DESIGN (NON-NEGOTIABLE, Aziz 2026-06-05)

**R1 — Tout sur la carte sauf l'essentiel sans equivalent carto.** L'action (mouvement, incarnation, explicatif) vit SUR la carte. Le PLEIN ECRAN est reserve aux infos qui n'ont PAS de representation cartographique. Ex : refugies = jetons mouvants + texte sur carte (PAS d'overlay plein ecran, serait un doublon) ; famine = pas de jeton -> overlay plein ecran legitime. **Tout doublon (overlay qui repete ce que la carte montre) = a supprimer.**

**R2 — Deux types d'overlays, les DEUX CENTRES :**
- **Overlay DONNEE majeure** (sans equivalent carte) = fond SOLIDE parchemin, centre, fige l'action ~7-10s. Temps fort de respiration. Ex. famine 25M.
- **Overlay EXPLICATIF** (ce qui se passe sur la carte) = fond SEMI-TRANSPARENT, centre, coupe l'action comme l'overlay motion. Ex. "L'exode". ⚠️ JAMAIS en haut de l'ecran (n'accroche pas l'oeil — erreur a corriger). Centre obligatoire.

**R3 — SEQUENTIEL, jamais simultane (parite Souverain/Atlas).** Plusieurs pieces en mouvement en meme temps (chars + visages + jetons) = bordelique. Ordre : l'info s'affiche -> PUIS les jetons bougent SEULS pour illustrer -> puis suite. Exception : un seul moment vraiment fort peut tout reunir. C'est la regle de comparite avec les autres piliers.

**R4 — Carte JAMAIS assombrie.** Identite parchemin lumineuse. Voile = cream clair (`{cream}59` env.), jamais noir.

**R5 — Rythme dwell par jalon.** Defilement non lineaire : DWELL sur chaque jalon (le bandeau a le temps de se lire) puis ease-in-out vers le suivant. Segment-cle (ex. contre-attaque) = dwell + duree plus longs.

**R6 — 9:16 = carte plein cadre + HUD en surimpression.** Date/horloge plaque centree haut, morts/legende/evenement empiles bas, safe zones mobiles (~6% haut, ~14% bas). Camera : zoom plus fort + recentrage axe d'action.

## §4 — RECETTE SPRITES (validee, reutilisable)

**Gemini pour le top-down precis, Recraft pour le lateral stylise.** Recraft echoue le top-down
(corpus lateral + "map" declenche un fond decoratif). Gemini reussit du 1er coup. Recette :
- `gemini-3.1-flash-image-preview`, decrire ce qu'on VOIT d'en haut piece par piece, marteler "STRICTLY from directly straight above, bird's eye orthographic", pointer vers le HAUT.
- Fond cream solide `#d4c29d` impose -> verifier pixel(4,4) ~ (212,194,157) -> **Recraft removeBackground** pour le PNG transparent.
- Detail complet : [[feedback_sprites-topdown-gemini-vs-recraft]]. Script modele : `gen_gemini_sprites.py`.

## §5 — PONT COURT -> LONG (avantage de production unique)

L'overlay est le pont : en SHORT = bref (qualifie le sujet). En LONG = chaque overlay se DEPLIE en
segment 1-2min de narration (carte avance -> pause -> on explique en profondeur -> reprend). Le long
n'est PAS un re-tournage = le short avec les pauses depliees. Un seul fichier de donnees (jalons par
date) -> produit nativement les DEUX formats. Aucune autre chaine du genre n'a cette elasticite.

## §6 — OUVERTURES (le moteur depasse la guerre)

Meme moteur, change le fichier de donnees + les sprites = nouveau sujet sans toucher au code :
- **Eco** : corridor Lobito, mobile money pays par pays, PIB par decennie.
- **Ressources** : petrole/lithium qui s'allument site par site, remplissage GERD annee par annee (geopo majeur NON-violent).
- **Infra** : ligne ferroviaire, electrification, fibre.
- **Histoire** : expansion empire Mali/Songhai/Ghana, routes caravanieres (= SEGMENT ATLAS, comble le "deroule temporel sur carte" manquant).
- **Demographie/sante** : recul maladie, urbanisation, migration.
**Angle mort honnete** : non-violent = editorialement superieur mais algo plus dur (pas de tension "qui gagne ?" gratuite). Pour le positif, la couche humaine + overlays sont OBLIGATOIRES (ils creent la tension absente). Conflit = se vend seul ; construction = a besoin de la narration.

## §7 — PALETTE & TYPO (heritee Atlas parchemin)

cream `#F2E5C8` (plaque) · ocean `#3A5A7E` · encre `#3A2A18` · outline `#1A1A1A` · gold `#D4A574` ·
terracotta `#C97D5A`. Factions reskin parchemin : SAF bleu `#3E6E9E`, RSF rouge brique `#B14B3C`,
conteste or `#C99A3A`. Typo : titres/chiffres Georgia/Cormorant Garamond 700, labels Cormorant,
dates/horloge mono tabular. Filtre papier `feTurbulence` natif (zero asset).

## §8 — NEXT : structurer le pilier (NE PAS reinventer la roue)

> ⭐ La couche DONNEES (phase recherche) a sa propre doctrine : [[doctrines/WARMAP-RESEARCH-PLAYBOOK]]
> (4 etapes ACLED->synthese->fact-check, classement fiabilite, contrat schema canonique, acces OAuth/CSV).
> Pipeline `scripts/warmap/` + schema `src/projects/warmap/schema.ts` codes 2026-06-05 (connecteur ACLED
> fixture-first, render Soudan byte-identique prouve).

Aux memes procedures que Souverain/Atlas (prochaine session) :
- Skill `warmap-preproduction` (miroir `souverain-preproduction` / `atlas-video-preproduction`).
- Pipeline beat scorE si pertinent (miroir mapbox-session.py / beat-session.py).
- Routage CLAUDE.md (tables outils + skills).
- **PHASE RECHERCHE = coeur de la prochaine session** : garantir les BONNES infos AVANT de construire.
  Sources OSINT (ISW/ACLED/LiveUAmap GeoJSON ~85$/an/DeepStateMap), jalons par date, verif factuelle,
  schema de donnees (1 fichier jalons -> tout en derive). C'est ce qui rend le pipeline recurrent realiste.
- Basculer moteur sur d3-geo pur (socle Atlas).
