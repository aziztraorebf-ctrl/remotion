import {useCurrentFrame, AbsoluteFill} from "remotion";

// R&D 2026-07-17 — Duel SVG Kimi K3 vs GLM-5.2 (meme brief fige). Composant de comparaison visuelle.
export const DuelKimiGlm: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: "#16213a"}}>
      <svg viewBox="0 0 1080 960" width="1080" height="960">
        <text x="540" y="60" fontSize="34" fill="#f2efe6" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold">DUEL SVG — Kimi K3 vs GLM-5.2</text>
        <text x="540" y="200" fontSize="20" fill="#c8a951" textAnchor="middle" fontFamily="monospace">GLM-5.2  (~0.00$)</text>
        <text x="540" y="520" fontSize="20" fill="#c8a951" textAnchor="middle" fontFamily="monospace">Kimi K3  (0.201$ / 13k tok, reasoning max)</text>
        <line x1="60" y1="440" x2="1020" y2="440" stroke="#2a3a5a" strokeWidth="1" />
      <g transform="translate(140 300)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">gas</text>
        <g><ellipse cx="0" cy="28" rx="14" ry="3" fill="#c8a951" opacity="0.22"/><path d="M0 28 C -14 8, -10 -14, 0 -28 C 10 -14, 14 8, 0 28 Z" fill="#c8a951" opacity="0.95" transform={`translate(${1.2*Math.sin(f/7)} ${1.8*Math.sin(f/9)}) scale(${0.94+0.06*Math.sin(f/6)} ${0.88+0.12*Math.sin(f/8)})`} /><path d="M0 24 C -7 6, -5 -10, 0 -22 C 5 -10, 7 6, 0 24 Z" fill="#f2efe6" opacity="0.9" transform={`translate(${0.8*Math.sin(f/6+1)} ${1.2*Math.sin(f/10)}) scale(${0.9+0.08*Math.sin(f/5)} ${0.86+0.12*Math.sin(f/9)})`} /><path d="M0 18 C -3 4, -2 -6, 0 -14 C 2 -6, 3 4, 0 18 Z" fill="#16213a" opacity="0.55" transform={`scale(${0.9+0.1*Math.sin(f/7)} ${0.9+0.1*Math.sin(f/11)})`} /></g>
      </g>
      <g transform="translate(140 620)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">gas</text>
        <g><circle cx="0" cy="-14" r={19 + 2 * Math.sin(f / 3.7)} fill="#c8a951" opacity={0.1 + 0.05 * Math.sin(f / 3.7 + 1)} /><g transform="translate(0 3)"><g transform={`translate(${1.6 * Math.sin(f / 4.3) + 0.7 * Math.sin(f / 2.1)} 0) scale(${1 + 0.05 * Math.sin(f / 3.1)} ${1 + 0.09 * Math.sin(f / 2.6 + 1.3) + 0.04 * Math.sin(f / 1.7)}) skewX(${3.5 * Math.sin(f / 3.9 + 0.6)})`}><g transform="translate(0 -3)"><path d="M0,-30 C8,-19 12,-10 8,-2 C5,3 -5,3 -8,-2 C-12,-10 -8,-19 0,-30 Z" fill="#c8a951" /><path d="M0,-17 C4,-10 6,-5 3.5,0 C1.5,2 -1.5,2 -3.5,0 C-6,-5 -4,-10 0,-17 Z" fill="#f2efe6" opacity={0.85 + 0.15 * Math.sin(f / 2.2)} /></g></g></g><polygon points="-5,10 5,10 2.5,26 -2.5,26" fill="#16213a" stroke="#c8a951" strokeWidth="2" /><line x1="-7" y1="28" x2="7" y2="28" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" /></g>
      </g>
      <g transform="translate(340 300)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">oil</text>
        <g><polygon points="-22,25 22,25 8,-10 -8,-10" fill="none" stroke="#c8a951" strokeWidth="2"/><line x1="-22" y1="25" x2="8" y2="-10" stroke="#c8a951" strokeWidth="1.4"/><line x1="22" y1="25" x2="-8" y2="-10" stroke="#c8a951" strokeWidth="1.4"/><line x1="-15" y1="8" x2="15" y2="8" stroke="#c8a951" strokeWidth="1.4"/><line x1="-12" y1="0" x2="12" y2="0" stroke="#c8a951" strokeWidth="1.4"/><line x1="0" y1="-10" x2="0" y2="-20" stroke="#f2efe6" strokeWidth="1.6" opacity={0.55+0.45*Math.sin(f/15)}/><circle cx="0" cy="-10" r="4" fill="#f2efe6" opacity={0.4+0.4*Math.sin(f/15)}/><circle cx="0" cy={-22-Math.abs(Math.sin(f/15))*6} r="2" fill="#c8a951" opacity={0.6+0.4*Math.sin(f/15)}/></g>
      </g>
      <g transform="translate(340 620)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">oil</text>
        <g><g transform={`scale(${1 + 0.045 * Math.sin(f / 14)})`}><path d="M0,-28 C8,-17 13,-10 13,-2 C13,5 7,10 0,10 C-7,10 -13,5 -13,-2 C-13,-10 -8,-17 0,-28 Z" fill="#16213a" stroke="#c8a951" strokeWidth="2.5" /><ellipse cx="-4" cy="-4" rx="3" ry="5" fill="#f2efe6" opacity="0.85" transform="rotate(-18 -4 -4)" /></g><ellipse cx="0" cy="20" rx={5 + 20 * ((f / 50) % 1)} ry={1.8 + 7 * ((f / 50) % 1)} fill="none" stroke="#c8a951" strokeWidth={2.4 - 1.6 * ((f / 50) % 1)} opacity={0.9 * (1 - ((f / 50) % 1))} /><ellipse cx="0" cy="20" rx={5 + 20 * ((f / 50 + 1 / 3) % 1)} ry={1.8 + 7 * ((f / 50 + 1 / 3) % 1)} fill="none" stroke="#c8a951" strokeWidth={2.4 - 1.6 * ((f / 50 + 1 / 3) % 1)} opacity={0.9 * (1 - ((f / 50 + 1 / 3) % 1))} /><ellipse cx="0" cy="20" rx={5 + 20 * ((f / 50 + 2 / 3) % 1)} ry={1.8 + 7 * ((f / 50 + 2 / 3) % 1)} fill="none" stroke="#c8a951" strokeWidth={2.4 - 1.6 * ((f / 50 + 2 / 3) % 1)} opacity={0.9 * (1 - ((f / 50 + 2 / 3) % 1))} /><line x1="-9" y1="29" x2="9" y2="29" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" opacity="0.5" /></g>
      </g>
      <g transform="translate(540 300)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">sonar</text>
        <g><circle r="3.5" fill="#f2efe6"/><circle r="3.5" fill="#c8a951" opacity="0.45"/><circle r={((f/45)%1)*38} fill="none" stroke="#c8a951" strokeWidth="1.6" opacity={1-((f/45)%1)}/><circle r={(((f/45)+0.33)%1)*38} fill="none" stroke="#c8a951" strokeWidth="1.6" opacity={1-(((f/45)+0.33)%1)}/><circle r={(((f/45)+0.66)%1)*38} fill="none" stroke="#c8a951" strokeWidth="1.6" opacity={1-(((f/45)+0.66)%1)}/></g>
      </g>
      <g transform="translate(540 620)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">sonar</text>
        <g><circle cx="0" cy="0" r="34" fill="none" stroke="#c8a951" strokeWidth="1" opacity="0.16" /><line x1="0" y1="-31" x2="0" y2="-36.5" stroke="#c8a951" strokeWidth="1.5" opacity="0.4" /><line x1="0" y1="31" x2="0" y2="36.5" stroke="#c8a951" strokeWidth="1.5" opacity="0.4" /><line x1="-31" y1="0" x2="-36.5" y2="0" stroke="#c8a951" strokeWidth="1.5" opacity="0.4" /><line x1="31" y1="0" x2="36.5" y2="0" stroke="#c8a951" strokeWidth="1.5" opacity="0.4" /><circle cx="0" cy="0" r={6 + 27 * ((f / 60) % 1)} fill="none" stroke="#c8a951" strokeWidth={2.6 - 1.8 * ((f / 60) % 1)} opacity={0.95 * (1 - ((f / 60) % 1))} /><circle cx="0" cy="0" r={6 + 27 * ((f / 60 + 1 / 3) % 1)} fill="none" stroke="#c8a951" strokeWidth={2.6 - 1.8 * ((f / 60 + 1 / 3) % 1)} opacity={0.95 * (1 - ((f / 60 + 1 / 3) % 1))} /><circle cx="0" cy="0" r={6 + 27 * ((f / 60 + 2 / 3) % 1)} fill="none" stroke="#c8a951" strokeWidth={2.6 - 1.8 * ((f / 60 + 2 / 3) % 1)} opacity={0.95 * (1 - ((f / 60 + 2 / 3) % 1))} /><circle cx="0" cy="0" r={3.4 + 1 * Math.sin(f / 9)} fill="#f2efe6" /><circle cx="0" cy="0" r="1.6" fill="#c8a951" /></g>
      </g>
      <g transform="translate(740 300)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">export</text>
        <g><circle r="30" fill="none" stroke="#c8a951" strokeWidth="1" opacity="0.28"/><line x1="-25" y1="0" x2="18" y2="0" stroke="#c8a951" strokeWidth="2.5"/><polygon points="18,-9 32,0 18,9" fill="#c8a951"/><circle r="3" fill="#f2efe6" transform={`translate(${-26 + ((f/4)%48)} 0)`} opacity={1-((f/4)%48)/48}/></g>
      </g>
      <g transform="translate(740 620)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">export</text>
        <g><circle cx="-20" cy="18" r={6 + 6 * ((f / 40) % 1)} fill="none" stroke="#c8a951" strokeWidth="1.6" opacity={0.7 * (1 - ((f / 40) % 1))} /><polygon points="-20,12 -14,18 -20,24 -26,18" fill="#c8a951" opacity={0.75 + 0.25 * Math.sin(f / 12)} /><path d="M-13,11 C-5,6 2,-2 10,-10" fill="none" stroke="#c8a951" strokeWidth="1.5" opacity="0.25" /><path d="M-13,11 C-5,6 2,-2 10,-10" fill="none" stroke="#c8a951" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="7 6" strokeDashoffset={-1.2 * f} /><polygon points="24,-24 19,-13 13,-19" fill="#f2efe6" opacity={0.85 + 0.15 * Math.sin(f / 10)} /></g>
      </g>
      <g transform="translate(940 300)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">reserve</text>
        <g><rect x="-14" y="-28" width="28" height="40" rx="3" fill="none" stroke="#c8a951" strokeWidth="2"/><rect x="-12" y={12 - 36*(0.45+0.25*Math.sin(f/30))} width="24" height={36*(0.45+0.25*Math.sin(f/30))} fill="#c8a951" opacity="0.92"/><path d="M-12,12 q6,-3 12,0 t12,0" fill="none" stroke="#f2efe6" strokeWidth="1.5" transform={`translate(0 ${-36*(0.45+0.25*Math.sin(f/30))})`} opacity="0.9"/><line x1="14" y1="-20" x2="18" y2="-20" stroke="#f2efe6" strokeWidth="1"/><line x1="14" y1="-10" x2="18" y2="-10" stroke="#f2efe6" strokeWidth="1"/><line x1="14" y1="0" x2="18" y2="0" stroke="#f2efe6" strokeWidth="1"/><line x1="14" y1="10" x2="18" y2="10" stroke="#f2efe6" strokeWidth="1"/></g>
      </g>
      <g transform="translate(940 620)">
        <text x="0" y="-52" fontSize="9" fill="#8899bb" textAnchor="middle" fontFamily="monospace">reserve</text>
        <g><rect x="-4" y="-33" width="8" height="7" rx="2" fill="#c8a951" /><rect x="-14" y="-26" width="28" height="52" rx="7" fill="#16213a" stroke="#c8a951" strokeWidth="2.5" /><rect x="-10.5" y={20 - (19 + 9 * Math.sin(f / 14))} width="21" height={19 + 9 * Math.sin(f / 14)} fill="#c8a951" opacity="0.9" /><ellipse cx="0" cy={20 - (19 + 9 * Math.sin(f / 14))} rx="10.5" ry="2.2" fill="#f2efe6" opacity="0.55" /><line x1="-20" y1="-13" x2="-15" y2="-13" stroke="#c8a951" strokeWidth="1.6" opacity="0.7" /><line x1="-22" y1="0" x2="-15" y2="0" stroke="#c8a951" strokeWidth="1.6" opacity="0.7" /><line x1="-20" y1="13" x2="-15" y2="13" stroke="#c8a951" strokeWidth="1.6" opacity="0.7" /><line x1="-18" y1="30" x2="18" y2="30" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" opacity="0.8" /></g>
      </g>
      </svg>
    </AbsoluteFill>
  );
};
