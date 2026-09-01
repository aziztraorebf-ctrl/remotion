# Un vêtement doit être SOLIDAIRE du corps — il ne dérive jamais tout seul pendant la marche

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Un vetement (ou toute couleur qui represente une partie du corps) ne doit JAMAIS bouger
independamment du corps qu'il habille.** Il suit le buste, la hanche, l'epaule — frame par frame,
sans derive propre. Vaut pour TOUS nos personnages, pas seulement celui ou le bug a ete vu.

**Why** : observe par Aziz le 2026-07-29 sur `PersonnageRole role="commercante"`
(`_shared/stick-figure-svg/identite/Roles.tsx`), teste dans une scene demonstrative
(`PorteurRiche16x9.tsx`). Deux symptomes sur captures :
- pendant la marche, le chandail rose (buste) **remonte** progressivement ;
- en fin de scene il est **entierement sur le visage** du personnage ;
- meme a l'arret initial, l'empilement tenue/corps est deja decale.

Mot d'Aziz : « techniquement parlant les vetements devraient tout le temps... le corps, les
couleurs qui le representent ne devraient JAMAIS bouger en meme temps que le personnage bouge —
et ca devrait etre valide pour tous nos personnages. »

Un vetement qui derive detruit la lecture du corps : dans une scene DEMONSTRATIVE, le corps EST
l'argument (il ploie, son pas raccourcit). Si la tenue masque ou contredit la posture, l'argument
disparait. C'est donc bloquant, pas cosmetique.

## ✅ CORRIGE LE 2026-07-29 — 2 bugs distincts, isoles PAR LE CALCUL

**BUG 1 (le principal) — `busteXf()` ancrait le vetement dans le repere du MONDE.**
Ancienne formule : `t = (fy - hy) / (sy - hy)`. `fy` est une constante du dessin Fable, mais `hy`
et `sy` sont les positions COURANTES du corps anime : **elles oscillent avec le bob de la marche**.
Donc `t` oscillait, et le point transporte restait colle a son `fy` ABSOLU pendant que le corps
rebondissait DESSOUS. **Mesure : l'ecart col-epaule variait de 2.5 unites par cycle a lean=0** —
enorme sur un buste de ~6.6px a l'ecran. C'est la cause du chandail qui remonte sur le visage.
✅ **Fix** : `t` est calcule dans le repere de REFERENCE Fable (constantes `FABLE_HIP_Y = -26`,
`FABLE_SHOULDER_Y = -58`), donc il ne bouge JAMAIS avec l'animation.
**Verifie par calcul : amplitude 2.5 -> 0.0000 a lean=0, et 1.2 -> 0.0000 a lean=14.**

**BUG 2 (le second symptome) — le PAGNE ne pivotait pas du tout.**
Ancre sur `hx, hy` sans rotation, au motif (commentaire d'origine) qu'« une jupe suit le BASSIN,
pas le lean du torse ». Physiquement defendable, mais **faux ici** : le socle n'expose aucun angle
de bassin (le bassin ne tourne jamais), donc la jupe restait **rigoureusement verticale** pendant
que le buste s'inclinait a 14 deg — l'articulation devenait visible, les 2 pieces se separaient.
✅ **Fix** : `PAGNE_SUIVI_LEAN = 0.45` — le pagne suit une FRACTION du lean (une jupe portee par
quelqu'un qui se penche accompagne le mouvement sans s'aligner sur le torse). 0 = ancien
comportement (casse), 1 = alignee sur le torse (faux, une jupe pend).

⛔ **Ce n'etait PAS un bug de la scene appelante** : une limite non documentee de `PersonnageRole`,
revelee par le 1er usage a `lean` eleve. Les 6 planches d'origine ont un `lean` proche de 0 —
**elles portaient deja le bug 1, invisible a cette amplitude.**

⭐⭐ **NON-REGRESSION VERIFIEE SUR RENDU** (le risque qui avait fait renoncer a corriger BRAS_LAG) :
planche `Stick-Roles-Demo` rendue AVANT et APRES, comparee frame a frame (arret + pleine marche).
Les 4 roles sont preserves — formes, couleurs, proportions identiques. **Le fix AMELIORE meme les
planches d'origine** : le col de la commercante est desormais au contact du menton au lieu de
laisser un ecart. Aucune revalidation necessaire.

**How to apply** :
- Tout overlay de vetement se positionne via `bodyPoints()` (cf. [[brique-habillage-stick-figure]]
  et l'en-tete de `habillage.ts`) — jamais via un ancrage fixe ou un calcul maison.
- Verifier sur des **frames consecutives** pendant une marche, pas sur une frame isolee : la
  derive est invisible sur une image fixe et evidente sur 3-4 images d'affilee.
- Verifier aussi a `lean` eleve (buste incline) : c'est la que les overlays ancres sur une
  verticale supposee decrochent.
- Regle voisine deja gravee dans `habillage.ts` (regle 4) : une tunique ne descend pas sous
  ~hy+6, sinon elle **masque le ciseau des jambes** — or le mouvement des jambes EST la lecture
  de la marche. Dans une scene ou l'effort doit se lire (pas qui raccourcit), c'est encore plus
  critique : la robe longue de "commercante" supprime le signal principal.
- Corollaire de casting : pour une scene demonstrative avec effort, preferer une tenue qui
  LAISSE VOIR LES JAMBES (mineur, agriculteur) plutot qu'une robe longue.

Lie a [[brique-habillage-stick-figure]] · [[scene-demonstrative-personnage]].
