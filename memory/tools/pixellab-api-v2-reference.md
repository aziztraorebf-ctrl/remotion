# PixelLab — API v2 REST + MCP — référence complète (fev 2026)

> Migré depuis auto-memory 2026-08-31. Complémentaire à `memory/tools/pixellab.md` (SDK Python +
> intégration Remotion SVG) — celui-ci couvre le catalogue MCP/API v2 REST plus large (pricing par
> endpoint, tilesets, animate-with-text, foot anchor normalisé). Vérifier `pixellab.md` en premier
> pour les gotchas récents (bug lib REST locale, enums MCP vs lib), ce fichier pour le panorama
> complet des endpoints.

## Account & Access
- **Plan**: Tier 1 ($9/mois), 2000 generations/month (resets monthly)
- **Credits ($)**: crédits utilisés SEULEMENT après 2000 gens mensuelles épuisées
- **API Key**: dans `.env` sous `PIXELLAB_API_KEY`
- **MCP config**: `.mcp.json` (même clé pour MCP et API v2)

## Base URLs
- **MCP**: `https://api.pixellab.ai/mcp`
- **API v2**: `https://api.pixellab.ai/v2` (appels REST directs)
- **API v1**: `https://api.pixellab.ai/v1` (legacy, OpenAPI spec à /v1/openapi.json)
- **Auth**: `Authorization: Bearer API_KEY`
- **Docs**: `https://api.pixellab.ai/v2/llms.txt` (lisible LLM)

## Pricing par appel API (v1 pay-per-use)
| Endpoint | 64x64 | 128x128 | Notes |
|---|---|---|---|
| generate-pixflux | $0.008 | $0.008 | Jusqu'à 400x400 |
| generate-bitforge | $0.007 | $0.008 | Jusqu'à 200x200, style transfer |
| rotate | $0.011 | $0.011 | Jusqu'à 128x128 |
| animate-skeleton | $0.014 | $0.016 | Jusqu'à 256x256 |
| animate-text | ~$0.008 | N/A | 64x64 fixe (v1), 32-128px (v2) |
| estimate-skeleton | $0.005 | $0.005 | Jusqu'à 256x256 |
| inpaint | $0.007 | $0.008 | Jusqu'à 200x200 |

Note : l'abonnement Tier 1 inclut 2000 gens/mois, ces coûts s'appliquent après quota.

## MCP Tools (via .mcp.json, tous utilisent le quota abonnement)

### Character Tools
| Tool | Description |
|---|---|
| `create_character` | Génère un personnage avec 4 ou 8 vues directionnelles. Params : description, body_type (humanoid/quadruped), template, n_directions, proportions (preset : default/chibi/cartoon/stylized/realistic_male/realistic_female/heroic), size (16-128px), outline, shading, detail, view |
| `animate_character` | Ajoute une animation à un personnage existant. 49 templates humanoid : walk, run, idle, kick, punch, fireball, etc. Templates quadruped : walk, run, idle, attack, eat, sleep |
| `get_character` | Récupère les données du personnage : rotations, animations, status, URL ZIP |
| `list_characters` | Liste tous les personnages avec pagination et filtrage par tag |
| `delete_character` | Supprime un personnage définitivement |

### Tileset Tools
| Tool | Description |
|---|---|
| `create_topdown_tileset` | Tilesets Wang : 16 tuiles pour transitions de terrain sans couture. Chaînable via base_tile_id (ocean->beach->grass) |
| `create_sidescroller_tileset` | Tilesets plateforme : 16 tuiles, vue latérale, fond transparent. Chaînable |
| `create_isometric_tile` | Tuile isométrique unique (thin/thick/block). Taille 16-64px |
| `create_map_object` | Objets fond transparent (arbres, barils, fontaines). Style matché via background_image. Inpainting : masque oval/rectangle/custom |

### Faits clés MCP
- Non-bloquant : tous les outils de création retournent un job ID immédiatement
- Temps de traitement : personnages 2-5 min, tilesets ~100s, tuiles ~15-30s
- Les map objects s'auto-suppriment après 8 heures
- Tous les outils disponibles dans une session Claude Code via MCP

## API v2 Endpoints (utilisent aussi le quota abonnement, PAS des crédits)

