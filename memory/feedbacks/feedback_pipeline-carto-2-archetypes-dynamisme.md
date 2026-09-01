Session 2026-06-20 (suite du deep-dive Finary -> registre carto). Acquis systeme durables.

## 2 ARCHÉTYPES CARTO (les deux faisables, choix EDITORIAL par scene)
- **A = d3-geo PLAT parchemin** : carte dessinee creme quadrillee, 100% codee SVG, modulable (clair/sombre), zoom/dezoom par reprojection geoMercator frame-driven. FORT pour concept/abstraction/continuite. **Le plus EXTENSIBLE** (Aziz prefere pour pousser une scene : on peut y faire apparaitre/transformer/relier/dezoomer librement).
- **B = Mapbox GeoAfrique V5** : carte GRISE dark-v11 + applyGeoAfriqueV5 (water #1a3a5c, land #4a4a4a, border #c8c8c8, pays surligne or #c8a951). FORT pour ancrage geo reel/immersion. = style "Or du Ghana" (carte grise plate, PAS satellite).
- ⛔ Le choix se fait au STORYBOARD (generer A vs B cote-a-cote), PAS au breakdown.

## ⛔ REGLE STORYBOARD MAPBOX : frame de reference OBLIGATOIRE
Pour un storyboard d'archetype Mapbox, TOUJOURS joindre une frame GeoAfrique V5 reelle (carte grise, ex video "Or du Ghana" : `out/PRET-PUBLICATION/empire-ghana-FINAL-v2.mp4` ou `or-africain`). SANS elle, Gemini hallucine un look satellite/3D/VFX (colonnes lumineuses, vue orbitale) qu'on ne fait PAS. Prouve 2x cette session (1ere version VFX, 2e version satellite ocre = mauvaises). Avec la bonne ref -> fidele.

## 2 TEMPLATES BREAKDOWN CARTO créés (comble le trou "breakdown Mapbox" du NEXT-ACTION)
- `memory/doctrines/templates/PROMPT-BREAKDOWN-CARTO-PLAT.txt` (d3-geo : projection, path, fill, spotlight clipPath, coords reelles).
- `memory/doctrines/templates/PROMPT-BREAKDOWN-CARTO-MAPBOX.txt` (camera lon/lat/zoom/pitch par beat, 1 Map continue, jumpTo jamais flyTo, useClipFlags).
- Differents STRUCTURELLEMENT (A = clipPath/path/fill ; B = camera/fill-layer/DOM marker) -> 2 templates justifies, pas 1.

## ⛔ DYNAMISME (la grosse lecon) : "carte vivante" mais "carte vivante ≠ carte chargee" (OPPOSES, lecon A5)
Cause racine du "statique/safe/gris" des 1ers protos = on a brief epure/anti-surcharge SANS jamais demander le DYNAMISME. L'arsenal existait (SOUVERAIN-VISUAL-PLAYBOOK P2 drift camera, chaines carto premium dans STORYBOARD-MAPBOX) mais PAS branche dans le workflow carto. Corrige : les 2 templates imposent maintenant :
- REGLE DE RYTHME : ~5s un EVENEMENT, MAIS evenement = MOUVEMENT/TRANSFORMATION/COULEUR, JAMAIS un nouvel objet empile.
- CAMERA JAMAIS IMMOBILE (drift) + ZOOM NARRATIF (du large au detail, @reallifelore).
- ANTI-VIDE : jamais un point seul sur parchemin vide ; jamais de carte blanche (pays/mer teintes).
- ANTI-GRIS (surtout Mapbox) : couleur qui pop, drapeau plein, voisins surlignes.
- DEZOOM pour les flux : fleches d'export -> destinations REELLES visibles, pas dans le vide hors-cadre.
- POP-UPS ANCREES : valeur (%, operateur) reliee par trait/leader OU overlay solide bref, JAMAIS flottante au milieu.
- Chaines carto premium a citer : @geoglobetales/@jacquesadit, @reallifelore, @kingsandgenerals/@bazbattles, Bloomberg/Vox/Wendover.

## ⚠️ MAPBOX PITCH 32-35 (signale Aziz, A GRAVER au template MAPBOX prochaine session)
Notre semi-3D signature = pitch 25-35 (CAM_COUNTRY_APPROACH_DEFAULTS pitch:32 dans MapboxBase.tsx). L'agent B l'a OUBLIE -> carte plate/morne. A imposer dans le template : pitch 32 en vue pays/region, pitch reduit ~10-15 en vue large (sinon horizon deforme).

## style_exact (lecon session parallele, appliquee ici)
Breakdown carto a un champ `style_exact` OBLIGATOIRE par element (police nommee + hex de chaque couleur + epaisseur + style fleche/cadre/dasharray) + `palette_globale` figee. Charte PRIME, GPT complete. -> 0 divergence entre 2 agents codant en parallele (drapeaux/jauge/couleurs identiques).

## Presentation : render SEUL plein format
Toujours montrer le render seul a sa vraie taille (full HD scale=1) + la cible seule, JAMAIS un cote-a-cote rapetisse (ecrase l'echelle, fait juger faux). Cote-a-cote = outil de mesure (Claude+GPT), pas preuve de jugement Aziz.

Lie : [[CONTINUITE-SCENE-INTENTION-DABORD]] [[feedback_methode-storyboard-orchestration-guider]]. Dossier scene cobaye : `public/souverain/senegal-petrole-gaz/scene-gisements/`.
