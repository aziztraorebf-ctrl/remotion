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
⚠️ **LUES dans les skills, JAMAIS écrites ici** (zéro occurrence dans tout le repo — vérifier au
1er usage, ne pas les citer comme éprouvées) : `bezier(0.77, 0, 0.175, 1)` (déplacement à l'écran)
· `bezier(0.32, 0.72, 0, 1)` (panneaux, courbe iOS).

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

⚠️ **NON ÉPROUVÉ ICI, à vérifier au 1er usage** : la cascade (stagger) 30-80 ms entre éléments,
et l'entrée à `scale(0.95)` + opacity 0 (« rien n'apparaît de rien » — ⛔ les valeurs d'UI des
skills, modale 0.96 / menu 0.95, ne se transposent PAS telles quelles à une vidéo). LoadUp n'a NI cascade
(`apparition(0)` appelé une seule fois, un seul groupe de lettres) NI scale à l'entrée — que des
fondus. ⛔ Ces deux lignes étaient présentées comme « payées » dans la 1re version de cette fiche :
c'était faux, et c'est exactement la faute que cette fiche prétend corriger.

## DURÉES — transposées, pas copiées

Les valeurs des skills sont des budgets de RÉACTIVITÉ (outils vus 100×/jour, réflexe =
soustraire). ⛔ **Une vidéo est vue UNE fois** : leur propre cadre nous classe dans « rare /
première fois », la seule case où ils autorisent durées longues et cascade généreuse.
**Prendre leur vocabulaire et leurs courbes ; laisser leur austérité.**

Ce qui transfère : la **hiérarchie** (petit = rapide, grand = lent) et la durée proportionnée
à la taille de l'élément. Repères : micro-retour 100-160 ms · élément 200-320 ms ·
section 400-800 ms · plan entier 800-1600 ms.

## LE VOCABULAIRE (les 4 termes qui ont servi)

**anticipation** petit élan en sens INVERSE avant de partir · **follow-through** des parties
continuent et se posent après l'arrêt · **squash & stretch** déformer pour dire le poids ·
**stagger** cascade. ⭐ Ce lexique décrit ce que fait UN OBJET ; les 21 mouvements de caméra
décrivent ce que fait L'OBJECTIF — complémentaires, jamais concurrents.

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

Interruptibilité, `prefers-reduced-motion`, hover/press, scroll, propriétés GPU, choix de
bibliothèque : rien n'interrompt une vidéo rendue, personne ne survole, chaque frame est
calculée hors temps réel. ≈ 60 % du corpus d'origine. Sous Remotion : `useCurrentFrame` +
`interpolate`/`spring`, la question de l'outil ne se pose jamais.
