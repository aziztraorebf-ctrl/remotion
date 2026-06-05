/**
 * warmap/adapter.ts — zero-risk bridge: WarMapDataset (canonical) -> the engine's runtime shape.
 *
 * The validated engine (SudanWarMapFlat.tsx) imports {SUDAN_STATES, CITIES, JALONS, controlAt,
 * jalonAt} and {VEHICLES, REFUGEES}. This adapter rebuilds those EXACT shapes + the SAME
 * interpolation math from sudanControlData.ts (lines 139-157), so refactoring the data source
 * changes nothing on screen.
 */
import { WarMapDataset, ControlVal, controlValue, Vehicle, Refugee, City } from "./schema";

// the engine's runtime jalon shape: dotted date + flat numeric control
export type EngineJalon = {
  date: string; // "YYYY.MM.DD"
  label: string;
  control: Record<string, ControlVal>;
  casualties: number;
};

export type EngineBundle = {
  SUDAN_STATES: string[];
  CITIES: City[];
  JALONS: EngineJalon[];
  VEHICLES: Vehicle[];
  REFUGEES: Refugee[];
  controlAt: (state: string, tGlobal: number) => ControlVal;
  jalonAt: (tGlobal: number) => { i: number; f: number; jalon: EngineJalon };
};

const isoToDotted = (iso: string): string => iso.replace(/-/g, ".");

export function canonicalToEngine(ds: WarMapDataset): EngineBundle {
  const states = ds.stateNames;

  const JALONS: EngineJalon[] = ds.jalons.map((j) => {
    const control: Record<string, ControlVal> = {};
    for (const s of states) control[s] = controlValue(j.control[s]);
    return { date: isoToDotted(j.date), label: j.label, control, casualties: j.casualties };
  });

  // SAME math as sudanControlData.ts controlAt / jalonAt (linear interp between jalons).
  const controlAt = (state: string, tGlobal: number): ControlVal => {
    const n = JALONS.length;
    const x = Math.max(0, Math.min(1, tGlobal)) * (n - 1);
    const i = Math.floor(x);
    const f = x - i;
    if (i >= n - 1) return JALONS[n - 1].control[state] ?? 1;
    const a = JALONS[i].control[state] ?? 1;
    const b = JALONS[i + 1].control[state] ?? 1;
    return a + (b - a) * f;
  };

  const jalonAt = (tGlobal: number) => {
    const n = JALONS.length;
    const x = Math.max(0, Math.min(1, tGlobal)) * (n - 1);
    const i = Math.min(n - 1, Math.floor(x));
    const f = x - Math.floor(x);
    return { i, f, jalon: JALONS[i] };
  };

  return {
    SUDAN_STATES: states,
    CITIES: ds.cities,
    JALONS,
    VEHICLES: ds.vehicles,
    REFUGEES: ds.refugees,
    controlAt,
    jalonAt,
  };
}
