# Video Production Pipeline

Skill invocable via `/video-production`. Encode le pipeline complet de production video, du script au rendu final. Independant du sujet et du style visuel.

## Principes fondamentaux

- **Minute par minute** : jamais de construction one-shot. Chaque bloc (~1 min) passe par le pipeline complet.
- **Jury AI a chaque etape critique** : 3 LLM (GPT-4o, Grok, Gemini) evaluent avant chaque validation humaine.
- **Aziz dans la boucle** : le jury AI informe, Aziz decide. Jamais l'inverse.
- **Audio-first** : generer le voiceover AVANT de coder les visuels. Le timing audio dicte tout.
- **Storyboard avant code** : jamais une ligne de Remotion sans validation visuelle prealable.
- **Pre-generation, pas runtime** : tous les assets (images, audio, SFX) sont generes par CLI AVANT le render Remotion. Aucun appel API dans les composants React.

---

## Pipeline en 14 phases

```
Phase 1  : Recherche (multi-step + web)
Phase 2  : Script (youtube-scriptwriting skill)
Phase 3  : Jury AI script (3 LLM evaluent le script)
Phase 4  : Validation Aziz (lecture + ajustements) -> Script LOCK
Phase 5  : Direction artistique (palette, style fal.ai, prompts de reference)
Phase 6  : Storyboard visuel par bloc (composition + previz fal.ai)
Phase 7  : Jury AI storyboard (3 LLM evaluent le storyboard + previz)
Phase 8  : Validation Aziz (compare previz vs vision)
Phase 9  : Audio (voiceover ElevenLabs + SFX + musique)
Phase 10 : Construction Remotion (1 bloc a la fois, audio-first)
Phase 11 : Jury AI review frames (3 LLM comparent rendu vs storyboard)
Phase 12 : Validation Aziz (rendu du bloc)
Phase 13 : Bloc suivant (retour Phase 6)
Phase 14 : Assemblage final + polish
```

---

## Phase 1 : Recherche

Utiliser le skill `youtube-scriptwriting` Phase 0 (Discovery Interview) puis :

- `research/multi_step_research.py` : pipeline Decompose -> Research -> Expand -> Synthesize (Grok + web_search + x_search)
- WebSearch supplementaire en parallele pendant que le script tourne
- Objectif : 100+ sources minimum avant d'ecrire le script

---

## Phase 2 : Script

### Structure obligatoire

Le script doit exister en **3 versions** :

1. **Version lecture** : texte brut lisible par Aziz, sans balisage technique
2. **Version TTS-ready** : texte avec marqueurs ElevenLabs + presets par scene
3. **Version technique** : texte + visual cues [ANIM:], [CHAR:], [GRAPH:], etc.

### Format TTS-ready (scenes.json)

Chaque scene du script doit inclure :

```json
{
  "scenes": [
    {
      "id": "hook",
      "text": "1347... La MOITIE de l'Europe va mourir.",
      "preset": "dramatic",
      "expected_duration_sec": 4,
      "notes": "Pause longue apres 1347. MOITIE en emphasis."
    }
  ]
}
```

### Character presets disponibles

| Preset | Usage | Quand l'utiliser |
|--------|-------|------------------|
| dramatic | Impact emotionnel fort | Hooks, revelations, stats choc |
| narrator | Delivery fluide et engageante | Corps du contenu, explanations |
| conversational | Casual et proche | Asides, commentaires personnels, humour |
| calm | Apaisant et posee | Conclusions, CTA, questions ouvertes |
| literal | Lecture exacte | Citations, texte a l'ecran |

### Marqueurs TTS pour ElevenLabs (Chris / eleven_v3)

| Marqueur | Effet | Exemple |
|----------|-------|---------|
| MAJUSCULES | Emphasis sur le mot | "DIX MILLE personnes" |
| ... | Pause naturelle (300-500ms) | "Spoiler... ca n'a pas marche." |
| -- | Break de ton / changement de registre | "Et la medecine ? -- Encore pire." |
| ! | Energie montante | "Ca a meme EMPIRE !" |
| ? | Inflexion rhetorique | "Ca vous rappelle quelque chose ?" |
| , | Micro-pause (100-200ms) | Utiliser pour le rythme naturel |

