// ResourcesRevealSVG — remplace ResourcesReveal (triple-screen jugé "statique tout le long", retour Aziz
// 2026-06-15/07-01/07-04, décision Session A 2026-07-04). Cible SVG générée via Gemini 3.1 Pro (brief
// exigence+liberté, cf memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md §GUIDER SANS BRIDER), puis corrigée
// (bouclier médiéval accentué sur retour Aziz, mix-and-match des veines "organiques" avec une 1re
// génération, bulles résiduelles retirées, labels pays déplacés hors emprise des veines).
// Concept : objet-héros unique (bouclier AES) + 3 filons (or/uranium/pétrole) qui alimentent/renforcent
// le bouclier — "le levier des ressources" qui permet aux 3 pays de tenir face aux sanctions.
import React from "react";
import { AbsoluteFill, interpolate, staticFile, Audio } from "remotion";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const draw = (f: number, start: number, dur: number, dash = 900): React.CSSProperties => ({
  strokeDasharray: dash,
  strokeDashoffset: dash * clampI(f, start, start + dur, 1, 0),
});

// Goutte qui glisse le long d'un path (flux continu) — via un <path> le long duquel un court segment
// de stroke se déplace en boucle (dasharray "segment gap-long", dashoffset qui défile).
const FlowDots: React.FC<{ d: string; color: string; t: number; totalLen: number; count?: number }> = ({
  d, color, t, totalLen, count = 3,
}) => {
  const dotLen = totalLen * 0.06;
  const gap = totalLen / count;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      opacity={0.75}
      style={{ strokeDasharray: `${dotLen} ${gap - dotLen}`, strokeDashoffset: -t * gap }}
    />
  );
};

type Props = { frame: number; inAt: number; outAt: number; width: number; height: number; fps: number };

