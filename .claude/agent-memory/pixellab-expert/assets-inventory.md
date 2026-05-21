---
name: pixellab-assets-inventory
description: Inventaire complet assets PixelLab par projet — chemins locaux confirmés + IDs PixelLab + état animations
metadata:
  type: reference
---

# Inventaire Assets PixelLab — Source de Vérité Locale

> Initialisé 2026-05-16 depuis audit filesystem.
> Compléter le PIXELLAB-MASTER-INDEX avec les données confirmées localement.
> RÈGLE : les fichiers locaux priment sur les IDs PixelLab (qui peuvent expirer).

---

## Projet Mansa Moussa
Base : `quebec-jacques-poc/public/atlas-mansa-moussa/characters/`

| Personnage | Canvas | Walk dirs | Walk frames | Static dirs | PixelLab ID |
|-----------|--------|-----------|------------|------------|------------|
| chameau | 92×92 | E + W | 4f | E, S, W | `0b93031f-4df6-40ad-8a65-240229d127ff` |
| mansa-moussa | 92×92 | E + W | 6f | E, N, S, W | `0a167efc-1abd-48ae-9c81-f77ad243f80d` |
| porteur-mali | 92×92 | E + W | 6f | E, S, W | `5d667d1e-8a3e-4b53-903e-28da88200ec4` |
| soldat-mali | 92×92 | E + W | 6f | E, S, W | `d378d0f2-2704-4f4e-bf60-3a8475b2fb16` |

Mansa a aussi : `animations/royal_pose/south/` (4f)
Walk cycle path convention : `animations/walk_cycle/{east,west}/frame_NNN.png`

---

## Projet Empire Ghana
Base : `public/empire-ghana/characters/`

| Personnage | Canvas | Walk dirs | Walk frames | Autres animations | PixelLab ID |
|-----------|--------|-----------|------------|-------------------|------------|
| berbere | 92×92 | E+N+S+W | 6f (walking-b8b230ef) | crouching 5f (4 dirs), idle 4f (4 dirs) | `79865794-abb1-4509-b6d7-580f87acbc4c` |
| sahelien | 92×92 | E+N+S+W | 6f (walking-3848d070) | crouching 5f (4 dirs), idle 4f (4 dirs) | `ef9ac272-1389-430d-9e94-dbd7dd7f9be9` |
| epeiste | 132×132 | N only | 6f (animating-58bffda0/north) | — | `640ee1ea-f713-49f6-bef9-7e63deebfb45` |
| guerrier-almoravide | 132×132 | S only | ? (animating-6c924926/south) | — | `29659962-898a-4257-be22-1039da8e41f5` |
| lancier | 132×132 | N only | ? (animating-ae8b3773/north) | — | `dd124f43-1f55-421d-ad7b-29d308f0155a` |
| sundiata | 132×132 | N + S | walk north (6f), war cry south, idle north | — | `46e4511f-c330-4246-a7c6-25239a264ecc` |

**NOTE** : epeiste/guerrier/lancier/sundiata = 132×132. Trop grands si carte utilise 92×92 scale. Réserver aux inserts plein écran.

### Map Objects Empire Ghana
Base : `public/empire-ghana/assets/pixellab/`

| Objet | Canvas | Animé ? |
|------|--------|---------|
| caravane-chameau.png | 96×96 | non |
| mosquee-banco.png | inconnu | non |
| niani-mali.png | inconnu | non |
| stand-marche.png | inconnu | non |
| sac-or.png | inconnu | non |
| gold-ingot-stack.png | inconnu | non |
| balance-commerciale.png | inconnu | non |
| pieces-or-dinars.png | inconnu | non |
| sac-sel.png | inconnu | non |
| bloc-sel-mine.png | inconnu | non |
| koumbi-saleh.png | inconnu | oui (koumbi-saleh-sheet.png) |
| ruines-banco.png | inconnu | non |
| seal-wagadou.png | inconnu | non |
| guerrier-almoravide.png | inconnu | non |
| balance-commerciale.png | inconnu | non |

---

## Projet Hannibal
Base : `public/hannibal/assets/characters/`

| Personnage | Canvas | Walk/Run dirs | Animations | PixelLab ID |
|-----------|--------|--------------|-----------|------------|
| hannibal-v4a | 92×92 | E+N (6f walking) | fight-idle E (8f), war cry S | `4ae3e075-a091-4089-befc-c0f35fd0559d` |
| volque | 68×68 | — | fight-idle S+W (8f), war cry S (9f) | `b1baec1b-9772-4d7b-892d-1f202ca1a88a` |
| numide | 68×68 | E+N (6f running) | — | `34ce6ecf-683c-42f9-a36b-0f5b5fb8edb0` |
| soldat-carthaginois | inconnu | — | 4 rotations only | inconnu |

### Map Objects Hannibal

| Objet | Canvas | ID |
|------|--------|---|
| elephant-radeau v2 | 128×80 | `a2671d9a-1123-4401-aecb-84e565a607a6` |
| elephant-radeau v3 | 128×80 | `b8adb9b0-24e2-4376-a095-a13ca60aaeb0` |
| elephant guerre walk+dying | 160×120 | `ff504818-96ce-4060-8b06-0c7366a7032e` |
| elephant guerre collapsing | 160×120 | `afc0cd85-bc37-4f10-8901-fae270619b98` |
| elephant neige | 160×120 | `ce025aba-7bc9-41a5-a875-d98757becd2e` |

---

## Projet Shaka Zulu
Base : `public/atlas-shaka-zulu/characters/`

| Personnage | Canvas | Walk dirs | Animations | PixelLab ID |
|-----------|--------|-----------|-----------|------------|
| shaka | 92×92 | E+N+S+W (walking-ba529e39, 4f) | idle N+S+E+W (4f, animating-d4924c9b), combat N+S+W (animating-a04dc52d) | `e8c38444-1739-42a5-86ae-40fa0950e947` |
| warrior | 92×92 | E+N+S+W (walking-38346bae) | combat E+W (animating-f35b625f) | `33e221bd-5b9c-4e55-b729-cfeb534c1bd1` |
| nandi | 92×92 | E+N+S+W (animating-e5cc38bb) | falling backward EWSN (falling_backward-7d44c51e) | `12715dae-591c-4387-ba0b-419fcf44dd4f` |

---

## Chameau — deux versions disponibles

1. **Mansa Moussa chameau** (`quebec-jacques-poc/`) : 92×92, walk E+W (4f), static E+S+W. PRINCIPAL.
2. **Empire Ghana chameau** (`public/empire-ghana/assets/pixellab/chameau/`) : 64×64, walk E only (4f).
3. **Empire Ghana caravane-chameau.png** : 96×96, statique composite (chameau + cargaison).

Recommandation : utiliser le Mansa Moussa chameau (92×92) pour Peste 1347 — même style, même projet.
