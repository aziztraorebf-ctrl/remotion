// P3 — "NorthShield analyse chaque connexion en temps reel — l'appareil, le lieu, l'historique,
// le comportement. Quatre signaux vitaux, une decision instantanee." 15.2 -> 28.7s absolu
// (0 -> 13.5s relatif au panneau). Panneau le plus fort du storyboard : 4 lignes qui tracent
// puis convergent en une seule, avec le score qui monte par paliers vers "18".
//
// REFONTE POST-JURY (2026-08-07, rejet v1 unanime 4/4 : Gemini/Kimi/GPT/Grok — "diaporama
// statique"). Diagnostic : chaque ligne etait draw-on par clip-path PUIS figee a vie une fois
// tracee — exactement l'anti-pattern "apparition != animation". v2 garde le clip-path pour le
// draw-on initial (les 3 <path> par signal sont imbriques dans une string HTML opaque, cibler un
// <path> unique proprement serait fragile) mais ajoute PAR-DESSUS 4 signatures de mouvement
// continu distinctes, une par ligne, qui ne s'arretent JAMAIS jusqu'a la convergence :
//   - APPAREIL   : motif carre qui defile horizontalement en boucle (petits reperes qui glissent
//                  le long du trace) + micro-glow aux angles.
//   - LIEU       : point cyan voyageur qui derive lentement sur la courbe douce.
//   - HISTORIQUE : les ticks (deja presents dans historique_marqueurs) s'allument successivement
//                  en boucle, comme un scan qui les visite un par un.
//   - COMPORTEMENT : micro-deformation continue (translateY sinusoidal + pulse de glow), jamais
//                  figee, signature organique.
// Puis extraction (un pulse plus lumineux par ligne voyage vers la droite pendant que la courbe
// de fond continue de vivre derriere lui), convergence, et le score s'incremente PAR PALIERS
// (4 -> 9 -> 14 -> 18) a chaque arrivee de pulse — pas un pop final isole sur un chiffre deja
// ecrit dans le SVG (le texte "18" natif est masque, remplace par un <text> React dynamique).
// Cf memory/client-sim-tests/noteshield/SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md § P3.
//
// PIEGE RESOLU (herite v1, NE PAS REGRESSER) : chaque groupe signal_* melange un LABEL statique
// (<rect> repere + <text>, a x=96-124) et 3 <path> qui vont DEJA de leur y de depart jusqu'a
// y=540 (Fable a dessine la convergence directement dans la geometrie du path). Appliquer un
// translateY de "convergence" au groupe entier deplacait aussi le label — les 4 labels
// finissaient tous superposes au meme endroit. Fix : on separe label (splitByTag "text"+"rect")
// du reste (les path, deja convergents nativement) — le label fait juste un fade-out avant que la
// convergence ne commence, le reste n'a besoin d'AUCUN translateY.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P3_SIGNAUX_SVG } from "./bodies/P3SignauxBody";
import { extractGroup, extractDefs, splitByTag } from "./svgGroupExtractor";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const DEFS = extractDefs(P3_SIGNAUX_SVG);

function splitLabelAndPaths(groupContent: string) {
  const { matched: rectPart, rest: afterRect } = splitByTag(groupContent, "rect");
  const { matched: textPart, rest: paths } = splitByTag(afterRect, "text");
  return { label: rectPart + textPart, paths };
}

const signalAppareilFull = extractGroup(P3_SIGNAUX_SVG, "signal_appareil");
const signalLieuFull = extractGroup(P3_SIGNAUX_SVG, "signal_lieu");
const signalHistoriqueFull = extractGroup(P3_SIGNAUX_SVG, "signal_historique");
const signalComportementFull = extractGroup(P3_SIGNAUX_SVG, "signal_comportement");

