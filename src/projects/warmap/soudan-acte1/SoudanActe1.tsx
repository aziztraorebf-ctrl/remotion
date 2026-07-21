/**
 * SoudanActe1 — ACTE 1 "RUPTURE" (v3, 57.3s @30fps = 1719 frames).
 *
 * v3 = 2e passe de retours Aziz (tout visuel, séquençage narratif) :
 *   - AUCUN label sous les objets (mine, etc.) — c'est visuel.
 *   - Noms des généraux : apparaissent au NOM prononcé, tiennent ~2.5s, PUIS disparaissent (plus permanents).
 *   - PLUSIEURS mines d'or (2-3, même sprite) posées sur le territoire RSF → "il contrôlait plusieurs mines".
 *     Elles s'estompent (~18%) après le beat Hemeti pour ne pas charger la suite.
 *   - Début SÉQUENTIEL : Hemeti pop d'abord ("cet homme"), PUIS les mines s'égrènent.
 *   - Soldats RSF déplacés : n'apparaissent plus à "il gagne" mais à "à l'ouest, les hommes de Hemeti"
 *     (F.ouest), posés dans la zone ouest qu'ils contrôlent. Soldats SAF à al-Burhan (inchangé).
 *   - 50M : GRILLE de silhouettes-pions humains (people-icon, teintes/tailles variées = peuple pluriel
 *     et nombreux pris en étau) qui se REMPLIT sur la carte puis DISPARAÎT. AUCUN texte (diversité se VOIT,
 *     jamais "ethnie = cause" — factuellement faux). Remplace les points lumineux.
 *   - 25M : PLUS de plaque texte (sous-titre de la voix) — seulement les jetons civils divers progressifs.
 *
 * Socle : SoudanWarMapEngine (grammaire AES). Audio v2 recoupé (57.3s, fin sur "pire crise humanitaire").
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";
import { SoudanWarMapEngine, CamKey, StateHighlight, ZoneControl } from "../engine/SoudanWarMapEngine";
import { SoudanToken, Pt } from "../engine/soudanActors";
import { SoudanBase } from "../engine/soudanActors";

export const SOUDAN_A1_FPS = 30;
export const SOUDAN_A1_FRAMES = 1719; // 57.3s

// ── ANCRAGES GÉO RÉELS ──
const DARFUR: [number, number] = [26.0, 14.9];     // Hemeti FIXE (Nord-Darfour)
const KHARTOUM: [number, number] = [32.98, 15.67]; // al-Burhan (capitale, SAF)
// plusieurs mines d'or réparties dans le Darfour (territoire contrôlé par Hemeti)
const MINES: [number, number][] = [[24.0, 12.8], [23.2, 14.6], [25.6, 13.0]];

// ── FRAMES (whisper-words-acte1-v2.ts, 30fps) ──
const F = {
  cetHomme: 45,       // "cet homme" → Hemeti pop EN PREMIER
  darfour: 87,        // "mines d'or du Darfour" → les mines s'égrènent
  dagalo: 250,        // "Mohamed Hamdan Dagalo"
  hemeti: 333,        // "connu sous le nom de Hemeti" → label nom
  guerre: 450,        // "il fait la guerre"
  gagner: 560,        // "en train de la gagner"
  soudan: 744,        // "Le Soudan, 3e plus grand pays"
  cinquante: 846,     // "près de 50 millions" → grille de pions
  cinqEnd: 990,       // grille disparaît avant la partition
  coupe: 978,         // "coupé en deux"
  est: 1020,          // "à l'est, l'armée régulière"
  burhan: 1104,       // "Abdel Fattah al-Burhan" → label nom + base SAF
  ouest: 1194,        // "à l'ouest, les hommes de Hemeti" → SOLDATS RSF ICI
  piege: 1446,        // "population prise au piège"
  vingtcinq: 1479,    // "25 millions" → civils divers
  crises: 1638,       // "pires crises humanitaires"
  fin: SOUDAN_A1_FRAMES,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// label transitoire : 0 avant `at`, fade-in, tient ~2.5s, fade-out. (au lieu de permanent)
const transientLabel = (frame: number, at: number, holdS = 2.5) => {
  const hold = holdS * SOUDAN_A1_FPS;
  return interpolate(frame, [at, at + 12, at + 12 + hold, at + 12 + hold + 18], [0, 1, 1, 0], clamp);
};

// ── CAMÉRA (review Gemini+Kimi) : SERRÉ sur le Darfour beats 1-2 → DÉZOOM au beat 3 "3e plus grand
// pays" (avant al-Burhan) → LARGE pour la partition. + drift lent permanent (keyframes rapprochés
// avec micro-variation lon/lat = Ken Burns ; les jetons taille écran fixe suivent sans distorsion). ──
const CAM: CamKey[] = [
  { f: 0, lon: 25.2, lat: 14.3, zoom: 5.95 },      // SERRÉ Darfour (Hemeti + mines occupent l'écran)
  { f: F.dagalo, lon: 25.6, lat: 14.5, zoom: 5.9 }, // drift lent pendant beat 1-2
  { f: F.guerre, lon: 26.0, lat: 14.7, zoom: 5.85 },
  { f: F.soudan, lon: 29.8, lat: 15.2, zoom: 5.05 }, // "3e plus grand pays" → DÉZOOM révèle le Soudan
  { f: F.cinquante, lon: 30.1, lat: 15.3, zoom: 5.0 },
  { f: F.est, lon: 30.6, lat: 15.3, zoom: 5.12 },   // partition, large
  { f: F.burhan, lon: 30.9, lat: 15.4, zoom: 5.1 }, // drift vers l'est (al-Burhan)
  { f: F.piege, lon: 30.2, lat: 15.1, zoom: 5.18 }, // recentre sur les civils
  { f: F.crises, lon: 30.0, lat: 15.2, zoom: 5.14 },
  { f: SOUDAN_A1_FRAMES, lon: 30.3, lat: 15.3, zoom: 5.1 }, // drift final continu
];

// ── HIGHLIGHTS "on nomme → ça se trace" ──
const HL = (state: string, faction: "rsf" | "saf" | "contested", drawAt: number): StateHighlight => ({
  state, faction, drawAt, drawFrames: 30, holdFrames: 1600, fadeFrames: 0,
});
const HIGHLIGHTS: StateHighlight[] = [
  HL("North Darfur", "rsf", F.darfour),
  HL("Southern Darfur", "rsf", F.ouest),      // l'ouest RSF se dessine quand on dit "à l'ouest"
  HL("North Kordufan", "rsf", F.ouest + 40),
  HL("Khartoum", "saf", F.est + 20),
  HL("River Nile", "saf", F.burhan + 30),
];

// ── civils divers (25M) — visages variés, entre les deux camps ──
const CIVIL_SPRITES = ["refugie-famille", "refugie-femme1", "refugie-homme", "refugie-femme2", "refugie-enfant", "portrait-civil"];
const CIVIL_POS: [number, number][] = [
  [29.6, 14.3], [30.4, 14.8], [29.0, 15.0], [30.8, 14.2], [29.8, 15.6],
  [28.6, 14.5], [31.0, 15.2], [29.3, 14.0],
];

// ── soldats (visages) ──
const RSF_SOLDIERS: [number, number][] = [[23.4, 15.4], [27.8, 15.3], [26.4, 13.2]];
const SAF_SOLDIERS: [number, number][] = [[34.6, 16.6], [31.4, 16.4], [34.2, 14.4]];

export const SoudanActe1: React.FC = () => {
  const frame = useCurrentFrame();

  // halo Hemeti : apparition en PULSE (scale/opacité qui bat = expansion du pouvoir, review), pas fade plat
  const rsfPulseIn = interpolate(frame, [F.hemeti, F.hemeti + 10, F.hemeti + 22, F.hemeti + 34], [0, 1.15, 0.92, 1], clamp);
  const rsfHalo = interpolate(frame, [F.hemeti, F.hemeti + 34], [0, 1], clamp) * rsfPulseIn;
  const rsfHaloGrow = interpolate(frame, [F.ouest, F.ouest + 80], [0.7, 1], clamp);
  const rsfBreath = 1 + 0.06 * Math.sin(frame * 0.07); // respiration continue du halo
  const safHalo = interpolate(frame, [F.est, F.est + 40], [0, 1], clamp);
  // beat 5 : les halos de contrôle RESTENT opaques sous les civils (contraste "pris au piège", review)
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 340, intensity: rsfHalo * rsfHaloGrow * rsfBreath },
    { at: KHARTOUM, faction: "saf", radiusKm: 260, intensity: safHalo },
  ];

  const militaryFade = interpolate(frame, [F.piege - 20, F.piege + 30], [1, 0.4], clamp);
  // mines : pleines au beat Hemeti, s'estompent (18%) après (avant la partition)
  const minesFade = interpolate(frame, [F.soudan, F.est], [1, 0.18], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte1-factcheck-v2.mp3")} />

      {/* SFX ancrés au mot */}
      <Sequence from={F.cetHomme} durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F.darfour} durationInFrames={30}><Audio src={staticFile("_shared/sfx/nature/growth-pop.mp3")} volume={0.5} /></Sequence>
      <Sequence from={F.ouest} durationInFrames={20}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.45} /></Sequence>
      <Sequence from={F.burhan} durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.55} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM} zones={zones} highlights={HIGHLIGHTS} showNationalBorder stateLineOpacity={0}>
        {(proj) => {
          const hemetiPos = proj(DARFUR);
          const burhanPos = proj(KHARTOUM);
          const baseSafPos = proj([33.6, 16.4]);

          return (
            <>
              {/* ── MINES D'OR (plusieurs, séquentielles APRÈS Hemeti) — SANS label, SANS drapeau
                  (review Gemini+Kimi : drapeau = surcharge/ambiguïté, l'image parle) ── */}
              {MINES.map((m, i) => {
                const p = proj(m); if (!p) return null;
                return <MineOr key={i} pos={p} frame={frame} appear={F.darfour + i * 16} fade={minesFade} />;
              })}

              {/* ── BEAT 4 : LIGNE DE FRONT nord→sud qui se trace AVANT les halos = "coupé en deux"
                  physique (idée convergente Gemini+Kimi). Encre irrégulière (ink-bleed). ── */}
              {frame >= F.coupe && (
                <FrontLine proj={proj} frame={frame} drawAt={F.coupe} />
              )}

              {/* ── SOLDATS RSF — à "à l'ouest, les hommes de Hemeti", dans la zone ouest ── */}
              {frame >= F.ouest && RSF_SOLDIERS.map((c, i) => {
                const p = proj(c); if (!p) return null;
                return <div key={`rs${i}`} style={{ opacity: militaryFade }}>
                  <SoldierToken pos={p} sprite="portrait-rsf" border="#B14B3C" frame={frame} appear={F.ouest + i * 8} />
                </div>;
              })}

              {/* ── BASE SAF (nouvelle base soudanaise) — beat 4, SANS label ── */}
              {baseSafPos && frame >= F.est && (
                <SoudanBase pos={baseSafPos} frame={frame} appear={F.est} sprite="base-saf-td" size={176} fade={militaryFade} />
              )}

              {/* ── SOLDATS SAF — beat 4 (al-Burhan) ── */}
              {frame >= F.burhan && SAF_SOLDIERS.map((c, i) => {
                const p = proj(c); if (!p) return null;
                return <div key={`ss${i}`} style={{ opacity: militaryFade }}>
                  <SoldierToken pos={p} sprite="portrait-saf" border="#3E6E9E" frame={frame} appear={F.burhan + 20 + i * 8} />
                </div>;
              })}

              {/* ── JETON HEMETI (net, grand) — pop EN PREMIER, label transitoire ── */}
              {hemetiPos && (
                <div style={{ opacity: militaryFade }}>
                  <GeneralToken pos={hemetiPos} sprite="portrait-hemeti" border="#B14B3C"
                    label="Hemedti" labelOp={transientLabel(frame, F.hemeti)} frame={frame} appear={F.cetHomme} />
                </div>
              )}

              {/* ── JETON AL-BURHAN (net, miroir) — label transitoire au nom ── */}
              {burhanPos && frame >= F.burhan && (
                <div style={{ opacity: militaryFade }}>
                  <GeneralToken pos={burhanPos} sprite="portrait-burhan" border="#3E6E9E"
                    label="al-Burhan" labelOp={transientLabel(frame, F.burhan)} frame={frame} appear={F.burhan} />
                </div>
              )}

              {/* ── 25M : civils DIVERS progressifs (SANS plaque texte) ── */}
              {frame >= F.piege && (
                <CivilTokens proj={proj} frame={frame} startAt={F.piege} />
              )}
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* cartouche d'ouverture (contexte lieu, transitoire) */}
      <BeatCaption frame={frame} at={F.darfour} until={F.dagalo - 20} text="DARFOUR · OUEST DU SOUDAN" />

      {/* ── 50M : INSERT cartouche AES (pions représentant les 50M DANS l'encadré + chiffre) —
          au-dessus de la carte sans la quitter (fond parchemin opaque local). Remplace la grille ratée. ── */}
      <Insert50M frame={frame} inAt={F.cinquante} outAt={F.cinqEnd + 10} />

      {/* ── VIGNETTE CHAUDE (review : "lampe de bureau" — centre chaud/lumineux, bords sombres) ── */}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply",
        background: "radial-gradient(ellipse 74% 70% at 50% 47%, rgba(255,240,210,0.06) 0%, rgba(60,42,18,0.0) 42%, rgba(28,18,8,0.42) 100%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light",
        background: "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,238,200,0.22) 0%, rgba(255,238,200,0) 60%)" }} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 50M : INSERT cartouche CENTRÉ sur la carte — chiffre + silhouette Afrique (Soudan
// surligné) + "3e plus grand pays" (rend le chiffre tangible + renforce la voix).
// ─────────────────────────────────────────────────────────────────────────────

const Insert50M: React.FC<{ frame: number; inAt: number; outAt: number }> = ({ frame, inAt, outAt }) => {
  const op = interpolate(frame, [inAt, inAt + 16, outAt - 16, outAt], [0, 1, 1, 0], clamp);
  if (op <= 0) return null;
  const rise = interpolate(frame, [inAt, inAt + 20], [30, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const n = Math.round(interpolate(frame, [inAt + 12, inAt + 66], [0, 50], clamp));
  const subOp = interpolate(frame, [inAt + 40, inAt + 60], [0, 1], clamp);
  const sudanGlow = 0.5 + 0.5 * Math.sin(frame * 0.14);
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%",
      transform: `translate(-50%, calc(-50% + ${rise}px))`, opacity: op, pointerEvents: "none",
      background: "linear-gradient(150deg, #F4E7CB 0%, #E7D6B0 100%)",
      border: "2px solid rgba(60,42,18,0.55)", borderRadius: 10, padding: "30px 46px",
      boxShadow: "0 24px 70px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.35)",
      fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 40 }}>
      {/* colonne gauche : le chiffre */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 96, fontWeight: 800, color: "#2E2114", lineHeight: 1, letterSpacing: -3 }}>{n}</span>
          <span style={{ fontSize: 38, fontWeight: 700, color: "#8A5A22" }}>MILLIONS</span>
        </div>
        <div style={{ fontSize: 22, letterSpacing: 2, color: "#5A4326", textTransform: "uppercase", marginTop: 4 }}>
          d'habitants
        </div>
        <div style={{ fontSize: 18, letterSpacing: 1, color: "#7A5A2E", marginTop: 18, opacity: subOp,
          borderTop: "1px solid rgba(60,42,18,0.3)", paddingTop: 12, maxWidth: 300 }}>
          3<sup>e</sup> plus grand pays d'Afrique
        </div>
      </div>
      {/* colonne droite : VRAIE silhouette du Soudan (extraite du geojson) + Khartoum pointé */}
      <div style={{ opacity: subOp }}>
        <SudanGlyph highlightGlow={sudanGlow} />
      </div>
    </div>
  );
};

