# audio-director — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-05-13 (Agent Teams activés, règles budget API, check-api-balance.sh)

---

## NOUVEAUTES SESSION 2026-05-13

### Agent Teams activés (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1)
- Feature activée dans `~/.claude/settings.json`
- L'audio-director peut désormais recevoir des signaux directs des autres agents (storyboarder → audio-director → visual-producer)
- /goal et /bg disponibles en session interactive Claude Code — permettent de boucler autonomement jusqu'à condition atteinte

### Règles budget API — source de vérité : `.claude/agents/API-BUDGET-RULES.md`
| Action | Limite | Si dépassé |
|--------|--------|------------|
| ElevenLabs TTS | 1 appel par beat | STOP absolu — jamais de retry automatique |
| ElevenLabs SFX | 1 appel par SFX | STOP + présenter à Aziz |
| Minimax musique | 1 appel → 3 variantes | Présenter les 3, attendre choix avant tout re-call |
| Seedance/Kling | 0 appel autonome | Manuel uniquement |

**Checkpoint obligatoire après chaque appel payant** : analyser → verdict → STOP → présenter à Aziz → attendre validation.

### Balance API vérifiée 2026-05-13
- ElevenLabs : 54 425 caractères restants (seuil alerte : <5 000)
- Script de vérification : `./scripts/check-api-balance.sh elevenlabs` (exit 1 = STOP absolu)

---

---

## SCAN TTS FRANCAIS — PROCESS MANUEL OBLIGATOIRE

Avant chaque appel ElevenLabs francais, scan manuel systematique :
1. Participes "e/ee" en fin de groupe : lister TOUS les mots, pas echantillon
2. "ont + voyelle" : liaison bizarre
3. Chiffres : ecrire en lettres
4. Accents manquants
5. Noms de villes avec "s" final

Trace ecrite obligatoire dans la livraison (table mots scannes + corrections appliquees).

Note : le script `scripts/pipeline_gates.py` existe mais n'est PAS integre au workflow en pratique. Scan manuel = source de verite.

Checklist complete a derouler : `./CHECKLIST.md`

---

## KNOWN AUDIO PITFALLS (validated 2026-04-13 on Soundjata Acte V)

Five recurring problems encountered during multi-segment audio mixing. **Anticipate them proactively** on every new project/segment to prevent re-occurrence.

- **P1 Narration cut at segment boundaries** → Whisper timestamps are approximations, actual ElevenLabs boundaries drift ±200-500ms. **Add ±0.3-0.5s buffer around segment cuts, verify by ear first/last 500ms before delivery**.
- **P2 Narration overflow into next act** → extraction sized to video duration leaks next act's opening phrase. **Clamp narration to SCRIPT boundary, not video duration. Rule: no phrase from act N+1 should appear in act N audio.**
- **P3 Seedance audio contains invented speech** → when `generate_audio: true`, Seedance sometimes produces parasitic words. **Before mixing, listen to Seedance audio pure. If parasitic speech in narration zone: mute that zone, or regenerate clip with "no vocal dialogue" clause, or accept if narration covers.**
- **P4 Keep-and-duck level per scene** → 30% default valid. Battle/crowd up to 35-40%, intimate/dialogue down to 15-20%. **Always listen-test before validating.**
- **P5 Whisper vs ElevenLabs timestamp drift** → ±0.3s margin on all cuts. For critical boundaries, measure actual silences with `ffmpeg silencedetect` OR direct listening.

**Full details in `.claude/agents/audio-director.md` section "Known Audio Pitfalls"**.

---

## Forced Alignment — Regle Pipeline (NON-NEGOTIABLE — valide 2026-04-25)

**Source de verite timing : ElevenLabs forced-alignment API EXCLUSIVEMENT.**

INTERDIT : Whisper pour le timing des beats (drift +-200-500ms inacceptable pour beat-sync)
INTERDIT : timestamps estimes manuellement

**Endpoint** : `POST https://api.elevenlabs.io/v1/forced-alignment`
**Format** : multipart form-data (`file` = audio, `text` = plain text sans tags)
**Retour** : JSON avec `words[]` (text, start, end, loss) + `loss` global

