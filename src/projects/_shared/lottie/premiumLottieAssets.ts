/**
 * premiumLottieAssets — generateurs de Lottie JSON premium, charte Souverain navy/gold.
 *
 * Pousse plus loin que les pulseRings basiques de MapboxLottieShowcase :
 * easing premium (bezier), multi-couches, repeater, opacite/scale variables.
 *
 * 3 assets (valides Chantier C) :
 *   - shockwaveDiscovery() : onde de choc "decouverte" (cercles en cascade + flash central)
 *   - networkFlow()        : particules dorees le long d'une trajectoire + trainee
 *   - orbitalDataCrown()   : anneau de donnees orbital (segments/ticks rotatifs, HUD war-room)
 *
 * Format Lottie 5.7+ (compatible lottie-web 5.13, renderer canvas, headless OK).
 * Rendu off-screen → goToAndStop(frame) → canvas (voir LottieGeoAura).
 *
 * Convention couleur Lottie : [r,g,b,a] normalises 0..1.
 */

const GOLD_RGB = [200 / 255, 169 / 255, 81 / 255]; // #c8a951
const IVORY_RGB = [242 / 255, 235 / 255, 217 / 255]; // #f2ebd9

type RGB = number[];
const col = (rgb: RGB, a = 1) => [rgb[0], rgb[1], rgb[2], a];

// Easing bezier reutilisables (out cubic / in-out)
const EASE_OUT = { i: { x: [0.16], y: [1] }, o: { x: [0.3], y: [0] } };
const EASE_INOUT = { i: { x: [0.65], y: [0.35] }, o: { x: [0.35], y: [0.65] } };

// Helper : layer ellipse stroke (anneau)
function ringLayer(opts: {
  ind: number;
  size: number; // diametre final
  delay: number; // frames de retard
  dur: number;
  color: RGB;
  strokeW: number;
  op: number;
  fr: number;
}) {
  const { ind, size, delay, dur, color, strokeW, op } = opts;
  return {
    ddd: 0,
    ind,
    ty: 4, // shape
    nm: `ring${ind}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: delay, s: [0], ...EASE_OUT },
          { t: delay + 6, s: [op] },
          { t: delay + dur, s: [0] },
        ],
      },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [256, 256, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: delay, s: [10, 10], ...EASE_OUT },
          { t: delay + dur, s: [size, size] },
        ],
      },
    },
    ao: 0,
    shapes: [
      {
        ty: "el",
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        nm: "circle",
      },
      {
        ty: "st",
        c: { a: 0, k: col(color, 1) },
        o: { a: 0, k: 100 },
        w: { a: 0, k: strokeW },
        lc: 2,
        lj: 1,
        nm: "stroke",
      },
      {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
      },
    ],
    ip: 0,
    op: opts.fr * 6,
    st: 0,
    bm: 0,
  };
}

/**
 * Onde de choc "decouverte" : flash central + 3 anneaux en cascade qui se propagent.
 */
export function shockwaveDiscovery(color: RGB = GOLD_RGB, fr = 30) {
  const total = 90;
  const layers: object[] = [];

  // Flash central (cercle plein qui pulse une fois)
  layers.push({
    ddd: 0,
    ind: 0,
    ty: 4,
    nm: "flash",
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: 0, s: [0], ...EASE_OUT },
          { t: 5, s: [90] },
          { t: 30, s: [0] },
        ],
      },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [256, 256, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [20, 20], ...EASE_OUT },
          { t: 20, s: [70, 70] },
        ],
      },
    },
    ao: 0,
    shapes: [
      { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, nm: "c" },
      {
        ty: "fl",
        c: { a: 0, k: col(color, 1) },
        o: { a: 0, k: 100 },
        nm: "fill",
      },
      {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
      },
    ],
    ip: 0,
    op: total,
    st: 0,
    bm: 0,
  });

  // 3 anneaux en cascade
  const ringSpecs = [
    { delay: 0, op: 100, w: 8 },
    { delay: 14, op: 70, w: 5 },
    { delay: 28, op: 45, w: 3 },
  ];
  ringSpecs.forEach((s, i) => {
    layers.push(
      ringLayer({
        ind: i + 1,
        size: 480,
        delay: s.delay,
        dur: 55,
        color,
        strokeW: s.w,
        op: s.op,
        fr,
      })
    );
  });

  return {
    v: "5.7.8",
    fr,
    ip: 0,
    op: total,
    w: 512,
    h: 512,
    nm: "shockwaveDiscovery",
    ddd: 0,
    assets: [],
    layers,
  };
}

/**
 * Flux reseau : N particules dorees qui parcourent un arc, taille/opacite variables + trainee.
 * Trajectoire = arc horizontal (le composant peut tourner/positionner l'instance).
 */
export function networkFlow(color: RGB = GOLD_RGB, fr = 30, count = 6) {
  const total = 90;
  const layers: object[] = [];

  for (let i = 0; i < count; i++) {
    // Decalage de phase DANS la timeline (compatible goToAndStop) :
    // chaque particule a sa fenetre de traversee [start, start+travel].
    const travel = 60;
    const start = Math.round((i / count) * total);
    const end = Math.min(total, start + travel);
    const ind = i;
    layers.push({
      ddd: 0,
      ind,
      ty: 4,
      nm: `p${i}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: start, s: [0] },
            { t: start + 6, s: [100] },
            { t: end - 8, s: [100] },
            { t: end, s: [0] },
          ],
        },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: start, s: [40, 256, 0], ...EASE_INOUT },
            { t: end, s: [472, 256, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: start, s: [70, 70], ...EASE_INOUT },
            { t: (start + end) / 2, s: [130, 130] },
            { t: end, s: [70, 70] },
          ],
        },
      },
      ao: 0,
      ip: 0,
      op: total,
      st: 0,
      bm: 0,
      shapes: [
        { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [26, 26] }, nm: "dot" },
        {
          ty: "fl",
          c: { a: 0, k: col(color, 1) },
          o: { a: 0, k: 100 },
          nm: "fill",
        },
        {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 },
        },
      ],
    });
  }

  // ligne de fond (la "route")
  layers.push({
    ddd: 0,
    ind: count,
    ty: 4,
    nm: "track",
    sr: 1,
    ks: {
      o: { a: 0, k: 25 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [256, 256, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100] },
    },
    ao: 0,
    ip: 0,
    op: total,
    st: 0,
    bm: 0,
    shapes: [
      {
        ty: "sh",
        ks: {
          a: 0,
          k: {
            i: [[0, 0], [0, 0]],
            o: [[0, 0], [0, 0]],
            v: [[-216, 0], [216, 0]],
            c: false,
          },
        },
        nm: "line",
      },
      {
        ty: "st",
        c: { a: 0, k: col(color, 1) },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 2 },
        lc: 2,
        lj: 1,
        d: [
          { n: "d", nm: "dash", v: { a: 0, k: 6 } },
          { n: "g", nm: "gap", v: { a: 0, k: 8 } },
        ],
        nm: "stroke",
      },
      {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
      },
    ],
  });

  return {
    v: "5.7.8",
    fr,
    ip: 0,
    op: total,
    w: 512,
    h: 512,
    nm: "networkFlow",
    ddd: 0,
    assets: [],
    layers,
  };
}

