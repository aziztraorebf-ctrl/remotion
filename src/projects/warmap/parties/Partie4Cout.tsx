// PARTIE 4 — LE COÛT, LE LEVIER, LA PERSPECTIVE — DERNIÈRE PARTIE (grammaire causale, 2026-06-14).
//
// MODÈLE = Partie3Rupture.tsx (P3 validée Aziz). Plan : PLAN-NARRATIF-P4.md. DA-brief upstream v2 (Gemini+Kimi,
// catalogue + chaînes de réf + revue causale phrase-par-phrase) intégré (synthèse dans le plan). CONCLUSION de
// toute la vidéo : fondu au noir. Triggers VÉRIFIÉS vs narration-v5-alignment.json (corrigent BEATS-V5 décalé).
//
// ARC EN 3 MOUVEMENTS :
//   M1 — LE COÛT (grave/humain) : réfugiés fuient Djibo/Ménaka/Tillabéri (Ph2) → chiffre déplacés ancré (Ph3).
//   M2 — LE LEVIER (doré/ressources) : or Mali+BF (Ph5) → uranium/pétrole Niger (Ph6). ACCUMULATION.
//   M3 — LA PERSPECTIVE (uni/solennel) : confédération 2024 fusion (Ph7) → CFA plein écran (Ph8) → dézoom
//        continental (Ph9-10) → EXTINCTION par couches au noir (Ph11).
//
// GRAMMAIRE CAUSALE (cause précède effet — revue DA v2) :
//   - Ph2 : la ville PULSE rouge sourd (cause : assiégée) → le jeton-visage s'en EXTRAIT → traînée de fuite.
//   - Ph3 : overlay ANCRÉ sur le cluster réfugiés (chiffres = légende des visages, jamais diapo centrée).
//   - Ph4 : PIVOT — RÈGLE CHROMATIQUE : rouge effacé À 0 avant l'or. "terre rouge → terre nue → l'or sort de la terre".
//   - Ph5-6 : contour PULSE → remplissage diffus monte → l'icône ÉMERGE du remplissage (jamais pop sec).
//   - Ph7 : fils des 3 capitales CONVERGENT (l'accord) → fusion or + frontières internes s'effacent → SCEAU tampon.
//   - Ph11 : extinction par COUCHES (timeline meurt en 1er → plaques → contours → grain noir). easeInExpo.
//
// Couche PURE par-dessus la carte (pattern <PartieX>). Reçoit SahelRenderContext + l'instance map.

import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useVideoConfig, Easing } from "remotion";
import type mapboxgl from "mapbox-gl";
import type { SahelRenderContext } from "../engine/SahelContext";
import {
  PAL, spriteMapWidth, countryOutline, lerpHex, smokePingPong,
} from "./warmapPremiumKit";
import type { FlowCorridor } from "../_shared/RefugeeFlow";
import { MapPin, User, Star } from "lucide-react";
import { MALI_RING, NIGER_RING, BURKINA_RING } from "./sahelCountries";
import { WarMapPlaque } from "./WarMapPlaque";
import {
  WarMapOverlayDynamic, TitleReveal, StatCountUp, BadgeRow,
} from "../_shared/WarMapOverlayDynamic";
import { WarMapDimmedOverlay } from "../_shared/WarMapDimmedOverlay";

// ============================================================
// TRIGGERS V5 P4 (alignment narration-v5, ×30fps — VÉRIFIÉS contre narration-v5-alignment.json 2026-06-14)
// ⚠️ Ces frames CORRIGENT BEATS-V5 (calé sur audio antérieur : ex confédération BEATS f11076 → réel f11449).
// ============================================================
const F_START = 9416;       // "Car" derrière — Ph1 bascule militaire→humain (raccord fin P3 f9410)
const F_POPULATIONS = 9615; // "populations"
const F_FAMILLES = 9736;    // "familles" — Ph2 exode
const F_DJIBO = 9790;       // "Djibo"
const F_MENAKA = 9809;      // "Ménaka"
const F_TILLABERI = 9835;   // "Tillabéri"
const F_COUT = 10047;       // "coût" — Ph3 chiffre (figée ~2s)
const F_3M = 10151;         // "trois millions" — déplacés
const F_15M = 10216;        // "quinze" — insécurité
const F_RESSOURCES = 10594; // "ressources" — Ph4 PIVOT
const F_OR = 10667;         // "l'or" — Ph5
const F_OR_BURKINA = 10729; // "Burkina"
const F_URANIUM = 10804;    // "l'uranium" — Ph6
const F_PETROLE = 10835;    // "pétrole"
const F_NIGER_RES = 10851;  // "Niger"
const F_CONFED = 11449;     // "confédération" — Ph7 (figée ~1.5s)
const F_FORCE = 11521;      // "force"
const F_NIAMEY_QG = 11613;  // "Niamey" — sceau se pose
const F_BARKHANE = 11687;   // "Barkhane"
const F_CFA = 11869;        // "CFA" — Ph8 plein écran
const F_PARIS = 11974;      // "Paris"
const F_STATU = 12297;      // "statu" — Ph9 dézoom continental
const F_SOIXANTE = 12331;   // "soixante"
const F_REUSSIR = 12662;    // "réussir" — Ph10 question
const F_RESISTER = 13082;   // "résister" — Ph11 chute finale
const F_CONSTRUIRE = 13200; // "construire"
const F_DURER = 13290;      // "durer" — début extinction
const F_DEMONTRER = 13372;  // "démontrer." — cut to black
const F_END = 13440;        // fin absolue (noir + résonance)

// ── Palette P4 ──
const OR_AES = "#C9A24B";       // levier / AES (continuité P3)
const RED_GRAVE = "#6B1A1A";    // coût humain / gravité (registre grave, jamais vif)
const SAND_FLEE = "#A8895C";    // traînée de fuite (sable désaturé, PAS rouge)
const URANIUM_HI = "#9CA85E";   // jaune-vert terreux désaturé (pas néon)
const INK = PAL.INK;
// Contours nationaux (cohérent SAHEL_COUNTRY_COLORS du moteur)
const C_MALI = "#D98A3D";
const C_BURKINA = "#C0553C";
const C_NIGER = "#4E8C7D";

// ============================================================
// COORDS (lon, lat)
// ============================================================
const BAMAKO: [number, number] = [-8.00, 12.65];
const OUAGA: [number, number] = [-1.52, 12.37];
const NIAMEY: [number, number] = [2.12, 13.51];
const DJIBO: [number, number] = [-1.63, 14.10];      // nord Burkina
const MENAKA: [number, number] = [2.40, 15.92];      // est Mali
const TILLABERI: [number, number] = [1.45, 14.21];   // ouest Niger
const GAO: [number, number] = [-0.04, 16.27];        // nord Mali (4e ville, densité)
const AES_CENTER: [number, number] = [-1.0, 14.5];   // centre du bloc (onde d'union, dézoom)

// ════════════ CHANTIER 1 — EXODE DENSE (refonte DA upstream 2026-06-14) ════════════
// Synthèse 3 voix (G+K+D) dans PLAN-REFONTE-P4.md. Grammaire causale : ville assiégée (pulse rouge=cause)
// → le réfugié S'EXTRAIT (effet) → sillage wet-ink sable = cicatrice. Densité vivante, anti-ballet mécanique :
// COHORTES (pas boucle for), échelle sémantique, easing hétérogène, étoile ASYMÉTRIQUE, profondeur 2.5D top-down.

