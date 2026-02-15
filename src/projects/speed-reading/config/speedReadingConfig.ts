import { SpeedReadingConfig } from "./types";

export const COLORS = {
  background: "#0A0A0F",
  text: "#FFFFFF",
  secondaryText: "#94A3B8",
  warmup: "#4ADE80",
  level1: "#60A5FA",
  level2: "#FB923C",
  level3: "#EF4444",
  level4: "#A855F7",
  level5: "#EC4899",
  inhuman: "#F59E0B",
} as const;

export const speedReadingConfig: SpeedReadingConfig = {
  title: "Speed Reading Challenge",
  subtitle: "Read each word as it appears on screen",
  hookQuestion: "How fast can YOUR brain read?",
  fps: 30,
  hookDurationInSeconds: 6,
  countdownDurationInSeconds: 5,
  transitionDurationInSeconds: 4,
  outroDurationInSeconds: 10,
  backgroundColor: COLORS.background,
  textColor: COLORS.text,
  secondaryTextColor: COLORS.secondaryText,
  flashThresholdWpm: 500,
  levels: [
    {
      name: "Warm-up",
      wpm: 150,
      accentColor: COLORS.warmup,
      durationInSeconds: 25,
      fontSize: 120,
      successMessage: "Well done. Next level incoming.",
      words: [
        "the", "sun", "rose", "over", "the", "quiet", "hills",
        "birds", "sang", "their", "morning", "song", "while",
        "the", "world", "slowly", "woke", "from", "a", "deep",
        "peaceful", "sleep", "under", "golden", "light", "the",
        "river", "flowed", "gently", "through", "the", "valley",
        "carrying", "leaves", "and", "small", "stones", "along",
        "its", "winding", "path", "toward", "the", "distant",
        "sea", "where", "waves", "crashed", "softly", "on",
        "the", "sandy", "shore", "children", "played", "near",
        "the", "water", "laughing", "with", "pure", "joy",
      ],
    },
    {
      name: "Level 1",
      wpm: 200,
      accentColor: COLORS.level1,
      durationInSeconds: 20,
      fontSize: 115,
      successMessage: "Impressive. Can you keep going?",
      words: [
        "technology", "shapes", "our", "daily", "lives", "in",
        "ways", "we", "rarely", "notice", "from", "the", "moment",
        "we", "wake", "up", "screens", "guide", "our", "choices",
        "and", "connect", "us", "to", "a", "vast", "digital",
        "world", "that", "never", "sleeps", "around", "us",
        "artificial", "intelligence", "is", "changing", "how",
        "we", "work", "learn", "and", "communicate", "with",
        "each", "other", "across", "borders", "and", "languages",
        "the", "future", "belongs", "to", "those", "who",
        "adapt", "quickly", "and", "embrace", "new", "tools",
        "with", "an", "open", "mind",
      ],
    },
    {
      name: "Level 2",
      wpm: 300,
      accentColor: COLORS.level2,
      durationInSeconds: 18,
      fontSize: 110,
      successMessage: "You're doing great. It's about to get intense.",
      words: [
        "the", "ocean", "covers", "more", "than", "seventy",
        "percent", "of", "our", "planet", "yet", "we", "have",
        "explored", "less", "than", "five", "percent", "of",
        "its", "depths", "scientists", "believe", "millions",
        "of", "species", "remain", "undiscovered", "beneath",
        "the", "waves", "waiting", "for", "us", "to", "find",
        "them", "in", "the", "deep", "dark", "waters", "below",
        "where", "light", "cannot", "reach", "strange", "creatures",
        "thrive", "in", "total", "darkness", "using", "bioluminescence",
        "to", "navigate", "hunt", "and", "survive", "the",
        "pressure", "at", "these", "depths", "would", "crush",
        "a", "human", "body", "instantly", "yet", "life",
        "finds", "a", "way", "to", "persist", "and", "flourish",
        "even", "in", "the", "most", "extreme", "conditions",
        "known", "to", "science", "today",
      ],
    },
    {
      name: "Level 3",
      wpm: 400,
      accentColor: COLORS.level3,
      durationInSeconds: 15,
      fontSize: 105,
      successMessage: "Incredible. Only two levels remain.",
      words: [
        "quantum", "physics", "reveals", "that", "particles",
        "can", "exist", "in", "multiple", "states", "at", "once",
        "challenging", "everything", "we", "thought", "we", "knew",
        "about", "reality", "itself", "the", "universe", "is",
        "far", "stranger", "than", "anyone", "could", "have",
        "imagined", "even", "einstein", "struggled", "with",
        "the", "implications", "of", "quantum", "entanglement",
        "calling", "it", "spooky", "action", "at", "a", "distance",
        "today", "researchers", "use", "these", "very", "principles",
        "to", "build", "quantum", "computers", "that", "promise",
        "to", "solve", "problems", "no", "classical", "machine",
        "ever", "could", "from", "drug", "discovery", "to",
        "climate", "modeling", "the", "potential", "is", "limitless",
        "and", "we", "are", "only", "scratching", "the", "surface",
        "of", "what", "is", "possible", "with", "this",
        "revolutionary", "technology", "that", "will", "reshape",
        "our", "entire", "civilization",
      ],
    },
    {
      name: "Level 4",
      wpm: 500,
      accentColor: COLORS.level4,
      durationInSeconds: 12,
      fontSize: 100,
      successMessage: "Amazing. One final challenge.",
      words: [
        "memory", "is", "not", "a", "perfect", "recording",
        "of", "events", "but", "rather", "a", "reconstruction",
        "that", "our", "brain", "creates", "each", "time",
        "we", "recall", "something", "this", "means", "every",
        "memory", "you", "have", "has", "been", "altered",
        "slightly", "by", "your", "current", "emotions", "beliefs",
        "and", "experiences", "false", "memories", "can", "feel",
        "completely", "real", "and", "studies", "show", "that",
        "people", "often", "remember", "events", "that", "never",
        "happened", "at", "all", "the", "brain", "fills",
        "gaps", "with", "plausible", "information", "creating",
        "a", "seamless", "narrative", "that", "feels", "authentic",
        "but", "may", "be", "entirely", "fabricated", "by",
        "your", "own", "mind", "without", "you", "even",
        "knowing", "it", "happened", "this", "is", "why",
        "eyewitness", "testimony", "is", "considered", "unreliable",
        "in", "modern", "courts", "of", "law", "around",
        "the", "world",
      ],
    },
    {
      name: "Level 5",
      wpm: 600,
      accentColor: COLORS.level5,
      durationInSeconds: 10,
      fontSize: 95,
      successMessage: "Unbelievable. Are you ready for inhuman mode?",
      words: [
        "time", "moves", "differently", "depending", "on",
        "where", "you", "are", "and", "how", "fast", "you",
        "travel", "clocks", "on", "satellites", "tick", "slightly",
        "faster", "than", "clocks", "on", "earth", "because",
        "gravity", "warps", "the", "fabric", "of", "spacetime",
        "itself", "astronauts", "on", "the", "space", "station",
        "age", "slightly", "less", "than", "people", "on",
        "the", "ground", "though", "the", "difference", "is",
        "measured", "in", "fractions", "of", "a", "second",
        "over", "months", "if", "you", "could", "travel",
        "near", "the", "speed", "of", "light", "time",
        "would", "slow", "down", "dramatically", "for", "you",
        "while", "years", "passed", "on", "earth", "in",
        "what", "felt", "like", "minutes", "to", "you",
        "this", "is", "real", "physics", "not", "fiction",
        "and", "it", "has", "been", "proven", "many",
        "times", "with", "atomic", "clocks",
      ],
    },
    {
      name: "INHUMAN",
      wpm: 800,
      accentColor: COLORS.inhuman,
      durationInSeconds: 6,
      fontSize: 90,
      successMessage: "",
      words: [
        "consciousness", "remains", "the", "greatest", "mystery",
        "in", "all", "of", "science", "we", "know", "that",
        "billions", "of", "neurons", "firing", "together", "create",
        "subjective", "experience", "but", "nobody", "can", "explain",
        "why", "or", "how", "this", "happens", "some", "scientists",
        "think", "consciousness", "emerges", "from", "complexity",
        "while", "others", "believe", "it", "is", "a",
        "fundamental", "property", "of", "the", "universe", "itself",
        "like", "gravity", "or", "electromagnetism", "the", "hard",
        "problem", "of", "consciousness", "asks", "why", "there",
        "is", "something", "it", "is", "like", "to", "be",
        "you", "reading", "these", "words", "right", "now",
        "and", "no", "one", "has", "an", "answer",
      ],
    },
  ],
};

