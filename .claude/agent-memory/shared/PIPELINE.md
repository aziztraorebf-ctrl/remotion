# Production Pipeline — Shared Workspace (5 agents)

> Fichier partagé. Chaque agent écrit sa section lors de son invocation.
> Claude principal orchestre les handoffs.
>
> **Refondu 2026-05-20** (Grand Ménage) → historique dans
> `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`.
> **Re-nettoyé 2026-07-30** : 88 Ko → ce fichier. ~25 sections closes ([COMPLETE], [PÉRIMÉ],
> épisodes publiés) supprimées. Git conserve tout.
>
> ⛔ **RÈGLE** : un handoff `[COMPLETE]` se **SUPPRIME** une fois le stage suivant démarré.
> L'état durable d'un épisode vit dans `memory/episodes/<ep>/STATUS.md`, PAS ici. Ce fichier ne
> garde que ce qui est **en cours**.

---

## 📤 PUBLICATION — état de diffusion

> ⭐ La chaîne a commencé à publier après 25 jours de blocage. **État de DIFFUSION** (distinct de
> l'état de production : une vidéo « livrée » n'est pas forcément publiée).

| Vidéo | Production | Diffusion |
|---|---|---|
| Sénégal Pétrole & Gaz (long) | ✅ livré | ✅ **PUBLIÉ 2026-07-30** |
| War-Map Sahel AES (long) | ✅ livré | 🗓️ **PROGRAMMÉ 2026-08-04 14h45** |
| Franc CFA (mid-form) | ✅ livré | titre + miniature prêts → upload manuel Studio ~11 août |
| Short Sénégal D3 · Short AES 90s · Short CFA | ✅ livrés | à programmer, tous bloqués crédits TryPost épuisés (⛔ règle : Short + longue liés sortent le MÊME JOUR) |
| Short Soudan | ⚠️ n'existe pas | à CONSTRUIRE |

