# Production Pipeline — Shared Workspace (5 agents)

> Fichier partagé. Chaque agent écrit sa section lors de son invocation.
> Claude principal orchestre les handoffs.
>
> **Refondu 2026-05-20 (Grand Ménage)** — l'historique complet des handoffs
> des sessions Sonjata/Thiaroye/Abou Bakari/Or Africain/Silicon Savannah/etc.
> est archivé dans `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`
> (491 lignes). Ce fichier reflète l'état actuel et les workflows actifs.

---

## Cacao → Chocolat Short — ✅✅ TERMINÉ, PUBLIÉ (2026-07-01)
> Short SVG vertical 9:16 (98,5s), pilier Souverain, registre encre GGW. COMPLET et validé Aziz.
> Livrable : `out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4`. Publication YT 2026-07-01 14h UTC.
> Source de vérité : `memory/episodes/souverain/cacao-chocolat-short/STATUS.md`.

---

## [STAGE-1] audio-director — GGW Muraille Verte B4+B5 (correction FMNR) — COMPLETE (2026-06-25)

Regeneration FACTUELLE de B4+B5 SEULS (retrait melange demi-lune/FMNR -> FMNR pure). B1/B2/B3/B6 inchanges.
- narration-beat4.mp3 = **24.985s / 750 frames@30** (Tony Rinaudo / souches dormantes) — beat4.alignment.json
- narration-beat5.mp3 = **14.118s / 424 frames@30** (preuve raccourcie) — beat5.alignment.json
- beat-bounds.json v4 (B5/B6 decales en start/end ; total 114.521s)
- Pipeline V3->STS reproduit EXACT (voix coherente avec les 4 autres beats). 0 clipping, RMS sains.
- catbox B4 https://files.catbox.moe/9geiq6.mp3 | B5 https://files.catbox.moe/5jgb0o.mp3
- VALIDATION PENDING Aziz (ecoute). Detail : `.claude/agent-memory/audio-director/MEMORY.md` (session 2026-06-25).
- → Agent d'animation B4/B5 : durationInFrames = 750 (B4) / 424 (B5). Decoupage mot->frame dans beat{4,5}.alignment.json.

---

## War-Map Sahel — 2026-07-05 [VIDÉO FINALE VALIDÉE, PROMUE PRET-PUBLICATION] — PRIME sur les entrées ci-dessous (périmées)

**[STAGE-FINAL] warmap-sahel — TERMINÉ.** Session C conclue : fix audio "déjà" (splice backup TTS), 1er
render complet bout-en-bout Acte1+P1+P2+P3+P4 jamais fait avant, puis une passe complète de retours
post-visionnage Aziz appliqués et validés : CEDEAO 3e itération de direction (zoom élargi + vrais
contours pays côtiers + pulse+flèches), portraits dirigeants P4 refaits à partir de vraies photos
officielles (1re tentative sur illustration stylisée REJETÉE), SFX corrigés (bug root `startFrom` sur
`<Audio>`), hook "3" recentré (mesure pixel), doublon audio "tensions..." corrigé (cause confirmée par
force-alignment Whisper). **Validé Aziz SANS RÉSERVE** sur le render final. Promu
`out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4` (386MB, 7min30, 13501 frames). `wip/` purgé (3.4GB).
**▶ RESTE avant publication** : thumbnail + titre uniquement (tâche courte, starter
`memory/STARTER-PROMPT-warmap-sahel-thumbnail-titre.md`).
Point ouvert non bloquant (ne pas ré-investiguer sans piste nouvelle) : liseré blanc résiduel sur
frontières CEDEAO (Mapbox natif, 3 tentatives de fix éliminées, cause exacte non isolée).
Détail complet : `memory/episodes/warmap-sahel/STATUS.md` § "SESSION C — ÉTAT".

---

## War-Map Sahel — 2026-07-04 [SESSION B QUASI TERMINÉE · SESSION C EN ATTENTE] — PÉRIMÉ, voir entrée 2026-07-05 ci-dessus

**[STAGE-CODE] warmap-sahel — Session B (branchement + fixes) QUASI TERMINÉE.** Les 2 nouveaux composants
SVG (`LiptakoRevealSVG.tsx`, `ResourcesRevealSVG.tsx`) sont branchés dans le moteur réel
(`Partie3Rupture.tsx`, `Partie4Cout.tsx`, remplacent les anciens composants legacy) et validés Aziz en
mini-renders contexte réel. 9 fixes techniques appliqués (HUD résiduel retiré, points villes continus
retirés P1, SFX doublons retirés, sources mal placées corrigées, portraits flous P4 corrigés — cause
réelle = style gravure fine qui ne survit pas au downscale, pas un bug d'opacité —, caméra CEDEAO
repensée hors du cadre Sahel) + un fondu de transition P3→P4 ajouté, tout validé Aziz.

---

## War-Map Sahel — 2026-06-27 [ACTE1 REFAIT+VALIDÉ · P1/P2 AUDITÉS · P4 EN MORCEAUX] — PÉRIMÉ, voir entrée 2026-07-05 ci-dessus

