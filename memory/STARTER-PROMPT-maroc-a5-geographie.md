# Starter — Maroc A5 Géographie (prochaine session)

> Créé 2026-06-03. Le beat-thèse du Short Maroc (le plus long, ~37s, MAPBOX).
> Lire EN PREMIER : `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md` (doctrine carte) + ce fichier.
> Pipeline : `scripts/mapbox-session.py` (Phase 0 SCAN déjà fait ci-dessous, à confirmer/affiner).

## État du Short Maroc (vérifié render par render 2026-06-03)
Beat0 Hook ✅ · A2 Phosphate ✅ (`beat1-FINAL`) · A3 Cailloux ✅ (`a3-cailloux-FINAL`, Remotion) · A4 Acteurs ✅ (`beat3-FINAL`) · **A5 Géographie ❌ STUB (`Beat4Geographie.tsx`)** · A6 Question ✅ (`a6-question-FINAL`, Remotion).
**RESTE : A5 + assemblage final.**

## Le contenu d'A5 (script, ~60.6s→98s global)
> « Pour le Maroc : sortir du rôle de fournisseur de matière première — l'OCP fabrique désormais les composants des batteries. Pour l'Europe : réduire la dépendance à la Chine sans délocaliser loin — Volkswagen investit ici, le Maroc est à 2h de bateau de l'Espagne. Le Maroc ne choisit pas entre la Chine et l'Europe : il devient l'endroit où les deux fabriquent ensemble. Ce n'est pas de la diplomatie. C'est de la géographie industrielle. »

C'est le beat-THÈSE : le Maroc gagne par sa POSITION (pas sa politique). Climax = triangle Maroc-Europe-Chine.

## Découpage 3 sub-moments (frames locales, segment commence f1819 global)
| Sub | Frames locales | Texte-clé | Idée |
|-----|----------------|-----------|------|
| 1. Pour le Maroc | f0-440 (~14.6s) | OCP fabrique les composants | monter dans la chaîne de valeur |
| 2. Pour l'Europe | f440-880 (~14.6s) | 2h de bateau Espagne, VW investit | proximité = avantage |
| 3. Le triangle | f880-1120 (~8s) | les deux fabriquent ensemble + punchline | climax géopolitique |

Mots-pivots (global → local en soustrayant 1819) : "composants" f2135→f316 · "deux heures de bateau" f2532→f713 · "Volkswagen" f2415→f596 · "entre la Chine et l'Europe" f2650→f831 · "fabriquent ensemble" f2755→f936 · "géographie industrielle" f2890→f1071.

## Enchaînement premium proposé (1 seule Map continue, drift permanent, getCam(frame))

**SUB 1 — POSER LE MAROC** (continuité, PAS un hook choc — on est au milieu de la vidéo)
- `camCountryApproach(MAR [-7.092,31.791], {zoom:4.7, pitch:32, bearing:5})` — vue relief
- `MapboxFlagFill` geoName `["MAR","ESH"]` + **`useClipFlags` (vrais drapeaux HD, OBLIGATOIRE)**
- `GeoCountryPlaque` "OCP · composants batteries" + source, synchro mot "composants" (f316)

**SUB 2 — LE PONT VERS L'EUROPE** (cœur géographique = la distance EST l'argument)
- Drift caméra vers le **détroit de Gibraltar** (Maroc↔Espagne dans le même cadre)
- `ComboFiberAuraPopup` : frontière Maroc trace (où) → onde détroit (quoi) → popup "179 km · 2h de bateau" (combien), calé f713
- `GlassmorphismGeoPopup` "Volkswagen · Tanger-Med" ancré, calé f596

**SUB 3 — LE TRIANGLE** (climax)
- Pull back planétaire (`CAM_MULTI_PULLBACK` zoom 3.4) pour faire entrer MAR+ESP+CHN dans le cadre — whip-pan blur 60f sur la transition
- `ContagionFlagSpread` waves `[["MAR"],["ESP"],["CHN"]]` color gold — propagation organique (pas de flèches)
- Overlay climax "C'EST DE LA GÉOGRAPHIE INDUSTRIELLE" carte assombrie, sur punchline (f1071)

## ⚠️ 3 SIGNALEMENTS (à traiter en début de session)

1. **`GeoClimaxOverlay` n'existe PAS en code** — il est dans le CATALOGUE en concept seulement. Pour le climax d'A5 : soit le CODER d'abord (petit, rapide, réutilisable), soit overlay texte custom. **Décision Aziz requise.**

2. **Le "vrai triangle" (arcs courbes convergents 3 pays) n'existe pas** — backlog Gemini. Deux voies :
   - (a) `ContagionFlagSpread` (propagation par vagues, pas d'arcs) — suffisant, dispo
   - (b) CODER `ConvergingFlows` (X pôles convergent vers un centre) — réutilisable (corridors, alliances, routes). **Plus premium pour un triangle. Mon avis : rentable. Décision Aziz.**

3. **Défi technique = 3 échelles caméra très différentes** dans 1 seule Map (focus Maroc → détroit → planétaire). Critique : `getCam(frame)` avec interpolations douces + whip-pan blur sur le saut planétaire. Tester la continuité tôt.

## Templates RÉELS dispo (scan fait 2026-06-03)
`MapboxFlagFill`, `useClipFlags` ⭐⭐, `GeoCountryPlaque`, `camCountryApproach`, `ComboFiberAuraPopup`, `GlassmorphismGeoPopup`, `ContagionFlagSpread`, `DominoContagionFill`, `SweepRevealTerritory`, `FiberOpticFlagInvade`, `MapboxIsolateZone`, `ResourceTextureFill`, Lottie `networkFlow()`.
Catalogues : `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` + `MAPBOX-COMPOSANTS.md`.

## Après A5 : ASSEMBLAGE FINAL
ffmpeg concat des 6 beats (Beat0→A2→A3→A4→A5→A6) + 1 narration globale + mix.
Pattern audio : `SOUVERAIN-REMOTION-SKELETON.md`. SFX : `SFX-INDEX.md` (plancher 0.50, vérifier durées).
Renders dans `out/episodes/maroc-batteries/`.

## Procédure démarrage
1. Décider signalements 1 & 2 (coder GeoClimaxOverlay ? ConvergingFlows ?)
2. `scripts/mapbox-session.py --phase storyboard` — Production Brief 3 sub-moments validé Aziz
3. Code getCam(frame) + overlays dans le fichier Mapbox · render animatic 35% pour itérer
4. self-review Mapbox → `gemini-mapbox-review.py` (seuil 8/10) → corrections → upload
