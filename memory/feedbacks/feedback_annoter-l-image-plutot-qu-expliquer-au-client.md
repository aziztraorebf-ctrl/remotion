---
name: annoter-l-image-plutot-qu-expliquer-au-client
description: "Face a un desaccord client sur du spatial (placement, taille, centrage), annoter l'image DES LE DEPART au lieu d'ecrire de longues explications — l'image tranche, le paragraphe se discute"
metadata:
  type: feedback
---

⭐⭐⭐ **Quand un client conteste quelque chose de SPATIAL (placement, taille, centrage, ce qui
touche quoi), la reponse n'est PAS un meilleur paragraphe : c'est l'IMAGE ANNOTEE.** Fleches,
cadres, axes, accolades, en langage naturel, zero jargon. **Des le PREMIER desaccord**, pas
apres trois allers-retours.

**Why** : un desaccord spatial est une information geometrique. L'ecrire demande au client de
la reconstruire mentalement — et il reconstruit autre chose. Le montrer la lui donne.
⭐ C'est le MEME principe que [[feedback_montrer-un-previs-plutot-que-decrire-une-consigne-spatiale]],
applique au CLIENT au lieu du modele generatif.

**Preuve (contrat chill-meter, 2026-09-06)** : la cliente a redemande **3 fois** de « centrer le
meter », alors que l'ecart etait mesure a **0,0 px**. Trois messages ecrits n'ont rien resolu.
UNE image avec l'axe trace a travers la fenetre video et le meter reglait la question — et une
seconde, montrant sa reference IA au-dessus de son vrai plateau, a rendu visible en 2 secondes
ce que trois paragraphes n'avaient pas transmis : sa reference n'est pas reproductible sur son
propre decor.

**How to apply** :
1. **Des le 1er desaccord spatial**, produire l'image annotee. Ne pas attendre l'enlisement.
2. **Langage naturel dans l'image** : « both centred on this line », « video covers about a
   third ». ⛔ Jamais de pixels, de pourcentages ni de noms de variables A L'ECRAN — les chiffres
   restent dans NOTRE mesure, pas dans l'annotation.
3. **Fournir l'image, ne pas en demander une.** Un client a qui on donne des devoirs repond
   lentement ou pas. Lui en fournir une le fait DESIGNER au lieu de decrire.
4. **Outil** : PIL suffit (`ImageDraw` + Arial Bold). Fleches = `line` + 2 traits a ±0,42 rad.
   Toujours relire l'image produite : mes 2 premieres versions avaient des cadres mal cales et
   des etiquettes qui se chevauchaient (vu par Aziz, pas par moi).
5. ⛔ **Verifier ce que l'annotation AFFIRME.** Mon cadre jaune mal pose portait l'argument
   « ta video occupe un tiers » ; mesure proprement, les deux fenetres faisaient la meme
   largeur. **Une annotation fausse est pire qu'aucune annotation** : elle se demonte d'un coup
   d'oeil et coute la credibilite de tout le message.

⏭️ **VIDEO ANNOTEE — piste ouverte, jamais testee (idee d'Aziz, 06/09)** : quand le desaccord
porte sur du MOUVEMENT (jalon 2 de ce contrat), on peut annoter une VIDEO avec Remotion —
fleches et reperes animes par-dessus le rendu. On ne l'a jamais fait ; a tester quand le cas
se presentera plutot que d'ecrire une explication de mouvement en prose.

Voir [[feedback_comparatif-storyboard-mesurer-pas-demander]] ·
`memory/projects/CHANTIER-CADRAGE-REVISIONS-CLIENT.md`
