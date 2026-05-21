# Storyboarder Agent — Persistent Memory

## Role Summary
Produce `SCENES` and `BEATS` TypeScript constants from measured audio.
`timing.ts` est la source de verite — pas scenes.json (qui n'existe pas dans ce pipeline).
Never estimate. Never use `expected_duration_sec` as a timing source.

---

## NOUVEAUTES SESSION 2026-05-13

### Agent Teams activés (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1)
- Feature activée dans `~/.claude/settings.json`
- Le storyboarder peut transmettre le timing.ts directement à audio-director et visual-producer via le système d'agent teams, sans passer par Claude principal
- /goal et /bg disponibles en session interactive Claude Code — permettent de produire timing.ts de façon autonome jusqu'à validation

### Règles budget API
Le storyboarder est un agent $0 (pas d'appels API payants). Ses seules dépendances payantes :
- ElevenLabs forced-alignment (1 appel après TTS) — géré par audio-director, pas le storyboarder
- Le storyboarder consomme uniquement le JSON d'alignment en lecture

### Handoff Pipeline obligatoire
Après chaque timing.ts produit : écrire dans `.claude/agent-memory/shared/PIPELINE.md` la section Stage 2. Sans ce handoff, les agents downstream n'ont pas de signal automatique — c'est la source de blocages silencieux.

---

---

## PRE-FLIGHT CHECKLIST (a cocher mentalement AVANT de produire timing.ts)

- [ ] Script LOCKED confirme ? (pas de "on va retoucher apres")
- [ ] Audio mesure avec ffprobe OU Whisper ? (pas d'estimation)
- [ ] FPS demande explicitement ? (pas d'assumption 30fps)
- [ ] Format choisi justifie ? (flat <90s / nested >=90s / exception argumentee)
- [ ] Duree totale audio comparee a somme scenes ? (delta <1 frame)
- [ ] Hook present -> cumulative initial = HOOK_FRAMES ?
- [ ] Hand-off PIPELINE.md ecrit ? (sinon agents downstream sans signal)

---

## SEUIL FORMAT (flat vs nested)

- <90s OU scenes <8 -> SCENES-only flat (Format A)
- >=90s OU narratif en actes explicites -> ACTS+SCENES nested (Format B)
- Zone grise 60-90s : demander a Aziz

---

## DISCIPLINE POST-PRODUCTION (obligatoire)

Apres chaque production timing.ts, append 6 lignes dans `.claude/agent-memory/shared/PIPELINE.md` :

```
## Stage 2 — Storyboarder — [PROJECT-NAME] — [DATE]
- Input : audio mesure [fichier + duree]
- Output : [chemin timing.ts]
- Format : [flat | nested]
- FPS : [valeur]
- Total frames : [valeur]
- Status : READY FOR STAGE 3
```

Sans ce handoff, les agents downstream n'ont pas de signal automatique.

---

## CRITICAL RULE — Audio narration duration MUST match scene clip duration (added 2026-04-14)

**Erreur de production observée sur Soundjata Acte VII** :
- Narration Acte VII : 13.22s (de 108.98s à 122.20s dans `narration-full.mp3`)
- Clip Seedance demandé/livré : 12.05s
- **Gap de 1.17s** → a forcé une boucle muette du WIDE FINAL (loop tail) en post-prod, +30 min de travail sur 2 itérations Remotion (`LOOP_START` mal positionné en V1, fix en V2)

**Cause racine** : le Visual Plan a demandé `duration: "12"` sans vérifier que la narration de l'Acte faisait précisément 12s. Le visual-producer a appliqué la règle "preferred Seedance duration = 12s" sans cross-check avec le timing audio.

**Règle opérationnelle pour storyboarder + visual-producer** :
1. **AVANT de proposer une `duration` Seedance**, calculer la durée exacte de la narration de l'Acte (`scene.end - scene.start` ou somme des sous-scènes)
2. **Arrondir à la seconde supérieure pour Seedance** (Seedance accepte 4-15s par paliers de 1s) : si narration = 13.22s → demander **14s** au clip Seedance, pas 12s
3. **Si arrondi > 15s** : splitter en 2 clips Seedance back-to-back, JAMAIS combler par boucle muette
4. **Cross-check obligatoire avant tout appel API Seedance** : `clip_duration_seconds >= narration_duration_seconds`. Sinon STOP et ré-évaluer le découpage.

**Coût d'éviter cette règle** : ~30 min de Remotion + 1 itération mini-render ratée. Coût de l'appliquer : +$0.60 (2s de Seedance supplémentaires) + 0 pain point.

---

## HOOK PATTERN (valide 2026-04-22 sur Sonjata)

Structure `timing.ts` avec hook d'ouverture — frontieres ABSOLUES (start/end), JAMAIS de durees relatives :

```typescript
const HOOK_DURATION_S = 5;
const HOOK_FRAMES = Math.round(HOOK_DURATION_S * FPS); // = 150 a 30fps

// INTERDIT : start: prevEnd, duration: 13.6
// CORRECT   : start: s(0.0), end: s(13.6)
// ou en frames :
export const SCENES = {
  hook:    { start: 0,   end: 150,  startSec: 0.0,  endSec: 5.0 },
  scene1:  { start: 150, end: 558,  startSec: 5.0,  endSec: 18.6 },
  // ...
};
// Chaque scene.start === scene precedente.end — zero gap garanti
```

**Regles timing hook** :
- Narration hook = 4.0-5.0s ideal (scan TTS obligatoire AVANT generation)
- Clip video extrait d'une scene existante (tension sans climax)
- Musique = SILENCE pendant hook, commence a scene 1 (Option B validee)

Template complet : `memory/templates/hook-short.md`

---

## PROJETS ACTIFS

### Abou Bakari II — UPDATED 2026-04-30
- timing ACTIF : `src/projects/geoafrique-shorts/timing-abou-bakari.ts` (NEW — 9 beats avec fleet split)
- whisper mots : `src/projects/geoafrique-shorts/whisper-words-abou-bakari.ts` (228 mots, export `WHISPER_WORDS_ABOU_BAKARI`)
- Audio narration : `public/audio/abou-bakari/abou-bakari-narratrice-v1.mp3` | 82.80s
- Audio CTA : `public/audio/abou-bakari/beat09-cta.mp3` | 12.16s
- Forced-alignment source : `public/audio/abou-bakari/abou-bakari-alignment.json` (316 tokens)
- TOTAL_FRAMES : 2849 | NARRATION_FRAMES : 2484 | TOTAL_SECONDS : 94.96s
- Beats (ordre timeline) : ocean(13.5s) / empire(8.9s) / fleet_a(14.94s AUDIO_OFF) / fleet_b(1.14s) / name(12.86s) / abdication(13.32s) / obsession(5.86s) / colomb(6.42s) / close_cta(15.54s)
- Statut : timing-abou-bakari.ts LOCKED 2026-04-30. READY FOR STAGE 3 (remotion-composer).
- NOTE compositeur : fleet_b = 34 frames seulement ("On ne passe pas."), clip fait 6.06s → a trancher.
- ancien timing.ts : voir src/projects/geoafrique-shorts/timing.ts (8 beats ancien format, OBSOLETE pour Abou Bakari II)

---

## LECON — Mapping clips vs ordre narratif (2026-04-30)

Sur Abou Bakari II : l'ordre des clips dans le brief du producteur (ocean/empire/name/abdication/fleet-a/fleet-b/obsession/colomb/close) ne correspond PAS a l'ordre narratif de l'audio.

Regle : TOUJOURS partir de l'ordre narratif de l'audio (forced-alignment) pour construire la timeline beats. Les noms des clips dans le brief sont des labels semantiques, pas des positions temporelles.

Methode : cartographier le texte de chaque clip sur la narration audio via forced-alignment AVANT d'assigner les beats.

---

## PROJETS ARCHIVES (references seulement)

**Peste 1347** : projet SVG abandonne 2026-02-21 (pivot du pixel art vers pur Remotion SVG enluminure).
Les 7 scenes `hook_*` et le code Godot/PixelLab mentionnes dans les anciennes versions de ce fichier ne sont plus actifs. Voir `memory/archive/` si besoin historique.
