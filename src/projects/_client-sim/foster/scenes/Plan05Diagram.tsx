// MOTEUR: diagramme circulaire + zoom traversant + globe
/**
 * FOSTER — PLAN 5 (13,59 -> 17,40 s) : LE SYSTEME, PUIS LA PLONGEE
 * ================================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * ⛔ LE TABLEAU DE DECOUPAGE ANNONCAIT « suite typo sur degrade vert ». FAUX sur
 * toute la ligne : ce plan est un DIAGRAMME CIRCULAIRE des acteurs du placement
 * familial, suivi d'un zoom traversant. Et le degrade est DORE, pas vert (le
 * vert appartenait au plan 3).
 *
 * ⭐ Premier plan produit avec le protocole ANALYSE/ANIMATION SEPAREE
 * (`scripts/tools/motion-breakdown.py`, 2 voix, 63 s) — sur proposition d'Aziz.
 * Ce que les modeles ont vu et que j'aurais rate :
 *   - le texte CHANGE DE COULEUR (« Foster » noir sur le cercle blanc, gris
 *     clair une fois le cercle disparu) — sinon il devient invisible ;
 *   - texte et cercle ont des VITESSES DIFFERENTES pendant le zoom (parallaxe) :
 *     le cercle sort du cadre, le texte reste centre. Ils ne sont pas solidaires ;
 *   - FONDU CROISE texte/globe, pas une coupe ;
 *   - les etiquettes NE TOURNENT PAS sur elles-memes : leur texte reste
 *     horizontal quelle que soit leur position sur l'orbite.
 * ⛔ Aucun des deux modeles n'a donne de VALEUR — tous les chiffres ci-dessous
 * viennent de mes mesures sur les frames.
 *
 * MESURES :
 *   Cercle blanc : 13 px a 13,59 s -> PIC A 245 px vers 13,95 -> se cale a 210.
 *                  C'est un spring avec OVERSHOOT, pas un simple grossissement.
 *   Orbite : ellipse centree (910,540), rayons 300 x 330.
 *   Etiquettes (apparition mesuree, intervalle regulier de 0,26 s) :
 *     FOSTER CARER 14,47 · COUNCILS & IFAS 14,73 · SOCIAL WORKER 14,99 · CHILD 15,25
 *   Zoom traversant : demarre ~15,93 s (le cercle passe de 210 a 336 px puis sort).
 *   Degrade dore + « FosterWith » en grand : 16,10 -> 16,80 s.
 *   Globe : apparait en fondu vers 17,40 s (borne de fin de ce plan).
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PLAN_START = 13.59;

const SFX = {
  pop: "_client-sim/noteshield/sfx/tone.mp3",
  swell: "_client-sim/noteshield/sfx/hit-weak.mp3",
} as const;
const SFX_VOL = 0.5;

const FONT =
  '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = '"SF Mono", ui-monospace, Menlo, Consolas, monospace';

/** Les 4 acteurs, positions et instants MESURES. */
const LABELS = [
  { txt: "FOSTER CARER", x: 822, y: 872, at: 14.47, green: true },
  { txt: "COUNCILS & IFAS", x: 1285, y: 683, at: 14.73, green: false },
  { txt: "SOCIAL WORKER", x: 1095, y: 222, at: 14.99, green: true },
  { txt: "CHILD", x: 630, y: 410, at: 15.25, green: false },
] as const;

/** Centre de l'orbite (decentre a gauche du cercle blanc) et ses rayons. */
const ORB = { cx: 910, cy: 540, rx: 300, ry: 330 };
/** Le cercle blanc : centre du cadre, diametre stabilise mesure. */
const DISC = { cx: 960, cy: 540, d: 210 };

/**
 * ⭐ FACTEUR D'ENSEMBLE (retour d'Aziz sur la v4) : « le logo devrait etre
 * beaucoup plus gros, et les ecritures tout autour agrandies aussi ».
 * On multiplie disque + orbite + etiquettes par le MEME facteur pour garder
 * les proportions relatives (verifiees justes au zoom : notre texte occupe
 * deja la bonne part du disque).
 */
