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
| War-Map Sahel AES (long) | ⛔ REFONTE V6 en cours (non commité) | ⛔ **PUBLIÉ 2026-08-04, ÉCHEC** (5 vues/24h) |
| Franc CFA (mid-form) | ✅ livré | 🗓️ **PROGRAMMÉ 2026-08-11** |
| Soudan mid-form (long) | ✅ livré | 🗓️ **PROGRAMMÉ 2026-08-20** (titre/miniature/description faits 2026-07-31) |
| Short Sénégal D3 · Short AES 90s · Short CFA | ✅ TOUS PROGRAMMÉS via TryPost (2026-08-01/04/11) | CTA corrigé "EN BIO" — reste Short Soudan à construire |
| Short Soudan | ⏳ timing.ts LOCKED, assets/composition à faire | à CONSTRUIRE (Stage 3+) |

**Source de vérité unique** : `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
⛔ Vidéo LONGUE = upload MANUEL YouTube Studio (jamais TryPost). Shorts = TryPost.

---

## ÉTAT DES PROJETS VIVANTS

### War-Map Sahel AES — ⛔ REFONTE V6 EN COURS (2026-08-06, non commité)
**Source de vérité** : `memory/episodes/warmap-sahel/STATUS.md` (bandeau 2026-08-06 soir).
Vidéo longue publiée 2026-08-04, ÉCHEC (5 vues/24h, VPH 0.19). Script réécrit (V6), audio généré +
validé Aziz, retiming complet des constantes de timing fait et vérifié (check-frame-continuity.py, 0
trou/0 chevauchement). **RIEN commité**, aucun render complet fait. Reste : render + assemblage +
validation Aziz + republication.

⛔⛔ **Piège trouvé cette session, même famille que Soudan Actes 3/4 ci-dessous** : `Root.tsx` enregistre
2 compositions quasi-identiques pour l'Acte 1 (`SahelActe1-Final` et `SahelActe1-Refonte`) — SEULE
`SahelActe1-Refonte` correspond au FINAL réellement publié (vérifié pixel par pixel contre
`out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`, MD5 confirmé). `SahelActe1-Final` affiche un vieux
carton titre orphelin ("Tout a changé en trois ans") absent du FINAL — seul indice visuel entre les
deux. Détail : `feedback_deux-compositions-remotion-verifier-vs-livrable-reel.md`.

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

### Gazoduc — Actes 1+2 TERMINÉS · ⛔ Acte 3 GELÉ · ⭐ Acte 4 EN COURS (mouvement A fait, B+C à faire)
Acte 1 (hook, 84.68s, globe D3) validé par Aziz (render v6, 2026-08-03). Acte 2 **produit et validé en
finale (2026-08-04)** : `out/episodes/gazoduc-aagp-tsgp/acte2-FINAL.mp4` (127.4s).

**⛔⛔ Acte 3 — GELÉ EN WIP (décision Aziz 2026-08-15). NE PAS LE REPRENDRE.** Il n'est pas validé et il
reste du travail, mais on s'acharnait dessus depuis trop de sessions (même pattern que le Soudan Acte 4 :
un acte du MILIEU se juge par rapport à ses voisins, or ses voisins 4/5 n'existaient pas). **On produit
les Actes 4 et 5 d'abord.** Acquis à ne pas refaire : Beat 1 validé · Beat 2 = vrai insert composé (clip
H3 + jauge + connecteur) · Segment B (aéroport) fait. État complet + ce qui reste cassé (mesuré) :
`memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md` § "ACTE 3 — GELÉ EN WIP" (en tête).
⚠️ `memory/starters/STARTER-PROMPT-gazoduc-acte3-suite.md` est PÉRIMÉ (il fait reprendre l'Acte 3).

**⭐ Acte 4 — état au 2026-08-15** (commits `6aabb1d9` code · `aff4adeb` doctrine · `76ecfdf8` palette) :
- Audio `narration-p4.mp3` mesuré (124.04s), copié dans `public/`, timing des **3 mouvements** dérivé du
  forced-align réel : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe4Timing.ts`.
