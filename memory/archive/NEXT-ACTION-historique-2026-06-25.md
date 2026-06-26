# NEXT-ACTION — Historique archivé (2026-06-25)
> Sections "FAIT"/"LIVRÉ"/"TRAITÉ" extraites de NEXT-ACTION.md pour alléger le fichier actif.
> Consulter si besoin de retrouver l'historique d'une décision.

---

## 🤖 (FAIT 2026-06-20) — SYSTÈME AGENTIQUE ÉPROUVÉ A→Z (session système, sans dette de structure)

> Grosse session : registre des formes → orchestration → cobayes A→Z. Le système est OPÉRATIONNEL de bout en bout.
> Acquis (tous commités master) : format breakdown Mapbox+Remotion défini+éprouvé · storyboard IMAGE obligatoire +
> checkpoint chef→Aziz (erreur « checkpoint sauté » corrigée) · boucle review (self-review + Gemini ≤2 appels, gate
> `phase_match_avg`) · 3 vérifs amont (chiffre sourcé / durée audio / cohérence intention↔audio) · palette fonds
> (parchemin défaut, prime sur navy/gold) · `forme_verifiee` anti-fantôme · gotcha CountUp prefix. Carte = `SYSTEME-AGENTIQUE.md`.
> RESTE = le peaufinage graphismes ci-dessus (le système marche, le GOÛT visuel est le prochain front).

## 📚 (FAIT 2026-06-20) — REGISTRE DES FORMES RÉSOLUES (commit 2173ce2)

> Session système (pas de prod). Répond à la frustration d'Aziz : « pourquoi c'est si complexe ? on a
> déjà les réponses (Silicon Savanna→Data-Hero) mais on les re-tâtonne ». Cause racine = acquis déjà
> tranchés MAL INDEXÉS (problème de classification, pas de stockage). ⚠️ Commité sur `feat/elagage-systeme` —
> vérifier qu'il a bien suivi le merge dans master (l'autre instance a mergé la branche en parallèle).

- **Diagnostic chiffré** : balayage 4 piliers (agents lecture seule) → ~60 acquis validés ABSENTS/mal placés
  dans `INTENTION-FORME-INDEX.md` (Data-Hero, coin-flip, 17 templates Mapbox, overlays War-Map, blueprints
  Atlas) + 15 REJETS jamais documentés (drawFlagCanvas, flyTo, pitch 3D, semitransp…).
- **`INTENTION-FORME-INDEX.md` enrichi** (123→210 l) : 2 RÈGLES MAÎTRESSES + géo complétée + 2 catégories neuves + section ⛔ REJETS + tags pilier [S]/[WM]/[A]/[C].
- **Hook `beat-preflight.sh`** : rappel NON BLOQUANT (4 points : intention→registre→existence→rejets) sur toute scène `.tsx`.
- **Validé par 3 agents vierges** : 2/3 trouvent la forme du 1er coup sans tâtonner.
- ⏳ **OPTION DE DURCISSEMENT** (si Claude continue d'oublier d'ouvrir le registre) : passer le rappel de non-bloquant → bloquant. Décision reportée.

---

## 🎬 (FAIT 2026-06-19→20) — STORYBOARD + ORCHESTRATION : système validé (mergé dans master)

> Session d'architecture. `feat/elagage-systeme` **mergée dans master** (696006f). Tout commité, testé par agents réels.

**Ce qui est en place et PROUVÉ :**
- **Storyboard = le modèle PROPOSE → on valide → breakdown → code.** Prouvé 4× (90%, ZLECAf, Maroc, Sahel).
- **Palette de 4 backgrounds** validés (`public/_shared/refs/backgrounds/`) + **3 réfs de nos cartes** + **ARSENAL**.
- **Orchestration** (`memory/PLAN-ORCHESTRATION-VIDEO.md`) : Claude = chef d'orchestre, agents frais = exécutants.
- **Anti-fouillis** : porte `/beat`, hook auto-vérif présentation, règle 3 zones, 11 ambiguïtés fermées.

