// WarMapOverlayDynamic — BRIQUE RÉUTILISABLE d'overlay DYNAMIQUE pour War-Map (Aziz 2026-06-12).
//
// Décision doctrine (WARMAP-LONG-DOCTRINE) : l'overlay semi-transparent dynamique est une technique de plein
// droit pour MEUBLER une section vide / AJOUTER de l'info sans tout forcer sur la carte. CONDITION : il doit
// être DYNAMIQUE (graphismes animés Remotion), jamais une plaque figée. Réutilise les patterns Souverain
// (reveal, count-up, secondary motion) adaptés à NOTRE charte parchemin.
//
// ARCHITECTURE (validée Aziz) :
//   - Conteneur géo-conscient : mode "semitransp" (voile sur carte, garde la géo) | "fullscreen" (parchemin
//     opaque, casse la carte — réservé aux scènes SANS enjeu territorial). Gère fade in/out global.
//   - Composition FLEXIBLE : accepte `children` libres ET un raccourci déclaratif `blocks[]`. On MIXE les
//     styles de blocs (titre + jetons + stat + citation) dans l'ordre voulu. EXTENSIBLE : ajouter un bloc =
//     écrire un petit composant qui prend (localFrame, accent), sans toucher au conteneur.
//   - Charte parchemin War-Map + `accent` configurable (or AES, bleu Mali, rouge…).
//
// Headless-safe : opacité/transform/spring only, pas de filter:blur sur du contenu critique (ombres div OK).

import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// ── Charte parchemin War-Map (défaut) ──
export const OVERLAY_PAL = {
  PARCHMENT: "#F5EFD6",
  INK: "#2A1C0E",
  INK_SOFT: "#5a4422",
  GOLD: "#C9A24B",
  BLUE: "#2B4F7C",
  RED: "#8B3A3A",
} as const;

// ============================================================
// BLOCS ANIMÉS RÉUTILISABLES (chacun prend localFrame = frame - inAt, + accent). Composables, extensibles.
// ============================================================

/** Titre révélé mot par mot (pattern TextChoc). wordStagger = frames entre chaque mot (cadence). */
export const TitleReveal: React.FC<{ text: string; localFrame: number; at?: number; accent?: string; size?: number; wordStagger?: number }> =
({ text, localFrame, at = 0, accent = OVERLAY_PAL.GOLD, size = 52, wordStagger = 5 }) => {
  const words = text.split(" ");
  return (
    <div style={{ fontFamily: "Georgia, serif", fontWeight: 800, fontSize: size, color: accent,
      lineHeight: 1.06, textAlign: "center", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.28em" }}>
      {words.map((w, i) => {
        const t = interpolate(localFrame, [at + i * wordStagger, at + i * wordStagger + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <span key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 14}px)`, display: "inline-block" }}>{w}</span>;
      })}
    </div>
  );
};

/** Sur-titre / kicker (date, sigle) — reveal mot par mot doux (wordStagger) ou fade simple. */
export const Kicker: React.FC<{ text: string; localFrame: number; at?: number; size?: number; wordStagger?: number }> =
({ text, localFrame, at = 0, size = 18, wordStagger = 0 }) => {
  if (wordStagger <= 0) {
    const t = interpolate(localFrame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return <div style={{ fontSize: size, letterSpacing: 6, fontWeight: 700, color: OVERLAY_PAL.INK_SOFT,
      textTransform: "uppercase", opacity: t, textAlign: "center" }}>{text}</div>;
  }
  const words = text.split(" ");
  return (
    <div style={{ fontSize: size, letterSpacing: 6, fontWeight: 700, color: OVERLAY_PAL.INK_SOFT,
      textTransform: "uppercase", textAlign: "center", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.4em" }}>
      {words.map((w, i) => {
        const t = interpolate(localFrame, [at + i * wordStagger, at + i * wordStagger + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <span key={i} style={{ opacity: t, display: "inline-block" }}>{w}</span>;
      })}
    </div>
  );
};

/** Rangée de jetons circulaires (drapeaux/portraits) qui s'allument EN SÉQUENCE (spring), halo qui respire. */
export type OverlayToken = { sprite?: string; flagFile?: string; label?: string };
export const TokenRow: React.FC<{ tokens: OverlayToken[]; localFrame: number; at?: number; accent?: string; size?: number; gap?: number; fps: number; tokenStagger?: number; wave?: boolean; link?: boolean }> =
({ tokens, localFrame, at = 0, accent = OVERLAY_PAL.GOLD, size = 110, gap = 40, fps, tokenStagger = 12, wave = false, link = false }) => {
  // lien doré tracé entre les centres des jetons (le pacte visible). Se dessine APRÈS l'apparition des jetons.
  const n = tokens.length;
  const rowW = n * size + (n - 1) * gap;
  const centers = tokens.map((_, i) => size / 2 + i * (size + gap)); // x du centre de chaque jeton
  const linkStart = at + (n - 1) * tokenStagger + 18; // après que tous les jetons soient posés
  const linkT = interpolate(localFrame, [linkStart, linkStart + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
  <div style={{ position: "relative", display: "flex", justifyContent: "center", gap }}>
    {link && linkT > 0.01 && (
      <svg width={rowW} height={size} style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", overflow: "visible", pointerEvents: "none" }}>
        {centers.slice(0, -1).map((cx, i) => {
          const x2full = centers[i + 1];
          const x2 = cx + (x2full - cx) * Math.min(1, linkT * (n - 1) - i); // tracé séquentiel gauche→droite
          if (x2 <= cx) return null;
          return <line key={i} x1={cx} y1={size / 2} x2={x2} y2={size / 2}
            stroke={accent} strokeWidth={3} strokeOpacity={0.85} strokeLinecap="round" strokeDasharray="2 7" />;
        })}
      </svg>
    )}
    {tokens.map((tk, i) => {
      const pop = spring({ frame: localFrame - (at + i * tokenStagger), fps, config: { damping: 13 }, durationInFrames: 16 });
      const D = size * pop;
      if (D <= 1) return null;
      const breathe = 1 + 0.04 * Math.sin((localFrame + i * 11) * 0.08);
      const src = tk.flagFile ? staticFile(`_shared/flags/${tk.flagFile}`) : tk.sprite ? staticFile(`_shared/sprites/warmap/${tk.sprite}.png`) : null;
      // ondulation drapeau (continu) : skew + scaleX sinusoïdaux déphasés = le tissu qui flotte dans le cercle
      const ph = localFrame * 0.10 + i * 1.7;
      const flagWave = wave && tk.flagFile
        ? `scale(1.12) skewY(${Math.sin(ph) * 2.2}deg) scaleX(${1 + 0.04 * Math.sin(ph * 1.3)})`
        : (tk.flagFile ? "none" : "translate(-8%,2%)");
      return (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", margin: "0 auto",
            background: OVERLAY_PAL.PARCHMENT, border: `${Math.max(3, D * 0.05)}px solid ${accent}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)", transform: `scale(${breathe})` }}>
            {src && <img src={src} style={{ width: tk.flagFile ? "100%" : "118%", height: tk.flagFile ? "100%" : "118%",
              objectFit: "cover", objectPosition: "top center", transform: flagWave, display: "block" }} />}
          </div>
          {tk.label && <div style={{ marginTop: 8, fontSize: Math.max(11, D * 0.14), fontWeight: 700,
            color: OVERLAY_PAL.INK, letterSpacing: 1, opacity: pop }}>{tk.label}</div>}
        </div>
      );
    })}
  </div>
  );
};

