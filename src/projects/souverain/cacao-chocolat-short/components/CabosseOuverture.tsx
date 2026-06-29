/**
 * CabosseOuverture — transition B2->B3 (decision DA tranchee : la cabosse s'ouvre entre carte et chiffres,
 * territoire -> matiere cacao). Geste : la cabosse se dessine (strokeDashoffset), s'OUVRE en deux,
 * revele les feves, puis fade. Objet inerte => PAS de glissement (fade/colorisation sur place).
 *
 * Prop unique : progress 0..1 (pilote par le beat).
 *   0 -> 0.45 : la cabosse se dessine (contour) + se colorise brun-vie.
 *   0.45 -> 0.75 : les deux moities s'ecartent (ouverture), feves apparaissent au centre.
 *   0.75 -> 1 : fade out global.
 * Registre encre. Palette fermee.
 */
import React from "react";
import { interpolate } from "remotion";

const INK = "#2b2117";
const POD = "#a26432";
const POD_DARK = "#7a3f1f";
const BEAN = "#6b3e22";
const CX = 540;
const CY = 900;

export const CabosseOuverture: React.FC<{ progress: number }> = ({ progress }) => {
  // dessin du contour
  const draw = interpolate(progress, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // colorisation
  const colorOp = interpolate(progress, [0.2, 0.45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ouverture (ecartement des moities)
  const open = interpolate(progress, [0.45, 0.75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // feves
  const beansOp = interpolate(progress, [0.55, 0.78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // fade global
  const fade = interpolate(progress, [0.78, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gap = open * 70; // ecartement horizontal des moities
  const POD_LEN = 1200; // longueur approx du contour pour le dash

  // demi-cabosse (forme ovale cotelee). On la dessine 2x en miroir.
  const halfPath = "M0 -150 C70 -150 110 -70 110 0 C110 70 70 150 0 150 Z";
  const ribs = "M0 -130 L0 130 M40 -120 C58 -60 58 60 40 120 M78 -90 C92 -45 92 45 78 90";

  return (
    <g opacity={fade}>
      {/* moitie GAUCHE (miroir) */}
      <g transform={`translate(${CX - gap} ${CY}) scale(-1 1)`}>
        <path d={halfPath} fill={POD} fillOpacity={colorOp} stroke={INK} strokeWidth={5} strokeLinejoin="round"
          strokeDasharray={POD_LEN} strokeDashoffset={POD_LEN * (1 - draw)} />
        <path d={ribs} fill="none" stroke={POD_DARK} strokeWidth={3} strokeLinecap="round" opacity={colorOp} />
      </g>
      {/* moitie DROITE */}
      <g transform={`translate(${CX + gap} ${CY})`}>
        <path d={halfPath} fill={POD} fillOpacity={colorOp} stroke={INK} strokeWidth={5} strokeLinejoin="round"
          strokeDasharray={POD_LEN} strokeDashoffset={POD_LEN * (1 - draw)} />
        <path d={ribs} fill="none" stroke={POD_DARK} strokeWidth={3} strokeLinecap="round" opacity={colorOp} />
      </g>
      {/* FEVES au centre (revelees a l'ouverture) */}
      <g opacity={beansOp}>
        {[
          { x: 0, y: -40, r: -12 },
          { x: -28, y: 10, r: 8 },
          { x: 26, y: 18, r: -6 },
          { x: -6, y: 64, r: 14 },
          { x: 30, y: -22, r: 4 },
        ].map((b, i) => (
          <ellipse key={i} cx={CX + b.x} cy={CY + b.y} rx={18} ry={28}
            transform={`rotate(${b.r} ${CX + b.x} ${CY + b.y})`}
            fill={BEAN} stroke={INK} strokeWidth={2.5} />
        ))}
      </g>
    </g>
  );
};
