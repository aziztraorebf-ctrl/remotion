// camera-chapters.ts — Sénégal Pétrole & Gaz — Beat 1 Acte 1
// Pattern Mapbox Storytelling adapté Remotion (zéro dépendance externe).
// Chaque chapter définit une plage de frames et les paramètres caméra cibles.
// Usage : lerpCamera(frame, CHAPTERS_BEAT1) dans le useEffect Mapbox.

export interface CameraChapter {
  id: string;
  startFrame: number;
  endFrame: number;
  center: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  bearing: number;
  easing?: "linear" | "ease-out" | "ease-in-out";
}

// ---------------------------------------------------------------------------
// Beat 1 — L'Anomalie (f0 → f1299)
// 3 phases caméra alignées sur les panels du storyboard
// ---------------------------------------------------------------------------

export const CHAPTERS_BEAT1: CameraChapter[] = [
  {
    // Panel 1 — Vue Atlantique large : situe le contexte géopolitique
    // Centre sur l'Atlantique central pour montrer le golfe de Guinée + Sénégal
    id: "atlantique-large",
    startFrame: 0,
    endFrame: 180,
    center: [-17.0, 14.0], // large Atlantique, Sénégal en haut à droite
    zoom: 3.2,
    pitch: 0,
    bearing: 0,
    easing: "ease-out",
  },
  {
    // Panel 2 — Zoom Sénégal côte : révèle le pays + position offshore
    // Sénégal visible en entier, côte atlantique au centre
    id: "senegal-cote",
    startFrame: 180,
    endFrame: 555,
    center: [-17.3, 14.5], // Dakar en vue + côte ouest Sénégal
    zoom: 6.2,
    pitch: 20,
    bearing: -10,
    easing: "ease-in-out",
  },
  {
    // Panel 4 — Retour champs offshore Sangomar / GTA pour le doute
    // Zoom précis sur les deux champs offshore actifs
    id: "offshore-champs",
    startFrame: 555,
    endFrame: 1299,
    center: [-17.1, 14.0], // entre Sangomar (13.5°N) et GTA (12.5°N)
    zoom: 7.8,
    pitch: 40,
    bearing: -5,
    easing: "ease-in-out",
  },
];

// ---------------------------------------------------------------------------
// Coordonnées précises des points offshore (pour dots SVG overlay)
// Source : Mapbox geocoding + rapports Woodside/BP
// ---------------------------------------------------------------------------

export const OFFSHORE_POINTS = {
  sangomar: {
    lng: -17.25,
    lat: 13.55,
    label: "SANGOMAR",
    subLabel: "Woodside · Petrosen 18%",
    color: "#d4a93c",
  },
  gta: {
    lng: -16.5,
    lat: 12.4,
    label: "GTA",
    subLabel: "BP · Production 2025",
    color: "#d4a93c",
  },
} as const;

// ---------------------------------------------------------------------------
// Utilitaire : interpolation linéaire entre deux chapters
// Appelé à chaque frame dans un useEffect — map.jumpTo() accepte les valeurs interpolées
// ---------------------------------------------------------------------------

export function lerpCamera(
  frame: number,
  chapters: CameraChapter[]
): Omit<CameraChapter, "id" | "startFrame" | "endFrame" | "easing"> {
  // Trouver le chapter actif
  const active = chapters.find(
    (ch) => frame >= ch.startFrame && frame <= ch.endFrame
  );

  if (!active) {
    // Avant le premier ou après le dernier : rester sur le plus proche
    if (frame < chapters[0].startFrame) return chapters[0];
    return chapters[chapters.length - 1];
  }

  // Trouver le chapter suivant pour interpoler
  const idx = chapters.indexOf(active);
  const next = chapters[idx + 1];

  if (!next) {
    // Dernier chapter : position fixe
    return { center: active.center, zoom: active.zoom, pitch: active.pitch, bearing: active.bearing };
  }

  // Transition : les N dernières frames du chapter actif
  const TRANSITION_FRAMES = 60; // 2s de transition douce
  const transitionStart = active.endFrame - TRANSITION_FRAMES;

  if (frame < transitionStart) {
    return { center: active.center, zoom: active.zoom, pitch: active.pitch, bearing: active.bearing };
  }

  // Interpolation linéaire dans la fenêtre de transition
  const t = (frame - transitionStart) / TRANSITION_FRAMES;
  const tEased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease-in-out quadratique

  return {
    center: [
      active.center[0] + (next.center[0] - active.center[0]) * tEased,
      active.center[1] + (next.center[1] - active.center[1]) * tEased,
    ],
    zoom: active.zoom + (next.zoom - active.zoom) * tEased,
    pitch: active.pitch + (next.pitch - active.pitch) * tEased,
    bearing: active.bearing + (next.bearing - active.bearing) * tEased,
  };
}
