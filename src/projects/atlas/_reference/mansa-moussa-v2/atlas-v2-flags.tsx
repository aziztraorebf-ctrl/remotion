// Atlas V2 - Flag patterns for African countries.
// Two render modes:
//   - "stripes": SVG <pattern> with diagonal/horizontal/vertical bands (filling the country polygon)
//   - "mini": tiny rectangular flag icon overlaid at the country's capital
// Patterns respect official flag orientation (vertical/horizontal stripes).
import React from "react";

export type FlagOrientation = "vertical" | "horizontal" | "diagonal";

export interface FlagDef {
  iso: string;
  name: string;
  orientation: FlagOrientation; // official orientation
  colors: string[]; // ordered band colors (left-to-right or top-to-bottom)
  capital: [number, number]; // approx capital coords (lon, lat) for mini-flag overlay
}

// 18 African countries — official flag colors + orientation
export const AFRICAN_FLAGS: Record<string, FlagDef> = {
  MLI: {
    iso: "MLI",
    name: "Mali",
    orientation: "vertical",
    colors: ["#14B53A", "#FCD116", "#CE1126"],
    capital: [-7.99, 12.65], // Bamako
  },
  EGY: {
    iso: "EGY",
    name: "Egypte",
    orientation: "horizontal",
    colors: ["#CE1126", "#FFFFFF", "#000000"],
    capital: [31.24, 30.04],
  },
  MAR: {
    iso: "MAR",
    name: "Maroc",
    orientation: "horizontal",
    colors: ["#C1272D"],
    capital: [-6.83, 34.02],
  },
  SEN: {
    iso: "SEN",
    name: "Senegal",
    orientation: "vertical",
    colors: ["#00853F", "#FCD116", "#E31B23"],
    capital: [-17.45, 14.69],
  },
  GIN: {
    iso: "GIN",
    name: "Guinee",
    orientation: "vertical",
    colors: ["#CE1126", "#FCD116", "#009460"],
    capital: [-13.68, 9.64],
  },
  CIV: {
    iso: "CIV",
    name: "Cote d'Ivoire",
    orientation: "vertical",
    colors: ["#FF8200", "#FFFFFF", "#009E60"],
    capital: [-3.96, 5.32],
  },
  GHA: {
    iso: "GHA",
    name: "Ghana",
    orientation: "horizontal",
    colors: ["#CE1126", "#FCD116", "#006B3F"],
    capital: [-0.20, 5.60],
  },
  NGA: {
    iso: "NGA",
    name: "Nigeria",
    orientation: "vertical",
    colors: ["#008751", "#FFFFFF", "#008751"],
    capital: [7.49, 9.05],
  },
  ETH: {
    iso: "ETH",
    name: "Ethiopie",
    orientation: "horizontal",
    colors: ["#078930", "#FCDD09", "#DA121A"],
    capital: [38.74, 9.03],
  },
  KEN: {
    iso: "KEN",
    name: "Kenya",
    orientation: "horizontal",
    colors: ["#000000", "#BB0000", "#006600"],
    capital: [36.82, -1.29],
  },
  ZAF: {
    iso: "ZAF",
    name: "Afrique du Sud",
    orientation: "horizontal",
    colors: ["#007A4D", "#FFB81C", "#000C8A", "#DE3831"],
    capital: [28.19, -25.75],
  },
  TCD: {
    iso: "TCD",
    name: "Tchad",
    orientation: "vertical",
    colors: ["#002664", "#FECB00", "#C60C30"],
    capital: [15.05, 12.13],
  },
  NER: {
    iso: "NER",
    name: "Niger",
    orientation: "horizontal",
    colors: ["#E05206", "#FFFFFF", "#0DB02B"],
    capital: [2.12, 13.51],
  },
  BFA: {
    iso: "BFA",
    name: "Burkina Faso",
    orientation: "horizontal",
    colors: ["#EF2B2D", "#009E49"],
    capital: [-1.52, 12.37],
  },
  CMR: {
    iso: "CMR",
    name: "Cameroun",
    orientation: "vertical",
    colors: ["#007A5E", "#CE1126", "#FCD116"],
    capital: [11.50, 3.85],
  },
  DZA: {
    iso: "DZA",
    name: "Algerie",
    orientation: "vertical",
    colors: ["#006233", "#FFFFFF"],
    capital: [3.05, 36.75],
  },
  TUN: {
    iso: "TUN",
    name: "Tunisie",
    orientation: "horizontal",
    colors: ["#E70013"],
    capital: [10.18, 36.81],
  },
  LBY: {
    iso: "LBY",
    name: "Libye",
    orientation: "horizontal",
    colors: ["#E70013", "#000000", "#239E46"],
    capital: [13.19, 32.89],
  },
};