| Endpoint | Fonction |
|---|---|
| `POST /animate-with-text` | Animations custom depuis texte (64x64 seulement en v1) |
| `POST /animate-with-text-v2` | Amélioré, support 32-128px |
| `POST /generate-8-rotations-v2` | 8 directions depuis concept art ou style ref |
| `POST /inpaint` | Édite des parties d'un sprite (basé masque) |
| `POST /generate-image-bitforge` | Génération style transfer (jusqu'à 200x200) |
| `POST /generate-image-pixflux` | Texte vers pixel art (jusqu'à 400x400) |
| `POST /generate-with-style-v2` | Match style depuis références |
| `POST /edit-image` | Édite un pixel art existant avec texte |
| `POST /image-to-pixelart` | Convertit image HD en pixel art |
| `POST /rotate` | Tourne un sprite vers une nouvelle direction |
| `POST /estimate-skeleton` | Extrait les keypoints de squelette d'un personnage |

## Pipelines PROUVÉS

### Pipeline 1 : MCP Character (personnages simples)
```
1. create_character(description="medieval peasant", n_directions=4, size=64)
2. animate_character(character_id, template_animation_id="walking")
3. get_character(character_id) -> télécharger ZIP
4. Extraire les frames vers public/assets/.../pixellab/characters/
```
Idéal pour : personnages génériques où une description texte suffit.

### Pipeline 2 : Concept Art vers Character (complexe/historique)
```
1. Gemini generateContent (image) -> concept art HD
2. Python : Pillow resize max 256x256 (LANCZOS)
3. PixelLab POST /v2/generate-8-rotations-v2 (create_from_concept) -> 8 rotations
4. PixelLab POST /v2/animate-with-text -> animations custom par direction
```
Idéal pour : personnages complexes où le texte seul donne des résultats fantasy/incorrects (ex.
Plague Doctor). Qualité bien meilleure que texte seul pour designs historiques/spécifiques précis.
Coût : ~$0.18 par personnage pour les rotations.

### Pipeline 3 : animate-with-text pour actions custom
```
1. Prendre le PNG de rotation comme reference_image
2. POST /v2/animate-with-text avec description de l'action
3. 4 frames par appel, utiliser start_frame_index pour stitcher des animations plus longues
4. Répéter pour chaque direction nécessaire
```
Key param : `image_guidance_scale: 8.0` (pas le défaut 1.4) pour une bien meilleure cohérence.

## Notes techniques critiques

### Format image (CAUSERA 422 SI FAUX)
- Base64 API v2 : string base64 brut, **PAS** de préfixe `data:image/png;base64,`
- L'image concept requiert : champs width + height à côté de l'image
- Format : `{"type": "base64", "base64": RAW_B64_STRING}`
- Concept : `{"image": {"type": "base64", "base64": B64}, "width": W, "height": H}`

### Limitations
- `animate-with-text` v1 : 64x64 fixe seulement. v2 : 32-128px
- Param `no_background` : PAS supporté sur animate-with-text (cause 422)
- Le modèle génère toujours 4 frames par appel animate (param n_frames demande plus mais le résultat peut varier)
- Cohérence avec la référence à image_guidance_scale par défaut (1.4) = ~60%. Régler à 8.0 pour ~90%+
- Régénération MCP = non-déterministe (résultat différent à chaque fois). Sauvegarder les bons résultats immédiatement.
- Qualité dégrade en dessous de 16x16 sprites
- Pas d'endpoint tileset dans l'API REST (tilesets = MCP seulement)

### Metadata — FOOT ANCHOR (PROUVÉ, utilisé en production à l'époque)
- Le ZIP personnage contient `metadata.json` avec keypoints par frame par direction
- Format : `keypoints.rotations.east[0]` = array de {x, y, label, depth, z_index}
- Coordonnées NORMALISÉES 0-1 relatives à la taille du sprite
- Keypoints disponibles : NOSE, NECK, shoulders, elbows, arms, hips, knees, LEGS, eyes, ears
- `RIGHT LEG` / `LEFT LEG` = point le plus bas (cheville/tibia) — PAS de keypoint pied/orteil
- Animations dans `keypoints.animations.walking_east` (pas `walking.east`)

**FOOT_Y_NORMALIZED = 0.827** (vérifié sur 4 chars side-view mannequin)
- Valeur identique pour peasant-man, monk, merchant, peasant-woman (même template)
- walking_east range = [0.808 - 0.827] → utiliser 0.827 (pied le plus bas)
- Formule anchor Remotion : `top = laneY - displaySize * 0.827`
- Place les pieds exactement sur la ligne de sol (pas le bas du container transparent)
- Implémenté à l'époque dans `HookSceneSideView.tsx` comme `FOOT_Y_NORMALIZED = 0.827`

Pour futurs personnages side-view mannequin : réutiliser 0.827 directement, même valeur.

## Personnages générés pour Peste 1347 (historique — projet a depuis pivoté vers Atlas Mapbox pur)

| Name | ID | Size | Rotations | Walking | Idle | Method |
|---|---|---|---|---|---|---|
| Peasant Man | db8dce29 | 64x64 | 4 | 4-dir, 6 frames | 4-dir | MCP text |
| Peasant Woman | 99eb124f | 64x64 | 4 | pas d'anims walk | - | MCP text |
| Merchant | 190effe1 | 64x64 | 4 | 4-dir | oui | MCP text |
| Monk | c2923dcd | 64x64 | 4 | 3-dir (pas de west) | oui | MCP text |
| Child | da1c3676 | 48x48 | 4 | 4-dir ("walk" pas "walking"!) | - | MCP text |
| Noble v2 | 5e466104 | 64x64 | 4 | south seulement | oui | MCP text |
| Blacksmith v2 | d5fa97e8 | 64x64 | 4 | 4-dir, 6 frames | oui | MCP text |
| Plague Doctor | local seulement | 64x64 | 8 | 4-dir, 4 frames | 4-dir, 4 frames | Concept art |

### Gotchas d'animation (causent des échecs silencieux)
- **Child**: dossier animation = "walk" (PAS "walking" comme les autres)
- **Monk**: direction west manquante (seulement east, south, north)
- **Noble**: animation walk south seulement
- **Peasant Woman**: AUCUNE animation walk (rotations seulement)
- **Plague Doctor**: 4 frames par animation (pas 6 comme les personnages MCP)

## Contexte historique (sessions fev 2026)

- Découverte (16 fev 2026) : Aziz a identifié PixelLab comme game changer potentiel
- Intégration (16 fev 2026) : serveur MCP installé, clé API obtenue
- Pipeline Concept Art découvert (16 fev 2026) : text-only Plague Doctor = résultats fantasy ;
  pipeline Gemini concept -> resize 256max -> generate-8-rotations-v2 = 8 rotations cohérentes,
  bien meilleur que texte seul
- Animation via API v2 (16-17 fev 2026) : image_guidance_scale=8.0 améliore dramatiquement la
  cohérence (vs défaut 1.4). Limitation 4 frames/appel, stitchable via start_frame_index
- Avertissement non-déterminisme (Aziz, 16 fev) : sauvegarder les bons résultats immédiatement,
  ne pas régénérer ce qui marche déjà
