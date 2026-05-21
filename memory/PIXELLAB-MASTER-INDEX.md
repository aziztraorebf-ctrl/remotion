---
name: PixelLab Master Index — tous les assets générés
description: Index complet de tous les characters et objects PixelLab — lire AVANT toute génération pour éviter les doublons
type: reference
---

# PixelLab Master Index
> Mis à jour : 2026-05-05
> RÈGLE : lire ce fichier AVANT tout `create_character` ou `create_map_object`.
> Si l'asset existe déjà → utiliser l'ID directement. Zéro dépense inutile.

---

## CHARACTERS (list_characters)

### Projet Hannibal

| Nom | ID | Directions | Canvas | Animations | Statut |
|-----|----|-----------|--------|------------|--------|
| **Hannibal v4c Editorial Dark** | `c6af2865-df5d-4a27-94bf-9702797a99ce` | 8 | 92×92 | aucune | Variante écartée pour épisode principal |
| **Hannibal v4a Minimal** | `4ae3e075-a091-4089-befc-c0f35fd0559d` | 8 | 92×92 | fight-idle(E), walking(E+N) en cours | **CANONIQUE validé Aziz 2026-05-05** — look guerrier minimaliste préféré |
| **Hannibal v3 Pro** | `fb587e39-05eb-401a-8881-baec94b26021` | 8 | 124×124 | ? | Version Pro haute qualité |
| **Hannibal v2** | `1951bf54-4222-4e45-961d-5937fd8a24d3` | 8 | 92×92 | ? | Version antérieure |
| **Hannibal Infantry** | `08221c5c-7054-4f4e-99bf-f3c0d3071542` | 8 | 92×92 | ? | Variante soldat |
| **War Elephant Carthage** | `40e0497b-63fa-4ffb-8d20-4a511d561623` | 8 | 112×112 | **6** : idle-shaking-head (E/W), dying (E/W), running-4-frames (E/W) | **PRINCIPAL éléphant animé** — quadrupède |
| **War Elephant Humanoid v3** | `f3bc8869-2d4c-4696-b499-81424c0af0c0` | 4 | 112×112 | ? | Version humanoid (moins réaliste) |
| **Volque warrior** | `b1baec1b-9772-4d7b-892d-1f202ca1a88a` | 4 | 68×68 | fight-idle(S+W) en cours | Beat 2 rive est — casque, bouclier rond, lance. Validé visuellement 2026-05-05 |
| **Numidian cavalryman** | `34ce6ecf-683c-42f9-a36b-0f5b5fb8edb0` | 4 | 68×68 | running(N+E) en cours | Beat 2 contournement nord — à PIED (décision Aziz 2026-05-05 : assez lisible, cavalier monté trop complexe) |

### Projet Empire Ghana

| Nom | ID | Directions | Canvas | Animations |
|-----|----|-----------|--------|------------|
| **empire-ghana-sundiata-keita** | `46e4511f-c330-4246-a7c6-25239a264ecc` | 4 | 132×132 | 3 |
| **empire-ghana-guerrier-almoravide** | `29659962-898a-4257-be22-1039da8e41f5` | 4 | 132×132 | 2 |
| **empire-ghana-mande-lancier-v2** | `9bd64166-de17-4f20-94b2-d580ef71fee6` | 4 | 132×132 | 1 |
| **empire-ghana-mande-epeiste** | `640ee1ea-f713-49f6-bef9-7e63deebfb45` | 4 | 132×132 | 1 |
| **empire-ghana-mande-lancier** | `dd124f43-1f55-421d-ad7b-29d308f0155a` | 4 | 132×132 | 1 |
| **empire-ghana-merchant-berbere** | `79865794-abb1-4509-b6d7-580f87acbc4c` | 4 | 92×92 | **12** |
| **empire-ghana-merchant-sahelien** | `ef9ac272-1389-430d-9e94-dbd7dd7f9be9` | 4 | 92×92 | **12** |

### Projet Shaka Zulu

| Nom | ID | Directions | Canvas | Animations |
|-----|----|-----------|--------|------------|
| **Shaka Zulu** | `e8c38444-1739-42a5-86ae-40fa0950e947` | 4 | 92×92 | 11 |
| **Zulu Warrior** | `33e221bd-5b9c-4e55-b729-cfeb534c1bd1` | 4 | 92×92 | 10 |
| **Nandi** | `12715dae-591c-4387-ba0b-419fcf44dd4f` | 4 | 92×92 | 8 |

### Projet Mansa Moussa

| Nom | ID | Directions | Canvas | Animations |
|-----|----|-----------|--------|------------|
| **Mansa Moussa** | `0a167efc-1abd-48ae-9c81-f77ad243f80d` | 4 | 92×92 | 4 |
| **Chameau Mali** | `0b93031f-4df6-40ad-8a65-240229d127ff` | 4 | 92×92 | 2 |
| **Soldat Mali** | `d378d0f2-2704-4f4e-bf60-3a8475b2fb16` | 4 | 92×92 | 2 |
| **Porteur Mali** | `5d667d1e-8a3e-4b53-903e-28da88200ec4` | 4 | 92×92 | 2 |

