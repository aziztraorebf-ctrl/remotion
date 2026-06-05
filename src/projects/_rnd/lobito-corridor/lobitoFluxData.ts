/**
 * lobitoFluxData — données temporelles du corridor de Lobito.
 * Miroir de sudanControlData mais pour un flux économique (pas un conflit).
 *
 * "control" = intensité du flux 0..1 :
 *   0   = flux EST (Chine/Dar es Salaam) domine
 *   0.5 = transition / double flux
 *   1   = flux OUEST (Lobito/Atlantique/Occident) domine
 *
 * Palette reprise du moteur warmap Sudan (cream belge pour version A).
 * Version B utilise cette même logique sur la carte Atlas 2D flat.
 */

export type FluxJalon = {
  date: string;
  label: string;
  // flux par pays : 0=Chine domine, 0.5=transition, 1=Lobito domine
  flux: Record<string, number>;
  // tonnage annuel exporté (ordres de grandeur, Mt)
  tonnage: number;
};

// Pays impliqués dans le corridor
export const LOBITO_COUNTRIES = ["COD", "ZMB", "AGO", "TZA", "MOZ"] as const;

// Jalons narratifs — 5 moments clés
export const JALONS: FluxJalon[] = [
  {
    date: "2000",
    label: "La Chine bâtit ses routes — le minerai coule vers l'est",
    flux: { COD: 0.05, ZMB: 0.1, AGO: 0.2, TZA: 0.0, MOZ: 0.1 },
    tonnage: 0.4,
  },
  {
    date: "2010",
    label: "Le cobalt s'impose — 70% mondial sort du Congo",
    flux: { COD: 0.1, ZMB: 0.15, AGO: 0.3, TZA: 0.05, MOZ: 0.1 },
    tonnage: 1.2,
  },
  {
    date: "2018",
    label: "Dépendance critique — l'Occident s'alarme",
    flux: { COD: 0.15, ZMB: 0.2, AGO: 0.35, TZA: 0.05, MOZ: 0.1 },
    tonnage: 2.1,
  },
  {
    date: "2021",
    label: "G7 finance le corridor Lobito — la route ouest s'ouvre",
    flux: { COD: 0.45, ZMB: 0.5, AGO: 0.75, TZA: 0.1, MOZ: 0.2 },
    tonnage: 2.8,
  },
  {
    date: "2024",
    label: "Deux routes, un seul minerai — la compétition est ouverte",
    flux: { COD: 0.72, ZMB: 0.68, AGO: 0.92, TZA: 0.12, MOZ: 0.2 },
    tonnage: 3.6,
  },
];

// Poids par segment (ralentissement narratif, comme Sudan)
// Plus haut = plus lent
export const SEG_WEIGHTS = [1.0, 1.0, 1.2, 1.8, 1.4];

/**
 * fluxAt — valeur de flux interpolée pour un pays à tGlobal [0..1].
 * Même logique que controlAt dans sudanControlData.
 */
export function fluxAt(country: string, tGlobal: number): number {
  const n = JALONS.length;
  const t = Math.max(0, Math.min(1, tGlobal));
  const pos = t * (n - 1);
  const i = Math.min(n - 2, Math.floor(pos));
  const frac = pos - i;
  const a = JALONS[i].flux[country] ?? 0.1;
  const b = JALONS[i + 1].flux[country] ?? 0.1;
  return a + (b - a) * frac;
}

/**
 * jalonAt — jalon courant + fraction d'interpolation.
 */
export function jalonAt(tGlobal: number): { jalon: FluxJalon; i: number; f: number } {
  const n = JALONS.length;
  const t = Math.max(0, Math.min(1, tGlobal));
  const pos = t * (n - 1);
  const i = Math.min(n - 2, Math.floor(pos));
  const f = pos - i;
  return { jalon: JALONS[i], i, f };
}

/**
 * tonnageAt — tonnage interpolé pour le compteur animé.
 */
export function tonnageAt(tGlobal: number): number {
  const { jalon, i, f } = jalonAt(tGlobal);
  const next = JALONS[Math.min(JALONS.length - 1, i + 1)];
  return jalon.tonnage + (next.tonnage - jalon.tonnage) * f;
}

/**
 * tGlobalFromFrame — même logique dwell que Sudan.
 * dwellFrac = 0.30 : on reste sur chaque jalon 30% du temps avant d'éaser.
 */
export function tGlobalFromFrame(
  frame: number,
  tStart: number,
  tEnd: number,
): number {
  const totalW = SEG_WEIGHTS.reduce((a, b) => a + b, 0);
  const span = tEnd - tStart;
  const local = Math.max(0, Math.min(span, frame - tStart));
  const n = JALONS.length;
  const dwellFrac = 0.30;
  let acc = 0;
  for (let s = 0; s < n - 1; s++) {
    const segFrames = (SEG_WEIGHTS[s] / totalW) * span;
    if (local <= acc + segFrames || s === n - 2) {
      const within = Math.max(0, Math.min(1, (local - acc) / segFrames));
      let move = 0;
      if (within > dwellFrac) {
        const m = (within - dwellFrac) / (1 - dwellFrac);
        move = m < 0.5 ? 4 * m * m * m : 1 - Math.pow(-2 * m + 2, 3) / 2;
      }
      return (s + move) / (n - 1);
    }
    acc += segFrames;
  }
  return 1;
}

// Couleurs flux — 0 = Chine (rouge), 0.5 = transition (or), 1 = Lobito (vert atlas)
export const FLUX_COLORS = {
  china:      "#B14B3C",   // rouge brique = flux Chine
  contested:  "#C99A3A",   // or = double flux / transition
  lobito:     "#4A8C5C",   // vert atlas = flux Lobito/Occident
  neutral:    "#9E8060",   // beige neutre = pays périphériques
};

/**
 * fluxColor — couleur hex interpolée selon la valeur de flux (0..1).
 * 0 = rouge Chine → 0.5 = or transition → 1 = vert Lobito
 */
export function fluxColor(value: number): string {
  const lerpHex = (a: string, b: string, t: number) => {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return `#${c.map(v => v.toString(16).padStart(2, "0")).join("")}`;
  };
  if (value <= 0.5) return lerpHex(FLUX_COLORS.china, FLUX_COLORS.contested, value * 2);
  return lerpHex(FLUX_COLORS.contested, FLUX_COLORS.lobito, (value - 0.5) * 2);
}
