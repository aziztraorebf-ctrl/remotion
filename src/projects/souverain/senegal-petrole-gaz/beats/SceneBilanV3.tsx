/**
 * SceneBilanV3 — "Bilan : de zero a exportateur" (terrain final), Senegal Petrole & Gaz V3-REFONTE, scene 6.
 *
 * Ecrite DEPUIS LA VOIX (forced-align V3, out/.../_audio-v3/forced-align-v3.json).
 * Segment audio = 344.46s -> 407.72s de narration-v3-VALIDEE.mp3 (~63.26s mesure ffprobe).
 *   - Debut 344.46s : juste apres "...le Senegal." (fin sc.5). 1er mot utile "En a peine dix mois" @345.10s.
 *   - Fin 407.72s : apres "Maintenant." (@406.78s) + souffle. La phrase "Revenons a ce qu'on disait..."
 *     (@408.08s) est l'AMORCE de la scene 7 — coupee ici (raccord net, meme logique que sc.4/sc.5).
 * mp3 dedie extrait : public/.../audio/narration-v3-scene6.mp3 (startFrom=0, comme sc.5). Choix : un cut
 *   frame-accurate sans risque de derive sur un startFrom dans le gros fichier, + fade in/out propres.
 *
 * INTENTION (1 verbe) : PESER. Le Senegal est passe de zero a exportateur en 10 mois. On met dans la
 * BALANCE ce qui penche du bon cote (les garde-fous : FONSIS, ITIE, LOI) et ce qui pese contre (les
 * fragilites : DETTE, CONTRATS, YAKAAR). Le verdict : ni triomphe ni catastrophe — un EQUILIBRE fragile,
 * et le moment ou tout se joue. "C'est maintenant."
 *
 * CONCEPT v2 (storyboard Direction A valide + retours Aziz sur v1) : DONUT D'INTRO -> LA BALANCE -> MONUMENT.
 * Vue frontale 16:9 HORIZONTALE.
 *   INTRO (0->~20s) : un DONUT PREMIUM a 2 arcs concentriques centre au futur pivot. Arc OR exterieur =
 *     Sangomar (count-up 0->3.0M barils sur "trois millions de barils"). Arc interieur = champ gazier
 *     (0->11e cargaison). Tick "CAP 100k b/j" qui s'illumine sur l'arc exterieur. Vire les 3 lignes de texte
 *     brut de la v1 (occasion manquee de double animation, retour Aziz). MORPH : le donut se contracte et
 *     DEVIENT le pivot central de la balance (continuite d'objet, zero cut).
 *   Etat 2 : 3 blocs OR tombent un par un dans le plateau GAUCHE (FONSIS -> ITIE -> LOI). Fleau penche a gauche.
 *   Etat 3 : 3 blocs ROUGES tombent dans le plateau DROIT (DETTE -> CONTRATS -> YAKAAR). Fleau penche a droite.
 *   Etat 4 (MONUMENT, retour Aziz : la fin ne doit plus etre figee, et silhouettes Norvege/Botswana RETIREES
 *     car illisibles/confuses) : a "ils ont ecrit leurs regles", un LISERE OR lumineux parcourt toute la
 *     structure (fleau, chaines, plateaux) via strokeDashoffset — le clic d'equilibre se VOIT enfin (ca se
 *     verrouille). A "C'est maintenant", le HALO OR central s'etend depuis le pivot et fige la balance en
 *     emblème dore. Phrase finale BebasNeue blanc massif : "LE SENEGAL EST EXACTEMENT DANS CE MOMENT.
 *     MAINTENANT." Fade out sur "MAINTENANT" seul (mais plus seul a porter la fin : le monument la soutient).
 *
 * Registre : navy #16213a + grille or (= fond sc.1b/3/4). Remotion pur + SVG, 100% code (0 asset).
 * Reutilise la grammaire de SceneDetteV3/SceneContratV3 : GridBackground, gradients, count-up, spring,
 * SFX Sequence, musique continuite (startFrom cale sur la fin de la piste sc.5).
 *
 * Rouge #ef4444 = SEMANTIQUE (fragilite, meme rouge que la lame Woodside sc.3 / la dette sc.4). Voir
 * .review-override.md si une review demande de le retirer (faux positif).
 *
 * Objet inerte (les blocs) : ils TOMBENT par gravite + spring d'atterrissage. Ils NE GLISSENT PAS lateralement.
 */
import React from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { Landmark, Gavel, FileText, TrendingDown, Scale, AlertTriangle } from "lucide-react";

const { fontFamily: BEBAS } = loadBebas();

const NAVY = "#16213a", GOLD = "#c8a951", GOLD_HI = "#e8c472", IVORY = "#f2efe6";
const STEEL_LO = "#1a1f28";
const RED = "#ef4444";       // fragilite (semantique — meme rouge que sc.3 lame / sc.4 dette)
const RED_LO = "#b3221b";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

