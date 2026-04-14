---
name: Beat03 Fleet Kling O3 Review
description: Kimi K2.5 comprehensive review - 6.8/10, NO-GO (requires rework). Fleet→solitary morph shows artifacts, mood fails "terror" beat.
type: project
---

# Beat03 Fleet - Kimi K2.5 Review
**Date**: 2026-03-15
**Clip**: `/public/assets/geoafrique/beat03-o3-fleet-v1.mp4` (13.04s, Kling O3)
**Audio**: "Il fait préparer deux mille pirogues. Un seul bateau revient. Le capitaine est terrifié. Un courant géant. On ne passe pas." (13.2s beat)
**Cost**: $0.0122 (3 frames to Kimi)

---

## Overall Score: 6.8/10 — NO-GO

| Dimension | Score | Status |
|-----------|-------|--------|
| Narrative (fleet→solitary) | 7/10 | Clear but execution risky |
| Style (flat 2D) | 8/10 | Disciplined, some interpolation softness |
| Morphing artifacts | 5.5/10 | BLOCKING: silhouettes degrading, ghost fragments, z-fighting |
| Terror/isolation mood | 4/10 | CRITICAL: too harmonious, missing damage/chaos |
| Integration readiness | 6.5/10 | NOT PRODUCTION-READY |

---

## Key Issues (Priority-ranked)

### 1. MOOD FAILURE — CRITICAL (4/10)
**Problem**: Clip reads "serene night voyage" not "aftermath of 1999 deaths"

| Element | Current | Required | Gap |
|---------|---------|----------|-----|
| Sail | Clean ivory | Torn, waterlogged | -3 dread |
| Hull | Clean, proud | Damaged, listing | -2 dread |
| Water | Calm navy | Chaos, bruised purple | -2 dread |
| Debris | None | Wreckage visible | -3 dread |
| Palette | Harmonious | Sickened (purple/yellow) | -2 dread |
| Pirogue | Stable sailing | Failing, submerged 20% | -2 dread |

**Audio demands**: "Capitaine est terrifié" = FORENSIC EVIDENCE of the 1999 that didn't return.
**Current frame**: Poetic, insufficient.
**Required frame**: Damaged survivor, visual testimony of catastrophe.

**Required fixes**:
1. Regenerate end frame with:
   - Torn sail (jagged upper edge, flapping fragment)
   - Stained hull (waterline darkening, rust streaks)
   - Chaotic water (angular chop, conflicting currents, whitecaps)
   - Sickened palette (bruised purple shadows, sick yellow foam)
2. Post-color-grade entire sequence (15 min)
3. Optional: Submerge pirogue 20% (water lapping gunwales)

**Time**: 1 hour (prefer Kling regenerate end frame + post-color in Remotion)

---

### 2. MORPHING ARTIFACTS — BLOCKING (5.5/10)
**Problem**: Frame-by-frame analysis shows Kling O3 "flocking collapse" weakness

**Specific artifacts detected**:
- **Silhouette degradation**:
  - Foreground boats: readable ✓
  - Mid-ground: edge softening ⚠️
  - Background: dissolving to TEXTURE, not discrete objects ✗
- **Distortion**:
  - Sail stretching (~15% of fleet showing horizontal smearing)
  - Scale-dependent drift (aspect ratio shift on distant boats)
  - Hull elongation on multiple vessels
- **Floating geometry**: 3-4 detached sail fragments in upper-right (frame 003, coordinates 0.7-0.9, 0.25-0.3)
- **Z-fighting**: 2-3 boat pairs showing occlusion flicker (frame 002-004)
- **Moiré pattern**: Wave interference in wake overlaps
- **Popping precursors**: Upper fleet showing compression→texture conversion

**Root cause**: Kling O3 biases multi-object morph toward centroid texture rather than maintaining individual trajectories. Depth-weighting over-aggressive.

**Fixes** (Tier 2):
- Accept artifacts, post-process opacity ramps in Remotion (hide background degradation)
- Ghost fragment removal: manual roto (8 min)
- Re-timing: hold frame 003 (40%) 2-3f longer, ease into 60%
- Layer separation: request depth passes from Kling OR accept 15-20% manual cleanup
- Z-fighting: boost foreground z-offset

**Time**: 1-1.5 hours (post-processing in Remotion/NLE)

---

### 3. STYLE INTERPOLATION SOFTNESS — MEDIUM (8/10)
**Problem**: Kling O3 introduces anti-aliasing bleed during morph

**Details**:
- Sail edges blurring 2-3px into background
- Edges losing crisp definition vs. Frame 1 quality
- Background fleet showing "patterned texture" instead of discrete ships
- Premium 2D contract maintained but BARELY

