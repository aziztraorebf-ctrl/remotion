/**
 * UsineConstruction — sous-scene 4C de B4 : "la Cote d'Ivoire veut transformer son cacao chez elle d'ici 2030".
 * Espoir SOBRE (le combat n'est pas gagne). Base = cible validee eco-ci-FINAL.svg, portee en composant animable.
 *
 * Props (pilotes par le beat) :
 *   build 0..1     : l'usine SE DESSINE (sol -> batiment -> toit -> cheminee), construction progressive.
 *   colorize 0..1  : l'usine + soleil S'ALLUMENT (munition couleur : tout encre, puis couleur = evenement).
 *   chocOut 0..1   : les tablettes descendent le convoyeur et SORTENT du cadre (fade au bord).
 *   windPhase      : frame, pour vie permanente (soleil glow/rayons, fumee, nuages).
 *   groundFromCrack: 0..1 — si >0, le sol "nait" de la fissure du verger (transition liee 4B->4C). Defaut 0.
 *
 * Registre encre. Munition couleur (soleil/usine/chocolat colores, sol en encre). Rien ne sort lateralement du cadre.
 */
import React from "react";
import { interpolate, AbsoluteFill } from "remotion";

const INK = "#332A20";
const CREAM = "#EAE3D3";
const CHOC = "#5E4633";
const SUN = "#f2c14e";

type UsineProps = {
  build?: number;
  colorize?: number;
  chocOut?: number;
  windPhase?: number;
  groundFromCrack?: number;
  palette?: "cacao" | "ivoire" | "ivoire-douce" | "ivoire-douce-chem-verte"; // drapeau CI variantes
};

