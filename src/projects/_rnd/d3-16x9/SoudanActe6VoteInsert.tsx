// B3 — Insert "vote au Conseil de securite" (Acte 6). DECOR = GPT-5.6 Sol (amphitheatre + tribune
// + maillet), choisi par Aziz 2026-07-20 (compare aux 4 modeles). Croix/mire du haut RETIREE (retour Aziz).
//
// ANIMATION propre (les LLM ne l'ont pas) : les 14 sieges "pour" s'allument VERT en cascade sur "14 pays
// votent", puis le siege-veto (extremite droite) devient un JETON DRAPEAU RUSSE (meme recette que le jeton
// Emirats du B4) qui s'allume au mot "Russie" — le veto INCARNE : on voit QUI bloque. Le globe est assombri
// derriere (espace clos du vote, gere par le parent via voteDim).
import React from "react";
import { interpolate, staticFile } from "remotion";

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const easeOrganic = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 2.2));

const PARCHMENT = "#f2e9cf";
const VOTE_GREEN = "#6B8E23"; // vert sauge — les 14 pour
const VOTE_RED = "#B23A2E"; // rouge — bascule au veto (tout bloque)
const INK = "#0a1018";

// lerp hex (bascule verte->rouge des sieges au veto)
const lerpHexV = (a: string, b: string, p: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, p))).toString(16).padStart(2, "0"));
  return `#${c.join("")}`;
};

// 15 sieges GPT (positions + rotations exactes du SVG genere). Le siege-veto = index 5 (outer_06,
// extremite droite, 1570,680) : il porte le jeton drapeau russe. Les 14 autres = "pour" (verts).
const SEATS: { x: number; y: number; rot: number }[] = [
  { x: 350, y: 680, rot: -73 }, { x: 480, y: 420, rot: -52 }, { x: 760, y: 285, rot: -20 },
  { x: 1160, y: 285, rot: 20 }, { x: 1440, y: 420, rot: 52 }, { x: 1570, y: 680, rot: 73 }, // [5] = VETO
  { x: 500, y: 730, rot: -73 }, { x: 620, y: 520, rot: -48 }, { x: 960, y: 450, rot: 0 },
  { x: 1300, y: 520, rot: 48 }, { x: 1420, y: 730, rot: 73 },
  { x: 675, y: 775, rot: -64 }, { x: 830, y: 640, rot: -30 }, { x: 1090, y: 640, rot: 30 }, { x: 1245, y: 775, rot: 64 },
];
const VETO_IDX = 5;

// ordre d'allumage des 14 verts (les non-veto), du centre vers l'exterieur pour un balayage naturel
const GREEN_ORDER = [8, 7, 9, 12, 13, 2, 3, 1, 4, 6, 10, 11, 14, 0];

// un siege du decor (rect dossier + core colorable + detail) — recette GPT convertie en JSX
const Seat: React.FC<{ x: number; y: number; rot: number; coreFill: string; coreStroke: string; litGlow: number }> =
  ({ x, y, rot, coreFill, coreStroke, litGlow }) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-29} y={-69} width={58} height={31} rx={15} fill="#303946" stroke={PARCHMENT} strokeWidth={3} />
      <path d="M-20-39v14M20-39v14" fill="none" stroke="#74808e" strokeWidth={2} strokeLinecap="round" />
      {litGlow > 0.01 && <circle r={52} fill={coreFill} opacity={litGlow * 0.35} />}
      <circle r={44} fill={coreFill} stroke={coreStroke} strokeWidth={3} />
      <circle r={31} fill="none" stroke="#74808e" strokeWidth={2} />
    </g>
  );