// ── frames (= (t_abs - 344.46) * 30), cales sur forced-align-v3.json ─────────────
const F_START     = 19;    // "En a peine dix mois" (10 MOIS apparait)
const F_ZERO      = 91;    // "zero"
const F_EXPORT    = 110;   // "exportateur"
const F_CHIFFRES  = 207;   // "les chiffres tombent" (la data brute s'inscrit)
const F_MAI       = 251;   // "rien qu'en mai 2026"
const F_SANGOMAR  = 293;   // "Sangomar a expedie"
const F_BARILS    = 340;   // "trois millions de barils" (count-up demarre)
const F_BARILS_END = 391;  // fin du mot "barils"
const F_GAZIER    = 397;   // "Le champ gazier" (11e cargaison s'inscrit)
const F_CARGAISON = 466;   // "onzieme cargaison"
const F_GARDEFOUS = 614;   // "de vrais garde-fous" (annonce plateau gauche)
// ── morph donut -> pivot de la balance ──
const F_MORPH_IN  = 540;   // le donut commence a se contracter vers le pivot (apres "L'argent coule, vraiment")
const F_MORPH_OUT = 606;   // le donut a fini de se reduire au pivot ; la balance est en place pour F_GARDEFOUS
const PIVOT_X = 960, PIVOT_Y = 470; // sommet du mat = pivot du fleau = centre du donut (continuite)
const F_FONSIS    = 655;   // "Le FONSIS" (bloc OR 1 tombe a gauche)
const F_ITIE      = 689;   // "L'ITIE" (bloc OR 2)
const F_LOI       = 893;   // "et une loi" (bloc OR 3)
const F_FRAGILITES = 1050; // "Mais... de vraies fragilites" (annonce plateau droit)
const F_DETTE     = 1133;  // "Une dette lourde" (bloc ROUGE 1 tombe a droite)
const F_CONTRATS  = 1176;  // "Des contrats encore opaques" (bloc ROUGE 2)
const F_YAKAAR    = 1237;  // "Un troisieme champ" (bloc ROUGE 3)
// (F_NORVEGE retire : les silhouettes Norvege/Botswana ont ete supprimees v2 — illisibles/confuses, retour Aziz)
const F_REGLES    = 1475;  // "ils ont ecrit leurs regles" (le fleau se stabilise + LE LISERE OR parcourt la structure)
// (reperes voix "le moment le plus dur"@1613 / "Le Senegal est exactement"@1775 / "dans ce moment-la"@1825 :
//  plus de texte a l'ecran a ces instants depuis l'epure v4 — constantes retirees.)
const F_MAINTENANT = 1853; // "Maintenant" (halo or central inonde la balance — monument)
const END         = 1898;  // 63.26s @30 — coupe nette apres "Maintenant.", avant l'amorce sc.7

export const SceneBilanV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {/* Narration : mp3 dedie (cut frame-accurate 344.46->407.72) — startFrom=0 (meme logique sc.5). */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-scene6.mp3")} />
      {/* Musique de fond — CONTINUITE sc.5 : la sc.5 a joue music-A startFrom=45.4s sur ~56.5s, donc la piste
          en est a ~101.9s. On reprend a 101.9s pour ENCHAINER sans coupure. fade-IN court (raccord doux) +
          fade-OUT 3.5s a la fin (atterrissage sur "MAINTENANT"). volume bas pour laisser la voix devant. */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={Math.round(101.9 * 30)}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 30], [0.6, 1], clamp);
          const fadeStart = END - 105;
          const fadeOut = f >= fadeStart ? Math.max(0, 1 - (f - fadeStart) / 105) : 1;
          return 0.06 * fadeIn * fadeOut;
        }}
      />
      <SceneSFX />
      <GridBackground />
      <DonutIntro />
      <BalanceViz />
      <SourceTag />
      {/* Epure texte v4 (regle Aziz) : "10 MOIS", "LE SENEGAL EST EXACTEMENT...", "MAINTENANT." RETIRES —
          la voix les porte deja. L'ecran garde le graphisme pur (donut, balance, monument or) sans ces textes.
          Le composant Title et FinalVerdict ne sont plus rendus. */}
    </AbsoluteFill>
  );
};

// ── Cartouche de SOURCE discret (rigueur factuelle) — bas-gauche, fade in/out ────
// Apparait sur la fenetre "garde-fous -> fragilites" (faits institutionnels FONSIS/ITIE/loi).
// Source verifiee fact-sheet : ITIE Senegal (cadre legal/transparence) + FONSIS (fonds souverain).
const SourceTag: React.FC = () => {
  const frame = useCurrentFrame();
  const IN = F_GARDEFOUS;          // 614 — "de vrais garde-fous"
  const OUT = F_YAKAAR + 90;       // ~1327 — apres l'enonce des fragilites
  const op = interpolate(frame, [IN, IN + 18, OUT - 24, OUT], [0, 1, 1, 0], clamp);
  if (op <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 64, bottom: 54,
      display: "flex", alignItems: "center", gap: 10, opacity: op * 0.62,
    }}>
      <div style={{ width: 22, height: 2, backgroundColor: GOLD }} />
      <span style={{
        fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.2,
        color: IVORY, textTransform: "uppercase",
      }}>
        ITIE Sénégal · FONSIS
      </span>
    </div>
  );
};

// ── Fond navy + grille or qui respire (repris VERBATIM de SceneDetteV3) ──────────
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const breath = 0.08 + 0.03 * Math.sin(frame / 60);
  const shiftY = (frame * 0.12) % 60;
  return (
    <AbsoluteFill style={{
      backgroundColor: NAVY,
      backgroundImage:
        `linear-gradient(rgba(200,169,81,${breath}) 1px, transparent 1px),` +
        `linear-gradient(90deg, rgba(200,169,81,${breath}) 1px, transparent 1px)`,
      backgroundSize: "60px 60px, 60px 60px",
      backgroundPosition: `0px ${shiftY}px, 0px 0px`,
    }} />
  );
};

// (Title "10 MOIS" RETIRE v4 — epure texte Aziz : la voix dit "en a peine dix mois", redondant a l'ecran.)

// ════════════════════════════════════════════════════════════════════════════
//  DonutIntro v3 — INSTRUMENT DE PRECISION (cible storyboard premium).
//  Arc de fond FIN POINTILLE (cadran crante). Arc de donnee OR METAL BROSSE (5 stops) + filet blanc fin.
//  Bout de course = LOSANGE or. POINT LUMINEUX qui court en tete pendant le remplissage. Count-up
//  avec OVERSHOOT elastique (3.2M -> 3.0M). Grand (R_OUT ~290px), chiffre central massif, labels autour.
//  Au MORPH, le donut se contracte au pivot (continuite d'objet -> pivot de la balance).
// ════════════════════════════════════════════════════════════════════════════

