// GLOBE D3 INTÉGRAL — Soudan Acte 5 "Le réseau qui arme dans l'ombre" (~80.1s, 2400 frames @30fps).
//
// Décision Aziz 2026-07-19 : Acte 5 en globe D3 INTÉGRAL (0 Mapbox, 0 couture inter-moteurs). Une seule
// projection ortho continue sur les 5 beats. Répond au diagnostic downstream (Gemini+Kimi) : le vide 37°
// Abou Dabi<->Libye disparaît (courbure), la caméra ne bouge jamais sans cible, le territoire RÉAGIT à
// l'arrivée (El-Fasher embrasé), la chaîne PERSISTE au lieu de s'effacer (règle nom→persiste).
//
// Chaîne LINÉAIRE à 3 maillons trans-continentaux (le geste le plus pur pour un arc geoInterpolate) :
//   Abou Dabi (~54E) --finance--> est libyen/Kufra (~23E, Haftar) --corridor--> El-Fasher (~13N, Darfour).
//
// ⛔ POINT NON-NÉGOCIABLE : le corridor Kufra→El-Fasher est UNE SEULE trajectoire continue
// (corridorProgress piloté par temps absolu) — commence Beat 3 (suspendu à 55%), termine Beat 4. Jamais
// deux arcs indépendants (sinon le sens "chaîne qui se boucle" du script se perd).
//
// Moule = SoudanActe3GlobeInsert.tsx (validé Aziz). Biblio réutilisée : THEMES.mixte, GlobeFlagFill,
// ShockRing, DestPoint. Ajouts propres à l'Acte 5 : masque parchemin Libye, teinte Haftar (sans drapeau
// national), embrasement fort El-Fasher (halo + onde + impact marker croix/fumée), tampons presse/ONU.
import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { arcPathD, windingPathD, pointAlongArc, pointAlongWinding, projectPoint, GEO, type LonLat } from "./geoArc";
import { THEMES, FlagToken, ShockRing } from "./SoudanActe3GlobeProto16x9";
import { buildActe5Cam, camAt } from "./globeCamera";
import { T, A5_GLOBE_FRAMES, AUDIO_FULL } from "./soudanActe5GlobeTiming";

export const SOUDAN_A5_GLOBE_FRAMES = A5_GLOBE_FRAMES; // 2400

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const t = THEMES.mixte;

const LIBYA_INK = "#9B5A2E"; // teinte de contrôle est-libyen (Haftar/LNA) — brun-orangé lisible
const CORRIDOR_COL = "#B23A2E"; // corridor = rouge sombre lisible (le "réseau qui arme") — tranche sur le kaki
const RSF_RED = "#C0392B"; // embrasement Darfour à l'arrivée du corridor

// Keyframes caméra de l'acte (T = ancrages absolus, frame 0 = début).
const CAM = buildActe5Cam(T as any);

// waypoints du corridor : Kufra → point intermédiaire (frontière) → El-Fasher. UNE seule trajectoire.
// Sur le globe on trace 2 segments de grand cercle enchaînés (Kufra→mid, mid→El-Fasher) mais pilotés
// par UN SEUL progress continu [0..1] — l'objet CorridorArc gère le mapping (cf plus bas).
const CORRIDOR_A: LonLat = GEO.kufra;
const CORRIDOR_B: LonLat = GEO.elFasher;
const CORRIDOR_SUSPEND = 0.55; // s'arrête en suspens à 55% en fin de Beat 3

// ── Source "preuve documentaire" — UNE SEULE LIGNE compacte (retour Aziz : pas un pavé). Apparaît
//    ~2s avant de disparaître, bas de l'écran, discrète. `label` = ligne unique déjà formatée. ──
const SourceLine: React.FC<{ frame: number; appear: number; fadeAt: number; label: string }> = ({ frame, appear, fadeAt, label }) => {
  const op = interpolate(frame, [appear, appear + 12, fadeAt, fadeAt + 14], [0, 0.9, 0.9, 0], clampB);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: "absolute", bottom: 54, left: "50%", transform: "translateX(-50%)", opacity: op,
      pointerEvents: "none", padding: "6px 16px", background: "rgba(12,18,26,0.66)", borderRadius: 3,
      borderLeft: `2.5px solid ${t.flowGold}`, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 500,
        color: t.labelFill, letterSpacing: 0.3 }}>{label}</span>
    </div>
  );
};

