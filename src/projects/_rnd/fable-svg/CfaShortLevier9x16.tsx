/**
 * CfaShortLevier9x16 — Short 9:16, Scene 3 "Le levier perdu" (franc CFA).
 * RECOMPOSITION SPATIALE de CfaActe5bLevier16x9.tsx (SOURCE INTOUCHABLE, 16:9, mid-form
 * publie). Memes couleurs, memes SFX (memes fichiers, memes volumes). viewBox 0 0 1080 1920,
 * camera statique (aucun zoom/pan du viewBox — tout effet d'echelle passe par un
 * `transform: scale()` sur des groupes internes, jamais sur le viewBox).
 *
 * ⭐⭐ REFONTE STRUCTURELLE (3e passe, retour Aziz+orchestrateur apres visionnage de la v2) :
 * la v2 (crossfade hero plein-cadre -> bandes empilees) produisait une DOUBLE-EXPOSITION
 * confuse pendant ~3s (2 cadres SVG a des echelles differentes visibles simultanement, texte
 * "TAUX DE CHANGE" duplique illisible). Ce n'est PAS ce que "split-screen" signifie dans ce
 * projet. VRAIE REFERENCE = B2Source.tsx (Short Cacao->Chocolat, deja publie) : DEUX COLONNES
 * VERTICALES FIXES, cote a cote, DES LA PREMIERE FRAME. Aucun morph, aucun crossfade, aucune
 * superposition. Chaque volet se DESSINE progressivement dans SA zone, mais la zone elle-meme
 * ne bouge jamais.
 *
 * GRAMMAIRE (reprise de ce fichier) : pupitre GAUCHE (libre/"AJUSTEMENT LIBRE") dans la colonne
 * GAUCHE (x 0-540), pupitre DROIT (CFA/"PARITE FIXE") dans la colonne DROITE (x 540-1080),
 * separes par une ligne verticale fine et PERMANENTE au centre (x=540), visibles et delimites
 * DES LA PREMIERE FRAME. Choregraphie temporelle relative reprise de CfaActe5bLevier16x9.tsx
 * (source 16:9) : les 2 pupitres se tracent EN MEME TEMPS au debut (symetrie visible d'emblee),
 * puis le choc arrive a gauche et le pupitre gauche l'absorbe, puis le choc arrive a droite et
 * bute contre la butee rigide. L'onde de choc de chaque cote reste DANS sa colonne (couloir
 * lateral proche du bord interne, jamais un trait qui traverse x=540).
 *
 * Contrainte stricte gardee : AUCUN rouge, stricte symetrie de taille/echelle/style entre les 2
 * colonnes (meme gabarit, meme police, meme epaisseur) — meme machine, un interrupteur en moins.
 * Verdict final "AUTONOMIE" (sous colonne gauche) / "STABILITE" (sous colonne droite), meme
 * niveau vertical, meme taille de police.
 *
 * Duree : 703 frames (~23.4s @ 30fps), inchangee (grammaire temporelle relative reprise telle
 * quelle, seule la mise en page spatiale change : plus de phase hero/recap/transition — les 2
 * colonnes sont simultanees des le depart, donc le budget temporel de la v2 dedie a la
 * transition est desormais reparti sur la meme sequence gauche->droite qu'a l'origine).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  interpolateColors,
  spring,
  Audio,
  Sequence,
  staticFile,
} from "remotion";

const FADE = 16;
export const CFA_SHORT_LEVIER_FRAMES = 703;

const W = 1080;
const H = 1920;
const HALF = W / 2;

// SFX repris EXACTEMENT (memes fichiers, memes volumes) — recales sur la grammaire split
// 2-colonnes simultanees (plus proche des timings originaux 16:9 que la v2 hero/recap).
const SFX: { src: string; from: number; vol: number; dur?: number }[] = [
  { src: "_shared/sfx/warmap/ink-spread.mp3", from: 15, vol: 0.26 },     // les 2 pupitres se tracent
  { src: "_shared/sfx/warmap/arrow-whoosh.mp3", from: 168, vol: 0.3 },   // l'onde entre (gauche)
  { src: "_shared/sfx/ui/blip-bubble.mp3", from: 206, vol: 0.34 },       // le levier gauche amortit
  { src: "_shared/sfx/ui/vault-lock.mp3", from: 296, vol: 0.55 },        // la soudure (droite)
  { src: "_shared/sfx/ui/plate-pop.mp3", from: 344, vol: 0.34 },         // l'euro s'ancre
  { src: "_shared/sfx/ui/vault-lock.mp3", from: 383, vol: 0.4 },         // la butee (droite)
  { src: "_shared/sfx/ui/stamp-dossier.mp3", from: 462, vol: 0.42 },     // les 2 cartouches
];

// ---- helpers ----
const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const draw = (f: number, start: number, dur: number, len: number): React.CSSProperties => ({
  strokeDasharray: len,
  strokeDashoffset: len * clampI(f, start, start + dur, 1, 0),
});

// butee rigide : 2 tentatives seches qui echouent (PAS un rebond elastique)
const buttee = (f: number, start: number, amp: number) => {
  const t = f - start;
  if (t < 0 || t > 30) return 0;
  if (t < 8) return -amp * Math.sin((Math.PI * t) / 8);
  if (t < 14) return 0;
  if (t < 21) return -amp * 0.72 * Math.sin((Math.PI * (t - 14)) / 7);
  return 0;
};

// ---- GRAMMAIRE TEMPORELLE (frames @30fps sur 703f) — proportions reprises de la source 16:9
// (609f), redimensionnees sur la nouvelle duree (ratio 703/609 ~1.154) pour respirer davantage
// dans le format vertical tout en gardant la MEME sequence causale : trace symetrique -> choc
// gauche absorbe -> soudure/choc droit bute -> verdict. ----
const R = 703 / 609;
const r = (v: number) => Math.round(v * R);
const T = {
  framesDraw: [r(8), r(58)] as const,
  slidersDraw: [r(42), r(96)] as const,
  labels: [r(80), r(120)] as const,
  dials: [r(105), r(148)] as const,
  waveIn: [r(140), r(240)] as const,
  leverDip: r(180),
  weld: [r(247), r(289)] as const,
  chain: [r(269), r(319)] as const,
  euroIn: [r(285), r(325)] as const,
  goldDrain: [r(269), r(335)] as const,
  waveRight: [r(289), r(367)] as const,
  buttee: r(319),
  lockPulse: r(325),
  cartouches: r(385),
  verdict: [r(511), r(559)] as const,
};

const LEN = { frame: 4400, slider: 920, dial: 1000, chain: 470 };

export const CfaShortLevier9x16: React.FC<{ muteNarration?: boolean }> = ({ muteNarration = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const op = 1 - clampI(f, CFA_SHORT_LEVIER_FRAMES - FADE, CFA_SHORT_LEVIER_FRAMES);

  // ---- GEOMETRIE — 2 colonnes FIXES, meme gabarit, jamais deplacees ----
  const GAUCHE_CX = HALF / 2; // 270
  const DROITE_CX = HALF + HALF / 2; // 810
  const PANEL_X0_G = 90, PANEL_X1_G = HALF - 30; // 90-510 (largeur 420)
  const PANEL_X0_D = HALF + 30, PANEL_X1_D = W - 90; // 570-990 (largeur 420)
  const PANEL_Y0 = 210, PANEL_Y1 = 1330; // hauteur 1120, genereuse dans le cadre vertical
  const SLIDER_W = 76;

  // ---- MECANIQUE PARTAGEE pupitre gauche ----
  const dip = spring({ frame: f - T.leverDip, fps, config: { damping: 19, stiffness: 85 }, durationInFrames: 40 });
  const leftLeverAngle = 6 * dip;
  const absorbP = clampI(f, T.leverDip - 6, T.leverDip + 34);
  const absorbOp = 0.55 * Math.sin(Math.PI * absorbP);
  // amplitude reduite vs l'original (78->44) pour tenir dans le couloir horizontal etroit entre
  // le label et la glissiere (colonne 9:16 plus resserree que le 16:9 d'origine).
  const A0 = 44 * clampI(f, T.waveIn[0], T.waveIn[0] + 45);
  const damp = clampI(f, T.leverDip, T.leverDip + 24);
  const AMP = A0 * (1 - 0.92 * damp);
  const cartoucheLeftOp = clampI(f, T.cartouches, T.cartouches + 18);
  // l'onde gauche (meme a amplitude 0) ne doit pas etre visible AVANT que le panneau lui-meme
  // soit trace — sinon un trait vertical plat apparait des la frame 1, avant le cadre.
  const waveIntroOp = clampI(f, T.framesDraw[0], T.framesDraw[0] + 12);

  // ---- PUPITRE DROIT (CFA) ----
  const drain = clampI(f, T.goldDrain[0], T.goldDrain[1]);
  const rightStroke = interpolateColors(drain, [0, 1], ["#f0e8d2", "#9a7d2f"]);
  const weldOp = clampI(f, T.weld[0], T.weld[1]);
  const lockShackle = spring({ frame: f - T.weld[0], fps, config: { damping: 13, stiffness: 200 }, durationInFrames: 18 });
  const lockPulse = f >= T.lockPulse && f <= T.lockPulse + 20
    ? 1 + 0.16 * Math.sin((Math.PI * (f - T.lockPulse)) / 20)
    : 1;
  const euroOp = clampI(f, T.euroIn[0], T.euroIn[1]);
  const euroPop = spring({ frame: f - T.euroIn[0], fps, config: { damping: 12, stiffness: 130 }, durationInFrames: 22 });
  const rightLeverDx = buttee(f, T.buttee, 3);
  const AR = 44 * clampI(f, T.waveRight[0], T.waveRight[0] + 34); // meme amplitude reduite que A0 (symetrie)
  const rightOp = clampI(f, T.waveRight[0], T.waveRight[0] + 12);
  // longueur de trace couvrant TOUTE la largeur HORIZONTALE du panneau droit (~420px + marge
  // d'ondulation) — recalibre pour l'orientation horizontale (fix orchestrateur+Aziz), l'ancien
  // dasharray=1600 etait calibre pour un trait vertical qui n'existe plus.
  const rightDraw = draw(f, T.waveRight[0], 46, 600);
  const chainPulseOn = f > T.chain[1];
  const chainPulseOffset = ((f - T.chain[1]) * 3.2) % 220;
  const cartoucheRightOp = clampI(f, T.cartouches, T.cartouches + 18);
  const verdictOp = clampI(f, T.verdict[0], T.verdict[1]);

  const sliderH = (PANEL_Y1 - PANEL_Y0) * 0.42;
  const sliderTopY = PANEL_Y0 + (PANEL_Y1 - PANEL_Y0) * 0.14;
  const leverY = sliderTopY + sliderH * 0.55;

  // ⭐⭐ Onde de choc — trace HORIZONTAL (comme l'original 16:9 : ligne de base a Y fixe,
  // ondulations verticales de faible amplitude, progressant en X sur la largeur du panneau).
  // Positionnee juste au-dessus de la glissiere (entre le label et le haut de la glissiere),
  // sur TOUTE la largeur interne du panneau — jamais un trait qui descend sur la hauteur.
  const WAVE_Y_G = sliderTopY - 34;
  const WAVE_Y_D = sliderTopY - 34;
  const waveSegG = PANEL_X1_G - PANEL_X0_G; // largeur totale du panneau gauche
  const waveSegD = PANEL_X1_D - PANEL_X0_D; // largeur totale du panneau droit

  // Colonne dediee euro/chaine/cadenas (bloc "soudure en direct") — a DROITE de la glissiere
  // droite, entre son bord (DROITE_CX+38) et le bord droit du panneau (PANEL_X1_D=990), sous
  // le label pour ne jamais le chevaucher.
  const EW_CX = (DROITE_CX + 38 + PANEL_X1_D) / 2; // ~904
  const EW_Y0 = sliderTopY + 30;

  return (
    <AbsoluteFill style={{ background: "#182746", opacity: op }}>
      {!muteNarration && <Audio src={staticFile("_rnd/cfa-nuit1994/beat5b-vo.mp3")} />}
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur ?? 40}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}

      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="l9Grille" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M90 0H0V90" fill="none" stroke="#22345c" strokeWidth="1" />
          </pattern>
        </defs>

        <g id="fond_scene">
          <rect width="1080" height="1920" fill="#182746" />
          <rect width="1080" height="1920" fill="url(#l9Grille)" opacity={clampI(f, T.framesDraw[0], T.framesDraw[1])} />
        </g>

        {/* ================= LIGNE DE SEPARATION VERTICALE — PERMANENTE, DES LA PREMIERE
            FRAME (pattern B2Source). Trace rapidement en tout debut de scene, jamais absente
            ensuite. ================= */}
        <g id="separateur">
          <path
            d={`M${HALF} ${PANEL_Y0 - 40}V${PANEL_Y1 + 170}`}
            fill="none"
            stroke="#8fa2c4"
            strokeWidth={2}
            opacity={0.55 * clampI(f, 0, 18)}
          />
        </g>

        {/* ================= COLONNE GAUCHE — pupitre "AJUSTEMENT LIBRE" (x 0-540, FIXE) ================= */}
        <g id="colonne_gauche">
          <rect x={PANEL_X0_G} y={PANEL_Y0} width={PANEL_X1_G - PANEL_X0_G} height={PANEL_Y1 - PANEL_Y0} rx="20" fill="none" stroke="#8fa2c4" strokeWidth="3" opacity="0.7" style={draw(f, T.framesDraw[0], T.framesDraw[1] - T.framesDraw[0], LEN.frame)} />

          {/* ⭐⭐ FIX ORIENTATION (retour orchestrateur+Aziz) : dans l'original 16:9, l'onde de
              choc est un trace HORIZONTAL (ligne de base a Y fixe, ondulations verticales de
              faible amplitude, progressant en X) — PAS un trait qui descend verticalement sur
              toute la hauteur (bug de la 1re version de cette correction). Ici : ligne de base
              a WAVE_Y_G (niveau du levier), ondulant sur l'AMPLITUDE en Y (A0/AMP), progressant
              sur la largeur du panneau (PANEL_X0_G -> PANEL_X1_G). Le SEGMENT D'ENTREE (avant le
              levier, cote gauche du panneau) garde l'amplitude PLEINE A0 — le choc arrive
              intact. Le SEGMENT APRES le contact (majeure partie visible, jusqu'au bord droit
              du panneau) utilise AMP (amortie) — l'aplatissement doit dominer visuellement. */}
          <path d={`M${PANEL_X0_G} ${WAVE_Y_G}C${PANEL_X0_G + waveSegG * 0.13} ${WAVE_Y_G - A0 * 0.82} ${PANEL_X0_G + waveSegG * 0.27} ${WAVE_Y_G + A0 * 0.82} ${PANEL_X0_G + waveSegG * 0.4} ${WAVE_Y_G}C${PANEL_X0_G + waveSegG * 0.5} ${WAVE_Y_G - AMP * 0.82} ${PANEL_X0_G + waveSegG * 0.6} ${WAVE_Y_G + AMP * 0.82} ${PANEL_X0_G + waveSegG * 0.7} ${WAVE_Y_G}C${PANEL_X0_G + waveSegG * 0.8} ${WAVE_Y_G - AMP * 0.82} ${PANEL_X0_G + waveSegG * 0.9} ${WAVE_Y_G + AMP * 0.82} ${PANEL_X0_G + waveSegG} ${WAVE_Y_G}`}
            fill="none" stroke="#c9702e" strokeWidth={5} strokeLinecap="round" opacity={0.28 * waveIntroOp} />
          <path d={`M${PANEL_X0_G} ${WAVE_Y_G - 10}C${PANEL_X0_G + waveSegG * 0.13} ${WAVE_Y_G - 10 - A0} ${PANEL_X0_G + waveSegG * 0.27} ${WAVE_Y_G - 10 + A0} ${PANEL_X0_G + waveSegG * 0.4} ${WAVE_Y_G - 10}C${PANEL_X0_G + waveSegG * 0.5} ${WAVE_Y_G - 10 - AMP} ${PANEL_X0_G + waveSegG * 0.6} ${WAVE_Y_G - 10 + AMP} ${PANEL_X0_G + waveSegG * 0.7} ${WAVE_Y_G - 10}C${PANEL_X0_G + waveSegG * 0.8} ${WAVE_Y_G - 10 - AMP} ${PANEL_X0_G + waveSegG * 0.9} ${WAVE_Y_G - 10 + AMP} ${PANEL_X0_G + waveSegG} ${WAVE_Y_G - 10}`}
            fill="none" stroke="#c9702e" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={waveIntroOp} />

          <text x={GAUCHE_CX} y={PANEL_Y0 + (PANEL_Y1 - PANEL_Y0) * 0.06} fill="#8fa2c4" fontFamily="monospace" fontSize={24} textAnchor="middle" letterSpacing="2" opacity={clampI(f, T.labels[0], T.labels[1])}>TAUX DE CHANGE</text>

          <rect x={GAUCHE_CX - SLIDER_W / 2} y={sliderTopY} width={SLIDER_W} height={sliderH} rx={SLIDER_W / 2} fill="none" stroke="#8fa2c4" strokeWidth={4} style={draw(f, T.slidersDraw[0], T.slidersDraw[1] - T.slidersDraw[0], LEN.slider)} />
          <rect x={GAUCHE_CX - SLIDER_W / 2} y={sliderTopY} width={SLIDER_W} height={sliderH} rx={SLIDER_W / 2} fill="none" stroke="#f0e8d2" strokeWidth={14} opacity={absorbOp * 0.4} />
          <rect x={GAUCHE_CX - SLIDER_W / 2} y={sliderTopY} width={SLIDER_W} height={sliderH} rx={SLIDER_W / 2} fill="none" stroke="#f0e8d2" strokeWidth={4} opacity={absorbOp} />
          <g transform={`translate(0 ${50 * dip}) rotate(${leftLeverAngle} ${GAUCHE_CX} ${leverY})`}>
            <rect x={GAUCHE_CX - SLIDER_W / 2} y={leverY - 19} width={SLIDER_W} height={38} rx={8} fill="#182746" stroke="#f0e8d2" strokeWidth={4} opacity={clampI(f, T.slidersDraw[1] - 10, T.slidersDraw[1] + 24)} />
            <path d={`M${GAUCHE_CX} ${leverY}L${GAUCHE_CX - SLIDER_W * 0.83} ${leverY - sliderH * 0.43}`} fill="none" stroke="#f0e8d2" strokeWidth={8} strokeLinecap="round" opacity={clampI(f, T.slidersDraw[1] - 10, T.slidersDraw[1] + 24)} />
            <rect x={GAUCHE_CX - SLIDER_W * 1.1} y={leverY - sliderH * 0.43 - 13} width={76} height={26} rx={13} fill="#182746" stroke="#f0e8d2" strokeWidth={5} transform={`rotate(-19 ${GAUCHE_CX - SLIDER_W * 0.83} ${leverY - sliderH * 0.43})`} opacity={clampI(f, T.slidersDraw[1], T.slidersDraw[1] + 30)} />
          </g>

          <g opacity={clampI(f, T.dials[0], T.dials[1])}>
            <rect x={GAUCHE_CX - 170} y={PANEL_Y1 - 95} width={340} height={110} rx={12} fill="none" stroke="#8fa2c4" strokeWidth={3} />
            <path d={`M${GAUCHE_CX - 148} ${PANEL_Y1 - 46}C${GAUCHE_CX - 124} ${PANEL_Y1 - 86} ${GAUCHE_CX - 100} ${PANEL_Y1 - 2} ${GAUCHE_CX - 76} ${PANEL_Y1 - 46}S${GAUCHE_CX - 30} ${PANEL_Y1 - 86} ${GAUCHE_CX - 6} ${PANEL_Y1 - 46}C${GAUCHE_CX + 18} ${PANEL_Y1 - 32} ${GAUCHE_CX + 42} ${PANEL_Y1 - 40} ${GAUCHE_CX + 66} ${PANEL_Y1 - 46}C${GAUCHE_CX + 94} ${PANEL_Y1 - 48} ${GAUCHE_CX + 122} ${PANEL_Y1 - 46} ${GAUCHE_CX + 148} ${PANEL_Y1 - 46}`} fill="none" stroke="#f0e8d2" strokeWidth={5} strokeLinecap="round" style={draw(f, T.leverDip - 10, 60, LEN.dial)} />
            <path d={`M${GAUCHE_CX - 148} ${PANEL_Y1 - 20}H${GAUCHE_CX + 148}`} fill="none" stroke="#22345c" strokeWidth={3} />
          </g>

          <g opacity={cartoucheLeftOp}>
            <rect x={GAUCHE_CX - 170} y={PANEL_Y1 + 14} width={340} height={38} rx={19} fill="#182746" stroke="#c8a951" strokeWidth={2} />
            <text x={GAUCHE_CX} y={PANEL_Y1 + 40} fill="#c8a951" fontFamily="monospace" fontSize={18} textAnchor="middle" letterSpacing="2">AJUSTEMENT LIBRE</text>
          </g>
        </g>

        {/* ================= COLONNE DROITE — pupitre "PARITE FIXE" (x 540-1080, FIXE) ================= */}
        <g id="colonne_droite">
          <rect x={PANEL_X0_D} y={PANEL_Y0} width={PANEL_X1_D - PANEL_X0_D} height={PANEL_Y1 - PANEL_Y0} rx="20" fill="none" stroke="#8fa2c4" strokeWidth="3" opacity="0.7" style={draw(f, T.framesDraw[0], T.framesDraw[1] - T.framesDraw[0], LEN.frame)} />

          {/* ⭐⭐ ONDE DE CHOC droite — MEME orientation HORIZONTALE que la gauche (fix
              orchestrateur+Aziz), ligne de base a WAVE_Y_D, amplitude AR PLEINE et CONSTANTE
              sur toute la largeur du panneau (rien n'a amorti, contrairement a la gauche). */}
          <g opacity={rightOp} style={rightDraw}>
            <path d={`M${PANEL_X0_D} ${WAVE_Y_D}C${PANEL_X0_D + waveSegD * 0.13} ${WAVE_Y_D - AR * 0.82} ${PANEL_X0_D + waveSegD * 0.27} ${WAVE_Y_D + AR * 0.82} ${PANEL_X0_D + waveSegD * 0.4} ${WAVE_Y_D}S${PANEL_X0_D + waveSegD * 0.67} ${WAVE_Y_D - AR * 0.82} ${PANEL_X0_D + waveSegD * 0.8} ${WAVE_Y_D}S${PANEL_X0_D + waveSegD} ${WAVE_Y_D + AR * 0.82} ${PANEL_X0_D + waveSegD} ${WAVE_Y_D}`} fill="none" stroke="#c9702e" strokeWidth="5" strokeLinecap="round" opacity={0.28} />
            <path d={`M${PANEL_X0_D} ${WAVE_Y_D - 10}C${PANEL_X0_D + waveSegD * 0.13} ${WAVE_Y_D - 10 - AR} ${PANEL_X0_D + waveSegD * 0.27} ${WAVE_Y_D - 10 + AR} ${PANEL_X0_D + waveSegD * 0.4} ${WAVE_Y_D - 10}S${PANEL_X0_D + waveSegD * 0.67} ${WAVE_Y_D - 10 - AR} ${PANEL_X0_D + waveSegD * 0.8} ${WAVE_Y_D - 10}S${PANEL_X0_D + waveSegD} ${WAVE_Y_D - 10 + AR} ${PANEL_X0_D + waveSegD} ${WAVE_Y_D - 10}`} fill="none" stroke="#c9702e" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          <text x={DROITE_CX} y={PANEL_Y0 + (PANEL_Y1 - PANEL_Y0) * 0.06} fill="#8fa2c4" fontFamily="monospace" fontSize={24} textAnchor="middle" letterSpacing="2" opacity={clampI(f, T.labels[0], T.labels[1])}>TAUX DE CHANGE</text>

          {/* glissiere LISSE : aucun cran, nulle part ou aller */}
          <rect x={DROITE_CX - SLIDER_W / 2} y={sliderTopY} width={SLIDER_W} height={sliderH} rx={SLIDER_W / 2} fill="none" stroke="#8fa2c4" strokeWidth={4} style={draw(f, T.slidersDraw[0], T.slidersDraw[1] - T.slidersDraw[0], LEN.slider)} />
          <g transform={`translate(${rightLeverDx} 0)`}>
            <rect x={DROITE_CX - SLIDER_W / 2} y={leverY - 19} width={SLIDER_W} height={38} rx={8} fill="#182746" stroke={rightStroke} strokeWidth={4} opacity={clampI(f, T.slidersDraw[1] - 10, T.slidersDraw[1] + 24)} />
            <path d={`M${DROITE_CX} ${leverY}V${leverY - sliderH * 0.55}`} fill="none" stroke={rightStroke} strokeWidth={8} strokeLinecap="round" opacity={clampI(f, T.slidersDraw[1] - 10, T.slidersDraw[1] + 24)} />
            <rect x={DROITE_CX - 38} y={leverY - sliderH * 0.55 - 13} width={76} height={26} rx={13} fill="#182746" stroke={rightStroke} strokeWidth={5} opacity={clampI(f, T.slidersDraw[1], T.slidersDraw[1] + 30)} />
          </g>

          {/* LA SOUDURE EN DIRECT — bloc narratif propre au pupitre droit, dans SA colonne.
              Colonne dediee ENTRE la glissiere (bord droit ~DROITE_CX+38) et le bord droit du
              panneau (PANEL_X1_D), sous le label (jamais de chevauchement texte, corrige au
              1er rendu de cette refonte ou l'euro empietait sur "TAUX DE CHANGE"). */}
          <g id="medaillon_euro" opacity={euroOp} transform={`translate(${EW_CX} ${EW_Y0}) scale(${0.75 + 0.25 * euroPop}) translate(${-EW_CX} ${-EW_Y0})`}>
            <circle cx={EW_CX} cy={EW_Y0} r="24" fill="#182746" stroke="#9a7d2f" strokeWidth="3" />
            <text x={EW_CX} y={EW_Y0 + 9} fill="#9a7d2f" fontFamily="serif" fontSize="26" textAnchor="middle">&#8364;</text>
          </g>
          <g id="chaine">
            <path d={`M${EW_CX} ${EW_Y0 + 26}V${EW_Y0 + 68}`} fill="none" stroke="#8fa2c4" strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" style={draw(f, T.chain[0], T.chain[1] - T.chain[0], 42)} />
            {chainPulseOn && (
              <path d={`M${EW_CX} ${EW_Y0 + 26}V${EW_Y0 + 68}`} fill="none" stroke="#c8a951" strokeWidth="3.5" strokeLinecap="round" opacity={0.75} strokeDasharray="10 40" strokeDashoffset={chainPulseOffset} />
            )}
          </g>
          <g id="cadenas" opacity={weldOp} transform={`translate(${EW_CX} ${EW_Y0 + 100}) scale(${lockPulse}) translate(${-EW_CX} ${-(EW_Y0 + 100)})`}>
            <path d={`M${EW_CX - 19} ${EW_Y0 + 74}V${EW_Y0 + 60}C${EW_CX - 19} ${EW_Y0 + 36} ${EW_CX + 19} ${EW_Y0 + 36} ${EW_CX + 19} ${EW_Y0 + 60}V${EW_Y0 + 74}`} fill="none" stroke="#8fa2c4" strokeWidth="4" strokeLinecap="round" transform={`translate(0 ${-14 * (1 - lockShackle)})`} />
            <rect x={EW_CX - 31} y={EW_Y0 + 74} width="62" height="52" rx="7" fill="#182746" stroke="#8fa2c4" strokeWidth="4" />
            <circle cx={EW_CX} cy={EW_Y0 + 94} r="6" fill="none" stroke="#8fa2c4" strokeWidth="3" />
            <path d={`M${EW_CX} ${EW_Y0 + 100}V${EW_Y0 + 112}`} fill="none" stroke="#8fa2c4" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g id="soudures" opacity={clampI(f, T.weld[0] + 14, T.weld[1] + 10)}>
            <path d={`M${EW_CX - 42} ${EW_Y0 + 80}Q${EW_CX - 52} ${EW_Y0 + 86} ${EW_CX - 42} ${EW_Y0 + 92}M${EW_CX - 42} ${EW_Y0 + 98}Q${EW_CX - 50} ${EW_Y0 + 103} ${EW_CX - 42} ${EW_Y0 + 109}M${EW_CX - 38} ${EW_Y0 + 118}Q${EW_CX - 33} ${EW_Y0 + 126} ${EW_CX - 27} ${EW_Y0 + 118}`} fill="none" stroke="#9a7d2f" strokeWidth="3" strokeLinecap="round" />
          </g>

          <g id="cadran_droit" opacity={clampI(f, T.dials[0], T.dials[1])}>
            <rect x={DROITE_CX - 170} y={PANEL_Y1 - 95} width={340} height={110} rx="12" fill="none" stroke="#8fa2c4" strokeWidth="3" />
            {/* ligne PLATE : rien n'a ete absorbe, le choc est passe en entier */}
            <path d={`M${DROITE_CX - 148}${" "}${PANEL_Y1 - 46}H${DROITE_CX + 148}`} fill="none" stroke="#8fa2c4" strokeWidth="5" strokeLinecap="round" style={draw(f, T.buttee - 10, 60, 340)} />
            <path d={`M${DROITE_CX - 148} ${PANEL_Y1 - 20}H${DROITE_CX + 148}`} fill="none" stroke="#22345c" strokeWidth="3" />
          </g>

          <g id="cartouche_droit" opacity={cartoucheRightOp}>
            <rect x={DROITE_CX - 170} y={PANEL_Y1 + 14} width={340} height={38} rx="19" fill="#182746" stroke="#c8a951" strokeWidth="2" />
            <text x={DROITE_CX} y={PANEL_Y1 + 40} fill="#c8a951" fontFamily="monospace" fontSize="18" textAnchor="middle" letterSpacing="2">PARITÉ FIXE</text>
          </g>
        </g>

        {/* VERDICT — chacun sous SA colonne, meme niveau vertical, meme taille de police, stricte
            symetrie. Climax tenu : apparait tard et reste jusqu'a la fin. */}
        <g id="verdict" opacity={verdictOp} fontFamily="monospace" textAnchor="middle">
          <text x={GAUCHE_CX} y={PANEL_Y1 + 110} fill="#f0e8d2" fontSize="30" letterSpacing="5">AUTONOMIE</text>
          <text x={DROITE_CX} y={PANEL_Y1 + 110} fill="#c8a951" fontSize="30" letterSpacing="5">STABILITÉ</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CfaShortLevier9x16;
