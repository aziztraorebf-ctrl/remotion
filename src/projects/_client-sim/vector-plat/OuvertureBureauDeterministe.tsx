// MOTEUR: objet/metaphore SVG (pilier 2) + motion design React (pilier 4)
//
// CHEMIN A du test "personnage vector plat" (reverse engineering ouverture Aikido).
// Le pari : dans le plan de reference, le personnage NE BOUGE PAS. Tout le mouvement est
// porte par des objets qui s'accumulent autour de lui (calendrier qui tourne, feuilles qui
// s'entassent, pile de documents qui monte). Si c'est vrai, une image fixe + une animation
// deterministe suffit -- pas besoin de video generee, et on reste dans le moat.
//
// Mesure de la reference (public/_shared/refs/benchmark-fiverr/02-aikido/, 2460x1080) :
//   2.5s -> 4.2s = duree reelle du personnage a l'ecran (~1.7s), sortie en whip pan flou.
//   Le calendrier passe MARCH 02 -> 04, les feuilles vont de 2 a 5, la pile grossit.
// On tient ici 5s pour laisser respirer, puis whip pan.
//
// Brique reutilisee : WhipPanWrapper/WhipPanBar de FlowdeskPersonne2B.tsx (spring 10f).

import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;

// Le plan tient 5s, puis 10 frames de whip pan qui le chasse.
const PLAN_FRAMES = 5 * FPS;
const WHIPPAN_DURATION = 10;
const WHIPPAN_START = PLAN_FRAMES - WHIPPAN_DURATION;

export const VECTOR_PLAT_FPS = FPS;
export const VECTOR_PLAT_FRAMES = PLAN_FRAMES;

// Palette relevee sur l'image de base (aplats Gemini) -- pas inventee.
const CREAM = "#F5EFE0";
const PAPER = "#FFFFFF";
const INK = "#3C4654";
const RED = "#C4453C";
const BLUE = "#4A78A8";
const SHADOW = "rgba(60, 70, 84, 0.13)";

// ---------------------------------------------------------------------------
// Le calendrier mural : il POSE (spring), puis ses pages tournent. C'est lui qui
// dit "le temps passe" -- le personnage, lui, ne bouge pas.
// ---------------------------------------------------------------------------
const CAL_X = 1618;  // zone murale libre mesuree : ecran x 1589..1949
const CAL_Y = 128;
const CAL_W = 190;
const CAL_H = 210;

// Les jours qui s'affichent, et la frame ou chacun apparait.
const JOURS: { day: string; at: number }[] = [
  { day: "02", at: 0 },
  { day: "03", at: 40 },
  { day: "04", at: 78 },
  { day: "05", at: 112 },
];

