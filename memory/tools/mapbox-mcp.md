# Mapbox MCP Server — Règles et coordonnées validées

## Installation (2026-05-09)

Serveur ajouté dans `.mcp.json` du projet :
```json
"mapbox": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@mapbox/mcp-server"],
  "env": { "MAPBOX_ACCESS_TOKEN": "<voir .env REMOTION_MAPBOX_TOKEN>" }
}
```
Token utilisé : `REMOTION_MAPBOX_TOKEN` (pk. = token public, OK pour MCP).

## Catalogue capacités — par cas d'usage narratif

> Lire ce catalogue AVANT de coder toute scène avec carte. Cocher ce qui s'applique.

### Placement et précision géographique
| Besoin | Outil MCP | Exemple Hannibal / Souverain |
|--------|-----------|------------------------------|
| Centroïde exact d'un pays ou ville | `search_and_geocode_tool` | "Niger", "Niamey", "Carthage" |
| Bounding box d'un territoire | `bbox_tool` | Encadrer l'Afrique du Nord pour cadrage caméra |
| Vérifier qu'un sprite est dans le bon pays | `point_in_polygon_tool` | Éléphant posé en mer → bug impossible désormais |
| Placer un label au centroïde exact | `search_and_geocode_tool` → `coordinates` | Label "Niger" centré sur le vrai territoire |

### Mouvement et trajectoires
| Besoin | Outil MCP | Exemple Hannibal / Souverain |
|--------|-----------|------------------------------|
| Distance réelle entre deux points | `directions_tool` | Carthage → Alpes = 2 097 km exact |
| Point à mi-chemin sur un trajet | `midpoint_tool` | "Jour 15" posé exactement entre Rhône et Alpes |
| Point à X km dans une direction | `destination_tool` | Camp d'Hannibal après 3 jours de marche |
| Angle d'orientation entre deux villes | `bearing_tool` | Sprites éléphants orientés vers le nord-ouest (pas à l'œil) |
| Matrice distances multi-villes | `matrix_tool` | Réseau routes commerciales Ibn Battuta en 1 appel |

### Zones et territoires
| Besoin | Outil MCP | Exemple Hannibal / Souverain |
|--------|-----------|------------------------------|
| Zone atteignable en X heures/jours | `isochrone_tool` | "Territoire sous contrôle carthaginois après 10 jours" |
| Fusionner plusieurs pays en un polygone | `union_tool` | Empire carthaginois = Tunisie + Algérie + Espagne du Sud |
| Intersection de deux territoires | `intersect_tool` | Zone de conflit entre deux empires |
| Différence (territoire A moins B) | `difference_tool` | Ce qu'Hannibal a conquis mais pas encore consolidé |
| Simplifier un polygone pour perf | `simplify_tool` | GeoJSON allégé pour render Remotion fluide |

### Validation et debug
| Besoin | Outil MCP | Exemple |
|--------|-----------|---------|
| Vérifier coordonnées existantes dans le code | `search_and_geocode_tool` | Comparer hardcodé vs MCP, corriger si écart >50km |
| Aperçu carte sans lancer Remotion | `static_map_image_tool` | PNG de validation avant de coder une scène |
| Point le plus proche d'une route | `nearest_point_on_line_tool` | Hannibal — col exact sur la ligne de crête des Alpes |

---

## Outils disponibles (validés)

| Outil | Usage |
|-------|-------|
| `search_and_geocode_tool` | Géocoder villes, pays, lieux → lon/lat précis |
| `reverse_geocode_tool` | lon/lat → nom du lieu |
| `directions_tool` | Distance et durée entre 2 points |
| `place_details_tool` | Détails d'un lieu (photos, horaires, etc.) |
| `category_search_tool` | Chercher par type de lieu |
| `static_map_image_tool` | Générer une image de carte statique |
| `distance_tool`, `midpoint_tool`, `bbox_tool` | Calculs géospatiaux Turf.js |

## Règles d'utilisation

**TOUJOURS utiliser le MCP pour toute coordonnée** — jamais hardcoder à la main.

