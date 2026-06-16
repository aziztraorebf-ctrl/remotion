# STATUS — Maroc Batteries Short

> Fiche de reprise. Lire en début de session pour reprendre sans friction.
> Mis à jour : 2026-06-03. **BLOC CARTE (Mapbox) TERMINÉ.** Reste le bloc Remotion.

## Philosophie de production (validée 2026-06-03)
**2 blocs séparés : TOUT le Mapbox d'abord (fait ✅), PUIS tout le Remotion, PUIS assemblage.**
Voir `memory/feedbacks/feedback_philosophie-mapbox-puis-remotion.md`.

## État des beats

| Beat | Frames | Type | État | Fichier |
|---|---|---|---|---|
| Beat 0 Hook | f4→f248 | Mapbox | ✅ **FINAL** | `beats/Beat0Hook.tsx` |
| Beat 1 Phosphate | f287→f896 | Mapbox | ✅ **FINAL** | `beats/Beat1Phosphate.tsx` |
| Beat 3 Acteurs | f1342→f1817 | Mapbox | ✅ **FINAL** | `beats/Beat3Acteurs.tsx` |
| Beat 2 Cailloux | f932→f1300 | Remotion pur | ⬜ À FAIRE (BLOC 2) | (stub) |
| Beat 4 Géographie | f1819→f2942 | Remotion | ⬜ À FAIRE (BLOC 2) | `beats/Beat4Geographie.tsx` (stub) |
| Beat 5 Question | f2977→f3284 | Remotion | ⬜ À FAIRE (BLOC 2) | `beats/Beat5Question.tsx` (stub) |

Renders FINAL : `out/episodes/maroc-batteries/beat0-FINAL.mp4`, `beat1-FINAL.mp4`, `beat3-FINAL.mp4`.
Previews catbox : Beat0 https://files.catbox.moe/otcfyz.mp4 · Beat1 https://files.catbox.moe/r30wee.mp4 · Beat3 https://files.catbox.moe/ivv7d8.mp4

## Prochaine action — BLOC REMOTION
1. **Beat 2 Cailloux** (pur Remotion) : split phosphate brut/cathode LFP + balance animée + "5,6 Md$". ⚠️ Assets Gemini à valider AVANT code.
2. Beat 4 Géographie (~37s) · Beat 5 Question finale (~10s).
3. PUIS assemblage final (ffmpeg ordre Beat0→1→2→3→4→5) + mix.

## Corrections ouvertes
- Aucune sur le bloc carte (Beat 0/1/3 tous corrigés et FINAL).
- Beat 2 : assets Gemini non générés (ARRÊT validation prompts Aziz avant code).

## Techniques validées cette session (réutilisables)
- **`useClipFlags`** ⭐⭐ — vrais drapeaux clippés SVG, net à toute échelle. `mainlandBox` pour pays à outre-mer. LA technique drapeau. (Beat1 + Beat3)
- **`GeoCountryPlaque`** — plaque nom + stat + SOURCE épurée (pattern Or Africain). Beat3.
- **Pull back planétaire** (Kénitra → vue monde Mercator zoom 1.0) + drapeaux statiques synchro voix + lignes de connexion (centroïdes dérivés des bbox projetées).
- **SFX `<Sequence>`** obligatoire (jamais `{frame===X}`). Plancher 0.50. SFX = événement visuel réel (pas swoosh sur carte fixe/dézoom lent).
- **camCountryApproach** pitch 32 (relief). 11 templates fill-pattern N1-N4.
- Détails + gotchas : `memory/feedbacks/feedback_sfx-sequence-et-drapeaux-reels.md`, `feedback_pattern-or-africain-plaques-relief-sfx.md`.
