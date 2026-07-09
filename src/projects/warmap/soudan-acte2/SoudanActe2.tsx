/**
 * SoudanActe2 — ACTE 2 "BLOCAGE" (~90.9s @30fps = 2727 frames).
 *
 * STRUCTURE EN 3 SECTIONS (Sequence), registres alternés (plan gravé, validé Aziz) :
 *   Section 1 [0..1167]   beats 1-4 (alliance->scission) = CARTE + jeton 2-visages. audio partie1 (38.9s).
 *   Section 2 [1167..1854] beat 5 (assaut RSF Khartoum) = INSERT KhartoumEtatMajorSVG (25s) + narration
 *                          dédiée (audio beat5, 22.9s). L'insert garde sa pleine durée validée.
 *   Section 3 [1854..2727] beats 6-9 (puissance de feu / immensité / front figé / pont Acte3) = CARTE.
 *                          audio partie2 (29.1s). [beat 6 bloc + 7-8-9 carte]
 *
 * Audio splitté en 3 (acte2-partie1 / acte2-beat5 / acte2-partie2) — le beat 5 a sa propre narration
 * pour laisser respirer l'insert 25s (décision Aziz : ne pas comprimer un asset validé).
 * Socle carte : SoudanWarMapEngine (grammaire AES). Aligns : whisper-partie1.ts / whisper-partie2.ts.
 *
 * ⚠️ ÉTAT : sections 1 et 2 câblées. Section 3 (beats 6-9) = squelette carte à enrichir.
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";
import { SoudanWarMapEngine, CamKey, StateHighlight, ZoneControl } from "../engine/SoudanWarMapEngine";
import { Pt } from "../engine/soudanActors";
import { TwoFaceToken } from "./TwoFaceToken";
import { KhartoumEtatMajorSVG } from "../KhartoumEtatMajorSVG";

export const SOUDAN_A2_FPS = 30;

// ── DURÉES DE SECTION (frames @30) ──
const S1_FRAMES = 1167;  // beats 1-4  (audio partie1 38.9s)
const S2_FRAMES = 687;   // beat 5     (audio beat5 22.9s ; insert 25s=750f, on coupe à 687 sur la voix)
const S3_FRAMES = 873;   // beats 6-9  (audio partie2 29.1s)
export const SOUDAN_A2_FRAMES = S1_FRAMES + S2_FRAMES + S3_FRAMES; // 2727 (90.9s)

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT RACINE — orchestre les 3 sections
// ─────────────────────────────────────────────────────────────────────────────
export const SoudanActe2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={S1_FRAMES} name="beats1-4-carte">
      <Beats14Map />
    </Sequence>
    <Sequence from={S1_FRAMES} durationInFrames={S2_FRAMES} name="beat5-insert">
      <Beat5Insert />
    </Sequence>
    <Sequence from={S1_FRAMES + S2_FRAMES} durationInFrames={S3_FRAMES} name="beats6-9-carte">
      <Beats69Map />
    </Sequence>
  </AbsoluteFill>
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1 — BEATS 1-4 (carte + jeton 2-visages)  [frames RELATIVES à la section]
// ═════════════════════════════════════════════════════════════════════════════

const DARFUR: [number, number] = [26.0, 14.9];     // Hemedti (ouest, Nord-Darfour)
const KHARTOUM: [number, number] = [32.55, 15.6];  // al-Burhan (est)
const FUSION: [number, number] = [30.2, 15.3];     // point de rencontre (centre du Soudan)

// frames = whisper-partie1.ts (audio partie1 38.9s @30). Ancrages vérifiés.
const F = {
  start: 0,
  converge: 55,
  fusion: 296,        // "en 2021" -> FUSION
  hamdok: 464,        // "Abdalla Hamdok" -> gouvernement civil se ternit
  mais: 619,
  commande: 756,      // "qui commande l'autre" -> FEND
  avril23: 911,       // "avril 2023" -> SPLIT
  ouverte: 1004,
  end: S1_FRAMES,
};

const CAM1: CamKey[] = [
  { f: F.start, lon: 30.0, lat: 15.4, zoom: 5.0 },
  { f: F.converge, lon: 30.1, lat: 15.35, zoom: 5.08 },
  { f: F.fusion, lon: 30.2, lat: 15.3, zoom: 5.35 },
  { f: F.commande, lon: 30.25, lat: 15.32, zoom: 5.4 },
  { f: F.avril23, lon: 30.2, lat: 15.3, zoom: 5.25 },
  { f: F.end, lon: 30.4, lat: 15.35, zoom: 5.15 },
];

const HL1 = (state: string, faction: "rsf" | "saf" | "contested", drawAt: number): StateHighlight => ({
  state, faction, drawAt, drawFrames: 34, holdFrames: 600, fadeFrames: 0,
});
const HIGHLIGHTS1: StateHighlight[] = [
  HL1("North Darfur", "rsf", F.avril23 + 20),
  HL1("Khartoum", "saf", F.avril23 + 40),
];

const Beats14Map: React.FC = () => {
  const frame = useCurrentFrame();

  const conv = interpolate(frame, [F.converge, F.fusion], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const soloOp = interpolate(frame, [F.fusion - 20, F.fusion - 4], [1, 0], clamp);
  const mergedOp = interpolate(frame, [F.fusion - 8, F.fusion + 2], [0, 1], clamp);

  const rsfHalo = interpolate(frame, [F.avril23, F.avril23 + 60], [0, 0.85], clamp);
  const safHalo = interpolate(frame, [F.avril23 + 20, F.avril23 + 80], [0, 0.85], clamp);
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 300, intensity: rsfHalo },
    { at: KHARTOUM, faction: "saf", radiusKm: 240, intensity: safHalo },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte2-partie1.mp3")} />

      <Sequence from={F.fusion} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.42} /></Sequence>
      <Sequence from={F.commande} durationInFrames={26}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F.avril23} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM1} zones={zones} highlights={HIGHLIGHTS1} showNationalBorder stateLineOpacity={0}>
        {(proj) => {
          const fusionPos = proj(FUSION);
          const startL = proj(DARFUR);
          const startR = proj(KHARTOUM);
          if (!fusionPos) return null;
          const lx = startL ? startL.x + (fusionPos.x - startL.x) * conv : fusionPos.x;
          const ly = startL ? startL.y + (fusionPos.y - startL.y) * conv : fusionPos.y;
          const rx = startR ? startR.x + (fusionPos.x - startR.x) * conv : fusionPos.x;
          const ry = startR ? startR.y + (fusionPos.y - startR.y) * conv : fusionPos.y;
          return (
            <>
              {soloOp > 0.01 && frame >= F.converge - 4 && (
                <>
                  <SoloBig pos={{ x: lx, y: ly }} sprite="portrait-hemeti" border="#B14B3C" op={soloOp} frame={frame} appear={F.converge - 4} />
                  <SoloBig pos={{ x: rx, y: ry }} sprite="portrait-burhan" border="#3E6E9E" op={soloOp} frame={frame} appear={F.converge - 4} />
                </>
              )}
              {mergedOp > 0.01 && (
                <div style={{ opacity: mergedOp }}>
                  <TwoFaceToken pos={fusionPos} frame={frame}
                    mergeAt={F.fusion} fendAt={F.commande} splitAt={F.avril23}
                    splitGap={200} D={124} appearFrom={F.fusion - 6} />
                </div>
              )}
            </>
          );
        }}
      </SoudanWarMapEngine>

      <CivilGovCartouche frame={frame} at={F.hamdok} />
      <WarmVignette />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2 — BEAT 5 (insert état-major Khartoum + narration dédiée)
// ═════════════════════════════════════════════════════════════════════════════

const Beat5Insert: React.FC = () => {
  const frame = useCurrentFrame();
  // fondu court d'entrée/sortie (board clearing doux entre registres carte<->insert, doctrine WARMAP)
  const fade = interpolate(frame, [0, 12, S2_FRAMES - 14, S2_FRAMES], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1526" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte2-beat5.mp3")} />
      {/* l'insert gère son propre useCurrentFrame (relatif à cette Sequence) et son fond/animation validés.
          hideSubtitle : la narration off dit déjà les cibles -> pas de doublon voix/texte (doctrine). */}
      <AbsoluteFill style={{ opacity: fade }}>
        <KhartoumEtatMajorSVG hideSubtitle />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3 — BEATS 6-9 (carte : puissance de feu / immensité / front figé / pont Acte3)
