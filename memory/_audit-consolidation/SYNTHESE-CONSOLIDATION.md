# Synthèse consolidation mémoire & workspace — 2026-06-25

> Issue de 6 agents d'audit parallèles (Sonnet 4.6, lecture seule). Document décisionnel pour la Phase 2 (réparation).
> Statut : CHECKPOINT 1 — en attente arbitrage Aziz sur les points de goût/sensibles.

## Tableau de bord (problèmes par sévérité)

### 🔴 CRITIQUE — corriger en priorité

| # | Problème | Zone | Action |
|---|---|---|---|
| 1 | **MEMORY.md = 39.8 KB (limite 24.4 KB, +62%)**. Règle "1 ligne/entrée" violée pour ~60% des entrées (SVG, Sénégal, Soudan font 500-950 char). Tronqué au chargement → perte d'info chaque session. | Transverse | Dégraisser à ≤15 KB (Phase 3, moi) |
| 2 | **Contradiction modèle de référence P2 War-Map** : `PLAN-GENERALISATION-P2.md` dit "Proto24Extinction = modèle validé", STATUS.md + BRIEF-PASSATION-P3 disent l'inverse ("Partie2Blocage, Proto24 = LEGACY"). | War-Map | Supprimer PLAN-GENERALISATION-P2 |
| 3 | **Lien mort `WARMAP-GRAMMAIRE-CAUSALE.md`** (fusionné dans WARMAP-GRAMMAIRE) cité par 7 fichiers d'épisode. | War-Map | Fichiers à archiver de toute façon |
| 4 | **Lien mort `[[atlas-pixellab-differentiel]]`** cité dans 3 doctrines Atlas (dont la règle no-flip). Contenu absorbé dans ATLAS-PIXELLAB-PLAYBOOK §4. | Atlas | Remplacer par pointeur §4 |
| 5 | **Contradiction durée scène statique Atlas** : 2s (rules-atlas-production) vs 8s (ATLAS-PLAYBOOK) vs 5-8s (camera-movements). | Atlas | Unifier à >8s |
| 6 | **Contradiction image-cible SVG** : SVG-FAISABILITE-AMONT étape 3 décrit encore "raster (gemini-gen-image)", corrigé en "SVG natif" partout ailleurs. Renvoi circulaire. | SVG | Corriger étape 3 |
| 7 | **Contradiction Sénégal V3 dans MEMORY.md** : "Scène 1 EN COURS (2026-06-19)" alors que scènes 0-3 FAITES + scène 4 à 95% (NEXT-ACTION 06-24). | Souverain/Transverse | Corriger l'entrée |
| 8 | **ROUTAGE.md n'a AUCUNE entrée SVG génératif** (l'unique "SVG" pointe vers recraft.md, hors sujet). Agent sans point d'entrée. | SVG/Transverse | Ajouter section SVG |

### 🟠 MOYEN

| # | Problème | Zone | Action |
|---|---|---|---|
| 9 | **~17 fichiers warmap-sahel périmés** (épisode quasi-fini) : 3 à SUPPRIMER (PLAN-REFONTE-P4, BRIEF-PASSATION-P4, -P4-REFONTE marqués OBSOLÈTE), ~14 à ARCHIVER (scripts V3, plans P2, consignes fix terminés, BEATS-V5 frames décalées, PLAN-VISUEL-ACTE1). + dossiers da-briefs/reviews = ~60% du volume archivable en bloc. | War-Map | Archiver/supprimer |
| 10 | **9 fichiers racine memory/ périmés** : STARTER-senegal-assemblage-final, STARTER-senegal-makeover-premium, CHANTIER-AUTOMATISATION-ANTI-FOUILLIS, PLAN-SYSTEME-ANTI-FOUILLIS, PLAN-ORCHESTRATION-VIDEO, SESSION-DEDIEE-HOOKS, _r-and-d-mapanimation-ANALYSE, _r-and-d-mapanimation-PREMIUM-DECODE, COMPACT_CURRENT (stale 06-15). | Transverse | Archiver |
| 11 | **3 STARTER-PROMPT SVG périmés** (pilote, hub-spoke, svg-scenes-suite) décrivent états intermédiaires dépassés. STORYBOARD-PILOTE + SCRIPT-PILOTE-v1 contiennent fait FAUX ("Nigeria 3/4 arbres en 2 mois", corrigé en "Sahel ~8/10"). | SVG | Archiver + bandeau PÉRIMÉ |
| 12 | **Doublon 9 acquis SVG** copiés intégralement entre SVG-SCENES-GENERATIVES et ETAT-GGW. | SVG | ETAT-GGW → pointeur |
| 13 | **key-learnings.md §SVG (70 lignes)** : verdict périmé "Gemini GAGNANT NET" (contredit par règle "générer les 2"). Condenser à 8 lignes + pointeur. | SVG/Transverse | Condenser |
| 14 | **WARMAP-LONG-DOCTRINE** maintient règles overlay invalidées par WARMAP-GRAMMAIRE (semi-transparents présentés comme standard) + cite script canonique V4 au lieu de V5. | War-Map | Renvoi + MAJ |
| 15 | **Contradiction flip PixelLab** : tools/pixellab.md dit "flipX:true", ATLAS-PIXELLAB-PLAYBOOK dit "JAMAIS de flip" (bug moonwalk). | Atlas | Bandeau d'avertissement tools/pixellab.md |
| 16 | **STATUS atlas-systeme** mentionne branche `feat/atlas-playbook-retour-aux-sources` inexistante en git. | Atlas | Corriger STATUS |
| 17 | **PIXELLAB-MASTER-INDEX.md** périmé (Soldat Mali "2 anims" → réel 4 ; soldats Order of Battle absents). | Atlas | MAJ index |
| 18 | **CATALOGUE-GEMINI.md mal nommé** (c'est un catalogue de templates Remotion, pas de l'API Gemini). | Transverse | Renommer CATALOGUE-TEMPLATES-REMOTION.md |
| 19 | **4 fichiers orphelins auto-memory** (remotion-effects-rack-natif, sfx-reveal-mp3-banni, render-background-gel-sleeps, REPRISE-SYSTEME-CARTO-V5) absents de memory/ workspace → invisibles si agent ouvre memory/. | Transverse | Rapatrier |
| 20 | **NEXT-ACTION.md (380L) bavard** : 5 pistes stratégiques concurrentes, dilue le focus. | Transverse | Élaguer à 2 actives |

