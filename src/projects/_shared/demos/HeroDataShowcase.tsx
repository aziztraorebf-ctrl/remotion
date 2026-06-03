import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Landmark } from "lucide-react";
import { CountUp } from "../components/ui/CountUp";
import { SubtitleBarSouverain } from "../components/ui/SubtitleBarSouverain";
import { FloatingHeroObject } from "../components/layouts/FloatingHeroObject";
import { HeroMirrorBars } from "../components/layouts/HeroMirrorBars";
import { Badge } from "../components/ui/Badge";
import { appearOrganic } from "../animations";

export const HERO_DATA_SHOWCASE_FRAMES = 300; // 10s @ 30fps

/**
 * Démo catalogue HERO DATA — exerce les composants enrichis/créés (Livrable 2).
 * 3 scènes de ~3s : CountUp hero · FloatingHeroObject + Badge · HeroMirrorBars.
 * But : valider visuellement le rendu premium avant intégration en prod.
 */
const SUBS = [
  { text: "Le chiffre qui change tout.", start: 0, end: 90 },
  { text: "Un objet, une donnée vivante.", start: 90, end: 190 },
  { text: "Plus tu es petit, plus tu paies.", start: 190, end: 300 },
];

export const HeroDataShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill className="bg-navy overflow-hidden">
      {/* Dégradé radial central (profondeur, P2/P5) */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 45%, #1e2d4a 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* SCÈNE 1 — CountUp hero (P1) : count-up + bounce overshoot + décimales */}
      {frame < 90 && (
        <AbsoluteFill className="flex items-center justify-center">
          <CountUp target={91} startFrame={8} endFrame={70} prefix="" suffix="%" bounce fontSize={220} />
        </AbsoluteFill>
      )}

      {/* SCÈNE 2 — FloatingHeroObject + badges satellites (P5) */}
      {frame >= 90 && frame < 190 && (
        <AbsoluteFill className="flex items-center justify-center">
          <FloatingHeroObject appearFrame={95} size={300} color="#c8a951">
            <Landmark size={150} color="#c8a951" strokeWidth={1.5} />
          </FloatingHeroObject>
          <div className="absolute" style={{ ...appearOrganic(frame, 120, 30), left: 120, top: 700 }}>
            <Badge label="300 000" appearFrame={120} bgColor="#1e2d4a" borderColor="#c8a951" textColor="#f0e8d8" />
          </div>
          <div className="absolute" style={{ ...appearOrganic(frame, 135, 30), right: 120, top: 760 }}>
            <Badge label="1ER MONDIAL" appearFrame={135} bgColor="#1e2d4a" borderColor="#c8a951" textColor="#f0e8d8" />
          </div>
        </AbsoluteFill>
      )}

      {/* SCÈNE 3 — HeroMirrorBars (P7, métaphore physique) */}
      {frame >= 190 && (
        <AbsoluteFill className="flex items-center justify-center">
          <HeroMirrorBars
            appearFrame={200}
            verdictFrame={260}
            left={{ label: "ENVOIE 200 KES", sublabel: "≈ 1,5€", pctFinal: 5, pctDecimals: 0, color: "#cc2200" }}
            right={{ label: "ENVOIE 50 000 KES", sublabel: "≈ 380€", pctFinal: 0.22, pctDecimals: 2, barRatio: 0.05, color: "#4caf7d" }}
          />
        </AbsoluteFill>
      )}

      <SubtitleBarSouverain lines={SUBS} />
    </AbsoluteFill>
  );
};