- **Mouvement A « une ressource, deux tuyaux » (0→41.1s) : CODÉ ET RENDU**, corrigé sur 6 gaps HIGH
  (`GazoducActe4RessourceUnique.tsx`, compo `D3-Gazoduc-Acte4-RessourceUnique`). Impulsions-comètes qui
  s'affament + source Nigeria qui s'épuise + UN seul insert au pic des 70% + verdict sobre.
  Render : `out/_r-and-d/gazoduc-acte4/4A-v5-AUDIO.mp4`.
- **Mouvements B (objectifs opposés, 41.1→74.5s) et C (calendrier qui se retourne, 74.5→124s) : à faire.**
  Timing déjà calé (`BEATS_4B` / `BEATS_4C`), storyboard pas encore fait.
- ⭐ **Nouvelle palette de carte SOMBRE adoptée** pour l'Acte 4 et la suite (source de vérité :
  `src/projects/_rnd/d3-16x9/ProtoCartePaletteGPT.tsx` → `PAL_GPT`). **1re action de la reprise = re-rendre
  4A avec cette palette, et RIEN D'AUTRE.** Actes 1/2/3 : re-render à la passe finale, pas acte par acte.
- **Méthode à rejouer pour B et C** (elle a produit A) : storyboard libre créative 2 modèles → validation
  Aziz → breakdown JSON → code → **3e appel comparatif rendu-vs-storyboard** → corrections. Gabarits de
  prompts prêts : `memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/`. Doctrine :
  `memory/doctrines/STORYBOARD-MAPBOX.md` § LA BOUCLE FERMÉE.
- **Acte 5 : n'existe pas** (robinet géant + mains stylisées, cf `PLAN-ACTES2-5.md` L118).

Source de vérité : `memory/NEXT-ACTION.md` § "GAZODUC ACTE 4 — REPRENDRE ICI".

### Maroc Batteries Short — reste A5 Géographie + assemblage
⚠️ Le NEXT historique de ce fichier annonçait « Beat 2 Cailloux à produire » / « bloc Remotion
Beat 2/4/5 » — **FAUX, vérifié 2026-07-30** : A3 Cailloux, A4 Acteurs et A6 Question sont FINAUX.
Seul **A5 Géographie** (Mapbox) reste à produire — et son état « stub/placeholder » annoncé depuis
le 3 juin est LUI AUSSI faux (`Beat4Geographie.tsx` fait 417 lignes, Mapbox complet). **Rendre et
regarder le beat avant de conclure quoi que ce soit.**

### Kora & Cartes — piste mythologie africaine (R&D exploratoire, 2026-08-13)
2 registres visuels testés sur le même beat (pacte/négociation Anansi/Nyame, Akan/Ghana), même
méthode H3 R2V (`submit_workflow` graphe API en dur).

**Registre "Poster Vector"** (flat vector explainer style Kurzgesagt) : V1 MITIGÉ (décor OK, geste
Anansi trop peu animé) → V2 **RÉUSSI sur les 3 axes corrigés** (dialogue FR `<d>[French]...</d>`
vérifié Whisper mot pour mot, étoiles scintillantes confirmées, geste Anansi nettement renforcé via
poses contrastées par tranche). Livrable V2 :
`memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-pacte-negociation-v2-dialogue-8s.mp4`.

