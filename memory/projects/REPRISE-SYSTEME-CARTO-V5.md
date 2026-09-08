# ⭐ REPRISE — Système CARTO V5 (point de continuité, session 2026-06-21)

> Ouvre la prochaine session, dis "continue carto" : ce fichier dit TOUT (état, ce qui marche, ce qui reste).
> Branche de travail : `feat/systeme-carto-v5` (NON mergée — finir la scène avant merge).
> Doctrine maîtresse : [[CARTO-OVERLAYS-PRINCIPES]]. Cible : [[CartoSouverainV5]].

## POURQUOI ce chantier (le contexte à ne pas reperdre)
Aziz a constaté que le système DATA-VIZ est solide mais le système CARTO ne l'était pas (à chaque carte il devait
revenir dire "ce n'est pas la bonne carte"). Audit fait : 8 registres carto en concurrence, 5 portes d'entrée,
doctrines contradictoires, AUCUNE cible canonique. Décision : bâtir le système carto avec la MÊME recette que le
data-viz (cible figée → pipeline → gate → preuve agent vierge). On a le modèle data-viz comme référence.

## ✅ CE QUI EST FAIT ET VALIDÉ (commits sur `feat/systeme-carto-v5`)
1. **Cible canonique `src/projects/_shared/mapbox/CartoSouverainV5.tsx`** — LE registre Souverain figé
   (navy #16213a / terres gris #4a4a4a / focus or #c8a951, Mapbox dark-v11 + applyGeoAfriqueV5, frame-driven).
   3 modes caméra validés par Aziz : `flat` (pitch 0, situation) · `country-relief` (pitch ~32, 1 pays) ·
   `regional-relief` (pitch ~54, cam basse groupe de pays). Démos : CartoSouverainV5Demo + ...RegionalDemo.
   Expose `onMapReady(map)` + DRIFT continu intégré (P5). Réfs validées : public/_shared/refs/cartes/carte-souverain-geoafrique-v5.jpg + short Sénégal publié.
2. **Anti-dérive PROUVÉ** (CartoGeoStickTest) : tout overlay = map.project()/frame, jamais left/top fixe.
   Test stress (dézoom 8.5→2.5 + pan + rotation 35° + pitch 40°) : la croix reste collée à Dakar au pixel.
3. **5 PRINCIPES OVERLAY gravés** → [[CARTO-OVERLAYS-PRINCIPES]] : P1 jamais texte nu→géoplaque · P2 plaque
   déportée océan/gauche · P3 leader FLÉCHÉ visible · P4 marqueurs gros+pulse rapide+viser au-delà du cercle ·
   P5 drift continu. (Issus des retours Aziz sur E1.)
4. **Pipeline storyboard→breakdown LLM éprouvé** : storyboard Gemini (ref carte V5) → breakdown JSON GPT-5.5
   (verdict catalogue/neuf + props + style_exact + timing). GPT-5.5+Gemini en parallèle = la divergence révèle
   les meilleures idées (validé). Storyboard : https://files.catbox.moe/omo36c.png. Breakdown : /tmp/carto-v5/breakdown-gisements-v5.json (REGÉNÉRER si /tmp purgé).
5. **Scène gisements complète sur V5** : `src/projects/souverain/senegal-petrole-gaz/beats/SceneGisementsV5Effets.tsx`
   (compo `SceneGisementsV5Effets`, 1560f). E1 COMPTER (sonar+plaques déportées+leaders) · E2 CONCRÉTISER
   (isolate+jauge 18% Petrosen+plaque) · E3 PROJETER (flux divergents GTA→Europe/Asie+gaz russe coupé) ·
   E4 SUSPENDRE (fantômes+Yakaar pointillé+popup Operateur:_+lignes de convoitise qui s'arrêtent). TOUS rendus/vérifiés.

## ⚠️ DÉCOUVERTE ARCHITECTURALE (importante)
Les effets "catalogue" (MapboxIsolateZone, GlassmorphismGeoPopup, GeoFlowConnection) sont des **cartes AUTONOMES**
(montent leur propre Mapbox), PAS des overlays posables sur une carte partagée. Donc pour la cible "1 carte continue",
on a codé les effets en **overlays SVG enfants** (couche `Effets` dans SceneGisementsV5Effets). 
→ CHANTIER SÉPARÉ documenté : extraire les effets du catalogue en briques composables (accepter une map externe).

## ✅ AJOUTÉ SESSION 2026-06-21 (soir) — SYSTÈME JETONS + PROJECTION DRAPEAU (tout prouvé par render)
> Doctrine source unique : **`memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`** (NE PAS dupliquer ailleurs).
- **Caméra-plonge "établir puis plonger"** (idée Aziz) : appliquée à E1 (`SceneGisementsV5Effets`) + showcase.
- **Jetons géo-ancrés** : `src/projects/_shared/mapbox/GisementTokens.tsx` — `TokenFrame` hexagonal 2 modes
  (navy=SVG animé / fill=image-drapeau-sceau), 5 kinds (gas/oil/sonar/flag/seal), **taille pilotée par le zoom**
  (anti-agglutination), uid anti-collision clipPath.
- **Projeter un drapeau SANS dérive** : `src/projects/_shared/mapbox/MapboxCountryFlagDecal.tsx` (source image
  découpée à la silhouette). ⛔ Les 2 anciennes méthodes BANNIES sur carte avec pitch : `useClipFlags`/`MapboxFlagFill`
  (SVG → DÉRIVE au pitch) · `addCountryFlagFill` (fill-pattern → CARRELLE au dézoom). Garde-fous écrits dans le code.
- **Hiérarchie pays** : aplat uni (neutre) / couleurs nationales (secondaire) / drapeau complet (héros).
- **Appel SVG dédié des jetons** : `scripts/tools/llm-gen-svg.py` (Gemini 3.1 Pro + GPT-5.5, 5 jetons en 1 appel).
  Verdict : **GPT-5.5 préféré** (plus riche : derrick, matière), Gemini ok (épuré). Garder les 2 pour l'instant.
- **Showcases GARDÉS (NE PAS supprimer)** : `_demos/TokenShowcaseV5.tsx` (5 jetons + plonge + decal + couleurs nat.)
  + `_demos/SvgTokenCompare.tsx` (Gemini vs GPT). Servent de référence + comparatif futur vs l'agent vierge.
- Renders : showcase final https://files.catbox.moe/wqq092.mp4 · drapeau decal https://files.catbox.moe/luldb5.mp4
  · compare SVG https://files.catbox.moe/6f8mjp.mp4

## ▶ CE QUI RESTE (prochaine session, ordre)
1. **TEST DE VÉRITÉ — agent vierge isolé** (worktree, NE voit PAS nos showcases) : doit reproduire le système A→Z
   (carte V5 + jetons + drapeau decal + couleurs nat.) du 1er coup. ⚠️ L'agent NE DOIT PAS supprimer son travail
   (garder son render pour comparer au nôtre). Divergences = trous de doctrine à combler.
2. **Peaufinage scène gisements** (`SceneGisementsV5Effets`) : popup E4 "Operateur:_" sur le continent (déporter, P2) ·
   plaque E2 débordait à gauche · jauge 18% lisibilité · flux E3.
3. **BRIQUE 3 — gate** : `scripts/tools/carto-selfreview.py` (registre V5, palette, anti-dérive, frame-driven, +
   anti-pattern : projeter drapeau via useClipFlags sur carte pitchée = WARN → MapboxCountryFlagDecal). + UNE porte carto.
4. **Trancher** les contradictions doctrine (semi-transp banni-vs-défaut ; "carte jamais assombrie" vs WarMapDimmedOverlay).
5. Puis merger `feat/systeme-carto-v5` dans master.

## 🎥 RENDERS DE RÉFÉRENCE (catbox)
- Cible V5 (flat→relief) : https://files.catbox.moe/vj8391.mp4 · mode regional : https://files.catbox.moe/6jbv6p.mp4
- E1 (sonar+plaques+leaders+drift) : https://files.catbox.moe/rb66b8.mp4
- Storyboard effets : https://files.catbox.moe/omo36c.png

## ⛔ NE PAS OUBLIER
- Render Mapbox = `./scripts/render-mapbox.sh <compo> <out.mp4> --frames=A-B --scale=1` (WebGL, pas `remotion still`).
- GOTCHA render partiel COURT : la map Mapbox met ~15-20 frames à charger → un render `--frames=1185-1195` montre
  une carte GRISE/vide (artefact, PAS un bug). Toujours rendre un segment LONG (≥100 frames) pour juger une frame tardive.
- Idée registre-change (dark↔satellite, flat↔3D) prouvée dispo : [[carto-changement-de-registre]] (proto R&D futur + pari PixelLab/fumée).