// ═════════════════════════════════════════════════════════════════════════════

// frames = whisper-partie2.ts (audio partie2 29.1s @30). Ancrages relatifs à la section.
const G = {
  armee: 7,        // b6 "L'armée, elle, a les avions et les chars lourds"
  gagner: 129,     // b6 "elle devrait gagner / n'y arrive pas"
  geo: 289,        // b7 "La raison tient à la géographie"
  immense: 348,    // b7 "le Soudan est immense"
  ravitailler: 420,// b7 "se ravitailler sur mille kilomètres de pistes"
  resultat: 511,   // b8 "Résultat, depuis plus de trois ans"
  arreter: 746,    // b8 "que personne ne veut arrêter" -> pulse or
  sortir: 799,     // b9 "Pour comprendre pourquoi, il faut sortir du Soudan"
  end: S3_FRAMES,
};

// caméra : b6 centre (rapport de force) -> b7 DÉZOOM immensité -> b8 front figé -> b9 dézoom hors Soudan.
// NB : à G.arreter ("personne ne veut arrêter"), la caméra tient une clé quasi-identique ~1,5s = figement
// narratif voulu (SEUL moment où le Ken Burns se calme ; tout le reste dérive en continu, doctrine).
const CAM3: CamKey[] = [
  { f: 0, lon: 30.4, lat: 15.35, zoom: 5.1 },
  { f: G.geo, lon: 30.0, lat: 15.2, zoom: 4.65 },          // dézoom : l'immensité
  { f: G.ravitailler, lon: 29.4, lat: 15.1, zoom: 4.42 },  // grand angle sur toute la logistique
  { f: G.resultat, lon: 29.9, lat: 15.05, zoom: 4.6 },     // recentre sur le front figé
  { f: G.arreter, lon: 29.6, lat: 14.7, zoom: 4.52 },      // figement : englobe front + or Darfour
  { f: G.arreter + 44, lon: 29.55, lat: 14.68, zoom: 4.5 },// quasi-immobile ~1,5s (arrêt narratif)
  { f: G.sortir, lon: 31.0, lat: 15.4, zoom: 4.2 },        // dézoom amorcé hors Soudan (pont Acte 3)
  { f: G.end, lon: 33.4, lat: 16.2, zoom: 3.75 },          // se décale est/nord-est = amorce la sortie
];

