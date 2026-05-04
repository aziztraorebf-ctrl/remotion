---
name: "PixelLab animations → spritesheet PNG → Remotion clipPath cycle"
description: "Pipeline complet pour intégrer une animation PixelLab (GIF) dans Remotion via spritesheet horizontale + clipPath SVG. Validé Beat 1 Empire Ghana v6 (ville Koumbi Saleh animée). Confirme : animations multiples simultanées sur même asset OK (ville anim + pulse breathing + halo gradient)."
type: feedback
---

# PixelLab animations → Remotion spritesheet pattern

> Validé 2026-05-03 fin session Beat 1 Empire du Ghana. Aziz a téléchargé l'animation PixelLab de la ville Koumbi Saleh ("people walking around"), demandé intégration. Pattern résolu en 5 min, devient réutilisable pour tout asset PixelLab animé.

## Pipeline complet (3 étapes)

### Étape 1 — Animer un asset PixelLab existant

```typescript
mcp__pixellab__animate_object({
  object_id: "<id>",
  animation_description: "people walking around the city",  // ou autre action simple
  frame_count: 4,  // 4-8 frames suffisent, restent légers
  directions: ["unknown"]  // pour map_object 1-direction
})
```

Génération : ~30-60s par direction. Output : GIF téléchargeable depuis dashboard PixelLab.

### Étape 2 — Convertir GIF en spritesheet horizontale via ffmpeg

```bash
ffprobe -v error -show_entries stream=nb_frames,r_frame_rate,width,height \
  -of default=nw=1 input.gif
# Donne : width=112, height=112, r_frame_rate=20/3 (~6.66 fps), nb_frames=4

ffmpeg -y -i input.gif -vf "scale=112:112,tile=4x1" output-sheet.png
# Output : PNG horizontal 448×112 (4 frames de 112×112)
```

`tile=NxM` paramètre : N=colonnes M=lignes. Pour spritesheet horizontale, M=1 et N=nb_frames.

### Étape 3 — Composant Remotion avec clipPath SVG cycle

```tsx
{(() => {
  const SPRITE_SIZE = 112;        // taille originale frame
  const DISPLAY_SIZE = 88;        // taille rendu sur carte
  const NUM_FRAMES = 4;
  const FRAMES_PER_ANIM_FRAME = 5; // 30fps Remotion / ~6 fps GIF = 5

  const animFrame = Math.floor(localFrame / FRAMES_PER_ANIM_FRAME) % NUM_FRAMES;
  const clipId = `clip-${animFrame}`;

  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={-DISPLAY_SIZE / 2}
            y={-DISPLAY_SIZE / 2}
            width={DISPLAY_SIZE}
            height={DISPLAY_SIZE}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <image
          href={staticFile("path/to/sheet.png")}
          x={-DISPLAY_SIZE / 2 - animFrame * DISPLAY_SIZE}  // translate horizontal
          y={-DISPLAY_SIZE / 2}
          width={DISPLAY_SIZE * NUM_FRAMES}  // largeur totale spritesheet scaled
          height={DISPLAY_SIZE}
          preserveAspectRatio="none"
          style={{ imageRendering: "pixelated" }}
        />
      </g>
    </g>
  );
})()}
```

**Comment ça marche** : la spritesheet est rendue scaled à `DISPLAY_SIZE * NUM_FRAMES` pixels de large, mais clippée à une fenêtre `DISPLAY_SIZE × DISPLAY_SIZE`. On translate horizontalement le sprite de `animFrame * DISPLAY_SIZE` pour montrer le frame courant.

## Animations multiples simultanées (CONFIRMATION)

**Validé Beat 1 v6** : on peut combiner plusieurs animations sur le même asset sans conflit :

