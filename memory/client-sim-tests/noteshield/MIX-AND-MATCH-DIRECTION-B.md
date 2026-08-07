# Mix & Match — Direction B (System/Conceptual)

> Décisions post-panel comparatif (4 modèles : Fable MAX, Gemini 3.1 Pro, GPT-5.6 Sol, Kimi K3).
> Page comparative complète : https://placid-crystal-2res.here.now/ (expire ~2026-08-07 23:14 UTC).
> Fusion faite par Claude (édition, pas un nouvel appel modèle — cf. doctrine SVG-SCENES-GENERATIVES
> § PIPELINE 3 MODÈLES : la fusion mix-and-match est un travail d'édition, jamais un appel modèle).

## P1 — Flux indifférencié

**RETENU : Fable MAX**, avec un emprunt à Gemini.

Fable gagne nettement sur la densité et la texture (motion-blur suggéré, 3 plans de profondeur
far/mid/near, ~120 traits). C'est le seul qui atteint le niveau "flux qui occupe vraiment l'espace"
visé par le brief.

**Emprunt à Gemini** : Gemini a une ligne cyan pleine, nette, qui traverse tout le cadre au centre —
c'est visuellement le `horizon_dormant` (ligne de vigilance encore plate/inerte) que le storyboard
prévoit comme fil conducteur entre P1 et P2. Fable a bien un groupe `horizon_dormant` dans son SVG
mais à opacité trop faible pour se distinguer.

**✅ Tenté en édition (2026-08-07)** : opacité remontée (cœur 0.34→0.85, halo ajouté). **Résultat :
insuffisant** au niveau du fix d'opacité seul — mais ce fix est devenu sans objet suite à la
découverte du vrai problème du panneau (voir section suivante).

## ⭐⭐ P1 — CORRECTION MAJEURE (2026-08-07, post-Semantic Test)

**Diagnostic du vrai problème** (posé par Aziz, confirmé en relisant le storyboard original) :
le Semantic Test croisé a révélé que P1 (v1/v2, ci-dessus) ne montrait qu'un ÉTAT NEUTRE — un flux
de traits qui défile — sans jamais capturer l'ÉVÉNEMENT narratif que le script décrit ("soit on
ralentit tout le monde... soit on croise les doigts" = une barre qui BLOQUE et un EMBOUTEILLAGE qui
se forme). Le problème n'était pas l'animation à venir ni l'opacité d'un détail — c'était que
l'image-cible capturait le mauvais instant du récit.

**Correction** : nouveau brief Fable MAX explicite sur le geste manquant (barre verticale qui
bloque + flux compressé en embouteillage à gauche + vide à droite), même registre/densité que la
version précédente. **Résultat : réussi** — rendu vérifié, le Semantic Test passe maintenant : une
masse de traits qui percute un mur et s'entasse en files compressées est immédiatement lisible en
5 secondes sans texte, contraste net avec la v1.

**RETENU : Fable MAX v3** (remplace la v1/v2 comme image-cible P1 définitive).

