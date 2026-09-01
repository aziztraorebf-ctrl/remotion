---
name: upload-hosts-fallback
description: "Ordre de priorité hosts d'upload renders MP4/PNG — catbox permanent, Imgur fallback, Litterbox éviter"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 58bb7ab7-996e-4406-bbc4-e835dc0f158d
  modified: 2026-08-17T20:38:18.413Z
---

## ⭐⭐⭐⭐ MISE À JOUR 2026-08-27 — ARTIFACT EST LE DÉFAUT, PLUS UN RECOURS (décision d'Aziz)

**Tout ce qui suit est SUBORDONNÉ à cette section.** Le workflow a changé : l'Artifact Claude fait
partie de l'environnement, je le crée et le **mets à jour moi-même** (même URL redéployée), sans
script, sans hôte externe, sans mode de panne réseau. Il couvre **images, pages HTML ET vidéos**
tant que la page tient sous **16 Mo**.

| Besoin | Où |
|---|---|
| **Image, planche, comparatif** | ⭐ **Artifact** |
| **Page HTML riche** | ⭐ **Artifact** (here.now n'est plus nécessaire) |
| **Vidéo compressible < 16 Mo** | ⭐ **Artifact** — nos beats font **2,4 Mo de médiane** (mesuré 27/08 : 60 rendus, 100 % sous 16 Mo) |
| **Rendu full HD > 16 Mo** | **Vercel Blob** (`scripts/tools/upload-to-blob.py`) — nos assemblages font 230-400 Mo |
| **Blob HS / hors quota** | catbox → Litterbox |
| **Artifact HS** (image ou vidéo) | catbox → Litterbox |

### ⛔⛔ UN ARTIFACT NE CHARGE RIEN DEPUIS L'EXTÉRIEUR — le VÉRIFIER avant de donner le lien

**Payé le 2026-08-30.** Publié une page Lottie dont l'animation était servie depuis Vercel Blob
(CORS ouvert, `content-length` vérifié, fichier accessible au `curl`). Aziz n'a vu qu'un **carré
beige vide** : le CSP de l'artifact bloque TOUTE requête vers un hôte externe — `fetch`, XHR,
CDN, y compris une URL qu'on vient de tester à la main. La règle était écrite et je l'avais sous
les yeux.

⭐ **Le test qui l'aurait attrapé, 20 secondes** — rendre la page dans Chromium en coupant le
réseau, exactement comme le fait un artifact :
```python
pg.route("**://**", lambda r: r.abort())     # comme un artifact : rien d'externe
pg.set_content(page.read_text(), wait_until="load")
pg.wait_for_timeout(2000)
n = pg.evaluate("document.querySelectorAll('#scene svg path').length")   # 0 = page morte
```
⛔ **Ne jamais donner le lien d'un artifact sans avoir vu son contenu se rendre hors ligne.**
Vérifier que la source répond ne prouve RIEN : c'est la page qui n'a pas le droit d'y accéder.
→ Tout embarquer dans le fichier (lecteur JS + données), y compris ce qui semble « juste un
chargement ». Une page de 650 Ko passe sans problème (plafond 16 Mo).

⭐⭐ **UNE PAGE PAR SUJET, PAS UN LIEN PAR LIVRABLE.** Dès qu'un sujet implique des images (nouvelle
vidéo, reverse engineering, comparatif), créer SA page et l'enrichir toute la session.
⛔ **Le lien vit dans le STARTER de reprise du sujet, JAMAIS dans `MEMORY.md`** — des dizaines d'URL
y engorgeraient la mémoire active, qui est déjà sous plafond dur (25 Ko).

⚠️ Ce qui reste valide de tout ce qui suit : les **gotchas de fiabilité** des hôtes externes, quand
on y tombe (catbox = HTTP 200 + `content-length: 0` silencieux → toujours vérifier ; uguu ~3 h ;
Litterbox 72 h ; tmpfiles illisible sur mobile).

---

## ⭐⭐⭐ MISE À JOUR 2026-08-17/18 — LES ARTIFACTS CLAUDE PASSENT DEVANT POUR LES IMAGES

