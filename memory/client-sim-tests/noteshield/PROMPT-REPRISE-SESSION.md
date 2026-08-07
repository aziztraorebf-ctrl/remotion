# Prompt de reprise — NorthShield Direction B (animation)

Copier-coller ce prompt pour reprendre le chantier NorthShield à la prochaine session.

---

On reprend le chantier client-sim NorthShield (SaaS cybersécurité, test positionnement freelance).
Le design de Direction B (System/Conceptual, métaphore "le seuil qui respire") est **entièrement
figé** — storyboard complet P1-P6, Mix & Match tranché, Semantic Test validé, P1 corrigé (capture
maintenant l'événement barre+embouteillage, pas un état neutre). Reste à FAIRE : coder l'animation
Remotion.

Lire dans cet ordre avant de commencer :
1. `memory/client-sim-tests/noteshield/PLAN-ANIMATION-DIRECTION-B.md` — le plan technique complet
   (timing exact par panneau, groupes SVG réels, technique d'animation recommandée par panneau,
   ordre de codage conseillé : P1 → P3 → P2/P6 → P4/P5 → assemblage).
2. `memory/client-sim-tests/noteshield/MIX-AND-MATCH-DIRECTION-B.md` — pourquoi chaque choix
   design a été retenu (utile si une retouche est nécessaire en cours de codage).
3. `memory/client-sim-tests/INDEX.md` § "Outils & pièges techniques" — 3 pièges déjà rencontrés et
   résolus cette session (script narratif vs abstrait, mode MAX Fable à répéter à chaque appel,
   capturer l'événement pas l'état) — à ne pas re-découvrir si un nouveau visuel doit être régénéré.

Fichiers sources prêts à l'emploi :
- `public/_rnd/fable-svg/northshield-direction-b/` — 6 SVG JSON (P1 v3, P2, P3, P5, P6 avec
  fusions Mix & Match déjà appliquées).
- `src/projects/_client-sim/noteshield/ui/` — `DashboardScreen.tsx`, `LaptopMockup.tsx`,
  `VirtualCursor.tsx` + `CursorTestComp.tsx` (prototype souris validé, pas encore intégré).
- `src/projects/_client-sim/noteshield/audio/narration.alignment.json` — timing mot-par-mot.
- ✅ **`src/projects/_client-sim/noteshield/direction-b/` — P1 DÉJÀ CODÉ** (`P1FluxBlocage.tsx`,
  compile propre, `tsc --noEmit -p tsconfig.json` sans erreur). Implémente exactement le plan :
  extraction des groupes SVG Fable v3 via `svgGroupExtractor.ts` (pattern repris de
  `src/projects/_rnd/svg-scenes/PiliersGouffre16x9.tsx`), timings calés sur les mots-clés
  "ralentit"/"doigts" de l'alignment audio, `flux_arrivant`/`flux_bloque` pilotés par opacité (pas
  d'interpolation entre 2 fichiers SVG séparés, cf plan). **Vérifier ce fichier en premier avant
  de recoder P1** — un render de contrôle (`npx remotion render` ou still sur quelques frames) n'a
  PAS encore été fait, à faire avant de continuer sur P2-P6.

Explicitement HORS SCOPE pour cette session (décision Aziz) : intégration complète souris virtuelle
+ SFX — à faire APRÈS une première version complète de la vidéo, pas avant.

Objectif de la session : avoir une composition Remotion assemblée avec les 6 panneaux dans les
bonnes `<Sequence>`, animée selon le plan, prête pour une première passe de review visuelle.
