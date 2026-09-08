// MOTEUR: SVG pur -- QUOI/COMMENT: hook 4,5 s candidature Upwork "Earth to Suzy".
// PISTE A "Route Relay" : une seule trajectoire continue traverse la scene et
// change de FONCTION en route -- rien n'apparait, tout est propulse par ce qui
// precede. Ballon frappe -> trajectoire tendue -> le ballon devient point GPS
// -> la ligne enroule le globe -> elle repart en route aerienne.
//
// Matiere dessinee (statique) : out/_r-and-d/upwork-earthtosuzy/svg-route-relay/
// L'ANIMATION est codee ici, pas deleguee : c'est le metier.
//
// 12 principes appliques, reperes en commentaire a chaque geste :
//   ANTICIPATION      le ballon recule avant de partir
//   SQUASH & STRETCH  deformation a l'impact, volume conserve
//   ARCS              aucune translation rectiligne
//   SLOW IN/OUT       aucune vitesse lineaire
//   FOLLOW-THROUGH    la queue de trajectoire retarde ; le globe depasse puis revient
//   ACTION SECONDAIRE rotation du ballon, tremblement de sol, trainee du point
//   TIMING/SPACING    espacement resserre a l'impact, ouvert a la sortie
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const ETS_RELAY_FPS = 30;
export const ETS_RELAY_FRAMES = 135; // 4,5 s

// --- Palette (etats SVG dessines) -------------------------------------------
const PAPER = "#F7F7F5";
const INK = "#1A1A1A";
const ACCENT = "#2563EB";

// --- Timeline (30 fps) ------------------------------------------------------
const KICK = 10; // impact : le ballon part
const TRAJ_IN = 12; // la trajectoire commence a se tendre
const TRAJ_OUT = 46; // trajectoire complete
const MORPH = 50; // le ballon devient point GPS
const GLOBE_IN = 56; // le globe se construit
const ORBIT_IN = 68; // la ligne enroule le globe
const ROUTE_IN = 100; // la route repart vers la droite
const END = ETS_RELAY_FRAMES;

// Tracés repris tels quels des SVG dessinés (un seul M chacun : animables au dashoffset).
const TRAJ_D = "M 168 946 C 520 872 806 700 1020 512 S 1288 268 1420 196";
const TRAJ_LEN = 1478; // longueur MESUREE (echantillonnage dense), pas estimee
const ORBIT_D =
  "M 530 540 A 430 132 -22 0 1 1390 540 A 430 132 -22 0 1 530 540 Z";
const ORBIT_LEN = 1892; // perimetre ellipse rx=430 ry=132 (Ramanujan)
const ROUTE_D = "M 960 540 C 1180 470 1420 392 1720 300";
const ROUTE_LEN = 797; // longueur MESUREE

const GLOBE_CX = 960;
const GLOBE_CY = 540;
const GLOBE_R = 300;

/** Position sur la trajectoire, param 0..1 (approximation Bezier du tracé dessiné). */
const trajPoint = (t: number) => {
  // C 168,946 -> 1020,512 puis S -> 1420,196 : deux cubiques mises bout a bout.
  if (t <= 0.5) {
    const u = t / 0.5;
    const m = 1 - u;
    const x =
      m * m * m * 168 + 3 * m * m * u * 520 + 3 * m * u * u * 806 + u * u * u * 1020;
    const y =
      m * m * m * 946 + 3 * m * m * u * 872 + 3 * m * u * u * 700 + u * u * u * 512;
    return { x, y };
  }
  const u = (t - 0.5) / 0.5;
  const m = 1 - u;
  // S : le 1er point de controle est la REFLEXION du precedent autour de 1020,512
  //     -> (2*1020 - 806, 2*512 - 700) = (1234, 324). Puis 1288,268 et 1420,196.
  const x =
    m * m * m * 1020 + 3 * m * m * u * 1234 + 3 * m * u * u * 1288 + u * u * u * 1420;
  const y =
    m * m * m * 512 + 3 * m * m * u * 324 + 3 * m * u * u * 268 + u * u * u * 196;
  return { x, y };
};

