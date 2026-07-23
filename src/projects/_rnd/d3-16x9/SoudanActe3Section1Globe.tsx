/**
 * SoudanActe3Section1Globe — SECTION 1 "SUIVRE L'OR" REFAITE EN VUE GLOBE D3 INTEGRALE.
 *
 * ⛔ SUPPRESSION "PUITS SANS FOND" (decision figee Aziz 2026-07-22) : l'ancienne Partie A (Beat1Paradoxe
 * = SVG parchemin "puits sans fond", jauge or qui fuit + tuyaux R/S, 0->523 = 0->17.4s) a ete
 * TOTALEMENT retiree — VISUEL + VOIX + TIMING. L'Acte 3 DEMARRE desormais directement sur la carte des
 * mines du Darfour ("Tout commence au Darfour..."). L'audio p1 a ete re-coupe a 17.30s (le narratif
 * "Cette guerre engloutit... qui et pourquoi" est retire du fichier voix), tous les jalons visuels sont
 * decales de -519 frames (17.30s @30fps) pour rester synchro avec l'audio coupe.
 *
 * Modele restant :
 *  - Globe D3 (0->643) : meme moteur EXACT que SoudanActe3GlobeMinesProto.tsx (echelle "topdown" +
 *    contours "marque", tous deux valides par Aziz), enrichi avec TOUT le contenu de la Section1 Mapbox
 *    originale (frontieres RSF/SAF, jetons herites, 3 mines, portrait Hemedti, halos). Fondu d'entree
 *    doux [0,20] a la place de l'ancien cross-fade depuis le SVG.
 *
 * Ce fichier est un COMPOSANT ISOLE (_rnd) : ne touche AUCUN fichier existant (SoudanActe3.tsx, le
 * proto GlobeMinesProto, THEMES.mixte ne sont pas modifies — uniquement lus/copies).
 */
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
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
import { projectPoint, type LonLat } from "./geoArc";
import { THEMES, RSF_RED, SAF_BLUE } from "./SoudanActe3GlobeProto16x9";
import { SoudanToken } from "../../warmap/engine/soudanActors";

// sudan-states.geojson n'est PAS statiquement importable (extension .geojson non reconnue par
// resolveJsonModule/webpack, seul .json l'est — verifie : aucun fichier du repo ne l'importe
// statiquement, tous utilisent fetch(staticFile(...))). Pattern repris de SoudanWarMapEngine.tsx /
// SahelWarMapEngine.tsx : fetch + delayRender/continueRender pour rester headless-safe.
type SudanStateFeature = { type: "Feature"; properties: { name: string }; geometry: any };
type SudanStatesFC = { type: "FeatureCollection"; features: SudanStateFeature[] };

