/**
 * SceneComparaisonV3 — la lecon Norvege / Congo-Brazzaville / Botswana (Senegal Petrole & Gaz, V3-REFONTE, scene 2).
 *
 * Ecrite DEPUIS LA VOIX (force alignment V3 du segment 122->187.5s de narration-v3-VALIDEE.mp3 :
 * out/episodes/senegal-petrole-gaz/_audio-v3/forced-align-v3.json, loss faible — pas de re-Whisper).
 * Workflow : doctrine -> intention -> forme -> briques V5. Reprend l'architecture de Beat10 V1 (1 carte continue,
 * camera voyage Norvege->Congo->Botswana, dots sonar, nom pays + chiffre) et l'ELEVE au niveau V3 :
 *   - DRAPEAUX DRAPES (MapboxCountryFlagDecal) sur chaque pays au lieu d'un aplat uni terne (V1).
 *   - Carte d'OPPOSITION : plaque-verdict deportee (GeoCountryPlaque + leader fleche), couleur semantique
 *     (or = vertueux, rouge sourd = gache, vert = vertueux). 3 destins confrontes, pas juste situes.
 *   - punchline REGLES retravaillee (le mot frappe).
 *
 * INTENTION (1 verbe) : OPPOSER. Meme ressource, presque la meme epoque, 3 destins -> ce qui decide = les REGLES.
 *
 * Cale sur l'audio REEL (frame_scene = (t_abs - 122) * 30) :
 *   123.82 "Avant de juger" f56 · 129.49 "Norvege" f225 · 131.08 "1969" f272 · 135.92 "fonds souverain" f417
 *   143.08 "mille cinq cents milliards" f632 · 146.62 "280 000 $/hab" f739 · 150.34 "Congo-Brazzaville" f850
 *   155.90 "plus endettes" f1017 · 162.24 "Botswana" f1207 · 165.36 "diamants 1966" f1301 · 170.38 "institutions" f1451
 *   176.24 "Meme ressource" f1627 · 179.02 "Trois destins" f1711 · 184.34 "pas la ressource" f1870 · 186.68 "REGLES" f1940
 *
 * Anti-derive : tout overlay geo-ancre = map.project([lon,lat]) RECALCULE chaque frame (useCurrentFrame).
 */
import React, { useRef, useState } from "react";
import {
  AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import type mapboxgl from "mapbox-gl";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CartoSouverainV5 } from "../../../_shared/mapbox/CartoSouverainV5";
import { GeoCountryPlaque } from "../../../_shared/mapbox/GeoCountryPlaque";
import { MapboxCountryFlagDecal } from "../../../_shared/mapbox/MapboxCountryFlagDecal";
import { drawFlagCanvas } from "../../../_shared/mapbox/flagCanvas";

const { fontFamily: BEBAS } = loadBebas();

const AUDIO_START = 122; // la scene comparaison commence a 122s dans l'audio de l'episode
const NAVY = "#16213a", GOLD = "#c8a951", IVORY = "#f2efe6";
const ORANGE = "#b5544a"; // Congo — rouge sourd, non accusateur
const GREEN = "#3a8a70";  // Botswana
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

// ── coords reelles (point cle par pays) ───────────────────────────────────────
const NORVEGE: [number, number] = [4.50, 61.20];   // cote mer du Nord (offshore petrole 1969)
const CONGO: [number, number] = [11.86, -4.80];    // Pointe-Noire (petrole offshore)
const BOTSWANA: [number, number] = [24.73, -24.60];// Jwaneng (mine de diamants Debswana)
// bbox metropolitaine Norvege : Natural Earth "Norway" inclut Svalbard/Jan Mayen (tres au nord)
// -> sans clip, la metropole devient minuscule et le drapeau s'etale sur du vide. Clip sur le continent.
const NOR_BBOX: [number, number, number, number] = [4.0, 57.5, 31.5, 71.5];

