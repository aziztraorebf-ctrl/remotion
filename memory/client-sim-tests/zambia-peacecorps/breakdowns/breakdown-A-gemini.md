Here is the build specification for the combined sequence, designed for programmatic rendering.

**Total Sequence Duration:** 8.0 seconds

### PANEL 1: THE SETUP
1. **TIMECODE:** 0.0s to 1.5s
2. **CAMERA:** Centered on the 3D Earth. Africa occupies approximately 60% of the vertical frame. The camera begins a continuous, accelerating push-in (Z-axis forward movement) toward the southern half of Africa.
3. **WHAT IS ON SCREEN:** 3D globe over a dark background. The continent of Africa is clearly visible. A soft cyan/blue radial glow sits precisely over the geographic coordinates of Zambia. Text overlay at bottom: "AFRICA: 1995". 
4. **THE SINGLE GESTURE:** The camera initiates its descent from space toward the continent.
5. **WHAT MUST NOT APPEAR:** Any country borders, political lines, or labels on the globe.

### PANEL 2: THE DESCENT
1. **TIMECODE:** 1.5s to 3.5s
2. **CAMERA:** Continues its forward Z-axis push, accelerating. By 3.5s, the camera has pushed in so close that the southern half of Africa fills and breaks the edges of the frame. The camera never comes to a full stop. 
3. **WHAT IS ON SCREEN:** The 3D globe surface scaling up rapidly. The cyan glow over Zambia expands as we get closer. The "AFRICA: 1995" text fades out.
4. **THE SINGLE GESTURE:** The viewer dives rapidly from a continental view down to a specific local geography.
5. **WHAT MUST NOT APPEAR:** The flat 2D Zambia map layers—these must not pop in abruptly; see Transition rules below.

### PANEL 3: THE ORIGIN & IGNITION
1. **TIMECODE:** 3.5s to 5.5s
2. **CAMERA:** The rapid Z-axis descent dramatically decelerates (eases out) into a very slow, continuous, imperceptible push-in on the flat Zambia map. The whole country polygon occupies about 80% of the frame.
3. **WHAT IS ON SCREEN:** The flat vector map of Zambia on a dark grey background. All provinces are dark grey outline polygons. 
   - At 3.5s: The **Luapula** province polygon fills with gold/orange. The label "Luapula" and a small cluster of volunteer dots appear. Bottom text appears: "1995: LUAPULA ONLY (40 VOLS)".
   - At 4.5s: The bottom text transitions to a ticking counter: the year rolls from 1995 upward, and the volunteer count interpolates upward from 40.
   - At 4.5s: The Directional Arcs (see rules below) begin shooting out of Luapula.
4. **THE SINGLE GESTURE:** Luapula establishes as the sole hub, and the expansion aggressively fires outward.
5. **WHAT MUST NOT APPEAR:** The provinces of Central, Copperbelt, and Muchinga must remain dark grey baseline polygons. They must never be highlighted, colored, or labelled. 

### PANEL 4: THE FULL EXPANSION
1. **TIMECODE:** 5.5s to 8.0s (End)
2. **CAMERA:** Continues its very slow, continuous creeping push-in. It only stops at the exact frame the sequence ends (8.0s).
3. **WHAT IS ON SCREEN:** 
   - As the arcs land (between 5.5s and 6.5s), the six destination province polygons fill with gold/orange: **North-Western, Eastern, Western, Northern, Southern, Lusaka**. 
   - Text labels and small dot clusters appear in each of those six provinces.
   - By 7.0s, the bottom text resolves to its final state: "2005: 7 PROVINCES, 220 VOLUNTEERS". 
4. **THE SINGLE GESTURE:** The network lands in its destinations, revealing the finalized 2005 footprint.
5. **WHAT MUST NOT APPEAR:** Any connecting lines between the destination provinces. The arcs and lines must only connect Luapula to a destination. 

***

### SEPARATE COMPONENT RULES

**THE TRANSITION (Globe to Map):**
This is a **dissolve driven by camera scale**, spanning from **2.5s to 3.5s**. 
As the 3D camera pushes deeply into the globe, the 3D sphere layer fades out (opacity 100% to 0%) while the flat, 2D orthographic Zambia map fades in (opacity 0% to 100%). The scale/zoom momentum of the 2D map must mathematically match the final velocity of the 3D globe camera so the forward motion feels entirely seamless, even as the dimension flattens.

**THE ARCS:**
- **How many:** Exactly 6 arcs.
- **Order and Timing:** Drawn outward starting at 4.5s. They should be staggered slightly based on distance. Northern and Eastern fire first. Lusaka and Southern fire second. North-Western and Western fire third. All arcs must finish landing by 6.5s.
- **Pathing:** They are parabolic curves. They originate from the exact centroid of the Luapula polygon and terminate at the centroids of the six target polygons. 
- **Appearance:** They draw on with a bright, thick "head" leading the path. 
- **End State:** When the head hits the destination polygon (triggering its color fill), the bright head dissipates, leaving behind a static, thin, low-opacity (e.g., 30%) line connecting Luapula to that province. By 7.0s, you see a permanent, faint "hub and spoke" network overlaying the colored provinces.