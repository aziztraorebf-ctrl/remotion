// MOTEUR: capture-UI (shotcraft) — film complet suivant l'arc promo-energy-arc
/**
 * NorthShieldPromo — TEST v3 : le SYSTEME d'assemblage shotcraft, pas une carte isolee.
 *
 * Squelette : references/sequences/promo-energy-arc.md — l'equivalent shotcraft de notre
 * mix-and-match. 4 segments a energie imposee, une carte par plan, une technique ne peut
 * etre vedette qu'une fois.
 *
 *   (1) OUVERTURE   8-12%  energie basse   -> brand-ink-open
 *   (2) HEROS      12-15%  energie moyenne -> la page se pose (spotlight-hero-card)
 *   (3) MONTEE     55-65%  moyenne<->basse -> row-embed / type-and-filter / value-stagger
 *   (4) FINAL      13-16%  pic            -> outro-group-photo-launch
 *
 * Regles dures reprises des fiches :
 *  - brand hold >= 1s apres apparition du logo (R1, "sous 1s = a refaire")
 *  - frappe a 3f/caractere (valeur figee APRES retour utilisateur "trop rapide")
 *  - respiration de ~11f entre la fin de frappe et le filtrage, sinon lecture "machine"
 *  - sortie des lignes non-ciblees decalee de 0.4f minimum, sinon "la page plante"
 *
 * Matiere : captures Puppeteer reelles (2 etats : complet + filtre "Berlin").
 * Aucune ligne redessinee — tout est decoupe dans les plaques (regle row-embed).
 *
 * 810f @30fps = 27s.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing, Sequence } from "remotion";
import layout from "./live-layout.json";

export const NS_PROMO_FPS = 30;
export const NS_PROMO_FRAMES = 810;

const PAGE_W = 1920;
const PAGE_H = 1080;
const ROWS = layout.dashboard.boxes.rows;
const SEARCH = layout.dashboard.boxes.search;
const FLAGGED = ROWS[ROWS.length - 1];

const NAVY = "#0A1628";
const IVORY = "#F4F1EA";
const CYAN = "#00D9FF";
const RED = "#FF4D5E";
const MUTED = "#A8B0C0";
const MONO = "'IBM Plex Mono', monospace";
const DISPLAY = "'Space Grotesk', 'Inter', sans-serif";

const PLATE_FULL = "_client-sim/noteshield/live/dashboard-full.png";
const PLATE_EMPTY = "_client-sim/noteshield/live/dashboard-empty.png";
const PLATE_FILTERED = "_client-sim/noteshield/live/filtered-after.png";

// Decoupe des segments (arc : 10% / 13% / 61% / 16%)
const S1 = { from: 0, dur: 84 };    // ouverture marque
const S2 = { from: 84, dur: 105 };  // heros : la page se pose
const S3 = { from: 189, dur: 492 }; // montee : 3 plans
const S4 = { from: 681, dur: 129 }; // final

function seg(f: number, a: number, b: number, ease = Easing.out(Easing.cubic)): number {
  return ease(interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
}

// ── (1) brand-ink-open ────────────────────────────────────────────────────────
const BrandOpen: React.FC = () => {
  const f = useCurrentFrame();
  // Reticule : vertical 0->9f, horizontal 8->18f, fondu 24->34f
  const vLine = seg(f, 0, 9);
  const hLine = seg(f, 8, 18);
  const retFade = 1 - seg(f, 24, 34);
  const word = "NorthShield";
  // Lockup : hold plein de 46 a 76f (>= 1s, regle dure R1), puis sortie rapide.
  const exit = seg(f, 76, 83);
  const kicker = Math.floor(interpolate(f, [28, 44], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ background: NAVY, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateY(${-40 * exit}px) scale(${1 - 0.12 * exit})`, opacity: 1 - exit, textAlign: "center" }}>
        <svg width={220} height={220} style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -110, marginTop: -140, opacity: retFade }}>
          <line x1={110} y1={20} x2={110} y2={200} stroke={CYAN} strokeWidth={1.5}
            strokeDasharray={180} strokeDashoffset={180 * (1 - vLine)} />
          <line x1={20} y1={110} x2={200} y2={110} stroke={CYAN} strokeWidth={1.5}
            strokeDasharray={180} strokeDashoffset={180 * (1 - hLine)} />
        </svg>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {word.split("").map((c, i) => {
            // letterpress : delay 10+i*3, 12f, scale 1.6->1 + blur 6->0
            const p = seg(f, 10 + i * 3, 22 + i * 3);
            return (
              <span key={i} style={{
                fontFamily: DISPLAY, fontSize: 96, fontWeight: 700, color: IVORY, letterSpacing: 2,
                display: "inline-block", opacity: p,
                transform: `scale(${1.6 - 0.6 * p})`, transformOrigin: "center bottom",
                filter: `blur(${6 * (1 - p)}px)`,
              }}>{c}</span>
            );
          })}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: MUTED, marginTop: 22, letterSpacing: 3 }}>
          {"SECURITE DES ACCES".slice(0, kicker)}
          <span style={{ opacity: f < 74 && Math.floor(f / 2) % 2 === 0 ? 1 : 0, color: CYAN }}>▌</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── (2) la page se pose (energie moyenne, le plan le plus lent) ───────────────
const HeroPlate: React.FC = () => {
  const f = useCurrentFrame();
  const rise = seg(f, 0, 40, Easing.out(Easing.cubic));
  const drift = interpolate(f, [0, 105], [0, -14]);
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div style={{
        transform: `translateY(${(1 - rise) * 60 + drift}px) scale(${0.94 + 0.06 * rise})`,
        opacity: rise, filter: `blur(${5 * (1 - rise)}px)`, transformOrigin: "center center",
      }}>
        <Img src={staticFile(PLATE_FULL)} style={{ width: PAGE_W, height: PAGE_H, display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

// ── (3a) row-embed : les lignes s'encastrent ─────────────────────────────────
const RowEmbed: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const drift = interpolate(f / dur, [0, 1], [8, -8]);
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div style={{ transform: `translateY(${drift}px)` }}>
        <Img src={staticFile(PLATE_EMPTY)} style={{ width: PAGE_W, height: PAGE_H, display: "block" }} />
        {ROWS.map((box, i) => {
          const cue = 8 + i * 9;
          const p = seg(f, cue, cue + 12);
          const air = 1 - p;
          const bounce = interpolate(f, [cue + 12, cue + 16], [0.995, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const scale = air > 0 ? 1 + 0.06 * air : bounce;
          const seam = seg(f, cue + 12, cue + 17);
          const seamW = interpolate(Math.min(seam * 2, 1), [0, 1], [0, 40]);
          const seamOp = interpolate(seam, [0.35, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isFlag = i === ROWS.length - 1;
          if (f < cue) return null;
          return (
            <div key={i} style={{
              position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h,
              transform: `perspective(900px) translateY(${-120 * air}px) rotateX(${16 * air}deg) scale(${scale})`,
              transformOrigin: "center bottom", opacity: Math.min(1, p * 2.6),
            }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${staticFile(PLATE_FULL)})`,
                backgroundSize: `${PAGE_W}px ${PAGE_H}px`,
                backgroundPosition: `${-box.x}px ${-box.y}px`,
              }} />
              <div style={{
                position: "absolute", left: `${(100 - seamW) / 2}%`, bottom: 0, width: `${seamW}%`, height: 2,
                background: isFlag ? RED : CYAN, boxShadow: `0 0 6px ${isFlag ? RED : CYAN}`, opacity: seamOp,
              }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── (3b) type-and-filter : on tape "Berlin", la liste converge ───────────────
const TypeAndFilter: React.FC = () => {
  const f = useCurrentFrame();
  const QUERY = "Berlin";
  const TYPE_START = 24;
  const TYPED = Math.max(0, Math.min(QUERY.length, Math.floor((f - TYPE_START) / 3))); // 3f/caractere
  const TYPE_END = TYPE_START + QUERY.length * 3;
  const FILTER_START = TYPE_END + 11; // respiration : sans elle, lecture "machine"
  const caretOn = f < TYPE_END ? true : Math.floor((f - TYPE_END) / 8) % 2 === 0;

  // Camera : legere montee vers la barre de recherche puis retour.
  const camY = interpolate(f, [0, 20, FILTER_START, FILTER_START + 30], [0, -40, -40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div style={{ transform: `translateY(${camY}px)` }}>
        <Img src={staticFile(PLATE_EMPTY)} style={{ width: PAGE_W, height: PAGE_H, display: "block" }} />

        {ROWS.map((box, i) => {
          const isFlag = i === ROWS.length - 1;
          // Sortie decalee en ordre de lecture (0.4f mini) ; la cible reste et remonte.
          const out = isFlag ? 0 : seg(f, FILTER_START + i * 2, FILTER_START + i * 2 + 6);
          const targetY = interpolate(seg(f, FILTER_START + 6, FILTER_START + 22, Easing.inOut(Easing.cubic)),
            [0, 1], [box.y, ROWS[0].y]);
          const y = isFlag ? targetY : box.y;
          const lift = isFlag ? Math.sin(seg(f, FILTER_START + 6, FILTER_START + 22) * Math.PI) : 0;
          return (
            <div key={i} style={{
              position: "absolute", left: box.x, top: y, width: box.w, height: box.h,
              opacity: 1 - out, transform: `translateY(${8 * out}px) scale(${1 + 0.02 * lift})`,
              boxShadow: lift > 0.05 ? `0 ${10 * lift}px ${30 * lift}px rgba(0,0,0,.5)` : "none",
              borderRadius: 16,
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden",
                backgroundImage: `url(${staticFile(PLATE_FULL)})`,
                backgroundSize: `${PAGE_W}px ${PAGE_H}px`,
                backgroundPosition: `${-box.x}px ${-box.y}px`,
              }} />
            </div>
          );
        })}

        {/* Champ de recherche : patch du placeholder puis texte tape par-dessus. */}
        <div style={{
          position: "absolute", left: SEARCH.x, top: SEARCH.y, width: SEARCH.w, height: SEARCH.h,
          background: "#0C1A2E", border: `1px solid ${TYPED > 0 ? CYAN + "66" : "#0F1F38"}`,
          borderRadius: 10, display: "flex", alignItems: "center", gap: 12, padding: "0 20px",
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth={2}>
            <circle cx={11} cy={11} r={7} /><path d="M20 20l-3.5-3.5" />
          </svg>
          <span style={{ fontFamily: MONO, fontSize: 16, color: TYPED > 0 ? IVORY : MUTED }}>
            {TYPED > 0 ? QUERY.slice(0, TYPED) : "Rechercher un utilisateur, un appareil..."}
            <span style={{ opacity: caretOn ? 1 : 0, color: CYAN }}>▌</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── (3c) value-stagger : le score monte, le risque se declare ────────────────
const ScoreReveal: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = seg(f, 0, 45, Easing.inOut(Easing.cubic));
  const s = 1 + 0.95 * zoom;
  const cx = 71.5, cy = ((FLAGGED.y + FLAGGED.h / 2) / PAGE_H) * 100;
  const tx = interpolate(zoom, [0, 1], [50, cx]);
  const ty = interpolate(zoom, [0, 1], [50, cy]);
  const glow = seg(f, 40, 70);
  const pulse = 1 + Math.sin(f / 8) * 0.02 * glow;

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, transformOrigin: "0 0",
        transform: `translate(${50 - tx * s}%, ${50 - ty * s}%) scale(${s})`,
      }}>
        <Img src={staticFile(PLATE_FILTERED)} style={{ width: PAGE_W, height: PAGE_H, display: "block" }} />
        <div style={{
          position: "absolute", left: ROWS[0].x, top: ROWS[0].y, width: FLAGGED.w, height: FLAGGED.h,
          borderRadius: 16, border: `2px solid ${RED}`,
          boxShadow: `0 0 ${50 * glow}px ${RED}`, opacity: glow, transform: `scale(${pulse})`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ── (4) final : le verdict ───────────────────────────────────────────────────
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const inP = seg(f, 0, 24);
  const line = seg(f, 20, 46);
  const hold = seg(f, 40, 64);
  return (
    <AbsoluteFill style={{ background: NAVY, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: inP, transform: `translateY(${(1 - inP) * 24}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 26, color: RED, letterSpacing: 6, marginBottom: 26 }}>
          {"ANOMALIE DETECTEE"}
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: IVORY, letterSpacing: 1 }}>
          NorthShield
        </div>
        <div style={{ height: 2, background: CYAN, margin: "26px auto 0", width: `${line * 360}px`, opacity: line }} />
        <div style={{ fontFamily: MONO, fontSize: 20, color: MUTED, marginTop: 26, opacity: hold, letterSpacing: 2 }}>
          Chaque connexion, notee en temps reel.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const NorthShieldPromo: React.FC = () => (
  <AbsoluteFill style={{ background: NAVY }}>
    <Sequence from={S1.from} durationInFrames={S1.dur}><BrandOpen /></Sequence>
    <Sequence from={S2.from} durationInFrames={S2.dur}><HeroPlate /></Sequence>
    <Sequence from={S3.from} durationInFrames={168}><RowEmbed dur={168} /></Sequence>
    <Sequence from={S3.from + 168} durationInFrames={186}><TypeAndFilter /></Sequence>
    <Sequence from={S3.from + 354} durationInFrames={138}><ScoreReveal /></Sequence>
    <Sequence from={S4.from} durationInFrames={S4.dur}><Outro /></Sequence>
  </AbsoluteFill>
);
