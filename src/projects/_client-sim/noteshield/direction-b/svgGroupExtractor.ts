// Extraction de groupes <g id="..."> depuis un SVG Fable complet (scene_svg), pour animer
// chaque groupe separement en React/Remotion. Parseur a profondeur (groupes parfois imbriques).
// Pattern repris tel quel de src/projects/_rnd/svg-scenes/PiliersGouffre16x9.tsx (deja valide).

export const extractGroup = (svg: string, id: string): string => {
  const open = new RegExp(`<g\\s[^>]*id="${id}"[^>]*>`);
  const m = open.exec(svg);
  if (!m) return "";
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  while (i < svg.length && depth > 0) {
    const nextOpen = svg.indexOf("<g", i);
    const nextClose = svg.indexOf("</g>", i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 2;
    } else {
      depth--;
      i = nextClose + 4;
    }
  }
  return svg.slice(start, i - 4);
};

// Les <defs> (gradients, filtres) doivent etre reinjectes a part, sinon fill="url(#...)" casse.
export const extractDefs = (svg: string): string => {
  const m = /<defs>([\s\S]*?)<\/defs>/.exec(svg);
  return m ? m[1] : "";
};
