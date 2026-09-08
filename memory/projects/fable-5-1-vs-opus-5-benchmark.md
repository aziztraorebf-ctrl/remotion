---
name: fable-5-1-vs-opus-5-benchmark
description: "Test comparatif Fable 5.1 vs Opus 5 max sur SVG style TED-Ed abstrait, prix et positionnement officiel"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7d0aea92-6728-43ac-9013-78bb10876eaa
  modified: 2026-09-01T22:04:55.117Z
---

Fable 5.1 sorti 2026-09-01 (model ID `claude-fable-5-1`). Prix INCHANGE vs Fable 5 : $10/$50
par MTok (input/output) — 2x le prix d'Opus 5 ($5/$25). Seul changement de prix : cache read
$0.25/MTok (etait $1.00) — gain surtout si gros contexte reutilise, pas en one-shot creatif.

Doc officielle Anthropic positionne Opus 5 comme le DEFAUT : "For most workloads, start with
Claude Opus 5 [...] Use Claude Fable 5.1 for demanding reasoning and long-horizon agentic work,
or when your evals on Claude Opus 5 at higher effort still fall short." Fable 5.1 = exception
justifiee par eval, pas le choix par defaut.

Comparatifs tiers (Fable 5 vs Opus 5, pas encore 5.1) : Opus gagne sur code contraint
(specs/fixes/refactors bornes, SWE-bench Verified 96.0 vs 95.0) ; Fable gagne sur creatif ouvert
(design visuel, landing pages, carrousels) et SWE-bench Pro (80.3 vs 79.2). Un article
(officechai.com) annonce Fable 5.1 "beats Opus 5 on most benchmarks" — PAS verifie contre source
primaire Anthropic, a prendre avec prudence.

**Why**: Aziz a eu ses limites remises a zero le 2026-09-01 (probablement lie au lancement),
~24h de fenetre pour tester massivement avant retour aux limites hebdo normales. Objectif :
savoir si Opus 5 max est interchangeable avec Fable (5 ou 5.1) pour notre SVG generatif maison
(cf. [[SVG-SCENES-GENERATIVES]]) — si oui, economie ~50% sur ce poste puisque Fable est 2x plus
cher token-pour-token.

**How to apply**: Test lance sur vidéo TED-Ed "4 ways to tell a great story" (style aplats
couleurs vives + silhouettes cave-painting) — 2 scenes (reseau de points connectes = simple ;
chasseurs a la lance silhouette blanche = complexe) x 2 modeles (Fable 5 max, Opus 5 max, 5.1
indisponible dans Claude Code au moment du test) en parallele. Ne pas conclure sur l'ecart de
prix seul — le juger sur qualite de sortie ET cout reel, comme la doctrine
[[MOTEURS-VISUELS-ET-SOCLE]] le fait pour les autres choix d'outils.

## Resultat execute (2026-09-01)

3 passes : (1) dessin depuis description texte seule, (2) correction contre la vraie frame
video, (3) prototype d'animation Remotion (propagation d'un signal sur le graphe, BFS/Dijkstra,
spring/interpolate uniquement). Les 2 modeles ont livre un rendu directement exploitable a
chaque passe, y compris sur la scene anatomique (chasseurs a la lance) — contredisant
l'hypothese de depart. Nuance de doctrine qui en decoule, deja gravee dans
`.claude/agent-memory/svg-dessinateur/ECHECS.md` : le critere d'echec anatomique est
"topologie libre vs assemblage de primitives", pas "humain vs non-humain".

**Verdict qualite (jugement Aziz, pas juste mesure)** : sur l'animation de propagation,
**Opus prefere** — duree plus longue, propagation mieux lisible dans le temps, changement de
couleur au contact des lignes plus satisfaisant visuellement. Fable reste bon (geste plus pur,
rendu plus leger) mais Opus l'emporte au jugement. Cf. artifacts publiés dans la session
2026-09-01 (liens dans le fil de conversation, pas archives ici).

**A retenir cote process** : Opus a mal diagnostique une fois (a tort conclu que les
dependances npm etaient absentes a cause d'un chemin relatif dans son thread d'agent) et
contourne par une preuve mathematique au lieu d'un vrai rendu — corrige seulement apres avoir
ete challenge explicitement. Lecon : ne jamais accepter un contournement d'agent sans avoir
verifie que l'obstacle etait reel.

**Conclusion pour la question initiale (Opus interchangeable avec Fable ?)** : OUI sur ce
registre (SVG generatif style aplats + animation de propagation par donnees) — qualite
comparable au dessin, et Opus gagne meme le jugement de gout sur l'animation, pour moitie prix.
Fable garde son avantage documented ailleurs sur l'anatomie organique AVEC reference et le
creatif tres ouvert (cf. comparatifs tiers ci-dessus) — le choix reste dependant du registre,
pas un verdict universel.

## Decision Aziz 2026-09-03 : OPUS MAX EST LE DEFAUT (generalise)

Aziz tranche : **Opus 5 en mode max devient le defaut**, y compris la ou la doctrine ecrivait
"Fable 5 = defaut SVG maison" (CLAUDE.md, tableau des modeles). Motif : qualite jugee egale ou
superieure sur nos tests reels, et consommation moindre. Coherent avec le test du 01/09 ci-dessus
(Aziz avait deja prefere Opus sur l'animation de propagation) et avec le positionnement officiel
Anthropic ("start with Opus 5 for most workloads").

⚠️ **Ce qui n'est PAS couvert par ce verdict** : la 3D volumetrique (Three.js/R3F). Le test du
01/09 portait sur du SVG plat + animation par donnees. Aucun comparatif Fable/Opus n'existe sur
de la geometrie 3D. Ne pas relayer "Opus > Fable en 3D" comme un acquis — c'est non mesure.

**A appliquer** : mettre a jour le tableau des modeles du CLAUDE.md (ligne "SVG maison (defaut)")
lors de la prochaine passe memoire, pour que la doctrine ecrite cesse de contredire la decision.
