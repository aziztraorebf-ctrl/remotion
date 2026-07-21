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

// Keyframes camera de l'insert (T = ancrages relatifs). startScaleMul = zoom d'entree (cale le raccord
// avec la fin de la Section 1 Mapbox, zoom 5.75). Overridable via inputProps pour le calage.
export const INSERT_START_SCALE_MUL = 6.5;

// PortraitToken — jeton-visage faction (recette EXACTE du Mapbox SoudanToken : cercle parchemin +
// bordure faction + portrait clippe rond + ombre). Coherence totale avec la Section 1 Mapbox (memes
// visages Hemedti/al-Burhan). HTML overlay positionne aux coords projetees du globe.
// Personnes NOMMEES = vrais visages (audit jetons 2026-07-21) : le jeton RSF = Hemedti, le jeton
// SAF = al-Burhan. On affiche leur portrait reel, pas le sprite generique portrait-rsf/saf (soldat anonyme).
const PORTRAIT: Record<"rsf" | "saf", { sprite: string; border: string }> = {
  rsf: { sprite: "portrait-hemeti", border: "#B14B3C" },
  saf: { sprite: "portrait-burhan", border: "#3E6E9E" },
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

// SourcePlaque — bandeau SOURCE discret, bas-droite, 1 ligne, style sobre parchemin (retour Aziz
// 2026-07-19 : "afficher les sources des gros faits ~1.5-2s puis disparaitre"). Sources REELLES issues
// du fact-check jury du 2026-07-09 (soudan-midform-ACTE3-JURY-VERDICTS.md). Fade in/out ~1.8s a l'ecran.
const SourcePlaque: React.FC<{ text: string; appear: number; frame: number; holdFrames?: number }> = ({ text, appear, frame, holdFrames = 54 }) => {
  if (frame < appear || frame > appear + holdFrames + 12) return null;
  // fade in 10f, hold, fade out 12f. holdFrames=54 -> ~1.8s a plein.
  const op = interpolate(frame, [appear, appear + 10, appear + holdFrames, appear + holdFrames + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", right: 40, bottom: 40, opacity: op, pointerEvents: "none",
      background: "rgba(242,229,200,0.86)", border: "1px solid rgba(58,42,24,0.35)", borderRadius: 4,
      padding: "5px 12px", maxWidth: 620, boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, color: "#3A2A18",
        letterSpacing: 0.2, whiteSpace: "nowrap" }}>
        {text}
      </span>
    </div>
  );
};

// DroneSprite — sprite drone PNG (vehicule) qui glisse le long d'un flux RETOUR (armes), oriente dans
// le sens du vol (recette Mapbox : rotate angle+90, le sprite pointe vers le haut au repos). Overlay HTML.
// Sprites 1408x768 (ratio ~1.83). faction rsf/saf = drone livre au camp correspondant.
const DroneSprite: React.FC<{ x: number; y: number; angle: number; faction: "rsf" | "saf"; size?: number }> = ({ x, y, angle, faction, size = 82 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: size, height: size * (768 / 1408),
      transform: `translate(-50%,-50%) rotate(${angle + 90}deg)`, pointerEvents: "none",
      filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))" }}>
    <img src={staticFile(`_shared/sprites/warmap/drone-${faction}-td.png`)}
      style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
  </div>
);

