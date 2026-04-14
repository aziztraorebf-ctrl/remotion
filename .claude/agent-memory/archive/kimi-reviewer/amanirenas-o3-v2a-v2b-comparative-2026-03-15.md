# Amanirenas O3 vivid_shapes — V2A vs V2B Comparative Review
**Date**: 2026-03-15
**Baseline**: V1 (5s) = 8.7/10 APPROVED
**Comparison**: V2A (8s) vs V2B (10s)
**Verdict**: REJECT both. Revert V1.

---

## Scores Summary

| Dimension | V2A | V2B | Observation |
|-----------|-----|-----|------------|
| Morphing Visibility | 6/10 | 6/10 | Equal exposure. V2A concentrated (mid), V2B distributed (full) |
| Camera Orbit Fluidity | 7/10 | 5/10 | V2A tighter. V2B stretched/rubber-band effect |
| Army Coherence | 5/10 | 7/10 | V2A dense+cluttered. V2B clean but bottom-heavy |
| Composition Finality | 8/10 | 6/10 | V2A clear power moment. V2B unbalanced |
| **TOTAL** | **7.2/10** | **6.2/10** | V2A superior but still ≤3/10 vs V1 |

---

## Key Findings

### V2A (8s) — Regression from V1 through Exposure
- **Morphing**: 00:02.000–00:05.000 reveals torso compression, arm elongation, dress flattening. Motion blur in V1 masked these artifacts.
- **Orbit velocity**: Uneven (00:00–00:03 smooth, 00:04–00:05.500 acceleration, then deceleration). Algorithmic feel, not cinematic.
- **Army problem**: Perspective popping in foreground rows. Soldiers "slide" laterally instead of rotating 3D. Density fluctuates, creating gaps.
- **End frame strength**: Raised lance + pyramid geometry + upward spear formation = strong power moment (8/10). Only dimension where V2A exceeds baseline.

**Kimi's verdict**: "Extended duration introduces more problems than it solves...revert to V1 or implement frame-interpolation cleanup 00:02–00:05.500."

### V2B (10s) — New Problems, Not Solutions
- **Morphing**: Extended 10s exposes arm/shoulder during lance-raise (00:01.500–00:03.000), face profile smoother but body elongates 00:05.000–00:07.000, dress "breathing" deformations.
- **Orbit fluidity**: **Worst dimension** (5/10). Uneven pacing (fast 0–4s, slow 4–7s, accel end) = "rubber band effect". Extra 2 seconds extend middle "holding pattern" without arc depth. Micro-stutters in background parallax.
- **Army repositioned to bottom**: Solves "crowded background" but creates **compositional imbalance** (bottom-heavy). Reduced soldier legibility. Upper frame empty, lacks counterweight to lance-upward vector.
- **End frame weakness**: Compositionally cleaner than V2A's dense cluster, but feels "accidental rather than intentional" (Kimi). Spatial awkwardness.

**Kimi's verdict**: "10s extension amplifies morphing, reveals pacing inconsistencies...neither approaches V1's sophisticated integration."

---

## Root Cause Analysis

Kling O3 vivid_shapes **cannot reliably interpolate 180° rotation orbits beyond 5–6s without:**
1. Morphing exposure (body deformation across frames)
2. Velocity inconsistency (algorithmic ease-in-ease-out rather than cinematic)
3. Spatial incoherence in subordinate elements (army, background parallax)

**V1's 5s success**: Tighter duration = less interpolation = less exposure. Motion blur conceals morphing. Stately pacing feels intentional.

**V2A's failure**: 3s extension = 60% more frames = 60% more interpolation opportunity = morphing becomes visible.

**V2B's failure**: 10s = "slog" in middle section (00:04–00:07). Model struggles to maintain consistency over extended timeline. Moving soldiers to bottom doesn't fix generation quality; it masks the problem visually but creates new imbalance.

---

## Production Recommendation

**REJECT both. Revert to V1 (8.7/10) OR explore alternative:**

### Option 1: Use V1 as-is (Recommended)
- 5s duration proven solid (8.7/10 all dimensions)
- Timing constraints known and validated
- Army composition, morphing visibility, orbit fluidity all acceptable

### Option 2: Explore Alternative Approach (if extension mandatory)
- **Multi-shot strategy** (Kimi suggestion): Cut at 00:04 (natural breakpoint), reset generative context with new prompt, avoid 00:05–00:08 "morphing zone"
- **Frame interpolation cleanup**: Post-process V2A middle section (expensive, may not be worth effort)
- **Different generative model**: Explore Runway Gen-3 or Luma Photon for comparison

### Option 3: Abandon Extended Duration
- Lesson: 5–6s is Kling O3's comfortable window for complex rotations. Don't force 8–10s.

---

## Pattern Notes (for future sessions)

- **Morphing visibility floor**: ~6/10 on any Kling O3 rotation >120° @ human scale
- **Orbit fluidity**: Uneven when duration stretched >1.5× original. Velocity curves need manual intervention.
- **Army coherence**: Subordinate elements (crowd, background) degrade faster than protagonist during complex camera work. Consider depth-separation or layered generation.
- **Composition hierarchy**: Bottom-heavy army (V2B approach) viable only if counterweighted by upper-frame elements or visual symmetry. Naked "soldiers as border" reads as unfinished.

---

## Saved for Comparative Future Work

If Aziz requests "extend duration of hero rotation", link to this review. Evidence: V2A/V2B failed. V1 remains the benchmark.
