---
name: Remotion-composer prend des libertés vs storyboard — limites by design
description: Le remotion-composer agent compose à partir des défauts de la lib, ne re-customise pas chaque composant pour matcher un storyboard précis. Pour matcher un storyboard pixel-près, Claude principal code lui-même.
type: feedback
---

# Remotion-composer agent — limites observées

**Validé** : 2026-05-09 sur production Niger Uranium beats 2, 3, 7.

## Le problème observé

Storyboard Gemini Niger Uranium V2 montrait :
- Beat 2 : pills gold/terracotta + chiffres massifs data-viz Vox/PolyMatter
- Beat 3 : 3 icônes Gemini (Capitole or, derrick, 3 cercles) sur fond kraft sombre
- Beat 7 : feuille kraft pleine page + tampon CONTESTÉ + pièce d'échecs

Le remotion-composer a livré :
- Beat 2 : tableau classique 2 colonnes étroites avec libellés type fiche Wikipédia
- Beat 3 : EntityDiagram default avec icônes built-in (temple grec, usine flat) — **les 4 icônes Gemini générées sont ignorées**
- Beat 7 : polaroid navy collé sur kraft + mini-tampon coin, pas de pièce d'échecs
- Sous-titres : style mot-à-mot fond noir par mot, pas le karaoke TikTok habituel

**Résultat narratif** : Beat 3 = nodes apparaissent en 5s premières, puis 5s strictement statiques = mort par ennui.

## Pourquoi (cause structurelle)

Le remotion-composer agent est conçu pour **composer rapidement à partir des composants existants de la lib** :
- Il prend les composants tels quels avec leurs styles par défaut
- Il les enchaîne dans des Sequence
- Il ne re-customise PAS chaque composant pour matcher un storyboard précis

C'est sa limite **by design**, pas un bug.

Le storyboard Gemini, lui, est conçu **sans connaître les contraintes des composants existants** — il invente des layouts idéaux qui demanderaient du code custom.

## Règle pour futures productions

**Quand utiliser remotion-composer :**
- Beats simples qui peuvent réutiliser les composants tels quels
- Premier draft rapide pour valider l'architecture globale + timing
- Quand le storyboard est volontairement abstrait

**Quand Claude principal code lui-même :**
- Storyboard avec layouts customs (pills énormes, fond kraft pleine page, métaphores visuelles)
- Beats nécessitant des animations étalées sur la durée totale (pas tout dans les 5 premières secondes)
- Quand on a généré des assets spécifiques (icônes Gemini, photos B&W) qui doivent être chargés
- Sous-titres style TikTok karaoke (style Atlas Sonjata/Mansa Moussa)
- Production Souverain où la signature visuelle prime

**Why:** Claude principal voit les storyboards ET le code en même temps. L'agent ne voit que le brief textuel. Claude peut itérer 5-10 fois dans la même session, customiser chaque composant, charger les assets spécifiques, matcher le storyboard pixel-près.

**How to apply:** Pour toute prod Souverain à partir du 2026-05-10 : si le storyboard montre un layout custom ou si on a généré des assets spécifiques pour un beat, Claude code directement le beat plutôt que déléguer. Le pipeline 6 étapes reste valide pour le squelette (timing, audio, assets, validation), mais l'étape 5 (composition) bascule sur Claude pour les beats à signature visuelle forte.
