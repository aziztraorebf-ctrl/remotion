/**
 * useTopology — hook qui charge un fichier TopoJSON depuis public/
 * et garantit que Remotion attend la fin du chargement avant de render.
 */

import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export type Topology = {
  type: "Topology";
  objects: Record<string, unknown>;
  arcs: number[][][];
  transform?: unknown;
};

const cache = new Map<string, Topology>();

export const useTopology = (publicPath: string): Topology | null => {
  const [topo, setTopo] = useState<Topology | null>(() => cache.get(publicPath) ?? null);
  const [handle] = useState(() => (cache.has(publicPath) ? null : delayRender(`topo:${publicPath}`)));

  useEffect(() => {
    if (cache.has(publicPath)) {
      if (handle !== null) continueRender(handle);
      return;
    }
    fetch(staticFile(publicPath))
      .then((r) => r.json())
      .then((data: Topology) => {
        cache.set(publicPath, data);
        setTopo(data);
        if (handle !== null) continueRender(handle);
      })
      .catch((err) => {
        console.error("useTopology fetch error:", err);
        if (handle !== null) continueRender(handle);
      });
  }, [publicPath, handle]);

  return topo;
};