// Calculate frames per word for a given WPM and FPS
export function getFramesPerWord(wpm: number, fps: number): number {
  return (60 * fps) / wpm;
}

// Calculate total duration of the video in frames
export function getTotalDurationInFrames(config: SpeedReadingConfig): number {
  const {
    fps,
    hookDurationInSeconds,
    countdownDurationInSeconds,
    transitionDurationInSeconds,
    outroDurationInSeconds,
    levels,
  } = config;

  let totalFrames = hookDurationInSeconds * fps;

  for (let i = 0; i < levels.length; i++) {
    totalFrames += countdownDurationInSeconds * fps;
    totalFrames += levels[i].durationInSeconds * fps;
    // Transition after each level except the last
    if (i < levels.length - 1) {
      totalFrames += transitionDurationInSeconds * fps;
    }
  }

  totalFrames += outroDurationInSeconds * fps;

  return totalFrames;
}

// Calculate cumulative word count up to a given level index
export function getCumulativeWordCount(
  config: SpeedReadingConfig,
  levelIndex: number,
  frameInLevel: number
): number {
  const { fps } = config;
  let total = 0;

  // Count all words from previous levels
  for (let i = 0; i < levelIndex; i++) {
    total += config.levels[i].words.length;
  }

  // Add words from current level based on frame
  const currentLevel = config.levels[levelIndex];
  if (currentLevel) {
    const framesPerWord = getFramesPerWord(currentLevel.wpm, fps);
    const wordsInCurrentLevel = Math.min(
      Math.floor(frameInLevel / framesPerWord) + 1,
      currentLevel.words.length
    );
    total += wordsInCurrentLevel;
  }

  return total;
}
