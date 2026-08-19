# ÉDITION DE VIDÉO DÉJÀ GÉNÉRÉE — Omni vs Seedance 2.5 (testé 2026-08-18)

> Retoucher un DÉTAIL sur un clip existant sans tout régénérer. ⛔ Ne pas confondre avec l'édition
> d'IMAGE (chirurgicale, prouvée, quasi gratuite — voir § plus bas).
> Test réel : même clip source, même intention de prompt, même durée. Seule variable = le modèle.

## ⭐ VERDICT — SEEDANCE EST FIDÈLE, OMNI REDESSINE

| | Omni Flash (`fal-ai/gemini-omni-flash/edit`) | Seedance 2.5 (`bytedance/seedance-2.5/reference-to-video`) |
|---|---|---|
| **Fidélité au clip source** | ⛔ **Refait toute la scène** : trône remplacé, nuages redessinés, anneaux → spirales, araignée déplacée, visage différent | ✅ **Change sans rajouter** (mot d'Aziz) : trône, nuages, anneaux, parchemin, araignée, visage tous préservés |
| **Audio** | ✅ **Préservé** — corrélation d'enveloppe **0,9973** (dialogue FR + synchro forced-align survivent) | ⛔ muet dans notre test (`generate_audio: false`) — non testé avec audio |
| **Sortie** | 1280×720 @ 24 fps (entrée 1944×1080 @ 30) | 1280×720 @ 24 fps ; propose 1080p (cher, voir prix) |
| **Latence (8 s)** | 123 s | 171 s |
| **Prompt** | même intention, même formulation stricte des deux côtés → **l'écart vient du MODÈLE, pas du prompt** | idem |

## 💰 PRIX RÉELS — relevés par Aziz sur le compte fal.ai (USD, pour ~10 s)

| Job | Coût RÉEL | ⚠️ Mon estimation par formule était FAUSSE |
|---|---|---|
| Omni Flash — édition | **1,10 $** | j'estimais 1,30 $ |
| Seedance 2.5 — **720p** | **4,17 $** | j'estimais 5,68 $ (surestimé) |
| Seedance 2.5 — **1080p** | **10,26 $** | j'estimais 12,80 $ (surestimé) |
| MiniMax H3 (notre pratique) | ~0,07 $ (gratuit + upscale ByteDance 0,0072 $/s) | mesuré en interne |

⛔ **`FAL_KEY` NE DONNE PAS ACCÈS À LA FACTURATION** — testé : tous les endpoints billing/usage/spend
renvoient 404. La clé lance des jobs, elle ne lit pas le compte. **Seul Aziz peut relever les coûts
réels** (dashboard fal.ai). Ne JAMAIS présenter un prix calculé par formule comme un fait.

## RÈGLES D'USAGE (tranchées par Aziz)

1. ⛔ **Hors contexte client, ne pas passer par ce workflow.** 4,17 $ l'édition ne se justifie pas sur
   nos propres vidéos. Sur une commande client à quelques centaines de dollars, c'est dérisoire face
   au temps de re-production — **c'est LÀ que ça vaut**.
2. ⛔ **720p, jamais 1080p pour une retouche** : ×2,5 le prix (10,26 $ vs 4,17 $) sans nécessité sur un
   test ou une itération. Aziz a stoppé un lancement 1080p que j'avais proposé par réflexe.
3. **Le chemin par défaut reste l'IMAGE SOURCE** : éditer l'image avec `gemini-3.1-flash-image-preview`
   (chirurgical, mesuré : zones non ciblées à 0,0-0,1 % de changement) puis régénérer le clip H3.
   ~0,07 $ contre 4,17 $ — **60× moins cher**, et on garde le contrôle du point de départ.
   → L'édition vidéo ne se justifie QUE si le détail est dans le MOUVEMENT ou apparaît en cours de clip.

## GOTCHAS TECHNIQUES
- Endpoint Seedance exact : **`bytedance/seedance-2.5/reference-to-video`** (⛔ PAS `fal-ai/bytedance/...`,
  qui renvoie 404). Références adressées **`@Video1`, `@Image1`** dans le prompt.
  Params : `video_urls[]`, `resolution` (480p|720p|1080p), `duration` ("4".."30"), `generate_audio`.
- Omni : `fal-ai/gemini-omni-flash/edit`, params `prompt` + `video_url`. 10 s max, 720p max, preview.
  ⛔ `gemini-omni-flash-preview` n'est PAS dans la table verrouillée de CLAUDE.md → décision non prise
  (le test ne l'a pas justifié).
- Édition de vidéo uploadée **bloquée dans l'EEE / Suisse / UK** chez Omni (sans effet au Canada).


## ⭐⭐⭐ LE CHEMIN GAGNANT — ÉDITER L'IMAGE SOURCE + RÉGÉNÉRER H3 (prouvé 2026-08-18)

> **~0,10 $ contre 4,17 $ Seedance — et le résultat est jugé par Aziz « quasiment une copie image par
> image ».** C'est LE chemin par défaut. Les modèles propriétaires d'édition vidéo ne sont plus requis.

**Recette (reproductible)** — 3 étapes, la clé est de TOUT garder identique sauf la cible :
1. **Éditer l'IMAGE SOURCE** avec `gemini-3.1-flash-image-preview`, ordre **IMAGE-puis-TEXTE** (= édition ;
   texte-puis-image = génération). Ajouter `"imageConfig":{"aspectRatio":"16:9","imageSize":"2K"}` dans
   `generationConfig` (sinon sortie 1376×768 + JPEG malgré `.png`). Température 0.2.
   Mesuré sur notre cas : ciel **0,0 %** · nuages **0,0 %** · perso secondaire 0,4 % · **cible 3,2 %**.
2. **Reprendre le prompt d'origine À L'IDENTIQUE**, ne changer QUE les mentions de la cible (ici
   `indigo robe` → `emerald green robe`, 2 occurrences : SUBJECT DEFINITIONS + ATTRIBUTE TRANSFER).
   ⛔ Un prompt qui se contredit (une occurrence oubliée) rend le résultat ininterprétable.
3. **Relancer H3 sur le GPU GRATUIT** avec **le seed d'origine** : template `video_minimax_h3_r2v`,
   `run_template` + `input_overrides` → `{"129":{"noise_seed":<seed>}, "132":{"value":<durée_s>},
   "137"/"139":{"image":<nom uploadé>}, "138":{"value":<prompt>}}`. **0 crédit.**
   ⭐ D'où l'importance de TOUJOURS archiver `.prompt.txt` + `.meta.json` (avec le **seed**) à côté de
   chaque clip — sans le seed ce chemin est impossible. C'est ce qui a sauvé ce test.

**Résultat mesuré + jugé** : 864×480, 192 frames, 8,00 s — **specs identiques à l'original**. Décor,
trône, orbes, araignée, cadrage conformes. Verdict Aziz sur comparaison côte à côte : *« quasiment aucune
différence, même un petit artefact de la vidéo originale a été reproduit à l'identique, les mouvements
sont pareils »* (globe qui s'allume, regard de côté, étoiles en arrière-plan).

⚠️ **Corrélation des courbes de mouvement = 0,56** — j'en avais conclu à tort « le mouvement diffère ».
**FAUX** : l'œil d'Aziz voit une quasi-copie. La corrélation frame-à-frame sur 2 fichiers ré-encodés
séparément mesure surtout du BRUIT D'ENCODAGE (contrôle : la zone de ciel *statique* différait autant
que la zone du personnage qui gesticule — 7,25 vs 7,51). **⛔ Ne jamais conclure sur une différence de
mouvement à partir d'un diff de pixels entre deux encodages distincts, ni sur UNE frame comparée à l'œil.**

## ⛔ LA SEULE VRAIE LIMITE : L'AUDIO EST RÉGÉNÉRÉ
Corrélation d'enveloppe **0,46** (vs 0,9973 chez Omni, qui lui préserve l'audio). **La phrase est la même,
la VOIX n'est pas exactement la même** (constat Aziz). Donc : forced-align à refaire, et une voix de
personnage n'est pas reproductible d'un run à l'autre.
→ **Piste ouverte (Aziz)** : construire notre pipeline pour **injecter NOTRE audio** plutôt que de subir
celui de H3 (`reference_audio_urls` existe sur `minimax/h3/reference-to-video`, non testé).

