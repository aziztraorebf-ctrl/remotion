# Production Pipeline — Shared Workspace (5 agents)

> Fichier partagé. Chaque agent écrit sa section lors de son invocation.
> Claude principal orchestre les handoffs.
>
> **Refondu 2026-05-20 (Grand Ménage)** — l'historique complet des handoffs
> des sessions Sonjata/Thiaroye/Abou Bakari/Or Africain/Silicon Savannah/etc.
> est archivé dans `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`
> (491 lignes). Ce fichier reflète l'état actuel et les workflows actifs.

---

## Workflows actuellement actifs (depuis ~mi-mai 2026)

Le système agentique 5-stages reste **la référence** pour la production vidéo
complète et est conservé pour usage futur. Mais depuis ~5 semaines, deux
workflows allégés sont utilisés en pratique :

### Workflow A — Beat Souverain (`scripts/beat-session.py`)

Pipeline 6 phases automatisées par script, Claude main code en direct :
```
1. breakdown    → Gemini 3.1-pro analyse le storyboard (JSON tailwind_layout)
2. code         → Claude écrit Beat*.tsx avec Tailwind (tokens text-gold, etc.)
3. self-review  → 23 critères de qualité, seuil 19/23 bloquant
4. review       → Gemini 3.1-pro vérifie le render (1 seul appel)
5. corrections  → Itérations autonomes
6. upload       → Catbox + ntfy mobile Aziz pour validation finale
```

Documentation complète : `memory/rules-beat-production.md` + section
"Pipeline Beat Souverain" du CLAUDE.md projet.

### Workflow B — Atlas direct

Claude main + PixelLab MCP + Mapbox + scripts `scripts/atlas-session.py`.
Pas d'agents intermédiaires. Storyboard markdown → code → render.
Beats Atlas (Peste 1347 actif) suivent le pattern documenté dans
`src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`.

### Quand utiliser les 5 agents Stage 1→6 ?

Pour les productions narratives complètes nécessitant le full pipeline :
- Shorts ambitieux avec narration + storyboard + assets visuels multiples
- Épisodes Atlas riches (PixelLab characters + tilesets + animations)
- Quand tu veux la rigueur du multi-agents avec handoffs traçables

Pour les beats simples ou itératifs : Workflow A ou B suffisent.

---

## Agent Team (5 agents — préservés, prêts à l'emploi)

1. **audio-director** — Narration TTS (ElevenLabs V3) + musique (Minimax v2.6) + mix
2. **storyboarder** — Script + audio mesuré → `timing.ts` frame-précis
3. **visual-producer** — Assets multi-outils (Gemini, Seedance, Kling, Recraft, fal.ai, PixelLab)
4. **remotion-composer** — Composition Remotion + mini-render validation
5. **quality-reviewer** — Review multi-dimensions + verdict APPROVE/MINOR FIX/RE-EVALUATE

**Anciens agents archivés** : creative-director, pixel-art-director, pixellab-expert, kimi-reviewer, visual-qa (remplacés par visual-producer + quality-reviewer en avril 2026).

Définitions dans `.claude/agents/` (les `.md` qui décrivent rôle/outils/règles de chaque agent).

---

## Pipeline Stages 5-agents (workflow complet)

```
Stage 0  Claude + Aziz       → Script locked
Stage 1  audio-director      → Narration + musique + mix (scan TTS bloquant)
Stage 2  storyboarder        → timing.ts frame-précis (audio mesuré)
Stage 3  visual-producer     → Visual Plan proposal → Aziz approuve
Stage 4  visual-producer     → Assets générés (preview-before-pay)
Stage 5  remotion-composer   → Composition + mini-render 3-4s bloquant
Stage 6  quality-reviewer    → Review multi-dim + Kimi + verdict
Stage 7  Aziz                → Validation finale (oreille + œil + décision créative)
Stage 8  Claude (main)       → Render final OU fix iteration
```

