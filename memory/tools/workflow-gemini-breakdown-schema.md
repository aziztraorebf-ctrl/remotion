---
name: Schéma officiel breakdown Gemini 3.1-pro — prompt + JSON attendu + checklist
description: Référence blindée pour reproduire le pipeline breakdown à 85-90% de fidélité. Contient le prompt copier-coller, le schéma JSON complet avec tous les champs obligatoires, et la checklist de validation 5 points. Lire avant toute session Beat Souverain.
type: reference
---

## Contraintes OBLIGATOIRES dans le prompt Gemini storyboard (ajoutées 2026-05-22)

Deux contraintes manquaient dans les premiers appels Sénégal et Gemini a ignoré la géographie :

1. **60% Mapbox minimum** — écrire explicitement dans le prompt : "Au moins 3 beats sur 5 doivent utiliser Mapbox plein écran."
2. **Règle R1 explicite** — écrire : "R1 OBLIGATOIRE : max 8 secondes sans événement visuel fort. Les `r1_events` timestamps sont bloquants, pas optionnels."
3. **Champ `sfx[]` par beat** — ajouter au schéma JSON demandé (voir `feedback_sfx-dans-json-gemini.md`)
4. **STACK TECHNIQUE COMPLÈTE** — TOUJOURS coller le bloc "Stack disponible" ci-dessous dans le prompt (ajouté 2026-05-23). Sans ça, Gemini propose des mécaniques génériques (SVG primitif uniquement) au lieu d'exploiter D3/Three/Lottie/Mapbox/composants existants.

### Bloc "Stack disponible" à COLLER dans tout prompt breakdown Gemini

```
STACK TECHNIQUE À TA DISPOSITION (utilise-la pour proposer les meilleures mécaniques) :

Rendu vidéo :
- Remotion (React/TypeScript, render headless) — framework principal
- Tailwind CSS (tokens : text-gold #c8a951, text-ivory #f2ebd9, bg-navy #16213a)

Cartographie :
- Mapbox GL JS (frame-driven, pattern "1 seule Map continue", Pull Back Reveal, Whip Pan 60f)
- d3-geo (projections, Natural Earth datasets)

Data-viz (NOUVEAU 2026-05-23) :
- D3.js (d3-scale, d3-array, d3-format) pour graphiques data-driven : StackedBars, ProcessFlow, comparaisons multi-pays, axes, échelles, formatters monétaires
- Pattern : D3 utility-only + rendu SVG/React + animations Remotion

3D / motion :
- @remotion/three (Three.js intégré) pour 3D premium
- @remotion/lottie (animations After Effects/Rive importées)
- @remotion/paths, @remotion/shapes (SVG)

Génération assets :
- Gemini 3.1-flash-image-preview (images)
- Recraft (SVG)
- Seedance / Kling (clips vidéo)
- PixelLab (pixel art)
- ElevenLabs (TTS) + Whisper (forced alignment)

Composants Souverain réutilisables (à proposer si pertinent) :
- SplitScreenSouverain, BrutalHookSplit, PulseNumber, SurfaceComparison
- MapboxBase + applyGeoAfriqueV5
- Animations presets (fadeIn, popIn, gentleReveal, countUp, drawPath)
- Lucide-react (icônes)

ARSENAL CARTE VIVANTE (20 templates Mapbox prêts — PIOCHER ET COMBINER en priorité) :
hooks: KineticMaskSlam, FiberOpticFlagInvade · combos: ComboMaskSweep, ComboSweepDominoFlag, ComboFiberAuraPopup · inserts: MapCutaway(4 modes), RapidFireCountries, ClassifiedRedactReveal · territoire: MapboxFlagFill, MapboxIsolateZone, SequentialFlagReveal, GlassmorphismGeoPopup · dynamiques: SweepRevealTerritory, DominoContagionFill, FiberOpticBorderDraw · séquentiel: SequentialBorderPulse, LottieGeoAura · utilitaire: TypewriterText.

Outils ÉCARTÉS (ne pas proposer) :
- Motion Canvas, Revideo, Shotstack, Creatomate, Framer Motion
```

