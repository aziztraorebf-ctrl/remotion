---
name: Aziz préfère Claude code direct vs remotion-composer agent (validé 2026-05-10)
description: Pour les beats à signature visuelle forte ou qui suivent un storyboard précis, Aziz préfère que Claude code lui-même. Le composer reprendra du service après validation que tout fonctionne sans erreurs.
type: feedback
---

# Préférence Aziz — Claude code direct, composer en attente

**Validé** : Session Niger Uranium Jour 6, 2026-05-10.

## Décision

> "Pour l'instant, je préfère me relier sur toi pour le workflow qu'on vient de créer, surtout avec Gemini. Ensuite pour la partie où il faut coder. Peut-être qu'éventuellement on va pouvoir utiliser le Remotion Composer. Mais à premier on doit valider que tout fonctionne comme il faut. Pour ne pas que les erreurs que nous avons vues maintenant se reproduisent à nouveau."

## Contexte

Le remotion-composer agent a livré pour Niger Uranium des beats qui :
- Ignoraient les icônes Gemini générées spécifiquement (utilisait ses icônes built-in)
- Prenaient des libertés avec le storyboard (layouts non-fidèles)
- Utilisaient son propre style sous-titres au lieu du karaoke TikTok Atlas
- Composait avec les défauts des composants au lieu de customiser

Beat 2, 3, 7 ont dû être réécrits par Claude principal.

## Workflow validé

**Pipeline Niger Uranium qui a marché :**
1. Storyboard Gemini i2i avec refs Or Africain
2. Gemini 3.1-pro breakdown technique (JSON avec coords, hex, timeline)
3. Gemini 3.1-flash-image génère assets manquants
4. **Claude principal code le beat en suivant le JSON à la lettre**
5. Render + review + itération

## Quand le composer reprendra du service

Conditions à valider :
- Le composer doit charger les assets spécifiques générés (icônes Gemini, etc.) — pas ses defaults
- Le composer doit suivre le storyboard pixel-près, pas juste l'esprit
- Le composer doit utiliser le composant Subtitles Atlas standard, pas inventer un style
- Le composer doit respecter la règle 4-5s max Souverain

Tant qu'on n'a pas validé ces points, **Claude code directement**.

**Why:** La frustration de la session Jour 6 venait des libertés du composer. Documenter cette préférence évite de re-déléguer trop tôt.

**How to apply:** Pour les prochaines productions Souverain, default sur Claude code direct. Le composer ne sera invoqué qu'après une session test où on validera explicitement qu'il respecte les contraintes ci-dessus.
