// Mini-render Atlas V2 Scene S3 Climax Hadj 34-50s with audio + SFX sync test.
// Validates: globe->wide transition, Mali->Mecque visible, caravane bezier, cartouches sync.
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import data from "./atlas-v2-data.json";

const COLORS = {
  bgTop: "#1A1F3A",
  bgBottom: "#2A1F2E",
  ocean: "#3A5A7E",
  oceanDeep: "#3A5A7E",
  land: "#C97D5A",
  landStroke: "#5A3A2A",
  maliFill: "#F5EBD8",
  egyptFill: "#E8B894",
  empireGold: "#D4A574",
  empireFillCream: "#F5EBD8",
  haloGold: "#D4A574",
  star: "#FFFFFF",
  cream: "#F2E5C8",
  textGold: "#E8C97D",
  textInk: "#3A2A18",
  pulseRing: "#FFFFFF",
};

const STARS = Array.from({ length: 60 }, (_, i) => {
  const seed = i * 9301 + 49297;
  return {
    x: ((seed * 17) % 720),
    y: ((seed * 31) % 1280),
    size: 0.5 + ((seed * 13) % 100) / 100,
    opacity: 0.4 + ((seed * 23) % 100) / 200,
  };
});

// Scene S3 starts at narration t=34s. Mini-render is 16s (480 frames at 30fps).
// We RE-OFFSET audio to start from 34s (use startFrom in <Audio>).
const SCENE_START_NARRATION = 34;
const SCENE_DURATION_FRAMES = 480; // 16s
const FPS = 30;

// Beat frames (relative to scene start, frame 0 = narration t=34s)
const beat = (narrSec: number) => Math.round((narrSec - SCENE_START_NARRATION) * FPS);

const BEATS = {
  pivot: beat(36.10),         // "Mais le moment qui marque l'histoire"
  douzeCouronnement: beat(37.62),
  mecqueDeparture: beat(40.50),
  mecqueWord: beat(41.46),
  soixanteHommes: beat(43.30),
  douzeMille: beat(45.00),
  chameaux: beat(47.52),
};

const SubtleStars: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {STARS.map((s, i) => {
        const tw = 0.7 + 0.3 * Math.sin(frame * 0.05 + i * 0.7);
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.size}
            fill={COLORS.star}
            opacity={s.opacity * tw}
          />
        );
      })}
    </g>
  );
};