**OBLIGATOIRE pour tout breakdown carto** : COLLER AUSSI le brief complet `memory/tools/BRIEF-GEMINI-TEMPLATES-CARTE.md` dans le prompt Gemini (descriptions + props + méthode de combinaison + consigne "propose au moins 1 combo original"). Sans ça, Gemini propose des mécaniques génériques au lieu d'exploiter nos templates. Le brief dérive du catalogue maître `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md`.

→ Cette stack est aussi documentée dans `memory/doctrines/DOCTRINE-SOUVERAIN.md` section 9.

Format JSON `sfx` attendu dans chaque beat :
```json
"sfx": [
  { "trigger": "0s", "sound": "map-zoom-in", "description": "caméra s'approche du gisement" },
  { "trigger": "8s", "sound": "highlight-pop", "description": "impact quand le highlight pays apparaît" }
]
```

Sans ces 3 contraintes dans le prompt, Gemini produit un storyboard sans Mapbox et sans rythme.

---

## Checklist anti-récidive — 6 erreurs systématiques (scanner avant chaque beat)

**Source : Niger Uranium Jour 7, 4-5 corrections Aziz sur les mêmes patterns.**

1. **Bruit éditorial** — INTERDIT d'ajouter bandeaux header, sub-labels, captions qui paraphrasent la voix-off. Test : "est-ce que ce texte est déjà dit dans la voix-off ?" → oui = supprimer.

2. **Code legacy** — Ne JAMAIS garder la base technique d'un beat v1 raté. Copier-coller le bloc `mapboxgl.Map({...})` d'un beat Mapbox validé (projection mercator + Caspian + hide symbols). Adapter coords et layers, pas l'archi.

3. **Assets compositing** — Ne JAMAIS générer sujet + fond séparément. Un seul PNG par scène, fond intégré. Résultat = affiche éditoriale, pas collage.

4. **Timing trop serré** — Déclencher préparation visuelle (arc, halo) ~8s AVANT le mot-pivot. Sur le mot : pulse boost, pas un déclenchement.

5. **Labels illisibles** — INTERDIT texte gold sur fond crème. Toujours plate dark navy `#0d1525` + barre gold + texte blanc IBM Plex Mono.

6. **Review avant envoi** — Après render, extraire 5 frames, les lire, comparer au storyboard. PUIS envoyer à Aziz. Ne jamais annoncer "livré" sans avoir regardé.

---

# Schéma officiel breakdown Gemini 3.1-pro

> Source de vérité pour le prompt envoyé à Gemini 3.1-pro-preview et le JSON attendu en retour.
> Validé sur Niger Uranium Beats 2, 3, 5, 7 (Jour 6-7, 2026-05-10). Fidélité 85-90%.
> **Lire ce fichier AVANT de lancer le script breakdown sur un nouveau beat.**

---

## Modèle et endpoint

```
Modèle   : gemini-3.1-pro-preview
Input    : image storyboard PNG + prompt texte (multimodal)
Output   : JSON structuré (voir schéma ci-dessous)
Coût     : ~$0.05 / breakdown
Scripts  : /tmp/beat3_breakdown_v2.py  (Beat 3 référence)
           /tmp/breakdown_b2_b7.py     (Beat 2 + 7 référence)
```

