// GENERE — extrait de `08_Docs.lottie`, calque `Opening Folder Flap`.
// Regenerer : cf. le commit qui introduit ce fichier.
//
// ⭐⭐ LE RABAT DU DOSSIER EST UNE ANIMATION DE FORME (shape morphing) : ni sa
// position ni son echelle ni sa rotation ne bougent — c'est son TRACE qui se
// deforme. 4 etats, releves tels quels :
//   f0   ferme (rabat penche, bbox 102x86)
//   f30  OUVERT (bbox 118x70, symetrique)
//   f75  toujours ouvert — il attend que les feuilles tombent
//   f105 referme
// C'est la seule technique de la piece qui ne se ramene pas a un transform.
// ⛔ Ne pas la simuler par une rotation : les 12 sommets se deplacent chacun
// differemment (le pli du carton se creuse), une rotation donne un basculement
// rigide qui ne lit pas comme du carton.

export type EtatForme = {
  t: number;
  v: number[][];
  i: number[][];
  o: number[][];
};

export const RABAT_ETATS: EtatForme[] = [
  {
    t: 0,
    v: [[43.26, -45.17], [42.81, 30.85], [37.66, 34.77], [-54.06, 34.77], [-59.21, 28.01], [-59.21, -38.82], [-54.24, -42.61], [-12.98, -42.61], [-9.5, -43.56], [2.65, -50.72], [6.13, -51.67], [37.84, -51.67]],
    i: [[0, -3.28], [0, 0], [2.4, 0], [0, 0], [-0.93, 3.4], [0, 0], [-2.32, 0], [0, 0], [-1.06, 0.62], [0, 0], [-1.23, 0], [0, 0]],
    o: [[0, 0], [-0.64, 2.31], [0, 0], [-3.53, 0], [0, 0], [0.61, -2.24], [0, 0], [1.23, 0], [0, 0], [1.06, -0.62], [0, 0], [3.41, 0]],
  },
  {
    t: 30,
    v: [[59.23, -28.24], [42.81, 30.85], [37.66, 34.77], [-54.06, 34.77], [-59.21, 28.01], [-45.52, -21.92], [-40.55, -25.71], [3.44, -25.71], [6.92, -26.66], [19.07, -33.82], [22.55, -34.77], [54.27, -34.77]],
    i: [[0.91, -3.28], [0, 0], [2.4, 0], [0, 0], [-0.93, 3.4], [0, 0], [-2.32, 0], [0, 0], [-1.06, 0.62], [0, 0], [-1.23, 0], [0, 0]],
    o: [[0, 0], [-0.64, 2.31], [0, 0], [-3.53, 0], [0, 0], [0.61, -2.24], [0, 0], [1.23, 0], [0, 0], [1.06, -0.62], [0, 0], [3.41, 0]],
  },
  {
    t: 75,
    v: [[59.23, -28.24], [42.81, 30.85], [37.66, 34.77], [-54.06, 34.77], [-59.21, 28.01], [-45.52, -21.92], [-40.55, -25.71], [3.44, -25.71], [6.92, -26.66], [19.07, -33.82], [22.55, -34.77], [54.27, -34.77]],
    i: [[0.91, -3.28], [0, 0], [2.4, 0], [0, 0], [-0.93, 3.4], [0, 0], [-2.32, 0], [0, 0], [-1.06, 0.62], [0, 0], [-1.23, 0], [0, 0]],
    o: [[0, 0], [-0.64, 2.31], [0, 0], [-3.53, 0], [0, 0], [0.61, -2.24], [0, 0], [1.23, 0], [0, 0], [1.06, -0.62], [0, 0], [3.41, 0]],
  },
  {
    t: 105,
    v: [[43.26, -45.17], [42.81, 30.85], [37.66, 34.77], [-54.06, 34.77], [-59.21, 28.01], [-59.21, -38.82], [-54.24, -42.61], [-12.98, -42.61], [-9.5, -43.56], [2.65, -50.72], [6.13, -51.67], [37.84, -51.67]],
    i: [[0, -3.28], [0, 0], [2.4, 0], [0, 0], [-0.93, 3.4], [0, 0], [-2.32, 0], [0, 0], [-1.06, 0.62], [0, 0], [-1.23, 0], [0, 0]],
    o: [[0, 0], [-0.64, 2.31], [0, 0], [-3.53, 0], [0, 0], [0.61, -2.24], [0, 0], [1.23, 0], [0, 0], [1.06, -0.62], [0, 0], [3.41, 0]],
  },
];

/** Reconstruit le `d` d'un path a partir des sommets + tangentes Lottie. */
const versD = (v: number[][], i: number[][], o: number[][]): string => {
  const n = v.length;
  const out = [`M ${v[0][0].toFixed(2)} ${v[0][1].toFixed(2)}`];
  for (let k = 1; k <= n; k++) {
    const p0 = v[(k - 1) % n];
    const p1 = v[k % n];
    const c1 = [p0[0] + o[(k - 1) % n][0], p0[1] + o[(k - 1) % n][1]];
    const c2 = [p1[0] + i[k % n][0], p1[1] + i[k % n][1]];
    out.push(
      `C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`,
    );
  }
  out.push("Z");
  return out.join(" ");
};

/**
 * Le `d` du rabat a la frame donnee, par interpolation sommet a sommet.
 * Les 4 etats ont tous 12 sommets qui se correspondent — l'interpolation est
 * donc directe, sans reechantillonnage.
 */
export const rabatD = (frame: number, easing: (t: number) => number): string => {
  const E = RABAT_ETATS;
  if (frame <= E[0].t) return versD(E[0].v, E[0].i, E[0].o);
  const last = E[E.length - 1];
  if (frame >= last.t) return versD(last.v, last.i, last.o);
  let a = E[0];
  let b = E[1];
  for (let k = 0; k < E.length - 1; k++) {
    if (frame >= E[k].t && frame <= E[k + 1].t) {
      a = E[k];
      b = E[k + 1];
      break;
    }
  }
  const brut = (frame - a.t) / (b.t - a.t);
  const p = easing(brut);
  const mix = (x: number[][], y: number[][]) =>
    x.map((pt, k) => [
      pt[0] + (y[k][0] - pt[0]) * p,
      pt[1] + (y[k][1] - pt[1]) * p,
    ]);
  return versD(mix(a.v, b.v), mix(a.i, b.i), mix(a.o, b.o));
};