function useSudanStatesGeoJson(): SudanStatesFC | null {
  const [data, setData] = useState<SudanStatesFC | null>(null);
  useEffect(() => {
    const handle = delayRender("Section1Globe: load sudan-states.geojson");
    let cancelled = false;
    fetch(staticFile("_shared/geo-data/sudan/sudan-states.geojson"))
      .then((r) => r.json())
      .then((fc: SudanStatesFC) => {
        if (!cancelled) setData(fc);
        continueRender(handle);
      })
      .catch((e) => {
        console.warn("[Section1Globe] sudan-states.geojson load failed:", e);
        continueRender(handle);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return data;
}

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// ─────────────────────────────────────────────────────────────────────────────
// TIMING — ancrages whisper p1 (frames @30fps). Apres SUPPRESSION du "puits sans fond" (2026-07-22),
// tout est decale de -519 frames (audio p1 re-coupe a 17.30s). Les anciens jalons du puits
// (start=0, pourtant=134, quelquUnPaie=302, suivreArgent=367) sont supprimes : le narratif
// correspondant n'existe plus dans l'audio. Le globe demarre a frame 0 ("Tout commence au Darfour").
// Verifie contre whisper de acte3-p1-sans-puits.mp3 : darfour f0, mines ~f100, chef ~f328, milliard ~f595.
// ─────────────────────────────────────────────────────────────────────────────
const F = {
  darfourStart: 4, // petit souffle d'entree (mot "Tout" a ~0.12s dans l'audio coupe)
  minesOr: 100,
  plusImportante: 148,
  hemedtiNomme: 328,
  milliard: 595,
  end: 643,
};

export const SECTION1_GLOBE_FRAMES = 643;

// ── Coordonnees geo (identiques Section1 Mapbox original, pour fidelite) ──
const DARFUR: LonLat = [26.0, 14.9];
const KHARTOUM: LonLat = [32.55, 15.6];
const JEBEL_AMER: LonLat = [23.706, 13.834];
const MINE_2: LonLat = [24.9, 12.05];
const MINE_3: LonLat = [23.4, 15.5];

// ═════════════════════════════════════════════════════════════════════════════
// Globe D3 (0->643), moteur identique SoudanActe3GlobeMinesProto (topdown + marque).
// (L'ancienne "Partie A" = SVG "puits sans fond" a ete supprimee — cf en-tete du fichier.)
// ═════════════════════════════════════════════════════════════════════════════

// Sprite mine iso pose au sol — ZERO ombre externe (ombre deja dessinee dans le sprite), halo dore
// au sol pour se detacher du kaki (recette identique au proto valide).
const MineSprite: React.FC<{ x: number; y: number; appear: number; frame: number; size: number; fade?: number }> = ({
  x,
  y,
  appear,
  frame,
  size,
  fade = 1,
}) => {
  const op = interpolate(frame, [appear, appear + 16], [0, fade], clampB);
  const pop = interpolate(frame, [appear, appear + 9, appear + 14], [0, 1.15, 1], clampB);
  const haloR = size * 0.62;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: op, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          width: haloR * 2,
          height: haloR * 2,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,165,116,0.55) 0%, rgba(212,165,116,0.22) 45%, rgba(212,165,116,0) 72%)",
        }}
      />
      <img
        src={staticFile("_shared/sprites/warmap/mine-or-td.png")}
        style={{ width: size, height: size * (768 / 1408), objectFit: "contain", display: "block", transform: `scale(${pop})`, transformOrigin: "center bottom" }}
      />
    </div>
  );
};

