// MOTEUR: matiere photographique + couches vectorielles animees
//
// Device RUSTIQUE — la base est l'image que la cliente a choisie (revision 2, 2026-09-04).
// Elle a rejete le chassis SVG dessine a la main : « I'm not asking for a new redesign or a
// cleaner reinterpretation. » On garde donc SON image telle quelle comme decor (100 % de sa
// matiere, sa rouille, son grain) et on ne pose QUE les couches animees par-dessus.
//
// ⛔ Ne pas vectoriser cette image (teste le 04/09 : 2362 paths / 0 groupe, grain perdu).
// ⛔ Ne pas recalculer les positions par formule : l'image est une generation d'IA, il n'y a
//    AUCUNE grille reguliere (pas des cases : 33,6 -> 39,5 px). Toutes les valeurs ci-dessous
//    sont MESUREES une par une sur le PNG et figees dans CALAGE.json.
//    Source : out/_r-and-d/chill-meter-3d/calage/CALAGE.json

import React from "react";
import { staticFile, delayRender, continueRender } from "remotion";

/** Dimensions natives du PNG de base. Le repere de TOUTES les constantes ci-dessous. */
export const RUSTIC_W = 1195;
export const RUSTIC_H = 896;

/** y ou le chassis opaque touche le sol — sa demande n°6 : le meter ne doit pas flotter. */
export const RUSTIC_SOL_Y = 717;

/** Vert du voyant power, repris pour les labels (sa demande n°4). */
const VERT = "#6fff6f";

/**
 * Les 22 cases de la jauge, mesurees une par une (liseres verticaux, position sub-pixel).
 * ⛔ 22, pas 23. Et pas de pas constant — voir l'en-tete.
 */
const CASES: { cx: number; x: number; w: number }[] = [
  { cx: 205.61, x: 191.34, w: 28.54 },
  { cx: 241.61, x: 226.82, w: 29.59 },
  { cx: 277.91, x: 263.19, w: 29.43 },
  { cx: 314.64, x: 299.62, w: 30.05 },
  { cx: 352.9, x: 337.75, w: 30.3 },
  { cx: 392.3, x: 377.1, w: 30.4 },
  { cx: 431.6, x: 416.5, w: 30.2 },
  { cx: 469.4, x: 454.4, w: 30.0 },
  { cx: 506.2, x: 491.3, w: 29.8 },
  { cx: 542.6, x: 527.8, w: 29.6 },
  { cx: 579.1, x: 564.4, w: 29.4 },
  { cx: 615.3, x: 600.7, w: 29.2 },
  { cx: 651.3, x: 636.8, w: 29.0 },
  { cx: 686.9, x: 672.5, w: 28.8 },
  { cx: 722.3, x: 708.0, w: 28.6 },
  { cx: 757.7, x: 743.5, w: 28.4 },
  { cx: 792.7, x: 778.6, w: 28.2 },
  { cx: 827.2, x: 813.2, w: 28.0 },
  { cx: 861.7, x: 847.8, w: 27.9 },
  { cx: 895.3, x: 881.4, w: 27.8 },
  { cx: 929.1, x: 915.3, w: 27.8 },
  { cx: 963.0, x: 949.1, w: 27.8 },
];

const CASE_Y = 457.5;
const CASE_H = 60.5;
const CASE_R = 4;

/** Lentille du bouton POWER. Le bezel metallique (r=21) ne doit PAS etre recouvert. */
const POWER = { cx: 1113, cy: 451, r: 16.5 };

/** La vitre bleutee ou vit le halo. */
const ECRAN = { x: 117, y: 285, w: 901, h: 301, r: 52 };

/**
 * Les 5 labels. Sa demande n°4 est precise : le TEXTE passe en vert, les ICONES restent
 * telles quelles. Les bbox de texte excluent deja les icones (mesure : les lettres tiennent
 * dans y=644..665, les icones debordent verticalement).
 * ⛔ Par SUPERPOSITION, jamais par inpaint : teste le 04/09, l'inpaint ne sait pas re-ecrire
 *    du texte, les mots deviennent des taches lumineuses.
 */
const LABELS: { t: string; x: number; y: number; w: number; h: number }[] = [
  { t: "STATUS", x: 192, y: 644, w: 70, h: 19 },
  { t: "DATA", x: 372, y: 645, w: 47, h: 18 },
  { t: "HUD", x: 541, y: 644, w: 39, h: 20 },
  { t: "CALIBRATE", x: 698, y: 645, w: 104, h: 19 },
  { t: "ABOUT", x: 912, y: 645, w: 65, h: 18 },
];