// ── frontieres de phase (frames @30fps, segment 122->187.5s = 1965f) ──────────
const END = 1965;
// entrees pays (cale sur la voix)
const F_NOR = 200;   // plongee Norvege commence avant "Norvege" f225
const F_NOR_STAT1 = 600; // "1 500 Mds$" (voix f632)
const F_NOR_STAT2 = 720; // "280 000 $/hab" (voix f739)
const F_TRANS_AB = 820;  // pull-back, depart sud
const F_COG = 870;   // plongee Congo (voix "Congo" f850)
const F_TRANS_BC = 1180; // depart SE
const F_BWA = 1210;  // plongee Botswana (voix f1207)
const F_CRANE = 1600;// crane-up final (apres "institutions" f1451, avant "Meme ressource" f1627)
// punchline
const FD_LINE1 = 1627; // "Meme ressource."
const FD_LINE2 = 1711; // "Trois destins radicalement differents."
const FD_REGLES = 1900;// le basculement vers "ce sont les REGLES" (voix "REGLES" f1940)

export const SceneComparaisonV3: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  // ── Camera : 1 trajectoire continue Norvege -> Congo -> Botswana -> vue large (crane-up) ──
  const camKeys = [
    // Etablissement : Europe du Nord / mer du Nord
    { atProgress: 0.0,          cam: { lon: 6.0, lat: 60.0, zoom: 3.8, pitch: 0, bearing: 0 } },
    // Plongee Norvege (cote mer du Nord)
    { atProgress: F_NOR / END,  cam: { lon: 5.6, lat: 60.2, zoom: 4.4, pitch: 8, bearing: 0 } },
    { atProgress: 360 / END,    cam: { lon: NORVEGE[0] + 0.6, lat: NORVEGE[1] - 0.2, zoom: 5.2, pitch: 32, bearing: -6 } },
    { atProgress: (F_TRANS_AB - 40) / END, cam: { lon: NORVEGE[0] + 0.7, lat: NORVEGE[1] - 0.3, zoom: 5.3, pitch: 32, bearing: -4 } },
    // Pull-back + voyage sud vers Congo (bearing remis a 0 avant le grand trajet)
    { atProgress: F_TRANS_AB / END, cam: { lon: 7.5, lat: 30.0, zoom: 3.4, pitch: 0, bearing: 0 } },
    // Plongee Congo (Pointe-Noire)
    { atProgress: F_COG / END,  cam: { lon: 12.0, lat: -3.5, zoom: 4.4, pitch: 6, bearing: 0 } },
    { atProgress: 1020 / END,   cam: { lon: CONGO[0] + 0.5, lat: CONGO[1] - 0.2, zoom: 5.4, pitch: 30, bearing: 4 } },
    { atProgress: (F_TRANS_BC - 40) / END, cam: { lon: CONGO[0] + 0.55, lat: CONGO[1] - 0.25, zoom: 5.4, pitch: 30, bearing: 6 } },
    // Depart SE vers Botswana
    { atProgress: F_TRANS_BC / END, cam: { lon: 20.0, lat: -14.0, zoom: 3.6, pitch: 0, bearing: 0 } },
    // Plongee Botswana (Jwaneng)
    { atProgress: F_BWA / END,  cam: { lon: 24.0, lat: -23.0, zoom: 4.2, pitch: 6, bearing: 0 } },
    { atProgress: 1400 / END,   cam: { lon: BOTSWANA[0] + 0.5, lat: BOTSWANA[1] - 0.2, zoom: 5.3, pitch: 30, bearing: -5 } },
    { atProgress: (F_CRANE - 20) / END, cam: { lon: BOTSWANA[0] + 0.5, lat: BOTSWANA[1] - 0.2, zoom: 5.3, pitch: 28, bearing: -3 } },
    // Crane-up final : vue large Afrique + Europe (les 3 pays dans le meme cadre, mental "meme ressource")
    { atProgress: 1780 / END,   cam: { lon: 16.0, lat: 22.0, zoom: 2.5, pitch: 0, bearing: 0 } },
    { atProgress: 1.0,          cam: { lon: 16.0, lat: 24.0, zoom: 2.45, pitch: 0, bearing: 0 } },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={AUDIO_START * fps} endAt={Math.round(187.6 * fps)} />
      <SceneSFX />
      <CartoSouverainV5 camKeys={camKeys} focusIsos={[]} onMapReady={(m) => { mapRef.current = m; force((n) => n + 1); }}>
        {/* DRAPEAUX DRAPES — chaque pays prend son drapeau a son arrivee (carte vivante, pas aplat terne V1) */}
        <AnimatedFlagDecal mapRef={mapRef} iso="NOR" geoNames={["Norway"]} appearAt={F_NOR + 30} maxOpacity={0.72} clipBbox={NOR_BBOX} />
        <AnimatedFlagDecal mapRef={mapRef} iso="COG" geoNames={["Congo"]} appearAt={F_COG + 30} maxOpacity={0.72} />
        <AnimatedFlagDecal mapRef={mapRef} iso="BWA" geoNames={["Botswana"]} appearAt={F_BWA + 30} maxOpacity={0.72} />
        {/* Overlays geo-ancres : dots sonar + leaders + plaques verdict */}
        <Overlays mapRef={mapRef} />
      </CartoSouverainV5>
      {/* Punchline finale (premier plan, par-dessus la carte large) */}
      <Punchline />
      {/* Vignette douce */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 52%, rgba(13,21,32,0.40) 100%)",
      }} />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  Drapeau drape avec opacite ANIMEE (injecte a opacite 0, pilote raster-opacity par frame).
