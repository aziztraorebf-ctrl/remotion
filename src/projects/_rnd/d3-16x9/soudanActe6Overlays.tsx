// Overlays SVG dedies a l'Acte 6 "Pourquoi personne ne l'arrete" — les SURCOUCHES institutionnelles
// nettes posees SUR le globe (registre "le globe est le decor, les concepts sont des surcouches SVG").
//
// ⚠️ CONTRAT ANTI-AI-SLOP (critique convergente Gemini+Kimi sur nos effets, storyboard § TEST AI-SLOP) :
//   - geometrie SVG codee main, PAS de gradient radial HTML flou / blur CSS baveux
//   - couleurs charte : vert sauge #6B8E23 (pour) / rouge BRIQUE #8B4513 (contre, PAS #FF0000 accusateur)
//   - typo serif/mono (Georgia / monospace), JAMAIS Arial/Roboto systeme
//   - easing cubic-bezier(0.25,0.46,0.45,0.94) — pas de linear mecanique
//   - drop-shadow interdit sur les jetons (= "asset jeu mobile") : stroke net 2px a la place
import React from "react";
import { interpolate, staticFile } from "remotion";

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// easing organique impose par le storyboard (cubic-bezier 0.25,0.46,0.45,0.94 approxime en JS)
const easeOrganic = (x: number): number => {
  // approximation numerique de cubic-bezier(0.25,0.46,0.45,0.94) — easeOutQuad-ish, doux en fin
  return x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 2.2);
};

const VOTE_GREEN = "#6B8E23"; // vert sauge — les 14 pour
const VOTE_RED = "#8B4513"; // rouge BRIQUE (terre de Sienne) — la Russie contre, PAS accusateur
const INK = "#0a1018";
const PARCHMENT = "#f2e9cf";

