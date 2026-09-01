# 5 agents de production video — refondus 2026-04-13

> Migré depuis auto-memory 2026-08-31. Document historique de la refonte d'architecture agents
> (2026-04-13). Vérifié 2026-08-31 : les 5 agents listés existent toujours dans `.claude/agents/`
> (audio-director, storyboarder, visual-producer, remotion-composer, quality-reviewer) — ce
> document reste la référence du PRINCIPE directeur et du pipeline 8 Stages, à recouper avec
> `memory/SYSTEME-AGENTIQUE.md` (carte d'orientation courante) qui ne détaillait pas ce niveau.

## Principe directeur

**Tool-agnostic** : les 5 agents sont specialises par **role de production** (intemporel), PAS par outil (les outils Seedance, Gemini, Kling, Recraft evoluent vite).

## Les 5 agents

| Stage | Agent | Fichier | Role |
|-------|-------|---------|------|
| 1 | audio-director | `.claude/agents/audio-director.md` | TTS (ElevenLabs V3) + musique (Minimax) + mix + scan TTS francais BLOQUANT |
| 2 | storyboarder | `.claude/agents/storyboarder.md` | Script + audio mesure -> timing.ts frame-precis (formats flat ou ACTS+SCENES nested) |
| 3-4 | visual-producer | `.claude/agents/visual-producer.md` | Visual Plan proposal (aligne best practices) + assets multi-outils (Gemini, Seedance, Kling, Recraft V3/V4, fal.ai, PixelLab) |
| 5 | remotion-composer | `.claude/agents/remotion-composer.md` | Composition Remotion + 8 regles non-negociables + mini-render bloquant |
| 6 | quality-reviewer | `.claude/agents/quality-reviewer.md` | Self-review + Kimi "confirm or refute" + verdict separe (agent valide vs Aziz ear) |

## Pipeline 8 Stages (6 agents + Aziz + Claude orchestrateur)

```
Stage 0  Claude + Aziz       -> Script locked
Stage 1  audio-director      -> Audio (mesures + validation oreille Aziz)
Stage 2  storyboarder        -> timing.ts
Stage 3  visual-producer     -> Visual Plan proposal -> Aziz approuve
Stage 4  visual-producer     -> Assets generes (preview-before-pay)
Stage 5  remotion-composer   -> Composition + mini-render valide
Stage 6  quality-reviewer    -> Review + verdict + items deferred a Aziz
Stage 7  Aziz                -> Validation finale oreille + oeil + decision
Stage 8  Claude (main)       -> Fix iteration OU render final + publish
```

## Anciens agents archives

Dans `.claude/agents/archive/` (gardes pour reference, pas utilises) :
- creative-director (direction creative -> Claude principal)
- pixel-art-director (specifique Peste 1347)
- pixellab-expert (absorbe par visual-producer)
- kimi-reviewer (Kimi = outil encadre dans quality-reviewer)
- visual-qa + visual-qa-prompt (absorbe par quality-reviewer)

Anciennes memoires : `.claude/agent-memory/archive/`.

## Regles critiques encodees

### audio-director
- **Scan TTS francais BLOQUANT** avant toute generation ElevenLabs (participes "e/ee", "ont + voyelle", chiffres)
- **Ne peut PAS ecouter** — mesures objectives + demande validation Aziz a l'oreille
- Voice rules : Stephyra PVC interdit, Narrateur/Narratrice GeoAfrique valides
- Minimax `duration_seconds` ignore -> trim ffmpeg obligatoire

### storyboarder
- Formats SCENES-only flat OU ACTS+SCENES nested
- Frontieres ABSOLUES `{start, end}` jamais durees relatives
- Scenes calent sur phrases completes (pas de split mid-sentence)
- Silences absorbes dans la scene precedente

### visual-producer
- **Doc-First** : lire `memory/tools/{outil}.md` AVANT tout prompt
- **Preview-before-pay** : refs + prompt + cout AVANT appel API
- **Self-review avant presentation** Aziz (Read tool)
- Recraft V3 = Style ID, Recraft V4 = pas de Style ID

### remotion-composer
- Audio-derived timing (jamais hardcoder 30)
- spring() > interpolate() pour mouvements naturels
- premountFor systematique
- extrapolateRight 'clamp'
- Mini-render bloquant AVANT de coder d'autres scenes

### quality-reviewer
- Self-review EN PREMIER, Kimi APRES
- Kimi en mode "confirm or refute" SEULEMENT (pas de suggestions creatives)
- Rapport separe ce que l'agent a valide (mesurable) vs ce qui requiert Aziz (audio percu, emotion vocale, jugement final)
- Circuit breaker : 3+ problemes structurels -> STOP, pas patcher

## Memoires agents

Chaque agent a sa propre memoire persistante :
- `.claude/agent-memory/audio-director/MEMORY.md`
- `.claude/agent-memory/storyboarder/MEMORY.md`
- `.claude/agent-memory/visual-producer/MEMORY.md`
- `.claude/agent-memory/remotion-composer/MEMORY.md`
- `.claude/agent-memory/quality-reviewer/MEMORY.md`
- `.claude/agent-memory/shared/PIPELINE.md` (hand-offs entre agents)

## Premier test production — Soundjata Acte VII (2026-04-14) — APPROVE one-shot

**Verdict global** : pipeline mature, workflow fluide, verdict APPROVE au premier passage du quality-reviewer. Temps total ~45 min pour 1 Acte (13.2s de video finale). Cout : $4.21.

**Resultats par agent** :

| Agent | Perf | Erreurs commises | Corrections |
|-------|------|------------------|-------------|
| visual-producer Stage 3 (Visual Plan) | Moyen | Propose storyboard 1x5 au lieu de 9 panels 3x3 (obsolete depuis avril 13) + invente limite Seedance a 4 images (vraie limite = 9) | 2 corrections + 2 regles sauvegardees dans memoire agent |
| visual-producer Stage 4 (assets Gemini) | Moyen | Storyboard genere en 1x5 (Gemini respecte format hybride) + young griot genere en enfant (Gemini glisse vers tropisme "enfant auditeur") | 2 regens ($0.16), apprentissages sauvegardes |
| visual-producer Stage 4 (Seedance) | Tres bon | Aucune | Clip 9 shots, identites locked, kora rigide, mumble Sims accepte |
| remotion-composer Stage 5 | Excellent | LOOP_START=240 place en plein MEDIUM 2 personnages, pas en WIDE FINAL | Circuit-breaker respecte (a signale avant de patcher), correction en 1 iteration apres diagnostic clip source |
| quality-reviewer Stage 6 | Excellent | Aucune | Self-review 2fps + audio mesures RMS + Kimi K2.5 confirm-or-refute ($0.02) + distingue bien mesurable vs Aziz |

**Regles ajoutees dans les memoires agents apres ce test** :

1. **Duration match scene** (visual-producer + storyboarder) : cross-check bloquant `clip_s >= narration_s` avant tout appel API
2. **9 panels 3x3 par defaut** (visual-producer) : pattern pour TOUT storyboard-to-video (pas seulement combat)
3. **Limite Seedance 9 images** (visual-producer) : correction de l'hallucination "max 4"
4. **Gemini enfant drift** (visual-producer, gemini.md) : forcer age adulte 3x + marqueurs anatomiques en contexte transmission
5. **Mumble Sims = atout** (seedance-storyboard-technique regle 15) : garder generate_audio: True, ne pas forcer "silent mouth"
6. **Distinction couleurs OTS** (seedance-storyboard-technique regle 16) : verifier couleurs distinctes entre perso co-cadres
7. **9 panels valide en contemplatif** (seedance-storyboard-technique regle 17) : preuve en production

**Projection efficacite (2026-04-14)** : avec les apprentissages integres, 2-3 scenes par session plausibles. Parallelisation possible : Visual Plans simultanes sur 2-3 Actes + batch refs Gemini + clips Seedance en parallele. Stage 6 quality-reviewer skippable sur Actes simples (reserve aux combats/transitions critiques).
