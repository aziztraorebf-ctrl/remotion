import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// ── PROTOTYPE : Montage en Continuité de Monde ────────────────────────────────
// Scène A (0-450f / 15s) — Plan "Puissance" : turbine héros, câble, fleuve
//   Registre : encre→colorisation progressive, ambiance jour finissant
// Fondu (420-480f / 2s) — Overlap cross-dissolve
// Scène B (450-900f / 15s) — Plan "Réalité" : maisons héros, turbine au loin
//   Même monde, même palette, ambiance nuit, bougies
// Cohérence : même encre #3a2a18, même câble or, turbine visible au fond scène B

export const INGA_DUAL_FRAMES = 900;

const W = 1920, H = 1080;
const ENCRE = "#3a2a18";
const ENCRE_P = "#6a5a40";
const OR = "#e8c030";
const FOND = "#1a1008";

function cl(f: number, a: number, b: number, from: number, to: number) {
  return interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
function osc(f: number, freq: number, amp: number, phase = 0) {
  return Math.sin((f / freq) * Math.PI * 2 + phase) * amp;
}
function hexToRgb(h: string) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}
function lerpC(f: number, frames: number[], colors: string[]) {
  if (f <= frames[0]) return colors[0];
  if (f >= frames[frames.length-1]) return colors[colors.length-1];
  for (let i = 0; i < frames.length-1; i++) {
    if (f >= frames[i] && f <= frames[i+1]) {
      const t = (f-frames[i])/(frames[i+1]-frames[i]);
      const [r1,g1,b1] = hexToRgb(colors[i]);
      const [r2,g2,b2] = hexToRgb(colors[i+1]);
      return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
    }
  }
  return colors[colors.length-1];
}

