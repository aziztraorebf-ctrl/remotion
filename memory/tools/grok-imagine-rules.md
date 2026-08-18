# Grok Imagine Video 1.5 — Regles de Prompt & Gotchas

> ⚠️ **CETTE FICHE NE COUVRE QUE LA VIDÉO** (`grok-imagine-video*`). Grok génère AUSSI des
> **IMAGES** — 3 modèles, endpoint `/v1/images/generations`, 0,02-0,05 $/image. On l'a ignoré
> pendant des mois et Grok était exclu de nos storyboards pour rien. Détail, prix et
> comparatif vs GPT-image : `memory/tools/grok.md` § « Grok GÉNÈRE DES IMAGES ».
> Consulter AVANT d'ecrire un prompt Grok Imagine. Regles marquees [PROUVE] = nos tests API du 2026-07-04.
> Regles marquees [RAPPORTE] = recherche Tavily/communaute, non teste par nous — verifier avant de s'y fier a 100%.
> Mise a jour : 2026-07-04 (session R&D pecheur, 4 tests API + recherche approfondie)

---

## Contexte & identite du modele

- **xAI, PAS Groq** (l'entreprise de puces LPU). Confusion frequente Aziz/Claude — verifier le nom avant tout appel.
- Modele testable : `grok-imagine-video-1.5` (API) — le meilleur en qualite/benchmarks (top leaderboard Arena +52 Elo vs v1.0).
- Ancien modele : `grok-imagine-video` (sans version) — qualite de style INFERIEURE mais seul a supporter Video Extension (voir plus bas).
- Moteur sous-jacent : Aurora (autoregressif, traite chaque frame en fonction de la precedente).

---

## Regles PROUVEES par nos tests (2026-07-04, cas pecheur pirogue)

### R1 — Image de depart = contrat strict, pas suggestion [PROUVE]
Tout objet qui doit apparaitre dans l'action DOIT deja etre visible dans l'image de depart. Grok Imagine n'est PAS un simulateur physique — c'est un moteur de continuite visuelle qui anime ce qu'il voit et **invente** ce qu'il ne voit pas.
- Echec v1 : prompt demandait "il lance le filet" alors que l'image de depart ne montrait pas de filet en main → Grok a fait apparaitre le filet de nulle part au moment du lancer.
- Fix v3 : generer une image intermediaire (via Gemini i2i) montrant le filet DEJA en main avant de demander l'action de lancer → plus d'hallucination d'objet.
- **Corollaire** : avant d'ecrire le prompt, lister precisement ce qui est visible dans l'image source. Ne jamais decrire une action sur un objet absent de l'image.

### R2 — Anti-duplication d'objet = clause explicite obligatoire [PROUVE]
Sans instruction explicite, Grok Imagine duplique les objets secondaires (paniers, caisses) au lieu de reutiliser celui deja present dans l'image.
- Echec v1/v2 partiel : 2 paniers visibles au lieu d'1 seul (image source n'en montrait qu'un).
- Fix : ajouter une clause STRICT ANTI-DUPLICATION explicite : *"There is only ever ONE [objet] in the scene, already [etat] at the start, exactly where shown in the source image. Do not add a second [objet]. Do not duplicate any object already present."*
- Meme avec la clause, un run tardif (v3 complet) a quand meme montre le panier redevenir plus gros/centre — la clause reduit le risque mais ne l'elimine pas a 100% sur un clip long (10s+).

### R3 — Un seul beat par clip > sequence multi-actions empilee [PROUVE]
La doc officielle recommande "one action per clip" — confirme par nos tests. Un prompt qui empile 5 actions distinctes (lancer, ramener, tourner, poser, regarder) sur 10s cumule les risques d'artefacts (morphing, duplication, apparition d'objets).
- v2 (1 seul beat isole : pose+redressement+regard, 6s) = zero morphing visage, zero duplication.
- v3 (sequence complete, 10s, mais point de depart deja verrouille) = meilleur resultat global, mais raccord/detail encore imparfait (poisson pas clairement depose).

### R4 — Cue audio pendant rotation = stabilise le visage [PROUVE]
Ajouter un cue audio continu ("Sound: gentle water lapping... continuous through the turn to help anchor the face") pendant un moment de rotation/transition reduit visiblement le morphing du visage par rapport a un prompt sans cue audio.
- v1 (sans cue) : morphing visible pendant la rotation (~0.5s).
- v2/v3 (avec cue) : visage stable, memes traits reconnaissables sur toute la sequence.

