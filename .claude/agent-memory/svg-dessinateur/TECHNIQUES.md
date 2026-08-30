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

## ⭐⭐ TEXTE SANS `<text>` : fontTools convertit une police systeme en paths (2026-08-30)
Le brief interdisait `<text>` (contrainte Lottie) mais exigeait de vrais titres lisibles.
⛔ Ne PAS ecrire une fonderie de lettres maison (j'ai commence, c'est long et ca lit mal).
Solution en 20 lignes, `fontTools` est deja installe :

    from fontTools.ttLib import TTCollection
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.misc.transform import Transform
    f = TTCollection("/System/Library/Fonts/Avenir Next.ttc").fonts[5]   # 5 = Medium
    gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    k = taille / f["head"].unitsPerEm
    pen = SVGPathPen(gs); gs[cmap[ord(ch)]].draw(TransformPen(pen, Transform(k,0,0,-k, x, y)))
    # y NEGATIF sur l'axe vertical : la police monte en +y, le SVG en -y. x avance de hmtx[g][0]*k.

- Avenir Next.ttc, index utiles : 7 Regular · 5 Medium · 2 DemiBold · 0 Bold (upem 1000).
- Le `suivi` (letter-spacing des libellés en capitales) s'ajoute a l'avance : + suivi par glyphe.
- Resultat : UN seul `<path>` rempli par ligne de texte, recolorable, zero balise interdite.
- Outil ecrit : `/tmp/texte_paths.py` (a rapatrier si reutilise).

## ⭐⭐ RELIEF SUR UNE GRANDE SURFACE : LISERÉ ANCRE, JAMAIS UNE ZONE CLAIRE (2026-08-30)
Sur une pastille de 80px un "lustre" (zone claire en haut) marche. Sur un BOUTON DE 420px
DE LARGE, la meme forme lit comme une LIGNE HORIZONTALE qui coupe le bouton en deux —
toute courbe quadratique devient quasi droite a cette echelle. C'est STRUCTUREL, pas un dosage.
- Fix qui marche : un liseré CLAIR FIN (2,5px) epousant le bord haut + une bande d'OMBRE fine
  epousant le bord bas. Se construit en un seul path : contour exterieur puis retour par le
  contour interieur decale (arcs de rayon r-2.5), sans evenodd.
- Meme regle pour les pastilles : un lustre ANCRE aux coins arrondis (qui suit le `rx`) au lieu
  d'un `<rect rx>` flottant a l'interieur — le rect flottant fait une ligne parasite en bas.

## ⭐ ANNEAU INTERNE PROPRE SUR UNE PILULE (interrupteur) (2026-08-30)
Pour cerner l'interieur d'un ovale sans `<mask>` : UN path a 2 sous-chemins + `fill-rule="evenodd"`,
le 2e etant le meme ovale reduit de 2px, PARCOURU EN SENS INVERSE.
⛔ Un liseré PARTIEL (qui ne fait que le haut) se termine par une ENCOCHE visible a ses deux
bouts — le cerne doit faire le TOUR COMPLET, ou ne pas exister.

## ⭐ FLECHE = UN SEUL CHEMIN CONTINU (2026-08-30, confirme la regle n°3 de doctrine)
Hampe en `<rect>` + pointe en triangle separe = decrochement visible au raccord (l'epaulement
haut de la pointe ne tombe pas sur le bord de la hampe). Redessinee en UN path continu
(hampe -> montee en biais -> pointe -> redescente -> retour hampe, coins `a3.4 3.4`) : jointure
inexistante, donc invisible. Le raccord qui resiste ne devait pas exister.

## Verifier une planche multi-pieces : BBOX PAR RENDU ISOLE (2026-08-30)
Rendre chaque `<g>` de 1er niveau SEUL dans un doc de meme viewBox, puis `Image.getbbox()`.
Donne la taille REELLE de chaque piece en une passe et prouve la conformite au brief
(ici : ecrans 500x1080 exacts, les 2 toggles a 58x32 identiques, 6 membres a 420x55 identiques).
Bien plus sur que de relire ses propres coordonnees.
