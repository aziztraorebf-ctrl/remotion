/**
 * GgwHookEncreVivant — HOOK Grande Muraille Verte, registre ENCRE NARRATIVE, ANIME avec PILOTAGE COULEUR SEMANTIQUE.
 *
 * Base = la scene narrative encre Gemini (narr-1-encre, "le mur fier ecrase par l'immensite") :
 *   dunes ecrasantes + soleil de plomb + ligne d'arbres minuscule + pelle plantee abandonnee. Tout en ENCRE neutre.
 * AMELIORATIONS Claude-editeur-SVG (sans regenerer) :
 *   - arbres-touffes du LLM remplaces par les VRAIS arbres geminiTrees.ts (tronc + feuillage etage), agrandis,
 *     en groupes individuels animables (se-tracent/verdissent un a un).
 *   - pelle redessinee plus nette.
 * SEQUENCE COULEUR TIMEE (oilSpread inverse, monde mort->vie) :
 *   f0  : tout en encre. La PELLE se colore d'emblee (le seul effort humain vivant).
 *   ~f30->: les ARBRES se tracent un a un d'avant-plan vers l'horizon + virent au VERT plein.
 *   ~f90->: le SOLEIL s'embrase (jaune ardent + glow + rayons qui tournent).
 *   le DESERT (dunes/hachures/vents) reste en ENCRE = le monde neutre/aride.
 * Timing PROVISOIRE (sera cale sur la voix GeoAfrique ensuite). viewBox 1080x1920 (9:16).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { GGWX_TREES } from "./ggwTreesGpt";

const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
const VERT = "#3e8f34", VERT_D = "#295c1c";
const OR = "#f2b53a", OR_GLOW = "#ffd86b";

/* CUES — caler le recit visuel sur le recit parle (Beat 1 = 18.576s = 557f @30fps).
 * Derives du forced-alignment (public/audio/ggw-muraille-verte/narration.alignment.json), mot par mot.
 * Chaque cue = la frame du MOT qui declenche l'element. NE PAS deviner : ce sont les vrais timestamps voix. */
const CUE = {
  pelle: 30,        // "le plus grand projet" : l'effort humain entre en scene (pelle coloree)
  arbresStart: 119, // "Un mur d'arbres..." : les arbres se construisent un a un
  arbresEnd: 240,   // "...du Senegal jusqu'a Djibouti" : l'etendue 8000km plantee (dernier arbre)
  desert: 273,      // "pour barrer la route au desert" : dunes/vents s'affirment (encre)
  soleil: 347,      // "Un reve immense" : le soleil s'embrase (ambition + chaleur ecrasante)
  titre: 400,       // titre s'inscrit pendant "reve immense / s'effondre" (reste pendant le silence)
  pourtant: 419,    // "Et POURTANT..." : LE pivot. La bascule sombre s'amorce PILE ici (coupe l'elan du soleil).
  effondre: 458,    // "il s'effondre presque partout" : le soleil ecrase pendant que le monde meurt
  audioCut: 510,    // ~17.0s : on coupe la voix AVANT "Pourquoi ?" -> silence (open loop par l'image)
  // RACCORD B1->B2 : l'echec metaphorique. Le mur MEURT : les arbres s'oxydent en VAGUE (horizon->avant-plan),
  // le ciel s'assombrit, des fissures se tracent au sol, MAIS le soleil continue de bruler (le climat = l'ennemi).
  oxydStart: 419,   // = pourtant : la bascule commence sur le mot qui brise l'optimisme
  oxydEnd: 560,     // fin de la vague de mort ; le silence ensuite laisse respirer le monde degrade
} as const;
const HOOK_END = 640; // duree totale compo (laisse respirer la degradation finale)
const SFX_READY = true; // 3 SFX livres (vent -36.7dB / pousse / fissure), tous sobres


