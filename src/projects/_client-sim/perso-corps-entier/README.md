# PERSO CORPS ENTIER — piloter, puis REPARER un rig tiers

⛔⛔ **GEOMETRIE D'ORIGINE** : les fichiers de `out/_r-and-d/perso-corps-entier/` sont des
REECRITURES de `15_Customs_Officer.json` (corpus kamotionstudio, **licence non documentee**).
C'est un BANC D'ESSAI qui reste dans le workspace. ⛔ Ne JAMAIS promouvoir en livrable
client/portfolio sans licence verifiee. (Decision d'Aziz 2026-08-29 : la contrainte porte
sur le LIVRABLE, pas sur le TEST.)

## Ce qui est prouve (2026-08-29)

| Question | Reponse | Mesure |
|---|---|---|
| Placer le perso dans nos scenes | OUI | 1 calque touche (le null de controle) |
| Effacer son geste d'origine | OUI | 11 proprietes figees |
| Lui imposer un AUTRE geste | OUI | 14 cles, amplitude x3 |
| **Reparer les defauts qui apparaissent** | **OUI** | plages mesurees, cf. ci-dessous |

## ⭐⭐ LA LECON CENTRALE : un membre a une PLAGE, pas une liberte

Un personnage vectoriel est dessine A PLAT : la manche n'a pas de volume, elle est un aplat positionne pour un angle donne. Au-dela de sa plage, elle sort de sous le torse et se retrouve
en travers de l'avant-bras (le « moignon bleu » qu'Aziz a repere a l'oeil).

**Plages mesurees par balayage** (rendu + regard, pas calcul) sur `15_Customs_Officer` :

| Articulation | Plage sure | Rupture | L'original demande |
|---|---|---|---|
| epaule (`ind=4`) | ~25 deg | -50 deg franche | -12 deg max |
| coude (`ind=5`) | ~60 deg | +60 deg | +38 deg max |

⭐ **L'epaule est BEAUCOUP moins tolerante que le coude** (25 contre 60). Contre-intuitif :
c'est l'articulation la plus proche du corps qui casse en premier, parce que c'est elle qui
doit rester couverte par le torse.

⛔ **Notre 1er essai etait a -75 deg d'epaule = 3x hors plage.** Le geste restait lisible,
le fichier valide, les frames distinctes — et le rendu etait casse. Un compteur ne l'aurait
jamais dit.

## ⛔ 2 pieges deja payes

1. **`effacer_geste()` sans `sauf=`** debranche les calques qui accompagnaient un membre
   sans lui etre parentes (le cone du scanner, anime en POSITION seule, est reste braque
   a droite pendant que le bras montait).
2. **Mon 1er diagnostic etait FAUX** : j'ai dit « la manchette est figee et ne suit plus ».
   Non — `ind=4` est le PARENT de `ind=5`, il ne peut pas se detacher. Le vrai defaut etait
   l'AMPLITUDE. ⭐ Verifier la chaine de parentage AVANT de conclure a un debranchement.

## Outils

- `tools/demonter.py` — geometrie MONDE (les `tr` de groupe + le parentage resolu)
- `tools/piloter.py` — `placer` / `effacer_geste` / `poser` (+ garde-fou `PLAGES`)

## Fichiers

`out/_r-and-d/perso-corps-entier/` : `A-place` (placement) · `B-fige` (geste efface) ·
`C-salut` (1er pilotage, HORS plage — garde comme contre-exemple) ·
`D-salut-repare` (dans les plages mesurees).
