# Regles Gemini — chirurgical, diversite visages, vivid shapes, review visuelle

> Migré depuis auto-memory 2026-08-31. Consolidé 2026-04-20/23, source 6 feedbacks fusionnés
> côté auto-memory. Complète `memory/tools/gemini.md` (params techniques) et `memory/tools/seedance-rules.md`
> (règles 75-95 paper-craft côté Seedance) avec les règles côté GÉNÉRATION D'IMAGES Gemini
> spécifiquement : image source vivante, correction chirurgicale, diversité, vivid shapes.

## Image source vivante, pas figee (R-PROMPT-LIBERAL v2 — cote Gemini)

Quand l'image Gemini est la source d'un clip Seedance (image-to-video), elle doit **deja contenir du mouvement amorce**. Les postures fixes neutres forcent Seedance a inventer le mouvement et sur-compenser.

### Formule affinee (v2, apres test V3 Thiaroye 2026-04-23)

Un prompt trop minimaliste 100% liberal prouve le principe liberal pour la **diversite de postures** (point positif) MAIS affaiblit les **regles techniques critiques** (dot-eyes viole, hatching apparu sur uniformes, composition "parade" persistante). La vraie formule = **liberal sur composition + STRICT sur regles techniques**.

**Liberal** (encourager liberte creative — Gemini compose) :
- Composition (laisser le modele organiser la scene)
- Postures et activites des personnages (ambiance vs micro-instructions)
- Expressions et emotions (description d'etat d'ame vs prescription exacte)

**Strict** (non-negociable, jamais relacher MEME dans un prompt court) :
- Regles techniques de style (dot-eyes explicites avec 5 "NO", flat fills, paper-craft)
- Palette critique du projet
- Format (9:16 ou 16:9)
- Charref match
- Anti-texte, anti-banniere

**Structure cible** ~50-60 lignes (intermediaire entre sur-contraint et trop minimaliste) :
- SCENE (3-4 lignes ambiance)
- STYLE ANCHORS (3-4 lignes refs + dot-eyes renforces)
- LIFE ON DECK / activites vivantes liberal (6-8 lignes diversite postures)
- **COMPOSITION ANTI-PARADE** (3-4 lignes : "NO frontal line, figures staggered in depth, natural gaps, multiple distances from camera")
- ENVIRONMENT (4-5 lignes palette)
- CRITICAL TECHNICAL RULES (6-8 lignes, non-negociables) : dot-eyes avec 5 "NO", flat fills sans hatching, paper-craft Sonjata, no text, 9:16, charref match

**Raison** : un prompt minimaliste 100% liberal perd ses garde-fous techniques. Les regles critiques doivent rester explicites MEME dans un prompt court. Ce qui se relache, c'est les instructions de composition, pas les contrats de style.

**Ne JAMAIS oublier dans prompt paper-craft** :
- "single black dot per eye, NO iris visible, NO pupil, NO white sclera, NO eyelashes, even in profile views"
- "flat color fills ONLY, NO hatching, NO shading gradients, NO textured shadows on uniforms"
- "NO frontal line composition, figures staggered in depth at multiple distances from camera"

**Raison elargie** : si les personnages sont deja en mouvement dans l'image source, Seedance a un **vecteur directionnel a suivre** plutot qu'a inventer.

## Correction chirurgicale

### Gemini Flash = correcteur universel
Gemini 3.1 Flash Image corrige n'importe quel detail (pieds, oeil, couronne, silhouette, composition) sans toucher au reste de l'image.
**Why:** Regenerer from scratch coute plus cher et perd la coherence visuelle etablie.
**Apply:**
- Toujours proposer un fix Gemini chirurgical AVANT de regenerer from scratch
- Regeneration = dernier recours si Gemini echoue 2+ fois sur le meme detail
- Prompt : "Make ONE single surgical change: [detail exact]. DO NOT CHANGE ANYTHING ELSE"
- API : ⛔ NE JAMAIS ecrire l'identifiant en dur, l'importer : `from gemini_models import IMAGE_MODEL`
  (defaut **Lite**, 1K MAX) ou `IMAGE_MODEL_HQ` (2K/4K) **uniquement si l'image est PUBLIEE TELLE QUELLE**
  — voir `memory/tools/gemini.md` pour la référence à jour des modèles et l'état des versions.
- Corps : `inline_data` base64, `responseModalities: ["image", "text"]`
- Si 2 images en entree (composition) : reduire via ffmpeg avant envoi pour eviter HTTP 500

## Diversite et representation

### Visages distincts dans les groupes
Gemini genere des visages clones pour les personnages secondaires en arriere-plan (foules, chefs, soldats).
**Why:** Visages identiques = immersion cassee. Constate sur Soundjata et Yaa Asantewaa.
**Apply:**
- Dans tout prompt avec 3+ personnages : "each person has a DISTINCT face -- different ages, facial features, expressions, head shapes. No two faces look alike"
- Si clones quand meme : correction chirurgicale pour varier les visages
- S'applique aux refs Seedance, character sheets, storyboards

### Pas de silhouettes noir pur pour personnages africains
Ne JAMAIS rendre les personnages africains comme des silhouettes noires pures ou seuls les yeux blancs sont visibles.
**Why:** Visuellement caricatural, rappelle des stereotypes racistes historiques (minstrel show).
**Apply:**
- Peau BRUN FONCE visible (pas noir pur) avec traits faciaux dessines (yeux, nez, bouche)
- Dans les prompts : "dark BROWN skin, NOT pure black silhouettes, facial features must be VISIBLE"
- Meme traitement que le personnage principal (cf. character sheet Amanirenas)

## Style vivid shapes

### Vivid shapes scale aux scenes multi-personnages
Le style vivid_shapes fonctionne pour armees, foules, decors -- pas limite au portrait solo.
**Why:** La video Seedance "Amanirenas bataille" prouve le contraire : 30+ guerriers, pyramides, personnage principal devant son armee.
**Apply:**
- Principe contraste detaille/silhouette : heros = le plus detaille (visage, couleurs), secondaires = silhouettes
- Scale comme le contraste chromatique (1 en couleur vs foule en gris)
- Ne pas affirmer que vivid_shapes est limite au portrait sans avoir verifie

## Outils et workflow

### Gemini + REF pour icones, pas Recraft sans Style ID
Pour icones de carte (portraits, batiments, animaux), utiliser Gemini 3.1 Flash avec image de reference.
**Why:** Recraft V3/V4 sans Style ID ignore les codes hex de palette et impose ses propres couleurs. Teste 2x, echec les 2 fois.
**Apply:**
- Charger le REF existant du personnage
- Gemini 3.1 Flash avec "pure white background"
- PIL white-to-transparent pour le detourage
- Garder les credits Recraft pour les vrais assets vectoriels avec Style ID

### Zoom/crop pour review de details fins
Ne pas donner de verdict definitif sur un detail fin (oeil, cicatrice, bijou, texte, expression) sans gros plan.
**Why:** Claude se trompe sur les details dans une image miniature. Un crop zoom permet des verdicts precis.
**Apply:**
- Si incertain sur un detail apres image complete : le dire explicitement
- Demander a Aziz un crop/zoom sur la zone concernee
- Seulement apres avoir vu le zoom : donner un verdict
- Format : "Je voudrais verifier [X] precisement. Peux-tu me faire un crop zoom sur [zone] ?"
