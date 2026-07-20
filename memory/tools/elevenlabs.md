# ElevenLabs TTS — Guide complet V3 GeoAfrique
> Mise a jour : 2026-05-12. Modele actif : `eleven_v3`
> Structure : Règles critiques (lire chaque session) → Référence complète (consulter au besoin)

---

## CHECKLIST OBLIGATOIRE — scanner avant chaque generation TTS

- [ ] Aucun participe passe en "e/ee" en fin de groupe (`terrifie`, `obsede`, `racontee` → reformuler)
- [ ] Aucun "ont + voyelle" → passe simple (`firent escale`)
- [ ] Tous les chiffres en lettres (`1311` → `treize cent onze`)
- [ ] Tous les accents ecrits (e, a, c cedille) — sinon prononciation fausse
- [ ] Audio tags places AVANT le mot/phrase (pas apres)
- [ ] Config max-style si voix Narratrice v2 (`stability: 0.22, style: 0.55`)
- [ ] Voix = Narratrice v2 (`z3gESu49naEZW8Af2Upm`) ou autre voix validee
- [ ] **Forced Alignment apres generation** pour timestamps mot-par-mot
- [ ] Musique de fond : volume par defaut **0.07** (ajuster par paliers de 0.02-0.03)

---

## Voix actives — profils et regles par voix

| Role | Voice ID | Type | V3 compatible |
|------|----------|------|--------------|
| Narrateur GeoAfrique (principal) | `ICHuIqamER7XZMdm2HYC` | Voice Studio | Oui |
| Narratrice GeoAfrique (originale) | `Y8XqpS6sj6cx5cCTLp8a` | Voice Studio | Oui — mais sonne robotique/plate, remplacee par v2 |
| **Narratrice GeoAfrique v2 (ACTIVE)** | `z3gESu49naEZW8Af2Upm` | **Voice Remix V3** | **Oui — voix principale Sonjata. Remixee depuis Y8X pour plus d'expressivite + rythme ouest-africain** |
| Narrateur B3 | `12mpLi4ieFNVlQlAIJ3m` | Voice Studio | Oui |
| Stephyra | `QMNPncWXVcTVhJ9rDEQO` | PVC (clone) | NON — PVC non optimises V3, eviter |
| Soundjata Rivale - Matrone Froide | `5eScDXbqClEhrA46NN4r` | Voice Design V3 | Oui — femme africaine mature, voix Mandinka cutting, ideal pour antagonistes/epouses royales |

### IMPORTANT — Hierarchie de qualite des voix ElevenLabs
1. **Prebuilt voices** (Rachel, Adam, etc.) = meilleure qualite, pas d'accent africain
2. **Professional Voice Clone (PVC)** = quasi indistinguable de l'original, necessite 30min+ d'audio
3. **Voice Remix V3** = prend une voix existante et la transforme en modele V3 complet. NOTRE MEILLEUR OUTIL.
4. **Voice Design** = generee par description texte, qualite VARIABLE, peut sonner robotique/synthetique

### Narrateur GeoAfrique — profil valide par test (2026-04-12)
- **Caracteristique** : voix grave, debit naturellement rapide
- **Pauses** : NECESSAIRES — ralentissent une voix qui se depêche. 4-6 pauses sur un script 54s est une bonne zone.
- **Audio tags** : fonctionnent et sont perceptibles. Emphase sur les mots cles confirme (ex: "qu'on TE cache" monte en affirmation, "quatre cents MILLIARDS" plus affirmatif/fier)
- **Tags recommandes** : `[solemn]`, `[tense]`, `[proud]`, `[awe]`, `[whispers]` pour la close
- **Speed** : 0.90 (ne pas descendre sous 0.88 — voix devient trop lente)
- **Verdict** : version enrichie (pauses + tags emotion) = clairement superieure a version pauses seules