### R5 — Repartir d'une frame extraite = risque d'etat deja errone [PROUVE]
Si on extrait une frame d'un clip precedent pour servir de nouvelle image de depart, verifier qu'elle ne contient pas deja l'artefact qu'on essaie de corriger. Un panier duplique dans le clip source restera duplique dans la frame extraite.
- Erreur commise : v2 est reparti d'une frame du v1 (deja affectee par la duplication) au lieu de l'image source originale — a masque le vrai probleme un temps.
- Fix : toujours repartir de l'image source originale ou d'une image regeneree proprement (Gemini i2i), jamais d'une frame de clip potentiellement deja corrompue.

### R6 — Video Extension (`/v1/videos/extensions`) NE fonctionne PAS sur `grok-imagine-video-1.5` [PROUVE]
Erreur API directe et explicite : `"Video extension is not supported for this model."` (HTTP 400). Extension disponible UNIQUEMENT sur l'ancien modele `grok-imagine-video`.
- Teste avec l'ancien modele : soumission reussie (200 OK) mais **2 echecs consecutifs** avec `internal_error` pendant le rendu — instabilite serveur confirmee, pas un probleme de payload.
- Qualite de style de l'ancien modele : nettement inferieure a 1.5 (trait plus epais/texture, derive vers un rendu moins "encre plate fine").
- **Conclusion** : Video Extension via API = a eviter pour l'instant (qualite degradee + instabilite serveur constatee 2x).

### R7 — Clips independants juxtaposes (sans Extension) = raccord visible [PROUVE]
Generer 2 clips independants sur `grok-imagine-video-1.5` (chacun avec sa propre image de depart verrouillee) puis les juxtaposer par simple concat ffmpeg produit un raccord brutal :
- Saut de posture net (ex: penche en avant → debout droit sans transition)
- Le panier peut re-deriver de taille/position d'un clip a l'autre MEME avec la clause anti-duplication (R2) appliquee aux deux clips separement.
- **Conclusion** : verrouiller l'image de depart par clip ne suffit pas a garantir la coherence INTER-clips. Le probleme de derive n'est pas seulement "objet qui apparait/disparait dans un clip" (R1/R2) mais aussi "objet qui change entre deux generations meme avec image de reference identique".

### R8 — Le SDK Python `google-genai` peut hang silencieusement sur les appels image (Gemini, pas Grok) [PROUVE]
Observe sur `google-genai==1.63.0` : `client.models.generate_content(...)` peut bloquer indefiniment sans exception ni timeout sur un appel i2i avec image de reference, alors que le MEME prompt via l'API REST brute (`requests.post`) repond normalement en quelques secondes a quelques dizaines de secondes.
- Contournement : appeler l'API REST Gemini directement avec `requests` au lieu du SDK. Voir `memory/tools/gemini.md` pour le detail technique.
- Ce meme pattern de hang a ete observe aussi sur les appels `requests.post`/`urllib.request.urlretrieve` vers l'API xAI dans certains scripts Python (pas systematique, cause non identifiee avec certitude — possiblement environnement/reseau local). Contournement de secours : soumettre/poller/telecharger directement via `curl` en Bash plutot que via un script Python qui semble bloque.

---

## Regles RAPPORTEES par la recherche (Tavily, non testees par nous)

### R9 — Structure de prompt recommandee [RAPPORTE]
Camera (type de plan + mouvement) → Action (sujet + verbe) → Style/eclairage → Audio (dialogue entre guillemets pour lip-sync). Les 20-30 premiers mots pesent le plus lourd — front-loader l'action principale.

### R10 — Marqueurs de timestamp pour sequences multi-actions [RAPPORTE]
`[00:00]`, `[00:04]`, `[00:08]` dans le prompt pour caler des actions dans le temps sur un clip long. Non teste par nous (nos tests utilisaient un seul beat par clip, cf R3).

### R11 — Cues "cut to" / "camera switch" pour multi-plans dans un seul prompt [RAPPORTE]
Permettrait de simuler des coupes de plan a l'interieur d'un seul appel de generation. Non teste par nous.

### R12 — Negative prompting = phrasing inline uniquement [RAPPORTE]
Grok Imagine n'a pas de champ negative-prompt dedie (contrairement a Stable Diffusion). Tout se fait par phrasing positif/soustractif dans le prompt principal : "no extra objects", "without altering X", "ensuring no artifacts". Confirme indirectement par R2 (notre clause anti-duplication est bien de ce type).

