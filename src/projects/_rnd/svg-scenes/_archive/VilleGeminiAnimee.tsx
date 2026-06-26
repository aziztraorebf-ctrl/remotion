/**
 * VilleGeminiAnimee — R&D (2026-06-21). Scene ville/port GRAVEE par Gemini 3.1 Pro,
 * ANIMEE PAR GROUPES via useCurrentFrame() (grammaire "scene qui RESPIRE",
 * doctrine SVG-SCENES-GENERATIVES). Calque exact des patterns de SenegalCoinFaceA_SVG :
 * animation = fonction de `frame` UNIQUEMENT (jamais CSS transition / @keyframes / setTimeout).
 *
 * Montage : le corps statique VILLE_GEMINI est un bloc de <g id="..."> en chaine.
 * On le DECOUPE en chunks par id, et on re-emet chaque groupe comme un <g> JSX qui
 * porte le transform/opacity ANIME (le contenu interne reste injecte en innerHTML =
 * fidelite zero transcription manuelle). Les groupes non animes sont rendus statiques.
 *
 * Groupes animes : mid-smoke (monte+ondule), fg-crane-arm (pivote), fg-water (ondule),
 * fg-ship-1 / fg-ship-2 (tanguent), bg-sun (pulse+rotation rayons), bg-birds (derive).
 * Parallaxe : les bg-* derivent moins que les fg-*.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VILLE_GEMINI } from "./villeBodies";

const RED = "#8a2a20";

// --- Decoupe le corps SVG (suite de <g id="...">...</g>) en map { id: innerHTML } ---
// Parser simple a profondeur : on suit les <g ...> imbriques pour fermer le bon </g>.
function splitTopLevelGroups(svg: string): { id: string; inner: string }[] {
  const out: { id: string; inner: string }[] = [];
  const gOpen = /<g\b[^>]*>/g;
  let i = 0;
  while (i < svg.length) {
    gOpen.lastIndex = i;
    const m = gOpen.exec(svg);
    if (!m) break;
    const openTag = m[0];
    const idMatch = openTag.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : "";
    // trouver le </g> correspondant en comptant la profondeur
    let depth = 1;
    let j = gOpen.lastIndex;
    const tag = /<g\b[^>]*>|<\/g>/g;
    tag.lastIndex = j;
    let close = -1;
    let t: RegExpExecArray | null;
    while ((t = tag.exec(svg))) {
      if (t[0] === "</g>") {
        depth--;
        if (depth === 0) {
          close = t.index;
          break;
        }
      } else {
        depth++;
      }
    }
    if (close === -1) break;
    const inner = svg.slice(gOpen.lastIndex, close);
    out.push({ id, inner });
    i = close + 4; // longueur de "</g>"
  }
  return out;
}

const GROUPS = splitTopLevelGroups(VILLE_GEMINI);
const innerOf = (id: string) => GROUPS.find((g) => g.id === id)?.inner ?? "";

// emet un groupe statique (non anime), injecte tel quel
const Static: React.FC<{ id: string }> = ({ id }) => (
  <g dangerouslySetInnerHTML={{ __html: innerOf(id) }} />
);

export const VilleGeminiAnimee: React.FC = () => {
  const frame = useCurrentFrame();

  // === bg-sun : pulse de lumiere (opacity sin) + tres lente rotation des rayons (pivot 300,250) ===
  const sunPulse = 0.82 + 0.18 * (Math.sin(frame / 22) + 1) / 2; // 0.82..1.0
  const sunSpin = frame * 0.25; // deg, tres lent
  // parallaxe bg : derive minime
  const bgDrift = Math.sin(frame / 80) * 4;

  // === bg-birds : translation diagonale cyclique (vol qui traverse, parallaxe legere) ===
  const birdT = (frame % 150) / 150; // boucle douce sur 5s
  const birdX = interpolate(birdT, [0, 1], [-30, 60]);
  const birdY = interpolate(birdT, [0, 1], [10, -24]);
  const birdFade = Math.sin(birdT * Math.PI); // apparait/disparait en douceur

  // === mid-smoke : MONTE (translateY negatif lent) + ONDULE (translateX sin) + opacity qui varie ===
  const smokeRise = -((frame % 120) / 120) * 26; // remonte lentement puis se "renouvelle"
  const smokeSway = Math.sin(frame / 18) * 10;
  const smokeOpacity = 0.6 + 0.4 * (Math.sin(frame / 30) + 1) / 2;

  // === fg-water : ondulation (translate sin, comme les waves de FaceA) ===
  const waterY = Math.sin(frame / 14) * 5;
  const waterX = Math.sin(frame / 26) * 3;

  // === fg-crane-arm : PIVOTE lentement (pendulaire ~-5deg a +8deg autour du pivot ~290,410) ===
  const craneAngle = interpolate(
    Math.sin(frame / 40),
    [-1, 1],
    [-5, 8]
  );

  // === fg-ship-1 : TANGAGE lent (rotate +-2.5deg, pivot ~620,620) + legere derive ===
  const ship1Roll = Math.sin(frame / 24) * 2.5;
  const ship1Drift = Math.sin(frame / 60) * 6;
  const ship1Bob = Math.sin(frame / 16) * 3;

  // === fg-ship-2 : TANGAGE (vitesse differente, +-3deg, pivot ~765,800) + derive ===
  const ship2Roll = Math.sin(frame / 19 + 1.2) * 3;
  const ship2Drift = Math.sin(frame / 48 + 0.6) * 5;
  const ship2Bob = Math.sin(frame / 13 + 0.8) * 2.5;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#16213a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 1024 1024" width={1024} height={1024} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="coinGradVille" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
            <stop offset="0%" stopColor="#e7bd78" />
            <stop offset="75%" stopColor="#dca95e" />
            <stop offset="100%" stopColor="#bf9442" />
          </radialGradient>
          <clipPath id="coinClipVille">
            <circle cx="512" cy="512" r="480" />
          </clipPath>
        </defs>

        {/* fond dore de la piece */}
        <circle cx="512" cy="512" r="480" fill="url(#coinGradVille)" />

        {/* TOUTE la scene est clippee dans le disque */}
        <g clipPath="url(#coinClipVille)">
          {/* --- ARRIERE-PLAN (parallaxe lente) --- */}
          <g transform={`translate(${bgDrift} 0)`}>
            <Static id="bg-base" />
          </g>

          {/* bg-sun : rotation des rayons autour du soleil (300,250) + pulse opacity */}
          <g opacity={sunPulse} transform={`rotate(${sunSpin} 300 250)`}>
            <Static id="bg-sun" />
          </g>

          {/* bg-birds : vol diagonal cyclique */}
          <g transform={`translate(${birdX} ${birdY})`} opacity={birdFade}>
            <Static id="bg-birds" />
          </g>

          {/* --- PLAN MEDIAN --- */}
          <Static id="mid-city" />
          <Static id="mid-refinery" />

          {/* mid-smoke : monte + ondule + opacity qui varie */}
          <g transform={`translate(${smokeSway} ${smokeRise})`} opacity={smokeOpacity}>
            <Static id="mid-smoke" />
          </g>

          {/* --- PREMIER PLAN (parallaxe plus marquee) --- */}
          {/* fg-water : ondule (translate sin) */}
          <g transform={`translate(${waterX} ${waterY})`}>
            <Static id="fg-water" />
          </g>

          <Static id="fg-dock" />
          <Static id="fg-crane-base" />

          {/* fg-crane-arm : pivote autour du sommet du mat (~290,410) */}
          <g transform={`rotate(${craneAngle} 290 410)`}>
            <Static id="fg-crane-arm" />
          </g>

          {/* fg-ship-1 : tangage + bob + derive (pivot centre coque ~620,620) */}
          <g transform={`translate(${ship1Drift} ${ship1Bob}) rotate(${ship1Roll} 620 620)`}>
            <Static id="fg-ship-1" />
          </g>

          {/* fg-ship-2 : tangage + bob + derive (pivot ~765,800) */}
          <g transform={`translate(${ship2Drift} ${ship2Bob}) rotate(${ship2Roll} 765 800)`}>
            <Static id="fg-ship-2" />
          </g>

          <Static id="fg-frame" />
        </g>

        {/* rim rouge grave (identique au harnais SvgSceneCoin / FaceA) */}
        <g id="rim">
          <circle cx="512" cy="512" r="480" fill="none" stroke={RED} strokeWidth="12" />
          <circle cx="512" cy="512" r="468" fill="none" stroke={RED} strokeWidth="4" />
          <circle cx="512" cy="512" r="454" fill="none" stroke={RED} strokeWidth="8" strokeDasharray="4 20" strokeLinecap="round" />
          <circle cx="512" cy="512" r="495" fill="none" stroke={RED} strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

export default VilleGeminiAnimee;