### Narratrice GeoAfrique v2 (VOIX ACTIVE) — profil valide par test (2026-04-19)
- **Voice ID** : `z3gESu49naEZW8Af2Upm`
- **Origine** : Voice Remix de la Narratrice originale (Y8XqpS6sj6cx5cCTLp8a)
- **Remix prompt** : "Make this voice more expressive and dynamic. Add a warm West African French rhythm with naturally elongated vowels. Increase energy and emotional range for YouTube storytelling narration."
- **Remix prompt_strength** : 0.45
- **Caracteristique** : voix feminine, plus expressive que l'originale, rythme ouest-africain
- **Config max-style validee** :
  ```python
  {
      "stability": 0.22,        # Ultra-Creative — maximum de reactivite aux tags
      "similarity_boost": 0.55, # Libere la voix de sa cible originale
      "style": 0.55,            # Expressivite maximale
      "speed": 1.0              # Vitesse normale (pas de ralentissement)
  }
  ```
- **Audio tags** : fonctionnent bien avec cette config. Confirmes perceptibles : `[solemn]`, `[tense]`, `[dramatic tone]`, `[awe]`, `[proud]`, `[whispers]`, `[excited]`, `[melancholic]`
- **Pauses** : PAS de pauses supplementaires — la voix est deja lente. Les pauses existantes dans le script suffisent.
- **MAJUSCULES** : fonctionnent pour emphase

### Narratrice GeoAfrique originale — ARCHIVEE (2026-04-12)
- **Voice ID** : `Y8XqpS6sj6cx5cCTLp8a`
- **Probleme** : sonne robotique/synthetique car Voice Design (pas clone). Remplacee par v2 remixee.
- **Speed** : 0.92 (leger accelerateur pour compenser le debit naturel lent)

---

## Parametres actifs (valides par experience)

### Config "max-style" (RECOMMANDEE pour narration expressive — validee 2026-04-19)
```python
{
    "model_id": "eleven_v3",
    "voice_settings": {
        "stability": 0.22,       # Ultra-Creative — max de reactivite aux tags
        "similarity_boost": 0.55, # Libere la voix
        "style": 0.55,           # Expressivite maximale
        "speed": 1.0,            # Vitesse normale
    },
    "output_format": "mp3_44100_128",
}
```

### Config "conservative" (pour voix qui deraillent avec max-style)
```python
{
    "model_id": "eleven_v3",
    "voice_settings": {
        "stability": 0.30,       # Mode Creative standard
        "similarity_boost": 0.75,
        "style": 0.25,
        "speed": 0.90,
    },
    "output_format": "mp3_44100_128",
}
```

### Stability — parametre LE PLUS IMPORTANT en V3

| Valeur | Mode | Effet |
|--------|------|-------|
| 0.20-0.35 | Creative | Expressif, repond parfaitement aux audio tags — notre zone |
| 0.40-0.55 | Natural | Equilibre, fidele a la voix, moins reactif aux tags |
| 0.70+ | Robust | Stable mais SOURD aux audio tags — a eviter |

**Regle absolue** : rester entre 0.25-0.35. Au-dela, les audio tags perdent leur effet.

### Speed par type de segment

| Segment | Speed | Raison |
|---------|-------|--------|
| Hook / accroche | 0.88-0.90 | Tension, rythme soutenu |
| Corps narratif | 0.90-0.92 | Clair, pose |
| Moments dramatiques | 0.82-0.85 | Laisser respirer |
| Dialogue | 0.85 | Naturel, humain |
| CTA final | 0.88 | Direct, net |

---

## Audio Tags V3 — Systeme complet

**Principe** : tags entre crochets places JUSTE AVANT le mot ou la phrase a affecter.
**Volume** : 40+ tags officiels, ~1450 variants reconnus.
**SSML** : NON supporte en V3. Pas de `<break time="1s"/>`. Utiliser les tags ci-dessous.

### Emotions & ton

```
[sorrowful]      — tristesse profonde, deuil
[awe]            — admiration, reverence
[excited]        — enthousiasme
[tired]          — fatigue, epuisement
[sarcastic]      — ironie
[curious]        — questionnement
[dramatic tone]  — ton dramatique general
[tense]          — tension narrative
[solemn]         — solennel, grave
[proud]          — fierte
[melancholic]    — melancolie douce
```

### Livraison vocale

```
[whispers]    — chuchotement (puissant pour closes intimes)
[quietly]     — voix basse sans chuchoter
[calm]        — apaisant, pose
[shouting]    — cri (parcimonie)
```

### Sons non-verbaux (inserer dans le script)

