// ============================================================================================
// TEST DU DECOR — "le funambule tient-il grace au VIDE, ou grace a l'ABSENCE DE CONCURRENCE ?"
//
// PORTAGE de CfaActe4Filet16x9.tsx (worktree remotion-cfa) dans le repo principal, 2026-07-29.
// Hypothese ouverte posee par Aziz et gravee dans memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md
// (principe n.5 "aucune concurrence visuelle" = le seul dont on ne connait pas la vraie borne).
//
// ⛔ PROTOCOLE : UNE SEULE VARIABLE CHANGE — LE FOND. Rien d'autre.
// Le personnage, l'arc, les timings forced-align, le filet, les ancrages, les etiquettes, l'audio
// et les SFX sont RIGOUREUSEMENT IDENTIQUES a la version validee. La seule addition est la prop
// `fond` et le rendu conditionnel du skyline. Toute autre modification INVALIDERAIT le test.
//
// 3 variantes rendues sur les memes 32.5s :
//   "vide"    = le fond d'origine (etoiles + degrade radial)      -> le temoin
//   "attenue" = skyline + rue, contraste bas, hors du regard      -> l'hypothese d'Aziz
//   "plein"   = meme skyline, contraste normal                    -> le contre-test (ou est la borne)
// Sans "plein", un echec de "attenue" serait ambigu : on ne saurait pas si c'est le decor riche qui
// tue la demonstration, ou seulement cette attenuation-la qui est ratee.
//
// GEOMETRIE PRESERVEE : le vide fil(y=170) -> filet(y=790) reste INTACT (620px, 57% de l'ecran).
// La rue passe SOUS le filet (y>=850). Le principe n.6 "l'echelle porte l'enjeu" n'est pas touche :
// on teste la concurrence visuelle, PAS la hauteur de chute.
//
// ⚠️ OBSERVE AU PORTAGE (frame t=15s du rendu d'origine) : pendant l'arret total "stable"
// (14.48-15.82), walkPhase continue de tourner et s'immobilise parfois sur swing~=0 -> les 2 jambes
// se superposent en un trait vertical unique (pose degeneree). Meme famille que le bug BRAS_LAG du
// socle. NON CORRIGE ICI : le corriger changerait une 2e variable et invaliderait le test.
// ============================================================================================
//
// --- en-tete d'origine, conserve tel quel ---
//
// CFA Acte 4 "Qui tient la cle" — REFONTE COMPLETE (2026-07-26).
//
// POURQUOI CETTE REFONTE : la version precedente (CfaActe4Cle16x9) rejouait LITTERALEMENT la carte
// plate du beat 2 — meme geo (cfaGeoWide), meme camera, meme geste (arcs France->UEMOA/CEMAC qui
// pulsent), renomme "garantie" au lieu de "laisse". Redondance diagnostiquee par Aziz.
//
// CAUSE RACINE (doctrine maison) : "CARTE = spatial/causal · SCENE = conceptuel — ne jamais forcer
// l'abstrait sur la carte". Ce texte est CONCEPTUEL (un mecanisme de garantie, une contrepartie, une
// reforme juridique) : il n'a rien de spatial sauf le mot "Paris". D'ou le faux-semblant cartographique.
//
// LA METAPHORE RETENUE — UNE SEULE, POSEE EN 2 SECONDES (contrainte Aziz) :
//   UN FILET DE SECURITE TENDU SOUS UN FUNAMBULE.
// Universelle, comprise sans decodage : "si ca tombe, il y a quelque chose qui rattrape" = la
// definition meme d'une garantie de convertibilite. Elle encaisse les 3 idees du script SANS ajouter
// la moindre convention nouvelle :
//   A. la garantie    -> le filet rattrape la chute
//   B. la contrepartie -> le filet est tenu par des cordes d'ancrage que les zones "paient"
//   C. la nuance 2020  -> UN SEUL COTE d'ancrages se detache ; le filet, lui, RESTE TENDU
// ⛔ Ecartee : une "coupe geologique" (nappe/veines/puits) — belle mais elle demandait 5 conventions
//    a decoder, exactement le piege de la v1 du beat 6b ("trop abstrait, aucun rapport entre les
//    elements"). La lisibilite immediate prime sur la richesse de l'image.
//
// LISIBILITE DE LA NUANCE 2020 = 3 signaux REDONDANTS (le point le plus difficile du beat) :
//   couleur (or=UEMOA vs cuivre=CEMAC) + cote (gauche vs droite) + comportement (les cordes TOMBENT
//   / le filet SE RETEND). Invariant absolu : LE FILET NE SE DETACHE JAMAIS. Ce qui lache, ce sont
//   ses attaches d'un seul cote.
//
// CADRAGE : base de l'image-cible B (filet dense + ancrages sur platines murales visibles) avec la
// HAUTEUR de l'image-cible A reinjectee -> 620 px de vide entre le fil et le filet (57% de l'ecran),
// pour qu'on RESSENTE la chute. Le vide reste NU ~2s avant que le filet arrive : sans danger installe
// d'abord, la protection ne vaut rien.
//
// OUVERTURE (decision Aziz) : PAS de cle heritee du beat 3 (service apres-vente, vole 1.5s a
// l'installation et ajoute un objet a decoder). Le fil se TRACE LENTEMENT des la frame 0.
//
// FUNAMBULE : silhouette au TRAIT conservee telle quelle. Un comparatif a taille reelle (74px) a
// montre que la version "silhouette pleine" REFERMAIT la posture (bras colles au corps) et se lisait
// moins bien que le trait. L'"amelioration" degradait — teste, donc tranche.
//
// AUDIO = beat4-vo.mp3 (50.02s). Cette scene ne couvre QUE les 32.5 premieres secondes ; la scene
// 1994 (murs FMI/FRANCE + signatures + tampon) est CONSERVEE telle quelle et reprise de l'ancien
// composant. Timings cales au forced-alignment REEL (beat4-alignment.json) :
//   Paris 1.98 · garantit 5.32 · reserves 9.18 · manquent 9.68 · fournit 10.32 · garantie 12.96 ·
//   stable 14.48-15.82 · echange 16.18 · deposer 19.74 · obligation 24.34 · vingt 26.86-27.62 ·
//   garantie francaise 27.96 · restee 29.66 · lien 31.34
import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile } from "remotion";
import { Mvt3Signature1994 } from "./_funambuleSignature1994";
import { SkylineAttenue, SkylinePlein, SkylineReactif } from "./skylineDecorGroups";

