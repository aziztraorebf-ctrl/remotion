import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

// --- Hachures SVG helpers ---

function HatchLines({
  x,
  y,
  width,
  height,
  spacing = 4,
  angle = 0,
  opacity = 0.7,
  strokeWidth = 0.8,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  spacing?: number;
  angle?: number;
  opacity?: number;
  strokeWidth?: number;
}) {
  const patternId = `hatch-${angle}-${spacing}-${Math.round(x)}-${Math.round(y)}`;
  const diagonal = Math.sqrt(width * width + height * height);

  return (
    <g clipPath={`url(#clip-${patternId})`} opacity={opacity}>
      <defs>
        <clipPath id={`clip-${patternId}`}>
          <rect x={x} y={y} width={width} height={height} />
        </clipPath>
      </defs>
      {Array.from({ length: Math.ceil(diagonal / spacing) + 4 }).map((_, i) => {
        const offset = (i - 2) * spacing;
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const cx = x + width / 2;
        const cy = y + height / 2;
        const half = diagonal;
        return (
          <line
            key={i}
            x1={cx - half * cos + offset * -sin}
            y1={cy - half * sin + offset * cos}
            x2={cx + half * cos + offset * -sin}
            y2={cy + half * sin + offset * cos}
            stroke="#1a1a1a"
            strokeWidth={strokeWidth}
          />
        );
      })}
    </g>
  );
}

// --- Clocher SVG ---

function Bell({
  x,
  baseY,
  scale = 1,
}: {
  x: number;
  baseY: number;
  scale?: number;
}) {
  const w = 60 * scale;
  const h = 140 * scale;
  return (
    <g>
      {/* Corps principal */}
      <rect x={x - w * 0.3} y={baseY - h} width={w * 0.6} height={h} fill="#1a1a1a" />
      {/* Base elargie */}
      <rect x={x - w * 0.45} y={baseY - h * 0.25} width={w * 0.9} height={h * 0.25} fill="#1a1a1a" />
      {/* Fleche du clocher */}
      <polygon
        points={`${x - w * 0.3},${baseY - h} ${x + w * 0.3},${baseY - h} ${x},${baseY - h * 1.45}`}
        fill="#1a1a1a"
      />
      {/* Ouverture clocher */}
      <rect
        x={x - w * 0.18}
        y={baseY - h * 0.55}
        width={w * 0.36}
        height={h * 0.2}
        fill="#e8dcc8"
      />
      {/* Hachures verticales corps */}
      <HatchLines
        x={x - w * 0.3}
        y={baseY - h}
        width={w * 0.6}
        height={h * 0.75}
        spacing={5}
        angle={90}
        opacity={0.25}
        strokeWidth={0.7}
      />
    </g>
  );
}

// --- Rempart SVG ---

function Rampart({
  x,
  baseY,
  width,
  height,
  merlonCount = 5,
}: {
  x: number;
  baseY: number;
  width: number;
  height: number;
  merlonCount?: number;
}) {
  const merlonW = width / (merlonCount * 2 - 1);
  const merlonH = height * 0.35;

  return (
    <g>
      {/* Corps mur */}
      <rect x={x} y={baseY - height} width={width} height={height} fill="#1a1a1a" />
      {/* Hachures diagonales sur le mur */}
      <HatchLines
        x={x}
        y={baseY - height}
        width={width}
        height={height}
        spacing={6}
        angle={135}
        opacity={0.2}
        strokeWidth={0.6}
      />
      {/* Merlons (crenelures) */}
      {Array.from({ length: merlonCount }).map((_, i) => (
        <rect
          key={i}
          x={x + i * merlonW * 2}
          y={baseY - height - merlonH}
          width={merlonW}
          height={merlonH}
          fill="#1a1a1a"
        />
      ))}
    </g>
  );
}

// --- Maison medievale ---

