# yt-dlp & tout client HTTPS Python — gotcha IPv6

> ⛔⛔ **RÉFLEXE IMMÉDIAT** : si un script Python de ce projet qui appelle une API externe (Gemini/
> OpenRouter/Kimi/yt-dlp/tout HTTPS) semble "bloqué" sans erreur >30s, c'est CE gotcha en premier —
> ne PAS re-essayer manuellement, ne PAS suspecter le prompt/la clé/le modèle avant d'avoir lu cette
> note. Coût réel de l'avoir oublié : ~40min perdues le 2026-07-18 malgré cette note déjà écrite depuis
> le 2026-07-05. `da-brief.py`/`da-compare.py`/`visual_review.py`/`kimi-video-compare.py` ont maintenant
> le fix EN DUR (import `force_ipv4` natif, plus besoin d'y penser) — mais TOUT NOUVEAU script réseau
> doit importer `scripts/tools/force_ipv4.py` en première ligne dès sa création, pas après coup.

## IPv6 mort dans le sandbox -> yt-dlp/Gemini/OpenRouter/tout script Python semble "bloqué" indéfiniment

**Symptôme** : toute requête HTTPS faite par un client Python (`yt-dlp`, `google-genai`, `requests` vers OpenRouter, urllib, http.client) reste bloquée sans erreur ni timeout respecté, alors que `curl` répond en <2s sur la même URL. **Pas spécifique à YouTube** — confirmé aussi sur `generativelanguage.googleapis.com` (Gemini) et `openrouter.ai` (GPT via OpenRouter).

**Root cause** (confirmée 2026-07-05 via systematic-debugging) : `getaddrinfo()` renvoie les adresses IPv6 AVANT les IPv4. La route IPv6 sortante est **totalement morte** dans cet environnement réseau (`networksetup -getinfo Wi-Fi` : "IPv6 IP address: none" — pas juste lente, aucune adresse assignée). Sans fallback rapide type "happy eyeballs" en Python natif, la connexion reste pendue bien au-delà du `timeout=` déclaré. `curl` gère un vrai happy-eyeballs et bascule vite sur IPv4, d'où la différence de comportement.

Preuve : `curl -6 https://<host>` timeout à 10s pile ; `curl -4` répond en <1s. Un monkeypatch de `socket.getaddrinfo` pour ne renvoyer que de l'IPv4 fait passer une requête Python de "bloquée" à <0.1s.

Confirmé à nouveau 2026-07-11 sur `da-brief.py`, le moteur du skill `/last30days` (`scripts/last30days.py`), et des scripts ad hoc de génération/retouche d'images Gemini — le fix `scripts/tools/run_ipv4.py` s'applique universellement, pas seulement aux cas déjà listés.

**⚠️ Récurrence 2026-07-18 (session Soudan Acte 5)** : le même symptôme a refait perdre ~40min sur `da-brief.py --upstream`, `visual_review.py --model kimi/gemini` ET `da-compare.py` — la leçon n'avait PAS été relue avant de relancer ces mêmes scripts (cf [[feedback_relire-lecon-avant-geste-similaire]]). Diagnostic confirmé identique (agent `systematic-debugging` dédié) : socket IPv6 en `SYN_SENT` permanent (0.62s CPU après 12+ min d'attente), curl -4 instantané. `run_ipv4.py` a résolu `da-compare.py` en quelques secondes après avoir bloqué 12+ minutes sans lui. **RÉFLEXE À GRAVER** : dès qu'un script Python fait un appel réseau externe (Gemini/OpenRouter/tout LLM) dans ce projet et semble traîner >30s sans sortie, relancer IMMÉDIATEMENT via `python3 scripts/tools/run_ipv4.py <script.py> <args...>` AVANT de chercher une autre cause (prompt trop long, clé API, bug de code) — c'est presque toujours ça en premier.

## Fix 1 — yt-dlp (a un flag natif)

```bash
yt-dlp --force-ipv4 --dump-json --skip-download "<url>"
yt-dlp --force-ipv4 -f "bv*[height<=720]+ba/best[height<=720]/best" --merge-output-format mp4 -o "%(id)s.%(ext)s" "<url>"
```

**Si un format échoue en 403 malgré --force-ipv4** : ne pas insister sur `-f "best[height<=720]"` fixe (résout parfois vers un stream expiré/bloqué) — relancer avec sélection automatique `-f "bv*[height<=720]+ba/best[height<=720]/best" --merge-output-format mp4`, qui laisse yt-dlp re-négocier les formats disponibles et merge audio+vidéo proprement.

## Fix 2 — tout autre script Python (gemini-vision-breakdown.py, openrouter-*.py, etc.)

Ces scripts n'ont pas de flag IPv4 natif. Ne PAS modifier le script source (partagé par d'autres workflows) — l'exécuter via un wrapper qui monkeypatch `socket.getaddrinfo` avant de lancer le script cible.

**Wrapper permanent : `scripts/tools/run_ipv4.py`** (plus besoin de le recréer en scratchpad — il est maintenant versionné dans le projet).

Usage : `python3 scripts/tools/run_ipv4.py scripts/tools/gemini-vision-breakdown.py --image ... --prompt-file ... --output ...`

(Un fichier `.pth` dans un dossier arbitraire ajouté à `PYTHONPATH` NE fonctionne PAS pour ça — les `.pth` ne s'exécutent que scannés depuis un vrai `site-packages`. Le wrapper `runpy` est la méthode qui marche.)

**Ne PAS** : changer d'interpréteur Python, suspecter un throttling anti-bot ou une clé API invalide, ou conclure à une limitation d'environnement non contournable AVANT d'avoir testé `curl -6` vs `curl -4` sur le host concerné — ce test isole la cause en 20 secondes. Si un script Python "traîne" sans output ni erreur sur N'IMPORTE QUEL appel réseau externe dans ce projet, suspecter CE gotcha en premier.
