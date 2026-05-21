# RDC No Sense — Storyboard + Manifest

**Format** : 1920×1080 (16:9) — 30fps — 5400 frames (180s) — narration 178.40s
**Style** : Jacq Adi — Mapbox satellite-v9 + sticker central + animations sobres

## Frames cibles par beat (audio-anchored depuis segments.json)

| Beat | Phrase d'amorce | Start frame | End frame | Durée | Visual |
|------|------------------|-------------|-----------|-------|--------|
| 1 | "La RDC..." HOOK | 0 | 422 | 14.1s | RDC contour glow orange + drapeau circle plante |
| 2a | "couvre 2.345M km²" | 423 | 789 | 12.2s | RDC seule plein écran + chiffre énorme |
| 2b | "France x4 + Espagne+Allemagne+Pologne+UK" | 790 | 1182 | 13.1s | SurfaceComparison : RDC contour + pays empilés dedans |
| 3a | "touche 9 voisins" | 1183 | 1259 | 2.5s | RDC + 9 lignes vers voisins, surlignage |
| 3b | "Neuf." | 1260 | 1922 | 22.1s | RDC + 9 drapeaux voisins en couronne + texte "9 NEIGHBORS" |
| 3c | "Berlin 1885" | 1923 | 2200 | 9.3s | Carte papier vintage + Berlin pin + ligne vers RDC |
| 4a | "monstre / fleuve Congo" | 2201 | 2417 | 7.2s | Zoom satellite sur fleuve Congo cyan glow |
| 4b | "2e débit / équateur 2x" | 2418 | 2973 | 18.5s | Fleuve animé + ligne équateur + chiffres "2e mondial" |
| 5 | "forêt 170M ha / poumon" | 2974 | 3654 | 22.7s | RDC vert fluo + icône feuille + "170M ha" + "2e poumon" |
| 6 | "100M hab / 200 langues" | 3655 | 4393 | 24.6s | RDC + bulles photos populations + "200+ langues" + Kinshasa↔Lubumbashi |
| 7 | "trésor / 60% cobalt / paradoxe" | 4394 | 5062 | 22.3s | RDC + icône batterie/cobalt + "60%" + split "richesses vs pauvreté" |
| 8 | "Voilà... continue d'exister" CHUTE | 5063 | 5400 | 11.2s | RDC plein écran contour orange + drapeau central + fade |

**Total : 5400 frames = 180s** (narration 5352f + 48f silence final pour fade musique)

---

## Manifest technique par beat

### BEAT 1 — HOOK (0-422)
- **Composant** : `MapboxSatelliteBeat` avec `CAM_PRESETS.spaceToCongo` (zoom 1.2 → 3.5)
- **Layers** : satellite-v9 + `addCountryHighlight("COD", "#ff8c00", 0.0, 4)` (contour seul, pas de fill)
- **Sticker central** : `<FlagPin flag="cd" entry={spring(60→90)} float="gentle" />` au-dessus du pays
- **Animation** : zoom-in continu depuis l'espace vers l'Afrique centrale
- **Texte** : aucun (le hook parle seul)

### BEAT 2a — TAILLE (423-789)
- **Composant** : `MapboxSatelliteBeat` zoom fixe sur RDC pleine échelle
- **Layers** : satellite-v9 + RDC fill rgba(80,200,80,0.35) + contour orange #ff8c00 glow
- **Sticker** : chiffre énorme jaune "2 345 000 km²" en bas centre (Bebas Neue 160px text-gold)
- **Animation** : countUp 0 → 2 345 000 sur 90 frames

### BEAT 2b — FRANCE×4 + EUROPE (790-1182)
- **Composant** : `CountryStackComparison` (nouveau) — RDC en fond contour, France×4 déposées dedans en couleurs distinctes, puis Espagne+Allemagne+Pologne+UK qui apparaissent
- **Data** : Natural Earth `countries-50m.json` — RDC contour + France/ESP/DEU/POL/GBR fills
- **Animation** : pays qui tombent un par un (spring drop) avec label texte

### BEAT 3a — 9 VOISINS lignes (1183-1259)
- **Composant** : `MapboxSatelliteBeat` zoom RDC + voisins
- **Layers** : satellite + RDC orange + 9 lignes blanches qui se tracent vers (Angola, Zambie, Tanzanie, Burundi, Rwanda, Ouganda, Soudan Sud, RCA, Congo-Brazzaville)
- **Animation** : 9 SVG path drawLine en cascade (8f offset)

### BEAT 3b — "NEUF" + drapeaux (1260-1922)
- **Composant** : `MapboxSatelliteBeat` + 9 drapeaux circulaires en couronne autour de RDC
- **Texte** : "9 VOISINS" gros titre haut centre Bebas Neue 200px text-gold
- **Animation** : chaque drapeau spring pop en cascade

