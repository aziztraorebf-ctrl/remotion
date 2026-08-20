// MOTEUR: capture-UI (shotcraft) — film monte sur LEUR socle (PageCam + FlashCut), pas le notre
/**
 * NorthShieldPromoV4 — 4e test : cette fois on UTILISE leurs composants, on ne les
 * reimplemente pas.
 *
 * ⛔ Ce qui a change vs V3 (retour d'Aziz, justifie) : la V3 suivait leurs FICHES mais
 * avec du code maison. Resultat moins dynamique, et surtout un defaut reel — le plan
 * "score" zoomait dans le VIDE puis un autre ecran apparaissait sans raison, parce que
 * je changeais de plaque (full -> filtered) au milieu d'un mouvement de camera.
 * Ici :
 *   - la camera est PageCam (leur socle 2.5D par keyframes, avec inclinaison + DOF) ;
 *   - le changement de plaque se fait SUR une coupe couverte par FlashCut, jamais
 *     pendant un mouvement continu ;
 *   - les respirations sont des PaperTitleCard (leur carton), adapte a notre registre.
 *
 * ⭐ Gotcha central herite de leur PageCam : en 3D il agrandit via la propriete CSS
 * `zoom` et non `transform: scale` — scale fait rasteriser a la taille de layout puis
 * agrandir, ce qui floute le texte. C'est LA raison technique pour laquelle leurs plans
 * serres restent nets et pas les notres.
 *
 * Matiere : nos captures Puppeteer (2 etats). Squelette : promo-energy-arc.
 * 780f @30fps = 26s.
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing, staticFile, Img, Audio } from "remotion";
import { PageCam, type CamKey } from "./shotcraft-lib/PageCam";
import { FlashCut } from "./shotcraft-lib/FlashCut";
import layout from "./live-layout.json";

export const NS_V4_FPS = 30;
export const NS_V4_FRAMES = 780;

const PAGE_H = 1080;
const ROWS = layout.dashboard.boxes.rows;
const SEARCH = layout.dashboard.boxes.search;
const FLAGGED = ROWS[ROWS.length - 1];
const FLAG_CY = FLAGGED.y + FLAGGED.h / 2;

const NAVY = "#0A1628";
const IVORY = "#F4F1EA";
const CYAN = "#00D9FF";
const RED = "#FF4D5E";
const MUTED = "#A8B0C0";
const MONO = "'IBM Plex Mono', monospace";
const DISPLAY = "'Space Grotesk', 'Inter', sans-serif";

const FULL = "_client-sim/noteshield/live/dashboard-full.png";
const EMPTY = "_client-sim/noteshield/live/dashboard-empty.png";
const FILTERED = "_client-sim/noteshield/live/filtered-after.png";

const seg = (f: number, a: number, b: number, e = Easing.out(Easing.cubic)) =>
  e(interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

// ── 1. Ouverture marque (brand-ink-open) ─────────────────────────────────────
const Open: React.FC = () => {
  const f = useCurrentFrame();
  const v = seg(f, 0, 9), h = seg(f, 8, 18), ret = 1 - seg(f, 24, 34);
  const exit = seg(f, 76, 83);
  const kick = Math.floor(interpolate(f, [28, 46], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ background: NAVY, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateY(${-40 * exit}px) scale(${1 - 0.12 * exit})`, opacity: 1 - exit, position: "relative" }}>
        <svg width={240} height={240} style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -120, marginTop: -150, opacity: ret }}>
          <line x1={120} y1={30} x2={120} y2={210} stroke={CYAN} strokeWidth={1.5} strokeDasharray={180} strokeDashoffset={180 * (1 - v)} />
          <line x1={30} y1={120} x2={210} y2={120} stroke={CYAN} strokeWidth={1.5} strokeDasharray={180} strokeDashoffset={180 * (1 - h)} />
        </svg>
        <div style={{ display: "flex" }}>
          {"NorthShield".split("").map((c, i) => {
            const p = seg(f, 10 + i * 3, 22 + i * 3);
            return <span key={i} style={{
              fontFamily: DISPLAY, fontSize: 100, fontWeight: 700, color: IVORY, letterSpacing: 2,
              display: "inline-block", opacity: p, transform: `scale(${1.6 - 0.6 * p})`,
              transformOrigin: "center bottom", filter: `blur(${6 * (1 - p)}px)`,
            }}>{c}</span>;
          })}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: MUTED, marginTop: 20, letterSpacing: 4, textAlign: "center" }}>
          {"SECURITE DES ACCES".slice(0, kick)}
          <span style={{ opacity: f < 74 && Math.floor(f / 2) % 2 === 0 ? 1 : 0, color: CYAN }}>▌</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Carton-respiration adapte a notre registre sombre (leur PaperTitleCard est papier/ambre). */
