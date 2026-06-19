import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Crown,
  Globe,
  Diamond,
  Zap,
  Flag,
  Building2,
  Wheat,
  Ship,
  Pickaxe,
  Landmark,
  TrendingUp,
  Users,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const APPEAR_END = 15;
const FLIP_START = 75;
const FLIP_MID = 105;
const FLIP_END = 135;
const HOLD_B_END = 195;
const TOTAL_FRAMES = 210;

const COIN_DIAMETER = 680;
const INNER_RING_DIAMETER = 570;

const COLOR_GOLD = "#c4a053";
const COLOR_BG = "#0d1420";
const COLOR_IVORY = "#f2ebd9";
const FONT_SERIF = "Cinzel, serif";
const FONT_MONO = '"IBM Plex Mono", monospace';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CoinIcon =
  | "crown"
  | "globe"
  | "diamond"
  | "zap"
  | "flag"
  | "building"
  | "wheat"
  | "ship"
  | "pickaxe"
  | "landmark"
  | "trending"
  | "users";

export interface FaceContent {
  icon: CoinIcon;
  label: string;
  value: string;
  // OPTIONNEL : contenu React custom (illustration SVG) injecte DANS la face a la place de icon/label/value.
  // Permet d'utiliser le template 3D avec des faces sur-mesure (ex: malediction/miracle Senegal).
  custom?: React.ReactNode;
  accentColor?: string; // bordure/anneau de la face (defaut or)
}

export interface CoinFlipProps {
  faceA?: FaceContent;
  faceB?: FaceContent;
  subtitle?: string;
  bgColor?: string;
  // OPTIONNEL : pilotage externe du flip (frame-driven par un parent) au lieu du timing interne.
  rotateYExternal?: number;
  diameter?: number;
  showDotGrid?: boolean;
}

const DEFAULT_FACE_A: FaceContent = {
  icon: "crown",
  label: "EMPIRE",
  value: "1235",
};

const DEFAULT_FACE_B: FaceContent = {
  icon: "globe",
  label: "ETENDUE",
  value: "2M KM2",
};

const DEFAULT_SUBTITLE = "MALI - MANSA MOUSSA";

// ─── Icon resolver ────────────────────────────────────────────────────────────

function IconComponent({ name, size }: { name: CoinIcon; size: number }) {
  const props = { size, color: COLOR_GOLD, strokeWidth: 1.5 };
  switch (name) {
    case "crown":
      return <Crown {...props} />;
    case "globe":
      return <Globe {...props} />;
    case "diamond":
      return <Diamond {...props} />;
    case "zap":
      return <Zap {...props} />;
    case "flag":
      return <Flag {...props} />;
    case "building":
      return <Building2 {...props} />;
    case "wheat":
      return <Wheat {...props} />;
    case "ship":
      return <Ship {...props} />;
    case "pickaxe":
      return <Pickaxe {...props} />;
    case "landmark":
      return <Landmark {...props} />;
    case "trending":
      return <TrendingUp {...props} />;
    case "users":
      return <Users {...props} />;
    default:
      return <Crown {...props} />;
  }
}

// ─── Single coin face ─────────────────────────────────────────────────────────

