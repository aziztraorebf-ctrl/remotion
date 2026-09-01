# Mapbox + Remotion — Pattern canonique obligatoire

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-15, mis à jour 2026-05-24). Vérifié 2026-08-31 :
> `scripts/render-mapbox.sh` et `src/projects/_shared/demos/AtlasRealiste3DShowcase.tsx` toujours
> présents. Détecté en R&D Proto A 16:9 Sénégal.

## Règle absolue

**TOUT render d'une composition contenant `mapbox-gl` DOIT passer par `./scripts/render-mapbox.sh <CompositionId> <output.mp4>`.**

Jamais `npx remotion render` direct sur une compo Mapbox → écran noir garanti.

## Why : 2 couches de bug

**Couche 1 — WebGL** : Chromium headless par défaut de Remotion n'a pas WebGL activé. Erreur silencieuse :
```
[mapbox-gl] Error: Failed to initialize WebGL
[MapboxSatelliteBeat] map constructor error
```
→ Le composant fail au constructor, continueRender appelé, render produit écran noir.

Fix : `--gl=angle` + `--browser-executable=Chrome for Testing` (path dans le script).

**Couche 2 — Worker .send sur certains styles** : avec `--gl=angle` activé, certains styles Mapbox (`satellite-streets-v12` notamment, via le wrapper `MapboxSatelliteBeat`) trigger :
```
[mapbox-gl] Error: Cannot read properties of undefined (reading 'send')
[mapbox-gl] Error: Could not load image because of Cannot read properties of undefined (reading 'send')
```
→ Les tiles ne chargent jamais, seul le fallback background `#1e6091` apparaît.

Fix : ne **PAS** utiliser `MapboxSatelliteBeat` + `satellite-streets-v12`. Utiliser le pattern `AtlasRealiste3DShowcase` :
- Style brut : `mapbox://styles/mapbox/satellite-v9`
- Custom helper : `applyAtlasRealiste3D(map)` (qui ajoute hillshade)
- Highlight pays : `addCountryFocus(map, ISO, color, opacity)`

## How to apply

**Quand tu codes une nouvelle compo Mapbox 16:9 ou vertical :**

1. **Copier la structure** de `src/projects/_shared/demos/AtlasRealiste3DShowcase.tsx` (le pattern code inline du composant — useRef, useEffect avec `delayRender`, `applyAtlasRealiste3D`, `setProjection("mercator")`)
2. Adapter : caméra (lon/lat/zoom/pitch/bearing), ISO pays focus
3. Render via `./scripts/render-mapbox.sh ProtoX-CompName out/proto.mp4`
4. Vérifier taille fichier : < 1 MB = écran noir, > 5 MB = carte rendue OK
5. Mesurer luminosité : `ffmpeg -i frame.jpg -vf format=gray,signalstats,metadata=mode=print -f null - 2>&1 | grep YAVG` — YAVG < 5 = écran noir, > 30 = carte visible

## Anti-patterns à proscrire

- `MapboxSatelliteBeat` avec `satellite-streets-v12` (worker .send error)
- `npx remotion render` direct sans `--gl=angle`
- `MapboxBase.applyGeoAfriqueV5(map)` avec pitch > 0 (style dark conçu pour 2D plat — pitch tord les pays bizarrement)
- Mesurer 1 frame en luminosité moyenne sans signalstats — `od -An -tu1` aléatoire et non fiable

## Référence implémentation validée

Format 1080×1920 (vertical) : `src/projects/_shared/demos/AtlasRealiste3DShowcase.tsx` — `applyAtlasRealiste3D` + 2 phases Niger/Mali

Format 1920×1080 (horizontal) : proto historique `Prototype_A_MapboxSatelliteSenegal.tsx` (⚠️ vérifier existence — daté R&D avril/mai 2026, potentiellement archivé)

---

## MAJ 2026-05-24 — render-mapbox.sh fixé définitivement

**2 problèmes additionnels résolus** lors de la prod Beat13 Sénégal :

### Problème 1 — Chrome for Testing timeout sur Root.tsx lourd
Avec un `src/index.ts` enregistrant 300+ compositions, Chrome for Testing time out à 28s avant d'avoir chargé le bundle. **Fix** : utiliser `chrome-headless-shell` (path `~/Library/Caches/ms-playwright/chromium_headless_shell-1217/...`).

### Problème 2 — Copie de 2.5 GB sur chaque render
`public/` contient des Go de seedance/atlas/assets inutiles pour Mapbox. Chaque render Mapbox copiait tout. **Fix** : `--public-dir` slim via symlinks vers `/tmp/public-mapbox-slim/` (uniquement `souverain/`, `atlas/`, `_shared/`, `geo-data/`, `fonts/`).

### Script final
Le script `scripts/render-mapbox.sh` intègre les 2 fixes. Pattern de référence : voir le commit fixant ces deux problèmes (header du script daté `FIX 2026-05-24`).

### Pour les beats Souverain Mid-form
Préférer `MAPBOX_STYLES.dark` (pas `satellite-v9` en headless — tuiles trop lentes pour un beat de 49s). Pattern validé : Beat13 Sénégal (`beat13-FINAL.mp4`).
