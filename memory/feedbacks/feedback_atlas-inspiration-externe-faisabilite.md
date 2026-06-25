# Faisabilité — Inspiration externe (mapanimation Route Pack) pour ATLAS PUR

> Verdict 2026-06-03, session "double audit + voie B". **GO sans workaround.**
> Hypothèse Aziz validée : la veille mapanimation s'applique MIEUX à Atlas qu'à Souverain.

## Décision

- **Aziz achète le Route Pack 19,99 $ one-time** (30 générations / 90j, 2K/60s, sans watermark).
- **Modèle retenu : S'EN INSPIRER, pas en dépendre.** Le pack = banc de RÉFÉRENCE haute-fido
  (générer NOS cas exacts : Hannibal, Mansa Moussa, Peste) pour décoder le niveau premium,
  puis coder NOS templates Atlas d3-geo. PAS d'intégration de leurs MP4 (perte contrôle
  frame-précis, charte, SFX, dépendance quota). On veut le PRINCIPE de mouvement, pas le pixel.

## Point technique tranché : d3-geo headless EST le bon moteur (mieux que Mapbox ici)

Mon doute préliminaire ("fills clippés + reprojection délicats en d3 pur") était un RÉFLEXE
Mapbox MAL CALIBRÉ. Réalité Atlas :

