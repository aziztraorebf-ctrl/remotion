---
name: PixelLab — Sprites & Walk Cycles sur Carte Atlas
description: Regles canoniques PixelLab SDK Python v1 + integration Remotion SVG. Walk cycle valide 2026-05-01.
type: reference
---

# PixelLab — Pipeline Valide (2026-05-01)

## Acces API

- **SDK Python v1** : `pip install pixellab`
- **Auth** : `PixelLabClient(secret='...')` — champ `secret`, PAS `api_key`
- **MCP PixelLab** : abonnement mensuel SEPARÉ des crédits USD. MCP = walk cycles automatiques. SDK = génération image frame par frame.
- **Clé** : dans `.env` sous `PIXELLAB_SECRET`

## Génération sprites statiques (SDK)

```python
from pixellab.generate_image_pixflux import generate_image_pixflux
from pixellab import PixelLabClient
from PIL import Image

client = PixelLabClient(secret='...')
result = generate_image_pixflux(
    client=client,
    description="...",
    image_size={"width": 128, "height": 128},
    # transparency=True si fond transparent nécessaire
)
result.image.pil_image().save("output.png")
# Upscale x4 sans blur : Image.resize((512,512), Image.NEAREST)
```

## Prompts sprites — règles critiques

- Toujours spécifier **"adult male"**, **"masculine build"**, **"broad shoulders"** → sinon sprite féminin
- Éviter **"Mandinka"** seul → interprété musicien/griot → ajouter "holding long spear, no instrument, combat stance"
- Toujours spécifier **"pixel art, side view, transparent background"**
- Taille générée : **128x128** (max SDK v1)

## Walk cycle — Structure fichiers PixelLab

```
animations/<nom-animation>-<hash>/<direction>/frame_000.png ... frame_005.png
```

- **6 frames** par direction, RGBA 64x64 ou 128x128
- Directions : `east`, `west`, `north`, `south` (selon le personnage)
- Merchant-side : east + south seulement (pas 4 directions complètes)

## Intégration Remotion — Formule walk cycle

```tsx
const WALK_FRAMES = 6;
const WALK_FPS = 8; // optimal pour marche naturelle

const animFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
const frameStr = String(animFrame).padStart(3, "0");
const href = staticFile(`${ANIM_PATH}/${direction}/frame_${frameStr}.png`);
```

## Placement sur carte SVG

```tsx
// Ancrage au sol : x centré, y = bas du sprite
<image
  href={spriteHref}
  x={charX - SPRITE_SIZE / 2}
  y={charY - SPRITE_SIZE}
  width={SPRITE_SIZE}
  height={SPRITE_SIZE}
  style={{ imageRendering: "pixelated" }}  // OBLIGATOIRE
/>

// Flip direction ouest
<g transform="scale(-1, 1)">
  <image ... />
</g>
```

## Règles canoniques validées par Aziz (2026-05-01)

- **Taille affichée** : **64px** — NE PAS grandir. Lisible au zoom, laisse la carte respirer.
- **Pas d'ombre** sous les pieds — coupe l'effet ancré sur la carte
- **Pas de hop** si personnage statique — inutile, distrait
- **Carte plate (0° tilt)** pour scènes personnages → ancrage naturel sans technique
- **Carte tilted** réservée aux vues géographiques pures sans personnages

## Changement d'animation (marche → action)

```tsx
const WALK_END = fps * 4; // 4s de marche
const isWalking = frame < WALK_END;

const walkFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
const actionFrame = Math.floor(((frame - WALK_END) / fps) * ANIM_FPS) % ACTION_FRAMES;

const href = isWalking
  ? staticFile(`${WALK_PATH}/${walkStr}.png`)
  : staticFile(`${ACTION_PATH}/${actionStr}.png`);
```

## Deux personnages simultanés

- Variables indépendantes charX/charY pour chaque
- Point de rencontre : interpolate des deux vers même coord
- Flip sur celui qui vient de l'est (marche vers l'ouest) pendant la marche uniquement

## Assets de test disponibles

Dossier : `quebec-jacques-poc/public/pixellab-walk-test/`

| Dossier | Walk directions | Animations secondaires |
|---------|----------------|----------------------|
| `monk/` | N/S/E/W | `monk_kneeling_in_prayer` (4 frames, south+east) |
| `merchant-dark/` | N/S/E/W | `yelling_piedestrian_to_sell` (16 frames) |
| `merchant-side/` | E+S seulement | `being_accused`, `Drinking`, `tied_to_pole` |
| `peasant/` | N/S/E/W | `holding_fire_torche` |

## Assets production Atlas Mansa Moussa

- `quebec-jacques-poc/public/atlas-mansa-moussa/assets/mansa-pixel-128.png`
- `quebec-jacques-poc/public/atlas-mansa-moussa/assets/guerrier-pixel-128.png`
- `quebec-jacques-poc/public/atlas-mansa-moussa/assets/chameau-pixel-128.png`

## Prochaine étape : walk cycles Mansa Moussa

Nécessite abonnement MCP PixelLab (walk cycles automatiques) ou génération frame-par-frame SDK.
Prompts de base documentés dans `memory/atlas-mansa-moussa/PIXELLAB-WALK-PIPELINE.md`.

## Erreurs à ne pas reproduire

| Erreur | Correction |
|--------|-----------|
| `PixelLabClient(api_key=...)` | `PixelLabClient(secret='...')` |
| `pixellab.generate_image_pixflux(...)` | `from pixellab.generate_image_pixflux import generate_image_pixflux` |
| `result.image.to_image()` | `result.image.pil_image()` |
| MCP sans abonnement mensuel | Utiliser SDK Python v1 avec crédits USD |
