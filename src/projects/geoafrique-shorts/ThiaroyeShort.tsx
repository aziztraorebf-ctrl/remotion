import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  OffthreadVideo,
  staticFile,
  Sequence,
  Easing,
  delayRender,
  continueRender,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// THIAROYE 1944 -- Short 110s / 3302 frames
// Format : 1080x1920 (9:16 vertical)
// Style  : sepia/gold documentary, Kling clips slow-motion
// Audio  : thiaroye-voixoff-v6.mp3 (110s)
// Pipeline: Gemini 3x3 storyboard -> Kling I2V -> Remotion assembly
// ============================================================

const FPS = 30;
const TOTAL_DURATION = 110.08;
const TOTAL_FRAMES = Math.ceil(TOTAL_DURATION * FPS); // 3302

const W = 1080;
const H = 1920;

// -- Palette --
const PAL = {
  bg: "#0a0808",
  sepia: "#c8a96e",
  gold: "#d4af37",
  goldLight: "#f0d060",
  cream: "#f5e6c8",
  darkSepia: "#2a1f0f",
  red: "#8b1a1a",
  white: "#ffffff",
  textShadow: "rgba(0,0,0,0.85)",
} as const;

// -- Assets paths --
const AUDIO_PATH = "assets/library/geoafrique/thiaroye-1944/thiaroye-voixoff-v6.mp3";
const CLIPS_DIR = "assets/library/geoafrique/thiaroye-1944/clips";

// -- Segment timing (frames @ 30fps) --
// Each segment maps to a narrative beat in the voix-off
const SEGMENTS = {
  s1: { start: 0, end: 360, clip: "frame-01-final.mp4", playbackRate: 0.29 },
  s2: { start: 360, end: 720, clip: "frame-02.mp4", playbackRate: 0.42 },
  s3: { start: 720, end: 1080, clip: "frame-03.mp4", playbackRate: 0.42 },
  s4: { start: 1080, end: 1380, clip: "frame-04-v2.mp4", playbackRate: 0.50 },
  s5: { start: 1380, end: 1740, clip: null, playbackRate: 0 }, // SVG map segment
  s6: { start: 1740, end: 2100, clip: "frame-06.mp4", playbackRate: 0.42 },
  s7: { start: 2100, end: 2460, clip: "frame-07.mp4", playbackRate: 0.42 },
  s8: { start: 2460, end: 2880, clip: "frame-08.mp4", playbackRate: 0.36 },
  s9: { start: 2880, end: TOTAL_FRAMES, clip: "frame-09.mp4", playbackRate: 0.35 },
} as const;

