# TECHNIQUES — comment obtenir chaque effet

> N'écrire ici qu'une technique qui a PAYÉ, avec son chiffre ou sa preuve visuelle.
> Une technique supposée n'a rien à faire dans ce fichier.

## ⭐⭐⭐ Le relief par EMPILEMENT (2026-08-28, mesuré)

Le volume d'un objet ne vient PAS du dégradé. Mesure sur une pièce vendue :
**227 chemins pour 168 remplissages**, mais **seulement 15 dégradés**.

Décomposition type d'un billet de banque :
`corps` · `bande d'ombre` le long d'un bord · `pli` · `liseré intérieur clair` · `pastille` ·
`symbole` · `reflet en biais` · `contour`. Chaque forme = un aplat d'une teinte voisine.

→ **5 à 12 formes par objet.** Les dégradés viennent en plus, jamais à la place.
⛔ Contre-preuve à connaître : sur une **anatomie humaine**, l'empilement ne sauve rien
(2 planches avec plus de formes, pas meilleures). Cf. `ECHECS.md`.

## ⭐⭐ Le geste de « tap » ne plie pas le doigt (2026-08-28, mesuré sur 3 références)

**Zéro morphing de forme** sur les trois mains de banque qui fonctionnent. L'illusion du
toucher vient de deux choses seulement :
1. le **déplacement** de la main (elle descend, elle remonte),
2. l'**onde de contact** — un ou deux cercles qui naissent au point de touche et se propagent
   en s'effaçant.

⭐ Corollaire : ne pas fabriquer une articulation là où deux poses alternées suffisent.
Certaines références font même l'appui avec **deux calques superposés** dont on bascule l'opacité.

## ⭐⭐⭐ Anatomie AVEC référence : le registre main SE DESSINE (2026-08-28, prouvé au rendu)

Main-curseur 3 poses réussie avec image-ref, là où 5 modèles sur 5 avaient échoué à l'aveugle
(`ECHECS.md`). Preuve : `out/_r-and-d/concours-svg-ui/main-avec-ref/fable.svg` + `compare.png`.
**Ce que la référence apporte concrètement** (à extraire AVANT de tracer) :
1. **La topologie du contour** — où le pouce s'intègre (lobe continu sur le flanc, vallée en U,
   jamais une pièce rapportée), dans quel ordre les masses s'enchaînent. C'est ÇA que les modèles
   ne trouvent pas seuls.
2. **Des proportions chiffrées** — poing plus large que haut (~1,2:1) · index ≈ hauteur du poing ·
   3 doigts repliés = arcs descendants en escalier (chacun ~10 unités plus bas), séparés par de
   courts traits INTÉRIEURS, pas par des découpes du contour.
3. **Un juge pour itérer** — la boucle rendre → poser à côté de la ref → corriger a pris 3 tours
   (fente pouce-index, paume trop longue). Sans la comparaison côte à côte, ces 2 défauts
   seraient passés.
⭐ Pose « pointe » (doigt incliné) : faire pivoter le doigt **à la jointure** (base verticale
courte, puis fût incliné en ligne droite) — le petit angle au pivot lit comme l'articulation.
⛔ Deux parois de contour parallèles à moins de ~12 unités = fente noire au stroke 7 (cf. `ECHECS.md`).

## ⭐ Un raccord qui résiste ne devrait peut-être pas exister

Deux itérations perdues à rattacher un pouce dessiné comme une capsule séparée de la paume.
Les bons dessins font la main en **UN SEUL CHEMIN CONTINU** : la jointure n'existe pas, donc
elle ne peut pas être ratée. Quand un raccord résiste, remettre en cause la découpe elle-même.

## ⛔ Le piège de l'`id` dupliqué (payé 2×)

Dans un fichier à plusieurs poses/variantes, les mêmes sous-groupes reviennent (`index`, `paume`…).
Deux `id` identiques → le lecteur Lottie **fige sans aucune erreur console** (`DOMLoaded` n'arrive
jamais). Toujours préfixer par la variante : `repos-index`, `appui-index`, `pointe-index`.
Vérification : compter les `id` et les `id` uniques, ils doivent être égaux.
