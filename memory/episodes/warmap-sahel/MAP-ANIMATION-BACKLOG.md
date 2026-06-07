# Map Animation — Backlog templates War-Map Sahel

**Créé :** 2026-06-07
**Contexte :** Identifié en fin de session 2026-06-07. Ces 4 templates doivent être codés en session parallèle AVANT d'intégrer dans SahelWarMapEngine.tsx.
**Source analyse :** `memory/_r-and-d-mapanimation-ANALYSE.md` + `memory/_r-and-d-mapanimation-PREMIUM-DECODE.md` + catalogue 89 templates.

---

## Règle d'intégration (NON-NEGOTIABLE)

Chaque template doit être :
1. Codé en **composant isolé** testable indépendamment
2. Headless-safe : **jamais `filter:blur CSS`**, opacité uniquement
3. Frame-driven : **`useCurrentFrame()` + `interpolate()`**, jamais `setTimeout`
4. Suit la voix : chaque élément correspond à **1 phrase du narrateur**

---

## Template 1 — Territorial Expansion organique

**Inspiration catalogue :** #263 (×52 — le plus utilisé), "Rapid Red Expansion from Germany into Poland"
**Acte Sahel :** Act 2 — "Les groupes armés contrôlent plus de territoire qu'en 2012" → expansion 2012→2022
**Script trigger :** f2630 "s'embrase" + expansion progressive jusqu'à f4800 "2022"

**Ce qu'on a :** zones colorées qui changent de couleur instantanément via `sahelControlAt()`
**Ce qui manque :** la zone grandit **organiquement** — elle déborde d'une région vers les voisines, avec un front visible qui avance

**Recette technique :**
- Modifier `sahelControlAt()` pour interpoler le contrôle sur une plage de frames (pas basculement instantané)
- Ou : overlay SVG circulaire qui grandit depuis un centre (Kidal/Mopti) et "contamine" les régions au fil des frames
- Option B (plus simple) : `fill-opacity` qui monte progressivement région par région avec delays différents

**Variables clés :**
```typescript
// Expansion 2012→2022 = f2630→f4800 (environ 72 secondes)
// Centre expansion : nord Mali (Kidal lon=1.4, lat=18.4) + centre Burkina (Ouahigouya lon=-2.4, lat=13.6)
// Effet : remplissage rouge sombre s'étend progressivement sur la carte
```

---

## Template 2 — Refugee Flow en rubans

**Inspiration catalogue :** #12 "The Great Displacement — Ukraine Refugee Flows" (×12)
**Acte Sahel :** Act 4 — "~3 millions de déplacés" → flux depuis Djibo/Ménaka/Tillabéri
**Script trigger :** f10294 "Djibo" / f10349 "Tillabéri" / f10783 "réel."

**Ce qu'on a :** jetons ponctuels qui se déplacent (cercles avec portrait)
**Ce qui manque :** un **flux en ruban animé** qui montre le couloir de déplacement complet, épaisseur proportionnelle au nombre

**Recette technique :**
- SVG `<path>` avec `stroke-dasharray` animé (GeoFlowConnection pattern)
- Épaisseur : 4-8px, couleur encre `#3A2A18` semi-transparent (0.35)
- Tracé : route réelle (pas ligne droite) — Djibo→Bobo-Dioulasso, Ménaka→Gao direction, Tillabéri→Niamey
- Animation : le chemin se dessine progressivement au mot exact, puis reste visible

**Coordonnées trajectoires :**
```
Djibo (lat 14.10, lon -1.32) → Bobo-Dioulasso (lat 11.18, lon -4.30) : fuite vers le sud
Ménaka (lat 15.92, lon 2.40) → Gao (lat 16.27, lon -0.04) direction ouest : fuite ouest
Tillabéri (lat 14.21, lon 1.45) → Niamey (lat 13.51, lon 2.12) : fuite vers la capitale
```

---

## Template 3 — Army Arrows Mapbox (AtlasAttackArrow adapté)

