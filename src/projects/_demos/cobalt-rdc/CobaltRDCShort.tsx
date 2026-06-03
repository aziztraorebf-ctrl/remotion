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
import { OrAfricainStat } from "../../_shared/components/souverain-b/OrAfricainStat";
import { OrAfricainMapBeat } from "../../_shared/components/souverain-b/OrAfricainMapBeat";
import { OrAfricainQuote } from "../../_shared/components/souverain-b/OrAfricainQuote";

// ─────────────────────────────────────────────────────────────────────────────
// CobaltRDCShort — Template B "Hybride Or Africain" — premier test
//
// Démontre la flexibilité du template : 7 blocs narratifs qui appellent
// différents modes visuels selon leur fonction narrative, pas selon une
// structure imposée.
//
// Audio : public/_demos/cobalt-rdc/audio/narration-v1.mp3 (77.68s)
// Voix  : Narratrice GéoAfrique V2 (z3gESu49naEZW8Af2Upm)
// Format : 1080×1920 vertical
// ─────────────────────────────────────────────────────────────────────────────

export const F = {
  B1_START: 0,     //  0s    — Mapbox RDC isolée
  B2_START: 330,   // 11s    — Stat brutale "1 des plus pauvres"
  B3_START: 450,   // 15s    — Mapbox monde + 5 marques HQ
  B4_START: 840,   // 28s    — Stat 80% Chine
  B5_START: 1200,  // 40s    — Mapbox RDC + opérateurs miniers
  B6_START: 1620,  // 54s    — Stat dualité 45000$ vs 3%
  B7_START: 2010,  // 67s    — Quote closing
  END:      2330,  // 77.68s
};

export const COBALT_RDC_SHORT_FRAMES = F.END;

const COLORS = {
  yellow:    "#f4c534",
  yellowHi:  "#ffd84d",
  red:       "#e84a4a",
  ivory:     "#f2ebd9",
};

export const CobaltRDCShort: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Narration */}
      <Audio src={staticFile("_demos/cobalt-rdc/audio/narration-v1.mp3")} />

      {/* Musique kora */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3")}
        volume={(f) => {
          if (f < 60) return interpolate(f, [0, 60], [0, 0.16]);
          if (f > F.END - 60) return interpolate(f, [F.END - 60, F.END], [0.16, 0]);
          return 0.16;
        }}
      />

      {/* ── B1 — Mapbox RDC isolée plein écran (0-11s) ──────────────── */}
      <Sequence from={F.B1_START} durationInFrames={F.B2_START - F.B1_START}>
        <OrAfricainMapBeat
          countries={[
            { iso: "COD", color: COLORS.yellow, delayFrames: 10 },
          ]}
          camera={{
            lon: 23.0, lat: -2.0,
            zoom: 3.4, pitch: 15, bearing: 0,
          }}
          cameraDrift={{ bearingDelta: 4, durationFrames: 300 }}
          bandeauText="70% DU COBALT MONDIAL"
          bandeauHighlight="RDC"
        />
      </Sequence>

      {/* ── B2 — Stat brutale "L'un des plus pauvres au monde" (11-15s) ─ */}
      <Sequence from={F.B2_START} durationInFrames={F.B3_START - F.B2_START}>
        <OrAfricainStat
          value={164}
          prefix=""
          suffix=""
          topLabel="INDICE DÉVELOPPEMENT HUMAIN"
          subline="164ᵉ sur 191 pays · ONU 2023"
          bandeauText="LE PARADOXE"
          valueColor={COLORS.red}
          background="noir"
        />
      </Sequence>

      {/* ── B3 — Mapbox monde + 5 marques HQ (15-28s) ───────────────── */}
      <Sequence from={F.B3_START} durationInFrames={F.B4_START - F.B3_START}>
        <OrAfricainMapBeat
          countries={[
            { iso: "USA", color: COLORS.yellow, delayFrames: 10  },  // Tesla, Apple
            { iso: "KOR", color: COLORS.yellow, delayFrames: 30  },  // Samsung
            { iso: "DEU", color: COLORS.yellow, delayFrames: 50  },  // VW, BMW
            { iso: "COD", color: COLORS.red,    delayFrames: 80  },  // Source rouge
          ]}
          camera={{
            lon: 25.0, lat: 30.0,
            zoom: 1.4, pitch: 0, bearing: 0,
          }}
          cameraDrift={{ bearingDelta: 3, durationFrames: 390 }}
          bandeauText="MARQUES QUI DÉPENDENT DU CONGO"
          compteur={{ current: 5, total: 5 }}
        />
      </Sequence>

      {/* ── B4 — Stat brutale 80% (28-40s) ──────────────────────────── */}
      <Sequence from={F.B4_START} durationInFrames={F.B5_START - F.B4_START}>
        <OrAfricainStat
          value={80}
          suffix="%"
          topLabel="LA RUPTURE"
          subline="des mines de cobalt RDC aux mains de la Chine"
          bandeauText="CONTRÔLE CHINOIS"
          bandeauHighlight="DES MINES"
          valueColor={COLORS.yellowHi}
          background="noir"
        />
      </Sequence>

      {/* ── B5 — Mapbox RDC zoom + opérateurs (40-54s) ──────────────── */}
      <Sequence from={F.B5_START} durationInFrames={F.B6_START - F.B5_START}>
        <OrAfricainMapBeat
          countries={[
            { iso: "COD", color: COLORS.red,    delayFrames: 0  },
            { iso: "CHN", color: COLORS.yellow, delayFrames: 30 },
          ]}
          camera={{
            lon: 25.0, lat: 5.0,
            zoom: 2.0, pitch: 10, bearing: -10,
          }}
          cameraDrift={{ bearingDelta: 8, zoomDelta: 0.2, durationFrames: 420 }}
          bandeauText="OPÉRATEURS CHINOIS"
          compteur={{ current: 4, total: 5 }}
        />
      </Sequence>

      {/* ── B6 — DualStat 45 000$ vs 3% (54-67s) ────────────────────── */}
      <Sequence from={F.B6_START} durationInFrames={F.B7_START - F.B6_START}>
        <DualStatCobalt />
      </Sequence>

      {/* ── B7 — Quote closing (67-78s) ─────────────────────────────── */}
      <Sequence from={F.B7_START} durationInFrames={F.END - F.B7_START}>
        <OrAfricainQuote
          quote="Pour la ressource qui fait tourner toute l'économie verte du 21ᵉ siècle..."
          quoteHighlight="Combien de temps avant que ça change ?"
          signature="SOUVERAIN"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// B6 — DualStat custom : 45 000$ vs 3% (le punch contraste final)
// ═══════════════════════════════════════════════════════════════════════════════

const DualStatCobalt: React.FC = () => {
  // Réutiliser le composant DualStat existant — mais ici une version custom
  // qui met l'accent sur le contraste choc : prix marché mondial vs part RDC
  return (
    <AbsoluteFill style={{
      background: "#080a10",
      backgroundImage: "radial-gradient(rgba(244,197,52,0.05) 1.5px, transparent 1.5px)",
      backgroundSize: "30px 30px",
    }}>
      <Header />
      <SideA />
      <Divider />
      <SideB />
      <FooterBandeau />
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 25 });
  return (
    <div style={{
      position: "absolute", top: 130, left: 0, right: 0,
      textAlign: "center", opacity: p,
    }}>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 24,
        color: COLORS.yellow, letterSpacing: 6, textTransform: "uppercase",
      }}>LE CONTRASTE</div>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 50, fontWeight: 700,
        color: COLORS.ivory, marginTop: 12,
      }}>Pour 1 tonne extraite</div>
    </div>
  );
};