const Breath: React.FC<{ words: string[]; dur: number }> = ({ words, dur }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line = seg(f, 16, 34);
  return (
    <AbsoluteFill style={{ background: NAVY, justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", maxWidth: 1300 }}>
          {words.map((w, i) => {
            const p = seg(f, 4 + i * 4, 16 + i * 4);
            return <span key={i} style={{
              fontFamily: DISPLAY, fontSize: 62, fontWeight: 600, color: IVORY,
              opacity: p, transform: `translateY(${(1 - p) * 18}px)`, display: "inline-block",
              filter: `blur(${4 * (1 - p)}px)`,
            }}>{w}</span>;
          })}
        </div>
        <div style={{ height: 2, background: CYAN, margin: "28px auto 0", width: line * 280, opacity: line }} />
      </div>
    </AbsoluteFill>
  );
};


/**
 * Curseur — fiche camera/cursor-flyover. Principe non negociable de la fiche :
 * "la camera et le curseur sont UN SEUL SYSTEME" — ils passent par la meme table de
 * keyframes et arrivent donc toujours ensemble. Le `scale(1/zoom)` garde la fleche a
 * taille apparente constante : sans lui elle devient enorme des que la camera se resserre,
 * et on perd l'illusion qu'elle appartient a la couche UI.
 */
type CurKey = { frame: number; x: number; y: number; zoom: number };

const Cursor: React.FC<{ keys: CurKey[]; clicks: number[] }> = ({ keys, clicks }) => {
  const f = useCurrentFrame();
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (f >= keys[i].frame && f <= keys[i + 1].frame) { a = keys[i]; b = keys[i + 1]; break; }
  }
  const t = a.frame === b.frame ? 1
    : Easing.inOut(Easing.cubic)(interpolate(f, [a.frame, b.frame], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  const z = a.zoom + (b.zoom - a.zoom) * t;

  // Onde de clic : 2 cercles concentriques decales de 3f (un seul anneau est trop discret).
  const ripples = clicks.map((c) => {
    const p1 = seg(f, c, c + 10);
    const p2 = seg(f, c + 3, c + 13);
    return { p1, p2, live: f >= c && f <= c + 15 };
  });

  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${1 / z})`, transformOrigin: "0 0", pointerEvents: "none" }}>
      {ripples.map((r, i) => r.live ? (
        <React.Fragment key={i}>
          <div style={{
            position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: 999,
            border: `3px solid ${CYAN}`, transform: `scale(${0.3 + r.p1 * 1.6})`, opacity: (1 - r.p1) * 0.9,
            boxShadow: `0 0 22px ${CYAN}`,
          }} />
          <div style={{
            position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: 999,
            border: `2px solid ${CYAN}`, transform: `scale(${0.3 + r.p2 * 2.4})`, opacity: (1 - r.p2) * 0.55,
          }} />
        </React.Fragment>
      ) : null)}
      <svg width={30} height={42} viewBox="0 0 24 34" style={{ display: "block" }}>
        <path d="M3 2 L3 26 L9.5 20.5 L13.5 30 L17.5 28 L13.5 19 L21 18.5 Z"
          fill="#FFFFFF" stroke="#0A1628" strokeWidth={1.6} strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }} />
      </svg>
    </div>
  );
};

// ── 2. La page, vue oblique -> a plat (PageCam 3D) ───────────────────────────
const PlateEstablish: React.FC = () => {
  const keys: CamKey[] = [
    { frame: 0, cx: 960, cy: 620, zoom: 0.78, rotX: 26, rotZ: -3, persp: 1500 },
    { frame: 60, cx: 960, cy: 560, zoom: 0.9, rotX: 10, rotZ: -1, persp: 1500 },
    { frame: 110, cx: 960, cy: 540, zoom: 1.0, rotX: 0, rotZ: 0, persp: 1500 },
  ];
  return <PageCam src={FULL} pageH={PAGE_H} keys={keys} dof={{ focusY: 300, strength: 5 }} />;
};

// ── 3. row-embed : lignes qui s'encastrent, camera legerement inclinee ───────
const RowsLand: React.FC = () => {
  const f = useCurrentFrame();
  const keys: CamKey[] = [
    { frame: 0, cx: 960, cy: 540, zoom: 1.0, rotX: 6, persp: 1600 },
    { frame: 150, cx: 960, cy: 620, zoom: 1.06, rotX: 0, persp: 1600 },
  ];
  return (
    <PageCam src={EMPTY} pageH={PAGE_H} keys={keys}>
      {ROWS.map((b, i) => {
        const cue = 10 + i * 9;
        const p = seg(f, cue, cue + 12);
        const air = 1 - p;
        const seamP = seg(f, cue + 12, cue + 17);
        const w = interpolate(Math.min(seamP * 2, 1), [0, 1], [0, 40]);
        const op = interpolate(seamP, [0.35, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const flag = i === ROWS.length - 1;
        if (f < cue) return null;
        return (
          <div key={i} style={{
            position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h,
            transform: `translateY(${-110 * air}px) rotateX(${14 * air}deg) scale(${1 + 0.05 * air})`,
            transformOrigin: "center bottom", opacity: Math.min(1, p * 2.6),
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${staticFile(FULL)})`,
              backgroundSize: `1920px ${PAGE_H}px`,
              backgroundPosition: `${-b.x}px ${-b.y}px`,
            }} />
            <div style={{
              position: "absolute", left: `${(100 - w) / 2}%`, bottom: 0, width: `${w}%`, height: 2,
              background: flag ? RED : CYAN, boxShadow: `0 0 6px ${flag ? RED : CYAN}`, opacity: op,
            }} />
          </div>
        );
      })}
    </PageCam>
  );
};

