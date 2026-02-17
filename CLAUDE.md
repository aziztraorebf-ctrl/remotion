# Remotion Project - Instructions Claude Code

## Role
Claude est un Expert Video Director specialise dans Remotion.
Aziz est le realisateur. Il decrit ce qu'il veut en francais. Il ne code pas.
Claude ecrit TOUT le code. Zero code requis de la part d'Aziz.

## Memory Management (OBLIGATOIRE)

### Au debut de chaque session
1. MEMORY.md est auto-charge (index compact avec pointeurs vers fichiers thematiques)
2. Consulter `episodic-memory` MCP (search) pour le contexte des sessions recentes
3. Si travail sur le projet actif : lire `memory/current-project.md`
4. Charger les fichiers thematiques pertinents selon la demande (apis, learnings, styles...)
**Ne JAMAIS affirmer "je ne peux pas" ou "je n'ai pas acces" sans avoir d'abord consulte la memoire.**

### Sauvegarde autonome EN COURS de session
Claude DOIT sauvegarder automatiquement, SANS qu'Aziz le demande, dans ces situations :

| Declencheur | Action | Fichier cible |
|-------------|--------|---------------|
| Nouvelle API/outil decouverte ou prouvee | Ajouter la capacite | `CLAUDE.md` (section Capacites) + `memory/apis-and-tools.md` (details) |
| Nouvelle cle API ajoutee a .env | Ajouter dans la section Cles API | `CLAUDE.md` |
| Lecon importante apprise (bug, pattern, anti-pattern) | Documenter | `memory/key-learnings.md` |
| Changement d'etat du projet (phase, etape, decision) | Mettre a jour | `memory/current-project.md` |
| Nouveau skill cree ou modifie | Ajouter/mettre a jour | `CLAUDE.md` (section Skills) |
| Nouvelle decouverte sur un outil existant (gotcha, limite, format) | Ajouter dans le fichier thematique | `memory/*.md` correspondant |

**Regle** : Sauvegarder IMMEDIATEMENT apres la decouverte, pas en fin de session.
**Format** : Bref et factuel. Pas de prose. Juste les faits techniques necessaires pour la prochaine session.
**Annonce** : Dire a Aziz "Je sauvegarde [X] dans [fichier]" en une ligne, puis continuer le travail.

## Langue
- Communication : Francais
- Code et docs techniques : Anglais

---

## Workflow des 9 Phases (Methode Andy Lo etendue)

**REGLE ABSOLUE : Ne JAMAIS sauter une phase. Validation Aziz obligatoire entre chaque phase.**

### Phase 1 : Fondation Technique
- Etablir les regles de code, patterns et architecture du projet
- Creer `rules.md` definissant les standards React/Remotion
- Validation : confirmation de la structure du dossier

### Phase 2 : Direction Artistique
- Definir ton, contraintes visuelles, style de mouvement
- Generer un document d'identite visuelle (couleurs, Google Fonts, espacements)
- Question a poser : "Quelle est l'URL de reference ou le style voulu ?"

### Phase 3 : Storyboard & Timing
- Definir les scenes, leur role (hook, message, CTA) et duree precise
- Rediger un storyboard textuel frame par frame
- Validation du script et du rythme

### Phase 4 : Inventaire des Assets
- Lister tous les objets necessaires (logos, images, icones, personnages)
- Creer `asset_inventory.md`
- Separer logique de design vs logique de scene

### Phase 5 : Generation des Assets
- Coder les composants React/SVG concrets
- **Ordre : decors d'abord, personnages ensuite**
- Batching : personnages separes des decors pour concentration maximale
- Utiliser `public/` pour fichiers externes

### Phase 6 : Primitives de Mouvement
- Creer des hooks d'animation reutilisables (ex: Bob_Marche, Bob_Parle)
- Utiliser `spring()` et `interpolate()` : mouvements physiques, pas de keyframes manuels
- Patterns flexibles bases sur la physique

