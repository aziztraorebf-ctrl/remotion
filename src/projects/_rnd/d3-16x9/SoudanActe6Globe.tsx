// GLOBE D3 INTEGRAL — Soudan Acte 6 "Pourquoi personne ne l'arrete" (~133.2s, 3997 frames @30fps).
//
// ACTE FINAL du mid-form : verrou institutionnel (UA suspendue, veto ONU, paradoxe des mediateurs) +
// cout humain + conclusion ouverte. Registre = GLOBE D3 (continuite Acte 5) + OVERLAY UI (B3 vote) +
// INSERT SVG (B4 table de nego). Le globe PORTE l'abstrait grace aux surcouches SVG nettes.
//
// ⚠️ RACCORD ACTE 5 : l'Acte 5 finit RE-ZOOME (lon32/lat17, scaleMul 2.2). L'Acte 6 demarre EXACTEMENT
// sur cet etat puis fait le vrai zoom-out narratif au B1 (verif code Acte 5 reel, pas storyboard).
//
// Moule = SoudanActe5Globe.tsx (moteur globe valide). Overlays propres = soudanActe6Overlays.tsx.
// CTA : AUCUN (tranche Aziz) — fin sur "bonne raison de ne pas le faire" puis fade to black.
//
// prop showInstitutionTokens : 2 VARIANTES B1 a comparer (Aziz 2026-07-20) —
//   false = globe nu, vue planetaire, le vide "rien n'a marche" par l'absence (reco).
//   true  = jetons ONU (New York) + UA (Addis-Abeba) poses sur le globe au B1.
import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import { Ban } from "lucide-react";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { projectPoint, GEO, type LonLat } from "./geoArc";
import { THEMES, GlobeFlagFill, GeoPlaqueSVG, BorderPulse } from "./SoudanActe3GlobeProto16x9";
import { buildActe6Cam, camAt } from "./globeCamera";
import { T, A6_GLOBE_FRAMES, AUDIO_FULL } from "./soudanActe6GlobeTiming";
import { DisplacementCounter } from "./soudanActe6Overlays";
import { SoudanActe6TableInsert } from "./SoudanActe6TableInsert";
import { SoudanActe6VoteInsert } from "./SoudanActe6VoteInsert";

export const SOUDAN_A6_GLOBE_FRAMES = A6_GLOBE_FRAMES; // 4270 (audio pauses re-timé, cf timing)

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const t = THEMES.mixte;

const UA_GLOW = "#C9A24B"; // teinte d'illumination des membres de l'Union africaine (B2)
const SUDAN_GREY = "#7d7669"; // Soudan DESATURE au "suspendu" (kaki -> gris = trou dans la carte UA)
const DISPLACE_COL = "#C0392B"; // cercles concentriques de deplacement (B5)

const CAM = buildActe6Cam(T as any);

// lerp hex sur (evite color-mix CSS, non garanti en headless). p in [0,1].
const lerpHex = (a: string, b: string, p: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * p).toString(16).padStart(2, "0"));
  return `#${c.join("")}`;
};

// Membres UA qui ENCERCLENT le Soudan (B2). Retour Aziz : chacun prend son DRAPEAU un par un
// (GlobeFlagFill = drapeau clippe dans le territoire projete), en cascade sur tout le beat, pendant
// que la voix parle. Le Soudan (traite a part) se barre en gris = exclu au centre du cercle.
// Ordre = voisins DIRECTS d'abord (le cercle immediat) puis grands membres — nom feature NE 110m + ISO-2.
const UA_RING: { name: string; flag: string }[] = [
  { name: "Egypt", flag: "eg" },
  { name: "Libya", flag: "ly" },
  { name: "Chad", flag: "td" },
  { name: "Central African Rep.", flag: "cf" },
  { name: "S. Sudan", flag: "ss" },
  { name: "Ethiopia", flag: "et" },
  { name: "Eritrea", flag: "er" },
  { name: "Kenya", flag: "ke" },
  { name: "Niger", flag: "ne" },
  { name: "Nigeria", flag: "ng" },
  { name: "Algeria", flag: "dz" },
];

