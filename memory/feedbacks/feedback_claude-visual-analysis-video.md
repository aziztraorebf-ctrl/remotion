# Claude analyse vidéo — fiabilité limitée

**Regle** : Ne pas presenter l'analyse de frames video de Claude comme des faits. Toujours signaler l'incertitude et attendre confirmation Aziz avant d'agir sur l'analyse.

**Why:** Test Seedance Beat 2 Hannibal (2026-05-05) : Claude a detecte "texte parasite sur les planches du radeau" (FAUX — aucun texte, Aziz a confirme), et compte 3 Volques sur la falaise (FAUX — 2 Volques, Aziz a confirme). Deux erreurs de lecture dans le meme clip.

**How to apply:**
- Apres generation d'une image/video : indiquer ce qu'on CROIT voir, pas ce qu'on VOIT ("il me semble que", "on dirait", "je compte X mais ce n'est pas certain")
- Avant de signaler un defaut visuel comme bloquant, demander a Aziz de confirmer
- Ne JAMAIS ecrire "j'observe [defaut] dans la video" si la confiance n'est pas elevee
- Pour les decomptes de personnages, toujours signaler le niveau de confiance ("je vois au moins 2, peut-etre 3 personnages")
- Kimi K2.5 est plus fiable que Claude pour l'analyse d'artefacts techniques sur des frames — delever les doutes a Kimi plutot que d'affirmer

Note (2026-08-31) : le modèle Kimi de référence a évolué depuis (K3 uniquement, cf CLAUDE.md § modèles
verrouillés) — le principe "déléguer les doutes visuels à un modèle vision spécialisé plutôt que
d'affirmer" reste valable, la variante Kimi précise est à vérifier contre le tableau verrouillé courant.

---
Migré depuis auto-memory (`feedback_claude-visual-analysis-video.md`) le 2026-08-31, contenu original
inchangé.
