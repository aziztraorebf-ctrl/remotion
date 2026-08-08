# visual-producer — Agent Memory

> Persistent memory across sessions. Index compact + pointeurs vers fichiers dedies.
> Last updated: 2026-08-07 (compaction — plafond 200 lignes/25000 octets)

---

## FICHIERS DE REFERENCE (charger selon besoin)

| Fichier | Contenu | Quand consulter |
|---|---|---|
| **`SEEDANCE-LAUNCH.md`** | Template Python + méthode d'exécution Seedance | TOUJOURS avant un clip Seedance |
| `CHECKLIST-PROMPT-SHORT.md` | 21 items + template + 14 anti-patterns bloquants | TOUJOURS avant un prompt Short ou Gemini |
| `MOTS-ROUGES-VERTS.md` | Mots immobilite/particules/richesse litterale a eviter | TOUJOURS avant un prompt Short |
| `RULES-ACTIVE.md` | Regles vivantes courantes | Consulter si doute sur une regle |
| `RULES-ARCHIVE.md` | Regles zombies/historiques/contextuelles | Cas tres specifiques |
| `GOTCHAS-TOOLS.md` | Detail gotchas outils (text-to-image drift, H3 scenes calmes...) | Avant generation perso secondaire / scene calme H3 |
| `archive/projets-detail-pre-2026-08.md` | Detail Sonjata/Thiaroye/Abou Bakari (termines) | Retrouver un chemin d'asset ou incident passe |

**Memoire transverse projet** : `memory/tools/{seedance-rules,seedance-prompts,seedance-storyboard-technique,gemini,kling,recraft}.md` · `memory/templates/hook-short.md`

---

## ETAT PROJETS ACTIFS

### NorthShield/NoteShield (client-sim)
- Storyboard V3 : `memory/client-sim-tests/noteshield/STORYBOARD-V3-MIX-INCARNE.md`
- Style anchor Sarah : `src/projects/_client-sim/noteshield/refs/sarah-candidat-B-v3-final.jpg`
  (fond navy `#16213a` STRICTEMENT PLAT, cyan en liseré fin seulement — jamais de degrade/glow radial)
- P1 couloir/file : `refs/p1-couloir-file.jpg`. P1a (barrière descend) = ECHEC quasi-statique,
  à refaire. P1b (barrière remonte) = OK.
- P6 Berlin corrigé (perso "utilisateur inconnu", pas Sarah) : `refs/p6-utilisateur-inconnu-v2.jpg`
  + clip `out/_r-and-d/noteshield-h3-tests/p6-v2-inconnu.mp4` validé, 0 drift. Detail : `GOTCHAS-TOOLS.md`.
- Pipeline perso : MiniMax H3 image-to-video (PAS Seedance) — `scripts/tools/minimax-h3-image-to-video.py`,
  upload `fal_client.upload_file` (catbox renvoie fichiers vides sur ce compte).
- Nouveau perso sur style etabli → TOUJOURS image-to-image avec ref canon, jamais text-to-image pur
  (gotcha detaille dans `GOTCHAS-TOOLS.md`).

### Autres projets backlog
- Chaine News geopolitique : systeme valide, execution post-3 Shorts.
- Sonjata / Thiaroye V5 / Abou Bakari II : TERMINES/publiés — détail dans l'archive.

---

## TECHNIQUE PRIMAIRE : Storyboard-to-Video (Seedance reference-to-video)

Ref : `memory/tools/seedance-storyboard-technique.md` (12 regles). Workflow : Gemini sketch N
panels + char refs + env plate → Seedance reference-to-video 9:16 avec audio. Applicable :
séquences narratives multi-shots <15s. Projets valides : Soundjata Acte V, Sonjata Papercraft.

7 faiblesses connues (detail : RULES-ARCHIVE + seedance-storyboard-technique.md) : F1 state
transitions → clause explicite · F2 char ref neutral-bg → context-refs · F3 layout panels →
densité contextuelle · F4 Gemini Pro conservative → Flash Image pour edits · F5 objets rigides
stretch → tight framing · F6 format → aspect_ratio API pas crop post · F7 drift enfant → forcer
age adulte 3x.

---

## REF CHARACTERS PAR PROJET (actifs — detail historique dans archive)

| Projet | Perso | Path |
|---|---|---|
| NorthShield | Sarah | `src/projects/_client-sim/noteshield/refs/sarah-candidat-B-v3-final.jpg` |
| NorthShield | Utilisateur inconnu (P6) | `src/projects/_client-sim/noteshield/refs/p6-utilisateur-inconnu-v2.jpg` |
| Soundjata combat | Soundjata/Soumaoro | `public/assets/library/geoafrique/soundjata/combat-refs/` |

