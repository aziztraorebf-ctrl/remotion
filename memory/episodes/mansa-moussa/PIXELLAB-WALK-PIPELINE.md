# PixelLab Walk Cycle Pipeline — Validé 2026-05-01

## Statut
PIPELINE VALIDE. Pret pour integration dans Atlas Mansa Moussa V2 (session suivante).

## Ce qui a ete valide

### 1. Sprites statiques sur carte Atlas
- 3 sprites generes via SDK Python v1 : mansa-pixel-128.png, guerrier-pixel-128.png, chameau-pixel-128.png
- Taille affichee : **64px natif** — taille canonique validee par Aziz (ne pas grandir)
- Carte plate (0 tilt/skew) = ancrage naturel sans ombre, sans technique speciale
- `imageRendering: "pixelated"` obligatoire sur SVG `<image>`
- Pas d'ombre en dessous des pieds : retire, inutile, coupe l'effet ancre

### 2. Walk cycle frames individuelles sur carte
- Structure PixelLab : `animations/<nom-animation>/<direction>/frame_000.png` ... `frame_005.png`
- 6 frames par direction, RGBA 64x64 natif
- Formule cycle Remotion :
  ```ts
  const animFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
  const frameStr = String(animFrame).padStart(3, "0");
  const href = staticFile(`${ANIM_PATH}/${dir}/frame_${frameStr}.png`);
  ```
- WALK_FPS = 8 (optimal pour marche naturelle)
- WALK_FRAMES = 6

### 3. Deplacement sur route
- `interpolate(frame, [0, WALK_END], [startX, endX])` pour position X/Y
- Camera suit le personnage : meme interpolate sur camX/camY
- Flip direction ouest : `<g transform="scale(-1, 1)">` autour du sprite
- Sprite ancre au sol : `x={charX - size/2}` + `y={charY - size}`

### 4. Changement d'animation (marche -> action)
- `const isWalking = frame < WALK_END`
- Deux `staticFile()` : un pour walk, un pour l'animation de destination
- Transition instantanee au frame exact — propre, pas de glitch

### 5. Deux personnages simultanes
- Deux jeux de variables independants (charX/charY pour chaque)
- Arrivee au meme point de rencontre, chacun avec sa propre animation post-rencontre
- Flip sur l'un des deux pendant la marche uniquement

## Assets disponibles (generes session 2026-05-01)

### Sprites statiques Atlas
- `public/atlas-mansa-moussa/assets/mansa-pixel-128.png` — Mansa Moussa roi (robes or, sceptre)
- `public/atlas-mansa-moussa/assets/guerrier-pixel-128.png` — guerrier lance
- `public/atlas-mansa-moussa/assets/chameau-pixel-128.png` — chameau de caravane

### Personnages medievaux avec walk cycles (test)
Dossier : `public/pixellab-walk-test/`

| Dossier | Personnage | Animations disponibles | Directions walk |
|---------|-----------|----------------------|-----------------|
| `monk/` | Moine robe sombre | `slow_somber_monastic_walk`, `monk_kneeling_in_prayer` | 4 (N/S/E/W) |
| `merchant-dark/` | Marchand manteau sombre | `nervous_hurried_walk`, `yelling_piedestrian_to_sell` | 4 (N/S/E/W) |
| `merchant-side/` | Marchand chapeau | `walking_slowly_through_medieval_town`, `being_accused`, `Drinking`, `tied_to_pole` | E + S seulement |
| `peasant/` | Paysanne robe grise | `slow_tired_medieval_walk`, `holding_fire_torche` | 4 (N/S/E/W) |

### Compositions Remotion de test
- `AtlasPixelFlatD` — carte plate, 2 sprites statiques, zoom 1x->1.6x, SANS ombre SANS hop
- `AtlasWalkTest` — monk marche Niani->Tombouctou, camera suit
- `AtlasWalkThenPray` — monk marche 4s puis s'agenouille, zoom progressif
- `AtlasWalkMeet` — monk + merchant se rencontrent au centre, animations distinctes

## Erreurs faites et corrections

| Erreur | Correction |
|--------|-----------|
| `PixelLabClient(api_key=...)` | Field est `secret` : `PixelLabClient(secret='...')` |
| `pixellab.generate_image_pixflux(...)` | Import direct : `from pixellab.generate_image_pixflux import generate_image_pixflux` |
| `result.image.to_image()` | Methode correcte : `result.image.pil_image().save(...)` |
| Sprites feminins generes | Ajouter "adult male", "masculine build", "broad shoulders" au prompt — OBLIGATOIRE pour tout personnage masculin (Mansa Moussa MCP 2026-05-01 : prompt avec ces termes = résultat correct du premier coup) |
| Guerrier avec guitare | Ajouter "holding a long spear, no instrument, combat stance", eviter "Mandinka" seul |
| MCP PixelLab "requires subscription" | MCP = abonnement mensuel separe. SDK Python v1 = credits USD suffisent |
| `AtlasSvgDefs` inexistant | Import correct : `AtlasSharedDefs` depuis `atlas-v2-shared-defs.tsx` |
| Hop + ombre = personnage qui flotte | Retirer les deux. Carte plate + sprite statique = ancrage naturel |

## Prochaine session : integration Atlas Mansa Moussa V2

### Ce qu'il faut generer (abonnement PixelLab MCP ou SDK)
1. **Mansa Moussa** — walk cycle east + west (6 frames chacun), vue side-view
   - Prompt base : "Mansa Musa, West African king, 14th century, golden crown, orange royal robe, gold scepter, dark skin, pixel art, side view, transparent background"
2. **Guerrier Mali** — walk cycle east + west
   - Prompt base : "14th century Malian warrior, dark skin, adult male, holding long spear, colorful wrap, pixel art, side view, transparent background"
3. **Chameau** — walk cycle east (quadrupede, vue side)
   - Via `create_map_object` ou `animate_object` (pas `create_character`)

### Parametres SDK generer walk cycle
```python
# Avec abonnement MCP : animate_character(character_id, animation_description, direction)
# Sans abonnement : generer frames une par une avec generate_image_pixflux
# Taille : 128x128 (affiche a 64px dans Remotion)
```

### Integration dans AtlasV2S3Scene.tsx
- Remplacer `<AtlasCaravane>` statique par sprites PixelLab animes
- Walk cycle sur la route caravane (interpolation existante dans MoveB reutilisable)
- Mansa Moussa : marche + s'arrete + animation royale au point cle narratif

## Regles canoniques validees

- **Taille sprite** : 64px affiche, 128px genere (ne pas grandir)
- **Carte plate** pour scenes personnages, tilt pour scenes geo pures
- **Pas d'ombre** sous les pieds
- **Pas de hop** si personnage statique
- **WALK_FPS = 8** pour marche naturelle
- **Flip = `scale(-1,1)`** dans un `<g>` wrapper, pas sur l'image directement
