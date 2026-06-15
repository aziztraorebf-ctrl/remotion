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
  /** ratios des panneaux (0-1, somme=1). Si omis : répartition égale. Pour 2 panneaux : [r, 1-r]. */
  ratios?: number[];
  /** ratio du 1er panneau (legacy 2 volets). Ignoré si `ratios` fourni. */
  ratio?: number;
  /** render-props (2 OU 3 volets). Chaque panneau reçoit (panelWidth, panelHeight). */
  panels: ((w: number, h: number) => React.ReactNode)[];
  /** apparition séquencée des volets (frames locales, 1 par volet). Si omis : tous à l'ouverture. */
  panelAppearAt?: number[];
  /** labels optionnels en haut de chaque panneau. */
  labels?: string[];
  sepColor?: string;
  /** connecteur qui TRAVERSE la séparation, dessiné par-dessus tout (render-prop pleine taille). */
  connector?: (width: number, height: number) => React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  openDur?: number;
};

export const WarMapSplitScreen: React.FC<WarMapSplitScreenProps> = ({
  frame, inAt, outAt, width, height, orientation = "vertical", ratio = 0.5, ratios,
  panels, panelAppearAt, labels, sepColor = "#C9A24B", connector, fadeIn = 14, fadeOut = 16, openDur = 22,
}) => {
  if (frame < inAt - 2 || frame > outAt + 2) return null;
  const op = interpolate(frame, [inAt, inAt + fadeIn, outAt - fadeOut, outAt], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0.01) return null;
  const L = frame - inAt;
  const open = interpolate(L, [4, 4 + openDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  const vert = orientation === "vertical";
  const n = panels.length;
  const rs = ratios && ratios.length === n ? ratios : (n === 2 ? [ratio, 1 - ratio] : Array(n).fill(1 / n));
  const totalAxis = vert ? width : height;
  const sizes = rs.map((r) => r * totalAxis);
  const offsets = sizes.reduce<number[]>((acc, _s, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + sizes[i - 1]); return acc; }, []);
  const pw = (i: number) => (vert ? sizes[i] : width);
  const ph = (i: number) => (vert ? height : sizes[i]);
  const left = (i: number) => (vert ? offsets[i] : 0);
  const top = (i: number) => (vert ? 0 : offsets[i]);
  // apparition d'un volet : séquencée si panelAppearAt fourni, sinon ouverture globale
  const appearOf = (i: number) => panelAppearAt && panelAppearAt[i] != null
    ? interpolate(L, [panelAppearAt[i], panelAppearAt[i] + openDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : open;

  const panelNode = (i: number) => {
    const w = pw(i), h = ph(i);
    const appear = appearOf(i);
    const dir = i < n / 2 ? -1 : 1;
    const slide = (1 - appear) * dir * (vert ? w : h) * 0.4;
    return (
      <div key={i} style={{
        position: "absolute", left: left(i), top: top(i), width: w, height: h, overflow: "hidden",
        transform: vert ? `translateX(${slide}px)` : `translateY(${slide}px)`, opacity: appear,
      }}>
        <div style={{ position: "absolute", inset: 0, width: w, height: h }}>
          {panels[i](w, h)}
        </div>
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 70px rgba(8,6,3,0.5)", pointerEvents: "none" }} />
        {labels && labels[i] && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 22, textAlign: "center", opacity: appear,
            fontFamily: "Georgia, serif", fontWeight: 800, fontSize: vert && n >= 3 ? 20 : 24, letterSpacing: 2,
            color: "#E8DCC0", textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>{labels[i]}</div>
        )}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {panels.map((_, i) => panelNode(i))}
      {/* séparateurs nets entre volets (apparaissent avec le volet de droite/bas) */}
      {offsets.slice(1).map((o, i) => (
        <div key={i} style={{ position: "absolute", opacity: appearOf(i + 1), background: sepColor, boxShadow: "0 0 12px rgba(0,0,0,0.5)",
          ...(vert ? { left: o - 2, top: 0, width: 4, height } : { left: 0, top: o - 2, width, height: 4 }) }} />
      ))}
      {connector && <AbsoluteFill style={{ opacity: open }}>{connector(width, height)}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
