/**
 * KhartoumEtatMajorSVG — insert tactique beat #5 (15 avril 2023, attaque RSF sur Khartoum).
 *
 * V4 — remplace le terrain/cibles codes a la main (V3) par la recomposition SVG issue de la
 * generation LLM (fond Gemini + 3 batiments GPT/topdown-v2 transplantes), decrite dans
 * out/_rnd/khartoum-etatmajor-svg/DECODE-NOTES.md. Le fond (terrain, fleuve Nil, cadre, cartouche,
 * legende) et les 3 batiments (tour TV Omdurman, palais presidentiel, aeroport international) sont
 * repris tels quels du fichier khartoum-svg-RECOMPOSE.svg (positions/echelles figees a la main lors
 * de la recomposition, voir ce fichier comme source de verite visuelle statique).
 *
 * V5 — passe lisibilite tactique suite a la critique Gemini (jetons illisibles, mouvement rigide,
 * colonne qui semble traverser le Nil sans pont) : jetons RSF agrandis + recolores contraste
 * ambre/rouge lumineux, pont dessine au point de franchissement reel du Nil (trajet RSF->tourtv
 * seul trajet qui traverse le fleuve principal — verifie par calcul des points de la Bezier, cf.
 * session), impacts en onde de choc (ripple) plus visibles sur les 3 cibles, lignes de front qui
 * reculent apres capture, icone "combats en cours" clignotante sur la cible active.
 *
 * La logique d'ANIMATION (phases, draw() stroke-dashoffset, sonar, impacts, colonnes RSF)
 * est conservee de la V3/V4 — seule la peau visuelle des cibles et des jetons change.
 *
 * Sequence (25s @30fps = 750f) : etablissement terrain -> phase aeroport -> phase palais ->
 * phase tour TV -> resolution. Jamais simultane (doctrine DECISION-jetons-vs-vehicules.md).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile } from "remotion";

export const KHARTOUM_EM_FPS = 30;
export const KHARTOUM_EM_FRAMES = 750; // 25s @ 30fps

const RED = "#8a2a20";
const IVORY = "#f2ebd9";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

type TargetKey = "aeroport" | "palais" | "tourtv";

// positions exactes du fond SVG recompose (khartoum-svg-RECOMPOSE.svg) — NE PAS deriver, lire
// directement les <g id="target-*"> de ce fichier si on doit re-synchroniser un jour.
const TARGETS: Record<TargetKey, { x: number; y: number; label: string }> = {
  tourtv: { x: 580, y: 340, label: "TOUR TV — OMDURMAN" },
  palais: { x: 1020, y: 560, label: "PALAIS PRESIDENTIEL" },
  aeroport: { x: 1280, y: 820, label: "AEROPORT INTERNATIONAL" },
};

// point de depart des colonnes RSF (staging-rsf du fond recompose, sud-est, hors des 3 cibles)
const RSF_ORIGIN = { x: 1750, y: 940 };

// (Les ponts sur le Nil ont ete testes puis RETIRES — retour Aziz : complexite geometrique
// disproportionnee pour le gain. La colonne suit son trajet direct sans structure de pont.)

const ESTABLISH_END = 40;
const PHASE_LEN = 200;
const ORDER: TargetKey[] = ["aeroport", "palais", "tourtv"];
const PHASE_STARTS: Record<TargetKey, number> = {
  aeroport: ESTABLISH_END,
  palais: ESTABLISH_END + PHASE_LEN,
  tourtv: ESTABLISH_END + PHASE_LEN * 2,
};
const RESOLUTION_START = ESTABLISH_END + PHASE_LEN * 3;
const CONTACT_OFFSET = 130;

// ── Sonar : anneau qui grandit et s'efface en boucle continue ──
const Sonar: React.FC<{ cx: number; cy: number; frame: number; period: number; phase?: number; rMax: number }> = ({
  cx,
  cy,
  frame,
  period,
  phase = 0,
  rMax,
}) => {
  const t = (((frame + phase) % period) + period) % period / period;
  const r = 10 + t * rMax;
  const op = (1 - t) * 0.65;
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={RED} strokeWidth={2.5} opacity={op} />;
};

// point sur la quadratique Bezier M origin Q mid target, a t in [0,1]
const quadPoint = (
  origin: { x: number; y: number },
  mid: { x: number; y: number },
  target: { x: number; y: number },
  t: number
) => {
  const mt = 1 - t;
  const x = mt * mt * origin.x + 2 * mt * t * mid.x + t * t * target.x;
  const y = mt * mt * origin.y + 2 * mt * t * mid.y + t * t * target.y;
  return { x, y };
};

// ── V8 : pion losange choisi par Aziz (plus simple/robuste que vehicule ou portrait-par-jeton),
// mais juge "nul" nu (juste croix) — 3 variantes d'enrichissement testees en parallele, cf.
// out/_rnd/khartoum-etatmajor-svg/DECODE-NOTES.md pour le detail de la comparaison.
// "biseau"  : double losange imbrique (relief/profondeur), zero risque de bruit visuel.
// "rosette" : la croix devient une etoile a 8 branches, plus ornemental/grave (registre sceau).
// "portrait-groupe" : losange simple SANS enrichissement individuel + UN SEUL medaillon portrait-rsf.png
//   flottant AU-DESSUS de la formation entiere (pas par-pion) — inspire de la vraie reference Battle
//   Probe decodee (chaque unite = simple cercle, la richesse vient du portrait de COMMANDANT par groupe,
//   pas du detail de chaque pion individuel).
const TOKEN_ENRICHMENT: "biseau" | "rosette" | "portrait-groupe" | "portrait-formation" = "portrait-formation";

// ── V9 : "R" biseaute — choix final Claude (cf. session). Le losange biseaute (relief, zero bruit
// visuel) + un monogramme "R" (lisible net a toute echelle, teste vs texte "RSF" illisible et vs
// rosette/sabre qui deviennent des motifs abstraits sans identite) remplace la croix generique.
// Systeme GENERALISABLE : meme construction (losange biseaute + lettre) reutilisable pour toute
// faction future (ex. "S" pour SAF). Le "R" contre-tourne (heading recu) pour rester TOUJOURS
// lisible droit — comme un vrai insigne, seul le corps du losange suit le cap du pion.
const RsfDiamondBiseau: React.FC<{ heading?: number }> = ({ heading = 0 }) => (
  <g filter="url(#emGlow)">
    <polygon points="0,-18 18,0 0,18 -18,0" fill="#8a2410" stroke="#2b1410" strokeWidth={1} />
    <polygon points="0,-13 13,0 0,13 -13,0" fill="#b8341f" stroke="#e7bd78" strokeWidth={1.3} />
    <text x={0} y={5.5} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={15} fill="#e7bd78" transform={`rotate(${-heading})`}>R</text>
  </g>
);

const RsfDiamondRosette: React.FC = () => (
  <g filter="url(#emGlow)">
    <polygon points="0,-17 17,0 0,17 -17,0" fill="#8a2410" stroke="#2b1410" strokeWidth={1.5} />
    <polygon points="0,-11 4,-4 11,0 4,4 0,11 -4,4 -11,0 -4,-4" fill="#b8341f" stroke="#e7bd78" strokeWidth={1.2} />
    <circle cx={0} cy={0} r={3} fill="#e7bd78" />
  </g>
);

const RsfDiamondPlain: React.FC = () => (
  <g filter="url(#emGlow)">
    <polygon points="0,-16 16,0 0,16 -16,0" fill="#b8341f" stroke="#f2ebd9" strokeWidth={1.8} />
    <line x1={0} y1={-8} x2={0} y2={8} stroke="#e7bd78" strokeWidth={2} />
    <line x1={-8} y1={0} x2={8} y2={0} stroke="#e7bd78" strokeWidth={2} />
  </g>
);

// heading recu pour contre-tourner le motif interne quand besoin — AUCUN des 3 losanges n'a
// besoin de contre-rotation (un losange+croix est symetrique, tourner ne le degrade pas), mais
// on garde la prop pour le medaillon-commandant (visage) qui LUI doit toujours rester droit.
const RsfVehicle: React.FC<{ heading?: number }> = ({ heading = 0 }) => {
  const style: string = TOKEN_ENRICHMENT;
  if (style === "biseau") return <RsfDiamondBiseau heading={heading} />;
  if (style === "rosette") return <RsfDiamondRosette />;
  return <RsfDiamondPlain />;
};

// Portrait rond parchemin, factorise (rayon parametrable) — reutilise pour 2 usages testes :
// (1) medaillon-commandant unique au-dessus de la formation, (2) formation-portrait V10 ci-dessous
// (plusieurs portraits espaces, un par pion, teste suite au retour Aziz "est-ce que 3-4 portraits
// espaces transmettent mieux l'info qu'un seul medaillon central ?"). JAMAIS de rotation (clipPath
// unique <defs> partagee — id fixe car un seul rendu actif a la fois par variante, pas de collision).
const RsfPortraitCircle: React.FC<{ r?: number }> = ({ r = 15 }) => (
  <g filter="url(#emShadow)">
    <defs>
      <clipPath id="rsfPortraitClip">
        <circle cx={0} cy={0} r={r} />
      </clipPath>
    </defs>
    <circle cx={0} cy={0} r={r} fill={IVORY} stroke="#8a2a20" strokeWidth={r * 0.16} />
    <g clipPath="url(#rsfPortraitClip)">
      <image
        href={staticFile("_shared/sprites/warmap/portrait-rsf.png")}
        x={-r * 1.21}
        y={-r * 1.1}
        width={r * 2.43}
        height={r * 2.43}
        preserveAspectRatio="xMidYMid slice"
      />
      <rect x={-r} y={r * 0.53} width={r * 2} height={r * 0.47} fill="#8a2a20" opacity={0.55} />
    </g>
  </g>
);

// Medaillon-commandant : UN portrait, flotte AU-DESSUS de la formation (position fixe, jamais
// tourne — "un visage ne tourne pas", doctrine WarMapEngine). Variante "portrait-groupe".
const CommanderMedallion: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <g transform={`translate(${x} ${y - 38})`} opacity={opacity}>
    <RsfPortraitCircle r={15} />
  </g>
);

// ── EFFET Poussiere : petites particules sable qui trainent DERRIERE un jeton en mouvement et
// s'effacent (touche vivante + sens du deplacement). Deterministe par seed (pas de Math.random,
// interdit en Remotion : casse la reproductibilite frame). ──
const DustTrail: React.FC<{ cx: number; cy: number; backX: number; backY: number; frame: number; seed: number }> = ({
  cx,
  cy,
  backX,
  backY,
  frame,
  seed,
}) => {
  const N = 8;
  const parts = Array.from({ length: N }).map((_, i) => {
    // age deterministe qui boucle : chaque particule nait a un moment decale, vieillit, disparait
    const period = 24;
    const born = (i / N) * period + seed * 3;
    const age = (((frame - born) % period) + period) % period;
    // recule le long de -cap, avec un peu de dispersion laterale pseudo-aleatoire (jag sur seed+i)
    const dist = 8 + age * 1.2;
    const jag = Math.sin((seed * 7 + i * 13.1) * 12.9898) * 43758.5453;
    const lat = ((jag - Math.floor(jag)) * 2 - 1) * (3 + age * 0.4);
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

// ── EFFET Fumee : colonne de fumee qui monte d'une cible detruite, apparait a l'impact et persiste.
// Volutes empilees (cercles) qui montent en boucle + turbulence SVG deformante (seed anime). Chaque
// cible a son filtre unique (id derive de la position) pour eviter la collision de <defs>. ──
const SmokeColumn: React.FC<{ x: number; y: number; frame: number; startFrame: number }> = ({ x, y, frame, startFrame }) => {
  const rel = frame - startFrame;
  if (rel < 0) return null;
  const appear = interpolate(rel, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seed = Math.floor(frame / 4) % 20;
  const fid = `smoke-${Math.round(x)}-${Math.round(y)}`;
  // 3 bouffees decalees qui montent de 0 vers -58 puis se dissipent, en boucle
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

const bezierMid = (a: { x: number; y: number }, b: { x: number; y: number }, bow: number) => ({
  x: (a.x + b.x) / 2 + (b.y - a.y) * bow,
  y: (a.y + b.y) / 2 - (b.x - a.x) * bow,
});

// ── Colonne RSF : formation qui avance le long d'une Bezier directe vers la cible, orientation
// dynamique (atan2) + leger swagger lateral organique (pas rectiligne) + trainee fine du chemin
// parcouru + pointe d'impact a l'arrivee. (Ponts retires : trajet direct, une seule Bezier.)
const RsfArrow: React.FC<{
  target: { x: number; y: number };
  frame: number;
  phaseStart: number;
}> = ({ target, frame, phaseStart }) => {
  const local = frame - phaseStart;
  if (local < 0 || local > PHASE_LEN) return null;

  // la colonne parcourt tout le trajet jusqu'au CONTACT_OFFSET (pas un spring qui converge en 30f
  // et laisse la formation "arrivee" immobile pendant le reste des 200f de la phase). Easing
  // inOut (demarrage progressif depuis l'arret puis vitesse de croisiere) — mouvement organique
  // valide par Aziz. (Le saccadage/charge finale teste en V12 rendait le deplacement "bizarre",
  // retire : on garde le mouvement fluide du prototype precedent.)
  const t = interpolate(local, [0, CONTACT_OFFSET], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const advance = t;
  const DASH = 2600;
  const off = (1 - t) * DASH;

  // trajet direct : une seule Bezier RSF -> cible (ponts retires)
  const mid = bezierMid(RSF_ORIGIN, target, 0.12);
  const posAt = (tt: number) => quadPoint(RSF_ORIGIN, mid, target, tt);
  const path = `M${RSF_ORIGIN.x} ${RSF_ORIGIN.y} Q ${mid.x} ${mid.y} ${target.x} ${target.y}`;

  const arrived = advance > 0.92;
  const headOp = clampI(local, CONTACT_OFFSET - 25, CONTACT_OFFSET - 12);

  // angle a l'arrivee
  const angle = (Math.atan2(target.y - mid.y, target.x - mid.x) * 180) / Math.PI;

  const isPortraitFormation = (TOKEN_ENRICHMENT as string) === "portrait-formation";

  const vehicleOpacity = clampI(local, 0, 10);
  // formation en echelon : 2 vehicules en retrait (offset lateral perpendiculaire au cap), pas 1
  // seul isole. Chaque vehicule a sa PROPRE phase/frequence de swagger + un leger dephasage
  // temporel (pas exactement synchronise) + un cahot vertical subtil — un convoi reel n'avance
  // jamais en bloc parfaitement rigide, chaque vehicule reagit un peu differemment au terrain.
  // Variante "portrait-formation" (V10, test Aziz) : espacement plus large (pas "trop colles") +
  // 4 positions au lieu de 3 — chaque portrait reste identifiable individuellement, pas un amas.
  const formationOffsets = isPortraitFormation
    ? [
        { back: 0, side: 0, swaggerFreq: 0.31, swaggerPhase: 0, swaggerAmp: 3.5, bumpFreq: 0.9, bumpPhase: 0 },
        { back: 34, side: 34, swaggerFreq: 0.27, swaggerPhase: 1.8, swaggerAmp: 4.2, bumpFreq: 0.8, bumpPhase: 2.1 },
        { back: 34, side: -34, swaggerFreq: 0.34, swaggerPhase: 3.4, swaggerAmp: 3.8, bumpFreq: 1.0, bumpPhase: 4.5 },
        { back: 60, side: 0, swaggerFreq: 0.29, swaggerPhase: 5.1, swaggerAmp: 3.6, bumpFreq: 0.85, bumpPhase: 1.2 },
      ]
    : [
        { back: 0, side: 0, swaggerFreq: 0.31, swaggerPhase: 0, swaggerAmp: 3.5, bumpFreq: 0.9, bumpPhase: 0 },
        { back: 26, side: 22, swaggerFreq: 0.27, swaggerPhase: 1.8, swaggerAmp: 4.2, bumpFreq: 0.8, bumpPhase: 2.1 },
        { back: 26, side: -22, swaggerFreq: 0.34, swaggerPhase: 3.4, swaggerAmp: 3.8, bumpFreq: 1.0, bumpPhase: 4.5 },
      ];

  const leadT = Math.max(0, t);
  const leadCenter = posAt(leadT);

  return (
    <g>
      <path d={path} fill="none" stroke={IVORY} strokeWidth={2.4} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={off} opacity={0.85} />
      {!arrived && (
        <g opacity={vehicleOpacity}>
          {formationOffsets.map((o, i) => {
            const vt = Math.max(0, t - o.back / 900);
            const p = posAt(vt);
            const aheadT2 = Math.max(0, vt - 0.015);
            const behindP = posAt(aheadT2);
            const heading = (Math.atan2(p.y - behindP.y, p.x - behindP.x) * 180) / Math.PI;
            const perpX = -Math.sin((heading * Math.PI) / 180);
            const perpY = Math.cos((heading * Math.PI) / 180);
            const swagger = Math.sin(local * o.swaggerFreq + o.swaggerPhase) * o.swaggerAmp;
            const bump = Math.sin(local * o.bumpFreq + o.bumpPhase) * 1.3;
            const vx = p.x + perpX * (o.side + swagger);
            const vy = p.y + perpY * (o.side + swagger) + bump;
            const wiggleAngle = Math.sin(local * o.swaggerFreq + o.swaggerPhase) * 3.5;
            const totalAngle = heading + wiggleAngle;
            // direction opposee au cap = ou trainer la poussiere (derriere le jeton)
            const backX = -Math.cos((heading * Math.PI) / 180);
            const backY = -Math.sin((heading * Math.PI) / 180);
            if (isPortraitFormation) {
              // portraits : PAS de rotation (un visage reste toujours droit), juste translate.
              // + poussiere qui traine DERRIERE chaque portrait en mouvement (touche vivante, sens du deplacement).
              const moving = t > 0.02 && t < 0.97;
              return (
                <g key={i}>
                  {moving && (
                    <DustTrail cx={vx} cy={vy} backX={backX} backY={backY} frame={local} seed={i} />
                  )}
                  <g transform={`translate(${vx} ${vy})`}>
                    <RsfPortraitCircle r={16} />
                  </g>
                </g>
              );
            }
            return (
              <g key={i} transform={`translate(${vx} ${vy}) rotate(${totalAngle}) scale(2.1)`}>
                <RsfVehicle heading={totalAngle} />
              </g>
            );
          })}
          {(TOKEN_ENRICHMENT as string) === "portrait-groupe" && (
            <CommanderMedallion x={leadCenter.x} y={leadCenter.y} opacity={1} />
          )}
        </g>
      )}
      {arrived && (
        <g opacity={headOp} transform={`translate(${target.x} ${target.y}) rotate(${angle})`}>
          <polygon points="0,0 -34,-13 -22,0 -34,13" fill={RED} />
        </g>
      )}
    </g>
  );
};

// ── Impact au contact : flash + onde de choc (ripple) qui s'etend et s'efface — V5 : 2 anneaux
// concentriques decales dans le temps (au lieu d'un seul halo statique "trop discret" critique par
// Gemini pour palais/aeroport), rayon d'expansion plus grand pour rester lisible a distance.
const Impact: React.FC<{ x: number; y: number; frame: number; startFrame: number }> = ({ x, y, frame, startFrame }) => {
  const t = frame - startFrame;
  if (t < 0) return null;
  const scale = interpolate(t, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOp = interpolate(t, [0, 4, 20], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloOp = interpolate(t, [0, 8, 70], [0, 0.9, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 2 anneaux d'onde de choc, decales, qui s'etendent puis s'effacent (ripple radar) — bien plus
  // visible que le halo statique r=17 de la V4 sur les cibles palais/aeroport.
  const ring1R = interpolate(t, [0, 55], [10, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring1Op = interpolate(t, [0, 10, 55], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring2R = interpolate(t, [12, 70], [10, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring2Op = interpolate(t, [12, 24, 70], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={ring1R} fill="none" stroke={RED} strokeWidth={4} opacity={ring1Op} />
      <circle r={ring2R} fill="none" stroke="#bf9442" strokeWidth={2.5} opacity={ring2Op} />
      <g transform={`scale(${scale})`}>
        <circle r={22} fill={IVORY} opacity={flashOp} />
        <circle r={17} fill="#dca95e" stroke={RED} strokeWidth={2} opacity={haloOp} />
        <path d="M0,-13 L-6,10 L6,10 Z" fill={RED} opacity={haloOp} />
      </g>
    </g>
  );
};

// ── Statut CAPTUREE (V13, retour Aziz) : le SCEAU R (losange de nos jetons = marqueur de possession)
// s'installe sur la cible apres l'impact, en scale-in avec un anneau qui pulse une fois. La teinte
// rouge par-dessus a ete RETIREE : c'est le BATIMENT LUI-MEME qui devient semi-transparent (gere
// dans buildingOpacityFor), plus propre que recouvrir la cible. Ensemble : batiment vide + sceau R
// = lecture immediate "detruit ET pris par RSF".
const CaptureSeal: React.FC<{ x: number; y: number; frame: number; captureFrame: number }> = ({
  x,
  y,
  frame,
  captureFrame,
}) => {
  const rel = frame - captureFrame;
  if (rel < 0) return null;
  // sceau : apparait ~10f apres l'impact, scale-in avec leger overshoot
  const sealRel = rel - 10;
  const sealScale = sealRel < 0 ? 0 : interpolate(sealRel, [0, 8, 14], [0, 1.18, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sealOp = clampI(sealRel, 0, 8);
  // anneau qui pulse UNE fois a l'installation du sceau
  const pulseR = sealRel < 0 ? 0 : interpolate(sealRel, [0, 22], [14, 44], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseOp = sealRel < 0 ? 0 : interpolate(sealRel, [0, 6, 22], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* anneau de prise (pulse une fois) */}
      {pulseOp > 0 && <circle r={pulseR} fill="none" stroke="#e7bd78" strokeWidth={2.5} opacity={pulseOp} />}
      {/* sceau R (le losange de nos jetons = marqueur de possession) */}
      {sealScale > 0 && (
        <g transform={`scale(${sealScale})`} opacity={sealOp} filter="url(#emShadow)">
          <polygon points="0,-16 16,0 0,16 -16,0" fill={RED} stroke={IVORY} strokeWidth={2} />
          <polygon points="0,-11 11,0 0,11 -11,0" fill="none" stroke="#e7bd78" strokeWidth={1.2} />
          <text x={0} y={5.5} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={15} fill="#e7bd78">R</text>
        </g>
      )}
    </g>
  );
};

