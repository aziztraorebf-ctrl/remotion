// MOTEUR: SVG — objet vectoriel (le sujet EST un wordmark ; on montre sa naissance,
// pas un lieu ni une quantite). Registre impose par la nature du livrable client :
// un splash screen d'app est un logo qui apparait, rien d'autre.
// INTENTION: faire APPARAITRE (une presence qui se depose) -> FORME: le point engendre
// le trace -> MOTEUR: SVG trace anime -> TEMPLATE: aucun existant, piece neuve.
//
/**
 * Logo AURA — wordmark vectorise a la main depuis le PNG client.
 *
 * Fidelite mesuree : IoU 0.9675 · ecart significatif 11 px / 54 638 (0,020 %)
 * · ecart max 2,00 px sur 674 px de large. Detail : LOGO-MESURES.md
 *
 * Trace en `stroke` a ligne mediane (PAS en contour rempli) : epaisseur
 * constante 30 u, terminaisons rondes r=15 mesurees. C'est ce qui rend le
 * draw-on par stroke-dasharray possible sans reserve.
 *
 * Chaque glyphe est expose separement pour etre anime independamment
 * (5 composantes connexes disjointes, aucune ligature dans le dessin d'origine).
 */

export const AURA_INK = "#F2E8E9";
export const AURA_WINE = "#6C1D34";
export const AURA_WINE_DEEP = "#320917";
export const AURA_STROKE_WIDTH = 30;

/** Longueurs de trace MESUREES (unites viewBox) — pilotage du draw-on. */
export const PATH_LENGTHS = {
  aTrait: 655.9,
  aBarre: 139.5,
  uTrait: 346.1,
  rTrait: 159.1,
  anneau: 441.1,
  jambage: 60.5,
} as const;

/** Les `d` du wordmark. Ne pas retoucher sans re-mesurer contre le PNG client. */
export const AURA_PATHS = {
  aTrait:
    "M380.00,608.50 L380.00,443.50 C381.50,440.62 375.92,430.92 374.00,425.30 C369.16,417.43 361.97,413.57 350.20,412.86 C336.89,413.32 328.72,420.22 325.14,429.20 C316.26,441.28 313.92,453.06 306.43,466.50 C296.64,479.23 291.99,494.25 286.45,505.09 L294.65,498.36 C285.19,509.49 269.95,503.14 254.50,505.66 C241.16,508.55 229.01,512.65 216.70,523.45 C204.53,534.22 195.95,545.49 191.03,564.50 C189.61,578.43 187.53,594.29 198.30,604.56 C213.24,614.57 230.42,607.51 238.98,596.40 C249.11,583.58 252.17,565.15 259.82,558.00 C269.63,539.21 277.14,526.59 279.55,512.36",
  aBarre:
    "M290.43,507.16 C295.41,511.28 303.01,512.40 309.70,515.42 C316.25,518.37 323.01,523.90 329.70,529.40 C335.46,535.62 343.15,542.50 347.78,550.24 C350.48,555.67 356.23,562.69 360.95,572.01 C362.48,576.74 369.38,586.06 370.81,594.74 C370.75,599.91 377.00,609.56 377.00,609.40",
  uTrait: "M437.00,466.00 L437.00,546.00 A59.25,59.25 0 0 0 555.50,546.00 L555.50,466.00",
  rTrait:
    "M613.30,606.00 L613.00,523.70 C613.00,519.04 615.26,513.24 616.00,507.70 C617.98,500.76 621.98,492.96 627.53,488.30 C632.12,478.52 646.26,472.86 658.50,468.50",
  anneau:
    "M692.55,536.11 A70.20,70.20 0 1 1 832.95,536.11 A70.20,70.20 0 1 1 692.55,536.11",
  jambage: "M832.50,545.00 L832.50,605.50",
} as const;

/** Le point du "A" — l'element signature que le client cite explicitement. */
export const AURA_DOT = { cx: 306.5, cy: 598.5, r: 22 } as const;

/** Boite du wordmark dans le viewBox 1024, pour centrer/cadrer. */
export const AURA_BBOX = { x: 176, y: 397, w: 674, h: 227 } as const;

type StrokeProps = {
  dasharray?: number | string;
  dashoffset?: number;
  opacity?: number;
};

/**
 * Le wordmark complet. Chaque glyphe accepte ses propres props de trace pour
 * qu'un beat puisse en animer un seul sans toucher aux autres.
 */
export const AuraWordmark: React.FC<{
  ink?: string;
  aTrait?: StrokeProps;
  aBarre?: StrokeProps;
  uTrait?: StrokeProps;
  rTrait?: StrokeProps;
  anneau?: StrokeProps;
  jambage?: StrokeProps;
  dot?: { opacity?: number; scale?: number };
  groupOpacity?: number;
}> = ({
  ink = AURA_INK,
  aTrait,
  aBarre,
  uTrait,
  rTrait,
  anneau,
  jambage,
  dot,
  groupOpacity = 1,
}) => {
  const stroke = (p?: StrokeProps) => ({
    strokeDasharray: p?.dasharray,
    strokeDashoffset: p?.dashoffset,
    opacity: p?.opacity ?? 1,
  });

  return (
    <g
      id="wordmark-aura"
      fill="none"
      stroke={ink}
      strokeWidth={AURA_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={groupOpacity}
    >
      <g id="glyph-A">
        <path id="A-trait" d={AURA_PATHS.aTrait} style={stroke(aTrait)} />
        <path id="A-barre" d={AURA_PATHS.aBarre} style={stroke(aBarre)} />
      </g>
      <g id="dot-A">
        <circle
          id="A-point"
          cx={AURA_DOT.cx}
          cy={AURA_DOT.cy}
          r={AURA_DOT.r * (dot?.scale ?? 1)}
          fill={ink}
          stroke="none"
          opacity={dot?.opacity ?? 1}
        />
      </g>
      <g id="glyph-u">
        <path id="u-trait" d={AURA_PATHS.uTrait} style={stroke(uTrait)} />
      </g>
      <g id="glyph-r">
        <path id="r-trait" d={AURA_PATHS.rTrait} style={stroke(rTrait)} />
      </g>
      <g id="glyph-a">
        <path id="a-anneau" d={AURA_PATHS.anneau} style={stroke(anneau)} />
        <path id="a-jambage" d={AURA_PATHS.jambage} style={stroke(jambage)} />
      </g>
    </g>
  );
};

/** Fond bordeaux degrade releve sur le PNG client (vertical, haut -> bas). */
export const AuraBackground: React.FC<{ id?: string; from?: string; to?: string }> = ({
  id = "aura-bg",
  from = AURA_WINE,
  to = AURA_WINE_DEEP,
}) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0.25" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="1024" height="1024" fill={`url(#${id})`} />
  </>
);
