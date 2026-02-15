---
name: youtube-scriptwriting
description: Write YouTube scripts for educational animated videos (8-15 min, Kurzgesagt/Brightside style). Use when Aziz asks to write, review, or structure a video script. Applies research-backed retention frameworks and Remotion-specific visual cues.
---

This skill guides the creation of YouTube scripts for animated videos produced with Remotion (React). Default audience: francophone curious viewers (25-45 years old). Duration: 8-15 minutes.

When invoked, Claude MUST follow the workflow in order:

```
Phase 0: Discovery Interview -> Understand the video project
Phase 1: Multi-Angle Research -> Gather diverse perspectives via LLM APIs
Phase 2: Multi-Step Synthesis -> Deep research + expansion + synthesis
Phase 3: Script Writing -> Write based on ALL research, not general knowledge
Phase 4: Quality Review -> Checklist before delivery
```

## Phase 0: Discovery Interview (MANDATORY)

Before writing ANYTHING, Claude MUST ask these questions using AskUserQuestion. Do NOT skip this phase.

### Required Questions (ask all at once):

1. **Subject**: "Quel est le sujet exact de la video ?"
2. **Core Message**: "Quel est le UN message cle que le viewer doit retenir ?"
3. **Duration**: "Quelle duree cible ? (8 / 10 / 12 / 15 min)"
4. **Niche**: "Quelle niche ?" (options: Educational, Finance, Explainer, Stick Figures, Game Quest, Other)
5. **Tone**: "Quel ton ?" (options: Kurzgesagt, Veritasium, Ali Abdaal, Provocateur, DirtyBiology, Quest Master, Custom)
6. **CTA**: "Quel CTA a la fin ? (abonnement, lien, produit, aucun)"
7. **Key Points**: "Y a-t-il des points specifiques a couvrir obligatoirement ?"
8. **References**: "Y a-t-il des videos de reference dont tu aimes le style ?"

### Optional Follow-ups (if needed):
- "Audience specifique ou general ?"
- "Multilingue prevu ? (sous-titres, doublage, re-creation)"
- "Y a-t-il des assets visuels deja prets ?"

Only proceed to Phase 1 after receiving answers.

## Phase 1: Multi-Angle Research (RECOMMENDED)

Each LLM has a unique research strength. Run the initial research launcher to get diverse perspectives on the video's topic:

```
python -u research/launch_deep_research.py
```

This generates 3 reports with different angles:
- **Gemini** (academic): Studies, data, cognitive science, meta-analyses
- **Grok** (terrain): Reddit/X trends, creator insights, what's working NOW, provocative angles
- **Perplexity** (citations): Web sources with verified URLs (to add later)

These reports are saved in `research/` as individual .md files. Claude MUST read them before writing.

### If reports already exist:
Ask Aziz: "As-tu deja des rapports de recherche sur ce sujet ? (Gemini, Grok, Perplexity, NotebookLM podcasts, etc.)"
- If YES: Read ALL provided reports before proceeding
- If NO: Run the research launcher OR proceed to Phase 2

### External sources Aziz may provide:
- NotebookLM podcast transcripts or notes
- Gemini Canvas infographics
- Personal research notes
- Competitor video analysis

Claude MUST integrate ALL provided materials into the script. Nothing should be ignored.

## Phase 2: Multi-Step Synthesis Pipeline (RECOMMENDED)

After individual LLM reports, run the multi-step pipeline for deeper, expanded research:

```
python -u research/multi_step_research.py
```

This pipeline:
1. Decomposes the topic into 6-8 sub-questions
2. Researches each sub-question with web search (parallel)
3. Expands each result with additional examples, data, context
4. Synthesizes everything into a unified report with numbered citations

Output: `research/04_multistep_[topic]_synthesis.md` + `research/04_multistep_sources.json`

Note: The script currently needs CONTEXT and topic_prompt modified for each new topic. Claude can edit the script before running it.

### Skip Phases 1-2 (Quick Draft):
If Aziz explicitly says "skip research" or provides all content himself, go straight to Phase 3. But Claude MUST warn: "Sans recherche prealable, le script sera base sur mes connaissances generales. La qualite et la precision seront inferieures."

## Phase 3: Script Writing

**CRITICAL**: Claude writes the script based on the RESEARCH REPORTS, not general knowledge.

Before writing, Claude MUST:
1. Read all available research files in `research/`
2. Read any external materials Aziz provided
3. Identify the strongest data points, examples, and angles from the research
4. Plan which research findings map to which script segments

### Metaphor Mapping Table (Game Quest niche ONLY)

When the Game Quest niche is selected, Claude MUST complete this mapping table BEFORE writing any script text. Present it to Aziz for validation.