// ── ANCRAGES ACTEURS SECTION 3 (lon/lat réels) ──
const FRONT_LON = 30.0;                                   // ligne de front centrale (elle TIENT)
const FRONT_LAT_TOP = 17.6;                               // haut du front (nord)
const FRONT_LAT_BOT = 12.6;                               // bas du front (sud)
// Puissance de feu SAF (est) : chars massés côté armée, poussant vers le front.
const SAF_TANKS: [number, number][] = [
  [31.0, 16.3], [31.4, 15.4], [31.1, 14.4],
];
// Avions SAF (au-dessus des chars, plus à l'est = base arrière) — pictogrammes SVG.
const SAF_PLANES: [number, number][] = [
  [32.4, 16.8], [33.0, 15.6],
];
const MINE_OR: [number, number] = [25.0, 13.0];           // or du Darfour (ouest) — pulse beat 8
// ligne de ravitaillement : de Port-Soudan/est vers le front (s'amincit, pointillés s'espacent)
const SUPPLY_FROM: [number, number] = [36.2, 19.4];       // Port-Soudan / base arrière est
const SUPPLY_VIA: [number, number] = [33.0, 17.2];        // Khartoum-nord (coude)
const SUPPLY_TO: [number, number] = [30.4, 15.9];         // proche du front

