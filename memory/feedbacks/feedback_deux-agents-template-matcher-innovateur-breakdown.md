Testé pour la première fois 2026-08-03 (Gazoduc AAGP/TSGP, Acte 2) à la demande d'Aziz, qui se souvenait
d'une variante déjà utilisée par le passé sans se rappeler des détails exacts. Résultat concluant — à
intégrer au workflow standard entre breakdown et code.

## Le pattern (3e variante, distincte de [[deux-agents-creatifs-brief-identique-sans-angle]])

Contrairement à `creative-director-dual` (2 agents CRÉATIFS, débloquer un chantier rejeté 2+ fois, ils
proposent une DIRECTION narrative), cette variante s'utilise **après** que le breakdown/storyboard est
déjà figé, **avant** d'écrire le code. Les 2 agents ne proposent PAS de nouvelle direction — ils cherchent
comment RÉALISER ce qui est déjà décidé, avec 2 angles complémentaires :

- **Agent A — template-matcher** : pour chaque élément du breakdown, trouve le composant EXISTANT le
  plus proche (chemin exact + nom), objectif = réutilisation maximale, code le plus vite possible.
- **Agent B — innovateur cadré** : se concentre sur les points du breakdown restés les plus OUVERTS/
  génériques ("traitement exact non tranché"), propose une exécution plus forte QUE CE QU'ON AURAIT
  PENSÉ SEUL, mais toujours fondée sur une technique déjà prouvée ailleurs dans le codebase — pas une
  idée abstraite non testée.

**Brief identique aux 2** (breakdown complet verbatim, contraintes techniques dures, consigne
d'indépendance explicite — même formulation que `creative-director-dual`), lancés en parallèle dans un
seul message, aucun ne voit le travail de l'autre.

## Pourquoi ça marche (preuve du 1er test)

1. **Convergence indépendante = signal de fiabilité fort** : les 2 agents ont cité indépendamment le
   même fichier (`ProtoGazoducCartePlate.tsx`, un prototype carte plate déjà codé pour CE sujet précis)
   qu'aucun des deux fichiers de plan de Claude ne mentionnait — une découverte réelle, pas une
   hallucination répétée par coïncidence de prompt.
2. **L'angle innovateur a trouvé mieux que le plan initial** : le plan prévoyait de "tenter un morphing
   de projection D3 risqué (orthographique→Mercator), avec repli fondu si échec". L'agent B a retrouvé
   une technique DÉJÀ VALIDÉE par Aziz ailleurs (`GlobeToParchemin16x9.tsx` : rester en projection
   orthographique mais zoomer jusqu'à courbure imperceptible = visuellement une carte plate, sans le
   risque technique du morphing entre 2 familles de projections différentes). Meilleure solution, risque
   éliminé, PAS une invention — un pattern qu'Aziz avait déjà testé et approuvé sur un autre projet.
3. **L'angle innovateur a détecté un bug de conformité doctrine dans du code DÉJÀ COMMITTÉ** (Acte 1
   validé v6) : un `filter: blur(3px)` CSS sur un `<path>` SVG animé, qui viole la règle dure du projet
   ("jamais filter:blur CSS"). Vérifié par Claude ensuite (`sed -n` sur le fichier réel) : confirmé, pas
   une hallucination. Ni l'orchestrateur ni la review DA-brief upstream de l'Acte 1 n'avaient repéré ce
   point — la lecture systématique du code par un agent frais, avec un mandat précis ("reste dans les
   contraintes dures"), a servi de garde-fou a posteriori.
4. **L'agent matcher a été honnête sur les manques**, pas juste sur les trouvailles : a signalé
   explicitement l'absence de portraits Mohammed VI/Buhari dans `public/` (recherche exhaustive faite,
   pas supposée), et qu'un pattern de référence utile (`CfaActe2Carte16x9.tsx`, comptage incarné pays
   par pays) vit sur un worktree séparé non mergé — donc une RÉFÉRENCE à copier-adapter, pas un import
   direct possible.

## Comment appliquer

- **Quand** : après qu'un breakdown frame-précis (façon `BREAKDOWN-ACTE*.md`) est figé, avant d'écrire
  le composant Remotion. Pas avant (le breakdown doit être stable, sinon les agents travaillent sur du
  sable) — pas non plus après avoir commencé à coder (à ce stade, un audit/simplify classique suffit).
- **Coût** : réel (2 agents, ~35 tool-calls chacun observés, plusieurs minutes) — réserver aux actes/
  beats SUBSTANTIELS (mid-form, nouveau registre visuel), pas à un fix mineur ou une itération sur de
  l'existant.
- **Vérifier avant d'appliquer** : comme pour tout rapport d'agent (`[[autocritique-agent-signal-pas-verdict]]`,
  `[[rapport-agent-texte-pas-preuve-verifier-disque]]`) — les affirmations factuelles fortes (ex. "ce
  fichier viole telle règle") se re-vérifient par lecture directe avant d'agir, mais dans ce test tout
  ce qui a été spot-check était juste.
- **Brief identique, formulé comme `creative-director-dual`** : même script/matériau verbatim, même
  liste de contraintes dures, consigne d'indépendance explicite écrite dans chaque prompt. Seule la
  MISSION diffère entre les 2 agents (angle matcher vs angle innovateur), jamais le matériau de base.

Lié : [[deux-agents-creatifs-brief-identique-sans-angle]] (variante créative/direction, pas
réutilisation/exécution) · [[agents-paralleles-contrat-partage]] (risque de dérive si les agents
produisaient du CODE en parallèle — non applicable ici car les 2 agents ne produisent que du texte/
recommandations, la synthèse et l'écriture du code restent faites par Claude seul ensuite).
