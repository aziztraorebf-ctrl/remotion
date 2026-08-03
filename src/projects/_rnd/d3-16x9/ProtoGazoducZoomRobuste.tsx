// PROTO ISOLE — preuve robuste que le globe D3 zoome comme UN SEUL BLOC RIGIDE (sphere + contenu
// solidaires), sans reproduire le bug documente sur GazoducActe1Hook.tsx (5 cercles de sphere
// restes sur GLOBE_R brut pendant que le contenu suivait cam.scaleMul -> silhouette figee 85s).
//
// Reference canonique copiee a l'identique (discipline, pas reinvention) : SoudanActe6Globe.tsx
// ligne ~83 : `const globeR = GLOBE_R * cam.scaleMul` calcule UNE FOIS, reutilise PARTOUT (clipPath,
// cercle atmosphere, gradient ocean, gradient d'ombre, rayon de la sphere elle-meme).
//
// Duree ~10s (300f @30fps). Zoom TRES AMPLE : scaleMul 1.3 (planete large) -> 4.4 (plan tres serre,
// meme ordre de grandeur que Soudan Acte 6 qui atteint scaleMul 2.62 en hold, jusqu'a 4.4 en pointe
// Acte 5/Acte1). Nigeria colore (drapeau plaque via GlobeFlagFill, brique exacte reutilisee) doit
// rester plaque sur la sphere pendant tout le mouvement.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile } from "remotion";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { projectPoint, GEO, type LonLat } from "./geoArc";
import { THEMES, GlobeFlagFill, BorderPulse } from "./SoudanActe3GlobeProto16x9";
import { camAt, type CamKey } from "./globeCamera";

export const PROTO_GAZODUC_ZOOM_FRAMES = 300; // 10s @30fps

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const t = THEMES.mixte;

// Nigeria (centre approx pour la camera + cible du drapeau).
const NIGERIA: LonLat = [8.0, 9.5];

// Camera : depart vue large planetaire (scaleMul 1.3) -> plan tres serre sur le Nigeria (scaleMul 4.4).
// Amplitude alignee sur la reference validee Soudan (1.2->4.4, cf globeCamera.ts) — pas une fourchette
// plus timide.
const CAM: CamKey[] = [
  { frame: 0, lon: -20, lat: 10, scaleMul: 1.3 },
  { frame: 90, lon: -5, lat: 9.8, scaleMul: 2.2 },
  { frame: 200, lon: 6, lat: 9.6, scaleMul: 3.4 },
  { frame: 300, lon: NIGERIA[0], lat: NIGERIA[1], scaleMul: 4.4 },
];

export const ProtoGazoducZoomRobuste: React.FC = () => {
  const frame = useCurrentFrame();

  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;

  // ===== LA REGLE UNIQUE : globeR calcule UNE FOIS, reutilise PARTOUT ci-dessous =====
  const globeR = GLOBE_R * cam.scaleMul;

  const proj = orthoAt(rotLambda, rotLat).scale(globeR);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const nigeria = featureByName("Nigeria");

  const fadeIn = interpolate(frame, [0, 14], [0, 1], clampB);
  const nigeriaReveal = interpolate(frame, [20, 70], [0, 1], clampB);
  const pNigeria = nigeria ? projectPoint(proj, NIGERIA, visible) : null;

  const pulse = interpolate(frame, [20, 60], [0, 1], clampB);

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="pgAtmo" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="93%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity + 0.15} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pgOcean" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
            <radialGradient id="pgShade" gradientUnits="userSpaceOnUse"
              cx={W / 2 - globeR * 0.24} cy={H / 2 - globeR * 0.3} r={globeR * 1.35}>
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="58%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0.5" />
            </radialGradient>
            <clipPath id="pgSphereClip"><path d={sphere} /></clipPath>
          </defs>

          {/* halo atmospherique + ocean + graticule — TOUS pilotes par globeR (via le rayon de la
              projection elle-meme pour sphere/grat, et directement pour l'atmosphere/ombre) */}
          <circle cx={W / 2} cy={H / 2} r={globeR + 34} fill="url(#pgAtmo)" />
          <path d={sphere} fill="url(#pgOcean)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

          {/* pays neutres */}
          {feats.map((f, i) => {
            if (f.properties.name === "Nigeria") return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={`c${i}`} d={d} fill={t.land} stroke={t.landStroke}
              strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
          })}

          {/* Nigeria — drapeau plaque sur la sphere (brique GlobeFlagFill exacte, reutilisee) */}
          {nigeria && <GlobeFlagFill feature={nigeria} proj={proj} path={path} flagCode="ng" reveal={nigeriaReveal} glow="#FFC742" />}

          {nigeria && (() => {
            const d = path(nigeria as any);
            if (!d) return null;
            return <BorderPulse d={d} pulse={pulse} color="#FFC742" />;
          })()}

          {/* ombre spherique (volume) — clippee a la sphere, rayon derive de globeR */}
          <rect x={0} y={0} width={W} height={H} fill="url(#pgShade)" clipPath="url(#pgSphereClip)" pointerEvents="none" />
        </svg>

        {pNigeria && nigeriaReveal > 0.01 && (
          <div style={{ position: "absolute", left: pNigeria.x, top: pNigeria.y - 40, transform: "translate(-50%,-100%)",
            opacity: nigeriaReveal, color: t.labelFill, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700,
            textShadow: "0 2px 4px rgba(0,0,0,0.8)", whiteSpace: "nowrap", pointerEvents: "none" }}>
            Nigeria
          </div>
        )}
      </AbsoluteFill>

      {/* diagnostic a l'ecran : scaleMul + globeR courants (verif visuelle rapide en plus de la
          mesure objective post-render sur les frames extraites) */}
      <div style={{ position: "absolute", top: 20, left: 20, color: "#fff", fontFamily: "monospace",
        fontSize: 20, background: "rgba(0,0,0,0.5)", padding: "6px 12px", borderRadius: 4 }}>
        frame {frame} | scaleMul {cam.scaleMul.toFixed(2)} | globeR {Math.round(globeR)}px
      </div>
    </AbsoluteFill>
  );
};

export default ProtoGazoducZoomRobuste;
