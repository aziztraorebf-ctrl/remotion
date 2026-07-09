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
import { BlocImpasseB6, BLOC_B6_FRAMES } from "./BlocImpasseB6";

export const SOUDAN_A2_FPS = 30;

// ── DURÉES DE SECTION (frames @30) ──
const S1_FRAMES = 1167;  // beats 1-4  (audio partie1 38.9s)
const S2_FRAMES = 720;   // beat 5     (voix beat5 21.5s=646f + ~74f de respiration ; insert 750f = laisse
                         //             l'assaut finir sa résolution, léger recouvrement au fondu de sortie)
const S3_FRAMES = 920;   // beats 6-9  (audio partie2 30.4s, fin "sortir du Soudan" restaurée)
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
const FORCES_AT = 30;  // délai après F.avril23 avant que les forces commencent à consolider (garder épuré au split)

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

// ── FORCES QUI CONSOLIDENT AU SPLIT (F.avril23) : chaque général meuble son camp. ──
// Offsets géographiques (lon/lat) autour de chaque général, ÉVENTAIL bien espacé.
// kind = jeton-visage soldat ("token") ou matériel raster ("mat").
// delay = stagger d'apparition (frames après le début du groupe).
type ForceItem = { dlon: number; dlat: number; kind: "token" | "mat"; delay: number };

// Hemedti (ouest, DARFUR). Le palais est côté KHARTOUM (est) -> pas de collision ici.
// Le jeton général reste au centre du groupe : les items sont poussés vers l'ouest/nord/sud.
const HEMEDTI_FORCES: ForceItem[] = [
  { dlon: -1.7, dlat: 0.95, kind: "token", delay: 0 },   // nord-ouest
  { dlon: -1.9, dlat: -0.85, kind: "token", delay: 12 }, // sud-ouest
  { dlon: 0.15, dlat: 1.55, kind: "token", delay: 24 },  // nord
  { dlon: -2.55, dlat: 0.1, kind: "mat", delay: 7 },     // technical plein ouest
  { dlon: -0.7, dlat: -1.45, kind: "mat", delay: 19 },   // technical sud
];
// al-Burhan (est, KHARTOUM). Le palais est SUR Khartoum (dlon/dlat 0) : on écarte tout vers est/nord/sud,
// jamais sur le centre. Les 2 jetons généraux (Hemedti/Burhan) sont éloignés (ouest vs est) -> pas de heurt.
const BURHAN_FORCES: ForceItem[] = [
  { dlon: 1.75, dlat: 0.9, kind: "token", delay: 5 },    // nord-est
  { dlon: 1.95, dlat: -0.9, kind: "token", delay: 17 },  // sud-est
  { dlon: 0.35, dlat: 1.65, kind: "token", delay: 29 },  // nord (au-dessus du palais)
  { dlon: 2.55, dlat: 0.15, kind: "mat", delay: 11 },    // char plein est
  { dlon: 1.0, dlat: -1.6, kind: "mat", delay: 23 },     // char sud-est
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
      <Sequence from={F.commande} durationInFrames={26}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.3} /></Sequence>
      <Sequence from={F.avril23} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} /></Sequence>

      {/* ── SFX PONCTUELS section 1 ── */}
      {/* tics discrets du compteur d'année qui recule (2026->2021) entre F.converge et F.fusion */}
      <Sequence from={F.converge} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      <Sequence from={F.converge + 60} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      <Sequence from={F.converge + 120} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      <Sequence from={F.converge + 180} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      {/* tension quand le jeton se fend ("qui commande l'autre") — complète le map-ping */}
      <Sequence from={F.commande} durationInFrames={34}><Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} volume={0.4} /></Sequence>
      {/* le compteur avance à 2023 (guerre ouverte) */}
      <Sequence from={F.avril23} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.28} /></Sequence>
      {/* apparition des forces au split (une seule fois, pas par jeton) */}
      <Sequence from={F.avril23 + FORCES_AT} durationInFrames={26}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.35} /></Sequence>

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

              {/* (Beat 2 coup d'État : registre épuré — la fusion des jetons "l'armée et la milice main
                  dans la main" porte le sens. Palais iso retiré : la voix ne le nomme jamais, objet orphelin.) */}

              {/* ── FORCES QUI CONSOLIDENT (à partir du SPLIT +30) : chaque camp meuble son territoire.
                  RIEN avant F.avril23+30 (les beats 1-3 restent épurés autour du jeton signature). ── */}
              {frame >= F.avril23 + FORCES_AT && (
                <>
                  <GeneralForces proj={proj} center={DARFUR} items={HEMEDTI_FORCES}
                    faction="rsf" border="#B14B3C" frame={frame} startAt={F.avril23 + FORCES_AT} />
                  <GeneralForces proj={proj} center={KHARTOUM} items={BURHAN_FORCES}
                    faction="saf" border="#3E6E9E" frame={frame} startAt={F.avril23 + FORCES_AT} />
                </>
              )}
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* ── FIL TEMPOREL (beats 1-4) : compteur d'année qui recule 2026->2021 ("revenir en arrière"),
          fige sur 2021 (l'alliance), puis avance à 2023 au split (guerre ouverte), puis disparaît. ── */}
      <YearCounter frame={frame} />

      <WarmVignette />
    </AbsoluteFill>
  );
};

