// PaletteShowcase — affichage visuel de la palette Empire du Ghana
// 1 frame statique, format vertical 1080x1920
// Sert a valider toutes les couleurs + typo + exemples cartouches AVANT production

import React from "react";
import { AbsoluteFill } from "remotion";
import { GHANA_PALETTE, GHANA_FONTS, GHANA_TYPO, GHANA_LETTERSPACING } from "../components/GhanaPalette";

export const PALETTE_SHOWCASE_FRAMES = 30;

const ColorSwatch: React.FC<{ color: string; name: string; usage: string }> = ({ color, name, usage }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
    <div style={{
      width: 60,
      height: 60,
      backgroundColor: color,
      border: "1px solid #5C3A1A",
      marginRight: 16,
      flexShrink: 0,
    }} />
    <div style={{ color: GHANA_PALETTE.PARCHEMIN, fontFamily: GHANA_FONTS.MONO }}>
      <div style={{ fontSize: 14, color: GHANA_PALETTE.OR }}>{name}</div>
      <div style={{ fontSize: 11, color: GHANA_PALETTE.OR_TERNI }}>{color}</div>
      <div style={{ fontSize: 10, color: GHANA_PALETTE.PARCHEMIN, opacity: 0.7 }}>{usage}</div>
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{
    color: GHANA_PALETTE.OR,
    fontFamily: GHANA_FONTS.TITRE,
    fontSize: 22,
    letterSpacing: GHANA_LETTERSPACING.LABEL,
    marginTop: 18,
    marginBottom: 10,
    borderBottom: `1px solid ${GHANA_PALETTE.OR_TERNI}`,
    paddingBottom: 4,
  }}>
    {title}
  </div>
);