const Beats69Map: React.FC = () => {
  const frame = useCurrentFrame();

  // Halos de partition persistants (socle). RSF ouest LARGE (territoire étendu, peu d'armes) /
  // SAF est plus resserré. Montée douce au début de section pour continuité avec le beat 5.
  const enter = interpolate(frame, [0, 24], [0, 1], clamp);
  const rsfHalo = 0.78 * enter;
  const safHalo = 0.62 * enter;
  // le rouge RSF déborde encore un peu à l'ouverture du beat 9 (pont : le Darfour reste le centre de gravité)
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 360, intensity: rsfHalo },
    { at: KHARTOUM, faction: "saf", radiusKm: 220, intensity: safHalo },
  ];
  const HL3: StateHighlight[] = [
    { state: "North Darfur", faction: "rsf", drawAt: 0, drawFrames: 1, holdFrames: 900, fadeFrames: 0 },
    { state: "Khartoum", faction: "saf", drawAt: 0, drawFrames: 1, holdFrames: 900, fadeFrames: 0 },
  ];

  // ── FRONT : oscillation frame-driven (vectorielle, tolérée). Beat 6 = léger frémissement sous la
  //   poussée SAF mais NE CÈDE PAS. Beat 8 = micro-oscillation ~1px (quasi-figé). PAS de percée. ──
  const frontPushAmp = interpolate(frame, [G.armee, G.gagner, G.geo], [0, 6, 2.5], clamp); // px, poussée qui retombe
  const frontCalm = interpolate(frame, [G.resultat, G.resultat + 60], [1, 0.16], clamp);   // se fige presque
  const frontAmpPx = Math.max(1, frontPushAmp * frontCalm + 1);
  // vibration : somme de 2 sinus (rapide + lent) pour un frémissement organique, jamais un glissement net
  const frontWobble = Math.sin(frame * 0.9) * 0.6 + Math.sin(frame * 0.31 + 1.3) * 0.4;
  const frontDx = frontWobble * frontAmpPx; // décalage horizontal (px écran) de la ligne, borné

  // ── OR DU DARFOUR : pulse doré qui BAT à partir de G.arreter (pont Acte 3, contraste fixe/vivant) ──
  const goldReveal = interpolate(frame, [G.arreter - 30, G.arreter], [0, 1], clamp);
  const goldPulse = 0.5 + 0.5 * Math.sin((frame - G.arreter) * 0.14); // 0..1 lent
  const goldHaloOp = goldReveal * (0.28 + 0.34 * goldPulse);
  const goldRingScale = 1 + 0.14 * goldPulse;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte2-partie2.mp3")} />

      {/* SFX ponctuels : apparition de la puissance de feu SAF + révélation de l'or (pont Acte 3) */}
      <Sequence from={G.armee} durationInFrames={26}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.4} /></Sequence>
      <Sequence from={G.arreter} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.4} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM3} zones={zones} highlights={HL3} showNationalBorder stateLineOpacity={0}>
        {(proj) => {
          const topP = proj([FRONT_LON, FRONT_LAT_TOP]);
          const botP = proj([FRONT_LON, FRONT_LAT_BOT]);
          const minePos = proj(MINE_OR);
          // supply path (est -> front), reprojeté par frame
          const sFrom = proj(SUPPLY_FROM);
          const sVia = proj(SUPPLY_VIA);
          const sTo = proj(SUPPLY_TO);

          // draw-in de la ligne de ravitaillement (b7)
          const supplyDraw = interpolate(frame, [G.geo, G.ravitailler + 30], [0, 1], clamp);
          const supplyFade = interpolate(frame, [G.geo - 24, G.geo], [0, 1], clamp);

          return (
            <>
              {/* ── LIGNE DE FRONT (elle TIENT) : trait d'encre vertical qui frémit mais ne cède pas ── */}
              {topP && botP && (
                <FrontLine top={topP} bot={botP} dx={frontDx} frame={frame} appear={G.armee} />
              )}

              {/* ── LIGNE DE RAVITAILLEMENT SAF (b7) : est -> front, s'amincit + pointillés s'espacent ── */}
              {sFrom && sVia && sTo && supplyFade > 0.01 && (
                <SupplyLine from={sFrom} via={sVia} to={sTo} draw={supplyDraw} op={supplyFade} />
              )}

              {/* ── PUISSANCE DE FEU SAF (b6) : chars + avions qui apparaissent (spring), scale FIGÉ après ── */}
              {SAF_TANKS.map((c, i) => {
                const p = proj(c);
                if (!p) return null;
                return (
                  <FirepowerSprite key={`tk${i}`} pos={p} sprite="tank-td-blue"
                    size={92} rotate={-90} frame={frame} appear={G.armee + 6 + i * 7} />
                );
              })}
              {SAF_PLANES.map((c, i) => {
                const p = proj(c);
                if (!p) return null;
                return (
                  <PlaneIcon key={`pl${i}`} pos={p} size={58} frame={frame} appear={G.armee + 24 + i * 9} />
                );
              })}

              {/* ── OR DU DARFOUR (b8->b9) : mine + halo doré qui BAT (pont Acte 3) ── */}
              {minePos && goldReveal > 0.01 && (
                <MineGold pos={minePos} haloOp={goldHaloOp} ringScale={goldRingScale}
                  frame={frame} appear={G.arreter - 30} reveal={goldReveal} />
              )}
            </>
          );
        }}
      </SoudanWarMapEngine>
      <WarmVignette />
    </AbsoluteFill>
  );
};