// ── 4. type-and-filter : frappe, respiration, convergence ────────────────────
const TypeFilter: React.FC = () => {
  const f = useCurrentFrame();
  const Q = "Berlin";
  const T0 = 26;
  const typed = Math.max(0, Math.min(Q.length, Math.floor((f - T0) / 3)));
  const T1 = T0 + Q.length * 3;
  const FILT = T1 + 11;
  const caret = f < T1 ? true : Math.floor((f - T1) / 8) % 2 === 0;

  // La camera monte vers le champ, puis redescend sur la liste. Elle ne zoome JAMAIS
  // dans une zone qui va se vider — c'est le defaut corrige de la V3.
  const keys: CamKey[] = [
    { frame: 0, cx: 960, cy: 560, zoom: 1.0 },
    { frame: 24, cx: 700, cy: 300, zoom: 1.22 },
    { frame: FILT, cx: 700, cy: 300, zoom: 1.22 },
    { frame: FILT + 34, cx: 960, cy: 420, zoom: 1.05 },
    { frame: 170, cx: 960, cy: 400, zoom: 1.08 },
  ];

  return (
    <PageCam src={EMPTY} pageH={PAGE_H} keys={keys}>
      {ROWS.map((b, i) => {
        const flag = i === ROWS.length - 1;
        const out = flag ? 0 : seg(f, FILT + i * 2, FILT + i * 2 + 6);
        const slide = seg(f, FILT + 6, FILT + 24, Easing.inOut(Easing.cubic));
        const y = flag ? interpolate(slide, [0, 1], [b.y, ROWS[0].y]) : b.y;
        const lift = flag ? Math.sin(slide * Math.PI) : 0;
        return (
          <div key={i} style={{
            position: "absolute", left: b.x, top: y, width: b.w, height: b.h,
            opacity: 1 - out, transform: `translateY(${8 * out}px) scale(${1 + 0.02 * lift})`,
            boxShadow: lift > 0.05 ? `0 ${12 * lift}px ${34 * lift}px rgba(0,0,0,.55)` : "none",
            borderRadius: 16,
          }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden",
              backgroundImage: `url(${staticFile(FULL)})`,
              backgroundSize: `1920px ${PAGE_H}px`,
              backgroundPosition: `${-b.x}px ${-b.y}px`,
            }} />
          </div>
        );
      })}
      <div style={{
        position: "absolute", left: SEARCH.x, top: SEARCH.y, width: SEARCH.w, height: SEARCH.h,
        background: "#0C1A2E", border: `1px solid ${typed > 0 ? CYAN + "88" : "#0F1F38"}`,
        borderRadius: 10, display: "flex", alignItems: "center", gap: 12, padding: "0 20px",
      }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth={2}>
          <circle cx={11} cy={11} r={7} /><path d="M20 20l-3.5-3.5" />
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 16, color: typed > 0 ? IVORY : MUTED }}>
          {typed > 0 ? Q.slice(0, typed) : "Rechercher un utilisateur, un appareil..."}
          <span style={{ opacity: caret ? 1 : 0, color: CYAN }}>▌</span>
        </span>
      </div>

      {/* Le curseur suit le MEME decoupage temporel que la camera ci-dessus :
          il arrive au champ AVANT la frappe, clique, attend, puis descend vers la
          ligne signalee et clique dessus juste avant la coupe. */}
      <Cursor
        keys={[
          { frame: 0, x: 1180, y: 760, zoom: 1.0 },
          { frame: 20, x: 136, y: 164, zoom: 1.22 },
          { frame: FILT + 4, x: 136, y: 164, zoom: 1.22 },
          { frame: FILT + 30, x: 430, y: ROWS[0].y + 62, zoom: 1.08 },
          { frame: 128, x: 430, y: ROWS[0].y + 62, zoom: 1.08 },
          { frame: 148, x: 1424, y: ROWS[0].y + 62, zoom: 1.08 },
        ]}
        clicks={[16, 132]}
      />
    </PageCam>
  );
};

