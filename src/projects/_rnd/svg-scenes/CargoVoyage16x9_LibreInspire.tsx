/**
 * PROTO 16:9 — "LIBRE INSPIRE ENCADRE" : reprise de CargoVoyage16x9 apres mix-and-match Gemini 3.1 Pro / GPT-5.5.
 *
 * CONTEXTE DU TEST (2026-07-03) : le prototype original a ete envoye aux deux modeles avec la consigne
 * "garde la composition, exploite ta capacite SVG a fond". Gemini a tres bien reussi (ocean profondeur+reflet
 * de soleil, halo radial du soleil, arbres avec relief, cargo unifie gris fonce/rouge ligne de flottaison)
 * MAIS a rate les personnages (silhouettes noires ecrasees, illisibles). GPT a quasi rien ameliore.
 *
 * CE FICHIER = piller Gemini sur ocean/soleil/cargo/arbres, INVENTER une solution pour les cueilleurs
 * (le defaut que les DEUX modeles n'ont pas su corriger), et pousser plus loin en code Remotion la ou
 * une idee de Gemini (reflet de soleil sur l'eau) peut etre amplifiee par de l'animation frame-driven
 * qu'un SVG statique ne peut pas offrir.
 *
 * GARDE DE L'ORIGINAL (mecanique) : patron B5PontH (camAt(p) par profondeur), horizon PARAMETRIQUE
 * (dunes/cacaoyers -> pics enneiges), 3 calques de parallaxe, structure narrative (voyage 0->1, nuit qui tombe).
 *
 * PILLE A GEMINI (recree en code, pas copie brut — anime frame-driven au lieu de fige) :
 *  - Ocean : degrade de profondeur (bandes plus sombres au loin, plus claires pres du bateau) + RELIEF DE
 *    LUMIERE — reflet du soleil sur l'eau (colonne scintillante qui suit sunX, plus flatteur que Gemini qui
 *    l'avait fige : ici elle scintille via un dephasage sinusoidal par segment, et s'oriente vers la position
 *    REELLE du soleil a chaque frame, un statique ne peut pas faire ca).
 *  - Soleil : vrai halo radial en 3 couches (cœur dur -> bloom moyen -> halo large) au lieu du disque plat
 *    d'origine.
 *  - Cargo : palette UNIFIEE coque gris-anthracite + ligne de flottaison rouge (le defaut vert-avant/gris-
 *    arriere de l'original est corrige — voir CargoShipUnified.tsx).
 *  - Arbres : CacaoTree recoit un highlight lateral leger (pas dans le composant partage, applique ici via
 *    un calque de lumiere directionnelle par-dessus, coherent avec le soleil qui traverse l'ecran).
 *
 * INVENTE (le vrai probleme a resoudre, ni Gemini ni GPT n'y arrivent) :
 *  - Cueilleurs : ABANDON du StickRig minuscule (0.27-0.3 -> mush a cette echelle, traits fins qui
 *    s'ecrasent). Remplace par 2 cueilleurs a echelle QUADRUPLEE (0.62), positionnes sur une bande de terre
 *    dediee EN AVANT du rideau d'arbres (jamais devant/derriere un tronc -> silhouette jamais confondue
 *    avec le feuillage), avec panier colore (carry="hand-basket", cabosses visibles) : la couleur du panier
 *    devient le point d'accroche qui fait "lire" instantanement la scene comme recolte, pas juste 2 batons
 *    noirs. tunicColor chaud (terre cuite / vert olive) au lieu du remplissage vide par defaut : silhouette
 *    lisible en clair-obscur, jamais un aplat noir ecrase.
 *
 * 3 calques (profondeur) : FOND (ciel+horizon+soleil+cueilleurs) parallaxe faible / MEDIANE (cargo) pleine /
 *   1er PLAN (ocean) la plus forte.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { CacaoTree } from "../../souverain/cacao-chocolat-short/components/VergerCacao";
import { CargoShipUnified } from "./CargoShipUnified";
import { CloudQwenGravure } from "./CloudQwenGravure";
import { camAt, lerpHex, buildHorizonPath, objectVisualBottom } from "../../_shared/svg-library/motion";
import { SoleilHaloRadial } from "../../_shared/svg-library/elements/ciel/SoleilHaloRadial";
import { OceanProfondeurVagues } from "../../_shared/svg-library/elements/ocean/OceanProfondeurVagues";

export const CARGO_VOYAGE_LI_FPS = 30;
export const CARGO_VOYAGE_LI_FRAMES = 750; // 25s (allonge de 5s pour laisser respirer la scene de nuit/lune, demande Aziz 2026-07-03)

const PARCH = "#e8dcc0";
const INK = "#2b2117";
const SERIF = "Georgia, 'Times New Roman', serif";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// palette AFRIQUE (chaud, ocre/vert) -> SUISSE (froid, bleu/blanc)
const SKY_A = "#e8dcc0";
const SKY_B = "#dce8ef";
const SUN_A = "#f2c14e";
const SUN_B = "#cfe3ee";
const SEA_A = "#8a9a6b"; // ocean cote ouest-africaine, vert olive
const SEA_B = "#5f84a3"; // ocean nordique, bleu froid
const SEA_A_DEEP = "#6d7e52"; // profondeur (bande lointaine, plus sombre) cote Afrique
const SEA_B_DEEP = "#44607c"; // profondeur cote Suisse

// horizon parametrique : points de controle qui interpolent dunes/cacaoyers -> pics enneiges
const HORIZON_X = [0, 240, 480, 720, 960, 1200, 1440, 1680, 1920];
const HORIZON_Y_AFRICA = [700, 685, 705, 660, 690, 670, 700, 680, 695];
const HORIZON_Y_SWISS = [700, 560, 480, 610, 430, 590, 470, 620, 700];

export const CargoVoyage16x9_LibreInspire: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  const voyage = interpolate(frame, [40, 560], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  const skyColorDay = lerpHex(SKY_A, SKY_B, voyage);
  const sunColor = lerpHex(SUN_A, SUN_B, voyage);
  const seaColor = lerpHex(SEA_A, SEA_B, voyage);
  const seaColorDeep = lerpHex(SEA_A_DEEP, SEA_B_DEEP, voyage);

  const sunX = interpolate(frame, [30, 560], [220, 1760], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const sunArc = Math.sin(interpolate(frame, [30, 560], [0, Math.PI], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sunY = 260 - sunArc * 90;
  // nuit ETALEE sur une plage plus large (500->680, vs 500->590 avant l'allongement a 750f) : laisse
  // la scene de nuit/lune respirer au lieu d'etre coupee juste apres son apparition (demande Aziz 2026-07-03).
  const nightFade = interpolate(frame, [500, 680], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const skyColor = lerpHex(skyColorDay, "#1c2536", nightFade);
  const sunOpacity = 1 - nightFade;
  // LUNE : BUG CORRIGE 2026-07-03 (Aziz) — la lune apparaissait EN MEME TEMPS que le soleil disparaissait
  // (moonOpacity = nightFade, sunOpacity = 1-nightFade -> les deux visibles simultanement pendant toute la
  // transition, lu comme "deux lunes/soleils empiles"). Sequencage STRICT maintenant : le soleil doit etre
  // COMPLETEMENT invisible (nightFade proche de 1) AVANT que la lune commence seulement a apparaitre.
  const moonOpacity = interpolate(nightFade, [0.85, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const moonX = 1500; // fixe (pas de trajectoire de soleil a "prendre le relais" -> plus de risque de chevauchement visuel)
  const moonY = 100; // au-dessus de la bande des nuages (y~140-220) pour eviter qu'un nuage passe systematiquement devant

  // le groupe parent (camBack) defile horizontalement : le path deborde du cadre (overflow 300px,
  // voir buildHorizonPath) pour que le bord ne soit jamais visible meme au drift max.
  const horizonPath = buildHorizonPath({ x: HORIZON_X, yA: HORIZON_Y_AFRICA, yB: HORIZON_Y_SWISS }, voyage, 1920, 1080);

  const cargoEnter = interpolate(frame, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const pitch = Math.sin(wf / 22) * 1.4;
  const bob = Math.sin(wf / 30) * 6;
  const cargoX = 960 + Math.sin(wf / 200) * 30;
  const cargoY = 820 + bob;
  // BUG CORRIGE 2026-07-03 : le split fond/1er-plan des vagues comparait a cargoY (position de reference
  // du cargo), pas au VRAI bas de la coque (qui est ~23px plus bas dans le repere local du SVG cargo,
  // cf CargoShipUnified scale/CY). Les vagues entre cargoY et cargoY+23 se dessinaient "1er plan" (donc
  // par-dessus le cargo deja rendu) alors qu'elles tombent visuellement DANS la coque -> effet "vagues qui
  // traversent le bateau", plus visible la nuit (contraste plus fort entre les vagues sombres et le fond).
  const cargoHullBottom = objectVisualBottom(cargoY, 23);

  // ecart de vitesse ACCENTUE (demande Aziz 2026-07-03, retour "manque de perspective/planeite") : fond
  // quasi fixe (0.15->0.05, les montagnes lointaines bougent a peine) vs ocean nettement plus rapide
  // (0.9->1.3, l'eau proche defile vite) -- renforce l'impression de profondeur SANS introduire de vraie
  // distorsion 3D qui casserait le style plat/vectoriel de la charte.
  const camBack = camAt(wf, 1, 0.05);
  const camSea = camAt(wf, 1, 1.3);

  // ===== OCEAN — traitement REPRIS FIDELEMENT de la cible SVG Gemini (cargo-upgrade-gemini.png,
  // groupe ocean_base) : vagues en courbes douces (pas des lignes droites ondulees), qui s'epaississent
  // et s'assombrissent en s'approchant du 1er plan (loin=fines/claires, pres=epaisses/sombres). Chaque
  // vague alterne un trait blanc (reflet lumiere) et un trait sombre (creux), comme dans l'original Gemini.
  const seaWaves = [
    { y: 750, width: 1, opacity: 0.2, color: "#ffffff" },
    { y: 765, width: 1.5, opacity: 0.25, color: "#ffffff" },
    { y: 780, width: 1.5, opacity: 0.3, color: "#ffffff" },
    { y: 800, width: 2, opacity: 0.5, color: INK },
    { y: 830, width: 2, opacity: 0.2, color: "#ffffff" },
    { y: 860, width: 3, opacity: 0.4, color: INK },
    { y: 900, width: 2, opacity: 0.15, color: "#ffffff" },
    { y: 940, width: 4, opacity: 0.4, color: INK },
    { y: 990, width: 3, opacity: 0.1, color: "#ffffff" },
    { y: 1040, width: 5, opacity: 0.4, color: INK },
  ];

  const sigOp = interpolate(frame, [500, 560], [0, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor }}>
      {/* ambiance ocean/cargo — boucle sur toute la duree, volume plancher 0.50 (doctrine SFX-INDEX.md).
          Sequence OBLIGATOIRE (pas de <Audio> conditionnel) sinon le son ne demarre pas en render. */}
      <Sequence from={0} durationInFrames={CARGO_VOYAGE_LI_FRAMES}>
        <Audio src={staticFile("_shared/sfx/ambiance/ocean-cargo-ambient.mp3")} volume={0.5} loop />
      </Sequence>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill={skyColor} />

        {/* ===== COUCHE FOND : soleil + horizon (parallaxe faible) ===== */}
        <g transform={camBack}>
          <SoleilHaloRadial cx={sunX} cy={sunY} color={sunColor} opacity={sunOpacity} idPrefix="cargoSun" ink={INK} />
          <defs>
            <radialGradient id="cargoMoonHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d8e2ef" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#d8e2ef" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* LUNE — remplace le soleil qui disparait en fin de voyage (demande Aziz 2026-07-03).
              LUNE PLEINE (disque simple), PAS un croissant : le croissant (2 cercles superposes qui se
              creusent en fill-rule evenodd) restait visuellement ambigu meme corrige -- les 2 CONTOURS
              de cercle complets restent visibles et se lisent comme "deux lunes qui se croisent" (bug
              signale 2x par Aziz malgre 2 iterations de formule). Un disque plein elimine tout risque
              d'ambiguite : plus simple, plus sur, toujours lisible. */}
          {moonOpacity > 0.03 && (
            <>
              <circle cx={moonX} cy={moonY} r={160} fill="url(#cargoMoonHalo)" opacity={moonOpacity} />
              <circle cx={moonX} cy={moonY} r={52} fill="#eef1f5" stroke={INK} strokeWidth={2} opacity={moonOpacity} />
            </>
          )}

          {nightFade > 0.05 &&
            [
              { x: 180, y: 120 }, { x: 460, y: 90 }, { x: 720, y: 160 }, { x: 980, y: 100 },
              { x: 1240, y: 140 }, { x: 1520, y: 80 }, { x: 1740, y: 180 }, { x: 340, y: 260 },
              { x: 1080, y: 220 }, { x: 1620, y: 260 },
            ].map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={2.6} fill="#fbfbfb" opacity={nightFade * (0.5 + 0.5 * Math.sin(wf / 20 + i))} />
            ))}

          {/* vrais nuages — Qwen3.6 (CloudQwenGravure, avec vision), registre gravure/hachures adulte
              (2026-07-03) : remplace CloudGLM (GLM-5.2, text-only, avait produit des facettes abstraites
              illisibles comme nuage). Qwen a garde la silhouette nuageuse reconnaissable + hachures fines. */}
          {[
            { baseX: 700, y: 180, w: 1.1, speed: 0.1, phase: 0 },
            { baseX: 1200, y: 140, w: 0.9, speed: 0.08, phase: 3 },
            { baseX: 1600, y: 220, w: 1.0, speed: 0.13, phase: 5 },
          ].map((c, k) => {
            const range = 1700;
            const x = 100 + (((c.baseX - 100 - wf * c.speed) % range) + range) % range;
            const bob2 = Math.sin(wf / 34 + c.phase) * 5;
            const edgeFade = Math.min(1, Math.min(x - 100, 1820 - x) / 150);
            const op = 0.7 * Math.max(0, edgeFade);
            return (
              <g key={k} transform={`translate(${x} ${c.y + bob2}) scale(${c.w * 0.55})`} opacity={op}>
                <CloudQwenGravure ink={INK} />
              </g>
            );
          })}

          {/* horizon parametrique : dunes/cacaoyers -> pics enneiges */}
          <path d={horizonPath} fill={INK} opacity={0.14} />
          <path d={horizonPath} fill="none" stroke={INK} strokeWidth={2.6} opacity={0.55} />
          {voyage > 0.55 &&
            HORIZON_X.map((x, i) => {
              const yA = HORIZON_Y_AFRICA[i];
              const yB = HORIZON_Y_SWISS[i];
              const y = yA + (yB - yA) * voyage;
              if (yB > 550) return null;
              const snowOp = interpolate(voyage, [0.55, 0.85], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <circle key={i} cx={x} cy={y + 14} r={14} fill="#fbfbfb" opacity={snowOp} />;
            })}

          {/* cacaoyers — pas de highlight (retire 2026-07-03, pas necessaire selon Aziz) */}
          {voyage < 0.65 &&
            [
              { x: 300, y: 706, s: 0.34, tone: 0 },
              { x: 470, y: 698, s: 0.3, tone: 1 },
              { x: 1040, y: 700, s: 0.32, tone: 0 },
              { x: 1300, y: 694, s: 0.28, tone: 2 },
            ].map((t, i) => {
              const treeOp = interpolate(voyage, [0, 0.4, 0.55], [0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (treeOp <= 0.01) return null;
              const treeSway = Math.sin(wf / 32 + i * 1.7) * 1.2;
              return (
                <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`} opacity={treeOp}>
                  <g transform={`rotate(${treeSway} 0 0)`}>
                    <CacaoTree alive={1} grow={1} tone={t.tone} />
                  </g>
                </g>
              );
            })}
        </g>

        {/* ===== OCEAN — fond (derriere le bateau, ancre la ligne d'eau) — REPRIS FIDELEMENT de la cible
            SVG Gemini (cargo-upgrade-gemini.png, groupe ocean_base) : fond degrade + vagues en courbes
            douces (Q...T, pas des lignes ondulees) qui s'epaississent/s'assombrissent vers le 1er plan. ===== */}
        <g transform={camSea}>
          <OceanProfondeurVagues
            frame={wf}
            part="fond"
            splitY={cargoHullBottom}
            seaColor={seaColor}
            seaColorDeep={seaColorDeep}
            reflectColor={sunOpacity > 0.05 ? sunColor : undefined}
            reflectX={sunX - camSeaOffset(wf)}
            reflectOpacity={sunOpacity}
            waves={seaWaves}
            idPrefix="cargoOcean"
          />
        </g>

        {/* ===== COUCHE MEDIANE : cargo (parallaxe pleine, quasi fixe horizontalement) — POSE SUR l'ocean =====
            PILLE A GEMINI : silhouette UNIFIEE gris-anthracite + ligne de flottaison rouge (corrige le defaut
            de couleur avant/arriere de l'original). Voir CargoShipUnified.tsx. */}
        <g opacity={cargoEnter}>
          <g transform={`translate(${cargoX} ${cargoY}) rotate(${pitch})`}>
            <CargoShipUnified ink={INK} />
            {/* pas de cheminee/fumee (retiree 2026-07-03, demande Aziz : n'a pas de sens sur ce cargo epure) */}
            <ellipse cx={0} cy={38} rx={200} ry={12} fill={INK} opacity={0.18} />
          </g>
          <g transform={`translate(${cargoX} ${cargoY + bob})`} opacity={0.4}>
            <path d="M -210 30 Q -260 20 -320 34" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
            <path d="M -210 38 Q -280 44 -360 30" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" opacity={0.6} />
          </g>
        </g>

        {/* ===== OCEAN — 1er plan (vagues proches qui passent DEVANT le bas de la coque, ancrage final) ===== */}
        <g transform={camSea}>
          <OceanProfondeurVagues
            frame={wf}
            part="premier-plan"
            splitY={cargoHullBottom}
            seaColor={seaColor}
            seaColorDeep={seaColorDeep}
            waves={seaWaves}
            idPrefix="cargoOcean"
          />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 60,
          opacity: sigOp,
          color: INK,
          fontFamily: SERIF,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        GéoAfrique
      </div>
    </AbsoluteFill>
  );
};

// offset de parallaxe de la couche ocean (meme vitesse que camAt(1, 0.9) dans le composant) : le reflet du
// soleil est dessine DANS le groupe camSea (qui defile), alors que sunX est calcule dans le repere ecran
// (groupe camBack, parallaxe plus lente) -- il faut compenser le defilement pour que le reflet suive le soleil.
function camSeaOffset(wf: number) {
  return -wf * 0.9;
}
