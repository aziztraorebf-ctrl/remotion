// GazoducActe2Financement — Acte 2, insert SVG narratif "chéquier absent + tuyau virtuel + Mauritanie",
// joué APRÈS le segment carte (172.66s→223.62s narration-p2, 50.96s/1529f, forced-align réel).
//
// V4 (2026-08-04) — retour Aziz après montage complet : "tout se trace à peu près en douze secondes,
// problématique pour une scène qui dure 50s [...] pourquoi tout faire apparaître d'un bloc plutôt que
// dessiner le SVG [...] ligne par ligne". Diagnostic confirmé — la V3 utilisait `opacity={reveal}`
// (fade ~1-2s) sur presque tous les éléments au lieu du dessin progressif (`strokeDashoffset`) déjà
// utilisé sur le tracé doré central. Refonte complète : CHAQUE élément structurant se DESSINE (trait
// qui se trace), étalé sur toute la durée, dans l'ordre demandé : tuyau plein qui se dessine → document
// qui arrive → trait doré + fantôme qui se dessinent EN PARALLÈLE et se prolongent lentement → plume
// qui ESQUISSE un geste d'hésitation vers le bas (comme si elle allait signer) puis se retient et
// remonte, sans jamais se poser (secondary motion, retour Aziz).
//
// PREMIER PLAN = document/plume/goutte de Gemini 3.1 Pro (le geste "jamais de pose/jamais de chute"
// reste le bon, cohérent avec "personne n'a encore sorti le chéquier [...] les tuyaux restent VIRTUELS").
// ARRIÈRE-PLAN = tuyau de GPT-5.6 Sol, choisi par Aziz car "peut durer quasiment toute la scène".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const GAZODUC_A2_FINANCEMENT_FRAMES = 1529 + 9; // 50.96s + marge sécurité audio (300ms)

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * 30);
const BG = "#182746";
const GOLD = "#FFC742";

// Helper : reveal 0..1 -> strokeDashoffset pour un trait qui se dessine progressivement.
function drawOffset(len: number, progress: number) {
  return len * (1 - Math.max(0, Math.min(1, progress)));
}

// ===== Décor GPT — fond (fondu léger, c'est un arrière-plan neutre, pas un tracé) + cadre qui se dessine =====
const DecorGPT: React.FC<{ bgReveal: number; cadreProgress: number }> = ({ bgReveal, cadreProgress }) => {
  const cadreLen = 3728; // périmètre approx du cadre 1852x1012
  return (
    <>
      <g id="fond_bleu_marine">
        <rect width={1920} height={1080} fill={BG} />
        <path d="M0 170C330 116 595 137 861 189C1136 243 1463 239 1920 155V0H0Z" fill="#2a3f66" opacity={0.28 * bgReveal} />
        <path d="M0 874C337 810 634 824 931 891C1260 966 1568 944 1920 846V1080H0Z" fill="#101c34" opacity={0.55 * bgReveal} />
      </g>
      <g id="cadre_grave">
        <rect x={34} y={34} width={1852} height={1012} rx={8} fill="none" stroke="#8fa0bb" strokeWidth={2} opacity={0.55}
          strokeDasharray={cadreLen} strokeDashoffset={drawOffset(cadreLen, cadreProgress)} />
      </g>
      <g id="repères_cartographiques_fantomes" fill="none" stroke="#8fa0bb" opacity={0.18 * bgReveal}>
        <ellipse cx={960} cy={497} rx={779} ry={290} strokeWidth={1.5} />
        <path d="M172 497H1748M960 185V848" strokeWidth={1} />
      </g>
    </>
  );
};

