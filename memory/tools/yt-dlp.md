# yt-dlp & tout client HTTPS Python — gotcha IPv6

> ⛔⛔ **RÉFLEXE IMMÉDIAT** : si un script Python de ce projet qui appelle une API externe (Gemini/
> OpenRouter/Kimi/yt-dlp/tout HTTPS) semble "bloqué" sans erreur >30s, c'est CE gotcha en premier —
> ne PAS re-essayer manuellement, ne PAS suspecter le prompt/la clé/le modèle avant d'avoir lu cette
> note. Coût réel de l'avoir oublié : ~40min perdues le 2026-07-18 malgré cette note déjà écrite depuis
> le 2026-07-05. `da-brief.py`/`da-compare.py`/`visual_review.py`/`kimi-video-compare.py` ont maintenant
> le fix EN DUR (import `force_ipv4` natif, plus besoin d'y penser) — mais TOUT NOUVEAU script réseau
> doit importer `scripts/tools/force_ipv4.py` en première ligne dès sa création, pas après coup.

## ⛔ 3 INSTALLATIONS CONCURRENTES SUR CETTE MACHINE — utiliser la bonne

`which -a yt-dlp` renvoie **3 binaires**, de versions DIFFÉRENTES qui glissent dans le temps.

| Chemin | Version **mesurée le 2026-09-07** | Verdict |
|---|---|---|
| `/Library/Frameworks/Python.framework/Versions/3.14/bin/yt-dlp` | **2026.08.19** | ✅ **1er du PATH — c'est celui qu'appelle `yt-dlp` nu** |
| `/opt/homebrew/Caskroom/miniforge/base/bin/yt-dlp` | **2026.08.19** | ✅ à jour aussi |
| `/opt/homebrew/bin/yt-dlp` | 2026.03.17 | ⛔ **PÉRIMÉ → HTTP 403** — et c'est le chemin que citent les règles ! |

⛔⛔ **NE PAS GRAVER UN CHEMIN ABSOLU** : ce tableau a déjà été faux une fois. Au 22/08 le binaire
Python 3.14 était périmé ; un `pip install --upgrade yt-dlp` le 07/09 l'a mis à jour **sans toucher
celui de Homebrew** — inversant le verdict de 2 lignes sur 3. Un chemin absolu fige une installation
qui peut cesser d'être la bonne.
→ **Utiliser `yt-dlp` nu (résolu par le PATH) ou `python3 -m yt_dlp`**, et vérifier par
`for p in $(which -a yt-dlp); do echo -n "$p : "; $p --version; done` en cas de doute.

⚠️ `pip install --upgrade yt-dlp` met à jour **miniforge**, PAS le binaire de `/opt/homebrew/bin/`
que le PATH résout en premier — donc `yt-dlp --version` continue d'afficher l'ancienne après upgrade.

**Symptômes d'une version périmée** (vécu 2026-08-22, 2 tentatives perdues) : `--download-sections`
échoue en `403 Forbidden` puis, en changeant de client, `Only images are available for download`.
Ce n'est PAS le gotcha IPv6 ci-dessous — la requête aboutit, c'est YouTube qui refuse.

**Réflexe** : utiliser le chemin absolu miniforge, ou vérifier `yt-dlp --version` **avant** de
diagnostiquer un échec YouTube. Une version de plus de 90 jours affiche elle-même un avertissement.

## IPv6 mort dans le sandbox -> yt-dlp/Gemini/OpenRouter/tout script Python semble "bloqué" indéfiniment

**Symptôme** : toute requête HTTPS faite par un client Python (`yt-dlp`, `google-genai`, `requests` vers OpenRouter, urllib, http.client) reste bloquée sans erreur ni timeout respecté, alors que `curl` répond en <2s sur la même URL. **Pas spécifique à YouTube** — confirmé aussi sur `generativelanguage.googleapis.com` (Gemini) et `openrouter.ai` (GPT via OpenRouter).

**Root cause** (confirmée 2026-07-05 via systematic-debugging) : `getaddrinfo()` renvoie les adresses IPv6 AVANT les IPv4. La route IPv6 sortante est **totalement morte** dans cet environnement réseau (`networksetup -getinfo Wi-Fi` : "IPv6 IP address: none" — pas juste lente, aucune adresse assignée). Sans fallback rapide type "happy eyeballs" en Python natif, la connexion reste pendue bien au-delà du `timeout=` déclaré. `curl` gère un vrai happy-eyeballs et bascule vite sur IPv4, d'où la différence de comportement.

Preuve : `curl -6 https://<host>` timeout à 10s pile ; `curl -4` répond en <1s. Un monkeypatch de `socket.getaddrinfo` pour ne renvoyer que de l'IPv4 fait passer une requête Python de "bloquée" à <0.1s.

⚠️ **PRÉCISION curl (2026-07-19)** : dans CE sandbox, `curl --force-ipv4` (forme LONGUE) est INCONNUE et renvoie exit 2 (`option --force-ipv4: is unknown`). Utiliser la forme COURTE `curl -4` (et `curl -6` pour tester l'échec IPv6). NB : `--force-ipv4` en forme longue reste valide pour `yt-dlp` — c'est spécifique au binaire `curl` de cet environnement. A fait perdre 2 tentatives sur un `curl` de téléchargement Wikimedia (Acte 5) avant de basculer sur `-4`.

Confirmé à nouveau 2026-07-11 sur `da-brief.py`, le moteur du skill `/last30days` (`scripts/last30days.py`), et des scripts ad hoc de génération/retouche d'images Gemini — le fix `scripts/tools/run_ipv4.py` s'applique universellement, pas seulement aux cas déjà listés.

**⚠️ Récurrence 2026-07-18 (session Soudan Acte 5)** : le même symptôme a refait perdre ~40min sur `da-brief.py --upstream`, `visual_review.py --model kimi/gemini` ET `da-compare.py` — la leçon n'avait PAS été relue avant de relancer ces mêmes scripts (cf [[feedback_relire-lecon-avant-geste-similaire]]). Diagnostic confirmé identique (agent `systematic-debugging` dédié) : socket IPv6 en `SYN_SENT` permanent (0.62s CPU après 12+ min d'attente), curl -4 instantané. `run_ipv4.py` a résolu `da-compare.py` en quelques secondes après avoir bloqué 12+ minutes sans lui. **RÉFLEXE À GRAVER** : dès qu'un script Python fait un appel réseau externe (Gemini/OpenRouter/tout LLM) dans ce projet et semble traîner >30s sans sortie, relancer IMMÉDIATEMENT via `python3 scripts/tools/run_ipv4.py <script.py> <args...>` AVANT de chercher une autre cause (prompt trop long, clé API, bug de code) — c'est presque toujours ça en premier.

## Fix 1 — yt-dlp (a un flag natif)

```bash
yt-dlp --force-ipv4 --dump-json --skip-download "<url>"
yt-dlp --force-ipv4 -f "bv*[height<=720]+ba/best[height<=720]/best" --merge-output-format mp4 -o "%(id)s.%(ext)s" "<url>"
```

**Si un format échoue en 403 malgré --force-ipv4** : ne pas insister sur `-f "best[height<=720]"` fixe (résout parfois vers un stream expiré/bloqué) — relancer avec sélection automatique `-f "bv*[height<=720]+ba/best[height<=720]/best" --merge-output-format mp4`, qui laisse yt-dlp re-négocier les formats disponibles et merge audio+vidéo proprement.

### ⛔⛔ 403 PERSISTANT malgré les 2 fixes ci-dessus → c'est le PLAYER CLIENT (2026-08-18)

**Réflexe n°1 sur un 403 qui résiste : `--extractor-args "youtube:player_client=android"`** (ou `mweb`). Le client par défaut de yt-dlp (`android vr`) est rejeté côté Google.

```bash
yt-dlp --force-ipv4 --extractor-args "youtube:player_client=android" \
  -f "bv*[height<=720]+ba/best[height<=720]/best" --merge-output-format mp4 \
  -o "%(id)s.%(ext)s" "<url>"
```

Test A/B qui isole la cause (mesuré, pas supposé) : `android` → **200** · `mweb` → **200** · `android vr` (défaut) → **403**.

- ⛔ **Mettre yt-dlp à jour ne corrige PAS ce cas** — vérifié en installant la 2026.07.04 à côté : échec identique avec le client par défaut. Ne pas perdre de temps sur `pip install -U`.
- ⛔ **Ce n'est PAS le gotcha IPv6** documenté plus haut : celui-ci se manifeste par un blocage SANS erreur (>30s), alors qu'un 403 est une réponse serveur immédiate. Vérifier `curl -6` avant d'invoquer IPv6 — il était vivant le jour du diagnostic.
- ⛔ `player_client=web,tv` → "The page needs to be reloaded". Ne pas retenter ces deux-là.
- Diagnostic décisif si doute : `--get-url` puis tester l'URL avec `curl` seul. Si curl renvoie 403, le problème est l'URL signée par le client, pas le downloader.

**⚠️ Plafond 360p** : sans PO Token, `android` comme `mweb` retombent sur le format 18 (640×360), même avec un yt-dlp à jour. Suffisant pour juger composition/rythme/montage — ⛔ **jamais pour juger la netteté ou la texture** (cf. règle « netteté = full HD only »). Pour du 720p+ : PO Token ou `--cookies-from-browser`.

**Gotcha extraction de frames** : une frame noire n'est pas forcément un bug — ça peut être un vrai fondu au noir de la vidéo. Sonder seconde par seconde autour du timecode AVANT de conclure à un échec d'extraction, puis resampler à côté.

## Fix 2 — tout autre script Python (gemini-vision-breakdown.py, openrouter-*.py, etc.)

Ces scripts n'ont pas de flag IPv4 natif. Ne PAS modifier le script source (partagé par d'autres workflows) — l'exécuter via un wrapper qui monkeypatch `socket.getaddrinfo` avant de lancer le script cible.