/** Compteur animé 0→value (pattern HERO DATA CountUp) + glow. */
export const StatCountUp: React.FC<{ value: number; suffix?: string; label?: string; localFrame: number; at?: number; accent?: string; decimals?: number; size?: number }> =
({ value, suffix = "", label, localFrame, at = 0, accent = OVERLAY_PAL.GOLD, decimals = 0, size = 64 }) => {
  const t = interpolate(localFrame, [at, at + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = (value * t).toFixed(decimals);
  return (
    <div style={{ textAlign: "center", opacity: interpolate(localFrame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <div style={{ fontFamily: "Georgia, serif", fontWeight: 800, fontSize: size, color: accent,
        textShadow: `0 0 ${10 * t}px ${accent}55` }}>{n}{suffix}</div>
      {label && <div style={{ fontSize: size * 0.26, fontWeight: 600, color: OVERLAY_PAL.INK_SOFT, marginTop: 4 }}>{label}</div>}
    </div>
  );
};

/** Citation qui s'écrit (typewriter sobre) + guillemets. charPerFrame = vitesse (plus bas = plus lent). */
export const QuoteType: React.FC<{ text: string; localFrame: number; at?: number; size?: number; charPerFrame?: number }> =
({ text, localFrame, at = 0, size = 22, charPerFrame = 0.9 }) => {
  const chars = Math.floor(interpolate(localFrame, [at, at + text.length / charPerFrame], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const shown = text.slice(0, chars);
  const op = interpolate(localFrame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontSize: size, fontStyle: "italic", fontWeight: 600, color: OVERLAY_PAL.INK_SOFT,
    textAlign: "center", opacity: op, maxWidth: "90%", margin: "0 auto" }}>« {shown} »</div>;
};

/** Badges qui apparaissent en cascade (pattern Badge satellite). */
export const BadgeRow: React.FC<{ items: string[]; localFrame: number; at?: number; accent?: string; fps: number }> =
({ items, localFrame, at = 0, accent = OVERLAY_PAL.GOLD, fps }) => (
  <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
    {items.map((it, i) => {
      const pop = spring({ frame: localFrame - (at + i * 8), fps, config: { damping: 14 }, durationInFrames: 14 });
      if (pop <= 0.02) return null;
      return <span key={i} style={{ opacity: pop, transform: `scale(${pop})`, padding: "6px 16px", borderRadius: 6,
        background: "rgba(40,28,14,0.8)", border: `2px solid ${accent}`, color: OVERLAY_PAL.PARCHMENT,
        fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>{it}</span>;
    })}
  </div>
);

// ============================================================
// CONTENEUR
// ============================================================
type BlockSpec =
  | { type: "kicker"; text: string; at?: number; size?: number; wordStagger?: number }
  | { type: "title"; text: string; at?: number; size?: number; wordStagger?: number }
  | { type: "tokens"; tokens: OverlayToken[]; at?: number; size?: number; gap?: number; tokenStagger?: number; wave?: boolean; link?: boolean }
  | { type: "stat"; value: number; suffix?: string; label?: string; at?: number; decimals?: number; size?: number }
  | { type: "quote"; text: string; at?: number; size?: number; charPerFrame?: number }
  | { type: "badges"; items: string[]; at?: number };

export type WarMapOverlayDynamicProps = {
  inAt: number;            // frame d'apparition (absolue)
  outAt: number;           // frame de disparition (absolue)
  mode?: "semitransp" | "fullscreen";
  accent?: string;
  cardWidthPct?: number;   // largeur de la carte centrale (0-1 de l'écran)
  anchorPx?: { x: number; y: number } | null; // point carte auquel relier l'overlay (ligne fine), optionnel
  blocks?: BlockSpec[];    // raccourci déclaratif
  children?: React.ReactNode; // OU composition libre (children prennent le relais si fournis)
};

export const WarMapOverlayDynamic: React.FC<WarMapOverlayDynamicProps> = ({
  inAt, outAt, mode = "semitransp", accent = OVERLAY_PAL.GOLD, cardWidthPct,
  anchorPx = null, blocks, children,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const inOp = interpolate(frame, [inAt, inAt + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [outAt - 30, outAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = inOp * outOp;
  if (op <= 0.01) return null;
  const localFrame = frame - inAt;
  const isFull = mode === "fullscreen";
  const cardW = width * (cardWidthPct ?? (isFull ? 0.62 : 0.5));

  const renderBlock = (b: BlockSpec, i: number) => {
    switch (b.type) {
      case "kicker": return <Kicker key={i} text={b.text} localFrame={localFrame} at={b.at} size={b.size} wordStagger={b.wordStagger} />;
      case "title": return <TitleReveal key={i} text={b.text} localFrame={localFrame} at={b.at} accent={accent} size={b.size} wordStagger={b.wordStagger} />;
      case "tokens": return <TokenRow key={i} tokens={b.tokens} localFrame={localFrame} at={b.at} accent={accent} size={b.size} gap={b.gap} fps={fps} tokenStagger={b.tokenStagger} wave={b.wave} link={b.link} />;
      case "stat": return <StatCountUp key={i} value={b.value} suffix={b.suffix} label={b.label} localFrame={localFrame} at={b.at} accent={accent} decimals={b.decimals} size={b.size} />;
      case "quote": return <QuoteType key={i} text={b.text} localFrame={localFrame} at={b.at} size={b.size} charPerFrame={b.charPerFrame} />;
      case "badges": return <BadgeRow key={i} items={b.items} localFrame={localFrame} at={b.at} accent={accent} fps={fps} />;
    }
  };

  // carte centrale (légère entrée spring)
  const cardPop = spring({ frame: localFrame, fps, config: { damping: 16 }, durationInFrames: 20 });
  const cardCx = width / 2, cardCy = height * 0.44;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {/* FOND : plein écran parchemin opaque OU voile semi-transp (carte visible dessous) */}
      {isFull ? (
        <>
          <AbsoluteFill style={{ background: "#cdba8f", opacity: 0.98 }} />
          <AbsoluteFill style={{ backgroundImage: `url(${staticFile("_shared/sprites/warmap/paper-grain.png")})`,
            backgroundRepeat: "repeat", opacity: 0.4, mixBlendMode: "multiply" }} />
        </>
      ) : (
        <AbsoluteFill style={{ background: "rgba(20,14,6,0.42)" }} />
      )}

      {/* ligne fine vers le point carte ancré (géo-conscience optionnelle) */}
      {anchorPx && !isFull && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          <line x1={cardCx} y1={cardCy + height * 0.12} x2={anchorPx.x} y2={anchorPx.y}
            stroke={accent} strokeWidth={2} strokeOpacity={0.5} strokeDasharray="5 5" />
          <circle cx={anchorPx.x} cy={anchorPx.y} r={6} fill={accent} fillOpacity={0.8} />
        </svg>
      )}

      {/* CARTE CENTRALE (parchemin) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: cardW, padding: isFull ? "48px 56px" : "34px 44px",
          background: isFull ? "rgba(245,239,214,0.97)" : "rgba(245,239,214,0.92)",
          border: `3px solid ${accent}`, borderRadius: 12, textAlign: "center",
          boxShadow: "0 14px 44px rgba(0,0,0,0.42)",
          transform: `scale(${0.96 + 0.04 * cardPop})`,
          display: "flex", flexDirection: "column", gap: isFull ? 22 : 16 }}>
          {children ?? blocks?.map(renderBlock)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default WarMapOverlayDynamic;
