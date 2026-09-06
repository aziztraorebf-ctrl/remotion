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
/** Le bleu glace des icones — sa demande du 05/09 : « make the symbols/icons to the left of
 *  each word blue so they stand out more and match the icy-blue look of the meter ».
 *  Repris de la dalle de l'ecran (B 103,6 contre R 27,7), pour que les deux se repondent. */
const BLEU_ICONE = "#5ecdff";

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
/** Les 5 icones, mesurees DANS le PNG (starter, verifie le 06/09). Elles ne sont PAS du
 *  texte : elles font partie de l'image de la cliente. On ne peut donc pas les re-ecrire
 *  comme les labels — on les RECOLORE par un filtre applique a leur seule zone.
 *  Bornes verticales : y 636..672 (les icones debordent la bande des lettres, 644..665). */
const ICONES: { t: string; x0: number; x1: number }[] = [
  { t: "STATUS", x0: 160, x1: 184 },
  { t: "DATA", x0: 334, x1: 361 },
  { t: "HUD", x0: 503, x1: 532 },
  { t: "CALIBRATE", x0: 665, x1: 690 },
  { t: "ABOUT", x0: 879, x1: 904 },
];
const ICONE_Y0 = 636;
const ICONE_Y1 = 672;

/** « MAX CHILL DETECTION » — mesure dans le PNG le 06/09 (x 205..983, y 303..344).
 *  Sa demande du 05/09 : « I'd also like MAX CHILL DETECTION to gain some blue color/glow
 *  when the meter powers on so that area feels more alive ». Meme mecanique que les icones :
 *  le texte est DANS son image, on le recolore sans le redessiner. */
const TITRE = { x0: 200, y0: 298, x1: 990, y1: 350 };

/** Le bandeau « AbiGirl Reacts » grave dans le metal (x 195..1000, y 150..280).
 *  Il s'illumine au 75 % — sa demande de differenciation 50/75. */
const BANDEAU = { x0: 195, y0: 148, x1: 1002, y1: 282 };

const LABELS: { t: string; x: number; y: number; w: number; h: number }[] = [
  { t: "STATUS", x: 192, y: 644, w: 70, h: 19 },
  { t: "DATA", x: 372, y: 645, w: 47, h: 18 },
  { t: "HUD", x: 541, y: 644, w: 39, h: 20 },
  { t: "CALIBRATE", x: 698, y: 645, w: 104, h: 19 },
  { t: "ABOUT", x: 912, y: 645, w: 65, h: 18 },
];

/**
 * Les 3 planches de matiere givree, generees par Gemini i2i depuis le MEME device nu,
 * puis extraites en calque : on ne garde que ce qui s'est ECLAIRCI (la glace ajoute de la
 * lumiere), le reste redevient transparent. Sans cette extraction, l'image brute repeint
 * tout l'objet en bleu et la rouille validee par la cliente disparait (mesure : le metal
 * passait de R-B +7,9 a -30,7 ; apres extraction il revient a +2,0, sa cible etant +2,4).
 * ⛔ Ne jamais poser l'image brute : toujours le calque.
 */
const GIVRE = [
  { src: "_client-sim/chill-meter/givre-50.png", from: 0.0, to: 0.45 },
  { src: "_client-sim/chill-meter/givre-75.png", from: 0.35, to: 0.75 },
  { src: "_client-sim/chill-meter/givre-100.png", from: 0.65, to: 1.0 },
] as const;

export type RusticProps = {
  /** 0..100 — pilote le remplissage de la jauge. */
  chill: number;
  /** 0..1 — allumage du voyant et de l'ecran. */
  powerOn: number;
  /** 0..1 — le givre qui pousse SUR l'appareil (sa section 5 : « Frost begins forming
   *  directly on the meter »). Pilote le fondu entre les 3 planches de matiere. */
  frost?: number;
  frame: number;
  fps: number;
};

