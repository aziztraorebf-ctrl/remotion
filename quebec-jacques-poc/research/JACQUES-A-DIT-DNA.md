# Jacques a dit — ADN visuel et narratif

> Analyse de 4 vidéos référence (1 Short + 3 longs formats) — 2026-04-27

## Vidéos analysées

| ID | Titre | Durée | Vues | Format |
|----|-------|-------|------|--------|
| DjgF6ZU8DSw | Le Québec est une province canadienne vraiment unique | 65s | 56k | Short 9:16 |
| jvnimN3N8zw | Pourquoi la GÉOGRAPHIE de la Croatie n'a AUCUN SENS ? | 210s | 32k | Long 16:9 |
| PVsjvvUiwNM | Et Si le Québec devenait indépendant ? | 283s | 38k | Long 16:9 |
| qMTz_PcXad8 | Maroc vs Algérie : lequel est le meilleur ? | 356s | 27k | Long 16:9 |

---

## ADN visuel (ce qui est constant)

### 1. Toile de fond unique : carte satellite Mapbox / Google Earth en perspective oblique
- Vue 3D légèrement tilt (pas top-down pur, pas full-3D non plus)
- Style imagery satellite (Mapbox Satellite ou équivalent), pas vector flat
- Mouvement caméra subtil mais constant : pan, zoom, rotation lente — JAMAIS statique
- Toujours en mouvement, même sur une scène "calme"

### 2. Pays/régions découpés en cutout avec drapeau remplissant le territoire
- Le drapeau n'est pas un overlay rectangulaire — il EST la silhouette du pays
- Stroke/contour clair (cyan glow sur Croatie, bord net sur Québec)
- Layering : drapeau-cutout flotte légèrement au-dessus de la carte (drop-shadow)
- Couleur unie alternative quand pas de drapeau (Ontario = rouge plat, Québec = vert vif sur PVsjvvUiwNM)

### 3. Labels textuels lourds, type bold sans-serif, fond noir/jaune badge
- Police : sans-serif condensée (style impact / figtree black)
- Labels villes : badge noir + texte blanc (ex: "QUÉBEC", "MONTRÉAL")
- Highlight clés : badge jaune + texte noir (ex: "1,6 MILLION KM²", "NOUVEAU-BRUNSWICK")
- Toujours lisibles sur fond chargé

### 4. Numérotation de chapitres encadré rouge en haut-gauche
- Petit carré rouge avec chiffre blanc : `[1]`, `[2]`, `[3]`...
- Position : top-left, taille modeste, présent toute la durée du chapitre
- Ton POC v2 reproduit déjà cet élément (visible sur v2-s1-frame100.png)