// Le sous-groupe historique_marqueurs (10 cercles = 5 paires anneau+point) doit etre retire des
// "paths" d'HISTORIQUE pour etre anime independamment (allumage sequentiel), sinon il resterait
// fige a opacite fixe avec le reste du trace.
const HISTORIQUE_MARQUEURS = extractGroup(signalHistoriqueFull, "historique_marqueurs");
const signalHistoriqueSansMarqueurs = signalHistoriqueFull.replace(
  new RegExp(`<g\\s[^>]*id="historique_marqueurs"[^>]*>[\\s\\S]*?</g>`),
  "",
);

const G = {
  fondStructure: extractGroup(P3_SIGNAUX_SVG, "fond_structure"),
  grilleMesure: extractGroup(P3_SIGNAUX_SVG, "grille_mesure"),
  signalAppareil: splitLabelAndPaths(signalAppareilFull),
  signalLieu: splitLabelAndPaths(signalLieuFull),
  signalHistorique: splitLabelAndPaths(signalHistoriqueSansMarqueurs),
  signalComportement: splitLabelAndPaths(signalComportementFull),
  noeudConvergence: extractGroup(P3_SIGNAUX_SVG, "noeud_convergence"),
  scoreFinal: extractGroup(P3_SIGNAUX_SVG, "score_final"),
};

// Le score_final SVG natif contient un "18" fige en dur (3 <text> empiles pour le glow) — on le
// masque et le remplace par un <text> React anime pour l'increment par paliers.
const { matched: scoreDigitsText, rest: scoreFinalSansChiffre } = splitByTag(G.scoreFinal, "text");
void scoreDigitsText; // conserve pour reference; non reinjecte (remplace par notre <text> anime)

// Les 4 lignes partent toutes de x=560 et convergent vers x~1560-1630 (mesure dans le SVG source).
const LINE_X_START = 540;
const LINE_X_END = 1650;

const Raw: React.FC<{ body: string; opacity?: number; transform?: string; clipPath?: string }> = ({
  body,
  opacity,
  transform,
  clipPath,
}) => <g opacity={opacity} transform={transform} clipPath={clipPath} dangerouslySetInnerHTML={{ __html: body }} />;

// Points d'ancrage approximatifs de chaque courbe (mesures dans le path source), utilises pour
// placer les points voyageurs / pulses d'extraction sans dependre de getPointAtLength (indispo en
// SSR/headless Remotion). Interpolation lineaire par segments -- suffisant pour un point qui
// glisse visuellement le long du trace, pas besoin de precision sub-pixel.
type Pt = [number, number];
const APPAREIL_PTS: Pt[] = [
  [560, 330], [900, 330], [1300, 330], [1420, 330], [1560, 540],
];
const LIEU_PTS: Pt[] = [
  [560, 470], [745, 428], [930, 470], [1115, 512], [1300, 470], [1420, 470], [1560, 540],
];
const HISTORIQUE_PTS: Pt[] = [
  [560, 610], [1300, 610], [1420, 610], [1560, 540],
];
const COMPORTEMENT_PTS: Pt[] = [
  [560, 750], [765, 748], [1050, 742], [1300, 748], [1420, 748], [1560, 540],
];

function pointAlong(pts: Pt[], progress: number): Pt {
  const p = Math.max(0, Math.min(1, progress));
  const segCount = pts.length - 1;
  const segF = p * segCount;
  const segI = Math.min(segCount - 1, Math.floor(segF));
  const localT = segF - segI;
  const [x1, y1] = pts[segI];
  const [x2, y2] = pts[segI + 1];
  return [x1 + (x2 - x1) * localT, y1 + (y2 - y1) * localT];
}

const SIGNALS = [
  { key: "appareil", ...G.signalAppareil, pts: APPAREIL_PTS },
  { key: "lieu", ...G.signalLieu, pts: LIEU_PTS },
  { key: "historique", ...G.signalHistorique, pts: HISTORIQUE_PTS },
  { key: "comportement", ...G.signalComportement, pts: COMPORTEMENT_PTS },
];

