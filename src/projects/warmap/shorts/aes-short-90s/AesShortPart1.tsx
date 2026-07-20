// AesShortPart1 — Short "L'AES en 90 secondes", PREMIERE MOITIE (0-36s). REFONTE v5 (retours Aziz).
// PRINCIPES (valides Aziz) :
//  - CAMERA FIXE. Aucun mouvement/zoom/oscillation. Tout apparait/mute/fade DANS un cadre immobile.
//  - OUVERTURE : le continent AFRICAIN se trace (ocre) -> se DISSOUT (fade) -> la carte Sahel/AES apparait.
//    (changement de contenu par fade, PAS un travelling de camera).
//  - PAYS = CONTOUR COLORE, INTERIEUR TRANSPARENT (navy visible dedans). Le remplissage (translucide)
//    est un EVENEMENT : un pays "s'active" quand le recit parle de lui. Pas de blocs de couleur pleins.
//  - Sous-titres = phrases COURTES facon cacao/GGW (composant SubtitlesWordByWord refait).
//  - Zones : territoire perdu = TRAME ROUGE HACHUREE ; villes tenues = POINTS nets.
//
// Panels : 1 trio se trace | 2 rupture alliances (ghost) | 3 Libye | 4 contagion | 5 France/ONU | 6 extension.
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { getAesGeo, getCamera, CITIES } from "./aesGeo";
import { SubtitlesWordByWord } from "./SubtitlesWordByWord";
import { AfriqueOpening } from "./AfriqueOpening";

const W = 1080;
const H = 1920;

// ---- Palette navy ----
const NAVY_TOP = "#2b3f70";
const NAVY = "#1a2848";
const NAVY_DEEP = "#141f3c";
const GRID_NAVY = "#41557f";
const OCRE_LINE = "#f0cf8f";
const INK = "#0b1220";
const CRISIS = "#d95a45";
const FRANCE_BLEU = "#ddebff";
const ONU_BLEU = "#5fb8ff";
const GHOST = "#5a6b8a";
// Couleurs drapeau (pour les CONTOURS colores — intensite pleine sur le trait, pas d'aplat)
const MALI_COL = "#3b9a5a"; // vert Mali
const NIGER_COL = "#e0782e"; // orange Niger
const BURKINA_COL = "#d0453e"; // rouge Burkina
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

const GRID_STEP = 185;
const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const fadeOut = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const hx = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = hx(a); const [br, bg, bb] = hx(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
};

// ==== TIMELINE OUVERTURE (reco Kimi : zoom-in + focus progressif, PAS un hard cut) ====
// 0 -> 3.5s : Afrique entiere se trace. 3.5 -> 4.6s : les pays hors-AES s'estompent (focus sur le trio).
// 4.2 -> 5.4s : crossfade Afrique(fantome) -> carte Sahel zoomee. L'Afrique reste en fantome ~1s.
const AFR_FOCUS_A = s(3.5); // debut estompage des pays hors-AES
const AFR_FOCUS_B = s(4.6);
const AFR_FADE_A = s(4.4); // crossfade vers la carte Sahel
const AFR_FADE_B = s(5.6);