// ─────────────────────────────────────────────────────────────────────────────
// B3 — UNVoteOverlay : hemicycle stylise 15 sieges (Conseil de securite ONU).
//   14 s'allument vert sauge sur "14 pays votent pour", 1 (Russie) rouge brique sur "La Russie".
//   Le veto = le siege rouge fige tout le vote (les verts se ternissent legerement, le rouge domine).
//   SVG pur position:absolute PAR-DESSUS le canvas globe (jamais dans la projection D3).
// ─────────────────────────────────────────────────────────────────────────────
export const UNVoteOverlay: React.FC<{
  frame: number;
  tAppear: number; // ~b3Novembre : le panneau vote apparait
  tVertPour: number; // ~b3Quatorze : les 14 verts s'allument (cascade)
  tRusse: number; // ~b3Russie : le siege rouge
  tVeto: number; // ~b3Veto : le rouge fige le vote
  tFade: number; // ~b3Neutre : le panneau s'efface (pont B4)
  globeDim: number; // 0..1 : assombrissement du globe derriere (le vote a son espace clos)
}> = ({ frame, tAppear, tVertPour, tRusse, tVeto, tFade, globeDim }) => {
  const appear = interpolate(frame, [tAppear, tAppear + 22], [0, 1], clampB);
  const fade = interpolate(frame, [tFade, tFade + 30], [1, 0], clampB);
  const op = appear * fade;
  if (op <= 0.01) return null;

  // ── VRAI HEMICYCLE compact et centre (registre "graphe de vote parlementaire"), PAS des points
  //    disperses sur la carte. 15 sieges = arc de cercle regulier (demi-cercle), lu comme un Conseil.
  //    Le siege Russie = extremite droite (isole visuellement = le vote qui casse tout).
  const CX = 960, CY = 540; // centre de l'hemicycle (milieu du cadre)
  const N_TOTAL = 15;
  const RADII = [118, 162, 206]; // 3 rangs concentriques COMPACTS (se lit comme un vrai hemicycle)
  const PER_ROW = [4, 5, 6]; // 4+5+6 = 15
  const seats: { x: number; y: number; isRussia: boolean; order: number }[] = [];
  let order = 0;
  // le siege Russie = dernier siege du rang externe (extremite droite)
  RADII.forEach((r, ri) => {
    const n = PER_ROW[ri];
    for (let c = 0; c < n; c++) {
      // demi-cercle SUPERIEUR : angles de 180deg (gauche) a 360deg (droite)
      const frac = n === 1 ? 0.5 : c / (n - 1);
      const a = Math.PI + frac * Math.PI; // 180 -> 360
      const x = CX + Math.cos(a) * r;
      const y = CY + Math.sin(a) * r; // sin negatif sur [180,360] => au-dessus de CY
      const isRussia = ri === 2 && c === n - 1; // externe, extremite droite
      seats.push({ x, y, isRussia, order });
      order++;
    }
  });
  const greenSeats = seats.filter((s) => !s.isRussia);
  const russiaSeat = seats.find((s) => s.isRussia)!;

  const russeReveal = interpolate(frame, [tRusse, tRusse + 14], [0, 1], clampB);
  const vetoLock = interpolate(frame, [tVeto, tVeto + 20], [0, 1], clampB);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: op }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* label "Conseil de Securite de l'ONU — Nov. 2024" (serif, parchemin, ACCENTS OK) */}
        <g transform={`translate(${CX} ${CY - 285})`} opacity={appear}>
          <rect x={-260} y={-28} width={520} height={48} rx={3} fill="rgba(8,12,18,0.82)" stroke={PARCHMENT} strokeWidth={1} strokeOpacity={0.35} />
          <text x={0} y={5} textAnchor="middle" fontFamily="Georgia, serif" fontSize={24} fontWeight={700}
            letterSpacing="0.04em" fill={PARCHMENT}>Conseil de Sécurité de l'ONU — Nov. 2024</text>
        </g>

        {/* socle de l'hemicycle (base + petit gap central = pupitre du president de seance) */}
        <line x1={CX - 230} y1={CY + 10} x2={CX - 16} y2={CY + 10} stroke={PARCHMENT} strokeWidth={2.5} strokeOpacity={0.45 * appear} />
        <line x1={CX + 16} y1={CY + 10} x2={CX + 230} y2={CY + 10} stroke={PARCHMENT} strokeWidth={2.5} strokeOpacity={0.45 * appear} />

        {/* 14 sieges verts (cascade d'allumage dans l'ordre de l'hemicycle) */}
        {greenSeats.map((s, i) => {
          const delay = i * 3;
          const lit = interpolate(frame, [tVertPour + delay, tVertPour + delay + 10], [0, 1], clampB);
          const e = easeOrganic(lit);
          const dim = 1 - vetoLock * 0.35; // au veto, les "pour" se ternissent
          const fill = e > 0.02 ? VOTE_GREEN : "#2f3a24";
          return (
            <g key={`g${i}`} transform={`translate(${s.x} ${s.y})`}>
              <circle r={17} fill={fill} fillOpacity={(0.3 + 0.7 * e) * dim} stroke={VOTE_GREEN}
                strokeWidth={2.4} strokeOpacity={(0.5 + 0.5 * e) * dim} />
              {e > 0.5 && <path d="M -6 0 L -1.5 5 L 6.5 -5.5" fill="none" stroke={PARCHMENT} strokeWidth={2.4}
                strokeLinecap="round" strokeLinejoin="round" opacity={e * dim} />}
            </g>
          );
        })}

        {/* 1 siege rouge brique (Russie) — plus gros, stroke net */}
        <g transform={`translate(${russiaSeat.x} ${russiaSeat.y})`}>
          {vetoLock > 0.02 && (
            <circle r={30 + vetoLock * 8} fill="none" stroke={VOTE_RED} strokeWidth={2.4}
              strokeOpacity={0.55} strokeDasharray="4 5" />
          )}
          <circle r={22} fill={VOTE_RED} fillOpacity={0.35 + 0.65 * russeReveal} stroke={VOTE_RED}
            strokeWidth={3} strokeOpacity={0.5 + 0.5 * russeReveal} transform={`scale(${0.7 + 0.3 * easeOrganic(russeReveal)})`} />
          {russeReveal > 0.5 && (
            <g stroke={PARCHMENT} strokeWidth={2.8} strokeLinecap="round" opacity={russeReveal}>
              <line x1={-6} y1={-6} x2={6} y2={6} />
              <line x1={6} y1={-6} x2={-6} y2={6} />
            </g>
          )}
        </g>
        {/* label "Russie" a DROITE du siege rouge (evite le socle et le Soudan) */}
        <text x={russiaSeat.x + 34} y={russiaSeat.y + 6} textAnchor="start" fontFamily="Georgia, serif"
          fontSize={22} fontWeight={800} fill={VOTE_RED}
          opacity={interpolate(frame, [tRusse + 6, tRusse + 22], [0, 1], clampB)}
          style={{ paintOrder: "stroke" }} stroke={INK} strokeWidth={1}>Russie</text>

        {/* compteurs sobres, encadrant l'hemicycle (mono), a l'exterieur du demi-cercle */}
        <text x={CX - 320} y={CY - 40} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={46}
          fontWeight={700} fill={VOTE_GREEN} opacity={interpolate(frame, [tVertPour + 24, tVertPour + 42], [0, 1], clampB) * (1 - vetoLock * 0.25)}>
          14 pour
        </text>
        <text x={CX + 320} y={CY - 40} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={46}
          fontWeight={700} fill={VOTE_RED} opacity={vetoLock}>1 veto</text>
        {/* verdict "bloqué" au veto (serif, bandeau sombre bas de globe pour la lisibilite) */}
        {vetoLock > 0.01 && (
          <g opacity={vetoLock}>
            <rect x={CX - 200} y={CY + 118} width={400} height={54} rx={3} fill="rgba(8,12,18,0.86)"
              stroke={VOTE_RED} strokeWidth={1.5} strokeOpacity={0.6} />
            <text x={CX} y={CY + 153} textAnchor="middle" fontFamily="Georgia, serif" fontSize={32} fontWeight={800}
              letterSpacing="0.05em" fill={PARCHMENT}>Résolution bloquée</text>
          </g>
        )}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// B4 — NegotiationTableInsert : insert SVG plein ecran, table de nego vue de dessus.
