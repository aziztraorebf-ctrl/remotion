/**
 * KostiInsertSVG — Beat 5 Acte 4 Soudan (Kosti). INSERT SVG plein ecran, REMPLACE la vue Mapbox
 * top-down (DroneStrikeImpact) jugee illisible/froide pour un fait de cout civil (cf STATUS Acte 4).
 *
 * Doctrine appliquee : intention "cout humain incarne" = QUOI/COMMENT -> insert SVG, pas carte (OU).
 * Registre "carte d'etat-major" (echo de KhartoumEtatMajorSVG deja vu dans la video) mais INFLECHI civil :
 * pas de jeton militaire, pas de faction — des jetons CIVILS (6 visages distincts) qui s'ETEIGNENT a la
 * frappe. Proto valide : KostiFrappeProtoV3.
 *
 * ⭐ REFONTE 2026-07-17 (Kimi K3, vision->SVG) : la STATION-SERVICE et le corps du DRONE sont dessines par
 * Kimi K3 (test vision : coquille nue + script -> K3 invente la geometrie) et rendus INLINE (StationDecor +
 * DroneBodyK3). Le sprite drone-rsf-td.png et le decor externe kosti-sol-decor-noriver.svg ne sont PLUS
 * rendus (fond de carte redessine inline MapBackdrop). Portraits civils : inchanges (Img sprites).
 *
 * ⭐ CALE SUR LA NARRATION (frames locales p4, audio acte4-voisins-aspires-p4.mp3, 25.54s @30fps) :
 *   kostiNomme 164 · droneFrappe 305 · stationService 323 · civilsEssence 365 · civilsPayentPrix 700 · end 766.
 * Le drone FRAPPE sur le mot "drone" (305), les civils s'eteignent en s'etalant jusqu'a "civils qui en
 * payent le prix" (700). Fumee persiste jusqu'a la fin.
 *
 * Decor : STATION dessinee par Kimi K3 (extraits _k3-refonte-ref/kosti-k3-extraits.json), rendue
 * inline dans <StationDecor/> et alignee sur STATION_CENTER via un <g translate scale>. Le fond ivoire +
 * grille + cadre est redessine INLINE (<MapBackdrop/>, sans cartouche "CARTE DE SITUATION"), + une route
 * reliant la file de civils aux pompes. Nil affine, redessine anime ici (eau qui s'ecoule). Aucun asset payant.
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing, staticFile } from "remotion";

const RED = "#8a2a20";
const IVORY = "#f2ebd9";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── Timecodes locaux p4 (frames @30fps), passes par F4 depuis SoudanActe4 ──
export type KostiF4 = {
  kostiNomme: number; droneFrappe: number; stationService: number;
  civilsEssence: number; pasCibleMilitaire: number; civilsPayentPrix: number; end: number;
};

const IMPACT = { x: 744, y: 600 };
const STATION_CENTER = { x: 744, y: 526 };
const DRONE_ENTRY = { x: -66, y: -60 };

const CIVILS = [
  { x: 700, y: 630, asset: "portrait-civil" },
  { x: 655, y: 675, asset: "refugie-homme" },
  { x: 610, y: 720, asset: "refugie-femme1" },
  { x: 560, y: 762, asset: "refugie-enfant" },
  { x: 512, y: 800, asset: "refugie-femme2" },
  { x: 470, y: 835, asset: "refugie-famille" },
];

const quad = (o: { x: number; y: number }, m: { x: number; y: number }, t2: { x: number; y: number }, t: number) => {
  const mt = 1 - t;
  return { x: mt * mt * o.x + 2 * mt * t * m.x + t * t * t2.x, y: mt * mt * o.y + 2 * mt * t * m.y + t * t * t2.y };
};

// ── Fond de carte redessine inline (ex-kosti-sol-decor-noriver.svg, sans ancienne station/labels/cartouche) ──
const MapBackdrop: React.FC = () => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    <defs>
      <pattern id="kostiDottedGrid" x={0} y={0} width={48} height={48} patternUnits="userSpaceOnUse">
        <circle cx={1.5} cy={1.5} r={1.5} fill="#856f54" opacity={0.24} />
      </pattern>
      <pattern id="kostiFineGrid" x={0} y={0} width={192} height={192} patternUnits="userSpaceOnUse">
        <path d="M192 0H0V192" fill="none" stroke="#725d47" strokeWidth={1.5} opacity={0.17} />
      </pattern>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="#d9c092" />
    <rect x={28} y={28} width={1864} height={1024} fill="url(#kostiDottedGrid)" />
    <rect x={28} y={28} width={1864} height={1024} fill="url(#kostiFineGrid)" />
    {/* Route d'acces : la file de civils (de ~470,835 a ~700,630) remonte cette route jusqu'aux pompes.
        Bande sable clair + axe pointille, elle relie la file au pied de la station (STATION_CENTER). */}
    <path d="M300 980 C 480 900 640 800 760 660 C 810 600 850 560 890 536"
      fill="none" stroke="#cdb384" strokeWidth={46} strokeLinecap="round" opacity={0.7} />
    <path d="M300 980 C 480 900 640 800 760 660 C 810 600 850 560 890 536"
      fill="none" stroke="#8a7350" strokeWidth={2} strokeDasharray="12 12" opacity={0.55} />
    {/* Cadre "etat-major" (repris du decor Sol, SANS cartouche CARTE DE SITUATION ni titre) */}
    <rect x={28} y={28} width={1864} height={1024} fill="none" stroke="#512923" strokeWidth={6} />
    <rect x={42} y={42} width={1836} height={996} fill="none" stroke="#725043" strokeWidth={2} />
    <path d="M28 62 H56 M42 28 V76 M1864 28 V76 M1892 62 H1864 M28 1018 H56 M42 1052 V1004 M1864 1052 V1004 M1892 1018 H1864"
      fill="none" stroke="#512923" strokeWidth={4} />
  </svg>
);

