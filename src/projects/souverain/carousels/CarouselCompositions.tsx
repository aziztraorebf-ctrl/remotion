import React from "react";
import { Composition } from "remotion";
import { CarouselSouverain } from "../../_shared/components/layouts/CarouselSouverain";
import { CAROUSELS } from "./carousel-data";

export const CarouselCompositions: React.FC = () => (
  <>
    {CAROUSELS.flatMap((carousel) =>
      carousel.slides.map((_, slideIndex) => (
        <Composition
          key={`${carousel.id}-slide-${slideIndex}`}
          id={`carousel-${carousel.id}-slide-${slideIndex}`}
          component={CarouselSouverain as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={30}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            slides: carousel.slides,
            slideIndex,
            totalSlides: carousel.slides.length,
          }}
        />
      ))
    )}
  </>
);