**Source de vérité unique** : `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
⛔ Vidéo LONGUE = upload MANUEL YouTube Studio (jamais TryPost). Shorts = TryPost.

---

## ÉTAT DES PROJETS VIVANTS

### Soudan mid-form — v4 produite, reste les raccords audio
**Source de vérité** : `memory/episodes/soudan-midform/STATUS.md`.
6/6 actes codés, v4 assemblée 2026-07-22 (11/12 pts polish faits). Livrable :
`out/episodes/soudan-midform/wip/passe-finale-v4/soudan-midform-v4-MIX.mp4`.
**Reste** : raccords audio + plateau ~7 s Acte 6. Prochaine session **en direct, sans agents**.

> ⛔⛔ **Fichiers actifs des Actes 3/4 — vérifié 2026-07-30 par date de commit + contenu du montage
> final réel** (le v4-MIX contient `a3-section1.mp4` + `a3-insert.mp4`, noms qui correspondent aux
> compositions Globe D3, produits par le commit `828e1d27` du 22/07) :
> - ✅ **ACTIFS** : `src/projects/_rnd/d3-16x9/*Globe.tsx` (Section1/Insert Acte 3, B1-B4/B6 Acte 4,
>   Actes 5 et 6).
> - ⛔ **PÉRIMÉS** : `src/projects/warmap/soudan-acte3/SoudanActe3.tsx` et
>   `soudan-acte4/SoudanActe4.tsx` (Mapbox) — existent encore sur disque et compilent (importés dans
>   Root.tsx), mais ne sont plus la source du montage final. Ne pas les rouvrir.
> ⚠️ Une note antérieure de ce fichier (datée du 22/07, supprimée à ce ménage) affirmait l'inverse en
> citant Root.tsx comme preuve — Root.tsx importe les DEUX versions (elles compilent toutes les
> deux), ce qui ne suffit pas à trancher laquelle est montée. Vérifier le contenu réel du dossier
> `wip/passe-finale-v4/` (noms de fichiers + date de commit du composant), pas seulement Root.tsx.

### Franc CFA mid-form — 🏁 TERMINÉ
`out/PRET-PUBLICATION/franc-cfa-midform-FINAL.mp4` (4 min 28, −17,2 LUFS). Les 3 fixes du visionnage
sont appliqués et validés (Guinée visible, sac de riz retiré, pings audibles). Musique
`music-A-ambient-souverain`, volume 0.0716, fenêtre 19,6→259,7 s, aucune boucle.
⛔ Grain et creux d'animation ÉCARTÉS APRÈS TEST — ne pas rouvrir.
⚠️ Worktree `remotion-cfa` sur `feat/cfa-nuit1994-svg-mix`, **non mergé**, `node_modules` non
ignoré : **jamais `git add -A`** dedans.

### Scènes à personnages — R&D CLOSE, socle complet
Mergé dans `master` le 2026-07-29. 7 tests tranchés, 3 registres validés (CONTEMPLATIF /
SCHÉMATIQUE / DÉMONSTRATIF). 2 verdicts durables : **le modèle dessine le DÉCOR, nous animons les
PERSONNAGES** · **Fable 5 = modèle SVG par défaut** (2 tests aveugles gagnés contre Opus).
Doctrine : `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`.
⚠️ Bug `BRAS_LAG` non corrigé au socle — décision d'Aziz en attente (corriger obligerait à
revalider 6 planches).
⚠️ Registre stick figure (6 scènes narratives) reste sur worktree `remotion-cfa`,
`rnd/stick-figures-gestes`, **non mergé** — `jamais git add -A` (node_modules non ignoré).

### Gazoduc — PROCHAINE VIDÉO
Sujet GO. Hérite des R&D closes (piliers SVG, personnages, planche NotebookLM).
⛔ Piège de la carte : sujet abstrait → scène-objet.

### Maroc Batteries Short — reste A5 Géographie + assemblage
⚠️ Le NEXT historique de ce fichier annonçait « Beat 2 Cailloux à produire » / « bloc Remotion
Beat 2/4/5 » — **FAUX, vérifié 2026-07-30** : A3 Cailloux, A4 Acteurs et A6 Question sont FINAUX.
Seul **A5 Géographie** (Mapbox) reste à produire — et son état « stub/placeholder » annoncé depuis
le 3 juin est LUI AUSSI faux (`Beat4Geographie.tsx` fait 417 lignes, Mapbox complet). **Rendre et
regarder le beat avant de conclure quoi que ce soit.**

### 💤 Dormants
Hannibal (Beat 2 Phase C non codée) · Xénophobie SA (gelé, gate audience) · Maroc Batteries
mid-form (backlog, après le Short).

---

## Workflows actifs

- **A — Beat Souverain Remotion/Tailwind** : `scripts/beat-session.py` (`/beat`) — 6 phases
  (breakdown → code → self-review 19/23 → review Gemini → corrections → upload).
  `memory/rules/rules-beat-production.md`.
- **B — Atlas direct** : `scripts/atlas-session.py`, pas d'agents intermédiaires.
- **C — Beat Mapbox carte** : `scripts/mapbox-session.py` + `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`.
  Self-review scriptée d'abord : `python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx>`.
- **D — SVG génératif / registre personnages** : `memory/doctrines/SVG-SCENES-GENERATIVES.md`.
  Voie par défaut des Shorts et du mid-form SVG.

⛔ **Render Mapbox/WebGL → `scripts/render-mapbox.sh` OBLIGATOIRE** (Vercel ne supporte pas WebGL
headless ; `npx remotion still`/`render` brut échouent avec "Failed to initialize WebGL").

**Le système agentique 5-stages (ci-dessous) reste la référence** pour une production complète
nécessitant narration + storyboard + assets multiples, mais les workflows A-D ci-dessus sont ceux
utilisés en pratique depuis mi-mai pour les beats simples/itératifs.

---

## Agent Team (5 agents Stage 1→6)

1. **audio-director** — Narration TTS (ElevenLabs V3) + musique (Minimax v2.6) + mix
2. **storyboarder** — Script + audio mesuré → `timing.ts` frame-précis
3. **visual-producer** — Assets multi-outils (Gemini, Seedance, Kling, Recraft, fal.ai, PixelLab)
4. **remotion-composer** — Composition Remotion + mini-render validation
5. **quality-reviewer** — Review multi-dimensions + verdict APPROVE/MINOR FIX/RE-EVALUATE

`creative-director` est **actif** (challenge de direction avant code) — l'ancienne note « archivé »
était fausse. Définitions dans `.claude/agents/`.

**Pipeline complet** :
```
Stage 0  Claude + Aziz       → Script locked
Stage 1  audio-director      → Narration + musique + mix (scan TTS bloquant)
Stage 2  storyboarder        → timing.ts frame-précis (audio mesuré)
Stage 3  visual-producer     → Visual Plan proposal → Aziz approuve
Stage 4  visual-producer     → Assets générés (preview-before-pay)
Stage 5  remotion-composer   → Composition + mini-render 3-4s bloquant
Stage 6  quality-reviewer    → Review multi-dim + Kimi + verdict
Stage 7  Aziz                → Validation finale
Stage 8  Claude (main)       → Render final OU fix iteration
```
Format de handoff entre agents : `.claude/agent-memory/shared/TODOWRITE-PATTERN.md`.
Chaînage **jamais automatique** hors session `/goal`. Handoff = fichier sur disque, jamais
TodoWrite cross-agent.

---

## Patterns validés cross-projet (références durables)

- **Hook Short (teaser 5 s)** — `memory/templates/` + `BrutalHookSplit` dans
  `src/projects/_shared/components/layouts/`.
- **Musique Minimax 2.6** — `memory/tools/minimax.md` (~0.30 $/track 3 min).
- **Narration ElevenLabs V3** — voix GéoAfrique V2 `z3gESu49naEZW8Af2Upm`. Règles TTS françaises
  NON-NÉGOCIABLES : `memory/tools/elevenlabs.md` + CLAUDE.md projet.
- **Audio Remotion** — `<Audio src={staticFile(...)} />` + `AUDIO_SEGMENTS` audio-derived timing.
- **Atlas Blueprints (8 patterns)** — `src/projects/atlas/_blueprints/`.
- **Drapeaux sur carte** — `useClipFlags` (pitch 0) / `MapboxCountryFlagDecal` (avec pitch).
  ⛔ JAMAIS `drawFlagCanvas`. SFX : `<Sequence from durationInFrames>`, jamais `{frame===X}`
  (ne joue pas en render). Détail : `memory/feedbacks/feedback_sfx-sequence-et-drapeaux-reels.md`.
- **17 templates Mapbox premium créés 2026-06-02** (FlagFill, IsolateZone, BorderPulse,
  GlassPopup, FlagReveal, LottieGeoAura, Sweep/Domino/FiberOptic, hooks+inserts+combos) — tous
  référencés dans `src/projects/_shared/mapbox/MAPBOX-COMPOSANTS.md`.

---

## HANDOFF LOG (sessions actives)

> Format : `## Stage N — Agent — Projet — Date [COMPLETE / IN PROGRESS / BLOCKED]`
> Un agent ajoute son entrée en terminant son stage. **Elle se supprime** une fois le stage suivant
> engagé — l'état durable va dans `memory/episodes/<ep>/STATUS.md`.

*(Aucun handoff en cours au 2026-07-30.)*
