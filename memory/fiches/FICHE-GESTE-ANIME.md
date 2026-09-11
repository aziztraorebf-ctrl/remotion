# GESTE ANIMÉ — fiche de déclenchement (lire AVANT de régler un mouvement)

> Se déclenche quand on écrit du code de MOUVEMENT (`spring`, `interpolate` sur une position,
> une échelle, une opacité). Dit COMMENT régler un geste, pas quoi dessiner.
> ⚠️ Si ce que tu lis ne correspond PAS au réel sous tes yeux : **c'est la FICHE qui a tort**,
> corrige-la. Valeurs relevées le 2026-08-27, appliquées et vérifiées au rendu le 2026-08-28.

## ⛔⛔⭐⭐⭐ UN IMPACT NE SE DÉCLARE PAS, IL SE DÉDUIT (2026-09-10, 1 tour de révision client)

**La règle** : dès qu'un objet TOMBE, FRAPPE ou ATTERRIT — jamais une constante d'impact posée
à côté d'un `spring()` qui porte la position. Ce sont **deux horloges qui divergent en
silence**, et aucun réglage d'intensité ne rattrape un décalage.

**Ce que ça a coûté** : entrée portée par `spring({damping:11, stiffness:68, mass:0.9})` +
`IMPACT_FRAME = 32` écrit en dur. Simulation : la position atteignait le sol dès la **frame
~11**. L'objet restait donc posé, immobile, **0,67 s** avant que rebond + poussière + thud +
allumage ne se déclenchent. La cliente l'a vu tout de suite (« it slides in as a flat image,
slightly readjusting, then moving up and down afterward » · « the dust comes in later, when
the meter goes UP »), nous non — parce qu'on avait vérifié la PRÉSENCE de chaque élément, pas
leur COÏNCIDENCE.

⭐ **FIX structurel** : trajectoire explicite en `interpolate`, où `IMPACT_FRAME = FALL_FRAMES`
— le contact EST la fin de la chute, par construction. Une seule horloge, tout en découle.

⭐⭐ **AVANT DE LIVRER une chute, MESURER — c'est outillé depuis le 10/09** :
```bash
python3 scripts/tools/motion-timing.py <video.mp4> --max-frames 55 [--zone x0,y0,x1,y1]
```
Sort la frame de contact, si la chute accélère, le **DÉPART** des rebonds (pas leur sommet),
la stabilisation, et l'écart des attaques sonores au contact. **Le lancer aussi sur la
référence du client AVANT de coder** : ça donne les constantes au lieu de les faire deviner.
Validé : il distingue la version rejetée (rebond +3 frames, 3 pics) de la corrigée (+1, 2 pics).
⛔ **Le seuil se pose sur le DÉPART du rebond, jamais sur son SOMMET** : un seuil-sommet a classé
« défaut » la vidéo de référence de la cliente elle-même (contact f8, sommet f13 — rebond
exemplaire). ⭐ Un outil de mesure se calibre sur une pièce connue-BONNE avant de juger la nôtre.

⛔ **Corollaire — appliquer un réglage demandé sans voir sur quoi d'autre il tire.** Elle avait
demandé « slightly slower » ; ralentir la chute a **agrandi** le trou entre l'atterrissage réel
et l'impact codé en dur. La correction demandée a empiré le vrai défaut, jamais identifié.

⛔ **Corollaire — ne pas toucher à ce que le client n'a PAS critiqué.** En corrigeant le timing
j'ai aussi baissé la HAUTEUR du rebond (17 → 9 px) « pour faire sobre ». Elle n'avait jamais
parlé de la hauteur. Une valeur que le client a **vue et laissée passer** est le seul point de
référence validé qu'on ait : la changer en même temps qu'autre chose ajoute une inconnue.
⭐ **Suite (11/09)** : Aziz a rétabli 17, puis la cliente a elle-même demandé plus gros → **20 px**
(valeur courante). La valeur sur-corrigée n'a jamais survécu.

