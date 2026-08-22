**1. Camera never zooms — the shot stays a continent globe**
- WHAT DIFFERS — After 0s the board punches in until the country fills the frame; the render stays in a circular Africa view for all four beats, so every other detail is unreadable.
- TARGET VALUE — 0.0s: continent, highlighted country ≈ 10–12% of frame width. 2.5s–7.5s: country ≈ 75–85% of frame width, full-bleed rectangle (no circular crop). Hold that framing through 7.5s.
- CURRENT VALUE — Highlighted cluster stays ≈ 15–20% of frame width inside a circular globe on black, all four frames.
- THE FIX — Animate camera: continent @ 0.0s → ease-in-out zoom complete by 2.5s, then lock. Kill the circular mask; frame the country full-bleed.

**2. Volunteer pins are missing**
- WHAT DIFFERS — The board’s whole point after the zoom is large glowing teardrop pins; the render has near-invisible specks (or none).
- TARGET VALUE — 4 pins at 2.5s and 5.0s, 5 pins at 7.5s. Teardrop markers, head ≈ 4% of frame width, fill `#FFD54A`, outer glow `#FFC107` at ~20px / opacity 0.85.
- CURRENT VALUE — Approx 1–2px dots, no teardrop, no glow.
- THE FIX — Drop the 4/4/5 pin set at those times with the size/colour/glow above. Pins come in *after* the zoom lands.

**3. Country fill + gold halo are the wrong material**
- WHAT DIFFERS — Board is a saturated green slab with a thick luminous gold edge (white hairline first, then gold bloom). Render is a flat ochre stain with a 1px brown stroke.
- TARGET VALUE — Fill `#2F8A38` (0.0s can be lighter `#7CB342`). Inner stroke 2.5s: `#FFFFFF`, 1.5–2px. 5.0s–7.5s: outer stroke `#F0C014`, width ≈ 1.5% of frame, glow `#FFD000` opacity 0.9, blur ≈ 18–24px. Internal province lines: `#1F5C26` at 1px.
- CURRENT VALUE — Fill approx `#8A7340`, stroke approx `#6B5A28`, no bloom, no white pass.
- THE FIX — Set highlight fill to `#2F8A38`; add the white stroke at 2.5s; swap to the gold stroke+glow at 5.0s. Draw province lines, not extra countries.

**4. Counter treatment (language, type, colour)**
- WHAT DIFFERS — Board is a large white English lockup; render is a gold numeral + tiny French caption.
- TARGET VALUE — String: `40 Volunteers` / `150 Volunteers` / `220 Volunteers`. Colour `#FFFFFF`. Number height ≈ 7% of frame; “Volunteers” same line, ~45% of number size. Lower-left, same as board.
- CURRENT VALUE — Gold numeral (approx `#E0A020`), caption `VOLONTAIRES` in ~2% caps.
- THE FIX — One white line, English, sizes above. Stop using gold on the number.

**5. Mid-beat counts don’t match the board**
- WHAT DIFFERS — Second and third readouts are not the boarded numbers.
- TARGET VALUE — 0.0s = 40, 2.5s = 40 (count holds through the zoom), 5.0s = 150, 7.5s = 220.
- CURRENT VALUE — 40 / 47 / 140 / 220.
- THE FIX — Key the counter to 40 → 40 → 150 → 220. (If client data truly is 47/140, that is a data override — do not “split the difference.” The boarded beat is: zoom first, *then* the jump to 150.)

**6. Highlight topology is wrong (one country vs a painted region)**
- WHAT DIFFERS — Board is a single country (Zambia) with provinces. Render progressively fills a multi-country East/Southern Africa blotch.
- TARGET VALUE — One country polygon + internal admin lines. Expansion = camera zoom + more pins, not more ISO countries.
- CURRENT VALUE — Approx 6–10 adjacent countries lit by 7.5s.
- THE FIX — Clip the highlight to the single country. Add pins instead of neighbouring fills.

Not a defect: four-beat timing (0 / 2.5 / 5.0 / 7.5) and a growing volunteer number are in place. Base map/terrain/labels are out of scope.

SCORE: 2/10
WHICH SINGLE FIX: Zoom the camera so the country fills ~80% of the frame by 2.5s — without that, pins, green fill, and gold halo cannot match the board.