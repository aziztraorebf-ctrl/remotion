# Une correction appliquée à moitié coûte plus cher que pas de correction

> Vécu le 2026-09-06, pièce cauri, raccord 1→2. 3 rendus perdus (v2/v3/v4) sur un
> défaut dont la cause était **mon propre correctif étendu à une seule des trois
> valeurs qui en dépendaient**.

## Le fait

Dans `PieceCauri.tsx`, un raccord fait dériver plusieurs valeurs d'un même index d'état :
`cibleDepart` (positions), `largeurDepart` (tailles), `angleDepart` (orientations).

J'ai diagnostiqué un vrai bug (« le semis part de la forme de la coquille, vestige de
l'animatic ») et corrigé... **`cibleDepart` uniquement**. `largeurDepart` et `angleDepart`
lisaient toujours le `nomPrecedent` non corrigé, 5 lignes plus bas.

Résultat : les positions étaient bonnes, les tailles fausses (240 px au lieu de 34).
Le symptôme a **changé de forme** au lieu de disparaître — donc je l'ai attribué à autre
chose (une valeur d'échelle que j'ai dosée, puis neutralisée), et j'ai cherché la cause
ailleurs pendant 2 rendus supplémentaires.

## Pourquoi c'est piégeux

Un correctif partiel est **pire qu'aucun correctif** pour le diagnostic : il déplace le
symptôme sans le supprimer, ce qui invalide l'hypothèse qui était pourtant JUSTE. J'ai
conclu « ce n'était donc pas ça » alors que c'était ça, à moitié.

Aggravant : le commentaire que j'avais écrit sur `cibleDepart` décrivait correctement la
cause générale (« vestige de l'animatic »). Un commentaire juste au-dessus d'un bug de
même nature **endort** — il donne l'impression que le sujet est traité.

## Comment faire

⭐ **Quand on corrige une valeur dérivée d'une source, chercher TOUTES les valeurs dérivées
de la même source AVANT de rendre.** Concrètement : `grep` le nom de la variable source
(ici `nomPrecedent`) et traiter chaque occurrence, pas seulement celle qui a produit le
symptôme observé.

⭐ **Si un symptôme CHANGE de forme après un fix au lieu de disparaître, suspecter d'abord
un fix partiel** — pas une cause différente. Le changement de forme est le signe d'une
correction incomplète, pas d'une hypothèse fausse.

## Corollaire mesuré le même jour (même chantier)

Ma 1re version du 2e fix (`zoomCamera`) a introduit une régression invisible au rendu :
un `return` placé dans une boucle sortait au 1er passage, ce qui **neutralisait le 2e**
(la caméra restait plate jusqu'à la fin). Attrapée en **simulant la fonction sur les 618
frames avant de rendre**, pas à l'œil.

⭐ **Une fonction qui pilote un paramètre dans le temps (caméra, opacité, échelle) se
SIMULE sur toute la durée avant le rendu** — extraire la fonction, la jouer frame par
frame, chercher les sauts. 3 minutes de render économisées à chaque fois, et surtout : un
saut de 2 frames est invisible sur une planche de vignettes échantillonnées.

Liens : [[verifier-son-propre-souvenir-comme-un-verdict-llm]] ·
[[camera-a-coups-easeinout-par-segment-pas-un-dosage]] ·
[[recouvrement-est-un-probleme-d-ancre-pas-de-dosage]]
