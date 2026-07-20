/**
 * PROTOTYPE — demo de personnalisation du personnage Gemini (couleurs vetements/peau/chapeau) par EDITION
 * DE CODE (fill= parametres), PAS par regeneration Gemini. Reponse a la question d'Aziz : "peut-on changer
 * le torse/couleur/chapeau ?" — oui, ce sont de vrais paths SVG avec fill explicite, recoloration directe
 * en code = zero cout API, zero risque d'incoherence entre poses (contrairement a regenerer via Gemini,
 * qui a produit un personnage visuellement different au 2e appel — voir squat ecarte dans ActionChain).
 * 3 personnages cote a cote en marche, memes angles (meme cinematique), 3 palettes differentes.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { GeminiRig, IDLE, WALK_A_EXPORT, WALK_B_EXPORT, type Palette } from "./ProtoGeminiActionChain";

const PARCH = "#e8dcc0";
const HALF_STEP = 14;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpAngles(a: typeof IDLE, b: typeof IDLE, t: number) {
  const out: Record<string, number> = {};
  (Object.keys(a) as (keyof typeof IDLE)[]).forEach((k) => { out[k] = lerp(a[k], b[k], t); });
  return out as typeof IDLE;
}
function walkCycle(frame: number) {
  const stepIndex = Math.floor(frame / HALF_STEP);
  const localT = (frame % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A_EXPORT : WALK_B_EXPORT;
  const to = stepIndex % 2 === 0 ? WALK_B_EXPORT : WALK_A_EXPORT;
  return lerpAngles(from, to, localT);
}

// 3 variantes — meme structure de rig, seule la palette change (recoloration directe des fill=)
const VARIANTS: { label: string; palette: Palette }[] = [
  { label: "original (chemise ivoire, chapeau conique)", palette: { skin: "#8B5A2B", shirt: "#FFFDD0", pants: "#2F4F4F", hat: "#D2B48C", boot: "#3E2723", ink: "#1A1A1A" } },
  { label: "chandail bleu + pantalon brun", palette: { skin: "#8B5A2B", shirt: "#3D5A80", pants: "#6B4226", hat: "#D2B48C", boot: "#2B2117", ink: "#1A1A1A" } },
  { label: "chandail rouge brique + pantalon kaki", palette: { skin: "#8B5A2B", shirt: "#A63A32", pants: "#7C7853", hat: "#8C6B4F", boot: "#3E2723", ink: "#1A1A1A" } },
];

export const PROTO_GEMINI_PALETTE_DEMO_FRAMES = 130;

export const ProtoGeminiPaletteDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const walkFrame = frame % (HALF_STEP * 6);
  const pose = frame < 15 ? IDLE : walkCycle(walkFrame);

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 50 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#2b2117", marginBottom: 30 }}>
          Personnalisation par palette — meme rig, 3 jeux de couleurs (edition code, zero appel API)
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          {VARIANTS.map((v) => (
            <div key={v.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 380 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#8a2b2b", marginBottom: 8, textAlign: "center", height: 40 }}>
                {v.label}
              </div>
              <svg width={360} height={560} viewBox="-100 -60 400 600">
                <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
                <GeminiRig a={pose} palette={v.palette} />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