export const ChillMeterRustic: React.FC<RusticProps> = ({ chill, powerOn, frost = 0, frame, fps }) => {
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

  // Les 3 planches de givre, prechargees de la meme facon (meme piege : <image> SVG).
  const [frostHandle] = React.useState(() => delayRender("chargement des planches de givre"));
  React.useEffect(() => {
    let left = GIVRE.length;
    const done = () => { left -= 1; if (left === 0) continueRender(frostHandle); };
    GIVRE.forEach((g) => {
      const im = new Image();
      im.onload = done;
      im.onerror = done;
      im.src = staticFile(g.src);
    });
  }, [frostHandle]);

  // Fondu enchaine entre les planches : chacune monte puis reste, la suivante se pose
  // par-dessus. On n'en RETIRE jamais — le givre ne peut que s'ajouter, ce qui repond a
  // « The frost should appear to GROW naturally onto the meter as the chill level rises ».
  const frostOpacity = (g: (typeof GIVRE)[number]) => {
    if (frost <= g.from) return 0;
    return Math.min(1, (frost - g.from) / (g.to - g.from));
  };

  // Respiration lente du halo : l'appareil est allume, jamais fige.
  const breathe = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 2.6);

  // Le bandeau « AbiGirl Reacts » s'allume ENTRE le 50 % et le 75 % : c'est ce qui separe
  // les deux paliers qu'elle trouvait trop proches. Idee d'Abigail (05/09), reprise telle
  // quelle. Palier, pas rampe : rien jusqu'a 55, plein a 75.
  const bandeauOn =
    powerOn *
    Math.max(0, Math.min(1, (chill - 55) / 20)) *
    (0.80 + breathe * 0.20);

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
        {/* ⭐ TEINTE GUNMETAL — sa demande n°2 : « shift that rustic version's overall metal tone
            cooler/greyer, more like weathered gunmetal or aged steel, rather than beige/brown ».
            Son image EST brune a l'origine (teinte 37 deg, saturation 0,185, R-B +7,9) : ce n'est
            pas une derive de notre cote, c'est la transformation qu'elle demande dessus.
            Mesure apres filtre : saturation 0,112 · luminosite 65 · R-B -2,3 = gris neutre.
            ⛔ Ne PAS regenerer ni vectoriser l'image pour ca — ce sont les MEMES pixels, teinte
            deplacee. Grain, rouille, vis et geometrie intacts. Reglable, reversible. */}
        <filter id="rustic_gunmetal" colorInterpolationFilters="sRGB">
          {/* ⭐⭐ REVU LE 06/09 — le filtre MANGEAIT la rouille qu'elle redemande le 05/09.
              Mesure : la zone rouillee sort du PNG a R-B = +12,4 et arrivait a l'ecran a
              -3,8. La cause n'etait PAS la saturation (simulee a 0,30/0,45/0,62/0,80 : la
              zone reste negative partout) mais les PENTES du feComponentTransfer — le bleu
              montait plus vite que le rouge (1,43 contre 1,39), sur TOUS les pixels.
              Pentes egalisees, le refroidissement vient maintenant du seul intercept du
              bleu. Mesure apres correction : chassis -1,4 (le gunmetal validé le 03/09
              etait autour de -1,0) et zone rouillee +0,6, redevenue chaude.
              ⛔ Le PNG B1 sans filtre est a +5,9, soit PLUS chaud que l'image beige qu'elle
              a rejetee (+3,7) : ne pas retirer ce filtre, seulement le doser. */}
          <feColorMatrix type="saturate" values="0.45" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.41" intercept="-0.072" />
            <feFuncG type="linear" slope="1.41" intercept="-0.072" />
            <feFuncB type="linear" slope="1.40" intercept="-0.075" />
          </feComponentTransfer>
        </filter>
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
        {/* ⭐ RECOLORATION DES ICONES EN BLEU — sa demande du 05/09.
            Les icones sont DANS son PNG : impossible de les re-ecrire comme les labels
            (qui sont, eux, du texte SVG pose sur un aplat). On garde donc son dessin exact
            et on ne remplace que la TEINTE : la luminance d'origine pilote un degrade qui
            va du noir de la plaque au bleu glace. Le trace, l'epaisseur et l'antialiasing
            de la cliente sont conserves au pixel — seule la couleur change.
            ⛔ Ne PAS repeindre par un aplat : ca ecraserait le dessin en une tache. */}
          <clipPath id="clip_ic_STATUS"><rect x={160} y={ICONE_Y0} width={25} height={ICONE_Y1 - ICONE_Y0} /></clipPath>
          <clipPath id="clip_ic_DATA"><rect x={334} y={ICONE_Y0} width={28} height={ICONE_Y1 - ICONE_Y0} /></clipPath>
          <clipPath id="clip_ic_HUD"><rect x={503} y={ICONE_Y0} width={30} height={ICONE_Y1 - ICONE_Y0} /></clipPath>
          <clipPath id="clip_ic_CALIBRATE"><rect x={665} y={ICONE_Y0} width={26} height={ICONE_Y1 - ICONE_Y0} /></clipPath>
          <clipPath id="clip_ic_ABOUT"><rect x={879} y={ICONE_Y0} width={26} height={ICONE_Y1 - ICONE_Y0} /></clipPath>
          <clipPath id="clip_titre"><rect x={TITRE.x0} y={TITRE.y0} width={TITRE.x1 - TITRE.x0} height={TITRE.y1 - TITRE.y0} /></clipPath>
          <clipPath id="clip_bandeau"><rect x={BANDEAU.x0} y={BANDEAU.y0} width={BANDEAU.x1 - BANDEAU.x0} height={BANDEAU.y1 - BANDEAU.y0} /></clipPath>
          {/* Le titre « MAX CHILL DETECTION » vire au bleu lumineux a l'allumage. Comme les
              icones : sa luminance pilote un degrade, son trace est conserve au pixel. */}
          <filter id="rustic_titreBleu" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.33 0.34 0.33 0 0
                      0.33 0.34 0.33 0 0
                      0.33 0.34 0.33 0 0
                      0    0    0    1 0"
            />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.02 0.45" />
              <feFuncG type="table" tableValues="0.05 0.86" />
              <feFuncB type="table" tableValues="0.10 1.00" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
          {/* Le bandeau grave prend une lueur bleue au 75 % — sa differenciation 50/75. */}
          <filter id="rustic_bandeauBleu" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix"
              values="0.30 0.35 0.30 0 0
                      0.30 0.35 0.30 0 0
                      0.30 0.35 0.30 0 0
                      0    0    0    1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.03 0.42" />
              <feFuncG type="table" tableValues="0.07 0.82" />
              <feFuncB type="table" tableValues="0.12 1.00" />
            </feComponentTransfer>
          </filter>
        <filter id="rustic_iconeBleue" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.33 0.34 0.33 0 0
                    0.33 0.34 0.33 0 0
                    0.33 0.34 0.33 0 0
                    0    0    0    1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.04 0.37" />
            <feFuncG type="table" tableValues="0.06 0.80" />
            <feFuncB type="table" tableValues="0.09 1.00" />
          </feComponentTransfer>
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
        filter="url(#rustic_gunmetal)"
      />

      {/* ============ 1bis. LE GIVRE SUR L'APPAREIL (sa section 5) ============ */}
      {frost > 0.001 &&
        GIVRE.map((g) => {
          const op = frostOpacity(g);
          if (op <= 0.001) return null;
          return (
            <image
              key={g.src}
              href={staticFile(g.src)}
              x={0}
              y={0}
              width={RUSTIC_W}
              height={RUSTIC_H}
              opacity={op}
              preserveAspectRatio="none"
            />
          );
        })}

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
            <g key={i} opacity={op * head * powerOn}>
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

      {/* ============ 4ter. « MAX CHILL DETECTION » S'ILLUMINE ============
          Sa demande du 05/09 : « I'd also like MAX CHILL DETECTION to gain some blue
          color/glow when the meter powers on so that area feels more alive and connected
          to the chill theme. » Le titre est grave dans SON image : on le recolore, on ne
          le redessine pas. Il respire avec l'ecran, l'allumage suit `powerOn`. */}
      <g opacity={powerOn * (0.82 + breathe * 0.18)} clipPath="url(#clip_titre)">
        <image
          href={staticFile("_client-sim/chill-meter/device-rustique.png")}
          x={0}
          y={0}
          width={RUSTIC_W}
          height={RUSTIC_H}
          filter="url(#rustic_titreBleu)"
        />
      </g>

      {/* ============ 4quater. EDGE LIGHTING — le contour de l'appareil ============
          « light blue edge lighting around the device [...] I don't want it overly bright,
          but it should clearly feel powered on. » Une lueur froide qui court le long du
          cadre : elle nait de l'ecran allume et leche le metal autour. */}
      {powerOn > 0.01 && (
        <rect
          x={ECRAN.x - 26}
          y={ECRAN.y - 26}
          width={ECRAN.w + 52}
          height={ECRAN.h + 52}
          rx={ECRAN.r + 22}
          fill="none"
          stroke="#7ad4ff"
          strokeWidth={9}
          opacity={powerOn * (0.20 + breathe * 0.10)}
          filter="url(#rustic_screenBloom)"
        />
      )}

      {/* ============ 4quinquies. LE BANDEAU S'ALLUME AU 75 % ============
          Sa demande du 05/09 : « the jump between 50% and 75% does not feel different
          enough [...] one idea is to have AbiGirl Reacts light up in blue and glow at 75% ».
          C'est SON idee, reprise telle quelle : le bandeau grave reste metal jusqu'au 50 %,
          puis s'illumine entre 55 et 75 % — un evenement, pas une montee continue. */}
      {bandeauOn > 0.005 && (
        <g opacity={bandeauOn} clipPath="url(#clip_bandeau)">
          <image
            href={staticFile("_client-sim/chill-meter/device-rustique.png")}
            x={0}
            y={0}
            width={RUSTIC_W}
            height={RUSTIC_H}
            filter="url(#rustic_bandeauBleu)"
          />
        </g>
      )}

      {/* ============ 4bis. LES 5 ICONES, RECOLOREES EN BLEU ============
          Sa demande du 05/09 : « the symbols/icons to the left of each word blue ».
          ⚠️ Elle avait dit l'inverse le 03/09 (« can stay their current color ») — c'est
          un changement d'avis assume de sa part, pas une correction de notre travail.
          Chaque zone re-affiche le decor a travers le filtre de teinte, en clip.
          Elles s'allument avec l'appareil, comme les labels et le voyant. */}
      <g opacity={powerOn}>
          {ICONES.map((ic) => (
            <g key={ic.t} clipPath={`url(#clip_ic_${ic.t})`}>
              <image
                href={staticFile("_client-sim/chill-meter/device-rustique.png")}
                x={0}
                y={0}
                width={RUSTIC_W}
                height={RUSTIC_H}
                filter="url(#rustic_iconeBleue)"
              />
            </g>
          ))}
      </g>

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
              {/* La plaque couvre le texte d'origine en TOUTES circonstances : appareil
                  eteint, elle laisse une plaque nue et sombre — c'est l'etat correct. */}
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
                /* ⛔ Les labels sont ETEINTS tant que l'appareil ne l'est pas. Bug corrige le
                   04/09 (repere par Aziz) : la formule etait `0.72 + powerOn * 0.28`, donc les
                   textes restaient verts a 72 % sur un appareil eteint — aucune difference
                   lisible entre allume et eteint, alors que c'est tout le sens de l'entree.
                   Ils s'allument avec le voyant power et l'ecran, en meme temps. */
                opacity={powerOn}
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
