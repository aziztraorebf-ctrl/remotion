/**
 * warmapChoc — moteur d'affrontement 2 factions pour les inserts SVG "etat-major".
 *
 * Extrait et generalise du prototype valide KhartoumEtatMajorSVG (mono-faction, RSF attaque des
 * cibles inertes). Ici : DEUX factions qui se heurtent au front, une position qui tient puis cede,
 * une zone qui bascule. Registre identique (medaillon d'etat-major grave, sable/or/rouge), doctrine
 * WARMAP-INSERT-SVG-ETATMAJOR.md.
 *
 * Ce fichier ne contient AUCUN decor : il fournit les BRIQUES reutilisables (jeton de faction,
 * formation, choc, front qui recule, zone qui se remplit) que les compos d'habillage
 * (KhartoumChocSVG, FrontOuvertSVG) posent sur leur propre fond. C'est la base du futur
 * WarMapInsert parametre — on garde tout parametre par un objet Faction, jamais de "R"/"S" en dur.
 *
 * Regles non-negociables heritees du proto valide :
 * - Frame-driven pur (useCurrentFrame + interpolate). JAMAIS Math.random (casse la repro frame) :
 *   tout jag est deterministe (Math.sin(i*12.9898)*43758.5453).
 * - Un PORTRAIT/visage ne tourne jamais (translate seul). Le losange peut suivre le cap.
 * - Le mouvement RACONTE : jamais un jeton plante immobile, jamais un glissement sans but.
 */
import React from "react";
import { interpolate, Easing, staticFile } from "remotion";

// ── Palette etat-major (source de verite : DECODE-NOTES.md / khartoum-svg-RECOMPOSE.svg) ──
export const EM = {
  sand: "#d9c092",
  gold: "#e7bd78",
  goldDim: "#bf9442",
  red: "#8a2a20",
  ink: "#4a1f18",
  ivory: "#f2ebd9",
  stroke: "#2b2117",
};

