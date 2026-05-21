// PaletteShowcase — validation visuelle palette Hannibal
// 1 frame statique, format vertical 1080x1920
// Forke de empire-ghana/tests/PaletteShowcase.tsx

import React from "react";
import { AbsoluteFill } from "remotion";
import {
  HANNIBAL_PALETTE,
  HANNIBAL_FONTS,
  HANNIBAL_TYPO,
  HANNIBAL_LETTERSPACING,
} from "../components/HannibalPalette";

export const PALETTE_SHOWCASE_FRAMES = 30;

const ColorSwatch: React.FC<{ color: string; name: string; usage: string }> = ({ color, name, usage }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
    <div style={{
      width: 56,
      height: 56,
      backgroundColor: color,
      border: `1px solid ${HANNIBAL_PALETTE.METAL_FROID}`,
      marginRight: 14,
      flexShrink: 0,
    }} />
    <div style={{ fontFamily: HANNIBAL_FONTS.MONO }}>
      <div style={{ fontSize: 13, color: HANNIBAL_PALETTE.ROUTE }}>{name}</div>
      <div style={{ fontSize: 10, color: HANNIBAL_PALETTE.METAL_FROID }}>{color}</div>
      <div style={{ fontSize: 9, color: HANNIBAL_PALETTE.PARCHEMIN, opacity: 0.7 }}>{usage}</div>
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{
    color: HANNIBAL_PALETTE.ROUTE,
    fontFamily: HANNIBAL_FONTS.TITRE,
    fontSize: 20,
    letterSpacing: HANNIBAL_LETTERSPACING.LABEL,
    marginTop: 16,
    marginBottom: 8,
    borderBottom: `1px solid ${HANNIBAL_PALETTE.ROUTE_SOMBRE}`,
    paddingBottom: 4,
  }}>
    {title}
  </div>
);

