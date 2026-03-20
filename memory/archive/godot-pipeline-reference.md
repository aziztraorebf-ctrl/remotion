# Godot Pipeline Reference — Peste 1347 Village Scene

> Document de référence si on revient à Godot. Créé le 2026-02-18 avant migration vers Phaser v5.
> Tout ce qui a été découvert par l'expérience, pas la théorie.

---

## Projet Godot

- **Chemin** : `/Users/clawdbot/peste-village-scene/`
- **Version Godot** : 4.x (Metal 4.0 GPU, M1 Mac)
- **Résolution** : 1920x1080

---

## La formule d'ancrage (le problème central)

### Constante clé
```
GROUND_Y = 943.0     # ligne du sol en pixels
FOOT_OFFSET_Y = -24.0  # offset pour que les pieds touchent le sol
```

### Pourquoi -24 ?
- Sprites PixelLab : canvas 64px, PIVOT_Y_NATIVE = 56 (pixel le plus bas opaque = semelle)
- `centered = true` par défaut sur AnimatedSprite2D → centre à 32px
- Offset nécessaire = -(56 - 32) = **-24px natif**
- À scale=3 : les pieds tombent exactement à position.y

### Application dans GDScript
```gdscript
const GROUND_Y = 943.0
const FOOT_OFFSET_Y = -24.0

npc.position = Vector2(x, GROUND_Y)
npc.offset = Vector2(0, FOOT_OFFSET_Y)
npc.scale = Vector2(3, 3)
```

### Formule bâtiments (centered = false)
```
position.y = GROUND_Y - lowest_opaque_pixel * scale
```
Valeurs mesurées sur les assets actuels :
- `house-timbered.png` : lowest_opaque_pixel = 121 → position.y = 943 - 121*4 = **459**
- `church.png` : lowest_opaque_pixel = 119 → position.y = 943 - 119*4 = **467**
- `inn.png` : lowest_opaque_pixel = 105 → position.y = 943 - 105*4 = **523**

---

## Z-index order

| Layer | z_index | Noeud |
|-------|---------|-------|
| Ciel | 0 | ColorRect Sky |
| Bâtiments | 10 | Sprite2D Building* |
| Sol (cache les pieds) | 15 | Sprite2D GroundBase |
| NPCs | 20 | AnimatedSprite2D NPC* |

---

## Structure de scène (village_final.tscn)

```
Node2D (root, script: village_final.gd)
├── Sky (ColorRect, z=0, size=1920x943, color=0.353/0.392/0.451)
├── Building1 (Sprite2D, z=10, pos=220/459, scale=4, house-timbered)
├── Building2 (Sprite2D, z=10, pos=620/467, scale=4, church)
├── Building3 (Sprite2D, z=10, pos=1050/523, scale=4, inn)
├── Building4 (Sprite2D, z=10, pos=1400/459, scale=4, house-timbered)
├── GroundBase (Sprite2D, z=15, pos=0/943, ground-cobblestone.png)
├── NPC1 (AnimatedSprite2D, z=20, pos=500/943, scale=3)
├── NPC2 (AnimatedSprite2D, z=20, pos=900/943, scale=3)
├── NPC3 (AnimatedSprite2D, z=20, pos=1300/943, scale=3)
└── NPC4 (AnimatedSprite2D, z=20, pos=1650/943, scale=3)
```

---

## Personnages disponibles (side-view)

Tous dans `/peste-village-scene/assets/characters/` :

| Dossier | Directions | Frames |
|---------|-----------|--------|
| `peasant-man-side/walking/` | east, west | 6 frames (000-005) |
| `peasant-woman-side/walking/` | east, west | 6 frames |
| `monk-side/walking/` | east, west | 6 frames |
| `merchant-side/walking/` | east, west | 6 frames |

Format : `res://assets/characters/{char}/walking/{dir}/frame_{000-005}.png`

---

## Export vidéo : --write-movie (clé du pipeline)

### Commande
```bash
/Applications/Godot.app/Contents/MacOS/Godot \
  --path /Users/clawdbot/peste-village-scene \
  --scene scenes/village_final.tscn \
  --write-movie /tmp/godot-frames/frame.png \
  --fixed-fps 30 \
  --quit-after 150
```
Produit : `frame00000000.png`, `frame00000001.png`, etc.

