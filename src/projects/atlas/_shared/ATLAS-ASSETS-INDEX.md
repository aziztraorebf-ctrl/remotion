# ATLAS — ASSETS INDEX (sprites PixelLab, map-objects, données géo)

> Inventaire de TOUS les assets visuels Atlas. Le différentiel Atlas = les sprites PixelLab (acteurs).
> Vérifié sur disque 2026-06-03. Carte maître : `ATLAS-INDEX-DES-INDEX.md`. IDs PixelLab : `memory/tools/PIXELLAB-MASTER-INDEX.md`.
> **AVANT de générer un sprite** : chercher ICI un perso réutilisable. Régénérer coûte du temps + des crédits.

Convention sprites : `public/<episode>/characters/<perso>/animations/<anim>/<dir>/frame_NNN.png` + `static-<dir>.png`.
⚠️ **2 conventions de nommage d'anims** : Mansa = noms propres (`walk_cycle`, `royal_pose`). Ghana/Hannibal/Shaka/Peste = noms PixelLab avec HASH (`animating-63b90882`, `walking-b8b230ef`) → lire le dossier réel pour le nom exact.

---

## SPRITES PERSONNAGES (19 persos / ~568 fichiers / 5 épisodes)

### Mansa Moussa — `public/atlas-mansa-moussa/characters/` (restauré 2026-06-03)
| Perso | Frames | Animations | Dirs | Note |
|---|---|---|---|---|
| `mansa-moussa` | 16 | walk_cycle, royal_pose | E,W (walk) ; S (pose) | couronné, robe or. Protagoniste (size 64) |
| `porteur-mali` | 12 | walk_cycle | E, W | porteur de bagages |
| `soldat-mali` | 12 | walk_cycle | E, W | escorte |
| `chameau` | 8 | walk_cycle | E, W | animal (cycle 4f) |

### Empire Ghana — `public/empire-ghana/characters/` (182 f, le plus riche)
| Perso | Frames | Animations | Note |
|---|---|---|---|
| `berbere` | 60 | crouching, walking, animating | commerçant Nord (silent barter Beat3). 4 dirs |
| `sahelien` | 60 | animating, walking, crouching | commerçant Sud (symétrique berbère). 4 dirs |
| `sundiata` | 14 | walking, war-cry (raising sword), animating | leader Mande (formation Beat4), zIndex doré |
| `guerrier-almoravide` | 6 | animating | envahisseur (Beat4) |
| `epeiste` | 6 | animating | membre formation Mande |
| `lancier` | 6 | animating | membre formation Mande |

### Hannibal — `public/hannibal/characters/` + `assets/map-objects/`
| Perso | Frames | Animations | Note |
|---|---|---|---|
| `hannibal-v4a` | 20 | animating (×2 : fight-idle, walking) | CANONIQUE validé Aziz 2026-05-05, 8 dirs, 92×92 |
| `volque` | 25 | animating, war-cry (raise spear) | Beat2 |
| `numide` | 12 | running | cavalier Beat2 |
| `soldat-carthaginois` | static | — | 4 directions statiques |
| **Map-objects** | — | — | aigle-romain, carthagene-port, drapeau-carthaginois, elephant-radeau (v2/v3), feuille-automne, pyrenees-montagnes, radeau-vide, rome-city, soldats-carthaginois |

### Shaka Zulu — `public/atlas-shaka-zulu/characters/` (320 f total avec assets)
| Perso | Frames | Animations | Note |
|---|---|---|---|
| `shaka` | 64 | animating (×2), walking | 92×92 |
| `warrior` | 32 | animating, walking | guerrier zoulou |
| `nandi` | 44 | animating, falling_backward | mère de Shaka (S4 deuil) |

