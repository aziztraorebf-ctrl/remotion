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

## ⭐⭐ PERSONNAGE ARTICULE — les techniques qui MARCHENT (2026-08-29, 3 versions)

> Prouve au rendu : bras 90 deg, **salut 120 deg**, assis 75/-80 deg, marche — aucun joint
> ne s'ouvre. ⭐ Le salut a 120 deg est exactement le geste qui a echoue 4 fois sur une piece
> PROFESSIONNELLE (le douanier). Un dessin bien construit bat un fichier pro mal decoupe.

### Le RECOUVREMENT (la contrainte n1, invisible sur une image de reference)
Chaque membre se prolonge **>= 15 % de sa longueur** SOUS la piece qui le couvre. Sans cette
reserve cachee, un TROU apparait des que le membre tourne.
⛔ Un modele qui dessine depuis une frame **ne peut pas la deviner** — elle est cachee.
⚠️ 2 pieges de MESURE :
- les **BORDS d'une manchette courbe** remontent plus haut que son centre : la couverture
  reelle d'une main mesurait 7,5 % alors que l'oeil voyait une manche large ;
- **UN SEUL pixel d'anticrenelage** sur un bord diagonal fait chuter la mesure a 3,5 %
  (la metrique s'arrete a la 1re ligne imparfaite) → nudge d'1 px, pas un redessin.

### La PASTILLE DE ROTULE
Un cercle de la **couleur exacte du membre**, pose au coude/epaule/genou, DANS le calque du
membre. Bouche le joint a tout angle **sans deformer aucune forme** — ne viole donc pas
« zero forme redessinee ». ⛔ Elle est INVISIBLE par construction : si une jonction se voit,
la cause est ailleurs (chez moi c'etaient mes **ellipses d'ombre decoratives** posees au joint).

### Les PIVOTS x,y ANATOMIQUES
⛔ `data-pivot="haut"` est FAUX : a cause de la reserve de recouvrement, le sommet de la boite
est **10-20 px au-dessus** du vrai centre articulaire → les bras s'ecartent au lieu de tourner.
Declarer des pivots `x,y` reels (epaule, coude, poignet, hanche, genou, cheville).

### Les OMBRES
- Une ombre d'articulation vit dans le calque **RECEVEUR**, pas celui qui projette (sinon
  elle reste en arriere quand le joint bouge). La regle « calque du projeteur » ne vaut que
  si les deux bougent ensemble (menton -> cou, tous deux dans `tete`).
- **Bandes d'ombre CONTINUES a travers le joint** : alignees au repos, l'oeil lit une manche
  d'un seul tenant ; la cassure en rotation se lit comme un pli.
- Les pros font des ombres de **GRANDE SURFACE** (moitie de visage, interieur de jambe
  entier), pas des bandes fines. Teinte legerement **decalee**, pas juste plus sombre.

### Les RATIOS (mesures sur les pieces pro)
- ⭐ Le ratio qui compte : **deux jambes reunies / largeur d'epaules = 0,97** chez le douanier.
  Silhouette de reference = **COLONNE** (largeur quasi constante de 20 % a 80 % de la hauteur,
  point le plus large aux **cuisses**). Une silhouette en **Y** (large en haut, fil en bas)
  est le defaut typique.
- ⛔ Le ratio **H/Wmax global est une MAUVAISE metrique** : il depend de la POSE (le douanier
  lui-meme est a 4,2 au repos, pas 2,5). Ne pas s'en servir comme cible.
- **Economie** : marcheuse **41 formes** · exercise 44 · douanier 106 (l'exception riche,
  uniforme structure). Si une forme ne se voit pas a 600 px, elle ne merite pas d'exister.

### Les ETATS DE VISAGE (ce qui separe un pantin d'un personnage vivant)
2-3 bouches + 2 paupieres en calques nommes **caches** (`display="none"`), le code choisit.
⭐ Paupiere fermee = peau **+ arc de cil**, sinon ca lit « pas d'yeux ».
Bouche au repos = **trait fin de 2-3 px**. ⛔ Une masse sombre fermee = un dessin de machoire
de marionnette (le defaut « pantin » que voit l'oeil en premier).
