---
name: Géographie zéro approximation — d3-geo + GeoJSON obligatoire, même hors Atlas
description: Toute forme de pays ou région doit venir de d3-geo + Natural Earth 50m. Jamais de SVG path approximatif fourni par 3.1-pro ou dessiné à la main. Règle s'applique à TOUS les projets, pas seulement Atlas.
type: feedback
---

# Géographie zéro approximation — règle universelle

**Validé** : 2026-05-13 — Beat 4 Zimbabwe. 3.1-pro avait fourni un SVG path polygonal approximatif ("simplified polygon placeholder"). Résultat : un cercle déformé sans rapport avec le Zimbabwe.

## La règle

**Toute géographie dans un beat = d3-geo + GeoJSON Natural Earth 50m.**

Ça s'applique à :
- Beats Atlas (déjà connu)
- Beats Souverain avec carte pays (Zimbabwe, Niger, Mali, etc.)
- Beats data-viz avec silhouette de pays
- Tout contour géographique quelle que soit sa taille à l'écran

## Comment faire

```bash
# Extraire le path SVG d'un pays via Node.js
node -e "
const topojson = require('topojson-client');
const d3 = require('d3-geo');
const fs = require('fs');
const topo = JSON.parse(fs.readFileSync('public/_shared/geo-data/countries-50m.json', 'utf8'));
const countries = topojson.feature(topo, topo.objects.countries);
const country = countries.features.find(f => f.id === 'ISO_NUMERIC');
const projection = d3.geoMercator().center([LON, LAT]).scale(SCALE).translate([W/2, H/2]);
const path = d3.geoPath().projection(projection)(country);
console.log(path);
"
```

**ISO codes utiles :**
- Zimbabwe : 716
- Niger : 562
- Mali : 466
- Burkina Faso : 854
- Sénégal : 686
- DRC : 180

**GeoJSON disponible** : `public/_shared/geo-data/countries-50m.json` (Natural Earth 50m, TopoJSON).

## Quand 3.1-pro donne un SVG path dans son breakdown

Le champ `filename_or_content` d'un élément `svg_path` fourni par 3.1-pro peut contenir un path approximatif. **Le remplacer systématiquement** par le path d3-geo extrait.

Signe que c'est un path approximatif : "M 480 320 Q 530 300 580 310..." — des coordonnées rondes trop régulières. Le path d3-geo réel a des coordonnées décimales irrégulières (ex: "M468.582,498.956L465.126,496.577...").

## Ajustement translation/scale dans le viewBox

Après extraction, la bbox du pays est connue. Pour centrer dans 1080x1920 :

```
bbox Zimbabwe : [[235, 224], [534, 498]] → center = (385, 361)
Target center dans 1920 portrait : (540, 560)
translate = (540 - 385*scale, 560 - 361*scale)
```

Tester avec scale=1.0 d'abord, ajuster visuellement.

**Why:** 3.1-pro fournit des paths SVG géographiques approximatifs "as placeholder". Ces placeholders produisent des formes méconnaissables (cercles, polygones vagues). Le public reconnaît mal son pays = perte de crédibilité éditoriale. Le d3-geo prend 2 minutes et donne la forme exacte.

**How to apply:** Quand le breakdown JSON contient un `svg_path` pour une géographie, ignorer le `filename_or_content` et extraire le path d3-geo avant de coder.

## Corollaire — coordonnées de DESTINATION héritées d'un prototype (2026-08-03, Gazoduc Acte 1)

La règle "zéro approximation" ne couvre pas que les FORMES de pays — elle couvre aussi les FAITS
géographiques (quel pays est la vraie destination d'un tracé, quelle frontière un flux traverse
réellement). Cas vécu : le code du globe D3 Gazoduc utilisait l'Espagne comme destination du
gazoduc AAGP depuis le prototype (`ProtoGazoducGlobeFusion.tsx`) — jamais vérifié contre le script
verrouillé (`SCRIPT-V3.md`). En préparant un fix de tracé côtier (sans rapport avec la destination
elle-même), la recherche de jalons géographiques réels a révélé que le script dit explicitement
"pour finalement atteindre le **Maroc**" — l'Espagne n'était qu'un pays client européen cité plus
tard (avec France/Italie/Allemagne), jamais la destination du pipeline.

**Cause racine** : le prototype avait été validé sur la MÉCANIQUE (est-ce que 2 tracés se dessinent
et divergent correctement), jamais sur l'exactitude FACTUELLE de chaque destination — une
coordonnée qui "marche" visuellement dans un prototype (le tracé se dessine, arrive quelque part)
n'a pas été vérifiée pour autant contre la source de vérité narrative.

**Règle étendue** : toute coordonnée géographique reprise d'un prototype antérieur (ou d'une
session précédente) doit être re-vérifiée contre le script verrouillé AU MOMENT de la production,
pas juste reprise telle quelle sous prétexte qu'elle fonctionnait dans le prototype. Grep le nom
du lieu dans le script verrouillé avant d'écrire la constante géo dans le fichier de production.