const STAGGER = 0.35; // secondes entre chaque ligne
const DRAW_ON_DUR = 0.9; // duree du trace de chaque ligne
const T_FIRST_LINE = 0.6; // la 1ere ligne commence a se tracer

// Fenetres relatives au panneau (absolu -> relatif = absolu - 15.2s), brief jury §P3 :
//   16.6-21.5s abs -> 1.4-6.3s rel  : signature de mouvement continue par ligne.
//   21.5-24.5s abs -> 6.3-9.3s rel  : extraction (pulse qui avance vers le noeud).
//   24.5-27.2s abs -> 9.3-12.0s rel : convergence + score par paliers.
//   27.2-28.7s abs -> 12.0-13.5s rel: decision stable mais vivante.
const T_VIE_CONTINUE = 1.4;
const T_EXTRACTION = 6.3;
const T_CONVERGENCE = 9.3;
const T_SCORE_START = 9.5;
const T_SCORE_LOCK = 12.0;
// Panneau se termine a 13.5s relatif (28.7s absolu) -- au-dela de T_SCORE_LOCK tout reste actif
// (ringBreathe, lignes en pleine opacite) jusqu'a la transition vers P4, aucune fenetre a coder.

// Paliers du score (brief GPT repris tel quel) : 4 -> 9 -> 14 -> 18, un par pulse qui arrive.
const SCORE_STEPS = [4, 9, 14, 18];
const SCORE_STEP_DUR = (T_SCORE_LOCK - T_SCORE_START) / SCORE_STEPS.length;

