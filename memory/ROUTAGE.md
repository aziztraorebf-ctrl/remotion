# ROUTAGE — Quel fichier / quel skill pour quoi

> **Consulter ce fichier au DÉBUT de toute tâche de production** (avant d'écrire code ou prompt).
> C'est la table d'aiguillage extraite du CLAUDE.md pour alléger le démarrage. Pointeurs uniquement.
> Deux tables : (1) Routage OUTILS — quel fichier LIRE. (2) Routage PROCÉDÉS — quel skill LANCER.

---

## 1. Routage OUTILS — LIRE le fichier AVANT d'agir (NON-NEGOTIABLE)

Quand Aziz parle d'un sujet, **charger le fichier correspondant AVANT d'écrire du code ou un prompt**. Si la ligne mentionne aussi un skill, le consulter en complément (jamais à la place de la mémoire projet).

### Points d'entrée maîtres (lire EN PREMIER en cas de doute « où chercher ? »)

| Sujet | Fichier |
|---|---|
| **Doute sur quel catalogue ouvrir (tout domaine)** | `src/projects/_shared/INDEX-DES-INDEX.md` ⭐ carte de TOUS les catalogues |
| **Doute catalogue Atlas** | `src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md` ⭐ |
| **Doute catalogue / démarrer War-Map** | `src/projects/warmap/WARMAP-INDEX.md` ⭐ (LA réf = `SudanWarMapEpic60`) |
| **Assets / templates / refs (source unique)** | `public/_shared/ASSETS-INDEX.md` |

### Scripts & validation

| Sujet | Fichier |
|---|---|
| Écrire/valider TOUT script (couche orale universelle) | `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` ⭐ 16 règles (clarté/incarnation/rétention) |
| Script Short narratif (Héros Oubliés, conte, tragédie) | `memory/templates/script-ebauche-v1.md` |
| Script Atlas (géo, taille, richesse-record, comparaison) | `memory/templates/script-atlas-v1.md` |
| Hook 5s / cold open (narration) | `memory/templates/hook-short.md` |
| Sous-titres Shorts (TikTok/Karaoké), camera shake | `memory/templates/subtitles-shorts.md` |
| Formule César, 7 beats Shorts, dynamisation | `memory/tools/seedance-community.md` |

### Souverain

| Sujet | Fichier |
|---|---|
| **Doute « où chercher ? » Souverain — POINT D'ENTRÉE** | `src/projects/souverain/SOUVERAIN-INDEX.md` ⭐ carte maître du pilier |
| Démarrer/coder un Short Souverain Mapbox (point d'entrée) | `memory/doctrines/SOUVERAIN-SHORT-DEMARRAGE.md` ⭐ 7 étapes → puis `SOUVERAIN-SHORT-SKELETON.md` |
| Doctrine Souverain (durable) | `memory/doctrines/DOCTRINE-SOUVERAIN.md` (LIRE en entier avant tout code Souverain) |
| Règles éditoriales Souverain (sources, couleurs, script Type B) | `memory/rules-souverain-editorial.md` |
| Tailwind (tokens gold/navy/ivory) — TOUT composant Souverain | `memory/feedbacks/feedback_tailwind-remotion-setup.md` · Framer Motion INTERDIT · lire `tailwind.config.ts` |
| SplitScreen 50/50, entité vs entité | `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx` |
| Data-viz Souverain (StackedBars, ProcessFlow, comparaisons $) | `memory/doctrines/DOCTRINE-SOUVERAIN.md` §9 + `PrototypeD3StackedBars.tsx` (D3 utility-only) |
| Breakdown Gemini 3.1-pro (prompt + schema JSON) | `memory/tools/workflow-gemini-breakdown-schema.md` (coller bloc « stack technique ») |

### Atlas

| Sujet | Fichier |
|---|---|
| Coder une scène/beat Atlas (doctrine visuelle, AVANT code) | `memory/doctrines/ATLAS-PLAYBOOK.md` ⭐ → puis `ATLAS-BEAT-DEMARRAGE.md` (scan phase 0) |
| Produire un épisode Atlas (audio + d3-geo + render) | `memory/templates/atlas-template-v1.md` (skill `remotion-best-practices/rules/maps.md`) |
| « Quel composant Atlas pour X ? » | `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` · doc : `ATLAS-COMPOSANTS.md` |
| Asset Atlas (sprite, map-object, geo) AVANT générer | `src/projects/atlas/_shared/ATLAS-ASSETS-INDEX.md` (19 persos / 568 sprites) |
| Personnage/sprite PixelLab dans un beat Atlas | `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` ⭐ · code `AtlasPixelChar.tsx` |
| Règles production Atlas (non-négociable, checklist) | `memory/rules-atlas-production.md` |
| Format « concept expliqué comme un jeu vidéo » | `memory/doctrines/ATLAS-FORMAT-VIDEO-GAME.md` (concepts oui, drames non) |

### War-Map

| Sujet | Fichier |
|---|---|
| Coder scène/beat War-Map (changement territoire) AVANT CODE | `memory/doctrines/WARMAP-GRAMMAIRE.md` ⭐⭐ CAUSE avant EFFET + 5 techniques causales |
| War-Map Long (5-7min, 16:9, analytique géopo) | `memory/doctrines/WARMAP-LONG-DOCTRINE.md` ⭐ |
| Doctrine design War-Map | `memory/doctrines/WARMAP-PLAYBOOK.md` |
| Doctrine données War-Map (recherche OSINT) | `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md` |
| « Quelle brique War-Map pour X ? » | `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` (+ LINKING mapanimation) |

### Composants & templates — SCAN OBLIGATOIRE AVANT TOUT CODE

> ⛔ **RÈGLE (NON-NEGOTIABLE, même hors `/beat` ou `mapbox-session.py`)** : avant d'écrire une ligne de code
> pour un beat/scène, SCANNER les catalogues du besoin et présenter à Aziz les templates pertinents + ≥2
> combinaisons. Le gate scriptée n'existe QUE dans les sessions beat — en session libre, c'est ma discipline
> qui l'applique. Aziz ne mémorise pas les composants, moi oui. Jamais coder un effet custom sans vérifier l'existant.

**Les 6 catalogues de templates (par besoin) :**

| Besoin | Catalogue |
|---|---|
| Composant Remotion général (stat, comparaison, timeline, hook, portrait, HERO DATA) | `src/projects/_shared/COMPOSANTS-INDEX.md` (71, par cas d'usage) |
| Template carte Mapbox (hook/corps/insert, drapeau/couleur sur territoire) | `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` (28 + helpers) |
| Template data-viz pour Gemini (BarRace, StackedBars, PulseNumber) | `memory/tools/CATALOGUE-GEMINI.md` (40+) |
| Composant Atlas | `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` |
| Brique War-Map | `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` |
| Hook d'ouverture animé (carte) « on a besoin d'un hook » | `src/projects/_shared/hooks-lib/HOOKS-LIBRARY-CATALOGUE.md` ⭐ (caméra serrée, pas continent figé) |
| Animations presets (fadeIn, popIn, countUp, drawPath) | `src/projects/_shared/animations.ts` (10 presets) |
| Icônes | `lucide-react` installé — `import { Icon } from "lucide-react"` (~1500 icônes) |

### Mapbox (carte)

| Sujet | Fichier / skill |
|---|---|
| Template carte vivante (hook/corps/insert carto) | `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` ⭐ source unique · render `scripts/render-mapbox.sh` |
| Geocoding, coordonnées, distances, GeoJSON | `memory/tools/mapbox-mcp.md` (MCP d'abord, REST si MCP défaillant 2-3 essais) |
| Style.json, design carte, typo, Parchemin Mande | `memory/tools/mapbox-mcp.md` + skills `mapbox-cartography`, `mapbox-style-quality` |
| Intégration React/Remotion, lifecycle, perf headless | skills `mapbox-web-integration-patterns`, `mapbox-web-performance-patterns` |
| Data-viz carto (choropleth, heat map, overlays) | skills `mapbox-data-visualization-patterns`, `mapbox-style-patterns` |

### Outils visuels / audio (refs API)

| Sujet | Fichier |
|---|---|
| Mouvement caméra Atlas/Remotion (code, zero-cost) | `memory/tools/atlas-camera-movements.md` (16 mvts) |
| Mouvement caméra clip AI (orbit, dolly, crane, OTS) | `memory/tools/camera-movements.md` |
| Seedance, Dreamina, prompt vidéo, clip | `memory/tools/seedance-prompts.md` + `seedance-rules.md` |
| Seedance storyboard multi-cut (<15s) | `memory/tools/seedance-storyboard-technique.md` |
| Template data-viz pour Gemini (BarRace, StackedBars…) | `memory/tools/CATALOGUE-GEMINI.md` (40+ templates) |
| Asset PixelLab AVANT génération | `memory/tools/PIXELLAB-MASTER-INDEX.md` (~50 assets avec IDs) |
| Kling, fal.ai, clip 4K, start/end frame | `memory/tools/kling.md` |
| Gemini, retouche image, character sheet | `memory/tools/gemini.md` |
| Recraft, SVG, asset, vivid_shapes | `memory/tools/recraft.md` |
| ElevenLabs, voix, TTS, narration | `memory/tools/elevenlabs.md` |
| Minimax, musique de fond, kora, griot | `memory/tools/minimax.md` |
| Twelve Labs, analyse vidéo post-render | `memory/tools/twelve-labs.md` |
| SFX, effet sonore AVANT chercher/créer | `public/_shared/sfx/SFX-INDEX.md` |
| Comparaison surfaces géo (vraie taille) | `memory/tools/d3-geo-taille-comparative.md` · `SurfaceComparison.tsx` |

### Remotion / render / publication

| Sujet | Fichier / skill |
|---|---|
| Remotion, animation, render, headless, composition | `memory/tools/remotion.md` + skills `remotion-best-practices/rules/`, `remotion-video-toolkit/rules/rendering.md` |
| Render cloud Vercel (>30s, libérer machine) | `scripts/tools/render-on-vercel.py` (défaut render long, 100GB-h/mois gratuit) |
| Règles outils techniques (Lottie, Mapbox headless, audio, geo) | `memory/rules-outils-techniques.md` |
| Publier YouTube + Instagram + Facebook | `memory/tools/trypost.md` (TryPost, limites 50MB, jamais REST `/api/uploads`) |
| Publier TikTok | `memory/tools/postiz.md` (Postiz REST, coverB obligatoire) |
| Calendrier éditorial Kora & Cartes | `memory/episodes/lancement-kora/CALENDRIER-EDITORIAL-JUIN-2026.md` |
| Pipeline, ordre des étapes | `memory/tools/pipeline.md` |
| Règles workflow/processus (jury APIs, go/no-go) | `memory/rules-workflow-processus.md` |

---

## 2. Routage PROCÉDÉS → SKILLS — LANCER le skill (NON-NEGOTIABLE)

Nos procédés SONT des skills exécutables. Quand un procédé démarre, **LANCER le skill** (via Skill tool), ne pas juste lire un `.md`. Vaut pour Claude principal ET agents autonomes.

| Quand Aziz / un agent veut... | LANCER ce skill / système |
|---|---|
| Préproduction Short Souverain (90s éco/géopo Afrique) | `souverain-preproduction` |
| Préproduction épisode Atlas (carto, géo, richesse) | `atlas-video-preproduction` |
| Préproduction vidéo narrative (Seedance, personnages) | `video-narrative-preproduction` |
| Écrire/structurer un script YouTube (8-15min animé) | `youtube-scriptwriting` |
| Produire/coder une WAR-MAP | POINT D'ENTRÉE `src/projects/warmap/WARMAP-INDEX.md` · doctrine `WARMAP-PLAYBOOK.md` + `WARMAP-RESEARCH-PLAYBOOK.md` |
| **Coder un beat Souverain MAPBOX** (carte, getCam, overlays) | SYSTÈME `scripts/mapbox-session.py` — voir « Pipeline Beat Mapbox » dans CLAUDE.md. Self-review `scripts/tools/mapbox-selfreview.py` (0 erreur avant Gemini). Base : `MarocBatteriesShort.tsx` |
| **Coder un beat Souverain REMOTION/Tailwind** (graphisme, data-viz) | SYSTÈME `/beat` (`scripts/beat-session.py`) — voir « Pipeline Beat Souverain ». Doctrine `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` |
| Produire un Short en lot | `batch-short-production` |
| Carrousel / caption / réécriture d'un contenu en vidéo | `verif-factuelle` D'ABORD → puis `src/projects/souverain/carousels/hybrid/README.md` |
| Carrousel « Good News » (macro Afrique, indépendant) | `src/projects/souverain/carousels/good-news/README.md` (DATA-DRIVEN `carousel-data.ts`) |
| Analyser une chaîne YouTube | `analyze-channel` |
| Intégrer feedback / corrections post-review | `integrate-feedback` |
| Bilan/checkpoint de session | `checkpoint` (Souverain) ou `atlas-session` (Atlas) |
| **Review externe (plan OU rendu) — quel outil ?** | `scripts/tools/REVIEW-TOOLS-INDEX.md` ⭐ vue unifiée. Système principal = `da-brief.py` (3 voix, upstream/downstream). Modèles CONSULTATIFS jamais juges. |
| **AVANT de coder un acte/beat (vision validée + assets décidés)** | DA-BRIEF-GATE — `memory/doctrines/DA-BRIEF-GATE.md` + `scripts/tools/da-brief.py --upstream` (Gemini+Kimi+DeepSeek → synthèse tracée → Aziz tranche → code). NON-NEGOTIABLE tous projets. MAX 1 appel/modèle/acte |
| **Bug Remotion/Mapbox — 2e fix sur MÊME symptôme échoue** | `superpowers:systematic-debugging` OBLIGATOIRE. STOP → instrumenter (prouver la valeur réelle) AVANT de fixer. Jamais « c'est l'environnement » sans preuve |
| Beat vidéo qui échoue 2+ fois (visuel) | AVANT de re-coder : œil externe sur la vidéo ratée via `scripts/tools/da-brief.py` (downstream, frames). Voir REVIEW-TOOLS-INDEX. |
| Gros chantier multi-étapes (épisode, pipeline, refactor) | `superpowers:writing-plans` |
| Avant de dire « c'est fait/terminé » | `superpowers:verification-before-completion` |

**Anti-friction** : NE PAS lancer un skill pour du trivial (1 slide, fix 1 ligne, question simple). Le skill se lance quand la tâche a la FORME du procédé, pas par réflexe.
