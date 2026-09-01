---
name: R-NARRATION-CUTOFF + R-KENBURNS — cutoff narration & Ken Burns Remotion $0
description: "Toujours calculer narration_end - narration_start et fadeout le clip avant que la narration de la scène suivante déborde. Ken Burns (zoom Remotion sur image statique) = alternative gratuite quand la narration porte la scène sans action physique."
type: feedback
---

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo — reliquat non couvert
> après dépouillement de `rules-pipeline.md`). Distinct du Ken Burns évoqué dans
> `tools/camera-movements.md` (qui compare Ken Burns/optical-zoom à un dolly côté Seedance/génération
> vidéo, verdict "moins intimiste") — ici il s'agit précisément du zoom Remotion pur sur image fixe,
> à coût nul, quand il n'y a pas d'action physique à filmer.

## R-NARRATION-CUTOFF

Toujours calculer `narration_end - narration_start` et s'assurer que le clip ne laisse pas déborder la narration de la scène suivante.

**Why** : Scene 5B Sonjata — clip 7s, narration 5.68s. Sans cutoff, on entend "Mais" (début scène 6) à la fin du clip. Aziz a détecté.

**How** :
1. Calculer `duree_narration = end_word - start_word` du forced alignment
2. Si `clip_duration > duree_narration + 0.5s` : ajouter un volume fadeout dans Remotion après le dernier mot
3. Pattern : `interpolate(frame, [END_FRAME - 3, END_FRAME], [1.0, 0.0], {clamp})`
4. Les secondes silencieuses après cutoff = moment de respiration visuelle (acceptable)

## R-KENBURNS

Quand la narration porte la scène et qu'il n'y a pas d'action physique, un zoom sur image statique dans Remotion fait le travail. Pas besoin de Seedance.

**Why** : Scene 5A Sonjata — "La barre formait un arc... le village restait muet." = moment de stupeur, pas d'action. Ken Burns zoom 1.0→1.45 en 6s avec narration = suffisant et $0.

**How** :
1. Scale 1.0→1.3-1.5 selon durée (plus long = plus de zoom)
2. `translateY` pour cadrer le sujet principal
3. `transformOrigin` au centre du sujet
4. Utiliser `Img` + `interpolate` dans Remotion
5. Toujours proposer cette option AVANT Seedance pour les scènes sans action

⚠️ Contenu daté 2026-04 (pipeline Sonjata paper-craft). Le principe (cutoff systématique + Ken Burns
Remotion comme alternative $0) reste transposable — vérifier la disponibilité du forced alignment et
du pattern `interpolate` sur le projet en cours avant réapplication mécanique.