// Le fond teste. "vide" = temoin (fond d'origine, inchange).
// "reactif" = 2e manche : MEME decor qu'"attenue", mais il REAGIT au geste central.
export type FondMode = "vide" | "attenue" | "plein" | "reactif";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Palette encre/nuit (identique a tout l'episode)
const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const OR = "#b8860b";
const OR_CLAIR = "#d9a93a";
const CUIVRE = "#c17e3a";

// ================== GEOMETRIE (calculee, cf. en-tete cadrage) ==================
const FIL_Y = 170;        // la corde du funambule, haut du cadre
const FILET_Y = 790;      // la nappe du filet -> 620px de vide = le vertige
const FX0 = 430;          // bord gauche du filet
const FX1 = 1490;         // bord droit
const FCX = (FX0 + FX1) / 2;
const PERSO_H = 74;       // hauteur silhouette (taille validee au comparatif)
const PERSO_X0 = 700;     // depart de la marche
const PERSO_X1 = 1080;    // arrivee

// ================== TIMINGS (cales au forced-alignment reel) ==================
const T = {
  filTrace: 0.0,        // le fil se trace des la frame 0 (pas de trou noir a l'ouverture)
  filFin: 2.8,          // ... et atteint l'autre bord (lent, delibere — mot "Paris" 1.98 tombe dedans)
  persoIn: 2.8,         // la silhouette apparait
  filetTend: 4.8,       // le filet se tend AVANT le mot "garantit" (5.32) — image d'abord, voix ensuite
  vacille: 8.7,         // "les reserves manquent" (9.18-10.02) — le pied derape
  chute: 10.0,          // "il fournit les euros" (10.32) — LE GESTE CENTRAL, chute rattrapee
  remonte: 12.5,        // "c'est cette garantie" (12.96) — il remonte sur le fil
  repart: 16.2,         // il REPREND SA MARCHE (retour Aziz : il ne doit pas rester fige)
  sortie_perso: 24.6,   // ... et QUITTE le cadre par la droite AVANT le detachement de 2020 (26.4),
                        //     pour laisser l'attention entierement libre au geste-cle de la scene.
  stable: 14.48,        // "stable" (14.48-15.82) — ARRET TOTAL, rien ne bouge ~2s
  ancragesRevele: 16.6, // "en echange" (16.18) — les cordes d'ancrage s'illuminent
  depot: 19.2,          // "deposer une part" (19.74) — la valeur glisse vers les murs
  ralentit: 24.0,       // "cette obligation a pris fin" (24.34)
  detache: 26.4,        // "deux mille vingt" (26.86-27.62) — LES 2 CORDES OR SE DETACHENT
  retend: 27.9,         // "la garantie francaise est restee" (27.96-30.10) — le filet flechit PUIS se retend
  sortie: 31.2,         // "ce lien eclaire" (31.34) — tout s'assombrit sauf le filet
  bascule: 32.5,        // -> scene 1994 (conservee)
};
export const CFA_ACTE4_FILET_FRAMES = S(52.5); // 50.02s de voix + queue

const ramp = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [S(a), S(b)], [lo, hi], clamp);
const pulse = (f: number, a: number, peak: number, end: number) =>
  interpolate(f, [S(a), S(a + peak), S(a + end)], [0, 1, 0], clamp);

