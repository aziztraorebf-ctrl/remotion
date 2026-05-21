/**
 * TickerTapeHistory — bandeau teleScripteur historique -> moderne
 *
 * Timeline 90 frames :
 *   f0–40   : texte historique serif italique, ticker defilant
 *   f40–45  : flash lumineux sur ligne gold (glow pic)
 *   f45–50  : crossfade historique → commodites modernes
 *   f50–90  : commodites monospace gold, ticker continue
 *
 * Dates affichees aux extremites du bandeau :
 *   historicalYear jusqu'a f45, modernYear apres f45.
 */

import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";

export interface Commodity {
  name: string;
  price: string;
  trend: "up" | "down";
}

export interface TickerTapeHistoryProps {
  historicalText: string;
  historicalYear: number;
  modernYear: number;
  commodities: Commodity[];
  speed?: number;
}

const C = {
  bg: "#03224c",
  bgBand: "#021836",
  gold: "#b8893f",
  ivory: "#d4c5a0",
  terra: "#a05a3a",
  green: "#5aab6b",
} as const;

const BAND_HEIGHT = 280;

export const TickerTapeHistory: React.FC<TickerTapeHistoryProps> = ({
  historicalText,
  historicalYear,
  modernYear,
  commodities,
  speed = 2,
}) => {
  const frame = useCurrentFrame();

  const tickerX = frame * -speed;

  const historicalOpacity = interpolate(frame, [38, 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const modernOpacity = interpolate(frame, [45, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowBlur = interpolate(frame, [35, 45, 55], [0, 20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowOpacity = interpolate(frame, [35, 45, 55], [0, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentYear = frame < 45 ? historicalYear : modernYear;

  const commoditiesText = commodities
    .map((c) => `${c.name}  ${c.price}`)
    .join("     •     ");

  const lineGlowStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    background: C.gold,
    boxShadow: `0 0 ${4 + glowBlur * 1.5}px ${C.gold}, 0 0 ${glowBlur * 3}px rgba(184,137,63,0.4)`,
    opacity: 0.9,
  };

  const yearScale = interpolate(frame, [45, 58], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Annee en filigrane centree */}
      <div
        style={{
          color: C.ivory,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 280,
          fontWeight: 700,
          opacity: 0.09,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${yearScale})`,
          whiteSpace: "nowrap",
          letterSpacing: "-0.02em",
          pointerEvents: "none",
        }}
      >
        {currentYear}
      </div>

      {/* Ligne decorative haut */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% - 160px)",
          left: "10%",
          width: "80%",
          height: 1,
          background: C.gold,
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          height: BAND_HEIGHT,
          boxShadow: `0px -20px 50px rgba(184,137,63,${0.15 + glowOpacity * 0.2}), 0px 20px 50px rgba(184,137,63,${0.15 + glowOpacity * 0.2})`,
        }}
      >
        {/* Ligne gold haut */}
        <div style={{ ...lineGlowStyle, top: 0 }} />

        {/* Ligne gold bas */}
        <div style={{ ...lineGlowStyle, bottom: 0 }} />

        {/* Fond couleur */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            background: C.bgBand,
          }}
        />
        {/* Texture par-dessus */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            backgroundImage: `url(${staticFile("_shared/assets/templates-souverain/ticker-texture.png")})`,
            backgroundSize: "300px 300px",
            opacity: 0.15,
          }}
        />

        {/* Annee gauche */}
        <div
          style={{
            position: "absolute",
            left: 32,
            top: "50%",
            transform: "translateY(-50%)",
            color: C.ivory,
            fontFamily: "'Oswald', sans-serif",
            fontSize: 32,
            opacity: 0.7,
            zIndex: 10,
            letterSpacing: "0.05em",
          }}
        >
          {currentYear}
        </div>

        {/* Zone defilante */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            left: 160,
            right: 160,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "100%",
              width: "300%",
              transform: `translateX(${tickerX}px)`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Texte historique */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                whiteSpace: "nowrap",
                opacity: historicalOpacity * 0.8,
                color: C.ivory,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: 38,
                letterSpacing: "0.02em",
              }}
            >
              {historicalText}
            </div>

            {/* Texte commodites */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                whiteSpace: "nowrap",
                opacity: modernOpacity,
                display: "flex",
                alignItems: "center",
                gap: 0,
              }}
            >
              {commodities.map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Oswald', 'Arial Black', sans-serif",
                    fontSize: 40,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: C.gold,
                    marginRight: i < commodities.length - 1 ? 60 : 0,
                  }}
                >
                  <span style={{ color: C.gold }}>{c.name}</span>
                  <span
                    style={{
                      color: C.ivory,
                      fontWeight: 400,
                      marginLeft: 16,
                      marginRight: 8,
                    }}
                  >
                    {c.price}
                  </span>
                  <span
                    style={{
                      color: c.trend === "up" ? C.green : C.terra,
                      fontSize: 34,
                    }}
                  >
                    {c.trend === "up" ? "↑" : "↓"}
                  </span>
                </span>
              ))}
              {/* Repetition pour boucle visuelle */}
              {commodities.map((c, i) => (
                <span
                  key={`r${i}`}
                  style={{
                    fontFamily: "'Oswald', 'Arial Black', sans-serif",
                    fontSize: 40,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: C.gold,
                    marginLeft: i === 0 ? 60 : 0,
                    marginRight: i < commodities.length - 1 ? 60 : 0,
                  }}
                >
                  <span style={{ color: C.gold }}>{c.name}</span>
                  <span
                    style={{
                      color: C.ivory,
                      fontWeight: 400,
                      marginLeft: 16,
                      marginRight: 8,
                    }}
                  >
                    {c.price}
                  </span>
                  <span
                    style={{
                      color: c.trend === "up" ? C.green : C.terra,
                      fontSize: 34,
                    }}
                  >
                    {c.trend === "up" ? "↑" : "↓"}
                  </span>
                </span>
              ))}
            </div>
          </div>
          {/* Masque fondu extremites */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `linear-gradient(90deg, ${C.bgBand} 0%, transparent 12%, transparent 88%, ${C.bgBand} 100%)`,
              zIndex: 5,
            }}
          />
        </div>

        {/* Annee droite */}
        <div
          style={{
            position: "absolute",
            right: 32,
            top: "50%",
            transform: "translateY(-50%)",
            color: C.ivory,
            fontFamily: "'Oswald', sans-serif",
            fontSize: 32,
            opacity: 0.7,
            zIndex: 10,
            letterSpacing: "0.05em",
          }}
        >
          {currentYear}
        </div>
      </div>

      {/* Ligne decorative bas */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% + 160px)",
          left: "10%",
          width: "80%",
          height: 1,
          background: C.gold,
          opacity: 0.3,
        }}
      />

      {/* Sous-titre contextuel */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% + 190px)",
          width: "100%",
          textAlign: "center",
          color: C.ivory,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontSize: 32,
          opacity: interpolate(frame, [55, 70], [0, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {frame < 45 ? "Archives coloniales" : "Marches mondiaux"}
      </div>
    </AbsoluteFill>
  );
};

export const TICKER_TAPE_DEMO_FRAMES = 90;

export const TickerTapeHistoryDemo: React.FC = () => (
  <TickerTapeHistory
    historicalText="Depeche coloniale — Niamey, 12 mars 1905. Les territoires du Niger sont desormais places sous administration francaise. Les ressources du sous-sol appartiennent a la Republique."
    historicalYear={1905}
    modernYear={2024}
    commodities={[
      { name: "URANIUM", price: "$78/lb", trend: "up" },
      { name: "COBALT", price: "$34,000/ton", trend: "down" },
      { name: "OR", price: "$2,340/oz", trend: "up" },
      { name: "CACAO", price: "$3,240/ton", trend: "up" },
    ]}
  />
);
