/**
 * ProtoSolFullbodyRigTest — test decisif du personnage COMPLET "rig-first" genere par openai/gpt-5.6-sol
 * (memory/tools/openrouter-svg.md, session 2026-07-10). Le SVG brut declare une hierarchie IMBRIQUEE
 * torso > leg-upper > leg-lower > foot (et bras, meme schema), avec translate(joint) rotate(angle) a
 * chaque niveau — exactement le pattern qui avait fait ECHOUER GPT-5.5 (paths absolus, decrochage au
 * coude des ~20-25deg). Ce proto applique des rotations REELLES et amples pour verifier si la geometrie
 * reste connectee sous rotation, comme le fait le rig FK Gemini deja en production.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export const PROTO_SOL_FULLBODY_RIG_TEST_FRAMES = 180;

function deg(frame: number, from: number, fromDeg: number, to: number, toDeg: number) {
  return interpolate(frame, [from, to], [fromDeg, toDeg], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
}

export const ProtoSolFullbodyRigTest: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Sequence de test : 0-40 repos -> 40-80 bras avant leve (epaule+coude) -> 80-120 jambe avant levee
  // (hanche+genou) -> 120-160 les 2 en meme temps, amplitude max -> 160-180 retour repos
  const armShoulder = frame < 40 ? 0
    : frame < 80 ? deg(frame, 40, 0, 80, -55)
    : frame < 120 ? deg(frame, 80, -55, 120, -20)
    : frame < 160 ? deg(frame, 120, -20, 160, -70)
    : deg(frame, 160, -70, 180, 0);

  const armElbow = frame < 40 ? 0
    : frame < 80 ? deg(frame, 40, 0, 80, 35)
    : frame < 120 ? deg(frame, 80, 35, 120, 10)
    : frame < 160 ? deg(frame, 120, 10, 160, 45)
    : deg(frame, 160, 45, 180, 0);

  const legHip = frame < 80 ? 0
    : frame < 120 ? deg(frame, 80, 0, 120, -40)
    : frame < 160 ? deg(frame, 120, -40, 160, -60)
    : deg(frame, 160, -60, 180, 0);

  const legKnee = frame < 80 ? 0
    : frame < 120 ? deg(frame, 80, 0, 120, 50)
    : frame < 160 ? deg(frame, 120, 50, 160, 65)
    : deg(frame, 160, 65, 180, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: "#e9d9b0" }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#2b2117", marginBottom: 8 }}>
          Test rotations reelles — personnage complet rig-first GPT-5.6 Sol (epaule/coude + hanche/genou)
        </div>
        <svg width={360} height={630} viewBox="0 0 400 700">
          <defs>
            <linearGradient id="shirtShade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d9a54e" />
              <stop offset="1" stopColor="#b87531" />
            </linearGradient>
            <linearGradient id="skinShade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#9a5937" />
              <stop offset="1" stopColor="#6f3928" />
            </linearGradient>
            <linearGradient id="trouserShade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#25343b" />
              <stop offset="1" stopColor="#172329" />
            </linearGradient>
          </defs>

          <path d="M34 620 C105 617 157 622 222 619 C277 617 329 621 370 619" fill="none" stroke="#27343a" strokeWidth={3} strokeLinecap="round" />

          <g id="torso" transform="translate(190 390) rotate(0)">
            {/* back leg/arm : statiques (pas le sujet du test) */}
            <g id="leg-upper-back" transform="translate(-12 10) rotate(0)">
              <path d="M-14 -4 C-5 -10 10 -8 16 1 C18 30 14 68 2 108 C-6 114 -18 110 -22 102 C-20 64 -19 25 -14 -4 Z" fill="#1d2a30" stroke="#172126" strokeWidth={3} strokeLinejoin="round" />
              <g id="leg-lower-back" transform="translate(-2 105) rotate(0)">
                <path d="M-14 -5 C-5 -10 9 -7 13 2 C13 33 10 72 1 104 C-5 110 -16 108 -20 100 C-20 65 -20 29 -14 -5 Z" fill="url(#trouserShade)" stroke="#172126" strokeWidth={3} strokeLinejoin="round" />
                <g id="foot-back" transform="translate(-2 103) rotate(0)">
                  <path d="M-11 -5 C-4 -9 7 -7 10 -1 L10 3 C19 5 29 7 34 11 C35 14 32 17 27 18 L-4 18 C-11 17 -15 13 -14 8 Z" fill="#75442f" stroke="#44281e" strokeWidth={3} strokeLinejoin="round" />
                </g>
              </g>
            </g>

            <g id="arm-upper-back" transform="translate(-8 -112) rotate(0)">
              <path d="M-9 -5 C0 -10 13 -5 16 5 C15 30 10 57 1 82 C-5 90 -17 87 -21 78 C-20 53 -17 21 -9 -5 Z" fill="#9a623b" stroke="#43291f" strokeWidth={3} strokeLinejoin="round" />
              <g id="arm-lower-back" transform="translate(-3 80) rotate(0)">
                <path d="M-14 -4 C-5 -9 7 -6 11 1 C15 25 16 54 12 78 C8 87 -5 89 -12 82 C-17 57 -19 23 -14 -4 Z" fill="#815036" stroke="#43291f" strokeWidth={3} strokeLinejoin="round" />
                <g id="hand-back" transform="translate(0 79) rotate(0)">
                  <path d="M-11 -5 C-4 -10 7 -8 11 -1 C12 8 9 22 4 31 C0 38 -8 35 -9 29 L-13 14 C-16 7 -16 0 -11 -5 Z" fill="#815036" stroke="#43291f" strokeWidth={3} strokeLinejoin="round" />
                </g>
              </g>
            </g>

            <path d="M-29 -141 C-17 -153 8 -158 25 -145 C37 -126 43 -93 42 -57 L39 -4 C26 11 3 18 -22 8 C-31 -32 -38 -91 -29 -141 Z" fill="url(#shirtShade)" stroke="#503521" strokeWidth={3.5} strokeLinejoin="round" />
            <path d="M-23 -2 C-7 7 22 8 39 -4 L39 12 C22 23 -7 22 -24 10 Z" fill="#704728" stroke="#4d311f" strokeWidth={2.5} />

            {/* FRONT LEG : hanche + genou anime, LE VRAI TEST */}
            <g id="leg-upper-front" transform={`translate(14 12) rotate(${legHip})`}>
              <path d="M-15 -6 C-4 -12 12 -8 18 1 C21 34 20 73 14 108 C8 116 -7 115 -14 107 C-20 68 -21 27 -15 -6 Z" fill="#26363d" stroke="#172126" strokeWidth={3.2} strokeLinejoin="round" />
              <g id="leg-lower-front" transform={`translate(14 108) rotate(${legKnee})`}>
                <path d="M-14 -5 C-4 -10 9 -7 13 1 C14 28 11 66 3 99 C-2 107 -15 107 -20 99 C-20 66 -20 27 -14 -5 Z" fill="url(#trouserShade)" stroke="#172126" strokeWidth={3.2} strokeLinejoin="round" />
                <g id="foot-front" transform="translate(3 98) rotate(0)">
                  <path d="M-12 -5 C-4 -10 8 -7 11 0 L11 4 C23 5 36 8 42 12 C44 15 40 19 34 20 L-4 20 C-12 19 -16 15 -15 9 Z" fill="url(#skinShade)" stroke="#43291f" strokeWidth={3} strokeLinejoin="round" />
                  <path d="M-11 20 L35 20" fill="none" stroke="#172126" strokeWidth={3} strokeLinecap="round" />
                </g>
              </g>
            </g>

            {/* FRONT ARM : epaule + coude anime, LE VRAI TEST */}
            <g id="arm-upper-front" transform={`translate(25 -112) rotate(${armShoulder})`}>
              <path d="M-10 -6 C0 -11 13 -6 17 3 C21 28 22 55 20 79 C16 88 3 91 -5 84 C-13 59 -17 23 -10 -6 Z" fill="#a7653e" stroke="#43291f" strokeWidth={3} strokeLinejoin="round" />
              <g id="arm-lower-front" transform={`translate(17 79) rotate(${armElbow})`}>
                <path d="M-13 -5 C-4 -10 9 -7 13 1 C18 25 21 53 21 78 C18 88 5 92 -3 85 C-12 61 -17 25 -13 -5 Z" fill="url(#skinShade)" stroke="#43291f" strokeWidth={3} strokeLinejoin="round" />
                <g id="hand-front" transform="translate(18 79) rotate(0)">
                  <path d="M-12 -5 C-4 -11 8 -8 12 -1 C14 8 12 22 8 33 C5 40 -4 40 -7 34 L-11 23 L-15 14 C-18 7 -17 0 -12 -5 Z" fill="#925738" stroke="#43291f" strokeWidth={3} strokeLinejoin="round" />
                </g>
              </g>
            </g>

            <g id="head" transform="translate(12 -158) rotate(0)">
              <path d="M-11 2 C-12 11 -10 20 -5 28 L18 24 C15 15 15 7 18 -2 Z" fill="#875034" stroke="#43291f" strokeWidth={3} />
              <path d="M-17 -66 C-5 -78 15 -76 27 -65 C34 -57 33 -47 36 -40 L45 -32 L36 -26 C36 -15 31 -4 21 4 C10 13 -7 9 -15 0 C-23 -10 -26 -30 -24 -46 C-23 -54 -21 -61 -17 -66 Z" fill="url(#skinShade)" stroke="#43291f" strokeWidth={3.2} strokeLinejoin="round" />

              <g id="eyebrow-left" transform="translate(17 -49) rotate(0)">
                <path d="M-8 1 C-2 -3 5 -3 10 0" fill="none" stroke="#3b2721" strokeWidth={3} strokeLinecap="round" />
              </g>
              <g id="eye-left-open" transform="translate(21 -42) rotate(0)">
                <path d="M-7 0 C-2 -4 5 -4 9 0 C5 5 -2 5 -7 0 Z" fill="#f3dfbd" stroke="#43291f" strokeWidth={1.8} />
                <ellipse cx={3} cy={0.5} rx={2.4} ry={3.2} fill="#1e2929" />
                <circle cx={4} cy={-0.5} r={0.7} fill="#fff" />
              </g>
              <g id="mouth-neutral" transform="translate(25 -16) rotate(0)">
                <path d="M-7 0 C-1 2 5 2 10 -1" fill="none" stroke="#3d241e" strokeWidth={2.5} strokeLinecap="round" />
              </g>

              <g id="hat" transform="translate(0 -64) rotate(0)">
                <path d="M-27 5 C-25 -12 -14 -25 4 -28 C21 -28 33 -17 35 -2 L31 6 C12 12 -10 12 -27 5 Z" fill="#58716a" stroke="#283c3a" strokeWidth={3} strokeLinejoin="round" />
                <path d="M-30 4 C-10 0 17 1 42 8 C45 10 43 14 39 15 C14 14 -10 11 -34 9 C-38 7 -35 4 -30 4 Z" fill="#465f59" stroke="#283c3a" strokeWidth={3} strokeLinejoin="round" />
              </g>
            </g>
          </g>
        </svg>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#4a3a28", marginTop: 4 }}>
          frame {frame} — epaule {armShoulder.toFixed(0)}deg / coude {armElbow.toFixed(0)}deg / hanche {legHip.toFixed(0)}deg / genou {legKnee.toFixed(0)}deg
        </div>
      </div>
    </AbsoluteFill>
  );
};
