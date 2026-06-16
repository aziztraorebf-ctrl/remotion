---
name: Règles storyboard Souverain — système de génération visuelle
description: Principes validés pour créer des storyboards Souverain premium et cohérents. Issu de l'analyse Niger Uranium + Or Africain + session Zimbabwe Lithium 2026-05-12.
type: reference
---

# Système de génération storyboard Souverain

> Référence vivante — à mettre à jour après chaque épisode validé.
> Source : analyse comparative Niger Uranium + Or Africain + session Zimbabwe 2026-05-12.

---

## Principe fondamental : alternance des registres

Chaque beat doit avoir sa propre texture visuelle. Jamais deux beats consécutifs dans le même registre (sauf paire narrative intentionnelle).

**Règle d'alternance :**
- Mapbox quand la **géographie porte la narration** (situer, montrer des flux, révéler un territoire)
- Graphisme pur quand les **données ou les acteurs portent la narration** (mécanismes économiques, entités, chiffres-choc, suspension narrative)

**Exemple validé Zimbabwe :**
```
Beat 1 → Mapbox        (situer Zimbabwe sur le globe)
Beat 2 → Graphisme     (mécanique ×15, pas de géographie)
Beat 3 → Mapbox+data   (action sur territoire réel)
Beat 4 → Graphisme     (suspension typographique)
Beat 5 → Graphisme     (acteur Huayou, entité économique)
Beat 6 → Mapbox        (retour géographie, question ouverte)
```

---

## Ce qui fait un beat premium

Tiré des frames Niger Uranium et Or Africain validées par Aziz.

### Les chiffres vivent dans l'espace — pas dans des boîtes
- Poser les chiffres directement sur la carte ou le fond, semi-transparents
- Exemple Or Africain : "4 PAYS." gravé sur les pays highlights
- Exemple Or Africain : "0€" géant sur la carte Niger
- INTERDIT : chiffre dans un rectangle centré sur fond vide

### Chaque beat a une mécanique visuelle unique qui se révèle
- Une courbe qui se dessine en temps réel (Or Africain)
- Des pays qui s'allument un par un sur la carte (Or Africain)
- Un compteur qui monte (Or Africain prix or)
- INTERDIT : écran statique avec tous les éléments présents dès le départ

### Mapbox est narrateur, pas décor
- La carte agit selon le script — pays qui s'activent, lignes qui se tracent, zoom qui accompagne la révélation
- Les données s'inscrivent directement sur la géographie
- INTERDIT : carte figée avec juste un pays coloré et un badge

### Le texte éditorial est chirurgical
- Une phrase. Un mot. Une intention.
- Exemple Or Africain : "MÊME." seul sur fond noir
- Exemple Niger : "LE NIGER DOIT TENIR" barre tranchée
- INTERDIT : paraphrase de la voix-off en overlay

### Les backgrounds racontent
- Texture grain papier navy = archives, dossier
- Fond near-black texturé kente subtil = verdict, conclusion
- Fond désert = terrain, réalité physique
- INTERDIT : fond uni sans texture sur un beat graphisme

### Les artefacts décoratifs sont bannis
- Tampons "INTERDIT", badges "CLASSIFIÉ", étoiles, sparkles, effets 3D
- Ils illustrent de façon trop littérale — ils ne servent pas la narration
- Exception : si l'artefact EST la narration (ex: document classifié qui raconte une dissimulation)

---

## Refs i2i canoniques — système validé 2026-05-12

Deux fichiers de référence permanents dans `public/_shared/refs-i2i/` :

| Fichier | Source | Registre | Quand l'utiliser |
|---------|--------|----------|-----------------|
| `souverain-ref-mapbox.png` | Or Africain ~49s | Mapbox | Beats avec carte (globe, Mercator, multi-pays) |
| `souverain-ref-graphisme.png` | Niger Uranium ~64s | Graphisme | Beats sans carte (data-viz, acteurs, typographie) |

**Règle absolue** : envoyer **une seule ref par beat** en i2i — jamais les deux simultanément (sinon Gemini moyenne les styles et perd la spécificité).

**Pourquoi ce mix** :
- Or Africain = référence Mapbox dark navy, highlights pays, chiffres sur géographie
- Niger = référence graphisme diversifié (SplitScreen, textures, compositions mixtes)
- Une ref universelle moyenne les deux styles — le mix par registre préserve la force de chacun

**Mise à jour des refs** : après chaque épisode Souverain validé, évaluer si un frame de cet épisode dépasse la ref actuelle. Si oui, remplacer le fichier canonique.

