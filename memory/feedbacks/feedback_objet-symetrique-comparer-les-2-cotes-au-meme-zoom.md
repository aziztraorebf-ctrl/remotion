---
name: objet-symetrique-comparer-les-2-cotes-au-meme-zoom
description: "Une mesure GLOBALE (« 6,9 % occlus ») ne dit rien sur la REPARTITION : sur un objet symetrique, comparer gauche/droite au meme zoom avant de conclure"
metadata:
  type: feedback
---

⛔⛔ **Sur un objet SYMETRIQUE, une mesure globale peut etre parfaite alors que le resultat est
une amputation d'un seul cote.** Toujours comparer les deux cotes AU MEME ZOOM avant de
conclure qu'un traitement visuel fonctionne.

**Vecu 2026-09-06 (chill-meter, 4e essai d'occlusion)** : je voulais faire passer le rebord
d'un piano devant le bas d'un objet incruste. Mesures obtenues : **6,9 % du chassis occlus**
(dans la fourchette 5-15 % recommandee par un jury de 4 LLM) et **100 % des stalactites
absorbees**. Les deux chiffres tombaient juste. J'ai valide sur une vue **plein cadre reduite**.

⭐ **Aziz a vu le defaut sur son TELEPHONE, sur une image plus petite que la mienne** — parce
qu'il a **compare le cote gauche au cote droit** au lieu de regarder l'ensemble :
- a GAUCHE : coin inferieur tranche net, boutons STATUS/DATA coupes en pleine hauteur, bord
  arrondi disparu ;
- a DROITE : chassis intact — coin, vis, bord metallique, stalactites encore visibles.
Les 6,9 % etaient concentres sur UN SEUL COTE. La moyenne cachait l'asymetrie.

## POURQUOI LA MESURE M'A TROMPE

Un pourcentage global est une SOMME : il ne porte aucune information sur la distribution
spatiale. « 6,9 % du chassis occlus » est compatible avec « 14 % a gauche, 0 % a droite »
comme avec « 7 % partout ». Sur un objet dont la symetrie est une propriete visible, seule la
seconde repartition est acceptable — et rien dans le chiffre ne permet de les distinguer.

## LA REGLE

1. **Decouper les deux cotes au MEME zoom et les regarder cote a cote** (les empiler dans une
   seule image avec des labels : c'est ce qui a rendu le defaut evident en 2 secondes).
2. Ne jamais valider un traitement visuel sur une vue PLEIN CADRE REDUITE : c'est l'echelle ou
   les defauts de bord disparaissent. Le plein cadre sert a juger la COMPOSITION, pas l'execution.
3. Quand une mesure et l'oeil divergent, **c'est la mesure qui a tort sur ce qu'elle mesure** —
   pas l'oeil. Chercher ce que le chiffre agrege et masque.

⭐ Corollaire du meme chantier (3e essai, agent delegue) : l'inverse est vrai aussi — **4358
pixels modifies mesures, mais aucun effet visible a l'oeil**. Un chiffre qui bouge ne prouve
pas plus qu'un chiffre qui tombe juste.

Voir [[feedback_rapport-vert-ne-prouve-rien-regarder-l-image]] ·
[[feedback_mesurer-la-bonne-grandeur-pas-la-plus-facile]] ·
`memory/starters/STARTER-chill-meter-revision-06-09.md`
