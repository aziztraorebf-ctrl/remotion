1. **Does it tell the same thing?**

Not fully. Ours reads as “220 volunteers somewhere in highlighted provinces,” but it does **not clearly say this is the 2005 beat**. The target has the year large in the upper-left; ours only has the volunteer count.

**Change:** add the year label **“2005”** in the upper-left, matching the storyboard placement and hierarchy. Use roughly **56–64 px bold white**, x ≈ **35–45 px**, y ≈ **35–50 px** on the 1100×620 frame.

2. **Present in the target, absent in ours**

- **The beacon shafts are too weak / too short.**  
  In the target the yellow markers are not just dots; they are vertical glowing beacons with a visible downward light stem. Ours look closer to small map pins.

  **Change:** for each beacon, make the stem about **55–70 px long**, **2–3 px wide**, fading downward. Increase the glow bloom to about **30–40 px radius** with a hot core around **8–10 px**.

- **The target has a softer “lit area” feel around the selected provinces.**  
  Ours is flatter and more like a choropleth layer. The storyboard’s green regions feel activated/illuminated, not merely filled.

  **Change:** add a subtle soft edge/outer feather to the active province mask, about **6–10 px**, especially along the outside of the green regions. Do not change the base map; just make the active overlay less mechanically flat.

3. **Present in ours that was not intended / weakens the shot**

- **The yellow internal province outlines dominate too much.**  
  They make the shot read as “administrative boundary diagram” before it reads as “spread of volunteers.” The target’s emphasis is the green active zones plus beacons, not the internal linework.

  **Change:** keep the outer boundary of the active group strong, but reduce boundaries between active provinces to **≤1 px** and around **35–45% opacity**, or remove active-active internal outlines where they are not needed.

- **The two northern beacons feel crowded and algorithmic.**  
  They read as duplicate markers in a cluster rather than separate places of activity.

  **Change:** keep seven beacons, but nudge clustered markers so there is at least **65–75 px** between glow centers where geography allows. If positions are fixed to province centroids, reduce those two glow radii slightly so their halos do not merge.

4. **Storyboard mistakes we were right not to reproduce**

Yes: the storyboard beacon count/placement was schematic. Any beacon that appears off-land or any undercount relative to the seven-province 2005 state should not be copied literally. Keeping **seven province beacons** is correct.