**⏳ CE QU'IL RESTE À PEAUFINER (prochaine session = peaufinage) :**
- **Brancher le storyboard dans le pipeline réel** : pas encore câblé comme étape obligatoire de `beat-session.py`/`mapbox-session.py`.
- **Éprouver l'orchestration complète sur UNE vraie mini-vidéo** bout-en-bout.
- **Décoder le BREAKDOWN Mapbox** : format exact du breakdown carte n'est pas encore défini/testé.
- **Trous d'assets** : `jeton-jnim.png`/`jeton-eigs.png` absents (voir `_ARSENAL.md`).
- **Décisions en attente** : direction parchemin pour la scène 90% (recoder ou garder noir — Aziz n'a pas tranché).

---

## 🛠️ (FAIT 2026-06-19) — SYSTÈME ANTI-FOUILLIS : ce qui a changé (branche `feat/elagage-systeme`)

> Session d'architecture (pas de prod). Détail + conception : **`memory/PLAN-SYSTEME-ANTI-FOUILLIS.md`**.

- **Scripts 98→56 actifs** : 47 one-shot/épisode archivés, 4 tests morts supprimés.
- **⛔ ORDRE TEMPLATES CORRIGÉ** : `INTENTION → FORME → TEMPLATE` harmonisé dans tous les docs.
- **🎯 PORTE UNIQUE `/beat`** : aiguilleur qui route carte→`mapbox-session.py` / data-viz→`beat-session.py`.
- **🔒 GATE DE PRÉSENTATION (hook)** : `.claude/hooks/pre-presentation-review.sh` BLOQUE tout upload d'un `.mp4` de livrable sans `<mp4>.review.json` frais, score ≥ 8.
- **📁 RÈGLE 3 ZONES dossiers** : livrable `<pilier>/<episode>/` · proto jetable `_rnd/<sujet>/` · brique `_shared/components/`.

---

## 🧹 (FAIT 2026-06-15→16) — GRAND MÉNAGE WORKSPACE : ce qui a changé

> Session dédiée au ménage/réorg complet. Détail : `memory/key-learnings.md` (section 🔧 MÉTHODE & PROCESS).

- **Démarrage allégé −62%** : `CLAUDE.md` projet (47→~13KB) ; routage complet extrait dans **`memory/ROUTAGE.md`**.
- **9 MCP débranchés** (supabase/neon/vercel/netlify/render/sentry/stitch/cavalry/phaser-editor).
- **3 piliers ont une porte d'entrée symétrique** : `src/projects/souverain/SOUVERAIN-INDEX.md` (NOUVEAU) · `atlas/_shared/ATLAS-INDEX-DES-INDEX.md` · `warmap/WARMAP-INDEX.md`.
- **Doctrines War-Map fusionnées 8→5** : grammaires → **`WARMAP-GRAMMAIRE.md`** · objets+SVG → **`WARMAP-ANIMER-OBJETS.md`**.
- **Scripts mappés** : `scripts/SCRIPTS-INDEX.md` + `scripts/tools/REVIEW-TOOLS-INDEX.md`.
- **Feedbacks rangés** dans `memory/feedbacks/`.
- **Garde-fou liens morts** : `python3 scripts/tools/check-links.py`.
- **Disque −4.7 GB** : worktrees morts, `.auto-claude/` supprimé, `out/wip` purgés.
- ⚠️ **Reste mineur** (non bloquant) : ~128 liens morts résiduels dans `memory/archive/` + `.claude/agent-memory/`.

---

## ✅ (LIVRÉ 2026-06-15) — BIBLIOTHÈQUE DE HOOKS RÉUTILISABLES

> ✅ **CHANTIER LIVRÉ + commité** (branche `feat/hooks-library`, commits 581542a + 21f7649).
> Code `src/projects/_shared/hooks-lib/`. Catalogue `hooks-lib/HOOKS-LIBRARY-CATALOGUE.md`.
> Source de vérité : `memory/HOOKS-LIBRARY-PLAN.md`. État détaillé : `memory/SESSION-DEDIEE-HOOKS.md` (en-tête).
> 3 hooks distincts (CrosshairLock, RedlineContagion, MaskReveal) + insert ArteryDrain.
> **RESTE (= refonte Acte 1 ci-dessous)** : brancher un hook sur la vraie vidéo AES + narration.

---

## ⭐ SYSTEME BEAT REMOTION HERO DATA — EN PLACE (2026-06-03)

Parite avec le systeme Mapbox atteinte. Avant tout beat Souverain Remotion/data-viz :
1. **LIRE** `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` (8 principes + section SFX + template storyboard 10 champs).
2. **Pipeline** `/beat` (`scripts/beat-session.py`) : phase 0 SCAN → storyboard Gemini multi-panels → breakdown → code → self-review → review Gemini.
3. **Briques** : section HERO DATA de `COMPOSANTS-INDEX.md`.
4. **Assemblage** : `memory/doctrines/SOUVERAIN-REMOTION-SKELETON.md`.
5. **1er beat produit (preuve)** : A3 Cailloux Maroc — `out/episodes/maroc-batteries/a3-cailloux-FINAL.mp4`.

**Lecon SFX** : toujours vérifier la DURÉE d'un SFX (`ffprobe`) avant usage — `ui/reveal.mp3` était corrompu (voix fantôme 18s), neutralisé.

---

## War-Map Sahel — Détail chantiers P4 FAITS (pour historique)

> P4 complète avec ses 6 scènes : exode ✅ · coût ✅ · ressources ✅ · confédération ✅ · CFA ✅ · fin habitée ✅.
> Tout FINAL dans `out/episodes/warmap-sahel/`. Détail complet : `memory/episodes/warmap-sahel/STATUS.md`.
