/**
 * IngaEncreH — Grand Inga, registre ENCRE NARRATIVE, format HORIZONTAL 16:9.
 * Deuxième passe : même registre que GGW (parchemin + encre + colorisation sémantique A/B/C).
 * Objets héros GRANDS — un seul par moment, lisible en <1s.
 *
 * Palette (identique GGW) :
 *   CREME  #e8dcc0  — fond parchemin (permanent, jamais colorisé globalement)
 *   ENCRE  #2b2117  — trait de base (contours, dunes, hachures)
 *   BLEU   #3a7bd4  — l'eau (naît bleue — mécanisme A)
 *   GRIS   #8a8070  — béton coulé (mécanisme B : contour → gris)
 *   OR     #f2b53a  — turbine allumée / lumière (mécanisme B : contour → or)
 *   GRIS_MORT #514c44 — lumière éteinte (mécanisme C : or → gris terne)
 *
 * Chronologie (1200f / 40s @30fps) :
 *   f0-60    FLEUVE : ligne d'eau bleue qui entre par la gauche, traverse le cadre
 *   f60-200  MUR    : le mur se dessine en contour encre (stroke-dashoffset) → se colorise gris-béton
 *   f200-350 EAU    : derrière le mur, l'eau monte (fill bleu, héros centré, grand)
 *   f350-520 TURBINE: contour or qui se trace → rotation → s'illumine pleinement
 *   f520-700 FIL    : trait encre pâle qui traverse → vire cyan quand "l'électricité passe"
 *   f700-900 LUMIÈRES: 5 points or qui s'allument (les villes) → 3 s'éteignent (ruraux sans accès)
 *   f900-1200 PARADOXE: les deux chiffres montent en encre / contre-révélation finale
 *
 * Grammaire HORIZONTALE (scène-lieu, fil conducteur gauche→droite) :
 *   - Le fil conducteur = l'ossature visuelle permanente une fois tracé
 *   - Spotlight : l'objet actif est en pleine opacité, le reste recule à 0.15
 *   - Zéro viewBox mobile, zéro glissement d'objet inerte
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// ── Palette encre (même que GGW) ──────────────────────────────────────────
const CREME   = "#e8dcc0";
const ENCRE   = "#2b2117";
const BLEU    = "#3a7bd4";
const BLEU_P  = "#a8c8f0";   // bleu pâle (eau lointaine)
const GRIS    = "#8a8070";   // béton
const OR      = "#f2b53a";
const OR_GLOW = "#ffd86b";
const GRIS_MORT = "#514c44"; // lumière éteinte (mécanisme C)
const ENCRE_P = "#b0a090";   // encre pâle (éléments en attente)

const W = 1920;
const H = 1080;
const CX = W / 2;
const CY = H / 2;

// ── Helpers ───────────────────────────────────────────────────────────────
const prog = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const dash = (f: number, start: number, end: number, len: number) =>
  len * (1 - prog(f, start, end));

// Spotlight : l'objet actif = 1, les autres = dim
const PHASES = [
  { name: "fleuve",   start: 0,    end: 60  },
  { name: "mur",      start: 60,   end: 200 },
  { name: "eau",      start: 200,  end: 350 },
  { name: "turbine",  start: 350,  end: 520 },
  { name: "fil",      start: 520,  end: 700 },
  { name: "lumieres", start: 700,  end: 900 },
  { name: "paradoxe", start: 900,  end: 1200},
] as const;

function spotlightOpacity(f: number, name: string, dimValue = 0.12): number {
  const active = PHASES.find(p => f >= p.start && f < p.end)?.name ?? "paradoxe";
  if (name === active) return 1;
  // éléments déjà passés restent à 0.3 (ils font partie du décor)
  const myPhase = PHASES.find(p => p.name === name);
  if (myPhase && f >= myPhase.end) return 0.3;
  return dimValue;
}

// ── Dimensions des héros ──────────────────────────────────────────────────
// MUR — centré, grand
const MUR_CX  = CX;
const MUR_TOP = CY - 280;
const MUR_BOT = CY + 60;   // rejoint le fleuve
const MUR_W   = 120;
const MUR_H   = MUR_BOT - MUR_TOP;
const ROWS    = 7;
const COLS    = 3;
const BLOC_H  = MUR_H / ROWS;
const BLOC_W  = MUR_W / COLS;

// TURBINE — héros central, radius 160
const TURB_X  = CX;
const TURB_Y  = CY - 60;
const TURB_R  = 160;

// FIL — bord à bord
const FIL_Y   = CY - 120;
const FIL_X1  = 80;
const FIL_X2  = W - 80;
const FIL_LEN = FIL_X2 - FIL_X1;

// VILLES (points lumineux, répartis sur la droite du cadre)
const VILLES = [
  { x: W * 0.62, y: H * 0.28, nom: "Kinshasa",    rural: false },
  { x: W * 0.74, y: H * 0.42, nom: "Lubumbashi",  rural: false },
  { x: W * 0.82, y: H * 0.22, nom: "Brazzaville", rural: false },
  { x: W * 0.68, y: H * 0.62, nom: "Kolwezi",     rural: true  }, // mine cobalt
  { x: W * 0.56, y: H * 0.72, nom: "Rural Est",   rural: true  },
  { x: W * 0.88, y: H * 0.68, nom: "Rural Nord",  rural: true  },
  { x: W * 0.78, y: H * 0.78, nom: "Rural Sud",   rural: true  },
];

export const IngaEncreH: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── FLEUVE ──────────────────────────────────────────────────────────────
  // Eau bleue qui entre par la gauche — mécanisme A (entre déjà colorée)
  const fleuveP     = prog(f, 0, 50);
  const fleuveClip  = fleuveP * W;   // le trait grandit de gauche à droite
  const fleuveOp    = spotlightOpacity(f, "fleuve");
  // ondulation (sin léger, couche de fond permanente)
  const ondule = Math.sin(f * 0.04) * 4;

  // ── MUR ─────────────────────────────────────────────────────────────────
  // Phase 1 (f60-130) : contour encre se trace (stroke-dashoffset)
  // Phase 2 (f130-200) : mécanisme B — fill se colore gris-béton
  const murTraceP  = prog(f, 60, 130);
  const murColorP  = prog(f, 130, 200);
  const murOp      = spotlightOpacity(f, "mur");

  // ── EAU DERRIÈRE LE MUR ─────────────────────────────────────────────────
  // Mécanisme A : naît bleue, monte de MUR_BOT vers MUR_TOP
  const eauP       = prog(f, 210, 340);
  const eauH_now   = eauP * (MUR_H * 0.85);
  const eauOp      = spotlightOpacity(f, "eau");

  // ── TURBINE ─────────────────────────────────────────────────────────────
  // Phase 1 (f350-430) : contour encre se trace
  // Phase 2 (f430-520) : mécanisme B — vire or, rotation
  const turbTraceP = prog(f, 350, 430);
  const turbColorP = prog(f, 430, 520);
  const turbOp     = spotlightOpacity(f, "turbine");
  const turbSpin   = f > 430 ? (f - 430) * 2.2 : 0;
  const turbScale  = spring({ frame: f - 350, fps, config: { mass: 1, damping: 14, stiffness: 70 } });
  const turbR_now  = TURB_R * Math.min(1, turbScale);

  // couleur turbine : encre → or (mécanisme B)
  const turbStroke = f < 430 ? ENCRE : OR;
  const turbFill   = f < 430 ? "none"
    : `rgba(242,181,58,${turbColorP * 0.08})`;

  // ── FIL CONDUCTEUR ──────────────────────────────────────────────────────
  // Phase 1 (f520-620) : trait encre pâle se trace bord à bord
  // Phase 2 (f620-700) : mécanisme B — vire bleu-acier (l'électricité passe)
  const filTraceP  = prog(f, 520, 620);
  const filColorP  = prog(f, 620, 700);
  const filOp      = spotlightOpacity(f, "fil");
  const filStroke  = filColorP > 0.5 ? BLEU : ENCRE_P;
  const filWidth   = 2 + filColorP * 4;
  // particules qui coulent le long du fil (une fois colorisé)
  const filDash    = dash(f, 520, 620, FIL_LEN);

  // ── LUMIÈRES ────────────────────────────────────────────────────────────
  // Villes s'allument en cascade (or), puis les ruraux s'éteignent (mécanisme C → gris_mort)
  const villeOp    = spotlightOpacity(f, "lumieres");

  // ── PARADOXE (texte) ────────────────────────────────────────────────────
  const paraP      = prog(f, 900, 980);
  const para2P     = prog(f, 980, 1060);
  const para3P     = prog(f, 1060, 1140);

  return (
    <AbsoluteFill style={{ background: CREME, overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* ── HACHURES DE FOND (le désert/la terre — permanentes, encre pâle) ── */}
        <g opacity={0.07}>
          {Array.from({ length: 40 }, (_, i) => (
            <line key={i}
              x1={i * 52} y1={H * 0.6 + Math.sin(i * 0.8) * 30}
              x2={i * 52 + 28} y2={H * 0.6 + Math.sin(i * 0.8) * 30 + 18}
              stroke={ENCRE} strokeWidth={1.2}
            />
          ))}
        </g>

        {/* ── SOL (ligne d'horizon) ── */}
        <line
          x1={0} y1={CY + 60} x2={W} y2={CY + 60}
          stroke={ENCRE} strokeWidth={1.5} opacity={0.25}
        />

        {/* ══════════════ FLEUVE CONGO ══════════════ */}
        <g opacity={fleuveOp}>
          {/* Clip progressif (l'eau entre par la gauche) */}
          <clipPath id="fleuveClip">
            <rect x={0} y={0} width={fleuveClip} height={H} />
          </clipPath>

          {/* Corps du fleuve — large, bleu, héros */}
          <g clipPath="url(#fleuveClip)">
            <path
              d={`M 0 ${CY + 30 + ondule}
                  C ${W*0.15} ${CY + 20},
                    ${W*0.3}  ${CY + 45},
                    ${W*0.5}  ${CY + 28 + ondule}
                  S ${W*0.75} ${CY + 18},
                    ${W}      ${CY + 35}`}
              fill="none"
              stroke={BLEU}
              strokeWidth={28}
              strokeLinecap="round"
              opacity={0.85}
            />
            {/* Reflet (filet pâle dessus) */}
            <path
              d={`M 0 ${CY + 22 + ondule * 0.5}
                  C ${W*0.2} ${CY + 14}, ${W*0.45} ${CY + 32}, ${W*0.7} ${CY + 20}
                  L ${W} ${CY + 26}`}
              fill="none"
              stroke={BLEU_P}
              strokeWidth={7}
              strokeLinecap="round"
              opacity={0.5}
            />
          </g>

          {/* Label fleuve */}
          <text
            x={W * 0.15} y={CY - 10}
            fontFamily="Georgia, serif" fontSize={22} fill={ENCRE}
            opacity={prog(f, 20, 55) * 0.65}
            fontStyle="italic"
          >
            Fleuve Congo — 41 200 m³/s
          </text>
        </g>

        {/* ══════════════ MUR DE BÉTON ══════════════ */}
        <g opacity={murOp}>
          {/* Bloc par bloc, de bas en haut */}
          {Array.from({ length: ROWS }, (_, row) => {
            const rowP    = prog(f, 60 + row * 10, 80 + row * 10);
            const yTop    = MUR_TOP + row * BLOC_H;
            // mécanisme B : fill s'anime de transparent → gris-béton
            const bFill   = murColorP > 0
              ? `rgba(138,128,112,${murColorP * 0.55})`
              : "none";

            return (
              <g key={row} opacity={rowP}>
                {Array.from({ length: COLS }, (_, col) => {
                  const bx = MUR_CX - MUR_W / 2 + col * BLOC_W;
                  return (
                    <rect
                      key={col}
                      x={bx + 2} y={yTop + 2}
                      width={BLOC_W - 4} height={BLOC_H - 4}
                      fill={bFill}
                      stroke={ENCRE}
                      strokeWidth={murColorP > 0.5 ? 1.2 : 1.8}
                      opacity={0.9}
                    />
                  );
                })}
                {/* Hachures béton armé */}
                <line
                  x1={MUR_CX - MUR_W / 2} y1={yTop + BLOC_H * 0.5}
                  x2={MUR_CX + MUR_W / 2} y2={yTop + BLOC_H * 0.5}
                  stroke={ENCRE} strokeWidth={0.6} strokeDasharray="5 4" opacity={0.2}
                />
              </g>
            );
          })}

          {/* Cote hauteur */}
          <g opacity={prog(f, 140, 190)}>
            <line
              x1={MUR_CX + MUR_W / 2 + 20} y1={MUR_TOP}
              x2={MUR_CX + MUR_W / 2 + 20} y2={MUR_BOT}
              stroke={ENCRE} strokeWidth={0.8} opacity={0.4}
            />
            <text
              x={MUR_CX + MUR_W / 2 + 28} y={CY - 100}
              fontFamily="monospace" fontSize={13} fill={ENCRE}
              opacity={0.5}
            >
              ~100m
            </text>
          </g>

          {/* Label mur */}
          <text
            x={MUR_CX} y={MUR_TOP - 20}
            fontFamily="Georgia, serif" fontSize={20} fill={GRIS}
            textAnchor="middle"
            opacity={murColorP * 0.8}
            fontStyle="italic"
          >
            le béton coule
          </text>
        </g>

        {/* ══════════════ EAU DERRIÈRE LE MUR ══════════════ */}
        <g opacity={eauOp}>
          {/* Zone eau — grande, héros, bleu narratif */}
          <rect
            x={MUR_CX - MUR_W / 2 - W * 0.26}
            y={MUR_BOT - eauH_now}
            width={W * 0.26}
            height={eauH_now}
            fill={BLEU}
            opacity={0.18}
          />
          {/* Surface de l'eau — ligne vive */}
          <line
            x1={MUR_CX - MUR_W / 2 - W * 0.26}
            y1={MUR_BOT - eauH_now}
            x2={MUR_CX - MUR_W / 2}
            y2={MUR_BOT - eauH_now}
            stroke={BLEU}
            strokeWidth={3.5}
            opacity={0.75}
          />
          {/* Ondulation de surface */}
          {eauP > 0.3 && (
            <path
              d={`M ${MUR_CX - MUR_W/2 - W*0.26} ${MUR_BOT - eauH_now + 6}
                  C ${MUR_CX - MUR_W/2 - W*0.18} ${MUR_BOT - eauH_now - 4},
                    ${MUR_CX - MUR_W/2 - W*0.10} ${MUR_BOT - eauH_now + 8},
                    ${MUR_CX - MUR_W/2}           ${MUR_BOT - eauH_now + 2}`}
              fill="none" stroke={BLEU_P} strokeWidth={2} opacity={0.5}
            />
          )}
          {/* Flèche pression */}
          {eauP > 0.6 && (
            <g opacity={prog(f, 290, 340)}>
              <path
                d={`M ${MUR_CX - 20} ${MUR_BOT - eauH_now * 0.5}
                    L ${MUR_CX - 20} ${MUR_BOT - 20}`}
                fill="none" stroke={BLEU} strokeWidth={2}
                strokeDasharray="6 4" opacity={0.6}
              />
              <text
                x={MUR_CX - 50} y={MUR_BOT - eauH_now * 0.5 - 8}
                fontFamily="Georgia, serif" fontSize={16} fill={BLEU}
                textAnchor="middle" opacity={0.65} fontStyle="italic"
              >
                pression
              </text>
            </g>
          )}
        </g>

        {/* ══════════════ TURBINE ══════════════ */}
        <g
          opacity={turbOp}
          transform={`translate(${TURB_X}, ${TURB_Y}) scale(${Math.min(1, turbScale)})`}
        >
          {/* Cercle principal (contour → fill or) */}
          <circle cx={0} cy={0} r={turbR_now}
            fill={turbFill}
            stroke={turbStroke}
            strokeWidth={turbColorP > 0.3 ? 2.5 : 3}
            opacity={0.9}
          />

          {/* Pales (8) qui tournent */}
          <g transform={`rotate(${turbSpin})`}>
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const r_inner = turbR_now * 0.18;
              const r_outer = turbR_now * 0.82;
              return (
                <line key={i}
                  x1={Math.cos(angle) * r_inner} y1={Math.sin(angle) * r_inner}
                  x2={Math.cos(angle) * r_outer} y2={Math.sin(angle) * r_outer}
                  stroke={turbColorP > 0.5 ? OR : ENCRE}
                  strokeWidth={turbColorP > 0.5 ? 5 : 4}
                  strokeLinecap="round"
                  opacity={0.85}
                />
              );
            })}
          </g>

          {/* Axe central */}
          <circle cx={0} cy={0} r={turbR_now * 0.12}
            fill={turbColorP > 0.5 ? OR_GLOW : ENCRE}
            opacity={0.95}
          />

          {/* Glow (mécanisme B — s'illumine avec la turbine) */}
          {turbColorP > 0.3 && (
            <>
              <circle cx={0} cy={0} r={turbR_now + 16}
                fill="none" stroke={OR}
                strokeWidth={1.5}
                opacity={turbColorP * (0.15 + 0.08 * Math.sin(f * 0.12))}
              />
              <circle cx={0} cy={0} r={turbR_now + 36}
                fill="none" stroke={OR_GLOW}
                strokeWidth={0.8}
                opacity={turbColorP * 0.08}
              />
            </>
          )}

          {/* Label */}
          <text x={0} y={turbR_now + 36}
            fontFamily="Georgia, serif" fontSize={18} fill={turbColorP > 0.5 ? OR : ENCRE}
            textAnchor="middle" opacity={turbTraceP * 0.7} fontStyle="italic"
          >
            la turbine s&apos;éveille
          </text>
        </g>

        {/* ══════════════ FIL CONDUCTEUR ══════════════ */}
        <g opacity={filOp}>
          {/* Le trait qui se trace (stroke-dashoffset) */}
          <line
            x1={FIL_X1} y1={FIL_Y}
            x2={FIL_X2} y2={FIL_Y}
            stroke={filStroke}
            strokeWidth={filWidth}
            strokeDasharray={`${FIL_LEN} ${FIL_LEN}`}
            strokeDashoffset={filDash}
            strokeLinecap="round"
            opacity={0.88}
          />
          {/* Particules (une fois le fil colorisé en bleu) */}
          {filColorP > 0.1 && Array.from({ length: 7 }, (_, i) => {
            const phase = ((f - 620 + i * 80) % 280) / 280;
            const px    = FIL_X1 + phase * FIL_LEN;
            const pOp   = phase < 0.1 ? phase / 0.1 : phase > 0.9 ? (1 - phase) / 0.1 : 1;
            return (
              <circle key={i} cx={px} cy={FIL_Y} r={5}
                fill={BLEU} opacity={pOp * filColorP * 0.8}
              />
            );
          })}

          {/* Label */}
          <text x={CX} y={FIL_Y - 18}
            fontFamily="Georgia, serif" fontSize={17} fill={filColorP > 0.5 ? BLEU : ENCRE}
            textAnchor="middle" opacity={prog(f, 560, 620) * 0.6} fontStyle="italic"
          >
            l&apos;électricité prend la route
          </text>
        </g>

        {/* ══════════════ LUMIÈRES DES VILLES ══════════════ */}
        <g opacity={villeOp}>
          {VILLES.map((v, i) => {
            const lightOn  = prog(f, 700 + i * 22, 730 + i * 22);
            // mécanisme C : ruraux s'éteignent (or → gris_mort)
            const lightOff = v.rural ? prog(f, 800 + i * 15, 840 + i * 15) : 0;
            const color    = lightOff > 0.5 ? GRIS_MORT : OR;
            const r        = v.rural ? 6 : 9;
            const glow     = lightOff > 0.5 ? 0 : lightOn * (0.2 + 0.08 * Math.sin(f * 0.11 + i));

            // Connexion au fil
            const onFil = { x: v.x, y: FIL_Y };

            return (
              <g key={i} opacity={lightOn}>
                {/* Ligne de connexion au fil */}
                <line
                  x1={v.x} y1={FIL_Y}
                  x2={v.x} y2={v.y}
                  stroke={lightOff > 0.5 ? GRIS_MORT : BLEU}
                  strokeWidth={1.2}
                  strokeDasharray="5 4"
                  opacity={0.4}
                />
                {/* Point lumineux */}
                <circle cx={v.x} cy={v.y} r={r}
                  fill={color} opacity={0.9}
                />
                {/* Glow */}
                {glow > 0 && (
                  <circle cx={v.x} cy={v.y} r={r + 10}
                    fill="none" stroke={OR_GLOW}
                    strokeWidth={1} opacity={glow}
                  />
                )}
                {/* Label */}
                <text
                  x={v.x + (v.x > CX ? 14 : -14)} y={v.y + 4}
                  fontFamily="monospace" fontSize={10} fill={color}
                  textAnchor={v.x > CX ? "start" : "end"}
                  opacity={lightOn * (lightOff > 0.5 ? 0.4 : 0.55)}
                >
                  {v.nom}
                </text>
                {/* Croix d'extinction (mécanisme C) */}
                {lightOff > 0.3 && (
                  <g opacity={lightOff}>
                    <line x1={v.x - 7} y1={v.y - 7} x2={v.x + 7} y2={v.y + 7}
                      stroke={ENCRE} strokeWidth={1.5} opacity={0.6} />
                    <line x1={v.x + 7} y1={v.y - 7} x2={v.x - 7} y2={v.y + 7}
                      stroke={ENCRE} strokeWidth={1.5} opacity={0.6} />
                  </g>
                )}
              </g>
            );
          })}

          {/* Label section */}
          <text x={W * 0.72} y={H * 0.92}
            fontFamily="Georgia, serif" fontSize={16} fill={GRIS_MORT}
            textAnchor="middle" opacity={prog(f, 840, 890) * 0.7} fontStyle="italic"
          >
            mais qui reçoit l&apos;électricité ?
          </text>
        </g>

        {/* ══════════════ PARADOXE FINAL ══════════════ */}
        <g>
          {/* Chiffre potentiel — grand, or */}
          <text
            x={W * 0.28} y={H * 0.38}
            fontFamily="Georgia, serif" fontSize={88} fill={OR}
            textAnchor="middle" fontWeight="bold"
            opacity={paraP * 0.95}
          >
            42 000 MW
          </text>
          <text
            x={W * 0.28} y={H * 0.46}
            fontFamily="Georgia, serif" fontSize={18} fill={ENCRE}
            textAnchor="middle" opacity={paraP * 0.55} fontStyle="italic"
          >
            potentiel du fleuve Congo
          </text>

          {/* Séparateur — la tension */}
          <line
            x1={W * 0.12} y1={H * 0.52}
            x2={W * 0.44} y2={H * 0.52}
            stroke={ENCRE} strokeWidth={1}
            opacity={para2P * 0.35}
          />
          <text
            x={W * 0.28} y={H * 0.495}
            fontFamily="Georgia, serif" fontSize={13} fill={ENCRE}
            textAnchor="middle" opacity={para2P * 0.4} fontStyle="italic"
          >
            et pourtant
          </text>

          {/* Chiffre réalité — encre, douloureux */}
          <text
            x={W * 0.28} y={H * 0.62}
            fontFamily="Georgia, serif" fontSize={72} fill={ENCRE}
            textAnchor="middle" fontWeight="bold"
            opacity={para2P * 0.82}
          >
            78%
          </text>
          <text
            x={W * 0.28} y={H * 0.70}
            fontFamily="Georgia, serif" fontSize={17} fill={ENCRE}
            textAnchor="middle" opacity={para2P * 0.5} fontStyle="italic"
          >
            des Congolais sans électricité
          </text>

          {/* Question finale */}
          <text
            x={W * 0.28} y={H * 0.84}
            fontFamily="Georgia, serif" fontSize={20} fill={GRIS_MORT}
            textAnchor="middle" opacity={para3P * 0.75} fontStyle="italic"
          >
            101 millions de personnes dans le noir
          </text>
        </g>

      </svg>
    </AbsoluteFill>
  );
};

export const INGA_ENCRE_H_FRAMES = 1200;
