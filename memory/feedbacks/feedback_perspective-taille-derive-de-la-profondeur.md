# La taille DÉRIVE de la profondeur — jamais un réglage libre

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Bug vécu (2026-07-28, `MarcheNuitVivant16x9`)** : dans une scène de marché, les **marchands** étaient
rendus à **198 px** de haut alors que les **passants du premier plan** faisaient **174 px** — or les
marchands sont les **plus loin** de la caméra. Perspective inversée. Repéré à l'œil par Aziz :
« les marchands sont gigantesques tandis que les passants sont dans une taille normale ».

**Cause racine** : j'avais réglé le `scale` de chaque personnage **à l'œil, un par un**, jusqu'à ce que
chacun « ait l'air bien » isolément. Aucun n'était absurde seul ; c'est leur **rapport** qui était faux.

**Why** : dans une scène au sol, la taille n'est pas une propriété du sujet — c'est une **conséquence de
sa position en profondeur**. La régler librement revient à donner à chaque personnage sa propre
perspective, donc son propre monde. C'est ce qui casse le sentiment qu'ils partagent le même espace.

## How to apply

Poser **UNE fonction unique** dont dérive la taille de TOUS les sujets, et ne jamais écrire de `scale`
littéral par sujet :

```ts
const Y_HORIZON = 700;   // profondeur où un sujet serait infiniment loin (taille mini)
const Y_PROCHE  = 1000;  // bas de cadre (taille maxi)
const scaleAt = (solY: number) => {
  const t = Math.max(0, Math.min(1, (solY - Y_HORIZON) / (Y_PROCHE - Y_HORIZON)));
  return SCALE_LOIN + (SCALE_PRES - SCALE_LOIN) * t;
};
// puis, pour CHAQUE sujet, sans exception : scale = scaleAt(sonSol)
```

**Vérification par calcul** (c'est un INVARIANT, donc du ressort du script — pas de l'œil) : trier tous
les sujets par profondeur et vérifier que la taille est **monotone**. Un seul sujet qui casse la
monotonie = perspective incohérente.

## Portée

Vaut bien **au-delà du personnage** : véhicules, bâtiments, objets posés, foule — tout décor SVG
multi-plans. Deux sujets à la même profondeur doivent avoir la même échelle de base ; deux sujets à des
profondeurs différentes ne peuvent PAS avoir la même.

**Famille de règles** : même nature que [[layout-flex-jamais-positions-absolues-au-juge]] (ne jamais
placer au jugé) et [[svg-path-length-heuristique-jamais-fiable]] (calculer, jamais estimer) — mais
appliquée à l'**ÉCHELLE**, pas au placement ni à la longueur.

⚠️ **Corollaire de mise en scène** : si un sujet doit paraître plus imposant qu'un autre, ça ne se joue
PAS sur son échelle (qui est contrainte par sa profondeur) mais sur les différenciateurs validés en
vague D — épaisseur de trait, valeur d'encre, posture. Cf. `STICK-FIGURE-INDEX.md` § ASYMÉTRIE.
