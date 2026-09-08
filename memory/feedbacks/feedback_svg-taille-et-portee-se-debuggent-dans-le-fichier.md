---
name: svg-taille-et-portee-se-debuggent-dans-le-fichier
description: Taille, ratio et portee d'un calque SVG se lisent DANS le fichier (attributs, bbox, groupe) — jamais en dosant le conteneur CSS.
metadata:
  type: feedback
---

# Un SVG qui ne fait pas la bonne taille : lire le FICHIER, pas doser le conteneur

> Vecu le **2026-09-05** (benchmark GPT-6). **3 pieges de la meme famille payes en une session.**
> La METHODE derriere ces 3 cas (« un dosage qui n'ameliore pas agit sur la mauvaise grandeur »)
> vit dans `feedback_recouvrement-est-un-probleme-d-ancre-pas-de-dosage.md` § 2026-09-05.
> Ce fichier-ci porte la MECANIQUE SVG, la ou aucun des 27 feedbacks SVG ne l'avait.

## 1. ⛔⛔ `width`/`height` EN DUR sur `<svg>` PRIMENT sur le CSS du conteneur

Symptome : la piece occupe 19 % du cadre. J'ai agrandi le conteneur a 165 % -> **elle a DISPARU
entierement**. J'ai recadre le `viewBox` sur le contenu -> **aucun effet**, toujours 20 %.
Cause, visible en lisant la 1re ligne du fichier : `<svg width="400" height="400" ...>`.

```
FIX : width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
```
⭐ **Reflexe** : avant de toucher au layout, `head -1` sur le SVG. Les modeles LLM ecrivent
presque toujours `width`/`height` en dur a cote du `viewBox`.

## 2. ⛔ Un `viewBox` contraint le CADRE, jamais le RATIO DE L'OBJET dessine dedans

Mesure : brief imposant `viewBox="0 0 1195 896"`, respecte par le modele — mais **l'objet dedans**
occupe un ratio L/H de **1,784** contre **1,950** pour la reference. 8,5 % d'ecart, invisible a
tout controle de conformite. A largeur imposee (541 px) : **26 px de debordement**, marge basse de
97 -> 71 px, piece disqualifiee pour un remplacement a l'identique.

⭐ **Mesurer la bbox du CONTENU** (rendre + seuiller), jamais les dimensions de l'image.
⭐ **Pour une piece interchangeable avec une reference** : imposer le RATIO DE L'OBJET dans le
brief du modele (« l'objet doit occuper un ratio L/H de X,XX »), pas seulement le viewBox.
Gratuit au 1er appel, coute une regeneration + un recalage complet apres.
⚠️ Ecart repere **a l'oeil par Aziz** avant toute mesure : ni le gate de conformite ni le
contraste local ne detectent une difference de proportions.

## 3. ⛔ `mixBlendMode:"screen"` sur un SVG ENTIER eclaircit TOUT l'objet

Voulu : renforcer la couche de givre en la superposant. Obtenu : l'appareil **blanchit** en entier.
Un blend s'applique a ce qu'on lui donne — donner le fichier entier, c'est le blender en entier.

```
FIX : extraire la couche dans SON PROPRE fichier (ici givre-gpt6.svg, 57 formes),
      et ne composer QUE celui-la.
```
⭐ Bonus : la couche isolee devient pilotable par une seule prop d'opacite.

---

**Le fil commun** : dans les 3 cas j'ai agi sur le CONTENANT (pourcentage, marge, opacite) alors
que la cause etait dans le CONTENU (un attribut, une bbox, la portee d'un groupe). **Ouvrir le
fichier coute 10 secondes ; doser a l'aveugle a coute 2 iterations a chaque fois.**
