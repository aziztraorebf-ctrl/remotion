/**
 * HeroGptAnimee — "SUIVRE L'OR" du Darfour, version HERO EPUREE CONCRETE, GPT-5.5, anime en JSX.
 *
 * R&D SVG-SCENES-GENERATIVES — leçon clé (2026-06-22) : la force du SVG n'est PAS le detail (Seedance
 * ferait mieux), c'est le CONTROLE TOTAL de 3-4 elements LISIBLES qui RACONTENT + le pilotage COULEUR.
 * Reference : la piece Senegal Face A (derrick pompe / bateau part / ocean noircit). Ici scene CONCRETE :
 * vraie terre + lingots d'or poses + pelle plantee + nuages + lueur de guerre.
 *
 * PHRASE NARRATIVE : "Cet or sort de la terre du Darfour... et il finance la guerre."
 *
 * ⭐ DOCTRINE 2 COUCHES + nuances tranchees avec Aziz :
 *   COUCHE DE FOND (permanente) : nuages defilent EN BOUCLE (jamais hors cadre), fumee de guerre ondule,
 *     leger drift camera. La scene respire.
 *   COUCHE D'EVENEMENTS (se construit, regle ~5s) :
 *     ~f0-50   la PELLE apparait (fade + plant)
 *     ~f50-110 le LINGOT-OR (heros) apparait + un REFLET balaye sa face (brille)        + node-appear
 *     ~f110+   le lingot LUIT en continu (l'or vit)
 *     ~f180    la LUEUR DE GUERRE monte + rougeoie a l'horizon                           + boom-coup
 *     ~f210    la TERRE VIRE AU ROUGE SANG + le ciel rougeoie (le sens cle)              (pas noir : rouge=guerre)
 *     ~f330    le LINGOT-MOBILE DISPARAIT par FADE pur (l'or s'en va)                    + arrow-whoosh
 *
 * ⛔ REGLE OBJET INERTE (Aziz 2026-06-22) : un objet qui ne se deplace pas dans la vraie vie (lingot,
 *   coffre, pierre, batiment) NE GLISSE PAS — pas de translation, ca fait faux ("il n'a pas de jambes").
 *   Il disparait par FADE / change de couleur / s'illumine. SEULS les objets concus pour bouger (navire,
 *   avion, voiture, char) peuvent glisser de maniere credible. Donc le lingot qui part = FADE pur, sur place.
 *   La pelle et le lingot pose restent IMMOBILES (contraste fixe/vivant). La terre ne "vague" pas (solide) :
 *   elle CHANGE DE COULEUR. Le mouvement va aux nuages/fumee ; la transfo va a la couleur.
 *
 * Technique : groupes injectes en innerHTML dans des <g> WRAPPER JSX (animables). Overlays (reflet, rouge
 * sang) poses en JSX par-dessus, clippes sur la zone concernee.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from "remotion";
import {
  H_FOND, H_CIEL, H_NUAGES, H_TERRE, H_OMBRE_LINGOT,
  H_PELLE, H_LINGOT_OR, H_LINGOT_MOBILE, H_VIGNETTE,
} from "./heroGptGroups";

// fond clair (palette JOUR) — sous le SVG, au cas ou un pixel transparent
const TERRE = "#f4d98f";

const Grp: React.FC<{ body: string; transform?: string; opacity?: number }> = ({ body, transform, opacity }) => (
  <g transform={transform} opacity={opacity} dangerouslySetInnerHTML={{ __html: body }} />
);

export const HeroGptAnimee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- COUCHE DE FOND (permanente) ----------
  // leger drift camera (l'air qui ondule, jamais brusque)
  const driftScale = interpolate(f, [0, 420], [1.0, 1.04]);
  const driftX = Math.sin(f / 100) * 7;

  // nuages : defilent en BOUCLE INTERNE (jamais hors cadre). 3 copies decalees de la largeur de boucle
  // -> une copie entre toujours quand une sort -> continuite, pas de trou ni de sortie d'image.
  // PLUS VIVACE (Aziz) : vitesse augmentee.
  const cloudSpan = 760;
  const cloudShift = -((f * 0.95) % cloudSpan);

  // ---------- FUMEE DE GUERRE — REECRITE A LA MAIN (test : Claude corrige le SVG, zero appel API) ----------
  // GPT avait fait un blob en "S" illisible. Vraie fumee = bouffees rondes EMPILEES qui montent + s'elargissent
  // + ondulent + s'estompent en haut. Source ardente a la base (l'incendie lointain).
  // Apparait quand la guerre "monte" (f180+), s'intensifie avec la bascule rouge.
  const smokeOn = interpolate(f, [180, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // la colonne GRANDIT : au depart elle monte peu, puis elle s'eleve jusqu'en HAUT du cadre (envahit le ciel).
  const smokeReach = interpolate(f, [200, 320], [240, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // chaque bouffee : monte en boucle le long de la colonne, grossit et s'efface en montant. 18 bouffees (colonne dense).
  const SMOKE_BASE = { x: 1430, y: 700 }; // a l'horizon, cote droit (la ou GPT l'avait)
  const puffs = Array.from({ length: 18 }, (_, i) => {
    const cycle = ((f / 110) + i / 18) % 1;          // 0 (base) -> 1 (haut), decale par bouffee
    const rise = cycle * smokeReach;                  // hauteur de montee (grandit avec smokeReach)
    const sway = Math.sin(cycle * Math.PI * 2 + i) * (14 + cycle * 40); // ondulation, plus ample en haut
    const r = 16 + cycle * 64;                         // grossit en montant (colonne qui s'evase)
    const op = Math.sin(Math.max(0.001, cycle) * Math.PI) * 0.92 * smokeOn; // 0 base, max milieu, 0 haut
    return { cx: SMOKE_BASE.x + sway, cy: SMOKE_BASE.y - rise, r, op };
  });
  // le ciel se NOIRCIT par le HAUT une fois que la fumee l'a atteint (apres le rouge). f270+. Marque (envahit tout).
  const skyBlacken = interpolate(f, [270, 430], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---------- COUCHE D'EVENEMENTS ----------
  // helper : spring "tomber sec" — chute VISIBLE (~16f) puis rebond net a l'arrivee.
  // damping plus bas + stiffness moderee = on VOIT tomber, et ca rebondit a l'impact.
  const dropSpring = (startF: number) =>
    spring({ frame: f - startF, fps, config: { mass: 1.0, damping: 12, stiffness: 90 }, durationInFrames: 34 });

  // f10 : la PELLE est PLANTEE d'un coup (chute visible du haut + rebond). landF ~ f10+16.
  const pelleDrop = dropSpring(10);
  const pelleVisible = f >= 10;
  const pelleY = interpolate(pelleDrop, [0, 1], [-240, 0]);
  const pelleLandF = 26; // ~ frame d'impact (depart 10 + ~16 de chute)
  const plantDust = interpolate(f, [pelleLandF, pelleLandF + 8, pelleLandF + 20], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // f70 : le LINGOT HEROS TOMBE SEC (chute visible + ecrasement a l'impact). landF ~ f86.
  const lingotDrop = dropSpring(70);
  const lingotVisible = f >= 70;
  const lingotDY = interpolate(lingotDrop, [0, 1], [-300, 0]);
  const lingotLandF = 86;
  const lingotSquash = 1 - Math.max(0, interpolate(f, [lingotLandF, lingotLandF + 5, lingotLandF + 13], [0, 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lingotDust = interpolate(f, [lingotLandF, lingotLandF + 8, lingotLandF + 22], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // reflet : balaye APRES l'atterrissage
  const reflTravel = interpolate(f, [104, 158], [700, 1280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reflOn = interpolate(f, [104, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(f, [148, 164], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // fade final du GROS lingot (f450, apres le pic du ciel noir) — les deux ors s'en vont, seule la pelle reste.
  const lingotFadeOut = interpolate(f, [450, 510], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lingotGlow = (lingotVisible ? 1 : 0) * lingotFadeOut * (0.9 + 0.1 * (Math.sin(f / 17) + 1) / 2);

  // f120 : le PETIT lingot (mobile) TOMBE SEC a son tour (cascade). landF ~ f136. Avant : invisible.
  const mobileDrop = dropSpring(120);
  const mobileVisible = f >= 120;
  const mobileDY = interpolate(mobileDrop, [0, 1], [-280, 0]);

  // f210 : la TERRE vire au ROUGE SANG + le ciel rougeoie (overlay rouge en multiply, monte progressivement)
  const bloodTerre = interpolate(f, [210, 300], [0, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bloodCiel = interpolate(f, [210, 300], [0, 0.30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // f440 : le lingot-mobile DISPARAIT par FADE PUR (objet inerte = jamais de translation). "L'or s'en va".
  const slideOp = interpolate(f, [440, 500], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: TERRE }}>
      {/* ===== AUDIO timé ===== */}
      <Sequence from={0} durationInFrames={520}>
        <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.34} loop />
      </Sequence>
      {/* impact SEC du plant de la pelle (~f30, a l'atterrissage) */}
      <Sequence from={30} durationInFrames={22}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.55} />
      </Sequence>
      {/* impact SEC du lingot qui tombe (~f88) + tintement d'or */}
      <Sequence from={86} durationInFrames={22}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.52} />
      </Sequence>
      <Sequence from={90} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.50} />
      </Sequence>
      {/* impact SEC du petit lingot (cascade, ~f136) */}
      <Sequence from={134} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.46} />
      </Sequence>
      {/* lueur de guerre qui monte (~f180) */}
      <Sequence from={180} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/warmap/boom-coup.mp3")} volume={0.55} />
      </Sequence>
      {/* le ciel se noircit / la fumee envahit (~f270) — grondement sourd qui monte */}
      <Sequence from={270} durationInFrames={50}>
        <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.5} />
      </Sequence>
      {/* le lingot s'en va (fade, ~f440) */}
      <Sequence from={440} durationInFrames={26}>
        <Audio src={staticFile("_shared/sfx/warmap/arrow-whoosh.mp3")} volume={0.48} />
      </Sequence>

      {/* ===== IMAGE ===== */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="lingotClip"><rect x="730" y="535" width="500" height="235" /></clipPath>
          {/* degrade pour le ciel qui noircit PAR LE HAUT (opaque en haut -> transparent vers l'horizon) */}
          <linearGradient id="skyBlackGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0805" stopOpacity="1" />
            <stop offset="55%" stopColor="#1a130c" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2a1a0d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform={`translate(${driftX} 0) scale(${driftScale}) translate(${(1 - driftScale) * 960} ${(1 - driftScale) * 540})`}>

          {/* FOND */}
          <Grp body={H_FOND} />

          {/* CIEL */}
          <Grp body={H_CIEL} />
          {/* ciel qui rougeoie (overlay haut) */}
          <rect x="0" y="0" width="1920" height="760" fill="#c23a1e" opacity={bloodCiel} style={{ mixBlendMode: "multiply" }} />

          {/* NUAGES — defilent en boucle interne (3 copies, jamais hors cadre) */}
          <g>
            <Grp body={H_NUAGES} transform={`translate(${cloudShift} 0)`} />
            <Grp body={H_NUAGES} transform={`translate(${cloudShift + cloudSpan} 0)`} />
            <Grp body={H_NUAGES} transform={`translate(${cloudShift + cloudSpan * 2} 0)`} />
          </g>

          {/* FUMEE DE GUERRE — REECRITE A LA MAIN (Claude edite le SVG, zero appel API). Vraie colonne de
              fumee : base ardente + bouffees rondes empilees qui montent, grossissent, ondulent, s'estompent. */}
          {smokeOn > 0.02 && (
            <g>
              {/* lueur ardente a la base (l'incendie) */}
              <ellipse cx={SMOKE_BASE.x} cy={SMOKE_BASE.y + 6} rx={70} ry={20} fill="#d6552e" opacity={0.5 * smokeOn} />
              <ellipse cx={SMOKE_BASE.x} cy={SMOKE_BASE.y} rx={42} ry={14} fill="#ffb060" opacity={0.55 * smokeOn} />
              {/* bouffees de fumee (de la base vers le haut) — dessinees du haut vers le bas pour le bon empilage */}
              {puffs.slice().reverse().map((p, i) => (
                <g key={i}>
                  <circle cx={p.cx} cy={p.cy} r={p.r} fill="#3a2c20" opacity={p.op * 0.85} />
                  <circle cx={p.cx - p.r * 0.3} cy={p.cy - p.r * 0.15} r={p.r * 0.7} fill="#54433a" opacity={p.op * 0.7} />
                  <circle cx={p.cx + p.r * 0.25} cy={p.cy + p.r * 0.1} r={p.r * 0.55} fill="#2a2018" opacity={p.op * 0.6} />
                </g>
              ))}
            </g>
          )}

          {/* LE CIEL SE NOIRCIT PAR LE HAUT (apres le rouge) — la fumee envahit tout. Gradient haut->horizon. */}
          {skyBlacken > 0.01 && (
            <rect x="0" y="0" width="1920" height="640" fill="url(#skyBlackGrad)" opacity={skyBlacken} />
          )}

          {/* TERRE — immobile, mais VIRE AU ROUGE SANG (overlay multiply sur la zone terre) */}
          <Grp body={H_TERRE} />
          <rect x="0" y="600" width="1920" height="480" fill="#8a2a12" opacity={bloodTerre} style={{ mixBlendMode: "multiply" }} />

          {/* OMBRES portees (stables) */}
          <Grp body={H_OMBRE_LINGOT} />

          {/* PELLE — TOMBE SEC (plantee d'un coup, rebond spring), puis IMMOBILE */}
          {pelleVisible && (
            <Grp body={H_PELLE} transform={`translate(0 ${pelleY})`} />
          )}
          {/* poussiere d'impact au plant de la pelle (~ base de la pelle x603 y690) */}
          {plantDust > 0.02 && (
            <g opacity={plantDust}>
              <ellipse cx="603" cy="700" rx={40 + (1 - plantDust) * 30} ry="9" fill="#cf9a58" opacity="0.6" />
              <ellipse cx="560" cy="694" rx="14" ry="7" fill="#dcab68" opacity="0.5" />
              <ellipse cx="648" cy="696" rx="14" ry="7" fill="#dcab68" opacity="0.5" />
            </g>
          )}

          {/* poussiere d'impact du gros lingot (~base du lingot-or y~700) */}
          {lingotDust > 0.02 && (
            <g opacity={lingotDust}>
              <ellipse cx="990" cy="700" rx={70 + (1 - lingotDust) * 40} ry="11" fill="#cf9a58" opacity="0.55" />
            </g>
          )}
          {/* LINGOT HEROS — TOMBE SEC en place (rebond + ecrasement a l'impact), luit, + reflet qui balaye */}
          {lingotVisible && (
            <g opacity={lingotGlow} transform={`translate(0 ${lingotDY}) translate(0 ${986 * (1 - lingotSquash)}) scale(1 ${lingotSquash})`}>
              <Grp body={H_LINGOT_OR} />
            </g>
          )}
          {/* reflet : bande claire diagonale qui traverse le lingot (clippee sur sa bbox) */}
          {reflOn > 0.02 && (
            <g clipPath="url(#lingotClip)">
              <rect x={reflTravel} y="500" width="60" height="300" fill="#ffffff" opacity={0.5 * reflOn}
                transform="skewX(-22)" style={{ mixBlendMode: "screen" }} />
            </g>
          )}

          {/* PETIT LINGOT (mobile) — TOMBE SEC a son tour (f120), puis DISPARAIT par FADE PUR (f330) */}
          {mobileVisible && (
            <Grp body={H_LINGOT_MOBILE} transform={`translate(0 ${mobileDY})`} opacity={slideOp} />
          )}

          {/* VIGNETTE */}
          <Grp body={H_VIGNETTE} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default HeroGptAnimee;
