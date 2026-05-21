---
name: Kimi K2.5 vs Gemini 3.1-pro vision — rôles complémentaires, pas interchangeables
description: Distinction entre reviewer rétrospectif (Kimi) et planificateur prospectif (Gemini 3.1-pro). Les deux outils servent à des étapes différentes du pipeline Souverain. Ne pas remplacer l'un par l'autre sans test contrôlé.
type: reference
---

# Kimi K2.5 vs Gemini 3.1-pro — rôles distincts dans le pipeline

**Question Aziz Jour 7 (2026-05-10) :** *"quelle est la différence majeure entre Gemini 3.1-pro et Kimi 2.6 pour la vision ? Est-ce que les deux sont complémentaires ou est-ce que Gemini fait tout ce que Kimi fait, mais peut-être encore mieux ?"*

## TL;DR

Les deux modèles ne font pas la même tâche dans le pipeline. Kimi est un **reviewer rétrospectif** (il regarde un livrable fini et liste les défauts). Gemini 3.1-pro est un **planificateur prospectif** (il regarde une intention et produit un plan d'exécution structuré JSON).

Ce sont deux étapes différentes du pipeline Souverain, pas deux outils interchangeables.

## Pipeline Souverain canonique — où chaque outil intervient

```
Étape 1  Storyboard image          Gemini 3.1-flash-image-preview (i2i)
          ↓
Étape 2  Plan JSON breakdown        Gemini 3.1-pro-preview (multimodal)   ← PROSPECTIF
          ↓
Étape 3  Génération assets          Gemini 3.1-flash-image-preview
          ↓
Étape 4  Code Remotion              Claude principal
          ↓
Étape 5  Render Remotion            Mapbox WebGL via render-mapbox.sh
          ↓
Étape 6  Review technique            Kimi K2.5 (Moonshot API)              ← RÉTROSPECTIF
          ↓
Étape 7  Validation Aziz            Humain
```

## Kimi K2.5 — reviewer rétrospectif

**Mode d'emploi** : on lui envoie un livrable fini (image PNG, frame vidéo, ou clip MP4) en base64 + un brief de ce qu'on a observé. Il regarde, liste les artefacts détectés, score un go/no-go.

**Script projet** : `scripts/review_with_kimi.py`

**API** : Moonshot, modèle `kimi-k2.5`, base64 obligatoire, `max_tokens: 16000`, NE PAS spécifier `temperature` (laisser default).

**Cas d'usage validés** :
- Detection morphing visages sur clips Seedance/Kling
- Validation drift de style sur sorties Gemini i2i
- Review composition d'un beat Remotion fini avant validation Aziz
- Détection texte parasite, éléments hors-cadre, hands déformées

**Forces** :
- Détection d'artefacts subtils (hands, textures, drift narratif)
- Réponse libre en français/anglais
- Rapide et pas cher
- "Second œil" indépendant

**Limites** :
- Sortie texte non-structurée (à parser)
- Pas conçu pour planifier — juste pour évaluer

## Gemini 3.1-pro vision — planificateur prospectif

**Mode d'emploi** : on lui envoie une image storyboard + un prompt structuré avec contraintes (audio cues frame-précis, voix-off, durée, assets existants). Il retourne un JSON exécutable avec coords absolues, hex codes, timings, fidelity warnings.

**Script projet** : `/tmp/beat3_breakdown_v2.py`, `/tmp/breakdown_b2_b7.py` (réutilisables)

**API** : Google AI Studio, modèle `gemini-3.1-pro-preview`, multimodal (image + text)

**Cas d'usage validés** :
- Breakdown technique de storyboards Souverain (Beats 2, 3, 5, 7 Niger uranium)
- Mapping mot-pivot → frame depuis forced alignment
- Identification proactive des warnings de fidélité (ex: "les arcs SVG hardcodés ne marcheront pas si la carte pan, faire de la projection dynamique")

**Forces** :
- Sortie JSON directement parsable
- Précision sur coords XY, hex codes, rotations, z-index
- Identifie ses propres limites et propose workarounds
- Cohérent avec le pipeline officiel Souverain

**Limites** :
- N'a jamais été testé en mode review post-render dans notre projet
- Plus lent que Kimi (multimodal pro = ~$0.05/breakdown, ~30-60s)

## Pourquoi les deux restent complémentaires

**Argument "juge et partie"** : si Gemini a fait le storyboard ET le breakdown ET la review, on perd la triangulation. Kimi K2.5 reste pertinent comme deuxième opinion indépendante avec une sensibilité d'entraînement différente.

**Argument coût/latence** : Kimi est rapide et pas cher pour des reviews simples. Pour un quick check sur 1 frame, lancer un breakdown 3.1-pro complet est over-engineered.

**Argument robustesse** : avoir deux fournisseurs (Google + Moonshot) limite le risque API down ou changement de prix unilatéral.

## Quand utiliser Gemini 3.1-pro pour la review aussi

**Théoriquement possible** — Gemini 3.1-pro a les capacités de vision pour faire ce que Kimi fait. Mais **ce n'est pas validé** dans notre projet.

**Test futur recommandé** : sur un beat Beat 4 ou Beat 6 fini, envoyer la même frame à Kimi ET Gemini 3.1-pro avec le même brief. Comparer :
- Pertinence des artefacts détectés
- Faux positifs / faux négatifs
- Format de sortie (JSON structuré Gemini vs texte Kimi)
- Coût + latence

Si Gemini fait aussi bien ou mieux ET reste structuré, on pourrait consolider sur un seul fournisseur. Sinon garder Kimi en review.

## Recommandation actuelle (Jour 7)

1. **Pipeline Souverain officiel inchangé** : Gemini 3.1-flash-image → Gemini 3.1-pro breakdown → code Claude → Kimi review (optionnel)
2. **Ne pas remplacer Kimi par Gemini sur la review** sans test contrôlé
3. **Kimi K2.5 reste l'outil par défaut** pour la review post-render quand on en a besoin
4. **Gemini 3.1-pro reste l'outil par défaut** pour le breakdown pré-production

## Coûts de référence

| Outil | Endpoint | Coût/run | Latence |
|-------|----------|----------|---------|
| Gemini 3.1-flash-image (storyboard/asset) | Google AI Studio | ~$0.04 | ~10-15s |
| Gemini 3.1-pro breakdown (multimodal) | Google AI Studio | ~$0.05 | ~30-60s |
| Kimi K2.5 review | Moonshot | ~$0.01-0.03 | ~5-15s |

## How to apply

Pour toute production Souverain :
- Pipeline pré-production = Gemini (storyboard + breakdown)
- Code = Claude principal
- Review (optionnel) = Kimi
- Pour Atlas (test à venir) = même architecture, mais à valider sur un beat insert avant généralisation

**Why:** Aziz a posé la question "Gemini fait tout ce que Kimi fait ?" pour clarifier le rôle de chaque outil après 4 versions Beat 5 Jour 7. La réponse est : non, ils font des choses différentes — comprendre ça évite de mélanger les rôles ou d'éliminer un outil prématurément.

**How to apply:** Avant tout choix d'outil sur un nouveau projet, se demander d'abord : "est-ce que je veux planifier (Gemini 3.1-pro) ou évaluer (Kimi K2.5) ?". Si planifier → Gemini. Si évaluer → Kimi par défaut, Gemini possible si on veut tester.
