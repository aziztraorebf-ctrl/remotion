⛔ **Dans un style a FEATURES SIMPLIFIEES (yeux en points pleins, nez en 1 trait), ne JAMAIS demander un GROS PLAN a la generation — generer LARGE puis RECADRER le fichier.**

Vecu 2026-08-18 (test raccord "scribe de Tombouctou", registre Sunjata). Sur 4 plans d'une meme scene,
le plan 3 (plan rapproche visage) est revenu avec **blanc d'oeil + iris + paupiere tracee + cerne**,
alors que les plans 1/2/4 avaient les **yeux en points sombres pleins** du registre. Deux systemes de
dessin pour le meme personnage = rupture de continuite immediate au montage. **Repere par Aziz, pas
par moi** — je regardais les images en entier, l'ecart se voit en zoomant sur les visages.

**Why** : une echelle serree "appelle" du detail. Le modele comble la surface disponible en ajoutant
de l'anatomie — un visage a moitie de cadre avec 2 points noirs lui parait sous-dessine. Ce n'est PAS
un defaut de prompt.

**How to apply** :
1. ⛔ **L'edition ciblee ne repare PAS ce cas** — teste : prompt d'edition interdisant explicitement
   `no white sclera, no iris, no eyelid lines` + 2 refs, ordre IMAGE-puis-TEXTE. Resultat : zone cible
   modifiee de **1,6 % seulement**, yeux detailles conserves. Le modele refuse de simplifier un visage
   a cette echelle. Ne pas insister, ne pas re-prompter en boucle.
2. ⛔ **Re-generer en demandant "medium shot, pas de close-up" ne marche pas non plus** : avec une
   reference-image, le modele reproduit le CADRAGE de la reference (2 essais → plan large a chaque fois).
   La reference verrouille l'echelle autant que le style.
3. ✅ **La solution : generer en LARGE (ou l'echelle rend le style simple naturel), puis recadrer par
   DECOUPE du fichier** (PIL crop + resize). Deterministe, zero reinterpretation, style preserve exact.
   → Verifier la nettete apres coup (gradient moyen) : sur une source 2752px, un crop a ~52 % de largeur
   remonte a 2752px donne **3,22** contre 3,09-3,24 pour les plans non recadres — aucune degradation.
   C'est la marge de la source 2K qui le permet ; a plus basse resolution, ce chemin ne tiendrait pas.

⭐ **Generalisable a tout registre a traits simplifies** (Sunjata, Thiaroye, flat-vector) : le cadrage
se decide au MONTAGE (crop), pas a la generation. Corollaire de [[animation-vs-image-fixe-mesurer-frames-uniques]] :
c'est le changement d'echelle qui cache les raccords, donc on en a besoin — mais il doit venir du crop.
