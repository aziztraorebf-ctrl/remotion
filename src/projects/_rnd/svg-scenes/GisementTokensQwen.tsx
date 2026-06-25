// GisementTokensQwen.tsx — MEME famille de jetons, generee par QWEN3.6-35B-A3B (llm-gen-svg.py --provider qwen,
// R&D 2026-06-24). Test : un modele open-weights a $0.14/$1 peut-il remplacer GPT-5.5/Gemini pour les jetons SVG ?
// Format identique a GisementTokensSVG.tsx (contenu interieur centre 0,0, anime par f=frame).
import React from "react";

export const SvgGasQwen: React.FC<{ f: number }> = ({ f }) => (
  <g><path d="M0,-22 C9,-11 14,2 0,16 C-14,2 -9,-11 0,-22 Z" fill="#f2efe6" opacity={0.85 + 0.15 * Math.sin(f/10)} /><path d="M0,-26 C11,-13 17,9 0,21 C-17,9 -11,-13 0,-26 Z" fill="none" stroke="#c8a951" strokeWidth="1.5" transform={`rotate(${4 * Math.sin(f/12)} 0 0)`} /><path d="M0,-16 C6,-7 10,1 0,9 C-10,1 -6,-7 0,-16 Z" fill="#c8a951" opacity={0.5 + 0.5 * Math.sin(f/14 + 1.2)} transform={`scale(${0.94 + 0.12 * Math.sin(f/11)})`} /></g>
);

export const SvgOilQwen: React.FC<{ f: number }> = ({ f }) => (
  <g><circle cx="0" cy="0" r={22 + 3 * Math.sin(f/16)} fill="none" stroke="#c8a951" strokeWidth="1.5" opacity={0.3 + 0.7 * (1 - Math.abs(Math.sin(f/16)))} /><path d="M0,-24 C10,-10 14,2 14,8 C14,19 7,25 0,25 C-7,25 -14,19 -14,8 C-14,2 -10,-10 0,-24 Z" fill="#16213a" stroke="#c8a951" strokeWidth="2" /><path d="M0,-20 C8,-8 11,2 11,7 C11,15 5,20 0,20 C-5,20 -11,15 -11,7 C-11,2 -8,-8 0,-20 Z" fill="#c8a951" opacity={0.4 + 0.4 * Math.sin(f/15)} /><circle cx="-3" cy="8" r="2.5" fill="#f2efe6" opacity="0.8" /></g>
);

export const SvgSonarQwen: React.FC<{ f: number }> = ({ f }) => (
  <g><circle cx="0" cy="0" r="2.5" fill="#f2efe6" /><circle cx="0" cy="0" r={6 + 18 * ((f % 60) / 60)} fill="none" stroke="#c8a951" strokeWidth="1.5" opacity={Math.max(0, 1 - (f % 60) / 60)} /><circle cx="0" cy="0" r={6 + 18 * (((f + 20) % 60) / 60)} fill="none" stroke="#f2efe6" strokeWidth="1.5" opacity={Math.max(0, 1 - ((f + 20) % 60) / 60)} /><circle cx="0" cy="0" r={6 + 18 * (((f + 40) % 60) / 60)} fill="none" stroke="#c8a951" strokeWidth="1.5" opacity={Math.max(0, 1 - ((f + 40) % 60) / 60)} /></g>
);

export const SvgExportQwen: React.FC<{ f: number }> = ({ f }) => (
  <g><path d="M-14,6 L-3,6 L-3,-3 L14,-16" fill="none" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><polygon points="14,-16 8,-13 10,-8" fill="#c8a951" /><circle cx="0" cy="0" r="2.5" fill="#f2efe6" transform={`translate(${14 * ((f % 50) / 50)}, ${-16 * ((f % 50) / 50)})`} opacity={1 - ((f % 50) / 50)} /></g>
);

export const SvgReserveQwen: React.FC<{ f: number }> = ({ f }) => (
  <g><rect x="-12" y="-16" width="24" height="32" rx="4" fill="none" stroke="#c8a951" strokeWidth="2" /><rect x="-10" y={-12 + 24 * (1 - ((Math.sin(f/12) + 1) / 2))} width="20" height={24 * ((Math.sin(f/12) + 1) / 2)} fill="#f2efe6" opacity="0.6" /><line x1="-14" y1="-8" x2="-10" y2="-8" stroke="#f2efe6" strokeWidth="1" /><line x1="-14" y1="0" x2="-10" y2="0" stroke="#f2efe6" strokeWidth="1" /><line x1="-14" y1="8" x2="-10" y2="8" stroke="#f2efe6" strokeWidth="1" /></g>
);
