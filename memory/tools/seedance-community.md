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
| @roco_kn_roco — Time Stop anime | https://x.com/roco_kn_roco/status/2039962871149584691 | **Time freeze** : timelapse foule + snap fingers → monde fige. 2 prompts assembles. Style anime Shinkai. Techniques : fisheye urbain, motion blur foule vs sujet net, "luxurious cuts" (cadrages varies), shockwave freeze. Video : `~/Downloads/time stop.mov` (28s). Application : hook GeoAfrique (personnage immobile dans monde en mouvement, puis freeze). |

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
# Learnings a Tester — Consolide
> Source : 5 videos YouTube analysees (1er avril 2026) + tests internes
> Statut : A TESTER quand credits Seedance/Dreamina disponibles
> Mise a jour : 2026-04-01

---

## 1. Techniques Seedance — A tester

### 1.1 Props main gauche/droite (Regle 23)
- **Source** : JSFILMZ — "This Mistake Is Wasting Your Tokens"
- **Probleme** : les objets tenus disparaissent pendant les actions si pas specifies par main
- **Fix** : "Right hand ALWAYS holds [objet], NEVER released, NEVER disappears. Left hand EXCLUSIVELY for [action]."
- **Test** : generer un clip 5s avec Abou Bakari tenant un parchemin main droite + geste main gauche
- **Statut** : PAS ENCORE TESTE
- **Deja ajoute** : seedance-reference.md regle 23

### 1.2 Structure prompt en 3 blocs
- **Source** : JSFILMZ
- **Principe** : separer explicitement Character block / Environment block / Camera block
- **Comparaison** : on utilise deja SECONDS X TO Y + COLOR GRADE, mais pas de separation explicite en blocs
- **Test** : reformuler un prompt existant (ex: Beat 06) en 3 blocs et comparer le resultat
- **Statut** : PAS ENCORE TESTE

### 1.3 Video-to-Video (V2V) — scenes simples
- **Source** : Yaroflasher — "Complete Seedance 2.0 Video Reference Tutorial"
- **Principe** : uploader un clip existant + 1 image ref = Seedance genere un "rendu" par-dessus
- **Limites documentees** : fonctionne bien camera statique + 1 sujet, rate sur mouvements complexes multi-objets
- **Test prioritaire** : prendre beat04-decision (7s, camera quasi-statique) et tester V2V pour ameliorer
- **Statut** : PAS ENCORE TESTE (etait dans backlog seedance-reference.md)

### 1.4 Deux refs = start+end pour V2V
- **Source** : Yaroflasher
- **Principe** : pour scene avec transition, fournir 2 images de reference (premiere frame + derniere frame)
- **Equivalent** au start+end frame de Kling O3, mais via le systeme de ref images Seedance
- **Test** : clip avec transition de lieu (interieur → exterieur)
- **Statut** : PAS ENCORE TESTE

### 1.5 Direction du mouvement dans images source (Regle 24)
- **Source** : Mira AI — "13 Nano Banana 2 Prompts For AI Filmmaking"
- **Principe** : designer la composition de l'image pour indiquer le sens du mouvement (objet a gauche du cadre = mouvement vers la droite)
- **Test** : generer 2 images Gemini avec compositions directionnelles opposees, uploader en start+end O3
- **Statut** : PAS ENCORE TESTE
- **Deja ajoute** : seedance-reference.md regle 24

---

## 2. Techniques Gemini — Testees / Validees

### 2.1 Character sheets multi-angle via Gemini 3.1 Flash
- **Statut** : VALIDE
- **Resultat** : Colomb character sheet genere — 4 vues tete + full body, style coherent avec Abou Bakari/Moussa
- **Fichier** : `public/assets/library/geoafrique/characters/colomb/christophe-colomb-character-sheet-v1.png`

### 2.2 Expressions en pourcentage
- **Source** : Mira AI + test interne
- **Principe** : "60% rage, 40% tristesse" dans le prompt Gemini = blend d'emotions sur le visage
- **Statut** : VALIDE (confirme par Aziz le 2026-04-01)
- **Test 1** (70/30 determination/anxiete) : resultat subtil
- **Test 2** (3 variantes extremes) : confirme satisfaisant — le blend est perceptible
  - 90% rage / 10% tristesse
  - 90% joie / 10% folie
  - 50% terreur / 50% emerveillement
- **Fichiers** : `public/assets/library/geoafrique/characters/colomb/christophe-colomb-expr-*.png`
- **Technique integree** : utilisable dans tout prompt Gemini 3.1 Flash pour character sheets et close-ups
- **A tester aussi** : dans les prompts Seedance directement (ex: "expression: 70% determination, 30% anxiety")

---

## 3. Recraft V4 — A surveiller

### 3.1 Style ID sur V4
- **Source** : Theoretically Media — "The AI Image Platform That Does What Others Can't"
- **Statut** : PAS ENCORE DISPONIBLE
- **Impact** : notre pipeline `create_style()` + Style ID reste sur V3 Vector tant que non branche sur V4
- **A surveiller** : annonce officielle Recraft du support styles sur V4

