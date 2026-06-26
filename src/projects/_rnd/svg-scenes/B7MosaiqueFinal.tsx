import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Audio } from "remotion";

const FPS = 30;

const ENCRE = "#2b2117";
const CREME = "#e8dcc0";
const VERT = "#4a7c59";
const VERT_CLAIR = "#c8dfc0";
const BRUN = "#7a4a2a";
const OCRE = "#c8952a";
const JAUNE = "#f5c842";

function clampI(f: number, i: [number, number], o: [number, number]) {
  return interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Spring avec overshoot : stiffness élevé, damping bas = rebond élastique
function sprElastic(frame: number, delay: number) {
  return spring({ frame: frame - delay, fps: FPS, config: { damping: 9, stiffness: 140, mass: 0.8 } });
}

// Spring doux pour la couleur/opacité
function sprSmooth(frame: number, delay: number) {
  return spring({ frame: frame - delay, fps: FPS, config: { damping: 20, stiffness: 80 } });
}

// ─── COMPOSANT ARBRE ────────────────────────────────────────────────────────
// Révèle tronc puis houppier (décalé +15f), avec effet buvard (clip circulaire croissant)
// et sway indépendant sur le feuillage
const Tree: React.FC<{
  id: string;
  frame: number;
  treeDelay: number;       // frame de démarrage du tronc
  canopyExtraDelay?: number; // frames supplémentaires avant le houppier (défaut 15)
  canopyColorDelay: number; // frame de démarrage de la couleur
  swayAngle: number;
  trunkContent: React.ReactNode;
  canopyPath: string;       // path du houppier (forme exacte pour buvard)
  canopyContent: React.ReactNode; // tout le contenu du houppier (détails encre)
  trunkColorO: number;
  clipTop: number;
  clipBottom: number;
  canopyCx: number;  // centre du houppier pour le buvard
  canopyCy: number;
  canopyMaxR: number; // rayon max pour couvrir tout le houppier
}> = ({
  id, frame, treeDelay, canopyExtraDelay = 15, canopyColorDelay,
  swayAngle, trunkContent, canopyPath, canopyContent, trunkColorO,
  clipTop, clipBottom, canopyCx, canopyCy, canopyMaxR,
}) => {
  // Révélation tronc : clipPath monte de bas en haut (élastique)
  const trunkReveal = sprElastic(frame, treeDelay);
  const trunkRevealY = clipBottom - trunkReveal * (clipBottom - (clipTop + (clipBottom - clipTop) * 0.5));

  // Révélation houppier : décalé +canopyExtraDelay, aussi élastique
  const canopyReveal = sprElastic(frame, treeDelay + canopyExtraDelay);
  const canopyRevealY = clipBottom - canopyReveal * (clipBottom - clipTop);

  // Effet buvard : cercle qui grossit depuis le centre du houppier
  // Démarre au mot "mosaïque" (canopyColorDelay)
  const buvardR = clampI(frame, [canopyColorDelay, canopyColorDelay + 45], [0, canopyMaxR]);

  return (
    <g>
      <defs>
        {/* Clip tronc */}
        <clipPath id={`clip-trunk-${id}`}>
          <rect x={-200} y={trunkRevealY} width={1480} height={1920} />
        </clipPath>
        {/* Clip houppier */}
        <clipPath id={`clip-canopy-${id}`}>
          <rect x={-200} y={canopyRevealY} width={1480} height={1920} />
        </clipPath>
        {/* Mask buvard : cercle croissant */}
        <clipPath id={`clip-buvard-${id}`}>
          <circle cx={canopyCx} cy={canopyCy} r={buvardR} />
        </clipPath>
      </defs>

      {/* Houppier couleur — effet buvard (clipPath circulaire) */}
      <g clipPath={`url(#clip-canopy-${id})`}>
        <g clipPath={`url(#clip-buvard-${id})`}>
          <path d={canopyPath} fill={VERT} />
        </g>
      </g>

      {/* Houppier encre + sway — révélé avec son propre clipPath */}
      <g clipPath={`url(#clip-canopy-${id})`}>
        <g transform={`rotate(${swayAngle}, ${canopyCx}, ${canopyCy})`}>
          {canopyContent}
        </g>
      </g>

      {/* Tronc — clip séparé, couleur brun */}
      <g clipPath={`url(#clip-trunk-${id})`}>
        <g style={{ opacity: trunkColorO }}>
          {trunkContent}
        </g>
      </g>
    </g>
  );
};

export const B7MosaiqueFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;

  // ─── TIMINGS ────────────────────────────────────────────────────────────────
  const horizonP = clampI(frame, [0, 45], [0, 1]);
  const HORIZ_LEN = 1200;
  const horizonOffset = (1 - horizonP) * HORIZ_LEN;

  const parcellesO = clampI(frame, [45, 90], [0, 1]);

  // Soleil — pop initial + glow pulse + rayons oscillants
  const sunO = clampI(frame, [20, 70], [0, 1]);
  const sunSc = sprSmooth(frame, 10);
  // Glow pulse : halo qui respire (cycle ~2.2s)
  const sunPulse = 0.5 + 0.5 * Math.sin((frame / FPS) * (2 * Math.PI / 2.2));
  const glowR = 72 + sunPulse * 14;
  const glowOpacity = 0.18 + sunPulse * 0.14;
  // Rayons oscillants : r2 qui varie légèrement (rayons qui "vibrent")
  const rayOscil = Math.sin((frame / FPS) * (2 * Math.PI / 1.8));
  const rayExtra = rayOscil * 6;

  // Couleur chemin (ocre) : au mot "mosaïque" 5.68s = 170f
  const cheminColorO = clampI(frame, [165, 200], [0, 1]);

  // Couleur parcelles horizontales (ocre action humaine) : au mot "paysans" 10.58s = 317f
  const parcellesOcreO = clampI(frame, [317, 355], [0, 1]);

  // Hachures champs vert pâle : "paysages productifs" 7.52s = 226f
  // Stroke-dashoffset animé sur les hachures (effet tracé progressif)
  const HACH_LEN = 400;
  const hachuresProgress = clampI(frame, [226, 290], [0, 1]);
  const hachOffset = (1 - hachuresProgress) * HACH_LEN;

  // Arbres : délais en frames (tronc, houppier = +15f auto dans Tree)
  // Ordre : 3 (loin centre, 90f), 1 (gauche, 120f), 5 (droite, 158f), 4 (droite grand, 198f), 2 (avant grand, 240f)
  const treeDelays = [120, 240, 90, 198, 158];

  // Couleur houppiers (buvard) : tous au mot "mosaïque" 170f, légèrement décalés
  const canopyColorDelays = [175, 255, 170, 215, 180];

  // Sway indépendant : démarre dès que l'arbre est apparu (~40f après son delay)
  const swayAmps = [1.3, 1.7, 0.9, 1.4, 1.1];
  const swayPhases = [0, 14, 8, 22, 37];
  const swayAngles = swayAmps.map((amp, i) => {
    const swayStart = treeDelays[i] + 40;
    const swayInt = clampI(frame, [swayStart, swayStart + 25], [0, 1]);
    return swayInt * amp * Math.sin((frame + swayPhases[i]) / 28);
  });

  // Couleur troncs : simultané à la couleur houppier
  const trunkColorOs = canopyColorDelays.map((d) => clampI(frame, [d, d + 30], [0, 1]));

  // CTA : "Abonne-toi..." démarre à 16.0s (après silence = frame 480)
  const ctaO = clampI(frame, [480, 515], [0, 1]);

  const fadeOut = clampI(frame, [durationInFrames - 20, durationInFrames - 5], [0, 1]);

  // (karaoké géré inline dans le JSX — format B2-B6)

  // Paths houppiers exacts (extraits du SVG Gemini)
  const canopyPaths = [
    "M 70 740 C 70 670, 110 630, 150 630 C 190 630, 230 670, 230 740 C 230 800, 190 820, 150 820 C 110 820, 70 800, 70 740 Z",
    "M 200 600 C 200 500, 260 450, 350 450 C 440 450, 500 500, 500 600 C 500 680, 450 730, 350 730 C 250 730, 200 680, 200 600 Z",
    "M 530 770 C 530 730, 550 710, 580 710 C 610 710, 630 730, 630 770 C 630 810, 610 820, 580 820 C 550 820, 530 810, 530 770 Z",
    "M 700 670 C 700 570, 750 510, 820 510 C 890 510, 940 570, 940 670 C 940 750, 890 790, 820 790 C 750 790, 700 750, 700 670 Z",
    "M 930 750 C 930 690, 960 660, 1000 660 C 1040 660, 1070 690, 1070 750 C 1070 800, 1040 820, 1000 820 C 960 820, 930 800, 930 750 Z",
  ];

  // Centres et rayons pour le buvard
  const canopyCenters = [
    { cx: 150, cy: 725, r: 110 },
    { cx: 350, cy: 590, r: 175 },
    { cx: 580, cy: 765, r: 60 },
    { cx: 820, cy: 650, r: 145 },
    { cx: 1000, cy: 740, r: 80 },
  ];

  // Extents pour les clipPaths de révélation
  const treeExtents = [
    { top: 630, bottom: 860 },
    { top: 450, bottom: 895 },
    { top: 710, bottom: 848 },
    { top: 510, bottom: 882 },
    { top: 660, bottom: 867 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: CREME, overflow: "hidden" }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat7.mp3")} />

      <svg
        viewBox="0 0 1080 1920"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 - fadeOut }}
      >
        <rect width={1080} height={1920} fill={CREME} />

        {/* SOLEIL */}
        <g style={{ opacity: sunO }} transform={`translate(540,200) scale(${sunSc})`}>
          {/* Halo pulse extérieur */}
          <circle cx={0} cy={0} r={glowR} fill={JAUNE} fillOpacity={glowOpacity} />
          {/* Halo intermédiaire */}
          <circle cx={0} cy={0} r={64 + sunPulse * 6} fill={JAUNE} fillOpacity={glowOpacity * 0.6} />
          {/* Corps du soleil */}
          <circle cx={0} cy={0} r={60} fill={JAUNE} fillOpacity={0.88} stroke={ENCRE} strokeWidth={2} />
          {/* Rayons oscillants — r2 varie selon la phase */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const r1 = 68;
            // Rayons alternés longs/courts + oscillation déphasée par rayon
            const baseLen = i % 2 === 0 ? 22 : 12;
            const phase = Math.sin(((frame / FPS) * (2 * Math.PI / 1.8)) + i * 0.5);
            const r2 = r1 + baseLen + phase * 5;
            const w = i % 2 === 0 ? 2 : 1.5;
            return (
              <line key={i}
                x1={r1 * Math.cos(a)} y1={r1 * Math.sin(a)}
                x2={r2 * Math.cos(a)} y2={r2 * Math.sin(a)}
                stroke={ENCRE} strokeWidth={w} strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* HORIZON */}
        <g style={{ opacity: horizonP > 0.01 ? 1 : 0 }}>
          <path d="M 150 300 L 280 300 M 170 315 L 310 315 M 200 330 L 260 330"
            fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="12 6 4 6"
            style={{ opacity: clampI(horizonP, [0.5, 1], [0, 1]) }} />
          <path d="M 780 250 L 950 250 M 800 265 L 920 265 M 830 280 L 890 280"
            fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="15 8 5 8"
            style={{ opacity: clampI(horizonP, [0.5, 1], [0, 1]) }} />
          <path d="M 0 830 Q 150 810 350 835 T 750 820 T 1080 835"
            fill="none" stroke={ENCRE} strokeWidth={1.5}
            strokeDasharray={`${HORIZ_LEN}`} strokeDashoffset={horizonOffset} />
          <path d="M -50 840 Q 200 825 450 845 T 850 830 T 1100 845"
            fill="none" stroke={ENCRE} strokeWidth={1} strokeDasharray="8 6"
            style={{ opacity: clampI(horizonP, [0.7, 1], [0, 1]) }} />
          <path d="M 0 850 Q 250 840 500 850 T 1080 845"
            fill="none" stroke={ENCRE} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={`${HORIZ_LEN}`} strokeDashoffset={horizonOffset * 0.8} />
        </g>

        {/* PARCELLES */}
        <g style={{ opacity: parcellesO }}>
          <rect x={50} y={855} width={40} height={15} fill="none" stroke={ENCRE} strokeWidth={1} />
          <rect x={95} y={855} width={30} height={10} fill="none" stroke={ENCRE} strokeWidth={1} />
          <rect x={60} y={875} width={50} height={15} fill="none" stroke={ENCRE} strokeWidth={1} strokeDasharray="2 2" />
          <rect x={850} y={852} width={60} height={12} fill="none" stroke={ENCRE} strokeWidth={1} />
          <rect x={915} y={852} width={40} height={18} fill="none" stroke={ENCRE} strokeWidth={1} strokeDasharray="3 2" />
          <rect x={830} y={868} width={45} height={14} fill="none" stroke={ENCRE} strokeWidth={1} />

          {/* Chemin central — couleur ocre dessous + encre dessus */}
          <path d="M 520 850 C 500 1000, 400 1300, 300 1800" fill="none" stroke={OCRE} strokeWidth={7} strokeOpacity={cheminColorO} />
          <path d="M 560 850 C 580 1000, 680 1300, 780 1800" fill="none" stroke={OCRE} strokeWidth={7} strokeOpacity={cheminColorO} />
          <path d="M 520 850 C 500 1000, 400 1300, 300 1800" fill="none" stroke={ENCRE} strokeWidth={3} />
          <path d="M 560 850 C 580 1000, 680 1300, 780 1800" fill="none" stroke={ENCRE} strokeWidth={3} />

          <path d="M 400 850 L -100 1600" fill="none" stroke={ENCRE} strokeWidth={2} />
          <path d="M 680 850 L 1180 1600" fill="none" stroke={ENCRE} strokeWidth={2} />
          <path d="M 200 850 L -200 1200" fill="none" stroke={ENCRE} strokeWidth={1.5} />
          <path d="M 880 850 L 1280 1200" fill="none" stroke={ENCRE} strokeWidth={1.5} />

          {/* Lignes horizontales parcelles — ocre humain au mot "paysans" */}
          <path d="M 510 950 L 570 950" fill="none" stroke={OCRE} strokeWidth={3} strokeOpacity={parcellesOcreO} />
          <path d="M 510 950 L 570 950" fill="none" stroke={ENCRE} strokeWidth={1.5} />
          <path d="M 495 1020 L 585 1020" fill="none" stroke={OCRE} strokeWidth={3} strokeOpacity={parcellesOcreO} />
          <path d="M 495 1020 L 585 1020" fill="none" stroke={ENCRE} strokeWidth={1.5} />
          <path d="M 470 1120 L 610 1120" fill="none" stroke={OCRE} strokeWidth={3} strokeOpacity={parcellesOcreO} />
          <path d="M 470 1120 L 610 1120" fill="none" stroke={ENCRE} strokeWidth={2} />
          <path d="M 440 1250 L 640 1250" fill="none" stroke={OCRE} strokeWidth={3} strokeOpacity={parcellesOcreO} />
          <path d="M 440 1250 L 640 1250" fill="none" stroke={ENCRE} strokeWidth={2} />
          <path d="M 390 1420 L 690 1420" fill="none" stroke={OCRE} strokeWidth={4} strokeOpacity={parcellesOcreO} />
          <path d="M 390 1420 L 690 1420" fill="none" stroke={ENCRE} strokeWidth={2.5} />
          <path d="M 330 1650 L 750 1650" fill="none" stroke={OCRE} strokeWidth={4} strokeOpacity={parcellesOcreO} />
          <path d="M 330 1650 L 750 1650" fill="none" stroke={ENCRE} strokeWidth={3} />
          <path d="M -150 1150 Q 540 1250 1230 1150" fill="none" stroke={OCRE} strokeWidth={3} strokeOpacity={parcellesOcreO} />
          <path d="M -150 1150 Q 540 1250 1230 1150" fill="none" stroke={ENCRE} strokeWidth={2} />
          <path d="M -200 1450 Q 540 1550 1280 1450" fill="none" stroke={OCRE} strokeWidth={3} strokeOpacity={parcellesOcreO} />
          <path d="M -200 1450 Q 540 1550 1280 1450" fill="none" stroke={ENCRE} strokeWidth={2} />

          {/* Hachures gauche — tracé progressif (stroke-dashoffset) au mot "paysages productifs" */}
          <path d="M 100 970 L 350 1010 M 80 985 L 360 1030 M 60 1000 L 370 1050 M 40 1015 L 380 1070 M 20 1030 L 390 1090"
            fill="none" stroke={VERT_CLAIR} strokeWidth={5} strokeOpacity={hachuresProgress}
            strokeDasharray={`${HACH_LEN}`} strokeDashoffset={hachOffset} />
          <path d="M 100 970 L 350 1010 M 80 985 L 360 1030 M 60 1000 L 370 1050 M 40 1015 L 380 1070 M 20 1030 L 390 1090"
            fill="none" stroke={ENCRE} strokeWidth={1} strokeDasharray="5 5"
            strokeDashoffset={hachOffset * 0.9} />

          {/* Hachures droite */}
          <path d="M 700 1010 L 980 970 M 710 1030 L 990 985 M 720 1050 L 1000 1000 M 730 1070 L 1010 1015 M 740 1090 L 1020 1030"
            fill="none" stroke={VERT_CLAIR} strokeWidth={5} strokeOpacity={hachuresProgress}
            strokeDasharray={`${HACH_LEN}`} strokeDashoffset={hachOffset} />
          <path d="M 700 1010 L 980 970 M 710 1030 L 990 985 M 720 1050 L 1000 1000 M 730 1070 L 1010 1015 M 740 1090 L 1020 1030"
            fill="none" stroke={ENCRE} strokeWidth={1}
            strokeDashoffset={hachOffset * 0.9} />

          {/* Hachures centre-bas */}
          <path d="M 450 1195 L 450 1380 M 480 1205 L 480 1400 M 510 1215 L 510 1410 M 570 1215 L 570 1410 M 600 1205 L 600 1400 M 630 1195 L 630 1380"
            fill="none" stroke={VERT_CLAIR} strokeWidth={5} strokeOpacity={hachuresProgress}
            strokeDasharray={`${HACH_LEN}`} strokeDashoffset={hachOffset * 1.1} />
          <path d="M 450 1195 L 450 1380 M 480 1205 L 480 1400 M 510 1215 L 510 1410 M 570 1215 L 570 1410 M 600 1205 L 600 1400 M 630 1195 L 630 1380"
            fill="none" stroke={ENCRE} strokeWidth={1.5} strokeDasharray="3 6"
            strokeDashoffset={hachOffset * 1.2} />

          <path d="M -10 1250 L 220 1350 M -20 1280 L 250 1380 M -30 1310 L 280 1410" fill="none" stroke={ENCRE} strokeWidth={1} />
          <path d="M 800 1370 L 1100 1220 M 820 1410 L 1120 1260 M 840 1450 L 1140 1300" fill="none" stroke={ENCRE} strokeWidth={1} strokeDasharray="8 4" />
          <path d="M 0 1100 Q 150 1150 250 1250" fill="none" stroke={ENCRE} strokeWidth={1} strokeDasharray="6 4" />
          <path d="M 1080 1000 Q 950 1050 850 1150" fill="none" stroke={ENCRE} strokeWidth={1} />
        </g>

        {/* ── ARBRES ──────────────────────────────────────────────────────────── */}

        {/* ARBRE 3 — petit horizon centre */}
        <Tree
          id="a3" frame={frame}
          treeDelay={treeDelays[2]} canopyExtraDelay={18}
          canopyColorDelay={canopyColorDelays[2]}
          swayAngle={swayAngles[2]}
          canopyPath={canopyPaths[2]}
          canopyCx={canopyCenters[2].cx} canopyCy={canopyCenters[2].cy} canopyMaxR={canopyCenters[2].r}
          clipTop={treeExtents[2].top} clipBottom={treeExtents[2].bottom}
          trunkColorO={trunkColorOs[2]}
          trunkContent={<>
            <path d="M 577 810 L 575 845 L 585 845 L 583 810" fill={BRUN} stroke={ENCRE} strokeWidth={2} strokeLinejoin="round" />
            <ellipse cx={580} cy={845} rx={12} ry={3} fill="none" stroke={ENCRE} strokeWidth={1} />
          </>}
          canopyContent={<>
            <path d="M 530 770 C 530 730, 550 710, 580 710 C 610 710, 630 730, 630 770 C 630 810, 610 820, 580 820 C 550 820, 530 810, 530 770 Z" fill="none" stroke={ENCRE} strokeWidth={2.5} />
            <path d="M 545 770 C 545 745, 560 725, 580 725" fill="none" stroke={ENCRE} strokeWidth={1} strokeLinecap="round" />
            <path d="M 590 740 Q 600 735 605 745 M 575 790 Q 585 780 595 795" fill="none" stroke={ENCRE} strokeWidth={1} strokeLinecap="round" />
          </>}
        />

        {/* ARBRE 1 — gauche */}
        <Tree
          id="a1" frame={frame}
          treeDelay={treeDelays[0]} canopyExtraDelay={15}
          canopyColorDelay={canopyColorDelays[0]}
          swayAngle={swayAngles[0]}
          canopyPath={canopyPaths[0]}
          canopyCx={canopyCenters[0].cx} canopyCy={canopyCenters[0].cy} canopyMaxR={canopyCenters[0].r}
          clipTop={treeExtents[0].top} clipBottom={treeExtents[0].bottom}
          trunkColorO={trunkColorOs[0]}
          trunkContent={<>
            <path d="M 145 800 L 140 855 C 150 860, 160 860, 170 855 L 155 800" fill={BRUN} stroke={ENCRE} strokeWidth={2.5} strokeLinejoin="round" />
            <ellipse cx={155} cy={855} rx={22} ry={5} fill="none" stroke={ENCRE} strokeWidth={1.5} />
          </>}
          canopyContent={<>
            <path d="M 70 740 C 70 670, 110 630, 150 630 C 190 630, 230 670, 230 740 C 230 800, 190 820, 150 820 C 110 820, 70 800, 70 740 Z" fill="none" stroke={ENCRE} strokeWidth={3} />
            <path d="M 90 740 C 90 690, 120 650, 150 650" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
            <path d="M 105 740 C 105 710, 125 670, 150 670" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="6 4" />
            <path d="M 100 780 C 120 800, 140 805, 150 805" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
            <path d="M 160 670 Q 170 660 180 675 Q 190 665 200 680" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
            <path d="M 180 750 Q 190 740 200 750" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
          </>}
        />

        {/* ARBRE 5 — droite */}
        <Tree
          id="a5" frame={frame}
          treeDelay={treeDelays[4]} canopyExtraDelay={15}
          canopyColorDelay={canopyColorDelays[4]}
          swayAngle={swayAngles[4]}
          canopyPath={canopyPaths[4]}
          canopyCx={canopyCenters[4].cx} canopyCy={canopyCenters[4].cy} canopyMaxR={canopyCenters[4].r}
          clipTop={treeExtents[4].top} clipBottom={treeExtents[4].bottom}
          trunkColorO={trunkColorOs[4]}
          trunkContent={<>
            <path d="M 996 800 C 990 820, 985 840, 980 865 C 1000 860, 1010 860, 1020 865 C 1010 840, 1004 820, 1004 800" fill={BRUN} stroke={ENCRE} strokeWidth={2} strokeLinejoin="round" />
            <ellipse cx={1008} cy={863} rx={18} ry={4} fill="none" stroke={ENCRE} strokeWidth={1.5} />
          </>}
          canopyContent={<>
            <path d="M 930 750 C 930 690, 960 660, 1000 660 C 1040 660, 1070 690, 1070 750 C 1070 800, 1040 820, 1000 820 C 960 820, 930 800, 930 750 Z" fill="none" stroke={ENCRE} strokeWidth={2.5} />
            <path d="M 945 750 C 945 710, 970 680, 1000 680" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
            <path d="M 960 750 C 960 725, 980 700, 1000 700" fill="none" stroke={ENCRE} strokeWidth={1} strokeLinecap="round" strokeDasharray="5 4" />
            <path d="M 1010 700 Q 1025 690 1040 710 M 1020 760 Q 1030 750 1045 765" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
          </>}
        />

        {/* ARBRE 4 — droite grand */}
        <Tree
          id="a4" frame={frame}
          treeDelay={treeDelays[3]} canopyExtraDelay={18}
          canopyColorDelay={canopyColorDelays[3]}
          swayAngle={swayAngles[3]}
          canopyPath={canopyPaths[3]}
          canopyCx={canopyCenters[3].cx} canopyCy={canopyCenters[3].cy} canopyMaxR={canopyCenters[3].r}
          clipTop={treeExtents[3].top} clipBottom={treeExtents[3].bottom}
          trunkColorO={trunkColorOs[3]}
          trunkContent={<>
            <path d="M 813 750 C 810 800, 805 840, 790 880 C 815 870, 835 870, 850 880 C 835 840, 827 800, 827 750" fill={BRUN} stroke={ENCRE} strokeWidth={3} strokeLinejoin="round" />
            <ellipse cx={838} cy={877} rx={35} ry={8} fill="none" stroke={ENCRE} strokeWidth={1.5} strokeDasharray="4 3" />
          </>}
          canopyContent={<>
            <path d="M 700 670 C 700 570, 750 510, 820 510 C 890 510, 940 570, 940 670 C 940 750, 890 790, 820 790 C 750 790, 700 750, 700 670 Z" fill="none" stroke={ENCRE} strokeWidth={3.5} />
            <path d="M 725 670 C 725 600, 760 540, 820 540" fill="none" stroke={ENCRE} strokeWidth={2} strokeLinecap="round" />
            <path d="M 750 670 C 750 620, 780 570, 820 570" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="8 6" />
            <path d="M 730 710 C 750 760, 780 770, 820 770" fill="none" stroke={ENCRE} strokeWidth={2} strokeLinecap="round" />
            <path d="M 840 550 Q 860 530 880 560 Q 900 550 910 570" fill="none" stroke={ENCRE} strokeWidth={2} strokeLinecap="round" />
            <path d="M 860 620 Q 880 610 890 630" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
            <path d="M 820 730 Q 840 710 860 740" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
          </>}
        />

        {/* ARBRE 2 — avant-plan gauche, le plus grand */}
        <Tree
          id="a2" frame={frame}
          treeDelay={treeDelays[1]} canopyExtraDelay={20}
          canopyColorDelay={canopyColorDelays[1]}
          swayAngle={swayAngles[1]}
          canopyPath={canopyPaths[1]}
          canopyCx={canopyCenters[1].cx} canopyCy={canopyCenters[1].cy} canopyMaxR={canopyCenters[1].r}
          clipTop={treeExtents[1].top} clipBottom={treeExtents[1].bottom}
          trunkColorO={trunkColorOs[1]}
          trunkContent={<>
            <path d="M 340 730 C 330 800, 320 850, 300 890 C 330 880, 350 880, 380 890 C 360 850, 350 800, 350 730" fill={BRUN} stroke={ENCRE} strokeWidth={3} strokeLinejoin="round" />
            <ellipse cx={340} cy={890} rx={45} ry={10} fill="none" stroke={ENCRE} strokeWidth={1.5} strokeDasharray="5 3" />
          </>}
          canopyContent={<>
            <path d="M 200 600 C 200 500, 260 450, 350 450 C 440 450, 500 500, 500 600 C 500 680, 450 730, 350 730 C 250 730, 200 680, 200 600 Z" fill="none" stroke={ENCRE} strokeWidth={4} />
            <path d="M 220 600 C 220 520, 270 470, 340 470" fill="none" stroke={ENCRE} strokeWidth={2} strokeLinecap="round" />
            <path d="M 240 600 C 240 540, 280 490, 340 490" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="10 5" />
            <path d="M 210 640 C 250 700, 310 710, 350 710" fill="none" stroke={ENCRE} strokeWidth={2} strokeLinecap="round" />
            <path d="M 230 630 C 260 680, 310 690, 350 690" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="8 6" />
            <path d="M 350 500 Q 370 480 390 500 Q 410 490 420 510 M 360 530 Q 380 520 400 540 M 300 680 Q 320 660 340 680" fill="none" stroke={ENCRE} strokeWidth={2} strokeLinecap="round" />
            <path d="M 450 600 Q 470 580 480 610 M 420 650 Q 440 640 450 660 M 250 550 Q 270 530 280 560" fill="none" stroke={ENCRE} strokeWidth={1.5} strokeLinecap="round" />
          </>}
        />

        <text x={1060} y={1900} textAnchor="end" fontSize={18} fontFamily="Georgia, serif"
          fill={ENCRE} fillOpacity={0.4 * parcellesO}>AU Great Green Wall Strategy 2024</text>
      </svg>

      {/* KARAOKÉ — format identique B2-B6 */}
      {(() => {
        // Mots avec timings Whisper réels
        const B7_WORDS = [
          { word: "La", start: 0.000, end: 0.260 },
          { word: "Grande", start: 0.260, end: 0.780 },
          { word: "Muraille", start: 0.780, end: 0.880 },
          { word: "Verte", start: 0.880, end: 1.180 },
          { word: "n'est", start: 1.180, end: 1.360 },
          { word: "pas", start: 1.360, end: 1.740 },
          { word: "morte.", start: 1.740, end: 2.520 },
          { word: "Elle", start: 2.520, end: 2.580 },
          { word: "a", start: 2.580, end: 2.800 },
          { word: "évolué.", start: 2.800, end: 4.940 },
          { word: "Aujourd'hui,", start: 4.940, end: 5.160 },
          { word: "c'est", start: 5.400, end: 5.520 },
          { word: "une", start: 5.520, end: 5.680 },
          { word: "mosaïque", start: 5.680, end: 6.120 },
          { word: "vivante", start: 6.120, end: 6.780 },
          { word: "de", start: 6.780, end: 7.160 },
          { word: "paysages", start: 7.160, end: 7.520 },
          { word: "productifs", start: 7.520, end: 8.300 },
          { word: "—", start: 8.300, end: 9.340 },
          { word: "gérée", start: 9.340, end: 9.420 },
          { word: "par", start: 9.420, end: 9.600 },
          { word: "des", start: 9.600, end: 9.900 },
          { word: "millions", start: 9.900, end: 10.000 },
          { word: "de", start: 10.000, end: 10.580 },
          { word: "paysans,", start: 10.580, end: 10.740 },
          { word: "à", start: 10.740, end: 11.140 },
          { word: "travers", start: 11.140, end: 11.440 },
          { word: "onze", start: 11.440, end: 11.840 },
          { word: "pays.", start: 11.840, end: 13.500 },
          { word: "Le", start: 13.500, end: 13.620 },
          { word: "mouvement", start: 13.620, end: 13.960 },
          { word: "avance.", start: 13.960, end: 14.640 },
        ];
        const B7_PHRASE_BREAKS = [7, 10, 18, 29];
        const b7Phrases: { words: typeof B7_WORDS; start: number; end: number }[] = [];
        let pStart = 0;
        const bSet = new Set(B7_PHRASE_BREAKS);
        for (let i = 0; i < B7_WORDS.length; i++) {
          if (bSet.has(i) || i === B7_WORDS.length - 1) {
            const sl = B7_WORDS.slice(pStart, i + 1);
            b7Phrases.push({ words: sl, start: sl[0].start, end: sl[sl.length - 1].end });
            pStart = i + 1;
          }
        }
        const activeIdx = b7Phrases.findIndex((p, i) => {
          const nextStart = b7Phrases[i + 1]?.start ?? p.end + 0.6;
          return t >= p.start - 0.1 && t < nextStart;
        });
        const activePhrase = activeIdx >= 0 ? b7Phrases[activeIdx] : null;
        const subOpacity = clampI(frame, [0, 10], [0, 1]);
        const endFade = clampI(frame, [durationInFrames - 20, durationInFrames - 5], [1, 0]);

        if (!activePhrase || subOpacity <= 0.001) return null;
        return (
          <div style={{
            position: "absolute", left: 0, right: 0, top: 1620,
            display: "flex", justifyContent: "center",
            opacity: subOpacity * endFade, pointerEvents: "none",
          }}>
            <div style={{
              maxWidth: 880, margin: "0 80px", padding: "18px 32px",
              borderRadius: 18, background: "rgba(232,220,192,0.72)",
              border: "1px solid rgba(43,33,23,0.18)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 37, lineHeight: 1.3,
              textAlign: "center", textWrap: "balance" as any,
            }}>
              {activePhrase.words.map((w, i) => {
                const spoken = t >= w.start;
                const active = t >= w.start && t <= w.end + 0.12;
                return (
                  <span key={i} style={{
                    color: active ? VERT : ENCRE,
                    opacity: spoken ? 1 : 0.45,
                    fontWeight: spoken ? 800 : 600,
                    marginRight: 9, display: "inline-block",
                  }}>
                    {w.word}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* CTA */}
      <div style={{
        position: "absolute", bottom: 60, left: 60, right: 60,
        textAlign: "center", opacity: ctaO * (1 - fadeOut),
      }}>
        <div style={{ color: VERT, fontSize: 38, fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: 1 }}>
          Abonne-toi pour d'autres sujets fascinants sur l'Afrique d'aujourd'hui.
        </div>
        <div style={{ color: ENCRE, fontSize: 28, fontFamily: "Georgia, serif", marginTop: 10, opacity: 0.65 }}>
          GéoAfrique
        </div>
      </div>
    </div>
  );
};
