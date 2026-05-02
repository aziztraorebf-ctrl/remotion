# NEXT SESSION — Atlas Shaka Zulu Vague 2 : Carte d3-geo réelle

> Mis à jour : 2026-05-02 post-restructuration workspace
> Ce fichier est le brief actif. Lire EN ENTIER avant tout code.

---

## CE QUI VIENT D'ÊTRE FAIT (session 2026-05-02)

1. **Workspace restructuré** — ~8 GB libérés, structure propre et durable
2. **`src/projects/atlas/_shared/`** — composants partagés Atlas centralisés (AtlasMercator, AtlasGlobe, AtlasCaravane, etc.) + ATLAS-COMPOSANTS.md catalogue
3. **`public/seedance/`** — pilier Seedance centralisé (style-refs, test-clips, heros-oublies-refs, historical-refs, moodboards, INDEX.md)
4. **`memory/episodes/`** — mémoire épisodes migrée (mansa-moussa/ + shaka-zulu/)

---

## ÉTAT SHAKA ZULU (vague 1 terminée)

### Ce qui est SOLIDE — ne pas toucher

| Élément | Fichier | Statut |
|---------|---------|--------|
| Composition principale | `src/projects/atlas/shaka-zulu/AtlasShakaFull.tsx` | VERROUILLÉ |
| Timing | `src/projects/atlas/shaka-zulu/timing.ts` | VERROUILLÉ |
| Narration | `public/atlas-shaka-zulu/audio/narration-v5.mp3` | VERROUILLÉ |
| Musique | `music-ingoma.mp3` + `music-isicathamiya.mp3` | VERROUILLÉ |
| Palette | OR `#C8A84B` / BORDEAUX `#8B1A1A` / PARCHEMIN `#F5E6C8` | VERROUILLÉE |
| MourningWarp.tsx | `scenes/components/` | VERROUILLÉ |
| Inserts S2 | InsertIklwaSchema, InsertBouclierSchema, InsertCornesSchema | FONCTIONNELS |
| InsertNombre1500, InsertNombre4000 | `inserts/` | FONCTIONNELS |

### Ce qui est PLACEHOLDER — vague 2 = remplacer

| Scène | Fichier | Problème | Solution |
|-------|---------|----------|---------|
| HOOK | AtlasShakaHook.tsx | Globe fake | AtlasGlobe d3-geo |
| S1_GEO | AtlasShakaS1Geo.tsx | Cercle CSS fake | AtlasMercator + `territory` |
| S3_EXPANSION | AtlasShakaS3Expansion.tsx | Placeholder vide | AtlasMercator + `expansion` + sprites impi |
| S4_NANDI | AtlasShakaS4Nandi.tsx | Placeholder + MourningWarp | AtlasMercator + `mourning` + MourningWarp |
| S2_A3 Cornes | AtlasShakaS2A3Cornes.tsx | Carte placeholder | AtlasMercator + `territory` + warriors |
| S5_CTA | AtlasShakaS5CTA.tsx | Cascade texte à finir | Cascade Napoléon/Alexandre/Shaka |

---

## PLAN D'ATTAQUE — Ordre strict

**Règle absolue : une scène → mini-render → Aziz valide → commit → scène suivante.**

### ÉTAPE 1 — S1_GEO (démarrer ici, ~45 min)

**Ce que Claude fait :**
1. Ouvrir `src/projects/atlas/shaka-zulu/scenes/AtlasShakaS1Geo.tsx`
2. Lire `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md` pour vérifier AtlasMercator
3. Remplacer tout le contenu par :
   - `AtlasMercator` depuis `../../_shared/atlas-components` + data `shaka-zulu-data.json` projection `territory`
   - `KwaZulu` : crème `#F5EBD8`, océan `#3A5A7E`, terres terracotta `#C97D5A`
   - Camera : zoom scale `0.9 → 1.15` via `interpolate()` continu sur la durée
   - `AtlasLabel` : "uMgungundlovu" + "GqokliHill"
   - `AtlasPulseMarker` : sur uMgungundlovu
   - `AtlasCartouche` : "ROYAUME ZULU — 1816"
   - `InsertNombre1500` : INCHANGÉ (trigger `insertNombre1500.triggerFrameLocal` déjà passé)
