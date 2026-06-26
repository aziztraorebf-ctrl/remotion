---
name: Atlas Template V1 — pipeline production complet
description: Template technique reutilisable pour produire un episode Atlas (richesse-record/heros-oublies geo). Couvre script -> render -> publication.
type: project
---

# Atlas Template V1 — Pipeline production

> ⛔ **PÉRIMÉ — décrit l'ancienne archi Mapbox (répertoire `quebec-jacques-poc/` supprimé).**
> Atlas moderne = **d3-geo SVG** (PAS Mapbox). Scripts narration/SFX/musique déplacés vers `scripts/`.
> **Pour produire un épisode Atlas aujourd'hui : lire `memory/doctrines/ATLAS-BEAT-DEMARRAGE.md`.**
> Scripts actifs : `scripts/generate-narration-expressive.py` (narration) · `scripts/generate-sfx-elevenlabs.py` (SFX) · `scripts/generate-music-minimax.py` (musique).
> Ce fichier conservé pour référence historique (palette, overlays, coûts).

---

> Premiere version validee : Atlas Tombouctou V8 (2026-04-29) — ancienne archi Mapbox.
> Pour ECRIRE le script : voir `script-atlas-v1.md`.
> Ce fichier = comment PRODUIRE l'episode apres script lock (ancienne archi).

---

## 1. Script lock + fact-check

**Pre-requis** : script ecrit selon `script-atlas-v1.md` (formule Cesar pure, 6 segments fixes : Hook / Setup geo / Fact 1 / Fact 2 / Comparison / Punchline).

**Duree cible** : 25-30s narration brute, ~30-35s avec respirations.

**Fact-check obligatoire AVANT toute generation** : tous les chiffres et dates verifies via WebSearch / sources academiques. Voir `quebec-jacques-poc/research/FACT-CHECK-CONVERSATION.md` pour exemples.

---

## 2. Audio production

### 2.1 ElevenLabs narration
- **Voix canonique Atlas** : `z3gESu49naEZW8Af2Upm` (Narratrice GeoAfrique v2). PAS Chris.
- **Modele** : `eleven_multilingual_v2`
- **Settings** : stability 0.5, similarity 0.75, style 0.3
- **Scan TTS obligatoire avant call** (regles CLAUDE.md) : zero participe passe e/ee fin de groupe, zero "ont + voyelle", nombres en lettres
- **Script** : `quebec-jacques-poc/scripts-atlas/generate-atlas-narration.py`