// helpers geometrie d'arc (repere svg-local, 0deg = est, sens horaire ; on ouvre l'arc en bas)
const ARC_START_DEG = 135;     // debut de l'arc (bas-gauche)
const ARC_SWEEP_DEG = 270;     // 270deg de course (ouvert de 90deg en bas)
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
};
// path d'un arc de cercle (rayon r) de progress p (0..1) le long de la course
const arcPath = (r: number, p: number): string => {
  if (p <= 0.0001) return "";
  const a0 = ARC_START_DEG;
  const a1 = ARC_START_DEG + ARC_SWEEP_DEG * Math.min(1, p);
  const s = polar(r, a0), e = polar(r, a1);
  const large = ARC_SWEEP_DEG * Math.min(1, p) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

const DonutIntro: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > F_MORPH_OUT + 4) return null; // le donut a fini de se reduire au pivot — la balance prend le relais

  const R_OUT = 252, R_IN = 178, STROKE = 16, STROKE_IN = 11;

  // remplissage Sangomar PROGRESSIF DES LE DEBUT (zero temps mort, retour Aziz v3) : l'arc se trace
  // LENTEMENT et en CONTINU de F_START jusqu'a ~F_BARILS (la voix "trois millions de barils"), ~11s.
  // base = montee douce (ease-out maison via puissance) 0 -> ~3.0M sur toute la duree.
  const fillRaw = interpolate(frame, [F_START, F_BARILS + 6], [0, 1], clamp); // 0->1 lineaire sur ~11s
  const fillEase = 1 - Math.pow(1 - fillRaw, 1.7);                            // ease-out doux (luxe)
  // OVERSHOOT elastique cale sur l'arrivee a 3.0M (rebond a ~3.15M puis retour) — la "vie" a la fin du trace
  const overshoot = spring({ frame: frame - F_BARILS, fps: 30, config: { damping: 8, stiffness: 140, mass: 1 }, durationInFrames: 55 });
  const overBump = frame >= F_BARILS ? Math.max(0, overshoot - 1) : 0;        // partie >1 du spring = le depassement
  const oilP = Math.max(0, fillEase + overBump * 0.18);                       // overshoot ~+0.18 -> ~3.15M de pointe
  const oilFrac = Math.min(1, oilP);   // fraction d'arc (bornee a 1 pour la geometrie)
  const oilVal = oilP * 3.0;           // count-up : monte en continu des le debut, overshoot puis 3.0M
  // remplissage gaz (sans overshoot, plus calme)
  const gasSpring = spring({ frame: frame - (F_GAZIER + 20), fps: 30, config: { damping: 14, stiffness: 100 }, durationInFrames: 60 });
  const gasP = Math.max(0, Math.min(1, gasSpring));
  const gasVal = Math.round(gasP * 11);
  const gasFillFrac = gasP * 0.73; // 11 cargaisons sur un cap implicite -> lecture "en cours"

  // tick "CAP 100k b/j" sur l'arc exterieur (s'illumine, pulse)
  const tickAppear = interpolate(frame, [F_CARGAISON + 30, F_CARGAISON + 55], [0, 1], clamp);
  const tickGlow = 0.4 + 0.35 * Math.sin(frame / 8);

  // point lumineux qui court en tete de l'arc oil pendant le remplissage
  const headDeg = ARC_START_DEG + ARC_SWEEP_DEG * oilFrac;
  const head = polar(R_OUT, headDeg);
  const headOn = oilP > 0.02 && oilP < 1.4; // visible pendant la course
  // losange en bout de course (tip)
  const tip = polar(R_OUT, headDeg);

  // entree (montage initial) + MORPH
  const donutIn = spring({ frame: frame - F_START, fps: 30, config: { damping: 15, stiffness: 110 }, durationInFrames: 28 });
  const introOp = interpolate(donutIn, [0, 1], [0, 1], clamp);
  const morph = interpolate(frame, [F_MORPH_IN, F_MORPH_OUT], [0, 1], clamp);
  const morphScale = interpolate(morph, [0, 1], [1, 0.064], clamp); // se reduit a la taille du chapiteau pivot
  const morphLabelOp = interpolate(frame, [F_MORPH_IN, F_MORPH_IN + 22], [1, 0], clamp);

  // graduations fines du cadran (petits traits radiaux tout autour de la course) — aspect montre de luxe
  const TICKS = 60;
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= TICKS; i++) {
    const deg = ARC_START_DEG + (ARC_SWEEP_DEG * i) / TICKS;
    const major = i % 5 === 0;
    const r0 = R_OUT + STROKE / 2 + 6;
    const r1 = r0 + (major ? 14 : 7);
    const a = polar(r0, deg), b = polar(r1, deg);
    ticks.push(<line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
      stroke={major ? "rgba(200,169,81,0.55)" : "rgba(200,169,81,0.28)"} strokeWidth={major ? 2 : 1} />);
  }

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity: introOp }}>
      <g transform={`translate(${PIVOT_X}, ${PIVOT_Y}) scale(${morphScale})`}>
        {/* graduations cadran crante (disparaissent vite au morph) */}
        <g opacity={morphLabelOp}>{ticks}</g>

        {/* ── arc de fond FIN POINTILLE (cadran crante) ── */}
        <path d={arcPath(R_OUT, 1)} fill="none" stroke="rgba(200,169,81,0.30)" strokeWidth={2.5}
          strokeDasharray="2 5" strokeLinecap="round" />
        <path d={arcPath(R_IN, 1)} fill="none" stroke="rgba(200,169,81,0.24)" strokeWidth={2}
          strokeDasharray="2 5" strokeLinecap="round" />

        {/* ── arc OIL en OR METAL BROSSE (5 stops) + filet blanc fin a 2px d'ecart ── */}
        <path d={arcPath(R_OUT, oilFrac)} fill="none" stroke="url(#oilBrushed)" strokeWidth={STROKE} strokeLinecap="round"
          style={{ filter: oilFrac > 0.98 ? `drop-shadow(0 0 ${6 + 4 * (0.5 + 0.5 * Math.sin(frame / 10))}px ${GOLD})` : undefined }} />
        <path d={arcPath(R_OUT - STROKE / 2 - 2, oilFrac)} fill="none" stroke="rgba(255,251,232,0.55)" strokeWidth={1.4} strokeLinecap="round" />

        {/* ── arc GAS interieur (or clair brosse) ── */}
        <path d={arcPath(R_IN, gasFillFrac)} fill="none" stroke="url(#gasBrushed)" strokeWidth={STROKE_IN} strokeLinecap="round" />

        {/* losange or en bout de course de l'arc oil */}
        {oilFrac > 0.02 && (
          <g transform={`translate(${tip.x}, ${tip.y}) rotate(${headDeg})`}>
            <polygon points={`${STROKE * 0.9},0 0,${STROKE * 0.7} ${-STROKE * 0.9},0 0,${-STROKE * 0.7}`}
              fill="#fff7da" stroke={GOLD_HI} strokeWidth={1.5} />
          </g>
        )}
        {/* point lumineux qui court en tete (guide le regard pendant le remplissage) */}
        {headOn && (
          <circle cx={head.x} cy={head.y} r={8} fill="#fffbe8"
            style={{ filter: `drop-shadow(0 0 9px ${GOLD_HI})` }} />
        )}
        {/* tick CAP 100k (objectif) sur l'arc exterieur, vers la fin de la course */}
        {tickAppear > 0.02 && (() => {
          const cd = ARC_START_DEG + ARC_SWEEP_DEG * 0.94;
          const p = polar(R_OUT, cd);
          return (
            <g opacity={tickAppear} transform={`translate(${p.x}, ${p.y}) rotate(${cd})`}>
              <rect x={-STROKE / 2 - 4} y={-2.5} width={STROKE + 8} height={5} rx={2} fill={IVORY} opacity={0.95} />
              <circle cx={0} cy={0} r={6} fill={GOLD_HI} opacity={tickGlow} />
            </g>
          );
        })()}

        {/* ── centre : grand chiffre barils (massif) + sous-ligne. Disparaissent au morph. ── */}
        <g opacity={morphLabelOp}>
          <text x={0} y={6} textAnchor="middle" fill={GOLD_HI} fontFamily={BEBAS} fontSize={150} letterSpacing="0.01em">
            {oilVal.toFixed(1)}<tspan fontSize={92}>M</tspan>
          </text>
          <text x={0} y={56} textAnchor="middle" fill={IVORY} fontFamily={BEBAS} fontSize={30} letterSpacing="0.22em" opacity={0.82}>
            BARILS · SANGOMAR
          </text>
        </g>
      </g>

      {/* ── labels rejetes AUTOUR de l'arc (hors scale, disparaissent au morph) ── */}
      <g opacity={morphLabelOp}>
        {/* gaz : a droite, aligne sur l'arc interieur */}
        <text x={PIVOT_X} y={PIVOT_Y + R_OUT + 64} textAnchor="middle" fill="rgba(242,239,230,0.72)"
          fontFamily={BEBAS} fontSize={32} letterSpacing="0.16em">
          CHAMP GAZIER · <tspan fill={GOLD_HI}>{gasVal}e</tspan> CARGAISON
        </text>
        <text x={PIVOT_X} y={PIVOT_Y + R_OUT + 104} textAnchor="middle" fill="rgba(242,239,230,0.5)"
          fontFamily={BEBAS} fontSize={26} letterSpacing="0.2em" opacity={tickAppear}>
          CAP 100K B/J · MAI 2026
        </text>
      </g>

      <defs>
        {/* OR METAL BROSSE : 5 stops (ombre -> or -> reflet clair -> or -> ombre) */}
        <linearGradient id="oilBrushed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2c" />
          <stop offset="28%" stopColor={GOLD} />
          <stop offset="50%" stopColor="#f0e0a8" />
          <stop offset="72%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#8a6d2c" />
        </linearGradient>
        <linearGradient id="gasBrushed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8842f" />
          <stop offset="50%" stopColor="#f0e0a8" />
          <stop offset="100%" stopColor="#a8842f" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  BalanceViz — balance frontale or. Fleau pivote selon le poids net (gauche or vs droite rouge).
