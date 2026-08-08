# Review VIDÉO par LLM externes — table EXACTE des scripts (ne plus deviner)

> Créé 2026-07-19 après que Claude ait hésité sur les scripts exacts (Aziz : "corrige ta mémoire").
> Source de vérité unique : quel script lance quel modèle pour reviewer une VIDÉO COMPLÈTE (mouvement,
> rythme, son) — PAS des frames figées. Tous dans `scripts/tools/`.
> ⛔ Modèles VERROUILLÉS (CLAUDE.md) : Gemini vision/vidéo = `gemini-3.1-pro-preview` · Kimi = `kimi-k2.5`.
> ⛔ RÈGLE D'OR : LLM = SIGNAL, jamais juge. 1 appel/modèle → synthèse extractive tracée (G/K, RETENU/
> OPTION/ÉCARTÉ+raison) → coder. Jamais de boucle review→fix→review. Jugement d'Aziz prime.

## Table des scripts (vidéo complète)

| Script | Modèle | Entrée | Rôle | Brief libre ? | Fix IPv4 ? |
|---|---|---|---|---|---|
| `gemini-video-review-custom.py <video> <brief.txt> <out.md>` | Gemini 3.1 Pro (Files API) | 1 vidéo full (pas de downscale) | Review 1 vidéo, **brief LIBRE** (fichier) | ✅ OUI (3e arg) | ✅ corrigé 2026-07-19 |
| `gemini-video-da-brief.py <video> [--out]` | Gemini 3.1 Pro | 1 vidéo full | DA-brief à brief HARDCODÉ (câblé Sénégal) — non générique | ❌ non | ✅ corrigé 2026-07-19 |
| `da-brief-video-3voix.py --brief <f> --label <l> --video <v> --frame <f1> --frame <f2>...` | **3 voix en parallèle** : Gemini 3.1 Pro (vidéo native) + Kimi K2.5 (vidéo native, API Moonshot directe) + GPT-5.6 Sol (frames denses, vidéo refusée par OpenRouter) | 1 vidéo (Gemini/Kimi) + N frames (GPT) | Breakdown 3 voix avec les **6 angles obligatoires** (spectateur lambda, narration/synchro, transitions vs états, AI-slop, expert du métier) injectés automatiquement dans TOUS les briefs | ✅ (`--brief` fichier libre, angles ajoutés en plus) | ✅ déjà (import force_ipv4) |
| `da-compare.py --ref <A> --new <B> ...` | Gemini 3.1 Pro | 2 vidéos | COMPARATIF (temps 1 downstream) : réf-qui-marche vs nouveau | template | ✅ avait déjà |
| `kimi-video-compare.py --ref <A> --new <B> --label L [--question Q] [--max-tokens N]` | Kimi K2.5 (Moonshot NATIF, base64) | 2 vidéos 720p | Équivalent Kimi du comparatif ; `--question` = brief libre | ✅ (`--question`) | ✅ natif (l.18) |

⚠️ **PAS de `--out`** : `kimi-video-compare.py` N'ACCEPTE PAS `--out` (erreur "unrecognized arguments" qui tue la commande AVANT tout appel API). Il écrit TOUJOURS dans `<OUT_DIR>/kimi-compare-<label>.md` (auto). Args valides : `--ref --new --label --question --max-tokens`. Erreur commise 2026-07-21.

## Gotchas NON-NÉGOCIABLES (sinon blocage/erreur)

- **IPv6 mort en sandbox** = les scripts Gemini se pendent en `SYN_SENT` sur `[2001:4860:...]:443` (Google)
  s'ils n'importent PAS `force_ipv4`. Diagnostic en 1 commande : `lsof -nP -p <PID> | grep SYN_SENT`.
  Fix = `import force_ipv4` en TÊTE (avant `google.genai`). **Appliqué 2026-07-19** à `gemini-video-review-custom.py`
  ET `gemini-video-da-brief.py` (les 2 l'ignoraient ; `da-compare.py` + `kimi-video-compare.py` l'avaient déjà).
  Détail root cause : [[tools_da-brief-lenteur-kimi-2026-07-17]] + `scripts/tools/force_ipv4.py` + `memory/tools/yt-dlp.md`.
