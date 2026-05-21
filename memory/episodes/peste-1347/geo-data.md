---
name: peste-1347-geo-data
description: Coordonnées lon/lat + GeoJSON + blueprint carte — La Peste et le Sahara 1347
metadata:
  type: project
---

# Données Géographiques — La Peste et le Sahara 1347

> Collectées via Mapbox MCP + aourednik historical-basemaps — 2026-05-15

---

## Coordonnées POI (lon, lat)

| Lieu | Lon | Lat | Notes |
|------|-----|-----|-------|
| **Caffa (Crimée)** | 35.382 | 45.030 | Feodosia moderne — point d'entrée Peste en Europe |
| **Sicile (Palerme)** | 13.360 | 38.120 | Premier port touché en Europe, oct. 1347 |
| **Paris** | 2.350 | 48.850 | Propagation nord |
| **Londres** | -0.120 | 51.500 | Propagation nord |
| **Stockholm** | 18.070 | 59.330 | Limite nord de la propagation |
| **Le Caire** | 31.241 | 30.048 | 7 000 morts/jour — déc. 1348 |
| **Tombouctou** | -3.014 | 16.787 | Ville Mali — hors zone Peste |
| **Niani** | -8.386 | 11.379 | Capitale Empire Mali 1347 |

---

## GeoJSON historiques — source aourednik (CC BY-SA 4.0)

**Fichier utilisé :** `world_1300.geojson` (plus proche de 1347 — `world_1400` aussi disponible)
**URL base :** `https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/`

### Empire du Mali (world_1300)
- **Type :** MultiPolygon
- **Bbox :** lon -17.4 → 5.3, lat 10.1 → 18.8
- **Centroïde approx :** lon -13.28, lat 13.93
- **Features trouvées :** Mali, France, Castile, Holy Roman Empire, Byzantine Empire

### Features absentes de world_1300 (à construire manuellement si nécessaire)
- England → utiliser GeoJSON Natural Earth 50m (`ne_50m_admin_0_countries`)
- Kingdom of Sicily
- Golden Horde (Crimée + steppe)
- Mamluk Sultanate (Égypte)

---

## Blueprint carte — vue principale

**Centre de carte recommandé :** lon 10, lat 25 (centré Méditerranée + Sahara)
**Zoom de base :** 2.8 (couvre Europe + Afrique de l'Ouest)
**Ratio 9:16 vertical :** recentrer sur lon 5, lat 22 pour laisser espace texte en bas

### Palette style Mapbox médiévale (à implémenter)
```json
{
  "ocean": "#1a2744",
  "land": "#c4a882",
  "sahara": "#d4b896",
  "borders": "#8b6914",
  "mali_fill": "#c8960c",
  "mali_stroke": "#8b6000",
  "europe_fill": "#8b3333",
  "europe_opacity": 0.35,
  "text": "#2a1a00"
}
```

---

## Animation propagation Peste — plan technique

### Séquence visuelle beat par beat (calée sur timing.ts)

| Beat | Frames | Vue carte | Action visuelle |
|------|--------|-----------|-----------------|
| HOOK | 2→225 | Vue large Europe+Afrique | Titre apparaît — carte immobile |
| SETUP_START | 241 | Zoom sur Caffa (Crimée) | Marker pin SFX-B → marker rouge apparaît |
| "Un navire accoste en Sicile" f345 | 345 | Drift vers Sicile | Marker SFX-B → Sicile rouge |
| "La Peste se propage" f491 | 491 | Vue Europe | Vague rouge commence depuis Sicile — SFX-C ink-draw |
| Paris f562, Londres f588, Stockholm f612 | 562→629 | Pan nord progressif | 3 markers SFX-B en cascade |
| SAHARA_BOUCLIER f659 | 659 | Zoom out — Sahara visible | Vague s'ARRÊTE au Sahara — highlight doré |
| DENSITE_START f714 | 714 | Angleterre highlight | Cartouche 46% SFX-D |
| CAIRE f1009 | 1009 | Pivot vers Le Caire | Marker orange SFX-B + cartouche 7000 |
| CLIMAX_START f1241 | 1241 | Vue Sahara plein écran | Overlay "barrière" — désert mis en valeur |
| VOICI f1434 | 1434 | Zoom Sahara | Animation biologique (puce/chaleur) |
| MALI_START f2323 | 2323 | Drift vers Mali (Afrique ouest) | Highlight Empire Mali doré |
| SOULEYMANE f2370 | 2370 | Mali centré | Route caravane Mali→Maghreb SFX-C |
| OR_CARAVANE f2641 | 2641 | Route Mali→Florence | Trail doré animé sur carte |
| PUNCHLINE_START f2975 | 2975 | Vue large finale | Deux zones — rouge Europe / doré Mali |
| NEUTRE f3142 | 3142 | Freeze frame | Titre final |

### Technique propagation vague
- **Pas** de librairie externe — cercle SVG `r` animé depuis Sicile (lon 13.36, lat 38.12)
- Rayon en degrés → convertir en pixels via projection Mercator
- Couleur : rouge sang `#8B0000` opacité 0.4, stroke 2px
- `clipPath` sahara pour que la vague s'arrête visuellement au Sahara (~lat 15-20°N)

---

## Composants Atlas réutilisables identifiés

| Besoin | Composant existant | Fichier |
|--------|-------------------|---------|
| Carte Mercator base | `AtlasMercator` | `atlas-components.tsx` |
| Marker pulsant | `AtlasPulseMarker` | `atlas-components.tsx` |
| Label ville | `AtlasLabel` | `atlas-components.tsx` |
| Chiffre choc | `AtlasCartouche` | `atlas-components.tsx` |
| Overlay empire | `AtlasEmpire` | `atlas-components.tsx` |
| Route caravane | `AtlasCaravane` | `atlas-components.tsx` |
| Hook globe | `AtlasGlobeHook` | `atlas-components.tsx` |

**À créer :** `AtlasPropagationWave` — cercle SVG animé + clipPath Sahara (nouveau composant)

---

## Fichiers GeoJSON locaux à créer

```
public/atlas/peste-1347/geo/
├── mali-1300.geojson          ← Empire Mali (aourednik world_1300, feature "Mali")
├── europe-highlights.geojson  ← Angleterre + France + HRE (Natural Earth 50m)
└── sahara-boundary.geojson    ← Limite approximative Sahara (clipPath vague Peste)
```
