// Abou Bakari II — timing V2 derives de Whisper sur abou-bakari-v2-full-v3.mp3
// Audio total : 92.60s @ 30fps
// NE PAS modifier manuellement — source : tmp/whisper-v3/abou-bakari-v2-full-v3.json
// Script V2 (Seedance-native) — pauses courtes, accents corriges, dialogue 3 voix
// Generation : 2026-03-31

export const FPS = 30;
export const AUDIO_DURATION_S = 92.6;
export const TOTAL_FRAMES = Math.ceil(AUDIO_DURATION_S * FPS); // 2778

const s = (seconds: number) => Math.round(seconds * FPS);

// Timings derives de Whisper tiny (fr) sur audio V3 (92.6s)
// Segments Whisper mappes aux beats du script V2
// Les 'end' sont etendus jusqu'au 'start' du beat suivant pour couvrir les pauses
export const BEATS = {
  // Beat 1 — Hook Geo (narration)
  // "En 1311, l'ocean Atlantique n'est qu'un mur de brouillard.
  //  Personne n'ose regarder vers l'ouest. Sauf un homme."
  hookGeo: {
    start: s(0.0),
    end: s(10.6),
    durationS: 10.6,
  },

  // Beat 2 — Empire (narration)
  // "Abou Bakari deux. Mansa du Mali. Roi des rois.
  //  Il regne sur l'empire le plus riche du monde. Mais l'horizon le hante."
  empire: {
    start: s(10.6),
    end: s(24.6),
    durationS: 14.0,
  },

  // Beat 3 — Premiere expedition (narration)
  // "Il fait armer deux mille pirogues. Un seul bateau revient.
  //  Le capitaine tremble de peur. Un courant geant. On ne passe pas."
  expedition: {
    start: s(24.6),
    end: s(35.32),
    durationS: 10.72,
  },

  // Beat 4 — Decision (narration)
  // "Abou Bakari ne recule pas. Il abdique. Il quitte son trone, son or, son pouvoir."
  decision: {
    start: s(35.32),
    end: s(40.32),
    durationS: 5.0,
  },

  // Beat 5 — Dialogue (3 voix)
  // Abou Bakari: "L'empire est a toi, Moussa. Protege-le."
  // Moussa: "Et toi, ou iras-tu ?"
  // Abou Bakari: "La ou personne n'est jamais alle."
  dialogue: {
    start: s(40.32),
    end: s(49.36),
    durationS: 9.04,
  },

  // Beat 5b — Moussa (narration)
  // "Son demi-frere monte sur le trone. Mansa Moussa.
  //  L'homme le plus riche de toute l'histoire humaine. 400 milliards de dollars."
  moussa: {
    start: s(49.36),
    end: s(64.6),
    durationS: 15.24,
  },

  // Beat 6 — Depart final + flotte (narration)
  // "Et Abou Bakari monte lui-meme a bord. Des milliers d'hommes le suivent.
  //  Le plus grand voyage maritime de l'histoire. Il ne reviendra jamais."
  depart: {
    start: s(64.6),
    end: s(76.12),
    durationS: 11.52,
  },

  // Beat 7 — Colomb (narration)
  // "Cent quatre-vingt-un ans plus tard, un marin genois traverse le meme ocean.
  //  Et c'est son nom que le monde retient. Christophe Colomb. Le decouvreur."
  colomb: {
    start: s(76.12),
    end: s(84.76),
    durationS: 8.64,
  },

  // Beat 8 — CTA (narration)
  // "Mais qui a fait la traversee en premier ?
  //  L'Afrique a une histoire qu'on te cache, et une actualite qu'on te simplifie.
  //  Pour en savoir plus, le lien est en bio."
  cta: {
    start: s(84.76),
    end: s(92.6),
    durationS: 7.84,
  },
} as const;

// Recap durees beats (pour generation clips Seedance)
// hookGeo    : 10.6s  -> REUTILISE Remotion V1 (geo zoom)
// empire     : 14.0s  -> NOUVEAU Seedance 80cr (cite Tombouctou vivante)
// expedition : 10.7s  -> NOUVEAU Seedance 80cr (flotte depart + retour 1 navire)
// decision   :  5.0s  -> REUTILISE Seedance Test 2 coupe
// dialogue   :  9.0s  -> NOUVEAU Seedance 120cr (face a face palais)
// moussa     : 15.2s  -> NOUVEAU Seedance ou Remotion (trone + caravanes)
// depart     : 11.5s  -> V2V sur Test 3 120cr (POV proue + flotte)
// colomb     :  8.6s  -> A definir 0-120cr (contraste froid)
// cta        :  7.8s  -> Remotion pur (silhouette + texte)