// ResourcesRevealSVG — pilotée par frame ABSOLU du moteur. `inAt` = F_OR-20, la chorégraphie interne
// reprend les offsets LOCAUX (L0=inAt), calés sur l'audio réel du segment.
export const ResourcesRevealSVG: React.FC<Props> = ({ frame, inAt, outAt, width, height, fps }) => {
  const f = frame - inAt;
  if (frame < inAt - 2 || frame > outAt + 2) return null;

  // Fulcrum (lever/socle) : fade simple, apparaît avant 0.5s
  const fulcrumOp = clampI(f, 0, 14);
  // Bouclier : SE DESSINE au contour (stroke-dasharray) plutôt qu'un fade brut — retour Aziz "faire un
  // stroke de dessin, c'est très beau". Rim (L0-30) puis corps intérieur (L14-40), écart léger pour un
  // vrai geste de tracé (le rebord se pose avant que l'intérieur ne se remplisse).
  const shieldRimDraw = draw(f, 0, 30, 1400);
  const shieldRimOp = clampI(f, 0, 8);
  const shieldBodyDraw = draw(f, 14, 26, 1200);
  const shieldBodyOp = clampI(f, 12, 20);

  // Veine or (L20, "l'or,")
  const orDraw = draw(f, 20, 20, 500);
  const orOp = clampI(f, 18, 28);
  // Cartouche + labels Mali/Burkina (L40-82)
  const orCartoucheOp = clampI(f, 40, 55);
  const paysMaliBurkinaOp = clampI(f, 62, 82);

  // Veine uranium (L157, "l'uranium")
  const uraniumDraw = draw(f, 157, 14, 500);
  const uraniumOp = clampI(f, 155, 163);
  // Veine pétrole (L184-188, cascade ~10f après)
  const petroleDraw = draw(f, 188, 14, 550);
  const petroleOp = clampI(f, 186, 194);
  // Cartouches uranium/pétrole + label Niger (L204)
  const uraniumCartoucheOp = clampI(f, 200, 212);
  const petroleCartoucheOp = clampI(f, 204, 216);
  const paysNigerOp = clampI(f, 204, 216);

  // Halo qui commence a pulser (L247-305, "Ce sont...besoin,")
  const haloRampOp = clampI(f, 247, 305, 0, 0.22);
  // Pic d'intensite (L333-363, "et c'est...ce levier")
  const haloPicOp = clampI(f, 333, 363, 0, 0.48);
  const blazonGlow = clampI(f, 333, 363, 0, 0.35);

  // Plateau : halo pulse doux en continu apres le pic
  const haloBreathe = f >= 363 ? 0.30 + 0.14 * Math.sin((f - 363) / (2.2 * fps) * Math.PI * 2) : 0;
  const haloOp = f < 247 ? 0 : f < 333 ? haloRampOp : f < 363 ? haloPicOp : haloBreathe;

  // Battement sequence sur "trois pays de tenir" (L392-448)
  const beatOr = interpolate(f, [392, 400, 408], [1, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beatUranium = interpolate(f, [400, 408, 416], [1, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beatPetrole = interpolate(f, [408, 416, 424], [1, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flux qui CIRCULENT en continu une fois tracés (retour Aziz : "occasion manquée", les veines doivent
  // paraître vivantes, pas figées après apparition). Gouttes en boucle continue le long du path (t croît
  // sans fin, strokeDashoffset défile — pas besoin de modulo, un offset négatif continu boucle nativement).
  const orFlowT = f >= 40 ? (f - 40) / 55 : 0;
  const orFlowOp = clampI(f, 40, 55);
  const uraniumFlowT = f >= 177 ? (f - 177) / 55 : 0;
  const uraniumFlowOp = clampI(f, 177, 192);
  const petroleFlowT = f >= 208 ? (f - 208) / 55 : 0;
  const petroleFlowOp = clampI(f, 208, 223);

  // Fondu de sortie tres progressif dans les 20 dernieres frames (evite un "trou" percu)
  const localOut = outAt - inAt;
  const exitOp = clampI(f, localOut - 20, localOut, 1, 0.85);

  return (
    <AbsoluteFill style={{ opacity: exitOp }}>
      <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} startFrom={inAt + 20} volume={0.3} />
      <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} startFrom={inAt + 157} volume={0.28} />
      <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} startFrom={inAt + 188} volume={0.28} />

      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="res-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eadbba" />
            <stop offset="100%" stopColor="#d2be97" />
          </linearGradient>
          <linearGradient id="res-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9de79" />
            <stop offset="100%" stopColor="#c99f2e" />
          </linearGradient>
          <linearGradient id="res-v1-gold-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A67C00" />
            <stop offset="50%" stopColor="#FFDF73" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>
          <linearGradient id="res-v1-uranium-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2B4C33" />
            <stop offset="50%" stopColor="#87C177" />
            <stop offset="100%" stopColor="#D1FFB8" />
          </linearGradient>
          <linearGradient id="res-v1-petrole-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111111" />
            <stop offset="50%" stopColor="#3A2F25" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>
          <linearGradient id="res-shield-rim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dcb970" />
            <stop offset="50%" stopColor="#a28145" />
            <stop offset="100%" stopColor="#634a21" />
          </linearGradient>
          <linearGradient id="res-shield-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4e463c" />
            <stop offset="100%" stopColor="#1f1a16" />
          </linearGradient>
          <linearGradient id="res-lever-metal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9f907b" />
            <stop offset="100%" stopColor="#504537" />
          </linearGradient>
          <pattern id="res-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#110e0c" strokeWidth={1.5} opacity={0.4} />
          </pattern>
        </defs>

        <rect width="1920" height="1080" fill="url(#res-bg-grad)" />
        <g opacity={0.6}>
          <circle cx="960" cy="340" r="350" fill="none" stroke="#c2ac83" strokeWidth={1} />
          <circle cx="960" cy="340" r="600" fill="none" stroke="#c2ac83" strokeWidth={1} />
          <line x1="960" y1="0" x2="960" y2="1080" stroke="#c2ac83" strokeWidth={1} opacity={0.83} />
          <line x1="0" y1="340" x2="1920" y2="340" stroke="#c2ac83" strokeWidth={1} opacity={0.83} />
        </g>
        <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="#695941" strokeWidth={3} />
        <rect x="50" y="50" width="1820" height="980" fill="none" stroke="#695941" strokeWidth={1} />

        {/* Veine OR (Mali+Burkina) */}
        <g opacity={orOp} style={{ ...orDraw, transform: `scale(${beatOr})`, transformOrigin: "600px 900px" }}>
          <path d="M 300 1040 Q 400 850, 600 800 T 800 600 L 860 600 Q 650 800, 400 1040 Z" fill="url(#res-v1-gold-grad)" stroke="#4A3515" strokeWidth={3} />
          <path d="M 500 1040 Q 550 880, 650 820 T 830 600 L 890 600 Q 750 830, 600 1040 Z" fill="url(#res-v1-gold-grad)" stroke="#4A3515" strokeWidth={3} />
          <path d="M 320 1030 Q 420 860, 610 810 T 810 610" fill="none" stroke="#FFDF73" strokeWidth={1.5} />
          <path d="M 520 1030 Q 570 890, 660 830 T 840 610" fill="none" stroke="#FFDF73" strokeWidth={1.5} />
        </g>
        {orFlowOp > 0.01 && (
          <g opacity={orFlowOp}>
            <FlowDots d="M 360 1030 Q 460 850, 650 800 T 830 605" color="#FFF4C2" t={orFlowT} totalLen={520} />
          </g>
        )}

        {/* Veine URANIUM (Niger) */}
        <g opacity={uraniumOp} style={{ ...uraniumDraw, transform: `scale(${beatUranium})`, transformOrigin: "1300px 900px" }}>
          <path d="M 1600 1040 L 1550 900 L 1400 850 L 1320 750 L 1200 650 L 1080 600 L 1020 600 L 1150 670 L 1280 780 L 1350 880 L 1500 930 L 1550 1040 Z" fill="url(#res-v1-uranium-grad)" stroke="#1C2E1D" strokeWidth={3} />
          <path d="M 1550 900 L 1450 850 L 1350 800" fill="none" stroke="#D1FFB8" strokeWidth={1.5} />
        </g>
        {uraniumFlowOp > 0.01 && (
          <g opacity={uraniumFlowOp}>
            <FlowDots d="M 1560 1010 L 1470 870 L 1330 770 L 1180 660 L 1075 605" color="#E8FFDA" t={uraniumFlowT} totalLen={520} />
          </g>
        )}

        {/* Veine PETROLE (Niger) */}
        <g opacity={petroleOp} style={{ ...petroleDraw, transform: `scale(${beatPetrole})`, transformOrigin: "1600px 900px" }}>
          <path d="M 1600 1040 C 1700 900, 1800 800, 1550 700 C 1400 640, 1250 650, 1100 600 L 1040 600 C 1200 680, 1350 720, 1480 750 C 1680 800, 1600 950, 1550 1040 Z" fill="url(#res-v1-petrole-grad)" stroke="#000000" strokeWidth={3} />
          <path d="M 1580 1000 C 1650 900, 1700 830, 1550 730 C 1420 680, 1280 670, 1120 620" fill="none" stroke="#5A4D41" strokeWidth={2} />
        </g>
        {petroleFlowOp > 0.01 && (
          <g opacity={petroleFlowOp}>
            <FlowDots d="M 1590 1000 C 1660 900, 1710 830, 1560 730 C 1430 680, 1290 670, 1130 620" color="#8A7A6C" t={petroleFlowT} totalLen={560} />
          </g>
        )}

        {/* Fulcrum (lever/socle) */}
        <g opacity={fulcrumOp}>
          <path d="M 740 280 A 320 320 0 0 0 580 540" fill="none" stroke="#3b3227" strokeWidth={3} />
          <path d="M 1180 280 A 320 320 0 0 1 1340 540" fill="none" stroke="#3b3227" strokeWidth={3} />
          <path d="M 620 570 L 1300 570 L 1330 595 L 1300 620 L 620 620 L 590 595 Z" fill="url(#res-lever-metal)" stroke="#25211d" strokeWidth={4} />
          {[670, 770, 870, 960, 1050, 1150, 1250].map((cx) => (
            <circle key={cx} cx={cx} cy="595" r="8" fill="#302a22" stroke="#15120e" strokeWidth={1} />
          ))}
          <path d="M 900 570 L 1020 570 L 1000 540 L 920 540 Z" fill="url(#res-lever-metal)" stroke="#25211d" strokeWidth={3} />
        </g>

        {/* Bouclier — SE DESSINE au contour (retour Aziz : "faire un stroke de dessin, technique qui
             fonctionne très bien"), rebord d'abord puis corps intérieur */}
        <g opacity={shieldRimOp} style={shieldRimDraw}>
          <path d="M 960 160 C 1050 160, 1140 180, 1180 230 C 1180 430, 1080 520, 960 560 C 840 520, 740 430, 740 230 C 780 180, 870 160, 960 160 Z" fill="none" stroke="#dcb970" strokeWidth={5} />
        </g>
        <g opacity={shieldRimOp}>
          <path d="M 960 160 C 1050 160, 1140 180, 1180 230 C 1180 430, 1080 520, 960 560 C 840 520, 740 430, 740 230 C 780 180, 870 160, 960 160 Z" fill="url(#res-shield-rim)" stroke="#25211d" strokeWidth={5} opacity={shieldBodyOp > 0.3 ? 1 : 0} />
        </g>
        <g opacity={shieldBodyOp} style={shieldBodyDraw}>
          <path d="M 960 185 C 1035 185, 1110 200, 1150 245 C 1150 415, 1060 495, 960 530 C 860 495, 770 415, 770 245 C 810 200, 885 185, 960 185 Z" fill="none" stroke="#15120e" strokeWidth={3} />
        </g>
        <g opacity={shieldBodyOp}>
          <path d="M 960 185 C 1035 185, 1110 200, 1150 245 C 1150 415, 1060 495, 960 530 C 860 495, 770 415, 770 245 C 810 200, 885 185, 960 185 Z" fill="url(#res-shield-metal)" />
          <path d="M 960 185 C 1035 185, 1110 200, 1150 245 C 1150 415, 1060 495, 960 530 C 860 495, 770 415, 770 245 C 810 200, 885 185, 960 185 Z" fill="url(#res-hatch)" />
          <line x1="960" y1="185" x2="960" y2="530" stroke="#15120e" strokeWidth={4} />
          <path d="M 960 200 C 1025 200, 1090 215, 1130 255 C 1130 405, 1045 475, 960 510 C 875 475, 790 405, 790 255 C 830 215, 895 200, 960 200 Z" fill="none" stroke="#b59765" strokeWidth={1.5} opacity={0.4} />
        </g>

        <g opacity={shieldBodyOp}>
          {/* Halo derriere le blason — intensite qui monte au fil de la scene */}
          <circle cx="960" cy="350" r="250" fill="#E3B864" opacity={haloOp} />

          {/* Blason : SCEAU AES (repris de ConfederationReveal, Partie4Cout.tsx) — remplace l'étoile
              générique, cohérence narrative avec le sceau qui scelle la confédération plus loin dans P4 */}
          <g opacity={1 + blazonGlow * 0.15}>
            <circle cx="960" cy="350" r="95" fill="#16130c" opacity={0.5} />
            <circle cx="960" cy="350" r="88" fill="url(#res-gold-grad)" stroke="#3A2A12" strokeWidth={4} />
            <circle cx="960" cy="350" r="74" fill="none" stroke="#F4ECD8" strokeWidth={2.5} strokeDasharray="6 5" opacity={0.85} />
            <polygon points="960,300 970,332 1004,332 977,352 987,384 960,364 933,384 943,352 916,332 950,332" fill="#F4ECD8" stroke="#F4ECD8" strokeWidth={1} />
            <text x="960" y="410" textAnchor="middle" fontSize={18} fontWeight="800" fill="#3A2A12" fontFamily="Georgia, serif" letterSpacing={2}>A · E · S</text>
          </g>
        </g>

        {/* Cartouches ressources */}
        <g opacity={orCartoucheOp}>
          <rect x="483" y="743" width="130" height="45" rx={5} fill="#2b2722" opacity={0.3} />
          <rect x="480" y="740" width="130" height="45" rx={5} fill="#ebd69f" stroke="#25211d" strokeWidth={3} />
          <text x="545" y="769" fontFamily="serif" fontWeight="bold" fontSize={20} fill="#25211d" textAnchor="middle" letterSpacing={3}>OR</text>
        </g>
        <g opacity={uraniumCartoucheOp}>
          <rect x="1093" y="773" width="170" height="45" rx={5} fill="#2b2722" opacity={0.3} />
          <rect x="1090" y="770" width="170" height="45" rx={5} fill="#aedda4" stroke="#25211d" strokeWidth={3} />
          <text x="1175" y="799" fontFamily="serif" fontWeight="bold" fontSize={20} fill="#25211d" textAnchor="middle" letterSpacing={3}>URANIUM</text>
        </g>
        <g opacity={petroleCartoucheOp}>
          <rect x="1613" y="613" width="160" height="45" rx={5} fill="#2b2722" opacity={0.3} />
          <rect x="1610" y="610" width="160" height="45" rx={5} fill="#322c26" stroke="#dcb970" strokeWidth={3} />
          <text x="1690" y="639" fontFamily="serif" fontWeight="bold" fontSize={20} fill="#fdfaf3" textAnchor="middle" letterSpacing={3}>PETROLE</text>
        </g>

        {/* Noms des pays — bordure basse, hors emprise des veines */}
        <g>
          <text x="160" y="1050" opacity={paysMaliBurkinaOp} fontFamily="Georgia, serif" fontSize={19} fill="#5C4A36" fontWeight="bold" letterSpacing={3}>MALI</text>
          <text x="700" y="1050" opacity={paysMaliBurkinaOp} fontFamily="Georgia, serif" fontSize={19} fill="#5C4A36" fontWeight="bold" letterSpacing={3}>BURKINA FASO</text>
          <text x="1760" y="1050" opacity={paysNigerOp} fontFamily="Georgia, serif" fontSize={19} fill="#5C4A36" fontWeight="bold" letterSpacing={3} textAnchor="end">NIGER</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default ResourcesRevealSVG;
