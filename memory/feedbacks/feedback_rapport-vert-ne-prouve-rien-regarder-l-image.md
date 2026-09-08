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


---

## ⭐⭐ EXTENSION 2026-08-30 — un rapport JUSTE peut être trompeur (pas seulement un rapport vert)

La fiche ci-dessus dit qu'un rapport vert mesure sa propre COUVERTURE, pas la fidélité. Ce cas va
plus loin : **le chiffre était exact, et quand même trompeur.**

Mon scan du `.lottie` de l'onboarding disait « **37 calques animés sur 38 le sont en opacité seule** ».
Vérifié, re-vérifié sans limite de profondeur : **exact**. J'en ai conclu que la pièce ne contenait
aucun geste — et j'ai raté son mouvement central.

Le glissement d'ensemble **n'appartient à aucun calque** : il naît du décalage temporel entre eux.
Mesuré sur le RENDU (le titre glisse f4→f28, la pastille du bas f16→f42), invisible dans le fichier.

### La règle
⭐ **La structure d'un fichier décrit ce que chaque calque fait ISOLÉMENT. Elle est aveugle à ce que
leur COMPOSITION produit à l'écran.** Un mouvement d'ensemble, une cascade, un rythme, une
lisibilité : rien de tout ça n'est lisible dans un scan par calque.

⛔ **SIGNAL D'ALARME** : quand un scan structurel produit un chiffre écrasant (« 37/38 en opacité
seule », « 0 trim path », « 90 % en rotation »), c'est le moment de **rendre et de REGARDER**, pas
de conclure.

⭐ **Corollaire de geste** : un mouvement appliqué EN BLOC et le même appliqué PAR ÉLÉMENT DÉCALÉ ne
se ressemblent pas — le premier a l'air d'un panneau qu'on pousse. **Le décalage EST le geste.**
Deux animations aux keyframes identiques par calque donnent deux pièces différentes selon leur
déphasage.

---

## ⭐⭐ EXTENSION 2026-09-01 — un rendu qui BOUGE ne prouve pas qu'il est CORRECT

Nouvelle variante du même piège, cette fois sur un rendu vidéo plutôt qu'un rapport ou un scan de
fichier : **le mouvement lui-même peut être le symptôme du bug**, pas la preuve qu'il n'existe pas.

**Le fait (candidature Spark Icon, prototype Remotion)** : un premier clip semblait déjà "vivant"
(rotation du groupe + gouttes qui apparaissent). Le vrai bug (`scale(1 X)` sans virgule, syntaxe
XML invalide en CSS, rejetée silencieusement par le CSSOM) empêchait les rayons individuels de
partir de zéro — ils restaient figés à leur taille native du path dès la frame 0. Le clip BOUGEAIT
(rotation + gouttes fonctionnaient, elles utilisaient une syntaxe valide) mais ne faisait PAS ce
que le brief exigeait (une naissance progressive depuis rien). Un mouvement partiel a été pris pour
un mouvement complet.

### La règle

⭐ **"Ça bouge" n'est pas un critère de correction — seul "ça bouge COMME PRÉVU" l'est.** Avant de
juger un rendu animé fonctionnel, comparer explicitement CE QUI bouge (quels éléments, dans quel
état à quelle frame) contre le comportement attendu écrit noir sur blanc (le brief, le storyboard),
pas contre une impression générale de vivacité.

⛔ **SIGNAL D'ALARME** : un rendu où certains éléments bougent et d'autres restent figés — le
réflexe est de conclure "ça marche globalement", alors que c'est le signal exact d'une mutation qui
échoue sur UN sous-ensemble précis (souvent lié à une différence de syntaxe/valeur entre les
éléments qui bougent et ceux qui ne bougent pas, comme ici scale à 2 arguments vs 1 argument).

---

## ⭐⭐ VARIANTE (2026-09-08) — `tsc` VERT + gate VERT, et les pieds hors du cadre

Le cas source est un outil qui s'auto-évalue. Voici la variante la plus banale, donc la plus
piégeuse : **des garde-fous qui disent vrai chacun dans son périmètre, et un rendu cassé.**

Migration de `ProtoGeminiPaletteDemo` vers le rig canonique. Après coup :
- `npx tsc --noEmit` : **8 erreurs avant, 8 après** — aucune régression, vrai ;
- `audit-composants-index.py` : la collision `GeminiRig` a **disparu** — vrai aussi.

Frame rendue et REGARDÉE : **les pieds des 3 personnages étaient coupés en bas du cadre**, et la
ligne de sol passait au niveau des mollets. Cause : les deux rigs n'ont pas le même `hipY`
(**340** côté proto, **365** côté canonique) — les pieds tombaient à y≈585 pour un `viewBox`
s'arrêtant à 540. Le `viewBox` avait été calé pour l'ANCIEN rig et n'avait pas bougé.

> **Aucun des deux gates ne pouvait voir ça** : l'un vérifie les types, l'autre les noms exportés.
> La géométrie ne se compile pas — elle se regarde.

⭐ **La règle** : après tout changement de composant qui DESSINE (rig, layout, viewBox, échelle),
rendre 1 frame et l'ouvrir. Le coût est de ~20 s (`npx remotion still <compo> <out.png> --frame=N`).
⛔ « Ça compile et le gate est vert » n'est PAS une vérification de rendu — c'est la vérification
que rien d'AUTRE n'a cassé.

Voisin : [[feedback_petit-objet-ne-se-juge-pas-sur-frames-redimensionnees]] ·
[[feedback_animation-vs-image-fixe-mesurer-frames-uniques]].
