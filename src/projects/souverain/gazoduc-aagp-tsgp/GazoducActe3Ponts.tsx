// MOTEUR: objet/metaphore SVG — le paradoxe est STRUCTUREL (un ouvrage parfait qui ne repose sur
// rien / un ouvrage bien fonde mais rompu). On QUITTE la carte pour clore l'acte, comme le verrou.
//
// ⛔⛔ VARIANTE REJETEE PAR AZIZ LE 2026-08-18 — NE PAS LA REPRENDRE, NE PAS LA MONTER.
// Conservee uniquement comme trace de l'arbitrage (les 2 variantes ont ete codees et rendues).
// Motif du rejet, qui vaut comme REGLE reutilisable : la metaphore est IMPORTEE au lieu d'etre
// prise dans le monde du sujet. Mots d'Aziz : « je me demande meme pourquoi il y a des ponts […]
// quel est le rapport avec le gazoduc ? quel est le rapport avec le gaz ? ». Un pont REPRESENTE
// une infrastructure (2 traductions mentales : pont = projet, fils = financement) la ou une
// conduite avec une vanne EN EST une (zero traduction).
// ⚠️ Cette variante etait la PLUS BELLE graphiquement — la beaute ne rachete pas le cout de
// decodage. Voir memory/.../feedback_metaphore-dans-le-monde-du-sujet.md
// ✅ Variante retenue : GazoducActe3Verrou.tsx
//
// GazoducActe3Ponts — Acte 3, SEGMENT C (cloture), 17,3 s. VARIANTE B.
//
// Decor : src/projects/_rnd/svg-scenes/GazoducDeuxPonts.svg (Fable 5, 19 groupes animables).
// Concept : Kimi (phase 1 texte). Planche de storyboard : Grok Imagine 2.0.
// ⛔ Variante SOUMISE A ARBITRAGE face a GazoducActe3Verrou.tsx — les deux sont codees exprès,
// pour juger sur le RENDU ANIME et non sur une image fixe (decision d'Aziz : le SVG etant deja
// produit, coder les deux coute peu et le mouvement ne se juge qu'en mouvement).
//
// Ce que la scene raconte, sans un mot a l'ecran :
//   MAROC   : tablier doré parfait, arches regulieres — mais il ne repose sur RIEN, suspendu a
//             trois fils fins au-dessus d'un vide. Les fils vibrent : ca tient, mais a peine.
//   ALGERIE : fondations massives plantees dans le sol — mais le tablier est ROMPU en son milieu,
//             la breche s'ouvre, des fragments tombent, une lueur rouge bat dans la fracture.
//
// ⛔ 2 REGLES DE L'EPISODE APPLIQUEES ICI :
//  1. Rien a l'ecran ne redit ce que la voix dit au meme instant. Seules les plaques de noms.
//  2. Timing AUDIO-DERIVE : tout est cale sur BEATS_C (forced-align), jamais une frame en dur.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS_C, GAZODUC_A3_INSERT_PARADOXE_FRAMES } from "./GazoducActe3Timing";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);
const B = BEATS_C;
const SWITCH = B.algerieStart; // "L'Algerie mise sur..." — forced-align

const Fil: React.FC<{ x: number; rot: number }> = ({ x, rot }) => (
  <g transform={`translate(${x} 0) rotate(${rot})`}>
    <line x1={0} y1={-40} x2={0} y2={540} stroke="#FFE38A" strokeOpacity={0.18} strokeWidth={7} />
    <line x1={0} y1={-40} x2={0} y2={540} stroke="#FFE38A" strokeWidth={2.5} />
    <rect x={-8} y={534} width={16} height={8} rx={2} fill="#FFE38A" />
    <circle cx={0} cy={540} r={5} fill="#FFE38A" />
  </g>
);

