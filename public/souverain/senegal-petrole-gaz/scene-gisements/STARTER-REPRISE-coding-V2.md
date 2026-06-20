# STARTER REPRISE — Coder la scène "3 gisements" V2 parchemin dynamique

> Session précédente (2026-06-20) : on a construit TOUT le pipeline carto sauf le code final de la V2. Cette session = CODER la V2.
> Tout le matériel est dans ce dossier `public/souverain/senegal-petrole-gaz/scene-gisements/`.

## CE QUI A ÉTÉ FAIT (acquis, ne pas refaire)
- Direction tranchée par Aziz : on POUSSE le **parchemin d3-geo plat** (plus extensible que Mapbox pour cette vidéo). Mapbox reste en réserve.
- 2 archétypes carto prouvés A→Z (scène A parchemin + scène B Mapbox V1) : catbox A `0l63br`, B `3z8qc8`. Fidélité storyboard impressionnante, MAIS trop statiques/safe (scène intrinsèquement statique + arsenal dynamisme pas branché).
- Storyboard V2 DYNAMIQUE généré : `storyboard-V2-parchemin-dynamique.png` (catbox `xnwwky`). Corrige : carte LARGE, zoom narratif, DÉZOOM pour flux Europe/Asie visibles, bascule navy. VALIDÉ Aziz comme direction.
- Breakdown V2 généré : `breakdown-V2-plat.json` (avec mouvement_camera par état, dynamisme).
- **Passe de vie écrite** : `PASSE-DE-VIE-V2-parchemin.md` ← LIRE EN PREMIER, c'est le plan effet-par-effet.
- Drapeaux SVG prêts : `flags/flag-au.svg`, `flags/flag-uk.svg`.

## CE QU'IL RESTE (cette session) : CODER la scène V2
1. LIRE `PASSE-DE-VIE-V2-parchemin.md` (décisions GARDE/DÉGRADE/ENRICHIT) + `breakdown-V2-plat.json`.
2. Base technique : `src/projects/_proto-16-9/ProtoCarto_ContinentDraw.tsx` (carte large reprojetable) + `ProtoEffect_Fracture.tsx` (mix couleurs, grain, anti-statique). Pattern zoom-out de projection prouvé en début de session précédente.
3. Coords RÉELLES (déjà dans breakdown) : Sangomar [-16.95,14.00], GTA [-17.05,15.90], Yakaar [-17.30,14.90], Dakar [-17.45,14.69].
4. Audio V3 : `audio/narration-v3-VALIDEE.mp3`, startFrom 52s. Scène 52→104s = 1560 frames @30fps. Timecodes mots-clés dans le breakdown.
5. Composition `SceneGisementsA_V2` dans Root.tsx, 1560f.
6. POINTS DURS À NE PAS RATER (corrections Aziz) : (a) JAMAIS de carte blanche/vide → pays voisins + mer teintés ; (b) DÉZOOM au moment des flèches → destinations Europe/Asie VISIBLES, pas dans le vide ; (c) valeurs (18%) RELIÉES par trait au gisement, jamais flottantes ; (d) goutte pétrole = 2D stylisé, PAS 3D ; (e) caméra jamais immobile (drift) ; (f) vivant par le GESTE, épuré par le NOMBRE (leçon A5).
7. Self-review : rendre 4 frames (1 par état) full HD scale=1 + LIRE. Présenter render SEUL plein format (leçon présentation, pas vignette). Puis MP4.
8. OPTION PixelLab (NON imposée) : si après coding la scène manque encore de vie, ajouter 1 sprite animé (derrick/tanker) sur le parchemin. Décider au cas par cas.

## SYSTÈME : ce qui a été gravé cette session (à connaître)
- 2 templates breakdown carto créés : `memory/doctrines/templates/PROMPT-BREAKDOWN-CARTO-PLAT.txt` + `-MAPBOX.txt` (comble le trou "breakdown Mapbox" du NEXT-ACTION). Enrichis du DYNAMISME (règle ~5s un événement = mouvement/transformation/couleur PAS objet empilé + chaînes carto premium @geoglobetales/@reallifelore + anti-gris + garde-fou A5).
- Leçon `style_exact` appliquée (charte figée + matière exacte par élément → 0 divergence agents).
- Leçon présentation : render SEUL plein format, jamais vignette rapetissée.
- ⚠️ CORRECTION template MAPBOX à faire (signalée Aziz, pas encore gravée) : imposer le **pitch 32-35°** (notre semi-3D signature, l'agent B l'a oublié → carte plate/morne) en vue pays/région, pitch réduit ~10-15° en vue large. + anti-gris renforcé.

## DÉCISIONS EN ATTENTE (Aziz)
- Valider le render V2 quand codé (plein format).
- Trancher PixelLab oui/non après avoir vu la V2 sans sprite.
- Si V2 validée → est-ce qu'on continue les autres scènes du Sénégal V3 dans ce registre parchemin dynamique ?