| Game Element | Maps To | In This Video | Example from Research |
|---|---|---|---|
| Game name | Video topic | | |
| Player / Avatar | Viewer or protagonist | | |
| Player name(s) | Identity or status changes | | |
| Health bar | Key metric or state | | |
| Score / Counter | Significant number | | |
| Levels | Stages, epochs, or chapters | | |
| Enemies / Obstacles | Forces working against | | |
| Power-ups / Items | Solutions, tools, resources | | |
| Boss | Major challenge or climax | | |
| NPCs | Supporting characters or figures | | |
| Game over condition | Stakes / what failure looks like | | |
| Win condition | Goal / what success looks like | | |

**Rules for the mapping table:**
1. Every row must be filled. If a game element has no natural mapping, the element is dropped (not forced).
2. The "Example from Research" column forces grounding in actual research, not generic concepts.
3. Aziz validates the table BEFORE script writing begins. Changes to the mapping after writing starts require rewriting affected segments.
4. The mapping dictates the Script Structure: Levels become Act 3 segments, Boss becomes the mid-video pattern interrupt or climax, Power-ups map to the Release phase of micro-loops.

Every major claim in the script should be traceable to a researched source.

## Core Principles (Research-Backed)

These rules are derived from multi-source research (118 sources, 2024-2026 data):

1. **80% abandon in first 30 seconds** - The hook is everything. Target >70% retention at 30s.
2. **42.1% average retention for educational** vs 21.5% for vlogs. Target 55%+ AVD.
3. **Animated content gets 70%+ AWT** vs 45-55% for pure tutorials. Remotion is a competitive advantage.
4. **Micro-segments of 90 seconds** - Every 90s needs a re-hook or pattern interrupt.
5. **Storytelling > Lecture** - SNV (Storytelling Narrated Video) beats LNV (Lecture Narrated Video) on retention AND knowledge transfer.
6. **8-15 min is the sweet spot** - x25 revenue vs Shorts, optimal for deep educational engagement.

## Conversational Voice Principles (ALL Niches)

These 8 principles apply to every script regardless of niche or tone. Derived from analysis of high-retention animated and educational channels. They define HOW the narrator speaks, not WHAT they say.

1. **Zero Preamble**: Start in the action. No "welcome", no "in this video", no context-setting. The viewer arrives mid-scene. The first sentence IS the hook, not a runway to it.

2. **Singular "You"**: Address ONE person, never a crowd. "This is you" > "you guys". "Imagine you're..." > "Imagine we're all...". The viewer is the only person in the room.

3. **Analogy Before Explanation**: The viewer understands the analogy first. THEN the factual/technical content confirms what they already grasped intuitively. Never: [fact] then [analogy to help understand]. Always: [analogy that makes it click] then [fact that validates].

4. **"But" Pivot**: Every comfortable moment is immediately followed by a "But" that opens new tension. The viewer never feels settled. Comfort -> "But" -> new tension -> comfort -> "But" -> repeat. This is the engine of forward momentum.

5. **Vocalized Objection**: Anticipate the viewer's pushback and SAY it out loud, as if interrupted. "But hold on — you might say..." or "OK but what about...?" is more engaging than "Some critics argue that...". Use first name or "you" — make it feel like a real interruption, not an academic rebuttal.

6. **Confession = Credibility**: Share a real vulnerability at the moment the viewer might perceive the narrator as lecturing from above. Not a humble brag. A genuine admission: "I used to think...", "Honestly, when I first read this...", "I'll be the first to admit I got this wrong." This resets the power dynamic to side-by-side.

7. **Open-Loop CTA**: Never end with a summary. End with an UNANSWERED question that the next video resolves. Structure: [Identify the viewer's lingering doubt] + [Promise what they'll get] + [Link]. "To find out exactly why X happens and how to Y, check out this video" > "Thanks for watching, don't forget to subscribe."

8. **Rhetorical Question = Attention Reset**: Every 30-60 seconds, ask a question the viewer can't help but mentally answer. "Seems impossible, right?" / "So what do you do?" / "But who exactly was X?" This forces cognitive re-engagement and prevents passive watching.

## Script Structure Template

Every script MUST follow this structure. No exceptions.

### Act 1: HOOK (0-30 seconds, ~75 words)

Choose ONE hook type (ranked by effectiveness for educational):

| Hook Type | When to Use | Example Pattern |
|-----------|-------------|-----------------|
| Contrarian/Shock Stat | Science, AI, tech | "93% of tasks are automatable - but 80% of pros burn out. Why?" |
| Curiosity Gap | Mystery, discovery | "There's something wrong with how we think about [X]. And it's costing us." |
| In Media Res | Story-driven topics | Start mid-action, then rewind to explain |
| Visual Explosion | Abstract concepts | [ANIM: Particles/zoom/transformation] + one-line premise |

