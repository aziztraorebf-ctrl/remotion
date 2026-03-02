# Kimi K2.5 Review — Veilleur v5 (2026-02-24)

**Score**: 6.5/10 (MINOR FIXES → 7.8-8.0/10)
**Verdict**: MINOR FIXES required — Energy restored but narrative pacing still tight
**Status**: DO NOT APPROVE — Timing + arc fluidity need rework before delivery

---

## SCENE BREAKDOWN

### S1 (f0-150): Village nocturne, lune croissant
**Kimi evaluation**: ✓ Tone-setting successful. Silhouette immobile establishes solitude convincingly.

### S2 (f150-510): Sage lève le bras, fenêtres s'allument
**Kimi evaluation**: ✓ Visual causality clear. But orphan-sound risk: what triggers window glow? Wind? Magic? Need distinct SFX.

### S3a (f510-650): Bird enters LEFT, rainbow flash traverse FULL SCREEN
**Kimi evaluation**: 6/10 — Rainbow flashes land visually, BUT:
- **Issue 1**: Constant linear speed. Each building gets ~20 frames flash visibility. Perceptible but not satisfying.
- **Fix**: Ease-out micro-decel on each building → 5-10 frames extra per color.
- **Result**: Same traversal speed, but flash "lands" psychologically.

### S3b (f650-785): Bird turns RIGHT, returns toward center, descends to Sage's roof
**Kimi evaluation**: 5/10 — ABRUPT AND MECHANICAL
- **Issue 2**: Reversal unmotivated. Bird path: right → stop → left → climb → drop. Arc missing natural grace.
- **Issue 3**: No landing anticipation. Bird doesn't slow down, doesn't extend wings, doesn't "settle" on roof.
- **Issue 4**: Bird leaves frame at f670 (soft cull or exit-frame?), narrative discontinuity.

**Fixes required**:
1. Frame 650: Start ease-in (bird slows)
2. Frame 660-670: Wide arc turn (not V-shape) with natural altitude loss
3. Frame 700-785: Spiral descent pattern (not straight line). Add wing-settle animation pre-landing.
4. Keep bird in-frame or use soft fade-to-luminosity (not hard exit).

### S3→S4 (f785-811): Landing pause before Sage response
**Kimi evaluation**: 5/10 — TOO SHORT (26 frames ≈ 0.87 sec)
- **Issue 5**: No "breathing room". Bird lands, Sage responds *immediately*. No emotional beat.
- **Missing**:
  - Bird settling/fluffing (10f)
  - Sage lifting head (10f)
  - Pause/acknowledgement (10f)
  - Then arm raise (10f)

**Fix**: Extend to 40-50 frames minimum. Give each action a frame budget.

### S4 (f840+): Bird perched, Sage responds, moon→fire, halo, fade
**Kimi evaluation**: 8/10 — Climax transformation visually strong. Music ducking effectiveness TBD (no audio waveform analyzed, but structure suggests it should work).

---

## MANDATORY CRITERIA CHECKS

### 1. Cohérence audio/visuel
**Status**: PARTIAL — Orphan sounds detected
- Window glow (S2) lacks audio trigger. Need:
  - Wind sound + visual wind? OR
  - Magic sparkle sound + glow SFX?
- Bird should emit distinct sound during traverse (bell? wing flutter? whisper?).

### 2. Débordements/coupures
**Status**: ISSUE — Frame exit at f670
- Bird leaves screen at right edge (f670) then returns. This is a narrative cull.
- **Options**:
  - Option A: Keep bird in-frame entire time (widen canvas or curve the arc).
  - Option B: Soft exit via luminosity wash (bird fades into moonlight) — more elegant.
  - Option C: Tighter arc that doesn't reach edge — less energetic but contained.

### 3. Redondances
**Status**: CLEAR — No text, no duplication. Data overlay (rainbow contours) functional, not redundant.

### 4. Lisibilité narrative
**Status**: FUNCTIONAL but INCOMPLETE
- First-time viewer understands: solitude → bird arrives → connection → transformation.
- **But**: Bird's motivation unclear. Why this roof? Why now? Suggestion: seed visual in S1 (lointain bird? shooting star?) to foreshadow S3.

---

## KIMI'S DETAILED SCORING

| Aspect | Score | Comment |
|--------|-------|---------|
| Direction artistique (palette, mood) | 8/10 | Cohérent, maîtrisé |
| Animation bird S3 phase 1 (traverse) | 6/10 | Énergique but linéaire. Flashes OK but predictable. |
| Animation bird S3 phase 2 (turn + descent) | 5/10 | Mécanique. Manque grâce, anticipation, settlement. |
| Timing narratif (pacing, beats) | 5/10 | Trop serré. Landing→response 26f insuff. |
| Audio-visual sync | 7/10 | Structure sound, mais SFX orphelins. Ducking TBD. |
| Climax visual (moon→fire + halo) | 8/10 | Strong. Technique OK. |
| **OVERALL** | **6.5/10** | Energy there, but execution incomplete. |