function CoinFace({
  content,
  isBack,
}: {
  content: FaceContent;
  isBack: boolean;
}) {
  const accent = content.accentColor ?? COLOR_GOLD;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 38% 36%, #f6e2b0, #e7bd78 55%, #bf9442 100%)",
        border: `5px solid ${accent}`,
        boxShadow: `0 0 50px rgba(196,160,83,0.45), inset 0 0 60px rgba(120,80,20,0.25)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: isBack ? "rotateY(180deg)" : "rotateY(0deg)",
        gap: 24,
        overflow: "hidden",
      }}
    >
      {/* Inner decorative ring */}
      <div
        style={{
          position: "absolute",
          width: INNER_RING_DIAMETER,
          height: INNER_RING_DIAMETER,
          borderRadius: "50%",
          border: `1px solid rgba(120,80,20,0.35)`,
          pointerEvents: "none",
        }}
      />

      {/* CUSTOM content (illustration sur-mesure) — sinon icon/label/value par defaut */}
      {content.custom ? (
        content.custom
      ) : (
      <>
      {/* Icon */}
      <IconComponent name={content.icon} size={140} />

      {/* Label */}
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontSize: 36,
          letterSpacing: "0.25em",
          color: COLOR_GOLD,
          opacity: 0.85,
          textTransform: "uppercase",
        }}
      >
        {content.label}
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: content.value.length > 5 ? 90 : 130,
          fontWeight: 700,
          color: COLOR_IVORY,
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        {content.value}
      </div>

      {/* Bottom ornament line */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          width: 200,
          height: 1,
          backgroundColor: COLOR_GOLD,
          opacity: 0.4,
        }}
      />
      </>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const CoinFlip: React.FC<CoinFlipProps> = ({
  faceA = DEFAULT_FACE_A,
  faceB = DEFAULT_FACE_B,
  subtitle = DEFAULT_SUBTITLE,
  bgColor = "transparent",
  rotateYExternal,
  diameter = COIN_DIAMETER,
  showDotGrid = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const external = rotateYExternal !== undefined;

  // ── Pop-in spring (frame 0 → APPEAR_END) ───────────────────────────────────
  const popIn = spring({
    frame,
    fps,
    config: { damping: 70, stiffness: 200 },
    durationInFrames: APPEAR_END,
  });
  const coinScale = external ? 1 : interpolate(popIn, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Rotation Y (flip) ── pilotage externe possible (sync voix) ─────────────
  const rotateY = external
    ? (rotateYExternal as number)
    : frame < FLIP_START
      ? 0
      : frame > FLIP_END
      ? 180
      : interpolate(frame, [FLIP_START, FLIP_END], [0, 180], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  // ── Fade out (frame HOLD_B_END → TOTAL_FRAMES) ─────────────────────────────
  const fadeOut = interpolate(
    frame,
    [HOLD_B_END, TOTAL_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Zoom out at exit ────────────────────────────────────────────────────────
  const zoomOut = interpolate(
    frame,
    [HOLD_B_END, TOTAL_FRAMES],
    [1, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Subtitle fade in ────────────────────────────────────────────────────────
  const subtitleOpacity = interpolate(
    frame,
    [APPEAR_END, APPEAR_END + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Subtle wobble during hold phases (alive even when static) ─────────────
  const wobbleZ = Math.sin(frame / 20) * 1.5;

  // ── Edge shadow (tranche) — visible only when rotateY near 90 ──────────────
  const trancheProgress = interpolate(
    Math.abs(rotateY - 90),
    [0, 40],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const edgeShadow = `0 0 0 ${Math.round(18 * trancheProgress)}px #8a6a1f, 0 0 0 ${Math.round(22 * trancheProgress)}px ${COLOR_GOLD}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        overflow: "hidden",
      }}
    >
      {/* Dot grid background (off en mode externe : le parent gere le fond) */}
      {showDotGrid && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(rgba(196,160,83,0.30) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: 0.7,
          }}
        />
      )}

      {/* Top subtitle (off en mode externe) */}
      {!external && (
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: subtitleOpacity * fadeOut,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 32,
            letterSpacing: "0.3em",
            color: COLOR_GOLD,
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </div>
      </div>
      )}

      {/* Center: 3D coin container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: diameter,
          height: diameter,
          transform: `translate(-50%, -50%) scale(${external ? coinScale : coinScale * zoomOut})`,
          opacity: external ? 1 : fadeOut,
          perspective: 1400,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `perspective(1200px) rotateX(15deg) rotateY(${rotateY}deg) rotateZ(${wobbleZ}deg)`,
            boxShadow: edgeShadow,
            borderRadius: "50%",
          }}
        >
          <CoinFace content={faceA} isBack={false} />
          <CoinFace content={faceB} isBack={true} />
        </div>
      </div>

    </AbsoluteFill>
  );
};