export const UsineConstruction: React.FC<UsineProps> = ({
  build = 1,
  colorize = 1,
  chocOut = 1,
  windPhase = 0,
  groundFromCrack = 0,
  palette = "cacao",
}) => {
  const wf = windPhase;
  // phases de construction (build) etagees : sol -> batiment -> toit -> cheminee
  // TRACE ORDONNE (la construction se raconte) : sol -> STRUCTURE (murs+toit, contours qui se tracent)
  // -> DETAILS interieurs (porte, fenetres/lignes, cheminee) -> sortie chocolat.
  const bSol = interpolate(build, [0, 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bBat = interpolate(build, [0.13, 0.42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // murs (contour trace)
  const bToit = interpolate(build, [0.32, 0.58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // toit (contour trace)
  const bDetails = interpolate(build, [0.55, 0.78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // porte + lignes interieures
  const bChem = interpolate(build, [0.72, 0.96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // cheminee en dernier

  // colorisation (fill apparait via opacity) — sinon trait encre seul
  const cOp = colorize;
  // couleurs : encre (non colorise) -> couleur (colorise). On superpose un fill colore en opacity=colorize.
  // palette "cacao" = tons terre/cacao (defaut). palette "ivoire" = drapeau CI (orange #F77F00 / blanc / vert #009E60)
  // = l'usine est ivoirienne (transformation souveraine, chez elle).
  // 3 palettes : cacao (defaut terre), ivoire (drapeau CI vif), ivoire-douce (drapeau CI desature/terre).
  const PAL = {
    cacao: { wf: "#d8c4a2", ws: "#c2a878", rf: "#8a5b35", rb: "#6f4628", ch: "#b88a5a" },
    ivoire: { wf: "#F77F00", ws: "#d96f00", rf: "#009E60", rb: "#00824f", ch: "#f4f1ea" },
    // orange BRULE/terre + vert SOURD/olive + creme : dialogue avec le registre encre au lieu de le percer.
    "ivoire-douce": { wf: "#c9762f", ws: "#a85f24", rf: "#5e7245", rb: "#4c5c38", ch: "#e6dcc4" },
    // variante : cheminee de la MEME couleur que le toit (vert olive) — plus unifie, mais perd le blanc du drapeau.
    "ivoire-douce-chem-verte": { wf: "#c9762f", ws: "#a85f24", rf: "#5e7245", rb: "#4c5c38", ch: "#5e7245" },
  }[palette];
  const wallFront = PAL.wf, wallSide = PAL.ws, roofFront = PAL.rf, roofBack = PAL.rb, chimney = PAL.ch;

  // soleil glow + rayons (vie permanente, comme le verger)
  const sunPulse = 0.85 + 0.15 * Math.sin(wf / 22);
  const sunGlowR = 125 * (2.0 + 0.2 * Math.sin(wf / 22));

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="usineSunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SUN} stopOpacity={0.5} />
          <stop offset="55%" stopColor={SUN} stopOpacity={0.16} />
          <stop offset="100%" stopColor={SUN} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* CIEL : soleil colorise + glow + rayons qui tournent + nuages + fumee */}
      <g id="ciel">
        <circle cx={270} cy={280} r={sunGlowR} fill="url(#usineSunGlow)" opacity={cOp * sunPulse} />
        <circle cx={270} cy={280} r={125} fill={SUN} opacity={cOp} />
        <circle cx={270} cy={280} r={125} fill="none" stroke={INK} strokeWidth={2} opacity={0.5} />
        <g stroke={SUN} strokeWidth={6} strokeLinecap="round" opacity={cOp * 0.85}>
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k / 8) * Math.PI * 2 + wf / 120;
            const len = 45 + 15 * Math.sin(wf / 18 + k);
            return <line key={k} x1={270 + Math.cos(a) * 137} y1={280 + Math.sin(a) * 137} x2={270 + Math.cos(a) * (137 + len)} y2={280 + Math.sin(a) * (137 + len)} />;
          })}
        </g>
        {/* nuages qui derivent (jamais hors cadre) */}
        {[{ bx: 700, y: 240, sp: 0.16 }, { bx: 880, y: 330, sp: 0.12 }].map((c, k) => {
          const range = 760; const x = 200 + ((c.bx - 200 - wf * c.sp) % range + range) % range;
          const edge = Math.min(1, Math.min(x - 200, 960 - x) / 100);
          return <path key={k} d={`M${x} ${c.y} Q${x + 50} ${c.y - 22} ${x + 100} ${c.y} T${x + 200} ${c.y - 6}`} fill="none" stroke={INK} strokeWidth={2.2} opacity={0.5 * Math.max(0, edge)} strokeLinecap="round" />;
        })}
      </g>

      {/* SOL (encre) — apparait avec bSol. Si groundFromCrack>0, nait du centre (echo fissure verger) */}
      <g id="sol_pays" opacity={bSol}>
        <path d="M-35 1180C180 1168 360 1182 540 1192C760 1204 920 1190 1115 1172" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round"
          strokeDasharray={1200} strokeDashoffset={1200 * (1 - bSol)} />
        <path d="M-35 1100C160 1060 360 1078 560 1100C760 1122 930 1098 1115 1062" fill="none" stroke={INK} strokeWidth={2} opacity={0.8 * bSol} />
        <path d="M-15 1380C210 1330 424 1392 618 1470C767 1532 905 1556 1110 1530" fill="none" stroke={INK} strokeWidth={2} opacity={bSol} />
        <path d="M-10 1660C230 1582 438 1640 622 1740C755 1812 896 1872 1105 1888" fill="none" stroke={INK} strokeWidth={1} opacity={0.7 * bSol} />
        <ellipse cx={500} cy={1188} rx={290} ry={26} fill="#332A20" opacity={0.16 * bBat} />
        <g stroke={INK} strokeWidth={1} opacity={0.32 * bSol} fill="none">
          <path d="M120 1280C200 1268 300 1276 380 1290" />
          <path d="M740 1300C820 1288 920 1296 1000 1310" />
          <path d="M160 1460C260 1446 380 1456 480 1474" />
          <path d="M640 1480C760 1466 880 1476 990 1496" />
        </g>
        {/* silhouette CI gravee */}
        <path d="M 380 1640 C 450 1610 520 1620 570 1650 C 620 1690 630 1740 600 1800 C 550 1850 480 1840 420 1810 C 370 1770 350 1690 380 1640 Z"
          fill="none" stroke={INK} strokeWidth={1} strokeDasharray="6 8" opacity={0.45 * bSol} />
      </g>

      {/* USINE BATIMENT (trait se dessine via bBat, couleur via colorize) */}
      <g id="usine_batiment" opacity={bBat}>
        <polygon points="650,1180 920,1050 920,800 650,900" fill={wallSide} fillOpacity={cOp} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <polygon points="250,1180 650,1180 650,900 250,900" fill={wallFront} fillOpacity={cOp} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        {/* lignes interieures = DETAILS (apparaissent APRES la structure) */}
        <g stroke={INK} strokeWidth={2} opacity={bDetails}>
          <line x1={350} y1={1180} x2={350} y2={900} />
          <line x1={450} y1={1180} x2={450} y2={900} />
          <line x1={550} y1={1180} x2={550} y2={900} />
          <line x1={740} y1={1135} x2={740} y2={865} />
          <line x1={830} y1={1090} x2={830} y2={835} />
        </g>
      </g>

      {/* TOIT DENTS DE SCIE (bToit) */}
      <g id="toit" opacity={bToit}>
        {[
          ["516,900 650,750 650,900", roofFront], ["650,750 920,620 920,800 650,900", roofBack], ["516,900 650,750 920,620 786,770", roofBack],
          ["383,900 516,750 516,900", roofFront], ["516,750 786,620 786,800 516,900", roofBack], ["383,900 516,750 786,620 653,770", roofBack],
          ["250,900 383,750 383,900", roofFront], ["383,750 653,620 653,800 383,900", roofBack], ["250,900 383,750 653,620 520,770", roofBack],
        ].map(([pts, col], k) => (
          <polygon key={k} points={pts as string} fill={col as string} fillOpacity={cOp} stroke={INK} strokeWidth={k % 3 === 0 ? 3.5 : 2} strokeLinejoin="round" />
        ))}
      </g>

      {/* PORTE (detail, apres la structure) */}
      <g id="porte" opacity={bDetails}>
        <path d="M 400 1180 L 400 1000 A 50 50 0 0 1 500 1000 L 500 1180 Z" fill="#332A20" />
        <path d="M 385 1180 L 385 1000 A 65 65 0 0 1 515 1000 L 515 1180" fill="none" stroke={INK} strokeWidth={3.5} />
      </g>

      {/* CHEMINEE (bChem) + fumee qui monte (vie permanente) */}
      <g id="cheminee" opacity={bChem}>
        <path d="M 820 840 L 820 480 L 890 480 L 890 800" fill={chimney} fillOpacity={cOp} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <rect x={812} y={462} width={86} height={22} fill={chimney} fillOpacity={cOp} stroke={INK} strokeWidth={3.5} />
        <g stroke={INK} strokeWidth={2} opacity={bChem}>
          <line x1={820} y1={780} x2={890} y2={780} />
          <line x1={820} y1={700} x2={890} y2={700} />
          <line x1={820} y1={620} x2={890} y2={620} />
          <line x1={820} y1={540} x2={890} y2={540} />
        </g>
        {/* FUMEE EPAISSE + ORGANIQUE : bouffees a RYTHMES DESYNC (periode propre par bouffee), qui montent,
            grossissent, puis se DISSOLVENT en fin de course (scale->0 + opacity->0). Flux continu fluide. */}
        <g opacity={bChem}>
          {Array.from({ length: 8 }, (_, k) => {
            // periode propre a chaque bouffee (desync) — pas toutes au meme rythme
            const period = 150 + (k % 4) * 28;
            const cycle = ((wf * 1.05 + k * 23) % period) / period; // 0..1
            const y = 458 - cycle * 250; // monte
            const sway = Math.sin((wf + k * 47) / (14 + (k % 3) * 4)) * 24 * cycle; // derive propre
            const x = 855 + sway;
            // GROSSIT au debut (dilatation) PUIS RAPETISSE en fin (dissolution) : courbe en cloche montante
            const grow = interpolate(cycle, [0, 0.55, 1], [0.5, 1.5, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const r = 22 * grow;
            // opacity : monte vite, tient, s'estompe en fin
            const op = interpolate(cycle, [0, 0.1, 0.6, 1], [0, 0.7, 0.5, 0]) * bChem;
            if (op <= 0.01 || r < 1) return null;
            return (
              <g key={k} opacity={op}>
                <circle cx={x} cy={y} r={r} fill="#9a8a78" stroke={INK} strokeWidth={2.5} />
                <circle cx={x - r * 0.55} cy={y + r * 0.2} r={r * 0.7} fill="#9a8a78" stroke={INK} strokeWidth={2.5} />
                <circle cx={x + r * 0.55} cy={y + r * 0.15} r={r * 0.65} fill="#9a8a78" stroke={INK} strokeWidth={2.5} />
              </g>
            );
          })}
        </g>
      </g>

      {/* SORTIE CHOCOLAT : convoyeur + tablettes qui descendent et SORTENT (chocOut) */}
      <g id="sortie" opacity={bChem}>
        <path d="M 458 1180 C 620 1320 820 1480 1090 1640" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 500 1180 C 660 1310 860 1455 1090 1585" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={2}>
          <line x1={640} y1={1320} x2={640} y2={1430} />
          <line x1={820} y1={1430} x2={820} y2={1560} />
          <line x1={980} y1={1530} x2={980} y2={1680} />
        </g>
        {/* FLUX CONTINU de tablettes : elles GLISSENT le long du convoyeur a TAILLE CONSTANTE, fade au bord,
            et ne s'arretent JAMAIS (boucle permanente via windPhase). La valeur sort, en continu. */}
        {chocOut > 0.02 && (() => {
          // courbe du convoyeur : echantillonnee de la porte (458,1180) au bord (1090,1640).
          // on parametre par s in [0,1] et on interpole une bezier approx.
          const convPoint = (s: number) => {
            // bezier quadratique approx du path "M458 1180 C620 1320 820 1480 1090 1640"
            const p0 = [479, 1186], p1 = [640, 1320], p2 = [955, 1490], p3 = [1090, 1612];
            const mt = 1 - s;
            const x = mt * mt * mt * p0[0] + 3 * mt * mt * s * p1[0] + 3 * mt * s * s * p2[0] + s * s * s * p3[0];
            const y = mt * mt * mt * p0[1] + 3 * mt * mt * s * p1[1] + 3 * mt * s * s * p2[1] + s * s * s * p3[1];
            return [x, y];
          };
          const N = 4; // nombre de tablettes simultanees sur le tapis
          const speed = 0.0045; // vitesse de defilement (boucle)
          const W = 88, Hh = 44; // TAILLE CONSTANTE
          return Array.from({ length: N }, (_, k) => {
            // position le long du tapis, decalee + bouclee (flux sans fin)
            const s = ((wf * speed + k / N) % 1 + 1) % 1;
            const [x, y] = convPoint(s);
            // fade : apparait pres de la porte, disparait au bord
            const op = interpolate(s, [0, 0.08, 0.82, 1], [0, 1, 1, 0]) * Math.min(1, chocOut * 2);
            if (op <= 0.01) return null;
            return (
              <g key={k} transform={`translate(${x - W / 2} ${y - Hh / 2}) rotate(36 ${W / 2} ${Hh / 2})`} opacity={op}>
                <rect x={0} y={0} width={W} height={Hh} rx={3} fill={CHOC} fillOpacity={cOp} stroke={INK} strokeWidth={3.5} />
                <line x1={W * 0.25} y1={0} x2={W * 0.25} y2={Hh} stroke={INK} strokeWidth={2} />
                <line x1={W * 0.5} y1={0} x2={W * 0.5} y2={Hh} stroke={INK} strokeWidth={2} />
                <line x1={W * 0.75} y1={0} x2={W * 0.75} y2={Hh} stroke={INK} strokeWidth={2} />
                <line x1={0} y1={Hh / 2} x2={W} y2={Hh / 2} stroke={INK} strokeWidth={2} />
              </g>
            );
          });
        })()}
      </g>
    </svg>
  );
};

// ── Previews de comparaison palette (TEST Aziz) ───────────────────────────────
const PARCH_BG = "#e8dcc0";
export const UsinePreviewCacao: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PARCH_BG }}>
    <UsineConstruction build={1} colorize={1} chocOut={1} windPhase={120} palette="cacao" />
  </AbsoluteFill>
);
export const UsinePreviewIvoire: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PARCH_BG }}>
    <UsineConstruction build={1} colorize={1} chocOut={1} windPhase={120} palette="ivoire" />
  </AbsoluteFill>
);
export const UsinePreviewIvoireDouce: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PARCH_BG }}>
    <UsineConstruction build={1} colorize={1} chocOut={1} windPhase={120} palette="ivoire-douce" />
  </AbsoluteFill>
);
export const UsinePreviewIvoireDouceChemVerte: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PARCH_BG }}>
    <UsineConstruction build={1} colorize={1} chocOut={1} windPhase={120} palette="ivoire-douce-chem-verte" />
  </AbsoluteFill>
);
