/**
 * GisementTokens — jetons de gisement geo-ancres pour la cible CartoSouverainV5.
 *
 * 3 variantes a TESTER cote a cote (decision Aziz, session 2026-06-21) :
 *   - SonarToken    : cercle or + anneaux sonar (TEMOIN, registre actuel prouve)
 *   - GasFlareToken : jeton SVG natif premium "gaz" (torchere/flamme qui vacille + halo)
 *   - OilImageToken : jeton avec illustration Gemini detouree dedans (plateforme offshore), cadre qui respire
 *
 * REGISTRE : palette Souverain immuable (navy #16213a / or #c8a951 / ivoire #f2efe6).
 * ANCRAGE : chaque jeton recoit (x,y) = map.project([lon,lat]) RECALCULE chaque frame par le parent.
 * Le jeton ne flotte JAMAIS : il est dans un cadre, anime en SVG natif frame-driven (zero CSS transition).
 */
import React from "react";
import { Img, staticFile } from "remotion";
import { SvgGas, SvgOil, SvgSonar } from "./GisementTokensSVG";

const NAVY = "#16213a";
const GOLD = "#c8a951";
const IVORY = "#f2efe6";

// ── Helpers d'animation pure (frame-driven, deterministes) ──────────────────
const osc = (frame: number, period: number, phase = 0) =>
  Math.sin((frame / period) * Math.PI * 2 + phase);

/**
 * SonarToken — TEMOIN. Cercle or central + anneaux sonar qui se propagent + ring statique.
 * `localF` = frame - start (0 au moment de l'apparition).
 */
export const SonarToken: React.FC<{ x: number; y: number; localF: number; frame: number; appeared: boolean }> = ({
  x,
  y,
  localF,
  frame,
  appeared,
}) => {
  if (localF < -2) return null;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const d = i * 7;
        const t = localF - d;
        const r = clamp(6 + (t / 34) * 46, 6, 52);
        const op = t < 0 ? 0 : t < 22 ? (t / 22) * 0.55 : t < 34 ? 0.55 * (1 - (t - 22) / 12) : 0;
        return op > 0.01 ? (
          <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={IVORY} strokeWidth={1.6} opacity={op} />
        ) : null;
      })}
      {appeared && (
        <circle
          cx={x}
          cy={y}
          r={22}
          fill="none"
          stroke={GOLD}
          strokeWidth={1.4}
          opacity={0.3 + 0.18 * osc(frame, 56)}
        />
      )}
      <circle cx={x} cy={y} r={8} fill={GOLD} stroke={NAVY} strokeWidth={1.5} />
    </g>
  );
};

/**
 * TokenFrame — le CADRE commun (anti-"flotte dans le vide").
 * Hexagone navy avec liseré or, ombre portee, micro-respiration. Tout enfant vit DEDANS.
 * `scale` = spring d'apparition (0->1). `breath` = amplitude respiration cadre.
 */
const TokenFrame: React.FC<{
  x: number;
  y: number;
  scale: number;
  frame: number;
  r?: number;
  /** uid unique pour les clipPath (evite les collisions d'id quand plusieurs jetons coexistent). */
  uid: string;
  /** "fill" = le contenu REMPLIT l'hexagone (image/drapeau/sceau), on ne garde que le liseré or.
   *  "navy" = fond navy + contenu pose dessus (SVG natif anime). */
  mode?: "fill" | "navy";
  children: React.ReactNode;
}> = ({ x, y, scale, frame, r = 46, uid, mode = "navy", children }) => {
  // hexagone pointe-en-haut
  const hex = (radius: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${(radius * Math.cos(a)).toFixed(2)},${(radius * Math.sin(a)).toFixed(2)}`;
    }).join(" ");
  const breath = 1 + 0.018 * osc(frame, 90);
  const clipId = `hexclip-${uid}`;
  return (
    <g transform={`translate(${x},${y}) scale(${scale * breath})`}>
      <defs>
        <clipPath id={clipId}>
          <polygon points={hex(r)} />
        </clipPath>
      </defs>
      {/* ombre portee subtile */}
      <polygon points={hex(r + 3)} fill={NAVY} opacity={0.5} transform="translate(0,4)" />
      {mode === "fill" ? (
        // le contenu remplit toute la forme hexagonale (clippe), navy seulement en secours derriere
        <>
          <polygon points={hex(r)} fill={NAVY} />
          <g clipPath={`url(#${clipId})`}>{children}</g>
        </>
      ) : (
        // fond navy + contenu pose dessus (anim SVG)
        <>
          <polygon points={hex(r)} fill={NAVY} fillOpacity={0.92} />
          <polygon points={hex(r - 6)} fill="none" stroke={IVORY} strokeWidth={0.8} opacity={0.28} />
          {children}
        </>
      )}
      {/* liseré or du contour (toujours present, c'est la signature) */}
      <polygon points={hex(r)} fill="none" stroke={GOLD} strokeWidth={2.5} />
      {/* halo or respirant autour */}
      <polygon
        points={hex(r + 7)}
        fill="none"
        stroke={GOLD}
        strokeWidth={1}
        opacity={0.22 + 0.12 * osc(frame, 70)}
      />
    </g>
  );
};

