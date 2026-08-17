# INSERT / SCÈNE SVG NARRATIVE — fiche de déclenchement
> Injectée avant d'écrire du SVG dessiné dans un `.tsx`. Cause d'échec n°1 mesurée : **brique existante non trouvée** (6 cas, ~20 itérations perdues).
> ⚠️ Si ce que tu lis ici ne correspond PAS au code que tu as sous les yeux : **c'est la fiche qui a tort**. Corrige-la immédiatement, ne contourne pas.
> Dernière vérification contre le code : 2026-08-17.

## BRIQUES EXISTANTES — vérifier AVANT de coder
Ouvrir dans cet ordre, **lire chaque liste jusqu'au bout** (une brique en fin de liste a été ratée par 3 agents sur 3) :
1. `src/projects/_shared/INTENTION-FORME-INDEX.md` — porte d'entrée, APRÈS avoir déduit l'intention (1 verbe).
2. `src/projects/_shared/svg-library/INTENTION-FORME-SVG.md` — « comment faire X ? » → technique/élément.
3. `src/projects/_shared/svg-library/SVG-LIBRARY-INDEX.md` — éléments `.svg`/`.tsx` + techniques (`techniques/`, `motion.ts`, `palette.ts`).
4. `src/projects/_shared/COMPOSANTS-INDEX.md` · `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` — inserts, jetons, état-major.
5. Personnages : `src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` + `habillage.ts` + `identite/Roles.tsx` (4 rôles + 7 objets, clé en main). Aussi `personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md`.
6. Géo : `public/_shared/geo-data/countries-50m.json` (Natural Earth 50m).
⚠️ Un catalogue qui affirme une ABSENCE est faillible : vérifier par `ls` + `git ls-files` + `git log --all -- <nom>` (un registre « canonique » peut vivre sur une branche R&D jamais mergée — 4 occurrences). Un nom trouvé 2× (`find src -name '<Nom>*'`) = piège d'import.

## INTERDITS — erreurs déjà payées
- ⛔ Dessiner un contour de pays/région à main levée ou depuis un `svg_path` de LLM → **utiliser d3-geo + Natural Earth** — Zimbabwe méconnaissable, 2 cas.
- ⛔ Relier deux points géo en ligne droite (tracé, pipeline, flux) → grep le tracé dans `src/projects/` — TSGP raccourci, sautait le Niger.
- ⛔ Animer `viewBox` pour une caméra → `<g transform="translate(cx,cy) scale(k) translate(-cx,-cy)">`, viewBox FIXE — croyance « pas de caméra en SVG ».
- ⛔ Faire glisser un objet INERTE (lingot, coffre, bâtiment) → fade/couleur/illumination sur place ; seuls les véhicules glissent — glissement sans but.
- ⛔ Deviner un `transform` de mécanisme (porte, couvercle, bras, engrenage) puis corriger au render — coffre-fort : 5 tentatives, 2 sessions.
- ⛔ Improviser un habillage de stick figure au lieu de `bodyPoints()`/`RoleTenue` — 3 tentatives + 1 agent, torse totalement occulté.
- ⛔ Vêtement ancré dans le repère du monde → il dérive et remonte sur le visage — bug `PersonnageRole` en production.
- ⛔ Inventer une pose/geste par tâtonnement sans balayer TOUT le registre — 2 agents, 8 variantes, la pose existait déjà.
- ⛔ Choisir un asset par ressemblance de nom sans lire sa ligne d'usage fléchée (⭐) — conduite PLEINE pour dire la pénurie.
- ⛔ Citer une brique de référence puis en réécrire une variante « dans le même esprit » — globe D3 rejeté 2×, palette et caméra dégradées.
- ⛔ Demander à un modèle (Fable/Kimi/GLM/GPT) de coder l'animation — mesuré : 939 lignes d'anim contre 459 de dessin, décor pauvre.
- ⛔ Écrire un `.tsx` de scène sans `// MOTEUR: <registre>` en tête — bloqué par `.claude/hooks/moteur-visuel-gate.sh`.

## RÉFLEXES
- **INTENTION (1 verbe : ce qu'on veut faire RESSENTIR) → FORME → MOTEUR → TEMPLATE.** Jamais partir du catalogue : c'est le piège des 10 essais.
- **Le modèle dessine le DÉCOR (SVG statique en `<g id>` nommés) · nous animons l'AMBIANCE · nos briques prennent les PERSONNAGES.** Fable 5 = générateur SVG par défaut (agent Claude Code, zéro API) ; mode MAX pour narratif/organique/visage.
- **Scène à personnage : choisir le RÉGIME d'abord** — DÉMONSTRATIF (1 corps qui EST l'argument) > AMBIANT (décor coûteux).
- **Mécanisme : modéliser par calcul AVANT le JSX.** Poser le pivot, calculer la position à 0/50/100 %, vérifier que l'ancrage ne bouge pas. Préférer `scale(sx,1)` autour d'un bord fixe à `rotate()` (zéro débordement par construction). Le render CONFIRME, il ne DÉCOUVRE pas.
- **Calcul et rendu prouvent des choses différentes** : le calcul prouve les INVARIANTS (bornes, fenêtres de temps, conservation, non-collision), le rendu prouve la CRÉDIBILITÉ (ancrage, occlusion, profondeur, lecture). Faire les deux.
- **Juger un mouvement sur des frames CONSÉCUTIVES** (33 ms à 30 fps), jamais une frame isolée : la dérive est invisible sur une image fixe.
- **Réutiliser = importer le composant/les VALEURS exacts** (grep les amplitudes déjà validées), pas recopier le principe. Si le composant n'est pas exporté, l'exporter depuis la source plutôt que dupliquer.
- **Avant de réutiliser une brique héritée : la RENDRE et la REGARDER**, et grep `VERDICT|REJET` dans le breakdown de l'épisode. Un décor jamais vu est une dette, pas un acquis.
- **Épaisseurs de trait à diviser par le zoom** (`width / camScale`), et construire la scène PLUS LARGE que le cadre final.

## SI ÇA RATE 2×
Au **2e échec sur le même défaut** (y compris un rendu rejeté 2× sur le même symptôme décrit) : ⛔ STOP, ne pas re-doser une 3e valeur (amplitude, timing, pivot).
1. **Mesurer objectivement** plutôt que juger à l'œil : script qui chiffre le symptôme (bbox projetée, diamètre sur N frames, écart d'ancrage par cycle). Vécu : 4 itérations de dosage caméra alors qu'un câblage figé se mesurait en une passe.
2. **Reverse engineering d'abord** : `git log --all`, grep du registre/doctrine — le problème a souvent déjà été résolu ici.
3. **Déléguer à un agent dédié frais** (Opus, `run_in_background: true`) qui RAPPORTE la cause racine sans appliquer le fix.
4. Un rapport d'agent n'est pas une preuve : vérifier `git diff` et le fichier sur disque avant d'accepter un « terminé ».
