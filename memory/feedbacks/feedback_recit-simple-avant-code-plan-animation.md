Apres avoir obtenu un plan d'animation detaille (motion design, principes Disney, timings frame par
frame, termes type `spring({damping, stiffness})`, `stroke-dashoffset`, `clip-path`...) — que ce soit
via [[motion-design-brief]] ou toute autre generation similaire — TOUJOURS produire un second
recit avant de coder : une traduction en langage simple, chronologique ("a telle seconde, tu vas
voir X qui fait Y"), sans jargon technique non explique. Quand un terme technique est utile a
introduire, le mettre entre parentheses a cote du terme simple (ex: "un petit rebond controle
(effet spring)") plutot que de l'omettre — objectif : Aziz apprend le vocabulaire au fil des
sessions, pas qu'il le subisse.

**Pourquoi** : Aziz lit ces breakdowns en fin de journee, fatigue humaine, et le jargon dense
(termes Disney + termes Remotion + valeurs numeriques) rend impossible de juger AVANT le rendu si
le plan correspond a ce qu'il imagine — source d'aller-retours ("je ne savais pas que ca voulait
dire ca") decouverts seulement apres coup sur le rendu fini. Demande explicite d'Aziz le
2026-08-08 sur le test MOCH-IT, apres reception de 9 plans d'animation multi-modeles (gemini/gpt/
kimi) tres denses techniquement.

**Comment appliquer** : format recit -- 1 paragraphe ou liste par panneau/beat, dans l'ORDRE
temporel ou ca se joue a l'ecran ("d'abord... puis vers telle seconde... enfin..."), formulations
sensorielles ("le mot se desintegre en tranches qui glissent", "une marree qui monte par couches")
plutot que la formulation technique brute. Ne remplace PAS le plan technique detaille (qui reste la
base de code) -- s'ajoute en AMONT du codage, comme gate de comprehension avant d'investir le temps
de code.