/**
 * GasFlareToken — jeton SVG natif premium "gaz".
 * Une torchère stylisee : mat + flamme or qui VACILLE (largeur/hauteur oscillantes), coeur ivoire.
 * Coords internes centrees sur (0,0) du cadre.
 */
export const GasFlareToken: React.FC<{ x: number; y: number; scale: number; frame: number }> = ({
  x,
  y,
  scale,
  frame,
}) => {
  // vacillement : 2 oscillateurs decales pour un mouvement organique non-robotique
  const flick = 0.5 * osc(frame, 11) + 0.5 * osc(frame, 7, 1.3);
  const flameH = 30 + 4 * flick; // hauteur flamme
  const flameW = 13 + 2.2 * osc(frame, 9, 0.5); // largeur
  const lean = 2.4 * osc(frame, 13); // inclinaison laterale
  // base de la flamme posee au sommet du mat
  const baseY = -2;
  const tipY = baseY - flameH;
  // path flamme (goutte inversee, pointe en haut) via quadratiques
  const flamePath = `
    M ${-flameW} ${baseY}
    Q ${-flameW * 1.05 + lean} ${baseY - flameH * 0.45} ${lean * 0.6} ${tipY}
    Q ${flameW * 1.05 + lean} ${baseY - flameH * 0.45} ${flameW} ${baseY}
    Q 0 ${baseY + 6} ${-flameW} ${baseY} Z`;
  const innerW = flameW * 0.5;
  const innerH = flameH * 0.62;
  const innerPath = `
    M ${-innerW} ${baseY}
    Q ${-innerW + lean} ${baseY - innerH * 0.5} ${lean * 0.5} ${baseY - innerH}
    Q ${innerW + lean} ${baseY - innerH * 0.5} ${innerW} ${baseY}
    Q 0 ${baseY + 3} ${-innerW} ${baseY} Z`;
  return (
    <>
      <defs>
        <linearGradient id="gasFlameGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#9a7b2e" />
          <stop offset="55%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#f4e3ad" />
        </linearGradient>
      </defs>
      {/* mat / cheminee de la torchere */}
      <rect x={-3} y={baseY} width={6} height={20} rx={1.5} fill="#3a3f4a" stroke={NAVY} strokeWidth={0.8} />
      <rect x={-3} y={baseY} width={2.2} height={20} fill={IVORY} opacity={0.18} />
      {/* embase */}
      <rect x={-9} y={17} width={18} height={5} rx={1.5} fill="#2c313b" stroke={GOLD} strokeWidth={0.8} opacity={0.85} />
      {/* lueur diffuse derriere la flamme */}
      <ellipse cx={lean * 0.5} cy={baseY - flameH * 0.4} rx={flameW * 1.6} ry={flameH * 0.7} fill={GOLD} opacity={0.14} />
      {/* flamme exterieure */}
      <path d={flamePath} fill="url(#gasFlameGrad)" stroke={GOLD} strokeWidth={0.5} opacity={0.95} />
      {/* coeur clair */}
      <path d={innerPath} fill={IVORY} opacity={0.8} />
    </>
  );
};

/**
 * OilImageToken — jeton qui REMPLIT l'hexagone avec l'illustration Gemini (plateforme offshore).
 * Le TokenFrame (mode "fill") clippe deja dans l'hexagone : ici on couvre tout (fond clair + image),
 * plus un reflet lumineux qui balaye. `imgSrc` = chemin staticFile. r = rayon hexa (~46).
 */
export const OilImageToken: React.FC<{ frame: number; imgSrc: string; r?: number }> = ({ frame, imgSrc, r = 46 }) => {
  const S = r * 2.1; // l'image couvre largement l'hexagone
  const sweep = (-r - 10) + ((frame % 120) / 120) * (r * 2 + 20);
  return (
    <>
      {/* fond IVOIRE clair sous l'image (fix luminosite : navy assombrissait l'illustration) */}
      <rect x={-r * 1.2} y={-r * 1.2} width={r * 2.4} height={r * 2.4} fill={IVORY} />
      <rect x={-r * 1.2} y={-r * 1.2} width={r * 2.4} height={r * 2.4} fill="#fff" opacity={0.3} />
      <image href={imgSrc} x={-S / 2} y={-S / 2} width={S} height={S} preserveAspectRatio="xMidYMid meet" />
      {/* reflet lumineux diagonal qui balaye toute la surface */}
      <rect x={sweep} y={-r * 1.4} width={12} height={r * 2.8} fill="#fff" opacity={0.22} transform="skewX(-20)" />
    </>
  );
};

/**
 * FlagToken — jeton-DRAPEAU (rapatriement grammaire War-Map/AES sur carte Souverain).
 * Un vrai drapeau (image flagcdn ou staticFile) clippe dans le disque de l'hexagone, avec
 * ondulation legere (decalage horizontal sinusoidal via skew) + liseré or. `flagSrc` requis.
 */