const Cartouche: React.FC<{
  appearAt: number;
  disappearAt?: number;
  text: string;
  subtext?: string;
  x: number;
  y: number;
  fontSize?: number;
}> = ({ appearAt, disappearAt, text, subtext, x, y, fontSize = 44 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < appearAt) return null;
  if (disappearAt !== undefined && frame >= disappearAt) return null;
  const localFrame = frame - appearAt;
  const t = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const scale = interpolate(t, [0, 1], [0, 1]);
  const wobble = Math.sin(localFrame * 0.08) * 0.5;
  const fadeOut = disappearAt !== undefined
    ? interpolate(frame, [disappearAt - 10, disappearAt], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const opacity = t * fadeOut;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${-1.5 + wobble}) scale(${scale})`}
      opacity={opacity}
    >
      <rect
        x="-180"
        y="-60"
        width="360"
        height="120"
        fill={COLORS.cream}
        stroke={COLORS.empireGold}
        strokeWidth="3"
        rx="8"
      />
      <text
        x="0"
        y={subtext ? -8 : 12}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize={fontSize}
        fontWeight="700"
        fill={COLORS.textInk}
      >
        {text}
      </text>
      {subtext && (
        <text
          x="0"
          y="32"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          fontWeight="500"
          fill={COLORS.textInk}
          opacity="0.85"
        >
          {subtext}
        </text>
      )}
    </g>
  );
};

interface CaravaneAnimProps {
  startFrame: number;
  endFrame: number;
  pathD: string;
  pathTotalLength: number;
}

const CaravaneAnim: React.FC<CaravaneAnimProps> = ({
  startFrame,
  endFrame,
  pathD,
  pathTotalLength,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const t = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dashOffset = pathTotalLength * (1 - t);

  const waypoints: [number, number][] = [
    data.mercWide.caravaneWaypoints.Niani as [number, number],
    data.mercWide.caravaneWaypoints.Tombouctou as [number, number],
    data.mercWide.caravaneWaypoints.Sahara1 as [number, number],
    data.mercWide.caravaneWaypoints.Sahara2 as [number, number],
    data.mercWide.caravaneWaypoints.LeCaire as [number, number],
    data.mercWide.caravaneWaypoints.Sinai as [number, number],
    data.mercWide.caravaneWaypoints.Mecque as [number, number],
  ];
  const segmentT = t * (waypoints.length - 1);
  const segIdx = Math.min(Math.floor(segmentT), waypoints.length - 2);
  const localT = segmentT - segIdx;
  const p1 = waypoints[segIdx];
  const p2 = waypoints[segIdx + 1];
  const cx = p1[0] + (p2[0] - p1[0]) * localT;
  const cy = p1[1] + (p2[1] - p1[1]) * localT;

  // Hopping vertical only (walk cycle abandonne - frame A seul)
  const hopY = Math.abs(Math.sin(frame * 0.4)) * 5;

  const chibiSrc = "caravane-A.png";
  const chibiSize = 100;

  return (
    <g>
      {/* Path glow + main */}
      <path
        d={pathD}
        fill="none"
        stroke="#FFE9C2"
        strokeWidth="7"
        strokeDasharray={pathTotalLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <path
        d={pathD}
        fill="none"
        stroke={COLORS.empireGold}
        strokeWidth="3.2"
        strokeDasharray={pathTotalLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Caravane chibi spritesheet cycle - SVG image with full transparent PNG */}
      <image
        href={staticFile(`atlas-mansa-moussa/v2/chibi/${chibiSrc}`)}
        x={cx - chibiSize / 2}
        y={cy - chibiSize - 5 + hopY}
        width={chibiSize}
        height={chibiSize}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};

export const AtlasV2SceneS3Test: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera moves: phase A wide entry (drift continu), phase B slight zoom toward voyage
  const phaseA_end = fps * 6;     // 6s wide entry
  const phaseB_end = fps * 12;    // zoom in slightly
  const phaseC_end = fps * 16;    // wide pull-back

  // Drift sinusoidal (constant motion as Aziz requested)
  const driftX = Math.sin(frame * 0.014) * 18;
  const driftY = Math.cos(frame * 0.011) * 10;

  // Scale: 1.0 -> 1.15 -> 1.0 (pendulum)
  const scaleT1 = interpolate(frame, [0, phaseA_end], [1.0, 1.0], {
    extrapolateRight: "clamp",
  });
  const scaleT2 = interpolate(frame, [phaseA_end, phaseB_end], [1.0, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleT3 = interpolate(frame, [phaseB_end, phaseC_end], [1.18, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = frame < phaseA_end ? scaleT1 : frame < phaseB_end ? scaleT2 : scaleT3;

  // Center shifts subtly toward Egypt during voyage
  const centerOffsetX = interpolate(frame, [0, phaseB_end], [0, 60], {
    extrapolateRight: "clamp",
  });

  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const egypt = data.mercWide.countries.find((c) => c.iso === "EGY");
  const tombouctou = data.mercWide.cities.Tombouctou as [number, number];
  const caire = data.mercWide.cities.LeCaire as [number, number];
  const mecque = data.mercWide.cities.Mecque as [number, number];

  // Estimate caravane path length empirically (sum waypoint distances + 20%)
  const wp = data.mercWide.caravaneWaypoints;
  const pts = [wp.Niani, wp.Tombouctou, wp.Sahara1, wp.Sahara2, wp.LeCaire, wp.Sinai, wp.Mecque];
  let lenEstimate = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1][0] - pts[i][0];
    const dy = pts[i + 1][1] - pts[i][1];
    lenEstimate += Math.sqrt(dx * dx + dy * dy);
  }
  lenEstimate *= 1.15;

  // Caravane animates from "mecqueDeparture" beat (start of voyage narration) to chameaux beat
  // This syncs path drawing with the chibi position narrative
  const caravaneStart = BEATS.mecqueDeparture;
  const caravaneEnd = BEATS.chameaux + 10;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgBottom }}>
      <Audio
        src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
        startFrom={Math.round(SCENE_START_NARRATION * fps)}
      />
      <Audio
        src={staticFile("atlas-mansa-moussa/music/C-mande-contemplatif.mp3")}
        startFrom={Math.round(SCENE_START_NARRATION * fps)}
        volume={0.06}
      />
      <Sequence from={BEATS.mecqueDeparture}>
        <Audio
          src={staticFile("atlas-mansa-moussa/sfx/C-caravane-ink-draw.mp3")}
          volume={0.85}
        />
      </Sequence>
      <Sequence from={BEATS.douzeCouronnement - 5}>
        <Audio
          src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")}
          volume={1.0}
        />
      </Sequence>
      <Sequence from={BEATS.soixanteHommes - 5}>
        <Audio
          src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")}
          volume={1.0}
        />
      </Sequence>
      <Sequence from={BEATS.douzeMille - 5}>
        <Audio
          src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")}
          volume={1.0}
        />
      </Sequence>
      <Sequence from={BEATS.chameaux - 5}>
        <Audio
          src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")}
          volume={1.0}
        />
      </Sequence>

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor={COLORS.bgTop} />
            <stop offset="100%" stopColor={COLORS.bgBottom} />
          </radialGradient>
          <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
          </radialGradient>
          <pattern
            id="empireHatch"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke={COLORS.empireFillCream}
              strokeWidth="2"
              opacity="0.75"
            />
          </pattern>
        </defs>

        <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
        <SubtleStars opacity={0.6} />

        <g
          transform={`translate(${360 + driftX - centerOffsetX} ${640 + driftY}) scale(${scale}) translate(${-360} ${-640})`}
        >
          <rect
            x="-300"
            y="-300"
            width="1320"
            height="1880"
            fill={COLORS.oceanDeep}
          />

          {data.mercWide.countries.map((c) => {
            let fill = COLORS.land;
            if (c.iso === "MLI") fill = COLORS.maliFill;
            else if (c.iso === "EGY") fill = COLORS.egyptFill;
            else if (c.iso === "SAU") fill = COLORS.egyptFill;
            return (
              <path
                key={c.iso}
                d={c.d}
                fill={fill}
                stroke={COLORS.landStroke}
                strokeWidth="0.6"
                strokeOpacity="0.7"
              />
            );
          })}

          {/* Mali Empire 1300 visible from start of S3 - cream hatch + cream stroke */}
          {data.mercWide.maliEmpire1300 && (
            <>
              <path
                d={data.mercWide.maliEmpire1300}
                fill={COLORS.empireFillCream}
                fillOpacity="0.18"
                stroke="none"
              />
              <path
                d={data.mercWide.maliEmpire1300}
                fill="url(#empireHatch)"
                fillOpacity="0.85"
                stroke={COLORS.empireFillCream}
                strokeWidth="3"
                strokeOpacity="0.9"
                strokeLinejoin="round"
                strokeDasharray="10 5"
              />
            </>
          )}

          {/* Mali strong outline (Mali = focus pays) */}
          {mali && (
            <path
              d={mali.d}
              fill="none"
              stroke={COLORS.textInk}
              strokeWidth="2"
              strokeOpacity="0.95"
            />
          )}

          {/* Caravane path + chibi animation */}
          <CaravaneAnim
            startFrame={caravaneStart}
            endFrame={caravaneEnd}
            pathD={data.mercWide.caravaneSmooth}
            pathTotalLength={lenEstimate}
          />

          {/* Pulse markers at key cities (beat-synced) */}
          {[
            { coord: tombouctou, beatStart: 0, color: COLORS.empireGold },
            { coord: caire, beatStart: BEATS.mecqueDeparture + 80, color: COLORS.empireGold },
            { coord: mecque, beatStart: BEATS.mecqueWord, color: COLORS.empireGold },
          ].map((m, i) => {
            if (frame < m.beatStart) return null;
            const t = (frame - m.beatStart) / fps;
            const pulse = Math.max(0, 1 - (t % 1.5) / 1.5);
            return (
              <g key={i}>
                <circle
                  cx={m.coord[0]}
                  cy={m.coord[1]}
                  r={4 + pulse * 18}
                  fill="none"
                  stroke={COLORS.pulseRing}
                  strokeWidth="3"
                  opacity={(1 - pulse) * 0.95}
                />
                <circle
                  cx={m.coord[0]}
                  cy={m.coord[1]}
                  r="6"
                  fill={m.color}
                  stroke={COLORS.textInk}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* City labels - pill background + heavy outline for readability */}
          {(() => {
            type LabelDef = { coord: [number, number]; text: string; appearAt: number; offsetX: number; offsetY: number };
            const labels: LabelDef[] = [
              { coord: caire, text: "LE CAIRE", appearAt: BEATS.mecqueDeparture + 80, offsetX: 14, offsetY: -32 },
              { coord: mecque, text: "LA MECQUE", appearAt: BEATS.mecqueWord, offsetX: 14, offsetY: -32 },
            ];
            const charW = 16;
            return labels.map((lbl, idx) => {
              if (frame < lbl.appearAt) return null;
              const localFrame = frame - lbl.appearAt;
              const t = spring({
                frame: localFrame,
                fps,
                config: { damping: 18, stiffness: 220 },
              });
              const opacity = interpolate(t, [0, 1], [0, 1]);
              const sc = interpolate(t, [0, 1], [0.6, 1]);
              const w = lbl.text.length * charW + 36;
              const h = 38;
              const lx = lbl.coord[0] + lbl.offsetX;
              const ly = lbl.coord[1] + lbl.offsetY;
              return (
                <g
                  key={idx}
                  transform={`translate(${lx} ${ly}) scale(${sc}) translate(${-lx} ${-ly})`}
                  opacity={opacity}
                >
                  <rect
                    x={lx - w / 2}
                    y={ly - h / 2}
                    width={w}
                    height={h}
                    rx="6"
                    fill={COLORS.cream}
                    stroke={COLORS.textInk}
                    strokeWidth="2"
                  />
                  <text
                    x={lx}
                    y={ly + 9}
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontSize="26"
                    fontWeight="700"
                    fill={COLORS.textInk}
                    letterSpacing="1"
                  >
                    {lbl.text}
                  </text>
                </g>
              );
            });
          })()}
        </g>

        {/* UI cartouches stats (beat-synced) */}
        <Cartouche
          appearAt={BEATS.douzeCouronnement}
          disappearAt={BEATS.soixanteHommes}
          text="DOUZE ANS"
          subtext="APRES LE COURONNEMENT"
          x={360}
          y={140}
          fontSize={42}
        />
        <Cartouche
          appearAt={BEATS.soixanteHommes}
          text="60 000"
          subtext="HOMMES EN MARCHE"
          x={360}
          y={140}
          fontSize={56}
        />
        <Cartouche
          appearAt={BEATS.douzeMille}
          disappearAt={BEATS.chameaux}
          text="12 000"
          subtext="ESCLAVES"
          x={360}
          y={1140}
          fontSize={56}
        />
        <Cartouche
          appearAt={BEATS.chameaux}
          text="80 CHAMEAUX"
          subtext="x 150 KG D'OR"
          x={360}
          y={1140}
          fontSize={42}
        />

        <rect
          x="0"
          y="0"
          width="720"
          height="1280"
          fill="url(#vignette)"
          pointerEvents="none"
        />
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_S3_DURATION = SCENE_DURATION_FRAMES;
