// PROTO — Soudan Acte 3 "Suivre l'or" en GLOBE D3 (16:9).
// Objectif (decide avec Aziz 2026-07-19) : prouver le RESSENTI CARREFOUR sur ~18s, sans audio ni
// montage complet. Si c'est beau => on engage la scene entiere. Sinon => on sait pourquoi avant de
// payer le cout complet.
//
// Ce que ce proto assemble (tout ce que s13 a prouve + la brique neuve = arc geoInterpolate) :
//  - Phase A (raccord CARTE->GLOBE) : Soudan quasi-plat (globe tres zoome) qui DEZOOME vers la sphere.
//    = recette K1 (GlobeToParchemin) INVERSEE : on part du plan local et on recule dans l'espace.
//  - Phase B (les FLUX) : arc OR Jebel Amer(Darfour) -> Dubai qui SUIT LA COURBURE (geoInterpolate,
//    clip natif derriere le globe), point dore voyageur, pulse a Dubai, TRANSFORMATION or->gris-metal,
//    RETOUR (drones) vers le jeton RSF (pulse rouge a l'arrivee). Puis MIROIR Ankara -> jeton SAF
//    (gris-metal, pulse bleu).
//  - Phase C (le SYSTEME) : leger pivot du globe, les 2 flux persistent en trace fantome = carrefour.
//
// Compositing jetons = recette medaillon prouvee (disque creme + double ombre), portable D3<->Mapbox.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig, staticFile } from "remotion";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { geoPath, type GeoProjection } from "d3-geo";
import { arcPathD, pointAlongArc, projectPoint, GEO, type LonLat } from "./geoArc";

// GlobeFlagFill — remplit la silhouette d'un pays PROJETEE SUR LE GLOBE avec son drapeau (asset local).
// Meme mecanique que CountryFlagFill (_shared) — clipPath(path pays) + <image> drapeau — mais avec
// la projection ORTHO courante (le pays reste a sa place sur la sphere, avec la courbure). Le drapeau
// se clippe dans la forme projetee : effet "le territoire prend les couleurs de sa nation", sur globe.
// Plus direct que Mapbox (fill-pattern + sources GeoJSON) : le path EST deja notre geometrie.
const GlobeFlagFill: React.FC<{
  feature: any;
  proj: GeoProjection;
  path: (o: any) => string | null;
  flagCode: string; // ISO-2, asset local public/_shared/flags/<code>.png
  reveal: number; // 0->1 : le drapeau se materialise
  glow: string;
}> = ({ feature, proj, path, flagCode, reveal, glow }) => {
  if (reveal <= 0) return null;
  const d = path(feature);
  if (!d) return null;
  const gp = geoPath(proj);
  const [[x0, y0], [x1, y1]] = gp.bounds(feature);
  const clipId = `gff-${flagCode}`;
  return (
    <g opacity={reveal}>
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>
      {/* drapeau clippe dans la forme du pays (a sa place geo, avec la courbure) */}
      <image
        href={staticFile(`_shared/flags/${flagCode}.png`)}
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
        opacity={0.95}
      />
      {/* contour renforce + halo (le pays "s'active") */}
      <path d={d} fill="none" stroke={glow} strokeWidth={1 + 2.4 * reveal} strokeLinejoin="round" opacity={0.9} />
    </g>
  );
};

export const PROTO_FRAMES = 540; // 18s @30fps

// --- 3 THEMES de globe a comparer (meme mecanique, seule la palette change) ---
// "space" = bleu nuit vu-de-l'espace (registre A1 globe). "parchemin" = palette video Mapbox portee au
// globe (ocean creme). "mixte" (choix Aziz 2026-07-19) = terres KAKI/parchemin (coherence episode) +
// OCEAN BLEU (contraste terre/mer + signal "niveau mondial") + flux SATURES (l'or pale se noyait sur kaki).
type ThemeName = "space" | "parchemin" | "mixte";

