---
name: Beat05 Moussa Grandeur V1 Review
description: Kling V3 Pro succession scene — character stable, style perfect, camera movement weak (background sliding, insufficient dolly out)
type: project
date: 2026-03-15
---

# Beat05 Moussa Grandeur V1 — Kimi Review

**Video**: `public/assets/geoafrique/beat05-moussa-grandeur-v1.mp4`
**Source**: Kling V3 Pro
**Context**: GeoAfrique Beat05 (Mansa Moussa succession/coronation scene, 5s duration)
**Intended Movement**: Crane Up + Slow Dolly Out

## Kimi K2.5 Analysis

### Score: 7.2/10
**Verdict**: MINOR FIX (usable but compromised)

### Key Findings

#### Movement Quality: Crane Up + Dolly Out
- **Vertical crane**: ✅ Present — perspective rises from eye level to above throne
- **Dolly out**: ⚠️ Weak — Character remains locked at ~55% frame, insufficient recession
- **Background parallax**: ❌ **Sliding effect detected** — Columns/arches float unnaturally relative to throne. Geometric floor pattern shifts wrongly. Reads as vertical pan + background offset, NOT true 3D crane+dolly.

#### Style Preservation
- ✅ Flat 2D vector aesthetic fully maintained
- ✅ No photorealism drift, no texture generation
- ✅ Color palette (burgundy/gold/emerald) consistent with reference
- ✅ Clean lines, no noise

#### Character Stability
- ✅ Face: Zero morphing
- ✅ Crown: Geometric pattern intact
- ✅ Beard: Clean lines maintained
- ✅ Green robe: Embroidery stable, no shimmering
- ✅ Hands: Positionally consistent
- **Character = rock-solid**

#### Narrative Fit
- ⚠️ Rising camera suggests elevation/importance
- ⚠️ Lack of true dolly undermines "reveal throne room scale"
- ⚠️ Feels like slow vertical pan, not majestic crane shot
- ⚠️ Space doesn't expand around subject — grandeur implied but NOT achieved

#### Technical Issues
- ⚠️ Background sliding/parallax artifact
- ⚠️ Floor pattern drift (geometric tiles shift relationship to throne base)
- ✅ No blocking artifacts, no character corruption, no color banding

### Dimension Scores
| Dimension | Score |
|-----------|-------|
| Movement execution | 5/10 |
| Style preservation | 9/10 |
| Character stability | 9/10 |
| Narrative fit | 6/10 |
| Technical cleanliness | 7/10 |

## Action Items

### Primary Issue: Camera Movement Parallax
**Problem**: Kling generated vertical pan with background offset instead of true 3D camera crane+dolly. This is a known Kling limitation — the model treats background elements as 2D layers rather than 3D space.

**Solutions** (priority-ranked):
1. **Re-prompt stronger**: "True camera crane up 3 meters AND dolly back 4 meters. Subject shrinks from 55% to 35% frame. Dramatic perspective shift on palace architecture. No sliding backgrounds — maintain architectural spatial relationship."
2. **Alternative model**: Gen-3 or Runway for this specific camera move if Kling can't resolve parallax
3. **Compositing fix** (if approved for schedule): Accept the character/style, fix parallax in Remotion via CSS transform + dynamic rescaling

### Secondary: Narrative Enhancement
The movement doesn't deliver the "majestic scale reveal" essential to succession beat. Even if camera fixed, consider adding:
- Slow throne room light change (shadows lengthening)
- OR subtle background element reveal (chandelier, tapestry)
- To reinforce "expanded view of power"

## Recommendation for Integration

**APPROVE FOR**: Style reference, character design, color palette
**BLOCK FOR**: Primary video source (movement doesn't deliver intended narrative)

**Next Step**: Re-generate with tighter prompt on camera movement, OR pivot to different approach (static shot with background reveal, parallax-free).

## Cost
$0.0090 (Moonshot native video)

---

## Notes for GeoAfrique Pipeline

**Pattern**: Kling V3 struggles with 3D camera movements that require spatial recession. Works well for:
- ✅ Vertical pans (simple translation)
- ✅ Static shots with animation (character movement, expression changes)
- ✅ Flat 2D style preservation

Struggles with:
- ❌ True crane+dolly (parallax artifacts)
- ❌ Complex 3D perspective shifts
- ❌ Multiple subjects receding at different rates

**Recommend** for Beat05 v2: Either accept simpler camera (vertical pan only) OR use static throne shot + animate subjects/details within Remotion for true spatial control.