### Peste 1347 — `public/atlas/peste-1347/assets/characters/` + `objects/`
| Perso/Objet | Frames | Animations | Note |
|---|---|---|---|
| `souleymane` | 12 | walk | + `souleymane-throne` (static) |
| `porteur-mali` | 12 | walk | (≠ celui de Mansa) |
| `marchand-berbere` | 8 | walk | + `marchand-assis` (static, rotations) |
| `cheval-bat` | 4 | walk | monture |
| `ane-caravane` | 4 | walk | monture |
| **Objets animés** | 4 | — | rats (scurry), bateaux (rocking), villes (Paris/Londres/Stockholm/Caire v1+v2), marché-tombouctou |

---

## DONNÉES GÉO (paths d3-geo précalculés)

> Source brute : `data/geo/`. Copies projet : `src/projects/atlas/_shared/`. Basemaps universelles : `public/_shared/geo-data/`.

| Fichier | Taille | Épisode / Zone |
|---|---|---|
| `data/geo/empire-ghana-data.json` | 3.4 MB | Empire Ghana (Sahel, routes caravanes, villes) |
| `data/geo/atlas-v2-data.json` | 2.3 MB | Mansa Moussa (Mali, Égypte, route pèlerinage) — copie dans `_shared/` et `_reference/` |
| `data/geo/hannibal-data.json` | 723 KB | Hannibal (Méditerranée, 4 vues : context/south/alpes/italia) |
| `data/geo/shaka-zulu-data.json` | 345 KB | Shaka Zulu (Afrique du Sud, 3 projections) — copie dans `_shared/` |
| `data/geo/africa-cta-paths.json` | 202 KB | Pan-African (corridors continentaux, CTA) |
| `data/geo/nouvelle-france-data.json` | 363 KB | (proto Québec/Canada) |
| `src/projects/atlas/_shared/atlas-globe-data.json` | 1.3 MB | Globe orthographique (hooks épisodes) |
| `public/_shared/geo-data/countries-50m.json` | 756 KB | TopoJSON monde entier (Natural Earth 50m) — utilisé Cannes/Hannibal R&D |
| `public/_shared/geo-data/world_1300.geojson` | 1 MB | Monde historique 1300 (Peste) |
| `public/_shared/geo-data/us-48states.json` | 104 KB | USA (SurfaceComparison) |

---

## ASSETS DIVERS

| Type | Fichiers | Chemin |
|---|---|---|
| Icônes Mansa | icon-book, icon-mosque (+ -raw, -pixel), gizeh-medallion, pile-of-gold | `public/atlas-mansa-moussa/assets/` |
| Portraits Mansa | mansa-portrait-A-v2-canonique, mansa-portrait-B-v2-canonique-trone (JPEG 1024²) | `public/atlas-mansa-moussa/assets/` |
| Chibi caravane | caravane-A/B/C, caravane-transparent (pour AtlasCaravane) | `public/atlas-mansa-moussa/v2/chibi/` |
| Refs perso (Gemini) | mansa-moussa-* (character sheets) | `public/assets/geoafrique/characters/` + `public/_shared/refs/characters/moussa/` |
| SFX | whoosh, war-cry, drum, chime, coins... | `public/_shared/sfx/` (index : SFX-INDEX.md) |

---

## ⚠️ Orphelins / à ranger (vérifié 2026-06-03)

- `src/_archive/atlas-shared-orphans/` (ChapterNumber, atlas-flags, atlas-shared-defs) — **0 import vivant**, code mort archivé. Garder comme réf historique ou supprimer.
- `public/_lab-hannibal/sprites/` (15 f) — réf pré-PixelLab, remplacé par hannibal-v4a. Archivable.
- `public/atlas-shaka-zulu/archive/` (25 f) — anciennes versions test.

## Pipeline génération (rappel)

Avant de générer un nouveau sprite : (1) chercher ici un perso réutilisable ; (2) sinon `create_character_state` depuis un canonique proche (zéro drift de style) ; (3) sinon `create_character` + `animate_character` via MCP PixelLab. Règle async : `sleep 120` après animate. Doctrine intégration : `ATLAS-PIXELLAB-PLAYBOOK.md`.