export type RusticProps = {
  /** 0..100 — pilote le remplissage de la jauge. */
  chill: number;
  /** 0..1 — allumage du voyant et de l'ecran. */
  powerOn: number;
  frame: number;
  fps: number;
};

export const ChillMeterRustic: React.FC<RusticProps> = ({ chill, powerOn, frame, fps }) => {
  const t = frame / fps;

  // ⛔ Le decor est une <image> SVG : contrairement au <Img> de Remotion, elle n'est PAS
  // attendue par le renderer. Mesure du 04/09 : 1 frame sur 510 sortait SANS le PNG —
  // il ne restait que nos couches vectorielles flottant sur le vide, et ca tombait sur la
  // 1re frame de Fill50, donc pile a la jonction entre deux etats (defaut vu par Aziz).
  // delayRender bloque la capture tant que l'image n'est pas decodee.
  const [handle] = React.useState(() => delayRender("chargement du decor rustique"));
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => continueRender(handle);
    img.onerror = () => continueRender(handle);
    img.src = staticFile("_client-sim/chill-meter/device-rustique.png");
  }, [handle]);

  // Respiration lente du halo : l'appareil est allume, jamais fige.
  const breathe = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 2.6);

  // Nombre de cases allumees. La derniere case s'allume progressivement -> pas de saut.
  const exact = (chill / 100) * CASES.length;
  const full = Math.floor(exact);
  const partial = exact - full;

  return (
    <svg
      viewBox={`0 0 ${RUSTIC_W} ${RUSTIC_H}`}
      width={RUSTIC_W}
      height={RUSTIC_H}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Halo de l'ecran. Mesure sur SA reference allumee : luminance moyenne 65,3 et
            p90 = 219 sur la dalle, contre 33,8 / 72 chez nous avant correction — l'ecran
            paraissait rester eteint. Ce sont surtout les HAUTES LUMIERES qui manquaient,
            d'ou un centre franchement clair et non un voile uniforme.
            Sa dalle est tres bleue : B 103,6 contre R 27,7. */}
        <radialGradient id="rustic_screenGlow" cx="50%" cy="54%" r="70%">
          <stop offset="0%" stopColor="#7fd0ff" stopOpacity={0.20} />
          <stop offset="45%" stopColor="#3f9fe0" stopOpacity={0.13} />
          <stop offset="100%" stopColor="#123a63" stopOpacity={0} />
        </radialGradient>
        {/* Nappe basse : chez elle la dalle est plus chaude en lumiere vers le bas,
            sous la jauge — c'est ce qui donne l'impression d'un ecran retro-eclaire. */}
        <linearGradient id="rustic_screenFloor" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6fc8ff" stopOpacity={0.16} />
          <stop offset="60%" stopColor="#3f9fe0" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#1b4f7d" stopOpacity={0} />
        </linearGradient>
        {/* Ce qui fait vraiment "allume" chez elle : les ELEMENTS rayonnent sur une dalle
            restee sombre (60 % de ses pixels sont sous 40 de luminance, mediane 28, mais
            14 % depassent 180). Un voile uniforme donne l'inverse : du laiteux qui noie
            le texte. D'ou ce filtre de lueur applique aux graduations et au titre. */}
        <filter id="rustic_screenBloom" x="-25%" y="-40%" width="150%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Remplissage d'une case : cyan lumineux, plus clair en haut. */}
        <linearGradient id="rustic_caseFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bff0ff" />
          <stop offset="42%" stopColor="#48c8ff" />
          <stop offset="100%" stopColor="#1d8fd6" />
        </linearGradient>

        {/* Lueur du voyant vert. */}
        <radialGradient id="rustic_ledGlow">
          <stop offset="0%" stopColor={VERT} stopOpacity={0.95} />
          <stop offset="45%" stopColor="#33cc55" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#0a3d14" stopOpacity={0} />
        </radialGradient>

        <filter id="rustic_soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="rustic_softLed" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* ================= 1. LE DECOR — son image, intacte ================= */}
      <image
        href={staticFile("_client-sim/chill-meter/device-rustique.png")}
        x={0}
        y={0}
        width={RUSTIC_W}
        height={RUSTIC_H}
        preserveAspectRatio="none"
      />

      {/* ================= 2. HALO DE L'ECRAN ================= */}
      {powerOn > 0.01 && (
        <g opacity={powerOn}>
          {/* retro-eclairage : la dalle s'allume, elle ne recoit pas juste un voile */}
          <rect
            x={ECRAN.x}
            y={ECRAN.y}
            width={ECRAN.w}
            height={ECRAN.h}
            rx={ECRAN.r}
            fill="url(#rustic_screenFloor)"
            style={{ mixBlendMode: "screen" }}
          />
          <rect
            x={ECRAN.x}
            y={ECRAN.y}
            width={ECRAN.w}
            height={ECRAN.h}
            rx={ECRAN.r}
            fill="url(#rustic_screenGlow)"
            opacity={0.82 + breathe * 0.18}
            style={{ mixBlendMode: "screen" }}
          />
        </g>
      )}

      {/* Lueur ciblee : la reglette de graduations et le bandeau du titre s'allument,
          au lieu d'un voile uniforme sur toute la dalle. */}
      {powerOn > 0.01 && (
        <g opacity={powerOn * (0.7 + breathe * 0.3)} filter="url(#rustic_screenBloom)">
          <rect x={ECRAN.x + 60} y={CASE_Y - 32} width={ECRAN.w - 120} height={4}
                rx={2} fill="#8fdcff" opacity={0.5} />
        </g>
      )}

      {/* ================= 3. LES 22 SEGMENTS DE LA JAUGE ================= */}
      <g>
        {CASES.map((c, i) => {
          if (i > full) return null;
          const isPartial = i === full;
          const op = isPartial ? partial : 1;
          if (op <= 0.01) return null;

          // Legere pulsation de la case de tete : la mesure est vivante.
          const head = isPartial ? 0.85 + breathe * 0.15 : 1;

          return (
            <g key={i} opacity={op * head}>
              {/* diffusion sous la case — donne l'impression que ca eclaire la dalle */}
              <rect
                x={c.x - 2}
                y={CASE_Y - 2}
                width={c.w + 4}
                height={CASE_H + 4}
                rx={CASE_R + 2}
                fill="#48c8ff"
                opacity={0.34}
                filter="url(#rustic_soft)"
                style={{ mixBlendMode: "screen" }}
              />
              <rect
                x={c.x}
                y={CASE_Y}
                width={c.w}
                height={CASE_H}
                rx={CASE_R}
                fill="url(#rustic_caseFill)"
              />
              {/* liseré clair en haut de la case */}
              <rect
                x={c.x}
                y={CASE_Y}
                width={c.w}
                height={3}
                rx={1.5}
                fill="#eafaff"
                opacity={0.75}
              />
            </g>
          );
        })}
      </g>

      {/* ================= 4. LE VOYANT POWER ================= */}
      {powerOn > 0.01 && (
        <g opacity={powerOn}>
          <circle
            cx={POWER.cx}
            cy={POWER.cy}
            r={POWER.r * 2.1}
            fill="url(#rustic_ledGlow)"
            opacity={0.5 + breathe * 0.3}
            filter="url(#rustic_softLed)"
            style={{ mixBlendMode: "screen" }}
          />
          <circle cx={POWER.cx} cy={POWER.cy} r={POWER.r} fill="#1d7a2e" />
          <circle
            cx={POWER.cx}
            cy={POWER.cy}
            r={POWER.r * 0.82}
            fill={VERT}
            opacity={0.82 + breathe * 0.18}
          />
          {/* petit reflet haut-gauche : la lentille est bombee */}
          <ellipse
            cx={POWER.cx - POWER.r * 0.3}
            cy={POWER.cy - POWER.r * 0.36}
            rx={POWER.r * 0.34}
            ry={POWER.r * 0.24}
            fill="#eaffea"
            opacity={0.6}
          />
        </g>
      )}

      {/* ================= 5. LES 5 LABELS EN VERT =================
          Le texte d'origine est bleu-gris clair sur plaque sombre : on le couvre par un
          aplat pris sur la couleur reelle de la plaque (33,41,54), puis on re-ecrit en vert.
          Les icones ne sont jamais recouvertes (bbox de texte uniquement). */}
      <g>
        {LABELS.map((l) => {
          const cx = l.x + l.w / 2;
          const cy = l.y + l.h / 2;
          // marge de couverture : le texte d'origine a un leger halo
          const pad = 3;
          return (
            <g key={l.t}>
              <rect
                x={l.x - pad}
                y={l.y - pad}
                width={l.w + pad * 2}
                height={l.h + pad * 2}
                rx={3}
                fill="#212936"
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
                fontWeight={900}
                fontSize={l.h * 1.02}
                // la largeur mesuree fait foi : on force le texte a l'occuper exactement
                textLength={l.w}
                lengthAdjust="spacingAndGlyphs"
                fill={VERT}
                opacity={0.72 + powerOn * 0.28}
              >
                {l.t}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
