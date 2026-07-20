/**
 * SoudanActe3Section1Globe — SECTION 1 "SUIVRE L'OR" (0->38.8s) REFAITE EN VUE GLOBE D3 INTEGRALE.
 *
 * But (decide avec Aziz 2026-07-19) : supprimer un registre visuel. Avant : SVG intro (Beat1Paradoxe)
 * + Mapbox 2D (Section1 dans SoudanActe3.tsx) + Globe D3 (protos de calage) = 3 registres qui ne se
 * parlent pas. Apres : SVG intro + Globe D3 = 2 registres, raccord direct par cross-fade doux.
 *
 * Modele repris fidelement :
 *  - Partie A (0->523) : Beat1Paradoxe COPIE A L'IDENTIQUE depuis SoudanActe3.tsx (jauge or qui fuit
 *    + tuyaux R/S). Zero modification — il gere deja son propre fade de sortie (483->523).
 *  - Partie B (523->1162) : Globe D3, meme moteur EXACT que SoudanActe3GlobeMinesProto.tsx (echelle
 *    "topdown" + contours "marque", tous deux valides par Aziz), enrichi avec TOUT le contenu de la
 *    Section1 Mapbox originale (frontieres RSF/SAF, jetons herites, 3 mines, portrait Hemedti, halos).
 *
 * Cross-fade : le globe apparait par un fondu doux [483,540] pendant que le SVG s'efface [483,523]
 * (demande explicite Aziz) — pas de coupe franche entre les 2 registres.
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
// TIMING — ancrages whisker p1 (frames absolues @30fps), identiques a soudanActe3Timing F1.
// ─────────────────────────────────────────────────────────────────────────────
const F = {
  start: 0,
  pourtant: 134,
  quelquUnPaie: 302,
  suivreArgent: 367,
  darfourStart: 523,
  minesOr: 619,
  plusImportante: 667,
  hemedtiNomme: 847,
  milliard: 1114,
  end: 1162,
};

export const SECTION1_GLOBE_FRAMES = 1162;

// ── Coordonnees geo (identiques Section1 Mapbox original, pour fidelite) ──
const DARFUR: LonLat = [26.0, 14.9];
const KHARTOUM: LonLat = [32.55, 15.6];
const JEBEL_AMER: LonLat = [23.706, 13.834];
const MINE_2: LonLat = [24.9, 12.05];
const MINE_3: LonLat = [23.4, 15.5];

// ═════════════════════════════════════════════════════════════════════════════
// PARTIE A — Beat1Paradoxe, COPIE A L'IDENTIQUE depuis SoudanActe3.tsx (ne pas modifier).
// SVG plein ecran, 0->523 (0->17.4s), jauge or qui fuit + tuyaux R/S + fleche qui s'inverse.
// ═════════════════════════════════════════════════════════════════════════════
const Beat1Paradoxe: React.FC<{ frame: number }> = ({ frame: f }) => {
  if (f >= 523) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g opacity={f < 483 ? 1 : Math.max(0.35, 1 - 0.65 * ((f - 483) / 40))}><rect x="0" y="0" width="1920" height="1080" fill="#F2E5C8"/><rect x="28" y="28" width="1864" height="1024" rx="10" fill="none" stroke="#3A2A18" strokeWidth="3" opacity="0.2"/><path d="M90 190 C310 155 470 205 690 175 M1240 160 C1480 205 1690 145 1840 185 M110 900 C300 865 490 920 670 890 M1260 910 C1470 870 1670 925 1840 880" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.08"/><defs><linearGradient id="goldLiquidGradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop offset="0%" stopColor="#E0BC8A"/><stop offset="52%" stopColor="#D4A574"/><stop offset="100%" stopColor="#B8935C"/></linearGradient><clipPath id="goldLevelClip"><rect x="880" y="0" width="160" height="1" transform={`translate(0 1014) scale(1 ${-(f < 134 ? 188 + 184 * Math.pow(1 - f / 134, 1.8) : f < 302 ? 188 - 4 * Math.sin((f - 134) * 0.11) : f < 367 ? 188 + 66 * ((f - 302) / 65) - 3 * Math.sin((f - 302) * 0.11) : 254 - 14 * Math.min(1, (f - 367) / 116) - 3 * Math.sin((f - 367) * 0.09))})`}/></clipPath></defs><g transform="translate(0 -100)"><g opacity={Math.max(0, Math.min(1, (f - 134) / 16))}><circle cx="500" cy="700" r="76" fill="#F2E5C8" stroke="#B14B3C" strokeWidth="9"/><circle cx="500" cy="700" r="63" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.35"/><polygon points="500,666 534,700 500,734 466,700" fill="#B14B3C" stroke="#3A2A18" strokeWidth="3"/><text x="500" y="711" textAnchor="middle" fontFamily="Georgia, serif" fontSize="31" fontWeight="700" fill="#F2E5C8">R</text><circle cx="1420" cy="700" r="76" fill="#F2E5C8" stroke="#3E6E9E" strokeWidth="9"/><circle cx="1420" cy="700" r="63" fill="none" stroke="#3A2A18" strokeWidth="2" opacity="0.35"/><polygon points="1420,666 1454,700 1420,734 1386,700" fill="#3E6E9E" stroke="#3A2A18" strokeWidth="3"/><text x="1420" y="711" textAnchor="middle" fontFamily="Georgia, serif" fontSize="31" fontWeight="700" fill="#F2E5C8">S</text><path d="M570 690 L930 570" fill="none" stroke="#3A2A18" strokeWidth="15" opacity="0.16" strokeLinecap="round"/><path d="M570 690 L930 570" fill="none" stroke="#B14B3C" strokeWidth="7" strokeLinecap="round"/><path d="M1350 690 L990 570" fill="none" stroke="#3A2A18" strokeWidth="15" opacity="0.16" strokeLinecap="round"/><path d="M1350 690 L990 570" fill="none" stroke="#3E6E9E" strokeWidth="7" strokeLinecap="round"/><polygon points="895,568 928,570 904,592" fill="#B14B3C"/><polygon points="1025,568 992,570 1016,592" fill="#3E6E9E"/><g fill="#D4A574" stroke="#3A2A18" strokeWidth="1.5"><circle cx={570 + 360 * ((((f - 134) * 5) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5) % 120) / 120)} r="8"/><circle cx={570 + 360 * ((((f - 134) * 5 + 30) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 30) % 120) / 120)} r="7"/><circle cx={570 + 360 * ((((f - 134) * 5 + 60) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 60) % 120) / 120)} r="8"/><circle cx={570 + 360 * ((((f - 134) * 5 + 90) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 90) % 120) / 120)} r="6"/><circle cx={1350 - 360 * ((((f - 134) * 5) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5) % 120) / 120)} r="8"/><circle cx={1350 - 360 * ((((f - 134) * 5 + 30) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 30) % 120) / 120)} r="7"/><circle cx={1350 - 360 * ((((f - 134) * 5 + 60) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 60) % 120) / 120)} r="8"/><circle cx={1350 - 360 * ((((f - 134) * 5 + 90) % 120) / 120)} cy={690 - 120 * ((((f - 134) * 5 + 90) % 120) / 120)} r="6"/></g><g opacity={f < 286 ? 1 : Math.max(0, (302 - f) / 16)} fill="#F2E5C8" strokeWidth="2.5"><circle cx={570 + 360 * ((((f - 134) * 3 + 8) % 96) / 96)} cy={690 - 120 * ((((f - 134) * 3 + 8) % 96) / 96)} r={3.5 + 1.5 * Math.max(0, Math.sin((f - 134) * 0.24))} stroke="#E0BC8A" opacity={Math.max(0, Math.sin((f - 134) * 0.24))}/><circle cx={570 + 360 * ((((f - 134) * 3 + 56) % 96) / 96)} cy={690 - 120 * ((((f - 134) * 3 + 56) % 96) / 96)} r={3.5 + 1.5 * Math.max(0, Math.sin((f - 134) * 0.24 + 2.4))} stroke="#B14B3C" opacity={Math.max(0, Math.sin((f - 134) * 0.24 + 2.4))}/><circle cx={1350 - 360 * ((((f - 134) * 3 + 26) % 96) / 96)} cy={690 - 120 * ((((f - 134) * 3 + 26) % 96) / 96)} r={3.5 + 1.5 * Math.max(0, Math.sin((f - 134) * 0.24 + 1.2))} stroke="#E0BC8A" opacity={Math.max(0, Math.sin((f - 134) * 0.24 + 1.2))}/><circle cx={1350 - 360 * ((((f - 134) * 3 + 74) % 96) / 96)} cy={690 - 120 * ((((f - 134) * 3 + 74) % 96) / 96)} r={3.5 + 1.5 * Math.max(0, Math.sin((f - 134) * 0.24 + 3.6))} stroke="#3E6E9E" opacity={Math.max(0, Math.sin((f - 134) * 0.24 + 3.6))}/></g></g><g opacity={Math.max(0, Math.min(1, (f - 302) / 12))}><path d="M1920 360 L990 570" fill="none" stroke="#8A8F94" strokeWidth="24" opacity="0.1" strokeLinecap="round"/><path d="M1920 360 L990 570" fill="none" stroke="#8A8F94" strokeWidth="10" strokeDasharray="18 17" strokeDashoffset={f < 367 ? -f * 5 : f * 6} strokeLinecap="round" opacity="0.9"/><polygon points={f < 367 ? '1275,480 1238,514 1287,513' : '1637,404 1674,370 1625,371'} fill="#8A8F94" stroke="#3A2A18" strokeWidth="2"/><g fill="#8A8F94" stroke="#3A2A18" strokeWidth="1.5"><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4) % 140) / 140) : 990 + 930 * ((((f - 367) * 5) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4) % 140) / 140) : 570 - 210 * ((((f - 367) * 5) % 140) / 140)} r="10"/><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4 + 35) % 140) / 140) : 990 + 930 * ((((f - 367) * 5 + 35) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4 + 35) % 140) / 140) : 570 - 210 * ((((f - 367) * 5 + 35) % 140) / 140)} r="8"/><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4 + 70) % 140) / 140) : 990 + 930 * ((((f - 367) * 5 + 70) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4 + 70) % 140) / 140) : 570 - 210 * ((((f - 367) * 5 + 70) % 140) / 140)} r="11"/><circle cx={f < 367 ? 1920 - 930 * ((((f - 302) * 4 + 105) % 140) / 140) : 990 + 930 * ((((f - 367) * 5 + 105) % 140) / 140)} cy={f < 367 ? 360 + 210 * ((((f - 302) * 4 + 105) % 140) / 140) : 570 - 210 * ((((f - 367) * 5 + 105) % 140) / 140)} r="8"/></g></g><g><ellipse cx="960" cy="570" rx="66" ry="17" fill="#3A2A18" opacity="0.22"/><ellipse cx="960" cy="570" rx="53" ry="11" fill="#D4A574" stroke="#3A2A18" strokeWidth="3"/><rect x="900" y="560" width="120" height="470" rx="8" fill="#F2E5C8" fillOpacity="0.72" stroke="#3A2A18" strokeWidth="8"/><g clipPath="url(#goldLevelClip)">{[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => { const by = 996 - i * 34; return (<g key={i} transform={`translate(0 ${by})`}><rect x="922" y="0" width="76" height="27" rx="4" fill="#D4A574" stroke="#8A6A2E" strokeWidth="1.5"/><rect x="927" y="4" width="66" height="19" rx="2.5" fill="none" stroke="#B8935C" strokeWidth="1" opacity="0.7"/><circle cx="960" cy="13.5" r="8" fill="#E6C98A" stroke="#8A6A2E" strokeWidth="1"/><text x="960" y="19" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" fill="#6B4E1C">$</text></g>); })}</g><path d="M916 1014 L1004 1014" stroke="#3A2A18" strokeWidth="4" opacity="0.5"/><g fill="none" stroke="#3A2A18" strokeWidth="3" opacity="0.3"><path d="M900 650 L914 650 M900 760 L914 760 M900 870 L914 870 M900 980 L914 980 M1006 650 L1020 650 M1006 760 L1020 760 M1006 870 L1020 870 M1006 980 L1020 980"/></g><g fill="none" stroke="#3A2A18" strokeWidth="3" clipPath="url(#goldLevelClip)"><path d="M900 650 L914 650 M900 760 L914 760 M900 870 L914 870 M900 980 L914 980 M1006 650 L1020 650 M1006 760 L1020 760 M1006 870 L1020 870 M1006 980 L1020 980"/></g><ellipse cx="960" cy="1028" rx="25" ry="8" fill="#3A2A18"/><ellipse cx="960" cy="1029" rx="15" ry="5" fill="#D4A574"/></g>{[0,16,32,48].map((ph, i) => { const p = ((f * 7 + ph) % 62); const bx = [952,968,959,944][i] + [5,4,7,3][i] * Math.sin(f * [0.13,0.11,0.09,0.15][i] + i); const by = 1028 + p; const op = 1 - p / 62; const rot = -18 + 36 * Math.sin(f * 0.1 + i); return (<g key={i} transform={`translate(${bx} ${by}) rotate(${rot})`} opacity={op}><rect x="-13" y="-8" width="26" height="16" rx="2.5" fill="#D4A574" stroke="#8A6A2E" strokeWidth="1"/><text x="0" y="5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fontWeight="700" fill="#6B4E1C">$</text></g>); })}<line x1="960" y1="1030" x2="960" y2="1080" stroke="#D4A574" strokeWidth="5" strokeDasharray="5 12" strokeDashoffset={-f * 7} opacity="0.75"/></g></g>
      </svg>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PARTIE B — Globe D3 (523->1162), moteur identique SoudanActe3GlobeMinesProto (topdown + marque).
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
          src={staticFile("_shared/sprites/warmap/portrait-rsf.png")}
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

  // Fade doux d'entree du globe pendant que le SVG Beat1Paradoxe s'efface (cross-fade demande par Aziz).
  const globeFadeIn = interpolate(frame, [483, 540], [0, 1], clampB);

  // ===== CAMERA topdown centree Darfour — echelle CONSTANTE 6.5 sur toute la partie carte.
  // Raccord parfait avec l'insert globe qui DEMARRE a 6.5 puis dezoome : le dezoom devient une action
  // narrative reservee au moment "l'or quitte le pays" (pas un aller-retour d'echelle a la jonction).
  const centerLon = 24;
  const centerLat = 14;
  const rotLambda = -centerLon;
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
  const northDarfurReveal = interpolate(frame, [523, 563], [0, 1], clampB);
  const khartoumReveal = interpolate(frame, [531, 571], [0, 1], clampB);

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
  const openingFade = interpolate(frame, [523, 553], [1, 0], clampB);
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
          <SoudanToken pos={pDarfur} faction="rsf" frame={frame} appear={523} />
        </div>
      )}
      {pKhartoum && (
        <div style={{ opacity: safOpacity }}>
          <SoudanToken pos={pKhartoum} faction="saf" frame={frame} appear={523} />
        </div>
      )}

      {/* 3 mines d'or dispersees (Darfour, controle RSF) */}
      {frame >= F.minesOr && pJebel && <MineSprite x={pJebel.x} y={pJebel.y} appear={F.minesOr} frame={frame} size={130} />}
      {frame >= F.minesOr + 7 && pMine2 && <MineSprite x={pMine2.x} y={pMine2.y} appear={F.minesOr + 7} frame={frame} size={112} fade={0.9} />}
      {frame >= F.minesOr + 14 && pMine3 && <MineSprite x={pMine3.x} y={pMine3.y} appear={F.minesOr + 14} frame={frame} size={108} fade={0.85} />}

      {/* portrait Hemedti, ecarte de la mine Jebel Amer */}
      {frame >= F.hemedtiNomme && pHemedti && <PortraitToken x={pHemedti.x} y={pHemedti.y} appear={F.hemedtiNomme} frame={frame} />}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// COMPOSANT RACINE — Section 1 integrale (SVG intro + Globe D3) + audio p1.
// ═════════════════════════════════════════════════════════════════════════════
export const SoudanActe3Section1Globe: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte3-suivre-lor-p1.mp3")} />

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

      {/* Globe D3 SOUS le SVG — masque jusqu'a 523, puis apparait par cross-fade doux (483->540)
          pendant que le SVG Beat1Paradoxe s'efface (483->523). */}
      <GlobeMapPart />

      <Beat1Paradoxe frame={frame} />
    </AbsoluteFill>
  );
};

export default SoudanActe3Section1Globe;
