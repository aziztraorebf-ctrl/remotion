/**
 * PremiumCard3D — carte glossy + objet 3D + halo rotatif + titre glow
 *
 * MOTEUR: objet/metaphore SVG + 3D Three.js (registre "objet isole")
 *
 * Reverse engineering du workflow CapCut de Danny Why (video du 2026-08-21,
 * "Claude Code Just Changed CapCut Forever"), refait en Remotion deterministe.
 *
 * CE QU'IL FAIT EN 28 MIN DE CLICS MANUELS :
 *   fond degrade + carte coins arrondis + duplicata scale 102% + effet Glow x2
 *   + compound + masque en rotation (illusion du halo qui court) + cle 3D
 *   generee a part sur fond vert + chroma key + texte glow + stickers etoiles.
 *
 * CE QUE CETTE VERSION AJOUTE (les 3 plafonds de sa methode) :
 *   1. HORLOGE UNIQUE — la cle, le halo et le titre partagent useCurrentFrame().
 *      Sa cle tourne en boucle independante ; ici elle DECELERE quand le titre
 *      apparait (accent narratif impossible a faire dans son montage).
 *   2. PARAMETRABLE — tout est props. Changer brun->bleu, cle->cadenas, texte :
 *      une ligne. Chez lui : 28 min de clics a refaire.
 *   3. SORTIE ALPHA — rendu ProRes 4444 alpha (detourage exact) OU fond vert
 *      pour un client qui monte dans CapCut/Premiere. Lui n'a que le vert,
 *      avec les micro-franges du chroma key sur les aretes fines.
 *
 * Le halo : lui simule le mouvement avec un masque tournant sur un duplicata.
 * Ici c'est un vrai gradient conique anime — pas d'illusion, la lumiere
 * parcourt reellement le contour.
 */

import { ThreeCanvas } from "@remotion/three";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const PREMIUM_CARD_3D_FRAMES = 240; // 8s @ 30fps

// ---------------------------------------------------------------------------
// Props — tout ce que Danny Why doit refaire a la main est ici une valeur
// ---------------------------------------------------------------------------
export type PremiumCard3DProps = {
  /** Titre affiche sous l'objet 3D. Le mot accentue est colore + glow. */
  titleBefore?: string;
  titleAccent?: string;
  titleAfter?: string;
  /** Degrade de fond (3 stops, comme ses 3 boites de gradient CapCut). */
  bgStops?: [string, string, string];
  /** Degrade de la carte. */
  cardStops?: [string, string];
  /** Couleur du halo qui court sur le contour + du glow de l'accent. */
  accentColor?: string;
  /** "alpha" = fond transparent (ProRes 4444) · "green" = chroma key client
   *  · "gradient" = le fond degrade complet. */
  background?: "alpha" | "green" | "gradient";
};

const DEFAULTS = {
  titleBefore: "The ",
  titleAccent: "Key",
  titleAfter: " to Success",
  bgStops: ["#1a0f0a", "#2e1c10", "#4a2c18"] as [string, string, string],
  cardStops: ["#4d3018", "#25150b"] as [string, string],
  accentColor: "#f0b350",
  background: "gradient" as const,
};