interface GlobeTheme {
  bg: string;
  oceanInner: string; // centre du degrade radial ocean (cote eclaire)
  oceanMid: string;
  oceanOuter: string;
  atmoColor: string;
  atmoOpacity: number;
  land: string;
  landStroke: string;
  borderWidth: number; // epaisseur des frontieres NEUTRES — marquees en vue globe (carte politique
  borderOpacity: number; // premium), tres fines en registre narration/parchemin.
  grat: string;
  gratOpacity: number;
  sudanFill: string;
  sudanStroke: string;
  sphereStroke: string;
  labelFill: string;
  labelStroke: string;
  legendSur: string; // surtitre
  flowGold: string; // couleur du flux OR (par theme : + sature sur fond kaki)
  flowMetal: string; // couleur du flux DRONES/armes
  legendTitle: string; // couleur du titre bas
  landActive: string; // territoire qui REAGIT (kaki chauffe / illumine a l'arrivee d'un flux)
  landActiveStroke: string; // contour renforce du territoire actif
}

const RSF_RED = "#C0392B";
const SAF_BLUE = "#2E6DB4";

const THEMES: Record<ThemeName, GlobeTheme> = {
  space: {
    bg: "#0b1220",
    oceanInner: "#1d3055",
    oceanMid: "#16233f",
    oceanOuter: "#0f1a30",
    atmoColor: "#4a7fd0",
    atmoOpacity: 0.45,
    land: "#26375f",
    landStroke: "#5878ad", // frontieres bleutees eclaircies (plus visibles = carte politique premium)
    borderWidth: 0.7,
    borderOpacity: 0.6,
    grat: "#2b3f66",
    gratOpacity: 0.5,
    sudanFill: "#F5EFD6",
    sudanStroke: "#b9852f",
    sphereStroke: "#4a7fd0",
    labelFill: "#e8dcbf",
    labelStroke: "#0b1220",
    legendSur: "#8fa3c8",
    flowGold: "#E7B75A",
    flowMetal: "#9AA3AD",
    legendTitle: "#E7B75A",
    landActive: "#4a5c86",
    landActiveStroke: "#8fb0e8",
  },
  // Palette video Mapbox (fond parchemin) portee sur la sphere. L'ocean prend une teinte terre
  // creme-sable eclairee (pas bleu), les terres un parchemin plus sombre, contours encre brune.
  parchemin: {
    bg: "#0e0b06",
    oceanInner: "#EDE3C4", // "ocean" = sable clair eclaire (comme le vide creme de la video)
    oceanMid: "#DBCDA6",
    oceanOuter: "#8a7a52", // terre-ombre au bord (galbe)
    atmoColor: "#e8cf94",
    atmoOpacity: 0.4,
    land: "#C9B78A", // terres = parchemin moyen
    landStroke: "#6b5836",
    borderWidth: 0.4, // parchemin = registre NARRATION : frontieres tres fines (habitude)
    borderOpacity: 0.35,
    grat: "#a8946a",
    gratOpacity: 0.35,
    sudanFill: "#F7F1DC", // Soudan = parchemin le plus clair (ressort)
    sudanStroke: "#a9701f",
    sphereStroke: "#8a7a52",
    labelFill: "#4a3a1e",
    labelStroke: "#F5EFD6",
    legendSur: "#8a7440",
    flowGold: "#E7B75A",
    flowMetal: "#9AA3AD",
    legendTitle: "#c78a2a",
    landActive: "#E0C98A",
    landActiveStroke: "#c9971f",
  },
  // MIXTE (choix Aziz) : terres kaki/parchemin + OCEAN BLEU adouci (bleu V1 desature pour dialoguer
  // avec le kaki, pas l'ecraser) + flux SATURES (or franc lumineux, drones acier froid tranche).
  mixte: {
    bg: "#0a1018",
    oceanInner: "#2a4468", // bleu V1 remonte/adouci (cote eclaire)
    oceanMid: "#1f3554",
    oceanOuter: "#152538",
    atmoColor: "#5a86c4",
    atmoOpacity: 0.42,
    land: "#B8A578", // terres KAKI (langage video)
    landStroke: "#7a6844", // mixte = vue globe : frontieres kaki plus marquees (carte politique premium)
    borderWidth: 0.65,
    borderOpacity: 0.55,
    grat: "#3a5170",
    gratOpacity: 0.4,
    sudanFill: "#F4ECD2", // Soudan clair qui ressort sur le kaki
    sudanStroke: "#b07d22",
    sphereStroke: "#5a86c4",
    labelFill: "#f2e9cf",
    labelStroke: "#0a1018",
    legendSur: "#9fb2cf",
    flowGold: "#FFC742", // or FRANC lumineux (sature) — tranche sur kaki + bleu
    flowMetal: "#7FB2E8", // drones = acier-bleu froid (oppose visuellement l'or chaud)
    legendTitle: "#FFC742",
    landActive: "#D8C48A", // kaki CHAUFFE (le pays cible s'illumine a l'arrivee de l'or)
    landActiveStroke: "#FFC742", // contour dore renforce
  },
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Medaillon jeton pose (recette prouvee : disque creme + bordure + double ombre). Ici sans portrait
// raster (proto) : disque + initiale, mais la geometrie/ombre est la vraie recette portable.
const Medallion: React.FC<{ x: number; y: number; color: string; label: string; scale: number; pulse: number; t: GlobeTheme }> = ({ x, y, color, label, scale, pulse, t }) => {
  const R = 17 * scale;
  return (
    <g transform={`translate(${x} ${y})`} opacity={scale <= 0 ? 0 : 1}>
      {/* pulse geo-ancre (halo qui bat a l'arrivee du flux) */}
      {pulse > 0 && <circle r={R + 34 * pulse} fill={color} opacity={0.28 * (1 - pulse)} />}
      {pulse > 0 && <circle r={R + 16 * pulse} fill="none" stroke={color} strokeWidth={2.5} opacity={0.7 * (1 - pulse)} />}
      {/* ombre-sol floue decalee */}
      <ellipse cx={2} cy={R * 0.7} rx={R * 0.92} ry={R * 0.34} fill="rgba(0,0,0,0.38)" />
      {/* disque medaillon */}
      <circle r={R} fill={t.sudanFill} stroke={color} strokeWidth={4} />
      <circle r={R} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
      <text y={R * 0.34} textAnchor="middle" fontSize={R * 0.95} fontWeight={800} fill={color} fontFamily="'Archivo', sans-serif">{label}</text>
    </g>
  );
};

// Objet-destination (Dubai, Ankara) : point + label. Peut se transformer en OBJET-ICONE hangar
// a l'arrivee d'un flux (hangarIn 0->1 : le point cede la place au hangar qui se materialise).
const DestPoint: React.FC<{ x: number; y: number; label: string; on: number; flash: number; t: GlobeTheme; hangarIn?: number }> = ({ x, y, label, on, flash, t, hangarIn = 0 }) => {
  const dotOp = 1 - hangarIn; // le point s'efface a mesure que le hangar apparait
  return (
    <g transform={`translate(${x} ${y})`} opacity={on}>
      {flash > 0 && <circle r={10 + 40 * flash} fill={t.flowGold} opacity={0.4 * (1 - flash)} />}
      {/* point neutre (avant materialisation de l'objet) */}
      <g opacity={dotOp}>
        <circle r={7} fill={t.sudanFill} stroke={t.labelFill} strokeWidth={2} />
        <circle r={2.5} fill={t.labelFill} />
      </g>
      {/* OBJET-ICONE : hangar/port de transit (materialisation sequencee) */}
      {hangarIn > 0 && (
        <g transform={`translate(0 ${2 - 6 * (1 - hangarIn)}) scale(${0.6 + 0.4 * hangarIn})`} opacity={hangarIn}>
          {/* ombre-sol */}
          <ellipse cx={0} cy={10} rx={20} ry={5} fill="rgba(0,0,0,0.35)" />
          {/* toit/hangar (demi-cylindre stylise) + quai */}
          <path d="M -18 8 L -18 -2 Q 0 -14 18 -2 L 18 8 Z" fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.6} strokeLinejoin="round" />
          <line x1={-10} y1={8} x2={-10} y2={-6} stroke={t.landStroke} strokeWidth={1} opacity={0.5} />
          <line x1={0} y1={8} x2={0} y2={-11} stroke={t.landStroke} strokeWidth={1} opacity={0.5} />
          <line x1={10} y1={8} x2={10} y2={-6} stroke={t.landStroke} strokeWidth={1} opacity={0.5} />
          <rect x={-22} y={8} width={44} height={4} fill={t.landStroke} opacity={0.7} />
        </g>
      )}
      <text x={hangarIn > 0.5 ? 26 : 13} y={5} fontSize={22} fontWeight={700} fill={t.labelFill} stroke={t.labelStroke} strokeWidth={0.6} fontFamily="'Archivo', sans-serif">{label}</text>
    </g>
  );
};

