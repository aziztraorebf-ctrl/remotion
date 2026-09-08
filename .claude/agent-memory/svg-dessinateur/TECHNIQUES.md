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

## ⭐⭐ METAL EN SVG : la recette qui tient une CIBLE DE SATURATION (2026-08-31, chill-meter)
Mission : matiere metal (ref Grok) + couleur icy blue (ref maison, sat HLS chassis ~0,32) +
forme (ref cliente). Les 5 modeles externes avaient tous perdu le bleu (sat 0,07-0,26).
Resultat mesure : **sat 0,320 / 0,325** en 2 iterations. Ce qui a marche :
1. **RELEVER la teinte dans l'image de reference AVANT de dessiner** (getpixel sur 10 points
   du chassis) : hue 207-210 constante, B-R +23..+42. Toute la palette est construite a cette
   hue — 9 niveaux (deep→spec), CHAQUE niveau garde un ratio B/R eleve. Le metal "gris" des
   5 modeles = un B-R trop faible dans les TONS MOYENS (les grandes surfaces dominent la moyenne).
2. **GENERATEUR Python plutot que SVG a la main** pour 2 variantes a geometrie identique :
   layout declare une fois, palettes/traitements par variante, ids de degrades prefixes
   mecaniquement, verifs (ids, elements interdits, camelCase) integrees a la generation.
   Itérer une couleur = changer 1 hex, regenerer, re-mesurer.
3. **ANNEAU D'ARETE en degrade vertical** : ring evenodd COMPLET rempli d'un linearGradient
   (spec opacite forte en haut → ombre en bas). Donne l'arete qui accroche la lumiere SANS
   liseré partiel (donc sans encoche) — generalisation propre de mes 2 regles existantes.
4. **Empilement par panneau** : ombre portee (forme decalee, pas de flou) → tranche → corps →
   grain/sheen → anneau d'arete → renfoncement (bevel + inset_ring + cavite + ombre interne
   en degrade d'opacite). ~8 formes par panneau, conforme au ~10 du metier.
5. **brushed vs machined sans toucher la geometrie** : stops serres (cassure de reflet),
   liserés spec 0,95 vs 0,7, creux plus noirs, fente de vis en croix, cerne d'usinage complet
   t=1,3 opacite 0,16. La cassure diagonale nette sur la PLAQUE (petite surface) est belle ;
   sur la COQUE entiere elle serait une ligne (cf ECHECS).
6. **Piloter la MESURE** : fond et cavites d'ecran calibres sous le seuil du script de mesure
   (max(r,g,b)<40) pour que la moyenne porte sur le METAL seul. Sat et B-R sont COUPLES
   (S≈(B-R)/(B+R) pour L<0,5) : on ne peut pas viser sat 0,32 ET B-R +40 a luminosite haute —
   trancher pour la contrainte dure (sat), le dire dans le rapport.
Livrable : out/_r-and-d/chill-meter-upwork/concours-metal/metal-fable.svg (+ generateur
rapatrie dans fable/gen-metal-fable.py).

## ⭐⭐ STARBURST / RAYONS IRREGULIERS (2026-08-31, spark-upwork, 4 iterations)

### La forme d'un rayon : EPAULE PRECOCE, jamais un ventre
⛔ Un rayon qui s'evase a MI-LONGUEUR est un **petale de fleur** : mon v1 lisait comme une
marguerite / un anis etoile, et aucun reglage de couleur n'y change rien. C'est STRUCTUREL.
✅ Un rayon de spark est le plus large **tres tot** (epaule a ~18 % de sa longueur, pres de
la base) puis se retrecit de facon **monotone** jusqu'au bout. Retrecissement legerement
CONCAVE = coup de pinceau ; trop concave = lame de poignard ; droit = triangle mou.

### Le BOUT ARRONDI : plancher PROPORTIONNEL, jamais absolu
Un brief qui dit "rounded ends" interdit `r_bout = demi * 0.2` (aiguilles). Mais un plancher
**absolu** (`max(demi*0.42, 2.6)`) cree le defaut inverse : sur les rayons FINS (demi 1,6-3,4)
il est plus large que le corps → ils gonflent en capsules identiques aux gros, et le contraste
fin/large (souvent LE trait distinctif) disparait.
✅ `r_bout = min(max(demi*0.46, 1.5), demi*0.92)` — borne haute relative a la demi-largeur.

