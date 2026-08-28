---
name: rapport-vert-ne-prouve-rien-regarder-l-image
description: Un rapport de conformité VERT ne prouve pas la fidélité — un outil qui s'auto-évalue mesure sa propre couverture, pas le résultat.
metadata:
  type: feedback
---

# Un rapport vert ne prouve rien — regarder l'image reste obligatoire

**Quand** : toute chaîne de conversion qui rend un verdict sur son propre travail
(SVG→Lottie, transcodage, extraction, vectorisation).

## Le fait (2026-08-28, chaîne logo client)

Le convertisseur a annoncé **« transportable à l'identique »** sur 3 fichiers visiblement cassés :

1. **Logo Stripe entièrement NOIR** — Illustrator range les couleurs dans une feuille `<style>`,
   pas sur les formes. Aucune couleur trouvée → noir par défaut. Écart annoncé : 0,00 %.
2. **Blason amputé de sa moitié droite** — le côté droit EST le gauche en miroir (`<use>`),
   refusés en silence. Symétrie mesurée 1,83 au lieu de 1,00 ; 90 % de la bande droite absente.
3. **7 dégradés sur 8 hors cadre** — leurs coordonnées vivent dans le repère du DESSIN, la
   matrice n'était pas portée. `x1=231` sur un cadre de 128×128.

## Pourquoi le rapport ne pouvait PAS les voir

Il compte **ce qu'il sait refuser** (`filtres refusés : 14`, `use refusés : 2`). Un défaut qui
passe par un chemin qu'il ne modélise pas produit une géométrie **valide**, donc un rapport propre.

⭐ **Un outil qui s'auto-évalue mesure sa propre COUVERTURE, jamais la FIDÉLITÉ.**

**Why** : c'est la même famille d'erreur que [[chiffre-audit-relaye-sans-verification]] et
[[autocritique-agent-signal-pas-verdict]], appliquée non plus à un agent mais à un OUTIL
déterministe — là où on fait le plus spontanément confiance.

## How to apply

- Le rapport sert à **prioriser l'inspection**, jamais à la remplacer. Rendre et regarder.
- ⛔ **Signal d'alarme : 0,00 % sur un fichier qu'on n'a jamais rendu.**
- Le rapport EST fiable sur ce qu'il **déclare refuser** — aveugle sur le reste.
- ⭐ Corollaire mesuré : une carte de différences ne se montre jamais sans sa **nature**.
  7 % de rouge en contours d'1 px (décalage) et 16 % en zones pleines (matière manquante) sont
  deux verdicts opposés. Sans cette distinction, un décalage d'un pixel se lit comme un logo cassé.
  Mesure : éroder d'1 px — ce qui disparaît était du contour.

**Vécu** : 2 des 3 défauts ont été vus par Aziz sur l'image AVANT que je les mesure.
Commits `66ae75ee`, `bd85038e`, `980d145c`.