### 3.2 V4 Vector — qualite vs V3 Vector
- **Info** : V4 = 2 credits (vs 10 Pro), meilleur "design judgment" (composition, eclairage, couleurs)
- **Test potentiel** : generer un meme asset en V3 Vector + V4 Vector et comparer
- **Statut** : PAS ENCORE TESTE — basse priorite (V3 marche bien pour nous)

### 3.3 Workflow Mockup deformable
- **Principe** : plaquer logo/texte sur surface avec deformation realiste des plis (vetements, drapeaux)
- **Disponible** dans Recraft Studio > Workflows (nodes)
- **Statut** : PAS TESTE — basse priorite, usage niche

---

## 4. Techniques decouvertes — Repo 500+ prompts (avril 2026)

> Sources : github.com/YouMind-OpenLab/awesome-seedance-2-prompts (1363 prompts)
> + github.com/Emily2040/seedance-2.0 (pipeline 23 skills)
> + seedance2prompt.org (40+ prompts detailles)

### 4.1 Motion Transfer (NOUVEAU)
- Prompt : `"Imitate the action of @Video1 with the character from @Image1."`
- Transfere le mouvement d'un clip existant vers un autre personnage
- Usage : prendre un beat valide et transferer a un autre personnage
- Credits : 120 | Statut : A TESTER

### 4.2 Template Replication (NOUVEAU)
- Prompt : `"Replicate the editing style and camera movements of @Video1 with characters from @Image1 and @Image2."`
- Clone le rythme visuel, eclairage et camera d'un clip de reference
- Usage : garantir coherence entre beats sans re-decrire le style
- Credits : 120 | Statut : A TESTER

### 4.3 One-Take multi-references (NOUVEAU)
- Prompt : `"Single continuous take: Start in @Image1's [lieu A], camera follows through [transition] into @Image2's [lieu B]. No cuts."`
- Chaine plusieurs environnements en un plan-sequence via @Image refs
- Usage : Beat 06 Depart (interieur->exterieur->mer)
- Credits : 80 | Statut : A TESTER

### 4.4 Multi-Reference 4 types (NOUVEAU)
- Pattern : @Image1 (apparence) + @Image2 (lieu) + @Video1 (camera) + @Audio1 (audio)
- Combine 4 types de refs dans une seule requete
- On n'utilisait que 1-2 refs — ce pattern en combine 4
- Credits : 120 | Statut : A TESTER

### 4.5 Beat-Sync @Audio1 (NOUVEAU)
- Prompt : `"Video rhythm references @Audio1. [action] hits poses on each beat drop. Camera cuts sync to music tempo."`
- Uploader audio ElevenLabs comme ref de rythme — Seedance sync les visuels dessus
- Credits : 80 | Statut : A TESTER

### 4.6 Prompts courts (30-100 mots) vs longs (150-200 mots)
- Le pipeline Emily2040 recommande des prompts courts avec plus de refs visuelles
- Nos prompts SECONDS X TO Y font 150-200 mots — peut-etre trop verbeux
- Pattern court : `"Reference @Image1. Shot 1: [action]. Shot switch. Shot 2: [action]. Shot switch. Shot 3: [close-up]."`
- Credits : 80 | Statut : A TESTER

### 4.7 Video Extension avec scene transition (NOUVEAU)
- Prompt : `"Continue @Video1 as character [action] into new environment. Lighting shifts from [A] to [B]. Maintain character appearance."`
- Prolonger un clip en changeant d'environnement
- Credits : 120 | Statut : A TESTER

---

## 5. Priorites de test

| # | Test | Credits | Priorite | Prerequis |
|---|------|---------|----------|-----------|
| ~~1~~ | ~~Review expressions Colomb~~ | ~~0~~ | ~~VALIDE~~ | ~~Confirme par Aziz~~ |
| 2 | Props main G/D (regle 23) | 80 Seedance | HAUTE | Credits Dreamina |
| 3 | **Motion Transfer** (@Video beat + @Image perso) | 120 Seedance | HAUTE | Credits Dreamina + beat valide |
| 4 | **Template Replication** (cloner style d'un beat) | 120 Seedance | HAUTE | Credits Dreamina + beat valide |
| 5 | **Prompts courts** 30-100 mots vs nos 150-200 | 80 Seedance | HAUTE | Credits Dreamina |
| 6 | V2V sur beat existant | 120 Seedance | MOYENNE | Credits Dreamina |
| 7 | **Beat-Sync @Audio1** (upload ElevenLabs) | 80 Seedance | MOYENNE | Credits Dreamina |
| 8 | **Multi-ref 4 types** combinaison complete | 120 Seedance | MOYENNE | Credits Dreamina |
| 9 | 2 refs start+end pour V2V | 120 Seedance | MOYENNE | Credits Dreamina |
| 10 | **One-Take multi-refs** plan-sequence | 80 Seedance | BASSE | Credits Dreamina |
| 11 | **Video Extension** scene transition | 120 Seedance | BASSE | Credits Dreamina + clip existant |
| 12 | Prompt 3 blocs vs SECONDS X TO Y | 80 Seedance | BASSE | Credits Dreamina |
| 13 | Direction mouvement images source | 0 (Gemini) + Kling | BASSE | Credits fal.ai |
| 14 | V4 Vector vs V3 Vector | 2-4 Recraft | BASSE | Rien |
