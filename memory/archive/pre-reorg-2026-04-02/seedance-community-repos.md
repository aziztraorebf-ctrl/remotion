# Seedance 2.0 — Repos & Ressources Communautaires
> Mise a jour : 2026-04-01 | A CONSULTER avant chaque session Seedance

---

## Repos GitHub (ESSENTIELS)

### 1. Awesome Seedance 2.0 Prompts — 1363 prompts curates
- **URL** : https://github.com/YouMind-OpenLab/awesome-seedance-2-prompts
- **Galerie web** : https://seedance2prompt.org/
- **Contenu** : 1363 prompts classes par categorie (cinematique, anime, pub, social media, product, horror, sci-fi, etc.)
- **Stars** : 477 | **Forks** : 55 | **Licence** : CC BY 4.0
- **Pourquoi c'est utile** : prompts copy-paste-ready avec tags, techniques camera, multi-shot patterns, I2V, audio-sync, video extension
- **Categories cles** : Text-to-Video, Image-to-Video, Multi-Shot Character, Audio/Beat-Sync, Commercial, Social Media, Video Extension, Advanced Techniques (motion transfer, template replication)

### 2. Seedance 2.0 Production Pipeline — 23 sous-skills pour agents
- **URL** : https://github.com/Emily2040/seedance-2.0
- **Contenu** : pipeline de production quad-modal complet, architecture de skills modulaires
- **Pourquoi c'est utile** :
  - Recommande prompts COURTS (30-100 mots) + refs visuelles > descriptions longues
  - 7 genre templates (product, lifestyle, drama, music video, landscape, commercial, anime)
  - 23 sous-skills : Camera, Motion, Lighting, Characters, Style, VFX, Audio
  - Systeme de references @Tag : @Video, @Image, @Audio1, @Tag (identity)
  - Copyright diagnostic integre
  - Vocabulaire cinematique multilingue (chinois 400+ termes)
- **Decouverte cle** : "intent-first directing" > micromanagement technique. Dire CE QUE tu veux + COMMENT ca doit se sentir, pas les details techniques

---

## Liens X et Reddit (workflows et frameworks)

### X — Workflow production high-end
- **@horacedodd** : "Building worlds with Seedance 2.0 — the exact workflow to lock in high-end production value"
- **URL** : https://x.com/horacedodd/status/2036541770096587123
- **Date** : 24 mars 2026 | 648 likes, 76 RT
- **Contenu** : workflow complet etape par etape pour production Seedance haut de gamme

### Reddit — Prompt framework reutilisable (poste 1er avril 2026)
- **r/Seedance_AI** : "I summarized a reusable Seedance 2 prompt framework for more stable cinematic results"
- **URL** : https://www.reddit.com/r/Seedance_AI/comments/1s9ebyj/i_summarized_a_reusable_seedance_2_prompt/
- **Contenu** : framework de prompt structure pour resultats cinematiques stables et reproductibles

### Reddit — Prompt framework r/PromptEngineering (13 mars 2026)
- **URL** : https://www.reddit.com/r/PromptEngineering/comments/1rsjurs/a_practical_seedance_20_prompt_framework_with/
- **Contenu** : framework pratique avec exemples, style control, camera direction, sequencing

---

## Outil : Firecrawl MCP (installe 2026-04-01)

- **Config** : `.mcp.json` — server "firecrawl" avec cle API
- **Cle API** : dans `.env` (`FIRECRAWL_API_KEY`)
- **Usage** : scraper les SPAs JavaScript (YouMind, etc.) que WebFetch ne peut pas lire
- **Feature Interact** : scrape une page → puis cliquer, remplir, naviguer via prompts ou code Playwright
- **Credits** : 500/mois gratuits, 1 credit/scrape, 2-7 credits/min pour Interact
- **Doc** : https://docs.firecrawl.dev/features/interact

---

## PROCHAINE SESSION : 10 prompts YouMind a explorer en detail

> Selectionnes pour leur pertinence a notre style historique/epique flat 2D

1. **Moses Parting the Red Sea** — IMAX 12-shot rapid-cut, score orchestral, color grading
2. **David vs. Goliath** — 15s, 11-shot, "oil painting texture + cinematic realism"
3. **Badass Berserker Viking Charge** — plan-sequence action, handheld low-angle
4. **WWI Trench Warfare** — "impossible camera move" continu, sol → aerien
5. **Gritty Cine Verite 35mm** — plan-sequence 3rd-person POV no cuts
6. **Music Video Production** — combine image ref + audio ref Suno
7. **Nostalgic Childhood Memory** — 8 scenes multi-shots, transitions emotionnelles
8. **Spirit Tiger vs Void Panther** — combat 2 personnages, velocity ramping
9. **Impossible Single-Take Medieval Tavern** — plan-sequence 4 lieux + transition aerienne
10. **Fashion Sequence 5 outfit refs** — 6 images de reference = workflow multi-ref avance

> Aziz a aussi telecharge des videos du site pour analyse. Combiner les deux dans un fichier dedie.

---

## Autres liens utiles decouverts

| Ressource | URL | Contenu |
|-----------|-----|---------|
| @NACHOS2D_ — Hulk vs Thanos remake | https://x.com/NACHOS2D_/status/2038350488576369122 | 8099 likes, exemple "$2M level quality" |
| @Framer_X — Animation style consistency tutorial | https://x.com/Framer_X/status/2037908139140641050 | 2013 likes, tutorial frame-by-frame |
| @Framer_X — Audio-to-video feature | https://x.com/Framer_X/status/2035780099144818755 | Character sing/vibe to uploaded track |
| @EHuanglu — CapCut Video Studio workflow | https://x.com/EHuanglu/status/2036949499898454344 | 2862 likes, script→characters→storyboard→generate→edit |
| @techhalla — Full prompt example | https://x.com/techhalla/status/2038698494970433787 | 3115 likes, prompt complet partage |
| @Artedeingenio — Style adaptation | https://x.com/Artedeingenio/status/2036457082128335287 | Anime, cartoon, 2D, 3D — ref image adapte tout |
| Vmake + Seedance pipeline pub | https://vmake.ai/blog/seedance-2-0-workflow | 10-15 pubs 4K/jour pour un seul marketeur |

---

## Techniques cles extraites (resume)

1. **Motion Transfer** : `"Imitate the action of @Video1 with the character from @Image1."`
2. **Template Replication** : `"Replicate the editing style and camera movements of @Video1 with characters from @Image1."`
3. **One-Take multi-refs** : `"Single continuous take: Start in @Image1's [A], through to @Image2's [B]. No cuts."`
4. **Multi-ref 4 types** : @Image1 (apparence) + @Image2 (lieu) + @Video1 (camera) + @Audio1 (audio)
5. **Beat-Sync** : `"Video rhythm references @Audio1. [action] on each beat drop. Camera cuts sync to music tempo."`
6. **Video Extension** : `"Continue @Video1 as character [action] into new environment."`
7. **Shot switch pattern** : `"Shot 1: [wide]. Shot switch. Shot 2: [medium]. Shot switch. Shot 3: [close-up]."`
8. **I2V minimaliste** : `"The person blinks naturally, turns head slightly. Subtle smile. Wind moves hair. Handheld sway."`