// Villes de fuite — séquence Ph2 (posées AVANT/au nommage : marqueur Lucide + plaque + countryOutline pulse).
// Gao se pose avec Ménaka (densité nord), non nommée à la voix → léger décalage.
// Marqueur ville = Lucide MapPin (choix Aziz 2026-06-14, test pin/building/tent tranché → pin).
const FLEE_CITIES: { id: string; name: string; coord: [number, number]; at: number; ring: [number, number][]; ringColor: string }[] = [
  { id: "djibo", name: "DJIBO", coord: DJIBO, at: F_DJIBO, ring: BURKINA_RING, ringColor: "#C0553C" },
  { id: "menaka", name: "MÉNAKA", coord: MENAKA, at: F_MENAKA, ring: MALI_RING, ringColor: "#D98A3D" },
  { id: "tillaberi", name: "TILLABÉRI", coord: TILLABERI, at: F_TILLABERI, ring: NIGER_RING, ringColor: "#4E8C7D" },
  { id: "gao", name: "GAO", coord: GAO, at: F_MENAKA + 14, ring: MALI_RING, ringColor: "#D98A3D" },
];

// ⭐ Aziz 2026-06-14 : 5 jetons MAX (= nb de sprites distincts), UN par sprite, chacun UNIQUE. Au-delà = clones
// répétés + brouillon sur la carte. Le VOLUME de la marée est porté par RefugeeFlow (corridors fond) + les
// sillages, PAS par une foule de pastilles. 5 jetons en ÉTOILE : 2 sud (Bénin/CI) / 2 ouest (Mali stable) / 1 est.
// Durées longues + départs étalés sur les noms de villes (Djibo/Ménaka/Tillabéri) → flux qui dure jusqu'au coût.
type Cohort = "famille" | "homme" | "enfant" | "femme";
type FleeUnit = {
  id: string; from: [number, number]; flee: [number, number]; at: number; dur: number;
  cohort: Cohort; mirror: boolean; rot: number; speedBias: number; sprite: string;
};
// Départs TRÈS étalés (f9796 → ~f9990) + durées longues → il reste 2-3 jetons EN TRANSIT quand la plaque coût
// apparaît (f10047) = "le flux continue AUTOUR de la plaque". Le 1er part au nommage Djibo, le dernier après.
const FLEE_UNITS: FleeUnit[] = [
  { id: "u-famille", from: DJIBO,     flee: [-2.4, 11.4], at: F_DJIBO + 6,      dur: 230, cohort: "famille", mirror: false, rot: -2, speedBias: 0.85, sprite: "refugie-famille" },
  { id: "u-femme1",  from: MENAKA,    flee: [-3.0, 15.4], at: F_MENAKA + 14,    dur: 235, cohort: "femme",   mirror: true,  rot: -2, speedBias: 0.9,  sprite: "refugie-femme1" },
  { id: "u-enfant",  from: TILLABERI, flee: [0.6, 11.5],  at: F_TILLABERI + 60, dur: 230, cohort: "enfant",  mirror: true,  rot: 2,  speedBias: 1.2,  sprite: "refugie-enfant" },
  { id: "u-homme",   from: DJIBO,     flee: [-4.8, 13.3], at: F_DJIBO + 150,    dur: 215, cohort: "homme",   mirror: false, rot: 2,  speedBias: 1.15, sprite: "refugie-homme" },
  { id: "u-femme2",  from: MENAKA,    flee: [4.6, 14.6],  at: F_MENAKA + 185,   dur: 220, cohort: "femme",   mirror: false, rot: 1,  speedBias: 0.95, sprite: "refugie-femme2" },
];

// Profondeur 2.5D TOP-DOWN (décision Aziz 14 juin, sans pitch) : jeton plus petit+pâle vers le haut/lointain,
// plus grand+net vers le bas/proche. yNorm = position Y projetée normalisée [0=haut,1=bas].
const depthScale = (yNorm: number) => 0.9 + 0.25 * yNorm;  // 0.9 lointain → 1.15 proche
const depthOp = (yNorm: number) => 0.82 + 0.18 * yNorm;    // 0.82 lointain → 1.0 proche
// échelle sémantique par cohorte (raconte la composition du groupe)
const cohortScale: Record<Cohort, number> = { famille: 1.15, homme: 1.0, enfant: 0.78, femme: 1.0 };
const cohortTrail: Record<Cohort, number> = { famille: 6, homme: 4, enfant: 3, femme: 4 }; // largeur sillage px-ish

// Ressources (Ph5-6) : contour pulse → remplissage → icône émerge
const RESOURCES: { id: string; coord: [number, number]; at: number; icon: string; fillColor: string; ring: [number, number][]; ringColor: string }[] = [
  { id: "or-mali", coord: BAMAKO, at: F_OR, icon: "icon-or", fillColor: OR_AES, ring: MALI_RING, ringColor: C_MALI },
  { id: "or-burkina", coord: OUAGA, at: F_OR_BURKINA, icon: "icon-or", fillColor: OR_AES, ring: BURKINA_RING, ringColor: C_BURKINA },
  { id: "uranium-niger", coord: [2.55, 13.3], at: F_URANIUM, icon: "icon-uranium", fillColor: URANIUM_HI, ring: NIGER_RING, ringColor: C_NIGER },
  { id: "petrole-niger", coord: [1.7, 13.3], at: F_PETROLE, icon: "icon-petrole", fillColor: URANIUM_HI, ring: NIGER_RING, ringColor: C_NIGER },
];

// ════════════ CHANTIER 4 — LA FIN HABITÉE (refonte 2026-06-14) ════════════
// Séquence calée sur Ph10-11 : dirigeants (institutions) → soldats (sécuriser/stabiliser) → menace
// résiduelle (ce qui reste à tenir) → extinction. Ordre STRICT (sinon "qui est qui ?").
const GREEN_AES = "#4E8C7D";     // bordure jeton soldat AES
const THREAT_RED = "#8B0000";    // rouge sang menace (jamais #FF0000)

// Phase 1 — DIRIGEANTS (chacun dans sa capitale), apparition séquentielle ~f12640+
const LEADERS: { id: string; name: string; role: string; coord: [number, number]; at: number; sprite: string }[] = [
  { id: "ml", name: "ASSIMI GOÏTA", role: "Mali", coord: BAMAKO, at: 12640, sprite: "leader-mali" },
  { id: "bf", name: "IBRAHIM TRAORÉ", role: "Burkina Faso", coord: OUAGA, at: 12700, sprite: "leader-burkina" },
  { id: "ne", name: "ABDOURAHAMANE TIANI", role: "Niger", coord: NIAMEY, at: 12760, sprite: "leader-niger" },
];

// Phase 2 — SOLDATS qui tiennent (2/pays), se posent ~f12820+ (sur "sécuriser/stabiliser")
const SOLDIERS: { id: string; coord: [number, number]; at: number }[] = [
  { id: "s-gao", coord: [-0.04, 16.27], at: 12820 },     // Gao (Mali nord)
  { id: "s-menaka", coord: [2.40, 15.92], at: 12850 },   // Ménaka (Mali est)
  { id: "s-djibo", coord: [-1.63, 14.10], at: 12880 },   // Djibo (Burkina nord)
  { id: "s-dori", coord: [-0.03, 14.03], at: 12910 },    // Dori (Burkina nord-est)
  { id: "s-tillaberi", coord: [1.45, 14.21], at: 12940 },// Tillabéri (Niger ouest)
  { id: "s-tahoua", coord: [5.27, 14.89], at: 12970 },   // Tahoua (Niger centre)
];

