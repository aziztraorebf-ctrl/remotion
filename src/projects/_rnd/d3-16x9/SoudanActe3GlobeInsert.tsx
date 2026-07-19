// INSERT GLOBE D3 — Soudan Acte 3 "Suivre l'or", beats 3 a 7 (~87s).
//
// REMPLACE la portion flux [frame 1166 -> 3773] de l'Acte 3 Mapbox (FINAL, validé). La Section 1
// (interieur Soudan, beats 1-2-2bis) reste en Mapbox. Le globe entre quand l'or QUITTE le pays et
// sort a l'ouverture de l'Acte 4. Palette MIXTE validee Aziz (terres kaki + ocean bleu + frontieres
// premium). Camera CONTINUE (globeCamera), audio = portion du fichier FULL (deja cale whisper-align).
//
// Vocabulaire (tout prouve 2026-07-19) : arcs geoInterpolate (geoArc) · reactions cible combinees
// (onde + illumination + objet) · drapeaux clippes dans le territoire (GlobeFlagFill) · zoom-pivot /
// jeton-drapeau flottant selon le beat · jetons factions abstraits.
//
// ⚠️ SQUELETTE DE CALAGE : ce fichier valide camera + audio + raccords + timing. Le detail visuel de
// chaque beat sera raffine ensuite (objets Suakin, pictos factions, densification beat 6).
import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { arcPathD, pointAlongArc, projectPoint, GEO, type LonLat } from "./geoArc";
import { THEMES, GlobeFlagFill, DestPoint, ShockRing } from "./SoudanActe3GlobeProto16x9";
import { buildInsertCam, camAt } from "./globeCamera";
import { T, INSERT_FRAMES, AUDIO_FULL, AUDIO_START_FROM } from "./soudanActe3GlobeInsertTiming";

export const SOUDAN_A3_INSERT_FRAMES = INSERT_FRAMES; // ~2607

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const t = THEMES.mixte;

// Keyframes camera de l'insert (T = ancrages relatifs).
const CAM = buildInsertCam(T as any);

// PortraitToken — jeton-visage faction (recette EXACTE du Mapbox SoudanToken : cercle parchemin +
// bordure faction + portrait clippe rond + ombre). Coherence totale avec la Section 1 Mapbox (memes
// visages Hemedti/al-Burhan). HTML overlay positionne aux coords projetees du globe.
const PORTRAIT: Record<"rsf" | "saf", { sprite: string; border: string }> = {
  rsf: { sprite: "portrait-rsf", border: "#B14B3C" },
  saf: { sprite: "portrait-saf", border: "#3E6E9E" },
};
const PortraitToken: React.FC<{ x: number; y: number; faction: "rsf" | "saf"; pulse: number }> = ({ x, y, faction, pulse }) => {
  const D = 64;
  const p = PORTRAIT[faction];
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
      {/* pulse geo-ancre (halo qui bat a l'arrivee du flux) */}
      {pulse > 0 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", width: D + 60 * pulse, height: D + 60 * pulse,
          transform: "translate(-50%,-50%)", borderRadius: "50%", border: `2.5px solid ${p.border}`,
          opacity: 0.7 * (1 - pulse) }} />
      )}
      {/* ombre portee */}
      <div style={{ position: "absolute", left: "50%", top: "72%", width: D * 0.82, height: D * 0.26,
        transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
      <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6",
        border: `3.5px solid ${p.border}`, boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
        <img src={staticFile(`_shared/sprites/warmap/${p.sprite}.png`)}
          style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
            transform: "translate(-8%, 2%)", display: "block" }} />
      </div>
    </div>
  );
};

