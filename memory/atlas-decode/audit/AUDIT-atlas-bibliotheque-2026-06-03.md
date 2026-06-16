# AUDIT BIBLIOTHÈQUE ATLAS — 2026-06-03 (3 agents // + vérif Claude)

> But : reconstruire une bibliothèque de templates Atlas robuste, organisée comme Souverain.
> Méthode : 3 agents Explore (code / assets / docs) + vérifications Claude avant toute action.
> Décision Aziz : NETTOYER doublons/périmés AVANT de cataloguer.

## RÉSUMÉ — Atlas a la MATIÈRE, pas l'ORGANISATION

- **13 blueprints validés** (`_blueprints/`, 8 fondamentaux + 5 avancés extraits de prod Ghana).
- **8 composants partagés** robustes (`_shared/`) + helpers caméra 2-couches + geoUtils (8 projections).
- **~568 fichiers sprites PixelLab, 19 personnages** sur 5 épisodes (TRÉSOR non catalogué) :
  - Mansa Moussa : 4 persos (61 f) · **Empire Ghana : 6 persos (182 f)** · Hannibal : 4 persos + 10 map-objects · Shaka Zulu : 3 persos (320 f) · Peste 1347 : 6 persos + objets animés.
- **11 JSON géo** (data/geo/ + _shared/ + public/_shared/geo-data/).

Ce qui MANQUE vs Souverain : carte-maître (INDEX-DES-INDEX Atlas), format "quand Aziz dit...",
ATLAS-ASSETS-INDEX, règles anti-doublon explicites.

## ⚠️ NETTOYAGE — réalité VÉRIFIÉE par Claude (≠ ce que les agents ont dit)

Les agents ont sur-diagnostiqué des "doublons". Vérification md5/diff/usage :

| Item | Diagnostic agent | RÉALITÉ vérifiée | Action |
|---|---|---|---|
| `atlas-v2-data.json` _shared vs _reference | doublon | **md5 IDENTIQUE** (2.3MB ×2) | VRAI doublon → dédupliquer (garder 1, importer depuis) |
| `_shared/atlas-components.tsx` (1009L) vs `_reference/atlas-v2-components.tsx` (686L) | "merger" | **403 lignes DIFFÉRENTES, 2 versions distinctes**. _shared utilisé par peste-1347 + blueprints (8 fichiers) ; _reference par 11 scènes Mansa | NE PAS merger (casserait Peste OU Mansa). Garder séparés, documenter v1/v2 |
| `atlas-flags.tsx` / `atlas-shared-defs.tsx` | "doublon _shared" | **N'existent QUE dans _reference** (pas dans _shared) + copie dans `_archive/atlas-shared-orphans/` | Pas un doublon actif. Orphans = à ranger |
| `ChapterNumber.tsx` | orphelin jamais importé | Dans `_archive/atlas-shared-orphans/` | Vérifier 0 import puis supprimer/ranger |

**LEÇON** : ne jamais "merger" sur recommandation d'audit sans md5/diff/grep-usage. Les noms
proches (atlas-components vs atlas-v2-components) cachaient 2 versions vivantes distinctes.

## CONTRADICTION PÉRIMÉE confirmée

`ATLAS-COMPOSANTS.md:118` dit "AtlasCaravane : walk cycle multi-frames = bug bbox → 1 frame unique".
MAIS `AtlasPixelChar` (Mansa Moussa, production validée) FAIT du walk cycle multi-frames qui marche.
→ La règle visait `AtlasCaravane` (sprite PNG sur path Bezier), pas le pattern frame-PNG d'AtlasPixelChar.
Action : clarifier — 2 patterns sprites distincts (AtlasCaravane chibi 1-frame+hop / AtlasPixelChar frames-PNG walk).

## EXTRACTION recommandée (archive → _shared), à valider au cas par cas

- `AtlasPixelChar` (_reference → _shared) : composant sprite socle, utilisé en prod.
- Shaka : `MourningWarp`, `CornesFrame`, `PaperGrain` (archive → _shared) si réutilisables cross-épisode.
- Inserts charts Mansa (`AtlasInsertPie/Bar/Line`) (_reference → _shared).
- MAIS : vérifier imports AVANT extraction (ne pas casser les scènes sources).

## CIBLE D'ORGANISATION (après nettoyage) — miroir Souverain

1. `src/projects/_shared/INDEX-DES-INDEX.md` (carte maître Atlas) — À CRÉER
2. `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` (format "quand Aziz dit...") — À CRÉER
3. `ATLAS-COMPOSANTS.md` → réduit à doc technique + imports (pointe vers INDEX)
4. `ATLAS-ASSETS-INDEX.md` (les 568 sprites + 11 JSON géo + map-objects) — À CRÉER ⭐
5. Doctrine déjà en place : `memory/doctrines/ATLAS-PLAYBOOK.md` + `ATLAS-PIXELLAB-PLAYBOOK.md` + `ATLAS-BEAT-DEMARRAGE.md`.
6. `_blueprints/README.md` conservé (excellent).

## Sprites PixelLab — détail par épisode (pour le futur ATLAS-ASSETS-INDEX)

Convention : `public/<episode>/characters/<perso>/animations/<anim>/<dir>/frame_NNN.png` + `static-<dir>.png`.
- **Mansa Moussa** `public/atlas-mansa-moussa/` : mansa-moussa (walk+royal_pose, couronné), porteur-mali, soldat-mali, chameau.
- **Empire Ghana** `public/empire-ghana/` : berbère, sahélien (walk/crouch/anim), almoravide, épéiste, lancier, Sundiata (walk+war-cry). 182 f.
- **Hannibal** `public/hannibal/` : hannibal-v4a (CANONIQUE, fight-idle/walking, 8 dirs), volque (fight/war-cry), numide (run), soldat-carthaginois. + 10 map-objects.
- **Shaka Zulu** `public/atlas-shaka-zulu/` : shaka, zulu-warrior, nandi (92×92). 320 f.
- **Peste 1347** `public/atlas/peste-1347/` : souleymane (+throne), marchand-assis, porteur-mali, cheval-bat, ane-caravane + objets animés (rats, bateaux, villes).
- Index PixelLab existant : `memory/tools/PIXELLAB-MASTER-INDEX.md` (~50 IDs).
