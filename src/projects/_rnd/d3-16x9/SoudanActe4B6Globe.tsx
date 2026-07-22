import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import {
  W,
  H,
  GLOBE_R,
  GRATICULE,
  worldFeatures,
  featureByName,
  orthoAt,
  pathOf,
  isVisible as isVisibleGeo,
} from "./globeGeo";
import { GEO, windingPathD, projectPoint, type LonLat } from "./geoArc";
import { camAt, type CamKey } from "./globeCamera";
import { THEMES, GlobeFlagFill, BorderPulse, GeoPlaqueSVG } from "./SoudanActe3GlobeProto16x9";

// Palette = THEMES.mixte (source de verite unique du globe Soudan, utilisee par Actes 3/5/6 —
// coherence episode par construction, pas de couleurs en dur qui derivent).
const t = THEMES.mixte;

// ============================================================================================
// ACTE 4 — BEAT 6 "La bascule vers l'Acte 5" (synthese 4 puissances) — GLOBE 2.0 D3.
//
// Registre = globe orthographique frame-driven avec ARCS A OCCLUSION REELLE (globe2 proto).
// Les QUATRE puissances etrangeres (Russie, Emirats, Turquie, Egypte) tracent chacune un arc
// geodesique vers Khartoum -> la convergence 3D DIT "tout le monde pese sur ce seul point".
//
// RACCORD SORTIE (non-negociable) : le B6 FINIT sur lon32/lat17 scaleMul 2.2 = etat EXACT de
// depart de l'Acte 5 (buildActe5Cam 1re keyframe region Soudan). Continuite parfaite inter-actes.
//
// Timing = forced-alignment reel de l'audio p5 (whisper-p5.ts), zero frame hardcodee arbitraire.
// Script : "Aucun texte" sur les 4 puissances (la densite visuelle parle) ; seul le PONT Acte 5
// ("une organisation existe... restee inactive") a un traitement typographique discret.
// ============================================================================================

const FPS = 30;
// Duree = audio p5 (23.46s) + petite queue de raccord vers l'Acte 5.
export const ACTE4_B6_FRAMES = Math.round(23.46 * FPS) + 18;

// --- Jalons narratifs (relatifs au debut du beat = debut audio p5), en frames ---
const T = {
  start: 0,
  quatrePuissances: Math.round(5.34 * FPS), // "quatre puissances etrangeres" — les 4 arcs se lisent ensemble
  peserIssue: Math.round(8.18 * FPS), // "peser sur l'issue de cette guerre"
  pontActe5: Math.round(14.16 * FPS), // "Et pourtant, une organisation existe..." — bascule pont
  resteInactive: Math.round(22.6 * FPS), // "elle est restee inactive"
  end: Math.round(23.46 * FPS),
};

// Couleurs SPECIFIQUES B6 (pas dans le theme globe) : hub carrefour + gouttes de flux + nuit.
// Tout le reste (terres, ocean, Soudan, frontieres, labels, atmosphere) vient de THEMES.mixte (t).
const COL = {
  goldHi: t.flowGold, // gouttes qui filent (or franc du theme)
  ink: t.labelFill,
  danger: "#C0392B", // = RSF_RED, hub Khartoum (coherent avec le rouge RSF de l'episode)
  night: "#04060d",
};

const KHARTOUM: LonLat = GEO.khartoum;

// GeoPlaqueSVG — voir SoudanActe3GlobeProto16x9.tsx (source de verite unique, unification 2026-07-21).
// L'ancien composant local (identique visuellement, labelFill fige a t.labelFill) est SUPPRIME ; les
// appels ci-dessous passent labelFill={t.labelFill} pour conserver exactement la meme couleur de texte.