// ── SCÈNE A ───────────────────────────────────────────────────────────────────
const SceneA: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  // Colorisation séquentielle (GGW règle R2)
  const encreP   = cl(f, 0, 40, 0, 1);
  const fleuveC  = lerpC(f, [0,60,120], ["#e8dcc0","#e8dcc0","#2a7abf"]);
  const turbineC = lerpC(f, [0,80,160], [ENCRE, ENCRE,"#a0a8b0"]);
  const cableOff = interpolate(f, [120, 300], [1480, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });

  // Crépuscule progressif sur la fin de A
  const skyTop = lerpC(f, [0,120,350,450], ["#e8dcc0","#5aaad8","#e05820","#c03010"]);
  const skyBot = lerpC(f, [0,120,350,450], ["#e8dcc0","#d8eeee","#f0a840","#801808"]);

  // Turbine tourne
  const angle = (f * 0.5) % 360;

  const cableColor = lerpC(f, [0,120,300], [ENCRE, ENCRE, OR]);

  return (
    <g opacity={op}>
      {/* Fond ciel */}
      <defs>
        <linearGradient id="skyA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTop}/>
          <stop offset="100%" stopColor={skyBot}/>
        </linearGradient>
        <filter id="blurA" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16"/>
        </filter>
        <filter id="glowA" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#skyA)" opacity={encreP}/>
      {/* Fond parchemin initial */}
      <rect width={W} height={H} fill="#e8dcc0" opacity={cl(f,0,120,1,0)}/>

      {/* Cadre pointillé (disparaît avec l'encre) */}
      <rect x="28" y="28" width={W-56} height={H-56}
        fill="none" stroke={ENCRE} strokeWidth="1.5" strokeDasharray="6 10"
        opacity={cl(f,80,160,0.35,0)}/>

      {/* Terrain */}
      <path d={`M0 580 Q500 540 1200 590 T1920 560 L1920 ${H} L0 ${H} Z`}
        fill={lerpC(f,[0,120,350,450],[ENCRE_P,"#5a8a30","#7a6820","#2a1a08"])} opacity="0.55"/>
      <path d={`M0 660 Q600 700 1100 640 T1920 670 L1920 ${H} L0 ${H} Z`}
        fill={lerpC(f,[0,120,350,450],[ENCRE_P,"#6a9a38","#6a5818","#2a1808"])} opacity="0.85"/>

      {/* Fleuve */}
      <path d={`M0 ${730+osc(f,180,5)} C500 750 900 710 1920 760 L1920 ${H} L0 ${H} Z`}
        fill={fleuveC}/>
      {[0,1,2].map(i => (
        <path key={i}
          d={`M${80+i*200} ${768+i*50+osc(f,90+i*20,4,i)} Q${400+i*180} ${768+i*50+osc(f,70+i*15,5,i+1)} ${700+i*200} ${768+i*50+osc(f,80+i*18,4,i+2)}`}
          stroke={lerpC(f,[0,120],[ENCRE_P,"#a0d8f0"])} strokeWidth="2" fill="none" opacity="0.5"/>
      ))}
      {/* Reflet turbine dans l'eau */}
      <ellipse cx="380" cy="860" rx="140" ry="30"
        fill={lerpC(f,[0,160,300],[ENCRE_P,"#8ab0d0",OR])}
        opacity={cl(f,80,200,0,0.12)} filter="url(#blurA)"/>

      {/* Barrage */}
      <rect x="275" y="290" width="50" height="470"
        fill={lerpC(f,[0,80,160],[ENCRE,ENCRE,"#b0b8a8"])}
        stroke={ENCRE} strokeWidth="1.5"
        opacity={encreP}/>

      {/* TURBINE HÉROS — grande, centre-gauche */}
      <g transform={`translate(380,490) rotate(${angle})`} opacity={encreP}>
        <circle cx="0" cy="0" r="200" fill={turbineC} stroke={ENCRE} strokeWidth="3"/>
        <circle cx="0" cy="0" r="170" fill="none" stroke={ENCRE} strokeWidth="2"/>
        {[0,45,90,135,180,225,270,315].map(a => (
          <path key={a} d="M -12 -40 L -20 -168 A 168 168 0 0 1 20 -168 L 12 -40 Z"
            fill={lerpC(f,[0,80,160],[ENCRE_P,ENCRE_P,"#9098a8"])}
            stroke={ENCRE} strokeWidth="2" transform={`rotate(${a})`}/>
        ))}
        <circle cx="0" cy="0" r="50" fill={lerpC(f,[0,160,300],[ENCRE,ENCRE,"#d8e0e8"])} opacity="0.4"/>
        <circle cx="0" cy="0" r="30" fill={lerpC(f,[0,160,300],[ENCRE,ENCRE,"#d8e0e8"])}/>
        <circle cx="-8" cy="-8" r="10" fill="white" opacity={cl(f,160,300,0,0.4)}/>
      </g>
      {/* Corps turbine */}
      <ellipse cx="380" cy="690" rx="200" ry="65"
        fill={lerpC(f,[0,80,160],[ENCRE,ENCRE,"#808898"])} opacity={encreP}/>

      {/* CÂBLE — tracé progressif, héros doré */}
      <path d="M 580 490 C 820 320 1020 280 1160 330 C 1380 410 1620 490 1920 530"
        stroke={lerpC(f,[0,120,300],[ENCRE,ENCRE,OR])} strokeWidth="24" fill="none"
        opacity={cl(f,120,300,0,0.12)}
        strokeDasharray="1480 1480" strokeDashoffset={cableOff}/>
      <path d="M 580 490 C 820 320 1020 280 1160 330 C 1380 410 1620 490 1920 530"
        stroke={cableColor} strokeWidth="7" fill="none"
        strokeDasharray="1480 1480" strokeDashoffset={cableOff}/>

      {/* Isolateurs */}
      {[[720,380,-18],[960,292,4],[1160,330,14],[1420,430,18]].map(([x,y,r],i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}
          opacity={cl(f,300,380,0,1)}>
          <rect x="-4" y="-14" width="8" height="28" fill={lerpC(f,[0,300,380],[ENCRE,ENCRE,"#c0c8d0"])}/>
          {[-9,0,9].map(cy => (
            <circle key={cy} cx="0" cy={cy} r="5"
              fill={lerpC(f,[0,300,380],[ENCRE,ENCRE,"#e8ecf0"])}
              stroke={lerpC(f,[0,300,380],[ENCRE_P,ENCRE_P,"#8090a0"])} strokeWidth="1.5"/>
          ))}
        </g>
      ))}

      {/* PYLÔNE visible mais pas héros — plus petit, à droite */}
      <g opacity={cl(f,60,140,0,1)}>
        <line x1="1100" y1="750" x2="1160" y2="120" stroke={lerpC(f,[0,300,420],[ENCRE,ENCRE,"#b0b8c0"])} strokeWidth="4"/>
        <line x1="1220" y1="750" x2="1160" y2="120" stroke={lerpC(f,[0,300,420],[ENCRE,ENCRE,"#b0b8c0"])} strokeWidth="4"/>
        {[[1110,640,1210],[1118,530,1202],[1128,420,1192],[1138,310,1182]].map(([x1,y,x2],i)=>(
          <line key={i} x1={x1} y1={y} x2={x2} y2={y}
            stroke={lerpC(f,[0,300,420],[ENCRE,ENCRE,"#b0b8c0"])} strokeWidth="2.5"/>
        ))}
        {/* Diagonales légères */}
        <g stroke={lerpC(f,[0,300,420],[ENCRE,ENCRE,"#a0a8b0"])} strokeWidth="1.2" opacity="0.7">
          <line x1="1110" y1="750" x2="1210" y2="640"/>
          <line x1="1210" y1="750" x2="1110" y2="640"/>
          <line x1="1110" y1="640" x2="1202" y2="530"/>
          <line x1="1202" y1="640" x2="1118" y2="530"/>
        </g>
      </g>

      {/* Maisons — très petites au fond, en encre, à droite */}
      {[[1550,640,60,45],[1630,655,48,40],[1700,648,54,42]].map(([x,y,w,h],i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity={cl(f,40,100,0,0.6)}>
          <rect x="0" y="0" width={w} height={h} fill="none" stroke={ENCRE} strokeWidth="1.2"/>
          <polygon points={`-5,0 ${w/2},-${h*0.35} ${w+5},0`} fill="none" stroke={ENCRE} strokeWidth="1"/>
          <rect x={w*0.18} y={h*0.25} width={w*0.22} height={h*0.28} fill="none" stroke={ENCRE} strokeWidth="0.8"/>
          <rect x={w*0.60} y={h*0.25} width={w*0.22} height={h*0.28} fill="none" stroke={ENCRE} strokeWidth="0.8"/>
        </g>
      ))}

      {/* Flèche câble pulse */}
      <path d={`M1880 ${522+osc(f,30,3)} L1915 ${530+osc(f,30,3)} L1880 ${538+osc(f,30,3)}`}
        fill="none" stroke={OR} strokeWidth="3.5" strokeLinejoin="round"
        opacity={cl(f,300,380,0,1) * (0.6+osc(f,30,0.3))}/>
    </g>
  );
};

