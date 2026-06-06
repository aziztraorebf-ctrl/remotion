/**
 * warmap/schema.ts — CANONICAL CONTRACT for the War-Map pillar (carte temporelle vivante).
 *
 * Single source of truth: one WarMapDataset (1 jalons file) -> the engine derives EVERYTHING
 * via adapter.ts (canonicalToEngine). This schema is a SUPERSET of the engine's runtime data
 * contract (WarMapEngine.tsx) plus PROVENANCE (where each fact comes from, confidence, verified).
 *
 * Design rules:
 *  - control accepts EITHER a bare number OR {value, prov} so hand-authored data stays terse
 *    while the research pipeline attaches per-state provenance only where it matters.
 *  - dates are canonical ISO "YYYY-MM-DD" here; the adapter converts to the engine display
 *    "YYYY.MM.DD". Data hygiene is decoupled from display.
 *  - vehicles/refugees/cities/overlays are CHOREOGRAPHY (vision), not derivable from event data.
 *    The research pipeline regenerates only jalons+casualties+provenance and preserves the rest.
 *
 * See memory/doctrines/WARMAP-PLAYBOOK.md (visual doctrine) and
 *     memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md (data doctrine).
 */

// 0 = faction B (e.g. RSF, red) | 0.5 = contested (gold) | 1 = faction A (e.g. SAF, blue)
export type ControlVal = number;

// canonical date "YYYY-MM-DD" (the adapter emits the engine's dotted "YYYY.MM.DD")
export type ISODate = string;

// ---------------------------------------------------------------------------
// Provenance — every produced fact carries where it came from + how sure we are.
// ---------------------------------------------------------------------------
export type SourceKind =
  | "acled"
  | "ucdp"
  | "github-geojson"
  | "press"
  | "communique"
  | "llm"
  | "manual";

export type SourceRef = {
  kind: SourceKind;
  ref: string;        // URL, dataset id, ACLED event_id_cnty, or file path
  date?: ISODate;     // publication / event date
  excerpt?: string;   // short supporting quote
};

export type Provenance = {
  sources: SourceRef[];
  confidence: number; // 0..1 (set by aggregator, adjusted by fact-check)
  verified: boolean;  // false until factcheck.py passes it (>=2 source kinds agree)
  method?: string;    // e.g. "acled-agg:point-in-polygon+actor-control"
  notes?: string;     // anomalies / raw-float audit written back by factcheck
};

// per-state control may be a bare number (hand-authored) or carry provenance
export type StateControl = { value: ControlVal; prov?: Provenance };
export type ControlEntry = ControlVal | StateControl;

// ---------------------------------------------------------------------------
// Jalon — one timeline milestone (the primary driver).
// ---------------------------------------------------------------------------
export type Jalon = {
  date: ISODate;
  label: string;                          // event narrative (bottom HUD)
  control: Record<string, ControlEntry>;  // stateName -> control (must cover stateNames)
  casualties: number;                     // cumulative estimate
  casualtiesProv?: Provenance;
  vignette?: string;                      // LLM-synthesized 1-2 sentences "why X fell" (Step 3)
  prov?: Provenance;                      // jalon-level provenance (the event itself)
};

// ---------------------------------------------------------------------------
// Choreography (vision) — preserved across data regenerations.
// ---------------------------------------------------------------------------
export type GeoPathPoint = { t: number; lon: number; lat: number };

export type Vehicle = {
  id: string;
  faction: string;   // "saf" | "rsf" | ... (keys into factions[])
  sprite: string;    // PNG filename stem
  kind: string;      // semantic unit type
  size: number;      // base screen px
  path: GeoPathPoint[];
  delay?: number;    // frame offset for appearance
};

export type Refugee = {
  id: string;
  portrait: string;  // PNG filename stem
  size: number;
  appearT: number;   // fraction tGlobal of appearance
  path: GeoPathPoint[];
};

export type City = { name: string; lon: number; lat: number };

export type OverlayVariant = "displaced" | "famine" | string;
export type Overlay = {
  variant: OverlayVariant;
  atT: number;       // fraction tGlobal anchor
  hold: number;      // frames held
  value?: number;    // promotes WarMapDataOverlay CONTENT into data (icon-count metaphor)
  label?: string;
  unit?: string;
  sub?: string;
  tagline?: string;
  source?: string;
  prov?: Provenance;
};

// ---------------------------------------------------------------------------
// Faction spec — maps a faction id to its color + control value.
// ---------------------------------------------------------------------------
export type FactionSpec = {
  id: string;            // "saf" | "rsf" | "contested"
  label: string;         // human label
  color: string;         // hex
  controlValue: 0 | 0.5 | 1;
};

// ---------------------------------------------------------------------------
// WarMapDataset — the whole canonical instance (one per subject).
// ---------------------------------------------------------------------------
export type WarMapDataset = {
  schemaVersion: 1;
  subject: string;          // "sudan-civil-war"
  adminLevel: "admin-1" | "admin-0" | "custom";
  geojson: string;          // public path to the states/regions geojson
  stateNames: string[];     // MUST match geojson properties.name EXACTLY
  factions: FactionSpec[];
  jalons: Jalon[];
  vehicles: Vehicle[];
  refugees: Refugee[];
  cities: City[];
  overlays: Overlay[];
  buildMeta?: {
    generatedAt?: string;
    connector?: string;     // "acled" | "manual-transcription" | ...
    factcheck?: string;     // model id used, or "skipped"
    sourceCommentary?: string;
  };
};

// normalize a ControlEntry to its numeric value (used by adapter + consumers)
export const controlValue = (e: ControlEntry | undefined): ControlVal => {
  if (e == null) return 1;
  return typeof e === "number" ? e : e.value;
};