// Jeton-drapeau rond flottant : drapeau clippe dans un disque + bordure + ombre. Plus GROS et NET que
// le drapeau clippe dans le petit territoire => porte la LISIBILITE (le remplissage porte l'ancrage geo).
const FlagToken: React.FC<{ x: number; y: number; flagCode: string; reveal: number; ring: string }> = ({ x, y, flagCode, reveal, ring }) => {
  if (reveal <= 0) return null;
  const R = 26 * reveal;
  const clipId = `ft-${flagCode}`;
  return (
    <g transform={`translate(${x} ${y})`} opacity={reveal}>
      <defs>
        <clipPath id={clipId}>
          <circle r={R} />
        </clipPath>
      </defs>
      {/* ombre-sol */}
      <ellipse cx={2} cy={R * 0.72} rx={R * 0.9} ry={R * 0.32} fill="rgba(0,0,0,0.4)" />
      {/* drapeau clippe en disque */}
      <image href={staticFile(`_shared/flags/${flagCode}.png`)} x={-R * 1.4} y={-R} width={R * 2.8} height={R * 2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
      {/* bordure */}
      <circle r={R} fill="none" stroke={ring} strokeWidth={3.5} />
      <circle r={R} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
    </g>
  );
};

// Onde de choc geo-ancree : anneau qui se propage depuis un point d'impact (shockT 0->1).
const ShockRing: React.FC<{ x: number; y: number; shockT: number; color: string }> = ({ x, y, shockT, color }) => {
  if (shockT <= 0 || shockT >= 1) return null;
  const r = 8 + 70 * shockT;
  const op = 0.6 * (1 - shockT);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="none" stroke={color} strokeWidth={3.5 * (1 - shockT) + 1} opacity={op} />
      <circle r={r * 0.62} fill="none" stroke={color} strokeWidth={2} opacity={op * 0.7} />
    </g>
  );
};

