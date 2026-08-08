# Minimax — Guide complet (Music + TTS + H3 image-to-video)

> Mise a jour : 2026-05-24 (Music/TTS) + 2026-08-06 (H3 API fal.ai) + 2026-08-08 (H3 open-weight via Comfy Cloud MCP)
> Endpoint musique : `fal-ai/minimax-music/v2.6`
> Endpoint TTS : `fal-ai/minimax/speech-2.8-hd` (validé 2026-05-24)
> **Note** : consulter ce fichier AVANT tout appel Minimax

## ⭐⭐ MiniMax H3 via Comfy Cloud (open-weight, INCLUS DANS L'ABONNEMENT, validé 2026-08-08) — PRÉFÉRER À L'API fal.ai

> Découverte de session : H3-Base (le modèle sous-jacent, pas juste le wrapper API) est **open-weight
> depuis début août 2026** et tourne sur Comfy Cloud (`cloud.comfy.org`) via un plugin Claude Code
> officiel. Coûte ~1.30$/5s sur fal.ai (section ci-dessous) pour EXACTEMENT le même modèle self-hosted
> ici, sans surcoût par génération. **Toujours essayer cette voie en premier**, garder fal.ai en
> fallback si Comfy Cloud est down/saturé.
>
> ⚠️ **CORRECTION (2026-08-08, même session) : "0 crédit" ≠ gratuit, c'est "inclus dans l'allocation
> d'heures GPU mensuelle du forfait".** `estimate_credits` affiche 0 pour la variante open-weight (pas
> de surcoût crédits *au-delà* du forfait), mais le job consomme du vrai temps GPU décompté du
> forfait — confirmé via `get_usage_report` : $0.173 dépensés sur nos 4 premiers tests (~$0.043/clip
> en moyenne, clips 8-15s), catégorie "GPU Hours Product". **Le vrai mécanisme de facturation** :
> 0.39 crédit/seconde de GPU actif → Standard (4200 créd./mois) ≈ **4.4h de GPU/mois**, Creator (7400
> créd./mois) ≈ **7.7h/mois**. Reste très avantageux vs fal.ai (~26x moins cher au clip), mais ce
> n'est PAS un puits sans fond — surveiller la conso cumulée si beaucoup de tests s'enchaînent.
> Détail limite technique (pas liée à ce budget) : **30 min max par exécution unique** (1h sur Pro),
> job annulé automatiquement au-delà — sans rapport avec l'allocation mensuelle, aucun de nos tests
> n'en a approché la moitié.

