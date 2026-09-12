# RIG · LOTTIE · MOUVEMENT ASYMÉTRIQUE — fiche de déclenchement

> ⭐ **Extraite de `FICHE-GESTE-ANIME.md` le 2026-09-11.** Contenu INCHANGÉ, seulement déplacé :
> la fiche mère s'injecte sur tout code de mouvement Remotion, où ce bloc (rig, calques Lottie,
> parentage, anatomie) est hors-sujet — 37 % de contexte inutile à chaque injection.
> ⚠️ Si ce que tu lis ne correspond PAS au réel sous tes yeux : **c'est la FICHE qui a tort**.

> À ouvrir dès qu'on touche : un rig, un calque/précomp Lottie, un parentage, une anatomie
> articulée, ou qu'on règle l'asymétrie d'un geste.

## ⭐⭐ LE RIG — animer par ROTATION, pas en redessinant (2026-08-29, mesuré)

Démontage de 5 personnages pro (corpus kamotion). **C'est du rigging par parentage.** Le
personnage est dessiné UNE fois, découpé en membres, chaque membre est un calque accroché au
suivant, avec son pivot sur l'articulation. Mesure sur le Hiker (32 calques) :

| | |
|---|---|
| calques avec un `parent` | **84 %** (chaînes jusqu'à 4 niveaux) |
| part de l'animation en ROTATION | **90 %** — la géométrie ne change pas |
| clés par membre, cycle de marche | **7** (deux poses en ping-pong) |
| déphasage entre membres | **41 % du cycle** |

⛔ Le seul redessin est le VISAGE (expression). Aucune forme animée du corpus ne dépasse
**13 sommets** — personne ne redessine une silhouette. ⭐ Conséquence directe : le rig ne
demande l'anatomie qu'en version FIGÉE, sans variantes.

**Chez nous, le rig se DÉCLARE dans le SVG** (`svg2lottie_scene.py` le porte) :

    <g id="bras" data-parent="torse" data-pivot="121,250">   <!-- l'EPAULE, en x,y -->
    <g id="main" data-parent="bras"  data-pivot="107,466">   <!-- le POIGNET -->

⛔ `data-parent` vise le **NOM DE CALQUE** réel (`head-base`), pas l'id du groupe.
⛔⛔ **`data-pivot="haut"` est FAUX pour un MEMBRE articulé** (mesuré 2026-08-29) : à cause de la
réserve de recouvrement, le sommet de la boîte est **10-20 px AU-DESSUS** du vrai centre
articulaire → les bras **s'écartent au lieu de tourner**. Déclarer des `x,y` anatomiques
(épaule, coude, poignet, hanche, genou, cheville). Notre référence n'a plus **aucun** `"haut"` :
`grep` sur `perso-corps-entier/assets/perso-neutre-v3.svg` = **14 pivots `x,y`, 0 `"haut"`**.
✅ Les mots-clés haut/bas/centre restent valides pour un élément **NON articulé** (oreille, langue).
⛔ Le pivot se déduit de l'ANATOMIE : une oreille pivote à son attache au crâne (pas au centre
de sa boîte), une langue à sa racine, un iris ne pivote pas — il se déplace.
⛔⛔ Dans Lottie, `a` est le point qui vient se poser sur `p` : **déplacer l'ancre seule DÉCALE
le dessin**. Les deux bougent ensemble.
⛔ **Le rig se porte sur le GROUPE, pas sur ses pièces.** Un œil = 4 calques : poser le pivot sur
chaque forme l'applique 4× et il ne s'exprime jamais — c'est la **précomposition** qui porte
l'ancre et le parent.

## ⭐⭐ LE MOUVEMENT NATUREL EST ASYMÉTRIQUE (2026-08-29, mesuré au rendu)

Une oreille qui se dresse **monte vite et retombe lentement**. Réglage validé à l'œil :

    montee 0,15 s · depassement 0,10 s (x1,12) · maintien 0,35 s · retombee 0,50 s
    → rapport 1 pour 3   (a 60 fps : 9 · 6 · 21 · 30 — animer.py:113-116)
    ⛔ Ce sont des SECONDES : les reconvertir a la cadence du projet (a 30 fps, moitie moins de frames).

