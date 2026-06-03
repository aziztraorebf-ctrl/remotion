/**
 * TypewriterText — texte qui s'ecrit lettre par lettre (effet machine a ecrire), frame-driven.
 *
 * Extrait de la logique de TypeWriter.tsx pour etre reutilisable partout (overlays, inserts,
 * MapCutaway, etc.). Deterministe pour le render headless (base sur useCurrentFrame).
 *
 * Usage :
 *   <TypewriterText text="UN CONTRAT A 50 ANS" startAt={20} speed={1.5}
 *     style={{ fontSize: 64, color: "#f2ebd9" }} cursor />
 *
 * - startAt : frame ABSOLUE de debut de frappe (utiliser frame du parent decale si besoin)
 * - speed   : frames par caractere (1 = rapide, 2-3 = pose)
 * - cursor  : afficher le curseur clignotant pendant la frappe
 */

import React from "react";
import { useCurrentFrame } from "remotion";

export interface TypewriterTextProps {
  text: string;
  /** Frame absolue de debut de frappe */
  startAt: number;
  /** Frames par caractere (defaut 1.5) */
  speed?: number;
  /** Curseur clignotant pendant la frappe (defaut true) */
  cursor?: boolean;
  /** Couleur du curseur (defaut couleur du texte / gold) */
  cursorColor?: string;
  style?: React.CSSProperties;
  className?: string;
  as?: "span" | "div";
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startAt,
  speed = 1.5,
  cursor = true,
  cursorColor = "#c8a951",
  style,
  className,
  as = "span",
}) => {
  const frame = useCurrentFrame();
  const rel = frame - startAt;
  const charsVisible = rel < 0 ? 0 : Math.floor(rel / speed);
  const visible = text.slice(0, Math.min(charsVisible, text.length));
  const typing = rel >= 0 && charsVisible < text.length;
  const showCursor = cursor && typing && Math.floor(frame / 4) % 2 === 0;

  const Tag = as;

  return (
    <Tag style={style} className={className}>
      {visible}
      {showCursor && (
        <span style={{ color: cursorColor, fontWeight: 400 }}>|</span>
      )}
    </Tag>
  );
};

export default TypewriterText;
