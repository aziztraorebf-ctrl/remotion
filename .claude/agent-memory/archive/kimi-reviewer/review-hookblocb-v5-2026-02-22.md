# Kimi K2.5 Review - HookBlocB v5 (4 Frames Analysis)
**Date**: 2026-02-22
**Scene**: Via Pestis Bloc B — 34s animated plague propagation (Kirgisia 1338 → Caffa 1346 → Messina October 1347)
**Frames Analyzed**: 4 keyframes (f0, f220, f450, f800)
**Total Cost**: $0.0193 (Moonshot native image processing)

---

## UNIFIED VERDICT

| Metric | Score | Status |
|--------|-------|--------|
| **Overall Score** | **7.0/10** | MINOR FIXES → 7.8-8.0/10 (estimated post-correction) |
| **Direction Match** | YES | All 3 propagation points (Kirgisia, Caffa, Messina) present + sequenced correctly |
| **Animation Credibility** | 6.8/10 | Ships present, waves scroll, color progression locked BUT physics issues detected |
| **Map Readability** | 6.5/10 | Clear layout, but trebuchet + date labeling create cognitive load |
| **Atmosphere** | 7.5/10 | Color shift day→night effective; parchment contrast challenges in Seg3 |
| **Visual Hierarchy** | 6.5/10 | Ships + map compete; no clear focal priority (CRITICAL for documentary) |

---

## DIRECTION MATCH ASSESSMENT

**Does HookBlocB v5 match the Direction Brief?**

✅ **YES, with reservations on animation integration.**

All three propagation waypoints are present:
- **Seg1 (f0-f220)**: Kirgisia (1338) appears with ships sailing
- **Seg2 (f450)**: Caffa (1346) + trebuchet siege visual
- **Seg3 (f800)**: Messina arrival (October 1347) + Sicilian coast fade-in

The medieval enluminure style (parchment, gold borders, vermillon accents, manuscript aesthetic) is **locked and consistent**.

**However**: The animation improvements from v5 (amplified ship bob ±15px, sail tilt, sky darkening) are described by Kimi as **present but not optimally integrated**—ships float rather than ride waves, sail rotation doesn't couple with hull physics.

---

## FRAME-BY-FRAME ANALYSIS

### Frame 0 (Seg1 Opener, 0s)
**Kimi Assessment**: "Competing focal point issue — ships carry narrative weight (human scale, movement) but map demands cognitive attention."

**Strengths**:
- Clear three-zone vertical composition (sky → ships → map/water)
- Parchment overlay creates strong figure-ground separation
- Color harmony (cerulean ocean, cream parchment, gold studs)

**Issues**:
- Ship bob amplitude (15px = 4% of screen height) risks appearing "floaty" during narration
- Map reading + ship motion simultaneously = visual competition
- Hard edge between map and water (no shadow, no translucency) → reads "pasted" not "suspended"

**Recommendation**: Dampen ship motion to ±8px during map-reading moments (0-5s), or add focus vignette desaturating ocean band when map text appears.

---

### Frame 220 (Seg1 Midpoint, ~9s)
**Kimi Assessment**: "Competent motion-graphics-as-documentary execution. Ship appears as intentionally lo-fi, matching historical aesthetic."

**Strengths**:
- Ship silhouette clear against water (no displacement issues)
- Wave parallax (3 planes) creates effective pseudo-depth
- Map card fully deployed with label hierarchy (location + date)

**Issues**:
- Hard silhouette against waves → no wake, no water interaction
- Flat lighting across frame (no time-of-day progression)
- Risk of "PowerPoint slide" stasis at hold frames
- Date widget (upper left) should *tick/count* rather than static display

**Recommendation**: Add subtle film grain or gate weave (±2px) to unify vector + documentary texture. Activate 1338 date counter to reinforce temporal narrative.

---

