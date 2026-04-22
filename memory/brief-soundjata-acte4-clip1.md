# Brief session — Soundjata Acte IV Clip 1 (exil + Mema + messagers)

> Créé 2026-04-16 PM (fin de session Acte I v2 validé).
> À ouvrir en début de prochaine session. Contient tout ce qu'il faut pour lancer directement.

---

## Contexte

L'Acte IV du Short Soundjata fait 16.44s de narration, découpé en 4 sous-scènes :

| Sous-scène | Timing Whisper | Texte narration | Durée |
|---|---|---|---|
| exil | 48.44s → 52.14s | "Chasse par la jalousie de la cour, il s'exile loin de sa terre." | 3.70s |
| mema | 52.92s → 56.44s | "Sept longues annees a Mema, a apprendre, a attendre." | 3.52s |
| messagers | 56.44s → 62.76s | "Quand le roi-sorcier Soumaoro ecrase son peuple, des messagers traversent tout le pays pour le retrouver." | 6.32s |
| lionRevient | 63.32s → 64.88s | "Le lion du Manden revient." | 1.56s |

**Décision prise fin session 2026-04-16** :
- **Clip 2 (lionRevient) DÉJÀ VALIDÉ** : `public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated/acte4-clip2-lion-revient-v1.mp4` (5.04s, Soundjata canon sur cheval, sabre levé, savanne, coucher de soleil). À garder tel quel, à intégrer dans la composition finale.
- **Clip 1 à produire** : les 3 premières sous-scènes (exil + mema + messagers) = durée narration 12.62s. **Générer un clip Seedance 13s** (palier supérieur, cross-check 13 >= 12.62 OK).

---

## Décision structure visuelle Clip 1 — 4 panels

Appliquer la **règle 20** (densité contemplatif multi-beats = 4-5 panels). Ici 4 panels pour 13s = **3.25s par panel**, respiration confortable.

### Panel 1 — WIDE EXIL (0-3.25s → sous-scène exil)

**Soundjata adulte canon** (tresses + tunique blanche + sash rouge + sandales) dos tourné à la caméra, quittant son village natal de Niani. Il marche vers un horizon ochre au loin, baluchon sur l'épaule. Cases en banco mandingue en arrière-plan flou, quelques villageois silhouettés qui le regardent partir. Atmosphère amère, lumière de fin de journée dorée.

**Note identité** : utiliser `soundjata-exile-ref.png` (déjà existant — Soundjata avec baluchon, tunique blanche).

### Panel 2 — MEDIUM MEMA (3.25-6.5s → sous-scène mema)

Soundjata à Mema, plus mûr (7 ans plus tard). Il est en train de **s'entraîner avec son sabre** dans la savane sahélienne. Ambiance différente du Mali natal : palmiers, architecture de Mema (en terre rouge plus verticale que Niani), baobabs plus grands. Regard concentré mais lointain — il pense au Manden.

**Note identité** : utiliser `soundjata-adult-warrior-ref.png` (déjà existant — tunique blanche + sash rouge + sabre, savane). Même Soundjata canon, plus adulte. Possibilité d'ajouter une légère barbe si Gemini/Seedance le permet.

**Décor** : utiliser `mema-environment.png` (déjà existant — architecture Mema en terre rouge avec minaret de boue, palmiers).

### Panel 3 — WIDE MESSAGERS (6.5-9.75s → début sous-scène messagers)

3 cavaliers mandingues au galop à travers la savane. Turbans bleu/rouge/vert, boubous traditionnels XIIIe siècle, chevaux bai/noir/blanc. Poussière ochre soulevée, baobabs en silhouette en arrière-plan. Plan large épique, mouvement horizontal gauche→droite.

**Note identité** : utiliser `messagers-cavaliers-ref.png` (déjà existant — 3 cavaliers en turbans au galop).

### Panel 4 — MEDIUM MESSAGERS TROUVENT SOUNDJATA (9.75-13s → fin sous-scène messagers + préparation "Lion revient")

Les messagers arrivent à Mema. Un messager s'incline devant Soundjata en signe de supplication (geste mandingue de respect envers un souverain). Soundjata debout, comprend : son peuple l'appelle. **Moment de bascule émotionnelle**. Ne pas montrer encore le cheval / sabre levé — ça vient au clip 2 qui enchaîne.

