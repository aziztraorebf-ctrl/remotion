# fal.ai Pipeline Integration - Details (fev 2026, flux/dev)

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — exploration fev 2026 du modèle `fal-ai/flux/dev`
> pour backgrounds/textures du projet Peste 1347 pixel art (depuis abandonné pour Atlas Mapbox pur).
> Le projet actuel utilise Gemini/GPT/Recraft comme générateurs image verrouillés (voir CLAUDE.md
> § MODÈLES API VERROUILLÉS) — flux/dev n'y figure pas. Conservé pour la méthodologie de tests et
> l'architecture en couches, potentiellement transposable.

## Test Results (fev 2026)

### Test 1: Background Generation (flux/dev)
- Model: `fal-ai/flux/dev`
- Prompt: medieval parchment texture, burned edges, sepia tones
- Settings: landscape_16_9, 28 steps, guidance 3.5, seed 42
- Result: 1657ms, excellent quality (9/10)
- Output: `generated/fal-test/test1-parchment.png`
- Note: fal.ai returns JPEG malgre extension .png -- pas un probleme pour Remotion

### Test 2: Sprite Upscale (ESRGAN)
- Model: `fal-ai/esrgan`, scale 4x
- Input: plague doctor sprite sheet 480x192
- Upload via `fal.storage.upload()` d'abord
- Result: 2768ms, usable but standard ESRGAN smooths pixel edges slightly (6/10)
- Pour pixel art pur: upscalers specialises pixel art recommandes (jamais poursuivi depuis)

### Test 3: Complex Scene (flux/dev)
- Model: `fal-ai/flux/dev`
- Prompt: medieval parchment + CRT terminal + Europe map + mortality data
- Settings: seed 1347
- Result: 1299ms, atmosphere excellente, texte gibberish (attendu -- Remotion gere le texte)
- Score: 8/10

### Test 4: Scene Backgrounds (3 scenes Peste 1347)
- Script: `scripts/test-fal-scenes.ts`
- 3 scenes generees en ~5s total:
  - Ruelle medievale nocturne (seed 1347) - 119KB, 1024x576
  - Place publique flagellants (seed 1348) - 147KB, 1024x576
  - Cimetiere nocturne (seed 1349) - 151KB, 1024x576
- Metadata saved: `generated/fal-test/scenes-metadata.json`
- Style suffix: "pixel art style, 16-bit aesthetic, detailed environment, atmospheric lighting, volumetric fog, dramatic shadows, no text no letters no words"

## SDK Setup (a l'epoque)
- Package: `@fal-ai/client` (npm)
- Config: `fal.config({ credentials: process.env.FAL_KEY })`
- Key format: `uuid:hex` in .env
- Test scripts: `scripts/test-fal-ai.ts`, `scripts/test-fal-scenes.ts`

## Pricing (verified fev 2026, ORDRES DE GRANDEUR PÉRIMÉS)
- flux/dev image: ~$0.03
- ESRGAN upscale: ~$0.01
- luma-dream-machine video (jamais teste depuis): ~$0.50
- Video 5 min (~30 backgrounds): ~$0.90 total backgrounds
- Pay-per-use, no subscription

## Prompt Engineering (principes generaux, reste applicable)
- TOUJOURS inclure "no text no letters no words" -- sinon texte gibberish
- Structure: [SUJET], [DETAILS], [AMBIANCE/LUMIERE], [STYLE], no text..., [FORMAT]
- Style suffix commun par projet pour coherence visuelle
- Seeds fixes pour reproductibilite (stockees dans manifest.json)

## Architecture Integration (principe general, reste applicable)
- Pre-generation par CLI (JAMAIS dans useEffect/composants React)
- URLs fal.ai EXPIRENT -- telecharger immediatement
- Flow: generate -> download -> `generated/` -> validation Aziz -> copie `public/assets/`
- manifest.json tracke chaque asset (prompt, seed, settings, status)

## Vision visuelle Aziz a l'epoque (fev 2026)
- **Mode A "Data sur fond"**: texture fal.ai + overlays Remotion (graphiques, cartes, texte)
- **Mode B "Scenes vivantes"**: scene riche fal.ai + sprites pixel art + data integree organiquement
- Reference: style "Darkest Dungeon" / HD-2D (pixel art dans environnements atmospheriques)
- Alterner les 2 modes toutes les 30-60s pour rythme et variete
- Donnees integrees dans la scene (grave dans pierre, craie, panneau bois) PAS flottantes

## Architecture des couches Remotion (principe general, reste applicable)
```
Couche 4 (top)  : Effets post-process (grain, scanlines, vignette)
Couche 3        : Donnees Remotion (texte, graphiques SVG, compteurs)
Couche 2        : Sprites / personnages (pixel art ou SVG)
Couche 1 (base) : Background fal.ai (statique + Ken Burns/parallax)
```

## Image Generation Models (etat fev 2026, TOUT PÉRIMÉ — voir CLAUDE.md pour les modeles verrouilles actuels)

### fal.ai (Flux/dev) - backgrounds realistes SEULEMENT
- Excellent pour: peintures, photos, atmospherique, textures
- NE SAIT PAS faire du vrai pixel art (produit du cartoon illustre smooth)

### OpenAI GPT Image 1.5 (gpt-image-1.5) - etat fev 2026
- A l'epoque : successeur de DALL-E 3, sorti dec 2025
- Cout: ~$0.009-0.20/image selon qualite a l'epoque
- ⚠️ Nom de modele PÉRIMÉ — voir CLAUDE.md pour le modele GPT image verrouille actuel

### Nano Banana Pro (Google Gemini 3 Pro Image) - etat fev 2026
- A l'epoque : modele image Google DeepMind
- ⚠️ Nom de modele PÉRIMÉ — voir `scripts/tools/gemini_models.py` pour IMAGE_MODEL actuel

### DALL-E 3 - a l'epoque
- Produisait du vrai pixel art (pixels visibles, style SNES) mais jugé depasse par GPT Image 1.5
- DALL-E re-ecrit le prompt, pas de seed

### LECON toujours valable : images statiques != mondes animes (Ear to Hear)
- **Erreur commise a l'epoque** : generer des images statiques pour imiter le style Ear to Hear
- **Realite** : Ear to Hear = mondes pixel art ANIMES (personnages qui marchent, sautent, niveaux qui defilent)
- **Bonne approche** : acheter des asset packs pixel art animes + assembler/animer dans Remotion, PAS generer des images IA pour recreer des mondes de jeu video
- Remotion PEUT animer des sprites (interpolate, spring) mais c'est du travail frame-par-frame, pas un moteur de jeu

### Gemini Imagen 3 (ancien) : NON DISPONIBLE a l'epoque
- API retournait 404 a l'epoque — probablement resolu depuis, verifier l'etat actuel

## ComfyUI (reserve future a l'epoque, jamais adopte depuis)
- PAS utilise en V1
- Reserve pour: consistance personnage 20+ plans, batch 50+ images, inpainting
- Deploy: RunPod on-demand ~$0.44/h, API REST
- Claude orchestre, Aziz ne touche pas

## Midjourney (reference only, a l'epoque)
- Video model V1 depuis juin 2025 (5-21s, 480p)
- PAS d'API publique (enterprise only)
- Role: moodboard / reference artistique uniquement
- Production: fal.ai exclusivement a l'epoque