function MedievalHouse({
  x,
  baseY,
  scale = 1,
}: {
  x: number;
  baseY: number;
  scale?: number;
}) {
  const w = 80 * scale;
  const h = 90 * scale;
  const roofH = 50 * scale;

  return (
    <g>
      <rect x={x} y={baseY - h} width={w} height={h} fill="#1a1a1a" />
      {/* Fenetre */}
      <rect x={x + w * 0.3} y={baseY - h * 0.65} width={w * 0.2} height={h * 0.2} fill="#e8dcc8" />
      {/* Porte */}
      <rect x={x + w * 0.35} y={baseY - h * 0.38} width={w * 0.3} height={h * 0.38} fill="#e8dcc8" />
      {/* Toit */}
      <polygon
        points={`${x},${baseY - h} ${x + w},${baseY - h} ${x + w / 2},${baseY - h - roofH}`}
        fill="#1a1a1a"
      />
      {/* Hachures toit */}
      <HatchLines
        x={x}
        y={baseY - h - roofH}
        width={w}
        height={roofH}
        spacing={4}
        angle={45}
        opacity={0.3}
        strokeWidth={0.6}
      />
    </g>
  );
}

// --- Personnage marcheur ---

function Walker({
  cx,
  cy,
  phase,
  scale = 1,
}: {
  cx: number;
  cy: number;
  phase: number;
  scale?: number;
}) {
  const legSwing = Math.sin(phase) * 12;
  const armSwing = Math.sin(phase + Math.PI) * 8;
  const bodyBob = Math.abs(Math.sin(phase)) * 2;

  const s = scale;
  const headR = 9 * s;
  const bodyH = 26 * s;
  const legH = 22 * s;
  const armH = 18 * s;

  return (
    <g transform={`translate(${cx}, ${cy - bodyBob})`}>
      {/* Tete */}
      <ellipse cx={0} cy={-(bodyH + headR * 1.8)} rx={headR} ry={headR * 1.1} fill="#1a1a1a" />
      {/* Chapeau */}
      <ellipse cx={0} cy={-(bodyH + headR * 3.0)} rx={headR * 1.5} ry={headR * 0.4} fill="#1a1a1a" />
      <rect
        x={-headR * 0.7}
        y={-(bodyH + headR * 3.8)}
        width={headR * 1.4}
        height={headR * 1.2}
        fill="#1a1a1a"
      />
      {/* Corps */}
      <rect x={-8 * s} y={-bodyH} width={16 * s} height={bodyH} fill="#1a1a1a" />
      {/* Bras gauche */}
      <line
        x1={-8 * s}
        y1={-bodyH * 0.8}
        x2={-8 * s - armSwing * s}
        y2={-bodyH * 0.8 + armH * s}
        stroke="#1a1a1a"
        strokeWidth={4 * s}
        strokeLinecap="round"
      />
      {/* Bras droit */}
      <line
        x1={8 * s}
        y1={-bodyH * 0.8}
        x2={8 * s + armSwing * s}
        y2={-bodyH * 0.8 + armH * s}
        stroke="#1a1a1a"
        strokeWidth={4 * s}
        strokeLinecap="round"
      />
      {/* Jambe gauche */}
      <line
        x1={-5 * s}
        y1={0}
        x2={-5 * s - legSwing * s * 0.5}
        y2={legH * s}
        stroke="#1a1a1a"
        strokeWidth={5 * s}
        strokeLinecap="round"
      />
      {/* Jambe droite */}
      <line
        x1={5 * s}
        y1={0}
        x2={5 * s + legSwing * s * 0.5}
        y2={legH * s}
        stroke="#1a1a1a"
        strokeWidth={5 * s}
        strokeLinecap="round"
      />
    </g>
  );
}

// --- Composant principal ---