export const PaletteShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: GHANA_PALETTE.NOIR_PROFOND, padding: 40 }}>
      {/* Header */}
      <div style={{
        color: GHANA_PALETTE.OR,
        fontFamily: GHANA_FONTS.TITRE,
        fontSize: 48,
        textAlign: "center",
        letterSpacing: GHANA_LETTERSPACING.TITRE,
        marginBottom: 6,
      }}>
        Empire du Ghana
      </div>
      <div style={{
        color: GHANA_PALETTE.OR_TERNI,
        fontFamily: GHANA_FONTS.SERIF,
        fontSize: 18,
        textAlign: "center",
        letterSpacing: GHANA_LETTERSPACING.CARTOUCHE,
        marginBottom: 20,
      }}>
        Palette officielle · v1 · 2026-05-03
      </div>

      {/* Two columns layout */}
      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        {/* COLONNE GAUCHE — couleurs */}
        <div style={{ flex: 1 }}>
          <SectionTitle title="FONDS" />
          <ColorSwatch color={GHANA_PALETTE.NOIR_PROFOND} name="NOIR_PROFOND" usage="background global" />
          <ColorSwatch color={GHANA_PALETTE.SEPIA_FOND} name="SEPIA_FOND" usage="fond carte secondaire" />
          <ColorSwatch color={GHANA_PALETTE.SABLE_NUIT} name="SABLE_NUIT" usage="ellipse desert intérieur" />
          <ColorSwatch color={GHANA_PALETTE.SABLE_DESERT} name="SABLE_DESERT" usage="ellipse desert extérieur" />
          <ColorSwatch color={GHANA_PALETTE.PARCHEMIN} name="PARCHEMIN" usage="textes secondaires" />

          <SectionTitle title="OR (richesse, royaume, caravanes)" />
          <ColorSwatch color={GHANA_PALETTE.OR} name="OR" usage="dore principal — POI, frontières royaumes" />
          <ColorSwatch color={GHANA_PALETTE.OR_VIF} name="OR_VIF" usage="highlights, pulse" />
          <ColorSwatch color={GHANA_PALETTE.OR_TERNI} name="OR_TERNI" usage="labels secondaires" />

          <SectionTitle title="BORDEAUX (alerte, routes, conflit)" />
          <ColorSwatch color={GHANA_PALETTE.BORDEAUX_PROFOND} name="BORDEAUX_PROFOND" usage="routes/frontières d3-geo (recommandation jury)" />
          <ColorSwatch color={GHANA_PALETTE.BORDEAUX} name="BORDEAUX" usage="pulse alerte, conquêtes" />
          <ColorSwatch color={GHANA_PALETTE.BORDEAUX_CHAUD} name="BORDEAUX_CHAUD" usage="climax tragique, effondrement" />
          <ColorSwatch color={GHANA_PALETTE.ROUGE_SANG} name="ROUGE_SANG" usage="gemmes, points critiques" />
        </div>

        {/* COLONNE DROITE — couleurs suite + typos */}
        <div style={{ flex: 1 }}>
          <SectionTitle title="BLEUS (commerce berbère, eau)" />
          <ColorSwatch color={GHANA_PALETTE.INDIGO} name="INDIGO" usage="robe berbère, voile touareg" />
          <ColorSwatch color={GHANA_PALETTE.INDIGO_VIF} name="INDIGO_VIF" usage="pulse berbère, fleuves" />
          <ColorSwatch color={GHANA_PALETTE.BLEU_DESERT} name="BLEU_DESERT" usage="ciel nuit Sahara" />

          <SectionTitle title="TERRACOTTA (banco, terre cuite)" />
          <ColorSwatch color={GHANA_PALETTE.TERRACOTTA} name="TERRACOTTA" usage="terre cuite, voisins Wagadou" />
          <ColorSwatch color={GHANA_PALETTE.TERRACOTTA_CLAIR} name="TERRACOTTA_CLAIR" usage="accent terre cuite" />
          <ColorSwatch color={GHANA_PALETTE.OCRE_BOUBOU} name="OCRE_BOUBOU" usage="robe sahélien" />

          <SectionTitle title="BLANCS (sel, mosquée, banco)" />
          <ColorSwatch color={GHANA_PALETTE.BLANC_SEL} name="BLANC_SEL" usage="sacs de sel, lumière mosquée" />
          <ColorSwatch color={GHANA_PALETTE.BLANC_BANCO} name="BLANC_BANCO" usage="murs banco Koumbi Saleh" />
          <ColorSwatch color={GHANA_PALETTE.BLANC_OS} name="BLANC_OS" usage="textes principaux" />

          <SectionTitle title="GRIS (effondrement, ruines)" />
          <ColorSwatch color={GHANA_PALETTE.GRIS_RUINE} name="GRIS_RUINE" usage="ruines post-effondrement" />
          <ColorSwatch color={GHANA_PALETTE.GRIS_CENDRE} name="GRIS_CENDRE" usage="cendres, désaturation" />
          <ColorSwatch color={GHANA_PALETTE.GRIS_DESATURE} name="GRIS_DESATURE" usage="territoire sécheresse" />
        </div>
      </div>

      {/* SECTION TYPOGRAPHIES — pleine largeur en bas */}
      <div style={{ marginTop: 16, borderTop: `2px solid ${GHANA_PALETTE.OR_TERNI}`, paddingTop: 16 }}>
        <SectionTitle title="TYPOGRAPHIES — exemples" />

        {/* Hook serif */}
        <div style={{
          fontFamily: GHANA_FONTS.TITRE,
          fontSize: GHANA_TYPO.HOOK,
          color: GHANA_PALETTE.OR,
          letterSpacing: GHANA_LETTERSPACING.TITRE,
          textAlign: "center",
          marginTop: 8,
        }}>
          Wagadou.
        </div>
        <div style={{
          fontFamily: GHANA_FONTS.MONO,
          fontSize: 12,
          color: GHANA_PALETTE.OR_TERNI,
          textAlign: "center",
          marginBottom: 16,
        }}>
          HOOK · Cinzel/Cormorant 84px OR · letterSpacing 0.04em
        </div>

        {/* Cartouche */}
        <div style={{
          fontFamily: GHANA_FONTS.SERIF,
          fontSize: GHANA_TYPO.CARTOUCHE_GRAND,
          color: GHANA_PALETTE.PARCHEMIN,
          letterSpacing: GHANA_LETTERSPACING.CARTOUCHE,
          textAlign: "center",
        }}>
          KOUMBI SALEH · CAPITALE · XIᵉ siècle
        </div>
        <div style={{
          fontFamily: GHANA_FONTS.MONO,
          fontSize: 12,
          color: GHANA_PALETTE.OR_TERNI,
          textAlign: "center",
          marginBottom: 16,
        }}>
          CARTOUCHE · Cormorant Garamond 42px PARCHEMIN · letterSpacing 0.08em
        </div>

        {/* Chiffre + Karaoke side by side */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 8 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: GHANA_FONTS.MONO,
              fontSize: GHANA_TYPO.CHIFFRE,
              color: GHANA_PALETTE.OR_VIF,
              fontWeight: 700,
            }}>
              90 kg
            </div>
            <div style={{ fontFamily: GHANA_FONTS.MONO, fontSize: 10, color: GHANA_PALETTE.OR_TERNI }}>
              CHIFFRE-RECORD · Mono 78px OR_VIF
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: GHANA_FONTS.KARAOKE,
              fontSize: GHANA_TYPO.KARAOKE,
              color: GHANA_PALETTE.OR,
              fontWeight: 800,
              letterSpacing: GHANA_LETTERSPACING.KARAOKE,
            }}>
              au gramme près
            </div>
            <div style={{ fontFamily: GHANA_FONTS.MONO, fontSize: 10, color: GHANA_PALETTE.OR_TERNI, marginTop: 4 }}>
              KARAOKE · Inter 48px OR
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
