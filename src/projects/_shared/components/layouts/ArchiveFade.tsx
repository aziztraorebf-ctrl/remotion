import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArchiveAnnotation {
  id: string;
  text: string;
  /** Fraction 0-1 — anchor point on the photo */
  anchorX: number;
  anchorY: number;
  /** Fraction 0-1 — label position */
  labelX: number;
  labelY: number;
  appearAtFrame: number;
}

export interface ArchiveFadeProps {
  /** Path passé à staticFile() */
  imageSrc: string;
  annotations: ArchiveAnnotation[];
  /** Ex: 'BERLIN · 1884' */
  stampLabel: string;
  stampDate: string;
  /** -1 = pas de colorisation */
  colorizeAtFrame?: number;
  startFrame?: number;
  durationFrames?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = "#c8a951";
const PATH_LENGTH = 150;

// ─── Arrow path helper ────────────────────────────────────────────────────────

function buildCubicPath(
  ax: number,
  ay: number,
  lx: number,
  ly: number
): string {
  // Control points: offset midway to create a slight curve
  const mx = (ax + lx) / 2;
  const my = (ay + ly) / 2;
  const cx1 = ax + (mx - ax) * 0.5;
  const cy1 = ay;
  const cx2 = lx;
  const cy2 = my;
  return `M ${ax} ${ay} C ${cx1} ${cy1} ${cx2} ${cy2} ${lx} ${ly}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const ArchiveFade: React.FC<ArchiveFadeProps> = ({
  imageSrc,
  annotations,
  stampLabel,
  stampDate,
  colorizeAtFrame = -1,
  startFrame = 0,
  durationFrames = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Photo fade in ──────────────────────────────────────────────────────────
  const photoProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 80, stiffness: 40 },
    durationInFrames: durationFrames,
  });
  const photoOpacity = interpolate(photoProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Colorize ───────────────────────────────────────────────────────────────
  const shouldColorize = colorizeAtFrame >= 0;
  const colorizeProgress = shouldColorize
    ? spring({
        frame: frame - colorizeAtFrame,
        fps,
        config: { damping: 60, stiffness: 25 },
        durationInFrames: durationFrames,
      })
    : 0;
  const grayscaleVal = interpolate(
    shouldColorize ? colorizeProgress : 0,
    [0, 1],
    [1, 0],
    { extrapolateRight: "clamp" }
  );
  const sepiaVal = interpolate(
    shouldColorize ? colorizeProgress : 0,
    [0, 1],
    [0.3, 0],
    { extrapolateRight: "clamp" }
  );

  // ── Grain animation ────────────────────────────────────────────────────────
  const grainFreq = 0.65 + Math.sin(frame * 0.4) * 0.015;

  // ── Stamp trigger frame ────────────────────────────────────────────────────
  const stampTriggerFrame =
    annotations.length > 0
      ? Math.max(...annotations.map((a) => a.appearAtFrame)) + 20
      : startFrame + 60;

  // ── Stamp appear ──────────────────────────────────────────────────────────
  const stampProgress = spring({
    frame: frame - stampTriggerFrame,
    fps,
    config: { damping: 70, stiffness: 55 },
    durationInFrames: durationFrames,
  });
  const stampScale = interpolate(stampProgress, [0, 1], [1.4, 1], {
    extrapolateRight: "clamp",
  });
  const stampOpacity = interpolate(stampProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Date fade ─────────────────────────────────────────────────────────────
  const dateProgress = spring({
    frame: frame - (stampTriggerFrame + 10),
    fps,
    config: { damping: 90, stiffness: 45 },
    durationInFrames: durationFrames,
  });
  const dateOpacity = interpolate(dateProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* ── Photo ── */}
      <AbsoluteFill
        style={{
          opacity: photoOpacity,
          filter: `grayscale(${grayscaleVal}) sepia(${sepiaVal})`,
        }}
      >
        <Img
          src={staticFile(imageSrc)}
          className="w-full h-full object-cover"
        />
      </AbsoluteFill>

      {/* ── Grain ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "overlay", opacity: 0.08 }}
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={grainFreq}
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      {/* ── Gradient ── */}
      <AbsoluteFill className="bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* ── SVG overlay — arrows ── */}
      <AbsoluteFill>
        <svg
          viewBox="0 0 1080 1920"
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="ah"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L8,3 L0,6 Z" fill={GOLD} />
            </marker>
          </defs>

          {annotations.map((ann) => {
            const arrowProgress = spring({
              frame: frame - ann.appearAtFrame,
              fps,
              config: { damping: 100, stiffness: 60 },
              durationInFrames: durationFrames,
            });
            const arrowProgressClamped = interpolate(
              arrowProgress,
              [0, 1],
              [0, 1],
              { extrapolateRight: "clamp" }
            );
            const dashOffset = interpolate(
              arrowProgressClamped,
              [0, 1],
              [PATH_LENGTH, 0],
              { extrapolateRight: "clamp" }
            );
            const showMarker = arrowProgressClamped >= 0.8;

            const ax = ann.anchorX * 1080;
            const ay = ann.anchorY * 1920;
            const lx = ann.labelX * 1080;
            const ly = ann.labelY * 1920;
            const pathD = buildCubicPath(ax, ay, lx, ly);

            return (
              <path
                key={ann.id}
                d={pathD}
                stroke={GOLD}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={PATH_LENGTH}
                strokeDashoffset={dashOffset}
                markerEnd={showMarker ? "url(#ah)" : undefined}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* ── Labels ── */}
      {annotations.map((ann) => {
        const labelProgress = spring({
          frame: frame - (ann.appearAtFrame + 8),
          fps,
          config: { damping: 80, stiffness: 50 },
          durationInFrames: durationFrames,
        });
        const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });
        const labelTranslateY = interpolate(labelProgress, [0, 1], [8, 0], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={ann.id}
            className="absolute font-mono text-ivory text-sm leading-tight"
            style={{
              left: `${ann.labelX * 100}%`,
              top: `${ann.labelY * 100}%`,
              opacity: labelOpacity,
              transform: `translateY(${labelTranslateY}px)`,
            }}
          >
            {ann.text}
          </div>
        );
      })}

      {/* ── Stamp zone ── */}
      <div className="absolute bottom-0 w-full px-8 pb-6">
        <div
          className="font-mono text-gold uppercase tracking-widest text-2xl"
          style={{
            opacity: stampOpacity,
            transform: `scale(${stampScale})`,
            transformOrigin: "left bottom",
          }}
        >
          {stampLabel}
        </div>
        <div
          className="font-mono text-slate text-base mt-1"
          style={{ opacity: dateOpacity }}
        >
          {stampDate}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ArchiveFade;
