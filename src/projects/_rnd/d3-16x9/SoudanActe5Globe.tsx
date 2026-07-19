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
import { arcPathD, pointAlongArc, projectPoint, GEO, type LonLat } from "./geoArc";
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

// ── Tampon "preuve documentaire" (presse Beat 2, ONU Beat 3) — overlay HTML, coin haut-droit ──
const DocumentStamp: React.FC<{ frame: number; appear: number; fadeAt: number; lines: string[] }> = ({ frame, appear, fadeAt, lines }) => {
  const op = interpolate(frame, [appear, appear + 16, fadeAt, fadeAt + 20], [0, 0.92, 0.92, 0], clampB);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: "absolute", top: 64, right: 64, opacity: op, pointerEvents: "none",
      padding: "10px 18px", background: "rgba(12,18,26,0.72)", borderRadius: 4,
      border: `1.4px solid ${t.flowGold}`, maxWidth: 380 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: "Georgia, serif", fontSize: i === 0 ? 15 : 13,
          fontWeight: i === 0 ? 700 : 400, color: t.labelFill, letterSpacing: 0.3, lineHeight: 1.4,
          textTransform: i === 0 ? "uppercase" : "none" }}>{l}</div>
      ))}
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

  // ===== ARC FINANCEMENT (Abou Dabi → Libye) — maillon 1 =====
  const financeReveal = interpolate(frame, [T.b2EmiratsNommes, T.b2SourcesNommees], [0, 1], clampB);
  const financeArcD = arcPathD(proj, path, GEO.abuDhabi, GEO.libyaCenter, financeReveal);

  // ===== CORRIDOR (Kufra → El-Fasher) — maillon 2→3, UNE SEULE trajectoire continue =====
  // Beat 3 : 0 → 55% (suspens). Beat 4 : 55% → 100%. Piloté par temps ABSOLU (jamais 2 arcs).
  const corridorProgress = interpolate(
    frame,
    [T.b3Corridor, T.b3End, T.b4ElFasherNomme, T.b4CombattantsRepere],
    [0, CORRIDOR_SUSPEND, CORRIDOR_SUSPEND, 1],
    clampB
  );
  const corridorArcD = frame >= T.b3Corridor ? arcPathD(proj, path, CORRIDOR_A, CORRIDOR_B, corridorProgress) : "";

  // 3 pulses armes/carburant/combattants sur la tête du tracé (verbes → s'effacent)
  const pulseObj = (appear: number) => interpolate(frame, [appear, appear + 8, appear + 32, appear + 44], [0, 1, 1, 0], clampB);
  const pArmes = pulseObj(T.b3Armes);
  const pCarburant = pulseObj(T.b3Carburant);
  const pCombattants = pulseObj(T.b3Combattants);
  // positions des pulses le long du corridor (échelonnées sur la portion tracée du Beat 3)
  const posArmes = frame >= T.b3Armes ? pointAlongArc(proj, CORRIDOR_A, CORRIDOR_B, 0.18, visible) : null;
  const posCarburant = frame >= T.b3Carburant ? pointAlongArc(proj, CORRIDOR_A, CORRIDOR_B, 0.32, visible) : null;
  const posCombattants = frame >= T.b3Combattants ? pointAlongArc(proj, CORRIDOR_A, CORRIDOR_B, 0.46, visible) : null;

  // ===== EMBRASEMENT FORT EL-FASHER (Beat 4, "on les y a repérés") =====
  // 2 ondes de choc échelonnées (embrasement FORT) — chacune monte 0→1 puis se réinitialise pour
  // repartir (ShockRing s'auto-masque à shockT>=1, donc on boucle 2 fois via modulo temporel).
  const shockRaw = Math.max(0, frame - T.b4CombattantsRepere);
  const shockElFasher = shockRaw > 0 ? (shockRaw % 40) / 40 : 0; // onde qui se répète toutes les 40f
  const shockActive = shockRaw > 0 && shockRaw < 90; // 2 ondes puis stop
  const darfourGlow = interpolate(frame, [T.b4CombattantsRepere - 6, T.b4CombattantsRepere + 20], [0, 1], clampB);
  const impactMarker = interpolate(frame, [T.b4CombattantsRepere, T.b4CombattantsRepere + 16, T.b4CombattantsRepere + 60], [0, 1, 0.6], clampB);

  // ===== "RÉSUMONS" — glow cascade sur les 3 maillons, ZÉRO texte =====
  const resumonsBase = interpolate(frame, [T.b4Resumons, T.b4Resumons + 30], [0, 1], clampB);

  // ===== BEAT 5 — figé + El-Fasher seul pulse + vignette pont Acte 6 =====
  const b5ElFasherPulse = frame >= T.b5EtPourtant ? 0.4 + 0.28 * Math.sin((frame - T.b5EtPourtant) * 0.09) : 0;
  const vignette = interpolate(frame, [T.b5Institutions, T.b5End], [0, 0.4], clampB);

  // ===== POINTS FIXES (projetés) =====
  const pAbuDhabi = projectPoint(proj, GEO.abuDhabi, visible);
  const pBenghazi = projectPoint(proj, GEO.benghazi, visible);
  const pKufra = projectPoint(proj, GEO.kufra, visible);
  const pElFasher = projectPoint(proj, GEO.elFasher, visible);

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

          {/* ===== ARCS ===== */}
          {arcStroke(financeArcD, t.flowGold, 1)}
          {arcStroke(corridorArcD, CORRIDOR_COL, 1)}

          {/* pulses armes/carburant/combattants (verbes → s'effacent) */}
          {glowDot(posArmes, t.flowGold, pArmes, 12)}
          {glowDot(posCarburant, t.flowGold, pCarburant, 12)}
          {glowDot(posCombattants, RSF_RED, pCombattants, 12)}

          {/* EMBRASEMENT EL-FASHER : onde de choc + impact marker croix/fumée (embrasement FORT) */}
          {pElFasher && shockActive && <ShockRing x={pElFasher.x} y={pElFasher.y} shockT={shockElFasher} color={RSF_RED} />}
          {pElFasher && impactMarker > 0.01 && (
            <g transform={`translate(${pElFasher.x} ${pElFasher.y})`} opacity={impactMarker}>
              {/* croix d'impact (frappe) */}
              <line x1={-13} y1={-13} x2={13} y2={13} stroke="#fff" strokeWidth={2.6} strokeLinecap="round" opacity={0.85} />
              <line x1={13} y1={-13} x2={-13} y2={13} stroke="#fff" strokeWidth={2.6} strokeLinecap="round" opacity={0.85} />
              <circle r={9} fill="none" stroke={RSF_RED} strokeWidth={2.4} />
            </g>
          )}

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

        {/* LABELS géo-ancrés (overlay HTML) */}
        {pAbuDhabi && <GeoLabel x={pAbuDhabi.x} y={pAbuDhabi.y} label="Abou Dabi" op={uaeReveal} color="#00732F" />}
        {pBenghazi && <GeoLabel x={pBenghazi.x} y={pBenghazi.y} label="Benghazi" op={haftarTint > 0.01 ? interpolate(frame, [T.b3HaftarNomme, T.b3HaftarNomme + 16], [0, 1], clampB) : 0} color={LIBYA_INK} />}
        {pElFasher && <GeoLabel x={pElFasher.x} y={pElFasher.y} label="El-Fasher" op={interpolate(frame, [T.b4ElFasherNomme, T.b4ElFasherNomme + 16], [0, 1], clampB)} color={RSF_RED} />}

        {/* TAMPONS documentaires (presse Beat 2, ONU Beat 3) */}
        <DocumentStamp frame={frame} appear={T.b2SourcesNommees} fadeAt={T.b2End - 10} lines={["29 juin 2026", "Lighthouse Reports · Der Spiegel"]} />
        <DocumentStamp frame={frame} appear={T.b3RapportOnu} fadeAt={T.b3End - 10} lines={["Rapport ONU", "Avril 2026 — Panel of Experts on Libya"]} />

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
