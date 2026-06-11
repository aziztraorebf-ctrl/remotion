// Beat5MaliVivant — "Pendant ce temps, le Mali" — réécriture from scratch
// localF = frame (standalone, durationInFrames=651)
// Souleymane walk/throne supprimés (complexité/bug scale)

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator, AtlasPulseMarker } from "../_shared/atlas-components";
import {
  WIDTH as W,
  HEIGHT as H,
  STATIONS,
  PALETTE,
  makeMapCoord,
  MERC_LARGE,
  ISO_PLAGUE,
} from "./mapConfig";
import {
  caravanePositions,
  bearingAlongRoute,
  ROUTES_GEO,
} from "../_shared/geoUtils";

const { OCEAN, MALI_GOLD, PARCHMENT, PARCHMENT_DARK, PARCHMENT_INK, PLAGUE_RED } = PALETTE;
const MALI_GOLD_VIVID = "#e8b84b";
const EUROPE_SICK = "#4a4a6a";

// Pays zone Mali (illumine en or)
const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
  "GHA", "CIV", "TGO", "BEN", "NGA",
]);

// ─── PIVOTS LOCAUX (0-based, calculés depuis forced-alignment) ───────────────
// f0  = f2323 audio = "Pendant ce temps"
// f47 = f2370 audio = "Souleymane"
// f80 = mosquée + marché apparaissent
// f318 = f2641 audio = "L'or du Mali part en caravane"
// f380 = f2703 audio = "Maghreb"
// f430 = bateau part
// f458 = f2781 audio = "Florence"
// f483 = f2806 audio = "Venise"
// f500 = pull-back Europe
// f520 = f2843 annotations

const F_MALI_GLOW    = 0;
const F_MOSQUEE      = 60;
const F_MARCHE       = 80;
const F_CARAVANE     = 318;  // "L'or du Mali part en caravane"
const F_MAGHREB      = 380;  // "Maghreb"
const F_BATEAU       = 430;
const F_FLORENCE     = 458;
const F_VENISE       = 483;
const F_PULLBACK     = 500;
const F_ANNOTATION_1 = 520;
const F_ANNOTATION_2 = 560;
const F_SOURCE       = 530;
const BEAT_DUR       = 651;

// ─── SOUS-COMPOSANTS ─────────────────────────────────────────────────────────

interface StaticSpriteProps {
  href: string;
  x: number; y: number;
  // displayH = hauteur cible en pixels écran (indépendante du zoom)
  displayH: number;
  srcW: number; srcH: number;
  opacity?: number;
  localF?: number;
  bob?: boolean;
}