export const P3QuatreSignaux: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Score par paliers : chaque pulse d'extraction qui arrive au noeud fait sauter la valeur d'un
  // cran (pas d'interpolation continue entre paliers -- un compteur qui "tick", comme un vrai
  // systeme qui accumule des signaux, pas une jauge qui glisse).
  let scoreValue = 0;
  for (let i = 0; i < SCORE_STEPS.length; i++) {
    const stepStart = T_SCORE_START + i * SCORE_STEP_DUR;
    if (t >= stepStart) scoreValue = SCORE_STEPS[i];
  }
  // Pulse de "tick" a chaque palier -- petit scale-bump sur le chiffre au moment exact du saut.
  let scoreBump = 1;
  for (let i = 0; i < SCORE_STEPS.length; i++) {
    const stepStart = T_SCORE_START + i * SCORE_STEP_DUR;
    const sinceStep = t - stepStart;
    if (sinceStep >= 0 && sinceStep < 0.35) {
      scoreBump = interpolate(sinceStep, [0, 0.12, 0.35], [1, 1.22, 1], {
        ...clamp,
        easing: (x) => 1 - Math.pow(1 - x, 2),
      });
    }
  }

  const scoreScale = spring({
    frame: frame - T_SCORE_START * fps,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const scoreOpacity = interpolate(t, [T_SCORE_START, T_SCORE_START + 0.2], [0, 1], clamp);

  // Anneau qui respire legerement une fois le score verrouille (12.0 -> 13.5s, brief : "le score
  // se verrouille, anneau respire legerement, les 4 lignes continuent de vivre en fond faible").
  const ringBreathe = t >= T_SCORE_LOCK ? 1 + Math.sin((t - T_SCORE_LOCK) * (Math.PI * 2) / 1.6) * 0.02 : 1;

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
        <Raw body={G.fondStructure} />
        <Raw body={G.grilleMesure} />

        {SIGNALS.map((sig, i) => {
          const tStart = T_FIRST_LINE + i * STAGGER;
          const drawProgress = interpolate(t, [tStart, tStart + DRAW_ON_DUR], [0, 1], clamp);
          const revealWidth = interpolate(drawProgress, [0, 1], [0, LINE_X_END - LINE_X_START + 40]);
          const opacity = interpolate(t, [tStart, tStart + 0.15], [0, 1], clamp);
          // Le label s'efface juste avant que la convergence ne commence a bouger la ligne.
          const labelOpacity = opacity * interpolate(t, [T_CONVERGENCE - 0.5, T_CONVERGENCE - 0.2], [1, 0], clamp);
          const clipPath = `inset(0 ${Math.max(0, 1920 - LINE_X_START - revealWidth)}px 0 0)`;

          const lineDrawn = drawProgress >= 1;
          // Apres la fin du fond avant la convergence : la ligne continue de vivre. Chaque
          // signal a sa propre frequence/texture (registre "personnalite distincte", brief Grok).
          const lifeActive = lineDrawn && t < T_CONVERGENCE;
          const lifeT = lifeActive ? t - (tStart + DRAW_ON_DUR) : 0;

          // COMPORTEMENT : micro-deformation continue -- translateY sinusoidal + un 2e harmonique
          // plus rapide pour un rendu organique, jamais une onde pure repetitive.
          const organicWobble =
            sig.key === "comportement" && lifeActive
              ? Math.sin(lifeT * (Math.PI * 2) / 1.3) * 3.5 + Math.sin(lifeT * (Math.PI * 2) / 0.55) * 1.2
              : 0;

          return (
            <React.Fragment key={sig.key}>
              <Raw body={sig.label} opacity={labelOpacity} />
              {/* Les path convergent DEJA nativement vers y=540 dans leur propre geometrie —
                  aucun translateY de convergence a appliquer ici, seulement le reveal du trace
                  (clip-path, garde pour le draw-on initial) + un wobble organique pour COMPORTEMENT. */}
              <Raw
                body={sig.paths}
                opacity={opacity}
                clipPath={clipPath}
                transform={organicWobble !== 0 ? `translate(0, ${organicWobble})` : undefined}
              />

              {/* --- Vie continue par-dessus, une signature distincte par ligne (jamais figee) --- */}

              {sig.key === "appareil" && lifeActive && (
                <AppareilMotifDefilant pts={sig.pts} lifeT={lifeT} />
              )}
              {sig.key === "lieu" && lifeActive && <LieuPointVoyageur pts={sig.pts} lifeT={lifeT} />}
              {sig.key === "historique" && lifeActive && (
                <HistoriqueTicksSequentiels lifeT={lifeT} />
              )}
              {sig.key === "comportement" && lifeActive && (
                <ComportementPulseGlow pts={sig.pts} lifeT={lifeT} wobble={organicWobble} />
              )}

              {/* Extraction (6.3 -> 9.3s rel) : un pulse plus lumineux avance vers le noeud
                  pendant que la courbe de fond (deja tracee) continue de vivre derriere lui. */}
              {t >= T_EXTRACTION && t < T_CONVERGENCE + 0.3 && (
                <ExtractionPulse
                  pts={sig.pts}
                  t={t}
                  tStart={T_EXTRACTION + i * 0.18}
                  tEnd={T_CONVERGENCE + i * 0.05}
                />
              )}
            </React.Fragment>
          );
        })}

        <Raw
          body={G.noeudConvergence}
          opacity={interpolate(t, [T_CONVERGENCE - 0.2, T_CONVERGENCE + 0.1], [0, 1], clamp)}
        />

        <g
          opacity={scoreOpacity}
          transform={`translate(1720, 540) scale(${interpolate(scoreScale, [0, 1], [0.6, 1]) * ringBreathe}) translate(-1720, -540)`}
        >
          <Raw body={scoreFinalSansChiffre} />
          {/* Score dynamique par paliers -- remplace le "18" fige du SVG source. */}
          <g transform={`scale(${scoreBump})`} style={{ transformOrigin: "1720px 540px" }}>
            <text
              x={1720}
              y={565}
              textAnchor="middle"
              fontFamily="Futura, Avenir Next, Century Gothic, Helvetica Neue, Arial, sans-serif"
              fontSize={72}
              fontWeight={500}
              letterSpacing={2}
              fill="none"
              stroke="#00D9FF"
              strokeWidth={6}
              strokeOpacity={0.12}
            >
              {scoreValue}
            </text>
            <text
              x={1720}
              y={565}
              textAnchor="middle"
              fontFamily="Futura, Avenir Next, Century Gothic, Helvetica Neue, Arial, sans-serif"
              fontSize={72}
              fontWeight={500}
              letterSpacing={2}
              fill="none"
              stroke="#00D9FF"
              strokeWidth={3}
              strokeOpacity={0.3}
            >
              {scoreValue}
            </text>
            <text
              x={1720}
              y={565}
              textAnchor="middle"
              fontFamily="Futura, Avenir Next, Century Gothic, Helvetica Neue, Arial, sans-serif"
              fontSize={72}
              fontWeight={500}
              letterSpacing={2}
              fill="#00D9FF"
            >
              {scoreValue}
            </text>
          </g>
          <text
            x={1720}
            y={700}
            textAnchor="middle"
            fontFamily="Futura, Avenir Next, Century Gothic, Helvetica Neue, Arial, sans-serif"
            fontSize={20}
            fontWeight={500}
            letterSpacing={6}
            fill="#F4F1EA"
            fillOpacity={0.75}
          >
            RISK SCORE
          </text>
        </g>

        {/* Tenue vivante finale (12.0 -> 13.5s) : les 4 lignes (deja tracees en pleine opacite,
            aucun fade a zero) restent visibles en fond, le score verrouille respire via
            ringBreathe -- rien ne se fige d'un coup a l'entree de cette derniere fenetre. */}
      </svg>
    </AbsoluteFill>
  );
};