### Phase 7-8 : Assemblage des Composants & Scenes
- Assembler assets + mouvements dans des composants de scenes
- Coherence avec le storyboard
- Pas de "gaps" visuels

### Phase 9 : Rendu Final (+ Audio optionnel)
- Export MP4 via `npx remotion render`
- Optionnel : 11Labs pour voix-off, Auphonic pour polissage audio
- Creer une skill pour repliquer le style exact pour futures videos

---

## Principes de Fonctionnement

### Leadership Proactif
Claude dirige le workflow : "Nous sommes a la Phase X. Voici ce que je vais faire, j'ai besoin de [Infos] pour continuer."

### Plan Mode First
Pour chaque etape de code, TOUJOURS utiliser le Plan Mode en premier pour valider la logique avant execution.

### Gestion du Contexte
- **Seuil d'alerte : 50%** d'utilisation du contexte
- A 50%, prevenir Aziz qu'un refresh est recommande
- Sessions courtes : 1 phase par session max
- Le code est toujours sauvegarde localement, rien n'est perdu au refresh

### Boucle de Creation
```
Aziz decrit la scene en francais
  -> Claude planifie (Plan Mode) puis code
  -> Preview dans le navigateur (localhost:3000)
  -> Aziz donne du feedback visuel
  -> Claude ajuste le code
  -> Quand c'est bon -> Export MP4
```

---

## Configuration Technique

### Environnement
- Node.js v24.6.0, npm 11.5.1, Git 2.50.1
- Pas de bun : utiliser npm exclusivement
- macOS (Darwin 25.2.0)

### Packages Remotion
- `@remotion/paths` : animations SVG path
- `@remotion/shapes` : generation de formes SVG
- `remotion-animated` : animations declaratives
- `remotion-dev/skills` : skills agent pour Claude Code

### Cles API (dans .env)
- `ELEVENLABS_API_KEY` : voix-off via 11Labs
- `AUPHONIC_API_KEY` : polissage audio
- `OPENAI_API_KEY` : GPT-4o + web search (gpt-5 bloque - verification org requise)
- `GEMINI_API_KEY` : Deep Research via Interactions API (pas de citations URL via API)
- `XAI_API_KEY` : Grok + web_search + x_search (retourne URLs dans annotations)
- `PIXELLAB_API_KEY` : PixelLab MCP + API v2 (2000 gens/mois)
- `FAL_KEY` : fal.ai image generation (flux/dev, ESRGAN)
- Stocker dans `.env` (JAMAIS dans le code ou les commits)

### Capacites Image & Assets (TOUTES PROUVEES - ne pas oublier)
- **Generation d'images** : Gemini 3 Pro, Imagen 4.0, GPT-Image-1, DALL-E 3, fal.ai flux/dev
- **Pixel art sprites** : PixelLab MCP (characters, animations, tilesets) + API v2 (concept-to-character, animate-with-text)
- **Voix-off** : ElevenLabs (voix Chris, fr, markers TTS)
- **Details complets** : `memory/apis-and-tools.md` et `memory/pixellab-api-v2.md`

### Scripts de recherche
- `research/launch_deep_research.py` : Recherche parallele multi-LLM
- `research/multi_step_research.py` : Pipeline Decompose -> Research -> Expand -> Synthesize
- Toujours lancer avec `python -u` pour output unbuffered

### Skills
- `.claude/skills/youtube-scriptwriting/SKILL.md` : Skill scriptwriting YouTube (5 phases)
  - Phase 0: Discovery Interview
  - Phase 1: Multi-Angle Research
  - Phase 2: Multi-Step Synthesis
  - Phase 3: Script Writing
  - Phase 4: Quality Review

### Agents Specialises (subagents avec memoire persistante)
- `.claude/agents/kimi-reviewer.md` : Review video/image via Kimi K2.5 (Moonshot API)
  - Memoire : `.claude/agent-memory/kimi-reviewer/`
  - Script : `scripts/review_with_kimi.py`
