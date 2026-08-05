---
name: APIs Tools and Scripts
description: Reference complete des APIs actives, cles, scripts de production, et outils du projet video Remotion/GeoAfrique
type: reference
originSessionId: ce6f8686-595b-4c06-97cf-65f9ba224146
---
# APIs, Tools & Scripts Reference

> Mise a jour : 2026-04-07

## API Keys (toutes dans .env)

| Cle | Service | Usage |
|-----|---------|-------|
| ELEVENLABS_API_KEY | ElevenLabs | Voix-off TTS V3 + SFX Sound Generation |
| OPENAI_API_KEY | OpenAI | GPT-4o, GPT-Image-1 |
| GEMINI_API_KEY | Google | Gemini 3 Pro Image, Imagen 4.0, Deep Research |
| XAI_API_KEY | xAI | Grok + web_search + x_search |
| FAL_KEY | fal.ai | flux/dev, ESRGAN, Kling API |
| PIXELLAB_API_KEY | PixelLab | MCP + API v2 (archive — plus utilise activement) |
| RECRAFT_API_KEY | Recraft | V4 Vector SVG |
| AUPHONIC_API_KEY | Auphonic | Polissage audio |
| MOONSHOT_API_KEY | Moonshot | Kimi K2.5 review via OpenRouter |
| VERCEL_RENDER_URL | Vercel | Remotion renderer cloud |

---

## Services Actifs

### ElevenLabs (TTS)
- **Voix Shorts GeoAfrique** : voir `memory/tools/voices-v3.md` (Narratrice + Narrateur africains V3)
- **Voix Abou Bakari** : Stephyra (QMNPncWXVcTVhJ9rDEQO)
- **Modele** : eleven_v3 avec language_code "fr"
- **Plan** : Starter (33K chars/mois)
- **Markers** : MAJUSCULES=emphasis, ...=pause, --=tone break
- **Music API** : /v1/music/generate (Starter)
- **SFX API** : `POST /v1/sound-generation` — text-to-SFX, model `eleven_text_to_sound_v2`, 0.5-30s, `prompt_influence` 0-1 (default 0.3), `loop` boolean, output mp3/pcm/opus. Valide 2026-04-21 (flammes pour scene 6C Sonjata). Assets dans `public/assets/{project}/sfx/`.
- **Regles TTS francais** : voir `memory/tools/elevenlabs.md`

### Seedance — Endpoints fal.ai (mise a jour 2026-04-20)