// --- Signatures de mouvement continu, une par ligne ---------------------------------------

// APPAREIL : motif carre qui defile horizontalement en boucle le long du trace (petits reperes
// qui glissent, simulant un flux de donnees actif) + micro-glow qui pulse aux "angles" du signal.
const AppareilMotifDefilant: React.FC<{ pts: Pt[]; lifeT: number }> = ({ pts, lifeT }) => {
  const cycle = 1.6;
  const markers = 5;
  return (
    <>
      {Array.from({ length: markers }).map((_, m) => {
        const phase = m / markers;
        const progress = ((lifeT / cycle + phase) % 1 + 1) % 1;
        const [x, y] = pointAlong(pts, progress);
        const fadeEdge = Math.sin(progress * Math.PI); // s'estompe aux 2 bouts du trace
        return (
          <rect
            key={m}
            x={x - 5}
            y={y - 5}
            width={10}
            height={10}
            fill="#F4F1EA"
            opacity={0.55 * fadeEdge}
            transform={`rotate(45 ${x} ${y})`}
          />
        );
      })}
      {/* micro-glow qui pulse doucement sur le premier segment (l'"angle" le plus proche du label) */}
      <circle
        cx={pts[0][0] + 40}
        cy={pts[0][1]}
        r={7 + Math.sin(lifeT * (Math.PI * 2) / 0.9) * 2}
        fill="#00D9FF"
        opacity={0.25 + Math.sin(lifeT * (Math.PI * 2) / 0.9) * 0.15}
      />
    </>
  );
};

