# Workflow Souverain V1 — Episodes Type B (Data-Journalism Mobile)
> Créé 2026-05-06 depuis production Or Africain. Version 1 validée.
> Analogie Atlas : ce fichier est l'équivalent de atlas-template-v1.md pour la série Souverain.

## Définition série Souverain
Vidéos courtes (~75-110s) sur la souveraineté économique africaine : ressources naturelles, royalties, nationalisations, accords miniers. Style : dark premium data-journalism. 100% Remotion pur + Mapbox 3D. Zéro Seedance, zéro PixelLab.

## Critères sujet Souverain-natif
Un sujet est Souverain-natif si :
- Donnée chiffrée forte (prix, montant, %, comparaison)
- Acteurs identifiables (pays, entreprises, gouvernements)
- Tension narrative claire (avant/après, résistance/signature)
- Gap francophone confirmé (vérifier avant de lancer)

## Structure canonique (dossiers)
```
src/projects/souverain/<episode>/
    <Episode>.tsx         — composition principale
    timing.ts             — timestamps audio-derives
    manifest.ts           — source de verite visuelle
    components/           — composants specifiques episode
    scenes/               — beats codes

public/souverain/<episode>/
    audio/
        narration-<episode>-FINAL.mp3
        narration-<episode>-FINAL-alignment.json
        narration-<episode>-cta-v1.mp3
        music-v1.mp3
        sfx-*.mp3
    assets/
        storyboard/       — frames Gemini storyboard
        grain-overlay.png — texture PNG Gemini (shared si possible)
```

---

## Pipeline 10 étapes (ordre obligatoire)

### Étape -1 — Fact-Sheet sourcée AVANT script (NOUVEAU 2026-05-07)
- **Recherche manuelle sourcée** sur sources primaires/secondaires AVANT toute rédaction
- Perplexity sonar-pro via OpenRouter pour recouper sources institutionnelles (sonar-deep-research retiré — trop cher, redondant avec WebSearch)
- Distinguer explicitement : faits vérifiés convergents / chiffres contestés (claims de partie) / éléments non confirmés / cadrages éditoriaux assumés
- Pour chaque chiffre : noter source primaire, date, et si l'autre camp conteste
- Output : Fact-Sheet attribuée qui devient INPUT du script V1, pas un correctif post-hoc
- **Pourquoi :** un Short géopolitique sur dossier contentieux n'est pas un script YouTube standard. La difficulté est documentaire (trancher en 100s des contradictions). LLM par défaut aplatit les versions concurrentes en faux consensus, penche vers médias français mainstream sur l'Afrique, approxime les chiffres précis sans web search. Ordre correct : recherche → fiche → script → LLM pour rythme. Pas l'inverse.

### Étape 0 — Script V1 + Jury LLM script
- Écrire script selon règles Type B (voir `feedback_typeB-script-rules.md`) **à partir de la Fact-Sheet de l'étape -1**
- Scan TTS obligatoire AVANT tout : chiffres en lettres, participes é/ée, "ont + voyelle"
- **Vérifier symétrie** : citable ≠ neutre (voir `feedback_souverain-citable-pas-neutre.md`), humanisation symétrique des camps (voir `feedback_souverain-symetrie-humanisation.md`)
- Soumettre au jury LLM pour validation factuelle + score
- Gate : score moyen ≥ 7/10 pour continuer

### Étape 0bis — Relecture critique Claude (OBLIGATOIRE après chaque version script)
- Après V1 ET après V2 : Claude relit lui-même phrase par phrase
- Vérifier chaque affirmation contre les fact-checks et la Fact-Sheet
- Pointer : inexactitudes factuelles, jugements d'intention présentés comme faits, liens causaux non établis, vocabulaire d'une partie présenté comme neutre
- Format : tableau phrase / problème / correction
- Gate : zéro problème non résolu avant de passer à l'étape suivante
- Validé Niger uranium 2026-05-07 — a corrigé 4 erreurs factuelles avant génération audio

### Étape 0ter — Stress-test adversarial (OBLIGATOIRE avant lock)

Lire le script en se mettant dans la posture de l'adversaire le plus solide sur ce sujet — pas la caricature, mais quelqu'un de rigoureux qui chercherait des failles factuelles, des généralisations non sourcées, ou des cadrages implicites non défendables.

**Persona adversarial Souverain** : un commentateur qui accepte les faits bruts mais conteste le cadrage — il dira "vous romantisez la souveraineté", "vous ignorez le contexte économique de l'investissement étranger", "vous présentez des régimes autoritaires comme des héros".

**Protocole** :
1. Identifier les **3 attaques les plus solides** (pas les plus faciles, les plus solides)
2. Pour chaque attaque : est-ce qu'elle a une **réponse défendable dans le script lui-même** ?
3. Si oui → OK, continuer. Si non → **correction minimale d'une phrase maximum**
4. Si une attaque nécessite plus d'une phrase → remonter à Aziz, c'est un problème structurel

**Règle absolue** : l'objectif n'est pas de neutraliser tous les adversaires — c'est de s'assurer que le cœur factuel tient. Un script qui assume ses angles éditoriaux est plus solide qu'un script qui prétend être neutre et ne l'est pas.