/** VRAIE forme du Soudan (path extrait de sudan-outline.geojson, normalisé viewBox 100×83.7)
 *  + point Khartoum (63.7,40.9). Plus de silhouette dessinée à la main. */
const SUDAN_PATH = "M10.8 78.6 L9.8 74.5 L6.6 68.8 L6.6 66.9 L4.9 66.2 L4.8 62.7 L4.0 62.2 L3.1 59.1 L0.5 59.1 L0.9 56.4 L2.5 54.3 L1.8 52.5 L3.5 50.5 L4.3 49.5 L3.7 48.8 L3.4 47.7 L5.1 46.2 L5.5 44.9 L7.0 42.5 L7.1 40.9 L11.3 40.0 L12.9 35.5 L12.9 22.6 L13.9 13.8 L18.8 13.8 L18.9 12.4 L18.9 6.0 L20.6 1.4 L25.8 1.4 L31.1 1.4 L36.3 1.4 L41.5 1.4 L46.7 1.4 L51.9 1.4 L56.3 1.4 L57.6 0.2 L59.7 1.4 L64.5 1.4 L70.4 1.4 L80.1 1.4 L89.7 1.6 L89.9 3.6 L92.3 7.1 L91.6 7.1 L92.0 7.3 L91.4 6.7 L91.0 6.5 L91.1 7.1 L91.5 9.1 L91.5 11.2 L91.7 13.3 L92.0 15.6 L92.2 17.0 L92.6 19.3 L93.6 21.6 L94.5 21.6 L95.1 22.2 L97.1 23.6 L98.0 24.3 L98.0 24.7 L98.2 24.8 L98.7 24.7 L99.5 25.7 L99.9 25.9 L97.9 28.6 L97.2 28.9 L96.8 29.2 L95.8 29.6 L93.5 30.3 L93.2 31.7 L91.0 32.0 L90.3 32.0 L90.4 32.9 L90.2 34.1 L89.7 35.3 L90.0 36.2 L89.0 39.5 L87.6 43.1 L87.4 47.3 L87.1 52.2 L85.4 57.1 L85.2 58.7 L82.9 59.0 L82.5 59.5 L80.9 62.0 L80.1 63.3 L79.1 64.2 L79.0 65.7 L78.0 69.6 L77.7 70.7 L77.1 71.3 L75.9 70.1 L74.5 74.2 L73.9 75.4 L71.9 78.6 L72.3 76.1 L69.4 72.2 L67.7 70.4 L67.4 65.2 L65.0 61.9 L65.1 63.0 L62.7 66.8 L59.9 72.6 L53.8 77.1 L48.8 73.9 L43.6 77.6 L41.9 79.7 L34.7 78.0 L28.7 78.7 L25.1 74.8 L24.4 74.4 L23.9 72.9 L22.7 73.1 L21.5 73.4 L20.9 73.6 L20.5 73.6 L20.0 73.6 L19.1 74.5 L19.2 75.0 L18.3 76.3 L17.8 76.8 L17.0 80.6 L15.4 82.6 L13.1 83.6 L11.2 83.5 L10.2 83.6 L10.5 81.9 L9.8 80.8 L10.9 80.0 L10.8 78.9 L10.8 78.6 Z";
const SudanGlyph: React.FC<{ highlightGlow: number }> = ({ highlightGlow }) => (
  <svg width={128} height={107} viewBox="0 0 100 83.7">
    <path d={SUDAN_PATH} fill="#D8C39A" stroke="#5A4326" strokeWidth={1.4} strokeLinejoin="round" />
    {/* Khartoum pointé (capitale) */}
    <circle cx={63.7} cy={40.9} r={7} fill="#B14B3C" opacity={0.25 + highlightGlow * 0.3} />
    <circle cx={63.7} cy={40.9} r={3} fill="#B14B3C" />
    <circle cx={63.7} cy={40.9} r={3} fill="none" stroke="#8A2E22" strokeWidth={1} />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// MINE D'OR (sans label, SANS drapeau) — physique d'atterrissage (ombre qui se resserre)
// ─────────────────────────────────────────────────────────────────────────────

const MineOr: React.FC<{ pos: Pt; frame: number; appear: number; fade: number }> =
  ({ pos, frame, appear, fade }) => {
    if (frame < appear) return null;
    const size = 118;
    const sp = interpolate(frame, [appear, appear + 10, appear + 20, appear + 30], [0, 1.14, 0.96, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    const fadeIn = interpolate(frame, [appear, appear + 10], [0, 1], clamp);
    const gleam = 0.6 + 0.4 * Math.sin(frame * 0.1);
    // physique : l'ombre commence large/floue puis se resserre quand l'objet "touche"
    const shBlur = interpolate(frame, [appear, appear + 22], [16, 5], clamp);
    const shScale = interpolate(frame, [appear, appear + 22], [1.5, 1], clamp);
    const shOp = interpolate(frame, [appear, appear + 22], [0.15, 0.42], clamp);
    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-58%) scale(${sp})`, opacity: fadeIn * fade, pointerEvents: "none" }}>
        {/* ombre portée dynamique (poids physique à l'atterrissage) */}
        <div style={{ position: "absolute", left: "50%", top: "62%", width: size * 0.7 * shScale, height: size * 0.2 * shScale,
          transform: "translate(-50%,-50%)", background: `rgba(30,20,6,${shOp})`, borderRadius: "50%", filter: `blur(${shBlur}px)` }} />
        <div style={{ position: "absolute", left: "50%", top: "58%", width: size * 0.9, height: size * 0.4,
          transform: "translate(-50%,-50%)",
          background: `radial-gradient(circle, rgba(233,162,59,${0.35 * gleam}) 20%, rgba(233,162,59,0) 70%)` }} />
        <img src={staticFile("_shared/sprites/warmap/mine-or-td.png")}
          style={{ position: "relative", width: size, height: size * (768 / 1408), objectFit: "contain", display: "block" }} />
      </div>
    );
  };

// LIGNE DE FRONT nord→sud qui se trace = "coupé en deux" physique (encre irrégulière, ink-bleed)
const FrontLine: React.FC<{ proj: (c: [number, number]) => Pt | null; frame: number; drawAt: number }> =
  ({ proj, frame, drawAt }) => {
    // tracé géo approx de la ligne de partition (Nil / centre) du nord au sud
    const geo: [number, number][] = [[30.6, 20.5], [30.9, 18.5], [31.0, 16.8], [30.6, 15.2], [30.2, 13.6], [29.9, 11.8]];
    const pts = geo.map(proj).filter(Boolean) as Pt[];
    if (pts.length < 2) return null;
    const drawP = interpolate(frame, [drawAt, drawAt + 46], [0, 1], clamp);
    const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
    const L = 2600, drawn = L * drawP;
    return (
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="frontInk" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves={2} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={6} />
          </filter>
        </defs>
        {/* glow doux + trait net, dash qui se remplit */}
        <path d={d} stroke="#2A1E10" strokeWidth={7} fill="none" opacity={0.28}
          strokeLinecap="round" filter="url(#frontInk)" strokeDasharray={`${drawn} ${L}`} />
        <path d={d} stroke="#1E140A" strokeWidth={3} fill="none" opacity={0.85}
          strokeLinecap="round" filter="url(#frontInk)" strokeDasharray={`${drawn} ${L}`} />
      </svg>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// JETONS
// ─────────────────────────────────────────────────────────────────────────────

const TokenBase: React.FC<{
  pos: Pt; frame: number; appear: number; sprite: string; border: string; D: number;
  label?: string; labelOp?: number;
}> = ({ pos, frame, appear, sprite, border, D, label, labelOp = 1 }) => {
  if (frame < appear) return null;
  const CREAM = "#EFE0C0";
  // spring d'apparition PUIS scale FIGÉ à 1 (pas de "breathe" continu : un scale oscillant sur une
  // image raster = ré-échantillonnage sub-pixel à chaque frame = jeton FLOU/scintillant). Net une fois posé.
  const ap = interpolate(frame, [appear, appear + 12, appear + 22], [0, 1.12, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fadeIn = interpolate(frame, [appear, appear + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y,
      transform: `translate(-50%,-50%) scale(${ap})`, opacity: fadeIn, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: "72%", width: D * 0.82, height: D * 0.26,
        transform: "translate(-50%,-50%)", background: "rgba(30,20,6,0.5)", borderRadius: "50%", filter: "blur(6px)" }} />
      <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden",
        background: CREAM, border: `${D * 0.062}px solid ${border}`,
        // LOT 4.1 : anneau BLANC net (2.5px) autour de la bordure faction = décolle le jeton du fond
        // (carte kaki/rouge), + ombre portée renforcée + liseré sombre externe pour tenir sur fond clair.
        boxShadow: "0 0 0 2.5px #FFFFFF, 0 0 0 3.8px rgba(20,14,6,0.55), 0 6px 18px rgba(0,0,0,0.6)" }}>
        <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
          style={{ width: "116%", height: "116%", objectFit: "cover", objectPosition: "top center",
            transform: "translate(-7%, 1%)", display: "block" }} />
      </div>
      {label && labelOp > 0.01 && (
        <div style={{ position: "absolute", left: "50%", top: `${D + 5}px`, transform: "translate(-50%,0)",
          whiteSpace: "nowrap", fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, opacity: labelOp,
          color: "#F5E6CE", background: "rgba(30,16,10,0.94)", padding: "2px 11px", borderRadius: 3,
          letterSpacing: 1, textTransform: "uppercase", border: `1px solid ${border}` }}>{label}</div>
      )}
    </div>
  );
};

const GeneralToken: React.FC<{ pos: Pt; frame: number; appear: number; sprite: string; border: string; label: string; labelOp: number }> =
  (p) => <TokenBase {...p} D={76} />;
const SoldierToken: React.FC<{ pos: Pt; frame: number; appear: number; sprite: string; border: string }> =
  (p) => <TokenBase {...p} D={44} />;

// ─────────────────────────────────────────────────────────────────────────────
// 25M : civils DIVERS progressifs (SANS plaque)
// ─────────────────────────────────────────────────────────────────────────────

const CivilTokens: React.FC<{ proj: (c: [number, number]) => Pt | null; frame: number; startAt: number }> =
  ({ proj, frame, startAt }) => (
    <>
      {CIVIL_POS.map((c, i) => {
        const p = proj(c); if (!p) return null;
        const appear = startAt + i * 20;
        if (frame < appear) return null;
        const sprite = CIVIL_SPRITES[i % CIVIL_SPRITES.length];
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y,
            transform: "translate(-50%,-50%) scale(0.74)", pointerEvents: "none" }}>
            <TokenBase pos={{ x: 0, y: 0 }} frame={frame} appear={appear} sprite={sprite} border="#7A6A48" D={52} />
          </div>
        );
      })}
    </>
  );

// ─────────────────────────────────────────────────────────────────────────────
// Cartouche d'ouverture (contexte lieu)
// ─────────────────────────────────────────────────────────────────────────────

const BeatCaption: React.FC<{ frame: number; at: number; until: number; text: string }> = ({ frame, at, until, text }) => {
  const op = interpolate(frame, [at, at + 14, until - 14, until], [0, 1, 1, 0], clamp);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 64, left: "50%", transform: "translateX(-50%)", opacity: op,
      fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, letterSpacing: 3, color: "#F4E3B0",
      background: "rgba(28,18,8,0.85)", padding: "8px 24px", borderRadius: 4, border: "1px solid rgba(233,196,106,0.4)",
      textTransform: "uppercase", pointerEvents: "none" }}>{text}</div>
  );
};

export default SoudanActe1;
