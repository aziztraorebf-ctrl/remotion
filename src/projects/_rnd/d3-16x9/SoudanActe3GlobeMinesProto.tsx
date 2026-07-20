/**
 * SoudanActe3GlobeMinesProto — PROTO de calage (2026-07-19).
 *
 * But : repondre a la question d'Aziz "et si on passait la partie carte (mines + portraits) en GLOBE
 * au lieu de Mapbox, pour n'avoir que 2 registres visuels (SVG intro + Globe) au lieu de 3" ?
 * On transpose le beat 2 (les 3 mines d'or du Darfour + le portrait Hemedti relie a Jebel Amer) en
 * vue globe D3, dans DEUX echelles a comparer :
 *   - "topdown"  : globe TRES zoome sur le Soudan (courbure quasi nulle = lisibilite jetons max).
 *   - "courbure" : globe assume, scale plus faible (on voit qu'on est sur une sphere).
 *
 * Meme moteur/palette (THEMES.mixte) que l'insert globe valide -> raccord parfait, zero nouveau style.
 * Ce n'est PAS le beat final : c'est un calage d'echelle. Une fois l'echelle choisie, on refait toute
 * la partie carte 17.4-38.8s avec cette valeur.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile } from "remotion";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { projectPoint, type LonLat } from "./geoArc";
import { THEMES } from "./SoudanActe3GlobeProto16x9";

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export const GLOBE_MINES_PROTO_FRAMES = 315; // 10.5s @30fps — assez pour mines + portrait + halo

// Coords Darfour (identiques au Mapbox Section 1 pour fidelite geo).
const JEBEL_AMER: LonLat = [23.706, 13.834];
const MINE_2: LonLat = [24.9, 12.05];
const MINE_3: LonLat = [23.4, 15.5];

// Timing local (derive du beat 2 Mapbox : mines a ~minesOr, portrait a ~hemedtiNomme).
const TL = {
  minesOr: 30, // 1re mine
  hemedti: 200, // portrait Hemedti nomme
};

// Sprite iso pose au sol (mine) — ZERO ombre externe (l'ombre est deja dessinee dans le sprite iso,
// cf feedback jeton-iso-pas-d-ombre-externe). Halo dore au sol pour detacher du fond kaki.
const MineSprite: React.FC<{ x: number; y: number; appear: number; frame: number; size: number; fade?: number }> = ({ x, y, appear, frame, size, fade = 1 }) => {
  const op = interpolate(frame, [appear, appear + 16], [0, fade], clampB);
  const pop = interpolate(frame, [appear, appear + 9, appear + 14], [0, 1.15, 1], clampB);
  const haloR = size * 0.62;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: op, pointerEvents: "none" }}>
      {/* halo dore au sol (radial), sous le sprite */}
      <div style={{ position: "absolute", left: "50%", top: "58%", width: haloR * 2, height: haloR * 2,
        transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,165,116,0.55) 0%, rgba(212,165,116,0.22) 45%, rgba(212,165,116,0) 72%)" }} />
      <img src={staticFile("_shared/sprites/warmap/mine-or-td.png")}
        style={{ width: size, height: size * (768 / 1408), objectFit: "contain", display: "block",
          transform: `scale(${pop})`, transformOrigin: "center bottom" }} />
    </div>
  );
};

