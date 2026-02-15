# Remotion - Animated Video Project

Projet de creation de videos educatives animees (style Kurzgesagt/Brightside) avec Remotion, un framework React pour la video programmatique.

## Stack technique

- **Remotion** v4.0 - Framework video React
- **11Labs** - Voix-off (TTS) et effets sonores
- **Auphonic** - Polissage audio (normalisation, denoise)
- **TypeScript** strict mode
- **SVG** pour les personnages et decors
- **Python** - Scripts de recherche multi-LLM

## Structure du projet

```
src/
  characters/          Personnages reutilisables (StickFigure)
  animations/          Bibliotheque de mouvements (idle, walk, jump, wave...)
  components/          Decors partages (OutdoorBackground, Sun)
  projects/
    hello-world/       Premier projet video (10s)
      scenes/          Compositions Remotion
      audio/           Configuration audio (timing, volumes)
scripts/
  generate-audio.ts    Pipeline 11Labs (voix-off + SFX)
  polish-audio.ts      Pipeline Auphonic (polissage voix)
research/
  launch_deep_research.py          Recherche parallele multi-LLM (Gemini + Grok + OpenAI)
  multi_step_research.py           Pipeline multi-step (Decompose -> Research -> Expand -> Synthesize)
  01_chatgpt_scriptwriting_*.md    Rapport OpenAI
  02_gemini_scriptwriting_*.md     Rapport Gemini Deep Research
  03_grok_scriptwriting_*.md       Rapport Grok (terrain/tendances)
  04_multistep_*_synthesis.md      Rapport synthese multi-step (118 sources)
  04_multistep_sources.json        URLs des sources collectees
.claude/
  skills/
    youtube-scriptwriting/         Skill scriptwriting YouTube (5 phases)
public/audio/          Fichiers audio generes (non versionnes)
out/                   Videos rendues (non versionnees)
```

## Demarrage rapide

```bash
# Installer les dependances
npm install
pip install requests python-dotenv

# Lancer le Studio Remotion (preview)
npm run dev

# Lancer la recherche multi-LLM (Gemini + Grok + OpenAI)
python -u research/launch_deep_research.py

# Lancer le pipeline multi-step (recherche approfondie)
python -u research/multi_step_research.py

# Generer les fichiers audio (necessite cles API dans .env)
npx tsx scripts/generate-audio.ts

# Polir les voix-off avec Auphonic
npx tsx scripts/polish-audio.ts

# Rendre la video finale en MP4
npx remotion render HelloWorld out/HelloWorld.mp4
```

## Configuration

Creer un fichier `.env` a la racine :

```
ELEVENLABS_API_KEY=sk_...
AUPHONIC_API_KEY=...
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
XAI_API_KEY=xai-...
```

## Workflow de creation video

```
Phase 0: Discovery Interview (sujet, ton, duree, niche)
Phase 1: Multi-Angle Research (Gemini + Grok + Perplexity)
Phase 2: Multi-Step Synthesis (decompose -> research -> expand -> synthesize)
Phase 3: Script Writing (base sur les rapports, pas les connaissances generales)
Phase 4: Storyboard & Timing
Phase 5: Assets (decors SVG, personnages)
Phase 6: Animation (spring, interpolate)
Phase 7-8: Assemblage des scenes
Phase 9: Rendu MP4 + Audio (11Labs + Auphonic)
```

## Videos

### HelloWorld (10 secondes)

Video de demonstration avec Bob le stick figure :
1. Bob respire tranquillement
2. Il remarque quelque chose
3. Il marche vers la droite
4. Il fait un salut
5. Il saute de joie

Avec narration francaise (voix George - 11Labs), effets sonores (ambiance nature, pas, saut) et musique de fond.
