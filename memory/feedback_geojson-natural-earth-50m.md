---
name: Tracés pays/régions = Natural Earth 50m obligatoire
description: JAMAIS écrire un polygone GeoJSON à la main. Toujours utiliser Natural Earth 50m pour fidélité géographique BBC/NatGeo.
type: feedback
---

# Tracés géographiques = Natural Earth 50m

**Règle :** pour tout overlay SVG de pays/région/frontière dans Remotion + Mapbox, télécharger les coordonnées depuis Natural Earth 50m. Ne JAMAIS écrire un polygone à la main.

**Why :** test 2026-04-29 sur Atlas Tombouctou. J'ai d'abord écrit un polygone Mali à la main (24 points approximatifs). Aziz a tout de suite repéré l'écart avec les frontières fines de Mapbox sur la même carte. "L'audience géographique gueulerait." Avec Natural Earth 50m (474 points), le contour colle parfaitement aux frontières Mapbox = invisible que c'est un overlay.

**How to apply :**
1. Télécharger : `curl -sL "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson" -o data/ne_50m_countries.geojson`
2. Extraire le polygone (Python) :
   ```python
   import json
   with open('data/ne_50m_countries.geojson') as f: d = json.load(f)
   feature = next(f for f in d['features'] if f['properties']['ISO_A3'] == 'MLI')
   geom = feature['geometry']
   if geom['type'] == 'Polygon':
       coords = geom['coordinates'][0]
   else:  # MultiPolygon — prendre le plus grand
       coords = max(geom['coordinates'], key=lambda p: len(p[0]))[0]
   with open('src/mali-polygon.json', 'w') as f: json.dump(coords, f)
   ```
3. Importer dans Remotion : `import maliPolygonData from "./mali-polygon.json";`
4. Projeter via `map.project()` à chaque frame, dessiner via `<polygon>` SVG React

**Codes ISO_A3 utiles** : MLI (Mali), SEN (Sénégal), GHA (Ghana), CMR (Cameroun), DZA (Algérie), MAR (Maroc), TCD (Tchad), NER (Niger), BFA (Burkina Faso), CIV (Côte d'Ivoire), GIN (Guinée).

**Niveau 10m** disponible aussi pour zooms très serrés mais ~5x plus de points (overkill pour Shorts mobile).
