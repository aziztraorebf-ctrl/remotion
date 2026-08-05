# STARTER — Simulation client "Visual Storytelling Explicatif" (prochaine session)

Créé 2026-08-04. Dis « on reprend le test client » ou « on fait Flowdesk ».

> ⚠️ **CONSOMMÉ 2026-08-04** — ce starter a servi à ouvrir le chantier, qui est maintenant BIEN
> AVANCÉ (storyboard multi-directions fait, 5 moteurs SVG comparés, 4 panneaux du registre abstrait
> tranchés, page de comparaison publiée sur here.now). **Ne pas relancer le storyboard depuis zéro.**
> État réel + suite (session d'animation) : `src/projects/_client-sim/flowdesk/BRIEF-PASSATION-ANIMATION.md`.

## 🎯 OBJECTIF DU CHANTIER (positionnement, pas juste un test technique)

Tester si notre pipeline (storyboard→validation→breakdown→code→review, moteur SVG génératif,
jury LLM) transfère à un **positionnement freelance distinct** de nos vidéos Souverain : le
**visual storytelling explicatif** — transformer une idée/système/processus/techno difficile à
montrer physiquement en narration visuelle claire, pour n'importe quel domaine (SaaS/B2B,
cybersécurité, finance, logistique, énergie, science, formation, industrie, consulting,
documentaire…).

**Ce que ce n'est PAS** : pas des pubs sociales hyperrapides, pas des montages mockups
laptop/téléphone, pas une interface qui bouge juste pour créer du dynamisme. Ces approches
existent et peuvent être pertinentes ponctuellement, mais ce n'est pas la compétence qu'on teste.

**Cadrage Aziz (verbatim important, 2026-08-04)** :
> « Le style n'est donc pas prédéfini. Il doit découler du sujet, de l'audience, du message et de
> l'identité du client. Notre vidéo précédente ne doit pas devenir un template esthétique à
> reproduire. »
> « Le SVG et nos outils servent surtout à nous donner une grande modularité : explorer plusieurs
> solutions, comparer différentes métaphores visuelles, récupérer les meilleurs éléments de
> plusieurs concepts, les recomposer et les animer de manière cohérente. »
> « Analyse d'abord ce que le client essaie réellement de communiquer et les difficultés de
> représentation que cela pose. Ensuite, propose les directions. Ne pars pas du principe qu'il
> faut éviter absolument les interfaces/appareils/graphiques/UI — utilise-les s'ils servent
> réellement l'explication, mais ils ne doivent pas devenir une solution automatique. »
> Objectif final : que quelqu'un pense « cette idée était compliquée à expliquer, mais maintenant
> je la comprends ».

## ⛔ RÈGLE STRUCTURANTE — décidée cette session, NE PAS revenir dessus sans raison

**Ne PAS trancher le registre visuel moi-même à l'ouverture de session.** Aziz a explicitement
recadré : laisser le storyboard-dual-gen + jury LLM proposer/trancher la direction visuelle,
exactement comme sur une vidéo Souverain normale — **tout le process habituel qui est pertinent
s'applique ici aussi**, pas de raccourci parce que « c'est juste un test ». C'est justement en
appliquant le vrai process sur un domaine neuf que le test a de la valeur (voir où ça transfère
sans friction vs où il faut adapter).

Concrètement pour la session : STORYBOARD = le modèle PROPOSE plusieurs directions → Aziz
valide → PUIS SEULEMENT APRÈS breakdown technique → code. Ne pas sauter à l'implémentation.

## 📋 BRIEF CLIENT (fictif, à traiter comme un vrai projet reçu)

```
Projet : vidéo explicative pour notre landing page
Nous développons Flowdesk, un logiciel qui centralise les demandes internes des employés.
Aujourd'hui, dans beaucoup d'entreprises, les demandes arrivent partout : email, Slack, Teams,
messages directs et formulaires.
Quelqu'un demande un nouvel ordinateur. Quelqu'un d'autre a besoin d'un accès logiciel. Une
facture doit être approuvée. Une demande RH doit être traitée.
Les gestionnaires perdent le fil.
Flowdesk rassemble toutes ces demandes dans une seule plateforme.
Chaque demande est automatiquement envoyée à la bonne équipe, son statut peut être suivi et les
employés reçoivent une notification lorsqu'elle est complétée.
Nous voulons une vidéo moderne et premium. Pas quelque chose de trop « corporate ».
Durée : environ 45 secondes.
Elle sera principalement utilisée sur notre site Web.
Notre branding utilise bleu foncé, blanc et une couleur accent orange.
Nous aimerions voir une direction visuelle avant que toute la vidéo soit produite.
```

## ✅ Clarifications déjà obtenues (ne pas re-demander)

- **Logo/identité** : aucun logo existant, liberté totale de proposer une forme de marque
  (typographie, symbole) qui sert la métaphore choisie — tant que bleu foncé/blanc/orange accent
  sont respectés.
- **Registre visuel (Kurzgesagt-like vs Stripe/Linear-like vs autre)** : PAS tranché à l'avance
  (voir règle structurante ci-dessus) — le process storyboard/jury LLM décide.
- **Durée** : PAS de contrainte stricte 45s au stade exploration de métaphores. Prioriser la
  qualité de la métaphore visuelle au storyboard ; compresser au script une fois la direction
  validée par Aziz. Le 45s réel reste la cible du livrable final, pas de l'exploration.

## 🗂️ Structuration proposée (à confirmer en ouverture de session)

- Dossier isolé, bien séparé du registre Souverain : `src/projects/_client-sim/flowdesk/` —
  aucune fuite vers `_shared`/`_rnd` Souverain tant que ce n'est pas prouvé réutilisable.
- Nouveau fichier mémoire dédié (pas dans le registre Souverain) pour documenter, à la fin du
  test : où le pipeline a transféré sans friction vs où il a fallu inventer/adapter — c'est la
  vraie valeur business de ce prototype (objectif Aziz = éventuellement se lancer à son compte).

## 🧭 Ce qui va probablement être le vrai révélateur (hypothèses Claude, à vérifier, pas à présumer)

- **Palette de marque imposée** (bleu foncé/blanc/orange) — jamais testé, tout notre travail est
  sur palette Souverain fixe. Est-ce que le système sait se "recolorer" proprement ou est-ce que
  la palette est enfouie dans le code des composants existants ?
- **Vocabulaire visuel "produit SaaS / flux de demandes"** — pas de personnage stick-figure
  évident a priori (ou très minimal, "un employé" générique) ; plutôt cartes/notifications/flux
  qui convergent. Vocabulaire jamais construit dans le registre actuel.
- **Contrainte 45s pour un livrable client** vs le rythme narratif long habituel — discipline de
  compression jamais vraiment testée à ce point.

## 🚀 Prochaine étape concrète en ouverture de session

1. Lire ce starter en entier + `ROUTAGE.md` pour vérifier si un chantier similaire a émergé entre-temps.
2. Lancer le vrai process storyboard (proposer plusieurs directions/métaphores visuelles pour
   Flowdesk, PAS une seule direction pré-choisie) via le pipeline habituel adapté à ce domaine neuf.
3. Présenter les directions à Aziz pour validation avant tout breakdown/code.