### 2.2 Forced alignment (timing precis mots)
- **Endpoint** : ElevenLabs `/v1/forced-alignment` (PAS Whisper — drift jusqu'a 2.5s detecte)
- **Output** : JSON word-level timings dans `out/<projet>/narration-v1-alignment.json`
- **Script** : `quebec-jacques-poc/scripts-atlas/forced-alignment.py`
- **Usage** : permet de placer T.maliConverge, T.tombouctouAppears etc. au frame exact ou le mot est prononce

### 2.3 SFX (3 standards)
- **B = impact ville** (apparition marker pin) — volume 0.6, duree 0.8s, 3 frames AVANT le mot
- **C = ink-draw caravane/route** — volume 0.85, duree ~2.2s, sync sur debut animation route
- **D = cartouche stat thud** — volume **1.5**, duree 0.7s, 3 frames AVANT le mot
- **Script** : `quebec-jacques-poc/scripts-atlas/generate-sfx.py`

### 2.4 Musique de fond Minimax v2.6
- **Endpoint fal.ai** : `fal-ai/minimax-music/v2.6` avec `{"prompt": str, "is_instrumental": true}`
- **Variante validee Atlas** : C — Mande Contemplatif (kora solo + balafon style Toumani Diabate)
- **Volume** : **0.04** (definitif — narration dominante)
- **Fade** : 2s in / 2s out
- **Script** : `quebec-jacques-poc/scripts-atlas/generate-music-v2.py`

---

## 3. Style.json Mapbox (REUTILISABLE — pas a refaire)

**Fichier** : `quebec-jacques-poc/mapbox-styles/atlas-parchemin-mande-relief.json`

**Composition base** (10 layers) :
1. background-ocean `#3A4A6A`
2. coast-halo-outer (halo bleu fonce)
3. land-base terracotta interpole zoom (`#A85A3A` -> `#C4995A`)
4. hillshade-relief (terrain 3D)
5. land-shadow-east (TD/CF/SD/CM/NG en brun fonce)
6. rivers (Niger, etc.)
7. country-borders (frontieres fines indigo)
8. label-sahara
9. label-cities-major (filtre "Timbuktu" -> "TOMBOUCTOU")
10. label-rivers-niger

**Palette Atlas** (palette Parchemin Mande) :
- Terracotta : `#A85A3A` -> `#C4995A` (terre)
- Indigo : `#1F2A4A` (ocean, signature, fills pays anime)
- Dore : `#D4A574` (markers, route, bordures glow)
- Creme parchemin : `#F2E5C8` (texte halo)
- Vert drapeau : `#009A00` / `#2D6A3F`

**Pour adapter a un autre pays/region** : modifier uniquement `label-cities-major` (filtre + texte) et eventuellement `land-shadow-east` (codes ISO_A3 voisins). Le reste reste identique.

---

## 4. Composition Remotion (template)

**Fichier modele** : `quebec-jacques-poc/src/AtlasTombouctouShowcase.tsx` (V8 finale)

### 4.1 KEYFRAMES camera par defaut
```ts
[
  { frame: 0,                       lon: 5,    lat: 18,  zoom: 1.5, pitch: 0,  bearing: 0 },
  { frame: T.tombouctouAppears,     lon: 0,    lat: 17,  zoom: 3.5, pitch: 25, bearing: 5 },
  { frame: T.sankoreAppears,        lon: city, lat: city, zoom: 5.0, pitch: 45, bearing: 12 },
  { frame: DURATION_FRAMES,         lon: city, lat: city, zoom: 5.5, pitch: 55, bearing: 18 },
]
```
**Easing** : `Easing.inOut(Easing.cubic)` sur tous les axes, `extrapolate: "clamp"`

### 4.2 Switch projection globe -> mercator
- Trigger : `zoom >= 4.2`
- Code : `mapRef.current.setProjection({ name: targetProjection })` quand seuil atteint
- **PAS de crossfade** pour masquer le saut (anti-pattern V5-V7 retire en V8 — double clipping)
- Le saut natif ~1 frame est plus subtil

### 4.3 Pays colorie (overlay SVG React)
**Critique** : ne PAS utiliser Mapbox `addLayer` + `setPaintProperty` en globe mode (ne fonctionne pas en Remotion headless). Voir `feedback_mapbox-overlay-svg-vs-layer.md`.

**Pattern** :
1. Telecharger Natural Earth 50m : `data/ne_50m_countries.geojson`
2. Extraire polygone via Python (script dans `feedback_geojson-natural-earth-50m.md`)
3. Stocker dans `src/<pays>-polygon.json`
4. Importer + projeter via `map.project()` a chaque frame
5. Dessiner `<polygon>` SVG avec interpolation opacity

```tsx
const maliOpacity = interpolate(frame, [T.maliConverge, T.maliConverge + 20], [0, 1], {extrapolateLeft:"clamp",extrapolateRight:"clamp"});
<svg style={{position:"absolute",inset:0}} viewBox={`0 0 ${width} ${height}`}>
  <polygon points={maliPolyPx} fill="#1F2A4A" fillOpacity={maliOpacity * 0.65} />
  <polyline points={maliPolyPx} fill="none" stroke="#D4A574" strokeWidth="5" strokeOpacity={maliOpacity * 0.95} filter="url(#glow)" />
</svg>
```

### 4.4 Overlays standards reutilisables
| Overlay | Trigger | Pattern |
|---------|---------|---------|
| Marker ville pin | `T.cityAppears` | div circle + pulse `interpolate(pulsePhase)` + spring scale |
| Label TOMBOUCTOU | meme frame | div texte 64px Helvetica 900, halo indigo |
| Route caravane | `T.routeStart` | `<line>` SVG dasharray + spring routeProgress |
| Mosquee/landmark medaillon | `T.landmarkAppears` | div circle 260px border dore + Img cover, fond `#1F2A4A` solide |
| Drapeau pays | `T.countryConverge` | div spring scale, drapeau 72x48 + hampe 3x44 |
| Cartouche stat | `T.statAppears` | div bottom 60/60/200, bg rgba(31,42,74,0.92) + border dore + Helvetica 110 |

---

## 5. Render & publication

### 5.1 Render command standard
```bash
cd quebec-jacques-poc
npx remotion render src/index.ts <CompositionName> out/<projet>/showcase-vN.mp4 --gl=angle --concurrency=1
```
**Performance** : ~65s render pour 26s @ 30fps 1080x1920 (~0.4x realtime).

### 5.2 Upload Vercel Blob
```bash
cd /Users/clawdbot/Workspace/remotion
python scripts/tools/upload-to-blob.py quebec-jacques-poc/out/<projet>/showcase-vN.mp4 --folder <projet>/wip
```
**Aziz mobile** = upload obligatoire pour validation. URL retournee en sortie.

**Quota Hobby 1GB** : nettoyer regulierement les anciens renders sur Vercel pour eviter 400 storage exceeded.

### 5.3 Publication Postiz
Voir `publication-platform-postiz.md` (TikTok / YouTube Shorts / Instagram Reels).

---

## 6. Cout typique par episode Atlas

| Poste | Cout |
|-------|------|
| ElevenLabs narration (~30s) | $0.01 |
| ElevenLabs SFX (3) | ~$0.001 |
| Gemini asset landmark (1-2 generations) | $0.07-0.14 |
| Minimax 1-3 musiques | $0.10-0.30 |
| Mapbox tiles | $0 (gratuit jusqu'a 50k loads/mois) |
| Vercel Blob | $0 (1GB Hobby) |
| **Total** | **$0.40-0.50** |

---

## 7. Variantes a l'etude (V8 -> V9)

Espace d'experimentation pour episode 2 Mansa Moussa :
- Plus de mouvements camera (orbit/dolly multi-segment) ?
- Apparition pays voisins en cascade (effet domino empire) ?
- Crossfade audio entre ambient SFX et musique ?
- Texte revelation "DID YOU KNOW" 3D ?

A valider sur Mansa Moussa puis remonter dans ce template si validees.

---

## 8. Lien vers fichiers de reference

- Script template : `memory/templates/script-atlas-v1.md`
- Hook template : `memory/templates/hook-short.md`
- Camera movements : `memory/tools/camera-movements.md`
- Voix : `memory/voices-v3.md`
- Tools Mapbox patterns : `.claude/skills/mapbox-cartography`, `mapbox-web-integration-patterns`, `mapbox-data-visualization-patterns`
- Tools Remotion : `memory/tools/remotion.md`
- Feedbacks critiques :
  - `feedback_atlas-direction-visuelle-actee.md`
  - `feedback_geojson-natural-earth-50m.md`
  - `feedback_mapbox-overlay-svg-vs-layer.md`
  - `feedback_aziz-mobile-uploads-vercel.md`
- Brief next-session : `NEXT-SESSION-atlas-tombouctou-iterations.md`

---

## 9. Checklist pre-production episode N

Avant de commencer un nouvel episode Atlas :
- [ ] Script ecrit selon script-atlas-v1.md
- [ ] Fact-check fait sur tous chiffres/dates
- [ ] Codes ISO_A3 des pays a animer identifies
- [ ] Coordonnees lon/lat des villes/landmarks recuperees (Wikipedia)
- [ ] Polygones GeoJSON Natural Earth 50m extraits si fill pays anime
- [ ] Asset landmark genere si necessaire (Gemini, fond `#1F2A4A` solide pour medaillon)
- [ ] Composition cree dans `src/<Episode>Showcase.tsx` (copy-paste de Tombouctou)
- [ ] Variants musique a tester documentees dans le brief
- [ ] Composition enregistree dans `src/index.ts`
- [ ] Render command testee localement