- **Kimi vidéo** : API Moonshot NATIVE (`api.moonshot.ai`), PAS OpenRouter (renvoie 404 "no endpoints support
  input video" sur K2.5/K3). Vidéo en **base64** (pas d'URL HTTP — refusée). **`temperature=1` obligatoire**.
  `max_tokens` ≥ 16000 (thinking model). **Downscaler en 720p AVANT** (base64 gonfle ~33%).
- **Review 1 SEULE vidéo avec Kimi** (pas de paire réf/nouveau) : `kimi-video-compare.py` EXIGE `--ref`+`--new`
  → passer la MÊME vidéo aux 2 slots + `--question` qui dit "les 2 vidéos sont identiques, ignore la
  comparaison, review cette scène". Prouvé 2026-07-19 (review globe D3).
- **Bug 16:9 Kimi** : le bug safe-zone-vertical touche `visual_review.py --model kimi` (frames), PAS
  `kimi-video-compare.py`. Mais sur du 16:9, écarter tout retour Kimi parlant de "safe-zone mobile / UI verticale".
- **`da-brief-video-3voix.py` : ne PAS utiliser `gemini-video-review-custom.py` avec un brief ad hoc** pour un
  breakdown "riche" — ce dernier n'injecte AUCUN des 6 angles obligatoires (spectateur lambda/narration/
  transitions/AI-slop/expert), il faut les écrire à la main dans le brief à chaque fois. `da-brief-video-3voix.py`
  les injecte automatiquement (constaté 2026-08-08 : breakdown Gemini "nu" très inférieur à GPT-5.6 Sol sur la
  même vidéo, uniquement parce que GPT a reçu les angles via ce script et pas Gemini via l'autre). **Par défaut**
  le bloc EXPERT est générique (`EXPERT_BLOCK_EXTERNAL_REF`, pour toute référence externe déjà finie — portfolio
  Fiverr, concurrent, etc.) — passer `--cartographic-upstream` UNIQUEMENT pour un prototype interne Souverain
  16s→84.68s (sinon le modèle hallucine une extension cartographique hors-sujet, vu sur un test MOCH-IT/feel-good).

## Commande type — review 1 scène 16:9 sans storyboard (les 2 en parallèle)

```bash
# GEMINI (vidéo full + brief libre)
python3 scripts/tools/gemini-video-review-custom.py <scene.mp4> <brief.txt> /tmp/da-refs/<nom>-gemini.md

# KIMI (720p, même vidéo aux 2 slots, question = brief + neutralise comparaison)
ffmpeg -i <scene.mp4> -vf scale=1280:-2 -crf 28 <scene-720p.mp4>
python3 scripts/tools/kimi-video-compare.py --ref <scene-720p.mp4> --new <scene-720p.mp4> \
  --label <nom> --question "$(cat <brief.txt>) [+ 'les 2 videos identiques, ignore comparaison, 16:9']" --max-tokens 20000
```

## Briefs & doctrine downstream

- **Pattern "2 temps"** (créé/prouvé 2026-07-18 Acte 5 Soudan) : temps 1 comparatif (`da-compare`+`kimi-video-compare`
  sur réf-or vs nouveau) → temps 2 génératif/densification (brief prospectif "comment on corrige avec notre
  arsenal"). Détail : [[DA-BRIEF-GATE]] § 2 APPELS SÉQUENTIELS · [[WARMAP-DENSIFICATION-CARTE]].
- **Brief densification** War-Map : `scripts/warmap/templates/warmap-densification-brief.txt` (structure gagnante :
  VOLET A remplissage / B garder-vs-effacer / C sous-exploité, format "déjà faisable / à coder mais faisable").
- **Brief D3 globe** (adapté 2026-07-19) : `scripts/warmap/templates/d3-globe-review-brief.txt` — version pour le
  moteur globe D3 (flux geoInterpolate, drapeaux, raccord Mapbox, contraintes SVG/2D). Réutilisable pour toute
  scène [[globe-d3-moteur-cartographique-reutilisable]].
