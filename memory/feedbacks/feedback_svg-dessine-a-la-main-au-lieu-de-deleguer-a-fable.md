# ⛔⛔ J'ai DESSINE les SVG a la main dans le TSX au lieu de les faire dessiner par Fable

**Date** : 2026-08-28 · **Correction d'Aziz**, session repro UI Lottie.

## CE QUI S'EST PASSE

Reproduction d'une piece d'interface vendue (flux « Redeem All »). J'ai ecrit tous les elements
visuels **a la main, en JSX**, directement dans `ReproRedeem.tsx` : la medaille en `<circle>`
repetes, le paquet cadeau en `<rect>` empiles, la main-curseur en deux `<path>` ecrits au juge.

Le rendu tenait mecaniquement (recit juste, tempo juste, echelle corrigee a 89 % apres mesure),
mais la **finition** etait nettement sous la reference. Aziz, en regardant la planche :
> « pourquoi on n'est pas passe par un agent Fable pour commencer ? [...] quand on passe par
> l'agent Fable [...] c'est toujours un niveau 2-3 fois plus superieur. »

## POURQUOI C'EST UNE ERREUR DE DOCTRINE, PAS UN CHOIX DISCUTABLE

`CLAUDE.md` designe **Fable 5 appele comme AGENT Claude Code** comme le **defaut** pour tout
SVG maison (scenes, objets, jetons) — ZERO appel API, inclus dans l'abonnement Max. Mode **MAX**
pour le complexe (narratif, organique, visage, main).
Et `SVG-SCENES-GENERATIVES.md` regle n°0 : **le modele DESSINE le statique en `<g id>` nommes,
NOUS animons.** J'ai fait les deux moities moi-meme.

⭐ **La cause racine : j'ai saute l'etape MOTEUR.** J'avais « coder les formes en JSX » en tete
depuis LoadUpAnime (qui, lui, venait d'un SVG Recraft — pas dessine a la main). Je suis parti sur
le moteur deja en tete au lieu de me demander *quel registre d'expression* produit ce dessin.
C'est mot pour mot l'anti-pattern decrit dans `MOTEURS-VISUELS-ET-SOCLE.md`.

## ⛔ LE SIGNAL A RECONNAITRE (pour la prochaine fois)

**Si je m'apprete a ecrire plus de ~15 lignes de `<path>` / `<circle>` / `<rect>` a la main dans
un `.tsx`, c'est le signal.** Ce n'est pas de l'animation, c'est du DESSIN — et le dessin ne
s'ecrit pas au clavier chez nous, il se delegue. Un `Array.from({length:20}).map()` qui fabrique
une couronne de cercles est un aveu : je suis en train de simuler au code ce qu'un dessinateur
ferait mieux.

⭐ Corollaire mesure le meme jour : la reference avait des **degrades** partout
(`#799dff`→`#cf89ff` sur les boutons, 7 arrets sur la medaille) la ou j'avais mis des **aplats**.
Un aplat est ce qu'on ecrit quand on code une forme ; un degrade est ce qu'on obtient quand on
demande un dessin. **L'aplat generalise est le symptome visuel de cette erreur.**

## ⭐⭐ LA CONSIGNE D'AZIZ SUR LE COUT — GROUPER EN PLANCHES

> « un [agent] qui cree les elements simples, donc une planche avec peut-etre plus qu'un seul
> element SVG a l'interieur au lieu de gaspiller plusieurs appels par element. »

**Un agent = UNE PLANCHE de N elements coherents**, pas un agent par element. Applique le jour
meme : 1 agent pour les 6 elements d'interface, 1 agent dedie a la main (piece difficile).

## ⛔ LE TROU DE REGISTRE QUE CA A REVELE — LA MAIN

Aucune main / curseur / doigt dans `svg-library/`, `personnage-vivant-svg/` ni
`stick-figure-svg/` (verifie par grep). Or **la main qui touche l'ecran est omnipresente dans
l'animation d'interface** — le registre que le marche paie le mieux (cf. corpus kamotion :
le flux UI est le creneau `ui-animation`, etroit et cher).
⚠️ Aziz : « il va falloir trouver une solution pour les choses comme les mains, les doigts,
parce que je pense que quelque chose qui est tres demandee ». Un curseur fleche ne remplace pas
une main sur un ecran de telephone — ce n'est pas le meme registre.
⭐ Nuance de doctrine : une main-curseur d'interface est un **OBJET**, pas un personnage rigge —
l'interdit « ne jamais laisser un modele produire un personnage anime » ne s'y applique pas.

→ recoupe [[MOTEURS-VISUELS-ET-SOCLE]] · [[SVG-SCENES-GENERATIVES]] ·
   [[feedback_pose-manquante-chercher-registre-avant-inventer]]
