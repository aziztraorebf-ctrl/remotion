# Last 30 Days Skill - Full Analysis

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — analyse du skill `last30days` réalisée fev 2026
> pour un projet finance FR/niche médiévale abandonné depuis. Le skill lui-même existe toujours
> (disponible dans la liste des skills Claude Code). Conservé pour la méthode d'intégration dans
> un pipeline de scriptwriting, potentiellement transposable à d'autres projets.

## What It Is
Claude Code skill (by Matt Van Horn, from Greg Isenberg podcast) that scans Reddit + X + Web
strictly on the last 30 days, then injects that context into the conversation BEFORE any generation.
Claude shifts from "general intelligence" to "current market expert".

## Technical Requirements
- 3 API keys: Claude Code (have), OpenAI (have - Reddit via exclusive licensing deal), XAI (have)
- Skill runs 3 sources in parallel, filters 30 days, synthesizes trends + controversies + sentiment
- Result injected as context before any generation task

## What It Does Well
- Detect trending angles (avoid saturated topics, find fresh perspectives)
- Capture current vocabulary (script uses terms audience uses NOW, not generic)
- Calibrate marketing timing (when/where to post for discoverability)
- Find content gaps (what people discuss but nobody has explained well)
- Cross-platform triangulation ("Moon sous steroides"): same topic on Reddit + X + Web = strong signal

## What It Does NOT Do
- NOT a source of scientific facts (X and Reddit = signal + noise)
- Does NOT replace deep research (Multi-LLM, Perplexity)
- ZERO value for Remotion coding (APIs don't change every 30 days)
- Useless for stable/historical topics ("how photosynthesis works")

---

## Integration Architecture (DECIDED at the time)

```
[Etape 0] Last 30 Days (zeitgeist, angles, vocabulary)
    |
[Checkpoint Aziz] Choose angle from 3 proposals
    |
[Phase 1-2] Multi-LLM Research + Synthesis (facts, data, sources)
    |
[Phase 3-4] Script Writing + Quality Review
```

### Where It Fits in the Workflow (at the time)

1. **Etape 0 of scriptwriting pipeline** (before deep research)
   - Primes Phase 1 (Multi-Angle Research) with current landscape
   - Know which angles are saturated vs under-explored
   - Capture dominant sentiment and emerging controversies

2. **Hook generation** - for finance FR niche, critical
   - Hook must resonate with Thomas's pain points TODAY, not 6 months ago
   - Scan r/vosfinances, r/france, X finance FR for active pain points

3. **Post-publication marketing** - scan target subreddits before posting
   - Calibrate timing and angle for organic discovery
   - 3-5x discovery multiplier vs random posting

### Where It Does NOT Fit
- Remotion coding phase (zero added value)
- Base artistic direction (style must stay consistent, not change per video)
- Pure historical topics (but CAN find contemporary hook angles)

---

## Use Cases Identified (from Gemini conversation)

### 1. Myth Busting (HIGH VALUE)
Scan myths currently circulating on Reddit/X about finance ("PEL is still profitable",
"life insurance is dead"). Gives instant hooks: "You may have seen this week that..."

### 2. Dynamic Persona Pain Points (HIGH VALUE)
Persona "Thomas" (voir `persona-finance-fr.md` archivé, même dossier) was built with 135 static
sources. Last 30 Days makes him LIVE: what are Thomas-like users posting on r/vosfinances THIS
week? Transforms fixed persona into dynamic persona.

### 3. Comment Optimization (LOW PRIORITY)
Calibrating YouTube comment responses with trending vocabulary. Over-engineering for a
creator without community yet. Save for 10k+ subscribers.

### 4. Subject Selection for Abstract Niches (MEDIUM VALUE)
For topics like "cognitive bias psychology", skill won't find "cognitive bias" trending.
BUT will find real situations where biases manifest: viral scams, market crashes, absurd
political decisions. Angle becomes: "This week, 500k people got scammed by [X]. Here's
the cognitive bias that explains why."

### 5. Style Trend Scanning (TESTED — see `last30days-style-trends-scan-feb2026.md`)
Launch Last 30 Days on "YouTube educational animation style trends 2026" to see if
hand-drawn/sketch style emerges organically. Real validation vs Gemini simulation.

---

## Key Decisions (at the time)

### 30 Days (not 60)
30 days is correct. 60 dilutes the signal. Social media half-life is short.
Exception: legislative cycles (budget law, pension reform) might need 60 days to capture
full deliberation -> vote -> reaction arc. But that's specific, not default.

### Cross-referencing = Real Advantage
When same topic emerges independently on Reddit + X + Web = strong signal.
When only on X = might be echo chamber noise.
Same triangulation principle as the Multi-LLM pipeline (Grok + Gemini + OpenAI)
but for TRENDS instead of FACTS.

### Page Blanche Resolution
Last 30 Days resolves "no idea" anxiety (gives angles).
Does NOT resolve "no confidence" anxiety (only real viewer feedback does).
For Aziz: more about VALIDATION of chosen angle than IDEATION.

---

## 3-Phase Playbook (from Gemini conversation)

| Phase | Action | Equivalent at the time |
|-------|--------|---------------|
| Scan (Input) | Last 30 Days injects zeitgeist | New Etape 0 |
| Pivot (Analysis) | Claude identifies angles + gaps | Integration into Phase 0-1 of scriptwriting skill |
| Execute (Output) | Calibrated generation | Phases 2-4 of scriptwriting skill |

**Critical addition**: Checkpoint between Pivot and Execute where AZIZ validates the chosen
angle. Claude proposes 3 angles, Aziz picks 1. Keeps directorial authority.

---

## Reserves & Risks

1. **Recency bias**: NEVER confuse "what people say" with "what is true"
   - Rule: Last 30 Days = sentiment, Multi-LLM = facts, Perplexity = verification

2. **Over-engineering**: Don't use by default on every video
   - Decision matrix: critical for news/trends, useless for stable topics

3. **Simulation vs Reality**: Gemini's Dark Triad simulation was NOT a real scan
   - Real quality depends on French Reddit coverage, X density, web article freshness
   - Must test with real API calls to evaluate actual output quality

4. **Style consistency**: Last 30 Days should NEVER change base visual style
   - At most: inform micro-adjustments (accent color, cultural reference in illustration)
   - Never the foundation (typography, layout, character design)

---

## Cost (at the time)
- ~$2-4 per video in API calls
- ~10-15 min additional time per video
- Can reduce fact-checking by ~30% (better calibrated angles from start)
- All API keys already available (OpenAI, XAI, Claude Code)
