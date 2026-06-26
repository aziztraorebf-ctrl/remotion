/**
 * CfaFrancAnimee — MECANISME DU FRANC CFA (registre tactique), GPT-5.5 anime en VRAI JSX.
 *
 * Test reproductibilite SVG-SCENES-GENERATIVES (2026-06-21). Sujet NEUF : la dependance monetaire
 * (reserves drainees de la peripherie vers UN centre = Tresor francais, contre garantie de convertibilite).
 * Intention : faire RESSENTIR la DEPENDANCE / le DRAINAGE (richesse aspiree vers un centre exterieur).
 *
 * Grammaire (doctrine "SE CONSTRUIT puis DRAINE") :
 *   - construction : cadre+grille fade, titre reveal, noeuds-pays en arc, centre scale-in.
 *   - tracage : les liens de dependance se TRACENT peripherie->centre (stroke-dashoffset).
 *   - drainage (geste principal) : les chevrons MONTENT en continu le long des liens vers le centre.
 *   - verrouillage : le coffre/cadenas se ferme, la jauge "part retenue" se remplit a 50%.
 *   - contrepoids : un mince flux de garantie OR apparait tard et redescend.
 *
 * Matiere : scene_svg GPT-5.5 (verdict statique = GPT gagne le schema conceptuel), porte en JSX
 * pour pouvoir animer chaque <g> (gotcha doctrine : innerHTML n'anime pas).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const CENTER = { x: 512, y: 378 };

// les 6 pays peripheriques (positions du noeud + label) — depuis le scene_svg GPT
const PAYS = [
  { x: 158, y: 730, label: "PAYS A" },
  { x: 285, y: 800, label: "PAYS B" },
  { x: 430, y: 836, label: "PAYS C" },
  { x: 594, y: 836, label: "PAYS D" },
  { x: 739, y: 800, label: "PAYS E" },
  { x: 866, y: 730, label: "PAYS F" },
];

// liens de dependance (paths courbes peripherie -> centre), longueur approx pour le dash
const LIENS = [
  "M158 696 C220 580 360 450 512 378",
  "M285 766 C330 610 425 470 512 378",
  "M430 802 C445 620 490 485 512 378",
  "M594 802 C579 620 534 485 512 378",
  "M739 766 C694 610 599 470 512 378",
  "M866 696 C804 580 664 450 512 378",
];
const LIEN_LEN = 760; // sur-estimation suffisante pour le dash (clamp)

// chevrons de drainage (flux-reserves) — position de base + rotation, du scene_svg GPT.
// dist = "distance au centre" (sert a sequencer le pulse de montee, les plus bas montent en 1er).
const CHEVRONS = [
  { cx: 250, cy: 581, rot: 42, fill: "#5a8fc0", op: 0.95, dist: 0.85 },
  { cx: 365, cy: 469, rot: 38, fill: "#e8eef5", op: 0.92, dist: 0.55 },
  { cx: 445, cy: 410, rot: 24, fill: "#5a8fc0", op: 0.95, dist: 0.35 },
  { cx: 335, cy: 634, rot: 28, fill: "#5a8fc0", op: 0.95, dist: 0.95 },
  { cx: 424, cy: 514, rot: 18, fill: "#e8eef5", op: 0.92, dist: 0.6 },
  { cx: 457, cy: 677, rot: 9, fill: "#5a8fc0", op: 0.95, dist: 0.9 },
  { cx: 492, cy: 527, rot: 4, fill: "#e8eef5", op: 0.92, dist: 0.55 },
  { cx: 567, cy: 677, rot: -9, fill: "#5a8fc0", op: 0.95, dist: 0.9 },
  { cx: 532, cy: 527, rot: -4, fill: "#e8eef5", op: 0.92, dist: 0.55 },
  { cx: 689, cy: 634, rot: -28, fill: "#5a8fc0", op: 0.95, dist: 0.95 },
  { cx: 600, cy: 514, rot: -18, fill: "#e8eef5", op: 0.92, dist: 0.6 },
  { cx: 774, cy: 581, rot: -42, fill: "#5a8fc0", op: 0.95, dist: 0.85 },
  { cx: 659, cy: 469, rot: -38, fill: "#e8eef5", op: 0.92, dist: 0.55 },
];

// chevrons fins OR de garantie (flux-garantie) — apparition tardive, descendants
const GARANTIE = [
  { cx: 390, cy: 518, rot: 35, op: 0.88 },
  { cx: 354, cy: 623, rot: 25, op: 0.82 },
  { cx: 466, cy: 563, rot: 12, op: 0.82 },
  { cx: 558, cy: 563, rot: -12, op: 0.82 },
  { cx: 670, cy: 623, rot: -25, op: 0.82 },
  { cx: 634, cy: 518, rot: -35, op: 0.88 },
];

const NAVY = "#0b1526";
const STEEL = "#5a8fc0";
const WHITE = "#e8eef5";
const GOLD = "#c8a951";

export const CfaFrancAnimee: React.FC = () => {
  const f = useCurrentFrame();

  // --- phases ---
  const cadreOp = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const grilleOp = interpolate(f, [4, 22], [0, 0.08], { extrapolateRight: "clamp" });
  // titre : reveal gauche->droite par un clip width
  const titreClip = interpolate(f, [8, 30], [0, 1024], { extrapolateRight: "clamp" });
  // centre : scale-in autoritaire
  const centreScale = interpolate(f, [18, 42], [0.6, 1], { extrapolateRight: "clamp" });
  const centreOp = interpolate(f, [18, 36], [0, 1], { extrapolateRight: "clamp" });
  // anneau du centre : pulse continu (le coeur du systeme "respire")
  const ringPulse = 0.55 + 0.2 * (Math.sin(f / 16) + 1) / 2;

  // liens : se tracent peripherie -> centre, sequences (un par un, leger decalage)
  const lienDash = (i: number) => {
    const start = 40 + i * 5;
    const prog = interpolate(f, [start, start + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return LIEN_LEN * (1 - prog); // dashoffset : LEN -> 0 = la ligne se dessine
  };

  // drainage : chevrons montent en boucle vers le centre. Apres f95.
  // chaque chevron : translation periodique le long de l'axe noeud->centre (vecteur vers le centre),
  // module par sa "dist" pour que la vague parte du bas (les plus eloignes montent en premier).
  const drainStart = 92;
  const drainOn = interpolate(f, [drainStart, drainStart + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chevronShift = (ch: typeof CHEVRONS[number]) => {
    // vecteur normalise du chevron vers le centre
    const dx = CENTER.x - ch.cx;
    const dy = CENTER.y - ch.cy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    // phase de montee en boucle (periode ~36f), decalee par la position (dist)
    const cycle = ((f - drainStart) / 36 + ch.dist) % 1;
    const travel = 46; // amplitude de la montee le long de l'axe
    const off = (cycle - 0.5) * travel; // va de -travel/2 a +travel/2 (vers le centre)
    // opacite en vague (apparait au depart, fade en arrivant pres du centre)
    const waveOp = Math.sin(cycle * Math.PI); // 0 aux extremites, 1 au milieu
    return { tx: ux * off, ty: uy * off, op: ch.op * waveOp * drainOn };
  };

  // coffre : le cadenas se ferme sec a f110 (micro-descente + flash)
  const lockProg = interpolate(f, [108, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lockY = (1 - lockProg) * -10; // l'anse descend en place
  const lockFlash = f >= 108 && f < 118 ? (1 - (f - 108) / 10) : 0;

  // jauge part-retenue : se remplit jusqu'a 50% (largeur 0 -> 84)
  const gaugeW = interpolate(f, [100, 130], [0, 84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gaugeTxtOp = interpolate(f, [124, 134], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // garantie : apparait tard (f130+), fine, descendante, moins intense
  const garantieOp = interpolate(f, [130, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const garantieShift = (g: typeof GARANTIE[number]) => {
    const dx = g.cx - CENTER.x;
    const dy = g.cy - CENTER.y;
    const len = Math.hypot(dx, dy) || 1;
    const cycle = (f / 44 + g.cx / 1024) % 1; // descente lente vers la peripherie
    const off = (cycle - 0.5) * 26;
    return { tx: (dx / len) * off, ty: (dy / len) * off };
  };

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="titreClip"><rect x="0" y="0" width={titreClip} height="1024" /></clipPath>
        </defs>

        {/* CADRE */}
        <g id="cadre" opacity={cadreOp}>
          <rect x="50" y="50" width="924" height="924" fill="#16213a" opacity="0.18" />
          <rect x="50" y="50" width="924" height="924" fill="none" stroke={WHITE} strokeWidth="1.2" opacity="0.55" />
          <path d="M74 86 H198 M826 86 H950 M74 938 H198 M826 938 H950" fill="none" stroke={STEEL} strokeWidth="1.4" opacity="0.5" />
        </g>

        {/* GRILLE */}
        <g id="grille" opacity={grilleOp / 0.08}>
          <path d="M128 50 V974 M192 50 V974 M256 50 V974 M320 50 V974 M384 50 V974 M448 50 V974 M512 50 V974 M576 50 V974 M640 50 V974 M704 50 V974 M768 50 V974 M832 50 V974 M896 50 V974 M50 128 H974 M50 192 H974 M50 256 H974 M50 320 H974 M50 384 H974 M50 448 H974 M50 512 H974 M50 576 H974 M50 640 H974 M50 704 H974 M50 768 H974 M50 832 H974 M50 896 H974" fill="none" stroke={STEEL} strokeWidth="0.8" opacity="0.08" />
          <path d="M512 50 V974 M50 512 H974" fill="none" stroke={WHITE} strokeWidth="0.9" opacity="0.09" />
        </g>

        {/* TITRE — reveal gauche->droite par clip */}
        <g id="titre" clipPath="url(#titreClip)">
          <text x="72" y="86" fill={WHITE} fontFamily="Arial, sans-serif" fontSize="18" letterSpacing="2.6">ZONE FRANC · MECANISME DE DEPOT DES RESERVES</text>
          <text x="72" y="118" fill={STEEL} fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2">RESERVES (HAUT) VERS LE CENTRE</text>
          <text x="952" y="150" fill={GOLD} fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2" textAnchor="end">GARANTIE (BAS) DE CONVERTIBILITE</text>
          <path d="M72 132 H308" fill="none" stroke={STEEL} strokeWidth="1" opacity="0.55" />
          <path d="M720 162 H952" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.55" />
        </g>

        {/* LIENS DE DEPENDANCE — se tracent peripherie -> centre */}
        <g id="liens-dependance">
          {LIENS.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={STEEL} strokeWidth="3.2" opacity="0.58" strokeLinecap="round"
              strokeDasharray={LIEN_LEN} strokeDashoffset={lienDash(i)} />
          ))}
          {LIENS.map((d, i) => (
            <path key={`hl${i}`} d={d} fill="none" stroke={WHITE} strokeWidth="0.9" opacity="0.22" strokeLinecap="round"
              strokeDasharray={LIEN_LEN} strokeDashoffset={lienDash(i)} />
          ))}
        </g>

        {/* FLUX RESERVES — DRAINAGE : chevrons montent vers le centre */}
        <g id="flux-reserves">
          <text x="512" y="465" fill={WHITE} fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2" textAnchor="middle" opacity={0.76 * drainOn}>DRAINAGE DES RESERVES</text>
          {CHEVRONS.map((ch, i) => {
            const s = chevronShift(ch);
            const half = 10;
            return (
              <g key={i} transform={`translate(${s.tx} ${s.ty}) rotate(${ch.rot} ${ch.cx} ${ch.cy})`}>
                <polygon points={`${ch.cx},${ch.cy - half - 12} ${ch.cx - half},${ch.cy + half - 12} ${ch.cx + half},${ch.cy + half - 12}`} fill={ch.fill} opacity={s.op} />
              </g>
            );
          })}
        </g>

        {/* FLUX GARANTIE — mince, OR, descendant, tardif */}
        <g id="flux-garantie" opacity={garantieOp}>
          <path d="M512 378 C360 450 220 580 158 696 M512 378 C425 470 330 610 285 766 M512 378 C490 485 445 620 430 802 M512 378 C534 485 579 620 594 802 M512 378 C599 470 694 610 739 766 M512 378 C664 450 804 580 866 696" fill="none" stroke={GOLD} strokeWidth="1.25" opacity="0.45" strokeLinecap="round" strokeDasharray="4 18" />
          {GARANTIE.map((g, i) => {
            const s = garantieShift(g);
            return (
              <g key={i} transform={`translate(${s.tx} ${s.ty}) rotate(${g.rot} ${g.cx} ${g.cy})`}>
                <polygon points={`${g.cx},${g.cy} ${g.cx - 6},${g.cy - 15} ${g.cx + 6},${g.cy - 15}`} fill={GOLD} opacity={g.op} />
              </g>
            );
          })}
        </g>

        {/* NOEUDS PAYS — apparition sequentielle en arc */}
        <g id="noeuds-pays">
          {PAYS.map((p, i) => {
            const start = 22 + i * 4;
            const op = interpolate(f, [start, start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sc = interpolate(f, [start, start + 14], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <g key={i} opacity={op} transform={`translate(${p.x} ${p.y}) scale(${sc}) translate(${-p.x} ${-p.y})`}>
                <circle cx={p.x} cy={p.y} r="36" fill={NAVY} stroke={WHITE} strokeWidth="1.8" />
                <circle cx={p.x} cy={p.y} r="25" fill="none" stroke={STEEL} strokeWidth="1.4" opacity="0.75" />
                <circle cx={p.x} cy={p.y} r="4" fill={STEEL} />
                <text x={p.x} y={p.y + 56} fill={WHITE} fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2" textAnchor="middle">{p.label}</text>
              </g>
            );
          })}
          <path d="M122 910 H902" fill="none" stroke={STEEL} strokeWidth="1" opacity={0.35 * cadreOp} />
          <text x="512" y="936" fill={STEEL} fontFamily="Arial, sans-serif" fontSize="11" letterSpacing="2.4" textAnchor="middle" opacity={cadreOp}>PERIPHERIE MONETAIRE · EMETTEURS DEPENDANTS</text>
        </g>

        {/* CENTRE TRESOR — scale-in autoritaire, anneau qui pulse */}
        <g id="centre-tresor" opacity={centreOp} transform={`translate(${CENTER.x} 235) scale(${centreScale}) translate(${-CENTER.x} -235)`}>
          <polygon points="512,92 636,164 636,306 512,378 388,306 388,164" fill="#16213a" stroke={WHITE} strokeWidth="2.8" />
          <circle cx="512" cy="235" r="116" fill="none" stroke={STEEL} strokeWidth="2" opacity={ringPulse} />
          <circle cx="512" cy="235" r="86" fill="none" stroke={WHITE} strokeWidth="1" opacity="0.26" />
          <path d="M512 92 V128 M636 164 L606 181 M636 306 L605 289 M512 378 V342 M388 306 L419 289 M388 164 L418 181" fill="none" stroke={STEEL} strokeWidth="1.5" opacity="0.58" />
          <text x="512" y="145" fill={WHITE} fontFamily="Arial, sans-serif" fontSize="15" letterSpacing="2.2" textAnchor="middle">TRESOR FRANCAIS</text>
          <text x="512" y="168" fill={STEEL} fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="3" textAnchor="middle">PARIS</text>
          <text x="512" y="335" fill={WHITE} fontFamily="Arial, sans-serif" fontSize="11" letterSpacing="2.4" textAnchor="middle">CENTRE UNIQUE DE DEPOT</text>

          {/* COFFRE — cadenas qui se verrouille */}
          <g id="coffre">
            <rect x="454" y="203" width="116" height="78" fill={NAVY} stroke={WHITE} strokeWidth="2" />
            <rect x="466" y="214" width="92" height="56" fill="none" stroke={STEEL} strokeWidth="1.5" opacity="0.85" />
            <circle cx="512" cy="242" r="18" fill="none" stroke={WHITE} strokeWidth="2" />
            <circle cx="512" cy="242" r="5" fill={STEEL} />
            <path d="M512 224 V232 M512 252 V260 M494 242 H502 M522 242 H530 M500 230 L506 236 M524 230 L518 236 M500 254 L506 248 M524 254 L518 248" fill="none" stroke={WHITE} strokeWidth="1.4" opacity="0.85" />
            {/* le cadenas (anse + corps) descend/se ferme a f110 */}
            <g transform={`translate(0 ${lockY})`}>
              <path d="M487 207 V193 C487 176 537 176 537 193 V207" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
              <rect x="481" y="207" width="62" height="38" fill="#16213a" stroke={GOLD} strokeWidth="2" />
              <circle cx="512" cy="225" r="5" fill={GOLD} />
              <path d="M512 230 V238" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
            </g>
            {/* flash sec au verrouillage */}
            {lockFlash > 0.02 && (
              <circle cx="512" cy="224" r={18 + (1 - lockFlash) * 26} fill="none" stroke={GOLD} strokeWidth="2.5" opacity={lockFlash} />
            )}
          </g>
        </g>

        {/* PART RETENUE — jauge qui se remplit a 50% (hors scale du centre, fixe a droite) */}
        <g id="part-retenue" opacity={centreOp}>
          <rect x="666" y="215" width="230" height="78" fill={NAVY} stroke={WHITE} strokeWidth="1.4" opacity="0.95" />
          <text x="686" y="240" fill={WHITE} fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2">PART RETENUE</text>
          <rect x="686" y="254" width="168" height="14" fill="none" stroke={STEEL} strokeWidth="1.2" />
          <rect x="686" y="254" width={gaugeW} height="14" fill={STEEL} opacity="0.8" />
          <path d="M770 250 V273 M854 250 V273" fill="none" stroke={WHITE} strokeWidth="1" opacity="0.45" />
          <text x="866" y="268" fill={WHITE} fontFamily="Arial, sans-serif" fontSize="16" letterSpacing="1.5" opacity={gaugeTxtOp}>50%</text>
          <text x="686" y="286" fill={STEEL} fontFamily="Arial, sans-serif" fontSize="10" letterSpacing="1.5">DES RESERVES DEPOSEES</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CfaFrancAnimee;
