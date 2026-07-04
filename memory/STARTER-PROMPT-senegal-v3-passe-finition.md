# STARTER — Sénégal V3 : passe de finition du montage complet

> Coller ce prompt en début de session dédiée. Créé 2026-07-04.

---

On reprend la **refonte V3 Sénégal Pétrole & Gaz**. Les 8 scènes sont produites et le montage complet est
assemblé (8min23s). J'ai visionné le montage et relevé une liste de bugs à corriger — on est en PASSE DE
FINITION, tout près de la fin.

**AVANT TOUTE ACTION, lis dans l'ordre :**
1. `memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/REPRISE-PASSE-FINITION.md` ⭐ (la liste complète
   des 10 retours + la cause racine audio + l'ordre suggéré). C'est LA source de vérité de cette passe.
2. `memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md` (état des 8 scènes).
3. `out/episodes/senegal-petrole-gaz/_ASSEMBLAGE-V3.md` (renders finaux + plan de sources).

**Ce qu'on fait cette session :**
1. D'ABORD un PLAN DÉTAILLÉ (chantier par bug), pas de fix direct. Utiliser writing-plans.
2. PRIORITÉ N°1 = les BUGS AUDIO aux raccords (dédoublements + coupures à ~32s, ~1min00, ~2min11, ~5min51).
   ⭐ Ma cause racine suspectée : les mp4 de scènes se CHEVAUCHENT sur le texte (chaque scène inclut/répète
   l'amorce de la suivante) → au concat, la phrase est dite 2×. À DIAGNOSTIQUER : extraire l'audio à chaque
   jonction, comparer au forced-align V3, revérifier les bornes de coupe (startFrom/endAt) scène par scène.
3. Puis : coupure/écran gris avant Mapbox sc.5 (~4min58) · harmoniser la CARTE (style gris clair + typo finale
   décidée en cours de route — Aziz a une capture de réf) sur toutes les scènes carto (sc.2 = ancienne carte
   sombre à refaire) · retirer 2 SFX parasites (~4min15 liquide, ~5min26) · stabiliser le point Dakar qui
   tremble au zoom (sc.5) · retirer le texte "ILS ONT CHOISI LA RUPTURE" (sc.7, épure — drapeaux suffisent).
4. Re-assembler + re-vérifier chaque jonction (audio continu, pas de trou/dédoublement, transitions fluides).
5. Trancher le DYNAMISME : Aziz demande mon avis honnête (analyste, pas cheerleader). Mon pré-avis : niveau
   déjà bon pour un sujet analytique ; ne pas sur-dynamiser ; au plus tester 1-2 respirations sur les
   transitions entre actes, en option, jamais prioritaire sur les bugs.

**Contexte technique (rappels) :**
- sc.6 = `SceneBilanV3.tsx`, sc.7 = `SceneBonusV3.tsx` (code final premium + sources code-main). Autres scènes
  = mp4 finaux dans `out/episodes/senegal-petrole-gaz/scene*-FINAL.mp4` + composants (sc.0/1a dans `_proto-16-9/`,
  sc.1b-5 dans `beats/`).
- Sources incrustées : sc.0-5 par overlay PNG (script `assemble-senegal-v3.sh` — scratchpad éphémère, régénérer
  les cartouches via un gen PIL si perdu ; police DIN Condensed Bold système). sc.6-7 = SourceTag code-main.
  Plan de sources dans REPRISE-PASSE-FINITION + _ASSEMBLAGE-V3. Le 132% dette = FMI nov 2025 (vérifié Tavily).
- Montage complet actuel (à remplacer après fix) : `out/episodes/senegal-petrole-gaz/senegal-petrole-gaz-V3-COMPLET.mp4`
  (+ version web compressée 60 MB). Cible finale après fix → `out/PRET-PUBLICATION/`.
- Thumbnail existe : `out/SHOWCASES/thumbnails-senegal/FINAL-senegal-gemini.png` (à discuter).
- ⚠️ Working tree PARTAGÉ avec une instance war-map (branche `feat/warmap-aes-hook-integration`). Vérifier la
  branche au démarrage ; `git add` CHIRURGICAL sur les seuls fichiers senegal ; ne pas perturber la war-map.
- Système agentique dispo pour les fix parallèles (worktrees) — mais la cause racine audio se diagnostique
  d'abord à la main (c'est du raccord de timing, pas du code de scène).

Objectif de sortie : montage V3 propre, sans bug de raccord, carte harmonisée → `PRET-PUBLICATION`.