//  Repris du pattern AnimatedFlagDecal de SceneGisementsV3 (prouve).
// ════════════════════════════════════════════════════════════════════════════
const AnimatedFlagDecal: React.FC<{
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  iso: string;
  geoNames: string[];
  appearAt: number;
  maxOpacity?: number;
  clipBbox?: [number, number, number, number];
}> = ({ mapRef, iso, geoNames, appearAt, maxOpacity = 0.72, clipBbox }) => {
  const frame = useCurrentFrame();
  const map = mapRef.current;
  const op = interpolate(frame, [appearAt, appearAt + 30], [0, maxOpacity], clamp);
  if (map) {
    const layerId = `flagdecal-lyr-${iso}`;
    if (map.getLayer(layerId)) {
      try { map.setPaintProperty(layerId, "raster-opacity", op); } catch (_e) { /* layer pas pret */ }
    }
  }
  return <MapboxCountryFlagDecal mapRef={mapRef} iso={iso} geoNames={geoNames} drawFlag={(s) => drawFlagCanvas(iso, s)} opacity={0} clipBbox={clipBbox} />;
};

// ════════════════════════════════════════════════════════════════════════════
//  SFX — ping a l'arrivee de chaque pays + swoosh pull-back aux transitions
// ════════════════════════════════════════════════════════════════════════════
const SFX = {
  ping: "_shared/sfx/camera/sfx-map-ping.mp3",
  pullback: "_shared/sfx/camera/sfx-swoosh-pullback.mp3",
};
const SceneSFX: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {frame >= F_NOR + 30 && frame < F_NOR + 30 + 20 && <Audio src={staticFile(SFX.ping)} volume={0.5} />}
      {frame >= F_TRANS_AB && frame < F_TRANS_AB + 24 && <Audio src={staticFile(SFX.pullback)} volume={0.38} />}
      {frame >= F_COG + 30 && frame < F_COG + 30 + 20 && <Audio src={staticFile(SFX.ping)} volume={0.5} />}
      {frame >= F_TRANS_BC && frame < F_TRANS_BC + 24 && <Audio src={staticFile(SFX.pullback)} volume={0.38} />}
      {frame >= F_BWA + 30 && frame < F_BWA + 30 + 20 && <Audio src={staticFile(SFX.ping)} volume={0.5} />}
      {frame >= F_CRANE && frame < F_CRANE + 24 && <Audio src={staticFile(SFX.pullback)} volume={0.34} />}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  Dot sonar geo-ancre (point cle par pays) — sobre, anneaux qui se propagent (P4)
// ════════════════════════════════════════════════════════════════════════════
const Dot: React.FC<{ x: number; y: number; color: string; appearAt: number; frame: number; fps: number }> = ({ x, y, color, appearAt, frame, fps }) => {
  const lf = frame - appearAt;
  if (lf < 0) return null;
  const p = spring({ frame: lf, fps, config: { damping: 9, stiffness: 320 }, durationInFrames: 24 });
  const scale = interpolate(p, [0, 1], [0.05, 1], clamp);
  const op = interpolate(p, [0, 0.1, 1], [0, 1, 1], clamp);
  const rings = [0, 1, 2].map((i) => {
    const rf = Math.max(0, lf - i * 28);
    const t = (rf % 80) / 80;
    return { r: t * 60, o: interpolate(t, [0, 0.15, 0.65, 1], [0, 0.5, 0.18, 0], clamp) * op };
  });
  return (
    <g>
      {rings.map((r, i) => (
        <circle key={i} cx={x} cy={y} r={r.r} fill="none" stroke={color} strokeWidth={1.5} opacity={r.o} />
      ))}
      <circle cx={x} cy={y} r={10 * scale} fill={color} opacity={op} />
      <circle cx={x} cy={y} r={4 * scale} fill={IVORY} opacity={op} />
    </g>
  );
};