export const HannibalPaletteShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: HANNIBAL_PALETTE.NOIR_GUERRE, padding: 38 }}>
      {/* Header */}
      <div style={{
        color: HANNIBAL_PALETTE.ROUTE,
        fontFamily: HANNIBAL_FONTS.TITRE,
        fontSize: 46,
        textAlign: "center",
        letterSpacing: HANNIBAL_LETTERSPACING.TITRE,
        marginBottom: 4,
      }}>
        Hannibal · Traversée des Alpes
      </div>
      <div style={{
        color: HANNIBAL_PALETTE.METAL_FROID,
        fontFamily: HANNIBAL_FONTS.SERIF,
        fontSize: 16,
        textAlign: "center",
        letterSpacing: HANNIBAL_LETTERSPACING.CARTOUCHE,
        marginBottom: 18,
      }}>
        Palette officielle · v1 · 2026-05-04
      </div>

      {/* Two columns */}
      <div style={{ display: "flex", gap: 22, flex: 1 }}>
        {/* COLONNE GAUCHE */}
        <div style={{ flex: 1 }}>
          <SectionTitle title="FONDS" />
          <ColorSwatch color={HANNIBAL_PALETTE.NOIR_GUERRE}    name="NOIR_GUERRE"    usage="background global" />
          <ColorSwatch color={HANNIBAL_PALETTE.ARDOISE_FOND}   name="ARDOISE_FOND"   usage="fond carte secondaire" />
          <ColorSwatch color={HANNIBAL_PALETTE.BRUME_ALPES}    name="BRUME_ALPES"    usage="ellipse alpine intérieure" />
          <ColorSwatch color={HANNIBAL_PALETTE.PIERRE_ALPES}   name="PIERRE_ALPES"   usage="ellipse alpine extérieure" />

          <SectionTitle title="MER MÉDITERRANÉE" />
          <ColorSwatch color={HANNIBAL_PALETTE.MER}            name="MER"            usage="Méditerranée principale" />
          <ColorSwatch color={HANNIBAL_PALETTE.MER_VIF}        name="MER_VIF"        usage="reflets, Rhône" />
          <ColorSwatch color={HANNIBAL_PALETTE.MER_SOMBRE}     name="MER_SOMBRE"     usage="profondeurs, ombres" />

          <SectionTitle title="CARTHAGE (armée Hannibal)" />
          <ColorSwatch color={HANNIBAL_PALETTE.CARTHAGE}       name="CARTHAGE"       usage="rouge punique principal" />
          <ColorSwatch color={HANNIBAL_PALETTE.CARTHAGE_VIF}   name="CARTHAGE_VIF"   usage="highlights, accent route" />
          <ColorSwatch color={HANNIBAL_PALETTE.CARTHAGE_SOMBRE}name="CARTHAGE_SOMBRE"usage="zone de perte, ombres" />

          <SectionTitle title="ROUTE D'HANNIBAL" />
          <ColorSwatch color={HANNIBAL_PALETTE.ROUTE}          name="ROUTE"          usage="ambre — trait animé SVG" />
          <ColorSwatch color={HANNIBAL_PALETTE.ROUTE_GLOW}     name="ROUTE_GLOW"     usage="glow strokeDashoffset" />
          <ColorSwatch color={HANNIBAL_PALETTE.ROUTE_SOMBRE}   name="ROUTE_SOMBRE"   usage="segments franchis" />
        </div>

        {/* COLONNE DROITE */}
        <div style={{ flex: 1 }}>
          <SectionTitle title="ROME (ennemi)" />
          <ColorSwatch color={HANNIBAL_PALETTE.ROME}           name="ROME"           usage="pourpre romain" />
          <ColorSwatch color={HANNIBAL_PALETTE.ROME_VIF}       name="ROME_VIF"       usage="pulse danger, accent" />

          <SectionTitle title="ALPES (montagne, mort)" />
          <ColorSwatch color={HANNIBAL_PALETTE.ALPES_NEIGE}    name="ALPES_NEIGE"    usage="blanc neige, sommets" />
          <ColorSwatch color={HANNIBAL_PALETTE.ALPES_ROCHE}    name="ALPES_ROCHE"    usage="gris pierre, parois" />
          <ColorSwatch color={HANNIBAL_PALETTE.ALPES_GLACE}    name="ALPES_GLACE"    usage="glace, zone danger" />

          <SectionTitle title="COMPTEUR / DECAY (perte soldats)" />
          <ColorSwatch color={HANNIBAL_PALETTE.OR_SOLDAT}      name="OR_SOLDAT"      usage="46 000 soldats départ" />
          <ColorSwatch color={HANNIBAL_PALETTE.ROUGE_MORT}     name="ROUGE_MORT"     usage="20 000 arrivée — sang" />
          <ColorSwatch color={HANNIBAL_PALETTE.ELEPHANT_OR}    name="ELEPHANT_OR"    usage="dernier éléphant — pulse" />

          <SectionTitle title="TEXTES / UI" />
          <ColorSwatch color={HANNIBAL_PALETTE.IVOIRE}         name="IVOIRE"         usage="textes principaux" />
          <ColorSwatch color={HANNIBAL_PALETTE.PARCHEMIN}      name="PARCHEMIN"      usage="textes secondaires" />
          <ColorSwatch color={HANNIBAL_PALETTE.METAL_FROID}    name="METAL_FROID"    usage="labels pays, frontières" />

          <SectionTitle title="CARTOUCHES" />
          <ColorSwatch color={HANNIBAL_PALETTE.CARTOUCHE_FOND}   name="CARTOUCHE_FOND"   usage="fond — noir bleuté" />
          <ColorSwatch color={HANNIBAL_PALETTE.CARTOUCHE_BORD}   name="CARTOUCHE_BORD"   usage="bordure ambre" />
          <ColorSwatch color={HANNIBAL_PALETTE.CARTOUCHE_ACCENT} name="CARTOUCHE_ACCENT" usage="accent Carthage" />
        </div>
      </div>

      {/* SECTION TYPOS */}
      <div style={{ marginTop: 14, borderTop: `2px solid ${HANNIBAL_PALETTE.ROUTE_SOMBRE}`, paddingTop: 14 }}>
        <SectionTitle title="TYPOGRAPHIES — exemples" />

        <div style={{
          fontFamily: HANNIBAL_FONTS.TITRE,
          fontSize: HANNIBAL_TYPO.HOOK,
          color: HANNIBAL_PALETTE.IVOIRE,
          letterSpacing: HANNIBAL_LETTERSPACING.TITRE,
          textAlign: "center",
          lineHeight: 1.1,
        }}>
          Quarante-six mille.
        </div>
        <div style={{
          fontFamily: HANNIBAL_FONTS.MONO,
          fontSize: 11,
          color: HANNIBAL_PALETTE.METAL_FROID,
          textAlign: "center",
          marginBottom: 12,
        }}>
          HOOK · Cinzel 84px IVOIRE · lineHeight 1.1
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: HANNIBAL_FONTS.MONO,
              fontSize: HANNIBAL_TYPO.COMPTEUR,
              color: HANNIBAL_PALETTE.OR_SOLDAT,
              fontWeight: 700,
              letterSpacing: HANNIBAL_LETTERSPACING.MONO,
            }}>
              46 000
            </div>
            <div style={{ fontFamily: HANNIBAL_FONTS.MONO, fontSize: 10, color: HANNIBAL_PALETTE.METAL_FROID }}>
              COMPTEUR · Mono 120px OR_SOLDAT
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: HANNIBAL_FONTS.MONO,
              fontSize: HANNIBAL_TYPO.COMPTEUR,
              color: HANNIBAL_PALETTE.ROUGE_MORT,
              fontWeight: 700,
              letterSpacing: HANNIBAL_LETTERSPACING.MONO,
            }}>
              20 000
            </div>
            <div style={{ fontFamily: HANNIBAL_FONTS.MONO, fontSize: 10, color: HANNIBAL_PALETTE.METAL_FROID }}>
              COMPTEUR · Mono 120px ROUGE_MORT
            </div>
          </div>
        </div>

        <div style={{
          fontFamily: HANNIBAL_FONTS.KARAOKE,
          fontSize: HANNIBAL_TYPO.KARAOKE,
          color: HANNIBAL_PALETTE.IVOIRE,
          fontWeight: 800,
          letterSpacing: HANNIBAL_LETTERSPACING.KARAOKE,
          textAlign: "center",
          marginTop: 12,
        }}>
          Vous traverserez les murs de Rome.
        </div>
        <div style={{
          fontFamily: HANNIBAL_FONTS.MONO,
          fontSize: 10,
          color: HANNIBAL_PALETTE.METAL_FROID,
          textAlign: "center",
          marginTop: 4,
        }}>
          KARAOKE · Inter 48px IVOIRE · fontWeight 800
        </div>
      </div>
    </AbsoluteFill>
  );
};
