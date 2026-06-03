import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MapPlatV3, type CameraKeyframe } from "./MapPlatV3";
import { GlowingRegionOverlay } from "./GlowingRegionOverlay";
import { FlagPatternOverlay } from "./FlagPatternOverlay";
import { PhotoVignette } from "./PhotoVignette";
import { GlowingPin } from "./GlowingPin";
import { AnimatedPath } from "./AnimatedPath";
import { AnimatedCaravan } from "./AnimatedCaravan";
import { CinematicVignette } from "./CinematicVignette";
import { getDistanceKm } from "./lib/geo-utils";

export const POCV4_DURATION = 1800;

const MALI_FLAG = ["#14B53A", "#FCD116", "#CE1126"];
const BAMAKO: [number, number] = [-7.99, 12.65];
const TOMBOUCTOU: [number, number] = [-3.00, 16.77];
const MECCA: [number, number] = [39.83, 21.42];
const MALI_GEOJSON = staticFile("geojson/mali.geojson");

// Master camera timeline in ABSOLUTE frame numbers
const CAMERA: CameraKeyframe[] = [
  { frame: 0,    lon: -3,   lat: 14, zoom: 3.5 },
  { frame: 90,   lon: -3,   lat: 17, zoom: 4.4 },
  { frame: 870,  lon: -3,   lat: 17, zoom: 4.4 },
  { frame: 1100, lon: 18,   lat: 19, zoom: 3.2 },
  { frame: 1320, lon: 18,   lat: 19, zoom: 3.2 },
  { frame: 1400, lon: -3,   lat: 16.8, zoom: 5.8 },
  { frame: 1620, lon: -3,   lat: 16.8, zoom: 5.8 },
  { frame: 1720, lon: 10,   lat: 5,  zoom: 2.6 },
  { frame: 1800, lon: 10,   lat: 5,  zoom: 2.6 },
];

// To use CAMERA inside a Sequence (which shifts useCurrentFrame to start at 0),
// we need to rebase each keyframe by subtracting the Sequence's `from` offset.
const rebase = (kfs: CameraKeyframe[], offset: number): CameraKeyframe[] =>
  kfs.map((k) => ({ ...k, frame: k.frame - offset }));

