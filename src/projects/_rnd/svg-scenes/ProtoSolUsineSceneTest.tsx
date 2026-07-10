/**
 * ProtoSolUsineSceneTest — test de polyvalence de style : scene usine de cacao 9:16 (registre industriel
 * chaleureux) generee par openai/gpt-5.6-sol SANS image de reference, a comparer a UsineConstruction.tsx
 * (out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4 ~65-70s). Meme session que ProtoSolCargoSceneTest.tsx
 * (registre maritime tropical) — 2 registres tres differents, tous deux reussis (memory/tools/openrouter-svg.md).
 * Sol a spontanement inclus des balises SMIL <animateTransform>/<animate> dans son propre SVG — ce proto
 * pilote les MEMES groupes via useCurrentFrame() (frame-driven, zero SMIL/CSS, conforme a la doctrine projet).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const PROTO_SOL_USINE_SCENE_TEST_FRAMES = 210;

function puffAnim(frame: number, period: number, offset: number, opacityFrom: number, scaleFrom: number, scaleTo: number, dx: number, dy: number) {
  const t = ((frame + offset) % period) / period;
  const opacity = interpolate(t, [0, 0.6, 1], [opacityFrom, opacityFrom * 0.5, 0]);
  const scale = interpolate(t, [0, 1], [scaleFrom, scaleTo]);
  const x = interpolate(t, [0, 1], [0, dx]);
  const y = interpolate(t, [0, 1], [0, dy]);
  return { opacity, scale, x, y };
}

export const ProtoSolUsineSceneTest: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const sun = { x: Math.sin(frame / 90) * 18, y: -Math.sin(frame / 90) * 5 };

  const bird1X = interpolate(frame, [0, 210], [218, 218 + 88], { extrapolateRight: "clamp" });
  const bird1Y = 356 + Math.sin(frame / 8) * 4;
  const bird2X = interpolate(frame, [0, 210], [878, 878 - 80], { extrapolateRight: "clamp" });
  const bird2Y = 430 + Math.sin(frame / 9) * 4;

  const puffNewest = puffAnim(frame, 156, 0, 0.82, 0.72, 1.22, 8, -96);
  const puff2 = puffAnim(frame, 180, -42, 0.68, 0.88, 1.35, -8, -105);
  const puff3 = puffAnim(frame, 204, -84, 0.5, 1, 1.52, 12, -116);
  const puffOldest = puffAnim(frame, 225, -129, 0.34, 1.12, 1.72, -10, -126);

  const conv1T = ((frame % 195) / 195);
  const conv1 = { x: interpolate(conv1T, [0, 1], [0, -92]), y: interpolate(conv1T, [0, 1], [0, 248]), o: interpolate(conv1T, [0, 0.08, 0.72, 0.92, 1], [0, 1, 1, 0.92, 0]) };
  const conv2T = (((frame - 65 + 1000) % 195) / 195);
  const conv2 = { x: interpolate(conv2T, [0, 1], [0, -106]), y: interpolate(conv2T, [0, 1], [0, 278]), o: interpolate(conv2T, [0, 0.08, 0.72, 0.92, 1], [0, 1, 1, 0.92, 0]) };
  const conv3T = (((frame - 129 + 1000) % 195) / 195);
  const conv3 = { x: interpolate(conv3T, [0, 1], [0, -108]), y: interpolate(conv3T, [0, 1], [0, 235]), o: interpolate(conv3T, [0, 0.08, 0.72, 0.92, 1], [0, 1, 1, 0.92, 0]) };

  return (
    <AbsoluteFill style={{ backgroundColor: "#F8EAC5" }}>
      <div style={{ opacity: fade }}>
        <svg width={540} height={960} viewBox="0 0 1080 1920" role="img">
          <defs>
            <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor="#F8EAC5" /><stop offset={0.58} stopColor="#F2D39B" /><stop offset={1} stopColor="#DFA66F" />
            </linearGradient>
            <radialGradient id="sun-gradient" cx="42%" cy="38%" r="62%">
              <stop offset={0} stopColor="#FFF7C6" /><stop offset={0.55} stopColor="#F6C95E" /><stop offset={1} stopColor="#E99D32" />
            </radialGradient>
            <linearGradient id="ground-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor="#B88E55" /><stop offset={1} stopColor="#6E653D" />
            </linearGradient>
            <linearGradient id="wall-main-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset={0} stopColor="#D9854C" /><stop offset={0.52} stopColor="#C9683F" /><stop offset={1} stopColor="#A94D36" />
            </linearGradient>
            <linearGradient id="wall-side-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset={0} stopColor="#E29A55" /><stop offset={1} stopColor="#BC5D3C" />
            </linearGradient>
            <linearGradient id="glass-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset={0} stopColor="#DDE1A8" /><stop offset={0.48} stopColor="#A8AF72" /><stop offset={1} stopColor="#6F7952" />
            </linearGradient>
            <linearGradient id="chimney-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset={0} stopColor="#9C4935" /><stop offset={0.48} stopColor="#D07B49" /><stop offset={1} stopColor="#8C3C31" />
            </linearGradient>
            <filter id="sun-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation={22} /></filter>
            <filter id="soft-shadow" x="-30%" y="-30%" width="180%" height="180%">
              <feGaussianBlur in="SourceAlpha" stdDeviation={13} />
              <feOffset dx={0} dy={15} result="offsetblur" />
              <feComponentTransfer><feFuncA type="linear" slope={0.24} /></feComponentTransfer>
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <pattern id="wall-hatch" width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <path d="M0 2H22" fill="none" stroke="#71382F" strokeWidth={2} opacity={0.12} />
            </pattern>
            <pattern id="ground-hatch" width={34} height={34} patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
              <path d="M0 5H18" fill="none" stroke="#3F4430" strokeWidth={3} opacity={0.12} />
            </pattern>
            <clipPath id="factory-body-clip"><path d="M174 858L756 770L930 882V1327L304 1427L174 1304Z" /></clipPath>
          </defs>

          <g id="sky">
            <rect width={1080} height={1920} fill="url(#sky-gradient)" />
            <path d="M0 902C166 820 304 842 445 888C603 940 770 908 1080 790V1130H0Z" fill="#D5B178" opacity={0.32} />
            <path d="M0 994C196 894 371 954 514 991C676 1033 844 979 1080 884V1210H0Z" fill="#C29A64" opacity={0.27} />
          </g>

          <g id="sun" transform={`translate(${790 + sun.x} ${250 + sun.y})`}>
            <circle r={116} fill="#F6C95E" opacity={0.27} filter="url(#sun-glow)" />
            <circle r={70} fill="url(#sun-gradient)" stroke="#594239" strokeWidth={5} />
            <path d="M-28 -44C-5 -58 25 -54 43 -34" stroke="#FFF0BC" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.48} />
          </g>

          <g id="bird-1" transform={`translate(${bird1X} ${bird1Y})`}>
            <path d="M-47 6C-30 -12 -11 -13 0 1C12 -14 33 -13 51 5C31 -3 14 4 0 18C-13 5 -29 -2 -47 6Z" fill="#59483A" />
          </g>
          <g id="bird-2" transform={`translate(${bird2X} ${bird2Y})`}>
            <path d="M-37 5C-24 -9 -8 -10 0 1C10 -11 26 -9 39 5C24 0 11 5 0 16C-10 6 -23 0 -37 5Z" fill="#6A503C" opacity={0.86} />
          </g>

          <g id="distant-ground">
            <path d="M0 1088C152 1001 300 1021 433 1071C592 1131 736 1064 865 1024C959 994 1023 1010 1080 1033V1385H0Z" fill="#9B8A56" stroke="#594239" strokeWidth={5} />
            <path d="M0 1190C174 1100 346 1140 511 1199C699 1266 880 1163 1080 1120V1535H0Z" fill="#777549" opacity={0.88} />
          </g>

          <g id="smokestack" filter="url(#soft-shadow)">
            <path d="M770 813L793 485L879 477L894 800Z" fill="url(#chimney-gradient)" stroke="#47372F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M792 485Q837 466 879 477L876 509Q835 523 790 510Z" fill="#6C3B31" stroke="#47372F" strokeWidth={8} />
          </g>

          <g id="smoke-plume">
            <g id="smoke-puff-newest" transform={`translate(${835 + puffNewest.x} ${458 + puffNewest.y}) scale(${puffNewest.scale})`} opacity={puffNewest.opacity}>
              <path d="M-46 9C-56 -17 -36 -42 -10 -39C3 -59 39 -55 47 -31C69 -24 73 7 55 22C39 40 6 39 -8 27C-26 36 -43 26 -46 9Z" fill="#D7C8A6" stroke="#68594B" strokeWidth={6} />
            </g>
            <g id="smoke-puff-2" transform={`translate(${815 + puff2.x} ${372 + puff2.y}) scale(${puff2.scale})`} opacity={puff2.opacity}>
              <path d="M-54 10C-64 -20 -39 -48 -12 -44C5 -65 43 -58 50 -31C76 -17 72 18 50 30C31 47 3 40 -11 29C-32 42 -51 31 -54 10Z" fill="#DCCFB1" stroke="#6A5C4E" strokeWidth={6} />
            </g>
            <g id="smoke-puff-3" transform={`translate(${844 + puff3.x} ${286 + puff3.y}) scale(${puff3.scale})`} opacity={puff3.opacity}>
              <path d="M-62 8C-70 -24 -47 -52 -18 -50C-2 -75 43 -70 55 -40C82 -30 89 8 63 27C46 50 7 48 -10 34C-35 49 -58 34 -62 8Z" fill="#E1D6BC" stroke="#77695A" strokeWidth={6} />
            </g>
            <g id="smoke-puff-oldest" transform={`translate(${812 + puffOldest.x} ${191 + puffOldest.y}) scale(${puffOldest.scale})`} opacity={puffOldest.opacity}>
              <path d="M-65 7C-73 -27 -44 -58 -15 -52C5 -78 49 -68 57 -37C86 -22 83 15 61 31C40 53 6 48 -12 35C-36 50 -61 34 -65 7Z" fill="#E7DDC7" stroke="#847668" strokeWidth={5} />
            </g>
          </g>

          <g id="factory" filter="url(#soft-shadow)">
            <g id="factory-body">
              <path d="M174 858L756 770L930 882V1327L304 1427L174 1304Z" fill="url(#wall-main-gradient)" stroke="#47372F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M174 858L756 770V1328L304 1427L174 1304Z" fill="url(#wall-side-gradient)" stroke="#47372F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M756 770L930 882V1327L756 1328Z" fill="#A84E39" stroke="#47372F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <rect x={130} y={730} width={860} height={760} fill="url(#wall-hatch)" clipPath="url(#factory-body-clip)" />
              <path d="M305 839V1403M435 820V1381M566 800V1360M696 780V1339" fill="none" stroke="#783F34" strokeWidth={8} opacity={0.35} />
              <path d="M327 966L412 953V1032L327 1046Z" fill="#655F48" stroke="#594239" strokeWidth={5} />
              <path d="M465 945L550 932V1011L465 1024Z" fill="#687052" stroke="#594239" strokeWidth={5} />
            </g>
            <g id="sawtooth-roof">
              <path d="M174 858L271 690L349 831L438 667L516 806L605 644L683 783L756 624L833 757L930 882L756 770Z" fill="#5A503F" stroke="#47372F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M174 858L271 690L349 831Z" fill="#B36B45" stroke="#594239" strokeWidth={5} />
              <path d="M349 831L438 667L516 806Z" fill="#B56743" stroke="#594239" strokeWidth={5} />
              <path d="M516 806L605 644L683 783Z" fill="#AC6241" stroke="#594239" strokeWidth={5} />
              <path d="M683 783L756 624L833 757Z" fill="#A85A3E" stroke="#594239" strokeWidth={5} />
              <path d="M271 690L349 831L390 817L304 677Z" fill="url(#glass-gradient)" stroke="#594239" strokeWidth={5} />
              <path d="M438 667L516 806L557 792L470 654Z" fill="url(#glass-gradient)" stroke="#594239" strokeWidth={5} />
              <path d="M605 644L683 783L723 770L637 632Z" fill="url(#glass-gradient)" stroke="#594239" strokeWidth={5} />
              <path d="M756 624L833 757L872 786L789 612Z" fill="url(#glass-gradient)" stroke="#594239" strokeWidth={5} />
            </g>
            <g id="doorway">
              <path d="M590 1359V1195C590 1094 648 1026 716 1016C785 1006 837 1063 837 1158V1315Z" fill="#302B27" stroke="#47372F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M618 1352V1200C618 1123 658 1070 715 1061C768 1053 809 1095 809 1166V1320Z" fill="#44362E" />
            </g>
            <g id="factory-details">
              <circle cx={872} cy={955} r={29} fill="#E4B65A" stroke="#594239" strokeWidth={5} />
              <path d="M872 938V958L887 968" fill="none" stroke="#5D4337" strokeWidth={5} />
              <g transform="translate(245 1260)">
                <path d="M0 31C16 4 54 -8 80 8C106 -10 145 1 158 30C135 47 110 54 80 52C49 55 23 47 0 31Z" fill="#74432E" stroke="#594239" strokeWidth={5} />
              </g>
            </g>
          </g>

          <g id="foreground-ground">
            <path d="M0 1370C193 1319 357 1375 517 1428C676 1481 860 1409 1080 1328V1920H0Z" fill="url(#ground-gradient)" stroke="#47372F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0 1370C193 1319 357 1375 517 1428C676 1481 860 1409 1080 1328V1920H0Z" fill="url(#ground-hatch)" opacity={0.75} />
          </g>

          <g id="rail-path">
            <path d="M650 1363L280 1920" fill="none" stroke="#403832" strokeWidth={25} />
            <path d="M780 1341L945 1920" fill="none" stroke="#403832" strokeWidth={25} />
            <path d="M611 1420L807 1408M566 1486L828 1470M516 1562L851 1542M460 1647L878 1624M396 1744L909 1716M320 1859L943 1827" fill="none" stroke="#493A31" strokeWidth={24} strokeLinecap="round" />
          </g>

          <g id="conveyor-item-1" transform={`translate(${704 + conv1.x} ${1390 + conv1.y})`} opacity={conv1.o}>
            <path d="M-42 -34L45 -40L57 22L-50 31Z" fill="#D98A42" stroke="#594239" strokeWidth={5} />
            <path d="M-42 -34L-16 -52L62 -54L45 -40Z" fill="#F1B75B" stroke="#594239" strokeWidth={5} />
            <circle cx={-24} cy={34} r={12} fill="#352F2A" /><circle cx={37} cy={28} r={12} fill="#352F2A" />
            <path d="M-12 -15C4 -27 24 -25 35 -9C24 4 5 7 -12 -2Z" fill="#74422D" />
          </g>
          <g id="conveyor-item-2" transform={`translate(${682 + conv2.x} ${1518 + conv2.y})`} opacity={conv2.o}>
            <path d="M-54 -42L56 -48L72 29L-65 39Z" fill="#C96D3D" stroke="#594239" strokeWidth={5} />
            <path d="M-54 -42L-22 -65L75 -65L56 -48Z" fill="#EAA44C" stroke="#594239" strokeWidth={5} />
            <circle cx={-32} cy={43} r={15} fill="#352F2A" /><circle cx={47} cy={36} r={15} fill="#352F2A" />
            <path d="M-18 -19C2 -35 29 -31 43 -11C28 8 2 11 -18 -2Z" fill="#6D402D" />
          </g>
          <g id="conveyor-item-3" transform={`translate(${651 + conv3.x} ${1670 + conv3.y})`} opacity={conv3.o}>
            <path d="M-68 -51L70 -59L91 37L-82 50Z" fill="#D77B3F" stroke="#47372F" strokeWidth={8} />
            <path d="M-68 -51L-28 -80L95 -81L70 -59Z" fill="#F0AC50" stroke="#594239" strokeWidth={5} />
            <circle cx={-42} cy={55} r={18} fill="#332E29" /><circle cx={58} cy={47} r={18} fill="#332E29" />
            <path d="M-23 -24C3 -44 36 -39 54 -14C35 10 2 14 -23 -3Z" fill="#71402B" />
          </g>
        </svg>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#4a3a28", textAlign: "center", marginTop: 6 }}>
          Test polyvalence GPT-5.6 Sol — usine cacao 9:16, sans image de reference — frame {frame}
        </div>
      </div>
    </AbsoluteFill>
  );
};