// LIEU : point cyan voyageur qui derive sur la courbe douce, aller-retour perpetuel. Cycle
// raccourci (1.8s vs 3.2s initial) -- le mouvement etait correct mais trop lent pour etre
// perceptible sur une courbe aussi longue (retour visuel : 2 frames a 2s d'ecart se ressemblaient
// trop). Vitesse doublee, laisse une trainee courte pour renforcer la lisibilite du deplacement.
const LieuPointVoyageur: React.FC<{ pts: Pt[]; lifeT: number }> = ({ pts, lifeT }) => {
  const cycle = 1.8;
  const raw = (lifeT % cycle) / cycle;
  const progress = raw < 0.5 ? raw * 2 : 2 - raw * 2;
  const [x, y] = pointAlong(pts, progress);
  const [trailX, trailY] = pointAlong(pts, Math.max(0, progress - 0.04));
  return (
    <g>
      <line x1={trailX} y1={trailY} x2={x} y2={y} stroke="#00D9FF" strokeWidth={4} opacity={0.5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={13} fill="none" stroke="#00D9FF" strokeWidth={1.5} opacity={0.5} />
      <circle cx={x} cy={y} r={6} fill="#F4F1EA" />
    </g>
  );
};

// HISTORIQUE : les ticks (deja dans historique_marqueurs) s'allument successivement en boucle,
// comme un scan qui revisite l'historique en continu.
const HistoriqueTicksSequentiels: React.FC<{ lifeT: number }> = ({ lifeT }) => {
  const tickCount = 10; // 5 paires (anneau + point) mesurees dans le SVG source
  const cycle = 2.0;
  const activeIdx = Math.floor(((lifeT / cycle) % 1) * tickCount);
  return (
    <g>
      {Array.from({ length: tickCount }).map((_, idx) => {
        const dist = Math.min(Math.abs(idx - activeIdx), tickCount - Math.abs(idx - activeIdx));
        const glow = Math.max(0, 1 - dist / 2.2);
        return glow > 0.02 ? (
          <TickHighlight key={idx} idx={idx} glow={glow} />
        ) : null;
      })}
    </g>
  );
};

const TICK_POSITIONS: Pt[] = [
  [620, 610], [720, 610], [820, 610], [920, 610], [1020, 610],
  [1120, 610], [1220, 610], [1400, 585], [1470, 555], [1470, 555],
];

const TickHighlight: React.FC<{ idx: number; glow: number }> = ({ idx, glow }) => {
  const [x, y] = TICK_POSITIONS[Math.min(idx, TICK_POSITIONS.length - 1)];
  return (
    <circle cx={x} cy={y} r={16} fill="none" stroke="#00D9FF" strokeWidth={2} opacity={glow * 0.8} />
  );
};

// COMPORTEMENT : la deformation continue est deja appliquee (organicWobble sur le groupe entier)
// -- ici on ajoute juste un pulse de glow qui accompagne le wobble, pour renforcer la sensation
// "signal vivant" plutot qu'un simple decalage vertical.
const ComportementPulseGlow: React.FC<{ pts: Pt[]; lifeT: number; wobble: number }> = ({ pts, lifeT, wobble }) => {
  const [x, y] = pointAlong(pts, 0.55);
  const pulse = 0.5 + Math.sin(lifeT * (Math.PI * 2) / 0.65) * 0.5;
  return (
    <circle cx={x} cy={y + wobble} r={10 + pulse * 4} fill="#F4F1EA" opacity={0.15 + pulse * 0.25} />
  );
};

// Extraction : un pulse plus lumineux voyage de la fin du trace visible jusqu'au noeud de
// convergence, pendant que la ligne de fond (deja tracee) continue de vivre derriere lui.
const ExtractionPulse: React.FC<{ pts: Pt[]; t: number; tStart: number; tEnd: number }> = ({
  pts,
  t,
  tStart,
  tEnd,
}) => {
  const progress = interpolate(t, [tStart, tEnd], [0.75, 1], {
    ...clamp,
    easing: (x) => x * x,
  });
  const opacity = interpolate(t, [tStart, tStart + 0.15, tEnd - 0.1, tEnd], [0, 1, 1, 0.4], clamp);
  if (opacity <= 0) return null;
  const [x, y] = pointAlong(pts, progress);
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={9} fill="#F4F1EA" />
      <circle cx={x} cy={y} r={18} fill="none" stroke="#00D9FF" strokeWidth={2} opacity={0.6} />
    </g>
  );
};
