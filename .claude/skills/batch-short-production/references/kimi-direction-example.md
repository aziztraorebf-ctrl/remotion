# Kimi DA Direction — Example: Thiaroye 1944 (2026-04-04)

This is a real example of Phase 4 (Kimi Artistic Direction) applied to a 7-clip
YouTube Short about the Thiaroye massacre (1944). Use as reference for future projects.

## What happened

3 iterations of Kimi K2.5 briefing:
- **V1**: Full review of our 7 original prompts. Kimi scored them 4-7/10, rewrote all 6 (clip 1 was already done). Strong on narrative specificity (kepi as symbol, objects instead of bodies, bureaucratic violence). Weak: missed frame chaining, fell into moral caricature ("officer SPITS on the ground").
- **V2**: Added moral nuance + frame chaining requirements. Kimi respected both, but only covered the first half of the short (clips 2-5 of the pre-massacre). Forgot the entire post-massacre arc (archives, judgment, memorial).
- **V3**: Full re-brief with explicit clip breakdown table + bridge requirements. Kimi delivered all 7 clips with visual bridges between each. Cost: $0.01.

Total cost: ~$0.04 for 3 iterations. Time: ~15 minutes.

## Key learnings for future briefs

### What works
1. **Generator constraints upfront** — Kimi respected every technical limit when explicitly stated
2. **Clip breakdown table** — forces Kimi to cover ALL clips, not reinterpret the structure
3. **Moral guidelines** — "systemic injustice, not individual cruelty" worked perfectly
4. **Frame chaining with bridge examples** — good bridges vs bad bridges examples made the difference
5. **Full script with timestamps** — Kimi needs the complete picture for continuity

### What fails
1. **Vague brief** — "propose a storyboard" = Kimi goes Hollywood. Must be constrained.
2. **No clip breakdown** — Kimi will redivide the script differently (V2 failure)
3. **No moral guidelines** — Kimi defaults to dramatic extremes (spitting, slamming fists)
4. **Frame chaining without examples** — "stable last frame" is not enough. Must explain WHY (ref image for next clip) and give good/bad examples.
5. **"Calendar pages FLIP"** — Kimi repeatedly suggested overlays that generators can't do. Must explicitly list what the generator CANNOT do.

### Kimi's strongest contributions (vs our original prompts)
- **Symbolic objects as thread**: kepi traverses clips 3->5->7 (same object, different meaning)
- **Bridge morphs**: document white -> muzzle flash white (same shape, violent transformation)
- **Chromatic arc**: or lointain (clip 1) -> or proche (clip 7) = visual bookend
- **Nuanced bureaucracy**: "clerk's hands visible only as shadows" > "officer slams fist on desk"
- **Specificity**: "chechia, lamba, scarification marks" > "African soldiers"

## Brief template (extract from V3)

The V3 brief structure that worked:

```
1. PROBLEM WITH PREVIOUS VERSION (if iterating)
2. CENTRAL RULE (the ONE thing that matters most — e.g. frame chaining)
3. GENERATOR CONSTRAINTS (compact, non-negotiable)
4. MORAL/TONAL GUIDELINES (compact)
5. FULL SCRIPT WITH TIMESTAMPS
6. CLIP BREAKDOWN TABLE (timing, title, narration covered)
7. CLIP 1 REFERENCE (if already done — describe last frame for chaining)
8. DELIVERABLE FORMAT (prompt + bridge + last frame per clip)
```

## Files produced

- `scripts/thiaroye-v3-kimi-prompts.md` — Final 7 prompts, ready for Seedance generation
- `tmp/kimi-da-brief-full-v3.txt` — V3 brief (final, complete)
- `tmp/kimi-da-prompts-v3.md` — V3 prompts (complete, with bridges)
- `tmp/kimi-da-clip1-v3.md` — Clip 1 rewrite (2-scene format)
