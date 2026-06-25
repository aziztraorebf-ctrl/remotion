// GisementTokensGlm.tsx — jetons SVG generes par GLM-5.2 (llm-gen-svg.py --provider glm, R&D 2026-06-24).
// GLM bat Qwen 4/5 sur les jetons (gas/sonar/export/reserve), a vitesse egale (~51s). Format identique.
// Contenu interieur centre 0,0, anime par f=frame.
import React from "react";

export const SvgGasGlm: React.FC<{ f: number }> = ({ f }) => (
  <g><rect x='-5' y='10' width='10' height='25' fill='#c8a951' rx='2' /><path d='M0,10 C-12,-5 -15,-20 0,-30 C15,-20 12,-5 0,10 Z' fill='#f2efe6' transform={`scale(1 ${1 + 0.15 * Math.sin(f/4) + 0.05 * Math.sin(f/7)})`} /><path d='M0,5 C-6,-5 -8,-15 0,-25 C8,-15 6,-5 0,5 Z' fill='#c8a951' transform={`scale(1 ${1 + 0.2 * Math.sin(f/5)})`} /></g>
);

export const SvgOilGlm: React.FC<{ f: number }> = ({ f }) => (
  <g><path d='M0,-25 C12,-5 18,5 0,25 C-18,5 -12,-5 0,-25 Z' fill='#c8a951' transform={`translate(0 ${2 * Math.sin(f/12)})`} /><path d='M0,-25 C12,-5 18,5 0,25 C-18,5 -12,-5 0,-25 Z' fill='none' stroke='#f2efe6' strokeWidth='2' transform={`translate(0 ${2 * Math.sin(f/12)})`} /><circle cx='-5' cy='10' r='4' fill='#f2efe6' opacity={0.8 + 0.2 * Math.sin(f/12)} transform={`translate(0 ${2 * Math.sin(f/12)})`} /></g>
);

export const SvgSonarGlm: React.FC<{ f: number }> = ({ f }) => (
  <g><circle cx='0' cy='0' r={5 + (f % 50) * 0.7} fill='none' stroke='#f2efe6' strokeWidth='2' opacity={1 - (f % 50) / 50} /><circle cx='0' cy='0' r={5 + ((f + 17) % 50) * 0.7} fill='none' stroke='#f2efe6' strokeWidth='2' opacity={1 - ((f + 17) % 50) / 50} /><circle cx='0' cy='0' r={5 + ((f + 34) % 50) * 0.7} fill='none' stroke='#f2efe6' strokeWidth='2' opacity={1 - ((f + 34) % 50) / 50} /><circle cx='0' cy='0' r='5' fill='#c8a951' /></g>
);

export const SvgExportGlm: React.FC<{ f: number }> = ({ f }) => (
  <g><path d='M-20,0 L20,0 M20,0 L10,-10 M20,0 L10,10' fill='none' stroke='#f2efe6' strokeWidth='4' strokeLinecap='round' strokeLinejoin='round' /><path d='M-20,0 L20,0 M20,0 L10,-10 M20,0 L10,10' fill='none' stroke='#c8a951' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' strokeDasharray='8 8' strokeDashoffset={-f * 1.5} /></g>
);

export const SvgReserveGlm: React.FC<{ f: number }> = ({ f }) => (
  <g><rect x='-18' y='-25' width='36' height='40' rx='4' fill='none' stroke='#c8a951' strokeWidth='2' /><line x1='-18' y1='-15' x2='18' y2='-15' stroke='#c8a951' strokeWidth='2' /><line x1='-18' y1='5' x2='18' y2='5' stroke='#c8a951' strokeWidth='2' /><rect x='-16' y={15 - 40 * (0.5 + 0.5 * Math.sin(f/30))} width='32' height={40 * (0.5 + 0.5 * Math.sin(f/30))} fill='#c8a951' opacity='0.6' /></g>
);