---

## STYLE IDs ETABLIS

| Projet | Style ID | Tool | Status |
|---|---|---|---|
| _(aucun etabli)_ | | | |

---

## COUT MOYEN PAR SCENE

| Type scene | Tool | Cout |
|---|---|---|
| Image Gemini (char, background, icone) | Gemini 3.1 Flash | ~$0.04-0.08 |
| Seedance Short clip 5-10s | Seedance V2 T2V/I2V | $1.50-3.00 |
| Seedance reference-to-video 10s | Seedance 2.0 | ~$3.02 |
| Kling V3 Pro 4K | Kling | ~$0.50-2.00 |
| Recraft V3 SVG (Style ID) | Recraft | ~$0.04 |
| MiniMax H3 image-to-video 5s 2K | fal.ai | ~$1.30 |

---

## GATES PRE-API (pipeline_gates.py)

AVANT tout appel Seedance/Gemini payant significatif :
```bash
python3 -c "
import sys; sys.path.insert(0, 'scripts')
from pipeline_gates import pre_seedance_check
config = {'prompt': '''<PROMPT>''', 'image_refs': [<REFS>], 'clip_duration': <DUR>,
    'narration_duration': <NARR_DUR>, 'character_name': '<NAME>', 'has_environment': True,
    'estimated_cost': <COST>}
ok, results = pre_seedance_check(config)
for r in results: print(r)
print('VERDICT:', 'PASS' if ok else 'BLOCKED')
"
```
Gates : prompt structure, canonical ref, duration match, reverse bias, seedance inputs, character
context, chain continuity, fal.ai balance, TTS scan, face diversity. Si BLOCKED → fix AVANT l'appel.

---

## API BUDGET RULES — NON-NEGOTIABLE

Source de vérité : `.claude/agents/API-BUDGET-RULES.md`. Budget par beat (réinitialisé à chaque
beat) : PixelLab character/object/animation 2 gen max → checkpoint · Gemini image 2 gen max →
checkpoint · Seedance/Kling 0 appel autonome → attendre "go" Aziz.

Checkpoint après chaque appel payant : downscale si besoin → analyser (Read) → verdict 1 phrase →
STOP présenter Aziz → attendre validation.

Vérif balance : `./scripts/check-api-balance.sh all` (seuils : PixelLab <$1.00 STOP, ElevenLabs
<5000 chars STOP).

Agent Teams actif (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) — communication directe avec
remotion-composer possible sans passer par Claude principal. `/goal` et `/bg` disponibles en session.

---

## REVISION LOG (recent — historique complet dans archive)

- 2026-08-08 (2e passe) : Sonjata scene4 orbite — test corrigé (causalité barre + dot-eyes + sans
  audio). 2/3 défauts du brief RÉSOLUS avec méthode réutilisable (clause causale explicite + double
  fix image Gemini edit + clause prompt pour dot-eyes). Défaut audio traité par `ffmpeg -an` (aucun
  param natif trouvé). MAIS nouveau défaut critique NON anticipé découvert en review : bandeau noir
  progressif couvrant le tiers supérieur du cadre de t=3.7s à t=15s (~2/3 du clip) — clip NON livré
  à Aziz, non uploadé. Détail complet + hypothèses cause + piste prochain test :
  `memory/tools/minimax.md` section "Test corrigé — causalité barre + dot-eyes + sans audio".
- 2026-08-08 : Sonjata plan2 H3 chain — test 15s multi-strates (mère+figurant nommé+ambiance).
  Format/durée OK (480x864, 15.08s). Figurant nommé (vieil homme au châle) validé 2e fois — la
  règle "nommer précisément qui bouge" continue de fonctionner. Nuages+feuillage baobab : ÉCHEC,
  aucun mouvement malgré clause dédiée "CONTINUOUS AMBIENT MOTION" séparée. Rythme garçon/mère :
  compression en bloc t7-9 puis hold figé 9-15 (défaut inverse du 1er test, pas résolu). Détail
  complet + pistes prochain test : `memory/tools/minimax.md` section "Test 15s multi-strates".
  Coût ce clip : ~$1.23 (cumul mensuel $2.06→$3.29).
- 2026-08-07 (2e passe) : gotchas détaillés déplacés vers `GOTCHAS-TOOLS.md` (nouveau fichier),
  MEMORY.md resserré sous 140 lignes. P6 NorthShield livré (perso distinct de Sarah, style-matché
  via image-to-image, clip H3 validé 0 drift).
- 2026-08-07 : compaction 323→~140 lignes (plafond dur 200 lignes/25000 octets). Détail Sonjata/
  Thiaroye/Abou Bakari déplacé vers `archive/projets-detail-pre-2026-08.md`.
