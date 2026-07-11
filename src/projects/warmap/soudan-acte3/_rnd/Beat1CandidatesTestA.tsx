/**
 * Beat1CandidatesTestA — comparaison EXACTE concept A (jauge qui fuit + 2 sources + filet mystere qui
 * s inverse), copie fidele des 2 JSON generes (commentaires HTML de Gemini convertis en JSX).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const BEAT1A_TEST_FRAMES = 523;
export const BEAT1A_TEST_FPS = 30;

export const Beat1ACandidateSol: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#F2E5C8" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g opacity={f < 483 ? 1 : Math.max(0.35, 1 - 0.65 * ((f - 483) / 40))}><rect x="0" y="0" width="1920" height="1080" fill="#F2E5C8"/><rect x="28" y="28" width="1864" height="1024" rx="10" fill="none" stroke="#3A2A18" strokeWidth="3" opacity="0.2"/><path d="M90 190 C310 155 470 205 690 175 M1240 160 C1480 205 1690 145 1840 185 M110 900 C300 865 490 920 670 890 M1260 910 C1470 870 1670 925 1840 880" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.08"/><g opacity={Math.max(0, Math.min(1, (f - 134) / 16))}><circle cx="500" cy="700" r="76" fill="#F2E5C8" stroke="#B14B3C" strokeWidth="9"/><circle cx="500" cy="700" r="63" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.35"/><polygon points="500,666 534,700 500,734 466,700" fill="#B14B3C" stroke="#3A2A18" strokeWidth="3"/><text x="500" y="711" textAnchor="middle" fontFamily="Georgia, serif" fontSize="31" fontWeight="700" fill="#F2E5C8">R</text><circle cx="1420" cy="700" r="76" fill="#F2E5C8" stroke="#3E6E9E" strokeWidth="9"/><circle cx="1420" cy="700" r="63" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.35"/><polygon points="1420,666 1454,700 1420,734 1386,700" fill="#3E6E9E" stroke="#3A2A18" strokeWidth="3"/><text x="1420" y="711" textAnchor="middle" fontFamily="Georgia, serif" fontSize="31" fontWeight="700" fill="#F2E5C8">S</text><path d="M570 690 L930 570" fill="none" stroke="#3A2A18" strokeWidth="15" opacity="0.16" strokeLinecap="round"/><path d="M570 690 L930 570" fill="none" stroke="#B14B3C" strokeWidth="7" strokeLinecap="round"/><path d="M1350 690 L990 570" fill="none" stroke="#3A2A18" strokeWidth="15" opacity="0.16" strokeLinecap="round"/><path d="M1350 690 L990 570" fill="none" stroke="#3E6E9E" strokeWidth="7" strokeLinecap="round"/><polygon points="895,568 928,570 904,592" fill="#B14B3C"/><polygon points="1025,568 992,570 1016,592" fill="#3E6E9E"/><g fill="#D4A574" stroke="#3A2A18" strokeWidth="1.5"><circle cx={570 + 360 * ((((f - 134) * 5) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5) % 120) / 120)} r="8"/><circle cx={570 + 360 * ((((f - 134) * 5 + 30) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 30) % 120) / 120)} r="7"/><circle cx={570 + 360 * ((((f - 134) * 5 + 60) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 60) % 120) / 120)} r="8"/><circle cx={570 + 360 * ((((f - 134) * 5 + 90) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 90) % 120) / 120)} r="6"/><circle cx={1350 - 360 * ((((f - 134) * 5) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5) % 120) / 120)} r="8"/><circle cx={1350 - 360 * ((((f - 134) * 5 + 30) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 30) % 120) / 120)} r="7"/><circle cx={1350 - 360 * ((((f - 134) * 5 + 60) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 60) % 120) / 120)} r="8"/><circle cx={1350 - 360 * ((((f - 134) * 5 + 90) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 90) % 120) / 120)} r="6"/></g></g><g opacity={Math.max(0, Math.min(1, (f - 302) / 12))}><path d="M1920 360 L990 570" fill="none" stroke="#8A8F94" strokeWidth="24" opacity="0.1" strokeLinecap="round"/><path d="M1920 360 L990 570" fill="none" stroke="#8A8F94" strokeWidth="10" strokeDasharray="18 17" strokeDashoffset={f < 367 ? -f * 5 : f * 6} strokeLinecap="round" opacity="0.9"/><polygon points={f < 367 ? '1275,480 1238,514 1287,513' : '1637,404 1674,370 1625,371'} fill="#8A8F94" stroke="#3A2A18" strokeWidth="2"/><g fill="#8A8F94" stroke="#3A2A18" strokeWidth="1.5"><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4) % 140) / 140) : 990 + 930 * ((((f - 367) * 5) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4) % 140) / 140) : 570 - 210 * ((((f - 367) * 5) % 140) / 140)} r="10"/><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4 + 35) % 140) / 140) : 990 + 930 * ((((f - 367) * 5 + 35) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4 + 35) % 140) / 140) : 570 - 210 * ((((f - 367) * 5 + 35) % 140) / 140)} r="8"/><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4 + 70) % 140) / 140) : 990 + 930 * ((((f - 367) * 5 + 70) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4 + 70) % 140) / 140) : 570 - 210 * ((((f - 367) * 5 + 70) % 140) / 140)} r="11"/><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4 + 105) % 140) / 140) : 990 + 930 * ((((f - 367) * 5 + 105) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4 + 105) % 140) / 140) : 570 - 210 * ((((f - 367) * 5 + 105) % 140) / 140)} r="8"/></g></g><g><ellipse cx="960" cy="570" rx="66" ry="17" fill="#3A2A18" opacity="0.22"/><ellipse cx="960" cy="570" rx="53" ry="11" fill="#D4A574" stroke="#3A2A18" strokeWidth="3"/><rect x="900" y="560" width="120" height="470" rx="8" fill="#F2E5C8" fillOpacity="0.72" stroke="#3A2A18" strokeWidth="8"/><rect x="916" y="0" width="88" height="1" fill="#D4A574" transform={`translate(0 1014) scale(1 ${-(f < 134 ? 372 - 184 * (f / 134) : f < 302 ? 188 - 4 * Math.sin((f - 134) * 0.11) : f < 367 ? 188 + 66 * ((f - 302) / 65) - 3 * Math.sin((f - 302) * 0.11) : 254 - 14 * Math.min(1, (f - 367) / 116) - 3 * Math.sin((f - 367) * 0.09))})`}/><path d="M916 1014 L1004 1014" stroke="#3A2A18" strokeWidth="4" opacity="0.5"/><path d="M900 650 L914 650 M900 760 L914 760 M900 870 L914 870 M900 980 L914 980 M1006 650 L1020 650 M1006 760 L1020 760 M1006 870 L1020 870 M1006 980 L1020 980" fill="none" stroke="#3A2A18" strokeWidth="3" opacity="0.55"/><ellipse cx="960" cy="1028" rx="25" ry="8" fill="#3A2A18"/><ellipse cx="960" cy="1029" rx="15" ry="5" fill="#D4A574"/></g><g fill="#D4A574" stroke="#3A2A18" strokeWidth="1"><circle cx={952 + 5 * Math.sin(f * 0.13)} cy={1028 + ((f * 7) % 62)} r="6"/><circle cx={968 + 4 * Math.sin(f * 0.11 + 2)} cy={1028 + ((f * 7 + 16) % 62)} r="5"/><circle cx={959 + 7 * Math.sin(f * 0.09 + 4)} cy={1028 + ((f * 7 + 32) % 62)} r="7"/><circle cx={944 + 3 * Math.sin(f * 0.15 + 1)} cy={1028 + ((f * 7 + 48) % 62)} r="4"/></g><line x1="960" y1="1030" x2="960" y2="1080" stroke="#D4A574" strokeWidth="5" strokeDasharray="5 12" strokeDashoffset={-f * 7} opacity="0.75"/></g>
      </svg>
      <div style={{ position: "absolute", top: 20, left: 20, color: "#000", fontFamily: "monospace", fontSize: 20 }}>SOL-A — f={f}</div>
    </AbsoluteFill>
  );
};

export const Beat1ACandidateGemini: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#F2E5C8" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g opacity={f >= 483 ? Math.max(0.35, 1 - (f - 483) / 40 * 0.65) : 1}>
  <rect width="1920" height="1080" fill="#F2E5C8" />

  {/* Cadre documentaire style parchemin */}
  <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.3" />
  <rect x="50" y="50" width="1820" height="980" fill="none" stroke="#3A2A18" strokeWidth="1" opacity="0.15" />

  {/* PHASE A : Particules de fuite (sablier/puits sans fond) */}
  <g opacity={f < 110 ? 1 : Math.max(0, 1 - (f - 110) / 15)}>
    <circle cx="930" cy={1040 + ((f * 8 + 10) % 80)} r="5" fill="#D4A574" opacity={1 - ((f * 8 + 10) % 80)/80} />
    <circle cx="950" cy={1040 + ((f * 12 + 40) % 90)} r="4" fill="#D4A574" opacity={1 - ((f * 12 + 40) % 90)/90} />
    <circle cx="970" cy={1040 + ((f * 10 + 70) % 85)} r="6" fill="#D4A574" opacity={1 - ((f * 10 + 70) % 85)/85} />
    <circle cx="990" cy={1040 + ((f * 14 + 20) % 95)} r="3" fill="#D4A574" opacity={1 - ((f * 14 + 20) % 95)/95} />
  </g>

  {/* PHASE C & D : Flux exterieur gris metal (Mystere/Inversion) */}
  <g opacity={f < 302 ? 0 : Math.min(1, (f - 302) / 15)}>
    {/* Ombre/base du tuyau */}
    <path d="M 1950 100 L 1020 100 Q 960 100 960 160 L 960 530" stroke="#3A2A18" strokeWidth="12" fill="none" opacity="0.1" strokeLinejoin="round" />
    {/* Flux directionnel anime (s'inverse a f=367) */}
    <path d="M 1950 100 L 1020 100 Q 960 100 960 160 L 960 530" stroke="#8A8F94" strokeWidth="8" fill="none" strokeDasharray="25 15" strokeDashoffset={f < 367 ? -(f - 302) * 12 : -780 + (f - 367) * 12} strokeLinejoin="round" />
  </g>

  {/* PHASE B : Factions RSF (gauche) et SAF (droite) */}
  <g opacity={f < 134 ? 0 : Math.min(1, (f - 134) / 15)}>
    {/* Tuyau RSF */}
    <path d="M 660 450 L 900 450 Q 930 450 930 480 L 930 530" stroke="#3A2A18" strokeWidth="10" fill="none" opacity="0.1" />
    <path d="M 660 450 L 900 450 Q 930 450 930 480 L 930 530" stroke="#B14B3C" strokeWidth="6" fill="none" strokeDasharray="20 15" strokeDashoffset={-f * 8} />

    {/* Tuyau SAF */}
    <path d="M 1260 450 L 1020 450 Q 990 450 990 480 L 990 530" stroke="#3A2A18" strokeWidth="10" fill="none" opacity="0.1" />
    <path d="M 1260 450 L 1020 450 Q 990 450 990 480 L 990 530" stroke="#3E6E9E" strokeWidth="6" fill="none" strokeDasharray="20 15" strokeDashoffset={-f * 8} />

    {/* Source RSF (Rouge Brique) */}
    <circle cx="600" cy="450" r="70" fill="none" stroke="#B14B3C" strokeWidth="2" opacity="0.3" />
    <circle cx="600" cy="450" r="60" fill="#F2E5C8" stroke="#B14B3C" strokeWidth="4" />
    <polygon points="600,405 645,450 600,495 555,450" fill="#B14B3C" opacity="0.15" />
    <text x="600" y="462" fontSize="36" fontFamily="serif" fontWeight="bold" fill="#B14B3C" textAnchor="middle">R</text>

    {/* Source SAF (Bleu Ardoise) */}
    <circle cx="1320" cy="450" r="70" fill="none" stroke="#3E6E9E" strokeWidth="2" opacity="0.3" />
    <circle cx="1320" cy="450" r="60" fill="#F2E5C8" stroke="#3E6E9E" strokeWidth="4" />
    <polygon points="1320,405 1365,450 1320,495 1275,450" fill="#3E6E9E" opacity="0.15" />
    <text x="1320" y="462" fontSize="36" fontFamily="serif" fontWeight="bold" fill="#3E6E9E" textAnchor="middle">S</text>
  </g>

  {/* JAUGE CENTRALE (Le puits d'argent) */}
  <g>
    {/* Fond de la jauge avec couleur parchemin foncee */}
    <rect x="900" y="540" width="120" height="500" fill="#EAE0C9" />

    {/* Graduations internes (style instrument de mesure) */}
    <g stroke="#3A2A18" strokeWidth="2" opacity="0.4">
      <line x1="900" y1="590" x2="1020" y2="590" />
      <line x1="900" y1="640" x2="1020" y2="640" />
      <line x1="900" y1="690" x2="1020" y2="690" />
      <line x1="900" y1="740" x2="1020" y2="740" />
      <line x1="900" y1="790" x2="1020" y2="790" />
      <line x1="900" y1="840" x2="1020" y2="840" />
      <line x1="900" y1="890" x2="1020" y2="890" />
      <line x1="900" y1="940" x2="1020" y2="940" />
      <line x1="900" y1="990" x2="1020" y2="990" />
    </g>

    {/* Petits reperes externes gauches */}
    <g stroke="#3A2A18" strokeWidth="3">
      <line x1="880" y1="590" x2="900" y2="590" />
      <line x1="890" y1="640" x2="900" y2="640" />
      <line x1="880" y1="690" x2="900" y2="690" />
      <line x1="890" y1="740" x2="900" y2="740" />
      <line x1="880" y1="790" x2="900" y2="790" />
      <line x1="890" y1="840" x2="900" y2="840" />
      <line x1="880" y1="890" x2="900" y2="890" />
      <line x1="890" y1="940" x2="900" y2="940" />
      <line x1="880" y1="990" x2="900" y2="990" />
    </g>

    {/* L'OR (Corps principal) */}
    <rect
      x="902"
      width="116"
      y={1038 - (f < 134 ? 425 - (f/134)*225 : f < 302 ? 200 : f < 367 ? 200 + ((f-302)/65)*100 : 300)}
      height={f < 134 ? 425 - (f/134)*225 : f < 302 ? 200 : f < 367 ? 200 + ((f-302)/65)*100 : 300}
      fill="#D4A574"
    />
    {/* L'OR (Surface de l'or pour effet de profondeur/dynamique) */}
    <rect
      x="902"
      width="116"
      y={1038 - (f < 134 ? 425 - (f/134)*225 : f < 302 ? 200 : f < 367 ? 200 + ((f-302)/65)*100 : 300)}
      height="8"
      fill="#E8BD8D"
    />

    {/* Contour final de la jauge (encre) */}
    <rect x="900" y="540" width="120" height="500" fill="none" stroke="#3A2A18" strokeWidth="6" rx="4" />
  </g>
</g>
      </svg>
      <div style={{ position: "absolute", top: 20, left: 20, color: "#000", fontFamily: "monospace", fontSize: 20 }}>GEMINI-A — f={f}</div>
    </AbsoluteFill>
  );
};
