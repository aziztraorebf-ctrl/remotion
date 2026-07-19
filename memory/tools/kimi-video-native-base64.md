---
name: kimi-video-native-base64
description: Kimi K2.5 accepte l'input vidéo natif via API Moonshot directe, base64 uniquement (liens HTTP publics refusés), temperature=1 imposée
metadata:
  type: reference
---

Découvert/validé 2026-07-18 (session Soudan Acte 5) : contrairement à `da-compare.py` (Gemini, upload
Files API + `file_uri`), aucun équivalent Kimi n'existait dans ce repo avant cette session — vérifié
par agent Explore, jamais tenté (seul un script archivé remplacé avait le champ `video_url` en théorie,
jamais confirmé fonctionnel).

**Ce qui NE marche PAS** : passer un lien HTTP public (catbox/uguu/litterbox) dans `video_url.url`, que
ce soit via OpenRouter (`404 No endpoints found that support input video`, testé sur `kimi-k2.5` ET
`kimi-k3`) ou via l'API Moonshot native directe (`400 unsupported video url`). Confirmé par web search :
Kimi/Moonshot n'accepte QUE base64 (`data:video/mp4;base64,...`) ou un fichier pré-uploadé référencé en
`ms://file_id` — jamais une URL HTTP arbitraire.

**Ce qui MARCHE** : API Moonshot native (`https://api.moonshot.ai/v1/chat/completions`, PAS OpenRouter),
vidéo encodée en base64 direct dans le payload JSON (`{"type": "video_url", "video_url": {"url":
"data:video/mp4;base64,<...>"}}`). Testé avec succès sur une vidéo 2.6 Mo (720p downscalée) → payload
base64 ~3.4 Mo, largement dans les limites. Kimi lit correctement le contenu temporel (timestamps de
scènes cités dans sa réponse, ex. "00:00-00:05... 00:43-00:52").

**Piège trouvé en cours de route** : Kimi K2.5 rejette toute `temperature` autre que `1`
(`400 invalid temperature: only 1 is allowed for this model`) — cohérent avec `visual_review.py` qui
utilise déjà `'temperature': 1` en dur (L468), mais pas documenté ailleurs. TOUJOURS `temperature: 1`
sur ce modèle, jamais 0.3/0.5 comme sur Gemini.

**⚠️ Piège IPv6 (cf [[yt-dlp]])** : comme tout script Python de ce projet appelant une API externe,
LANCER OBLIGATOIREMENT via `python3 scripts/tools/run_ipv4.py <script.py> <args>` — sans ça, blocage
indéfini identique au symptôme déjà documenté.

**Outil créé** : `scripts/tools/kimi-video-compare.py` — équivalent de `da-compare.py` mais pour Kimi
K2.5 (2 vidéos complètes en base64, même gabarit de question comparatif ref/nouveau). Downscaler les
vidéos AVANT appel (720p CRF~28) — le base64 gonfle la taille de ~33%, un payload full-HD serait
disproportionné.

**Usage recommandé** : lancer Gemini (`da-compare.py`) ET Kimi (`kimi-video-compare.py`) sur la même
paire ref/nouveau pour un signal double indépendant, cohérent avec la doctrine DA-BRIEF-GATE (convergence
= haute confiance, divergence = signal à creuser). Coût Kimi natif à surveiller (pas mesuré précisément
cette session, mais raisonnable sur un test isolé).
