# Hannibal — Index Assets (source de vérité)

> Lire ce fichier AVANT toute génération PixelLab pour Beat Hannibal.
> Mis à jour : 2026-05-05

---

## `public/hannibal/assets/` — Assets de production

| Fichier | Description | Utilisé dans |
|---------|-------------|--------------|
| `elephant-radeau.png` | Éléphant de guerre avec mahout sur radeau de bois, vue profil, pixel art | Beat 2 (traversée Rhône) |

## `public/hannibal/assets/map-objects/` — Objets carte

| Fichier | Description | Utilisé dans |
|---------|-------------|--------------|
| `soldats-carthaginois.png` | Groupe 3-4 soldats puniques en rang, vue profil droit, tuniques sombres + boucliers ronds + lances, 96×96px | Beat 2 (rive gauche derrière Hannibal) |
| `radeau-vide.png` | Radeau de bois vide (logs + corde), vue profil, 64×64px — plus petit que elephant-radeau pour effet de distance | Beat 2 (arrière-plan mid-river) |
| `aigle-romain.png` | Aigle SPQR romain, vue profil, pixel art | Beat 1 (label Rome) |
| `carthagene-port.png` | Port de Carthagène, vue haute, pixel art | Beat 1 (optionnel) |
| `drapeau-carthaginois.png` | Drapeau punique, vue côté, pixel art | Beat 1 (label Carthagène) |
| `feuille-automne.png` | Feuille automne | Beat 1 (ambiance) |
| `pyrenees-montagnes.png` | Massif Pyrénées, vue côté, pixel art | Beat 1 (freeze Pyrénées) |
| `rome-city.png` | Silhouette Rome / Colisée, pixel art | Beat 1 (label Rome) |

## `public/_lab-hannibal/sprites/` — Sprites personnages (lab)

| Fichier | Description | Utilisé dans |
|---------|-------------|--------------|
| `hannibal/east.png` | Hannibal vue est (profil droit) | Beat 1 (sprite Carthagène) |
| `hannibal/north.png` | Hannibal vue nord | — |
| `hannibal/south.png` | Hannibal vue sud | — |
| `hannibal/west.png` | Hannibal vue ouest (profil gauche) | — |
| `hannibal/north-east.png` | Hannibal vue NE | — |
| `hannibal/north-west.png` | Hannibal vue NO | — |
| `hannibal/south-east.png` | Hannibal vue SE | — |
| `hannibal/south-west.png` | Hannibal vue SO | — |
| `elephant-alive-v3.png` | Éléphant de guerre vivant (howdah rouge/or), vue profil | Beat 5 (grille decay) |
| (dans `characters/soldat-carthaginois/`) | Soldat punique 4 directions (east/south/west/north), 68×68px, tunique sombre + bouclier rond + lance, flat shading | Beat 2 (ref Seedance rive gauche) |
| `elephant-dying-sheet.png` | Spritesheet éléphant mourant | Beat 5 (decay animation) |
| `elephant-dying.gif` | GIF éléphant mourant (source spritesheet) | Référence only |

## `public/_lab-hannibal/sfx/` — SFX

| Fichier | Durée | Utilisation |
|---------|-------|-------------|
| `blip-bubble-trimmed.mp3` | 0.3s | Déclenchement FocusBubble |
| `blip-bubble.mp3` | 0.5s | Source brute (fallback) |
| `stat-tick-trimmed.mp3` | 0.2s | Apparition StatGauge |
| `stat-tick.mp3` | 0.5s | Source brute (fallback) |

---

## Assets encore à générer

| Beat | Asset | Priorité |
|------|-------|----------|
| Beat 2 | Cavalier numide (sprite 64px, vue profil) | Optionnel (label suffit) |
| Beat 2 | ✅ soldats-carthaginois.png | GÉNÉRÉ 2026-05-05 |
| Beat 2 | ✅ radeau-vide.png | GÉNÉRÉ 2026-05-05 |
| Beat 3 | Rocher avec fissure (insert vinaigre) | Beat 3 Sub-3 |
| Beat 3 | Montagne Alpes overlay (map-object) | Beat 3 |
| Beat 5 | Éléphant mort/gelé (état 3 pour decay) | Beat 5 |

---

## Règle anti-régénération

**AVANT tout `create_map_object` ou `create_character` Hannibal :**
1. Lire ce fichier
2. Vérifier `public/hannibal/assets/`, `public/hannibal/assets/map-objects/`, `public/_lab-hannibal/sprites/`
3. Si l'asset existe → utiliser directement, zéro dépense PixelLab