**Note identité** : combiner `soundjata-adult-warrior-ref.png` + `messagers-cavaliers-ref.png`.

---

## Refs à fournir à Seedance (5 images)

Toutes existent déjà sur disque, aucune régénération nécessaire :

1. **Storyboard 4 panels v2** — **À GÉNÉRER** en début de session (Gemini, ~$0.08). Le storyboard existant `storyboard-acte4-clip1.png` est à **9 panels = à refaire en 4 panels** selon règle 20.
2. `public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4/soundjata-exile-ref.png` — Soundjata avec baluchon (panel 1)
3. `public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4/soundjata-adult-warrior-ref.png` — Soundjata guerrier avec sabre (panels 2 et 4)
4. `public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4/messagers-cavaliers-ref.png` — cavaliers au galop (panels 3 et 4)
5. `public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4/mema-environment.png` — architecture Mema (panel 2 background)

---

## Paramètres API Seedance

- **Endpoint** : `bytedance/seedance-2.0/reference-to-video` (NOTE : pas `fal-ai/bytedance/seedance/v1/pro/...`)
- **`reference_image_urls`** : array des 5 images ci-dessus
- **`duration`** : `"13"` (STRING, pas int — Seedance attend literal string '4'-'15' ou 'auto')
- **`aspect_ratio`** : `"9:16"`
- **`resolution`** : `"720p"`
- **`generate_audio`** : `true` (keep-and-duck 30% en Remotion après)
- **Coût estimé** : $3.90 (13s × $0.30/s)

---

## Prompt Seedance (minimaliste, ~200 mots, suivre modèle Acte I v2)

```
2D vivid flat illustration style, 13th century West African epic, exile and call to destiny sequence.

References with strict role separation:
- Image 1 = storyboard 4-panel layout -> PRIMARY GUIDE for composition, shot order, framing, and timing. Follow panels in reading order.
- Image 2 = Soundjata exile canon identity (white tunic, red sash, baluchon/bundle, dignified young adult) -> lock for panel 1.
- Image 3 = Soundjata warrior canon identity (same face, braided hair, white tunic, red sash, sword) -> lock for panels 2 and 4, slightly more mature (7 years later).
- Image 4 = Messengers canon identity (3 Mande horsemen, blue/red/green turbans, traditional boubou robes, bay/black/white horses) -> lock for panels 3 and 4.
- Image 5 = Mema environment -> lock for panel 2 background (red-earth architecture, minaret, palm trees).

Create a contemplative arc: Soundjata leaves home in exile, matures in Mema for 7 years, messengers cross the land to find him, they kneel before him to call him back.

Absolute priorities:
1. EXACTLY 4 shots total, ~3.25s each, minimal camera movement. Slow pans and gentle push-ins only.
2. Timing mapping: panel 1 covers seconds 0-3.25, panel 2 covers 3.25-6.5, panel 3 covers 6.5-9.75, panel 4 covers 9.75-13.
3. Soundjata identity MUST match refs across panels 1, 2, 4 - same face, braided hair. Allow slight maturation between panel 1 (young exile) and panels 2/4 (7 years later, slight beard OK).
4. Authentic 13th century West African Mande setting: handwoven cotton, indigo and terracotta dyes, leather, cowrie shells. No modern elements.
5. NO additional characters beyond those in the storyboard and refs. No extra villagers close-up, no crowds.
6. Panel 4 ending: messenger bows/kneels before Soundjata. Soundjata reacts with dignity - moment of realization, not triumph (triumph is for next clip).

Color grade: warm ochre for panels 1 (departure golden sunset), warm earth tones for panel 2 (Mema daylight), dust-golden for panel 3 (galloping), soft evening tones for panel 4 (arrival).

No text, no banners, no signs, no writing visible anywhere.
```

---

## Workflow session prochaine (ordre exact)