**[STAGE-CODE] warmap-sahel — Acte1 refondu (hook+corps+SFX) VALIDÉ Aziz.** Compo `SahelActe1-Refonte` (71s),
`out/episodes/warmap-sahel/acte1-FINAL.mp4` (catbox `6azb9e`, v2 SANS tension-drone — le SFX drone d'assise
dérangeait Aziz, RETIRÉ + proscrit partout). SVG-insert franc CFA alternatif produit (système agentique,
mix-and-match, `WarmapCfaInsertSVG`, catbox `228hiw`) — coexiste avec `p4-cfa-FINAL.mp4` (Remotion) pour
comparatif futur, aucun remplacement.
**Audits P1 + P2 FAITS** (lecture seule) : `AUDIT-AMELIORATIONS-P1.md` / `-P2.md` — backlog priorisé EN ATTENTE
de validation Aziz (pas encore traité). **P4 reste EN MORCEAUX** (exode/ressources/confed/CFA), PAS complète
(contredit l'entrée 06-15 ci-dessous).
**NEXT** : (1) passe audit complète (agents scène P3+P4-confirmer + agent TRANSVERSAL, méthode
`memory/doctrines/PASSE-AMELIORATION-SCENE-PAR-SCENE.md`) ; (2) Aziz valide backlog P1/P2 → agents correction ;
(3) assembler P4 morceaux → p4-FINAL ; (4) assemblage final (concat Acte1+P1+P2+P3+P4 + musique D + mix).
Détail : `memory/episodes/warmap-sahel/STATUS.md`.

---

## War-Map Sahel — TOUTES SCÈNES FINAL · NEXT = ASSEMBLAGE — 2026-06-15 [PÉRIMÉ — voir entrée 2026-06-27 ci-dessus]

Acte1 ✅ · P1 ✅ · P2 ✅ · P3 ✅ · **P4 ✅ (les 6 scènes : exode, coût, ressources, confédération, CFA, fin
habitée)**. Toutes FINAL + full HD dans `out/episodes/warmap-sahel/`. **NEXT = ASSEMBLAGE UNIQUEMENT** (aucune
scène à créer/corriger) : rendre P4 complète (compo `SahelPartie4`, f9416→13440, `--gl=angle`) → concat
Acte1+P1+P2+P3+P4 + narration `narration-v5-expressive.mp3` + mix → PUIS Gemini sur la vidéo complète → dérivés.
⭐ DOC REPRISE : `memory/NEXT-ACTION.md` (en-tête) + `memory/episodes/warmap-sahel/STATUS.md` (à jour) +
`INVENTAIRE-TEMPLATES-SESSION-06-15.md`. ⛔ OBSOLÈTES : `PLAN-REFONTE-P4.md`, `BRIEF-PASSATION-P4*.md` (refonte
TERMINÉE). Templates créés 06-14/15 : `WarMapDimmedOverlay` + `WarMapSplitScreen` (2/3 volets + accordéon).
Commits récents : 20626c2+8ccae8f (ressources), 660bf05+06cc12c (CFA), 05c229b+e6a6146 (confed).

## War-Map Sahel — SCRIPT V5 refondu + AUDIO + PIPELINE VOIX validé — 2026-06-10 [SCRIPT LOCKED, voix résolue]

Session longue et décisive. B1 confus = symptôme d'une SURCHARGE NARRATIVE de tout le script.
**Refonte complète :** DA upstream 3 voix (show-don't-tell) → script V5 LINÉAIRE → fact-check Sonar Pro
(1 erreur + 5 imprécisions + ajout confédération 2024) → SCRIPT V5 LOCKED → audio V5 généré (7min28).
Décodage Infographics Show (8 leçons grammaire d'explication) intégré.
**Pipeline VOIX résolu** (problème monotonie GéoAfrique) : ElevenLabs V3 + tags → Speech-to-Speech vers
GéoAfrique. Benchmark complet (Hume/Google/clonage écartés). Doctrine : `PIPELINE-VOIX-VIVANTE-VALIDE.md`.
**NEXT :** Session voix (recherche expressivité V3 + pricing EL + industrialiser pipeline → régénérer audio
Sahel vivant) PUIS session Sahel (alignment → re-découpage beats → coder Partie 1 canari).
⭐ BRIEF DE PASSATION : `memory/episodes/warmap-sahel/BRIEF-PASSATION-2026-06-10.md`. STATUS + NEXT-ACTION à jour.
3 leçons durables gravées (key-learnings : chrono linéaire, fact-check systématique, persister réponses modèles).

## Peste 1347 — Beat5 débloqué + Beat6 finale créée — 2026-06-08 [COMPLETE — 6 beats FINAL]

Session marquante. **Les 6 beats de Peste 1347 sont FINAL.**
- **Beat5 Mali Vivant** débloqué via DA-BRIEF-GATE (après ~15 essais à l'aveugle) : da-compare vs
  Mansa Moussa + da-brief Kimi → diagnostic = CHORÉGRAPHIE (pas les assets) → plan validé --upstream
  → reconstruction par couches (serpentin path courbe, track continu, easing, rouge depuis port,
  frontières Mali, ralenti, musique, zoom). `beat5-FINAL.mp4` (v17).
- **Beat6 Conclusion** ("la géographie n'est pas neutre") = FINALE, 1er beat conçu 100% en amont
  (plan Gemini+Kimi validé AVANT code). Faille Sahara + phrase écriture-plume + désaturation. `beat6-FINAL.mp4` (v5).
- **2 bugs corrigés (key-learnings.md)** : audio `trimAfter` absolu (voix absente non vue 3 renders) +
  territoires d'outre-mer rouges (clipPath Europe).
- Diagnostics/plans : `memory/episodes/peste-1347/{beat5-diagnostic,beat6-construction}/`.
- **NEXT (plan Aziz)** : gros render 6 beats → review Gemini up+downstream + AUDIT GÉO colorations
  Europe rouge sur TOUS les beats (vérifier bug territoires lointains pas reproduit) → PUIS assemblage.

## Veille mapanimation.io + Doctrine "inspiration externe" — 2026-06-03 [COMPLETE — R&D]

Session R&D (pas de production). Decode complet du concurrent mapanimation.io (89 templates, 13 premium analyses) = AI text-to-map-video sur NOTRE stack (Mapbox+renderer serveur), pas d'After Effects, sprites = images posees. Reproductible.
**Cree** : `GeoFlowConnection.tsx` + `AnimatedRouteOverlay.tsx` (routes animees, sprite avion/cargo/dot, headless-safe). Comble le gap "Flux inter-pays".
**Doctrine "inspiration externe"** gravee dans `SOUVERAIN-VISUAL-PLAYBOOK.md` section 2bis PUIS corrigee apres 2 tests : complementarite (pas densite), suit-la-voix, lisibilite, plafond simultaneite 9:16 (max 2 couches), 2D-flat-eux vs 3D-pitch-nous, sequentiel pas metronome.
**2 tests valides la methode** : (1) test reel beat A5 Maroc (V4 surcharge → rejete → revenu V3) a corrige la doctrine ; (2) agent vierge a trouve 4 dettes → toutes corrigees (self-review scriptee cablee dans mapbox-session.py, seuil Gemini neutralise = signal pas juge, warnings sprite/pitch, plafond chiffre).
Memoires : `_r-and-d-mapanimation-{catalog.json,ANALYSE.md,PREMIUM-DECODE.md}` + `feedback_mapanimation-veille-et-geoflow.md`.
**NEXT (voir NEXT-ACTION)** : (A) double audit doctrine en session propre ; (B) 2e voie Atlas Pur (friction projection nulle car Atlas deja 2D flat).

## Short "Petrole de la patience" — 2026-06-03 [COMPLETE — PUBLIE]
Showcase `_demos` refondu en livrable `src/projects/souverain/petrole-patience-short/`.
FINAL `out/PRET-PUBLICATION/petrole-patience-short-FINAL.mp4` (91s). Programme Postiz 9 juin 15h UTC (4 plateformes) = teaser du mid-form. Niger uranium retire du 9 juin (standby).
⚠️ Mid-form Senegal programme le 20 juin pointe vers fichier 25 mai (pre-FC-2/FC-4) — a corriger avant le 20.

## Système Beat Remotion HERO DATA — 2026-06-03 [COMPLETE]

Parité avec le système Mapbox. Doctrine `SOUVERAIN-REMOTION-PLAYBOOK.md` (8 principes + SFX),
catalogue HERO DATA (`COMPOSANTS-INDEX.md`), pipeline `beat-session.py` durci (phase 0 SCAN
complet + gate storyboard Gemini multi-panels obligatoire). Briques : CountUp(bounce),
HeroMirrorBars, HeroVerticalBars, FloatingHeroObject(clipCircle/spin), Badge(satellite),
SubtitleBarSouverain, TextChoc. Assemblage : `SOUVERAIN-REMOTION-SKELETON.md`.
**1er beat produit (preuve bout-en-bout)** : A3 Cailloux Maroc → `out/episodes/maroc-batteries/a3-cailloux-FINAL.mp4`.
Branche : `feat/systeme-remotion-hero-data` (6 commits, à merger dans master quand Aziz valide).

---

## Workflows actuellement actifs (depuis ~mi-mai 2026)

Le système agentique 5-stages reste **la référence** pour la production vidéo
complète et est conservé pour usage futur. Mais depuis ~5 semaines, deux
workflows allégés sont utilisés en pratique :

### Workflow A — Beat Souverain (`scripts/beat-session.py`)

Pipeline 6 phases automatisées par script, Claude main code en direct :
```
1. breakdown    → Gemini 3.1-pro analyse le storyboard (JSON tailwind_layout)
2. code         → Claude écrit Beat*.tsx avec Tailwind (tokens text-gold, etc.)
3. self-review  → 23 critères de qualité, seuil 19/23 bloquant
4. review       → Gemini 3.1-pro vérifie le render (1 seul appel)
5. corrections  → Itérations autonomes
6. upload       → Catbox + ntfy mobile Aziz pour validation finale
```

Documentation complète : `memory/rules-beat-production.md` + section
"Pipeline Beat Souverain" du CLAUDE.md projet.

### Workflow B — Atlas direct

Claude main + PixelLab MCP + Mapbox + scripts `scripts/atlas-session.py`.
Pas d'agents intermédiaires. Storyboard markdown → code → render.
Beats Atlas (Peste 1347 actif) suivent le pattern documenté dans
`src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`.

### Quand utiliser les 5 agents Stage 1→6 ?

Pour les productions narratives complètes nécessitant le full pipeline :
- Shorts ambitieux avec narration + storyboard + assets visuels multiples
- Épisodes Atlas riches (PixelLab characters + tilesets + animations)
- Quand tu veux la rigueur du multi-agents avec handoffs traçables

Pour les beats simples ou itératifs : Workflow A ou B suffisent.

---

## Agent Team (5 agents — préservés, prêts à l'emploi)

1. **audio-director** — Narration TTS (ElevenLabs V3) + musique (Minimax v2.6) + mix
2. **storyboarder** — Script + audio mesuré → `timing.ts` frame-précis
3. **visual-producer** — Assets multi-outils (Gemini, Seedance, Kling, Recraft, fal.ai, PixelLab)
4. **remotion-composer** — Composition Remotion + mini-render validation
5. **quality-reviewer** — Review multi-dimensions + verdict APPROVE/MINOR FIX/RE-EVALUATE

**Anciens agents archivés** : creative-director, pixel-art-director, pixellab-expert, kimi-reviewer, visual-qa (remplacés par visual-producer + quality-reviewer en avril 2026).

Définitions dans `.claude/agents/` (les `.md` qui décrivent rôle/outils/règles de chaque agent).

---

## Pipeline Stages 5-agents (workflow complet)

```
Stage 0  Claude + Aziz       → Script locked
Stage 1  audio-director      → Narration + musique + mix (scan TTS bloquant)
Stage 2  storyboarder        → timing.ts frame-précis (audio mesuré)
Stage 3  visual-producer     → Visual Plan proposal → Aziz approuve
Stage 4  visual-producer     → Assets générés (preview-before-pay)
Stage 5  remotion-composer   → Composition + mini-render 3-4s bloquant
Stage 6  quality-reviewer    → Review multi-dim + Kimi + verdict
Stage 7  Aziz                → Validation finale (oreille + œil + décision créative)
Stage 8  Claude (main)       → Render final OU fix iteration
```

**Règles du pipeline (quand on l'invoque)** :
- Stage 1 prerequis : script LOCKED par Aziz
- Stage 2 prerequis : audio existe ET mesuré (ffprobe ou forced alignment)
- Stage 3 prerequis : Aziz approuve Visual Plan AVANT toute génération
- Stage 4 règle : preview-before-pay pour CHAQUE appel API payant
- Stage 5 prerequis : mini-render validation AVANT de coder d'autres scènes
- Stage 6 règle : self-review AVANT Kimi, jamais l'inverse

Format de handoff entre agents : voir `.claude/agent-memory/shared/TODOWRITE-PATTERN.md`.

---

## État actuel des projets (MAJ 2026-07-05)

### ✅ Livré (retiré de Actif — contredisait l'entrée 2026-06-08 "6 beats FINAL")

- **Peste 1347 (Atlas)** — VALIDÉ AZIZ (2026-07-01), `out/PRET-PUBLICATION/peste-1347-FINAL.mp4`. NEXT =
  programmer publication (pas une tâche technique). Voir `memory/NEXT-ACTION.md` § Peste 1347 pour le détail.

### ⚡ Actif

- **Soudan Mid-form** — Inserts tactiques R&D TERMINÉE (2026-07-05, décision Gemini/SVG tranchée, assets
  rapatriés). NEXT = assemblage séquence Remotion beat #5. Démarrage : `memory/PROMPT-REPRISE-soudan-assemblage.md`.
- **Maroc Batteries Short 90s** — PRÉ-PROD COMPLÈTE (2026-05-30).
  Script v3 LOCKED (jury 8/10). Audio retenu : `public/souverain/maroc-batteries/audio/narration-maroc-v3.mp3` (109s).
  URL catbox : https://files.catbox.moe/jyrlj1.mp3. Format visuel : Template B Hybride.
  État complet + checklist production : `memory/episodes/souverain/maroc-batteries-kenitra/PREPRODUCTION-SHORT.md`.
  NEXT : storyboard visuel → forced alignment → beats Remotion.
- **Maroc Batteries Mid-form 4-5 min** — BACKLOG, après Short.
  Pré-prod : `memory/STARTER-PROMPT-maroc-batteries-midform.md`.

### 💤 En pause / dormants

- **Hannibal (Atlas)** — Beat 1 livré, Beat 2 Phase C non codée. Dossier mémoire
  préservé : `memory/episodes/hannibal/`. Code dans `src/_archive/episodes-livres/atlas/hannibal/`.
- **Vraie Taille Afrique (Souverain Short)** — FINAL livré, conservé en archive pour réf.
- **Xenophobie SA (Souverain)** — gelé, à reprendre 2-3 mois (memory/episodes/souverain/xenophobie-sa-EXPLORATION/).
- **Mali blocus carburant (Souverain)** — en pause, reprendre juin 2026+.
- **Congo Taille (Souverain)** — fact-sheet seul, inactif.

### ✅ Livrés (PRET-PUBLICATION)

9 vidéos dans `out/PRET-PUBLICATION/` :
niger-uranium, silicon-savannah, or-africain, sonjata-v7, thiaroye-v5,
mansa-moussa-atlas-v2, empire-ghana-v2, vraie-taille-afrique,
senegal-petrole-gaz (V3, terminé 2026-07-05, commits `207d223`+`606aff4` sur `fix/senegal-v3-passe-finition`).

Mémoires épisodes archivées dans `memory/archive/episodes-livres/`.
Code épisodes archivé dans `src/_archive/episodes-livres/`.

---

## Patterns validés cross-projet (références durables)

- **Hook Short (pattern teaser 5s)** — voir `memory/templates/` et BrutalHookSplit dans `src/projects/_shared/components/layouts/`.
- **Musique Minimax 2.6** — `memory/tools/minimax.md`. Coût ~$0.30/track 3min.
- **Narration ElevenLabs V3** — voix GéoAfrique V2 `z3gESu49naEZW8Af2Upm`. Règles TTS françaises NON-NÉGOCIABLES (voir `memory/voices-v3.md` + CLAUDE.md projet).
- **Integration Remotion audio** — `<Audio src={staticFile(...)} />` + `AUDIO_SEGMENTS` audio-derived timing.
- **Atlas Blueprints Library (8 patterns)** — `src/projects/atlas/_blueprints/` (walk-to-destination, confrontation, orbital-city, zoom-revelation, shake-impact, alliance, empire-expansion, flashback).
- **Beat Souverain workflow** — voir `scripts/beat-session.py` + `memory/rules-beat-production.md`.

---

## HANDOFF LOG (sessions actives)

> Format : `## Stage N — Agent — Projet — Date [COMPLETE / IN PROGRESS / BLOCKED]`
>
> Quand un agent termine son stage, il ajoute son entrée ici.
> Claude main propose le stage suivant à Aziz quand un handoff `COMPLETE` apparaît.
>
> Les handoffs des sessions terminées (Sonjata, Thiaroye, Abou Bakari, Or Africain,
> Silicon Savannah, Niger Uranium, Zimbabwe Lithium, RDC No Sense, etc.) sont
> dans le snapshot archivé : `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`.

## Maroc Batteries — BLOC CARTE (Mapbox) TERMINÉ — 2026-06-03 [COMPLETE]

**Session : fill-pattern lib + Beat 3 from scratch + corrections Beat 0/1. Bloc carte bouclé.**

3 beats Mapbox FINAL (les corrections SFX + vrais drapeaux appliquées) :
- Beat 0 Hook ✅ https://files.catbox.moe/otcfyz.mp4 — SweepRevealTerritory (SFX recalibrés, swoosh-zoom retiré car carte fixe)
- Beat 1 Phosphate ✅ https://files.catbox.moe/r30wee.mp4 — vrais drapeaux clip SVG (useClipFlags), SFX Sequence
- Beat 3 Acteurs ✅ https://files.catbox.moe/ivv7d8.mp4 — pull back planétaire vue monde + 3 drapeaux statiques synchro voix + lignes connexion + GeoCountryPlaque

**Créé cette session (tout référencé dans les 3 catalogues Mapbox) :**
- 11 templates fill-pattern N1-N4 + `flagCanvas.ts` (45 drapeaux + `countryFilter`) + `resourceTextures.ts` (6 textures).
- **`useClipFlags.tsx`** ⭐⭐ — vrais drapeaux HD clippés SVG, net à toute échelle (`mainlandBox` pour outre-mer). LA technique drapeau.
- **`GeoCountryPlaque.tsx`** (+ counter + climax) — plaque nom+stat+SOURCE (pattern Or Africain généralisé).
- `camCountryApproach` (pitch 32 relief) dans MapboxBase. Drapeaux HD Wikimedia dans `public/_shared/flags/`.

**3 leçons critiques sauvegardées** (`memory/feedback_sfx-sequence-et-drapeaux-reels.md`) :
1. SFX : `<Sequence from durationInFrames>` OBLIGATOIRE, jamais `{frame===X}` (ne joue pas en render). ⚠️ Beat0/1 avaient le bug → corrigé.
2. Drapeaux : vraies images Wikimedia, JAMAIS `drawFlagCanvas` (dessins approximatifs) pour drapeau visible.
3. Bbox outre-mer (France=Guyane+Réunion) casse le clip → `mainlandBox`.

**NEXT : BLOC REMOTION** (Beat 2 Cailloux assets Gemini à valider, Beat 4, Beat 5) puis assemblage. Philo 2-blocs : `feedback_philosophie-mapbox-puis-remotion.md`.

## Maroc Batteries — Chaîne production Mapbox premium — 2026-06-01 [SYSTÈME CRÉÉ, BEAT 1 À REFAIRE — OBSOLÈTE, voir entrée 06-03]

**Session structurante — on a bâti toute la chaîne de production Mapbox premium, pas juste un beat.**

Créé cette session :
- `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md` — doctrine cartographique premium (Gemini 3.1 Pro, 6 réfs + 4 nos vidéos). 5 principes + anti-clonage + template storyboard 7 champs.
- `scripts/mapbox-session.py` — système beat Mapbox scoré (miroir de beat-session.py pour Remotion).
- `scripts/tools/gemini-mapbox-review.py` — review vidéo Mapbox → JSON scoré (seuil 8/10).
- `scripts/tools/gemini-visual-playbook.py` — génère le Playbook (2 appels Gemini).
- Routage CLAUDE.md : 2 lignes distinctes beat Mapbox vs Remotion + 2 blocs Pipeline.

Beat 1 Maroc (A2 Phosphate) : codé en v4, Gemini 4→6.5/10. CAS-TEST. **À REFAIRE** proprement avec storyboard Playbook validé en amont (drift continu + anti-gris + séquentiel dès la conception).

Brouillons `beats/*.tsx` supprimés (sauf Beat0Hook référence). Beat0 Hook reste FINAL.

**FAIT cette session (suite) :**
- Chantier A ✅ : pré-prod réordonnée — `souverain-preproduction` SKILL : nouvelle Étape 3.5 "Pensée visuelle Mapbox (Playbook)" entre jury et audio (pour informer cues audio + ajuster script). Règle EFFET VIVANT + règle INVOCATION UNIVERSELLE gravées dans CLAUDE.md.
- Règle ALTITUDE PAR DÉFAUT ajoutée au Playbook (P2bis) : rester en hauteur, frontières lisibles ; gros zoom sol = exception. Erreur Beat 1 = avoir commencé au sol.
- Chantier B ✅ : gap analysis templates (`scripts/tools/gemini-template-gap.py` → /tmp/template-gap.json). Axe = EFFET VIVANT (couleur/frontières/projection/Lottie), pas 3D.
  - SOUS-UTILISÉS à réactiver : CountryFlagFill, CountryIsolateWithHatch (déjà dans Root 16:9), Lottie off-screen, FlowArrowsMap.
  - À CRÉER (priorité HAUTE) : BichromyPolygonProjector (projection image bichromie), SequentialBorderPulse (frontières synchro syllabe). MOYENNE : LottieGeoAura, GlassmorphismGeoPopup. Tous hybrides V+H.

**NEXT — Chantier C (prochaine session, lot de 2 testés à fond V+H) :**
1. Réactiver/tester CountryFlagFill (192 l, PAS dans Root) + CountryIsolateWithHatch (433 l, dans Root 16:9). Les rendre hybrides V+H, render preview vertical + horizontal, valider Aziz.
2. SEULEMENT si gap reste après réactivation : créer BichromyPolygonProjector + SequentialBorderPulse.
3. PUIS refaire Beat 1 Maroc A2 avec système complet (storyboard Playbook + altitude par défaut + 1 template effet vivant obligatoire). Puis A3-A6.
Décision Aziz : commencer par RÉACTIVER l'existant (moins cher) avant de créer. Lot de 2 max, qualité > quantité.

## Beat 0 — Hook — Maroc Batteries — 2026-06-02 [COMPLETE]

- Fichier : src/projects/souverain/maroc-batteries/beats/Beat0Hook.tsx
- Render FINAL : out/episodes/maroc-batteries/beat0-FINAL.mp4
- Catbox : https://files.catbox.moe/jx3e4s.mp4
- Templates utilisés : SweepRevealTerritory (showHatching=true)
- Forced alignment : MAROC_WORDS (maroc-words.ts) — tous les mots
- Validé par Aziz : oui

## Beat 1 — Phosphate — Maroc Batteries — 2026-06-02 [COMPLETE]

- Fichier : src/projects/souverain/maroc-batteries/beats/Beat1Phosphate.tsx
- Render FINAL : out/episodes/maroc-batteries/beat1-FINAL.mp4
- Catbox : https://files.catbox.moe/n9jxx7.mp4
- Templates utilisés : FlagFill Multi-Pays (drapeaux MAR/ESP/FRA/DEU projetés) + slam SVG 70% + arcs export + dots CSS
- Review Gemini : 8 vidéos (6 refs + 2 nos beats) analysées → corrections appliquées
- Validé par Aziz : oui (template B "tous drapeaux")

## ⭐ DÉCOUVERTE FlagFill — 2026-06-02 [TEMPLATES PHASE 1 CARTE VIVANTE]

2 templates FlagFill créés — la solution N°1 pour colorer une carte Mapbox (règle pour TOUTE scène future) :
- Template A (Focus-Un-Pays) : `out/templates-souverain/FINAL-FlagFill-FocusUn-V.mp4` — 1 drapeau principal + couleurs unies secondaires
- Template B (Multi-Pays) : `out/templates-souverain/FINAL-FlagFill-MultiPays-V.mp4` — tous les pays avec drapeau projeté
- Doc : `memory/feedback_flagfill-templates-decouverte.md`
- Drapeaux locaux : `public/_shared/flags/` (es/fr/de.png + Maroc canvas pur)

## NEXT — Maroc Batteries

1. ⚠️ SESSION FILL-PATTERN d'abord (bibliothèque drapeaux/textures + helpers réutilisables)
2. Beat 2 Cailloux (f932→f1300, pur Remotion) — assets Gemini à valider avant

## RÈGLE FORMALISÉE — Recherche templates avant code

Ajoutée à CLAUDE.md + `memory/feedback_recherche-templates-obligatoire.md` : Claude DOIT scanner les catalogues AVANT de coder. Évite les itérations (leçon : 18 versions Beat 1 car FlagFill pas cherché au départ).

## Chantier C — Templates Mapbox hybrides V+H — 2026-06-02 [LOT COMPLET, EN ATTENTE VALIDATION AZIZ]

Lot de templates Mapbox premium (vraie carte vivante, hybrides V+H, render headless via render-mapbox.sh).
Tous dans `src/projects/_shared/mapbox/`. Compositions enregistrées dans Root.tsx.

**Créés cette session :**
1. `MapboxFlagFill.tsx` ✅ VALIDÉ — drapeau (ou toute image) clippé en SVG dans la silhouette d'un pays, sur carte vivante (drift, altitude, voisins ivory). Technique = clip SVG + reprojection map.project() frame-driven (PAS fill-pattern qui carrelle). Prop `geoName` accepte tableau → fusionne géométries (ex: ["Morocco","W. Sahara"] remplit le Maroc entier). `bichromie` 0→1.
2. `MapboxIsolateZone.tsx` ✅ VALIDÉ — isolation pays (spotlight) + zone offshore hachurée (fill-pattern cyan) + badge pin geo + bloc stat. Zone Sangomar agrandie/contrastée.
3. `SequentialBorderPulse.tsx` ✅ — frontières qui s'allument en séquence (synchro syllabe via prop `at`), flash+glow, reste allumé, drift adaptatif V/H.
4. `GlassmorphismGeoPopup.tsx` ✅ VALIDÉ Aziz ("excellent") — encarts navy translucide + bordure or reliés par ligne fine au point geo (SVG projeté). NOTE: backdrop-filter blur NE rend PAS en headless → fond translucide solide (acceptable).
5. `SequentialFlagReveal.tsx` ✅ (V2 demandée Aziz) — pays s'allument EN SÉQUENCE avec LEUR DRAPEAU clippé dans la silhouette, reste allumé (technique chaînes). Combine FlagFill + BorderPulse. Prop `countries[]` réutilisable (CEDEAO, Sahel...).
6. `LottieGeoAura.tsx` + `src/projects/_shared/lottie/premiumLottieAssets.ts` — 3 assets Lottie premium navy/gold générés par code (shockwaveDiscovery, networkFlow, orbitalDataCrown) ancrés à un point geo. Lottie off-screen → goToAndStop frame-driven → overlay. À JUGER EN VIDÉO (Lottie temporel). Verdict perso : shockwave excellent, orbital crown bon, networkFlow correct après fix phase.

**Plan Gemini (4 templates manquants) — état :** BichromyPolygonProjector = couvert par MapboxFlagFill (projette toute image). SequentialBorderPulse ✅. GlassmorphismGeoPopup ✅. LottieGeoAura ✅ (+ vrai gap = assets premium, générés).

**Previews catbox (dernière version) :**
- FlagFill Maroc : V https://files.catbox.moe/80ti00.mp4 · H https://files.catbox.moe/xay797.mp4
- IsolateZone Sénégal : V https://files.catbox.moe/nv5azm.mp4 · H https://files.catbox.moe/npq08b.mp4
- BorderPulse Maghreb : V https://files.catbox.moe/3lcys8.mp4 · H https://files.catbox.moe/flk7c8.mp4
- GlassPopup Sénégal : V https://files.catbox.moe/p6f31u.mp4 · H https://files.catbox.moe/04tkmg.mp4
- FlagReveal Maghreb : V https://files.catbox.moe/i7bq1e.mp4 · H https://files.catbox.moe/tyat4h.mp4
- LottieGeoAura : V https://files.catbox.moe/kqybi6.mp4 · H https://files.catbox.moe/jxkicc.mp4

**Chantier C v2 — 3 templates DYNAMIQUES (idees Gemini, axe Aziz : dynamisme+couleur) — 2026-06-02 :**
Consultation Gemini 3.1 Pro (6 frames validees jointes) → 6 idees (sauvegardees `memory/tools/gemini-template-ideas-v2-2026-06-02.json`). Aziz a retenu les 3 "haute" :
7. `SweepRevealTerritory.tsx` ✅ — faisceau lumineux gold qui TRAVERSE un pays et revele sa couleur au passage (scanner/lever de soleil). Gradient SVG anime clippe dans la silhouette reprojetee. Direction adaptative V(vertical)/H(horizontal). V https://files.catbox.moe/g1bvis.mp4 · H https://files.catbox.moe/m96rpq.mp4
8. `DominoContagionFill.tsx` ✅ — la couleur CONTAMINE les pays de proche en proche par VAGUES (prop waves[][]) depuis un epicentre, onde concentrique. Raconte une expansion d'influence sans fleches. V https://files.catbox.moe/3f2shf.mp4 · H https://files.catbox.moe/spjlqt.mp4
9. `FiberOpticBorderDraw.tsx` ✅ — la frontiere se DESSINE comme un laser dore (stroke-dasharray anime + glow feGaussianBlur), puis fill interieur monte. Salle de controle. V https://files.catbox.moe/be2pd0.mp4 · H https://files.catbox.moe/7k3zf6.mp4

**Idees Gemini NON encore codees (backlog, si besoin) :** TensionHeatZone (heatmap chauffe), HexGridAnalysis (grille hexa egaliseur), GeoRippleExpansion (ondes epousant le littoral). + tes 3 fondamentaux : Choropleth, Texture ressource, Flux inter-pays.

**Chantier HOOK — templates d'ouverture (2026-06-02) :** Aziz souvent insatisfait des débuts de vidéo → templates spécialisés 5-30s, rapides, punch frame 0 (assumé "TikTok" dans le rythme, charte navy/gold). Contrainte Mapbox : caméra fluide (drift OK), PAS de mouvement épileptique ; énergie en overlay.
Consultation Gemini hooks (10 frames + GeoLayers 3) → 5 idées (`memory/tools/gemini-hook-ideas-2026-06-02.json`). Codés :
- `FiberOpticFlagInvade.tsx` ⭐ — frontière se trace PUIS drapeau envahit, séquentiel (= V2 demandée Aziz). V https://files.catbox.moe/6jtjc7.mp4 H https://files.catbox.moe/v0ot0h.mp4
- `KineticMaskSlam.tsx` ⭐ — chiffre géant, carte DANS le texte, zoom dans le "0". V https://files.catbox.moe/9hu9oe.mp4 H https://files.catbox.moe/6zivbg.mp4
- `RapidFireCountries.tsx` — rafale de pays (cut sec) puis freeze. V https://files.catbox.moe/a09vsm.mp4 H https://files.catbox.moe/yamy5v.mp4
- `ClassifiedRedactReveal.tsx` ⭐ — TOP SECRET + censure qui glisse + target lock. V https://files.catbox.moe/z95wbs.mp4 H https://files.catbox.moe/noljgi.mp4
Hooks backlog : TacticalRadarScan, EpicenterShockwave, SatelliteTargetLock, GlitchMapIntro.

**Chantier INSERTS + COMBOS (2026-06-02, suite) :** Aziz a reclassé RapidFire+ClassifiedRedact en INSERTS (pas hooks) et identifié 2 patterns puissants : (a) le CUTAWAY générique, (b) la COMBINAISON de primitives.
- `MapCutaway.tsx` ⭐⭐ — INSERT réutilisable : carte → overlay plein écran → retour carte + target lock. 4 modes : image/stat/reveal/flag. Textes en TYPEWRITER. LE template le plus réutilisable (chaque vidéo). Previews : Stat https://files.catbox.moe/pbjdzd.mp4 Image https://files.catbox.moe/88s176.mp4 Flag https://files.catbox.moe/rg4j0i.mp4 Reveal https://files.catbox.moe/5ech8j.mp4
- `components/TypewriterText.tsx` — texte lettre-par-lettre réutilisable (curseur gold), extrait de TypeWriter.tsx.
- 3 COMBOS (hooks par assemblage) : `ComboMaskSweep` (choc→révélation→focus) https://files.catbox.moe/h75bhk.mp4 · `ComboSweepDominoFlag` (déclencheur→propagation→drapeaux) https://files.catbox.moe/httrq8.mp4 · `ComboFiberAuraPopup` (où→quoi→combien) https://files.catbox.moe/4byelm.mp4

**INVENTAIRE TOTAL templates Mapbox (17 créés cette session)** : 6 statiques/séquentiels (FlagFill, IsolateZone, BorderPulse, GlassPopup, FlagReveal, LottieGeoAura) + 3 dynamiques (Sweep, Domino, FiberOptic) + 2 hooks (FiberOpticFlagInvade, KineticMaskSlam) + 2 inserts (RapidFire, ClassifiedRedact) + 1 cutaway générique (MapCutaway) + 3 combos (MaskSweep, SweepDominoFlag, FiberAuraPopup). + TypewriterText réutilisable. Tous référencés COMPOSANTS-INDEX + MAPBOX-COMPOSANTS + ASSETS-INDEX. Lottie assets : `lottie/premiumLottieAssets.ts`. Idées Gemini backlog : `memory/tools/gemini-template-ideas-v2-2026-06-02.json` + `gemini-hook-ideas-2026-06-02.json`.

**NEXT après validation Aziz :** refaire Beat 1 Maroc A2 avec cet arsenal (gap P4 + hooks couverts) + storyboard Playbook. Renders dev dans `out/templates-souverain/_dev/`.

## Carrousel "Good News" #1 — 2026-06-02 [PUBLIÉ]

Nouveau 3e type de carrousel (bonnes nouvelles macro Afrique, indépendant d'une vidéo).
Charte LUMINEUSE (ivoire/or/navy), 100% Remotion animé. Briques réutilisables : `gauge`, `flow` (icônes Lucide), `bars`, `map` (Mapbox Caspian beige).
Carrousel #1 (Maroc/Kenya/Algérie) programmé 3 juin sur IG+FB (carrousel) + TikTok (vidéo unique).
Pipeline + briques consolidés : `src/projects/souverain/carousels/good-news/README.md`. Décisions : `memory/STARTER-PROMPT-carrousel-good-news.md`.
NEXT possible : script d'automatisation hebdo (last30days → briques → Postiz), semi-auto avec validation humaine.
Fix collatéral : `scripts/render-mapbox.sh` (chemin chrome-headless-shell) + stubs beats Maroc Batteries manquants (dette repo).

## Sénégal Pétrole & Gaz — Acte 3 S2 (Beat11) — 2026-05-23 [COMPLETE]

**Beat11 VALIDÉ** (`out/episodes/senegal-petrole-gaz/beat11-FINAL.mp4`, 44.9s, 5.4MB)
- Architecture : fond kraft + D3 StackedBars SVG, 4 phases (doc classifié → barre gold → Cost Recovery → 3 segments → révélation)
- Tailwind migré : tokens `font-mono`, `flex`, `tracking-widest`, etc. Labels sur fonds colorés opaques (rouge/brun/or) pour lisibilité kraft
- Audio : `narration-v1-clean.mp3` `startFrom={5755}` (skip "mécanisme 1,", démarre sur "le contrat.")
- Chiffres vivants + sweep lumineux + ghost trailing 60%
- Imgur final : https://i.imgur.com/6RGSGND.mp4
- **NEXT** : Beat12 (S3 — Mécanisme 2 : FONSIS + dette) ou Beat13 (S4 — Mécanisme 3 : Yakaar/géopolitique)

## Sénégal Pétrole & Gaz — Acte 3 S1 (Beat10) — 2026-05-23 [COMPLETE]

**Beat10 VALIDÉ** (`out/episodes/senegal-petrole-gaz/beat10-FINAL.mp4`, 61s, 67MB)
- Architecture : 1 seule Map Mapbox continue, 6 phases (Norvège → Congo → Botswana → Crane Up)
- Coloration pays : NOR=gold, COG=orange, BWA=vert — persistent sur vue finale
- Audio : `narration-v1-congo-brazzaville.mp3` (splice "Le Congo" → "Le Congo-Brazzaville"), `endAt={5718}` pour couper avant "Mécanisme 1"
- Catbox final : https://files.catbox.moe/yx177g.mp4
- **Leçons R11 ajoutées** dans `memory/rules-beat-production.md` (splice audio, endAt, public-dir minimal, renders parallèles)
- **NEXT** : Beat11 (Mécanisme 1) + suite Acte 3

## Sénégal Pétrole & Gaz — ÉPISODE COMPLET — 2026-05-25 [TOUS BEATS VALIDÉS — ASSEMBLAGE RESTANT]

**Tous les beats produits et validés :**
- Beat0  → `out/episodes/senegal-petrole-gaz/beat0-FINAL.mp4` (36.5s) ← VALIDÉ 2026-05-25
- Acte 1 → `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4` (42.3s)
- Acte 2 → `out/episodes/senegal-petrole-gaz/acte2-FINAL.mp4` (88.3s)
- Beat10 → `out/episodes/senegal-petrole-gaz/beat10-FINAL.mp4` (61s)
- Beat11 → `out/episodes/senegal-petrole-gaz/beat11-FINAL.mp4` (44.9s)
- Beat12 → `out/episodes/senegal-petrole-gaz/beat12-FINAL.mp4`
- Beat13 → `out/episodes/senegal-petrole-gaz/beat13-FINAL.mp4`

**Prochaine session — 2 tâches restantes (dans cet ordre) :**
1. **SFX** — effets sonores frame-précis sur mouvements caméra Mapbox, pop plates, slashes, reveals. Backlog existant dans `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md`
2. **Assemblage final** — concaténation ffmpeg de tous les beats dans l'ordre (Beat0 → Acte1 → Acte2 → Beat10 → Beat11 → Beat12 → Beat13) → `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4`

## Sénégal Pétrole & Gaz — Acte 2 — 2026-05-23 [COMPLETE]

**Acte 1 VALIDÉ** (Beat1+2+3+5, 42.3s, `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4`)

**Acte 2 VALIDÉ 2026-05-23** (`out/episodes/senegal-petrole-gaz/acte2-FINAL.mp4`, 88.3s, 48.9 MB)
- `SenegalActe2Continu.tsx` (2134f) — une seule Map Mapbox, 5 phases : Sangomar / Trans Pull Back / GTA / Trans Whip / Yakaar
- `Beat9.tsx v5` (516f) — donut SVG animé 9s, fond bleu nuit clair, split gauche/droite
- Composition assemblée : `SenegalActe2Full.tsx` (id `Senegal-Acte2-Full`)
- Audio : voix-off offset 43.30s + musique A 18% fade-out 4s
- Catbox final : https://files.catbox.moe/ck11k7.mp4
- **Backlog SFX** consigné dans `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md` — à intégrer avant assemblage 4 actes final
- **NEXT** : Acte 3 (à produire)

---

## CIRCUIT BREAKER RE-OPEN: AtlasCannesScene — rendu 2-echelles, direction confirmee (2026-06-03)

Pas une boucle aveugle. Phases A (carte regionale Italie + marqueur Cannae) et B (terrain
tactique + encerclement) deja rendues et lisibles. 2 ajustements ciblES restants, valeurs
calculees numeriquement (d3-geo), pas tatonnees :
1. scale tactique 190000→150000 + wingMid lat 41.45/41.19→41.41/41.23 (arcs debordaient).
2. titleOpacity s'efface au zoom f95-120 (titre se superposait a l'aile haute).
Apres : render video complet + upload + presentation Aziz.

## War-Map Sahel P3 "La Rupture" — v8 FINALE — 2026-06-13 [COMPLETE — attend validation Aziz]
P3 codée de bout en bout (8 itérations + DA upstream 3 voix + review premium Gemini/Kimi + passe premium).
Compo SahelPartie3 (f6118→9410). Render : out/episodes/warmap-sahel/wip/p3-FULL_v8.mp4 (catbox 93yw8p, scale 0.5).
Brique créée : src/projects/warmap/_shared/WarMapOverlayDynamic.tsx (overlay dynamique réutilisable).
Doctrine : memory/doctrines/REVIEW-PREMIUM-TEMPLATE.md (standard review premium) + WARMAP-LONG (règle overlay).
Assets Gemini : ville-kidal, jeton-africacorps. Flags canvas : ml/bf/ne.
NEXT : (1) full HD si validé ; (2) session dédiée "fond qui respire" (transversal) ; (3) P4.
Détail état : memory/episodes/warmap-sahel/STATUS.md.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source — POINT DE CONTROLE (style encre a valider Aziz)
Passe 1 d3-geo encre rendue full HD. Geo EXACTE (countries-50m, CIV+GHA + region Afrique Ouest).
Choregraphie OK : region se dessine -> brun cacao -> focus CI -> focus Ghana -> paire (labels deportes).
Mp4: https://files.catbox.moe/bqer2s.mp4 · Frame paire: https://files.catbox.moe/peu7il.png
EN ATTENTE arbitrage style encre AVANT finition timing audio-derived + colorisation. NE PAS chainer.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source V2 — COMPLETE (refonte structure post-validation style)
Split-screen 2 volets : CI (gauche) + Ghana (droite), geo d3-geo EXACTE (countries-50m). CI se trace puis Ghana.
Couleurs DRAPEAU en remplissage clippe sur silhouette (bandes verticales CI ; horizontales+etoile Ghana), bbox-equilibrees.
Trace SYNCHRO au nom (Whisper : "Cote d'Ivoire" f241-262 -> trace finit f245 ; "Ghana" f274-283 -> finit f276).
Audio integre (cacao-beat2-FINAL.mp3 -> public/souverain/cacao-chocolat-short/audio/). tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/el492c.mp4 · Frame finale: https://files.catbox.moe/afwp7k.png

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source VERSION A peaufinee — COMPLETE (Phase 3)
2 ajustements appliques : (1) colorisation DECOUPLEE du nom -> couleurs montent des la fin de trace de chaque
pays (CI coloree ~f110, Ghana ~f190), vivent plusieurs secondes ; labels noms restent cales audio (f241/f274).
(2) etoile Ghana ECLOT comme une graine (spring scale + rotation douce qui se resorbe), plus de pop sec.
tsc clean. Render full HD + audio. Mp4: https://files.catbox.moe/i8a4ea.mp4 · Frame: https://files.catbox.moe/q07sjl.png

[STAGE-5] remotion-composer cacao-chocolat-short/B1HookVB+B2SourceVB VERSION B — COMPLETE (variante experimentale A/B)
Variante B (convergence Gemini+Kimi) : TRANSFUSION brune B1->B2 (fil conducteur vertical 9:16) + compromis couleur B2 (brun PUIS drapeau).
B1HookVB : tablette pleine brune (luxe) -> a "Sauf qu'en Suisse" (f90) le brun se vide/coule -> wireframe encre sterile + germination avortee decalee + flaque brune en attente bas (Y1720).
B2SourceVB : reprend flaque Y1720 -> monte remplir CI/Ghana de brun -> drapeaux eclosent par-dessus en fin (CI vertical, Ghana horizontal + etoile).
Acquis communs presents : croix suisse embossee+rouge, tablette ~50% largeur, trait epais, titre qui disparait, etoile Ghana qui eclot.
tsc clean sur les 2 fichiers. Renders full HD : B1 https://files.catbox.moe/kxx95a.mp4 · B2 https://files.catbox.moe/cdapaf.mp4
NEXT (Aziz) : comparer VERSION A vs VERSION B, trancher la DA. Risque note : amorce B2 (~0.8s) un peu vide avant trace pays.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source CANONIQUE — COMPROMIS COULEUR + AGRANDI (COMPLETE)
Porte le compromis VB dans le canonique (B2SourceVB laisse intact, reference) : chaque pays se trace ->
se remplit de BRUN CACAO #6b4423 (matiere, vit longtemps) -> DRAPEAU eclot par-dessus en fin de beat
(brun s'estompe sous le drapeau). PAS de transfusion/flaque (B2 demarre proprement). Etoile Ghana eclot.
Pays AGRANDIS ~45% (fitExtent HALF*0.05->0.95, H*0.16->0.6), bas garde pour labels+source ICCO.
Couleur anticipee (acquis) : ne depend pas du nom. tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/7txsqd.mp4 · Final: https://files.catbox.moe/smj321.png · Brun: https://files.catbox.moe/76yyaz.png

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source — KARAOKE word-level AJOUTE (B2 COMPLET)
Sous-titres karaoke TikTok (grammaire GGW) : mot actif s'allume en BRUN CHOCOLAT #6b4423 (pas vert GGW),
autres mots encre attenuee, fond parchemin semi-transparent, position tiers inferieur AU-DESSUS de la
micro-source ICCO (bottom 230 vs 130, pas de collision). Timing REEL via whisper-align.py (32 mots).
JSON livre : out/episodes/cacao-chocolat-short/audio/cacao-beat2-words.json (+ .ts genere). Accents FR OK.
Tout B2 garde (split, compromis brun->drapeau, agrandi, etoile, geo, ICCO). tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/0jbt2y.mp4 · Frame: https://files.catbox.moe/7l210h.png

[STAGE-5] remotion-composer cacao-chocolat-short/B1HookCuisine VARIANTE "CUISINE SUISSE" — COMPLETE (test parallele version A)
Idee Aziz : un LIEU pas un objet flottant. Cuisine/atelier suisse SUGGERE en TRAIT FIN encre #2b2117 (3-4 elements,
vide domine). Decor : plan de travail (2 lignes) + fenetre a droite avec silhouette CERVIN/neige en trait (le seul
"paysage suisse", confirme Suisse sans drapeau plaque) + moule a tablette. Couleur=evenement tenue : SEULE la tablette
se colorise brun cacao, tout le reste = trait. La tablette SE FABRIQUE (pas juste se-dessine) : chocolat COULE (matiere)
dans le moule -> niveau monte -> tablette prend forme (sillons se revelent) -> croix suisse embossee arrive (spring) ->
colorisation pleine vers "savoir-faire de luxe". Le MANQUE : cacaoyer rate dans un pot sous la fenetre, trace qui GELE
+ tige qui s'affaisse, sur fond de montagne suisse (= paradoxe "pas un seul cacaoyer"). Titre apparait puis disparait.
Calage whisper reel : f56 "vient de Suisse" (coulee) / f100 "en Suisse" / f137 "pas un seul cacaoyer" (echec) /
f256-277 "savoir-faire de luxe" (colorisation pleine). NE TOUCHE QUE B1HookCuisine.tsx (B1Hook=version A intacte).
tsc clean sur le fichier. Render full HD + audio OK (365f, 1080x1920, 872 kB) -> /scratchpad/B1HookCuisine-fullHD.mp4
VERDICT HONNETE : (1) le decor suggere TIENT le vide premium (epure, pas dessin d'enfant) — le moule disparait apres
prise (sinon contour residuel sale, corrige). (2) la tablette qui SE FABRIQUE lit MIEUX qu'une tablette qui se dessine
(geste = fil narratif "on fabrique le chocolat ICI"). (3) le paradoxe (cuisine/montagne suisse + cacaoyer qui rate)
FRAPPE une fois le cacaoyer agrandi+pot+affaissement (v1 illisible, corrige). Reserve : le moule a plat ressemble un
peu a un plateau/ecran avant remplissage ; la tige fletrie chevauche legerement le coin bas-droit de la fenetre (mineur).
NEXT (Aziz) : comparer au render version A (focus tablette) et trancher la DA.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source — micro-source FADE OUT (ajustement final)
Micro-source ICCO ne reste plus 9s : fade in f10-25 -> plein f25-90 -> fade out f90-110 -> 0.
Independante du karaoke (2 div distincts, opacites separees) — verifie f50 (source visible), f135/f255 (source
absente, karaoke OK). Reste de B2 inchange. tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/txxako.mp4 · Frame source visible: https://files.catbox.moe/afhttv.png

[STAGE-4] visual-producer pecheur-seedance-test — BLOCKED : compte fal.ai verrouille "Exhausted balance" (403 sur storage/auth/token). 2026-07-04. Les 2 appels Seedance (cast2, cast3, prompts+plan valides Aziz) n'ont pas pu etre soumis — echec a l'etape upload CDN, AVANT toute soumission generation. Cout facture = $0.00 pour les deux. Attend Aziz : recharger fal.ai/dashboard/billing puis relancer `python -u scripts/tools/seedance-pecheur-cast2.py` et `seedance-pecheur-cast3.py` (deja ecrits, prets, sortie /tmp/pecheur-seedance-cast{2,3}.mp4).

[STAGE-4] visual-producer pecheur-seedance-test — RESOLU + CLOS. 2026-07-04 (suite). Compte fal.ai recharge par
Aziz, les 2 appels cast2/cast3 relances avec succes (aucune erreur cette fois). 3 clips complets assembles dans
PecheurSurpecheSeedance16x9.tsx (RND-PecheurSurpecheSeedance16x9), clips dans public/_rnd/pecheur-seedance/
cast{1,2,3}.mp4. Render final valide visuellement par Aziz : https://files.catbox.moe/24fbuy.mp4.
DECISION AZIZ APRES COUP : technique fonctionne tres bien (style preserve, gestes precis, poisson qui atterrit
dans le panier, pieds ancres) MAIS coup trop eleve (~6.85$/clip 10s, ~20$/scene) pour l'usage actuel (phase de
test/iteration) — NE PAS adopter Seedance comme methode par defaut pour les personnages pour l'instant. Retour
a la piste SVG organique (registre GGW/cacao/cargo, deja maitrise, cout zero). Detail complet + methode
reutilisable si besoin futur : memory/NEXT-ACTION.md § SEEDANCE PERSONNAGE — TECHNIQUE PROUVEE MAIS ECARTEE.
