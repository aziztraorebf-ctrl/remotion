/**
 * Beat1CandidatesTest — proto ISOLE, comparaison EXACTE (copie fidele des 2 JSON generes, pas retapee
 * a la main) des 2 candidats SVG pour l'insert Beat1Paradoxe.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const BEAT1_TEST_FRAMES = 523;
export const BEAT1_TEST_FPS = 30;

export const Beat1CandidateSol: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g opacity={1 - 0.65 * Math.min(1, Math.max(0, (f - 483) / 40))}><rect x="0" y="0" width="1920" height="1080" fill="#F2E5C8"/><rect x="34" y="34" width="1852" height="1012" rx="18" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.3"/><rect x="48" y="48" width="1824" height="984" rx="14" fill="none" stroke="#D4A574" strokeWidth="1.5" opacity="0.34"/><path d="M95 180 C360 155 535 194 790 168 S1325 145 1818 180" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.08"/><path d="M82 878 C350 910 590 862 805 892 S1360 925 1835 884" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.07"/><path d="M145 276 C425 252 640 284 840 262" fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.12"/><path d="M1080 267 C1325 290 1510 250 1770 278" fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.12"/><circle cx="176" cy="340" r="3" fill="#3A2A18" opacity="0.13"/><circle cx="284" cy="818" r="4" fill="#D4A574" opacity="0.22"/><circle cx="455" cy="214" r="2.5" fill="#3A2A18" opacity="0.12"/><circle cx="739" cy="927" r="3.5" fill="#3A2A18" opacity="0.1"/><circle cx="1188" cy="164" r="3" fill="#D4A574" opacity="0.22"/><circle cx="1488" cy="896" r="4" fill="#3A2A18" opacity="0.11"/><circle cx="1734" cy="362" r="2.5" fill="#3A2A18" opacity="0.12"/><path d="M960 244 L951 273 L966 299 L955 327 L964 352 L952 382 L967 409 L957 438 L960 474" fill="none" stroke="#D4A574" strokeWidth={18 + 5 * (() => { if (f < 20) return 0; let c; if (f <= 302) c = (f - 20) / 24; else if (f <= 342) c = 282 / 24 + (f - 302) / 48; else if (f <= 367) { const t = f - 342; c = 282 / 24 + 40 / 48 + t / 48 + (1 / 24 - 1 / 48) * t * t / 50; } else c = 282 / 24 + 40 / 48 + 25 / 48 + (1 / 24 - 1 / 48) * 12.5 + (f - 367) / 24; return 0.5 + 0.5 * Math.sin(2 * Math.PI * c); })()} strokeLinecap="round" strokeLinejoin="round" opacity={0.12 + 0.12 * (() => { if (f < 20) return 0; let c; if (f <= 302) c = (f - 20) / 24; else if (f <= 342) c = 282 / 24 + (f - 302) / 48; else if (f <= 367) { const t = f - 342; c = 282 / 24 + 40 / 48 + t / 48 + (1 / 24 - 1 / 48) * t * t / 50; } else c = 282 / 24 + 40 / 48 + 25 / 48 + (1 / 24 - 1 / 48) * 12.5 + (f - 367) / 24; return 0.5 + 0.5 * Math.sin(2 * Math.PI * c); })()} strokeDasharray="320" strokeDashoffset={320 * (1 - Math.min(1, Math.max(0, f / 20)))}/><path d="M960 244 L951 273 L966 299 L955 327 L964 352 L952 382 L967 409 L957 438 L960 474" fill="none" stroke="#3A2A18" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" opacity="0.88" strokeDasharray="320" strokeDashoffset={320 * (1 - Math.min(1, Math.max(0, f / 20)))}/><path d="M960 244 L951 273 L966 299 L955 327 L964 352 L952 382 L967 409 L957 438 L960 474" fill="none" stroke="#D4A574" strokeWidth={5.5 + 2.5 * (() => { if (f < 20) return 0; let c; if (f <= 302) c = (f - 20) / 24; else if (f <= 342) c = 282 / 24 + (f - 302) / 48; else if (f <= 367) { const t = f - 342; c = 282 / 24 + 40 / 48 + t / 48 + (1 / 24 - 1 / 48) * t * t / 50; } else c = 282 / 24 + 40 / 48 + 25 / 48 + (1 / 24 - 1 / 48) * 12.5 + (f - 367) / 24; return 0.5 + 0.5 * Math.sin(2 * Math.PI * c); })()} strokeLinecap="round" strokeLinejoin="round" opacity={0.76 + 0.22 * (() => { if (f < 20) return 0; let c; if (f <= 302) c = (f - 20) / 24; else if (f <= 342) c = 282 / 24 + (f - 302) / 48; else if (f <= 367) { const t = f - 342; c = 282 / 24 + 40 / 48 + t / 48 + (1 / 24 - 1 / 48) * t * t / 50; } else c = 282 / 24 + 40 / 48 + 25 / 48 + (1 / 24 - 1 / 48) * 12.5 + (f - 367) / 24; return 0.5 + 0.5 * Math.sin(2 * Math.PI * c); })()} strokeDasharray="320" strokeDashoffset={320 * (1 - Math.min(1, Math.max(0, f / 20)))}/><g opacity={f < 134 ? 0 : 1}><path d="M960 474 C895 512 828 544 776 592 C725 638 686 674 640 710" fill="none" stroke="#3A2A18" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="520" strokeDashoffset={520 * (1 - Math.min(1, Math.max(0, (f - 134) / 30)))}/><path d="M960 474 C895 512 828 544 776 592 C725 638 686 674 640 710" fill="none" stroke="#B14B3C" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="520" strokeDashoffset={520 * (1 - Math.min(1, Math.max(0, (f - 134) / 30)))}/><path d="M960 474 C895 512 828 544 776 592 C725 638 686 674 640 710" fill="none" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity={0.65 + 0.3 * Math.sin(f / 9)} strokeDasharray="520" strokeDashoffset={520 * (1 - Math.min(1, Math.max(0, (f - 134) / 30)))}/><path d="M960 474 C1025 512 1092 544 1144 592 C1195 638 1234 674 1280 710" fill="none" stroke="#3A2A18" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="520" strokeDashoffset={520 * (1 - Math.min(1, Math.max(0, (f - 134) / 30)))}/><path d="M960 474 C1025 512 1092 544 1144 592 C1195 638 1234 674 1280 710" fill="none" stroke="#3E6E9E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="520" strokeDashoffset={520 * (1 - Math.min(1, Math.max(0, (f - 134) / 30)))}/><path d="M960 474 C1025 512 1092 544 1144 592 C1195 638 1234 674 1280 710" fill="none" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity={0.65 + 0.3 * Math.sin(f / 9 + Math.PI)} strokeDasharray="520" strokeDashoffset={520 * (1 - Math.min(1, Math.max(0, (f - 134) / 30)))}/></g><circle cx="960" cy="474" r={18 + 5 * (() => { if (f < 20) return 0; let c; if (f <= 302) c = (f - 20) / 24; else if (f <= 342) c = 282 / 24 + (f - 302) / 48; else if (f <= 367) { const t = f - 342; c = 282 / 24 + 40 / 48 + t / 48 + (1 / 24 - 1 / 48) * t * t / 50; } else c = 282 / 24 + 40 / 48 + 25 / 48 + (1 / 24 - 1 / 48) * 12.5 + (f - 367) / 24; return 0.5 + 0.5 * Math.sin(2 * Math.PI * c); })()} fill="#F2E5C8" stroke="#3A2A18" strokeWidth="5" opacity={Math.min(1, Math.max(0, (f - 14) / 6))}/><circle cx="960" cy="474" r={10 + 4 * (() => { if (f < 20) return 0; let c; if (f <= 302) c = (f - 20) / 24; else if (f <= 342) c = 282 / 24 + (f - 302) / 48; else if (f <= 367) { const t = f - 342; c = 282 / 24 + 40 / 48 + t / 48 + (1 / 24 - 1 / 48) * t * t / 50; } else c = 282 / 24 + 40 / 48 + 25 / 48 + (1 / 24 - 1 / 48) * 12.5 + (f - 367) / 24; return 0.5 + 0.5 * Math.sin(2 * Math.PI * c); })()} fill="#D4A574" stroke="#3A2A18" strokeWidth="2" opacity={Math.min(1, Math.max(0, (f - 16) / 4))}/><g opacity={f < 164 ? 0 : Math.min(1, 0.25 + (f - 164) / 8)}><circle cx="640" cy="710" r="105" fill="#F2E5C8" stroke="#3A2A18" strokeWidth="3" opacity="0.96"/><circle cx="640" cy="710" r="92" fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.42"/><circle cx="640" cy="710" r="86" fill="none" stroke="#3A2A18" strokeWidth="18" opacity="0.2"/><circle cx="640" cy="710" r="86" fill="none" stroke="#B14B3C" strokeWidth="18" strokeLinecap="round" transform="rotate(-90 640 710)" strokeDasharray="540.35" strokeDashoffset={540.35 * (1 - (0.625 + 0.275 * Math.sin((() => { let c; if (f <= 302) c = (f - 164) / 56; else if (f <= 342) c = 138 / 56 + (f - 302) / 112; else if (f <= 367) { const t = f - 342; c = 138 / 56 + 40 / 112 + t / 112 + (1 / 56 - 1 / 112) * t * t / 50; } else c = 138 / 56 + 40 / 112 + 25 / 112 + (1 / 56 - 1 / 112) * 12.5 + (f - 367) / 56; return 2 * Math.PI * c; })())))}/><circle cx="640" cy="710" r="58" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.35"/><circle cx="640" cy="710" r={13 + 3 * Math.sin(f / 12)} fill="#D4A574" stroke="#3A2A18" strokeWidth="3"/><line x1="640" y1="594" x2="640" y2="610" stroke="#3A2A18" strokeWidth="3"/><line x1="640" y1="810" x2="640" y2="826" stroke="#3A2A18" strokeWidth="3"/><line x1="524" y1="710" x2="540" y2="710" stroke="#3A2A18" strokeWidth="3"/><line x1="740" y1="710" x2="756" y2="710" stroke="#3A2A18" strokeWidth="3"/><polygon points="488,710 526,672 564,710 526,748" fill="#B14B3C" stroke="#3A2A18" strokeWidth="5"/><polygon points="500,710 526,684 552,710 526,736" fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.75"/><text x="526" y="721" fill="#F2E5C8" fontFamily="serif" fontSize="31" fontWeight="700" textAnchor="middle">R</text><circle cx="1280" cy="710" r="105" fill="#F2E5C8" stroke="#3A2A18" strokeWidth="3" opacity="0.96"/><circle cx="1280" cy="710" r="92" fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.42"/><circle cx="1280" cy="710" r="86" fill="none" stroke="#3A2A18" strokeWidth="18" opacity="0.2"/><circle cx="1280" cy="710" r="86" fill="none" stroke="#3E6E9E" strokeWidth="18" strokeLinecap="round" transform="rotate(-90 1280 710)" strokeDasharray="540.35" strokeDashoffset={540.35 * (1 - (0.625 + 0.275 * Math.sin((() => { let c; if (f <= 302) c = (f - 164) / 56; else if (f <= 342) c = 138 / 56 + (f - 302) / 112; else if (f <= 367) { const t = f - 342; c = 138 / 56 + 40 / 112 + t / 112 + (1 / 56 - 1 / 112) * t * t / 50; } else c = 138 / 56 + 40 / 112 + 25 / 112 + (1 / 56 - 1 / 112) * 12.5 + (f - 367) / 56; return 2 * Math.PI * c + Math.PI * 0.74; })())))}/><circle cx="1280" cy="710" r="58" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.35"/><circle cx="1280" cy="710" r={13 + 3 * Math.sin(f / 12 + Math.PI)} fill="#D4A574" stroke="#3A2A18" strokeWidth="3"/><line x1="1280" y1="594" x2="1280" y2="610" stroke="#3A2A18" strokeWidth="3"/><line x1="1280" y1="810" x2="1280" y2="826" stroke="#3A2A18" strokeWidth="3"/><line x1="1164" y1="710" x2="1180" y2="710" stroke="#3A2A18" strokeWidth="3"/><line x1="1380" y1="710" x2="1396" y2="710" stroke="#3A2A18" strokeWidth="3"/><polygon points="1356,710 1394,672 1432,710 1394,748" fill="#3E6E9E" stroke="#3A2A18" strokeWidth="5"/><polygon points="1368,710 1394,684 1420,710 1394,736" fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.75"/><text x="1394" y="721" fill="#F2E5C8" fontFamily="serif" fontSize="31" fontWeight="700" textAnchor="middle">S</text></g><g opacity={Math.min(0.62, Math.max(0, (f - 302) / 20))}><circle cx="960" cy="474" r={34 + 9 * Math.min(1, Math.max(0, (f - 302) / 65))} fill="none" stroke="#D4A574" strokeWidth="2.5"/><circle cx="960" cy="474" r={48 + 13 * Math.min(1, Math.max(0, (f - 302) / 65))} fill="none" stroke="#3A2A18" strokeWidth="1.5" strokeDasharray="8 12"/></g></g>
      </svg>
      <div style={{ position: "absolute", top: 20, left: 20, color: "#000", fontFamily: "monospace", fontSize: 20 }}>SOL — f={f}</div>
    </AbsoluteFill>
  );
};

export const Beat1CandidateGemini: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g id="geopol-sudan-money-flow">
  <defs>
    <mask id="veinMask">
      <path d="M 960 200 L 975 270 L 945 340 L 970 410 L 960 480" fill="none" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="400" strokeDashoffset={400 * (1 - Math.max(0, Math.min(1, f / 20)))} />
    </mask>
    <mask id="branchLMask">
      <path d="M 960 480 L 910 540 L 800 580 L 740 660 L 700 750" fill="none" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="500" strokeDashoffset={500 * (1 - Math.max(0, Math.min(1, (f - 134) / 30)))} />
    </mask>
    <mask id="branchRMask">
      <path d="M 960 480 L 1010 540 L 1120 580 L 1180 660 L 1220 750" fill="none" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="500" strokeDashoffset={500 * (1 - Math.max(0, Math.min(1, (f - 134) / 30)))} />
    </mask>
  </defs>

  <rect width="1920" height="1080" fill="#F2E5C8" />
  
  <g opacity="0.15">
    <circle cx="960" cy="480" r="120" stroke="#3A2A18" strokeWidth="1.5" fill="none" strokeDasharray="4 8" />
    <circle cx="960" cy="480" r="300" stroke="#3A2A18" strokeWidth="1" fill="none" />
    <circle cx="960" cy="480" r="450" stroke="#3A2A18" strokeWidth="1" fill="none" strokeDasharray="12 24" />
    <line x1="0" y1="480" x2="1920" y2="480" stroke="#3A2A18" strokeWidth="1" />
    <line x1="960" y1="0" x2="960" y2="1080" stroke="#3A2A18" strokeWidth="1" />
  </g>

  <g opacity={Math.min(1, f / 5)}>
    <path d="M 960 200 L 975 270 L 945 340 L 970 410 L 960 480" fill="none" stroke="#3A2A18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={14 + 4 * Math.sin((f < 302 ? f : f < 367 ? 302 + (f - 302) * 0.25 : 318.25 + (f - 367)) * Math.PI * 2 / 24)} strokeDasharray="400" strokeDashoffset={400 * (1 - Math.max(0, Math.min(1, f / 20)))} />
    <path d="M 960 200 L 975 270 L 945 340 L 970 410 L 960 480" fill="none" stroke="#D4A574" strokeLinecap="round" strokeLinejoin="round" strokeWidth={8 + 2 * Math.sin((f < 302 ? f : f < 367 ? 302 + (f - 302) * 0.25 : 318.25 + (f - 367)) * Math.PI * 2 / 24)} strokeDasharray="400" strokeDashoffset={400 * (1 - Math.max(0, Math.min(1, f / 20)))} />
    <path d="M 960 200 L 975 270 L 945 340 L 970 410 L 960 480" fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" strokeDasharray="10 20" strokeDashoffset={-f * 6} opacity="0.8" mask="url(#veinMask)" />
  </g>

  <g display={f >= 134 ? "block" : "none"}>
    <path d="M 960 480 L 910 540 L 800 580 L 740 660 L 700 750" fill="none" stroke="#3A2A18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={12 + 2 * Math.sin((f < 302 ? f : f < 367 ? 302 + (f - 302) * 0.25 : 318.25 + (f - 367)) * Math.PI * 2 / 24)} strokeDasharray="500" strokeDashoffset={500 * (1 - Math.max(0, Math.min(1, (f - 134) / 30)))} />
    <path d="M 960 480 L 910 540 L 800 580 L 740 660 L 700 750" fill="none" stroke="#B14B3C" strokeLinecap="round" strokeLinejoin="round" strokeWidth={6 + 1.5 * Math.sin((f < 302 ? f : f < 367 ? 302 + (f - 302) * 0.25 : 318.25 + (f - 367)) * Math.PI * 2 / 24)} strokeDasharray="500" strokeDashoffset={500 * (1 - Math.max(0, Math.min(1, (f - 134) / 30)))} />
    <path d="M 960 480 L 910 540 L 800 580 L 740 660 L 700 750" fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" strokeDasharray="8 16" strokeDashoffset={-f * 6} opacity="0.6" mask="url(#branchLMask)" />
  </g>

  <g display={f >= 134 ? "block" : "none"}>
    <path d="M 960 480 L 1010 540 L 1120 580 L 1180 660 L 1220 750" fill="none" stroke="#3A2A18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={12 + 2 * Math.sin((f < 302 ? f : f < 367 ? 302 + (f - 302) * 0.25 : 318.25 + (f - 367)) * Math.PI * 2 / 24)} strokeDasharray="500" strokeDashoffset={500 * (1 - Math.max(0, Math.min(1, (f - 134) / 30)))} />
    <path d="M 960 480 L 1010 540 L 1120 580 L 1180 660 L 1220 750" fill="none" stroke="#3E6E9E" strokeLinecap="round" strokeLinejoin="round" strokeWidth={6 + 1.5 * Math.sin((f < 302 ? f : f < 367 ? 302 + (f - 302) * 0.25 : 318.25 + (f - 367)) * Math.PI * 2 / 24)} strokeDasharray="500" strokeDashoffset={500 * (1 - Math.max(0, Math.min(1, (f - 134) / 30)))} />
    <path d="M 960 480 L 1010 540 L 1120 580 L 1180 660 L 1220 750" fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" strokeDasharray="8 16" strokeDashoffset={-f * 6} opacity="0.6" mask="url(#branchRMask)" />
  </g>

  <g display={f >= 164 ? "block" : "none"} transform={"translate(640, 750) scale(" + Math.max(0, Math.min(1, (f - 164) / 10)) + ")"}>
    <circle r="60" fill="none" stroke="#3A2A18" strokeWidth="12" />
    <circle r="60" fill="none" stroke="#B14B3C" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 * (1 - (0.625 + 0.275 * Math.sin(f * Math.PI * 2 / 55)))} transform="rotate(-90)" strokeLinecap="round" />
    <circle r="45" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.2" strokeDasharray="4 8" />
    <g transform="translate(-110, 0)">
      <polygon points="0,-24 24,0 0,24 -24,0" fill="#B14B3C" stroke="#3A2A18" strokeWidth="3" strokeLinejoin="round" />
      <text x="0" y="2" fontFamily="serif" fontSize="22" fill="#F2E5C8" fontWeight="bold" textAnchor="middle" dominantBaseline="central">R</text>
    </g>
  </g>

  <g display={f >= 164 ? "block" : "none"} transform={"translate(1280, 750) scale(" + Math.max(0, Math.min(1, (f - 164) / 10)) + ")"}>
    <circle r="60" fill="none" stroke="#3A2A18" strokeWidth="12" />
    <circle r="60" fill="none" stroke="#3E6E9E" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 * (1 - (0.625 + 0.275 * Math.sin(f * Math.PI * 2 / 63 + 2.1)))} transform="rotate(-90)" strokeLinecap="round" />
    <circle r="45" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.2" strokeDasharray="4 8" />
    <g transform="translate(110, 0)">
      <polygon points="0,-24 24,0 0,24 -24,0" fill="#3E6E9E" stroke="#3A2A18" strokeWidth="3" strokeLinejoin="round" />
      <text x="0" y="2" fontFamily="serif" fontSize="22" fill="#F2E5C8" fontWeight="bold" textAnchor="middle" dominantBaseline="central">S</text>
    </g>
  </g>
</g>
      </svg>
      <div style={{ position: "absolute", top: 20, left: 20, color: "#000", fontFamily: "monospace", fontSize: 20 }}>GEMINI — f={f}</div>
    </AbsoluteFill>
  );
};
