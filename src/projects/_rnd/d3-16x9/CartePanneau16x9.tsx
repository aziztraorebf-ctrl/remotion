// A5 — PROTO carte (gauche) + panneau data anime (droite), 16:9. La disposition que le 9:16 interdit.
// Intention : montrer un FAIT geo ET sa MESURE, simultanement. Les 3 coups d'Etat basculent le trio
// kaki l'un apres l'autre (carte), et le panneau REAGIT : compteur 0->3, frise chrono qui s'allume,
// barre population qui monte. Carte = l'evenement, panneau = la mesure, SYNCHRONISES.
//
// Registre parchemin AES. Chiffres : dates coups d'Etat = FACTUEL (Mali 2020/Burkina 2022/Niger 2023,
// deja dans le Short valide). Populations = estimees (mention "est." affichee, comme video longue).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { getCartePanneau, COUPS, POP_TOTALE, W, H, LEFT_W } from "./CartePanneauGeo";

export const CARTE_PANNEAU_FRAMES = 330; // 11s

const PARCH_BG = "#b8ac93";
const PANEL_BG = "#3a2e1e"; // panneau brun fonce (contraste avec la carte claire)
const CREME = "#f5efd6";
const INK = "#3a2a18";
const KAKI = "#7a7e54"; // pouvoir militaire (repris du Short)
const OR = "#d9b24a";
const STROKE: Record<string, string> = { Mali: "#d98a2b", "Burkina Faso": "#c0392b", Niger: "#2e9e6b" };

// chaque coup d'Etat se declenche a un instant (etale sur la timeline)
const COUP_AT = [40, 105, 170]; // frames de bascule Mali / Burkina / Niger
const COUP_DUR = 26;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const hx = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = hx(a), [br, bg, bb] = hx(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
};

export const CartePanneau16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const geo = getCartePanneau();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // progression de chaque coup (0->1)
  const coupProg = (i: number) =>
    interpolate(frame, [COUP_AT[i], COUP_AT[i] + COUP_DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // nb de coups actes (pour le compteur)
  const coupsActes = COUP_AT.filter((f) => frame >= f + COUP_DUR * 0.5).length;

  // population cumulee revelee au fur et a mesure
  const popRevelee = COUPS.reduce((acc, c, i) => acc + c.pop * coupProg(i), 0);
  const popBarMax = POP_TOTALE;

  // ordre d'index par pays
  const idxOf: Record<string, number> = { Mali: 0, "Burkina Faso": 1, Niger: 2 };

  return (
    <AbsoluteFill style={{ background: PARCH_BG }}>
      <AbsoluteFill style={{ opacity: fadeIn, display: "flex", flexDirection: "row" }}>
        {/* ============ GAUCHE : CARTE ============ */}
        <div style={{ position: "relative", width: LEFT_W, height: H }}>
          <svg width={LEFT_W} height={H} viewBox={`0 0 ${LEFT_W} ${H}`}>
            {geo.trio.map((c) => {
              const i = idxOf[c.name];
              const cp = coupProg(i);
              // fill : creme -> kaki (bascule militaire)
              const fill = mix(CREME, KAKI, cp);
              return (
                <g key={c.name}>
                  <path d={c.d} fill={fill} stroke={STROKE[c.name]} strokeWidth={3} strokeLinejoin="round" />
                  {/* anneau militaire qui se ferme sur le centroide au moment du coup */}
                  {cp > 0.02 && (
                    <g transform={`translate(${c.cx},${c.cy})`}>
                      <circle r={34} fill="none" stroke={OR} strokeWidth={4}
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - easeOut(cp))}`}
                        transform="rotate(-90)" opacity={0.9} />
                      {/* etoile militaire au centre (apparait anneau ferme) */}
                      {cp > 0.55 && (
                        <text y={10} textAnchor="middle" fontSize={38} fill={OR} opacity={(cp - 0.55) / 0.45}>★</text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          {/* titre carte, en bas-gauche (conteneur, pas position au juge) */}
          <div style={{ position: "absolute", left: 46, bottom: 40 }}>
            <div style={{ fontFamily: "'Archivo','Arial Narrow',sans-serif", color: INK }}>
              <div style={{ fontSize: 22, letterSpacing: 5, color: "#6b5a3f", fontWeight: 700 }}>SAHEL CENTRAL</div>
              <div style={{ fontSize: 40, fontWeight: 900 }}>LA VAGUE MILITAIRE</div>
            </div>
          </div>
        </div>

        {/* ============ DROITE : PANNEAU DATA ============ */}
        <div style={{
          width: W - LEFT_W, height: H, background: PANEL_BG, color: CREME,
          fontFamily: "'Archivo','Arial Narrow',sans-serif",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 46, padding: "0 56px",
        }}>
          {/* 1) COMPTEUR coups d'Etat */}
          <div>
            <div style={{ fontSize: 22, letterSpacing: 4, color: "#b8a988", fontWeight: 700, marginBottom: 6 }}>
              COUPS D'ÉTAT
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <div style={{ fontSize: 128, fontWeight: 900, color: OR, lineHeight: 0.9 }}>{coupsActes}</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#8a7c60" }}>/ 3</div>
            </div>
            <div style={{ fontSize: 22, color: "#b8a988" }}>en moins de 3 ans</div>
          </div>

          {/* 2) FRISE CHRONO (chaque date s'allume au coup) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {COUPS.map((c, i) => {
              const on = frame >= COUP_AT[i] + COUP_DUR * 0.5;
              const cp = coupProg(i);
              return (
                <div key={c.pays} style={{ display: "flex", alignItems: "center", gap: 16, opacity: 0.35 + 0.65 * cp }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: on ? OR : "#6b5a3f", boxShadow: on ? `0 0 12px ${OR}` : "none",
                  }} />
                  <div style={{ fontSize: 34, fontWeight: 900, color: on ? CREME : "#8a7c60", width: 96 }}>{c.annee}</div>
                  <div style={{ fontSize: 26, color: on ? "#e6dcc4" : "#8a7c60" }}>{c.pays}</div>
                </div>
              );
            })}
          </div>

          {/* 3) BARRE POPULATION cumulee */}
          <div>
            <div style={{ fontSize: 22, letterSpacing: 4, color: "#b8a988", fontWeight: 700, marginBottom: 10 }}>
              POPULATION CONCERNÉE <span style={{ color: "#8a7c60", fontWeight: 400 }}>(est.)</span>
            </div>
            <div style={{ position: "relative", height: 40, background: "#2a2114", borderRadius: 6, overflow: "hidden" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${(popRevelee / popBarMax) * 100}%`,
                background: `linear-gradient(90deg, #a8842e, ${OR})`,
              }} />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: OR }}>{popRevelee.toFixed(1)}</div>
              <div style={{ fontSize: 26, color: "#b8a988" }}>millions d'habitants</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default CartePanneau16x9;