// =============================================================================
// FlagDefs - SVG <pattern> defs for each country to fill polygons with flag stripes
// Diagonal mode = bands at 45deg (stylise, lecture rapide)
// Official mode = respect vertical/horizontal orientation
// =============================================================================
export interface FlagDefsProps {
  mode?: "diagonal" | "official";
  bandWidth?: number; // px (in pattern units)
  opacity?: number;
}

export const AtlasFlagDefs: React.FC<FlagDefsProps> = ({
  mode = "official",
  bandWidth = 14,
  opacity = 1,
}) => {
  return (
    <defs>
      {Object.values(AFRICAN_FLAGS).map((flag) => {
        const totalWidth = bandWidth * flag.colors.length;
        // Pattern dimensions depend on orientation
        const isVertical = mode === "official" && flag.orientation === "vertical";
        const isHorizontal =
          mode === "official" && flag.orientation === "horizontal";
        const isDiagonal = mode === "diagonal";

        let pw: number;
        let ph: number;
        let patternTransform: string;

        if (isVertical) {
          pw = totalWidth;
          ph = bandWidth * 3; // arbitrary tall
          patternTransform = "rotate(0)";
        } else if (isHorizontal) {
          pw = bandWidth * 3;
          ph = totalWidth;
          patternTransform = "rotate(0)";
        } else {
          // diagonal
          pw = totalWidth;
          ph = bandWidth * 3;
          patternTransform = "rotate(45)";
        }

        return (
          <pattern
            key={`flag-${flag.iso}`}
            id={`flag-${flag.iso}`}
            patternUnits="userSpaceOnUse"
            width={pw}
            height={ph}
            patternTransform={patternTransform}
          >
            {flag.colors.map((color, i) => {
              if (isVertical || isDiagonal) {
                return (
                  <rect
                    key={i}
                    x={i * bandWidth}
                    y={0}
                    width={bandWidth}
                    height={ph}
                    fill={color}
                    opacity={opacity}
                  />
                );
              }
              // horizontal
              return (
                <rect
                  key={i}
                  x={0}
                  y={i * bandWidth}
                  width={pw}
                  height={bandWidth}
                  fill={color}
                  opacity={opacity}
                />
              );
            })}
          </pattern>
        );
      })}
    </defs>
  );
};

// Helper: get fill string for a country (use flag pattern if defined)
export const getFlagFill = (iso: string, fallback: string): string => {
  if (AFRICAN_FLAGS[iso]) return `url(#flag-${iso})`;
  return fallback;
};

// =============================================================================
// MiniFlag - small rectangular flag icon overlaid at capital
// =============================================================================
export interface AtlasMiniFlagProps {
  iso: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  showBorder?: boolean;
  showShadow?: boolean;
}

export const AtlasMiniFlag: React.FC<AtlasMiniFlagProps> = ({
  iso,
  x,
  y,
  width = 24,
  height = 16,
  showBorder = true,
  showShadow = true,
}) => {
  const flag = AFRICAN_FLAGS[iso];
  if (!flag) return null;

  const colors = flag.colors;
  const isVertical = flag.orientation === "vertical";
  const bandSize = isVertical ? width / colors.length : height / colors.length;

  return (
    <g transform={`translate(${x - width / 2} ${y - height / 2})`}>
      {showShadow && (
        <rect
          x={1.5}
          y={1.5}
          width={width}
          height={height}
          fill="#000000"
          opacity="0.4"
        />
      )}
      <g>
        {colors.map((color, i) => {
          if (isVertical) {
            return (
              <rect
                key={i}
                x={i * bandSize}
                y={0}
                width={bandSize}
                height={height}
                fill={color}
              />
            );
          }
          return (
            <rect
              key={i}
              x={0}
              y={i * bandSize}
              width={width}
              height={bandSize}
              fill={color}
            />
          );
        })}
      </g>
      {showBorder && (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1"
        />
      )}
    </g>
  );
};