export const AesShortPart1: React.FC<{ noAudio?: boolean }> = ({ noAudio = false }) => {
  const frame = useCurrentFrame();
  const geo = getAesGeo();

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => 40 + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => 28 + i * GRID_STEP);

  // ouverture Afrique -> Sahel : focus progressif (pays hors-AES s'estompent) puis crossfade.
  const afrOpacity = fadeOut(frame, AFR_FADE_A, AFR_FADE_B);
  const afrNonAesFade = fadeOut(frame, AFR_FOCUS_A, AFR_FOCUS_B); // pays hors-AES s'estompent
  // leger zoom-in de l'Afrique vers le Sahel (le continent grandit un peu = plongee douce, pas un cut)
  const afrZoom = interpolate(frame, [0, AFR_FADE_B], [1, 1.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [afrCx, afrCy] = geo.trioCenter; // on plonge vers le trio
  const sahelOpacity = clampI(frame, AFR_FADE_A, AFR_FADE_B);

  // CAMERA : trio plein ecran (0-13.3s) -> dezoom a l'arrivee Libye + respiration subtile (decision Aziz).
  const cam = getCamera(frame, geo);

  // ===== PANEL 1 — trio se trace (le trio apparait apres la dissolution Afrique, ~5s) =====
  // Trace LENT (retour Aziz). Contour colore qui se dessine. Pas de fill (intérieur transparent).
  const trioDraw = (start: number) => clampI(frame, start, start + 40); // 40f = lent
  const MALI_START = s(5.0), BURKINA_START = s(5.7), NIGER_START = s(6.4);
  // "activation" (leger fill translucide) quand on parle des 3 nations ensemble (fin panel 1)
  const trioActive = clampI(frame, s(2.8), s(4.0));

  // ===== PANEL 2 — rupture alliances (5.5-12.7s) =====
  const linkDraw = clampI(frame, s(7.4), s(8.6));
  const linkBreak = clampI(frame, s(8.1), s(9.6));
  const cedeaoGhost = clampI(frame, s(10.2), s(11.4));

  // ===== PANEL 3 — Libye (14.3-17.6s) =====
  const libyeDraw = clampI(frame, s(14.3), s(15.6)); // trace un peu plus lent
  const libyeFlagOp = clampI(frame, s(15.4), s(16.3));
  const date2012Op = clampI(frame, s(15.6), s(16.4));

  // ===== PANEL 4 — contagion (18.9-22.9s) =====
  const libyeGris = clampI(frame, s(18.98), s(20.0));
  const libyeRouge = clampI(frame, s(21.3), s(22.9));
  const fluxT = clampI(frame, s(18.98), s(21.0));
  const fluxOp = clampI(frame, s(18.98), s(19.6)) * fadeOut(frame, s(22.8), s(23.8));
  const nordMaliFire = clampI(frame, s(21.3), s(23.0));

  // ===== PANEL 5 — France/ONU (24.5-29.3s) =====
  const cityAppear = (start: number) => spring({ frame: frame - start, fps: FPS, config: { damping: 12, stiffness: 150 }, durationInFrames: 14 });
  const franceOp = clampI(frame, s(24.5), s(25.4));
  const onuOp = clampI(frame, s(25.9), s(26.7));

  // ===== PANEL 6 — extension (30.3-35.8s) =====
  const spreadRaw = clampI(frame, s(30.3), s(35.0));
  const spread = spreadRaw * spreadRaw * spreadRaw;
  const zonePulse = frame >= s(21.3) ? 1 + 0.05 * Math.sin((frame - s(21.3)) * 0.3) : 1;

  // ---- rendu d'un pays : CONTOUR colore qui se trace + fill TRANSLUCIDE optionnel (activation) ----
  const country = (c: { d: string; len: number }, draw: number, col: string, active = 0) => {
    if (draw <= 0) return null;
    return (
      <g>
        {/* interieur TRANSPARENT par defaut ; fill translucide seulement quand "actif" */}
        {active > 0.01 && <path d={c.d} fill={col} opacity={active * 0.18} />}
        {/* contour colore qui se trace */}
        <path
          d={c.d}
          fill="none"
          stroke={col}
          strokeWidth={3.9}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={c.len}
          strokeDashoffset={c.len * (1 - draw)}
          opacity={0.95}
        />
        {/* fin liseré sombre interne pour la lisibilite sur navy */}
        {draw > 0.9 && <path d={c.d} fill="none" stroke={INK} strokeWidth={1} strokeLinejoin="round" opacity={0.3} />}
      </g>
    );
  };

  const capital = (coord: [number, number], start: number, col: string) => {
    const [x, y] = geo.project(coord);
    const op = clampI(frame, start, start + 10);
    if (op <= 0) return null;
    const pulse = interpolate(frame, [start, start + 8, start + 18], [1, 1.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <g opacity={op}>
        <circle cx={x} cy={y} r={4.5 * pulse} fill={col} />
        <circle cx={x} cy={y} r={2.2} fill={NAVY_DEEP} />
      </g>
    );
  };

  const heldCity = (coord: [number, number], start: number, showOnu: boolean) => {
    const [x, y] = geo.project(coord);
    const ap = cityAppear(start);
    const op = frame >= start ? ap : 0;
    if (op <= 0) return null;
    const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16 + x);
    return (
      <g opacity={Math.min(1, op) * franceOp}>
        <circle cx={x} cy={y} r={22} fill={NAVY} opacity={0.6} />
        <circle cx={x} cy={y} r={12 + 10 * pulse} fill="none" stroke={FRANCE_BLEU} strokeWidth={2.5} opacity={0.5 * (1 - pulse)} />
        {showOnu && <circle cx={x} cy={y} r={17} fill="none" stroke={ONU_BLEU} strokeWidth={2.5} opacity={onuOp * 0.8} />}
        <circle cx={x} cy={y} r={7 * op} fill={ONU_BLEU} />
        <circle cx={x} cy={y} r={3} fill="#eef4ff" />
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {!noAudio && <Audio src={staticFile("_shared/audio/sahel-warmap/short-90s-v1.mp3")} />}

      {/* fond navy + grille (permanent, cadre fixe) */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="p1-bg" cx="50%" cy="38%" r="80%">
            <stop offset="0%" stopColor={NAVY_TOP} />
            <stop offset="60%" stopColor={NAVY} />
            <stop offset="100%" stopColor={NAVY_DEEP} />
          </radialGradient>
          <radialGradient id="p1-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a3c60" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2a3c60" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="p1-fire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CRISIS} stopOpacity="0.9" />
            <stop offset="55%" stopColor={CRISIS} stopOpacity="0.55" />
            <stop offset="100%" stopColor={CRISIS} stopOpacity="0" />
          </radialGradient>
          {/* trames HACHUREES rouge = territoire perdu. Direction DIFFERENTE par pays (reco Kimi) pour
              une texture distincte : Mali diagonale ↗ (rotate -45), Niger diagonale ↘ (45), Burkina horizontale (0).
              Hachures EPAISSIES (stroke 3, reco Kimi : trop fines = bruit sur mobile). */}
          <pattern id="hatch-mali" width="13" height="13" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
            <rect width="13" height="13" fill={CRISIS} opacity="0.14" />
            <line x1="0" y1="0" x2="0" y2="13" stroke={CRISIS} strokeWidth="3" opacity="0.75" />
          </pattern>
          <pattern id="hatch-niger" width="13" height="13" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="13" height="13" fill={CRISIS} opacity="0.14" />
            <line x1="0" y1="0" x2="0" y2="13" stroke={CRISIS} strokeWidth="3" opacity="0.75" />
          </pattern>
          <pattern id="hatch-burkina" width="13" height="13" patternTransform="rotate(0)" patternUnits="userSpaceOnUse">
            <rect width="13" height="13" fill={CRISIS} opacity="0.14" />
            <line x1="0" y1="0" x2="13" y2="0" stroke={CRISIS} strokeWidth="3" opacity="0.75" />
          </pattern>
          <clipPath id="clip-mali"><path d={geo.mali.d} /></clipPath>
          <clipPath id="clip-burkina"><path d={geo.burkina.d} /></clipPath>
          <clipPath id="clip-niger"><path d={geo.niger.d} /></clipPath>
        </defs>
        <rect width={W} height={H} fill="url(#p1-bg)" />
        <g stroke={GRID_NAVY} strokeWidth={1.5} opacity={0.62}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>
        <ellipse cx={540} cy={820} rx={560} ry={680} fill="url(#p1-halo)" opacity={sahelOpacity * 0.8} />
      </svg>

      {/* OUVERTURE : le continent africain se trace, puis se dissout (fade) */}
      {afrOpacity > 0.001 && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${afrZoom})`, transformOrigin: `${afrCx}px ${afrCy}px` }}>
          <AfriqueOpening opacity={afrOpacity} nonAesFade={afrNonAesFade} />
        </div>
      )}

      {/* CARTE SAHEL/AES (monte en crossfade apres la dissolution Afrique) — CAMERA sur le groupe */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: sahelOpacity }}>
       <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
        {/* --- CEDEAO cotiere en fantome (panel 2) --- */}
        {cedeaoGhost > 0 && geo.cedeao.map((c) => (
          <path key={c.name} d={c.d} fill="none" stroke={GHOST} strokeWidth={1.6} strokeDasharray="3 5" opacity={cedeaoGhost * 0.3} />
        ))}

        {/* --- LIBYE (panel 3-4) : contour lumineux -> couleur -> gris -> rouge --- */}
        {libyeDraw > 0 && (() => {
          const libyeColor = libyeRouge > 0.01 ? mix("#8a8878", CRISIS, libyeRouge)
            : libyeGris > 0.01 ? mix("#a63535", "#8a8878", libyeGris)
            : libyeFlagOp > 0.01 ? "#a63535" : OCRE_LINE;
          return (
            <g>
              {(libyeFlagOp > 0 || libyeGris > 0 || libyeRouge > 0) && (
                <path d={geo.libye.d} fill={libyeColor} opacity={0.5} />
              )}
              <path d={geo.libye.d} fill="none" stroke={libyeFlagOp > 0.01 ? libyeColor : OCRE_LINE}
                strokeWidth={3} strokeLinejoin="round" strokeLinecap="round"
                strokeDasharray={geo.libye.len} strokeDashoffset={geo.libye.len * (1 - libyeDraw)} opacity={0.95} />
            </g>
          );
        })()}

        {/* --- TRIO : CONTOURS COLORES, interieur transparent (activation translucide au fill) --- */}
        {country(geo.mali, trioDraw(MALI_START), MALI_COL, trioActive)}
        {country(geo.burkina, trioDraw(BURKINA_START), BURKINA_COL, trioActive)}
        {country(geo.niger, trioDraw(NIGER_START), NIGER_COL, trioActive)}

        {/* --- TERRITOIRE PERDU : trame rouge hachuree, clippee au pays, qui GRANDIT (panels 4-6) --- */}
        {nordMaliFire > 0 && (
          <g clipPath="url(#clip-mali)" opacity={Math.max(nordMaliFire, 0.8) * zonePulse * 0 + Math.max(nordMaliFire, 0.8)}>
            {(() => {
              const [kx, ky] = geo.project(CITIES.kidal);
              const descend = nordMaliFire * 50 + spread * 110;
              const r = 210 + 120 * nordMaliFire + 500 * spread;
              return (
                <>
                  <circle cx={kx} cy={ky + descend} r={r} fill="url(#p1-fire)" />
                  {/* hachures rouge par-dessus (dans le rayon actuel) pour le look "zone tenue par les groupes" */}
                  <circle cx={kx} cy={ky + descend} r={r * 0.82} fill="url(#hatch-mali)" opacity={Math.min(1, nordMaliFire + spread)} />
                </>
              );
            })()}
          </g>
        )}
        {spread > 0.01 && (
          <>
            <g clipPath="url(#clip-burkina)">
              {(() => { const [bx, by] = geo.project([-0.5, 13.5]); const r = (130 + 320 * spread); return (<>
                <circle cx={bx} cy={by} r={r} fill="url(#p1-fire)" opacity={0.85 * spread} />
                <circle cx={bx} cy={by} r={r * 0.8} fill="url(#hatch-burkina)" opacity={spread} />
              </>); })()}
            </g>
            <g clipPath="url(#clip-niger)">
              {(() => { const [nx, ny] = geo.project([4.5, 15.0]); const r = (130 + 320 * spread); return (<>
                <circle cx={nx} cy={ny} r={r} fill="url(#p1-fire)" opacity={0.85 * spread} />
                <circle cx={nx} cy={ny} r={r * 0.8} fill="url(#hatch-niger)" opacity={spread} />
              </>); })()}
            </g>
          </>
        )}

        {/* --- FLUX Libye -> nord Mali (panel 4) : epais + pulse --- */}
        {fluxOp > 0 && (() => {
          const [x0, y0] = geo.project(CITIES.libyeSud);
          const [x1, y1] = geo.project(CITIES.kidal);
          const d = `M ${x0} ${y0} Q ${(x0 + x1) / 2 + 40} ${(y0 + y1) / 2} ${x1} ${y1}`;
          const len = Math.hypot(x1 - x0, y1 - y0) * 1.3;
          return (
            <g opacity={fluxOp}>
              <path d={d} fill="none" stroke={CRISIS} strokeWidth={13} strokeLinecap="round" opacity={0.16 + 0.12 * Math.sin(frame * 0.3)} />
              <path d={d} fill="none" stroke={CRISIS} strokeWidth={4} strokeLinecap="round" opacity={0.4} />
              <path d={d} fill="none" stroke="#ff8a5c" strokeWidth={9} strokeLinecap="round" opacity={0.95}
                style={{ strokeDasharray: `22 22`, strokeDashoffset: -fluxT * len }} />
            </g>
          );
        })()}

        {/* --- LIENS d'alliance (panel 2) : convergent vers noeud CEDEAO, rompent -> ghost --- */}
        {linkDraw > 0 && (() => {
          const caps: [number, number][] = [CITIES.bamako, CITIES.ouagadougou, CITIES.niamey];
          const [gx, gy] = geo.project([-1.0, 6.5]);
          const broken = linkBreak;
          return (
            <g>
              {caps.map((cap, i) => {
                const [cx, cy] = geo.project(cap);
                const midX = (cx + gx) / 2, midY = (cy + gy) / 2;
                const recul = broken * 45;
                return (
                  <g key={i}>
                    <line x1={cx} y1={cy} x2={gx} y2={gy} stroke="#c9a24a" strokeWidth={2.5}
                      strokeDasharray={300} strokeDashoffset={(1 - linkDraw) * 300} opacity={linkDraw * (1 - broken) * 0.8} />
                    <line x1={cx} y1={cy} x2={midX} y2={midY - recul} stroke={GHOST} strokeWidth={1.6} strokeDasharray="3 5" opacity={broken * 0.15} />
                    <line x1={gx} y1={gy} x2={midX} y2={midY + recul} stroke={GHOST} strokeWidth={1.6} strokeDasharray="3 5" opacity={broken * 0.15} />
                    {broken > 0.1 && broken < 0.7 && (
                      <circle cx={midX} cy={midY} r={6 + 10 * broken} fill="none" stroke={CRISIS} strokeWidth={2} opacity={(1 - broken) * 0.8} />
                    )}
                  </g>
                );
              })}
              <circle cx={gx} cy={gy} r={7} fill={broken > 0.5 ? GHOST : "#c9a24a"} opacity={broken > 0.5 ? 0.3 : linkDraw * 0.7} />
            </g>
          );
        })()}

        {/* --- CAPITALES (panel 1) --- */}
        {capital(CITIES.bamako, s(6.0), MALI_COL)}
        {capital(CITIES.ouagadougou, s(6.7), BURKINA_COL)}
        {capital(CITIES.niamey, s(7.4), NIGER_COL)}

        {/* --- VILLES TENUES France/ONU (panel 5) : ligne de connexion (corridor) + points pulses --- */}
        {franceOp > 0 && (() => {
          const [bx, by] = geo.project(CITIES.bamako);
          const [gx, gy] = geo.project(CITIES.gao);
          const [tx, ty] = geo.project(CITIES.tombouctou);
          const corridorOp = clampI(frame, s(25.4), s(26.4)) * franceOp;
          return (
            <>
              {/* corridor de controle reliant les villes tenues (reco Kimi) */}
              <path d={`M ${bx} ${by} L ${tx} ${ty} L ${gx} ${gy}`} fill="none" stroke={ONU_BLEU}
                strokeWidth={2} strokeDasharray="5 6" opacity={corridorOp * 0.5} />
              {heldCity(CITIES.bamako, s(24.5), onuOp > 0.01)}
              {heldCity(CITIES.gao, s(24.9), onuOp > 0.01)}
              {heldCity(CITIES.tombouctou, s(25.3), onuOp > 0.01)}
            </>
          );
        })()}

        {/* --- LABEL "2012" (panel 3) ancre a la Libye — taille compensee du scale camera --- */}
        {date2012Op > 0 && (() => {
          const [lx, ly] = geo.project([18.0, 27.0]);
          return <text x={lx} y={ly} fontFamily={NUM} fontSize={54 / cam.scale} fill={OCRE_LINE} textAnchor="middle" letterSpacing={2} opacity={date2012Op}>2012</text>;
        })()}
       </g>
      </svg>

      {/* --- Cartouche titre (pendant l'ouverture Afrique) --- */}
      {(() => {
        const op = clampI(frame, s(0.6), s(1.4)) * fadeOut(frame, s(4.4), s(5.2));
        if (op <= 0) return null;
        return (
          <div style={{ position: "absolute", top: 90, left: 60, opacity: op }}>
            <div style={{ fontFamily: SANS, fontSize: 15, letterSpacing: 5, color: "#bf9442", textTransform: "uppercase", marginBottom: 4 }}>Dossier</div>
            <div style={{ fontFamily: NUM, fontSize: 50, letterSpacing: 1, color: "#eaf0fb", lineHeight: 1 }}>L'AES EN 90 SECONDES</div>
          </div>
        );
      })()}

      {/* --- SOUS-TITRES phrases courtes (facon cacao/GGW) --- */}
      <SubtitlesWordByWord bottomPx={150} />
    </AbsoluteFill>
  );
};

export default AesShortPart1;
