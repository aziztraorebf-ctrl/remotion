/**
 * OrganiqueCompare — R&D banc d'essai organique (encre/parchemin), Gemini vs GPT-5.5.
 * 3 compositions : profil, duo, animal. Mode STATIQUE.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SvgSceneParchemin } from "./SvgSceneParchemin";
import {
  PROFIL_GEMINI, PROFIL_GPT,
  DUO_GEMINI, DUO_GPT,
  ANIMAL_GEMINI, ANIMAL_GPT,
} from "./organiqueBodies";

const Pair: React.FC<{ g: string; p: string }> = ({ g, p }) => (
  <AbsoluteFill style={{ background: "#cdbf9e", display: "flex", flexDirection: "row" }}>
    <div style={{ position: "relative", flex: 1 }}>
      <SvgSceneParchemin sceneSvg={g} label="GEMINI 3.1 Pro" />
    </div>
    <div style={{ position: "relative", flex: 1 }}>
      <SvgSceneParchemin sceneSvg={p} label="GPT-5.5" />
    </div>
  </AbsoluteFill>
);

export const ProfilCompare: React.FC = () => <Pair g={PROFIL_GEMINI} p={PROFIL_GPT} />;
export const DuoCompare: React.FC = () => <Pair g={DUO_GEMINI} p={DUO_GPT} />;
export const AnimalCompare: React.FC = () => <Pair g={ANIMAL_GEMINI} p={ANIMAL_GPT} />;