export const FlagToken: React.FC<{ frame: number; flagSrc: string; r?: number }> = ({ frame, flagSrc, r = 46 }) => {
  // ondulation textile : leger skew horizontal qui oscille
  const wave = 4 * osc(frame, 24);
  const S = r * 2.2;
  return (
    <>
      <rect x={-r * 1.2} y={-r * 1.2} width={r * 2.4} height={r * 2.4} fill={NAVY} />
      {/* drapeau qui REMPLIT l'hexagone (slice), ondule via skewX anime */}
      <g transform={`skewX(${wave * 0.4})`}>
        <image href={flagSrc} x={-S / 2} y={-S / 2} width={S} height={S} preserveAspectRatio="xMidYMid slice" />
      </g>
      {/* reflet diagonal qui balaye (textile) */}
      <rect x={-r + wave * 2} y={-r * 1.4} width={14} height={r * 2.8} fill={IVORY} opacity={0.12} transform="skewX(-18)" />
    </>
  );
};

/**
 * SealToken — jeton-SCEAU d'EVENEMENT (registre Souverain, pas War-Map sepia).
 * Marque un EVENEMENT (decouverte, signature) : un sceau or s'estampe (spring d'apparition deja
 * porte par le cadre), une etoile/croix gravee au centre, micro-relief. `localF` = frame depuis apparition.
 */
export const SealToken: React.FC<{ frame: number; localF: number; r?: number }> = ({ frame, localF, r = 46 }) => {
  // pulse de gravure juste apres l'estampage
  const engrave = localF >= 0 && localF < 22 ? Math.max(0, 1 - localF / 22) : 0;
  const SR = r * 1.3; // le sceau or remplit l'hexagone
  const starR = r * 0.62;
  // etoile a 8 branches (sceau)
  const star = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? starR : starR * 0.44;
    return `${(rad * Math.cos(a)).toFixed(2)},${(rad * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <>
      {/* disque sceau or mat qui remplit */}
      <circle cx={0} cy={0} r={SR} fill="#b8983f" />
      <circle cx={0} cy={0} r={SR} fill="#fff" opacity={0.1 + 0.25 * engrave} />
      {/* anneau interieur grave */}
      <circle cx={0} cy={0} r={r * 0.82} fill="none" stroke={NAVY} strokeWidth={1.4} opacity={0.4} />
      {/* etoile gravee centrale */}
      <polygon points={star} fill={NAVY} opacity={0.8} />
      <polygon points={star} fill="none" stroke={IVORY} strokeWidth={0.8} opacity={0.5} />
      {/* flash d'estampage */}
      {engrave > 0.01 && <circle cx={0} cy={0} r={r + 8 * engrave} fill="none" stroke={IVORY} strokeWidth={2} opacity={engrave * 0.7} />}
    </>
  );
};

/**
 * GisementMarker — routeur : choisit la variante selon `kind`.
 * Toutes les variantes recoivent (x,y) deja projete + (scale, frame). SonarToken a une signature a part.
 */
export type GisementKind = "sonar" | "gas" | "oil" | "flag" | "seal";

export const GisementMarker: React.FC<{
  kind: GisementKind;
  x: number;
  y: number;
  scale: number;
  frame: number;
  localF: number;
  appeared: boolean;
  oilImgSrc?: string;
  flagSrc?: string;
  /** identifiant unique du jeton (anti-collision clipPath quand plusieurs coexistent). */
  uid?: string;
  /** zoom courant de la carte (map.getZoom()). Sert a faire grossir le jeton au plongeon
   *  et le reduire a un point en vue large (anti-agglutination). */
  zoom?: number;
}> = ({ kind, x, y, scale, frame, localF, appeared, oilImgSrc, flagSrc, uid, zoom }) => {
  // facteur de taille pilote par le zoom : petit point loin (zoom<=6), hexagone plein au plongeon (zoom>=7.4).
  // En l'absence de zoom fourni, reste a 1 (comportement historique).
  const sizeFactor = zoom == null ? 1 : Math.max(0.26, Math.min(1, (zoom - 6.0) / (7.4 - 6.0)));
  const id = uid ?? `${Math.round(x)}_${Math.round(y)}`;
  // FAMILLE SVG GPT-5.5 (2026-06-22, validee Aziz) : gas/oil/sonar = SVG natif anime par frame, mode navy.
  // Identite visuelle coherente (torchere, goutte+ondes, sonar). Remplace l'ancienne bougie (GasFlareToken)
  // + l'image Gemini (OilImageToken). flag/seal/image restent en mode fill.
  const mode = kind === "gas" || kind === "oil" || kind === "sonar" ? "navy" : "fill";
  return (
    <TokenFrame x={x} y={y} scale={scale * sizeFactor} frame={frame} uid={id} mode={mode}>
      {kind === "gas" && <SvgGas f={frame} />}
      {kind === "oil" && <SvgOil f={frame} />}
      {kind === "sonar" && <SvgSonar f={frame} />}
      {kind === "flag" && flagSrc && <FlagToken frame={frame} flagSrc={flagSrc} />}
      {kind === "seal" && <SealToken frame={frame} localF={localF} />}
    </TokenFrame>
  );
};