export const SoudanActe3GlobeInsert: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== CAMERA CONTINUE =====
  const cam = camAt(CAM, frame);
  // zoom-pivot ponctuel sur Dubai a l'arrivee de l'or (beat 4, transformation) — se cumule au scale cam.
  const zoomPivot = interpolate(frame, [T.b4RevientForme - 20, T.b4RevientForme + 10, T.b4AchetentDrones, T.b4AchetentDrones + 30], [0, 1, 1, 0], clampB);
  const eZoom = zoomPivot < 0.5 ? 2 * zoomPivot * zoomPivot : 1 - Math.pow(-2 * zoomPivot + 2, 2) / 2;
  const scaleZoom = 1 + 0.7 * eZoom;
  const camLon = cam.lon + (GEO.dubai[0] - cam.lon) * 0.45 * eZoom;
  const camLat = cam.lat + (GEO.dubai[1] - cam.lat) * 0.45 * eZoom;

  const rotLambda = -camLon;
  const rotLat = -camLat;
  const proj = orthoAt(rotLambda, rotLat).scale(GLOBE_R * cam.scaleMul * scaleZoom);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const sudan = featureByName("Sudan");
  const uae = featureByName("United Arab Emirates");
  const turkey = featureByName("Turkey");
  const egypt = featureByName("Egypt");

  // ===== FLUX (progress cale sur le timing des beats) =====
  // B3 : or Jebel Amer -> Dubai
  const orReveal = interpolate(frame, [T.b3Start, T.b3PremierImportateur], [0, 1], clampB);
  const orT = orReveal;
  const dubaiOn = interpolate(frame, [T.b3Start, T.b3Start + 15], [0, 1], clampB);
  const dubaiFlash = interpolate(frame, [T.b4RevientForme, T.b4RevientForme + 25], [0, 1], clampB);
  // B4 : transformation + retour drones -> RSF
  const retReveal = interpolate(frame, [T.b4RevientForme, T.b4JetonRsfPulse], [0, 1], clampB);
  const retT = retReveal;
  const rsfPulse = interpolate(frame, [T.b4JetonRsfPulse, T.b4JetonRsfPulse + 45], [0, 1], clampB);
  // B5 : Ankara -> SAF
  const ankaraOn = interpolate(frame, [T.b5Start, T.b5Start + 15], [0, 1], clampB);
  const turkReveal = interpolate(frame, [T.b5TurquieBayraktar, T.b5EnEchange], [0, 1], clampB);
  const turkT = turkReveal;
  const safPulse = interpolate(frame, [T.b5EnEchange, T.b5EnEchange + 45], [0, 1], clampB);
  const suakinOn = interpolate(frame, [T.b5SuakinNomme, T.b5SuakinNomme + 15], [0, 1], clampB);
  // B5bis : or SAF -> Egypte
  const egReveal = interpolate(frame, [T.b5bisRouteNordEgypte, T.b5bisEnd], [0, 1], clampB);
  const egT = egReveal;

  // ===== REACTIONS CIBLE (drapeaux + illumination) =====
  const uaeLight = interpolate(frame, [T.b3PremierImportateur - 4, T.b3PremierImportateur + 18, T.b6Start], [0, 1, 0.88], clampB);
  const shockDubai = interpolate(frame, [T.b3PremierImportateur, T.b3PremierImportateur + 45], [0, 1], clampB);
  const hangarDubai = interpolate(frame, [T.b3PremierImportateur + 16, T.b3PremierImportateur + 36], [0, 1], clampB);
  const turkeyLight = interpolate(frame, [T.b5TurquieBayraktar - 4, T.b5TurquieBayraktar + 18, T.b6Start], [0, 1, 0.85], clampB);
  const egyptLight = interpolate(frame, [T.b5bisRouteNordEgypte - 4, T.b5bisRouteNordEgypte + 18, T.b6Start], [0, 1, 0.8], clampB);

  // ===== ARCS (d) =====
  const orArcD = arcPathD(proj, path, GEO.jebelAmer, GEO.dubai, orReveal);
  const orGhost = frame > T.b4RevientForme ? arcPathD(proj, path, GEO.jebelAmer, GEO.dubai, 1) : "";
  const retArcD = arcPathD(proj, path, GEO.dubai, GEO.rsfToken, retReveal);
  const turkArcD = arcPathD(proj, path, GEO.ankara, GEO.safToken, turkReveal);
  const egArcD = arcPathD(proj, path, GEO.safToken, GEO.cairo, egReveal);

  // marqueurs voyageurs (null si derriere le globe / hors fenetre)
  const orMarker = frame >= T.b3Start && frame <= T.b4RevientForme ? pointAlongArc(proj, GEO.jebelAmer, GEO.dubai, orT, visible) : null;
  const retMarker = frame >= T.b4RevientForme && frame <= T.b4JetonRsfPulse ? pointAlongArc(proj, GEO.dubai, GEO.rsfToken, retT, visible) : null;
  const turkMarker = frame >= T.b5TurquieBayraktar && frame <= T.b5EnEchange ? pointAlongArc(proj, GEO.ankara, GEO.safToken, turkT, visible) : null;
  const egMarker = frame >= T.b5bisRouteNordEgypte && frame <= T.b5bisEnd ? pointAlongArc(proj, GEO.safToken, GEO.cairo, egT, visible) : null;

  // points fixes
  const pDubai = projectPoint(proj, GEO.dubai, visible);
  const pAnkara = projectPoint(proj, GEO.ankara, visible);
  const pSuakin = projectPoint(proj, GEO.suakin, visible);
  const pRSF = projectPoint(proj, GEO.rsfToken, visible);
  const pSAF = projectPoint(proj, GEO.safToken, visible);
  const pJebel = projectPoint(proj, GEO.jebelAmer, visible);

  const fadeIn = interpolate(frame, [0, 12], [0, 1], clampB);

  const arcStroke = (d: string, color: string, op = 1) =>
    d ? (
      <>
        <path d={d} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6} strokeLinecap="round" opacity={0.6 * op} />
        <path d={d} fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" opacity={0.16 * op} />
        <path d={d} fill="none" stroke={color} strokeWidth={4.4} strokeLinecap="round" opacity={op} />
        <path d={d} fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="7 12" strokeDashoffset={-(frame * 0.9) % 19} opacity={0.55 * op} />
      </>
    ) : null;

  const travelDot = (pos: { x: number; y: number } | null, color: string) =>
    pos ? (
      <g transform={`translate(${pos.x} ${pos.y})`}>
        <circle r={18} fill={color} opacity={0.22} />
        <circle r={11} fill={color} opacity={0.35} />
        <circle r={8.5} fill={color} stroke="#fff" strokeWidth={2} />
      </g>
    ) : null;

  const countryPath = (f: any, key: string) => {
    const d = path(f as any);
    if (!d) return null;
    return <path key={key} d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
  };

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      {/* AUDIO — portion [1166 -> 3773] du fichier FULL (deja cale). */}
      <Audio src={staticFile(AUDIO_FULL)} startFrom={AUDIO_START_FROM} />

      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="atmoI" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="94%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="oceanI" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
          </defs>

          <circle cx={W / 2} cy={H / 2} r={GLOBE_R * cam.scaleMul * scaleZoom + 26} fill="url(#atmoI)" />
          <path d={sphere} fill="url(#oceanI)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

          {/* pays neutres */}
          {feats.map((f, i) => {
            const n = f.properties.name;
            if (n === "Sudan" || n === "United Arab Emirates" || n === "Turkey" || n === "Egypt") return null;
            return countryPath(f, `c${i}`);
          })}
          {/* pays-cibles : base neutre + drapeau qui se materialise a l'arrivee du flux */}
          {uae && <g>{countryPath(uae, "uae")}<GlobeFlagFill feature={uae} proj={proj} path={path} flagCode="ae" reveal={uaeLight} glow={t.landActiveStroke} /></g>}
          {turkey && <g>{countryPath(turkey, "tr")}<GlobeFlagFill feature={turkey} proj={proj} path={path} flagCode="tr" reveal={turkeyLight} glow={t.landActiveStroke} /></g>}
          {egypt && <g>{countryPath(egypt, "eg")}<GlobeFlagFill feature={egypt} proj={proj} path={path} flagCode="eg" reveal={egyptLight} glow={t.landActiveStroke} /></g>}
          {/* Soudan clair au centre */}
          {sudan && (() => { const d = path(sudan as any); return d ? <path d={d} fill={t.sudanFill} fillOpacity={0.95} stroke={t.sudanStroke} strokeWidth={1.6} /> : null; })()}

          {/* ARCS */}
          {orGhost && arcStroke(orGhost, t.flowGold, 0.35)}
          {arcStroke(orArcD, t.flowGold, 1)}
          {arcStroke(retArcD, t.flowMetal, 1)}
          {arcStroke(turkArcD, t.flowMetal, 1)}
          {arcStroke(egArcD, "#C9973A", 0.85)}

          {/* marqueurs voyageurs */}
          {travelDot(orMarker, t.flowGold)}
          {travelDot(retMarker, t.flowMetal)}
          {travelDot(turkMarker, t.flowMetal)}
          {travelDot(egMarker, "#C9973A")}

          {/* onde de choc Dubai */}
          {pDubai && <ShockRing x={pDubai.x} y={pDubai.y} shockT={shockDubai} color={t.flowGold} />}

          {/* destinations */}
          {pDubai && <DestPoint x={pDubai.x} y={pDubai.y} label="Dubai" on={dubaiOn} flash={dubaiFlash} t={t} hangarIn={hangarDubai} />}
          {pAnkara && <DestPoint x={pAnkara.x} y={pAnkara.y} label="Ankara" on={ankaraOn} flash={0} t={t} />}
          {pSuakin && <DestPoint x={pSuakin.x} y={pSuakin.y} label="Suakin" on={suakinOn} flash={0} t={t} />}

          {/* Turquie et Egypte : le DRAPEAU sur le territoire suffit (assez grands) — pas de jeton
              flottant redondant (desencombre le beat systeme). Le jeton flottant reste dispo dans la
              biblio (FlagToken) pour un pays trop petit/hors-champ si besoin plus tard. */}

          {/* mine Jebel Amer (origine) */}
          {pJebel && (
            <g transform={`translate(${pJebel.x} ${pJebel.y})`} opacity={interpolate(frame, [0, 12], [0, 1], clampB)}>
              <circle r={16} fill={t.flowGold} opacity={0.28} />
              <circle r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />
            </g>
          )}

        </svg>

        {/* jetons factions = PORTRAITS (overlay HTML, recette Mapbox, ancres coords projetees) */}
        {pRSF && <PortraitToken x={pRSF.x} y={pRSF.y} faction="rsf" pulse={rsfPulse} />}
        {pSAF && <PortraitToken x={pSAF.x} y={pSAF.y} faction="saf" pulse={safPulse} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SoudanActe3GlobeInsert;
