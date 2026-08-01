# Storyboarder — Regles detaillees (detail des entrees indexees dans MEMORY.md)

## Agent Teams (depuis 2026-05-13)
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` actif dans `~/.claude/settings.json`. Le storyboarder peut
transmettre timing.ts directement a audio-director/visual-producer sans repasser par Claude
principal. /goal et /bg disponibles en session interactive pour produire timing.ts de facon
autonome jusqu'a validation.

Budget API : storyboarder = agent $0. Seule dependance payante = ElevenLabs forced-alignment
(1 appel apres TTS), gere par audio-director — le storyboarder consomme le JSON en lecture seule.

## PRE-FLIGHT CHECKLIST (avant de produire timing.ts)
- [ ] Script LOCKED confirme (pas de "on va retoucher apres")
- [ ] Audio mesure ffprobe OU Whisper (pas d'estimation)
- [ ] FPS demande explicitement (pas d'assumption 30fps)
- [ ] Format choisi justifie (flat <90s / nested >=90s / exception argumentee)
- [ ] Duree totale audio comparee a somme scenes (delta <1 frame)
- [ ] Hook present -> cumulative initial = HOOK_FRAMES ?
- [ ] Hand-off PIPELINE.md ecrit

## SEUIL FORMAT (flat vs nested)
- <90s OU scenes <8 -> SCENES-only flat (Format A)
- >=90s OU narratif en actes explicites -> ACTS+SCENES nested (Format B)
- Zone grise 60-90s : demander a Aziz
- Cas particulier Shorts lineaires (ex Soudan Short, 111s) : rester flat meme si >90s des lors que
  la structure est lineaire sans actes narratifs distincts (le nested se justifie par la structure,
  pas seulement la duree)

## DISCIPLINE POST-PRODUCTION (obligatoire a chaque livraison)
Append dans `.claude/agent-memory/shared/PIPELINE.md` :
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

## CRITICAL RULE — audio narration duration MUST match scene clip duration
Erreur observee (Soundjata Acte VII, 2026-04-14) : narration 13.22s, clip Seedance livre 12.05s ->
gap 1.17s -> boucle muette forcee en post-prod (+30 min, 2 iterations). Cause racine : duration
Seedance demandee sans cross-check du timing audio reel.
Regle operationnelle :
1. Calculer la duree exacte de la narration de l'Acte AVANT de proposer une duration Seedance
2. Arrondir a la seconde SUPERIEURE (Seedance = paliers 4-15s) : narration 13.22s -> demander 14s
3. Si arrondi >15s : splitter en 2 clips back-to-back, JAMAIS combler par boucle muette
4. Cross-check obligatoire avant tout appel API : `clip_duration_seconds >= narration_duration_seconds`

## HOOK PATTERN (valide 2026-04-22, Soundjata)
Frontieres ABSOLUES uniquement (start/end), jamais de durees relatives :
```typescript
const HOOK_DURATION_S = 5;
const HOOK_FRAMES = Math.round(HOOK_DURATION_S * FPS); // 150 @30fps
export const SCENES = {
  hook:   { start: 0,   end: 150, startSec: 0.0, endSec: 5.0 },
  scene1: { start: 150, end: 558, startSec: 5.0, endSec: 18.6 },
};
// Chaque scene.start === scene precedente.end — zero gap garanti
```
Regles : narration hook 4.0-5.0s ideal (scan TTS obligatoire avant generation) ; clip extrait
d'une scene existante (tension sans climax) ; musique silencieuse pendant le hook, demarre a
scene1 (Option B validee). Template complet : `memory/templates/hook-short.md`.

## LECON — Mapping clips vs ordre narratif (Abou Bakari II, 2026-04-30)
L'ordre des clips dans le brief du producteur (ocean/empire/name/abdication/fleet-a/fleet-b/...)
ne correspond PAS a l'ordre narratif de l'audio. Regle : TOUJOURS partir de l'ordre narratif de
l'audio (forced-alignment) pour construire la timeline beats — les noms de clips sont des labels
semantiques, pas des positions temporelles. Methode : cartographier le texte de chaque clip sur
la narration via forced-alignment AVANT d'assigner les beats.

## LECON — silences inter-blocs toujours absorbes, jamais laisses en gap non-attribue (Soudan Short, 2026-08-01)
Verifier systematiquement (script, pas a l'oeil) que chaque `scene[n].end === scene[n+1].start`.
Une 1ere passe peut laisser un silence "orphelin" entre 2 blocs (ex: 0.36s entre pivot et bloc
suivant) sans l'attribuer explicitement — toujours l'absorber dans la scene PRECEDENTE (Regle 3)
et reverifier avec un script de controle independant (round(sec*FPS) == frame ET timestamp existe
reellement dans le fichier whisper source) avant de livrer.