export default function StyleEngravings() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const t = frame / fps;

  // Oscillation globale de la scene
  const globalTilt = Math.sin(t * 0.8) * 0.5;

  // Parallax : fond = 20% de vitesse, milieu = 50%, premier plan = 100%
  const scrollBase = frame * 0.4;
  const skyScroll = scrollBase * 0.2;
  const cityScroll = scrollBase * 0.5;
  const fgScroll = scrollBase * 1.0;

  // Animation entree : fade in depuis frame 0
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Phase de marche pour les personnages
  const walkPhase = t * 4;

  const groundY = height * 0.82;

  return (
    <div
      style={{
        width,
        height,
        overflow: "hidden",
        background: "#e8dcc8",
        opacity: fadeIn,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          transform: `rotate(${globalTilt}deg)`,
          transformOrigin: "center center",
          display: "block",
        }}
      >
        <defs>
          {/* Vignette radiale */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" stopOpacity={0} />
            <stop offset="75%" stopColor="#1a1a1a" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0.75} />
          </radialGradient>

          {/* Pattern texture papier */}
          <filter id="paper-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* Fond creme */}
        <rect x={0} y={0} width={width} height={height} fill="#e8dcc8" />

        {/* --- CIEL : hachures horizontales denses (couche la plus lointaine) --- */}
        <g transform={`translate(${-skyScroll % width}, 0)`}>
          {/* Deux copies pour le scrolling continu */}
          {[0, width].map((offsetX) => (
            <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
              {/* Hachures ciel - horizontales serrees */}
              <HatchLines
                x={0}
                y={30}
                width={width}
                height={height * 0.45}
                spacing={3.5}
                angle={0}
                opacity={0.12}
                strokeWidth={0.7}
              />
              {/* Hachures croisees pour nuages */}
              <HatchLines
                x={80}
                y={60}
                width={300}
                height={80}
                spacing={5}
                angle={15}
                opacity={0.18}
                strokeWidth={1.0}
              />
              <HatchLines
                x={600}
                y={40}
                width={250}
                height={70}
                spacing={5}
                angle={-10}
                opacity={0.18}
                strokeWidth={1.0}
              />
              <HatchLines
                x={1100}
                y={70}
                width={320}
                height={60}
                spacing={5}
                angle={8}
                opacity={0.18}
                strokeWidth={1.0}
              />
              {/* Contours nuages */}
              <ellipse cx={230} cy={100} rx={150} ry={55} stroke="#1a1a1a" strokeWidth={1.2} fill="none" opacity={0.4} />
              <ellipse cx={725} cy={80} rx={125} ry={45} stroke="#1a1a1a" strokeWidth={1.2} fill="none" opacity={0.4} />
              <ellipse cx={1260} cy={105} rx={160} ry={50} stroke="#1a1a1a" strokeWidth={1.2} fill="none" opacity={0.4} />
            </g>
          ))}
        </g>

        {/* Horizon / ligne du sol lointain */}
        <line
          x1={0}
          y1={groundY - 80}
          x2={width}
          y2={groundY - 80}
          stroke="#1a1a1a"
          strokeWidth={1.5}
          opacity={0.5}
        />

        {/* --- VILLE MEDIEVALE : couche milieu --- */}
        <g transform={`translate(${-(cityScroll % (width * 1.5))}, 0)`}>
          {[0, width * 1.5].map((offsetX) => (
            <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
              {/* Rempart gauche */}
              <Rampart x={0} baseY={groundY - 75} width={220} height={120} merlonCount={6} />
              {/* Tour clocher 1 */}
              <Bell x={160} baseY={groundY - 75} scale={1.1} />
              {/* Maisons groupe 1 */}
              <MedievalHouse x={250} baseY={groundY - 75} scale={1.0} />
              <MedievalHouse x={340} baseY={groundY - 75} scale={0.85} />
              <MedievalHouse x={420} baseY={groundY - 75} scale={1.1} />
              {/* Tour clocher 2 */}
              <Bell x={560} baseY={groundY - 75} scale={1.3} />
              {/* Rempart central */}
              <Rampart x={610} baseY={groundY - 75} width={180} height={100} merlonCount={5} />
              {/* Maisons groupe 2 */}
              <MedievalHouse x={810} baseY={groundY - 75} scale={0.9} />
              <MedievalHouse x={895} baseY={groundY - 75} scale={1.05} />
              {/* Tour clocher 3 */}
              <Bell x={1020} baseY={groundY - 75} scale={1.0} />
              {/* Rempart droit */}
              <Rampart x={1080} baseY={groundY - 75} width={200} height={115} merlonCount={6} />
              <MedievalHouse x={1290} baseY={groundY - 75} scale={0.95} />
              <MedievalHouse x={1380} baseY={groundY - 75} scale={1.15} />
            </g>
          ))}
        </g>

        {/* --- SOL : bandes hachures --- */}
        {/* Sol principal */}
        <rect x={0} y={groundY - 75} width={width} height={height - groundY + 75} fill="#e8dcc8" />
        <HatchLines
          x={0}
          y={groundY - 75}
          width={width}
          height={30}
          spacing={4}
          angle={0}
          opacity={0.2}
          strokeWidth={0.8}
        />
        {/* Ligne de sol */}
        <line
          x1={0}
          y1={groundY - 75}
          x2={width}
          y2={groundY - 75}
          stroke="#1a1a1a"
          strokeWidth={2}
          opacity={0.8}
        />
        {/* Sol avant */}
        <HatchLines
          x={0}
          y={groundY - 40}
          width={width}
          height={height - groundY + 40}
          spacing={6}
          angle={5}
          opacity={0.08}
          strokeWidth={0.6}
        />

        {/* --- PREMIER PLAN : personnages silhouettes --- */}
        <g transform={`translate(${-(fgScroll % (width + 600))}, 0)`}>
          {[0, width + 600].map((offsetX) => (
            <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
              <Walker cx={100} cy={groundY - 42} phase={walkPhase} scale={1.0} />
              <Walker cx={300} cy={groundY - 42} phase={walkPhase + 1.2} scale={1.15} />
              <Walker cx={520} cy={groundY - 42} phase={walkPhase + 2.5} scale={0.9} />
              <Walker cx={750} cy={groundY - 42} phase={walkPhase + 0.7} scale={1.05} />
              <Walker cx={980} cy={groundY - 42} phase={walkPhase + 3.1} scale={1.2} />
              <Walker cx={1200} cy={groundY - 42} phase={walkPhase + 1.8} scale={0.95} />
              <Walker cx={1450} cy={groundY - 42} phase={walkPhase + 0.3} scale={1.1} />
              <Walker cx={1680} cy={groundY - 42} phase={walkPhase + 2.0} scale={1.0} />
            </g>
          ))}
        </g>

        {/* --- DETAILS PREMIER PLAN : hachures denses devant --- */}
        <HatchLines
          x={0}
          y={groundY + 20}
          width={width}
          height={height - groundY - 20}
          spacing={3}
          angle={90}
          opacity={0.15}
          strokeWidth={1.0}
        />

        {/* --- BORDURE GRAVURE : cadre noir --- */}
        <rect
          x={12}
          y={12}
          width={width - 24}
          height={height - 24}
          stroke="#1a1a1a"
          strokeWidth={3}
          fill="none"
          opacity={0.7}
        />
        <rect
          x={20}
          y={20}
          width={width - 40}
          height={height - 40}
          stroke="#1a1a1a"
          strokeWidth={1}
          fill="none"
          opacity={0.4}
        />

        {/* --- VIGNETTE : gradient radial sombre --- */}
        <rect x={0} y={0} width={width} height={height} fill="url(#vignette)" />

        {/* --- TITRE GRAVURE en bas --- */}
        <text
          x={width / 2}
          y={height - 35}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize={18}
          fill="#1a1a1a"
          opacity={0.55}
          letterSpacing={4}
        >
          CIVITAS MEDIEVALIS - ANNO DOMINI MCCCXLVII
        </text>
      </svg>
    </div>
  );
}
