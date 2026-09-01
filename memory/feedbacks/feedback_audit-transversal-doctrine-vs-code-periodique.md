# Audit transversal doctrine-vs-code périodique — pattern validé Grand Ménage 2026-07-11

**Constat** : un Grand Ménage du workspace (2026-07-11, 4 agents vierges en parallèle sur Warmap/Souverain/
Atlas-SVG/Méthode) a révélé plusieurs contradictions accumulées SILENCIEUSEMENT sur des semaines, aucune
détectée avant cet audit dédié :
- Un jury LLM périmé (GPT-4o+Grok) encore actif dans un fichier routé, alors que le système réel utilisait
  Gemini+Kimi+DeepSeek depuis longtemps.
- Un composant (`WarMapOverlayExplicatif.tsx`) qui violait une règle déjà écrite ailleurs
  (`WARMAP-GRAMMAIRE.md` §9, overlay semi-transparent banni) — le fix avait été fait sur un composant frère
  (`WarMapOverlayDynamic.tsx`) mais jamais propagé à celui-ci.
- Un agent (`creative-director`) officiellement archivé mais réutilisé sans trace 3 mois plus tard.
- Une dette technique ("basculer Mapbox vers d3-geo") jamais tenue en 6 semaines, jamais tranchée
  explicitement — et MÊME APRÈS avoir été tranchée dans la même session de ménage, 2 fichiers annexes
  (`WARMAP-INDEX.md`, `WARMAP-COMPOSANTS-INDEX.md`) continuaient d'affirmer le contraire jusqu'à ce qu'un
  agent COHERENCE de fin de session le détecte.

**Why** : ce type de dérive n'est PAS détectable par une relecture ponctuelle au moment d'écrire une règle
— elle s'accumule précisément PARCE QUE personne ne relit systématiquement l'ensemble après coup. Un
script mécanique (`scripts/tools/check-doctrine-violations.py`, créé le même jour) attrape UNE catégorie de
dérive (code qui viole un pattern interdit grep-able), mais pas les contradictions entre fichiers de
doctrine eux-mêmes, ni les agents fantômes, ni les dettes jamais soldées — ça demande un jugement, pas
juste un grep.

**How to apply** :
- Un audit transversal (agents vierges dédiés, un par pilier/domaine, + un audit méthode/routage) mérite
  d'être relancé PÉRIODIQUEMENT (pas seulement en réaction à une frustration exprimée) — la fréquence
  raisonnable reste à établir avec Aziz, mais l'intervalle ne doit pas dépasser quelques semaines vu la
  vitesse d'accumulation observée.
- Même APRÈS avoir tranché une contradiction dans la session de ménage elle-même, vérifier explicitement
  que la décision s'est bien propagée à TOUS les fichiers qui en parlent (pas seulement celui qu'on vient
  de modifier) — un agent COHERENCE dédié en fin de `/wrap` (Phase 2) est le bon filet de sécurité pour ça,
  mais ne remplace pas une vérification croisée (`grep` du sujet tranché dans tout le repo) avant de
  considérer la correction terminée.
- Distinguer 2 mécanismes complémentaires, pas substituables l'un à l'autre : un SCRIPT mécanique
  (`check-doctrine-violations.py`) pour les patterns grep-ables et objectifs, un AUDIT AGENTIQUE périodique
  pour les contradictions de jugement/contexte qu'un grep ne peut pas voir (agent fantôme, dette non
  tenue, doctrine qui se contredit elle-même).

Lié à [[feedback_reconnaitre-derive-investigation]] (dérive au niveau d'un bug ponctuel — celui-ci est le
même phénomène à l'échelle du workspace entier) et à `memory/ROUTAGE.md` (entrée `check-doctrine-violations.py`,
le volet mécanique de ce pattern).

## Nouvelle instance trouvée (2026-08-03, en marge du code Gazoduc Acte 2)

En cherchant des composants réutilisables pour un nouveau beat, grep de `filter:.*blur\|filter: "blur`
sur `src/projects/_shared/components/` a trouvé **au moins 9 fichiers** qui violent "jamais filter:blur
CSS" (règle dure CLAUDE.md projet) : `soudanActors.tsx` (`SoudanToken`), `CountUp.tsx`, `ProcessFlow.tsx`,
`Timeline.tsx`, `PulseNumber.tsx`, `StackedBars.tsx`, `IconStat.tsx`, `WealthScale.tsx`, `GlobalPulse.tsx`
— dont plusieurs sont des composants PARTAGÉS très réutilisés (pas des fichiers d'épisode isolés). Un
autre cas (`GazoducActe1Hook.tsx` ligne 518, glow Europe) trouvé et corrigé la même session — remplacé
par la technique déjà en usage ailleurs dans le même fichier (halo = 2e trait large+transparent, pas de
`filter`).

**Confirmation du pattern décrit ci-dessus** : `check-doctrine-violations.py` existe mais **ne vérifie
PAS `filter:blur`** actuellement (vérifié : `grep -n blur` sur le script est vide) — trou de couverture
concret du volet mécanique. Décision Aziz au moment de la découverte : ne PAS corriger dans l'instant
(pas le sujet du chantier en cours), garder pour un futur audit/passe dédiée. Action suggérée à ce
futur audit : (1) ajouter `filter:\s*blur|filter:\s*"blur` à `check-doctrine-violations.py`, (2) traiter
les 9 fichiers listés ci-dessus par la même technique que le fix Acte 1 (halo = 2e trait large+opacité
réduite, pattern déjà présent dans plusieurs fichiers du projet — pas une invention à faire à chaque fois).