### ⭐⭐⭐ UN RAYON FIN INVISIBLE = un probleme de LONGUEUR/PLACEMENT, pas de largeur
J'ai perdu **2 dosages de largeur** avant de mesurer. Methode qui a tranche en une passe :
**rendre chaque rayon SEUL et relever sa bbox** (cf § BBOX PAR RENDU ISOLE).
Verdict : les fins existaient (13 px d'epaisseur) mais faisaient 31-49 u de long contre 172 u
pour les gros → **entierement noyes** dans la masse du voisin large du meme cluster.
✅ **Regle : un rayon fin plus COURT qu'un gros voisin proche en angle ne se verra jamais.**
Soit il le DEPASSE en longueur, soit il occupe un angle que rien ne couvre.
⭐ Meme famille que "des le 2e dosage sans progres, chercher la cause" (ECHECS) : ici la cause
n'etait meme pas dans la propriete que je retouchais.

### Repartition angulaire : des VRAIS TROUS, sinon c'est une rosace
18 rayons repartis "irregulierement" mais partout = rosace reguliere a l'oeil. Il faut des
plages de 20-30 deg **totalement vides**, et des clusters de 2-3 rayons serres entre elles.

### Pas de CORE au centre (quand le brief l'interdit)
Ne pas se contenter d'ecarter les corps : les **sous-formes** d'empilement (face, nervure)
doivent demarrer PLUS LOIN du centre que le corps (`creux + une fraction de lg`), sinon
toutes les bases se superposent au centre exact et refabriquent la boule interdite.

## ⭐⭐ LIVRABLE "STRUCTURE POUR ANIMATION" : PROUVER LE RIG, PAS LE STATIQUE (2026-08-31)
Quand je livre un SVG destine a etre anime par quelqu'un d'autre, le rendu statique ne prouve
rien du rig. **Rendre le SVG avec les handles a des valeurs VARIEES** (ici scaleY 0,15-1,0 sur
18 rayons = l'etape "certains retractent pendant que d'autres grandissent") :
- prouve que chaque handle existe, est bien cable et bouge la bonne piece ;
- prouve que les pieces couplees suivent (le halo jumeau du rayon) ;
- ⭐ **revele des defauts invisibles au repos** : un rayon retracte gardait sa largeur pleine
  et lisait comme un moignon epais. Fix documente pour l'animateur (coupler X a Y) plutot que
  fige dans le SVG — c'est une decision d'animation, pas de dessin.
Cout : ~15 lignes de Python (substitution de chaine + rsvg-convert). A faire systematiquement.

### Choisir la technique de longueur animable (3 options, tranchees)
- `scaleY` sur un `<g>` ENFANT, le `rotate` de placement sur le `<g>` PARENT → 1 valeur
  numerique par piece, timings independants, identique GSAP/Remotion. ✅ defaut.
- `stroke-dasharray/dashoffset` → impose une epaisseur CONSTANTE : incompatible des que le
  dessin melange pieces fines et larges. ⛔
- morphing du `d` → recalcul de geometrie par frame (et du bout arrondi). ⛔ sauf besoin reel.

## ⭐⭐⭐ RÉSEAU DE POINTS / GRAPHE ORGANIQUE (2026-09-01, test Fable vs Opus, convergent)

> Deux agents (Fable 5, Opus 5), même brief, même registre, ont indépendamment retrouvé
> la même recette de base (Poisson-disc + union-find) — ça vaut confirmation, pas coïncidence.
> Livrables : `out/_r-and-d/fable-vs-opus-ted-ed-style/{fable5,opus5}-reseau-points.svg`
> + générateurs `gen-fable5-reseau.py` / `gen-reseau-points.py`.

### La dispersion "presque aléatoire mais équilibrée" se GÉNÈRE, jamais à la main
Un placement manuel sur-régularise (finit en quasi-grille) ou déséquilibre sans le voir.
✅ Poisson-disc par rejet (distance min ~62-92u sur 1920) + seed fixe pour la reproductibilité.
⭐⭐ Version avancée (Opus) : semer en **communautés** — grappes autour de chaque point
d'ancrage (`rayon = 120 + 210*sqrt(rand)`, le `sqrt` évite l'accumulation au centre) plus un
semis de fond, dégagement plus large autour des ancres (sinon elles sont étouffées et ne
lisent plus comme des hubs). Un vrai graphe social a des groupes reliés par quelques ponts
longs — c'est ce qui distingue "réseau" de "bruit".

### ⭐⭐⭐ La composition s'équilibre par MESURE (grille de pixels), jamais à l'œil
L'œil suit la zone dense et ne voit pas le vide. Sur une v3 jugée "correcte" : colonne droite
à 0-14 ‰ de pixels non-fond, rangée basse à 2 ‰ — invisible au regard, écrasant une fois
compté. Aucun contrôle technique (ids, bbox, éléments interdits) ne détecte ce défaut.
✅ Découper le rendu en grille (8×5 ou 5×3), compter par cellule les pixels s'écartant du
fond (seuil type `abs(canal-fond)>20-26`). Zéro cellule vide/faible = équilibré, MESURÉ pas
estimé. Corriger par grappes ciblées sur les cellules faibles, re-mesurer (pas re-regarder).

### La CONNEXITÉ du graphe EST le récit — la forcer par union-find, pas l'espérer
Symptôme : rejeté à l'œil, pas au contrôle technique — un triangle-îlot + des chaînes
serpentines en périphérie lisent "ciel étoilé de constellations", pas "réseau où l'histoire
circule" (un îlot = un endroit où l'histoire n'arrive jamais). Tous les contrôles auto étaient
verts : c'est un défaut de RÉCIT, détecté seulement en se demandant "est-ce que ça raconte la
phrase du brief ?", pas en vérifiant la structure.
✅ Union-find sur les liens après génération ; tant qu'il reste >1 composante, souder chaque
îlot à la composante principale par la paire de nœuds la plus proche (lien court = organique).

### Casser les FILES : une chaîne de points alignés lit "tracé", pas "réseau"
Symptôme : chaînes de 5-7 points en serpentin sans embranchement — l'œil suit une ligne
plutôt que de percevoir un maillage.
✅ Détecter chaque nœud de degré 2 dont les 2 liens sont quasi colinéaires (cos angle < -0.72)
et lui ajouter 1 lien transversal court (≤300u). Crée les triangles/embranchements qui
font "tissu" plutôt que "fil".

### Lignes de réseau = QUADS FERMÉS remplis, jamais `<line>`/stroke
Contrainte du registre "chaque forme fermée et remplie" (export Lottie). Quad de 4 sommets
perpendiculaires à l'axe du lien (largeur 2-3u), raccourci de r+7 à chaque bout pour s'arrêter
net avant les disques (sinon collision sale au nœud).
⛔ **Limite à documenter pour l'aval** : pas de trim-path Lottie possible sur un quad plein —
si l'animation cible un "trait qui se dessine", régénérer en vraies lignes ou animer par
scale/opacité à la place.

### Hiérarchie des hubs : 3 dosages combinés, jamais la taille seule
Symptôme si absent : les hubs sont juste "des points plus gros", la centralité ne se lit pas.
✅ (a) Degré de connexion — hub relié à 6-8 voisins + dorsale hub-à-hub (borner à 6 liens
directs, au-delà ça fait "soleil") ; (b) liens de hub plus épais ET plus opaques que les
liens ordinaires (ex. w3.0/op0.42 vs w2.2/op0.30) ; (c) empilement flat du hub en 3-4 formes :
halo (r×2.2, opacité ≤0.10 — voir piège transparence ci-dessous) + anneau evenodd (2 cercles
en sous-chemins de sens opposés) + disque + cœur couleur du FOND (le "trou" du donut sans mask).

### ⛔⛔ Sur fond sombre saturé, TOUTE transparence claire vire au gris
Symptôme : chaque point porte un anneau/croissant gris sale, l'image entière semble
compressée ou floue — l'exact contraire d'un registre "aplats purs". Cause : `fill-opacity`
0.10-0.16 sur des formes claires larges, aggravé si l'ombre est décalée (croissant plutôt
que volume). Contre-preuve mesurée : le relief ne vient QUE de l'empilement de formes
PLEINES (socle sombre + corps clair, même centre) ; l'accent vient d'un `stroke` NET
(largeur 2.5, opacité 0.55), jamais d'un voile à faible opacité.
⛔ **Seuil de taille** : le socle sombre d'un point ne vaut qu'au-dessus de r≥7 — en dessous
il mange le point et le rend terne ; un petit point = une seule forme, aplat franc.