### R13 — Multi-image storyboard (`@image1`/`@image2`, jusqu'a 7 images) — APP UNIQUEMENT, non confirme sur l'API [RAPPORTE]
Plusieurs sources confirment l'existence de ce mode dans l'app/UI grand public (grok.com/imagine, iOS/Android), permettant de referencer plusieurs images uploadees avec des tags `@image1`, `@image2` dans le prompt pour construire un vrai storyboard multi-shot.
- **Non confirme sur l'API `grok-imagine-video-1.5`** que nous avons testee — la doc API officielle ne documente qu'un seul champ `image` (ou `image_urls` limite a l'edition d'image, pas de generation video).
- C'est la piste la plus prometteuse a tester en priorite une fois l'abonnement app pris (voir `memory/checklists/GROK-IMAGINE.md` § Protocole de test app).

### R14 — Extend from Frame dans l'app = plus fiable que via API [RAPPORTE, a verifier]
Guides communautaires (dont un post Reddit "ZERO Drift") revendiquent un chainage fiable de clips 6-10s jusqu'a 30s via le bouton natif "Extend from Frame" dans l'app — contrairement aux 2 echecs `internal_error` obtenus via l'API. Non confirme par une comparaison directe et chiffree — un fil Reddit independant note aussi une qualite de mouvement decevante. **A tester concretement.**
- Mecanisme reel des "30 secondes" vus dans l'app : PAS un seul clip genere d'un coup, mais le resultat CUMULE d'extensions chainees (max 30s par chaine, puis il faut sauvegarder manuellement la derniere frame et recommencer une nouvelle chaine pour aller plus loin).

### R15 — Limites reelles de l'app vs chiffres marketing [RAPPORTE]
Chiffres officiels annonces (100-500 videos/jour selon le tier) tres superieurs a l'usage reel observe par la communaute : 10-20 clips 720p/jour en pratique avant throttling par un "fair use algorithm" non documente. Un post r/grok concret : "Video limits today: 26 - 480p 10s and 18 - 720p 10s."

---

## Anti-instructions (dire ce qu'on ne veut PAS) — testees ou deduites

- **"Do not add a second [objet]. Do not duplicate any object already present in the boat."** [PROUVE efficace, R2]
- **"Face must not distort or morph during the turn."** [PROUVE efficace en complement du cue audio, R4]
- **"Camera holds completely steady, no rotation, no zoom, minimal handheld sway only."** — reduit le risque de derive pendant les mouvements de rotation [PROUVE]
- **"No text, no banners, no signs, no writing visible anywhere. No music, no dialogue, no dust motes, no floating particles, no extra characters, no extra objects."** — anti-parasites generaux, repris du pattern Seedance (R5 Seedance), pas invalide par nos tests mais pas isole non plus.

---

## Comparaison Grok Imagine 1.5 vs Seedance 2.0 (donnees mixtes prouve/rapporte)

| Critere | Grok Imagine 1.5 | Seedance 2.0 | Source |
|---|---|---|---|
| Cout (10s, 720p) | **$1.40** | $6.83 (1080p) | [PROUVE, nos 2 tests] |
| Temps de generation | **~60-70s** | Plusieurs minutes | [PROUVE] |
| Resolution max | 720p | 1080p | [PROUVE via doc + test] |
| Audio natif inclus | **Oui** (gratuit) | Non (teste sans, `generate_audio: False`) | [PROUVE] |
| Fiabilite sur prompts complexes/multi-shot | Inferieure (15/20 sur test tiers) | Superieure (20/20 sur meme test tiers) | [RAPPORTE, Vidguru] |
| Duplication/hallucination d'objets | Probleme confirme, mitigeable par prompt (R1/R2) mais pas eliminable a 100% sur clip long | Non teste par nous sur ce cas precis | [PROUVE pour Grok, silence pour Seedance] |
| Multi-reference (images/video/audio) | Non confirme sur l'API (max 1 image) | Jusqu'a 9 images + 3 videos + 3 audios (Omni) | [PROUVE Seedance via `seedance-rules.md` R58/59, non confirme API Grok] |
| Storyboard multi-image natif | Existe dans l'app (non confirme API) | N/A (usage different) | [RAPPORTE] |
| Video Extension | Cassee sur 1.5, instable sur l'ancien modele | `reference-to-video` valide et documente comme fiable | [PROUVE Grok, R89-92 Seedance] |

**Verdict pratique pour un plan simple, personnage figure, un seul beat** : Grok Imagine 1.5 est un choix serieux et nettement moins cher. **Pour une sequence longue ou multi-shot avec objets manipules**, Seedance 2.0 reste la valeur sure a ce stade — Grok Imagine n'a pas encore prouve sa fiabilite sur ce type de plan via l'API.