⛔ Symétrique, ça fait **essuie-glace** — c'était le défaut de ma V1, corrigé sur remarque
d'Aziz. Le muscle tire vite, la gravité ramène doucement.
⭐ Même principe pour un regard : l'iris **saute** (0,02 s entre deux cibles), il ne glisse
jamais. Interpoler doucement tue l'effet — aucun œil ne glisse.
⭐⭐ **L'asymétrie ENTRE MEMBRES PAIRS compte autant que l'asymétrie dans le temps** : oreilles
déphasées (0,33 s / 1,67 s dans l'original), sourcil droit **2× plus actif** que le gauche
(12 clés contre 6). En phase = un robot ; deux sourcils synchrones = un visage inerte.
⛔ **Un dosage mesuré sur une pièce pro ne se transpose pas tel quel — l'adapter et le DIRE** :
iris posé à 12 px (mesuré 33), langue à 14° (mesuré 70), sinon ils sortent de leur pochoir.
⭐ Clignement : ecrasement en Y sur **4 frames (0,067 s a 60 fps)**, toutes les 2,4 s — `animer.py:150`. Plus long = l'air endormi ; plus court = invisible.

## ⛔⛔ LES PIÈGES DE L'ANIMATION LOTTIE

⛔⛔ **LE RÉFÉRENTIEL, PAS LA VALEUR — 3 fois le même jour (30/08).** (1) `monte` écrivait un
delta `[0,0]` alors que `p` portait déjà le centre → la volute fumait depuis le COIN DE L'ÉCRAN ;
(2) `parcourt` écrasait la position des calques IMAGE (deux référentiels coexistent : un calque
de formes a `p=[0,0]`, un calque image porte sa vraie position) → photo au coin, médaillon
arrivant VIDE ; (3) `livrer_piece.py` fusionnait des calques portant CHACUN leur transform →
encre 70,3 % → 2,6 %, pièce VIDE. **À chaque fois la valeur était juste, son référentiel faux.**
⭐ Avant d'écrire une position ou une échelle sur un calque converti : lire ce que `ks.p` / `ks.a`
portent DÉJÀ — la géométrie garde ses coordonnées absolues.

⛔⛔ **UN TEST QUI VISE LA FONCTION ET PAS LE DISPATCH PASSE AU VERT SUR DU CODE MORT.**
`parcourt` a été livré avec une branche d'aiguillage référençant des variables INEXISTANTES ; le
test appelait `parcourir()` en direct, il passait pendant que le chemin réel était cassé.
**Viser `animer()`, la porte d'entrée** — jamais la fonction interne.

⛔ **UNE PLANCHE DE CONTRÔLE DIRIGE L'ŒIL, ELLE NE LE REMPLACE PAS.** Les pointes de flèche du
gabarit étaient visibles **60 frames trop tôt** — encre correcte, frames distinctes, aucune mesure
ne l'a signalé. ⭐ Règle qui en sort : **une pointe ne se TRACE pas, elle APPARAÎT** quand le trait
arrive (`("fondu", 88, 96)` calé sur la fin du `("trace", 60, 95)`).

## LES PIÈGES PLUS ANCIENS (payés le 2026-08-29)

1. **Chaque calque porte sa PROPRE fenêtre `ip`/`op`.** Allonger la durée du DOCUMENT ne suffit
   pas : les calques cessaient d'exister à la frame 60, l'animation se figeait — et le fichier
   restait parfaitement VALIDE, avec un script annonçant « 12 gestes posés ». Trouvé par un
   **compteur d'images distinctes** (3 sur 8), jamais par le rapport.
2. **Un geste se lit dans les KEYFRAMES, pas seulement au rendu.** Une oreille restée dressée
   2 secondes ressemble, à l'œil, à un maintien voulu. C'est en lisant les clés produites que
   le blocage se voit.
3. **Faire tourner le parent fait tourner TOUT.** En animant la tête de ±4°, tout le visage
   basculait en bloc (« une tête en carton »). Le fichier pro fait l'inverse : le crâne bouge
   très peu, ce sont les DÉTAILS qui vivent. ⛔ Corollaire au DESSIN : un élément d'arrière-plan
   doit être CONTENU par la silhouette qui le couvre — les `ear-back` du chien dépassaient du
   crâne en rotation (2e paire d'oreilles apparente, supprimés).
4. **Une durée de geste ne se cale JAMAIS sur la PÉRIODE du cycle.** En calant la retombée sur
   `periode`, l'oreille restait dressée **2 secondes** (frames 66→186) : ça se lit comme un
   blocage, pas comme un soulèvement. Chaque temps a sa PROPRE durée, le repos prend le reste.
   `repro-chien/animer.py:117-122`.