// ================== SFX ==================
const SFX: { src: string; at: number; vol: number; dur?: number }[] = [
  { src: "_shared/sfx/ui/node-appear.mp3", at: T.filetTend, vol: 0.5 },
  { src: "_shared/sfx/impact/tension-pulse.mp3", at: T.chute + 0.25, vol: 0.6 },   // l'impact dans le filet
  { src: "_shared/sfx/ui/plate-pop.mp3", at: T.ancragesRevele, vol: 0.45 },
  { src: "_shared/sfx/ui/slash-red.mp3", at: T.detache, vol: 0.58 },               // la rupture 2020
  { src: "_shared/sfx/ui/vault-lock.mp3", at: T.retend + 0.6, vol: 0.5 },          // le filet tient
  { src: "_shared/sfx/camera/sfx-swoosh-pullback.mp3", at: T.bascule, vol: 0.55 },
];

// ================== LE FILET (genere par calcul — sa courbure est une VARIABLE) ==================
// sag = profondeur de la poche du filet. Elle bouge : impact de la chute, flechissement au
// detachement, retour en tension. Un path fige ne pourrait pas raconter ca.
const filetPath = (sag: number, bord: "haut" | "bas") => {
  const y0 = FILET_Y + (bord === "bas" ? 34 : 0);
  return `M ${FX0} ${y0} Q ${FCX} ${y0 + sag} ${FX1} ${y0}`;
};
// point sur la courbe quadratique a t in [0,1] (pour poser le funambule dedans + les particules)
const filetAt = (sag: number, t: number, bord: "haut" | "bas" = "haut"): [number, number] => {
  const y0 = FILET_Y + (bord === "bas" ? 34 : 0);
  const x = (1 - t) * (1 - t) * FX0 + 2 * (1 - t) * t * FCX + t * t * FX1;
  const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + sag) + t * t * y0;
  return [x, y];
};