### BEAT 3c — BERLIN 1885 (1923-2200)
- **Composant** : `PaperMapOverlay` (nouveau, simple) — image carte papier vintage Africa + pin Berlin + ligne tracée vers RDC
- **Style** : sépia, texture papier kraft, "BERLIN 1885" texte en haut

### BEAT 4a — FLEUVE MONSTRE (2201-2417)
- **Composant** : `MapboxSatelliteBeat` zoom plus serré sur fleuve Congo
- **Layers** : satellite + GeoJSON fleuve Congo line cyan #00d4ff glow (Natural Earth rivers)
- **Texte** : "FLEUVE CONGO" titre

### BEAT 4b — DÉBIT + ÉQUATEUR (2418-2973)
- **Composant** : `MapboxSatelliteBeat` + ligne équateur dashed yellow + chiffres animés
- **Texte** : "2e DÉBIT MONDIAL" + "4 370 km" + "ÉQUATEUR ×2"

### BEAT 5 — FORÊT (2974-3654)
- **Composant** : `MapboxSatelliteBeat` zoom RDC + GeoJSON Congo Basin forest fill green glow
- **Sticker** : icône feuille Gemini + "170 000 000 ha" countUp + "2e POUMON DE LA PLANÈTE"

### BEAT 6 — DIVERSITÉ HUMAINE (3655-4393)
- **Composant** : `MapboxSatelliteBeat` + 4-6 hexagones photos populations (Unsplash gratuites)
- **Texte** : "100M HABITANTS" + "200+ LANGUES" + split bas Kinshasa↔Lubumbashi 2 pins

### BEAT 7 — RICHESSES / PARADOXE (4394-5062)
- **Composant** : `MapboxSatelliteBeat` + icône batterie cobalt Gemini + "60% DU COBALT MONDIAL"
- **Animation finale** : split-screen subtle : "richesse géologique" vs "pauvreté humaine"

### BEAT 8 — CHUTE (5063-5400)
- **Composant** : `MapboxSatelliteBeat` zoom-out doux + `CountryFlagFill` drapeau RDC remplit silhouette pays
- **Texte** : "RÉPUBLIQUE DÉMOCRATIQUE DU CONGO" fade-in + sous-texte "trop grand, trop riche, trop complexe"
- **Fade out** : 30 derniers frames

---

## Assets à générer / récupérer

### Drapeaux (gratuit Wikipedia / flagcdn.com)
- RDC (cd) — utiliser pour CountryFlagFill + FlagPin
- 9 voisins : ao, zm, tz, bi, rw, ug, ss, cf, cg

### GeoJSON
- `countries-50m.json` : ✅ déjà présent
- Fleuve Congo : à extraire de Natural Earth rivers ou tracer simplifié
- Congo Basin forest : zone polygone approximative (peut être dessinée à la main basé sur sources)

### Icônes Gemini i2i (fond crème, style flat moderne)
- Feuille verte (forêt)
- Batterie/smartphone (cobalt)
- Goutte d'eau (fleuve)
- Personnage simple (population)

### Photos Unsplash (populations RDC, neutres respectueuses)
- 4-6 portraits ou scènes Kinshasa/Lubumbashi (URLs directs)

### Carte papier vintage
- 1 image générée Gemini : "old sepia map of Africa 1885 colonial style, paper texture, brown ink, vintage cartography"

---

## Composants à coder (nouveaux)

1. **`MapboxSatelliteBeat`** — wrapper réutilisable :
   - Props : `iso`, `cam` (CamState), `highlightColor`, `glowOpacity`, `children`
   - Render : MapboxBase satellite-v9 + addCountryHighlight + slot children pour stickers
   - Réutilisé dans 6+ beats

2. **`CountryFlagFill`** — drapeau remplit silhouette pays :
   - Props : `iso`, `flagUrl`, `geoJson`
   - Render : SVG path silhouette + clipPath + image drapeau remplit
   - Utilisé en BEAT 8 (chute) + potentiellement BEAT 3 voisins petits

3. **`FlagPin`** — drapeau circulaire avec entry animation :
   - Props : `flag` (code ISO 2 lettres), `size`, `entryAt`, `position`
   - Render : cercle avec drapeau cropped + bounce entry + float idle
   - Utilisé BEAT 1 + BEAT 3 voisins

4. **`CountryStackComparison`** — comparer surface en empilant :
   - Props : `mainIso`, `compareIsos[]`, `geoJson`
   - Render : pays main en fond, pays compare "tombent" dedans
   - Utilisé BEAT 2b

5. **`PaperMapOverlay`** — carte papier vintage avec pin :
   - Simple : image PNG + texte + pin SVG
   - Utilisé BEAT 3c