### ⭐⭐ Prototypage rapide multi-variantes EN PARALLÈLE (validé 2026-08-08)
Envoyer **plusieurs appels `run_template` dans le même message** (pas un `for` séquentiel) — les jobs
tournent en parallèle côté serveur Comfy Cloud, récupérables tous en même temps ensuite. Testé : 3
variantes de prompt (même image de référence, seed différent par variante) sur la scène pêcheur,
lancées ensemble, toutes complétées en ~1 cycle d'attente au lieu de 3 séquentiels. **Usage
recommandé** : tester 3-4 directions de prompt/mise en scène sur la MÊME image avant de committer à
une version — le coût marginal par variante (~$0.04) rend ce prototypage quasi négligeable comparé à
la valeur de voir plusieurs options avant de choisir.
⚠️ `submit_batch` (l'outil batch officiel, un seul appel groupé) a échoué 2x sur ce test précis
(`validation.schema` avec le JSON complet du template R2V, 23 nodes) — probablement un format
attendu différent pour le workflow imbriqué en item de batch, pas creusé plus (JSON trop volumineux
pour itérer à l'aveugle). **La méthode qui marche à coup sûr : plusieurs `run_template` en un seul
message, pas `submit_batch`.** À revisiter si `submit_batch` devient nécessaire pour un vrai gros lot
(20+ variantes).

### ⭐ Comportement d'interprétation créative fidèle au DESIGN de l'objet, pas au verbe littéral
Sur un test "la barrière se ferme brusquement" (scène NoteShield, objet de référence = tube lumineux
cyan continu, PAS une barrière mécanique articulée) : H3 n'a pas produit de mouvement mécanique de
fermeture — il a plutôt **éteint la lumière du tube** pour signifier "bloqué/accès refusé". Résultat
jugé par Aziz comme un succès partiel, pas un échec : la marche/réaction de surprise fonctionnent,
seul le verbe "se ferme" a été réinterprété selon la logique visuelle de l'objet réellement dessiné
dans l'image de référence (pas d'articulation mécanique visible = pas de mouvement mécanique inventé).
**Leçon prompt** : si un comportement mécanique précis est requis sur un objet dont le design ne le
suggère pas visuellement, le décrire de façon plus explicite et littérale ("the light bar physically
drops down") plutôt que d'utiliser un verbe générique ("closes/shuts") laissé à l'interprétation du
modèle.

### ⭐⭐⭐ DÉCOUVERTE MAJEURE — prompt laxiste = cause racine des échecs H3, pas le modèle (2026-08-08)
Test A/B contrôlé, même image de référence (Sonjata scene2-humiliation), même durée (10s), même
mouvement demandé (le jeune Sundiata se relève) — SEULE variable changée : la rigueur du prompt.

**Prompt A (laxiste, écrit vite par Claude)** : mentionnait "gripping a wooden staff that appears in
his hands" — un bâton **halluciné dès la conception du prompt**, pas un artefact H3. Résultat :
bâton halluciné apparaît quasi immédiatement (~4s sur 10s), et **toute la foule (8 personnages)
réagit en choc collectif et simultané dès ~6.6s**, AVANT que le garçon ait visiblement fini de se
lever — la réaction précède la cause, désynchronisation dramatique complète.

**Prompt B (rigoureux, composé par l'agent `visual-producer` avec sa discipline Seedance 2.0)** :
séquençage strict par tranches de 2s ("0-2s: head slowly rises... 2-4s: back begins to
straighten... 4-6s: plants one foot... 6-8s: rises fully... 8-10s: stands upright"), **clause
négative répétée et explicite** ("NO staff, NO cane, NO stick... His hands are empty throughout" +
un bloc final "STRICT NEGATIVE: no staff, no cane, no crutch, no stick, no spear, no walking aid,
no weapon..."), décor verrouillé explicitement ("Nothing changes in the environment: same X, same Y,
same Z..."), et foule cadrée en mouvement minimal ("static feet, no walking, no repositioning").
Résultat : **zéro bâton, zéro morphing, timing respecté à la seconde près (vérifié par Aziz), foule
qui ne réagit qu'au bon moment**, respiration lourde du personnage pendant l'effort — comparaison
frame-par-frame confirme le contraste (voir captures scratch de session, non conservées).

**Conclusion actionnable, la plus importante de la session** : **le vrai levier de qualité H3 n'est
PAS le modèle, c'est la discipline d'écriture du prompt** — exactement le même principe que Seedance
2.0. Un prompt "one-shot" écrit vite (quelques phrases descriptives) produit des hallucinations et
une désynchronisation du timing dramatique. Un prompt structuré avec (1) séquençage temporel explicite
par tranches, (2) clause négative répétée pour tout élément à NE PAS faire apparaître, (3) décor
verrouillé explicitement, (4) sujets de réaction nommés précisément (pas "the crowd" en bloc si un
contrôle fin est voulu) élimine la quasi-totalité des défauts observés sur les tests précédents de
cette même session (Flowdesk, Pêcheur, NoteShield 1er essai — tous avec des prompts plus courts/lâches).

**⭐ Pour toute future génération H3 avec un enjeu narratif précis** : **toujours passer par l'agent
`visual-producer`** (pas composer le prompt soi-même à la volée) — il applique déjà la discipline
Seedance 2.0 (mots-rouges-verts, granularité micro-moment, clause négative) documentée dans
`.claude/agents/visual-producer.md` et `memory/tools/seedance-rules.md`/`seedance-prompts.md`, et ces
mêmes principes se transfèrent directement à H3 malgré les deux étant des modèles différents.
Piste à creuser : isoler quel(s) personnage(s) précis doit réagir plutôt que "the crowd"/"the group"
en bloc — Aziz a noté que la réaction collective simultanée reste "un peu exagérée" même sur le
prompt B, hypothèse que H3 a un biais à intensifier une réaction de groupe non individualisée.

### Setup (déjà fait sur ce repo, one-time)
```
claude plugin marketplace add Comfy-Org/comfy-skills
claude plugin install comfy-cloud@comfy-skills
/mcp   # sélectionner comfy-cloud → Authenticate (flow OAuth navigateur)
```
Auth OAuth par session Claude Code (pas de clé API statique dans `.mcp.json` — tenté puis abandonné,
le serveur MCP exige OAuth, voir `auth_state` via `get_server_info`). Après authentification, 39
outils MCP disponibles (`mcp__claude_ai_Comfy_Cloud_MCP__*` ou nom équivalent selon la session).

### Workflow validé (T2V et R2V)
1. `search_templates(q: "MiniMax H3")` → 2 familles par tâche : `video_minimax_h3_*` (open-weight,
   **0 crédit**) vs `api_minimax_h3_*` (repasse par l'API MiniMax hébergée, ~136 crédits/génération
   sur le forfait mensuel — réservé au 2K/Context-IR non open). **Toujours choisir la variante SANS
   préfixe `api_`** pour l'usage gratuit.
2. `estimate_credits(template_name: ...)` AVANT de lancer — confirme 0 crédit pour la variante open.
3. Pour R2V (image de référence) : `upload_file(file_path: <chemin local>)` → renvoie une commande
   `curl PUT` à exécuter via Bash (pas d'upload direct par l'outil) → renvoie un `name` (ex.
   `abc123....jpg`) à réutiliser comme valeur du node `LoadImage`.
4. `run_template(name, input_overrides, wait_for_output: true, client_os: "darwin")`. **Ne PAS
   utiliser le prompt par défaut du template T2V** — buggé (mismatch de type INT/STRING sur le node
   `MiniMaxH3ImageToVideo`, erreur `return_type_mismatch`). Toujours override le node prompt avec son
   propre texte.
5. Si le job dépasse la fenêtre inline (~25s, cas fréquent pour R2V/15s) : `wait_for_job(prompt_id)`
   en boucle jusqu'à `status: "succeeded"` (aucun sleep manuel — l'outil bloque ~25s par appel).
6. `get_output(prompt_id, client_os, inline_urls: true)` → URL signée temporaire (Google Cloud
   Storage, ~6h) + commande curl prête à l'emploi. Télécharger avec `curl -sL`, puis upload
   `scripts/tools/upload-to-blob.py` pour partager avec Aziz (règle upload standard du projet).

### Node IDs du template R2V (`video_minimax_h3_r2v`) — pour `input_overrides`
- **137** : `LoadImage`, champ `image` = le `name` retourné par `upload_file` (1re référence)
- **138** : `PrimitiveStringMultiline`, champ `value` = le prompt (référencer l'image par
  `<Picture 1>` dans le texte — la doc du template le confirme, ordre de connexion = ordre des tags)
- **132** : `PrimitiveFloat`, champ `value` = durée en secondes (voir limite d'arrondi ci-dessous)
- **139** : 2e slot `LoadImage` optionnel (ref_image_1) — **⚠️ contient par défaut une image de
  démo sans rapport** ("mecha_dragon_lightning.png" observé) ; si non utilisé, écraser ou ignorer
  mais noter comme facteur de confusion possible si le résultat dérive un peu du prompt.
- Template T2V (`video_minimax_h3_t2v`) : mêmes principes, node prompt = **104** (`prompt` input).

### Durée réelle vs durée demandée
H3 arrondit la durée à sa grille interne (multiples de 17 frames à 24fps, cf `ComfyMathExpression`
dans le JSON du template : `max(5, round(a*24)) + (5 - (max(5,round(a*24))%17))%17`). Observé :
demander `10` → obtenu `8.0s` ; demander `15` → obtenu `15.08s` (pile la borne haute annoncée du
modèle). **Ne pas viser une durée exacte, viser une fourchette** — 15s semble être le point
d'arrondi le plus fiable pour un "plein format".

### Résultat qualité — test Flowdesk panel1 (15s, image source `panel1-surcharge-source.png`)
Verdict Aziz (2026-08-08), séquence 5 beats d'action distincts sur 15s (tape → se frotte les yeux →
recul fatigué/soupir → mains sur le visage → reprend) : **« parfaitement tenu du début à la fin,
aucun morphing, aucun artefact bizarre, le dessin reste parfaitement juste »**. Points forts
observés :
- **Continuité de style totale sur 15s** (3x la durée testée en 2026-08-06 sur fal.ai) — pas de
  drift même après 8-10s, zone où beaucoup de modèles vidéo décrochent.
- **Compréhension physique implicite** : quand le personnage s'appuie en arrière, la chaise bouge
  avec son poids — cohérence physique non scriptée explicitement dans le prompt.
- **Mains à 5 doigts sans artefact**, y compris en contact avec le visage (zone classiquement
  fragile pour la génération vidéo IA).
- Seul point faible : **le SFX généré ne convient pas** (bruit de barrière/pas jugé "bizarre" sur un
  autre test le même jour, NoteShield). ⭐ Parade déjà identifiée : le mix descend de toute façon la
  vidéo générée avec le son coupé et remplace par nos propres SFX/narration — non bloquant.

### R2V validé aussi sur NoteShield (2026-08-08)
Image source `src/projects/_client-sim/noteshield/refs/p1-couloir-file.jpg` (foule stick-figure
devant barrière), consigne "la foule marche calmement au lieu de courir" → résultat conforme,
style maintenu, mouvement cohérent. Confirme que R2V respecte fidèlement des consignes de
**changement de comportement** par rapport à une vidéo de référence existante (pas seulement
anime une image statique).

### ⭐⭐ R2V validé sur le cas "réputé difficile" : PecheurSurpeche16x9 (2026-08-08)
Test ciblé sur la scène jugée la plus exigeante à ce jour (bateau + geste répétitif de lancer de
filet + action fine main→panier), après un échec Seedance antérieur sur la même scène (cf commentaire
code `PecheurSurpeche16x9.tsx` ligne 224-227, frame de référence prévue précisément pour ce test).
Image source : frame Remotion rendue via `npx remotion still RND-PecheurSurpeche16x9 --frame=N`.

**Verdict Aziz — concluant, malgré 3 défauts mineurs identifiés :**
- ✅ Style (ink/hachures) tenu du début à la fin, cohérence globale de la scène.
- ✅ Geste de lancer du filet crédible, poissons récupérés du filet, **déposés dans le panier de
  façon visible** (un objet ajouté au panier après le geste) — c'était le point le plus incertain
  du test (action fine, petit objet, cible précise).
- ✅ Le bateau prend un léger mouvement de tangage haut/bas (non demandé explicitement dans le
  prompt, mais cohérent/bienvenu — hypothèse : dérivé implicitement de "boat gently rocking" dans
  le prompt testé, à vérifier si reproductible sans cette clause).
- ⚠️ Petits morphings localisés à deux moments : quand la main sort le poisson du filet, et quand
  la tête tourne vers le panier. Jugé par Aziz comme un défaut **récurrent tous générateurs
  vidéo confondus** sur ce style de dessin précis (hypothèse : pas spécifique à H3, plutôt une
  limite générale sur les mains/rotations fines en style ink/SVG-like) — pas un rejet de H3.

**⭐⭐⭐ Découverte comportementale clé — H3 est LITTÉRAL, il ne corrige pas les défauts de l'image
source :**
- Sur l'image de référence utilisée, les pieds du personnage flottent légèrement au-dessus du
  bateau (défaut de positionnement du rig SVG d'origine, pas du contact sol parfaitement calé) —
  **H3 a reproduit fidèlement ce décalage plutôt que de le corriger**. Comportement observé
  cohérent avec le reste de la scène : fond figé (soleil, nuages, océan restent quasi-statiques,
  seule une fine ligne d'eau bouge) — **H3 anime précisément ce que le prompt décrit et laisse le
  reste de l'image tel quel**, plutôt que d'improviser du mouvement ambiant non demandé.
- **Implication directe pour la prod** : soigner la précision géométrique de l'image de référence
  AVANT l'appel H3 (contact pieds/sol, alignement objets) — ne pas compter sur le modèle pour
  "corriger au passage" un défaut de positionnement SVG. Hypothèse d'Aziz (non testée) : un modèle
  comme Seedance pourrait corriger ce genre de défaut automatiquement — à vérifier si comparaison
  utile un jour, mais pas prioritaire vu le résultat global H3 déjà jugé concluant.

**⚠️ Gotcha méthode (pas H3, erreur de sélection de frame)** : la frame de référence choisie pour ce
test était en plein milieu d'un cycle narratif (après le 1er lancer de filet dans la composition
Remotion d'origine, `cast1WindUp=60` → frame choisie 220 → `cast1Hold=260`), donc l'image contenait
déjà 3 poissons visibles dans l'eau et les éclaboussures du 1er lancer AVANT même le lancer généré
par H3. Résultat : la vidéo générée semble démarrer avec "des poissons déjà là avant le lancer" —
ce n'est pas un artefact H3, c'est un choix de frame de référence imprécis. **Pour un test propre
"scène qui démarre de zéro" : choisir une frame AVANT le début du geste (`frame < T.cast1WindUp`,
donc < 60), jamais une frame en plein cycle narratif.**

---

## MiniMax H3 — image-to-video via API fal.ai (payant, validé 2026-08-06)

⚠️ Ne pas confondre avec Minimax Music/TTS ci-dessous — H3 est un modèle **vidéo**, sorti fin
juillet/début août 2026, testé pour la première fois sur le projet Flowdesk (_client-sim, registre
personne/émotion, panneaux "Chaos" et "Bascule" — voir `src/projects/_client-sim/flowdesk/`).
**Depuis le 2026-08-08, préférer la voie Comfy Cloud ci-dessus (même modèle, gratuit)** — garder
cette section pour le fallback si Comfy Cloud est indisponible, ou pour le tier 2K/Context-IR
non-open (variantes `api_minimax_h3_*` sur Comfy Cloud consomment aussi des crédits, donc revenir
ici reste équivalent en coût si le 2K est strictement nécessaire).

- **Endpoint** : `minimax/h3/image-to-video` (fal.ai)
- **Coût observé** : ~$1.30 pour 5s de vidéo en 2K
- **Usage validé** : anime une image statique (silhouette flat-design SVG-like) en gardant
  fidèlement le style d'origine — contrairement à Recraft qui ne produisait que des blocs SVG
  rigides non-animables par partie. Résout le blocage "personnage ne peut pas être animé via
  vectoriel" identifié dans une session antérieure.
- **⛔ Pas de lecture inversée native** (limitation Remotion ET navigateur, pas spécifique à H3) —
  pour un effet ping-pong (aller-retour en boucle), pré-générer la vidéo inversée via
  `ffmpeg -vf reverse` puis alterner/concaténer les deux fichiers en `<Sequence>` Remotion. Ne
  jamais tenter un `playbackRate` négatif au runtime, ça ne marche pas.
- Fichiers de référence dans le repo : `src/projects/_client-sim/flowdesk/videoPingPong.ts`
  (wrapper Remotion ping-pong) et `src/projects/_client-sim/flowdesk/test-minimax-h3/` (itérations
  de test v1→v9).
- **⭐ Personnage récurrent sur plusieurs plans : UNE SEULE image de référence, réutilisée comme
  input à chaque appel H3** — ne jamais régénérer une nouvelle image de référence par plan/scène
  pour le même personnage (risque de dérive visuelle, le personnage ne se ressemble plus d'un
  plan à l'autre). Tranché explicitement par Aziz sur NorthShield (2026-08-07, personnage Sarah
  sur 3 plans). H3 est *image-to-video* (pas un prompt texte pur comme Seedance) : l'image de
  référence doit être générée en amont (Gemini/Recraft) avant tout appel H3. Vaut aussi pour la
  voie Comfy Cloud ci-dessus (le paramètre R2V `ref_images` fonctionne identiquement).
- Choisi pour son coût (le moins cher testé pour ce registre personne/émotion à date) — pas
  verrouillé : tester d'autres générateurs vidéo (Seedance, etc.) si H3 échoue sur un cas donné.

## Minimax TTS — speech-2.8-hd (validé 2026-05-24)

```python
import fal_client, os
os.environ['FAL_KEY'] = '...'

result = fal_client.subscribe(
    'fal-ai/minimax/speech-2.8-hd',
    arguments={
        'text': 'Votre texte ici',
        'voice_id': 'French_Calm_Woman',  # voix FR neutre validée
        'speed': 1.0,
        'emotion': 'neutral'
    },
    with_logs=True
)
# result['audio']['url'] → MP3 téléchargeable
```

**Voix FR disponibles** : `French_Calm_Woman` (neutre, posée)
**Durée** : ~35s pour un script de 26s lu (débit naturel légèrement plus lent qu'ElevenLabs)
**Gotcha** : ne pas mettre de tags `[solemn]` etc. — Minimax TTS ne les interprète pas comme ElevenLabs

## Minimax Voice Clone — fal-ai/minimax/voice-clone

```python
result = fal_client.subscribe(
    'fal-ai/minimax/voice-clone',
    arguments={
        'audio_url': 'https://files.catbox.moe/ienj91.mp3',  # sample 30s narratrice
        'text': SCRIPT,
        'speed': 1.0
    }
)
# result['custom_voice_id'] → réutilisable pour appels suivants
# result['audio']['url'] → MP3 final
```

**Voix GéoAfrique clonée** :
- Sample source : `https://files.catbox.moe/ienj91.mp3` (30s depuis narration-v1-clean.mp3, offset 5s)
- custom_voice_id : `Voicebbc56c501780172741` (généré 2026-05-24 — peut expirer, recloner si besoin)
- Résultat validé accroche Sénégal Beat0

---

## Endpoint et payload

```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/minimax-music/v2.6",
    arguments={
        "prompt": "Traditional Mande griot music from Mali, 13th century...",
        "is_instrumental": True,
    },
    with_logs=True,
)
```

**Parametres actifs** :
- `prompt` (string, 10-2000 chars) — description style/mood/genre
- `is_instrumental` (bool) — **TRUE pour musique de fond sans voix**
- `lyrics` (optionnel, 3500 chars max) — paroles avec tags `[Intro] [Verse] [Chorus]`
- `lyrics_optimizer` (optionnel, bool) — auto-generate paroles
- `audio_setting` (optionnel, objet) — format / bitrate

**Schema name** : `TextToMusic26Request`

---

## Gotchas critiques (validation 2026-04-22)

### 1. Bug historique `reference_audio_url`
L'endpoint `fal-ai/minimax-music` (sans version, ou v1.5) attend `reference_audio_url`. String vide = 422 au fetch. Jobs marques "COMPLETED" sans resultat telechargeable.
**Solution** : TOUJOURS utiliser `v2.6` explicite. Le champ `reference_audio_url` n'existe pas dans v2.6.

### 2. Conflit prompt "instrumental" + `is_instrumental`
NE PAS mettre le mot "instrumental" dans le prompt si `is_instrumental: true` est deja passe. Cause validation 422 (observe 2026-04-22 sonjata).

### 3. `duration_seconds` ignore
Le modele genere la duree qu'il veut (typiquement 2-9 minutes). Pas de controle direct.
**Solution** : trim avec ffmpeg `-t N` apres generation, ou laisser Remotion tronquer via `<Sequence durationInFrames>`.

---

## FORMULE PROMPT VALIDEE (validee 2026-04-12 + reconfirmee 2026-04-22)

Les prompts generiques produisent une sortie ELECTRONIQUE non-africaine. Le modele empile des synthes par defaut. Appliquer SYSTEMATIQUEMENT :

1. **Artiste specifique nomme** — ex: "Style of Toumani Diabate" pour kora Mande
2. **1-2 instruments principaux** — PAS 5 instruments empiles
3. **Rythme precis** — "gentle 6/8 rhythm", BPM explicite
4. **Texture organique** — "warm, acoustic, organic"
5. **Interdictions directes** — "No synthesizers, no electronic sounds" **OBLIGATOIRE**
6. **Origine culturelle precise** — "Traditional Mande griot music from Mali", PAS "West African"

### Prompts valides — Sénégal Pétrole & Gaz (2026-05-22)

Ton : documentaire analytique moderne, souveraineté africaine, tension géopolitique. PAS Mande médiéval.

**A — Ambient Souverain** (Ballaké Sissoko, kora + basse ambient, 72 BPM, 321s générée)
```
Modern African documentary score. Sparse kora melody over slow, deep ambient bass.
Style of Ballake Sissoko. Slow 4/4 rhythm, 72 BPM.
Warm, minimal, dignified, introspective. Tension underneath.
No synthesizers, no electronic beats, no orchestral strings, no chorus.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3`

**B — Kora + Percussions** (Toumani Diabate doc score, 68 BPM, 184s générée)
```
Contemporary African score blending traditional kora with slow deep percussion.
Style of Toumani Diabate meets a documentary film score.
Deep dundun bass rhythm at 68 BPM. Kora melody on top, meditative.
Sparse, serious, organic. No synthesizers, no hi-hats, no electronic elements.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3`

**C — Sabar Cinématique** (Youssou N'Dour film score, 75 BPM, 258s générée)
```
Slow cinematic Afrobeat documentary score from Senegal.
Sabar drum pattern at 75 BPM, acoustic bass, sparse guitar melody.
Style of Youssou N'Dour film score. Dignified, modern, grounded.
No synthesizers, no electronic elements, no vocals, no upbeat energy.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3`

Script dédié : `scripts/tools/minimax-senegal-music.py` — réutiliser comme template pour chaque nouvel épisode (changer `OUT_DIR` + `VARIANTS`).

---

### Prompts valides (Sonjata session 8, 2026-04-22)

**A — Griot intime (retenu)** — Toumani Diabate, solo kora + balafon
```
Traditional Mande griot music from Mali, 13th century empire era.
Solo kora with slow balafon accents. Style of Toumani Diabate.
Gentle 6/8 rhythm, acoustic, warm, organic, meditative.
No synthesizers, no electronic sounds, no drums except soft dundun.
```
Duree generee : 157s. Valide par Aziz : "rythmes contemplatif + percussions, mix parfait".

**B — Griot royal** — Sidiki Diabate, kora + djembe + dundun
```
Traditional Mande griot music from Mali. Solo kora with deep balafon
melody, joined by acoustic djembe and dundun drums in slow 6/8 rhythm.
Style of Sidiki Diabate. Building from contemplative to majestic.
Warm, acoustic, organic, royal. No synthesizers, no electronic sounds,
no orchestral strings.
```
Duree : 168s.

**C — Griot guerrier** — Neba Solo, djembe + dundun + balafon
```
Traditional Mande warrior music from Mali, 13th century. Acoustic
djembe and dundun drums in powerful 6/8 rhythm, joined by balafon
melody. Style of Neba Solo. Tense, earthy, tribal, triumphant.
No synthesizers, no electronic sounds, no modern instruments.
```
Duree : 520s (8:40) — imprevu, mais utile pour versions longues.

---

## ANTI-PATTERN (rejete, a ne PAS reproduire)

```
Epic West African orchestral, kora melody, djembe and dunun percussion,
balafon accents, majestic warm tones, building intensity from contemplative
to triumphant, cinematic, 95 BPM
```

**Pourquoi ca echoue** :
- "West African" trop generique (vs "Mande from Mali")
- 4+ instruments empiles (vs 1-2 nommes)
- Pas d'artiste de reference (Gemini improvise)
- Mots dangereux : "orchestral", "cinematic" poussent vers les synthes
- Pas d'interdiction "no synths"

Resultat observe 2026-04-22 : "accents electroniques tres pousses, pas africain ancien" (rejete par Aziz).

---

## Workflow production

### 3 variantes parallele (~$0.30, ~6min) — recette de reference
```bash
python3 scripts/tools/_archive/minimax-music-3variants.py
```
Genere A/B/C simultanees, telecharge, probe duree. (Script archive le 2026-06-19 :
recette one-shot par episode. Pour un nouvel episode, mieux vaut un `minimax-music.py`
parametrable plutot que dupliquer.) Upload en gallery Vercel :
```bash
python3 scripts/tools/upload-to-blob.py --gallery "Title" \
  sonjata-papercraft/audio/music/v2-A-*.mp3 ... \
  --folder sonjata-papercraft/music-review
```

### Temps d'attente typiques
- Submit : <1s
- Job complete : 2-4 minutes par job (Minimax est lent)
- Download : <5s
- Total 3 variantes parallele : ~6 minutes

---

## Cout et limites

- **$0.10 par generation** (estimation fal.ai)
- Max 1 appel a la fois recommande (pas de rate limit observe mais parallelisable)
- 3 variantes simultanees = $0.30, suffit pour comparaison A/B/C

---

## Mix audio (regle projet)

- **Volume musique** : 0.15 dans Remotion (= ~-16.5dB) — compatible regle "-18dB sous narration"
- **Fade-in** : 2s (60 frames @30fps)
- **Fade-out** : 2s avant fin composition
- Utiliser `<Audio volume={frame => ...}>` avec `interpolate` clamped

Voir src/projects/geoafrique-shorts/SonjataShortFull.tsx pour l'implementation reference.

### Mix ffmpeg POST-render (mid-form long, doc "sérieux") — 2026-07-21 (Soudan)
Quand la musique est mixée en ffmpeg SUR l'assemblage (pas via `<Audio>` Remotion), cas d'un mid-form long :
- **Niveau musique sous-narration** : cible **-12/-15 dB sous la voix** (docs "sérieux" Arte/BBC vont -18/-20).
  En volume ffmpeg linéaire ≈ **0.06-0.09** (choisi Soudan : 0.08 ; →0.06 si trop fort). Plus bas que le 0.15
  Remotion ci-dessus, cohérent (cas mix externe, voix reine).
- **Dompter les basses de la musique** : `bass=g=-7:f=200:w=0.6` — les graves masquent la voix davantage que les
  aigus, donc une kora/dundun riche en basse doit être atténuée dans le grave (garde la présence sans enterrer).
- **Boucle organique** (musique courte < vidéo) : crossfade triangulaire entre répétitions,
  `acrossfade=d=3:c1=tri:c2=tri` en chaîne (N copies), + fade-in 2s/out 3s. Zéro raccord audible.
- **amix** : `amix=inputs=N:duration=first:normalize=0` (normalize=0 sinon baisse tout). Vérifier `max_volume < 0 dB` après (pas de clipping).
- Scripts de référence : `scripts/tools/soudan-audio/` (minimax-music, sfx, mix).
- ⚠️ Prompt musique : les prompts "thriller/synth geopolitical" (ex. suggestion Gemini) produisent de l'électronique
  hors-charte Kora et Cartes → TOUJOURS revenir à la formule kora/percussion validée ci-dessus (rejet daté Soudan 2026-07-21).

---

## References

- Doc Context7 fal.ai : `/websites/fal_ai_models` query "minimax-music v2.6"
- Clip reference validation : `sonjata-papercraft/audio/music/v2-A-griot-intime.mp3`
- Integration Remotion : src/projects/geoafrique-shorts/SonjataShortFull.tsx
- Script 3 variantes (archive) : `scripts/tools/_archive/minimax-music-3variants.py`

---

# Minimax Speech 2.8 HD + Voice Clone — Guide TTS

> Validé 2026-05-19 (test session R&D sur voix GeoAfrique).
> Endpoints actifs : `fal-ai/minimax/voice-clone` + `fal-ai/minimax/speech-2.8-hd`
> **Verdict Aziz** : "Très bon, plus de punch que ElevenLabs sur certains passages. Ne remplace pas ElevenLabs, mais s'ajoute au stack."

## Quand utiliser Minimax TTS (vs ElevenLabs)

- **Comparaison A/B narration** : générer 1 version ElevenLabs + 2 versions Minimax (presets différents) pour le même script. Aziz choisit à l'oreille.
- **Narrations longues budget-sensible** : Minimax = $0.10 / 1000 chars vs ElevenLabs ~$0.30. Pour un script Atlas 8-15min (~10k chars), économie réelle.
- **Voix avec punch / énergie** : Aziz a noté que Minimax neutral/happy ont plus de "beats" qu'ElevenLabs équivalent.

## Workflow voice clone (one-shot)

```python
import fal_client

# 1. Upload privé (PAS catbox — narration interne projet)
audio_url = fal_client.upload_file("/path/to/sample-25s.mp3")

# 2. Clone
result = fal_client.subscribe(
    "fal-ai/minimax/voice-clone",
    arguments={
        "audio_url": audio_url,
        "noise_reduction": True,
        "need_volume_normalization": True,
        "model": "speech-02-hd",  # ← OK, le voice_id fonctionne aussi sur 2.8 HD
    },
)
custom_voice_id = result["custom_voice_id"]
```

**Specs sample source** :
- Durée : 20-30s suffit (≥10s requis). Trim ffmpeg depuis le milieu d'une narration propre.
- Mono 44.1kHz MP3 192kbps validé. WAV OK aussi.
- **Zéro musique, zéro SFX dans le sample** — voix seule.

**Coût** : $1.50 par clonage.

**Persistance** : voice_id expire après **7 jours sans usage TTS**. Pour pin : 1 appel TTS hebdo minimum, ou re-cloner.

## Workflow TTS (Speech 2.8 HD avec voix clonée)

```python
result = fal_client.subscribe(
    "fal-ai/minimax/speech-2.8-hd",
    arguments={
        "text": TEXT,
        "voice_setting": {
            "voice_id": custom_voice_id,
            "speed": 1.0,
            "vol": 1.0,
            "pitch": 0,
            "emotion": "neutral",  # voir presets validés ci-dessous
        },
        "audio_setting": {
            "sample_rate": 44100,   # INT, pas string
            "bitrate": 256000,      # INT, pas string
            "format": "mp3",
            "channel": 1,           # INT
        },
        "language_boost": "French",
        "output_format": "url",
    },
)
url = result["audio"]["url"]
```

**Coût** : $0.10 / 1000 chars (~$0.13 pour une narration 1m30, ~$1 pour 10min Atlas).

## Presets emotion validés (Aziz 2026-05-19)

7 valeurs enum : `neutral, happy, sad, angry, fearful, disgusted, surprised`.
**Aziz préfère** : `neutral` et `happy` (les deux ont le plus de naturel + punch sur narration GeoAfrique). Workflow projet : générer ces 2 + une version ElevenLabs pour A/B.

## Markers texte — GOTCHA CRITIQUE (validé 2026-05-19)

**Seuls 2 markers fonctionnent réellement** sur voix française :
- `<#0.X#>` (pauses en secondes) — ✅ marche parfaitement
- `(sighs)` — ✅ produit un soupir audible (sonne plus comme une respiration/arrêt qu'un vrai soupir, mais exploitable)

**Markers PARASITES (prononcés comme du texte, à ÉVITER)** :
- `(laughs)` → la voix dit "rire" littéralement
- `(clears throat)` → la voix dit les mots
- `(gasps)` → idem
- `(coughs)` `(sniffs)` `(groans)` `(yawns)` → probablement idem (non testés en FR)

**Hypothèse confirmée** : la voix s'**adapte automatiquement** à la sémantique du texte. Sur narration "soixante mille esclaves vêtus de soie persane", `neutral` ralentit et adoucit le ton sans qu'on demande. Sur la chute "ce sont les idées qui restent", il y a un poids naturel. **Donc règle production : texte propre + 2-3 pauses dramatiques bien placées, rien d'autre.**

## Pricing récap

| Action | Coût |
|---|---|
| Voice clone (one-shot, voice_id réutilisable 7j) | $1.50 |
| TTS (1000 chars) | $0.10 |
| Narration 1m30 (≈1200 chars) | ~$0.12 |
| Narration 10min Atlas (≈10k chars) | ~$1.00 |

## Limites vs ElevenLabs V3

- ❌ Pas de mix d'émotions inline (1 emotion par appel uniquement)
- ❌ Pas de markers contextuels riches (`[whispers]`, `[excited]`)
- ❌ Pour multi-émotions : générer en plusieurs appels et concat ffmpeg
- ✅ Auto-adaptation sémantique très bonne (compense partiellement le manque de markers)
- ✅ Pricing 3x moins cher
- ✅ Voice clone $1.50 one-shot vs ElevenLabs professional voice clone plus complexe

## Schema gotchas

- `audio_setting` : tous les nombres en **INT**, pas strings. `"32000"` → fail 422. `32000` → OK.
- `voice_setting.voice_id` accepte presets Minimax (`Wise_Woman` etc.) OU `custom_voice_id` retourné par voice-clone.
- `language_boost: "French"` — required pour qualité optimale FR (sinon prosodie EN par défaut).

## Sample R&D session (2026-05-19)

- Sample source : `public/souverain/niger-uranium/audio/narration-niger-uranium-v5.mp3` trim 15-40s mono 44.1kHz
- Voice cloné : `Voiced5bd2f9e1779163839` (expire ~2026-05-26 sans usage)
- Renders test : `out/_r-and-d/minimax-voice-clone-test/`
  - `clean_neutral.mp3` (74s) — référence narration pure
  - `clean_happy.mp3` (78s) — alternative validée Aziz
  - `long_*` — avec markers parasites (mauvais exemple à ne pas reproduire)
- Coût total session test : **~$2.50** (clone + 12 TTS variantes)

## Workflow recommandé pour future production

1. **Re-cloner** la voix GeoAfrique au début de chaque épisode (sample fresh depuis dernière narration ElevenLabs validée) — $1.50
2. **Générer 3 versions du même script** : `ElevenLabs (référence)` + `Minimax neutral` + `Minimax happy`
3. **A/B aveugle** par Aziz, choix de la voix par épisode (pas forcément la même partout)
4. **Markers à utiliser** : seulement `<#0.X#>` pauses. Zéro `(...)` interjection.
5. **Pin voice_id** : appel TTS factice 1x/semaine si gap entre épisodes

---

## Pattern : musique 1 morceau → plusieurs durées vidéo (fenêtre + fade) — validé 2026-06-05

**Problème** : une vidéo évolue en durée (22s → 32s → 60s pendant l'itération). Il faut une musique qui colle à CHAQUE durée sans coupure brutale ni raccord audible.

**Solution validée (war-map Soudan)** : générer UN seul morceau, en garder le brut complet, puis découper une fenêtre par durée avec fondu de sortie. JAMAIS assembler plusieurs morceaux (raccords audibles) ni régénérer (ambiances différentes).

1. **Générer 1 fois** via Minimax v2.6 (`is_instrumental: true`). Le modèle sort 2-9 min (typique ~146s). **Garder le brut complet** (`music_raw.mp3`).
2. **Découper une fenêtre par durée** depuis le MÊME brut + fade out :
```bash
# 60s : prend les 60 premières secondes du morceau + fondu in 1.5s + fondu out 3s
ffmpeg -i music_raw.mp3 -t 60 -af "afade=t=in:st=0:d=1.5,afade=t=out:st=57:d=3,volume=0.9" -c:a libmp3lame -b:a 192k score-epic.mp3
```
3. Nommer par durée : `score.mp3` (22s) / `score-long.mp3` (32s) / `score-epic.mp3` (60s). Le code choisit selon le mode (ex. `epic ? "score-epic" : ...`).

**Pourquoi ça sonne parfait, jamais coupé** :
- Même morceau = même beat/tonalité/instrumentation du début à la fin, zéro transition à raccorder.
- Le brut (146s) >> la vidéo (60s) → on coupe en plein développement, jamais à un endroit "fini".
- Le `afade=out` (2-3s) masque la coupure : l'oreille perçoit une CONCLUSION, pas un arrêt net.

**Limite** : marche tant que la vidéo < durée du brut. Pour 3+ min : générer un morceau plus long OU vraie boucle (point de boucle calé sur le beat, pattern Remotion 2e `<Audio>` `startFrom` — voir feedback_audio-music-loop-startfrom-tardif).

---

## ⛔⛔ LA DURÉE GÉNÉRÉE N'EST PAS UN CRITÈRE DE SÉLECTION (correction Aziz, 2026-07-29)

> ⚠️ À lire AVANT de trier la banque de pistes existantes — et à ne pas confondre avec la « Limite »
> ci-dessus, qui parle de couper UN morceau, pas de CHOISIR parmi plusieurs.

Minimax génère des morceaux courts **faits pour boucler**. Ne jamais filtrer ni écarter une piste sur
sa durée brute : c'est un **attribut** (il dit combien de boucles il faudra), jamais une
disqualification.

**Erreur vécue** : un premier tri de la banque de 67 pistes filtrait sur `durée >= 249 s` et n'en
retenait que **12**. Correction d'Aziz : « la très grande majorité des musiques générées via Minimax
sont des musiques que l'on boucle en tant que telles, donc le fait que ce ne soient pas des musiques
qui vont au format long n'est pas discriminant. » → **58 pistes retenues** après correction. Leçon
plus large : ne pas transformer un attribut technique en critère éliminatoire.

**Le vrai critère pour une piste destinée à boucler** : l'écart de niveau **tête(3 s) ↔ queue(3 s)**.
< 2 dB = boucle quasi transparente · > 5 dB = `acrossfade` long obligatoire (une piste de l'épisode
CFA à 5.5 dB imposait un fondu de 4 s).

⭐ **AVANT TOUT NOUVEL APPEL Minimax : lire `public/_shared/audio/INDEX-MUSIQUES.md`** — 67 pistes
uniques déjà produites, toutes mesurées (durée · amplitude · bande 200 Hz–2 kHz de la voix · écart de
boucle). Générer sans l'avoir lu, c'est re-payer ce qu'on possède : 4 groupes de doublons binaires
exacts y ont été trouvés (24.8 Mo), dont 3 pistes stockées deux fois sous des noms différents.
