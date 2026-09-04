# ⛔⛔ Mesurer la BONNE grandeur, pas la plus facile à compter

> Trois fois dans la même session (2026-09-04, chill-meter). Chaque fois : mesure techniquement
> juste, conclusion fausse, défaut vu à l'œil par Aziz avant moi.

## Les trois cas

**1. La plaque fantôme.** Aziz : « l'ancien overlay est encore là. » J'ai mesuré l'alpha de MON
overlay — bbox stricte, 0 pixel hors device, détourage propre — et je l'ai contredit. La mesure
était juste et **portait sur la mauvaise couche** : l'intrus était dans le FOND de contrôle
(`entrance-4s-on-set.mp4`, un composite contenant déjà l'ancien châssis). Il fallait rendre le
fond seul. → [[feedback_fond-de-controle-contient-le-livrable-precedent]]

**2. Le saut d'image.** Défaut décrit comme « l'objet saute entre 25 et 50 % ». Mes mesures
d'amplitude par segment et de stabilité de bbox l'ont toutes manquée : elles MOYENNAIENT sur la
séquence. Le défaut était **1 frame sur 510** (0,2 %) — invisible dans toute moyenne, évidente au
visionnage car placée sur une jonction. Il fallait COMPTER les frames anormales.
→ [[feedback_image-svg-nest-pas-attendue-par-le-renderer]]

**3. La progression du givre.** J'ai mesuré la COUVERTURE en % du cadre (13,9 → 10,3 → 18,2, non
monotone) et conclu « ce ne sont pas 3 étapes d'un même givre mais 3 givres différents ». Aziz a
jugé l'inverse à l'œil. Le test en animation lui a donné raison : le givre s'épaissit visiblement
là où il compte. **La surface couverte ne dit rien de la lecture** — la bonne grandeur était la
luminance de la zone métal (55,8 → 62,7 → 67,1, monotone).

## Le mécanisme commun

Je mesure ce qui est **facile à compter** (une bbox, une moyenne, un pourcentage de surface) au
lieu de ce qui **décide** (quelle couche, combien d'occurrences, quelle grandeur perceptive). Une
mesure juste sur la mauvaise grandeur est **plus dangereuse qu'aucune mesure** : elle donne
l'assurance de l'erreur, et elle sert à contredire quelqu'un qui a raison.

## Les réflexes

- **Avant de mesurer, écrire ce que la mesure doit prouver.** « Le device a-t-il bougé ? » n'est
  pas « y a-t-il un second device ? » — ce sont deux mesures différentes.
- **Un accident ponctuel se COMPTE, il ne se moyenne pas.** Pour un défaut rare : compter les
  échantillons anormaux, pas calculer une moyenne sur la séquence.
- **Avant de contredire une observation visuelle, vérifier que la mesure porte sur ce qui est
  observé.** Aziz décrit ce qu'il VOIT ; c'est une donnée, pas une hypothèse à réfuter.
- **Une grandeur perceptive (lecture, contraste) ne se réduit pas à une grandeur géométrique
  (surface, bbox).** Si le désaccord porte sur « est-ce que ça se lit », la surface ne tranche pas.

Lié : [[feedback_rapport-vert-ne-prouve-rien-regarder-l-image]] ·
[[feedback_harnais-de-mesure-accuse-un-code-juste]] ·
key-learnings.md § MÉTHODE — mesure biaisée par la façon de mesurer
