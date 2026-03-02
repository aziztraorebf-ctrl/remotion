import React from "react";
import { AbsoluteFill } from "remotion";
import {
  GROUND_Y,
  SIDEVIEW_COORDS,
  SIDEVIEW_LANES,
  SIDEVIEW_LAYER_Z,
} from "../config/sideViewFoundation";

interface NpcDebugPoint {
  id: string;
  x: number;
  laneY: number;
  footY: number;
  zIndex: number;
}

interface Props {
  enabled: boolean;
  npcs?: NpcDebugPoint[];
}

export const SideViewDebugOverlay: React.FC<Props> = ({ enabled, npcs = [] }) => {
  if (!enabled) {
    return null;
  }

  const laneEntries = Object.entries(SIDEVIEW_LANES) as Array<
    [keyof typeof SIDEVIEW_LANES, number]
  >;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: SIDEVIEW_LAYER_Z.textOverlay + 1 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: GROUND_Y,
          height: 0,
          borderTop: "2px dashed rgba(255, 80, 80, 0.9)",
        }}
      />
      {laneEntries.map(([laneId, laneY]) => (
        <div
          key={laneId}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: laneY,
            height: 0,
            borderTop: "1px dashed rgba(120, 220, 255, 0.8)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -14,
              left: 8,
              color: "#d6f4ff",
              fontFamily: "monospace",
              fontSize: 12,
              background: "rgba(0, 0, 0, 0.45)",
              padding: "1px 4px",
              borderRadius: 3,
            }}
          >
            lane {laneId} y={laneY}
          </div>
        </div>
      ))}
      {npcs.map((npc) => (
        <div
          key={npc.id}
          style={{
            position: "absolute",
            left: Math.round(npc.x),
            top: Math.round(npc.footY),
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            borderRadius: "50%",
            backgroundColor: "rgba(80, 255, 120, 0.95)",
            border: "1px solid rgba(0, 0, 0, 0.8)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -18,
              left: 10,
              color: "#a8ffbe",
              fontFamily: "monospace",
              fontSize: 10,
              background: "rgba(0, 0, 0, 0.5)",
              padding: "1px 3px",
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}
          >
            {npc.id} foot={Math.round(npc.footY)} lane={npc.laneY} z={npc.zIndex}
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "#fff4bf",
          fontFamily: "monospace",
          fontSize: 11,
          background: "rgba(0, 0, 0, 0.6)",
          padding: "6px 8px",
          borderRadius: 4,
          maxWidth: 380,
          lineHeight: 1.4,
        }}
      >
        debug ON | {SIDEVIEW_COORDS.width}x{SIDEVIEW_COORDS.height} | origin {SIDEVIEW_COORDS.origin}
      </div>
    </AbsoluteFill>
  );
};