### Projet Peste 1347

| Nom | ID | Directions | Canvas | Animations | Fichiers locaux |
|-----|----|-----------|--------|------------|-----------------|
| **Mansa Souleymane** | `eb3d1a3e-4fdb-4a73-9b14-f4f6106d8c23` | 4 | 92×92 | walk east+west (6f) | `public/atlas/peste-1347/assets/characters/souleymane/` |
| **Souleymane trônant** (state) | `cb6d0d56-...` | 4 | 92×92 | aucune | `public/atlas/peste-1347/assets/characters/souleymane-throne/` — state de `eb3d1a3e` |
| **Marchand berbère assis** | `e2e06a90-...` | 4 | 92×92 | aucune | `public/atlas/peste-1347/assets/characters/marchand-assis/rotations/` — marché Tombouctou |

### Personnages génériques (réutilisables tous projets)

| Nom | ID | Directions | Canvas | Animations |
|-----|----|-----------|--------|------------|
| medieval peasant man (64px) | `c328bd8c-...` | 4 | 64×64 | 4 |
| medieval merchant (64px) | `190effe1-...` | 4 | 64×64 | 4 |
| medieval monk (64px) | `c2923dcd-...` | 4 | 64×64 | 3 |
| medieval peasant woman (64px) | `99eb124f-...` | 4 | 64×64 | 4 |
| Child | `da1c3676-...` | 4 | 48×48 | 4 |

---

## OBJECTS (list_objects) — Assets Hannibal

| Nom court | ID | Canvas | Animations | Usage |
|-----------|----|--------|------------|-------|
| **Éléphant-radeau v2** (mahout sur radeau) | `a2671d9a-1123-4401-aecb-84e565a607a6` | 128×80 | aucune | Beat 2 traversée Rhône — **PRINCIPAL** |
| **Éléphant-radeau v3** (en cours) | `b8adb9b0-24e2-4376-a095-a13ca60aaeb0` | 128×80 | en cours | Beat 2 — variante améliorée |
| **Éléphant guerre walk+dying** | `ff504818-96ce-4060-8b06-0c7366a7032e` | 160×120 | **3** : dying, walk, exhausted | Beat 3/4/5 |
| **Éléphant guerre collapsing** | `afc0cd85-bc37-4f10-8901-fae270619b98` | 160×120 | **2** : collapsing dead (17f), collapsing dead (13f) | Beat 4/5 decay |
| **Éléphant neige** (neige sur corps) | `ce025aba-7bc9-41a5-a875-d98757becd2e` | 160×120 | 1 : collapsing forward | Beat 3/4 Alpes |
| Aigle romain | `fb9aec3e-...` | 32×48 | — | Beat 1 Rome |
| Drapeau carthaginois | `951055a7-...` | 32×48 | — | Beat 1 Carthagène |
| Montagnes Alpes | `4a7ec3bd-...` | 128×64 | — | Beat 3 |
| Rome Colisée | `f4e97ebe-...` | 96×96 | — | Beat 1/5 |
| Port Carthage | `a833a260-...` | 96×96 | — | Beat 1 |
| Montagnes neigeuses larges | `4ffcbb5d-...` | 320×128 | — | Beat 3 insert |

---

## OBJECTS — Autres projets (réutilisables)

| Nom court | ID | Canvas | Projet |
|-----------|----|--------|--------|
| Camel caravan | `2c28d3b1-...` | 96×96 | Mansa Moussa |
| Gold ingots | `426f893f-...` | 96×96 + anim | Empire Ghana |
| Gold coins | `ce18c5e7-...` | 48×48 | Empire Ghana |
| Salt slab | `fb6feb1c-...` | 96×96 | Empire Ghana |
| Merchant scale | `6e913880-...` | 96×96 | Empire Ghana |
| West African city | `4f150fa8-...` | 112×112 + anim | Empire Ghana |
| **Rat noir médiéval** | `e2e541a8-675e-4b52-9d51-772687d452fc` | 32×32 | Peste 1347 — vecteur visuel | `public/atlas/peste-1347/assets/objects/rat-noir.png` — anim 4f scurry → `rat-anim/` (via `animate_with_text`) |
| **Bateau génois** | `0d101547-4921-4966-930d-3dfdbd4c37ec` | 64×48 | Peste 1347 — navire Crimée→Sicile | `public/atlas/peste-1347/assets/objects/bateau-genois.png` — anim 4f rocking → `bateau-anim/` f2/f3 avec voiles (f0/f1 sans voiles, à éviter) |
| **Mosquée Tombouctou** | `53d88ecb-...` | — | 64×64 | Peste 1347 — Mali vivant | `public/atlas/peste-1347/assets/objects/mosquee-tombouctou.png` |
| **Ville européenne deuil** | `8b6e61d2-...` | — | 64×48 | Peste 1347 — Europe frappée | `public/atlas/peste-1347/assets/objects/ville-europeenne-deuil.png` |

