/**
 * FluxPetroleAnimee — "L'HEMORRAGIE PETROLIERE" : la richesse sort du pays au lieu d'y rester.
 *
 * R&D SVG-SCENES-GENERATIVES (2026-06-24). PREMIER test bout-en-bout d'une scene generee par GLM-5.2
 * (z-ai/glm-5.2 via OpenRouter, text-only) puis ANIMEE par frame en Remotion. Prouve le pipeline complet
 * sur un modele open-weights low-cost (registre tactique/blueprint, ou GLM est au niveau GPT-5.5/Gemini).
 *
 * PHRASE NARRATIVE : "le petrole sort de la terre... mais la richesse, elle, sort du pays."
 *
 * Le SVG GLM est STATIQUE et decoupe en 9 groupes nommes (fluxPetroleGroups.ts). Ici on l'anime :
 * Grammaire (2 couches) :
 *   FOND permanent : le cadre + la grille + le titre (poses d'emblee, legere respiration de la grille).
 *   EVENEMENTS echelonnes (le geste central = LE FLUX QUI S'ECHAPPE) :
 *     ~f15   le GISEMENT (source) apparait (fade + leger rise)
 *     ~f40   le BARIL (ressource) se revele (la richesse extraite)
 *     ~f70   les 3 GROSSES FLECHES sortantes se TRACENT vers le coffre (stroke-dashoffset), une a une
 *     ~f110  le COFFRE etranger (destinataire) s'illumine (il recoit)
 *     ~f150  la MINCE part locale tombe en dernier (le contraste : presque rien reste)
 *     ~f175  les ETIQUETTES fade-in
 *   Objet inerte (baril, coffre) = apparait par FADE sur place (doctrine : pas de glissement d'objet inerte).
 *   Seul le FLUX (fleche directionnelle) "coule" — mouvement legitime (la richesse se deplace).
 */
import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate,
} from "remotion";
import {
  F_FOND, F_GRILLE, F_CADRE, F_SOURCE, F_RESSOURCE,
  F_FLUX_SORTANT, F_DESTINATAIRE, F_PART_LOCALE, F_ETIQUETTES,
} from "./fluxPetroleGroups";

const BG = "#0b1526"; // fond tactique bleu nuit

const Grp: React.FC<{
  body: string; transform?: string; opacity?: number; style?: React.CSSProperties;
}> = ({ body, transform, opacity, style }) => (
  <g transform={transform} opacity={opacity} style={style} dangerouslySetInnerHTML={{ __html: body }} />
);

export const FluxPetroleAnimee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- FOND permanent : grille respire doucement ----------
  const grillePulse = 0.5 + 0.1 * (Math.sin(f / 40) + 1) / 2;

  // ---------- EVENEMENTS ----------
  // helper fade + rise (objet inerte : apparait sur place, pas de glissement lateral)
  const appear = (startF: number, rise = 24) => {
    const s = spring({ frame: f - startF, fps, config: { mass: 0.8, damping: 14, stiffness: 90 }, durationInFrames: 26 });
    return {
      op: interpolate(f, [startF, startF + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      dy: (1 - s) * rise,
      on: f >= startF,
    };
  };

  const source = appear(15);
  const ressource = appear(40);
  const destinataire = appear(110, 0); // le coffre s'illumine sur place (pas de rise)
  const partLocale = appear(150, 0);

  // f70 : les 3 grosses fleches se TRACENT vers le coffre (stroke-dashoffset 1->0).
  // dasharray = grande valeur couvrant la longueur de la courbe (~520px) ; offset anime.
  const DASH = 560;
  const traceFlux = interpolate(f, [70, 105], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fluxOn = f >= 70;
  // les pointes (polygons) du flux n'apparaissent qu'une fois la fleche tracee
  const pointeOp = interpolate(f, [104, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // pulsation du flux une fois etabli (la richesse "coule" en continu)
  const fluxGlow = f > 116 ? 0.85 + 0.15 * (Math.sin(f / 8) + 1) / 2 : 1;

  // le coffre luit quand il recoit
  const coffreGlow = destinataire.on ? 0.9 + 0.1 * (Math.sin(f / 14) + 1) / 2 : 1;

  const etiquettes = appear(175, 0);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* ===== FOND permanent ===== */}
        <Grp body={F_FOND} />
        <Grp body={F_GRILLE} opacity={grillePulse} />
        <Grp body={F_CADRE} />

        {/* ===== EVENEMENTS echelonnes ===== */}
        {/* le gisement (source) apparait */}
        {source.on && <Grp body={F_SOURCE} transform={`translate(0 ${source.dy})`} opacity={source.op} />}

        {/* le baril (ressource extraite) se revele */}
        {ressource.on && <Grp body={F_RESSOURCE} transform={`translate(0 ${ressource.dy})`} opacity={ressource.op} />}

        {/* LES GROSSES FLECHES SORTANTES — se tracent vers le coffre (geste central : l'hemorragie) */}
        {fluxOn && (
          <g opacity={fluxGlow}>
            {/* les courbes se dessinent (dashoffset), les pointes apparaissent apres */}
            <g
              style={{ strokeDasharray: DASH, strokeDashoffset: DASH * traceFlux }}
              dangerouslySetInnerHTML={{ __html: F_FLUX_SORTANT.replace(/<polygon[^>]*\/>/g, "") }}
            />
            <g opacity={pointeOp} dangerouslySetInnerHTML={{ __html: (F_FLUX_SORTANT.match(/<polygon[^>]*\/>/g) || []).join("") }} />
          </g>
        )}

        {/* le coffre etranger recoit (s'illumine sur place) */}
        {destinataire.on && <Grp body={F_DESTINATAIRE} opacity={destinataire.op * coffreGlow} />}

        {/* la mince part locale tombe en dernier (le contraste) */}
        {partLocale.on && <Grp body={F_PART_LOCALE} opacity={partLocale.op} />}

        {/* les etiquettes fade-in */}
        {etiquettes.on && <Grp body={F_ETIQUETTES} opacity={etiquettes.op} />}
      </svg>
    </AbsoluteFill>
  );
};

export default FluxPetroleAnimee;
