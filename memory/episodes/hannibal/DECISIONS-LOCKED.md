# DECISIONS-LOCKED — Hannibal : Traversée des Alpes
> Validé Aziz 2026-05-05. Source de vérité pour la production.

## Palette
- Carte : mer `#1C3D5A` (bleu acier) + terres `#D4C8B0` (beige pierre) — distinct Ghana/Mansa Moussa
- Narratif : `HANNIBAL_PALETTE` dans `src/projects/atlas/hannibal/components/HannibalPalette.ts`
- Fond global : `NOIR_GUERRE #0F1A1F`
- Route Hannibal : ambre `#D4A843`
- Carthage : rouge punique `#8B3A2A`
- Rome : pourpre `#5C3D6E`
- Compteur : OR_SOLDAT `#E6C76E` → ROUGE_MORT `#8B2020`

## Musique (provisoire — à regénérer en production finale)
- **Beats 1-3** : `v1-A-marche-punique.mp3` (aulos + tambour, 60s — trop court, regénérer)
- **Beats 4-5** : `v1-B-alpes-tension.mp3` (frame drum + flûte, 4min02 — suffisant)
- Fichiers : `public/hannibal/audio/music/`
- Volume Remotion : 0.15 (règle projet)

## Assets PixelLab
- Éléphant guerre (grille decay 37 sprites) : `public/_lab-hannibal/sprites/elephant-alive-v3.png`
- Éléphant sur radeau (Beat 2 Rhône) : `public/hannibal/assets/elephant-radeau.png`
- Hannibal infanterie : `public/_lab-hannibal/sprites/hannibal/east.png`

## Carte
- Données geo : `data/geo/hannibal-data.json` (4 vues precomputed)
- Vue Hook : `context` (center [5.0, 43.5] scale 1800)
- Vue Beats 1-2 : `south` (center [2.5, 41.5] scale 2800)
- Vue Beats 3-4 : `alpes` (center [5.5, 44.8] scale 5500)
- Vue sub-4 Dolly-out : `italia` (center [7.5, 44.0] scale 3800)

## Hook
- **Version A validée** (fond noir textuel) — plus épique que carte en fond
- Texte : ligne 1 IVOIRE, ligne 2 ROUGE_MORT, ligne 3 METAL_FROID, Cinzel 84px
- Fichier : `src/projects/atlas/hannibal/scenes/HookScene.tsx` — composant `HookVersionA`

## Structure production
- Branche : `feat/atlas-hannibal-alpes` (à créer depuis `lab/hannibal-rpg-patterns`)
- Timing : `src/projects/atlas/hannibal/timing.ts`
- Audio narration : `public/hannibal/audio/narration-v2.mp3` (147.77s)
