# STARTER — Reprise personnage-vivant SVG : extension "planter-arbre"

> Contexte complet : `src/projects/_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md`
> § "Deux systèmes distincts : rig capsule = mécanique, personnage Gemini = habillage" (session 2026-07-02).

## Où on en est

Catalogue de 7 gestes du personnage cacao (Gemini) **complet et validé en rendu réel** :
panier à la main, sac à l'épaule, recolte-au-sol, manipuler-objet, passer-objet-main-a-main
(2 personnages), cueillette-arbre, immobile-contemplatif. Tous enregistrés dans `Root.tsx`
(`RND-ProtoGemini*`), tous type-checkés OK, showcase complet rendu et livré.

Plus aucune priorité active sur ce chantier — `NEXT-ACTION.md` § PERSONNAGE VOLUMÉTRIQUE SVG
est maintenant marqué ✅ SYSTÈME GRAVÉ.

## Prochaine extension suggérée (backlog, pas urgent)

`planter-arbre` : **2 personnages**, creuser un trou + déposer un jeune plant. Seul item du
§ "Recettes rapides" de `PERSONNAGE-VIVANT-INDEX.md` encore non transposé côté personnage Gemini
(existe côté GGW en registre différent, à vérifier s'il y a une référence mécanique réutilisable).

## Méthode à suivre (leçons de la session précédente — LIRE avant de coder)

1. **Identifier la mécanique existante d'abord** : grep `carry=`, `bend=`, `objectState`, etc. dans
   `rig/StickRig.tsx` / `rig/poses.ts` / `rig/objectHandling.ts` avant d'inventer un angle. Si le
   geste n'a pas de référence (comme `cueillette-arbre`), le concevoir en calculant les angles par
   trigonométrie, jamais en devinant.
2. **1 pose par appel Gemini**, jamais un lot de plusieurs poses d'un coup (leçon : les instructions
   se perdent au-delà de 2-3 poses cumulées dans un seul prompt).
3. **SVG source littéral en patron**, pas juste l'image PNG rendue — sinon la géométrie du
   personnage dérive entre appels.
4. **⛔ Relire activement les bugs déjà documentés avant de coder un geste similaire** — le bug
   "bras chargé qui suit à tort le grand balancier de marche libre" s'est reproduit 2 fois dans la
   même session malgré avoir été corrigé la 1ère fois. Voir
   `feedback_relire-lecon-avant-geste-similaire.md`. Pour `planter-arbre` (2 personnages qui
   interagissent), vérifier aussi le bug "membre qui hérite à tort d'une rotation de groupe parent"
   (§ recolte-au-sol) et le bug "objet invisible car mauvais ordre de calque" (§ manipuler-objet).
5. **Toujours rendre une image/vidéo et comparer visuellement avant de déclarer "fait"** — plusieurs
   bugs de cette session (bras cassé, objet invisible, personnage hors cadre) n'étaient détectables
   qu'à l'œil, pas dans le code.

## Fichiers de référence

- Doctrine complète : `src/projects/_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md`
  § "Deux systèmes distincts" (tout le détail des 7 gestes + bugs + corrections).
- Composants existants à réutiliser comme patron structurel :
  `src/projects/_rnd/svg-scenes/ProtoGeminiHandoff.tsx` (2 personnages, le plus proche de
  `planter-arbre` en structure).
- Scratch de la session (prompts, SVG bruts, scripts Python) : `out/_rnd/pose-bank-test/`.

## Question ouverte à trancher avec Aziz avant de coder

`planter-arbre` implique de coordonner 2 personnages autour d'une action partagée (creuser +
déposer) — décider si c'est un seul personnage qui fait les 2 actions en séquence, ou 2 personnages
avec des rôles différents (un creuse, l'autre dépose), avant de commencer la transposition.
