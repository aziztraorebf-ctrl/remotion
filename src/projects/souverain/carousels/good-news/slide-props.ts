/**
 * slide-props.ts — dérive les defaultProps des 8 compositions individuelles (gn-XX)
 * depuis CURRENT_EDITION. Garantit que le render slide-par-slide reflète le MÊME
 * contenu que la preview data-driven (une seule source de vérité : carousel-data.ts).
 *
 * Utilisé dans Root.tsx pour les defaultProps des compositions gn-00..gn-07.
 */
import { CURRENT_EDITION, NewsItem } from "./carousel-data";

const TOTAL = 8;
const E = CURRENT_EDITION;

export const hookProps = {
  mode: "hook" as const,
  slideIndex: 0,
  totalSlides: TOTAL,
  body: E.hookTitle,
  subtitle: E.hookSubtitle,
};

export const ctaProps = {
  mode: "cta" as const,
  slideIndex: 7,
  totalSlides: TOTAL,
  body: E.ctaBody,
  subtitle: E.ctaSubtitle,
};

function factProps(item: NewsItem, index: number) {
  const slideIndex = 1 + index * 2;
  const kicker = `${index + 1} — ${item.country}`;
  const f = item.fact;
  if (f.brick === "map") {
    return { slideIndex, totalSlides: TOTAL, kicker, body: f.body }; // GoodNewsSlideMap
  }
  if (f.brick === "gauge") {
    return {
      mode: "fact" as const, brick: "gauge" as const, slideIndex, totalSlides: TOTAL, kicker,
      gaugeValue: f.gaugeValue, gaugeSuffix: f.gaugeSuffix, gaugeLabel: f.gaugeLabel, body: f.body,
    };
  }
  return {
    mode: "fact" as const, brick: "bars" as const, slideIndex, totalSlides: TOTAL, kicker,
    barsChallengerName: f.challengerName, barsChallengerValue: f.challengerValue,
    barsLeaderName: f.leaderName, barsLeaderValue: f.leaderValue, body: f.body,
  };
}

function macroProps(item: NewsItem, index: number) {
  const slideIndex = 2 + index * 2;
  const m = item.macro;
  return {
    mode: "fact" as const, brick: "flow" as const, slideIndex, totalSlides: TOTAL,
    kicker: "Pourquoi le monde regarde", kickerMacro: true,
    flowSourceLabel: m.flow.sourceLabel, flowSourceIcon: m.flow.sourceIcon,
    flowTargetLabel: m.flow.targetLabel, flowTargetIcon: m.flow.targetIcon,
    flowLayout: m.flow.layout ?? "horizontal", body: m.body,
  };
}

// 3 nouvelles → props par slide
export const news0FactProps = factProps(E.news[0], 0);
export const news0MacroProps = macroProps(E.news[0], 0);
export const news1FactProps = factProps(E.news[1], 1);
export const news1MacroProps = macroProps(E.news[1], 1);
export const news2FactProps = factProps(E.news[2], 2);
export const news2MacroProps = macroProps(E.news[2], 2);
