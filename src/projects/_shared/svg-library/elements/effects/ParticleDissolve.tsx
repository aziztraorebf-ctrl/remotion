// ParticleDissolve — dissolution radiale en particules deterministes ("effet Thanos"), SVG pur.
//
// Un disque/objet se fragmente en points qui se detachent radialement en s'estompant, avec un leger
// flottement vers le haut. Zero WebGL/filtre lourd, zero Math.random au render (seed local LCG =
// deterministe, safe pour le rendu headless Remotion).
//
// Origine : Franc CFA mid-form, Beat 6a "La volonte de partir" (jeton monnaie Sira qui se dissout au
// moment du dementi officiel — 2026-07-26, retour Aziz "comme quand Thanos claque des doigts").
// Extrait pour reutilisation : tout objet qui doit se dissoudre/disparaitre de facon dramatique
// (monnaie qui s'evapore, symbole qui se defait, objet incertain qui se derobe).
//
// Usage :
//   const particles = useParticleDissolve({ seed: 77, count: 46, radius: 76 });
//   <ParticleField particles={particles} progress={dissolveProgress} color={ENCRE} glowColor={OR} />
//
// - `progress` : 0 (objet intact) -> 1 (dissolution complete). Piloter avec interpolate/clampI existant.
// - Chaque particule a son propre `delay` (0-0.4) pour etaler le depart — evite un "pop" simultane.
// - Le halo (`glowColor`) doit rester dans la palette du beat pour ne pas casser le registre.

import React from "react";

export type Particle = {
  x: number;
  y: number;
  angle: number;
  dist: number; // distance d'envol totale
  size: number;
  delay: number; // 0-0.4, etalement du depart sur l'echelle de `progress`
};

export type ParticleDissolveOptions = {
  seed?: number;
  count?: number;
  /** rayon du disque source (repartition uniforme a l'interieur) */
  radius?: number;
  /** centre local du disque (coordonnees du viewBox de l'objet, ex 100,100 pour un jeton 200x200) */
  cx?: number;
  cy?: number;
  /** distance d'envol min/max */
  distRange?: [number, number];
  /** taille des particules min/max */
  sizeRange?: [number, number];
};

/** Genere un ensemble de particules deterministes (seed local LCG, jamais Math.random direct). */
export function makeParticles({
  seed = 1,
  count = 46,
  radius = 76,
  cx = 100,
  cy = 100,
  distRange = [30, 120],
  sizeRange = [1.2, 3.6],
}: ParticleDissolveOptions = {}): Particle[] {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pts: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * radius; // uniforme sur le disque, pas concentre au centre
    pts.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      angle,
      dist: distRange[0] + rnd() * (distRange[1] - distRange[0]),
      size: sizeRange[0] + rnd() * (sizeRange[1] - sizeRange[0]),
      delay: rnd() * 0.4,
    });
  }
  return pts;
}

/** Hook memo — genere les particules UNE FOIS (deterministe, ne pas regenerer a chaque frame). */
export function useParticleDissolve(opts: ParticleDissolveOptions = {}): Particle[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- opts figees a l'appel, regen volontairement rare
  return React.useMemo(() => makeParticles(opts), []);
}

export type ParticleFieldProps = {
  particles: Particle[];
  /** 0 = objet intact (aucune particule visible), 1 = dissolution complete */
  progress: number;
  /** couleur des particules (contrastee sur le fond, ex ENCRE blanc-casse) */
  color: string;
  /** couleur du glow drop-shadow (coherente palette du beat, ex OR) */
  glowColor: string;
  /** duree relative de vie de CHAQUE particule sur l'echelle de progress (0-1). Defaut 0.55. */
  particleLifespan?: number;
  /** flottement vertical vers le haut en fin de course (px). Defaut 14. */
  floatUp?: number;
};

/** Rend le champ de particules pour une valeur de `progress` donnee. A placer DANS le meme groupe SVG
 * (meme repere de coordonnees) que l'objet qui se dissout. */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  particles, progress, color, glowColor, particleLifespan = 0.55, floatUp = 14,
}) => {
  if (progress <= 0.01) return null;
  return (
    <>
      {particles.map((p, i) => {
        const localT = Math.max(0, Math.min(1, (progress - p.delay) / Math.max(0.0001, Math.min(particleLifespan, 1 - p.delay))));
        if (localT <= 0.001) return null;
        const eased = 1 - Math.pow(1 - localT, 2); // ease-out
        const px = p.x + Math.cos(p.angle) * p.dist * eased;
        const py = p.y + Math.sin(p.angle) * p.dist * eased - eased * floatUp;
        const op = (1 - eased) * 0.95;
        if (op <= 0.02) return null;
        return (
          <circle key={i} cx={px} cy={py} r={p.size * (1 - eased * 0.4)} fill={color} opacity={op}
            style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }} />
        );
      })}
    </>
  );
};

export default ParticleField;