export const SoudanActe6Globe: React.FC<{ showInstitutionTokens?: boolean }> = ({ showInstitutionTokens = false }) => {
  const frame = useCurrentFrame();

  // ===== CAMERA CONTINUE =====
  const cam = camAt(CAM, frame);
  // MICRO-DERIVE DE FOND (dosage "globe vivant" B6, retour Aziz 2026-07-22) — une respiration continue
  // tres douce de la longitude par-dessus les keyframes, pour que le globe ne soit JAMAIS strictement
  // figé sur les segments "posés" (le vide B1, l'UA B2, le fond du vote B3, le hold final B5). Pattern
  // repris de SoudanActe4B6Globe (driftLon), ici en oscillation lente bornée = "monde en mouvement".
  //  - amplitude montée en douceur apres le raccord exact Acte 5 (les 1eres frames restent fideles a
  //    lon32/lat17, sinon on casserait la continuite inter-actes),
  //  - RETOMBE a 0 sur le fade final (la fin validée = carte qui s'assombrit, aucun glissement parasite).
  const driftEnvIn = interpolate(frame, [T.b1Start, T.b1Start + 90], [0, 1], clampB); // 0 au raccord, 1 apres ~3s
  const driftEnvOut = interpolate(frame, [T.b5Cloture, T.b5Raison], [1, 0], clampB); // s'eteint quand la fin s'assombrit
  const driftAmp = 1.6 * driftEnvIn * driftEnvOut; // ±1.6° max — imperceptible en saut, present en mouvement
  const driftLon = driftAmp * Math.sin((frame - T.b1Start) / 190); // periode lente ~40s (jamais un va-et-vient visible)
  const rotLambda = -(cam.lon + driftLon);
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = orthoAt(rotLambda, rotLat).scale(globeR);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const sudan = featureByName("Sudan");

  // ===== B1 — le vide : voile Acte 5 qui se leve (le globe s'eclaircit en montant en altitude) =====
  // l'Acte 5 finit avec un voile sombre "isoler le systeme" (op ~0.42) — au B1 il se leve.
  const veilLift = interpolate(frame, [T.b1Start, T.b1RienMarche], [0.42, 0], clampB);

  // ===== B2 — les voisins UA prennent leur DRAPEAU un par un (cascade), le Soudan se barre au centre =====
  // Retour Aziz : la cascade commence TOT (~5s, pendant le B1 avant meme "Union africaine") et s'etale
  // sur presque tout le beat — tous les drapeaux poses ~5s avant la fin du B2. Rythme long et regulier.
  const CASCADE_START = 150; // ~5s @30 (pendant le B1)
  const CASCADE_END = T.b2MiseEcart - 30; // dernier drapeau ~5s avant la fin du beat
  const flagRevealAt = (i: number) => {
    const span = (CASCADE_END - CASCADE_START) / UA_RING.length;
    const a = CASCADE_START + i * span;
    return interpolate(frame, [a, a + 26], [0, 1], clampB);
  };
  // au "suspendu", les voisins reculent d'un cran (desaturent) : le cercle se referme en excluant le centre
  const ringRecoil = interpolate(frame, [T.b2Suspendu, T.b2Suspendu + 26], [1, 0.6], clampB);
  // ⭐ CARTE PERSISTANTE (retour Aziz NON-NEGOTIABLE) : les drapeaux UA + Soudan barre RESTENT affiches
  // jusqu'a la fin (regle nom->persiste). Les inserts B3/B4 les masquent avec leur fond opaque pendant
  // qu'ils jouent, mais AUX RETOURS au globe (transition post-vote, post-table, B5) la carte reapparait
  // INTACTE — plus jamais de "carte vierge". uaFade ne s'annule QU'A la toute fin (fade to black).
  const uaFade = 1; // persistant tout l'acte (etait : disparait au B3)
  // voile "concentrer sur l'Afrique" (leger) — reste actif tant qu'on voit la carte (persiste aussi)
  const africaFocus = interpolate(frame, [CASCADE_START, CASCADE_START + 40], [0, 1], clampB);
  // Soudan DESATURE au "suspendu" (kaki -> gris) : trou dans la carte. PERSISTE (nom->persiste).
  const sudanDesat = interpolate(frame, [T.b2Suspendu, T.b2Suspendu + 26], [0, 1], clampB);
  const banReveal = interpolate(frame, [T.b2Suspendu + 8, T.b2Suspendu + 30], [0, 1], clampB);
  // le "ban" PERSISTE aussi (le Soudan reste barre tout l'acte — c'est le fil rouge)
  const banOp = banReveal;
  // IMPACT de l'exclusion (retour Aziz + Gemini) : FLASH bref au "suspendu" + pop marque du ban (SANS
  // camera-shake, Aziz a exclu le shake). Le flash = cercle clair qui gonfle et disparait sur le Soudan.
  const impactRaw = frame - (T.b2Suspendu + 8);
  const banFlash = impactRaw >= 0 && impactRaw < 20 ? interpolate(impactRaw, [0, 4, 20], [0, 0.7, 0], clampB) : 0;
  const banPop = interpolate(frame, [T.b2Suspendu + 8, T.b2Suspendu + 16, T.b2Suspendu + 26], [0.4, 1.25, 1], clampB); // overshoot

  // ===== B3 — le vote a son ESPACE CLOS : on assombrit le globe derriere l'hemicycle (sinon les 2
  //   registres se brouillent, cf 1re passe). Le globe reste visible en fond sombre (continuite). =====
  const voteDim = interpolate(frame, [T.b3Novembre - 10, T.b3Novembre + 16, T.b3Neutre, T.b3Neutre + 30], [0, 1, 1, 0], clampB);

  // ===== B4 — insert table : le globe s'assombrit dessous pendant l'insert (cross-fade opacite) =====
  const globeDim = interpolate(frame, [T.b4Tables - 20, T.b4Tables + 10, T.b4End - 20, T.b4End], [0, 1, 1, 0], clampB);

  // ===== B5 — cercles concentriques de deplacement (Khartoum / El-Fasher / Nyala) =====
  // cercles concentriques = AMORCE courte sur "la guerre continue" (f3086), s'effacent quand le
  // cartouche plein ecran arrive (il fige l'action, registre AES R2 — pas 2 dispositifs a la fois).
  const displaceReveal = interpolate(frame, [T.b5Continue, T.b5Continue + 30, T.b5TreizeMillions - 6, T.b5TreizeMillions + 10], [0, 1, 1, 0], clampB);
  const displaceHold = T.b5TreizeMillions + 100; // le compteur atteint 13,5M
  const cartoucheOut = T.b5Cloture - 30; // le cartouche disparait avant la cloture (fin respire)

  // ===== FIN (registre War-Map AES longue, retour Aziz 2026-07-20 avec CAPTURE de reference) =====
  // La carte s'ASSOMBRIT vers l'opacite exacte de la capture Aziz (carte encore lisible, drapeaux
  // devines, Soudan barre net) — PAS jusqu'aux contours-purs-sur-noir. On S'ARRETE la, PUIS fade au noir.
  const DISSOLVE_MAX = 0.55; // opacite d'arret (capture Aziz) — la carte reste visible dessous
  const dissolve = interpolate(frame, [T.b5Cloture, T.b5Raison], [0, DISSOLVE_MAX], clampB);
  const fillFade = 1 - dissolve; // opacite des remplissages (reste ~0.45 = carte lisible)
  // PHRASE FINALE typewriter RETIREE (retour Aziz 2026-07-22). La phrase reste dite a la voix ;
  // l'ecran finit sur la carte assombrie qui fond au noir, sans texte. On PROLONGE la fin (~2-3s de
  // musique + carte qui s'assombrit) : le fade au noir demarre apres la fin de la voix (3964) + une
  // respiration, et se termine avant b5End (4140). Plus de dependance au typewriter.
  const fadeBlack = interpolate(frame, [T.b5Raison + 40, T.b5End - 10], [0, 1], clampB);

  const fadeIn = interpolate(frame, [0, 14], [0, 1], clampB);

  // points projetes (institutions + foyers de deplacement)
  const pNewYork = projectPoint(proj, GEO.newYork, visible);
  const pAddis = projectPoint(proj, GEO.addisAbeba, visible);
  const pKhartoum = projectPoint(proj, GEO.khartoum, visible);
  const pElFasher = projectPoint(proj, GEO.elFasher, visible);
  const pNyala = projectPoint(proj, GEO.nyala, visible);

  // centroide Soudan (pour l'icone ban geo-ancree)
  const sudanCentroid = sudan ? projectPoint(proj, GEO.sudanCenter, visible) : null;

  const countryPath = (f: any, key: string, fill = t.land) => {
    const d = path(f as any);
    if (!d) return null;
    return <path key={key} d={d} fill={fill} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
  };

  // cercles concentriques (registre radar/etat-major : stroke fins, dashoffset anime — PAS de blur baveux)
  const concentricRings = (p: { x: number; y: number } | null, op: number, seed: number) => {
    if (!p || op <= 0.01) return null;
    return [0, 1, 2].map((i) => {
      const phase = ((frame - T.b5TreizeMillions) * 0.5 + i * 26 + seed * 9) % 78;
      const r = 8 + phase;
      const ringOp = op * interpolate(phase, [0, 12, 60, 78], [0, 0.7, 0.5, 0], clampB);
      return (
        <circle key={`ring${seed}-${i}`} cx={p.x} cy={p.y} r={r} fill="none" stroke={DISPLACE_COL}
          strokeWidth={1.6} strokeOpacity={ringOp} strokeDasharray="3 4"
          strokeDashoffset={-(frame * 0.6) % 7} />
      );
    });
  };

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Audio src={staticFile(AUDIO_FULL)} />

      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="a6atmo" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="93%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity + 0.15} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="a6ocean" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
            <radialGradient id="a6shade" gradientUnits="userSpaceOnUse"
              cx={W / 2 - globeR * 0.24} cy={H / 2 - globeR * 0.3} r={globeR * 1.35}>
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="58%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0.5" />
            </radialGradient>
            {/* glow pour la FRONTIERE PERSISTANTE LUMINEUSE des membres UA (B2) — meme filtre que l'Acte 4 B6 */}
            <filter id="a6glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="a6sphereClip"><path d={sphere} /></clipPath>
            {sudan && (() => { const d = path(sudan as any); return d ? <clipPath id="a6sudanClip"><path d={d} /></clipPath> : null; })()}
            {/* voile "focus Afrique" (B2) : radial centre sur le Soudan projete — clair au centre
                (Afrique), sombre en peripherie (concentre l'oeil sans couper le globe, retour Aziz). */}
            {sudanCentroid && (
              <radialGradient id="a6africaFocus" gradientUnits="userSpaceOnUse"
                cx={sudanCentroid.x} cy={sudanCentroid.y} r={globeR * 0.95}>
                <stop offset="0%" stopColor="#05070d" stopOpacity="0" />
                <stop offset="52%" stopColor="#05070d" stopOpacity="0" />
                <stop offset="100%" stopColor="#05070d" stopOpacity="0.6" />
              </radialGradient>
            )}
          </defs>

          {/* halo atmospherique + ocean + graticule (l'ocean FOND a la dissolution finale) */}
          <circle cx={W / 2} cy={H / 2} r={globeR + 34} fill="url(#a6atmo)" opacity={fillFade} />
          <path d={sphere} fill="url(#a6ocean)" fillOpacity={fillFade} stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55 * fillFade} />
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity * fillFade} />

          {/* pays neutres (base kaki) — le REMPLISSAGE fond a la dissolution, le CONTOUR reste (fin en contours) */}
          {feats.map((f, i) => {
            if (f.properties.name === "Sudan") return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={`c${i}`} d={d} fill={t.land} fillOpacity={fillFade} stroke={t.landStroke}
              strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity * (fillFade * 0.7 + 0.3 * dissolve * 1.2)} />;
          })}

          {/* B2 — VOISINS UA prennent leur DRAPEAU un par un (cascade). GlobeFlagFill = drapeau clippe
              dans le territoire projete sur le globe (courbure respectee). Le recul au "suspendu"
              (ringRecoil) desature le cercle = il se referme en excluant le Soudan. */}
          {UA_RING.map((m, i) => {
            const f = featureByName(m.name);
            if (!f) return null;
            const rev = flagRevealAt(i) * ringRecoil * uaFade * fillFade; // les drapeaux fondent a la dissolution
            if (rev <= 0.01) return null;
            return <GlobeFlagFill key={`ua${i}`} feature={f} proj={proj} path={path} flagCode={m.flag} reveal={rev} glow={UA_GLOW} />;
          })}

          {/* FRONTIERE PERSISTANTE LUMINEUSE des membres UA (pattern valide Acte 4 B6, retour Aziz
              2026-07-22) — une fois qu'un pays a pris son drapeau, son CONTOUR reste "chaud" : trait dore
              qui RESPIRE doucement (breathe = 0.55+0.45*sin), glow via a6glow. Rend l'illumination de
              l'UA vivante (le cercle de l'exclusion pulse au lieu de retomber inerte). Le recul au
              "suspendu" (ringRecoil) l'attenue avec les drapeaux ; fond a la dissolution finale (fillFade). */}
          {UA_RING.map((m, i) => {
            const f = featureByName(m.name);
            if (!f) return null;
            const d = path(f as any);
            if (!d) return null;
            // s'allume ~1s apres l'apparition du drapeau (le contour "prend" apres le remplissage)
            const span = (CASCADE_END - CASCADE_START) / UA_RING.length;
            const a = CASCADE_START + i * span;
            const on = interpolate(frame, [a + 20, a + 46], [0, 1], clampB) * ringRecoil * uaFade * fillFade;
            if (on <= 0.01) return null;
            const breathe = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((frame - a) / 11));
            return (
              <path key={`uaglow${i}`} d={d} fill="none" stroke={UA_GLOW} strokeWidth={2}
                strokeOpacity={on * breathe * 0.85} strokeLinejoin="round" filter="url(#a6glow)" />
            );
          })}

          {/* BorderPulse SOUDAN au "suspendu" (retour Aziz 2026-07-22) — souffle one-shot de frontiere
              au moment EXACT de l'exclusion (complementaire du flash blanc + pop du ban plus bas : le
              souffle dit "la frontiere encaisse le coup"). Rouge danger = le camp qui subit. */}
          {sudan && (() => {
            const d = path(sudan as any);
            if (!d) return null;
            const pulse = interpolate(frame, [T.b2Suspendu + 4, T.b2Suspendu + 34], [0, 1], clampB);
            return <BorderPulse d={d} pulse={pulse} color={DISPLACE_COL} />;
          })()}

          {/* SOUDAN — clair au repos, DESATURE (gris) au "suspendu". ACCENTUE (retour Aziz) : contour
              renforce lumineux pour qu'il RESSORTE au milieu des drapeaux voisins (c'est le sujet). */}
          {sudan && (() => {
            const d = path(sudan as any);
            if (!d) return null;
            const fill = sudanDesat > 0.01 ? lerpHex(t.sudanFill, SUDAN_GREY, sudanDesat) : t.sudanFill;
            // le contour se renforce a mesure que les drapeaux l'entourent (il doit rester lisible)
            const accent = interpolate(frame, [CASCADE_START, T.b2Suspendu + 20], [0, 1], clampB) * uaFade;
            return (
              <g>
                {/* halo de separation sombre autour du Soudan (le detache du cercle de drapeaux) */}
                {accent > 0.01 && <path d={d} fill="none" stroke="#0a0d12" strokeWidth={7} strokeLinejoin="round" opacity={accent * 0.6} />}
                {/* remplissage : fond partiellement a la dissolution (mais garde un fond residuel sombre pour rester lisible) */}
                <path d={d} fill={fill} fillOpacity={0.97 * (fillFade * 0.7 + 0.3)} stroke={t.sudanStroke} strokeWidth={1.6} strokeOpacity={fillFade * 0.5 + 0.5} />
                {/* contour accent (clair) — RESTE BIEN MARQUE a la dissolution (le Soudan = le sujet jusqu'au bout) */}
                <path d={d} fill="none" stroke="#F5EFD6" strokeWidth={2.6 + 2.4 * (dissolve / 0.55)} strokeLinejoin="round"
                  opacity={Math.max(accent * 0.85, 0.5 + 0.5 * (dissolve / 0.55))} />
              </g>
            );
          })()}

          {/* B5 — cercles concentriques de deplacement depuis les 3 foyers (Khartoum/El-Fasher/Nyala),
              clippes au Soudan (ne bavent pas hors territoire). */}
          {displaceReveal > 0.01 && (
            <g clipPath="url(#a6sudanClip)">
              {concentricRings(pKhartoum, displaceReveal, 0)}
              {concentricRings(pElFasher, displaceReveal, 1)}
              {concentricRings(pNyala, displaceReveal, 2)}
            </g>
          )}
          {/* points-foyers nets au centre des cercles */}
          {displaceReveal > 0.01 && [pKhartoum, pElFasher, pNyala].map((p, i) => p && (
            <circle key={`foyer${i}`} cx={p.x} cy={p.y} r={4} fill={DISPLACE_COL} stroke="#fff" strokeWidth={1.2} opacity={displaceReveal} />
          ))}

          {/* voile B1 (Acte 5) qui se leve + voile B4 (assombrit sous l'insert) — clippes a la sphere */}
          {/* voile focus-Afrique (B2) : assombrit la peripherie hors-Afrique, concentre l'oeil sur le
              continent sans le decouper (retour Aziz : montrer l'Afrique, garder le contexte globe). */}
          {africaFocus > 0.01 && sudanCentroid && (
            <rect x={0} y={0} width={W} height={H} fill="url(#a6africaFocus)" opacity={africaFocus} clipPath="url(#a6sphereClip)" pointerEvents="none" />
          )}
          {veilLift > 0.01 && (
            <rect x={0} y={0} width={W} height={H} fill="#05070d" opacity={veilLift} clipPath="url(#a6sphereClip)" pointerEvents="none" />
          )}
          {globeDim > 0.01 && (
            <rect x={0} y={0} width={W} height={H} fill="#05070d" opacity={globeDim * 0.55} clipPath="url(#a6sphereClip)" pointerEvents="none" />
          )}
          {/* voile B3 vote : assombrit le globe pour que l'hemicycle UI se detache (espace clos du vote) */}
          {voteDim > 0.01 && (
            <rect x={0} y={0} width={W} height={H} fill="#070b12" opacity={voteDim * 0.7} clipPath="url(#a6sphereClip)" pointerEvents="none" />
          )}

          {/* ombre spherique (volume) */}
          <rect x={0} y={0} width={W} height={H} fill="url(#a6shade)" clipPath="url(#a6sphereClip)" pointerEvents="none" />
        </svg>

        {/* ===== B1 — jetons institutionnels OPTIONNELS (variante showInstitutionTokens) ===== */}
        {showInstitutionTokens && (() => {
          const tokOp = interpolate(frame, [T.b1Outils, T.b1Outils + 24, T.b2Suspendu, T.b2Suspendu + 24], [0, 1, 1, 0], clampB);
          if (tokOp <= 0.01) return null;
          return (
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {pNewYork && <InstitutionMark x={pNewYork.x} y={pNewYork.y} label="ONU" op={tokOp} color="#4B92DB" />}
              {pAddis && <InstitutionMark x={pAddis.x} y={pAddis.y} label="UA" op={tokOp} color="#C9A24B" />}
              {pNewYork && <GeoPlaqueSVG x={pNewYork.x} y={pNewYork.y} label="Nations unies" op={tokOp} accent="#4B92DB" dy={42} labelFill={THEMES.mixte.labelFill} />}
              {pAddis && <GeoPlaqueSVG x={pAddis.x} y={pAddis.y} label="Union africaine" op={tokOp} accent="#C9A24B" dy={42} labelFill={THEMES.mixte.labelFill} />}
            </svg>
          );
        })()}

        {/* ===== B2 — FLASH d'impact de l'exclusion + icone `ban` geo-ancree au centroide Soudan ===== */}
        {sudanCentroid && banFlash > 0.01 && (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <circle cx={sudanCentroid.x} cy={sudanCentroid.y} r={40 + impactRaw * 4} fill="#fff" opacity={banFlash} />
          </svg>
        )}
        {sudanCentroid && banOp > 0.01 && (
          <div style={{ position: "absolute", left: sudanCentroid.x, top: sudanCentroid.y,
            transform: `translate(-50%,-50%) scale(${banPop})`, opacity: banOp, pointerEvents: "none" }}>
            <Ban size={54} color="#B23A2E" strokeWidth={2.4}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }} />
          </div>
        )}

        {/* ===== B2 — mini-plaque "Union africaine" en bas d'ecran (clarifie le concept, retour Aziz) ===== */}
        {(() => {
          // 2s + fade (pattern SourceLine, retour Aziz : ne pas garder tout le beat). appear ~0.7s, hold ~2s, fade ~0.5s.
          const plaqueOp = interpolate(frame, [T.b2UnionAfricaine, T.b2UnionAfricaine + 20, T.b2UnionAfricaine + 80, T.b2UnionAfricaine + 96], [0, 1, 1, 0], clampB);
          if (plaqueOp <= 0.01) return null;
          return (
            <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
              opacity: plaqueOp, pointerEvents: "none", padding: "8px 26px", background: "rgba(10,14,22,0.72)",
              borderRadius: 3, borderLeft: `3px solid ${UA_GLOW}`, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, color: t.labelFill,
                letterSpacing: "0.05em" }}>Union africaine — 55 États membres</span>
            </div>
          );
        })()}

        {/* ===== B3 — INSERT vote ONU : DECOR GPT-5.6 + jeton drapeau russe au veto (valide Aziz) ===== */}
        <SoudanActe6VoteInsert frame={frame}
          tAppear={T.b3Novembre} tVertPour={T.b3Quatorze} tRusse={T.b3Russie} tVeto={T.b3Veto} tFade={T.b3Neutre} />

        {/* ===== B4 — INSERT table de nego : MIX Fable 5 (base) + GPT-5.6 (plateau bois), valide Aziz ===== */}
        <SoudanActe6TableInsert frame={frame}
          tStart={T.b4Tables} tEmirats={T.b4Emirats} tAlimente={T.b4Alimente} tEnd={T.b4End} />

        {/* ===== B5 — compteur 13,5 millions deplaces ===== */}
        <DisplacementCounter frame={frame} tStart={T.b5TreizeMillions} tHold={displaceHold} tOut={cartoucheOut} />

        {/* ===== PHRASE FINALE typewriter RETIREE (retour Aziz 2026-07-22 : "enleve le texte type
            typewriter, contente-toi de prolonger la scene de 2 a 3s, juste la musique et le Soudan qui
            fade vers le black. C'est suffisant."). La phrase reste DITE a la voix ; l'ecran finit sur la
            carte assombrie qui fond au noir, sans texte. ===== */}
      </AbsoluteFill>

      {/* fade au noir FINAL (apres le hold ~1.5s sur la carte + texte) */}
      {fadeBlack > 0.001 && (
        <AbsoluteFill style={{ background: "#000", opacity: fadeBlack, pointerEvents: "none" }} />
      )}
    </AbsoluteFill>
  );
};

// petit marqueur institutionnel SVG (pastille lettre) pour l'UA quand pas de drapeau dispo
const InstitutionMark: React.FC<{ x: number; y: number; label: string; op: number; color: string }> =
  ({ x, y, label, op, color }) => (
    <g transform={`translate(${x} ${y})`} opacity={op}>
      <circle r={22} fill={THEMES.mixte.sudanFill} stroke={color} strokeWidth={3} />
      <text y={7} textAnchor="middle" fontFamily="Georgia, serif" fontSize={22} fontWeight={800} fill={THEMES.mixte.labelFill}>{label}</text>
    </g>
  );

// InstLabel (texte SVG nu) SUPPRIME (unification 2026-07-21) — remplace par GeoPlaqueSVG (voir
// SoudanActe3GlobeProto16x9.tsx), appele directement au site d'usage ci-dessus.

export default SoudanActe6Globe;
