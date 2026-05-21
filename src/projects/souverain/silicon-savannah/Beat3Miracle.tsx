import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn } from "../../_shared/animations";
import * as M from "./beat3/manifest";
import { SubtitleBar } from "./SubtitleBar";

const SUBTITLES = [
  { text: "Huit ans plus tard.",                                          start:   0, end:  36 },
  { text: "9 kényans sur 10 disposent d'un compte mobile monnaie actif", start:  44, end: 148 },
  { text: "— le taux le plus élevé au monde.",                           start: 163, end: 210 },
  { text: "300 000 points de paiement physique dans tout le pays.",       start: 233, end: 315 },
  { text: "Des kiosques, des épiceries, des pharmacies.",                 start: 333, end: 408 },
  { text: "Des familles séparées par des centaines de kilomètres",        start: 437, end: 514 },
  { text: "envoient de l'argent en seconde.",                             start: 511, end: 567 },
  { text: "C'était une révolution réelle.",                               start: 595, end: 643 },
];

const MUSIC_PATH = "souverain/silicon-savannah/audio/music/music-A.mp3";
const MUSIC_START_FROM = 724;

export const BEAT3_DURATION = M.DURATION_FRAMES;

const GOLD = "#c8a951";
const IVORY = "#f0e8d8";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function GrowthCurve({ progress, pingScale, pingOpacity }: {
  progress: number; pingScale: number; pingOpacity: number;
}) {
  const W = 960;
  const H = 360;
  const pts = Array.from({ length: 60 }, (_, i) => {
    const t = i / 59;
    return [t * W, H - Math.pow(t, 1.8) * H * 0.88];
  });

  const visibleCount = Math.floor(progress * pts.length);
  if (visibleCount < 2) return null;

  const visible = pts.slice(0, visibleCount);
  const d = visible.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const last = visible[visible.length - 1];

  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <defs>
        <filter id="glow-curve">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="curve-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity={0.28} />
          <stop offset="100%" stopColor={GOLD} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <path
        d={`${d} L ${last[0].toFixed(1)} ${H} L 0 ${H} Z`}
        fill="url(#curve-fill)"
      />
      <path d={d} stroke={GOLD} strokeWidth={5} fill="none" filter="url(#glow-curve)" />
      <line x1={0} y1={H} x2={W} y2={H} stroke={IVORY} strokeWidth={2} strokeOpacity={0.3} />
      {visibleCount > 5 && (
        <>
          <circle cx={last[0]} cy={last[1]} r={12 * pingScale} fill="none"
            stroke={GOLD} strokeWidth={2} opacity={pingOpacity} />
          <circle cx={last[0]} cy={last[1]} r={6} fill={GOLD} opacity={0.95} />
        </>
      )}
    </svg>
  );
}

// Badge stat flottant autour du Nokia
function StatBadge({ value, label, opacity, scale }: {
  value: string; label: string; opacity: number; scale: number;
}) {
  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      background: "#1a2845",
      border: `1.5px solid ${GOLD}55`,
      borderRadius: 12,
      padding: "14px 22px",
      textAlign: "center",
      boxShadow: `0 0 24px ${GOLD}22`,
      minWidth: 190,
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 52,
        color: GOLD,
        lineHeight: 1,
        letterSpacing: 2,
      }}>{value}</div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 20,
        color: IVORY,
        letterSpacing: 4,
        opacity: 0.75,
        marginTop: 4,
      }}>{label}</div>
    </div>
  );
}

