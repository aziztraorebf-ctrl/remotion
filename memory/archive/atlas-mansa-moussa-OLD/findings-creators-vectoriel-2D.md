# Findings — Créateurs cartes 2D vectoriel & techniques accessibles
> Recherche 3-agents (signaux récents · deep search · reverse-engineer) · 2026-05-01
> Pour : chaîne Atlas GeoAfrique, style Parchemin Mande, stack Remotion + d3-geo

---

## Résumé exécutif (TL;DR)

**Insight pivot, convergence 3/3 agents** : la niche "papercraft / 2D vectoriel éditorial cartographique" est **techniquement sous-occupée**. Aucun créateur indie <2M subs ne dépend d'un stack propriétaire lourd (After Effects PRO + GEOlayers 3 + Google Earth Studio). Les techniques signature de Cogito, PolyMatter, Knowledgia, Map Men, EmperorTigerstar sont **90% reproductibles avec Remotion + d3-geo + libs accessibles**.

**Le gap n'est pas technique — il est stylistique** : textures parchemin, typographie cartographique, motifs ornementaux, SVG filters natifs (pencil/grain).

**3 priorités à intégrer dans Atlas** :
1. **SVG filters natifs** (`<feTurbulence>` + `<feDisplacementMap>` + `mix-blend-mode: multiply`) → effet pencil/parchemin déterministe, sans Gemini drift.
2. **BellTopo Sans** (free, USGS-inspired, Sarah Bell) → typographie cartographique signature immédiate.
3. **Fork [florentpergoud/travel-map-maker](https://github.com/florentpergoud/travel-map-maker)** → pattern caravane/route Mansa Moussa déjà cabblé Remotion.

**Verdict stratégique** : pas de nouveau stack à chasser. Investir le budget dans **assets visuels signature** (police calligraphique Mande, textures parchemin haute-résolution, motifs bogolan vectoriels) — le différentiateur Atlas vs concurrence sera la direction artistique, pas l'outil.

---

## 1. Top créateurs / artistes / dev (10)

| # | Créateur | Audience | Stack confirmé/présumé | Pertinence Atlas |
|---|----------|----------|------------------------|------------------|
| 1 | **John Nelson** ([adventuresinmapping.com](https://adventuresinmapping.com/)) | Blog cartographe Esri | ArcGIS Pro + tutos open ("enthingify", Firefly, paper texture) | **★★★★★** — esthétique cartoon-overview proche Parchemin Mande, breakdowns publics récents |
| 2 | **Sarah Bell** ([sarahbellmaps.com](https://www.sarahbellmaps.com/)) | Cartographe indé + tutos YouTube | AE + Illustrator + ArcGIS Maps for Adobe | **★★★★★** — auteure police **BellTopo Sans** (free), shaded relief hand-drawn |
| 3 | **Cogito** ([youtube.fandom.com/wiki/Cogito](https://youtube.fandom.com/wiki/Cogito)) | ~1M subs, solo irlandais | AE classique, pas de GEOlayers | **★★★★** — texture éditoriale calme, palette sobre, 100% reproductible Remotion |
| 4 | **PolyMatter** ([Skillshare class](https://www.skillshare.com/en/classes/make-animated-youtube-videos/1143408374)) | ~1.5M subs | **Affinity Designer** + AE basique | **★★★★** — preuve qu'on fait 1.5M sans plugins lourds. Équivalent Remotion : Figma → SVG → Remotion |
| 5 | **Daniel Huffman** ([somethingaboutmaps.com](https://somethingaboutmaps.com/)) | Blog cartographe | Photoshop/Illustrator + tutos textures, halos, glows, blur | **★★★★** — techniques applicables SVG/Remotion |
| 6 | **Stamen Design** ([stamen.com/watercolor-process](https://stamen.com/watercolor-process-3dd5135861fe/)) | Studio cartographique | Watercolor tiles (Natural Earth + OSM) + raster filtering documenté | **★★★★** — process aquarelle reproductible en SVG filters |
| 7 | **EmperorTigerstar** ([Wikitubia](https://youtube.fandom.com/wiki/EmperorTigerstar)) | ~700k | **MS Paint frame-by-frame** + video editor | **★★★** — preuve que le stack peut être quasi-zéro ; logique frame-by-frame = ce que Remotion fait nativement |
| 8 | **Topi Tjukanov** ([tjukanov.org](https://tjukanov.org/)) | Lance #30DayMapChallenge, Senior Map Designer Mapbox | QGIS + Temporal Controller + Atlas | **★★★** — pipeline frames PNG → assemblage Remotion |
| 9 | **Map Men** ([Geographical interview](https://geographical.co.uk/news/map-men-where-comedy-meets-geography)) | ~1.5M | AE + props physiques + sketchs live | **★★** — référence rythme/humour, cartes statiques + zoom path = Remotion |
| 10 | **Andy Woodruff** ([andywoodruff.com](https://andywoodruff.com/blog/)) | Cartographe Boston ex-Axis Maps | D3.js + Observable | **★★** — proche techniquement de notre stack, blog avec breakdowns |

**Mention concurrents thématiques à monitorer** :
- **Mighty Africa** (`@Mighty_Africa`) — storytelling animé Afrique (Mali, Zimbabwe, Nzinga). Stack non documenté, esthétique illustrative pas pur 2D vectoriel. **Surveiller mensuellement**.
- **History Mapped Out** (`@History_Mapped_Out`) — cartes animées historiques flat/éditorial.

---

## 2. Outils alternatifs documentés (6)

| Outil | Coût | Courbe | Usage Atlas |
|-------|------|--------|-------------|
| **Lottie + LottieFiles map packs** | Gratuit (CC) | Très basse | Overlays animés (zoom-in, pulse, reveal) à composer par-dessus carte Remotion. JSON open. [LottieFiles maps](https://lottiefiles.com/free-animations/world-map) |
| **Rive** ([rive.app](https://rive.app/use-cases)) | Free 3 fichiers, $24/mois pro | Moyenne | State-machine 2D, marketplace world map + animated route. Export web/iOS |
| **Protomaps + PMTiles** ([protomaps.com](https://protomaps.com/)) | Gratuit, self-hosted | Moyenne | **Alternative Mapbox sans API runtime**. Tiles vectoriels OSM 1 fichier → CDN. Styles MapLibre JSON. [NPR slippy maps](https://blog.apps.npr.org/2024/11/26/slippy-maps.html) |
| **QGIS + Temporal Controller + Atlas** | Gratuit | Moyenne | Pipeline Tjukanov : exporter frames PNG → Remotion |
| **Felt** ([felt.com](https://felt.com/)) | Gratuit / $15+ | Très basse | Collaborative MapLibre, prototypage rapide |
| **Affinity Designer** | $70 one-shot | Moyenne | Vector design (PolyMatter stack), exports SVG → Remotion |

**Pas adoptés** :
- SaaS dominants hashtags (Mapimator, Mult.dev, anim8map, Mapcreator) — saturent `#mapanimation` mais pas reproductibles artisanalement.
- DaVinci Resolve Fusion — courbe élevée, peu d'avantage sur Remotion.

---

## 3. Repos GitHub fork-ables (8)

| Repo | Ce qu'il fait | Priorité |
|------|---------------|----------|
| [florentpergoud/travel-map-maker](https://github.com/florentpergoud/travel-map-maker) | Remotion travel map maker complet | **★★★★★ FORK PRIO** — pattern caravane/route Mansa Moussa direct |
| [alexfernandez803/animate-deck-gl](https://github.com/alexfernandez803/animate-deck-gl) | Remotion + deck.gl point animations (Peter Beshai inspiré) | **★★★★** — overlays particules path-following |
| [protomaps/basemaps](https://github.com/protomaps/basemaps) | Génération PMTiles + styles MapLibre éditoriaux | **★★★** — custom basemap "Parchemin Mande" sans Mapbox runtime |
| [zcreativelabs/react-simple-maps](https://github.com/zcreativelabs/react-simple-maps) + [react19-simple-maps](https://github.com/wovalle/react19-simple-maps) | SVG maps déclaratives d3-geo + topojson + react-spring | **★★★** — composable Remotion |
| [tjukanovt/30DayMapChallenge](https://github.com/tjukanovt/30DayMapChallenge) | Repo officiel + liens code participants | **★★★** — mine d'or de techniques |
| [stamen/watercolor](https://github.com/stamen/watercolor) | Code source raster watercolor pipeline | **★★** — reverse-engineering aquarelle |
| [d3/versor](https://github.com/d3/versor) + [vasturiano/d3-geo-zoom](https://github.com/vasturiano/d3-geo-zoom) | Quaternions zoom/rotation globe smooth | **★★** — pattern globe Mansa Moussa S1 hook |
| [remotion-dev/mapbox-example](https://github.com/remotion-dev/mapbox-example) | Officiel Remotion route Mapbox → MP4 | **★** — reference (Mapbox runtime déjà rejeté) |

---

## 4. Techniques d'animation cartographique 2D actionnables (10)

Liste prioritisée par ROI pour Atlas. **Bold = pas encore utilisée chez nous, à intégrer.**

1. **SVG filters pour effet pencil/parchemin natif** — `<feTurbulence>` + `<feDisplacementMap>` + `mix-blend-mode: multiply`. Source : [Here Dragons Abound](https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html). **Bénéfice** : zéro export raster, zéro drift Gemini, déterministe. **★★★★★ INTÉGRER**.
2. **Multiply blend mode paper texture overlay** — texture papier en `mix-blend-mode: multiply` (CSS) ou `<feBlend>` SVG. Tutos RetroSupply/CatCoq. **★★★★★ INTÉGRER**.
3. **Firefly glow cartography** ([Esri blog](https://www.esri.com/arcgis-blog/products/mapping/mapping/steal-this-firefly-style-please)) — points/lignes thématiques avec glow sur basemap sombre désaturée. CSS `filter: drop-shadow` répétés. **★★★★ TESTER** sur villes-clés Mansa Moussa.
4. **Versor zooming** ([Observable Bostock](https://observablehq.com/@d3/versor-zooming)) — quaternions pour rotation globe smooth. Applicable hook S1 Atlas.
5. **Path drawing avec d3.geoInterpolate** — interpolation géodésique entre 2 points pour caravane/route ([d3-tutorial](https://library.fridoverweij.com/docs/d3tutorial/maps_interaction.html)). Déjà utilisé partiellement, à industrialiser.
6. **Animated dashed-line route** (Bogotá Metro 30DayChallenge 2025) — dashed-line + train suivant le path. Pattern caravane Mansa Moussa.
7. **Path drawing animé avec `@remotion/paths`** (trim path style) — RealLifeLore, Wendover, Cogito, Map Men. **Déjà installé**, à exploiter plus.
8. **Layers vectoriels qui slide/zoom (camera fake)** — `interpolate()` + `useCurrentFrame()` sur SVG `<g>` racine. Déjà standard chez nous (V2 vector pipeline).
9. **Static base map + animated overlays** — pattern Knowledgia/History Matters. Déjà fait sur Atlas Tombouctou.
10. **Frame-by-frame coloration territoires** (EmperorTigerstar) — GeoJSON + d3-geo + interpolation par frame. Trivial Remotion, à utiliser pour expansion empire Mali.

---

## 5. Assets / textures externes recommandés

### Textures parchemin (CC0 ou libres)
- [OpenGameArt Old Parchment](https://opengameart.org/content/old-parchment-paper) (CC0)
- [rawpixel CC0 old paper](https://www.rawpixel.com/search/old%20paper%20texture)
- [PaperTexture.io parchment](https://papertexture.io/downloads/parchment)
- [ZemTime 35 textures pack 3000px+](https://www.zemtime.com/free-download-35-old-parchment-textures/)

### Fonts cartographiques free
- **BellTopo Sans** (Sarah Bell, USGS-inspired) — directement applicable Atlas. **★★★★★**
- **IM FELL** (parchemin), **Cinzel**, **Spectral** — vibes Mande
- À chercher : police calligraphique inspirée écriture Mande/Tifinagh (gap actuel projet)

### Geodata
- [Natural Earth](https://www.naturalearthdata.com/) (déjà utilisé)
- [Historical Basemaps GitHub](https://github.com/aourednik/historical-basemaps) (déjà utilisé)
- [Cooper-Hewitt watercolor map collection](https://watercolormaps.collection.cooperhewitt.org/) (référence stylistique)

### Lottie packs
- [LottieFiles World Map free](https://lottiefiles.com/free-animations/world-map) — overlays prêts à composer

### Motifs/brushes
- À constituer : **motifs bogolan vectoriels SVG** (gap actuel — différentiateur Parchemin Mande)
- Stamen watercolor source brush sur leur GitHub

---

## 6. Verdict final — 3 techniques prioritaires à intégrer

1. **SVG filters natifs (pencil + paper texture)** — remplace les exports Gemini sur layers cartographiques. Déterministe, zéro coût récurrent, intégrable directement dans `AtlasV2*Scene.tsx`.
2. **BellTopo Sans typeface + recherche police calligraphique Mande** — typographie cartographique signature immédiate.
3. **Fork [florentpergoud/travel-map-maker](https://github.com/florentpergoud/travel-map-maker)** — pattern caravane Mansa Moussa Remotion-native, gain temps massif vs reconstruire from scratch.

**Pas de nouveau stack à adopter**. Stack actuel (Remotion + d3-geo + Natural Earth + Historical Basemaps + Gemini textures) couvre **tout** ce que font les créateurs indie listés. Le différentiateur Atlas sera la **DA** (textures, motifs bogolan, typographie Mande), pas l'outil.

---

## Méthodologie & confiance

- **Convergence 3/3 agents** sur l'insight pivot ("stack actuel suffit, gap = stylistique")
- **Convergence 2/3** sur priorisation : Cogito + PolyMatter cités par 2 agents indépendamment
- **Source unique** (à vérifier) : Mighty Africa comme concurrent thématique direct — re-verifier T+30
- **Coût total recherche** : ~$0.50 estimé (3 agents en parallèle, 30 min)

## Veille T+30
- Monitorer `@History_Mapped_Out`, `@Mighty_Africa`, `@TheArmchairHistorian`
- Hashtag TikTok `#cartography` (pas `#mapanimation` saturé SaaS)
- GitHub `topics:svg-map` + `topics:remotion`
- Behance tag "animated cartography"
