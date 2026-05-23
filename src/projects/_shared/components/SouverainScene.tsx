/**
 * SouverainScene — composant racine composable pour templates 16:9 Souverain.
 *
 * Stack de couches :
 *   Layer 0  — background (variant nommé | hex brut | url: PNG | transparent)
 *   Layer 1  — carte Mapbox optionnelle (prop `mapLayer`)
 *   Layer 2  — vignette optionnelle
 *   Layer 3+ — children (templates transparents par défaut)
 *
 * Backgrounds dark CSS (zéro image, production-ready) :
 *   "dark-dots-navy"   — #1a2535 + dot grid doré  (style Niger Uranium)
 *   "dark-dots-brown"  — #2d2015 + dot grid ivoire (style Or Africain)
 *   "kraft-dark"       — #1e1a12 grain papier sombre
 *   "slate-medium"     — #252d3a neutre lumineux
 *   "paper-warm-dark"  — bg-papier-ancien.png + overlay sombre
 *
 * Backgrounds Gemini PNG (assets statiques) :
 *   "papier-ancien" | "cosmos-atlas3d" | "plateau-awale" | "beton-architectural"
 *
 * KraftCard variants (clair) :
 *   "kraft" | "slate" | "ivoire"
 *
 * Usage :
 *   <SouverainScene background="dark-dots-navy">
 *     <OdometerFlip toValue="100000" label="BARILS" />
 *   </SouverainScene>
 */

import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { KraftCardBackground, KraftBgVariant } from "./inserts/KraftCardBackground";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DarkCssBg =
  | "dark-dots-navy"
  | "dark-dots-brown"
  | "kraft-dark"
  | "slate-medium"
  | "paper-warm-dark";

export type GeminiBg =
  | "papier-ancien"
  | "cosmos-atlas3d"
  | "plateau-awale"
  | "beton-architectural";

export type SouverainBg =
  | KraftBgVariant
  | DarkCssBg
  | GeminiBg
  | "transparent"
  | `#${string}`
  | `url:${string}`;

// ─── Registres ────────────────────────────────────────────────────────────────

const KRAFT_VARIANTS: KraftBgVariant[] = ["kraft", "slate", "ivoire"];

const GEMINI_BG_MAP: Record<GeminiBg, string> = {
  "papier-ancien":       "_shared/backgrounds/bg-papier-ancien.png",
  "cosmos-atlas3d":      "_shared/backgrounds/bg-cosmos-atlas3d.png",
  "plateau-awale":       "_shared/backgrounds/bg-plateau-awale.png",
  "beton-architectural": "_shared/backgrounds/bg-beton-architectural.png",
};

const DARK_CSS_BG_MAP: Record<DarkCssBg, React.CSSProperties> = {
  "dark-dots-navy": {
    backgroundColor: "#1a2535",
    backgroundImage: "radial-gradient(rgba(200,169,81,0.12) 1.5px, transparent 1.5px)",
    backgroundSize: "28px 28px",
  },
  "dark-dots-brown": {
    backgroundColor: "#2d2015",
    backgroundImage: "radial-gradient(rgba(242,235,217,0.08) 1.5px, transparent 1.5px)",
    backgroundSize: "24px 24px",
  },
  "kraft-dark": {
    backgroundColor: "#1e1a12",
    backgroundImage: [
      "radial-gradient(rgba(196,168,130,0.06) 1px, transparent 1px)",
      "radial-gradient(rgba(196,168,130,0.03) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: "18px 18px, 6px 6px",
    backgroundPosition: "0 0, 9px 9px",
  },
  "slate-medium": {
    backgroundColor: "#252d3a",
    backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  },
  "paper-warm-dark": {
    backgroundColor: "#1a1208",
  },
};

// ─── Guards ───────────────────────────────────────────────────────────────────

const isKraftVariant = (bg: SouverainBg): bg is KraftBgVariant =>
  KRAFT_VARIANTS.includes(bg as KraftBgVariant);

const isDarkCssBg = (bg: SouverainBg): bg is DarkCssBg =>
  bg in DARK_CSS_BG_MAP;

const isGeminiBg = (bg: SouverainBg): bg is GeminiBg =>
  bg in GEMINI_BG_MAP;

const isUrlBg = (bg: SouverainBg): bg is `url:${string}` =>
  bg.startsWith("url:");

// ─── Composant ───────────────────────────────────────────────────────────────

type Props = {
  background?: SouverainBg;
  mapLayer?: React.ReactNode;
  children?: React.ReactNode;
  vignette?: boolean;
};

export const SouverainScene: React.FC<Props> = ({
  background = "transparent",
  mapLayer,
  children,
  vignette = false,
}) => {
  const renderBackground = () => {
    if (background === "transparent") return null;

    if (isKraftVariant(background)) {
      return <KraftCardBackground variant={background} />;
    }

    if (isDarkCssBg(background)) {
      const style = DARK_CSS_BG_MAP[background];

      if (background === "paper-warm-dark") {
        return (
          <AbsoluteFill style={style}>
            <Img
              src={staticFile("_shared/backgrounds/bg-papier-ancien.png")}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                mixBlendMode: "multiply",
                opacity: 0.35,
              }}
            />
          </AbsoluteFill>
        );
      }

      return <AbsoluteFill style={style} />;
    }

    if (isGeminiBg(background)) {
      return (
        <AbsoluteFill style={{ backgroundColor: "#0d1420" }}>
          <Img
            src={staticFile(GEMINI_BG_MAP[background])}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );
    }

    if (isUrlBg(background)) {
      return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <Img
            src={staticFile(background.slice(4))}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );
    }

    return <AbsoluteFill style={{ backgroundColor: background }} />;
  };

  return (
    <AbsoluteFill>
      {renderBackground()}

      {mapLayer && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {mapLayer}
        </AbsoluteFill>
      )}

      {vignette && (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {children && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {children}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
