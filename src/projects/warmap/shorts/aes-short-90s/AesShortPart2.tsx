// AesShortPart2 — Short "L'AES en 90 secondes", DEUXIEME MOITIE (36-92s). Meme socle valide que Part1
// (navy quadrille, carte d3-geo contours colores, sous-titres phrases courtes, camera au cadre complet).
// Pour iterer vite, cette composition demarre a t=36s (le socle Part1 s'arrete la). Les timings sont
// ABSOLUS (memes secondes que le script/Whisper) : on decale la frame locale de +36s.
//
// Panels : 7 coups d'Etat (anneaux ordre chrono) | 8a menace CEDEAO | 8b FRACTURE trio/CEDEAO |
//          9 naissance AES (sceau + drapeaux se saturent) | 10 ressources | 11 count-up 60 | 12 CTA carte.
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, Sequence } from "remotion";
import { getAesGeo, getTrioCamera, CITIES } from "./aesGeo";
import { SubtitlesWordByWord } from "./SubtitlesWordByWord";

const W = 1080;
const H = 1920;
const FPS = 30;

// Cette compo demarre a 36s. Frame locale 0 = seconde 36. On expose une frame ABSOLUE pour les timings script.
const T_OFFSET = 36; // secondes
const s = (sec: number) => Math.round((sec - T_OFFSET) * FPS); // seconde absolue -> frame locale

// ---- Palette (identique socle) ----
const NAVY_TOP = "#2b3f70";
const NAVY = "#1a2848";
const NAVY_DEEP = "#141f3c";
const GRID_NAVY = "#41557f";
const OCRE_LINE = "#f0cf8f";
const GOLD = "#e8c877";
const INK = "#0b1220";
const CRISIS = "#d95a45";
const CRISIS_DEEP = "#7d2118";
const GHOST = "#5a6b8a";
const KAKI = "#7a7e54"; // pouvoir militaire (eclairci pour rester lisible sur navy)
// couleurs drapeau — semi-saturees au depart (contours restent lisibles), SATUREES au climax AES
const MALI_DIM = "#4a8a5c", MALI_SAT = "#14a24a";
const NIGER_DIM = "#c07a45", NIGER_SAT = "#e0782e";
const BURKINA_DIM = "#b0554c", BURKINA_SAT = "#ef2b2d";
// ressources
const OR = "#f2c94c", URANIUM = "#7a9b6e", PETROLE = "#5a4a3a";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

const GRID_STEP = 185;

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const fadeOut = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// fracture zigzag deterministe (pas de Math.random — reproductible). Traverse entre le trio et la CEDEAO.
const fracturePath = (x0: number, y0: number, x1: number, y1: number, seed = 7): string => {
  const segs = 9;
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    // jitter deterministe via sinus (seed)
    const j = Math.sin(i * 12.9898 + seed) * 43758.5453;
    const off = ((j - Math.floor(j)) - 0.5) * 60;
    d += ` L ${x + off} ${y - off}`;
  }
  return d;
};

