// P4 v2 — "Sarah se connecte. Meme bureau, a Toronto, meme ordinateur. Risque minime. La porte
// s'ouvre — elle ne s'en rend meme pas compte." 28.7 -> 40.9s absolu (0 -> 12.2s relatif).
//
// REFONTE POST-JURY (2026-08-07, rejet v1 unanime : manque n°1 identifie par les 4 jurys sur ce
// panneau specifiquement = ABSENCE DE CURSEUR. "Le curseur n'est pas un detail, c'est un acteur"
// (Grok). v1 : pull-back puis dashboard fige 9+ secondes ("capture d'ecran dans un laptop", GPT).
// v2 : le pull-back reste (bon), mais un curseur entre APRES stabilisation, se deplace en courbe
// de Bezier (jamais une ligne droite — Gemini/Grok), hover reel sur la ligne Sarah (illumination,
// micro-scale), et le dashboard garde une activite residuelle en continu (pulses, respiration du
// score) meme sans action du curseur. Cf SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md § P4.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DashboardScreen } from "../ui/DashboardScreen";
import { LaptopMockup } from "../ui/LaptopMockup";
import { VirtualCursor } from "../ui/VirtualCursor";
import { NS_COLORS } from "../ui/theme";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const T_PULLBACK_START = 0.3;
const T_PULLBACK_DUR = 3.2;
const T_PULLBACK_END = T_PULLBACK_START + T_PULLBACK_DUR;

// Curseur : entre, glisse vers la ligne Sarah (hover), PUIS repart consulter les autres lignes
// du dashboard -- un hover statique prolonge (5+ secondes) reproduisait exactement le defaut
// signale par le jury ("le curseur arrive et reste fige"). Le mouvement du curseur porte a lui
// seul la "vie" du panneau une fois le pull-back stabilise (pas de clic : "elle ne s'en rend
// meme pas compte" reste respecte -- le curseur observe, ne declenche rien).
const T_CURSOR_START = T_PULLBACK_END + 0.6;
const T_CURSOR_ARRIVE_SARAH = T_CURSOR_START + 1.6;
const T_HOVER_SARAH_END = T_CURSOR_ARRIVE_SARAH + 1.3;
const T_MOVE_TO_DAVID_END = T_HOVER_SARAH_END + 1.5;
const T_HOVER_DAVID_END = T_MOVE_TO_DAVID_END + 1.4;
const T_MOVE_TO_AMINA_END = T_HOVER_DAVID_END + 1.3;

const CURSOR_FROM = { x: 1650, y: 220 };
const CURSOR_SARAH = { x: 1420, y: 585 }; // badge "Autorise" ligne Sarah (highlighted)
const CURSOR_DAVID = { x: 1420, y: 462 }; // ligne David K. (au-dessus de Sarah)
const CURSOR_AMINA = { x: 1420, y: 524 }; // ligne Amina T. (entre David et Sarah)
const CTRL_TO_SARAH = { x: 1750, y: 480 };
const CTRL_TO_DAVID = { x: 1550, y: 500 };
const CTRL_TO_AMINA = { x: 1520, y: 545 };

function bezierPoint(t: number, p0: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
}

export const P4DashboardReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;

  const pullback = spring({
    frame: frame - T_PULLBACK_START * fps,
    fps,
    config: { damping: 22, stiffness: 60 },
    durationInFrames: T_PULLBACK_DUR * fps,
  });
  const scale = interpolate(pullback, [0, 1], [4.2, 1]);
  const focalX = interpolate(pullback, [0, 1], [0.74, 0.5]);
  const focalY = interpolate(pullback, [0, 1], [0.5, 0.5]);

  const laptopWidth = width * 1.3;

  // Curseur : 3 segments Bezier successifs (entree->Sarah->David->Amina), chacun avec un hover
  // court entre les deplacements -- ca "consulte" le dashboard en continu au lieu de rester fige.
  const easeOut = (x: number) => 1 - Math.pow(1 - x, 2.2);
  let cursorPos: { x: number; y: number };
  let isHovering = false;

  if (t < T_CURSOR_ARRIVE_SARAH) {
    const p = interpolate(t, [T_CURSOR_START, T_CURSOR_ARRIVE_SARAH], [0, 1], { ...clamp, easing: easeOut });
    cursorPos = bezierPoint(p, CURSOR_FROM, CTRL_TO_SARAH, CURSOR_SARAH);
  } else if (t < T_HOVER_SARAH_END) {
    cursorPos = CURSOR_SARAH;
    isHovering = true;
  } else if (t < T_MOVE_TO_DAVID_END) {
    const p = interpolate(t, [T_HOVER_SARAH_END, T_MOVE_TO_DAVID_END], [0, 1], { ...clamp, easing: easeOut });
    cursorPos = bezierPoint(p, CURSOR_SARAH, CTRL_TO_DAVID, CURSOR_DAVID);
  } else if (t < T_HOVER_DAVID_END) {
    cursorPos = CURSOR_DAVID;
    isHovering = true;
  } else if (t < T_MOVE_TO_AMINA_END) {
    const p = interpolate(t, [T_HOVER_DAVID_END, T_MOVE_TO_AMINA_END], [0, 1], { ...clamp, easing: easeOut });
    cursorPos = bezierPoint(p, CURSOR_DAVID, CTRL_TO_AMINA, CURSOR_AMINA);
  } else {
    cursorPos = CURSOR_AMINA;
    isHovering = true;
  }

  const cursorVisible = t >= T_CURSOR_START - 0.1;
  const hoverPulse = isHovering ? 0.85 + Math.sin(t * (Math.PI * 2) / 1.4) * 0.15 : 1;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #0F1F38, ${NS_COLORS.navyDeep})`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          transformOrigin: `${focalX * 100}% ${focalY * 100}%`,
        }}
      >
        <LaptopMockup width={laptopWidth} screenContent={<DashboardScreen riskCase="low" />} />
      </AbsoluteFill>

      {cursorVisible && (
        <div
          style={{
            opacity: interpolate(t, [T_CURSOR_START - 0.1, T_CURSOR_START + 0.15], [0, 1], clamp),
            transform: `scale(${hoverPulse})`,
            transformOrigin: `${cursorPos.x}px ${cursorPos.y}px`,
          }}
        >
          <VirtualCursor x={cursorPos.x} y={cursorPos.y} />
        </div>
      )}

      {/* Vie d'ambiance sur le laptop stabilise : halo respirant discret, N'affecte PAS le
          rendu du texte/UI (evite le mecanisme de flickering identifie par le jury sur les
          scales non entiers appliques aux elements fins). */}
      {pullback >= 1 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 40,
            height: 40,
            marginLeft: -20,
            marginTop: -20,
            borderRadius: "50%",
            background: NS_COLORS.cyan,
            opacity: 0.02 + Math.abs(Math.sin(t * (Math.PI * 2) / 3.0)) * 0.03,
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
