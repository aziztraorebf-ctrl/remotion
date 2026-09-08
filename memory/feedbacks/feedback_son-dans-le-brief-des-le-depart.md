---
name: son-dans-le-brief-des-le-depart
description: "L'intention sonore s'ecrit EN MEME TEMPS que l'intention visuelle, beat par beat — pas ajoutee apres le rendu"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7d0aea92-6728-43ac-9013-78bb10876eaa
  modified: 2026-09-03T02:18:53.467Z
---

L'intention **sonore** de chaque beat s'ecrit dans le brief **en meme temps** que son
intention visuelle — pas « on ajoutera des SFX apres ». Concretement : chaque ligne du
decoupage porte deux colonnes, la forme ET le son.

Exemple (piece cauri, `out/_r-and-d/cauri/BRIEF-PIECE.md` § 4) :
« la coquille se demultiplie » -> « cliquetis secs, espaces, qui se densifient ».

**Principe** : le son suit la MEME COURBE que la forme (rarete -> densite -> masse ->
rupture -> retour). Le quasi-silence du debut n'est pas un vide a combler : c'est ce qui
rend l'accumulation audible ensuite.

**Why**: decision d'Aziz, 2026-09-02 — « inclure le son des le depart dans le brief (...)
c'est quelque chose qui manque peut-etre dans notre workflow habituel ». Constat declencheur :
nos 3 pieces TED-Ed sont MUETTES, alors que dans la video source chaque apparition de forme a
son bruit. C'est precisement ce qui empeche un aplat vectoriel de paraitre froid ou
« informatique ». On avait deja les outils (`scripts/generate-sfx-elevenlabs.py`,
`generate-narration-expressive.py`, Minimax pour la musique) — c'est la PLACE dans le
processus qui manquait, pas l'outillage.

**How to apply**: dans tout brief de piece animee, le tableau de decoupage a une colonne
« Son » remplie des l'ecriture. Un beat sans intention sonore declaree est un beat
incomplet — au meme titre qu'un beat sans intention visuelle.

⚠️ Non encore eprouve : la regle est posee dans le brief cauri mais aucune piece produite ne
l'a validee. A confirmer au premier rendu sonorise, puis graver en doctrine si ca tient
(cf. [[documenter-une-methode-prouvee-avant-de-generaliser]] — on ne generalise pas une
methode supposee).
