// TEMPLATE — WarMapSplitScreen (production, promu depuis R&D P5/P6 — validé concept Aziz 2026-06-14).
//
// PATTERN : faire tenir DEUX réalités CÔTE À CÔTE simultanément pour montrer leur RAPPORT (divergence,
// comparaison, dépendance). Incarne la dualité au lieu de la décrire. Cas d'usage roi : opposer un monde A
// (ex. carte du bloc AES) à un monde B (ex. data Paris/CFA) → la frontière du split EST la séparation.
//
// Orientations : "vertical" (gauche|droite, défaut 16:9) ou "horizontal" (haut/bas). Chaque panneau est un
// render-prop indépendant (sa propre carte/data/animation). Ouverture animée (les volets glissent en place).
// Un connecteur optionnel (fil/lien) peut TRAVERSER la séparation (ex. la parité CFA qui relie les 2 mondes).
//
// Composant PUR (frame en prop). Réutilisable dans toute <PartieX> ou compo. Voir doctrine WARMAP-CARTE-VS-OVERLAY
// (le split = "les deux en parallèle" : spatial à gauche, conceptuel à droite, simultanément).

import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";

export type SplitOrientation = "vertical" | "horizontal";

export type WarMapSplitScreenProps = {
  frame: number;
  inAt: number;
  outAt: number;
  width: number;
  height: number;
  orientation?: SplitOrientation;
  /** ratio du 1er panneau (0-1). 0.5 = moitié-moitié. */
  ratio?: number;
  /** render-prop par panneau : reçoit (panelWidth, panelHeight). */
  panels: [(w: number, h: number) => React.ReactNode, (w: number, h: number) => React.ReactNode];
  /** labels optionnels en haut de chaque panneau. */
  labels?: [string, string];
  sepColor?: string;
  /** connecteur qui TRAVERSE la séparation, dessiné par-dessus tout (render-prop pleine taille). */
  connector?: (width: number, height: number) => React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  openDur?: number;
};

export const WarMapSplitScreen: React.FC<WarMapSplitScreenProps> = ({
  frame, inAt, outAt, width, height, orientation = "vertical", ratio = 0.5,
  panels, labels, sepColor = "#C9A24B", connector, fadeIn = 14, fadeOut = 16, openDur = 22,
}) => {
  if (frame < inAt - 2 || frame > outAt + 2) return null;
  const op = interpolate(frame, [inAt, inAt + fadeIn, outAt - fadeOut, outAt], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0.01) return null;
  const L = frame - inAt;
  const open = interpolate(L, [4, 4 + openDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  const vert = orientation === "vertical";
  const p0 = vert ? width * ratio : height * ratio;       // taille panneau 1 (axe variable)
  const p1 = (vert ? width : height) - p0;                 // taille panneau 2
  const pw = (i: number) => (vert ? (i === 0 ? p0 : p1) : width);
  const ph = (i: number) => (vert ? height : (i === 0 ? p0 : p1));
  const left = (i: number) => (vert ? (i === 0 ? 0 : p0) : 0);
  const top = (i: number) => (vert ? 0 : (i === 0 ? 0 : p0));

  const panelNode = (i: number) => {
    const w = pw(i), h = ph(i);
    // glissement d'entrée : panneau 1 depuis le bord "amont", panneau 2 depuis "aval"
    const dir = i === 0 ? -1 : 1;
    const slide = (1 - open) * dir * (vert ? w : h) * 0.4;
    return (
      <div key={i} style={{
        position: "absolute", left: left(i), top: top(i), width: w, height: h, overflow: "hidden",
        transform: vert ? `translateX(${slide}px)` : `translateY(${slide}px)`, opacity: open,
      }}>
        {/* contenu RELATIF au panneau (coords 0..w, 0..h). Chaque render-prop reçoit (w,h) et se place
            dans SON repère — pas de décalage global (sinon le panneau 2 déborde sous le panneau 1). */}
        <div style={{ position: "absolute", inset: 0, width: w, height: h }}>
          {panels[i](w, h)}
        </div>
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 70px rgba(8,6,3,0.5)", pointerEvents: "none" }} />
        {labels && labels[i] && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 22, textAlign: "center", opacity: open,
            fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 24, letterSpacing: 2,
            color: "#E8DCC0", textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>{labels[i]}</div>
        )}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {panelNode(0)}
      {panelNode(1)}
      {/* séparateur net */}
      <div style={{ position: "absolute", opacity: open, background: sepColor, boxShadow: "0 0 12px rgba(0,0,0,0.5)",
        ...(vert
          ? { left: p0 - 2, top: 0, width: 4, height }
          : { left: 0, top: p0 - 2, width, height: 4 }) }} />
      {/* connecteur qui traverse la séparation (dessiné par-dessus) */}
      {connector && <AbsoluteFill style={{ opacity: open }}>{connector(width, height)}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