### Un lien "assorti" à la palette est un lien invisible
Un élément fonctionnel (lien, filet) se choisit sur son CONTRASTE avec le fond, jamais sur
son harmonie de teinte. Des liens lavande sur fond violet (jolis, harmonieux) disparaissent
purement et simplement — l'information a disparu pour préserver l'esthétique. Même famille
que "texte en couleur de filet" (doctrine du 30/08). Remonter vers le blanc/quasi-blanc pour
tout élément porteur d'information, hiérarchiser par opacité/épaisseur, pas par teinte.

### Ponts longs : atténuer, ne pas supprimer
Un lien long et net qui traverse tout le cadre coupe la composition en triangle rigide et lit
"rayon / explosion" plutôt que "lien social" — mais le supprimer casse la connexité (règle
ci-dessus). ✅ Détecter la longueur (seuil ex. >470u sur 1920) et atténuer CE SEUL CAS
(opacité ~0.34, largeur réduite) : le sens du lien est conservé, le défaut visuel disparaît.

## ⭐⭐⭐ SILHOUETTE PLEINE SUR APLAT (art rupestre, pictogramme) — 2026-09-01
Registre : une seule couleur, zero stroke, zero ombrage, zero degrade. Tout le
dessin repose sur la FORME et sur les ECARTS DE FOND. Ce qui a paye :

### Le TRONC est une MASSE, jamais un segment
⛔ Une capsule entre hanche et epaule ne fait PAS un torse : la figure entiere lit
comme un PANTIN DE TRAITS / une araignee, meme avec des membres corrects.
✅ Tronc = quadrilatere aux bords courbes, LARGE aux epaules, etroit aux hanches,
nettement plus epais que les membres (mesure retenue : ep_epaules ~56, ep_hanches
~44, membres 15-26). C'est la masse dominante qui porte la silhouette.
⭐ Corollaire : une fois le tronc plein jusqu'aux hanches, le BASSIN separe devient
nuisible (il faisait un bourrelet a double bosse) — piece supprimee.

