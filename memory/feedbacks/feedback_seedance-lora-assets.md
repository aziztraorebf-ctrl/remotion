# Seedance = pilier premier ordre de la chaîne + règle LoRA assets

**Décision Aziz (2026-05-02)** : Seedance n'est pas un outil parmi d'autres. C'est le moteur visuel central de GeoAfrique Shorts. La chaîne passera "énormément de temps dans Seedance 2.0".

**Why** : Lors de la restructuration workspace, le premier réflexe était de concentrer la nouvelle structure sur Atlas. Aziz a corrigé : Seedance mérite une section de premier ordre, au même niveau qu'Atlas dans l'organisation du workspace.

## Résultat : public/seedance/ créé (2026-05-02)

Structure centralisée de TOUS les assets Seedance :
- `public/seedance/style-refs/` — images référence style (gemini, gpt, thiaroye, sonjata-papercraft)
- `public/seedance/test-clips/` — clips bruts générés (fal.ai, sonjata-papercraft, yaroflasher, seedance-examples officiels)
- `public/seedance/heros-oublies-refs/` — character sheets Soundjata, Yaa Asantewaa
- `public/seedance/historical-refs/` — character sheets Abou Bakari, Amanirenas
- `public/seedance/moodboards/` — analyses visuelles par projet
- `public/seedance/INDEX.md` — guide navigation complet

## Règle absolue : assets Seedance = valeur LoRA

**Ne JAMAIS supprimer** :
- Clips Seedance bruts (même tests ratés, même vieux clips) → `public/seedance/test-clips/`
- Style-refs (images générées pour ancrer le style) → `public/seedance/style-refs/`
- Moodboards (analyses visuelles, comparaisons outils) → `public/seedance/moodboards/`
- Character sheets historiques → `public/seedance/historical-refs/`

**Pourquoi** : Aziz prévoit d'utiliser `lora-training/` pour fine-tuner des modèles sur notre style papercraft + nos personnages historiques. Chaque clip ou image conservé = donnée d'entraînement potentielle.

**Avant toute suppression d'asset visuel** : se demander "est-ce que ça pourrait servir pour le LoRA training ?" Si incertain → conserver dans `public/seedance/`.

## How to apply

- Tout nouveau clip Seedance généré (même test) → copier dans `public/seedance/test-clips/`
- Toute nouvelle image de style générée → copier dans `public/seedance/style-refs/`
- En début de session Seedance → lire `public/seedance/INDEX.md` pour trouver refs existantes
- Jamais créer de dossier `tmp/` pour assets visuels — aller directement dans `public/seedance/`

---
Migré depuis auto-memory (`feedback_seedance-lora-assets.md`) le 2026-08-31, contenu original inchangé.