// Phase 3 — MENACE RÉSIDUELLE : zones CONNUES d'activité JNIM/EIGS (pas positions OSINT exactes — démonstration
// plausible, Aziz). DISPERSÉES sur tout le Sahel (plus de cluster central). Pulsent en séquence ~f13000+.
const THREAT_ZONES: { id: string; coord: [number, number]; r: number; at: number; label: string }[] = [
  { id: "t-mopti", coord: [-3.95, 14.6], r: 0.085, at: 13000, label: "JNIM" },    // centre Mali (Mopti)
  { id: "t-tombouctou", coord: [-3.0, 16.6], r: 0.075, at: 13015, label: "JNIM" },// nord Mali (Tombouctou/Gourma)
  { id: "t-sahel-bf", coord: [-0.8, 14.1], r: 0.07, at: 13030, label: "JNIM" },   // nord Burkina (Sahel/Soum)
  { id: "t-est-bf", coord: [1.0, 12.5], r: 0.065, at: 13045, label: "JNIM" },     // est Burkina (Gourma/Est)
  { id: "t-tripoint", coord: [1.2, 14.9], r: 0.075, at: 13060, label: "EIGS" },   // trois-frontières
  { id: "t-tillaberi", coord: [1.6, 14.0], r: 0.065, at: 13075, label: "EIGS" },  // ouest Niger (Tillabéri)
  { id: "t-diffa", coord: [12.6, 13.3], r: 0.07, at: 13090, label: "EIGS" },      // sud-est Niger (Diffa, lac Tchad)
];

// Frames clés de la fin habitée
const F_LEADERS = 12640;   // dirigeants commencent (réussir / institutions)
const F_SOLDIERS = 12820;  // soldats (sécuriser/stabiliser)
const F_THREAT = 13000;    // menace résiduelle (faire tenir)
const F_EXT_HABITED = 13290; // début extinction sur "durer..."