---

## Fichiers téléchargés localement

### `public/hannibal/assets/characters/hannibal-v4a/` — CANONIQUE validé Aziz
- `rotations/east.png` + 7 autres directions
- `animations/animating-c596874c/east/frame_000-007.png` — fight-stance-idle (8f)
- `animations/animating-e377f577/east/frame_000-005.png` — walking-6-frames east
- `animations/animating-e377f577/north/frame_000-005.png` — walking-6-frames north

### `public/hannibal/assets/characters/volque/`
- `rotations/south.png` + east, north, west
- `animations/animating-3cc254d2/south|west/frame_000-007.png` — fight-stance-idle (8f)
- `animations/he_raise_his_spear_in_the_air_and_shout_a_war_cry-363da147/south/frame_000-008.png` — war cry (9f)

### `public/hannibal/assets/characters/numide/`
- `rotations/south.png` + east, north, west
- `animations/running-140cdb93/east|north/frame_000-005.png` — running-6-frames

### `public/hannibal/assets/map-objects/elephant-radeau/`
- `elephant-radeau-v2-base.png` — mahout + radeau v2 (128×80) = object `a2671d9a`
- `elephant-radeau-v3-base.png` — mahout + radeau v3 (128×80) = object `b8adb9b0`
- Animations v2 : walk-on-raft-A (9f) + float-on-raft-B (9f) → à télécharger frame par frame

### `public/hannibal/assets/`
- `elephant-radeau.png` — version statique originale (= v2 base sans animations)

### `public/hannibal/assets/map-objects/`
- `aigle-romain.png` = object `fb9aec3e`
- `carthagene-port.png` = object `a833a260`
- `drapeau-carthaginois.png` = object `951055a7`
- `feuille-automne.png` = object `9346c087`
- `pyrenees-montagnes.png` = object `4a7ec3bd`
- `rome-city.png` = object `f4e97ebe`

### `public/_lab-hannibal/sprites/` — ANCIEN (pré-Beat1, garder pour référence)
- `hannibal/east.png` — Hannibal v4c (remplacé par v4a canonique)
- `elephant-alive-v3.png` — éléphant statique howdah rouge → Beat 5 decay
- `elephant-dying-sheet.png` — spritesheet mort (source : object `afc0cd85`) → Beat 4/5

---

## Capacités MCP PixelLab — complètes (validé 2026-05-16)

> Toutes ces capacités sont disponibles via MCP. Rien n'est limité à l'interface web.

### States — `create_character_state` / `create_object_state` ⭐ SOUS-UTILISÉ

**La capacité la plus puissante et la plus sous-utilisée.** Partir d'un personnage canonique et dériver N variantes sans recréer from scratch. Garantit la cohérence visuelle et coûte 0 crédit supplémentaire de création (juste le rendering).

```
create_character_state(character_id="<ID canonique>", edit_description="sitting on throne")
create_object_state(object_id="<ID objet>", edit_description="add moss, ruined version")
```

**Cas d'usage concrets :**
- Personnage debout → state assis, blessé, en armure différente, tenant un objet, vieilli
- Bâtiment intact → state en ruines, en construction, de nuit
- Rat statique → state qui court
- Bateau → state avec voiles déployées

**Règle** : toujours partir du canonique. Ne JAMAIS régénérer un personnage existant from scratch si un state suffit. Drift de style = 0 avec les states.

### Animations objets — `animate_object`

Disponible pour tous les map objects. Description libre (pas de template fixe).
- Frame count : 4 à 16 frames
- ~30-60s par direction
- Exemple : `animation_description="rocking gently on waves, drifting left"`

### Génération par référence image

- `create_map_object` avec `background_image` → nouvel asset qui match le style visuel de l'image fournie
- `create_character` en mode `pro` → référence image pour cohérence maximale (coût : 20-40 crédits)

---

## Règle anti-doublon (NON-NÉGOCIABLE)

1. **Ouvrir ce fichier en premier** avant tout `create_character` ou `create_map_object`
2. Si asset similaire existe → utiliser l'ID PixelLab directement (`animate_object`, `animate_character`)
3. Si variante d'un asset existant → **utiliser `create_character_state` ou `create_object_state`** — jamais régénérer
4. Si asset local PNG existe → vérifier `public/hannibal/` et `public/_lab-hannibal/` avec `ls`
5. Mettre à jour ce fichier après chaque nouvelle génération (ID + description + canvas + animations)
