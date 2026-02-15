import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  staticFile,
  spring,
  useVideoConfig,
} from "remotion";

const SPRITE_SHEET = staticFile(
  "assets/peste-pixel/sprites/plague-doctor/plague-doctor.png"
);
const BACKGROUND = staticFile(
  "assets/peste-pixel/backgrounds/style-B-stylise.png"
);

// Sprite sheet: 480x192, 15 columns x 6 rows = 32x32 per frame
// Row 0 = idle animation
const SHEET_COLS = 15;
const SHEET_ROWS = 6;
const FRAME_W = 32;
const FRAME_H = 32;
const DISPLAY_SCALE = 9; // 32 * 9 = 288px on screen

// --- SVG Silhouette components for "masses" approach ---
const Silhouette: React.FC<{
  x: number;
  y: number;
  scale: number;
  opacity: number;
  flip?: boolean;
  variant?: "standing" | "hunched" | "hooded";
}> = ({ x, y, scale, opacity, flip, variant = "standing" }) => {
  // Different silhouette shapes
  const paths: Record<string, string> = {
    standing:
      "M24,0 C28,0 32,4 32,10 C32,14 30,17 27,18 L30,35 C31,38 30,42 28,44 L28,58 L32,70 L28,72 L24,60 L20,72 L16,70 L20,58 L20,44 C18,42 17,38 18,35 L21,18 C18,17 16,14 16,10 C16,4 20,0 24,0 Z",
    hunched:
      "M20,4 C24,2 28,4 30,8 C32,12 30,16 28,18 L32,32 C34,36 32,40 28,42 L26,56 L30,68 L26,70 L22,58 L18,70 L14,68 L18,56 L16,42 C12,40 10,36 12,32 L16,18 C14,14 14,10 16,6 C17,4 18,4 20,4 Z",
    hooded:
      "M24,0 C30,0 34,6 34,12 C34,16 32,18 30,20 L28,22 C28,22 32,24 32,28 L34,38 C35,42 33,46 30,48 L28,60 L32,72 L28,74 L24,62 L20,74 L16,72 L20,60 L18,48 C15,46 13,42 14,38 L16,28 C16,24 20,22 20,22 L18,20 C16,18 14,16 14,12 C14,6 18,0 24,0 Z",
  };

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${flip ? -scale : scale}, ${scale})`}
      opacity={opacity}
    >
      <path
        d={paths[variant]}
        fill="rgba(5,5,10,0.85)"
        filter="url(#silhouetteBlur)"
      />
    </g>
  );
};

export const HD2DMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns
  const bgScale = interpolate(frame, [0, 150], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });
  const bgX = interpolate(frame, [0, 150], [0, -15], {
    extrapolateRight: "clamp",
  });

  // Sprite idle: cycle first 8 frames of row 0, at 6fps animation speed
  const IDLE_FRAMES = 8;
  const spriteCol = Math.floor(frame / 5) % IDLE_FRAMES;

  // Sprite gentle bob (breathing)
  const spriteBob = Math.sin(frame * 0.1) * 3;

  // Lantern glow
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.6]
  );

  // Data fade in
  const dataOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Death counter
  const deathCount = Math.floor(
    interpolate(frame, [30, 120], [0, 24867], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Silhouettes fade in from the fog
  const silhouetteOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Silhouettes subtle sway
  const sway1 = Math.sin(frame * 0.03) * 2;
  const sway2 = Math.sin(frame * 0.04 + 1) * 1.5;
  const sway3 = Math.sin(frame * 0.025 + 2) * 2.5;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a12" }}>
      {/* LAYER 1: Background with Ken Burns */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) translateX(${bgX}px)`,
        }}
      >
        <Img
          src={BACKGROUND}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* LAYER 1.5: Color grading */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,10,5,0.2) 0%, rgba(10,5,2,0.4) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* LAYER 1.6: Lantern glow */}
      <div
        style={{
          position: "absolute",
          left: "18%",
          top: "25%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,180,60,${glowIntensity}) 0%, rgba(255,140,20,${glowIntensity * 0.3}) 40%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 2A: Background silhouettes (the "masses") */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="silhouetteBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        {/* Far background silhouettes - small, faded */}
        <Silhouette
          x={750 + sway1}
          y={520}
          scale={3.5}
          opacity={silhouetteOpacity * 0.3}
          variant="hooded"
        />
        <Silhouette
          x={820 + sway2}
          y={525}
          scale={3.2}
          opacity={silhouetteOpacity * 0.25}
          variant="hunched"
          flip
        />
        <Silhouette
          x={880 + sway3}
          y={518}
          scale={3.8}
          opacity={silhouetteOpacity * 0.28}
          variant="standing"
        />
        {/* Mid-ground silhouettes - larger */}
        <Silhouette
          x={300 + sway2}
          y={600}
          scale={5}
          opacity={silhouetteOpacity * 0.5}
          variant="hunched"
        />
        <Silhouette
          x={380 + sway1}
          y={610}
          scale={4.5}
          opacity={silhouetteOpacity * 0.45}
          variant="hooded"
          flip
        />
        {/* Right side - stumbling figures */}
        <Silhouette
          x={1400 + sway3}
          y={590}
          scale={5.5}
          opacity={silhouetteOpacity * 0.4}
          variant="hunched"
          flip
        />
        <Silhouette
          x={1480 + sway1}
          y={605}
          scale={4.8}
          opacity={silhouetteOpacity * 0.35}
          variant="standing"
        />
      </svg>

      {/* LAYER 2B: Plague Doctor - single sprite frame, properly clipped */}
      <div
        style={{
          position: "absolute",
          left: "45%",
          bottom: `${16 + spriteBob * 0.2}%`,
          width: FRAME_W * DISPLAY_SCALE,
          height: FRAME_H * DISPLAY_SCALE,
          overflow: "hidden",
          imageRendering: "pixelated",
          filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(255,160,40,${glowIntensity * 0.2}))`,
          transform: `translateY(${spriteBob}px)`,
        }}
      >
        <Img
          src={SPRITE_SHEET}
          style={{
            position: "absolute",
            // Clip to single frame: shift left by column, shift up by row
            left: -(spriteCol * FRAME_W * DISPLAY_SCALE),
            top: 0, // Row 0 = idle
            width: 480 * DISPLAY_SCALE, // Full sheet width scaled
            height: 192 * DISPLAY_SCALE, // Full sheet height scaled
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* LAYER 2.5: Ground fog */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            "linear-gradient(0deg, rgba(12,15,25,0.75) 0%, rgba(12,15,25,0.3) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 3: Death counter */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          opacity: dataOpacity,
        }}
      >
        <div
          style={{
            background: "rgba(25,20,15,0.88)",
            border: "2px solid rgba(100,80,50,0.5)",
            padding: "14px 24px",
          }}
        >
          <div
            style={{
              color: "rgba(160,140,100,0.6)",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            Morts recenses
          </div>
          <div
            style={{
              color: "#c4392f",
              fontSize: 40,
              fontWeight: "bold",
              fontFamily: "monospace",
              letterSpacing: 2,
            }}
          >
            {deathCount.toLocaleString("fr-FR")}
          </div>
          <div
            style={{
              color: "rgba(140,120,80,0.4)",
              fontSize: 11,
              fontFamily: "monospace",
              marginTop: 4,
            }}
          >
            Marseille, 1347
          </div>
        </div>
      </div>

      {/* LAYER 3.5: Voiceover subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: dataOpacity,
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.65)",
            padding: "10px 28px",
            color: "rgba(220,210,190,0.9)",
            fontSize: 24,
            fontFamily: "Georgia, serif",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          {"Les rats ne tuent pas... c'est la PEUR qui tue en premier."}
        </div>
      </div>

      {/* LAYER 4: Post-process */}
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
          pointerEvents: "none",
        }}
      />

      {/* Scanlines */}
      <AbsoluteFill
        style={{
          opacity: 0.03,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