// arbre Gemini recolore (encre brune = monde sec / vert = vivant)
function recolor(body: string, fill: string, stroke: string): string {
  return body.replace(/fill="(?!none")[^"]*"/g, `fill="${fill}"`)
             .replace(/stroke="(?!none")[^"]*"/g, `stroke="${stroke}"`);
}
// versions encre (sec/bruni) + verte (vivante) + OXYDEE (gris terne = mort) des 4 arbres GPT detailles
const TREES_ENCRE = GGWX_TREES.map((t) => recolor(t, "#cdbd9a", ENCRE));
const TREES_VERT = GGWX_TREES; // deja en verts pleins (acacia, rond, jeune, arbuste)
const GRIS_MORT = "#514c44", GRIS_MORT_D = "#2a2722"; // brun-charbon froid = decolle du fond assombri
const TREES_MORT = GGWX_TREES.map((t) => recolor(t, GRIS_MORT, GRIS_MORT_D));

// FISSURES geometriques brisees au sol (la terre se casse a la bascule). Tracees en cascade.
const FISSURES = [
  "M 120 1280 L 290 1320 L 410 1290 L 560 1340 L 720 1305",
  "M 980 1420 L 840 1460 L 700 1440 L 540 1490 L 360 1470 L 180 1510",
  "M 300 1660 L 470 1620 L 620 1665 L 800 1630 L 960 1680",
  "M 620 1340 L 660 1470 L 600 1600 L 660 1700",
] as const;
// longueur approx de chaque polyligne (pour le strokeDasharray du trace) — somme des segments.
const FISSURE_LEN = [640, 870, 700, 380] as const;

/* POSITIONS = chaque petit trait de hachure que le LLM a plante dans le sable (= un arbre, idee Aziz).
 * Extraites de narr-1-encre.svg (2 cretes), ordonnees par profondeur. y grand = avant-plan = gros arbre.
 * On NE DEVINE PAS le placement : on suit la composition exacte du modele. */
