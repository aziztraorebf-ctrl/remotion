# Animer un objet MÉCANIQUE en SVG — modéliser + vérifier PAR CALCUL avant le render

**Cas déclencheur (2026-07-16, Sénégal Short D3, coffre-fort Beat 3)** : le mécanisme « porte de
coffre qui s'ouvre puis se ferme » a pris **5 tentatives sur 2 sessions** pour être correct, alors
que le mécanisme final (un disque qui s'écrase en largeur autour d'un bord fixe) est trivial une
fois compris. Chaque tentative ratée suivait le même anti-pattern : deviner un `transform`
(rotate/scale/pivot), coder, render, constater le bug (porte qui flotte, se détache, déborde,
apparaît « au milieu de nulle part », se lit comme un 2e objet fantôme), re-deviner. Aziz a dû
fournir 2 images de référence + annoter des flèches avant que je regarde vraiment la géométrie.

**Why** : un objet mécanique animé a une géométrie EXACTE et VÉRIFIABLE (un pivot est un point
précis, une ouverture est une trajectoire calculable). La deviner puis « corriger à l'œil » au
render est la source racine de la boucle d'essais — chaque render coûte ~1-2 min + un aller-retour
Aziz, et l'œil ne dit PAS *pourquoi* c'est faux (il faut le calcul pour ça). Les 3 bugs successifs
de ce cas étaient tous détectables par un simple calcul de 5 lignes AVANT de rendre :
- porte qui « flotte loin » = bras de levier du pivot >> taille de l'objet (calcul : position du
  bout de la porte à l'angle max) ;
