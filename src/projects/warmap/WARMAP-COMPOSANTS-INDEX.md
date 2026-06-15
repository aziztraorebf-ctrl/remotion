# WAR-MAP — COMPOSANTS-INDEX ("quand Aziz dit X → utilise Y")

> Catalogue du RÉUTILISABLE du 3e pilier. Miroir de `src/projects/_shared/COMPOSANTS-INDEX.md` (Souverain)
> et `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` (Atlas). Créé 2026-06-05.
> Référencé depuis `WARMAP-INDEX.md`. **Lire AVANT de coder une brique war-map** (réutiliser > recréer).
>
> ⚠️ État : **1 seule instance (Soudan)**. Les briques sont VALIDÉES mais encore couplées au moteur
> (`WarMapEngine.tsx`). Le découplage en composants génériques isolés se fera au 2e sujet (règle :
> généraliser au 2e cas concret, pas au 1er). Ce catalogue dit OÙ est chaque brique aujourd'hui.

---

## ⭐ NOUVEAUX COMPOSANTS `_shared/` — Sahel Session 2026-06-07

> `src/projects/warmap/_shared/` est maintenant CRÉÉ avec 3 composants génériques réutilisables.
> Headless-safe (opacité uniquement, jamais filter:blur), frame-driven (progress via interpolate).
> Différence clé vs AtlasAttackArrow : projection via `map.project()` (Mapbox) et non d3-geo.