**Ne pas utiliser :** `gemini-3.1-flash` (n'existe pas), `gemini-2.0-flash-preview-image-generation` (404), `gemini-2.5-flash` (moins précis sur coords/hex/rotations).

---

## Prompt copier-coller

```
You are a precise Remotion (React video) technical director analyzing a storyboard image.

This storyboard is for a Souverain documentary short (1080x1920px, 30fps, 9:16 portrait).
The voiceover for this beat is: "[COLLER VOIX-OFF EXACTE ICI]"
The beat duration is [N] frames ([X.Xs at 30fps]).
The audio forced-alignment word timestamps are: [COLLER LES MOTS-PIVOTS AVEC FRAMES]

Return a single JSON object with EXACTLY these top-level keys:

1. "background_assets_to_generate": array of PNG assets to generate via Gemini image model.
   Each entry: { "filename", "prompt", "dimensions", "transparent": bool, "purpose" }
   Use [] if nothing to generate (pure Mapbox or pure CSS).
   Rule: text → css_text (never PNG). Simple shapes → svg_shape/code_only (never PNG).

2. "foreground_visual_elements": array of all visual layers.
   Each entry MUST have: {
     "element_id": string,
     "type": "image" | "css_text" | "svg_shape" | "svg_path" | "plate_label" | "map_marker" | "geojson_polygon",
     "asset_source": "to_generate" | "code_only",
     "filename_or_content": string (filename OR inline SVG string for code_only),
     "screen_position_xy": [x, y],   ← absolute pixels on 1080x1920 canvas
     "size_px": [w, h],
     "color_hex": "#xxxxxx" | null,
     "rotation_deg": number,
     "z_index": number
   }
   For plate_label type also add: "accent_color", "text_color", "font"
   For Mapbox elements: use "position_lonlat" ONLY for map_marker and geojson_polygon types.
   For SVG overlays on Mapbox: use "screen_position_xy" (pixel-space, not geo-space).

3. "animation_timeline": ordered array of keyframe events.
   Each entry MUST have: {
     "frame_local": number,          ← frame within this beat (starts at 0)
     "element_ids_appearing": [],
     "element_ids_changing": [],
     "transition_type": string,
     "duration_frames": number,
     "easing_hint": "spring" | "ease-out" | "linear",
     "audio_cue_word": string        ← EXACT word or phrase from voiceover that triggers this event
   }
   Map EVERY significant visual event to an audio_cue_word. No orphan frames.

4. "permanent_motion": string describing ambient continuous motion for the ENTIRE beat.
   Examples: "grain film overlay shifts at 2fps, Niger dot pulses scale 1.0→1.2",
             "Mapbox slow pan north 0.001 lat/frame, background breathing opacity 0.9→1.0".
   NEVER null. Every beat must have ambient motion — max 5s without visual change.

5. "fidelity_warnings": string describing reproduction risks and suggested workarounds.
   Must mention: Mapbox projection type needed, arc calculation method, any font dependency.

6. "remotion_implementation_notes": string with React/Remotion-specific guidance.
   Must mention: AbsoluteFill structure, spring() parameters (damping 80-100, stiffness 50-70),
   extrapolateRight: 'clamp', premountFor={fps} on Sequences, Mapbox projection: { name: "mercator" }.

Plate label standard (use for ALL country/city labels):
- Dark navy rect (#0d1525) + left gold vertical bar (#c08820) + white IBM Plex Mono text (#ffffff)
- Position: near the geographic dot, never overlapping Mapbox UI controls

Mapbox standard (when beat uses a map):
- Style: applySepia(map) for standard beats, applyNoir(map) for climax beats
- ALWAYS include projection: { name: "mercator" } in mapboxgl.Map constructor
- Never use globe projection for data beats (only for Hook globe reveal)
- Dot color for map_marker: #c08820 (gold) — never #0d1525 (invisible on Sepia)
```

---

## Schéma JSON attendu — structure de référence annotée

```json
{
  "background_assets_to_generate": [
    {
      "filename": "example_bg.png",
      "prompt": "...",
      "dimensions": "1080x960",
      "transparent": false,
      "purpose": "Background top half"
    }
  ],
  "foreground_visual_elements": [
    {
      "element_id": "label_niger",
      "type": "plate_label",
      "asset_source": "code_only",
      "filename_or_content": "NIGER",
      "screen_position_xy": [80, 1700],
      "size_px": [200, 60],
      "color_hex": "#0d1525",
      "accent_color": "#c08820",
      "text_color": "#ffffff",
      "font": "IBM Plex Mono",
      "rotation_deg": 0,
      "z_index": 40
    }
  ],
  "animation_timeline": [
    {
      "frame_local": 0,
      "element_ids_appearing": ["bg_element"],
      "element_ids_changing": [],
      "transition_type": "fade-in",
      "duration_frames": 15,
      "easing_hint": "ease-out",
      "audio_cue_word": "Et pendant ce temps,"
    },
    {
      "frame_local": 209,
      "element_ids_appearing": ["stat_1300t"],
      "element_ids_changing": [],
      "transition_type": "scale-up",
      "duration_frames": 20,
      "easing_hint": "spring",
      "audio_cue_word": "Mille trois cents tonnes"
    }
  ],
  "permanent_motion": "Grain film overlay cycles at 2fps opacity shift. Niger dot pulses scale 1.0→1.2→1.0 every 60 frames.",
  "fidelity_warnings": "Arc Niger→Moscow must use map.project() on each frame to convert lonlat to screen XY — hardcoded SVG path will drift if map pans. Mapbox projection must be mercator explicit or arcs won't align at zoom 2.0.",
  "remotion_implementation_notes": "Beat duration 687 frames. Use spring(damping: 90, stiffness: 60) for stat entries. extrapolateRight: 'clamp' on all interpolate() calls. premountFor={fps} on each <Sequence>. Mapbox constructor: { projection: { name: 'mercator' } } mandatory."
}
```

---

## Checklist validation avant de coder (5 points bloquants)

Avant de passer le JSON au code, vérifier chaque point. Si un point échoue → relancer le breakdown.

| # | Champ | Vérification | Bloquant si absent |
|---|-------|-------------|-------------------|
| 1 | `animation_timeline[*].audio_cue_word` | Chaque événement visuel a un mot-pivot issu de la voix-off | OUI — synchronisation impossible sans |
| 2 | `permanent_motion` | Non null, décrit le mouvement ambiant continu | OUI — beat statique interdit |
| 3 | `fidelity_warnings` | Mentionne le type de projection Mapbox + méthode calcul arcs | OUI si beat Mapbox |
| 4 | `remotion_implementation_notes` | Mentionne `projection: { name: "mercator" }` | OUI si beat Mapbox |
| 5 | Dots Mapbox `color_hex` | `#c08820` (gold) — jamais `#0d1525` (invisible sur Sepia) | OUI |

---

## Erreurs fréquentes du schéma — anti-patterns à rejeter

| Erreur | Symptôme dans le JSON | Conséquence si ignorée |
|--------|----------------------|----------------------|
| Structure `panel_id / elements[]` au lieu de `animation_timeline` | Pas de `audio_cue_word` | Timings désynchronisés avec voix-off |
| `permanent_motion: null` | Champ null sur tous les panneaux | Zones mortes >5s, beat plat |
| `position_lonlat` sur SVG overlay | Coordonnées géo pour un élément CSS | Le composant ne peut pas positionner en pixels |
| Mapbox sans `projection` explicite | `zoom < 2.0` + vue monde | Globe rendering par défaut, arcs courbés bizarrement |
| Dots `color_hex: "#0d1525"` | Navy sur fond Sepia | Dots invisibles |
| Texte important en PNG | `type: "image"` pour du texte | Impossible à modifier, qualité dégradée au render |

---

## Référence — beats validés comme exemples

- Beat 5 v4 breakdown validé : `public/souverain/niger-uranium/assets/storyboard-v3/beat5_breakdown.json`
- Beat 3 v4 breakdown validé : `public/souverain/niger-uranium/assets/storyboard-v3/beat3_breakdown_v4_pro.json`
- Script Python breakdown : `/tmp/beat3_breakdown_v2.py`

**Pour un beat Mapbox** (arcs, multi-pays) : Beat 5 est la référence.
**Pour un beat data-viz** (chiffres, diagrammes, documents) : Beat 3 est la référence.

---

## Règle : 1 appel par acte — NON-NÉGOCIABLE (ajouté 2026-05-22)

**Erreur commise Acte 2 Sénégal :** 4 appels Flash (1 storyboard par beat) + 4 appels 3.1-pro (1 breakdown par beat) = 8 appels pour un seul acte.

**Règle correcte :**
1. **1 seul appel Flash** — storyboard en grille (ex: 2x2 panels pour 4 beats) dans une seule image
2. **1 seul appel 3.1-pro** — l'image grille + toute la voix-off de l'acte + tous les timestamps → JSON avec array de beats `{ "beats": [ {beat_A}, {beat_B}, ... ] }`

**Avantages :**
- 3.1-pro voit tous les beats ensemble → cohérence visuelle inter-beats garantie
- Respecte l'esprit "2 appels max" (1 storyboard + 1 breakdown par acte, pas par beat)
- Moins cher, moins de tokens

**Format JSON attendu pour un acte complet :**
```json
{
  "beats": [
    { "beat_id": "A", "duration_s": 17.0, "animation_timeline": [...], "sfx": [...], ... },
    { "beat_id": "B", "duration_s": 35.8, "animation_timeline": [...], "sfx": [...], ... }
  ]
}
```

**S'applique dès l'Acte 3.**
