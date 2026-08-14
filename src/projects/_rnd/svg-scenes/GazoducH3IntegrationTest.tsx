// GazoducH3IntegrationTest — R&D EXPLORATION (2026-08-14)
// Teste l'intégration d'un clip MiniMax H3 (Poster Vector, pelleteuse qui creuse) DANS un cadre SVG
// composé sur une carte, au même gabarit que l'insert "chantier Adrar" du breakdown Segment A Beat 2
// (memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-v5-json/beat2-breakdown.json).
// But : juger si un clip vidéo stylisé s'harmonise avec le registre carte D3/SVG plat, avant de
// généraliser au recodage du Beat 2. Fond de carte STATIQUE (pas la vraie carte D3) — ce test isole
// uniquement la question du cadre+clip, pas le reste du segment.
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, interpolate, useCurrentFrame } from "remotion";

export const GAZODUC_H3_INTEGRATION_TEST_FRAMES = 180;

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const CYAN = "#31E8FF";
const GOLD = "#FFD36A";

export const GazoducH3IntegrationTest: React.FC = () => {
  const frame = useCurrentFrame();

  const cardIn = interpolate(frame, [0, 15], [0, 1], clampB);
  const dimIn = interpolate(frame, [0, 15], [0, 1], clampB);
  const connectorIn = interpolate(frame, [10, 25], [0, 1], clampB);

  return (
    <AbsoluteFill style={{ background: "#06172A" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Fond de carte STATIQUE simplifié — juste pour juger le cadre, pas la vraie carte */}
        <g opacity={0.6}>
          <rect x={0} y={0} width={1920} height={1080} fill="#06172A" />
          <path d="M 700 300 L 900 250 L 1050 400 L 1000 600 L 850 650 L 700 500 Z" fill="#102B49" stroke="#3B536B" strokeWidth={2} />
          <path d="M 1050 400 L 1250 350 L 1350 500 L 1250 650 L 1050 600 Z" fill="#102B49" stroke="#3B536B" strokeWidth={2} />
        </g>
        {/* Assombrissement derrière l'insert, cohérent avec le breakdown (dim overlay) */}
        <rect x={0} y={0} width={1920} height={1080} fill="rgba(1,8,18,0.5)" opacity={dimIn} />
        {/* Pin ancré à Adrar (position schématique pour ce test) */}
        <g transform="translate(1000 500)" opacity={dimIn}>
          <circle r={24} fill={`${GOLD}55`} />
          <circle r={12} fill={GOLD} stroke="#FFE08A" strokeWidth={2} />
        </g>
        {/* Connecteur pin -> carte */}
        <path
          d="M 1000 500 L 560 400"
          stroke="#B8D8EA" strokeWidth={1.5} strokeDasharray="6 4"
          opacity={connectorIn}
        />
      </svg>

      {/* ===== Carte-overlay composée — même gabarit que p02_sahara_insert_card du breakdown ===== */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: "18%",
          width: "34%",
          height: "62%",
          opacity: cardIn,
          transform: `scale(${interpolate(cardIn, [0, 1], [0.96, 1])})`,
          background: "rgba(7, 26, 46, 0.90)",
          border: `1.5px solid #8CA3B8`,
          borderRadius: 10,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{
          color: "#EAF7FF", fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700,
          letterSpacing: "0.06em",
        }}>
          CHANTIER D'ADRAR
        </div>
        <div style={{ color: GOLD, fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, letterSpacing: "0.1em", marginBottom: 14 }}>
          TRAVAUX EN COURS
        </div>

        {/* ===== Le clip H3 dans un cadre masqué, ratio proche du storyboard (16:9 réduit) ===== */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 6,
          overflow: "hidden",
          border: `1px solid ${CYAN}55`,
          background: "#000",
        }}>
          <OffthreadVideo
            src={staticFile("_rnd/minimax-h3-tests/gazoduc-pelleteuse/pelleteuse-1080p-v1.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 40, height: 40 }}>
            <svg width={40} height={40} viewBox="0 0 40 40">
              <circle cx={20} cy={20} r={17} fill="none" stroke="#28445F" strokeWidth={4} />
              <circle
                cx={20} cy={20} r={17} fill="none" stroke={GOLD} strokeWidth={4}
                strokeDasharray={2 * Math.PI * 17}
                strokeDashoffset={2 * Math.PI * 17 * (1 - 0.37)}
                transform="rotate(-90 20 20)"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ color: "#EAF7FF", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14 }}>
            37% — ACTIVITÉ ÉLEVÉE
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default GazoducH3IntegrationTest;
