// Icones Iconify inline (paths SVG copies depuis api.iconify.design)
// Avantage : zero dependance reseau au render, total control sur fill/stroke
import React from "react";

type IconProps = {
  x: number;
  y: number;
  size: number;
  fill?: string;
  opacity?: number;
};

// Helper : transforme path 24x24 en taille voulue, centre sur (x,y)
// On evite les <svg> imbriques (probleme rendering ANGLE) en utilisant translate+scale directement
const ICON_NATIVE_SIZE = 24;
const buildTransform = (x: number, y: number, size: number, rotation = 0): string => {
  const scale = size / ICON_NATIVE_SIZE;
  const half = ICON_NATIVE_SIZE / 2;
  if (rotation) {
    return `translate(${x} ${y}) rotate(${rotation}) scale(${scale}) translate(${-half} ${-half})`;
  }
  return `translate(${x} ${y}) scale(${scale}) translate(${-half} ${-half})`;
};

// mdi:mosque
export const IconMosqueIconify: React.FC<IconProps> = ({ x, y, size, fill = "#3A2A18", opacity = 1 }) => (
  <g transform={buildTransform(x, y, size)} opacity={opacity}>
    <path fill={fill} d="M7 8h10c.3 0 .6.1.8.1c.1-.3.2-.7.2-1c0-1.3-.6-2.5-1.7-3.2L12 1L7.7 3.8c-1 .8-1.7 2-1.7 3.3c0 .4.1.7.2 1c.2 0 .5-.1.8-.1m17-1c0-1.1-2-3-2-3s-2 1.9-2 3c0 .7.4 1.4 1 1.7V13h-2v-2c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v2H3V8.7c.6-.3 1-1 1-1.7c0-1.1-2-3-2-3S0 5.9 0 7c0 .7.4 1.4 1 1.7V21h9v-4c0-1.1.9-2 2-2s2 .9 2 2v4h9V8.7c.6-.3 1-1 1-1.7" />
  </g>
);

// mdi:book-open-page-variant
export const IconBookIconify: React.FC<IconProps> = ({ x, y, size, fill = "#3A2A18", opacity = 1 }) => (
  <g transform={buildTransform(x, y, size)} opacity={opacity}>
    <path fill={fill} d="m19 2l-5 4.5v11l5-4.5zM6.5 5C4.55 5 2.45 5.4 1 6.5v14.66c0 .25.25.5.5.5c.1 0 .15-.07.25-.07c1.35-.65 3.3-1.09 4.75-1.09c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.31 4.75 1.06c.1.05.15.03.25.03c.25 0 .5-.25.5-.5V6.5c-.6-.45-1.25-.75-2-1V19c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V6.5C10.55 5.4 8.45 5 6.5 5" />
  </g>
);

// material-symbols:diamond (pour pieces d'or stylisees)
type DiamondProps = IconProps & { rotation?: number };
export const IconDiamondIconify: React.FC<DiamondProps> = ({ x, y, size, fill = "#D4A574", opacity = 1, rotation = 0 }) => (
  <g transform={buildTransform(x, y, size, rotation)} opacity={opacity}>
    <path fill={fill} d="M12 21L1 8.55L4.5 3h15L23 8.55zm-3.45-13H15.5L13 4.5h-2zM11 18.6V10H3.7zm2 0L20.3 10H13zM16.95 8h3.65L17.95 4.5h-3.45zm-13.55 0h3.65L9.5 4.5H6.05z" />
  </g>
);
