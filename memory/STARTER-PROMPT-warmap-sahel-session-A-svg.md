# Starter — War-Map Sahel AES, Session A (construction SVG)

Reprise War-Map Sahel AES — Session A du plan en 2 sessions (SVG d'abord, intégration+render ensuite).

Lis `memory/episodes/warmap-sahel/STATUS.md` en entier depuis la section
"⛔⛔⛔ REPRISE SESSION SUIVANTE (2026-07-04)" en tête de fichier — c'est la source de vérité complète de
cette reprise (plan 2 sessions, détail des 3 SVG à construire, 16 fixes techniques réservés à la Session B).

Contexte en une phrase : après avoir corrigé un bug critique de trous de frames (session 2026-07-01) et
reçu une 2e vague de retours précis d'Aziz (frame-par-frame, captures à l'appui), la session est devenue
trop longue et a été scindée en 2 : cette session (A) construit/valide 3 inserts SVG narratifs SANS toucher
au reste du code et SANS render complet ; une session B ultérieure appliquera les 16 fixes techniques +
branchera ces SVG + fera LE render final unique.

Étape 0 obligatoire : demander à Aziz comment il veut procéder (système agentique ou en direct), ne pas
présumer.

Les 3 chantiers de cette session, dans l'ordre :

1. **CFA (le plus rapide, déjà codé)** : `src/projects/warmap/parties/CfaRevealSVG.tsx` existe déjà,
   adapté du prototype validé `out/_r-and-d/cfa-svg/cfa-insert-svg-ALT-FINAL.mp4`, branché dans
   `Partie4Cout.tsx` à la place de l'ancien `CfaReveal`. Jamais re-rendu/vu par Aziz. Faire un mini-render
   isolé (composition `SahelPartie4`, `--frames=11860-12200` env., autour de F_CFA=11869) et présenter à
   Aziz pour validation. Si ok → rien d'autre à faire dessus.

2. **Liptako-Gourma (à concevoir de zéro)** : remplace l'encadré `WarMapOverlayDynamic` actuel dans
   `Partie3Rupture.tsx` (inAt=F_BAMAKO=6118, outAt=F_EPREUVE=6800), jugé "peu convaincant". Contenu
   narratif à porter : "16 septembre 2023 · Charte du Liptako-Gourma" + 3 drapeaux (Mali/Burkina/Niger) +
   citation du pacte. Suivre le pipeline `memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md` (agent A→Z, prouvé
   GGW+cargo) et valider l'image-cible AVANT le code (`memory/doctrines/SVG-FAISABILITE-AMONT.md`).

3. **Triple-screen ressources (à concevoir de zéro)** : remplace `ResourcesReveal` dans `Partie4Cout.tsx`
   (ligne ~1057, inAt=F_OR-20≈10647, outAt=F_CONFED-16≈11433), jugé "statique tout le long" malgré son
   animation actuelle. Référence explicite d'Aziz : la dernière scène du Short Cacao (objet central +
   ramifications) — ici un objet central (bloc Sahel/3 pays) avec 3 ramifications vers or (Mali/Burkina) /
   uranium (Niger) / pétrole (Niger). Même pipeline SVG que le point 2.

Règles non-négociables (rappel CLAUDE.md du projet) : 2 appels Gemini MAX par chantier, DA-brief/validation
créative AVANT le code, jamais de render complet bout-en-bout dans cette session (mini-renders isolés
seulement), downscale + review visuelle avant tout Kimi.

Ne pas commencer la Session B (fixes techniques + render final) tant que les 3 SVG ne sont pas validés
par Aziz — c'est le but même du découpage en 2 sessions.
