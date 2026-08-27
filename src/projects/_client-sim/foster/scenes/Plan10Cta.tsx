// MOTEUR: typo pure sur degrade vert — meme registre que le plan 3, monte vers le CTA
/**
 * FOSTER — PLAN 10 (28,07 -> 40,46 s) : LA MONTEE VERS LE CTA
 * ===========================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 * Le plus long des onze : 372 frames (12,4 s).
 *
 * ── LE RELEVE 3 VOIX (Gemini + GPT + Grok) ────────────────────────────────
 * Ce qu'EUX SEULS ont vu, et que je prends tel quel : les cinq phrases, leur
 * ordre, et trois details que Grok est le seul a relever —
 *   . « FosterWith » (a droite) est COLLE, sans espace, contrairement au
 *     « Foster With » de gauche ; le split de couleur tombe au milieu du mot ;
 *   . le « x » est plus petit que le texte courant ;
 *   . le logo fiverr reste visible sur le noir final (on ne le reproduit pas).
 * ⭐ Grok est de loin la voix la plus riche (10 331 car. contre 4 085 a Gemini).
 *
 * ⛔⛔ CE QUE LA MESURE CONTREDIT — les trois voix se sont trompees sur deux
 * points structurants, et coder d'apres elles aurait produit un faux plan :
 *
 * 1. « COUPES FRANCHES entre les phrases » (Grok en annonce cinq, Gemini
 *    parle de coupes) -> FAUX. La diff inter-frames PLAFONNE A 3,08 sur les
 *    372 frames (mesure frame par frame). Il n'y a AUCUNE coupe : ce sont des
 *    fondus doux. Une coupe franche donnerait un pic > 90, comme les vraies
 *    coupes mesurees aux plans 8 et 9 (94,3 et 150,5).
 *
 * 2. « Tout est centre a 50 % / 50 % » (Gemini ET GPT) -> FAUX. Chaque phrase
 *    a une ANCRE GAUCHE FIXE : pendant toute la construction de la phrase 1,
 *    x0 reste rigoureusement a 282 (mesure sur 30 frames, zero derive) alors
 *    que la phrase s'allonge de 99 a 1355 px. Les mots ne se recentrent pas.
 *    Si la phrase COMPLETE finit centree (959,5 pour un cadre de 1920), c'est
 *    que son ancre a ete CHOISIE pour ca — ce n'est pas un centrage a l'execution.
 *    ⚠️ Piege dans lequel je suis tombe en route : mesurer les seules frames
 *    FINALES montre 5 phrases centrees a 1 px pres, et suggere donc un
 *    `textAlign: center`. C'est la mesure PENDANT la construction qui tranche.
 *
 * 3. GPT dit « les mots apparaissent directement a leur position finale » :
 *    vrai pour les phrases 1, 2, 4, 5 — faux pour la 3, qui se recale de
 *    x0 = 719 a x0 = 602 entre les frames 134 et 149.
 *
 * ── LES ANCRES MESUREES (x0 en px, cadre 1920) ────────────────────────────
 *   P1  282   « Not just build for Carers and Social Workers »  (W final 1355)
 *   P2  719   « Built with them »                               (W final  475)
 *   P3  602   « Foster With » + la pile doree                   (W final  784)
 *   P4  579   « Foster With x FosterWith »                      (W final  760)
 *   P5  762   « Book a Demo »                                   (W final  393)
 *
 * ── LA PILE DOREE (le geste central) ──────────────────────────────────────
 * Interligne MESURE : 86 px (bande doree de y 508-573 a 422-486). La colonne
 * doree est ancree a x ~ 979 et ne bouge pas. Mecanique : le nouveau mot NAIT
 * sur la ligne de base, a droite de « With » ; les precedents MONTENT d'un cran.
 * ⭐ Le mot le plus ancien sort du dore (il grise) : on ne voit jamais trois
 * bandes dorees a la fois, ce qui se lit dans la mesure (a la frame 230, seules
 * deux bandes passent le seuil dore).
 *
 * Couleurs d'encre MESUREES au coeur des glyphes (decile le plus lumineux,
 * pour ne pas moyenner l'antialiasing) :
 *   dore vif (mot courant)   rgb(165,133,73)
 *   dore passe (precedent)   rgb(162,135,97)
 *   grise (le plus ancien)   rgb(102,97,92)
 *   blanc du texte courant   rgb(252,255,255)
 * Fond : degrade du quasi-noir rgb(15,15,15) en haut au vert rgb(19,64,44) en bas.
 *
 * ── RYTHME ────────────────────────────────────────────────────────────────
 * Un mot toutes les ~6 frames (0,2 s), regulier. Timings releves palier par
 * palier sur la largeur du bloc (un saut de x1 = un mot de plus).
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

/**
 * ⛔⛔ POURQUOI DEUX POLICES DANS LA MEME SCENE — la cause racine du plan 10.
 *
 * Le texte gras sortait 2 a 5 % TROP ETROIT, et trois corrections successives
 * (taille de police, duree du fondu, remplacement des marges par de vrais
 * espaces) n'ont pas bouge le chiffre d'un dixieme. Diagnostic delegue a un
 * agent dedie (protocole projet : 2 echecs sur le meme blocage = deleguer),
 * puis VERIFIE independamment ici.
 *
 * ✅ MESURE (largeur rendue de « Confidence » a 68 px, pile systeme) :
 *      400 -> 340 px · 500 -> 352 · 600 -> 363 · 700 -> 363 · 800 -> 363 · 900 -> 363
 * La pile `-apple-system / SF Pro Display / Helvetica Neue / Arial` se resout
 * aux faces DISCRETES de Helvetica Neue (Regular/Medium/Bold) : au-dela de 600,
 * Chromium n'a plus rien et SATURE. La cible etant 375 px, AUCUNE valeur de
 * `fontWeight` ne pouvait l'atteindre. Ce n'etait donc pas un dosage a trouver,
 * c'etait un plafond de la fonte — d'ou trois corrections sans effet.
 *
 * ⭐ Ce qui rendait le symptome illisible : l'ecart ne portait QUE sur les mots
 * gras (-2,77 %) et pas sur les clairs (-0,06 %). Les phrases « justes » l'etaient
 * par COMPENSATION (P1 melange 4 mots clairs exacts et 4 gras etroits, la moyenne
 * tombe juste ; P5 n'a aucun gras). Un seul parametre faux, mais applique a une
 * moitie du texte seulement : ca ressemblait a du desordre.
 *
 * ✅ LA SORTIE N'EST PAS DE COMPENSER (un letter-spacing sur les gras a ete
 * teste : il ramene l'ecart a -0,04 % en moyenne mais laisse une dispersion,
 * parce qu'il s'ajoute PAR CARACTERE alors que le manque est PROPORTIONNEL a la
 * largeur). On embarque une police dont l'axe de graisse ne sature pas :
 *      Inter @68px : 400 -> 360 · 500 -> 366 · 600 -> 371 · 700 -> 376 (cible 375)
 * ⚠️ Mais Inter en 400 est 5 % TROP LARGE sur le texte clair (« Foster » 191 vs
 * 181), alors que la pile systeme y est exacte. Basculer TOUTE la scene sur Inter
 * deplacerait donc le probleme au lieu de le resoudre.
 * => On garde la pile SYSTEME pour le clair, et Inter 700 UNIQUEMENT pour le gras,
 *    ou elle tombe a 1-2 px de la reference (« Built » 142/140, « Confidence » 376/375).
 */