---

## ACTION ITEMS (PRIORITY-RANKED)

### BLOCKING (script decision first)
- [ ] **P0 (Decision)**: Keep bird in-frame entire S3 OR allow frame exit with soft fade? Recommend: IN-FRAME arc (wider, more graceful). If exit: use luminosity wash (narrative continuity).

### P1 — Narrative Pacing (30 min)
- [ ] Extend landing→response pause: f785-811 → f785-835 (50 frames). Sequence:
  - f785-795: Bird settles, feathers fluff
  - f795-805: Sage lifts head (anticipation)
  - f805-825: Pause/acknowledgement beat
  - f825-835: Sage arm raise begins
- **Result**: 8.5/10 timing flow

### P2 — Bird Arc Fluidity (45 min)
- [ ] S3b animation redesign:
  - f650: Ease-in deceleration start (bird's speed multiplier 1.0 → 0.7)
  - f660-680: Wide arc turn (Bézier curve, not V). Add subtle altitude loss.
  - f700-785: Spiral descent (rotateZ animation ~15-20° inward, scale slight decrease, Y translation smooth).
  - Pre-landing (f770-785): Wing settle + body tilt angle (lean into roof).
- **Result**: 7.5/10 fluidity (from 5/10 mechanical)

### P3 — Rainbow Flash Perception (20 min)
- [ ] S3a easing: Add frame-budget ease-out per building:
  - Each building: flash enters at 100%, holds 5f, ease-out over 15f (not linear fade).
  - Effect: Slower *perceptual* travel despite same path duration.
- **Result**: 7/10 visual satisfaction (from 6/10)

### P4 — Frame Exit / Narrative Continuity (15 min, depends on P0)
- [ ] If keeping bird in-frame: widen arc radius to prevent edge clip.
- [ ] If allowing exit: replace hard cut with fade-to-luminosity (moon glow wash).
- **Result**: Clean narrative flow.

### P5 — Audio Orphan SFX (10 min, Aziz decision)
- [ ] Define S2 window glow trigger: wind sound OR magic sound?
- [ ] Add bird SFX during S3 traverse: bell chime OR wing flutter OR shimmer (pick 1).
- [ ] Verify S4 music ducking works under Sage response.

### POLISH (optional, can defer)
- [ ] P6: Add lointain bird tease in S1 (tiny silhouette + sparkle) to foreshadow S3. (15 min)
- [ ] P7: Sage anticipation micro-expression before arm raise. (10 min)

---

## KIMI'S KEY INSIGHTS

1. **Rainbow energy IS there** — but physics unrealistic (no decel, no "landing" moment on each roof). Ease-out + settle = satisfaction.

2. **Bird return is the weak link** — no narrative arc, just reversal. Arc should have *grace* (wide, spiraling) not mechanics (V-shape, linear drop).

3. **Timing gap** — 26 frames between landing and response *feels* like a cut, not a beat. 50 frames allows audience to *feel* the connection before Sage speaks.

4. **Audio infrastructure** — Orphan sounds kill immersion. Each visual event (window glow, bird arrive, landing, lune→feu) needs audio anchor.

5. **Motivation question** — Why does bird choose *this* sage? Why *this* moment? Visual foreshadow in S1 would make S3 feel inevitable, not coincidental.

---

## RECOMMENDATION

**DO NOT APPROVE for delivery.** Current state: 6.5/10. Post-P1+P2+P3 estimated: 8.2/10 APPROVABLE.

Aziz decision needed on P0 (bird frame exit). Once decided, P1-P3 are straightforward code + timing tweaks (~1.5 hours total). P4-P5 depend on Aziz's audio direction.

**Next step**: Present P0 decision to Aziz → implement P1+P2+P3 → mini-render ~10s (f500-810) → re-validate Kimi (should hit 8+/10) → APPROVE & EXPORT.

---

## COST
Moonshot native video: **$0.0297** (42.2k tokens in + 1.45k out)

---

## PATTERN LEARNING
- **Silhouette animation often feels mechanical without micro-eases** — even linear paths need ease-in/ease-out boundaries to feel natural.
- **Landing moments are emotional beats, not just position changes** — they need settle animation + audience anticipation time.
- **Frame exits break narrative continuity** — prefer in-frame arcs or soft fades, not hard cuts.
- **"First-time viewer" rule still applies** — foreshadow the bird in S1 so S3 feels earned, not random.