const DIAG = 1.28;

export const Plan05Diagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tAbs = PLAN_START + frame / fps;
  const px = (v: number) => (v / 1920) * width;

  /**
   * LE ZOOM TRAVERSANT — la camera plonge dans le cercle blanc.
   * ⭐ Parallaxe MESUREE par les modeles : le cercle grandit BEAUCOUP plus vite
   * que le texte qu'il contient. Deux facteurs distincts, pas un seul.
   */
  const zoomDisc = interpolate(tAbs, [15.93, 16.6], [1, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  /* 4,6 -> 3,4 : MESURE du texte final, 40,8 % de la largeur du cadre chez nous
     contre 30,3 % dans la reference => facteur 0,74. */
  const zoomText = interpolate(tAbs, [15.93, 16.6], [1, 3.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  /** Le disque blanc : spring avec overshoot (13 -> 245 -> 210 px). */
  const grow = spring({
    frame: frame - Math.round(0.05 * fps),
    fps,
    config: { damping: 9, mass: 0.7, stiffness: 150 },
    durationInFrames: Math.round(0.75 * fps),
  });
  const discD = interpolate(grow, [0, 1], [13, DISC.d * DIAG]);

  /** L'orbite se deploie apres le disque. */
  const orbit = interpolate(tAbs, [14.05, 14.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /**
   * LE DEGRADE DORE — il monte du bas pendant le zoom. ⛔ DORE, pas vert.
   * Meme famille de profil que le vert du plan 3 : une bande dont le coeur est
   * bas dans le cadre.
   */
  const gold = interpolate(tAbs, [15.9, 16.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  /** Sortie du plan : fondu croise vers le globe (pas une coupe). */
  const fadeOut = interpolate(tAbs, [17.0, 17.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /**
   * ⭐ LE TEXTE CHANGE DE COULEUR — « Foster » est NOIR sur le disque blanc,
   * puis gris clair une fois le disque sorti du cadre. Sans ca, il devient
   * invisible sur le fond sombre (releve par Gemini).
   */
  const onWhite = interpolate(tAbs, [15.98, 16.18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  /* ⛔ Le disque doit s'eteindre PLUS TOT que les autres elements : etale par le
     zoom il couvre tout le cadre, et un reste d'opacite se lit comme un halo
     gris fantome au centre (constate au rendu v1 a 16,30 s). */
  const discFade = interpolate(tAbs, [15.95, 16.12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const g = Math.round(20 + 210 * (1 - onWhite));  // suit le disque
  const fosterColor = `rgb(${g},${g},${g})`;
  /** Taille du texte : petit dans le disque, grand apres le zoom. */
  const fontSize = px(34) * DIAG * zoomText;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      {/* SFX : une pulsation par etiquette, puis la montee du zoom. */}
      {LABELS.map((l) => (
        <Sequence
          key={l.txt}
          from={Math.round((l.at - PLAN_START) * fps)}
          durationInFrames={Math.round(0.3 * fps)}
        >
          <Audio src={staticFile(SFX.pop)} volume={SFX_VOL * 0.5} />
        </Sequence>
      ))}
      <Sequence
        from={Math.round((15.93 - PLAN_START) * fps)}
        durationInFrames={Math.round(1.0 * fps)}
      >
        <Audio src={staticFile(SFX.swell)} volume={SFX_VOL * 0.75} />
      </Sequence>

      {/* LE DEGRADE DORE — monte du bas pendant la plongee. */}
      <AbsoluteFill
        style={{
          /*
            ⛔⛔ 3 TENTATIVES sur ce degrade, et la lecon porte sur la MESURE :
            1. linear-gradient : bord horizontal NET, la reference est diffuse.
            2. radial-gradient centre : clair au CENTRE, sombre aux BORDS.
            3. ✅ linear tres etale : nappe qui couvre tout le bas.
            Le profil par BANDES HORIZONTALES donnait des valeurs quasi
            identiques (ecarts 1 a 15 sur 26..186) — il ne voit PAS la forme.
            C'est le profil par COLONNES qui a tranche :
                bande basse, canal rouge — REF : 199 (gauche) 149 (centre) 210 (droite)
                                           v3  :  77 (gauche) 147 (centre)  77 (droite)
            => la reference est plus lumineuse AUX BORDS qu'au centre : ce n'est
            pas un halo, c'est une NAPPE. Mesurer selon le BON axe.
          */
          background:
            "linear-gradient(180deg," +
            " rgba(0,0,0,0) 30%," +
            " rgba(58,36,8,0.22) 46%," +
            " rgba(132,86,16,0.46) 62%," +
            " rgba(198,134,28,0.70) 74%," +
            " rgba(232,168,48,0.86) 85%," +
            " rgba(246,190,74,0.95) 100%)",
          opacity: gold,
        }}
      />

      {/* L'ORBITE POINTILLEE — elle se deploie, puis subit le zoom comme le
          disque (elle appartient au meme plan de profondeur). */}
      <AbsoluteFill
        style={{
          opacity: orbit * onWhite,
          transform: `scale(${zoomDisc})`,
        }}
      >
        <svg width={width} height={height} style={{ position: "absolute" }}>
          <ellipse
            cx={px(ORB.cx)}
            cy={(ORB.cy / 1080) * height}
            rx={px(ORB.rx) * DIAG * orbit}
            ry={px(ORB.ry) * DIAG * orbit}
            fill="none"
            stroke="rgba(225,225,230,0.55)"
            strokeWidth={px(2)}
            strokeDasharray={`${px(9)} ${px(11)}`}
          />
        </svg>
      </AbsoluteFill>

      {/* LES ETIQUETTES — elles se posent une par une. ⭐ Elles ne tournent PAS
          sur elles-memes : leur texte reste horizontal (releve par Gemini). */}
      {LABELS.map((l) => {
        const local = frame - Math.round((l.at - PLAN_START) * fps);
        const s = spring({
          frame: local,
          fps,
          config: { damping: 13, mass: 0.5, stiffness: 160 },
          durationInFrames: Math.round(0.35 * fps),
        });
        return (
          <AbsoluteFill
            key={l.txt}
            style={{ opacity: onWhite, transform: `scale(${zoomDisc})` }}
          >
            <div
              style={{
                position: "absolute",
                /* Position dilatee autour du centre de l'orbite, pour suivre
                   l'agrandissement du cercle. */
                left: px(ORB.cx + (l.x - ORB.cx) * DIAG),
                top: ((ORB.cy + (l.y - ORB.cy) * DIAG) / 1080) * height,
                transform: `translate(-50%,-50%) scale(${s})`,
                background: l.green ? "#1d5c4f" : "#f0a83c",
                color: l.green ? "#eaf5f1" : "#2a1a05",
                fontFamily: MONO,
                fontSize: px(17) * DIAG,
                fontWeight: 600,
                letterSpacing: px(1.2) * DIAG,
                padding: `${px(9) * DIAG}px ${px(18) * DIAG}px`,
                borderRadius: px(24) * DIAG,
                whiteSpace: "nowrap",
                boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
              }}
            >
              {l.txt}
            </div>
          </AbsoluteFill>
        );
      })}

      {/* LE DISQUE BLANC — spring avec overshoot, puis il explose au zoom. */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            left: px(DISC.cx),
            top: (DISC.cy / 1080) * height,
            width: px(discD) * zoomDisc,
            height: px(discD) * zoomDisc,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: "#fff",
            opacity: discFade,
          }}
        />
      </AbsoluteFill>

      {/* LE MOT — au centre du disque, il grandit MOINS VITE que lui
          (parallaxe) et change de couleur quand le disque disparait. */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize,
            fontWeight: 600,
            letterSpacing: "-0.5px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: fosterColor }}>Foster</span>
          <span style={{ color: "#f0a83c" }}>With</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