**Registre "Whiteboard Doodle"** (trait marqueur noir + couleur sélective jaune/bleu, RSA-Animate/
TED-Ed) : V1 **MITIGÉ** — couleur sélective strictement respectée (aucune couleur parasite),
orbite dorée + pulse final OK, dialogue confirmé par forced-alignment (loss 0.055) — MAIS geste
Anansi quasi invariant (mains déjà hautes dès t=0 dans l'image source, la clause de contraste
n'a pas d'amplitude à exploiter contrairement au Poster Vector où l'image source partait mains
basses). Idle motion Nyame non concluante (trop subtile pour l'échantillonnage). Livrable :
`memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-whiteboard-doodle-v1-dialogue-8s.mp4`.

Détail technique complet des 3 runs : `.claude/agent-memory/visual-producer/GOTCHAS-TOOLS.md`.
**[STAGE-4] visual-producer kora-cartes-mythologie — BLOCKED : Whiteboard Doodle V1 mitigé (même
défaut geste Anansi que le Poster Vector V1) → attend verdict Aziz : (a) régénérer l'image source
Whiteboard Doodle avec Anansi en pose basse/repliée comme le Poster Vector avant de retenter le
même correctif V2, (b) accepter le geste tel quel et trancher entre les 2 registres visuels sur la
base de la couleur sélective/decor, ou (c) explorer une autre piste.**

### Flowdesk (test client simulé) — EN COURS, 2 registres en comparaison
Hors registre Souverain (positionnement freelance). Registre 2A abstrait : V1→V3 tranchées, V4
(hybride 2A+2B vidéo) en cours, Panneau 1 seul codé. Registre 2B (personnage, MiniMax H3) :
**panneaux 1+2 TERMINÉS ET VALIDÉS** (livrable v9, lien dans STATUS.md), panneaux 3+4 restants.
⚠️ Pas de branche dédiée (sur `feat/gazoduc-acte1-hook-globe`, hérité d'un autre chantier).
Décision finale (2A vs 2B vs hybride) EN ATTENTE d'Aziz. Source de vérité :
`memory/episodes/_client-sim/flowdesk/STATUS.md`.

### ✅ NorthShield (test client simulé) — CLOS 2026-08-08
Hors registre Souverain. Direction B (100% abstraite) rejetée sur le fond (2026-08-07). Storyboard
V3 mixte codé/assemblé (7 panneaux), refondu à 5 panneaux (2026-08-08) après retour détaillé
d'Aziz sur le 1er montage (P2/P3 supprimés, compteur P1 agrandi, deltas visibles P4, disque/anneau
P5+P6, bug LaptopMockup `width*1.3` corrigé, curseur actif + pic d'anomalie dramatisé en P6).
Validation Aziz directe obtenue ("la v3 est bonne") — pas de passage formel par Stage 6
quality-reviewer, la validation humaine prime. Livrable final :
`out/_client-sim/noteshield/FINAL/northshield-v3-FINAL.mp4`. Améliorations mineures identifiées
mais non traitées (trou VirtualCursor ~4s en P6, bonus P7) — décision Aziz de clore tel quel.
Source de vérité : `memory/episodes/_client-sim/noteshield/STATUS.md`.

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

(Stage 5 NorthShield V3 retiré du log — projet CLOS 2026-08-08, cf section Dormants/CLOS
ci-dessus. Détail technique complet conservé dans `memory/episodes/_client-sim/noteshield/STATUS.md`.)
  - P7 non touché (bonus non fait, pas de spec précise donnée par Aziz).
- Validation : `npx tsc --noEmit` clean sur tous les fichiers touchés (2 erreurs pré-existantes
  ailleurs dans le repo, sans lien). 1 bug d'accent trouvé et corrigé pendant le scan systématique
  (`"Horaire coherent"` → `"Horaire cohérent"`). 29 stills ciblés rendus via
  `.scratch-composer/render-stills.mjs`, choisis précisément sur les événements internes calculés
  (ex. frame du punch-in dérivée de `T_VIGILANCE_CUT_IN + 0.22s`), tous inspectés visuellement.
  Résultat : compteur P1 net, deltas P4 lisibles en transit vers le score, disque/anneau P5+P6
  fonctionnels (chassis laptop entier visible), cascade+curseur P6 visibles tout du long, pic
  d'anomalie désormais net (spike rouge + shockwave, frame ~1560) — corrige le défaut initial
  "je n'ai même pas vu le pic".
- Statut : READY FOR STAGE 6 (quality-reviewer). Dev server non lancé (validation stills ciblés
  jugée suffisante, cf justification Option A dans RULES-ACTIVE.md pour ce projet mixte complexe).
