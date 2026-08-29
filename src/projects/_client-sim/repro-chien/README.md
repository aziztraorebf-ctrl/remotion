# REPRO-CHIEN — banc d'essai du POCHOIR (track matte) et du RIG

> Créé le 2026-08-29. ⛔ Ce n'est PAS un livrable client : notre fiche de tri range les
> personnages articulés en zone « hors stack ». C'est un **banc d'essai technique**, assumé
> comme tel — il teste le pochoir et le rig, pas une pièce à vendre.

## Ce que c'est

Une tête de chien mascotte, dessinée par un agent **Fable 5** à partir des frames d'une pièce
professionnelle du corpus (`out/_r-and-d/corpus-kamotion/02_Doggy_with_segments_3.json`).

⛔ **Dessin ORIGINAL, pas une copie** : 0 sommet en commun avec le fichier pro (82 contre 255).
Fable a travaillé depuis l'IMAGE de référence, jamais depuis son code.

## Pourquoi cette pièce

La pièce pro contient **14 mattes**, et les retirer change **50 % de l'image** (mesuré) : les
taches de fourrure débordent, les yeux dépassent, le museau devient une masse noire. C'est
donc un vrai test du pochoir, pas une démonstration confortable.

## Où ça en est (2026-08-29)

| Étape | État |
|---|---|
| Dessin statique, 17 calques nommés | ✅ fait, 5 clip-path structurels |
| Partition d'animation (valeurs mesurées) | ✅ `partition.ts` |
| Conversion Lottie | ⛔ **1 pochoir sur 5 porté** |
| Points de pivot | ⛔ à poser |
| Animation | ⛔ bloquée en aval |

### ⛔ LE BLOCAGE MESURÉ : la précomposition

4 pochoirs sur 5 sont refusés, tous pour la même raison :

    clip d'un groupe de 4 calques — Lottie ne decoupe qu'un calque par pochoir
    (precomposition non implementee)

**Pourquoi c'est logique** : un œil n'est pas une forme, c'est 4 calques (globe, iris, pupille,
reflet). Le pochoir doit découper *l'ensemble*. Lottie ne sait découper qu'un calque à la fois
— il faut donc grouper ces calques dans une **précomposition**, et `svg2lottie_scene.py` ne
sait pas encore en fabriquer.

⭐ Ce blocage était documenté comme limite ouverte le matin même (« on le traitera si une vraie
pièce le rencontre »). Elle l'a rencontré **immédiatement** : le cas « un pochoir découpe une
forme UNIQUE » est minoritaire dans du dessin réel.

⭐ Même brique, deux verrous : la pièce 2 (onboarding, `12_BVaKTgmqgb.lottie`) a **45 précomps
imbriqués sur 3 niveaux**. La précomposition débloque les deux.

## Fichiers

- `assets/chien-tete.svg` — le dessin, 17 groupes nommés, 5 `clip-path`
- `partition.ts` — les gestes MESURÉS sur la pièce pro (jamais inventés)
- `ref/` — 3 frames de référence extraites du fichier pro

## ⛔ Pièges déjà payés (ne pas les repayer)

1. **Un `<g>` dans un `<clipPath>` annule la découpe**, sans erreur ni message. Mesuré :
   `<clipPath><circle>` = 13 967 px, `<clipPath><g><circle>` = **0 px**. La spec SVG n'accepte
   que des primitives directes, `<use>` et `<text>`.
2. **Un rapport vert ne prouve rien** : avant le correctif du 29/08, l'outil annonçait
   « transportable à l'identique » en perdant le clip. L'écart mesuré ne le voyait pas non plus
   (une forme découpée ressemble beaucoup à la même sans découpe).
3. **Les pivots ne se devinent pas** : une oreille pivote depuis son attache au crâne, pas
   depuis son centre. Sans point de pivot déclaré, elle tourne autour du coin du cadre.

## Ce que cette pièce a appris sur la GÉNÉRATION SVG

Fable a réussi un cas qu'on classait « organique donc voué à l'échec ». Son analyse, vérifiée
par mesure sur le fichier (24 primitives sur 50 formes, 3 paths à topologie libre, 5 paires
symétriques) : **une mascotte de face est organique en apparence, objet en construction**.

Reformulation du critère (voir `memory/tools/banques-lottie-et-greffe.md`) :

> (référence visuelle disponible) × (décomposable en primitives symétriques) × (tolérance du registre)
> — mascotte animale 3/3 → GÉNÉRER · main 1/3 → PRENDRE · visage humain 2/3 → NON TRANCHÉ