const Caption: React.FC<{ text: string; subtitle?: string; x: number; y: number; startFrame: number; exitFrame?: number; size?: "lg" | "md" | "sm"; color?: string }> = ({ text, subtitle, x, y, startFrame, exitFrame, size = "md", color = "#FFFFFF" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0) return null;
  if (exitFrame !== undefined && frame > exitFrame + 12) return null;
  const enter = spring({ frame: local, fps, config: { damping: 11, stiffness: 200, mass: 0.7 } });
  const exit = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const fontSize = size === "lg" ? 64 : size === "md" ? 42 : 28;
  const subFontSize = size === "lg" ? 28 : 22;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${enter})`,
        opacity: exit,
        textAlign: "center",
        fontFamily: "Montserrat, Helvetica Neue, Arial, sans-serif",
        fontWeight: 900,
        fontSize,
        color,
        textShadow: "3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {text}
      {subtitle && (
        <div style={{ fontSize: subFontSize, fontWeight: 700, marginTop: 6, color: "#FCD116", letterSpacing: "0.05em" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

const ChapterNumber: React.FC<{ n: number; startFrame: number; exitFrame?: number }> = ({ n, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0) return null;
  if (exitFrame !== undefined && frame > exitFrame) return null;
  const enter = spring({ frame: local, fps, config: { damping: 8, stiffness: 220, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 40,
        transform: `scale(${enter}) rotate(-8deg)`,
        fontFamily: "Caveat, Georgia, serif",
        fontWeight: 700,
        fontSize: 90,
        color: "#CE1126",
        textShadow: "3px 3px 0 #FFFFFF, -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF, 0 0 20px rgba(0,0,0,0.5)",
      }}
    >
      {n}
    </div>
  );
};

export const POCV4Mali60s: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d4e8" }}>
      {/* === BASE LAYERS always mounted === */}
      <MapPlatV3 keyframes={CAMERA} startFrame={0} />

      {/* Halo Mali from frame 90 to 1620 */}
      <Sequence from={90} durationInFrames={1530}>
        <GlowingRegionOverlay
          geojsonPath={MALI_GEOJSON}
          keyframes={rebase(CAMERA, 90)}
          startFrame={0}
          fadeInFrames={20}
          fillColor="#FFFFFF"
          fillOpacity={0}
          glowColor="#FFFFFF"
          borderColor="#FFFFFF"
        />
      </Sequence>

      {/* === Text overlays use absolute frames (no Sequence wrap needed) === */}
      <Caption text="Vous connaissez le Mali ?" x={640} y={130} startFrame={20} exitFrame={75} size="md" />
      <ChapterNumber n={1} startFrame={130} exitFrame={870} />
      <Caption text="République du Mali" subtitle="22 septembre 1960" x={640} y={620} startFrame={360} exitFrame={520} size="md" />
      <Caption text="L'HOMME LE PLUS RICHE" x={500} y={150} startFrame={600} exitFrame={840} size="md" color="#FFFFFF" />
      <Caption text="400 MILLIARDS $" subtitle="DE L'HISTOIRE" x={500} y={230} startFrame={660} exitFrame={840} size="lg" color="#FCD116" />
      <ChapterNumber n={2} startFrame={870} exitFrame={1320} />
      <Caption text="LE PELERINAGE DE 1324" x={640} y={120} startFrame={920} exitFrame={1300} size="md" color="#FFFFFF" />
      <Caption
        text="60 000 PERSONNES"
        subtitle={`Bamako → La Mecque · ${Math.round(getDistanceKm(BAMAKO, MECCA))} km`}
        x={640} y={620} startFrame={1180} exitFrame={1300} size="md" color="#FCD116"
      />
      <ChapterNumber n={3} startFrame={1320} exitFrame={1620} />
      <Caption text="TOMBOUCTOU" x={400} y={150} startFrame={1430} exitFrame={1600} size="lg" color="#FFFFFF" />
      <Caption text="700 000 MANUSCRITS" subtitle="Centre du savoir africain" x={400} y={250} startFrame={1490} exitFrame={1600} size="md" color="#FCD116" />
      <Caption text="L'AFRIQUE" x={640} y={280} startFrame={1660} size="lg" color="#FFFFFF" />
      <Caption text="QUI VOUS A ÉTÉ CACHÉE" x={640} y={360} startFrame={1700} size="md" color="#FCD116" />
      <Caption text="▶ ABONNE-TOI" x={640} y={520} startFrame={1740} size="md" color="#CE1126" />

      {/* === Mapbox-dependent overlays wrapped in Sequence for proper mount/unmount === */}

      {/* Segment 2 : Flag projection 300-540 */}
      <Sequence from={300} durationInFrames={240}>
        <FlagPatternOverlay
          geojsonPath={MALI_GEOJSON}
          keyframes={rebase(CAMERA, 300)}
          startFrame={0}
          fadeInFrames={6}
          flagColors={MALI_FLAG}
          flagOrientation="vertical"
          opacity={0.82}
          bandStartFrames={[0, 25, 50]}
          bandFadeFrames={15}
        />
      </Sequence>

      {/* Segment 3 : Mansa Moussa photo 540-870 */}
      <Sequence from={540} durationInFrames={330}>
        <PhotoVignette
          src={staticFile("photos/mansa-moussa.svg")}
          x={1000} y={360} width={280} rotation={-5}
          startFrame={0} exitFrame={300}
          caption="Mansa Moussa"
        />
      </Sequence>

      {/* Segment 4 : Pilgrimage Bamako pin 870-1320 */}
      <Sequence from={870} durationInFrames={450}>
        <GlowingPin lon={BAMAKO[0]} lat={BAMAKO[1]} keyframes={rebase(CAMERA, 870)} startFrame={0} color="#FFD700" size={22} />
      </Sequence>

      {/* Segment 4 : Pilgrimage geodesic path 1000-1320 */}
      <Sequence from={1000} durationInFrames={320}>
        <AnimatedPath
          from={BAMAKO}
          to={MECCA}
          useGreatCircle={true}
          greatCirclePoints={80}
          keyframes={rebase(CAMERA, 1000)}
          startFrame={0}
          drawDurationFrames={120}
          color="#FFA500"
          strokeWidth={5}
        />
      </Sequence>

      {/* Segment 4 : Animated caravan walks Bamako -> Mecca 1150-1320 (start after line drawn) */}
      <Sequence from={1150} durationInFrames={170}>
        <AnimatedCaravan
          from={BAMAKO}
          to={MECCA}
          keyframes={rebase(CAMERA, 1150)}
          startFrame={0}
          travelDurationFrames={160}
          count={15}
          spacingKm={300}
          dotRadius={7}
          dotColor="#CE1126"
          leaderRadius={11}
          leaderColor="#FFFFFF"
          dotGlow={true}
        />
      </Sequence>

      {/* Segment 4 : Mecca pin 1150-1320 */}
      <Sequence from={1150} durationInFrames={170}>
        <GlowingPin lon={MECCA[0]} lat={MECCA[1]} keyframes={rebase(CAMERA, 1150)} startFrame={0} color="#FFD700" size={22} />
      </Sequence>

      {/* Segment 5 : Tombouctou pin 1400-1620 */}
      <Sequence from={1400} durationInFrames={220}>
        <GlowingPin lon={TOMBOUCTOU[0]} lat={TOMBOUCTOU[1]} keyframes={rebase(CAMERA, 1400)} startFrame={0} color="#FFD700" size={22} />
      </Sequence>

      {/* Segment 5 : Tombouctou photo 1430-1620 */}
      <Sequence from={1430} durationInFrames={190}>
        <PhotoVignette
          src={staticFile("photos/manuscrit-tombouctou.svg")}
          x={990} y={400} width={300} height={240} rotation={4}
          startFrame={0} exitFrame={170}
          caption="Tombouctou"
        />
      </Sequence>

      {/* Segment 6 : Outro flag 1620-1800 */}
      <Sequence from={1620} durationInFrames={180}>
        <FlagPatternOverlay
          geojsonPath={MALI_GEOJSON}
          keyframes={rebase(CAMERA, 1620)}
          startFrame={0}
          fadeInFrames={20}
          flagColors={MALI_FLAG}
          flagOrientation="vertical"
          opacity={0.82}
          bandStartFrames={[0, 0, 0]}
          bandFadeFrames={20}
        />
      </Sequence>

      {/* Cinematic vignette always on top */}
      <CinematicVignette intensity={0.45} />
    </AbsoluteFill>
  );
};