// ── COMPTEUR D'ANNÉE (fil temporel de l'arc alliance->scission). Bandeau discret en bas centre. ──
const YearCounter: React.FC<{ frame: number }> = ({ frame }) => {
  // recul 2026 -> 2021 sur [converge..fusion] ; fige 2021 ; avance 2021 -> 2023 au split ; disparaît +1.5s
  const rewind = interpolate(frame, [F.converge, F.fusion], [2026, 2021], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const advance = interpolate(frame, [F.avril23, F.avril23 + 24], [2021, 2023], { ...clamp, easing: Easing.out(Easing.cubic) });
  const year = frame < F.avril23 ? Math.round(rewind) : Math.round(advance);
  // apparition au début, disparition ~1.5s après le split
  const op = interpolate(frame,
    [F.converge - 6, F.converge + 14, F.avril23 + 50, F.avril23 + 75], [0, 1, 1, 0], clamp);
  if (op <= 0.01) return null;
  // léger flash quand le compteur s'arrête sur une année pivot (2021 à la fusion, 2023 au split)
  const pivotGlow = Math.max(
    interpolate(frame, [F.fusion - 6, F.fusion + 6, F.fusion + 30], [0, 1, 0], clamp),
    interpolate(frame, [F.avril23 + 18, F.avril23 + 28, F.avril23 + 50], [0, 1, 0], clamp),
  );
  return (
    <div style={{ position: "absolute", left: "50%", bottom: 64, transform: "translateX(-50%)",
      opacity: op, pointerEvents: "none", fontFamily: "Georgia, serif", textAlign: "center" }}>
      {/* juste l'année en GROS (la voix dit déjà "revenir en arrière"/"guerre ouverte" — pas de label redondant) */}
      <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: 3, lineHeight: 1,
        color: "#F4E3B0", textShadow: `0 3px 14px rgba(0,0,0,0.8), 0 0 ${10 + pivotGlow * 22}px rgba(233,196,106,${pivotGlow * 0.8})` }}>
        {year}
      </div>
    </div>
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

      {/* ── SFX impact DOUX à chaque cible frappée (aéroport 170 / palais 370 / tour TV 570) : donne
          vie à l'assaut sans le boom trop fort. Même son récurrent, volume bas. Frames = contact colonne. ── */}
      <Sequence from={170} durationInFrames={24}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.32} /></Sequence>
      <Sequence from={370} durationInFrames={24}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.32} /></Sequence>
      <Sequence from={570} durationInFrames={24}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.32} /></Sequence>

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

