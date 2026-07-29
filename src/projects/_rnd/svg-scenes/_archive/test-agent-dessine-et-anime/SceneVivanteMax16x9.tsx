import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  PORT_DEFS,
  PLAN_RIVE_LOINTAINE,
  PLAN_RIVE_MEDIANE,
  PLAN_QUAI,
  PLAN_AVANT_QUAI,
  HORIZON_Y,
  QUAI_Y,
  CRANES,
  BOATS,
  LAMPS,
  SHEDS,
  CRATES,
  DOCKERS,
  BIRDS_PORT,
  RIVER_REFLECTS,
  RIPPLES,
  STARS_PORT,
  BRAZIERS,
  SUN_CX,
  SUN_BASE_CY,
  SUN_END_CY,
} from "./portFluvialGroups";

// ---------------------------------------------------------------------------
// "LE PORT S'EVEILLE" — scene-lieu vivante, 24 s @ 30 fps (720 frames).
//
// LIEU : un port fluvial ouest-africain, vu depuis le quai, juste avant l'aube.
// ARC  : nuit bleue -> premiere lueur -> soleil qui perce l'horizon -> plein or.
//        En parallele, l'activite MONTE : les braseros brulent seuls dans le noir,
//        puis les fenetres s'allument, les grues se mettent en marche, les dockers
//        traversent le quai, les barges remontent le fleuve, la fumee part.
//
// 6 COUCHES D'ANIMATION SIMULTANEES ET PERMANENTES :
//   1) PARALLAXE     : 6 plans qui derivent a des vitesses croissantes.
//   2) LUMIERE       : soleil qui monte, ciel nuit->aube, wash chaud, etoiles.
//   3) EAU           : ~90 rides + 10 bandes de reflet, chacune a sa phase propre.
//   4) MACHINES      : 3 grues (fleche qui balaie, cable qui leve/descend).
//   5) VEHICULES     : 4 embarcations qui glissent + tanguent + rament.
//   6) VIVANTS       : 6 dockers de profil (marche cyclique), 7 oiseaux qui battent.
//   + micro-vie      : braseros qui palpitent, fumee qui monte, lampes qui s'eteignent.
//
// REGLE INERTE : hangars, caisses, bittes, grues NE GLISSENT JAMAIS. Ils sont poses
// des la frame 0 ; seule leur LUMIERE change. Seuls bateaux, dockers et oiseaux
// se deplacent. Les grues ont un mouvement mecanique (rotation de fleche) et non
// un glissement.
//
// PERSPECTIVE : toute taille au sol derive de scaleFromDepth(depth) — formule
// UNIQUE, jamais reglee element par element.
//
// Frame-driven pur : useCurrentFrame + interpolate + spring. Zero CSS transition,
// zero @keyframes, zero setTimeout, zero SMIL.
// ---------------------------------------------------------------------------

export const SCENE_VIVANTE_FRAMES = 720; // 24 s @ 30 fps

const W = 1920;
const H = 1080;
const DUR = SCENE_VIVANTE_FRAMES;

// --- PERSPECTIVE : formule unique. depth 0 = horizon, 1 = tout pres du bord.
// Echelle lineaire de 0.30 (loin) a 1.15 (pres). Un element plus loin ne peut
// donc JAMAIS etre plus grand qu'un element plus proche.
export const scaleFromDepth = (depth: number): number => 0.3 + 0.85 * depth;

// --- LIGNE DE SOL : ou se posent les pieds d'un element de profondeur donnee.
// Au loin -> pres de l'horizon ; pres -> sur le quai. Formule unique elle aussi.
export const groundYFromDepth = (depth: number): number =>
  HORIZON_Y + (QUAI_Y - HORIZON_Y) * depth;

// --- LIGNE DE QUAI ARRIERE : les grues sont posees sur le quai, en retrait.
// Elles ne "flottent" donc jamais sur le fleuve : leur pied reste dans une bande
// etroite juste derriere la dalle, entre QUAI_BACK_Y et QUAI_Y.
export const QUAI_BACK_Y = QUAI_Y - 52;
export const craneFootY = (depth: number): number =>
  QUAI_BACK_Y + (QUAI_Y - QUAI_BACK_Y) * depth;

// --- LIGNE D'EAU : les bateaux flottent entre l'horizon et le pied du quai.
// On garde une marge de 70 px sous l'horizon pour que meme la barge la plus
// lointaine ne touche pas la rive, et on s'arrete AVANT la dalle du quai.
export const waterYFromDepth = (depth: number): number =>
  HORIZON_Y + 70 + (QUAI_Y - HORIZON_Y - 150) * depth;

const Inject: React.FC<{ html: string; transform?: string }> = ({ html, transform }) => (
  <g transform={transform} dangerouslySetInnerHTML={{ __html: html }} />
);