### Géocoder un pays
```
search_and_geocode_tool(q: "Niger", types: ["country"])
```
Retourne le centroïde officiel du pays. Utiliser pour placer labels et caméra.

### Géocoder une ville
```
search_and_geocode_tool(q: "Tombouctou", country: ["ML"])
```
Toujours passer `country` pour éviter les homonymes USA.

### Gotcha — homonymes
`search_and_geocode_tool("Carthage")` retourne Carthage, Missouri USA en premier.
→ Toujours passer `country: ["TN"]` ou `proximity` près du lieu cible.
→ Carthage antique (Tunisie) = site archéologique, non géocodable directement. Utiliser Tunis (`10.1858, 36.8002`).

## Coordonnées validées (prêtes à réutiliser)

| Lieu | Longitude | Latitude | Notes |
|------|-----------|----------|-------|
| Tunis (= Carthage antique) | 10.1858 | 36.8002 | Hannibal point de départ |
| Tombouctou, Mali | -3.0138 | 16.7874 | Projet Mansa Moussa |
| Col du Mont-Genèvre (Alpes) | 6.6272 | 44.9274 | Traversée Hannibal |

## Test de distance validé

Tunis → Col du Mont-Genèvre : **2 097 km** route, ~27h.
Cohérent historiquement avec la traversée d'Hannibal (218 av. J.-C.).

## Note Hannibal — Premier terrain de test MCP (session suivante)

Quand on reprend Hannibal, tester dans cet ordre :
1. `search_and_geocode_tool` → vérifier toutes les coordonnées hardcodées existantes (Rhône, Mont-Genèvre, Rome, Carthage)
2. `bearing_tool` → orienter les sprites éléphants automatiquement selon la vraie direction de marche
3. `isochrone_tool` → visualiser la zone d'avancée de l'armée par étape (Beat 2 Rhône, Beat 3 Alpes)
4. `static_map_image_tool` → PNG de validation avant de coder chaque beat
5. `point_in_polygon_tool` → vérifier que chaque sprite est bien posé dans le bon territoire

### Priorité : tester les batailles schématiques AVANT Cavalry

Pour les scènes de bataille (Tessin, Trébie, Cannes) — **tester d'abord l'approche schématique en Remotion pur** avant de se lancer dans Cavalry.

Ce qu'une bataille schématique permet avec le MCP :
- Flèches directionnelles orientées via `bearing_tool` (angle exact de l'attaque carthaginoise)
- Zones colorées qui avancent/reculent (polygones Turf.js animés frame par frame)
- Encerclement de Cannes visualisé via `union_tool` + animation Remotion
- Positions des deux armées placées via `destination_tool` à distance réelle l'une de l'autre
- Chiffres des pertes qui apparaissent au bon endroit géographique

Style : carte militaire historique type Arte/documentaire — lisible, précis, faisable sans Cavalry.

**Décision à prendre en session Hannibal** : si la bataille schématique est suffisamment lisible et impactante → on garde. Si trop abstraite pour l'émotion voulue → on évalue Cavalry en complément. Ne pas partir sur Cavalry sans avoir d'abord testé le schématique.

## Règle universelle — tous projets utilisant Mapbox

S'applique à **Atlas, Souverain, et tout projet futur avec Mapbox**.

### Ordre de priorité strict (NON-NEGOTIABLE)

1. **MCP Mapbox en premier** — toujours, pour toute donnée géospatiale (coordonnées, distances, geocoding, GeoJSON)
2. **API REST Mapbox** (curl/fetch) — uniquement si le MCP est défaillant ou non fonctionnel après 2-3 essais, ou si la fonction requise n'existe pas dans le MCP
3. **Coordonnées hardcodées** — INTERDIT. Jamais de lon/lat inventé à la main.

Le bug Niger (label décalé par rapport au polygone) vient de coordonnées hardcodées approximatives.
Avec `search_and_geocode_tool`, le centroïde correspond exactement aux vraies frontières Mapbox
→ label toujours centré sur le bon territoire, quel que soit le projet.