// ---------------------------------------------------------------------------
// LA CLE 3D — geometrie procedurale, pas un GLB
//
// Le prompt de Danny Why demandait a Fable 5 une cle Three.js sur fond vert,
// rendue 8K puis downscalee en 4K. Sa cle est un asset MORT : elle tourne en
// boucle, indifferente au reste du montage.
//
// Ici la rotation est pilotee par la frame de la composition — elle peut donc
// reagir au titre. C'est toute la difference.
// ---------------------------------------------------------------------------
const Key3D: React.FC<{ rotationY: number; scale: number }> = ({
  rotationY,
  scale,
}) => {
  const GOLD = "#f5c65a";
  const gold = { color: GOLD, metalness: 0.85, roughness: 0.22, emissive: "#7a4d10", emissiveIntensity: 0.5 };

  return (
    <group position={[0, 0.42, 0]} rotation={[0, rotationY, 0.1]} scale={[scale, scale, scale]}>
      {/* Anneau (le panneton rond en haut) */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[0.54, 0.155, 28, 72]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      {/* Trois lobes decoratifs dans l'anneau */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.21, 1.5 + Math.sin(a) * 0.21, 0]}
          >
            <torusGeometry args={[0.12, 0.045, 14, 28]} />
            <meshStandardMaterial {...gold} />
          </mesh>
        );
      })}

      {/* Collerette sous l'anneau */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.12, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      {/* Tige principale */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 1.75, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      {/* Bague mediane */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.09, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      {/* Panneton (les dents, en bas) */}
      <mesh position={[0.17, -0.72, 0]}>
        <boxGeometry args={[0.38, 0.32, 0.12]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0.30, -0.95, 0]}>
        <boxGeometry args={[0.22, 0.24, 0.12]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, -0.98, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.22, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
};

const KeyLights: React.FC<{ frame: number; accent: string }> = ({
  frame,
  accent,
}) => {
  // Lumiere en orbite : fait courir un reflet sur le metal.
  // Le prompt de Danny Why demandait explicitement a la cle de NE PAS refleter
  // le vert du fond (green spill). Ici pas de fond a refleter : le probleme
  // qu'il devait ecrire dans son prompt n'existe simplement pas.
  const a = (frame / 150) * Math.PI * 2;
  return (
    <>
      <ambientLight color={0xfff2da} intensity={2.6} />
      <pointLight
        position={[Math.cos(a) * 4, 2.5, Math.sin(a) * 4 + 2]}
        color={accent}
        intensity={140}
        distance={30}
      />
      <pointLight position={[-3.5, -1, 5]} color={0xffd9a0} intensity={70} distance={26} />
      <pointLight position={[3, 3.5, 5]} color={0xfff0cc} intensity={55} distance={26} />
      <directionalLight position={[2, 5, 4]} intensity={3.2} color={0xfff6e8} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------
export const PremiumCard3D: React.FC<PremiumCard3DProps> = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- Timing partage (l'horloge unique) ---
  const CARD_IN = 8;
  const KEY_IN = 30;
  const TITLE_IN = 96;

  // Carte : entree spring depuis le bas
  const cardProg = spring({
    frame: frame - CARD_IN,
    fps,
    config: { damping: 16, stiffness: 85 },
    durationInFrames: 34,
  });
  const cardScale = interpolate(cardProg, [0, 1], [0.86, 1]);
  const cardY = interpolate(cardProg, [0, 1], [70, 0]);
  const cardOpacity = interpolate(frame, [CARD_IN, CARD_IN + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Halo : parcourt reellement le contour (pas un masque tournant sur un
  // duplicata comme dans CapCut). 2 tours sur la duree.
  const haloAngle = interpolate(frame, [0, PREMIUM_CARD_3D_FRAMES], [0, 720]);
  const haloOpacity = interpolate(frame, [CARD_IN + 6, CARD_IN + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cle : entree spring
  const keyProg = spring({
    frame: frame - KEY_IN,
    fps,
    config: { damping: 15, stiffness: 70 },
    durationInFrames: 40,
  });

  // ⭐ LE POINT CLE — la rotation DECELERE quand le titre apparait.
  // Chez Danny Why c'est impossible : sa cle est un fichier video importe,
  // qui tourne a vitesse constante sans rien savoir du reste du montage.
  //
  // ⚠️ Une cle n'est PAS lisible sous tous les angles : de face, l'anneau se
  // confond avec la tige et l'objet se lit comme un tournevis. Un tour complet
  // (ce que fait la cle de Danny Why) traverse donc 2 angles morts.
  // On oscille autour de l'angle 3/4 (le seul ou la cle se lit), avec une
  // amplitude qui se resserre a l'arrivee du titre.
  const READABLE = 0.85; // rad — 3/4 face, anneau + panneton bien detaches
  const swingIn = spring({
    frame: frame - KEY_IN,
    fps,
    config: { damping: 18, stiffness: 55 },
    durationInFrames: 46,
  });
  // Amplitude large avant le titre, resserree apres (l'objet "se pose")
  const amp = interpolate(frame, [KEY_IN, TITLE_IN, TITLE_IN + 60], [0.7, 0.55, 0.30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keyRotation =
    swingIn * READABLE + Math.sin((frame - KEY_IN) / 46) * amp;

  // Titre : apparait pile quand la cle se cale
  const titleProg = spring({
    frame: frame - TITLE_IN,
    fps,
    config: { damping: 18, stiffness: 78 },
    durationInFrames: 32,
  });
  const titleY = interpolate(titleProg, [0, 1], [24, 0]);

  // Le glow de l'accent pulse une fois a l'arrivee du titre, puis respire
  const accentPulse = interpolate(
    frame,
    [TITLE_IN, TITLE_IN + 12, TITLE_IN + 40],
    [0, 1, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const accentGlow = 14 + accentPulse * 30 + Math.sin(frame / 22) * 4;

  // Etoiles — scintillent en decale, calees sur l'arrivee du titre
  const stars = [
    { x: 0.30, y: 0.30, s: 15, d: 0 },
    { x: 0.70, y: 0.24, s: 21, d: 14 },
    { x: 0.76, y: 0.62, s: 13, d: 28 },
    { x: 0.25, y: 0.68, s: 17, d: 40 },
  ];

  const cardW = Math.round(width * 0.26);
  const cardH = Math.round(height * 0.62);

  const bgStyle: React.CSSProperties =
    p.background === "alpha"
      ? { backgroundColor: "transparent" }
      : p.background === "green"
        ? { backgroundColor: "#00FF00" }
        : {
            background: `linear-gradient(145deg, ${p.bgStops[0]} 0%, ${p.bgStops[1]} 52%, ${p.bgStops[2]} 100%)`,
          };

  return (
    <AbsoluteFill style={bgStyle}>
      {/* Lueur d'ambiance derriere la carte (absente si alpha/green : elle
          saliraie le detourage cote client) */}
      {p.background === "gradient" && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 45%, ${p.accentColor}22 0%, transparent 55%)`,
            opacity: cardOpacity,
          }}
        />
      )}

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            position: "relative",
            width: cardW,
            height: cardH,
            transform: `translateY(${cardY}px) scale(${cardScale})`,
            opacity: cardOpacity,
          }}
        >
          {/* HALO — gradient conique anime : la lumiere court sur le contour.
              Danny Why obtient l'illusion avec un masque qui tourne sur un
              duplicata agrandi a 102 %. Ici c'est le vrai geste. */}
          <div
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: 26,
              opacity: haloOpacity,
              background: `conic-gradient(from ${haloAngle}deg, transparent 0deg, ${p.accentColor} 42deg, #fff2d4 62deg, ${p.accentColor} 82deg, transparent 130deg, transparent 360deg)`,
              filter: "blur(7px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 24,
              opacity: haloOpacity * 0.95,
              background: `conic-gradient(from ${haloAngle}deg, transparent 0deg, ${p.accentColor} 46deg, #ffffff 62deg, ${p.accentColor} 78deg, transparent 126deg, transparent 360deg)`,
            }}
          />

          {/* La carte */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 23,
              background: `linear-gradient(160deg, ${p.cardStops[0]} 0%, ${p.cardStops[1]} 100%)`,
              boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
              overflow: "hidden",
            }}
          >
            {/* Reflet vitre en haut */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.13) 0%, transparent 42%)",
              }}
            />
          </div>

          {/* Etoiles */}
          {stars.map((st, i) => {
            const twinkle = interpolate(
              Math.sin((frame - TITLE_IN - st.d) / 13),
              [-1, 1],
              [0.15, 1]
            );
            const born = interpolate(
              frame,
              [TITLE_IN + st.d, TITLE_IN + st.d + 16],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <svg
                key={i}
                width={st.s}
                height={st.s}
                viewBox="0 0 24 24"
                style={{
                  position: "absolute",
                  left: `${st.x * 100}%`,
                  top: `${st.y * 100}%`,
                  opacity: born * twinkle,
                  transform: `translate(-50%,-50%) scale(${born})`,
                  filter: `drop-shadow(0 0 6px ${p.accentColor})`,
                }}
              >
                <path
                  d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
                  fill="#fff4dc"
                />
              </svg>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* LA CLE 3D — meme horloge que tout le reste */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <ThreeCanvas
          width={width}
          height={height}
          orthographic={false}
          camera={{ fov: 40, position: [0, 0, 10.5] }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <KeyLights frame={frame} accent={p.accentColor} />
          <Key3D rotationY={keyRotation} scale={keyProg * 0.92} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* TITRE */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: Math.round(height * 0.245),
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: Math.round(height * 0.040),
            color: "#fdf6e8",
            opacity: titleProg,
            transform: `translateY(${titleY}px)`,
            textShadow: "0 2px 18px rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
          }}
        >
          {p.titleBefore}
          <span
            style={{
              color: p.accentColor,
              textShadow: `0 0 ${accentGlow}px ${p.accentColor}, 0 0 ${accentGlow * 2.1}px ${p.accentColor}90`,
            }}
          >
            {p.titleAccent}
          </span>
          {p.titleAfter}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