**Regles** :
- Le `text` DOIT etre en plain string — PAS de tags V3, PAS de markdown
- Faire IMMEDIATEMENT apres generation TTS (meme appel API, meme session)
- Sauvegarder le JSON dans `public/audio/{projet}/` (meme dossier que l'audio)
- Le fichier JSON sert directement au storyboarder pour timing.ts (source de verite)
- Script reference : `scripts/tools/generate-thiaroye-v5-alignment.py` (template)
- Script Abou Bakari II : `scripts/tools/generate-abou-bakari-alignment.py`

**Pourquoi ElevenLabs > Whisper** :
- ElevenLabs FA : texte exact fourni → timestamps synchronises a la ms avec la voix generee
- Whisper : transcription estimee → drift +-200-500ms, inacceptable pour beat-sync
- Score de confiance par mot (loss) → detecte les mots mal prononces
- 1 seul appel API

**Workflow obligatoire** :
1. Generer TTS ElevenLabs → sauvegarder mp3
2. Appeler forced-alignment avec le texte EXACT passe au TTS (pas le script source)
3. Extraire start/end de chaque beat depuis le JSON `words[]`
4. Transmettre JSON au storyboarder → timing.ts mis a jour avec ces valeurs

---

## Voix actives — source de verite unique

Source : `memory/tools/elevenlabs.md` section "Voix actives"
Voix active Sonjata/Thiaroye Shorts : Narratrice v2 `z3gESu49naEZW8Af2Upm`

### Lecon Voice Design vs Voice Remix (2026-04-19)
- Voice Design seule = souvent robotique/synthetique avec un "filtre" perceptible
- Voice Remix = prend une voix existante et la transforme en modele V3 complet
- **Toujours remixer une voix Voice Design avant production** (prompt_strength 0.45)
- Config "max-style" : voir `memory/tools/elevenlabs.md` (source unique)

---

## Minimax Music 2.6 — source de verite unique

Source complete : `memory/tools/minimax.md` (endpoint, payload, formule prompt, prompts Sonjata valides, anti-patterns, gotchas)

Rappels critiques (non-duplication) :
- Endpoint : `fal-ai/minimax-music/v2.6` + `is_instrumental: true`
- PAS de `reference_audio_url` (cause 422)
- PAS de `duration_seconds` (trim ffmpeg apres)
- Cout : $0.10/gen, 3 variantes parallele = $0.30 en ~6min
- Gotcha : ne JAMAIS mettre le mot "instrumental" dans le prompt si `is_instrumental: true` (422)

**Biais de recence Sonjata** : le prompt Toumani Diabate / kora / Mande validé pour Sonjata NE DOIT PAS être reutilise automatiquement pour un autre projet. Re-analyser le contexte culturel. Voir section "ATTENTION BIAIS DE RECENCE" ci-dessous.

---

## HOOK NARRATION PATTERN (valide 2026-04-22)

### Recette phrase-choc
Formule : **"[Constat impossible]. [Promesse au futur]."**

Exemples :
- "Cet enfant ne peut pas se lever. Il fondera un empire africain." (Sonjata, 63 chars, 4.32s)

### Contraintes techniques
- **Max 14 mots** pour tenir en 5s (debit Narratrice GeoAfrique v2)
- **2 phrases courtes** > 1 phrase longue
- **Scan TTS obligatoire** : participes "e/ee", "ont+voyelle", chiffres
- **Config max-style** : stab=0.22, sim=0.55, style=0.55, speed=1.0

### Integration Remotion
- Hook 5s = Sequence from=0, musique SILENCE pendant hook (Option B)
- Musique entre a Sequence scene 1 avec fade-in 2s (contraste dramatique)
- Voir `memory/templates/hook-short.md`

---

## Mix audio (regle projet consolidee)
- **Volume musique** : 0.07 valide Thiaroye V5 (0.15 = ancienne ref Sonjata, trop fort si SFX present)
  - Sonjata (sans SFX) : 0.15 valide
  - Thiaroye V5 (avec SFX keep-and-duck) : 0.07 valide
  - Regle : ajuster selon presence ou absence de SFX dans le mix
- **Fade-in** : 2s (60 frames @30fps) via `interpolate` clamped
- **Fade-out** : 2s avant fin composition
- **Option B** : silence musique pendant hook, entree a scene 1
- **SFX keep-and-duck** : duck volume SFX sous narration (scene dependent, voir P4)
- Reference implementation Sonjata : `src/projects/geoafrique-shorts/SonjataShortFull.tsx`
- Reference implementation Thiaroye : `src/projects/geoafrique-shorts/Thiaroye1944Short.tsx`

## Remotion-native audio (pattern valide Thiaroye V5)
- Garder pistes separees : narration.mp3 + music.mp3 + sfx/*.aac
- Mixer dans composition avec `<Audio volume={}>` et `interpolate()` pour fades
- SFX : `staticFile('audio/thiaroye-1944/sfx/hook-sfx.aac')` + `<Audio>` avec timing Sequence
- Avantage : flexibilite volume par scene, pas de re-render audio si ajustement
- Pré-bake ffmpeg : uniquement si flux tres complexe ou livraison externe requise

---

## Projets actifs — pre-brief

### Abou Bakari II
- **Voix** : Narratrice GeoAfrique v2 — voice_id: `z3gESu49naEZW8Af2Upm` (CONFIRMEE)
- **Audio existant** : `public/audio/abou-bakari/abou-bakari-narratrice-v1.mp3` (82.80s)
- **Script** : LOCKED, pas de regeneration audio prevue
- **Contexte culturel** : Mali XIVe siecle, pelerinage Mansa Musa 1324-1325
- **Instruments** : kora, balafon, djembe, griot (ne PAS reutiliser prompt Sonjata tel quel)
- **Statut** : beats 01-09 faits, reste musique + render final

---

## ATTENTION BIAIS DE RECENCE

Ma memoire recente est dominee par Sonjata. Pour tout nouveau projet :
- Ne PAS reflex Narratrice v2 sans verifier (ex : Thiaroye peut garder, mais le valider)
- Ne PAS reflex Toumani Diabate / kora / griot Mandinka si le projet n'est pas Mande
- Ne PAS reflex hook formule "constat impossible + promesse futur" sans verifier le scriptwriter brief

Contre-check obligatoire : lire manifest projet ET script avant de proposer voix/musique.

---

## Cost averages

| Project type | Narration (ElevenLabs) | Music (Minimax) | Total typical |
|--------------|------------------------|-----------------|---------------|
| Short 60-90s | ~$0.20 | ~$0.50 | ~$0.70 |
| Long-form 5-10min | ~$1.50 | ~$0.50 | ~$2.00 |

---

## French TTS gotchas discovered

- **Accents ecrits OBLIGATOIRES** (2026-04-19) : ElevenLabs prononce "Mande" comme "monde", "frappe" comme nom au lieu de participe, "tremblerent" mal articule. TOUS les accents francais doivent etre ecrits dans le script Python (e, a grave, c cedille, etc.). Scanner AVANT chaque generation.
- **"se mirent a trembler" > "tremblerent"** : reformuler les passes simples problematiques en tournures plus sures.

---

## Projets actifs — Zimbabwe Lithium (musique)

### Zimbabwe Lithium
- **Narration** : `public/souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1.mp3` (86.0s)
- **Musique** : 3 variantes generees 2026-05-15 — PENDING VALIDATION AZIZ
  - A-contemplatif.mp3 (126.6s) — mbira solo + marimba, Stella Chiweshe style
  - B-geopolitique.mp3 (227.6s) — mbira dzavadzimu + ngoma drum, Forward Kwenda style
  - C-tension.mp3 (255.8s) — mbira + hosho + marimba, Dumisani Maraire style
- **Context culturel** : Zimbabwe = Shona/Ndebele — JAMAIS Mande/griot (anti biais-recence)
- **Cout total musique** : ~$0.30
- **Mix** : pas encore fait — attente choix Aziz
- **Timing.ts** : decalages documentes dans PRODUCTION-ZIMBABWE-DETTES.md — a corriger AVANT assemblage

---

## Session log

### 2026-04-13 (initial)
Agent cree. Aucune invocation encore.

### 2026-04-13 PM (5 audio pitfalls identified from Soundjata Acte V)
Pendant la production Soundjata Acte V (hors agent, fait par Claude principal), 5 problemes audio recurrents ont ete identifies : P1 narration coupee aux frontieres (buffer Whisper), P2 debordement narration sur acte suivant, P3 audio Seedance avec paroles inventees, P4 niveau keep-and-duck a ajuster par scene, P5 drift timestamps Whisper vs ElevenLabs. Documentes dans la section "Known Audio Pitfalls" de l'agent. **A anticiper proactivement** sur tous les futurs mixes audio multi-segments.

### 2026-04-22 (Sonjata session 8 — Minimax v2.6 + hook validation finale)
**Hors agent, par Claude principal** :
- Bug Minimax historique resolu : `fal-ai/minimax-music/v2.6` + `is_instrumental: true`, pas de `reference_audio_url`
- Formule prompt Mande validee : artiste nomme + 1-2 instruments + "no synthesizers" + origine precise
- 3 variantes Mande generees ($0.30), Aziz choisit A-Toumani (157s kora + balafon)
- Hook narration 5s genere : "Cet enfant ne peut pas se lever. Il fondera un empire africain." (4.32s)
- Integration Remotion : musique Sequence from=scene1 (Option B), silence pendant hook
- Render final 151s valide par Aziz : "tres bon, publiable pending CTA"
- Seule tache restante : CTA narration apres recharge ElevenLabs

### 2026-04-25 (Thiaroye V5 — render final)
**Hors agent, par Claude principal** :
- Variant retenu : C (version finale)
- Volume musique : 0.07 (valide vs 0.05 — decision Aziz pending entre les deux)
- SFX : duck sous narration (keep-and-duck pattern)
- hook-sfx.aac : integre en Remotion-native via staticFile() + `<Audio>`
- Render final : Vercel Blob
- Integration Remotion-native : narration + musique + SFX separes, pas de pre-bake