// ── Station K3 (extraits _k3-refonte-ref/kosti-k3-extraits.json) — decor STATIQUE ──
// Extraits nettoyes : opacites d'apparition liees a f RETIREES (decor present des f=0), surcouches de
// destruction #4a1f18 (f>150) RETIREES (l'assombrissement a l'impact n'est pas gere ici — fumee/impact
// prod suffisent), apostrophes d'attributs -> guillemets.
// ALIGNEMENT : la station K3 est dessinee ~centree (1010,500) dans son viewBox 1920x1080. On la recale
// sur STATION_CENTER {744,526} via translate(DX DY) avec DX = 744-1010 = -266, DY = 526-500 = +26.
// Alignement + mise a l'echelle : la station K3 est dessinee ~centree (1010,500). On la recale sur
// STATION_CENTER et on l'agrandit (scale 1.35) autour de ce centre pour qu'elle porte la scene (la
// version brute etait trop petite/excentree). scale autour d'un point p = translate(p) scale(s) translate(-p).
const STATION_SCALE = 1.35;
const STATION_SRC = { x: 1010, y: 500 }; // centre approx de la station dans le repere K3
const StationDecor: React.FC = () => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    <g transform={`translate(${STATION_CENTER.x} ${STATION_CENTER.y}) scale(${STATION_SCALE}) translate(${-STATION_SRC.x} ${-STATION_SRC.y})`}>
      {/* auvent + 3 pompes + boutique + cuve + camion-citerne */}
      <g>
        <rect x={915} y={420} width={340} height={222} fill="none" stroke="#2b2117" strokeWidth={1} strokeDasharray="7 6" opacity={0.5} />
        <rect x={950} y={448} width={160} height={64} fill="#e7bd78" fillOpacity={0.35} stroke="#2b2117" strokeWidth={1.4} />
        <rect x={954} y={452} width={152} height={56} fill="none" stroke="#2b2117" strokeWidth={0.7} />
        <rect x={950} y={448} width={4} height={4} fill="#2b2117" />
        <rect x={1106} y={448} width={4} height={4} fill="#2b2117" />
        <rect x={950} y={508} width={4} height={4} fill="#2b2117" />
        <rect x={1106} y={508} width={4} height={4} fill="#2b2117" />
        <rect x={972} y={475} width={16} height={10} fill="#f2ebd9" stroke="#2b2117" strokeWidth={1.2} />
        <line x1={980} y1={475} x2={980} y2={485} stroke="#2b2117" strokeWidth={0.6} />
        <rect x={1022} y={475} width={16} height={10} fill="#f2ebd9" stroke="#2b2117" strokeWidth={1.2} />
        <line x1={1030} y1={475} x2={1030} y2={485} stroke="#2b2117" strokeWidth={0.6} />
        <rect x={1072} y={475} width={16} height={10} fill="#f2ebd9" stroke="#2b2117" strokeWidth={1.2} />
        <line x1={1080} y1={475} x2={1080} y2={485} stroke="#2b2117" strokeWidth={0.6} />
        <rect x={1130} y={440} width={92} height={62} fill="#c7a977" stroke="#2b2117" strokeWidth={1.4} />
        <rect x={1133} y={443} width={86} height={56} fill="none" stroke="#2b2117" strokeWidth={0.5} />
        <path d="M1130 502 L1192 440 M1130 488 L1176 440" stroke="#2b2117" strokeWidth={0.6} opacity={0.6} />
        <rect x={1150} y={486} width={12} height={16} fill="none" stroke="#2b2117" strokeWidth={0.8} />
        <circle cx={940} cy={600} r={20} fill="#e7bd78" fillOpacity={0.5} stroke="#2b2117" strokeWidth={1.4} />
        <circle cx={940} cy={600} r={12} fill="none" stroke="#2b2117" strokeWidth={0.7} />
        <path d="M953 585 L985 515" stroke="#2b2117" strokeWidth={0.9} strokeDasharray="4 4" fill="none" />
        <ellipse cx={1046} cy={610} rx={40} ry={13} fill="#c7a977" stroke="#2b2117" strokeWidth={1.3} />
        <rect x={1086} y={599} width={24} height={22} fill="#e7bd78" stroke="#2b2117" strokeWidth={1.2} />
      </g>
      {/* camion 1 */}
      <g transform="translate(865 598) rotate(-30)">
        <rect x={-16} y={-7.5} width={32} height={15} fill="#c7a977" stroke="#2b2117" strokeWidth={1.3} />
        <rect x={-5} y={-5} width={12} height={10} fill="#e7bd78" fillOpacity={0.55} stroke="#2b2117" strokeWidth={0.7} />
        <line x1={8} y1={-7.5} x2={8} y2={7.5} stroke="#2b2117" strokeWidth={0.7} />
      </g>
      {/* camion 2 */}
      <g transform="translate(795 624) rotate(-38)">
        <rect x={-16} y={-7.5} width={32} height={15} fill="#c7a977" stroke="#2b2117" strokeWidth={1.3} />
        <rect x={-5} y={-5} width={12} height={10} fill="#e7bd78" fillOpacity={0.55} stroke="#2b2117" strokeWidth={0.7} />
        <line x1={8} y1={-7.5} x2={8} y2={7.5} stroke="#2b2117" strokeWidth={0.7} />
      </g>
      {/* label CUVE retire (coupe par un portrait civil ; non essentiel a la lecture) */}
    </g>
  </svg>
);