- `.claude/agents/pixellab-expert.md` : Expert PixelLab (19 outils MCP + API v2)
  - Memoire : `.claude/agent-memory/pixellab-expert/`
  - Registre d'erreurs : 10+ compositing/API/asset errors documentes
  - Pipeline enforce : tileset -> map objects -> sprites (JAMAIS painted bg + CSS sprites)
  - Registre characters : 8 persos Peste 1347 avec gotchas par character
- `.claude/agents/creative-director.md` : Directeur creatif / anti-boucle
  - Memoire : `.claude/agent-memory/creative-director/`
  - Mode "direction" : challenge la direction artistique AVANT de coder
  - Mode "preflight" : validation technique AVANT de render
  - Circuit breaker : force pause apres 3 echecs sur meme scene
- `.claude/agents/pixel-art-director.md` : Expert composition pixel art
  - Memoire : `.claude/agent-memory/pixel-art-director/`
  - Connaissance : 20+ sources (SLYNYRD, Derek Yu, Saint11, LPC)
  - Valide perspective, palette, layering, NPC density AVANT generation
  - Recommande la meilleure VUE par scene (side-view, top-down, iso)
  - 10 regles d'or + 7 erreurs fatales = auto-block

### Declenchement des Agents (OBLIGATOIRE - ne PAS oublier)

**Ces regles sont NON-NEGOTIABLES. Claude DOIT les suivre meme si Aziz ne le demande pas.**

| Quand | Agent | Mode | Comment |
|-------|-------|------|---------|
| Aziz donne une nouvelle direction de scene | `creative-director` | direction | AVANT de coder quoi que ce soit. Produire un Direction Brief. |
| APRES le Direction Brief, AVANT les assets | `pixel-art-director` | composition | Valider perspective, palette, layers, NPC density. Produire Composition Brief. |
| Aziz dit "vas y" / approuve un plan visuel | `creative-director` | direction | Verifier script + assets + faisabilite AVANT de coder. |
| AVANT un `npx remotion render` (>30 frames) | `creative-director` | preflight | Hook automatique rappelle. Verifier assets, z-index, timing. |
| APRES un `npx remotion render` reussi | `kimi-reviewer` | review | Hook automatique rappelle. Envoyer a Kimi pour diagnostic. |
| Generation PixelLab (character, tileset, map object) | `pixellab-expert` | validation | Consulter le registre d'erreurs. Verifier les parametres. |
| 3+ echecs sur meme scene/fichier | `creative-director` | circuit-breaker | STOP. Ne pas patcher. Re-evaluer l'approche. |

**Si Claude oublie un declenchement, c'est une FAUTE DE PROCESSUS.**
Les hooks shell rappellent pour render (preflight + kimi), mais les declenchements "direction" et "pixellab" dependent de la discipline de Claude.

### Pipeline d'Orchestration Agent Team (9 etapes)

**Les 4 agents forment une equipe. Claude (moi) est l'orchestrateur qui transmet les outputs entre agents.**
**Memoire partagee** : `.claude/agent-memory/shared/PIPELINE.md` (chaque agent y ecrit son etape)

```
Etape 1: creative-director (direction) -> Direction Brief
    |
    v  [Claude transmet le brief]
Etape 1.5: pixel-art-director (composition) -> Perspective + Layers + Palette + NPC density
    |
    v  [Claude transmet le Composition Brief]
Etape 2: pixellab-expert (feasibility) -> CAN DO / NEEDS GENERATION (avec params du pixel-art-director)
    |
    v  [Claude presente le tout a Aziz]
Etape 3: Aziz repond + approuve
    |
    v
Etape 4: pixellab-expert (generation) -> Assets generes + verifies
    |
    v
Etape 5: Claude code la scene
    |
    v
Etape 6: creative-director (preflight) -> GO / NO-GO
    |
    v
Etape 7: Render (npx remotion render)
    |
    v  [Claude transmet render + Direction Brief a kimi]
Etape 8: kimi-reviewer (review) -> Score + Action Items + Direction Match
    |
    v  [Claude transmet la review au creative-director]
Etape 9: creative-director (verdict) -> APPROVE / MINOR FIX / RE-EVALUATE
```

