---
name: calibrer-sur-la-reference-du-client-pas-celle-quon-choisit
description: "Mesurer rigoureusement une reference QU'ON A CHOISIE produit un resultat rigoureusement faux si le client en a fourni une autre"
metadata:
  type: feedback
---

Avant de calibrer un effet sur une reference mesuree, verifier que c'est bien **LA reference du
CLIENT** — pas une qu'on a trouvee soi-meme parce qu'elle semblait pertinente.

**Le cas (2026-09-04, chill-meter/Abigail)** : pour construire une brume froide, j'ai telecharge
une video de fumee professionnelle, mesure sa **saturation a 0,000** (gris pur), et fait
desaturer notre vapeur de 0,211 vers 0,008 pour s'en rapprocher. Methode impeccable : breakdown
3 modeles, mesures, agent dedie, iterations.

⛔ **Sauf que la reference de la CLIENTE etait a saturation 0,572** — une brume franchement
BLEUE. Elle etait sur le disque depuis le 30/08. Notre version de DEPART etait plus proche de sa
cible que tout ce qu'on a produit apres.

**Why**: la rigueur appliquee a la mauvaise reference produit un resultat **rigoureusement faux**,
et le sentiment de rigueur (chiffres, agents, breakdowns) masque l'erreur de cadrage. C'est plus
dangereux qu'un travail bacle, qu'on remet en question spontanement.

**How to apply**:
1. Avant toute calibration : lister les references FOURNIES PAR LE CLIENT et les mesurer EN
   PREMIER. Une reference qu'on a choisie soi-meme ne sert qu'a defaut, et doit etre declaree
   comme telle.
2. Si plusieurs references coexistent (la sienne, la notre, une trouvee), **mesurer les ecarts
   ENTRE ELLES** avant de choisir la cible : ici 0,000 vs 0,572 aurait saute aux yeux.
3. Corollaire : une reference client peut arriver EN COURS de chantier (elle a envoye la sienne
   le 30/08, on l'a exploitee le 04/09). Re-scanner le dossier client avant chaque nouveau
   chantier visuel.

Lie a [[ecart-brief-verifier-contre-la-reference-client]] et
[[brief-image-reprendre-tous-les-interdits-pas-seulement-le-plus-saillant]].
