// GeoCountryPlaque.tsx — Plaque pays épurée (nom + stat + SOURCE) + compteur optionnel
// Extrait et généralisé de Or Africain Beat4 (CountryCard) — validé Aziz 2026-06-03.
//
// QUAND L'UTILISER (complément aux dots, PAS un remplaçant) :
//   - Quand on veut AFFICHER UNE SOURCE directement ("Bloomberg, nov. 2025")
//   - Quand on annonce un pays avec une donnée chiffrée de façon épurée
//   - Alternative élégante à "tout jeter sur la carte" (dots + labels partout)
//
// 2 modes de placement :
//   - `position="top"` (défaut) : plaque centrée en haut, comme Or Africain
//   - `coord=[lon,lat]` + map : plaque ancrée géo via map.project() (au-dessus du pays)
//
// Structure : pilule NOM (monospace, bordure couleur) + encart STAT (serif gold + glow)
//             + sous-texte SOURCE (monospace petit). Apparition fadeIn + slideY.

import React from "react";
import { interpolate } from "remotion";

const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const WHITE = "#ffffff";

export interface GeoCountryPlaqueProps {
  // Frame local (déjà relatif au beat)
  frame: number;
  // Nom affiché dans la pilule (ex: "MALI")
  name: string;
  // Couleur d'accent (bordure pilule, stat, glow) — souvent la couleur du pays sur la carte
  color?: string;
  // Stat principale (ex: "$430M", "70%", "100% nationalisé")
  stat?: string;
  // Source / sous-texte (ex: "saisis à Barrick — Bloomberg, nov. 2025")
  source?: string;
  // Fenêtre d'affichage [début, fin] en frames locales
  appearAt: number;
  hideAt: number;
  // Durée du fade in/out (défaut 10f)
  fadeFrames?: number;
  // Placement : "top" (centré haut) ou position absolue via map.project (pos {x,y})
  pos?: { x: number; y: number } | null;
  // Offset vertical du placement "top" (défaut 220)
  topOffset?: number;
  // Taille de la stat (auto selon présence source)
  zIndex?: number;
}

export const GeoCountryPlaque: React.FC<GeoCountryPlaqueProps> = ({
  frame,
  name,
  color = GOLD,
  stat,
  source,
  appearAt,
  hideAt,
  fadeFrames = 10,
  pos = null,
  topOffset = 220,
  zIndex = 25,
}) => {
  if (frame < appearAt || frame >= hideAt) return null;
  if (pos === undefined) return null; // pos explicitement null = mode top ; undefined = pas prêt

  const localFrame = frame - appearAt;
  const fadeIn  = interpolate(localFrame, [0, fadeFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [hideAt - fadeFrames, hideAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const slideY  = interpolate(localFrame, [0, fadeFrames + 4], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Placement : géo-ancré (pos) ou centré haut
  const wrapperStyle: React.CSSProperties = pos
    ? {
        position: "absolute",
        left: pos.x,
        top: pos.y - 120,
        transform: `translate(-50%, ${slideY}px)`,
        opacity,
        textAlign: "center",
        zIndex,
        pointerEvents: "none",
      }
    : {
        position: "absolute",
        top: topOffset,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${slideY}px)`,
        zIndex,
        pointerEvents: "none",
      };

  return (
    <div style={wrapperStyle}>
      {/* Pilule NOM */}
      <div
        style={{
          display: "inline-block",
          background: "rgba(0,0,0,0.78)",
          border: `2px solid ${color}`,
          borderRadius: 10,
          padding: "12px 28px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 36,
          fontWeight: 700,
          color: IVORY,
          letterSpacing: "4px",
          boxShadow: `0 0 24px ${color}50`,
          marginBottom: stat ? 14 : 0,
        }}
      >
        {name}
      </div>

      {/* Encart STAT + SOURCE */}
      {stat && (
        <div style={{ display: "block", margin: "0 auto", maxWidth: 720 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(0,0,0,0.65)",
              borderRadius: 8,
              padding: "10px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: source ? 52 : 44,
                fontWeight: 800,
                color,
                letterSpacing: "-1px",
                textShadow: `0 0 12px ${color}80`,
              }}
            >
              {stat}
            </div>
            {source && (
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 4,
                  letterSpacing: "2px",
                }}
              >
                {source}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Compteur "X / N" avec label — extrait de CountriesCounter ────────────────
export interface GeoProgressCounterProps {
  frame: number;
  // Nombre actuel et total (ex: 2 / 4)
  current: number;
  total: number;
  // Label au-dessus (ex: "PAYS QUI SE LÈVENT")
  label: string;
  // Couleur du chiffre (défaut gold)
  color?: string;
  appearAt?: number;
  fadeFrames?: number;
  bottomOffset?: number;
}

export const GeoProgressCounter: React.FC<GeoProgressCounterProps> = ({
  frame,
  current,
  total,
  label,
  color = GOLD,
  appearAt = 60,
  fadeFrames = 30,
  bottomOffset = 280,
}) => {
  if (frame < appearAt) return null;
  const opacity = interpolate(frame, [appearAt, appearAt + fadeFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomOffset,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 22,
          color: "#9a9a9a",
          letterSpacing: "8px",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 80,
          fontWeight: 800,
          color,
          letterSpacing: "-2px",
          textShadow: `0 0 20px ${color}`,
          lineHeight: 1,
        }}
      >
        {current} / {total}
      </div>
    </div>
  );
};

// ── Overlay climax "GROS TITRE. sous-titre." par-dessus carte assombrie ──────
// Extrait de FourPaysOverlay — pour conclure un beat avec un message fort.
export interface GeoClimaxOverlayProps {
  frame: number;
  // Ligne 1 (gros, gold, glow) — ex: "4 PAYS."
  line1: string;
  // Ligne 2 (moyen, blanc) — ex: "UN MÊME SIGNAL."
  line2?: string;
  appearAt: number;
  // Frame d'apparition de la ligne 2 (défaut appearAt + 33)
  line2At?: number;
  color?: string;
  // Opacité max du voile sombre (défaut 0.55)
  dimMax?: number;
}

export const GeoClimaxOverlay: React.FC<GeoClimaxOverlayProps> = ({
  frame,
  line1,
  line2,
  appearAt,
  line2At,
  color = GOLD,
  dimMax = 0.55,
}) => {
  if (frame < appearAt) return null;
  const localFrame = frame - appearAt;
  const l2At = line2At ?? appearAt + 33;

  const dimOpacity = interpolate(localFrame, [0, 20], [0, dimMax], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Op    = interpolate(localFrame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Slide = interpolate(localFrame, [4, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const signalLocal = frame - l2At;
  const line2Op    = interpolate(signalLocal, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Slide = interpolate(signalLocal, [0, 18], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,1)", opacity: dimOpacity, zIndex: 30, pointerEvents: "none" }} />
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          zIndex: 35, pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 200, fontWeight: 900, color,
            letterSpacing: "-6px", opacity: line1Op,
            transform: `translateY(${line1Slide}px)`,
            textShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
            lineHeight: 1,
          }}
        >
          {line1}
        </div>
        {line2 && (
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 76, fontWeight: 700, color: WHITE,
              letterSpacing: "4px", marginTop: 36,
              opacity: line2Op, transform: `translateY(${line2Slide}px)`,
              textShadow: "0 4px 18px rgba(0,0,0,0.7)",
            }}
          >
            {line2}
          </div>
        )}
      </div>
    </>
  );
};
