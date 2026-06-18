/**
 * REPRODUCTIONS FIDELES de templates hera.video (methode mapanimation : copier a l'identique D'ABORD,
 * pour prouver qu'on ecrase le template tel quel — AVANT toute appropriation Souverain).
 *
 * 3 compositions independantes, couleurs/layout/texte echantillonnes sur les vraies frames Hera :
 *   - HeraFidele_V08_ChartMap   : "EU Military Spending" (carte Europe grise + ligne bleue->blanche + axe bleu)
 *   - HeraFidele_V13_Bars       : "Pagare / Prendere" (quadrille blanc + barres jaune/orange + sol noir)
 *   - HeraFidele_V01_Poll       : "end birthright citizenship" (beige + surlignage jaune + barre Yes rouge/No bleu)
 *
 * Ce sont des COPIES, pas notre charte. Comparer avec ProtoHera_* (versions Souverain).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, staticFile, Img, delayRender, continueRender } from "remotion";
import { EUROPE_PATHS, EUROPE_VIEWBOX } from "./europePath";
import { WEST_AFRICA_PATHS, WEST_AFRICA_VIEWBOX } from "./westAfricaPath";

// carte monde chargee depuis public/ (path trop lourd pour le bundle en string litterale)
const useWorldLand = () => {
  const [data, setData] = React.useState<{ viewBox: string; d: string } | null>(null);
  const [handle] = React.useState(() => delayRender("world-land"));
  React.useEffect(() => {
    fetch(staticFile("_proto/hera/world-land.json"))
      .then((r) => r.json())
      .then((j) => {
        setData(j);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
  return data;
};

const W = 1920;
const H = 1080;

// ======================================================================================
// V08 — EU MILITARY SPENDING (chart line sur carte Europe)
// Couleurs Hera : carte gris #6e757e, contours #5a626c, axe bleu #3b5bdb, ligne blanche, titre pastille bleue.
// ======================================================================================
export const HeraFidele_V08_ChartMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const MAP_GREY = "#6e757e";
  const MAP_LINE = "#5a626c";
  const AXIS_BLUE = "#3b5bdb";
  const TITLE_BLUE = "#3b3bd6";

  // plot
  const plotX = 110;
  const plotBot = 1000;
  const plotTop = 200;
  const plotW = W - 230;
  const plotH = plotBot - plotTop;
  const AXIS_MIN = 100;
  const AXIS_MAX = 300; // 100->300B

  // valeurs 2022->2027 (montee douce, finit ~251)
  const valLeft = 207; // 2022
  const valRight = 262; // 2027 (la ligne continue de monter)
  const yFor = (v: number) => plotBot - plotH * ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN));

  const draw = spring({ fps, frame: Math.max(0, frame - 16), config: { damping: 44, stiffness: 24 } });
  const xRight = plotX + plotW * draw;
  const yLeft = yFor(valLeft);
  const yRight = yFor(valLeft + (valRight - valLeft) * draw);

  // valeur courante au bout de la ligne
  const curVal = (valLeft + (valRight - valLeft) * draw).toFixed(1);

  const ticks = [100, 150, 200, 250, 300];

  return (
    <AbsoluteFill style={{ background: "#7a808a" }}>
      {/* carte Europe grise plein cadre */}
      <svg width={W} height={H} viewBox={EUROPE_VIEWBOX} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <rect width={1600} height={900} fill="#7a808a" />
        {EUROPE_PATHS.map((p) => (
          <path key={p.name} d={p.d} fill={MAP_GREY} stroke={MAP_LINE} strokeWidth={1} />
        ))}
      </svg>
      {/* leger voile pour homogeneiser */}
      <AbsoluteFill style={{ background: "rgba(122,128,138,0.35)" }} />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* axe Y et X bleus */}
        <line x1={plotX} y1={plotTop - 20} x2={plotX} y2={plotBot} stroke={AXIS_BLUE} strokeWidth={4} />
        <line x1={plotX} y1={plotBot} x2={plotX + plotW + 40} y2={plotBot} stroke={AXIS_BLUE} strokeWidth={4} />
        {/* ticks Y */}
        {ticks.map((t) => (
          <text key={t} x={plotX - 18} y={yFor(t) + 8} textAnchor="end" fontFamily="'Inter',sans-serif" fontSize={26} fill="#e9eaec">
            €{t}B
          </text>
        ))}
        {/* annees */}
        <text x={plotX} y={plotBot + 40} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={26} fill="#c9ccd1">2022</text>
        <text x={plotX + plotW} y={plotBot + 40} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={26} fill="#c9ccd1">2027</text>

        {/* ligne qui se trace : bleue puis blanche (on fait blanche avec pointe verte facon Hera) */}
        <line x1={plotX} y1={yLeft} x2={xRight} y2={yRight} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" />
        {/* point + label valeur au bout */}
        {draw > 0.05 && (
          <>
            <circle cx={xRight} cy={yRight} r={7} fill="#ffffff" />
            <text x={xRight} y={yRight - 22} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={34} fontWeight={800} fill="#ffffff">
              €{curVal}B
            </text>
          </>
        )}
      </svg>

      {/* titre pastille bleue */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          background: TITLE_BLUE,
          padding: "10px 26px",
          borderRadius: 8,
          fontFamily: "'Inter',sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: "#ffffff",
        }}
      >
        EU Military Spending
      </div>
    </AbsoluteFill>
  );
};