// ── 5. Le verdict : plaque FILTREE, coordonnees MESUREES sur la plaque ───────
/**
 * ⛔ Lecon de la V4-a : j'avais CALCULE la position (FLAG_CY - 660) au lieu de la MESURER.
 * Resultat : cadrage sur du vide. Le layout.json de l'etat `filtered` ne sert a rien ici —
 * il a ete releve AVANT l'interaction, il contient encore les 7 lignes.
 * Valeurs ci-dessous mesurees au pixel sur filtered-after.png (cercle de score rouge) :
 *   ligne signalee centree a cy = 642 CSS px ; score 82 a cx = 1424 CSS px.
 */
const FILT_ROW_CY = 642;
const FILT_SCORE_CX = 1424;
const FILT_ROW_X = 96;
const FILT_ROW_Y = 588;   // 642 - 130/2 + marge de bordure
const FILT_ROW_W = 1728;
const FILT_ROW_H = 130;

const Verdict: React.FC = () => {
  const f = useCurrentFrame();
  const glow = seg(f, 10, 34);
  const pulse = 1 + Math.sin(f / 9) * 0.015 * glow;
  const keys: CamKey[] = [
    { frame: 0, cx: 960, cy: FILT_ROW_CY - 40, zoom: 1.0, rotX: 4, persp: 1600 },
    { frame: 36, cx: 1100, cy: FILT_ROW_CY, zoom: 1.35, rotX: 0, persp: 1600 },
    { frame: 71, cx: FILT_SCORE_CX - 40, cy: FILT_ROW_CY, zoom: 1.7, rotX: 0, persp: 1600 },
  ];
  return (
    <PageCam src={FILTERED} pageH={PAGE_H} keys={keys}>
      <div style={{
        position: "absolute", left: FILT_ROW_X, top: FILT_ROW_Y,
        width: FILT_ROW_W, height: FILT_ROW_H, borderRadius: 16,
        border: `2px solid ${RED}`, boxShadow: `0 0 ${52 * glow}px ${RED}`,
        opacity: glow, transform: `scale(${pulse})`,
      }} />
    </PageCam>
  );
};

