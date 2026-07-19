---
name: soudan-acte5-densite-brief
description: Direction Brief Acte 5 Soudan — densité/variété visuelle carte (retour Aziz Kings & Generals), beat par beat, sprites+mots-déclencheurs exacts.
metadata:
  type: project
---

# Direction Brief — Acte 5 densité visuelle (2026-07-17)

Suite de [[soudan-acte5-brief]] (mise en scène amont, 0 sortie de carte — non remis en cause ici).

## Déclencheur

Retour Aziz post-Acte 4 : "je préfère une carte remplie qu'une carte vide tout le temps... être
conservateur ne donne rien non plus." Référence explicite à Kings and Generals. Demande explicite que
l'agent signale les possibilités Mapbox sous-exploitées plutôt que rester conservateur par réflexe.

## Arbitrage de tension (R-V5 "contour permanent + intérieur vide" vs densité demandée)

Pas de contradiction réelle une fois précisé : R-V5 (`WARMAP-GRAMMAIRE.md`) protège contre le remplissage
GRATUIT et PERMANENT de la toile, pas contre un objet ANCRÉ À UN MOT PRÉCIS de la voix, qui apparaît sur
la fenêtre du segment vocal concerné puis s'efface ou se fige. L'échec Acte 2 (objet figuratif rejeté)
était un défaut d'ancrage vocal, pas un excès d'objets en soi. Filtre retenu pour tout ajout futur sur ce
projet : (a) un mot/segment vocal exact qui déclenche l'objet, (b) une fenêtre d'apparition liée au rythme
de la phrase, jamais posé en permanence dès l'entrée du beat.

## Verdict par beat (Acte 5, script v6)

- **Beat 1** (pont, aucun lieu nommé) — rester épuré. Ajouter un objet anticiperait le reveal du Beat 2
  (aucun mot ne le justifie encore).
- **Beat 2** (EAU financent, "camps d'entraînement") — remplacer 1 des 3-4 jetons diffus génériques par
  `base-saf-td.png` (stock `public/_shared/sprites/warmap/`) reskinné neutre, correspondance directe au
  mot "camps". Ne pas remplacer les autres jetons (garder Beat 2 moins chargé que Beat 3, rythme
  croissant sur l'acte).
- **Beat 3** (Haftar/corridor, "des armes, du carburant, des combattants") — MEILLEUR CANDIDAT, la voix
  énumère 3 objets concrets. 3 micro-jetons synchronisés 1-mot=1-objet sur la tête du trait en suspens :
  armes→`tech-td-red.png`, carburant→`wagon-cargo-or.png` (ou jerrican SVG si low-cost préféré),
  combattants→`portrait-rsf.png` ou `technical-jnim.png`. Chaque icône apparaît puis s'efface avant le mot
  suivant (pas de rémanence) — seul le trait corridor persiste visuellement.
- **Beat 4** (El-Fasher bouclage) — rester épuré, aucun objet neuf. Le point non-négociable des 2 agents
  précédents (même variable de trajectoire prolongée, jamais retracée) prime, et la voix ("Résumons...")
  est elle-même un résumé — ajouter des objets doublonnerait Beat 2+3 (risque de paraphrase déjà identifié
  par les 2 agents amont). Option secondaire seulement (à trancher Aziz) : réutiliser le MÊME sprite
  combattant du Beat 3 à El-Fasher sur "y ont été repérés, sur le terrain" — écho reconnaissable ("mêmes
  combattants suivis"), pas un nouvel objet.
- **Beat 5** (clôture) — rester épuré, aucun objet neuf. La voix ne nomme plus d'objet concret (bilan +
  pont institutionnel). Le contraste figé/vivant déjà acté (1 seul point El-Fasher qui pulse) est le geste
  juste — une carte qui décélère visuellement en fin d'acte sert le sens ("documenté, stable, et
  pourtant..."). Ajouter un objet ici casserait le contraste voulu avec la densité du Beat 3.

## Résultat global

2 beats gagnent réellement en incarnation concrète (Beat 2 = 1 objet, Beat 3 = 3 objets synchronisés — le
vrai gain de l'exercice), 1 gain optionnel non tranché (Beat 4, écho sprite), 2 restent volontairement
épurés (Beat 1, Beat 5). Courbe de densité = respiration sur l'acte (vide→1→3→écho optionnel→vide), pas un
remplissage uniforme — c'est le geste Kings & Generals réel : concentration de densité au moment où la
voix énumère des faits concrets, sobriété ailleurs. Zéro élément sans mot déclencheur exact → zéro risque
de répéter le rejet Acte 2.

## Next action

Aziz tranche (1) Beat 2+3 tels quels ou ajustés, (2) Beat 4 écho sprite oui/non. Puis breakdown technique
(coordonnées + timing frame-exact des 3 jetons Beat 3, synchronisation au mot) avant tout code.

## Complément — re-passe indépendante (2026-07-17, même jour) — nuance factuelle Beat 2

Re-passe demandée séparément sur le même sujet (2e agent, brief identique sans le savoir). Verdict Beat 3
et Beat 1/4/5 identiques (confirmation croisée indépendante — bon signal). Divergence sur Beat 2, à
trancher explicitement :

**Le risque signalé** : la contrainte factuelle du script est stricte — "PAS de nombre exact de camps
(sources divergent)". Le brief initial ci-dessus propose "1 des 3-4 jetons diffus" remplacé par
`base-saf-td.png`. Lu vite, "3-4 jetons diffus" à l'écran peut lui-même être lu par le spectateur comme
"il y a environ 3-4 camps" — soit un compte visuel que le texte refuse justement d'affirmer à l'oral.

**Nuance qui réconcilie les deux passes** : le geste proposé (1 seul sprite `base-saf-td.png` reskinné,
générique, posé sur une zone floue/diffuse, PAS répété 3-4 fois) reste correct SI et seulement si le
reste du "remplissage" du territoire actif est un halo/texture non dénombrable (type `PulsingRegionFill`
ou grain de zone), jamais plusieurs icônes identiques comptables côte à côte. Un seul symbole "camp"
générique = illustration d'un mot ("camps d'entraînement"), pas une infographie de comptage. Concrètement :
1 icône camp + une zone de glow diffuse autour = OK. 3-4 icônes camp visibles simultanément = à éviter,
même non comptées explicitement à l'oral, car ça affirme visuellement ce que le texte refuse d'affirmer.

**Décision à formaliser avec Aziz** : garder "1 jeton camp" (pas 3-4) comme la version qui passe le test
factuel ET le test de densité — c'est déjà ce que dit le brief initial, cette repasse confirme juste qu'il
faut être strict sur le "1" et ne pas glisser vers plusieurs icônes au moment du code.