```
[sighs]                — soupire (bon avant une revelation)
[takes a deep breath]  — souffle avant moment fort
[inhales sharply]      — surprise, choc
[exhales]              — relachement de tension
[clears throat]        — transition naturelle
[laughs]               — rit
```

### Pauses et rythme

```
[pause]       — pause naturelle (~0.5s)
[short pause] — micro-pause (~0.2s)
[long pause]  — pause dramatique (~1s+)
```

**REGLE VALIDEE PAR TEST (2026-04-12) — pauses minimalistes + tags emotion**

Formule optimale : audio tags de couleur + pauses courtes placees aux bons moments.
Les pauses sont des signaux narratifs, pas des outils de rythme general.

| Tag | Quand | Notes |
|-----|-------|-------|
| `[pause]` | Apres revelation chiffree forte, avant question rhetorioue | Max 2-4 selon voix |
| `[long pause]` | A EVITER avec les deux voix GeoAfrique | Semble trop long |
| `[short pause]` | Micro-transition legere | Possible si necessaire |
| Retour a la ligne seul | Transition entre beats | Standard (libre) |
| Em-dash `—` | Rythme interne d'une phrase | Libre |

**Placements confirmes qui fonctionnent :**
- Apres un chiffre fort : "Quatre cents MILLIARDS de dollars. [pause]"
- Avant une question rhetorioue : "[pause] Mais qui a fait la traversee en premier ?"
- Avant la close chuchotee : "[pause] [whispers] Et pourtant..."

**Ce qui enrichit sans ralentir** : tags emotion/ton — zero duree ajoutee.
`[solemn]`, `[tense]`, `[proud]`, `[awe]`, `[whispers]` tous confirmes perceptibles.

### Tags combinables (stacking)

```
[sad][whispers]          — chuchotement melancolique
[awe][quietly]           — admiration reverentielle
[solemn][dramatic tone]  — ton grave et theatral
[tense][quietly]         — tension chuchotee
```

---

## Arsenal de techniques de script

### 1. Audio tags (V3 natif) — a privilegier
```
"En treize cent onze, [pause] un homme abdique son trone.
[long pause]
[whispers] Et pourtant — l'histoire a presque oublie son nom."
```

### 2. Retours a la ligne = pauses longues (tres fiable)
Un blanc entre deux paragraphes = pause longue naturelle.
Deux blancs = tres longue pause.
```
"Il ne reviendra jamais.

Cent quatre-vingt-un ans plus tard, Christophe Colomb traverse le meme ocean."
```

### 3. Em-dash = pause courte naturelle
```
"Il abdique. Il quitte son trone — son or — son pouvoir."
```
Double `— —` = pause plus longue.

### 4. Ellipses = hesitation, respiration
```
"Mais... qui a fait la traversee en premier ?"
```

### 5. Majuscules = emphase (V3 les supporte — ancienne regle "interdites" = obsolete)
```
"Ce n'est PAS ce que l'histoire officielle raconte."
"Il a ABDIQUE son trone."
"Quatre cents MILLIARDS de dollars."
```
Note : en V3, les majuscules sont un outil d'emphase valide. L'ancienne regle
"majuscules interdites" s'appliquait a des modeles anterieurs.

### 6. Dialogue tags dans le texte
```
"— L'empire est a toi, Moussa, dit-il calmement."
```
Le modele lit "dit-il calmement" comme indication de jeu — effet subtil mais reel.

### 7. Deuxieme personne pour les closes = ton plus intime
```
"L'Afrique a une histoire qu'on TE cache."   # Plus fort que "qu'on lui cache"
"Et c'est son nom que TU retiens."
```

---

## Regles francais (NON-NEGOTIABLE — scanner AVANT chaque script)

| Interdit | Correction |
|---------|-----------|
| Participes en "e/ee" fin de groupe : "terrifie", "obsede", "racontee" | Verbe conjugue : "la terreur le saisit", "qu'on te cache" |
| "ont + voyelle" : "ont accosté" | Passe simple : "firent escale" |
| Chiffres : "1311", "2000", "181" | Lettres : "treize cent onze", "deux mille", "cent quatre-vingt-un" |
| Noms de villes avec "s" final | Ecrire phonetiquement si necessaire |
| Accents manquants : "hante" sans accent | Toujours ecrire les accents dans le script Python |

**Scan obligatoire** : lister TOUS les mots en "e/ee" avant generation, verifier un par un.

