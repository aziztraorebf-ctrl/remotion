import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";

const BG = staticFile("assets/peste-pixel/pixellab/side-view/backgrounds/medieval-street-panorama.png");

const PEASANT_EAST = (f: number) =>
  staticFile(`assets/peste-pixel/pixellab/side-view/characters/peasant-man-side/animations/walking/east/frame_00${f}.png`);
const MONK_WEST = (f: number) =>
  staticFile(`assets/peste-pixel/pixellab/side-view/characters/monk-side/animations/walking/west/frame_00${f}.png`);
const WOMAN_EAST = (f: number) =>
  staticFile(`assets/peste-pixel/pixellab/side-view/characters/peasant-woman-side/animations/walking/east/frame_00${f}.png`);

// Sol calibré PIL Option B (bg top=-200, scale=1.25): jonction bâtiments/pavés = y=720
const GROUND_Y = 720;
const ANIM_FPS = 8;

const WalkingSprite: React.FC<{
  frames: (f: number) => string;
  x: number;
  scale?: number;
  flipped?: boolean;
  opacity?: number;
}> = ({ frames, x, scale = 5, flipped = false, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const size = 64 * scale;
  const animFrame = Math.floor((frame * ANIM_FPS) / 30) % 6;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: GROUND_Y - size,
        width: size,
        height: size,
        transform: flipped ? "scaleX(-1)" : undefined,
        imageRendering: "pixelated",
        opacity,
      }}
    >
      <Img
        src={frames(animFrame)}
        style={{ width: size, height: size, imageRendering: "pixelated" }}
      />
    </div>
  );
};

export const SideScrollProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Parallax background : défile de 0 à -280px sur toute la durée
  const bgX = interpolate(frame, [0, durationInFrames], [0, -280], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Paysan : entre lentement par la gauche, atteint le centre à mi-vidéo
  const peasantX = interpolate(frame, [0, durationInFrames], [-320, width * 0.55], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Moine : entre par la droite plus tard (frame 40), se croise avec le paysan vers frame 200
  const monkX = interpolate(frame, [40, durationInFrames], [width + 50, width * 0.10], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Femme paysanne : arrière-plan (scale 4x), entre frame 60, vitesse intermédiaire
  const womanX = interpolate(
    frame,
    [60, durationInFrames],
    [width * 0.15, width * 0.75],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Fade in/out plus doux (6 frames au lieu de 12)
  const globalOpacity = interpolate(
    frame,
    [0, 6, durationInFrames - 6, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        width,
        height,
        overflow: "hidden",
        background: "#080508",
        position: "relative",
        opacity: globalOpacity,
      }}
    >
      {/* BACKGROUND avec parallax — top=-200 pour exposer le sol des pavés */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: bgX,
          width: width + 300,
          height: (width + 300) * (1024 / 1536),
        }}
      >
        <Img
          src={BG}
          style={{
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* FEMME PAYSANNE : arrière-plan (scale 4.5x = 288px), légèrement plus petite pour profondeur */}
      {frame >= 60 && (
        <WalkingSprite
          frames={WOMAN_EAST}
          x={womanX}
          scale={4.5}
          opacity={0.88}
        />
      )}

      {/* MOINE : marche vers la gauche */}
      <WalkingSprite
        frames={MONK_WEST}
        x={monkX}
        scale={5}
      />

      {/* PAYSAN : premier plan, pleine taille */}
      <WalkingSprite
        frames={PEASANT_EAST}
        x={peasantX}
        scale={5}
      />

      {/* VIGNETTE cinématique — réduite à 50% pour ne pas écraser l'image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(0,0,0,0.50) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
