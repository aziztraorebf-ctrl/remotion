// Abou Bakari II — timing derives de ElevenLabs forced-alignment sur abou-bakari-narratrice-v1.mp3
// Audio total : 82.76s = 2483 frames @ 30fps
// NE PAS modifier manuellement — source : public/audio/abou-bakari/abou-bakari-alignment.json
// Script V5 valide 2026-03-14

export const FPS = 30;
export const AUDIO_DURATION_S = 82.76;
export const TOTAL_FRAMES = Math.ceil(AUDIO_DURATION_S * FPS); // 2483

const s = (seconds: number) => Math.round(seconds * FPS);

// Timings derives de ElevenLabs forced-alignment (word-level)
// start = start du premier mot du beat, end = end du dernier mot du beat
// Les silences entre phrases sont absorbes dans le beat precedent (end = end dernier mot, pas start mot suivant)
export const BEATS = {
  ocean: {
    start: s(0.119),
    end: s(13.500),   // "En 1311... sauf un homme qui a un ardent desir de savoir."
    durationS: 13.381,
    text: "En 1311, l'océan Atlantique n'est qu'un mur de brouillard. Personne n'ose regarder vers l'ouest. Sauf un homme qui a un ardent désir de savoir.",
  },
  empire: {
    start: s(13.799),
    end: s(22.699),   // "Abou Bakari deux. Mansa du Mali... Hante par l'horizon."
    durationS: 8.900,
    text: "Abou Bakari deux. Mansa du Mali. Roi des rois. Il règne sur l'empire le plus riche du monde. Hanté par l'horizon.",
  },
  fleet: {
    start: s(23.059),
    end: s(39.079),   // "Il fait preparer deux mille pirogues... On ne passe pas."
    durationS: 16.020,
    text: "Il fait préparer deux mille pirogues. Un seul bateau revient. Le capitaine est terrifié. Un courant géant. On ne passe pas.",
  },
  name: {
    start: s(39.139),
    end: s(51.999),   // "Abou Bakari ne recule pas... Il ne reviendra jamais."
    durationS: 12.860,
    text: "Abou Bakari ne recule pas. Il abdique. Il quitte son trône, son or, son pouvoir. Il monte lui-même à bord. Il ne reviendra jamais.",
  },
  abdication: {
    start: s(53.579),
    end: s(66.899),   // "Son demi-frere... 400 milliards de dollars."
    durationS: 13.320,
    text: "Son demi-frère monte sur le trône. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. 400 milliards de dollars.",
  },
  obsession: {
    start: s(67.000),
    end: s(72.859),   // "Abou Bakari avait tout abandonne... a l'ouest."
    durationS: 5.859,
    text: "Abou Bakari avait tout abandonné pour une seule obsession : savoir ce qu'il y avait à l'ouest.",
  },
  colomb: {
    start: s(72.900),
    end: s(79.319),   // "Cent quatre-vingt-un ans plus tard... On l'appelle le decouvreur."
    durationS: 6.419,
    text: "Cent quatre-vingt-un ans plus tard, Christophe Colomb traverse le même océan. On l'appelle le découvreur.",
  },
  close: {
    start: s(79.419),
    end: s(82.760),   // "Mais qui a traverse en premier ? Et toi tu savais ca ?"
    durationS: 3.341,
    text: "Mais qui a traversé en premier ? Et toi... tu savais ça ?",
  },
  cta: {
    start: s(82.760),
    end: s(82.760 + 5.76),  // Beat09 CTA audio : 5.76s
    durationS: 5.76,
    text: "Si cette histoire t'a surpris, laisse un commentaire. Et si tu veux la version longue, abonne-toi.",
  },
} as const;

export const TOTAL_FRAMES_WITH_CTA = Math.ceil((82.760 + 5.76) * FPS); // 2657

// Recap durees beats (alignment ElevenLabs — pour generation clips Kling)
// ocean     : 13.4s  → clip 10s + freeze 3s en fin acceptable
// empire    :  8.9s  → clip 5s ou 10s (8.9s < 10s OK)
// fleet     : 16.0s  → clip 10s + SVG Remotion pour combler (pause 3s dans le beat = normal)
// name      : 12.9s  → clip 10s + extension SVG
// abdication: 13.3s  → clip 10s + extension SVG (pause 1.6s avant "Son" incluse)
// obsession :  5.9s  → clip 5s ou SVG Remotion pur
// colomb    :  6.4s  → clip 5s ou SVG Remotion pur
// close     :  3.3s  → SVG Remotion pur (trop court pour Kling)
