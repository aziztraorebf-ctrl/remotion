# Un Semantic Test défavorable pré-codage est un gate bloquant, pas une note

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Un Semantic Test croisé (comparaison de compréhension entre directions créatives concurrentes)
qui révèle une asymétrie nette AVANT le codage — une direction "comprise immédiatement", l'autre
"partiellement comprise" — doit être traité comme un motif d'ARRÊT, pas comme une observation à
garder en tête pendant qu'on code la direction faible quand même.

**Corollaire** : "le motion design est-il bon" et "cette direction créative répond-elle au
brief" sont deux questions INDÉPENDANTES. Un jury (LLM ou humain) peut valider parfaitement la
première sans jamais toucher la seconde si la question posée ne porte que sur le motion. Après
toute review de motion design sur un projet avec brief/interdits explicites, poser
EXPLICITEMENT en plus une question de fidélité au brief — ne jamais supposer qu'elle est
couverte implicitement par "juger la qualité".

**Pourquoi** : sur NorthShield (2026-08-07), un Semantic Test fait avant tout code montrait déjà
Direction A (incarnée) "comprise immédiatement" contre Direction B (abstraite) "partiellement
comprise" sur le panneau le plus critique (celui qui pose le problème). Le signal a été noté
"non bloquant". ~2 sessions de travail plus tard (6 panneaux codés en v1, jury à 4 modèles LLM
— Gemini, Kimi, GPT, Grok — tous convergents sur "diaporama statique", v2 corrigée en
conséquence, motion vérifié frame par frame), Aziz a rejeté la v2 sur le fond en recomparant
lui-même le livré au brief original : le flux du panneau 1 reformulait géométriquement le cliché
"pluie de données" explicitement interdit par le brief client, et la Direction B 100% abstraite
n'incarnait jamais d'humain, violant la chaîne HUMAN→SYSTEM→PRODUCT demandée. Les 4 jurys LLM
n'ont jamais vu ce problème car on ne leur a posé que la question du motion — un problème de
direction créative ne se répare jamais par de l'itération sur l'exécution.

Citations Aziz (rejet v1) : *"Cette vidéo n'est pas bonne. Je n'oserais même pas appeler ceci une
vidéo de Motion Design en tant que tel. Pour moi c'est tout simplement un diaporama statique."*

Après la v2 (motion corrigé) : *"pourquoi est-ce que l'impression que ce que nous avons créé
manque le but ? [...] j'ai l'impression que la seule chose qui marche est peut-être le laptop
[...] c'est peut-être beaucoup trop abstrait du début jusqu'à la fin et c'est cela le
problème."* — Aziz a identifié seul, avant l'IA, que le problème dépassait le motion design.

**How to apply** : sur tout futur test client-sim ou storyboard Souverain avec Semantic Test
croisé, si une direction ressort nettement en retrait sur un panneau critique, en tirer la
conséquence AVANT de lancer le codage (abandonner/pivoter/hybrider), pas après. Sur toute
review par jury (LLM ou humain), séparer explicitement la question "est-ce bien exécuté" de
"est-ce fidèle au brief/aux interdits" — voir aussi [[client-sim-tests-index]] § Méthode
standard point 3, où cette règle est maintenant gravée.

Apparenté à [[feedback_reconfronter-brief-original-pas-diff-relatif]] (même famille : ne pas se
fier à un jugement relatif/partiel sans reconfronter la source de vérité complète) — mais cas
distinct : ici le signal existait AVANT tout code (gate amont ignoré), pas une dérive découverte
après plusieurs itérations.
