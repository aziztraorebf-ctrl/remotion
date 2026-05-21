// timing.ts — La Peste et le Sahara (Atlas pur)
// Audio: public/atlas/peste-1347/audio/narration-v1.mp3
// Duration: 105.12s | 3153 frames @30fps
// Source: ElevenLabs forced-alignment v1
// Locked: 2026-05-15

const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

// Total composition length
export const TOTAL_FRAMES = 3153;

// ─── BEAT BOUNDARIES ────────────────────────────────────────────────────────

export const BEATS = {
  // [HOOK] "En mil trois cent quarante-sept..." → "continue."
  HOOK_START:         sec(0.079),   //  f  2
  HOOK_END:           sec(7.519),   //  f 225  ("continue.")

  // [SETUP GEO] "Octobre mil trois cent..." → "Mais le Sahara est là."
  SETUP_START:        sec(8.039),   //  f 241
  SETUP_END:          sec(23.000),  //  f 690  ("est là.")

  // [DENSITÉ CESAR] "En Angleterre..." → "Chaque jour."
  DENSITE_START:      sec(23.819),  //  f 714
  DENSITE_END:        sec(40.779),  //  f 1223

  // [CLIMAX — LE BOUCLIER] "La bactérie..." → "Un désert entre les deux."
  CLIMAX_START:       sec(41.399),  //  f 1241
  CLIMAX_END:         sec(76.399),  //  f 2291  ("deux.")

  // [MALI VIVANT] "Pendant ce temps..." → "alimente ses monnaies."
  MALI_START:         sec(77.439),  //  f 2323
  MALI_END:           sec(99.139),  //  f 2974

  // [PUNCHLINE] "Deux épidémies..." → "n'est pas neutre."
  PUNCHLINE_START:    sec(99.180),  //  f 2975
  PUNCHLINE_END:      sec(105.079), //  f 3152
} as const;

// ─── KEY PIVOT WORDS ─────────────────────────────────────────────────────────
// Used for visual beat triggers (annotation, camera moves, overlays)

export const PIVOTS = {
  // Pivot 1 — "Mais le Sahara est là" → map freeze + Sahara highlight
  SAHARA_BOUCLIER:    sec(21.979),  //  f 659  ("Sahara")
  SAHARA_EST_LA:      sec(22.739),  //  f 682  ("là.")

  // Pivot 2 — "Et voici ce qu'elle ne peut pas faire" → carte zooms in on Sahara
  VOICI:              sec(47.819),  //  f 1434

  // Pivot 3 — "Pendant ce temps, Mansa Souleymane" → map shifts to Mali
  PENDANT_CE_TEMPS:   sec(77.439),  //  f 2323
  SOULEYMANE:         sec(79.019),  //  f 2370

  // Punchline — "La géographie n'est pas neutre."
  GEOGRAPHIE:         sec(103.839), //  f 3115
  NEUTRE:             sec(104.759), //  f 3142
} as const;

// ─── STAT CALLOUT FRAMES ─────────────────────────────────────────────────────
// D-SFX: cartouche stat thud vol 1.5 — trigger 3f BEFORE word

export const STATS = {
  // "quarante-six pour cent de la population meurt"
  ANGLETERRE_46PCT:   sec(23.959),  //  f 718
  // "Quatre virgule huit millions d'habitants"
  QUATRE_VIRGULE:     sec(28.000),  //  f 840
  // "Deux virgule six millions survivent"
  DEUX_VIRGULE:       sec(30.899),  //  f 926
  // "sept mille morts par jour"
  SEPT_MILLE:         sec(36.840),  //  f 1105  ("sept")
  // "Traverser le Sahara à dos de chameau prend soixante à quatre-vingt-dix jours"
  TRAVERSER:          sec(50.099),  //  f 1502
  // "deux à six jours" (mort de la Peste)
  DEUX_SIX_JOURS:     sec(56.840),  //  f 1705
} as const;

// ─── CITY MARKERS (B-SFX: marker pin, vol 0.6 — 3f BEFORE word) ──────────────

export const CITIES = {
  SICILE:             sec(11.500),  //  f 345
  CRIMEE:             sec(13.000),  //  f 390
  PARIS:              sec(18.739),  //  f 562
  LONDRES:            sec(19.619),  //  f 588
  STOCKHOLM:          sec(20.420),  //  f 612
  CAIRE:              sec(33.659),  //  f 1009
  MAGHREB:            sec(90.119),  //  f 2703
  FLORENCE:           sec(92.720),  //  f 2781
  VENISE:             sec(93.559),  //  f 2806
} as const;

// ─── PROPAGATION ROUTE TRIGGERS (C-SFX: ink-draw vol 0.85) ──────────────────
// sync with start of route animation on map

export const ROUTES = {
  // "La Peste se propage vers le nord" → propagation wave starts
  PROPAGATION_START:  sec(16.399),  //  f 491
  // "Elle suit les routes maritimes" → maritime routes highlight
  ROUTES_MARITIMES:   sec(45.500),  //  f 1365
  // "L'or du Mali part en caravane" → gold route from Mali
  OR_CARAVANE:        sec(88.059),  //  f 2641
} as const;
