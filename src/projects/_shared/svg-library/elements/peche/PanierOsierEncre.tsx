/**
 * PanierOsierEncre — panier d'osier tresse, pose au fond de la pirogue, destination des poissons
 * captures. Code a la main (2026-07-04, meme decision que PoissonEncre : objet geometrique simple,
 * plus rapide/fiable en code que par iteration de prompt LLM). Style ligne-fine coherent avec
 * PoissonEncre/PirogueGPT (trait #2b2117, remplissage plat).
 *
 * Coordonnees locales centrees sur la base du panier (0,0) — l'appelant positionne/scale via son
 * propre <g transform>. Prevu pour etre pose au fond de PirogueGPT (voir PecheurSurpeche16x9.tsx).
 */
import React from "react";

export const PanierOsierEncre: React.FC<{ ink?: string; fillColor?: string }> = ({
  ink = "#2b2117",
  fillColor = "#b8863c",
}) => (
  <g stroke={ink} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round">
    {/* corps du panier : trapeze evase (plus large en haut) */}
    <path d="M -38,0 L 38,0 L 30,-42 L -30,-42 Z" fill={fillColor} />
    {/* tressage horizontal (lignes fines, registre encre) */}
    <path d="M -34,-8 L 34,-8" fill="none" strokeWidth={1.5} opacity={0.6} />
    <path d="M -32,-18 L 32,-18" fill="none" strokeWidth={1.5} opacity={0.6} />
    <path d="M -31,-28 L 31,-28" fill="none" strokeWidth={1.5} opacity={0.6} />
    {/* tressage vertical (quelques traits, pas systematique) */}
    <path d="M -20,-42 L -24,0" fill="none" strokeWidth={1.2} opacity={0.5} />
    <path d="M 0,-42 L 0,0" fill="none" strokeWidth={1.2} opacity={0.5} />
    <path d="M 20,-42 L 24,0" fill="none" strokeWidth={1.2} opacity={0.5} />
    {/* bord superieur (rebord plus epais) */}
    <path d="M -30,-42 L 30,-42" fill="none" strokeWidth={3.5} />
    {/* anses laterales */}
    <path d="M -30,-38 Q -42,-30 -32,-18" fill="none" strokeWidth={2} opacity={0.7} />
    <path d="M 30,-38 Q 42,-30 32,-18" fill="none" strokeWidth={2} opacity={0.7} />
  </g>
);
