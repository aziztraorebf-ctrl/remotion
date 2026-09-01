# Beat 1 — Contexte 218 av. J.-C. — VALIDÉ (2026-05-05)

> Migré depuis auto-memory 2026-08-31. Récap découvertes techniques Beat 1 (v1→v10d).
> État global de l'épisode : voir `STATUS.md` (épisode en PAUSE).

## Livrable final

- **Fichier** : `src/projects/atlas/hannibal/scenes/Beat1Context.tsx`
- **Render validé** : `out/hannibal/beat1-v10d.mp4` / https://files.catbox.moe/szdc57.mp4
- **Durée** : ~13s (BEATS.beat1 dans `timing.ts`)
- **Branche** : `lab/hannibal-rpg-patterns`

## Ce que montre Beat 1

Vue large Méditerranée 218 av. J.-C. → zoom Carthagène sur "Hannibal Barca" → whiplash Rome sur "Rome" (1-2s) → retour Carthagène → route tracée vers Pyrénées sur "Il choisit le nord" → freeze Pyrénées sur "les Alpes".

## Architecture validée (2 couches — standard Atlas depuis 2026-05-05)

- **Couche 1** : SVG 720×1280 viewBox, `<g transform="translate/scale">` pour zoom caméra
- **Couche 2** : Assets CSS positionnés via `svgToComp()` importé depuis `_shared/`
- **Zoom 2.8x** : standard POI. Focus offset -100px pour Rome (bord droit canvas)
- **Timings** : calés sur `hannibal-alignment.json` word-level Whisper

## Timings clés (frames relatifs Beat 1)

| Frame | Mot narration | Événement caméra |
|-------|--------------|-----------------|
| +0    | "Nous sommes..." | Vue large 1.0x |
| +75   | (avant "Hannibal") | Zoom Carthagène commence |
| +110  | peak | Hold Carthagène 2.8x |
| +230  | "Rome" | Whiplash Rome |
| +255  | peak Rome | Hold Rome 2.8x |
| +278  | "au sud" | Retour Carthagène |
| +304  | "Il choisit le nord" | Route commence à se tracer |
| +349  | "les Alpes" | Freeze Pyrénées 2.5x |

## Itérations (v1→v10)

v1-v5 : architecture 1 couche — sortie de cadre dès zoom > 1.35x sur Rome (x=775 bord droit)
v6-v9 : tentatives de fix offset dans SVG — aucune ne fonctionnait proprement
**v10** : architecture 2 couches (pattern Beat3Barter, cf. `archive/episodes-livres/empire-ghana/BEAT-3-COMPLETE.md`) — résolu en 1 itération
**v10d** : timings recalés sur Whisper + focus offset Rome formalisé → validé Aziz

**Leçon** : 10 itérations = R&D normal pour premier beat qui établit un pattern. Les suivants sont bien plus rapides une fois le pattern extrait.

## Ce qui a été extrait vers `_shared/` pendant cette session

| Fonction | Fichier | Utilité |
|----------|---------|---------|
| `svgToComp()` | `_shared/atlas-components.tsx` | Convertit coords SVG → CSS avec zoom |
| `focusOffsetForPOI()` | `_shared/atlas-components.tsx` | Décale focus pour POI bord canvas |
| `getSpriteAnimFrame()` | `_shared/atlas-components.tsx` | Walk cycle modulo |
| `getSpriteClipPath()` | `_shared/atlas-components.tsx` | ClipPath spritesheet |
| Constantes `ATLAS_SVG_W/H/CX/CY/CSS_SCALE` | `_shared/atlas-components.tsx` | Évite redéfinition par beat |
| Documentation complète | `_shared/ATLAS-COMPOSANTS.md` | Catalogue + règles + exemples |

## Plan Beat 2 (au moment de la rédaction)

**Sujet** : Traversée du Rhône — éléphants sur radeau, 218 av. J.-C.
**Pattern caméra** : camera-track sur rivière (SVG path) avec zoom 2.8x → éléphants suivent la caméra
**Assets à générer** : radeau (PixelLab map_object), éléphant sur radeau (PixelLab character side-view)
**Pattern base** : Beat3Barter (camera-track sprites CSS) + `svgToComp()` depuis `_shared/`
**Règle session** : lire ATLAS-COMPOSANTS.md EN PREMIER avant toute ligne de code

**Why** : Beat 1 était le plus lourd techniquement — premier beat avec architecture 2 couches sur vrais POI géographiques bord canvas. Capital réutilisable maximal extrait.
**How to apply** : pour tout nouveau beat Atlas, charger ATLAS-COMPOSANTS.md, identifier composants réutilisables, coder uniquement ce qui est nouveau.