const { fontFamily: INTER } = loadFont();

/** Temps ABSOLU du debut du plan dans la reference. */
const PLAN_START = 28.07;

/**
 * Police : 62 px au premier jet -> tout le texte sortait 8 a 12 % TROP ETROIT.
 *
 * ⭐⭐ CORRIGE PAR MESURE SUR UN MOT ISOLE, pas par dosage. Le rendu v1 donnait
 * des facteurs de correction incoherents d'une phrase a l'autre (1,076 a 1,171),
 * ce qui m'a fait croire a DEUX causes (police + espacement inter-mots) et
 * echafauder un systeme a 2 inconnues. J'ai teste l'hypothese avant de
 * l'appliquer : elle ne tenait pas (l'ecart ne suivait ni le nombre d'espaces ni
 * le nombre de mots gras).
 * ✅ La mesure qui tranche : la largeur d'un mot SEUL a l'ecran, avant l'arrivee
 * du deuxieme — aucun espace n'entre alors en jeu.
 *     « Not » 102/91 = 1,121 · « Built » 140/126 = 1,111 · « Foster » 181/169 =
 *     1,071 · « Book a Demo » (bloc unique) 395/367 = 1,076.
 * Mediane 1,094 et moyenne 1,095 convergent => 62 x 1,094 = 68 px.
 * L'ecart etait donc dans la POLICE SEULE ; `marginRight` reste a 0,28em.
 * ⚠️ Une largeur de texte ne se calcule pas d'avance (elle depend de la police
 * reellement resolue par le moteur) : elle se mesure au rendu.
 */
