// Abou Bakari II — timing derives de Whisper sur abou-bakari-v5-full.mp3
// Audio total : 83.08s = 2493 frames @ 30fps
// NE PAS modifier manuellement — source : tmp/whisper-v5/abou-bakari-v5-full.json
// Script V5 valide 2026-03-14

export const FPS = 30;
export const AUDIO_DURATION_S = 83.08;
export const TOTAL_FRAMES = Math.ceil(AUDIO_DURATION_S * FPS); // 2493

const s = (seconds: number) => Math.round(seconds * FPS);

// Timings derives de Whisper tiny (fr) sur audio V5
// Les 'end' etendus jusqu'au 'start' du beat suivant pour couvrir silences
export const BEATS = {
  ocean: {
    start: s(0.0),
    end: s(13.60),   // "En 1311... sauf un homme qui a un ardent desir de savoir."
    durationS: 13.60,
    text: "En 1311, l'océan Atlantique n'est qu'un mur de brouillard. Personne n'ose regarder vers l'ouest. Sauf un homme qui a un ardent désir de savoir.",
  },
  empire: {
    start: s(13.60),
    end: s(25.68),   // "Abou Bakari deux. Mansa du Mali... l'ocean n'a pas de fin."
    durationS: 12.08,
    text: "Abou Bakari deux. Mansa du Mali. Roi des rois. Il règne sur l'empire le plus riche du monde. Hanté par l'horizon.",
  },
  fleet: {
    start: s(25.68),
    end: s(38.88),   // "Il fait preparer 2000 pirogues... on ne passe pas."
    durationS: 13.20,
    text: "Il fait préparer deux mille pirogues. Un seul bateau revient. Le capitaine est terrifié. Un courant géant. On ne passe pas.",
  },
  name: {
    start: s(38.88),
    end: s(53.28),   // "Abou Bakari ne recule pas... Il ne reviendra jamais."
    durationS: 14.40,
    text: "Abou Bakari ne recule pas. Il abdique. Il quitte son trône, son or, son pouvoir. Il monte lui-même à bord. Il ne reviendra jamais.",
  },
  abdication: {
    start: s(53.28),
    end: s(66.68),   // "Son demi-frere... 400 milliards de dollars."
    durationS: 13.40,
    text: "Son demi-frère monte sur le trône. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. 400 milliards de dollars.",
  },
  obsession: {
    start: s(66.68),
    end: s(72.68),   // "Abou Bakari avait tout abandonne... a l'ouest."
    durationS: 6.00,
    text: "Abou Bakari avait tout abandonné pour une seule obsession : savoir ce qu'il y avait à l'ouest.",
  },
  colomb: {
    start: s(72.68),
    end: s(79.08),   // "1181 ans plus tard... On l'appelle le decouvreur."
    durationS: 6.40,
    text: "Cent quatre-vingt-un ans plus tard, Christophe Colomb traverse le même océan. On l'appelle le découvreur.",
  },
  close: {
    start: s(79.08),
    end: s(83.08),   // "Mais qui a traverse en premier ? Et toi tu savais ca ?"
    durationS: 4.00,
    text: "Mais qui a traversé en premier ? Et toi... tu savais ça ?",
  },
  cta: {
    start: s(83.08),
    end: s(83.08 + 5.76),  // Beat09 CTA audio : 5.76s
    durationS: 5.76,
    text: "Si cette histoire t'a surpris, laisse un commentaire. Et si tu veux la version longue, abonne-toi.",
  },
} as const;

export const TOTAL_FRAMES_WITH_CTA = Math.ceil((83.08 + 5.76) * FPS); // 2666

// Recap durees beats (pour generation clips Kling)
// ocean     : 13.6s  → clip 10s insuffisant, regenerer en 10s (freeze 3.6s en fin acceptable si image fixe)
// empire    : 12.1s  → clip 10s insuffisant, regenerer en 10s
// fleet     : 13.2s  → clip 10s + SVG Remotion pour combler
// name      : 14.4s  → clip 10s + extension SVG
// abdication: 13.4s  → clip 10s + extension SVG
// obsession :  6.0s  → clip 5s ou SVG Remotion pur
// colomb    :  6.4s  → clip 5s ou SVG Remotion pur
// close     :  4.0s  → SVG Remotion pur (trop court pour Kling)
