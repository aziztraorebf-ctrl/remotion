import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Pickaxe, Landmark, Factory, Ship, Flag, Diamond,
  Zap, Globe, Wheat, Fuel, Building2, Crown, Boxes,
  Network, Cpu, Droplets, Leaf, Sun, Wind, Mountain,
} from "lucide-react";

export type GridIcon =
  | "pickaxe" | "bank" | "factory" | "ship" | "flag" | "diamond"
  | "zap" | "globe" | "wheat" | "fuel" | "building" | "crown"
  | "boxes" | "network" | "cpu" | "water" | "leaf" | "sun" | "wind" | "mountain";

const ICONS: Record<GridIcon, React.FC<{ size: number; color: string }>> = {
  pickaxe: ({ size, color }) => <Pickaxe size={size} color={color} />,
  bank: ({ size, color }) => <Landmark size={size} color={color} />,
  factory: ({ size, color }) => <Factory size={size} color={color} />,
  ship: ({ size, color }) => <Ship size={size} color={color} />,
  flag: ({ size, color }) => <Flag size={size} color={color} />,
  diamond: ({ size, color }) => <Diamond size={size} color={color} />,
  zap: ({ size, color }) => <Zap size={size} color={color} />,
  globe: ({ size, color }) => <Globe size={size} color={color} />,
  wheat: ({ size, color }) => <Wheat size={size} color={color} />,
  fuel: ({ size, color }) => <Fuel size={size} color={color} />,
  building: ({ size, color }) => <Building2 size={size} color={color} />,
  crown: ({ size, color }) => <Crown size={size} color={color} />,
  boxes: ({ size, color }) => <Boxes size={size} color={color} />,
  network: ({ size, color }) => <Network size={size} color={color} />,
  cpu: ({ size, color }) => <Cpu size={size} color={color} />,
  water: ({ size, color }) => <Droplets size={size} color={color} />,
  leaf: ({ size, color }) => <Leaf size={size} color={color} />,
  sun: ({ size, color }) => <Sun size={size} color={color} />,
  wind: ({ size, color }) => <Wind size={size} color={color} />,
  mountain: ({ size, color }) => <Mountain size={size} color={color} />,
};

export interface GridItem {
  icon: GridIcon;
  stat: string;
  label: string;
}

export interface IconGridProps {
  title?: string;
  items?: GridItem[];
  cols?: 2;
  subtitle?: string;
  bgColor?: string;
}

const DEFAULT_ITEMS: GridItem[] = [
  { icon: "pickaxe", stat: "8.2M", label: "COBALT" },
  { icon: "bank", stat: "17.4B", label: "INVEST" },
  { icon: "factory", stat: "1 200", label: "EMPLOIS" },
  { icon: "ship", stat: "65%", label: "EXPORT" },
  { icon: "flag", stat: "38.1M", label: "TERRE" },
  { icon: "diamond", stat: "90%", label: "VALEUR" },
];

const GOLD = "#c8a951";
const SLATE = "#7a8ea0";
const IVORY = "#f5efe0";
const CARD_BG = "#111e2e";

export const IconGrid: React.FC<IconGridProps> = ({
  title = "RESSOURCES",
  items = DEFAULT_ITEMS,
  cols = 2,
  subtitle = "PRODUCTION",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(titleSpring, [0, 1], [-30, 0], { extrapolateRight: "clamp" });

  const footerSpring = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 70 } });
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const rows = Math.ceil(items.length / cols);
  const PAD_H = 70;
  const PAD_TOP = 240;
  const PAD_BOT = 200;
  const GAP = 32;
  const availableH = height - PAD_TOP - PAD_BOT;
  const availableW = width - PAD_H * 2;
  const cardW = (availableW - GAP * (cols - 1)) / cols;
  const cardH = (availableH - GAP * (rows - 1)) / rows;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(212,175,55,0.3) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Titre */}
      <div
        className="absolute left-0 right-0 text-center tracking-[0.22em] uppercase"
        style={{
          top: 100,
          fontSize: 72,
          color: GOLD,
          fontFamily: "Cinzel, serif",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </div>

      {/* Grille cartes */}
      <div
        className="absolute"
        style={{ top: PAD_TOP, left: PAD_H, right: PAD_H, bottom: PAD_BOT }}
      >
        {items.map((item, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cardDelay = 12 + i * 10;
          const cardSpring = spring({
            frame: frame - cardDelay,
            fps,
            config: { damping: 16, stiffness: 90 },
          });
          const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1], { extrapolateRight: "clamp" });

          const x = col * (cardW + GAP);
          const y = row * (cardH + GAP);
          const IconComp = ICONS[item.icon];

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center justify-center"
              style={{
                left: x,
                top: y,
                width: cardW,
                height: cardH,
                backgroundColor: CARD_BG,
                border: `1.5px solid rgba(200,169,81,0.55)`,
                borderRadius: 20,
                gap: 16,
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                transformOrigin: "center",
              }}
            >
              <IconComp size={64} color={GOLD} />
              <div
                className="text-center font-mono"
                style={{ fontSize: 62, color: IVORY, lineHeight: 1, letterSpacing: "0.02em" }}
              >
                {item.stat}
              </div>
              <div
                className="text-center font-mono uppercase tracking-widest"
                style={{ fontSize: 26, color: SLATE }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 80, gap: 16, opacity: footerOpacity }}
      >
        <div style={{ width: 340, height: 1, backgroundColor: GOLD, opacity: 0.45 }} />
        <div
          className="font-mono text-center tracking-widest uppercase"
          style={{ fontSize: 26, color: SLATE }}
        >
          {subtitle}
        </div>
      </div>

    </AbsoluteFill>
  );
};
