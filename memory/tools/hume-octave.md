# Hume Octave TTS — fiche technique (créée 2026-06-10)

> Benchmark voix vivante Sahel. Hume Octave = TTS "LLM-based" avec ACTING INSTRUCTIONS (langage
> naturel) = le levier d'expressivité qui manque à ElevenLabs V3. À tester contre GéoAfrique V2.

## Auth
Header : `X-Hume-Api-Key: <clé>`. Clé Aziz = jetable pour tests (régénérée si passage payant).

## Endpoints
- Non-streaming fichier (le + simple) : `POST https://api.hume.ai/v0/tts/file` → renvoie audio (MP3/WAV/PCM).
- Non-streaming JSON (base64) : `POST /v0/tts` .
- Streaming : `/v0/tts/stream/file` ou `/json`.

## Corps de requête (clés)
```json
{
  "utterances": [
    {
      "text": "...",
      "description": "instruction de JEU en langage naturel (max 1000 char) — ex: 'Narrateur documentaire grave, posé, qui monte en tension'",
      "voice": {"name": "...", "id": "..."},   // requis pour Octave 2 / instant_mode
      "speed": 1.0,
      "trailing_silence": 0.0
    }
  ],
  "format": {"type": "mp3"},
  "version": "2",            // Octave 2 = multilingue (FR). EXIGE un voice.
  "num_generations": 1,
  "instant_mode": false      // désactiver si voice design / multi-générations
}
```

## Octave 1 vs Octave 2 (preview)
- Octave 1 : EN + ES seulement. PAS de français.
- **Octave 2 (preview)** : EN, FR, ES, DE, IT, PT, JA, KO, RU, HI, AR. ⇒ **FR = Octave 2 obligatoire**.
  - Octave 2 EXIGE `voice` spécifié (sinon rejet). Acting instructions "coming soon" sur O2 (vérifier au test).
  - Voice cloning : 15 s d'audio suffisent → cloner GéoAfrique V2 pour garder le timbre.

## Limites
5000 char/utterance · description 1000 char · max 5 générations/requête · MP3/WAV/PCM.

## Différentiel vs ElevenLabs (pourquoi tester)
- EL V3 : expressivité via tags [tense]/[solemn] + réglages stability/style. Plafonne (monotonie).
- Hume : expressivité via `description` (acting instructions) + compréhension sémantique LLM du texte.
  "Sait quand chuchoter, quand crier" — conçu autour de la prosodie émotionnelle.
- Voir benchmark : `memory/tools/TTS-VOIX-VIVANTE-BENCHMARK-2026-06.md`.

## Test prévu (Sahel)
Script prêt : `scripts/test-hume-octave.py` (manque la clé HUME_API_KEY). Même extrait Kidal que le
test ElevenLabs → A/B à l'oreille. Si Hume FR décolle → cloner GéoAfrique V2 dessus + migrer Sahel.

## Doc
https://dev.hume.ai/docs/text-to-speech-tts/overview · /voice · /acting-instructions
Append /llms.txt ou .md à toute URL pour la version markdown.

---

## ⚠️ LIMITES DÉCOUVERTES AU TEST (2026-06-10) — lire avant de miser sur Hume pour le FR

**DILEMME LANGUE vs ACTING INSTRUCTIONS (bloquant pour le FR actuellement) :**
- Octave 1 = acting instructions (`description`) ✅ MAIS langues = EN + ES seulement → **français accentué anglo** ❌
- Octave 2 = français propre ✅ MAIS **`description` REJETÉ** ("Octave 2 does not support the 'description' parameter") ❌
- ⇒ En français AUJOURD'HUI, on ne peut PAS avoir voix FR propre + acting instructions. Le levier qui rend
  Hume supérieur (acting instructions = jeu en langage naturel) n'est PAS dispo en FR. "Coming soon" sur O2.
- CONSÉQUENCE : migrer vers Hume pour du FR n'a de sens que quand acting instructions arriveront sur Octave 2.
  Aziz a jugé qu'ElevenLabs sonnait DÉJÀ mieux que Hume O2-FR-sans-acting. À ré-évaluer quand O2 aura le `description`.

**CLONAGE = pas d'API directe par fichier.** Le clonage se fait sur l'INTERFACE WEB (app.hume.ai/voices →
Voice Cloning → Browse Files → nom + accord légal → CREATE VOICE). Puis référencer par name/id en TTS
(`provider: CUSTOM_VOICE`). Alternative API = Voice Conversion (`/v0/tts/voice_conversion/file`) qui convertit
un audio existant vers une voix cible en préservant prosodie/timing (utile pour A/B rapide).

**Specs échantillon clonage/conversion** : MP3/WAV/M4A/OGG · 12s-3min · 44.1kHz reco · voix claire peu de bruit.

**Voix Hume prédéfinies testées (FR Octave 2)** : Male Protagonist (82a76fb8-3524-4e87-9265-9795c8e4ede6),
Geraldine Wallace (06646694-ba2a-4bca-ae3c-71d79c6b04a3). Catalogue = perso anglophones, pas idéal narration FR.

**Réglages expressivité Hume** : `temperature` (0.1-1, exp.) au lieu de stability EL. Pas testé à fond.