// ── SCÈNE B ───────────────────────────────────────────────────────────────────
const SceneB: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  // f ici est relatif à la scène (0 = début de B)
  const bougieOp = cl(f, 60, 180, 0, 1) * (0.7 + osc(f, 7, 0.15) + osc(f, 13, 0.1, 1.2));
  const starsOp  = cl(f, 30, 120, 0, 1);
  const braiseOp = cl(f, 0, 60, 0, 0.35);

  return (
    <g opacity={op}>
      <defs>
        <radialGradient id="braiseB" cx="200" cy="500" r="600" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c04020" stopOpacity={braiseOp}/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        <filter id="blurB" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16"/>
        </filter>
        <filter id="glowB" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Halos bougies */}
        {[[1120,590],[1280,565],[1440,578],[1580,570]].map(([cx,cy],i) => (
          <radialGradient key={i} id={`cgB${i}`} cx={cx} cy={cy} r="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffcc60" stopOpacity={bougieOp * 0.55}/>
            <stop offset="100%" stopColor="#ffcc60" stopOpacity="0"/>
          </radialGradient>
        ))}
      </defs>

      {/* Fond nuit */}
      <rect width={W} height={H} fill="#0a0818"/>
      <rect width={W} height={H} fill="url(#braiseB)"/>

      {/* Étoiles */}
      {STARS_B.map((s,i) => (
        <circle key={i} cx={s[0]} cy={s[1]} r={s[2]}
          fill="white" opacity={starsOp*(0.4+osc(f,60+i*7,0.4,i))}/>
      ))}

      {/* Lune */}
      <circle cx="1760" cy="130" r="40" fill="#e8e0c8" opacity={cl(f,30,120,0,0.88)}/>
      <circle cx="1775" cy="122" r="32" fill="#0a0818" opacity={cl(f,30,120,0,0.88)}/>

      {/* Terrain nuit */}
      <path d={`M0 600 Q500 560 1100 605 T1920 580 L1920 ${H} L0 ${H} Z`}
        fill="#1a1008" opacity="0.55"/>
      <path d={`M0 670 Q600 710 1100 650 T1920 680 L1920 ${H} L0 ${H} Z`}
        fill="#2a1a08" opacity="0.85"/>

      {/* Fleuve nuit — très sombre */}
      <path d={`M0 ${740+osc(f,180,5)} C500 760 900 720 1920 770 L1920 ${H} L0 ${H} Z`}
        fill="#0a1828"/>
      {[0,1].map(i => (
        <path key={i}
          d={`M${100+i*300} ${778+i*40+osc(f,90+i*20,3,i)} Q${500+i*200} ${778+i*40+osc(f,70+i*15,4,i+1)} ${900+i*200} ${778+i*40+osc(f,80+i*18,3,i+2)}`}
          stroke="#1a3848" strokeWidth="1.5" fill="none" opacity="0.5"/>
      ))}

      {/* CÂBLE — toujours or, passe en haut, rappel que l'énergie part */}
      <path d="M 0 480 C 300 360 600 310 800 330 C 1000 350 1200 390 1920 430"
        stroke={OR} strokeWidth="24" fill="none" opacity={0.08+osc(f,45,0.04)}/>
      <path d="M 0 480 C 300 360 600 310 800 330 C 1000 350 1200 390 1920 430"
        stroke={OR} strokeWidth="6" fill="none" opacity="0.9"/>
      {/* Reflet câble sur le ciel sombre */}
      <path d="M 0 480 C 300 360 600 310 800 330 C 1000 350 1200 390 1920 430"
        stroke="white" strokeWidth="1.5" fill="none" opacity="0.2"/>
      {/* Isolateurs câble B */}
      {[[240,428,-15],[520,358,3],[800,330,10],[1100,365,16],[1500,408,18]].map(([x,y,r],i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <rect x="-3" y="-12" width="6" height="24" fill="#c8a060"/>
          {[-8,0,8].map(cy=>(
            <circle key={cy} cx="0" cy={cy} r="4" fill="#1a1008" stroke="#c8a060" strokeWidth="1.2"/>
          ))}
        </g>
      ))}
      <path d={`M1880 ${422+osc(f,30,3)} L1912 ${430+osc(f,30,3)} L1880 ${438+osc(f,30,3)}`}
        fill="none" stroke={OR} strokeWidth="3" strokeLinejoin="round"
        opacity={0.6+osc(f,30,0.3)}/>

      {/* TURBINE — petite, fond gauche, arrêtée */}
      <g transform="translate(180,500)" opacity={cl(f,0,60,0,0.5)}>
        <circle cx="0" cy="0" r="80" fill="#3a2a18" stroke="#5a4030" strokeWidth="2"/>
        {[0,45,90,135,180,225,270,315].map(a=>(
          <path key={a} d="M -5 -16 L -8 -67 A 67 67 0 0 1 8 -67 L 5 -16 Z"
            fill="#4a3820" stroke="#3a2a18" strokeWidth="1.5" transform={`rotate(${a})`}/>
        ))}
        <circle cx="0" cy="0" r="12" fill="#f2a020" opacity={0.3+osc(f,25,0.1)}/>
        {/* Glow très faible — turbine chaude mais arrêtée */}
        <circle cx="0" cy="0" r="16" fill="#f2a020" opacity={0.2+osc(f,25,0.1)} filter="url(#glowB)"/>
      </g>
      <rect x="155" y="290" width="22" height="300" fill="#2a1a08" opacity={cl(f,0,60,0,0.5)}/>

      {/* Halos bougies */}
      {[0,1,2,3].map(i=>(
        <rect key={i} width={W} height={H} fill={`url(#cgB${i})`}/>
      ))}

      {/* MAISONS HÉROS — grandes, centre de la scène */}
      {HOUSES_B.map((h,hi)=>(
        <g key={hi} transform={`translate(${h.x},${h.y})`}
          opacity={cl(f,0,40,0,1)}>
          <ellipse cx={h.w/2} cy={h.h+h.ry+10} rx={h.w*0.6} ry="9"
            fill="#0a0502" opacity="0.35"/>
          {/* Corps */}
          <rect x="0" y={h.ry} width={h.w} height={h.h}
            fill="#4a3020" stroke="#c8a060" strokeWidth="1.8"/>
          {/* Texture */}
          <line x1="4" y1={h.ry+h.h*0.33} x2={h.w-4} y2={h.ry+h.h*0.33}
            stroke="#3a2010" strokeWidth="0.8" opacity="0.5"/>
          <line x1="4" y1={h.ry+h.h*0.66} x2={h.w-4} y2={h.ry+h.h*0.66}
            stroke="#3a2010" strokeWidth="0.8" opacity="0.5"/>
          {/* Toit */}
          <rect x={-8} y={h.ry-14} width={h.w+16} height={18}
            fill="#4a2010" stroke="#c8a060" strokeWidth="1.5"/>
          <rect x={-8} y={h.ry-20} width={h.w+16} height={8} fill="#2a1008"/>
          {/* Fenêtres avec bougies */}
          {h.wins.map((w,wi)=>(
            <g key={wi}>
              <rect x={w[0]} y={w[1]} width={w[2]} height={w[3]}
                fill="#1a1208" stroke="#c8a060" strokeWidth="1"/>
              <line x1={w[0]+w[2]/2} y1={w[1]} x2={w[0]+w[2]/2} y2={w[1]+w[3]}
                stroke="#0a0a08" strokeWidth="0.8"/>
              <line x1={w[0]} y1={w[1]+w[3]/2} x2={w[0]+w[2]} y2={w[1]+w[3]/2}
                stroke="#0a0a08" strokeWidth="0.8"/>
              {/* Bougie */}
              <ellipse cx={w[0]+w[2]/2} cy={w[1]+w[3]-5}
                rx="4" ry="7" fill="#ffcc60" opacity={bougieOp*0.7}/>
              <ellipse cx={w[0]+w[2]/2} cy={w[1]+w[3]-9}
                rx="2.5" ry="4.5" fill="#fff0a0" opacity={bougieOp*0.9}/>
            </g>
          ))}
          {/* Porte */}
          <rect x={h.door[0]} y={h.door[1]} width={h.door[2]} height={h.door[3]}
            fill={h.doorColor} stroke="#c8a060" strokeWidth="1"/>
        </g>
      ))}

      {/* Palmiers nuit */}
      {[[880,655,120,20,11,4],[1020,645,110,16,9,3.5],[1680,650,115,18,10,3.5]].map(([x,y,h,rx,ry,thick],i)=>(
        <g key={i} transform={`translate(${x},${y})`} opacity={cl(f,0,60,0,0.8)}>
          <line x1={osc(f,120,2,i)} y1={h} x2={osc(f,120,3,i)} y2="0"
            stroke="#3a2808" strokeWidth={thick}/>
          <ellipse cx={osc(f,120,3,i)} cy="0" rx={rx} ry={ry} fill="#2a5015" opacity="0.85"/>
          <ellipse cx={osc(f,120,3,i)-rx*0.7} cy={ry*0.6}
            rx={rx*0.75} ry={ry*0.6} fill="#3a6018" opacity="0.75"
            transform={`rotate(-28,${osc(f,120,3,i)-rx*0.7},${ry*0.6})`}/>
          <ellipse cx={osc(f,120,3,i)+rx*0.7} cy={ry*0.6}
            rx={rx*0.75} ry={ry*0.6} fill="#3a6018" opacity="0.75"
            transform={`rotate(28,${osc(f,120,3,i)+rx*0.7},${ry*0.6})`}/>
        </g>
      ))}

      {/* Ligne sol */}
      <path d="M 880 700 C 1000 690 1200 700 1720 695"
        fill="none" stroke="#4a3010" strokeWidth="1.2" opacity="0.35"/>
    </g>
  );
};