- porte qui « déborde verticalement » = rotation d'un rectangle large fait bouger les coins en Y
  (calcul : extent Y à l'angle max vs hauteur du corps) ;
- porte « grise/désaturée » = pas un bug de couleur mais `doorOp` encore à ~0.4 à la frame de test
  (calcul : blend navy+fond à cette opacité = le gris observé, au pixel près).

**How to apply** — pour TOUT objet SVG à géométrie mécanique (porte, couvercle, cadenas qui
s'ouvre, tiroir, bras articulé, engrenage, roue, balance, levier, valve) :

1. **Image-cible D'ABORD** (règle [[SVG-FAISABILITE-AMONT]] appliquée au MOUVEMENT, pas juste à la
   forme statique) : si Aziz a une idée précise du mécanisme, demander/regarder une RÉFÉRENCE
   VISUELLE de l'objet dans ses états clés (ouvert / fermé / mi-course) AVANT de coder. Ne jamais
   déduire un mécanisme mécanique d'une description texte seule — c'est ce qui a coûté les 5 essais.
2. **Modéliser par calcul** (script Python jetable, `python3 -c "..."`) : poser le pivot exact, la
   trajectoire (rotate ? scale ? translate ?), et **calculer la position de l'objet à chaque
   état-clé** (0%, 50%, 100% d'ouverture). Vérifier NUMÉRIQUEMENT que : (a) l'objet reste dans le
   cadre attendu, (b) le point d'ancrage (charnière) ne bouge jamais, (c) rien ne déborde d'un axe
   où il ne devrait pas. Si le calcul montre un débordement/décalage → corriger le MODÈLE avant
   d'écrire une ligne de JSX.
3. **Préférer le transform qui garde un invariant explicite.** Pour un « door swing » vu de face :
   PAS `rotate()` (fait bouger les coins en X ET Y, imprévisible) mais `scale(sx, 1)` autour d'un
   bord fixe (le facteur Y reste 1 → zéro débordement vertical par construction, garanti sans même
   rendre). Modèle validé coffre : porte = disque dessiné en (0,0), `transform="translate(H,0)
   scale(sx,1) translate(-H,0)"` → le centre part vers `H*(1-sx)`, le bord droit reste fixe à `H`.
   Réutilisable pour tout couvercle/porte/panneau vu de face.
4. **Vérifier au render sur la BONNE frame** : calculer la frame où l'objet est dans l'état voulu
   ET pleinement opaque (pas en cours de fade) avant de juger — sinon on « voit » un bug de couleur
   qui n'est qu'un fade-in en cours (cf. le faux « gris »). Puis rendre 3-5 frames INTERMÉDIAIRES de
   la transition (pas seulement début/fin) pour confirmer l'absence de saut.
5. **Seuil d'escalade** : au bout de **2 essais ratés sur le même mécanisme**, STOP — ne pas
   re-deviner un 3e transform. Repartir du calcul (étape 2) ou demander une image de référence à
   Aziz. (Ici l'escalade a eu lieu trop tard : 4 essais avant de vraiment modéliser.)

**Le geste qui change tout** : un mécanisme animé se PROUVE sur papier (calcul) avant de se rendre.
Le render CONFIRME, il ne DÉCOUVRE pas. Si je ne peux pas expliquer par calcul pourquoi la porte
restera ancrée, je ne suis pas prêt à coder — je devine encore.

Lié à [[SVG-FAISABILITE-AMONT]] (voir la cible AVANT le code — étendu ici au mouvement),
[[WARMAP-ANIMER-OBJETS]] (quel outil pour quel objet — ce feedback ajoute le COMMENT géométrique
une fois l'outil = SVG maison choisi), [[feedback_reconnaitre-derive-investigation]] (2 échecs →
signaler/changer d'approche, pas un 3e essai à l'aveugle) et [[feedback_relire-lecon-avant-geste-similaire]]
(relire CE feedback avant tout prochain objet mécanique animé).

---

## Extension 1 — CADRAGE CAMÉRA : calculer la bbox projetée, jamais régler le scale à l'œil (2026-08-15)

Même principe (« modéliser par calcul avant de rendre »), appliqué au cadrage d'une carte : quand
plusieurs pays/zones doivent tenir dans le viewport, calculer la **bounding box PROJETÉE** (dans le
système de coordonnées de la projection — pas en lat/lon brut, qui ne reflète pas la distorsion) des
zones à inclure, puis en dériver le scale.

**Vécu (Gazoduc Acte 4)** : scale réglé à l'œil à `1.02`, ce qui laissait entrer l'Amérique du Sud et
toute l'Afrique australe dans le cadre — tout paraissait petit et faible. Le scale correct, calculé
depuis la bbox des pays qui devaient réellement être visibles, était `1.98` : je cadrais **deux fois
trop large** sans le voir. Un modèle externe l'a classé défaut n°1 avant que je le remarque.

**How to apply** : script jetable qui parse les paths des pays cibles, calcule min/max x/y, puis
`scale = min((W - 2*pad) / bboxW, (H - 2*pad) / bboxH)` et `tx/ty` pour centrer. Vérifier
NUMÉRIQUEMENT avant le premier render, pas après.

## Extension 2 — ÉLÉMENT QUI SUIT UN TRACÉ COURBE : tangente par échantillonnage arrière (2026-08-15)

Cas distinct du pivot fixe : ici l'objet suit un CHEMIN (comète/flèche/impulsion glissant le long
d'une polyligne) et doit s'orienter selon la courbure **locale**.

**2 bugs successifs** : (1) impulsions codées en cercles de rayon constant — lisent comme des billes
timides, là où le storyboard montrait des traînées directionnelles ; (2) après passage en comètes, une
tangente droite **extrapolée depuis la tête** faisait sortir la traînée du tracé dans les virages
serrés (côte du golfe de Guinée) — elle coupait à travers la courbe, dans l'océan.

**Fix** : échantillonner plusieurs points EN ARRIÈRE sur la polyligne réelle et construire la traînée
comme une polyligne qui épouse la courbe — pas un segment droit depuis une dérivée instantanée.
Conversion longueur-écran → delta-t via la longueur totale du tracé (à mettre en cache : la recalculer
par élément et par frame est inutilement coûteux).
