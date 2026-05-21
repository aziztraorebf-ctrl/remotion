---
name: Mapbox — Effets validés et à tester
description: Catalogue des effets visuels Mapbox testés et validés vs ceux à explorer en mini-renders. Indépendant de tout sujet vidéo. Pour session R&D ou intégration nouveaux épisodes.
type: reference
---

# Mapbox — Catalogue des effets

**Usage** : ouvrir AVANT toute session de R&D Mapbox ou de pré-production d'épisode utilisant des cartes. Complète `src/projects/_shared/mapbox/MAPBOX-COMPOSANTS.md` (qui documente l'API) avec un catalogue d'**effets visuels** testés ou à tester.

**Principe** : ne pas re-tester ce qui marche. Ne pas ré-inventer ce qui a échoué. Tester proprement ce qui n'a pas encore été essayé.

---

## ✅ Effets VALIDÉS (déjà utilisés en production)

### Caméra et mouvement
- **Zoom progressif espace → pays → ville** (Or Africain, Hannibal) — `lerpCam` avec easing quadratique. **Delta zoom minimum 0.3-0.5** entre paliers (sinon invisible : règle tuiles Mapbox). Validé.
- **Drift caméra continue** (pan + zoom subtil) — interpolate continu sur toute la plage de frames, jamais segmenté. Évite saccades.
- **Pullback final** — zoom out depuis cible vers vue large, finition. Validé Or Africain CTA.

### Style et palette
- **Style GéoAfrique signature** — Océan `#03224c`, Terre `#2a1e0e`, Frontières `#5a3e1e`. Constante `STYLE_GEO_AFRIQUE` dans `MapboxOceanColor.tsx`. Validé Or Africain v7.
- **`removeLabels(map)`** — carte sans labels (épuré). Cartouches textuels Remotion par-dessus. Validé.
- **5 styles testés** — dark / satellite / relief / light / navNight (voir MAPBOX-COMPOSANTS.md).

