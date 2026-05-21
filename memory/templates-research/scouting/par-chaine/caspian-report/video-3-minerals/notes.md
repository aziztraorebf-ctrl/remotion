# How America and China are fighting for African minerals

URL : https://www.youtube.com/watch?v=RjMtfGpjh58
Durée : 20:22 (1222s)
Date upload : 2024-04-25

## Palette
- Couleurs dominantes : `#0a0e16` noir charbon (chalkboard ressources, news headlines) / `#cfe6ee` bleu pâle océan / `#dfe6c8` vert olive pâle (relief topo Afrique centrale) / `#7c1d1d` rouge brique sombre (DRC fill) / accents jaune `#facc15` (highlights tableau ressources, "GOLD") / vert menthe `#34d399` (icônes critical minerals) / violet sombre `#3b1d6b` (icônes hydrocarbons).
- Ratio approx : 25% noir charbon, 25% topo verte, 20% bleu pâle, 15% rouge highlight, 10% jaune accents, 5% icônes ressources.
- Mood : plus minéral, plus terrain, plus "cartographie ressources" que les 2 premières. La carte topo relief change tout — moins atlas vintage, plus géologique.
- Reproductibilité Remotion : moyenne — la texture relief topo est plus exigeante en Mapbox (besoin d'un raster hillshade + filtre couleur). Faisable mais ~1h R&D.

## Typographie
- Familles inférées : sans-serif condensed identique aux autres + ajout d'une serif vintage type Playfair Display / Cormorant pour news headlines rouges (frame 060/080) sur fond noir = template "press clipping".
- Hiérarchie headline/caption : tableau ressources (frame 005) = type tabular sans-serif uppercase, highlights jaunes en background ; news headline = serif gros + sans-serif petit subtitle + date.
- Animations texte : tableau ressources = scroll vertical lent + highlight jaune qui glisse de haut en bas item par item ; news headlines = fade + petit shake comme un journal posé.
- Reproductibilité Remotion : haute — police Playfair gratuite, scroll = `interpolate translateY`.

## Mouvement caméra
- Patterns dominants : ken-burns identique + nouveau pattern "tilt 3D iso" pour la carte topo relief (vue à 30-40° comme une maquette physique posée).
- Durée moyenne des plans : 3-5s sur cartes topo, 2s sur tableau ressources scroll, 1-1.5s sur news headlines (rapides).
- Spécificités globe/satellite : pas de globe ; mais frame 025 = vue surrealiste type "lune chess" (texture rocheuse + pièces d'échecs) qui ouvre le sujet — métaphore visuelle abstraite. Pattern "cold open conceptuel" plutôt que "cold open footage" comme v1.
- Reproductibilité Mapbox : moyenne — Mapbox supporte `pitch: 45` avec terrain 3D (`mapbox-dem`), exactement le rendu obtenu. Documenté dans skill mapbox-data-visualization-patterns.

## Transitions
- Entre scènes : cut sec + fade-noir bref. Les news headlines font un effet "stack" (3 articles différents en 4-5s, transition cut + scale + slight blur).
- Entre échelles : sur la carte ressources, pan continu sans cut quand on traverse l'Afrique centrale (RDC→Zambie→Tanzanie sur 10s).
- Entre data et carte : icônes ressources (diamond, gold, critical, hydrocarbons) apparaissent par bursts géolocalisés via stagger 50ms — magnifique. Frame 100 = peak density.
- Reproductibilité : haute, pattern stagger déjà maîtrisé Souverain.

## Frames sélectionnées (8)
- `frame-005-resources-table-yellow-highlights.jpg` : tableau noir 30 lignes "VANADIUM 96% / ARSENIC 100% / etc." avec highlights jaunes sur certains items + colonne "USAGE" à droite. Template "data dependency" très puissant.
- `frame-012-mining-drone-aerial.jpg` : footage drone mine à ciel ouvert. Si Souverain évite live-action, peut être remplacé par Gemini i2i "open-pit mining aerial photo".
- `frame-025-chess-strategy-bw.jpg` : surface lune/rocheuse + pièces d'échecs (cavalier, roi) + ligne dashed entre eux. Cold open conceptuel = metaphor "chess game superpowers".
- `frame-040-resource-icons-map-coast.jpg` : carte côte Atlantique RDC/Angola + 4 types d'icônes ressources (diamond/gold/critical/hydrocarbons) + légende top-bar. Template "what's where".
- `frame-060-news-headline-serif-red.jpg` : "Petroleum Africa" titre serif rouge + subtitle sans-serif blanc + date "OCTOBER 31, 2023" + fond noir charbon. Template "press evidence".
- `frame-080-news-headline-vintage.jpg` : variation du même template avec "English News" + headline World Bank/Angola. Pattern récurrent = signature.
- `frame-100-mineral-cluster-zambia-drc.jpg` : zoom Zambie/DRC avec très haute densité d'icônes ressources (~80 diamonds + gold + critical sur 1 frame). Climax visuel "Africa is THE mineral continent".
- `frame-125-corridor-line-mineral-density.jpg` : carte continent + corridor dashed jaune Lobito (Angola→Zambia→Tanzania) + densité icônes. Template "infrastructure logistique" superposé sur ressources.

## Verdict vidéo
🟢

## Top 3 idées à voler pour Souverain
1. **Tableau ressources scroll + highlight jaune (frame 005)** : composant `<ResourcesScrollTable items=[{name,pct,usage,highlighted}]/>` avec scroll vertical lent + bandeau jaune absolutely-positioned qui glisse via `interpolate` sur les rows highlighted. Variation directe du "ledger" Or Africain — très Souverain. Template C parfait.
2. **News headline press-clipping rouge sur noir (frames 060/080)** : composant `<NewsClipping source="Petroleum Africa" headline=... date=... />` avec serif rouge `#a63232` + petit shake spring. Pour citer sources réelles dans la vidéo (rigueur Fact-Sheet Souverain v2). Reusable cross-épisode.
3. **Stagger d'icônes ressources géolocalisées sur carte topo (frames 040/100)** : Mapbox `symbol` layer avec icons custom (diamond/oil-rig/gold-bar) + `paint` opacity contrôlé par `useCurrentFrame` via stagger 50-80ms par feature (sortBy proximity to centroid). Climax visuel possible : 0→80 icônes en 3s. Mood "richesse géologique" exactement le territoire Souverain.
