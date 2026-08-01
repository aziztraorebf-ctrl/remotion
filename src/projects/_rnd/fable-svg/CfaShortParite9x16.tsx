/**
 * CfaShortParite9x16 — Short 9:16, Scene 2 "La parite fixe" (franc CFA).
 * RECOMPOSITION SPATIALE de CfaActe3PariteGpt16x9.tsx (SOURCE INTOUCHABLE, 16:9, mid-form
 * publie). Meme logique d'animation (interpolate/spring), memes couleurs, memes SFX (memes
 * fichiers, memes volumes) — SEULE la disposition change. viewBox 0 0 1080 1920, camera statique.
 *
 * RECOMPOSITION :
 *   - Les 4 courbes devises (KES/NGN/GHS/ZAR) : empilees VERTICALEMENT dans le tiers superieur
 *     (au lieu d'empilees a droite avec courbes pleine largeur) — courbes plus courtes/compactes,
 *     labels a droite de chaque courbe (position conservee du principe original).
 *   - Ligne CFA plate : reste LA plus proeminente visuellement (c'est le sujet), centree,
 *     juste sous les 4 devises.
 *   - Medaillon EURO + cadenas : rapproches (empiles, euro AU-DESSUS du cadenas) au lieu
 *     d'etre distants de 300px horizontalement — le lien visuel euro<->verrou reste evident.
 *   - Cle : se dessine pres du cadenas, s'eloigne legerement, reste ENTIEREMENT dans le cadre.
 *
 * Timings relatifs (proportions) repris EXACTEMENT de l'original, redimensionnes sur la
 * nouvelle duree (985f -> 660f, ratio ~0.67) pour respecter la duree cible du montage Short.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  Sequence,
  staticFile,
} from "remotion";

// SFX repris EXACTEMENT (memes fichiers, memes volumes) — from = ancien_from * RATIO (voir plus bas).
const RATIO = 660 / 985; // duree cible / duree originale — reechelonne TOUS les timings relatifs
const SFX: { src: string; from: number; vol: number; dur?: number }[] = [
  { src: "_shared/sfx/warmap/ink-spread.mp3", from: Math.round(45 * RATIO), vol: 0.32 },
  { src: "_shared/sfx/warmap/ink-spread.mp3", from: Math.round(150 * RATIO), vol: 0.28 },
  { src: "_shared/sfx/ui/ping-connexion.mp3", from: Math.round(94 * RATIO), vol: 0.62 },
  { src: "_shared/sfx/ui/ping-connexion.mp3", from: Math.round(152 * RATIO), vol: 0.56 },
  { src: "_shared/sfx/ui/ping-connexion.mp3", from: Math.round(209 * RATIO), vol: 0.50 },
  { src: "_shared/sfx/ui/ping-connexion.mp3", from: Math.round(254 * RATIO), vol: 0.46 },
  { src: "_shared/sfx/ui/stamp-dossier.mp3", from: Math.round(268 * RATIO), vol: 0.5 },
  { src: "_shared/sfx/ui/plate-pop.mp3", from: Math.round(518 * RATIO), vol: 0.45 },
  { src: "_shared/sfx/ui/vault-lock.mp3", from: Math.round(552 * RATIO), vol: 0.6 },
  { src: "_shared/sfx/ui/node-appear.mp3", from: Math.round(780 * RATIO), vol: 0.35 },
];

const FADE = 16;
// Duree cible : ~22s @ 30fps = 660 frames (demande explicite). Ce fichier demarre a frame 0
// en interne comme les 2 autres — l'assemblage du montage global gerera l'enchainement.
export const CFA_SHORT_PARITE_FRAMES = 660;

// ---- helpers (identiques a l'original) ----
const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const draw = (f: number, start: number, dur: number, len: number): React.CSSProperties => ({
  strokeDasharray: len,
  strokeDashoffset: len * clampI(f, start, start + dur, 1, 0),
});

const ENCRE_PALE = "#5b6d8f";

// ---- timings ORIGINAUX (frames @30fps sur 985f), puis reechelonnes par RATIO ci-dessous ----
const T_ORIG = {
  axes: [15, 55] as const,
  kes: [45, 110] as const,
  ngn: [95, 165] as const,
  ghs: [150, 220] as const,
  zar: [205, 275] as const,
  plaqueDraw: [268, 312] as const,
  tauxText: [300, 345] as const,
  cfaDraw: [440, 505] as const,
  cfaGold: [490, 540] as const,
  fcfaPop: 505,
  euro: [518, 565] as const,
  lockSnap: 556,
  redLock: [570, 595] as const,
  cleDraw: [780, 845] as const,
  cleFly: [900, 960] as const,
};
const r2 = (v: number) => Math.round(v * RATIO);
const rT = (t: readonly [number, number]) => [r2(t[0]), r2(t[1])] as const;
const T = {
  axes: rT(T_ORIG.axes),
  kes: rT(T_ORIG.kes),
  ngn: rT(T_ORIG.ngn),
  ghs: rT(T_ORIG.ghs),
  zar: rT(T_ORIG.zar),
  plaqueDraw: rT(T_ORIG.plaqueDraw),
  tauxText: rT(T_ORIG.tauxText),
  cfaDraw: rT(T_ORIG.cfaDraw),
  cfaGold: rT(T_ORIG.cfaGold),
  fcfaPop: r2(T_ORIG.fcfaPop),
  euro: rT(T_ORIG.euro),
  lockSnap: r2(T_ORIG.lockSnap),
  redLock: rT(T_ORIG.redLock),
  cleDraw: rT(T_ORIG.cleDraw),
  cleFly: rT(T_ORIG.cleFly),
};

// Courbes compactees : largeur 880 (au lieu de ~1086 pleine largeur), longueur dashoffset adaptee.
const CURVE_LEN = 1100;

export const CfaShortParite9x16: React.FC<{ muteNarration?: boolean }> = ({ muteNarration = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const op = interpolate(
    f,
    [0, FADE, CFA_SHORT_PARITE_FRAMES - FADE, CFA_SHORT_PARITE_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const wob = (amp: number, phase: number) => amp * Math.sin(f / 18 + phase);

  const cfaGold = clampI(f, T.cfaGold[0], T.cfaGold[1]);
  const cfaStroke = cfaGold;

  const lockOp = clampI(f, T.euro[0] + 10, T.euro[0] + 30);
  const anseClose = spring({ frame: f - T.lockSnap, fps, config: { damping: 11, stiffness: 170 }, durationInFrames: 22 });
  const anseAngle = -75 * (1 - anseClose);
  const anseVisible = clampI(f, T.euro[0] + 10, T.euro[0] + 24);

  const euroOp = clampI(f, T.euro[0], T.euro[1]);
  const euroPop = spring({ frame: f - T.euro[0], fps, config: { damping: 12, stiffness: 110 }, durationInFrames: 26 });
  const euroScale = 0.7 + 0.3 * euroPop;
  const euroGlow = f > T.euro[1] ? 0.35 + 0.35 * (0.5 + 0.5 * Math.sin((f - T.euro[1]) / 14)) : 0;
  const euroBreath = 1 + (f > T.euro[1] ? 0.012 * Math.sin((f - T.euro[1]) / 16) : 0);

  const fcfaPop = spring({ frame: f - T.fcfaPop, fps, config: { damping: 11, stiffness: 130 }, durationInFrames: 22 });
  const fcfaOp = clampI(f, T.fcfaPop, T.fcfaPop + 14);

  const plaqueOp = clampI(f, T.plaqueDraw[0], T.plaqueDraw[0] + 16);
  const tauxOp = clampI(f, T.tauxText[0], T.tauxText[1]);

  // cle : dessin puis leger eloignement vers le haut, reste ENTIEREMENT visible
  const cleOp = clampI(f, T.cleDraw[0], T.cleDraw[0] + 20);
  const cleFly = clampI(f, T.cleFly[0], T.cleFly[1]);
  const cleDx = 24 * cleFly;
  const cleDy = -30 * cleFly;
  const cleFade = 1 - 0.1 * cleFly;

  const redOp = clampI(f, T.redLock[0], T.redLock[1]);

  const deviseStyle = (t: readonly [number, number]) => draw(f, t[0], t[1] - t[0], CURVE_LEN);
  const deviseOp = (t: readonly [number, number]) => clampI(f, t[0], t[0] + 20);

  // ---- GEOMETRIE VERTICALE : 4 devises empilees, bandes de 140px, x 90-880, label a droite ----
  const CX0 = 90, CX1 = 880; // largeur utile des courbes (compact vs 1086 original)
  const LBL_X = CX1 + 8; // label juste apres la fin de la courbe
  const rowY = { kes: 150, ngn: 290, ghs: 430, zar: 570 };

  return (
    <AbsoluteFill style={{ background: "#182746", opacity: op }}>
      {!muteNarration && <Audio src={staticFile("_rnd/cfa-nuit1994/beat3-vo-v2.mp3")} />}
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur ?? 40}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="p9nuit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#182746" />
            <stop offset="0.56" stopColor="#22345c" />
            <stop offset="1" stopColor="#182746" />
          </linearGradient>
        </defs>

        {/* FOND */}
        <g id="fond">
          <rect x="0" y="0" width="1080" height="1920" fill="url(#p9nuit)" />
          <path d="M0 1520 C80 1490 140 1505 190 1545 C240 1580 300 1590 365 1570 C425 1552 475 1572 515 1615 C545 1645 570 1665 605 1690 L0 1920 Z" fill="#2c4066" opacity={0.6} />
          <path d="M780 0 C820 62 875 80 930 66 C985 50 1040 70 1080 130 L1080 0 Z" fill="#2c4066" opacity={0.6} />
        </g>

        {/* AXES (verticaux/horizontaux, redimensionnes a la zone devises) */}
        <g id="axes">
          <path d="M78 700 C78 500 76 300 80 100" fill="none" stroke="#f0e8d2" strokeWidth="4" strokeLinecap="round" style={draw(f, T.axes[0], T.axes[1] - T.axes[0], 600)} opacity={0.55} />
          <path d="M76 700 C300 705 600 698 878 703" fill="none" stroke="#f0e8d2" strokeWidth="4" strokeLinecap="round" style={draw(f, T.axes[0], T.axes[1] - T.axes[0], 810)} opacity={0.55} />
        </g>

        {/* COURBES DEVISES — empilees verticalement, compactes, label a droite de chacune */}
        <g id="courbes-devises" fontFamily="Georgia, serif">
          {/* KES (rang 1) */}
          <g opacity={deviseOp(T.kes)} transform={`translate(0 ${wob(5, 0)})`}>
            <path d={`M${CX0} ${rowY.kes - 12} C${CX0 + 90} ${rowY.kes + 6} ${CX0 + 150} ${rowY.kes - 24} ${CX0 + 230} ${rowY.kes} C${CX0 + 310} ${rowY.kes + 26} ${CX0 + 370} ${rowY.kes - 20} ${CX0 + 450} ${rowY.kes + 4} C${CX0 + 530} ${rowY.kes + 26} ${CX0 + 590} ${rowY.kes - 16} ${CX1 - 90} ${rowY.kes + 8} S${CX1} ${rowY.kes - 8} ${CX1} ${rowY.kes}`} fill="none" stroke={ENCRE_PALE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={deviseStyle(T.kes)} />
            <rect x={LBL_X} y={rowY.kes - 20} width="82" height="34" rx="17" fill="#182746" stroke={ENCRE_PALE} strokeWidth="2" />
            <text x={LBL_X + 41} y={rowY.kes + 4} textAnchor="middle" fill="#cdd6e6" fontSize="20">KES</text>
          </g>
          {/* NGN (rang 2) */}
          <g opacity={deviseOp(T.ngn)} transform={`translate(0 ${wob(7, 1.6)})`}>
            <path d={`M${CX0} ${rowY.ngn + 18} C${CX0 + 90} ${rowY.ngn - 12} ${CX0 + 160} ${rowY.ngn + 30} ${CX0 + 240} ${rowY.ngn - 6} C${CX0 + 320} ${rowY.ngn - 40} ${CX0 + 380} ${rowY.ngn + 34} ${CX0 + 460} ${rowY.ngn - 4} C${CX0 + 540} ${rowY.ngn - 36} ${CX0 + 600} ${rowY.ngn + 22} ${CX1 - 90} ${rowY.ngn - 10} S${CX1} ${rowY.ngn + 6} ${CX1} ${rowY.ngn}`} fill="none" stroke={ENCRE_PALE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={deviseStyle(T.ngn)} />
            <rect x={LBL_X} y={rowY.ngn - 20} width="82" height="34" rx="17" fill="#182746" stroke={ENCRE_PALE} strokeWidth="2" />
            <text x={LBL_X + 41} y={rowY.ngn + 4} textAnchor="middle" fill="#cdd6e6" fontSize="20">NGN</text>
          </g>
          {/* GHS (rang 3) */}
          <g opacity={deviseOp(T.ghs)} transform={`translate(0 ${wob(6, 3.1)})`}>
            <path d={`M${CX0} ${rowY.ghs - 20} C${CX0 + 80} ${rowY.ghs + 14} ${CX0 + 150} ${rowY.ghs - 34} ${CX0 + 230} ${rowY.ghs - 2} C${CX0 + 310} ${rowY.ghs + 32} ${CX0 + 380} ${rowY.ghs - 44} ${CX0 + 460} ${rowY.ghs - 4} C${CX0 + 540} ${rowY.ghs + 30} ${CX0 + 600} ${rowY.ghs - 30} ${CX1 - 90} ${rowY.ghs + 2} S${CX1} ${rowY.ghs - 10} ${CX1} ${rowY.ghs}`} fill="none" stroke={ENCRE_PALE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={deviseStyle(T.ghs)} />
            <rect x={LBL_X} y={rowY.ghs - 20} width="82" height="34" rx="17" fill="#182746" stroke={ENCRE_PALE} strokeWidth="2" />
            <text x={LBL_X + 41} y={rowY.ghs + 4} textAnchor="middle" fill="#cdd6e6" fontSize="20">GHS</text>
          </g>
          {/* ZAR (rang 4) */}
          <g opacity={deviseOp(T.zar)} transform={`translate(0 ${wob(8, 4.4)})`}>
            <path d={`M${CX0} ${rowY.zar + 6} C${CX0 + 80} ${rowY.zar - 16} ${CX0 + 140} ${rowY.zar + 12} ${CX0 + 220} ${rowY.zar - 12} C${CX0 + 310} ${rowY.zar - 42} ${CX0 + 380} ${rowY.zar + 18} ${CX0 + 460} ${rowY.zar - 20} C${CX0 + 540} ${rowY.zar - 50} ${CX0 + 600} ${rowY.zar - 4} ${CX1 - 90} ${rowY.zar - 14} S${CX1} ${rowY.zar} ${CX1} ${rowY.zar + 4}`} fill="none" stroke={ENCRE_PALE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" style={deviseStyle(T.zar)} />
            <rect x={LBL_X} y={rowY.zar - 20} width="82" height="34" rx="17" fill="#182746" stroke={ENCRE_PALE} strokeWidth="2" />
            <text x={LBL_X + 41} y={rowY.zar + 4} textAnchor="middle" fill="#cdd6e6" fontSize="20">ZAR</text>
          </g>
        </g>

        {/* LIGNE CFA plate — LA PLUS PROEMINENTE, centree juste sous les 4 devises */}
        <g id="ligne-cfa" fontFamily="Georgia, serif">
          <path d="M100 830 L980 830" fill="none" stroke={ENCRE_PALE} strokeWidth="16" strokeLinecap="round" style={draw(f, T.cfaDraw[0], T.cfaDraw[1] - T.cfaDraw[0], 880)} />
          <g opacity={cfaStroke}>
            <path d="M100 830 L980 830" fill="none" stroke="#b8860b" strokeWidth="22" strokeLinecap="round" />
            <path d="M100 830 L980 830" fill="none" stroke="#d9a93a" strokeWidth="9" strokeLinecap="round" />
            <path d="M100 822 L980 822" fill="none" stroke="#f0e8d2" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* pastille FCFA (pop), centree au-dessus de la ligne */}
          <g opacity={fcfaOp} transform={`translate(540 763) scale(${0.7 + 0.3 * fcfaPop}) translate(-540 -763)`}>
            <rect x="450" y="722" width="180" height="82" rx="41" fill="#182746" stroke="#d9a93a" strokeWidth="5" />
            <text x="540" y="777" textAnchor="middle" fill="#d9a93a" fontSize="38" fontWeight="bold">FCFA</text>
          </g>
        </g>

        {/* TAUX grave (plaque premium) — sous la ligne CFA */}
        <g id="taux" fontFamily="Georgia, serif">
          <g opacity={plaqueOp}>
            <path d="M300 900 C400 890 680 891 760 900 L792 962 L760 1024 C680 1034 400 1034 300 1024 L268 962 Z" fill="#182746" stroke="#b8860b" strokeWidth="6" strokeLinejoin="round" />
            <path d="M320 917 C450 909 610 909 715 917" fill="none" stroke="#c17e3a" strokeWidth="3" />
            <path d="M320 1008 C452 1017 608 1017 715 1008" fill="none" stroke="#c17e3a" strokeWidth="3" />
            <circle cx="296" cy="962" r="7" fill="#d9a93a" />
            <circle cx="764" cy="962" r="7" fill="#d9a93a" />
          </g>
          <text x="530" y="980" textAnchor="middle" fill="#f0e8d2" fontSize="52" letterSpacing="7" opacity={tauxOp}>TAUX FIXE</text>
        </g>

        {/* MEDAILLON EURO — au-dessus du cadenas, rapproches (lien visuel evident) */}
        <g id="medaillon-euro" fontFamily="Georgia, serif" opacity={euroOp}
           transform={`translate(540 1230) scale(${euroScale * euroBreath}) translate(-540 -1230)`}>
          <circle cx="540" cy="1230" r="140" fill="none" stroke="#d9a93a" strokeWidth="3" opacity={euroGlow} />
          <circle cx="540" cy="1230" r="128" fill="#182746" stroke="#b8860b" strokeWidth="16" />
          <circle cx="540" cy="1230" r="109" fill="#22345c" stroke="#d9a93a" strokeWidth="5" />
          <path d="M460 1178 C506 1140 580 1138 624 1175" fill="none" stroke="#b8860b" strokeWidth="4" />
          <path d="M461 1284 C509 1322 578 1322 622 1285" fill="none" stroke="#b8860b" strokeWidth="4" />
          <text x="540" y="1283" textAnchor="middle" fill="#f0e8d2" fontSize="135">€</text>
          <text x="540" y="1382" textAnchor="middle" fill="#d9a93a" fontSize="18" letterSpacing="5">EURO</text>
        </g>

        {/* CADENAS — juste sous l'euro, lien visuel direct (verrouillage a l'euro). Decale
            +30 vs 1re passe + anse RACCOURCIE (1421->1451 sommet) pour ne plus chevaucher le
            label EURO (y=1382) quand l'anse est ouverte (retour visuel post-render). */}
        <g id="cadenas" transform="translate(540 1590) scale(1.05) translate(-540 -1590)">
          <g opacity={lockOp}>
            <path d="M478 1596 C513 1589 631 1591 669 1598 L669 1727 C627 1739 522 1737 478 1726 Z" fill="#22345c" stroke="#f0e8d2" strokeWidth="8" strokeLinejoin="round" />
            <path d="M490 1611 C534 1605 618 1606 656 1613" fill="none" stroke="#c17e3a" strokeWidth="5" />
            <circle cx="574" cy="1656" r="15" fill="#b8860b" stroke="#d9a93a" strokeWidth="5" />
            <path d="M566 1664 L559 1698 L590 1698 L582 1664 Z" fill="#d9a93a" />
          </g>
          <g opacity={anseVisible} transform={`rotate(${anseAngle} 671 1597)`}>
            <path d="M476 1604 L476 1566 C476 1500 526 1466 576 1466 C629 1466 671 1502 671 1566 L671 1597" fill="none" stroke="#182746" strokeWidth="32" strokeLinecap="round" />
            <path d="M476 1604 L476 1566 C476 1500 526 1466 576 1466 C629 1466 671 1502 671 1566 L671 1597" fill="none" stroke="#f0e8d2" strokeWidth="15" strokeLinecap="round" />
          </g>
          <path d="M658 1573 l16 -13 M665 1585 l18 -6" fill="none" stroke="#a8281f" strokeWidth="6" strokeLinecap="round" opacity={redOp} />
        </g>

        {/* CLE — pres du cadenas, sous-decalee a gauche pour rester ENTIERE dans le cadre */}
        <g id="cle" opacity={cleOp * cleFade}
           transform={`translate(${cleDx} ${cleDy})`}>
          <g transform="translate(-360 168)">
            <path d="M774 1615 L836 1677 L813 1700 L795 1682 L779 1697 L759 1677 L775 1662 L753 1640" fill="none" stroke="#c17e3a" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" style={draw(f, T.cleDraw[0], T.cleDraw[1] - T.cleDraw[0], 240)} />
            <circle cx="745" cy="1588" r="39" fill="none" stroke="#c17e3a" strokeWidth="10" />
            <circle cx="745" cy="1588" r="15" fill="none" stroke="#d9a93a" strokeWidth="5" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CfaShortParite9x16;
