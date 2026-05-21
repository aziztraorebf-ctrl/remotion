# Mapbox — Composants partagés GéoAfrique
> Créé 2026-05-06. Lire ce fichier AVANT d'écrire une composition Mapbox.

## Règle fondamentale

**Mapbox nécessite WebGL → ne peut PAS rendre headless (CLI `remotion render`).**
Preview uniquement dans Remotion Studio. Pour valider l'audio, générer un fichier mix séparé via ffmpeg.

---

## Fichier utilitaire principal

`src/projects/_shared/mapbox/MapboxBase.tsx`

Exports disponibles :

| Export | Usage |
|--------|-------|
| `MAPBOX_STYLES` | 5 styles prêts : dark, satellite, relief, light, navNight |
| `CamState` | Type caméra (lon, lat, zoom, pitch, bearing) |
| `lerpCam(a, b, t)` | Interpolation caméra avec easing quadratique |
| `CAM_PRESETS` | Caméras canoniques : space, westAfrica, ghana, mali, mediterranean, empireGhana |
| `removeLabels(map)` | Supprime tous les labels (carte épurée) |
| `addCountryHighlight(map, iso, color)` | Highlight pays par code ISO |
| `ISO` | Codes ISO pays africains (GHA, MLI, BFA, NER...) |
| `COUNTRY_CENTERS` | Coordonnées centres pays |
| `STYLE_GEO_AFRIQUE_V5` | Palette validée : water `#1a3a5c`, land `#4a4a4a`, border `#c8c8c8` |
| `applyGeoAfriqueV5(map)` | **TOUJOURS UTILISER** — applique palette + supprime labels en une ligne. Appeler dans `style.load`. Valide Or Africain 2026-05-07. |

---

## Styles validés visuellement (2026-05-06)

| Style | Rendu | Usage recommandé |
|-------|-------|-----------------|
| `dark` | Fond noir, frontières grises subtiles, routes fines | **Type B analytique — DEFAUT** |
| `satellite` | Photo NASA, continents réels | Hook depuis l'espace, impact immédiat |
| `relief` | Reliefs topographiques, courbes de niveau | Hannibal Alpes, traversées montagnes |
| `light` | Fond blanc/gris, propre | Infographie classique |
| `navNight` | Dark + autoroutes colorées | Routes, flux, migrations |

---

## Compositions POC disponibles

| Composition | Fichier | Format | Frames | Description |
|-------------|---------|--------|--------|-------------|
| `MapboxGhanaHighlight` | `poc-money-legends/MapboxGhanaHighlight.tsx` | 1920×1080 | 180 | Zoom espace→Ghana, highlight or, dark épuré |
| `MapboxAfricaMulti` | `poc-money-legends/MapboxAfricaMulti.tsx` | 1920×1080 | ~480 | 5 pays successifs avec mouvements caméra variés |
| `MapboxStyleShowcase` | `poc-money-legends/MapboxStyleShowcase.tsx` | 1920×1080 | 750 | 5 styles × 5s chacun avec badges |
| `MapboxTypeBVertical` | `poc-money-legends/MapboxTypeBVertical.tsx` | 1080×1920 | 870 | **TEMPLATE TYPE B** vertical, voix+musique+pings synchronisés |

---

## Pattern Type B validé — structure de base

```tsx
// 1. Zoom depuis l'espace vers le pays principal
CAM_INTRO → CAM_PAYS_PRINCIPAL  (0 → frame_allumage)

// 2. Gros plan pays principal + label
CAM_PAYS_PRINCIPAL  (frame_allumage → frame_pullback)

// 3. Pullback Afrique de l'Ouest + pays secondaires s'allument
CAM_PULLBACK  (frame_pullback → fin)

// Audio synchronisé via forced alignment ElevenLabs
// SFX ping à chaque frame d'allumage pays
```

## Règles non-négociables Type B (validées POC 2026-05-06)

1. **Carte épurée** — toujours appeler `removeLabels(map)` dans `style.load`
2. **Style dark par défaut** pour Type B analytique
3. **Nommer les acteurs explicitement** dans le script (jamais "six gouvernements")
4. **Années TTS** en lettres orales : "deux mille vingt-six" pas "vingt-vingt-six"
5. **Forced alignment** pour synchroniser les highlights avec la voix
6. **Mix audio séparé** (ffmpeg) pour valider l'audio avant render final

---

## Parchemin Mande Mapbox (à faire)

Style custom via Mapbox Studio — texture parchemin/papyrus, typo cartographique africaine.
Une fois créé : URL `mapbox://styles/azizbf12/<style-id>` à ajouter dans `MAPBOX_STYLES`.
Idéal pour épisodes Atlas (Mansa Moussa, Empire Ghana, Tombouctou).