// PortraitToken — recette EXACTE de l'insert globe (cercle parchemin + bordure faction + portrait +
// ombre portee + pulse). Faction rsf = Hemedti.
const PortraitToken: React.FC<{ x: number; y: number; appear: number; frame: number }> = ({ x, y, appear, frame }) => {
  const D = 72;
  const op = interpolate(frame, [appear, appear + 16], [0, 1], clampB);
  const pop = interpolate(frame, [appear, appear + 9, appear + 15], [0.5, 1.12, 1], clampB);
  const pulse = interpolate(frame, [appear, appear + 30], [1, 0], clampB);
  const border = "#B14B3C";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${pop})`, opacity: op, pointerEvents: "none" }}>
      {pulse > 0 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", width: D + 64 * pulse, height: D + 64 * pulse,
          transform: "translate(-50%,-50%)", borderRadius: "50%", border: `2.5px solid ${border}`, opacity: 0.7 * (1 - pulse) }} />
      )}
      <div style={{ position: "absolute", left: "50%", top: "72%", width: D * 0.82, height: D * 0.26,
        transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
      <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6",
        border: `3.5px solid ${border}`, boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
        <img src={staticFile("_shared/sprites/warmap/portrait-rsf.png")}
          style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center", transform: "translate(-8%, 2%)", display: "block" }} />
      </div>
    </div>
  );
};

export const SoudanActe3GlobeMinesProto: React.FC<{ scaleVariant?: "topdown" | "courbure"; borderVariant?: "marque" | "fort" }> = ({ scaleVariant = "topdown", borderVariant = "marque" }) => {
  const frame = useCurrentFrame();
  const t = THEMES.mixte;

  // Surcharge LOCALE des contours de territoires (retour Aziz 2026-07-19 : "frontieres trop effacees
  // sur le kaki, il faut du quasi-noir bien visible"). Ne touche PAS THEMES.mixte (partage avec l'insert).
  //   marque : quasi-noir, epaisseur moyenne, opacite haute.
  //   fort   : noir plus epais encore (carte politique tres marquee).
  const borderColor = "#1c150a"; // quasi-noir chaud (accord kaki)
  const borderW = borderVariant === "fort" ? 1.5 : 1.1;
  const borderOp = borderVariant === "fort" ? 0.92 : 0.8;

  // ===== CAMERA : centree sur le Darfour (Jebel Amer). Leger dezoom d'entree pour "respirer" le globe.
  // topdown  : demarre 6.5 (Soudan plein cadre, courbure quasi nulle) -> 5.6 (reste tres zoome).
  // courbure : demarre 4.2 -> 3.6 (on voit la sphere / la courbure des le depart).
  const startScaleMul = scaleVariant === "topdown" ? 6.5 : 4.2;
  const endScaleMul = scaleVariant === "topdown" ? 5.6 : 3.6;
  const eDez = easeInOut(interpolate(frame, [0, GLOBE_MINES_PROTO_FRAMES], [0, 1], clampB));
  const scaleMul = interpolate(eDez, [0, 1], [startScaleMul, endScaleMul]);

  const centerLon = 24;
  const centerLat = 14;
  const rotLambda = -centerLon;
  const rotLat = -centerLat;

  const proj = orthoAt(rotLambda, rotLat).scale(GLOBE_R * scaleMul);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const sudan = featureByName("Sudan");

  const pJebel = projectPoint(proj, JEBEL_AMER, visible);
  const pMine2 = projectPoint(proj, MINE_2, visible);
  const pMine3 = projectPoint(proj, MINE_3, visible);
  // jeton pose A COTE de la mine, DECALE VERS L'INTERIEUR du Soudan (Jebel Amer est a l'ouest, pres du
  // Tchad -> decalage droite+bas pour rester dans le territoire, retour Aziz 2026-07-19).
  const pHemedti = pJebel ? { x: pJebel.x + 50, y: pJebel.y + 30 } : null;

  const fadeIn = interpolate(frame, [0, 12], [0, 1], clampB);

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="atmoB2" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="94%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="oceanB2" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
          </defs>

          <circle cx={W / 2} cy={H / 2} r={GLOBE_R * scaleMul + 26} fill="url(#atmoB2)" />
          <path d={sphere} fill="url(#oceanB2)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

          {feats.map((f, i) => {
            const name = f.properties.name;
            if (name === "Sudan") return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={i} d={d} fill={t.land} stroke={borderColor} strokeWidth={borderW} strokeOpacity={borderOp} />;
          })}
          {sudan && (() => {
            const d = path(sudan as any);
            return d ? <path d={d} fill={t.sudanFill} fillOpacity={0.95} stroke={borderColor} strokeWidth={borderW + 0.6} strokeOpacity={Math.min(1, borderOp + 0.08)} /> : null;
          })()}

          {/* trait fin mine -> jeton Hemedti (beat 2bis) */}
          {frame >= TL.hemedti && pJebel && pHemedti && (
            <line x1={pJebel.x} y1={pJebel.y} x2={pHemedti.x} y2={pHemedti.y} stroke="#3A2A18" strokeWidth={1.4} opacity={0.5 * interpolate(frame, [TL.hemedti, TL.hemedti + 14], [0, 1], clampB)} />
          )}
        </svg>

        {/* sprites + portrait en overlay HTML (positionnes aux coords projetees) */}
        {frame >= TL.minesOr && pJebel && <MineSprite x={pJebel.x} y={pJebel.y} appear={TL.minesOr} frame={frame} size={130} />}
        {frame >= TL.minesOr + 7 && pMine2 && <MineSprite x={pMine2.x} y={pMine2.y} appear={TL.minesOr + 7} frame={frame} size={112} fade={0.9} />}
        {frame >= TL.minesOr + 14 && pMine3 && <MineSprite x={pMine3.x} y={pMine3.y} appear={TL.minesOr + 14} frame={frame} size={108} fade={0.85} />}
        {frame >= TL.hemedti && pHemedti && <PortraitToken x={pHemedti.x} y={pHemedti.y} appear={TL.hemedti} frame={frame} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SoudanActe3GlobeMinesProto;