| Endpoint | Prix | Audio | Resolution | Notes |
|----------|------|-------|------------|-------|
| `fal-ai/bytedance/seedance/v1/pro/image-to-video` | ~$0.148/s | NON | 1080p | 2x moins cher, qualite excellente |
| `fal-ai/bytedance/seedance/v1/pro/fast/image-to-video` | moins cher | NON | ? | Non teste |
| `bytedance/seedance-2.0/image-to-video` | $0.3024/s | OUI | 720p | Audio genere nativement |
| `bytedance/seedance-2.0/reference-to-video` | $0.3024/s | OUI | 720p | Multi-ref (jusqu'a 9 images) |
| `bytedance/seedance-2.0/fast/image-to-video` | $0.2419/s | OUI | 720p | 20% moins cher que standard |

**Strategie validee** : V1 Pro pour scenes contemplatives/narratives (2x economie), V2 pour scenes avec SFX/audio importants (combat, dialogue).
**Attention** : `generate_audio: True` est IGNORE par V1 Pro — le clip est muet. Confirme 2026-04-20.

- **Dreamina web** : Dreamina web pour tests manuels (credits existants)
- **Reference complete** : `memory/tools/seedance-prompts.md` + `memory/tools/seedance-rules.md`

### Kimi K2.5 (Moonshot)
- **Usage** : Direction artistique (DA review) + review video/image
- **Script** : scripts/review_with_kimi.py (via OpenRouter API)
- **Agent** : `.claude/agents/kimi-reviewer.md`
- **Cout** : ~$0.01-0.02/passe
- **Workflow** : brief unifie 6 sections -> prompts finaux (max 3 iterations)

### Google Gemini
- **Nano Banana Pro** (`gemini-3-pro-image-preview`) : meilleur modele Google, $0.134/img, 4K
- **Imagen 4.0** (`imagen-4.0-generate-001`) : ~$0.03/img
- **Gemini 2.5 Flash Image** : rapide, bon pour styleref
- **Deep Research API** : fonctionne mais NE retourne PAS les citation URLs (web interface seule)
- **Edition chirurgicale** : meilleur outil pour corrections precises d'images

### Kling (via fal.ai)
- **V3 Pro** : portrait cinematique, 5-10s
- **V3 Standard** : economique, scenes symboliques
- **O3 Standard** : epique, start+end frame
- **Limites** : ignore style 2D flat, pas de VFX conceptuels
- **Reference** : `memory/tools/kling.md`

### OpenAI
- **GPT-4o** : web_search_preview fonctionne
- **GPT-Image-1** : generation d'images (bon en second apres Gemini)
- **gpt-5** : BLOQUE (org verification requise)

### Grok (xAI)
- **API CHANGED fev 2026** : `search_parameters` DEPRECATED
- Nouveau : endpoint `/v1/responses`, model `grok-4-1-fast-reasoning`, `tools: [{"type": "web_search"}]`
- Citations inline `[[N]](url)`
- Credits epuisables — surveiller sur console.x.ai

### Recraft V4 Vector
- **Usage** : generation SVG natif pour Remotion
- `recraftv4_vector` (meilleur SVG), `recraftv4_pro_vector` (premium 4MP)
- MCP : recraftv3/v2 uniquement — V4 = API directe
- ~$0.08/image

### fal.ai
- SDK : `@fal-ai/client`
- flux/dev ~$0.03/img, ESRGAN ~$0.01
- Video : Kling endpoints

---

## Scripts de Production (dossier `scripts/`)

### Pipeline actif (`scripts/tools/`)
| Script | Usage |
|--------|-------|
| `dynamize-prompts.py` | Rewrite prompts Kimi -> Format 3 SECONDS Seedance |
| `generate-styleref.py` | Generer ref Gemini par clip (style anchor) |
| `extract-lastframe.sh` | Derniere frame d'un clip pour frame chaining |
| `review_with_kimi.py` | Review video/image via Kimi K2.5 |
| `upload-to-blob.py` | Upload vers Vercel Blob |
| `render-on-vercel.py` | ⛔ POC ABANDONNÉ (2026-03-27, repo séparé jamais synchronisé) — NE PAS UTILISER. `npx remotion render` local pour D3/SVG, `render-mapbox.sh` pour Mapbox/WebGL |

### Recherche (`research/`)
| Script | Usage |
|--------|-------|
| `launch_deep_research.py` | Recherche parallele multi-LLM (OpenAI + Gemini + Grok) |
| `multi_step_research.py` | Pipeline Decompose -> Research -> Expand -> Synthesize |

### Audio (`scripts/`)
| Script | Usage |
|--------|-------|
| `generate-audio.ts` | Generation voix-off ElevenLabs |
| `polish-audio.ts` | Polissage audio Auphonic |

### QA (`scripts/`)
| Script | Usage |
|--------|-------|
| `style-scan-pixel.sh` | Anti-patterns Remotion, safe zones, emojis |
| `render-keyframes.sh` | Screenshots batch frames cles |

**Toujours lancer research scripts avec `python -u`** (unbuffered output).

---

## Infrastructure

- **Vercel Blob** : stockage assets et renders
- **Vercel Renderer** : `remotion-renderer-khaki.vercel.app` — compositions MyComp, GeoTest
- **yt-dlp** : `/opt/homebrew/bin/yt-dlp` — frames, audio, transcripts YouTube

---

## Skills Discovery (skills.sh)

- **find-skills** installe globalement le 2026-04-13 via `npx skills add vercel-labs/skills@find-skills -g -y`
- Emplacement : `~/.agents/skills/find-skills` (symlinke pour Claude Code, OpenClaw, Codex, Gemini CLI)
- Usage : demander "cherche un skill pour X" -> Claude invoque find-skills pour scanner skills.sh
- Catalogue : milliers de skills officiels Vercel Labs + communaute
- Commande generique pour installer un skill trouve : `npx skills add <owner/repo@skill> -g -y`
- Note : xskill.ai / seedance2-api evalue puis rejete — proxy payant au-dessus de fal.ai, sans valeur ajoutee (on a deja FAL_KEY direct)

---

## Jury AI (4 LLM pour evaluation scripts)
- GPT-4o (structure/flow) + Grok (viralite) + Gemini (precision) + Kimi 2.5 (realisateur, MANUEL)
- Synthese : 4/4 ou 3/4 = action, 2/4 = consideration, 1/4 = Aziz decide
- Cout API : ~$0.50-1.00 (3 LLM), Kimi = gratuit (manuel)

---

## Mapbox — Quotas et capacités (validé 2026-05-23)

- **Plan gratuit** : 50 000 map loads/mois, **renouvelables le 1er du mois**
- **Au 2026-05-23** : ~1 344 loads consommés = 2.7% du quota → aucun risque
- **1 map load = 1 init `new mapboxgl.Map(...)`** par render de composition (PAS par frame)
- **Vérifier le quota** : [account.mapbox.com](https://account.mapbox.com) → Statistics
- **Au-dessus de 50k** : facturation ~$0.50/1000 loads supplémentaires
- **Token** : `REMOTION_MAPBOX_TOKEN` dans `.env`

---

## D3.js — Modules installés (validé 2026-05-23)

- `d3-scale` (^4.0.2) — scaleLinear, scaleBand, scaleOrdinal, scaleTime
- `d3-array` (^3.2.4) — extent, max, sum, mean, bisector
- `d3-format` (^3.1.2) — format("$,.0f"), format(".0%"), format(",.2f")
- `d3-geo` (^3.1.1) — geoMercator, geoPath (Atlas)
- **Pattern** : utility-only — voir `memory/feedbacks/feedback_d3-pattern-utility-only.md`
- **Référence prototype** : `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`
- **Anti-pattern** : laisser D3 manipuler le DOM (`.append()`, `.selectAll()`) — conflit React reconciler

---

## LottieFiles Creator MCP — évalué et ÉCARTÉ (2026-08-04)

Doc officielle vérifiée via WebFetch (jamais installé/testé concrètement). **Ce n'est PAS un
générateur d'illustration organique/personnages** — c'est un assistant d'ÉDITION d'animation :
importer un SVG existant, puis retoucher position/timing/couleurs/courbes via IA en langage naturel.
Registre = formes abstraites/UI (spinners, progress bars, icônes), pas personnages organiques.

**Conclusion** : pas nécessaire pour le pipeline Remotion actuel — le socle spring/interpolate fait
déjà ce rôle, un import Lottie ajouterait une couche de conversion sans gain net. Aucune mention de
limite gratuit/payant dans la doc consultée — à revérifier si le sujet revient concrètement.
