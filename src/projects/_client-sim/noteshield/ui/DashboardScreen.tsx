import React from "react";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadIBMPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { NS_COLORS, NS_RADII } from "./theme";

const { fontFamily: spaceGroteskFamily } = loadSpaceGrotesk("normal", { weights: ["500", "600", "700"] });
const { fontFamily: ibmPlexMonoFamily } = loadIBMPlexMono("normal", { weights: ["400", "500"] });

const NS_FONTS = {
  display: spaceGroteskFamily,
  mono: ibmPlexMonoFamily,
} as const;

/**
 * DashboardScreen — écran UI fictif NorthShield (référence visuelle statique, PAS encore animée).
 * Sert de matière finale pour le brief storyboard (règle projet : matière finale AVANT le code
 * d'animation) et de référence visuelle pour les modèles Direction A/B.
 *
 * 2 cas fournis par le brief client, réutilisés tels quels :
 *   - bas risque  : Sarah M. | MacBook Pro | Toronto  | 18/100 | Autorisé
 *   - haut risque : Sarah M. | Appareil inconnu | Berlin | 82/100 | Vérification requise
 */

type RiskCase = "low" | "high";

const CASES: Record<
  RiskCase,
  {
    user: string;
    device: string;
    location: string;
    score: number;
    action: string;
    accent: string;
    time: string;
  }
> = {
  low: {
    user: "Sarah M.",
    device: "MacBook Pro",
    location: "Toronto, CA",
    score: 18,
    action: "Autorisé",
    accent: NS_COLORS.green,
    time: "09:14",
  },
  high: {
    user: "Sarah M.",
    device: "Appareil inconnu",
    location: "Berlin, DE",
    score: 82,
    action: "Vérification requise",
    accent: NS_COLORS.red,
    time: "12:47",
  },
};

// Lignes de contexte (bruit visuel réaliste autour de la ligne mise en avant).
const CONTEXT_ROWS = [
  { user: "David K.", device: "iPhone 15", location: "Toronto, CA", score: 6, action: "Autorisé", time: "08:02" },
  { user: "Amina T.", device: "ThinkPad X1", location: "Montréal, CA", score: 22, action: "Autorisé", time: "08:41" },
  { user: "Marc L.", device: "MacBook Air", location: "Toronto, CA", score: 14, action: "Autorisé", time: "08:57" },
];

function riskColor(score: number): string {
  if (score < 40) return NS_COLORS.green;
  if (score < 70) return NS_COLORS.amber;
  return NS_COLORS.red;
}

function ScoreGauge({ score, accent, size = 64 }: { score: number; accent: string; size?: number }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={NS_COLORS.navyPanel}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + size * 0.09}
        textAnchor="middle"
        fill={NS_COLORS.ivory}
        fontFamily={NS_FONTS.mono}
        fontSize={size * 0.28}
        fontWeight={600}
      >
        {score}
      </text>
    </svg>
  );
}

function ActionPill({ action, accent }: { action: string; accent: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 16px",
        borderRadius: NS_RADII.pill,
        background: `${accent}22`,
        border: `1px solid ${accent}66`,
        color: accent,
        fontFamily: NS_FONTS.display,
        fontSize: 15,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />
      {action}
    </div>
  );
}

function Row({
  user,
  device,
  location,
  score,
  action,
  time,
  highlighted = false,
}: {
  user: string;
  device: string;
  location: string;
  score: number;
  action: string;
  time: string;
  highlighted?: boolean;
}) {
  const accent = riskColor(score);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1.3fr 1.3fr 1.1fr 100px 1.4fr",
        alignItems: "center",
        padding: "32px 28px",
        borderRadius: NS_RADII.card,
        background: highlighted ? NS_COLORS.navyPanel : "transparent",
        border: highlighted ? `1px solid ${NS_COLORS.cyanDim}` : "1px solid transparent",
        boxShadow: highlighted ? `0 0 32px ${accent}22` : "none",
      }}
    >
      <div style={{ fontFamily: NS_FONTS.mono, color: NS_COLORS.ivoryMuted, fontSize: 16 }}>{time}</div>
      <div style={{ fontFamily: NS_FONTS.display, color: NS_COLORS.ivory, fontSize: 24, fontWeight: 600 }}>
        {user}
      </div>
      <div style={{ fontFamily: NS_FONTS.mono, color: NS_COLORS.ivoryMuted, fontSize: 17 }}>{device}</div>
      <div style={{ fontFamily: NS_FONTS.mono, color: NS_COLORS.ivoryMuted, fontSize: 17 }}>{location}</div>
      <ScoreGauge score={score} accent={accent} size={highlighted ? 76 : 56} />
      <div style={{ justifySelf: "start" }}>
        <ActionPill action={action} accent={accent} />
      </div>
    </div>
  );
}

type RowOverride = {
  user: string;
  time: string;
  device: string;
  location: string;
  score: number;
  action: string;
};

export const DashboardScreen: React.FC<{ riskCase: RiskCase; overrideRow?: RowOverride }> = ({
  riskCase,
  overrideRow,
}) => {
  const data = overrideRow ?? CASES[riskCase];

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: NS_COLORS.navyDeep,
        fontFamily: NS_FONTS.display,
        padding: "0 96px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${NS_COLORS.cyan}, ${NS_COLORS.navyPanel})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: NS_FONTS.display,
              fontWeight: 700,
              color: NS_COLORS.navyDeep,
              fontSize: 20,
            }}
          >
            N
          </div>
          <div style={{ color: NS_COLORS.ivory, fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>
            NorthShield
          </div>
          <div
            style={{
              marginLeft: 12,
              color: NS_COLORS.ivoryMuted,
              fontFamily: NS_FONTS.mono,
              fontSize: 16,
            }}
          >
            Activité de connexion
          </div>
        </div>
        <div
          style={{
            fontFamily: NS_FONTS.mono,
            fontSize: 14,
            color: NS_COLORS.ivoryMuted,
            padding: "8px 18px",
            border: `1px solid ${NS_COLORS.navyPanel}`,
            borderRadius: NS_RADII.pill,
          }}
        >
          Admin IT — Vue en temps réel
        </div>
      </div>

      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "90px 1.3fr 1.3fr 1.1fr 100px 1.4fr",
          padding: "0 28px 20px 28px",
          borderBottom: `1px solid ${NS_COLORS.navyPanel}`,
          marginBottom: 20,
          fontFamily: NS_FONTS.mono,
          fontSize: 14,
          letterSpacing: 1.5,
          color: NS_COLORS.ivoryMuted,
          textTransform: "uppercase",
        }}
      >
        <div>Heure</div>
        <div>Utilisateur</div>
        <div>Appareil</div>
        <div>Emplacement</div>
        <div>Score</div>
        <div>Action</div>
      </div>

      {/* Rows: context rows above, highlighted case row, then a couple more context rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CONTEXT_ROWS.slice(0, 2).map((r) => (
          <Row key={r.user + r.time} {...r} />
        ))}
        <Row
          user={data.user}
          device={data.device}
          location={data.location}
          score={data.score}
          action={data.action}
          time={data.time}
          highlighted
        />
        {CONTEXT_ROWS.slice(2).map((r) => (
          <Row key={r.user + r.time} {...r} />
        ))}
      </div>
    </div>
  );
};
