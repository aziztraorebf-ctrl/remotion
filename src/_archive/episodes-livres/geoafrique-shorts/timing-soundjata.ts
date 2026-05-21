/**
 * Soundjata Keita — Heros Oublies #3
 * Timing table derivee de transcription Whisper (OpenAI API) sur narration-full.mp3
 *
 * Audio source : public/assets/library/geoafrique/heros-oublies/soundjata/narration-full.mp3
 * Duree totale : 129.12 secondes @ 30fps
 * Total frames : 3874
 *
 * Transcription brute : tmp/whisper-soundjata/narration-full.json
 *
 * Note de transcription :
 *   - "Mema" transcrit "mes mains" par Whisper (fausse detection, audio correct)
 *   - Dates ("1235", "1236", "44", "800") lues en lettres dans l'audio
 */

export const FPS = 30;
export const SOUNDJATA_DURATION_S = 129.12;
export const SOUNDJATA_TOTAL_FRAMES = Math.round(SOUNDJATA_DURATION_S * FPS); // 3874

const s = (seconds: number) => Math.round(seconds * FPS);

/**
 * Scenes narratives mappees aux timestamps audio reels.
 * Chaque scene a : start/end (frames), text (pour reference), visualNote (asset strategy)
 */
export const SCENES = {
  // ─── ACT 1 : SETUP ───
  tyrannie: {
    start: s(0.00),
    end: s(4.94),
    text: "XIIIe siecle, le pays mandingue est ecrase sous la tyrannie d'un roi-sorcier.",
    visualNote: "Plan wide sombre — village mandingue sous tyrannie, tons desatures",
  },
  prophetie: {
    start: s(5.38),
    end: s(9.48),
    text: "Mais une prophetie circule, un enfant naitra qui liberera le peuple.",
    visualNote: "Feu de conseil, griots, symbole prophetique",
  },
  handicap: {
    start: s(9.78),
    end: s(12.12),
    text: "Le probleme, cet enfant ne peut pas marcher.",
    visualNote: "Enfant au sol, contraste avec autres enfants debout",
  },

  // ─── ACT 2 : HUMILIATION ───
  soundjataRampe: {
    start: s(12.64),
    end: s(15.68),
    text: "Il s'appelle Soundjata, il rampe a quatre pattes.",
    visualNote: "Close sur Soundjata rampant, poussiere rouge",
  },
  epouseRidiculise: {
    start: s(15.76),
    end: s(18.20),
    text: "La premiere epouse de son pere le ridiculise.",
    visualNote: "Cour royale — rivale dominante, regards narquois",
  },
  humiliationMere: {
    start: s(18.66),
    end: s(20.82),
    text: "Elle humilie sa mere devant tout le village.",
    visualNote: "Setup face-a-face — clip dialogue potentiel SUIT ici",
  },
  insulte: {
    start: s(21.22),
    end: s(28.78),
    text: "Elle lui lance: au moins mon fils peut cueillir des feuilles de baobab. Le tien ne sait meme pas se lever.",
    visualNote:
      "DECISION CLE — soit (a) narratrice lit l'insulte + visuel statique, " +
      "soit (b) remplacer cet audio par clip dialogue Matrone + assets deja crees " +
      "(insult-clip-v1.mp4 + insult-dialogue.mp3). Duree dispo : 7.56s.",
  },

  // ─── ACT 3 : TRANSFORMATION ───
  reaction: {
    start: s(28.78),
    end: s(31.64),
    text: "Cette insulte va changer l'histoire de l'Afrique de l'Ouest.",
    visualNote: "Zoom dramatique sur Soundjata qui leve les yeux, decision dans le regard",
  },
  barreDeFer: {
    start: s(32.06),
    end: s(37.50),
    text: "Soundjata se fait apporter une barre de fer, il la plante dans le sol et il se hisse debout.",
    visualNote:
      "ASSET EXISTANT : soundjata-iron-bar-v1.mp4 (15s disponible, a couper/aligner)",
  },
  barreTord: {
    start: s(37.88),
    end: s(41.02),
    text: "La barre se tord sous sa force, tordue comme un arc.",
    visualNote: "Suite clip iron-bar — moment culminant de l'effort",
  },
  baobab: {
    start: s(41.40),
    end: s(46.08),
    text: "Il sort, arrache un baobab entier et le depose aux pieds de sa mere.",
    visualNote: "Clip A GENERER — Soundjata arrache baobab, le depose",
  },
  neRamperaPlus: {
    start: s(46.42),
    end: s(47.72),
    text: "Il ne rampera plus jamais.",
    visualNote: "Close final sur Soundjata debout, resolution",
  },

  // ─── ACT 4 : EXIL ET RETOUR ───
  exil: {
    start: s(48.44),
    end: s(52.14),
    text: "Chasse par la jalousie de la cour, il s'exile loin de sa terre.",
    visualNote: "Clip A GENERER — Soundjata quitte le village, wide shot",
  },
  mema: {
    start: s(52.92),
    end: s(56.44),
    text: "Sept longues annees a Mema, a apprendre, a attendre.",
    visualNote: "Clip A GENERER — Soundjata chasseur/guerrier a Mema",
  },
  messagers: {
    start: s(56.44),
    end: s(62.76),
    text: "Quand le roi-sorcier Soumaoro ecrase son peuple, des messagers traversent tout le pays pour le retrouver.",
    visualNote: "Clip A GENERER — cavaliers qui traversent la savane",
  },
  lionRevient: {
    start: s(63.32),
    end: s(64.88),
    text: "Le lion du Manden revient.",
    visualNote: "Moment heroique — Soundjata monte a cheval, lever de soleil",
  },

  // ─── ACT 5 : KIRINA ───
  soumaoroInvulnerable: {
    start: s(65.52),
    end: s(68.76),
    text: "Soumaoro est invulnerable, aucune arme ne le touche.",
    visualNote: "Clip A GENERER — Soumaoro sombre, fleches qui rebondissent",
  },
  secretCoq: {
    start: s(69.26),
    end: s(73.46),
    text: "Soundjata decouvre son secret, l'animal sacre du sorcier est le coq.",
    visualNote: "Plan revelation — coq, symbole mystique",
  },
  flecheCoq: {
    start: s(73.80),
    end: s(77.54),
    text: "Il fait forger une fleche avec un ergot de coq a sa pointe.",
    visualNote: "Clip A GENERER — forge, ergot fixe sur fleche",
  },
  kirinaDate: {
    start: s(78.00),
    end: s(80.22),
    text: "Bataille de Kirina, douze cent trente-cinq.",
    visualNote: "Wide aerial shot bataille massive, armees face a face",
  },
  flecheAtteint: {
    start: s(80.58),
    end: s(83.86),
    text: "La fleche atteint Soumaoro, ses pouvoirs disparaissent.",
    visualNote: "Clip A GENERER — fleche qui vole, Soumaoro touche, fumee",
  },
  tyranFuite: {
    start: s(83.86),
    end: s(87.28),
    text: "Le tyran s'enfuit dans la montagne et ne revient jamais.",
    visualNote: "Silhouette de Soumaoro qui disparait dans la brume montagneuse",
  },

  // ─── ACT 6 : EMPIRE ET CHARTE ───
  empireFonde: {
    start: s(87.70),
    end: s(92.56),
    text: "Soundjata fonde l'Empire du Mali, le plus vaste, le plus riche d'Afrique de l'Ouest.",
    visualNote: "Carte animee de l'empire qui s'etend (pipeline HistoricalMap)",
  },
  extraordinaire: {
    start: s(92.82),
    end: s(94.88),
    text: "Et il fait quelque chose d'extraordinaire.",
    visualNote: "Transition tension — Soundjata en assemblee",
  },
  charte: {
    start: s(95.34),
    end: s(98.84),
    text: "En douze cent trente-six, il proclame la Charte du Manden.",
    visualNote: "Clip A GENERER — Soundjata debout devant assemblee, discours",
  },
  quaranteQuatre: {
    start: s(99.52),
    end: s(100.32),
    text: "Quarante-quatre articles.",
    visualNote: "Texte anime : 44 articles, manuscrit/parchemin",
  },
  droitsArticles: {
    start: s(100.88),
    end: s(104.36),
    text: "Droits a la vie, protection des femmes, dignite des captifs.",
    visualNote: "3 icones symboliques, texte anime",
  },
  huitCents: {
    start: s(104.88),
    end: s(108.26),
    text: "Huit cents ans avant la Declaration universelle des droits de l'homme.",
    visualNote: "Comparaison temporelle visuelle — punch line historique",
  },

  // ─── ACT 7 : LEGENDE VIVANTE ───
  griots: {
    start: s(108.98),
    end: s(111.70),
    text: "Aujourd'hui encore, les griots du Mali chantent son nom.",
    visualNote: "Clip A GENERER — griot moderne qui chante, kora, feu de camp",
  },
  boucheOreille: {
    start: s(111.70),
    end: s(116.64),
    text: "Pas dans les livres, de bouche a oreille, de pere en fils, depuis huit siecles.",
    visualNote: "Suite clip griot — transmission orale",
  },
  pasDeVersion: {
    start: s(117.00),
    end: s(119.80),
    text: "Il n'existe pas de version definitive de son histoire.",
    visualNote: "Multiples griots, variations visuelles",
  },
  chaqueGriot: {
    start: s(120.30),
    end: s(122.20),
    text: "Chaque griot la raconte a sa maniere.",
    visualNote: "Fondu enchaine griots",
  },

  // ─── CLOSE ───
  enfantRampait: {
    start: s(122.70),
    end: s(126.26),
    text: "Un enfant qui rampait a quatre pattes a fonde un empire.",
    visualNote: "Flashback rapide — enfant rampant -> empereur assis",
  },
  close: {
    start: s(126.56),
    end: s(129.10),
    text: "Et pourtant, l'histoire a presque oublie son nom.",
    visualNote: "Close identite serie — silhouette Soundjata, fade to black",
  },
} as const;

export type SceneId = keyof typeof SCENES;

/**
 * Scenes groupees par ACTE pour le storyboard visuel
 */
export const ACTS = {
  I_setup: ["tyrannie", "prophetie", "handicap"],
  II_humiliation: ["soundjataRampe", "epouseRidiculise", "humiliationMere", "insulte"],
  III_transformation: ["reaction", "barreDeFer", "barreTord", "baobab", "neRamperaPlus"],
  IV_exilRetour: ["exil", "mema", "messagers", "lionRevient"],
  V_kirina: [
    "soumaoroInvulnerable",
    "secretCoq",
    "flecheCoq",
    "kirinaDate",
    "flecheAtteint",
    "tyranFuite",
  ],
  VI_empireCharte: [
    "empireFonde",
    "extraordinaire",
    "charte",
    "quaranteQuatre",
    "droitsArticles",
    "huitCents",
  ],
  VII_legende: ["griots", "boucheOreille", "pasDeVersion", "chaqueGriot"],
  VIII_close: ["enfantRampait", "close"],
} as const satisfies Record<string, readonly SceneId[]>;