//   Le jeton EMIRATS (repris de l'Acte 5 = pastille drapeau "ae") recoit un spotlight subtil (halo
//   jaune op 0.3), les autres acteurs sont des silhouettes GRISES. Le fait visuel (la lumiere) porte
//   le jugement — "on demande d'eteindre l'incendie a celui qui l'alimente". PAS de fleche, PAS de texte
//   accusateur. Cross-fade opacite depuis le globe (le globe ne bouge pas dessous).
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// B5 — DisplacementCounter : CARTOUCHE data plein écran CENTRÉ, registre War-Map AES longue
//   (`WarMapOverlayData`, règle R2 : "info sans équivalent cartographique = fond SOLIDE parchemin,
//   CENTRÉ, fige l'action ~7-10s" + R4 "fond cream clair, jamais noir"). Retour Aziz 2026-07-20 :
//   au CENTRE, fond SOLIDE (pas semi-transparent), on FIGE tout pour marquer le coût humain — peu
//   importe que ça cache la carte. Chiffre count-up + grille de pictos-silhouettes + tagline + source.
// ─────────────────────────────────────────────────────────────────────────────
const CREAM_B5 = "#F2E5C8";
const INK_B5 = "#3A2A18";
const RSF_B5 = "#B14B3C";

// pop 0->1 : le picto s'allume ROUGE (déplacé) sur fond de la grille des pictos gris (population totale).
// `lit` = ce picto fait-il partie des déplacés (rouge) ou reste-t-il gris (population non déplacée) ?
// LOT 5.3 : grille dense (~135 pictos = pop totale ~50M), ~37 s'allument en rouge = ratio déplacés 13,5M/50M.
const PersonIcon: React.FC<{ pop: number; lit: boolean }> = ({ pop, lit }) => {
  const on = lit && pop > 0.01;
  // le picto allumé (déplacé) "tombe" en place (scale + translateY) ; les gris sont posés d'emblée.
  const scale = lit ? 0.6 + 0.4 * pop : 1;
  const ty = lit ? (1 - pop) * 6 : 0;
  return (
    <svg viewBox="0 0 24 24" style={{ width: 15, height: 17, transform: `translateY(${ty}px) scale(${scale})` }}>
      <circle cx={12} cy={7} r={4.2} fill={on ? RSF_B5 : INK_B5} opacity={on ? Math.max(0.85, pop) : 0.14} />
      <path d="M4 22 C4 15, 20 15, 20 22 Z" fill={on ? RSF_B5 : INK_B5} opacity={on ? Math.max(0.85, pop) : 0.14} />
    </svg>
  );
};