export const AesShortPart2: React.FC<{ noAudio?: boolean }> = ({ noAudio = false }) => {
  const frame = useCurrentFrame(); // frame locale (0 = 36s)
  const geo = getAesGeo();

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => 40 + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => 28 + i * GRID_STEP);

  // Camera : la Libye a fini son role (bloc 2012 en 1re moitie) -> on RECENTRE/ZOOME sur le trio seul
  // (retour Aziz : plus gros, plus lisible, plus de detail ; la Libye n'a plus rien a voir ici).
  const cam = getTrioCamera(frame, geo);

  // ===== PANEL 7 — coups d'Etat (37.4-41.2s) : anneau qui se ferme sur chaque capitale, ORDRE CHRONO =====
  // Mali (2020) -> Burkina (2022) -> Niger (2023). Le pays "bascule" kaki (pouvoir militaire).
  const coup = (start: number) => clampI(frame, start, start + 18);
  const MALI_COUP = s(38.9), BURKINA_COUP = s(39.6), NIGER_COUP = s(40.3);
  // NETTOYAGE : les anneaux (gestes PONCTUELS) s'estompent apres le panel 7 (l'AES prend le relais).
  // La carte GARDE ses etats durables (couleurs, ghost borders) mais pas les gestes ephemeres.
  const ringsFade = fadeOut(frame, s(45.0), s(47.0));

  // ===== PANEL 8a — menace CEDEAO (42.5-45.4s) : fleche maison depuis le sud, cartouche vire rouge =====
  const cedeaoWake = clampI(frame, s(42.5), s(43.6)); // cartouche CEDEAO gris -> rouge
  const arrowDraw = clampI(frame, s(43.0), s(44.6)); // fleche menace se trace (s'arrete a 55%)

  // ===== PANEL 8b — FRACTURE trio/CEDEAO (46.8-50.8s) =====
  const crackDraw = clampI(frame, s(47.66), s(48.8)); // la fracture se trace
  const split = clampI(frame, s(48.3), s(50.0)); // les 2 blocs s'ecartent
  const crackScar = clampI(frame, s(49.5), s(51.0)); // -> cicatrice ghost permanente

  // ===== PANEL 9 — naissance AES (52.6-60.5s) : sceau nait sur le trio, drapeaux se SATURENT =====
  const flagSaturate = clampI(frame, s(55.0), s(58.5)); // couleurs desat -> saturees
  const sealDraw = clampI(frame, s(56.5), s(58.0)); // sceau AES apparait au centre du trio
  const sealSettle = spring({ frame: frame - s(57.3), fps: FPS, config: { damping: 11, stiffness: 120 }, durationInFrames: 20 });
  const dateOp = clampI(frame, s(52.7), s(54.0)); // "16 SEPTEMBRE 2023"
  const aesNameOp = clampI(frame, s(58.5), s(60.0)); // "ALLIANCE DES ETATS DU SAHEL"

  // ===== PANEL 10 — ressources (62.1-70.9s) : veines sur la vraie geo =====
  const orVein = clampI(frame, s(66.4), s(68.0)); // or Mali+Burkina
  const uraniumVein = clampI(frame, s(69.2), s(70.2)); // uranium Niger
  const petroleVein = clampI(frame, s(70.2), s(71.0)); // petrole Niger
  const leverOp = clampI(frame, s(62.1), s(63.5)); // "UN LEVIER"

  // ===== PANEL 11 — count-up 60 ans (72.3-83.0s) =====
  const countUp = Math.round(clampI(frame, s(74.8), s(77.6), 0, 60));
  const countOp = clampI(frame, s(73.5), s(75.0)) * fadeOut(frame, s(81.5), s(83.0));
  const suspense = frame >= s(79.2) ? 0.85 + 0.15 * Math.sin((frame - s(79.2)) * 0.06) : 1;

  // ===== PANEL 12 — CTA sur la carte (84-92s) : points Libye/Kidal rallumes + texte =====
  const ctaDim = clampI(frame, s(84.0), s(85.5)); // le reste s'attenue
  const ctaPoints = clampI(frame, s(84.5), s(86.0));
  const ctaTextOp = clampI(frame, s(85.5), s(87.0));

  // BANDES DE DRAPEAU clippees au pays (climax AES, retour Aziz : bandes plutot qu'aplat, lisible a
  // petite echelle car ce sont des rect SVG). On dessine des rects couvrant la bbox du pays, clippes a sa forme.
  // Mali = 3 bandes VERTICALES vert/jaune/rouge. Niger = 3 bandes HORIZONTALES orange/blanc/vert + disque.
  // Burkina = 2 bandes HORIZONTALES rouge/vert + etoile jaune.
  const flagBands = (clipId: string, c: { cx: number; cy: number; bbox: [[number, number], [number, number]] }, kind: "mali" | "niger" | "burkina", op: number) => {
    if (op <= 0.01) return null;
    // on part de la VRAIE bbox du pays + marge, pour remplir TOUTE la forme (Mali allonge = fix Aziz)
    const [[bx0, by0], [bx1, by1]] = c.bbox;
    const pad = 20;
    const x0 = bx0 - pad, y0 = by0 - pad, W2 = bx1 - bx0 + 2 * pad, H2 = by1 - by0 + 2 * pad;
    const cx = c.cx, cy = c.cy;
    return (
      <g clipPath={`url(#${clipId})`} opacity={op}>
        {kind === "mali" && (
          <>
            <rect x={x0} y={y0} width={W2 / 3} height={H2} fill="#14a24a" />
            <rect x={x0 + W2 / 3} y={y0} width={W2 / 3} height={H2} fill="#fcd116" />
            <rect x={x0 + (2 * W2) / 3} y={y0} width={W2 / 3} height={H2} fill="#ce1126" />
          </>
        )}
        {kind === "niger" && (
          <>
            <rect x={x0} y={y0} width={W2} height={H2 / 3} fill="#e05206" />
            <rect x={x0} y={y0 + H2 / 3} width={W2} height={H2 / 3} fill="#f5f5f5" />
            <rect x={x0} y={y0 + (2 * H2) / 3} width={W2} height={H2 / 3} fill="#0db02b" />
            <circle cx={cx} cy={cy} r={38} fill="#e05206" />
          </>
        )}
        {kind === "burkina" && (
          <>
            <rect x={x0} y={y0} width={W2} height={H2 / 2} fill="#ef2b2d" />
            <rect x={x0} y={y0 + H2 / 2} width={W2} height={H2 / 2} fill="#009e49" />
            <polygon points={`${cx},${cy - 28} ${cx + 8},${cy - 5} ${cx + 33},${cy - 5} ${cx + 13},${cy + 10} ${cx + 21},${cy + 33} ${cx},${cy + 18} ${cx - 21},${cy + 33} ${cx - 13},${cy + 10} ${cx - 33},${cy - 5} ${cx - 8},${cy - 5}`} fill="#fcd116" />
          </>
        )}
      </g>
    );
  };

  // -------- helpers de rendu (pays contour colore, comme le socle) --------
  const countryOutline = (c: { d: string }, col: string, fillOp = 0, op = 1) => (
    <g opacity={op}>
      {fillOp > 0.01 && <path d={c.d} fill={col} opacity={fillOp * 0.22} />}
      <path d={c.d} fill="none" stroke={col} strokeWidth={3.9} strokeLinejoin="round" opacity={0.95} />
      <path d={c.d} fill="none" stroke={INK} strokeWidth={1} strokeLinejoin="round" opacity={0.3} />
    </g>
  );

  // picto militaire (etoile + galons) — retenu apres test (lisible a taille reelle vs portrait PNJ)
  const milStar = (x: number, y: number, r: number, col: string) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const a2 = a + Math.PI / 5;
      pts.push(`${x + r * Math.cos(a)},${y + r * Math.sin(a)}`);
      pts.push(`${x + r * 0.42 * Math.cos(a2)},${y + r * 0.42 * Math.sin(a2)}`);
    }
    return pts.join(" ");
  };

  const closingRing = (coord: [number, number], prog: number, col: string) => {
    if (prog <= 0) return null;
    const [x, y] = geo.project(coord);
    const R = 26, len = 2 * Math.PI * R;
    return (
      <g>
        <circle cx={x} cy={y} r={R + 3} fill={NAVY_DEEP} opacity={0.55 * prog} />
        <circle cx={x} cy={y} r={R} fill="none" stroke={col} strokeWidth={3.5}
          strokeDasharray={len} strokeDashoffset={len * (1 - prog)} transform={`rotate(-90 ${x} ${y})`} opacity={0.95} />
        {/* picto militaire au centre (apparait une fois l'anneau ~ferme) */}
        {prog > 0.6 && (
          <g opacity={clampI(prog, 0.6, 1)}>
            <polygon points={milStar(x, y - R * 0.12, R * 0.5, col)} fill={col} />
            <path d={`M ${x - R * 0.36} ${y + R * 0.5} L ${x} ${y + R * 0.28} L ${x + R * 0.36} ${y + R * 0.5}`}
              fill="none" stroke={col} strokeWidth={R * 0.12} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    );
  };

  // couleur pays du trio : desat -> kaki (coup) -> saturee (AES)
  const trioColor = (dim: string, sat: string, coupProg: number) => {
    if (flagSaturate > 0.01) {
      // du kaki (post-coup) vers la couleur nationale saturee
      return mix(KAKI, sat, flagSaturate);
    }
    if (coupProg > 0.01) return mix(dim, KAKI, coupProg);
    return dim;
  };

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {!noAudio && <Audio src={staticFile("_shared/audio/sahel-warmap/short-90s-v1.mp3")} startFrom={T_OFFSET * FPS} />}

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="p2-bg" cx="50%" cy="38%" r="80%">
            <stop offset="0%" stopColor={NAVY_TOP} /><stop offset="60%" stopColor={NAVY} /><stop offset="100%" stopColor={NAVY_DEEP} />
          </radialGradient>
          <radialGradient id="p2-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a3c60" stopOpacity="0.6" /><stop offset="100%" stopColor="#2a3c60" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="p2-gold-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.5" /><stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          {/* clips pays pour les BANDES de drapeau (climax AES) */}
          <clipPath id="p2-clip-mali"><path d={geo.mali.d} /></clipPath>
          <clipPath id="p2-clip-burkina"><path d={geo.burkina.d} /></clipPath>
          <clipPath id="p2-clip-niger"><path d={geo.niger.d} /></clipPath>
        </defs>
        <rect width={W} height={H} fill="url(#p2-bg)" />
        <g stroke={GRID_NAVY} strokeWidth={1.5} opacity={0.62}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>
        <ellipse cx={540} cy={768} rx={600} ry={560} fill="url(#p2-halo)" opacity={0.8} />

        {/* halo dore quand l'AES nait */}
        {sealDraw > 0.01 && <ellipse cx={540} cy={768} rx={520} ry={480} fill="url(#p2-gold-halo)" opacity={sealSettle * 0.5 * fadeOut(frame, s(60.0), s(62.0))} />}

        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {/* --- CEDEAO cotiere (visible, se separe a la fracture) --- */}
          {(() => {
            // pendant/apres fracture, le bloc CEDEAO s'ecarte vers le bas (separation)
            const dy = split * 60;
            const op = 0.45 + cedeaoWake * 0.4; // plus visible (retour Aziz : trop fin avant)
            return (
              <g transform={`translate(0 ${dy})`} opacity={op}>
                {geo.cedeao.map((c) => (
                  <path key={c.name} d={c.d} fill="none"
                    stroke={cedeaoWake > 0.3 ? mix(GHOST, CRISIS, cedeaoWake) : "#7a8bad"}
                    strokeWidth={2.8} strokeDasharray={crackScar > 0.5 ? "4 5" : "6 4"} opacity={0.95} />
                ))}
              </g>
            );
          })()}

          {/* LIBYE retiree en partie 2 (retour Aziz : elle a fini son role, on se concentre sur le trio). */}

          {/* --- TRIO : contours colores, bascule kaki (coup) -> saturee (AES). Le bloc trio s'ecarte
                vers le HAUT a la fracture (separation d'avec la CEDEAO au sud) --- */}
          {(() => {
            const dy = -split * 22;
            // au climax AES, les bandes de drapeau remplacent l'aplat uni -> on attenue le fill uni
            const uniFill = (coupProg: number) => Math.max(coupProg * 0.5, flagSaturate * 0.7) * (1 - flagSaturate * 0.85);
            return (
              <g transform={`translate(0 ${-dy * 0 + (-split * 22)})`}>
                {countryOutline(geo.mali, trioColor(MALI_DIM, MALI_SAT, coup(MALI_COUP)), uniFill(coup(MALI_COUP)))}
                {countryOutline(geo.burkina, trioColor(BURKINA_DIM, BURKINA_SAT, coup(BURKINA_COUP)), uniFill(coup(BURKINA_COUP)))}
                {countryOutline(geo.niger, trioColor(NIGER_DIM, NIGER_SAT, coup(NIGER_COUP)), uniFill(coup(NIGER_COUP)))}
                {/* BANDES DE DRAPEAU (climax AES) — clippees a chaque pays, bbox reelle = remplissage complet */}
                {flagBands("p2-clip-mali", geo.mali, "mali", flagSaturate * 0.92)}
                {flagBands("p2-clip-niger", geo.niger, "niger", flagSaturate * 0.92)}
                {flagBands("p2-clip-burkina", geo.burkina, "burkina", flagSaturate * 0.92)}
                {/* on redessine les contours colores PAR-DESSUS les bandes pour garder la definition */}
                {flagSaturate > 0.01 && (
                  <>
                    <path d={geo.mali.d} fill="none" stroke={MALI_SAT} strokeWidth={3.9} strokeLinejoin="round" opacity={flagSaturate} />
                    <path d={geo.burkina.d} fill="none" stroke={BURKINA_SAT} strokeWidth={3.9} strokeLinejoin="round" opacity={flagSaturate} />
                    <path d={geo.niger.d} fill="none" stroke={NIGER_SAT} strokeWidth={3.9} strokeLinejoin="round" opacity={flagSaturate} />
                  </>
                )}
              </g>
            );
          })()}

          {/* --- PANEL 7 : anneaux coups d'Etat (ordre chrono) — gestes ponctuels, s'estompent apres --- */}
          {ringsFade > 0.01 && (
            <g opacity={ringsFade}>
              {/* anneau plus contraste (or clair) pour etre lisible sur le fond sombre */}
              {closingRing(CITIES.bamako, coup(MALI_COUP), "#e8d5a3")}
              {closingRing(CITIES.ouagadougou, coup(BURKINA_COUP), "#e8d5a3")}
              {closingRing(CITIES.niamey, coup(NIGER_COUP), "#e8d5a3")}
            </g>
          )}

          {/* --- PANEL 8a : fleche menace CEDEAO (geste ponctuel, disparait apres la fracture) --- */}
          {arrowDraw > 0 && (() => {
            const arrowOut = fadeOut(frame, s(48.0), s(49.5)); // disparait pendant la fracture
            if (arrowOut <= 0.01) return null;
            const [sx, sy] = geo.project([-1.0, 6.5]);
            const [tx, ty] = geo.project([-1.0, 12.5]);
            const px = sx + (tx - sx) * 0.55 * arrowDraw;
            const py = sy + (ty - sy) * 0.55 * arrowDraw;
            return (
              <g opacity={arrowDraw * arrowOut}>
                <line x1={sx} y1={sy} x2={px} y2={py} stroke={CRISIS} strokeWidth={5} strokeLinecap="round"
                  strokeDasharray="10 8" opacity={0.9} />
                <polygon points={`${px},${py - 12} ${px - 9},${py + 6} ${px + 9},${py + 6}`} fill={CRISIS} opacity={0.9} />
              </g>
            );
          })()}

          {/* --- PANEL 8b : ligne de FRACTURE entre trio et CEDEAO --- */}
          {crackDraw > 0 && (() => {
            const [x0, y0] = geo.project([-11, 11.5]);
            const [x1, y1] = geo.project([4, 11.5]);
            const d = fracturePath(x0, y0, x1, y1);
            const len = Math.hypot(x1 - x0, y1 - y0) * 2.2;
            const op = crackScar > 0.5 ? 0.3 : 1;
            return (
              <g opacity={op}>
                <path d={d} fill="none" stroke="#fff2d0" strokeWidth={crackScar > 0.5 ? 2 : 5} strokeLinecap="round"
                  strokeDasharray={len} strokeDashoffset={len * (1 - crackDraw)} opacity={0.9} />
                <path d={d} fill="none" stroke={CRISIS} strokeWidth={crackScar > 0.5 ? 4 : 11} strokeLinecap="round"
                  strokeDasharray={len} strokeDashoffset={len * (1 - crackDraw)} opacity={0.25} />
              </g>
            );
          })()}

          {/* --- PANEL 9 : sceau AES au centre du trio. DISPARAIT une fois les DRAPEAUX etablis (retour Aziz :
                il masquait le Burkina + genait le lingot d'or ; l'union est dite par les 3 drapeaux reunis) --- */}
          {(() => {
            const sealVisible = sealDraw * fadeOut(frame, s(59.2), s(60.6));
            if (sealVisible <= 0.01) return null;
            const cx = (geo.mali.cx + geo.burkina.cx + geo.niger.cx) / 3;
            const cy = (geo.mali.cy + geo.burkina.cy + geo.niger.cy) / 3;
            const R = 88 * sealSettle;
            return (
              <g opacity={sealVisible} transform={`translate(${cx} ${cy})`}>
                <circle r={R * 1.15} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.4} />
                <circle r={R} fill={NAVY_DEEP} stroke={GOLD} strokeWidth={5} opacity={0.96} />
                <circle r={R * 0.8} fill="none" stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.7} />
                <text y={R * 0.3} fontFamily={NUM} fontSize={R * 0.66} fill={GOLD} textAnchor="middle" letterSpacing={2}>AES</text>
              </g>
            );
          })()}

          {/* --- PANEL 10 : veines de ressources (partent des centroides reels) --- */}
          {/* OR : lingot dore (Mali ouest + Burkina) */}
          {orVein > 0 && ([[-8, 13], [-1.5, 12]] as [number, number][]).map((p, i) => {
            const [x, y] = geo.project(p);
            return (
              <g key={i} opacity={orVein}>
                <circle cx={x} cy={y} r={17} fill={NAVY_DEEP} opacity={0.7} />
                {/* lingot (trapeze) */}
                <polygon points={`${x - 11},${y + 5} ${x + 11},${y + 5} ${x + 8},${y - 5} ${x - 8},${y - 5}`} fill={OR} stroke="#8a6d1e" strokeWidth={1} />
                <line x1={x - 6} y1={y - 5} x2={x - 8} y2={y + 5} stroke="#fff2c0" strokeWidth={1} opacity={0.6} />
              </g>
            );
          })}
          {/* URANIUM : symbole atome (Niger nord, Arlit) */}
          {uraniumVein > 0 && (() => {
            const [x, y] = geo.project([7.3, 18.7]);
            return (
              <g opacity={uraniumVein}>
                <circle cx={x} cy={y} r={17} fill={NAVY_DEEP} opacity={0.7} />
                <circle cx={x} cy={y} r={3} fill={URANIUM} />
                {[0, 60, 120].map((a) => (
                  <ellipse key={a} cx={x} cy={y} rx={12} ry={5} fill="none" stroke={URANIUM} strokeWidth={1.6} transform={`rotate(${a} ${x} ${y})`} opacity={0.9} />
                ))}
              </g>
            );
          })()}
          {/* PETROLE : goutte noire (Niger est) */}
          {petroleVein > 0 && (() => {
            const [x, y] = geo.project([11, 16]);
            return (
              <g opacity={petroleVein}>
                <circle cx={x} cy={y} r={17} fill={NAVY_DEEP} opacity={0.7} />
                <path d={`M ${x} ${y - 11} C ${x + 9} ${y - 1}, ${x + 8} ${y + 9}, ${x} ${y + 9} C ${x - 8} ${y + 9}, ${x - 9} ${y - 1}, ${x} ${y - 11} Z`} fill="#1a1a1a" stroke={GOLD} strokeWidth={1.5} />
                <ellipse cx={x - 3} cy={y + 1} rx={2} ry={3} fill="#4a4a4a" opacity={0.7} />
              </g>
            );
          })()}

          {/* --- PANEL 12 : callout CTA (Kidal rallume — la Libye n'est plus sur la carte, elle reste
                dans le TEXTE du CTA comme renvoi vers la video longue) --- */}
          {ctaPoints > 0 && (() => {
            const [kx, ky] = geo.project(CITIES.kidal);
            const pulse = 0.5 + 0.5 * Math.sin(frame * 0.2);
            return (
              <g opacity={ctaPoints}>
                <circle cx={kx} cy={ky} r={10 + 8 * pulse} fill="none" stroke={OCRE_LINE} strokeWidth={2.5} opacity={0.5 * (1 - pulse)} />
                <circle cx={kx} cy={ky} r={6} fill={OCRE_LINE} />
              </g>
            );
          })()}
        </g>
      </svg>

      {/* --- overlay dim CTA --- */}
      {ctaDim > 0.01 && <AbsoluteFill style={{ background: NAVY_DEEP, opacity: ctaDim * 0.35 }} />}

      {/* --- cartouches TEXTE (hors carte, non scales) --- */}
      {/* date 16 sept 2023 */}
      {dateOp > 0 && (
        <div style={{ position: "absolute", top: 250, left: "50%", transform: "translateX(-50%)", opacity: dateOp * fadeOut(frame, s(60.5), s(61.5)), textAlign: "center" }}>
          <div style={{ fontFamily: NUM, fontSize: 56, letterSpacing: 3, color: GOLD }}>16 SEPTEMBRE 2023</div>
        </div>
      )}
      {/* nom AES */}
      {aesNameOp > 0 && (
        <div style={{ position: "absolute", top: 320, left: "50%", transform: "translateX(-50%)", opacity: aesNameOp * fadeOut(frame, s(61.0), s(62.0)), textAlign: "center", width: "86%" }}>
          <div style={{ fontFamily: NUM, fontSize: 52, letterSpacing: 2, color: "#eaf0fb", lineHeight: 1.05 }}>L'ALLIANCE DES ÉTATS DU SAHEL</div>
        </div>
      )}
      {/* count-up 60 ans — SUR la carte (grand nombre en filigrane, comme le CTA) — retour Aziz */}
      {countOp > 0 && (
        <div style={{ position: "absolute", top: "38%", left: "50%", transform: `translate(-50%,-50%) scale(${suspense})`, opacity: countOp, textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontFamily: NUM, fontSize: 340, letterSpacing: 2, color: GOLD, lineHeight: 0.9, textShadow: "0 6px 40px rgba(0,0,0,0.8)", opacity: 0.92 }}>{countUp}</div>
          <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 8, color: "#f0dca8", marginTop: -10, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>ANS DE STATU QUO BALAYÉS</div>
        </div>
      )}
      {/* CTA texte */}
      {ctaTextOp > 0 && (
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", opacity: ctaTextOp, textAlign: "center", width: "88%" }}>
          <div style={{ fontFamily: NUM, fontSize: 64, letterSpacing: 2, color: GOLD, lineHeight: 1.05 }}>L'HISTOIRE COMPLÈTE</div>
          <div style={{ fontFamily: SANS, fontSize: 24, letterSpacing: 4, color: "#eaf0fb", marginTop: 14 }}>LIBYE · KIDAL · LE VRAI COÛT HUMAIN</div>
          <div style={{ fontFamily: NUM, fontSize: 34, letterSpacing: 3, color: "#ff8a5c", marginTop: 22 }}>VIDÉO COMPLÈTE EN DESCRIPTION</div>
        </div>
      )}

      <SubtitlesWordByWord bottomPx={150} tOffset={T_OFFSET} />
    </AbsoluteFill>
  );
};

// mix helper (local)
function mix(a: string, b: string, t: number) {
  const hx = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const [ar, ag, ab] = hx(a), [br, bg, bb] = hx(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}

export default AesShortPart2;