1. **Lire ce brief** en premier lieu
2. **Régénérer le storyboard 4 panels** via script Gemini (modèle similaire à `regen-soundjata-acte1-storyboard-v5.py`) — prompt à adapter pour les 4 panels ci-dessus + 5 refs comme inputs
3. **Review visuelle** du storyboard par Claude + Aziz → valider ou ajuster
4. (Optionnel) envoyer à Kimi pour 2e regard narratif (~$0.02)
5. **Preview-before-pay** : montrer à Aziz le Visual Plan complet (refs + prompt + paramètres + coût) AVANT tout appel Seedance
6. **Génération Seedance** après Aziz "go" — coût $3.90
7. **Self-review** : extraire 4 frames, générer montage, vérifier identité Soundjata + cohérence narrative
8. **Mix keep-and-duck** avec narration ElevenLabs (segment 48.44s-61.44s = 13s environ, vérifier mapping exact)
9. **Upload Vercel Blob** pour validation Aziz mobile
10. **Si validé** → intégrer Clip 1 + Clip 2 dans composition Remotion (Clip 1 suivi de Clip 2)

---

## Intégration finale Clip 1 + Clip 2

Une fois Clip 1 validé :
- **Clip 1** : 13s (sous-scènes exil + mema + messagers)
- **Clip 2** : 5.04s (lion revient déjà validé)
- **Total Acte IV** : 18.04s vs narration 16.44s = **1.6s de respiration supplémentaire** (le clip 2 se termine après la phrase "Le lion du Manden revient", silence tenu avec ambiance + musique → transition vers Acte V Kirina)

Attention : la narration du Clip 1 couvre 48.44s → 61.44s = 13s pile. La narration du Clip 2 couvre 63.32s → 64.88s = 1.56s. Il y a un **gap de 1.88s** entre la fin de Clip 1 et le début de narration Clip 2. Dans la composition Remotion, ce gap peut être :
- Soit comblé par une transition visuelle (fade court, ou prolongation du panel 4 du Clip 1)
- Soit laissé comme silence tenu si ambiance cohérente

À décider en Stage 5 (composition Remotion).

---

## Budget restant

- Budget fal.ai après Acte I v2 = $46.40
- Coût Acte IV Clip 1 = $3.90 + $0.08 storyboard + éventuel $0.02 Kimi = ~$4.00
- Budget après Acte IV = ~$42.40

---

## Règles fraîches à appliquer (découvertes session 2026-04-16)

Toutes documentées dans `memory/tools/seedance-storyboard-technique.md` (règles 20, 21, 22) et `.claude/agent-memory/visual-producer/MEMORY.md` :

1. **Densité panels** : 4-5 panels par défaut pour narratif contemplatif multi-beats (pas 9)
2. **Seedance = collaborateur créatif** : prompt minimaliste, laisser Seedance interpréter
3. **Seedance extrait mots du prompt** pour lip-sync : mentionner "Soundjata", "Mema" dans le prompt renforce audio
4. **Refs multiples IMPERATIF** : jamais 1 seule ref, empiler storyboard + toutes char refs canons
5. **Corrections chirurgicales** : si ajustement demandé, ne PAS réécrire from scratch
6. **Anti-hallucination** : vérifier chaque fait (chemin, endpoint, narration, identité) AVANT d'écrire
7. **Nettoyer pensées internes** : relire avant livraison

---

## Fichiers-clés à référencer en session

| Fichier | Usage |
|---|---|
| Ce brief | `memory/brief-soundjata-acte4-clip1.md` |
| Timings Whisper | `src/projects/geoafrique-shorts/timing-soundjata.ts` (scenes IV_exilRetour) |
| Script Seedance modèle | `scripts/tools/seedance-acte1-final.py` (adapter duration + refs + prompt) |
| Script storyboard modèle | `scripts/tools/regen-soundjata-acte1-storyboard-v5.py` (adapter pour 4 panels Acte IV) |
| Narration complète | `public/assets/library/geoafrique/heros-oublies/soundjata/audio/narration-full.mp3` |
| Dossier refs Acte IV | `public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4/` |
| Clips validés Acte IV | `public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated/acte4-clip2-lion-revient-v1.mp4` |

---

## Résumé 1-phrase

Générer un clip Seedance 13s (4 panels : exil, Mema, messagers, agenouillement) à partir des 5 refs existantes, prompt minimaliste, coût ~$4, à intégrer avant le Clip 2 déjà validé (Lion revient 5s) pour reconstituer l'Acte IV complet de 18.04s.