// ============================================================
// Text overlay component
// ============================================================
const TextOverlay: React.FC<{
  text: string;
  fontSize?: number;
  y?: number;
  fadeInDuration?: number;
  color?: string;
  bold?: boolean;
  maxWidth?: number;
}> = ({
  text,
  fontSize = 48,
  y = H * 0.12,
  fadeInDuration = 15,
  color = PAL.cream,
  bold = true,
  maxWidth = W * 0.85,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: W,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize,
          fontWeight: bold ? 700 : 400,
          color,
          textAlign: "center",
          maxWidth,
          lineHeight: 1.3,
          textShadow: `0 2px 20px ${PAL.textShadow}, 0 4px 40px ${PAL.textShadow}`,
          letterSpacing: 1,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ============================================================
// Slow-motion clip segment
// ============================================================
const ClipSegment: React.FC<{
  clipFile: string;
  playbackRate: number;
  durationInFrames: number;
  scaleEffect?: "slowZoomIn" | "slowZoomOut" | "none";
}> = ({ clipFile, playbackRate, durationInFrames, scaleEffect = "slowZoomIn" }) => {
  const frame = useCurrentFrame();

  let scale = 1;
  if (scaleEffect === "slowZoomIn") {
    scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.ease,
    });
  } else if (scaleEffect === "slowZoomOut") {
    scale = interpolate(frame, [0, durationInFrames], [1.15, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.ease,
    });
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg }}>
      <OffthreadVideo
        src={staticFile(`${CLIPS_DIR}/${clipFile}`)}
        playbackRate={playbackRate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// SVG Map segment (F5 slot) -- Senegal > Dakar > Camp Thiaroye
// Uses topojson + d3-geo for accurate Africa rendering
// ============================================================

const ISO_SENEGAL = 686;
// AOF countries for context highlighting
const AOF_ISOS = new Set([686, 466, 324, 270, 478, 854, 562, 384, 204, 768, 288]);

interface MapFeature {
  id: number;
  path: string;
  centroid: [number, number] | null;
}

function useThiaroyeMapData() {
  const [countries, setCountries] = React.useState<MapFeature[]>([]);
  const [handle] = React.useState(() => delayRender("Thiaroye map"));

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(
          topo,
          topo.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

        // Projection centered on West Africa, vertical format
        const proj = d3Geo.geoMercator()
          .center([-5, 12])
          .scale(1800)
          .translate([W / 2, H * 0.42]);

        const pathGen = d3Geo.geoPath().projection(proj);
        const features: MapFeature[] = geo.features
          .map((f) => {
            const id = Number((f as { id?: unknown }).id ?? 0);
            const path = pathGen(f) ?? "";
            const cent = pathGen.centroid(f);
            return {
              id,
              path,
              centroid: (cent && !isNaN(cent[0]) ? cent : null) as [number, number] | null,
            };
          })
          .filter((f) => f.path);

        setCountries(features);
        continueRender(handle);
      });
  }, [handle]);

  return countries;
}

// Dakar coordinates projected
const DAKAR_LON = -17.447;
const DAKAR_LAT = 14.693;

