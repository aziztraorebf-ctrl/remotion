# Why Mali, Niger, and Burkina Faso are forming a new country

URL : https://www.youtube.com/watch?v=Ew5w6PyI66Y
Durée : 22:04 (1324s)
Date upload : 2024-03-25

## Palette
- Couleurs dominantes : `#cfe6ee` bleu pâle océan / `#f4ede0` ivoire papier (terre) / `#e25a2b` orange brique (highlight pays) / `#c8201f` rouge sang (Mali) / `#e8a02a` ocre (Niger) / `#1c2a1f` vert kaki sombre (chalkboard organigramme) — accents `#1f3a8a` bleu marine pour rivières.
- Ratio approx : 35% ivoire-papier, 25% bleu pâle, 20% rouge/orange highlight, 10% noir/kaki transitions, 10% drone footage.
- Mood : carte ancienne style atlas vintage, sérieux institutionnel mais chaleureux ; alterne avec moments graves (chalkboard noir, portraits stylisés).
- Reproductibilité Remotion : haute — palette atteignable via Mapbox custom style + overlay grain ivoire + lerp couleur sur features GeoJSON.

## Typographie
- Familles inférées : sans-serif geometric condensed bold pour labels carte (Bebas Neue / Anton style) ; sans-serif humanist regular pour villes (Source Sans / IBM Plex Sans) ; sans-serif tabular pour data overlays (POPULATION/GDP).
- Hiérarchie headline/caption : pays = ALL CAPS condensed très large (60-100px), villes = mixed-case régulier petit (16-22px). Différenciation par taille + weight + casse, pas par famille.
- Animations texte : labels apparaissent avec pop-in léger + tracking-out ; overlays données (POPULATION 2,840,000 GDP $2.1B) dessinés ligne par ligne avec petit motion staircase.
- Reproductibilité Remotion : haute — `<Sequence>` + `interpolate` opacity/letterSpacing, fonts gratuites Google.

## Mouvement caméra
- Patterns dominants : ken-burns lent constant sur cartes (pan + très léger zoom), zoom-in target sur pays surligné quand orateur le nomme, dolly-out final pour révéler région entière.
- Durée moyenne des plans : 3-5s sur les cartes statiques, 1-2s sur footage drone/stock entre les cartes.
- Spécificités globe/satellite : pas de globe 3D — vue plate type Equirectangular avec léger angle perspective (tilt ~5-10° pour donner profondeur). La carte semble texturée comme du papier vieilli.
- Reproductibilité Mapbox : haute — `pitch: 10` + `bearing: 0` + animation `flyTo` lente entre POIs ; texture papier ajoutée en CSS overlay (déjà documenté Souverain).

## Transitions
- Entre scènes : cut sec dominant + fade-noir bref pour changements de chapitre. Whip-pan via grosse blur radiale 200ms quand on change de continent.
- Entre échelles (espace→pays→ville) : `flyTo` continu (pas de cut) avec zoom 2.5→6→9 en 1.5s ; le label pays grossit en parallèle puis fade out quand zoom-in plus serré.
- Entre data et carte : la carte reste, les data labels (POPULATION/GDP) sont posés DESSUS avec staircase delay 80ms par item — la carte continue son ken-burns en arrière.
- Reproductibilité : haute — pattern déjà testé Or Africain (labels fade-out séquentiel).

## Frames sélectionnées (8)
- `frame-001-drone-protest-cold-open.jpg` : cold-open footage drone manifestation, accroche émotionnelle 0-3s avant carte. Pattern "réel d'abord, abstrait après".
- `frame-003-libya-highlight-orange.jpg` : carte Afrique entière + Libye remplie en orange brique, le reste en gris-papier. Choropleth simple = recipe Mapbox 1 layer fill `match` ISO code.
- `frame-006-flags-pins-colonial.jpg` : carte Mali/Niger/Burkina avec drapeaux ronds posés (FR, US, IT, AT) comme des pin badges. Pour montrer présences militaires multiples sur un même territoire.
- `frame-010-junta-leaders-organigramme.jpg` : fond chalkboard vert sombre + 3 portraits ronds (Tchiani/Traoré/Goïta) reliés par lignes pointillées + labels drapeau-pays. Template "alliance/relation".
- `frame-055-sahel-belt-hatching.jpg` : bande Sahel hachurée diagonale ocre traversant l'Afrique horizontalement. Pattern "zone géographique abstraite". Attention : Souverain V5 utilise déjà des hachures, possible collision.
- `frame-070-niger-river-blue-flow.jpg` : tracé rivière Niger en bleu vif épais animé. Peut animer un cours d'eau, route, frontière comme acteur narratif.
- `frame-085-gaddafi-portrait-stylized.jpg` : portrait Gaddafi traité graphique (face mesh + dots + bandes hachurées) sur fond bleu nuit `#0e1d3a`. Très Template C — exactement le mood "satellite tramé dramatique".
- `frame-140-data-overlay-population-gdp.jpg` : carte choropleth verte + 8 country boxes "POPULATION + GDP" reliés par lignes fines. Pattern "data layer over map".

## Verdict vidéo
🟢

## Top 3 idées à voler pour Souverain
1. **Organigramme dirigeants sur fond chalkboard (frame 010)** : Remotion `<Sequence>` avec 3 nodes ronds (portraits Gemini i2i style "presidential portrait painted") + lignes pointillées via SVG `<line strokeDasharray>`, fond `#1c2a1f` + grain papier. Idéal pour scènes "alliance pro-X" ou "trio dirigeants" récurrentes Souverain.
2. **Choropleth animé pays-par-pays (frame 003)** : Mapbox `fill-color` via `case` sur ISO codes, fade-in séquentiel des pays via `paint` interpolation contrôlée par `useCurrentFrame`. Reusable pour "5 pays africains qui protestent" type Or Africain.
3. **Country data box overlay (frame 140)** : composant React `<CountryDataBox iso="ML" pop="22M" gdp="$20B" />` positionné via `mapboxgl.project([lng,lat])` → reliés par lignes fines `<svg>` au pays. Pattern data-layer cassant la monotonie cartes nues. Très "ledger économique" si on remplace pop/gdp par les chiffres financiers Souverain.
