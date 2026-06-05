# STATUS — War-Map Day-by-Day (3e PILIER Kora & Cartes)

> Cree 2026-06-05. Prototype COMPLET valide en session. 3e pilier (apres Souverain + Atlas),
> a structurer aux memes procedures rigoureuses la prochaine session. Voir [[DECODE-daybyday-warmap]]
> et la doctrine [[doctrines/WARMAP-PLAYBOOK]] (a creer = miroir SOUVERAIN/ATLAS-PLAYBOOK).

## Etat : PROTOTYPE COMPLET VALIDE (Soudan). Prochaine session = PHASE RECHERCHE.

Format = "every day of the war" (genre mapsinanutshell) mais en NOTRE identite : carte parchemin
Atlas flat top-down, data-driven, sprites Gemini top-down, overlays Remotion premium. Differentiel =
incarnation (objets/visages, pas blocs) + cote HUMAIN (consequences, pas explosions) + explicatifs
(comprehension, pas defilement muet). Angle africain sous-exploite (Soudan, RDC, Sahel).

## Compositions (dans `rnd-warmap`, Root.tsx)
- **`SudanWarMapVertical`** ⭐ TEMPLATE PRINCIPAL (9:16, overlay Remotion, carte CLAIRE). withOverlay.
- **`SudanWarMapEpic60`** ⭐ CULMINATION 60s (tout le stack : acte1 vehicules + texte-exode sur carte + refugies mouvants + acte2 + overlay famine plein ecran + climax partition). epic.
- `SudanWarMapTokensVertical` — variante cercles-personnages (USAGE PONCTUEL).
- `SudanWarMapFlat` (16:9) ; `SudanWarMap` (16:9 satellite, DEPRECATED).

Fichiers : `src/projects/_rnd/sudan-warmap/` — SudanWarMapFlat.tsx (moteur, props unitStyle/withOverlay/epic) ;
sudanControlData.ts (jalons OSINT + palette ATLAS + controlAt/jalonAt) ; warmapVehicles.ts (VEHICLES + REFUGEES + paths) ;
WarMapDataOverlay.tsx (overlay data + WarMapFigureOverlay) ; VehicleSymbols.tsx (SVG fallback, deprecated par Gemini).