const FONT = 68;
const FONT_STACK =
  '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Ligne de base commune, mesuree : le texte vit entre y 508 et 573. */
const BASELINE_TOP = 508;
/** Interligne de la pile doree, MESURE (508 -> 422). */
const STACK_STEP = 86;

const WHITE = "rgb(252,255,255)";
const GOLD = "rgb(165,133,73)";
const GOLD_PAST = "rgb(162,135,97)";
const GREY = "rgb(102,97,92)";

type Word = { w: string; at: number; bold?: boolean };

/**
 * Les cinq phrases, avec l'instant MESURE d'apparition de chaque mot (palier de
 * largeur du bloc). `bold` : les trois voix signalent une hierarchie de graisse
 * sur la phrase 1 — « Carers and Social Workers » plus gras que le debut.
 */
const P1: Word[] = [
  { w: "Not", at: 28.07 },
  { w: "just", at: 28.27 },
  { w: "build", at: 28.303 },
  { w: "for", at: 28.47 },
  { w: "Carers", at: 28.67, bold: true },
  { w: "and", at: 28.837, bold: true },
  { w: "Social", at: 29.037, bold: true },
  { w: "Workers", at: 29.237, bold: true },
];
/**
 * ⚠️ P2 est en gras SUR TOUTE LA PHRASE (vu sur la planche A/B : la reference
 * affiche « Built with them » d'un seul tenant en gras, la ou je n'avais mis que
 * « Built »). Les trois voix externes ne signalaient une hierarchie de graisse
 * que sur la phrase 1 — celle-ci, aucune ne l'a relevee.
 */
const P2: Word[] = [
  { w: "Built", at: 30.57, bold: true },
  { w: "with", at: 30.937, bold: true },
  { w: "them", at: 31.27, bold: true },
];
/** Phrase 3 : « Foster With » reste blanc, la pile doree s'empile a sa droite. */
const P3_HEAD: Word[] = [
  { w: "Foster", at: 32.57 },
  { w: "With", at: 33.037 },
];
/** Les trois mots de la pile, dans l'ordre d'arrivee (instants MESURES). */
const STACK = [
  { w: "Clarity", at: 33.337 },
  { w: "Certainty", at: 34.47 },
  { w: "Confidence", at: 35.637 },
];
const P4: Word[] = [
  { w: "Foster", at: 36.603 },
  { w: "With", at: 36.903 },
];
const P5: Word[] = [{ w: "Book a Demo", at: 38.603 }];