const SideA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 15, fps, config: { damping: 100, stiffness: 80 }, durationInFrames: 55 });
  const value = interpolate(p, [0, 1], [0, 45000], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 440, left: 0, right: 0,
      textAlign: "center", opacity: Math.min(1, p * 2),
    }}>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 22,
        color: COLORS.yellow, letterSpacing: 5, textTransform: "uppercase",
      }}>PRIX MARCHÉ MONDIAL</div>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 180, fontWeight: 700,
        color: COLORS.yellowHi, lineHeight: 1, marginTop: 20,
      }}>${Math.round(value).toLocaleString("fr-FR").replace(",", " ")}</div>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 28, fontStyle: "italic",
        color: "rgba(242,235,217,0.55)", marginTop: 10,
      }}>par tonne · 2024</div>
    </div>
  );
};

const Divider: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 30 });
  return (
    <div style={{
      position: "absolute", top: 880, left: "50%",
      transform: "translateX(-50%)",
      fontFamily: "Georgia, serif",
      fontSize: 60, color: "rgba(242,235,217,0.5)",
      opacity: p,
      letterSpacing: 8,
    }}>vs</div>
  );
};

const SideB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 90, fps, config: { damping: 100, stiffness: 80 }, durationInFrames: 55 });
  const value = interpolate(p, [0, 1], [0, 3], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 1020, left: 0, right: 0,
      textAlign: "center", opacity: Math.min(1, p * 2),
    }}>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 22,
        color: COLORS.red, letterSpacing: 5, textTransform: "uppercase",
      }}>PART RDC</div>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 280, fontWeight: 700,
        color: COLORS.red, lineHeight: 1, marginTop: 20,
        textShadow: `0 0 40px ${COLORS.red}44`,
      }}>{value.toFixed(0)}%</div>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 28, fontStyle: "italic",
        color: "rgba(242,235,217,0.55)", marginTop: 14,
      }}>du prix de vente</div>
    </div>
  );
};

const FooterBandeau: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 180, fps, config: { damping: 14 }, durationInFrames: 25 });
  return (
    <div style={{
      position: "absolute", bottom: 100, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      transform: `scale(${0.92 + 0.08 * p}) translateY(${(1 - p) * 25}px)`,
      opacity: p,
    }}>
      <div style={{
        background: "#0a0e16",
        border: `2px solid ${COLORS.yellow}`,
        padding: "22px 50px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 700,
          color: COLORS.yellow, letterSpacing: 3, textTransform: "uppercase",
          textAlign: "center",
        }}>LE VRAI PARTAGE</div>
      </div>
    </div>
  );
};