**Impact**: Minor; acceptable with foreground focus + opacity ramping

---

### 4. NARRATIVE CLARITY — ACCEPTABLE (7/10)
**Positive**: Clear concept (2000→1 = catastrophic loss)
**Risk**: Without intermediate destruction frames, viewers may read as "dispersal" not "death"
**Mitigated by**: Audio anchor ("deux mille pirogues... un seul") — ESSENTIAL for interpretation
**Fix**: Visual damage on end frame = clarifies "death" not "sailing away"

---

## Detailed Artifact Inventory

| Frame | Issue | Severity | Location | Fix Time |
|-------|-------|----------|----------|----------|
| 003 (40%) | Ghost fragments | HIGH | Upper-right | 8 min roto |
| 003 (40%) | Hull elongation | MEDIUM | Mid-left, row 4, cols 2-3 | Accept |
| 003 (40%) | Sail softening | MEDIUM | Upper-middle band, 15% fleet | Accept + opacity ramp |
| 002-004 | Moiré pattern | MEDIUM | Wave wakes | 5 min blur pass |
| All | Silhouette degradation | CRITICAL | Background fleet | Opacity curve (hide) |
| All | Scale inconsistency | MEDIUM | Irregular boat vanish rates | Re-timing hold + ease |

---

## Recommendations

### Path A: FAST TRACK (1 hour) — RECOMMENDED
1. Regenerate END FRAME ONLY with damaged sail + stained hull + chaotic water
2. Post-color-grade (bruised purple, sickly foam) — 15 min in DaVinci/Remotion
3. Accept Tier 2 morphing artifacts, post-process opacity ramps in Remotion
4. Mini-render Beat03 in context (4-5s test)
5. Re-submit for Kimi validation

**Result**: 7.5-8/10 after mood fix

### Path B: QUALITY TRACK (2 hours)
1. Request separate depth layer passes from Kling (if available)
2. Regenerate entire sequence with tighter O3 parameters
3. Manual frame-by-frame roto cleanup (ghost fragments, silhouette integrity)
4. Full color grade + mood pass
5. Re-test + final Kimi validation

**Result**: 8.5-9/10

**Recommendation**: Use Path A. Mood fix alone gets to acceptable range.

---

## Integration Checklist (post-rework)

- [ ] End-frame regenerated (sail damage, hull stain, chaotic water)
- [ ] Color grading applied (purple shadows, sickly foam)
- [ ] Morphing artifacts documented (if accepting cleanup via opacity ramps)
- [ ] Mini-render 4-5s Beat03 test (context validation)
- [ ] Kimi frame-check validation
- [ ] Audio sync verified: 13.2s beat == 13.04s clip ✓
- [ ] Remotion integration: star field + water + pirogues layer-separable

---

## Technical Notes

**Audio Sync**: ✓ 13.04s clip matches 13.2s beat within 0.16s tolerance (acceptable)
**Resolution**: Assumed 1080p/4K native (confirm with Kling output metadata)
**Color space**: Limited palette, broadcast-safe
**Alpha/matte**: No transparency complications (single background layer)
**Layer export**: Currently UNKNOWN — if flattened, loses Remotion overlay flexibility

---

## Cost Summary

| Item | Cost |
|------|------|
| Kimi review (3 frames) | $0.0122 |
| Kling regeneration (end frame) | $0.015-0.03 |
| Post-processing (labor, 1-1.5h) | ~$50-75 |
| **Total** | $0.05-0.06 + 1-2 hours |

---

## Key Learning (Kling O3 Multi-Object Morph)

**Pattern detected**: Kling O3 struggles with coherent multi-object morphing. The "2000→1 pirogues" morph revealed classic interpolation bias:
- Individual trajectories sacrificed for centroid averaging
- Depth-aware weighting over-aggressive
- Background fleet loses definition (texture collapse)
- Ghost fragments emerge at silhouette edges

**Mitigation**: For future fleet/swarm morphs in GeoAfrique:
1. Separate foreground heroes from background chorus (layer-based approach)
2. Use independent opacity curves per depth layer
3. Hold key frames 2-3f longer at transition points
4. Post-process moiré/artifacts in NLE, not in Kling output

---

## Status: NO-GO (pending rework)

**Cannot integrate** without Tier 1 mood fixes. Morphing artifacts (Tier 2) acceptable with post-processing.

**Estimated timeline to approval**: 1-2 hours + Kling regeneration + mini-render test.

**Next action**: Aziz decides — Path A (fast) or Path B (quality)?
