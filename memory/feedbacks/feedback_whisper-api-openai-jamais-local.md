Pour TOUTE transcription (audio ou vidéo, FR ou autre), utiliser l'**API OpenAI Whisper**
(`openai.audio.transcriptions.create`, modèle `whisper-1`) en clé `OPENAI_API_KEY` (`.env` racine).
**JAMAIS** le binaire `whisper` local (`/opt/homebrew/bin/whisper`, `openai-whisper` pip) — même si la
machine semble libre.

**⭐ OUTIL PRÊT (2026-07-25) — ne plus écrire de script ad hoc** : `scripts/tools/forced-align.py`
`<audio.mp3> <texte.txt> [reperes...]` → timestamps mot-par-mot + **les FRAMES des repères narratifs**
directement exploitables dans un bloc `T` Remotion. Moteur = forced-alignment ElevenLabs, donc il marche
même quand le quota OpenAI est épuisé (vécu ce jour : `429 insufficient_quota`, Whisper indisponible).
Il est même PRÉFÉRABLE pour du calage : il reçoit le texte ATTENDU, donc il ne peut pas mal transcrire un
nom propre ou un sigle, contrairement à une transcription libre. Loss constatée 0.04-0.09.

**Fallback si l'API OpenAI échoue** : ElevenLabs Forced Alignment (clé `ELEVENLABS_API_KEY`, déjà utilisée
pour le TTS du projet) — voir `memory/tools/elevenlabs.md` pour l'usage existant, à étendre si l'endpoint
forced-alignment n'a jamais été appelé dans ce projet.

**Why** : le 2026-07-14, `whisper` local (modèle `small`, CLI homebrew) a tourné >50min CPU-time sur un
clip de 71s sans jamais produire de sortie, alors que `top` ne montrait pas de saturation expliquant le
blocage ("la machine ne semble pas utilisée mais ça semble bloqué" — Aziz). Cause exacte non élucidée,
mais le pattern (blocage silencieux, pas de progress log même avec `--verbose False` qui masque tout)
rend le binaire local non fiable comme outil de production. Perte de temps sur une tâche qui devrait être
quasi-instantanée via API.

**How to apply** : dès qu'une tâche implique "transcrire", "extraire le texte parlé", "whisper" sur un
fichier audio/vidéo (nouveau, externe, ou existant) → appeler l'API OpenAI directement (via script Python/
curl, pas le CLI). Ne jamais lancer `whisper` (binaire) en tâche de fond en pensant gagner du temps — c'est
l'inverse qui s'est produit. Si l'API OpenAI retourne une erreur (quota, clé, timeout réseau) → basculer sur
ElevenLabs Forced Alignment plutôt que retomber sur le binaire local.
