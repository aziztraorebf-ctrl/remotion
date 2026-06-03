import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export type CarouselSlideData =
  | { type: "hook"; title: string; subtitle?: string }
  | { type: "fact"; label?: string; body: string; highlight?: string }
  | { type: "stat"; number: string; unit?: string; body: string }
  | { type: "cta"; line1: string; line2: string; handle: string };

export interface CarouselSouverainProps {
  slides: CarouselSlideData[];
  slideIndex: number;
  totalSlides: number;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-[3px] flex-1 rounded-sm"
          style={{ backgroundColor: i <= current ? "#c8a951" : "rgba(200,169,81,0.25)" }}
        />
      ))}
    </div>
  );
}

function SlideHook({ data, opacity }: { data: Extract<CarouselSlideData, { type: "hook" }>; opacity: number }) {
  return (
    <div className="flex flex-col items-center text-center px-[60px]" style={{ opacity }}>
      <div className="w-[50px] h-[3px] bg-gold rounded-sm mb-10" />
      <h1 className="font-serif text-[58px] font-bold text-ivory leading-tight mb-6">{data.title}</h1>
      {data.subtitle && (
        <p className="text-gold text-[26px] leading-relaxed mt-2">{data.subtitle}</p>
      )}
      <div className="w-[50px] h-[3px] bg-gold rounded-sm mt-10" />
    </div>
  );
}

function SlideFact({ data, opacity }: { data: Extract<CarouselSlideData, { type: "fact" }>; opacity: number }) {
  return (
    <div className="flex flex-col px-[60px]" style={{ opacity }}>
      {data.label && (
        <p className="text-gold text-[20px] tracking-widest uppercase mb-6">{data.label}</p>
      )}
      {data.highlight && (
        <h2 className="font-serif text-[76px] font-bold text-gold leading-none mb-5">{data.highlight}</h2>
      )}
      <p className="text-ivory text-[34px] leading-relaxed">{data.body}</p>
    </div>
  );
}

function SlideStat({ data, opacity, scale }: { data: Extract<CarouselSlideData, { type: "stat" }>; opacity: number; scale: number }) {
  return (
    <div className="flex flex-col items-center text-center px-[60px]" style={{ opacity }}>
      <div style={{ transform: `scale(${scale})` }}>
        <div className="font-serif text-[120px] font-bold text-gold leading-none">{data.number}</div>
        {data.unit && (
          <div className="text-gold text-[26px] tracking-widest uppercase mt-2">{data.unit}</div>
        )}
      </div>
      <div className="w-[36px] h-[2px] bg-gold rounded-sm my-6" />
      <p className="text-ivory text-[30px] leading-relaxed">{data.body}</p>
    </div>
  );
}

function SlideCta({ data, opacity }: { data: Extract<CarouselSlideData, { type: "cta" }>; opacity: number }) {
  return (
    <div className="flex flex-col items-center text-center px-[60px]" style={{ opacity }}>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-8"
        style={{ border: "2px solid #c8a951" }}
      >
        <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "15px solid #c8a951", marginLeft: 3 }} />
      </div>
      <h2 className="font-serif text-[44px] font-bold text-ivory leading-snug mb-5">{data.line1}</h2>
      <p className="text-gold text-[28px] leading-relaxed">{data.line2}</p>
      <p className="text-ivory/50 text-[22px] mt-10">{data.handle}</p>
    </div>
  );
}

export const CarouselSouverain: React.FC<CarouselSouverainProps> = ({
  slides,
  slideIndex,
  totalSlides,
}) => {
  const frame = useCurrentFrame();
  const slide = slides[slideIndex];

  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 18], [0.88, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-navy flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-10 pt-7 pb-3">
        <div className="text-center mb-2">
          <span className="font-serif text-[18px] text-gold tracking-[4px] font-bold">K&amp;C</span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
        <div className="text-center text-[14px] tracking-widest mt-2" style={{ color: "rgba(200,169,81,0.35)" }}>
          SLIDE {slideIndex + 1}/{totalSlides}
        </div>
      </div>

      {/* Content — flex-1 + justify-center pour centrage vertical */}
      <div className="flex-1 flex flex-col justify-center">
        {slide.type === "hook" && <SlideHook data={slide} opacity={opacity} />}
        {slide.type === "fact" && <SlideFact data={slide} opacity={opacity} />}
        {slide.type === "stat" && <SlideStat data={slide} opacity={opacity} scale={scale} />}
        {slide.type === "cta"  && <SlideCta  data={slide} opacity={opacity} />}
      </div>

      {/* Footer */}
      <div className="shrink-0 py-5 text-center">
        <span className="text-gold text-[20px] tracking-widest opacity-70">@koraetcartes</span>
      </div>
    </AbsoluteFill>
  );
};