const RAW_POS: [number, number][] = [
  [440, 965], [420, 985], [400, 1005], [380, 1025], [360, 1045], [340, 1065], [320, 1085], [300, 1105], [280, 1125],
  [370, 1475], [400, 1505], [430, 1535], [460, 1565], [490, 1595], [520, 1625], [550, 1655], [580, 1685], [610, 1715], [640, 1745], [670, 1775],
];
// taille selon la profondeur (y 950->1800 => scale 0.55->1.7), + variante d'arbre par index
const TREES = RAW_POS.map(([x, y], i) => ({
  x, y,
  s: interpolate(y, [950, 1800], [0.42, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  v: i % GGWX_TREES.length,
})).sort((a, b) => a.y - b.y); // horizon -> avant-plan

// frame de naissance d'un arbre (idx dans l'ordre avant-plan->horizon), etale entre arbresStart et arbresEnd
// (= "Un mur d'arbres... du Senegal jusqu'a Djibouti"). Source unique pour arbres ET ombres.
const treeBirth = (idxFront: number, n: number) =>
  CUE.arbresStart + (idxFront / Math.max(1, n - 1)) * (CUE.arbresEnd - CUE.arbresStart);

export const GgwHookEncreVivant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- soleil : s'embrase sur "Un reve immense", ECRASE sur "il s'effondre" ---
  const sunWarm = interpolate(frame, [CUE.soleil, CUE.soleil + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // surcharge ardente quand "il s'effondre" : le reve devient ecrasant (pulse + glow plus forts)
  const sunCrush = interpolate(frame, [CUE.effondre, CUE.effondre + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sunRot = frame * 0.25;
  // soleil ARDENT mais STABLE : pas de pulsation oscillante (evite l'effet stroboscope). Intensite pilotee
  // par sunWarm/sunCrush (taille du glow + couleur), pas par un sin clignotant. Garde 1 = pas de battement.
  const sunPulse = 1;
  const glowPulse = 1;

  // --- pelle : entre sur "le plus grand projet" (l'effort humain), coloree d'emblee ---
  const pelleIn = interpolate(frame, [CUE.pelle, CUE.pelle + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- OXYDATION (raccord B1->B2) : le mur meurt. 0 = vivant, 1 = degrade. ---
  const oxyd = interpolate(frame, [CUE.oxydStart, CUE.oxydEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ciel/monde qui s'assombrit (overlay bleu-gris en multiply), le soleil percera dessus
  const skyDark = oxyd;

  return (
    <AbsoluteFill style={{ background: CREME }}>
      {/* narration Beat 1 (GeoAfrique V2) — coupee AVANT "Pourquoi ?" (audioCut). L'open loop = le silence + l'image. */}
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat1.mp3")} endAt={CUE.audioCut}
        volume={(f) => interpolate(f, [CUE.audioCut - 12, CUE.audioCut], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      {/* SFX timés sous la voix (sobres). Active quand les fichiers sont livres par l'audio-director. */}
      {SFX_READY && (
        <>
          {/* vent de desert : ambiance continue, tres basse, leger fade in/out */}
          <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent.mp3")}
            volume={(f) => interpolate(f, [0, 30, HOOK_END - 40, HOOK_END], [0, 0.18, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          {/* pousse/plantation : cale sur arbresStart, sous la voix */}
          <Sequence from={CUE.arbresStart} name="sfx-pousse">
            <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pousse.mp3")} volume={0.32} />
          </Sequence>
          {/* craquement/cassure : cale PILE sur "pourtant" (la bascule) */}
          <Sequence from={CUE.pourtant} name="sfx-fissure">
            <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-fissure.mp3")} volume={0.5} />
          </Sequence>
        </>
      )}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          {/* ciel d'orage : plus sombre en haut, s'estompe vers le sol (l'echec assombrit le monde) */}
          <linearGradient id="skyDarkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c3340" />
            <stop offset="55%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#4a4336" />
          </linearGradient>
        </defs>
        {/* fond parchemin + cadre epure */}
        <rect width={1080} height={1920} fill={CREME} />
        {/* OVERLAY OXYDATION : assombrit le monde en multiply (le soleil, dessine apres, percera au-dessus) */}
        <rect width={1080} height={1920} fill="url(#skyDarkGrad)" opacity={skyDark * 0.62}
          style={{ mixBlendMode: "multiply" }} />
        <rect x={40} y={40} width={1000} height={1840} stroke={ENCRE} strokeWidth={1.5} fill="none" />
        <rect x={50} y={50} width={980} height={1820} stroke={ENCRE} strokeWidth={1} strokeDasharray="4 8" fill="none" />

        {/* horizon (encre, permanent) */}
        <g id="horizon">
          <path d="M -50 500 Q 250 490 540 510 T 1150 495" stroke={ENCRE} strokeWidth={2} fill="none" />
          <path d="M 100 500 Q 300 480 450 505" stroke={ENCRE} strokeWidth={1} strokeDasharray="2 4" fill="none" />
          <path d="M 650 510 Q 800 480 1000 495" stroke={ENCRE} strokeWidth={1} strokeDasharray="3 6" fill="none" />
        </g>

        {/* SOLEIL : encre -> embrasement or + glow + rayons qui tournent */}
        <g id="soleil">
          {/* glow ardent (apparait avec sunWarm) — halo externe stable, s'INTENSIFIE a l'effondrement (sunCrush), sans clignoter */}
          <circle cx={540} cy={320} r={(210 + sunCrush * 40) * glowPulse} fill={OR_GLOW}
            opacity={sunWarm * (0.35 + sunCrush * 0.15)} style={{ filter: "blur(46px)" }} />
          <circle cx={540} cy={320} r={160 * sunPulse} fill={OR_GLOW}
            opacity={sunWarm * 0.5} style={{ filter: "blur(28px)" }} />
          <circle cx={540} cy={320} r={160} stroke={ENCRE} strokeWidth={4}
            fill={OR} fillOpacity={sunWarm * 0.9} />
          {/* couronnes */}
          <circle cx={540} cy={320} r={190} stroke={ENCRE} strokeWidth={2} strokeDasharray="12 18" fill="none" opacity={0.8} />
          <circle cx={540} cy={320} r={230} stroke={ENCRE} strokeWidth={1.5} strokeDasharray="4 10" fill="none" opacity={0.6} />
          <circle cx={540} cy={320} r={280} stroke={ENCRE} strokeWidth={1} strokeDasharray="1 8" fill="none" opacity={0.4} />
          {/* rayons qui tournent (8 branches), s'embrasent */}
          <g transform={`rotate(${sunRot} 540 320)`}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r1 = 300, r2 = 360;
              const x1 = 540 + Math.cos(a) * r1, y1 = 320 + Math.sin(a) * r1;
              const x2 = 540 + Math.cos(a) * r2, y2 = 320 + Math.sin(a) * r2;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={sunWarm > 0.3 ? OR : ENCRE} strokeWidth={2.5} strokeLinecap="round" opacity={0.4 + sunWarm * 0.6} />;
            })}
          </g>
        </g>

        {/* DUNES : restent en ENCRE (le monde aride / neutre) */}
        <g id="dunes">
          <path d="M 400 505 C 600 550 750 650 1150 750" stroke={ENCRE} strokeWidth={2.5} fill="none" />
          <path d="M 750 650 C 850 750 950 850 1150 880" stroke={ENCRE} strokeWidth={1.5} fill="none" />
          <path d="M -50 850 C 250 800 450 950 850 1100 C 950 1137 1050 1150 1150 1150" stroke={ENCRE} strokeWidth={3.5} fill="none" />
          <path d="M 450 950 C 350 1050 200 1150 -50 1250" stroke={ENCRE} strokeWidth={2} fill="none" />
          {/* (hachures crete mediane retirees : elles servaient de positions d'arbres, les arbres les remplacent) */}
          <path d="M 1150 1150 C 900 1350 700 1450 350 1450 C 150 1450 -10 1500 -50 1550" stroke={ENCRE} strokeWidth={5} fill="none" />
          <path d="M 350 1450 C 500 1600 750 1750 1150 1900" stroke={ENCRE} strokeWidth={3} fill="none" />
          {/* (hachures crete avant retirees : remplacees par les arbres) */}
        </g>

        {/* vents (encre) */}
        <g id="vents" opacity={0.8}>
          <path d="M -50 1050 Q 300 1150 600 1050 T 1150 1100" stroke={ENCRE} strokeWidth={1} strokeDasharray="15 25 5 15" fill="none" />
          <path d="M -50 1350 Q 400 1300 700 1400 T 1150 1350" stroke={ENCRE} strokeWidth={1.5} strokeDasharray="30 40 10 30" fill="none" />
        </g>

        {/* FISSURES : la terre se CASSE a la bascule. Lignes geometriques brisees qui SE TRACENT
            (stroke-dasharray L->0 = notre signature "se-dessine"), en cascade depuis "pourtant". */}
        <g id="fissures">
          {FISSURES.map((d, k) => {
            const t0 = CUE.pourtant + 14 + k * 16;       // cascade
            const draw = interpolate(frame, [t0, t0 + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            if (draw <= 0) return null;
            const len = FISSURE_LEN[k];
            return (
              <path key={k} d={d} stroke={GRIS_MORT_D} strokeWidth={2.5} fill="none" strokeLinejoin="miter"
                opacity={0.55 * oxyd}
                strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
            );
          })}
        </g>

        {/* OMBRES PORTEES des arbres (sous le calque arbres, au SOL = pas de rotate/scale vertical).
            Soleil en haut-centre -> ombre projetee vers le bas, ellipse aplatie. S'allonge un peu a l'embrasement. */}
        <g id="ombres-arbres">
          {[...TREES].sort((a, b) => b.y - a.y).map((t, i, arr) => {
            const birth = treeBirth(i, arr.length);
            const pop = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 13, stiffness: 120 } });
            if (pop < 0.01) return null;
            const rw = 34 * t.s;                          // demi-largeur ombre, suit la taille de l'arbre
            const rh = (8 + sunWarm * 6) * t.s;           // hauteur ellipse, s'allonge a l'embrasement (soleil bas)
            const dir = t.x < 540 ? -1 : 1;               // s'echappe a l'oppose du centre du soleil
            return (
              <ellipse key={`sh-${t.x}-${t.y}`} cx={t.x + dir * 10 * t.s} cy={t.y + 2} rx={rw * pop} ry={rh * pop}
                fill={ENCRE} opacity={(0.16 + sunWarm * 0.1) * pop} />
            );
          })}
        </g>

        {/* LIGNE D'ARBRES : un vrai arbre a CHAQUE trait que le LLM avait plante (idee Aziz).
            Se construisent un a un de l'AVANT-PLAN (pres de la pelle) vers l'HORIZON + virent au VERT. */}
        <g id="arbres">
          {[...TREES].sort((a, b) => b.y - a.y).map((t, i, arr) => {
            const birth = treeBirth(i, arr.length); // avant-plan d'abord, cale sur "Un mur d'arbres..."
            const pop = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 13, stiffness: 120 } });
            if (pop < 0.01) return null;
            const greenIn = interpolate(frame, [birth + 5, birth + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sway = Math.sin((frame - birth) / 17 + t.x) * 1.5;
            // SURVIVANTS (~1 sur 5 = "1 zone sur 36 a reverdi") restent verts ; les autres s'oxydent.
            const survit = i % 5 === 2;
            // MORT EN VAGUE : l'horizon (i grand) meurt EN PREMIER, l'avant-plan en dernier (depérissement qui roule vers nous).
            const deathOrder = 1 - i / Math.max(1, arr.length - 1);   // 0 = horizon (tot), 1 = avant-plan (tard)
            const dStart = CUE.oxydStart + deathOrder * (CUE.oxydEnd - CUE.oxydStart - 30);
            const mort = survit ? 0 : interpolate(frame, [dStart, dStart + 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const droop = mort * 4;                    // l'arbre mort se tasse legerement
            const fade = 1 - mort * 0.25;              // et perd un peu de presence
            return (
              <g key={`${t.x}-${t.y}`}>
                {/* aura verte sous les survivants : ils ressortent quand le reste meurt */}
                {survit && (
                  <circle cx={t.x} cy={t.y - 30 * t.s} r={46 * t.s} fill={VERT}
                    opacity={greenIn * oxyd * 0.32} style={{ filter: "blur(20px)" }} />
                )}
                <g transform={`translate(${t.x} ${t.y}) rotate(${sway + droop}) scale(${t.s * pop} ${t.s * pop * (1 - mort * 0.06)})`}
                   opacity={fade}>
                  <g opacity={1 - greenIn} dangerouslySetInnerHTML={{ __html: TREES_ENCRE[t.v] }} />
                  <g opacity={greenIn * (1 - mort)} dangerouslySetInnerHTML={{ __html: TREES_VERT[t.v] }} />
                  <g opacity={greenIn * mort} dangerouslySetInnerHTML={{ __html: TREES_MORT[t.v] }} />
                </g>
              </g>
            );
          })}
        </g>

        {/* PELLE : coloree d'emblee (le seul effort humain vivant) — redessinee plus nette */}
        <g id="pelle" opacity={pelleIn} transform={`translate(0 ${(1 - pelleIn) * 20})`}>
          {/* ombre portee */}
          <path d="M 260 1675 L 120 1715" stroke={ENCRE} strokeWidth={2} strokeDasharray="5 5" fill="none" opacity={0.5} />
          {/* tas de sable a la base (encre) */}
          <path d="M 215 1678 C 240 1648 285 1648 305 1688 Z" stroke={ENCRE} strokeWidth={2} fill="#d8c79c" />
          {/* manche bois */}
          <line x1="262" y1="1665" x2="305" y2="1470" stroke="#7a4a22" strokeWidth={7} strokeLinecap="round" />
          <line x1="262" y1="1665" x2="305" y2="1470" stroke={ENCRE} strokeWidth={8} strokeLinecap="round" opacity={0.25} />
          {/* poignee en D */}
          <path d="M 298 1474 C 274 1466 280 1432 308 1440 C 332 1447 326 1480 305 1474" stroke="#7a4a22" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* lame metal (trapeze net) */}
          <path d="M 244 1672 L 232 1620 L 292 1606 L 282 1684 Z" stroke={ENCRE} strokeWidth={3} fill="#b7b2a6" strokeLinejoin="round" />
          <path d="M 260 1614 L 252 1676" stroke={ENCRE} strokeWidth={1.5} fill="none" opacity={0.6} />
        </g>

        {/* titre (apparait tard, discret) */}
        <g id="titre" opacity={interpolate(frame, [CUE.titre, CUE.titre + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <text x={540} y={1820} fontFamily="Georgia, serif" fontSize={30} fill={ENCRE} textAnchor="middle" letterSpacing={6} fontWeight={700}>LA GRANDE MURAILLE VERTE</text>
          <line x1={540} y1={1778} x2={540} y2={1790} stroke={ENCRE} strokeWidth={1.5} />
        </g>
      </svg>

      {/* ============ SOUS-TITRES KARAOKÉ — même format B2-B6 ============ */}
      {(() => {
        const narSec = frame / 30;
        const WORDS = [
          { word: "Voici", start: 0.000, end: 0.320 },
          { word: "le", start: 0.320, end: 0.540 },
          { word: "plus", start: 0.540, end: 0.840 },
          { word: "grand", start: 0.840, end: 1.060 },
          { word: "projet", start: 1.060, end: 1.440 },
          { word: "écologique", start: 1.440, end: 2.120 },
          { word: "de", start: 2.120, end: 2.380 },
          { word: "la", start: 2.380, end: 2.960 },
          { word: "planète", start: 2.960, end: 4.000 },
          { word: "Un", start: 4.000, end: 4.100 },
          { word: "mur", start: 4.100, end: 4.380 },
          { word: "d'arbres", start: 4.380, end: 4.840 },
          { word: "de", start: 4.840, end: 5.160 },
          { word: "8 000", start: 5.160, end: 5.640 },
          { word: "kilomètres", start: 5.640, end: 6.260 },
          { word: "du", start: 6.800, end: 6.960 },
          { word: "Sénégal", start: 6.960, end: 7.500 },
          { word: "jusqu'à", start: 7.500, end: 7.960 },
          { word: "Djibouti", start: 7.960, end: 9.140 },
          { word: "pour", start: 9.140, end: 9.280 },
          { word: "barrer", start: 9.280, end: 9.540 },
          { word: "la", start: 9.540, end: 9.960 },
          { word: "route", start: 9.960, end: 10.220 },
          { word: "au", start: 10.220, end: 10.580 },
          { word: "désert.", start: 10.580, end: 11.600 },
          { word: "Un", start: 11.600, end: 11.780 },
          { word: "rêve", start: 11.780, end: 12.040 },
          { word: "immense.", start: 12.040, end: 13.860 },
          { word: "Et", start: 13.860, end: 14.020 },
          { word: "pourtant,", start: 14.020, end: 15.220 },
          { word: "il", start: 15.220, end: 15.400 },
          { word: "s'effondre", start: 15.400, end: 15.920 },
          { word: "presque", start: 15.920, end: 16.420 },
          { word: "partout.", start: 16.420, end: 17.000 },
        ];
        const PHRASE_BREAKS = [9, 19, 25, 28];
        const phrases: { words: typeof WORDS; start: number; end: number }[] = [];
        let start = 0;
        const breakSet = new Set(PHRASE_BREAKS);
        for (let i = 0; i < WORDS.length; i++) {
          if (breakSet.has(i) || i === WORDS.length - 1) {
            const slice = WORDS.slice(start, i + 1);
            phrases.push({ words: slice, start: slice[0].start, end: slice[slice.length - 1].end });
            start = i + 1;
          }
        }
        const activeIdx = phrases.findIndex((p, i) => {
          const nextStart = phrases[i + 1]?.start ?? p.end + 0.6;
          return narSec >= p.start - 0.1 && narSec < nextStart;
        });
        const activePhrase = activeIdx >= 0 ? phrases[activeIdx] : null;
        const subOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const endFade = interpolate(frame, [490, 510], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        if (!activePhrase || subOpacity <= 0.001) return null;
        return (
          <div style={{
            position: "absolute", left: 0, right: 0, top: 1620,
            display: "flex", justifyContent: "center",
            opacity: subOpacity * endFade, pointerEvents: "none",
          }}>
            <div style={{
              maxWidth: 880, margin: "0 80px", padding: "18px 32px",
              borderRadius: 18, background: "rgba(232,220,192,0.72)",
              border: "1px solid rgba(43,33,23,0.18)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 37, lineHeight: 1.3,
              textAlign: "center", textWrap: "balance" as any,
            }}>
              {activePhrase.words.map((w, i) => {
                const spoken = narSec >= w.start;
                const active = narSec >= w.start && narSec <= w.end + 0.12;
                return (
                  <span key={i} style={{
                    color: active ? VERT_D : ENCRE,
                    opacity: spoken ? 1 : 0.45,
                    fontWeight: spoken ? 800 : 600,
                    marginRight: 9, display: "inline-block",
                  }}>
                    {w.word}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

export default GgwHookEncreVivant;
