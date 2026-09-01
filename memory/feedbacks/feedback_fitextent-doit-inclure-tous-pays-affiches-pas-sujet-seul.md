d3-geo fitExtent() : calculer sur TOUS les pays visibles à l'écran, jamais sur le seul sujet narratif.

Quand une carte affiche plusieurs pays mais que la narration se concentre sur un sous-ensemble (trio, duo),
toujours faire le `fitExtent()`/calcul de projection sur la FeatureCollection complète des pays VISIBLES à
l'écran, jamais sur le seul sous-ensemble narratif.

**Why** : sur le Beat 6a CFA, la projection était calée avec `fitExtent()` sur le trio Mali/Niger/Burkina
seul. Les pays plus lointains affichés en fond (Tchad, Côte d'Ivoire, Ghana...) débordaient hors du cadre
1920×1080 — leur tracé était géométriquement complet, mais une partie du contour était invisible hors-champ,
ce qui donnait la MÊME impression de "contour jamais fini" qu'un autre bug distinct (cf
`feedback_svg-path-length-heuristique-commandes-jamais-fiable.md`). Corriger le premier bug ne suffisait pas
à faire disparaître totalement le symptôme — il a fallu diagnostiquer une deuxième cause.

**How to apply** : après tout fix d'animation carte (longueur de path, timing), vérifier explicitement que
TOUS les éléments affichés sont bien dans le cadre avant de conclure que le symptôme est réglé — un
débordement hors-cadre peut masquer un fix par ailleurs correct. Deux causes racines indépendantes peuvent
produire le même symptôme visuel ; ne pas s'arrêter au premier fix trouvé sans revérifier le rendu complet.

Distinct de `feedbacks/feedback_d3-fitextent-polygon-antimeridien-bug.md` (bug antiméridien) — celui-ci
porte sur le PÉRIMÈTRE de la FeatureCollection passée à fitExtent, pas sur un bug de polygone.

---
Migré depuis auto-memory (`feedback_fitextent-doit-inclure-tous-pays-affiches-pas-sujet-seul.md`) le
2026-08-31, contenu original inchangé.