// ======================================================================================
// V13 — PAGARE / PRENDERE (bars sur quadrille blanc)
// Couleurs Hera : fond quadrille blanc (#f5f5f5 + lignes #e0e0e0), barres jaune #ffe100 / orange #f5a623,
//   ligne de sol noire epaisse, labels noir gras dessous. Cadre pointille.
// ======================================================================================
export const HeraFidele_V13_Bars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const baseY = 860;
  const maxH = 560;
  const step = 80;

  const bars = [
    { label: "Pagare", value: 0.55, fill: "#ffe100" },
    { label: "Prendere", value: 0.86, fill: "#f5a623" },
  ];
  const slotW = 360;
  const startX = W / 2 - slotW;

  const gridV = Array.from({ length: Math.ceil(W / step) + 1 }, (_, i) => i * step);
  const gridH = Array.from({ length: Math.ceil(H / step) + 1 }, (_, i) => i * step);

  const ground = spring({ fps, frame: Math.max(0, frame - 14), config: { damping: 40, stiffness: 50 } });

  return (
    <AbsoluteFill style={{ background: "#f6f6f4" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* quadrille */}
        <g stroke="#e2e2e0" strokeWidth={1.4}>
          {gridV.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
        {/* cadre pointille */}
        <rect x={20} y={20} width={W - 40} height={H - 40} fill="none" stroke="#bdbdbd" strokeWidth={2} strokeDasharray="6 8" rx={14} />

        {/* ligne de sol noire epaisse (se trace) */}
        <line x1={startX - 60} y1={baseY} x2={startX - 60 + (slotW * 2 + 120) * ground} y2={baseY} stroke="#111" strokeWidth={8} strokeLinecap="round" />

        {bars.map((b, i) => {
          const grow = spring({ fps, frame: Math.max(0, frame - (26 + i * 12)), config: { damping: 30, stiffness: 60 } });
          const h = maxH * b.value * grow;
          const x = startX + i * slotW + slotW / 2 - 95;
          return (
            <g key={b.label}>
              <rect x={x} y={baseY - h} width={190} height={h} fill={b.fill} />
              <text x={x + 95} y={baseY + 56} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={48} fontWeight={800} fill="#111">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ======================================================================================
// V01 — POLL (Yes/No sur beige)
// Couleurs Hera : fond beige #e8e6df, titre noir gras + surlignage jaune #ffe14d, source grise,
//   barre Yes rouge #d83933 / No bleu #3b8ad9, texte blanc dedans, % sous la barre.
// ======================================================================================
export const HeraFidele_V01_Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const barX = 360;
  const barW = W - 720;
  const barY = 620;
  const barH = 120;

  const yesPct = 0.38;
  const split = spring({ fps, frame: Math.max(0, frame - 30), config: { damping: 34, stiffness: 55 } });
  const yesW = barW * yesPct * split;

  // ticks 0-100% sous la barre
  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <AbsoluteFill style={{ background: "#e8e6df" }}>
      {/* titre avec surlignage jaune sur un segment */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 200,
          right: 200,
          textAlign: "center",
          fontFamily: "Georgia,'Times New Roman',serif",
          fontSize: 60,
          fontWeight: 800,
          color: "#111",
          lineHeight: 1.25,
        }}
      >
        Should we{" "}
        <span style={{ background: "#ffe14d", padding: "0 6px" }}>end birthright citizenship</span> for children born to immigrants in the US illegally?
      </div>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: 28, color: "#777", fontWeight: 600 }}>
        Ipsos, January 2025
      </div>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* No bleu (fond complet) */}
        <rect x={barX} y={barY} width={barW} height={barH} rx={6} fill="#3b8ad9" />
        {/* Yes rouge (clip) */}
        <clipPath id="pollClipF">
          <rect x={barX} y={barY} width={yesW} height={barH} rx={6} />
        </clipPath>
        <rect x={barX} y={barY} width={barW} height={barH} rx={6} fill="#d83933" clipPath="url(#pollClipF)" />

        {/* labels blancs dedans */}
        <text x={barX + yesW / 2} y={barY + barH / 2 + 14} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={40} fontWeight={800} fill="#ffffff" opacity={split > 0.3 ? 1 : 0}>
          Yes
        </text>
        <text x={barX + yesW + (barW - yesW) / 2} y={barY + barH / 2 + 14} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={40} fontWeight={800} fill="#ffffff">
          No
        </text>

        {/* echelle % sous la barre */}
        {ticks.map((t) => {
          const x = barX + (barW * t) / 100;
          return (
            <text key={t} x={x} y={barY + barH + 40} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={22} fill="#999">
              {t}%
            </text>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ======================================================================================
// V10 — TIMELINE (Cyril Radcliffe 1947) sur carte sombre
// Couleurs Hera : fond carte tres sombre #1c1c1c + vignette radiale, ligne horizontale blanche fine,
//   medaillons photos rondes N&B cercles blanc, date serif blanche, titre ROUGE caps, desc blanc petit caps.
// NOTE : pas de vraie photo => medaillon placeholder N&B (degrade gris + silhouette). Mecanique fidele.
// ======================================================================================
export const HeraFidele_V10_Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const RED = "#d8241f";
  const lineY = 560;
  const x0 = 60;
  const x1 = W - 60;

  type J = { date: string; title: string; desc: string; above: boolean; dateRed?: boolean };
  const jal: J[] = [
    { date: "1947", title: "CYRIL RADCLIFFE", desc: "CYRIL RADCLIFFE WAS A BRITISH LAWYER\nAPPOINTED IN 1947 TO DRAW THE BORDERS\nBETWEEN INDIA AND PAKISTAN", above: true },
    { date: "1947", title: "CYRIL RADCLIFFE", desc: "A LAWYER WITH NO EXPERIENCE\nIN INDIA", above: false },
    { date: "1947", title: "CYRIL RADCLIFFE", desc: "NO KNOWLEDGE OF ITS PEOPLE,\nITS LANGUAGES, ITS MAPS", above: true },
    { date: "2025", title: "CYRIL RADCLIFFE", desc: "HIS ASSIGNMENT WAS SIMPLE ON PAPER —\nAND IMPOSSIBLE IN PRACTICE", above: false, dateRed: true },
  ];
  const positions = jal.map((_, i) => 180 + ((W - 360) * i) / (jal.length - 1));

  const lineGrow = spring({ fps, frame: Math.max(0, frame - 10), config: { damping: 44, stiffness: 28 } });

  return (
    <AbsoluteFill style={{ background: "#1b1b1b" }}>
      {/* carte sombre de fond (on reutilise West Africa faute d'Asie, tres estompee — c'est un decor) */}
      <svg width={W} height={H} viewBox={WEST_AFRICA_VIEWBOX} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
        {WEST_AFRICA_PATHS.map((p) => (
          <path key={p.name} d={p.d} fill="#2a2a2a" stroke="#333" strokeWidth={1} />
        ))}
      </svg>
      {/* vignette radiale (centre plus clair) */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(70,70,70,0.5) 0%, rgba(20,20,20,0.0) 45%, rgba(10,10,10,0.7) 100%)",
        }}
      />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="medGrad" cx="0.4" cy="0.35" r="0.8">
            <stop offset="0%" stopColor="#cfcfcf" />
            <stop offset="100%" stopColor="#6f6f6f" />
          </radialGradient>
        </defs>
        {/* ligne horizontale blanche fine */}
        <line x1={x0} y1={lineY} x2={x0 + (x1 - x0) * lineGrow} y2={lineY} stroke="#ffffff" strokeWidth={2.5} opacity={0.9} />
        {/* point de depart */}
        <circle cx={x0} cy={lineY} r={8} fill="#fff" />

        {jal.map((j, i) => {
          const delay = 30 + i * 30;
          const pop = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 13, stiffness: 170 } });
          if (pop <= 0.001) return null;
          const cx = positions[i];
          const r = 56 * Math.min(1, pop);
          return (
            <g key={i}>
              {/* medaillon photo N&B placeholder */}
              <circle cx={cx} cy={lineY} r={r} fill="url(#medGrad)" stroke="#fff" strokeWidth={3} />
              {/* silhouette tete+epaules */}
              <g clipPath={`circle(${r}px at ${cx}px ${lineY}px)`} opacity={pop}>
                <circle cx={cx} cy={lineY - 8} r={r * 0.34} fill="#4a4a4a" />
                <ellipse cx={cx} cy={lineY + r * 0.55} rx={r * 0.62} ry={r * 0.5} fill="#4a4a4a" />
              </g>
            </g>
          );
        })}
      </svg>

      {/* fiches texte (date serif + titre rouge + desc) */}
      {jal.map((j, i) => {
        const delay = 30 + i * 30;
        const op = interpolate(frame, [delay + 6, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cx = positions[i];
        const blockTop = j.above ? lineY - 250 : lineY + 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx,
              top: blockTop,
              width: 360,
              transform: "translateX(-50%)",
              opacity: op,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "Georgia,serif", fontSize: 46, color: j.dateRed ? RED : "#f0f0f0", lineHeight: 1 }}>{j.date}</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 900, color: RED, marginTop: 6, letterSpacing: "1px" }}>{j.title}</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 600, color: "#dcdcdc", marginTop: 8, letterSpacing: "0.5px", whiteSpace: "pre-line", lineHeight: 1.4 }}>
              {j.desc}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================================================
// V04 — LIFE EXPECTANCY THEN & NOW (drapeaux ronds + then/now SUR carte monde claire)
// Couleurs Hera : fond carte monde gris-clair lumineux, titre serif "Life Expectancy:" + "Then & Now"
//   surligne jaune, 5 drapeaux ronds cercles, ancienne valeur BARREE rouge "in 1950", nouvelle valeur
//   BLEUE grosse "70 yrs". Fidele en FORME ; contenu adapte aux drapeaux qu'on possede.
// ======================================================================================
export const HeraFidele_V04_FlagsOnMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const BLUE = "#1d4ed8";
  const RED = "#c0392b";

  // drapeaux disponibles (public/_shared/flags) + donnees then/now (esperance de vie illustrative)
  const items = [
    { flag: "sn", then: "38 ans", now: "67 ans" },
    { flag: "ng", then: "37 ans", now: "55 ans" },
    { flag: "ml", then: "31 ans", now: "59 ans" },
    { flag: "ma", then: "43 ans", now: "74 ans" },
    { flag: "cn", then: "44 ans", now: "78 ans" },
  ];
  const n = items.length;
  const slot = (W - 360) / n;
  const startX = 180 + slot / 2;
  const rowY = 560;
  const r = 64;

  const mapOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const world = useWorldLand();

  return (
    <AbsoluteFill style={{ background: "#eef0f0" }}>
      {/* carte monde claire estompee */}
      {world && (
        <svg width={W} height={H} viewBox={world.viewBox} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, opacity: mapOp }}>
          <path d={world.d} fill="#d6d9dc" stroke="#c4c8cc" strokeWidth={1} />
        </svg>
      )}
      <AbsoluteFill style={{ background: "rgba(238,240,240,0.35)" }} />

      {/* titre */}
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", opacity: titleOp, fontFamily: "Georgia,serif", fontSize: 64, fontStyle: "italic", color: "#2a2a2a" }}>
        Espérance de vie : <span style={{ fontStyle: "normal", fontWeight: 800, background: "#ffe14d", padding: "0 10px" }}>Hier &amp; Aujourd'hui</span>
      </div>
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", opacity: titleOp, fontFamily: "'Inter',sans-serif", fontSize: 24, letterSpacing: "2px", color: "#7a7a7a", textTransform: "uppercase" }}>
        5 pays d'Afrique et d'Asie
      </div>

      {/* drapeaux ronds + then/now */}
      {items.map((it, i) => {
        const cx = startX + i * slot;
        const pop = spring({ fps, frame: Math.max(0, frame - (34 + i * 12)), config: { damping: 13, stiffness: 170 } });
        if (pop <= 0.001) return null;
        const sc = Math.min(1, pop);
        const valOp = interpolate(frame, [34 + i * 12 + 16, 34 + i * 12 + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={it.flag} style={{ position: "absolute", left: cx, top: rowY, transform: `translate(-50%,-50%) scale(${sc})`, textAlign: "center" }}>
            {/* drapeau rond */}
            <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", overflow: "hidden", border: "4px solid #fff", boxShadow: "0 4px 14px rgba(0,0,0,0.25)", margin: "0 auto" }}>
              <Img src={staticFile(`_shared/flags/${it.flag}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {/* then barre */}
            <div style={{ marginTop: 18, fontFamily: "'Inter',sans-serif", fontSize: 26, color: RED, textDecoration: "line-through", opacity: valOp }}>{it.then}</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "#999", opacity: valOp, letterSpacing: "1px" }}>EN 1950</div>
            {/* now */}
            <div style={{ marginTop: 6, fontFamily: "'Inter',sans-serif", fontSize: 44, fontWeight: 800, color: BLUE, opacity: valOp }}>{it.now}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================================================
// V02 — ARTICLE DE PRESSE (style NYT / Vox)
// Couleurs Hera : fond creme #f3f1ec, date petite caps gris, GROS titre serif noir, sous-titre gris,
//   puis logo journal (serif) + photo N&B qui apparait. Tres editorial, sobre.
// ======================================================================================
export const HeraFidele_V02_PressArticle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dateOp = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // titre revele ligne par ligne (clip)
  const titleProg = spring({ fps, frame: Math.max(0, frame - 14), config: { damping: 40, stiffness: 40 } });
  const subOp = interpolate(frame, [40, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoOp = interpolate(frame, [62, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const photoOp = interpolate(frame, [70, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const photoUp = interpolate(frame, [70, 92], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const M = 200; // marge gauche

  return (
    <AbsoluteFill style={{ background: "#f3f1ec" }}>
      {/* date */}
      <div style={{ position: "absolute", top: 150, left: M, opacity: dateOp, fontFamily: "Georgia,serif", fontSize: 26, fontWeight: 700, color: "#333" }}>
        27 octobre 2022
      </div>

      {/* gros titre serif, revele par un wipe */}
      <div style={{ position: "absolute", top: 210, left: M, right: 200, overflow: "hidden" }}>
        <div
          style={{
            fontFamily: "Georgia,'Times New Roman',serif",
            fontSize: 76,
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.15,
            clipPath: `inset(0 ${100 - 100 * titleProg}% 0 0)`,
          }}
        >
          Elon Musk rachète Twitter pour 44 milliards de dollars
        </div>
      </div>

      {/* sous-titre gris (largeur reduite a gauche pour laisser la place au portrait) */}
      <div style={{ position: "absolute", top: 470, left: M, width: 920, opacity: subOp, fontFamily: "Georgia,serif", fontSize: 30, color: "#666", lineHeight: 1.4 }}>
        L'homme le plus riche du monde finalise son acquisition retentissante du réseau social, le faisant entrer dans une nouvelle ère.
      </div>

      {/* logo journal (faux NYT serif) */}
      <div style={{ position: "absolute", top: 640, left: M, opacity: logoOp, fontFamily: "'UnifrakturCook','Old English Text MT',Georgia,serif", fontSize: 48, color: "#111" }}>
        The Daily Record
      </div>

      {/* portrait stipple N&B (illustration Gemini WSJ hedcut, generee 2026-06-18) */}
      <div
        style={{
          position: "absolute",
          top: 430 + photoUp,
          right: 180,
          width: 460,
          height: 460,
          opacity: photoOp,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("_proto/hera/press-portrait.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", mixBlendMode: "multiply" }}
        />
      </div>
    </AbsoluteFill>
  );
};