// ===== Plateforme gauche — se dessine (contour) puis fill léger =====
const Plateforme: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0) return null;
  const contourLen = 1550;
  return (
    <g id="plateforme_physique_gauche">
      <path d="M0 591H699L731 624L683 686H0Z" fill="#2a3f66" opacity={interpolate(progress, [0.3, 1], [0, 1], clampB)} />
      <path d="M0 591H699L731 624" fill="none" stroke="#d8deea" strokeWidth={4}
        strokeDasharray={contourLen} strokeDashoffset={drawOffset(contourLen, progress)} />
    </g>
  );
};

// ===== Gouffre — le zigzag se DESSINE (pas un fade), le fond sombre suit avec un léger délai =====
const Gouffre: React.FC<{ lineProgress: number; fillReveal: number }> = ({ lineProgress, fillReveal }) => {
  if (lineProgress <= 0) return null;
  const zigzagLen = 950;
  return (
    <g id="gouffre_de_realite">
      <path d="M0 716L336 701L538 680L722 594L833 640L958 596L1086 649L1209 603L1387 686L1607 713L1920 724V1080H0Z"
        fill="#101a30" opacity={fillReveal} />
      <path d="M538 680L722 594L833 640L958 596L1086 649L1209 603L1387 686" fill="none" stroke="#d8deea" strokeWidth={4} opacity={0.72}
        strokeDasharray={zigzagLen} strokeDashoffset={drawOffset(zigzagLen, lineProgress)} />
    </g>
  );
};

// ===== Tuyau physique plein (riveté, GPT) — se DESSINE contour par contour, remplissage suit =====
const TuyauPhysique: React.FC<{ contourProgress: number; fillReveal: number }> = ({ contourProgress, fillReveal }) => {
  if (contourProgress <= 0) return null;
  const bodyLen = 1780; // périmètre approx du corps du tuyau
  const jointLen = 460; // périmètre approx d'un joint
  const jointProgress = interpolate(contourProgress, [0.5, 1], [0, 1], clampB);
  return (
    <g id="gazoduc_physique">
      <path d="M0 370H691C725 370 750 396 750 429V511C750 544 725 570 691 570H0Z"
        fill="#2a3f66" opacity={fillReveal} stroke="#d8deea" strokeWidth={5}
        strokeDasharray={bodyLen} strokeDashoffset={drawOffset(bodyLen, contourProgress)} />
      <path d="M0 407H690M0 530H690" fill="none" stroke="#8fa0bb" strokeWidth={2} opacity={0.6 * fillReveal} />
      <g id="joints_du_gazoduc" fill="#182746" stroke="#d8deea">
        {[151, 329, 507].map((x, i) => (
          <path key={x} d={`M${x} 359H${x + 30}V581H${x}Z`} strokeWidth={4}
            strokeDasharray={jointLen} strokeDashoffset={drawOffset(jointLen, Math.max(0, jointProgress - i * 0.15))}
            opacity={jointProgress > i * 0.15 ? 1 : 0} />
        ))}
      </g>
    </g>
  );
};

// ===== Bride de rupture — se dessine (cercles concentriques), puis pulse doucement en continu =====
const BrideRupture: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  if (progress <= 0) return null;
  const pulse = 1 + Math.sin(frame / 50) * 0.02;
  const ring1Len = 530, ring2Len = 385, ring3Len = 250;
  return (
    <g id="bride_de_rupture" transform={`translate(744 470) scale(${pulse}) translate(-744 -470)`}>
      <ellipse cx={744} cy={470} rx={58} ry={111} fill={BG} stroke="#d8deea" strokeWidth={6}
        strokeDasharray={ring1Len} strokeDashoffset={drawOffset(ring1Len, progress)} />
      <ellipse cx={744} cy={470} rx={39} ry={84} fill="#0e192e" stroke="#8fa0bb" strokeWidth={4}
        strokeDasharray={ring2Len} strokeDashoffset={drawOffset(ring2Len, interpolate(progress, [0.3, 1], [0, 1], clampB))} />
      <ellipse cx={744} cy={470} rx={23} ry={57} fill="#101a30" stroke="#3a5488" strokeWidth={2}
        strokeDasharray={ring3Len} strokeDashoffset={drawOffset(ring3Len, interpolate(progress, [0.6, 1], [0, 1], clampB))} />
      {progress > 0.8 && (
        <g fill="#d8deea" opacity={interpolate(progress, [0.8, 1], [0, 1], clampB)}>
          <circle cx={728} cy={377} r={5} /><circle cx={758} cy={381} r={5} /><circle cx={776} cy={414} r={5} />
          <circle cx={782} cy={470} r={5} /><circle cx={776} cy={526} r={5} /><circle cx={758} cy={559} r={5} />
          <circle cx={728} cy={563} r={5} /><circle cx={708} cy={516} r={5} /><circle cx={705} cy={424} r={5} />
        </g>
      )}
    </g>
  );
};