// Les 4 puissances etrangeres + leur point d'origine geo + couleur nationale + jalon d'apparition.
// Ordre = apparition sequentielle serree autour de "quatre puissances" (elles se posent l'une apres
// l'autre en ~1.6s total, puis tiennent ensemble = "les quatre" se lit d'un coup).
interface Puissance {
  from: LonLat;
  label: string;
  featureName: string; // nom TopoJSON pour GlobeFlagFill (le pays se remplit de son drapeau)
  flagCode: string; // public/_shared/flags/<code>.png
  color: string;
  appearF: number;
  // courbure de l'arc (amp en degres, waves) : DESEMPILE les 3 sources du nord (Russie/Turquie/Egypte
  // sont quasi sur la meme longitude -> arcs empiles). amp signee = sens de la courbe.
  amp: number;
  waves: number;
}
const PUISSANCES: Puissance[] = [
  // Russie (nord lointain) : grande courbe vers l'OUEST pour degager de la Turquie.
  { from: GEO.moscou, label: "Russie", featureName: "Russia", flagCode: "ru", color: "#c74d4d", appearF: T.quatrePuissances - 8, amp: -3.2, waves: 1 },
  // Emirats (est) : deja bien separe, courbure douce.
  { from: GEO.dubai, label: "Emirats", featureName: "United Arab Emirates", flagCode: "ae", color: t.flowGold, appearF: T.quatrePuissances + 6, amp: 1.0, waves: 1 },
  // Turquie : courbe vers l'EST (oppose a la Russie) pour s'ecarter.
  { from: GEO.ankara, label: "Turquie", featureName: "Turkey", flagCode: "tr", color: "#e0733a", appearF: T.quatrePuissances + 20, amp: 2.0, waves: 1 },
  // Egypte (proche, au nord direct) : trajet court, quasi droit (leger). Derniere arrivee = le "coup"
  // final de la convergence, juste avant "peser sur l'issue de cette guerre" (T.peserIssue = 245).
  { from: GEO.cairo, label: "Egypte", featureName: "Egypt", flagCode: "eg", color: "#7fae6a", appearF: T.quatrePuissances + 34, amp: -0.8, waves: 1 },
];

// --- Camera : plan carrefour resserre (raccord depuis l'insert Kosti B5) -> DEZOOM large a
// "quatre puissances" (voir les 4 flux ensemble) -> RESSERRE sur le Soudan a la fin (raccord Acte 5).
function buildActe4B6Cam(): CamKey[] {
  return [
    // ENTREE : plan carrefour (Soudan + peninsule/Turquie dans l'hemisphere), pose.
    { frame: T.start, lon: 36, lat: 20, scaleMul: 2.1 },
    // "quatre puissances" : DEZOOM large — cadre Moscou (nord), Ankara, Dubai, Le Caire + Khartoum ensemble.
    { frame: T.quatrePuissances, lon: 40, lat: 32, scaleMul: 1.35 },
    { frame: T.peserIssue, lon: 40, lat: 32, scaleMul: 1.3 }, // tient large, les 4 arcs respirent
    // PONT Acte 5 : la camera commence a se recentrer vers le Soudan (on quitte le "systeme" pour
    // "les institutions" — mais on ne montre pas encore l'ONU, c'est l'Acte 5/6).
    { frame: T.pontActe5, lon: 34, lat: 22, scaleMul: 1.5 },
    { frame: T.resteInactive, lon: 32, lat: 18, scaleMul: 1.95 }, // resserre vers le Soudan
    // SORTIE = etat EXACT de depart Acte 5 (continuite parfaite).
    { frame: ACTE4_B6_FRAMES, lon: 32, lat: 17, scaleMul: 2.2 },
  ];
}

const CAM = buildActe4B6Cam();

