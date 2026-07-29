# ARCHIVE — le test « un agent qui dessine ET anime » (2026-07-28)

⛔ **NE PAS RÉUTILISER CE CODE EN PRODUCTION.** Ces deux fichiers sont conservés comme **preuve
matérielle** d'un test dont la conclusion est gravée en doctrine — pas comme une brique.

## Ce que c'est

Un agent Opus 5 en effort **max**, contexte vierge, à qui on a demandé de produire une scène-lieu
vivante **complète** : dessiner le décor ET coder l'animation. La règle n°0 du projet (« le modèle
dessine le statique, NOUS animons ») avait été **levée volontairement** pour mesurer ce qui se
passe quand on ne la respecte pas.

- `SceneVivanteMax16x9.tsx` — **939 lignes** d'animation
- `portFluvialGroups.ts` — **459 lignes** de matière SVG

## La mesure qui compte

**Deux tiers de l'effort sont partis dans la mécanique du mouvement, un tiers dans le dessin.**
Et les 3 passes de correction que l'agent a faites portaient TOUTES sur de la mécanique (brume
floutée, grues mal ancrées, traînée de soleil décalée) — **aucune** sur l'enrichissement du décor.

Résultat : une animation riche (6 couches simultanées, arc nuit→jour, parallaxe, grues à cycle de
levage) sur un décor **pauvre** — hangars réduits à des rectangles à nervures, personnages
illisibles.

Le test suivant (même modèle, même durée, consigne « dessine SEULEMENT ») a produit un décor sans
commune mesure. **Seule la consigne avait changé.**

## Conclusion gravée

Demander l'animation **dégrade activement le dessin** — c'est un arbitrage de budget d'attention
interne au modèle, pas une faiblesse de compétence. C'est une raison neuve qui s'ajoute aux trois
déjà connues pour la règle n°0 (tokens, vitesse, contrôle du rythme).

→ `memory/feedbacks/feedback_partage-decor-animation-personnages.md` (le partage à 3 étages)
→ `memory/doctrines/SVG-SCENES-GENERATIVES.md` § RÈGLE N°0

## Ce qui a remplacé ce test

`src/projects/_rnd/svg-scenes/PortVivant16x9.tsx` + `portDecorGroups.ts` — décor dessiné par
Fable 5 (gagnant d'un test aveugle), animation codée par nous, personnages issus du socle stick
figure. C'est cette scène qui fait référence, pas celle-ci.