export const DisplacementCounter: React.FC<{
  frame: number;
  tStart: number; // b5TreizeMillions : le cartouche apparait (fige l'action)
  tHold: number; // frame ou le compteur atteint 13,5M
  tOut: number; // frame ou le cartouche commence a disparaitre
}> = ({ frame, tStart, tHold, tOut }) => {
  const appear = interpolate(frame, [tStart, tStart + 18], [0, 1], clampB);
  const out = interpolate(frame, [tOut, tOut + 22], [1, 0], clampB);
  const op = appear * out;
  if (op <= 0.01) return null;
  const prog = easeOrganic(interpolate(frame, [tStart, tHold], [0, 1], clampB));
  const txt = (prog * 13.5).toFixed(1).replace(".", ",");
  // LOT 5.3 : grille DENSE = population totale du Soudan (~50M). N=135 pictos (~0,37M chacun).
  // ~37 d'entre eux s'allument en ROUGE = les déplacés (13,5M / 50M ≈ 27%). Le reste reste gris.
  // (On représente la PART chassée sur le tout — pas une "extinction", les déplacés sont vivants.)
  const N = 135;
  const LIT_COUNT = Math.round(N * 13.5 / 50); // ≈ 37 déplacés
  // Répartir les déplacés de façon RÉGULIÈRE dans la grille (pas un bloc) = lecture "une part partout".
  const litStep = N / LIT_COUNT;
  const litSet = new Set(Array.from({ length: LIT_COUNT }, (_, k) => Math.round(k * litStep)));
  // rebond du chiffre a l'arrivee de 13,5 (Gemini/Kimi : "claque" en place)
  const numBounce = interpolate(frame, [tHold - 4, tHold + 4, tHold + 14], [0, -6, 0], clampB);
  // pop par picto ALLUMÉ (stagger, tombe en place) : les déplacés s'allument un par un avec le compteur.
  const fillDur = tHold - tStart;
  const litOrder = Array.from(litSet).sort((a, b) => a - b);
  const iconPop = (i: number) => {
    const rank = litOrder.indexOf(i);
    if (rank < 0) return 0;
    const a = tStart + (rank / LIT_COUNT) * fillDur;
    return interpolate(frame, [a, a + 9], [0, 1], clampB);
  };

  // le CARTOUCHE reste OPAQUE (fond crème solide) des qu'il est visible : il monte par SCALE + un fade
  // TRES court (4f), PAS par une longue montee d'opacite (sinon on voit la carte a travers = brouillon,
  // bug v5). Seul le VOILE de fond suit `appear`.
  const cardScale = 0.9 + 0.1 * appear;
  const cardOp = interpolate(frame, [tStart, tStart + 4], [0, 1], clampB) * out;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* voile derriere le cartouche (concentre l'oeil, la carte s'estompe) */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(8,6,3,0.5)", opacity: op }} />
      {/* CARTOUCHE SOLIDE parchemin, CENTRE (registre AES R2/R4) — opaque des l'apparition */}
      <div style={{ position: "relative", opacity: cardOp, transform: `scale(${cardScale})`, width: 900, maxWidth: "84%",
        background: CREAM_B5, borderRadius: 6, border: `2px solid ${INK_B5}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)", padding: "34px 44px 30px", textAlign: "center" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, letterSpacing: "0.08em",
          color: RSF_B5, textTransform: "uppercase", marginBottom: 14 }}>Le coût humain</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14 }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 92, fontWeight: 700, color: INK_B5, lineHeight: 1,
            display: "inline-block", transform: `translateY(${numBounce}px)` }}>{txt}</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 600, color: INK_B5 }}>millions</span>
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 500, color: INK_B5, marginTop: 4 }}>
          de personnes ont dû fuir leur maison
        </div>
        {/* grille DENSE population (135 pictos) : ~37 s'allument rouge = déplacés sur le tout */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginTop: 22,
          maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
          {Array.from({ length: N }, (_, i) => <PersonIcon key={i} pop={iconPop(i)} lit={litSet.has(i)} />)}
        </div>
        {/* légende du ratio (rend le rouge lisible : ce ne sont pas des morts mais des chassés de chez eux) */}
        <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: RSF_B5, marginTop: 12, letterSpacing: "0.02em" }}>
          soit près d'un Soudanais sur quatre
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontStyle: "italic", color: RSF_B5, marginTop: 20 }}>
          La pire crise humanitaire de la planète
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#8a7a5e", marginTop: 12, letterSpacing: "0.02em" }}>
          Nations unies (OCHA), 2026
        </div>
      </div>
    </div>
  );
};
