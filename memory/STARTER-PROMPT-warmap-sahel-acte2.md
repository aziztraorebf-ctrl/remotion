# STARTER — War-Map Sahel : valider Acte 1 full HD, puis Acte 2

> Session fraîche. L'Acte 1 a été reconstruit (session 2026-06-07/08). À VALIDER en full HD, puis Acte 2.
> Branche : `feat/da-brief-gate-warmap-sahel`.

## À LIRE EN PREMIER (dans cet ordre)
1. `memory/episodes/warmap-sahel/STATUS.md` — état complet + prochaine action.
2. `memory/episodes/warmap-sahel/LECONS-RECONSTRUCTION-ACTE1.md` — erreurs à ne pas refaire + patterns concluants.
3. `memory/episodes/warmap-sahel/DECISION-jetons-vs-vehicules.md` — pourquoi jetons (pas véhicules) en format long.
4. `memory/doctrines/WARMAP-LONG-DOCTRINE.md` — doctrine format War-Map Long.

## ÉTAPE 1 (démarrage immédiat) — RENDER ACTE 1 FULL HD
```
./scripts/render-mapbox.sh SahelActe1-Final out/episodes/warmap-sahel/wip/acte1-FULLHD.mp4
```
(PAS de --scale → 1920x1080 natif, ~30 min. Lancer en background.)
**Vérifier** : jetons nets + lisibles · 2 archétypes distincts (chèche clair JNIM / cagoule sombre EIGS) ·
taches d'influence s'arrêtent au front (pas de bouillie brune) · barre événement bas ABSENTE · graines
pulsantes f750-1000 · allumage séquentiel Mali->Burkina->Niger · CEDEAO fissure · sync voix.
**Affinages mineurs possibles** (voir STATUS) : dispersion jetons, chevauchement résiduel, onde friction.

## ÉTAPE 2 — ACTE 2 (après validation Acte 1)
Le moteur `SahelWarMapEngine.tsx` contient déjà les Actes 2-5 (ancien code). L'Acte 1 est la RÉFÉRENCE
DE STYLE — aligner les Actes 2-5 sur ses mécaniques (jetons, taches, fusion, vignette, caméra vivante).
**PROCÉDÉ Acte 2 (demande Aziz) : DA-BRIEF-GATE upstream + downstream.**
- UPSTREAM : `scripts/tools/da-brief.py --upstream` (review du PLAN de l'Acte 2 AVANT de coder, sur la
  narration réelle de l'Acte 2 beat par beat). Gemini + Kimi valident l'approche.
- DOWNSTREAM : `da-brief.py` (review du rendu) ou `da-compare.py` pour comparer à la référence.
- Toujours : Gemini/Kimi = signal jamais juge. Aziz tranche le goût.

## CONTEXTE NARRATION (pour situer)
Acte 1 (fait) = "deux groupes armés JNIM + EIGS, il faut les voir séparément".
Acte 2+ = suite du récit AES (embrasement, bases militaires, naissance AES, Kidal, réfugiés, ressources).
Triggers Actes 2-5 déjà dans le moteur (F_EXPANSION_START f2630, etc.) — voir SahelWarMapEngine.tsx.

## OUTILS
- Render : `./scripts/render-mapbox.sh <CompoId> <out.mp4> [--scale=N] [--frames=A-B]`. remotion still NE
  marche PAS pour Mapbox (WebGL). Full HD = pas de --scale. Validation rapide = --scale=0.4.
- ⚠️ Juger la NETTETÉ uniquement en full HD (scale 0.4 = flou, fait douter du design à tort).
- DA-BRIEF-GATE : `scripts/tools/da-brief.py` (--upstream / --expert) + `da-compare.py`.