// frames = whisper-partie2.ts (audio partie2 30.4s @30, fin restaurée). Ancrages relatifs à la section 3.
// La section 3 est en 2 registres : BEAT 6 = BLOC plein cadre [0..B6_END] · BEATS 7-8-9 = CARTE [B6_END..end].
const G = {
  armee: 6,        // b6 "L'armée, elle, a les avions et les chars lourds"
  gagner: 129,     // b6 "elle devrait gagner / n'y arrive pas"
  geo: 294,        // b7 "La raison tient à la géographie" = bascule BLOC -> CARTE
  immense: 355,    // b7 "le Soudan est immense"
  ravitailler: 430,// b7 "se ravitailler sur mille kilomètres de pistes"
  resultat: 517,   // b8 "Résultat, depuis plus de trois ans"
  arreter: 752,    // b8 "que personne ne veut arrêter" -> pulse or
  sortir: 887,     // b9 "Pour comprendre pourquoi, il faut sortir du Soudan"
  end: S3_FRAMES,
};
const B6_END = G.geo;            // frame de bascule BLOC -> CARTE (fin beat 6)
const XFADE = 16;                // durée du morphing/cross-fade bloc<->carte

// ═════════ SECTION 3 conteneur : audio partie2 continu + bascule visuelle BLOC(b6) -> CARTE(b7-9) ═════════
const Beats69Map: React.FC = () => {
  const frame = useCurrentFrame();
  // morphing bloc<->carte : le bloc s'efface (zoom-out léger + fade) pendant que la carte monte (fade)
  const blocOp = interpolate(frame, [B6_END - XFADE, B6_END], [1, 0], clamp);
  const mapOp = interpolate(frame, [B6_END - XFADE, B6_END], [0, 1], clamp);
  const blocScale = interpolate(frame, [B6_END - XFADE, B6_END], [1, 1.06], clamp); // léger recul = bascule de registre
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1526" }}>
      {/* audio partie2 : beats 6-7-8-9 en continu (ne PAS resplitter — un seul flux) */}
      <Audio src={staticFile("_shared/audio/soudan/acte2-partie2.mp3")} />

      {/* ── SFX PONCTUELS section 3 (frames relatives à la section entière) ── */}
      {/* BEAT 6 (BLOC, joue de 0 à ~G.geo=294) : axe de manœuvre -> contact chars -> vibration du front */}
      <Sequence from={90} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/arrow-whoosh.mp3")} volume={0.4} /></Sequence>
      <Sequence from={100} durationInFrames={40}><Audio src={staticFile("_shared/sfx/sfx-tension-tug.mp3")} volume={0.35} /></Sequence>
      <Sequence from={178} durationInFrames={34}><Audio src={staticFile("_shared/sfx/sfx-clash-impact.mp3")} volume={0.5} /></Sequence>

      {/* BEAT 7 : tics discrets du compteur km (défile de G.immense=355 à G.ravitailler=430) */}
      <Sequence from={G.immense} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      <Sequence from={G.immense + 25} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      <Sequence from={G.immense + 50} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      <Sequence from={G.immense + 75} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/tick-counter.mp3")} volume={0.25} /></Sequence>
      {/* points de danger RSF sur la piste de ravitaillement (entre G.ravitailler et G.resultat) */}
      <Sequence from={G.ravitailler + 10} durationInFrames={22}><Audio src={staticFile("_shared/sfx/ui/slash-red.mp3")} volume={0.3} /></Sequence>
      <Sequence from={G.ravitailler + 42} durationInFrames={22}><Audio src={staticFile("_shared/sfx/ui/slash-red.mp3")} volume={0.3} /></Sequence>
      <Sequence from={G.ravitailler + 74} durationInFrames={22}><Audio src={staticFile("_shared/sfx/ui/slash-red.mp3")} volume={0.3} /></Sequence>

      {/* BEAT 6 — BLOC plein cadre (rapport de force, illustratif). localFrame = frame de section. */}
      {blocOp > 0.01 && (
        <AbsoluteFill style={{ opacity: blocOp, transform: `scale(${blocScale})` }}>
          <BlocImpasseB6 localFrame={frame} />
        </AbsoluteFill>
      )}

      {/* BEATS 7-8-9 — CARTE Mapbox. Montée en fondu au morphing. */}
      {mapOp > 0.01 && (
        <AbsoluteFill style={{ opacity: mapOp }}>
          <Beats789Map />
        </AbsoluteFill>
      )}

      {/* ── CONTINUITÉ front bloc->carte (idée Gemini) : une ligne de front verticale rouge PERSISTE
          par-dessus le cross-fade. Le bloc s'efface, la carte monte, mais l'œil suit la MÊME ligne
          (elle relie le front du bloc à x~960 à la ligne de démarcation de la carte). ── */}
      <FrontBridge frame={frame} />
    </AbsoluteFill>
  );
};