// ── PortraitToken — jeton-visage (recette EXACTE du Mapbox SoudanToken / insert Acte 3 : cercle
//    parchemin + bordure faction + portrait clippé rond + ombre). Overlay HTML aux coords projetées. ──
const PortraitToken: React.FC<{ x: number; y: number; sprite: string; border: string; op: number; size?: number }> =
  ({ x, y, sprite, border, op, size = 62 }) => {
    if (op <= 0.01) return null;
    const D = size;
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: op, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: "50%", top: "72%", width: D * 0.82, height: D * 0.26,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
        <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6",
          border: `3.5px solid ${border}`, boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
            style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
              transform: "translate(-8%, 2%)", display: "block" }} />
        </div>
      </div>
    );
  };

// ── IsoBase — sprite iso/topdown (camp, dépôt) posé sur la carte, ancré aux coords projetées ──
const IsoBase: React.FC<{ x: number; y: number; sprite: string; op: number; width?: number }> =
  ({ x, y, sprite, op, width = 92 }) => {
    if (op <= 0.01) return null;
    return (
      <div style={{ position: "absolute", left: x, top: y, width, transform: "translate(-50%,-55%)", opacity: op,
        pointerEvents: "none", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))" }}>
        <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    );
  };

// ── Label géo-ancré (Abou Dabi, Benghazi, El-Fasher) — SVG point + texte HTML ──
const GeoLabel: React.FC<{ x: number; y: number; label: string; op: number; color: string }> = ({ x, y, label, op, color }) => {
  if (op <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x + 14, top: y - 12, opacity: op,
      fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 21, letterSpacing: "0.02em",
      color: t.labelFill, textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)",
      whiteSpace: "nowrap", pointerEvents: "none" }}>{label}</div>
  );
};

