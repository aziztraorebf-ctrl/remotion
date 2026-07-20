/**
 * ChalutierGemini — chalutier industriel detaille (coque, passerelle+fenetres lumineuses, cheminee+
 * fumee, radar, portique de chalut + filet qui traine dans l'eau). Extrait de l'upgrade Gemini 3.1
 * Pro (svg-scene-upgrade.py, 2026-07-04, scene PecheurSurpeche16x9) — verdict mix-and-match : Gemini
 * a produit le chalutier le plus impressionnant/menacant (detail industriel), retenu face au
 * chalutier GPT plus epure (voir PirogueGPT.tsx pour le choix inverse sur la pirogue).
 *
 * Coordonnees originales du SVG source (x 1250-1820, y 0-700 incluant la fumee) recentrees ici sur
 * l'origine locale (0,0) via translate interne (~centre du hull, x=1535 y=470) — l'appelant
 * positionne/scale via son propre <g transform>.
 */
import React from "react";

export const ChalutierGemini: React.FC<{ idPrefix?: string }> = ({ idPrefix = "chalutierGemini" }) => (
  <g transform="translate(-1535 -470)">
    <defs>
      <linearGradient id={`${idPrefix}Hull`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3a3f47" />
        <stop offset="70%" stopColor="#1d2128" />
        <stop offset="71%" stopColor="#592822" />
        <stop offset="100%" stopColor="#2e1512" />
      </linearGradient>
      <linearGradient id={`${idPrefix}Smoke`} x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#111" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#333" stopOpacity="0" />
      </linearGradient>
      <filter id={`${idPrefix}Glow`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <pattern id={`${idPrefix}NetPattern`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M 10 0 L 10 20 M 0 10 L 20 10" stroke="#a8c0d8" strokeWidth="1" opacity="0.5" />
      </pattern>
    </defs>

    {/* sillage/vague a l'avant */}
    <path d="M 1250 630 Q 1280 610 1350 625 Z" fill="#ffffff" opacity={0.4} filter={`url(#${idPrefix}Glow)`} />
    <path d="M 1200 640 Q 1280 615 1370 635 Z" fill="#8aa2b3" opacity={0.5} />

    {/* filet de chalut qui traine dans l'eau (arriere) */}
    <path d="M 1580 610 L 1750 650 L 1820 680 L 1720 700 L 1570 630 Z" fill="#151921" opacity={0.85} />
    <path d="M 1580 610 L 1750 650 L 1820 680 L 1720 700 L 1570 630 Z" fill={`url(#${idPrefix}NetPattern)`} opacity={0.5} />
    <circle cx={1620} cy={635} r={4} fill="#d84a4a" />
    <circle cx={1680} cy={655} r={4} fill="#d84a4a" />
    <circle cx={1750} cy={678} r={4} fill="#d84a4a" />
    <line x1={1560} y1={510} x2={1780} y2={660} stroke="#111" strokeWidth={2} />
    <line x1={1580} y1={540} x2={1700} y2={640} stroke="#111" strokeWidth={1.5} />
    <path d="M 1600 620 Q 1700 630 1800 670" stroke="#ffffff" strokeWidth={1.5} fill="none" opacity={0.3} />

    {/* coque principale */}
    <path d="M 1270 550 L 1310 615 L 1600 615 L 1580 540 Z" fill={`url(#${idPrefix}Hull)`} />
    <path d="M 1270 550 L 1310 615 L 1320 615 L 1280 550 Z" fill="#4d535e" />
    <path d="M 1308 610 L 1600 610 L 1600 615 L 1310 615 Z" fill="#2e1512" />
    <path d="M 1380 570 L 1385 615 M 1420 580 L 1422 615 M 1510 560 L 1515 615" stroke="#592822" strokeWidth={3} opacity={0.7} />

    {/* passerelle */}
    <path d="M 1380 540 L 1380 470 L 1490 470 L 1500 540 Z" fill="#2c3038" />
    <path d="M 1370 505 L 1500 505 L 1490 470 L 1380 470 Z" fill="#3a3f47" />
    <rect x={1420} y={460} width={40} height={10} fill="#1d2128" />
    <rect x={1390} y={480} width={12} height={12} fill="#ffe28a" filter={`url(#${idPrefix}Glow)`} />
    <rect x={1410} y={480} width={12} height={12} fill="#ffe28a" filter={`url(#${idPrefix}Glow)`} />
    <rect x={1430} y={480} width={12} height={12} fill="#ffe28a" filter={`url(#${idPrefix}Glow)`} />
    <rect x={1450} y={480} width={12} height={12} fill="#ffe28a" filter={`url(#${idPrefix}Glow)`} />
    <rect x={1470} y={480} width={12} height={12} fill="#756651" />
    <rect x={1320} y={515} width={40} height={25} fill="#4d535e" />
    <rect x={1510} y={500} width={30} height={40} fill="#1d2128" />

    {/* cheminee + fumee */}
    <rect x={1440} y={410} width={30} height={50} fill="#1a1a1a" />
    <rect x={1440} y={410} width={30} height={15} fill="#b33939" />
    <path d="M 1445 410 C 1380 350, 1550 250, 1400 150 C 1300 80, 1600 50, 1500 0 C 1650 50, 1750 200, 1475 410 Z" fill={`url(#${idPrefix}Smoke)`} filter={`url(#${idPrefix}Glow)`} />

    {/* portiques/mats + radar */}
    <line x1={1340} y1={515} x2={1340} y2={400} stroke="#2c3038" strokeWidth={4} />
    <line x1={1340} y1={400} x2={1380} y2={470} stroke="#1d2128" strokeWidth={2} />
    <path d="M 1550 540 L 1550 450 L 1590 420 L 1590 540" stroke="#2c3038" strokeWidth={4} fill="none" />
    <line x1={1550} y1={480} x2={1590} y2={480} stroke="#2c3038" strokeWidth={3} />
    <line x1={1460} y1={460} x2={1460} y2={380} stroke="#4d535e" strokeWidth={2} />
    <ellipse cx={1460} cy={380} rx={15} ry={3} fill="#8aa2b3" />
    <circle cx={1340} cy={420} r={8} fill="#fffef0" filter={`url(#${idPrefix}Glow)`} opacity={0.7} />
  </g>
);
