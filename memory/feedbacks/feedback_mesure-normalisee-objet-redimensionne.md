---
name: mesure-normalisee-objet-redimensionne
description: "Comparer deux rendus dont l'objet a change de TAILLE ou de CADRAGE — un % de pixels mesure la taille, pas la propriete visee ; l'image tranche"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b610f2da-009f-4e78-ad79-b16eda5f7d1b
  modified: 2026-09-08T14:33:48.973Z
---

Quand on compare une **version corrigee** a une **version anterieure** et que l'objet a
change de taille ou de position entre les deux, un pourcentage de pixels ne mesure PAS la
propriete qu'on croit mesurer — il mesure surtout le redimensionnement.

**Vecu 2026-09-08 (contrat chill-meter, verification des 6 MOV alpha), 3 fois de suite sur
la meme question** : verifier que les icones de boutons etaient bien bleues (sa demande 4).
- Mesure 1 : « 17,2 % de bleu avant, 1,7 % apres » — lu a tort comme une regression. En
  fait le nouvel objet est **plus petit** dans le cadre : la bande de boutons occupe moins
  de pixels. Le chiffre mesurait la TAILLE.
- Mesure 2 (normalisee par la hauteur de l'objet) : **0,0 % de bleu ET 0,0 % de vert**,
  alors que l'image montre clairement les deux. La bbox etait calee sur `alpha > 128`,
  donc sur l'**ombre portee** qui descend jusqu'au bord du cadre (y=1079) — la fenetre
  ratait entierement les boutons.
- Mesure 3 (calee sur `alpha > 230`, le chassis opaque) : melangeait le bleu de l'ECRAN
  avec celui des icones. Toujours pas la bonne grandeur.
- **L'image a tranche en 5 secondes** : crop des deux bandes de boutons, mises a la meme
  largeur, l'une sous l'autre. Verdict evident — avant tout etait bleu (icones ET mots),
  apres les icones sont bleues et les mots VERTS. C'etait exactement sa demande. La baisse
  du chiffre signalait la disparition voulue du bleu **des mots**.

## Ce qu'il faut faire

1. **Objet redimensionne entre 2 versions → jamais un % brut.** Normaliser sur une
   reference interne a l'objet, ou renoncer au chiffre.
2. **Une bbox par seuil d'alpha attrape l'ombre portee**, pas le chassis. Une ombre est
   semi-transparente et deborde : `alpha > 128` inclut l'ombre, `alpha > 230` le chassis.
   Verifier ce que la bbox contient AVANT d'en deduire une fenetre de mesure.
3. ⭐ **Au 2e chiffre incoherent, arreter de doser la mesure et CROPPER LES DEUX ZONES
   COTE A COTE a la meme largeur.** Sur une propriete visuelle localisee (couleur d'un
   element, presence d'un detail), la comparaison d'images est plus rapide ET plus fiable
   qu'une 3e tentative de fenetrage. J'ai insiste 3 fois avant d'y venir.
4. **Un chiffre qui va dans le mauvais sens n'est pas une regression tant qu'on n'a pas
   regarde.** Ici la « regression » etait la correction demandee.

Lie a [[mesurer-la-bonne-grandeur-pas-la-plus-facile]] (meme famille : la mesure facile
n'est pas la mesure juste) et a [[rapport-vert-ne-prouve-rien-regarder-l-image]] (le
symetrique : un chiffre vert ne prouve pas plus qu'un chiffre rouge).