// ── FRONT LINE : ligne d'encre verticale au centre. Elle frémit (dx) mais TIENT (aucune percée). ──
const FrontLine: React.FC<{ top: Pt; bot: Pt; dx: number; frame: number; appear: number }> =
  ({ top, bot, dx, frame, appear }) => {
    const op = interpolate(frame, [appear, appear + 20], [0, 0.9], clamp);
    if (op <= 0.01) return null;
    const x1 = top.x + dx, y1 = top.y;
    const x2 = bot.x + dx, y2 = bot.y;
    const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
        {/* halo diffus du front (tension) : 2 traits larges à faible opacité = flou sans filter (headless-safe) */}
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7a1f14" strokeWidth={22}
          strokeOpacity={op * 0.12} strokeLinecap="round" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7a1f14" strokeWidth={13}
          strokeOpacity={op * 0.2} strokeLinecap="round" />
        {/* trait de front dur (encre) — pointillé serré = ligne de contact disputée */}
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a1a0c" strokeWidth={3.4}
          strokeOpacity={op} strokeLinecap="round" strokeDasharray="10 7" />
        {/* liseré chaud (le front sous pression, jamais rompu) */}
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9552f" strokeWidth={1.6}
          strokeOpacity={op * 0.85} strokeLinecap="round" strokeDasharray="4 11" />
        {/* petit renflement central = le point de poussée max qui bombe mais ne rompt pas */}
        <circle cx={midX} cy={midY} r={7} fill="#c9552f" fillOpacity={op * 0.28} />
        <circle cx={midX} cy={midY} r={4} fill="#c9552f" fillOpacity={op * 0.5} />
      </svg>
    );
  };