// ===== Tuyau virtuel — le trait doré ET les pointillés fantômes se DESSINENT EN PARALLÈLE, lentement,
// sur une grande partie de la scène (retour Aziz : "le petit tiret orange en arrière-plan qui se
// prolonge [...] en même temps que le tiret du tuyau fantôme") =====
const TuyauVirtuel: React.FC<{ fantomeProgress: number; traceProgress: number }> = ({ fantomeProgress, traceProgress }) => {
  if (fantomeProgress <= 0 && traceProgress <= 0) return null;
  const fantomeLen = 730;
  const traceLen = 720;
  const anneauLens = [550, 620, 580, 460, 380];
  const anneauCx = [872, 1015, 1164, 1310, 1444];
  const anneauCy = [470, 470, 470, 477, 474];
  const anneauRx = [20, 20, 20, 20, 20];
  const anneauRy = [87, 99, 92, 72, 58];
  return (
    <g id="tuyau_virtuel_suspendu">
      <path d="M788 388C930 359 1074 359 1224 391C1321 412 1415 421 1510 414" fill="none" stroke="#8fa0bb" strokeWidth={3} opacity={0.55}
        strokeDasharray={`18 18 ${fantomeLen}`} strokeDashoffset={drawOffset(fantomeLen, fantomeProgress)} />
      <path d="M788 552C930 581 1074 581 1224 549C1321 528 1415 519 1510 526" fill="none" stroke="#8fa0bb" strokeWidth={3} opacity={0.55}
        strokeDasharray={`18 18 ${fantomeLen}`} strokeDashoffset={drawOffset(fantomeLen, fantomeProgress)} />
      <path d="M797 470C941 448 1087 448 1231 470C1328 485 1420 484 1510 470"
        fill="none" stroke={GOLD} strokeWidth={8} strokeLinecap="round" strokeDasharray={traceLen}
        strokeDashoffset={drawOffset(traceLen, traceProgress)} />
      <g id="anneaux_techniques_fantomes" fill="none" stroke="#8fa0bb" opacity={0.62}>
        {anneauCx.map((cx, i) => {
          const localProgress = interpolate(fantomeProgress, [i * 0.15, i * 0.15 + 0.4], [0, 1], clampB);
          if (localProgress <= 0) return null;
          return (
            <ellipse key={cx} cx={cx} cy={anneauCy[i]} rx={anneauRx[i]} ry={anneauRy[i]} strokeWidth={2}
              strokeDasharray={`8 9 ${anneauLens[i]}`} strokeDashoffset={drawOffset(anneauLens[i], localProgress)} />
          );
        })}
      </g>
    </g>
  );
};

