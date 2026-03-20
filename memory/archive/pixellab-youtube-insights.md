# PixelLab YouTube Insights (yt-dlp)

> Source : transcripts telecharges via yt-dlp — 2026-02-21
> 9 videos analysees, parametres extraits des tutoriels officiels PixelLab

## Videos analysees
- H-dPJKmKr1E : Creating a pixel art sidescroller map and tilesets (10:36)
- XVlbYNMI3xg : Generate map tiles for your sidescroller game (6:00)
- yuXcjgZJJv0 : Generate tile maps for your sidescroller game with AI (7:09)
- q9z2Vhpz-Z8 : Generating pixel art tilesets (16:06)
- D0uZTaHj0Do : How to create tilesets using AI (13:37)
- jPPznIEK7HY : How to create tilesets and maps using AI (10:05)
- THwZYWuOdZI : AI Builds a Godot Game | PixelLab MCP + Claude Code (23:46)
- 0SQRclReGo4 : How to Create Destructible Environments (14:44)
- O9maOTbLuHQ : PixelLab Map Workshop Tutorial (4:50)

---

## Insights Batiments/Map Objects Side-View

### Workflow recommande (XVlbYNMI3xg + O9maOTbLuHQ)
1. Generer background d'abord (paysage, ciel, montagnes)
2. Generer le sol via inpainting dans le background (inpainter la zone du sol uniquement)
3. Batiments via inpainting : inpainter la zone -> generate — INCLURE du contexte environnant (sol + mur adjacent) dans la selection pour que le modele voie la palette
4. Pour forme specifique : utiliser init image (meme sketch approximatif = aide beaucoup)
5. Output method = "new layer" pour garder batiment separe du background

### Create Object dans Map Workshop (O9maOTbLuHQ)
- Bouton "create object" genere un objet DEPLACABLE (contrairement a inpainting = statique)
- Objet peut etre deplace, duplique, edite dans Pixelorama
- Prompt batiment qui marche : "front-facing compact red brick post office with a flat gray roof, centered glass entrance on the bottom, a blue postal sign above the doorway"
- Modifier en Pixelorama si details incorrects (evite de regenerer)

### Buildings via Edit Image Pro (0SQRclReGo4)
- Edit image normal (1 gen) : OK pour effets simples, echoue sur formes complexes
- Edit image pro (40 gens) : necessite clic "set image" manuel, bien meilleur sur textures complexes
- Animate with text pro : generer 16 frames d'un batiment se transformant -> choisir les frames voulues

---

## Insights Tilesets Sidescroller

### Causes du "no tiles produced" (D0uZTaHj0Do + H-dPJKmKr1E — CONFIRME)

1. **tile_strength trop bas** : valeur recommandee = 8-10. En dessous de 6 = modele trop libre = echec
2. **tileset_adherence trop bas** : si trop bas, le modele ne suit pas la forme standard -> echec. Recommande : 80-100+
3. **Description insuffisante** : decrire la scene complete, pas juste la texture. Ex : "grass on top of dirt platform with blue sky in background" et pas juste "grass"
4. **Init image manquante pour sidescroller** : le sidescroller a besoin d'un sketch visuel (bleu/vert/marron) AVANT de generer via create map tool
5. **Pas assez de contexte visible** : le modele doit voir le ciel sur les cotes pour comprendre que c'est une plateforme flottante — ne pas tout inpainter

### Parametres sidescroller corrects (H-dPJKmKr1E — source directe tutoriel officiel)
```
inner_tile: description texture principale (ex: "stone cobblestone medieval")
transition_tile: description texture secondaire (ex: "dirt earth")
tile_size: 32x32  (meilleur qualite que 16x16 pour sprites 64x64)
transition_size: 0.5  (= 16px de blend a 32px tiles — standard)
tile_strength: 8-10  (CRITIQUE — ne pas descendre)
ai_border_freedom: 150-250  (jouer dans cette range)
tileset_adherence: 80-100  (plus = plus consistent, moins = risque echec)
outline / shading / detail: default OK pour commencer
```

### Workflow sidescroller correct (D0uZTaHj0Do)
1. Dessiner sketch couleur simple : ciel bleu, sol vert, roche marron
2. Ouvrir create map tool
3. Inpainter la zone -> utiliser init image (le sketch)
4. Description : "grass on top of dirt platform with a blue sky in the background"
5. Laisser le modele voir le ciel sur les cotes (ne pas tout inpainter)
6. Pour les pieces manquantes (coins, piliers) : inpainter chaque piece separement
7. Pour slanted ground : init image strength 300-450, description "grass hill" ou "slanted ground"

