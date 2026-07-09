/**
 * GovBuilding — palais présidentiel soudanais (sprite iso Gemini, parchemin AES) posé sur Khartoum, beat 2.
 *
 * Matérialise « ils renversent le gouvernement de transition de Hamdok » (remplace le cartouche texte) :
 *   - apparaît (spring) au nom Hamdok : palais clair, drapeau soudanais (dans le sprite).
 *   - au COUP D'ÉTAT : le palais VACILLE (shake bref amorti) + se TERNIT (grayscale/brightness) et un
 *     SCEAU MILITAIRE (chevrons kaki) s'imprime dessus = le pouvoir civil bascule.
 *   - puis s'estompe.
 *
 * Sprite : public/_shared/sprites/warmap/palais-gouv-td.png (Gemini 3.1 flash-image, détouré, ratio 1408:768).
 * Taille écran fixe. Frame-driven, NO scale oscillant (spring puis figé).
 */
import React from "react";
import { interpolate, Easing, staticFile } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Pt = { x: number; y: number };

export const GovBuilding: React.FC<{ pos: Pt; frame: number; at: number; coup: number; size?: number }> =
  ({ pos, frame, at, coup, size = 190 }) => {
    const appear = at - 10;
    if (frame < appear) return null;

    const ap = interpolate(frame, [appear, appear + 12, appear + 22], [0, 1.08, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    const fadeIn = interpolate(frame, [appear, appear + 10], [0, 1], clamp);
    const fadeOut = interpolate(frame, [coup + 150, coup + 190], [1, 0], clamp);
    const op = fadeIn * fadeOut;
    if (op <= 0.01) return null;

    // VACILLEMENT au coup d'État (shake horizontal bref amorti)
    const cl = frame - coup;
    const shake = cl >= 0 && cl < 26 ? Math.sin(cl * 1.4) * Math.exp(-cl * 0.09) * 5 : 0;
    // TERNISSEMENT : le palais grisonne à mesure que le pouvoir civil tombe
    const gray = interpolate(frame, [coup + 6, coup + 60], [0, 1], clamp);
    // SCEAU MILITAIRE qui s'imprime au coup (chevrons kaki)
    const sealOp = interpolate(frame, [coup + 10, coup + 30], [0, 1], clamp);

    const W = size;
    const H = size * (768 / 1408);

    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(calc(-50% + ${shake}px), -62%) scale(${ap})`,
        opacity: op, pointerEvents: "none" }}>
        {/* ombre portée douce au sol */}
        <div style={{ position: "absolute", left: "50%", top: "80%", width: W * 0.6, height: W * 0.14,
          transform: "translate(-50%,-50%)", background: "rgba(30,20,6,0.4)", borderRadius: "50%", filter: "blur(7px)" }} />
        {/* palais (sprite) — grisonne au coup */}
        <img src={staticFile("_shared/sprites/warmap/palais-gouv-td.png")}
          style={{ width: W, height: H, display: "block", objectFit: "contain",
            filter: `grayscale(${gray}) brightness(${1 - gray * 0.26}) drop-shadow(0 3px 6px rgba(0,0,0,0.4))` }} />
        {/* SCEAU MILITAIRE (chevrons kaki) qui s'imprime au centre au coup d'État */}
        {sealOp > 0.01 && (
          <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", left: "50%", top: "42%",
            transform: "translate(-50%,-50%)", opacity: sealOp }}>
            <circle cx={22} cy={22} r={19} fill="rgba(45,40,24,0.82)" stroke="#e7d9a8" strokeWidth={1.6} />
            <path d="M13 17 l7 5 l-7 5 M22 17 l7 5 l-7 5" fill="none" stroke="#e7d9a8" strokeWidth={2.4}
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    );
  };

export default GovBuilding;
