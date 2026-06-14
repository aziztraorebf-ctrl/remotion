/**
 * POC HUD — "Mali, expliqué comme un jeu vidéo" (test du MAILLON FAIBLE : le cartouche-HUD premium)
 *
 * BUT : prouver qu'on peut faire un HUD "Civilization, pas Mario" sur carte parchemin Atlas,
 * SANS basculer enfantin. Scène de ~25s. Pas une vidéo finie — un test de registre visuel.
 *
 * Test 4 éléments :
 *  1. Cartouche-HUD (cadre atlas ancien, coin bas-gauche) : titre + année + jauge "Or contrôlé" en pastilles
 *  2. Bandeau "objectif" discret (haut) : vocabulaire stratégie, pas arcade
 *  3. Zone aurifère qui s'illumine en or sur la carte (mécanique "zone de contrôle" 4X)
 *  4. Sprite Mansa PixelLab qui marche vers l'est (l'unité du joueur)
 *
 * Headless-safe : carte statique Mapbox PNG, pas de WebGL.
 * Palette : parchemin Atlas (ocre/navy/or sobre). JAMAIS couleurs primaires.
 */

import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

// Palette parchemin Atlas — sobre, adulte
const COL = {
  ink: "#2a2118",        // encre brune
  parch: "#e8dcc0",      // parchemin
  parchDark: "#d4c4a0",
  gold: "#c8a951",       // or sobre (PAS jaune fluo)
  goldDeep: "#9a7830",
  navy: "#141c2e",
  ember: "#b5703a",      // ocre chaud accent
};

const SERIF = "'Cinzel', 'Trajan Pro', Georgia, serif"; // typo cartographique
const WALK_FPS = 8;