// ── COMPOSITION PRINCIPALE ────────────────────────────────────────────────────
export const IngaDualScene: React.FC = () => {
  const f = useCurrentFrame();

  // Opacités des deux scènes — cross-dissolve 60f (2s) centré sur f=450
  const opA = interpolate(f, [390, 480], [1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  const opB = interpolate(f, [390, 480], [0, 1], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });

  // Frame locale scène B (commence à f=390 pour le fondu)
  const fB = Math.max(0, f - 390);

  // Sous-titres
  const SUBS = [
    { in:20,   out:160,  text:"Le Grand Inga. 40 000 mégawatts sur le papier." },
    { in:180,  out:320,  text:"Le câble s'illumine. L'énergie part vers l'est." },
    { in:340,  out:420,  text:"À côté — des maisons. En attente." },
    { in:510,  out:650,  text:"La nuit tombe sur le village." },
    { in:670,  out:820,  text:"Le câble passe toujours au-dessus. Il ne s'arrête pas ici." },
    { in:840,  out:880,  text:"Une bougie." },
  ];
  const activeSub = SUBS.find(s => f >= s.in && f <= s.out);
  const subOp = activeSub
    ? interpolate(f, [activeSub.in, activeSub.in+12, activeSub.out-12, activeSub.out],
        [0,1,1,0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ background: FOND }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Scène A */}
        <SceneA f={f} op={opA}/>
        {/* Scène B — frame locale */}
        <SceneB f={fB} op={opB}/>

        {/* Sous-titres (toujours au-dessus) */}
        {subOp > 0 && activeSub && (
          <g>
            <rect x="160" y={H-125} width={W-320} height={72} rx="6"
              fill="#000" opacity={subOp*0.62}/>
            <text x={W/2} y={H-76}
              textAnchor="middle" fontFamily="Georgia, serif" fontSize="34"
              fill="white" opacity={subOp} style={{ letterSpacing:"0.02em" }}>
              {activeSub.text}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ── DONNÉES ───────────────────────────────────────────────────────────────────
const STARS_B: [number,number,number][] = [
  [80,50,1.5],[220,35,1],[420,70,2],[580,28,1.5],[760,52,1],[940,22,2],
  [1080,68,1.5],[1280,42,1],[1430,62,2],[1580,32,1.5],[1740,75,1],[1840,48,1.5],
  [180,125,1],[380,105,1.5],[680,95,1],[1140,88,1.5],[1360,110,1],[1640,170,2],
];

const HOUSES_B = [
  { x:1080,y:555,w:120,h:95,ry:22,
    wins:[[14,42,30,30],[76,42,30,30]] as [number,number,number,number][],
    door:[46,74,28,43] as [number,number,number,number], doorColor:"#1a3a8a" },
  { x:1230,y:535,w:95,h:82,ry:18,
    wins:[[12,34,24,24],[59,34,24,24]] as [number,number,number,number][],
    door:[35,62,25,38] as [number,number,number,number], doorColor:"#1a6030" },
  { x:1360,y:548,w:85,h:72,ry:16,
    wins:[[10,30,22,20],[53,30,22,20]] as [number,number,number,number][],
    door:[31,54,23,34] as [number,number,number,number], doorColor:"#1a3a8a" },
  { x:1470,y:558,w:70,h:64,ry:14,
    wins:[[9,26,18,16],[43,26,18,16]] as [number,number,number,number][],
    door:[25,48,20,30] as [number,number,number,number], doorColor:"#206040" },
];