**Règles du pipeline (quand on l'invoque)** :
- Stage 1 prerequis : script LOCKED par Aziz
- Stage 2 prerequis : audio existe ET mesuré (ffprobe ou forced alignment)
- Stage 3 prerequis : Aziz approuve Visual Plan AVANT toute génération
- Stage 4 règle : preview-before-pay pour CHAQUE appel API payant
- Stage 5 prerequis : mini-render validation AVANT de coder d'autres scènes
- Stage 6 règle : self-review AVANT Kimi, jamais l'inverse

Format de handoff entre agents : voir `.claude/agent-memory/shared/TODOWRITE-PATTERN.md`.

---

## État actuel des projets (2026-05-20)

### ⚡ Actif

- **Maroc Batteries (Mid-form 4-5 min)** — prochain. Pré-prod prête :
  `memory/STARTER-PROMPT-maroc-batteries-midform.md`. Workflow probable : A (Beat Souverain)
  ou complet 5-agents selon ambition.
- **Sénégal Pétrole & Gaz (Mid-form 7 beats 420s)** — Beat1 à recommencer propre.
  Code des 5 versions abandonnées archivé dans `src/_archive/senegal-attempt-v1-v5/`.
  Pré-prod intacte : `memory/episodes/souverain/senegal-petrole-gaz/` + audio
  final validé (`senegal-petrole-auphonic-trimmed.mp3`).
- **Peste 1347 (Atlas)** — Beat 5 Mali Vivant. Storyboard prêt :
  `public/atlas/peste-1347/storyboard/beat5-storyboard.md`. Workflow B (Atlas direct).
  Démarrage : `python3 scripts/atlas-session.py --episode peste-1347 --beat 5`.

### 💤 En pause / dormants

- **Hannibal (Atlas)** — Beat 1 livré, Beat 2 Phase C non codée. Dossier mémoire
  préservé : `memory/episodes/hannibal/`. Code dans `src/_archive/episodes-livres/atlas/hannibal/`.
- **Vraie Taille Afrique (Souverain Short)** — FINAL livré, conservé en archive pour réf.
- **Xenophobie SA (Souverain)** — gelé, à reprendre 2-3 mois (memory/episodes/souverain/xenophobie-sa-EXPLORATION/).
- **Mali blocus carburant (Souverain)** — en pause, reprendre juin 2026+.
- **Congo Taille (Souverain)** — fact-sheet seul, inactif.

### ✅ Livrés (PRET-PUBLICATION)

8 vidéos dans `out/PRET-PUBLICATION/` :
niger-uranium, silicon-savannah, or-africain, sonjata-v7, thiaroye-v5,
mansa-moussa-atlas-v2, empire-ghana-v2, vraie-taille-afrique.

Mémoires épisodes archivées dans `memory/archive/episodes-livres/`.
Code épisodes archivé dans `src/_archive/episodes-livres/`.

---

## Patterns validés cross-projet (références durables)

- **Hook Short (pattern teaser 5s)** — voir `memory/templates/` et BrutalHookSplit dans `src/projects/_shared/components/layouts/`.
- **Musique Minimax 2.6** — `memory/tools/minimax.md`. Coût ~$0.30/track 3min.
- **Narration ElevenLabs V3** — voix GéoAfrique V2 `z3gESu49naEZW8Af2Upm`. Règles TTS françaises NON-NÉGOCIABLES (voir `memory/voices-v3.md` + CLAUDE.md projet).
- **Integration Remotion audio** — `<Audio src={staticFile(...)} />` + `AUDIO_SEGMENTS` audio-derived timing.
- **Atlas Blueprints Library (8 patterns)** — `src/projects/atlas/_blueprints/` (walk-to-destination, confrontation, orbital-city, zoom-revelation, shake-impact, alliance, empire-expansion, flashback).
- **Beat Souverain workflow** — voir `scripts/beat-session.py` + `memory/rules-beat-production.md`.

---

## HANDOFF LOG (sessions actives)

> Format : `## Stage N — Agent — Projet — Date [COMPLETE / IN PROGRESS / BLOCKED]`
>
> Quand un agent termine son stage, il ajoute son entrée ici.
> Claude main propose le stage suivant à Aziz quand un handoff `COMPLETE` apparaît.
>
> Les handoffs des sessions terminées (Sonjata, Thiaroye, Abou Bakari, Or Africain,
> Silicon Savannah, Niger Uranium, Zimbabwe Lithium, RDC No Sense, etc.) sont
> dans le snapshot archivé : `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`.

_(Aucun handoff actif. Workflow Beat Souverain (peste-1347, maroc-batteries) ne log pas ici — voir directement les fichiers projet.)_
