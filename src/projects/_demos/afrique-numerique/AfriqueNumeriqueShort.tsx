import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BarRace } from "../../_shared/components/layouts/BarRace";
import { DualStat } from "../../_shared/components/layouts/DualStat";

// ─────────────────────────────────────────────────────────────────────────────
// AfriqueNumeriqueShort — Template C "L'Analyste"
// Pure data-viz Remotion. Zéro carte. Tous chiffres, BarRace, DualStat, overlays.
//
// Audio : public/_demos/afrique-numerique/audio/narration-v1.mp3 (86.08s)
// Voix  : Narratrice GéoAfrique V2 (z3gESu49naEZW8Af2Upm)
// Format : 1080×1920 vertical natif
// ─────────────────────────────────────────────────────────────────────────────

// Audio-anchored frames
export const F = {
  A1_START: 0,     // Hook
  A2_START: 240,   //  8.00s — BarRace Mobile Money
  A3_START: 1110,  // 37.00s — Pivot "Voici la rupture"
  A4_START: 1170,  // 39.00s — DualStat 85% vs 92%
  A5_START: 1680,  // 56.00s — Câbles sous-marins
  A6_START: 2400,  // 80.00s — Closing
  END:      2582,  // 86.08s
};

export const AFRIQUE_NUMERIQUE_SHORT_FRAMES = F.END;

const C = {
  navy:    "#0d1520",
  navyHi:  "#16213a",
  gold:    "#c8a951",
  goldHi:  "#e8c472",
  ivory:   "#f2ebd9",
  amber:   "#d4831f",
  rust:    "#8c2f1d",
  green:   "#5a8a3a",
  slate:   "rgba(242,235,217,0.65)",
};

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }

// ═══════════════════════════════════════════════════════════════════════════════
// FOND COMMUN — grille de points or subtile (signature Souverain)
// ═══════════════════════════════════════════════════════════════════════════════

const DotGridBackground: React.FC = () => (
  <AbsoluteFill style={{
    backgroundColor: C.navy,
    backgroundImage: "radial-gradient(rgba(200,169,81,0.10) 1.5px, transparent 1.5px)",
    backgroundSize: "30px 30px",
  }} />
);

// ═══════════════════════════════════════════════════════════════════════════════
// A1 — HOOK : $830B chiffre choc 9:16
// ═══════════════════════════════════════════════════════════════════════════════

const A1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
  const numberP = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 90 }, durationInFrames: 50 });
  const subP = spring({ frame: frame - 90, fps, config: { damping: 18 }, durationInFrames: 30 });
  const questP = spring({ frame: frame - 180, fps, config: { damping: 18 }, durationInFrames: 30 });

  // CountUp 0 → 830
  const countup = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 100, stiffness: 80 }, durationInFrames: 60 }),
    [0, 1], [0, 830]
  );

  return (
    <AbsoluteFill>
      <DotGridBackground />

      {/* Tag SOUVERAIN top */}
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0,
        textAlign: "center", opacity: titleP,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 24,
          color: C.gold, letterSpacing: 6, textTransform: "uppercase",
        }}>SOUVERAIN</div>
      </div>

      {/* Centre — chiffre choc */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* Context above */}
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 26,
          color: C.gold, letterSpacing: 5, textTransform: "uppercase",
          opacity: subP, marginBottom: 30,
        }}>L'Afrique numérique</div>

        {/* Big number */}
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 280, fontWeight: 700,
          color: C.goldHi, lineHeight: 1,
          opacity: numberP, transform: `scale(${0.85 + 0.15 * numberP})`,
        }}>
          ${Math.round(countup)}<span style={{ fontSize: 160 }}>B</span>
        </div>

        {/* Subline */}
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 32, fontStyle: "italic",
          color: C.slate, marginTop: 30, opacity: subP, textAlign: "center",
        }}>par an · une économie<br/>invisible</div>
      </AbsoluteFill>

      {/* Question bas */}
      <div style={{
        position: "absolute", bottom: 220, left: 60, right: 60,
        textAlign: "center", opacity: questP,
        transform: `translateY(${(1 - questP) * 30}px)`,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 44, fontWeight: 600,
          color: C.ivory, lineHeight: 1.2,
        }}>Qui la possède vraiment ?</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// A2 — BAR RACE Mobile Money
// ═══════════════════════════════════════════════════════════════════════════════

const A2BarRace: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.navy }}>
    <BarRace
      title="MOBILE MONEY"
      subtitle="utilisateurs actifs · 2024"
      data={[
        { label: "Safaricom",    value: 65,  suffix: "%" },
        { label: "MTN",          value: 110, suffix: "M" },
        { label: "Orange Money", value: 85,  suffix: "M" },
        { label: "Vodacom",      value: 62,  suffix: "M" },
        { label: "Airtel Money", value: 45,  suffix: "M" },
      ]}
      maxValue={110}
      bgColor="transparent"
    />
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════════════════════
// A3 — PIVOT "Voici la rupture" (transition 2s)
// ═══════════════════════════════════════════════════════════════════════════════

