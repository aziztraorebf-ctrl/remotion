---
name: ecart-brief-verifier-contre-la-reference-client
description: Un "manque" trouve en relisant un brief se verifie CONTRE la reference fournie par le client, jamais contre une phrase isolee lue litteralement
metadata:
  type: feedback
---

Sur un livrable calque sur une **reference visuelle fournie par le client**, un ecart supposé au
brief se vérifie **contre cette référence**, jamais contre une phrase du brief lue isolément.
Et un placement se vérifie **contre les autres contraintes du même brief** avant d'être "corrigé".

**Why** : vécu le 2026-08-30 sur le contrat Upwork Chill Meter (350 $, jalon 1). En relisant le
brief PDF j'ai levé deux "écarts" — les deux étaient faux, et Aziz a tranché juste sur les deux :

1. **L'afficheur numérique inventé.** Le brief dit « The 0-100 number readout should be clear and
   readable ». J'en ai conclu qu'un affichage du score chiffré manquait. Mais la phrase est dans la
   section *Meter Fill Animation* : elle dit que la GRADUATION reste lisible pendant le remplissage.
   Surtout, **l'image de référence de la cliente n'a aucun afficheur numérique**, et le brief impose
   « use the attached image as the main visual reference for the design itself ». Ajouter l'élément
   aurait introduit dans le design une pièce que sa propre référence ne contient pas.
2. **La marge basse "manquante".** Mesuré 0 px entre le compteur et le bord bas → j'ai proposé de le
   remonter. Or le brief demande explicitement « sitting on the floor / bottom edge » ET « It should
   not block the music video ». Mesuré : haut du compteur y=684, fenêtre du clip jusqu'à ~700. Le
   remonter violait la seconde règle pour satisfaire une exigence que personne n'avait posée.

Le motif commun : j'ai traité **une phrase du brief comme une spec autonome**, alors qu'un brief est
un système de contraintes qui se lisent ensemble, ancré sur une référence visuelle qui arbitre.
Les deux "corrections" auraient dégradé un livrable conforme, juste avant la validation client.

**How to apply** : avant de signaler un manque ou de corriger un placement sur un livrable calqué
sur une référence client —
- **Ouvrir la référence** et vérifier si l'élément supposé manquant y figure. S'il n'y est pas, il
  n'est pas attendu : ne pas l'inventer.
- **Relire la phrase dans SA section**, pas hors contexte — une exigence rangée sous "animation" ne
  décrit pas forcément un élément de design statique.
- **Chercher la contrainte opposée** dans le même brief avant tout déplacement ; mesurer les deux.
- Si un doute subsiste, il devient **une question posée au client**, jamais une modification
  unilatérale du design qu'il s'apprête à approuver.

Lié : [[feedback_reconfronter-brief-original-pas-diff-relatif]] ·
[[feedback_verifier-son-propre-souvenir-comme-un-verdict-llm]]