### Regles TTS critiques

- **Accents obligatoires** : e, e, a, c, i, u, o. Manquer un accent = mispronunciation.
- **Chiffres en toutes lettres** : "cinquante millions" pas "50M". Mode text_normalization: "on".
- **Request stitching** : toujours fournir `previous_text` et `next_text` entre scenes pour continuite prosodique.
- **Language code** : forcer `language_code: "fr"` sur chaque appel.
- **Stability 0.0** : maximum expressivite (prouve avec Chris).
- **Style 0.8** : forte personnalite.

---

## Phase 3 : Jury AI Script

### Objectif
3 LLM evaluent le script TTS-ready. Chacun a un angle different.

### Prompt template pour chaque LLM

```
CONTEXTE : Nous produisons une video YouTube educative animee de [DUREE] en style [STYLE].
Audience : francophones curieux 25-45 ans.
Ton : [TON].

Voici le script complet avec balisage TTS (marqueurs d'emphasis, pauses, presets de voix par scene).

[SCRIPT COMPLET VERSION TTS-READY]

Evalue ce script selon ta specialite :
```

### Angles par LLM

| LLM | Prompt specifique | Force |
|-----|-------------------|-------|
| GPT-4o (via OpenAI API) | "Evalue la coherence narrative, la clarte du fil rouge, le rythme des segments. Le ton est-il trop agressif ou pas assez ? Les transitions sont-elles fluides ? Le spectateur comprend-il le message principal ?" | Structure, clarte, flow |
| Grok (via xAI API) | "Evalue le potentiel viral de ce script. Quels passages feraient de bons clips pour X/TikTok ? Quels passages risquent de declencher du backlash ou de la controverse non voulue ? Le hook est-il assez fort pour retenir en 5 secondes ?" | Viralite, risques, engagement |
| Gemini (via Google API) | "Evalue la precision factuelle et la sensibilite culturelle de ce script. Y a-t-il des affirmations qui deforment l'histoire ? Des formulations qui pourraient etre mal interpretees ? Les sources sont-elles solides ?" | Precision, sensibilite, rigueur |

### Synthese

