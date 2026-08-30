# Un element qui en COUVRE un autre : chercher l'ANCRE, pas un dosage

> Vecu le **2026-08-30**, `repro-redeem` (reproduction d'une piece pro Lottie).
> Meme famille que `feedback_camera-a-coups-easeinout-par-segment-pas-un-dosage.md`
> et `re-mesurer-l-entree-avant-de-re-doser-un-placement`.

## Le symptome
La main-curseur couvrait le bouton `Redeem` et le libelle `Giftcards`. Deja corrige une
fois (commit `ef7cf6ff` « main plus discrete, cadres agrandis ») : on avait **reduit la
main** et **decalee sur le cote** (`mX = 372 puis 418`). Le defaut est revenu.

Le fichier portait meme un commentaire affirmant la conclusion :
« le probleme n'etait donc pas sa TAILLE mais le fait qu'elle COUVRAIT le contenu ».

## Ce que la mesure de la reference a dit
Trois chiffres releves dans le `.lottie` source (precomps 4 et 5, calque `Hand`) :

| | reference | nous (avant fix) |
|---|---|---|
| ancre | `a=(-112,8 , -187,6)` = **le bout du doigt** (-1 % / -5 % de la bbox) | coin haut-gauche du path |
| largeur | **133 px** (s=62 % sur bbox 214) | 110 px — **plus PETITE** |
| position | **x=400, centree** sur les boutons | x=372/418, poussee sur le cote |

⭐ **La main de reference est PLUS GROSSE que la notre et PILE AU CENTRE, et elle ne gene
pas.** Donc ni la taille ni la position laterale n'etaient la cause — les deux « fix »
precedents agissaient sur des variables innocentes.

**La cause : l'ANCRE.** En reference, `p` place le *bout du doigt* et le corps de la main
s'etale vers le bas-droite, hors du contenu. Chez nous `translate(mX,mY)` placait le *coin
haut-gauche* du path, dont le doigt est a (67,0) : tout le corps se rabattait SUR la cible.

## Le 2e piege, dans la meme passe
Apres correction de l'ancre, viser le **centre** de la cible remettait le doigt sur le mot.
Mesure : le doigt de reference ne vise jamais le centre —
`Giftcard Button=(450,422)` mais doigt a `(400,344)` ; `Cash Button=(450,629)` mais doigt a
`(400,601)`. Il se pose **en haut-a-gauche**, la ou il n'y a pas de texte.

## La regle
1. Un element qui en recouvre un autre est presque toujours un probleme de **repere**
   (ancre / origine du transform), pas d'**amplitude** (taille, offset lateral).
2. **Signal d'alarme** : si reduire la taille et decaler la position ne suffisent pas,
   arreter de doser — les deux variables sont innocentes, le repere est faux.
3. Sur une repro, l'ancre de la reference **se lit** (`ks.a` compare a la bbox des shapes).
   Ne pas la deviner.
4. ⛔ Un commentaire de code qui affirme une cause (« le probleme n'etait pas X mais Y »)
   sans chiffre a cote est une **hypothese fossilisee** : il fait re-parcourir la mauvaise
   piste a la session suivante. Cf. `commentaire-code-perime-bat-la-doctrine`.

## Effet mesure
Recouvrement du libelle par la main : `Redeem` **18,8 % -> 8,2 %** · `Giftcards` **19,2 % -> 11,4 %**.
Un `mX+48 / mY+4` en dur sur l'onde de contact — qui compensait l'ancre fausse — a pu etre
supprime au passage : **une valeur magique disparait quand le repere devient juste.**