const StaticSprite: React.FC<StaticSpriteProps> = ({
  href, x, y, displayH, srcW, srcH, opacity = 1, localF = 0, bob = false,
}) => {
  const scale = displayH / srcH;
  const dy = bob ? Math.sin(localF * 0.1) * 2 : 0;
  return (
    <g transform={`translate(${x} ${y + dy})`} opacity={opacity}>
      <image
        href={staticFile(href)}
        x={-srcW * scale / 2} y={-srcH * scale}
        width={srcW * scale} height={srcH * scale}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
};

interface AnimatedRouteProps {
  fromX: number; fromY: number;
  toX: number; toY: number;
  startAt: number; endAt: number;
  localF: number; camScale: number;
  color?: string; strokeWidthBase?: number;
}

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({
  fromX, fromY, toX, toY, startAt, endAt, localF, camScale,
  color = MALI_GOLD_VIVID, strokeWidthBase = 3.5,
}) => {
  if (localF < startAt - 3) return null;
  const progress = interpolate(localF, [startAt, endAt], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (progress <= 0) return null;
  const ex = fromX + (toX - fromX) * progress;
  const ey = fromY + (toY - fromY) * progress;
  const opacity = interpolate(localF, [startAt, startAt + 10], [0, 0.9], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const sw = strokeWidthBase / camScale;
  const angle = Math.atan2(ey - fromY, ex - fromX) * 180 / Math.PI;
  return (
    <g opacity={opacity}>
      <line x1={fromX} y1={fromY} x2={ex} y2={ey}
            stroke={color} strokeWidth={sw + 3 / camScale}
            strokeOpacity={0.2} strokeLinecap="round" />
      <line x1={fromX} y1={fromY} x2={ex} y2={ey}
            stroke={color} strokeWidth={sw} strokeLinecap="round"
            style={{ filter: "drop-shadow(0px 1px 2px rgba(26,10,0,0.7))" }} />
      {progress > 0.08 && (
        <polygon points="-6,-3 5,0 -6,3"
                 transform={`translate(${ex} ${ey}) rotate(${angle})`}
                 fill={color} opacity={Math.min(1, progress * 5)} />
      )}
    </g>
  );
};

interface LabelProps {
  x: number; y: number; text: string;
  appearAt: number; localF: number;
  color?: string; size?: number;
}

const Label: React.FC<LabelProps> = ({
  x, y, text, appearAt, localF, color = PARCHMENT, size = 11,
}) => {
  const opacity = interpolate(localF, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (opacity < 0.01) return null;
  return (
    <text x={x} y={y} textAnchor="middle" fill={color}
          fontSize={size} fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight={700} letterSpacing={1.2} opacity={opacity}
          style={{ filter: "drop-shadow(0px 1px 2px #000)" }}>
      {text}
    </text>
  );
};

interface AnnotationProps {
  text: string; appearAt: number; hideAt: number;
  localF: number; bottom?: number;
}

const Annotation: React.FC<AnnotationProps> = ({
  text, appearAt, hideAt, localF, bottom = 140,
}) => {
  const fadeIn  = interpolate(localF, [appearAt, appearAt + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(localF, [hideAt, hideAt + 12], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const slideX  = interpolate(localF, [appearAt, appearAt + 15], [-20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity < 0.01) return null;
  return (
    <div style={{
      position: "absolute", bottom, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      opacity, transform: `translateX(${slideX}px)`, pointerEvents: "none",
    }}>
      <div style={{
        background: PARCHMENT_INK, border: `1px solid ${PARCHMENT_DARK}`,
        padding: "5px 18px", borderRadius: 3,
      }}>
        <span style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 14, color: PARCHMENT,
          letterSpacing: "0.08em", fontWeight: 700,
        }}>
          {text}
        </span>
      </div>
    </div>
  );
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export const Beat5MaliVivant: React.FC = () => {
  const localF = useCurrentFrame(); // 0-based, standalone

  // ── C4 CAMÉRA TRACK CONTINU ───────────────────────────────────────────────────
  // Phase A (0→120) : pan vertical Sahara→Mali, scale 1.1→1.75
  // Phase B (120→318) : stable sur Mali/Niani
  // Phase C (318→430) : TRACK SERRÉ sur la caravane (scale ~3.2), la caméra SUIT le
  //                     point de focus le long de la route courbe (plus de drift fixe).
  // Transition continue C→D : le focus glisse du Maghreb vers la mer (pas de cut).
  // Phase D (430→500) : suit le bateau puis pull-back vue Méditerranée.
  // Phase E (500→651) : pull-back final vue large Europe vs Mali.

  // Progress de la caravane le long du path (recalculé tôt pour le track).
  // C2 EASING + RALENTI (retour Aziz : trop rapide, on a le temps). Trajet étalé sur une
  // fenêtre plus large (départ doux dès f315) et easing ADOUCI (moins d'accélération centrale
  // = marche posée, pas de "sprint" au milieu du Sahara).
  const CARAV_START = 315;
  const CARAV_END = 428; // arrive ~"bateau" (f426)
  const caravProgForCam = interpolate(localF, [CARAV_START, CARAV_END], [0, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0.0, 0.6, 1), // ease-in-out doux, vitesse plus constante
  });
  // Point de focus caméra en coords SVG (indépendant de la caméra) :
  // - pendant la caravane : sa position courante sur le path (turf along, SVG projeté)
  // - sinon : Niani (avant) / Maghreb→mer (après)
  const camFocusSvg: [number, number] = (() => {
    if (localF < F_CARAVANE) return [STATIONS.NIANI.x, STATIONS.NIANI.y + 8];
    if (localF <= F_BATEAU) {
      const p = caravanePositions(ROUTES_GEO.CARAVANE_OR, caravProgForCam, 1, 0)[0];
      return p;
    }
    // transition continue Maghreb -> milieu Méditerranée (suit le bateau), puis large
    const tMer = interpolate(localF, [F_BATEAU, F_PULLBACK], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const medX = (STATIONS.MAGHREB.x + STATIONS.VENISE.x) / 2;
    const medY = (STATIONS.MAGHREB.y + STATIONS.VENISE.y) / 2;
    return [
      STATIONS.MAGHREB.x + (medX - STATIONS.MAGHREB.x) * tMer,
      STATIONS.MAGHREB.y + (medY - STATIONS.MAGHREB.y) * tMer,
    ];
  })();

  // C4+ ZOOM AGRESSIF sur les sprites (retour Aziz) : caravane suivie à ~4.6, bateau gardé
  // serré à ~4.0 tant qu'il est visible, puis pull-back final seulement à partir de F_PULLBACK.
  // Zoom CONTINU dès le début (retour : éviter le plateau 1.75 stagnant f120-200 pendant
  // que la voix introduit Mansa/Tombouctou — léger rapprochement permanent = respiration).
  const camScale = interpolate(
    localF,
    [  0,  60, 120, 200, F_CARAVANE, F_CARAVANE + 28, CARAV_END, F_BATEAU, F_PULLBACK - 6, F_PULLBACK + 60, BEAT_DUR],
    [1.1, 1.4, 1.62, 1.9,    2.05,            4.6,      4.6,      4.0,           4.0,            0.85,    0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Quand on track (phase C/D début) : centrer le focus SVG -> driftX/Y dérivés.
  // makeMapCoord : screenX = (x - cx)*scale + cx + driftX. Pour centrer focus au milieu
  // de l'écran (W/2) : driftX = W/2 - ((fx - cx)*scale + cx).
  const trackOn = localF >= F_CARAVANE - 10 && localF <= F_PULLBACK;
  const trackBlend = interpolate(localF,
    [F_CARAVANE - 10, F_CARAVANE + 10, F_PULLBACK - 20, F_PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cxMap = W / 2, cyMap = H / 2;
  const driftXtrack = W / 2 - ((camFocusSvg[0] - cxMap) * camScale + cxMap);
  const driftYtrack = H / 2 - ((camFocusSvg[1] - cyMap) * camScale + cyMap);

  // Drift de base (phases A/B/E, hors track) — conserve l'ancien cadrage.
  const driftXbase = interpolate(localF,
    [0, F_CARAVANE, F_PULLBACK, F_PULLBACK + 60, BEAT_DUR],
    [0, -20, 120, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftYbase = interpolate(localF,
    [0, 60, 120, 200, F_CARAVANE, F_PULLBACK, BEAT_DUR],
    [-120, 80, 80, 105, 80, 60, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const driftX = trackOn ? driftXbase + (driftXtrack - driftXbase) * trackBlend : driftXbase;
  const driftY = trackOn ? driftYbase + (driftYtrack - driftYbase) * trackBlend : driftYbase;

  const mc = makeMapCoord(camScale, driftX, driftY);

  const [nianiX,    nianiY]    = mc(STATIONS.NIANI.x,      STATIONS.NIANI.y);
  const [tombX,     tombY]     = mc(STATIONS.TOMBOUCTOU.x,  STATIONS.TOMBOUCTOU.y);
  const [maghrebX,  maghrebY]  = mc(STATIONS.MAGHREB.x,     STATIONS.MAGHREB.y);
  const [florenceX, florenceY] = mc(STATIONS.FLORENCE.x,    STATIONS.FLORENCE.y);
  const [veniseX,   veniseY]   = mc(STATIONS.VENISE.x,      STATIONS.VENISE.y);

  // ── EFFETS COULEUR ───────────────────────────────────────────────────────────
  // C3 : glow Mali SUBTIL pendant la caravane (le jaune plein 0.65 écrasait les sprites).
  // Fill bas + stroke net = "Mali vivant" sans voler la vedette. Pulse léger sur le stroke
  // (parade Gemini : animer le stroke, pas un dimmer du fill).
  const maliGlow = interpolate(localF, [F_MALI_GLOW, 60, F_CARAVANE, F_PULLBACK], [0, 0.30, 0.22, 0.45], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const maliStrokePulse = 0.5 + 0.5 * Math.sin(localF * 0.06);

  // Europe gris maladif léger dès f0 (continuité Beat4) — fond neutre malade.
  const europeBaseGrey = interpolate(localF, [0, 30], [0.18, 0.25], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // C6 — PROPAGATION ROUGE depuis le PORT d'accostage (Venise/Italie), pas un cut uniforme.
  // Le rouge naît quand le bateau accoste (F_VENISE) et s'étale par distance à Venise (vecteur
  // commercial maritime). Chaque pays a son propre déclin -> "tache d'encre" qui raccorde
  // visuellement le bateau à l'effondrement (parade Gemini+Kimi : lien cause/effet visible).
  const VENISE_DIST: Record<string, number> = {
    SVN: 0.0, AUT: 0.01, HRV: 0.03, ITA: 0.0, CHE: 0.04, CZE: 0.09, HUN: 0.10,
    SRB: 0.12, DEU: 0.13, BEL: 0.17, POL: 0.18, ROU: 0.19, BGR: 0.21, NLD: 0.25,
    GRC: 0.25, DNK: 0.28, UKR: 0.34, ESP: 0.35, GBR: 0.42, FRA: 0.42, IRL: 0.44,
    PRT: 0.49, SWE: 0.55, NOR: 1.0,
  };
  const PLAGUE_START = F_VENISE;     // le rouge naît à l'accostage
  const PLAGUE_SWEEP = 70;           // l'onde balaie l'Europe sur ~2.3s
  const PLAGUE_RISE = 20;
  const europeRedFor = (iso: string): number => {
    const start = PLAGUE_START + (VENISE_DIST[iso] ?? 0.5) * PLAGUE_SWEEP;
    return interpolate(localF, [start, start + PLAGUE_RISE], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  };

  // ── MOSQUÉE TOMBOUCTOU (f60 → fin) — scale fixe = 20 / camScale ─────────────
  const mosqueeOpacity = interpolate(
    localF, [F_MOSQUEE, F_MOSQUEE + 15, F_PULLBACK - 20, F_PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── MARCHÉ NIANI (f80 → fin) — scale fixe = 18 / camScale ──────────────────
  const marcheOpacity = interpolate(
    localF, [F_MARCHE, F_MARCHE + 15, F_PULLBACK - 20, F_PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── CARAVANE (f318 → f430) — toute la route Niani→Maghreb ──────────────────
  // progress 0→1.0 sur toute la route CARAVANE_OR, disparaît quand bateau démarre
  // même fenêtre + easing que la caméra (C2 ralenti) pour que sprites et track restent synchro
  const caravaneProgress = interpolate(
    localF, [CARAV_START, CARAV_END], [0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0.0, 0.6, 1) }
  );
  const caravaneFadeIn  = interpolate(localF, [CARAV_START, CARAV_START + 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const caravaneFadeOut = interpolate(localF, [CARAV_END - 4, CARAV_END + 10], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const caravaneOpacity = Math.min(caravaneFadeIn, caravaneFadeOut);
  const caravaneVisible = localF >= CARAV_START && localF <= CARAV_END + 10;

  // ── C1 CHORÉGRAPHIE : file en SERPENTIN sur le path courbe (pattern Mansa S3) ──
  // Au lieu d'un décalage pixel fixe sur l'axe de marche (effet "bloc qui glisse"),
  // chaque membre suit le MÊME path CARAVANE_OR avec un retard de DISTANCE (spacingKm) +
  // un jitter latéral organique (anti "train de métro", parade Gemini+Kimi).
  // caravanePositions place déjà N membres à leaderKm - i*spacingKm sur la route courbe.
  const CARAVANE_SPACING_KM = 95; // distance entre membres le long de la route (étalé, anti-empilement)

  // 6 membres : tête marchand, puis âne, cheval, 3 porteurs (file resserrée).
  // jitterPx = micro-décalage latéral fixe par membre (perpendiculaire à la marche) pour
  // casser la ligne parfaite. Déterministe (pas de Math.random au render).
  // displayH réduit (track serré scale 3.2 -> sprites occupaient trop l'écran).
  const caravaneMembers = [
    { basePath: "atlas/peste-1347/assets/characters/marchand-berbere/animations/walk/east", frameCount: 4, srcW: 64, srcH: 64, displayH: 52, tick: 6, phase: 0,  jitterPx: 0   },
    { basePath: "atlas/peste-1347/assets/characters/ane-caravane/animations/walk/east",     frameCount: 4, srcW: 64, srcH: 64, displayH: 46, tick: 6, phase: 3,  jitterPx: 8   },
    { basePath: "atlas/peste-1347/assets/characters/cheval-bat/animations/walk/east",       frameCount: 4, srcW: 64, srcH: 64, displayH: 50, tick: 6, phase: 6,  jitterPx: -7  },
    { basePath: "atlas/peste-1347/assets/characters/porteur-mali/animations/walk/east",     frameCount: 6, srcW: 64, srcH: 64, displayH: 45, tick: 5, phase: 10, jitterPx: 6   },
    { basePath: "atlas/peste-1347/assets/characters/porteur-mali/animations/walk/east",     frameCount: 6, srcW: 64, srcH: 64, displayH: 45, tick: 5, phase: 13, jitterPx: -9  },
    { basePath: "atlas/peste-1347/assets/characters/porteur-mali/animations/walk/east",     frameCount: 6, srcW: 64, srcH: 64, displayH: 45, tick: 5, phase: 16, jitterPx: 10  },
  ];

  // Positions SVG de chaque membre sur le path courbe (retard de distance déterministe).
  let caravaneSvgPositions: Array<[number, number]> = [];
  let caravaneBearing = 0;
  if (caravaneVisible) {
    caravaneSvgPositions = caravanePositions(
      ROUTES_GEO.CARAVANE_OR, caravaneProgress, caravaneMembers.length, CARAVANE_SPACING_KM
    );
    caravaneBearing = bearingAlongRoute(ROUTES_GEO.CARAVANE_OR, caravaneProgress);
  }
  const caravaneFlipX = (caravaneBearing > -90 && caravaneBearing < 90) ? 1 : -1;

  // ── BATEAU BÉZIER (f430 → f483 accostage Venise) ────────────────────────────
  // Mouvement RALENTI + easing naturel (retour Aziz : trop rapide/petit avant).
  // easeInOut : départ doux du port, glisse, ralentit à l'accostage.
  const bateauRaw = interpolate(localF, [F_BATEAU, F_VENISE], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bateauProgress = Easing.bezier(0.42, 0, 0.58, 1)(bateauRaw); // ease-in-out maritime
  const bateauFadeIn  = interpolate(localF, [F_BATEAU, F_BATEAU + 16], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bateauFadeOut = interpolate(localF, [F_PULLBACK - 15, F_PULLBACK], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bateauScale = 88 / 30; // displayH=88px (agrandi de 65), srcH=30px
  // Bateau sur la flèche linéaire Maghreb→Florence (même interpolation que AnimatedRoute)
  const bateauX = maghrebX + (florenceX - maghrebX) * bateauProgress;
  const bateauY = maghrebY + (florenceY - maghrebY) * bateauProgress;
  const bateauBob = Math.sin(localF * 0.18) * 2.5;

  // ── SOURCE ───────────────────────────────────────────────────────────────────
  const sourceOpacity = interpolate(localF, [F_SOURCE, F_SOURCE + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      <Sequence from={0} premountFor={30}>
        <Audio
          src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
          startFrom={2323}
          volume={1}
          trimAfter={2323 + BEAT_DUR}
        />
      </Sequence>

      {/* Musique retirée : posée en 1 piste continue au concat final. */}

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        <AtlasMercator
          countries={MERC_LARGE.countries}
          highlightFills={{}}
          driftX={driftX} driftY={driftY} scale={camScale}
          width={W} height={H}
        />

        {/* Mali or — fill subtil + FRONTIÈRES NETTES (encre) pour que le territoire se LISE
            (retour Aziz : Mali quasi invisible, frontières noyées dans l'or-sur-or). */}
        {maliGlow > 0.01 && (
          <g transform={`translate(${W/2+driftX} ${H/2+driftY}) scale(${camScale}) translate(${-W/2} ${-H/2})`}>
            {/* couche 1 : fill or subtil */}
            {(MERC_LARGE.countries as Array<{iso:string;d:string}>)
              .filter(c => ISO_MALI_ZONE.has(c.iso))
              .map(c => (
                <path key={`fill-${c.iso}`} d={c.d}
                      fill={MALI_GOLD} fillOpacity={maliGlow} stroke="none" />
              ))}
            {/* couche 2 : frontières internes en encre (contraste sur l'or) */}
            {(MERC_LARGE.countries as Array<{iso:string;d:string}>)
              .filter(c => ISO_MALI_ZONE.has(c.iso))
              .map(c => (
                <path key={`bord-${c.iso}`} d={c.d}
                      fill="none"
                      stroke={PARCHMENT_INK}
                      strokeOpacity={0.55}
                      strokeWidth={0.6 / camScale}
                      strokeLinejoin="round" />
              ))}
          </g>
        )}

        {/* C6 — Europe : fond gris maladif léger + ROUGE PESTE qui se propage depuis le
            port d'accostage (Venise/Italie). Tache d'encre par distance, pas un cut uniforme.
            CLIP Europe continentale : FRA/NOR/NLD/PRT/SWE ont des territoires lointains (Guyane,
            Svalbard, Caraïbes, Açores) qui rougissaient en pleine mer (bug repéré Aziz 2026-06-08). */}
        <defs>
          <clipPath id="europeClipB5">
            <rect x={118} y={236} width={470} height={328} />
          </clipPath>
        </defs>
        <g transform={`translate(${W/2+driftX} ${H/2+driftY}) scale(${camScale}) translate(${-W/2} ${-H/2})`}
           clipPath="url(#europeClipB5)">
          {(MERC_LARGE.countries as Array<{iso:string;d:string}>)
            .filter(c => ISO_PLAGUE.includes(c.iso as typeof ISO_PLAGUE[number]))
            .map(c => {
              const red = europeRedFor(c.iso);
              return (
                <g key={c.iso}>
                  {/* fond gris malade (continuité) */}
                  <path d={c.d} fill={EUROPE_SICK} fillOpacity={europeBaseGrey} />
                  {/* rouge peste qui monte par-dessus, propagé depuis Venise */}
                  {red > 0.001 && (
                    <path d={c.d} fill={PLAGUE_RED} fillOpacity={red * 0.78} />
                  )}
                </g>
              );
            })}
        </g>

        {/* Mosquée Tombouctou (f60→F_PULLBACK) — 80px de haut, fixe */}
        {mosqueeOpacity > 0.01 && (
          <StaticSprite
            href="atlas/peste-1347/assets/objects/mosquee-tombouctou.png"
            x={tombX} y={tombY}
            displayH={80} srcW={64} srcH={64}
            opacity={mosqueeOpacity}
            bob localF={localF}
          />
        )}
        <Label x={tombX} y={tombY - 88}
               text="TOMBOUCTOU" appearAt={F_MOSQUEE} localF={localF} />

        {/* Marché Niani (f80→F_PULLBACK) — 70px de haut, fixe */}
        {marcheOpacity > 0.01 && (
          <StaticSprite
            href="atlas/peste-1347/assets/objects/marche-tombouctou/static.png"
            x={nianiX + 10} y={nianiY}
            displayH={70} srcW={64} srcH={64}
            opacity={marcheOpacity}
            bob localF={localF}
          />
        )}
        <Label x={nianiX + 10} y={nianiY - 78}
               text="NIANI" appearAt={F_MARCHE} localF={localF} />

        {/* Niani pulse */}
        {localF >= F_MARCHE && localF <= F_PULLBACK && (
          <AtlasPulseMarker coord={[nianiX, nianiY]} beatStart={0}
                            color={MALI_GOLD} ringInner={3} ringOuter={16} />
        )}

        {/* Routes or : Niani→Tombouctou→Maghreb */}
        <AnimatedRoute
          fromX={nianiX} fromY={nianiY} toX={tombX} toY={tombY}
          startAt={F_CARAVANE} endAt={F_CARAVANE + 32}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID}
        />
        <AnimatedRoute
          fromX={tombX} fromY={tombY} toX={maghrebX} toY={maghrebY}
          startAt={F_CARAVANE + 32} endAt={F_MAGHREB}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID}
        />

        {/* C1 — Caravane en SERPENTIN : chaque membre placé sur le path courbe (retard de
            distance) + jitter latéral perpendiculaire à la marche (anti train-de-métro). */}
        {caravaneVisible && caravaneOpacity > 0.01 && (() => {
          // direction de marche -> normale (perpendiculaire) pour le jitter latéral
          const bearing = caravaneBearing * Math.PI / 180;
          const nx = Math.cos(bearing);  // normale au déplacement (axe latéral)
          const ny = Math.sin(bearing);
          return caravaneMembers.map((m, i) => {
            const svgPos = caravaneSvgPositions[i];
            if (!svgPos) return null;
            const [screenX0, screenY0] = mc(svgPos[0], svgPos[1]);
            // jitter latéral en pixels écran (constant à l'écran quel que soit le zoom)
            const screenX = screenX0 + nx * m.jitterPx;
            const screenY = screenY0 + ny * m.jitterPx;
            const scale = m.displayH / m.srcH;
            const frameIdx = Math.floor(Math.max(0, localF - CARAV_START + m.phase) / m.tick) % m.frameCount;
            const frameStr = String(frameIdx).padStart(3, "0");
            const hop = Math.abs(Math.sin((localF + m.phase) * 0.25)) * 2;
            // C5 — ombre au sol : ellipse aplatie bleu-gris, horizontale (ne tourne pas),
            // opacity basse. Reste au sol (screenY) pendant que le sprite saute (hop) = ancrage.
            const shW = m.srcW * scale * 0.42;
            const shH = shW * 0.28;
            return (
              <g key={i} opacity={caravaneOpacity}>
                <ellipse
                  cx={screenX} cy={screenY - 1}
                  rx={shW} ry={shH}
                  fill="#2a3242" opacity={0.22}
                />
                <g transform={`translate(${screenX} ${screenY - hop})`}>
                  <image
                    href={staticFile(`${m.basePath}/frame_${frameStr}.png`)}
                    x={-(m.srcW * scale / 2)} y={-(m.srcH * scale)}
                    width={m.srcW * scale} height={m.srcH * scale}
                    style={{ imageRendering: "pixelated", transform: `scaleX(${caravaneFlipX})` }}
                  />
                </g>
              </g>
            );
          });
        })()}

        {/* Maghreb marker */}
        {localF >= F_MAGHREB && (
          <AtlasPulseMarker coord={[maghrebX, maghrebY]} beatStart={0}
                            color={MALI_GOLD_VIVID} ringInner={3} ringOuter={14} />
        )}
        <Label x={maghrebX} y={maghrebY - 40 / camScale}
               text="MAGHREB" appearAt={F_MAGHREB} localF={localF} />

        {/* Routes maritimes Maghreb→Florence→Venise */}
        <AnimatedRoute
          fromX={maghrebX} fromY={maghrebY} toX={florenceX} toY={florenceY}
          startAt={F_BATEAU} endAt={F_FLORENCE + 15}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID} strokeWidthBase={3}
        />
        <AnimatedRoute
          fromX={florenceX} fromY={florenceY} toX={veniseX} toY={veniseY}
          startAt={F_VENISE - 8} endAt={F_VENISE + 22}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID} strokeWidthBase={3}
        />

        {/* Bateau Bézier */}
        {localF >= F_BATEAU && localF <= F_PULLBACK && (
          <g transform={`translate(${bateauX} ${bateauY + bateauBob})`}
             opacity={Math.min(bateauFadeIn, bateauFadeOut)}>
            <image
              href={staticFile("atlas/peste-1347/assets/objects/bateau-genois.png")}
              x={-(24 * bateauScale / 2)} y={-(30 * bateauScale)}
              width={24 * bateauScale} height={30 * bateauScale}
              style={{ imageRendering: "pixelated" }}
            />
          </g>
        )}

        {/* Florence + Venise markers */}
        {localF >= F_FLORENCE && (
          <AtlasPulseMarker coord={[florenceX, florenceY]} beatStart={0}
                            color={MALI_GOLD} ringInner={2} ringOuter={12} />
        )}
        {localF >= F_VENISE && (
          <AtlasPulseMarker coord={[veniseX, veniseY]} beatStart={0}
                            color={MALI_GOLD} ringInner={2} ringOuter={12} />
        )}
        <Label x={florenceX + 32} y={florenceY - 18}
               text="FLORENCE" appearAt={F_FLORENCE} localF={localF}
               color={MALI_GOLD_VIVID} size={10} />
        <Label x={veniseX + 32}  y={veniseY + 22}
               text="VENISE"   appearAt={F_VENISE}   localF={localF}
               color={MALI_GOLD_VIVID} size={10} />
      </svg>

      {/* Annotations Phase D */}
      <Annotation text="L'EUROPE S'EFFONDRE"
                  appearAt={F_ANNOTATION_1} hideAt={F_ANNOTATION_2 - 2} localF={localF} />
      <Annotation text="LE MALI ALIMENTE SES MONNAIES"
                  appearAt={F_ANNOTATION_2} hideAt={BEAT_DUR} localF={localF} />

      {/* Source Ibn Battuta */}
      {sourceOpacity > 0.01 && (
        <div style={{
          position: "absolute", bottom: 28, left: 0, right: 0,
          display: "flex", justifyContent: "center",
          opacity: sourceOpacity, pointerEvents: "none",
        }}>
          <div style={{
            background: PARCHMENT,
            borderTop: `1.5px solid ${PARCHMENT_DARK}`,
            borderBottom: `1.5px solid ${PARCHMENT_DARK}`,
            padding: "3px 14px",
          }}>
            <span style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 11, color: PARCHMENT_INK,
              letterSpacing: "0.04em", fontWeight: 600,
            }}>
              Ibn Battuta, Rihla (1352) · World History Encyclopedia
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
