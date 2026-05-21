// Silicon Savannah (Kenya / M-Pesa) — Manifest visuel
// Audio: public/souverain/silicon-savannah/audio/narration-v3.mp3
// Durée: 122.08s — 3662 frames @30fps
// Timestamps source: Whisper API OpenAI (2026-05-14)

export const AUDIO_PATH = "souverain/silicon-savannah/audio/narration-v3.mp3";
export const TOTAL_FRAMES = 3662;
export const FPS = 30;

// ---------------------------------------------------------------------------
// SEGMENTS AUDIO — source: ElevenLabs forced alignment v2 (2026-05-14)
// Crossvalidé avec Whisper API OpenAI (33 segments)
// frame = t * 30
// ---------------------------------------------------------------------------
export const SEG = {
  // Beat 1 — Hook
  hook_line1:           { start:    2, end:  282 }, // "En deux mille vingt-cinq..."
  hook_kenya:           { start:  282, end:  300 }, // "Le Kenya."

  // Beat 2 — Situer 2007
  situer_debut:         { start:  314, end:  364 }, // "Tout commence en deux mille sept."
  situer_mpesa:         { start:  364, end:  627 }, // "Safaricom lance M-Pesa..."
  situer_nokia:         { start:  627, end:  724 }, // "Juste un réseau et un vieux Nokia."

  // Beat 3 — Le miracle
  miracle_18ans:        { start:  724, end:  761 }, // "Dix-huit ans plus tard."
  miracle_kenyans:      { start:  761, end:  971 }, // "Neuf Kenyans sur dix..."
  miracle_300k:         { start:  971, end: 1164 }, // "Trois cent mille points..."
  miracle_familles:     { start: 1164, end: 1362 }, // "Des familles séparées..."
  miracle_fin:          { start: 1362, end: 1429 }, // "C'était une révolution réelle."

  // Beat 4 — Le prix
  prix_intro:           { start: 1429, end: 1466 }, // "Mais voilà ce qu'on dit moins."
  prix_200sh:           { start: 1466, end: 1648 }, // "Deux cents shillings... centime d'euro."
  prix_50k:             { start: 1648, end: 1845 }, // "Cinquante mille... moins d'un euro."
  prix_meme:            { start: 1845, end: 2037 }, // "Même service... pourcentage est élevé."
  prix_bareme:          { start: 2037, end: 2126 }, // "C'est dans le barème officiel."

  // Beat 5 — Le monopole
  monopole_debut:       { start: 2126, end: 2432 }, // "La Banque Centrale... réglementaire complet."
  monopole_testlearn:   { start: 2432, end: 2475 }, // "approche test-and-learn."
  monopole_7ans:        { start: 2475, end: 2711 }, // "Sept ans pendant lesquels..."
  monopole_rails1:      { start: 2711, end: 2738 }, // "Un seul service."
  monopole_rails2:      { start: 2761, end: 2826 }, // "Les rails de tout un pays."

  // Beat 6 — La question
  question_sorti:       { start: 2826, end: 2964 }, // "M-Pesa a sorti... C'est vrai."
  question_rails:       { start: 2964, end: 3287 }, // "Et les rails... entreprise privée."
  question_bon_mauvais: { start: 3287, end: 3398 }, // "La question n'est pas..."
  question_qui:         { start: 3398, end: 3489 }, // "La question c'est : qui décide ?"

  // Beat 7 — CTA
  cta_pays:             { start: 3489, end: 3592 }, // "Et dans ton pays..."
  cta_etat:             { start: 3592, end: 3629 }, // "Une entreprise privée ou l'État ?"
  cta_reponds:          { start: 3629, end: 3667 }, // "Réponds en commentaire."
};