//  3 blocs OR tombent a gauche (garde-fous), 3 blocs ROUGES tombent a droite (fragilites).
// ════════════════════════════════════════════════════════════════════════════

// definition d'un lingot FLAT PREMIUM qui tombe (rect de face + icone lucide + label dessous)
type LucideCmp = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
type Block = { label: string; at: number; side: -1 | 1; gold: boolean; Icon: LucideCmp };
const LEFT_BLOCKS: Block[] = [
  { label: "FONSIS", at: F_FONSIS, side: -1, gold: true, Icon: Landmark },     // le fonds souverain (institution)
  { label: "ITIE", at: F_ITIE, side: -1, gold: true, Icon: Scale },            // transparence / equite (publication des revenus)
  { label: "LOI", at: F_LOI, side: -1, gold: true, Icon: Gavel },             // contenu local impose par la loi
];
const RIGHT_BLOCKS: Block[] = [
  { label: "DETTE", at: F_DETTE, side: 1, gold: false, Icon: TrendingDown },   // dette lourde
  { label: "CONTRATS", at: F_CONTRATS, side: 1, gold: false, Icon: FileText }, // contrats opaques
  { label: "YAKAAR", at: F_YAKAAR, side: 1, gold: false, Icon: AlertTriangle },// champ a l'avenir incertain
];

const BalanceViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── geometrie de la balance ──
  const pivotX = 960, pivotY = 470;       // sommet du mat = pivot du fleau
  const beamHalf = 560;                    // demi-longueur du fleau
  const panDrop = 188;                     // hauteur des chaines (du bout de fleau au plateau)
  const panR = 150;                        // demi-largeur d'un plateau
  const baseY = 952;                       // pied du mat (socle)

  // ── poids net : nb de blocs deja tombes a gauche (poids -) vs droite (poids +) ──
  // chaque bloc "arrive" (pese) une fois sa chute terminee (~12f apres son 'at')
  const landed = (b: Block) => (frame >= b.at + 12 ? 1 : 0);
  const leftW = LEFT_BLOCKS.reduce((s, b) => s + landed(b), 0);
  const rightW = RIGHT_BLOCKS.reduce((s, b) => s + landed(b), 0);

  // angle cible du fleau (positif = penche a droite). amplitude par bloc, bornee.
  // gauche tire vers le bas a gauche (angle negatif), droite vers le bas a droite (positif).
  const targetTilt = (rightW - leftW) * 0.13; // rad, ~7.4deg par bloc d'ecart
  // a l'etat 4 (regles -> maintenant) on FORCE l'equilibre parfait (0), peu importe le compte.
  const stabilize = interpolate(frame, [F_REGLES, F_REGLES + 70], [0, 1], clamp);
  const desiredTilt = targetTilt * (1 - stabilize);

  // tilt amorti par spring (le fleau oscille a chaque ajout, puis se cale). On suit la cible par paliers :
  // a chaque evenement (bloc / stabilisation) un spring relance l'arrivee a la nouvelle valeur.
  const tilt = useTiltSpring(desiredTilt, frame, fps);

  // micro-frisson du fleau a l'etat 3 (il "s'agite") avant la stabilisation
  const agit = frame >= F_DETTE && frame < F_REGLES
    ? Math.sin(frame / 2.6) * 0.012 * interpolate(frame, [F_DETTE, F_YAKAAR, F_REGLES], [0.2, 1, 0], clamp)
    : 0;

  // ⭐ OSCILLEMENT PERPETUEL TRES DOUX (retour Aziz v4) : une fois la balance chargee des 2 cotes (~F_YAKAAR),
  // le fleau ne se fige JAMAIS — il oscille legerement autour de l'equilibre (~+-1.75deg = 0.0305 rad) sur une
  // periode lente, JUSQU'A LA FIN. La tension reste vivante (la balance "respire", prete a basculer). On
  // superpose 2 sinus de periodes differentes pour un mouvement organique (pas un balancier mecanique).
  const breatheIn = interpolate(frame, [F_YAKAAR + 14, F_YAKAAR + 70], [0, 1], clamp); // fade-in de l'oscillation
  const breathe = (0.024 * Math.sin(frame / 34) + 0.008 * Math.sin(frame / 19 + 1.3)) * breatheIn; // ~+-0.032 rad max

  const beamAngle = tilt + agit + breathe;

  // entree de la balance : APRES le morph du donut (le donut DEVIENT le pivot, puis le fleau/plateaux poussent
  // hors de l'anneau). Le pivot apparait pile quand le donut a fini de se contracter (F_MORPH_OUT).
  const balIn = spring({ frame: frame - F_MORPH_OUT, fps, config: { damping: 16, stiffness: 100 }, durationInFrames: 26 });
  const balOp = interpolate(balIn, [0, 1], [0, 1], clamp);
  // le fleau + plateaux "poussent" hors du pivot : ils grandissent depuis le centre (scale) sur ~20f
  const deploy = spring({ frame: frame - F_MORPH_OUT, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 24 });

  // positions des bouts de fleau (apres rotation autour du pivot)
  const ca = Math.cos(beamAngle), sa = Math.sin(beamAngle);
  const leftEnd = { x: pivotX - beamHalf * ca, y: pivotY - beamHalf * sa };
  const rightEnd = { x: pivotX + beamHalf * ca, y: pivotY + beamHalf * sa };
  // plateaux : suspendus VERTICALEMENT sous chaque bout (les chaines pendent par gravite)
  const leftPanY = leftEnd.y + panDrop;
  const rightPanY = rightEnd.y + panDrop;

  // ── MONUMENT OR (etat 4) ──
  // liseré lumineux qui PARCOURT toute la structure a F_REGLES (le clic d'equilibre se VOIT : ca se verrouille).
  const liserP = interpolate(frame, [F_REGLES, F_REGLES + 55], [0, 1], clamp); // 0->1 : avancee du trait
  const liserGlow = frame >= F_REGLES + 50 ? 0.5 + 0.35 * Math.sin(frame / 9) : interpolate(frame, [F_REGLES, F_REGLES + 20], [0, 1], clamp);
  // halo or CENTRAL (depuis le pivot) qui s'etend a "maintenant" et fige la balance en emblème dore
  const haloCentralP = interpolate(frame, [F_MAINTENANT, F_MAINTENANT + 34], [0, 1], clamp);
  // halo plateau gauche (conserve de la v1, renforce le cote garde-fous)
  const haloP = interpolate(frame, [F_MAINTENANT, F_MAINTENANT + 30], [0, 1], clamp);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity: balOp }}>
      <defs>
        <linearGradient id="goldBeam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={GOLD_HI} /><stop offset="50%" stopColor={GOLD} /><stop offset="100%" stopColor="#8a6d2c" />
        </linearGradient>
        <linearGradient id="goldMast" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a6d2c" /><stop offset="45%" stopColor={GOLD} />
          <stop offset="55%" stopColor={GOLD_HI} /><stop offset="100%" stopColor="#8a6d2c" />
        </linearGradient>
        {/* LINGOT OR FLAT : metal brosse vertical 5 stops (haut clair -> reflet -> or -> ombre bas) */}
        <linearGradient id="lingotGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0e0a8" />
          <stop offset="22%" stopColor={GOLD_HI} />
          <stop offset="55%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#7d6228" />
        </linearGradient>
        {/* LINGOT ROUGE FLAT : rouge profond #7f1d1d coeur, bord vif #ef4444 (semantique fragilite) */}
        <linearGradient id="lingotRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="45%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <radialGradient id="goldHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_HI} stopOpacity={0.55} />
          <stop offset="60%" stopColor={GOLD} stopOpacity={0.18} />
          <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
        {/* halo central (monument) : plus large et plus diffus, depuis le pivot */}
        <radialGradient id="goldHaloCentral" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_HI} stopOpacity={0.42} />
          <stop offset="42%" stopColor={GOLD} stopOpacity={0.18} />
          <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* ── HALO OR CENTRAL (monument) : s'etend depuis le pivot a "maintenant", fige la balance en emblème ── */}
      {haloCentralP > 0.01 && (
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={620 * haloCentralP} fill="url(#goldHaloCentral)" opacity={haloCentralP} />
      )}

      {/* ── socle + mat central ── */}
      <ellipse cx={pivotX} cy={baseY + 8} rx={130} ry={20} fill="#0d1422" opacity={0.6} />
      <rect x={pivotX - 70} y={baseY} width={140} height={16} rx={5} fill="url(#goldMast)" />
      <rect x={pivotX - 12} y={pivotY} width={24} height={baseY - pivotY} fill="url(#goldMast)" />
      {/* chapiteau du pivot */}
      <circle cx={pivotX} cy={pivotY} r={16} fill={GOLD_HI} stroke="#8a6d2c" strokeWidth={2} />

      {/* ── fleau (tourne autour du pivot) — "pousse" hors du pivot-donut via deploy scale ── */}
      <g transform={`rotate(${(beamAngle * 180) / Math.PI} ${pivotX} ${pivotY}) translate(${pivotX} ${pivotY}) scale(${0.4 + 0.6 * deploy}, 1) translate(${-pivotX} ${-pivotY})`}>
        <rect x={pivotX - beamHalf} y={pivotY - 7} width={beamHalf * 2} height={14} rx={7} fill="url(#goldBeam)" />
        {/* embouts du fleau (accroches des chaines) */}
        <circle cx={pivotX - beamHalf} cy={pivotY} r={9} fill={GOLD_HI} />
        <circle cx={pivotX + beamHalf} cy={pivotY} r={9} fill={GOLD_HI} />
        {/* fleche-index au sommet (indique l'inclinaison) */}
        <path d={`M ${pivotX} ${pivotY - 16} L ${pivotX - 9} ${pivotY - 2} L ${pivotX + 9} ${pivotY - 2} Z`} fill={GOLD_HI} />
        {/* ── LISERE OR MONUMENT : trait lumineux qui PARCOURT le fleau (du pivot vers les 2 bouts) a F_REGLES ── */}
        {liserP > 0.001 && (
          <MonumentLiser pivotX={pivotX} pivotY={pivotY} beamHalf={beamHalf} liserP={liserP} glow={liserGlow} />
        )}
      </g>

      {/* ── plateau GAUCHE (garde-fous, or) ── */}
      <Pan
        endX={leftEnd.x} endY={leftEnd.y} panY={leftPanY} panR={panR}
        halo={haloP} blocks={LEFT_BLOCKS} frame={frame} fps={fps}
        landBaseY={leftPanY - 18} liser={liserP} liserGlow={liserGlow}
      />
      {/* ── plateau DROIT (fragilites, rouge) ── */}
      <Pan
        endX={rightEnd.x} endY={rightEnd.y} panY={rightPanY} panR={panR}
        halo={0} blocks={RIGHT_BLOCKS} frame={frame} fps={fps}
        landBaseY={rightPanY - 18} liser={liserP} liserGlow={liserGlow}
      />

      {/* labels de cote sous chaque plateau */}
      <SideLabel x={pivotX - beamHalf} y={Math.max(leftPanY, rightPanY) + 130} text="GARDE-FOUS" color={GOLD_HI} appearAt={F_GARDEFOUS} frame={frame} />
      <SideLabel x={pivotX + beamHalf} y={Math.max(leftPanY, rightPanY) + 130} text="FRAGILITÉS" color={RED} appearAt={F_FRAGILITES} frame={frame} />
    </svg>
  );
};

