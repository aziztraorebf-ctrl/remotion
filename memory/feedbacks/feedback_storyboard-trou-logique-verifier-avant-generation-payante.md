---
name: storyboard-trou-logique-verifier-avant-generation-payante
description: Un storyboard écrit et validé peut contenir un trou de logique narrative que le codage fidèle reproduit sans le corriger — challenger la cohérence narrative du storyboard AVANT de payer une génération vidéo, pas seulement après visionnage.
metadata:
  type: feedback
---

Avant de lancer une génération payante (MiniMax H3, Seedance, etc.) sur un beat qui met en scène
une situation narrative précise (usurpation, incident, personnage X vs Y), relire la phrase du
script/storyboard qui la décrit et vérifier qu'elle est cohérente avec le plan visuel proposé —
pas seulement fidèle au texte du storyboard.

Cas concret (NorthShield P6, 2026-08-08) : le script disait "même **compte**, appareil inconnu"
(donc un TIERS usurpe l'identité), mais le storyboard écrit en amont disait explicitement "même
**personne**, contexte incompatible" et le plan H3 a montré Sarah elle-même à Berlin — incohérence
jamais challengée avant génération (Toronto→Berlin en 3h impossible). Coût : $1.30 sur le premier
clip + aller-retour complet de régénération avec un nouveau personnage + 2 passes de correction
d'image. Voir [[globe-d3-scaleMul-doit-piloter-tous-les-cercles-dessines]] pour un autre cas de
"le storyboard/code semblait cohérent en le lisant, mesurer/challenger objectivement révèle le vrai
problème".

**Why** : la fidélité au storyboard n'est pas une garantie de cohérence narrative — le storyboard
lui-même est une hypothèse à valider, pas une vérité descendante. Un codeur (agent ou humain) qui
exécute fidèlement un storyboard incohérent produit un résultat incohérent, sans faute de sa part.

**How to apply** : avant tout appel de génération vidéo payante sur un beat narratif à enjeu
logique (identité, lieu, séquence temporelle, cause/conséquence), reformuler en 1 phrase "qu'est-ce
que ce plan prouve/montre concrètement" et la confronter à la phrase du script — si contradiction,
corriger le storyboard AVANT de payer, jamais après.
