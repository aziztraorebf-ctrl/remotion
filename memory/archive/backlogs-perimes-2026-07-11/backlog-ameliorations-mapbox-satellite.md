# Backlog — Améliorations Mapbox Satellite (template `MapboxSatelliteSenegal`)

> **Statut V1** : validée Aziz 2026-05-21. Pattern reconnu comme premium (zoom + pitch + bearing fluide, vignettage, cartouche éditorial).
> Ce fichier liste les améliorations identifiées AVANT prochaine session pour ne perdre aucun learning.

## Référence V1 (validée)
- **Code** : `src/projects/_proto-16-9/Prototype_A_MapboxSatelliteSenegal.tsx`
- **Render FINAL** : `out/templates-souverain/FINAL-MapboxSatelliteSenegal-v1-16x9.mp4` (9.4 MB, 1920×1080, 6s)
- **Catbox MP4** : https://files.catbox.moe/zdramv.mp4
- **Frames** : mid https://files.catbox.moe/hnvai5.png — end https://files.catbox.moe/1zm06w.png
- **Pattern source** : copy de `AtlasRealiste3DShowcase` + `applyAtlasRealiste3D` + `satellite-v9`
- **Render command** : `./scripts/render-mapbox.sh ProtoA-MapboxSatelliteSenegal out/...mp4` (jamais `npx remotion render` direct — voir [feedback_mapbox-render-pattern-canonique](feedback_mapbox-render-pattern-canonique.md))

## Améliorations à apporter (V2)

### 1. ⭐ PRIO HAUTE — Océan trop sombre

**Feedback Aziz 2026-05-21** : "l'océan est beaucoup trop sombre et mériterait d'être travaillé".

**Investigation à faire** :
- Vérifier dans `applyAtlasRealiste3D` (fichier `src/projects/_shared/mapbox/templates/AtlasRealiste3D.tsx`) s'il y a un override sur la couche `water` ou `background`
- Style `satellite-v9` montre l'océan en photo satellite réelle (sombre par défaut, surtout Atlantique Ouest tropical)
- Options à tester :
  - **Option A** : override `paint["raster-brightness-max"]` du raster satellite pour éclaircir uniquement l'océan
  - **Option B** : ajouter une couche `fill` semi-transparente sur l'eau (color `#1e6091` avec opacity 0.4 — couleur signature Jacq Adi vue dans `MapboxSatelliteBeat.tsx:142`)
  - **Option C** : ajuster le vignettage radial gradient pour qu'il assombrisse moins (actuel `rgba(0,0,0,0.55)` → tester `0.35` ou `0.4`)
  - **Option D** : mix des 3

**Recommandation initiale** : tester Option B en premier (override `water` color → bleu chaud cohérent palette Souverain or). Préserve le terrain satellite, allège l'océan, garde le look premium.

### 2. Caméra — affiner les keyframes
- Démarrage actuel `lon: -5, lat: 14, zoom: 2.6` = vue large Afrique de l'Ouest. À tester un démarrage encore plus large (zoom 1.8, monde entier) pour plus d'impact narratif sur le zoom
- Pitch final 55° — tester 60-65° pour effet drone encore plus marqué

### 3. Highlight Sénégal — Sangomar offshore non visible
- Aujourd'hui : tout le Sénégal en or `#d4a93c` avec opacity 0.55
- Le **bloc Sangomar lui-même** (la zone offshore qui est le sujet) n'est pas dessiné. Il faut ajouter un `<HatchedZone>` (template prévu Phase 3) ou un simple polygone offshore avec hachures bleues
- Coordonnées Sangomar : ~[-16.5, -16.8] lon / [13.7, 14.1] lat (à vérifier — bloc rectangulaire offshore au sud de Dakar)

### 4. Cartouche éditorial — typographie
- Police actuelle Georgia serif — bon pour signature Souverain
- Sublabel "100 km offshore — Opérateur Woodside Energy" est en bas-droite, trop petit (fontSize: 20). Tester 26-28
- Tester aussi un cartouche dynamique qui mute pendant le zoom (le texte change de "SÉNÉGAL / BLOC SANGOMAR" à "BLOC SANGOMAR / 100k barils/jour" quand on arrive sur le zoom final)

### 5. Layer hillshade — vérifier visibilité 16:9
- `applyAtlasRealiste3D` ajoute un hillshade. Ce serait visible si on regarde le terrain Mali/Saharien. Sur Sénégal côte Atlantique + océan, l'effet est minime
- À tester sur d'autres pays (Niger uranium → relief Aïr, Mali → falaises Bandiagara) pour valider que le hillshade ressort

### 6. Audio sync (futur)
- V1 est sans audio. Le timing keyframes 0→90→180 frames (0→3→6s) doit s'aligner avec :
  - Une narration "Le bloc Sangomar, 100 km au large de Dakar..." → pic de zoom sur le mot "Sangomar"
  - Un SFX subtil de zoom drone synchronisé
- À traiter quand on intègre dans Beat1 Sénégal Pétrole

### 7. Compositions dérivées à coder
Une fois V2 validée, créer des compositions sœurs pour Maroc Batteries (focus Atlas Mountains), Niger Uranium (focus Aïr), Mali (focus Boucle du Niger) — chacune avec une cible spécifique au sujet.

## Anti-patterns confirmés (NE PAS reproduire)

- ❌ Utiliser `MapboxSatelliteBeat` wrapper → worker .send error
- ❌ `npx remotion render` direct sans `--gl=angle` → écran noir WebGL fail
- ❌ Style `satellite-streets-v12` (charge labels + symbol layers = bug worker)
- ❌ Mesurer la luminosité d'une frame via `od -An -tu1` (aléatoire) — utiliser `ffmpeg signalstats metadata=mode=print`

## Liens

- Pattern canonique render Mapbox : [feedback_mapbox-render-pattern-canonique.md](feedback_mapbox-render-pattern-canonique.md)
- Audit composants opaques (pour Proto B data hero) : `/tmp/audit-composants-opaques.md` (à consolider dans memory/audit-templates-16-9.md Phase 1c)
- Référence visuelle directe : Caspian Report "Why Greenland is only the beginning" — `/tmp/benchmark-frames/caspian/`