// ===== Destination en plan seulement — se dessine très lentement, en tout dernier, jamais complète =====
const DestinationFantome: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0) return null;
  const len1 = 420, len2 = 260, len3 = 400;
  return (
    <g id="destination_en_plan_seulement" opacity={0.7}>
      <path d="M1510 414H1648L1694 448V503L1648 526H1510Z" fill={BG} fillOpacity={0.24 * progress} stroke="#8fa0bb" strokeWidth={3}
        strokeDasharray={`14 12 ${len1}`} strokeDashoffset={drawOffset(len1, progress)} />
      <ellipse cx={1510} cy={470} rx={27} ry={57} fill={BG} fillOpacity={0.25 * progress} stroke="#8fa0bb" strokeWidth={3}
        strokeDasharray={`10 9 ${len2}`} strokeDashoffset={drawOffset(len2, progress)} />
      <path d="M1722 448V353H1782V503M1722 381H1782M1752 353V318" fill="none" stroke="#8fa0bb" strokeWidth={3}
        strokeDasharray={`12 10 ${len3}`} strokeDashoffset={drawOffset(len3, progress)} />
    </g>
  );
};

// ===== Document Gemini — se DESSINE (contour d'abord), puis les lignes de texte se tracent une à une =====
const DocumentGemini: React.FC<{ contourProgress: number; linesProgress: number }> = ({ contourProgress, linesProgress }) => {
  if (contourProgress <= 0) return null;
  const contourLen = 1560;
  const lineLens = [930, 930, 930, 520, 450];
  const linePaths = [
    "M 220,720 L 1150,720", "M 240,750 L 1170,750", "M 260,780 L 1190,780",
    "M 280,810 L 800,810", "M 300,840 L 750,840",
  ];
  return (
    <g id="diplomatic_dossier">
      <polygon points="320,970 1520,970 1320,670 120,670" fill="#151e32" opacity={interpolate(contourProgress, [0.3, 1], [0, 1], clampB)} />
      <polygon points="300,950 1500,950 1300,650 100,650" fill="#1a2744" stroke="#3a5488" strokeWidth={3}
        opacity={interpolate(contourProgress, [0.3, 1], [0, 1], clampB)}
        strokeDasharray={contourLen} strokeDashoffset={drawOffset(contourLen, contourProgress)} />
      <g stroke="#3a5488" strokeWidth={2} fill="none">
        {linePaths.map((d, i) => {
          const localP = interpolate(linesProgress, [i * 0.18, i * 0.18 + 0.35], [0, 1], clampB);
          if (localP <= 0) return null;
          return <path key={d} d={d} strokeDasharray={`${lineLens[i]}`} strokeDashoffset={drawOffset(lineLens[i], localP)} />;
        })}
      </g>
      <g id="empty_signature_block" opacity={interpolate(linesProgress, [0.7, 1], [0, 1], clampB)}>
        <path d="M 900,880 L 1350,880" stroke="#4c6a99" strokeWidth={2} />
        <ellipse cx={1250} cy={800} rx={70} ry={30} stroke="#3a5488" strokeWidth={2} strokeDasharray="8 4" fill="none" />
        <path d="M 1240,795 L 1260,805 M 1260,795 L 1240,805" stroke="#3a5488" strokeWidth={1} />
      </g>
    </g>
  );
};