// suit une cible avec amortissement de type ressort : relance un spring a chaque changement de cible.
// implemente sans hook conditionnel : on memorise via useRef les paliers de cible.
function useTiltSpring(desired: number, frame: number, fps: number): number {
  const ref = React.useRef<{ from: number; to: number; since: number }>({ from: 0, to: 0, since: 0 });
  const st = ref.current;
  if (Math.abs(desired - st.to) > 1e-4) {
    // nouvelle cible : on repart de la valeur courante
    const cur = st.from + (st.to - st.from) * springEase(frame - st.since, fps);
    ref.current = { from: cur, to: desired, since: frame };
  }
  const s = ref.current;
  return s.from + (s.to - s.from) * springEase(frame - s.since, fps);
}
// AMORTISSEMENT SOUS-CRITIQUE : le fleau DEPASSE le point d'equilibre puis OSCILLE 2-3 fois avant de se
// caler (damping bas + masse = oscillation visible). Demande Aziz v3 (la balance encaisse, pas lineaire).
function springEase(localFrame: number, fps: number): number {
  if (localFrame <= 0) return 0;
  return spring({ frame: localFrame, fps, config: { damping: 7, stiffness: 110, mass: 1.4 }, durationInFrames: 90 });
}

// ── un plateau : chaines en V + coupe ronde + halo optionnel + blocs empiles ──
const Pan: React.FC<{
  endX: number; endY: number; panY: number; panR: number;
  halo: number; blocks: Block[]; frame: number; fps: number; landBaseY: number;
  liser?: number; liserGlow?: number;
}> = ({ endX, endY, panY, panR, halo, blocks, frame, fps, landBaseY, liser = 0, liserGlow = 0 }) => {
  const panCx = endX; // le plateau pend a la verticale sous le bout du fleau
  // liseré monument : les chaines + le bord du plateau s'illuminent (decale apres le fleau)
  const chainLit = Math.max(0, Math.min(1, (liser - 0.35) / 0.45)); // commence quand le trait du fleau approche les bouts
  return (
    <g>
      {/* chaines (2 brins en V depuis le bout du fleau vers les bords du plateau) */}
      <line x1={endX} y1={endY} x2={panCx - panR + 16} y2={panY} stroke={GOLD} strokeWidth={2.5} opacity={0.85} />
      <line x1={endX} y1={endY} x2={panCx + panR - 16} y2={panY} stroke={GOLD} strokeWidth={2.5} opacity={0.85} />
      {/* halo or (etat final) DERRIERE le plateau */}
      {halo > 0.01 && (
        <circle cx={panCx} cy={panY - 6} r={170 * halo} fill="url(#goldHalo)" opacity={halo} />
      )}
      {/* coupe du plateau (arc + ellipse) */}
      <path d={`M ${panCx - panR} ${panY} Q ${panCx} ${panY + 54} ${panCx + panR} ${panY} Z`}
        fill="#1d2740" stroke={GOLD} strokeWidth={3} />
      <ellipse cx={panCx} cy={panY} rx={panR} ry={15} fill="#243154" stroke={GOLD_HI} strokeWidth={2.5} />
      {/* liseré monument sur le bord du plateau (s'illumine quand le trait arrive) */}
      {chainLit > 0.02 && (
        <g style={{ mixBlendMode: "screen" }}>
          <line x1={endX} y1={endY} x2={panCx - panR + 16} y2={panY} stroke="#fff4cf" strokeWidth={2.5}
            opacity={0.7 * chainLit * (0.6 + 0.4 * liserGlow)} style={{ filter: `drop-shadow(0 0 4px ${GOLD_HI})` }} />
          <line x1={endX} y1={endY} x2={panCx + panR - 16} y2={panY} stroke="#fff4cf" strokeWidth={2.5}
            opacity={0.7 * chainLit * (0.6 + 0.4 * liserGlow)} style={{ filter: `drop-shadow(0 0 4px ${GOLD_HI})` }} />
          <ellipse cx={panCx} cy={panY} rx={panR} ry={15} fill="none" stroke="#fff4cf" strokeWidth={2.5}
            opacity={0.75 * chainLit * (0.6 + 0.4 * liserGlow)} style={{ filter: `drop-shadow(0 0 5px ${GOLD_HI})` }} />
        </g>
      )}

      {/* blocs tombes dans CE plateau (empiles, ordre d'arrivee) */}
      {blocks.map((b, i) => (
        <FallingBlock key={b.label} block={b} index={i} panCx={panCx} landBaseY={landBaseY} frame={frame} fps={fps} />
      ))}
    </g>
  );
};

