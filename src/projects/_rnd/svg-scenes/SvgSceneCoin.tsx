/**
 * SvgSceneCoin — R&D harnais de rendu (2026-06-21).
 *
 * Prend une SCENE SVG generee par un LLM (Gemini / GPT-5.5) — chaine de texte SVG avec groupes nommes —
 * et l'enveloppe dans le disque-piece dore (gradient or radial + clipPath circulaire + rim rouge),
 * exactement comme SenegalCoinFaceA_SVG. But : JUGER la MATIERE brute d'abord (mode statique), puis
 * brancher l'animation par groupe ensuite.
 *
 * Le contenu LLM est injecte en innerHTML (SVG standard) — pour un premier rendu fidele sans reecrire
 * en JSX. L'animation par groupe se fera dans une 2e passe (composant dedie par scene retenue).
 */
import React from "react";

const RED = "#8a2a20";

export interface SvgSceneCoinProps {
  /** contenu SVG interieur (groupes nommes) genere par le LLM, en chaine de texte */
  sceneSvg: string;
  /** etiquette affichee en bas (provider/scene) pour le banc d'essai */
  label?: string;
}

export const SvgSceneCoin: React.FC<SvgSceneCoinProps> = ({ sceneSvg, label }) => {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#16213a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 1024, height: 1024 }}>
        <svg viewBox="0 0 1024 1024" width={1024} height={1024} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="coinGradScene" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
              <stop offset="0%" stopColor="#e7bd78" />
              <stop offset="75%" stopColor="#dca95e" />
              <stop offset="100%" stopColor="#bf9442" />
            </radialGradient>
            <clipPath id="coinClipScene">
              <circle cx="512" cy="512" r="480" />
            </clipPath>
          </defs>

          {/* fond dore de la piece */}
          <circle cx="512" cy="512" r="480" fill="url(#coinGradScene)" />

          {/* SCENE LLM : injectee en innerHTML, clippee dans le disque */}
          <g
            clipPath="url(#coinClipScene)"
            dangerouslySetInnerHTML={{ __html: sceneSvg }}
          />

          {/* rim rouge grave (identique a FaceA) */}
          <g id="rim">
            <circle cx="512" cy="512" r="480" fill="none" stroke={RED} strokeWidth="12" />
            <circle cx="512" cy="512" r="468" fill="none" stroke={RED} strokeWidth="4" />
            <circle cx="512" cy="512" r="454" fill="none" stroke={RED} strokeWidth="8" strokeDasharray="4 20" strokeLinecap="round" />
            <circle cx="512" cy="512" r="495" fill="none" stroke={RED} strokeWidth="2" />
          </g>
        </svg>

        {label && (
          <div style={{ position: "absolute", bottom: -56, left: 0, right: 0, textAlign: "center", color: "#c8a951", fontFamily: "monospace", fontSize: 28 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default SvgSceneCoin;