### Highlights pays
- **`addCountryHighlight(map, iso, color)`** — color fill territoire pays. Validé multi-pays Or Africain (Ghana, Mali, Niger, Burkina, etc.).
- **Couleur or pour Ghana** dans Or Africain — fonctionne quand la couleur est **narrativement justifiée** (on parle d'or). Pas un jugement moral. Validé Aziz.
- **Couleurs distinctes par pays** (Mali ≠ Niger ≠ Burkina ≠ Ghana) — palette adaptée au sujet. Validé Or Africain.

### Animations sur la carte
- **Labels fade-out séquentiel (option X)** — chaque label disparaît à l'arrivée du suivant + dernier tient 1.5s puis fade. Carte rouge nue + counter N/N = climax pur. Validé Or Africain Beat 3b v5 (6 pays).
- **Counter "N/N pays"** synchronisé avec apparition labels. Validé Or Africain.

### Branding et droits
- **`<MapboxBrandingHide />`** — composant CSS, retire logo + copyright Mapbox. À placer en 1er enfant AbsoluteFill. Légal si attribution dans description vidéo. Validé Or Africain.

### Render
- **`./scripts/render-mapbox.sh <CompId> <out.mp4>`** — Chrome for Testing + `--gl=angle`. Obligatoire (npx remotion render direct = WebGL fail). Validé.

---

## ✅ Effets VALIDÉS — session R&D 2026-05-07

### Marqueurs SVG (MapboxMarqueursV2 — 1080×1920)

7 types validés Aziz. Tous portables D3-Geo ET Mapbox (SVG overlay Remotion).

| Type | Verdict | Notes production |
|------|---------|-----------------|
| **Ornemental doré** (cercle + tirets 8 directions) | ✅ Validé | Couleur à ajuster selon fond |
| **Chiffré** (fond sombre + numéro + pointe) | ✅ Validé | Idem |
| **Drapeau** (cercle clippé 3 bandes + étoile) | ✅ Validé | Pattern réutilisable pour tout pays |
| **Portrait Gemini** (médaillon + clipPath cercle) | ✅ Validé | "Fonctionne bien comme concept". Focus visage via `preserveAspectRatio="xMidYMin slice"` |
| **Pulse animé** (3 ondes radar décalées) | ✅ Validé | |
| **Tag éditorial** (rectangle + stat + ligne pointillée) | ✅ Validé | Couleurs à renforcer sur fond sombre — prévoir couleur texte plus contrastée en prod |
| **Losange premium** (diamant + tirets 4 coins) | ✅ Validé | |

**Règle prod issue de cette session :** couleurs de certains marqueurs dures à lire sur fond GéoAfrique sombre (`#2a1e0e`). En production : augmenter luminosité ou ajouter `text-shadow` / halo SVG derrière les labels.

**Portrait en médaillon :** technique = `<image>` SVG + `<clipPath>` cercle + `preserveAspectRatio="xMidYMin slice"`. Portrait Gemini : `/public/poc-mapbox-tests/portrait-roi.png`.

**Pour sessions R&D suivantes :** utiliser style **`light-v11`** (fond clair) pour mieux voir la carte pendant les tests. Revenir à `dark-v11` / `STYLE_GEO_AFRIQUE` pour production.

---

## 🟡 Effets À TESTER (proposés, mini-renders requis)

### Identité pays sans jugement moral

**Contexte** : règle "aucune couleur ne code un jugement moral" (voir `feedback_souverain-couleurs-narratives.md`). Mais les couleurs restent **autorisées et utiles** quand justifiées narrativement. Ces options offrent des alternatives à l'aplat coloré simple pour des contextes sensibles ou multi-pays.

| Option | Description | Use case |
|--------|-------------|----------|
| **A — Drapeau pattern fill** | Mapbox `fill-pattern` avec PNG drapeau désaturé sur polygone pays | Premium signature, identité forte sans hiérarchie |
| **B — Bande horizontale stylisée** | Pays en teinte neutre + bande au centre reprenant 2-3 couleurs principales du drapeau | Compromis identité/sobriété |
| **C — Cartouche éditorial hors territoire** | Pays reste en GéoAfrique neutre + cartouche à côté avec drapeau + nom + chiffre | Style atlas Larousse premium |
| **D — Drapeau pattern + glow doux** | Combo A avec glow autour des frontières | Pays "actifs" dans une scène |
| **E — Or sourd unifié** | Tous les pays au même traitement doré sourd, identités via cartouches textuels | Quand on veut neutralité totale |

**Mini-render à faire** : tester les 5 options sur une scène multi-pays (ex: 4 pays Sahel ou 6 pays Or Africain) pour comparer lisibilité, beauté, ergonomie production.

### ~~Effets de texture et grain~~ — ❌ REJETÉ 2026-05-07
Grain papier, bordure ornement, vignette, parchemin — testés dans `MapboxTextures`. Verdict Aziz : "ne rajoute pas vraiment autre chose, juste de la couleur à l'écran". Pas d'utilité narrative identifiée pour l'instant. Ne pas intégrer.

### Animations avancées — ✅ TOUS VALIDÉS 2026-05-07

Testés dans `MapboxAnimations` (V1) + `MapboxAnimationsV2` (poussés). Tous validés Aziz ("impressionnant").

| Effet | Fichier ref | Notes production |
|-------|-------------|-----------------|
| **Pulse radar** | `MapboxAnimationsV2` f0–160 | 3 ondes rouge→ambre→or, point central pulsant, label synchronisé. Usage : ville active, événement géo |
| **Tracé progressif route** | `MapboxAnimationsV2` f160–330 | Ombre portée + easing vitesse + villes nommées au passage. Usage : itinéraires historiques, Atlas |
| **Flèches flux courbées** | `MapboxAnimationsV2` f330–510 | Arcs Bézier Q + tirets animés + badges stats au milieu. Usage : flux commerciaux, Or Africain |
| **Ken Burns satellite→dark** | `MapboxAnimationsV2` f510–660 | Plongée satellite→dark avec fondu masquant reload style. Usage : hook Atlas, ouverture épisode |
| **Particules flux dirigé** | `MapboxAnimationsV2` f660–810 | 35 pts suivent route, traîne comète 5 pos, boost Tombouctou. Usage : migrations, caravanes |
| **Heatmap respirante** | `MapboxAnimationsV2` f810–960 | Intensity oscillante + isochrones tirets animés + labels km. Usage : densité pop, Souverain |

**Patterns techniques clés :**
- Tous les overlays = SVG Remotion par-dessus Mapbox (portable D3-Geo aussi)
- Arcs Bézier : `M x1,y1 Q cx,cy x2,y2` — cx/cy = midpoint + offset perpendiculaire `(-dy/len * 50, dx/len * 50)`
- Heatmap respiration : `map.setPaintProperty("lyr", "heatmap-intensity", val)` chaque frame dans `useEffect([frame])`
- Ken Burns style switch : `map.setStyle()` + overlay div noir opacity 0→0.45→0 pour masquer reload
- Particules route : `getRoutePos(t)` interpole entre waypoints selon phase 0→1 cyclique

### ~~Compositions hybrides~~ — ✅ VALIDÉS 2026-05-07 (`MapboxHybrides`)
- Split-screen 50/50, carte floue + texte, Ken Burns statique — tous validés Aziz.

### ~~Marqueurs et pions~~ — ✅ VALIDÉS 2026-05-07 (`MapboxMarqueursV2`)
7 types validés — voir section ✅ ci-dessus.

### ~~Transitions entre cartes~~ — ✅ VALIDÉS 2026-05-07 (`MapboxTransitions`)
- Fade entre styles, wipe géographique, match-cut — tous validés Aziz.

### Effets temporels
- **Timeline glissante** (curseur année 1990 → 2026 + carte qui change selon l'année)
- **Animation flagcolors progressifs** (pays apparaissent un par un avec leur drapeau) — révélation pédagogique
- **Layer historique vs moderne** (frontières 1900 vs 2026, blend) — pertinent pour Atlas/Hannibal

---

## ❌ Effets ÉCHOUÉS ou DÉCONSEILLÉS

### Effets référence canal externe — NON CONCLUANTS 2026-05-07
Tentés dans `MapboxShowcaseV2`. Verdict Aziz : "non concluant, complètement différent des références".

| Effet | Pourquoi raté | Prérequis pour réussir |
|-------|---------------|------------------------|
| **Drapeau projeté sur territoire satellite** | clipPath bbox rectangulaire ≠ forme réelle du pays. Il faut le vrai polygone GeoJSON + SVG clipPath D3-Geo | Importer le GeoJSON Natural Earth du pays, projeter avec D3-Geo, utiliser comme clipPath SVG |
| **Soldats en médaillons le long d'une frontière** | Médaillons placés sur points durs (tableau manuel) ≠ le long du path réel de frontière | Extraire les coordonnées du linestring frontière depuis GeoJSON, interpoler N points équidistants |
| **Carte monde plate sur table quadrillée** | Seul effet partiellement concluant — NASA Blue Marble + CSS rotate + grille SVG | OK en production avec meilleure image source (Natural Earth illustré, pas satellite) |
| **Photo landmark + bâtiment iso posé sur carte** | Portrait roi utilisé au lieu d'une vraie photo de monument. Bâtiment iso flottait sans fond de carte | Nécessite vraie photo monument (Unsplash/Wikimedia) + carte light-v11 visible en dessous |

**Décision** : ne pas reprendre ces 4 effets sauf si session R&D dédiée avec vraies ressources (GeoJSON pays, photos monuments). Reprendre éventuellement plus tard.

- **`npx remotion render` direct sur compositions Mapbox** — WebGL fail. Toujours `render-mapbox.sh`.
- **Zoom < 0.3 delta** — invisible (tuiles Mapbox = niveaux entiers).
- **Segmentation de mouvement caméra** (segments avec micro-pauses) — saccades visibles. Toujours interpolate continu.
- **Couleur rouge vif comme code "agresseur"** — viole règle Souverain. Si rouge = composante drapeau OU narrativement justifié (or, sang d'un fait précis), OK. Mais jamais comme code moral subliminal.
- **CSS `transition` natives** sur éléments Mapbox — incompatible avec frames Remotion. Toujours `useCurrentFrame()` + `interpolate()`.

---

## Méthodologie pour tester un nouvel effet

1. **Identifier l'effet précis** dans ce fichier (section À TESTER) ou nouveau
2. **Créer composition POC** dans `src/projects/poc-mapbox-tests/` (à créer si absent)
3. **Mini-render via `render-mapbox.sh`** — durée 5-10s suffit
4. **Évaluation** : lisibilité, beauté, ergonomie production, performance, droits
5. **Validation Aziz** sur mini-render
6. **Si validé** → déplacer dans section ✅ + intégrer dans `_shared/mapbox/` si réutilisable
7. **Si rejeté** → noter dans section ❌ avec raison

---

## Compositions POC à créer (session R&D Mapbox future)

Quand tu lances une session de tests Mapbox dédiée :

- [ ] `MapboxFlagPatterns` — test Options A/B/C/D/E pour identité pays
- [ ] `MapboxTextures` — grain papier, parchemin, bordures ornement, vignette
- [ ] `MapboxAnimationsAvancees` — pulses, flèches inverses, tracé progressif
- [ ] `MapboxHybrides` — carte + portrait, carte + texte
- [ ] `MapboxMarqueurs` — SVG ornementés, pions photo, pions chiffrés
- [ ] `MapboxTransitions` — fade entre styles, wipe géographique, match-cut

**Estimation** : 1 session R&D dédiée (~3-4h) suffit pour tester les 6 catégories. Résultats réutilisables sur **tous les épisodes futurs** (Atlas, Souverain, Money Legends).

---

## Lien avec autres fichiers

- API Mapbox détaillée : `src/projects/_shared/mapbox/MAPBOX-COMPOSANTS.md`
- Style signature : `memory/feedback_mapbox-style-geo-afrique.md`
- Branding hide : `memory/feedback_mapbox-branding-hide-pattern.md`
- Zoom delta : `memory/feedback_mapbox-zoom-delta-minimum.md`
- Render script : `memory/feedback_remotion-mapbox-render-script.md`
- Couleurs narratives : `memory/feedback_souverain-couleurs-narratives.md`
- Skills officiels : `mapbox-cartography`, `mapbox-style-quality`, `mapbox-data-visualization-patterns`, `mapbox-style-patterns`