const A3Pivot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 25 });
  const lineP = spring({ frame: frame - 8, fps, config: { damping: 16 }, durationInFrames: 35 });

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      <DotGridBackground />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 22,
          color: C.gold, letterSpacing: 6, textTransform: "uppercase",
          opacity: p, marginBottom: 30,
        }}>RUPTURE</div>

        <div style={{
          fontFamily: "Georgia, serif", fontSize: 90, fontWeight: 700,
          color: C.ivory, lineHeight: 1.1,
          opacity: p, transform: `scale(${0.92 + 0.08 * p})`,
          textAlign: "center", padding: "0 60px",
        }}>Voici la<br/>rupture</div>

        {/* Underline draw */}
        <div style={{
          width: 280 * lineP, height: 3, background: C.gold,
          marginTop: 50,
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// A4 — DUAL STAT : 85% africain vs 92% américain
// ═══════════════════════════════════════════════════════════════════════════════

const A4DualStat: React.FC = () => (
  <DualStat
    title="LA RUPTURE"
    subtitle="Paiements vs Cloud · 2024"
    dividerStartFrame={20}
    entityA={{
      entity: "PAIEMENTS",
      stat:   "85%",
      label:  "africain",
      startFrame: 10,
      side:   "left",
    }}
    entityB={{
      entity: "CLOUD",
      stat:   "92%",
      label:  "américain",
      startFrame: 60,
      side:   "right",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// A5 — CÂBLES SOUS-MARINS : liste verticale animée
// ═══════════════════════════════════════════════════════════════════════════════

const A5Cables: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cables = [
    { name: "Meta",    cables: 4, color: C.gold },
    { name: "Google",  cables: 6, color: C.goldHi },
    { name: "Huawei",  cables: 7, color: C.rust },
  ];

  const titleP = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
  const subP = spring({ frame: frame - 240, fps, config: { damping: 18 }, durationInFrames: 30 });

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      <DotGridBackground />

      {/* Header */}
      <div style={{
        position: "absolute", top: 200, left: 60, right: 60,
        textAlign: "center", opacity: titleP,
        transform: `translateY(${(1 - titleP) * 20}px)`,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 24,
          color: C.gold, letterSpacing: 6, textTransform: "uppercase",
        }}>INFRASTRUCTURE</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 70, fontWeight: 700,
          color: C.ivory, marginTop: 16, lineHeight: 1.1,
        }}>Câbles<br/>sous-marins</div>
      </div>

      {/* Liste opérateurs */}
      <div style={{
        position: "absolute", top: 600, left: 60, right: 60,
        display: "flex", flexDirection: "column", gap: 40,
      }}>
        {cables.map((c, i) => {
          const delay = 60 + i * 50;
          const itemP = spring({ frame: frame - delay, fps, config: { damping: 16 }, durationInFrames: 30 });
          const widthP = spring({ frame: frame - delay - 10, fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 50 });
          return (
            <div key={c.name} style={{
              opacity: itemP, transform: `translateX(${(1 - itemP) * -40}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 700,
                  color: C.ivory,
                }}>{c.name}</div>
                <div style={{
                  fontFamily: "Georgia, serif", fontSize: 80, fontWeight: 700,
                  color: c.color, lineHeight: 1,
                }}>{c.cables}<span style={{ fontSize: 32, marginLeft: 8 }}>câbles</span></div>
              </div>
              {/* Barre proportion */}
              <div style={{ height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${widthP * (c.cables / 7) * 100}%`,
                  background: c.color, borderRadius: 3,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 180, left: 60, right: 60,
        textAlign: "center", opacity: subP,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 28, fontStyle: "italic",
          color: C.slate, lineHeight: 1.4,
        }}>7 câbles posés par la Chine<br/>2018 — 2024</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// A6 — CLOSING : question finale + signature
// ═══════════════════════════════════════════════════════════════════════════════

const A6Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p1 = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
  const p2 = spring({ frame: frame - 60, fps, config: { damping: 18 }, durationInFrames: 30 });
  const p3 = spring({ frame: frame - 120, fps, config: { damping: 18 }, durationInFrames: 30 });

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      <DotGridBackground />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 30, fontStyle: "italic",
          color: C.slate, opacity: p1, textAlign: "center",
          marginBottom: 40,
        }}>Posséder le téléphone<br/>ne suffit pas.</div>

        <div style={{
          fontFamily: "Georgia, serif", fontSize: 22,
          color: C.gold, letterSpacing: 6, textTransform: "uppercase",
          opacity: p2, marginBottom: 24,
        }}>LA VRAIE QUESTION</div>

        <div style={{
          fontFamily: "Georgia, serif", fontSize: 64, fontWeight: 600,
          color: C.ivory, opacity: p2,
          textAlign: "center", lineHeight: 1.2,
        }}>Qui possède<br/>l'autoroute ?</div>

        <div style={{
          marginTop: 100, opacity: p3,
          fontFamily: "Georgia, serif", fontSize: 22,
          color: C.gold, letterSpacing: 6, textTransform: "uppercase",
        }}>SOUVERAIN</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const AfriqueNumeriqueShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      {/* Narration */}
      <Audio src={staticFile("_demos/afrique-numerique/audio/narration-v1.mp3")} />

      {/* Musique kora */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3")}
        volume={(f) => {
          if (f < 60) return interpolate(f, [0, 60], [0, 0.16]);
          if (f > F.END - 60) return interpolate(f, [F.END - 60, F.END], [0.16, 0]);
          return 0.16;
        }}
      />

      <Sequence from={F.A1_START} durationInFrames={F.A2_START - F.A1_START}>
        <A1Hook />
      </Sequence>

      <Sequence from={F.A2_START} durationInFrames={F.A3_START - F.A2_START}>
        <A2BarRace />
      </Sequence>

      <Sequence from={F.A3_START} durationInFrames={F.A4_START - F.A3_START}>
        <A3Pivot />
      </Sequence>

      <Sequence from={F.A4_START} durationInFrames={F.A5_START - F.A4_START}>
        <A4DualStat />
      </Sequence>

      <Sequence from={F.A5_START} durationInFrames={F.A6_START - F.A5_START}>
        <A5Cables />
      </Sequence>

      <Sequence from={F.A6_START} durationInFrames={F.END - F.A6_START}>
        <A6Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