4. Mini-render :
   ```bash
   npx remotion render AtlasShakaFull out/shaka-s1-test.mp4 \
     --frames=167-350 --gl=angle --concurrency=1
   ```
5. Aziz valide → commit `feat(shaka-zulu): S1_GEO carte d3-geo AtlasMercator`

### ÉTAPE 2 — S3_EXPANSION (~45 min)

1. `AtlasMercator` projection `expansion`
2. `AtlasCaravane` adapté : sprite impi sur path Bezier KwaBulawayo → nord/ouest
   - Sprite : vérifier `public/atlas-shaka-zulu/assets/shaka-walk-east/` ou `warrior-walk-east/`
3. `AtlasCartouche` : "100 000 GUERRIERS"
4. Insert bar chart 1500→50000 : forker `AtlasInsertBarChart` depuis `quebec-jacques-poc/src/AtlasMansaMoussaV2Final.tsx`
5. Mini-render frames 2195→2400

### ÉTAPE 3 — S4_NANDI (~30 min)

1. `AtlasMercator` projection `mourning`
2. Bascule palette : `frame < 398` → OR, `frame >= 398` → BORDEAUX (398 = NANDI_MEURT local)
3. `MourningWarp` par-dessus à partir du frame local NANDI_MEURT
4. `InsertNombre4000` : INCHANGÉ
5. Mini-render frames 2827→3050

### ÉTAPE 4 — S2_A3 Cornes (~30 min)

1. `AtlasMercator` projection `territory` en fond
2. 3 paths Bezier formation cornes — sprites warriors sur chaque path
3. `InsertCornesSchema` : INCHANGÉ
4. Mini-render frames 1493→1700

### ÉTAPE 5 — S5_CTA (~20 min)

1. Cascade texte : Napoléon (frame local `napoleonFrame`) → Alexandre → Shaka
2. Structure identique CtaScene Mansa Moussa
3. Cartouche final "Abonne-toi" avec atlas Afrique
4. Mini-render frames 4215→4509

### ÉTAPE 6 — HOOK (~20 min, en dernier)

1. Vérifier `public/atlas-shaka-zulu/hook/shaka-hook-seedance.mp4` — si utilisable en fond
2. `AtlasGlobe` + `atlas-globe-data.json` + zoom vers KwaZulu-Natal
3. Mini-render frames 0→146

### ÉTAPE 7 — RENDER FINAL

```bash
npx remotion render AtlasShakaFull \
  out/PRET-PUBLICATION/atlas-shaka-zulu-v1.mp4 \
  --gl=angle --concurrency=1
```

---

## IMPORTS CLÉS À UTILISER

```tsx
// Composants partagés Atlas
import {
  AtlasMercator, AtlasGlobe, AtlasLabel,
  AtlasPulseMarker, AtlasCaravane, AtlasCartouche, AtlasDefs
} from "../../_shared/atlas-components";

// Données carte
import shakaData from "../../_shared/shaka-zulu-data.json";

// Palette + fonts Shaka
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

// Timing (JAMAIS modifier)
import { SEGMENTS, S2_ACTS, INSERTS, NARRATIVE_BEATS, PALETTE } from "../timing";
```

---

## RÈGLES REMOTION (rappel)

- Camera moves : `interpolate()` CONTINU sur toute la plage, JAMAIS par blocs CSS
- Timing : variables de `timing.ts` UNIQUEMENT — zéro frame hardcodée
- INTERDITS : `CSS transition`, `@keyframes`, `setTimeout`, `requestAnimationFrame`
- Toujours `extrapolateLeft: "clamp", extrapolateRight: "clamp"` sur les interpolations

---

## ALERTES FORMAT (à garder en tête, pas bloquant)

La session de jury AI a détecté que 150s dépasse le Shorts Feed YouTube (max 60s à l'époque — YouTube a étendu à 3min en oct 2024, donc **non bloquant**). Shaka Zulu est une vidéo verticale long-form 2:30. Décision confirmée : on garde 150s.