**Wrapper permanent : `scripts/tools/run_ipv4.py`** (plus besoin de le recréer en scratchpad — il est maintenant versionné dans le projet).

Usage : `python3 scripts/tools/run_ipv4.py scripts/tools/gemini-vision-breakdown.py --image ... --prompt-file ... --output ...`

(Un fichier `.pth` dans un dossier arbitraire ajouté à `PYTHONPATH` NE fonctionne PAS pour ça — les `.pth` ne s'exécutent que scannés depuis un vrai `site-packages`. Le wrapper `runpy` est la méthode qui marche.)

**Ne PAS** : changer d'interpréteur Python, suspecter un throttling anti-bot ou une clé API invalide, ou conclure à une limitation d'environnement non contournable AVANT d'avoir testé `curl -6` vs `curl -4` sur le host concerné — ce test isole la cause en 20 secondes. Si un script Python "traîne" sans output ni erreur sur N'IMPORTE QUEL appel réseau externe dans ce projet, suspecter CE gotcha en premier.

## Gotcha 429 sur les SOUS-TITRES (2026-08-28) — le contournement est TubeLab, pas une variante yt-dlp

`--write-auto-sub` / `--write-sub` renvoient **HTTP 429 Too Many Requests** sur la piste de
sous-titres alors que la video elle-meme se resout. Change de client n'y fait rien : `android`
echoue pareil, et `player_client=web,tv` renvoie « The page needs to be reloaded » (deja documente
plus haut — **je l'ai retente quand meme, ne pas refaire**).

⭐ **Contournement qui marche : le MCP TubeLab** (`get_video_transcript` + `get_video`). Il rend le
transcript complet ET les metadonnees (titre, chaine, date, vues, description — la description sert
a peser le BIAIS de la source : ce que la chaine vend).
⚠️ Le transcript revient souvent **trop gros** et est sauve dans un fichier dont les lignes sont
trop longues pour `Read` → le lire par tranches en python (`open(f).read()[A:B]`), jamais avec Read.

⛔ **Regle des 2 echecs appliquee** : 2 tentatives yt-dlp infructueuses = changer d'OUTIL, pas
essayer un 3e flag.

## ⛔⛔ 2026-09-07 — LE BINAIRE HOMEBREW EST PERIME, CELUI DU PATH EST A JOUR

Un **403 Forbidden** sur toute extraction YouTube (liste, telechargement, avec ou sans
`--download-sections`) a bloque 2 tentatives. Cause : **yt-dlp trop vieux** — installe
2026.03.17 alors que pip proposait 2026.08.19 (5 mois de retard). YouTube casse
regulierement les vieux clients ; c'est la 1re chose a verifier sur un 403.

**Fix** : `python3 -m pip install --upgrade yt-dlp` → 403 resolu immediatement.

⛔ **PIEGE A CONNAITRE** : apres cette mise a jour, `/opt/homebrew/bin/yt-dlp --version`
affiche TOUJOURS l'ancienne version (2026.03.17) — c'est une installation Homebrew
SEPAREE que pip ne touche pas. Le binaire reellement utilise par `yt-dlp` nu est celui du
PATH (`/Library/Frameworks/Python.framework/Versions/3.14/bin/yt-dlp`), lui a jour.
→ La regle du CLAUDE.md global qui pointe sur `/opt/homebrew/bin/yt-dlp` designe donc le
binaire PERIME. Utiliser `yt-dlp` nu (PATH) ou `python3 -m yt_dlp`.
→ Verifier avec `which -a yt-dlp` en cas de doute, jamais un seul chemin.

**Extrait video SANS SON** (cas client : voir un overlay sur le vrai plateau) :
```bash
yt-dlp -f "bestvideo[height<=1080][ext=mp4]" \
  --download-sections "*00:02:00-00:02:30" --force-keyframes-at-cuts \
  -o "extrait.%(ext)s" "https://www.youtube.com/watch?v=<ID>"
```
`bestvideo` seul = aucune piste audio, rien a demuxer ensuite.