export const SoudanActe4B6Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const features = useMemo(() => worldFeatures(), []);

  const cam = camAt(CAM, frame);
  // DÉRIVE LENTE (LOT 2) — pendant la synthèse "quatre puissances" (plan large tenu), on ajoute une
  // rotation continue très douce de la longitude (~+4° sur la fenêtre) = "monde en mouvement" dramatique
  // au lieu d'un plan strictement fixe. Off ailleurs (les autres segments ont déjà leur mouvement de cadrage).
  // Ease-in/out pour zéro à-coup au raccord avec les keyframes fixes autour.
  // monte 0->4° pendant la synthèse, PUIS redescend à 0 sur le pont Acte 5 (sinon le décalage
  // persisterait et casserait le raccord de sortie exact lon32/lat17 attendu par l'Acte 5).
  const driftLon = interpolate(
    frame,
    [T.quatrePuissances, T.quatrePuissances + 20, T.peserIssue, T.pontActe5],
    [0, 2.0, 4.0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rotLambda = -(cam.lon + driftLon);
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = useMemo(
    () => orthoAt(rotLambda, rotLat).scale(globeR),
    [rotLambda, rotLat, globeR],
  );
  const path = useMemo(() => pathOf(proj), [proj]);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  // Features des 4 pays source (pour GlobeFlagFill = le pays se remplit de son drapeau).
  const puissanceFeatures = useMemo(
    () => PUISSANCES.map((p) => featureByName(p.featureName)),
    [],
  );

  const cx = W / 2;
  const cy = H / 2;

  // Terminateur nuit (discret) : centre anti-soleil, derive lente.
  const sunLon = interpolate(frame, [0, ACTE4_B6_FRAMES], [50, 10]);
  const nightCenter: LonLat = [sunLon + 180, -15];
  const nightPt = visible(nightCenter) ? proj(nightCenter) : null;


  return (
    <AbsoluteFill style={{ backgroundColor: t.bg }}>
      <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p5.mp3")} />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${t.oceanOuter} 0%, ${t.bg} 78%)`,
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="a4b6ocean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="70%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
          <radialGradient id="a4b6atmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={t.atmoColor} stopOpacity={0} />
            <stop offset="97%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="a4b6night" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COL.night} stopOpacity={0.55} />
            <stop offset="70%" stopColor={COL.night} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COL.night} stopOpacity={0} />
          </radialGradient>
          <clipPath id="a4b6clip">
            <circle cx={cx} cy={cy} r={globeR} />
          </clipPath>
          <filter id="a4b6glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* halo atmospherique */}
        <circle cx={cx} cy={cy} r={globeR + 14} fill="url(#a4b6atmo)" />
        {/* sphere ocean */}
        <circle cx={cx} cy={cy} r={globeR} fill="url(#a4b6ocean)" />

        <g clipPath="url(#a4b6clip)">
          <path d={path(GRATICULE as any) || ""} fill="none" stroke={t.grat} strokeWidth={0.6} opacity={t.gratOpacity} />

          {features.map((f, i) => {
            const isSudan = f.properties.name === "Sudan" || f.properties.name === "S. Sudan";
            return (
              <path
                key={i}
                d={path(f as any) || ""}
                fill={isSudan ? t.sudanFill : t.land}
                stroke={isSudan ? t.sudanStroke : t.landStroke}
                strokeWidth={isSudan ? 0.9 : t.borderWidth}
                strokeOpacity={t.borderOpacity}
              />
            );
          })}

          {nightPt && (
            <circle cx={nightPt[0]} cy={nightPt[1]} r={globeR * 1.05} fill="url(#a4b6night)" />
          )}

          {/* DRAPEAUX SOURCE : chaque pays se REMPLIT de son drapeau quand son flux part (GlobeFlagFill,
              meme composant/effet que les voisins UA de l'Acte 6). Dessine AVANT les arcs (les arcs
              passent par-dessus). Le pays "s'active" = il pese sur le Soudan. */}
          {PUISSANCES.map((p, i) => {
            const feat = puissanceFeatures[i];
            if (!feat) return null;
            const rev = interpolate(frame, [p.appearF, p.appearF + 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (rev <= 0.01) return null;
            return (
              <GlobeFlagFill
                key={`flag-${p.label}`}
                feature={feat}
                proj={proj}
                path={path}
                flagCode={p.flagCode}
                reveal={rev}
                glow={p.color}
              />
            );
          })}

          {/* BorderPulse (LOT 1.1) — souffle de frontiere sur chaque PAYS SOURCE a sa nomination
              (complementaire a l'onde radiale sur Khartoum plus bas, qui reste intacte — celle-ci
              dit "la cible est touchee", celle-la dit "la source s'active"). Couleur = camp (p.color). */}
          {PUISSANCES.map((p, i) => {
            const feat = puissanceFeatures[i];
            if (!feat) return null;
            const d = path(feat as any);
            if (!d) return null;
            const pulse = interpolate(frame, [p.appearF, p.appearF + 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return <BorderPulse key={`pulse-${p.label}`} d={d} pulse={pulse} color={p.color} />;
          })}

          {/* FRONTIERE PERSISTANTE LUMINEUSE (retour Aziz : "que les frontieres du pays restent
              allumees, meme vues de l'espace"). Apres le souffle one-shot (BorderPulse qui s'eteint),
              on garde un contour colore qui RESPIRE doucement tant que le pays est actif — le pays
              nomme reste visuellement "chaud" au lieu de retomber inerte. glow via le filtre a4b6glow. */}
          {PUISSANCES.map((p, i) => {
            const feat = puissanceFeatures[i];
            if (!feat) return null;
            const d = path(feat as any);
            if (!d) return null;
            const on = interpolate(frame, [p.appearF + 20, p.appearF + 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (on <= 0.01) return null;
            // respiration lente du halo (1.0..0.55) — vivant sans clignoter
            const breathe = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((frame - p.appearF) / 11));
            return (
              <path
                key={`glowborder-${p.label}`}
                d={d}
                fill="none"
                stroke={p.color}
                strokeWidth={2.2}
                strokeOpacity={on * breathe * 0.9}
                strokeLinejoin="round"
                filter="url(#a4b6glow)"
              />
            );
          })}

          {/* ARCS A OCCLUSION + COURBURE : chaque puissance trace un arc SINUEUX vers Khartoum.
              windingPathD courbe l'arc (amp/waves) pour DESEMPILER les 3 sources du nord ; geoPath
              clippe nativement les segments derriere le globe. */}
          {PUISSANCES.map((p, i) => {
            const prog = interpolate(frame, [p.appearF, p.appearF + 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (prog <= 0.01) return null;
            const d = windingPathD(proj, path, p.from, KHARTOUM, prog, p.amp, p.waves);
            if (!d) return null;
            const flow = (frame * 2) % 40;
            return (
              <g key={p.label}>
                <path d={d} fill="none" stroke={p.color} strokeWidth={3.4} strokeOpacity={0.92} strokeLinecap="round" />
                {/* gouttes qui filent (une fois l'arc arrive) — le flux COULE en continu vers Khartoum,
                    dasharray dense + forte opacite = le filet se lit nettement, pas un scintillement. */}
                {prog > 0.96 && (
                  <path
                    d={d}
                    fill="none"
                    stroke={COL.goldHi}
                    strokeWidth={4}
                    strokeOpacity={0.85}
                    strokeDasharray="5 22"
                    strokeDashoffset={-flow}
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}

          {/* Labels des pays source — GEOPLAQUES EPHEMERES (retour Aziz) : la plaque apparait a la
              nomination, tient ~2s, PUIS disparait (le drapeau qui remplit le pays reste, lui, la
              reference visuelle permanente). Evite l'accumulation de plaques figees tout l'acte. */}
          {PUISSANCES.map((p, i) => {
            const pt = projectPoint(proj, p.from, visible);
            if (!pt) return null;
            const EPHEM = 60; // ~2s visible avant fade
            const app = interpolate(
              frame,
              [p.appearF, p.appearF + 16, p.appearF + EPHEM, p.appearF + EPHEM + 16],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            if (app <= 0.01) return null;
            return (
              <GeoPlaqueSVG key={`lbl-${p.label}`} x={pt.x} y={pt.y} label={p.label} op={app} accent={p.color} dy={-20} labelFill={t.labelFill} />
            );
          })}

          {/* Khartoum = le carrefour (hub rouge pulsant + ONDE D'IMPACT a chaque arrivee de flux).
              Chaque puissance ARRIVE a appearF+46 (meme jalon que le seuil "flux qui coule" ci-dessus,
              prog>0.96) -> une onde de choc part du hub a cet instant precis (climax "ca pese d'un coup"). */}
          {(() => {
            const pt = projectPoint(proj, KHARTOUM, visible);
            if (!pt) return null;
            const pulse = 1 + 0.4 * Math.sin(frame / 7);

            const WAVE_DUR = 18; // ~0.6s a 30fps
            const arrivals = PUISSANCES.map((p, i) => ({
              frame: p.appearF + 46,
              isLast: i === PUISSANCES.length - 1, // Egypte = arrivee la plus tardive, onde renforcee
            }));
            // Halo de base intensifie pendant la fenetre de convergence (de la 1re a la derniere arrivee).
            const firstArrival = arrivals[0].frame;
            const lastArrival = arrivals[arrivals.length - 1].frame;
            const convergeBoost = interpolate(
              frame,
              [firstArrival, lastArrival, lastArrival + 30],
              [0, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <g transform={`translate(${pt.x} ${pt.y})`}>
                {/* ondes de choc — une par arrivee, par-dessus le pulse permanent */}
                {arrivals.map((arr, i) => {
                  const localF = frame - arr.frame;
                  if (localF < 0 || localF > WAVE_DUR) return null;
                  const rBase = arr.isLast ? 70 : 55; // derniere arrivee (Egypte) = onde plus ample
                  const r = interpolate(localF, [0, WAVE_DUR], [6, rBase], { extrapolateRight: "clamp" });
                  const op = interpolate(localF, [0, WAVE_DUR], [0.8, 0], { extrapolateRight: "clamp" });
                  return (
                    <circle
                      key={`wave-${i}`}
                      r={r}
                      fill="none"
                      stroke={COL.danger}
                      strokeWidth={arr.isLast ? 2.6 : 1.8}
                      opacity={op}
                    />
                  );
                })}
                {/* 2e onde renforcee (decalee) sur la derniere arrivee = "les quatre puissances pesent d'un coup" */}
                {(() => {
                  const lastArr = arrivals[arrivals.length - 1];
                  const localF = frame - lastArr.frame - 6;
                  if (localF < 0 || localF > WAVE_DUR) return null;
                  const r = interpolate(localF, [0, WAVE_DUR], [6, 55], { extrapolateRight: "clamp" });
                  const op = interpolate(localF, [0, WAVE_DUR], [0.6, 0], { extrapolateRight: "clamp" });
                  return <circle r={r} fill="none" stroke={COL.danger} strokeWidth={2} opacity={op} />;
                })()}
                <circle r={10 * pulse} fill={COL.danger} opacity={0.28 + convergeBoost * 0.14} />
                <circle
                  r={6 + convergeBoost * 2}
                  fill={COL.danger}
                  filter="url(#a4b6glow)"
                  stroke={COL.ink}
                  strokeWidth={1}
                />
                <GeoPlaqueSVG x={0} y={0} label="Khartoum" op={1} accent={COL.danger} dy={26} labelFill={t.labelFill} />
              </g>
            );
          })()}
        </g>

        {/* lisere du globe */}
        <circle cx={cx} cy={cy} r={globeR} fill="none" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.4} />
      </svg>

      {/* Pas de sous-titre bas de cadre (retour Aziz : bas d'ecran reserve aux SOURCES uniquement,
          ~2s + fade ; jamais de sous-titre qui repete/synthetise la voix = effet "TikTok" proscrit).
          La voix off + la densite visuelle du globe portent le sens. */}
    </AbsoluteFill>
  );
};
