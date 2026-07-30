# ROUTAGE — Quel fichier / quel skill pour quoi

> **Consulter ce fichier au DÉBUT de toute tâche de production** (avant d'écrire code ou prompt).
> C'est la table d'aiguillage extraite du CLAUDE.md pour alléger le démarrage. Pointeurs uniquement.
> Deux tables : (1) Routage OUTILS — quel fichier LIRE. (2) Routage PROCÉDÉS — quel skill LANCER.
> **Rôle vs MEMORY.md (clarifié 2026-07-11)** : ce fichier = table COMPLÈTE et exhaustive, fait autorité en cas de doute sur où chercher. `MEMORY.md` (`.claude/.../memory/`) = résumé court auto-chargé à chaque session (projets actifs + feedbacks-clés + doctrines les plus critiques), pas remplacé par ce fichier.

---

## 1. Routage OUTILS — LIRE le fichier AVANT d'agir (NON-NEGOTIABLE)

Quand Aziz parle d'un sujet, **charger le fichier correspondant AVANT d'écrire du code ou un prompt**. Si la ligne mentionne aussi un skill, le consulter en complément (jamais à la place de la mémoire projet).

### ⚡ ARBRE DE DÉCISION — SVG ou Mapbox ? (trancher ici avant tout)

| Question | Réponse → Format |
|---|---|
| Le sujet a une **géographie réelle** (frontières, trajet, territoire) ? | → **Mapbox** frame-driven |
| Le sujet est une **transformation visuelle de formes** (mécanisme, flux, montage financier, récit incarné par des formes qui évoluent) ? | → **SVG génératif** |
| Les deux à la fois (géo + transfo narrative) ? | → **Mapbox** pour la géo + **SVG-insert** pour la couche narrative (ex. War-Map AES = carte Mapbox + insert CFA en SVG). Doctrine : `SVG-MIDFORM-FORMAT.md` § "SVG-insert" |
| Doute sur si le SVG sera LISIBLE (forme nouvelle, angle incertain) ? | → **SVG-FAISABILITE-AMONT** obligatoire AVANT tout code |
| Organique humain/animal réaliste, émotion de visage, scène filmée ? | → image générée (Gemini/Recraft/Seedance), pas SVG |

> ⭐ **Vue d'ensemble « quel moteur pour quelle nature de contenu » (3 moteurs D3/SVG/Mapbox sur 1 socle Remotion, combos signatures, Mapbox+D3 sous-exploités, décision AU SCRIPT)** : `memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md`. Cet arbre en est la version rapide « trancher ici » ; la doctrine donne le raisonnement complet.

---

### Points d'entrée maîtres (lire EN PREMIER en cas de doute « où chercher ? »)

| Sujet | Fichier |
|---|---|
| **État actuel du projet (session précédente)** | `memory/NEXT-ACTION.md` **du REPO PRINCIPAL** (`/Users/clawdbot/Workspace/remotion/memory/`) — c'est LUI qui fait foi et qui est chargé en début de session. ⚠️⚠️ **Un worktree a SA PROPRE copie de `memory/NEXT-ACTION.md`, souvent PÉRIMÉE** (vécu 2026-07-26 : celle de `remotion-cfa` datait du 22/07 et n'avait aucune section CFA, alors que le projet CFA y était le chantier actif). **Avant d'éditer un NEXT-ACTION, vérifier dans quel arbre on se trouve** (`git rev-parse --show-toplevel`). ⚠️ `memory/COMPACT_CURRENT.md` est un fichier MÉCANIQUE ciblé par `scripts/atlas-session.py` et le skill `checkpoint`, mais son contenu actuel date de 2026-06-25 et est dépassé par NEXT-ACTION.md. Ne PAS s'y fier pour "où on en était" sans vérifier la date. |
| **DÉMARRER / RECHERCHER une nouvelle vidéo OU un script (short, mid-form, macro)** | `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` ⭐⭐ DÉCLENCHEUR : dès qu'Aziz dit « je veux faire une vidéo / une recherche sur X / un script sur Y ». La chaîne complète 9 étapes (valider sujet→écrire→fact-check→jury). Aziz n'a PAS à se rappeler des étapes — suivre ce fichier. |
| **PRODUIRE/REFAIRE une scène — le SYSTÈME complet** | `memory/SYSTEME-AGENTIQUE.md` ⭐⭐ carte du système : le FLUX (storyboard→validation→breakdown→code→review), l'orchestration (chef+agents frais), où est chaque brique. Activable à tout moment (« consulte notre système agentique »). |
| **Construire/prolonger TOUTE scène (AVANT de chercher un composant)** | `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md` ⭐⭐ NON-NEGOTIABLE — déduis l'INTENTION (1 verbe) d'abord, le template en dernier. PUIS porte d'entrée `src/projects/_shared/INTENTION-FORME-INDEX.md` (table intention→forme→réponse, inclut templates Hera ⭐) |
| **Scène NARRATIVE avec un PERSONNAGE humain** (marcher, porter, échanger un objet, foule, attendre, héler) | `remotion-cfa/src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` ⭐⭐ (worktree `remotion-cfa`, branche `rnd/stick-figures-gestes` — ⚠️ node_modules non ignoré, jamais `git add -A`). Registre **EN PRODUCTION** depuis le 2026-07-28 (6 scènes). Socle `StickFigure.tsx` (à IMPORTER, jamais recopier) + tenues `identite/Roles.tsx`. Y sont gravés : le **FILTRE DE SCÈNE** (sol ? geste du corps ? décor déjà rendu ? — ≥2 « non » = refuser la scène), les 6 briques techniques, et les pistes **ÉCARTÉES** (profil seul · aucun visage · jamais sur une carte). |
| **Doute sur quel catalogue ouvrir (tout domaine)** | `src/projects/_shared/INDEX-DES-INDEX.md` ⭐ carte de TOUS les catalogues (fiches techniques, consultées APRÈS l'intention) |
| **Doute catalogue Atlas** | `src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md` ⭐ |
| **Doute catalogue / démarrer War-Map** | `src/projects/warmap/WARMAP-INDEX.md` ⭐ (LA réf = `SudanWarMapEpic60`) |
| **Assets / templates / refs (source unique)** | `public/_shared/ASSETS-INDEX.md` |

### 📤 Publier une vidéo (titre · miniature · calendrier)

| Sujet | Fichier / outil |
|---|---|
| **⭐⭐ TROUVER LE TITRE d'une vidéo (longue, Short, caption)** | `scripts/tools/jury-titres-llm.py <script.md> --contexte "..."` — jury 4 modèles (Kimi + Gemini + GPT-5.5 + **Grok**), 10 titres classés chacun, ~2 min. ⛔ **Ne JAMAIS générer ET juger un titre soi-même** (juge et partie : 3 séries rejetées + 1 titre factuellement faux le 2026-07-30). Le signal = la CONVERGENCE entre modèles. ⚠️ recompter les caractères soi-même (limite 55). Détail : `.claude/…/memory/feedback_jury-titres-llm-4-modeles.md` |
| **⭐⭐ CONCEVOIR UNE MINIATURE** | `scripts/tools/jury-thumbnail-llm.py <script.md> --contexte "..."` → 5 concepts SVG classés, PUIS composer le SVG soi-même (ou agent Fable). ⛔ **Une miniature EST une scène SVG statique — on la COMPOSE, on ne la génère pas par IA** (texte exact avec accents, registre cohérent avec la vidéo, coût nul). Vérifier à 320 px et REGARDER. Détail : `.claude/…/memory/feedback_thumbnail-svg-compose-maison.md` |
| Règles de titrage (format mesuré : ≤55 car., zéro date, tension binaire, formules mortes) | `memory/templates/regles-titres.md` + doctrine `fait + conséquence + cause inattendue` : `.claude/…/memory/feedback_doctrine-titres-youtube-kora-cartes.md` |
| Grammaire des miniatures validées (métaphore, palette, pipelines A/B/C) | `public/_shared/thumbnails-library/README.md` |
| **Où publier quoi** | `memory/tools/trypost.md` (Shorts + IG + FB, piloté MCP) · **vidéo LONGUE = upload MANUEL YouTube Studio** (garder Test & Compare) · `memory/tools/postiz.md` (TikTok) |
| **Calendrier éditorial en cours + contraintes d'ordre** | `.claude/…/memory/calendrier-publication-2026-08.md` ⭐ ⛔ un Short dont le CTA renvoie à une vidéo longue ne sort JAMAIS avant elle. |
| Tirer un SHORT d'une vidéo LONGUE | `memory/tools/notebooklm-boucle-short.md` ⭐⭐ (NotebookLM produit un Short → on en extrait le PACING ; gotcha n°1 : il perd le climax) |

### Scripts & validation

| Sujet | Fichier |
|---|---|
| **« Quel SCRIPT lancer pour faire X ? » (render/audio/publish/gen/review/data)** | `scripts/SCRIPTS-INDEX.md` ⭐ index des scripts par cas d'usage. Review : `scripts/tools/REVIEW-TOOLS-INDEX.md`. |
| **Chaîne complète idée→script blindé (valider sujet → écrire → fact-check → jury)** | `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` ⭐⭐ 9 étapes. Enchaîne `SUJET-PRIME` (0-6) + script + fact-check 3 niveaux + jury. |
| Écrire/valider TOUT script narratif (couche orale universelle) | `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` ⭐ 16 règles (clarté/incarnation/rétention) |
| Script Short narratif (Héros Oubliés, conte, tragédie) | `memory/templates/script-ebauche-v1.md` |
| Script Atlas (géo, taille, richesse-record, comparaison) | `memory/templates/script-atlas-v1.md` |
| Hook 5s / cold open (narration) | `memory/templates/hook-short.md` |
| Sous-titres Shorts (TikTok/Karaoké), camera shake | `memory/templates/subtitles-shorts.md` |
| Formule César, 7 beats Shorts, dynamisation | `memory/tools/seedance-community.md` |
| **Template combat AVANT tout prompt/image (checklist obligatoire, ZÉRO exception)** | `memory/templates/combat.md` |
| **Template narratif AVANT tout prompt/image** | `memory/templates/narratif.md` |
| **Template montage AVANT tout prompt/image** | `memory/templates/montage.md` |
| **Template exploration AVANT tout prompt/image** | `memory/templates/exploration.md` |
| **Vérifier densité de mots d'un script (avant TTS payant)** | `scripts/tools/check-script-density.py <script> --format <format>` — gate NON-NEGOTIABLE, déjà intégré au skill `souverain-preproduction`. |
| **Douter de quelle VERSION de script a servi à un rendu final** | `scripts/tools/trace-livrable.py <rendu.mp4> --episode-dir <dossier>` — croise code + audio transcrit, jamais deviner sur le nom du fichier seul. |
| **Vérifier qu'une décision doctrine tranchée (Mapbox frame-driven, anti-patterns Remotion, overlay banni) est bien respectée dans le CODE DÉJÀ ÉCRIT** | `scripts/tools/check-doctrine-violations.py [dossier]` — à lancer périodiquement (pas juste au moment d'éditer), rattrape la dérive du code jamais re-scanné. |