- **Atlas = d3-geo PUR, zéro Mapbox** (`src/projects/atlas/`). Pays = `<path d={c.d}>` SVG
  PRÉ-PROJETÉS (mapConfig.ts / atlas-*-data.json). Projection FIGÉE (Mercator linéaire
  analytique `lngLatToSvg` dans `geoUtils.ts`, 2 points d'ancrage).
- **Caméra = `transform` SVG** (translate/scale/rotate), PAS de reprojection frame-driven.
  Donc un clipPath suit le pays automatiquement, sans recalcul par frame. **Plus robuste
  headless que Mapbox.**
- **clipPath DÉJÀ utilisé en render Atlas** (Beat2Setup, Beat4Climax, WalkToDestination) →
  preuve que "clipper un contenu animé dans une silhouette de pays" rend en headless.

## Les 7 effets du Route Pack mappent sur des briques Atlas EXISTANTES (enrichir, pas créer)

| Effet Route Pack | Brique Atlas existante | Faisabilité d3-geo |
|---|---|---|
| Radial empire expansion | `AtlasEmpire` + blueprint `empire-expansion` (strokeDashoffset+fill) | ✅ déjà à moitié là |
| Invasion directional fill | `<clipPath>` du pays + rect qui balaie (= SweepReveal en SVG natif) | ✅ plus simple qu'en Mapbox |
| Attack arrows (Bézier sweep) | `geoUtils` greatCircleRoute + bearingAlongRoute | ✅ trivial |
| Comet trail trade route | `AtlasCaravane` + dash animé | ✅ déjà là |
| Marching ants (bordures) | stroke-dasharray animé sur `d` frontière | ✅ certain |
| Alliance pulse wave | (≈ SequentialBorderPulse Souverain à porter) | ✅ élevé |
| Population counter | `CountUp` bounce (Souverain) à porter | ✅ certain |

Blueprints tactiques déjà présents : `empire-expansion`, `alliance`, `waypoint-march`,
`formation-march`, `walk-to-destination`, `confrontation`, `shake-impact`.

## Décodage 2e tour (6 réfs générées) + 2 découvertes majeures (2026-06-03)

Réfs dans `out/_r-and-d/mapanimation/atlas-test/` : hannibal, mali, route_comet, napoleon,
cargo (v1 large + v2 follow serré), thermopylae, cannae.

**DÉCOUVERTE 1 — Leur outil NE SAIT PAS faire les BATAILLES (limite DOUBLEMENT prouvée :
Thermopyles + Cannes).** Tous leurs effets reposent sur un trajet A→B (flèche/route à dessiner
sur distance). Une bataille = confrontation LOCALISÉE sans trajet → leur moteur s'effondre :
Thermopyles = placeholder vide (rectangle+pulse, 1.6 MB) ; Cannes = flèches minuscules perdues
(1.1 MB), échelle absurde (cadre toute la côte des Pouilles pour une plaine de 5 km), flèches
qui "apparaissent" au lieu de se dessiner, enveloppement illisible. Vaut pour ligne de front
ET manœuvre d'enveloppement. **CONSÉQUENCE STRATÉGIQUE : les batailles sont NOTRE exclusivité
PixelLab** (2 formations sprites face à face + terrain + rapport de force + pulse de choc —
4 choses qu'ils ne peuvent produire). Ne PAS gaspiller de générations sur les batailles.
Voir `ATLAS-PIXELLAB-PLAYBOOK.md §4` (échelle N0/N1/N2). NB : leur système EXIGE une localisation géo réelle.

**DÉCOUVERTE 3 — Leur limite FONDAMENTALE = boîte noire non déterministe (analyse Aziz, validée).**
3 avantages décisifs de NOTRE approche (templates d3-geo) sur leur outil :
1. CONTRÔLE TOTAL (couleur/pulse/glow/timing en props) vs figé dans leur génération.
2. SÉQUENÇAGE PROPRE frame-précis (flèche s'arrête, on voit où, repart) — ce que leur Cannes RATE.
3. DÉTERMINISME : pas de templates nommés/réutilisables chez eux, on ne sait jamais le résultat
   ("surprise", piloté au texte seul). Nous = on obtient exactement ce qu'on code, à chaque render.
Leur SEUL avantage réel = VITESSE (taper une phrase vs coder). → Place de mapanimation dans notre
flux : BANC DE R&D / INSPIRATION, JAMAIS outil de livraison. Verdict Aziz : "ce qu'on a est très
supérieur" — confirmé pour la PRODUCTION (le contrôle+PixelLab gagne ; leur vitesse ne sert qu'au proto).

**DÉCOUVERTE 2 — Le mode "light/minimal" (Napoléon) >> dark : l'action ressort.** Carte ivoire +
flèche rouge nette = lisible et premium. Le dark Mapbox (Hannibal/Mali) écrase l'action (jaune
criard). Or le light EST notre charte Atlas parchemin native → avantage structurel sur eux.
Hiérarchie de qualité de leurs effets : flèches séquentielles (Napoléon) = meilleur ; comet
trail = en fait simple glow (notre AtlasCaravane fait aussi bien) ; cargo marqueur = anonyme
(plafond confirmé). Mali radial meurt à 13s (17s mortes).

## BRIQUE PRODUITE + VALIDÉE EN RENDER — AtlasAttackArrow (2026-06-03)

`src/projects/atlas/_shared/AtlasAttackArrow.tsx` — flèche d'attaque/mouvement qui se dessine
progressivement sur arc géodésique (greatCircleRoute), tête orientée tangente, marching ants,
séquençable (base de l'encerclement). 100% SVG coords carte → à placer dans le `<g transform
caméra>` du beat (hérite drift/zoom), headless-safe. Validé render :
`out/_r-and-d/mapanimation/atlas-test/arrow-demo/arrow-demo-polish.mp4` (Bamako→Tombouctou→Gao
puis Gao→Agadez). Démo = `AtlasAttackArrowDemo.tsx` (compo Root R&D, à retirer ou garder).
Polish appliqué : têtes fines, carte LIGHT (nouveau mode via props `oceanColor/landColor/
strokeColor` ajoutées à AtlasMercator, défaut inchangé = zéro régression).

**FRICTION TECHNIQUE — RÉSOLUE 2026-06-03 (voir ci-dessous).** La projection `lngLatToSvg` était
RÉGIONALE (ancrages Mali figés). Elle est désormais une FACTORY paramétrée :
- `makeLngLatToSvg(anchorA, anchorB)` — projection Mercator depuis 2 ancres écran connues.
- `centeredProjection(centerLon, centerLat, pxPerDegLon)` — plus intuitive pour une NOUVELLE
  région sans carte pré-projetée (on donne centre + échelle, idéal pour cadrer une bataille).
- Catalogue `PROJECTIONS` : `.mali` (défaut, = ancienne projection figée, ZÉRO régression),
  `.mediterranee` (Hannibal vue large), `.cannae` (échelle locale plaine), `.europe`, `.grece`.
- Les helpers de route (`positionAlongRoute`, `bearingAlongRoute`, `caravanePositions`) et
  `AtlasAttackArrow` / `AtlasEncirclement` acceptent une prop `projection` optionnelle.
Règle inchangée : chaque épisode hors zone passe SA projection — ne jamais réutiliser Mali
aveuglément. Mais c'est maintenant 1 ligne (`projection={PROJECTIONS.cannae}`), pas un refactor.

## ENRICHISSEMENT 2026-06-03 — Multi-flèches + projection paramétrée (DIFFÉRENTIEL prouvé)

`AtlasEncirclement.tsx` — orchestrateur de N flèches tactiques coordonnées (encerclement,
tenaille, enveloppement). Chaque flèche = `AtlasAttackArrow` piloté par sa fenêtre
[delay, delay+duration], MÊME projection injectée. Helper `pincerArrows(spec)` = manœuvre en
tenaille clé-en-main (2 ailes + centre appât). `geoUtils.bezierRoute(waypoints)` = route COURBE
(spline Catmull-Rom en coords géo) pour les ailes qui contournent (un great-circle reste droit
à l'échelle d'une plaine — il fallait courber la route, pas juste lisser le path).

**PROUVÉ EN RENDER : Cannes (216 av. J.-C.)** — `out/_r-and-d/mapanimation/atlas-test/encirclement/
cannae-demo.mp4` (catbox 806sj2). Séquençage frame-précis : Rome avance au centre (appât), PUIS
les 2 ailes puniques se referment en arc derrière elle, le piège flashe. C'EST le cas où
mapanimation échoue (flèches minuscules, enveloppement illisible) → notre exclusivité confirmée
SANS PixelLab, en pur d3-geo. PixelLab reste le sur-différentiel (sprites = acteurs), mais le
diagramme tactique seul suffit déjà à les battre sur les batailles.

Zéro régression : `AtlasAttackArrowDemo` (Mali) re-rendue identique. Le lissage Catmull-Rom de
`toPathD` adoucit juste les jonctions multi-waypoints (amélioration discrète).

## Conséquence : B = enrichissement ciblé, PAS refonte

Le socle existe. Le travail = (1) décoder les réfs Route Pack frame-par-frame (comme
PREMIUM-DECODE Souverain 06-03), (2) en tirer un PLAYBOOK ATLAS (miroir d3-geo du
SOUVERAIN-VISUAL-PLAYBOOK), (3) enrichir les briques existantes au niveau premium,
(4) valider sur un beat réel (Hannibal ou Mansa Moussa).

## Seul point restant à PROUVER par render (honnêteté)

Aucun blocage identifié, mais avant de promettre un système complet : faire 1 render de test
d'un effet "fill clippé qui balaie" (invasion sweep) sur un vrai pays Atlas, pour confirmer
que le clipPath + balayage rend net en headless à pleine échelle. Risque jugé FAIBLE
(clipPath déjà éprouvé en render), mais à cocher.

## Cas concrets prioritaires

- **Hannibal** : invasion fill + attack arrows + radial (Alpes → Rome). Code archivé
  `src/_archive/episodes-livres/atlas/hannibal/`.
- **Mansa Moussa** : comet trail trade route + empire radial expansion.
- **Peste 1347** (en cours, Beat 5) : directional fill propagation (a déjà
  DominoContagionFill/ContagionFlagSpread côté Souverain à porter).

Lié : [[feedback_mapanimation-veille-et-geoflow]] (voie Souverain).