// ── un LINGOT FLAT PREMIUM qui TOMBE : rect de face (degrade metal multi-stop) + icone lucide centree +
//    label DESSOUS. Chute par gravite (accel) + SQUASH a l'impact (scaleX>1, scaleY<1 bref) puis rebond. ──
const FallingBlock: React.FC<{ block: Block; index: number; panCx: number; landBaseY: number; frame: number; fps: number }> =
({ block, index, panCx, landBaseY, frame, fps }) => {
  if (frame < block.at - 4) return null;
  const bw = 132, bh = 60;
  const gap = 46; // espace entre lingots empiles = place pour le label SOUS chaque lingot (sans chevauchement)
  // position d'atterrissage : empile (le 1er en bas), centre du lingot
  const restCy = landBaseY - bh / 2 - index * (bh + gap);
  const startCy = -120; // tombe du HAUT du cadre
  // CHUTE PAR GRAVITE : ease-in quadratique (acceleration) jusqu'au contact, puis spring de rebond.
  const tFall = frame - block.at;
  const CONTACT = 13; // frames de chute avant l'impact
  let cy: number;
  if (tFall <= CONTACT) {
    const k = Math.max(0, tFall) / CONTACT;
    cy = startCy + (restCy - startCy) * (k * k); // gravite (quadratique)
  } else {
    // micro-rebond apres contact (spring leger qui recale a restCy)
    const rb = spring({ frame: tFall - CONTACT, fps, config: { damping: 9, stiffness: 240, mass: 0.8 }, durationInFrames: 22 });
    cy = restCy - 10 * (1 - rb) * Math.cos((tFall - CONTACT) * 0.6); // petit sursaut amorti
    cy = restCy + (cy - restCy);
  }
  // SQUASH a l'impact : scaleX s'elargit, scaleY se compresse, tres bref, puis revient (avec leger overshoot inverse)
  const sx = interpolate(frame, [block.at + CONTACT - 1, block.at + CONTACT + 2, block.at + CONTACT + 7, block.at + CONTACT + 13],
    [1, 1.18, 0.96, 1], clamp);
  const sy = interpolate(frame, [block.at + CONTACT - 1, block.at + CONTACT + 2, block.at + CONTACT + 7, block.at + CONTACT + 13],
    [1, 0.78, 1.04, 1], clamp);
  const op = interpolate(frame, [block.at - 4, block.at], [0, 1], clamp);
  const grad = block.gold ? "url(#lingotGold)" : "url(#lingotRed)";
  const stroke = block.gold ? GOLD_HI : "#ef4444";
  const iconCol = block.gold ? "#1a1206" : "#ffe2e2";
  const labelCol = block.gold ? GOLD_HI : "#ff8a8a";
  const ICON = block.Icon;
  return (
    <g opacity={op}>
      {/* le lingot (squash applique depuis la base = le bas du rect) */}
      <g transform={`translate(${panCx}, ${cy}) scale(${sx}, ${sy})`}>
        <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={9} fill={grad} stroke={stroke} strokeWidth={2.5} />
        {/* reflet brosse horizontal (bande claire fine) */}
        <rect x={-bw / 2 + 6} y={-bh / 2 + 8} width={bw - 12} height={5} rx={2.5}
          fill={block.gold ? "#fff0c0" : "#ff9a9a"} opacity={0.5} />
        {/* icone lucide centree (via foreignObject — seul moyen d'embarquer un composant HTML dans le svg) */}
        <foreignObject x={-22} y={-24} width={44} height={44}>
          <ICON size={44} color={iconCol} strokeWidth={2.2} />
        </foreignObject>
      </g>
      {/* label DESSOUS le lingot (dans le gap, pas plaque dessus) — ne subit pas le squash */}
      <text x={panCx} y={restCy + bh / 2 + 24} textAnchor="middle" fill={labelCol}
        fontFamily={BEBAS} fontSize={24} letterSpacing="2"
        opacity={interpolate(frame, [block.at + CONTACT, block.at + CONTACT + 14], [0, 1], clamp)}>
        {block.label}
      </text>
    </g>
  );
};

// ── label de cote (sous un plateau) — RESTE visible jusqu'a la fin (info utile gardee, epure v4) ──
const SideLabel: React.FC<{ x: number; y: number; text: string; color: string; appearAt: number; frame: number }> =
({ x, y, text, color, appearAt, frame }) => {
  const op = interpolate(frame, [appearAt, appearAt + 24], [0, 0.85], clamp);
  return (
    <text x={x} y={y} textAnchor="middle" fill={color} fontFamily={BEBAS} fontSize={32} letterSpacing="3" opacity={op}>
      {text}
    </text>
  );
};

