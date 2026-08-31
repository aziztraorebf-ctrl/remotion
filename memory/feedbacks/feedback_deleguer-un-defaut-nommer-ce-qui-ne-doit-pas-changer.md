---
name: deleguer-un-defaut-nommer-ce-qui-ne-doit-pas-changer
description: Quand on delegue un dessin pour corriger UN defaut, nommer explicitement (et chiffrer) ce qui doit rester INCHANGE — sinon le modele optimise l'axe demande et sacrifie le reste en silence
metadata:
  type: feedback
---

Quand on delegue une piece visuelle a un modele **pour corriger un defaut precis**, le brief doit
nommer aussi explicitement **ce qui ne doit PAS changer** que ce qu'on veut ameliorer. Sinon le
modele optimise l'axe demande et **sacrifie les autres sans le signaler** — il execute exactement
ce qu'on a ecrit.

**Why** : vecu le 2026-08-30/31 sur le contrat Upwork Chill Meter. Le chassis manquait de MATIERE
(metal en aplat). J'ai brief 5 modeles vision (GPT-5.5, Gemini 3.1 Pro, Kimi K3, Grok 4.6,
GLM 5.3 Flash) avec, en substance : « cool greys and steel blues, silver/frosted metal ».

Les 10 planches (5 modeles x 2 variantes) ont toutes un metal excellent — biseaux, epaisseur, vis en
relief. **Et toutes ont perdu l'icy blue**, qui etait pourtant une exigence ECRITE du brief client
(« Blue and icy white color palette », « primary identity should be blue and ice-themed »).

Saturation mesuree du chassis seul (HLS, ecran et bouton vert exclus) :

| | saturation |
|---|---|
| reference de la cliente | 0,461 |
| notre version AVANT le concours | **0,321** |
| Gemini (le meilleur des 5) | 0,26 |
| GPT | 0,196 |
| Grok / GLM | 0,11 |
| Kimi (le pire) | **0,070** — de l'acier neutre |

⛔ **La cause est le BRIEF, pas les modeles.** J'ai decrit du METAL, pas de la COULEUR. « Steel
blues » est un adjectif, pas une contrainte : chaque modele l'a interprete vers le gris.
Et le defaut est passe inapercu a l'oeil — les planches sont belles ; c'est la MESURE qui l'a revele.
C'est Aziz qui a pose la question (« elle voulait de l'icy blue, est-ce qu'on ne l'a pas perdu ? »).

**How to apply** — dans tout brief de delegation visuelle :

1. **Enoncer les DEUX axes** : « ameliore X » ET « garde Y strictement identique ».
2. **Chiffrer la contrainte a preserver** quand c'est mesurable : « saturation ~0,32, B-R ~+40 »
   bat « garde le cote bleu ». Un adjectif de couleur derive toujours.
3. **Fournir une image de reference SEPAREE pour chaque axe** : une pour la FORME, une pour la
   COULEUR, une pour la MATIERE — et dire laquelle fait autorite sur quoi. Une seule image de
   reference laisse le modele arbitrer seul les axes qu'on n'a pas nommes.
4. **Faire mesurer le modele lui-meme** avant qu'il rende la main, avec le script de mesure fourni
   et une fourchette d'acceptation. Un agent qui mesure corrige ; un agent qui regarde valide.
5. **Verifier la contrainte preservee AVANT de juger l'amelioration.** Une planche superbe sur
   l'axe demande peut etre disqualifiee sur un axe qu'on avait cesse de surveiller.

Lie : [[feedback_svg-dessine-a-la-main-au-lieu-de-deleguer-a-fable]] (deleguer le dessin plutot que
redoser des valeurs — la meme session en est la preuve) ·
[[feedback_ecart-brief-verifier-contre-la-reference-client]] ·
[[feedback_comparatif-storyboard-mesurer-pas-demander]] (un ecart se MESURE)
