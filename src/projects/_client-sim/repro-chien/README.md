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
| Conversion Lottie | ✅ **5 pochoirs sur 5**, écart 0,03 % (précomposition, 29/08) |
| Points de pivot | ⛔ à déclarer dans le SVG (`data-pivot`) |
| Animation | ⛔ reste à câbler depuis `partition.ts` |

### ✅ BLOCAGE LEVÉ le 29/08 : la précomposition

Un groupe découpé qui produit N calques est désormais **emballé dans une précomposition**
(un asset `{id, nm, fr, layers}` + un calque `ty:0` qui le référence), et c'est ce calque
unique qui porte le `tt`. Résultat sur le chien : **5 pochoirs sur 5**, 4 précomps
(iris-r 4 calques, iris-l 4, tongue 3, head-shading 2), **écart 0,03 %**.

### ⭐ LE RIG est disponible (29/08) — il se DÉCLARE dans le SVG

SVG n'a aucune notion de parentage. Convention ajoutée, ignorée par les navigateurs :

    <g id="bras" data-parent="torse" data-pivot="haut">        <!-- pivot = l'épaule -->
    <g id="main" data-parent="bras"  data-pivot="150,198">     <!-- ou en coordonnées -->

`data-pivot` accepte `haut` `bas` `centre` `gauche` `droite` (déduits de la boîte du groupe)
ou un couple `x,y`. ⛔ L'ancre ET la position bougent ensemble : dans Lottie `a` est le point
qui vient se poser sur `p`, donc déplacer `a` seul DÉCALERAIT le dessin.
Vérifié : chaîne `main → bras → torse` résolue, écart 0,01 %, et faire tourner le bras
entraîne bien la main sans la toucher.

### 🗃️ HISTORIQUE — le blocage tel qu'il se présentait le matin

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