// ── FRONT BRIDGE : ligne de front rouge de continuité pendant la bascule BLOC -> CARTE. Le front du
// bloc (x~960, centre) se prolonge visuellement en la ligne de démarcation de la carte. Elle vit sur
// la fenêtre de morphing puis se fond (la FrontLine de la carte prend le relais). ──
const FrontBridge: React.FC<{ frame: number }> = ({ frame }) => {
  // visible de la fin du bloc jusqu'à ce que la carte ait posé sa propre ligne
  const op = interpolate(frame, [B6_END - XFADE, B6_END - 4, B6_END + 26, B6_END + 46], [0, 0.85, 0.85, 0], clamp);
  if (op <= 0.01) return null;
  const cx = 960;                       // centre écran = où tombe le front du bloc ET ~le front carte au dézoom
  const wob = Math.sin(frame * 0.12) * 3;
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
      {/* glow diffus (headless-safe : traits larges faible opacité) */}
      <line x1={cx + wob} y1={90} x2={cx - wob} y2={990} stroke="#7a1f14" strokeWidth={20} strokeOpacity={op * 0.14} strokeLinecap="round" />
      <line x1={cx + wob} y1={90} x2={cx - wob} y2={990} stroke="#7a1f14" strokeWidth={11} strokeOpacity={op * 0.22} strokeLinecap="round" />
      {/* trait de front (encre) + liseré chaud pointillé */}
      <line x1={cx + wob} y1={90} x2={cx - wob} y2={990} stroke="#2a1a0c" strokeWidth={3.4} strokeOpacity={op} strokeLinecap="round" strokeDasharray="10 7" />
      <line x1={cx + wob} y1={90} x2={cx - wob} y2={990} stroke="#c9552f" strokeWidth={1.6} strokeOpacity={op * 0.85} strokeLinecap="round" strokeDasharray="4 11" />
    </svg>
  );
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
// ligne de ravitaillement : de Port-Soudan/est vers le front (s'amincit, pointillés s'espacent)
const SUPPLY_FROM: [number, number] = [36.2, 19.4];       // Port-Soudan / base arrière est
const SUPPLY_VIA: [number, number] = [33.0, 17.2];        // Khartoum-nord (coude)
const SUPPLY_TO: [number, number] = [30.4, 15.9];         // proche du front

// ── FORCES FIGÉES beat 8 : de part et d'autre du front (lon 30). Général (gen:true, portrait) + soldats.
//   OUEST = RSF (Hemedti), EST = SAF (al-Burhan). Chacun tient sa ligne, immobile. ──
const HELD_WEST: { at: [number, number]; gen?: boolean }[] = [
  { at: [28.6, 15.4], gen: true },   // Hemedti (général, près du front, côté ouest)
  { at: [27.4, 16.6] }, { at: [27.0, 14.2] }, { at: [28.9, 13.4] },
];
const HELD_EAST: { at: [number, number]; gen?: boolean }[] = [
  { at: [31.5, 15.4], gen: true },   // al-Burhan (général, près du front, côté est)
  { at: [32.6, 16.7] }, { at: [33.0, 14.4] }, { at: [31.4, 13.3] },
];

