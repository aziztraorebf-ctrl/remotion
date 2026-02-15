// Historical plague spread data - 1347-1351
export interface PlagueDataPoint {
  day: number;
  city: string;
  deaths: number; // cumulative thousands
  lat: number;
  lon: number;
}

export const PLAGUE_DATA: PlagueDataPoint[] = [
  { day: 0, city: "Messine", deaths: 5, lat: 38.2, lon: 15.6 },
  { day: 30, city: "Catane", deaths: 15, lat: 37.5, lon: 15.1 },
  { day: 60, city: "Genes", deaths: 40, lat: 44.4, lon: 8.9 },
  { day: 90, city: "Marseille", deaths: 100, lat: 43.3, lon: 5.4 },
  { day: 120, city: "Venise", deaths: 200, lat: 45.4, lon: 12.3 },
  { day: 180, city: "Florence", deaths: 400, lat: 43.8, lon: 11.3 },
  { day: 240, city: "Paris", deaths: 800, lat: 48.9, lon: 2.3 },
  { day: 300, city: "Bordeaux", deaths: 1200, lat: 44.8, lon: -0.6 },
  { day: 360, city: "Londres", deaths: 2000, lat: 51.5, lon: -0.1 },
  { day: 450, city: "Cologne", deaths: 3500, lat: 50.9, lon: 6.9 },
  { day: 540, city: "Hambourg", deaths: 5000, lat: 53.5, lon: 10.0 },
  { day: 720, city: "Stockholm", deaths: 7500, lat: 59.3, lon: 18.1 },
  { day: 900, city: "Moscou", deaths: 10000, lat: 55.8, lon: 37.6 },
];

export const MILESTONES = [
  { dataIndex: 0, label: "Patient zero" },
  { dataIndex: 3, label: "Marseille infectee" },
  { dataIndex: 6, label: "Paris tombe" },
  { dataIndex: 8, label: "Londres touchee" },
  { dataIndex: 12, label: "Moscou atteinte" },
];