// ── Ligne de front : arc pointille qui delimite la zone tenue par la RSF, recule/s'etend une fois
// la cible capturee (repond a la suggestion "lignes de front qui se tordent et reculent"). ──
const FrontLine: React.FC<{ cx: number; cy: number; frame: number; captureFrame: number }> = ({ cx, cy, frame, captureFrame }) => {
  const captured = frame >= captureFrame;
  const expand = captured ? clampI(frame, captureFrame, captureFrame + 40) : 0;
  const r = 95 + expand * 40;
  const op = captured ? 0.55 - expand * 0.15 : 0.35;
  return (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#bf9442" strokeWidth={2} strokeDasharray="9 7" opacity={op} />
  );
};

// ── Icone "combats en cours" : trois eclats brises clignotants, visible pendant la phase active
// (avant l'impact) — repond a "icone de statut combats en cours" suggeree par Gemini. ──
const CombatIcon: React.FC<{ x: number; y: number; frame: number; active: boolean }> = ({ x, y, frame, active }) => {
  if (!active) return null;
  const blink = (Math.sin(frame * 0.5) + 1) / 2;
  return (
    <g transform={`translate(${x + 46} ${y - 46})`} opacity={0.55 + blink * 0.45}>
      <circle r={13} fill="#2a120e" opacity={0.85} />
      <path d="M-6,-8 L1,-1 L-3,1 L6,8 L-1,0 L3,-2 Z" fill="#e7bd78" />
    </g>
  );
};