// CARTE beats 7-8-9 (le beat 6 est désormais le BLOC ci-dessus, plus sur la carte).
const Beats789Map: React.FC = () => {
  const frame = useCurrentFrame();

  // Halos de partition persistants (socle). RSF ouest LARGE (territoire étendu) / SAF est resserré.
  // La carte n'apparaît qu'au morphing (~B6_END) ; on monte les halos dès le début de son fondu.
  const enter = interpolate(frame, [B6_END - XFADE, B6_END + 10], [0, 1], clamp);
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

  // ── FRONT (beats 7-8) : le front TIENT, micro-oscillation vectorielle. Beat 8 = quasi-figé (~1px).
  //   La poussée/impasse du rapport de force est racontée dans le BLOC (beat 6) ; ici le front est juste
  //   la ligne de contact qui frémit à peine puis se fige (« le front bouge à peine »). PAS de percée. ──
  const frontCalm = interpolate(frame, [G.resultat, G.resultat + 60], [1, 0.16], clamp);   // se fige presque
  const frontAmpPx = Math.max(1, 2.5 * frontCalm + 1);
  // vibration : somme de 2 sinus (rapide + lent) pour un frémissement organique, jamais un glissement net
  const frontWobble = Math.sin(frame * 0.9) * 0.6 + Math.sin(frame * 0.31 + 1.3) * 0.4;
  const frontDx = frontWobble * frontAmpPx; // décalage horizontal (px écran) de la ligne, borné

  // ── FORCES FIGÉES (b8) : chaque camp TIENT sa position de part et d'autre du front, immobile =
  //   « une guerre que personne n'a pu gagner » (chacun reste de son côté, aucun progrès malgré l'immensité).
  //   Apparaît à G.arreter. Généraux (portraits) + soldats de chaque bord. (Remplace la mine d'or,
  //   prématurée ici : l'or est réservé à l'Acte 3 « suivre l'or ».) ──
  const forcesReveal = interpolate(frame, [G.resultat + 30, G.resultat + 70], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* audio joué par le conteneur Beats69Map (un seul flux) — pas ici. */}
      {/* SFX ponctuel : apparition des forces figées (chacun tient sa position, b8) */}
      <Sequence from={G.resultat + 30} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.35} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM3} zones={zones} highlights={HL3} showNationalBorder stateLineOpacity={0}>
        {(proj) => {
          const topP = proj([FRONT_LON, FRONT_LAT_TOP]);
          const botP = proj([FRONT_LON, FRONT_LAT_BOT]);
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
                <FrontLine top={topP} bot={botP} dx={frontDx} frame={frame} appear={G.geo} />
              )}

              {/* ── LIGNE DE RAVITAILLEMENT SAF (b7) : est -> front, s'amincit + pointillés s'espacent
                  + impulsions lumineuses qui circulent (flux logistique) + points de danger RSF ── */}
              {sFrom && sVia && sTo && supplyFade > 0.01 && (
                <SupplyLine from={sFrom} via={sVia} to={sTo} draw={supplyDraw} op={supplyFade}
                  frame={frame} dangerFrom={G.ravitailler} dangerTo={G.resultat} />
              )}

              {/* (Le rapport de force SAF chars/avions du beat 6 est raconté dans le BLOC plein cadre,
                  plus sur la carte — décision Aziz : concept = bloc, pas de sprites plaqués géo.) */}

              {/* ── FORCES FIGÉES (b8) : chaque camp tient sa position de part et d'autre du front.
                  Généraux (portraits) + soldats, immobiles = « personne n'a pu gagner ». ── */}
              {forcesReveal > 0.01 && (
                <>
                  {/* Hemedti + soldats RSF — OUEST du front (lon < 30) */}
                  {HELD_WEST.map((c, i) => {
                    const p = proj(c.at); if (!p) return null;
                    const appear = G.resultat + 30 + i * 8;
                    return c.gen
                      ? <MiniToken key={`w${i}`} pos={p} sprite="portrait-hemeti" border="#B14B3C" frame={frame} appear={appear} op={forcesReveal} big />
                      : <MiniToken key={`w${i}`} pos={p} sprite="portrait-rsf" border="#B14B3C" frame={frame} appear={appear} op={forcesReveal} />;
                  })}
                  {/* al-Burhan + soldats SAF — EST du front (lon > 30) */}
                  {HELD_EAST.map((c, i) => {
                    const p = proj(c.at); if (!p) return null;
                    const appear = G.resultat + 34 + i * 8;
                    return c.gen
                      ? <MiniToken key={`e${i}`} pos={p} sprite="portrait-burhan" border="#3E6E9E" frame={frame} appear={appear} op={forcesReveal} big />
                      : <MiniToken key={`e${i}`} pos={p} sprite="portrait-saf" border="#3E6E9E" frame={frame} appear={appear} op={forcesReveal} />;
                  })}
                </>
              )}
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* ── COMPTEUR KM (b7) : le chiffre qui frappe. Grimpe 0 -> 1000 km pendant le dézoom immensité.
          Overlay data-viz (un CHIFFRE, pas un sous-titre) — matérialise « mille kilomètres de pistes ». ── */}
      <KmCounter frame={frame} inAt={G.immense} countTo={G.ravitailler + 18} outAt={G.resultat + 10} />

      <WarmVignette />
    </AbsoluteFill>
  );
};