// ---------------------------------------------------------------------------
// BEATS — mapping template + timing
// ---------------------------------------------------------------------------
export const BEATS = {

  // BEAT 1 — Hook (0-302f ~10s)
  // Template: BrutalHeadline (Ken Burns + typewriter mot par mot)
  // Fond: photo B&W Nairobi skyline (à générer Gemini)
  beat1: {
    template: "BrutalHeadline",
    startFrame: 0,
    endFrame: 343,          // overlap 1s avec Beat2 (situer_debut f=314 + 30f)
    props: {
      lines: [
        "En 2025, un pays africain",
        "a la plus forte pénétration",
        "de paiements mobiles au monde.",
        "",
        "Pas la Chine. Pas les États-Unis.",
        "",
        "Le Kenya.",
      ],
      typewriterMode: "word",       // mot par mot
      kenBurns: { scale: [1.0, 1.08], duration: 327 },
      backgroundImage: "souverain/silicon-savannah/assets/nairobi-illustration-v2.jpg",
      textColor: "#f5efe0",
      accentColor: "#FFB800",
    },
    subtitles: [],
  },

  // BEAT 2 — Situer 2007 (328-688f ~12s)
  // Template: CartoCaspian Sepia + SplitFlap pour la date
  // Mapbox: zoom Afrique → Kenya, highlight Kenya, labels Nairobi/Mombasa
  beat2: {
    template: "CartoCaspianSepia",
    startFrame: 314,
    endFrame: 754,          // overlap 1s avec Beat3 (miracle_18ans f=724 + 30f)
    props: {
      palette: "CASPIAN_SEPIA",
      camera: {
        startZoom: 2.0,
        endZoom: 5.0,
        startLat: 0, startLon: 20,
        endLat: 0.023, endLon: 37.906,  // Kenya centroid
        pitch: [0, 15],
      },
      highlightCountry: "KEN",
      highlightColor: "#FFB800",
      labels: [
        { name: "NAIROBI", lat: -1.286, lon: 36.818, appearsAt: 364 },
        { name: "MOMBASA", lat: -4.043, lon: 39.668, appearsAt: 450 },
        { name: "KISUMU",  lat: -0.102, lon: 34.762, appearsAt: 530 },
      ],
    },
    // SplitFlap "6 MARS 2007" overlay centré bas d'écran
    overlay: {
      template: "SplitFlap",
      appearsAt: 364,        // quand "Safaricom lance M-Pesa" f=364
      disappearsAt: 724,
      props: {
        rows: [
          { content: "M-PESA",  type: "text" },
          { content: "6 MARS 2007", type: "text" },
        ],
        position: "bottom-center",
      },
    },
    subtitles: [
      {
        text: "Un modèle que la Banque Mondiale citera comme référence mondiale.",
        appearsAt: 627,
        disappearsAt: 724,
        style: "caption-discret",
      },
    ],
  },

  // BEAT 3 — Le miracle (715-1364f ~22s)
  // Template: RadarPing (réseau qui pulse) puis PulseNumber (91%)
  beat3: {
    template: "RadarPing",
    startFrame: 724,
    endFrame: 1060,         // cut vers PulseNumber sur "Trois cent mille" f=971
    props: {
      centerLabel: "M-PESA",
      stat1: { value: "50M+", label: "UTILISATEURS" },
      stat2: { value: "54 PAYS", label: "ACCESSIBLES" },
      pulseColor: "#FFB800",
    },
    // Cut vers PulseNumber à f=971 ("Trois cent mille points...")
    nextBeat: {
      template: "PulseNumber",
      startFrame: 971,
      endFrame: 1459,       // overlap 1s avec Beat4 (prix_intro f=1429 + 30f)
      props: {
        value: "91%",
        label: "DES KENYANS",
        sublabel: "compte mobile money actif",
        pulseColor: "#FFB800",
      },
    },
    subtitles: [
      {
        text: "Communications Authority Kenya 2025 · Safaricom 2025",
        appearsAt: 971,
        disappearsAt: 1164,
        style: "source-discret",
      },
    ],
  },

  // BEAT 4 — Le prix (1387-2057f ~22s)
  // Template: BarRace — frais Safaricom par montant (barres inversées)
  // 2s silence visuel avant voix (barres apparaissent avant narration)
  beat4: {
    template: "BarRace",
    startFrame: 1369,       // apparaît 2s avant narration (prix_intro f=1429 - 60f)
    endFrame: 2156,         // overlap 1s avec Beat5 (monopole_debut f=2126 + 30f)
    props: {
      title: "FRAIS M-PESA",
      orientation: "horizontal",
      data: [
        { label: "100 KES envoyés",    value: 5.00,  unit: "%" },
        { label: "200 KES envoyés",    value: 3.50,  unit: "%" },
        { label: "1 000 KES envoyés",  value: 1.40,  unit: "%" },
        { label: "50 000 KES envoyés", value: 0.22,  unit: "%" },
      ],
      highlightFirst: true,
      note: "Barème officiel Safaricom 2025",
      animateFrom: 1429,    // barres s'allongent dès "Mais voilà" f=1429
    },
    subtitles: [
      {
        text: "Safaricom tarifs 2025",
        appearsAt: 2037,
        disappearsAt: 2126,
        style: "source-discret",
      },
    ],
  },

  // BEAT 5 — Le monopole (2089-2797f ~24s)
  // Template: CountdownReveal "7 ANS" + TimelineFracture (2007→2014)
  beat5: {
    template: "CountdownReveal",
    startFrame: 2126,
    endFrame: 2505,         // cut vers TimelineFracture sur "Sept ans pendant" f=2475 + 30f
    props: {
      value: 7,
      unit: "ANS",
      label: "SANS CADRE RÉGLEMENTAIRE COMPLET",
      sublabel: "2007 → 2014",
      arcColor: "#FFB800",
    },
    // Cut vers TimelineFracture à f=2475 ("Sept ans pendant lesquels...")
    nextBeat: {
      template: "TimelineFracture",
      startFrame: 2475,
      endFrame: 2856,       // overlap 1s avec Beat6 (question_sorti f=2826 + 30f)
      props: {
        icon: "Crown",
        events: [
          { date: "2007", label: "LANCEMENT M-PESA", side: "avant" },
          { date: "2014", label: "NPS REGULATIONS",  side: "après" },
        ],
        glowColor: "#FFB800",
      },
    },
    subtitles: [
      {
        text: "Les flux bruts de M-Pesa représentent plusieurs fois le PIB kenyan en volume de transactions annuelles.",
        appearsAt: 2711,
        disappearsAt: 2826,
        style: "caption-discret",
      },
      {
        text: "National Payment System Regulations 2014",
        appearsAt: 2761,
        disappearsAt: 2826,
        style: "source-discret",
      },
    ],
  },

  // BEAT 6 — La question (2829-3450f ~21s)
  // Template: BrutalHeadline fond noir pur + WordExplode sur "QUI DÉCIDE ?"
  beat6: {
    template: "BrutalHeadline",
    startFrame: 2826,
    endFrame: 3428,         // overlap vers WordExplode (question_qui f=3398 + 30f)
    props: {
      backgroundImage: null,     // fond noir pur
      backgroundColor: "#000000",
      lines: [
        "M-Pesa a sorti des millions",
        "de Kenyans de l'exclusion financière.",
        "",
        "C'est vrai.",
        "",
        "Et les rails sur lesquels circule",
        "cet argent — ton salaire,",
        "tes urgences —",
        "appartiennent à une seule",
        "entreprise privée.",
      ],
      typewriterMode: "line",
      textColor: "#f5efe0",
    },
    // WordExplode sur "QUI DÉCIDE ?" à f=3394
    nextBeat: {
      template: "WordExplode",
      startFrame: 3398,
      endFrame: 3519,         // overlap 1s avec Beat7 (cta_pays f=3489 + 30f)
      props: {
        word: "QUI DÉCIDE ?",
        explodeFrame: 3420,   // explose après "La question c'est"
        reformFrame: 3450,    // se stabilise sur "qui décide ?"
        glowColor: "#FFB800",
        subtitle: "La question n'est pas si M-Pesa est bon ou mauvais.",
      },
    },
  },

  // BEAT 7 — CTA (3466-3662f ~7s)
  // Template: TypeReveal — texte simple qui s'écrit
  beat7: {
    template: "TypeReveal",
    startFrame: 3489,
    endFrame: 3662,
    props: {
      lines: [
        "Et dans ton pays —",
        "qui contrôle ces rails ?",
        "",
        "Une entreprise privée ou l'État ?",
        "",
        "Réponds en commentaire.",
      ],
      typewriterMode: "word",
      backgroundColor: "#000000",
      textColor: "#f5efe0",
      accentColor: "#FFB800",
      // Logo KART + KORA overlay en bas
      showLogos: true,
    },
  },
};

