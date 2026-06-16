# Minimax Music 2.6 — Guide complet

> Mise a jour : 2026-05-24
> Endpoint musique : `fal-ai/minimax-music/v2.6`
> Endpoint TTS : `fal-ai/minimax/speech-2.8-hd` (validé 2026-05-24)
> **Note** : consulter ce fichier AVANT tout appel Minimax

## Minimax TTS — speech-2.8-hd (validé 2026-05-24)

```python
import fal_client, os
os.environ['FAL_KEY'] = '...'

result = fal_client.subscribe(
    'fal-ai/minimax/speech-2.8-hd',
    arguments={
        'text': 'Votre texte ici',
        'voice_id': 'French_Calm_Woman',  # voix FR neutre validée
        'speed': 1.0,
        'emotion': 'neutral'
    },
    with_logs=True
)
# result['audio']['url'] → MP3 téléchargeable
```

**Voix FR disponibles** : `French_Calm_Woman` (neutre, posée)
**Durée** : ~35s pour un script de 26s lu (débit naturel légèrement plus lent qu'ElevenLabs)
**Gotcha** : ne pas mettre de tags `[solemn]` etc. — Minimax TTS ne les interprète pas comme ElevenLabs

## Minimax Voice Clone — fal-ai/minimax/voice-clone

```python
result = fal_client.subscribe(
    'fal-ai/minimax/voice-clone',
    arguments={
        'audio_url': 'https://files.catbox.moe/ienj91.mp3',  # sample 30s narratrice
        'text': SCRIPT,
        'speed': 1.0
    }
)
# result['custom_voice_id'] → réutilisable pour appels suivants
# result['audio']['url'] → MP3 final
```

**Voix GéoAfrique clonée** :
- Sample source : `https://files.catbox.moe/ienj91.mp3` (30s depuis narration-v1-clean.mp3, offset 5s)
- custom_voice_id : `Voicebbc56c501780172741` (généré 2026-05-24 — peut expirer, recloner si besoin)
- Résultat validé accroche Sénégal Beat0

---

## Endpoint et payload

```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/minimax-music/v2.6",
    arguments={
        "prompt": "Traditional Mande griot music from Mali, 13th century...",
        "is_instrumental": True,
    },
    with_logs=True,
)
```

**Parametres actifs** :
- `prompt` (string, 10-2000 chars) — description style/mood/genre
- `is_instrumental` (bool) — **TRUE pour musique de fond sans voix**
- `lyrics` (optionnel, 3500 chars max) — paroles avec tags `[Intro] [Verse] [Chorus]`
- `lyrics_optimizer` (optionnel, bool) — auto-generate paroles
- `audio_setting` (optionnel, objet) — format / bitrate

**Schema name** : `TextToMusic26Request`

---

## Gotchas critiques (validation 2026-04-22)

### 1. Bug historique `reference_audio_url`
L'endpoint `fal-ai/minimax-music` (sans version, ou v1.5) attend `reference_audio_url`. String vide = 422 au fetch. Jobs marques "COMPLETED" sans resultat telechargeable.
**Solution** : TOUJOURS utiliser `v2.6` explicite. Le champ `reference_audio_url` n'existe pas dans v2.6.

### 2. Conflit prompt "instrumental" + `is_instrumental`
NE PAS mettre le mot "instrumental" dans le prompt si `is_instrumental: true` est deja passe. Cause validation 422 (observe 2026-04-22 sonjata).

### 3. `duration_seconds` ignore
Le modele genere la duree qu'il veut (typiquement 2-9 minutes). Pas de controle direct.
**Solution** : trim avec ffmpeg `-t N` apres generation, ou laisser Remotion tronquer via `<Sequence durationInFrames>`.

---

## FORMULE PROMPT VALIDEE (validee 2026-04-12 + reconfirmee 2026-04-22)

Les prompts generiques produisent une sortie ELECTRONIQUE non-africaine. Le modele empile des synthes par defaut. Appliquer SYSTEMATIQUEMENT :

1. **Artiste specifique nomme** — ex: "Style of Toumani Diabate" pour kora Mande
2. **1-2 instruments principaux** — PAS 5 instruments empiles
3. **Rythme precis** — "gentle 6/8 rhythm", BPM explicite
4. **Texture organique** — "warm, acoustic, organic"
5. **Interdictions directes** — "No synthesizers, no electronic sounds" **OBLIGATOIRE**
6. **Origine culturelle precise** — "Traditional Mande griot music from Mali", PAS "West African"

### Prompts valides — Sénégal Pétrole & Gaz (2026-05-22)

Ton : documentaire analytique moderne, souveraineté africaine, tension géopolitique. PAS Mande médiéval.

**A — Ambient Souverain** (Ballaké Sissoko, kora + basse ambient, 72 BPM, 321s générée)
```
Modern African documentary score. Sparse kora melody over slow, deep ambient bass.
Style of Ballake Sissoko. Slow 4/4 rhythm, 72 BPM.
Warm, minimal, dignified, introspective. Tension underneath.
No synthesizers, no electronic beats, no orchestral strings, no chorus.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3`

**B — Kora + Percussions** (Toumani Diabate doc score, 68 BPM, 184s générée)
```
Contemporary African score blending traditional kora with slow deep percussion.
Style of Toumani Diabate meets a documentary film score.
Deep dundun bass rhythm at 68 BPM. Kora melody on top, meditative.
Sparse, serious, organic. No synthesizers, no hi-hats, no electronic elements.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3`

**C — Sabar Cinématique** (Youssou N'Dour film score, 75 BPM, 258s générée)
```
Slow cinematic Afrobeat documentary score from Senegal.
Sabar drum pattern at 75 BPM, acoustic bass, sparse guitar melody.
Style of Youssou N'Dour film score. Dignified, modern, grounded.
No synthesizers, no electronic elements, no vocals, no upbeat energy.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3`

Script dédié : `scripts/tools/minimax-senegal-music.py` — réutiliser comme template pour chaque nouvel épisode (changer `OUT_DIR` + `VARIANTS`).

---

### Prompts valides (Sonjata session 8, 2026-04-22)

**A — Griot intime (retenu)** — Toumani Diabate, solo kora + balafon
```
Traditional Mande griot music from Mali, 13th century empire era.
Solo kora with slow balafon accents. Style of Toumani Diabate.
Gentle 6/8 rhythm, acoustic, warm, organic, meditative.
No synthesizers, no electronic sounds, no drums except soft dundun.
```
Duree generee : 157s. Valide par Aziz : "rythmes contemplatif + percussions, mix parfait".

**B — Griot royal** — Sidiki Diabate, kora + djembe + dundun
```
Traditional Mande griot music from Mali. Solo kora with deep balafon
melody, joined by acoustic djembe and dundun drums in slow 6/8 rhythm.
Style of Sidiki Diabate. Building from contemplative to majestic.
Warm, acoustic, organic, royal. No synthesizers, no electronic sounds,
no orchestral strings.
```
Duree : 168s.

**C — Griot guerrier** — Neba Solo, djembe + dundun + balafon
```
Traditional Mande warrior music from Mali, 13th century. Acoustic
djembe and dundun drums in powerful 6/8 rhythm, joined by balafon
melody. Style of Neba Solo. Tense, earthy, tribal, triumphant.
No synthesizers, no electronic sounds, no modern instruments.
```
Duree : 520s (8:40) — imprevu, mais utile pour versions longues.

---

## ANTI-PATTERN (rejete, a ne PAS reproduire)

```
Epic West African orchestral, kora melody, djembe and dunun percussion,
balafon accents, majestic warm tones, building intensity from contemplative
to triumphant, cinematic, 95 BPM
```

**Pourquoi ca echoue** :
- "West African" trop generique (vs "Mande from Mali")
- 4+ instruments empiles (vs 1-2 nommes)
- Pas d'artiste de reference (Gemini improvise)
- Mots dangereux : "orchestral", "cinematic" poussent vers les synthes
- Pas d'interdiction "no synths"

Resultat observe 2026-04-22 : "accents electroniques tres pousses, pas africain ancien" (rejete par Aziz).

---

## Workflow production

### Test rapide (1 variante, ~$0.10)
```bash
python3 scripts/tools/minimax-music-test.py
```
Mesure duree reelle + sauvegarde dans `sonjata-papercraft/audio/music/`.

### 3 variantes parallele (~$0.30, ~6min)
```bash
python3 scripts/tools/minimax-music-3variants.py
```
Genere A/B/C simultanees, telecharge, probe duree. Upload en gallery Vercel :
```bash
python3 scripts/tools/upload-to-blob.py --gallery "Title" \
  sonjata-papercraft/audio/music/v2-A-*.mp3 ... \
  --folder sonjata-papercraft/music-review
```

### Temps d'attente typiques
- Submit : <1s
- Job complete : 2-4 minutes par job (Minimax est lent)
- Download : <5s
- Total 3 variantes parallele : ~6 minutes

---

## Cout et limites

- **$0.10 par generation** (estimation fal.ai)
- Max 1 appel a la fois recommande (pas de rate limit observe mais parallelisable)
- 3 variantes simultanees = $0.30, suffit pour comparaison A/B/C

---

## Mix audio (regle projet)

- **Volume musique** : 0.15 dans Remotion (= ~-16.5dB) — compatible regle "-18dB sous narration"
- **Fade-in** : 2s (60 frames @30fps)
- **Fade-out** : 2s avant fin composition
- Utiliser `<Audio volume={frame => ...}>` avec `interpolate` clamped

Voir src/projects/geoafrique-shorts/SonjataShortFull.tsx pour l'implementation reference.

---

## References

- Doc Context7 fal.ai : `/websites/fal_ai_models` query "minimax-music v2.6"
- Clip reference validation : `sonjata-papercraft/audio/music/v2-A-griot-intime.mp3`
- Integration Remotion : src/projects/geoafrique-shorts/SonjataShortFull.tsx
- Script test solo : `scripts/tools/minimax-music-test.py`
- Script 3 variantes : `scripts/tools/minimax-music-3variants.py`

---

# Minimax Speech 2.8 HD + Voice Clone — Guide TTS

> Validé 2026-05-19 (test session R&D sur voix GeoAfrique).
> Endpoints actifs : `fal-ai/minimax/voice-clone` + `fal-ai/minimax/speech-2.8-hd`
> **Verdict Aziz** : "Très bon, plus de punch que ElevenLabs sur certains passages. Ne remplace pas ElevenLabs, mais s'ajoute au stack."

## Quand utiliser Minimax TTS (vs ElevenLabs)

- **Comparaison A/B narration** : générer 1 version ElevenLabs + 2 versions Minimax (presets différents) pour le même script. Aziz choisit à l'oreille.
- **Narrations longues budget-sensible** : Minimax = $0.10 / 1000 chars vs ElevenLabs ~$0.30. Pour un script Atlas 8-15min (~10k chars), économie réelle.
- **Voix avec punch / énergie** : Aziz a noté que Minimax neutral/happy ont plus de "beats" qu'ElevenLabs équivalent.

## Workflow voice clone (one-shot)

```python
import fal_client

# 1. Upload privé (PAS catbox — narration interne projet)
audio_url = fal_client.upload_file("/path/to/sample-25s.mp3")

# 2. Clone
result = fal_client.subscribe(
    "fal-ai/minimax/voice-clone",
    arguments={
        "audio_url": audio_url,
        "noise_reduction": True,
        "need_volume_normalization": True,
        "model": "speech-02-hd",  # ← OK, le voice_id fonctionne aussi sur 2.8 HD
    },
)
custom_voice_id = result["custom_voice_id"]
```

**Specs sample source** :
- Durée : 20-30s suffit (≥10s requis). Trim ffmpeg depuis le milieu d'une narration propre.
- Mono 44.1kHz MP3 192kbps validé. WAV OK aussi.
- **Zéro musique, zéro SFX dans le sample** — voix seule.

**Coût** : $1.50 par clonage.

**Persistance** : voice_id expire après **7 jours sans usage TTS**. Pour pin : 1 appel TTS hebdo minimum, ou re-cloner.

## Workflow TTS (Speech 2.8 HD avec voix clonée)

```python
result = fal_client.subscribe(
    "fal-ai/minimax/speech-2.8-hd",
    arguments={
        "text": TEXT,
        "voice_setting": {
            "voice_id": custom_voice_id,
            "speed": 1.0,
            "vol": 1.0,
            "pitch": 0,
            "emotion": "neutral",  # voir presets validés ci-dessous
        },
        "audio_setting": {
            "sample_rate": 44100,   # INT, pas string
            "bitrate": 256000,      # INT, pas string
            "format": "mp3",
            "channel": 1,           # INT
        },
        "language_boost": "French",
        "output_format": "url",
    },
)
url = result["audio"]["url"]
```

**Coût** : $0.10 / 1000 chars (~$0.13 pour une narration 1m30, ~$1 pour 10min Atlas).

## Presets emotion validés (Aziz 2026-05-19)

7 valeurs enum : `neutral, happy, sad, angry, fearful, disgusted, surprised`.
**Aziz préfère** : `neutral` et `happy` (les deux ont le plus de naturel + punch sur narration GeoAfrique). Workflow projet : générer ces 2 + une version ElevenLabs pour A/B.

## Markers texte — GOTCHA CRITIQUE (validé 2026-05-19)

**Seuls 2 markers fonctionnent réellement** sur voix française :
- `<#0.X#>` (pauses en secondes) — ✅ marche parfaitement
- `(sighs)` — ✅ produit un soupir audible (sonne plus comme une respiration/arrêt qu'un vrai soupir, mais exploitable)

**Markers PARASITES (prononcés comme du texte, à ÉVITER)** :
- `(laughs)` → la voix dit "rire" littéralement
- `(clears throat)` → la voix dit les mots
- `(gasps)` → idem
- `(coughs)` `(sniffs)` `(groans)` `(yawns)` → probablement idem (non testés en FR)

**Hypothèse confirmée** : la voix s'**adapte automatiquement** à la sémantique du texte. Sur narration "soixante mille esclaves vêtus de soie persane", `neutral` ralentit et adoucit le ton sans qu'on demande. Sur la chute "ce sont les idées qui restent", il y a un poids naturel. **Donc règle production : texte propre + 2-3 pauses dramatiques bien placées, rien d'autre.**

## Pricing récap

| Action | Coût |
|---|---|
| Voice clone (one-shot, voice_id réutilisable 7j) | $1.50 |
| TTS (1000 chars) | $0.10 |
| Narration 1m30 (≈1200 chars) | ~$0.12 |
| Narration 10min Atlas (≈10k chars) | ~$1.00 |

## Limites vs ElevenLabs V3

- ❌ Pas de mix d'émotions inline (1 emotion par appel uniquement)
- ❌ Pas de markers contextuels riches (`[whispers]`, `[excited]`)
- ❌ Pour multi-émotions : générer en plusieurs appels et concat ffmpeg
- ✅ Auto-adaptation sémantique très bonne (compense partiellement le manque de markers)
- ✅ Pricing 3x moins cher
- ✅ Voice clone $1.50 one-shot vs ElevenLabs professional voice clone plus complexe

## Schema gotchas

- `audio_setting` : tous les nombres en **INT**, pas strings. `"32000"` → fail 422. `32000` → OK.
- `voice_setting.voice_id` accepte presets Minimax (`Wise_Woman` etc.) OU `custom_voice_id` retourné par voice-clone.
- `language_boost: "French"` — required pour qualité optimale FR (sinon prosodie EN par défaut).

## Sample R&D session (2026-05-19)

- Sample source : `public/souverain/niger-uranium/audio/narration-niger-uranium-v5.mp3` trim 15-40s mono 44.1kHz
- Voice cloné : `Voiced5bd2f9e1779163839` (expire ~2026-05-26 sans usage)
- Renders test : `out/_r-and-d/minimax-voice-clone-test/`
  - `clean_neutral.mp3` (74s) — référence narration pure
  - `clean_happy.mp3` (78s) — alternative validée Aziz
  - `long_*` — avec markers parasites (mauvais exemple à ne pas reproduire)
- Coût total session test : **~$2.50** (clone + 12 TTS variantes)

## Workflow recommandé pour future production

1. **Re-cloner** la voix GeoAfrique au début de chaque épisode (sample fresh depuis dernière narration ElevenLabs validée) — $1.50
2. **Générer 3 versions du même script** : `ElevenLabs (référence)` + `Minimax neutral` + `Minimax happy`
3. **A/B aveugle** par Aziz, choix de la voix par épisode (pas forcément la même partout)
4. **Markers à utiliser** : seulement `<#0.X#>` pauses. Zéro `(...)` interjection.
5. **Pin voice_id** : appel TTS factice 1x/semaine si gap entre épisodes

---

## Pattern : musique 1 morceau → plusieurs durées vidéo (fenêtre + fade) — validé 2026-06-05

**Problème** : une vidéo évolue en durée (22s → 32s → 60s pendant l'itération). Il faut une musique qui colle à CHAQUE durée sans coupure brutale ni raccord audible.

**Solution validée (war-map Soudan)** : générer UN seul morceau, en garder le brut complet, puis découper une fenêtre par durée avec fondu de sortie. JAMAIS assembler plusieurs morceaux (raccords audibles) ni régénérer (ambiances différentes).

1. **Générer 1 fois** via Minimax v2.6 (`is_instrumental: true`). Le modèle sort 2-9 min (typique ~146s). **Garder le brut complet** (`music_raw.mp3`).
2. **Découper une fenêtre par durée** depuis le MÊME brut + fade out :
```bash
# 60s : prend les 60 premières secondes du morceau + fondu in 1.5s + fondu out 3s
ffmpeg -i music_raw.mp3 -t 60 -af "afade=t=in:st=0:d=1.5,afade=t=out:st=57:d=3,volume=0.9" -c:a libmp3lame -b:a 192k score-epic.mp3
```
3. Nommer par durée : `score.mp3` (22s) / `score-long.mp3` (32s) / `score-epic.mp3` (60s). Le code choisit selon le mode (ex. `epic ? "score-epic" : ...`).

**Pourquoi ça sonne parfait, jamais coupé** :
- Même morceau = même beat/tonalité/instrumentation du début à la fin, zéro transition à raccorder.
- Le brut (146s) >> la vidéo (60s) → on coupe en plein développement, jamais à un endroit "fini".
- Le `afade=out` (2-3s) masque la coupure : l'oreille perçoit une CONCLUSION, pas un arrêt net.

**Limite** : marche tant que la vidéo < durée du brut. Pour 3+ min : générer un morceau plus long OU vraie boucle (point de boucle calé sur le beat, pattern Remotion 2e `<Audio>` `startFrom` — voir feedback_audio-music-loop-startfrom-tardif).