---

## Workflow de génération storyboard

### Étape 1 — Claude définit les directions (PAS Flash)
- Claude lit le script beat par beat
- Claude analyse les refs Niger + Or Africain pour s'imprégner du niveau visuel cible
- Claude propose la direction visuelle de chaque beat : registre (Mapbox/Graphisme), mécanique visuelle, tension narrative, nouveauté exploration
- Claude écrit les prompts Flash — pas Flash qui invente
- Aziz valide les directions EN TEXTE avant toute génération

### Étape 2 — Flash génère les PNG (V1)
- Modèle : `gemini-3.1-flash-image-preview`
- Un PNG par beat, composition définie par Claude
- Contraintes prompt : max 4 éléments simultanés, un élément dominant, INTERDIT effets 3D
- Si résultat trop After Effects / infographie / 3D → Claude corrige le prompt, on regénère

### Étape 3 — Passe i2i (V2 enrichie)
- Modèle : `gemini-3.1-flash-image-preview` en mode i2i (3 images en input)
- Input : [ref canonique par registre] + [PNG V1] + instruction d'enrichissement
- Ref Mapbox → public/_shared/refs-i2i/souverain-ref-mapbox.png
- Ref Graphisme → public/_shared/refs-i2i/souverain-ref-graphisme.png
- Instruction : "garde la composition exacte, enrichis la qualité visuelle"
- Une seule ref par beat — jamais les deux simultanément

### Étape 4 — Aziz valide visuellement les V2
- Pas de code, pas de JSON à cette étape
- "Ça me plaît" → on avance
- "Change X" → Claude corrige le prompt et relance depuis étape 2

### Étape 5 — 3.1 Pro breakdown (multimodal)
- Modèle : `gemini-3.1-pro-preview`
- Input : PNG V2 validé + voix-off exacte + timings frame-précis + prompt breakdown schema
- Output : JSON technique (coords, spring(), mots-pivots, permanent_motion, warnings)
- 3.1 Pro identifie aussi ce qui dépasse nos contraintes et propose des workarounds
- Script de référence : `memory/tools/workflow-gemini-breakdown-schema.md`

### Étape 6 — Claude code depuis le JSON
- Source de vérité : le JSON de 3.1 Pro
- Pas d'improvisation, pas d'interprétation

### Étape 7 — Kimi review (optionnel, post-render)

---

## Règle d'exploration — NON-NÉGOCIABLE

**Chaque épisode doit introduire au moins :**
- 1 mouvement de caméra Mapbox jamais utilisé, OU
- 1 mécanique graphique nouvelle, OU
- 1 combinaison de templates jamais tentée

**Pourquoi :** sans exploration, on accumule les mêmes templates et le contenu devient répétitif visuellement.

**Comment :** Claude propose explicitement "voici ce qu'on n'a jamais fait" lors de la définition des directions. Aziz peut rejeter ou approuver. Si approuvé, 3.1 Pro documente comment le coder.

**La nouveauté est bienvenue même si elle dépasse nos templates actuels.** 3.1 Pro est là pour trouver l'implémentation la plus fidèle possible à la vision. Mieux vaut viser haut et downscaler intelligemment que rester minimal par prudence.

---

## Ce que Flash fait bien / mal

### Flash fait bien :
- Compositions éditoriales flat avec palette respectée
- Globes Mapbox stylisés
- Typographie dramatique
- Icônes SVG simples

### Flash dérive vers :
- After Effects (effets 3D, particules, glows complexes) quand on lui donne trop de liberté
- Infographie surchargée (8-10 éléments simultanés)
- Composition thumbnail YouTube (tout visible d'un coup, pas de révélation)

**Solution :** Claude écrit les prompts avec des contraintes de composition explicites (max 3-4 éléments, un élément dominant, pas d'effets 3D).

---

## Références validées à consulter avant chaque storyboard

| Référence | Ce qu'elle enseigne | Frames |
|-----------|---------------------|--------|
| Niger Uranium FINAL | Alternance Mapbox/Graphisme, KraftCard, EntityDiagram, SplitScreen | `/tmp/niger-frames/` |
| Or Africain FINAL | Chiffres sur carte, courbe animée, texte éditorial minimal, Mapbox narrateur | `/tmp/or-africain-frames/` |
| Zimbabwe storyboard V1 Flash | Ce qui est trop simple (référence négative) | `public/souverain/zimbabwe-lithium/assets/storyboard-v1/` |