### 5. Picto / marqueurs / icônes superposés
- Cercles rouges avec marker drapeau ou pin
- Bulles SVG style Google Earth (icones euros, neige, sirop d'érable, maple leaf)
- Comparaison de pays = bulles rondes avec drapeaux
- Emojis ponctuels en accent (visage choqué qMTz_PcXad8 frame_001) — RARE mais utilisé

### 6. Illustrations vectorielles personnages "people-style"
- Petits personnages SVG flat-color (style Iconfinder / Storyset)
- Utilisés pour illustrer concepts (population, électeurs, touristes)
- Toujours dans des cercles/badges — jamais en plein écran

### 7. B-roll drone/cinematic ponctuel
- Insert images réelles (drone Korčula, vagues, ville Zagreb avec drapeau)
- Petite vignette dans coin OU plein écran 1-3s comme aération
- Toujours retour à la carte après

### 8. Effets de transition signature
- Cercle / ellipse animée pour pointer une zone (frame_002 Croatie)
- Sweep / fade depuis la carte vers une scène insert
- Vintage parchemin granular (frame_011 Croatie) pour transition historique
- Zoom-in progressif sur région d'intérêt

### 9. Sous-titres burned-in en bas
- Toujours présents (Adobe Premiere Pro auto-sub mentionné dans description)
- Style sans-serif blanc + outline noir
- Centrés bas

---

## ADN narratif (la voix Jacques)

### Tonalité
- **Familier, oral, complice** — "Sérieusement, la Croatie est le pays le plus égoïste"
- **Métaphores frappantes en accroche** — "boomerang", "mâchoire de dragon", "pont naturel"
- **Hyperboles assumées** — "le plus grand holdup géographique d'Europe"
- **Adresse directe au spectateur** — "Restez jusqu'à la fin", "Si on regarde de près"

### Structure dramatique récurrente
1. **Hook punchy 5-10s** : affirmation choc + question rhétorique
   - "La Croatie n'est pas un pays, c'est un boomerang"
   - "Je viens de rendre le Québec indépendant et donc je viens de créer le 17e plus grand pays du monde"
   - "Maroc vs Algérie. Restez jusqu'à la fin car il faudra désigner un grand gagnant"
2. **Stats / faits concrets** : km², population, PIB, distances, années — TOUS visualisés
3. **Comparaisons constantes** : "presque trois fois la France", "plus grand que l'Alaska"
4. **Pivots narratifs** : "Mais le pire, c'est que...", "Et pour couronner le tout..."
5. **CTA final implicite ou explicite** : abonne-toi / commente

### Densité d'infos
- Très haute — chaque phrase amène un fait nouveau
- Chiffres tous les 5-10 secondes
- Comparaisons par tranches (Québec vs France, Maroc vs Algérie point par point)

### Style de phrasing observé
- Phrases courtes (5-15 mots majoritaires)
- Connecteurs simples : "Et", "Mais", "Donc", "À titre de comparaison"
- Pas de jargon académique — vocabulaire géo accessible
- Auto-correction humoristique : "Ah non pardon, c'est plutôt 7100 km²..."

---

## Pattern Long format (3-6 min)
- 3-5 chapitres numérotés visibles (badge rouge top-left)
- Chaque chapitre = 30-90s
- Chapitres typiques : Géographie / Population / Économie / Histoire / Conclusion
- Transitions entre chapitres : changement de zoom carte + nouveau badge chiffre

## Pattern Short (60-90s)
- Pas de chapitres numérotés (ou un seul implicite)
- Densité encore plus haute : 1 stat par 4-5s
- Hook ultra-court 2-3s
- Pas de B-roll drone (trop coûteux en temps)
- Vertical 9:16, carte recadrée plus serré sur la zone

---

## Reproductibilité Remotion + Mapbox

| Élément | Faisabilité Remotion + Mapbox |
|---------|-------------------------------|
| Carte satellite tilt + pan | OUI — Mapbox GL JS `mapbox-gl-satellite` style + camera animation `flyTo`/`easeTo` capturée frame par frame OU rendu offscreen |
| Cutout pays drapeau | OUI — GeoJSON pays + `<pattern>` SVG drapeau OU clip-path sur image drapeau |
| Labels badge noir/jaune | OUI — Remotion pur (composant React + spring) |
| Chapter number rouge | OUI — déjà fait dans POC v2 |
| Markers cercles rouges | OUI — Mapbox markers OU SVG overlay |
| B-roll drone insert | OUI — `<Video>` Remotion |
| Personnages SVG | OUI — assets vectoriels existants ou Recraft |
| Cercle/ellipse animée pointage | OUI — SVG + Remotion spring |
| Transitions sweep/zoom | OUI — `@remotion/transitions` |
| Sous-titres auto burned-in | OUI — `@remotion/captions` (ou Whisper-derived) |

**Verdict** : 100% des éléments reproductibles avec stack actuelle (Remotion 4.0.452 + mapbox-gl 3.22 + react-map-gl 8.1).

---

## Gap analyse — POC v1 / v2 actuels

### Ce qui marche déjà
- Globe terre + Québec drapeau cutout (frame v2-s1-frame100) — TRÈS proche du visuel cible
- Chapter number badge rouge — présent
- Sous-titres burned-in — présent
- Style satellite oblique — présent

### Ce qui manque ou pourrait être amélioré
- **Mouvement caméra constant** — vérifier si v2 anime déjà la carte ou fait des coupes franches entre scènes
- **Density d'infos** — combien de stats/labels par scène ?
- **Personnages SVG flat-color** — pas vu dans les frames POC (sauf "thinking-character.png" dans assets)
- **B-roll drone** — pas exploité actuellement (asset/audio/sfx vide)
- **Cercles/ellipses pointage** — pas vu
- **Variations de couleur de remplissage** (rouge Ontario, vert Québec différencié) — pas vu

---

## Recommandation pipeline

Pour produire à la chaîne du contenu "Jacques a dit"-style :

1. **Composant générique `SatelliteMapScene`** : Mapbox Satellite + props (centre, zoom, tilt, pan animé)
2. **Composant `CountryFlagCutout`** : GeoJSON + flag pattern, props (country, opacity, glow)
3. **Composant `ChapterBadge`** : numéro + intro animée
4. **Composant `LabelBadge`** : texte + variant (noir/jaune/rouge)
5. **Composant `MapMarker`** : cercle rouge + label optionnel
6. **Composant `EllipsePointer`** : SVG animé spring pour pointer
7. **Composant `SubtitleBurned`** : sous-titres automatiques depuis transcript Whisper
8. **Composant `BRollInsert`** : vidéo drone 1-3s avec fondus

Ces 8 composants couvrent ~95% du langage visuel observé.