**Inspiration catalogue :** #49 "Spain → France Incursion: Red Border Highlight with Tank Advance", #6 "Spain — Historical Army Movements with Red Arrows"
**Actes Sahel :**
- Act 1 hook — vecteurs capitales → Liptako (remplacer les SVG bruts actuels)
- Act 2 — onde armes Libye → nord Mali (f2630 "s'embrase")
- Act 3 — offensive FAMa+Africa Corps depuis Gao+Ménaka → Kidal (f8218→f8683)
- Act 3 — contre-offensive JNIM+CSP → Kidal (f9477)

**Ce qu'on a :** lignes SVG `<line>` statiques via `map.project()` (apparaissent d'un coup)
**Ce qui manque :** flèche qui **pousse progressivement** vers sa cible — la pointe avance, la queue s'allonge derrière

**Recette technique :**
- Adapter `AtlasAttackArrow.tsx` (actuellement d3-geo) pour Mapbox
- Input : `waypoints: [number, number][]` (lon/lat), `progress: number` (0→1)
- Rendering : projeter chaque waypoint via `map.project()` → SVG `<polyline>` tronqué selon progress
- Marching ants : `stroke-dashoffset` animé par frame
- Tête orientée : bearing entre les 2 derniers points projetés

**Cas d'usage hook (3 flèches simultanées) :**
```typescript
// Flèche 1 : Bamako → Liptako (lon -0.5, lat 14.5)
// Flèche 2 : Ouagadougou → Liptako
// Flèche 3 : Niamey → Liptako
// Progress : interpolate(frame, [F_HOOK_LIPTAKO, F_HOOK_LIPTAKO + 45], [0, 1])
```

**Cas d'usage Act 3 (tenaille Kidal) :**
```typescript
// Via pincerArrows adapté :
// Flèche 1 : Gao (lon -0.04, lat 16.27) → Kidal (lon 1.44, lat 18.43) — FAMa
// Flèche 2 : Ménaka (lon 2.40, lat 15.92) → Kidal — Africa Corps
// delays : Gao part 30 frames avant Ménaka
```

---

## Template 4 — River Flow animation

**Inspiration catalogue :** #14 "Nile River Flow Animation: Wide Africa-to-Northeast Zoom with Glowing River"
**Acte Sahel :** Act 2 — contexte géographique Niger/Sahel (optionnel, enrichissement visuel)

**Ce qu'on a :** rien — les fleuves ne sont pas animés du tout
**Ce qui manque :** le tracé du fleuve Niger qui s'illumine progressivement avec un glow parchemin

**Recette technique :**
- GeoJSON du fleuve Niger : télécharger depuis Natural Earth (`ne_10m_rivers_lake_centerlines`)
- Projeter via `map.project()` frame par frame → SVG `<polyline>` animé
- Style : stroke `#C8D9E0` (couleur océan parchemin), strokeWidth 2-3, glow via opacité large
- Progress : se révèle en 60-90 frames au mot "Sahel" ou contexte géographique

**Priorité :** 4e sur 4 — enrichissement esthétique, pas narrativement critique

---

## Plan de session parallèle

**Ordre d'exécution :**
1. Template 3 (Army Arrows) — base qui sert pour Act 1 + Act 3
2. Template 1 (Territorial Expansion) — Act 2 le plus dense visuellement
3. Template 2 (Refugee Flow) — Act 4 humanitaire
4. Template 4 (River Flow) — si temps restant

**Architecture cible :**
```
src/projects/warmap/_shared/
├── SahelAttackArrow.tsx    (Template 3 — adapté Mapbox)
├── TerritorialExpansion.tsx (Template 1 — fill progressif)
└── RefugeeFlow.tsx         (Template 2 — ruban animé)
```

**Condition d'intégration :** chaque composant doit rendre en animatic isolé (@35%, 10s) avant d'être branché dans SahelWarMapEngine.tsx.