export const SoudanActe6VoteInsert: React.FC<{
  frame: number;
  tAppear: number; // b3Novembre : le decor apparait
  tVertPour: number; // b3Quatorze : les 14 verts s'allument (cascade)
  tRusse: number; // b3Russie : le jeton russe s'allume au siege-veto
  tVeto: number; // b3Veto : le veto fige le vote
  tFade: number; // b3Neutre : le decor s'efface
}> = ({ frame, tAppear, tVertPour, tRusse, tVeto, tFade }) => {
  const appear = interpolate(frame, [tAppear, tAppear + 24], [0, 1], clampB);
  const fade = interpolate(frame, [tFade, tFade + 30], [1, 0], clampB);
  const op = appear * fade;
  if (op <= 0.01) return null;

  const russeReveal = interpolate(frame, [tRusse, tRusse + 16], [0, 1], clampB);
  const vetoLock = interpolate(frame, [tVeto, tVeto + 20], [0, 1], clampB);
  const veto = SEATS[VETO_IDX];
  // ONDE DE CHOC du veto (Gemini+Kimi convergents) : part du siege russe, les sieges basculent au rouge
  // QUAND l'onde les touche (delai selon distance). Ralenti (retour Aziz : la bascule etait trop rapide,
  // 6-7s vides apres) — l'onde met ~4s a traverser toute la salle. Marteau frappe au tVeto.
  const distToRussia = (s: { x: number; y: number }) => Math.hypot(s.x - veto.x, s.y - veto.y);
  const MAX_DIST = 1250; // distance max approx (siege le plus loin)
  const WAVE_DUR = 120; // 4s pour que l'onde traverse toute la salle (ralenti)
  const waveRadius = interpolate(frame, [tVeto, tVeto + WAVE_DUR], [0, MAX_DIST + 100], clampB);
  // marteau : frappe (rotation rapide bas puis remonte) pile au tVeto
  const gavelHit = interpolate(frame, [tVeto - 6, tVeto, tVeto + 8, tVeto + 22], [0, -18, 6, 0], clampB);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: op }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* ===== DECOR GPT (background + chambre SANS croix + socle) ===== */}
        <g id="background_night" opacity={appear}>
          <rect width={1920} height={1080} fill="#0a1018" />
          <path d="M130 772C204 250 558 92 960 92s756 158 830 680" fill="#0d1621" stroke="#263342" strokeWidth={3} />
          <path d="M213 713C312 302 606 169 960 169s648 133 747 544" fill="none" stroke="#202c39" strokeWidth={2} />
          <path d="M316 637C447 335 677 245 960 245s513 90 644 392" fill="none" stroke="#182431" strokeWidth={2} />
          <ellipse cx={960} cy={190} rx={268} ry={62} fill={PARCHMENT} opacity={0.035} />
        </g>
        {/* chambre : montants lateraux SEULEMENT (la croix/mire du haut est RETIREE, retour Aziz) */}
        <g id="chamber" opacity={appear} fill="none" stroke={PARCHMENT} strokeLinecap="round" strokeLinejoin="round">
          <path d="M119 791L119 535C119 483 145 452 190 432" strokeWidth={3} opacity={0.78} />
          <path d="M1801 791L1801 535C1801 483 1775 452 1730 432" strokeWidth={3} opacity={0.78} />
          <path d="M119 535h56M1801 535h-56" strokeWidth={2} opacity={0.65} />
        </g>
        {/* socle amphitheatre */}
        <g id="socle" opacity={appear}>
          <path d="M124 799C218 346 555 206 960 206s742 140 836 593c-161 181-482 253-836 253S285 980 124 799Z" fill="#111a25" stroke={PARCHMENT} strokeWidth={3} />
          <path d="M188 790C303 414 602 292 960 292s657 122 772 498" fill="none" stroke="#53606d" strokeWidth={3} />
          <path d="M326 808C417 527 664 424 960 424s543 103 634 384" fill="none" stroke="#53606d" strokeWidth={3} />
          <path d="M500 829C585 625 760 548 960 548s375 77 460 281" fill="none" stroke="#53606d" strokeWidth={3} />
        </g>

        {/* TRIBUNE centrale du president + maillet + 2 micros (GPT) — PRESENTE tout du long (retour Aziz :
            c'est ce qui fait "salle du Conseil"). Rendu APRES le socle, AVANT les sieges. */}
        <g id="central_rostrum" opacity={appear}>
          <path d="M786 838L827 790h266l41 48-25 151H811Z" fill="#202b37" stroke={PARCHMENT} strokeWidth={3} />
          <path d="M827 790h266l-22 52H849Z" fill="#3a4452" stroke={PARCHMENT} strokeWidth={3} />
          <path d="M842 845h236l-15 105H857Z" fill="#151e29" stroke="#53606d" strokeWidth={2} />
          <path d="M811 989h112v42H790v-19c0-13 8-23 21-23ZM1109 989H997v42h133v-19c0-13-8-23-21-23Z" fill="#080d13" stroke={PARCHMENT} strokeWidth={3} />
          {/* les 2 micros sur tiges */}
          <path d="M887 790l-17-65M1033 790l17-65" fill="none" stroke={PARCHMENT} strokeWidth={3} strokeLinecap="round" />
          <circle cx={868} cy={718} r={8} fill="#3a4452" stroke={PARCHMENT} strokeWidth={3} />
          <circle cx={1052} cy={718} r={8} fill="#3a4452" stroke={PARCHMENT} strokeWidth={3} />
        </g>
        {/* maillet du president — FRAPPE au veto (retour Aziz/Kimi : marquer le coup d'autorite).
            gavelHit ajoute une rotation rapide (le maillet s'abat) pile au tVeto. */}
        <g id="gavel" transform={`translate(960 810) rotate(${-13 + gavelHit})`} opacity={appear}>
          <rect x={-8} y={-52} width={16} height={82} rx={7} fill="#596472" stroke={PARCHMENT} strokeWidth={3} />
          <rect x={-43} y={-69} width={86} height={31} rx={9} fill="#3a4452" stroke={PARCHMENT} strokeWidth={3} />
          <path d="M-34-69v31M34-69v31" fill="none" stroke={PARCHMENT} strokeWidth={2} strokeLinecap="round" />
          <ellipse cx={0} cy={38} rx={34} ry={9} fill="#202b37" stroke={PARCHMENT} strokeWidth={3} />
        </g>

        {/* ===== 15 SIEGES : 14 verts (cascade) + 1 veto (jeton russe) ===== */}
        {SEATS.map((s, i) => {
          if (i === VETO_IDX) {
            // siege-veto : reste NEUTRE jusqu'au mot "Russie", puis devient le jeton drapeau russe (rendu plus bas)
            const neutralOp = interpolate(frame, [tRusse, tRusse + 10], [1, 0], clampB);
            if (neutralOp <= 0.01) return null;
            return <g key={i} opacity={neutralOp}><Seat {...s} coreFill="#3a4452" coreStroke={PARCHMENT} litGlow={0} /></g>;
          }
          const gi = GREEN_ORDER.indexOf(i);
          const delay = gi * 7; // ralenti (retour Aziz : arrivaient trop vite) — 14 verts sur ~3.3s au lieu de 1.9s
          const lit = interpolate(frame, [tVertPour + delay, tVertPour + delay + 14], [0, 1], clampB);
          const e = easeOrganic(lit);
          // ⭐ BASCULE AU ROUGE par ONDE DE CHOC (retour Aziz + Gemini/Kimi) : chaque siege bascule QUAND
          // l'onde issue de la Russie le touche (flipStart = distance / vitesse). Ralenti : ~4s au total.
          const d = distToRussia(s);
          const flipStart = tVeto + (d / (MAX_DIST + 100)) * WAVE_DUR;
          const flip = interpolate(frame, [flipStart, flipStart + 16], [0, 1], clampB); // 16f de transition douce
          const core = e <= 0.02 ? "#3a4452" : lerpHexV(VOTE_GREEN, VOTE_RED, flip);
          const strokeCol = e <= 0.5 ? PARCHMENT : lerpHexV(VOTE_GREEN, VOTE_RED, flip);
          // X qui se DESSINE (stroke-dashoffset) au passage de l'onde (Gemini)
          const xDraw = interpolate(frame, [flipStart + 4, flipStart + 18], [1, 0], clampB); // 1->0 = trait se trace
          return (
            <g key={i} opacity={appear}>
              <Seat x={s.x} y={s.y} rot={s.rot} coreFill={core} coreStroke={strokeCol} litGlow={e * (1 - 0.2 * flip)} />
              {e > 0.5 && (
                <g transform={`translate(${s.x} ${s.y})`}>
                  {/* coche verte (s'efface a la bascule) */}
                  {flip < 0.9 && (
                    <path d="M -13 0 L -4 11 L 14 -12" fill="none" stroke={PARCHMENT} strokeWidth={5}
                      strokeLinecap="round" strokeLinejoin="round" opacity={e * (1 - flip)} />
                  )}
                  {/* X rouge qui SE DESSINE au passage de l'onde */}
                  {flip > 0.05 && (
                    <g stroke={PARCHMENT} strokeWidth={5} strokeLinecap="round" opacity={flip}>
                      <line x1={-11} y1={-11} x2={11} y2={11} strokeDasharray={32} strokeDashoffset={32 * xDraw} />
                      <line x1={11} y1={-11} x2={-11} y2={11} strokeDasharray={32} strokeDashoffset={32 * xDraw} />
                    </g>
                  )}
                </g>
              )}
            </g>
          );
        })}
        {/* ONDE DE CHOC visuelle du veto (cercle qui se propage depuis la Russie) */}
        {vetoLock > 0.02 && waveRadius > 5 && waveRadius < MAX_DIST + 100 && (
          <circle cx={veto.x} cy={veto.y} r={waveRadius} fill="none" stroke={VOTE_RED} strokeWidth={3}
            opacity={interpolate(waveRadius, [0, 200, MAX_DIST], [0.5, 0.35, 0], clampB)} />
        )}

        {/* ===== JETON DRAPEAU RUSSE au siege-veto (meme recette que jeton Emirats B4) ===== */}
        {russeReveal > 0.01 && (
          <g transform={`translate(${veto.x} ${veto.y})`} opacity={russeReveal}>
            {/* halo veto (registre radar, stroke pointille — PAS un glow baveux) */}
            {vetoLock > 0.02 && <circle r={62 + vetoLock * 10} fill="none" stroke="#8B1A1A" strokeWidth={2.5} strokeOpacity={0.55} strokeDasharray="5 6" />}
            <circle r={50} fill="#0a0d12" />
            <clipPath id="a6ru-clip"><circle r={46} /></clipPath>
            <image href={staticFile("_shared/flags/ru.png")} x={-46} y={-46} width={92} height={92}
              clipPath="url(#a6ru-clip)" preserveAspectRatio="xMidYMid slice" opacity={0.35 + 0.65 * russeReveal} />
            <circle r={46} fill="none" stroke={INK} strokeWidth={3} />
            <circle r={49} fill="none" stroke="#8B1A1A" strokeWidth={3} strokeOpacity={0.5 + 0.5 * vetoLock} />
            {/* X "contre" superpose au veto */}
            {vetoLock > 0.3 && (
              <g stroke={PARCHMENT} strokeWidth={4} strokeLinecap="round" opacity={vetoLock}>
                <line x1={-13} y1={-13} x2={13} y2={13} />
                <line x1={13} y1={-13} x2={-13} y2={13} />
              </g>
            )}
          </g>
        )}

        {/* ===== LABELS ===== */}
        {/* titre — 2s + fade (retour Aziz : ne pas garder tout le beat, comme nos plaques de sources) */}
        {(() => {
          const titleOp = interpolate(frame, [tAppear, tAppear + 20, tAppear + 80, tAppear + 96], [0, 1, 1, 0], clampB);
          if (titleOp <= 0.01) return null;
          return (
            <g transform="translate(960 150)" opacity={titleOp}>
              <rect x={-270} y={-30} width={540} height={50} rx={3} fill="rgba(8,12,18,0.82)" stroke={PARCHMENT} strokeWidth={1} strokeOpacity={0.35} />
              <text x={0} y={5} textAnchor="middle" fontFamily="Georgia, serif" fontSize={25} fontWeight={700}
                letterSpacing="0.04em" fill={PARCHMENT}>Conseil de Sécurité de l'ONU — Nov. 2024</text>
            </g>
          );
        })()}
        {/* AUCUN texte dans la scène (retour Aziz : la voix dit tout, le visuel respire). Retrait de
            "14 pour"/"1 veto"/"Résolution bloquée"/"Russie" — le drapeau russe barré + 14 verts se lisent
            seuls, la voix nomme la Russie. Seul texte gardé = le titre "Conseil de Sécurité — Nov. 2024". */}
      </svg>
    </div>
  );
};

export default SoudanActe6VoteInsert;