**Vécu la nuit du 2026-08-17 : catbox, Litterbox ET 0x0.st ont échoué COUP SUR COUP**, sur des
fichiers de 100 Ko à 1,7 Mo. Symptômes : catbox renvoie une URL valide avec `content-length: 0`
(le faux succès déjà connu), Litterbox répond HTTP 500, 0x0 refuse. Aucun repli ne restait.
Compresser en JPEG (1,7 Mo → 120 Ko) n'a rien changé : ce n'était pas la taille.

→ **Pour montrer des IMAGES à Aziz (storyboards, planches, comparatifs, frames) : publier un
ARTIFACT Claude** avec les images encodées en `data:` URI dans le HTML. Aucun hôte externe, donc
aucun de ces modes de panne. **Aziz l'ouvre sur mobile**, ce que le canal direct ne permet pas.

```python
# encoder chaque image, viser < 16 Mo de page au total
im = Image.open(f).convert("RGB"); im.thumbnail((1200,1200), Image.LANCZOS)
b64 = base64.b64encode(buf.getvalue()).decode()   # -> <img src="data:image/jpeg;base64,{b64}">
```
Repères mesurés : 8 planches 1200 px en JPEG q82 ≈ 594 Ko de base64 — très loin de la limite.

⚠️ **Bornes de l'artifact** : 16 Mo par page → **ne convient PAS aux MP4** (l'Acte 5 seul fait
10 Mo, un assemblage complet dépasse). La vidéo reste sur **Vercel Blob**.
⚠️ Redéployer le MÊME chemin de fichier garde la MÊME URL — pratique pour enrichir une page déjà
envoyée (fait ce soir : 4 planches puis 8, un seul lien).

**Ordre à jour :**

| Type | Où |
|---|---|
| **MP4 / rendu vidéo** | **Vercel Blob** (`scripts/tools/upload-to-blob.py`) |
| **Image / planche / comparatif** | **⭐ Artifact Claude** (data: URI) → puis catbox → Imgur → uguu |
| **Page HTML riche** | **⭐ Artifact Claude** (remplace here.now dans la plupart des cas) |

## ⛔⛔ MISE À JOUR 2026-08-17 — VERCEL BLOB RÉSERVÉ AUX MP4 (quota à 75 %). Lire AVANT le reste.

**Décision d'Aziz 2026-08-17.** Le plan gratuit Vercel Blob est à **75 % de sa limite mensuelle**
parce qu'on y a mis « tout et n'importe quoi ». Nouvel ordre, qui prime sur tout ce qui suit :

| Type | Où |
|---|---|
| **MP4 / rendu vidéo** | **Vercel Blob** (`scripts/tools/upload-to-blob.py`) — réservé à ça |
| **Image (PNG/JPG)** | **catbox → Imgur → uguu → Litterbox** (ordre CLAUDE.md, jamais périmé) |
| **Page HTML** | **here.now** — ni Blob ni catbox (les deux cassent le HTML, confirmé 2×) |

⛔ Les sections ci-dessous qui disent « Vercel Blob par défaut MÊME pour un proto R&D » ou « MP4/PNG
indifféremment » sont **PÉRIMÉES sur ce point**. Ce qu'elles gardent de valide : les gotchas de
fiabilité (catbox renvoie HTTP 200 + `content-length: 0` silencieux → **toujours vérifier
`curl -sI <url> | grep content-length`**), uguu ~3 h de rétention, Litterbox 72 h, tmpfiles illisible sur mobile.

⭐ **Le raisonnement qui survivra au quota** : le choix d'hôte dépend de DEUX axes, pas un — la
FIABILITÉ (ce que ce feedback couvrait) **et le COÛT/QUOTA d'une ressource limitée**. Un défaut
universel est confortable jusqu'au jour où la ressource sature, et elle sature en silence.

---

## ⭐ MISE À JOUR 2026-07-18 — Vercel Blob AUSSI pour les protos R&D + Aziz sur MOBILE

**Friction vécue (R&D D3 16:9)** : galéré 4+ allers-retours sur uguu/catbox/litterbox/tmpfiles pour
présenter des protos à Aziz **sur mobile**, alors que `scripts/tools/upload-to-blob.py` (Vercel Blob,
durable) etait deja documente ci-dessous et JAMAIS relu avant d'improviser. Leçon : **relire CE fichier
AVANT le 1er upload de session**, pas apres avoir enchaine les hotes qui echouent.

