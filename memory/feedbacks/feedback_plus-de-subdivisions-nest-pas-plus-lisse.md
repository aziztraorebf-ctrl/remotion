# « Plus de subdivisions » n'est pas « plus lisse » — mesurer le pire palier

> Établi le **2026-08-26** (chaîne SVG→Lottie, reproduction d'un masque à dégradé).
> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

## Le fait

Lottie ne porte pas les masques. Pour adoucir le bord franc d'une aire, je l'ai reproduit
autrement : **N copies de la forme**, allant toutes de l'origine à une borne de plus en plus
proche du bord, à opacité faible et **ÉGALE**. Les opacités s'additionnent là où les copies se
superposent → rampe, pas escalier.

**N a été choisi PAR MESURE, pas par intuition.** Testé à **8, 5, 4 et 3** :

| N | plus grande marche de luminosité | poids |
|---|---|---|
| 8 | **7 / 255** | +40 % |
| **4** | **4 / 255** ← le plus lisse | référence |

⛔⛔ **Contre-intuitif : au-delà de 4, les copies se chevauchent et RECRÉENT des paliers.** Plus de
tranches ne lisse pas mieux — ça lisse **moins**, et ça coûte 40 % de poids.

Avant/après sur le bord mesuré : chute brutale **68→41** (marche 27) devenue
**66→63→60→57→54→51→48→41** (marche 7 puis 4).

## La leçon transposable

**Quand on approxime un effet continu par N éléments discrets, N a un OPTIMUM — il n'est pas
monotone.** L'intuition « j'en mets plus, ce sera plus fin » est fausse dès que les éléments
**interagissent** (superposition, additivité, chevauchement). Seul moyen de trancher : **mesurer
la plus grande discontinuité** (le pire palier) pour 3-4 valeurs de N.

⭐ **La bonne métrique est le PIRE cas, pas la moyenne** : un fondu se juge sur la marche la plus
visible, comme un raccord se juge sur la coupe la plus voyante.

Vaut pour : approximation de dégradé, empilement d'opacités, subdivision de courbe, échantillonnage
d'une trajectoire, tranches de flou, pas d'interpolation.
Code : `src/projects/_client-sim/lottie-ui/tools/vivifier.py` (`TRANCHES_OPTIMALES = 4`).

Voisin : [[feedback_camera-a-coups-easeinout-par-segment-pas-un-dosage]] (même famille : un défaut
qu'on croit être un problème de DOSAGE et qui est un problème de STRUCTURE).