### Souverain

| Sujet | Fichier |
|---|---|
| **Doute « où chercher ? » Souverain — POINT D'ENTRÉE** | `src/projects/souverain/SOUVERAIN-INDEX.md` ⭐ carte maître du pilier |
| **Tirer un SHORT d'une vidéo LONGUE (condensation, script court)** | `memory/tools/notebooklm-boucle-short.md` ⭐⭐ NotebookLM PRODUIT un Short, on en extrait le PACING (jamais un avis écrit). Gabarit « section intouchable » + 6 gotchas. **En AMONT** de SOUVERAIN-SHORT-DEMARRAGE |
| Démarrer/coder un Short Souverain Mapbox (point d'entrée) | `memory/doctrines/SOUVERAIN-SHORT-DEMARRAGE.md` ⭐ 7 étapes → puis `SOUVERAIN-SHORT-SKELETON.md` |
| Doctrine Souverain (durable) | `memory/doctrines/DOCTRINE-SOUVERAIN.md` (LIRE en entier avant tout code Souverain) |
| Règles éditoriales Souverain (sources, couleurs, script Type B) | `memory/rules/rules-souverain-editorial.md` |
| Tailwind (tokens gold/navy/ivory) — TOUT composant Souverain | `memory/feedbacks/feedback_tailwind-remotion-setup.md` · Framer Motion INTERDIT · lire `tailwind.config.ts` |
| SplitScreen 50/50, entité vs entité | `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx` |
| Data-viz Souverain (StackedBars, ProcessFlow, comparaisons $) | `memory/doctrines/DOCTRINE-SOUVERAIN.md` §9 + `PrototypeD3StackedBars.tsx` (D3 utility-only) |
| Breakdown Gemini 3.1-pro (prompt + schema JSON) | `memory/tools/workflow-gemini-breakdown-schema.md` (coller bloc « stack technique ») |

### Atlas

| Sujet | Fichier |
|---|---|
| Coder une scène/beat Atlas (doctrine visuelle, AVANT code) | `memory/doctrines/ATLAS-PLAYBOOK.md` ⭐ → puis `ATLAS-BEAT-DEMARRAGE.md` (scan phase 0) |
| Produire un épisode Atlas (audio + d3-geo + render) | `memory/doctrines/ATLAS-BEAT-DEMARRAGE.md` ⭐ (atlas-template-v1.md = PÉRIMÉ ancienne archi Mapbox) |
| « Quel composant Atlas pour X ? » | `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` · doc : `ATLAS-COMPOSANTS.md` |
| Asset Atlas (sprite, map-object, geo) AVANT générer | `src/projects/atlas/_shared/ATLAS-ASSETS-INDEX.md` (19 persos / 568 sprites) |
| Personnage/sprite PixelLab dans un beat Atlas | `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` ⭐ · code `AtlasPixelChar.tsx` |
| Règles production Atlas (non-négociable, checklist) | `memory/rules/rules-atlas-production.md` |
| **Self-review SCRIPTÉE d'un beat Atlas (clipPath dupliqué, composant partagé redéfini, caméra à la main)** | `scripts/tools/atlas-selfreview.py <Beat*.tsx>` — miroir `mapbox-selfreview.py`, Phase 3 AVANT présentation Aziz. |
| Format « concept expliqué comme un jeu vidéo » | `memory/doctrines/ATLAS-FORMAT-VIDEO-GAME.md` (concepts oui, drames non) |

### SVG génératif / Shorts SVG

| Sujet | Fichier |
|---|---|
| **(0) Faisabilité SVG AMONT — LIRE AVANT toute génération** | `memory/doctrines/SVG-FAISABILITE-AMONT.md` ⭐⭐ le LLM dit SA meilleure approche + image-cible AVANT le code. ÉTAPE 0 obligatoire (évite les aller-retours coûteux). |
| **(1) Technique génération+animation SVG (manuel principal)** | `memory/doctrines/SVG-SCENES-GENERATIVES.md` ⭐ LLM dessine groupes nommés → Remotion anime, registres, grammaires, acquis transverses |
| **⭐⭐ SCÈNE AVEC PERSONNAGE(S) — quel régime, quelle recette** | `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md` ⭐⭐ **la recette du funambule CFA** (1 perso = 1 argument, arc complet, aucune concurrence visuelle) · les 2 régimes AMBIANT vs DÉMONSTRATIF · **la table des 4 scènes de référence** (funambule · port vivant · village pêcheurs · hook Or du Darfour) · ⛔ pourquoi la grammaire OBJET ne se transpose pas au personnage |
| **Obtenir la FRAME exacte d'un mot de la VO / caler un geste visuel sur la voix** | `scripts/tools/forced-align.py <audio> <texte.txt> [reperes]` — timestamps + frames. Moteur ElevenLabs (⚠️ quota OpenAI/Whisper epuise au 2026-07-25). Vaut pour TOUT beat (SVG, Mapbox, D3), pas seulement le SVG |
| **Scène SVG NEUVE, direction pas encore arrêtée** | `SVG-SCENES-GENERATIVES.md` § PIPELINE 3 MODÈLES — brainstorm texte 3 voix → gate Aziz → image-cible ×3 → **fusion par Claude** → 1 appel d'enrichissement. 2 appels modèle MAX. Outils : `scripts/tools/svg-image-cible-compare.py` + `forced-align.py`. À PROPOSER, jamais déclencher seul |
| **Orchestration agents SVG (A→Z par beat)** | `memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md` ⭐⭐ flux 2 phases + point de contrôle, checklist de lancement, preuve Beat 3 GGW |
| **Format SVG long (5-7min) ou SVG-insert dans Mapbox/Remotion** | `memory/doctrines/SVG-MIDFORM-FORMAT.md` ⭐⭐ critère = transformation visuelle de formes ; pipeline script-first ; playbook assemblage multi-beats |
| **Épisode pilote Short SVG en cours (GGW Muraille Verte)** | `memory/episodes/shorts-svg/muraille-verte/ETAT-GGW-MURAILLE-VERTE.md` ⭐⭐ STATUT + REGISTRE + OUTILS + ACQUIS. Ce fichier PRIME en cas de conflit. |
| Bibliothèque de prompts-cibles SVG par registre | `memory/doctrines/templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md` |
| **⭐ Bibliothèque éléments + techniques réutilisables (arbre, soleil, sol, souche + 6 recettes d'animation)** | `src/projects/_shared/svg-library/SVG-LIBRARY-INDEX.md` — lire AVANT de coder une nouvelle scène SVG |
| Table intention → technique SVG (12 intentions : arbre qui pousse, buvard, sway, glow...) | `src/projects/_shared/svg-library/INTENTION-FORME-SVG.md` |
| Index protos R&D validés (renders catbox, verdicts, fichiers source) | `src/projects/_shared/svg-library/RD-INDEX.md` |

### War-Map

| Sujet | Fichier |
|---|---|
| **Avant de coder une scène War-Map — scan doctrine + zoom-check ⭐** | `python3 scripts/warmap-session.py --phase scan` (4 pointeurs essentiels) puis `--phase zoom-check <f.tsx> --zoom N --intent close-up\|territorial\|regional` (anti-bug ×10 zoom Mapbox, cf Soudan Acte 3) |
| Coder scène/beat War-Map (changement territoire) AVANT CODE | `memory/doctrines/WARMAP-GRAMMAIRE.md` ⭐⭐ CAUSE avant EFFET + 5 techniques causales |
| War-Map Long (5-7min, 16:9, analytique géopo) | `memory/doctrines/WARMAP-LONG-DOCTRINE.md` ⭐ |
| Insert plein écran « prise de territoire / assaut / mouvement de forces » en SVG pur (PAS Mapbox, pas de géo réelle requise) | `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md` ⭐⭐ (registre médaillon état-major, réf compo `KhartoumEtatMajorSVG`) |
| Doctrine design War-Map (Mapbox, géo réelle — voie de production assumée, voir note) | `memory/doctrines/WARMAP-PLAYBOOK.md` |
| Doctrine données War-Map (recherche OSINT) | `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md` |
| Overlays géo-ancrés sur carte (jetons, drapeaux, plaques, RÈGLE ZÉRO anti-dérive) | `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md` ⭐⭐ |
| Quel outil pour animer quel objet War-Map (SVG/Gemini/PixelLab) | `memory/doctrines/WARMAP-ANIMER-OBJETS.md` |
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
| Template data-viz pour Gemini (BarRace, StackedBars, PulseNumber) | `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` (40+) |
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
| Grok Imagine 1.5, prompt vidéo API, alternative Seedance | `memory/tools/grok-imagine-rules.md` + `grok-imagine-prompts.md` + `memory/checklists/GROK-IMAGINE.md` |
| Template data-viz pour Gemini (BarRace, StackedBars…) | `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` (40+ templates) |
| Asset PixelLab AVANT génération | `memory/tools/PIXELLAB-MASTER-INDEX.md` (~50 assets avec IDs) |
| Kling, fal.ai, clip 4K, start/end frame | `memory/tools/kling.md` |
| Gemini, retouche image, character sheet | `memory/tools/gemini.md` ⚠️ **LIRE AVANT tout appel Gemini SCRIPTÉ** : la lib `google-genai` HANG sur image (→ REST direct) et ne PAS plafonner `max_tokens` haut pour du SVG (sur-reasoning 8min). Gotchas gravés en tête du fichier — les relire évite de re-perdre 15min (leçon 2026-07-17). |
| Recraft, SVG, asset, vivid_shapes | `memory/tools/recraft.md` |
| ElevenLabs, voix, TTS, narration | `memory/tools/elevenlabs.md` |
| **Corriger le RYTHME/pauses d'une narration validée SANS régénérer** (voix se précipite, phrase coupée, pause manquante) | `memory/doctrines/AUDIO-PAUSES-DETERMINISTES.md` ⭐⭐ silences ffmpeg exacts sur l'audio original + whisper mot-à-mot + garde-fou. Outil `scripts/tools/soudan-audio/pauses-sur-original.py`. Réutilisable TOUT projet. |
| Minimax, musique de fond, kora, griot | `memory/tools/minimax.md` |
| Twelve Labs, analyse vidéo post-render | `memory/tools/twelve-labs.md` |
| SFX, effet sonore AVANT chercher/créer | `public/_shared/sfx/SFX-INDEX.md` |
| Comparaison surfaces géo (vraie taille) | `memory/tools/d3-geo-taille-comparative.md` · `SurfaceComparison.tsx` |

### Remotion / render / publication

| Sujet | Fichier / skill |
|---|---|
| Remotion, animation, render, headless, composition | `memory/tools/remotion.md` + skills `remotion-best-practices/rules/`, `remotion-video-toolkit/rules/rendering.md` |
| Render cloud Vercel (>30s, libérer machine) | `scripts/tools/render-on-vercel.py` (défaut render long, 100GB-h/mois gratuit) |
| **Montrer un render/image à Aziz (mobile — JAMAIS de chemin local)** | Uploader d'abord : ordre catbox.moe → Imgur → uguu.se → Litterbox (dernier recours, 72h). Détail + gotchas (fichier vide silencieux, limite 1min Imgur) : `.claude/.../memory/feedback_upload-hosts-fallback.md`. Contexte mobile : `.claude/.../memory/feedback_aziz-mobile-uploads-vercel.md`. |
| Règles outils techniques (Lottie, Mapbox headless, audio, geo) | `memory/rules/rules-outils-techniques.md` |
| Publier YouTube + Instagram + Facebook | `memory/tools/trypost.md` (TryPost, limites 50MB, jamais REST `/api/uploads`) |
| Publier TikTok | `memory/tools/postiz.md` (Postiz REST, coverB obligatoire) |
| Calendrier éditorial Kora & Cartes (chaîne) | `memory/episodes/lancement-kora/CALENDRIER-EDITORIAL-JUIN-2026.md` |
| **Freelance / LinkedIn / offre de services** (≠ chaîne : LinkedIn cible des CLIENTS) | `memory/freelance-linkedin/README.md` — porte d'entrée. Le moat chiffré + les 4 obstacles réels : `STRATEGIE-LINKEDIN-FREELANCE.md` · 30 histoires postables + chemin parcouru mars→juil. 2026 : `INVENTAIRE-HISTOIRES.md` · 12 semaines dont 3 posts rédigés : `CALENDRIER-EDITORIAL.md` |
| Distribution Instagram/réseaux (audience chaîne) | `memory/doctrines/STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.md` |
| Pipeline, ordre des étapes | `memory/tools/pipeline.md` ⚠️ daté 2026-05-02 — pour data-viz voir WORKFLOW-DATAVIZ.md |
| API/outil découvert en session → où sauvegarder | `memory/apis-and-tools.md` |
| Leçon/bug/anti-pattern → où sauvegarder | `memory/key-learnings.md` |

### Rangement mémoire (réorg 2026-07-11 — racine `memory/` mise à plat en sous-dossiers)

| Sujet | Dossier |
|---|---|
| Règles de production transverses (`rules-*.md`, ex-racine) | `memory/rules/` (7 fichiers : atlas/beat/data-driven-motion/outils-techniques/souverain-editorial/souverain-script/souverain-storyboard) |
| Backlogs (éditorial + templates reveal-mécanique, fusionnés) | `memory/backlogs/BACKLOG.md` — source unique, sections par thème |
| Starters de reprise de session actifs | `memory/starters/` (STARTER-PROMPT-*.md non périmés) |
| Starters périmés / snapshots de session dépassés | `memory/archive/` (voir aussi `memory/archive/starters-perimes-*/`) |
| Sujets en réserve / stratégiques sans dossier épisode dédié | `memory/projects/` (ex : GAZODUC-MEGAPROJETS-SUJET, HOOKS-LIBRARY-PLAN, heros-oublies-series-signature, EXPLORATION-DIVERSIFICATION-CHAINES) |

### Workflows agentiques et data-viz (2026-06)

| Sujet | Fichier |
|---|---|
| **Pipeline DATA-VIZ complet A→Z** (storyboard→breakdown→Gemini→Recraft→Remotion) | `memory/doctrines/WORKFLOW-DATAVIZ.md` ⭐⭐ — POINT D'ENTRÉE pour toute scène data-viz |
| **Agent autonome scène REMOTION data-viz** (flux 2 phases, checklist, outils) | `memory/doctrines/PRODUCTION-AGENTIQUE-REMOTION.md` ⭐⭐ |
| **Agent autonome scène SVG** (flux 2 phases, checklist, outils) | `memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md` ⭐⭐ |
| Templates Remotion (CATALOGUE) | `src/projects/_shared/COMPOSANTS-INDEX.md` (71 composants, inclut HERO DATA et templates Mapbox aussi référencés) |
| Règles motion design data-driven | `memory/rules/rules-data-driven-motion-design.md` ⭐ |

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
| ⭐⭐ **Review d'un rendu — CORRECTIF ou PREMIUM ? (trancher AVANT d'écrire le brief)** | **Le fond n'est PAS validé / on chasse un défaut** → mode CORRECTIF (`da-brief.py` downstream). **Le fond EST validé, on veut faire MONTER EN GAMME** → mode **PREMIUM** : mandat « elle est bonne, comment devient-elle excellente », écart mesuré contre des refs EXTERNES (Bloomberg/FT/Economist, Vox/Kurzgesagt), défauts explicitement HORS périmètre. Vidéo complète à brief libre : `gemini-video-review-custom.py` + `kimi-video-review-custom.py`. Grille + mode d'emploi : `memory/doctrines/GRILLE-JUGEMENT-MIDFORM.md`. ⛔ Vécu 2026-07-29 : brief correctif lancé sur une vidéo VALIDÉE → il a cherché une cicatrice de coupe inexistante, appel gaspillé, Aziz a dû recadrer. **Le mode se choisit avant le brief, pas après.** |
| **AVANT de coder un acte/beat (vision validée + assets décidés)** | LANCER le skill `da-brief-gate` (Gemini+Kimi+DeepSeek → synthèse tracée dans le PLAN épisode → GATE BLOQUANT, Aziz tranche AVANT le code). Détail procédé : `memory/doctrines/DA-BRIEF-GATE.md`. NON-NEGOTIABLE tous projets. MAX 1 appel/modèle/acte |
| **Bug Remotion/Mapbox — 2e fix sur MÊME symptôme échoue** | `superpowers:systematic-debugging` OBLIGATOIRE. STOP → instrumenter (prouver la valeur réelle) AVANT de fixer. Jamais « c'est l'environnement » sans preuve |
| Beat vidéo qui échoue 2+ fois (visuel) | AVANT de re-coder : œil externe sur la vidéo ratée via `scripts/tools/da-brief.py` (downstream, frames). Voir REVIEW-TOOLS-INDEX. |
| **Chantier créatif bloqué après 2+ rejets consécutifs du même concept/storyboard** (pas au 1er jet) | LANCER le skill `creative-director-dual` — 2 agents `creative-director` en parallèle, brief strictement identique, zéro suggestion d'angle, indépendance mutuelle, Aziz tranche (garde A / garde B / fusionne). Preuve : Short War-Map Sahel 90s débloqué après 4 rejets (2026-07-07), détail `memory/episodes/warmap-sahel/DETAIL-creative-director-reprise-2026-07-07.md`. |
| **Audit qualité approfondi d'un épisode MULTI-SCÈNES déjà avancé/produit** (ménage global, avant promotion finale, session bloquée sur cohérence d'ensemble) | LANCER le skill `passe-amelioration-scene` — N agents (1/scène, checklist identique, cherchent des problèmes concrets) + 1 agent transversal de synthèse. Doctrine : `memory/doctrines/PASSE-AMELIORATION-SCENE-PAR-SCENE.md`. Preuve : `memory/episodes/warmap-sahel/AUDIT-TRANSVERSAL-SYNTHESE.md`. NE PAS utiliser sur un tout premier jet ou une scène unique. |
| Gros chantier multi-étapes (épisode, pipeline, refactor) | `superpowers:writing-plans` |
| Avant de dire « c'est fait/terminé » | `superpowers:verification-before-completion` |

**Anti-friction** : NE PAS lancer un skill pour du trivial (1 slide, fix 1 ligne, question simple). Le skill se lance quand la tâche a la FORME du procédé, pas par réflexe.