export const SoudanActe5Globe: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== CAMÉRA CONTINUE =====
  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = orthoAt(rotLambda, rotLat).scale(globeR);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const sudan = featureByName("Sudan");
  const libya = featureByName("Libya");
  const uae = featureByName("United Arab Emirates");

  // ===== ÉTATS TERRITOIRE =====
  // Beat 1 : territoire libyen neutre → actif (parchemin). Reste actif jusqu'à la fin (nom→persiste).
  const libyaActive = interpolate(frame, [T.b1InstalleLibye, T.b1InstalleLibye + 24], [0, 1], clampB);
  // Beat 2 : Abou Dabi + drapeau EAU. Beat 3 : teinte de contrôle est-libyen (Haftar).
  const uaeReveal = interpolate(frame, [T.b2EmiratsNommes - 4, T.b2EmiratsNommes + 18], [0, 1], clampB);
  const haftarTint = interpolate(frame, [T.b3HaftarNomme, T.b3HaftarNomme + 24], [0, 0.34], clampB);

  // ===== ARC FINANCEMENT (Abou Dabi → CAMP près de Benghazi) — maillon 1 =====
  // L'argent émirati aboutit à un objet CONCRET (le camp d'entraînement, "Camp 17" à ~20km de Benghazi
  // selon l'enquête), pas à un point abstrait au milieu du territoire (retour Aziz : "la ligne pointe vers quoi ?").
  const CAMP_BENGHAZI: LonLat = [GEO.benghazi[0] - 0.3, GEO.benghazi[1] - 1.1];
  const financeReveal = interpolate(frame, [T.b2EmiratsNommes, T.b2SourcesNommees], [0, 1], clampB);
  const financeArcD = arcPathD(proj, path, GEO.abuDhabi, CAMP_BENGHAZI, financeReveal);
  const financeActive = frame >= T.b2EmiratsNommes;
  const financeParticles = financeActive
    ? [0, 1, 2].map((i) => {
        const ph = ((frame - T.b2EmiratsNommes) * 0.009 + i * 0.34) % 1;
        return pointAlongArc(proj, GEO.abuDhabi, CAMP_BENGHAZI, ph * financeReveal, visible);
      })
    : [];
  // le camp apparaît quand l'argent arrive (fin du tracé de l'arc financement)
  const campBenghaziReveal = interpolate(frame, [T.b2SourcesNommees, T.b2SourcesNommees + 20], [0, 1], clampB);
  const pCampBenghazi = projectPoint(proj, CAMP_BENGHAZI, visible);
  const sourcePulse = financeActive ? 0.3 + 0.2 * Math.sin((frame - T.b2EmiratsNommes) * 0.12) : 0; // pulse à la source

  // ===== CORRIDOR (Kufra → El-Fasher) — maillon 2→3, UNE SEULE trajectoire continue =====
  // Beat 3 : 0 → 55% (suspens). Beat 4 : 55% → 100%. Piloté par temps ABSOLU (jamais 2 arcs).
  const corridorProgress = interpolate(
    frame,
    [T.b3Corridor, T.b3End, T.b4ElFasherNomme, T.b4CombattantsRepere],
    [0, CORRIDOR_SUSPEND, CORRIDOR_SUSPEND, 1],
    clampB
  );
  // ARTÈRE = 1 piste principale qui SERPENTE (inspiration GPT-5.6 Sol : une route de contrebande n'est
  // PAS une ligne GPS droite) + 2 pistes secondaires plus fines (le réseau, pas un vol unique). MÊME
  // progress continu. La piste principale porte la double-ligne (bordure sable + rouge) et les checkpoints.
  const CORRIDOR_AMP = 1.1; // amplitude d'ondulation (degrés)
  const CORRIDOR_WAVES = 2.5;
  const corridorMainD = frame >= T.b3Corridor
    ? windingPathD(proj, path, CORRIDOR_A, CORRIDOR_B, corridorProgress, CORRIDOR_AMP, CORRIDOR_WAVES)
    : "";
  // pistes secondaires (décalées + ondulation différente = traces alternatives dans le désert)
  const corridorSecondary = frame >= T.b3Corridor
    ? [
        windingPathD(proj, path, [CORRIDOR_A[0] - 1.2, CORRIDOR_A[1] - 0.3], [CORRIDOR_B[0] - 0.8, CORRIDOR_B[1] + 0.4], corridorProgress, 0.7, 3.0),
        windingPathD(proj, path, [CORRIDOR_A[0] + 1.0, CORRIDOR_A[1] - 0.2], [CORRIDOR_B[0] + 0.7, CORRIDOR_B[1] + 0.3], corridorProgress, 0.8, 1.8),
      ]
    : [];

  // CONVOIS qui circulent en boucle sur l'artère une fois le corridor établi (Beat 4→5) — l'artère VIT
  // (constance de l'effort de guerre, cf diagnostic "artère pulsante" vs "ligne statique"). 4 marqueurs
  // échelonnés en phase, sur les 3 routes, qui bouclent tant que le réseau est actif.
  // helper : position le long de la piste principale SINUEUSE (mêmes params que le tracé)
  const onCorridor = (tt: number) => pointAlongWinding(proj, CORRIDOR_A, CORRIDOR_B, tt, visible, CORRIDOR_AMP, CORRIDOR_WAVES);
  const convoyActive = frame >= T.b4ElFasherNomme;
  const convoyMarkers = convoyActive
    ? [0, 1, 2, 3].map((i) => {
        const phase = ((frame - T.b4ElFasherNomme) * 0.006 + i * 0.27) % 1; // boucle continue
        const tt = phase * Math.min(1, corridorProgress); // ne dépasse pas la portion tracée
        return onCorridor(tt);
      })
    : [];

  // 3 pulses armes/carburant/combattants sur la tête du tracé (verbes → s'effacent)
  const pulseObj = (appear: number) => interpolate(frame, [appear, appear + 8, appear + 32, appear + 44], [0, 1, 1, 0], clampB);
  const pArmes = pulseObj(T.b3Armes);
  const pCarburant = pulseObj(T.b3Carburant);
  const pCombattants = pulseObj(T.b3Combattants);
  // positions des pulses le long du corridor sinueux (échelonnées sur la portion tracée du Beat 3)
  const posArmes = frame >= T.b3Armes ? onCorridor(0.18) : null;
  const posCarburant = frame >= T.b3Carburant ? onCorridor(0.32) : null;
  const posCombattants = frame >= T.b3Combattants ? onCorridor(0.46) : null;

  // ===== EMBRASEMENT EL-FASHER (Beat 4, "on les y a repérés") — registre ENQUÊTE (ondes de propagation,
  // pas de croix/frappe). 3 ondes échelonnées (calcul par onde au rendu via shockRaw). =====
  const shockRaw = Math.max(0, frame - T.b4CombattantsRepere);
  const shockActive = shockRaw > 0 && shockRaw < 120; // fenêtre des ondes de propagation
  // halo Darfour qui monte puis RESPIRE (battement lent) — installe le siège sans registre combat.
  const darfourRise = interpolate(frame, [T.b4CombattantsRepere - 6, T.b4CombattantsRepere + 20], [0, 1], clampB);
  const darfourBreathe = frame >= T.b4CombattantsRepere + 20 ? 0.85 + 0.15 * Math.sin((frame - T.b4CombattantsRepere) * 0.07) : 1;
  const darfourGlow = darfourRise * darfourBreathe;

  // ===== "RÉSUMONS" — glow cascade sur les 3 maillons, ZÉRO texte =====
  const resumonsBase = interpolate(frame, [T.b4Resumons, T.b4Resumons + 30], [0, 1], clampB);
  // ISOLER LE SYSTÈME (retour G+K) : au dézoom "Résumons", assombrir le globe pour que le réseau
  // (arcs + acteurs + EAU/Libye/Soudan, rendus AU-DESSUS du voile) se détache du reste du monde.
  const systemReveal = interpolate(frame, [T.b4Resumons, T.b4Resumons + 30, T.b5End], [0, 0.42, 0.42], clampB);

  // ===== BEAT 5 — figé + El-Fasher seul pulse + vignette pont Acte 6 =====
  const b5ElFasherPulse = frame >= T.b5EtPourtant ? 0.4 + 0.28 * Math.sin((frame - T.b5EtPourtant) * 0.09) : 0;
  const vignette = interpolate(frame, [T.b5Institutions, T.b5End], [0, 0.4], clampB);

  // ===== POINTS FIXES (projetés) =====
  const pAbuDhabi = projectPoint(proj, GEO.abuDhabi, visible);
  const pBenghazi = projectPoint(proj, GEO.benghazi, visible);
  const pKufra = projectPoint(proj, GEO.kufra, visible);
  const pElFasher = projectPoint(proj, GEO.elFasher, visible);

  // ===== ACTEURS incarnés (Beat 3) — le maréchal Haftar (Benghazi) + SES SOLDATS autour (son autorité
  // militaire, retour Aziz) + camp/dépôt à Kufra + CHECKPOINTS le long du corridor (contrôle du terrain).
  // Les 2 disent des choses différentes et se complètent. Tout RESTE affiché (nom→persiste). =====
  const haftarReveal = interpolate(frame, [T.b3HaftarNomme, T.b3HaftarNomme + 18], [0, 1], clampB);
  const campReveal = interpolate(frame, [T.b3Corridor - 4, T.b3Corridor + 20], [0, 1], clampB); // camp/dépôt à Kufra
  // SOLDATS RSF autour de Haftar (sa force) — cluster SOUS lui, vers l'intérieur libyen (jamais en mer).
  const soldierReveal = (i: number) => interpolate(frame, [T.b3HaftarNomme + 12 + i * 7, T.b3HaftarNomme + 30 + i * 7], [0, 1], clampB); // cascade
  const soldierPos = [[-1.6, -2.6], [1.6, -2.4], [0.0, -3.9]].map(([dLon, dLat]) =>
    projectPoint(proj, [GEO.benghazi[0] + dLon, GEO.benghazi[1] + dLat] as LonLat, visible));
  // CHECKPOINTS = relais le long du corridor Kufra→El-Fasher (fractions du grand cercle). S'allument
  // quand la tête du tracé les dépasse (contrôle du terrain matérialisé, cf source ONU "corridor de Kufra").
  const CHECKPOINTS = [0.28, 0.5, 0.72];
  const checkpointPos = CHECKPOINTS.map((f) => onCorridor(f)); // sur la piste sinueuse
  const checkpointReveal = (f: number) => corridorProgress >= f
    ? interpolate(corridorProgress, [f, f + 0.08], [0, 1], clampB) : 0;

  const fadeIn = interpolate(frame, [0, 12], [0, 1], clampB);

  // helper arc (4 couches : contour sombre + glow large + trait + marching ants)
  const arcStroke = (d: string, color: string, op = 1) =>
    d ? (
      <>
        <path d={d} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6} strokeLinecap="round" opacity={0.6 * op} />
        <path d={d} fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" opacity={0.16 * op} />
        <path d={d} fill="none" stroke={color} strokeWidth={4.4} strokeLinecap="round" opacity={op} />
        <path d={d} fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="7 12" strokeDashoffset={-(frame * 0.9) % 19} opacity={0.55 * op} />
      </>
    ) : null;

  const countryPath = (f: any, key: string) => {
    const d = path(f as any);
    if (!d) return null;
    return <path key={key} d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
  };

  // glow ponctuel (pulse générique geo-ancré)
  const glowDot = (p: { x: number; y: number } | null, color: string, op: number, r = 16) =>
    p && op > 0.01 ? (
      <g transform={`translate(${p.x} ${p.y})`}>
        <circle r={r} fill={color} opacity={op * 0.4} style={{ filter: "blur(8px)" }} />
        <circle r={6} fill={color} stroke="#fff" strokeWidth={1.6} opacity={Math.min(1, op * 1.4)} />
      </g>
    ) : null;

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      {/* AUDIO — fichier FULL en entier depuis frame 0 (l'Acte 5 globe REMPLACE tout, pas un insert). */}
      <Audio src={staticFile(AUDIO_FULL)} />

      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="a5atmo" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="93%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity + 0.15} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="a5ocean" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
            <radialGradient id="a5shade" gradientUnits="userSpaceOnUse"
              cx={W / 2 - globeR * 0.24} cy={H / 2 - globeR * 0.3} r={globeR * 1.35}>
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="58%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0.5" />
            </radialGradient>
            <clipPath id="a5sphereClip"><path d={sphere} /></clipPath>
            {/* clips géo pour confiner les halos AU territoire (sinon ils bavent en mer/désert voisin) */}
            {libya && (() => { const d = path(libya as any); return d ? <clipPath id="a5libyaClip"><path d={d} /></clipPath> : null; })()}
            {sudan && (() => { const d = path(sudan as any); return d ? <clipPath id="a5sudanClip"><path d={d} /></clipPath> : null; })()}
          </defs>

          {/* halo atmosphérique + océan + graticule */}
          <circle cx={W / 2} cy={H / 2} r={globeR + 34} fill="url(#a5atmo)" />
          <path d={sphere} fill="url(#a5ocean)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

          {/* pays neutres (hors Libye/EAU/Soudan qui ont un traitement spécifique) */}
          {feats.map((f, i) => {
            const n = f.properties.name;
            if (n === "Sudan" || n === "Libya" || n === "United Arab Emirates") return null;
            return countryPath(f, `c${i}`);
          })}

          {/* LIBYE — base neutre + parchemin actif (Beat 1) + teinte contrôle est-libyen (Beat 3) */}
          {libya && (() => {
            const d = path(libya as any);
            if (!d) return null;
            return (
              <g>
                <path d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />
                {/* parchemin actif : le territoire libyen s'active (kaki chauffé DORÉ — distinct du
                    Soudan crème pour ne pas confondre les 2 territoires actifs) + contour doré renforcé */}
                {libyaActive > 0.01 && (
                  <path d={d} fill={t.landActive} fillOpacity={libyaActive * 0.92} stroke={t.landActiveStroke} strokeWidth={1.8} strokeOpacity={libyaActive} />
                )}
              </g>
            );
          })()}

          {/* teinte de contrôle est-libyen (Haftar/LNA) — halo local autour de Benghazi, PAS un drapeau
              national (Haftar n'est pas l'État libyen officiel — un drapeau serait trompeur) */}
          {pBenghazi && haftarTint > 0.01 && (
            <g clipPath="url(#a5libyaClip)">
              <circle cx={pBenghazi.x} cy={pBenghazi.y} r={170} fill={LIBYA_INK} opacity={haftarTint * 1.3} style={{ filter: "blur(30px)" }} />
              <circle cx={pBenghazi.x} cy={pBenghazi.y} r={80} fill={LIBYA_INK} opacity={haftarTint} style={{ filter: "blur(14px)" }} />
            </g>
          )}

          {/* EAU — base neutre seulement (le drapeau est un FlagToken flottant, cf overlays plus bas :
              un drapeau clippé dans un territoire minuscule ne montrait que la bande noire du drapeau EAU) */}
          {uae && countryPath(uae, "uae")}

          {/* SOUDAN clair au centre + embrasement Darfour (Beat 4) */}
          {sudan && (() => {
            const d = path(sudan as any);
            if (!d) return null;
            return (
              <g>
                <path d={d} fill={t.sudanFill} fillOpacity={0.95} stroke={t.sudanStroke} strokeWidth={1.6} />
                {/* embrasement FORT : le Darfour vire au rouge RSF à l'arrivée du corridor. Clippé au
                    Soudan (ne bave pas hors territoire), dense (3 couches : large diffus + moyen + cœur vif). */}
                {darfourGlow > 0.01 && pElFasher && (
                  <g clipPath="url(#a5sudanClip)">
                    <circle cx={pElFasher.x} cy={pElFasher.y} r={160} fill={RSF_RED} opacity={darfourGlow * 0.55} style={{ filter: "blur(36px)" }} />
                    <circle cx={pElFasher.x} cy={pElFasher.y} r={80} fill={RSF_RED} opacity={darfourGlow * 0.55} style={{ filter: "blur(18px)" }} />
                    <circle cx={pElFasher.x} cy={pElFasher.y} r={38} fill="#E8503A" opacity={darfourGlow * 0.6} style={{ filter: "blur(9px)" }} />
                  </g>
                )}
              </g>
            );
          })()}

          {/* VOILE "isoler le système" (dézoom Résumons) : assombrit le globe entier — les arcs/acteurs
              rendus APRÈS ce rect ressortent. Clippé à la sphère. (retour convergent G+K) */}
          {systemReveal > 0.01 && (
            <rect x={0} y={0} width={W} height={H} fill="#05070d" opacity={systemReveal} clipPath="url(#a5sphereClip)" pointerEvents="none" />
          )}

          {/* ===== ARCS ===== */}
          {arcStroke(financeArcD, t.flowGold, 1)}
          {/* pulse à la source (Abou Dabi) + particules d'argent qui parcourent l'arc en continu */}
          {pAbuDhabi && sourcePulse > 0.01 && (
            <circle cx={pAbuDhabi.x} cy={pAbuDhabi.y} r={20} fill={t.flowGold} opacity={sourcePulse} style={{ filter: "blur(7px)" }} />
          )}
          {financeParticles.map((p, i) => p && (
            <circle key={`fp${i}`} cx={p.x} cy={p.y} r={4} fill={t.flowGold} opacity={0.95} />
          ))}
          {/* ARTÈRE (inspiration GPT-5.6 Sol) : pistes secondaires fines en pointillé (traces alternatives)
              + piste PRINCIPALE qui serpente, en DOUBLE-LIGNE (bordure sable claire large sous le rouge). */}
          {corridorSecondary.map((d, i) => d ? (
            <path key={`sec${i}`} d={d} fill="none" stroke={CORRIDOR_COL} strokeWidth={2} strokeLinecap="round"
              strokeDasharray="3 9" opacity={0.4} />
          ) : null)}
          {corridorMainD && (
            <>
              {/* bordure sable de la piste (la route dans le désert) */}
              <path d={corridorMainD} fill="none" stroke="#E8D9B0" strokeWidth={11} strokeLinecap="round" opacity={0.55} />
              <path d={corridorMainD} fill="none" stroke="rgba(10,14,22,0.5)" strokeWidth={7.5} strokeLinecap="round" opacity={0.5} />
              {/* trait rouge du corridor de contrebande */}
              <path d={corridorMainD} fill="none" stroke={CORRIDOR_COL} strokeWidth={4.4} strokeLinecap="round" />
              {/* marching ants (le flux) */}
              <path d={corridorMainD} fill="none" stroke="#F2E5C8" strokeWidth={1.5} strokeLinecap="round"
                strokeDasharray="7 12" strokeDashoffset={-(frame * 0.9) % 19} opacity={0.6} />
            </>
          )}

          {/* CHECKPOINTS VARIÉS le long du corridor (inspiration GPT : formes différentes + barres
              perpendiculaires = signalétique de contrôle). S'allument quand la tête du tracé les dépasse. */}
          {checkpointPos.map((p, i) => {
            const op = checkpointReveal(CHECKPOINTS[i]);
            if (!p || op <= 0.01) return null;
            return (
              <g key={`ckp${i}`} transform={`translate(${p.x} ${p.y})`} opacity={op}>
                {/* barres perpendiculaires (poste de contrôle) */}
                <line x1={-11} y1={-8} x2={-11} y2={8} stroke={CORRIDOR_COL} strokeWidth={2.4} />
                <line x1={11} y1={-8} x2={11} y2={8} stroke={CORRIDOR_COL} strokeWidth={2.4} />
                {/* forme centrale variée : cercle / losange / cercle-double */}
                {i === 1 ? (
                  <rect x={-6} y={-6} width={12} height={12} fill="#E8D9B0" stroke={CORRIDOR_COL} strokeWidth={2.4} transform="rotate(45)" />
                ) : (
                  <>
                    <circle r={7} fill="#E8D9B0" stroke={CORRIDOR_COL} strokeWidth={2.4} />
                    <circle r={2.5} fill={CORRIDOR_COL} />
                  </>
                )}
              </g>
            );
          })}

          {/* CONVOIS qui circulent sur l'artère (marqueurs en boucle = l'effort de guerre est CONSTANT) */}
          {convoyMarkers.map((p, i) => p && (
            <g key={`cv${i}`} transform={`translate(${p.x} ${p.y})`}>
              <circle r={5.5} fill={CORRIDOR_COL} opacity={0.9} />
              <circle r={9} fill="none" stroke={CORRIDOR_COL} strokeWidth={1.4} opacity={0.4} />
            </g>
          ))}

          {/* pulses armes/carburant/combattants (verbes → s'effacent) */}
          {glowDot(posArmes, t.flowGold, pArmes, 12)}
          {glowDot(posCarburant, t.flowGold, pCarburant, 12)}
          {glowDot(posCombattants, RSF_RED, pCombattants, 12)}

          {/* EMBRASEMENT EL-FASHER — registre ENQUÊTE (retour convergent G+K : la croix d'impact faisait
              "frappe / jeu vidéo", retirée). Le halo rouge (rendu plus haut, clippé au Soudan) INSTALLE le
              siège ; ici 3 ONDES concentriques échelonnées = propagation du conflit (réfugiés, instabilité
              qui gagne la région), PAS une explosion. */}
          {pElFasher && shockActive && [0, 13, 26].map((delay) => {
            const st = ((shockRaw - delay) % 40) / 40;
            return shockRaw > delay && st > 0 && st < 1 ? (
              <ShockRing key={delay} x={pElFasher.x} y={pElFasher.y} shockT={st} color={RSF_RED} />
            ) : null;
          })}

          {/* points fixes. Abou Dabi = FlagToken (pastille drapeau ronde, lisible même sur pays minuscule) */}
          {pAbuDhabi && <FlagToken x={pAbuDhabi.x} y={pAbuDhabi.y} flagCode="ae" reveal={uaeReveal} ring="#00732F" />}
          {glowDot(pKufra, LIBYA_INK, haftarTint > 0.01 ? 1 : 0, 8)}
          {pElFasher && (
            <g transform={`translate(${pElFasher.x} ${pElFasher.y})`}>
              <circle r={7} fill={RSF_RED} stroke="#fff" strokeWidth={1.6} opacity={interpolate(frame, [T.b4ElFasherNomme, T.b4ElFasherNomme + 14], [0, 1], clampB)} />
              {/* Beat 5 : El-Fasher SEUL continue de pulser (contraste figé/vivant) */}
              {b5ElFasherPulse > 0 && <circle r={16} fill={RSF_RED} opacity={b5ElFasherPulse} style={{ filter: "blur(6px)" }} />}
            </g>
          )}

          {/* "RÉSUMONS" — glow cascade sur les 3 maillons (Abou Dabi → Kufra → El-Fasher), ZÉRO texte */}
          {resumonsBase > 0.01 && [GEO.abuDhabi, GEO.kufra, GEO.elFasher].map((pt, i) => {
            const p = projectPoint(proj, pt as LonLat, visible);
            if (!p) return null;
            const delay = i * 10;
            const g = interpolate(frame, [T.b4Resumons + delay, T.b4Resumons + delay + 24, T.b4Resumons + delay + 70], [0, 1, 0.35], clampB);
            return (
              <circle key={i} cx={p.x} cy={p.y} r={20} fill={t.flowGold} opacity={g * 0.5} style={{ filter: "blur(9px)" }} />
            );
          })}

          {/* ombre sphérique (volume) — par-dessus le contenu, clippée à la sphère */}
          <rect x={0} y={0} width={W} height={H} fill="url(#a5shade)" clipPath="url(#a5sphereClip)" pointerEvents="none" />
        </svg>

        {/* ===== ACTEURS INCARNÉS — camp/dépôt Kufra + le maréchal Haftar (commandement) =====
            (les checkpoints du corridor sont rendus en SVG plus haut, avec les convois). */}
        {/* camp d'entraînement près de Benghazi = ce que finance l'argent émirati (bout de l'arc financement) */}
        {pCampBenghazi && <IsoBase x={pCampBenghazi.x} y={pCampBenghazi.y} sprite="camp-entrainement-td" op={campBenghaziReveal} width={92} />}
        {pKufra && <IsoBase x={pKufra.x} y={pKufra.y} sprite="base-africacorps" op={campReveal} width={104} />}
        {/* soldats RSF autour de Haftar (sa force) — rendus AVANT le portrait pour qu'il passe au-dessus */}
        {soldierPos.map((p, i) => p && (
          <PortraitToken key={`sold${i}`} x={p.x} y={p.y} sprite="portrait-rsf" border="#B14B3C" op={soldierReveal(i)} size={38} />
        ))}
        {pBenghazi && <PortraitToken x={pBenghazi.x} y={pBenghazi.y - 4} sprite="portrait-haftar" border="#9B5A2E" op={haftarReveal} size={66} />}

        {pAbuDhabi && <GeoLabel x={pAbuDhabi.x} y={pAbuDhabi.y} label="Abou Dabi" op={uaeReveal} color="#00732F" />}
        {/* label Benghazi décalé au-dessus du jeton Haftar (évite le chevauchement) */}
        {pBenghazi && (
          <div style={{ position: "absolute", left: pBenghazi.x, top: pBenghazi.y - 52,
            transform: "translateX(-50%)", opacity: haftarReveal,
            fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 20, letterSpacing: "0.02em",
            color: t.labelFill, textShadow: "0 2px 8px rgba(0,0,0,0.9)", whiteSpace: "nowrap", pointerEvents: "none" }}>
            Maréchal Haftar
          </div>
        )}
        {pElFasher && <GeoLabel x={pElFasher.x} y={pElFasher.y} label="El-Fasher" op={interpolate(frame, [T.b4ElFasherNomme, T.b4ElFasherNomme + 16], [0, 1], clampB)} color={RSF_RED} />}

        {/* SOURCES EXACTES — une ligne compacte, bas d'écran, ~2s (retour Aziz : pas un pavé). Réfs
            vérifiées WebSearch 2026-07-19, 4 sources concordantes. Apparaît 60f (~2s) avant de disparaître. */}
        <SourceLine frame={frame} appear={T.b2SourcesNommees} fadeAt={T.b2SourcesNommees + 60}
          label="Enquête Lighthouse Reports · Der Spiegel — 29 juin 2026" />
        <SourceLine frame={frame} appear={T.b3RapportOnu} fadeAt={T.b3RapportOnu + 60}
          label="Rapport ONU · Panel of Experts on Libya — avril 2026" />

        {/* vignette pont Acte 6 (Beat 5, "les institutions") */}
        {vignette > 0.01 && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(circle at 50% 50%, transparent 42%, rgba(0,0,0,${vignette}) 100%)` }} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SoudanActe5Globe;
