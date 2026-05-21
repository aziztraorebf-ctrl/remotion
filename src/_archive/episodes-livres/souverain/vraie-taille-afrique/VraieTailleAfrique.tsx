/**
 * VraieTailleAfrique — composition principale
 * 68s = 2040f @ 30fps, 1080x1920 (refonte audio 2026-05-12)
 *
 * Beats :
 *   Beat1 (f0-f149)    : Mapbox CartoCaspian — rendu via render-mapbox.sh (composition separee)
 *   Beat2 (f150-f749)  : Silhouettes pays glissant dans l'Afrique
 *   Beat3 (f750-f989)  : Chiffre "30,3 M km2" compteur
 *   Beat4 (f990-f1739) : Groenland qui n'entre pas + explication Mercator
 *   Beat5 (f1740-f2100): Afrique plein cadre, souffle vital, punchline (elargi 9s->12s)
 *
 * Note : Beat1Mercator est enregistre comme composition independante
 * car il necessite Mapbox et le script render-mapbox.sh.
 * Cette composition couvre les Beats 2 a 5 uniquement.
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { AUDIO_SEGMENTS, BEATS, BEAT2B_START_FRAME, BEAT2B_DURATION_FRAMES } from "./timing";
import { Beat2Silhouettes } from "./Beat2Silhouettes";
import { Beat3Chiffre } from "./Beat3Chiffre";
import { Beat4Mercator } from "./Beat4Mercator";
import { Beat5Final } from "./Beat5Final";
import { SubtitlesVraieTaille } from "./SubtitlesVraieTaille";

// Durees en secondes pour les sous-titres (temps local Beats2to5, Beat2 = t=0)
const BEAT2_END_S  = BEATS.beat2.durationInFrames / 30;                          // 20s
const BEAT3_END_S  = (BEATS.beat3.from - BEATS.beat2.from + BEATS.beat3.durationInFrames) / 30; // 28s
const BEAT4_END_S  = (BEATS.beat4.from - BEATS.beat2.from + BEATS.beat4.durationInFrames) / 30; // 53s

// ---------------------------------------------------------------------------
// Composition complete Beats 2-5 (standalone, sans Beat1 Mapbox)
// ---------------------------------------------------------------------------

export const VraieTailleAfriqueBeats2to5: React.FC = () => {
  // Fenetre : f150 a f1950 = 1800f
  // En standalone, on rebase a 0 => les beats ont leurs frames propres
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Audio musique (commence depuis le debut de ce segment) */}
      <Audio
        src={staticFile("souverain/vraie-taille-afrique/audio/music-A-revelation.mp3")}
        startFrom={BEATS.beat2.from} // commence a f150 dans la piste musique
        volume={(f) => {
          const beat5Local = BEATS.beat5.from - BEATS.beat2.from; // 1633
          // Fade-in sur 60f puis 0.15, puis monte a 0.35 pour Beat5
          const base = f < 60 ? 0.15 * (f / 60) : 0.15;
          if (f >= beat5Local) {
            const t = Math.min(1, (f - beat5Local) / 60);
            return base + (0.35 - 0.15) * t;
          }
          return base;
        }}
      />

      {/* VO Beat 2 */}
      <Audio
        src={staticFile(AUDIO_SEGMENTS.beat2.file)}
        startFrom={0}
        endAt={AUDIO_SEGMENTS.beat2.durationFrames}
      />

      {/* VO Beat 2b — pause 1.5s apres "contient tous" puis "Un continent. Vingt pour cent..." */}
      <Sequence from={BEAT2B_START_FRAME - BEATS.beat2.from} durationInFrames={BEAT2B_DURATION_FRAMES}>
        <Audio
          src={staticFile("souverain/vraie-taille-afrique/audio/narration-beat2b.mp3")}
          startFrom={0}
          endAt={156}
        />
      </Sequence>

      {/* Beat 2 — Silhouettes (etendu jusqu'au debut Beat3 pour eviter le gap noir) */}
      <Sequence
        from={0}
        durationInFrames={BEATS.beat3.from - BEATS.beat2.from}
        premountFor={30}
      >
        <Beat2Silhouettes />
      </Sequence>

      {/* VO Beat 3 — relatif a ce segment */}
      <Sequence from={BEATS.beat3.from - BEATS.beat2.from} durationInFrames={AUDIO_SEGMENTS.beat3.durationFrames}>
        <Audio
          src={staticFile(AUDIO_SEGMENTS.beat3.file)}
          startFrom={0}
          endAt={AUDIO_SEGMENTS.beat3.durationFrames}
        />
      </Sequence>

      {/* Beat 3 — Chiffre */}
      <Sequence
        from={BEATS.beat3.from - BEATS.beat2.from}
        durationInFrames={BEATS.beat3.durationInFrames}
        premountFor={30}
      >
        <Beat3Chiffre />
      </Sequence>

      {/* VO Beat 4 */}
      <Sequence from={BEATS.beat4.from - BEATS.beat2.from} durationInFrames={AUDIO_SEGMENTS.beat4.durationFrames}>
        <Audio
          src={staticFile(AUDIO_SEGMENTS.beat4.file)}
          startFrom={0}
          endAt={AUDIO_SEGMENTS.beat4.durationFrames}
        />
      </Sequence>

      {/* Beat 4 — Mercator / Groenland */}
      <Sequence
        from={BEATS.beat4.from - BEATS.beat2.from}
        durationInFrames={BEATS.beat4.durationInFrames}
        premountFor={30}
      >
        <Beat4Mercator />
      </Sequence>

      {/* VO Beat 5 */}
      <Sequence from={BEATS.beat5.from - BEATS.beat2.from} durationInFrames={AUDIO_SEGMENTS.beat5.durationFrames}>
        <Audio
          src={staticFile(AUDIO_SEGMENTS.beat5.file)}
          startFrom={0}
          endAt={AUDIO_SEGMENTS.beat5.durationFrames}
        />
      </Sequence>

      {/* Beat 5 — Final */}
      <Sequence
        from={BEATS.beat5.from - BEATS.beat2.from}
        durationInFrames={BEATS.beat5.durationInFrames}
        premountFor={30}
      >
        <Beat5Final />
      </Sequence>

      {/* Sous-titres karaoke — beats 2/2b/3/4 uniquement (Beat5 a ses sous-titres integres) */}
      <SubtitlesVraieTaille sceneStartS={0} sceneEndS={BEAT4_END_S} />
    </AbsoluteFill>
  );
};

// Duree totale Beats 2-5
export const BEATS_2_5_DURATION =
  BEATS.beat2.durationInFrames +
  BEATS.beat3.durationInFrames +
  BEATS.beat4.durationInFrames +
  BEATS.beat5.durationInFrames; // 600+240+750+420 = 2010f