const NileAnime: React.FC<{ frame: number }> = ({ frame }) => {
  const flow = (frame * 0.9) % 27;
  const flow2 = (frame * 0.6) % 28;
  const reflect = (phase: number) => 0.12 + 0.1 * (Math.sin(frame * 0.05 + phase) * 0.5 + 0.5);
  // Nil affine (largeur reduite ~0.62) et pousse vers le bord droit : dans la version brute il etait
  // trop large et dominait la scene. Il joue le role de repere geographique en bordure, pas d'element central.
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    <g transform="translate(560 0) scale(0.42 1)">
      <path d="M1110 0 C1096 130 1100 252 1125 365 C1145 456 1141 529 1112 606 C1081 689 1075 773 1090 865 C1102 942 1101 1014 1092 1080 L1264 1080 C1275 1002 1272 924 1262 850 C1249 757 1255 692 1284 611 C1314 527 1319 437 1298 341 C1276 238 1274 121 1284 0 Z"
        fill="#718999" stroke="#4f6979" strokeWidth={4} />
      <path d="M1150 0 C1138 200 1150 420 1120 620 C1095 800 1110 950 1100 1080" fill="none" stroke="#8fa6b3" strokeWidth={14} opacity={reflect(0)} strokeLinecap="round" />
      <path d="M1230 0 C1240 220 1230 440 1250 640 C1262 820 1250 960 1245 1080" fill="none" stroke="#8fa6b3" strokeWidth={10} opacity={reflect(2.1)} strokeLinecap="round" />
      <path d="M1194 0 C1181 132 1187 249 1209 355 C1228 447 1224 524 1197 601 C1168 686 1163 772 1177 858 C1189 938 1188 1008 1179 1080" fill="none" stroke="#c3b691" strokeWidth={2} strokeDasharray="13 14" strokeDashoffset={-flow} opacity={0.6} />
      <path d="M1095 0 C1081 133 1086 255 1111 369 C1130 457 1126 524 1098 602" fill="none" stroke="#405967" strokeWidth={2} strokeDasharray="10 18" strokeDashoffset={-flow2} opacity={0.5} />
      <path d="M1279 0 C1268 124 1271 238 1293 343 C1314 439 1309 527 1279 609" fill="none" stroke="#405967" strokeWidth={2} strokeDasharray="10 18" strokeDashoffset={-flow * 1.1} opacity={0.5} />
    </g>
      {/* label hors du groupe comprime pour garder une graisse de texte normale */}
      <text x={1065} y={892} fill="#334c5a" fontFamily="Georgia, serif" fontSize={22} fontStyle="italic" letterSpacing={4} textAnchor="middle" opacity={0.86}>NIL BLANC</text>
    </svg>
  );
};

