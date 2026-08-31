---
name: ameliorer-vs-remplacer-preciser-dans-le-brief
description: "Dessine X" et "ameliore ce X-ci" sont deux briefs differents pour un modele generatif — sans la geometrie EXACTE a preserver, le modele en dessine un autre, meme meilleur
metadata:
  type: feedback
---

Un brief qui dit « dessine le chassis metal » laisse le modele **inventer sa propre silhouette**.
Meme avec un excellent resultat sur les axes demandes (matiere, couleur), ce n'est plus l'objet
qu'on voulait ameliorer — c'est un remplacement complet, invisible tant qu'on ne compare pas les
CONTOURS geometriques, pas juste le rendu final.

**Why** : vecu le 2026-08-31 sur le meme chassis Chill Meter que
[[feedback_deleguer-un-defaut-nommer-ce-qui-ne-doit-pas-changer]] (qui documentait deja la perte de
couleur). Meme apres avoir corrige la couleur (cible chiffree, image de reference dediee, Fable a
pile atteint sat 0,32), Aziz a regarde le resultat et identifie un DEUXIEME probleme, plus profond :
ce n'etait plus notre chassis du tout.

Preuve objective : notre chassis de production utilise 19 `<path d="M137 247H289V205Q289 168
328 158H1112...">` — une silhouette dessinee a la main, asymetrique, avec des coordonnees precises
issues de la reference du client. Le SVG de Fable utilisait des `<rect>` a coins arrondis
generiques. Meme qualite de metal, meme couleur juste — mais une geometrie DIFFERENTE. Le brief
disait « dessine », Fable a dessine. C'etait la consigne exacte, executee a la lettre.

**How to apply** — quand la mission est d'AMELIORER un asset existant (matiere, lumiere, detail) et
PAS de le remplacer :

1. **Extraire la geometrie exacte** (les `d=` des `<path>`, pas une description) du fichier de
   production reel, et la fournir TELLE QUELLE dans le brief — jamais une image de reference seule,
   qui laisse le modele reinterpreter les contours.
2. **Ecrire la contrainte en negatif, explicitement** : « reprends ces `d=` caractere pour
   caractere, sans modifier un seul chiffre ; ton travail se limite au fill/stroke/overlay ».
3. **Faire verifier la geometrie par un controle programme** (comparaison de chaine des `d=`),
   pas par une relecture visuelle — deux silhouettes proches se distinguent mal a l'oeil sur un
   rendu flatteur, mais un diff de coordonnees ne ment pas.
4. **Nommer la distinction dans le brief** : « habiller une geometrie imposee » est une mission
   differente de « dessiner » — le mot employe cadre ce que le modele s'autorise a inventer.

Composable avec [[feedback_deleguer-un-defaut-nommer-ce-qui-ne-doit-pas-changer]] : ce feedback-ci
couvre l'axe COULEUR (chiffrer une teinte a preserver), celui-ci couvre l'axe FORME (fournir la
geometrie exacte a preserver). Un brief d'amelioration complet nomme les DEUX : ce qui doit changer
(la matiere) et, pour chaque autre axe, soit sa valeur cible chiffree, soit sa donnee source exacte.

Lie : [[feedback_svg-dessine-a-la-main-au-lieu-de-deleguer-a-fable]] ·
[[feedback_ecart-brief-verifier-contre-la-reference-client]]
