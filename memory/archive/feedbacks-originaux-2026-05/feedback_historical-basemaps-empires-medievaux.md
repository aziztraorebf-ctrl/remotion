---
name: Historical Basemaps GitHub — frontieres empires medievaux GeoJSON
description: Source academique GeoJSON pour empires historiques (Mali, Songhai, Ghana, Aksoum, Rome, etc.) par siecle. Reutilisable pour TOUS les episodes Atlas geo historiques.
type: reference
---

# Historical Basemaps — empires medievaux GeoJSON

**Repo** : https://github.com/aourednik/historical-basemaps
**Licence** : GPL-3.0 (usage libre avec attribution)
**Format** : GeoJSON un fichier par annee/siecle

## Decouverte 2026-04-29 — Atlas Mansa Moussa

Probleme : pour l'episode Mansa Moussa, on avait besoin du trace de l'Empire du Mali XIVe siecle. Natural Earth ne contient que les frontieres modernes. Aziz a refuse l'option "halo radial circulaire" (pas geographiquement honnete) et "polygone manuel" (notre regle interdit).

Solution : Historical Basemaps fournit `world_1300.geojson` avec polygone "Mali" de **52 points** correspondant a l'Empire pre-Mansa Moussa (Atlantique -> Niger).

**Test** : compare 1300 vs 1400. world_1300 = Empire a son apogee (lon -17.43 a 5.34, lat 10.11 a 18.76). world_1400 = Empire amputé post-declin (commence a lon 2.94, perte cote Atlantique). Pour Mansa Moussa (1324) : choisir 1300.

## Comment l'utiliser

### Etape 1 — Telecharger fichier annee voulue
```bash
cd quebec-jacques-poc
mkdir -p data
curl -sL "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1300.geojson" -o data/world_1300.geojson
```

Annees disponibles : `world_bc1500.geojson`, `world_100`, `world_500`, `world_1000`, `world_1100`, `world_1200`, `world_1279`, `world_1300`, `world_1400`, `world_1492`, `world_1500`, `world_1530`, `world_1600`, `world_1650`, `world_1700`, `world_1715`, `world_1783`, `world_1800`, `world_1815`, `world_1880`, `world_1900`, `world_1914`, `world_1920`, `world_1930`, `world_1938`, `world_1945`, `world_1960`, `world_1994`, `world_2000`, `world_2010`. Plus quelques BC.

### Etape 2 — Extraire le polygone via Python
```python
import json
with open('data/world_1300.geojson') as f:
    d = json.load(f)
for feat in d['features']:
    name = feat['properties'].get('NAME') or ''
    if name.lower() == 'mali':
        # MultiPolygon : prendre le plus grand
        coords = feat['geometry']['coordinates'][0][0]
        with open('src/mali-empire-1300-polygon.json', 'w') as f2:
            json.dump(coords, f2)
        break
```

### Etape 3 — Importer dans Remotion + projeter via map.project()
Pattern identique a Natural Earth (cf `feedback_geojson-natural-earth-50m.md`).

## Pattern visuel valide Mansa Moussa V2 (2026-04-29)

Pour distinguer "empire historique" de "pays moderne" :
- **Empire historique** : fill dore `#D4A574` opacity 0.30 + stroke pointille `strokeDasharray="12 6"` glow
- **Pays moderne** : fill indigo `#1F2A4A` opacity 0.55 + stroke plein dore glow
- **Mention courte 2-3s** pendant la phrase narrative pour expliquer la nuance
- **Sequence** : empire apparait d'abord (0.3-1.5s), puis pays moderne se superpose (1.8-2.5s) = effet pedagogique "voici l'apogee, voici aujourd'hui"

## Empires africains presents (verifies 1300)

A explorer pour futurs episodes Atlas :
- Mali (✅ verifie 1300 et 1400)
- Songhai (apogee XVe-XVIe, verifier world_1500)
- Ghana (apogee Xe-XIe, verifier world_1000 ou 1100)
- Kanem-Bornou (XIIIe-XIXe)
- Ethiopie / Aksoum (anciennetes diverses)
- Maroc / dynasties berberes (Almoravides, Almohades, etc.)

A chaque nouvel episode : chercher d'abord NAME du pays/empire dans le fichier de l'annee correspondante.

## Crédit obligatoire (GPL-3.0)

Description YouTube ou crédit footer 1-2s du Short :
> *"Traces historiques : Historical Basemaps by aourednik (GPL-3.0)"*

## Localisation fichiers projet
- Polygones extraits stockes dans : `quebec-jacques-poc/src/<empire>-<annee>-polygon.json`
- GeoJSON sources stockes dans : `quebec-jacques-poc/data/world_<annee>.geojson`
- Naming convention : `mali-empire-1300-polygon.json`, `songhai-1500-polygon.json`, etc.