// variant : "token" = jeton-drapeau flottant (option A) · "zoom" = camera qui se rapproche du pays a
// l'arrivee (option B) · "none" = ni l'un ni l'autre (base v3).
export const SoudanActe3GlobeProto16x9: React.FC<{ theme?: ThemeName; variant?: "none" | "token" | "zoom" }> = ({ theme = "space", variant = "none" }) => {
  const frame = useCurrentFrame();
  useVideoConfig();
  const t = THEMES[theme];

  // ============ CAMERA : centre + scale du globe ============
  // Centre sur un point entre Soudan et golfe pour que Dubai ET Ankara soient sur la face visible.
  const centerLon = 38;
  const centerLat = 20;

  // Phase A (0..75f) : raccord CARTE->GLOBE = on part TRES zoome (Soudan plein cadre, courbure nulle)
  // et on DEZOOME jusqu'a un globe ENCORE ZOOME (pas le globe complet) : Soudan+golfe ~60% du cadre,
  // courbure visible mais assez de scale pour que les arcs aient du galbe et que les jetons respirent.
  // scaleMul: 4.6 (Soudan plein cadre) -> 2.1 (globe zoome carrefour, PAS 1.0 = globe complet trop loin).
  const pDezoom = interpolate(frame, [0, 75], [0, 1], clampB);
  const eDez = easeInOut(pDezoom);
  const scaleMul = interpolate(eDez, [0, 1], [4.6, 2.1]);
  // Au depart on est centre plus pres du Soudan (30,15.5), on glisse vers le centre carrefour.
  const camLon = GEO.sudanCenter[0] + (centerLon - GEO.sudanCenter[0]) * eDez;
  const camLat = GEO.sudanCenter[1] + (centerLat - GEO.sudanCenter[1]) * eDez;

  // Phase C (450..540f) : leger pivot pour "faire vivre" le systeme.
  const pivotC = interpolate(frame, [450, 540], [0, 7], clampB);

  // OPTION B (variant "zoom") : a l'arrivee de l'or (185..260f), la camera se rapproche du pays cible
  // (Dubai) pour rendre le drapeau grand et net, puis recule. Rapprochement = +scale + glissement du
  // centre vers les EAU, en va-et-vient doux (ease).
  const zoomActive = variant === "zoom";
  const zoomAmt = zoomActive
    ? interpolate(frame, [185, 215, 245, 275], [0, 1, 1, 0], clampB)
    : 0;
  const eZoom = easeInOut(zoomAmt);
  const scaleZoom = 1 + 0.9 * eZoom; // jusqu'a x1.9 de rapprochement local
  const camLonZ = camLon + (GEO.dubai[0] - camLon) * 0.55 * eZoom;
  const camLatZ = camLat + (GEO.dubai[1] - camLat) * 0.55 * eZoom;

  const rotLambda = -(camLonZ + pivotC);
  const rotLat = -camLatZ;

  const proj = orthoAt(rotLambda, rotLat).scale(GLOBE_R * scaleMul * scaleZoom);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const sudan = featureByName("Sudan");
  // Pays-cibles qui REAGISSENT a l'arrivee d'un flux (illumination + contour renforce).
  const uae = featureByName("United Arab Emirates");

  // ============ FLUX 1 : OR Jebel Amer -> Dubai, puis DRONES retour -> jeton RSF ============
  // Timeline (frames) :
  //  90..100  Dubai apparait (destination comprise avant l'arrivee)
  //  100..190 arc OR se revele + point dore voyage Darfour->Dubai
  //  190..205 flash "transaction" a Dubai + bascule couleur or->metal
  //  205..290 arc RETOUR se revele + point gris-metal voyage Dubai->jeton RSF
  //  290..320 pulse ROUGE sur le jeton RSF (la preuve : l'objet reagit)
  const dubaiOn = interpolate(frame, [90, 105], [0, 1], clampB);
  const goldReveal = interpolate(frame, [100, 190], [0, 1], clampB);
  const goldT = interpolate(frame, [100, 190], [0, 1], clampB); // fraction voyageur
  const dubaiFlash = interpolate(frame, [190, 220], [0, 1], clampB);
  const retReveal = interpolate(frame, [205, 290], [0, 1], clampB);
  const retT = interpolate(frame, [205, 290], [0, 1], clampB);
  const rsfPulse = interpolate(frame, [290, 340], [0, 1], clampB);

  // ==== REACTION CIBLE a l'arrivee de l'or a Dubai (frame ~190) — 3 effets combines ====
  // (1) illumination du territoire EAU : kaki neutre -> kaki chaud + contour renforce, puis retient
  //     une teinte "active" (ne redevient pas totalement neutre = le pays reste "allume" dans le systeme).
  const uaeLight = interpolate(frame, [188, 210, 300], [0, 1, 0.88], clampB);
  // (2) onde de choc : anneau qui se propage depuis Dubai (0->1 = rayon qui grandit en s'estompant).
  const shockT = interpolate(frame, [190, 235], [0, 1], clampB);
  // (3) objet-icone (hangar/port) qui se materialise sur Dubai, sequence APRES l'onde.
  const hangarIn = interpolate(frame, [206, 226], [0, 1], clampB);

  // ============ FLUX 2 (miroir) : Ankara -> jeton SAF (drones), pulse BLEU ============
  const ankaraOn = interpolate(frame, [300, 315], [0, 1], clampB);
  const turkReveal = interpolate(frame, [310, 400], [0, 1], clampB);
  const turkT = interpolate(frame, [310, 400], [0, 1], clampB);
  const safPulse = interpolate(frame, [400, 450], [0, 1], clampB);

  // arcs (d) — le tracé aller de l'or persiste en trace fantôme après transformation
  const goldArcD = arcPathD(proj, path, GEO.jebelAmer, GEO.dubai, goldReveal);
  const goldGhost = frame > 190 ? arcPathD(proj, path, GEO.jebelAmer, GEO.dubai, 1) : "";
  const retArcD = arcPathD(proj, path, GEO.dubai, GEO.rsfToken, retReveal);
  const turkArcD = arcPathD(proj, path, GEO.ankara, GEO.safToken, turkReveal);

  // positions marqueurs voyageurs (null si derriere le globe)
  const goldMarker = frame >= 100 && frame <= 195 ? pointAlongArc(proj, GEO.jebelAmer, GEO.dubai, goldT, visible) : null;
  const retMarker = frame >= 205 && frame <= 292 ? pointAlongArc(proj, GEO.dubai, GEO.rsfToken, retT, visible) : null;
  const turkMarker = frame >= 310 && frame <= 402 ? pointAlongArc(proj, GEO.ankara, GEO.safToken, turkT, visible) : null;

  // points fixes projetes
  const pDubai = projectPoint(proj, GEO.dubai, visible);
  const pAnkara = projectPoint(proj, GEO.ankara, visible);
  const pRSF = projectPoint(proj, GEO.rsfToken, visible);
  const pSAF = projectPoint(proj, GEO.safToken, visible);
  const pJebel = projectPoint(proj, GEO.jebelAmer, visible);

  const fadeIn = interpolate(frame, [0, 15], [0, 1], clampB);

  const arcStroke = (d: string, color: string, wMul = 1, op = 1) =>
    d ? (
      <>
        {/* liseré sombre sous le trait : garantit le contraste quel que soit le fond (kaki clair) */}
        <path d={d} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6 * wMul} strokeLinecap="round" opacity={0.6 * op} />
        {/* glow diffus de la couleur du flux */}
        <path d={d} fill="none" stroke={color} strokeWidth={11 * wMul} strokeLinecap="round" opacity={0.16 * op} />
        {/* trait principal (epaissi pour lisibilite) */}
        <path d={d} fill="none" stroke={color} strokeWidth={4.4 * wMul} strokeLinecap="round" opacity={op} />
        {/* marching ants clairs par-dessus */}
        <path d={d} fill="none" stroke="#fff" strokeWidth={1.5 * wMul} strokeLinecap="round" strokeDasharray="7 12" strokeDashoffset={-(frame * 0.9) % 19} opacity={0.55 * op} />
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

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="atmoP" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="94%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="oceanP" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
          </defs>

          {/* halo atmospherique (suit le rayon effectif du globe, zoom inclus) */}
          <circle cx={W / 2} cy={H / 2} r={GLOBE_R * scaleMul * scaleZoom + 26} fill="url(#atmoP)" />
          {/* ocean = sphere pleine */}
          <path d={sphere} fill="url(#oceanP)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
          {/* graticule */}
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

          {/* pays (clip ortho natif) — Soudan clair, le reste en teinte terre. EAU = territoire qui
              REAGIT (illumination + contour renforce a l'arrivee de l'or, uaeLight 0->1). */}
          {feats.map((f, i) => {
            const name = f.properties.name;
            if (name === "Sudan" || name === "United Arab Emirates") return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={i} d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
          })}
          {uae && (() => {
            const d = path(uae as any);
            if (!d) return null;
            // base kaki neutre TOUJOURS dessinee, PUIS le DRAPEAU des EAU remplit le territoire a
            // l'arrivee de l'or (uaeLight 0->1) = "le pays prend les couleurs de sa nation".
            return (
              <g>
                <path d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />
                <GlobeFlagFill feature={uae} proj={proj} path={path} flagCode="ae" reveal={uaeLight} glow={t.landActiveStroke} />
              </g>
            );
          })()}
          {sudan && (() => {
            const d = path(sudan as any);
            return d ? <path d={d} fill={t.sudanFill} fillOpacity={0.95} stroke={t.sudanStroke} strokeWidth={1.6} /> : null;
          })()}

          {/* ==== FLUX 1 : or aller (trace fantome persistante apres transfo) ==== */}
          {goldGhost && arcStroke(goldGhost, t.flowGold, 1, 0.35)}
          {arcStroke(goldArcD, t.flowGold, 1, 1)}
          {/* retour drones (metal) */}
          {arcStroke(retArcD, t.flowMetal, 1, 1)}
          {/* ==== FLUX 2 : Turquie -> SAF (metal) ==== */}
          {arcStroke(turkArcD, t.flowMetal, 1, 1)}

          {/* marqueurs voyageurs */}
          {travelDot(goldMarker, t.flowGold)}
          {travelDot(retMarker, t.flowMetal)}
          {travelDot(turkMarker, t.flowMetal)}

          {/* onde de choc a l'impact de l'or sur Dubai (sous l'objet) */}
          {pDubai && <ShockRing x={pDubai.x} y={pDubai.y} shockT={shockT} color={t.flowGold} />}

          {/* destinations — Dubai se transforme en hangar a l'arrivee (hangarIn) */}
          {pDubai && <DestPoint x={pDubai.x} y={pDubai.y} label="Dubai" on={dubaiOn} flash={dubaiFlash} t={t} hangarIn={hangarIn} />}
          {pAnkara && <DestPoint x={pAnkara.x} y={pAnkara.y} label="Ankara" on={ankaraOn} flash={0} t={t} />}

          {/* OPTION A (variant "token") : jeton-drapeau EAU flottant, gros et net, ancre pres du pays. */}
          {variant === "token" && pDubai && (
            <FlagToken x={pDubai.x + 62} y={pDubai.y - 62} flagCode="ae" reveal={uaeLight} ring={t.landActiveStroke} />
          )}

          {/* mine Jebel Amer (petit halo dore, origine du flux) */}
          {pJebel && (
            <g transform={`translate(${pJebel.x} ${pJebel.y})`} opacity={interpolate(frame, [80, 100], [0, 1], clampB)}>
              <circle r={16} fill={t.flowGold} opacity={0.28} />
              <circle r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />
            </g>
          )}

          {/* jetons factions (medaillons poses) — apparaissent des la phase A */}
          {pRSF && <Medallion x={pRSF.x} y={pRSF.y} color={RSF_RED} label="R" scale={interpolate(frame, [40, 60], [0, 1], clampB)} pulse={rsfPulse} t={t} />}
          {pSAF && <Medallion x={pSAF.x} y={pSAF.y} color={SAF_BLUE} label="S" scale={interpolate(frame, [40, 60], [0, 1], clampB)} pulse={safPulse} t={t} />}
        </svg>
      </AbsoluteFill>

      {/* legende bas (registre AES) */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 54, textAlign: "center", fontFamily: "'Archivo','Arial Narrow',sans-serif", opacity: interpolate(frame, [110, 135], [0, 1], clampB) }}>
        <div style={{ fontSize: 20, letterSpacing: 5, color: t.legendSur, fontWeight: 600, marginBottom: 6 }}>SUIVRE L'OR</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#c78a2a", letterSpacing: 0.5 }}>LE SOUDAN, UN CARREFOUR</div>
      </div>
    </AbsoluteFill>
  );
};

export default SoudanActe3GlobeProto16x9;
