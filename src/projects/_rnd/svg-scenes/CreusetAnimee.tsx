/**
 * CreusetAnimee — "L'OR DEVIENT LA GUERRE" : le creuset (transformation or -> armes), registre braise-or eclairci.
 *
 * R&D SVG-SCENES-GENERATIVES (2026-06-22). Teste la TRANSFORMATION d'une forme (l'or fondu -> des balles).
 * Complete la these Soudan : on a "l'or sort de la terre" (HeroGptAnimee) ; ici "l'or DEVIENT la guerre".
 * Base GPT-5.5 (four-arche + creuset a bras), ECLAIRCIE par remap couleur cote code (forge moins ecrasante),
 * et les ARMES REDESSINEES A LA MAIN en balles/cartouches nettes (Gemini/GPT rendaient des formes ambigues).
 *
 * PHRASE NARRATIVE : "cet or ne reste pas de l'or... il devient la guerre."
 *
 * Grammaire (2 couches) :
 *   FOND permanent : braises du four qui pulsent, leger drift, etincelles qui montent.
 *   EVENEMENTS echelonnes (le geste central = la TRANSFORMATION) :
 *     ~f30   le creuset BASCULE autour du pivot (580,260) pour verser
 *     ~f60   la COULEE d'or DESCEND vers les moules (scaleY + ruissellement)
 *     ~f130/170/210  les 3 BALLES EMERGENT une a une des moules (montent + fade) = transformation accomplie
 *     ~f300  le creuset se redresse (fin du versement), les balles luisent
 *   Objet inerte (balle) = emerge par translation VERTICALE depuis son moule (mouvement legitime : ca sort
 *   du moule), puis IMMOBILE. Le creuset BASCULE (objet pivotant = mouvement legitime).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from "remotion";
import {
  C_BACKGROUND_HAZE, C_SOL, C_FOUR_STRUCT, C_BRAISES, C_CREUSET, C_COULEE,
  C_MOULES_ARMES, C_ETINCELLES, C_VIGNETTE, C_BALLE_1, C_BALLE_2, C_BALLE_3,
} from "./creusetGroups";

const FORGE = "#3a2615"; // fond forge eclairci

const Grp: React.FC<{ body: string; transform?: string; opacity?: number; style?: React.CSSProperties }> = ({
  body, transform, opacity, style,
}) => <g transform={transform} opacity={opacity} style={style} dangerouslySetInnerHTML={{ __html: body }} />;

export const CreusetAnimee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- FOND permanent ----------
  const driftX = Math.sin(f / 120) * 5;
  // braises : pulsent (le four vit) — double sinus pour un feu vivant
  const braisesPulse = 0.78 + 0.22 * (Math.sin(f / 11) + Math.sin(f / 7)) / 2;

  // ---------- EVENEMENTS ----------
  // f30 : le creuset BASCULE autour du pivot (580,260) pour verser, puis se redresse a f300.
  const tipIn = spring({ frame: f - 30, fps, config: { mass: 1, damping: 14, stiffness: 70 }, durationInFrames: 40 });
  const tipOut = interpolate(f, [300, 340], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const creusetAngle = tipIn * 26 - tipOut * 26; // bascule de 26deg pour verser, puis revient

  // f60 : la coulee d'or DESCEND (scaleY de 0 a 1 depuis le bec ~y300), puis ruisselle en continu.
  const couleeGrow = interpolate(f, [60, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const couleeStop = interpolate(f, [300, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // s'arrete quand le creuset se redresse
  const couleeScale = couleeGrow * couleeStop;
  const couleeShimmer = 0.85 + 0.15 * (Math.sin(f / 6) + 1) / 2;

  // les 3 balles EMERGENT une a une des moules (montent depuis ~+90px sous leur position + fade).
  const emerge = (startF: number) => {
    const s = spring({ frame: f - startF, fps, config: { mass: 0.8, damping: 13, stiffness: 110 }, durationInFrames: 30 });
    return { dy: (1 - s) * 90, op: interpolate(f, [startF, startF + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), on: f >= startF };
  };
  const b1 = emerge(130);
  const b2 = emerge(170);
  const b3 = emerge(210);
  // les balles luisent une fois en place
  const balleGlow = 0.88 + 0.12 * (Math.sin(f / 15) + 1) / 2;

  // etincelles : montent + scintillent (boucle)
  const etinY = -((f * 0.7) % 120);
  const etinOp = 0.5 + 0.4 * (Math.sin(f / 5) + 1) / 2;

  return (
    <AbsoluteFill style={{ background: FORGE }}>
      {/* ===== AUDIO ===== */}
      <Sequence from={0} durationInFrames={420}>
        <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.34} loop />
      </Sequence>
      {/* bascule du creuset / debut versement (~f60) */}
      <Sequence from={58} durationInFrames={26}>
        <Audio src={staticFile("_shared/sfx/ui/whoosh.mp3")} volume={0.5} />
      </Sequence>
      {/* chaque balle qui se solidifie (impact metallique) */}
      <Sequence from={150} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={190} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={230} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>

      {/* ===== IMAGE ===== */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${driftX} 0)`}>
          {/* fond + sol */}
          <Grp body={C_BACKGROUND_HAZE} />
          <Grp body={C_SOL} />

          {/* FOUR (structure) + BRAISES qui pulsent */}
          <Grp body={C_FOUR_STRUCT} />
          <Grp body={C_BRAISES} opacity={braisesPulse} />

          {/* MOULES (statiques, la ou les balles se solidifient) */}
          <Grp body={C_MOULES_ARMES} />

          {/* COULEE d'or — se REVELE du bec du creuset (540,318) vers les moules (clip qui s'etend) */}
          <g opacity={couleeShimmer} style={{ clipPath: `inset(0 ${(1 - couleeScale) * 100}% 0 0)` }}>
            <Grp body={C_COULEE} />
          </g>

          {/* CREUSET — bascule autour du pivot (580,260) pour verser */}
          <Grp body={C_CREUSET} transform={`rotate(${creusetAngle} 580 260)`} />

          {/* LES 3 BALLES — emergent une a une des moules (montent + fade), puis luisent */}
          {b1.on && <Grp body={C_BALLE_1} transform={`translate(0 ${b1.dy})`} opacity={b1.op * balleGlow} />}
          {b2.on && <Grp body={C_BALLE_2} transform={`translate(0 ${b2.dy})`} opacity={b2.op * balleGlow} />}
          {b3.on && <Grp body={C_BALLE_3} transform={`translate(0 ${b3.dy})`} opacity={b3.op * balleGlow} />}

          {/* ETINCELLES — montent + scintillent */}
          <Grp body={C_ETINCELLES} transform={`translate(0 ${etinY})`} opacity={etinOp} />

          {/* VIGNETTE */}
          <Grp body={C_VIGNETTE} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CreusetAnimee;