## Les 4 briques (toutes validees, combinables, SEQUENTIELLES)
1. **Carte parchemin data-driven** — 17 etats Soudan (Natural Earth), control 0=RSF rouge / 0.5=or conteste / 1=SAF bleu, interpole par frame. Front glow sur etats en bascule. Palette ATLAS (cream #F2E5C8, ocean #3A5A7E, encre #3A2A18, gold #D4A574). pitch 0 top-down. Grain papier 0.28 multiply + vignette 0.20 (allege pour luminosite, Aziz).
2. **Sprites vehicules top-down** — GEMINI (PAS Recraft : [[feedback_sprites-topdown-gemini-vs-recraft]]). Orientes selon la marche + trainee. Taille x1.45 (lisibilite, Aziz). `tank-td-blue.png` / `tech-td-red.png`.
3. **Jetons-visage** — portraits Gemini en cercle. `portrait-saf/rsf/civil.png`. 2 usages : (a) cercles-personnages factions (ponctuel/statique, incarner une figure) ; (b) REFUGIES mouvants (jetons qui fuient le long de paths, comme les chars). REGLE : sur la carte, jamais plein ecran.
4. **Overlay Remotion** — 2 types (voir REGLES OVERLAYS ci-dessous). Count-up + metaphore N icones exactes (1 icone = 1 million) + source. Variants displaced/famine.

## REGLES DE DESIGN DU FORMAT (NON-NEGOTIABLE, Aziz 2026-06-05)

**R1 — Tout sur la carte sauf l'essentiel sans equivalent carto.** L'action (mouvement, incarnation, explicatif) vit SUR la carte. Le PLEIN ECRAN est reserve aux infos qui n'ont PAS de representation cartographique (ex. famine = pas de jeton -> plein ecran ; refugies = jetons mouvants -> texte sur carte). Supprime tout doublon (un overlay plein ecran qui repete ce que la carte montre deja = a retirer).

**R2 — Deux types d'overlays :**
- **Overlay DONNEE majeure (sans equivalent carte)** = fond SOLIDE parchemin, CENTRE, fige l'action ~7-10s. Ex. "25 millions / famine". C'est le temps fort de respiration.
- **Overlay EXPLICATIF (ce qui se passe sur la carte)** = fond SEMI-TRANSPARENT, CENTRE (PAS en haut — en haut n'accroche pas l'oeil, erreur v4), coupe l'action comme l'overlay motion. Ex. "L'exode".
- Les DEUX sont centres. Difference = solide (donnee) vs semi-transparent (explicatif).

**R3 — SEQUENTIEL, jamais simultane (parite Souverain/Atlas).** Ne PAS faire bouger plusieurs choses en meme temps (chars + visages + jetons = bordelique). Ordre : l'info s'affiche -> PUIS les jetons bougent SEULS pour illustrer le propos -> puis suite. Exception : un seul moment vraiment fort peut tout reunir. C'est la regle de comparite avec les autres piliers.

**R4 — Carte JAMAIS assombrie.** Identite parchemin lumineuse. Voile = cream clair, jamais noir.

**R5 — Rythme dwell par jalon** (laisse lire le bandeau, segment-cle plus long).

## Decisions Aziz (2026-06-05)
- Satellite 3D REJETE (se bat contre la donnee) -> flat top-down parchemin = identite + plan sprite.
- 9:16 = format principal (viral TikTok/Reels/Shorts, 22-60s "passe vite"). 16:9 pour le long.
- Recette sprites : Gemini (top-down precis) fond cream #d4c29d -> removeBackground Recraft. Recraft = lateral stylise uniquement.

## Rendus session (catbox, evolution)
satellite 9zo8jn · flat xeoz2d · flat+vehicules dg7cs0 · v2 affine czv0t5 · vertical fflmhv ·
tokens 0y6uzb · overlay fqwfoo · epic60 v1 fyksjo · v2 (chars+45%) 5ovre7 · v3 (refugies carte + icones exactes + lumiere) cxlahk · **v4 FINAL (overlay deplaces retire, texte exode sur carte) 4dwqit**.

## ANALYSE STRATEGIQUE — possibilites du pilier (Claude, valide Aziz 2026-06-05)
- **Ce n'est pas un "war-map", c'est un MOTEUR DE RECIT CARTOGRAPHIQUE TEMPOREL HUMANISE.** La guerre = 1er cas (le + dramatique). Le moteur anime TOUTE valeur qui change dans l'espace+temps : economie (corridor Lobito, mobile money, PIB), ressources (petrole/lithium qui s'allument, remplissage GERD), infra (ligne ferroviaire, fibre), HISTOIRE (expansion empire Mali/Songhai, routes caravanieres = terrain Atlas), demographie/sante. **Personne dans le genre ne fait le non-conflictuel** = differentiel + aere la ligne (pas "la chaine des guerres").
- **L'overlay = pont COURT->LONG.** En short = bref (qualifie le sujet). En long = chaque overlay se deplie en segment 1-2min. Le long n'est PAS un re-tournage = le short avec les pauses depliees. Avantage de production unique au genre (aucune autre chaine n'a de couche explicative depliable).
- **Le moteur = SEGMENT ATLAS, pas qu'une video autonome.** Comble le manque "deroule temporel sur carte" dans les Atlas (ex. expansion Mali sur 80 ans). Parle deja la langue Atlas (parchemin, d3-geo en prod). Nouvelle brique du vocabulaire Atlas (segment 15-20s).
- **Angle mort honnete** : non-violent = editorialement superieur MAIS algorithmiquement plus dur (pas de tension "qui gagne ?" gratuite). Pour les sujets positifs, la couche humaine + overlays NE SONT PAS un bonus, ils sont OBLIGATOIRES (ils creent la tension absente). Sujets conflit = se vendent seuls ; sujets construction = ont besoin de la narration.

## NEXT — PROCHAINE SESSION = PHASE RECHERCHE (massif)
1. **Structurer le 3e pilier aux memes procedures que Souverain** (NE PAS reinventer la roue) :
   - Skill preproduction `warmap-preproduction` (miroir `souverain-preproduction`/`atlas-video-preproduction`).
   - Doctrine `doctrines/WARMAP-PLAYBOOK.md` (miroir SOUVERAIN/ATLAS-PLAYBOOK) = consolider R1-R5 + 4 briques + analyse strategique.
   - Pipeline beat scorE si pertinent (miroir mapbox-session.py / beat-session.py).
   - Routage CLAUDE.md (table outils + table skills).
2. **Phase RECHERCHE = le coeur de la prochaine session.** Comment garantir les BONNES infos AVANT de construire : sources OSINT (ISW/ACLED/LiveUAmap GeoJSON ~85$/an/DeepStateMap), jalons par date, verif factuelle, schema de donnees (1 fichier de jalons -> tout en derive). C'est ce qui rend le pipeline recurrent realiste (code fait 1x, donnees repetees).
3. Voie production : basculer moteur sur **d3-geo pur** (socle Atlas) au lieu de Mapbox reskinne.
4. Idee Cannes/manoeuvre top-down (voir NEXT-ACTION.md).