// ---------------------------------------------------------------------------
// DOCKER : silhouette de PROFIL, marche cyclique (hanche/genou/bras contra-lateral).
// Aucun visage. La pose change a chaque frame -> il marche, il ne glisse pas.
// Unites locales : hauteur ~ 100 (tete en y=-100, pieds en y=0).
// ---------------------------------------------------------------------------
const DockerFigure: React.FC<{
  t: number; // phase de marche en radians
  load: "none" | "head" | "shoulder";
  fill: string;
  facing: number; // +1 = vers la droite, -1 = vers la gauche
}> = ({ t, load, fill, facing }) => {
  const s = Math.sin(t);
  const c = Math.cos(t);

  // Bassin : rebond vertical a double frequence (2 appuis par cycle).
  const hipY = -52 + 2.4 * Math.abs(Math.cos(t));
  // Buste : legere avance quand on porte une charge sur la tete.
  const lean = load === "head" ? -3 : load === "shoulder" ? -5 : -2;

  // Jambes : cuisse avant/arriere en opposition, genou qui plie sur la phase de vol.
  const thighA = 26 * s;
  const thighB = -26 * s;
  const kneeA = Math.max(0, 34 * -c) * 0.7;
  const kneeB = Math.max(0, 34 * c) * 0.7;

  const legPath = (thigh: number, knee: number) => {
    const hx = 0;
    const hy = hipY;
    const kx = hx + Math.sin((thigh * Math.PI) / 180) * 26;
    const ky = hy + Math.cos((thigh * Math.PI) / 180) * 26;
    const shin = thigh - knee;
    const fx = kx + Math.sin((shin * Math.PI) / 180) * 26;
    const fy = ky + Math.cos((shin * Math.PI) / 180) * 26;
    return `M ${hx} ${hy} L ${kx} ${ky} L ${fx} ${fy}`;
  };

  // Bras : contra-lateraux aux jambes. Si charge sur la tete, un bras la tient.
  const armSwingA = -22 * s;
  const armSwingB = 22 * s;
  const armPath = (swing: number, raised: boolean) => {
    const sx = 0;
    const sy = hipY - 30;
    const a = raised ? -155 : swing;
    const ex = sx + Math.sin((a * Math.PI) / 180) * 21;
    const ey = sy + Math.cos((a * Math.PI) / 180) * 21;
    const b = raised ? -168 : a - 16;
    const hx2 = ex + Math.sin((b * Math.PI) / 180) * 20;
    const hy2 = ey + Math.cos((b * Math.PI) / 180) * 20;
    return `M ${sx} ${sy} L ${ex} ${ey} L ${hx2} ${hy2}`;
  };

  return (
    <g transform={`scale(${facing} 1)`} fill="none" stroke={fill} strokeLinecap="round">
      {/* jambe arriere (plus claire pour la profondeur) */}
      <path d={legPath(thighB, kneeB)} strokeWidth={7} opacity={0.72} />
      {/* bras arriere */}
      <path d={armPath(armSwingB, load === "head")} strokeWidth={5.4} opacity={0.72} />
      {/* buste */}
      <path
        d={`M 0 ${hipY} L ${Math.sin((lean * Math.PI) / 180) * 32} ${hipY - 32}`}
        strokeWidth={9}
      />
      {/* tete (profil : un cercle + une nuque, aucun visage) */}
      <circle
        cx={Math.sin((lean * Math.PI) / 180) * 32 + 1.5}
        cy={hipY - 43}
        r={10.5}
        fill={fill}
        stroke="none"
      />
      {/* charge */}
      {load === "head" && (
        <g stroke="none">
          <ellipse
            cx={Math.sin((lean * Math.PI) / 180) * 32 + 1}
            cy={hipY - 60 + 1.2 * c}
            rx={20}
            ry={8}
            fill={fill}
            opacity={0.92}
          />
          <rect
            x={Math.sin((lean * Math.PI) / 180) * 32 - 17}
            y={hipY - 76 + 1.2 * c}
            width={34}
            height={17}
            rx={3}
            fill={fill}
            opacity={0.85}
          />
        </g>
      )}
      {load === "shoulder" && (
        <path
          d={`M ${Math.sin((lean * Math.PI) / 180) * 32 - 4} ${hipY - 30}
              q -20 -18 -34 -2 q 8 20 30 12 z`}
          fill={fill}
          stroke="none"
          opacity={0.9}
          transform={`translate(0 ${0.9 * c})`}
        />
      )}
      {/* jambe avant */}
      <path d={legPath(thighA, kneeA)} strokeWidth={7.6} />
      {/* bras avant */}
      <path d={armPath(armSwingA, false)} strokeWidth={5.8} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// GRUE : objet mecanique inerte en translation. Le mat ne bouge pas ; la fleche
// pivote autour du sommet du mat ; le cable descend/monte avec une charge.
// ---------------------------------------------------------------------------
const CraneFigure: React.FC<{
  frame: number;
  mastH: number;
  jibLen: number;
  phase: number;
  cycle: number;
  baseAngle: number;
  sweep: number;
  active: number; // 0 = grue a l'arret, 1 = grue en pleine activite
  stroke: string;
}> = ({ frame, mastH, jibLen, phase, cycle, baseAngle, sweep, active, stroke }) => {
  const u = ((frame + phase) % cycle) / cycle; // 0 -> 1, cycle de levage
  // Balayage de la fleche : va-et-vient doux (cosinus), amplitude modulee par activite.
  const jibAngle = baseAngle + active * sweep * 0.5 * (1 - Math.cos(u * Math.PI * 2));
  // Cable : descend (u 0->0.35), remonte charge (0.35->0.7), attend (0.7->1).
  const cableDown =
    interpolate(u, [0, 0.34, 0.68, 1], [0.15, 1, 0.12, 0.15], { extrapolateRight: "clamp" }) *
    (mastH * 0.62) *
    (0.35 + 0.65 * active);
  const hasLoad = u > 0.34 && u < 0.72 ? 1 : 0;

  const rad = (jibAngle * Math.PI) / 180;
  const tipX = Math.cos(rad) * jibLen;
  const tipY = -mastH + Math.sin(rad) * jibLen;
  // contre-fleche (equilibrage) cote oppose
  const cbX = -Math.cos(rad) * jibLen * 0.34;
  const cbY = -mastH - Math.sin(rad) * jibLen * 0.34;

  return (
    <g fill="none" stroke={stroke} strokeLinecap="round">
      {/* embase */}
      <path d={`M -26 0 L -14 -18 L 14 -18 L 26 0 Z`} fill={stroke} stroke="none" opacity={0.9} />
      {/* mat en treillis */}
      <path d={`M -11 -18 L -7 ${-mastH} M 11 -18 L 7 ${-mastH}`} strokeWidth={6} />
      <path
        d={Array.from({ length: 7 }, (_, i) => {
          const y0 = -18 - (i * (mastH - 18)) / 7;
          const y1 = -18 - ((i + 1) * (mastH - 18)) / 7;
          const sgn = i % 2 === 0 ? 1 : -1;
          return `M ${-10 * sgn} ${y0} L ${10 * sgn} ${y1}`;
        }).join(" ")}
        strokeWidth={3}
        opacity={0.75}
      />
      {/* fleche + contre-fleche */}
      <g>
        <path d={`M 0 ${-mastH} L ${tipX} ${tipY}`} strokeWidth={6.5} />
        <path d={`M 0 ${-mastH} L ${cbX} ${cbY}`} strokeWidth={5.5} />
        {/* haubans */}
        <path
          d={`M 0 ${-mastH - 42} L ${tipX * 0.72} ${tipY + (mastH + tipY) * -0.0 - 6}`}
          strokeWidth={2.4}
          opacity={0.7}
        />
        <path d={`M 0 ${-mastH} L 0 ${-mastH - 42} L ${cbX * 0.9} ${cbY - 4}`} strokeWidth={2.4} opacity={0.7} />
        {/* contrepoids */}
        <rect x={cbX - 13} y={cbY - 9} width={26} height={18} rx={2} fill={stroke} stroke="none" opacity={0.92} />
        {/* cable + crochet */}
        <path d={`M ${tipX} ${tipY} L ${tipX} ${tipY + cableDown}`} strokeWidth={2.2} opacity={0.85} />
        <path d={`M ${tipX - 5} ${tipY + cableDown} l 10 0`} strokeWidth={3} />
        {/* charge suspendue (conteneur), presente seulement pendant la remontee */}
        <rect
          x={tipX - 21}
          y={tipY + cableDown + 3}
          width={42}
          height={26}
          rx={2}
          fill={stroke}
          stroke="none"
          opacity={0.9 * hasLoad * active}
        />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// FUMEE DE CHEMINEE : 9 bouffees decalees sur un meme cycle -> flux continu.
// Chaque bouffee monte, grossit, serpente et s'efface : jamais de nuage fige.
// ---------------------------------------------------------------------------
const Smoke: React.FC<{
  chimneyX: number;
  baseY: number;
  fill: string;
  frame: number;
  activity: number;
}> = ({ chimneyX, baseY, fill, frame, activity }) => (
  <g>
    <rect x={chimneyX} y={baseY - 34} width={20} height={44} fill={fill} />
    {/* Les bouffees sont floutees ET fusionnees en un seul groupe : sans cela on
        voit une pile de cercles nets ("bulles") au lieu d'un panache. */}
    <g filter="url(#smokeBlur)">
      {Array.from({ length: 14 }, (_, k) => {
        const life = ((frame * 0.9 + k * 17) % 238) / 238;
        const y = baseY - 40 - life * 230;
        const x = chimneyX + 10 + 52 * Math.sin(life * 3.4 + k) * life;
        const r = 14 + life * 46;
        // fondu aux DEUX bouts : la bouffee nait et meurt en douceur
        const fade = Math.sin(Math.PI * life);
        // teinte SOMBRE et opacite basse : une fumee claire sur un fond sombre
        // lisait comme un faisceau de projecteur (constate au rendu v2).
        const op = fade * 0.1 * (0.35 + 0.65 * activity);
        return <circle key={k} cx={x} cy={y} r={r} fill="#4a4763" opacity={Math.max(0, op)} />;
      })}
    </g>
  </g>
);

// ---------------------------------------------------------------------------
// EMBARCATION : coque + tangage + sillage. Un bateau GLISSE (c'est credible).
// ---------------------------------------------------------------------------
const BoatFigure: React.FC<{
  frame: number;
  len: number;
  hull: string;
  sail: string;
  phase: number;
  rower: boolean;
  lightMix: number;
}> = ({ frame, len, hull, sail, phase, rower, lightMix }) => {
  const pitch = 1.6 * Math.sin(frame / 26 + phase);
  const heave = 2.2 * Math.sin(frame / 19 + phase * 1.4);
  const h = len * 0.19;
  // La rame decrit un cycle : traction (dans l'eau) puis retour (en l'air).
  const oar = Math.sin(frame / 13 + phase);
  const rim = hull === "" ? "#000" : hull;

  return (
    <g transform={`translate(0 ${heave}) rotate(${pitch})`}>
      {/* coque */}
      <path
        d={`M ${-len / 2} 0 Q ${-len / 2 + len * 0.08} ${h} ${-len * 0.24} ${h}
            L ${len * 0.28} ${h} Q ${len / 2 - len * 0.05} ${h * 0.9} ${len / 2} ${-h * 0.24}
            Q ${len * 0.1} ${h * 0.3} ${-len / 2} 0 Z`}
        fill={rim}
      />
      {/* liston clair (accroche la lumiere du matin) */}
      <path
        d={`M ${-len / 2} 0 Q ${len * 0.1} ${h * 0.3} ${len / 2} ${-h * 0.24}`}
        fill="none"
        stroke="#f0b97e"
        strokeWidth={Math.max(1.6, len * 0.014)}
        opacity={0.18 + 0.5 * lightMix}
      />
      {sail !== "" && (
        <g>
          <path d={`M ${-len * 0.04} ${-h * 0.4} L ${-len * 0.04} ${-len * 0.62}`} stroke={rim} strokeWidth={len * 0.02} />
          <path
            d={`M ${-len * 0.04} ${-len * 0.6}
                Q ${len * 0.3 + 5 * Math.sin(frame / 21 + phase)} ${-len * 0.3} ${-len * 0.02} ${-h * 0.5} Z`}
            fill={sail}
            opacity={0.9}
          />
        </g>
      )}
      {rower && (
        <g stroke={rim} fill="none" strokeLinecap="round">
          {/* rameur assis de profil : buste qui va et vient avec la nage */}
          <g transform={`translate(${-len * 0.06} ${-h * 0.15}) rotate(${9 * oar})`}>
            <path d={`M 0 0 L 0 ${-len * 0.16}`} strokeWidth={len * 0.045} />
            <circle cx={0} cy={-len * 0.2} r={len * 0.042} fill={rim} stroke="none" />
            {/* bras + rame */}
            <path
              d={`M 0 ${-len * 0.13} L ${len * 0.11} ${-len * 0.1 + len * 0.05 * oar}`}
              strokeWidth={len * 0.026}
            />
          </g>
          <path
            d={`M ${-len * 0.02} ${-h * 0.2} L ${len * 0.26} ${h * 0.55 - len * 0.1 * oar}`}
            strokeWidth={len * 0.02}
            opacity={0.9}
          />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
export const SceneVivanteMax16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =========================================================================
  // COUCHE 2 — LUMIERE : l'arc temporel de la scene.
  // =========================================================================
  // dawn : 0 = nuit noire, 1 = plein matin dore. Progression douce, non lineaire :
  // la nuit tient longtemps, puis la lumiere gagne vite quand le soleil perce.
  const dawn = interpolate(
    frame,
    [0, DUR * 0.2, DUR * 0.44, DUR * 0.68, DUR],
    [0, 0.1, 0.42, 0.82, 1],
    { extrapolateRight: "clamp" },
  );

  // Le soleil monte : sous l'horizon au debut, il perce vers 45 % puis s'eleve.
  const sunCy = interpolate(frame, [0, DUR * 0.34, DUR], [SUN_BASE_CY, SUN_BASE_CY - 40, SUN_END_CY], {
    extrapolateRight: "clamp",
  });
  // Le disque n'est visible que lorsqu'il depasse l'horizon (clip par le fleuve
  // de toute facon, mais on module aussi l'opacite pour eviter un "pop").
  // Remotion exige une inputRange STRICTEMENT CROISSANTE : on ecrit donc la plage
  // dans l'ordre croissant de sunCy et on inverse les valeurs de sortie
  // (sunCy grand = soleil bas = disque invisible).
  const sunDiscOp = interpolate(sunCy, [HORIZON_Y - 40, HORIZON_Y + 10, HORIZON_Y + 80], [1, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sunGlowOp = interpolate(frame, [0, DUR * 0.3, DUR * 0.62, DUR], [0.1, 0.42, 0.92, 0.8], {
    extrapolateRight: "clamp",
  });

  // Nappe de nuit qui se retire par le haut.
  // 0.95 ecrasait la scene de depart en noir total (verifie au rendu : frame 0
  // illisible). 0.72 laisse lire le port de nuit tout en gardant la nuit franche.
  const nightOp = interpolate(dawn, [0, 0.35, 0.75, 1], [0.72, 0.5, 0.17, 0.02], {
    extrapolateRight: "clamp",
  });
  // Wash chaud qui arrive avec le soleil.
  const warmOp = interpolate(dawn, [0, 0.3, 0.7, 1], [0, 0.15, 0.72, 0.9], { extrapolateRight: "clamp" });
  // Etoiles : visibles au debut, effacees des que le ciel palit.
  const starsOp = interpolate(dawn, [0, 0.22, 0.5], [0.85, 0.5, 0], { extrapolateRight: "clamp" });

  // =========================================================================
  // COUCHE 1 — PARALLAXE : la camera derive lentement vers la droite.
  // Amplitudes croissantes du fond vers l'avant, plafonnees a 190 px pour rester
  // dans la marge de securite laterale.
  // =========================================================================
  const prog = interpolate(frame, [0, DUR], [0, 1], { extrapolateRight: "clamp" });
  const txCiel = -prog * 18;
  const txRiveLoin = -prog * 42;
  const txRiveMed = -prog * 68;
  const txEau = -prog * 88;
  const txQuai = -prog * 128;
  const txAvant = -prog * 186;

  // Respiration de la camera : leger zoom lent (la scene s'ouvre en s'eclairant).
  const camScale = interpolate(frame, [0, DUR], [1.035, 1.0], { extrapolateRight: "clamp" });
  const camY = interpolate(frame, [0, DUR], [10, -6], { extrapolateRight: "clamp" });

  // =========================================================================
  // COUCHE 4/6 — ACTIVITE : le port se met en marche. Le "spring" donne une
  // montee organique (le port ne demarre pas d'un coup, il s'ebroue).
  // =========================================================================
  const activity = spring({
    frame: frame - Math.round(DUR * 0.22),
    fps,
    config: { damping: 200, mass: 2.4, stiffness: 42 },
    durationInFrames: Math.round(DUR * 0.5),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#070b1c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: PORT_DEFS }} />
        <defs>
          {/* Le fleuve sert de masque : reflets et soleil ne debordent pas sur le ciel. */}
          <clipPath id="clipRiver">
            <rect x={-300} y={HORIZON_Y} width={2520} height={QUAI_Y - HORIZON_Y} />
          </clipPath>
          <clipPath id="clipSky">
            <rect x={-300} y={-200} width={2520} height={HORIZON_Y + 200} />
          </clipPath>
          {/* flous statiques : ils adoucissent les bords. Un bord net sur un reflet
              ou une bouffee de fumee produit des "assiettes" et des "bulles". */}
          <filter id="softBlur" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="smokeBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="15" />
          </filter>
          <filter id="mistBlur" x="-30%" y="-200%" width="160%" height="500%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* respiration de camera : tout le contenu est transforme, viewBox FIXE */}
        <g transform={`translate(${W / 2} ${H / 2 + camY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}>
          {/* ================= CIEL ================= */}
          <g transform={`translate(${txCiel} 0)`}>
            <rect x={-300} y={-200} width={2520} height={HORIZON_Y + 200} fill="url(#pSkyNight)" />
            <rect
              x={-300}
              y={-200}
              width={2520}
              height={HORIZON_Y + 200}
              fill="url(#pSkyDawn)"
              opacity={interpolate(dawn, [0, 1], [0, 1], { extrapolateRight: "clamp" })}
            />
            {/* etoiles qui scintillent puis s'effacent */}
            <g opacity={starsOp}>
              {STARS_PORT.map((s, i) => (
                <circle
                  key={i}
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill="#e8eeff"
                  opacity={0.45 + 0.55 * Math.sin(frame / 11 + s.phase)}
                />
              ))}
            </g>
            {/* halo du soleil : deborde volontairement sur le ciel */}
            <ellipse cx={SUN_CX} cy={sunCy} rx={520} ry={330} fill="url(#pSunGlow)" opacity={sunGlowOp} />
          </g>

          {/* ================= RIVE LOINTAINE ================= */}
          <Inject html={PLAN_RIVE_LOINTAINE} transform={`translate(${txRiveLoin} 0)`} />

          {/* ================= OISEAUX (entre les deux rives) ================= */}
          <g transform={`translate(${txRiveLoin} 0)`}>
            {BIRDS_PORT.map((b, i) => {
              // derive continue + rebouclage horizontal (jamais de saut visible :
              // la largeur de reboucle est bien plus large que le cadre)
              const span = 2600;
              const raw = b.x + b.vx * frame;
              const x = ((((raw + 400) % span) + span) % span) - 400;
              const bob = 9 * Math.sin(frame / 24 + b.bobPhase);
              const sc = scaleFromDepth(b.depth);
              // battement d'ailes : on ecrase le "V" verticalement en rythme
              const flap = 0.45 + 0.55 * Math.abs(Math.sin(frame / 5.2 + b.flapPhase));
              return (
                <g key={i} transform={`translate(${x} ${b.y + bob}) scale(${sc * 2.4})`}>
                  <g transform={`scale(1 ${flap})`}>
                    <use
                      href="#pBird"
                      width={24}
                      height={12}
                      x={-12}
                      y={-6}
                      fill="none"
                      stroke="#1a2039"
                      strokeWidth={2.6}
                      opacity={0.5 + 0.4 * dawn}
                    />
                  </g>
                </g>
              );
            })}
          </g>

          {/* ================= RIVE MEDIANE ================= */}
          <Inject html={PLAN_RIVE_MEDIANE} transform={`translate(${txRiveMed} 0)`} />

          {/* ================= LE FLEUVE ================= */}
          <g transform={`translate(${txEau} 0)`}>
            <rect x={-300} y={HORIZON_Y} width={2520} height={QUAI_Y - HORIZON_Y + 6} fill="url(#pRiver)" />

            <g clipPath="url(#clipRiver)">
              {/* colonne de reflet du soleil : chaque bande ondule et respire */}
              {/* La colonne de reflet doit rester DANS L'EAU et sous le soleil :
                  bandes basses, tres transparentes, bords adoucis par un flou.
                  Sans le flou elles lisent comme des assiettes posees sur le fleuve. */}
              {RIVER_REFLECTS.map((r, i) => {
                const wob = Math.sin(frame / 15 + r.phase);
                const sx = 1 + 0.26 * wob;
                const drift = 9 * Math.sin(frame / 21 + r.phase * 1.3);
                // Le reflet est ancre EXACTEMENT sous le soleil. La colonne d'eau
                // derive avec le plan (txEau) alors que le soleil derive avec le
                // ciel (txCiel) : on compense l'ecart pour que la trainee reste
                // sous le disque (decalage constate au rendu v3).
                const cx = SUN_CX + (r.cx - 1284) * 0.4 + drift + (txCiel - txEau);
                const op =
                  r.op * (0.45 + 0.55 * Math.sin(frame / 12 + r.phase * 1.7)) * (0.05 + 0.95 * dawn) * 0.95;
                return (
                  <ellipse
                    key={i}
                    cx={cx}
                    cy={r.cy}
                    rx={r.rx}
                    ry={r.ry}
                    fill="#ffdca0"
                    opacity={Math.max(0, op)}
                    filter="url(#softBlur)"
                    transform={`translate(${cx} ${r.cy}) scale(${sx} 1) translate(${-cx} ${-r.cy})`}
                  />
                );
              })}

              {/* rides : ~90 traits fins qui scintillent chacun a sa phase */}
              {RIPPLES.map((rp, i) => {
                const shimmer = 0.35 + 0.65 * Math.sin(frame / 9 + rp.phase);
                const slide = 5 * Math.sin(frame / 26 + rp.phase * 0.7);
                const near = (rp.y - 486) / 386; // 0 loin, 1 pres
                return (
                  <rect
                    key={i}
                    x={rp.x + slide}
                    y={rp.y}
                    width={rp.w}
                    height={1 + near * 1.6}
                    rx={1}
                    fill={dawn > 0.4 ? "#d9c39b" : "#8fa3c8"}
                    opacity={Math.max(0, rp.op * shimmer * (0.35 + 0.65 * dawn))}
                  />
                );
              })}
            </g>
          </g>

          {/* ================= EMBARCATIONS (sur l'eau, sous le quai) ================= */}
          <g transform={`translate(${txEau} 0)`} clipPath="url(#clipRiver)">
            {BOATS.map((b, i) => {
              const span = 2600;
              const raw = b.x0 + b.vx * frame;
              const x = ((((raw + 500) % span) + span) % span) - 500;
              const sc = scaleFromDepth(b.depth);
              const y = waterYFromDepth(b.depth);
              return (
                <g key={i}>
                  {/* sillage : deux traits derriere la coque, sens dependant du cap */}
                  <g opacity={0.16 + 0.24 * dawn}>
                    <ellipse
                      cx={x - Math.sign(b.vx) * b.len * sc * 0.62}
                      cy={y + b.len * sc * 0.06}
                      rx={b.len * sc * 0.5 * (1 + 0.06 * Math.sin(frame / 17 + b.phase))}
                      ry={3.5 * sc + 1.5}
                      fill="#cfe0ff"
                      opacity={0.5}
                    />
                    <ellipse
                      cx={x - Math.sign(b.vx) * b.len * sc * 1.1}
                      cy={y + b.len * sc * 0.09}
                      rx={b.len * sc * 0.62}
                      ry={3 * sc + 1}
                      fill="#cfe0ff"
                      opacity={0.28}
                    />
                  </g>
                  <g transform={`translate(${x} ${y}) scale(${sc * (b.vx < 0 ? -1 : 1)} ${sc})`}>
                    <BoatFigure
                      frame={frame}
                      len={b.len}
                      hull={b.hull}
                      sail={b.sail}
                      phase={b.phase}
                      rower={b.rower}
                      lightMix={dawn}
                    />
                  </g>
                </g>
              );
            })}
          </g>

          {/* ================= GRUES (posees sur le quai, derriere les hangars) ================= */}
          <g transform={`translate(${txQuai} 0)`}>
            {CRANES.map((cr, i) => {
              const sc = scaleFromDepth(cr.depth);
              // pied de grue : SUR le quai (bande arriere), jamais sur l'eau
              const gy = craneFootY(cr.depth);
              return (
                <g key={i} transform={`translate(${cr.x} ${gy}) scale(${sc})`}>
                  <CraneFigure
                    frame={frame}
                    mastH={cr.mastH}
                    jibLen={cr.jibLen}
                    phase={cr.phase}
                    cycle={cr.cycle}
                    baseAngle={cr.baseAngle}
                    sweep={cr.sweep}
                    active={activity}
                    stroke="#191627"
                  />
                </g>
              );
            })}
          </g>

          {/* ================= LE QUAI ================= */}
          <Inject html={PLAN_QUAI} transform={`translate(${txQuai} 0)`} />

          {/* ================= HANGARS + FENETRES QUI S'ALLUMENT ================= */}
          <g transform={`translate(${txQuai} 0)`}>
            {SHEDS.map((sh, i) => {
              const top = QUAI_Y - sh.h;
              return (
                <g key={i}>
                  {/* mur (objet inerte : jamais de glissement, jamais d'apparition) */}
                  <rect x={sh.x} y={top} width={sh.w} height={sh.h} fill={sh.wall} />
                  {/* toit a deux pentes */}
                  <path
                    d={`M ${sh.x - 14} ${top} L ${sh.x + sh.w / 2} ${top - sh.roof} L ${sh.x + sh.w + 14} ${top} Z`}
                    fill={sh.roofFill}
                  />
                  {/* nervures de tole */}
                  <g stroke={sh.roofFill} strokeWidth={2} opacity={0.5}>
                    {Array.from({ length: 6 }, (_, k) => (
                      <path
                        key={k}
                        d={`M ${sh.x + 18 + (k * (sh.w - 36)) / 5} ${top} L ${sh.x + 18 + (k * (sh.w - 36)) / 5} ${QUAI_Y}`}
                      />
                    ))}
                  </g>
                  {/* cheminee + fumee qui monte en serpentant (jamais figee) */}
                  {sh.chimney !== null && (
                    <Smoke
                      chimneyX={sh.chimney}
                      baseY={top - sh.roof}
                      fill={sh.roofFill}
                      frame={frame}
                      activity={activity}
                    />
                  )}
                  {/* fenetres : s'allument par vagues, avec un vacillement de lampe */}
                  {sh.windows.map((wi, k) => {
                    const on = interpolate(
                      dawn,
                      [0.06 + wi.wake * 0.34, 0.14 + wi.wake * 0.34],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    );
                    // vers la fin, le jour est si fort que la lumiere interieure ne se voit plus
                    const fade = interpolate(dawn, [0.74, 1], [1, 0.22], { extrapolateRight: "clamp" });
                    const flick = 0.9 + 0.1 * Math.sin(frame / 6 + k * 2.3 + i);
                    const a = on * fade * flick;
                    return (
                      <g key={k}>
                        <ellipse
                          cx={wi.x + wi.w / 2}
                          cy={wi.y + wi.h / 2}
                          rx={wi.w * 2.4}
                          ry={wi.h * 2.1}
                          fill="url(#pLampGlow)"
                          opacity={0.55 * a}
                        />
                        <rect x={wi.x} y={wi.y} width={wi.w} height={wi.h} fill="#2a2436" />
                        <rect x={wi.x} y={wi.y} width={wi.w} height={wi.h} fill="#ffce7a" opacity={a} />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* ================= CAISSES (inertes : seule la lumiere change) ================= */}
          <g transform={`translate(${txQuai} 0)`}>
            {CRATES.map((c, i) => (
              <g key={i} transform={`rotate(${c.tilt} ${c.x + c.w / 2} ${c.y})`}>
                <rect x={c.x} y={c.y - c.h} width={c.w} height={c.h} rx={2} fill={c.fill} />
                {/* face eclairee : elle se rechauffe et s'eclaircit avec l'aube */}
                <rect
                  x={c.x}
                  y={c.y - c.h}
                  width={c.w * 0.34}
                  height={c.h}
                  fill="#ffb977"
                  opacity={0.05 + 0.3 * dawn}
                />
                <path
                  d={`M ${c.x} ${c.y - c.h * 0.55} L ${c.x + c.w} ${c.y - c.h * 0.55}`}
                  stroke="#241f2e"
                  strokeWidth={2.5}
                  opacity={0.7}
                />
              </g>
            ))}
          </g>

          {/* ================= BRASEROS : brulent fort dans la nuit, meurent au jour ============ */}
          <g transform={`translate(${txQuai} 0)`}>
            {BRAZIERS.map((bz, i) => {
              const sc = scaleFromDepth(bz.depth);
              // le brasero s'eteint doucement quand il fait jour : plus besoin de feu
              const alive = interpolate(dawn, [0, 0.55, 0.9], [1, 0.7, 0.12], { extrapolateRight: "clamp" });
              const pulse = 0.75 + 0.25 * Math.sin(frame / 4.5 + bz.phase) + 0.12 * Math.sin(frame / 2.1 + bz.phase * 2);
              return (
                <g key={i} transform={`translate(${bz.x} ${bz.y}) scale(${sc})`}>
                  {/* halo au sol */}
                  <ellipse cx={0} cy={-8} rx={95} ry={52} fill="url(#pBrazier)" opacity={0.55 * alive * pulse} />
                  {/* trepied */}
                  <path
                    d="M -22 0 L -8 -34 M 22 0 L 8 -34 M -14 -18 L 14 -18"
                    stroke="#231f2d"
                    strokeWidth={5}
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path d="M -20 -34 L 20 -34 L 14 -50 L -14 -50 Z" fill="#2c2635" />
                  {/* flammes : 3 langues qui vacillent independamment */}
                  {[0, 1, 2].map((k) => {
                    const f = Math.sin(frame / (3.4 + k) + bz.phase + k * 2.1);
                    const hgt = 26 + 13 * f;
                    return (
                      <path
                        key={k}
                        d={`M ${-9 + k * 9} -48 Q ${-13 + k * 9 + 5 * f} ${-48 - hgt * 0.6} ${-4 + k * 9 + 3 * f} ${-48 - hgt} Q ${1 + k * 9} ${-48 - hgt * 0.5} ${-1 + k * 9} -48 Z`}
                        fill={k === 1 ? "#ffd371" : "#ff9a45"}
                        opacity={(0.75 + 0.25 * f) * alive}
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* ================= LAMPADAIRES : allumes la nuit, eteints au matin ============ */}
          <g transform={`translate(${txQuai} 0)`}>
            {LAMPS.map((lp, i) => {
              // extinction echelonnee : elles ne s'eteignent pas toutes en meme temps
              const off = interpolate(dawn, [0.5 + lp.delay, 0.62 + lp.delay], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const buzz = 0.92 + 0.08 * Math.sin(frame / 3.1 + i * 1.7);
              const a = off * buzz;
              return (
                <g key={i}>
                  <path
                    d={`M ${lp.x} ${lp.y} L ${lp.x} ${lp.y - lp.h} q 0 -16 20 -16 l 16 0`}
                    stroke="#231f2d"
                    strokeWidth={7}
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${lp.x + 26} ${lp.y - lp.h - 16} l 24 0 l -6 15 l -12 0 z`}
                    fill="#2a2534"
                  />
                  <ellipse
                    cx={lp.x + 38}
                    cy={lp.y - lp.h - 6}
                    rx={112}
                    ry={104}
                    fill="url(#pLampGlow)"
                    opacity={0.6 * a}
                  />
                  {/* flaque de lumiere au sol : elle prouve que la lampe eclaire */}
                  <ellipse
                    cx={lp.x + 38}
                    cy={lp.y + 2}
                    rx={92}
                    ry={16}
                    fill="#ffbe63"
                    opacity={0.16 * a}
                  />
                  <circle cx={lp.x + 38} cy={lp.y - lp.h - 6} r={7} fill="#ffe3a6" opacity={a} />
                </g>
              );
            })}
          </g>

          {/* ================= DOCKERS : silhouettes de profil qui marchent ============ */}
          <g transform={`translate(${txQuai} 0)`}>
            {DOCKERS.map((d, i) => {
              const span = 2440;
              const raw = d.x0 + d.vx * frame;
              const x = ((((raw + 300) % span) + span) % span) - 300;
              const sc = scaleFromDepth(d.depth);
              // Tous les dockers marchent SUR le quai : meme ligne de sol.
              // La profondeur ne pilote que l'echelle (ils sont alignes sur la dalle).
              const y = QUAI_Y;
              const t = frame * d.gait + d.phase;
              const facing = d.vx >= 0 ? 1 : -1;
              return (
                <g key={i}>
                  {/* ombre portee : elle s'allonge et s'adoucit quand le soleil monte */}
                  <ellipse
                    cx={x + facing * 10 * dawn * sc}
                    cy={y + 2}
                    rx={26 * sc * (1 + 0.9 * dawn)}
                    ry={5 * sc}
                    fill="#12101a"
                    opacity={0.24 + 0.2 * dawn}
                  />
                  <g transform={`translate(${x} ${y}) scale(${sc})`}>
                    <DockerFigure t={t} load={d.load} fill={d.fill} facing={facing} />
                  </g>
                </g>
              );
            })}
          </g>

          {/* ================= PREMIER PLAN (parallaxe la plus rapide) ============ */}
          <Inject html={PLAN_AVANT_QUAI} transform={`translate(${txAvant} 0)`} />

          {/* ================= NAPPES DE LUMIERE GLOBALES ============ */}
          {/* nuit qui se retire */}
          <rect x={-300} y={-200} width={2520} height={1500} fill="url(#pNight)" opacity={nightOp} />
          {/* wash chaud du matin */}
          <rect x={-300} y={-200} width={2520} height={1500} fill="url(#pWarmWash)" opacity={warmOp} />

          {/* disque solaire : dessine PAR-DESSUS la brume, clippe au ciel pour ne pas
              flotter sur le quai. Il monte, il ne redescend jamais. */}
          <g clipPath="url(#clipSky)" transform={`translate(${txCiel} 0)`}>
            <circle cx={SUN_CX} cy={sunCy} r={78} fill="url(#pSunDisc)" opacity={sunDiscOp} />
          </g>

          {/* brume basse sur le fleuve : elle se leve et se dissipe */}
          {/* Brume basse : nappes TRES etirees et fortement floutees, plaquees juste
              sous l'horizon. Sans le flou ni le rapport d'aspect extreme, elles
              lisent comme deux disques blancs poses sur le fleuve. */}
          <g clipPath="url(#clipRiver)" filter="url(#mistBlur)">
            {[0, 1, 2, 3].map((k) => {
              const y = HORIZON_Y + 16 + k * 34 - 9 * Math.sin(frame / 64 + k * 1.6);
              const op =
                interpolate(dawn, [0, 0.4, 0.9], [0.2, 0.15, 0.015], { extrapolateRight: "clamp" }) *
                (0.75 + 0.25 * Math.sin(frame / 48 + k));
              return (
                <rect
                  key={k}
                  x={-300 + 120 * Math.sin(frame / 130 + k * 2.2) - prog * 60}
                  y={y}
                  width={2520}
                  height={16 + k * 6}
                  rx={8}
                  fill="#b6c0dc"
                  opacity={Math.max(0, op)}
                />
              );
            })}
          </g>

          {/* vignettage doux : concentre le regard, se leve avec le jour */}
          <rect
            x={0}
            y={0}
            width={W}
            height={H}
            fill="url(#pVignette)"
            opacity={interpolate(dawn, [0, 1], [0.34, 0.2], { extrapolateRight: "clamp" })}
          />
        </g>

        <defs>
          <radialGradient id="pVignette" cx="0.5" cy="0.46" r="0.72">
            <stop offset="0.45" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#000208" stopOpacity="0.85" />
          </radialGradient>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};
