// ProtoInsertMatiereConduite — PROTOTYPE R&D (2026-08-14), JETABLE.
//
// But : voir en conditions réelles un insert H3 "matière" (gaz qui bouillonne dans une coupe de
// conduite) posé sur la carte D3 du Gazoduc. Teste la famille d'insert n°1 (LA MATIÈRE) : ce qui
// transite dans le tuyau, qu'une carte ne montre jamais — une carte n'affiche qu'une ligne.
//
// Chaîne de production de l'asset (validée, cf memory/tools/minimax-h3-comfy-cloud.md § INSERT
// MATIÈRE) : Gemini 3.1 Flash image (composition verrouillée) -> MiniMax H3 R2V (turbulence seule).
// Mesuré sur le clip : décor 0.13 vs matière 9.74 = 75x de séparation, boucle 0.4x (Loop sans
// crossfade), aucun écran noir. prompt_id 7e99bcbb.
//
// Réutilise le pattern d'intégration déjà validé par GazoducH3IntegrationTestReal (carte assombrie
// + pin ancré géographiquement + connecteur tracé + cadre vidéo), avec UNE différence assumée :
// l'insert est ancré sur le TRACÉ du gazoduc, pas sur une ville — c'est la conduite qu'on ouvre.
//
// ⚠️ PROTOTYPE : ne pas importer depuis un Acte. À supprimer si non retenu.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Loop, staticFile, interpolate, useCurrentFrame } from "remotion";
import geoData from "../d3-16x9/gazoducGeoElargie.json";

export const PROTO_INSERT_MATIERE_FRAMES = 300; // 10s @30fps

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

const LAND = "#102E4D";
const LAND_STROKE = "#5E789A";
const CYAN = "#2CD7FF";
const GOLD = "#D9A13B";

// Durée réelle du clip H3 : 141 frames @24fps = 5.875s. En Loop on reste sous cette durée pour
// ne jamais toucher la dernière frame (garde-fou "écran noir en fin de clip" documenté 2x sur H3).
const CLIP_LOOP_FRAMES = Math.floor(5.8 * FPS);

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);

// ===== Géométrie TSGP RÉELLE — reprise à l'identique de GazoducActe3CarteTSGP.tsx =====
// Le tracé passe par le NIGER (Nigeria -> Niger -> Algérie), c'est le tracé Trans-Saharan réel.
// V1 de ce proto tirait un segment droit Nigeria->Algérie entre centroïdes : faux tracé, violait
// geo-zero-approximation. Helpers (bboxCentroid/ctrlOf) copiés depuis l'Acte 3 plutôt qu'extraits
// en brique partagée — un seul cas d'usage ne justifie pas encore l'abstraction.
const bboxCache = new Map<string, [number, number]>();
function bboxCentroid(d: string): [number, number] {
  const hit = bboxCache.get(d);
  if (hit) return hit;
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const c: [number, number] = [(minX + maxX) / 2, (minY + maxY) / 2];
  bboxCache.set(d, c);
  return c;
}
function ctrlOf(a: [number, number], b: [number, number], bendPerp: number, bendAlong = 0.5): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * bendAlong, my = a[1] + (b[1] - a[1]) * bendAlong;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * bendPerp, my + (dx / len) * bendPerp];
}
function pointOnQuad(a: [number, number], ctrl: [number, number], b: [number, number], t: number): [number, number] {
  return [
    (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0],
    (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1],
  ];
}

const TSGP_COUNTRY_NAMES = ["Nigeria", "Niger", "Algeria"] as const;
const tsgpCountries = TSGP_COUNTRY_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const tsgpJalons: [number, number][] = tsgpCountries.map((c) => bboxCentroid(c.d));
// Même courbure que l'Acte 3 (bendPerp 14) pour que le proto et l'acte parlent la même langue.
const TSGP_BEND = 14;
const tsgpSegs = tsgpJalons.slice(0, -1).map((a, i) => {
  const b = tsgpJalons[i + 1];
  return { a, b, ctrl: ctrlOf(a, b, TSGP_BEND, 0.5) };
});
const tsgpPathD = tsgpSegs
  .map((s, i) => `${i === 0 ? `M ${s.a[0]} ${s.a[1]} ` : ""}Q ${s.ctrl[0]} ${s.ctrl[1]} ${s.b[0]} ${s.b[1]}`)
  .join(" ");

// Point d'ouverture de la conduite : sur le tracé RÉEL, dans le segment Niger->Algérie (plein Sahara),
// donc un point qui existe vraiment sur la courbe et non une interpolation entre deux centroïdes.
const TAP_SEG = tsgpSegs[1];
const TAP: [number, number] = pointOnQuad(TAP_SEG.a, TAP_SEG.ctrl, TAP_SEG.b, 0.45);

type Cam = { scale: number; tx: number; ty: number };
function camFor(center: [number, number], scale: number): Cam {
  return { scale, tx: W / 2 - center[0] * scale, ty: H / 2 - center[1] * scale };
}
function lerpCam(a: Cam, b: Cam, t: number): Cam {
  return { scale: a.scale + (b.scale - a.scale) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t };
}

