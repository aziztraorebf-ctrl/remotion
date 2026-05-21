# Atlas Peste 1347 — Références i2i pour génération PixelLab

## Villes (cities-v2/)
| Ville | Asset | Référence i2i obligatoire |
|-------|-------|--------------------------|
| caire | cities-v2/caire/static.png | — (original, source de référence) |
| paris | cities-v2/paris/static.png | cities-v2/caire/static.png (régénéré 2026-05-17, palette chaude) |
| stockholm | cities-v2/stockholm/static.png | cities-v2/caire/static.png (régénéré 2026-05-17, palette chaude) |
| londres | cities-v2/londres/static.png | cities-v2/caire/static.png |

## Règle
Toute nouvelle ville générée via PixelLab DOIT utiliser `caire/static.png` comme `background_image`.
Ne jamais générer sans ref i2i — palette sombre garantie sans elle.

## Objets (objects/)
| Objet | Asset | Référence i2i |
|-------|-------|--------------|
| rat-anim | objects/rat-anim/ | — (PixelLab side view) |
| bateau-genois | objects/bateau-genois/ | cities-v2/caire/static.png |
| marche-tombouctou | objects/marche-tombouctou/static.png | objects/mosquee-tombouctou.png (généré 2026-05-17) |

## Characters Beat5 (characters/)
| Personnage | Asset | Notes |
|-----------|-------|-------|
| marchand-berbere | characters/marchand-berbere/rotations/east|west|south.png | 68×68px, robe bleue indigo |
| marchand-berbere walk | .../animations/walk/east|west/frame_000-003.png | 4 frames, walking-4-frames template |