export const Beat3Miracle: React.FC<{ globalMusic?: boolean; globalAudio?: boolean }> = ({ globalMusic = false, globalAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns fond
  const bgScale = interpolate(frame, [0, M.DURATION_FRAMES], [1.0, 1.08], CLAMP);
  const bgTranslateY = interpolate(frame, [0, M.DURATION_FRAMES], [0, -18], CLAMP);

  // --- ACTE 1 : courbe ---
  const curveProgress = interpolate(frame, [M.SEG.kenyans, M.SEG.points], [0, 1], CLAMP);
  const pctValue = Math.round(interpolate(frame, [M.SEG.kenyans, M.SEG.points - 10], [0, 91], CLAMP));

  const pctBounce = spring({ frame: frame - (M.SEG.points - 10), fps, config: { damping: 6, stiffness: 200 }, durationInFrames: 20 });
  const pctBounceScale = interpolate(pctBounce, [0, 1], [1, 1.06]);
  const pctSlowZoom = interpolate(frame, [M.SEG.kenyans, 240], [1.0, 1.05], CLAMP);

  const pingCycle = (frame - M.SEG.kenyans) % 30;
  const pingScale = interpolate(pingCycle, [0, 15, 29], [0.8, 1.6, 0.8]);
  const pingOpacity = interpolate(pingCycle, [0, 10, 29], [0.3, 0.9, 0.3]);

    // Bloc données — fade out à la transition
  const dataBlockOpacity = interpolate(frame, [240, 285], [1, 0], CLAMP);

  // --- TRANSITION : Nokia descend f=247→300 ---
  const nokiaEntry = spring({ frame: frame - 247, fps, config: { damping: 65, stiffness: 45 }, durationInFrames: 53 });
  const nokiaEntryY = interpolate(nokiaEntry, [0, 1], [-380, 0]);
  const nokiaOpacity = interpolate(frame, [247, 270], [0, 1], CLAMP);

  // Float permanent du Nokia
  const nokiaFloat = Math.sin((frame - 247) / 80) * 7;
  const nokiaRotate = Math.sin((frame - 247) / 28) * 4;
  const nokiaGlow = interpolate(Math.sin((frame - 247) / 10), [-1, 1], [8, 22]);
  // Grossissement final sur la phrase "révolution réelle" f=638
  const nokiaFinalScale = interpolate(
    spring({ frame: frame - 638, fps, config: { damping: 80, stiffness: 50 }, durationInFrames: 30 }),
    [0, 1], [1.0, 1.12]
  );

  // Ligne SVG Nokia → badge (opacité subtile)
  const linesOpacity = interpolate(frame, [290, 320], [0, 0.28], CLAMP);

  // --- ACTE 2 : badges autour du Nokia ---
  const BADGE_FRAMES = [M.SEG.points, M.SEG.familles, 440]; // f247, f440, f440+
  const badgeData = [
    { value: "300 000", label: "POINTS DE PAIEMENT" },
    { value: "50M+",    label: "UTILISATEURS" },
    { value: "1ER",     label: "MONDIAL" },
  ];
  // Positions relatives au Nokia (centre 540, 960)
  const badgePositions = [
    { top: 660,  left: 60  },  // haut-gauche
    { top: 1060, left: 660 },  // bas-droite
    { top: 640,  left: 660 },  // haut-droite
  ];

  const badgeAnimations = BADGE_FRAMES.map((startF, i) => {
    const s = spring({ frame: frame - startF, fps, config: { damping: 70, stiffness: 50 }, durationInFrames: 25 });
    return {
      opacity: interpolate(s, [0, 1], [0, 1], CLAMP),
      scale: interpolate(s, [0, 1], [0.7, 1], CLAMP),
    };
  });

  // Lignes SVG Nokia center → badge center (approximatif)
  const nokiaCenterX = 540;
  const nokiaCenterY = 960;
  const badgeCenterXs = [185, 755, 755];
  const badgeCenterYs = [720, 1120, 700];

  const subLabelOpacity = fadeIn(frame, M.SEG.kenyans, 20);

  return (
    <AbsoluteFill className="bg-navy overflow-hidden">
      {!globalAudio && <Audio src={staticFile(M.AUDIO)} />}
      {!globalMusic && <Audio src={staticFile(MUSIC_PATH)} startFrom={MUSIC_START_FROM} volume={0.07} />}

      {/* Fond Ken Burns */}
      <AbsoluteFill style={{ transform: `scale(${bgScale}) translateY(${bgTranslateY}px)` }}>
        <Img
          src={staticFile("souverain/silicon-savannah/beat3/bg.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
        />
      </AbsoluteFill>

      {/* Dégradé radial */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 55%, #1a3260 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── ACTE 1 : courbe + countUp ──────────────────────────────────────── */}
      <AbsoluteFill
        className="flex flex-col items-center justify-center"
        style={{ paddingTop: 560, paddingBottom: 160, opacity: dataBlockOpacity }}
      >
        <div style={{ opacity: fadeIn(frame, M.SEG.kenyans, 15) }}>
          <GrowthCurve progress={curveProgress} pingScale={pingScale} pingOpacity={pingOpacity} />
        </div>

        <div className="flex justify-between text-ivory" style={{
          width: 960, marginTop: 10, marginBottom: 40,
          fontFamily: "monospace", fontSize: 24,
          opacity: 0.4 * Math.min(1, curveProgress * 3),
        }}>
          <span>2007</span>
          <span>2025</span>
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 280, color: GOLD,
          lineHeight: 1, letterSpacing: 4, textAlign: "center", width: "100%",
          transform: `scale(${pctBounceScale * pctSlowZoom})`,
          transformOrigin: "center",
          textShadow: `0 0 80px ${GOLD}66, 0 0 160px ${GOLD}22`,
        }}>
          {pctValue}%
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 38, color: IVORY,
          letterSpacing: 6, textAlign: "center",
          opacity: subLabelOpacity * 0.8, marginTop: 8,
        }}>
          KENYANS AVEC M-PESA
        </div>
      </AbsoluteFill>

      {/* ── ACTE 2 : lignes Nokia → badges ──────────────────────────────────── */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: linesOpacity }}>
        <svg width="1080" height="1920" style={{ position: "absolute", top: 0, left: 0 }}>
          {badgeCenterXs.map((bx, i) => (
            <line key={i}
              x1={nokiaCenterX} y1={nokiaCenterY}
              x2={bx} y2={badgeCenterYs[i]}
              stroke={GOLD} strokeWidth={1} strokeDasharray="6 6"
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* ── NOKIA — centré verticalement, grand ──────────────────────────────── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${nokiaEntryY + nokiaFloat}px) rotate(${nokiaRotate}deg) scale(${nokiaFinalScale})`,
          opacity: nokiaOpacity,
          filter: `drop-shadow(0 0 ${nokiaGlow}px ${GOLD}66)`,
        }}>
          <Img
            src={staticFile("souverain/silicon-savannah/assets/nokia-hero.png")}
            style={{ width: 280, height: "auto", display: "block", opacity: 0.93 }}
          />
        </div>
      </AbsoluteFill>

      {/* ── BADGES autour du Nokia (ACTE 2) ─────────────────────────────────── */}
      {badgeData.map((badge, i) => (
        <AbsoluteFill key={i} style={{ pointerEvents: "none" }}>
          <div style={{
            position: "absolute",
            top: badgePositions[i].top,
            left: badgePositions[i].left,
          }}>
            <StatBadge
              value={badge.value}
              label={badge.label}
              opacity={badgeAnimations[i].opacity}
              scale={badgeAnimations[i].scale}
            />
          </div>
        </AbsoluteFill>
      ))}

      {/* Source */}
      <AbsoluteFill
        className="flex items-end justify-end"
        style={{ padding: "0 54px 80px", opacity: fadeIn(frame, M.SEG.points, 20) * 0.45 }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 20, color: IVORY }}>
          CAK 2025 · Safaricom 2025
        </span>
      </AbsoluteFill>

      <SubtitleBar lines={SUBTITLES} />
    </AbsoluteFill>
  );
};
