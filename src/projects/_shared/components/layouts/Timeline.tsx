import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
}

export interface TimelineProps {
  topLabel?: string;
  events?: TimelineEvent[];
  activeIndex?: number;
  subtitle?: string;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  { year: "1235", title: "Fondation de l'Empire", desc: "Soundiata Keïta unifie les peuples Mandingues" },
  { year: "1324", title: "Pèlerinage de Mansa Moussa", desc: "L'or du Mali ébranle l'économie méditerranéenne" },
  { year: "1375", title: "Apogée territoriale", desc: "L'empire s'étend de l'Atlantique au Niger" },
  { year: "1433", title: "Déclin progressif", desc: "Les raids Touareg fragilisent les routes commerciales" },
];

const LINE_X = 0.42; // position de la ligne verticale (42% du width)

export const Timeline: React.FC<TimelineProps> = ({
  topLabel = "CHRONOLOGIE",
  events = DEFAULT_EVENTS,
  activeIndex = 1,
  subtitle = "explorer l'histoire",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(titleSpring, [0, 1], [-40, 0], { extrapolateRight: "clamp" });

  // Ligne verticale draw-in
  const lineSpring = spring({ frame: frame - 10, fps, config: { damping: 22, stiffness: 60 } });
  const lineScaleY = interpolate(lineSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const footerSpring = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 70 } });
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1420" }}>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(212,175,55,0.3) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Titre */}
      <div
        className="absolute left-0 right-0 text-center uppercase tracking-[0.25em]"
        style={{
          top: 110,
          fontSize: 68,
          color: "#dcb35a",
          fontFamily: "Cinzel, serif",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {topLabel}
      </div>

      {/* Zone timeline — de top:260 à bottom:200 */}
      <div
        className="absolute left-0 right-0"
        style={{ top: 260, bottom: 200, overflow: "visible" }}
      >
        {/* Ligne verticale centrale */}
        <div
          className="absolute"
          style={{
            left: `${LINE_X * 100}%`,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: "rgba(220,179,90,0.45)",
            transform: `scaleY(${lineScaleY})`,
            transformOrigin: "top center",
          }}
        />

        {/* Noeuds */}
        {events.map((event, i) => {
          const isActive = i === activeIndex;
          const nodeDelay = 15 + i * 18;
          const nodeSpring = spring({
            frame: frame - nodeDelay,
            fps,
            config: { damping: 16, stiffness: 85 },
          });
          const nodeOpacity = interpolate(nodeSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const nodeX = interpolate(nodeSpring, [0, 1], [-30, 0], { extrapolateRight: "clamp" });

          const dotR = isActive ? 18 : 13;
          const dotDiameter = dotR * 2;
          const glowSpring = spring({
            frame: frame - nodeDelay - 5,
            fps,
            config: { damping: 12, stiffness: 60 },
          });
          const glowSize = interpolate(glowSpring, [0, 1], [0, 40], { extrapolateRight: "clamp" });
          const glowOpacity = interpolate(glowSpring, [0, 1], [0, 0.55], { extrapolateRight: "clamp" });

          // Position verticale répartie uniformément dans la zone visible
          const totalH = 1200; // zone effective (laisse marge avant footer)
          const topFrac = events.length > 1 ? i / (events.length - 1) : 0.5;
          const nodeTop = 80 + topFrac * (totalH - 160);

          return (
            <div
              key={i}
              className="absolute left-0 right-0 flex flex-row items-center"
              style={{
                top: nodeTop,
                opacity: nodeOpacity,
                transform: `translateX(${nodeX}px)`,
              }}
            >
              {/* Zone gauche : année */}
              <div
                className="flex items-center justify-end"
                style={{ width: `${LINE_X * 100}%`, paddingRight: 28 }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: isActive ? 44 : 34,
                    color: "#dcb35a",
                    fontWeight: isActive ? 700 : 400,
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                  }}
                >
                  {event.year}
                </div>
              </div>

              {/* Dot centré sur la ligne */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: dotDiameter + 20,
                  height: dotDiameter + 20,
                  marginLeft: -(dotDiameter / 2 + 10),
                  marginRight: -(dotDiameter / 2 + 10),
                  zIndex: 2,
                }}
              >
                {/* Glow pour noeud actif */}
                {isActive && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: dotDiameter + glowSize,
                      height: dotDiameter + glowSize,
                      backgroundColor: `rgba(220,179,90,${glowOpacity})`,
                      borderRadius: "50%",
                      filter: "blur(12px)",
                    }}
                  />
                )}
                <div
                  style={{
                    width: dotDiameter,
                    height: dotDiameter,
                    borderRadius: "50%",
                    backgroundColor: isActive ? "#dcb35a" : "transparent",
                    border: `2px solid #dcb35a`,
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </div>

              {/* Zone droite : titre + desc */}
              <div
                className="flex flex-col"
                style={{
                  paddingLeft: 24,
                  flex: 1,
                  paddingRight: 60,
                  gap: 6,
                }}
              >
                <div
                  className="font-mono uppercase tracking-wider"
                  style={{
                    fontSize: isActive ? 30 : 24,
                    color: "#f5efe0",
                    fontWeight: isActive ? 600 : 400,
                    lineHeight: 1.2,
                  }}
                >
                  {event.title}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 20,
                    color: "#8e95a5",
                    lineHeight: 1.35,
                  }}
                >
                  {event.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 80, gap: 18, opacity: footerOpacity }}
      >
        <div style={{ width: 380, height: 1, backgroundColor: "#dcb35a", opacity: 0.45 }} />
        <div
          className="font-mono text-center tracking-widest uppercase"
          style={{ fontSize: 26, color: "#8e95a5" }}
        >
          {subtitle}
        </div>
      </div>

    </AbsoluteFill>
  );
};
