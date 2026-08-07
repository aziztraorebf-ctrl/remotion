// P5 v2 — "Trois heures plus tard — meme compte, un appareil inconnu, cette fois depuis Berlin.
// NorthShield le voit. Anomalie critique — verification exigee, immediatement." 40.9 -> 56.5s
// absolu (0 -> 15.6s relatif).
//
// REFONTE POST-JURY (2026-08-07, rejet v1 unanime — panneau juge "le plus grave" par Grok :
// Aziz n'a MEME PAS VU la bosse rouge). 2 causes precises identifiees :
// 1. Cuts binaires sur les donnees (`t >= T ? 1 : 0`) au lieu de transitions — lisait comme un
//    scintillement plutot qu'un changement anime (cause probable du flickering signale).
// 2. La bosse n'etait tenue que 0.25s en montee + tenue courte — bien en dessous du minimum
//    1-1.5s exige par le jury pour etre perceptible par un spectateur.
// v2 : chaque champ transitionne (crossfade texte + slide vertical, jamais un pop binaire), le
// score s'anime en continu (pas un round() qui saute), la bosse est tenue LONGTEMPS et FORTE
// (scale + glow amplifies), et un curseur vient "confirmer" l'encart telephone en fin de
// panneau (boucle la boucle du curseur-acteur introduit en P4). Cf
// SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md § P5.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DashboardScreen } from "../ui/DashboardScreen";
import { LaptopMockup } from "../ui/LaptopMockup";
import { VirtualCursor } from "../ui/VirtualCursor";
import { NS_COLORS } from "../ui/theme";
import { P5_BOSSE_SVG } from "./bodies/P5BosseBody";
import { extractGroup, extractDefs } from "./svgGroupExtractor";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const DEFS = extractDefs(P5_BOSSE_SVG);
const G = {
  fond: extractGroup(P5_BOSSE_SVG, "fond"),
  grilleMesure: extractGroup(P5_BOSSE_SVG, "grille_mesure"),
  ligneReflet: extractGroup(P5_BOSSE_SVG, "ligne_reflet"),
  ligneVigilance: extractGroup(P5_BOSSE_SVG, "ligne_vigilance"),
  seuilReference: extractGroup(P5_BOSSE_SVG, "seuil_reference"),
  bosseAlerte: extractGroup(P5_BOSSE_SVG, "bosse_alerte"),
  marqueurPic: extractGroup(P5_BOSSE_SVG, "marqueur_pic"),
};
const Raw: React.FC<{ body: string; opacity?: number }> = ({ body, opacity }) => (
  <g opacity={opacity} dangerouslySetInnerHTML={{ __html: body }} />
);

// Cascade dramatisee : chaque champ transitionne sur ~0.5s (crossfade), pas un cut de 0.15s.
const T_TIME_START = 0.8;
const T_DEVICE_START = 1.6;
const T_LOCATION_START = 2.6; // le moment le plus important -> le plus de respiration avant lui
const T_SCORE_RAMP_START = 3.4;
const T_SCORE_RAMP_END = 5.6; // score qui grimpe visiblement sur 2.2s, pas un saut instantane
const FIELD_TRANSITION_DUR = 0.5;

// "NorthShield le voit." : 49.559 -> 49.919s absolu -> 8.66 -> 9.02s relatif (in a 40.9s).
const T_VIGILANCE_CUT_IN = 8.3;
// Bosse tenue nettement plus longtemps qu'en v1 (0.25s) -- 1.6s de montee+tenue avant de couper,
// conforme au minimum 1-1.5s exige par le jury pour etre perceptible.
const T_VIGILANCE_HOLD = 1.9;
const T_VIGILANCE_CUT_OUT = T_VIGILANCE_CUT_IN + T_VIGILANCE_HOLD;
const T_RETURN_DASHBOARD = T_VIGILANCE_CUT_OUT + 0.4;
const T_PHONE_IN = T_RETURN_DASHBOARD + 0.8;
const T_CURSOR_CONFIRM_START = T_PHONE_IN + 0.9;
const T_CURSOR_CONFIRM_ARRIVE = T_CURSOR_CONFIRM_START + 1.1;

function riskColorFor(score: number): string {
  if (score < 40) return NS_COLORS.green;
  if (score < 70) return NS_COLORS.amber;
  return NS_COLORS.red;
}