// ===== Plume Gemini — ESQUISSE un geste d'hésitation périodique (descend comme pour signer, se
// retient, remonte) au lieu d'un simple flottement passif (retour Aziz : "un léger mouvement du stylo
// comme s'il allait signer, mais il ne se passe jamais rien, une hésitation") =====
const PLUME_Y_OFFSET = 70;
const PlumeHesitante: React.FC<{ reveal: number; frame: number }> = ({ reveal, frame }) => {
  if (reveal <= 0) return null;
  // Cycle d'hésitation ~4.5s : descend doucement (approche), ralentit, remonte — jamais ne touche.
  const cycleLen = S(4.5);
  const cycleT = (frame % cycleLen) / cycleLen;
  // courbe asymétrique : descente lente 0->0.6, hold bref 0.6->0.7, remontée 0.7->1
  let approach: number;
  if (cycleT < 0.6) approach = interpolate(cycleT, [0, 0.6], [0, 1], { ...clampB, easing: (t) => t * t });
  else if (cycleT < 0.7) approach = 1;
  else approach = interpolate(cycleT, [0.7, 1], [1, 0], { ...clampB, easing: (t) => 1 - (1 - t) * (1 - t) });
  const hesitateY = approach * 22; // descend de 22px max, jamais jusqu'au papier
  const microFloat = Math.sin(frame / 45) * 4;
  return (
    <g opacity={reveal} transform={`translate(0 ${microFloat + hesitateY + PLUME_Y_OFFSET})`}>
      <polygon points="1230,810 1620,380 1650,390 1260,820" fill="#151e32" opacity={0.5} />
      <polygon points="1225,665 1580,220 1610,230 1250,685" fill="#1f2e4d" stroke="#1f2e4d" strokeWidth={1} />
      <polygon points="1250,685 1610,230 1630,260 1270,705" fill="#2a3f66" stroke="#2a3f66" strokeWidth={1} />
      <path d="M 1235,675 L 1590,230 M 1245,685 L 1600,240 M 1260,695 L 1620,250" stroke="#3a5488" strokeWidth={1.5} fill="none" />
      <polygon points="1225,665 1270,705 1285,685 1240,645" fill="#4c6a99" />
      <polygon points="1232,655 1277,695 1282,688 1237,648" fill="#7393c8" />
      <polygon points="1240,645 1285,685 1260,730 1215,690" fill="#4c6a99" />
      <path d="M 1215,690 Q 1195,730 1190,750 Q 1235,745 1260,730 Z" fill="#7393c8" />
      <path d="M 1215,690 Q 1195,730 1190,750 L 1237,710 Z" fill="#4c6a99" />
      <path d="M 1190,750 L 1228,702" stroke={BG} strokeWidth={2} />
      <circle cx={1230} cy={700} r={4} fill={BG} />
    </g>
  );
};

// ===== Goutte d'encre dorée — hésite au-dessus de la cible, ne tombe jamais =====
const GoutteEnAttente: React.FC<{ reveal: number; frame: number }> = ({ reveal, frame }) => {
  if (reveal <= 0) return null;
  const hesitate = Math.sin(frame / 30) * 3;
  return (
    <g opacity={reveal}>
      <ellipse cx={1190} cy={840} rx={25} ry={10} stroke={GOLD} strokeWidth={2} fill="none" />
      <ellipse cx={1190} cy={840} rx={40} ry={16} stroke={GOLD} strokeWidth={1} strokeDasharray="4 6" fill="none" />
      <ellipse cx={1190} cy={840} rx={60} ry={24} stroke="#8a7336" strokeWidth={0.5} strokeDasharray="2 10" fill="none" />
      <path d="M 1190,775 L 1190,840" stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 6" fill="none" />
      <g transform={`translate(0 ${hesitate})`}>
        <path d="M 1190,755 C 1182,768 1182,775 1190,775 C 1198,775 1198,768 1190,755 Z" fill={GOLD} />
        <path d="M 1187,768 A 2.5 2.5 0 0 0 1190,772" stroke="#FFFFFF" strokeWidth={1} fill="none" />
      </g>
    </g>
  );
};

const LignesConceptuelles: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0) return null;
  const len = 620;
  return (
    <g id="connecting_blueprint_lines" stroke="#4c6a99" strokeWidth={1} fill="none">
      <path d="M 750,450 L 750,840 L 1150,840" strokeDasharray={len} strokeDashoffset={drawOffset(len, progress)} />
      <circle cx={750} cy={450} r={4} fill={BG} stroke="#4c6a99" strokeWidth={2} opacity={progress} />
      <circle cx={750} cy={840} r={3} opacity={progress} />
    </g>
  );
};