// Leader : ligne or + pointe du point geo vers la plaque deportee (P3 doctrine)
const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number; op: number }> = ({ x1, y1, x2, y2, op }) => {
  if (op <= 0.01) return null;
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
      <circle cx={x1} cy={y1} r={3} fill={GOLD} />
    </g>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  OVERLAYS — 1 seul SVG plein ecran, positions recalculees chaque frame (anti-derive)
//  + plaques verdict deportees (GeoCountryPlaque mode pos), reliees par leader.
// ════════════════════════════════════════════════════════════════════════════
const Overlays: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return { x: p.x, y: p.y }; };

  const nor = P(NORVEGE);
  const cog = P(CONGO);
  const bwa = P(BOTSWANA);

  // plaques deportees : a droite du point (zone libre), reliees par leader.
  // offset fixe ecran (la plaque vit pres du point mais decalee dans le vide).
  const plaqueOffset = (pt: { x: number; y: number }, side: 1 | -1, dx = 240, dy = -150) => ({
    x: Math.max(260, Math.min(W - 260, pt.x + side * dx)),
    y: Math.max(180, Math.min(H - 200, pt.y + dy)),
  });
  const norP = plaqueOffset(nor, 1, 250, -40);
  const cogP = plaqueOffset(cog, 1, 250, -60);
  const bwaP = plaqueOffset(bwa, -1, 250, -60);

  // opacite des leaders (suivent la fenetre de la plaque)
  const norLeadOp = interpolate(frame, [F_NOR + 40, F_NOR + 70, F_TRANS_AB - 20, F_TRANS_AB + 10], [0, 1, 1, 0], clamp);
  const cogLeadOp = interpolate(frame, [F_COG + 40, F_COG + 70, F_TRANS_BC - 20, F_TRANS_BC + 10], [0, 1, 1, 0], clamp);
  const bwaLeadOp = interpolate(frame, [F_BWA + 40, F_BWA + 70, F_CRANE - 30, F_CRANE], [0, 1, 1, 0], clamp);

  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        {/* leaders point -> plaque */}
        {frame >= F_NOR + 40 && frame < F_TRANS_AB + 10 && <Leader x1={nor.x} y1={nor.y} x2={norP.x} y2={norP.y} op={norLeadOp} />}
        {frame >= F_COG + 40 && frame < F_TRANS_BC + 10 && <Leader x1={cog.x} y1={cog.y} x2={cogP.x} y2={cogP.y} op={cogLeadOp} />}
        {frame >= F_BWA + 40 && frame < F_CRANE && <Leader x1={bwa.x} y1={bwa.y} x2={bwaP.x} y2={bwaP.y} op={bwaLeadOp} />}
        {/* dots sonar */}
        {frame >= F_NOR + 30 && frame < F_TRANS_AB + 10 && <Dot x={nor.x} y={nor.y} color={GOLD} appearAt={F_NOR + 30} frame={frame} fps={fps} />}
        {frame >= F_COG + 30 && frame < F_TRANS_BC + 10 && <Dot x={cog.x} y={cog.y} color={ORANGE} appearAt={F_COG + 30} frame={frame} fps={fps} />}
        {frame >= F_BWA + 30 && frame < F_CRANE && <Dot x={bwa.x} y={bwa.y} color={GREEN} appearAt={F_BWA + 30} frame={frame} fps={fps} />}
      </svg>

      {/* plaques verdict deportees (mode pos geo-ancre) */}
      <GeoCountryPlaque
        frame={frame} name="NORVEGE" color={GOLD}
        stat={frame >= F_NOR_STAT2 ? "1 500 Mds$ · 280 000 $/hab" : "1 500 Mds$"}
        source="fonds souverain — NBIM 2025"
        appearAt={F_NOR + 55} hideAt={F_TRANS_AB} pos={norP} fadeFrames={14}
      />
      <GeoCountryPlaque
        frame={frame} name="CONGO-BRAZZAVILLE" color={ORANGE}
        stat="le plus endetté d'Afrique"
        source="même époque — Banque mondiale"
        appearAt={F_COG + 55} hideAt={F_TRANS_BC} pos={cogP} fadeFrames={14}
      />
      <GeoCountryPlaque
        frame={frame} name="BOTSWANA" color={GREEN}
        stat="le plus stable du continent"
        source="diamants 1966 — institutions"
        appearAt={F_BWA + 55} hideAt={F_CRANE} pos={bwaP} fadeFrames={14}
      />
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  PUNCHLINE — "Meme ressource. Presque la meme epoque. Trois destins.
//  Ce qui a tout decide, ce ne sont pas la ressource. Ce sont les REGLES."
//  Le mot REGLES frappe (scale spring + or massif). Cale sur la voix.
// ════════════════════════════════════════════════════════════════════════════
const Punchline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < FD_LINE1 - 20) return null;

  // voile bas pour lisibilite (la carte large reste visible derriere)
  const veil = interpolate(frame, [FD_LINE1 - 20, FD_LINE1 + 20], [0, 1], clamp);

  // ligne 1 — "Meme ressource. Presque la meme epoque." (sobre, ivoire)
  const l1 = spring({ frame: frame - FD_LINE1, fps, config: { damping: 20, stiffness: 150 }, durationInFrames: 24 });
  const l1Op = interpolate(l1, [0, 1], [0, 1], clamp);
  const l1Y = interpolate(l1, [0, 1], [22, 0], clamp);

  // ligne 2 — "Trois destins radicalement differents." (emphase ivoire)
  const l2 = spring({ frame: frame - FD_LINE2, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 22 });
  const l2Op = interpolate(l2, [0, 1], [0, 1], clamp);
  const l2Scale = interpolate(l2, [0, 1], [0.84, 1], clamp);

  // bascule finale : "Ce ne sont pas la ressource." s'efface, "Ce sont les REGLES." FRAPPE
  const negOp = interpolate(frame, [FD_REGLES - 70, FD_REGLES - 45, FD_REGLES, FD_REGLES + 20], [0, 1, 1, 0.25], clamp);
  const reglesP = spring({ frame: frame - FD_REGLES, fps, config: { damping: 11, stiffness: 240 }, durationInFrames: 26 });
  const reglesOp = interpolate(reglesP, [0, 0.1, 1], [0, 1, 1], clamp);
  const reglesScale = interpolate(reglesP, [0, 1], [0.6, 1], clamp);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* voile degrade bas */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 520,
        background: "linear-gradient(to top, rgba(13,21,32,0.86) 0%, rgba(13,21,32,0.0) 100%)",
        opacity: veil,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end", paddingBottom: 150,
      }}>
        {/* ligne 1 */}
        {frame < FD_REGLES - 30 && (
          <div style={{
            opacity: l1Op, transform: `translateY(${l1Y}px)`, marginBottom: 10, textAlign: "center",
            color: IVORY, fontFamily: BEBAS, fontSize: 46, letterSpacing: "0.04em",
            textShadow: "0 2px 22px rgba(0,0,0,0.95)",
          }}>
            Même ressource. Presque la même époque.
          </div>
        )}
        {/* ligne 2 */}
        {frame >= FD_LINE2 && frame < FD_REGLES - 30 && (
          <div style={{
            opacity: l2Op, transform: `scale(${l2Scale})`, textAlign: "center",
            color: IVORY, fontFamily: BEBAS, fontSize: 64, letterSpacing: "0.03em", fontWeight: 700,
            textShadow: "0 3px 30px rgba(0,0,0,0.95)",
          }}>
            Trois destins radicalement différents.
          </div>
        )}

        {/* bascule finale */}
        {frame >= FD_REGLES - 70 && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              opacity: negOp, color: IVORY, fontFamily: BEBAS, fontSize: 44,
              letterSpacing: "0.04em", marginBottom: 14, textShadow: "0 2px 22px rgba(0,0,0,0.95)",
            }}>
              Ce n'est pas la ressource.
            </div>
            <div style={{
              opacity: reglesOp, transform: `scale(${reglesScale})`,
              color: GOLD, fontFamily: BEBAS, fontSize: 132, fontWeight: 900,
              letterSpacing: "0.06em", lineHeight: 1,
              textShadow: "0 4px 50px rgba(200,169,81,0.55)",
            }}>
              CE SONT LES RÈGLES.
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const SCENE_COMPARAISON_V3_FRAMES = END;
export default SceneComparaisonV3;
