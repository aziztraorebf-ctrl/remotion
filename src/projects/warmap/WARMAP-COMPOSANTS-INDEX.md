# WAR-MAP — COMPOSANTS-INDEX ("quand Aziz dit X → utilise Y")

> Catalogue du RÉUTILISABLE du 3e pilier. Miroir de `src/projects/_shared/COMPOSANTS-INDEX.md` (Souverain)
> et `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` (Atlas). Créé 2026-06-05.
> Référencé depuis `WARMAP-INDEX.md`. **Lire AVANT de coder une brique war-map** (réutiliser > recréer).
>
> ⚠️ État : **1 seule instance (Soudan)**. Les briques sont VALIDÉES mais encore couplées au moteur
> (`WarMapEngine.tsx`). Le découplage en composants génériques isolés se fera au 2e sujet (règle :
> généraliser au 2e cas concret, pas au 1er). Ce catalogue dit OÙ est chaque brique aujourd'hui.

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
| **Faisabilité / verdict d'intégration** (ce qui marche chez nous) | feedback faisabilité | `memory/feedback_atlas-inspiration-externe-faisabilite.md` + `memory/feedback_mapanimation-veille-et-geoflow.md` |

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
- **Enrichissement mapanimation** → réutiliser les composants Atlas tactiques ci-dessus, ne pas recoder.

## ⏳ À FAIRE quand le pilier grandit (ne PAS sur-construire à 1 instance)
- Au **2e sujet** : extraire les briques génériques de `WarMapEngine` vers `_shared/` (overlays, HUD, jetons).
- **Previews visuelles** (start/mid/end, manifest) quand il y aura ≥3 templates réutilisables à montrer.
- Brancher `AtlasAttackArrow`/`AtlasEncirclement` dans un beat war-map réel (1er usage mapanimation concret).
