# GESTE ANIMÉ — fiche de déclenchement (lire AVANT de régler un mouvement)

> Se déclenche quand on écrit du code de MOUVEMENT (`spring`, `interpolate` sur une position,
> une échelle, une opacité). Dit COMMENT régler un geste, pas quoi dessiner.
> ⚠️ Si ce que tu lis ne correspond PAS au réel sous tes yeux : **c'est la FICHE qui a tort**,
> corrige-la. Valeurs relevées le 2026-08-27, appliquées et vérifiées au rendu le 2026-08-28.

## ⭐ POURQUOI CETTE FICHE EXISTE (preuve, pas conviction)

Le 2026-08-28, l'animation d'un logo client a été jugée « excellente » par Aziz — écrasement à
l'impact, timing asymétrique, décalage des éléments secondaires. Il a demandé si c'était grâce
aux skills de design installés. **Vérifié : NON.** Aucun skill installé, aucune fiche pertinente
injectée. Ces choix venaient des rapports de lecture **encore présents dans le contexte de cette
session-là**. ⛔ Dans une session neuve, tout était perdu.
**Le savoir a payé UNE fois, par accident de contexte.** Cette fiche le rend reproductible.

## LES COURBES — ce qui est PAYÉ, ce qui est seulement LU

```ts
// ✅ PAYÉE — LoadUpAnime.tsx:29, rendu validé par Aziz le 2026-08-28
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);   // entrées, le défaut
```
⚠️ **NON ÉPROUVÉS, vérifier au 1er usage** : bezier(0.77,0,0.175,1) · bezier(0.32,0.72,0,1) · cascade 30-80 ms · scale(0.95)+opacity 0 · primitive `respire` (zéro partition l'utilise, revérifié 2026-08-30).

⛔ Les easings CSS natifs (`ease`, `ease-in-out`) sont trop faibles — ils n'ont pas de punch.

⚠️ **`bezier(0.4, 0, 0.2, 1)` n'est PAS interdite — elle est le RÉFLEXE à ne pas suivre les yeux
fermés.** C'est la courbe Material par défaut, celle qu'on écrit sans y penser. Elle est en dur
dans **10 fichiers du repo** (série cacao-chocolat, `SahelWarMapEngine`, protos SVG) — tous
rendus et validés : **on ne les corrige pas rétroactivement.** La règle vaut pour le NEUF.
⛔ Le vrai interdit reste d'**approximer une valeur relevée** : si une source donne
`0.23, 1, 0.32, 1`, on la copie exactement.

## LES RÈGLES QUI ONT PAYÉ (par ordre d'effet observé)

1. **⭐ UN SEUL POINT FOCAL.** On anime CE QUI PORTE LE SENS, pas tout. Sur le logo LoadUp,
   seule la flèche bouge vraiment (elle monte : c'est le nom même). Le reste se pose autour
   sans la concurrencer. Faire bouger deux choses également = plus rien ne ressort.

2. **⭐ TIMING ASYMÉTRIQUE** — « lent là où l'on décide, rapide là où le système répond ».
   Une montée ralentit en arrivant ; une chute accélère jusqu'à l'impact. En vidéo :
   l'arrivée mérite du temps, le départ n'en mérite pas (l'attention part déjà ailleurs).
   Ratio MESURÉ sur LoadUp (le seul cas payé) : montée 600 ms / chute 267 ms = **0,44**.
   ⛔ Le « 150/300 ms » des skills est un budget de RÉACTIVITÉ — ne pas le copier (cf. § DURÉES).

3. **⭐ L'ÉCRASEMENT À L'IMPACT.** Une chute qui s'arrête net se lit comme un BUG de timing,
   pas comme un poids. Tasser la forme (`scale(1, 0.86)` puis retour, ancré sur le point de
   contact) donne la masse. Vérifié : c'est ce détail qu'Aziz a cité en premier.

4. **⭐⭐ UN GESTE S'ÉCRIT, IL NE SE RÈGLE PAS.** C'est la correction d'Aziz qui a fait passer
   le rendu de « correct » à « excellent », sur le MÊME logo. Ma v1 était un ressort : la flèche
   monte et dépasse un peu par simple physique — correct, mais **ça ne raconte rien**, le
   dépassement est une conséquence, pas une intention. Sa v2 est un geste en 3 temps :
   **monte haut → SUSPEND → retombe.** La suspension crée une ATTENTE, la chute la résout.
   ⛔ **Le temps suspendu n'est PAS un temps mort** : la forme y est immobile, mais l'œil attend.
   Le retirer supprimerait tout l'effet. Chez LoadUp : 8 frames de suspension sur 34.

5. **DÉCALER LES SECONDAIRES APRÈS LE MOMENT FORT.** Sur LoadUp, le « p » et le symbole
   déposé entraient PENDANT la suspension et volaient l'attention : décalés après l'impact.

6. **⭐ LE GESTE SE VÉRIFIE FRAME PAR FRAME, PAS À L'ŒIL.** Après la révision demandée par Aziz
   (« monte plus haut, redescend brutalement »), la trajectoire a été relevée image par image pour
   vérifier que le code faisait bien ce qui était demandé. Un geste en 3 temps se contrôle sur ses
   4 points d'ancrage (`[12, 30, 38, 46]` chez LoadUp), jamais en regardant le mp4.

⛔ Les valeurs d'UI des skills (modale 0.96 / menu 0.95) ne se transposent PAS telles quelles à une
vidéo — et elles étaient présentées comme « payées » dans la 1re version de cette fiche : c'était
faux, et c'est exactement la faute que cette fiche existe pour empêcher.

## DURÉES — transposées, pas copiées

Les valeurs des skills sont des budgets de RÉACTIVITÉ (outils vus 100×/jour, réflexe =
soustraire). ⛔ **Une vidéo est vue UNE fois** : leur propre cadre nous classe dans « rare /
première fois », la seule case où ils autorisent durées longues et cascade généreuse.
**Prendre leur vocabulaire et leurs courbes ; laisser leur austérité.**

Ce qui transfère : la **hiérarchie** (petit = rapide, grand = lent) et la durée proportionnée
à la taille de l'élément. Repères : micro-retour 100-160 ms · élément 200-320 ms ·
section 400-800 ms · plan entier 800-1600 ms.

## ⭐⭐ LES PRIMITIVES OUTILLÉES — ne pas les re-coder à la main (2026-08-28)

`src/projects/_client-sim/lottie-ui/tools/animate_scene.py`, appelées par une **partition**
`{motif_de_nom: (type, ...)}`. ⛔ Vérifier qu'une primitive n'existe pas AVANT d'écrire des
clés à la main — les 4 dernières sont nées de gestes que j'avais d'abord codés en dur.

| Primitive | Ce qu'elle fait | Signature |
|---|---|---|
| `fondu` | apparition en opacité | `(debut, fin)` |
| `pop` | apparition + ressort discret | `(debut, fin)` |
| `trace` | le trait se dessine (trimPath) | `(debut, fin)` |
| ⭐ `geste3` | **monte haut → SUSPEND → retombe** + écrasement | `(f0, f_haut, f_susp, f_impact, hauteur)` |
| ⚠️ `respire` | oscillation lente, EN BOUCLE — **ÉCRITE, JAMAIS UTILISÉE** | `(debut, fin, ampleur, periode)` |
| ⭐ `balance` | rotation alternée, ancrée au POINT D'ATTACHE | `(debut, fin, angle, periode, ancre_y)` |
| ⭐ `cligne` | les yeux se ferment 2 frames | `(debut, fin, periode)` |

⛔ **`respire` n'est PAYÉE PAR RIEN** (vérifié au wrap : zéro partition l'utilise). Les 3 autres
ont leur usage réel — `geste3` sur LoadUp, `balance` et `cligne` sur le renard, plus la validation
d'Aziz à l'œil dans Creator. **Vérifier `respire` au 1er usage au lieu de la croire éprouvée.**

### ⭐ LA BOUCLE DE VIE — le défaut qu'on ne voit pas en regardant le début
Sur le renard, tout était juste **jusqu'à f70**… puis **plus rien pendant 80 frames**.
**Une mascotte figée n'est pas une mascotte, c'est une image qui est apparue.** `respire`,
`balance` et `cligne` existent pour ça. ⭐ **Aucun rigging nécessaire** — que des rotations
sur des groupes déjà nommés. Repères mesurés : clignement **2 frames** (66 ms — plus long,
le personnage a l'air endormi), période **~38 frames**, balance **4,5°**.
⛔ `balance` doit AUSSI poser un fondu d'entrée : il n'anime que la rotation, donc sans lui
l'élément est visible dès la frame 0, avant tout le reste.

### ⛔⛔ LE PIÈGE D'ANCRAGE — il a touché LoadUp sans qu'on le voie
Un calque converti a son ancre ET sa position à **`[0,0]`** (la géométrie porte ses
coordonnées absolues). Sans recentrage, **la forme pivote et grandit depuis le COIN DE
L'ÉCRAN** — sans aucune erreur. `centre_du_calque()` le fait, mais elle **renvoyait `None`**
sur tout fichier passé par `group_layers.py` (elle cherchait les chemins à une profondeur
fixe et trouvait des `gr`). ⭐ **Conséquence rétroactive** : l'écrasement de LoadUp validé
le 28/08 était ancré à `[0,0]` — il « marchait » par chance. Corrigé.
⛔ Pour une rotation, l'ancre va au **POINT D'ATTACHE**, pas au centre — et **ce point n'est pas
toujours en bas** : la queue du renard s'attache en **HAUT** (`ancre_y=0.15`, `animate_scene.py:149`).
⚠️ **`ancre_y` : 0 = HAUT de la bbox, 1 = BAS** (l'axe Y Lottie descend). ⛔ La 1re version de cette
fiche disait « ancrée à la BASE » et le docstring du code « 0 = centre » : **les deux étaient faux**,
corrigés au wrap. Une fiche qui ment clôture la recherche — c'est ce qu'elle existe pour empêcher.

## LE VOCABULAIRE (les 4 termes qui ont servi)

**anticipation** petit élan en sens INVERSE avant de partir · **follow-through** des parties
continuent et se posent après l'arrêt · **squash & stretch** déformer pour dire le poids ·
**stagger** cascade. ⭐ Ce lexique décrit ce que fait UN OBJET ; les 21 mouvements de caméra
décrivent ce que fait L'OBJECTIF — complémentaires, jamais concurrents.

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

## ⛔⛔ LES 4 PIÈGES DE L'ANIMATION LOTTIE (payés le 2026-08-29)

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

## LES 2 TESTS À PASSER AVANT DE PRÉSENTER

- **Test de la pause** : arrêter sur n'importe quelle frame — l'info doit être là. Une scène qui
  ne tient que par son mouvement n'a pas de composition. `scripts/tools/test-pause.py`
- **Test de la coupe** : un changement à cheval sur une coupe est structurellement invisible
  (cécité au changement). `scripts/tools/test-coupe.py`
⚠️ Les deux sont des SIGNAUX. Un fondu volontaire est un faux positif normal, pas un défaut.

⛔ **PIÈGE DE MESURE — un geste composite se mesure COMPOSANTE PAR COMPOSANTE.** Une trajectoire
qui « ressemble » à ce qui a été demandé peut être fausse sur une de ses dimensions. Sur la
révision de LoadUp, j'ai relevé la position verticale du vert frame par frame pour VÉRIFIER les
3 temps (montée 420→378 · suspension à 375 · chute →444). Sans cette mesure, on valide sur une
impression. → recoupe [[mesurer-composante-par-composante]] et [[re-mesurer-l-entree-avant-de-re-doser-un-placement]].

## ⛔ CE QUI NE S'APPLIQUE PAS À NOUS
≈60 % du corpus UI d'origine (interruptibilité, `prefers-reduced-motion`, hover, scroll, GPU,
choix de bibliothèque) : rien n'interrompt une vidéo rendue. Sous Remotion, `useCurrentFrame` +
`interpolate`/`spring` — la question de l'outil ne se pose jamais.

## ⭐ LE GESTE DE TAP — le doigt NE PLIE PAS (2026-08-28, mesuré sur 3 références)
**Zéro morphing de forme** sur les 3 mains de banque qui fonctionnent. L'illusion du toucher vient
de deux choses : le **DÉPLACEMENT** de la main (elle descend, elle remonte) et l'**ONDE DE CONTACT**
(1-2 cercles qui naissent au point de touche et se propagent en s'effaçant). Certaines références
font même l'appui avec **2 calques superposés dont on bascule l'opacité**.
⛔ On animait à grands frais ce que personne n'anime. Démo : `_client-sim/repro-redeem/MainGreffeeDemo.tsx`.

⭐⭐ **LE DÉCALAGE EST LE GESTE** (2026-08-30). Un mouvement appliqué EN BLOC et le même appliqué
PAR ÉLÉMENT DÉCALÉ ne se ressemblent pas : le bloc a l'air d'un **panneau qu'on pousse**, le décalé
d'une scène qui se compose. Ce n'est pas un raffinement de fin de passe.
⛔⛔ **Mesurer le FICHIER ne remplace pas mesurer l'IMAGE** : le scan du `.lottie` annonçait
« 37/38 calques en opacité seule » — **exact**, et pourtant un glissement d'ensemble existait,
produit par l'ENCHAÎNEMENT des apparitions. Un défaut d'ÉMERGENCE ne vit dans aucune propriété.

⭐⭐⭐ **ANTICIPATION + DÉPASSEMENT — réclamés par 4 voix sur 4** au DA-brief (2026-08-30), leur
point de convergence le plus net. Un objet vivant RECULE d'abord, DÉPASSE sa cible, puis revient.
⛔ **À DOSER** : sur une interface l'excès fait jouet — **≤ 10 %** sur le contenu, **18 %**
uniquement sur L'ACTION CLÉ que le récit désigne. Code : `repro-onboarding/cascade.ts` (`elan`).

⛔ **Les `s` (scale) d'un calque ne donnent PAS sa taille à l'écran** dès qu'il passe par une
PRÉCOMP à ancre décalée : les transforms se composent. Mesurer chaque calque **ISOLÉ** (rendu seul,
bbox du non-blanc). Écarts réels : doc **×3,87** · photo **×6,83** · curseur **×7,30**.

⛔⛔ **UNE CORRECTION DEMANDÉE PEUT PORTER UN DIAGNOSTIC FAUX — MESURER AVANT D'OBÉIR.**
Aziz : « la main est trop grande ». ⛔ **Chiffre CORRIGÉ le 2026-08-30** — cette fiche annonçait
**287 px**, c'était FAUX (287 = bbox × 134 %, un scale absent du fichier). Mesure refaite dans le
`.lottie` : bbox **214 px**, scale **62 % au repos / 70 % au pic** → **133 à 150 px** à l'écran,
contre **110** chez nous. La référence n'est donc que ~1,2× plus grosse, pas 2,6×.
⭐ **L'écart de chiffre inversait la leçon** : à 287 px la taille redevient une piste crédible ;
à 133 elle est INNOCENTÉE, et c'est ce qui désigne la vraie cause.
⭐⭐ **La vraie cause était l'ANCRE** (la référence tient sa main par le BOUT DU DOIGT, nous par le
coin du dessin) — pas la taille, pas la position latérale : les deux ont été essayées sans effet.
→ `memory/feedbacks/feedback_recouvrement-est-un-probleme-d-ancre-pas-de-dosage.md`
⛔ Le symptôme ressenti nomme la gêne, jamais sa cause.