## 🎛 LES 2 CHEMINS COMFY — GPU vs API (distinction soulevée par Aziz, vérifiée)
| Node | Catégorie | Nature | Coût |
|---|---|---|---|
| `MiniMaxH3ReferenceToVideo` (`video_minimax_h3_r2v`) | `model/conditioning/minimax` | poids ouverts, tourne sur le **GPU** | **crédits GPU (0 sur notre run)** |
| `MinimaxHailuo03ReferenceNode` (`api_minimax_h3_r2v`) | `partner/video/MiniMax` | `api_node: true`, relaie vers l'API | **payant** |
Les deux acceptent des références vidéo. ⭐ Toujours vérifier `api_node` avant de lancer.

## LIVRABLES DU TEST
- Source : `memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-pacte-negociation-v2-dialogue-1080p.mp4`
- Omni : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/test-registres/anansi-robe-verte-aHTpytIxUPWqNh95rtBFWUGARfgBqR.mp4
- Seedance : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/test-registres/anansi-robe-verte-SEEDANCE-o85bEmDjrqfrvd1PY6fYVGsoUH7Xst.mp4
- ⭐ **H3 régénéré (le chemin retenu)** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/test-registres/anansi-robe-verte-H3-REGEN-B73143YvNIwRVJSj6L5XdPJmcHxUnd.mp4
- Original 480p (pour comparer) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/test-registres/anansi-nyame-pacte-negociation-v2-dialogue-8s-UqRsoQn5bNWz6sikO609tKOdqHLMDD.mp4
- Clips + assets sources RAPATRIÉS : `out/_r-and-d/omni-edit-test/` — les 3 clips, l'image source éditée
  (`anansi-source-verte.jpg`), le prompt validé (`prompt-verte.txt`) et les 3 scripts de test
  (`edit_image.py`, `omni_edit.py`, `seedance_edit.py`). Planches storyboard 3 modèles : `out/_r-and-d/storyboard-grok/`.