### Extend Map pour corriger les seams (H-dPJKmKr1E + jPPznIEK7HY)
- Utiliser "extend map v2" (pas la v1)
- Toujours selectionner tiles existantes + background AVANT d'etendre
- Pour seams entre tiles : extend map + inpaint la zone de joint
- Description = decrire l'IMAGE ENTIERE, pas seulement la zone modifiee

### Chainer plusieurs tilesets (jPPznIEK7HY)
- Generer tileset 1 -> utiliser une tile de tileset 1 comme reference pour tileset 2
- Ex : grass -> sand (tileset 1), puis sand comme reference -> ocean (tileset 2) -> garantit matching

---

## Insights MCP + Claude Code (THwZYWuOdZI)

### Tools MCP confirmes disponibles
- create_character, animate_character
- create_sidescroller_tileset, create_topdown_tileset, create_isometric_tiles
- (map objects PAS encore dans MCP au moment du tournage — webUI seulement)

### Workflow MCP recommande
1. Creer character sur le site web d'abord (voir + corriger stray pixels)
2. Animer via le site (max 10 background jobs en parallele)
3. MCP : download par nom de character (pas besoin d'ID) : "download character named 'peasant-man'"
4. MCP tileset prompt qui a marche : "use the Pixel Lab MCP and make a top down 32x32 grass and dirt tile sets. Check and download it and import it to the project"

### MCP via API directe (THwZYWuOdZI)
- Pour assets simples (props, items) : passer l'URL de la doc AI a Claude -> Claude lit la doc et appelle l'API
- "use remove background setting" dans le prompt API -> image avec fond transparent

---

## Parametres Standard Projet Peste 1347

### Sol medieval side-view
```
create_sidescroller_tileset(
    inner_tile_description="medieval stone cobblestone ground, worn texture, dark mortar",
    outer_tile_description="dark earth dirt medieval",
    tile_size=32,
    transition_size=0.5,
    tile_strength=9,
    ai_border_freedom=200,
    tileset_adherence=90,
    outline="single_color",
    shading="medium",
    detail="low"
)
```

### Batiments side-view via Map Workshop
- Methode 1 (map objects) : Create Object -> prompt descriptif precis -> deplacable
- Methode 2 (inpainting) : background genere -> inpaint batiment avec contexte environnant large
- Prompt type : "front-facing medieval stone house with wooden beams, thatched roof, arched doorway, side view, plague era, dark palette"
- Toujours : init_image si forme specifique, target_palette = current_image pour cohesion palette

### Backgrounds parallax
- Generer avec create image, camera_view=none, direction=none -> image flat avec depth
- Splice en layers, etendre via extend map tool
- Prompt : "medieval plague village, distant dark forest, overcast sky, muddy cobblestone ground, no UI, no text"

### Anti-patterns confirmes (echecs documentes + tutoriels)
- tile_strength < 6 -> garantit "no tiles produced"
- Init image manquante sur sidescroller -> modele perdu, qualite mediocre
- Tout inpainter sans laisser de contexte visible -> modele ne comprend pas la scene
- Extend map v1 (utiliser v2)
- Description de la zone modifiee seulement dans extend map (decrire toute l'image)
- Batiments generes sans inclure sol/contexte adjacent dans la selection -> palette incoh

---

## Automatisation PixelLab : Ce qui est possible (verifie doc 2026-02-21)

### Automatable via MCP ou API
| Feature | Outil | Note |
|---------|-------|------|
| Personnages + animations | MCP `create_character` / `animate_character` | 100% script |
| Tilesets sol side-view | MCP `create_sidescroller_tileset` | 100% script |
| Tilesets sol top-down | MCP `create_topdown_tileset` | 100% script |
| Batiments individuels complets | API `/v2/generate-image-pixflux` + `no_background=true` | ~20s, synchrone, PROUVE |
| Inpainting programmatique | API `/v2/inpaint` avec masque genere par code | Possible, non encore teste |
| Batiments side-view front-facing | `/v2/generate-image-pixflux` + prompt "front-facing side view" | PROUVE 2026-02-21 |

### Gotchas batiments side-view (valides 2026-02-21)
- `view: "side"` seul ne suffit pas -> le modele glisse vers 3/4 perspective
- Prompt obligatoire a ajouter : `"side-scrolling 2D platformer style, front-facing facade, perfectly flat front view, no perspective, no 3/4 angle, orthographic projection"`
- Pour batiments 2 etages : ajouter `"symmetrical facade, centered front door"` + `text_guidance_scale: 10.0`
- Ratio trop elance (ex: 200x280) favorise la derive 3/4 sur les grands batiments -> preferer 200x260
- `"no text no signs"` obligatoire pour eviter texte parasite sur les enseignes
- Rate limit si 3 appels simultanees -> espacer de 10s minimum entre generations paralleles

### Web UI seulement (pas d'API, pas de MCP)
- **Map Workshop "Create Object"** : pas d'endpoint REST. Alternative : `/v2/generate-image-pixflux`
- **Extend Map** : pas d'endpoint. Manuel uniquement.
- **Inpainting interactif** (Map Workshop canvas) : semi-manual. La selection de zone est manuelle.
- **Scenes & Environments** : pas encore disponible via API

### MCP custom : ce qui est faisable
- Wrapper `/v2/generate-image-pixflux` avec presets batiments medievaux preconfigures : ~200 lignes, faisable
- Wrapper `/v2/inpaint` avec masque genere par PIL : faisable
- Bridge Map Workshop (Create Object / Extend Map) : NON faisable (pas d'endpoint sous-jacent)

### Pipeline recommande (documente 2026-02-21)
1. Fond (background) : `/v2/generate-image-pixflux` - ciel + profondeur + horizon
2. Sol : MCP `create_sidescroller_tileset` OU inpainting sur le fond
3. Batiments : `/v2/generate-image-pixflux` + `view="side"` + `no_background=true` -> PNG transparent
4. Assemblage : Aseprite CLI (nettoyer padding, composer layers) -> 1 PNG background final
5. NPCs : MCP characters -> Aseprite (nettoyer padding pied=bas canvas) -> Phaser avec setOrigin(0.5,1)
6. Animation : Phaser charge background static + sprites animes par-dessus

### Regle cle : Aseprite = etape obligatoire entre generation et moteur
- Aseprite nettoie le padding transparent variable -> ancrage zero-offset garanti
- Sans Aseprite : padding variable par asset -> maths PIL complexes -> flottement quasi-certain
- Avec Aseprite : sprite bas=canvas bas -> setOrigin(0.5,1) fonctionne directement

---

## Pipeline Isometrique (piste future, session separee)

### Faisabilite confirmee (verifie doc 2026-02-21)
**Outils disponibles pour une scene isometrique style Veo 3 :**
| Etape | Outil | Statut |
|-------|-------|--------|
| Tuiles iso | MCP `create_isometric_tile` | CONFIRME (MCP disponible) |
| Tileset sol top-down | MCP `create_topdown_tileset` | CONFIRME (utilise 17x deja) |
| Batiments isometriques | `/v2/generate-image-pixflux` (Map Workshop "Create Object" = iso par defaut) | CONFIRME via Playwright |
| Sprites NPCs 8 directions | MCP `create_character` avec `n_directions:8` + animations | CONFIRME |
| Nettoyage padding | Aseprite `--trim` | CONFIRME |
| Composition video | Remotion React pur (Y-sort zIndex) | CONFIRME (deja en production) |

### Formule isometrique pour Remotion (React pur, zero Phaser)
```
screenX = (isoX - isoY) * tileWidth / 2
screenY = (isoX + isoY) * tileHeight / 2
```
Y-sort depth : `zIndex = isoX + isoY` (objets plus "bas" dans la scene = rendus par-dessus)

### Limites confirmees
- Map Workshop "Create Object" via Playwright : fonctionne mais TOUJOURS isometrique, pas de side-view
- PixelLab ne genere JAMAIS de video : tous les outputs sont des sprites/PNG statiques
- Phaser inutile pour Remotion : React pur + zIndex Y-sort est optimal

### Gotchas API confirmes (2026-02-21)
- `/v2/map-objects` reste en `pending` 15+ min sous charge -> utiliser `/create-image-pixflux` (synchrone)
- `/create-image-pixflux` : `detail="highly detailed"` (pas "high detail" - enum different des autres endpoints)
- `/create-tileset` : `tile_strength` max=2.0 via API (le UI affiche 8-10, unites differentes)
- Playwright + PixelLab : session authentifiee accessible si browser deja connecte