// ── SUPPLY LINE : de l'est (base arrière) vers le front. S'AMINCIT et les pointillés s'ESPACENT
//   à mesure qu'on s'éloigne (la logistique qui s'épuise). Tracée en 3 segments dégressifs. ──
const SupplyLine: React.FC<{ from: Pt; via: Pt; to: Pt; draw: number; op: number }> =
  ({ from, via, to, draw, op }) => {
    // 3 segments le long du chemin from->via->to, du plus épais/dense (est) au plus fin/espacé (ouest)
    const segs = [
      { a: from, b: via, w: 3.4, dash: "12 8", part: 0.5 },   // est : gros, dense
      { a: via, b: mid(via, to, 0.5), w: 2.2, dash: "9 13", part: 0.28 },
      { a: mid(via, to, 0.5), b: to, w: 1.2, dash: "5 18", part: 0.22 }, // front : fin, espacé (s'épuise)
    ];
    // draw-in cumulatif : on remplit les segments dans l'ordre est->ouest
    let acc = 0;
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
        {segs.map((s, i) => {
          const segStart = acc; acc += s.part;
          const local = Math.min(1, Math.max(0, (draw - segStart) / s.part));
          if (local <= 0) return null;
          const bx = s.a.x + (s.b.x - s.a.x) * local;
          const by = s.a.y + (s.b.y - s.a.y) * local;
          return (
            <line key={i} x1={s.a.x} y1={s.a.y} x2={bx} y2={by}
              stroke="#3E6E9E" strokeWidth={s.w} strokeOpacity={op * 0.85}
              strokeDasharray={s.dash} strokeLinecap="round" />
          );
        })}
        {/* pastille source (base arrière est) */}
        <circle cx={from.x} cy={from.y} r={4.5} fill="#3E6E9E" fillOpacity={op * 0.9} />
      </svg>
    );
  };

const mid = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

// ── FIREPOWER SPRITE (char) : apparition spring PUIS scale FIGÉ (pas de breathe sur du raster). ──
const FirepowerSprite: React.FC<{ pos: Pt; sprite: string; size: number; rotate: number; frame: number; appear: number }> =
  ({ pos, sprite, size, rotate, frame, appear }) => {
    const ap = interpolate(frame, [appear, appear + 10, appear + 20], [0, 1.12, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    const op = interpolate(frame, [appear, appear + 8], [0, 1], clamp);
    if (op <= 0.01) return null;
    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-50%) scale(${ap})`, opacity: op, pointerEvents: "none" }}>
        {/* ombre portée douce au sol */}
        <div style={{ position: "absolute", left: "50%", top: "62%", width: size * 0.7, height: size * 0.22,
          transform: "translate(-50%,-50%)", background: "rgba(30,20,6,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
        <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
          style={{ width: size, height: size, display: "block", objectFit: "contain",
            transform: `rotate(${rotate}deg)`,
            filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }} />
      </div>
    );
  };

// ── AVION SAF : pictogramme SVG (silhouette d'encre sombre, cohérent parchemin). Taille écran fixe. ──
const PlaneIcon: React.FC<{ pos: Pt; size: number; frame: number; appear: number }> =
  ({ pos, size, frame, appear }) => {
    const ap = interpolate(frame, [appear, appear + 10, appear + 20], [0, 1.14, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    const op = interpolate(frame, [appear, appear + 8], [0, 1], clamp);
    if (op <= 0.01) return null;
    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-50%) scale(${ap})`, opacity: op, pointerEvents: "none" }}>
        {/* nez pointé vers l'ouest (le front) : rotation -90° d'une silhouette qui pointe vers le haut */}
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block",
          transform: "rotate(-90deg)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.45))" }}>
          {/* fuselage + ailes en delta (chasseur), encre sombre bleutée SAF */}
          <path d="M50 6 L57 42 L92 64 L92 74 L57 60 L55 84 L68 92 L68 97 L50 91 L32 97 L32 92 L45 84 L43 60 L8 74 L8 64 L43 42 Z"
            fill="#2b3a4d" stroke="#16202c" strokeWidth={2.4} strokeLinejoin="round" />
        </svg>
      </div>
    );
  };

