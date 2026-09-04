---
name: brief-image-reprendre-tous-les-interdits-pas-seulement-le-plus-saillant
description: "Generer une image-cible : recopier TOUS les interdits du brief client, pas seulement celui qu'on a en tete"
metadata:
  type: feedback
---

Quand on demande une IMAGE-CIBLE a un modele (Gemini i2i) pour visualiser un effet avant de le
coder, le prompt doit recopier **TOUS les interdits du brief client**, pas seulement celui qui
est saillant dans la conversation du moment.

**Le cas (2026-09-04, chill-meter / Abigail)** : 3 cibles generees pour l'onde de choc du 100 %.
Dans les 3 prompts, j'ai protege SON VISAGE (« her face must stay perfectly clear »), repete 2x.
Je n'ai JAMAIS mentionne la fenetre video. Resultat mesure : la cible que j'ai RECOMMANDEE
recouvrait **36,7 % de la fenetre video**, alors que le brief dit « No part of the meter should
touch the music video » et « It should not block the music video ».

⛔ **Gemini n'a pas desobei — la contrainte n'etait pas dans le prompt.** Un modele i2i ne
connait que ce qu'on lui ecrit ; il ne devine pas les regles d'un brief qu'il n'a pas.

**Aggravant** : cette contrainte est celle pour laquelle on avait deplace `POS_Y` 670 -> 706
deux jours plus tot (2 px de chevauchement mesures). Elle etait dans le STATUS, sous les yeux.

**Why**: un interdit absent du prompt produit une cible sereine qui viole le contrat — et
comme l'image est belle, elle est recommandee au client sans que l'erreur saute aux yeux.
C'est plus dangereux qu'un raté visible : ca oriente tout le chantier suivant dans le mur.

**How to apply**:
1. AVANT tout prompt d'image-cible : relire la liste des interdits du brief et les recopier
   TOUS dans le prompt (zones a ne pas couvrir, elements a ne pas toucher, registre a tenir).
2. APRES generation : MESURER chaque zone protegee, ne pas juger a l'oeil. Ici 3 lignes de PIL
   sur la fenetre video auraient invalide la cible A avant que je la recommande.
3. Verifier aussi le REGISTRE : la cible « vitre qui se fend » (verre brise = choc/casse) etait
   hors du monde du sujet (le froid). Cf. [[metaphore-dans-le-monde-du-sujet]].

Lie a [[ecart-brief-verifier-contre-la-reference-client]] et
[[deleguer-un-defaut-nommer-ce-qui-ne-doit-pas-changer]].