### 🟡 MINEUR / CODE

| # | Problème | Zone | Action |
|---|---|---|---|
| 21 | **out/ = 5.7 GB** : `out/_r-and-d/` 1.3 GB (>7j) + `out/episodes/warmap-sahel/wip/` 219 MB → ~1.5 GB purgeables. | Code/disque | Purger |
| 22 | **SahelWarMapEngine.tsx = 4227 lignes** (~700L de données timing embarquées). Seul composant React vraiment problématique. | Code | Extraire SahelTimingData.ts |
| 23 | **atlas-components.tsx = 1009L** + 5 fichiers Sénégal dans `_proto-16-9/` (mauvais dossier). | Code | Découper / migrer |
| 24 | Lacunes : pas de PLAN-ASSEMBLAGE-FINAL War-Map (prochaine étape !), pas de PLAN-NARRATIF-P1, pas de checklist "nouveau short SVG", pas de STATUS Hannibal. | Multi | Créer au besoin |

## Constat transversal (le vrai diagnostic)

**Cause racine unique** : la mémoire **accumule chaque itération de production sans purger l'état intermédiaire**. Les doctrines de fond (SVG-SCENES-GENERATIVES, WARMAP-GRAMMAIRE, ATLAS-PLAYBOOK) sont **justes et solides**. Le bruit vient à 90% de :
- fichiers de session/reprise/starter jamais archivés après usage,
- statuts non re-synchronisés (MEMORY.md retarde sur NEXT-ACTION),
- pointeurs vers fichiers fusionnés/déplacés.

`check-links.py` dit **0 lien mort** — mais il ne scanne que 8 fichiers de navigation, PAS NEXT-ACTION, les STARTER, ni tools/. Les liens morts réels sont hors de son périmètre.

## Découpage Phase 2 (réparation) — périmètres DISJOINTS (anti-conflit working tree)

- **LOT A — War-Map** (le plus gros gain) : archiver ~17 fichiers, supprimer 3 OBSOLÈTES, MAJ WARMAP-LONG-DOCTRINE.
- **LOT B — SVG** : archiver 3 STARTER + STORYBOARD/SCRIPT pilote, corriger SVG-FAISABILITE étape 3, ETAT-GGW → pointeur, ajouter ROUTAGE SVG.
- **LOT C — Atlas** : lien mort differentiel, durée statique, flip, STATUS branche, PIXELLAB-INDEX.
- **LOT D — Transverse/racine** : archiver 9 fichiers racine, renommer CATALOGUE-GEMINI, rapatrier 4 orphelins, MAJ check-links scope.
- **LOT E — Code** : purge out/ + extraction SahelTimingData (sensible → moi ou agent worktree isolé).

Lots A-D = .md uniquement, périmètres de fichiers disjoints → agents séquentiels OU worktrees isolés. LOT E touche du code → prudence.

## Phase 3 (moi, en dernier) : dégraissage MEMORY.md + ROUTAGE + NEXT-ACTION une fois le contenu stable.
## Phase 4 : branches git (tableau → arbitrage Aziz).