export const GazoducActe2Financement: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFade = interpolate(frame, [0, S(0.8), S(49.5), 1538], [0, 1, 1, 0], clampB);

  // ===== Chorégraphie étalée sur toute la scène (~51s). Retour Aziz 2026-08-04 (2e passe) : le tuyau
  // principal finissait de se tracer en ~8s, trop vite — ralenti pour finir vers ~20s, "ça meuble
  // l'animation et ça fait du sens", le reste de la choré décalé en proportion. =====
  const bgReveal = interpolate(frame, [0, S(1)], [0, 1], clampB);
  const cadreProgress = interpolate(frame, [S(0.5), S(4)], [0, 1], clampB);

  // 1) Le tuyau physique se dessine (contour) LENTEMENT, finit vers 20s (retour Aziz).
  const tuyauContourProgress = interpolate(frame, [S(3), S(20)], [0, 1], clampB);
  const tuyauFillReveal = interpolate(frame, [S(5), S(18)], [0, 1], clampB);
  const plateformeProgress = interpolate(frame, [S(2), S(9)], [0, 1], clampB);
  const gouffreLineProgress = interpolate(frame, [S(9), S(17)], [0, 1], clampB);
  const gouffreFillReveal = interpolate(frame, [S(11), S(19)], [0, 1], clampB);
  const brideProgress = interpolate(frame, [S(15), S(21)], [0, 1], clampB);

  // 2) Le document (chéquier) arrive SYNCHRONISÉ sur "Personne n'a encore sorti le chéquier" —
  // forced-align réel : ce mot tombe à 12.2s dans ce segment (184.86s narration absolue - 172.66s
  // début segment). Retour Aziz 2026-08-04 (3e passe) : le document apparaissait à 18s, 6s trop tard
  // par rapport à la phrase qui le concerne. Tuyau/tracé gardent EXACTEMENT la même vitesse (non
  // touchés) — seul le document (et ce qui en découle logiquement : plume, goutte) avance dans le temps.
  const documentContourProgress = interpolate(frame, [S(12.2), S(14.5)], [0, 1], clampB);
  const documentLinesProgress = interpolate(frame, [S(14.5), S(19)], [0, 1], clampB);
  const lignesConceptuellesProgress = interpolate(frame, [S(18), S(20.5)], [0, 1], clampB);

  // 3) Trait doré + fantôme se dessinent EN PARALLÈLE et se prolongent lentement, 20s → 46s (vitesse
  // INCHANGÉE, cf retour Aziz : "pour le tracé du tuyau et tout le reste on garde la même vitesse").
  const fantomeProgress = interpolate(frame, [S(20), S(46)], [0, 1], clampB);
  const traceProgress = interpolate(frame, [S(20), S(46)], [0, 1], clampB);
  const destinationProgress = interpolate(frame, [S(46), S(49.5)], [0, 1], clampB);

  // 4) Plume + goutte : présentes après le document (avancées d'autant), en HÉSITATION CONTINUE.
  const plumeReveal = interpolate(frame, [S(15.5), S(18)], [0, 1], clampB);
  const goutteReveal = interpolate(frame, [S(17.5), S(20)], [0, 1], clampB);

  return (
    <AbsoluteFill style={{ opacity: globalFade }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <DecorGPT bgReveal={bgReveal} cadreProgress={cadreProgress} />
        <Plateforme progress={plateformeProgress} />
        <TuyauPhysique contourProgress={tuyauContourProgress} fillReveal={tuyauFillReveal} />
        <Gouffre lineProgress={gouffreLineProgress} fillReveal={gouffreFillReveal} />
        <BrideRupture progress={brideProgress} frame={frame} />
        <TuyauVirtuel fantomeProgress={fantomeProgress} traceProgress={traceProgress} />
        <DestinationFantome progress={destinationProgress} />
        <DocumentGemini contourProgress={documentContourProgress} linesProgress={documentLinesProgress} />
        <LignesConceptuelles progress={lignesConceptuellesProgress} />
        <PlumeHesitante reveal={plumeReveal} frame={frame} />
        <GoutteEnAttente reveal={goutteReveal} frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};

export default GazoducActe2Financement;