**Contraintes MOBILE (Aziz regarde souvent en differe)** :
- **uguu.se expire TROP VITE** (~48h max, souvent moins) → Aziz revient dessus quelques heures plus tard et
  le lien est mort. Inutilisable meme pour un proto qu'il ne regarde pas immediatement. Prevenir "regarde
  vite" si on doit s'en servir en secours.
- **tmpfiles.org = PIEGE mobile** : le lien direct `/dl/` redirige (302), et la page de lecture exige un
  telechargement VPN pour lire la video sur mobile → inutilisable pour Aziz. NE PAS proposer tmpfiles.
- **Vercel Blob = le bon defaut MEME pour un proto R&D jetable** si Aziz doit le regarder en differe sur
  mobile (lien stable, lecture directe). Le surcout est nul, la fiabilite vaut l'aller-retour evite.
- Le fichier reste TOUJOURS en local (`SendUserFile` marche en desktop mais Aziz mobile ne lit pas les mp4
  inline → il lui faut un LIEN, d'ou l'importance d'un hote fiable des le 1er upload).

---

## ⭐ MISE À JOUR 2026-07-17 — Vercel Blob = MEILLEUR choix pour un LIVRABLE (durable, fiable)

**Constaté ce jour** : catbox toujours down (HTTP 200 + `content-length:0` même sur un fichier texte de
5 octets = infra cassée côté serveur, pas nous) ; **uguu.se expire vite (~3h dans ce cas, PAS 72h)** —
inutilisable pour un livrable qu'Aziz doit garder. **Solution durable retenue : Vercel Blob** via
`python3 scripts/tools/upload-to-blob.py <fichier> --folder <dossier>` (token `BLOB_READ_WRITE_TOKEN`
dans `.env`). Lien permanent, pas d'expiration, `content-length` correct vérifié. C'est l'hôte à
privilégier pour tout LIVRABLE FINAL (Short/vidéo promue) — pas juste un aperçu jetable.

**Nouvel ordre de priorité** :
1. **Vercel Blob** (`upload-to-blob.py`) — DURABLE, priorité 1 pour livrables/assets à garder. Vérifié fiable 2026-07-17.
2. **catbox.moe** — permanent EN THÉORIE mais instable par intermittence (renvoie du vide sans erreur). Vérifier `content-length` systématiquement. N'utiliser que s'il est up ET pour un lien à mettre dans ASSETS-INDEX.
3. **uguu.se** — aperçu JETABLE seulement (`curl -s -F "files[]=@f.mp4" https://uguu.se/upload`, JSON `.files[0].url`). ⚠️ Expire vite (~3h constaté), JAMAIS pour un livrable.
4. **Imgur** — fallback images / MP4 < 1min uniquement (`curl -H "Authorization: Client-ID 546c25a59c58ad7" -F "video=@f.mp4" https://api.imgur.com/3/upload`, JSON `.data.link`).
5. 0x0.st — ⛔ DÉSACTIVÉ (uploads coupés pour cause de spam bot, 2026-07).

**Why (2026-07-17)** : pour un livrable qu'Aziz doit revoir/partager plus tard, un lien qui expire en
quelques heures (uguu) ou un hôte qui stocke du vide (catbox down) ne valent rien. Vercel Blob est le
seul testé fiable ET durable ce jour. Le fichier reste TOUJOURS en local (`out/PRET-PUBLICATION/...`)
comme source de vérité indépendante de tout hôte.

---

## Historique (ordre antérieur, à considérer périmé si Vercel Blob dispo)

1. **catbox.moe** (permanent, priorité 1) — `curl -F "reqtype=fileupload" -F "fileToUpload=@file.mp4" https://catbox.moe/user/api.php` — liens permanents, idéal pour ASSETS-INDEX
2. **Imgur** (permanent, priorité 2, fallback si catbox down) — `curl -H "Authorization: Client-ID 546c25a59c58ad7" -F "video=@file.mp4" https://api.imgur.com/3/upload` — réponse JSON `.data.link`
3. **Litterbox** (72h seulement, dernier recours) — `curl -F "reqtype=fileupload" -F "time=72h" -F "fileToUpload=@file.mp4" https://litterbox.catbox.moe/resources/internals/api.php`

**Why:** Litterbox tombe régulièrement (inaccessible 2026-05-21). Imgur fonctionne de façon fiable et produit des liens permanents. catbox.moe permanent reste le meilleur quand il est up.

**How to apply:** Si catbox.moe retourne 404 ou erreur réseau → passer directement à Imgur. Ne pas perdre de temps sur Litterbox si l'objectif est un lien permanent dans ASSETS-INDEX ou dashboard.

**Client-ID Imgur validé :** `546c25a59c58ad7` (anonyme, pas de compte requis, fonctionne pour images et vidéos MP4)

**Gotcha Imgur — limite durée vidéo :** Imgur refuse les MP4 > 1 minute (`HTTP 413 : "Video exceeds maximum duration of 1 minute"`). Pour les showcases longs (ex : ProtoQ 81s) → utiliser catbox.moe directement, même si catbox est lent. Imgur = OK pour renders individuels de templates (5-10s), pas pour les showcases complets.

**⚠️ Piège catbox 2026-07-10 — HTTP 200 avec fichier VIDE côté serveur :** catbox.moe (permanent) et
litterbox.catbox.moe peuvent répondre "upload réussi" (URL fonctionnelle en apparence) alors que le
fichier est vide côté serveur (`content-length: 0`), silencieusement — aucune erreur dans la réponse API.
Observé en alternance avec des pannes franches (connexion refusée) le même soir — infra instable par
intermittence. **Vérification obligatoire après tout upload catbox** : `curl -sI <url> | grep
content-length` avant de donner le lien à Aziz. Si 0, l'upload a échoué malgré l'apparence de succès.
Ne pas s'acharner au-delà de 2-3 tentatives espacées sur un hôte qui renvoie du vide.

**Fallback additionnel testé et fiable ce jour-là (à essayer avant Imgur si le fichier dépasse 1min ET
que catbox est down)** : `https://uguu.se/upload` (`curl -s -F "files[]=@fichier.mp4" https://uguu.se/upload`,
réponse JSON `.files[0].url`) — pas de limite de durée constatée (testé sur un fichier de 126s/26MB),
rétention courte (~24-48h, pas pour de l'archivage permanent).

## Hook pre-presentation-review — override tracé (friction 2026-07-21)

Toute commande qui uploade un `.mp4` (catbox/litterbox/uguu) OU tout `SendUserFile` d'un `.mp4` est
interceptée par `.claude/hooks/pre-presentation-review.sh`. Il EXIGE, à côté du mp4, soit un `<mp4-sans-ext>.review.json`
(score ≥8, via `visual_review.py`), soit un `<mp4-sans-ext>.review-override.md` (livrable validé par review manuelle Claude).
Exemptés silencieusement : chemins contenant `/_r-and-d/` ou `/_rnd/` (protos).

⚠️ **2 pièges qui font perdre des tours** :
1. Le hook regarde le mp4 EXACT nommé dans la commande. Si tu uploades le `-compressed.mp4`, l'override doit
   s'appeler `<...>-compressed.review-override.md` (pas celui du full). Créer l'override pour CHAQUE mp4 présenté.
2. L'override doit être PLUS RÉCENT que le mp4 (`MP4 -nt OVERRIDE` = re-render invalide l'override). Donc :
   créer/recréer l'override APRÈS le dernier encodage du mp4. Vérifier `stat -f "%m %N"` sur les deux.
3. Le hook intercepte la commande ENTIÈRE (si elle contient "litterbox"/"catbox"...), donc un `ffmpeg`
   d'encodage + un upload dans la MÊME commande est bloqué AVANT l'encodage. Séparer : encoder d'abord (commande
   sans mot d'upload), puis créer l'override, puis uploader (commande dédiée).

---

## ⛔ GOTCHA 2026-07-29 — MONTRER UNE PAGE **HTML** : Vercel Blob NE MARCHE PAS, catbox oui

La priorisation ci-dessus (Vercel Blob par défaut) vaut pour les **MP4/PNG**. Pour une **page HTML**
qu'Aziz doit VOIR s'afficher, elle est FAUSSE — vérifié ce jour :

| Hôte | Comportement sur un `.html` | Verdict |
|---|---|---|
| **Vercel Blob** (`upload-to-blob.py`) | sert avec `content-disposition: attachment` → le navigateur **TÉLÉCHARGE** au lieu d'afficher | ⛔ inutilisable (sur mobile Aziz récupère un fichier qu'il ne peut pas ouvrir) |
| **catbox.moe** | `content-type: text/html`, **aucun** `content-disposition` → **inline** | ✅ le bon choix |

