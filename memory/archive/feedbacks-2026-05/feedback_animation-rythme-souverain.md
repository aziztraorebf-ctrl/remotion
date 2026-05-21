---
name: Règles de rythme animation Souverain (max 5s sans changement)
description: Règle 2-3s vient des shorts TikTok ultra-rapides. Souverain a un débit voix-off lent journalistique → règle 4-5s max sans changement, springs amortis.
type: feedback
---

# Rythme animation Souverain — règle 4-5s

**Validé** : Niger Uranium Beat 3 v2→v3, 2026-05-09 et 2026-05-10.

## Le problème (v2 ancien)

J'avais appliqué la règle "changement toutes les 2-3s max" héritée des shorts TikTok ultra-rapides. Avec la voix-off Souverain (Narratrice GéoAfrique v2, débit lent journalistique), le résultat semblait "courir devant la parole" — visuel frénétique sur audio calme = mismatch perceptif.

## La règle correcte pour Souverain

- **Maximum 5 secondes sans AUCUN changement visuel** (jamais de zone morte)
- **Minimum 2 secondes entre changements majeurs** (laisser respirer)
- **Mouvement permanent toujours présent** (grain shift, breathing, marching ants) — jamais 0 motion
- **Springs amortis** : `damping: 80-100`, `stiffness: 50-70`, `durationInFrames: 25-35` (au lieu de 14/130/22 nerveux)

## Pourquoi

Souverain est documentaire posé. La voix-off raconte calmement, étale les phrases. Le visuel doit matcher ce rythme — éléments qui apparaissent comme "amenés par la voix", pas qui pop avant elle.

Atlas et data-viz Vox/PolyMatter peuvent se permettre 2-3s parce que la voix est rapide et l'audience attend un rythme TikTok. Souverain non.

## Application concrète

**Pour un beat de 14s** : 4-7 événements visuels distincts, chacun calé sur un mot pivot du forced alignment. Permanent motion (grain, breath) entre les événements.

**Pour un beat de 7s** : 3-5 événements, plus serrés mais toujours 1.5s minimum entre eux.

**Pour un beat de 22s** (Beat 4 type bras de fer) : 8-12 événements, rythme dossier qui se construit lentement.

**Why:** Aziz a explicitement dit "peut-être que deux secondes c'est trop juste, peut-être qu'il faudrait monter à maximum 5 secondes selon moi, ça donnerait un rythme plus lent". Confirmé par le résultat Beat 3 v3 qui matchait enfin la voix.

**How to apply:** Pour tout beat Souverain, viser la règle 4-5s max + 2s min. Springs amortis. Permanent motion obligatoire.
