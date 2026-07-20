# Règles Beat Production — CHARGÉES PAR HOOK (NON-NEGOTIABLE)

> Ce fichier est lu mécaniquement avant tout Write/Edit sur un Beat*.tsx.
> 11 règles. Si une est violée = le beat n'est pas prêt à être codé.

---

## R0 — AUDIT FAISABILITÉ AVANT TOUT CODE (BLOQUANT)

**Avant de coder un seul beat : score de fidélité estimé pour chaque template du storyboard.**

Pour chaque beat, répondre à :
1. Le composant existe-t-il dans `_shared/components/layouts/` ?
2. Fait-il exactement ce que le storyboard montre (mécanique, pas juste le nom) ?
3. Score estimé de fidélité : 0-100%

**Seuil obligatoire : 95% minimum.**

Si un beat est sous 95% : décision explicite AVANT de coder — trois options seulement :
- **A — Coder ce qui manque** : identifier précisément les delta (props manquants, mécanique absente) et les coder
- **B — Remplacer le template** : choisir un template existant qui atteint 95%+ avec le même impact narratif — justifier en 1 phrase
- **C — Accepter la dégradation** : documenter explicitement ce qui sera différent du storyboard et pourquoi c'est acceptable

**Jamais commencer le code sans avoir tranché sur chaque beat sous 95%.**

Exemple de delta typique à documenter :
- "BrutalHookSplit attend une image statique — pas un Mapbox live → Delta : modifier le composant pour accepter `mapboxConfig` prop"
- "ScaleShock existant = deux cercles, pas une balance → Delta : recoder from scratch ou remplacer par ChiffreChoc"

---

## R1 — RYTHME (la plus importante)
**Max 8 secondes sans changement visible à l'écran.**
"Changement" = nouvelle animation d'entrée, nouveau composant, nouveau texte, nouveau stat, nouveau template.
Un beat de 20s = minimum 3 événements visuels distincts. Permanent motion (pulse, drift) ne compte PAS.

## R2 — STORYBOARD VISUEL OBLIGATOIRE
Avant de coder un beat, un storyboard visuel Gemini 3.1-pro-preview doit exister.
Fichier requis : `src/projects/<episode>/storyboard/beat<N>-storyboard.md`
Ce storyboard valide R1 (rythme) avant que le code commence.

## R3 — LIRE LES COMPOSANTS _SHARED/ AVANT DE CODER
Avant tout nouveau Beat*.tsx : lire TOUS les composants dans `src/projects/_shared/components/layouts/` et `inserts/`.
Jamais recréer from scratch ce qui existe. Si le composant existant ne convient pas → créer un nouveau et l'ajouter à _shared/.
Flag requis : `/tmp/shared-components-read` doit exister (créé par le hook après lecture).

## R4 — GEMINI 3.1-pro-preview HARDCODÉ pour reviews
Modèle review : `gemini-2.5-flash` avec `thinking_budget=0` uniquement si 3.1-pro-preview timeout.
Jamais utiliser gemini-2.5-pro, gemini-2.5-flash par défaut, ou tout autre modèle sans raison documentée.
Score minimum pour valider un beat : **8.5/10**.

## R5 — AUDIO-DERIVED TIMING OBLIGATOIRE
Chaque trigger d'animation = `SEG.xxx.start` ou `SEG.xxx.end` depuis manifest.ts.
Jamais hardcoder un numéro de frame (ex: `frame - 60`). Exception : offsets relatifs court (<15f) pour stagger.

## R6 — TAILWIND TOKENS POUR COULEURS/TYPO/SPACING
Jamais `color: "#c8a951"` inline. Toujours `text-gold`, `bg-navy`, `text-ivory`, etc.
Lire `tailwind.config.ts` tokens AVANT d'écrire une seule classe de couleur.