---

## Template de script GeoAfrique (structure type annotee V3)

```
[HOOK — tension immediate]
En [date en lettres], [situation impossible]. [pause] Personne n'ose [action]. [pause] Sauf un homme.

[pause]

[PROTAGONIST — identite puissante]
[Nom]. [Titre]. [Pouvoir en chiffres en lettres]. [pause] Mais [faille/obsession].

[pause]

[ACTE 1 — escalade]
[takes a deep breath] Il [action audacieuse]. [pause] [Obstacle]. [pause] [Reaction inattendue].

[pause]

[PIVOT — decision irreversible]
[Nom] ne recule pas. [pause] Il [sacrifice]. [pause] [Consequence immediate].

[pause]

[ACTE 2 — consequence historique]
[Successeur/contexte]. [pause] [Contraste saisissant en majuscules sur le mot cle].

[pause]

[RECONTEXTUALISATION — la pique]
[Comparaison temporelle]. [pause] Et c'est [autre nom] que le monde retient.

[pause]

[CLOSE — intime, deuxieme personne]
[whispers] Et pourtant — l'histoire a presque oublie son nom.
L'Afrique a une histoire qu'on TE cache. [pause] Pour en savoir plus, le lien est en bio.
```

---

## Voice Remixing (decouvert 2026-04-19)

**Quoi** : transforme une voix existante en modifiant ses attributs (accent, style, pacing, expressivite) tout en gardant son identite. La sortie est un modele V3 complet.

**Endpoint** : `POST https://api.elevenlabs.io/v1/text-to-voice/{voice_id}/remix`

**Parametres cles** :
- `voice_description` (string) : changements a appliquer en langage naturel
- `text` (string, 100-1000 chars) : texte de preview (doit correspondre au ton vise)
- `prompt_strength` (0-1) : force de la transformation. 0.45 = medium (notre sweet spot)
- `guidance_scale` (default 2.0) : adherence au prompt

**Niveaux de prompt_strength** :
- Low (0.1-0.3) : subtil, garde la voix originale
- Medium (0.4-0.5) : equilibre — NOTRE ZONE
- High (0.6-0.8) : forte transformation, peut changer la tonalite
- Max (0.9-1.0) : transformation complete, perd l'identite vocale

**Retour** : 3 previews audio + generated_voice_id pour chacun. Sauvegarder le meilleur via `POST /v1/text-to-voice/create-voice-from-preview`.

**Workflow valide** :
1. Remixer voix originale avec prompt_strength 0.45
2. Ecouter les 3 previews, choisir le meilleur
3. Sauvegarder comme nouvelle voix
4. Optionnel : re-remixer la nouvelle voix pour affiner
5. Tester avec tags V3 + config max-style avant de valider

**Lecon apprise** : Voice Design seule = souvent robotique. Voice Design + Remix V3 = bien meilleur. Le remix recalibre la voix pour V3 et ajoute de l'expressivite.

---

## Forced Alignment (decouvert 2026-04-19)

**Quoi** : donne un audio + son texte, retourne les timestamps exacts de chaque mot.

**Endpoint** : `POST https://api.elevenlabs.io/v1/forced-alignment`

**Format** : multipart form-data
- `file` : fichier audio (mp3, wav, etc., max 1GB)
- `text` : texte en clair (plain string, pas de tags/markdown)

**Retour** :
```json
{
  "words": [
    {"text": "Un", "start": 0.10, "end": 0.18, "loss": 0.66},
    {"text": "devin", "start": 0.22, "end": 0.84, "loss": 0.14},
    ...
  ],
  "characters": [...],
  "loss": 0.125  // confiance globale (plus bas = mieux)
}
```

**Impact pipeline** : remplace Whisper pour le storyboarder.
```
AVANT : Audio -> ffprobe (duree) -> Whisper (timestamps) -> storyboarder
APRES : Audio -> Forced Alignment (duree + timestamps en 1 appel) -> storyboarder
```

**Avantages vs Whisper** :
- Plus precis (on lui donne le texte exact, pas de transcription a deviner)
- Plus rapide (1 seul appel API)
- Score de confiance par mot (`loss`)
- Detecte automatiquement les pauses entre mots