export const ProtoInsertMatiereConduite: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== Caméra : push-in continu vers le point d'ouverture, jamais figée =====
  const p = interpolate(frame, [0, S(3.2)], [0, 1], {
    ...clampB,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  // Zoom final ~2.0 (et non 3.4) : à 3.4 + décalage, le cadre finissait sur du Sahara vide, sans
  // aucun repère de pays autour du point d'ouverture. À 2.0 le Niger et le sud algérien restent
  // lisibles derrière l'insert — l'ancrage géographique survit au zoom.
  const camWide = camFor(TAP, 1.5);
  const camNearCentered = camFor(TAP, 2.0);
  // Décalage : on pousse le sujet vers la gauche pour laisser la moitié droite à l'insert.
  const camNear: Cam = { ...camNearCentered, tx: camNearCentered.tx - (0.5 - 0.3) * W };
  const camBase = lerpCam(camWide, camNear, p);

  // micro-dérive continue sous l'overlay (règle : rien de statique plus de 5s)
  const driftT = frame * 0.006;
  const cam: Cam = {
    scale: camBase.scale * (1 + interpolate(frame, [S(3.2), S(10)], [0, 0.04], clampB)),
    tx: camBase.tx + Math.sin(driftT) * 4,
    ty: camBase.ty + Math.cos(driftT * 0.7) * 3,
  };

  // ===== Timing de l'insert =====
  const inStart = S(3.0);
  const inEnd = S(9.4);

  // Voile 0.40 (et non 0.66) : sur un fond déjà sombre (#06172B), 0.66 effaçait la carte au lieu de
  // la reculer. L'insert se SUPERPOSE à la carte, il ne la remplace pas.
  const DIM_MAX = 0.4;
  const dimIn = interpolate(frame, [inStart, inStart + S(0.35)], [0, DIM_MAX], clampB);
  const dimOut = interpolate(frame, [inEnd - S(0.4), inEnd], [DIM_MAX, 0], clampB);
  const dimOpacity = frame < inEnd - S(0.4) ? dimIn : dimOut;

  const cardIn = interpolate(frame, [inStart + S(0.15), inStart + S(0.6)], [0, 1], clampB);
  const cardOut = interpolate(frame, [inEnd - S(0.35), inEnd], [1, 0], clampB);
  const cardOpacity = frame < inEnd - S(0.35) ? cardIn : cardOut;
  const cardScale = interpolate(cardIn, [0, 1], [0.94, 1]);

  const connectorDraw = interpolate(frame, [inStart + S(0.15), inStart + S(0.55)], [0, 1], clampB);

  // Le tracé du gazoduc se dessine avant l'ouverture (geste : la ligne existe, PUIS on l'ouvre)
  const pipeDraw = interpolate(frame, [S(0.6), S(2.6)], [0, 1], clampB);

  // Position écran du point d'ouverture (projection réelle, suit la caméra)
  const tapX = TAP[0] * cam.scale + cam.tx;
  const tapY = TAP[1] * cam.scale + cam.ty;

  // Sens de lecture (gaz qui MONTE vers le nord) : porté en SVG déterministe, pas négocié avec H3.
  // Le clip H3 fait bouillonner la matière sur place — c'est ce qu'il sait faire (turbulence) ;
  // la DIRECTION est de la géométrie, donc elle nous revient (règle de partage validée 2026-08-14).
  const FLOW_PERIOD = S(2.2);
  const flowT = (frame % FLOW_PERIOD) / FLOW_PERIOD;

  const cardLeft = 0.5;
  const cardTop = 0.235;
  const cardW = 0.4;
  const cardH = 0.44;

  return (
    <AbsoluteFill style={{ background: "#06172B" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {countries.map((c, i) => (
            <path
              key={i}
              d={c.d}
              fill={LAND}
              fillOpacity={0.62}
              stroke={LAND_STROKE}
              strokeWidth={1.1 / cam.scale}
            />
          ))}

          {/* Tracé TSGP réel (Nigeria -> Niger -> Algérie), dans le repère CARTE : il suit la
              projection comme les pays, au lieu d'être recalculé en coordonnées écran. */}
          <path
            d={tsgpPathD}
            stroke={GOLD}
            strokeWidth={3 / cam.scale}
            fill="none"
            opacity={0.85}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - pipeDraw}
            strokeLinecap="round"
          />

          {/* Sens de lecture : impulsions lumineuses qui remontent le tracé vers le nord.
              Géométrie déterministe (SVG), pas de la turbulence — H3 ne sait pas faire ça. */}
          {pipeDraw > 0.98 &&
            [0, 0.33, 0.66].map((offset) => {
              const t = (flowT + offset) % 1;
              const seg = tsgpSegs[t < 0.5 ? 0 : 1];
              const localT = t < 0.5 ? t * 2 : (t - 0.5) * 2;
              const [px, py] = pointOnQuad(seg.a, seg.ctrl, seg.b, localT);
              // fondu aux extrémités pour qu'aucune impulsion n'apparaisse/disparaisse brutalement
              const fade = Math.min(1, Math.min(t, 1 - t) * 6);
              return (
                <circle
                  key={`flow-${offset}`}
                  cx={px}
                  cy={py}
                  r={4 / cam.scale}
                  fill={CYAN}
                  opacity={0.9 * fade}
                />
              );
            })}
        </g>

        {/* Assombrissement — AVANT le pin/connecteur pour qu'ils traversent le voile */}
        <rect x={0} y={0} width={W} height={H} fill="rgba(0,8,18,1)" opacity={dimOpacity} />

        {/* Connecteur point d'ouverture -> cadre insert */}
        <path
          d={`M ${tapX} ${tapY} L ${tapX + W * 0.07} ${tapY - H * 0.05} L ${W * cardLeft} ${
            H * (cardTop + cardH * 0.5)
          }`}
          stroke={GOLD}
          strokeWidth={1.5}
          strokeDasharray="5 5"
          fill="none"
          opacity={connectorDraw > 0.05 ? 0.95 : 0}
          pathLength={1}
          strokeDashoffset={1 - connectorDraw}
        />

        {/* Marqueur du point d'ouverture, pulse sinusoïdal continu (jamais de reset brutal) */}
        <g transform={`translate(${tapX} ${tapY})`}>
          {(() => {
            const per = S(1.6);
            const t1 = (frame % per) / per;
            const t2 = ((frame + per / 2) % per) / per;
            return (
              <>
                <circle r={12 + t1 * 34} fill="none" stroke={CYAN} strokeWidth={1.5} opacity={(1 - t1) * 0.6} />
                <circle r={12 + t2 * 34} fill="none" stroke={CYAN} strokeWidth={1.5} opacity={(1 - t2) * 0.6} />
              </>
            );
          })()}
          <circle
            r={44}
            fill="none"
            stroke={GOLD}
            strokeWidth={1.5}
            strokeDasharray="5 5"
            opacity={0.92}
            transform={`rotate(${frame * 0.66})`}
          />
          <circle r={9} fill="#06172B" stroke={CYAN} strokeWidth={3} />
          <circle r={4} fill={CYAN} />
        </g>
      </svg>

      {/* ===== Cadre insert : la coupe de conduite ===== */}
      <div
        style={{
          position: "absolute",
          left: `${cardLeft * 100}%`,
          top: `${cardTop * 100}%`,
          width: `${cardW * 100}%`,
          height: `${cardH * 100}%`,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          background: "rgba(7, 24, 45, 0.96)",
          border: `1.5px solid ${CYAN}`,
          borderRadius: 6,
          boxShadow: "0 0 22px rgba(44, 215, 255, 0.22)",
          padding: "2.6% 3%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            background: "rgba(14, 32, 48, 0.95)",
            border: `1.4px solid ${GOLD}`,
            borderRadius: 4,
            padding: "6px 14px",
            color: "#FFD06A",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.06em",
            marginBottom: 14,
          }}
        >
          COUPE DE LA CONDUITE
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            flex: "1 1 auto",
            borderRadius: 4,
            overflow: "hidden",
            border: `1px solid ${CYAN}44`,
            background: "#0A1B2E",
          }}
        >
          <Loop durationInFrames={CLIP_LOOP_FRAMES}>
            <OffthreadVideo
              src={staticFile("_rnd/minimax-h3-tests/insert-matiere/conduite-gaz-r2v-v1.mp4")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
            />
          </Loop>

          {/* ===== Sens de transit gauche->droite, ajouté PAR-DESSUS le clip =====
              Le clip H3 fait bouillonner le gaz sur place malgré un prompt directionnel explicite.
              Plutôt que de re-négocier la direction avec le modèle (coût GPU, résultat incertain),
              on la porte en déterministe : une bande claire balaie la coupe dans le sens du flux.
              Applique la règle de partage : turbulence = H3, direction = nous. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `linear-gradient(90deg,
                rgba(44,215,255,0) 0%,
                rgba(44,215,255,0.30) 45%,
                rgba(190,245,255,0.42) 50%,
                rgba(44,215,255,0.30) 55%,
                rgba(44,215,255,0) 100%)`,
              backgroundSize: "55% 100%",
              backgroundRepeat: "no-repeat",
              // -55% -> 100% : la bande entre par la gauche et sort par la droite, en boucle continue
              backgroundPositionX: `${interpolate(flowT, [0, 1], [-55, 100])}%`,
              mixBlendMode: "screen",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "4%",
            color: "#EAF6FF",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 17,
            lineHeight: 1.45,
          }}
        >
          30 milliards de m<sup>3</sup> par an,
          <br />
          sous 100 bars de pression.
        </div>
      </div>
    </AbsoluteFill>
  );
};