// ================== LE FUNAMBULE (silhouette au trait — version validee au comparatif) ==================
const Funambule: React.FC<{ x: number; y: number; tilt: number; scale?: number; opacity?: number }> = ({
  x, y, tilt, scale = 1, opacity = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${tilt})`} opacity={opacity}>
    {/* balancier — long, il DIT l'equilibre a lui seul */}
    <line x1={-150} y1={-46} x2={150} y2={-40} stroke={ENCRE} strokeWidth={3.5} strokeLinecap="round" />
    {/* tete */}
    <circle cx={0} cy={-66} r={9} fill={ENCRE} />
    {/* corps + jambes + bras (posture ouverte : c'est ce qui se lit a 74px) */}
    <path
      d="M 0,-57 L 2,-26 M 2,-26 L -10,8 M 2,-26 L 13,6 M 0,-50 L -50,-31 M 0,-50 L 52,-25"
      fill="none" stroke={ENCRE} strokeWidth={4.5} strokeLinecap="round"
    />
  </g>
);

// ================== FUNAMBULE DE PROFIL — il MARCHE (pas apres pas) ==================
// Constat Aziz (2026-07-26, juste) : DE FACE une stick figure ne peut pas marcher — les jambes ne
// peuvent que glisser, d'ou l'effet "il glisse sur le fil" (et notre regle : un element ne glisse
// jamais sans intention). DE PROFIL les jambes s'ecartent en ciseau DANS le plan de l'image : la
// marche devient naturelle et plus SIMPLE a animer, pas plus compliquee.
// walk = phase de marche continue (0..1 en boucle). Aucune articulation complexe : 2 jambes en
// ciseau + un leger bob vertical du corps = lecture "il marche" a 74px.
const FunambuleProfil: React.FC<{
  x: number; y: number; tilt: number; walk: number; opacity?: number;
}> = ({ x, y, tilt, walk, opacity = 1 }) => {
  const a = walk * Math.PI * 2;
  const swing = Math.sin(a) * 17;        // ecart des jambes (degres d'ouverture du ciseau)
  const bob = Math.abs(Math.cos(a)) * 2.5; // le corps monte/descend legerement a chaque pas
  const rad = (d: number) => (d * Math.PI) / 180;
  // hanche
  const hx = 0, hy = -26 - bob;
  const L = 34; // longueur de jambe
  const j1x = hx + Math.sin(rad(swing)) * L, j1y = hy + Math.cos(rad(swing)) * L;
  const j2x = hx + Math.sin(rad(-swing)) * L, j2y = hy + Math.cos(rad(-swing)) * L;
  return (
    <g transform={`translate(${x} ${y}) scale(1) rotate(${tilt})`} opacity={opacity}>
      {/* balancier vu de profil : raccourci, il pointe vers le spectateur -> une barre plus courte */}
      <line x1={-92} y1={-44 - bob} x2={92} y2={-40 - bob} stroke={ENCRE} strokeWidth={3.5} strokeLinecap="round" />
      {/* tete de profil (legerement decalee vers l'avant = sens de la marche) */}
      <circle cx={3} cy={-66 - bob} r={9} fill={ENCRE} />
      {/* buste */}
      <line x1={1} y1={-58 - bob} x2={hx} y2={hy} stroke={ENCRE} strokeWidth={4.5} strokeLinecap="round" />
      {/* 2 jambes en CISEAU (c'est ca qui fait lire la marche) */}
      <line x1={hx} y1={hy} x2={j1x} y2={j1y} stroke={ENCRE} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={hx} y1={hy} x2={j2x} y2={j2y} stroke={ENCRE} strokeWidth={4.5} strokeLinecap="round"
        opacity={0.75} />
      {/* bras qui tient le balancier */}
      <line x1={1} y1={-52 - bob} x2={26} y2={-42 - bob} stroke={ENCRE} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

// ================== PLAQUE-ETIQUETTE (convention DEJA etablie dans l'episode) ==================
// Constat Aziz (2026-07-26) : la scene montrait le MECANISME sans jamais dire QUI est qui. Or tout
// l'episode nomme ses acteurs a l'ecran (CFA, EURO, FCFA, TAUX FIXE, SIRA, les devises du beat 3).
// Une etiquette courte n'est PAS du sur-etiquetage — c'est notre grammaire. Ce qu'on s'interdit,
// c'est de repeter la PHRASE de la voix, pas de nommer un objet.
const Plaque: React.FC<{ x: number; y: number; label: string; op: number; anchor?: "middle" | "start" }> = ({
  x, y, label, op, anchor = "middle",
}) => (
  <g opacity={op}>
    <text x={x} y={y} textAnchor={anchor} fontFamily="Georgia, serif" fontSize={27} fill={ENCRE}
      letterSpacing={3} opacity={0.86}
      style={{ paintOrder: "stroke", stroke: NUIT2, strokeWidth: 6 }}>{label}</text>
  </g>
);

// ================== UNE CORDE D'ANCRAGE ==================
// detach = 0 (tendue) -> 1 (laché, elle retombe). Chaque corde est independante.
const Ancrage: React.FC<{
  side: "g" | "d"; attachX: number; attachY: number; murX: number; murY: number;
  color: string; detach: number; glow: number; flux: number; frame: number; reveal?: number;
  strain?: number; // = le sauvetage SOLLICITE la structure (cf. neutralisation du contresens)
}> = ({ attachX, attachY, murX, murY, color, detach, glow, flux, frame, reveal = 0, strain = 0 }) => {
  // quand elle lache : le bout mural reste fixe, le bout filet tombe et la corde molit
  // DETACHEMENT 2020 : les 2 modeles convergent — une corde qui tombe MOLLEMENT se lit comme une
  // panne subie, alors que 2020 est une DECISION JURIDIQUE. On la fait donc se detacher NET, avec
  // une inertie pendulaire franche (elle part vite, oscille, puis s'immobilise) : "fin de service",
  // pas "accident".
  const detachEase = detach < 1 ? 1 - Math.pow(1 - detach, 3) : 1; // depart franc
  const swingDamp = Math.exp(-detach * 4) * Math.sin(detach * 22) * 26 * (detach > 0 ? 1 : 0);
  const endX = interpolate(detachEase, [0, 1], [attachX, attachX + (attachX > FCX ? 60 : -60)], clamp) + swingDamp;
  const endY = interpolate(detachEase, [0, 1], [attachY, attachY + 210], clamp);
  const ctrlSag = interpolate(detachEase, [0, 1], [0, 120], clamp);
  // vibration sous tension (le sauvetage sollicite la structure)
  const vib = strain > 0.02 ? Math.sin(frame * 1.9) * 5 * strain : 0;
  const d = `M ${murX} ${murY} Q ${(murX + endX) / 2 + vib} ${(murY + endY) / 2 + ctrlSag} ${endX} ${endY}`;
  return (
    <g opacity={interpolate(detach, [0, 1], [1, 0.45], clamp)}>
      {/* la corde elle-meme : elle s'EPAISSIT en plus de s'allumer (un simple changement de couleur
          passait inapercu — cf. retour Aziz). L'epaisseur se voit meme du coin de l'oeil.
          `strain` = tension supplementaire quand le filet encaisse la chute : la corde s'epaissit,
          blanchit et vibre. C'est ce qui montre que la protection SE PAIE (neutralise la lecture
          "sauveur bienveillant" signalee par Gemini ET Kimi) sans ajouter le moindre texte. */}
      <path d={d} fill="none" stroke={color} strokeWidth={4 + 3.5 * glow + 3 * strain} strokeLinecap="round"
        opacity={0.5 + 0.5 * Math.max(glow, strain)}
        style={{ filter: (glow > 0.05 || strain > 0.05)
          ? `drop-shadow(0 0 ${9 * glow + 14 * strain}px ${color})` : undefined }} />
      {/* ONDE DE REVELATION : au moment ou les cordes entrent en jeu ("en echange", 16.6s), une
          impulsion COURT le long de chaque corde du filet vers le mur. C'est ce geste qui fait
          remarquer les cordes — l'allumage statique, lui, passait inapercu. */}
      {reveal > 0.01 && reveal < 0.99 && (() => {
        const t = reveal;
        const px = attachX + (murX - attachX) * t;
        const py = attachY + (murY - attachY) * t;
        return (
          <circle cx={px} cy={py} r={13} fill="none" stroke={color} strokeWidth={3.5}
            opacity={Math.sin(t * Math.PI) * 0.95}
            style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
        );
      })()}
      {/* platine murale (elle, ne bouge jamais) */}
      <circle cx={murX} cy={murY} r={10} fill="none" stroke={ENCRE} strokeWidth={3} />
      <line x1={murX + (murX < FCX ? -22 : 22)} y1={murY - 26} x2={murX + (murX < FCX ? -22 : 22)} y2={murY + 26}
        stroke={ENCRE} strokeWidth={5} strokeLinecap="round" />
      <line x1={murX + (murX < FCX ? -22 : 22)} y1={murY} x2={murX} y2={murY} stroke={ENCRE} strokeWidth={3} />
      {/* POINTS DE VALEUR qui remontent vers le mur (= le depot des reserves).
          ⚠️ Retour Aziz (2026-07-26) : "je n'avais presque pas remarque qu'ils s'etaient allumes".
          Le mecanisme EXISTAIT deja mais etait invisible : r=4, 3 points par corde, opacite faible.
          Amplifie franchement — 6 points, r=7, glow, et un halo qui court le long de la corde. Un
          changement de COULEUR seul ne se voit pas ; c'est le MOUVEMENT qui attire l'oeil. */}
      {/* ⚠️ Retour convergent Gemini+Kimi : des points parfaitement reguliers = "particules par
          defaut / calque superpose". On casse l'uniformite procedurale — taille, vitesse, opacite
          et espacement varient par point (valeurs deterministes, pas de random : le rendu doit
          rester identique a chaque frame calculee). */}
      {flux > 0.02 && detach < 0.5 && [0, 1, 2, 3, 4, 5].map((i) => {
        const jitter = ((i * 37) % 11) / 11;          // 0..1 deterministe, propre a chaque point
        const speed = 42 + jitter * 16;                // vitesses differentes -> plus de defile regulier
        const t = ((frame / speed) + i / 6 + jitter * 0.09) % 1;
        const px = murX + (endX - murX) * (1 - t);
        const py = murY + (endY - murY) * (1 - t);
        const fade = Math.sin(t * Math.PI);
        const r = 5 + jitter * 3.5;
        return (
          <circle key={i} cx={px} cy={py} r={r} fill={color}
            opacity={flux * fade * (0.62 + jitter * 0.38)}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        );
      })}
    </g>
  );
};

// mode du funambule : "face" = immobile en equilibre · "profil" = il MARCHE pas apres pas.
// Les 2 sont rendus pour comparaison (decision Aziz : "on regarde les deux").
export const FunambuleDecorTest16x9: React.FC<{
  persoMode?: "face" | "profil";
  fond?: FondMode;
  // le test ne porte que sur la partie funambule (0 -> 32.5s) ; la scene 1994 est hors perimetre
  avecScene1994?: boolean;
}> = ({ persoMode = "profil", fond = "vide", avecScene1994 = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const op = interpolate(frame, [0, 10, CFA_ACTE4_FILET_FRAMES - 14, CFA_ACTE4_FILET_FRAMES], [0, 1, 1, 0], clamp);
  const toInk = ramp(frame, T.bascule, T.bascule + 1.6); // bascule vers la scene 1994
  const sceneOp = 1 - toInk;

  // etoiles discretes (continuite avec le reste de l'episode)
  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 11; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 45; i++) a.push({ x: rnd() * W, y: rnd() * H * 0.75, r: rnd() * 1.4 + 0.4, o: rnd() * 0.35 + 0.15 });
    return a;
  }, []);

  // ===== LE FIL : se trace lentement des la frame 0 =====
  const filDraw = interpolate(frame, [S(T.filTrace), S(T.filFin)], [0, 1], {
    ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2), // ease-out : franc au depart, il se pose
  });

  // ===== LE FILET : se tend AVANT le mot "garantit" =====
  const filetDraw = interpolate(frame, [S(T.filetTend), S(T.filetTend + 1.5)], [0, 1], {
    ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // ===== LA CHUTE (le geste central) =====
  // spring avec rebond : c'est exactement ce a quoi servent les springs. Chute courte et amortie
  // (registre analyste : il tombe, il est rattrape, c'est net — aucun effet spectaculaire).
  const chuteSpring = spring({ frame: frame - S(T.chute), fps, config: { mass: 1.1, damping: 11, stiffness: 95 } });
  const estTombe = frame >= S(T.chute);
  const remonteSpring = spring({ frame: frame - S(T.remonte), fps, config: { mass: 1, damping: 16, stiffness: 70 } });

  // vacillement avant la chute
  const vacille = pulse(frame, T.vacille, 0.35, 1.3);
  const tiltVacille = vacille * 13 * Math.sin((frame - S(T.vacille)) / 2.2);

  // position du funambule : sur le fil -> dans le filet -> de retour sur le fil
  // ⚠️ Le DEPLACEMENT depend du mode. De FACE, avancer = glisser (les jambes ne peuvent pas marcher
  // dans ce plan) -> on l'immobilise, seul son equilibre vit. De PROFIL, la marche est reelle
  // (ciseau des jambes) -> le deplacement est legitime et lent.
  const marche = ramp(frame, T.persoIn, T.vacille, 0, 1);
  const persoXFil = persoMode === "profil"
    ? interpolate(marche, [0, 1], [PERSO_X0, PERSO_X1], clamp)
    : (PERSO_X0 + PERSO_X1) / 2;
  // phase de marche : ~1 pas toutes les 0.9s, uniquement tant qu'il est sur le fil
  const walkPhase = ((frame - S(T.persoIn)) / (FPS * 0.9)) % 1;
  // REPRISE DE MARCHE puis SORTIE DE CHAMP (retour Aziz) : apres la remontee il ne reste pas fige,
  // il repart tranquillement et quitte le cadre par la droite. Il ne reapparait plus ensuite.
  const repart = ramp(frame, T.repart, T.sortie_perso, 0, 1);
  const persoXApres = interpolate(repart, [0, 1], [PERSO_X1, W + 140], clamp);
  const marcheApres = frame >= S(T.repart) && frame < S(T.sortie_perso + 0.4);
  const sorti = frame >= S(T.sortie_perso);
  // sag du filet au moment de l'impact (il encaisse puis se stabilise)
  const impactSag = estTombe ? interpolate(chuteSpring, [0, 1], [0, 86], clamp) : 0;

  // ===== SAG DU FILET (la variable qui raconte tout) =====
  // 3 contributions : la poche au repos + l'impact de la chute + le flechissement au detachement.
  const sagRepos = 60 * filetDraw;
  // au detachement (2020) : il flechit LEGEREMENT puis se RETEND. Trop peu = invisible ;
  // trop = contresens ("la garantie a faibli"). Regle a l'oeil sur mini-render.
  const sagDetach = interpolate(
    frame,
    [S(T.detache), S(T.detache + 0.7), S(T.retend + 1.4)],
    [0, 34, 0],
    { ...clamp, easing: (t) => t }
  );
  const poidsPerso = estTombe && frame < S(T.remonte + 0.6) ? impactSag : 0;
  const sag = sagRepos + poidsPerso + sagDetach;

  // position finale du funambule
  let persoX = persoXFil, persoY = FIL_Y, persoTilt = tiltVacille, persoScale = 1;
  if (estTombe) {
    const [fx, fy] = filetAt(sag, 0.5);
    const chuteY = interpolate(chuteSpring, [0, 1], [FIL_Y, fy - 16], clamp);
    const back = remonteSpring;
    persoX = interpolate(back, [0, 1], [persoXFil, persoXFil], clamp);
    persoY = interpolate(back, [0, 1], [chuteY, FIL_Y], clamp);
    // il bascule pendant la chute puis se redresse en remontant
    persoTilt = interpolate(chuteSpring, [0, 1], [0, 24], clamp) * (1 - back);
    persoScale = 1;
    // une fois revenu sur le fil, il REPART et sort du cadre par la droite
    if (frame >= S(T.repart)) {
      persoX = persoXApres;
      persoY = FIL_Y;
      persoTilt = 0;
    }
  }

  // ===== ANCRAGES : 2 or a GAUCHE (UEMOA) + 2 cuivre a DROITE (CEMAC) =====
  // 2 par cote et non 3 : parmi 6 cordes identiques, personne ne verrait laquelle a lache.
  const ancrGlow = ramp(frame, T.ancragesRevele, T.ancragesRevele + 1.0);
  // ===== LE SAUVETAGE A UN COUT (decision Aziz apres review convergente) =====
  // Au moment ou le filet encaisse la chute, TOUTE la structure est sollicitee : les 4 cordes se
  // tendent, s'epaississent et vibrent. On voit que la protection TIRE sur les attaches — donc
  // qu'elle se paie. C'est ce qui empeche la lecture "la France sauve gratuitement".
  const strain = Math.max(
    pulse(frame, T.chute + 0.1, 0.18, 1.5),
    pulse(frame, T.chute + 0.55, 0.12, 0.8) * 0.6, // 2e sollicitation sur le rebond (conserve)
  );
  // ⚠️ Retour convergent Gemini+Kimi : la phase de depot (17->24s) "traine" et est "trop lineaire".
  // On la fait respirer par SALVES (pulsations) au lieu d'un defile continu et uniforme : le flux
  // monte et redescend en vagues, ce qui donne du rythme sans raccourcir la voix off.
  const salve = 0.62 + 0.38 * Math.max(0, Math.sin((frame - S(T.depot)) / 11));
  const fluxDepot = ramp(frame, T.depot, T.depot + 1.0) * (1 - ramp(frame, T.ralentit, T.detache)) * salve;
  const fluxCemac = ramp(frame, T.depot, T.depot + 1.0) * (1 - ramp(frame, T.sortie, T.sortie + 1)) * salve;
  // SEULES les cordes OR (gauche/UEMOA) se detachent
  const detachOr = ramp(frame, T.detache, T.detache + 0.85);

  // le filet brille quand il tient malgre le detachement
  const filetTient = Math.max(pulse(frame, T.chute + 0.2, 0.2, 1.0), pulse(frame, T.retend + 0.3, 0.5, 2.2));

  // sortie : tout s'assombrit sauf le filet
  const fadeAutres = 1 - ramp(frame, T.sortie, T.sortie + 1.2) * 0.85;

  // ===== LA REACTION DE LA VILLE (fond "reactif" uniquement) =====
  // ⛔ CE N'EST PAS UN FLASH. Un decor qui s'eteint d'un coup serait un EFFET ;
  // ce qui rend un decor PARTICIPANT, c'est qu'il ait un avant et un apres, comme
  // le personnage. La courbe suit donc l'arc reel, sur les memes reperes forced-align :
  //   vacille 8.7  -> la ville commence a sentir (montee lente, partielle : ~0.45)
  //   chute  10.0  -> elle accuse le coup (montee franche en 0.35s, plateau)
  //   remonte 12.5 -> il est sauve : elle se rallume, plus lentement qu'elle s'est
  //                   eteinte (2.2s) — on se remet moins vite qu'on ne tombe
  //   detache 26.4 -> 2e secousse, plus SOURDE (0.35) : 2020 est une decision
  //                   juridique, pas un accident. Elle ne merite pas le meme choc.
  const reactVacille = interpolate(frame,
    [S(T.vacille), S(T.vacille + 0.8), S(T.chute)], [0, 0.45, 0.45], clamp);
  const reactChute = interpolate(frame,
    [S(T.chute), S(T.chute + 0.35), S(T.remonte), S(T.remonte + 2.2)],
    [0, 1, 1, 0], clamp);
  const react2020 = interpolate(frame,
    [S(T.detache), S(T.detache + 0.45), S(T.retend + 1.2), S(T.retend + 3.0)],
    [0, 0.35, 0.35, 0], clamp);
  const reaction = Math.max(
    frame < S(T.chute) ? reactVacille : 0,
    reactChute,
    react2020,
  );

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`, opacity: op }}>
      <Audio src={staticFile("_rnd/cfa-nuit1994/beat4-vo.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={S(s.at)} durationInFrames={s.dur ?? 40}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}

      {sceneOp > 0.01 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity: sceneOp }}>
          {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ENCRE} opacity={s.o * fadeAutres} />)}

          {/* ===== LE SKYLINE TESTE — DERRIERE TOUT (juste apres les etoiles) =====
               Il subit `fadeAutres` comme le reste du decor : a la sortie (31.2s) tout s'assombrit
               sauf le filet, exactement comme dans la version temoin. Aucun traitement de faveur. */}
          {fond !== "vide" && (
            <g opacity={fadeAutres}>
              {fond === "attenue" && <SkylineAttenue />}
              {fond === "plein" && <SkylinePlein />}
              {fond === "reactif" && <SkylineReactif reaction={reaction} />}
            </g>
          )}

          {/* ===== LE FIL (se trace des la frame 0, lentement) ===== */}
          <line x1={0} y1={FIL_Y} x2={W * filDraw} y2={FIL_Y + 4 * filDraw}
            stroke={ENCRE} strokeWidth={3} strokeLinecap="round" opacity={0.9 * fadeAutres} />

          {/* ===== LES ANCRAGES (sous le filet dans l'ordre de rendu) ===== */}
          {filetDraw > 0.5 && (
            <g opacity={filetDraw}>
              {/* GAUCHE = UEMOA (or) — ce sont CELLES-CI qui se detachent en 2020 */}
              <Ancrage side="g" attachX={FX0 + 12} attachY={FILET_Y + 6} murX={120} murY={430}
                color={OR_CLAIR} detach={detachOr} glow={ancrGlow * (1 - detachOr)} flux={fluxDepot} frame={frame}
                reveal={ramp(frame, T.ancragesRevele, T.ancragesRevele + 0.9)} strain={strain} />
              <Ancrage side="g" attachX={FX0 - 6} attachY={FILET_Y + 40} murX={100} murY={660}
                color={OR_CLAIR} detach={detachOr} glow={ancrGlow * (1 - detachOr)} flux={fluxDepot} frame={frame}
                reveal={ramp(frame, T.ancragesRevele + 0.18, T.ancragesRevele + 1.08)} strain={strain} />
              {/* DROITE = CEMAC (cuivre) — elles RESTENT (l'obligation subsiste hors UEMOA) */}
              <Ancrage side="d" attachX={FX1 - 12} attachY={FILET_Y + 6} murX={1800} murY={430}
                color={CUIVRE} detach={0} glow={ancrGlow} flux={fluxCemac} frame={frame}
                reveal={ramp(frame, T.ancragesRevele + 0.36, T.ancragesRevele + 1.26)} strain={strain} />
              <Ancrage side="d" attachX={FX1 + 6} attachY={FILET_Y + 40} murX={1820} murY={660}
                color={CUIVRE} detach={0} glow={ancrGlow} flux={fluxCemac} frame={frame}
                reveal={ramp(frame, T.ancragesRevele + 0.54, T.ancragesRevele + 1.44)} strain={strain} />
            </g>
          )}

          {/* ===== MATS PORTEURS (structure permanente) =====
               Sans eux, une fois les cordes OR detachees (2020), le bord gauche du filet flotte dans
               le vide = physiquement absurde, et pire : ca suggere que le filet lui-meme lache. Or
               l'invariant de la scene est qu'il TIENT. Les mats disent que la structure demeure ;
               ce qui se detache, ce sont seulement les cordes de la CONTREPARTIE. */}
          {filetDraw > 0.3 && (
            <g opacity={0.5 * filetDraw * fadeAutres}>
              <line x1={FX0} y1={FILET_Y - 26} x2={FX0} y2={H} stroke={ENCRE} strokeWidth={2.5} opacity={0.4} />
              <line x1={FX1} y1={FILET_Y - 26} x2={FX1} y2={H} stroke={ENCRE} strokeWidth={2.5} opacity={0.4} />
            </g>
          )}

          {/* ===== LE FILET (l'invariant : il ne se detache JAMAIS) ===== */}
          {filetDraw > 0.01 && (() => {
            const len = 1200;
            const maille = [];
            // trame en losanges, densite moderee (elle doit lire comme un filet, pas comme un ornement)
            const N = 22;
            for (let i = 0; i <= N; i++) {
              const t = i / N;
              const [xa, ya] = filetAt(sag, t, "haut");
              const [xb, yb] = filetAt(sag, t, "bas");
              maille.push(<line key={`v${i}`} x1={xa} y1={ya} x2={xb} y2={yb} stroke={OR} strokeWidth={1.1} opacity={0.5 * filetDraw} />);
            }
            for (let i = 0; i < N; i++) {
              const t0 = i / N, t1 = (i + 1) / N;
              const [xa, ya] = filetAt(sag, t0, "haut");
              const [xb, yb] = filetAt(sag, t1, "bas");
              const [xc, yc] = filetAt(sag, t0, "bas");
              const [xd, yd] = filetAt(sag, t1, "haut");
              maille.push(<line key={`d1${i}`} x1={xa} y1={ya} x2={xb} y2={yb} stroke={OR} strokeWidth={1.1} opacity={0.42 * filetDraw} />);
              maille.push(<line key={`d2${i}`} x1={xc} y1={yc} x2={xd} y2={yd} stroke={OR} strokeWidth={1.1} opacity={0.42 * filetDraw} />);
            }
            return (
              <g style={{ filter: filetTient > 0.05 ? `drop-shadow(0 0 ${10 * filetTient}px rgba(217,169,58,0.55))` : undefined }}>
                {maille}
                {/* les 2 bords porteurs, plus epais */}
                <path d={filetPath(sag, "haut")} fill="none" stroke={OR_CLAIR} strokeWidth={4.5}
                  strokeDasharray={len} strokeDashoffset={len * (1 - filetDraw)} opacity={0.85 + 0.15 * filetTient} />
                <path d={filetPath(sag, "bas")} fill="none" stroke={OR_CLAIR} strokeWidth={4.5}
                  strokeDasharray={len} strokeDashoffset={len * (1 - filetDraw)} opacity={0.85 + 0.15 * filetTient} />
              </g>
            );
          })()}

          {/* ===== LE FUNAMBULE (face immobile OU profil qui marche) ===== */}
          {filDraw > 0.55 && persoX < W + 130 && (
            persoMode === "profil" ? (
              <FunambuleProfil x={persoX} y={persoY} tilt={persoTilt}
                // il marche AVANT la chute, et de nouveau quand il repart vers la sortie
                walk={estTombe && !marcheApres ? 0 : walkPhase}
                opacity={ramp(frame, T.persoIn, T.persoIn + 0.5) * fadeAutres} />
            ) : (
              <Funambule x={persoX} y={persoY} tilt={persoTilt} scale={persoScale}
                opacity={ramp(frame, T.persoIn, T.persoIn + 0.5) * fadeAutres} />
            )
          )}

          {/* ===== QUI EST QUI (le trou signale par Aziz : la scene montrait le mecanisme sans
               jamais nommer les acteurs). 2 etiquettes, une seule apparition chacune, au moment ou
               l'acteur entre en jeu. Elles restent ensuite : c'est la cle de lecture de la scene. ===== */}
          {/* la plaque CFA s'efface avec la sortie du personnage : elle le designe, elle ne doit pas
              rester orpheline au-dessus d'un fil vide */}
          <Plaque x={(PERSO_X0 + PERSO_X1) / 2} y={FIL_Y - 108} label="ZONE FRANC CFA"
            op={ramp(frame, T.persoIn + 0.3, T.persoIn + 1.1)
              * (1 - ramp(frame, T.sortie_perso - 1.6, T.sortie_perso - 0.2)) * fadeAutres} />
          <Plaque x={FCX} y={FILET_Y + 108} label="TRÉSOR FRANÇAIS"
            op={ramp(frame, T.filetTend + 0.5, T.filetTend + 1.3) * (1 - ramp(frame, T.sortie, T.sortie + 1.2) * 0.5)} />
        </svg>
      )}

      {/* ===== SCENE 1994 CONSERVEE (murs FMI/FRANCE + signatures + tampon) ===== */}
      {avecScene1994 && toInk > 0.01 && <Mvt3Signature1994 frame={frame} fps={fps} appear={toInk} />}
    </AbsoluteFill>
  );
};

export default FunambuleDecorTest16x9;