### Frame 450 (Seg2 Climax, ~18.75s)
**Kimi Assessment**: "Information hierarchy ambiguous. Trebuchet reads as thin line (risk of misread as coastline artifact), and 1346 label floats between trebuchet + Caffa, creating temporal confusion."

**Critical Issues**:

1. **Trebuchet Readability** (5/10):
   - Silhouette appears as thin black line against beige landmass
   - No human figure or projectile for scale reference
   - Risks register as abstract mark, not siege weapon
   - **Fix**: Add 1-2px highlight on throwing arm, or tiny projectile mid-arc

2. **Label Spatial Conflict** (6/10):
   - 1346 appears in both top-left UI AND on map (redundant)
   - Viewer's eye oscillates: "We're in 1346 now" vs "1346 is destination"
   - Dilutes progression narrative
   - **Fix**: Move date to single anchor point (either UI or map, not both)

3. **Arrow Drawing Clarity** (6.5/10):
   - Path trajectory ambiguous (dashed vs solid?)
   - Unclear if one journey or two separate movements
   - Arrowhead functional but path lacks visual weight

4. **Map-Ocean Integration** (6/10):
   - Hard cut between map bottom + water (no shadow, no occlusion)
   - Suggests overlay-only interaction, not spatial integration
   - **Fix**: Subtle wave animation behind map lower edge, or drop shadow

**Recommendation**: "Editorial clarification needed — is this frame showing *simultaneity* (siege happening as map explains) or *sequence* (map first, then cut to siege)? Current composition straddles both, weakening each."

---

### Frame 800 (Seg3 Climax, ~33.3s, FINAL)
**Kimi Assessment**: "Effective emotional modulation (day → night), but missing narrative consequence. Ship remains unchanged; no marques visuelles of journey."

**Strengths**:
- Inversion chromatique complete (bright day → dark night) = visceral dread
- Red trajectory arrow creates diagonal ascent (Kirgisia → Caffa → Messina) = visual inevitability
- Color palette effectively signals temporal shift

**Critical Gaps**:
1. **Ship Unchanged** (BLOCKING for climax):
   - At 33.3s, galère should show **marques of voyage**:
     - Sail slightly torn (2-3 pixels missing)
     - Hull darker (salissure/salt weathering)
     - Possible orange glow interior (lanterne = life/death duality)
   - Currently reads as "same ship from f0" → audience feels suspended, not concluded

