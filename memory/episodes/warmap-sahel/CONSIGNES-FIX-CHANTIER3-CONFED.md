---
name: Consignes fix Chantier 3 (Confédération AES) — P4
description: Diagnostic + consignes claires pour refaire la scène Confédération de la P4 (Partie4Cout.tsx, F_CONFED 11449 -> F_CFA 11869). Écrit par l'instance P4 pour l'instance qui fixe.
type: project
---

# FIX CHANTIER 3 — CONFÉDÉRATION AES (P4) — consignes pour l'instance qui reprend

> Écrit 2026-06-14 par l'instance qui a codé la P4. Aziz a montré une frame (~f11640) jugée ratée.
> Cette scène = **Chantier 3 du PLAN-REFONTE-P4.md**, JAMAIS validée. Code : `src/projects/warmap/parties/Partie4Cout.tsx`.

## OÙ EST LA SCÈNE
- Frames **F_CONFED 11449 → F_CFA 11869** (~14s). Narration : "confédération / force / Niamey / Barkhane".
- Code : `Partie4Cout.tsx` — section "M3 Ph7" (l.~317-470 = fils convergents + fusion or + onde) + sceau (l.~564)
  + overlay confed `WarMapOverlayDynamic` (l.~661).
- Moteur : `sahel-fill` repassé à `SAHEL_COLORS.land` en partie4 (`SahelWarMapEngine.tsx` l.~1624-1633).

## LES 4 PROBLÈMES (diagnostic vérifié dans le code) + LE FIX

### 1. FOND JAUNE PISSEUX (au lieu du parchemin gris-blanc habituel)
- CAUSE : le remplissage `fuseT` des 3 pays est à `opacity fuseT*0.40` en `mixBlendMode:"multiply"` (l.~465).
  À 0.40 multiply sur le land clair → jaune sale. Se cumule avec le sahel-fill land.
- FIX : baisser l'opacité du fill or (≈0.15-0.22 max) OU le remplacer par un **dégradé or très subtil + contour or
  ÉPAIS** (le contour porte le sens "bloc soudé", pas le fill). L'or doit être NOBLE, pas jaune pisseux. Tester en
  full HD (le scale 0.5 trompe sur les teintes). Garder la charte parchemin : le fond NE doit PAS virer jaune.

### 2. SCEAU / "QG" MOU + CARRÉ BLANC (icon-sceau-confederation.png sur Niamey, l.~564)
- CAUSE : asset basse-déf + **fond non détouré** (carré blanc, même crime que town-td) + posé brut, détonne.
- FIX (2 options, choix Aziz) :
  a. **DÉTOURER** l'asset (flood-fill alpha comme on a fait pour town-td-cut.png — script PIL, voir historique P4)
     PUIS l'intégrer (ombre portée, halo or à l'impact). MAIS s'il reste mou même détouré → option b.
  b. ⭐ RECOMMANDÉ (3e voie, cf. WARMAP-SVG-ANIME-3E-VOIE.md) : **dessiner le sceau en SVG/Lucide** au lieu de
     l'image. Un sceau = cercle or + étoile/embleme Lucide (ex. `Star`, `Shield`, `Landmark`) + anneau + texte
     gravé. Net full HD, zéro détourage, charte exacte. C'est EXACTEMENT le cas d'usage de la 3e voie.
- NB : ce n'est PAS un "QG de base", c'est le SCEAU de la confédération (tampon). Ne pas le présenter comme une base.

### 3. OVERLAY "2024 · Confédération AES / FORCE ARMÉE COMMUNE" (l.~661)
- CAUSE : cartouche texte qui RÉPÈTE la voix (tell, pas show) = ressemble à un sous-titre. Était `semitransp`,
  déjà passé `mode="card"` par l'instance fix (bien : card = opaque sans voile, banni semitransp respecté).
- FIX : DÉCISION ÉDITORIALE (à trancher avec Aziz). La confédération = info SPATIALE → doctrine = la MONTRER sur
  la carte (fusion or + frontières internes qui s'effacent + sceau), PAS un cartouche qui répète. Options :
  a. ⭐ SUPPRIMER l'overlay : la fusion or + le sceau + une petite **date "2024" gravée près du sceau** suffisent.
  b. Garder une plaque-DATE minimale ("2024") ancrée au sceau, SANS le texte redondant "force armée commune".
  Ne PAS garder un gros cartouche-sous-titre central qui répète la narration.

### 4. LA SCÈNE EST PAUVRE / STATIQUE ("12 secondes, ça ne peut pas être rien")
- C'est le vrai fond : la scène manque de RÉCIT visuel causal. Refaire selon PLAN-REFONTE-P4 Chantier 3 :
  - 3 countryOutline se dessinent → passent à l'OR (flash) · frontières INTERNES s'effacent (op→0) · contours
    EXTERNES fusionnent en 1 ligne OR épaisse englobant les 3 · sceau TOMBE sur Niamey (tampon + poussière +
    ombre portée) · onde d'union / signal radio QG→capitales (déjà partiellement codé : beamsT/unionWave).
  - CFA = marqueur léger + fil Sahel→Paris (PAS l'overlay plein écran mort — déjà à refaire).
  - ⚠️ Le pitch 45° du plan d'origine = À NE PAS FAIRE (décision Aziz : pas de pitch sur P4, top-down. Voir
    PLAN-REFONTE-P4 "ANGLE MORT pitch"). Garder top-down, relief par épaisseur/opacité/halo.

## RÈGLES DE CETTE SESSION À RESPECTER (sinon on refait en boucle)
1. ⛔ `mode="semitransp"` BANNI (WARMAP-GRAMMAIRE-CAUSALE renforcée 2026-06-14). Opaque (`card`/`fullscreen`) ou SUR la carte.
2. ⭐ 3e voie TOUJOURS envisagée AVANT un asset : icônes Lucide + formes SVG dessinées maison + anim maison
   (cf. WARMAP-SVG-ANIME-3E-VOIE.md). Le sceau mou = cas d'école pour la 3e voie.
3. Pas de pitch sur P4 (top-down, décision Aziz). Relief = profondeur 2.5D / épaisseur / halo, pas inclinaison.
4. Netteté = JUGER EN FULL HD (scale 1). Le scale 0.5 floute et fausse les teintes (le jaune paraîtra pire/mieux).
5. DA-brief upstream + synthèse extractive tracée AVANT de recoder (Gemini+Kimi+DeepSeek), la boîte à outils du
   da-brief.py inclut maintenant Lucide + SVG maison → les modèles peuvent proposer la 3e voie.
6. Détourage : si on garde une image, flood-fill alpha (cf. town-td-cut.png / leader-mali-cut.png déjà faits).

## RÉFÉRENCE — ce qui a MARCHÉ au Chantier 1 (même grammaire à réappliquer)
Exode validé full HD (`p4-c1-exode-FINAL.mp4`) : villes Lucide MapPin, jetons cohortes, sillage wet-ink, cartouche
coût CENTRAL OPAQUE (countup + icônes-personnes). Même niveau d'exigence attendu pour la confédération.
