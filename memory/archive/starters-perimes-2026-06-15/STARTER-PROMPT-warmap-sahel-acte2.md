# STARTER — War-Map Sahel : coder les Parties (script V5 + voix bouclés)

> Branche : `feat/da-brief-gate-warmap-sahel`. Le script V5 LINÉAIRE et la VOIX sont terminés (2026-06-10).
> Reste = re-découper en beats puis CODER les Parties 1-4 (Acte 1 visuel intact).

## À LIRE EN PREMIER (dans cet ordre)
1. `memory/episodes/warmap-sahel/STATUS.md` — état complet + assets + prochaine étape.
2. `memory/episodes/warmap-sahel/SCRIPT-V5-LINEAIRE-2026-06-10.md` — LE script validé (notes `> CARTE :` = storyboard).
3. `memory/doctrines/WARMAP-VIVANTE-GRAMMAIRE.md` — R-V1..R-V4 (board clearing, Ken Burns, 1 transfo/plan).
4. `memory/episodes/warmap-sahel/DECISION-jetons-vs-vehicules.md` — jetons (pas véhicules) en format long.
5. `memory/episodes/warmap-sahel/LECONS-RECONSTRUCTION-ACTE1.md` — erreurs à ne pas refaire.

## AUDIO PRÊT (généré + découpé)
`public/_shared/audio/sahel-warmap/` : `narration-v5-expressive.mp3` (7min26, validé Aziz) +
`narration-v5-p0→p4.mp3` (5 parties) + `narration-v5-alignment.json` (loss 0.167, triggers frames).

## ÉTAPE 1 — re-découpage en beats
À partir de `narration-v5-alignment.json` + notes `> CARTE :` du script V5 : définir les beats de chaque
partie (timing show-don't-tell). Une partie = un bloc de la narration découpée.

## ÉTAPE 2 — coder Partie 1 (canari)
Moteur `src/projects/warmap/engine/SahelWarMapEngine.tsx`. Le mode `acte2`/B1 actuel = LEGACY (ancien plan
sprites, abandonné) → refondre selon V5 + grammaire vivante. Acte 1 visuel INTACT (retirer timeline curseur
+ re-caler triggers sur alignment V5). Valider Partie 1 en render → enchaîner Parties 2-4.

## DA-BRIEF-GATE (procédé Aziz, par partie)
- UPSTREAM `scripts/tools/da-brief.py --upstream` : review du PLAN d'une partie AVANT de coder.
- DOWNSTREAM `da-brief.py` / `da-compare.py` : review du rendu (vs Acte 1 référence).
- Gemini/Kimi = signal jamais juge. Aziz tranche le goût.

## OUTILS / RÈGLES
- Render : `./scripts/render-mapbox.sh <CompoId> <out.mp4> [--scale=N]`. Mapbox = WebGL, `remotion still` NE marche PAS.
- ⚠️ Juger la NETTETÉ uniquement en full HD (scale 0.4 = flou, fait douter du design à tort).
- Voix : refaire une partie = `generate-narration-expressive.py --only-part pX` (réparation chirurgicale).
- Jetons circulaires (2 archétypes JNIM/EIGS), 1 transformation à la fois, board clearing entre beats, caméra jamais statique.