// ── MINE OR DU DARFOUR : sprite iso + halo doré qui BAT (pulse vectoriel). Pont vers l'Acte 3. ──
const MineGold: React.FC<{ pos: Pt; haloOp: number; ringScale: number; frame: number; appear: number; reveal: number }> =
  ({ pos, haloOp, ringScale, frame, appear, reveal }) => {
    // apparition spring du sprite (scale figé après) — le PULSE vit dans le halo SVG, pas dans le raster
    const ap = interpolate(frame, [appear, appear + 14, appear + 26], [0.6, 1.08, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    const spriteW = 150;
    return (
      <>
        {/* halo doré pulsé (vectoriel, sous le sprite) */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
          <defs>
            <radialGradient id="goldPulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f4c545" stopOpacity={0.85} />
              <stop offset="45%" stopColor="#e0a030" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#e0a030" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={pos.x} cy={pos.y} r={100 * ringScale} fill="url(#goldPulseGrad)"
            opacity={haloOp} style={{ mixBlendMode: "screen" }} />
          {/* anneau fin qui bat = battement de cœur de l'or */}
          <circle cx={pos.x} cy={pos.y} r={62 * ringScale} fill="none" stroke="#f4d06a"
            strokeWidth={2} strokeOpacity={haloOp * 1.1} />
        </svg>
        {/* sprite mine iso (raster, scale figé) */}
        <div style={{ position: "absolute", left: pos.x, top: pos.y, opacity: reveal,
          transform: `translate(-50%,-52%) scale(${ap})`, pointerEvents: "none" }}>
          <img src={staticFile("_shared/sprites/warmap/mine-or-td.png")}
            style={{ width: spriteW, height: spriteW * (768 / 1408), display: "block", objectFit: "contain",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))" }} />
        </div>
      </>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// PARTAGÉ
// ─────────────────────────────────────────────────────────────────────────────

const WarmVignette: React.FC = () => (
  <>
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply",
      background: "radial-gradient(ellipse 74% 70% at 50% 47%, rgba(255,240,210,0.06) 0%, rgba(60,42,18,0.0) 42%, rgba(28,18,8,0.42) 100%)" }} />
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light",
      background: "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,238,200,0.22) 0%, rgba(255,238,200,0) 60%)" }} />
  </>
);

const SoloBig: React.FC<{ pos: Pt; sprite: string; border: string; op: number; frame: number; appear: number }> =
  ({ pos, sprite, border, op, frame, appear }) => {
    const D = 124;
    const ap = interpolate(frame, [appear, appear + 12, appear + 22], [0, 1.12, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    const CREAM = "#F2E5C8";
    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-50%) scale(${ap})`, opacity: op, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: "50%", top: "68%", width: D * 0.9, height: D * 0.24,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(7px)" }} />
        <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: CREAM,
          border: `${D * 0.05}px solid ${border}`, boxSizing: "border-box",
          boxShadow: "0 5px 14px rgba(0,0,0,0.5)" }}>
          <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
            style={{ position: "absolute", top: "50%", left: "50%", width: "116%", height: "116%",
              transform: "translate(-50%,-48%)", objectFit: "cover", objectPosition: "top center", display: "block" }} />
        </div>
      </div>
    );
  };

const CivilGovCartouche: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const inOp = interpolate(frame, [at - 10, at + 8], [0, 1], clamp);
  const outOp = interpolate(frame, [at + 140, at + 170], [1, 0], clamp);
  const op = inOp * outOp;
  if (op <= 0.01) return null;
  const gray = interpolate(frame, [at + 40, at + 110], [0, 1], clamp);
  const strike = interpolate(frame, [at + 60, at + 100], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 84, left: "50%", transform: "translateX(-50%)", opacity: op,
      pointerEvents: "none", fontFamily: "Georgia, serif", textAlign: "center",
      background: "rgba(28,18,8,0.86)", border: "1px solid rgba(233,196,106,0.35)", borderRadius: 5,
      padding: "10px 26px", filter: `grayscale(${gray}) brightness(${1 - gray * 0.35})` }}>
      <div style={{ fontSize: 15, letterSpacing: 3, color: "#C9A968", textTransform: "uppercase" }}>
        Gouvernement de transition
      </div>
      <div style={{ position: "relative", fontSize: 26, fontWeight: 700, color: "#F4E3B0", marginTop: 3, letterSpacing: 1 }}>
        Abdalla Hamdok
        <div style={{ position: "absolute", left: 0, top: "52%", height: 2, width: `${strike * 100}%`,
          background: "#B14B3C", transformOrigin: "left" }} />
      </div>
    </div>
  );
};

export default SoudanActe2;
