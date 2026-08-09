---
name: frame-espacee-sous-estime-mouvement-fin-lecture-continue-prime
description: Un agent qui juge un clip vidéo sur des frames extraites à intervalle large (1s+) sous-estime systématiquement le mouvement fin (écriture, regard, tête, sourire) — la lecture continue par l'utilisateur prime toujours sur l'échantillonnage de frames.
metadata:
  type: feedback
---

## Contexte

Répété 2x dans la même session (tests MiniMax H3, 2026-08-09) sur 2 clips différents, après une 1re occurrence déjà notée dans `memory/tools/minimax.md` (test 15s Sonjata, 2026-08-08) — 3e confirmation au total du même biais.

- Clip 1 (H3 R2V simple) : agent a jugé "quasi figé" sur frames à 1s d'intervalle. Aziz, en lecture réelle, a confirmé un mouvement fluide (écriture, pause, regard vers fenêtre) bien présent.
- Clip 2 (H3 R2V multi-référence, scène table d'écriture) : agent a rapporté "elle ne lève jamais la tête vers le visiteur" en fin de clip. Aziz a confirmé en lecture réelle que le mouvement de tête + sourire étaient bien présents et bien exécutés.
- Précédent (déjà dans minimax.md, 2026-08-08) : agent avait diagnostiqué "rythme compressé puis gelé" sur une chorégraphie en fait fluide et enchaînée (mauvaise lecture des frames + mauvaise identification des personnages).

## Why (pourquoi c'est vrai / pourquoi ça arrive)

Un mouvement subtil (rotation de tête de quelques degrés, plissement du sourire, geste de la main sur une page) peut se dérouler entièrement ENTRE deux frames extraites à 1s d'intervalle — invisible en comparant frame A vs frame B, mais parfaitement lisible en lecture vidéo continue où l'œil suit la trajectoire. L'agent n'a accès qu'à un échantillonnage discret ; l'utilisateur voit le flux réel. Plus la durée du mouvement est courte relativement à l'intervalle d'échantillonnage, plus le risque de faux-négatif est élevé.

## How to apply

- **Avant d'affirmer "figé"/"absent"/"ne bouge pas" sur un mouvement fin (tête, regard, doigts, sourire, geste court)** : resserrer l'échantillonnage sur la fenêtre suspecte (frames tous les 0.2-0.3s au lieu de 1s) AVANT de conclure — pas après le rejet de l'utilisateur.
- **Présenter le diagnostic comme une hypothèse à confirmer**, pas un verdict : "sur mes frames à 1s, X semble absent — à confirmer en lecture continue" plutôt qu'une affirmation catégorique.
- **Le retour utilisateur en lecture réelle prime TOUJOURS sur l'analyse de frames extraites** de l'agent — si Aziz corrige un diagnostic de mouvement après avoir regardé le clip, ne pas re-défendre le diagnostic initial, l'invalider immédiatement et noter la correction.
- Vaut pour tout modèle vidéo (pas spécifique à H3) et tout type de review agent (auto-review avant upload, review Kimi, etc.) — biais de méthode d'échantillonnage, pas un défaut du modèle testé.
