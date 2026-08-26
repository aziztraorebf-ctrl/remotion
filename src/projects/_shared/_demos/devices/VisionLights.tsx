/**
 * VisionLights - studio lighting rig DEDUCED FROM A REFERENCE FRAME, not
 * tuned blind. Source: fiverr-saas/vision-ref/ref_8.0s.jpg (SaaS explainer
 * "Comma", dark studio phone shot). Every light below cites the pixel
 * evidence measured on that frame (values are 0-255 sRGB samples).
 *
 * MEASURED FACTS driving this rig:
 * 1. Background is a FLAT near-black: (16,16,16) sampled at all four
 *    corners and mid-right - no visible gradient or colored halo behind
 *    the phone. Only a faint olive lift (26,27,19) near mid-left, which is
 *    screen/text spill, not a background light. -> VISION_BG = #101010,
 *    and the rig must let unlit chassis faces fall almost to silhouette.
 * 2. TOP CHAMFER carries the only strong chassis highlight: a 1-2px line
 *    peaking at 55 (left, x=620) -> 74 (center, x=760) -> 92 (right,
 *    x=900). Perfectly neutral RGB (equal channels). -> one neutral-white
 *    KEY from high above, offset to the RIGHT and slightly camera-side
 *    (the chamfer faces up-forward).
 * 3. SIDE RAILS are nearly silhouette: 20-45 over a 16 background, both
 *    sides, again neutral grey. No hot rim light on either edge. -> only
 *    two very dim lateral fills, and a LOW ambient floor (unlit areas
 *    measure 13-25, barely under the background value).
 * 4. HARD SPECULAR GLINTS: isolated 1-2px spikes at 181 and 234 exactly
 *    where the volume buttons break the left rail. Small hot points, not
 *    streaks -> the key is a HARD source (directional, no area softening),
 *    shadows crisp.
 * 5. GREEN SPILL from the emissive UI: pixels adjacent to the screen edge
 *    read (225,255,199) and (213,239,191) - the screen light leaks onto
 *    the bezel and rail. The screen itself is content, not rig, but its
 *    spill is reproduced by one weak short-range green-white point light
 *    floating in front of the screen.
 *
 * Rig contract: lights only - no geometry, no camera, no animation.
 * Deterministic (no random, no time).
 */

import React from "react";

/**
 * Background deduced from the reference: flat near-black, neutral.
 * Sampled (16,16,16) at every corner -> #101010. NOT a blue-grey, NOT a
 * gradient: the premium look comes from the flatness of the void around
 * the lit object.
 */
export const VISION_BG = "#101010";

export const VisionLights: React.FC = () => (
  <>
    {/*
      AMBIENT FLOOR - intensity kept very low on purpose.
      Evidence: unlit chassis areas measure 13-25/255, i.e. at or BELOW the
      16/255 background. Any generous ambient would lift the whole rail and
      kill the silhouette-with-one-highlight look of the reference.
    */}
    <ambientLight color="#ffffff" intensity={0.12} />

    {/*
      KEY - hard neutral white, high above, offset RIGHT and slightly in
      front of the object plane.
      Evidence: the top chamfer highlight ramps 55 -> 74 -> 92 from left to
      right (fact 2): the source sits to the +X side. The lit line is on
      the UP-FORWARD facing chamfer only (front faces stay dark), so the
      light comes from high elevation, barely camera-side. Channels are
      equal at every sample -> pure white, no color cast. The isolated
      181/234 button glints (fact 4) confirm a hard small source: a
      directionalLight, not a soft area light.
    */}
    <directionalLight position={[2.5, 7, 2]} color="#ffffff" intensity={2.0} />

    {/*
      LEFT FILL - very dim, neutral.
      Evidence: the left rail shows a faint vertical sheen at 30-49/255
      (fact 3), slightly brighter than the right rail (25-45). Enough to
      separate the rail from the #101010 void by ~15-30 values, no more.
    */}
    <directionalLight
      position={[-5, 1.5, 2.5]}
      color="#ffffff"
      intensity={0.3}
    />

    {/*
      RIGHT BACK RIM - the faintest source in the rig.
      Evidence: on the right rail a secondary thin line at x=983 reads
      32-45 while its surroundings sit at 20-30: a barely-there edge
      separation coming from behind-right. Deliberately weak - the
      reference has NO hot rim (fact 3), and overdoing this is exactly the
      blind-tuning mistake the reference corrects.
    */}
    <directionalLight
      position={[4.5, 2, -3.5]}
      color="#ffffff"
      intensity={0.45}
    />

    {/*
      SCREEN SPILL - short-range warm-green point light floating in front
      of the screen plane.
      Evidence: bezel pixels adjacent to the lit UI read (225,255,199) and
      (213,239,191) - green-tinted leak from the emissive screen (fact 5).
      Color picked from those samples (soft yellow-green, not brand green:
      the spill is UI-white filtered by the green accents). distance-limited
      so it brushes the bezel and rail edges without reaching the back.
      NOTE: if a bright `screen` material is provided on the model, this
      light completes it; with the screen off it still gives the front of
      the device the faint signature tint of the reference.
    */}
    <pointLight
      position={[0, 0.3, 2.2]}
      color="#d6f0be"
      intensity={4}
      distance={4.5}
      decay={2}
    />
  </>
);