export const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// jag deterministe [0,1) a partir d'une graine — remplace Math.random (interdit en Remotion)
export const jag01 = (seed: number) => {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

// ── Faction : tout ce qui differencie un camp. Le systeme est generique — RSF/SAF ne sont que
// deux instances. Le losange biseaute + monogramme (lisible net a toute echelle, teste vs texte
// entier illisible) est notre pion de faction reutilisable. ──
export type Faction = {
  key: string;
  letter: string; // monogramme (R, S…) — lisible net a toute echelle
  bodyDark: string; // losange exterieur (relief)
  body: string; // losange interieur (couleur dominante)
  bezel: string; // liseré interieur + lettre
  seal: string; // couleur du sceau de possession
  zone: string; // teinte de la zone de controle
  front: string; // couleur de la ligne de front
};

export const RSF: Faction = {
  key: "rsf",
  letter: "R",
  bodyDark: "#8a2410",
  body: "#b8341f",
  bezel: "#e7bd78",
  seal: "#8a2a20",
  zone: "#b8341f",
  front: "#bf9442",
};

// SAF = armee reguliere. Bleu acier — coherent avec le "bleu Etat / SAF est" de la doctrine
// Acte 1 Soudan (carte se fend : bleu a l'est, rouge a l'ouest).
export const SAF: Faction = {
  key: "saf",
  letter: "S",
  bodyDark: "#173a5e",
  body: "#2f5c8a",
  bezel: "#cfe0f2",
  seal: "#1d4468",
  zone: "#2f5c8a",
  front: "#5b86ad",
};

// ── Jeton de faction : losange biseaute + monogramme. Le monogramme CONTRE-TOURNE (heading recu)
// pour rester toujours lisible droit, comme un vrai insigne — seul le corps suit le cap. ──
export const FactionToken: React.FC<{ faction: Faction; heading?: number; scale?: number }> = ({
  faction,
  heading = 0,
  scale = 1,
}) => (
  <g transform={`scale(${scale})`} filter="url(#emGlow)">
    <polygon points="0,-18 18,0 0,18 -18,0" fill={faction.bodyDark} stroke={EM.stroke} strokeWidth={1} />
    <polygon points="0,-13 13,0 0,13 -13,0" fill={faction.body} stroke={faction.bezel} strokeWidth={1.3} />
    <text
      x={0}
      y={5.5}
      textAnchor="middle"
      fontFamily="Georgia, serif"
      fontWeight={700}
      fontSize={15}
      fill={faction.bezel}
      transform={`rotate(${-heading})`}
    >
      {faction.letter}
    </text>
  </g>
);

// ── Sceau de possession : le losange de la faction s'installe sur une position prise, scale-in
// avec overshoot + anneau qui pulse une fois. Reutilise du proto (CaptureSeal). ──
export const CaptureSeal: React.FC<{
  x: number;
  y: number;
  frame: number;
  captureFrame: number;
  faction: Faction;
}> = ({ x, y, frame, captureFrame, faction }) => {
  const rel = frame - captureFrame;
  if (rel < 0) return null;
  const sealRel = rel - 10;
  const sealScale =
    sealRel < 0 ? 0 : interpolate(sealRel, [0, 8, 14], [0, 1.18, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sealOp = clampI(sealRel, 0, 8);
  const pulseR = sealRel < 0 ? 0 : interpolate(sealRel, [0, 22], [14, 44], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseOp = sealRel < 0 ? 0 : interpolate(sealRel, [0, 6, 22], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x} ${y})`}>
      {pulseOp > 0 && <circle r={pulseR} fill="none" stroke={faction.bezel} strokeWidth={2.5} opacity={pulseOp} />}
      {sealScale > 0 && (
        <g transform={`scale(${sealScale})`} opacity={sealOp} filter="url(#emShadow)">
          <polygon points="0,-16 16,0 0,16 -16,0" fill={faction.seal} stroke={EM.ivory} strokeWidth={2} />
          <polygon points="0,-11 11,0 0,11 -11,0" fill="none" stroke={faction.bezel} strokeWidth={1.2} />
          <text x={0} y={5.5} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={15} fill={faction.bezel}>
            {faction.letter}
          </text>
        </g>
      )}
    </g>
  );
};

// ── Sceau BARRE : quand une faction PERD une position (l'autre l'a prise), son sceau s'estompe et
// se barre. C'est le pendant "defaite" du CaptureSeal — donne le dénouement du choc a 2 camps. ──
export const DefeatedSeal: React.FC<{
  x: number;
  y: number;
  frame: number;
  defeatFrame: number;
  faction: Faction;
}> = ({ x, y, frame, defeatFrame, faction }) => {
  const rel = frame - defeatFrame;
  if (rel < 0) return null;
  const fade = interpolate(rel, [0, 30], [1, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slash = clampI(rel, 6, 22);
  return (
    <g transform={`translate(${x} ${y})`} opacity={fade} filter="url(#emShadow)">
      <polygon points="0,-16 16,0 0,16 -16,0" fill={faction.body} stroke={EM.ivory} strokeWidth={1.5} opacity={0.7} />
      <text x={0} y={5.5} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={15} fill={faction.bezel} opacity={0.7}>
        {faction.letter}
      </text>
      {slash > 0 && (
        <line
          x1={-20}
          y1={-20}
          x2={-20 + 40 * slash}
          y2={-20 + 40 * slash}
          stroke={EM.red}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// ── Poussiere de traînee (deterministe) : particules sable derriere un jeton en mouvement. ──
export const DustTrail: React.FC<{ cx: number; cy: number; backX: number; backY: number; frame: number; seed: number }> = ({
  cx,
  cy,
  backX,
  backY,
  frame,
  seed,
}) => {
  const N = 8;
  const parts = Array.from({ length: N }).map((_, i) => {
    const period = 24;
    const born = (i / N) * period + seed * 3;
    const age = (((frame - born) % period) + period) % period;
    const dist = 8 + age * 1.2;
    const lat = (jag01(seed * 7 + i * 13.1) * 2 - 1) * (3 + age * 0.4);
    const perpX = -backY;
    const perpY = backX;
    const px = cx + backX * dist + perpX * lat;
    const py = cy + backY * dist + perpY * lat;
    const r = 3.5 + age * 0.42;
    const op = interpolate(age, [0, 4, period], [0, 0.72, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { px, py, r, op, i };
  });
  return (
    <g>
      {parts.map((p) => (
        <circle key={p.i} cx={p.px} cy={p.py} r={p.r} fill="#b09a72" opacity={p.op} />
      ))}
    </g>
  );
};

// ── Fumee : colonne qui monte d'une position pilonnee. Filtre unique par position (id derive). ──
export const SmokeColumn: React.FC<{ x: number; y: number; frame: number; startFrame: number }> = ({ x, y, frame, startFrame }) => {
  const rel = frame - startFrame;
  if (rel < 0) return null;
  const appear = interpolate(rel, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seed = Math.floor(frame / 4) % 20;
  const fid = `smoke-${Math.round(x)}-${Math.round(y)}`;
  const puffs = [0, 22, 44].map((offset, i) => {
    const tt = (((rel + offset) % 66) + 66) % 66 / 66;
    const py = -tt * 58;
    const sc = 0.5 + tt * 1.0;
    const op = interpolate(tt, [0, 0.15, 0.75, 1], [0, 0.5, 0.32, 0], { extrapolateRight: "clamp" }) * appear;
    return { py, sc, op, i };
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <filter id={fid}>
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" />
        </filter>
      </defs>
      <g filter={`url(#${fid})`}>
        {puffs.map((p) => (
          <g key={p.i} transform={`translate(0 ${p.py}) scale(${p.sc})`} opacity={p.op}>
            <ellipse cx={0} cy={0} rx={16} ry={18} fill="#6b5c42" />
            <ellipse cx={-6} cy={-5} rx={11} ry={13} fill="#5c4d38" />
            <ellipse cx={6} cy={-2} rx={9} ry={11} fill="#4a3f2e" />
          </g>
        ))}
      </g>
    </g>
  );
};

// ── Impact : flash + 2 anneaux d'onde de choc qui s'etendent. Reutilise du proto. ──
export const Impact: React.FC<{ x: number; y: number; frame: number; startFrame: number }> = ({ x, y, frame, startFrame }) => {
  const t = frame - startFrame;
  if (t < 0) return null;
  const scale = interpolate(t, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOp = interpolate(t, [0, 4, 20], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloOp = interpolate(t, [0, 8, 70], [0, 0.9, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring1R = interpolate(t, [0, 55], [10, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring1Op = interpolate(t, [0, 10, 55], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring2R = interpolate(t, [12, 70], [10, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring2Op = interpolate(t, [12, 24, 70], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={ring1R} fill="none" stroke={EM.red} strokeWidth={4} opacity={ring1Op} />
      <circle r={ring2R} fill="none" stroke={EM.goldDim} strokeWidth={2.5} opacity={ring2Op} />
      <g transform={`scale(${scale})`}>
        <circle r={22} fill={EM.ivory} opacity={flashOp} />
        <circle r={17} fill="#dca95e" stroke={EM.red} strokeWidth={2} opacity={haloOp} />
      </g>
    </g>
  );
};

// ── Etincelles de contact (le CHOC des 2 formations, pas un pilonnage de cible) : petites eclats
// bidirectionnels au point de rencontre, deterministes, qui clignotent en continu pendant le choc.
// C'est ce qui distingue un FRONT (2 forces qui se battent) d'un IMPACT (1 cible frappee). ──
export const ClashSparks: React.FC<{ x: number; y: number; frame: number; from: number; to: number; intensity?: number }> = ({
  x,
  y,
  frame,
  from,
  to,
  intensity = 1,
}) => {
  if (frame < from || frame > to) return null;
  const N = 10;
  const sparks = Array.from({ length: N }).map((_, i) => {
    const period = 14;
    const born = jag01(i * 3.7) * period;
    const age = (((frame - born) % period) + period) % period;
    const ang = jag01(i * 9.1 + Math.floor(frame / period)) * Math.PI * 2;
    const dist = age * (2.2 + jag01(i * 5.3) * 2) * intensity;
    const px = x + Math.cos(ang) * dist;
    const py = y + Math.sin(ang) * dist * 0.7;
    const op = interpolate(age, [0, 2, period], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const r = 2.4 - age * 0.1;
    return { px, py, op, r: Math.max(0.6, r), i, gold: i % 2 === 0 };
  });
  return (
    <g>
      {sparks.map((s) => (
        <circle key={s.i} cx={s.px} cy={s.py} r={s.r} fill={s.gold ? EM.gold : EM.ivory} opacity={s.op} />
      ))}
    </g>
  );
};

// point sur une quadratique Bezier
export const quadPoint = (
  o: { x: number; y: number },
  m: { x: number; y: number },
  t: { x: number; y: number },
  s: number
) => {
  const mt = 1 - s;
  return { x: mt * mt * o.x + 2 * mt * s * m.x + s * s * t.x, y: mt * mt * o.y + 2 * mt * s * m.y + s * s * t.y };
};

export const bezierMid = (a: { x: number; y: number }, b: { x: number; y: number }, bow: number) => ({
  x: (a.x + b.x) / 2 + (b.y - a.y) * bow,
  y: (a.y + b.y) / 2 - (b.x - a.x) * bow,
});

// ── Formation qui AVANCE le long d'une Bezier vers un point d'arret (le front, PAS la cible finale).
// Reutilise la logique du proto (echelon, swagger/bump organique, poussiere) mais s'arrete au front
// au lieu de traverser. Parametree par faction. onProgress optionnel : renvoie la position de tete
// pour que l'appelant sache ou est le front. ──
export type Vec = { x: number; y: number };

// Echelon : positions RELATIVES des jetons dans la formation. `back` = retard le long du trajet
// (converti en fraction de t par /BACK_SCALE) ; `side` = decalage lateral perpendiculaire au cap.
// Ecarts calibres pour des jetons a scale ~1.7-2.0 (~60-72px) : chaque jeton reste distinct, pas
// un amas (bug v1 : offsets 30px trop serres pour scale 2.0 -> losanges empiles illisibles).
const BACK_SCALE = 320; // + petit => les jetons de queue tra1nent plus loin derriere la tete
const ECHELON: { back: number; side: number; sf: number; sp: number; sa: number; bf: number; bp: number }[] = [
  { back: 0, side: 0, sf: 0.31, sp: 0, sa: 3.5, bf: 0.9, bp: 0 },
  { back: 30, side: 52, sf: 0.27, sp: 1.8, sa: 4.2, bf: 0.8, bp: 2.1 },
  { back: 30, side: -52, sf: 0.34, sp: 3.4, sa: 3.8, bf: 1.0, bp: 4.5 },
  { back: 64, side: 0, sf: 0.29, sp: 5.1, sa: 3.6, bf: 0.85, bp: 1.2 },
];

export const AdvancingFormation: React.FC<{
  origin: Vec;
  front: Vec; // point d'arret (le front), pas la cible
  faction: Faction;
  frame: number;
  startFrame: number;
  travelFrames: number; // duree du trajet origin -> front
  bow?: number;
  size?: number;
}> = ({ origin, front, faction, frame, startFrame, travelFrames, bow = 0.1, size = 2.0 }) => {
  const local = frame - startFrame;
  if (local < 0) return null;
  const t = interpolate(local, [0, travelFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const mid = bezierMid(origin, front, bow);
  const posAt = (tt: number) => quadPoint(origin, mid, front, tt);
  const DASH = 2600;
  const off = (1 - t) * DASH;
  const path = `M${origin.x} ${origin.y} Q ${mid.x} ${mid.y} ${front.x} ${front.y}`;
  const appear = clampI(local, 0, 10);
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={EM.ivory}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray={DASH}
        strokeDashoffset={off}
        opacity={0.8}
      />
      <g opacity={appear}>
        {ECHELON.map((o, i) => {
          const vt = Math.max(0, t - o.back / BACK_SCALE);
          const p = posAt(vt);
          const behind = posAt(Math.max(0, vt - 0.015));
          const heading = (Math.atan2(p.y - behind.y, p.x - behind.x) * 180) / Math.PI;
          const perpX = -Math.sin((heading * Math.PI) / 180);
          const perpY = Math.cos((heading * Math.PI) / 180);
          const swagger = Math.sin(local * o.sf + o.sp) * o.sa;
          const bump = Math.sin(local * o.bf + o.bp) * 1.3;
          const vx = p.x + perpX * (o.side + swagger);
          const vy = p.y + perpY * (o.side + swagger) + bump;
          const wiggle = Math.sin(local * o.sf + o.sp) * 3.5;
          const backX = -Math.cos((heading * Math.PI) / 180);
          const backY = -Math.sin((heading * Math.PI) / 180);
          const moving = t > 0.02 && t < 0.97;
          return (
            <g key={i}>
              {moving && <DustTrail cx={vx} cy={vy} backX={backX} backY={backY} frame={local} seed={i} />}
              <g transform={`translate(${vx} ${vy})`}>
                <FactionToken faction={faction} heading={heading + wiggle} scale={size} />
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};

// position de tete d'une formation a un instant donne (pour caler le point de choc cote appelant)
export const formationHead = (origin: Vec, front: Vec, local: number, travelFrames: number, bow = 0.1): Vec => {
  const t = interpolate(local, [0, travelFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const mid = bezierMid(origin, front, bow);
  return quadPoint(origin, mid, front, t);
};

// ── Formation qui DEFEND une position (statique mais vivante : leger frisson defensif, sonar). ──
export const HoldingFormation: React.FC<{
  center: Vec;
  faction: Faction;
  frame: number;
  count?: number;
  spread?: number;
  size?: number;
  retreat?: number; // 0 = tient ; >0 = recule (px) dans la direction pushDir
  pushDir?: Vec; // direction du recul (normalisee)
}> = ({ center, faction, frame, count = 4, spread = 40, size = 1.9, retreat = 0, pushDir = { x: -1, y: 0 } }) => {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / count) * Math.PI * 2 + jag01(i * 2.3);
        const rad = spread * (0.5 + jag01(i * 4.1) * 0.5);
        // frisson defensif : petit tremblement sur place (tient sa position sous pression)
        const jitter = Math.sin(frame * 0.4 + i * 1.7) * 1.6;
        const bx = center.x + Math.cos(ang) * rad + pushDir.x * retreat + jitter;
        const by = center.y + Math.sin(ang) * rad * 0.7 + pushDir.y * retreat;
        return (
          <g key={i} transform={`translate(${bx} ${by})`}>
            <FactionToken faction={faction} heading={0} scale={size} />
          </g>
        );
      })}
    </g>
  );
};

// ── Ligne de front (arc pointille) qui delimite une zone tenue et RECULE/s'etend a la bascule.
// Generalisee du proto (etait un cercle qui grandit) : ici un arc oriente, qui peut se contracter
// (defenseur qui perd du terrain) ou s'etendre (attaquant qui gagne). ──
export const FrontArc: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  frame: number;
  shiftFrame: number; // frame ou le front commence a bouger
  shiftBy: number; // + = s'etend (gain) ; - = se contracte (perte)
  color: string;
}> = ({ cx, cy, radius, frame, shiftFrame, shiftBy, color }) => {
  const shift = frame >= shiftFrame ? clampI(frame, shiftFrame, shiftFrame + 45) * shiftBy : 0;
  const r = Math.max(20, radius + shift);
  const op = frame >= shiftFrame ? interpolate(frame, [shiftFrame, shiftFrame + 45], [0.55, 0.35], { extrapolateRight: "clamp" }) : 0.45;
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2.2} strokeDasharray="9 7" opacity={op} />;
};

// ── Zone de controle qui se REMPLIT par balayage hachure (grammaire EtatMajorGptAnimee) : une
// region passe sous controle d'une faction. Le remplissage progresse de gauche a droite (ou selon
// un axe) via un clip anime. Parametree par faction (teinte). ──
export const SweepZone: React.FC<{
  id: string;
  pathD: string; // contour de la zone (coord viewBox)
  faction: Faction;
  frame: number;
  startFrame: number;
  fillFrames: number;
  bbox: { x: number; y: number; w: number; h: number }; // pour animer le clip de balayage
}> = ({ id, pathD, faction, frame, startFrame, fillFrames, bbox }) => {
  const t = clampI(frame, startFrame, startFrame + fillFrames);
  if (t <= 0) return null;
  const clipW = bbox.w * t;
  const hid = `sweephatch-${id}`;
  const cid = `sweepclip-${id}`;
  return (
    <g>
      <defs>
        <pattern id={hid} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill={faction.zone} opacity={0.14} />
          <line x1="0" y1="0" x2="0" y2="14" stroke={faction.zone} strokeWidth="2.4" opacity={0.42} />
        </pattern>
        <clipPath id={cid}>
          <rect x={bbox.x} y={bbox.y} width={clipW} height={bbox.h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        <path d={pathD} fill={`url(#${hid})`} stroke={faction.zone} strokeWidth={1.5} strokeOpacity={0.5} />
      </g>
    </g>
  );
};

// ── Sonar (anneau qui grandit et s'efface en boucle) — recolorable par faction. ──
export const Sonar: React.FC<{ cx: number; cy: number; frame: number; period: number; phase?: number; rMax: number; color: string }> = ({
  cx,
  cy,
  frame,
  period,
  phase = 0,
  rMax,
  color,
}) => {
  const t = (((frame + phase) % period) + period) % period / period;
  const r = 10 + t * rMax;
  const op = (1 - t) * 0.6;
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2.5} opacity={op} />;
};

// ── Portrait rond de commandant (PNG en cercle parchemin) — factorise, rayon parametrable.
// JAMAIS de rotation (un visage ne tourne pas). Usage : medaillon-commandant au-dessus d'une
// formation. Doctrine amendee : portrait rond humain OK en insert zoome (donne le "qui"). ──
export const CommanderMedallion: React.FC<{ x: number; y: number; opacity?: number; sprite: string; faction: Faction; r?: number }> = ({
  x,
  y,
  opacity = 1,
  sprite,
  faction,
  r = 15,
}) => {
  const clipId = `cmd-clip-${faction.key}-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity} filter="url(#emShadow)">
      <defs>
        <clipPath id={clipId}>
          <circle cx={0} cy={0} r={r} />
        </clipPath>
      </defs>
      <circle cx={0} cy={0} r={r} fill={EM.ivory} stroke={faction.seal} strokeWidth={r * 0.16} />
      <g clipPath={`url(#${clipId})`}>
        <image
          href={staticFile(sprite)}
          x={-r * 1.21}
          y={-r * 1.1}
          width={r * 2.43}
          height={r * 2.43}
          preserveAspectRatio="xMidYMid slice"
        />
        <rect x={-r} y={r * 0.53} width={r * 2} height={r * 0.47} fill={faction.seal} opacity={0.55} />
      </g>
    </g>
  );
};

// ── Defs communs (glow, shadow, grille) a poser une fois par compo. ──
export const EmDefs: React.FC = () => (
  <defs>
    <pattern id="emGrid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#c7a977" strokeWidth={1} strokeDasharray="2 4" opacity={0.6} />
    </pattern>
    <filter id="emShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx={0} dy={6} stdDeviation={6} floodColor="#1a0b08" floodOpacity={0.5} />
    </filter>
    <filter id="emGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={3} result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

// ── Cadre + cartouche etat-major (reutilise du proto). titre/date parametres. ──
export const EmFrame: React.FC<{ title: string; date: string; opacity: number; cartoucheOp: number }> = ({
  title,
  date,
  opacity,
  cartoucheOp,
}) => (
  <>
    <g opacity={opacity}>
      <rect x={30} y={30} width={1860} height={1020} fill="none" stroke={EM.ink} strokeWidth={6} />
      <rect x={42} y={42} width={1836} height={996} fill="none" stroke={EM.ink} strokeWidth={1.5} />
      <path d="M 30 60 L 60 60 L 60 30" fill="none" stroke={EM.sand} strokeWidth={6} />
      <path d="M 1890 60 L 1860 60 L 1860 30" fill="none" stroke={EM.sand} strokeWidth={6} />
      <path d="M 30 1020 L 60 1020 L 60 1050" fill="none" stroke={EM.sand} strokeWidth={6} />
      <path d="M 1890 1020 L 1860 1020 L 1860 1050" fill="none" stroke={EM.sand} strokeWidth={6} />
    </g>
    <g opacity={cartoucheOp}>
      <rect x={42} y={42} width={1836} height={56} fill={EM.ink} opacity={0.08} />
      <line x1={42} y1={98} x2={1878} y2={98} stroke={EM.ink} strokeWidth={1.5} opacity={0.5} />
      <text x={70} y={78} fill={EM.ink} fontFamily="system-ui, -apple-system, sans-serif" fontSize={22} fontWeight={800} letterSpacing={4}>
        {title}
      </text>
      <text x={1850} y={78} textAnchor="end" fill={EM.ink} fontFamily="Georgia, 'Times New Roman', serif" fontSize={20} fontStyle="italic" letterSpacing={1.5}>
        {date}
      </text>
    </g>
  </>
);

// ── Bandeau sous-titre bas (reutilise du proto). ──
export const EmSubtitle: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <g opacity={opacity}>
    <rect x={460} y={958} width={1000} height={68} fill="#2a120e" rx={4} />
    <rect x={465} y={963} width={990} height={58} fill="none" stroke="#8a3324" strokeWidth={1.5} rx={2} />
    <text x={960} y={1002} textAnchor="middle" fill="#f5e6ce" fontFamily="Georgia, 'Times New Roman', serif" fontSize={22} fontStyle="italic" letterSpacing={0.5}>
      {text}
    </text>
  </g>
);

// ── Legende 2 factions (haut ou bas) : chaque camp avec son pion + nom. ──
export const FactionLegend: React.FC<{ x: number; y: number; factions: { faction: Faction; label: string }[]; opacity: number }> = ({
  x,
  y,
  factions,
  opacity,
}) => (
  <g opacity={opacity} transform={`translate(${x} ${y})`}>
    <rect x={-14} y={-26} width={310} height={26 + factions.length * 34} fill="#2a120e" opacity={0.82} rx={4} />
    {factions.map((f, i) => (
      <g key={f.faction.key} transform={`translate(16 ${i * 34 + 6})`}>
        <g transform="scale(0.85)">
          <FactionToken faction={f.faction} />
        </g>
        <text x={30} y={5} fill="#f5e6ce" fontFamily="system-ui, sans-serif" fontSize={17} fontWeight={700} letterSpacing={1}>
          {f.label}
        </text>
      </g>
    ))}
  </g>
);
