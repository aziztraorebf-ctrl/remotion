// MOTEUR: SVG — objet/métaphore (icône Spark client, rayons articulés individuellement,
// pas un lieu ni une donnée chiffrée : c'est un COMMENT/QUOI, le registre SVG s'applique).
import { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SPARK_PROTOTYPE_FPS = 30;
export const SPARK_PROTOTYPE_FRAMES = 75; // 2.5s a 30fps

// data-len par rayon (mesure reelle, cf out/_r-and-d/spark-upwork/spark-source.svg)
const RAY_LEN: Record<number, number> = {
  1: 150,
  2: 51,
  3: 65,
  4: 55,
  5: 110,
  6: 47,
  7: 74,
  8: 26,
  9: 129,
  10: 56,
  11: 47,
  12: 127,
  13: 35,
  14: 84,
  15: 102,
};

const RAY_IDS = Object.keys(RAY_LEN).map(Number);
const DROP_IDS = Array.from({ length: 11 }, (_, i) => i + 1);

// Etape 2->5 du doc client : chaque rayon a un delai + une duree propres,
// derives de sa longueur pour que les longs rayons (les "petales") arrivent
// un peu plus tard et prennent un peu plus de temps a s'etendre que les fins
// dards -- lecture organique plutot qu'un tirage aleatoire brut.
function timingForRay(id: number) {
  const len = RAY_LEN[id];
  const norm = (len - 26) / (150 - 26); // 0..1 selon la longueur
  // decalage pseudo-irregulier mais deterministe (pas de synchronisation
  // entre rayons voisins -- on melange l'ordre par un pas premier)
  const shuffled = (id * 7) % 15;
  const startDelay = 4 + shuffled * 2.6 + norm * 6; // frames, etale sur ~0.4-0.5s
  const growDuration = 14 + norm * 10; // rayons longs = extension plus lente
  // une legere retraction partielle avant le burst final (etape 4 "certains
  // retractent pendant que d'autres grandissent")
  const hasSettleBack = id % 3 === 0;
  return { startDelay, growDuration, hasSettleBack };
}

function rayScaleAtFrame(id: number, frame: number) {
  const { startDelay, growDuration, hasSettleBack } = timingForRay(id);
  const t = frame - startDelay;
  if (t <= 0) return 0;

  const growEnd = growDuration;
  if (t < growEnd) {
    // extension : ease-out
    return interpolate(t, [0, growEnd], [0, 1], {
      easing: Easing.out(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  if (!hasSettleBack) {
    // reste etendu, micro-respiration legere
    const breathe = Math.sin((t - growEnd) * 0.35 + id) * 0.05;
    return 1 + breathe;
  }

  // retraction partielle puis re-extension (etape 4 : "certains retractent
  // pendant que d'autres grandissent") -- ease-in vers un creux, puis ease-out
  const backT = t - growEnd;
  const backDuration = 9;
  if (backT < backDuration) {
    return interpolate(backT, [0, backDuration], [1, 0.55], {
      easing: Easing.in(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  const reGrowT = backT - backDuration;
  const reGrowDuration = 11;
  return interpolate(reGrowT, [0, reGrowDuration], [0.55, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function dropOpacityAndScaleAtFrame(id: number, frame: number) {
  const startDelay = 10 + ((id * 5) % 11) * 3.2;
  const duration = 10;
  const t = frame - startDelay;
  const v = interpolate(t, [0, duration], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity: v, scale: v };
}

// rotation globale irreguliere : pas une vitesse constante -- on additionne
// une rampe lente + une modulation sinusoidale basse frequence pour casser
// la lecture "spinner mecanique"
function rotationAtFrame(frame: number, fps: number) {
  const seconds = frame / fps;
  const base = seconds * 22; // vitesse moyenne, degres/s
  const wobble = Math.sin(seconds * 2.1) * 4.5; // acceleration/deceleration
  return base + wobble;
}

export const SparkAnimationPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("load spark-source.svg"));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(staticFile("spark-upwork/spark-source.svg"))
      .then((res) => res.text())
      .then((svgText) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svgText;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.setAttribute("width", "100%");
            svgEl.setAttribute("height", "100%");
          }
        }
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load spark-source.svg", err);
        setLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // applique les transforms de la frame courante de facon SYNCHRONE pendant
  // le rendu (pas dans un useEffect, qui s'execute apres le paint et arrive
  // trop tard pour la capture Remotion) -- puis on ne leve le delayRender
  // qu'une fois le DOM du SVG present ET les transforms de CETTE frame ecrits.
  if (loaded && containerRef.current) {
    const root = containerRef.current;

    const sparkRoot = root.querySelector<SVGGElement>("#spark-root");
    if (sparkRoot) {
      sparkRoot.style.setProperty(
        "transform",
        `rotate(${rotationAtFrame(frame, fps)}deg)`,
      );
    }

    for (const id of RAY_IDS) {
      const scaleNode = root.querySelector<SVGGElement>(`#ray-${id}-scale`);
      if (!scaleNode) continue;
      const s = rayScaleAtFrame(id, frame);
      // scale(1 X) sans virgule est la syntaxe XML SVG, pas CSS -- le CSSOM
      // rejette silencieusement une valeur transform invalide (aucune exception).
      scaleNode.style.setProperty("transform", `scaleY(${s})`);
    }

    for (const id of DROP_IDS) {
      const dropNode = root.querySelector<SVGGElement>(`#drop-${id}`);
      if (!dropNode) continue;
      const { opacity, scale } = dropOpacityAndScaleAtFrame(id, frame);
      dropNode.style.setProperty("opacity", String(opacity));
      dropNode.style.setProperty("transform", `scale(${scale})`);
    }
  }

  useEffect(() => {
    if (loaded) {
      continueRender(handle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          ref={containerRef}
          style={{ width: 500, height: 500, display: "flex" }}
          // le SVG est injecte via innerHTML au chargement (fetch static asset)
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
