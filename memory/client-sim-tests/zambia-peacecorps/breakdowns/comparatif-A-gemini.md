Here is the gap analysis between the storyboard and the current render, ranked from most damaging to least.

**1. Camera Scale & Framing (Panels 3 & 4)**
*   **WHAT DIFFERS:** The camera zoom fails to push in on Zambia for the data visualization, leaving the country far too small on screen to read the data.
*   **TARGET VALUE:** Zambia fills approx 85% of the frame height.
*   **CURRENT VALUE:** Zambia fills approx 20% of the frame height.
*   **THE FIX:** Set the camera target to the bounding box of Zambia with a 10% viewport padding margin when transitioning to 3.5s.

**2. Volunteer Data Markers (Panels 3 & 4)**
*   **WHAT DIFFERS:** The visual representation of the volunteers (the clustered dots inside the provinces) is completely absent.
*   **TARGET VALUE:** 100% opacity clusters of white (#FFFFFF) circular markers inside active provinces.
*   **CURRENT VALUE:** 0 markers rendered.
*   **THE FIX:** Render the volunteer data array as a point cluster layer over the active province polygons.

**3. Initial Globe Target Glow (Panels 1 & 2)**
*   **WHAT DIFFERS:** The glowing cyan beacon indicating our target region on the initial globe view is missing.
*   **TARGET VALUE:** Cyan (#00FFFF) radial glow, approx 60% opacity at center, scaling to roughly 15% of the globe's visible diameter.
*   **CURRENT VALUE:** 0% opacity (no glow visible).
*   **THE FIX:** Add a radial gradient billboard or bloom effect anchored to Zambia's coordinates during the 0.0s to 1.5s phase. 

**4. Province Highlight Contrast (Panels 3 & 4)**
*   **WHAT DIFFERS:** The active provinces lack the bright, high-contrast pop intended by the storyboard.
*   **TARGET VALUE:** Active provinces fill #F4C58F (bright sandy orange) with a distinct outer glow; inactive provinces #555555 (dark grey).
*   **CURRENT VALUE:** Active provinces fill approx #8A7855 (muted brown/mustard); inactive provinces blend into the dark blue base map.
*   **THE FIX:** Hardcode the active province polygon fill color to #F4C58F and apply a drop shadow or outer glow to separate it from the base map.

**5. Typography Placement and Styling**
*   **WHAT DIFFERS:** Text is placed in the top-left rather than bottom-center, and is missing the narrative descriptions.
*   **TARGET VALUE:** Text anchored bottom-center (bottom: 10vh), 100% white (#FFFFFF), displaying full narrative strings.
*   **CURRENT VALUE:** Text anchored top-left, dual-colored (Gold approx #E5A855 / White), displaying only year and raw total.
*   **THE FIX:** Move the text container CSS/transform to bottom-center, force text color to #FFFFFF, and inject the full narrative strings (e.g., "1995: LUAPULA ONLY (40 VOLS)").

***

SCORE: 3/10

The single fix that would move this score up the most is animating the camera zoom so that Zambia's bounding box fills 85% of the vertical frame.