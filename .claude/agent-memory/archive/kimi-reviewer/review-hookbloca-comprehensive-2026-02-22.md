# Kimi K2.5 Review - Bloc A Comprehensive Analysis (2026-02-22)

**Reviewed frames**: f0, f220, f360 (6-second sequence)
**Model**: kimi-k2.5 via Moonshot API
**Total tokens**: 9249 in + 4924 out = $0.0204
**Previous score**: 5.1/10
**Target score**: 8/10
**Recommended post-correction score**: 7.5/10

---

## EXECUTIVE SUMMARY

### Current State
- **Strengths**: Visual direction consistent, architecture coherent, perspective mathematically stable
- **Critical weaknesses**: Characters illegible (8-12px silhouettes), labels non-functional (no arrows), cart narrative dead, final frame lacks closure
- **Regression from f0 to f360**: Emotional arc incomplete; spectator left suspended rather than satisfied

### The One-Pass Correction Strategy
Kimi identified **3 critical technical fixes** that unlock 7.5+/10:
1. **Character scale** → 14×20px + distinctive accessory per archetype (bâton, capuche, lance)
2. **Label system** → flèche SVG + proper offset (-28px) + serif 11px font
3. **Cart narrative** → lateral entry (not top), roue animation, oxen model visible

---

## DETAILED TECHNICAL BRIEF (FROM KIMI)

### 1. PERSONNAGES TOP-DOWN

**Current state**: rx=4, ry=6 (8×12px) — renders as indistinguishable blobs

**SVG targets**:
```
Paysan:   rx=7, ry=10 (14×20px) + bâton: line x2="-12" y2="-15" stroke-width="2"
Moine:    rx=7, ry=10 + capuche: arc path d="M-7,-8 Q0,-18 7,-8" stroke-width="2"
Soldat:   rx=8, ry=11 (+15% mass) + lance: line x2="10" y2="-20" stroke-width="2.5"
```

**Directionality method**: Ombre portée (shadow ellipse rx=6, ry=3, opacity="0.15") offset +4px in direction of movement
- Alternative: Traînée de pas (2-3 ellipses, opacity 0.3→0, spaced 8px apart)

---

### 2. LABELS FLOTTANTS (THE MISSING PIECE)

**Current state**: Labels exist but **flèche is completely absent** — critical UX failure

**Required specification**:
| Parameter | Value |
|-----------|-------|
| Position | translate(0, -28) above head (not body) |
| Font | serif, 11px, 600 weight, letter-spacing 0.3px |
| Background | fill="#F5E6C8", opacity: 0.95, rx: 4, stroke: #1A1008, stroke-width: 0.8 |
| Padding | ±6px horiz, ±3px vert |
| **Arrow** | path d="M-4,4 L0,10 L4,4" fill="#1A1008" (REQUIRED) |
| Animation | opacity: 0→1 + translateY: -20→-28, duration: 12 frames (0.2s @ 60fps) |

---

### 3. CHARRETTE — CRITICAL NARRATIVE REVISION

**Current problem**: Enters from top (impossible in true top-down); form incomprehensible; no human interaction

**Kimi's solution**:

| Aspect | Fix |
|--------|-----|
| **Trajectory** | Lateral entry (left edge) → horizontal traverse |
| **Timing** | Frame 45–180 (2.25s presence) |
| **Speed** | 180px/sec (slow, legible) |
| **Wheels** | Animated rotation: θ = frame × 4° |

**SVG design** (recognizable in <3s):
```svg
<g transform="rotate(-5)">
  <!-- Caisse -->
  <rect x="-25" y="-15" width="50" height="30" rx="2" fill="none" stroke="#1A1008" stroke-width="2"/>
  <!-- Barres renfort -->
  <line x1="-25" y1="-5" x2="25" y2="-5" stroke="#1A1008" stroke-width="1"/>
  <line x1="-25" y1="5" x2="25" y2="5" stroke="#1A1008" stroke-width="1"/>
  <!-- Roues (top-down = ellipses) -->
  <ellipse cx="-18" cy="15" rx="8" ry="12" fill="none" stroke="#1A1008" stroke-width="2"/>
  <ellipse cx="18" cy="15" rx="8" ry="12" fill="none" stroke="#1A1008" stroke-width="2"/>
  <!-- Rayons -->
  <line x1="-18" y1="3" x2="-18" y2="27" stroke="#1A1008" stroke-width="1"/>
  <line x1="18" y1="3" x2="18" y2="27" stroke="#1A1008" stroke-width="1"/>
  <!-- Oxen leader (silhouette) -->
  <ellipse cx="-45" cy="8" rx="12" ry="7" fill="#1A1008"/>
  <circle cx="-58" cy="5" r="5" fill="#1A1008"/>
  <!-- Harness -->
  <line x1="-33" y1="8" x2="-25" y2="0" stroke="#1A1008" stroke-width="1.5"/>
</g>
```

---

### 4. PLACE CENTRALE — VISUAL ENRICHMENT

| Element | Implementation |
|---------|----------------|
| **Pavés** | Grid 8×6 ellipses: rx=12, ry=6, fill="none", stroke="#1A1008", opacity="0.15", stroke-width="0.5" |
| **Fountain** | Center circle r=18, stroke-width="2.5" + 3 water pulses (scale 1→1.5→1, 30 frames each) |
| **Building shadows** | Ellipses (rx=40%, ry=20% of building size), fill="#1A1008", opacity="0.08", offset +10px SE |

---