**Regles d'utilisation** :
- Le `text` doit etre en PLAIN STRING — pas de tags V3, pas de markdown, pas de guillemets decoratifs
- Cout = meme tarif que Speech-to-Text (quasi rien pour 2-3min)
- Max 3GB / 10h audio / 675K chars texte
- 29 langues supportees dont le francais

**L'agent audio-director DOIT utiliser Forced Alignment apres chaque generation TTS.**

### Bug Forced Alignment v1 — timestamps bloques (2026-05-14)

**Symptome** : tous les timestamps retournes sont identiques (ex: `start: 6.56, end: 6.56` pour chaque mot). L'audio est correct mais l'alignement est corrompu.

**Cause** : endpoint v1 (`/v1/forced-alignment`) peut retourner des resultats defectueux sur certains fichiers MP3.

**Solution** : regenerer via endpoint v2 (`/v2/forced-alignment`). Le v2 retourne des timestamps corrects.

```python
# v1 (peut etre corrompu)
response = requests.post(
    "https://api.elevenlabs.io/v1/forced-alignment",
    headers={"xi-api-key": ELEVENLABS_API_KEY},
    files={"file": open(audio_path, "rb")},
    data={"text": plain_text}
)

# v2 (si v1 corrompu)
response = requests.post(
    "https://api.elevenlabs.io/v2/forced-alignment",
    headers={"xi-api-key": ELEVENLABS_API_KEY},
    files={"file": open(audio_path, "rb")},
    data={"text": plain_text}
)
```

**Detection automatique du bug** : si `words[0].start == words[1].start == words[2].start` → timestamps bloques → passer en v2 immediatement.

### Whisper — regles d'utilisation (2026-05-14)

**Aziz preference** : utiliser l'API OpenAI Whisper (`openai.audio.transcriptions.create`), pas Whisper en local.

**Pourquoi** : Whisper local = dependances lourdes, GPU optionnel, gestion de process background compliquee. API OpenAI = simple, fiable, meme qualite.

```python
from openai import OpenAI
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

with open(audio_path, "rb") as f:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=f,
        response_format="verbose_json",  # pour avoir les timestamps
        timestamp_granularities=["word"]
    )
```

**Usage dans le pipeline** : Forced Alignment ElevenLabs v2 EN PREMIER (plus precis). Whisper API en COMPLEMENT si crossvalidation necessaire (ex: verifier syllabe ambigue). Jamais Whisper local.

**⭐ Usage DIAGNOSTIC (validé 2026-07-05, War-Map Sahel)** : pour tout DOUTE sur un doublon/décalage/
contenu audio précis (ex. "j'entends une phrase répétée deux fois"), lancer le force-alignment
(`scripts/tools/whisper-align.py <clip.mp3> --out <file>.ts`, ~$0.02/run) sur un clip court de la zone
suspecte AVANT toute chose — pas de calcul manuel de mapping timestamp↔frame. Le texte+timestamps exacts
tranchent en quelques minutes ce qu'une investigation manuelle ne ferait que deviner. Preuve : a confirmé
en 2 minutes un vrai doublon ("tensions entre communautés couvent encore" répété 2x, cause = chevauchement
entre un backup TTS resynthétisé et un splice mal borné) que le calcul manuel n'avait pas su localiser.
Réflexe à adopter systématiquement, sans attendre qu'Aziz le suggère.

---

## Voice Design — Guide de prompt (doc officielle 2026-04-19)

**Format recommande** :
```
"Native <Language>. <Gender>, <Age range>. <Quality level>.
Persona: <2-5 words>. Emotion: <2-3 adjectives>.
<1-2 sentences about timbre, pacing, delivery>"
```

**Qualite audio** : "Broadcast quality" ou "Studio quality" (attention : peut reduire la precision pour voix niches)

**Guidance Scale** : 20-40% selon les exemples officiels. Narration calme = 30-35%.

**Piege a eviter** : ne PAS utiliser le mot "accent" pour decrire l'intonation — ca declenche un drift dialectal. Decrire par l'ORIGINE GEOGRAPHIQUE.

**Piege a eviter** : ne PAS inclure de termes d'effets audio ("reverb", "echo", "phone", "tape") — degrade la qualite.

---

## ─── RÉFÉRENCE — consulter au besoin ───────────────────────────────────