export const IntroRouteRelay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === ANTICIPATION : le ballon recule et se comprime avant de partir ========
  // Recul de 0 a KICK, avec un ease qui accelere vers l'arriere (charge d'energie).
  const windUp = interpolate(frame, [0, KICK], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.9, 0.6),
  });
  const preKickDx = -windUp * 46;
  const preKickDy = windUp * 16;

  // === TRAJECTOIRE : se tend derriere le ballon (SLOW IN/OUT) ================
  const trajT = interpolate(frame, [TRAJ_IN, TRAJ_OUT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 0.9, 0.3, 1), // depart vif, freinage long
  });

  // Le ballon EST la tete de la trajectoire : ARCS (jamais une translation droite).
  // La ligne est tracee jusqu'a lui exactement -- c'est ce qui vend la propulsion.
  const ballPos = trajPoint(trajT);
  const flying = frame >= KICK && frame < MORPH;

  // FOLLOW-THROUGH : la QUEUE (le debut du trait) se retire avec un retard,
  // de sorte que le trait s'efface derriere le ballon au lieu de le devancer.
  const tailT = trajT;

  // === SQUASH & STRETCH a l'impact (volume conserve : sx * sy ~ 1) ===========
  const impact = spring({
    frame: frame - KICK,
    fps,
    config: { damping: 9, mass: 0.5, stiffness: 200 },
    durationInFrames: 20,
  });
  // etire dans l'axe du depart juste apres le contact, puis revient
  const stretch = frame >= KICK && frame < KICK + 20 ? (1 - impact) * 0.32 : 0;
  const ballSx = 1 + stretch;
  const ballSy = 1 - stretch * 0.72;

  // ACTION SECONDAIRE : le ballon tourne pendant le vol.
  const ballSpin = interpolate(frame, [KICK, MORPH], [0, 168], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ACTION SECONDAIRE : le sol encaisse le coup et vibre brievement.
  const groundShake =
    frame >= KICK && frame < KICK + 12
      ? Math.sin((frame - KICK) * 1.5) * (1 - (frame - KICK) / 12) * 5
      : 0;

  // === MORPH : le ballon devient point GPS ==================================
  const morph = interpolate(frame, [MORPH, MORPH + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });

  // === GLOBE : se construit, depasse puis revient (FOLLOW-THROUGH) ===========
  const globeIn = spring({
    frame: frame - GLOBE_IN,
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
    durationInFrames: 30,
  });
  // SQUASH discret pendant la construction : l'ovale revient rond.
  const globeSquash = frame >= GLOBE_IN ? (1 - globeIn) * 0.14 : 0.14;

  // === ORBITE : la ligne enroule le globe ===================================
  const orbitT = interpolate(frame, [ORBIT_IN, ORBIT_IN + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.6, 0.2, 1),
  });

  // === ROUTE : elle repart, sans que rien ne s'arrete =======================
  const routeT = interpolate(frame, [ROUTE_IN, END - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.75, 0.35, 1),
  });

  // La trajectoire initiale se retire pendant que l'orbite prend le relais :
  // c'est le meme trait qui change de fonction, jamais deux traits concurrents.
  const trajFade = interpolate(frame, [ORBIT_IN, ORBIT_IN + 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gpsOpacity = interpolate(frame, [MORPH, MORPH + 8, ORBIT_IN + 20, ORBIT_IN + 30], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {/* --- sol : encaisse l'impact ------------------------------------- */}
        <g transform={`translate(0 ${groundShake})`} opacity={interpolate(frame, [MORPH, MORPH + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <path
            d="M 130 1000 L 760 1000"
            fill="none"
            stroke={INK}
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>

        {/* --- trajectoire : se tend derriere le ballon --------------------- */}
        <g opacity={trajFade}>
          <path
            d={TRAJ_D}
            fill="none"
            stroke={ACCENT}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={TRAJ_LEN}
            strokeDashoffset={TRAJ_LEN * (1 - tailT)}
          />
        </g>

        {/* --- globe : se construit apres le morph -------------------------- */}
        {frame >= GLOBE_IN && (
          <g
            transform={`translate(${GLOBE_CX} ${GLOBE_CY}) scale(${1 + globeSquash} ${1 - globeSquash}) translate(${-GLOBE_CX} ${-GLOBE_CY})`}
            opacity={globeIn}
          >
            <circle
              cx={GLOBE_CX}
              cy={GLOBE_CY}
              r={GLOBE_R * globeIn}
              fill="none"
              stroke={INK}
              strokeWidth={6}
            />
            <g opacity={interpolate(globeIn, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <ellipse cx={GLOBE_CX} cy={392} rx={261} ry={24.8} fill="none" stroke={INK} strokeWidth={4} />
              <ellipse cx={GLOBE_CX} cy={GLOBE_CY} rx={300} ry={40} fill="none" stroke={INK} strokeWidth={4} />
              <ellipse cx={GLOBE_CX} cy={688} rx={261} ry={24.8} fill="none" stroke={INK} strokeWidth={4} />
              {/* meridiens : le median s'ouvre en largeur = rotation suggeree */}
              <ellipse cx={GLOBE_CX} cy={GLOBE_CY} rx={300} ry={300} fill="none" stroke={INK} strokeWidth={4} />
              <ellipse
                cx={GLOBE_CX}
                cy={GLOBE_CY}
                rx={Math.abs(Math.cos((frame - GLOBE_IN) / 26) * 148) + 6}
                ry={300}
                fill="none"
                stroke={INK}
                strokeWidth={4}
              />
            </g>
          </g>
        )}

        {/* --- orbite : la ligne enroule le globe --------------------------- */}
        {frame >= ORBIT_IN && (
          <path
            d={ORBIT_D}
            fill="none"
            stroke={ACCENT}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={ORBIT_LEN}
            strokeDashoffset={ORBIT_LEN * (1 - orbitT)}
          />
        )}

        {/* --- route : repart vers la droite, rien ne s'arrete -------------- */}
        {frame >= ROUTE_IN && (
          <path
            d={ROUTE_D}
            fill="none"
            stroke={ACCENT}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={ROUTE_LEN}
            strokeDashoffset={ROUTE_LEN * (1 - routeT)}
          />
        )}

        {/* --- point GPS : ce que le ballon est devenu ---------------------- */}
        {frame >= MORPH && (
          <g opacity={gpsOpacity} transform={`translate(${ballPos.x - 1122} ${ballPos.y - 317}) scale(${morph})`} style={{ transformOrigin: "1122px 317px" }}>
            <path
              d="M 1122 236 C 1184 236 1184 314 1151 357 L 1122 398 L 1093 357 C 1060 314 1060 236 1122 236 Z"
              fill={ACCENT}
            />
            <circle cx={1122} cy={285} r={22} fill={PAPER} />
          </g>
        )}

        {/* --- ballon : ANTICIPATION -> SQUASH -> ARCS -> ACTION SECONDAIRE -- */}
        {frame < MORPH && (
          <g
            transform={`translate(${(flying ? ballPos.x : 168 + preKickDx) - 0} ${(flying ? ballPos.y : 946 + preKickDy) - 0})`}
            opacity={1 - morph}
          >
            <g transform={`rotate(${ballSpin}) scale(${ballSx} ${ballSy})`}>
              <circle cx={0} cy={0} r={96} fill={PAPER} stroke={INK} strokeWidth={8} />
              <path
                d="M 0 -42 L 39.9 -13 L 24.7 34 L -24.7 34 L -39.9 -13 Z"
                fill={INK}
              />
              <path
                d="M 0 -42 L 0 -96 M 39.9 -13 L 91.3 -29.7 M 24.7 34 L 56.4 77.7 M -24.7 34 L -56.4 77.7 M -39.9 -13 L -91.3 -29.7"
                fill="none"
                stroke={INK}
                strokeWidth={6}
                strokeLinecap="round"
              />
            </g>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
