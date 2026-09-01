---
name: R-PROMPT-LIBERAL — libéral sur composition, strict sur technique
description: "Philosophie de prompting image-to-video paper-craft : laisser le modèle composer librement (postures, angles, expressions) mais rester explicite sur les contrats techniques non-négociables (dot-eyes, flat fills, palette, format)."
type: feedback
---

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo — reliquat non couvert
> après dépouillement de `rules-production.md`/`rules-pipeline.md`, dont le reste du contenu était
> déjà redistribué dans le repo en feedbacks individuels : `feedback_character-sheets-avant-production.md`,
> `feedback_manifest-json-et-ordre-chronologique.md`, `feedback_orchestrateur-ne-pas-executer.md`,
> `feedback_presenter-tout-ensemble-validation.md`, `feedback_monitor-fal-balance-avant-batch.md`,
> `feedback_checkpoint-vs-memo.md`, `feedback_claudemd-size-threshold-nuance.md`, entre autres).

## R-PROMPT-LIBERAL v2 (affinée 2026-04-23 après test V3 Thiaroye)

Quand Claude construit un prompt pour un modèle vidéo (Seedance, Kling) ou image (Gemini) **en
image-to-video paper-craft**, deux réflexes opposés sont contre-productifs :

1. **Sur-contrainte** (empiler les NO/NOT/NEVER pour "éviter tous les problèmes connus") — force le modèle à sur-compenser et invente des solutions bizarres.
2. **Sous-contrainte technique** (prompt minimaliste 100% libéral) — relâche les garde-fous critiques (dot-eyes violés, hatching apparu sur V3 Thiaroye).

### Formule v2 : libéral sur composition + STRICT sur technique

**Libéral** = laisser le modèle composer librement :
- Composition (placement, angles de vue)
- Postures et activités
- Expressions

**Strict** = rester explicite sur les contrats non-négociables :
- Règles techniques de style (dot-eyes, flat fills, paper-craft, anti-hatching)
- Palette critique
- Format
- Charref match

**Règle de décision** : avant d'écrire/supprimer une ligne d'un prompt, se demander :
1. Est-ce une règle **technique** de style (dot-eyes, flat fills, format) ? -> GARDER même si prompt court
2. Est-ce une instruction de **composition** (qui fait quoi où) ? -> COUPER, laisser libéral
3. L'image source porte-t-elle déjà l'information (côté Seedance) ? -> COUPER si oui

**Signal d'alerte** : si un prompt Seedance dépasse 15 lignes ou contient plus de 5 NO/NOT/NEVER sur des éléments **compositionnels** = Claude est en sur-contrainte. Mais si les NO concernent des contrats techniques (anti-hatching, anti-text, anti-BD-drift) = c'est légitime et nécessaire.

### Côté image source (Gemini)
- Décrire une ambiance vivante, pas une composition figée
- Mouvements amorcés dans l'image (pas postures statiques)
- Règles techniques EXPLICITES (dot-eyes avec 5 "NO", "flat fills, NO hatching")
- Clause ANTI-PARADE si scène multi-personnages : "figures staggered in depth at multiple distances from camera, natural gaps"
- Cible longueur : ~50-60 lignes (pas 35 trop minimaliste V3, pas 100+ sur-contraint V2)

### Côté clip (Seedance)
- 5-10 lignes max
- Pas de micro-instructions par personnage
- Pas de strict character counts
- 2-3 NO critiques (pas une liste de 10+)

**Raison** : les modèles vidéo sur-compensent quand écrasés par les contraintes. L'échec Scene 1 v2 Thiaroye (2026-04-23) montre que 50+ lignes de prompt Seedance + strict count = 4e personnage inventé + drift BD. MAIS l'échec V3 (35 lignes trop minimaliste) montre que trop court relâche aussi les règles techniques critiques.

**Lien avec collaboration** : un prompt plus structuré (~50-60 lignes avec sections claires SCENE / LIFE / COMPOSITION / ENVIRONMENT / CRITICAL RULES) reste lisible en mobile car Aziz scanne les sections par titres. Plus facile à valider qu'un bloc monolithique de 100+ lignes.

⚠️ Ce contenu date de 2026-04-23 (workflow paper-craft Thiaroye/Seedance/Gemini). Le principe
(libéral composition, strict technique) est probablement transposable à d'autres pipelines de
génération image/vidéo — à revalider sur le stack actuel avant réapplication mécanique.
