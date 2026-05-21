---
name: pixellab-states-animate-object
description: Capacités States et animate_object PixelLab — sous-utilisées jusqu'au 2026-05-16, désormais règle obligatoire avant toute création d'asset
metadata:
  type: reference
---

# PixelLab — States + animate_object + référence image

> Validé via MCP 2026-05-16. Toutes ces capacités sont disponibles via MCP, rien n'est limité à l'interface web.

## States — la capacité la plus puissante ⭐

### Principe

Partir d'un asset canonique existant et dériver N variantes. Le style visuel du personnage/objet original est préservé à 100% — zéro drift, zéro régénération coûteuse.

```
create_character_state(character_id="<ID canonique>", edit_description="sitting on throne")
create_object_state(object_id="<ID objet>", edit_description="add moss, ruined version")
```

Le state retourne un **nouveau ID** groupé avec la source via `group_id`. Les deux coexistent.

### Cas d'usage characters

| Asset source | State possible | Usage narratif |
|-------------|---------------|----------------|
| Roi debout | "sitting on throne, regal pose" | Scène de cour, discours |
| Guerrier en armure | "wounded, leaning on spear" | Après bataille |
| Marchand | "holding gold coins, triumphant" | Beat commerce |
| Personnage adulte | "older version, white beard" | Ellipse temporelle |
| Mansa Souleymane | "waving from throne" | Signature visuelle Mali Vivant |

### Cas d'usage objects

| Asset source | State possible | Usage narratif |
|-------------|---------------|----------------|
| Bateau intact | "sails torn, storm damaged" | Naufrage, danger |
| Bâtiment neuf | "ruined, crumbling walls" | Déclin, siège |
| Rat statique | "running, legs in motion" | Vecteur Peste dynamique |
| Mosquée | "under construction, scaffolding" | Croissance ville |

### Règle obligatoire

**Avant tout `create_character` ou `create_map_object`** :
1. Vérifier PIXELLAB-MASTER-INDEX.md — asset similaire existe ?
2. Si oui → utiliser `create_character_state` ou `create_object_state`
3. Jamais régénérer from scratch si un state suffit

---

## animate_object — animations libres pour map objects (MCP async)

Contrairement aux characters (templates fixes), les objects acceptent une description libre.

```
animate_object(
  object_id="<ID>",
  animation_description="rocking gently on waves, drifting left to right",
  frame_count=8   # 4, 6, 8, 10, 12, 14, ou 16
)
```

- Durée : ~30-60s par direction
- Pas de template — description en langage naturel
- Applicable à tout map object existant
- **LIMITATION** : les frames individuelles NE SONT PAS téléchargeables via MCP. `get_object` confirme que l'animation existe mais ne retourne pas d'URLs Backblaze pour les frames. Solution : utiliser `animate_with_text` (SDK v1, voir section ci-dessous).

---

## animate_with_text — solution pour récupérer les frames (SDK v1, VALIDÉ 2026-05-16)

**La vraie solution pour télécharger des frames d'animation d'objects.** Retourne les frames directement en base64 dans la réponse synchrone.

```python
import base64, requests
from PIL import Image
import io

API_KEY = "..."  # depuis .env PIXELLAB_API_KEY
BASE_URL = "https://api.pixellab.ai/v1"

# OBLIGATOIRE : la reference_image doit être exactement image_size
# Upscaler avec PIL.Image.NEAREST pour pixel art
src = Image.open("rat-noir.png")  # 32x32
ref = src.resize((64, 64), Image.NEAREST)
buf = io.BytesIO(); ref.save(buf, "PNG")
ref_b64 = base64.b64encode(buf.getvalue()).decode()

payload = {
    "image_size": {"width": 64, "height": 64},  # min 64x64 (contrainte API)
    "description": "description du personnage/objet",
    "action": "scurrying quickly, legs moving fast",
    "text_guidance_scale": 7.5,
    "image_guidance_scale": 1.8,
    "n_frames": 8,          # max recommandé : 8 (donne 4 frames en pratique)
    "view": "high top-down",  # ou "side"
    "direction": "east",
    "reference_image": {"type": "base64", "base64": ref_b64},
    "seed": 42
}

resp = requests.post(
    f"{BASE_URL}/animate-with-text",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json=payload, timeout=150
)
images = resp.json()["images"]  # liste de {"base64": "..."}
for i, img in enumerate(images):
    Path(f"frame_{i:03d}.png").write_bytes(base64.b64decode(img["base64"]))
```

### Contraintes validées (2026-05-16)

| Paramètre | Valeur | Note |
|-----------|--------|------|
| `image_size` min | 64×64 | En dessous → HTTP 422 |
| `reference_image` size | doit matcher `image_size` exactement | Sinon HTTP 500 tensor mismatch |
| `n_frames=8` | retourne 4 frames en pratique | L'API divise par 2 |
| Auth header | `Authorization: Bearer <key>` | `X-API-Key` ne fonctionne pas |

### Résultats obtenus

| Asset | Frames | Qualité | Fichiers |
|-------|--------|---------|---------|
| Rat scurrying | 4f (64×64) | Cycle propre, pattes bougent | `public/atlas/peste-1347/assets/objects/rat-anim/frame_000-003.png` |
| Bateau rocking | 4f (64×64) | f0/f1 sans voiles, f2/f3 avec voiles — utiliser f2/f3 | `public/atlas/peste-1347/assets/objects/bateau-anim/frame_000-003.png` |

---

## Référence image — style matching

### create_map_object avec background_image

Générer un asset qui adopte le style visuel d'une image existante :

```
create_map_object(
  description="medieval watchtower",
  background_image={"type": "path", "path": "public/atlas/peste-1347/assets/objects/rat-noir.png"},
  width=64, height=96
)
```

L'IA "voit" l'image de référence et génère dans le même style pixel art. Parfait pour cohérence d'épisode.

### create_character mode pro

Référence image pour personnage haute qualité (8 directions) :
- Coût : 20-40 crédits (vs 1 crédit en standard)
- Toujours 8 directions
- Résultat : cohérence maximale avec l'image de référence
- À utiliser pour personnages principaux d'épisode (pas les figurants)

---

## Pourquoi c'est important

Jusqu'au 2026-05-16, on régénérait des personnages from scratch à chaque variation → drift de style entre versions du même personnage, coût en crédits inutile, incohérence visuelle.

Avec States : **un personnage canonique = source de vérité** → toutes les variantes en dérivent. Même logique qu'un rig 3D ou un character sheet illustration. Ouvre des possibilités narratives (évolution du personnage, états émotionnels, costumes) sans coût additionnel significatif.