Claude lit les 3 avis, synthetise en :
- Points unanimes (3/3 d'accord = action immediate)
- Points majoritaires (2/3 = consideration forte)
- Points uniques (1/3 = a mentionner a Aziz pour decision)
- Contradictions entre LLM (a presenter neutrement a Aziz)

---

## Phase 4 : Validation Aziz (Script)

Presenter a Aziz :
1. Le script version lecture (pas de balisage technique)
2. La synthese du jury AI (points forts, points faibles, risques)
3. Les suggestions concretes de modification

Aziz lit, ajuste, valide. Script LOCK apres cette phase.

---

## Phase 5 : Direction artistique

### Objectif
Definir le systeme visuel du projet AVANT tout storyboard. Ceci est fait UNE SEULE FOIS par video.

### Elements a definir

1. **Palette de couleurs** : 5-7 couleurs max. Une dominante par acte si besoin.
2. **Style des backgrounds** : choisir entre les 2 modes visuels (voir ci-dessous) et leur proportion.
3. **Prompt suffix fal.ai** : un style suffix commun a TOUS les prompts image du projet.
4. **Typographie** : police(s) pour titres, chiffres, body text.
5. **Effets visuels recurrents** : scanlines, grain, vignette, glow, etc.
6. **Reference images** : generer 3-5 images fal.ai de reference pour valider le style.

### Les 2 modes visuels

Le pipeline supporte 2 modes visuels qui ALTERNENT dans une video pour creer du rythme :

**Mode A : "Data sur fond"**
- Background : texture generee par fal.ai (parchemin, mur de pierre, tableau noir, etc.)
- Foreground : donnees Remotion (graphiques SVG, compteurs animes, cartes, texte)
- Usage : hook chiffres, stats, timelines, comparaisons
- Exemple : parchemin brule avec courbe de mortalite dessinee a l'encre

**Mode B : "Scenes vivantes"**
- Background : scene complete generee par fal.ai (ruelle, place, foret, etc.)
- Foreground : sprites pixel art / personnages places dans la scene + donnees integrees organiquement
- Usage : narration, action, scenes descriptives
- Exemple : ruelle medievale nocturne avec plague doctor qui marche + compteur "Jour 42" grave dans le mur

### Regle d'alternance
Varier les modes toutes les 30-60 secondes. Ne jamais enchainer plus de 2 scenes du meme mode. L'alternance cree le rythme et evite la monotonie.

---

## Phase 6 : Storyboard visuel par bloc

### Previz fal.ai (NOUVEAU)

Pour chaque scene (~1 minute), generer 2-3 images de previz avec fal.ai :

```bash
# Script de generation : scripts/generate-previz.ts
# Utilise fal-ai/flux/dev pour les backgrounds
# Parametres : image_size "landscape_16_9", num_inference_steps 28, guidance_scale 3.5
# Seeds fixes pour reproductibilite
```

Les images de previz sont sauvees dans `generated/<project>/previz/` avec un `manifest.json`.

### Format par scene

Pour chaque scene (~1 minute), fournir 5 couches :

**1. PREVIZ FAL.AI**
- Prompt exact envoye a fal.ai (avec le style suffix du projet)
- Seed utilisee
- Image generee (sauvee localement + reference dans manifest)
- Ce qui sera ajoute par Remotion (texte, graphiques, sprites) qui N'EST PAS dans l'image

**2. COMPOSITION**
- Fond/decor (quoi, ou, quelle ambiance) -> reference a l'image previz
- Personnages (qui, ou sur l'ecran, quelle taille relative, quelle pose)
- UI/Data (texte, graphiques, compteurs, leur position exacte)
- Calques et z-index : Background fal.ai -> Sprites -> Data Remotion -> Effets (grain, scanlines)

**3. ANIMATIONS** (detail critique)
- **Entrees** : comment chaque element apparait (fade in Xs, slide depuis [direction] sur N frames, spring scale, draw progressif SVG...)
- **Mouvements** : ce que fait chaque element PENDANT qu'il est visible (translation lineaire de X a Y, idle subtil amplitude N pixels, clignotement N Hz, rotation...)
- **Sorties** : comment ca disparait (fade out Xs, hard cut, slide off vers [direction]...)
- **Timing** : a quel moment du segment chaque animation demarre et se termine (en secondes relatives au debut du bloc)
- **Interdictions** : pas de sprite idle en boucle sans contexte, pas d'animation decorative sans lien au voiceover

**4. INTEGRATION DES DONNEES** (Mode B uniquement)
- Comment les graphiques/chiffres sont integres dans la scene (grave dans la pierre, ecrit a la craie, sur un panneau en bois, compteur mecanique, etc.)
- PAS de graphiques flottants detaches de la scene

**5. TRANSITION vers scene suivante**
- Type (hard cut, crossfade Xs, glitch, wipe direction, zoom...)
- Duree en secondes

### Regle de coherence voix/visuel (Dual Coding)
Chaque element visuel doit illustrer EXACTEMENT ce que la voix dit au meme moment. Pas d'animation decorative. Si le voiceover parle de "foules qui se fouettent", on VOIT des foules qui se fouettent. Pas des rats qui courent.

---

## Phase 7 : Jury AI Storyboard

Meme systeme que Phase 3, adapte au visuel. Envoyer les images previz + descriptions.

| LLM | Prompt specifique |
|-----|-------------------|
| GPT-4o | "Ce storyboard est-il visuellement clair ? Un spectateur comprend-il ce qui se passe sans le son ? Les animations sont-elles justifiees narrativement ? L'alternance des modes visuels cree-t-elle un bon rythme ?" |
| Grok | "Est-ce que ces visuels donneraient envie de cliquer en thumbnail ? Quels frames feraient de bons screenshots partageables ? Y a-t-il des moments visuellement ennuyeux ? Les scenes sont-elles assez variees ?" |
| Gemini | "Les representations historiques sont-elles respectueuses et precises ? La composition visuelle suit-elle les principes de lisibilite (hierarchie, contraste, focus) ? Les donnees integrees sont-elles lisibles ?" |

---

## Phase 8 : Validation Aziz (Storyboard)

Aziz recoit :
1. Les images previz generees par fal.ai (pas des descriptions textuelles)
2. Les descriptions de ce que Remotion ajoutera par-dessus (sprites, data, effets)
3. La synthese du jury AI

Aziz valide ou corrige le visuel. OK = on passe a l'audio. Pas OK = on ajuste les prompts et on regenere.

---

## Phase 9 : Audio (voiceover + SFX + musique)

### Ordre strict

1. **Voiceover** : generer avec ElevenLabs (Chris, eleven_v3, stability 0.0, style 0.8)
2. **Mesurer** : `ffprobe` pour duree exacte de chaque scene
3. **Definir timings** : SCENE_TIMING base sur les durees reelles (jamais estimer)
4. **SFX** : generer les effets sonores lies aux animations
5. **Musique** : generer la boucle musicale adaptee a la duree totale

### ElevenLabs Music : bonnes pratiques

- Utiliser `composition_plan` pour controler les sections musicales par acte
- Prompts specifiques au style : "8-bit chiptune dark medieval ambient" >> "background music"
- `music_length_ms` : duree exacte en millisecondes
- Loopable pour les fonds continus

### ElevenLabs SFX : bonnes pratiques

- `prompt_influence: 0.6-0.8` pour SFX precis (fouet, cloche, feu)
- `prompt_influence: 0.2-0.3` pour ambiances (foule, vent, pluie)
- `loop: true` pour ambiances continues
- Specificite maximale dans les prompts : "medieval iron-tipped leather whip striking flesh" >> "whip sound"
- `duration_seconds` : controler la duree exacte (0.5-30s)

### ElevenLabs Timing Validation

Apres generation voiceover, valider automatiquement :

| Metrique | Seuil | Action si depasse |
|----------|-------|-------------------|
| Variance duree | >15% de l'attendu | Regener la scene |
| Silence initial | >200ms | Trimmer ou regener |
| Silence final | >500ms | Trimmer |
| Debit parole | <2 ou >4.5 mots/sec | Ajuster le texte |

Utiliser `actualDuration` du metadata pour sync Remotion pixel-perfect.

---

## Phase 10 : Construction Remotion (1 bloc)

### Architecture des couches (z-order)

```
Couche 4 (top)  : Effets post-process (grain film, scanlines, vignette)
Couche 3        : Donnees Remotion (texte, graphiques SVG, compteurs animes)
Couche 2        : Sprites / personnages (pixel art ou SVG, animes)
Couche 1 (base) : Background fal.ai (image statique ou avec pan/zoom lent)
```

### Regles de construction

- Coder UNIQUEMENT le bloc valide en Phase 8
- Les backgrounds fal.ai sont dans `public/assets/<project>/backgrounds/` (copies depuis `generated/`)
- Les sprites sont dans `public/assets/<project>/sprites/`
- Render partiel : `npx remotion render [Composition] --frames=START-END`
- Extraire frames : `./scripts/extract_review_frames.sh`

### Animations de camera sur backgrounds

Les backgrounds fal.ai sont statiques. Pour creer du mouvement :
- **Ken Burns** : zoom lent (scale 1.0 -> 1.08 sur 10s) + pan subtil
- **Parallax** : deplacer les couches a des vitesses differentes
- **Focus shift** : opacity/blur progressif sur certaines zones

---

## Phase 11 : Jury AI Review Frames

Envoyer les frames extraites + le storyboard original aux 3 LLM :

```
Voici le storyboard prevu pour ce bloc :
[STORYBOARD + IMAGES PREVIZ]

Voici les frames rendues :
[FRAMES ou descriptions detaillees]

Le rendu correspond-il au storyboard ? Qu'est-ce qui diverge ?
Quels elements manquent ou sont mal executes ?
Les donnees sont-elles lisibles ? Les sprites sont-ils bien integres dans la scene ?
```

---

## Phase 12 : Validation Aziz (Rendu)

Aziz voit le rendu video + avis jury.
OK = bloc suivant. Pas OK = correction avant d'avancer.

---

## Phase 13 : Bloc suivant

Retour Phase 6 pour le bloc suivant. Chaque bloc passe par le meme pipeline.

---

## Phase 14 : Assemblage final

- Combiner tous les blocs valides
- Verifier les transitions entre blocs
- Ajuster les niveaux audio (voix, musique, SFX)
- Render final complet
- Derniere validation Aziz

---

## Gestion des assets fal.ai

### Principe
Les URLs fal.ai EXPIRENT. Tout asset genere doit etre telecharge immediatement et stocke localement.

### Structure des fichiers

```
generated/                    # .gitignore - fichiers generes (temporaire)
  <project>/
    previz/                   # Images de previz (Phase 6)
    backgrounds/              # Backgrounds valides (copie vers public/)
    upscaled/                 # Sprites upscales via ESRGAN
    manifest.json             # Index de tous les assets generes

public/assets/<project>/      # Assets utilises par Remotion (versioned)
  backgrounds/                # Backgrounds fal.ai valides
  sprites/                    # Sprites pixel art
  audio/                      # Voiceover, SFX, musique
```

### manifest.json

```json
{
  "project": "peste-1347",
  "generatedAt": "2026-02-14T...",
  "assets": [
    {
      "id": "bg-ruelle-01",
      "type": "background",
      "model": "fal-ai/flux/dev",
      "prompt": "Dark medieval alley at night...",
      "seed": 1347,
      "settings": {
        "image_size": "landscape_16_9",
        "num_inference_steps": 28,
        "guidance_scale": 3.5
      },
      "localPath": "backgrounds/scene1-ruelle-medievale.png",
      "status": "validated"
    }
  ]
}
```

### Workflow de validation

1. Generer dans `generated/<project>/previz/` (Phase 6)
2. Aziz valide (Phase 8)
3. Copier les valides dans `public/assets/<project>/backgrounds/`
4. Remotion reference les fichiers dans `public/`

---

## fal.ai : modeles et parametres

### Modeles utilises

| Modele | Usage | Cout approx | Temps |
|--------|-------|-------------|-------|
| `fal-ai/flux/dev` | Backgrounds et previz | ~$0.03/image | 1-2s |
| `fal-ai/esrgan` | Upscale sprites (4x) | ~$0.01/image | 2-3s |
| `fal-ai/luma-dream-machine` | Animation video courte (futur) | ~$0.50/video | 30-60s |

### Parametres par defaut (backgrounds)

```json
{
  "image_size": "landscape_16_9",
  "num_inference_steps": 28,
  "guidance_scale": 3.5,
  "seed": "<fixe pour reproductibilite>"
}
```

### Prompt engineering pour fal.ai

Structure d'un prompt efficace :
```
[SUJET PRINCIPAL], [DETAILS DE SCENE], [AMBIANCE/LUMIERE], [STYLE ARTISTIQUE],
no text no letters no words, [FORMAT/RATIO]
```

Toujours inclure `no text no letters no words` -- les modeles generent du texte gibberish sinon. Le texte est ajoute par Remotion.

### ESRGAN pour sprites

- Upload vers `fal.storage` d'abord, puis appel `fal-ai/esrgan` avec `scale: 4`
- Le standard ESRGAN lisse legerement les bords pixel. Acceptable pour sprites < 200px.
- Pour du pixel art pur ou la nettete des bords est critique, envisager des upscalers specialises pixel art (futur).

---

## ComfyUI (reserve pour futur)

ComfyUI n'est PAS utilise dans la V1 du pipeline. Reserve pour :
- Consistance de personnage sur 20+ plans (ControlNet + reference image)
- Batch processing de 50+ images avec workflow identique
- Inpainting precis (remplacer un element dans une image existante)

Deploiement : RunPod on-demand (~$0.44/h). API REST. Claude orchestre, Aziz ne touche pas.

---

## Regles anti-erreurs (lecons apprises)

1. **JAMAIS de sprite idle en boucle sans contexte narratif** -- ca donne un effet "epileptique" inutile
2. **JAMAIS de construction one-shot** -- maximum 1 minute de code avant checkpoint
3. **JAMAIS de modification incrementale d'un prototype rejete** -- si le fondamental ne marche pas, repartir de zero
4. **JAMAIS de voiceover/visuel desynchronise** -- si la voix dit "bleu", l'ecran montre bleu
5. **JAMAIS de commit sans validation Aziz sur le bloc** -- le code n'existe que pour servir la vision validee
6. **Audio-first TOUJOURS** -- generer le voiceover, mesurer avec ffprobe, PUIS definir les timings
7. **Le style est un parametre** -- ne pas hardcoder un style visuel dans le pipeline
8. **Les animations illustrent le propos** -- chaque mouvement a l'ecran correspond a un moment precis du voiceover
9. **JAMAIS de generation dans les composants React** -- tous les assets sont pre-generes par CLI, jamais dans useEffect
10. **JAMAIS d'URLs fal.ai non sauvegardees** -- telecharger immediatement, les URLs expirent
11. **Seeds fixes pour reproductibilite** -- chaque asset dans le manifest avec sa seed et son prompt exact

---

## Sensibilite editoriale (regles de neutralite)

Ces regles s'appliquent a TOUT script, quel que soit le sujet. Decouvertes lors du premier test Jury AI (Peste 1347, fev 2026).

1. **Pas de catalogue politique** -- ne jamais utiliser de termes qui placent la chaine dans un camp (antivax, conspirationniste, pro-science, woke, etc.). Les meilleures chaines (Moon, OverSimplified) restent neutres.
2. **Constats universels > exemples specifiques nommes** -- "les humains cherchent des remedes miracles" > "les antivax boivent de la javel". Le spectateur fait le lien lui-meme = plus puissant et zero backlash.
3. **Pointer le probleme, pas les gens** -- "l'ignorance pretend guerir" > "ceux qui pretendent guerir". Le sujet est le comportement, pas les individus.
4. **Zone Miroir = zone a risque** -- dans une section recapitulative ou le spectateur est en mode "parallele passe/present", TOUTE phrase sera lue comme un commentaire moderne. Ancrer explicitement dans l'epoque OU assumer l'universalite sans pointer.
5. **Le Jury AI est un filet, pas un remplacement** -- les 3 LLM ont flag la section Miroir polarisante (3/3 unanime) mais aucun n'a detecte la critique implicite de la medecine moderne. Le jugement humain (Aziz) reste indispensable.
6. **La "mince ligne" neutralite/piquant** -- le ton provocateur vient du CONSTAT sur la nature humaine, pas de l'ACCUSATION envers un groupe. Provocateur =/= partisan.
7. **Chiffres historiques = nuancer** -- "certains historiens denombrent..." ou "sans doute..." preservent l'impact tout en etant honnete intellectuellement. Ne pas inventer une precision qui n'existe pas.
8. **Faits mal documentes = remplacer** -- si une anecdote n'est pas verifiable par des sources serieuses, la remplacer par un fait mieux documente. La rigueur renforce la credibilite, surtout en ton provocateur.