export const GazoducActe3Ponts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ===== MAROC — le pont flotte, les fils vibrent en decale =====
  // Le flottement existe DES la premiere image : le pont ne repose sur rien, ce n'est pas un
  // evenement qui arrive, c'est son etat permanent.
  const flotte = Math.sin(frame * 0.055) * 4;
  // Vibration des fils : dephasee, amplifiee pendant la clause "suspendu a un accord".
  const tension = interpolate(
    frame,
    [B.marocPacifieEnd, B.marocPhraseEnd, SWITCH + S(1)],
    [0.35, 1, 0.5],
    clampB,
  );
  const filRot = (i: number) => Math.sin(frame * 0.16 - i * 0.9) * 0.55 * tension;
  // Le vide se creuse pendant la clause financiere.
  const videOp = interpolate(frame, [B.marocStart, B.marocPacifieEnd, B.marocPhraseEnd], [0.55, 0.8, 1], clampB);

  // ===== ALGERIE — la breche s'ouvre, les fragments tombent, la lueur bat =====
  // ⛔ Rien ne se casse AVANT que la voix ne parle de l'Algerie : le geste suit le mot.
  const breche = spring({
    frame: frame - (SWITCH + S(2.2)),
    fps,
    config: { damping: 14, mass: 1.1 },
    durationInFrames: S(1.6),
  });
  const rotGauche = breche * 1.7;
  const rotDroit = -breche * 1.7;

  const fragOp = interpolate(frame, [SWITCH + S(2.6), SWITCH + S(3.4)], [0, 1], clampB);
  const chute = (i: number) => {
    const t0 = SWITCH + S(2.8) + i * S(0.35);
    const p = interpolate(frame, [t0, t0 + S(3.4)], [0, 1], clampB);
    return { dy: p * (60 + i * 26), rot: p * (34 + i * 22), op: 1 - p * 0.55 };
  };

  // Lueur rouge : montee franche puis battement irregulier (jamais un fondu lineaire propre).
  const lueurIn = interpolate(frame, [SWITCH + S(2.4), SWITCH + S(3.6)], [0, 1], clampB);
  const battement = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(frame * 0.19 + Math.sin(frame * 0.07) * 1.4));
  const lueurOp = lueurIn * battement;

  // Plaques : chacune apparait quand la voix nomme son pays.
  const plaqueMaroc = interpolate(frame, [B.marocStart, B.marocStart + S(0.8)], [0, 1], clampB);
  const plaqueAlgerie = interpolate(frame, [SWITCH, SWITCH + S(0.8)], [0, 1], clampB);

  // ===== CAMERA — leger push-in + derive, jamais figee =====
  const camScale = interpolate(frame, [0, B.segEnd], [1.02, 1.10], clampB);
  const camDx = interpolate(frame, [0, B.segEnd], [40, -46], clampB);
  const camDy = interpolate(frame, [0, B.segEnd], [6, -10], clampB);
  const camTx = W / 2 - 960 * camScale + camDx;
  const camTy = H / 2 - 560 * camScale + camDy;

  const globalFade = interpolate(
    frame,
    [0, S(0.5), B.segEnd + 9 - S(0.5), B.segEnd + 9],
    [0, 1, 1, 0],
    clampB,
  );

  return (
    <AbsoluteFill style={{ background: "#050c1a", opacity: globalFade }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="pBg" cx="50%" cy="46%" r="75%">
            <stop offset="0%" stopColor="#0d1f38" />
            <stop offset="100%" stopColor="#050c1a" />
          </radialGradient>
          <linearGradient id="pGoldDeck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE38A" />
            <stop offset="100%" stopColor="#FFC742" />
          </linearGradient>
          <linearGradient id="pGoldArch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC742" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFC742" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="pCyanDeck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C4FF" />
            <stop offset="100%" stopColor="#00C4FF" stopOpacity="0.62" />
          </linearGradient>
          <linearGradient id="pStone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16304f" />
            <stop offset="100%" stopColor="#050c1a" />
          </linearGradient>
          <radialGradient id="pVoid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#050c1a" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#050c1a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#050c1a" stopOpacity="0" />
          </radialGradient>
          {/* ⚠️ Halo RESSERRE par rapport au SVG livre : le disque d'origine (r=115 + disque plein
              r=52) ecrasait la fracture au lieu de la souligner (constate au rendu du SVG nu). */}
          <radialGradient id="pRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4B45" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#FF4B45" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FF4B45" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={W} height={H} fill="url(#pBg)" />

        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          {/* ===== MAROC — le vide sous le pont ===== */}
          <g opacity={videOp}>
            <ellipse cx={520} cy={800} rx={310} ry={115} fill="url(#pVoid)" />
            <ellipse cx={520} cy={795} rx={180} ry={60} fill="#050c1a" fillOpacity={0.8} />
          </g>

          {/* Le pont doré entier flotte : tablier + arches solidaires, comme dans la realite du plan */}
          <g transform={`translate(0 ${flotte})`}>
            <g>
              <path
                fill="url(#pGoldArch)"
                fillRule="evenodd"
                d="M 220 574 H 820 V 690 H 220 Z
                   M 244 690 V 634 A 60 60 0 0 1 364 634 V 690 Z
                   M 388 690 V 634 A 60 60 0 0 1 508 634 V 690 Z
                   M 532 690 V 634 A 60 60 0 0 1 652 634 V 690 Z
                   M 676 690 V 634 A 60 60 0 0 1 796 634 V 690 Z"
              />
              <line x1={220} y1={690} x2={820} y2={690} stroke="#FFC742" strokeOpacity={0.35} strokeWidth={2} />
            </g>
            <g>
              <rect x={200} y={540} width={640} height={34} rx={6} fill="url(#pGoldDeck)" />
              <rect x={212} y={544} width={616} height={4} rx={2} fill="#FFE38A" fillOpacity={0.9} />
              <rect x={194} y={532} width={14} height={46} rx={4} fill="#FFE38A" />
              <rect x={832} y={532} width={14} height={46} rx={4} fill="#FFE38A" />
            </g>
          </g>

          {/* Les 3 fils — LE SENS DU PLAN. Ils vibrent en decale, jamais masques. */}
          <g transform={`translate(0 ${flotte * 0.35})`}>
            <Fil x={320} rot={filRot(0)} />
            <Fil x={520} rot={filRot(1)} />
            <Fil x={720} rot={filRot(2)} />
          </g>

          {/* ===== ALGERIE — sol massif + piles (statiques : c'est la force) ===== */}
          <g>
            <path
              fill="url(#pStone)"
              d="M 1040 794 L 1092 780 L 1182 787 L 1300 778 L 1420 785 L 1540 779 L 1662 786 L 1742 780 L 1780 794 L 1780 900 L 1040 900 Z"
            />
            <polyline
              points="1040,794 1092,780 1182,787 1300,778 1420,785 1540,779 1662,786 1742,780 1780,794"
              fill="none" stroke="#58809f" strokeWidth={2.5}
            />
            <polygon points="1108,820 1146,812 1160,834 1116,840" fill="#16304f" stroke="#58809f" strokeWidth={1.5} strokeOpacity={0.6} />
            <polygon points="1594,824 1636,816 1652,840 1602,846" fill="#16304f" stroke="#58809f" strokeWidth={1.5} strokeOpacity={0.6} />
            <line x1={1240} y1={852} x2={1330} y2={848} stroke="#58809f" strokeOpacity={0.35} strokeWidth={2} />
            <line x1={1460} y1={860} x2={1560} y2={856} stroke="#58809f" strokeOpacity={0.35} strokeWidth={2} />
          </g>
          <g>
            {[
              { rx: 1060, px: [1090, 1150, 1166, 1074], cx: 1086 },
              { rx: 1240, px: [1270, 1330, 1346, 1254], cx: 1266 },
              { rx: 1440, px: [1470, 1530, 1546, 1454], cx: 1466 },
              { rx: 1620, px: [1650, 1710, 1726, 1634], cx: 1646 },
            ].map((p, i) => (
              <g key={`pile-${i}`}>
                <rect x={p.rx} y={792} width={120} height={28} rx={3} fill="#16304f" stroke="#58809f" strokeWidth={2} />
                <polygon points={`${p.px[0]},574 ${p.px[1]},574 ${p.px[2]},796 ${p.px[3]},796`} fill="url(#pStone)" stroke="#58809f" strokeWidth={2} />
                <rect x={p.cx} y={574} width={68} height={8} fill="#00C4FF" fillOpacity={0.9} />
              </g>
            ))}
          </g>

          {/* Lueur rouge dans la fracture — derriere les demi-tabliers, elle silhouette les bords */}
          <g opacity={lueurOp}>
            <circle cx={1398} cy={578} r={98} fill="url(#pRed)" />
            <ellipse cx={1398} cy={572} rx={18} ry={34} fill="#FF4B45" fillOpacity={0.85} />
          </g>

          {/* Demi-tabliers : la breche s'OUVRE (2 groupes separes, origine locale = sommet de pile) */}
          <g transform={`translate(1300 574) rotate(${rotGauche})`}>
            <path fill="url(#pCyanDeck)" d="M -214 -34 Q -220 -34 -220 -28 V -6 Q -220 0 -214 0 H 58 L 82 -7 L 55 -12 L 74 -20 L 50 -26 L 66 -34 Z" />
            <rect x={-210} y={-30} width={252} height={4} rx={2} fill="#F4F8FF" fillOpacity={0.35} />
            <rect x={-226} y={-42} width={14} height={46} rx={4} fill="#00C4FF" />
          </g>
          <g transform={`translate(1500 574) rotate(${rotDroit})`}>
            <path fill="url(#pCyanDeck)" d="M 214 -34 Q 220 -34 220 -28 V -6 Q 220 0 214 0 H -62 L -86 -6 L -57 -13 L -78 -21 L -52 -27 L -70 -34 Z" />
            <rect x={-42} y={-30} width={252} height={4} rx={2} fill="#F4F8FF" fillOpacity={0.35} />
            <rect x={212} y={-42} width={14} height={46} rx={4} fill="#00C4FF" />
          </g>

          {/* Fragments : chute decalee, chacun sur son propre centroide */}
          <g opacity={fragOp}>
            {[
              { x: 1382, y: 615, pts: "-14,-10 12,-16 16,2 -4,12", o: 0.9 },
              { x: 1414, y: 656, pts: "-10,-12 14,-6 8,12 -12,8", o: 0.75 },
              { x: 1394, y: 700, pts: "-8,-8 10,-10 12,6 -10,10", o: 0.6 },
            ].map((f, i) => {
              const c = chute(i);
              return (
                <g key={`frag-${i}`} transform={`translate(${f.x} ${f.y + c.dy}) rotate(${c.rot})`} opacity={c.op}>
                  <polygon points={f.pts} fill="#00C4FF" fillOpacity={f.o} />
                </g>
              );
            })}
          </g>

          {/* ===== PLAQUES — elles IDENTIFIENT, elles n'expliquent pas ===== */}
          <g opacity={plaqueMaroc}>
            <rect x={400} y={936} width={240} height={62} rx={8} fill="#16304f" stroke="#FFC742" strokeWidth={2} />
            <text x={524} y={978} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace"
              fontSize={32} fontWeight={700} letterSpacing="8" fill="#F4F8FF">MAROC</text>
          </g>
          <g opacity={plaqueAlgerie}>
            <rect x={1266} y={936} width={268} height={62} rx={8} fill="#16304f" stroke="#00C4FF" strokeWidth={2} />
            <text x={1404} y={978} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace"
              fontSize={32} fontWeight={700} letterSpacing="8" fill="#F4F8FF">ALGÉRIE</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const GAZODUC_A3_PONTS_FRAMES = GAZODUC_A3_INSERT_PARADOXE_FRAMES;

export default GazoducActe3Ponts;
