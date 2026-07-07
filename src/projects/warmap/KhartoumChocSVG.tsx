/**
 * KhartoumChocSVG — VARIANTE A du moteur d'affrontement 2 factions (warmapChoc), posee sur le
 * decor Khartoum du prototype valide (KhartoumEtatMajorSVG). Ici, contrairement au proto mono-
 * faction ou la RSF frappait des cibles inertes : la SAF DEFEND le palais presidentiel, la RSF
 * pousse depuis le sud-est, les deux formations se HEURTENT au front, la SAF recule, le palais
 * bascule sous controle RSF.
 *
 * Sequence (phases) :
 *  1. ETABLISSEMENT      — decor + les 2 camps poses (SAF tient le palais, RSF en staging SE)
 *  2. POUSSEE RSF        — la colonne RSF avance vers la ligne de front SAF
 *  3. CHOC AU FRONT      — les 2 formations s'imbriquent, etincelles, secousse, poussiere dense
 *  4. BASCULE            — la ligne SAF recule, la zone RSF se remplit, une contre-attaque SAF
 *                          repart puis est submergee
 *  5. RESOLUTION         — sceau R sur le palais pris, sceau S barre/estompe, fumee
 *
 * Doctrine : WARMAP-INSERT-SVG-ETATMAJOR.md. Registre identique au proto (sable/or/rouge, top-down).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, staticFile } from "remotion";
import {
  EM,
  RSF,
  SAF,
  clampI,
  EmDefs,
  EmFrame,
  EmSubtitle,
  FactionLegend,
  AdvancingFormation,
  HoldingFormation,
  formationHead,
  FrontArc,
  SweepZone,
  Sonar,
  Impact,
  ClashSparks,
  SmokeColumn,
  CaptureSeal,
  DefeatedSeal,
  CommanderMedallion,
  type Vec,
} from "./_shared/warmapChoc";

export const KHARTOUM_CHOC_FPS = 30;
export const KHARTOUM_CHOC_FRAMES = 690; // 23s @ 30fps

// ── Positions (viewBox 1920x1080) ──
const PALAIS: Vec = { x: 1020, y: 560 }; // position defendue par la SAF (du fond recompose)
const RSF_ORIGIN: Vec = { x: 1750, y: 940 }; // staging RSF sud-est
// le FRONT = point de rencontre JUSTE DEVANT le palais (la SAF tient sa ligne au sud-est du palais).
// La colonne RSF doit VRAIMENT arriver au contact de la ligne SAF — sinon la capture se joue sans
// que l'attaquant soit la (bug v1 : FRONT a 700px du palais, capture sur compteur = teleportation).
const FRONT: Vec = { x: 1150, y: 640 };
// direction de poussee (RSF->palais) pour faire reculer la SAF vers/derriere le palais
const pushLen = Math.hypot(PALAIS.x - FRONT.x, PALAIS.y - FRONT.y);
const PUSH_DIR: Vec = { x: (PALAIS.x - FRONT.x) / pushLen, y: (PALAIS.y - FRONT.y) / pushLen };

// ── Timeline (frames @30fps) ── recalee pour que la CAUSALITE soit visible :
// etablissement -> la colonne RSF arrive REELLEMENT au front -> choc -> bascule -> capture.
const T_ESTAB = 55;
const T_PUSH = T_ESTAB; // debut poussee RSF
const PUSH_TRAVEL = 175; // duree trajet RSF -> front (arrivee reelle a T_PUSH+PUSH_TRAVEL)
const T_CONTACT = T_PUSH + PUSH_TRAVEL; // instant ou la tete de colonne touche le front
const T_CLASH = T_CONTACT - 15; // le choc commence juste avant le contact plein
const CLASH_LEN = 130; // duree du choc (les 2 forces s'imbriquent)
const T_BASCULE = T_CONTACT + 55; // la SAF cede APRES un vrai temps de choc au contact
const BASCULE_LEN = 120;
const T_CAPTURE = T_BASCULE + BASCULE_LEN - 10; // palais pris a la fin de la bascule
const T_RESOLUTION = T_CAPTURE + 20;

// contre-attaque SAF : brief sursaut pendant la bascule
const T_COUNTER = T_BASCULE + 20;
const COUNTER_LEN = 50;

const subtitleFor = (f: number): string => {
  if (f < T_ESTAB) return "Khartoum, 15 avril 2023. L'armee tient le palais presidentiel.";
  if (f < T_CLASH) return "La RSF lance sa colonne sur le centre du pouvoir.";
  if (f < T_BASCULE) return "Au contact, les deux forces s'affrontent pour le palais.";
  if (f < T_CAPTURE) return "La ligne de l'armee cede. La RSF gagne du terrain.";
  return "Le palais presidentiel bascule. La capitale entre en guerre.";
};
// (Les seuils de sous-titres suivent maintenant les vraies frames d'action : T_CLASH/T_BASCULE/
// T_CAPTURE sont cales sur l'arrivee reelle de la colonne, plus sur un compteur en avance.)

export const KhartoumChocSVG: React.FC = () => {
  const frame = useCurrentFrame();

  const pFond = clampI(frame, 0, 25);
  const cartouche = clampI(frame, 0, 16);
  const legendOp = clampI(frame, 10, 30);

  // opacite du palais : plein tant que tenu, se vide apres capture
  const palaisOp =
    frame < T_CAPTURE
      ? clampI(frame, T_ESTAB - 15, T_ESTAB + 10)
      : clampI(frame, T_CAPTURE, T_CAPTURE + 24, 1, 0.32) * clampI(frame, T_ESTAB - 15, T_ESTAB + 10);

  // recul de la SAF : commence a la bascule, pousse au-DELA du palais (nettement submergee/repoussee,
  // pas un recul timide — decision Aziz : accentuer la bascule). 160px = la SAF passe derriere le palais.
  const safRetreat = frame >= T_BASCULE ? clampI(frame, T_BASCULE, T_BASCULE + BASCULE_LEN) * 160 : 0;

  // point de choc reel = tete de la colonne RSF (sa vraie position, pas le FRONT fige) : le choc
  // suit la colonne jusqu'a ce qu'elle atteigne le front, puis reste au contact.
  const pushLocal = frame - T_PUSH;
  const clashPoint =
    pushLocal < 0 ? RSF_ORIGIN : formationHead(RSF_ORIGIN, FRONT, Math.min(pushLocal, PUSH_TRAVEL), PUSH_TRAVEL, 0.1);

  // camera shake : au choc (continu, faible) + a la capture (bref, fort)
  let shakeX = 0;
  let shakeY = 0;
  if (frame >= T_CLASH && frame < T_BASCULE) {
    const s = 1.6;
    shakeX = Math.sin(frame * 5.1) * s;
    shakeY = Math.cos(frame * 6.3) * s * 0.7;
  }
  const capLocal = frame - T_CAPTURE;
  if (capLocal >= 0 && capLocal < 8) {
    shakeX += Math.sin(capLocal * 7) * 4;
    shakeY += Math.cos(capLocal * 9) * 3;
  }

  // zone RSF conquise (triangle grossier front->palais->staging) qui se remplit a la bascule
  const zonePath = `M ${FRONT.x} ${FRONT.y} L ${PALAIS.x + 60} ${PALAIS.y - 40} L ${PALAIS.x + 40} ${PALAIS.y + 90} L ${FRONT.x - 30} ${FRONT.y + 80} Z`;
  const zoneBbox = { x: FRONT.x - 40, y: PALAIS.y - 60, w: PALAIS.x - FRONT.x + 120, h: 200 };

  return (
    <AbsoluteFill style={{ background: "#0b1526", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <EmDefs />

        {/* ============ FOND (terrain + Nil, repris du proto recompose, simplifie) ============ */}
        <g opacity={pFond}>
          <rect width={1920} height={1080} fill={EM.sand} />
          <rect width={1920} height={1080} fill="url(#emGrid)" />

          <g id="registration-marks" stroke="#8a3324" strokeWidth={1.5} opacity={0.35}>
            <circle cx={480} cy={270} r={8} fill="none" />
            <circle cx={1460} cy={270} r={8} fill="none" />
            <circle cx={480} cy={810} r={8} fill="none" />
            <circle cx={1460} cy={810} r={8} fill="none" />
          </g>

          <g id="terrain">
            <path d="M 320 560 C 450 380, 680 440, 780 560 C 880 680, 650 780, 450 680 C 280 580, 220 680, 320 560 Z" fill="#ceb280" stroke="#8a3324" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.55} />
            <path d="M 1220 300 C 1350 200, 1560 250, 1660 360 C 1740 460, 1560 520, 1400 470 C 1260 430, 1120 420, 1220 300 Z" fill="#ceb280" stroke="#8a3324" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.5} />
            <path d="M 150 220 Q 400 120 750 240 T 1250 140 T 1750 320" fill="none" stroke="#c7a977" strokeWidth={2.5} opacity={0.7} />
            <path d="M 80 880 Q 350 980 650 860 T 1050 980" fill="none" stroke="#c7a977" strokeWidth={2} opacity={0.7} />
          </g>

          {/* Nil (repris du proto — Nil Bleu/Blanc, Omdurman de l'autre cote) */}
          <g id="river">
            <path d="M 1040 -10 C 1020 180, 1080 320, 990 500 C 1090 680, 1060 880, 1140 1090 L 1060 1090 C 990 850, 1020 650, 930 510 C 680 540, 380 500, -10 580 L -10 500 C 380 430, 680 470, 920 440 C 990 280, 940 150, 960 -10 Z" fill="#e0cba8" stroke="#4a1f18" strokeWidth={3} />
            <path d="M 1000 -10 C 980 180, 1040 320, 960 470 C 1040 680, 1030 880, 1100 1090" fill="none" stroke="#c7a977" strokeWidth={2} strokeDasharray="12 12" />
            <path d="M 960 470 C 680 500, 380 460, -10 540" fill="none" stroke="#c7a977" strokeWidth={2} strokeDasharray="12 12" />
          </g>

          {/* Palais presidentiel — position defendue (marqueur + pictogramme simplifie) */}
          <g id="target-palace">
            <circle cx={PALAIS.x} cy={PALAIS.y} r={65} fill={EM.sand} opacity={0.3} />
            <circle cx={PALAIS.x} cy={PALAIS.y} r={55} fill="none" stroke="#4a1f18" strokeWidth={1} opacity={0.5} />
            <line x1={PALAIS.x - 90} y1={PALAIS.y} x2={PALAIS.x + 90} y2={PALAIS.y} stroke="#4a1f18" strokeWidth={1} opacity={0.6} />
            <line x1={PALAIS.x} y1={PALAIS.y - 90} x2={PALAIS.x} y2={PALAIS.y + 90} stroke="#4a1f18" strokeWidth={1} opacity={0.6} />
            <g opacity={palaisOp} transform={`translate(${PALAIS.x}, ${PALAIS.y}) scale(1.25) translate(0,-8)`}>
              <g stroke="#2b2117" strokeWidth={0.6} strokeLinejoin="round">
                <rect x={-37} y={-36} width={74} height={72} fill="#c7a76f" fillOpacity={0.35} strokeWidth={1} opacity={0.7} />
                <g fill="#8f8266">
                  <rect x={-24} y={-4} width={10} height={16} />
                  <rect x={14} y={-4} width={10} height={16} />
                  <rect x={-14} y={-4} width={28} height={10} />
                </g>
                <circle cx={0} cy={-6} r={6.5} fill="#9a8d73" />
                <circle cx={0} cy={-6} r={3.6} fill="#8f8266" />
                <path d="M -24 6 L -24 22 L 24 22 L 24 6 Z" fill="#c7a76f" strokeWidth={0.4} />
                <line x1={-24} y1={30} x2={24} y2={30} strokeWidth={1} />
              </g>
            </g>
            <rect x={PALAIS.x - 130} y={PALAIS.y + 92} width={260} height={34} fill="#4a1f18" stroke="#c7a977" strokeWidth={1} filter="url(#emShadow)" />
            <text x={PALAIS.x} y={PALAIS.y + 115} textAnchor="middle" fill="#f5e6ce" fontFamily="system-ui, sans-serif" fontSize={14} fontWeight={700} letterSpacing={2.5}>PALAIS PRESIDENTIEL</text>
          </g>

          {/* Staging RSF (sud-est) */}
          <g id="staging-rsf" opacity={clampI(frame, 5, 25)}>
            <circle cx={RSF_ORIGIN.x} cy={RSF_ORIGIN.y} r={14} fill="#8a3324" filter="url(#emGlow)" />
            <circle cx={RSF_ORIGIN.x} cy={RSF_ORIGIN.y} r={22} fill="none" stroke="#4a1f18" strokeWidth={2} />
            <circle cx={RSF_ORIGIN.x} cy={RSF_ORIGIN.y} r={30} fill="none" stroke="#4a1f18" strokeWidth={1.2} strokeDasharray="4 4" />
            <text x={RSF_ORIGIN.x} y={RSF_ORIGIN.y + 50} textAnchor="middle" fill="#4a1f18" fontFamily="system-ui, sans-serif" fontSize={16} fontWeight={800} letterSpacing={2}>RSF</text>
          </g>
        </g>

        {/* ============ COUCHE AFFRONTEMENT ============ */}

        {/* Sonar defensif SAF sur le palais (tant qu'il tient) */}
        {frame < T_CAPTURE && frame > T_ESTAB - 20 && (
          <Sonar cx={PALAIS.x} cy={PALAIS.y} frame={frame} period={50} rMax={62} color={SAF.front} />
        )}

        {/* Zone RSF qui se remplit a la bascule */}
        <SweepZone id="choc-a" pathD={zonePath} faction={RSF} frame={frame} startFrame={T_BASCULE} fillFrames={BASCULE_LEN} bbox={zoneBbox} />

        {/* Ligne de front SAF (arc devant le palais) qui recule a la bascule */}
        <FrontArc cx={PALAIS.x} cy={PALAIS.y} radius={175} frame={frame} shiftFrame={T_BASCULE} shiftBy={-2.6} color={SAF.front} />

        {/* Formation SAF qui DEFEND devant le palais, recule (nettement) a la bascule puis se fait
            submerger : elle s'estompe fortement a l'approche de la capture (perd la position). */}
        {frame < T_CAPTURE + 10 && (
          <g opacity={frame >= T_BASCULE ? clampI(frame, T_BASCULE + 50, T_CAPTURE, 1, 0.15) : 1}>
            <HoldingFormation
              center={{ x: PALAIS.x - 30, y: PALAIS.y + 30 }}
              faction={SAF}
              frame={frame}
              count={4}
              spread={46}
              retreat={safRetreat}
              pushDir={PUSH_DIR}
            />
          </g>
        )}

        {/* Commandant SAF au-dessus de la position (portrait rond — le "qui" defend) */}
        {frame < T_CAPTURE && (
          <CommanderMedallion
            x={PALAIS.x - 30}
            y={PALAIS.y - 34 + safRetreat * PUSH_DIR.y}
            opacity={clampI(frame, T_ESTAB - 10, T_ESTAB + 8) * clampI(frame, T_BASCULE + 40, T_CAPTURE, 1, 0.4)}
            sprite="_shared/sprites/warmap/portrait-saf.png"
            faction={SAF}
          />
        )}

        {/* Contre-attaque SAF : une formation repart en avant vers le front, brievement */}
        {frame >= T_COUNTER && frame < T_COUNTER + COUNTER_LEN + 20 && (
          <AdvancingFormation
            origin={{ x: PALAIS.x - 20, y: PALAIS.y + 20 }}
            front={{ x: FRONT.x + 60, y: FRONT.y + 20 }}
            faction={SAF}
            frame={frame}
            startFrame={T_COUNTER}
            travelFrames={COUNTER_LEN}
            bow={-0.08}
            size={1.7}
          />
        )}

        {/* Poussee RSF : la colonne avance vers le front (disparait a la bascule, relayee par
            l'exploitation qui recouvre le palais). */}
        {frame < T_BASCULE + 10 && (
          <AdvancingFormation
            origin={RSF_ORIGIN}
            front={FRONT}
            faction={RSF}
            frame={frame}
            startFrame={T_PUSH}
            travelFrames={PUSH_TRAVEL}
            bow={0.1}
            size={2.0}
          />
        )}

        {/* EXPLOITATION RSF (decision Aziz : la RSF recouvre le palais) : apres la bascule, la
            formation RSF avance du front jusqu'a RECOUVRIR la position du palais. C'est ce qui rend
            la prise de possession nette (l'attaquant occupe physiquement la cible, pas juste un sceau). */}
        {frame >= T_BASCULE && (
          <AdvancingFormation
            origin={{ x: FRONT.x - 10, y: FRONT.y - 10 }}
            front={{ x: PALAIS.x + 12, y: PALAIS.y + 34 }}
            faction={RSF}
            frame={frame}
            startFrame={T_BASCULE}
            travelFrames={T_CAPTURE - T_BASCULE + 10}
            bow={0.06}
            size={2.0}
          />
        )}

        {/* Commandant RSF au-dessus de la tete de colonne (portrait rond) — reste visible jusqu'au
            choc puis s'estompe pendant la bascule (la colonne se fond dans la melee au contact). */}
        {(() => {
          const local = frame - T_PUSH;
          if (local < 0 || frame > T_BASCULE + 40) return null;
          const head = formationHead(RSF_ORIGIN, FRONT, Math.min(local, PUSH_TRAVEL), PUSH_TRAVEL, 0.1);
          const op = clampI(local, 8, 22) * clampI(frame, T_BASCULE, T_BASCULE + 40, 1, 0);
          return (
            <CommanderMedallion
              x={head.x}
              y={head.y - 38}
              opacity={op}
              sprite="_shared/sprites/warmap/portrait-rsf.png"
              faction={RSF}
            />
          );
        })()}

        {/* CHOC : etincelles de contact sur la tete de colonne pendant le choc, puis au front */}
        <ClashSparks x={clashPoint.x} y={clashPoint.y} frame={frame} from={T_CLASH} to={T_BASCULE + 40} intensity={1.2} />

        {/* Impact final au moment de la capture du palais */}
        <Impact x={PALAIS.x} y={PALAIS.y} frame={frame} startFrame={T_CAPTURE} />

        {/* Fumee sur le palais pris */}
        <SmokeColumn x={PALAIS.x} y={PALAIS.y - 4} frame={frame} startFrame={T_CAPTURE + 12} />

        {/* Denouement : sceau R sur le palais pris + sceau S barre (SAF defaite) */}
        <CaptureSeal x={PALAIS.x} y={PALAIS.y} frame={frame} captureFrame={T_CAPTURE} faction={RSF} />
        <DefeatedSeal x={PALAIS.x - 100} y={PALAIS.y + 60} frame={frame} defeatFrame={T_CAPTURE + 6} faction={SAF} />

        {/* ============ CADRE / CARTOUCHE / LEGENDE / SOUS-TITRE ============ */}
        <EmFrame title="KHARTOUM — BATAILLE DU PALAIS" date="15 AVRIL 2023" opacity={pFond} cartoucheOp={cartouche} />
        <FactionLegend
          x={90}
          y={150}
          opacity={legendOp}
          factions={[
            { faction: RSF, label: "RSF — paramilitaires" },
            { faction: SAF, label: "SAF — armee reguliere" },
          ]}
        />
        <EmSubtitle text={subtitleFor(frame)} opacity={pFond} />
      </svg>
    </AbsoluteFill>
  );
};

export default KhartoumChocSVG;