### 2 planchers a declarer AVANT de tracer (garde-fous dans le generateur)
- **EP_MIN** (epaisseur d'un membre, ici 14 u sur 1920) : en dessous, un trait
  blanc se DILUE sur le fond. Un `assert` a l'endroit du trace attrape ca a la
  generation, pas au rendu — il a bloque 2 fois des le 1er run (tige, feuilles).
- **ECART_MIN** entre deux formes blanches : deux silhouettes qui se frolent
  FUSIONNENT en un pate illisible (gazelle vs plante, gazelle vs gazelle,
  tete vs bras). C'est le defaut n1 du registre, symetrique de la "fente noire"
  des registres a stroke.

### Le raccord de membres : meme regle qu'en jambe-colonne
Le mollet demarre EXACTEMENT a la largeur du bas de la cuisse (idem avant-bras au
coude). Sinon le fond dessine le bord de la piece parente -> **le genou lit comme
une BULLE**. Meme cause/meme fix que la jambe-colonne du perso articule.

### ⛔⛔ Le SOMMET DU TRONC m'a coute 3 tentatives — diagnostic par RENDU ISOLE
Symptome mouvant : d'abord un "decrochement carre" au flanc, puis un "dard
triangulaire" a l'epaule. J'ai accuse successivement le cou, puis le bras.
✅ La methode qui a tranche en UNE passe : **rendre le TORSE SEUL** (une forme,
dans un doc de meme viewBox, recadre sur sa bbox). Verdict immediat : mon arc de
sommet avait le **flag de balayage inverse** (`A r,r 0 0 1` au lieu de `0 0 0`),
il CREUSAIT le sommet en concave -> les deux "cornes" etaient les extremites de
ce creux. Invisible sur la figure complete, evident sur la forme seule.
⭐ Generalisation : **un defaut qui change d'apparence quand on deplace ses
voisins est un defaut de la forme elle-meme.** Isoler avant de doser.

### Le "cou" est souvent la piece qui ne devait pas exister
Tete remontee pour la degager des bras -> elle flotte -> j'ajoute un cou -> le cou
fait un epaulement en escalier sur le flanc. Fix : **supprimer le cou** et faire
mordre le disque de tete directement dans le tronc plein (l'art rupestre reel n'en
dessine pas). 3e application de "un raccord qui resiste ne devrait pas exister" —
ici c'etait la PIECE, pas le raccord.

### Formes du registre, ce qui marche
- **Quadrupede** : corps a dos legerement CREUSE + ventre remontant (pas une
  capsule droite : ca lit comme une table/un scarabee). Pattes par PAIRES nettement
  separees (ecart avant/arriere >= 40 % de la longueur du corps), sinon peigne.
  Cou en diagonale franche depuis le garrot ; museau qui PROLONGE le cou dans le
  meme axe (jamais une boule rapportee). Tete "qui broute" a mi-hauteur, pas au sol.
- **Pirogue** : croissant SURBAISSE (creux ~12 % de la longueur) avec pointes
  relevees. Un creux profond lit comme un BOL. Rapport retenu : lg 520 / creux 62.
- **Spirale sans stroke** : ruban ferme — bord exterieur en s'enroulant, retour par
  le bord interieur, epaisseur decroissante vers le centre (elle "meurt" en pointe).
- **Lance** : hampe + pointe en UN SEUL path continu (deja acquis sur la fleche).
- **Vegetal-hieroglyphe** : des entre-noeuds et des angles INEGAUX. Des paires
  regulieres a angle constant lisent comme un SAPIN, quelle que soit la longueur.

## ⭐⭐⭐ RELEVER UNE REFERENCE RASTER AVANT DE DESSINER (2026-09-01, methode complete)
Quand on me donne une image de reference, ne PAS dessiner "d'apres l'impression".
4 mesures en ~20 lignes de Python, qui ont toutes paye :
1. **Teinte exacte** : `Counter(im.getdata()).most_common(5)`. Le rouge annonce
   dans le brief texte (#C41E3A) etait faux ; le reel etait #D61B26.
2. **Boite de CHAQUE element** : masque du blanc (`r,g,b > 150`) +
   `scipy.ndimage.label` + `find_objects`, filtre a >= 25 px. Donne x,y,w,h de
   chaque figure -> se convertit direct en coordonnees de mon viewBox (x3 ici).
   C'est ce qui a revele que ma plante etait 3x trop large.
3. **Pentes et points de croisement** : balayer des COLONNES de pixels
   (`np.where(sub[:,cx])`) et suivre les y. A donne les pentes reelles des
   lances (~2 deg et ~15 deg, et un point de depart COMMUN) la ou je les avais
   mises a 45 deg et paralleles.
4. **Positions d'appui (pattes, pieds)** : balayer des LIGNES basses et relever
   les segments blancs. A donne les x exacts des 4 pattes en une passe.
⭐ Verification finale : comparer le **TAUX DE BLANC** (ref 4,00 % / moi 3,68 %).
C'est un controle de densite d'encre globale, independant de la forme.

## ⭐⭐⭐ LA PRIMITIVE "TRAIT CALLIGRAPHIQUE" (coup de pinceau) — 2026-09-01
Beaucoup de styles dessines (art parietal, encre, brush) ne sont PAS faits de
masses : ce sont des traits d'EPAISSEUR VARIABLE, effiles en pointe.
Implementation (compatible Lottie, sans stroke) : echantillonner une Bezier
quadratique, et a chaque t poser deux points de part et d'autre le long de la
NORMALE, a une demi-largeur qui interpole e0 -> e1 ; aller par un bord, revenir
par l'autre, fermer. Un ruban ferme, donc remplissable et recolorable.
- `e1` tres petit (1,5-3) = la POINTE effilee du registre (bras, pattes, feuilles,
  proue). C'est elle qui signe le style.
- Un leger bombement (`*(1 + 0.10*sin(pi*t))`) evite l'aspect "ruban mecanique".
- Bout d'arrivee : arc si e1 > 3, sinon pointe franche.
⭐ **Le choix de primitive est une decision de REGISTRE, prise AVANT de dessiner.**
Se tromper de primitive (masse au lieu de trait) ne se rattrape par aucune
iteration de detail — c'est l'erreur qui a coute toute une v1.

## ⭐⭐ PATINE RETENUE SUR METAL SVG (2026-09-02, chill-meter jalon 1, verdict client "too clean too flat")
Contexte : client approuve la STRUCTURE, rejette la MATIERE ("aged, rusted, weathered…
but restrained"). Recette qui a marche en 2 iterations (1 seul defaut corrige) :
1. **La teinte d'abord** : icy blue sat 0,32 -> gunmetal sat 0,08-0,12 (B-R +20 garde
   la froideur). Un seul point de verite : le dessin referencait ~11 hex durs + 1 bloc
   de degrades — mapping dict OLD->NEW applique par script aux 4 fragments metal +
   au bloc de defs. JAMAIS a la main (les hex reviennent 40+ fois).
2. **Grain par feTurbulence-as-alpha, COMPOSE DANS SourceAlpha** (rendu Chrome/Remotion,
   pas Lottie) : dup du path du panneau, fill quelconque, filtre = feTurbulence ->
   feColorMatrix (RGB constants = couleur du speck, ligne alpha = k*(R+G+B)-seuil) ->
   feComposite operator="in" avec SourceAlpha. Les BORDS RESTENT EXACTS (exigence
   "clean tight edges" + animation aval). 3 filtres : grain sombre bf 0.13, grain clair
   seed different, mottle bf 0.007 (les taches de ton larges). Doser par opacity de
   l'element (0,2-0,55), pas dans la matrice.
3. **Vieillir une vis = 3 gestes** : cerne d'assise chaud sombre (#191410 op 0.4) entre
   bezel et face + croissant de corrosion en bas de face (#1a130c op 0.5) + TOUS les
   reflets/anneaux chromes attenues (0.9->0.5, 0.5->0.32). Blocs repetitifs -> script.
4. **Tube segmente sans toucher la geometrie** : contour d'ombre sous le trait principal
   (w+3, quasi noir) + reflet long en dasharray (22 14, "use") + tics horizontaux tous
   les 26u sur les troncons verticaux (lisent comme des joints de tube articule).
5. **Vents plus profonds** : rect de cavite sombre DERRIERE les fentes + fentes plus
   noires/larges + levre basse claire fine op 0.3 (bevel bas), highlight haut attenue.
Livrable : src/projects/_rnd/chill-meter/ChillMeterDevice.tsx · script rejouable :
out/_r-and-d/chill-meter-upwork/passe-vieillie/aged_pass.py.

## ⭐⭐ BASCULE DE TEINTE CIBLEE SUR UN SVG FINI (2026-09-03, chill-meter gunmetal)
Changer la TEINTE d'un materiau (bleu-acier -> gris neutre) sans toucher geometrie,
rouille, ni zones protegees. Ce qui a marche en 1 passe :
1. **new = gray + K*(c - gray), gray = (r+g+b)/3** : conserve EXACTEMENT la luminosite
   mesuree (moyenne simple des canaux — c'est celle des protocoles de mesure), ne touche
   que la saturation. K = 0.08-0.12 laisse un residu froid de -1..-7 sur les fonds.
   ⭐ Monter K de 0.08 a 0.12 n'a PAS bouge la moyenne (+1,2 -> +1,1) : la moyenne d'une
   surface patinee est dominee par les nappes de texture, pas par le residu du fond.
2. **Selection par SIGNE, pas par liste** : `b > r` = froid (remap) · `b <= r` = chaud/
   neutre (rouille, INTOUCHE) · `b - r >= 60` = accent glow icy sature (INTOUCHE — les
   libelles #6fd4ff et liseres #2f8fff vivent DANS les fragments metal). Le metal d'un
   chassis culmine vers B-R +45 : le seuil 60 separe proprement matiere et accent.
3. **Perimetre par ZONES (offsets de <g id>), defs par REFERENCES** : collecter les
   url(#id) des zones metal ET des zones interdites, `assert` intersection vide, ne
   remapper que les defs metal-only. Les feColorMatrix des filtres se remappent pareil
   (triplet RGB constant aux indices 4/9/14 du values).
4. **Verifier "metal seul" par <style>#ecran,...{display:none}</style>** injecte dans une
   COPIE de mesure : isole la matiere des glows interdits sans toucher la structure.
   (Retirer les groupes par decoupage de chaine CASSE le SVG -> rendu blanc.)
5. ⛔ **Chrome headless sur un .svg direct = image REDIMENSIONNEE + bande blanche** qui
   fausse toute mesure (lum 137 au lieu de 82). Toujours passer par un wrapper HTML
   `<img width height>` margin 0 — ce wrapper reproduit le rendu de reference au dixieme.
6. **Decomposer AVANT de courir apres un critere global** : ici la cavite ecran (47 % de
   la matiere, R-B -44, intouchable) rendait le critere global inatteignable — la
   decomposition en 3 zones l'a prouve en 2 mesures, et le critere reel etait "metal seul".

## ⭐⭐ COURBER PLUTOT QU'AFFINER (corollaire du trait) — 2026-09-01
Pour qu'un membre effile lise comme un membre et non comme un TRIANGLE, ce qui
compte n'est pas de reduire sa base mais de **courber son axe**. Un cou/bras a
base large mais courbe lit juste ; le meme, rectiligne, lit comme un coin, quelle
que soit la finesse choisie. Verifie sur le cou de gazelle (3 dosages perdus).

## ⭐⭐ ROUILLE SUR METAL SVG (2026-09-02, chill-meter passe 2, 3 iterations)
Objectif "aged, rusted, weathered" SANS toucher la geometrie ni la gamme froide.
Ce qui a marche (rendu Chrome = moteur Remotion, filtres autorises dans ce registre) :
1. **La rouille credible est faite de GRANDES structures, pas de grain** : marbrures de
   valeur (feTurbulence bf 0.02/0.028, alpha k=2.0 b=-2.6, teinte quasi noire NEUTRE) +
   coulures dessinees + plaques mangees + aretes usees. Le grain fin seul = la critique
   "uneven grain" du client.
2. **Seuil "ilots"** : pour qu'une zone filtree ne lise pas comme une BANDE pleine,
   durcir le seuil alpha (k 2.2, b -3.3 sur l'oxyde) -> la couverture tombe sous ~40 %
   et fait des taches separees. C'est le seuil, pas l'opacite, qui separe camo et corrosion.
3. **Confiner chaque effet de surface a un chemin qui EXISTE** (dup du panneau) ou a un
   rect arrondi STRICTEMENT interieur au metal. feComposite in SourceAlpha borne au shape
   porteur — si le shape depasse l'appareil, la texture depasse aussi (paye, cf ECHECS).
4. **Vocabulaire dessine, chaque piece empilee** : bloom = base sombre chaude #1c1006 +
   coeur decale bas #0d0703 + lisere chaud #4a2c15 (forte seulement) + piqures avec levre
   claire basse 35 % · coulure = ruban effile (haut large, queue 28 %, devers) rempli d'un
   degrade vertical vers transparent, LONGUEUR PLAFONNEE par la geometrie locale de sa
   source (une vis du tablier bas n'a que ~10u de metal sous elle) · cerne de vis =
   arc BAS uniquement (25-155 deg, l'eau stagne dessous) · tideline = ligne d'eau ondulee
   + voile sombre dessous, sur le tablier.
5. **Physique de l'usure = asymetrie gratuite** : gravite (degrade vertical sombre sur le
   bas), zones basses/epaulements seuls porteurs d'oxyde chaud, coins du cadre en crasse
   radiale, le haut reste relativement propre. C'est ca qui evite l'uniformite.
6. **Prouver la contrainte de gamme au chiffre** : % pixels chauds (R>B+10) vs froids
   (B>R+5). Ici 5,3 % chaud max — la rouille est une minorite localisee, le bleu-acier
   domine. Une impression "c'est reste froid" ne suffit pas, le compte tranche.

## ⭐⭐⭐ BALANCOIRE / SCENE "APLATS PURS" TED-ED (2026-09-02, avec 2 images de reference)

### ⛔⛔ Le registre se VERIFIE a la coupe de pixels, il ne se suppose pas
J'ai commence par empiler des ombres (tranche de planche, socle sous les disques,
flanc sombre du triangle) — reflexe acquis sur les objets d'interface. Une COUPE
VERTICALE de la reference a tranche en 10 lignes de Python : le disque rouge est
#D61B26 CONSTANT du haut au bas, la planche #4056FA d'un bord a l'autre, le
triangle #5500B1 sur toute sa largeur. **Zero empilement dans ce registre.**
✅ Reflexe : avant de decider du nombre de formes par objet, imprimer une coupe
(`for y in range(...): print(y, '%02X%02X%02X' % tuple(a[y,x]))`). C'est 10 lignes
et ca tranche la question "empiler ou pas" sans aucune interpretation.
⭐ 3e confirmation de la meme regle (silhouettes 01/09, ici 02/09) : **la consigne
doctrinale "5-12 formes empilees" est CONDITIONNELLE au registre**, elle ne vaut
que pour les objets a matiere. En aplat pur, empiler EST le defaut.

### ⭐⭐ Le contrat "pret a animer" : origine locale SUR l'axe de rotation
Structure qui rend la bascule triviale a animer :

    <g id="bascule" transform="translate(960 555)">   <!-- 960,555 = sommet du triangle -->
      <g id="planche">   ...dessine autour de (0,0)... </g>
      <g id="masse-rouge">      <circle cx="-381.3" .../></g>
      <g id="contrepoids-vert"> <circle cx="374.5"  .../></g>
    </g>

L'animateur ecrit `translate(960 555) rotate(a)` — rien a recalculer, la masse et le
contrepoids restent solidaires par construction. Le triangle reste HORS du groupe.
⭐ **Prouver le rig, pas le statique** (regle du 31/08, re-appliquee) : j'ai rendu le
SVG avec `rotate(6.514)` — l'angle MESURE sur la reference finale — et compare : la
pose se superpose a la ref. C'est ce test qui prouve que l'axe est au bon endroit.

### ⭐⭐⭐ Positionner un objet POSE sur une barre : mesurer le GAP BORD-A-BORD
J'ai d'abord calcule la position des disques par leur distance PERPENDICULAIRE a
l'axe de la planche (91,3 u). Geometriquement juste, visuellement FAUX : au rendu
horizontal les disques LEVITAIENT (gap de 5-6 px contre 1-2 px sur la ref).
✅ La bonne mesure est le **gap bord-a-bord** : `bas du disque` vs `haut de la barre`,
colonne par colonne (`np.where(masque[:,x])`), sur la ref ET sur son propre rendu.
⛔ Et ce masque MENT sur les petites pieces : pour le contrepoids il annoncait un
contact (-9) alors que le zoom montrait un disque flottant — le liseré antialiasé du
JPEG etait compte comme de l'encre. **Sur un objet de moins de ~20 px, zoomer
(crop x8, NEAREST) et trancher a l'oeil ; la mesure ne sert qu'aux grandes pieces.**

### ⭐⭐ Reproduire une typo au pixel : condense + bearing, pas un choix de graisse
Cible mesuree sur la ref : le "2" fait 68x99 px (ratio h/w 1,456). Avenir Heavy donne
1,207 (trop large), Bold 1,38, Demi 1,525 (trop maigre pour le registre).
✅ Garder la GRAISSE voulue (Heavy) et **comprimer en X** dans la matrice fontTools :
`Transform(k*condense, 0, 0, -k, x, y)`, avance `hmtx*k*condense`. Calcul direct :
`condense = largeur_cible / largeur_naturelle_a_cette_taille` (0,8293 ici).
✅ Et retrancher le **bearing gauche** du 1er glyphe pour que l'ENCRE demarre a la
bonne abscisse (le glyphe '2' a 37/1000 em de blanc a gauche = 12,5 px a l'echelle).
Resultat verifie : bbox rendue x63-131 y39-138 contre x63-131 y39-138 sur la ref.

### ⭐⭐ Le controle final qui prouve la ressemblance : OVERLAY DES MASQUES D'ENCRE
Superposer ref et rendu en couleurs distinctes (`ov[ma]=rouge ; ov[mb&~ma]=bleu ;
ov[ma&mb]=noir`) + IoU. Une image quasi entierement NOIRE = coincidence de toutes les
pieces a la fois — bien plus probant qu'une planche cote a cote, ou l'oeil compense.
Les lisereés de couleur restants pointent exactement les ecarts (chez moi : le "!"
ajoute, et 1 px d'epaisseur de planche).

## ⭐⭐⭐ DETAIL DETACHABLE : un dessin qui tient de 240 px a 10 px (2026-09-04, cauri)

Probleme : la MEME forme doit servir d'objet plein cadre ET de grain repete 260 fois. Un
niveau de detail unique ne peut pas les deux — un detail fin a 10 px devient du bruit gris,
une silhouette nue a 240 px lit comme un galet quelconque.

✅ **Silhouette forte + UN SEUL detail signature dans un calque detachable.**

    <g id="cauri">
      <g id="silhouette"> ... </g>   <- toujours visible
      <g id="fente">      ... </g>   <- masque par code sous un seuil
    </g>

### Les 3 regles qui rendent le calque VRAIMENT detachable
1. **Le detail est POSE PAR-DESSUS une silhouette PLEINE**, il n'y decoupe rien (pas de mask,
   pas d'evenodd traversant les 2 groupes). Retirer le groupe laisse une forme complete et
   fermee — l'exigence est alors STRUCTURELLE, pas obtenue par reglage.
2. **Le detail doit etre STRICTEMENT INTERIEUR au contour** — sinon le morceau qui depasse
   dessine un bout de silhouette et disparait avec le detail. Se verifie par un `assert` a la
   generation (cf. ci-dessous), pas a l'oeil : chez moi le bout de la fente sortait de 4 % sous
   la base, invisible a 480 px.
3. **Verifier le CONFINEMENT sur les POINTS REELLEMENT EMIS dans le path**, jamais sur une
   reconstruction de la geometrie. Mon 1er controle recalculait le bout depuis la fonction de
   largeur alors que le path plafonnait ce rayon : il criait sur un defaut inexistant.
   ⭐ Et TESTER le garde-fou en le faisant echouer (forme allongee, puis elargie x2,6) — un
   `assert` jamais vu rouge ne prouve rien.

### Ce qui survit a la reduction (et ce qui ne survit pas)
Ce qui survit est **d'ensemble** : un rapport h/w franc (1,32 ici), une asymetrie haut/bas
(sommet etroit vs base tronquee a 47 %). Ce sont ces 2 proprietes qui font qu'a 10 px la
forme lit encore comme voulue et pas comme un point rond.
Ce qui meurt : toute dentelure, tout liseré, tout ecart < ~2 % de la largeur.

## ⭐⭐ COURBE DE CONTOUR : l'interpolation EST une decision de dessin (2026-09-04)
- ⛔ **Smoothstep entre paires de points de controle = contour en ESCALIER.** Continu en
  VALEUR, mais la DERIVEE saute a chaque noeud. Echantillonner plus finement n'y change rien
  (on echantillonne la meme courbe cassee) — c'est structurel. ✅ Catmull-Rom (C1), qui passe
  par tous les points mesures.
- ⭐ **Diagnostiquer en imprimant la DERIVEE du profil**, pas en regardant la courbe : les
  cassures sautent aux yeux en 20 lignes (chez moi pente 236 -> 479 -> 290 en 3 noeuds).
- ⛔ **Les valeurs MESUREES aux extremites d'une photo sont des artefacts** : a t=0 la
  reference ne donne qu'UNE ligne de pixels antialiases. Les injecter telles quelles fabrique
  une epaule. Les remplacer par des points de controle de dome.

## ⭐⭐ FERMER UN CONTOUR : les BOUTS sont des ARCS, jamais des CORDES (2026-09-04)
Fermer une forme par un segment droit entre les deux flancs produit, selon la largeur locale :
une COUPE FRANCHE (« galet scie ») si la forme est large, un PLATEAU A DEUX ANGLES si elle
l'est moyennement, une POINTE/cusp si elle tend vers zero. Les 3 sont des defauts de dessin.
✅ Un arc a chaque bout. ⭐⭐ **Et sa FLECHE se CALCULE, elle ne se devine pas** : pour une
parabole `y = f*(1-(x/demi)^2)` la pente en x=demi vaut `-2f/demi` ; l'egaler a la pente du
flanc donne `f = demi / (2 * pente_flanc)`. Chez moi l'estime « c'est un dome donc c'est
bombe » donnait 0,55 -> une TOURELLE EN TETINE ; le calcul donne **0,099**, 5,5x moins.
⭐ Meme famille que « recouvrement = probleme d'ancre, pas de dosage » : une valeur qu'on
peut deriver de la geometrie ne doit jamais etre choisie a l'estime.

## ⭐ DENTELURE : la profondeur d'une dent est RELATIVE a l'ouverture LOCALE (2026-09-04)
Une amplitude de dent donnee en fraction de la LARGEUR DE L'OBJET tronconne la forme la ou
elle est etroite : mes dents, plus profondes que la demi-ouverture en haut de la fente, se
rejoignaient et COUPAIENT le brun en morceaux (lecture « scie », pas « fente dentelee »).
✅ `dent = k * demi_ouverture(t)` — k=0,42 d'un cote, 0,30 de l'autre.
⭐ Et sur une vraie fente de cauri les 2 levres ne s'engrenent PAS symetriquement : une levre
porte des bosses franches, l'autre est lisse. C'est cette ASYMETRIE qui signe l'objet.

## ⭐⭐⭐ 2026-09-05 — ANATOMIE HUMAINE : LA QUESTION OUVERTE EST TRANCHEE (avec reference)

**Le contexte** : la fiche agent interdit l'anatomie humaine (« 5 modeles sur 5 echouent »),
mais notait une exception NON TESTEE : « avec une image de reference, le verdict peut changer
— question ouverte, ecris le resultat ». Voici le resultat.

**Protocole** : meme brief (les 4 regles + les 5 pieges nommes), meme photo de reference
(paume face camera, doigts ecartes, poignet coupe net), 2 modeles, 1 passe chacun.

| Modele | Verdict | Detail |
|---|---|---|
| **GPT-6 Astra** (`openai/gpt-6-astra`) | ✅ **REUSSIT** | AUCUN des 5 defauts. Pouce INTEGRE au contour (pas rapporte), paume non rectangulaire, phalanges dessinees comme des plis et non des bulles, poignet structure, eminence thenar presente. 176 formes, 200 ids, 100 % nommes. |
| **Gemini 3.8 Flash** | ⛔ **ECHOUE** | Les defauts connus, a l'identique : pouce en CAPSULE separee collee au flanc · phalanges en grappe de bulles ovales · avant-bras en tube sans poignet · main trop etroite. + un accent dans un `id` (interdit). |

⭐⭐⭐ **LA REGLE CORRIGEE** : la reference est **NECESSAIRE MAIS PAS SUFFISANTE**.
Ce n'est pas « avec une photo tout le monde y arrive » — c'est **le modele qui decide**, et
seul GPT-6 Astra passe a ce jour. Ne pas generaliser aux autres modeles sans re-tester.

→ **Consequence pratique** : pour de l'anatomie humaine, ne plus refuser d'emblee. Demander
une reference photo, et router vers **GPT-6 Astra**. Sans reference, l'interdiction tient
toujours (5/5 echouent, mesure du 28/08 inchangee).
⚠️ Cout : 1,07 $ l'appel (vs 0,098 $ pour Gemini). Sur ce registre, le prix se justifie —
c'est le seul qui produit une piece utilisable.

## ⭐⭐ 2026-09-05 — RECALER UNE PALETTE SUR LA PHOTO : mesurer HSV, corriger par famille

Aziz sur une piece GPT-6 tres reussie : « la couleur est trop lumineuse, la photo tire vers
l'or rose ». Mesure (moyenne HSV des pixels laiton, teinte 20-60 deg, S>0,22) :

| | hex | teinte | saturation | luminosite |
|---|---|---|---|---|
| Photo | #6C5841 | 31,9 | 0,399 | 0,422 |
| GPT-6 brut | #8C7B5C | 39,0 | 0,347 | 0,549 |
| Apres recalage | #7C664C | **32,1** | 0,387 | 0,485 |

**Methode** : parcourir tous les `#RRGGBB` du SVG, convertir en HSV, ne transformer QUE la
famille visee (ici teinte 0,055-0,17 et S>0,15) — le verre, le cadran et l'ombre restent
intacts. 208 couleurs sur 295 modifiees en une passe. Ecart de teinte : +7,1 -> **+0,2 deg**.
⭐ La luminosite ne descend qu'a moitie (+0,127 -> +0,063) : normal, les reflets blancs du
verre (hors famille) tirent la moyenne. C'est le comportement voulu.
⭐⭐ **C'est l'argument commercial du vectoriel** : sur une image matricielle, « rends le
laiton plus rose » = REGENERER et tout perdre. Ici : transformation ciblee, reversible,
versionnee, en une minute. Decisif sur un contrat a revisions comptees.
Script : `scripts/tools/svg-conformite-pipeline.py` mesure la conformite ; le recalage est
un script ad hoc de ~25 lignes (re.subn + colorsys), a extraire si un 2e cas se presente.

## ⭐⭐⭐ "ON EST DEDANS" NE SE DESSINE PAS AVEC UNE CAMERA EXTERIEURE (2026-09-06)
Brief : « on est DEJA a l'interieur d'un reseau d'arcs courbes, tres pres ».
Reflexe naturel (faux) : reprendre la projection du globe et RAPPROCHER la camera.
⛔ **Depuis l'exterieur d'une sphere on voit toujours une CALOTTE** : un horizon courbe
et un grand vide au-dessus. Rayon 2050 -> arcs quasi droits (lit "grille"). Rayon 700 ->
on lit un POLE DE GLOBE. Rayon 1150 -> pareil, 2/3 du cadre vide. 3 essais, meme famille
de defaut : c'est le POINT DE VUE qui est faux, pas le dosage.
⛔ 4e essai, point de fuite DANS le cadre : tous les arcs convergent visiblement en un
point = **etoile / explosion**, pas un reseau qui entoure.
⛔ 5e, point de fuite rejete tres loin : les meridiens sortent du cadre (il ne restait que
les paralleles). Poser des arcs par un ANGLE depuis un point lointain ne garantit pas
qu'ils traversent l'image.
✅ **Construction retenue : poser chaque arc par son PASSAGE DANS LE CADRE**, pas par un
angle. Un meridien = parabole verticale ancree a une abscisse `ax` sur la mediane +
courbure `bow` ; un parallele = arc tres plat de concavite OPPOSEE. Les deux familles se
croisent, on pose un noeud a chaque intersection -> volume lisible, cadre rempli, et par
construction chaque trait traverse l'image.
⭐ **Verifier par une grille de couverture** (6x4, comptage de pixels non-fond) AVANT de
regarder : ca prouve qu'aucune cellule n'est vide. Ici 19-113 pour-mille partout.

## ⭐⭐ N ETATS D'UNE MEME ANIMATION = UN SEUL GENERATEUR (2026-09-06)
Quand on livre plusieurs poses-cles destinees a etre MORPHEES l'une dans l'autre, les
ecrire dans des fichiers separes garantit qu'elles ne se raccorderont pas. Un seul script
qui partage la projection, le centre, les rayons et les constantes d'orbite (`ORB1`,
`R_GLOBE`, `globe_groups()`, `signal_dot()`) donne des etats geometriquement coherents :
l'anneau de l'etat 2 EST celui de l'etat 3, le limbe du globe DEVIENT le cadran de l'etat 4.
Bonus : une correction de palette ou de rayon se propage aux 5 fichiers en une passe.

## ⭐⭐ GLYPHES : UN PATH PAR LETTRE, JAMAIS PAR MOT (2026-09-06)
`text_path()` (un `d` pour toute la chaine) suffit pour un libelle statique, mais un LOCKUP
sera anime lettre par lettre (stagger). Ajouter `glyph_paths()` qui renvoie [(char, d)] et
emettre `<path id="earth-1-E">` : l'animateur a la maille fine, le groupe `wordmark-earth`
garde la maille large. 10 lignes, et ca evite de re-livrer.
⭐ **Egaliser deux lignes d'un lockup empile par le SUIVI, pas par la taille** : viser une
largeur cible commune (`TARGET`) et deduire le tracking de chaque mot
(`(TARGET - largeur_naturelle) / (n-1)`). Sans ca EARTH et SUZY font des largeurs
differentes et le bloc penche. ⚠️ Les multi-M des glyphes sont NORMAUX (un sous-chemin par
lettre/contre-forme) : la regle "un seul M" ne vise que les traits animes au dashoffset —
controler `stroke is not None` dans le gate, sinon on se signale un faux defaut.

## ⭐⭐⭐ BOUCLE HORIZONTALE PAR HARMONIQUES ENTIÈRES (2026-09-08, décor fond cauri)
Un décor destiné à défiler horizontalement en boucle (parallax, ticker, fond de jeu) doit
raccorder x=0 à x=LARGEUR **par construction**, pas par un ajustement visuel après coup.
Recette : toute silhouette ondulée = somme d'harmoniques `y(x) = y0 + Σ amp_k * sin(2*pi*k*x
/LARGEUR + phase_k)` avec **k entier**. Conséquence mathématique directe : la fonction a une
période EXACTE de `LARGEUR`, donc `y(0) == y(LARGEUR)` sans approximation — pas besoin de
retoucher les bords à la main. Vérifié en rendant le SVG en PNG et en comparant la colonne
de pixels x=0 à x=LARGEUR-1 (écart <2%, imputable à l'anti-aliasing du rasterizer, pas à la
géométrie). Pour des éléments ponctuels (masses/particules) qui doivent aussi boucler :
les positionner à des `x = i * (LARGEUR/n) + jitter`, pas au hasard — garantit la même
densité de part et d'autre de la couture.
⛔ **Masses régulièrement espacées en `<ellipse>` parfaites = motif de "pois"**, pas un
relief organique (vu au rendu, pas supposé). Remplacer par un polygone à rayon variable par
lobe (angle divisé en n_lobes, rayon interpolé entre offsets aléatoires déterministes) et
réduire la densité (ex. 9→5 masses) : la silhouette lit comme un relief dessiné, pas comme
une grille. Idem pour les bandes ondulées : 3-4 harmoniques = "sinusoïde de manuel" trop
propre, 6-7 harmoniques (amplitude décroissante en 1/k) = silhouette organique crédible,
toujours strictement périodique.