// -------------------------------------------------------------------------
// Fond carte teintée parchemin + drift lent
// -------------------------------------------------------------------------
const MapParchment: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.12, 1.20]);
  const dx = interpolate(frame, [0, durationInFrames], [0, -30]);

  return (
    <AbsoluteFill style={{ backgroundColor: COL.navy }}>
      <Img
        src={staticFile("_demos/poc-mali-videogame/map-westafrica.png")}
        style={{
          position: "absolute", width: "120%", height: "120%", left: "-10%", top: "-10%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${dx}px)`,
          // teinte parchemin : désaturer + virage sépia chaud
          filter: "sepia(0.55) saturate(0.8) brightness(0.78) contrast(1.05)",
        }}
      />
      {/* voile parchemin chaud par-dessus le dark map */}
      <AbsoluteFill style={{ backgroundColor: COL.ember, mixBlendMode: "soft-light", opacity: 0.35 }} />
      {/* vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 45%, rgba(20,28,46,0) 45%, rgba(20,28,46,0.55) 100%)",
      }} />
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------------------
// Zone aurifere qui s'illumine (mecanique "zone de controle")
// -------------------------------------------------------------------------
const GoldZone: React.FC<{ cx: number; cy: number; r: number; start: number; label: string }> = ({ cx, cy, r, start, label }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.04 * Math.sin((frame - start) / 8);
  const labelOp = interpolate(frame, [start + 30, start + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g opacity={t}>
      <circle cx={cx} cy={cy} r={r * t * pulse} fill={COL.gold} opacity={0.22} />
      <circle cx={cx} cy={cy} r={r * t} fill="none" stroke={COL.gold} strokeWidth={2.5} opacity={0.8} />
      <circle cx={cx} cy={cy} r={5} fill={COL.gold} />
      <text x={cx} y={cy - r - 14} fill={COL.parch} fontFamily={SERIF} fontSize={26} fontWeight={600}
            textAnchor="middle" opacity={labelOp} style={{ letterSpacing: 1 }}>
        {label}
      </text>
    </g>
  );
};

// -------------------------------------------------------------------------
// Sprite Mansa PixelLab qui marche vers l'est
// -------------------------------------------------------------------------
const MansaWalker: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;
  const walkFrame = Math.floor((f / fps) * WALK_FPS) % 6;
  // trajet ouest -> est (vers la zone aurifere)
  const x = interpolate(f, [0, 180], [430, 760], { extrapolateRight: "clamp" });
  const y = 620;
  const size = 130;
  // HTML layer (PAS dans le <svg> : <Img> dans svg => "current.decode is not a function")
  return (
    <>
      <div style={{
        position: "absolute", left: x + size / 2 - size * 0.28, top: y + size - 12,
        width: size * 0.56, height: size * 0.18, borderRadius: "50%",
        background: "rgba(0,0,0,0.35)", filter: "blur(2px)",
      }} />
      <Img
        src={staticFile(`atlas-mansa-moussa/characters/mansa-moussa/animations/walk_cycle/east/frame_00${walkFrame}.png`)}
        style={{ position: "absolute", left: x, top: y, width: size, height: size, imageRendering: "pixelated" }}
      />
    </>
  );
};

// -------------------------------------------------------------------------
// LE CARTOUCHE-HUD (le maillon faible a tester) — cadre atlas ancien
// -------------------------------------------------------------------------
const CartoucheHUD: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = spring({ frame: frame - 12, fps: 30, config: { damping: 18 } });
  const y = interpolate(appear, [0, 1], [40, 0]);

  // jauge "Or controle" : 5 pastilles qui se remplissent dans le temps
  const filled = interpolate(frame, [60, 200], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", left: 60, bottom: 70, opacity: appear, transform: `translateY(${y}px)`,
    }}>
      {/* cadre parchemin avec double-filet (style cartouche d'atlas) */}
      <div style={{
        background: `linear-gradient(160deg, ${COL.parch}, ${COL.parchDark})`,
        border: `2px solid ${COL.goldDeep}`,
        boxShadow: `0 0 0 4px rgba(42,33,24,0.5), 0 8px 30px rgba(0,0,0,0.5)`,
        borderRadius: 4,
        padding: "20px 28px",
        minWidth: 360,
      }}>
        {/* filet interieur decoratif */}
        <div style={{ borderTop: `1px solid ${COL.goldDeep}`, opacity: 0.5, marginBottom: 14 }} />
        <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: COL.ink, letterSpacing: 2 }}>
          EMPIRE DU MALI
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 20, color: COL.goldDeep, letterSpacing: 3, marginTop: 2 }}>
          · 1324 ·
        </div>

        {/* jauge ressource en PASTILLES (pas une barre de vie) */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 16, gap: 10 }}>
          <span style={{ fontFamily: SERIF, fontSize: 17, color: COL.ink, letterSpacing: 1, opacity: 0.8 }}>
            OR CONTRÔLÉ
          </span>
          <div style={{ display: "flex", gap: 6, marginLeft: 6 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const on = filled > i;
              return (
                <div key={i} style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: on ? COL.gold : "transparent",
                  border: `2px solid ${COL.goldDeep}`,
                  boxShadow: on ? `0 0 8px ${COL.gold}` : "none",
                  transition: "none",
                }} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// Bandeau "objectif" discret (haut) — vocabulaire strategie
// -------------------------------------------------------------------------
const ObjectiveBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", opacity: op,
    }}>
      <span style={{
        fontFamily: SERIF, fontSize: 16, letterSpacing: 4, color: COL.gold,
        background: "rgba(20,28,46,0.6)", padding: "8px 20px", borderRadius: 2,
        border: `1px solid ${COL.goldDeep}`,
      }}>
        OBJECTIF — CONTRÔLER L'OR DU SUD
      </span>
    </div>
  );
};

// -------------------------------------------------------------------------
// COMPOSITION
// -------------------------------------------------------------------------
export const PocMaliVideoGame: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COL.navy }}>
      <MapParchment />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* zones auriferes Bambouk / Boure qui s'illuminent */}
        <GoldZone cx={880} cy={700} r={70} start={60} label="BAMBOUK" />
        <GoldZone cx={1080} cy={560} r={58} start={120} label="BOURÉ" />
      </svg>
      {/* sprite Mansa = couche HTML (hors svg) */}
      <MansaWalker startFrame={30} />
      <ObjectiveBanner />
      <CartoucheHUD />
      {/* grain papier subtil */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "3px 3px", opacity: 0.5, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
