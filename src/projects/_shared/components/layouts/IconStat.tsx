import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Smartphone, Diamond, Coins, Zap, Globe, Pickaxe, Landmark,
  Factory, Ship, Flag, Wheat, Fuel, Building2, Crown, TrendingUp,
  Users, DollarSign, BarChart3, Wifi, Battery,
} from "lucide-react";

export type StatIcon =
  | "smartphone" | "diamond" | "coins" | "zap" | "globe" | "pickaxe"
  | "bank" | "factory" | "ship" | "flag" | "wheat" | "fuel" | "building"
  | "crown" | "trending" | "users" | "dollar" | "chart" | "wifi" | "battery";

const ICONS: Record<StatIcon, React.FC<{ size: number; color: string }>> = {
  smartphone: ({ size, color }) => <Smartphone size={size} color={color} />,
  diamond: ({ size, color }) => <Diamond size={size} color={color} />,
  coins: ({ size, color }) => <Coins size={size} color={color} />,
  zap: ({ size, color }) => <Zap size={size} color={color} />,
  globe: ({ size, color }) => <Globe size={size} color={color} />,
  pickaxe: ({ size, color }) => <Pickaxe size={size} color={color} />,
  bank: ({ size, color }) => <Landmark size={size} color={color} />,
  factory: ({ size, color }) => <Factory size={size} color={color} />,
  ship: ({ size, color }) => <Ship size={size} color={color} />,
  flag: ({ size, color }) => <Flag size={size} color={color} />,
  wheat: ({ size, color }) => <Wheat size={size} color={color} />,
  fuel: ({ size, color }) => <Fuel size={size} color={color} />,
  building: ({ size, color }) => <Building2 size={size} color={color} />,
  crown: ({ size, color }) => <Crown size={size} color={color} />,
  trending: ({ size, color }) => <TrendingUp size={size} color={color} />,
  users: ({ size, color }) => <Users size={size} color={color} />,
  dollar: ({ size, color }) => <DollarSign size={size} color={color} />,
  chart: ({ size, color }) => <BarChart3 size={size} color={color} />,
  wifi: ({ size, color }) => <Wifi size={size} color={color} />,
  battery: ({ size, color }) => <Battery size={size} color={color} />,
};

export interface IconStatProps {
  topLabel?: string;
  icon?: StatIcon;
  stat?: string;
  contextLabel?: string;
  subtitle?: string;
}

const GOLD = "#dfb65b";
const SLATE = "#76869e";
const IVORY = "#f2ebd9";

export const IconStat: React.FC<IconStatProps> = ({
  topLabel = "M-PESA",
  icon = "smartphone",
  stat = "67%",
  contextLabel = "ADOPTION",
  subtitle = "KENYA · 2024",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const entryY = interpolate(entrySpring, [0, 1], [-30, 0], { extrapolateRight: "clamp" });

  // Icône : scale-in avec léger overshoot
  const iconSpring = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 70 } });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Glow pulse continu
  const glowPulse = Math.sin((frame / 30) * Math.PI) * 0.3 + 0.5;

  // Stat : countUp simulé (scale de 0 à 1)
  const statSpring = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 60 } });
  const statOpacity = interpolate(statSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const statScale = interpolate(statSpring, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });

  // Context + footer
  const ctxSpring = spring({ frame: frame - 28, fps, config: { damping: 18, stiffness: 80 } });
  const ctxOpacity = interpolate(ctxSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const IconComp = ICONS[icon];
  const ICON_SIZE = 280;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b121f" }}>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(223,182,91,0.22) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Top label */}
      <div
        className="absolute left-0 right-0 text-center tracking-[0.32em] uppercase"
        style={{
          top: 120,
          fontSize: 44,
          color: GOLD,
          fontFamily: "Cinzel, serif",
          opacity: entryOpacity,
          transform: `translateY(${entryY}px)`,
        }}
      >
        {topLabel}
      </div>

      {/* Zone centrale — icône + séparateur + stat */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: "18%", gap: 0 }}
      >
        {/* Séparateur haut */}
        <div
          style={{
            width: 700,
            height: 1,
            backgroundColor: GOLD,
            opacity: entryOpacity * 0.6,
            marginBottom: 80,
          }}
        />

        {/* Icône avec glow */}
        <div
          className="flex items-center justify-center"
          style={{
            width: ICON_SIZE + 80,
            height: ICON_SIZE + 80,
            opacity: iconScale,
            transform: `scale(${iconScale})`,
            position: "relative",
            marginBottom: 60,
          }}
        >
          {/* Glow background */}
          <div
            className="absolute"
            style={{
              width: ICON_SIZE + 80,
              height: ICON_SIZE + 80,
              borderRadius: "50%",
              backgroundColor: `rgba(223,182,91,${glowPulse * 0.18})`,
              filter: "blur(30px)",
            }}
          />
          <IconComp size={ICON_SIZE} color={GOLD} />
        </div>

        {/* Séparateur bas */}
        <div
          style={{
            width: 700,
            height: 1,
            backgroundColor: GOLD,
            opacity: entryOpacity * 0.6,
            marginBottom: 60,
          }}
        />

        {/* Stat centrale */}
        <div
          style={{
            fontSize: 260,
            color: IVORY,
            fontFamily: "Cinzel, serif",
            lineHeight: 1,
            opacity: statOpacity,
            transform: `scale(${statScale})`,
            letterSpacing: "-0.02em",
          }}
        >
          {stat}
        </div>

        {/* Context label */}
        <div
          className="font-mono uppercase tracking-[0.28em]"
          style={{
            fontSize: 48,
            color: SLATE,
            marginTop: 24,
            opacity: ctxOpacity,
          }}
        >
          {contextLabel}
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 100, gap: 18, opacity: ctxOpacity }}
      >
        <div style={{ width: 320, height: 1, backgroundColor: GOLD, opacity: 0.4 }} />
        <div
          className="font-mono text-center tracking-widest uppercase"
          style={{ fontSize: 28, color: SLATE }}
        >
          {subtitle}
        </div>
      </div>

    </AbsoluteFill>
  );
};
