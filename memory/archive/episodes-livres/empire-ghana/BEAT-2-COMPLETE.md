# BEAT 2 Empire Ghana — COMPLET (v4 livré 2026-05-03)

## Livrable final

| Item | Path | Statut |
|------|------|--------|
| Render final | `out/empire-ghana/beat2-v4.mp4` (21.7 MB, 786 frames, ~26.2s) | ✅ validé Aziz |
| Code source | `src/projects/atlas/empire-ghana/scenes/Beat2Density.tsx` | ✅ |
| Composition Remotion | `EmpireGhanaBeat2Density` (1080×1920, 30fps, 786 frames) | ✅ |
| Spritesheet chameau | `public/empire-ghana/assets/pixellab/chameau-walk-sheet.png` (256×64, 4 frames) | ✅ |
| Frames chameau east | `public/empire-ghana/assets/pixellab/chameau/walking/east/frame_00{0-3}.png` | ✅ |

## Trajet Beat 2 v1 → v4

| Version | Statut | Cause itération |
|---------|--------|-----------------|
| v1 | ❌ | Caravane erscheint à 9s (Taghaza) au lieu de 21.5s (mot "caravane"). Berbere glide statique pas walk. Mosquée = confusion visuelle. |
| v2 | ❌ | Timing fixé (R_CARAVANE=645), berbere remplacé par chameau PixelLab. Mais: progress bug `[645, 524]` → end < start → caravane toujours au bout. |
| v3 | ⚠️ | Progress bug fixé. Chameau PixelLab spritesheet intégré. Mosquée supprimée. Mais: 2 chameaux trop proches (stagger temporel ≠ espacement spatial). |
| **v4** | **✅ validé** | File indienne via délai 50 frames sur même trajectoire `getChameauPos()`. 2 chameaux clairement séparés (~60px Y). |

## Découvertes techniques (à réutiliser)

### 1. Génération walk cycle via SDK Python `animate_with_text`
Quand le MCP `animate_object` génère une animation mais qu'on ne peut pas télécharger le GIF via API, utiliser le SDK Python directement :

```python
from pixellab.animate_with_text import animate_with_text
from pixellab import Client
from PIL import Image

client = Client(secret=os.getenv('PIXELLAB_API_KEY'))
ref_img = Image.open('asset-statique.png')

result = animate_with_text(
    client=client,
    image_size={"width": 64, "height": 64},
    description="description de l'asset",
    action="action de marche / mouvement",
    reference_image=ref_img,
    view="side",
    direction="east",
    negative_description="",  # obligatoire (string vide, pas None)
    n_frames=8,  # max 20, 4 suffisent pour walk cycle
    text_guidance_scale=7.5,
    image_guidance_scale=2.0,
)
# result.images[i].pil_image() → PIL Image (pas .to_image())
```

**Gotcha critique** : `negative_description=None` → erreur 422. Toujours passer `""`.
**Gotcha critique** : `.to_image()` n'existe pas → utiliser `.pil_image()`.
**Coût** : $0.00 (inclus dans forfait PixelLab).

### 2. Spritesheet ffmpeg depuis frames PNG individuelles
```bash
ffmpeg -y \
  -i frame_000.png -i frame_001.png -i frame_002.png -i frame_003.png \
  -filter_complex "hstack=inputs=4" \
  output-sheet.png
# Output : PNG horizontal 256×64 (4×64px)
```
Alternative si frames issues d'un GIF : `ffmpeg -y -i input.gif -vf "tile=4x1" output-sheet.png`

### 3. File indienne chameaux — pattern réutilisable
**Problème** : stagger temporel seul ne suffit pas (même trajectoire = même position à t donné).
**Solution** : même fonction de position, mais décalage temporel de 50 frames (1.67s à 30fps). Le chameau 2 est toujours à la position où était le chameau 1 il y a 1.67s.

