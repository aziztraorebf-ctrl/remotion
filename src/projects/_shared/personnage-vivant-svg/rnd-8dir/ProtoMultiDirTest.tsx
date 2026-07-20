/**
 * ProtoMultiDirTest — TEST DE NON-REGRESSION de la consolidation StickRigMultiDir (2026-07-02).
 * Verifie que le rig unifie (rig/StickRigMultiDir.tsx + rig/multiDirection.ts) produit un rendu
 * EQUIVALENT aux 3 protos isoles valides individuellement par Aziz (Proto3Quarter, ProtoBack, ProtoFace).
 * 3 persos identiques en couleur/accessoires, cote a cote, un par vue : 3/4 / dos / face.
 *
 * Pas une scene de prod — banc de verification avant d'attaquer la scene narrative multi-directions.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StickRigMultiDir } from "../rig/StickRigMultiDir";

const INK = "#2b2117";
const PARCH = "#e8dcc0";

export const PASSER_MULTIDIR_TEST_FRAMES = 180;

export const ProtoMultiDirTest: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1920, H = 1080;
  const GROUND_Y = 700;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 ${GROUND_Y - 4} H ${W}`} stroke={INK} strokeWidth={2.4} opacity={0.3} fill="none" />
        <g transform={`translate(${W / 2} ${GROUND_Y})`}>
          <g transform="translate(-500 0)">
            <StickRigMultiDir view="3quarter" walkPhase={frame} tunicColor="#6b8e5a" hat="cap" neckwear="scarf-knot" neckwearColor="#b5552f" />
          </g>
          <g transform="translate(0 0)">
            <StickRigMultiDir view="back" walkPhase={frame} tunicColor="#6b8e5a" hat="cap" neckwear="scarf-knot" neckwearColor="#b5552f" />
          </g>
          <g transform="translate(500 0)">
            <StickRigMultiDir view="face" walkPhase={frame} tunicColor="#6b8e5a" hat="cap" neckwear="scarf-knot" neckwearColor="#b5552f" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