export const SoudanActe3GlobeInsert: React.FC<{ startScaleMul?: number }> = ({ startScaleMul = INSERT_START_SCALE_MUL }) => {
  const frame = useCurrentFrame();

  // ===== CAMERA CONTINUE =====
  const CAM = buildInsertCam(T as any, startScaleMul);
  const cam = camAt(CAM, frame);
  // zoom-pivot ponctuel sur Dubai a l'arrivee de l'or (beat 4, transformation) — se cumule au scale cam.
  const zoomPivot = interpolate(frame, [T.b4RevientForme - 20, T.b4RevientForme + 10, T.b4AchetentDrones, T.b4AchetentDrones + 30], [0, 1, 1, 0], clampB);
  const eZoom = zoomPivot < 0.5 ? 2 * zoomPivot * zoomPivot : 1 - Math.pow(-2 * zoomPivot + 2, 2) / 2;
  const scaleZoom = 1 + 0.7 * eZoom;
  const camLon = cam.lon + (GEO.dubai[0] - cam.lon) * 0.45 * eZoom;
  const camLat = cam.lat + (GEO.dubai[1] - cam.lat) * 0.45 * eZoom;

  const rotLambda = -camLon;
  const rotLat = -camLat;
  const globeR = GLOBE_R * cam.scaleMul * scaleZoom; // rayon effectif du globe a l'ecran (pour ombre/halo)
  const proj = orthoAt(rotLambda, rotLat).scale(globeR);
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

  // #2 REVEAL SYSTEME (beat 6) : au "meme or paie les deux camps", les pays NON-impliques s'assombrissent
  // pour faire ressortir le triangle Soudan-EAU-Turquie-Egypte + les flux. Monte, se maintient, PUIS
  // s'estompe pendant la replongee de sortie (sinon le Soudan arriverait assombri au raccord Acte 4).
  const systemReveal = interpolate(frame, [T.b6Start, T.b6MemeOrPaie, T.b7PauseAvantQuestion, T.b7Question], [0, 0.55, 0.5, 0], clampB);

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
  // OR aller = flux lumineux abstrait (objet inerte, ne "vole" pas). RETOURS armes = SPRITE DRONE
  // oriente (vehicule, glisse credible — doctrine + convergence Gemini/Kimi). On calcule aussi l'angle
  // du trajet (point en avance t+eps) pour orienter le sprite dans le sens du vol.
  const orMarker = frame >= T.b3Start && frame <= T.b4RevientForme ? pointAlongArc(proj, GEO.jebelAmer, GEO.dubai, orT, visible) : null;
  const droneAngle = (a: LonLat, b: LonLat, tt: number, pos: { x: number; y: number }) => {
    const ahead = pointAlongArc(proj, a, b, Math.min(1, tt + 0.03), visible);
    return ahead ? Math.atan2(ahead.y - pos.y, ahead.x - pos.x) * (180 / Math.PI) : 0;
  };
  const retPos = frame >= T.b4RevientForme && frame <= T.b4JetonRsfPulse ? pointAlongArc(proj, GEO.dubai, GEO.rsfToken, retT, visible) : null;
  const retMarker = retPos ? { ...retPos, angle: droneAngle(GEO.dubai, GEO.rsfToken, retT, retPos) } : null;
  const turkPos = frame >= T.b5TurquieBayraktar && frame <= T.b5EnEchange ? pointAlongArc(proj, GEO.ankara, GEO.safToken, turkT, visible) : null;
  const turkMarker = turkPos ? { ...turkPos, angle: droneAngle(GEO.ankara, GEO.safToken, turkT, turkPos) } : null;
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
            {/* halo atmospherique renforce (#3 volume) : plus large + plus present */}
            <radialGradient id="atmoI" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="93%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity + 0.15} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="oceanI" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
            {/* #3 OMBRE SPHERIQUE : lumiere haut-gauche, ombre bas-droite = volume 3D. userSpaceOnUse
                pour centrer sur le globe reel (centre W/2,H/2 decale vers le haut-gauche, rayon = globe). */}
            <radialGradient id="sphereShade" gradientUnits="userSpaceOnUse"
              cx={W / 2 - globeR * 0.24} cy={H / 2 - globeR * 0.3} r={globeR * 1.35}>
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="58%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0.5" />
            </radialGradient>
            <clipPath id="sphereClip"><path d={sphere} /></clipPath>
          </defs>

          {/* halo atmospherique (double couche pour un halo plus riche) */}
          <circle cx={W / 2} cy={H / 2} r={globeR + 34} fill="url(#atmoI)" />
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
          {/* OR aller + OR->Egypte = flux lumineux abstrait (objet inerte). Les RETOURS armes sont des
              SPRITES DRONE (overlay HTML plus bas), pas des points. */}
          {travelDot(orMarker, t.flowGold)}
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

          {/* #2 VOILE REVEAL SYSTEME (beat 6) : assombrit le globe uniformement pour faire ressortir
              drapeaux/flux/portraits (qui sont au-dessus). Clippe a la sphere. */}
          {systemReveal > 0.01 && (
            <rect x={0} y={0} width={W} height={H} fill="#05070d" opacity={systemReveal * 0.5} clipPath="url(#sphereClip)" />
          )}

          {/* #3 OMBRE SPHERIQUE (volume) : par-dessus tout le contenu, clippee a la sphere. Lumiere
              haut-gauche / ombre bas-droite = le globe a du corps, ne trahit plus l'aplat vectoriel. */}
          <rect x={0} y={0} width={W} height={H} fill="url(#sphereShade)" clipPath="url(#sphereClip)" pointerEvents="none" />

        </svg>

        {/* jetons factions = PORTRAITS (overlay HTML, recette Mapbox, ancres coords projetees) */}
        {pRSF && <PortraitToken x={pRSF.x} y={pRSF.y} faction="rsf" pulse={rsfPulse} />}
        {pSAF && <PortraitToken x={pSAF.x} y={pSAF.y} faction="saf" pulse={safPulse} />}

        {/* DRONES (flux retour armes) — sprites orientes, overlay HTML */}
        {retMarker && <DroneSprite x={retMarker.x} y={retMarker.y} angle={retMarker.angle} faction="rsf" />}
        {turkMarker && <DroneSprite x={turkMarker.x} y={turkMarker.y} angle={turkMarker.angle} faction="saf" />}

        {/* PLAQUES SOURCES (fact-check jury 2026-07-09) — 3 faits sensibles, frames relatives a l'insert.
            Amnesty=634 (drones documentes) · Bayraktar=1134 (contrat Turquie->SAF) · Egypte=1754 (or SAF hors-circuit). */}
        <SourcePlaque frame={frame} appear={634} text="Amnesty International, mai 2025" />
        <SourcePlaque frame={frame} appear={1133} text="Washington Post, ADF, Euronews" />
        <SourcePlaque frame={frame} appear={1754} text="Chatham House, The Soufan Center" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SoudanActe3GlobeInsert;