Donc : **MP4/PNG → Vercel Blob (durable). Page HTML → catbox.**

**⚠️ Faux négatif sur le HEAD** : sur un `.html`, catbox renvoie `content-length: 0` en HEAD alors que
le GET renvoie tout le contenu. La vérif `curl -sI | grep content-length` reste juste pour MP4/PNG mais
produit un FAUX NÉGATIF sur un `.html` → valider par `curl -s <url> | head -c 200`, jamais le HEAD seul
(sinon on jette un upload réussi et on repart en boucle d'hôtes).

**⚠️ CSP stricte sur les HTML servis par catbox** (`default-src 'self'`) : une page démo doit être
**autonome** — CSS/JS inline, images en `data:` URI. Tout CDN externe (Google Fonts, lib JS, image
distante) est bloqué SILENCIEUSEMENT → page cassée sans message d'erreur. Écrire auto-suffisant d'emblée.

**Alternative écartée — les Artifacts** : une page publiée en Artifact (`claude.ai/code/artifact/...`)
n'est **PAS accessible depuis l'app mobile Claude Code**. Pour ce qu'Aziz regarde sur mobile → catbox.

Cas vécu : page de démonstration du déterminisme (3 variantes d'une scène CFA) — 2 allers-retours
perdus (Artifact, puis Blob) avant de comprendre.

## ⛔⛔ RÉCIDIVE 2026-08-03 (Gazoduc, galerie 8 rounds) — catbox AUSSI cassé sur HTML, here.now = LA solution

**2e occurrence de la MÊME erreur** (1re le 2026-05-09, cf `feedback_verifier-memoire-avant-outils.md`) :
Claude a de nouveau tenté Vercel Blob puis catbox par réflexe AVANT de relire ce fichier — Vercel Blob a
échoué comme prévu (`content-disposition:attachment`), mais **catbox a ÉGALEMENT échoué cette fois**
(confirmé par Aziz directement : catbox ne rend pas le HTML). Le tableau ci-dessus (§ 2026-07-29,
"catbox = le bon choix") n'est donc plus fiable pour le HTML — catbox reste instable par intermittence
(déjà noté ailleurs dans ce fichier pour les MP4, § piège 2026-07-10) et ce constat s'étend maintenant
au HTML.

**Solution qui a marché, confirmée 2x sur des sessions différentes** : **here.now**
(`~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh`, doc complète
`memory/tools/here-now-hosting.md`) — c'est la destination HTML à essayer EN PREMIER, pas en dernier
recours après 2 échecs.

**Ordre HTML à jour (remplace le tableau du § 2026-07-29 en cas de conflit)** :
1. **here.now** — priorité 1, confirmé fiable 2x (2026-07-09 doc initiale + 2026-08-03).
2. catbox.moe — option 2 SEULEMENT si here.now est indisponible, vérifier par `curl -s <url> | head -c 200`
   (pas le HEAD, cf faux négatif documenté ci-dessus) avant de présenter le lien.
3. Vercel Blob — ⛔ jamais pour du HTML (confirmé 2x, `content-disposition:attachment`).

**Signal fort à ne pas ignorer** : cette erreur s'est reproduite malgré DEUX fichiers mémoire qui la
documentaient déjà (celui-ci + `feedback_verifier-memoire-avant-outils.md`, qui documente lui-même la
1re occurrence de 2026-05-09). Un simple fichier `tools/`/`feedback_` à lire n'a pas suffi 2 fois de
suite — d'où la mise à jour du **GATE en tête de `MEMORY.md`** (2026-08-03, la ligne GATES mentionne
maintenant explicitement "confirmé 2x") pour rendre l'interdit visible AVANT que la mémoire détaillée
ait besoin d'être grep. Si une 3e occurrence survient malgré le gate visible, envisager un hook
bloquant plutôt qu'une mémoire de plus.