⭐⭐ **C'EST LE HANG TIME QUI REND UN REBOND LISIBLE, PAS L'AMPLITUDE** (2026-09-11, 2e tour).
Un aller-retour sans palier passe trop vite à 30 fps : essais à **22, 26, 28 px SANS palier = rien
de visible**, preuve que la hauteur n'était jamais le problème. ✅ Retenu : 20 px en 3 temps —
montée 3f / **SUSPENSION 3f** / chute 5f. Mesuré : le châssis tient sa hauteur de f12 à f15,
immobile dès f20. C'est la règle 4 de cette fiche appliquée à un REBOND, pas qu'à une entrée.
⛔ Dès qu'un mouvement rapide « ne se voit pas », vérifier d'abord s'il **marque ses extrêmes**
avant de toucher à son amplitude.

⛔⛔ **LA RÉFÉRENCE PERCEPTIVE D'UNE ATTENTE EST LA FIN DU MOUVEMENT, PAS L'ÉVÉNEMENT.**
L'allumage était DÉJÀ à 0,47 s du contact et la cliente le trouvait « very quick », alors qu'elle
demandait « half a second to one second after it lands ». **Tant que l'objet BOUGE, l'attente ne se
compte pas.** ✅ Mesurer la pause depuis `SETTLE_FRAME` (fin du rebond), jamais depuis
`IMPACT_FRAME`. Sans cette mesure on aurait conclu « elle se trompe » ou rallongé au hasard.

⭐⭐ **CE QUI FAIT LIRE « ÇA SE DISSIPE » EST L'ÉCARTEMENT, PAS LA BAISSE D'OPACITÉ.** De la
poussière réelle ne devient pas transparente sur place : elle s'écarte et se dilue. Mise sur le
mauvais levier = 2 dosages perdus (départ 0,6 → panache né ÉTROIT, débordant 2-3f trop tard ;
traîne 0,30 → invisible). ✅ Retenu : pic 0,78 → traîne 0,68, écartement 0,75 → 2,25.
⛔ **Un seuil de visibilité dépend de la DESTINATION** : sur un plateau filmé (bruit vidéo, décor
chargé, objet de 540 px dans un 1920), **0,30 d'opacité est SOUS le seuil**. Ce qui marche en gros
plan sur fond uni ne marche pas incrusté — juger tout dosage DANS son contexte final.

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
⚠️ **NON ÉPROUVÉS, vérifier au 1er usage** : bezier(0.77,0,0.175,1) · bezier(0.32,0.72,0,1) · cascade 30-80 ms · scale(0.95)+opacity 0.

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
toujours en bas** : la queue du renard s'attache en **HAUT** (`ancre_y=0.15`, `animate_scene.py`, clé `"queue"`).
⚠️ **`ancre_y` : 0 = HAUT de la bbox, 1 = BAS** (l'axe Y Lottie descend). ⛔ La 1re version de cette
fiche disait « ancrée à la BASE » et le docstring du code « 0 = centre » : **les deux étaient faux**,
corrigés au wrap. Une fiche qui ment clôture la recherche — c'est ce qu'elle existe pour empêcher.

## LE VOCABULAIRE (les 4 termes qui ont servi)

**anticipation** petit élan en sens INVERSE avant de partir · **follow-through** des parties
continuent et se posent après l'arrêt · **squash & stretch** déformer pour dire le poids ·
**stagger** cascade. ⭐ Ce lexique décrit ce que fait UN OBJET ; les 21 mouvements de caméra
décrivent ce que fait L'OBJECTIF — complémentaires, jamais concurrents.

## ⭐⭐ RIG · LOTTIE · MOUVEMENT ASYMÉTRIQUE → `FICHE-RIG-ET-LOTTIE.md`

> ⭐ **Extrait le 2026-09-11** : ces 96 lignes (rig par rotation, pièges Lottie, mouvement
> asymétrique, pièges anciens) ne s'appliquent PAS au mouvement Remotion pur, alors que cette
> fiche s'injecte sur TOUT code de `spring`/`interpolate`. 37 % de hors-sujet à chaque injection.
> **Le contenu est intact dans `memory/fiches/FICHE-RIG-ET-LOTTIE.md`** — l'ouvrir dès qu'on
> touche à un rig, un calque Lottie, un parentage ou une anatomie articulée.

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