**Rules:**
- NO "Hey guys", NO "In this video", NO "Let me explain" — Zero Preamble (see Conversational Voice #1)
- First visual must appear at 0:02-0:03 (animated element)
- State the VALUE PROPOSITION within 15 seconds
- Open at least ONE loop that won't close until later
- Use singular "you" from the very first sentence (Conversational Voice #2)
- "Imagine" hooks MUST use concrete, sensory scenarios — "Imagine you're homeless on the streets, stealing to survive" > "Imagine a difficult situation"

### Act 2: PREVIEW (30-45 seconds, ~40 words)

- Announce 3-5 key points briefly ("Three frameworks that change everything")
- This sets expectations and reduces anxiety = +20% stickiness
- Add chapter markers for YouTube: [CHAPTER: Title]

### Act 3: BODY (5-7 segments, 1-2 min each)

Each segment follows the **Micro-Loop** pattern:

```
TENSION (20s) -> Setup misconception or stakes
CONTENT (40-60s) -> Core information with examples
RELEASE (15s) -> Payoff, proof, or actionable takeaway
CLIFFHANGER (5s) -> Tease next segment ("But there's a catch...")
```

**Segment rules:**
- ONE concept per minute maximum (cognitive load management)
- 80/20 ratio: education/entertainment
- Every segment needs a [VISUAL CUE] for Remotion animation
- Re-hook every 90 seconds: "But what most people don't know...", "Here's where it gets interesting..."
- Use Value Loops: Context -> Example -> Framing for each point
- Mid-video (segment 3-4): insert strongest pattern interrupt to fight the -15% slump at 55-65% mark
- **"But" pivot between segments**: End each segment on comfort, start next with "But" tension (Conversational Voice #4)
- **Vocalized objection once per 2-3 segments**: "But hold on — you might say..." (Conversational Voice #5). The viewer feels heard, not lectured.
- **Rhetorical question every 30-60 seconds**: "Seems impossible, right?" / "So what do you do?" forces cognitive re-engagement (Conversational Voice #8)
- **Analogy THEN fact, never reverse**: Lead with the image the viewer can see in their mind, then anchor it with data (Conversational Voice #3)
- **One confession per script**: At the moment the narrator risks sounding preachy, insert a genuine personal vulnerability (Conversational Voice #6)

### Act 4: RECAP + CTA (final 30-45 seconds)

- Animated summary of key takeaways (3 max)
- Close ALL open loops from earlier — EXCEPT one (the Open-Loop CTA below)
- CTA placement: AFTER delivering final value, not before
- **Open-Loop CTA (Conversational Voice #7)**: End with an unanswered question that the next video resolves. Structure: [Viewer's lingering doubt] + [Specific promise of what they'll gain] + [Link]. Example: "Pour decouvrir exactement pourquoi X se produit et comment Y change tout, regarde cette video." NEVER: "Merci d'avoir regarde, n'oubliez pas de vous abonner."

## Visual Cues for Remotion

Every script MUST include inline visual directions. Use these markers:

```
[ANIM: description] - Animated element (particle system, transformation, zoom)
[GRAPH: description] - Data visualization (chart, stat counter, comparison)
[CHAR: action] - Character animation (expression, gesture, movement)
[TRANS: type] - Transition between scenes (cut, dissolve, wipe, zoom)
[TEXT: content] - On-screen text overlay
[CHAPTER: title] - YouTube chapter marker
[PAUSE: Xs] - Dramatic pause for timing
[B-ROLL: description] - Background visual while narration continues
[GAME-HUD: element change] - HUD element updates (name change, health bar, score increment)
[LEVEL: name/number] - Scene or level transition
[BOSS: description] - Boss encounter or major challenge reveal
[QUEST: objective] - Quest or mission statement appears on screen
[CHOICE: options] - Player choice moment (rhetorical fork in the road)
```

**Game markers**: The [GAME-HUD], [LEVEL], [BOSS], [QUEST], and [CHOICE] markers are OPTIONAL additions for the Game Quest niche. They supplement (not replace) standard markers. A Game Quest script uses both standard markers ([ANIM], [CHAR], [TRANS]) AND game markers together.

Place visual cues every 5-10 seconds minimum. Remotion animations are the retention advantage.

## Pacing Guidelines

| Video Length | Word Count | Segments | Re-hooks | Chapters |
|-------------|-----------|----------|----------|----------|
| 8 min | ~1200 words | 5 | 5-6 | 4-5 |
| 10 min | ~1500 words | 6 | 6-7 | 5-6 |
| 12 min | ~1800 words | 7 | 7-8 | 5-6 |
| 15 min | ~2250 words | 7-8 | 9-10 | 6-7 |

Speaking rate: ~150 words/minute for educational content (slower than conversational).

## Tone Presets

Aziz can request a tone. Default is "Kurzgesagt".

| Preset | Description | Voice Style |
|--------|-------------|-------------|
| Kurzgesagt | Wonder + precision, cosmic perspective | Calm authority, awe-inspiring |
| Veritasium | Contrarian + experimental | "Actually, you're wrong about..." |
| Ali Abdaal | Practical + personal | Friendly expert, frameworks |
| Provocateur | Raw + anti-establishment (Grok-style) | Direct, challenges assumptions |
| DirtyBiology | Humor + science FR | Casual, references culturelles FR |
| Quest Master | Guide + game vocabulary woven in | Conversational narrator guiding a player |

### Quest Master Tone (Detail)

The Quest Master tone turns the narrator into a game guide, not a lecturer. Key characteristics:

- **Anticipated objections as player questions**: "But hold on, you might say..." / "But wait, what about...?"
- **Rhetorical questions as game choices**: "Would you take the power-up?" / "So what do you do?"
- **Direct address as player guidance**: "You" is the player, always. Never "we" or passive voice.
- **Game vocabulary woven naturally**: terms are introduced in-context, not forced. The game IS the explanation.
- **Conversational pacing**: Short sentences. Questions. Then answers. Like talking to someone next to you, not lecturing from a podium.
- **Combines with any niche**: Quest Master + Educational = Kurzgesagt-meets-RPG. Quest Master + Provocateur = challenging game with no mercy.

Reference: High-retention pixel art + educational channels, Extra Credits (history as game design)

## Niche Presets

The skill adapts to different video niches. Each preset modifies hook style, pacing, and vocabulary.

### Educational (Default)
- Hook: Curiosity Gap or Contrarian Stat
- Pacing: 150 words/min, 80/20 edu/entertainment
- Vocabulary: Accessible but precise, vulgarize without dumbing down
- Examples: Kurzgesagt, Veritasium, 3Blue1Brown, TED-Ed

### Finance / Investing
- Hook: Money-related shock stat or "what they don't tell you" angle
- Pacing: 140 words/min, more deliberate (trust is key)
- Vocabulary: Demystify jargon, always define terms on first use
- Visual cues: [GRAPH] heavy (charts, tickers, comparisons)
- Extra rule: ALWAYS include disclaimer text [TEXT: "Ceci n'est pas un conseil financier"]
- Examples: Graham Stephan, Andrei Jikh, Finary (FR)

### Explainer / How-To
- Hook: Problem-first ("You've been doing [X] wrong")
- Pacing: 160 words/min, faster and more direct
- Vocabulary: Step-by-step, actionable, numbered
- Visual cues: [TEXT] heavy (numbered steps, checklists)
- Extra rule: End each segment with a concrete actionable takeaway
- Examples: Ali Abdaal, Thomas Frank, MKBHD

### Stick Figures / Minimalist Animation
- Hook: Story opening or "Imagine this..." scenario
- Pacing: 145 words/min, story-driven
- Vocabulary: Conversational, first-person, relatable
- Visual cues: [CHAR] heavy (expressions, gestures, stick figure actions)
- Extra rule: Script must work with MINIMAL visual complexity (no particle systems, no 3D)
- Examples: Conversational animated explainers, stick-figure storytellers

### Game Quest / Metaphor-Driven
- Hook: "Imagine you're a character in..." or opening with game rules, stakes, and immediate obstacle
- Pacing: 145 words/min, story-driven (same rhythm as Stick Figures)
- Vocabulary: Game terminology mapped 1:1 to real concepts via Metaphor Mapping Table (see Phase 3)
- Visual cues: Heavy [GAME-HUD:], [LEVEL:], [CHAR:], [BOSS:] markers. Standard [ANIM:] and [TRANS:] still used.
- Extra rules:
  - **ONE metaphor per video**: Choose one game genre (platformer, RPG combat, top-down adventure, strategy) and commit fully. NEVER mix metaphors within a single video.
  - **HUD is narrative, not decorative**: HUD elements MUST change at least 3 times to reflect story progression (e.g., name SINNER to RIGHTEOUS, health bar dropping/refilling, score incrementing to a meaningful number)
  - **Easter eggs in game elements**: At least 1 hidden meaning in a game element (score = significant date, item name = real reference, level number = chapter/verse)
  - **Concept Mapping Table REQUIRED**: Before writing any script text, complete the Metaphor Mapping Table (see Phase 3). Every major real concept must have a game equivalent.
  - **Metaphor structures the script, not decorates it**: The game IS the video structure. Levels = segments. Boss = climax. Power-up = solution. If the metaphor can be removed and the script still works, the metaphor is decoration, not structure.
  - **Reuse visual assets across videos**: Simple pixel art characters and environments should be designed for reuse (brand identity, not one-off production)
- Examples: Pixel art + religious education channels (700K+ subs), Extra Credits (game design applied to history), animated history storytellers

### Custom Niche
- Aziz describes the style and Claude adapts dynamically
- Claude asks: "Donne-moi 2-3 chaines de reference pour que je calibre le ton"

## Francophone Adaptation Rules

- Curiosity gaps adapted to EU/FR context (energy, AI regulation, EU tech)
- Avoid direct anglicism translations that sound forced
- Cultural references: use FR/EU examples alongside US ones
- Speaking rhythm: slightly slower than anglophone YouTube (more deliberate)
- Humor style: irony and understatement > slapstick

## Anti-Patterns (What NOT to Do)

- NO filler phrases ("As we all know", "It's important to note")
- NO linear listicles without pattern interrupts (retention killer)
- NO segments longer than 2 minutes without a re-hook
- NO pure information dump without story framing
- NO AI-monotone writing (vary sentence length, add personality)
- NO fluff intro > 5 seconds before value signal
- Scripts that read as "AI slop" fail: -35% retention at 45 seconds
- NO "you guys" / "everyone" — always singular "you" (one viewer, one conversation)
- NO fact-then-analogy order — always analogy first, fact confirms (see Conversational Voice #3)
- NO ending with summary + "subscribe" — always Open-Loop CTA (see Conversational Voice #7)
- NO passive objections ("Some people argue...") — vocalize them as real interruptions ("But hold on...")
- NO 60+ seconds without a rhetorical question — silence = passive viewer = drop

## Phase 4: Quality Review (Before Delivering Script)

### Structure Checklist
- [ ] Hook delivers value proposition within 15 seconds
- [ ] Visual cue every 5-10 seconds throughout
- [ ] Re-hook or pattern interrupt every 90 seconds
- [ ] Each segment follows Tension-Content-Release-Cliffhanger
- [ ] All open loops are closed by the end
- [ ] Word count matches target duration (+/- 10%)
- [ ] At least one contrarian or surprising insight per segment
- [ ] Francophone cultural adaptation applied
- [ ] CTA placed AFTER final value delivery
- [ ] Script reads naturally out loud (not robotic)

### Game Quest Checklist (only when Game Quest niche is selected)
- [ ] Metaphor Mapping Table completed and validated by Aziz before writing
- [ ] ONE consistent game metaphor throughout (no genre mixing within a video)
- [ ] HUD elements change at least 3 times narratively (not static decoration)
- [ ] At least 1 easter egg embedded in a game element (score, item name, level number)
- [ ] Every major concept in the script has a game mechanic equivalent in the mapping table
- [ ] Game vocabulary feels natural, not forced (the game IS the explanation, not a layer on top)
- [ ] Script still educates/informs: game metaphor enhances understanding, never obscures it
- [ ] Removing the game layer would break the script structure (metaphor is structural, not decorative)

### Research Grounding Checklist
- [ ] Script references specific data/stats from research reports
- [ ] No major claim is based solely on Claude's general knowledge
- [ ] Sources are traceable (can point to which report provided which insight)
- [ ] Contrarian angles from Grok research are considered
- [ ] Academic backing from Gemini research is integrated where relevant
- [ ] Any Aziz-provided materials (NotebookLM notes, personal research) are reflected

## Research Foundation

### Scriptwriting Methodology (permanent reference)
These reports define HOW to write scripts (structure, hooks, pacing):
- `research/02_gemini_scriptwriting_academic.md` - Academic: SNV vs LNV, Cognitive Load, Dual Coding
- `research/03_grok_scriptwriting_trends.md` - Trends: Reddit/X, anti-polish, AI workflows
- `research/04_multistep_scriptwriting_synthesis.md` - Synthesis: 118 sources, frameworks, benchmarks
- `research/01_chatgpt_scriptwriting_frameworks.md` - Frameworks: Problem-Solution, 4-act structure

### Per-Video Topic Research (generated each time)
For each new video, Phases 1-2 generate topic-specific reports in `research/`.
These reports define WHAT to write about (facts, data, examples for that specific subject).
Claude MUST read both methodology AND topic research before writing.
