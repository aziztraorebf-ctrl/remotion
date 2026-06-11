/**
 * SahelFriseOverlay — overlay FRISE COMPARATIVE animée (war-map, 3e registre D-8).
 *
 * Type de graphique le plus puissant validé (upstream Gemini+Kimi+DeepSeek 2026-06-09) pour expliquer
 * un concept invisible sur carte : ancrer un fait dans une SÉRIE (barres horizontales comparées).
 * = COMPLÉMENT, jamais sous-titre. Montre ce que la voix ne dit pas.
 *
 * RÈGLES (WARMAP-VIVANTE D-8) :
 * - Voile cream semi-transparent (#F3E9C8 ~78%), JAMAIS noir. La carte reste visible/vivante derrière.
 * - Barres "faites main" (stroke-dashoffset = se dessine à l'encre, linecap round, léger bruit).
 * - Apparition en STAGGER (0.12s entre barres), ease-out-expo. Micro-mouvement (jamais statique parfait).
 * - 1 idée, ≤40% surface, marges généreuses, palette parchemin stricte, police serif.
 * - Labels = noms propres / dates que la voix NE cite PAS. Pas de phrase.
 * - FACTUEL : data passée en prop, jamais inventée ici.
 *
 * Conçu pour render ISOLÉ d'abord (compo SahelFriseOverlayDemo) puis intégration sur carte.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";

const SAHEL = {
  cream: "#F3E9C8",
  ink:   "#2A2018",
  gold:  "#C9A227",
  fr:    "#2E3A59",
  ura:   "#B85C38",
} as const;

const EXPO = Easing.bezier(0.16, 1, 0.3, 1); // ease-out-expo (snap élégant)

export type FriseBar = {
  label: string;      // nom propre / date (PAS le texte de la voix)
  value: number;      // valeur (unité libre)
  highlight?: boolean; // la barre-clé (en or)
};

type Props = {
  startFrame: number;
  holdFrames: number;
  surtitle: string;        // petit sur-titre (small caps), ≤4 mots
  bars: FriseBar[];        // 2-4 barres max
  unit?: string;           // ex: "jours" (affiché discrètement après la valeur)
  threshold?: { value: number; label: string }; // trait de référence optionnel
  source?: string;
};

export const SahelFriseOverlay: React.FC<Props> = ({
  startFrame, holdFrames, surtitle, bars, unit = "", threshold, source,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;

  // fade voile
  const veil = Math.min(
    interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [holdFrames - 16, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  if (veil <= 0) return null;

  // géométrie de la frise
  const W = 760, rowH = 64, padTop = 96, padLeft = 230, barMaxW = 420;
  const maxVal = Math.max(...bars.map((b) => b.value), threshold?.value ?? 0);
  const H = padTop + bars.length * rowH + 40;
  const bx = (v: number) => (v / maxVal) * barMaxW;

  // sur-titre + séparateur
  const titleOp = interpolate(local, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(local, [6, 22], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
  // micro-respiration (jamais statique parfait)
  const breath = 1 + 0.004 * Math.sin(local * 0.06);

  return (
    <AbsoluteFill style={{ opacity: veil, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* voile cream semi-transparent — carte vivante derrière (R2/R4) */}
      <AbsoluteFill style={{ background: `${SAHEL.cream}C6` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: W, height: H, transform: `scale(${breath})` }}>
          <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
            {/* sur-titre */}
            <g opacity={titleOp}>
              <text x={padLeft} y={34} fill={SAHEL.ink} fontSize={22} fontWeight={700}
                letterSpacing={5} style={{ textTransform: "uppercase" as const }}>{surtitle}</text>
              <line x1={padLeft} y1={48} x2={padLeft + lineW} y2={48} stroke={SAHEL.gold} strokeWidth={3} strokeLinecap="round" />
            </g>

            {/* seuil de référence (trait vertical pointillé) */}
            {threshold && (() => {
              const tx = padLeft + bx(threshold.value);
              const op = interpolate(local, [18, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <g opacity={op}>
                  <line x1={tx} y1={padTop - 16} x2={tx} y2={padTop + bars.length * rowH} stroke={SAHEL.ink}
                    strokeWidth={1.5} strokeDasharray="3 5" opacity={0.6} />
                  <text x={tx + 6} y={padTop - 22} fill={SAHEL.ink} fontSize={14} fontStyle="italic" opacity={0.6}>{threshold.label}</text>
                </g>
              );
            })()}

            {/* barres */}
            {bars.map((b, i) => {
              const t0 = 16 + i * 4; // stagger ~0.13s
              const grow = interpolate(local, [t0, t0 + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
              const labOp = interpolate(local, [t0 + 6, t0 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const y = padTop + i * rowH;
              const fullW = bx(b.value);
              const col = b.highlight ? SAHEL.gold : SAHEL.ink;
              const len = fullW;
              return (
                <g key={i}>
                  {/* label gauche (nom propre / date) */}
                  <text x={padLeft - 16} y={y + 22} fill={SAHEL.ink} fontSize={20}
                    fontWeight={b.highlight ? 700 : 500} textAnchor="end" opacity={labOp}>{b.label}</text>
                  {/* barre : tracé à l'encre (dashoffset) + remplissage highlight */}
                  <line x1={padLeft} y1={y + 14} x2={padLeft + fullW} y2={y + 14}
                    stroke={col} strokeWidth={b.highlight ? 16 : 11} strokeLinecap="round"
                    strokeDasharray={len} strokeDashoffset={len * (1 - grow)}
                    opacity={b.highlight ? 0.92 : 0.5} />
                  {/* valeur à droite de la barre */}
                  <text x={padLeft + fullW * grow + 14} y={y + 20} fill={col} fontSize={b.highlight ? 26 : 20}
                    fontWeight={b.highlight ? 800 : 600} opacity={labOp}>
                    {Math.round(b.value * grow)}{unit ? " " + unit : ""}
                  </text>
                </g>
              );
            })}
          </svg>
          {source && (
            <div style={{ position: "absolute", bottom: -6, left: padLeft, fontSize: 13,
              fontStyle: "italic", color: SAHEL.ink, opacity: 0.5 }}>{source}</div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