/**
 * Couronne data-viz orbitale : anneau de ticks/segments qui tourne (HUD war-room),
 * + 2 contre-rotations pour profondeur, + petits dots orbitaux.
 */
export function orbitalDataCrown(color: RGB = GOLD_RGB, fr = 30) {
  const total = 120;

  // Anneau de ticks via repeater (24 segments)
  const tickRing = (ind: number, radius: number, n: number, len: number, w: number, rotDur: number, dir: number, op: number) => ({
    ddd: 0,
    ind,
    ty: 4,
    nm: `ticks${ind}`,
    sr: 1,
    ks: {
      o: { a: 0, k: op },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0] },
          { t: rotDur, s: [360 * dir] },
        ],
      },
      p: { a: 0, k: [256, 256, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100] },
    },
    ao: 0,
    ip: 0,
    op: total,
    st: 0,
    bm: 0,
    shapes: [
      // un tick (segment vertical) place a radius, duplique par repeater
      {
        ty: "gr",
        nm: "tickgroup",
        it: [
          {
            ty: "rc",
            p: { a: 0, k: [0, -radius] },
            s: { a: 0, k: [w, len] },
            r: { a: 0, k: 0 },
            nm: "rect",
          },
          {
            ty: "fl",
            c: { a: 0, k: col(color, 1) },
            o: { a: 0, k: 100 },
            nm: "fill",
          },
          {
            ty: "tr",
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 },
          },
        ],
      },
      {
        ty: "rp", // repeater
        c: { a: 0, k: n },
        o: { a: 0, k: 0 },
        m: 1,
        tr: {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 360 / n },
          so: { a: 0, k: 100 },
          eo: { a: 0, k: 100 },
          nm: "rptr",
        },
        nm: "repeater",
      },
    ],
  });

  const layers: object[] = [
    // anneau externe fin (statique cercle)
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "ringbase",
      sr: 1,
      ks: {
        o: { a: 0, k: 35 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [256, 256, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100] },
      },
      ao: 0,
      ip: 0,
      op: total,
      st: 0,
      bm: 0,
      shapes: [
        { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [340, 340] }, nm: "c" },
        {
          ty: "st",
          c: { a: 0, k: col(color, 1) },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1.5 },
          nm: "stroke",
        },
        {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 },
        },
      ],
    },
    tickRing(1, 170, 36, 14, 3, total, 1, 90), // anneau de ticks principal (sens horaire)
    tickRing(2, 130, 24, 8, 2, total, -1, 55), // contre-rotation interne
  ];

  return {
    v: "5.7.8",
    fr,
    ip: 0,
    op: total,
    w: 512,
    h: 512,
    nm: "orbitalDataCrown",
    ddd: 0,
    assets: [],
    layers,
  };
}

export const PREMIUM_LOTTIE = {
  shockwaveDiscovery,
  networkFlow,
  orbitalDataCrown,
  GOLD_RGB,
  IVORY_RGB,
};
