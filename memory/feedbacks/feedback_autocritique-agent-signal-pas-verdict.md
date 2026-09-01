Session R&D stick figure (2026-07-26/27, 4 vagues). Verdict d'Aziz apres visionnage :
« **je pense que ton verdict est deux fois plus severe que le verdict des agents ET que moi** ».
Sur des gestes que les agents avaient eux-memes auto-juges « LIMITE » (montee/descente, peur/froid),
Aziz a tranche « **excellentes** », « tres bien reussis ». J'avais relaye ces auto-critiques comme si
c'etaient des constats.

**Deux mecanismes distincts, tous les deux a eviter :**

1. **L'auto-critique d'agent relayee sans pondereration.** Un agent qui ecrit « ce geste est LIMITE »
   emet un SIGNAL sur ce qu'il n'a pas su faire — pas un verdict sur la valeur du resultat. Meme statut
   que Gemini (« SIGNAL, JAMAIS JUGE », CLAUDE.md). Le relayer tel quel a Aziz revient a lui presenter
   l'opinion d'un executant comme un fait etabli, et **fausse sa perception avant meme qu'il regarde**.

2. **La contamination inter-lots.** Un des 3 lots avait un vrai defaut (cadrage : persos a 45px dans un
   ruban de 200px). Je l'ai corrige a raison — mais cette severite a **debordé sur les 2 autres lots**,
   qui etaient bons. Un defaut reel sur un lot ne justifie pas d'abaisser la barre sur les autres.

**Why** : le jugement de gout appartient a Aziz, et il ne peut l'exercer que sur une matiere presentee
neutrement. Une presentation deja chargee de reserves (les miennes + celles des agents) le prive de sa
propre lecture. Cout observe : aucune perte de production (les gestes etaient bons), mais un aller-retour
inutile et une sous-estimation du registre a un moment ou il fallait decider s'il valait la peine.

**How to apply** :
- Presenter le livrable D'ABORD, factuellement. Les reserves APRES, en les attribuant (« l'agent juge
  X limite ; je n'ai pas verifie / je ne partage pas »).
- Ne jamais fusionner mon jugement et celui d'un agent dans une meme phrase.
- Avant de qualifier un lot, verifier si mon niveau d'exigence vient de CE lot ou d'un defaut vu ailleurs.
- Corollaire vecu : un agent peut aussi **sous-estimer sa reussite** (verdict « LIMITE » revise en
  « REUSSI » une fois le cadrage corrige — il jugeait dans le code, pas a l'ecran).

## ⭐ Le cas SYMETRIQUE, plus dangereux : la SUR-estimation sur un critere PERCEPTIF (2026-07-30)

Un agent Fable a rendu une miniature SVG en affirmant dans son rapport que le blocage du levier « se lit
en une demi-seconde » et que sa verification a 320 px etait « validee ». **C'etait faux** : les points de
soudure etaient dores comme la manette, donc ils se fondaient avec elle — l'image lisait « un joystick »,
pas « un mecanisme bloque ». L'agent avait pourtant bien execute la procedure de verification demandee.

**Mecanisme** : l'agent juge sur son INTENTION et sur le code qu'il vient d'ecrire, pas sur les pixels.
Il sait que les soudures sont des soudures — il les a codees. Un oeil neuf, lui, voit des taches dorees.
C'est le meme biais que la sous-estimation, mais dans le sens qui fait PASSER un livrable rate.

**Regle** : sur tout livrable VISUEL produit par un agent, l'auto-evaluation ne vaut RIEN tant que
l'orchestrateur n'a pas REGARDE le rendu lui-meme, **a la taille reelle d'usage** (320 px pour une
miniature, pas 1920). Demander la verification a l'agent reste utile — elle attrape les ratages
grossiers — mais elle ne remplace jamais le regard final.

**Corollaire de methode (valide le meme jour)** : une fois le defaut vu, **reprendre le fichier a la main
est plus rapide qu'un aller-retour d'agent**. 4 iterations SVG faites en direct ont converge la ou un
nouveau brief d'agent aurait coute plus cher — et l'agent aurait re-juge son propre travail.

Voisin mais distinct de [[rapport-agent-texte-pas-preuve-verifier-disque]] (qui traite la COMPLETUDE
d'un rapport : le travail a-t-il ete fait ?). Ici il s'agit de la VALEUR du travail : est-il bon ?