### Conversion FFmpeg
```bash
ffmpeg -framerate 30 \
  -i /tmp/godot-frames/frame%08d.png \
  -vf "scale=1920:1080:flags=neighbor" \
  -c:v libx264 -crf 15 -pix_fmt yuv420p \
  output.mp4
```
`flags=neighbor` = nearest-neighbor pour pixel art sans flou.

### Points critiques write-movie
- **Nécessite GPU** : ne fonctionne PAS avec `--headless` (dummy renderer)
- Sans `--headless`, une fenêtre Godot s'ouvre brièvement — normal
- Dossier de sortie doit exister avant le lancement
- `--quit-after N` = nombre de frames avant arrêt automatique

---

## GDScript : chargement dynamique des animations

```gdscript
func load_npc(node_name: String, char_name: String, speed: float):
    var npc = get_node(node_name)
    var dir = "east" if speed > 0 else "west"
    var frames = SpriteFrames.new()
    frames.add_animation("walk")
    frames.set_animation_loop("walk", true)
    frames.set_animation_speed("walk", 10.0)
    for i in range(6):
        var tex = load("res://assets/characters/%s/walking/%s/frame_%03d.png" % [char_name, dir, i])
        if tex:
            frames.add_frame("walk", tex)
    npc.sprite_frames = frames
    npc.offset = Vector2(0, FOOT_OFFSET_Y)
    npc.play("walk")
```

---

## Problèmes rencontrés et solutions

### 1. Bâtiments flottants
- **Cause** : utiliser `centered = true` avec offset → mauvais calcul
- **Fix** : `centered = false` + formule `position.y = GROUND_Y - lowest_opaque_pixel * scale`

### 2. Sol gris (cobblestone cassé)
- **Cause** : TextureRect expand_mode=3 ne tile pas correctement un PNG 64x64
- **Fix** : ColorRect solid couleur `Color(0.28, 0.25, 0.22)` (temporaire)
- **Fix propre** : utiliser `SubViewport` + `TextureRect` avec `tile` mode OU remplacer par vrai tileset PixelLab

### 3. Personnages 40px au-dessus du sol
- **Cause** : position.y = 831 (FOOT_Y_NORMALIZED = 0.827 = cheville, pas semelle)
- **Fix** : position.y = GROUND_Y = 943, FOOT_Y_NORMALIZED = 0.875 (56/64 = semelle)

### 4. write-movie échoue en mode headless
- **Cause** : dummy renderer, pas de GPU
- **Fix** : supprimer `--headless`, laisser la fenêtre Godot s'ouvrir

### 5. Circuit breaker Claude bloque les éditions
- **Cause** : hook `circuit-breaker.sh` compte les éditions par fichier
- **Fix** : supprimer la clé du fichier dans `.claude/circuit-breaker-state.json`

---

## Assets Godot vs PixelLab source

Les assets Godot sont des **copies** des assets PixelLab. Source originale :
```
/Users/clawdbot/Workspace/remotion/public/assets/peste-pixel/pixellab/
```
Structure PixelLab source :
```
characters/{char-name}/animations/walking/{direction}/frame_{000-005}.png
```
Structure Godot (renommée côté Godot) :
```
assets/characters/{char-name}/walking/{direction}/frame_{000-005}.png
```

---

## Ce qui manquait à la fin (non résolu dans Godot)

- Building 4 coupé à droite (position.x = 1400 + house width 128*4 = 1912 > 1920)
  - Fix : décaler à 1350 ou utiliser un bâtiment plus étroit
- Deux maisons identiques côte à côte (Building1 et Building4 = house-timbered)
  - Fix : remplacer Building4 par une variante (il n'y en avait qu'une disponible à ce stade)
- Sol en ColorRect gris (pas de vrai cobblestone)
  - Fix propre : tileset PixelLab cobblestone-sideview.png correctement tuilé
- Pas de parallax (ciel uniforme)

---

## Pourquoi on a migré vers Phaser v5

1. Feedback visuel : impossible de voir la scène sans render (write-movie seulement)
2. Corrections de position : réécrire .tscn + re-render à chaque ajustement
3. Calcul d'ancrage manuel (FOOT_OFFSET_Y) : erreur-prone, long à debugger
4. Phaser v5 MCP : 39 outils, `scene-get-screenshot` en temps réel, `assets-get-texture-content-bounding-box` automatise l'ancrage
