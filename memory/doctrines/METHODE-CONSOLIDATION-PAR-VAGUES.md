# Méthode de consolidation par vagues (prouvée 2026-06-25)

> Migré depuis auto-memory le 2026-08-31, contenu original inchangé.

Workflow réutilisable quand Aziz demande un « grand ménage » / « consolider la mémoire » / « rendre propre pour un agent vierge ». Claude = orchestrateur (Opus), tout le travail délégué en agents **Sonnet** (`feedback_agents-sonnet-par-defaut.md`).

## Les 3 niveaux d'audit (chacun voit ce que le précédent ne peut pas)
1. **STRUCTURE** — périmé / liens morts / contradictions internes / doublons. Audit statique (lire et comparer les fichiers).
2. **GROS FICHIERS** — taille / découpage / accessibilité. Quels fichiers scinder/dégraisser, code .tsx inclus.
3. **COHÉRENCE A→Z** — chaîne doctrine→feedback→script du point de vue d'un AGENT VIERGE qui PRODUIT. Scripts existent+args+modèles API ? Parcours zéro→rendu sans trou ? C'est le plus profond — il trouve les feedbacks périmés qui contredisent la doctrine (pattern dérive de `key-learnings.md`).

## Le flux par vague (toujours le même)
1. **Relevé objectif** (tailles, nb scripts/feedbacks, scan modèles périmés) pour donner des cibles chiffrées aux agents.
2. **Branche de chantier** `chore/<nom>`.
3. **N agents d'audit EN PARALLÈLE** (lecture seule, Explore, Sonnet) — 1 par pilier (Souverain/Atlas/War-Map/SVG) + transverses (scripts, feedbacks). Rapport = leur message (Explore ne peut PAS écrire de fichier).
4. **CHECKPOINT** : Claude écrit une SYNTHÈSE décisionnelle dans `memory/_audit-consolidation/` + AskUserQuestion groupé (autonomie réparateurs ? archiver vs supprimer ? scope ?).
5. **N agents RÉPARATEURS** — périmètres de fichiers DISJOINTS. En worktree isolé si parallèle, ou séquentiel sur le tree principal. CLAUDE.md + merges + régressions = Claude en direct (sensible).
6. **Merge** un lot à la fois, `check-links.py` + `npx tsc --noEmit` (baseline) après. Nettoyer worktrees+branches.

## Gotchas prouvés
- **Périmètres DISJOINTS = 0 conflit au merge** (vérifié 3 fois). C'est la réponse au « worktree = conflits » : ce n'est pas le worktree le problème, c'est le chevauchement de fichiers.
- **Agent Explore = lecture seule** → pour réparer, utiliser `general-purpose`.
- **Code .tsx** : exiger `npx tsc --noEmit` après CHAQUE extraction, comparer à la baseline (le projet a ~6 erreurs préexistantes hors périmètre). L'agent doit refuser d'extraire ce qui crée une dépendance circulaire.
- **Worktree part de master, pas de la branche** : committer dans le worktree AVANT de merger sa branche.
- **`check-links.py` a un angle mort** (ne valide pas la résolution relative depuis l'auto-memory) → re-valider par résolution absolue après réécriture de MEMORY.md.
- **Nos ménages créent des régressions** : `grep` les noms supprimés/déplacés dans TOUTE la mémoire après coup.

## Résultat type (2026-06-25)
MEMORY.md 39.8→18.8 KB · ~75 .md purgés · branches 43→6 · SahelWarMapEngine 4227→3399L · gemini.md 642→150L · 0 modèle API périmé dans scripts actifs · ~80-85% des problèmes de cohérence réglés. Synthèses : `memory/_audit-consolidation/SYNTHESE-*.md`.

## Quand déclencher ce workflow (2026-07-31)
Ce fichier dit COMMENT mener un grand ménage. Pour QUAND s'en poser la question (seuils de taille,
pourquoi la taille seule n'est jamais le vrai signal) → `feedbacks/feedback_seuils-taille-memoire-signal-pas-limite.md`.
