---
name: natural-earth-iso-a3-minus99
description: Natural Earth 50m — France (et autres pays) ont ISO_A3="-99", fix obligatoire dans tous les precompute scripts
metadata:
  type: feedback
---

Natural Earth 50m (`ne_50m_countries.geojson`) attribue `ISO_A3: "-99"` à certains pays dont la France, au lieu de `"FRA"`. Le champ `ADM0_A3` contient la vraie valeur.

**Fix obligatoire dans tout precompute script d3-geo :**

```js
// MAUVAIS — France absente de la carte
const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";

// CORRECT — fallback sur ADM0_A3 quand ISO_A3 vaut "-99"
const iso3 = feat.properties.ISO_A3 || "";
const iso = (iso3 === "-99" || iso3 === "") ? (feat.properties.ADM0_A3 || "") : iso3;
```

**Why:** France (FRA), Norvège (NOR) et quelques autres pays ont `ISO_A3="-99"` dans Natural Earth 50m. Sans ce fix, ils sont silencieusement absents de la carte rendue — le bug est invisible jusqu'à ce qu'un marker de ville apparaisse dans l'océan.

**How to apply:** Appliquer ce pattern dans TOUS les futurs `precompute-*.mjs` dès la première ligne de `buildCountries()`. Déjà appliqué dans `precompute-peste-1347.mjs`.
