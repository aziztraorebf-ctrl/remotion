# Prompt de reprise — Test styles MiniMax H3 (canada-red-bay)

Colle ce prompt en début de prochaine session pour reprendre exactement où on s'est arrêté.

---

On a testé et VALIDÉ 2 styles Higgsfield Explainer avec MiniMax H3 (Hand Drawn, Poster Vector) — workflow complet documenté dans `memory/tools/minimax-h3-styles-tests.md` (sommaire général : `memory/tools/minimax.md`). Résultats consolidés dans `memory/episodes/_rnd/canada-red-bay/reference-styles-h3/` — LIRE LE README EN PREMIER (contient une correction d'étiquetage importante sur les 3 vidéos de référence Aziz).

**Ce qui reste à faire** :
1. **Whiteboard Doodle** — jamais testé. Référence prête dans `reference-styles-h3/whiteboard-doodle/`. Appliquer le même workflow validé (480p pour la direction → 720p ou upscale ByteDance 1080p pour la finition), format de prompt H3 officiel (`integrated_multimodal_description`, voir `memory/tools/minimax-h3-styles-tests.md` § "FORMAT DE PROMPT OFFICIEL" en tête de fichier, corrigé le 2026-08-14 — NE PLUS utiliser le format 6-sections `subject_definitions`/`retention_analysis`).
2. **Hand Drawn grayscale (2e variante)** — optionnel, découvert par erreur d'étiquetage. Référence dans `reference-styles-h3/hand-drawn-grayscale-untested/`. Différent du Hand Drawn sépia/encre couleur déjà validé.

**Workflow standard confirmé (à réutiliser tel quel)** :
1. 480p pour itérer la direction (mouvement, pose, timing) — rapide, jetable
2. Dès la direction validée → régénérer en 720p natif
3. Si besoin de finition → upscale post-génération 720p→1080p via ByteDance Upscaler (`scripts/tools/fal-bytedance-upscale-video.py`, ~$0.007/s, mode normal suffit — le mode pro n'a montré aucune différence perceptible sur du flat design)

**Leçons clés à ne pas re-découvrir** :
- Toujours visionner une référence vidéo à intervalles denses (~0.5s) sur toute sa durée avant de conclure sur son mécanisme réel — un échantillonnage espacé fait rater les beats de montage rapides (split-screen, cuts).
- Ne jamais faire porter 2 faits narratifs distincts à un seul plan (ex: un objet qui change d'état ET une réaction à ce changement) — établir le nouvel état comme fixe dans l'image de départ, PUIS scénariser uniquement la réaction.
- Préférer une direction d'acteur sobre à un geste-cliché ("shocked" → le modèle choisit souvent le plus dramatique si non bridé).
- Pour un sujet qui doit "vivre" après matérialisation (pas rester figé une fois apparu) : `partially_preserved` + clause de micro-mouvement répétée dans chaque tranche temporelle, pas `fully_preserved`.
- Juger le mouvement subtil sur la vidéo EN MOUVEMENT, pas seulement sur des frames extraites espacées — le jugement humain (Aziz) a plusieurs fois corrigé une lecture erronée faite sur frames figées.

**Piste non testée identifiée par Aziz** : pour équilibrer la "vie" entre plusieurs sujets qui apparaissent dans un split-screen, partir de 3 cases VIDES dès l'image de départ (aucun personnage présent, même celui qui reste stable) plutôt que d'avoir un sujet déjà présent dès le départ — hypothèse que ça donne plus de temps à l'écran à chaque sujet pour montrer sa vie propre.
