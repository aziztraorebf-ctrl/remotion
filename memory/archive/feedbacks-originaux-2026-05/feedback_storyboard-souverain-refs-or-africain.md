---
name: Storyboard Souverain — Gemini i2i avec refs Or Africain V5
description: Pattern validé pour storyboard Souverain — image-to-image Gemini avec frames extraites du final V5 Or Africain assure la cohérence visuelle cross-épisodes
type: feedback
---

# Storyboard Souverain — refs Or Africain en image-to-image

**Validé** : 2026-05-08 sur storyboard Niger uranium V2.

## Le problème (V1 sans refs)

Sans refs, Gemini produit du **concept art stylisé 3D / cinematic Netflix** :
- Compositions impossibles à reproduire en Remotion + Mapbox (3D rendering, lumière dramatique, perspective théâtrale)
- Drift typographique (overlays texte fantaisistes, annotations style écrites littéralement)
- Aucune cohérence avec notre signature Or Africain
- Frustration et perte de temps en briefing post-coup

Coût V1 perdu : $0.24 pour des frames non-utilisables comme livrables.

## Le pattern qui marche (V2 avec refs)

**Étape 1** : Extraire 3 frames-refs depuis le MP4 final Or Africain V7 :
- 1 frame **zoom pays unique** (~35s, Ghana highlight) → ref pour zoom Niger / pays isolé
- 1 frame **carte monde multi-pays** (~45s, 6 pays Sahel + Chine + UK) → ref pour carte monde flux + globe pins
- 1 frame **climax labels fade** (~55s, 6/6 highlights) → ref pour traitement labels signature

Sauvegarder dans `public/souverain/<episode>/assets/refs/` (réutilisable pour futurs épisodes Souverain).

**Étape 2** : Script Python Gemini en mode `image-to-image` :
```python
contents = [prompt_text]
if mode == "i2i" and ref_path:
    contents.append(types.Part.from_bytes(data=ref_bytes, mime_type="image/jpeg"))

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=contents,
    config=types.GenerateContentConfig(response_modalities=["image", "text"]),
)
```

**Étape 3** : Prompt qui dit explicitement :
- "Use the reference image as the EXACT base style"
- Liste précise des modifications par rapport à la ref (recadrage, highlight différent, ajout d'arc, etc.)
- "NO TEXT, NO LETTERS, NO NUMBERS rendered" (zones vides pour overlays Remotion)
- "Flat compositional graphics — what can realistically be reproduced with Mapbox GL JS + Remotion React overlays"
- "NOT 3D, NOT cinematic concept art"

**Coût i2i** : ~$0.05/frame vs ~$0.04 t2i. Surcoût marginal, gain qualité énorme.

## Résultats Niger V2

6/6 frames livrables et réalisables en code. Issues mineures (positions pins, couleurs highlights) corrigeables au build Remotion. Style Or Africain parfaitement reproduit sur les 4 frames Mapbox (S1, S3 gauche, S4, S5).

## Règle pour futurs épisodes Souverain

**À chaque nouvel épisode** :
1. Extraire les 3 refs Or Africain UNE FOIS (déjà fait, dans `niger-uranium/assets/refs/`)
2. Copier ces refs dans le nouveau projet OU pointer dessus directement
3. Script Gemini i2i avec refs systématique pour toutes les frames Mapbox
4. Frames data-viz pure (S2 timeline) ou métaphores (S6 échiquier) restent en t2i flat 2D

**NE JAMAIS** générer un storyboard Souverain Mapbox sans refs Or Africain.

## Fichiers de référence

- `public/souverain/niger-uranium/assets/refs/ref-mapbox-pays-zoom.jpg`
- `public/souverain/niger-uranium/assets/refs/ref-mapbox-monde-multipays.jpg`
- `public/souverain/niger-uranium/assets/refs/ref-mapbox-globe-pins.jpg`
- `scripts/tools/generate-niger-storyboard-v2-gemini.py` (template script)
- `out/or-africain/or-africain-FINAL.mp4` (source des refs)
