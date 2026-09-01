# Atlas — Workflow Gemini composite + Seedance i2v (validé Beat 2 Hannibal)

> Migré depuis auto-memory 2026-08-31 (modifié 2026-08-20, épisode Hannibal désormais archivé).
> Pipeline pour scènes d'action géo en pixel art. Complète `memory/tools/motion-reference-transfer.md`
> (reference-to-video) avec l'approche INVERSE : composer l'image de départ complète, puis laisser
> Seedance animer seulement (pas positionner).

## Workflow validé : Gemini composite → Seedance i2v

**Quand l'utiliser :** scène d'action géo (traversée, bataille, mouvement) impossible à rendre dramatiquement en 2D SVG carte. Max 10-15s.

**Pourquoi ça marche :** Seedance n'a pas à placer les personnages — ils sont déjà dans l'image de départ. Il ne fait qu'animer. Zéro morphing, zéro dérive de style, cohérence 100%.

### Étapes

1. **Générer le background vide** via PixelLab `create_map_object` ou Gemini (environnement sans personnages)
2. **Composer l'image de départ** via Gemini `IMAGE_MODEL` (Lite — cette image n'est qu'une SOURCE pour Seedance i2v, jamais publiée telle quelle ; ⛔ importer depuis `scripts/tools/gemini_models.py`, jamais en dur) avec :
   - Image 1 : background vide (style anchor)
   - Image 2 : asset principal (éléphant, cheval, etc.)
   - Image 3 : personnage leader
   - Image 4 : personnages secondaires
   - Prompt : placer TOUS les éléments à leurs positions initiales, anti-neige/anti-dérive selon le sujet
3. **Valider l'image composite** avec Aziz avant de lancer Seedance
4. **Écrire le prompt Seedance i2v** — déléguer au visual-producer (cf `memory/feedbacks/feedback_claude-delegation-stricte.md`). Règles critiques :
   - Décrire par POSITION dans l'image, jamais par nom ("armored warrior at the LEFT SIDE of the large raft", pas le nom du personnage)
   - Quel radeau/objet = "the LARGE raft center-left", "the SMALLER raft to the right"
   - Chaque zone géographique a son propre verbe d'action (principe R-DYNAMIC, cf `memory/tools/seedance-rules.md`)
   - Camera STEADY (explicite une seule fois en début, pas répété)
   - Format SECONDS 0-3 / 3-6 / 6-10 pour 10s
   - Donner des actions spécifiques aux personnages secondaires (sinon mannequins) — ex: "one STEPS forward to the edge", "LEANS forward", pas juste "stand"
   - Pour le 2e plan (arrière-plan) : décrire ses mouvements explicitement aussi, sinon Seedance l'ignore
5. **Endpoint i2v :** `fal-ai/bytedance/seedance-2.0/image-to-video` — UNE seule image source, pas de refs séparées
6. **Post-production audio :** garder SFX Seedance (volume 0.3) + overlay narration ElevenLabs (volume 1.0) via deux pistes Audio Remotion (keep & duck)

### Leçons Beat 2 Hannibal (2026-05-05)

**Ce qui a marché :**
- Style pixel art 16-bit maintenu 100% du début à la fin
- Eau animée convaincante (Seedance excelle sur les textures liquides)
- Cape du personnage principal animée naturellement
- Ciel et arbres animés si demandé explicitement
- Personnages de l'image composite reconnaissables et stables

**Ce qui peut être amélioré :**
- Soldats secondaires trop statiques → donner un verbe d'action distinct à chaque groupe, pas juste "hold"
- 2e éléphant (arrière-plan) peu animé → "DRIFTS slowly" trop vague, préciser la tête qui oscille + les oreilles
- Synchronisation lances malgré "not in unison" → Seedance ignore parfois les contraintes de désynchronisation. Contournement : décrire des actions différentes par groupe plutôt que "not in unison"

**Règle sur la longueur du prompt :**
- ~1 800 caractères = bon équilibre
- "Camera HOLDS STEADY" : une seule fois en début, pas répété à chaque segment
- "river continues to flow" : ne pas répéter, implicite après la première mention

**Why:** Approche r2v (refs séparées + background) échouait car Seedance devait positionner les personnages lui-même → mauvais placement, drift. Approche i2v avec composite Gemini = Seedance anime seulement = résultat stable.

**How to apply:** Pour tout beat Atlas avec action géo (traversée, bataille, marche d'armée), utiliser ce pipeline. Pour les scènes carte statiques (lieux, empires), rester sur SVG Remotion.