// ---------------------------------------------------------------------------
// ASSETS VISUELS À GÉNÉRER
// ---------------------------------------------------------------------------
export const ASSETS_TODO = [
  // Beat 1
  {
    id: "nairobi-bw",
    dest: "public/souverain/silicon-savannah/assets/nairobi-bw.jpg",
    prompt: "Black and white aerial photo of Nairobi skyline, golden hour, dramatic clouds, ultra sharp, documentary style, 9:16 vertical format",
    tool: "Gemini",
    status: "TODO",
  },
];

// ---------------------------------------------------------------------------
// SOUS-TITRES GLOBAUX (à l'écran uniquement — jamais dits à l'oral)
// ---------------------------------------------------------------------------
export const SCREEN_CAPTIONS = [
  // Beat 2 — après "Nokia" (f=627)
  { text: "Un modèle que la Banque Mondiale citera comme référence mondiale.", frame: 627, duration: 90, style: "caption-discret" },
  // Beat 3 — sur "Trois cent mille" (f=971)
  { text: "Communications Authority Kenya 2025 · Safaricom 2025", frame: 971, duration: 90, style: "source-discret" },
  // Beat 4 — sur "barème officiel" (f=2037)
  { text: "Safaricom tarifs 2025", frame: 2037, duration: 80, style: "source-discret" },
  // Beat 5 — sur "Un seul service" (f=2711)
  { text: "Les flux bruts de M-Pesa représentent plusieurs fois le PIB kenyan en volume de transactions annuelles.", frame: 2711, duration: 90, style: "caption-discret" },
  { text: "National Payment System Regulations 2014", frame: 2761, duration: 60, style: "source-discret" },
];