// ============================================================
// CONFEDERATION REVEAL — overlay PLEIN ÉCRAN solide (doctrine WARMAP-CARTE-VS-OVERLAY 2026-06-14).
// L'acte institutionnel (3 pays signent) = conceptuel, sans ancrage spatial → on sort de la carte.
// Séquence : fond sombre opaque monte → 3 drapeaux AES entrent (gauche/centre/droite) → glissent et se
// resserrent vers le centre → SCEAU "coup de tampon" au contact + titre gravé → hold → sortie (retour carte).
// ============================================================
const ConfederationReveal: React.FC<{
  frame: number; inAt: number; outAt: number; width: number; height: number; vmin: number; fps: number;
}> = ({ frame, inAt, outAt, width, height, vmin, fps }) => {
  if (frame < inAt - 2 || frame > outAt + 2) return null;
  const L = frame - inAt;                         // frame locale
  const cx = width / 2, cy = height * 0.44;        // centre = centerY du template (alignement trou contours)
  const flagW = vmin * 0.13, flagH = flagW * 0.66;
  const spread = vmin * 0.26;                      // écart initial des 3 drapeaux
  // convergence : les drapeaux glissent du large vers le centre [L 18 → 58]
  const conv = interpolate(L, [18, 58], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const flags = [
    { code: "ml", name: "MALI", dir: -1 },
    { code: "bf", name: "BURKINA", dir: 0 },
    { code: "ne", name: "NIGER", dir: 1 },
  ];
  // sceau : apparaît au contact (L 56) en coup de tampon
  const sceauSpring = spring({ frame: L - 56, fps, config: { damping: 9, stiffness: 95, mass: 0.9 } });
  const sceauVisible = L >= 54;
  const R = vmin * 0.085;
  const sy = interpolate(sceauSpring, [0, 0.5, 1], [0.3, 1.15, 1]);
  const impact = Math.max(0, 1 - Math.abs(sceauSpring - 0.55) / 0.35);
  const starD = R * 0.95;
  // titre : se grave après le tampon
  const titleOp = interpolate(L, [70, 86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <WarMapDimmedOverlay frame={frame} inAt={inAt} outAt={outAt} width={width} height={height} centerY={0.44}>
      {/* La scène SPÉCIFIQUE confédération se superpose sur la carte assombrie (voile/halo/grain = template).
          La carte (contours colorés) reste visible derrière ; le sceau passe devant via le trou percé dans la
          couche contours du moteur (SahelWarMapEngine, mask confed-seal-hole). */}

      {/* 3 drapeaux qui convergent vers le centre (avant le sceau) */}
      {!sceauVisible && flags.map((f) => {
        const x = cx + f.dir * spread * conv;
        const appear = interpolate(L, [4 + Math.abs(f.dir) * 4, 18 + Math.abs(f.dir) * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fade = interpolate(L, [50, 56], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // s'effacent quand le sceau naît
        return (
          <div key={f.code} style={{ position: "absolute", left: x, top: cy, transform: "translate(-50%,-50%)",
            opacity: appear * fade, textAlign: "center" }}>
            <img src={staticFile(`_shared/flags/${f.code}.png`)} style={{ width: flagW, height: flagH,
              objectFit: "cover", borderRadius: 6, border: "2px solid rgba(201,162,75,0.7)",
              boxShadow: "0 6px 22px rgba(0,0,0,0.6)", display: "block" }} />
            <div style={{ marginTop: vmin * 0.012, color: "#E8DCC0", fontFamily: "Georgia, serif",
              fontWeight: 800, fontSize: vmin * 0.022, letterSpacing: 2 }}>{f.name}</div>
          </div>
        );
      })}

      {/* SCEAU (coup de tampon au contact des 3 drapeaux) */}
      {sceauVisible && sceauSpring > 0.02 && (
        <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scaleY(${sy}) scale(${Math.min(1, sceauSpring)})` }}>
          <svg width={R * 2.6} height={R * 2.6} viewBox={`${-R * 1.3} ${-R * 1.3} ${R * 2.6} ${R * 2.6}`}
            style={{ display: "block", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.55))" }}>
            {impact > 0.02 && <circle r={R * (1.05 + impact * 0.6)} fill="none" stroke="#C9A24B" strokeWidth={R * 0.05} opacity={impact * 0.7} />}
            <defs>
              <radialGradient id="confed-sceau-grad">
                <stop offset="0%" stopColor="#E9D08A" /><stop offset="68%" stopColor="#C9A24B" /><stop offset="100%" stopColor="#8E6E2C" />
              </radialGradient>
            </defs>
            {/* plaque OPAQUE sombre sous le sceau : empêche les contours de la carte de TRAVERSER le sceau
                (lisibilité — Aziz 2026-06-14). Le sceau est au premier plan, rien ne passe à travers. */}
            <circle r={R * 1.14} fill="#16130c" opacity={0.96} />
            <circle r={R} fill="url(#confed-sceau-grad)" stroke="#3A2A12" strokeWidth={R * 0.045} />
            <circle r={R * 0.84} fill="none" stroke="#F4ECD8" strokeWidth={R * 0.025}
              strokeDasharray={`${R * 0.07} ${R * 0.05}`} opacity={0.85} />
            <Star x={-starD / 2} y={-starD / 2 - R * 0.14} width={starD} height={starD} fill="#F4ECD8" stroke="#F4ECD8" strokeWidth={1} />
            <text y={R * 0.64} textAnchor="middle" fontSize={R * 0.2} fontWeight={800} fill="#3A2A12"
              style={{ fontFamily: "Georgia, serif", letterSpacing: 1 }}>A · E · S</text>
          </svg>
        </div>
      )}

      {/* titre gravé sous le sceau */}
      {titleOp > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: cy + R * 1.5, textAlign: "center", opacity: titleOp }}>
          <div style={{ color: "#C9A24B", fontFamily: "Georgia, serif", fontWeight: 800, fontSize: vmin * 0.05, letterSpacing: 1 }}>
            Confédération AES</div>
          <div style={{ color: "#B8A988", fontFamily: "Georgia, serif", fontSize: vmin * 0.026, letterSpacing: 4, marginTop: vmin * 0.01 }}>
            SEPTEMBRE 2023</div>
        </div>
      )}
    </WarMapDimmedOverlay>
  );
};

// ============================================================
// COMPOSANT — couche P4 par-dessus la carte
// ============================================================
export const Partie4Cout: React.FC<{ ctx: SahelRenderContext | null; map?: mapboxgl.Map | null }> = ({ ctx, map }) => {
  const { fps } = useVideoConfig();
  if (!ctx) return null;
  const { frame, project, width, height } = ctx;
  const vmin = Math.min(width, height);
  const P = (c: [number, number]) => project(c[0], c[1]);

  // ── helpers d'opacité de fenêtre ──
  const win = (a: number, b: number, fadeIn = 12, fadeOut = 12) =>
    interpolate(frame, [a, a + fadeIn, b - fadeOut, b], [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════════════════════════════════════════════════════════
  // M1 — LE COÛT — CHANTIER 1 EXODE DENSE (refonte DA upstream)
  // ════════════════════════════════════════════════════════════════════
  // Fenêtre exode : F_FAMILLES (9736) → l'exode (jetons/villes/sillage) FADE quand le cartouche coût arrive
  // (Aziz : l'action de fuite a déjà joué, plus besoin de les voir pendant le chiffre). Le cartouche est central
  // opaque, la carte autour montre l'aftermath calme. Fade complété peu après F_COUT.
  const EXODE_OUT = F_COUT + 24;

  // ── easing hétérogène par cohorte (DA : jamais linéaire, "initiatives individuelles") ──
  // famille = lent et lourd (easeInOut doux) · homme = direct (légère accélération) · enfant = précipité
  // (accélère vite) · femme = peut marquer une micro-pause (épuisement).
  const cohortEase: Record<Cohort, (t: number) => number> = {
    famille: (t) => t * t * (3 - 2 * t),                       // smoothstep (départ/arrivée doux, lourd)
    homme: (t) => Math.pow(t, 0.8),                            // direct, légèrement rapide
    enfant: (t) => 1 - Math.pow(1 - t, 2.2),                   // précipité (vite au début)
    femme: (t) => t < 0.45 ? t * 0.9 : 0.405 + (t - 0.45) * 1.08, // micro-pause autour de 0.45 (épuisement)
  };

  // ── VILLES (cause) : posées au nommage, pulse rouge "assiégée", contour pays qui se trace ──
  const cityStates = FLEE_CITIES.map((c) => {
    const appear = c.at;
    const px = P(c.coord);
    // apparition town-td (encre qui sèche) : op 0→1, scale spring 0.9→1
    const townSpring = spring({ frame: frame - appear, fps, config: { damping: 13, stiffness: 120, mass: 0.7 } });
    const townOp = interpolate(frame, [appear, appear + 12, EXODE_OUT, EXODE_OUT + 20], [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // pulse rouge "assiégée" (STROKE only, onde de choc) — court, juste à la pose (la cause)
    const pulse = interpolate(frame, [appear + 2, appear + 12, appear + 34], [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // contour pays qui se trace + flash au nommage
    const oc = countryOutline({ ring: c.ring, project, frame, startF: appear, drawDur: 28, holdDur: 200 });
    return { ...c, px, townSpring: Math.max(0, townSpring), townOp, pulse, oc };
  });

  // ── JETONS RÉFUGIÉS (effet) : s'extraient des villes, profondeur 2.5D, sillage multi-âges ──
  const SILLAGE_LIFE = 60; // frames d'historique (2s) — fade exponentiel ensuite
  const unitStates = FLEE_UNITS.map((u) => {
    const start = u.at + 8;                       // décalage causal : la ville pulse PUIS le jeton part
    const end = start + u.dur;
    const tRaw = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const t = cohortEase[u.cohort](tRaw);
    // position interpolée le long du trajet (from → flee), Bézier léger via point de contrôle décalé
    const ctrl: [number, number] = [
      (u.from[0] + u.flee[0]) / 2 + (u.rot * 0.06),
      (u.from[1] + u.flee[1]) / 2 + 0.25, // léger bombé (contournement organique)
    ];
    const lon = (1 - t) * (1 - t) * u.from[0] + 2 * (1 - t) * t * ctrl[0] + t * t * u.flee[0];
    const lat = (1 - t) * (1 - t) * u.from[1] + 2 * (1 - t) * t * ctrl[1] + t * t * u.flee[1];
    const pos = project(lon, lat);
    const yNorm = Math.max(0, Math.min(1, pos.y / height));
    // taille = base carte × échelle cohorte × profondeur 2.5D
    const D = spriteMapWidth(project, lon, lat, 0.78) * cohortScale[u.cohort] * depthScale(yNorm);
    // opacité : apparition → vie → fade en sortant du cadre (bord) ou au board clearing
    const appearOp = interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const edgeFade = interpolate(tRaw, [0.9, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // "brume de sable"
    const clearFade = interpolate(frame, [EXODE_OUT - 20, EXODE_OUT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const op = appearOp * edgeFade * clearFade * depthOp(yNorm);
    // sillage wet-ink : positions passées (historique limité SILLAGE_LIFE), 3 âges (frais/mi-vie/fantôme)
    const stamps: { x: number; y: number; r: number; age: number }[] = [];
    if (frame > start && op > 0.02) {
      const from = Math.max(start, frame - SILLAGE_LIFE);
      for (let f = from; f <= frame; f += 3) {
        const tt = cohortEase[u.cohort](interpolate(f, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const plon = (1 - tt) * (1 - tt) * u.from[0] + 2 * (1 - tt) * tt * ctrl[0] + tt * tt * u.flee[0];
        const plat = (1 - tt) * (1 - tt) * u.from[1] + 2 * (1 - tt) * tt * ctrl[1] + tt * tt * u.flee[1];
        const pp = project(plon, plat);
        const age = (frame - f) / SILLAGE_LIFE; // 0=frais → 1=vieux
        stamps.push({ x: pp.x, y: pp.y, r: cohortTrail[u.cohort] * 1.5 * (0.7 + 0.5 * (1 - age)), age });
      }
    }
    // poussière au départ (desertDust/smoke micro) — court
    const dust = smokePingPong({ frame, startF: start - 4, fps, fadeIn: 8 });
    const dustOp = interpolate(frame, [start - 4, start + 6, start + 26], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const zIndex = Math.floor(pos.y);
    return { ...u, pos, D, op, stamps, dust, dustOp, zIndex };
  });

  // ── RefugeeFlow : corridors de fond (op basse) vers sud / ouest / est ──
  const FLOW_CORRIDORS: FlowCorridor[] = [
    { id: "f-sud", waypoints: [[-0.5, 14.4], [-0.3, 13.2], [-0.1, 12.0]], triggerFrame: F_DJIBO + 20, drawDuration: 90, weight: 2 },
    { id: "f-ouest", waypoints: [[0.2, 15.0], [-1.8, 14.6], [-3.6, 14.2]], triggerFrame: F_MENAKA + 20, drawDuration: 95, weight: 1.5 },
    { id: "f-est", waypoints: [[1.8, 15.2], [2.8, 14.6], [3.8, 14.0]], triggerFrame: F_TILLABERI + 20, drawDuration: 90, weight: 1 },
  ];
  const flowOp = interpolate(frame, [F_DJIBO + 20, F_DJIBO + 60, EXODE_OUT - 20, EXODE_OUT],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════════════════════════════════════════════════════════
  // M2 — LE LEVIER (accumulation : les icônes RESTENT)
  // ════════════════════════════════════════════════════════════════════
  const resStates = RESOURCES.map((r) => {
    // contour pulse au nommage (cause : le sol révèle sa richesse)
    const oc = countryOutline({ ring: r.ring, project, frame, startF: r.at - 6, drawDur: 30, holdDur: 80 });
    const pulse = interpolate(frame, [r.at - 6, r.at + 10, r.at + 50], [0, 1, 0.25],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // remplissage diffus qui monte dans le contour (donnée qui se montre)
    const fillT = interpolate(frame, [r.at, r.at + 40], [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // l'icône émerge du remplissage (spring overshoot) — APRÈS le remplissage (cause→effet)
    const emerge = spring({ frame: frame - (r.at + 18), fps, config: { damping: 9, stiffness: 120, mass: 0.7 } });
    // accumulation : reste jusqu'au board clearing Ph7 (les ressources persistent)
    const op = interpolate(frame, [r.at + 14, r.at + 30, F_CONFED - 30, F_CONFED + 10],
      [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const px = P(r.coord);
    const D = spriteMapWidth(project, r.coord[0], r.coord[1], 1.0, { min: width * 0.045, max: width * 0.09 });
    // halos dorés "le monde en a besoin" pour le Niger (Ph6) — ondulation sobre depuis Niamey
    const worldHalo = r.id.includes("niger")
      ? interpolate(frame, [F_PETROLE + 20, F_PETROLE + 80, F_CONFED - 40], [0, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
    return { ...r, oc, pulse, fillT, emerge: Math.max(0, emerge), op, px, D, worldHalo };
  });

  // ════════════════════════════════════════════════════════════════════
  // M3 — LA PERSPECTIVE
  // ════════════════════════════════════════════════════════════════════

  // Ph7 — fils convergents (cause) → fusion or (effet) → sceau tampon
  const beamsT = interpolate(frame, [F_CONFED, F_CONFED + 28], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });       // fils des capitales convergent
  const fuseT = interpolate(frame, [F_CONFED + 22, F_CONFED + 70], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });       // fusion or (après contact)
  const sceauSpring = spring({ frame: frame - F_NIAMEY_QG, fps, config: { damping: 8, stiffness: 90, mass: 0.9 } });
  const sceauOp = interpolate(frame, [F_NIAMEY_QG, F_NIAMEY_QG + 18, F_CFA - 30, F_CFA], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap = [BAMAKO, OUAGA, NIAMEY].map(P);
  const centerPx = P(AES_CENTER);
  const niameyPx = P(NIAMEY);
  // onde d'union (DA-brief) : cercle doré expansif depuis le centre après la fusion
  const unionWave = interpolate(frame, [F_CONFED + 40, F_CONFED + 75], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ph11 — extinction par couches
  const extTimeline = interpolate(frame, [F_DURER, F_DURER + 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const extPlaques = interpolate(frame, [F_DURER + 12, F_DURER + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // grain noir qui monte (easeInExpo : lent puis accélère)
  const blackRaw = interpolate(frame, [F_DURER + 20, F_DEMONTRER + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blackT = Math.pow(blackRaw, 3); // ease-in cubique (proche easeInExpo, lisible)
  // éclat doré sur le sceau au "construire"
  const constructFlash = interpolate(frame, [F_CONSTRUIRE, F_CONSTRUIRE + 6, F_CONSTRUIRE + 26], [0, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });


  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* éclat doré "construire" (Ph11) */}
      {constructFlash > 0.01 && <AbsoluteFill style={{ background: OR_AES, opacity: constructFlash, mixBlendMode: "screen" }} />}

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {RESOURCES.map((r) => {
            const px = r.ring.map(([lon, lat]) => project(lon, lat));
            const d = px.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
            return <clipPath key={r.id} id={`p4-clip-${r.id}`}><path d={d} /></clipPath>;
          })}
          {[MALI_RING, BURKINA_RING, NIGER_RING].map((ring, i) => {
            const px = ring.map(([lon, lat]) => project(lon, lat));
            const d = px.map((p, k) => `${k === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
            return <clipPath key={i} id={`p4-fuse-${i}`}><path d={d} /></clipPath>;
          })}
        </defs>

        {/* ════ M1 EXODE : SILLAGE wet-ink sable (mask flouté, nappe multiply) — la cicatrice des trajets ════
             3 âges simultanés (frais/mi-vie/fantôme) via opacité décroissante des stamps. blur fin = intersections
             lisibles, pas un blob. Regroupé sous un mask : la nappe sable n'apparaît QUE sous les empreintes. */}
        {frame >= F_FAMILLES && frame < EXODE_OUT && (
          <>
            <defs>
              <filter id="p4-sillage-blur"><feGaussianBlur stdDeviation="7" /></filter>
              <mask id="p4-sillage-mask">
                <g filter="url(#p4-sillage-blur)">
                  {unitStates.flatMap((u) =>
                    u.stamps.map((s, i) => (
                      <circle key={`${u.id}-${i}`} cx={s.x} cy={s.y} r={s.r}
                        fill="#fff" opacity={Math.max(0, (1 - s.age * s.age)) * 0.9} />
                    ))
                  )}
                </g>
              </mask>
            </defs>
            {/* nappe sable révélée par le mask (multiply sur le parchemin) */}
            <rect x={0} y={0} width={width} height={height} fill={SAND_FLEE}
              mask="url(#p4-sillage-mask)" opacity={0.78} style={{ mixBlendMode: "multiply" }} />
          </>
        )}

        {/* ════ M1 EXODE : pulse rouge "ville assiégée" (STROKE only, onde de choc = la CAUSE) ════ */}
        {frame >= F_FAMILLES - 10 && frame < EXODE_OUT && cityStates.map((c) => c.pulse > 0.01 && (
          <circle key={`pulse-${c.id}`} cx={c.px.x} cy={c.px.y} r={vmin * 0.018 * (0.5 + c.pulse * 1.6)}
            fill="none" stroke={RED_GRAVE} strokeWidth={vmin * 0.005 * (1 - c.pulse * 0.5)}
            opacity={c.pulse * 0.6} />
        ))}

        {/* ════ M1 EXODE : contour pays qui se TRACE au nommage (ancre la ville dans son territoire) ════ */}
        {frame >= F_FAMILLES - 10 && frame < EXODE_OUT && cityStates.map((c) => c.oc && c.oc.op > 0.01 && (
          <path key={`coc-${c.id}`} d={c.oc.d} fill="none" stroke={c.ringColor}
            strokeWidth={vmin * (0.0035 + c.oc.flash * 0.004)} strokeOpacity={c.oc.op * (0.45 + c.oc.flash * 0.45)}
            strokeDasharray={c.oc.len} strokeDashoffset={c.oc.dashOffset} strokeLinejoin="round" />
        ))}

        {/* ════ M1 EXODE : RefugeeFlow corridors de fond (op basse, volume collectif) ════ */}
        {flowOp > 0.01 && map && (
          <g opacity={flowOp * 0.35}>
            {FLOW_CORRIDORS.map((fc) => {
              const drawn = interpolate(frame, [fc.triggerFrame, fc.triggerFrame + fc.drawDuration], [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (drawn <= 0.01) return null;
              const pts = fc.waypoints.map((w) => project(w[0], w[1]));
              let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
              let len = 0;
              for (let i = 1; i < pts.length; i++) {
                d += `L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
                len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
              }
              return (
                <path key={fc.id} d={d} fill="none" stroke={SAND_FLEE}
                  strokeWidth={vmin * 0.004 * (fc.weight ?? 1)} strokeLinecap="round"
                  strokeDasharray={`${vmin * 0.01} ${vmin * 0.014}`}
                  strokeDashoffset={len * (1 - drawn) - (frame % 60) * 0.5} opacity={0.7} />
              );
            })}
          </g>
        )}

        {/* ════ M2 Ph5-6 : remplissage ressource diffus (clippé au contour) ════ */}
        {resStates.map((r) => r.op > 0.01 && r.fillT > 0.01 && (
          <g key={`fill-${r.id}`} clipPath={`url(#p4-clip-${r.id})`}>
            <rect x={0} y={0} width={width} height={height} fill={r.fillColor}
              opacity={r.op * r.fillT * 0.18} style={{ mixBlendMode: "multiply" }} />
          </g>
        ))}

        {/* ════ M2 Ph5-6 : contours qui pulsent au nommage ════ */}
        {resStates.map((r) => r.oc && r.op > 0.01 && (
          <path key={`oc-${r.id}`} d={r.oc.d} fill="none" stroke={r.ringColor}
            strokeWidth={vmin * (0.004 + r.pulse * 0.004)} strokeOpacity={r.op * (0.5 + r.pulse * 0.45)}
            strokeDasharray={r.oc.len} strokeDashoffset={r.oc.dashOffset} strokeLinejoin="round" />
        ))}

        {/* ════ M2 Ph6 : halos dorés "le monde en a besoin" (Niger) ════ */}
        {resStates.filter((r) => r.worldHalo > 0.01).map((r, i) => (
          <circle key={`halo-${r.id}`} cx={niameyPx.x} cy={niameyPx.y}
            r={vmin * (0.08 + 0.14 * ((frame % 90) / 90))}
            fill="none" stroke={OR_AES} strokeWidth={2}
            opacity={r.worldHalo * 0.3 * (1 - (frame % 90) / 90)} />
        ))}

        {/* ════ M3 Ph7 : liens orthogonaux RETIRÉS (doctrine WARMAP-CARTE-VS-OVERLAY, Aziz 2026-06-14).
             L'ACCORD institutionnel = conceptuel, sans ancrage spatial → il passe en OVERLAY PLEIN ÉCRAN
             (ConfederationReveal ci-dessous), pas en métaphore plaquée sur la carte. CE QUI RESTE sur la
             carte = la fusion territoriale or (ça, c'est spatial : 3 pays → 1 bloc soudé). ════ */}

        {/* ════ M3 Ph7 : fusion or — les 3 pays se SOUDENT en un bloc (SPATIAL → légitime sur la carte) ════ */}
        {fuseT > 0.01 && [MALI_RING, BURKINA_RING, NIGER_RING].map((ring, i) => {
          const px = ring.map(([lon, lat]) => project(lon, lat));
          const d = px.map((p, k) => `${k === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
          return (
            <g key={`fuse-${i}`}>
              {/* remplissage or SUBTIL (0.18 max — fix jaune pisseux Chantier 3 : le SENS est porté par le
                  contour or épais ci-dessous, pas par le fill. L'or doit rester NOBLE, jamais jaune sale). */}
              <g clipPath={`url(#p4-fuse-${i})`}>
                <rect x={0} y={0} width={width} height={height} fill={OR_AES}
                  opacity={fuseT * 0.18} style={{ mixBlendMode: "multiply" }} />
              </g>
              {/* contour or net du périmètre = le bloc qui se soude (le plus lisible) */}
              <path d={d} fill="none" stroke={OR_AES} strokeWidth={vmin * 0.005}
                strokeOpacity={fuseT * 0.9} strokeLinejoin="round" />
            </g>
          );
        })}

        {/* ════ M3 Ph7 : onde d'union (cercle doré expansif depuis le centre) ════ */}
        {unionWave > 0.01 && unionWave < 0.99 && (
          <circle cx={centerPx.x} cy={centerPx.y} r={vmin * 0.5 * unionWave}
            fill="none" stroke={OR_AES} strokeWidth={3} opacity={(1 - unionWave) * 0.6} />
        )}
      </svg>

      {/* ════ M1 EXODE : VILLES = ICÔNE LUCIDE sur disque parchemin (Aziz 2026-06-14 : test pin/building/tent) ════
           Icône Lucide nette sur pastille parchemin (anneau couleur pays). ANCRÉ, ne bouge JAMAIS, distinct du
           jeton-réfugié. TEST : 1 icône par ville + le nom de l'icône sous le label pour trancher. */}
      {frame >= F_FAMILLES - 10 && frame < EXODE_OUT && cityStates.map((c) => {
        if (c.townOp <= 0.02 || c.townSpring <= 0.02) return null;
        const TD = vmin * 0.04;
        const sc = interpolate(c.townSpring, [0, 1], [0.85, 1]); // encre qui sèche : 0.85→1
        const Icon = MapPin;
        const isz = TD * 0.56;
        return (
          <div key={`town-${c.id}`} style={{ position: "absolute", left: c.px.x, top: c.px.y,
            transform: `translate(-50%,-50%) scale(${sc})`, opacity: c.townOp, zIndex: 5 }}>
            {/* ombre DURE au sol (ancrage ville) */}
            <div style={{ position: "absolute", left: "50%", top: "86%", width: TD * 0.66, height: TD * 0.16,
              transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.5)", borderRadius: "50%", filter: "blur(2.5px)" }} />
            {/* disque parchemin + anneau couleur pays */}
            <div style={{ width: TD, height: TD, borderRadius: "50%", background: "#F0E7CC",
              border: `${Math.max(2, TD * 0.08)}px solid ${c.ringColor}`, display: "flex", alignItems: "center",
              justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.45)" }}>
              <Icon size={isz} color={INK} strokeWidth={2.4} />
            </div>
          </div>
        );
      })}

      {/* ════ M1 EXODE : plaques-nom villes (texte PRIME, z-index haut) ════ */}
      {frame >= F_FAMILLES - 10 && frame < EXODE_OUT && cityStates.map((c) => {
        const lblOp = interpolate(frame, [c.at + 4, c.at + 16, EXODE_OUT - 20, EXODE_OUT], [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (lblOp <= 0.02) return null;
        return (
          <div key={`lbl-${c.id}`} style={{ position: "absolute", left: c.px.x, top: c.px.y - vmin * 0.052,
            transform: "translate(-50%,-50%)", opacity: lblOp, textAlign: "center", zIndex: 200, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: vmin * 0.02, color: INK, letterSpacing: 1,
              textShadow: "0 0 4px #EADBC6, 0 0 4px #EADBC6, 0 0 4px #EADBC6" }}>{c.name}</div>
          </div>
        );
      })}

      {/* ════ M1 EXODE : JETONS RÉFUGIÉS (12, cohortes) — l'EFFET. Profondeur 2.5D top-down (z-index par latitude,
           échelle+opacité par Y), variété miroir+rotation, poussière au départ. chip = ombre FLOTTANTE + sillage. */}
      {frame >= F_FAMILLES && frame < EXODE_OUT && [...unitStates].sort((a, b) => a.zIndex - b.zIndex).map((u) => {
        if (u.op <= 0.02 || u.D <= 1) return null;
        const breathe = 1 + 0.035 * Math.sin((frame + u.id.charCodeAt(1)) * 0.09);
        return (
          <div key={`ref-${u.id}`} style={{ position: "absolute", left: u.pos.x, top: u.pos.y,
            transform: `translate(-50%,-50%) scale(${breathe})`, opacity: u.op, zIndex: 20 + (u.zIndex % 100) }}>
            {/* poussière au départ (micro, sable) */}
            {u.dust && u.dustOp > 0.02 && (
              <div style={{ position: "absolute", left: "50%", top: "60%", width: u.D * 1.2, height: u.D * 0.9,
                transform: "translate(-50%,-50%)", opacity: u.dustOp }}>
                <img src={staticFile(`_shared/sprites/warmap/fx-smoke/${u.dust.idx}.png`)}
                  style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(0.6) sepia(0.4) brightness(1.1) opacity(0.7)" }} />
              </div>
            )}
            {/* ombre portée FLOTTANTE (décalée bas-droite, asseoir le jeton) */}
            <div style={{ position: "absolute", left: "54%", top: "78%", width: u.D * 0.8, height: u.D * 0.24,
              transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(5px)" }} />
            <div style={{ width: u.D, height: u.D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6",
              border: `${Math.max(1.5, u.D * 0.05)}px solid ${SAND_FLEE}`, boxShadow: "0 3px 8px rgba(0,0,0,0.45)" }}>
              <img src={staticFile(`_shared/sprites/warmap/${u.sprite}.png`)}
                style={{ width: "120%", height: "120%", objectFit: "cover", objectPosition: "top center",
                  transform: `translate(-8%,2%) scaleX(${u.mirror ? -1 : 1}) rotate(${u.rot}deg)`,
                  filter: `brightness(${0.92 + (u.id.charCodeAt(1) % 5) * 0.04})`, display: "block" }} />
            </div>
          </div>
        );
      })}

      {/* ════ M2 Ph5-6 : icônes ressources qui ÉMERGENT du remplissage ════
           PAS de mixBlendMode multiply ici (noie l'icône claire sur fond parchemin sombre) — les assets Gemini
           ont déjà leur intégration parchemin. Ombre portée SVG-like pour les "asseoir" (DA-brief). */}
      {resStates.map((r) => r.op > 0.02 && r.emerge > 0.02 && (
        <div key={`icon-${r.id}`} style={{ position: "absolute", left: r.px.x, top: r.px.y,
          transform: `translate(-50%,-50%) scale(${Math.min(1, r.emerge)})`, opacity: r.op }}>
          <div style={{ position: "absolute", left: "50%", top: "78%", width: r.D * 0.7, height: r.D * 0.22,
            transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.45)", borderRadius: "50%", filter: "blur(5px)" }} />
          <img src={staticFile(`_shared/sprites/warmap/p4-assets/${r.icon}.png`)}
            style={{ width: r.D, height: r.D, objectFit: "contain", display: "block",
              filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }} />
        </div>
      ))}

      {/* ════ M3 Ph7 : CONFÉDÉRATION = OVERLAY PLEIN ÉCRAN SOLIDE (doctrine WARMAP-CARTE-VS-OVERLAY).
           L'acte institutionnel (3 pays signent) n'a PAS d'ancrage spatial → on SORT de la carte pour le
           montrer en grand, premium, lisible : 3 drapeaux AES glissent vers le centre → fusionnent en SCEAU
           "Septembre 2023 · Confédération AES". Puis retour carte (CFA, dézoom). ════ */}
      <ConfederationReveal frame={frame} inAt={F_FORCE} outAt={F_CFA - 18} width={width} height={height} vmin={vmin} fps={fps} />

      {/* Micro-note "QG ex-base Barkhane" SUPPRIMÉE (Aziz 2026-06-14) : résidu d'adaptations antérieures,
         transparaissait sous l'overlay confédération. L'overlay plein écran porte tout l'acte AES. */}

      {/* ════ COÛT HUMAIN — CARTOUCHE CENTRAL OPAQUE (Aziz 2026-06-14 : overlay central, PAS plein écran — la carte
           reste visible AUTOUR du cartouche, jamais à travers). L'action de fuite a déjà joué → cartouche central.
           Séquence : countup 3M + 3 personnes (TOUTES allumées) → bascule 15M+ cascade 15 (TOUTES allumées),
           multi-rangées empilées + cadre autour des icônes. = Chantier 2 "coût" bouclé ici. */}
      {(() => {
        const op = interpolate(frame, [F_COUT, F_COUT + 16, F_RESSOURCES - 26, F_RESSOURCES - 4], [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0.02) return null;
        const grain = staticFile("_shared/sprites/warmap/paper-grain.png");
        // count-up amorti — phase 1 : 3M (toutes les 3 icônes allumées AVANT la bascule)
        const F_BASCULE = F_COUT + 100;
        const t3 = interpolate(frame, [F_COUT + 16, F_COUT + 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const v3 = (3 * (1 - Math.pow(1 - t3, 3))).toFixed(1).replace(".", ",");
        // phase 2 : 15M+
        const t15 = interpolate(frame, [F_BASCULE, F_BASCULE + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const v15 = Math.round(15 * (1 - Math.pow(1 - t15, 3)));
        const phase2 = frame >= F_BASCULE;
        const nIcons = phase2 ? 15 : 3;
        // cascade calée : phase 1 = 3 icônes allumées d'ici F_BASCULE ; phase 2 = 15 icônes allumées en ~50f.
        const iconStep = phase2 ? 3 : 11;
        const iconStart = phase2 ? F_BASCULE + 4 : F_COUT + 20;
        const slideY = interpolate(frame, [F_COUT, F_COUT + 16], [vmin * 0.03, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <AbsoluteFill style={{ opacity: op, zIndex: 320, alignItems: "center", justifyContent: "center" }}>
            {/* CARTOUCHE central opaque (la carte reste visible AUTOUR, pas à travers) */}
            <div style={{ position: "relative", transform: `translateY(${slideY}px)`, width: "54%", maxWidth: vmin * 1.0,
              background: "#EFE3C2", border: `3px solid ${RED_GRAVE}`, borderRadius: 10,
              boxShadow: "0 14px 40px rgba(0,0,0,0.5)", padding: `${vmin * 0.04}px ${vmin * 0.05}px`,
              textAlign: "center", fontFamily: "Georgia, serif", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${grain})`, backgroundRepeat: "repeat",
                opacity: 0.3, mixBlendMode: "multiply", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: vmin * 0.02, fontWeight: 700, letterSpacing: 4, color: RED_GRAVE,
                  textTransform: "uppercase", marginBottom: vmin * 0.022 }}>Le coût humain</div>
                {/* GRAND CHIFFRE */}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: vmin * 0.012 }}>
                  <span style={{ fontSize: vmin * 0.11, fontWeight: 800, color: phase2 ? RED_GRAVE : INK, lineHeight: 1 }}>
                    {phase2 ? `${v15}+` : v3}</span>
                  <span style={{ fontSize: vmin * 0.035, fontWeight: 700, color: INK }}>millions</span>
                </div>
                <div style={{ fontSize: vmin * 0.02, color: "#5c4a2e", fontStyle: "italic", marginTop: vmin * 0.005 }}>
                  {phase2 ? "en insécurité alimentaire" : "de personnes déplacées"}</div>
                {/* ICÔNES-PERSONNES : multi-rangées, cadre autour, TOUTES allumées en séquence */}
                <div style={{ marginTop: vmin * 0.028, padding: `${vmin * 0.018}px`, borderRadius: 8,
                  border: `1.5px solid rgba(107,26,26,0.35)`, background: "rgba(107,26,26,0.05)",
                  display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center",
                  gap: vmin * 0.006, maxWidth: vmin * 0.5, marginLeft: "auto", marginRight: "auto", minHeight: vmin * 0.09 }}>
                  {Array.from({ length: nIcons }).map((_, i) => {
                    const appearAt = iconStart + i * iconStep;
                    const sp = spring({ frame: frame - appearAt, fps, config: { damping: 12, stiffness: 170, mass: 0.5 } });
                    if (sp <= 0.02) return null;
                    const drop = (1 - Math.min(1, sp)) * vmin * 0.025;
                    return (
                      <div key={i} style={{ transform: `translateY(${drop}px) scale(${Math.min(1, sp)})`, opacity: Math.min(1, sp) }}>
                        <User size={vmin * 0.042} color={RED_GRAVE} strokeWidth={2.2} fill="rgba(107,26,26,0.18)" />
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: vmin * 0.012, color: "#8a7350", marginTop: vmin * 0.02, letterSpacing: 2 }}>
                  SOURCES · OCHA · PAM · HCR</div>
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* ════ M3 Ph7 : overlay confédération SUPPRIMÉ (Aziz 2026-06-14, Chantier 3) — la carte porte le sens :
           le SCEAU "AES · 2024" + la fusion or + les contours nationaux qui se soudent en un bloc disent tout.
           Doctrine MONTRER pas RÉPÉTER (le cartouche redondait la voix = problème #3 du diagnostic). ════ */}

      {/* ════ M3 Ph8 : franc CFA — PLEIN ÉCRAN (concept non-spatial, texte seul) ════ */}
      <WarMapOverlayDynamic
        inAt={F_CFA} outAt={F_STATU - 24} mode="fullscreen" accent={OR_AES}
        blocks={[
          { type: "title", text: "Le franc CFA", at: 0, size: 64 },
          { type: "kicker", text: "encore lié à Paris", at: 24 },
          { type: "kicker", text: "rompre — leur prochaine grande décision ?", at: 52 },
        ]}
      />

      {/* ════════════ CHANTIER 4 — LA FIN HABITÉE (refonte) ════════════
           Ordre STRICT : dirigeants (institutions) → soldats (sécuriser/stabiliser) → menace (ce qui reste à tenir).
           Cause→effet : les dirigeants commandent → les soldats tiennent → la menace demeure. ============ */}

      {/* Phase 3 (SVG, dessous) — MENACE RÉSIDUELLE : taches organiques rouge sang qui pulsent (zones connues) */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {THREAT_ZONES.map((z) => {
          const appear = interpolate(frame, [z.at, z.at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(frame, [F_EXT_HABITED, F_EXT_HABITED + 40], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const pulse = 0.5 + 0.5 * Math.sin((frame - z.at) * 0.12); // pulse régulier (présence, pas alerte)
          const op = appear * fadeOut * (0.22 + pulse * 0.18);
          if (op <= 0.02) return null;
          const c = P(z.coord);
          const rPx = z.r * (P([z.coord[0] + 1, z.coord[1]]).x - c.x); // rayon en px depuis degrés
          return (
            <g key={z.id}>
              <circle cx={c.x} cy={c.y} r={Math.abs(rPx) * (1 + pulse * 0.12)} fill={THREAT_RED}
                opacity={op} style={{ mixBlendMode: "multiply" }} />
            </g>
          );
        })}
      </svg>

      {/* Phase 3 — jetons MENACE (combattant masqué) qui pulsent SANS bouger + étiquette contexte temporaire */}
      {THREAT_ZONES.map((z) => {
        const appear = interpolate(frame, [z.at + 6, z.at + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [F_EXT_HABITED + 10, F_EXT_HABITED + 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = appear * fadeOut;
        if (op <= 0.02) return null;
        const c = P(z.coord);
        const D = vmin * 0.055 * (1 + 0.08 * Math.sin((frame - z.at) * 0.12));
        // Aziz : PAS d'étiquette texte ("JNIM actif" retiré) — l'image du combattant masqué + la tache rouge parlent.
        return (
          <div key={`tj-${z.id}`} style={{ position: "absolute", left: c.x, top: c.y, transform: "translate(-50%,-50%)", opacity: op }}>
            <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#2a2118",
              border: `${Math.max(2, D * 0.06)}px solid ${THREAT_RED}`, boxShadow: "0 3px 8px rgba(0,0,0,0.5)" }}>
              <img src={staticFile("_shared/sprites/warmap/p4-assets/threat-fighter.png")}
                style={{ width: "112%", height: "112%", objectFit: "cover", objectPosition: "top center",
                  transform: "translate(-5%,2%)", display: "block" }} />
            </div>
          </div>
        );
      })}

      {/* Phase 2 — SOLDATS AES qui se POSENT (scale 0→1 easeOutBack) sur les points tenus.
           FOCUS SÉQUENTIEL : s'atténuent à ~55% quand la menace pulse (le regard va vers le danger). */}
      {SOLDIERS.map((s) => {
        const sp = spring({ frame: frame - s.at, fps, config: { damping: 10, stiffness: 130, mass: 0.6 } });
        const attenuate = interpolate(frame, [F_THREAT, F_THREAT + 40], [1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [F_EXT_HABITED + 10, F_EXT_HABITED + 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = interpolate(frame, [s.at, s.at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * attenuate * fadeOut;
        if (op <= 0.02 || sp <= 0.02) return null;
        const c = P(s.coord);
        const D = vmin * 0.05;
        return (
          <div key={s.id} style={{ position: "absolute", left: c.x, top: c.y,
            transform: `translate(-50%,-50%) scale(${Math.min(1.05, sp)})`, opacity: op }}>
            <div style={{ position: "absolute", left: "50%", top: "76%", width: D * 0.8, height: D * 0.24,
              transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(4px)" }} />
            <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6",
              border: `${Math.max(2, D * 0.07)}px solid ${GREEN_AES}`, boxShadow: "0 3px 8px rgba(0,0,0,0.45)" }}>
              <img src={staticFile("_shared/sprites/warmap/p4-assets/soldier-aes.png")}
                style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
                  transform: "translate(-8%,2%)", display: "block" }} />
            </div>
          </div>
        );
      })}

      {/* Phase 1 — DIRIGEANTS dans leurs capitales (chip portrait + plaque nom/rôle), séquentiel.
           FOCUS SÉQUENTIEL : s'atténuent à ~40% quand les soldats arrivent (la hiérarchie du regard reste claire).
           Plaques DÉCALÉES alternées (haut/bas) pour éviter le chevauchement Ouaga/Niamey. */}
      {LEADERS.map((l, idx) => {
        const sp = spring({ frame: frame - l.at, fps, config: { damping: 12, stiffness: 110, mass: 0.8 } });
        // atténuation douce quand la menace pulse (focus séquentiel léger — la plaque partie, le portrait reste fort)
        const attenuate = interpolate(frame, [F_THREAT, F_THREAT + 40], [1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [F_EXT_HABITED + 20, F_EXT_HABITED + 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = interpolate(frame, [l.at, l.at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * attenuate * fadeOut;
        if (op <= 0.02 || sp <= 0.02) return null;
        const c = P(l.coord);
        const D = vmin * 0.105;
        const plaqueAbove = idx % 2 === 1; // alterne : Goïta bas, Traoré haut, Tiani bas
        return (
          <div key={l.id} style={{ position: "absolute", left: c.x, top: c.y,
            transform: `translate(-50%,-50%) scale(${Math.min(1, sp)})`, opacity: op, zIndex: 100 - idx }}>
            {/* portrait en chip (cercle or, le pouvoir) */}
            <div style={{ position: "absolute", left: "50%", top: "76%", width: D * 0.82, height: D * 0.26,
              transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.45)", borderRadius: "50%", filter: "blur(6px)" }} />
            <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6",
              border: `${Math.max(3, D * 0.055)}px solid ${OR_AES}`, boxShadow: "0 5px 12px rgba(0,0,0,0.5)" }}>
              <img src={staticFile(`_shared/sprites/warmap/p4-assets/${l.sprite}.png`)}
                style={{ width: "128%", height: "128%", objectFit: "cover", objectPosition: "top center",
                  transform: "translate(-11%,-2%)", display: "block" }} />
            </div>
            {/* plaque nom + rôle : présente le dirigeant PUIS disparaît juste avant les soldats (Aziz : inutile de
                garder le texte tout le long, le portrait suffit ensuite). Décalée haut OU bas (anti-chevauchement). */}
            {(() => {
              const plaqueOp = interpolate(frame, [l.at + 6, l.at + 18, F_SOLDIERS - 24, F_SOLDIERS - 4], [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (plaqueOp <= 0.02) return null;
              return (
                <div style={{ position: "absolute", left: "50%", opacity: plaqueOp,
                  top: plaqueAbove ? "auto" : "108%", bottom: plaqueAbove ? "108%" : "auto",
                  transform: "translate(-50%,0)", background: "rgba(245,239,214,0.94)", border: `1.5px solid ${OR_AES}`,
                  borderRadius: 4, padding: "3px 10px", whiteSpace: "nowrap", textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontWeight: 800, fontSize: vmin * 0.015, color: INK, letterSpacing: 0.5 }}>{l.name}</div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: vmin * 0.011, color: "#6b5436", fontStyle: "italic" }}>{l.role}</div>
                </div>
              );
            })()}
          </div>
        );
      })}

      {/* ════ M3 Ph11 : extinction par couches — grain noir qui monte (easeIn) ════ */}
      {blackT > 0.005 && <AbsoluteFill style={{ background: "#0a0805", opacity: blackT }} />}

      {/* ════ M3 Ph11 : phrase-morale pendue sur le noir ════ */}
      {(() => {
        const op = interpolate(frame, [F_DEMONTRER, F_DEMONTRER + 14, F_END - 10, F_END], [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return op > 0.02 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: vmin * 0.03, fontWeight: 300,
              color: "#8a7a4a", letterSpacing: 2, textAlign: "center" }}>
              Résister, elle l'a prouvé. Construire, elle a commencé.<br />Durer — reste à le démontrer.
            </div>
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};
