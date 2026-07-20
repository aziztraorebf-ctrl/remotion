/**
 * IngaH16x9 — R&D Grand Inga (2026-06-28). Test physicalité du sujet SVG.
 * Format HORIZONTAL 16:9 — grammaire SCÈNE-LIEU à activation séquentielle.
 *
 * Registre : blueprint (fond #0d1b3a, traits cyan #7fd4ff, accent or #c8a951)
 * Fil conducteur : un trait bleu-acier qui part du fleuve → mur → turbine → pylônes → lumière
 *
 * Chronologie (~45s, 1350 frames @30fps) :
 *   f0-30    : fleuve Congo appear (trait horizontal ondulant, bleu)
 *   f30-90   : mur de béton SE CONSTRUIT (blocs empilés, stroke-dashoffset)
 *   f90-150  : eau monte derrière le mur (fill bleu qui monte de bas en haut)
 *   f150-210 : turbine APPARAÎT + rotation lente commence (or)
 *   f210-270 : fil conducteur SE TRACE depuis turbine → droite (cyan, stroke-dashoffset)
 *   f270-360 : pylônes s'érigent un par un (3 pylônes, tracés séquentiels)
 *   f360-450 : lumière AU BOUT — points lumineux pop en cascade sur les pylônes
 *   f450-520 : RÉVÉLATION : tout s'illumine en bleu-acier, le chiffre "40 000 MW" monte
 *   f520-600 : respiration finale (le fil pulse doucement)
 *
 * Règles appliquées :
 * - Objet inerte = jamais glisse, change de couleur ou fade
 * - Fil conducteur = ossature gauche→droite, impose la séquence causale
 * - Spotlight : un objet à la fois en pleine opacité, les autres en encre pâle
 * - Zéro viewBox mobile, zéro CSS transition, zéro setTimeout
 * - Animation = fonction de `frame` uniquement
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const W = 1920;
const H = 1080;

const CYAN = "#7fd4ff";
const OR = "#c8a951";
const FOND = "#0d1b3a";
const BLANC = "#eaf6ff";
const CYAN_PALE = "rgba(127,212,255,0.18)";
const OR_PALE = "rgba(200,169,81,0.22)";

const prog = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Longueur approximative d'un path pour stroke-dashoffset
function dashProg(f: number, start: number, end: number, length: number) {
  const p = prog(f, start, end);
  return length * (1 - p);
}

export const IngaH16x9: React.FC = () => {
  const f = useCurrentFrame();

  // --- FLEUVE ---
  const fleuveOpacity = prog(f, 0, 25);
  const fleuveY = H * 0.78;

  // --- MUR DE BÉTON ---
  // 6 rangées de blocs, chacune apparaît séquentiellement
  const murX = W * 0.32;
  const murW = W * 0.06;
  const murBaseY = fleuveY;
  const ROWS = 6;
  const rowH = 38;
  const murOpacity = prog(f, 30, 45);

  // --- EAU DERRIÈRE LE MUR ---
  const eauMaxH = ROWS * rowH + 20;
  const eauH = prog(f, 90, 180) * eauMaxH;
  const eauOpacity = prog(f, 95, 150);

  // --- TURBINE ---
  const turbineX = W * 0.44;
  const turbineY = fleuveY - 60;
  const turbineR = 38;
  const turbineOpacity = prog(f, 150, 190);
  const turbineRotation = f > 170 ? ((f - 170) * 1.8) % 360 : 0;
  const turbineScale = prog(f, 150, 185, 0.3, 1);

  // --- FIL CONDUCTEUR (cyan) ---
  // Path : turbine → pylon1 → pylon2 → pylon3
  const filStartX = turbineX + turbineR + 8;
  const filY = fleuveY - 80;
  const pylon1X = W * 0.54;
  const pylon2X = W * 0.65;
  const pylon3X = W * 0.76;
  const filEndX = pylon3X + 20;
  const filLength = filEndX - filStartX;
  const filDash = dashProg(f, 210, 290, filLength);
  const filOpacity = prog(f, 210, 240);

  // --- PYLÔNES (3) ---
  const pylonH = 110;
  const pylons = [pylon1X, pylon2X, pylon3X];
  // Chaque pylône se trace après un décalage
  const pylonStarts = [270, 300, 330];
  const pylonEnds = [310, 340, 370];
  const pylonLen = pylonH * 2.4; // approximation longueur path pylône

  // --- LUMIÈRE AU BOUT ---
  const lightPops = [360, 385, 410];

  // --- RÉVÉLATION FINALE ---
  const revealP = prog(f, 450, 510);
  const chiffreOpacity = prog(f, 470, 530);

  // --- PULSE FIL (respiration finale) ---
  const filPulse = f > 520
    ? 0.6 + 0.4 * Math.sin((f - 520) * 0.08)
    : 1;

  // spotlight : le « focus » du moment (0=fleuve, 1=mur, 2=eau, 3=turbine, 4=fil, 5=pylônes, 6=lumière)
  const focus =
    f < 30 ? 0
    : f < 90 ? 1
    : f < 150 ? 2
    : f < 210 ? 3
    : f < 270 ? 4
    : f < 450 ? 5
    : 6;

  const dim = (target: number, current: number) =>
    current === target ? 1 : current > target ? 0.35 : 0.0;

  return (
    <AbsoluteFill style={{ background: FOND, overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* ======= GRILLE TECHNIQUE (permanente, très discrète) ======= */}
        <g opacity={0.06}>
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`v${i}`} x1={i * (W / 20)} y1={0} x2={i * (W / 20)} y2={H} stroke={CYAN} strokeWidth={0.5} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * (H / 12)} x2={W} y2={i * (H / 12)} stroke={CYAN} strokeWidth={0.5} />
          ))}
        </g>

        {/* ======= CARTOUCHE TITRE (en bas à gauche) ======= */}
        <g opacity={prog(f, 5, 30)}>
          <rect x={40} y={H - 80} width={320} height={50} fill="none" stroke={OR} strokeWidth={1} opacity={0.4} />
          <text x={56} y={H - 49} fontFamily="monospace" fontSize={11} fill={OR} opacity={0.7} letterSpacing={2}>
            GRAND INGA — RDC
          </text>
          <text x={56} y={H - 33} fontFamily="monospace" fontSize={9} fill={CYAN} opacity={0.5} letterSpacing={1.5}>
            TEST PHYSICALITÉ SVG BLUEPRINT
          </text>
        </g>

        {/* ======= LÉGENDE GAUCHE ======= */}
        <g opacity={prog(f, 10, 40)}>
          <text x={40} y={100} fontFamily="monospace" fontSize={10} fill={BLANC} opacity={0.3} letterSpacing={1}>
            FLEUVE CONGO — 41 200 m³/s
          </text>
        </g>

        {/* ======= FLEUVE CONGO (ondulation) ======= */}
        <g opacity={fleuveOpacity * dim(0, focus)}>
          {/* Fleuve principal — trait épais ondulant */}
          <path
            d={`M ${W * 0.05} ${fleuveY}
                C ${W * 0.12} ${fleuveY - 12},
                  ${W * 0.18} ${fleuveY + 10},
                  ${W * 0.26} ${fleuveY - 6}
                L ${W * 0.92} ${fleuveY - 4}`}
            fill="none"
            stroke={CYAN}
            strokeWidth={6}
            opacity={0.85}
          />
          {/* Deuxième filet — courant secondaire */}
          <path
            d={`M ${W * 0.05} ${fleuveY + 14}
                C ${W * 0.12} ${fleuveY + 4},
                  ${W * 0.20} ${fleuveY + 18},
                  ${W * 0.26} ${fleuveY + 10}
                L ${W * 0.92} ${fleuveY + 10}`}
            fill="none"
            stroke={CYAN}
            strokeWidth={2.5}
            opacity={0.4}
          />
          {/* Cotes techniques */}
          <line x1={W * 0.08} y1={fleuveY - 30} x2={W * 0.08} y2={fleuveY} stroke={OR} strokeWidth={0.8} opacity={0.5} />
          <text x={W * 0.09} y={fleuveY - 18} fontFamily="monospace" fontSize={9} fill={OR} opacity={0.6}>41 200 m³/s</text>
          {/* Flèche direction */}
          <path d={`M ${W * 0.82} ${fleuveY - 22} L ${W * 0.87} ${fleuveY - 14} L ${W * 0.82} ${fleuveY - 6}`}
            fill="none" stroke={CYAN} strokeWidth={1.5} opacity={0.5} />
        </g>

        {/* ======= MUR DE BÉTON (SE CONSTRUIT — blocs séquentiels) ======= */}
        <g opacity={murOpacity}>
          {Array.from({ length: ROWS }, (_, row) => {
            const rowStart = 30 + row * 10;
            const rowEnd = rowStart + 20;
            const rowP = prog(f, rowStart, rowEnd);
            const yTop = murBaseY - (row + 1) * rowH;

            // Chaque rangée = 3 blocs
            return (
              <g key={`row${row}`} opacity={rowP * dim(1, focus)}>
                {[0, 1, 2].map((col) => {
                  const bx = murX + col * (murW / 3) - murW / 2;
                  const bw = murW / 3 - 2;
                  return (
                    <rect
                      key={col}
                      x={bx}
                      y={yTop}
                      width={bw}
                      height={rowH - 3}
                      fill="none"
                      stroke={BLANC}
                      strokeWidth={1.2}
                      opacity={0.7}
                    />
                  );
                })}
                {/* Hachures intérieures (béton armé) */}
                <line
                  x1={murX - murW / 2} y1={yTop + rowH / 2}
                  x2={murX + murW / 2} y2={yTop + rowH / 2}
                  stroke={BLANC} strokeWidth={0.5} strokeDasharray="4 3" opacity={0.3}
                />
              </g>
            );
          })}

          {/* Cote hauteur du mur */}
          <g opacity={prog(f, 85, 110) * dim(1, focus)}>
            <line x1={murX + murW / 2 + 12} y1={murBaseY - ROWS * rowH} x2={murX + murW / 2 + 12} y2={murBaseY}
              stroke={OR} strokeWidth={0.8} opacity={0.5} />
            <text x={murX + murW / 2 + 18} y={murBaseY - ROWS * rowH / 2}
              fontFamily="monospace" fontSize={9} fill={OR} opacity={0.6}>
              ~100m
            </text>
          </g>
        </g>

        {/* ======= EAU DERRIÈRE LE MUR (fill qui monte) ======= */}
        <g opacity={eauOpacity * dim(2, focus)}>
          <rect
            x={murX - murW / 2 - W * 0.18}
            y={murBaseY - eauH}
            width={W * 0.18}
            height={eauH}
            fill={CYAN}
            opacity={0.22}
          />
          {/* Ligne de surface de l'eau */}
          <line
            x1={murX - murW / 2 - W * 0.18}
            y1={murBaseY - eauH}
            x2={murX - murW / 2}
            y2={murBaseY - eauH}
            stroke={CYAN}
            strokeWidth={2}
            opacity={0.7}
          />
          {/* Label retenue */}
          <text
            x={murX - murW / 2 - W * 0.10}
            y={murBaseY - eauH - 10}
            fontFamily="monospace"
            fontSize={9}
            fill={CYAN}
            opacity={prog(f, 150, 180)}
            textAnchor="middle"
          >
            RETENUE
          </text>
          {/* Flèche pression vers le bas */}
          {f > 140 && (
            <path
              d={`M ${murX - 20} ${murBaseY - eauH + 20} L ${murX - 20} ${murBaseY - 25}`}
              fill="none"
              stroke={CYAN}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={prog(f, 140, 170) * 0.6}
            />
          )}
        </g>

        {/* ======= TURBINE ======= */}
        <g
          opacity={turbineOpacity * dim(3, focus)}
          transform={`translate(${turbineX}, ${turbineY}) scale(${turbineScale})`}
        >
          {/* Corps turbine */}
          <circle cx={0} cy={0} r={turbineR} fill="none" stroke={OR} strokeWidth={2} opacity={0.9} />
          {/* Pales (6) qui tournent */}
          <g transform={`rotate(${turbineRotation})`}>
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * 60 * Math.PI) / 180;
              const x2 = Math.cos(angle) * (turbineR - 8);
              const y2 = Math.sin(angle) * (turbineR - 8);
              return (
                <line key={i} x1={0} y1={0} x2={x2} y2={y2}
                  stroke={OR} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
              );
            })}
          </g>
          {/* Centre turbine */}
          <circle cx={0} cy={0} r={7} fill={OR} opacity={0.9} />
          {/* Glow */}
          <circle cx={0} cy={0} r={turbineR + 6}
            fill="none" stroke={OR} strokeWidth={1}
            opacity={0.15 + 0.1 * Math.sin(f * 0.12)}
          />
          {/* Label */}
          <text x={0} y={turbineR + 22} fontFamily="monospace" fontSize={9}
            fill={OR} opacity={0.7} textAnchor="middle">
            TURBINE
          </text>
        </g>

        {/* ======= FIL CONDUCTEUR (ossature causale) ======= */}
        <g opacity={filOpacity * filPulse}>
          <line
            x1={filStartX}
            y1={filY}
            x2={filEndX}
            y2={filY}
            stroke={CYAN}
            strokeWidth={2.5}
            strokeDasharray={`${filLength} ${filLength}`}
            strokeDashoffset={filDash}
            opacity={0.9}
          />
          {/* Particules qui coulent le long du fil */}
          {f > 240 && Array.from({ length: 5 }, (_, i) => {
            const phase = ((f - 240 + i * 60) % 200) / 200;
            const px = filStartX + phase * filLength;
            const particleOpacity = phase < 0.1 ? phase / 0.1 : phase > 0.9 ? (1 - phase) / 0.1 : 1;
            return (
              <circle key={i} cx={px} cy={filY} r={3}
                fill={CYAN} opacity={particleOpacity * 0.8} />
            );
          })}
        </g>

        {/* ======= PYLÔNES (3 — se tracent séquentiellement) ======= */}
        {pylons.map((px, i) => {
          const startF = pylonStarts[i];
          const endF = pylonEnds[i];
          const pP = prog(f, startF, endF);
          const pOpacity = pP * dim(5, focus);
          const pyBaseY = fleuveY;
          const pyTopY = pyBaseY - pylonH;
          const pyArmY = pyBaseY - pylonH * 0.6;

          // stroke-dashoffset pour chaque path du pylône
          const legLen = pylonH * 1.15;
          const armLen = 55;

          return (
            <g key={i} opacity={pOpacity}>
              {/* Jambe gauche */}
              <line
                x1={px - 18} y1={pyBaseY}
                x2={px} y2={pyTopY}
                stroke={BLANC} strokeWidth={1.8}
                strokeDasharray={`${legLen} ${legLen}`}
                strokeDashoffset={dashProg(f, startF, endF, legLen)}
                opacity={0.8}
              />
              {/* Jambe droite */}
              <line
                x1={px + 18} y1={pyBaseY}
                x2={px} y2={pyTopY}
                stroke={BLANC} strokeWidth={1.8}
                strokeDasharray={`${legLen} ${legLen}`}
                strokeDashoffset={dashProg(f, startF + 5, endF + 5, legLen)}
                opacity={0.8}
              />
              {/* Bras horizontal */}
              <line
                x1={px - 28} y1={pyArmY}
                x2={px + 28} y2={pyArmY}
                stroke={BLANC} strokeWidth={1.5}
                strokeDasharray={`${armLen} ${armLen}`}
                strokeDashoffset={dashProg(f, startF + 8, endF + 10, armLen)}
                opacity={0.7}
              />
              {/* Isolateurs (petits cercles) */}
              {f > endF && (
                <>
                  <circle cx={px - 28} cy={pyArmY} r={3} fill="none" stroke={BLANC} strokeWidth={1} opacity={0.6} />
                  <circle cx={px + 28} cy={pyArmY} r={3} fill="none" stroke={BLANC} strokeWidth={1} opacity={0.6} />
                </>
              )}
              {/* Connexion au fil conducteur */}
              {f > endF && (
                <line
                  x1={px} y1={filY}
                  x2={px} y2={pyArmY}
                  stroke={CYAN}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={0.4}
                />
              )}
            </g>
          );
        })}

        {/* ======= LUMIÈRE AU BOUT (pop en cascade) ======= */}
        {pylons.map((px, i) => {
          const lightF = lightPops[i];
          const lightP = prog(f, lightF, lightF + 20);
          const glowR = 8 + lightP * 12;
          const pyBaseY = fleuveY;
          const pyTopY = pyBaseY - pylonH;

          return f > lightF - 5 ? (
            <g key={i} opacity={lightP}>
              <circle cx={px} cy={pyTopY} r={5} fill={OR} opacity={0.95} />
              <circle cx={px} cy={pyTopY} r={glowR}
                fill="none" stroke={OR} strokeWidth={1}
                opacity={0.3 + 0.2 * Math.sin(f * 0.15)} />
            </g>
          ) : null;
        })}

        {/* ======= RÉVÉLATION FINALE — le chiffre clé ======= */}
        <g opacity={chiffreOpacity}>
          {/* Fond du panneau */}
          <rect
            x={W * 0.62}
            y={H * 0.12}
            width={320}
            height={110}
            fill={FOND}
            stroke={OR}
            strokeWidth={1.5}
            opacity={0.92}
          />
          <rect
            x={W * 0.62 + 6}
            y={H * 0.12 + 6}
            width={308}
            height={98}
            fill="none"
            stroke={OR}
            strokeWidth={0.5}
            opacity={0.3}
          />
          <text
            x={W * 0.62 + 160}
            y={H * 0.12 + 44}
            fontFamily="monospace"
            fontSize={32}
            fontWeight="bold"
            fill={OR}
            textAnchor="middle"
            opacity={0.95}
          >
            40 000 MW
          </text>
          <text
            x={W * 0.62 + 160}
            y={H * 0.12 + 68}
            fontFamily="monospace"
            fontSize={10}
            fill={CYAN}
            textAnchor="middle"
            opacity={0.75}
            letterSpacing={2}
          >
            POTENTIEL HYDROÉLECTRIQUE TOTAL
          </text>
          <text
            x={W * 0.62 + 160}
            y={H * 0.12 + 90}
            fontFamily="monospace"
            fontSize={9}
            fill={BLANC}
            textAnchor="middle"
            opacity={0.4}
            letterSpacing={1}
          >
            plus que toute la production US
          </text>
        </g>

        {/* ======= SPOTLIGHT INDICATOR (barre de progression discrète) ======= */}
        <g opacity={0.3}>
          {["FLEUVE", "MUR", "RETENUE", "TURBINE", "FIL", "PYLÔNES", "LUMIÈRE"].map((label, i) => {
            const isActive = focus >= i;
            const isCurrent = focus === i;
            return (
              <g key={i} transform={`translate(${W - 180}, ${H - 140 + i * 18})`}>
                <circle cx={0} cy={0} r={3}
                  fill={isCurrent ? OR : isActive ? CYAN : "none"}
                  stroke={isActive ? CYAN : BLANC}
                  strokeWidth={1}
                  opacity={isCurrent ? 1 : isActive ? 0.7 : 0.3}
                />
                <text x={10} y={4} fontFamily="monospace" fontSize={8}
                  fill={isCurrent ? OR : isActive ? CYAN : BLANC}
                  opacity={isCurrent ? 1 : isActive ? 0.6 : 0.25}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

      </svg>
    </AbsoluteFill>
  );
};

export const INGA_H_FRAMES = 600;