| Quand tu veux... | Composant | Où | Props clés |
|---|---|---|---|
| **Flèche tactique qui pousse progressivement** (axe d'offensive, convergence, tenaille) sur carte Mapbox | `SahelAttackArrow` | `warmap/_shared/SahelAttackArrow.tsx` | `map`, `waypoints: [number,number][]`, `progress: 0→1`, `color`, `strokeWidth`, `headType`, `marchingFrame` |
| **Zones de contrôle qui grandissent organiquement** (expansion territoriale, contamination) | `TerritorialExpansion` | `warmap/_shared/TerritorialExpansion.tsx` | `map`, `regions: ExpansionRegion[]`, `startFrame`, `endFrame`, `frame`, `color`, `maxOpacity`. Données Act2 JNIM incluses dans `EXPANSION_REGIONS_ACT2` |
| **Flux de déplacés / migration en rubans animés** (corridors humanitaires, flux population) | `RefugeeFlow` | `warmap/_shared/RefugeeFlow.tsx` | `map`, `flows: FlowCorridor[]`, `frame`, `color`, `baseWidth`. Données Act4 Sahel incluses dans `REFUGEE_FLOWS_ACT4` |
| **⭐ OVERLAY DYNAMIQUE semi-transp/plein écran** (meubler une section vide, ajouter de l'info SANS tout forcer sur la carte — décision Aziz 2026-06-12) | `WarMapOverlayDynamic` | `warmap/_shared/WarMapOverlayDynamic.tsx` | `inAt`, `outAt`, `mode` ("card"=cartouche opaque carte visible autour / "fullscreen"=parchemin opaque ; "semitransp" BANNI), `accent`, `anchorPx` (relier à un point carte), `blocks[]` (déclaratif) OU `children` (libre). **Blocs animés composables** : `TitleReveal`, `Kicker`, `TokenRow`, `StatCountUp`, `QuoteType`, `BadgeRow`. RÈGLE : overlay TOUJOURS dynamique. |
| **⭐⭐ CARTE ASSOMBRIE + ÉLÉMENTS SUPERPOSÉS** (montrer un CONCEPT/accord/data SANS quitter la carte : on l'assombrit, ses contours/couleurs restent visibles, on superpose sceau/drapeaux/titre/schéma par-dessus = spotlight cinématographique — **TEMPLATE PRINCIPAL validé Aziz 2026-06-14, réutilisable largement**) | `WarMapDimmedOverlay` + helper `dimmedOverlayHole()` | `warmap/_shared/WarMapDimmedOverlay.tsx` | `frame`, `inAt`, `outAt`, `width`, `height`, `veil` (0.62), `haloColor`, `centerY`, `children` (la scène superposée). ⚠️ Si contours rendus par le moteur APRÈS l'overlay → percer un TROU (mask SVG) sous l'élément via `dimmedOverlayHole()` (réf : mask `confed-seal-hole` dans SahelWarMapEngine). NE PAS masquer TOUS les contours. Réf : confédération AES P4 (`p4-chantier3-confed-FINAL.mp4`, catbox xt8ztb). Doctrine : `WARMAP-GRAMMAIRE.md`. |
| **⭐⭐ SPLIT-SCREEN — 2 OU 3 mondes côte à côte** (DIVERGENCE/comparaison : carte AES\|data Paris, OU 3 pays/ressources juxtaposés. Incarne la dualité/juxtaposition. **TEMPLATE PRINCIPAL validé Aziz 2026-06-15**, promu R&D P5/P6) | `WarMapSplitScreen` | `warmap/_shared/WarMapSplitScreen.tsx` | `frame`, `inAt`, `outAt`, `width`, `height`, `orientation` (vertical/horizontal), **`panels` (2 OU 3 render-props)**, **`ratios[]` (largeurs, peuvent être ANIMÉES = effet accordéon : 1 volet s'élargit au climax)**, **`panelAppearAt[]` (apparition/remplissage séquencé par volet)**, `labels`, `connector` (traverse la séparation), `sepColor`. Réf 2 volets : CFA (`p4-cfa-FINAL.mp4`, 5fxlvp). Réf 3 volets : RESSOURCES (`p4-ressources-FINAL.mp4`, 88k2gg) — Mali\|Burkina\|Niger, accordéon (Niger s'élargit), pays colorié + icône. ⚠️ Si overlay PLEIN ÉCRAN : masquer carte Mapbox (`MAP_HIDE_WINDOWS`) ET contours moteur (`CONTOUR_HIDE_WINDOWS`) sur la fenêtre, sinon "on voit la carte à travers". Doctrine : `WARMAP-GRAMMAIRE.md`. |

**Showcase de validation** : `MapAnimationShowcase` (composition Root.tsx) — 40s, 3 segments.
Render : litter.catbox.moe/lhgy3u.mp4 (72h, 2026-06-07)

### ⭐ CONTOURS NATIONAUX COLORÉS (Sahel, Aziz 2026-06-14) — "touche de couleur épurée"

| Quand tu veux... | Mécanisme | Où | Règle |
|---|---|---|---|
| **Distinguer les pays par une touche de couleur SANS charger la carte** (1 ton par pays sur le contour national, draw-in + pulse aux moments clés) | `countryBorderPaths` (reprojetés/frame depuis `sahel-countries`) + rendu SVG au-dessus du grain + `SAHEL_COUNTRY_COLORS` + `COUNTRY_PULSES` + `CONTOUR_HIDE_WINDOWS` | `engine/SahelWarMapEngine.tsx` + couleurs dans `engine/SahelControlData.ts` | **UNIQUEMENT sur parties ÉPURÉES** (fond mosaïque = porte déjà la couleur, NE PAS ajouter). Contours s'EFFACENT sous tout overlay (jamais de cohabitation = bouillie). Respiration douce. Démo : compo `SahelCountryBordersTest`. |

**Couleurs pays** : Mali `#D98A3D` ocre · Burkina `#C0553C` brique · Niger `#4E8C7D` sarcelle.
**Réutiliser pour P4** : ajouter `partie4` au gate `partie3 || countryBordersTest` + fenêtres overlay P4 dans `CONTOUR_HIDE_WINDOWS`.

---

## 🧩 LES BRIQUES ACTUELLES (dans `engine/`)

| Quand tu veux... | Brique / mécanisme | Où | Règle |
|---|---|---|---|
| **Une carte de contrôle qui bascule dans le temps** (front, dominance, valeur 0..1 par région) | `WarMapEngine` (couche fill data-driven) + `sudanControlData.controlAt()` | `engine/WarMapEngine.tsx` + `engine/sudanControlData.ts` | Polygones admin-1, couleur interpolée par frame. Front glow sur états en bascule |
| **Des véhicules/unités qui avancent sur la carte** | `VEHICLES` + rendu sprite orienté | `engine/warmapVehicles.ts` + `engine/WarMapEngine.tsx` | Sprites Gemini top-down, orientés selon la marche + traînée. Taille ×1.45 |
| **Des personnes/réfugiés/figures qui se déplacent** (côté humain) | `REFUGEES` (jetons-visage mouvants) | `engine/warmapVehicles.ts` | Portrait Gemini en cercle. Sur la carte, jamais plein écran (R1) |
| **Incarner une figure ponctuelle** (chef, victime) | jeton-visage statique (`unitStyle: "token"`) | `engine/WarMapEngine.tsx` | Usage ponctuel/statique, pas pour remplacer les véhicules |
| **Poser une DONNÉE majeure** (chiffre sans équivalent carto : famine, PIB) | `WarMapOverlayData` ⭐ **_shared** | `_shared/WarMapOverlayData.tsx` | Fond SOLIDE parchemin, centré, fige l'action 7-10s. Data-driven (props : kicker, big, unit, sub, tagline, source, accentColor). Plus de dict hardcodé |
| **Expliquer ce qui se passe sur la carte** (exode, contexte) | `WarMapOverlayExplicatif` ⭐ **_shared** | `_shared/WarMapOverlayExplicatif.tsx` | Fond SEMI-TRANSPARENT, centré (jamais en haut), R4 : pas de voile carte. Props : title, text, topOffset, wobble |
| **Présenter une figure en gros** (portrait + légende) | `WarMapFigureOverlay` | `engine/WarMapDataOverlay.tsx` | Cercle parchemin. (Note : la figure du déplacé est passée en jeton-mouvant, voir R1) |
| **HUD date/horloge/pertes** | bloc HUD dans `WarMapEngine` | `engine/WarMapEngine.tsx` | Date plaque haut, pertes/légende bas, safe zones mobiles. Horloge = polish ouvert (→ JOUR N) |
| **Symbole véhicule SVG** (fallback sans Gemini) | `VehicleSymbol` | `engine/VehicleSymbols.tsx` | DÉPRÉCIÉ par les sprites Gemini. Garder comme fallback only |

## 🎬 2e SOURCE D'ANIMATION — MAPANIMATION (linking, comme Atlas)

> Aziz : mapanimation est notre 2e source d'inspiration d'animation. Les décodages SONT FAITS, les
> templates sont excellents, et ils s'appliquent DIRECTEMENT à la war-map (mouvement de troupes, axes
> d'attaque, flux de réfugiés = leur vocabulaire). À EXPLOITER pour enrichir les beats war-map.

| Quand tu veux... | Ressource (déjà décodée/codée) | Où |
|---|---|---|
| **Une flèche tactique** (axe d'offensive, poussée RSF/SAF) | `AtlasAttackArrow` (flèche géodésique séquentielle) | `src/projects/atlas/_shared/AtlasAttackArrow.tsx` + `AtlasAttackArrowDemo.tsx` |
| **Un encerclement / tenaille / pince** (poche, siège El Fasher) | `AtlasEncirclement` (pincerArrows) | `src/projects/atlas/_shared/AtlasEncirclement.tsx` + demo |
| **Vocabulaire de manœuvre** (colonne, ligne, flanquement, embuscade, repli) | décode BazBattles | `memory/atlas-decode/DECODE-bazbattles-manoeuvres.md` |
| **Catalogue mapanimation premium** (effets, flux, transitions cartographiques) | analyse + catalog | `memory/_r-and-d-mapanimation-PREMIUM-DECODE.md` + `memory/_r-and-d-mapanimation-catalog.json` + `memory/_r-and-d-mapanimation-ANALYSE.md` |
| **Faisabilité / verdict d'intégration** (ce qui marche chez nous) | feedback faisabilité | `memory/feedbacks/feedback_atlas-inspiration-externe-faisabilite.md` + `memory/feedbacks/feedback_mapanimation-veille-et-geoflow.md` |

**Note technique** : ces composants sont d3-geo (socle Atlas). War-Map prototype est Mapbox reskinné,
mais la **voie production war-map = d3-geo pur** (voir WARMAP-INDEX) → friction de projection nulle, ils
se brancheront directement. En attendant, leur PRINCIPE de mouvement (flèche qui pousse, pince qui se
referme) est réutilisable même en adaptant le rendu.

## 📐 CONVENTION DE RANGEMENT (où mettre une nouvelle brique)

Pour ne pas re-disperser le pilier quand il grandit :
- **Brique générique réutilisable** (overlay, marqueur, transition, mouvement) → `src/projects/warmap/_shared/` (À CRÉER au 1er composant vraiment générique, pas avant).
- **Donnée d'un sujet** (jalons, paths, fenêtres narratives) → `engine/<sujet>Data.ts` + `data/<sujet>.warmap.json`.
- **Une instance complète** (Soudan, Lobito...) → aujourd'hui dans `engine/` (Soudan) ; convention cible `src/projects/warmap/instances/<sujet>/` quand on découplera.
- **Un asset** (sprite, audio, géo) → `public/_shared/{sprites/warmap, audio/<sujet>, geo-data/<sujet>}`.
- **Enrichissement mapanimation** → `warmap/_shared/SahelAttackArrow.tsx` (Mapbox, FAIT) ou `AtlasAttackArrow` (d3-geo, Atlas). Ne PAS recoder depuis zéro.

## ⏳ À FAIRE quand le pilier grandit

- ✅ `_shared/` créé avec 3 composants (2026-06-07) — seuil atteint
- Extraire les briques génériques de `WarMapEngine` vers `_shared/` (overlays, HUD, jetons) au 2e sujet.
- **Previews visuelles** (start/mid/end, manifest) — `MapAnimationShowcase` est le premier preview.
- River Flow animation (fleuve Niger SVG animé) — 4e template, priorité basse, non encore codé.
