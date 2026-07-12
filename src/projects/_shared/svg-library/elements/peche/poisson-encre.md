# Poisson (encre narrative)

> SVG : `poisson-encre.svg`. Codé à la main (2026-07-04) après échec de 2 essais LLM sur cet objet
> simple (Qwen3.6 : œil mal placé + queue disproportionnée ; GLM-5.2 : timeout, aucune réponse en
> 5min) — leçon : un objet géométrique très simple (ovale + triangle + point) est souvent plus vite
> et plus fiablement codé à la main qu'obtenu par itération de prompt.

## Géométrie

`viewBox="0 0 100 60"`, orienté tête à droite (adapter `transform="scale(-1,1)"` pour tête à gauche).
- Corps : path Bézier ovale allongé (x 30→92, y 14→46).
- Queue : triangle simple à gauche du corps (~25% de la longueur totale — proportion clé, une
  queue trop grande casse la lisibilité de la silhouette).
- Nageoire dorsale : petit triangle sur le dos, vers l'avant du corps.
- Œil : cercle plein, PRÈS de la tête (côté droit, jamais au centre — bug observé sur l'essai Qwen).
- Ligne branchiale : détail simple en arc, opacité réduite (0.6).

## Palette

`fill="#8B5A2B"` (brun-doré, ton terre) / `stroke="#2b2117"` (encre) — cohérent registre encre
narrative standard (`palette.ts`).

## Usage

Objet inerte à l'échelle d'une scène (pas de rig articulé nécessaire) — utile en petit nombre pour
illustrer une capture/pêche (ex. `PecheurSurpeche16x9.tsx`, sortant du filet ou dans une pirogue).
Pour un banc de poissons : dupliquer avec variation d'échelle/rotation légère, pas de nage animée
prévue dans cette version (statique, à faire évoluer si besoin d'un mouvement de nage).
