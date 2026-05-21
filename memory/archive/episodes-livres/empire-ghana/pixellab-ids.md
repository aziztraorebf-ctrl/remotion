# PixelLab Character IDs — Empire du Ghana

## Marchands silent barter

| Personnage | Character ID | Statut |
|-----------|--------------|--------|
| Marchand Sahélien (sud, apporte l'or) | `ef9ac272-1389-430d-9e94-dbd7dd7f9be9` | ✅ COMPLET 2026-05-03 |
| Marchand Berbère/Tuareg (nord, apporte le sel) | `79865794-abb1-4509-b6d7-580f87acbc4c` | ✅ COMPLET 2026-05-03 |

## Animation IDs (à utiliser dans `getSpriteFramePath`)

### Sahélien (basePath: `empire-ghana/characters/sahelien`)
| Animation | ID dossier | Frames | Directions |
|-----------|-----------|--------|------------|
| walking | `walking-3848d070` | 6 | south, east, north, west |
| breathing-idle | `animating-00dce42d` | 4 | south, east, north, west |
| crouching | `crouching-7ca15898` | 5 | south, east, north, west |

### Berbère (basePath: `empire-ghana/characters/berbere`)
| Animation | ID dossier | Frames | Directions |
|-----------|-----------|--------|------------|
| walking | `walking-b8b230ef` | 6 | south, east, north, west |
| breathing-idle | `animating-63b90882` | 4 | south, east, north, west |
| crouching | `crouching-22bab130` | 5 | south, east, north, west |

## Usage Remotion

```tsx
import { getSpriteFramePath } from "../../shaka-zulu/helpers/spritePlayer";

const spritePath = getSpriteFramePath(frame, {
  basePath: "empire-ghana/characters/sahelien/animations/walking-3848d070",
  direction: "north",
  totalFrames: 6,
  framesPerSpriteFrame: 6, // ralenti pour walk dignifié
});
```

## Crédits utilisés
- 2 characters (1 chacun) = 2 generations
- 24 anim jobs (3 anims × 4 dirs × 2 perso) = 24 generations
- **Total : ~26 crédits PixelLab** (sur 2000/mois disponibles)