### 5. TACHE D'ENCRE (CREATIVE SIGNATURE ELEMENT)

**Technical implementation** (Remotion TSX):
```tsx
const inkBlob = useCurrentFrame();
const expansion = interpolate(inkBlob, [0, 30], [0, 1], {
  easing: Easing.outExpo
});
const breath = interpolate(inkBlob, [30, 300], [0, 1], {
  extrapolateLeft: "clamp"
});

<g opacity={0.12 * expansion} transform={`scale(${0.8 + 0.02 * Math.sin(breath * Math.PI * 4)})`}>
  <ellipse cx="0" cy="0" rx="120" ry="80" fill="#1A1008"/>
  <ellipse cx="40" cy="-30" rx="90" ry="60" fill="#1A1008"/>
  <ellipse cx="-30" cy="40" rx="70" ry="50" fill="#1A1008"/>
  <ellipse cx="20" cy="20" rx="50" ry="40" fill="#1A1008"/>
</g>
```

| Parameter | Value |
|-----------|-------|
| Position | Bottom-right corner: translate(1680, 900) |
| Final size | ~280×200px |
| Color | #1A1008 (same ink) |
| Opacity | 0.10–0.15 (doesn't mask village) |
| Z-index | Behind interactive elements, above parchment |
| Duration | Frame 0–30 (entrance), 31–300 (breathing), 301–330 (exit) |

**Narrative role**: Visual "cache" for off-screen elements + aging texture.

---

### 6. BUILDING DIFFERENTIATION

Each structure needs **unique visual signature** (one detail rule):

| Building | Identifier |
|----------|-----------|
| Église | Pointed roof (triangle path) + cross (+8px height) |
| Tour | Crenellations (5 rectangles, height +6px) |
| Auberge | Hanging sign (rect 12×8) with chalice/cross |
| Maisons | Roof variety: 30% flat, 50% single-pitch, 20% mansard |
| Puits | Concentric circles + working crank (line + wheel) |

---

## FRAME-BY-FRAME DIAGNOSTIC

### Frame 0
- **Problem**: Character cluster indistinguishable from smudge
- **Finding**: Dispersion visible but no hierarchy; labels functional
- **Recommendation**: Scale characters up immediately (easiest win)

### Frame 220
- **Problem**: Cart "dead narrative" — present but inactive
- **Finding**: Shadow directions incoherent (some north, some SE); reveals lighting bug
- **Recommendation**:
  - Unify light source (all shadows point SE per architecture)
  - Activate cart with a meneur de bœufs (human figure pulling)
  - OR advance cart entry to frame 240 (currently too early)

### Frame 360
- **Problem**: No emotional closure; reads as "incomplete"
- **Finding**: Spectator emotion: suspended, not satisfied
- **Recommendation**:
  - Add convergence (characters ± cart → church) for final tableau
  - Link AGNES label to final action (mounting cart?)
  - Add audio cue (church bell) to resolve ambiguity sonically

---

## VALIDATION CHECKLIST (POST-CORRECTION)

- [ ] All characters ≥14×20px with distinctive accessory (bâton, capuche, lance)
- [ ] Labels with flèche visible, positioned at -28px, serif font 11px
- [ ] Cart lateral entry, wheels animated (rotation × 4°/frame)
- [ ] Cart has visible oxen leader (double silhouette)
- [ ] Fountain pulse implemented (3 ellipses, 30-frame cycle)
- [ ] Building shadows cast SE (unified light source)
- [ ] Building differentiation complete (5 unique signatures)
- [ ] Ink blob animation frames 0–30 (expansion), 30–300 (breathing)

**If 100% checklist validated: 8/10 score guaranteed per Kimi.**

---

## ESTIMATED TRAJECTORY

| Version | Score | Key change |
|---------|-------|-----------|
| Current (v2) | 5.1/10 | Baseline: legibility failure |
| After character scale | 6.2/10 | +1.1 (silhouettes readable) |
| After labels + arrows | 7.0/10 | +0.8 (functional UX) |
| After cart fix + shadows | 7.5/10 | +0.5 (narrative activation) |
| After full brief | 7.8/10 | +0.3 (building details, ink blob, fountain) |

**Target: 8.0/10 achievable if all corrections applied in single pass.**

---

## RECOMMENDATIONS FOR CREATIVE-DIRECTOR

### Priority 1 (Blocking issues)
1. Character scale: rx=7, ry=10 minimum (currently 4, 6)
2. Label arrows: SVG path d="M-4,4 L0,10 L4,4" (currently missing)
3. Cart entry: Lateral, not top (currently incomprehensible)

### Priority 2 (Narrative coherence)
1. Unified light source: All shadows point SE (currently inconsistent)
2. Cart interaction: Add meneur de bœufs or animate cart entry dynamically
3. Final frame closure: Convergence toward church or cart

### Priority 3 (Polish)
1. Ink blob breathing animation (subtle, doesn't distract)
2. Fountain pulse (atmospheric enrichment)
3. Building signature details (5 unique identifiers)

---

## NEXT STEPS

1. **Claude codes corrections** based on exact SVG specs above
2. **Mini-render** frame 0, 220, 360 to validate scale + labels + cart
3. **Send corrected frames back to Kimi** for confirmation (estimated 7.5+)
4. **Full render** once Kimi validates
5. **Creative-director preflight** before final commit

---

**Kimi K2.5 Analysis — Complete**
**Date**: 2026-02-22
**Confidence Level**: High (3 frames analyzed, technical specs explicit)
