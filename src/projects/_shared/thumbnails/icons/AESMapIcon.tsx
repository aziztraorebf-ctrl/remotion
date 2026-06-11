import React from "react";

// Carte SVG schématique des 3 pays AES (Mali + Burkina Faso + Niger)
// Formes simplifiées mais reconnaissables, bloc unifié avec frontières intérieures
// Viewbox calibrée pour centrer dans 1280x720

export const AESMapIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 520 480"
      style={{
        position: "absolute",
        left: 30,
        top: "50%",
        transform: "translateY(-50%)",
        width: 580,
        height: 520,
        opacity: 0.92,
      }}
    >
      <defs>
        <filter id="glow-aes">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="outer-glow">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="aes-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8a951" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b6a1f" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="mali-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8a951" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a07820" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="bf-fill" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4b060" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#c8a951" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="niger-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c472" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c8a951" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Halo extérieur du bloc AES */}
      <g filter="url(#outer-glow)" opacity="0.5">
        {/* Mali */}
        <path
          d="M 60,80 L 200,80 L 215,95 L 240,85 L 260,95 L 265,130 L 280,145
             L 285,175 L 270,190 L 265,210 L 245,220 L 235,240 L 210,255
             L 195,280 L 180,290 L 165,285 L 145,295 L 125,290 L 110,305
             L 90,310 L 70,300 L 55,285 L 50,265 L 60,240 L 55,215
             L 65,195 L 60,170 L 50,150 L 55,120 Z"
          fill="#c8a951"
        />
        {/* Burkina Faso */}
        <path
          d="M 145,295 L 165,285 L 180,290 L 195,280 L 210,255 L 235,240
             L 245,220 L 265,210 L 270,225 L 280,235 L 275,255 L 260,265
             L 255,285 L 240,295 L 225,310 L 210,315 L 195,310 L 175,320
             L 160,315 L 145,305 Z"
          fill="#c8a951"
        />
        {/* Niger */}
        <path
          d="M 265,130 L 310,115 L 360,100 L 410,90 L 450,95 L 470,115
             L 460,140 L 455,170 L 465,200 L 455,230 L 440,255 L 420,265
             L 400,270 L 375,280 L 350,275 L 330,285 L 310,280 L 290,265
             L 280,255 L 275,235 L 280,225 L 270,215 L 265,195 L 280,180
             L 285,160 L 280,145 L 265,130 Z"
          fill="#c8a951"
        />
      </g>

      {/* Mali — pays */}
      <path
        d="M 60,80 L 200,80 L 215,95 L 240,85 L 260,95 L 265,130 L 280,145
           L 285,175 L 270,190 L 265,210 L 245,220 L 235,240 L 210,255
           L 195,280 L 180,290 L 165,285 L 145,295 L 125,290 L 110,305
           L 90,310 L 70,300 L 55,285 L 50,265 L 60,240 L 55,215
           L 65,195 L 60,170 L 50,150 L 55,120 Z"
        fill="url(#mali-fill)"
        stroke="#c8a951"
        strokeWidth="1.5"
        filter="url(#glow-aes)"
      />

      {/* Burkina Faso — pays */}
      <path
        d="M 145,295 L 165,285 L 180,290 L 195,280 L 210,255 L 235,240
           L 245,220 L 265,210 L 270,225 L 280,235 L 275,255 L 260,265
           L 255,285 L 240,295 L 225,310 L 210,315 L 195,310 L 175,320
           L 160,315 L 145,305 Z"
        fill="url(#bf-fill)"
        stroke="#c8a951"
        strokeWidth="1.5"
        filter="url(#glow-aes)"
      />

      {/* Niger — pays */}
      <path
        d="M 265,130 L 310,115 L 360,100 L 410,90 L 450,95 L 470,115
           L 460,140 L 455,170 L 465,200 L 455,230 L 440,255 L 420,265
           L 400,270 L 375,280 L 350,275 L 330,285 L 310,280 L 290,265
           L 280,255 L 275,235 L 280,225 L 270,215 L 265,195 L 280,180
           L 285,160 L 280,145 L 265,130 Z"
        fill="url(#niger-fill)"
        stroke="#c8a951"
        strokeWidth="1.5"
        filter="url(#glow-aes)"
      />

      {/* Frontières intérieures (Mali/Niger) */}
      <path
        d="M 265,130 L 280,145 L 285,175 L 270,190 L 265,210 L 270,225 L 280,235"
        stroke="#c8a951"
        strokeWidth="1"
        strokeDasharray="4,3"
        fill="none"
        opacity="0.6"
      />
      {/* Frontières intérieures (Mali/Burkina) */}
      <path
        d="M 210,255 L 235,240 L 245,220 L 265,210"
        stroke="#c8a951"
        strokeWidth="1"
        strokeDasharray="4,3"
        fill="none"
        opacity="0.6"
      />
      {/* Frontières intérieures (Niger/Burkina) */}
      <path
        d="M 280,235 L 275,255 L 260,265 L 255,285"
        stroke="#c8a951"
        strokeWidth="1"
        strokeDasharray="4,3"
        fill="none"
        opacity="0.6"
      />

      {/* Labels pays — discrets */}
      <text x="130" y="185" textAnchor="middle"
        style={{ fontFamily: "Georgia, serif", fontSize: 18, fill: "#e8c472", opacity: 0.85, letterSpacing: 2 }}>
        MALI
      </text>
      <text x="207" y="295" textAnchor="middle"
        style={{ fontFamily: "Georgia, serif", fontSize: 13, fill: "#e8c472", opacity: 0.75, letterSpacing: 1 }}>
        BURKINA
      </text>
      <text x="375" y="195" textAnchor="middle"
        style={{ fontFamily: "Georgia, serif", fontSize: 17, fill: "#e8c472", opacity: 0.8, letterSpacing: 2 }}>
        NIGER
      </text>

      {/* Point AES — sceau central sur le bloc */}
      <circle cx="240" cy="185" r="5" fill="#c8a951" opacity="0.9" filter="url(#glow-aes)" />
      <circle cx="240" cy="185" r="12" fill="none" stroke="#c8a951" strokeWidth="1" opacity="0.4" />
    </svg>
  );
};