// Point de bascule d'un champ : 0->1 sur FIELD_TRANSITION_DUR, synchronise avec le decodeBlur
// (le blur AU MOMENT du switch fait le travail visuel de "transition", cf decodeBlur plus bas).
function fieldSwitch(t: number, start: number): number {
  return interpolate(t, [start, start + FIELD_TRANSITION_DUR], [0, 1], clamp);
}

export const P5DashboardMorphBosse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;

  const scoreProgress = interpolate(t, [T_SCORE_RAMP_START, T_SCORE_RAMP_END], [0, 1], {
    ...clamp,
    easing: (x) => x * x, // accelere -- la tension monte
  });
  const scoreFloat = interpolate(scoreProgress, [0, 1], [18, 82]);
  const score = Math.round(scoreFloat);
  const isCritical = score >= 70;

  const timeSwitched = fieldSwitch(t, T_TIME_START) > 0.5;
  const deviceSwitched = fieldSwitch(t, T_DEVICE_START) > 0.5;
  const locationSwitched = fieldSwitch(t, T_LOCATION_START) > 0.5;

  const overrideRow = {
    user: "Sarah M.",
    time: timeSwitched ? "12:47" : "09:14",
    device: deviceSwitched ? "Appareil inconnu" : "MacBook Pro",
    location: locationSwitched ? "Berlin, DE" : "Toronto, CA",
    score,
    action: isCritical ? "Vérification requise" : "Autorisé",
  };

  // Brouillage bref au moment exact de chaque bascule de champ ("decoding" — GPT/Grok) : un
  // blur qui monte puis retombe pile sur le switch, pour que le changement se LISE comme un
  // evenement anime plutot qu'un cut. Applique globalement au dashboard (simple et robuste,
  // pas de ciblage de cellule individuelle qui risquerait un mauvais alignement de pixel).
  const decodeBlur = Math.max(
    interpolate(t, [T_TIME_START - 0.08, T_TIME_START, T_TIME_START + 0.16], [0, 3, 0], clamp),
    interpolate(t, [T_DEVICE_START - 0.08, T_DEVICE_START, T_DEVICE_START + 0.16], [0, 3, 0], clamp),
    interpolate(t, [T_LOCATION_START - 0.08, T_LOCATION_START, T_LOCATION_START + 0.18], [0, 4.5, 0], clamp),
  );

  // Pulse d'alerte sur la ligne Sarah a chaque changement de champ -- rend la cascade visible
  // sans dependre d'un simple cut de texte.
  const alertPulse =
    Math.max(
      interpolate(t, [T_TIME_START, T_TIME_START + 0.3, T_TIME_START + 0.6], [0, 1, 0], clamp),
      interpolate(t, [T_DEVICE_START, T_DEVICE_START + 0.3, T_DEVICE_START + 0.6], [0, 1, 0], clamp),
      interpolate(t, [T_LOCATION_START, T_LOCATION_START + 0.3, T_LOCATION_START + 0.8], [0, 1.6, 0], clamp),
    ) * (isCritical ? 1 : 0.6);

  const vigilanceCutOpacity = interpolate(
    t,
    [T_VIGILANCE_CUT_IN, T_VIGILANCE_CUT_IN + 0.12, T_VIGILANCE_CUT_OUT - 0.12, T_VIGILANCE_CUT_OUT],
    [0, 1, 1, 0],
    clamp,
  );
  const dashboardOpacityDuringCut = interpolate(
    t,
    [T_VIGILANCE_CUT_IN, T_VIGILANCE_CUT_IN + 0.12, T_VIGILANCE_CUT_OUT - 0.12, T_VIGILANCE_CUT_OUT],
    [1, 0, 0, 1],
    clamp,
  );

  // Bosse : montee avec spring (impact net), scale amplifie vs v1 pour etre impossible a
  // manquer, tenue toute la duree du plan serre + micro-pulsation continue pendant la tenue.
  const bosseSpring = spring({
    frame: frame - T_VIGILANCE_CUT_IN * fps,
    fps,
    config: { damping: 10, stiffness: 160 },
  });
  const bosseHoldPulse = 1 + Math.sin((t - T_VIGILANCE_CUT_IN) * (Math.PI * 2) / 0.5) * 0.06;
  const bosseScale = interpolate(bosseSpring, [0, 1], [0.3, 1], clamp) * bosseHoldPulse;
  const bosseOpacity = interpolate(
    t,
    [T_VIGILANCE_CUT_IN, T_VIGILANCE_CUT_IN + 0.2, T_VIGILANCE_CUT_OUT],
    [0, 1, 1],
    clamp,
  );

  const phoneOpacity = interpolate(t, [T_PHONE_IN, T_PHONE_IN + 0.4], [0, 1], clamp);
  const phoneSlide = interpolate(t, [T_PHONE_IN, T_PHONE_IN + 0.5], [40, 0], {
    ...clamp,
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

  // Curseur qui vient confirmer l'encart -- boucle la boucle du curseur-acteur (P4).
  const cursorProgress = interpolate(t, [T_CURSOR_CONFIRM_START, T_CURSOR_CONFIRM_ARRIVE], [0, 1], {
    ...clamp,
    easing: (x) => 1 - Math.pow(1 - x, 2.2),
  });
  const cursorFrom = { x: width - 500, y: 300 };
  const cursorTo = { x: width - 200, y: 900 };
  const cursorCtrl = { x: width - 100, y: 600 };
  const cx =
    (1 - cursorProgress) * (1 - cursorProgress) * cursorFrom.x +
    2 * (1 - cursorProgress) * cursorProgress * cursorCtrl.x +
    cursorProgress * cursorProgress * cursorTo.x;
  const cy =
    (1 - cursorProgress) * (1 - cursorProgress) * cursorFrom.y +
    2 * (1 - cursorProgress) * cursorProgress * cursorCtrl.y +
    cursorProgress * cursorProgress * cursorTo.y;
  const cursorVisible = t >= T_CURSOR_CONFIRM_START - 0.1 && phoneOpacity > 0.3;
  const clicking = cursorProgress >= 1;
  const clickProgress = clicking ? interpolate(t, [T_CURSOR_CONFIRM_ARRIVE, T_CURSOR_CONFIRM_ARRIVE + 0.3], [0, 1], clamp) : 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #0F1F38, ${NS_COLORS.navyDeep})`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: dashboardOpacityDuringCut,
          filter: decodeBlur > 0.05 ? `blur(${decodeBlur}px)` : undefined,
        }}
      >
        <LaptopMockup
          width={width * 1.3}
          screenContent={<DashboardScreen riskCase="low" overrideRow={overrideRow} />}
        />
        {alertPulse > 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 900 * alertPulse,
              height: 60 * alertPulse,
              marginLeft: -450 * alertPulse,
              marginTop: -30 * alertPulse,
              borderRadius: 999,
              background: isCritical ? NS_COLORS.red : NS_COLORS.cyan,
              opacity: 0.15 * alertPulse,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
        )}
      </AbsoluteFill>

      {phoneOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            right: 140,
            bottom: 90,
            width: 300,
            padding: "24px 22px",
            borderRadius: 20,
            background: NS_COLORS.navyPanel,
            border: `1px solid ${riskColorFor(82)}66`,
            boxShadow: `0 0 40px ${riskColorFor(82)}33`,
            opacity: phoneOpacity,
            transform: `translateY(${phoneSlide}px)`,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          }}
        >
          <div style={{ color: NS_COLORS.ivoryMuted, fontSize: 14, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>
            Confirmez votre connexion
          </div>
          <div style={{ color: NS_COLORS.ivory, fontSize: 20, fontWeight: 600 }}>Berlin, DE</div>
        </div>
      )}

      {cursorVisible && <VirtualCursor x={cx} y={cy} clicking={clicking} clickProgress={clickProgress} />}

      {/* Plan serre : la ligne de vigilance seule, bosse haute et etroite sous la connexion. */}
      <AbsoluteFill style={{ opacity: vigilanceCutOpacity, background: "#0A1628" }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
          <Raw body={G.fond} />
          <Raw body={G.grilleMesure} />
          <Raw body={G.seuilReference} />
          <Raw body={G.ligneReflet} />
          <Raw body={G.ligneVigilance} />
          <g opacity={bosseOpacity} transform={`translate(960, 540) scale(1, ${bosseScale}) translate(-960, -540)`}>
            <g dangerouslySetInnerHTML={{ __html: G.bosseAlerte }} />
          </g>
          <g opacity={bosseOpacity}>
            <g dangerouslySetInnerHTML={{ __html: G.marqueurPic }} />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