/** Fondu d'entree/sortie en temps ABSOLU (repris du plan 3). */
const fade = (t: number, inA: number, inB: number, outA: number, outB: number) =>
  interpolate(t, [inA, inB, outA, outB], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

/**
 * Un mot qui apparait : fondu court, et il s'ECLAIRCIT en se posant (le mot qui
 * arrive est plus terne que ceux deja en place). Repris du plan 3, ou c'est ce
 * detail qui donne la sensation d'ecriture plutot que d'affichage.
 */
const WordSpan: React.FC<{ word: Word; tAbs: number }> = ({ word, tAbs }) => {
  /* ⚠️ Fondu COURT (0,07 s = ~2 frames). A 0,18 s, le mot mettait ~4 frames a
     franchir le seuil de lisibilite : la comparaison frame par frame montrait la
     reference posant son 2e mot a f86 quand nous le posions a f90. Les INSTANTS
     etaient bons, c'est la RAMPE qui trainait — un retard d'apparition se corrige
     sur la duree du fondu, pas en avancant les timings (qui sont mesures). */
  const appear = interpolate(tAbs, [word.at, word.at + 0.07], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = interpolate(tAbs, [word.at + 0.06, word.at + 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const g = Math.round(170 + 85 * settle);
  return (
    <span
      style={{
        opacity: appear,
        color: `rgb(${g},${g},${g})`,
        /* Le gras est rendu par Inter 700 (axe complet), le clair par la pile
           systeme qui y est deja exacte — cf. l'en-tete du fichier. */
        fontFamily: word.bold ? INTER : undefined,
        fontWeight: word.bold ? 700 : 400,
        /* ⛔⛔ PAS de `marginRight` ici — c'etait une MARGE ARTIFICIELLE qui
           s'AJOUTAIT a l'espace naturel de la police. Avec 0,28em, P1 tombait
           juste (+1 px/espace) mais P2/P3/P4 manquaient 15 px par espace : deux
           cibles contradictoires pour un seul parametre, donc AUCUNE valeur ne
           pouvait convenir. Le probleme n'etait pas la valeur, c'etait le MODELE.
           ✅ On separe desormais les mots par un VRAI espace typographique
           (`{" "}` ci-dessous), rendu par la police elle-meme — exactement ce que
           fait la reference, qui compose une phrase et non des blocs juxtaposes. */
      }}
    >
      {word.w}
    </span>
  );
};

/** Une phrase posee sur son ANCRE GAUCHE mesuree (jamais centree a l'execution). */
const Line: React.FC<{
  left: number;
  opacity: number;
  children: React.ReactNode;
}> = ({ left, opacity, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: BASELINE_TOP,
      opacity,
      fontFamily: FONT_STACK,
      fontSize: FONT,
      fontWeight: 400,
      letterSpacing: "-0.5px",
      /* ⚠️ `pre` et non `nowrap` : il faut a la fois interdire le retour a la
         ligne ET preserver les espaces typographiques qui separent les mots.
         ⛔ `display: flex` est retire — il transformait chaque enfant en boite
         et AVALAIT les espaces entre eux (c'est ce qui rendait la marge
         artificielle necessaire au depart). */
      whiteSpace: "pre",
    }}
  >
    {children}
  </div>
);

export const Plan10Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tAbs = PLAN_START + frame / fps;

  const p1 = fade(tAbs, 28.0, 28.1, 30.15, 30.42);
  const p2 = fade(tAbs, 30.5, 30.62, 32.35, 32.55);
  const p3 = fade(tAbs, 32.5, 32.62, 36.35, 36.57);
  const p4 = fade(tAbs, 36.55, 36.68, 38.45, 38.67);
  const p5 = fade(tAbs, 38.55, 38.7, 40.2, 40.44);

  /**
   * La phrase 3 est la SEULE a se recaler : x0 va de 719 a 602 entre les frames
   * 134 et 149 (mesure). Les quatre autres ont une ancre strictement fixe.
   */
  const p3Left = interpolate(tAbs, [32.537, 33.037], [719, 602], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /**
   * Le fond passe au NOIR pour la fin du plan : la mesure montre le degrade vert
   * present jusque vers 39,5 s, puis un fond nettement plus sombre.
   */
  const greenOut = interpolate(tAbs, [39.4, 40.2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f0f" }}>
      {/*
        LE FOND — degrade du quasi-noir (15,15,15) vers le vert (19,64,44),
        mesure au pixel en haut et en bas du cadre. Le coeur du vert est bas,
        comme au plan 3 : c'est le meme fond de registre « solution ».
      */}
      <AbsoluteFill
        style={{
          /*
            PROFIL MESURE sur la reference (canal vert moyen par bande de 10 % de
            hauteur, colonne x 150-420 hors texte, frame 31,07 s) :
              0-30 % : 15 · 30-40 : 17 · 40-50 : 23 · 50-60 : 32
              60-70 : 45 · 70-80 : 59 · 80-90 : 69 · 90-100 : 72
            ⛔ Mon premier gradient montait trop mollement : il rendait
            [15,15,17,17,19,24,30,40,51,60] — soit 12 points de vert en moins au
            pied du cadre et un dephasage sur toute la moitie basse.
            ⚠️ Contre-intuitif : a l'oeil, sur la planche A/B, notre fond semblait
            TROP present. La mesure dit l'inverse — il etait trop PALE. C'est
            exactement pourquoi le projet impose de mesurer un profil plutot que
            de corriger ce qu'on croit voir.
            Les stops ci-dessous sont cales bande par bande sur les valeurs REF,
            en conservant le ratio R:G:B du vert mesure au pied, rgb(19,64,44).
          */
          background:
            "linear-gradient(180deg," +
            /* ⚠️ Valeurs RABAISSEES par rapport au profil cible : les halos
               ci-dessous s'AJOUTENT a cette nappe (ils apportaient +13 points
               mesures). La nappe vise donc la cible MOINS l'apport des halos —
               une couche additive se soustrait de la couche du dessous, elle ne
               se regle pas isolement. */
            " rgb(15,15,15) 0%," +
            " rgb(15,15,15) 25%," +
            " rgb(15,16,15) 35%," +
            " rgb(15,19,15) 45%," +
            " rgb(15,25,18) 55%," +
            " rgb(15,34,24) 65%," +
            " rgb(16,44,31) 75%," +
            " rgb(17,51,36) 85%," +
            " rgb(17,54,38) 95%," +
            " rgb(17,53,37) 100%)",
          opacity: greenOut,
        }}
      />

      {/*
        LES HALOS — ⛔⛔ LE PROFIL PAR BANDES NE SUFFISAIT PAS (piege deja paye au
        plan 5 : « une moyenne par bande ne voit PAS la forme »).
        Une fois la nappe calee, le profil VERTICAL etait juste a 0,6 point pres...
        et le fond restait faux a l'oeil. Le profil par COLONNES l'a montre :
            REF  59 63 57 51 49 54 60 60 53   <- varie de 49 a 63
            nous 63 63 63 63 63 63 63 63 63   <- rigoureusement uniforme
        La reference n'est pas une nappe lineaire : c'est un ensemble de HALOS
        diffus, plus lumineux vers les bords, creuses au centre. On les modelise
        par deux taches radiales calees sur les maxima mesures (colonnes 1 et 6-7).
      */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 42% at 14% 96%, rgba(34,104,72,0.55), rgba(0,0,0,0) 70%)," +
            "radial-gradient(52% 38% at 74% 92%, rgba(30,94,66,0.5), rgba(0,0,0,0) 72%)," +
            "radial-gradient(46% 30% at 46% 104%, rgba(18,54,38,0.35), rgba(0,0,0,0) 74%)",
          opacity: greenOut,
        }}
      />

      {/* P1 — ancre 282, huit mots, hierarchie de graisse sur la fin. */}
      <Line left={282} opacity={p1}>
        {P1.map((w, i) => (
          <React.Fragment key={w.w + w.at}>
            {i > 0 ? " " : null}
            <WordSpan word={w} tAbs={tAbs} />
          </React.Fragment>
        ))}
      </Line>

      {/* P2 — ancre 719. */}
      <Line left={719} opacity={p2}>
        {P2.map((w, i) => (
          <React.Fragment key={w.w + w.at}>
            {i > 0 ? " " : null}
            <WordSpan word={w} tAbs={tAbs} />
          </React.Fragment>
        ))}
      </Line>

      {/*
        P3 — « Foster With » blanc, puis LA PILE. Le nouveau mot nait sur la
        ligne de base a droite de « With » ; les precedents montent d'un cran de
        86 px. Le plus ancien grise.
      */}
      <Line left={p3Left} opacity={p3}>
        {P3_HEAD.map((w, i) => (
          <React.Fragment key={w.w + w.at}>
            {i > 0 ? " " : null}
            <WordSpan word={w} tAbs={tAbs} />
          </React.Fragment>
        ))}{" "}
        {/* Conteneur de la pile : les mots y sont positionnes en absolu par
            rapport a la ligne de base, pour pouvoir monter independamment.
            ⭐ `marginLeft: 16` — MESURE, pas dose : au plateau, la reference
            laisse 42 px entre « With » et la pile, contre 26 chez nous, alors
            que l'espace inter-mots ordinaire est identique des deux cotes
            (18 px). C'est donc un espace PROPRE a la pile, pas un ecart de
            largeur — d'ou un decalage local plutot qu'un reglage global. */}
        <span
          style={{ position: "relative", display: "inline-block", marginLeft: 16 }}
        >
          {STACK.map((s, i) => {
            /* Combien de mots sont arrives APRES celui-ci = de combien de crans
               il est monte. */
            const later = STACK.filter((o) => o.at > s.at && tAbs >= o.at).length;
            /* ⚠️ `STACK[i + later]` est le mot dont l'arrivee vient de pousser
               celui-ci vers le haut. L'index est borne : sans le garde, le
               dernier cran lirait au-dela du tableau (undefined.at). */
            const pusher = later > 0 ? STACK[Math.min(i + later, STACK.length - 1)] : null;
            const rise = pusher
              ? interpolate(tAbs, [pusher.at - 0.02, pusher.at + 0.22],
                  [(later - 1) * STACK_STEP, later * STACK_STEP], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  })
              : 0;
            const appear = interpolate(tAbs, [s.at, s.at + 0.07], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            /* Le plus ancien grise, l'avant-dernier reste dore mais passe,
               le dernier arrive est le dore vif. */
            const color = later === 0 ? GOLD : later === 1 ? GOLD_PAST : GREY;
            return (
              <span
                key={s.w}
                style={{
                  position: "absolute",
                  left: 0,
                  top: -rise,
                  opacity: appear,
                  color,
                  fontFamily: INTER,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {s.w}
              </span>
            );
          })}
          {/* Reserve la largeur du plus long mot de la pile pour que la ligne
              garde sa geometrie (les mots empiles sont en position absolue). */}
          <span style={{ visibility: "hidden", fontFamily: INTER, fontWeight: 700 }}>
            Confidence
          </span>
        </span>
      </Line>

      {/*
        P4 — « Foster With x FosterWith ». Le « x » est plus petit (releve par
        Grok, seul a le voir), et « FosterWith » est COLLE avec le split de
        couleur au milieu du mot.
      */}
      <Line left={579} opacity={p4}>
        {P4.map((w, i) => (
          <React.Fragment key={w.w + w.at}>
            {i > 0 ? " " : null}
            <WordSpan word={w} tAbs={tAbs} />
          </React.Fragment>
        ))}{" "}
        <span
          style={{
            opacity: interpolate(tAbs, [37.203, 37.273], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            color: WHITE,
            /* 0,62 donnait 22 px de large contre 30 dans la reference (hauteur
               23 px contre 37) — releve par l'agent de diagnostic, verifie. */
            fontSize: FONT * 0.72,
          }}
        >
          x
        </span>{" "}
        <span
          style={{
            opacity: interpolate(tAbs, [37.537, 37.607], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: INTER,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: WHITE }}>Foster</span>
          <span style={{ color: GOLD }}>With</span>
        </span>
      </Line>

      {/* P5 — « Book a Demo », ancre 762. */}
      <Line left={762} opacity={p5}>
        {P5.map((w) => (
          <WordSpan key={w.w + w.at} word={w} tAbs={tAbs} />
        ))}
      </Line>
    </AbsoluteFill>
  );
};
