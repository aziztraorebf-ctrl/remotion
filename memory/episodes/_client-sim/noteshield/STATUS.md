# NorthShield (test client simulé) — STATUS

> Test client-sim #2 (SaaS cybersécurité), après Flowdesk. Teste HUMAN + SYSTEM + PRODUCT.
> Brief complet : `memory/client-sim-tests/noteshield/BRIEF-CLIENT.md`. Script voix verrouillé
> (V3) : `src/projects/_client-sim/noteshield/SCRIPT-VOIX.md`. Audio généré, 63.34s.

## État actuel (2026-08-07, fin de session)

- **Direction B pure (100% abstraite) — CLOSE, REJETÉE sur le fond**, pas seulement sur
  l'exécution. v1 codée → rejet unanime (Aziz + jury 4 modèles Gemini/Kimi/GPT/Grok) sur le
  motion ("diaporama statique"). v2 codée (motion corrigé, tous les panneaux vivants en continu,
  vérifiée frame par frame) → **mais Aziz a ensuite identifié un problème plus profond que le
  motion** : le P1 (flux de traits) reformule le cliché "pluie de données" explicitement
  interdit par le brief, et l'absence totale d'incarnation humaine viole la chaîne
  HUMAN→SYSTEM→PRODUCT demandée. Le Semantic Test croisé du même jour portait déjà ce signal
  (A-P1 "compris immédiatement" vs B-P1 "partiellement compris") sans qu'on en tire la
  conséquence sur le moment.
- **Storyboard V3 (mix incarné) — DÉCIDÉ, PAS ENCORE CODÉ** :
  `memory/client-sim-tests/noteshield/STORYBOARD-V3-MIX-INCARNE.md`. 7 panneaux, mix explicite
  Direction A (incarnation, structure pull-back) + Direction B (mécanisme 4 signaux, cascade
  Berlin, signature) + storyboard GPT externe (slider dilemme P2). Personnage Sarah = **MiniMax
  H3** (image-to-video, PAS Seedance — déjà prouvé sur Flowdesk), pas de SVG/silhouette pour
  l'incarnation.

## Code v2 conservé — RÉUTILISABLE tel quel en V3

`src/projects/_client-sim/noteshield/direction-b/` :
- `P2SeuilNait.tsx`, `P3QuatreSignaux.tsx` (P4 en V3), `P6Signature.tsx` (P7 en V3) — gardés
  intacts, jamais remis en cause par aucun retour.
- `../ui/DashboardScreen.tsx` (data-driven, prop `overrideRow` ajoutée en v2), `LaptopMockup.tsx`,
  `VirtualCursor.tsx` — réutilisés pour P5/P6 en V3 (raccord après les plans MiniMax H3).
- P1FluxBlocage.tsx, P4DashboardReveal.tsx (v2), P5DashboardMorphBosse.tsx : la MÉCANIQUE de
  cascade de données + bosse de vigilance de l'ex-P5 v2 est bonne et sera reprise dans le
  nouveau P6 — mais ces 3 fichiers seront largement remplacés par les plans MiniMax H3.
- Render v2 complet de référence (avant pivot) :
  `out/_client-sim/noteshield/wip/direction-b_v2.mp4` (+ override review, palette Souverain du
  script `visual_review.py` non applicable à ce projet — voir les `.review-override.md` à côté).

## Jury LLM sur la v2 motion (conservé, verdicts encore valables sur le MOTION, pas sur le fond)

`out/_client-sim/noteshield/jury/{gemini,kimi,gpt,grok}-verdict.md` — diagnostic motion design
("apparition ≠ animation", rien ne doit rester statique >1s) reste valide pour les futurs
panneaux SVG (P2, P3, P4, P7 en V3). Synthèse : `SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md`.

## Prochaine session — points à trancher AVANT de coder la V3

1. Générer l'image de référence Sarah (Gemini/Recraft, registre 2D flat — PAS photoréaliste)
   — une seule image, réutilisée sur les 3 plans MiniMax H3 (P1, P5, P6).
2. Tester la faisabilité du pull-back caméra en un seul plan H3 (P5) — sinon prévoir un raccord
   vers `LaptopMockup` React existant.
3. Calibrer les durées des 3 plans H3 avant génération (coût ~$1.30/5s en 2K) — prévisualiser
   avant tout appel payant.
4. Recalculer les timings précis des 7 panneaux depuis `narration.alignment.json` (les bornes
   du storyboard V3 sont approximatives, calées sur le sens du texte).