```tsx
<g
  transform={`translate(${koumbi.x} ${koumbi.y}) scale(${koumbiT * koumbiBreathing})`}
  opacity={koumbiT}
>
  {/* Animation 1 : halo doré gradient (CSS via radialGradient defs) */}
  <circle cx="0" cy="0" r="55" fill="url(#koumbiHalo)" />

  {/* Animation 2 : pulse breathing (scale wrapper ci-dessus) */}
  {/* Animation 3 : spritesheet ville (clip + translate ci-dessous) */}
  <g clipPath={`url(#clip-${animFrame})`}>
    <image href={...} />
  </g>
</g>
```

3 animations simultanées sur le même point géographique :
- **Halo gradient radial** (constant, défini en `<defs>`)
- **Pulse breathing scale** (`scale = 1 + 0.04 * sin(frame * 0.08)`)
- **Spritesheet animée** (cycle 4 frames PixelLab)

Aucune ne casse les autres. Renu premium impossible avec un asset statique.

## Quand utiliser cette technique

**OUI animer** :
- Lieux avec activité humaine (villes, marchés, ports → personnages qui bougent)
- Objets organiques (eau qui coule, feu qui flamme)
- Symboles avec rotation logique (sceau qui pulse, balance qui oscille)
- Tout asset narratif central qui mérite "vivre"

**NON animer (rester statique + halo + breathing suffit)** :
- POI ponctuels secondaires (pulse marker basique OK)
- Objets fixes par nature (rocher, bloc de sel mine)
- Assets nombreux simultanés (perfo : 5+ animations 4-frames lourd)
- Quand le mouvement n'apporte rien narrativement

## Coût et perf

- **Génération PixelLab** : ~30-60s par animation
- **Conversion ffmpeg** : <1s
- **Stockage** : spritesheet PNG ~25 KB (vs GIF ~15 KB) — négligeable
- **Render Remotion** : aucun coût notable (clipPath natif SVG)
- **Mémoire navigateur Studio** : negligeable

## Limites connues

- PixelLab anime UNE direction par job (pour 4-direction characters, faire 4 jobs)
- Frames doivent être en nombre fixe et constant (pas de variation par direction)
- Spritesheet horizontale uniquement (pour vertical, adapter `y` translate)
- Loop infini = simple modulo, pas de easing entre frames

## CORRECTION IMPORTANTE (2026-05-04) — vary_object ≠ animate_object

**Le "saccadé" observé en Lab Phase 2 était une erreur de méthode, PAS une limite de PixelLab.**

- `vary_object` (13 états) = variations stylistiques, pas des frames d'animation fluide → saccadé normal
- `animate_object` (4-8 frames, action description) = animation fluide → comme ville Koumbi + chameaux

**Règle** : pour toute animation d'action (éléphant qui se déplace, rocher qui se fissure, objet qui bouge), utiliser `animate_object` avec description simple. Résultat fluide garanti si frame_count=4-8.

## Bibliothèque animations Empire Ghana (état 2026-05-03 fin Beat 2)

| Asset | Statique | Animé | Spritesheet |
|-------|----------|-------|-------------|
| `koumbi-saleh` | png 6 KB | GIF (PixelLab dashboard) | `koumbi-saleh-sheet.png` 25 KB (4 frames, 112px) |
| `chameau-walk` | `chameau-walk-static.png` | SDK animate_with_text | `chameau-walk-sheet.png` 27 KB (4 frames, 64px east) |
| Autres (sacs, balance, etc.) | png seul | non animés | — |

## Méthode 2 — SDK Python `animate_with_text` (quand GIF non téléchargeable)

Le MCP `animate_object` génère une animation mais l'URL GIF n'est pas accessible via API REST.
Fallback : SDK Python direct avec l'asset statique comme référence.

```python
from pixellab.animate_with_text import animate_with_text  # import direct du module
from pixellab import Client
from PIL import Image

client = Client(secret=os.getenv('PIXELLAB_API_KEY'))
result = animate_with_text(
    client=client,
    image_size={"width": 64, "height": 64},
    description="description de l'asset pixel art",
    action="action de marche",
    reference_image=Image.open('asset-statique.png'),
    view="side", direction="east",
    negative_description="",  # OBLIGATOIRE — None → erreur 422
    n_frames=4,
    text_guidance_scale=7.5, image_guidance_scale=2.0,
)
# result.images[i].pil_image()  — PAS .to_image() (n'existe pas)
```

Coût : $0.00 (forfait). Génère 4 frames en ~10s.

## Why ça marche (différentiel pro vs amateur)

L'œil humain détecte instantanément le mouvement. Une carte avec des **assets statiques** = "diapositive PowerPoint". Une carte avec des **assets animés** = "scène vivante", impossible à confondre avec asset stock.

PixelLab génère des animations cohérentes stylistiquement avec l'asset statique (même palette, même style). Pas de drift visuel entre frames.

L'animation PixelLab + pulse breathing + halo radial = trio gagnant pour rendu "premium" sur format Atlas.

## How to apply

À chaque scène Atlas avec asset central narratif :
1. Générer asset statique d'abord (`create_map_object`)
2. Évaluer si l'asset gagne à être animé (cf. critères ci-dessus)
3. Si oui : `animate_object` avec description action simple
4. Pipeline ffmpeg → spritesheet PNG horizontale
5. Composant Remotion clipPath cycle (copier pattern Beat 1 v6)
6. Ajouter halo + breathing wrapper pour effet "premium"

## Référence code

`src/projects/atlas/empire-ghana/scenes/Beat1Setup.tsx` lignes "Sprite Koumbi Saleh ville ANIMEE" (intégration spritesheet).