Fichier source : `public/_rnd/fable-svg/northshield-direction-b/p1-flux-fable-v3-blocage.json`.
Groupes clés pour l'animation (séparés exprès pour ça) : `flux_arrivant` (traits libres, plan
gauche), `barriere` (le mur), `flux_bloque` (traits compressés), `traits_rouges` (2 noyés dans
l'embouteillage), `zone_vide_droite`.

L'ancienne v1/v2 (`p1-flux-fable.json`) reste sur disque comme archive/référence de densité, mais
n'est plus la version à utiliser pour le montage final.

## P2 — Seuil naît

**RETENU : Fable MAX, ENRICHI d'un emprunt à Kimi** (validé par Aziz, 2026-08-07).

Fable a l'avantage de base : ticks de mesure discrets + point central marquant l'origine — cohérent
avec le registre "instrument de mesure" du reste de la direction.

**Emprunt à Kimi (validé)** : Kimi a des petits reflets/échos autour de la ligne cyan (bandes
horizontales atténuées au-dessus/en-dessous du trait principal, façon "onde qui se propage
verticalement depuis la ligne") — jugés par Aziz nettement supérieurs à l'ambiance plate de Fable.
**À faire en édition (pas un nouvel appel modèle)** : extraire ce motif d'écho vertical du SVG Kimi
et le greffer en groupe additionnel dans le SVG Fable P2, positionné autour de `ligne_seuil`.

Fichiers sources :
- Base : `public/_rnd/fable-svg/northshield-direction-b/p2-seuil-fable.json` (à enrichir)
- Référence écho à extraire : `public/_rnd/fable-svg/northshield-direction-b/p2-seuil-kimi-echo-ref.json`
  (rapatrié depuis `/tmp/svg-refs/`, 2026-08-07)

## P3 — Quatre signaux fusionnent (panneau le plus important)

**RETENU : Fable MAX.**

Différenciateur net : Fable applique un **dégradé blanc→cyan progressif le long de chaque ligne** —
la donnée "brute" (blanc, à gauche) devient "signal exploité" (cyan, en approchant du point de
convergence à droite). GPT a une composition quasi identique en géométrie (mêmes 4 textures de
ligne : créneaux/courbe/points/ondulation) mais reste blanc jusqu'au bout puis bascule cyan d'un
coup près du nœud — moins narratif, plus statique.

Point à garder de GPT en réserve (non retenu mais noté) : son HUD (crochets de mesure, cartouche de
titre en haut-gauche) est plus riche visuellement — pourrait être réutilisé pour un futur habillage
plus "dashboard technique" si le registre évolue, mais hors scope ici (surchargerait le message).

**Emprunt à Gemini (validé par Aziz, 2026-08-07)** : le cartouche "18" de Gemini (cercle à double
anneau — un fixe pointillé + un fixe plein — avec le "18" cyan bien plus dense/lisible visuellement
que le "18" nu de Fable) est jugé supérieur au traitement Fable actuel du point de convergence.
**À faire en édition** : remplacer/enrichir le point de convergence final de Fable P3 par ce
cartouche à double anneau de Gemini, en gardant les 4 lignes/labels/dégradé narratif de Fable
intacts (c'est uniquement l'élément terminal "score" qui change).

Fichiers sources :
- Base : `public/_rnd/fable-svg/northshield-direction-b/p3-quatre-signaux-fable.json` (à enrichir)
- Référence cartouche "18" à extraire : `public/_rnd/fable-svg/northshield-direction-b/p3-quatre-signaux-gemini-scorebox-ref.json`

## P5 — Bosse rouge (2e moitié : retour à la ligne de vigilance seule)

**RETENU : Fable MAX, ENRICHI d'un emprunt à Gemini** (validé par Aziz, 2026-08-07).

Les 4 versions sont toutes bonnes (concept simple, contraste plat/bosse immédiatement lisible
partout). Fable a un plus subtil retenu : le reflet en miroir sous la ligne (effet "sondage/radar"
qui ajoute de la profondeur sans texte). GPT est le runner-up le plus riche (spectrogramme dans le
pic, HUD complet) mais over-designed pour ce qui doit rester un geste simple et calme (le brief
demandait explicitement "alerte calme, pas agressive").

**Emprunt à Gemini (validé)** : le marqueur au sommet du pic chez Gemini (halo bleuté large et doux
qui enveloppe verticalement tout le pic, point central plus riche) est jugé supérieur au marqueur
simple de Fable (point + 2 fins anneaux). **À faire en édition** : remplacer le groupe
`marqueur_pic` du SVG Fable P5 par le traitement de halo vertical de Gemini, en gardant intacts le
reste de la composition Fable (ligne plate, bosse, reflet miroir, dégradé cyan→rouge).

Fichiers sources :
- Base : `public/_rnd/fable-svg/northshield-direction-b/p5-bosse-rouge-fable.json` (groupe
  `marqueur_pic` à remplacer)
- Référence halo/marqueur à extraire : `public/_rnd/fable-svg/northshield-direction-b/p5-bosse-rouge-gemini-marqueur-ref.json`

## P6 — Signature finale

**RETENU : Fable MAX**, sans hésitation — écart net avec les 3 autres.

Fable est le seul à avoir eu l'idée d'une **séquence de 4 échos rouge→cyan décroissants en amplitude**
(l'anomalie qui retombe et se dissout littéralement dans le calme du système) — exécute la phrase du
script ("s'efface le reste du temps") de façon narrative, pas juste une ligne qui redevient plate.
Gemini jugé trop pâle (ligne quasi invisible — confond "atténuation" avec "presque rien", contresens).
GPT trop agité (ondulations vertes actives — lit comme "encore instable", pas "calme retrouvé"). Kimi
correct mais sans l'idée des échos décroissants (juste une petite bosse fantôme statique).

Bonus technique : Fable a détecté et corrigé lui-même un bug réel pendant sa vérification (gradient en
`objectBoundingBox` sur une ligne de hauteur nulle → invisible ; corrigé en `userSpaceOnUse`) —
confirme la valeur de l'exigence "rends et regarde ton propre travail avant de conclure".

Fichier source : `public/_rnd/fable-svg/northshield-direction-b/p6-signature-fable.json`.

## Synthèse

**Fable MAX gagne 5/5 panneaux** de ce comparatif — écart net sur P1 (densité), P3 (dégradé narratif)
et P6 (échos décroissants) ; sur P2 et P5 c'est un jugement de préférence fine, pas un écart de
qualité. Le panel API (GPT/Gemini/Kimi) reste une vraie option de secours ou de 2e avis — pas un
gaspillage — et le script `svg-scene-abstrait.py` (créé cette session) doit être réutilisé pour tout
futur brief abstrait/conceptuel de ce type.

**⚠️ Réserve méthodologique (signalée par Aziz)** : Fable gagnant 5/5, il vaut la peine de vérifier
avant de considérer Direction B définitivement close que ce n'est pas un biais du juge (moi, ayant
écrit les prompts Fable) — recommandé : un œil neuf (Aziz, ou jury Gemini/Grok comme pour le script
voix) sur au moins P1 et P3, les deux écarts les plus nets.

## Direction B — STATUT : COMPLÈTE ET FUSIONNÉE (P1-P6)

1. ✅ **P6 (signature finale)** — généré et retenu (Fable MAX), 2026-08-07.
2. ✅ **P4 + 1ère moitié P5 (dashboard/laptop)** — asset produit codé
   (`DashboardScreen.tsx` + `LaptopMockup.tsx`), pas d'image-cible à générer.
3. ✅ JSON Fable retenus (P1/P2/P3/P5/P6) rapatriés dans
   `public/_rnd/fable-svg/northshield-direction-b/`.
4. ✅ **3 fusions Mix & Match appliquées et vérifiées par rendu** (2026-08-07) :
   - P2 : + marqueurs d'extrémité de Kimi (`horizon_endpoints`)
   - P3 : score_final remplacé par le cartouche à double anneau de Gemini (texte "18" garde le
     glow de Fable)
   - P5 : marqueur_pic enrichi avec le double anneau pointillé de Gemini
   - Fichiers finaux : `p2-fable-FINAL.png`, `p3-fable-FINAL.png`, `p5-fable-FINAL.png` dans
     `storyboard-frames/`
5. ⚠️ **P1 fil visuel horizon_dormant : tenté, insuffisant** — cf § P1, le problème est de
   composition (flux dense noie la ligne), pas d'opacité. Reste ouvert, non bloquant.
6. ✅ **Semantic Test croisé — fait (2026-08-07)**, verdict :
   - A-P1 (couloir/barrières) : compris immédiatement (contexte de contrôle).
   - B-P1 (flux dense) : **partiellement compris** — on lit "beaucoup de données", pas
     "indifférenciation" — confirme le risque déjà signalé par l'agent dans le storyboard
     original, pas une découverte nouvelle mais une confirmation indépendante.
   - B-P3 (convergence 4→1) : **compris intégralement sans un mot** — confirmé comme le panneau
     le plus fort des deux directions, indépendamment du jugement initial.
   - A-P4/P5 (dashboard+laptop) : compris totalement, renforcé par le texte explicite à l'écran.
   - Conclusion : l'intuition d'Aziz sur "Direction B plus abstraite/forte" est confirmée aux 2/3
     — mais B-P1 reste le point faible réel de la direction, à garder en tête pour le montage
     final (compter sur la narration pour porter ce panneau, pas sur l'image seule).
7. ⏳ Vérification du biais de jugement Fable (voir réserve méthodologique ci-dessus) — reste
   ouvert. Le Semantic Test indépendant sur B-P1 (jugement défavorable) et B-P3 (jugement très
   favorable) donne un premier signal rassurant : le jugement "Fable gagne" n'était pas
   automatique/complaisant, un vrai écart de qualité existe entre panneaux.