**Durée cible** : 10 minutes max. Ce n'est pas une réécriture, c'est une vérification.

### Étape 1 — Corrections script + lock
- Intégrer corrections Aziz (clarté auditeur, chiffres factuels, transitions)
- Intégrer corrections relecture critique Claude (étape 0bis)
- Intégrer corrections stress-test adversarial (étape 0ter) si applicable
- Vérifier : assumer que l'auditeur ne connaît pas le sujet
- Statut : LOCKED — plus de modifications après cette étape

### Étape 2 — Génération audio TTS
- Voix : Narratrice GéoAfrique v2 `z3gESu49naEZW8Af2Upm`, eleven_v3
- Config max-style : stability 0.22, similarity_boost 0.55, style 0.55, speed 1.0
- Générer narration principale + CTA séparément
- Collage ffmpeg : narration + 1s silence + CTA
- Forced alignment sur fichier FINAL → timestamps mot-par-mot

### Étape 3 — Structure projet
- Créer dossiers `src/projects/souverain/<episode>/` + `public/souverain/<episode>/`
- Copier assets depuis POC/test vers structure canonique
- NE JAMAIS alimenter les dossiers POC après cette étape

### Étape 4 — timing.ts (storyboarder agent)
- Input : fichier audio FINAL + alignment JSON
- Output : timing.ts avec BEATS, AUDIO_SEGMENTS, FPS, chemins audio
- Règle : toutes les valeurs dérivent de l'audio — zéro valeur hardcodée arbitraire
- Vérification : lire le fichier et valider les timestamps avant de continuer

### Étape 5 — Storyboard visuel (Gemini)
- Modèle OBLIGATOIRE : `gemini-3.1-flash-image-preview`
- Storyboard 1 : 8 frames clés (une par moment narratif fort)
- Storyboard 2 : beat le plus complexe séquencé en 5-6 états
- Règle : SVG pur interdit pour textures → assets PNG Gemini
- Règle drapeaux : décrire visuellement EN PLUS de nommer (évite drift africain)
- Sauvegarder dans `public/souverain/<episode>/assets/storyboard/`

### Étape 6 — Jury créatif (visual-producer agent)
- Composition OBLIGATOIRE : OpenAI GPT-4o + Grok + Kimi K2.5 (voir `feedback_jury-apis-commands.md`)
- Soumettre toutes les frames storyboard + 4 questions standard
- Pass 1 uniquement — Aziz fait le tri
- Durée cible : 5-8 minutes max

### Étape 7 — Validation Aziz + décisions locked
- Aziz valide : idées jury retenues, éléments visuels confirmés, corrections storyboard
- Toute décision validée ici = locked pour le manifest
- Ne pas coder avant cette validation

### Étape 8 — manifest.ts
- Source de vérité visuelle de l'épisode
- Contient : palette, tous les beats avec timing/couleurs/animations/SFX
- Règle overlays : texte overlay ne double jamais les sous-titres karaoke
- Règle plein écran couleur : max 1 par vidéo
- Règle sources : annotations Bloomberg/FMI/etc. obligatoires sur frames de données

### Étape 9 — Code beat par beat (remotion-composer agent)
- 1 beat par session si possible
- Render après chaque beat → validation Aziz → beat suivant
- Composants réutilisables → `components/` de l'épisode ou `_shared/` si cross-épisodes

### Étape 10 — Review finale + render
- quality-reviewer agent : self-review + Kimi scope + verdict
- Render final 1080×1920 30fps
- Upload Vercel Blob → URL publique pour Postiz

---

## Palette canonique série Souverain
```
fond:   #0a0a0a
or:     #f5d547
orange: #e89b3c
rouge:  #d32f2f
blanc:  #ffffff
gris:   #4a4a4a
```

## Éléments visuels récurrents (cross-épisodes)
- Barre de progression dorée bas d'écran (3px, #f5d547, opacity 0.6)
- Grille ledger financier en fond frames texte (lignes horizontales, opacity 0.04)
- Grain overlay PNG Gemini (opacity 0.08) — générer une fois, réutiliser
- Sources à l'écran sur toutes frames de données (Bloomberg, FMI, etc.)
- Mapbox 3D globe dark pour cartes géographiques principales

## Règles TTS Type B (NON-NEGOTIABLE)
Voir `feedback_typeB-script-rules.md` pour les 6 règles complètes. Résumé :
1. Acteurs nommés explicitement
2. Années en lettres orales (deux mille vingt-six)
3. Chiffres vérifiés avant d'écrire (compter les éléments listés)
4. Assumer que l'auditeur ne connaît pas le sujet — expliquer les transitions
5. Pas de sur-pauses avec voix V2
6. Overlays texte ne doublent jamais les karaoke

## Sujets futurs identifiés
| Sujet | Angle | Priorité |
|-------|-------|----------|
| Pétrole sénégalais | Royalties Woodside/BP vs revenus locaux | Haute |
| Coltan congolais | Prix mondial vs conditions mineurs | Haute |
| Bauxite guinéenne | Rio Tinto vs budget national | Moyenne |
| Cobalt zambie | Transition EV vs extraction | Moyenne |