// ── LISERE OR MONUMENT (sur le fleau) : 2 traits lumineux partent du pivot vers chaque bout, en miroir.
// strokeDashoffset -> le trait "parcourt" le fleau. Une fois arrive, il pulse (verrouillage qui se VOIT). ──
const MonumentLiser: React.FC<{ pivotX: number; pivotY: number; beamHalf: number; liserP: number; glow: number }> =
({ pivotX, pivotY, beamHalf, liserP, glow }) => {
  const y = pivotY;
  const len = beamHalf;
  // contour du fleau = ligne du pivot a chaque bout. On trace 2 segments en miroir.
  const offL = len * (1 - liserP); // reste a parcourir cote gauche
  const offR = len * (1 - liserP);
  const sw = 8;
  // tete lumineuse qui voyage au bout du trait (le point de "verrouillage" qui avance)
  const headX = pivotX + len * liserP;
  const headXL = pivotX - len * liserP;
  return (
    <g style={{ mixBlendMode: "screen" }}>
      {/* segment gauche : pivot -> bout gauche */}
      <line x1={pivotX} y1={y} x2={pivotX - len} y2={y} stroke="#fff7da" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={offL} opacity={0.95 * glow}
        style={{ filter: `drop-shadow(0 0 ${8 + 7 * glow}px ${GOLD_HI})` }} />
      {/* segment droit : pivot -> bout droit */}
      <line x1={pivotX} y1={y} x2={pivotX + len} y2={y} stroke="#fff7da" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={offR} opacity={0.95 * glow}
        style={{ filter: `drop-shadow(0 0 ${8 + 7 * glow}px ${GOLD_HI})` }} />
      {/* tete lumineuse qui avance le long du fleau (les 2 cotes en miroir) */}
      {liserP > 0.02 && liserP < 0.99 && (
        <>
          <circle cx={headX} cy={y} r={9} fill="#fffbe8" opacity={0.95}
            style={{ filter: `drop-shadow(0 0 10px ${GOLD_HI})` }} />
          <circle cx={headXL} cy={y} r={9} fill="#fffbe8" opacity={0.95}
            style={{ filter: `drop-shadow(0 0 10px ${GOLD_HI})` }} />
        </>
      )}
      {/* etincelle a chaque bout quand le trait arrive (verrouillage) */}
      {liserP > 0.9 && (
        <>
          <circle cx={pivotX - len} cy={y} r={9 * glow + 5} fill="#fffbe8" opacity={0.95 * glow}
            style={{ filter: `drop-shadow(0 0 12px ${GOLD_HI})` }} />
          <circle cx={pivotX + len} cy={y} r={9 * glow + 5} fill="#fffbe8" opacity={0.95 * glow}
            style={{ filter: `drop-shadow(0 0 12px ${GOLD_HI})` }} />
        </>
      )}
    </g>
  );
};

// (FinalVerdict "LE SENEGAL EST EXACTEMENT..." + "MAINTENANT." RETIRE v4 — epure texte Aziz : la voix
//  porte tout le verdict. La fin garde le graphisme pur : monument or (liseré + halo) + oscillation continue.)

// ── SFX cales millimetre (Sequence). Scene Remotion : pas de son camera/map. ──
const SFX = {
  pop: "_shared/sfx/ui/plate-pop.mp3",            // bloc qui atterrit dans le plateau (son de plaque)
  tick: "_shared/sfx/data/stat-tick.mp3",          // count-up barils (donut)
  impact: "_shared/sfx/impact/impact.mp3",         // climax "maintenant" (halo central)
  tension: "_shared/sfx/impact/tension-pulse.mp3", // arrivee des blocs rouges (fragilites) + liseré monument
  fill: "_shared/sfx/ui/sfx-baril-fill.mp3",       // montage donut (debut) + morph swoosh
};
const Sfx: React.FC<{ at: number; src: string; volume?: number; dur?: number }> = ({ at, src, volume = 0.5, dur = 30 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none"><Audio src={staticFile(src)} volume={volume} /></Sequence>
);
const SceneSFX: React.FC = () => (
  <>
    {/* montage du donut au tout debut */}
    <Sfx at={F_START} src={SFX.fill} volume={0.28} dur={50} />
    {/* count-up barils (donut arc exterieur se remplit) : 3 ticks pendant la course */}
    <Sfx at={F_BARILS} src={SFX.tick} volume={0.38} dur={18} />
    <Sfx at={F_BARILS + 24} src={SFX.tick} volume={0.32} dur={18} />
    {/* MORPH donut -> pivot : swoosh de contraction */}
    <Sfx at={F_MORPH_IN} src={SFX.fill} volume={0.30} dur={40} />
    {/* blocs OR (garde-fous) : son de plaque a CHAQUE atterrissage (~12f apres le 'at') */}
    <Sfx at={F_FONSIS + 11} src={SFX.pop} volume={0.46} dur={28} />
    <Sfx at={F_ITIE + 11} src={SFX.pop} volume={0.46} dur={28} />
    <Sfx at={F_LOI + 11} src={SFX.pop} volume={0.46} dur={28} />
    {/* blocs ROUGES (fragilites) : tension sourde a l'annonce + plaque a chaque atterrissage */}
    <Sfx at={F_FRAGILITES} src={SFX.tension} volume={0.34} dur={40} />
    <Sfx at={F_DETTE + 11} src={SFX.pop} volume={0.46} dur={28} />
    <Sfx at={F_CONTRATS + 11} src={SFX.pop} volume={0.46} dur={28} />
    <Sfx at={F_YAKAAR + 11} src={SFX.pop} volume={0.46} dur={28} />
    {/* MONUMENT : le liseré parcourt la structure (le verrouillage qui se VOIT/s'entend) */}
    <Sfx at={F_REGLES} src={SFX.tension} volume={0.30} dur={50} />
    {/* climax "maintenant" : impact + halo central */}
    <Sfx at={F_MAINTENANT} src={SFX.impact} volume={0.42} dur={48} />
  </>
);

export const SCENE_BILAN_V3_FRAMES = END;
export default SceneBilanV3;
