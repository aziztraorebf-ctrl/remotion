# Prompt de reprise — NorthShield Storyboard V3 (mix incarné)

Copier-coller ce prompt pour reprendre le chantier NorthShield à la prochaine session.

---

On reprend le chantier client-sim NorthShield (SaaS cybersécurité, test positionnement
freelance). La Direction B pure (100% abstraite) a été codée deux fois (v1 puis v2, motion
corrigé après rejet unanime d'un jury à 4 modèles LLM) mais **rejetée sur le fond** après
visionnage : le flux du panneau 1 reformule le cliché "pluie de données" interdit par le brief
client, et l'absence totale d'incarnation humaine viole la chaîne HUMAN→SYSTEM→PRODUCT demandée.

**Décision prise : storyboard V3 mixte, 7 panneaux**, combinant Direction A (incarnation,
structure de pull-back), Direction B (mécanisme des 4 signaux, cascade Berlin, signature — tout
ça fonctionnait déjà bien et est conservé), et deux apports d'un storyboard généré en externe par
GPT (slider "trop strict/trop laxe" en P2, ancrage produit plus visible). Le personnage Sarah sera
incarné via **MiniMax H3** (image-to-video, PAS Seedance — déjà prouvé sur Flowdesk), pas en
SVG/silhouette.

Lire dans cet ordre avant de commencer :
1. `memory/episodes/_client-sim/noteshield/STATUS.md` — état exact, ce qui est gardé vs à
   remplacer, ce qui reste à trancher.
2. `memory/client-sim-tests/noteshield/STORYBOARD-V3-MIX-INCARNE.md` — le storyboard complet
   panneau par panneau (INFORMATION/REPRÉSENTATION/MEDIUM/SEMANTIC TEST + moteur tranché pour
   chacun : SVG maison vs MiniMax H3).
3. `memory/tools/minimax.md` § MiniMax H3 — détail technique du pipeline image-to-video (coût,
   limitations, pattern déjà validé sur Flowdesk).

Fichiers de code à réutiliser TELS QUELS (ne pas recoder) :
- `src/projects/_client-sim/noteshield/direction-b/P2SeuilNait.tsx`,
  `P3QuatreSignaux.tsx` (devient P4 en V3), `P6Signature.tsx` (devient P7 en V3).
- `src/projects/_client-sim/noteshield/ui/DashboardScreen.tsx` (prop `overrideRow`),
  `LaptopMockup.tsx`, `VirtualCursor.tsx`.

Fichiers à REMPLACER par les nouveaux plans MiniMax H3 (garder la mécanique de cascade de
données de l'ex-P5 v2, juste le support change) :
- `P1FluxBlocage.tsx`, `P4DashboardReveal.tsx`, `P5DashboardMorphBosse.tsx`.

4 points à trancher AVANT de coder quoi que ce soit :
1. Générer l'image de référence Sarah (Gemini/Recraft, registre 2D flat — PAS photoréaliste),
   une seule image réutilisée sur les 3 plans H3 (P1, P5, P6) pour la cohérence du personnage.
2. Tester si le pull-back caméra (P5) est crédible en un seul plan H3, sinon prévoir un raccord
   vers `LaptopMockup` React.
3. Calibrer les durées des 3 plans H3 avant génération (coût ~$1.30/5s en 2K) — prévisualiser
   avant tout appel payant.
4. Recalculer les timings précis des 7 panneaux depuis `narration.alignment.json`.

Script voix verrouillé (V3, ne pas retoucher) : `src/projects/_client-sim/noteshield/SCRIPT-VOIX.md`.
Audio déjà généré, 63.34s. Brief client original : `memory/client-sim-tests/noteshield/BRIEF-CLIENT.md`.
