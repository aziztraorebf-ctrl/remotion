/**
 * PROTOTYPE — test visuel du rig VOLUMETRIQUE complet (jambes + bras avant en capsules tapered)
 * integre a StickRig.tsx via le prop `volumetric` (2026-07-02, suite breakdown GPT-5.5 sur
 * planteur-cacao-charsheet-GPT.png). Compare le rendu ligne d'origine (volumetric=false, defaut)
 * au rendu capsule (volumetric=true) sur plusieurs poses, MEME cinematique computePose().
 *
 * Objectif : juger a l'oeil la coherence du rig etendu (jambes+coude, pas juste 1 bras isole
 * comme le 1er prototype) avant de le documenter comme pret pour une scene de production.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { StickRig } from "../../_shared/personnage-vivant-svg/rig/StickRig";

const PARCH = "#e8dcc0";
const INK = "#2b2117";

export const PROTO_CAPSULE_LIMB_FRAMES = 150;

type StateDef = { label: string; armReach: number; bend: number; moveAmt: number; walkPhase: number };

const STATES: StateDef[] = [
  { label: "debout", armReach: 0, bend: 0, moveAmt: 0, walkPhase: 0 },
  { label: "marche", armReach: 0, bend: 0, moveAmt: 1, walkPhase: 30 },
  { label: "bras tendu (recolte)", armReach: 1, bend: 0.4, moveAmt: 0, walkPhase: 0 },
];

const Panel: React.FC<{ title: string; def: StateDef; volumetric: boolean }> = ({ title, def, volumetric }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300 }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: INK, marginBottom: 8 }}>{title}</div>
      <svg width={300} height={340} viewBox="-150 -320 300 340">
        <line x1={-150} y1={0} x2={150} y2={0} stroke={INK} strokeWidth={2} opacity={0.3} />
        <StickRig
          walkPhase={def.walkPhase}
          moveAmt={def.moveAmt}
          bend={def.bend}
          armReach={def.armReach}
          hat="straw"
          ink={INK}
          tunicColor={PARCH}
          volumetric={volumetric}
        />
      </svg>
    </div>
  );
};

export const ProtoCapsuleLimb: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: INK, marginBottom: 40 }}>
          StickRig ligne (haut) vs bras capsule tapered superpose (bas, meme pose)
        </div>
        <div style={{ display: "flex", gap: 60 }}>
          {STATES.map((def) => (
            <div key={def.label} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Panel title={`${def.label} — ligne (defaut)`} def={def} volumetric={false} />
              <Panel title={`${def.label} — volumetrique`} def={def} volumetric />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
