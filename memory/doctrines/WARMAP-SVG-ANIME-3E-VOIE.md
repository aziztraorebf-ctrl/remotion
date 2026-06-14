---
name: War-Map — SVG animé par code = la 3e voie d'animation (avant Gemini/PixelLab)
description: Pour les formes géométriques simples + déformation (drapeaux, tissus, ondes, tracés, jauges, flux), le SVG animé frame-driven (Remotion) est SUPÉRIEUR à PixelLab : net full HD, nos couleurs exactes, zéro coût, zéro risque. À proposer EN PREMIER pour rendre une scène vivante. Validé Aziz 2026-06-14 (drapeau touareg ondulant Ph5 Sahel).
type: project
---

# La 3e voie : SVG animé par code (décision Aziz 2026-06-14)

La doctrine [[WARMAP-OBJETS-GEMINI-VS-PIXELLAB]] opposait Gemini (objets nets) vs PixelLab (effets
organiques). Elle OUBLIAIT une 3e voie, la nôtre, souvent la meilleure : **l'animation SVG procédurale
frame-driven** (déformation de chemins via interpolate/Math.sin, par frame). Déclencheur : le drapeau
touareg de l'Azawad qui ondule sur Kidal (Ph5 Sahel) — Aziz : "ça me fait penser aux animations que
PixelLab lui-même aurait faites. Pourquoi ne pas me l'avoir dit plus tôt ?".

## La règle de priorité (à appliquer pour TOUTE passe "rendre vivant")

Avant de générer quoi que ce soit (Gemini/PixelLab), se demander : **"est-ce une forme simple + une
déformation / un tracé / une pulsation ?"** Si OUI → **SVG animé par code**. C'est le réflexe par défaut.

| Besoin | Outil | Pourquoi |
|---|---|---|
| **Drapeau/fanion/voile/tissu qui ondule** | **SVG animé** | déformation sinusoïdale de paths. Net full HD, nos couleurs, 0 coût, 0 risque. PROUVÉ. |
| **Ondes** (radio, choc, propagation, halo pulsant) | **SVG animé** | cercles concentriques animés. PROUVÉ (Ph4/Ph5). |
| **Tracés qui se dessinent** (frontières, routes, flux, pipelines) | **SVG animé** | stroke-dashoffset. Déjà dans warmapPremiumKit (countryOutline). |
| **Jauges/barres/compteurs/flux de points** le long d'un chemin | **SVG animé** | interpolate sur largeur/position. |
| **Fumée/flammes STYLISÉES simples** (formes qui montent/vacillent) | **SVG animé** | si on veut du stylisé charte, pas du photoréaliste. |
| **Effet organique CHAOTIQUE DENSE** (vraie explosion, vraie fumée volumétrique) | **PixelLab** (ou fx-* existants) | le pixel se fond dans le chaos ; on a déjà fx-explosion + fx-smoke. |
| **Sprite à identité / trait fin** (jeton-portrait, sprite-lieu, véhicule détaillé) | **Gemini** | le trait net que le pixel/SVG dégraderait. |
| **Effet DIFFUS** (poussière au sol, brume éparse, top-down) | **PERSONNE** | ni SVG ni PixelLab ne le rendent (leçon poussière 2.1 + test ambient 2026-06-14). Renoncer. |

## Garde-fous (héritent de la doctrine objets)
- **Mouvement = intention OU ambiant ancré.** Un drapeau qui ondule = ambiant ancré à un lieu tenu = légitime.
  Une particule qui dérive sans ancrage = rejeté (leçon 2026-06-14).
- **Ambiant = boucle (jamais figé). Ponctuel = one-shot + fade (jamais boucler).** (cf. doctrine objets)
- **Max 2 mouvements simultanés**, 20% d'écran toujours "vide". Ne pas transformer la carte d'analyse en
  sapin de Noël (garde-fou DA-brief P3 Gemini+Kimi, 2026-06-14).
- **Taille ANCRÉE CARTE** (R-OBJ-1) : dimensionner via spriteMapWidth (degrés), jamais vmin fixe.

## Recette technique du drapeau ondulant (réutilisable — Ph5 Partie3Rupture.tsx)
Voile = N colonnes (seg=5), chaque bord supérieur/inférieur décalé par `Math.sin(frame*k + i*phase)*amp`,
bandes = paths fermés entre yTop et yBot. Hampe = line encre + cap. Ombre = feDropShadow #1A1005.
Apparition/sortie = interpolate sur opacité. Couleurs DÉSATURÉES (charte parchemin, anti AI-slop).
Voir `src/projects/warmap/parties/Partie3Rupture.tsx` (bloc "DRAPEAU TOUAREG ondulant").

Voir aussi : [[WARMAP-OBJETS-GEMINI-VS-PIXELLAB]] (partage Gemini/PixelLab) + la doctrine causale
WARMAP-GRAMMAIRE-CAUSALE (cause avant effet).
