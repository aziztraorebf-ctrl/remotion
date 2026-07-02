/**
 * PROTO 16:9 — cargo qui traverse l'ecran, cote Afrique de l'Ouest -> montagnes Suisse.
 * BUT : MESURER la faisabilite d'un plan large parallaxe a 3 calques avec vehicule (cocao -> chocolat, le voyage).
 *
 * ⭐ PATRON REUTILISABLE (valide 2026-07-02). Doc complete + learnings + bugs deja corriges (a ne pas
 * reintroduire) : ../../_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md (section "Idees d'evolution").
 * Reutilisable tel quel pour toute scene "transport/voyage/transformation" (minerai->usine, or->raffinerie...) :
 * changer le vehicule + les 2 silhouettes d'horizon, garder la mecanique (camAt, lerpHex, horizon parametrique).
 *
 * Reutilise tel quel le patron B5PontH (camAt(p) par profondeur, lerpHex pour la palette qui glisse).
 * Nouveau : horizon PARAMETRIQUE (silhouette qui interpole dunes/cacaoyers -> montagnes enneigees),
 *   ocean stylise (lignes ondulees empilees, pas un remplissage plat), cargo silhouette encre au 1er plan,
 *   cueilleurs miniatures en fond de plan (voir recette "cueilleurs-fond-de-plan-16x9" dans PERSONNAGE-VIVANT-INDEX).
 *
 * 3 calques (profondeur) :
 *   - COUCHE FOND (ciel + horizon qui se transforme + cueilleurs miniatures) — parallaxe faible
 *   - COUCHE MEDIANE (cargo, quasi fixe horizontalement, tangage) — parallaxe pleine
 *   - COUCHE 1er PLAN (ocean, lignes qui defilent vite) — parallaxe la plus forte
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { CacaoTree } from "../../souverain/cacao-chocolat-short/components/VergerCacao";
import { StickRig } from "../../_shared/personnage-vivant-svg/rig/StickRig";

export const CARGO_VOYAGE_FPS = 30;
export const CARGO_VOYAGE_FRAMES = 600; // 20s

const PARCH = "#e8dcc0";
const INK = "#2b2117";
const SERIF = "Georgia, 'Times New Roman', serif";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

const lerpHex = (a: string, b: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// palette AFRIQUE (chaud, ocre/vert) -> SUISSE (froid, bleu/blanc)
const SKY_A = "#e8dcc0"; // parchemin chaud
const SKY_B = "#dce8ef"; // ciel froid pale
const SUN_A = "#f2c14e"; // soleil jaune chaud
const SUN_B = "#cfe3ee"; // lune/soleil froid pale
const SEA_A = "#8a9a6b"; // ocean cote ouest-africaine, vert olive
const SEA_B = "#5f84a3"; // ocean nordique, bleu froid

// horizon parametrique : points de controle qui interpolent dunes/cacaoyers -> pics enneiges
// forme = suite de segments (x fixe, y qui varie avec le voyage)
const HORIZON_X = [0, 240, 480, 720, 960, 1200, 1440, 1680, 1920];
const HORIZON_Y_AFRICA = [700, 685, 705, 660, 690, 670, 700, 680, 695]; // dunes basses + silhouettes cacaoyers
const HORIZON_Y_SWISS = [700, 560, 480, 610, 430, 590, 470, 620, 700]; // pics montagneux dentelés

export const CargoVoyage16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  // progression du voyage 0->1 sur toute la duree (lente, continue)
  const voyage = interpolate(frame, [40, 560], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  const skyColorDay = lerpHex(SKY_A, SKY_B, voyage);
  const sunColor = lerpHex(SUN_A, SUN_B, voyage);
  const seaColor = lerpHex(SEA_A, SEA_B, voyage);

  // SOLEIL : traverse tout l'ecran gauche -> droite sur la duree du voyage (marque le temps qui passe).
  // Descend vers l'horizon en fin de course puis fade -> nuit etoilee.
  const sunX = interpolate(frame, [30, 560], [220, 1760], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const sunArc = Math.sin(interpolate(frame, [30, 560], [0, Math.PI], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sunY = 260 - sunArc * 90; // monte au milieu du trajet, redescend vers l'horizon en fin
  const nightFade = interpolate(frame, [500, 590], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const skyColor = lerpHex(skyColorDay, "#1c2536", nightFade);
  const sunOpacity = 1 - nightFade;

  // horizon : interpolation point par point entre les deux silhouettes
  const horizonPath = (() => {
    const pts = HORIZON_X.map((x, i) => {
      const yA = HORIZON_Y_AFRICA[i];
      const yB = HORIZON_Y_SWISS[i];
      const y = yA + (yB - yA) * voyage;
      return { x, y };
    });
    const d = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    return `${d} L 1920 1080 L 0 1080 Z`;
  })();

  // cargo : tangage leger + entree en fondu au debut
  const cargoEnter = interpolate(frame, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const pitch = Math.sin(wf / 22) * 1.4;
  const bob = Math.sin(wf / 30) * 6;
  const cargoX = 860 + Math.sin(wf / 200) * 30; // quasi fixe horizontalement (le decor defile, pas le bateau)
  const cargoY = 738 + bob; // ligne de flottaison DANS l'ocean (calque 1er plan commence a y=720), pas sur l'horizon terre

  // CAMERA / PARALLAXE — meme mecanique que B5PontH, mais appliquee au defilement horizontal du decor.
  const camAt = (p: number, speed: number) => {
    const driftX = -wf * speed * p;
    return `translate(${driftX} 0)`;
  };
  const camBack = camAt(1, 0.15);   // ciel/horizon — bouge le moins (loin)
  const camSea = camAt(1, 0.9);     // ocean 1er plan — bouge vite (proche)

  // lignes d'ocean : plusieurs rangees, chacune defile a une vitesse legerement differente + ondule
  const seaLines = Array.from({ length: 11 }, (_, row) => {
    const y = 726 + row * 30; // premieres rangees AU-DESSUS de la ligne de flottaison du cargo (738) -> derriere lui
    const speed = 0.5 + row * 0.06;
    const offset = (wf * speed) % 160;
    return { y, offset, opacity: 0.35 - row * 0.016 };
  });

  const sigOp = interpolate(frame, [500, 560], [0, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill={skyColor} />

        {/* ===== COUCHE FOND : soleil + horizon (parallaxe faible) ===== */}
        <g transform={camBack}>
          <defs>
            <radialGradient id="cargoSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={sunColor} stopOpacity={0.45} />
              <stop offset="55%" stopColor={sunColor} stopOpacity={0.14} />
              <stop offset="100%" stopColor={sunColor} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={sunX} cy={sunY} r={170} fill="url(#cargoSun)" opacity={sunOpacity} />
          <circle cx={sunX} cy={sunY} r={78} fill={sunColor} opacity={0.95 * sunOpacity} />
          <circle cx={sunX} cy={sunY} r={78} fill="none" stroke={INK} strokeWidth={2.6} opacity={0.35 * sunOpacity} />

          {/* etoiles (apparaissent avec la nuit) */}
          {nightFade > 0.05 &&
            [
              { x: 180, y: 120 }, { x: 460, y: 90 }, { x: 720, y: 160 }, { x: 980, y: 100 },
              { x: 1240, y: 140 }, { x: 1520, y: 80 }, { x: 1740, y: 180 }, { x: 340, y: 260 },
              { x: 1080, y: 220 }, { x: 1620, y: 260 },
            ].map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={2.6} fill="#fbfbfb" opacity={nightFade * (0.5 + 0.5 * Math.sin(wf / 20 + i))} />
            ))}

          {/* nuages simples, fondu aux bords, boucle lente */}
          {[
            { baseX: 700, y: 180, w: 1.1, speed: 0.1, phase: 0 },
            { baseX: 1200, y: 140, w: 0.9, speed: 0.08, phase: 3 },
            { baseX: 1600, y: 220, w: 1.0, speed: 0.13, phase: 5 },
          ].map((c, k) => {
            const range = 1700;
            const x = 100 + (((c.baseX - 100 - wf * c.speed) % range) + range) % range;
            const bob2 = Math.sin(wf / 34 + c.phase) * 5;
            const edgeFade = Math.min(1, Math.min(x - 100, 1820 - x) / 150);
            const op = 0.4 * Math.max(0, edgeFade);
            return (
              <g key={k} transform={`translate(${x} ${c.y + bob2}) scale(${c.w})`} opacity={op}>
                <path d="M0 0 Q28 -20 58 0 T118 -5" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
              </g>
            );
          })}

          {/* horizon parametrique : dunes/cacaoyers -> pics enneiges */}
          <path d={horizonPath} fill={INK} opacity={0.14} />
          <path
            d={horizonPath}
            fill="none"
            stroke={INK}
            strokeWidth={2.6}
            opacity={0.55}
          />
          {/* neige sur les pics (apparait progressivement avec le voyage, cotes hautes uniquement) */}
          {voyage > 0.55 &&
            HORIZON_X.map((x, i) => {
              const yA = HORIZON_Y_AFRICA[i];
              const yB = HORIZON_Y_SWISS[i];
              const y = yA + (yB - yA) * voyage;
              if (yB > 550) return null; // pas un pic (silhouette basse) -> pas de neige
              const snowOp = interpolate(voyage, [0.55, 0.85], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <circle key={i} cx={x} cy={y + 14} r={14} fill="#fbfbfb" opacity={snowOp} />;
            })}
          {/* cacaoyers (vrai composant CacaoTree, visibles au debut, s'estompent avec le voyage) */}
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

          {/* CUEILLEURS — petits, a l'echelle des cacaoyers (terre ferme, travail humain). S'estompent avec le voyage (meme timing que les arbres).
              LEARNING (test empirique) : carry="shoulder-sack" se confond avec le feuillage a cette echelle reduite (~0.3) -> silhouette
              SANS charge uniquement ici, le geste de recolte (bend+armReach) suffit a raconter le travail. Personnages ESPACES des
              arbres (pas colles au tronc) pour que la silhouette reste distincte du feuillage. */}
          {voyage < 0.65 &&
            [
              { x: 210, y: 708, s: 0.3, carry: "none" as const, phase: 0, tone: "cap" as const },
              { x: 590, y: 702, s: 0.27, carry: "none" as const, phase: 40, tone: "scarf" as const },
            ].map((p, i) => {
              const personOp = interpolate(voyage, [0, 0.4, 0.55], [0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (personOp <= 0.01) return null;
              // geste de recolte en boucle continue (penche -> tend le bras -> se redresse -> repete)
              const cyclePos = (wf + p.phase) % 130;
              const bend = interpolate(cyclePos, [0, 30, 55, 90, 120, 130], [0, 1, 1, 0.3, 0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const armReach = interpolate(cyclePos, [10, 35, 60, 95], [0, 1, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} opacity={personOp}>
                  <StickRig
                    walkPhase={0}
                    moving={false}
                    moveAmt={0}
                    bend={bend}
                    armReach={armReach}
                    facing={i === 0 ? 1 : -1}
                    hat={p.tone}
                    carry={p.carry}
                    load={0}
                  />
                </g>
              );
            })}
        </g>

        {/* ===== OCEAN — fond (derriere le bateau, ancre la ligne d'eau) ===== */}
        <g transform={camSea}>
          <rect x={-800} y={720} width={4000} height={360} fill={seaColor} opacity={0.5} />
          {seaLines.filter((l) => l.y < cargoY).map((l, i) => {
            const points: string[] = [];
            for (let x = -200; x <= 2400; x += 40) {
              const wob = Math.sin((x + l.offset) / 70 + i) * 6;
              points.push(`${x},${l.y + wob}`);
            }
            return <polyline key={i} points={points.join(" ")} fill="none" stroke={INK} strokeWidth={2} opacity={l.opacity} />;
          })}
        </g>

        {/* ===== COUCHE MEDIANE : cargo (parallaxe pleine, quasi fixe horizontalement) — POSE SUR l'ocean ===== */}
        <g opacity={cargoEnter}>
          <g transform={`translate(${cargoX} ${cargoY}) rotate(${pitch})`}>
            {/* coque */}
            <path
              d="M -180 0 L 180 0 L 210 34 L -210 34 Q -180 44 -170 30 Z"
              fill={INK}
              opacity={0.88}
            />
            {/* superstructure (pont + cheminee) */}
            <rect x={60} y={-58} width={70} height={58} fill={INK} opacity={0.88} rx={3} />
            <rect x={78} y={-92} width={18} height={38} fill={INK} opacity={0.9} />
            {/* fumee legere */}
            {[0, 1, 2].map((k) => {
              const t = ((wf / 3 + k * 40) % 120) / 120;
              const sx = 87 + Math.sin(wf / 20 + k) * 10 + t * 20;
              const sy = -96 - t * 60;
              const op = interpolate(t, [0, 0.15, 1], [0, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const r = 8 + t * 16;
              return <circle key={k} cx={sx} cy={sy} r={r} fill={INK} opacity={op} />;
            })}
            {/* conteneurs stylises sur le pont */}
            {[-140, -95, -50, -5, 20].map((cx, i) => (
              <rect key={i} x={cx} y={-24 - (i % 2) * 14} width={40} height={24} fill={PARCH} stroke={INK} strokeWidth={2} opacity={0.85} />
            ))}
            {/* ombre portee sous la coque (renforce l'ancrage dans l'eau) */}
            <ellipse cx={0} cy={38} rx={200} ry={12} fill={INK} opacity={0.18} />
          </g>
          {/* sillage (vague de proue + sillage arriere), suit la position du bateau */}
          <g transform={`translate(${cargoX} ${cargoY + bob})`} opacity={0.4}>
            <path d="M -210 30 Q -260 20 -320 34" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
            <path d="M -210 38 Q -280 44 -360 30" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" opacity={0.6} />
          </g>
        </g>

        {/* ===== OCEAN — 1er plan (lignes proches qui passent DEVANT le bas de la coque, ancrage final) ===== */}
        <g transform={camSea}>
          {seaLines.filter((l) => l.y >= cargoY).map((l, i) => {
            const points: string[] = [];
            for (let x = -200; x <= 2400; x += 40) {
              const wob = Math.sin((x + l.offset) / 70 + i) * 6;
              points.push(`${x},${l.y + wob}`);
            }
            return <polyline key={i} points={points.join(" ")} fill="none" stroke={INK} strokeWidth={2} opacity={l.opacity} />;
          })}
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