// PortraitToken — recette exacte de l'insert globe (cercle parchemin + bordure faction + portrait + pulse).
const PortraitToken: React.FC<{ x: number; y: number; appear: number; frame: number }> = ({ x, y, appear, frame }) => {
  const D = 72;
  const op = interpolate(frame, [appear, appear + 16], [0, 1], clampB);
  const pop = interpolate(frame, [appear, appear + 9, appear + 15], [0.5, 1.12, 1], clampB);
  const pulse = interpolate(frame, [appear, appear + 30], [1, 0], clampB);
  const border = "#B14B3C";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${pop})`, opacity: op, pointerEvents: "none" }}>
      {pulse > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: D + 64 * pulse,
            height: D + 64 * pulse,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            border: `2.5px solid ${border}`,
            opacity: 0.7 * (1 - pulse),
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "72%",
          width: D * 0.82,
          height: D * 0.26,
          transform: "translate(-50%,-50%)",
          background: "rgba(40,27,8,0.42)",
          borderRadius: "50%",
          filter: "blur(6px)",
        }}
      />
      <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6", border: `3.5px solid ${border}`, boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
        <img
          src={staticFile("_shared/sprites/warmap/portrait-hemeti.png")}
          style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center", transform: "translate(-8%, 2%)", display: "block" }}
        />
      </div>
    </div>
  );
};

const GlobeMapPart: React.FC = () => {
  const frame = useCurrentFrame();
  const t = THEMES.mixte;

  // Contours "marque" (surcharge LOCALE, ne touche pas THEMES.mixte — pattern identique au proto valide).
  const borderColor = "#1c150a";
  const borderW = 1.1;
  const borderOp = 0.8;

  // Fondu d'entree doux du globe (l'ancien cross-fade depuis le SVG "puits" a ete supprime — le globe
  // ouvre l'Acte 3 directement, plus de registre parchemin en amont).
  const globeFadeIn = interpolate(frame, [0, 20], [0, 1], clampB);

  // ===== CAMERA topdown centree Darfour — echelle CONSTANTE 6.5 sur toute la partie carte.
  // Raccord parfait avec l'insert globe qui DEMARRE a 6.5 puis dezoome : le dezoom devient une action
  // narrative reservee au moment "l'or quitte le pays" (pas un aller-retour d'echelle a la jonction).
  const centerLon = 24;
  const centerLat = 14;

  // MICRO-DERIVE DE FOND (dosage B6, retour Aziz "on NAVIGUE dans le globe, jamais statique") — meme sur
  // la phase topdown des mines : une derive de longitude quasi imperceptible (~±0.35°, parallaxe douce,
  // PAS un glissement) donne de la vie au lieu d'un plan strictement fige. ENVELOPPE stricte a 0 aux DEUX
  // bornes (entree fondu du globe ET raccord vers l'insert a F.end, echelle 6.5) : le raccord
  // Section1->Insert reste EXACT (derniere frame identique a avant), la derive ne vit qu'au milieu.
  // Bornes recalees apres suppression du "puits" (le globe demarre a frame 0 au lieu de 540).
  const s1DriftEnv = interpolate(frame, [20, 120, F.milliard, F.end], [0, 1, 1, 0], clampB);
  const s1DriftLon = 0.35 * Math.sin((frame - 20) / 60) * s1DriftEnv;
  const rotLambda = -(centerLon + s1DriftLon);
  const rotLat = -centerLat;

  const scaleMul = 6.5;

  const proj = orthoAt(rotLambda, rotLat).scale(GLOBE_R * scaleMul);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const sudan = featureByName("Sudan");

  // ── Etats Soudan (North Darfur = RSF, Khartoum = SAF), reveal anime, memes couleurs faction ──
  const statesFC = useSudanStatesGeoJson();
  const northDarfur = statesFC?.features.find((f) => f.properties.name === "North Darfur");
  const khartoumState = statesFC?.features.find((f) => f.properties.name === "Khartoum");
  // Reveals recales -519 (suppression "puits") : le trace des etats se fait a l'ouverture du globe.
  const northDarfurReveal = interpolate(frame, [4, 44], [0, 1], clampB);
  const khartoumReveal = interpolate(frame, [12, 52], [0, 1], clampB);

  const pDarfur = projectPoint(proj, DARFUR, visible);
  const pKhartoum = projectPoint(proj, KHARTOUM, visible);
  const pJebel = projectPoint(proj, JEBEL_AMER, visible);
  const pMine2 = projectPoint(proj, MINE_2, visible);
  const pMine3 = projectPoint(proj, MINE_3, visible);
  // portrait Hemedti — decale du sprite mine Jebel Amer (evite chevauchement), vers l'interieur/est.
  const pHemedti = pJebel ? { x: pJebel.x + 70, y: pJebel.y - 10 } : null;

  // Opacites (reprises fidelement de la Section1 Mapbox originale).
  const rsfHeritedOpacity = interpolate(frame, [F.hemedtiNomme - 20, F.hemedtiNomme], [1, 0], clampB);
  const safOpacity = interpolate(frame, [F.minesOr - 20, F.minesOr, F.end - 60, F.end - 20], [1, 0.15, 0.15, 1], clampB);

  // Halos doux pulsants Darfour/Khartoum des l'ouverture + halo Jebel Amer qui monte/sature.
  const openingPulse = 0.16 + 0.08 * Math.sin(frame * 0.05);
  const openingFade = interpolate(frame, [4, 34], [1, 0], clampB);
  const jebelHalo = interpolate(frame, [F.plusImportante, F.plusImportante + 60], [0, 0.55], clampB);
  const jebelSature = interpolate(frame, [F.milliard, F.milliard + 40], [0, 0.35], clampB);
  const jebelHaloTotal = jebelHalo + jebelSature;

  return (
    <AbsoluteFill style={{ background: t.bg, opacity: globeFadeIn }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="s1AtmoGlobe" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={t.atmoColor} stopOpacity="0" />
            <stop offset="94%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s1OceanGlobe" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="70%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
        </defs>

        <circle cx={W / 2} cy={H / 2} r={GLOBE_R * scaleMul + 26} fill="url(#s1AtmoGlobe)" />
        <path d={sphere} fill="url(#s1OceanGlobe)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
        <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

        {feats.map((f, i) => {
          const name = f.properties.name;
          if (name === "Sudan") return null;
          const d = path(f as any);
          if (!d) return null;
          return <path key={i} d={d} fill={t.land} stroke={borderColor} strokeWidth={borderW} strokeOpacity={borderOp} />;
        })}
        {sudan &&
          (() => {
            const d = path(sudan as any);
            return d ? (
              <path d={d} fill={t.sudanFill} fillOpacity={0.95} stroke={borderColor} strokeWidth={borderW + 0.6} strokeOpacity={Math.min(1, borderOp + 0.08)} />
            ) : null;
          })()}

        {/* halos doux pulsants Darfour/Khartoum des l'ouverture (carte vivante immediatement) */}
        {pDarfur && openingFade > 0.01 && (
          <circle cx={pDarfur.x} cy={pDarfur.y} r={60} fill={RSF_RED} opacity={openingPulse * openingFade * 0.5} />
        )}
        {pKhartoum && openingFade > 0.01 && (
          <circle cx={pKhartoum.x} cy={pKhartoum.y} r={60} fill={SAF_BLUE} opacity={openingPulse * openingFade * 0.5} />
        )}
        {/* halo Jebel Amer : monte au beat 2bis, sature au mot "milliard" */}
        {pJebel && jebelHaloTotal > 0.01 && (
          <circle cx={pJebel.x} cy={pJebel.y} r={90} fill={RSF_RED} opacity={jebelHaloTotal * 0.5} />
        )}

        {/* frontieres d'etats RSF/SAF colorees — "on nomme -> ca se trace" */}
        {northDarfur && (
          (() => {
            const d = path(northDarfur as any);
            return d ? (
              <path d={d} fill={RSF_RED} fillOpacity={0.32 * northDarfurReveal} stroke={RSF_RED} strokeWidth={1.6} strokeOpacity={0.85 * northDarfurReveal} />
            ) : null;
          })()
        )}
        {khartoumState && (
          (() => {
            const d = path(khartoumState as any);
            return d ? (
              <path d={d} fill={SAF_BLUE} fillOpacity={0.32 * khartoumReveal} stroke={SAF_BLUE} strokeWidth={1.6} strokeOpacity={0.85 * khartoumReveal} />
            ) : null;
          })()
        )}

        {/* trait fin mine -> portrait Hemedti (beat 2bis) */}
        {frame >= F.hemedtiNomme && pJebel && pHemedti && (
          <line
            x1={pJebel.x}
            y1={pJebel.y}
            x2={pHemedti.x}
            y2={pHemedti.y}
            stroke="#3A2A18"
            strokeWidth={1.4}
            opacity={0.5 * interpolate(frame, [F.hemedtiNomme, F.hemedtiNomme + 14], [0, 1], clampB)}
          />
        )}
      </svg>

      {/* jetons herites RSF (Darfour) / SAF (Khartoum) — continuite fin Acte 2 */}
      {pDarfur && (
        <div style={{ opacity: rsfHeritedOpacity }}>
          <SoudanToken pos={pDarfur} faction="rsf" frame={frame} appear={F.darfourStart} />
        </div>
      )}
      {pKhartoum && (
        <div style={{ opacity: safOpacity }}>
          <SoudanToken pos={pKhartoum} faction="saf" frame={frame} appear={F.darfourStart} />
        </div>
      )}

      {/* 3 mines d'or dispersees (Darfour, controle RSF) */}
      {frame >= F.minesOr && pJebel && <MineSprite x={pJebel.x} y={pJebel.y} appear={F.minesOr} frame={frame} size={130} />}
      {frame >= F.minesOr + 7 && pMine2 && <MineSprite x={pMine2.x} y={pMine2.y} appear={F.minesOr + 7} frame={frame} size={112} fade={0.9} />}
      {frame >= F.minesOr + 14 && pMine3 && <MineSprite x={pMine3.x} y={pMine3.y} appear={F.minesOr + 14} frame={frame} size={108} fade={0.85} />}

      {/* portrait Hemedti, ecarte de la mine Jebel Amer */}
      {frame >= F.hemedtiNomme && pHemedti && <PortraitToken x={pHemedti.x} y={pHemedti.y} appear={F.hemedtiNomme} frame={frame} />}

      {/* PLAQUE SOURCE (passe finale polish, 2026-07-22, migree depuis l'ancien SoudanActe3.tsx perime
          vers ce fichier ACTIF) — Jebel Amer/Al Junaid ~1 Md USD, calee juste apres le mot "milliard".
          Section courte (643f) : le hold ne va pas jusqu'au bout, coupe par la fin de section — normal. */}
      <SourcePlaque frame={frame} appear={F.milliard + 15} text="US Treasury / The Sentry, 2023-2025" />
    </AbsoluteFill>
  );
};

// SourcePlaque — bandeau SOURCE discret, bas-droite, 1 ligne, style sobre parchemin (recette exacte
// SoudanActe3GlobeInsert.tsx, recopiee a l'identique). Fade in 10f / hold 54f / fade out 12f = ~1.8s.
const SourcePlaque: React.FC<{ text: string; appear: number; frame: number; holdFrames?: number }> = ({ text, appear, frame, holdFrames = 54 }) => {
  if (frame < appear || frame > appear + holdFrames + 12) return null;
  const op = interpolate(frame, [appear, appear + 10, appear + holdFrames, appear + holdFrames + 12], [0, 1, 1, 0], clampB);
  return (
    <div style={{ position: "absolute", right: 40, bottom: 40, opacity: op, pointerEvents: "none",
      background: "rgba(242,229,200,0.86)", border: "1px solid rgba(58,42,24,0.35)", borderRadius: 4,
      padding: "5px 12px", maxWidth: 620, boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, color: "#3A2A18",
        letterSpacing: 0.2, whiteSpace: "nowrap" }}>
        {text}
      </span>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// COMPOSANT RACINE — Section 1 (Globe D3 des mines) + audio p1 SANS PUITS.
// L'ancien SVG "puits sans fond" (Beat1Paradoxe) + son narratif d'ouverture ont ete supprimes
// (decision Aziz 2026-07-22). Audio = acte3-suivre-lor-p1-sans-puits.mp3 (p1 re-coupee a 17.30s,
// demarre sur "Tout commence au Darfour"). Original p1 conserve intact en public/.
// ═════════════════════════════════════════════════════════════════════════════
export const SoudanActe3Section1Globe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte3-suivre-lor-p1-sans-puits.mp3")} />

      <Sequence from={F.darfourStart} durationInFrames={26}>
        <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={F.minesOr} durationInFrames={18}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={F.minesOr + 7} durationInFrames={18}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={F.minesOr + 14} durationInFrames={18}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={F.hemedtiNomme} durationInFrames={22}>
        <Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.5} />
      </Sequence>

      {/* Globe D3 des mines du Darfour — ouvre directement l'Acte 3 (plus de SVG "puits" en amont),
          fondu d'entree doux [0,20]. */}
      <GlobeMapPart />
    </AbsoluteFill>
  );
};

export default SoudanActe3Section1Globe;