## R7 — PERMANENT MOTION dans tout composant custom
Tout composant custom doit avoir au moins un élément en mouvement continu (pas juste l'entrée).
Options : pulse SVG, drift lent, countup progressif, scan line, particle slow.

## R8 — REVIEW PROPRE AVANT PRÉSENTATION
Avant de présenter un render à Aziz :
1. Extraire 5 frames avec downscale-for-review.sh
2. Lire chaque frame visuellement
3. Vérifier rythme (R1) sur timeline frames
4. Lancer review Gemini 3.1-pro-preview
5. Score ≥ 8.5 → présenter. Score < 8.5 → corriger et re-render.

## R9 — BEAT DURATION = AUDIO + 30f MAX
`BEAT_DURATION = SEG.xxx_end.end - SEG.xxx_start.start + 30`
Ne jamais ajouter de marge arbitraire >30 frames. L'overlap avec le beat suivant se gère dans la composition finale.

## R10 — NO EMOJIS IN CODE
Interdit dans tout fichier .ts, .tsx, .js, .json, .yaml, .sh
Autorisé uniquement dans .md, .txt

---

## R11 — WHISPER : TOUJOURS VIA API OPENAI (NON-NEGOTIABLE)

**Jamais `whisper` CLI local.** Toujours l'API OpenAI Whisper pour la rapidité.

```python
import openai, os
client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
with open("/tmp/segment.mp3", "rb") as f:
    result = client.audio.transcriptions.create(
        model="whisper-1",
        file=f,
        language="fr",
        response_format="verbose_json",
        timestamp_granularities=["word"],
    )
for w in result.words:
    print(f"{w.start + OFFSET:.3f}s : '{w.word}'")
```

---

## R12 — SPLICE AUDIO : PROTOCOLE OBLIGATOIRE (appris Beat10 2026-05-23)

### Avant tout splice ffmpeg

1. **Forced alignment word-level AVANT de couper** — whisper `--word_timestamps True` sur la zone ±5s autour du point de coupe. Jamais estimer les timestamps depuis le forced alignment global.
2. **Point de coupe = avant le premier mot à remplacer** — avec 50ms de marge silence. Ex : "Le" commence à 154.940s → couper à 154.850s.
3. **Point de reprise = après le dernier mot commun entre fragment et original + 200ms** — le fragment et l'original finissent souvent par le même mot ("époque.") → reprise dans l'original APRÈS ce mot + 200ms.
4. **Vérifier la jonction** après splice : whisper word-level sur ±3s autour de la jonction. Chercher les doublons.

### `endAt` et `startFrom` dans Remotion

- `endAt` est en **frames globales du fichier audio** (pas frames du beat) : `endAt = startFrom + frames_beat_de_coupure`
- Ne JAMAIS utiliser `volume()` fade pour éliminer un mot indésirable — le décodeur MP3 lit en avance et laisse passer des artefacts. Utiliser `endAt` pour une coupe nette.
- Toujours valider avec un mini-render (`--frames=F_coupure-300:F_fin`) AVANT le render complet.

### R11.1 — Phases d'un beat = Whisper word-level OBLIGATOIRE (NON-NEGOTIABLE)

**Ne JAMAIS estimer les frames d'une phase de beat à l'œil.** Lecons Beat12 et Beat13 : estimation = désalignement de 1-3s sur chaque phase = beat à refaire.

**Workflow** pour tout nouveau beat avec audio :
1. Whisper word-level sur la zone du beat (`timestamp_granularities=["word"]`)
2. Identifier les mots-pivots qui marquent les phases narratives ("Mais voilà", "Ce champ attend", etc.)
3. Calculer : `frame_phase = (timestamp_mot - startFrom_seconds) * 30`
4. Coder les constantes `F_A_END`, `F_B_END`, etc. depuis ces frames calculées, jamais estimées
5. Commentaire en tête du beat : tableau Whisper avec timestamps → frames (voir Beat13.tsx lignes 20-29)

### Render : public-dir minimal OBLIGATOIRE

- `public/` contient 2.3GB d'assets. Chaque render copie tout → +20 min inutiles.
- **Créer `/tmp/public-beat<N>/` avec seulement les fichiers audio du beat** avant tout render :
  ```bash
  mkdir -p /tmp/public-beat10/souverain/<episode>/audio/
  cp public/souverain/<episode>/audio/narration-*.mp3 /tmp/public-beat10/...
  cp public/souverain/<episode>/audio/music-*.mp3 /tmp/public-beat10/...
  ```
- Passer `--public-dir=/tmp/public-beat<N>` à chaque render.

### Renders parallèles : interdit absolu

- Avant tout render : `pkill -f "remotion render"` + vérifier `ps aux | grep "remotion render"` = 0.
- Deux renders simultanés sur le même fichier = corruption moov atom garantie.

---

## R13 — AUDIO-FIRST STRICT + garde-fous silence/overlap (rapatrié de rules-workflow-processus.md, archivé 2026-07-11)

**R-AUDIO-FIRST-STRICT** : script VO complet + TTS généré + ffprobe toutes durées → AVANT de toucher au timing visuel. Jamais locker les visuels avant d'avoir les durées audio réelles (l'audio ajouté après coup crée des décalages en cascade difficiles à diagnostiquer).

**R-SILENCE-MAX-3S** : tout silence >3s dans un beat = signal d'alarme. Calculer `durationInFrames - durationFrames_VO = silence`. Si > 90f → ajouter VO ou réduire la fenêtre. Hold narratif intentionnel = max 2-3s.

**R-NO-AUDIO-OVERLAP** : après tout ajout/modification d'audio, vérifier `segment[i].startFrame >= segment[i-1].startFrame + segment[i-1].durationFrames`.

**R-BEAT-DURATION-FORMULA** : `durationInFrames = durationFrames_VO + 30f_silence + 30f_fondu` — jamais estimer, appliquer dès que ffprobe donne la durée VO.

**R-MUSIC-COMPOSITION-ONLY** : la musique de fond se gère UNIQUEMENT au niveau de la composition principale — les composants Beat* ne montent jamais d'Audio musique. Avant tout render : `grep -n "music\|music-A\|music-B" src/projects/*/Beat*.tsx` → si trouvé = bug.

## R14 — INTEGRATE BEFORE ADD (validée 2026-05-27)

Avant d'écrire une "nouvelle procédure/règle" : vérifier d'abord si elle existe déjà (memory/, skills). Si oui → intégrer/référencer/étendre, jamais dupliquer.

Checklist 30s avant d'ajouter : `ls memory/` + grep mots-clés → si chevauchement, étendre l'existant ; si vraiment nouveau, créer et cross-lier depuis l'existant.