## Sound Effects API (valide 2026-04-21)

**Endpoint** : `POST https://api.elevenlabs.io/v1/sound-generation`

**Parametres** :
- `text` (string, required) : description du son en anglais
- `duration_seconds` (number, 0.5-30) : duree en secondes, auto si null
- `prompt_influence` (0-1, default 0.3) : adherence au prompt. 0.3-0.5 = zone utile
- `model_id` (string, default `eleven_text_to_sound_v2`)
- `loop` (boolean, v2 only) : son en boucle
- `output_format` (query param) : mp3_44100_128, pcm_48000, etc.

**Headers** : `xi-api-key` + `Content-Type: application/json`
**Retour** : binary audio (application/octet-stream)

**Usage valide** : ambiance feu/flammes pour scene 6C Sonjata Papercraft. 3 variantes generees, 7s chacune, ~110 KB MP3 chacune.

**Integration Remotion** : `<Audio src={staticFile(sfx)} volume={0.3} />` dans la Sequence du clip concerne.

**Prompts qui marchent** :
- Feu intense : "Intense crackling fire, burning village, wood snapping, embers popping, roaring flames in the distance"
- Ambiance : "Ambient crackling campfire with distant burning, soft flames licking wood, occasional ember pops"
- Village brule : "A village burning in the distance, crackling wood, roaring fire, wind carrying smoke, devastation ambiance, no music no voices"

---

## Pipeline TTS-safe long format (Sahel V5, 2026-06-10)

**Limite 5000 caractères/appel** (`eleven_v3`) : un script mid-form (7min ~7000 chars) DÉPASSE.
→ Découper en 2+ segments à un `[pause]` naturel → générer chacun → concat ffmpeg (re-encode
libmp3lame, PAS copy, pour éviter glitch de concat MP3). Modèle : scripts/generate-sahel-narration-v5.py.

**Scan anti-pièges AVANT appel (scriptable)** : regex `\bont\s+[voyelle]` (liaison) + `\b\d+\b` (chiffres
arabes → écrire en lettres) + participes `-é/-ée/-és/-ées` en fin de groupe (drop d'accent). Reformuler :
- participe fin de groupe → verbe présent actif ("routes coupées" → "on y coupait les routes").
- "ont + voyelle" → présent ("ils ont expulsé" → "ils chassent") ou auxiliaire sans liaison voyelle.
- "n'a encore tranchée" → "encore en suspens". "ont échoué" → "avaient échoué".

**Réglages expressivité** : `stability` BAS = plus de variation émotionnelle (0.22 défaut Sahel ; tester
0.10/0.05 + style 0.75-0.90 si trop monotone). Voir benchmark `memory/tools/TTS-VOIX-VIVANTE-BENCHMARK-2026-06.md`.

**Granularité = générer la narration par BEAT, pas en bloc (prouvé cacao-chocolat 2026-06-28)** : un fichier
audio par beat (beat1.mp3, beat2.mp3…) plutôt qu'un seul monolithe. AVANTAGE : un beat qui sonne faux (participe,
intonation, erreur TTS FR comme "pèse"/"sous-payée") se RÉGÉNÈRE seul, sans refaire toute la narration (itération
bon marché) ET le timing audio-derived se mesure par beat (ffprobe par fichier) = storyboard plus simple. Garder
`beatN-FINAL.mp3` + une version COMPLETE concaténée (concat `filter_complex`, PAS `-c copy` qui casse les timestamps).

⚠️ **GOTCHA `--only-part` de `generate-narration-expressive.py` (Soudan Acte 6, 2026-07-19)** : régénérer UNE
seule partie avec `--only-part pN` NE re-concatène PAS le fichier complet (message "pas de concat global :
mode partie unique"). Le `.mp3` global garde donc l'ANCIENNE durée → on peut présenter par erreur un lien
qui pointe vers la version périmée. APRÈS tout `--only-part`, re-concaténer MANUELLEMENT les parties :
`ffmpeg -y -i p1 -i p2 ... -filter_complex "[0:a][1:a]...concat=n=N:v=0:a=1[out]" -map "[out]" -c:a libmp3lame -q:a 2 out.mp3`
(filter_complex, jamais `-c copy`). Toujours revérifier la durée `ffprobe` du global après re-concat.