// ── COMPTEUR KILOMÉTRIQUE (b7) : plaque data-viz ancrée en bas, compteur qui grimpe à 1000 km. ──
const KmCounter: React.FC<{ frame: number; inAt: number; countTo: number; outAt: number }> =
  ({ frame, inAt, countTo, outAt }) => {
    const op = interpolate(frame, [inAt, inAt + 16, outAt, outAt + 22], [0, 1, 1, 0], clamp);
    if (op <= 0.01) return null;
    const n = Math.round(interpolate(frame, [inAt + 8, countTo], [0, 1000], clamp) / 10) * 10; // pas de 10
    const rise = interpolate(frame, [inAt, inAt + 18], [24, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    // barre de progression qui se remplit avec le compteur
    const barFill = interpolate(frame, [inAt + 8, countTo], [0, 1], clamp);
    return (
      <div style={{ position: "absolute", left: "50%", bottom: 92,
        transform: `translate(-50%, ${rise}px)`, opacity: op, pointerEvents: "none",
        fontFamily: "Georgia, serif", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 68, fontWeight: 800, color: "#F4E3B0", letterSpacing: -1,
            textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>{n.toLocaleString("fr-FR")}</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: "#C9A968",
            textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>KM</span>
        </div>
        <div style={{ fontSize: 15, letterSpacing: 3, color: "#E0CDA0", textTransform: "uppercase",
          marginTop: 2, textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>de pistes à ravitailler</div>
        {/* barre de progression (data-viz) */}
        <div style={{ width: 340, height: 4, background: "rgba(233,196,106,0.22)", borderRadius: 3,
          margin: "10px auto 0", overflow: "hidden" }}>
          <div style={{ width: `${barFill * 100}%`, height: "100%", background: "#E9C46A", borderRadius: 3 }} />
        </div>
      </div>
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
//   à mesure qu'on s'éloigne (la logistique qui s'épuise). Tracée en 3 segments dégressifs.
//   PAR-DESSUS : impulsions lumineuses qui coulent est->ouest (flux logistique vivant) + points de
//   danger RSF qui clignotent sur la moitié ouest (là où la ligne s'amincit = zone harcelée). ──
const SupplyLine: React.FC<{
  from: Pt; via: Pt; to: Pt; draw: number; op: number;
  frame: number; dangerFrom: number; dangerTo: number;
}> = ({ from, via, to, draw, op, frame, dangerFrom, dangerTo }) => {
    // point milieu du dernier segment (le path polyligne réel = from -> via -> midVT -> to)
    const midVT = mid(via, to, 0.5);
    // 3 segments le long du chemin from->via->to, du plus épais/dense (est) au plus fin/espacé (ouest)
    const segs = [
      { a: from, b: via, w: 3.4, dash: "12 8", part: 0.5 },   // est : gros, dense
      { a: via, b: midVT, w: 2.2, dash: "9 13", part: 0.28 },
      { a: midVT, b: to, w: 1.2, dash: "5 18", part: 0.22 }, // front : fin, espacé (s'épuise)
    ];
    // draw-in cumulatif : on remplit les segments dans l'ordre est->ouest
    let acc = 0;

    // ── position le long du path (t 0=est/from, 1=ouest/front/to) sur la polyligne réelle,
    //   parts alignées sur les 3 segments (0.5 / 0.28 / 0.22) ──
    const pathAt = (t: number): Pt => {
      const tc = Math.min(1, Math.max(0, t));
      if (tc <= 0.5) return mid(from, via, tc / 0.5);
      if (tc <= 0.78) return mid(via, midVT, (tc - 0.5) / 0.28);
      return mid(midVT, to, (tc - 0.78) / 0.22);
    };

    // ── IMPULSIONS LUMINEUSES : 4 pastilles décalées qui glissent est->ouest en boucle (frame-driven).
    //   Chacune n'est visible que jusqu'à la position déjà tracée (draw). Traits larges à faible
    //   opacité = glow sans filter:blur (headless-safe). ──
    const PULSES = 4;
    const SPEED = 62;   // frames pour parcourir tout le path
    const pulses = Array.from({ length: PULSES }, (_, k) => {
      const phase = ((frame / SPEED) + k / PULSES) % 1;   // 0->1 en boucle, décalées
      return { t: phase, p: pathAt(phase) };
    });

    // ── DANGERS RSF : 4 marqueurs répartis sur TOUTE la longueur de la piste (est->ouest, t 0.22..0.85)
    //   = le harcèlement le long des 1000 km, pas seulement près du front. Apparition progressive
    //   pendant le beat 7 (dangerFrom->dangerTo), clignotement déterministe (Math.sin de i). ──
    const dangers = [0.22, 0.45, 0.65, 0.85].map((t, i) => {
      const p = pathAt(t);
      const revealAt = interpolate(frame, [dangerFrom + i * 22, dangerFrom + i * 22 + 20], [0, 1], clamp);
      // clignotement : phase désynchronisée par item (déterministe, pas de random)
      const blink = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.14 + i * 12.9898));
      return { p, op: revealAt * blink, tracedOk: draw >= t - 0.04 };
    });

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

        {/* ── IMPULSIONS LUMINEUSES (flux logistique) : glow doux + coeur clair, screen ── */}
        {pulses.map((pu, i) => {
          if (pu.t > draw + 0.02) return null; // pas au-delà de la portion tracée
          // fondu aux extrémités du parcours (naissance à l'est, extinction à l'ouest/front)
          const edge = Math.min(1, pu.t / 0.08, (1 - pu.t) / 0.14);
          const a = op * Math.max(0, edge);
          if (a <= 0.02) return null;
          return (
            <g key={`p${i}`} style={{ mixBlendMode: "screen" }}>
              {/* halo diffus (trait large faible opacité, headless-safe) */}
              <circle cx={pu.p.x} cy={pu.p.y} r={9} fill="#5b86ad" fillOpacity={a * 0.28} />
              <circle cx={pu.p.x} cy={pu.p.y} r={5} fill="#9dc0e0" fillOpacity={a * 0.55} />
              {/* coeur clair */}
              <circle cx={pu.p.x} cy={pu.p.y} r={2.4} fill="#cfe0f2" fillOpacity={a * 0.95} />
            </g>
          );
        })}

        {/* ── DANGERS RSF (croix/cible qui clignote) : pourquoi la logistique échoue ── */}
        {dangers.map((d, i) => {
          if (!d.tracedOk || d.op <= 0.02) return null;
          const R = 8.5;
          return (
            <g key={`d${i}`}>
              {/* halo d'alerte diffus */}
              <circle cx={d.p.x} cy={d.p.y} r={R + 5} fill="#B14B3C" fillOpacity={d.op * 0.18} />
              {/* anneau de cible */}
              <circle cx={d.p.x} cy={d.p.y} r={R} fill="none" stroke="#B14B3C"
                strokeWidth={1.8} strokeOpacity={d.op} />
              {/* croix de visée (harcèlement RSF sur la piste) */}
              <line x1={d.p.x - R} y1={d.p.y} x2={d.p.x + R} y2={d.p.y}
                stroke="#d1583f" strokeWidth={1.6} strokeOpacity={d.op} strokeLinecap="round" />
              <line x1={d.p.x} y1={d.p.y - R} x2={d.p.x} y2={d.p.y + R}
                stroke="#d1583f" strokeWidth={1.6} strokeOpacity={d.op} strokeLinecap="round" />
              {/* coeur rouge vif */}
              <circle cx={d.p.x} cy={d.p.y} r={2.2} fill="#e05a3f" fillOpacity={d.op} />
            </g>
          );
        })}

        {/* pastille source (base arrière est) */}
        <circle cx={from.x} cy={from.y} r={4.5} fill="#3E6E9E" fillOpacity={op * 0.9} />
      </svg>
    );
  };

const mid = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

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

// ── MINI-TOKEN : jeton-visage soldat rond PETIT (logique SoloBig réduite : rond, bordure, ombre,
//   spring d'apparition puis scale FIGÉ). Aucun scale oscillant continu. ──
const MiniToken: React.FC<{ pos: Pt; sprite: string; border: string; frame: number; appear: number; op: number; big?: boolean }> =
  ({ pos, sprite, border, frame, appear, op, big }) => {
    const D = big ? 72 : 46;   // général = plus grand que les soldats
    // spring d'apparition (overshoot léger) puis figé
    const ap = interpolate(frame, [appear, appear + 11, appear + 20], [0, 1.14, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    if (op <= 0.01) return null;
    const CREAM = "#F2E5C8";
    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-50%) scale(${ap})`, opacity: op, pointerEvents: "none" }}>
        {/* ombre portée douce */}
        <div style={{ position: "absolute", left: "50%", top: "70%", width: D * 0.86, height: D * 0.22,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(5px)" }} />
        <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: CREAM,
          border: `${D * 0.06}px solid ${border}`, boxSizing: "border-box",
          boxShadow: "0 3px 9px rgba(0,0,0,0.5)" }}>
          <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
            style={{ position: "absolute", top: "50%", left: "50%", width: "116%", height: "116%",
              transform: "translate(-50%,-48%)", objectFit: "cover", objectPosition: "top center", display: "block" }} />
        </div>
      </div>
    );
  };

// ── MINI-SPRITE : matériel raster carré (technical/char), spring d'apparition + FIGÉ, ombre portée douce.
//   Sprites 1024² -> rendu carré. Aucun scale oscillant continu. ──
const MiniSprite: React.FC<{ pos: Pt; sprite: string; frame: number; appear: number; op: number; w?: number }> =
  ({ pos, sprite, frame, appear, op, w = 70 }) => {
    const ap = interpolate(frame, [appear, appear + 12, appear + 22], [0, 1.1, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    if (op <= 0.01) return null;
    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-54%) scale(${ap})`, opacity: op, pointerEvents: "none" }}>
        {/* ombre portée douce au sol */}
        <div style={{ position: "absolute", left: "50%", top: "82%", width: w * 0.8, height: w * 0.2,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.38)", borderRadius: "50%", filter: "blur(6px)" }} />
        <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
          style={{ width: w, height: w, display: "block", objectFit: "contain",
            filter: "drop-shadow(0 4px 7px rgba(0,0,0,0.45))" }} />
      </div>
    );
  };

// ── GENERAL FORCES : pose un groupe MIXTE (soldats + matériel) en ÉVENTAIL autour d'un général.
//   Chaque item apparaît en stagger (delay) avec fade+spring, PERSISTE ensuite. Ancrage géo (proj)
//   par item -> repositionné à chaque frame avec la caméra (comme le reste des overlays). ──
const GeneralForces: React.FC<{
  proj: (c: [number, number]) => Pt | null; center: [number, number]; items: ForceItem[];
  faction: "rsf" | "saf"; border: string; frame: number; startAt: number;
}> = ({ proj, center, items, faction, border, frame, startAt }) => {
  const tokenSprite = faction === "rsf" ? "portrait-rsf" : "portrait-saf";
  const matSprite = faction === "rsf" ? "tech-td-red" : "tank-td-blue";
  return (
    <>
      {items.map((it, i) => {
        const p = proj([center[0] + it.dlon, center[1] + it.dlat]);
        if (!p) return null;
        const appear = startAt + it.delay;
        // fade doux d'apparition, puis persiste (reste à 1 jusqu'à la fin de la section)
        const op = interpolate(frame, [appear, appear + 16], [0, 1], clamp);
        if (op <= 0.01) return null;
        return it.kind === "token" ? (
          <MiniToken key={`f${i}`} pos={p} sprite={tokenSprite} border={border}
            frame={frame} appear={appear} op={op} />
        ) : (
          <MiniSprite key={`f${i}`} pos={p} sprite={matSprite}
            frame={frame} appear={appear} op={op} w={70} />
        );
      })}
    </>
  );
};

export default SoudanActe2;
