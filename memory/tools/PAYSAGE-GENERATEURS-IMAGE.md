# PAYSAGE DES GÉNÉRATEURS D'IMAGE — état du marché

> **Relevé : 2026-08-19.** Source de vérité pour « quel modèle image utiliser / existe-t-il mieux ou moins cher ? ».
> ⛔ **Les classements et les prix se périment vite** (le marché a entièrement bougé entre mars et août 2026).
> Au-delà de ~3 mois, re-vérifier aux 3 leaderboards cités avant de décider. Ne pas citer ces chiffres comme actuels sans les avoir revus.
> Voisin (ne pas dupliquer) : `chatgpt-image2-vs-gemini.md` = test terrain 2 modèles sur un cas paper-craft. Ce fichier-ci = vue marché.

## ⭐ VERDICT EN 3 LIGNES

1. **La famille Gemini `flash-image` reste notre choix** : 7e en édition (Elo 1249), 3e en text-to-image (1320). ⭐ **Depuis le 2026-08-20 notre défaut est le LITE** (`IMAGE_MODEL`, ~0,0336 $/image, **1K max**) ; le HQ (`IMAGE_MODEL_HQ`, 0,067 $) est réservé aux images **publiées telles quelles**. ⛔ Identifiant jamais en dur — importer depuis `scripts/tools/gemini_models.py`.
2. ⛔ **MAI-Image-2.5 : testé puis ÉCARTÉ** (voir DÉCISIONS ARRÊTÉES). Sur le papier meilleur en édition (1256 > 1249) et 28 % moins cher — **à l'aveugle sur notre matière, aucune différence visible**, et il est en *preview*. ⭐ La leçon : un écart de quelques points d'Elo ne se voit pas sur nos cas réels.
3. ⛔ **AUCUN open weights ne rivalise en ÉDITION.** Le meilleur réellement utilisable par nous est à **−83 Elo** (~61 % de préférence adverse en tête-à-tête = visible à l'œil nu).

## ⛔⛔ LES 3 PIÈGES — affirmations FAUSSES très répandues dans les blogs

Vérifiés à la source le 2026-08-19. Ne pas se faire avoir (et ne pas les réintroduire par mémoire pré-entraînée) :

| Croyance répandue | Réalité vérifiée |
|---|---|
| « Qwen-Image-3.0 est open weights » | **FAUX.** Aucun poids publié. Alibaba a basculé sa lignée image en propriétaire. Le dernier open weights est `Qwen-Image-Edit-2511` (nov. 2025). |
| « Ideogram 4.0 est open weights » | **VRAI mais NON-COMMERCIAL.** Poids quantifiés sous *Ideogram Non-Commercial Model Agreement* → usage commercial = licence payante. Les leaderboards l'affichent « Open Weights » sans le signaler. |
| « HunyuanImage 3.0 est le n°1 open weights en édition » | **VRAI mais inutilisable ici.** (a) exige **8 × 80 Go de VRAM**, (b) la licence Tencent **EXCLUT EXPLICITEMENT l'UE, le UK et la Corée du Sud**. |

## LEADERBOARD ÉDITION D'IMAGE (le plus pertinent pour nous)

Artificial Analysis, relevé 2026-08-19. Prix = $/1000 images.

| # | Modèle | Elo | Type | $/1k |
|---|---|---|---|---|
| 1 | MAI-Image-2.5-Pro | 1272 | propriétaire | 108,5 |
| 2 | Reve 2.1 | 1263 | propriétaire | 200 |
| 3 | GPT Image 2 (high) | 1256 | propriétaire | 211 |
| 4 | ⭐ **MAI-Image-2.5** | **1256** | propriétaire | **48,1** |
| 5 | GPT Image 1.5 (high) | 1250 | propriétaire | 133 |
| 6 | Qwen-Image-3.0-Pro | 1250 | propriétaire | 43 |
| 7 | ⭐ **Nano Banana 2 — LE NÔTRE** | **1249** | propriétaire | **67** |
| 10 | MAI-Image-2.5-Flash | 1234 | propriétaire | **20** |
| 12 | HunyuanImage 3.0 Instruct | 1223 | open ⛔ hors UE | 90 |
| 24 | HiDream-O1-Image | 1192 | open weights | 10 |
| 33/35 | FLUX.2 klein 9B · Qwen-Image-Edit-2511 | 1166 | ⛔ non-comm. / ✅ Apache | — |

Text-to-image (pour situer) : **GPT Image 2 domine largement** (1368, +46 sur le 2e), Reve 2.1 (1322), **Nano Banana 2 3e (1320)**. Le top 15 T2I est **100 % propriétaire**.

## OPEN WEIGHTS — ce qui est réellement utilisable par nous

Critère : licence commerciale libre ET tient sur du matériel réaliste.

| Modèle | Licence | VRAM | Édite ? | Elo édit. |
|---|---|---|---|---|
| **Qwen-Image-Edit-2511** (`Qwen/Qwen-Image-Edit-2511`) | ✅ Apache 2.0 | ~24 Go | ✅ | 1166 |
| **FLUX.2 klein 4B** (`black-forest-labs/FLUX.2-klein-4B`) | ✅ Apache 2.0 | ~13 Go | ✅ | 1116 |
| **Z-Image Turbo** (`Tongyi-MAI/Z-Image-Turbo`) | ✅ Apache 2.0 | 6-16 Go | ❌ T2I seul | — |
| Krea 2 Turbo | community < 1 M$ CA | ~12 Go fp8 | ❌ T2I seul | — (T2I 1220) |
| FLUX.2 dev / klein 9B · Ideogram 4.0 | ⛔ non-commercial | — | ✅ | 1138-1166 |

⛔ **`Chroma` non listé sur les leaderboards consultés** — statut non vérifié.
👁️ **À SURVEILLER : `Z-Image-Edit`** (Apache 2.0, 6B) — annoncé au model zoo, sortie **non confirmée**. Un éditeur Apache 2.0 léger changerait la donne : re-vérifier périodiquement.

**Le seul usage open weights qui a du sens chez nous** : Z-Image Turbo ou FLUX.2 klein 4B pour des **brouillons/protos à coût zéro** avant la passe payante — cohérent avec « proto pas cher AVANT asset payant ».

## KREA 2 — pourquoi on ne l'adopte pas (analysé 2026-08-19)

Étudié à fond suite à 2 vidéos (Pixaroma Ep30, Benji). Conclusion : **ne pas adopter pour l'édition.**
- ⛔ **Le modèle d'édition Krea 2 N'EXISTE PAS.** Krea 2 est un **text-to-image pur**. Ce que la communauté appelle « Krea 2 Edit » est un **LoRA hobbyiste** (`conradlocke/krea2-identity-edit`, dev solo) + node pack tiers `comfyui-krea2edit` qui détournent le modèle de base. Ça marche, mais ce n'est pas un produit.
- ⛔ **Injouable sur notre Mac** : le FP8 (13 Go) **ne charge pas sur MPS**, donc BF16 26 Go obligatoire → Turbo ~3,5 min/image sur M1 Max 64 Go, et le mode Raw (requis pour les SUPPRESSIONS d'objet) **47 min/image**.
- ⛔ **Comfy Cloud ne peut pas l'exécuter** : le LoRA n'est pas au catalogue et Comfy Cloud ne charge pas de custom nodes tiers — or ces nodes sont **obligatoires** (sans eux la qualité s'effondre). Aucune API (fal/Replicate/Krea) ne propose l'édition.
- Licence : open **weights**, pas open source. Commercial libre sous **1 M$ de CA/an** (on est très en dessous) mais **révocable**.
- Points faibles mesurés : retrait d'objet (son pire cas), **ne peut pas éditer du texte**, séparation de 2 visages imparfaite.
- ✅ **Ce qui reste bon à savoir** : Krea 2 Turbo en **T2I** via fal.ai à **0,008 $/MP** (~12× moins cher que Gemini) est excellent en esthétique — candidat pour planches/décors où on veut de la beauté, pas de l'obéissance littérale.
- 💡 **Idée transposable** : son paramètre `ref_boost` = curseur explicite fidélité/liberté (zone utile 1-4, 0 = perd l'identité, 10 = fige tout). On n'a aucun équivalent chez Gemini (tout ou rien).

## CE QUI A CHANGÉ (mars → août 2026)

1. **Microsoft a pris la tête de l'édition** (MAI-Image-2 → 2.5 → 2.5-Pro n°1 → 2.6-preview). Trajectoire la plus rapide et la plus agressive en prix.
2. **GPT Image 2 (avril) a creusé un écart historique en T2I** — jamais rattrapé en 4 mois.
3. ⭐ **L'open weights de pointe s'est REFERMÉ, pas ouvert** (voir les 3 pièges). Contre-intuitif mais c'est le mouvement de fond.
4. **Les prix se sont effondrés** : ce qui coûtait 0,067 $ en mars s'obtient à 0,020 $ (MAI-Flash).
5. **BFL a pivoté vers la vidéo** : FLUX 3 Image **n'existe pas encore**, FLUX 3 Dev sans date ni licence. FLUX n'est plus le repère de l'image open weights.

## DÉCISIONS ARRÊTÉES

- ✅ **Rester dans la famille Gemini `flash-image`** (nos prompts sont calibrés dessus) — défaut LITE, HQ si publié.
- ⛔ **MAI-Image-2.5 : TESTÉ puis ÉCARTÉ (2026-08-20).** Comparatif à l'aveugle sur 3 éditions réelles : Aziz n'a vu **aucune** différence avec le nôtre. Écarté car en *preview* côté Azure et exposé en « Partner » chez fal — on ne quitte pas un preview pour un autre preview. Accès réel : `microsoft/mai-image-2.5/edit` sur **fal.ai** (⛔ **PAS** sur OpenRouter, vérifié en direct). À reconsidérer s'il passe en GA.
- ⛔ **Mode Batch : TESTÉ puis ÉCARTÉ (2026-08-20).** Fonctionne pour l'édition (job SUCCEEDED, 2 images, **304 s mesuré**), -50 % sur l'entrée ET la sortie. Mais l'asynchrone (24 h annoncées, expiration à 48 h = tout perdu) est incompatible avec 10-15 éditions ciblées par acte, souvent relancées. ~0,66 $ d'économie pour 20 planches → ne vaut le coup qu'au-delà de ~100 images figées.
- ✅ **Lite ADOPTÉ comme défaut (-50 %)** le 2026-08-20 — cf. `scripts/tools/gemini_models.py`.
- ⛔ **Ne PAS migrer vers l'open weights pour l'édition** (−83 Elo mini ; les 2 modèles qui s'en approchent sont hors licence UE ou non-commerciaux).
- ⛔ **Ne PAS passer à GPT Image 2** malgré sa 1re place T2I : 3,1× notre coût, et notre besoin est l'ÉDITION.

## Sources (à rouvrir pour re-vérifier)
- https://artificialanalysis.ai/image/leaderboard/editing · https://artificialanalysis.ai/image/leaderboard/text-to-image
- https://arena.ai/leaderboard/image-edit
- https://ai.google.dev/gemini-api/docs/pricing (prix Gemini officiels : 0,067 $/img 1K, 0,101 $ en 2K, 0,0336 $ Lite)
- https://ideogram.ai/licensing · https://github.com/Tencent-Hunyuan/HunyuanVideo/blob/main/LICENSE.txt (clause d'exclusion UE)
- https://huggingface.co/conradlocke/krea2-identity-edit · https://www.krea.ai/krea-2-licensing