const CivilToken: React.FC<{ x: number; y: number; asset: string; appearAt: number; extinctAt: number | null; frame: number; idx: number; impactAt: number }> =
  ({ x, y, asset, appearAt, extinctAt, frame, idx, impactAt }) => {
    const appear = clampI(frame, appearAt, appearAt + 14);
    const dead = extinctAt !== null && frame >= extinctAt;
    // RETOUR AZIZ : apres la frappe, les jetons ecartes ne DOIVENT PAS revenir a la file. Une fois eteints
    // ils DISPARAISSENT TOTALEMENT (opacite -> 0, pas 0.1) et RESTENT figes a leur position d'ecartement.
    const alive = extinctAt === null || frame < extinctAt ? 1
      : interpolate(frame, [extinctAt, extinctAt + 26], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // idle (respiration de la file) UNIQUEMENT tant que le civil est vivant — gele des l'extinction pour
    // qu'il ne semble pas "bouger/revenir" une fois touche.
    const idle = dead ? 0 : Math.sin((frame + idx * 11) * 0.06) * 1.4;

    // La file se BRISE a l'impact : chaque civil s'ECARTE de l'impact (direction opposee au souffle).
    const dx0 = x - IMPACT.x;
    const dy0 = y - IMPACT.y;
    const dist = Math.max(1, Math.hypot(dx0, dy0));
    const ux = dx0 / dist;
    const uy = dy0 / dist;
    // FIX retraction : le fleeMax d'un mort ne doit JAMAIS retomber sous sa valeur "vivant" — sinon le
    // jeton qui a d'abord fui vivant (~58+idx*6) recule vers la file au moment de la mort. On gele donc
    // fleeMax a la valeur vivante pour tous (mort comme vivant) : dispersion -> FIGE a l'ecartement max -> fade.
    const fleeMax = 58 + idx * 6;
    // fuite ARRETEE a l'extinction : le civil se FIGE a sa position d'ecartement (frame gelee = extinctAt),
    // il n'y a plus aucun mouvement apres la mort (ni retour, ni derive). Pour un vivant, la fuite continue.
    const fleeFrame = dead ? (extinctAt as number) : frame;
    const flee = interpolate(fleeFrame, [impactAt, impactAt + 40], [0, fleeMax], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
    const fx = ux * flee;
    const fy = uy * flee;
    // les morts basculent (petite rotation de chute figee) ; les vivants restent droits.
    const tilt = dead ? interpolate(frame, [extinctAt as number, (extinctAt as number) + 20], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

    if (appear * alive <= 0.001) return null; // une fois disparu, plus rien (pas de fantome a 0.1)
    return (
      <div style={{ position: "absolute", left: x + fx, top: y + fy + idle, transform: `translate(-50%,-50%) rotate(${tilt}deg)`, width: 38, height: 38, borderRadius: "50%", opacity: appear * alive, border: "2.4px solid #5c4d38", background: IVORY, overflow: "hidden", boxShadow: "0 4px 6px rgba(26,11,8,0.45)" }}>
        <Img src={staticFile(`_shared/sprites/warmap/${asset}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: dead ? "grayscale(1)" : "none" }} />
      </div>
    );
  };

// Corps quadrirotor K3 (extrait drone_body_rotate155). Dessine centre sur l'origine (0,0), rotors qui
// tournent via `f` (useCurrentFrame global). Rendu inline dans un <svg> centre, scale 1.6 pour lisibilite
// (corps brut ~±21 unites -> ~±34 apres scale, tient dans le viewBox -46..46). rotate(155) = design K3.
// EXPORTE (2026-07-22) : reutilise par le globe Acte 3 (SoudanActe3GlobeInsert) qui remplace ses
// sprites drone PNG par ce vrai drone SVG vectoriel (net a toute echelle, coherent inter-actes).
export const DRONE_SVG = 92; // px (taille coherente avec l'ancien sprite)
export const DroneBodyK3: React.FC<{ f: number }> = ({ f }) => (
  <svg width={DRONE_SVG} height={DRONE_SVG} viewBox="-46 -46 92 92" style={{ overflow: "visible", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))" }}>
    <g transform="scale(1.6)">
      <g transform="rotate(155)">
        <polygon points="14,0 5,5 5,-5" fill="#4a1f18" />
        <line x1={-14} y1={-14} x2={14} y2={14} stroke="#4a1f18" strokeWidth={2.4} />
        <line x1={-14} y1={14} x2={14} y2={-14} stroke="#4a1f18" strokeWidth={2.4} />
        <circle r={6} fill="#8a2a20" />
        <g transform={`rotate(${f * 16} 14 14)`}>
          <circle cx={14} cy={14} r={7} fill="none" stroke="#8a2a20" strokeWidth={1.4} />
          <line x1={8} y1={14} x2={20} y2={14} stroke="#8a2a20" strokeWidth={1.2} />
        </g>
        <g transform={`rotate(${-f * 16} -14 14)`}>
          <circle cx={-14} cy={14} r={7} fill="none" stroke="#8a2a20" strokeWidth={1.4} />
          <line x1={-20} y1={14} x2={-8} y2={14} stroke="#8a2a20" strokeWidth={1.2} />
        </g>
        <g transform={`rotate(${-f * 16} 14 -14)`}>
          <circle cx={14} cy={-14} r={7} fill="none" stroke="#8a2a20" strokeWidth={1.4} />
          <line x1={8} y1={-14} x2={20} y2={-14} stroke="#8a2a20" strokeWidth={1.2} />
        </g>
        <g transform={`rotate(${f * 16} -14 -14)`}>
          <circle cx={-14} cy={-14} r={7} fill="none" stroke="#8a2a20" strokeWidth={1.4} />
          <line x1={-20} y1={-14} x2={-8} y2={-14} stroke="#8a2a20" strokeWidth={1.2} />
        </g>
      </g>
    </g>
  </svg>
);

const DroneStrike: React.FC<{ frame: number; startAt: number; impactAt: number }> = ({ frame, startAt, impactAt }) => {
  const local = frame - startAt;
  if (local < 0) return null;
  const dur = impactAt - startAt;
  const t = interpolate(local, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const mid = { x: (DRONE_ENTRY.x + IMPACT.x) / 2 + 40, y: (DRONE_ENTRY.y + IMPACT.y) / 2 - 30 };
  const pos = quad(DRONE_ENTRY, mid, IMPACT, t);
  const behind = quad(DRONE_ENTRY, mid, IMPACT, Math.max(0, t - 0.02));
  const heading = (Math.atan2(pos.y - behind.y, pos.x - behind.x) * 180) / Math.PI;
  const droneOp = interpolate(local, [0, 8, dur - 4, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trailOp = droneOp * 0.5;
  const trail = [0.04, 0.08, 0.13].map((d) => quad(DRONE_ENTRY, mid, IMPACT, Math.max(0, t - d)));
  return (
    <>
      {trail.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-50%)", width: 6 - i * 1.4, height: 6 - i * 1.4, borderRadius: "50%", background: RED, opacity: trailOp * (1 - i * 0.28) }} />
      ))}
      <div style={{ position: "absolute", left: pos.x, top: pos.y, transform: `translate(-50%,-50%) rotate(${heading}deg)`, opacity: droneOp }}>
        <DroneBodyK3 f={frame} />
      </div>
    </>
  );
};

const Impact: React.FC<{ frame: number; impactAt: number }> = ({ frame, impactAt }) => {
  const t = frame - impactAt;
  if (t < 0) return null;
  // LOT 4b : frappe plus violente. Flash initial plus grand et plus bref (coeur de la detonation),
  // + 3 ondes de choc (au lieu de 2), rayons agrandis, depart plus sec (easing out).
  const easeOut = Easing.out(Easing.quad);
  const flashOp = interpolate(t, [0, 3, 16], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashR = interpolate(t, [0, 3, 16], [18, 48, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // onde 1 (rouge, la plus rapide/violente)
  const r1 = interpolate(t, [0, 52], [10, 230], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const op1 = interpolate(t, [0, 6, 52], [0, 0.95, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // onde 2 (or, decalee)
  const r2 = interpolate(t, [10, 74], [10, 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const op2 = interpolate(t, [10, 20, 74], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // onde 3 (ajout — souffle large, plus tardif, plus fin)
  const r3 = interpolate(t, [22, 96], [10, 340], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const op3 = interpolate(t, [22, 34, 96], [0, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <circle cx={IMPACT.x} cy={IMPACT.y} r={r1} fill="none" stroke={RED} strokeWidth={5} opacity={op1} />
      <circle cx={IMPACT.x} cy={IMPACT.y} r={r2} fill="none" stroke="#bf9442" strokeWidth={3} opacity={op2} />
      <circle cx={IMPACT.x} cy={IMPACT.y} r={r3} fill="none" stroke={RED} strokeWidth={2} opacity={op3} />
      <circle cx={IMPACT.x} cy={IMPACT.y} r={flashR} fill={IVORY} opacity={flashOp} />
    </svg>
  );
};

const SmokeCol: React.FC<{ frame: number; smokeAt: number; ax: number; ay: number; scale: number; id: string }> = ({ frame, smokeAt, ax, ay, scale, id }) => {
  const rel = frame - smokeAt;
  if (rel < 0) return null;
  const appear = interpolate(rel, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seed = Math.floor(frame / 4) % 20;
  // LOT 4b : colonne plus fournie (4 bouffees au lieu de 3) qui monte PLUS HAUT (74->118) et
  // grossit davantage. Cycle plus long (72->96) = la fumee persiste et domine la fin de scene.
  const puffs = [0, 18, 36, 54].map((offset, i) => {
    const tt = (((rel + offset) % 96) + 96) % 96 / 96;
    const py = -tt * 118 * scale;
    const sc = (0.55 + tt * 1.5) * scale;
    const op = interpolate(tt, [0, 0.12, 0.7, 1], [0, 0.6, 0.4, 0], { extrapolateRight: "clamp" }) * appear;
    // le coeur (bas de colonne, tt petit) est plus sombre/dense pres de l'impact
    const dark = tt < 0.3;
    return { py, sc, op, i, dark };
  });
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} transform={`translate(${ax} ${ay})`}>
        {puffs.map((p) => (
          <g key={p.i} transform={`translate(0 ${p.py}) scale(${p.sc})`} opacity={p.op}>
            <ellipse cx={0} cy={0} rx={19} ry={21} fill={p.dark ? "#4a3f2e" : "#6b5c42"} />
            <ellipse cx={-7} cy={-6} rx={13} ry={15} fill={p.dark ? "#3a3123" : "#5c4d38"} />
            <ellipse cx={7} cy={-2} rx={11} ry={13} fill={p.dark ? "#2e271b" : "#4a3f2e"} />
          </g>
        ))}
      </g>
    </svg>
  );
};

/**
 * KostiInsertSVG — calé sur F4 (frames locales p4). Le drone frappe sur "drone" (F4.droneFrappe),
 * les civils s'éteignent en s'étalant de l'impact jusqu'à "civils qui en payent le prix" (F4.civilsPayentPrix).
 */
export const KostiInsertSVG: React.FC<{ f4: KostiF4 }> = ({ f4 }) => {
  const frame = useCurrentFrame();

  const civilsAppear = f4.kostiNomme + 10;     // la file apparait juste après "À Kosti"
  const droneStart = f4.droneFrappe - 55;      // le drone entre ~1.8s avant l'impact
  const impactAt = f4.droneFrappe;             // frappe sur le mot "drone"
  const smokeAt = impactAt + 10;

  // extinction des civils ETALEE : de l'impact jusqu'à "civils qui en payent le prix" (registre grave,
  // pas un pop instantané). Le 1er (plus proche) juste après l'impact, le dernier à civilsPayentPrix.
  const extinctStart = impactAt + 8;
  const extinctEnd = f4.civilsPayentPrix;
  const extinctFor = (i: number): number | null => {
    const start = Math.round(extinctStart + (i / (CIVILS.length - 1)) * (extinctEnd - extinctStart));
    return frame >= start ? start : null;
  };

  return (
    <AbsoluteFill style={{ background: "#d9c092" }}>
      <MapBackdrop />
      <StationDecor />
      <NileAnime frame={frame} />

      {CIVILS.map((c, i) => (
        <CivilToken key={i} x={c.x} y={c.y} asset={c.asset} appearAt={civilsAppear + i * 7}
          extinctAt={extinctFor(i)} frame={frame} idx={i} impactAt={impactAt} />
      ))}

      <DroneStrike frame={frame} startAt={droneStart} impactAt={impactAt} />
      <Impact frame={frame} impactAt={impactAt} />
      <SmokeCol frame={frame} smokeAt={smokeAt} ax={STATION_CENTER.x} ay={STATION_CENTER.y + 30} scale={1.6} id="kostiSmokeStation" />
      <SmokeCol frame={frame} smokeAt={smokeAt} ax={IMPACT.x - 30} ay={IMPACT.y} scale={0.95} id="kostiSmokeImpact" />
    </AbsoluteFill>
  );
};

export default KostiInsertSVG;
