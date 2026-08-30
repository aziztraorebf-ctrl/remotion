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

## ⛔⛔ LE SYMÉTRIQUE, ET IL EST PLUS DANGEREUX (2026-08-29)

Ci-dessus : le rapport ment, l'image dit vrai. **Le cas inverse existe, et il fait accuser
quelqu'un d'autre.**

**Le fait** : un agent rapporte 7 itérations de correction sur un dessin, précises et détaillées.
Je rends le fichier : **l'image est identique à l'avant**. Réflexe immédiat — l'agent a menti.
Vérification (`ls -la` + `git diff`) : **le fichier avait bien changé, à la seconde près.**
C'était **MON outil de rendu** qui affichait l'ancienne version : il isolait les groupes en les
masquant par CSS (`#id{display:none}`), et les `id` dupliqués du fichier faisaient que le masquage
visait plusieurs groupes à la fois. L'outil de vérification était faux, pas le travail vérifié.

**How to apply**
- ⛔ Avant de conclure qu'un agent (ou un modèle, ou un collaborateur) n'a rien produit :
  **vérifier que le fichier a changé** (`ls -la`, `git diff`, taille en octets). Une seule commande.
- ⭐ Un outil de vérification est **du code comme un autre** : il a des bugs, et ses bugs se
  déguisent en fautes de celui qu'on vérifie. Le rendu ne prouve rien s'il ne rend pas la bonne chose.
- ⚠️ Signal : le rapport décrit des corrections **précises et vérifiables** (« pouce rattaché,
  index raccourci de 16 px ») mais l'image est **strictement inchangée**. Un menteur reste vague ;
  un rapport précis contredit par une image identique accuse plutôt l'instrument.

**Vécu** : 2 des 3 défauts ont été vus par Aziz sur l'image AVANT que je les mesure.
Commits `66ae75ee`, `bd85038e`, `980d145c`.

## ⭐ 3e forme — LE GATE VERT NE COUVRE QUE CE QU'IL MESURE (2026-08-28)

Le seul lien inaccessible de `MEMORY.md` pointait vers CE fichier — celui qui dit qu'un rapport vert
ne prouve rien. `check-memoire-doublons.py` etait VERT (15 collisions, 15 resolues) : il verifie les
**collisions de basename**, PAS les liens relatifs qui traversent les 2 arborescences memoire. Le
fragment etait donc **present mais INVISIBLE**, et le gate ne pouvait structurellement pas le voir.

⭐ **La question a poser a tout gate vert** : « qu'est-ce qu'il mesure, exactement ? » — pas
« a-t-il passe ? ». Un gate ne prouve jamais l'absence d'un defaut qu'il ne regarde pas.
