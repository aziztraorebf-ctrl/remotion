/**
 * VehicleSymbols — symboles vehicules TOP-DOWN en SVG (vrai vu-du-dessus).
 *
 * Recraft sort en iso 3/4 malgre les prompts -> on dessine les symboles en code.
 * Avantage : vrai top-down, rotation propre selon la direction, echelle nette,
 * style schematique = registre carte de guerre reelle (pas photoreal). Encre/cream
 * Atlas. Pointent vers le HAUT par defaut -> rotation = cap.
 */

import React from "react";

type SymProps = { size: number; color: string; ink?: string };

// CHAR (top-down) : caisse + tourelle + canon vers le haut + chenilles laterales
export const TankSymbol: React.FC<SymProps> = ({ size, color, ink = "#1A1A1A" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    {/* chenilles */}
    <rect x="18" y="26" width="13" height="52" rx="3" fill={ink} opacity="0.85" />
    <rect x="69" y="26" width="13" height="52" rx="3" fill={ink} opacity="0.85" />
    {/* traverses chenilles */}
    {[32, 42, 52, 62, 72].map((y) => (
      <React.Fragment key={y}>
        <rect x="18" y={y} width="13" height="2.4" fill={color} opacity="0.5" />
        <rect x="69" y={y} width="13" height="2.4" fill={color} opacity="0.5" />
      </React.Fragment>
    ))}
    {/* caisse */}
    <rect x="29" y="30" width="42" height="44" rx="5" fill={color} stroke={ink} strokeWidth="2.4" />
    {/* tourelle */}
    <circle cx="50" cy="52" r="13" fill={color} stroke={ink} strokeWidth="2.4" />
    <circle cx="50" cy="52" r="4" fill={ink} opacity="0.5" />
    {/* canon vers le haut */}
    <rect x="47.5" y="6" width="5" height="40" rx="2" fill={ink} />
  </svg>
);

// TECHNICAL (pickup arme, top-down) : capot + cabine + benne + mitrailleuse vers le haut
export const TechnicalSymbol: React.FC<SymProps> = ({ size, color, ink = "#1A1A1A" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    {/* roues */}
    {[
      [24, 30], [70, 30], [24, 64], [70, 64],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="8" height="12" rx="3" fill={ink} opacity="0.85" />
    ))}
    {/* chassis */}
    <rect x="30" y="20" width="40" height="62" rx="6" fill={color} stroke={ink} strokeWidth="2.4" />
    {/* capot (avant, vers le haut) */}
    <rect x="34" y="22" width="32" height="14" rx="3" fill={color} stroke={ink} strokeWidth="1.6" opacity="0.92" />
    {/* cabine */}
    <rect x="35" y="38" width="30" height="16" rx="2" fill={ink} opacity="0.32" />
    {/* benne */}
    <rect x="34" y="56" width="32" height="22" rx="2" fill={ink} opacity="0.14" stroke={ink} strokeWidth="1.4" />
    {/* mitrailleuse montee, pointe vers le haut */}
    <rect x="47.5" y="44" width="5" height="6" fill={ink} />
    <rect x="48.5" y="12" width="3" height="34" rx="1.5" fill={ink} />
  </svg>
);

export const VehicleSymbol: React.FC<{ kind: "tank" | "technical"; size: number; color: string; ink?: string }> = ({
  kind, size, color, ink,
}) => (kind === "tank" ? <TankSymbol size={size} color={color} ink={ink} /> : <TechnicalSymbol size={size} color={color} ink={ink} />);
