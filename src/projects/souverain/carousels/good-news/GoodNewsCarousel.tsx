import React from "react";
import { Series } from "remotion";
import { GoodNewsSlideLight } from "./GoodNewsSlideLight";
import { GoodNewsSlideMap } from "./GoodNewsSlideMap";
import { CURRENT_EDITION, GoodNewsEdition, NewsItem } from "./carousel-data";

/**
 * GoodNewsCarousel — DATA-DRIVEN. Lit `CURRENT_EDITION` (carousel-data.ts).
 * Changer de semaine = éditer carousel-data.ts uniquement (zéro code à toucher).
 *
 * 8 slides : Hook → 3 nouvelles × (fait + macro) → CTA. Charte LUMINEUSE.
 * Preview défilante : chaque slide ~5s. Publication : exporter chaque slide en MP4.
 */

const TOTAL = 8;
const F = 150; // ~5s @ 30fps

function FactSlide({ item, index, slideIndex }: { item: NewsItem; index: number; slideIndex: number }) {
  const kicker = `${index + 1} — ${item.country}`;
  const f = item.fact;
  if (f.brick === "map") {
    return <GoodNewsSlideMap slideIndex={slideIndex} totalSlides={TOTAL} kicker={kicker} body={f.body} />;
  }
  if (f.brick === "gauge") {
    return (
      <GoodNewsSlideLight
        mode="fact" brick="gauge" slideIndex={slideIndex} totalSlides={TOTAL} kicker={kicker}
        gaugeValue={f.gaugeValue} gaugeSuffix={f.gaugeSuffix} gaugeLabel={f.gaugeLabel} body={f.body}
      />
    );
  }
  // bars
  return (
    <GoodNewsSlideLight
      mode="fact" brick="bars" slideIndex={slideIndex} totalSlides={TOTAL} kicker={kicker}
      barsChallengerName={f.challengerName} barsChallengerValue={f.challengerValue}
      barsLeaderName={f.leaderName} barsLeaderValue={f.leaderValue} body={f.body}
    />
  );
}

function MacroSlide({ item, slideIndex }: { item: NewsItem; slideIndex: number }) {
  const m = item.macro;
  return (
    <GoodNewsSlideLight
      mode="fact" brick="flow" slideIndex={slideIndex} totalSlides={TOTAL}
      kicker="Pourquoi le monde regarde" kickerMacro
      flowSourceLabel={m.flow.sourceLabel} flowSourceIcon={m.flow.sourceIcon}
      flowTargetLabel={m.flow.targetLabel} flowTargetIcon={m.flow.targetIcon}
      flowLayout={m.flow.layout ?? "horizontal"}
      body={m.body}
    />
  );
}

export const GoodNewsCarousel: React.FC<{ edition?: GoodNewsEdition }> = ({ edition = CURRENT_EDITION }) => {
  return (
    <Series>
      <Series.Sequence durationInFrames={F}>
        <GoodNewsSlideLight
          mode="hook" slideIndex={0} totalSlides={TOTAL}
          body={edition.hookTitle} subtitle={edition.hookSubtitle}
        />
      </Series.Sequence>

      {edition.news.flatMap((item, i) => [
        <Series.Sequence key={`fact-${i}`} durationInFrames={F}>
          <FactSlide item={item} index={i} slideIndex={1 + i * 2} />
        </Series.Sequence>,
        <Series.Sequence key={`macro-${i}`} durationInFrames={F}>
          <MacroSlide item={item} slideIndex={2 + i * 2} />
        </Series.Sequence>,
      ])}

      <Series.Sequence durationInFrames={F}>
        <GoodNewsSlideLight
          mode="cta" slideIndex={7} totalSlides={TOTAL}
          body={edition.ctaBody} subtitle={edition.ctaSubtitle}
        />
      </Series.Sequence>
    </Series>
  );
};