// ── 6. Final ─────────────────────────────────────────────────────────────────
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const inP = seg(f, 0, 22);
  const line = seg(f, 22, 46);
  const sub = seg(f, 42, 66);
  return (
    <AbsoluteFill style={{ background: NAVY, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: inP, transform: `translateY(${(1 - inP) * 22}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: RED, letterSpacing: 7, marginBottom: 26 }}>
          ANOMALIE DETECTEE
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 82, fontWeight: 700, color: IVORY }}>NorthShield</div>
        <div style={{ height: 2, background: CYAN, margin: "26px auto 0", width: line * 340, opacity: line }} />
        <div style={{ fontFamily: MONO, fontSize: 20, color: MUTED, marginTop: 26, opacity: sub, letterSpacing: 2 }}>
          Chaque connexion, notee en temps reel.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Plan de montage. Les FlashCut sont a cheval sur les coupes (from = coupe - 5),
// et c'est SOUS un flash que la plaque change (full -> filtered) : jamais en plein
// mouvement de camera.
// Budget (arc promo-energy-arc, 780f) : ouverture 11% / heros 15% / montee 58% / final 16%.
const CUT_A = 84;   // open -> establish        (2.8s ouverture)
const CUT_B = 204;  // establish -> respiration (4.0s la page se pose)
const CUT_C = 258;  // respiration -> rows      (1.8s carton)
const CUT_D = 414;  // rows -> respiration      (5.2s encastrement)
const CUT_E = 468;  // respiration -> filtre    (1.8s carton)
const CUT_F = 618;  // filtre -> verdict        (5.0s frappe+convergence)
const CUT_G = 690;  // verdict -> outro         (2.4s verdict, 3.0s outro : hold >= 1s, regle R1)

export const NorthShieldPromoV4: React.FC = () => (
  <AbsoluteFill style={{ background: NAVY }}>
    <Sequence from={0} durationInFrames={CUT_A}><Open /></Sequence>
    <Sequence from={CUT_A} durationInFrames={CUT_B - CUT_A}><PlateEstablish /></Sequence>
    <Sequence from={CUT_B} durationInFrames={CUT_C - CUT_B}><Breath words={["Chaque", "connexion,", "notee."]} dur={CUT_C - CUT_B} /></Sequence>
    <Sequence from={CUT_C} durationInFrames={CUT_D - CUT_C}><RowsLand /></Sequence>
    <Sequence from={CUT_D} durationInFrames={CUT_E - CUT_D}><Breath words={["Une", "seule", "sort", "du", "lot."]} dur={CUT_E - CUT_D} /></Sequence>
    <Sequence from={CUT_E} durationInFrames={CUT_F - CUT_E}><TypeFilter /></Sequence>
    <Sequence from={CUT_F} durationInFrames={CUT_G - CUT_F}><Verdict /></Sequence>
    <Sequence from={CUT_G} durationInFrames={NS_V4_FRAMES - CUT_G}><Outro /></Sequence>

    {[CUT_A, CUT_C, CUT_E, CUT_F, CUT_G].map((c) => (
      <Sequence key={c} from={c - 5} durationInFrames={10}><FlashCut duration={10} /></Sequence>
    ))}

    {/* Musique : bgm-tech-house de video-shotcraft (Apache-2.0), segment 156-182s —
        choisi sur MESURE du profil d'energie (-11.0 -> -9.5 -> -9.2 dB), c'est la seule
        portion qui MONTE sur 26s d'affilee, ce qui epouse l'arc promo-energy-arc dont le
        final est le pic du film. Fondus 1.2s/2s deja graves dans le fichier.
        Volume 0.13 = valeur de depart harmonisee projet ; se monte/descend a l'oreille. */}
    <Sequence from={0} durationInFrames={NS_V4_FRAMES}>
      <Audio src={staticFile("_client-sim/noteshield/bgm/tech-house-26s.mp3")} volume={0.13} />
    </Sequence>

    {/* ── SON ─────────────────────────────────────────────────────────────────
        ⛔ Regle projet : jamais `{frame === X && <Audio/>}` (inaudible en render,
        3 beats livres muets). Toujours <Sequence from=... durationInFrames=...>.
        Le sample clavier fait 19.6 s : il DOIT etre tronque par la Sequence.
        Volumes : SFX plancher 0.50, ponctuels seulement, jamais de nappe. */}
    {/* ⛔ PAS de whoosh sur les coupes (retire 2026-08-20, retour Aziz) : le sample
        `transition/whoosh-fast.mp3` est un sifflement d'AIR — un vocabulaire de mouvement
        physique qui n'a aucun rapport avec une interface logicielle. Sur 5 coupes il
        devenait le son le plus present du film. Une coupe d'UI se passe de bruitage :
        le FlashCut visuel suffit. */}

    {/* frappe "Berlin" : 6 caracteres a 3f = 18f, sample tronque a 24f */}
    <Sequence from={CUT_E + 26} durationInFrames={24}>
      <Audio src={staticFile("_client-sim/noteshield/sfx/keyboard.mp3")} volume={0.5} />
    </Sequence>

    {/* les 2 clics de souris, cales sur les ondes du curseur (16 et 132 en local) */}
    <Sequence from={CUT_E + 16} durationInFrames={20}>
      <Audio src={staticFile("_client-sim/noteshield/sfx/click.mp3")} volume={0.55} />
    </Sequence>
    <Sequence from={CUT_E + 132} durationInFrames={20}>
      <Audio src={staticFile("_client-sim/noteshield/sfx/click.mp3")} volume={0.55} />
    </Sequence>

    {/* le risque se declare */}
    <Sequence from={CUT_F + 10} durationInFrames={30}>
      <Audio src={staticFile("_client-sim/noteshield/sfx/impact.mp3")} volume={0.55} />
    </Sequence>

    {/* pose du lockup final */}
    <Sequence from={CUT_G + 20} durationInFrames={20}>
      <Audio src={staticFile("_client-sim/noteshield/sfx/tone.mp3")} volume={0.5} />
    </Sequence>
  </AbsoluteFill>
);