const MapSegment: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const countries = useThiaroyeMapData();

  // Phase 1: Africa appears (0-30%)
  // Phase 2: Zoom to Senegal + AOF highlight (30-60%)
  // Phase 3: Dakar marker + "400 000" counter (60-100%)
  const phase1End = Math.floor(durationInFrames * 0.3);
  const phase2End = Math.floor(durationInFrames * 0.6);

  const mapOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Zoom progression
  const zoomScale = interpolate(
    frame,
    [0, phase1End, phase2End, durationInFrames],
    [0.8, 0.8, 1.8, 2.2],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  // Pan to Senegal
  const panX = interpolate(
    frame,
    [phase1End, phase2End],
    [0, 320],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.inOut(Easing.ease) }
  );
  const panY = interpolate(
    frame,
    [phase1End, phase2End],
    [0, 350],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  // AOF highlight intensity
  const aofHighlight = interpolate(frame, [phase1End, phase1End + 30], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Senegal special highlight
  const senegalHighlight = interpolate(frame, [phase1End + 15, phase1End + 40], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Dakar marker
  const dakarOpacity = interpolate(frame, [phase2End, phase2End + 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Counter
  const counterProgress = interpolate(
    frame,
    [phase2End + 20, phase2End + 70],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const counterValue = Math.floor(counterProgress * 400000);

  // Pulsating marker
  const pulseScale = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.4, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Find Senegal centroid for Dakar marker position
  const senegalFeature = countries.find((c) => c.id === ISO_SENEGAL);
  const dakarX = senegalFeature?.centroid ? senegalFeature.centroid[0] - 40 : W * 0.35;
  const dakarY = senegalFeature?.centroid ? senegalFeature.centroid[1] - 10 : H * 0.38;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1020", overflow: "hidden" }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          opacity: mapOpacity,
          transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`,
          transformOrigin: "35% 40%",
        }}
      >
        {/* All countries */}
        {countries.map((c) => {
          const isAOF = AOF_ISOS.has(c.id);
          const isSenegal = c.id === ISO_SENEGAL;

          let fill = "#1a1a2e";
          let stroke = "#2a2a3a";
          let strokeW = 0.5;

          if (isAOF && aofHighlight > 0) {
            fill = interpolate(aofHighlight, [0, 1], [0, 0.3])
              ? `rgba(200, 130, 10, ${0.3 * aofHighlight})`
              : fill;
            fill = `rgba(200, 130, 10, ${0.2 * aofHighlight})`;
            stroke = PAL.sepia;
            strokeW = 0.8;
          }
          if (isSenegal && senegalHighlight > 0) {
            fill = `rgba(212, 175, 55, ${0.5 * senegalHighlight})`;
            stroke = PAL.goldLight;
            strokeW = 1.5;
          }

          return (
            <path
              key={c.id}
              d={c.path}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
            />
          );
        })}

        {/* Dakar marker */}
        {dakarOpacity > 0 && (
          <g opacity={dakarOpacity}>
            <circle
              cx={dakarX}
              cy={dakarY}
              r={8 * pulseScale}
              fill={PAL.red}
              stroke={PAL.goldLight}
              strokeWidth={2}
            />
            <circle
              cx={dakarX}
              cy={dakarY}
              r={16 * pulseScale}
              fill="none"
              stroke={PAL.red}
              strokeWidth={1}
              opacity={0.4}
            />
            {/* Label */}
            <text
              x={dakarX}
              y={dakarY - 28}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize={22}
              fill={PAL.cream}
              fontWeight={700}
            >
              Camp de Thiaroye
            </text>
          </g>
        )}
      </svg>

      {/* Counter overlay */}
      {counterProgress > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: H * 0.18,
            width: W,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 72,
              fontWeight: 700,
              color: PAL.goldLight,
              textShadow: `0 2px 30px rgba(212,175,55,0.5), 0 4px 40px ${PAL.textShadow}`,
              letterSpacing: 4,
            }}
          >
            {counterValue.toLocaleString("fr-FR")}
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              color: PAL.cream,
              opacity: 0.8,
              textShadow: `0 2px 10px ${PAL.textShadow}`,
            }}
          >
            tirailleurs africains
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================
// Crossfade transition wrapper
// ============================================================
const CROSSFADE_FRAMES = 12; // 0.4s crossfade

// ============================================================
// Main composition
// ============================================================
export const ThiaroyeShort: React.FC = () => {
  const frame = useCurrentFrame();

  // Global vignette for cinematic feel
  const vignetteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: W,
    height: H,
    background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)`,
    pointerEvents: "none",
    zIndex: 10,
  };

  // Crossfade helper: returns opacity for a segment
  const segmentOpacity = (start: number, end: number) => {
    const fadeIn = interpolate(frame, [start, start + CROSSFADE_FRAMES], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const fadeOut = interpolate(
      frame,
      [end - CROSSFADE_FRAMES, end],
      [1, 0],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    // First segment: no fade in. Last segment: no fade out.
    if (start === 0) return fadeOut;
    if (end >= TOTAL_FRAMES) return fadeIn;
    return Math.min(fadeIn, fadeOut);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg }}>
      {/* Master audio */}
      <Audio src={staticFile(AUDIO_PATH)} />

      {/* S1: Wax seal -- "Dakar. Decembre 1944." */}
      <Sequence
        from={SEGMENTS.s1.start}
        durationInFrames={SEGMENTS.s1.end - SEGMENTS.s1.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s1.clip!}
          playbackRate={SEGMENTS.s1.playbackRate}
          durationInFrames={SEGMENTS.s1.end - SEGMENTS.s1.start}
          scaleEffect="slowZoomIn"
        />
        <Sequence from={15} durationInFrames={180}>
          <TextOverlay
            text="Dakar, 1944"
            fontSize={56}
            y={H * 0.08}
            color={PAL.goldLight}
          />
        </Sequence>
      </Sequence>

      {/* S2: Empty camp -- "Ces hommes ont traverse l'Europe..." */}
      <Sequence
        from={SEGMENTS.s2.start}
        durationInFrames={SEGMENTS.s2.end - SEGMENTS.s2.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s2.clip!}
          playbackRate={SEGMENTS.s2.playbackRate}
          durationInFrames={SEGMENTS.s2.end - SEGMENTS.s2.start}
          scaleEffect="slowZoomOut"
        />
      </Sequence>

      {/* S3: Soldiers row -- "Le 1er decembre, ils reclament..." */}
      <Sequence
        from={SEGMENTS.s3.start}
        durationInFrames={SEGMENTS.s3.end - SEGMENTS.s3.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s3.clip!}
          playbackRate={SEGMENTS.s3.playbackRate}
          durationInFrames={SEGMENTS.s3.end - SEGMENTS.s3.start}
          scaleEffect="slowZoomIn"
        />
      </Sequence>

      {/* S4: Soldier profiles -- "La reponse? Des soldats ouvrent le feu" */}
      <Sequence
        from={SEGMENTS.s4.start}
        durationInFrames={SEGMENTS.s4.end - SEGMENTS.s4.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s4.clip!}
          playbackRate={SEGMENTS.s4.playbackRate}
          durationInFrames={SEGMENTS.s4.end - SEGMENTS.s4.start}
          scaleEffect="slowZoomIn"
        />
      </Sequence>

      {/* S5: SVG Map -- "Au camp de Thiaroye... 400 000 tirailleurs" */}
      <Sequence
        from={SEGMENTS.s5.start}
        durationInFrames={SEGMENTS.s5.end - SEGMENTS.s5.start}
      >
        <MapSegment durationInFrames={SEGMENTS.s5.end - SEGMENTS.s5.start} />
      </Sequence>

      {/* S6: Silhouettes smoke -- "Pendant 82 ans... le silence" */}
      <Sequence
        from={SEGMENTS.s6.start}
        durationInFrames={SEGMENTS.s6.end - SEGMENTS.s6.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s6.clip!}
          playbackRate={SEGMENTS.s6.playbackRate}
          durationInFrames={SEGMENTS.s6.end - SEGMENTS.s6.start}
          scaleEffect="slowZoomIn"
        />
        <Sequence from={90} durationInFrames={200}>
          <TextOverlay
            text="82 ans de silence"
            fontSize={52}
            y={H * 0.85}
            color={PAL.cream}
          />
        </Sequence>
      </Sequence>

      {/* S7: Aged hands -- "Le 27 mars 2026... cacher les documents" */}
      <Sequence
        from={SEGMENTS.s7.start}
        durationInFrames={SEGMENTS.s7.end - SEGMENTS.s7.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s7.clip!}
          playbackRate={SEGMENTS.s7.playbackRate}
          durationInFrames={SEGMENTS.s7.end - SEGMENTS.s7.start}
          scaleEffect="slowZoomOut"
        />
        <Sequence from={30} durationInFrames={250}>
          <TextOverlay
            text="27 mars 2026"
            fontSize={48}
            y={H * 0.08}
            color={PAL.goldLight}
          />
        </Sequence>
      </Sequence>

      {/* S8: Veteran ocean -- "Des centaines de familles... verite prisonniere" */}
      <Sequence
        from={SEGMENTS.s8.start}
        durationInFrames={SEGMENTS.s8.end - SEGMENTS.s8.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s8.clip!}
          playbackRate={SEGMENTS.s8.playbackRate}
          durationInFrames={SEGMENTS.s8.end - SEGMENTS.s8.start}
          scaleEffect="slowZoomIn"
        />
      </Sequence>

      {/* S9: Young woman portrait -- CTA */}
      <Sequence
        from={SEGMENTS.s9.start}
        durationInFrames={SEGMENTS.s9.end - SEGMENTS.s9.start}
      >
        <ClipSegment
          clipFile={SEGMENTS.s9.clip!}
          playbackRate={SEGMENTS.s9.playbackRate}
          durationInFrames={SEGMENTS.s9.end - SEGMENTS.s9.start}
          scaleEffect="slowZoomIn"
        />
        {/* CTA text */}
        <Sequence from={180} durationInFrames={SEGMENTS.s9.end - SEGMENTS.s9.start - 180}>
          <TextOverlay
            text="Le lien en bio"
            fontSize={40}
            y={H * 0.88}
            color={PAL.gold}
            bold={false}
          />
        </Sequence>
      </Sequence>

      {/* Cinematic vignette overlay */}
      <div style={vignetteStyle} />
    </AbsoluteFill>
  );
};