// ── Cible : reveal (sonar + halo d'apparition) pose SUR le batiment illustre du fond recompose ──
const TargetReveal: React.FC<{ x: number; y: number; frame: number; appearAt: number; hit: boolean }> = ({
  x,
  y,
  frame,
  appearAt,
  hit,
}) => {
  const t = clampI(frame, appearAt, appearAt + 22);
  if (t <= 0) return null;
  return (
    <g opacity={t}>
      <Sonar cx={x} cy={y} frame={frame} period={44} phase={x % 40} rMax={58} />
      {hit && <circle cx={x} cy={y} r={70} fill="none" stroke="#bf9442" strokeWidth={2} opacity={0.5} />}
    </g>
  );
};

// hideSubtitle : masque le bandeau sous-titre interne (à utiliser quand une narration off dit déjà
// la même chose — évite le doublon voix/texte banni par la doctrine WARMAP). Défaut false = autonome.
export const KhartoumEtatMajorSVG: React.FC<{ hideSubtitle?: boolean }> = ({ hideSubtitle = false }) => {
  const frame = useCurrentFrame();

  const pFond = clampI(frame, 0, 25);
  const cartouche = clampI(frame, 0, 16);

  const revealed: TargetKey[] = ORDER.filter((k) => frame >= PHASE_STARTS[k] + CONTACT_OFFSET - 20);

  // les batiments (footprint architectural) n'apparaissent qu'a partir de l'etablissement, en fondu
  const buildingsOp = clampI(frame, ESTABLISH_END - 15, ESTABLISH_END + 10);

  // STATUT CAPTUREE (V13, retour Aziz) : une fois la cible frappee, le BATIMENT LUI-MEME devient
  // semi-transparent (se vide/tombe) — lecture immediate du changement d'etat, plus propre qu'une
  // teinte par-dessus. Le sceau R (rendu par CaptureSeal) s'installe en plus.
  const buildingOpacityFor = (k: TargetKey): number => {
    const cf = PHASE_STARTS[k] + CONTACT_OFFSET;
    if (frame < cf) return buildingsOp;
    // fondu de l'opacite pleine (1) vers 0.32 sur ~24f apres l'impact, puis reste vide
    return interpolate(frame, [cf, cf + 24], [buildingsOp, 0.32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // camera shake au contact
  const contactFrames = ORDER.map((k) => PHASE_STARTS[k] + CONTACT_OFFSET);
  let shakeX = 0;
  let shakeY = 0;
  for (const cf of contactFrames) {
    const local = frame - cf;
    if (local >= 0 && local < 7) {
      shakeX = Math.sin(local * 7) * 4;
      shakeY = Math.cos(local * 9) * 3;
    }
  }

  const subtitleFor = (): string => {
    if (frame < ESTABLISH_END) return "Khartoum, 15 avril 2023, au matin.";
    if (frame < PHASE_STARTS.palais) return "La RSF frappe l'aeroport international en premier.";
    if (frame < PHASE_STARTS.tourtv) return "Puis la colonne converge vers le palais presidentiel.";
    if (frame < RESOLUTION_START) return "La tour TV d'Omdurman tombe a son tour.";
    return "Trois cibles, une seule matinee. Khartoum bascule dans la guerre.";
  };

  return (
    <AbsoluteFill style={{ background: "#0b1526", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
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

        {/* ============ FOND RECOMPOSE (fige, issu de khartoum-svg-RECOMPOSE.svg) ============ */}
        <g opacity={pFond}>
          <rect id="background-base" width={1920} height={1080} fill="#d9c092" />
          <rect id="background-grid" width={1920} height={1080} fill="url(#emGrid)" />

          <g id="registration-marks" stroke="#8a3324" strokeWidth={1.5} opacity={0.4}>
            <path d="M 460 270 L 500 270 M 480 250 L 480 290" />
            <path d="M 1440 270 L 1480 270 M 1460 250 L 1460 290" />
            <path d="M 460 810 L 500 810 M 480 790 L 480 830" />
            <path d="M 1440 810 L 1480 810 M 1460 790 L 1460 830" />
            <circle cx={480} cy={270} r={8} fill="none" />
            <circle cx={1460} cy={270} r={8} fill="none" />
            <circle cx={480} cy={810} r={8} fill="none" />
            <circle cx={1460} cy={810} r={8} fill="none" />
          </g>

          <g id="terrain">
            <path d="M 320 560 C 450 380, 680 440, 780 560 C 880 680, 650 780, 450 680 C 280 580, 220 680, 320 560 Z" fill="#ceb280" stroke="#8a3324" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.6} />
            <path d="M 360 560 C 460 430, 630 480, 710 560 C 790 640, 620 710, 470 640 C 350 570, 300 630, 360 560 Z" fill="#c4a56e" opacity={0.4} />
            <path d="M 1220 680 C 1350 520, 1580 580, 1680 700 C 1780 820, 1550 880, 1380 820 C 1220 760, 1100 820, 1220 680 Z" fill="#ceb280" stroke="#8a3324" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.6} />
            <path d="M 1270 680 C 1370 570, 1530 620, 1610 700 C 1690 780, 1520 820, 1400 780 C 1280 740, 1190 780, 1270 680 Z" fill="#c4a56e" opacity={0.4} />
            <path d="M 150 220 Q 400 120 750 240 T 1250 140 T 1750 320" fill="none" stroke="#c7a977" strokeWidth={2.5} opacity={0.8} />
            <path d="M 120 280 Q 400 180 720 290 T 1220 190 T 1800 380" fill="none" stroke="#c7a977" strokeWidth={1} opacity={0.8} />
            <path d="M 80 880 Q 350 980 650 860 T 1050 980" fill="none" stroke="#c7a977" strokeWidth={2} opacity={0.8} />
            <path d="M 50 930 Q 320 1030 620 910 T 1020 1030" fill="none" stroke="#c7a977" strokeWidth={1} opacity={0.8} />
          </g>

          <g id="river">
            <path d="M 1040 -10 C 1020 180, 1080 320, 990 500 C 1090 680, 1060 880, 1140 1090 L 1060 1090 C 990 850, 1020 650, 930 510 C 680 540, 380 500, -10 580 L -10 500 C 380 430, 680 470, 920 440 C 990 280, 940 150, 960 -10 Z" fill="#e0cba8" stroke="#4a1f18" strokeWidth={3} />
            <path d="M 1000 -10 C 980 180, 1040 320, 960 470 C 1040 680, 1030 880, 1100 1090" fill="none" stroke="#c7a977" strokeWidth={2} strokeDasharray="12 12" />
            <path d="M 960 470 C 680 500, 380 460, -10 540" fill="none" stroke="#c7a977" strokeWidth={2} strokeDasharray="12 12" />
          </g>

          {/* (Ponts retires — retour Aziz : trajet direct, pas de structure de pont.) */}

          {/* ── Cible 1 : Tour TV Omdurman (580,340) ── */}
          <g id="target-tower">
            <line x1={580} y1={340} x2={580} y2={440} stroke="#4a1f18" strokeWidth={2} />
            <circle cx={580} cy={340} r={65} fill="#d9c092" opacity={0.3} />
            <line x1={490} y1={340} x2={670} y2={340} stroke="#4a1f18" strokeWidth={1} opacity={0.7} />
            <line x1={580} y1={250} x2={580} y2={430} stroke="#4a1f18" strokeWidth={1} opacity={0.7} />
            <g opacity={buildingOpacityFor("tourtv")} transform="translate(580, 340) scale(3.1) translate(-14,-1)">
              <g stroke="#2b2117" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round">
                <path d="M -40,30 L -14,17" fill="none" stroke="#6b5c42" strokeWidth={2.4} strokeDasharray="0.1,3.2" />
                <rect x={-30} y={4} width={34} height={26} fill="none" stroke="#5c4d38" strokeWidth={0.8} strokeDasharray="2,1.6" />
                <g stroke="#5c4d38" strokeWidth={0.6}>
                  <line x1={-27} y1={26} x2={-27} y2={21} />
                  <line x1={-24} y1={26} x2={-24} y2={21} />
                  <line x1={-21} y1={26} x2={-21} y2={21} />
                  <line x1={-18} y1={26} x2={-18} y2={21} />
                </g>
                <rect x={-27} y={6} width={20} height={12} fill="#8a7c5e" stroke="#2b2117" strokeWidth={1.1} />
                <g stroke="#6b5c42" strokeWidth={0.5}>
                  <line x1={-24} y1={6} x2={-24} y2={18} />
                  <line x1={-20} y1={6} x2={-20} y2={18} />
                  <line x1={-16} y1={6} x2={-16} y2={18} />
                  <line x1={-12} y1={6} x2={-12} y2={18} />
                </g>
                <rect x={-9} y={10} width={10} height={16} fill="#7a6d53" stroke="#2b2117" strokeWidth={1.1} />
                <line x1={-9} y1={16} x2={1} y2={16} stroke="#6b5c42" strokeWidth={0.5} />
                <line x1={-9} y1={21} x2={1} y2={21} stroke="#6b5c42" strokeWidth={0.5} />
                <rect x={-2} y={4} width={6} height={5} fill="#9a8d73" stroke="#2b2117" strokeWidth={0.9} />
                <path d="M 1,17 L 13,4" fill="none" stroke="#6b5c42" strokeWidth={1} strokeDasharray="1.6,1.4" />
                <circle cx={13} cy={-14} r={1.1} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.7} />
                <circle cx={26} cy={6} r={1.1} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.7} />
                <circle cx={4} cy={12} r={1.1} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.7} />
                <g stroke="#4a3f2e" strokeWidth={0.55}>
                  <line x1={14} y1={1} x2={13} y2={-14} />
                  <line x1={14} y1={1} x2={26} y2={6} />
                  <line x1={14} y1={1} x2={4} y2={12} />
                </g>
                <rect x={10.5} y={-2.5} width={7} height={7} fill="#9a8d73" stroke="#2b2117" strokeWidth={1} />
                <path d="M 10.5,-2.5 L 17.5,4.5 M 17.5,-2.5 L 10.5,4.5" stroke="#2b2117" strokeWidth={0.5} />
                <rect x={12} y={-1} width={4} height={4} fill="none" stroke="#2b2117" strokeWidth={0.45} />
                <circle cx={14} cy={1} r={1.3} fill="#5c4d38" stroke="#2b2117" strokeWidth={0.7} />
                <circle cx={14} cy={1} r={0.4} fill="#2b2117" />
              </g>
            </g>
            <rect x={450} y={440} width={260} height={38} fill="#4a1f18" stroke="#c7a977" strokeWidth={1} filter="url(#emShadow)" />
            <text x={580} y={465} textAnchor="middle" fill="#f5e6ce" fontFamily="system-ui, -apple-system, sans-serif" fontSize={15} fontWeight={700} letterSpacing={2.5}>TOUR TV — OMDURMAN</text>
          </g>

          {/* ── Cible 2 : Palais Presidentiel (1020,560) ── */}
          <g id="target-palace">
            <line x1={1020} y1={560} x2={1020} y2={650} stroke="#4a1f18" strokeWidth={2} />
            <circle cx={1020} cy={560} r={65} fill="#d9c092" opacity={0.3} />
            <circle cx={1020} cy={560} r={55} fill="none" stroke="#4a1f18" strokeWidth={1} opacity={0.6} />
            <circle cx={1020} cy={560} r={45} fill="none" stroke="#4a1f18" strokeWidth={0.5} opacity={0.6} />
            <line x1={930} y1={560} x2={1110} y2={560} stroke="#4a1f18" strokeWidth={1} opacity={0.7} />
            <line x1={1020} y1={470} x2={1020} y2={650} stroke="#4a1f18" strokeWidth={1} opacity={0.7} />
            <g opacity={buildingOpacityFor("palais")} transform="translate(1020, 560) scale(1.3) translate(0,-8)">
              <g stroke="#2b2117" strokeWidth={0.6} strokeLinejoin="round">
                <rect x={-37} y={-36} width={74} height={72} fill="none" strokeWidth={1} opacity={0.55} />
                <g strokeWidth={0.35}>
                  <rect x={-30} y={10} width={8} height={8} fill="#c7a76f" />
                  <rect x={-20} y={10} width={8} height={8} fill="#c7a76f" />
                  <rect x={2} y={10} width={8} height={8} fill="#c7a76f" />
                  <rect x={12} y={10} width={8} height={8} fill="#c7a76f" />
                  <rect x={-30} y={20} width={8} height={8} fill="#c7a76f" />
                  <rect x={-20} y={20} width={8} height={8} fill="#c7a76f" />
                  <rect x={2} y={20} width={8} height={8} fill="#c7a76f" />
                  <rect x={12} y={20} width={8} height={8} fill="#c7a76f" />
                  <line x1={-9} y1={8} x2={-9} y2={30} strokeWidth={0.5} />
                </g>
                <rect x={-6} y={14} width={12} height={20} fill="#8f8266" />
                <line x1={0} y1={14} x2={0} y2={34} strokeWidth={0.3} />
                <line x1={-6} y1={24} x2={6} y2={24} strokeWidth={0.3} />
                <g fill="#8f8266">
                  <rect x={-24} y={-4} width={10} height={16} />
                  <rect x={14} y={-4} width={10} height={16} />
                  <rect x={-14} y={-4} width={28} height={10} />
                </g>
                <g strokeWidth={0.3}>
                  <line x1={-19} y1={-4} x2={-19} y2={12} />
                  <line x1={19} y1={-4} x2={19} y2={12} />
                  <line x1={-14} y1={1} x2={14} y2={1} />
                </g>
                <g strokeWidth={0.25}>
                  <line x1={-10} y1={-4} x2={-10} y2={6} />
                  <line x1={-5} y1={-4} x2={-5} y2={6} />
                  <line x1={5} y1={-4} x2={5} y2={6} />
                  <line x1={10} y1={-4} x2={10} y2={6} />
                  <line x1={-21} y1={-4} x2={-21} y2={12} />
                  <line x1={21} y1={-4} x2={21} y2={12} />
                </g>
                <circle cx={0} cy={-6} r={6.5} fill="#9a8d73" />
                <circle cx={0} cy={-6} r={6.5} fill="none" strokeWidth={0.5} />
                <circle cx={0} cy={-6} r={3.6} fill="#8f8266" />
                <g fill="#2b2117">
                  <circle cx={0} cy={-12.3} r={0.55} />
                  <circle cx={3.2} cy={-11.4} r={0.55} />
                  <circle cx={-3.2} cy={-11.4} r={0.55} />
                  <circle cx={5.6} cy={-9.1} r={0.55} />
                  <circle cx={-5.6} cy={-9.1} r={0.55} />
                  <circle cx={6.4} cy={-6} r={0.55} />
                  <circle cx={-6.4} cy={-6} r={0.55} />
                </g>
                <circle cx={0} cy={-6} r={1} fill="#2b2117" />
                <path d="M -24 6 L -24 22 L 24 22 L 24 6 Z" fill="#c7a76f" strokeWidth={0.4} />
                <circle cx={0} cy={16} r={4.2} fill="#8f8266" strokeWidth={0.4} />
                <circle cx={0} cy={16} r={1.6} fill="none" strokeWidth={0.3} />
                <line x1={0} y1={11.8} x2={0} y2={20.2} strokeWidth={0.25} />
                <line x1={-4.2} y1={16} x2={4.2} y2={16} strokeWidth={0.25} />
                <line x1={0} y1={20.2} x2={0} y2={30} strokeWidth={0.4} />
                <line x1={-24} y1={30} x2={24} y2={30} strokeWidth={1} />
                <g strokeWidth={0.3}>
                  <line x1={-20} y1={28} x2={-20} y2={30} />
                  <line x1={-14} y1={28} x2={-14} y2={30} />
                  <line x1={-8} y1={28} x2={-8} y2={30} />
                  <line x1={8} y1={28} x2={8} y2={30} />
                  <line x1={14} y1={28} x2={14} y2={30} />
                  <line x1={20} y1={28} x2={20} y2={30} />
                </g>
                <rect x={-27} y={27} width={5} height={5} fill="#9a8d73" />
                <rect x={22} y={27} width={5} height={5} fill="#9a8d73" />
                <rect x={-2} y={28.5} width={4} height={3} fill="#7a6d53" />
              </g>
            </g>
            <rect x={890} y={650} width={260} height={38} fill="#4a1f18" stroke="#c7a977" strokeWidth={1} filter="url(#emShadow)" />
            <text x={1020} y={675} textAnchor="middle" fill="#f5e6ce" fontFamily="system-ui, -apple-system, sans-serif" fontSize={15} fontWeight={700} letterSpacing={2.5}>PALAIS PRESIDENTIEL</text>
          </g>

          {/* ── Cible 3 : Aeroport International (1280,820) rotate(-32) ── */}
          <g id="target-airport">
            <line x1={1280} y1={820} x2={1280} y2={920} stroke="#4a1f18" strokeWidth={2} />
            <circle cx={1280} cy={820} r={65} fill="#d9c092" opacity={0.3} />
            <circle cx={1280} cy={820} r={60} fill="none" stroke="#4a1f18" strokeWidth={1} opacity={0.6} />
            <line x1={1190} y1={820} x2={1370} y2={820} stroke="#4a1f18" strokeWidth={1} opacity={0.7} />
            <line x1={1280} y1={730} x2={1280} y2={910} stroke="#4a1f18" strokeWidth={1} opacity={0.7} />
            <g opacity={buildingOpacityFor("aeroport")} transform="translate(1280, 820) rotate(-32) scale(3.6) translate(0,-10)">
              <g id="pictogram-aeroport-topdown">
                <rect x={-38} y={-4.2} width={76} height={8.4} fill="#948566" stroke="#2b2117" strokeWidth={0.35} />
                <rect x={-37} y={-3} width={74} height={6} fill="#8a7c5e" stroke="#2b2117" strokeWidth={0.4} />
                <line x1={-34} y1={0} x2={34} y2={0} stroke="#2b2117" strokeWidth={0.35} strokeDasharray="2.2,1.8" />
                <g stroke="#2b2117" strokeWidth={0.5}>
                  <line x1={-35.5} y1={-2.2} x2={-35.5} y2={2.2} />
                  <line x1={-33.7} y1={-2.2} x2={-33.7} y2={2.2} />
                  <line x1={-31.9} y1={-2.2} x2={-31.9} y2={2.2} />
                  <line x1={35.5} y1={-2.2} x2={35.5} y2={2.2} />
                  <line x1={33.7} y1={-2.2} x2={33.7} y2={2.2} />
                  <line x1={31.9} y1={-2.2} x2={31.9} y2={2.2} />
                </g>
                <path d="M -6,3 L -3,9 L -3,13 L -12,17 L -12,13.5 L -6.5,10.5 Z" fill="#8a7c5e" stroke="#2b2117" strokeWidth={0.35} />
                <path d="M 10,3 L 8,7.5 L 8,10 L -1,10 L -1,7 L 6.5,7 Z" fill="#8a7c5e" stroke="#2b2117" strokeWidth={0.35} />
                <polygon points="-30,14 22,14 27,29 -22,32" fill="#877a5c" stroke="#2b2117" strokeWidth={0.45} />
                <g stroke="#2b2117" strokeWidth={0.25} opacity={0.6}>
                  <line x1={-20} y1={16} x2={-14} y2={29.5} />
                  <line x1={-6} y1={15.3} x2={-3} y2={30.5} />
                  <line x1={8} y1={14.6} x2={14} y2={30} />
                </g>
                <rect x={-19} y={19} width={34} height={7.5} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.45} />
                <rect x={-9} y={26.5} width={3.4} height={7} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.35} />
                <rect x={0} y={26.5} width={3.4} height={7.5} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.35} />
                <rect x={9} y={26.5} width={3.4} height={6.5} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.35} />
                <line x1={-19} y1={22.7} x2={15} y2={22.7} stroke="#2b2117" strokeWidth={0.2} opacity={0.5} />
                <g id="def-avion-gare">
                  <g transform="translate(-14,17) rotate(35) scale(0.62)">
                    <path d="M0,-9 L1.1,-3 L7,1.5 L7,3 L1.2,1.3 L1.6,7.5 L4,9.5 L4,10.6 L0,9.3 L-4,10.6 L-4,9.5 L-1.6,7.5 L-1.2,1.3 L-7,3 L-7,1.5 L-1.1,-3 Z" fill="#7f7358" stroke="#2b2117" strokeWidth={0.55} />
                  </g>
                  <g transform="translate(-2,17.5) rotate(35) scale(0.62)">
                    <path d="M0,-9 L1.1,-3 L7,1.5 L7,3 L1.2,1.3 L1.6,7.5 L4,9.5 L4,10.6 L0,9.3 L-4,10.6 L-4,9.5 L-1.6,7.5 L-1.2,1.3 L-7,3 L-7,1.5 L-1.1,-3 Z" fill="#7f7358" stroke="#2b2117" strokeWidth={0.55} />
                  </g>
                  <g transform="translate(10,17) rotate(35) scale(0.62)">
                    <path d="M0,-9 L1.1,-3 L7,1.5 L7,3 L1.2,1.3 L1.6,7.5 L4,9.5 L4,10.6 L0,9.3 L-4,10.6 L-4,9.5 L-1.6,7.5 L-1.2,1.3 L-7,3 L-7,1.5 L-1.1,-3 Z" fill="#7f7358" stroke="#2b2117" strokeWidth={0.55} />
                  </g>
                </g>
                <g transform="translate(-16,0.3) rotate(90) scale(1.05)">
                  <path d="M0,-9 L1.1,-3 L7,1.5 L7,3 L1.2,1.3 L1.6,7.5 L4,9.5 L4,10.6 L0,9.3 L-4,10.6 L-4,9.5 L-1.6,7.5 L-1.2,1.3 L-7,3 L-7,1.5 L-1.1,-3 Z" fill="#948566" stroke="#2b2117" strokeWidth={0.6} />
                </g>
              </g>
            </g>
            <rect x={1130} y={920} width={300} height={38} fill="#4a1f18" stroke="#c7a977" strokeWidth={1} filter="url(#emShadow)" />
            <text x={1280} y={945} textAnchor="middle" fill="#f5e6ce" fontFamily="system-ui, -apple-system, sans-serif" fontSize={15} fontWeight={700} letterSpacing={2.5}>AEROPORT INTERNATIONAL</text>
          </g>

          {/* point de depart RSF */}
          <g id="staging-rsf">
            <circle cx={1750} cy={940} r={16} fill="#8a3324" filter="url(#emGlow)" />
            <circle cx={1750} cy={940} r={24} fill="none" stroke="#4a1f18" strokeWidth={2.5} />
            <circle cx={1750} cy={940} r={32} fill="none" stroke="#4a1f18" strokeWidth={1.5} strokeDasharray="4 4" />
            <text x={1750} y={995} textAnchor="middle" fill="#4a1f18" fontFamily="system-ui, -apple-system, sans-serif" fontSize={18} fontWeight={800} letterSpacing={2}>RSF</text>
          </g>
        </g>

        {/* ============ COUCHE ANIMEE (lignes de front, colonnes RSF, impacts, sonars, combats) ============ */}
        {ORDER.map((k) => (
          <FrontLine key={`front-${k}`} cx={TARGETS[k].x} cy={TARGETS[k].y} frame={frame} captureFrame={PHASE_STARTS[k] + CONTACT_OFFSET} />
        ))}
        {ORDER.map((k) => (
          <RsfArrow
            key={k}
            target={TARGETS[k]}
            frame={frame}
            phaseStart={PHASE_STARTS[k]}
          />
        ))}
        {ORDER.map((k) => (
          <Impact key={`imp-${k}`} x={TARGETS[k].x} y={TARGETS[k].y} frame={frame} startFrame={PHASE_STARTS[k] + CONTACT_OFFSET} />
        ))}
        {/* Fumee : monte de chaque cible ~12f apres l'impact et persiste jusqu'a la fin (cible detruite) */}
        {ORDER.map((k) => (
          <SmokeColumn key={`smoke-${k}`} x={TARGETS[k].x} y={TARGETS[k].y - 4} frame={frame} startFrame={PHASE_STARTS[k] + CONTACT_OFFSET + 12} />
        ))}
        {ORDER.map((k) => (
          <TargetReveal
            key={k}
            x={TARGETS[k].x}
            y={TARGETS[k].y}
            frame={frame}
            appearAt={ESTABLISH_END - 10}
            hit={revealed.includes(k)}
          />
        ))}
        {/* Statut CAPTUREE : sceau R qui s'installe apres l'impact (le batiment se vide en //
            parallele via buildingOpacityFor) = denouement visuel "detruit et pris" */}
        {ORDER.map((k) => (
          <CaptureSeal
            key={`seal-${k}`}
            x={TARGETS[k].x}
            y={TARGETS[k].y}
            frame={frame}
            captureFrame={PHASE_STARTS[k] + CONTACT_OFFSET}
          />
        ))}
        {ORDER.map((k) => (
          <CombatIcon
            key={`combat-${k}`}
            x={TARGETS[k].x}
            y={TARGETS[k].y}
            frame={frame}
            active={frame >= PHASE_STARTS[k] && frame < PHASE_STARTS[k] + CONTACT_OFFSET + 15}
          />
        ))}

        {/* ============ CADRE, CARTOUCHE, LEGENDE (fige, du fond recompose) ============ */}
        <g opacity={pFond}>
          <g id="frame">
            <rect x={30} y={30} width={1860} height={1020} fill="none" stroke="#4a1f18" strokeWidth={6} />
            <rect x={42} y={42} width={1836} height={996} fill="none" stroke="#4a1f18" strokeWidth={1.5} />
            <path d="M 30 60 L 60 60 L 60 30" fill="none" stroke="#d9c092" strokeWidth={6} />
            <path d="M 1890 60 L 1860 60 L 1860 30" fill="none" stroke="#d9c092" strokeWidth={6} />
            <path d="M 30 1020 L 60 1020 L 60 1050" fill="none" stroke="#d9c092" strokeWidth={6} />
            <path d="M 1890 1020 L 1860 1020 L 1860 1050" fill="none" stroke="#d9c092" strokeWidth={6} />
          </g>
        </g>

        <g opacity={cartouche}>
          <rect x={42} y={42} width={1836} height={56} fill="#4a1f18" opacity={0.08} />
          <line x1={42} y1={98} x2={1878} y2={98} stroke="#4a1f18" strokeWidth={1.5} opacity={0.5} />
          <text x={70} y={78} fill="#4a1f18" fontFamily="system-ui, -apple-system, sans-serif" fontSize={22} fontWeight={800} letterSpacing={4}>KHARTOUM — ATTAQUE COORDONNEE DE LA RSF</text>
          <text x={1850} y={78} textAnchor="end" fill="#4a1f18" fontFamily="Georgia, 'Times New Roman', serif" fontSize={20} fontStyle="italic" letterSpacing={1.5}>15 AVRIL 2023</text>
        </g>

        {/* ============ BANDEAU BAS (sous-titre dynamique par phase) — masqué si narration off ============ */}
        {!hideSubtitle && (
          <g opacity={pFond}>
            <rect x={460} y={958} width={1000} height={68} fill="#2a120e" rx={4} />
            <rect x={465} y={963} width={990} height={58} fill="none" stroke="#8a3324" strokeWidth={1.5} rx={2} />
            <text x={960} y={1002} textAnchor="middle" fill="#f5e6ce" fontFamily="Georgia, 'Times New Roman', serif" fontSize={22} fontStyle="italic" letterSpacing={0.5}>
              {subtitleFor()}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

export default KhartoumEtatMajorSVG;