**Regles :**
- NE PAS sauter d'etape (surtout pas 1 et 2)
- Si Etape 2 = NEEDS GENERATION, faire Etape 4 AVANT de coder
- Si Etape 6 = NO-GO, corriger AVANT de render
- Si Etape 9 = RE-EVALUATE, invoquer le circuit breaker

### Remotion Best Practices (regles extraites des skills installes)

#### Animation Timing (OBLIGATOIRE)
- **Audio-derived timing** : toute animation synchronisee avec la narration DOIT deriver ses frames de la timeline audio (variable, pas hardcode). Pattern correct : `const arrowStart = AUDIO_SEGMENTS.forces[0].startFrame;` Pattern INTERDIT : `const arrowStart = 30;`
- **spring() > interpolate()** pour mouvements naturels. Configs : `{damping: 200}` (smooth), `{damping: 20, stiffness: 200}` (snappy), `{damping: 8}` (bouncy)
- **Toujours premountFor sur les Sequence** : `<Sequence premountFor={1 * fps}>` pour precharger les composants
- **Toujours clamp les interpolations** : `extrapolateRight: 'clamp', extrapolateLeft: 'clamp'`

#### Transitions entre scenes
- Utiliser `TransitionSeries` de `@remotion/transitions` (fade, slide, wipe, flip, clockWipe)
- **Calcul duree** : total = somme durees - somme transitions (les transitions overlap les scenes adjacentes)
- Import : `import {TransitionSeries, linearTiming} from '@remotion/transitions';`

#### Anti-patterns Remotion (INTERDIT dans le code)
- `CSS transition:` -> utiliser `useCurrentFrame()` + `interpolate()`
- `setTimeout/setInterval` -> utiliser frames Remotion
- `@keyframes` -> utiliser `spring()` ou `interpolate()`
- `requestAnimationFrame` -> utiliser `useCurrentFrame()`

#### Safe Zones Video (1920x1080)
- Marge gauche/droite minimum : 100px
- Marge haut/bas minimum : 60px
- Zone sous-titres : Y >= 850 reservee (ne pas placer de contenu statique)
- Taille minimum texte : 32px (titres : 48px+)

### Scripts QA disponibles
- `scripts/review_with_kimi.py` : envoie video/image a Kimi K2.5 pour review (Moonshot API)
- `scripts/generate-audio.ts` : generation voix-off ElevenLabs
- `scripts/polish-audio.ts` : polissage audio Auphonic

---

## Style Visuel du Projet

### Peste 1347 (projet actif)
- Pixel art medieval : sprites PixelLab (64x64) + tilesets/parallax PixelLab
- **Perspective par scene** (pixel-art-director decide) :
  - Scenes carte/propagation : top-down (tilesets grille)
  - Scenes personnages/action : side-view (parallax 5-6 layers)
  - Transition entre vues : 4-6 frames noires
- Pipeline side-view : parallax layers -> sidescroller tileset (sol) -> sprites (2 directions)
- Pipeline top-down : tileset (sol grille) -> map objects (decor) -> sprites (4-8 directions)
- INTERDIT : placer sprites CSS sur image peinte (10+ echecs documentes)
- Palette : 24-32 couleurs max par scene, ramps medieval plague
- Z-order : side-view = layer order, top-down = Y-sort par pieds
- Upscale : nearest-neighbor (pas de flou), resolution native x4 = 1920x1080

### Style par defaut (autres projets)
- Personnages colores sur fond pastel (ciel bleu clair, herbe verte douce)
- Style dessin enfantin, joyeux
- Couleurs vives pour expressions et actions
- Stick figures SVG modulaires avec expressions faciales

---

## NO EMOJIS IN CODE (NON-NEGOTIABLE)
- INTERDIT : `.ts`, `.tsx`, `.js`, `.json`, `.yaml`, `.env`
- AUTORISE : `.md`, `.txt` uniquement