2. **Parchment Contrast in Darkness** (HIGH priority):
   - Map (#D4C5A9) becomes "trou lumineux artificiel" against #1A2456 sky
   - Feels like document held under lamp, not geographical overlay
   - **Fix**: Reduce parchment luminosity to ~85%, add inset shadow (simulate reading by candlelight)

3. **Sicilian Coast Readability** (6.5/10):
   - Green coast (#6B8E4E est.) separates from blue night sky (7/10 contrast)
   - Lacks depth without anchor visual
   - **Fix**: Add subtle drop shadow OR warm fringe (#C9A227, 10% opacity) on coast silhouette

4. **Narrative Closure Missing** (CRITICAL):
   - Red arrow terminates at Messina, but NO visual consequence
   - Labels pulse (optional), city glow (optional), but no **climactic response** from environment
   - **Fix**: Add final symbolic element—either:
     - City dots pulse red once (arrival momentum)
     - Parchment gains reddish tint overlay (contamination symbolism)
     - Ship reaches coast position (visual journey completion)

**Kimi's Final Assessment**: "Frame 800 is the *condensation of 18 months of history in one image*. It deserves that the spectator **hesitate** between looking at the map (the récit) or the ship (the réalité s'impose). Currently, it simply stops."

---

## CROSS-FRAME SYNTHESIS

### Animation Improvements (v5 changes)
**What Kimi observed**:
- ✅ Ship bob amplitude increased (±15px) — present and visible
- ✅ Sail tilt (±3°) — present but not optimally physics-coupled
- ✅ Sky color shift (#2D3A8C → #1A2456) — executed at 40% luminance drop, effective but aggressive
- ⚠️ Wave animation — described as scrolling left-to-right, but **no mention of 3D wave crests** where ships should register displacement

**v5 Achievement**: Amplifications successful. But animations feel **additive** (layers stacked) rather than **integrated** (coherent physics system).

### Recurring Issues Across Frames
1. **Spatial Integration**: Hard boundaries between layers (map/water, coast/sky) — no transitional shadows or occlusion effects
2. **Ship Physics**: Bob + tilt not coupled; ship appears to float rather than ride hydrodynamic surface
3. **Narrative Closure**: Each frame progresses (Kirgisia → Caffa → Messina) but final frame lacks **consequence** — journey arrives but world doesn't respond
4. **Label Density**: Multiple temporal markers (1338 counter, 1346 UI, 1346 map, 1347 final) create redundancy rather than clarity

### What Works (v5 Validation)
- ✅ Medieval enluminure aesthetic locked (parchment, gold borders, vermillon)
- ✅ Color progression day→night viscerally effective
- ✅ Propagation sequence (3 waypoints) clear + sequenced
- ✅ Map readability fundamentally sound (despite label conflicts)
- ✅ Wave parallax creates pseudo-depth effectively

---

## ACTION ITEMS (PRIORITY-RANKED)

### BLOCKING (Prevent delivery without fixes)
- **P1 (CRITICAL)**: **Ship visual state change in Seg3** — Add torn sail + darkened hull + interior glow by f800. Currently ship appears identical to start → audience perceives no journey. Estimated fix: **45 min** (SVG tweaks + animation timing)

### HIGH (Recommended for 8.0 target)
- **P2**: **Trebuchet kinetic activation** — Add highlight on throwing arm OR projectile mid-arc. Currently misread as coastline artifact. Estimated fix: **20 min**
- **P3**: **Map-ocean spatial integration** — Add subtle drop shadow under map OR wave occlusion. Currently hard-cut feels "pasted". Estimated fix: **30 min**
- **P4**: **Parchment nighttime contrast** — Reduce luminosity to ~85% in Seg3, add inset shadow. Estimated fix: **15 min**
- **P5**: **Narrative climax visual** — Add final symbolic response (city pulse, parchment tint, or ship arrival position). Estimated fix: **30 min**

### MEDIUM (Quality polish)
- **P6**: **Label redundancy cleanup** — Move 1346 to single location (UI OR map, not both). Estimated fix: **20 min**
- **P7**: **Date counter activation** — Animate 1338/1346/1347 dates as they appear (ticking effect). Estimated fix: **25 min**
- **P8**: **Wave-ship harmonic check** — Verify wave scroll speed doesn't create stroboscopy with ship bob cycle. Estimated fix: **15 min** (analysis) + tweak if needed

### OPTIONAL (v5.1 polish)
- **P9**: **Gold rim light on Messina arrow** (Seg3 only) — Sacred geography becoming infected. Estimated fix: **20 min**
- **P10**: **Subtle film grain** across frames — Unify vector + documentary aesthetic. Estimated fix: **15 min**

**Total for 8.0 target (P1-P5)**: **~2.5 hours**
**Total for 8.1 target (P1-P8)**: **~3.5 hours**

---

## RECOMMENDATION FOR CREATIVE DIRECTOR

### VERDICT: **MINOR FIXES → APPROVE** (conditional on P1)

**Reasoning**:
- v5 successfully amplified animation elements (ship bob, sail tilt, color progression)
- Medieval aesthetic locked and consistent
- Direction brief matched (3 propagation points present and sequenced)
- **BUT**: Ship remains unchanged at climax (f800) → blocks emotional closure
- **AND**: Map-water spatial integration weak → feels "layered" not "integrated"

### Conditional Path Forward:
1. **IF P1 (ship state change) completed** → Scene reaches 7.8-8.0/10 (acceptable)
2. **IF P1 + P2-P5 completed** → Scene reaches 8.0-8.1/10 (strong documentary quality)
3. **IF P1 incomplete** → Hold delivery; scene lacks narrative resolution

### Mini-Render Gate:
Before final render, mini-test (--frames=780-810, 1 second) with:
- Ship visuals (torn sail, hull darkening, interior glow)
- Parchment nighttime contrast
- Final symbolic response (city pulse OR ship arrival position)

This validates climactic closure without full render cycle.

---

## TECHNICAL NOTES

### Color Progression Formula (Validated)
```
Seg1 Sky:     #2D3A8C (luminance 34%)
Seg2 Sky:     ~#243474 (luminance 28%)
Seg3 Sky:     #1A2456 (luminance 14%)
Luminance drop: 40% over 34s = effective emotional modulation
```

### Ship Animation Physics (Recommendation)
```javascript
// Current (v5): Independent bob + tilt
ship_y = initial_y + bob_amplitude * sin(t * bob_frequency)
sail_angle = max_angle * sin(t * sail_frequency)

// Recommended (v5.1): Physics-coupled
hull_y = initial_y + bob_amplitude * sin(t * bob_frequency)
sail_angle = hull_y * 0.2  // degrees per pixel — couples hull rise to heel
```

### Label Redundancy Analysis
- **Current**: 1338 (UI counter) + 1346 (UI + map) + 1347 (UI) = 3 parallel temporal markers
- **Recommended**: Collapse to 2 layers:
  - UI layer: Counter (progresses 1338 → 1346 → 1347)
  - Map layer: Destination labels (Kirgisia, Caffa, Messina) with single date each
  - Remove dual 1346 (choose UI OR map as anchor)

---

## COST SUMMARY
| Frame | Tokens In | Tokens Out | Cost |
|-------|-----------|------------|------|
| f0 | 3031 | 1599 | $0.0066 |
| f220 | 2769 | 631 | $0.0036 |
| f450 | 2815 | 902 | $0.0044 |
| f800 | 2843 | 993 | $0.0047 |
| **TOTAL** | **11458** | **4125** | **$0.0193** |

---

## KIMI'S FINAL COMMENT
> "The scene succeeds as **informational theater**—the plague's inexorable spread made visceral through environmental darkening. The primary risk is **cognitive overload** in Seg2 (siege mechanics, map reading, ship motion compete). Consider **audio cueing** (narration pause, sound design shift) to guide attention, or accept that documentary viewers will re-watch—your animation supports this through loop-friendly wave cycles and clear segment boundaries."

> "Frame 800 is the **condensation of 18 months of history in one image**. It deserves that the spectator **hesitate** between looking at the map (the récit) or the ship (the réalité s'impose). Currently, it simply stops."

---

## SUMMARY TABLE

| Aspect | v2 (Prev) | v5 (Current) | Delta | Status |
|--------|-----------|------------|-------|--------|
| Overall Score | 7.5/10 | 7.0/10 | -0.5 | Regression (animation not yet optimized) |
| Ship Animation | Static | ±15px bob + ±3° tilt | +Animation | Visible but physics-uncoupled |
| Color Progression | Partial | Full day→night (#2D3A8C → #1A2456) | +Vivid | Effective but aggressive |
| Trebuchet | Present | Present, unclear | No change | Needs kinetic activation |
| Map Readability | 8/10 | 6.5/10 | -1.5 | Label redundancy introduced |
| Narrative Closure | Weak | Weak | No change | Ship unchanged at climax (BLOCKING) |
| Medieval Aesthetic | Strong | Strong | Maintained | Locked |
| Direction Match | YES | YES | ✓ | All 3 waypoints present |

**Interpretation**: v5 added animations successfully but created new problems (label redundancy, physics coupling, climactic closure). **Not a regression, but optimization incomplete.** P1 (ship state change) essential before delivery.