const CalendrierMural: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pose : le calendrier arrive en spring, il ne fade pas mollement.
  const pose = spring({
    frame,
    fps,
    config: { mass: 0.7, damping: 14, stiffness: 180 },
    durationInFrames: 14,
  });
  const scale = interpolate(pose, [0, 1], [0.82, 1]);
  const opacity = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });

  // Le jour courant = le dernier dont la frame d'apparition est passee.
  let idx = 0;
  for (let i = 0; i < JOURS.length; i++) {
    if (frame >= JOURS[i].at) idx = i;
  }
  const jour = JOURS[idx];

  // Micro-bascule de la page au moment ou elle change (le "flip", 5 frames).
  const sinceFlip = frame - jour.at;
  const flip =
    sinceFlip >= 0 && sinceFlip < 5
      ? interpolate(sinceFlip, [0, 5], [0, 1], { extrapolateRight: "clamp" })
      : 1;
  const flipScaleY = interpolate(flip, [0, 0.5, 1], [0.55, 1.04, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: CAL_X,
        top: CAL_Y,
        width: CAL_W,
        height: CAL_H,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center top",
      }}
    >
      {/* corps du calendrier */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: PAPER,
          borderRadius: 8,
          boxShadow: `0 6px 14px ${SHADOW}`,
        }}
      />
      {/* bandeau du mois */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 56,
          background: RED,
          borderRadius: "8px 8px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: PAPER,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: "0.16em",
        }}
      >
        MARS
      </div>
      {/* le quantieme, qui bascule a chaque changement de jour */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 56,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scaleY(${flipScaleY})`,
          transformOrigin: "center top",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: 96,
            color: INK,
            lineHeight: 1,
          }}
        >
          {jour.day}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Les feuilles qui s'accumulent en l'air a gauche. Chacune derive vers sa place
// et s'y arrete -- une feuille ne glisse pas indefiniment (regle "geste sans but").
// ---------------------------------------------------------------------------
type Feuille = { x: number; y: number; rot: number; at: number };

const FEUILLES: Feuille[] = [
  { x: 96, y: 132, rot: -9, at: 18 },
  { x: 282, y: 78, rot: 6, at: 30 },
  { x: 178, y: 288, rot: -3, at: 62 },
  { x: 372, y: 216, rot: 11, at: 88 },
  { x: 52, y: 350, rot: 4, at: 120 },
];

// Taille des feuilles : elles doivent OCCUPER le mur. En 116x148 elles se lisaient comme
// des post-it perdus dans le vide -- le clip H3 (meme scene) les fait bien plus grandes.
const FEUILLE_W = 168;
const FEUILLE_H = 214;

const FeuilleVolante: React.FC<{ f: Feuille }> = ({ f }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - f.at;
  if (local < 0) return null;

  const arrive = spring({
    frame: local,
    fps,
    config: { mass: 0.9, damping: 15, stiffness: 130 },
    durationInFrames: 20,
  });

  // Elle entre par le haut-gauche et se pose. Apres, elle ne bouge plus.
  const dx = interpolate(arrive, [0, 1], [-160, 0]);
  const dy = interpolate(arrive, [0, 1], [-120, 0]);
  const opacity = interpolate(local, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const rot = interpolate(arrive, [0, 1], [f.rot - 14, f.rot]);

  return (
    <div
      style={{
        position: "absolute",
        left: f.x + dx,
        top: f.y + dy,
        width: FEUILLE_W,
        height: FEUILLE_H,
        opacity,
        transform: `rotate(${rot}deg)`,
        background: PAPER,
        borderRadius: 3,
        boxShadow: `0 5px 12px ${SHADOW}`,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {/* lignes de texte suggerees + un petit graphique : lisible en 1/10e de seconde */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 7,
            marginBottom: 10,
            width: i === 3 ? "62%" : "100%",
            background: "rgba(60, 70, 84, 0.24)",
            borderRadius: 2,
          }}
        />
      ))}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginTop: 16, height: 64 }}>
        {[38, 56, 26, 47].map((h, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: h,
              background: i % 2 === 0 ? BLUE : RED,
              opacity: 0.78,
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// La pile de documents sur le bureau : elle MONTE feuille par feuille.
// C'est le meme fait que les feuilles en l'air, dit une 2e fois -- Aikido fait
// pareil, et c'est ce qui rend l'accumulation credible plutot que decorative.
// ---------------------------------------------------------------------------
// ⛔⛔ CE QUI A REELLEMENT COUTE 3 RENDUS (diagnostic delegue, 2026-08-20) :
// ce n'etait PAS un probleme de referentiel `objectFit: cover`, c'etait une MESURE D'ENTREE
// FAUSSE. J'avais releve "plateau a src y=400" -- c'est le haut de l'ECRAN DU MONITEUR.
// Le plateau du bureau est a **src y=630** (verifie par scan de colonnes x=150/250/350 :
// une seule transition, (248,240,221) -> (211,199,175), identique sur les 3).
// La conversion, elle, etait juste depuis le debut -- d'ou 3 corrections de dosage inutiles.
// LECON : scanner les pixels pour trouver une coordonnee, et VERIFIER que la transition
// trouvee est bien l'objet vise, pas un autre bord horizontal de la scene.
//
// Conversion cover (1408x768 -> 1920x1080) : ecran_x = src_x * 1.4062 - 30 ; ecran_y = src_y * 1.4062.
// Note : 1080/768 = 1.40625 exactement = le scale cover, donc l'axe Y n'est PAS affecte par
// le cover (seul le X l'est, de -30px).
//
// ⛔ y=630 etait ENCORE faux (2e mesure fausse) : a x=250 il n'y a pas de bureau du tout,
// c'est la ligne mur/sol. Le plateau ne commence qu'a src x=351.
// MESURE FINALE, par recherche de la bande BLANCHE la plus large de l'image (pas par scan
// d'une colonne choisie a l'avance -- c'est ce choix qui a produit les 2 erreurs) :
//   plateau = src y 552..565, s'etendant de src x=351 a x=1307
//   => SURFACE : src y=552 -> ECRAN y=776 ; plateau ecran x 464..1808
// ⚠️ Le bureau est ENCOMBRE : le seul espace libre au-dessus du plateau (scan des colonnes
// sans pixel sombre entre src y 480..551) est src x 351..408 -> ECRAN x 464..544, soit
// 80px de large seulement. La pile doit tenir dedans, sinon elle chevauche un laptop.
const PILE_X = 468;
const EPAISSEUR = 16;
const PILE_BASE_Y = 776 - EPAISSEUR; // la 1re feuille POSEE sur la surface du plateau
const PILE_W = 76;
// 10 feuilles, pas 14 : a 14 la tour montait au-dessus de la ligne des laptops (sommet
// ecran y~605) et se lisait comme un gag, plus comme une charge de travail.
const PILE_NB = 10;

const PileDocuments: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Une feuille toutes les ~8 frames, jusqu'a 14 : il faut une vraie TOUR, pas un tas plat.
  // (Sur la reference Aikido comme sur le clip H3, la pile domine le bureau -- c'est elle
  // qui porte le "ca s'accumule", plus encore que les feuilles au mur.)
  const feuilles: number[] = [];
  for (let i = 0; i < PILE_NB; i++) {
    const at = 22 + i * 10;
    if (frame >= at) feuilles.push(at);
  }

  return (
    <div style={{ position: "absolute", left: PILE_X, top: 0, width: PILE_W, height: H }}>
      {feuilles.map((at, i) => {
        const local = frame - at;
        const pose = spring({
          frame: local,
          fps,
          config: { mass: 0.6, damping: 16, stiffness: 220 },
          durationInFrames: 10,
        });
        const y = PILE_BASE_Y - i * EPAISSEUR;
        const dy = interpolate(pose, [0, 1], [-38, 0]);
        const opacity = interpolate(local, [0, 5], [0, 1], { extrapolateRight: "clamp" });
        // Chaque feuille est legerement de travers : une pile parfaitement alignee
        // se lit comme un bloc, pas comme un empilement.
        const skew = ((i * 37) % 9) - 4;

        return (
          <div
            key={at}
            style={{
              position: "absolute",
              left: 0,
              top: y + dy,
              width: PILE_W,
              height: EPAISSEUR,
              background: PAPER,
              opacity,
              borderRadius: 2,
              transform: `rotate(${skew * 0.32}deg)`,
              // Liseré NET sous chaque feuille : sans lui, des ombres douces qui se recouvrent
              // donnent un aplat blanc uni -- on perd la lecture "empilement" (vu au 1er rendu).
              borderBottom: "2px solid rgba(60, 70, 84, 0.30)",
              boxShadow: `0 1px 0 rgba(60, 70, 84, 0.10)`,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Whip pan de sortie -- brique reprise de FlowdeskPersonne2B.
// ---------------------------------------------------------------------------
const WhipPanWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const springFrame = frame - WHIPPAN_START;

  const progress = spring({
    frame: springFrame,
    fps,
    config: { mass: 0.8, damping: 12, stiffness: 200 },
    durationInFrames: WHIPPAN_DURATION,
  });
  const clamped = Math.max(0, Math.min(1, progress));
  const translateX = springFrame >= 0 ? clamped * 2400 : 0;
  // Le flou de filé : c'est lui qui vend la vitesse, pas la translation seule.
  const blur = springFrame >= 0 ? interpolate(clamped, [0, 0.5, 1], [0, 14, 22]) : 0;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px)`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
export const OuvertureBureauDeterministe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <WhipPanWrapper>
        {/* Le decor + le personnage : une IMAGE FIXE. Il ne bouge jamais, par construction. */}
        <Img
          src={staticFile("_r-and-d/vector-plat/base-bureau.png")}
          style={{ width: W, height: H, objectFit: "cover" }}
        />
        <CalendrierMural />
        {FEUILLES.map((f, i) => (
          <FeuilleVolante key={i} f={f} />
        ))}
        <PileDocuments />
      </WhipPanWrapper>
    </AbsoluteFill>
  );
};
