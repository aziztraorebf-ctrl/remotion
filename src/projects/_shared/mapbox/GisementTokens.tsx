/**
 * GisementTokens — jetons de gisement geo-ancres pour la cible CartoSouverainV5.
 *
 * Le CONTENU des jetons gas/oil/sonar est genere par GPT-5.5 (GisementTokensSVG.tsx, valide Aziz
 * 2026-06-22) : famille coherente (torchere, goutte+ondes, sonar). flag/seal = jetons natifs (mode fill).
 * Le routeur GisementMarker (bas du fichier) choisit la variante selon `kind`.
 *
 * REGISTRE : palette Souverain immuable (navy #16213a / or #c8a951 / ivoire #f2efe6).
 * ANCRAGE : chaque jeton recoit (x,y) = map.project([lon,lat]) RECALCULE chaque frame par le parent.
 * Le jeton ne flotte JAMAIS : il est dans un cadre (TokenFrame), anime frame-driven (zero CSS transition).
 */
import React from "react";
import { SvgGas, SvgOil, SvgSonar } from "./GisementTokensSVG";

const NAVY = "#16213a";
const GOLD = "#c8a951";
const IVORY = "#f2efe6";

// ── Helpers d'animation pure (frame-driven, deterministes) ──────────────────
const osc = (frame: number, period: number, phase = 0) =>
  Math.sin((frame / period) * Math.PI * 2 + phase);

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
