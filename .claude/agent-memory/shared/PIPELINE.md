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
| War-Map Sahel AES (long) | ✅ livré | 🗓️ **PROGRAMMÉ 2026-08-04** |
| Franc CFA (mid-form) | ✅ livré | 🗓️ **PROGRAMMÉ 2026-08-11** |
| Soudan mid-form (long) | ✅ livré | 🗓️ **PROGRAMMÉ 2026-08-20** (titre/miniature/description faits 2026-07-31) |
| Short Sénégal D3 · Short AES 90s · Short CFA | ✅ TOUS PROGRAMMÉS via TryPost (2026-08-01/04/11) | CTA corrigé "EN BIO" — reste Short Soudan à construire |
| Short Soudan | ⏳ timing.ts LOCKED, assets/composition à faire | à CONSTRUIRE (Stage 3+) |

**Source de vérité unique** : `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
⛔ Vidéo LONGUE = upload MANUEL YouTube Studio (jamais TryPost). Shorts = TryPost.

---

## ÉTAT DES PROJETS VIVANTS

### Soudan mid-form — 🏁 TERMINÉ, v7 promue FINAL (2026-07-31)
**Source de vérité** : `memory/episodes/soudan-midform/STATUS.md`.
6/6 actes codés. Livrable final : `out/PRET-PUBLICATION/soudan-midform-FINAL.mp4` (10min36).
Titre, miniature, description, programmation (2026-08-20) : FAITS. **Reste** : Short Soudan
(boucle NotebookLM) — n'existe pas encore.

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
⚠️ Registre stick figure (6 scènes narratives sources) reste sur worktree `remotion-cfa`,
`rnd/stick-figures-gestes`, **non mergé** — `jamais git add -A` (node_modules non ignoré).
✅ 2026-08-03 : nouveau travail (héritage de pose 2e cas + portage P_SOL) fait et **commité dans le
repo principal** (`14990278`, branche courante, PAS ce worktree) — distinct des 6 scènes sources,
voir `src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` brique n°7 + `NEXT-ACTION.md`.

### Gazoduc — Actes 1 et 2 TERMINÉS, Acte 3 à démarrer
Acte 1 (hook, 84.68s, globe D3) validé par Aziz comme base de production (render v6, 2026-08-03).
Acte 2 **produit et validé en finale (2026-08-04)** : `out/episodes/gazoduc-aagp-tsgp/acte2-FINAL.mp4`
(127.4s), 4 segments montés bout à bout (insert signature Freetown → carte D3 tracé AAGP courte →
insert flashback genèse 2016 → insert financement manquant). 20 SVG candidats "liberté créative"
(5 modèles) sauvegardés (`memory/episodes/souverain/gazoduc-aagp-tsgp/svg-inserts-acte2-candidats/`).
**Acte 3 (TSGP) — timing.ts LIVRÉ 2026-08-04** (Stage 2 storyboarder COMPLETE, voir HANDOFF LOG) :
`src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe3Timing.ts`, 3 segments (A carte D3 tracé
Nigeria→Niger→Algérie 73.93s, B insert sécurité JNIM/EI+Niamey 31.87s, C insert paradoxe Maroc/
Algérie 17.27s), 123.07s total. Aucun visuel encore produit — prochaine étape : da-brief-gate puis
code des 3 composants. Source de vérité : `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md`.

### Maroc Batteries Short — reste A5 Géographie + assemblage
⚠️ Le NEXT historique de ce fichier annonçait « Beat 2 Cailloux à produire » / « bloc Remotion
Beat 2/4/5 » — **FAUX, vérifié 2026-07-30** : A3 Cailloux, A4 Acteurs et A6 Question sont FINAUX.
Seul **A5 Géographie** (Mapbox) reste à produire — et son état « stub/placeholder » annoncé depuis
le 3 juin est LUI AUSSI faux (`Beat4Geographie.tsx` fait 417 lignes, Mapbox complet). **Rendre et
regarder le beat avant de conclure quoi que ce soit.**

### Flowdesk (test client simulé) — EN COURS, 2 registres en comparaison
Hors registre Souverain (positionnement freelance). Registre 2A abstrait : V1→V3 tranchées, V4
(hybride 2A+2B vidéo) en cours, Panneau 1 seul codé. Registre 2B (personnage, MiniMax H3) :
**panneaux 1+2 TERMINÉS ET VALIDÉS** (livrable v9, lien dans STATUS.md), panneaux 3+4 restants.
⚠️ Pas de branche dédiée (sur `feat/gazoduc-acte1-hook-globe`, hérité d'un autre chantier).
Décision finale (2A vs 2B vs hybride) EN ATTENTE d'Aziz. Source de vérité :
`memory/episodes/_client-sim/flowdesk/STATUS.md`.

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

## Stage 2 — storyboarder — Gazoduc Acte 3 (TSGP) — 2026-08-04 [COMPLETE]
- Input : audio mesuré `out/episodes/gazoduc-aagp-tsgp/narration-p3.mp3` — 123.065760s (ffprobe),
  LOCKED. Alignement mot-à-mot réel (forced-align ElevenLabs) `narration-NEW.alignment.json`, 2105
  mots sur le fichier concaténé complet, offset P3 = 223.572086s.
- Output : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe3Timing.ts`
- Format : 3 segments montés bout à bout (même moule que l'Acte 2 — PAS un monolithe) : A carte D3
  tracé TSGP (2218f/73.93s), B insert sécurité JNIM/EI+Niamey (956f/31.87s), C insert paradoxe
  Maroc/Algérie (518f/17.27s).
- FPS : 30 | TOTAL_FRAMES contenu : 3692 (123.07s) | AUDIO_SAFETY_MARGIN_F : +9f par segment (pattern
  Acte 2 repris à l'identique).
- BEATS : 11 (segment A) + 12 (segment B) + 6 (segment C) frames-repères, tous vérifiés contre le
  forced-align réel, aucun inventé.
- Écart signalé (non bloquant) : dernier mot "conflit." se termine à 123.148s dans le forced-align,
  82ms après la durée mesurée réelle (123.06576s) — mot légèrement clippé en fin d'audio, absorbé
  par la marge de sécurité +9f comme sur tous les segments Acte 2.
- Note convention : ce projet embarque normalement le timing en constantes inline PAR fichier de
  scène (pas de timing.ts centralisé) — ce fichier séparé est un contrat pré-code explicite,
  à copier/adapter dans les 3 fichiers de scène lors du codage (pas à importer tel quel si ça
  casse la convention existante du projet).
- Status : READY FOR STAGE 3 (da-brief-gate puis code des 3 composants — remotion-composer).

## Stage 2 — storyboarder — Soudan Short — 2026-08-01 [COMPLETE]
- Input : audio mesuré `public/_shared/audio/soudan-short/narration-v1-pauses-v2.mp3` — 111.337506s
  (ffprobe), LOCKED, ne pas régénérer. Alignement mot-à-mot déjà vérifié 311/311 mots
  (`whisper-words-soudan-short.ts`).
- Output : `src/projects/warmap/shorts/soudan-short/timing.ts`
- Format : SCENES-only flat, 7 blocs (mouvementA / pause1 / pivot / mouvementB / pause2 / chute / cta)
- FPS : 30 | TOTAL_FRAMES : 3340
- BEATS : 26 frames-repères géo-alignées (Darfour, Émirats x4, Égypte x2, Russie x2, Turquie, Hemeti,
  climax "incendie/main"…) — toutes vérifiées par script indépendant contre le whisper source.
- Écarts signalés dans le fichier (à lire avant de coder) : les 2 pauses "1.0s déterministes"
  prévues au script mesurent en réalité 0.94s et 0.66s dans l'audio livré — timing.ts suit les
  valeurs réelles, pas la valeur planifiée. Texte overlay CTA doit dire "EN BIO", jamais
  "en description" (l'audio dit "lien en description", Aziz a tranché que ça ne s'affiche pas).
- Notes pour Stage 3 : GEO_SEQUENCE documentée (Sudan / United Arab Emirates / Egypt / Russia /
  Turkey — noms Natural Earth 110m vérifiés présents dans
  `public/_rnd/vox-repro/countries-110m.json`). Le composant visuel prévu `GlobeRecitProto.tsx`
  n'existe QUE sur le worktree `remotion-soudan` (branche `feat/soudan-passe-finale-6lots`), PAS sur
  master — devra être adapté au format 9:16 avant utilisation dans ce Short.
- Status : READY FOR STAGE 3 (visual-producer/remotion-composer).
