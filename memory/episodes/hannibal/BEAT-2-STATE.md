# Beat 2 — Le Rhône : état production

> Migré depuis auto-memory 2026-08-31 (mis à jour session 2, 2026-05-05). État global de
> l'épisode : voir `STATUS.md` (épisode en PAUSE — Beat 2 Phase C non codée au moment de la pause).

## Architecture 3 phases (décision finale au moment de la rédaction)

| Phase | Frames | Contenu | Statut |
|-------|--------|---------|--------|
| A | f0→150 (0→5s) | Carte SVG vue `south` — dolly-in Rhône + sprites rive + spotlight 37 | VALIDÉ |
| B | f150→450 (5→15s) | Insert Seedance i2v plein écran | VALIDÉ |
| C | f450→905 (15→30s) | Background Gemini + sprites + UI | À CODER (voir `STATUS.md` pour état réel) |

## Phase A — décisions techniques validées

- **Zoom** : 1.0→1.8x (pas 2.5x — trop zoom, mer envahit l'écran)
- **Focus caméra** : `x=525, y=511` SVG = début du path Rhône (nord Provence) — pas RHONE_CROSSING
- **Éléphant** : `svgToComp(525, 511, camA)` — aligné sur la courbure du path Rhône
- **Soldat** : `svgToComp(510, 520, camA)` — légèrement en retrait à gauche
- **Rhône** : visible dès f0 (stroke 2px, opacity 0.6) → illuminé à f60 (5px, opacity 1.0) + glow ambré
- **Sprites** : breathing `sin()` uniquement (soldat-carthaginois = PNG statique par direction, pas de spritesheet)
- **Spotlight "37 éléphants"** : f90→f135, cartouche OR_SOLDAT top:200

## Asset validé
- `out/hannibal/beat2-phase-a-VALIDATED.mp4` — Phase A v4

## Leçons géo Phase A (importantes pour Phase C)

- Vue `south` centrée `[2.5, 41.5]` = Espagne au centre. Le Rhône (Provence) est décalé à droite.
- Zoomer sur `RHONE_CROSSING` directement → mer envahit tout l'écran (Méditerranée en bas-gauche)
- Solution : cibler le **début du path Rhône** (nord Provence, `x=525 SVG`) comme focus caméra
- Les sprites via `svgToComp()` doivent être testés visuellement — les coordonnées JSON ne correspondent pas intuitivement à la position écran à cause de la projection

## Phase C — plan (au moment de la rédaction)

Selon MANIFEST Beat 2 :
- f450→510 : Whip-pan nord vers cavalerie numide + label "Numides"
- f510→660 : Orbital léger 10° autour RHONE_CROSSING
- f660→750 : Spotlight "Première victoire." cartouche CARTHAGE_VIF
- f750→905 : Dolly-out 2.5→1.6x

Phase C reste sur **background Gemini** (`rhone-beat2-composite-v2.png`) avec sprites CSS — décision actée avec Aziz.

## Fichiers clés
- `src/projects/atlas/hannibal/scenes/Beat2Rhone.tsx` — fichier principal
- `public/hannibal/assets/backgrounds/rhone-beat2-composite-v2.png` — background Phase C
- `public/hannibal/assets/video-tests/beat2-i2v-v1.mp4` — clip Seedance Phase B
- `public/hannibal/assets/map-objects/elephant-radeau/elephant-radeau-v2-base.png` — éléphant Phase A
- `public/hannibal/assets/characters/soldat-carthaginois/east.png` — soldat Phase A
