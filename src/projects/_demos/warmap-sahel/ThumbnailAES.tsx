import React from "react";
import { AbsoluteFill } from "remotion";
import { AESMapIcon } from "../../_shared/thumbnails/icons/AESMapIcon";

// ThumbnailAES — Option 1
// Image pure, ZERO texte — la carte AES dramatisée sur fond sombre
// Le titre YouTube est dans le champ titre, pas dans l'image

const C = {
  navyDark:  "#06101e",
  gold:      "#c8a951",
  goldHi:    "#e8c472",
};

export const ThumbnailAES: React.FC = () => {
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 45% 48%, #0d1e36 0%, ${C.navyDark} 80%)`,
    }}>

      {/* Grain texture subtil */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(rgba(200,169,81,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Halo central gold derrière la carte */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 700,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, rgba(200,169,81,0.10) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Carte AES — centrée, plus grande */}
      <svg
        viewBox="0 0 520 480"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 860,
          height: 760,
          opacity: 0.95,
        }}
      >
        <defs>
          <filter id="glow-aes-t">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="outer-glow-t">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="mali-fill-t" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a830" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a07820" stopOpacity="0.70" />
          </linearGradient>
          <linearGradient id="bf-fill-t" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e8c060" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#c8a040" stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id="niger-fill-t" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0d080" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#d4a830" stopOpacity="0.62" />
          </linearGradient>
          <radialGradient id="edge-fade" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="vignette-mask">
            <rect width="520" height="480" fill="url(#edge-fade)" />
          </mask>
        </defs>

        {/* Halo extérieur */}
        <g filter="url(#outer-glow-t)" opacity="0.6">
          <path d="M 60,80 L 200,80 L 215,95 L 240,85 L 260,95 L 265,130 L 280,145 L 285,175 L 270,190 L 265,210 L 245,220 L 235,240 L 210,255 L 195,280 L 180,290 L 165,285 L 145,295 L 125,290 L 110,305 L 90,310 L 70,300 L 55,285 L 50,265 L 60,240 L 55,215 L 65,195 L 60,170 L 50,150 L 55,120 Z" fill="#c8a951" />
          <path d="M 145,295 L 165,285 L 180,290 L 195,280 L 210,255 L 235,240 L 245,220 L 265,210 L 270,225 L 280,235 L 275,255 L 260,265 L 255,285 L 240,295 L 225,310 L 210,315 L 195,310 L 175,320 L 160,315 L 145,305 Z" fill="#c8a951" />
          <path d="M 265,130 L 310,115 L 360,100 L 410,90 L 450,95 L 470,115 L 460,140 L 455,170 L 465,200 L 455,230 L 440,255 L 420,265 L 400,270 L 375,280 L 350,275 L 330,285 L 310,280 L 290,265 L 280,255 L 275,235 L 280,225 L 270,215 L 265,195 L 280,180 L 285,160 L 280,145 L 265,130 Z" fill="#c8a951" />
        </g>

        {/* Corps pays avec vignette */}
        <g mask="url(#vignette-mask)">
          {/* Mali */}
          <path d="M 60,80 L 200,80 L 215,95 L 240,85 L 260,95 L 265,130 L 280,145 L 285,175 L 270,190 L 265,210 L 245,220 L 235,240 L 210,255 L 195,280 L 180,290 L 165,285 L 145,295 L 125,290 L 110,305 L 90,310 L 70,300 L 55,285 L 50,265 L 60,240 L 55,215 L 65,195 L 60,170 L 50,150 L 55,120 Z"
            fill="url(#mali-fill-t)" stroke="#e8c472" strokeWidth="2" filter="url(#glow-aes-t)" />
          {/* Burkina Faso */}
          <path d="M 145,295 L 165,285 L 180,290 L 195,280 L 210,255 L 235,240 L 245,220 L 265,210 L 270,225 L 280,235 L 275,255 L 260,265 L 255,285 L 240,295 L 225,310 L 210,315 L 195,310 L 175,320 L 160,315 L 145,305 Z"
            fill="url(#bf-fill-t)" stroke="#e8c472" strokeWidth="2" filter="url(#glow-aes-t)" />
          {/* Niger */}
          <path d="M 265,130 L 310,115 L 360,100 L 410,90 L 450,95 L 470,115 L 460,140 L 455,170 L 465,200 L 455,230 L 440,255 L 420,265 L 400,270 L 375,280 L 350,275 L 330,285 L 310,280 L 290,265 L 280,255 L 275,235 L 280,225 L 270,215 L 265,195 L 280,180 L 285,160 L 280,145 L 265,130 Z"
            fill="url(#niger-fill-t)" stroke="#e8c472" strokeWidth="2" filter="url(#glow-aes-t)" />
        </g>

        {/* Frontières intérieures pointillées */}
        <path d="M 265,130 L 280,145 L 285,175 L 270,190 L 265,210 L 270,225 L 280,235"
          stroke="#e8c472" strokeWidth="1.2" strokeDasharray="5,4" fill="none" opacity="0.55" />
        <path d="M 210,255 L 235,240 L 245,220 L 265,210"
          stroke="#e8c472" strokeWidth="1.2" strokeDasharray="5,4" fill="none" opacity="0.55" />
        <path d="M 280,235 L 275,255 L 260,265 L 255,285"
          stroke="#e8c472" strokeWidth="1.2" strokeDasharray="5,4" fill="none" opacity="0.55" />

        {/* Sceau AES central */}
        <circle cx="240" cy="200" r="7" fill="#c8a951" opacity="0.95" filter="url(#glow-aes-t)" />
        <circle cx="240" cy="200" r="16" fill="none" stroke="#c8a951" strokeWidth="1.5" opacity="0.45" />
        <circle cx="240" cy="200" r="28" fill="none" stroke="#c8a951" strokeWidth="0.8" opacity="0.20" />
      </svg>

      {/* Vignette bords assombris */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(6,16,30,0.85) 100%)",
        pointerEvents: "none",
      }} />

    </AbsoluteFill>
  );
};