```tsx
const getChameauPos = (progress: number) => ({
  x: interpolate(progress, [0, 0.5, 1], [START_X, MID_X, END_X], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  y: interpolate(progress, [0, 0.5, 1], [START_Y, MID_Y, END_Y], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
});

const CHAM2_DELAY = 50; // frames (1.67s à 30fps)
const cham1Progress = interpolate(localFrame, [R_START, R_END], [0, 1], { ... });
const cham2Progress = interpolate(localFrame, [R_START + CHAM2_DELAY, R_END + CHAM2_DELAY], [0, 1], { ... });

const { x: cham1X, y: cham1Y } = getChameauPos(cham1Progress);
const { x: cham2X, y: cham2Y } = getChameauPos(cham2Progress);
```

### 4. Caravane PixelLab > berbere pour assets de transport
Le sprite chameau PixelLab avec saddlebags (64×64) est visuellement immédiatement lisible comme "commerce". Le berbere merchant est trop ambigu sur carte (peut être confondu avec n'importe quel personnage).

### 5. Alignement timing exact via forced alignment
**Règle confirmée** : utiliser `ghana-alignment.ts` pour le timing exact des mots-clés, pas une estimation.
- Mot "caravane" = 44.02s → frame absolue 1321 → `ABS_CARAVANE = Math.round(44.02 * 30)`
- Ne jamais calculer `ABS_X = ABS_Y + N` pour dériver un timing (N est arbitraire).

## Assets produits (réutilisables cross-beats)

| Asset | Path | Notes |
|-------|------|-------|
| `chameau-walk-sheet.png` | `public/empire-ghana/assets/pixellab/chameau-walk-sheet.png` | 256×64, 4 frames east, saddlebags |
| `chameau/walking/east/frame_00{0-3}.png` | `public/empire-ghana/assets/pixellab/chameau/walking/east/` | 64×64 individuels |
| `chameau-walk-static.png` | `public/empire-ghana/assets/pixellab/chameau-walk-static.png` | Statique, utilisé comme référence SDK |

PixelLab object IDs (pour variations futures) :
- Chameau 1 : `bfc0c636-7cdd-42c2-91d7-4fc5bb23d484`
- Chameau 2 (variation) : `7dba02c8-a5ff-4f12-9b47-36056d26b0b5`

## Script de génération (réutilisable)

`/tmp/generate_chameau_walk.py` — à sauvegarder si besoin d'un autre walk cycle :
```bash
python3 -c "
from pixellab.animate_with_text import animate_with_text
from pixellab import Client
from PIL import Image
import os
from dotenv import load_dotenv
load_dotenv('.env')
client = Client(secret=os.getenv('PIXELLAB_API_KEY'))
# ...
"
```
Pattern complet dans `scripts/atlas/` si besoin de canoniser.

## Visuel final Beat 2 (description frames validées)

- **0-9s** : Taghaza large, bloc de sel + pelle, label, empire Wagadou hachuré
- **6-9s** : Spotlight "90 KG / BLOC" (fond dim, cartouche centré, bloc sel PixelLab)
- **9-16s** : Pan caméra → Bambouk, pièces d'or apparaissent, route or pointillé
- **16-18s** : Re-zoom Koumbi Saleh, ville animée (spritesheet 4 frames), halo or
- **18-21s** : Spotlight "20 000 HABITANTS" (fond dim, ville statique dans cartouche)
- **21.5s** : Chameau 1 apparaît (mot "caravane") + route sel pointillée
- **23s** : Chameau 2 apparaît (50 frames derrière) → file indienne visible
- **22.5s** : Triade "OR · SEL · ESCLAVES" en haut

## Règle confirmée : mosquée = sur-chargement

Aziz a demandé suppression de la mosquée banco sur la carte ("ça n'apporte pas grand chose, ça le rend juste trop chargé"). Règle : sur une carte avec 3 POI + 2 chameaux + 2 spotlights, pas de 4e sprite POI. Maximum 3 sprites statiques sur carte simultanément.
